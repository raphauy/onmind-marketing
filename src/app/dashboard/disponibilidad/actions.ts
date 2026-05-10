"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { fromZonedTime } from "date-fns-tz"
import { auth } from "@/lib/auth"
import {
  addBlock,
  addRule,
  deleteBlock,
  deleteRule,
} from "@/services/availability-service"
import { isValidTime } from "@/lib/availability-constants"
import { UY_TZ } from "@/lib/dates"

export type AddRuleState = { ok?: boolean; error?: string }

const ruleSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().refine(isValidTime, "Formato HH:mm"),
  endTime: z.string().refine(isValidTime, "Formato HH:mm"),
})

export async function addRuleAction(
  _prev: AddRuleState,
  formData: FormData
): Promise<AddRuleState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Sesión inválida" }

  const parsed = ruleSchema.safeParse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  try {
    await addRule({ userId: session.user.id, ...parsed.data })
  } catch (e) {
    return { error: (e as Error).message }
  }

  revalidatePath("/dashboard/disponibilidad")
  return { ok: true }
}

export async function deleteRuleAction(ruleId: string) {
  const session = await auth()
  if (!session?.user?.id) return
  await deleteRule(ruleId, session.user.id)
  revalidatePath("/dashboard/disponibilidad")
}

export type AddBlockState = { ok?: boolean; error?: string }

const blockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  startTime: z.string().refine(isValidTime, "Formato HH:mm"),
  endTime: z.string().refine(isValidTime, "Formato HH:mm"),
  reason: z.string().optional(),
})

export async function addBlockAction(
  _prev: AddBlockState,
  formData: FormData
): Promise<AddBlockState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Sesión inválida" }

  const parsed = blockSchema.safeParse({
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    reason: formData.get("reason") || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  // Las horas se interpretan en TZ UY y se convierten a UTC para persistir.
  const startsAt = fromZonedTime(
    `${parsed.data.date}T${parsed.data.startTime}:00`,
    UY_TZ
  )
  const endsAt = fromZonedTime(
    `${parsed.data.date}T${parsed.data.endTime}:00`,
    UY_TZ
  )

  try {
    await addBlock({
      userId: session.user.id,
      startsAt,
      endsAt,
      reason: parsed.data.reason,
    })
  } catch (e) {
    return { error: (e as Error).message }
  }

  revalidatePath("/dashboard/disponibilidad")
  return { ok: true }
}

export async function deleteBlockAction(blockId: string) {
  const session = await auth()
  if (!session?.user?.id) return
  await deleteBlock(blockId, session.user.id)
  revalidatePath("/dashboard/disponibilidad")
}
