// Envejece un lead — pone su updatedAt N días atrás para forzar follow-up automático.
// También permite cambiar su estado (a CONTACTED, DEMO_DONE o CUSTOMER) que son
// los estados con regla de follow-up.
//
// Uso:
//   node scripts/age-lead.mjs                          → lista leads disponibles
//   node scripts/age-lead.mjs <leadId>                 → envejece 5 días, deja status
//   node scripts/age-lead.mjs <leadId> 4               → 4 días, deja status
//   node scripts/age-lead.mjs <leadId> 4 CONTACTED     → 4 días + cambia status
//
// Después correr el cron a mano:
//   curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/scan-followups

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const TRIGGER_STATES = ["CONTACTED", "DEMO_DONE", "CUSTOMER"];

async function listLeads() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true, email: true } } },
  });

  if (leads.length === 0) {
    console.log("No hay leads en la DB.");
    return;
  }

  console.log("\nLeads disponibles:\n");
  for (const l of leads) {
    const owner = l.owner ? l.owner.name || l.owner.email : "sin owner";
    console.log(`  ${l.id}  ${l.status.padEnd(15)}  ${l.name}  (${owner})`);
  }
  console.log(
    "\nUso: node scripts/age-lead.mjs <leadId> [days=5] [status]"
  );
  console.log(
    `Estados con follow-up automático: ${TRIGGER_STATES.join(", ")}\n`
  );
}

async function ageLead(leadId, daysArg, statusArg) {
  const days = Number(daysArg ?? 5);
  if (!Number.isFinite(days) || days < 0) {
    throw new Error(`days inválido: ${daysArg}`);
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { owner: { select: { name: true, email: true } } },
  });
  if (!lead) {
    throw new Error(`Lead ${leadId} no existe`);
  }

  let nextStatus = lead.status;
  if (statusArg) {
    const upper = statusArg.toUpperCase();
    if (!TRIGGER_STATES.includes(upper)) {
      throw new Error(
        `status "${statusArg}" no dispara follow-up. Usá: ${TRIGGER_STATES.join(", ")}`
      );
    }
    nextStatus = upper;
  }

  // Si el status cambia, lo actualizo primero (esto crea LeadActivity STATUS_CHANGE).
  // Después seteo updatedAt manualmente vía raw SQL para sobreescribir el @updatedAt.
  if (nextStatus !== lead.status) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: nextStatus },
    });
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: "STATUS_CHANGE",
        message: `Estado: ${lead.status} → ${nextStatus} (script age-lead)`,
      },
    });
    console.log(`✓ Status: ${lead.status} → ${nextStatus}`);
  }

  // Resolver follow-ups activos para que pueda crear uno nuevo en este scan.
  await prisma.leadFollowUp.updateMany({
    where: { leadId, resolvedAt: null },
    data: { resolvedAt: new Date(), resolvedBy: "DISMISSED" },
  });

  // Backdate updatedAt. Uso raw porque @updatedAt de Prisma siempre lo sobreescribe.
  const past = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  await prisma.$executeRaw`UPDATE "Lead" SET "updatedAt" = ${past} WHERE id = ${leadId}`;

  const owner = lead.owner ? lead.owner.name || lead.owner.email : "sin owner";
  console.log(
    `✓ ${lead.name} (${owner}) — status=${nextStatus}, updatedAt=hace ${days} días`
  );
  console.log("\nAhora corré el cron para crear el follow-up:");
  console.log(
    "  curl -H \"Authorization: Bearer $CRON_SECRET\" http://localhost:3000/api/cron/scan-followups\n"
  );
}

async function main() {
  const [, , leadId, daysArg, statusArg] = process.argv;

  if (!leadId) {
    await listLeads();
    return;
  }

  await ageLead(leadId, daysArg, statusArg);
}

main()
  .catch((e) => {
    console.error(`\n✗ ${e.message}\n`);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
