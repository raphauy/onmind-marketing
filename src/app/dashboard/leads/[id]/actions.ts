"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import {
  addNote,
  updateLead,
  updateLeadStatus,
} from "@/services/lead-service"
import { LeadSource, LeadStatus } from "@prisma/client"

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
