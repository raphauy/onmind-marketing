// Genera la imagen de una pieza creativa.
// Lee la piece de la DB, usa el renderer correspondiente (LLM o Satori),
// guarda la imagen, agrega logo, actualiza la DB.
//
// Uso:
//   npx tsx scripts/generate-piece.ts --piece=<slug>
//   npx tsx scripts/generate-piece.ts --piece=<slug> --no-overlay   (sin logo)

import { PrismaClient, type Template } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import dotenv from "dotenv"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"
import { getSatoriRenderer } from "../src/lib/renderers"
import { addLogoOverlay } from "../src/lib/logo-overlay"

// --- Setup ---

dotenv.config({ path: join(process.cwd(), ".env.local") })
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const ROOT = process.cwd()
const OUTPUT_DIR = join(ROOT, "output", "piezas")
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const API_KEY = process.env.OPEN_ROUTER_API_KEY

mkdirSync(OUTPUT_DIR, { recursive: true })

// --- Prompt builder (solo para renderer=LLM) ---

function buildPrompt(template: Template, fieldValues: Record<string, string>): string {
  if (!template.promptTemplate) {
    throw new Error(`Template "${template.slug}" tiene renderer=LLM pero promptTemplate es null`)
  }

  let prompt = template.promptTemplate
  for (const [key, value] of Object.entries(fieldValues)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value)
  }

  const remaining = prompt.match(/\{\{(\w+)\}\}/g)
  if (remaining) {
    throw new Error(`Placeholders sin valor: ${remaining.join(", ")}`)
  }

  return prompt
}

// --- OpenRouter ---

async function callOpenRouter(prompt: string, model: string) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://onmindcrm.com",
      "X-Title": "OnMind Marketing",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenRouter HTTP ${response.status}: ${text}`)
  }

  return response.json()
}

type OpenRouterData = {
  choices?: Array<{
    message: {
      content?: Array<{ type: string; image_url?: { url: string } }>
      images?: Array<{ image_url?: { url: string }; url?: string }>
    }
  }>
  usage?: { prompt_tokens?: number; completion_tokens?: number }
}

function extractImage(data: OpenRouterData): Buffer | null {
  const message = data.choices?.[0]?.message
  if (!message) return null

  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "image_url" && part.image_url?.url) {
        const match = part.image_url.url.match(/^data:image\/\w+;base64,([\s\S]+)$/)
        if (match) return Buffer.from(match[1], "base64")
      }
    }
  }

  if (Array.isArray(message.images)) {
    for (const img of message.images) {
      const url = img.image_url?.url || img.url
      if (url) {
        const match = url.match(/^data:image\/\w+;base64,([\s\S]+)$/)
        if (match) return Buffer.from(match[1], "base64")
      }
    }
  }

  return null
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2)
  const pieceSlug = args.find((a) => a.startsWith("--piece="))?.replace("--piece=", "")
  const noOverlay = args.includes("--no-overlay")

  if (!pieceSlug) {
    const drafts = await prisma.piece.findMany({
      where: { status: "DRAFT" },
      include: { template: { select: { name: true, costPerImage: true } } },
      orderBy: { createdAt: "desc" },
    })

    if (drafts.length === 0) {
      console.log("No hay pieces en estado DRAFT.")
    } else {
      console.log("Pieces pendientes de generar:\n")
      for (const p of drafts) {
        console.log(`  --piece=${p.slug}`)
        console.log(`    Template: ${p.template.name} ($${p.template.costPerImage})`)
        console.log(`    Topic: ${p.topic || "(sin tema)"}\n`)
      }
    }
    return
  }

  const piece = await prisma.piece.findUnique({
    where: { slug: pieceSlug },
    include: { template: true },
  })

  if (!piece) {
    console.error(`Piece "${pieceSlug}" no encontrada.`)
    process.exit(1)
  }

  if (piece.status !== "DRAFT" && piece.status !== "FAILED") {
    console.error(`Piece "${pieceSlug}" tiene status ${piece.status}, no se puede generar.`)
    process.exit(1)
  }

  const { template } = piece
  const fieldValues = piece.fieldValues as Record<string, string>

  console.log("=".repeat(50))
  console.log(`Generando: ${piece.slug}`)
  console.log(`Template: ${template.name}`)
  console.log(`Renderer: ${template.renderer}`)
  if (template.renderer === "LLM") {
    console.log(`Modelo: ${template.model}`)
    console.log(`Costo estimado: $${template.costPerImage}`)
  } else {
    console.log(`Costo: $0 (programático)`)
  }
  console.log("=".repeat(50))

  await prisma.piece.update({ where: { id: piece.id }, data: { status: "GENERATING" } })

  try {
    let imageBuffer: Buffer | null = null
    let prompt = ""
    let modelUsed = ""
    let durationMs = 0
    let usage: { prompt_tokens?: number; completion_tokens?: number } = {}

    if (template.renderer === "SATORI") {
      const renderer = getSatoriRenderer(template.slug)
      const startTime = Date.now()
      console.log("\n🎨 Renderizando con Satori...")
      imageBuffer = await renderer(fieldValues)
      durationMs = Date.now() - startTime
      prompt = `[satori:${template.slug}] ${JSON.stringify(fieldValues)}`
      modelUsed = `satori:${template.slug}`
      console.log(`   ✅ Renderizada (${(imageBuffer.length / 1024).toFixed(0)} KB, ${durationMs}ms)`)
    } else {
      if (!API_KEY) throw new Error("OPEN_ROUTER_API_KEY no configurada en .env.local")
      if (!template.model) throw new Error(`Template "${template.slug}" tiene renderer=LLM pero model es null`)

      prompt = buildPrompt(template, fieldValues)
      modelUsed = template.model
      console.log("\n🔄 Generando imagen vía OpenRouter...")
      const startTime = Date.now()
      const data = (await callOpenRouter(prompt, template.model)) as OpenRouterData
      durationMs = Date.now() - startTime
      imageBuffer = extractImage(data)
      if (!imageBuffer) throw new Error("No se obtuvo imagen del modelo.")
      usage = data.usage || {}
      console.log(`   ✅ Imagen recibida (${(imageBuffer.length / 1024).toFixed(0)} KB, ${(durationMs / 1000).toFixed(1)}s)`)
    }

    let finalImage = imageBuffer
    if (!noOverlay) {
      console.log("   🏷️  Agregando logo...")
      finalImage = await addLogoOverlay(
        imageBuffer,
        template.darkOverlay,
        template.aspectRatio
      )
    }

    const localPath = join(OUTPUT_DIR, `${piece.slug}.png`)
    writeFileSync(localPath, finalImage)
    console.log(`   💾 Guardada: ${localPath}`)

    const costUsd = template.renderer === "SATORI" ? 0 : template.costPerImage

    // Nota: el flujo canónico para subir a Blob y crear Generation lo hace
    // el servicio (src/services/generation-service.ts) invocado desde la UI.
    // Este script CLI es solo para tests locales: guarda PNG a disco y marca
    // la piece como GENERATED, sin Generation row ni upload a Blob.
    await prisma.piece.update({
      where: { id: piece.id },
      data: { status: "GENERATED" },
    })

    console.log(`\n✅ Piece generada exitosamente`)
    console.log(`   Status: GENERATED`)
    console.log(`   Costo: $${costUsd}`)
    console.log(`   Tiempo: ${(durationMs / 1000).toFixed(1)}s`)
    if (template.renderer === "LLM") {
      console.log(`   Tokens: ${usage.prompt_tokens ?? "?"}+${usage.completion_tokens ?? "?"}`)
    }
    console.log(`\n   Imagen: ${localPath}`)
  } catch (error) {
    await prisma.piece.update({ where: { id: piece.id }, data: { status: "FAILED" } })
    console.error(`\n❌ Error:`, error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
