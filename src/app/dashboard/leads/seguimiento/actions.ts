"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import {
  markResolved,
} from "@/services/lead-followup-service"
import { addSystemActivity } from "@/services/lead-service"

// Resolver un follow-up también reinicia el cooldown del lead (lead.updatedAt
// se actualiza). Sin esto, el cron del día siguiente vería al lead todavía
// "sin movimiento" desde antes del follow-up resuelto y crearía otro.
async function resetFollowUpCooldown(leadId: string) {
  await prisma.lead.update({
    where: { id: leadId },
    data: { updatedAt: new Date() },
  })
}

export async function markFollowUpDoneAction(followUpId: string, leadId: string) {
  const session = await auth()
  await markResolved(followUpId, "USER_ACTION")
  await resetFollowUpCooldown(leadId)
  await addSystemActivity(
    leadId,
    "Follow-up marcado como hecho",
    session?.user?.id
  )
  revalidatePath("/dashboard/leads/seguimiento")
  revalidatePath(`/dashboard/leads/${leadId}`)
  revalidatePath("/dashboard/leads")
}

export async function dismissFollowUpAction(followUpId: string, leadId: string) {
  const session = await auth()
  await markResolved(followUpId, "DISMISSED")
  await resetFollowUpCooldown(leadId)
  await addSystemActivity(
    leadId,
    "Follow-up descartado",
    session?.user?.id
  )
  revalidatePath("/dashboard/leads/seguimiento")
  revalidatePath(`/dashboard/leads/${leadId}`)
  revalidatePath("/dashboard/leads")
}
