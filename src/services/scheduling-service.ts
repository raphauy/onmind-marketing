import { prisma } from "@/lib/prisma"
import {
  buildFullCaption,
  publishReelToInstagram,
  publishToInstagram,
} from "./instagram-service"
import {
  fromZonedTime,
  isValidSchedule,
  toZonedTimeUY,
  UY_TZ,
} from "@/lib/dates"

const MAX_ATTEMPTS = 5
const CRON_BATCH_SIZE = 10
// Time budget para una corrida del cron. La function tiene maxDuration=300s
// (Vercel Pro). Un Reel puede tardar hasta ~180s en publicarse (procesamiento
// de video en Graph API). Salimos del loop al rozar este budget para no caer
// en timeout: las publications restantes quedan PENDING y se reintentan en
// la próxima corrida (catch-up por scheduledAt <= now).
const CRON_TIME_BUDGET_MS = 4 * 60 * 1000 // 4 min de 5

export type PublishRunResult = {
  attempted: number
  published: number
  failed: number
  retrying: number
  errors: { publicationId: string; error: string }[]
}

export async function schedulePiece(pieceId: string, scheduledAt: Date) {
  if (!isValidSchedule(scheduledAt)) {
    throw new Error("Fecha inválida: debe ser futura y en hora en punto")
  }

  const piece = await prisma.piece.findUniqueOrThrow({
    where: { id: pieceId },
    include: { publications: { where: { platform: "instagram" } } },
  })

  if (piece.status !== "APPROVED") {
    throw new Error(`No se puede programar en status ${piece.status}`)
  }

  if (piece.publications.some((p) => p.status === "PUBLISHED")) {
    throw new Error("Esta pieza ya fue publicada en Instagram")
  }

  return prisma.$transaction(async (tx) => {
    const publication = await tx.publication.create({
      data: {
        pieceId: piece.id,
        platform: "instagram",
        scheduledAt,
        status: "PENDING",
      },
    })

    await tx.piece.update({
      where: { id: piece.id },
      data: { status: "SCHEDULED" },
    })

    return publication
  })
}

export async function reschedulePiece(pieceId: string, scheduledAt: Date) {
  if (!isValidSchedule(scheduledAt)) {
    throw new Error("Fecha inválida: debe ser futura y en hora en punto")
  }

  const piece = await prisma.piece.findUniqueOrThrow({
    where: { id: pieceId },
    include: {
      publications: {
        where: { platform: "instagram", status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (piece.status !== "SCHEDULED") {
    throw new Error(`No se puede reprogramar en status ${piece.status}`)
  }

  const pending = piece.publications[0]
  if (!pending) {
    throw new Error("No hay publicación pendiente para reprogramar")
  }

  return prisma.publication.update({
    where: { id: pending.id },
    data: { scheduledAt, lastError: null, attempts: 0 },
  })
}

export async function unschedulePiece(pieceId: string) {
  const piece = await prisma.piece.findUniqueOrThrow({
    where: { id: pieceId },
    include: {
      publications: { where: { platform: "instagram", status: "PENDING" } },
    },
  })

  if (piece.status !== "SCHEDULED") {
    throw new Error(`No se puede cancelar programación en status ${piece.status}`)
  }

  return prisma.$transaction(async (tx) => {
    await tx.publication.deleteMany({
      where: {
        pieceId: piece.id,
        platform: "instagram",
        status: "PENDING",
      },
    })

    await tx.piece.update({
      where: { id: piece.id },
      data: { status: "APPROVED" },
    })
  })
}

/**
 * Ejecutada por el cron cada hora. Publica todas las Publications PENDING
 * cuyo scheduledAt ya venció. Procesamiento secuencial para evitar rate limits.
 *
 * Catch-up: si el cron no corrió o Graph API falló, en la siguiente corrida
 * `scheduledAt <= now` sigue siendo true y se reintenta.
 */
export async function publishDuePublications(): Promise<PublishRunResult> {
  const now = new Date()

  const due = await prisma.publication.findMany({
    where: {
      platform: "instagram",
      status: "PENDING",
      scheduledAt: { lte: now },
      attempts: { lt: MAX_ATTEMPTS },
    },
    orderBy: { scheduledAt: "asc" },
    take: CRON_BATCH_SIZE,
    include: {
      piece: true,
    },
  })

  const result: PublishRunResult = {
    attempted: due.length,
    published: 0,
    failed: 0,
    retrying: 0,
    errors: [],
  }

  const startedAt = Date.now()

  for (const pub of due) {
    // Early exit si rozamos el budget de la function. Las publicaciones que
    // queden sin tocar siguen PENDING y entran al próximo cron por catch-up.
    if (Date.now() - startedAt > CRON_TIME_BUDGET_MS) {
      console.log(
        `[cron] time budget alcanzado (${Math.round(
          (Date.now() - startedAt) / 1000
        )}s); ${result.attempted - result.published - result.failed - result.retrying} publication(es) quedan para la próxima corrida`
      )
      break
    }

    const piece = pub.piece

    if (!piece.imageUrl) {
      await prisma.publication.update({
        where: { id: pub.id },
        data: {
          status: "FAILED",
          attempts: { increment: 1 },
          lastError: "La pieza no tiene imagen generada",
        },
      })
      await prisma.piece.update({
        where: { id: piece.id },
        data: { status: "FAILED" },
      })
      result.failed++
      result.errors.push({ publicationId: pub.id, error: "Sin imagen" })
      continue
    }

    await prisma.publication.update({
      where: { id: pub.id },
      data: { status: "PUBLISHING", attempts: { increment: 1 } },
    })

    try {
      const caption = buildFullCaption(piece)
      const igMediaId = piece.videoUrl
        ? await publishReelToInstagram(piece.videoUrl, caption, {
            coverUrl: piece.imageUrl,
          })
        : await publishToInstagram(piece.imageUrl, caption)

      await prisma.publication.update({
        where: { id: pub.id },
        data: {
          status: "PUBLISHED",
          platformId: igMediaId,
          publishedAt: new Date(),
          lastError: null,
        },
      })
      await prisma.piece.update({
        where: { id: piece.id },
        data: { status: "PUBLISHED" },
      })
      result.published++
    } catch (error) {
      const message = (error as Error).message || "Error desconocido"
      const newAttempts = pub.attempts + 1
      const isFinalFailure = newAttempts >= MAX_ATTEMPTS

      await prisma.publication.update({
        where: { id: pub.id },
        data: {
          status: isFinalFailure ? "FAILED" : "PENDING",
          lastError: message,
        },
      })

      if (isFinalFailure) {
        await prisma.piece.update({
          where: { id: piece.id },
          data: { status: "FAILED" },
        })
        result.failed++
      } else {
        result.retrying++
      }
      result.errors.push({ publicationId: pub.id, error: message })
    }
  }

  return result
}

export type TomorrowCheckResult = {
  missingDays: string[]
  todayCount: number
  tomorrowCount: number
}

// Devuelve el inicio del día UY (00:00 hora UY) en UTC para un offset en días.
// dayOffset=0 → hoy en UY; dayOffset=1 → mañana en UY.
function startOfUYDayUTC(dayOffset: number): Date {
  const nowUY = toZonedTimeUY(new Date())
  const local = new Date(
    nowUY.getFullYear(),
    nowUY.getMonth(),
    nowUY.getDate() + dayOffset,
    0,
    0,
    0,
    0
  )
  return fromZonedTime(local, UY_TZ)
}

/**
 * Chequea si hay alguna Publication de Instagram programada para hoy y/o
 * mañana en hora UY. Devuelve qué días están vacíos.
 *
 * Cuenta cualquier Publication con scheduledAt dentro del día (PENDING,
 * PUBLISHING, PUBLISHED). Si ya se publicó en el día, ese día queda cubierto.
 * Las FAILED no cuentan.
 */
export async function checkInstagramCoverageNextTwoDays(): Promise<TomorrowCheckResult> {
  const todayStart = startOfUYDayUTC(0)
  const tomorrowStart = startOfUYDayUTC(1)
  const dayAfterStart = startOfUYDayUTC(2)

  const [todayCount, tomorrowCount] = await Promise.all([
    prisma.publication.count({
      where: {
        platform: "instagram",
        status: { not: "FAILED" },
        scheduledAt: { gte: todayStart, lt: tomorrowStart },
      },
    }),
    prisma.publication.count({
      where: {
        platform: "instagram",
        status: { not: "FAILED" },
        scheduledAt: { gte: tomorrowStart, lt: dayAfterStart },
      },
    }),
  ])

  const missingDays: string[] = []
  if (todayCount === 0) missingDays.push("hoy")
  if (tomorrowCount === 0) missingDays.push("mañana")

  return { missingDays, todayCount, tomorrowCount }
}
