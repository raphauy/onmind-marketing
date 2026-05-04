// Test punta a punta del pipeline Remotion: invoca generatePieceImage del service real.
//
// Uso: npx tsx scripts/test-remotion-pipeline.ts --piece=<slug>

import dotenv from "dotenv"
import { join } from "path"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

dotenv.config({ path: join(process.cwd(), ".env.local") })
neonConfig.webSocketConstructor = ws

async function main() {
  // Import después de cargar env (no top-level await en cjs).
  const { generatePieceImage } = await import(
    "../src/services/generation-service"
  )
  const { prisma } = await import("../src/lib/prisma")


  const slugArg = process.argv
    .find((a) => a.startsWith("--piece="))
    ?.replace("--piece=", "")

  if (!slugArg) {
    console.error("Falta --piece=<slug>")
    process.exit(1)
  }

  const piece = await prisma.piece.findUnique({
    where: { slug: slugArg },
    include: { template: true },
  })
  if (!piece) {
    console.error(`Pieza "${slugArg}" no encontrada`)
    process.exit(1)
  }

  console.log(`\n🎬 Generando ${piece.template.renderer} → ${piece.slug}`)
  console.log(`   Template: ${piece.template.name}`)

  const start = Date.now()
  const result = await generatePieceImage(piece.id)
  const elapsed = ((Date.now() - start) / 1000).toFixed(1)

  console.log(`\n✅ Listo en ${elapsed}s`)
  console.log(`   imageUrl: ${result.imageUrl}`)
  if ("videoUrl" in result && result.videoUrl) {
    console.log(`   videoUrl: ${result.videoUrl}`)
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("\n❌ Error:", e)
  process.exit(1)
})
