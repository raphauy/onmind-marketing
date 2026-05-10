// Setea los nombres "amistosos" de los users del sistema.
// Idempotente: si ya están seteados igual, no cambia nada.
//
// Uso:
//   npx tsx scripts/seed-user-names.ts             # dry run
//   npx tsx scripts/seed-user-names.ts --apply     # aplica

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

const NAMES: Record<string, string> = {
  "rapha.uy@rapha.uy": "Raphael",
  "msedes@remax.com.uy": "Martín",
}

async function main() {
  const apply = process.argv.includes("--apply")

  for (const [email, name] of Object.entries(NAMES)) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.warn(`⚠️  No existe user con email ${email}`)
      continue
    }
    if (user.name === name) {
      console.log(`= ${email} → ya es "${name}"`)
      continue
    }
    console.log(`↻ ${email} → "${user.name ?? "(null)"}" => "${name}"`)
    if (apply) {
      await prisma.user.update({
        where: { email },
        data: { name },
      })
    }
  }

  console.log(
    apply
      ? "\n✓ Aplicado.\n"
      : "\nDry run. Volvé a correr con --apply para persistir.\n"
  )
}

main()
  .catch((e) => {
    console.error("✗ Error:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
