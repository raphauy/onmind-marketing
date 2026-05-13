// Genera los assets para subir un video tutorial a YouTube:
//   1. thumbnail-yt.jpg  — 1280x720, frame del master 16:9 + overlay con título
//   2. youtube.md         — título, descripción, capítulos, tags listos para copy-paste
//
// Uso:
//   node generate-youtube-assets.mjs <folder> [--frame-at=<segundos>] [--video=<file>]
//
// Ejemplo:
//   node generate-youtube-assets.mjs content/videos-tutoriales/2026-05-11-templates --frame-at=11

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execSync } from "node:child_process"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..", "..")

// ─── Args ──────────────────────────────────────────────────────

const args = process.argv.slice(2)
const folderArg = args.find((a) => !a.startsWith("--"))
const frameFlag = args.find((a) => a.startsWith("--frame-at="))
const videoFlag = args.find((a) => a.startsWith("--video="))
const videoFile = videoFlag ? videoFlag.split("=")[1] : "output.mp4"

if (!folderArg) {
  console.error(
    "Uso: node generate-youtube-assets.mjs <folder> [--frame-at=<s>] [--video=<file>]"
  )
  process.exit(1)
}

const folder = path.resolve(PROJECT_ROOT, folderArg)
if (!fs.existsSync(folder)) {
  console.error(`No existe el folder: ${folder}`)
  process.exit(1)
}

const slug = path.basename(folder)
const videoPath = path.join(folder, videoFile)

for (const f of [videoFile, "meta.md", "caption.md"]) {
  if (!fs.existsSync(path.join(folder, f))) {
    console.error(`Falta archivo requerido en el folder: ${f}`)
    process.exit(1)
  }
}

// ─── Helpers ───────────────────────────────────────────────────

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const out = {}
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_][a-z0-9_]*):\s*(.*)$/i)
    if (kv) out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "")
  }
  return out
}

function parseCaption(md) {
  const captionMatch = md.match(/##\s*Caption\s*\n+([\s\S]*?)(?=\n##\s|$)/i)
  const hashtagsMatch = md.match(/##\s*Hashtags\s*\n+([\s\S]*?)$/i)
  if (!captionMatch || !hashtagsMatch) {
    throw new Error("caption.md debe tener secciones '## Caption' y '## Hashtags'")
  }
  return {
    caption: captionMatch[1].trim(),
    hashtags: hashtagsMatch[1]
      .trim()
      .split(/\s+/)
      .filter((t) => t.startsWith("#")),
  }
}

// Capítulos para YouTube. Prioridad:
//   1) Sección "## Capítulos YT" con formato "0:00 Label" (uno por línea) — preferido
//   2) Sección "## Plan de escenas" (tabla markdown) — fallback con label corto
//      (split por ":" o "—", primer fragmento, máximo 50 chars)
function parseChapters(metaMd) {
  // 1) Sección dedicada de capítulos YT
  const ytMatch = metaMd.match(/##\s*Cap[ií]tulos\s*YT\s*\n+([\s\S]*?)(?=\n##\s|$)/i)
  if (ytMatch) {
    const out = []
    for (const line of ytMatch[1].split("\n")) {
      const m = line.match(/^\s*(\d+:\d{2})\s+(.+?)\s*$/)
      if (m) out.push({ time: m[1], label: m[2] })
    }
    if (out.length > 0) {
      if (out[0].time !== "0:00") out[0].time = "0:00"
      return out
    }
  }

  // 2) Fallback: tabla "Plan de escenas"
  const planMatch = metaMd.match(/##\s*Plan de escenas\s*\n+([\s\S]*?)(?=\n##\s|$)/i)
  if (!planMatch) return null
  const lines = planMatch[1].split("\n").filter((l) => l.trim().startsWith("|"))
  if (lines.length < 2) return null

  const dataLines = lines.slice(2)
  const chapters = []
  for (const line of dataLines) {
    const cells = line.split("|").map((c) => c.trim()).filter((c) => c.length > 0)
    if (cells.length < 4) continue
    const tiempo = cells[2] || cells[1]
    const contenido = cells[3] || cells[2]
    if (!tiempo || !contenido) continue

    const startStr = tiempo.split(/[–\-→]/)[0].replace("s", "").trim()
    const startSec = Number(startStr)
    if (Number.isNaN(startSec)) continue

    const mm = Math.floor(startSec / 60)
    const ss = Math.floor(startSec % 60)
    const time = `${mm}:${String(ss).padStart(2, "0")}`

    // Label corto: primer fragmento antes de "—" o ":", quitar formato, máximo 50 chars
    let label = contenido
      .replace(/^\*\*|\*\*$/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .split(/\s+—\s+|:\s+/)[0]
      .trim()
    if (label.length > 50) label = label.slice(0, 47).trim() + "…"

    chapters.push({ time, label })
  }

  if (chapters.length === 0) return null
  if (chapters[0].time !== "0:00") chapters[0].time = "0:00"
  return chapters
}

function pad2(n) {
  return String(n).padStart(2, "0")
}

function getVideoDuration(filePath) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
    { encoding: "utf8" }
  )
  return Number(out.trim())
}

// ─── Lectura ───────────────────────────────────────────────────

const meta = parseFrontmatter(fs.readFileSync(path.join(folder, "meta.md"), "utf8"))
const metaMdRaw = fs.readFileSync(path.join(folder, "meta.md"), "utf8")
const { caption, hashtags } = parseCaption(
  fs.readFileSync(path.join(folder, "caption.md"), "utf8")
)
const duration = getVideoDuration(videoPath)

const featureRaw = meta.feature || "tutorial"
const featureUpper = featureRaw.toUpperCase()
const featureNice = featureRaw.charAt(0).toUpperCase() + featureRaw.slice(1)
const titleNoun = (meta.title || `Tutorial — ${featureNice}`).replace(/^Tutorial\s*[—-]\s*/i, "")

// ─── 1) Extraer frame para thumbnail ───────────────────────────

const frameAt = frameFlag ? Number(frameFlag.split("=")[1]) : duration * 0.45
const tmpDir = path.join(PROJECT_ROOT, "public", "tmp")
fs.mkdirSync(tmpDir, { recursive: true })
const tmpFrameRel = `tmp/thumb-bg-${slug}.jpg`
const tmpFrameAbs = path.join(PROJECT_ROOT, "public", tmpFrameRel)

console.log(`Extrayendo frame a t=${frameAt.toFixed(1)}s...`)
execSync(
  `ffmpeg -y -ss ${frameAt} -i "${videoPath}" -frames:v 1 -q:v 2 "${tmpFrameAbs}" 2>/dev/null`
)

// ─── 2) Renderizar thumbnail con Remotion ──────────────────────

// Eyebrow fijo de marca arriba del título. El feature en sí se muestra grande
// como título principal (titleNoun).
const props = JSON.stringify({
  title: titleNoun,
  feature: "TUTORIAL ONMIND",
  bgImage: tmpFrameRel,
})
const thumbOut = path.join(folder, "thumbnail-yt.jpg")

console.log("Renderizando thumbnail con Remotion...")
execSync(
  `pnpm remotion still tutorial-thumbnail-yt "${thumbOut}" --props='${props}' --image-format=jpeg --frame=0`,
  { cwd: PROJECT_ROOT, stdio: "inherit" }
)

// Limpiar tmp
try {
  fs.unlinkSync(tmpFrameAbs)
} catch (_) {}

// ─── 3) Construir youtube.md ──────────────────────────────────

const chapters = parseChapters(metaMdRaw)

const titleYT = `Tutorial: ${titleNoun} en OnMind`
if (titleYT.length > 100) {
  console.warn(`⚠ Título YT excede 100 chars (${titleYT.length}). Acortar manualmente.`)
}

// Hashtags: una sola línea con todos los del caption. Los primeros 3 son los
// que YouTube muestra sobre el título.
const allHashtags = hashtags.join(" ")

const tagsList = [
  "OnMind",
  "OnMindApp",
  featureRaw,
  "automatización",
  "WhatsApp",
  "inmobiliaria",
  "gestión de clientes",
  "tutorial",
  "tutorial OnMind",
  `${featureNice} OnMind`,
]
const tagsCSV = tagsList.join(", ")

const chaptersBlock = chapters
  ? "📍 Capítulos\n" + chapters.map((c) => `${c.time} ${c.label}`).join("\n") + "\n\n"
  : ""

const description = `${caption}

${chaptersBlock}🎬 Más tutoriales en este canal: @OnMindApp
🌐 Probá OnMind: https://www.onmindcrm.com
📲 Instagram: https://instagram.com/OnMindApp

OnMind ayuda a negocios a mantener vivo el vínculo con sus clientes a través de WhatsApp: cumpleaños, aniversarios, recordatorios, fechas especiales. Una sola configuración inicial y los mensajes se programan solos durante todo el año.

${allHashtags}`

const ymd = new Date().toISOString().slice(0, 10)
const youtubeMd = `---
slug: ${slug}
title_yt: "${titleYT}"
title_chars: ${titleYT.length}
description_chars: ${description.length}
tags: [${tagsList.map((t) => `"${t}"`).join(", ")}]
category: Education
language: es
made_for_kids: false
generated_at: ${ymd}
---

# Assets para subir a YouTube — ${slug}

## 1. Título (copy-paste en YouTube)

\`\`\`
${titleYT}
\`\`\`

(${titleYT.length}/100 chars)

## 2. Descripción (copy-paste en YouTube)

\`\`\`
${description}
\`\`\`

(${description.length}/5000 chars)

## 3. Tags (copy-paste en YouTube, separados por coma)

\`\`\`
${tagsCSV}
\`\`\`

## 4. Configuración recomendada al subir

- **Categoría:** Education
- **Idioma del video:** Español (es)
- **¿Hecho para niños?** No
- **Visibilidad inicial:** Pública (o No listada para preview)
- **Playlist sugerida:** Tutoriales (crear en el canal si no existe)
- **Subtítulos:** YouTube los genera automáticamente; revisar tras publicar
- **Cards y End screens:** agregar manualmente desde Studio (apuntar a otros tutoriales del canal)

## 5. Thumbnail

Archivo: \`thumbnail-yt.jpg\` (1280x720 JPG)
${chapters ? `\n## 6. Capítulos detectados desde meta.md\n\n${chapters.map((c) => `- ${c.time} ${c.label}`).join("\n")}\n` : "\n## 6. Capítulos\n\nNo se detectó tabla 'Plan de escenas' en meta.md. Sin capítulos.\n"}
`

fs.writeFileSync(path.join(folder, "youtube.md"), youtubeMd)

console.log("\n──────────────────────────────────────────")
console.log("✓ Assets YT generados")
console.log(`  thumbnail: ${path.relative(PROJECT_ROOT, thumbOut)}`)
console.log(`  youtube.md: ${folderArg}/youtube.md`)
console.log(`  título (${titleYT.length}/100): ${titleYT}`)
console.log(`  capítulos: ${chapters ? chapters.length : "no detectados"}`)
console.log("──────────────────────────────────────────")
