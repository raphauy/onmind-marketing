"use server"

import { createPiece } from "@/services/piece-service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createPieceAction(formData: FormData) {
  const templateId = formData.get("templateId") as string
  const pillarRaw = formData.get("pillar") as string
  const pillar = pillarRaw || undefined
  const topic = (formData.get("topic") as string) || undefined
  const caption = (formData.get("caption") as string) || undefined
  const hashtagsRaw = formData.get("hashtags") as string
  const hashtags = hashtagsRaw
    ? hashtagsRaw.split(",").map((h) => h.trim()).filter(Boolean)
    : undefined

  // Collect field values from form data (keys prefixed with "field_")
  const fieldValues: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("field_")) {
      fieldValues[key.replace("field_", "")] = value as string
    }
  }

  const piece = await createPiece({
    templateId,
    fieldValues,
    pillar,
    topic,
    caption,
    hashtags,
  })

  revalidatePath("/dashboard/piezas")
  redirect(`/dashboard/piezas/${piece.slug}`)
}
