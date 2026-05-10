// Lista los users del sistema para identificar emails de owners.
//
// Uso:
//   npx tsx scripts/list-users.ts

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
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      createdAt: true,
    },
  })

  if (users.length === 0) {
    console.log("\nNo hay users en la base.\n")
    return
  }

  console.log(`\n${users.length} user(s):\n`)
  for (const u of users) {
    const flag = u.isActive ? "  active" : "inactive"
    const created = u.createdAt.toISOString().slice(0, 10)
    console.log(
      `  ${flag}  ${created}  ${(u.name || "(sin nombre)").padEnd(15)}  <${u.email}>`
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
