/**
 * Test de templates AdCrate adaptados para OnMind.
 *
 * Genera 4 imágenes con GPT-5 Image Mini via OpenRouter,
 * usando la técnica AdCrate: Brand DNA modifier + template detallado.
 *
 * Uso:
 *   node scripts/test-adcrate-templates.mjs
 *   node scripts/test-adcrate-templates.mjs --template=1
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

dotenv.config({ path: join(ROOT, ".env.local") });

const API_KEY = process.env.OPEN_ROUTER_API_KEY;
if (!API_KEY) {
  console.error("Error: OPEN_ROUTER_API_KEY no está configurada en .env.local");
  process.exit(1);
}

const DEFAULT_MODEL = "google/gemini-3.1-flash-image-preview"; // Nano Banana 2
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// --- OnMind Brand DNA Modifier (prepend a cada prompt) ---

const BRAND_MODIFIER = `OnMind brand style: clean, professional B2B SaaS aesthetic. Primary color deep teal (#007056), accent (#00876D), light mint background (#E1F3ED), white (#FEFEFE), dark text (#0A0A0A), muted gray (#737373). Typography: modern geometric sans-serif (Geist-style), bold for headlines, medium for body. Photography direction: bright, warm, trustworthy. Mood: calm confidence, professional empathy. The product is a WhatsApp automation platform shown on smartphone screens. All text in Spanish rioplatense. No emojis in design.`;

// --- Templates adaptados para OnMind ---

const TEMPLATES = {
  1: {
    name: "headline",
    description: "Headline + celular con WhatsApp",
    prompt: `${BRAND_MODIFIER}

Create: a static ad with a white (#FEFEFE) background, 4:5 portrait format (1080x1350px). Top third: large bold sans-serif headline in dark (#0A0A0A) reading "Tu cliente se olvidó de vos. Vos no te olvides de él." Below in smaller medium-weight teal (#007056) text: "OnMind envía mensajes por vos para que ningún vínculo se pierda." Bottom half: a modern smartphone (iPhone-style, dark frame) showing a WhatsApp conversation screen with a sent message that reads "¡Feliz cumpleaños, María! Un abrazo del equipo de la inmobiliaria" with a green WhatsApp sent bubble and a double blue checkmark. The phone sits on a clean white surface with soft shadow beneath. Shot at 50mm f/2.8 from slightly above. Clean, authoritative, minimal.

CRITICAL RULES:
- All text must be in Spanish exactly as written above. Do not change any word.
- The headline "Tu cliente se olvidó de vos. Vos no te olvides de él." must appear EXACTLY ONCE. Do NOT repeat it or any part of it.
- Do NOT add any logo, watermark, or brand mark anywhere.
- Leave bottom 80px clean/empty for logo overlay in post-production.
- No decorative elements, no patterns, no geometric shapes.
- The phone screen must look realistic with WhatsApp UI.`,
  },

  4: {
    name: "features-pointout",
    description: "Diagrama educativo: celular centro + callouts",
    prompt: `${BRAND_MODIFIER}

Create: an educational diagram-style ad on white (#FEFEFE) background, 4:5 portrait format (1080x1350px). Top: bold teal (#007056) sans-serif text reading "¿Qué hace OnMind por tu negocio?" in large size. Below: a modern smartphone centered showing a WhatsApp Business interface with a list of scheduled messages, even studio lighting, subtle shadow. Four callout boxes with thin connecting lines pointing to the phone from each side:

Top-left callout: small teal (#007056) circle bullet, bold text "Mensajes de cumpleaños automáticos"
Top-right callout: small teal circle bullet, bold text "Recordatorios de vencimientos"
Bottom-left callout: small teal circle bullet, bold text "Seguimiento post-venta programado"
Bottom-right callout: small teal circle bullet, bold text "Saludos en fechas especiales"

The connecting lines are thin, elegant, slightly curved, in light gray (#E5E5E5). Callout text in dark (#0A0A0A) sans-serif. Layout feels like a scientific diagram redesigned by a luxury design agency. Generous whitespace.

CRITICAL RULES:
- All text in Spanish exactly as written. Do not rephrase.
- Do NOT add any logo, watermark, or brand mark.
- Leave bottom 80px clean for logo overlay.
- No colored backgrounds on callout boxes — just text and thin lines.
- The phone must look photorealistic with a realistic WhatsApp-like interface.`,
  },

  7: {
    name: "us-vs-them",
    description: "Manual vs OnMind — comparación lado a lado",
    prompt: `${BRAND_MODIFIER}

Create: a side-by-side comparison ad divided vertically, 4:5 portrait format (1080x1350px). Left half: muted warm gray (#F0EDED) background. Right half: deep teal (#007056) background.

Center top: a small white circle with bold "VS" text in dark gray.

Left side header: "Gestión manual" in bold dark (#0A0A0A) sans-serif. Below: a slightly messy desk scene suggestion (subtle, out of focus) with sticky notes. Then a vertical list with red circle X marks:
"❌ Te olvidás de los cumpleaños"
"❌ Perdés el seguimiento a los 3 días"
"❌ Copiás y pegás mensajes uno por uno"
"❌ Dependés de tu memoria"
"❌ Tus clientes se van en silencio"

Right side header: "Con OnMind" in bold white sans-serif. Below: a clean smartphone showing WhatsApp (subtle, out of focus). Then a vertical list with green circle checkmarks:
"✅ Saludos automáticos en cada fecha"
"✅ Plan de seguimiento que no falla"
"✅ Mensajes personalizados y programados"
"✅ El sistema recuerda por vos"
"✅ Tus clientes sienten que los cuidás"

Text on left side in dark (#0A0A0A), text on right side in white (#FEFEFE). Clean sans-serif typography. Lists have generous line spacing.

CRITICAL RULES:
- All text in Spanish exactly as written. Do not modify any line.
- Do NOT add any logo, watermark, or brand mark.
- Leave bottom 80px clean for logo overlay.
- The ❌ and ✅ should be simple colored circle icons, not emoji.
- Keep it clean and professional, not busy.`,
  },

  13: {
    name: "stat-surround",
    description: "Celular centro + estadísticas radiales con flechas",
    prompt: `${BRAND_MODIFIER}

Create: a static ad on a white-to-light-mint (#FEFEFE to #E1F3ED) subtle gradient background, 4:5 portrait format (1080x1350px).

HEADLINE (top 15%):
Large bold dark (#0A0A0A) sans-serif: "¿Por qué las inmobiliarias eligen OnMind?"

PHONE (center, 50% of image):
A modern iPhone showing a WhatsApp chat. The screen shows exactly this conversation:
- Contact name at top: "María López"
- One green sent bubble reading: "Hola María, te recordamos que tu contrato vence el 15/05. ¿Coordinamos la renovación?"
- One gray received bubble reading: "¡Sí! Justo iba a llamarlos. Gracias por avisar."
- Blue double checkmarks on the sent message.
The phone has soft studio lighting and a subtle shadow.

STATS (flanking the phone, 4 callouts):
Each stat has a thin curved arrow in teal (#007056) pointing toward the phone.

Top-left: "3x" in oversized bold teal, below in small dark text: "más respuestas que un email"
Bottom-left: "0" in oversized bold teal, below: "mensajes olvidados"
Top-right: "100%" in oversized bold teal, below: "de cumpleaños recordados"
Bottom-right: "5 min" in oversized bold teal, below: "de setup inicial"

Arrows are thin, slightly curved, editorial style. Not thick or decorative.

CRITICAL RULES:
- All text exactly as written in Spanish. Do NOT rephrase or invent text.
- The WhatsApp conversation must show exactly the messages specified above.
- Do NOT add any logo, watermark, or brand mark.
- Leave bottom 80px clean for logo overlay.`,
  },
};

// --- API call ---

async function generateImage(templateKey, template, model) {
  console.log(`\n🔄 [${templateKey}] ${template.name}: ${template.description}`);

  const startTime = Date.now();

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://onmindcrm.com",
      "X-Title": "OnMind Marketing",
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: template.prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const durationMs = Date.now() - startTime;
  const message = data.choices?.[0]?.message;

  if (!message) {
    throw new Error(`Sin respuesta. Response: ${JSON.stringify(data).slice(0, 500)}`);
  }

  // Extraer imagen
  let imageBuffer = null;

  // content array (multimodal)
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "image_url" && part.image_url?.url) {
        const match = part.image_url.url.match(/^data:image\/\w+;base64,(.+)$/s);
        if (match) {
          imageBuffer = Buffer.from(match[1], "base64");
          break;
        }
      }
    }
  }

  // images array (Gemini via OpenRouter)
  if (!imageBuffer && Array.isArray(message.images)) {
    for (const img of message.images) {
      const url = img.image_url?.url || img.url;
      if (url) {
        const match = url.match(/^data:image\/\w+;base64,(.+)$/s);
        if (match) {
          imageBuffer = Buffer.from(match[1], "base64");
          break;
        }
      }
    }
  }

  const usage = data.usage || {};
  return { imageBuffer, durationMs, promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens };
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const templateArg = args.find((a) => a.startsWith("--template="));
  const selectedKeys = templateArg
    ? [templateArg.replace("--template=", "")]
    : Object.keys(TEMPLATES);

  const modelArg = args.find((a) => a.startsWith("--model="));
  const MODEL = modelArg ? modelArg.replace("--model=", "") : DEFAULT_MODEL;
  const modelShort = MODEL.split("/").pop();

  const timestamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
  const outputDir = join(ROOT, "output", "comparativas", `adcrate-${timestamp}`);
  mkdirSync(outputDir, { recursive: true });

  console.log("=".repeat(60));
  console.log(`AdCrate Templates — OnMind (${modelShort})`);
  console.log("=".repeat(60));
  console.log(`Modelo: ${MODEL}`);
  console.log(`Output: ${outputDir}`);

  const results = [];

  for (const key of selectedKeys) {
    const template = TEMPLATES[key];
    if (!template) {
      console.error(`Template ${key} no existe. Disponibles: ${Object.keys(TEMPLATES).join(", ")}`);
      continue;
    }

    try {
      const result = await generateImage(key, template, MODEL);
      results.push({ key, ...template, ...result });

      // Guardar prompt
      writeFileSync(join(outputDir, `${template.name}-prompt.txt`), template.prompt);

      if (result.imageBuffer) {
        const filename = `${template.name}.png`;
        writeFileSync(join(outputDir, filename), result.imageBuffer);
        console.log(
          `   ✅ ${filename} (${(result.imageBuffer.length / 1024).toFixed(0)} KB, ${(result.durationMs / 1000).toFixed(1)}s, ${result.promptTokens}+${result.completionTokens} tokens)`
        );
      } else {
        console.log(`   ⚠️ No se obtuvo imagen`);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({ key, ...template, error: error.message });
    }
  }

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("RESUMEN");
  console.log("=".repeat(60));
  console.table(
    results.map((r) => ({
      template: r.name,
      imagen: r.imageBuffer ? `${(r.imageBuffer.length / 1024).toFixed(0)} KB` : "N/A",
      tiempo: r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : "N/A",
      tokens: r.promptTokens ? `${r.promptTokens}+${r.completionTokens}` : "N/A",
      error: r.error || "",
    }))
  );

  console.log(`\nImágenes en: ${outputDir}/`);
}

main().catch(console.error);
