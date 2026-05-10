// Lista los leads en la base actual con un resumen rápido.
//
// Útil para verificar el estado antes/después de importar leads históricos
// o de aplicar cambios manuales.
//
// Uso:
//   npx tsx scripts/list-leads.ts

import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import dotenv from "dotenv"
import { join } from "path"

dotenv.config({ path: join(process.cwd(), ".env.local") })
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "asc" },
    include: { owner: { select: { name: true, email: true } } },
  })

  if (leads.length === 0) {
    console.log("\nNo hay leads en la base.\n")
    return
  }

  console.log(`\n${leads.length} lead(s):\n`)
  for (const l of leads) {
    const owner = l.owner ? l.owner.name || l.owner.email : "sin owner"
    const trial = l.trialStartedAt
      ? ` · trial ${l.trialStartedAt.toISOString().slice(0, 10)}`
      : ""
    const created = l.createdAt.toISOString().slice(0, 10)
    console.log(
      `  ${l.id}  ${created}  ${l.status.padEnd(15)}  ${l.name}  <${l.email}>  (${owner})${trial}`
    )
  }
  console.log()
}

main()
  .catch((e) => {
    console.error("✗ Error:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
