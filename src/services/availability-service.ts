import { prisma } from "@/lib/prisma"
import { addDays, addMinutes, startOfDay } from "date-fns"
import { fromZonedTime, toZonedTime } from "date-fns-tz"
import { format } from "date-fns-tz"
import { UY_TZ } from "@/lib/dates"
import { SLOT_MIN, isValidTime, timeToMinutes } from "@/lib/availability-constants"

export {
  SLOT_MIN,
  DAY_LABELS,
  DAY_ORDER,
  isValidTime,
  timeToMinutes,
} from "@/lib/availability-constants"

// ── Reglas (plantilla semanal) ────────────────────────────────────

export async function getRulesForUser(userId: string) {
  return prisma.availabilityRule.findMany({
    where: { userId, active: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  })
}

export async function addRule(input: {
  userId: string
  dayOfWeek: number
  startTime: string
  endTime: string
}) {
  if (input.dayOfWeek < 0 || input.dayOfWeek > 6) {
    throw new Error("dayOfWeek inválido")
  }
  if (!isValidTime(input.startTime) || !isValidTime(input.endTime)) {
    throw new Error("Hora inválida (formato HH:mm)")
  }
  if (timeToMinutes(input.endTime) <= timeToMinutes(input.startTime)) {
    throw new Error("La hora de fin debe ser mayor a la de inicio")
  }
  return prisma.availabilityRule.create({
    data: {
      userId: input.userId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
    },
  })
}

export async function deleteRule(id: string, userId: string) {
  await prisma.availabilityRule.deleteMany({ where: { id, userId } })
}

// ── Bloqueos puntuales ───────────────────────────────────────────

export async function getBlocksForUser(
  userId: string,
  range?: { from: Date; to: Date }
) {
  return prisma.availabilityBlock.findMany({
    where: {
      userId,
      ...(range && { startsAt: { gte: range.from, lt: range.to } }),
    },
    orderBy: { startsAt: "asc" },
  })
}

export async function addBlock(input: {
  userId: string
  startsAt: Date
  endsAt: Date
  reason?: string | null
}) {
  if (input.endsAt.getTime() <= input.startsAt.getTime()) {
    throw new Error("El fin del bloqueo debe ser posterior al inicio")
  }
  return prisma.availabilityBlock.create({
    data: {
      userId: input.userId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      reason: input.reason || null,
    },
  })
}

export async function deleteBlock(id: string, userId: string) {
  await prisma.availabilityBlock.deleteMany({ where: { id, userId } })
}

// ── Cómputo de slots disponibles ─────────────────────────────────

export type Slot = { startsAt: Date; endsAt: Date }

// Construye un Date UTC a partir de una fecha local UY (yyyy-MM-dd) y hora "HH:mm".
function uyDateAt(uyDateStr: string, hh: string): Date {
  // fromZonedTime: interpreta "yyyy-MM-ddTHH:mm:ss" como hora UY y devuelve el Date UTC.
  return fromZonedTime(`${uyDateStr}T${hh}:00`, UY_TZ)
}

// Proyecta reglas semanales a slots de SLOT_MIN, en el rango [from, to) (UTC).
// Resta bloqueos puntuales y bookings CONFIRMED del owner.
// Excluye además slots cuyo startsAt sea anterior a `now` (no ofrecer pasado).
export async function computeAvailableSlots(
  userId: string,
  from: Date,
  to: Date,
  now: Date = new Date()
): Promise<Slot[]> {
  const [rules, blocks, bookings] = await Promise.all([
    getRulesForUser(userId),
    getBlocksForUser(userId, { from, to }),
    prisma.booking.findMany({
      where: {
        ownerUserId: userId,
        status: "CONFIRMED",
        startsAt: { gte: from, lt: to },
      },
      select: { startsAt: true, endsAt: true },
    }),
  ])

  if (rules.length === 0) return []

  // Bookings CONFIRMED tienen startsAt/endsAt no nulos por construcción.
  const occupied: { startsAt: Date; endsAt: Date }[] = bookings
    .filter((b) => b.startsAt && b.endsAt)
    .map((b) => ({ startsAt: b.startsAt!, endsAt: b.endsAt! }))

  const blockers = [...blocks, ...occupied]

  const rulesByDay = new Map<number, { startTime: string; endTime: string }[]>()
  for (const r of rules) {
    const arr = rulesByDay.get(r.dayOfWeek) || []
    arr.push({ startTime: r.startTime, endTime: r.endTime })
    rulesByDay.set(r.dayOfWeek, arr)
  }

  const slots: Slot[] = []
  let cursor = startOfDay(toZonedTime(from, UY_TZ))
  const end = toZonedTime(to, UY_TZ)

  while (cursor < end) {
    const dow = cursor.getDay()
    const dayRules = rulesByDay.get(dow)
    if (dayRules) {
      const uyDateStr = format(cursor, "yyyy-MM-dd", { timeZone: UY_TZ })
      for (const rule of dayRules) {
        const ruleStart = uyDateAt(uyDateStr, rule.startTime)
        const ruleEnd = uyDateAt(uyDateStr, rule.endTime)

        let slotStart = ruleStart
        while (slotStart.getTime() + SLOT_MIN * 60_000 <= ruleEnd.getTime()) {
          const slotEnd = addMinutes(slotStart, SLOT_MIN)
          if (
            slotStart.getTime() >= from.getTime() &&
            slotEnd.getTime() <= to.getTime() &&
            slotStart.getTime() >= now.getTime() &&
            !overlapsAny(slotStart, slotEnd, blockers)
          ) {
            slots.push({ startsAt: slotStart, endsAt: slotEnd })
          }
          slotStart = slotEnd
        }
      }
    }
    cursor = addDays(cursor, 1)
  }

  slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
  return slots
}

function overlapsAny(
  start: Date,
  end: Date,
  ranges: { startsAt: Date; endsAt: Date }[]
): boolean {
  for (const r of ranges) {
    if (start.getTime() < r.endsAt.getTime() && end.getTime() > r.startsAt.getTime()) {
      return true
    }
  }
  return false
}
