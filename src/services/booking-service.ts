import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { formatInUY } from "@/lib/dates"
import { computeAvailableSlots } from "@/services/availability-service"
import {
  addSystemActivity,
  updateLeadStatus,
} from "@/services/lead-service"
import {
  sendBookingConfirmedLeadEmail,
  sendBookingConfirmedOwnerEmail,
} from "@/services/email-service"

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  "https://marketing.onmindcrm.com"

// Genera un token URL-safe.
function generateToken(): string {
  return crypto.randomBytes(24).toString("base64url")
}

export function bookingPublicUrl(token: string): string {
  return `${APP_URL}/agendar/${token}`
}

// Idempotente: si el lead ya tiene un Booking, lo devuelve. Si no, crea uno
// PENDING con token nuevo, asignado al owner actual del lead (o al param).
export async function getOrCreateBooking(input: {
  leadId: string
  ownerUserId: string
}) {
  const existing = await prisma.booking.findUnique({
    where: { leadId: input.leadId },
  })
  if (existing) return existing

  return prisma.booking.create({
    data: {
      leadId: input.leadId,
      ownerUserId: input.ownerUserId,
      token: generateToken(),
      status: "PENDING",
    },
  })
}

export async function getBookingByLeadId(leadId: string) {
  return prisma.booking.findUnique({
    where: { leadId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      lead: { select: { id: true, name: true, email: true } },
    },
  })
}

export async function getBookingByToken(token: string) {
  return prisma.booking.findUnique({
    where: { token },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      lead: { select: { id: true, name: true, email: true } },
    },
  })
}

// Reserva un slot. Valida que esté disponible (vía availability-service) y
// que el booking esté PENDING. Persiste, transiciona Lead a DEMO_SCHEDULED,
// crea LeadActivity y dispara emails.
export async function reserveSlot(input: {
  token: string
  startsAt: Date
  endsAt: Date
}): Promise<
  | { ok: true; booking: { id: string; startsAt: Date; endsAt: Date } }
  | { ok: false; error: string }
> {
  const booking = await prisma.booking.findUnique({
    where: { token: input.token },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      lead: { select: { id: true, name: true, email: true } },
    },
  })

  if (!booking) return { ok: false, error: "Booking inexistente" }
  if (booking.status === "CONFIRMED") {
    return { ok: false, error: "Ya hay una demo agendada" }
  }
  if (booking.status === "CANCELLED") {
    return { ok: false, error: "El link fue cancelado" }
  }

  // Validar que el slot esté en la disponibilidad real del owner ahora.
  const slots = await computeAvailableSlots(
    booking.ownerUserId,
    input.startsAt,
    input.endsAt
  )
  const matches = slots.find(
    (s) =>
      s.startsAt.getTime() === input.startsAt.getTime() &&
      s.endsAt.getTime() === input.endsAt.getTime()
  )
  if (!matches) {
    return { ok: false, error: "Ese horario ya no está disponible" }
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "CONFIRMED",
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      reservedAt: new Date(),
    },
  })

  // Transición de estado a DEMO_SCHEDULED. Saltamos el email genérico de
  // cambio de estado porque ya mandamos uno específico ("Demo agendada")
  // que cubre la transición y agrega el contexto de la reserva.
  const statusResult = await updateLeadStatus(
    booking.leadId,
    "DEMO_SCHEDULED",
    undefined,
    { skipStatusEmail: true }
  )

  await addSystemActivity(
    booking.leadId,
    `Slot reservado para ${formatInUY(input.startsAt, "d/M/yyyy HH:mm")} (UY)`
  )

  // Notificaciones al owner y al lead. No bloquean si fallan.
  try {
    await sendBookingConfirmedOwnerEmail({
      to: [booking.owner.email],
      ownerName: booking.owner.name || booking.owner.email,
      leadId: booking.leadId,
      leadName: booking.lead.name,
      leadEmail: booking.lead.email,
      startsAt: input.startsAt,
      previousStatusLabel: statusResult.changed
        ? statusResult.fromStatusLabel
        : null,
    })
  } catch (e) {
    console.error("[reserveSlot] owner email error:", e)
  }

  try {
    await sendBookingConfirmedLeadEmail({
      to: [booking.lead.email],
      leadName: booking.lead.name,
      ownerName: booking.owner.name || booking.owner.email,
      startsAt: input.startsAt,
    })
  } catch (e) {
    console.error("[reserveSlot] lead email error:", e)
  }

  return {
    ok: true,
    booking: {
      id: updated.id,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    },
  }
}

// Construye una URL "Add to Google Calendar" pre-llenada con los datos del booking.
// Pide a Google que genere un Meet automático con conf=GOOGLE_MEET (cuando el user crea el evento).
export function googleCalendarUrl(input: {
  startsAt: Date
  endsAt: Date
  leadName: string
  leadEmail: string
}): string {
  // Formato yyyymmddThhmmssZ exigido por Google.
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Demo OnMind con ${input.leadName}`,
    dates: `${fmt(input.startsAt)}/${fmt(input.endsAt)}`,
    details:
      "Demo de OnMind agendada desde el flujo de onmind-marketing.\n\nGenerá el link de Meet desde Google Calendar (botón \"Agregar conferencia\") y compartilo con el lead.",
    add: input.leadEmail,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export async function markCalendarEventCreated(bookingId: string) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { calendarEventCreated: true },
  })
}
