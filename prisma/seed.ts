import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const raw = process.env.SEED_USER_EMAILS
  if (!raw) {
    throw new Error(
      'SEED_USER_EMAILS is not set. Example: SEED_USER_EMAILS="raphael@example.com,martin@example.com"'
    )
  }

  const emails = raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  for (const email of emails) {
    const name = email.split('@')[0]
    const user = await prisma.user.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, name, isActive: true },
    })
    console.log(`upserted: ${user.email} (${user.id})`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
