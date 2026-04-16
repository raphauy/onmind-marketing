"use server"

import {
  getPieceBySlug,
  updatePieceStatus,
  updatePiece,
  softDeletePiece,
  restorePiece,
  setActiveGeneration,
} from "@/services/piece-service"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { generatePieceImage } from "@/services/generation-service"
import { revalidatePath } from "next/cache"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function generatePieceAction(
  slug: string
): Promise<ActionResult<{ imageUrl: string }>> {
  try {
    const piece = await getPieceBySlug(slug)
    if (!piece) return { success: false, error: "Pieza no encontrada" }
    if (piece.status !== "DRAFT" && piece.status !== "FAILED" && piece.status !== "GENERATED") {
      return { success: false, error: `No se puede generar en status ${piece.status}` }
    }

    const result = await generatePieceImage(piece.id)

    revalidatePath(`/dashboard/piezas/${slug}`)
    revalidatePath("/dashboard/piezas")
    return { success: true, data: { imageUrl: result.imageUrl } }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function approvePieceAction(
  slug: string
): Promise<ActionResult> {
  try {
    const piece = await getPieceBySlug(slug)
    if (!piece) return { success: false, error: "Pieza no encontrada" }
    if (piece.status !== "GENERATED") {
      return { success: false, error: `No se puede aprobar en status ${piece.status}` }
    }

    await updatePieceStatus(piece.id, "APPROVED")

    revalidatePath(`/dashboard/piezas/${slug}`)
    revalidatePath("/dashboard/piezas")
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function updatePieceAction(
  slug: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const piece = await getPieceBySlug(slug)
    if (!piece) return { success: false, error: "Pieza no encontrada" }

    const fieldValues: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("field_")) {
        fieldValues[key.replace("field_", "")] = value as string
      }
    }

    const pillarRaw = formData.get("pillar") as string
    const topic = (formData.get("topic") as string) || null
    const caption = (formData.get("caption") as string) || null
    const hashtagsRaw = formData.get("hashtags") as string
    const hashtags = hashtagsRaw
      ? hashtagsRaw.split(",").map((h) => h.trim()).filter(Boolean)
      : []

    await updatePiece(piece.id, {
      fieldValues: Object.keys(fieldValues).length > 0 ? fieldValues : undefined,
      pillar: pillarRaw || null,
      topic,
      caption,
      hashtags,
    })

    revalidatePath(`/dashboard/piezas/${slug}`)
    revalidatePath("/dashboard/piezas")
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function setActiveGenerationAction(
  slug: string,
  generationId: string
): Promise<ActionResult> {
  try {
    const piece = await getPieceBySlug(slug)
    if (!piece) return { success: false, error: "Pieza no encontrada" }

    await setActiveGeneration(piece.id, generationId)

    revalidatePath(`/dashboard/piezas/${slug}`)
    revalidatePath("/dashboard/piezas")
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

export async function deletePieceAction(
  slug: string
): Promise<ActionResult> {
  try {
    const piece = await getPieceBySlug(slug)
    if (!piece) return { success: false, error: "Pieza no encontrada" }

    const session = await auth()
    await softDeletePiece(piece.id, session?.user?.id)
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }

  redirect("/dashboard/piezas")
}

export async function restorePieceAction(
  slug: string
): Promise<ActionResult> {
  try {
    const piece = await getPieceBySlug(slug)
    if (!piece) return { success: false, error: "Pieza no encontrada" }

    await restorePiece(piece.id)

    revalidatePath(`/dashboard/piezas/${slug}`)
    revalidatePath("/dashboard/piezas")
    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
