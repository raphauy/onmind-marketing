// Genera la imagen de una pieza creativa.
// Lee la piece de la DB, arma el prompt, llama a OpenRouter,
// guarda la imagen, agrega logo, actualiza la DB.
//
// Uso:
//   node scripts/generate-piece.mjs --piece=<slug>
//   node scripts/generate-piece.mjs --piece=<slug> --no-overlay   (sin logo)

import { prisma } from "./lib/db.mjs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "output", "piezas");
const FONTS_DIR = join(ROOT, "node_modules/geist/dist/fonts/geist-sans");
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.OPEN_ROUTER_API_KEY;

mkdirSync(OUTPUT_DIR, { recursive: true });

// --- Logo overlay ---

const geistMedium = readFileSync(join(FONTS_DIR, "Geist-Medium.ttf"));
const geistSemiBold = readFileSync(join(FONTS_DIR, "Geist-SemiBold.ttf"));
const fonts = [
  { name: "Geist", data: geistMedium, weight: 500, style: "normal" },
  { name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
];

const isotipoBase64 = `data:image/png;base64,${readFileSync(join(ROOT, "assets/logo/isotipo-OnMind-transparente.png")).toString("base64")}`;
const isotipoBlanco = `data:image/png;base64,${readFileSync(join(ROOT, "assets/logo/isotipo-OnMind-blanco.png")).toString("base64")}`;

function createOverlay(width, height, dark) {
  const textColor = dark ? "#FFFFFF" : "#0A0A0A";
  const mutedColor = dark ? "#CCCCCC" : "#737373";
  const logoSrc = dark ? isotipoBlanco : isotipoBase64;

  return {
    type: "div",
    props: {
      style: { display: "flex", width: `${width}px`, height: `${height}px`, position: "relative" },
      children: [{
        type: "div",
        props: {
          style: {
            display: "flex", position: "absolute", bottom: "20px",
            left: "0", right: "0", justifyContent: "center", alignItems: "center", gap: "10px",
          },
          children: [
            { type: "img", props: { src: logoSrc, width: 28, height: 28, style: { borderRadius: "50%" } } },
            { type: "span", props: { style: { fontFamily: "Geist", fontWeight: 600, fontSize: "18px", color: textColor }, children: "OnMind" } },
            { type: "span", props: { style: { fontFamily: "Geist", fontWeight: 500, fontSize: "16px", color: mutedColor }, children: "@OnMindApp" } },
          ],
        },
      }],
    },
  };
}

async function addLogoOverlay(imageBuffer, dark) {
  const metadata = await sharp(imageBuffer).metadata();
  const { width, height } = metadata;

  const overlay = createOverlay(width, height, dark);
  const svg = await satori(overlay, { width, height, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  const overlayPng = resvg.render().asPng();

  return sharp(imageBuffer)
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .png()
    .toBuffer();
}

// --- Prompt builder ---

function buildPrompt(template, fieldValues) {
  let prompt = template.promptTemplate;
  for (const [key, value] of Object.entries(fieldValues)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }

  // Verificar que no quedan placeholders sin reemplazar
  const remaining = prompt.match(/\{\{(\w+)\}\}/g);
  if (remaining) {
    throw new Error(`Placeholders sin valor: ${remaining.join(", ")}`);
  }

  return prompt;
}

// --- OpenRouter ---

async function callOpenRouter(prompt, model) {
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
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter HTTP ${response.status}: ${text}`);
  }

  return response.json();
}

function extractImage(data) {
  const message = data.choices?.[0]?.message;
  if (!message) return null;

  // content array (multimodal)
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "image_url" && part.image_url?.url) {
        const match = part.image_url.url.match(/^data:image\/\w+;base64,(.+)$/s);
        if (match) return Buffer.from(match[1], "base64");
      }
    }
  }

  // images array (Gemini via OpenRouter)
  if (Array.isArray(message.images)) {
    for (const img of message.images) {
      const url = img.image_url?.url || img.url;
      if (url) {
        const match = url.match(/^data:image\/\w+;base64,(.+)$/s);
        if (match) return Buffer.from(match[1], "base64");
      }
    }
  }

  return null;
}

// --- Main ---

async function main() {
  if (!API_KEY) {
    console.error("Error: OPEN_ROUTER_API_KEY no configurada en .env.local");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const pieceSlug = args
    .find((a) => a.startsWith("--piece="))
    ?.replace("--piece=", "");
  const noOverlay = args.includes("--no-overlay");

  if (!pieceSlug) {
    // Listar pieces pendientes
    const drafts = await prisma.piece.findMany({
      where: { status: "DRAFT" },
      include: { template: { select: { name: true, costPerImage: true } } },
      orderBy: { createdAt: "desc" },
    });

    if (drafts.length === 0) {
      console.log("No hay pieces en estado DRAFT.");
    } else {
      console.log("Pieces pendientes de generar:\n");
      for (const p of drafts) {
        console.log(`  --piece=${p.slug}`);
        console.log(`    Template: ${p.template.name} ($${p.template.costPerImage})`);
        console.log(`    Topic: ${p.topic || "(sin tema)"}\n`);
      }
    }
    process.exit(0);
  }

  // Cargar piece + template
  const piece = await prisma.piece.findUnique({
    where: { slug: pieceSlug },
    include: { template: true },
  });

  if (!piece) {
    console.error(`Piece "${pieceSlug}" no encontrada.`);
    process.exit(1);
  }

  if (piece.status !== "DRAFT" && piece.status !== "FAILED") {
    console.error(`Piece "${pieceSlug}" tiene status ${piece.status}, no se puede generar.`);
    process.exit(1);
  }

  const { template } = piece;
  console.log("=".repeat(50));
  console.log(`Generando: ${piece.slug}`);
  console.log(`Template: ${template.name}`);
  console.log(`Modelo: ${template.model}`);
  console.log(`Costo estimado: $${template.costPerImage}`);
  console.log("=".repeat(50));

  // 1. Marcar como GENERATING
  await prisma.piece.update({
    where: { id: piece.id },
    data: { status: "GENERATING" },
  });

  try {
    // 2. Construir prompt
    const prompt = buildPrompt(template, piece.fieldValues);

    // 3. Llamar a OpenRouter
    console.log("\n🔄 Generando imagen...");
    const startTime = Date.now();
    const data = await callOpenRouter(prompt, template.model);
    const durationMs = Date.now() - startTime;

    // 4. Extraer imagen
    const imageBuffer = extractImage(data);
    if (!imageBuffer) {
      throw new Error("No se obtuvo imagen del modelo.");
    }

    console.log(`   ✅ Imagen recibida (${(imageBuffer.length / 1024).toFixed(0)} KB, ${(durationMs / 1000).toFixed(1)}s)`);

    // 5. Agregar logo overlay
    let finalImage = imageBuffer;
    if (!noOverlay) {
      console.log("   🏷️  Agregando logo...");
      finalImage = await addLogoOverlay(imageBuffer, template.darkOverlay);
    }

    // 6. Guardar localmente
    const localPath = join(OUTPUT_DIR, `${piece.slug}.png`);
    writeFileSync(localPath, finalImage);
    console.log(`   💾 Guardada: ${localPath}`);

    // 7. Calcular costo real
    const usage = data.usage || {};
    const costUsd = template.costPerImage; // Usar el estimado del template

    // 8. Actualizar piece en DB
    await prisma.piece.update({
      where: { id: piece.id },
      data: {
        status: "GENERATED",
        localPath: `output/piezas/${piece.slug}.png`,
        prompt,
        generatedAt: new Date(),
        generationMs: durationMs,
        modelUsed: template.model,
        costUsd,
      },
    });

    console.log(`\n✅ Piece generada exitosamente`);
    console.log(`   Status: GENERATED`);
    console.log(`   Costo: $${costUsd}`);
    console.log(`   Tiempo: ${(durationMs / 1000).toFixed(1)}s`);
    console.log(`   Tokens: ${usage.prompt_tokens || "?"}+${usage.completion_tokens || "?"}`);
    console.log(`\n   Imagen: ${localPath}`);
  } catch (error) {
    // Marcar como FAILED
    await prisma.piece.update({
      where: { id: piece.id },
      data: { status: "FAILED" },
    });
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
