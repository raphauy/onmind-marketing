"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { reserveSlot } from "@/services/booking-service"

const schema = z.object({
  token: z.string().min(8),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
})

export type ReserveResult =
  | { ok: true; whenIso: string }
  | { ok: false; error: string }

export async function reserveSlotAction(input: {
  token: string
  startsAt: string
  endsAt: string
}): Promise<ReserveResult> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Datos inválidos" }

  const result = await reserveSlot({
    token: parsed.data.token,
    startsAt: new Date(parsed.data.startsAt),
    endsAt: new Date(parsed.data.endsAt),
  })

  if (!result.ok) return { ok: false, error: result.error }

  revalidatePath(`/agendar/${parsed.data.token}`)
  return { ok: true, whenIso: result.booking.startsAt.toISOString() }
}
