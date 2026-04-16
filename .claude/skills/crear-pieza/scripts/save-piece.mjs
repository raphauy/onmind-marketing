// Guarda una pieza en la DB como DRAFT.
// Uso: echo '{"templateSlug":"headline","fieldValues":{...},...}' | node .claude/skills/crear-pieza/scripts/save-piece.mjs
// O:   node .claude/skills/crear-pieza/scripts/save-piece.mjs '{"templateSlug":"headline",...}'

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

// Leer input: argumento o stdin
let input;
if (process.argv[2]) {
  input = process.argv[2];
} else {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  input = Buffer.concat(chunks).toString();
}

const data = JSON.parse(input);

// Validar
if (!data.templateSlug) {
  console.error(JSON.stringify({ error: "templateSlug es requerido" }));
  process.exit(1);
}
if (!data.fieldValues || Object.keys(data.fieldValues).length === 0) {
  console.error(JSON.stringify({ error: "fieldValues es requerido" }));
  process.exit(1);
}

// Buscar template
const template = await prisma.template.findUnique({
  where: { slug: data.templateSlug },
});

if (!template) {
  console.error(JSON.stringify({ error: `Template "${data.templateSlug}" no encontrado` }));
  process.exit(1);
}

// Validar campos requeridos
const fields = template.fields;
const missing = fields
  .filter((f) => f.required && !data.fieldValues[f.key])
  .map((f) => f.key);

if (missing.length > 0) {
  console.error(JSON.stringify({ error: `Campos requeridos faltantes: ${missing.join(", ")}` }));
  process.exit(1);
}

// Crear pieza
const timestamp = Date.now().toString(36);
const slug = `${template.slug}-${timestamp}`;

const piece = await prisma.piece.create({
  data: {
    slug,
    templateId: template.id,
    fieldValues: data.fieldValues,
    pillar: data.pillar || null,
    topic: data.topic || null,
    caption: data.caption || null,
    hashtags: data.hashtags || [],
    status: "DRAFT",
  },
});

const result = {
  success: true,
  piece: {
    slug: piece.slug,
    id: piece.id,
    template: template.name,
    pillar: data.pillar,
    topic: data.topic,
    costEstimate: template.costPerImage,
    url: `https://dev.onmindcrm.com/dashboard/piezas/${piece.slug}`,
  },
};

console.log(JSON.stringify(result, null, 2));
await prisma.$disconnect();
