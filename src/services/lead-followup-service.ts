import { prisma } from "@/lib/prisma"
import { differenceInCalendarDays, subDays } from "date-fns"
import {
  FollowUpResolvedBy,
  LeadStatus,
} from "@prisma/client"
import {
  FOLLOWUP_RULES,
  FOLLOWUP_TRIGGER_STATES,
} from "@/lib/leads-config"
import { sendLeadNeedsFollowUpEmail } from "@/services/email-service"
import { addSystemActivity } from "@/services/lead-service"

// Escanea leads en estados con regla de follow-up. Crea LeadFollowUp para
// los que cumplan umbral y no tengan uno activo. Notifica por email al owner.
// Retorna estadísticas para el cron.
export async function scanAndCreateFollowUps(now: Date = new Date()) {
  let created = 0
  let notified = 0

  for (const triggerState of FOLLOWUP_TRIGGER_STATES) {
    const rule = FOLLOWUP_RULES[triggerState]
    if (!rule) continue

    const cutoff = subDays(now, rule.daysSinceUpdate)

    // Leads candidatos: están en el triggerState desde antes del cutoff y no
    // tienen follow-up activo para ese estado.
    const candidates = await prisma.lead.findMany({
      where: {
        status: triggerState,
        updatedAt: { lt: cutoff },
        followUps: {
          none: { triggerState, resolvedAt: null },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    })

    for (const lead of candidates) {
      const followUp = await prisma.leadFollowUp.create({
        data: {
          leadId: lead.id,
          triggerState,
          dueAt: now,
        },
      })
      created++

      const daysSince = differenceInCalendarDays(now, lead.updatedAt)
      const statusLabel = getStatusLabelEs(triggerState)
      await addSystemActivity(
        lead.id,
        `Follow-up automático: lead lleva ${daysSince} días sin movimiento en estado ${statusLabel}`
      )

      if (lead.owner?.email) {
        try {
          await sendLeadNeedsFollowUpEmail({
            to: [lead.owner.email],
            leadId: lead.id,
            leadName: lead.name,
            statusLabel,
            daysSinceUpdate: daysSince,
            ownerName: lead.owner.name || lead.owner.email,
          })
          await prisma.leadFollowUp.update({
            where: { id: followUp.id },
            data: { notifiedAt: new Date() },
          })
          notified++
        } catch (e) {
          console.error("[scanAndCreateFollowUps] notify error:", e)
        }
      }
    }
  }

  return { created, notified }
}

// Resuelve TODOS los follow-ups activos del lead con la razón dada.
// Llamado al cambiar estado (auto), al apretar "Marcar follow-up hecho" o "Descartar".
export async function markResolvedForLead(
  leadId: string,
  resolvedBy: FollowUpResolvedBy
) {
  await prisma.leadFollowUp.updateMany({
    where: { leadId, resolvedAt: null },
    data: { resolvedAt: new Date(), resolvedBy },
  })
}

export async function markResolved(
  followUpId: string,
  resolvedBy: FollowUpResolvedBy
) {
  await prisma.leadFollowUp.update({
    where: { id: followUpId },
    data: { resolvedAt: new Date(), resolvedBy },
  })
}

// Lista los follow-ups activos. Filtro opcional por owner.
export async function listPendingFollowUps(filters?: {
  ownerUserId?: string | null
}) {
  return prisma.leadFollowUp.findMany({
    where: {
      resolvedAt: null,
      ...(filters?.ownerUserId !== undefined && {
        lead: { ownerUserId: filters.ownerUserId },
      }),
    },
    include: {
      lead: {
        include: {
          owner: { select: { id: true, name: true, email: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  })
}

// Cantidad de follow-ups activos para un owner. Para badge del sidebar.
export async function countPendingForOwner(ownerUserId: string): Promise<number> {
  return prisma.leadFollowUp.count({
    where: {
      resolvedAt: null,
      lead: { ownerUserId },
    },
  })
}

// Para indicar visualmente en kanban / detail si hay follow-up activo.
export async function getActiveFollowUpsByLeadIds(
  leadIds: string[]
): Promise<Set<string>> {
  if (leadIds.length === 0) return new Set()
  const rows = await prisma.leadFollowUp.findMany({
    where: { leadId: { in: leadIds }, resolvedAt: null },
    select: { leadId: true },
  })
  return new Set(rows.map((r) => r.leadId))
}

export async function getActiveFollowUpForLead(leadId: string) {
  return prisma.leadFollowUp.findFirst({
    where: { leadId, resolvedAt: null },
    orderBy: { createdAt: "desc" },
  })
}

export function getStatusLabelEs(status: LeadStatus): string {
  // Helper local para no acoplar el service al componente UI.
  const labels: Record<LeadStatus, string> = {
    NEW: "Nuevo",
    CONTACTED: "Contactado",
    DEMO_SCHEDULED: "Demo agendada",
    DEMO_DONE: "Demo realizada",
    IN_EVALUATION: "Primer mes",
    CUSTOMER: "Cliente",
    LOST: "Perdido",
  }
  return labels[status]
}
