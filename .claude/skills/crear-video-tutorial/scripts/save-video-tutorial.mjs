// Registra un video tutorial en la DB como Pieza.
//
// 1. Asegura que existe el Template REMOTION "tutorial-video-remotion"
// 2. Lee meta.md (frontmatter YAML) y caption.md del folder
// 3. Sube video + thumbnail.jpg a Vercel Blob
// 4. Crea Piece (GENERATED) con videoUrl + thumbnailUrl + caption + hashtags
// 5. Crea Generation activa
//
// Uso:
//   node save-video-tutorial.mjs <folder> [--video=<filename>]
//
// Ej:
//   node save-video-tutorial.mjs content/videos-tutoriales/2026-05-11-templates --video=output-9x16.mp4

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { put } from "@vercel/blob"
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import dotenv from "dotenv"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..", "..")
dotenv.config({ path: path.join(PROJECT_ROOT, ".env.local") })

neonConfig.webSocketConstructor = ws
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const TUTORIAL_TEMPLATE_SLUG = "tutorial-video-remotion"

// ─── Utilidades ────────────────────────────────────────────────

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const out = {}
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_][a-z0-9_]*):\s*(.*)$/i)
    if (kv) out[kv[1]] = kv[2].trim()
  }
  return out
}

function parseCaption(md) {
  const captionMatch = md.match(/##\s*Caption\s*\n+([\s\S]*?)(?=\n##\s|$)/i)
  const hashtagsMatch = md.match(/##\s*Hashtags\s*\n+([\s\S]*?)$/i)
  if (!captionMatch || !hashtagsMatch) {
    throw new Error("caption.md debe tener secciones '## Caption' y '## Hashtags'")
  }
  const caption = captionMatch[1].trim()
  const hashtags = hashtagsMatch[1]
    .trim()
    .split(/\s+/)
    .filter((t) => t.startsWith("#"))
  return { caption, hashtags }
}

async function ensureTutorialTemplate(durationSec) {
  let template = await prisma.template.findUnique({
    where: { slug: TUTORIAL_TEMPLATE_SLUG },
  })
  if (template) return template

  console.log(`Creando template REMOTION "${TUTORIAL_TEMPLATE_SLUG}"...`)
  template = await prisma.template.create({
    data: {
      slug: TUTORIAL_TEMPLATE_SLUG,
      name: "Video tutorial (Remotion)",
      description:
        "Video tutorial bespoke 9:16 que explica una sección concreta del producto OnMind. Cada pieza es única (composición Remotion propia + voz TTS). NO se regenera desde la UI; se reemplaza creando una pieza nueva.",
      renderer: "REMOTION",
      isRegeneratable: false,
      fields: [
        {
          key: "script",
          label: "Guion narrado",
          type: "textarea",
          required: true,
          placeholder: "Texto que se le pasa a ElevenLabs TTS",
        },
        {
          key: "feature",
          label: "Sección del producto",
          type: "text",
          required: true,
          placeholder: "templates, dashboard, contactos, ...",
        },
        {
          key: "exampleFolder",
          label: "Folder del video en repo",
          type: "text",
          required: true,
          placeholder: "content/videos-tutoriales/YYYY-MM-DD-slug",
        },
      ],
      promptTemplate: null,
      model: "remotion:tutorial + elevenlabs-tts",
      costPerImage: 0.05, // estimado: solo TTS (Remotion es gratis)
      durationSec,
      darkOverlay: false,
      aspectRatio: "9:16",
      isActive: true,
    },
  })
  console.log(`OK template creado (id=${template.id})`)
  return template
}

// ─── Main ──────────────────────────────────────────────────────

const args = process.argv.slice(2)
const folderArg = args.find((a) => !a.startsWith("--"))
const videoFlag = args.find((a) => a.startsWith("--video="))
const videoFile = videoFlag ? videoFlag.split("=")[1] : "output.mp4"

if (!folderArg) {
  console.error("Uso: node save-video-tutorial.mjs <folder> [--video=<filename>]")
  process.exit(1)
}

const folder = path.resolve(PROJECT_ROOT, folderArg)
if (!fs.existsSync(folder)) {
  console.error(`No existe el folder: ${folder}`)
  process.exit(1)
}

const required = ["script.txt", videoFile, "thumbnail.jpg", "meta.md", "caption.md"]
for (const f of required) {
  if (!fs.existsSync(path.join(folder, f))) {
    console.error(`Falta archivo requerido en el folder: ${f}`)
    process.exit(1)
  }
}

const slug = path.basename(folder)
const meta = parseFrontmatter(fs.readFileSync(path.join(folder, "meta.md"), "utf8"))
const { caption, hashtags } = parseCaption(
  fs.readFileSync(path.join(folder, "caption.md"), "utf8")
)
const script = fs.readFileSync(path.join(folder, "script.txt"), "utf8").trim()
const durationSec = Number(meta.duration_sec) || 24

const existing = await prisma.piece.findUnique({ where: { slug } })
if (existing) {
  console.error(`Ya existe una Piece con slug="${slug}".`)
  process.exit(1)
}

const template = await ensureTutorialTemplate(durationSec)

console.log("Subiendo video a Vercel Blob...")
const videoBuffer = fs.readFileSync(path.join(folder, videoFile))
const { url: videoUrl } = await put(`videos/${slug}.mp4`, videoBuffer, {
  access: "public",
  contentType: "video/mp4",
  addRandomSuffix: false,
  allowOverwrite: true,
})
console.log(`  video: ${videoUrl}`)

console.log("Subiendo thumbnail a Vercel Blob...")
const thumbBuffer = fs.readFileSync(path.join(folder, "thumbnail.jpg"))
const { url: thumbnailUrl } = await put(`thumbnails/${slug}.jpg`, thumbBuffer, {
  access: "public",
  contentType: "image/jpeg",
  addRandomSuffix: false,
  allowOverwrite: true,
})
console.log(`  thumbnail: ${thumbnailUrl}`)

console.log("Creando Piece en DB...")
const piece = await prisma.piece.create({
  data: {
    slug,
    templateId: template.id,
    pillar: meta.pillar || "educacion",
    topic: meta.title || `Tutorial — ${meta.feature || "OnMind"}`,
    fieldValues: {
      script,
      feature: meta.feature || "unknown",
      exampleFolder: folderArg.replace(/^\/?/, ""),
    },
    caption,
    hashtags,
    status: "GENERATED",
    imageUrl: thumbnailUrl,
    videoUrl,
    thumbnailUrl,
    costUsd: 0.05,
    generations: {
      create: {
        imageUrl: thumbnailUrl,
        videoUrl,
        prompt: script.slice(0, 2000),
        model: "remotion:tutorial + elevenlabs-tts",
        costUsd: 0.05,
        durationMs: durationSec * 1000,
        isActive: true,
      },
    },
  },
})

console.log("\n──────────────────────────────────────────")
console.log("✓ Pieza registrada")
console.log(`  slug:      ${piece.slug}`)
console.log(`  pillar:    ${piece.pillar}`)
console.log(`  topic:     ${piece.topic}`)
console.log(`  videoUrl:  ${videoUrl}`)
console.log(`  UI:        https://dev.onmindcrm.com/dashboard/piezas/${piece.slug}`)
console.log("──────────────────────────────────────────")

await prisma.$disconnect()
