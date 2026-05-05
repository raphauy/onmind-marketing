// Registra un video narrado en la DB.
//
// 1. Asegura que existe el Template HYPERFRAMES (lo crea si no)
// 2. Lee meta.md (frontmatter YAML) y caption.md del folder
// 3. Sube output.mp4 + thumbnail.jpg a Vercel Blob
// 4. Crea Piece (DRAFT) con videoUrl + thumbnailUrl + caption + hashtags
// 5. Crea Generation activa con URLs y costo
//
// Uso: node save-video-narrado.mjs <path-al-folder-del-example>
// Ej:  node save-video-narrado.mjs content/videos-narrados/examples/2026-05-05-agente-real

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
dotenv.config({ path: path.join(PROJECT_ROOT, ".env.local") });

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const HYPERFRAMES_TEMPLATE_SLUG = "video-narrado-hyperframes";

// ─── Utilidades ────────────────────────────────────────────────

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_][a-z0-9_]*):\s*(.*)$/i);
    if (kv) out[kv[1]] = kv[2].trim();
  }
  return out;
}

function parseCaption(md) {
  const captionMatch = md.match(/##\s*Caption\s*\n+([\s\S]*?)(?=\n##\s|$)/i);
  const hashtagsMatch = md.match(/##\s*Hashtags\s*\n+([\s\S]*?)$/i);
  if (!captionMatch || !hashtagsMatch) {
    throw new Error("caption.md debe tener secciones '## Caption' y '## Hashtags'");
  }
  const caption = captionMatch[1].trim();
  const hashtags = hashtagsMatch[1]
    .trim()
    .split(/\s+/)
    .filter((t) => t.startsWith("#"));
  return { caption, hashtags };
}

async function ensureHyperframesTemplate() {
  let template = await prisma.template.findUnique({
    where: { slug: HYPERFRAMES_TEMPLATE_SLUG },
  });
  if (template) return template;

  console.log(`Creando template HYPERFRAMES "${HYPERFRAMES_TEMPLATE_SLUG}"...`);
  template = await prisma.template.create({
    data: {
      slug: HYPERFRAMES_TEMPLATE_SLUG,
      name: "Video narrado (HyperFrames + ElevenLabs)",
      description:
        "Video narrado bespoke 9:16 para Reels. Cada pieza es única (script propio, voz TTS, música, composición). NO se regenera desde la UI; se reemplaza creando una pieza nueva.",
      renderer: "HYPERFRAMES",
      isRegeneratable: false,
      fields: [
        {
          key: "script",
          label: "Script narrado",
          type: "textarea",
          required: true,
          placeholder: "Texto que se le pasa a ElevenLabs TTS",
        },
        {
          key: "exampleFolder",
          label: "Folder del example en repo",
          type: "text",
          required: true,
          placeholder: "content/videos-narrados/examples/YYYY-MM-DD-slug",
        },
      ],
      promptTemplate: null,
      model: "elevenlabs:tts+music + hyperframes",
      costPerImage: 0.1, // estimado promedio TTS + music regen ocasional
      durationSec: 38,
      darkOverlay: false,
      aspectRatio: "9:16",
      isActive: true,
    },
  });
  console.log(`OK template creado (id=${template.id})`);
  return template;
}

// ─── Main ──────────────────────────────────────────────────────

const folderArg = process.argv[2];
if (!folderArg) {
  console.error("Uso: node save-video-narrado.mjs <path-al-folder-del-example>");
  process.exit(1);
}

const folder = path.resolve(PROJECT_ROOT, folderArg);
if (!fs.existsSync(folder)) {
  console.error(`No existe el folder: ${folder}`);
  process.exit(1);
}

// Verificar archivos requeridos
const required = ["script.txt", "output.mp4", "thumbnail.jpg", "meta.md", "caption.md"];
for (const f of required) {
  if (!fs.existsSync(path.join(folder, f))) {
    console.error(`Falta archivo requerido en el folder: ${f}`);
    process.exit(1);
  }
}

const slug = path.basename(folder);
const meta = parseFrontmatter(fs.readFileSync(path.join(folder, "meta.md"), "utf8"));
const { caption, hashtags } = parseCaption(fs.readFileSync(path.join(folder, "caption.md"), "utf8"));
const script = fs.readFileSync(path.join(folder, "script.txt"), "utf8").trim();

// Verificar que no exista ya
const existing = await prisma.piece.findUnique({ where: { slug } });
if (existing) {
  console.error(`Ya existe una Piece con slug="${slug}". Usá update si querés modificar.`);
  process.exit(1);
}

const template = await ensureHyperframesTemplate();

// Subir video y thumbnail a Vercel Blob
console.log("Subiendo video a Vercel Blob...");
const videoBuffer = fs.readFileSync(path.join(folder, "output.mp4"));
const { url: videoUrl } = await put(`videos/${slug}.mp4`, videoBuffer, {
  access: "public",
  contentType: "video/mp4",
  addRandomSuffix: false,
  allowOverwrite: true,
});
console.log(`  video: ${videoUrl}`);

console.log("Subiendo thumbnail a Vercel Blob...");
const thumbBuffer = fs.readFileSync(path.join(folder, "thumbnail.jpg"));
const { url: thumbnailUrl } = await put(`thumbnails/${slug}.jpg`, thumbBuffer, {
  access: "public",
  contentType: "image/jpeg",
  addRandomSuffix: false,
  allowOverwrite: true,
});
console.log(`  thumbnail: ${thumbnailUrl}`);

// Crear Piece + Generation activa
console.log("Creando Piece en DB...");
const piece = await prisma.piece.create({
  data: {
    slug,
    templateId: template.id,
    pillar: meta.pillar || null,
    topic: meta.title || meta.hook || null,
    fieldValues: {
      script,
      exampleFolder: folderArg.replace(/^\/?/, ""),
    },
    caption,
    hashtags,
    // GENERATED porque el asset se rendereó antes de registrar.
    // Para HYPERFRAMES no hay paso de "generar desde la UI" — la pieza nace lista.
    status: "GENERATED",
    imageUrl: thumbnailUrl, // para listados sin player de video
    videoUrl,
    thumbnailUrl,
    costUsd: 0.1, // estimado
    generations: {
      create: {
        imageUrl: thumbnailUrl,
        videoUrl,
        prompt: script.slice(0, 2000),
        model: "elevenlabs:tts+music + hyperframes",
        costUsd: 0.1,
        durationMs: (Number(meta.duration_sec) || 38) * 1000,
        isActive: true,
      },
    },
  },
});

console.log("\n──────────────────────────────────────────");
console.log("✓ Pieza registrada");
console.log(`  slug:      ${piece.slug}`);
console.log(`  pillar:    ${piece.pillar}`);
console.log(`  topic:     ${piece.topic}`);
console.log(`  videoUrl:  ${videoUrl}`);
console.log(`  UI:        https://dev.onmindcrm.com/dashboard/piezas/${piece.slug}`);
console.log("──────────────────────────────────────────");

await prisma.$disconnect();
