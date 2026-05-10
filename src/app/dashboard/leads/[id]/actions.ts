"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import {
  addNote,
  addSystemActivity,
  deleteLead,
  updateLead,
  updateLeadOwner,
  updateLeadStatus,
} from "@/services/lead-service"
import {
  getTemplateForUser,
  interpolate,
  PURPOSE_LABEL,
} from "@/services/message-template-service"
import {
  bookingPublicUrl,
  getBookingByLeadId,
  getOrCreateBooking,
  markCalendarEventCreated,
} from "@/services/booking-service"
import { getRulesForUser } from "@/services/availability-service"
import { BROCHURE_URL } from "@/lib/leads-config"
import {
  LeadSource,
  LeadStatus,
  MessageTemplateChannel,
  MessageTemplatePurpose,
} from "@prisma/client"

const SUPERUSER_EMAIL = "rapha.uy@rapha.uy"

const updateLeadSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.nativeEnum(LeadSource),
  businessType: z.string().optional(),
})

export type UpdateLeadState = {
  ok?: boolean
  error?: string
}

export async function updateLeadAction(
  _prev: UpdateLeadState,
  formData: FormData
): Promise<UpdateLeadState> {
  const parsed = updateLeadSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    source: formData.get("source"),
    businessType: formData.get("businessType") || undefined,
  })

  if (!parsed.success) {
    return { error: "Datos inválidos" }
  }

  const { id, ...rest } = parsed.data

  await updateLead(id, {
    name: rest.name,
    email: rest.email,
    phone: rest.phone || null,
    source: rest.source,
    businessType: rest.businessType || null,
  })

  revalidatePath(`/dashboard/leads/${id}`)
  revalidatePath("/dashboard/leads")
  return { ok: true }
}

export async function changeStatusAction(
  leadId: string,
  newStatus: LeadStatus
) {
  const session = await auth()
  await updateLeadStatus(leadId, newStatus, session?.user?.id)
  revalidatePath(`/dashboard/leads/${leadId}`)
  revalidatePath("/dashboard/leads")
  // El cambio de estado resuelve follow-ups activos; el panel debe reflejarlo.
  revalidatePath("/dashboard/leads/seguimiento")
}

export async function changeOwnerAction(
  leadId: string,
  newOwnerUserId: string | null
) {
  const session = await auth()
  await updateLeadOwner(leadId, newOwnerUserId, session?.user?.id)
  revalidatePath(`/dashboard/leads/${leadId}`)
  revalidatePath("/dashboard/leads")
}

export type GenerateBookingLinkResult =
  | { ok: true; url: string }
  | { ok: false; error: string }

export async function generateBookingLinkAction(
  leadId: string
): Promise<GenerateBookingLinkResult> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: "Sesión inválida" }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  })
  if (!lead) return { ok: false, error: "Lead no encontrado" }
  if (!lead.ownerUserId) {
    return {
      ok: false,
      error: "Asigná un owner al lead antes de generar el link",
    }
  }

  // Si el owner no tiene plantilla semanal configurada, no se puede generar el link.
  const rules = await getRulesForUser(lead.ownerUserId)
  if (rules.length === 0) {
    const ownerLabel = lead.owner?.name || lead.owner?.email || "El owner"
    return {
      ok: false,
      error: `${ownerLabel} todavía no configuró su disponibilidad. Pedile que la cargue en "Disponibilidad" antes de generar el link.`,
    }
  }

  const booking = await getOrCreateBooking({
    leadId: lead.id,
    ownerUserId: lead.ownerUserId,
  })

  await addSystemActivity(
    leadId,
    "Link de booking generado",
    session.user.id
  )

  revalidatePath(`/dashboard/leads/${leadId}`)
  return { ok: true, url: bookingPublicUrl(booking.token) }
}

export async function markCalendarEventCreatedAction(bookingId: string) {
  const session = await auth()
  if (!session?.user?.id) return
  await markCalendarEventCreated(bookingId)
  revalidatePath(`/dashboard/leads`)
}

export type DeleteLeadResult =
  | { ok: true }
  | { ok: false; error: string }

// Eliminar un lead es destructivo: borra LeadActivity, LeadFollowUp y Booking.
// Por ahora solo el superuser definido en SUPERUSER_EMAIL puede hacerlo.
// El redirect lo hace el cliente con router.push después del ok:true.
export async function deleteLeadAction(
  leadId: string
): Promise<DeleteLeadResult> {
  const session = await auth()
  if (!session?.user?.email) {
    return { ok: false, error: "Sesión inválida" }
  }
  if (session.user.email !== SUPERUSER_EMAIL) {
    return { ok: false, error: "No tenés permiso para eliminar leads" }
  }

  await deleteLead(leadId)
  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard/leads/seguimiento")
  return { ok: true }
}

export type ResolveTemplateResult =
  | { ok: true; subject: string | null; body: string; waUrl: string | null }
  | { ok: false; error: string }

// Resuelve un template del usuario logueado interpolado con datos del lead.
// Registra LeadActivity SYSTEM para trazabilidad. El client lo copia al clipboard.
export async function resolveTemplateForLeadAction(
  leadId: string,
  channel: MessageTemplateChannel,
  purpose: MessageTemplatePurpose
): Promise<ResolveTemplateResult> {
  const session = await auth()
  if (!session?.user?.id) return { ok: false, error: "Sesión inválida" }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { id: true, name: true, phone: true },
  })
  if (!lead) return { ok: false, error: "Lead no encontrado" }

  const template = await getTemplateForUser(session.user.id, channel, purpose)

  // Si el lead ya tiene un Booking, interpolamos su URL pública.
  const booking = await getBookingByLeadId(leadId)
  const linkBooking = booking ? bookingPublicUrl(booking.token) : ""
  const vars = {
    nombre: lead.name,
    linkBooking,
    linkBrochure: BROCHURE_URL,
  }
  const subject = template.subject
    ? interpolate(template.subject, vars)
    : null
  const body = interpolate(template.body, vars)

  let waUrl: string | null = null
  if (channel === "WHATSAPP" && lead.phone) {
    const cleaned = lead.phone.replace(/[^\d]/g, "")
    if (cleaned) {
      waUrl = `https://wa.me/${cleaned}?text=${encodeURIComponent(body)}`
    }
  }

  await addSystemActivity(
    leadId,
    `Copió ${channel === "EMAIL" ? "email" : "WhatsApp"} · ${PURPOSE_LABEL[purpose]}`,
    session.user.id
  )

  revalidatePath(`/dashboard/leads/${leadId}`)
  return { ok: true, subject, body, waUrl }
}

export type AddNoteState = {
  ok?: boolean
  error?: string
}

export async function addNoteAction(
  _prev: AddNoteState,
  formData: FormData
): Promise<AddNoteState> {
  const session = await auth()
  const leadId = formData.get("leadId") as string
  const message = (formData.get("message") as string) || ""

  if (!leadId || !message.trim()) {
    return { error: "La nota no puede estar vacía" }
  }

  await addNote(leadId, message, session?.user?.id)
  revalidatePath(`/dashboard/leads/${leadId}`)
  return { ok: true }
}
