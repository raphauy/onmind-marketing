import { z } from "zod"
import { timingSafeEqual } from "crypto"
import { prisma } from "@/lib/prisma"
import { createLead, addSystemActivity } from "@/services/lead-service"
import { LeadSource } from "@prisma/client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const payloadSchema = z.object({
  name: z.string().trim().min(1, "name requerido"),
  email: z.string().trim().email("email inválido"),
  phone: z.string().trim().optional().nullable(),
  source: z.nativeEnum(LeadSource).optional(),
  businessType: z.string().trim().optional().nullable(),
})

function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export async function POST(req: Request) {
  const expected = process.env.ONMIND_WEBHOOK_SECRET
  if (!expected) {
    console.error("[webhook/onmind/leads] ONMIND_WEBHOOK_SECRET not set")
    return Response.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 }
    )
  }

  const provided = req.headers.get("x-onmind-secret") || ""
  if (!provided || !constantTimeEqual(provided, expected)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    )
  }

  const parsed = payloadSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: "invalid_payload",
        issues: parsed.error.issues.map((i) => ({
          path: i.path,
          message: i.message,
        })),
      },
      { status: 400 }
    )
  }

  const data = parsed.data

  // Idempotencia por email: si ya existe lead con ese email, no duplicamos.
  const existing = await prisma.lead.findFirst({
    where: { email: data.email },
    orderBy: { createdAt: "desc" },
  })

  if (existing) {
    await addSystemActivity(
      existing.id,
      `Webhook OnMind recibió un ingreso duplicado para este email`
    )
    return Response.json({
      ok: true,
      duplicated: true,
      leadId: existing.id,
    })
  }

  const lead = await createLead({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    source: data.source ?? "WEB",
    businessType: data.businessType ?? null,
  })

  return Response.json({
    ok: true,
    duplicated: false,
    leadId: lead.id,
    ownerUserId: lead.ownerUserId ?? null,
  })
}
