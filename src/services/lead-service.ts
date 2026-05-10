import { prisma } from "@/lib/prisma"
import { LeadStatus, LeadSource, LeadActivityType } from "@prisma/client"
import { assignNextOwnerId } from "@/services/lead-assignment-service"
import {
  sendLeadCreatedEmail,
  sendLeadStatusChangedEmail,
} from "@/services/email-service"
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_LABEL,
} from "@/components/lead-status-badge"

export type LeadFilters = {
  status?: LeadStatus
}

export async function getLeads(filters?: LeadFilters) {
  return prisma.lead.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getLeadStats() {
  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: true,
  })

  const total = await prisma.lead.count()

  const byStatus = Object.fromEntries(
    counts.map((c) => [c.status, c._count])
  ) as Record<string, number>

  return { total, byStatus }
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      activities: {
        orderBy: { createdAt: "desc" },
        include: {
          authorUser: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })
}

// Crea el lead y notifica por email a ambos socios.
// Si no se pasa ownerUserId, se asigna por round-robin par/impar.
export async function createLead(data: {
  name: string
  email: string
  phone?: string | null
  source?: LeadSource
  businessType?: string | null
  ownerUserId?: string | null
  authorUserId?: string
}) {
  const ownerUserId =
    data.ownerUserId === undefined
      ? await assignNextOwnerId()
      : data.ownerUserId

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      source: data.source ?? "WEB",
      businessType: data.businessType || null,
      status: "NEW",
      ownerUserId: ownerUserId ?? null,
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  })

  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      type: "SYSTEM",
      message: lead.owner
        ? `Lead creado · asignado a ${lead.owner.name || lead.owner.email}`
        : "Lead creado · sin owner",
      authorUserId: data.authorUserId,
    },
  })

  await notifyLeadCreated(lead.id)

  return lead
}

export async function updateLead(
  id: string,
  data: {
    name?: string
    email?: string
    phone?: string | null
    source?: LeadSource
    businessType?: string | null
  }
) {
  return prisma.lead.update({
    where: { id },
    data,
  })
}

// Cambia el owner manualmente. Registra LeadActivity con la transición.
export async function updateLeadOwner(
  id: string,
  newOwnerUserId: string | null,
  authorUserId?: string
) {
  const current = await prisma.lead.findUniqueOrThrow({
    where: { id },
    include: { owner: { select: { name: true, email: true } } },
  })

  if ((current.ownerUserId ?? null) === (newOwnerUserId ?? null)) {
    return current
  }

  const newOwner = newOwnerUserId
    ? await prisma.user.findUnique({
        where: { id: newOwnerUserId },
        select: { id: true, name: true, email: true },
      })
    : null

  const updated = await prisma.lead.update({
    where: { id },
    data: { ownerUserId: newOwnerUserId },
  })

  const fromLabel = current.owner
    ? current.owner.name || current.owner.email
    : "sin owner"
  const toLabel = newOwner ? newOwner.name || newOwner.email : "sin owner"

  await prisma.leadActivity.create({
    data: {
      leadId: id,
      type: "SYSTEM",
      message: `Owner: ${fromLabel} → ${toLabel}`,
      authorUserId,
    },
  })

  return updated
}

// Elimina el lead y, por cascade, sus LeadActivity, LeadFollowUp y Booking.
export async function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } })
}

// Cambia el estado del lead, registra actividad y dispara email al socio que NO movió.
// Si entra a IN_EVALUATION por primera vez, setea trialStartedAt.
// Si vuelve hacia atrás, NO resetea trialStartedAt.
// Resuelve cualquier LeadFollowUp activo del lead con razón STATE_CHANGE.
//
// `options.skipStatusEmail` (default false): si true, NO se dispara el email
// de cambio de estado. Útil cuando el caller ya está mandando un email más
// específico que cubre la transición (ej. "demo agendada" en booking-service).
//
// Devuelve además los labels de from/to para que el caller pueda
// referenciarlos en su propio email si quiere.
export async function updateLeadStatus(
  id: string,
  newStatus: LeadStatus,
  authorUserId?: string,
  options: { skipStatusEmail?: boolean } = {}
) {
  const current = await prisma.lead.findUniqueOrThrow({ where: { id } })

  if (current.status === newStatus) {
    return {
      lead: current,
      fromStatus: current.status,
      toStatus: newStatus,
      fromStatusLabel: LEAD_STATUS_LABEL[current.status],
      toStatusLabel: LEAD_STATUS_LABEL[newStatus],
      changed: false,
    }
  }

  const shouldSetTrialStart =
    newStatus === "IN_EVALUATION" && !current.trialStartedAt

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      status: newStatus,
      ...(shouldSetTrialStart && { trialStartedAt: new Date() }),
    },
  })

  await prisma.leadActivity.create({
    data: {
      leadId: id,
      type: "STATUS_CHANGE",
      message: `Estado: ${LEAD_STATUS_LABEL[current.status]} → ${LEAD_STATUS_LABEL[newStatus]}`,
      authorUserId,
    },
  })

  // Resolver follow-ups activos por cambio de estado.
  await prisma.leadFollowUp.updateMany({
    where: { leadId: id, resolvedAt: null },
    data: { resolvedAt: new Date(), resolvedBy: "STATE_CHANGE" },
  })

  if (!options.skipStatusEmail) {
    await notifyStatusChanged({
      leadId: id,
      leadName: current.name,
      fromStatus: current.status,
      toStatus: newStatus,
      changedByUserId: authorUserId,
    })
  }

  return {
    lead: updated,
    fromStatus: current.status,
    toStatus: newStatus,
    fromStatusLabel: LEAD_STATUS_LABEL[current.status],
    toStatusLabel: LEAD_STATUS_LABEL[newStatus],
    changed: true,
  }
}

// Agregar una nota cuenta como movimiento real del lead, así que también
// actualiza lead.updatedAt para postergar el cooldown del follow-up automático.
export async function addNote(
  leadId: string,
  message: string,
  authorUserId?: string
) {
  if (!message.trim()) {
    throw new Error("La nota no puede estar vacía")
  }

  const [activity] = await prisma.$transaction([
    prisma.leadActivity.create({
      data: {
        leadId,
        type: "NOTE",
        message: message.trim(),
        authorUserId,
      },
    }),
    prisma.lead.update({
      where: { id: leadId },
      data: { updatedAt: new Date() },
    }),
  ])

  return activity
}

export async function addSystemActivity(
  leadId: string,
  message: string,
  authorUserId?: string
) {
  return prisma.leadActivity.create({
    data: {
      leadId,
      type: LeadActivityType.SYSTEM,
      message,
      authorUserId,
    },
  })
}

// ── Notificaciones (no bloquean el flujo si fallan) ──────────────

async function notifyLeadCreated(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { owner: { select: { name: true, email: true } } },
    })
    if (!lead) return

    const recipients = await prisma.user.findMany({
      where: { isActive: true, email: { not: "" } },
      select: { email: true },
    })

    const to = recipients.map((u) => u.email).filter(Boolean)
    if (to.length === 0) return

    await sendLeadCreatedEmail({
      to,
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      leadSourceLabel: LEAD_SOURCE_LABEL[lead.source] || lead.source,
      leadBusinessType: lead.businessType,
      ownerName: lead.owner?.name || lead.owner?.email || null,
    })
  } catch (e) {
    console.error("[notifyLeadCreated] error:", e)
  }
}

async function notifyStatusChanged(input: {
  leadId: string
  leadName: string
  fromStatus: LeadStatus
  toStatus: LeadStatus
  changedByUserId?: string
}) {
  try {
    const recipients = await prisma.user.findMany({
      where: {
        isActive: true,
        email: { not: "" },
        ...(input.changedByUserId && {
          id: { not: input.changedByUserId },
        }),
      },
      select: { email: true },
    })

    const to = recipients.map((u) => u.email).filter(Boolean)
    if (to.length === 0) return

    let changedByName: string | null = null
    if (input.changedByUserId) {
      const u = await prisma.user.findUnique({
        where: { id: input.changedByUserId },
        select: { name: true, email: true },
      })
      changedByName = u?.name || u?.email || null
    }

    await sendLeadStatusChangedEmail({
      to,
      leadId: input.leadId,
      leadName: input.leadName,
      fromStatusLabel: LEAD_STATUS_LABEL[input.fromStatus],
      toStatusLabel: LEAD_STATUS_LABEL[input.toStatus],
      changedByName,
    })
  } catch (e) {
    console.error("[notifyStatusChanged] error:", e)
  }
}
