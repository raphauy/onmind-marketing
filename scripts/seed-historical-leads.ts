// Carga leads históricos en la base de datos.
//
// Idempotente: si el lead ya existe (por email), se actualiza con los datos
// del array. Si no existe, se crea respetando los timestamps reales.
// Por cada lead se registra una LeadActivity SYSTEM "Lead histórico importado".
//
// Uso:
//   npx tsx scripts/seed-historical-leads.ts             # dry run (default)
//   npx tsx scripts/seed-historical-leads.ts --apply     # aplica los cambios
//
// Para producción, cambiar DATABASE_URL en .env.local apuntando al branch
// de prod, correr `npx prisma db push` (si aún no), y después este script
// con --apply. Volver a apuntar a dev al terminar.

import { PrismaClient } from "@prisma/client"
import type { LeadSource, LeadStatus } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import dotenv from "dotenv"
import { join } from "path"

dotenv.config({ path: join(process.cwd(), ".env.local") })
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

type HistoricalLead = {
  name: string
  email: string
  phone?: string | null
  source?: LeadSource
  businessType?: string | null
  status: LeadStatus
  // Email del owner asignado. Se mapea a User.id buscando por email.
  // Si null o el user no existe, queda sin owner.
  ownerEmail: string | null
  // Fecha de creación real (cuando llegó el lead originalmente).
  createdAt: Date
  // Solo si status === IN_EVALUATION o posterior: fecha en que arrancó el trial.
  trialStartedAt?: Date | null
  // Notas opcionales que se agregan como LeadActivity tipo NOTE.
  notes?: string[]
}

// ── Datos a cargar ────────────────────────────────────────────────
// Editar este array y correr el script con --apply.

const LEADS: HistoricalLead[] = [
  {
    name: "Dayana Alvarez",
    email: "dayanaalvarezvila@gmail.com",
    phone: "+598 92 081 084",
    source: "WEB",
    businessType: "Agente inmobiliario",
    status: "DEMO_DONE",
    ownerEmail: "msedes@remax.com.uy",
    createdAt: new Date("2026-04-18T23:23:00.000-03:00"),
  },
]

// ──────────────────────────────────────────────────────────────────

async function main() {
  const apply = process.argv.includes("--apply")
  if (LEADS.length === 0) {
    console.log("\nEl array LEADS está vacío. Editá scripts/seed-historical-leads.ts y volvé a correr.\n")
    return
  }

  console.log(
    `\n${apply ? "Aplicando" : "Dry run de"} ${LEADS.length} lead(s)...\n`
  )

  // Mapeo de ownerEmail → userId para resolver una sola vez.
  const ownerEmails = Array.from(
    new Set(LEADS.map((l) => l.ownerEmail).filter((e): e is string => !!e))
  )
  const ownerUsers = await prisma.user.findMany({
    where: { email: { in: ownerEmails } },
    select: { id: true, email: true, name: true },
  })
  const ownerByEmail = new Map(ownerUsers.map((u) => [u.email, u]))

  for (const ownerEmail of ownerEmails) {
    if (!ownerByEmail.has(ownerEmail)) {
      console.warn(
        `⚠️  ownerEmail="${ownerEmail}" no matchea ningún User. Esos leads quedarán sin owner.`
      )
    }
  }

  for (const lead of LEADS) {
    const ownerUser = lead.ownerEmail ? ownerByEmail.get(lead.ownerEmail) : null
    const ownerLabel = ownerUser
      ? ownerUser.name || ownerUser.email
      : "sin owner"

    const existing = await prisma.lead.findFirst({
      where: { email: lead.email },
    })

    if (existing) {
      console.log(
        `↻ Update: ${lead.name} <${lead.email}> · ${lead.status} · ${ownerLabel}`
      )
      if (!apply) continue

      await prisma.lead.update({
        where: { id: existing.id },
        data: {
          name: lead.name,
          phone: lead.phone ?? null,
          source: lead.source ?? "WEB",
          businessType: lead.businessType ?? null,
          status: lead.status,
          ownerUserId: ownerUser?.id ?? null,
          trialStartedAt: lead.trialStartedAt ?? null,
          // No tocamos createdAt (raw para forzar):
        },
      })
      // updatedAt se controla con @updatedAt; lo pongo igual a createdAt por ahora
      // para que no aparezca como "movimiento" reciente.
      await prisma.$executeRaw`UPDATE "Lead" SET "createdAt" = ${lead.createdAt}, "updatedAt" = ${lead.createdAt} WHERE id = ${existing.id}`

      await ensureNotes(existing.id, lead.notes, ownerUser?.id, lead.createdAt)
      continue
    }

    console.log(
      `+ Create: ${lead.name} <${lead.email}> · ${lead.status} · ${ownerLabel}`
    )
    if (!apply) continue

    const created = await prisma.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? null,
        source: lead.source ?? "WEB",
        businessType: lead.businessType ?? null,
        status: lead.status,
        ownerUserId: ownerUser?.id ?? null,
        trialStartedAt: lead.trialStartedAt ?? null,
      },
    })

    // Forzar createdAt y updatedAt al timestamp histórico real.
    await prisma.$executeRaw`UPDATE "Lead" SET "createdAt" = ${lead.createdAt}, "updatedAt" = ${lead.createdAt} WHERE id = ${created.id}`

    await prisma.leadActivity.create({
      data: {
        leadId: created.id,
        type: "SYSTEM",
        message: "Lead histórico importado",
        createdAt: lead.createdAt,
      },
    })

    await ensureNotes(created.id, lead.notes, ownerUser?.id, lead.createdAt)
  }

  console.log(
    apply
      ? "\n✓ Aplicado.\n"
      : "\nDry run. Volvé a correr con --apply para persistir.\n"
  )
}

async function ensureNotes(
  leadId: string,
  notes: string[] | undefined,
  authorUserId: string | undefined,
  baseDate: Date
) {
  if (!notes || notes.length === 0) return
  for (const [i, message] of notes.entries()) {
    const exists = await prisma.leadActivity.findFirst({
      where: { leadId, type: "NOTE", message },
    })
    if (exists) continue
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: "NOTE",
        message,
        authorUserId,
        // Pequeño offset incremental para preservar orden cronológico.
        createdAt: new Date(baseDate.getTime() + i * 60_000),
      },
    })
  }
}

main()
  .catch((e) => {
    console.error("\n✗ Error:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
