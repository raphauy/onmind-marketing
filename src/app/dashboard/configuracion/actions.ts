"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import {
  resetTemplateToDefault,
  upsertTemplate,
} from "@/services/message-template-service"
import {
  MessageTemplateChannel,
  MessageTemplatePurpose,
} from "@prisma/client"

const saveSchema = z.object({
  channel: z.nativeEnum(MessageTemplateChannel),
  purpose: z.nativeEnum(MessageTemplatePurpose),
  subject: z.string().optional(),
  body: z.string().min(1, "El cuerpo no puede estar vacío"),
})

export type SaveTemplateState = {
  ok?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function saveTemplateAction(
  _prev: SaveTemplateState,
  formData: FormData
): Promise<SaveTemplateState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Sesión inválida" }
  }

  const parsed = saveSchema.safeParse({
    channel: formData.get("channel"),
    purpose: formData.get("purpose"),
    subject: formData.get("subject") ?? undefined,
    body: formData.get("body"),
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string") fieldErrors[key] = issue.message
    }
    return { error: "Revisá los campos", fieldErrors }
  }

  await upsertTemplate({
    userId: session.user.id,
    channel: parsed.data.channel,
    purpose: parsed.data.purpose,
    subject: parsed.data.subject,
    body: parsed.data.body,
  })

  revalidatePath("/dashboard/configuracion")
  return { ok: true }
}

export async function resetTemplateAction(
  channel: MessageTemplateChannel,
  purpose: MessageTemplatePurpose
) {
  const session = await auth()
  if (!session?.user?.id) return

  await resetTemplateToDefault({
    userId: session.user.id,
    channel,
    purpose,
  })
  revalidatePath("/dashboard/configuracion")
}
