import { prisma } from "@/lib/prisma"
import { LeadStatus, LeadSource, LeadActivityType } from "@prisma/client"

export type LeadFilters = {
  status?: LeadStatus
}

export async function getLeads(filters?: LeadFilters) {
  return prisma.lead.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
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
      activities: {
        orderBy: { createdAt: "desc" },
        include: {
          authorUser: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })
}

export async function createLead(data: {
  name: string
  email: string
  phone?: string | null
  source?: LeadSource
  businessType?: string | null
  authorUserId?: string
}) {
  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      source: data.source ?? "WEB",
      businessType: data.businessType || null,
      status: "NEW",
    },
  })

  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      type: "SYSTEM",
      message: "Lead creado",
      authorUserId: data.authorUserId,
    },
  })

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

// Cambia el estado del lead y registra actividad.
// Si entra a IN_EVALUATION por primera vez, setea trialStartedAt.
// Si vuelve hacia atrás, NO resetea trialStartedAt (decisión de plan).
export async function updateLeadStatus(
  id: string,
  newStatus: LeadStatus,
  authorUserId?: string
) {
  const current = await prisma.lead.findUniqueOrThrow({ where: { id } })

  if (current.status === newStatus) return current

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
      message: `Estado: ${current.status} → ${newStatus}`,
      authorUserId,
    },
  })

  return updated
}

export async function addNote(
  leadId: string,
  message: string,
  authorUserId?: string
) {
  if (!message.trim()) {
    throw new Error("La nota no puede estar vacía")
  }

  return prisma.leadActivity.create({
    data: {
      leadId,
      type: "NOTE",
      message: message.trim(),
      authorUserId,
    },
  })
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
