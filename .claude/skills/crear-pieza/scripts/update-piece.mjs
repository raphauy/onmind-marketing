// Actualiza una pieza existente. Patch parcial sobre fieldValues / caption / hashtags / topic / pillar.
//
// Uso:
//   node .claude/skills/crear-pieza/scripts/update-piece.mjs <slug> '<JSON>' [--force]
//
// Reglas:
// - fieldValues hace MERGE con los valores actuales (solo se reemplazan las keys provistas).
// - caption, hashtags, topic, pillar se reemplazan completos.
// - Las keys de fieldValues deben existir en el template.
// - Si la pieza ya fue generada (GENERATED, APPROVED, SCHEDULED, PUBLISHED) y se tocan
//   fieldValues, se requiere --force porque invalidaría el asset renderizado. Tocar
//   caption/hashtags/topic/pillar no requiere --force porque no afecta el render.

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", "..", "..", "..", ".env.local") });

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const positional = argv.filter((a) => a !== "--force");

const slug = positional[0];
const patchJson = positional[1];

if (!slug || !patchJson) {
  console.error(
    JSON.stringify({
      success: false,
      error: "Uso: node update-piece.mjs <slug> '<JSON>' [--force]",
    }),
  );
  process.exit(1);
}

let patch;
try {
  patch = JSON.parse(patchJson);
} catch (err) {
  console.error(JSON.stringify({ success: false, error: `JSON inválido: ${err.message}` }));
  process.exit(1);
}

const ALLOWED_KEYS = ["fieldValues", "caption", "hashtags", "topic", "pillar"];
const unknownKeys = Object.keys(patch).filter((k) => !ALLOWED_KEYS.includes(k));
if (unknownKeys.length > 0) {
  console.error(
    JSON.stringify({
      success: false,
      error: `Keys no permitidas: ${unknownKeys.join(", ")}. Permitidas: ${ALLOWED_KEYS.join(", ")}`,
    }),
  );
  process.exit(1);
}

if (Object.keys(patch).length === 0) {
  console.error(JSON.stringify({ success: false, error: "El patch está vacío" }));
  process.exit(1);
}

const piece = await prisma.piece.findUnique({
  where: { slug },
  include: { template: true },
});

if (!piece) {
  console.error(JSON.stringify({ success: false, error: `Pieza no encontrada: ${slug}` }));
  process.exit(1);
}

const tocaRender = "fieldValues" in patch;

if (tocaRender) {
  if (
    typeof patch.fieldValues !== "object" ||
    Array.isArray(patch.fieldValues) ||
    patch.fieldValues === null
  ) {
    console.error(
      JSON.stringify({ success: false, error: "fieldValues debe ser un objeto" }),
    );
    process.exit(1);
  }

  const templateFieldKeys = piece.template.fields.map((f) => f.key);
  const invalid = Object.keys(patch.fieldValues).filter(
    (k) => !templateFieldKeys.includes(k),
  );
  if (invalid.length > 0) {
    console.error(
      JSON.stringify({
        success: false,
        error: `Keys de fieldValues no existen en template "${piece.template.slug}": ${invalid.join(", ")}. Permitidas: ${templateFieldKeys.join(", ")}`,
      }),
    );
    process.exit(1);
  }
}

const BLOCKING_STATUSES = ["GENERATED", "APPROVED", "SCHEDULED", "PUBLISHED"];
if (tocaRender && BLOCKING_STATUSES.includes(piece.status) && !force) {
  console.error(
    JSON.stringify({
      success: false,
      error: `La pieza está en status ${piece.status}. Cambiar fieldValues invalida el asset ya generado. Volvé a correr con --force para confirmar, o limitá el patch a caption/hashtags/topic/pillar.`,
    }),
  );
  process.exit(1);
}

const data = {};
if (tocaRender) {
  data.fieldValues = { ...piece.fieldValues, ...patch.fieldValues };
}
if ("caption" in patch) data.caption = patch.caption;
if ("hashtags" in patch) data.hashtags = patch.hashtags;
if ("topic" in patch) data.topic = patch.topic;
if ("pillar" in patch) data.pillar = patch.pillar;

const updated = await prisma.piece.update({
  where: { slug },
  data,
  include: { template: true },
});

const changedKeys = Object.keys(data);

console.log(
  JSON.stringify(
    {
      success: true,
      piece: {
        slug: updated.slug,
        status: updated.status,
        template: updated.template.name,
        pillar: updated.pillar,
        topic: updated.topic,
        fieldValues: updated.fieldValues,
        caption: updated.caption,
        hashtags: updated.hashtags,
        url: `https://dev.onmindcrm.com/dashboard/piezas/${updated.slug}`,
      },
      changed: changedKeys,
      forced: force && tocaRender,
    },
    null,
    2,
  ),
);

await prisma.$disconnect();
