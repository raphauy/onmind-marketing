import { prisma } from "@/lib/prisma"
import { buildFullCaption, publishToInstagram } from "./instagram-service"
import { isValidSchedule } from "@/lib/dates"

const MAX_ATTEMPTS = 5
const CRON_BATCH_SIZE = 10

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

  for (const pub of due) {
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
      const igMediaId = await publishToInstagram(piece.imageUrl, caption)

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
