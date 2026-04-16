/**
 * Script comparativo de modelos de imagen via OpenRouter.
 *
 * Envía el mismo prompt de infografía a los 5 modelos disponibles
 * y guarda las imágenes en output/comparativas/ para evaluar lado a lado.
 *
 * Uso:
 *   node scripts/compare-infografia.mjs
 *   node scripts/compare-infografia.mjs --models nano-banana-pro,gpt-5-image
 *   node scripts/compare-infografia.mjs --prompt "tema personalizado"
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

// --- Modelos disponibles en OpenRouter con output de imagen ---

const MODELS = {
  "nano-banana": {
    id: "google/gemini-2.5-flash-image",
    name: "Nano Banana (Gemini 2.5 Flash)",
    cost: "$0.30/M",
  },
  "nano-banana-2": {
    id: "google/gemini-3.1-flash-image-preview",
    name: "Nano Banana 2 (Gemini 3.1 Flash)",
    cost: "$0.50/M",
  },
  "nano-banana-pro": {
    id: "google/gemini-3-pro-image-preview",
    name: "Nano Banana Pro (Gemini 3 Pro)",
    cost: "$2.00/M",
  },
  "gpt-5-image-mini": {
    id: "openai/gpt-5-image-mini",
    name: "GPT-5 Image Mini",
    cost: "$2.50/M",
  },
  "gpt-5-image": {
    id: "openai/gpt-5-image",
    name: "GPT-5 Image",
    cost: "$10.00/M",
  },
};

// --- Prompt de infografía OnMind ---

const DEFAULT_PROMPT = `Create a visually striking vertical infographic, 4:5 portrait format (1080x1350px).

CONTENT (use this text EXACTLY — do not rephrase, translate, or add any other text):
Title: "5 señales de que perdiste el vínculo con tu cliente"
1. "Llevas 3 meses sin contactarlo"
2. "Solo escribís cuando hay algo para vender"
3. "Sus respuestas se volvieron monosilábicas"
4. "Dejó de asistir a tus reuniones"
5. "Ya no te recomienda con nadie"

DESIGN DIRECTION:
Professional, minimal, clean. Think Linear, Stripe, or Notion design language — elegant but not boring.
- White background (#FEFEFE).
- Teal (#007056) for the numbers (large, bold weight) and a thin accent line or subtle divider between sections. Keep it restrained.
- Each section should have: a large teal number, the text in dark (#0A0A0A), and a thin subtle line or elegant icon to separate from the next section.
- The title should be bold, large, and dark — it's the hero of the infographic.
- Generous whitespace between sections. Clean vertical flow.
- Subtle thin-line icons next to each point that visually represent the concept (clock, speech bubble, message, calendar, x). Keep them minimal, single-color (#007056), thin stroke style.
- NO colored blocks or backgrounds for sections. NO geometric decoration. NO patterns. NO gradients.
- The design should feel calm, trustworthy, sophisticated — premium quality.
- Leave a clean 80px margin at the bottom (I will add my logo there in post-production)

TYPOGRAPHY:
Modern sans-serif. Bold headline. Mix of weights for visual interest.
ALL text is in Spanish. Copy every character exactly as written above, including accents (í, ó, á, é).

CRITICAL RULES:
- Do NOT add any text beyond what is listed in CONTENT. No subtitles, no explanations, no footer text.
- Do NOT add any logo, brand mark, social media handle, or watermark
- Do NOT add generic clipart or stock illustration elements
- The bottom 80px of the image should be empty/clean (reserved for logo overlay)
- Output exactly 1080x1350 pixels
- NEVER split a word across lines. Every word must appear complete on a single line. If "vínculo" doesn't fit on one line, make the font smaller or rearrange the layout — do NOT break it into "víncu-lo" or truncate it.
- Spanish accents must be exact: í (not ĩ or ã), ó, á, é. Double-check every accented character.`;

// --- OpenRouter API ---

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function generateImage(modelKey, prompt) {
  const model = MODELS[modelKey];
  console.log(`\n🔄 Generando con ${model.name} (${model.cost})...`);

  const startTime = Date.now();

  const body = {
    model: model.id,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://onmindcrm.com",
      "X-Title": "OnMind Marketing",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const durationMs = Date.now() - startTime;

  // Debug: guardar response raw
  const debugDir = join(ROOT, "output", "comparativas", "_debug");
  mkdirSync(debugDir, { recursive: true });
  writeFileSync(
    join(debugDir, `${modelKey}-raw.json`),
    JSON.stringify(data, null, 2)
  );

  // Extraer imagen del response
  // OpenRouter devuelve content como array de parts o como string
  const message = data.choices?.[0]?.message;
  if (!message) {
    throw new Error(`Sin respuesta del modelo. Response: ${JSON.stringify(data).slice(0, 500)}`);
  }

  let imageBuffer = null;
  let textContent = "";

  // Caso 1: content es un array de parts (multimodal)
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "image_url" && part.image_url?.url) {
        // Base64 data URL
        const base64Match = part.image_url.url.match(
          /^data:image\/\w+;base64,(.+)$/
        );
        if (base64Match) {
          imageBuffer = Buffer.from(base64Match[1], "base64");
        }
      } else if (part.type === "text") {
        textContent += part.text;
      }
    }
  }

  // Caso 2: content es string con inline image (algunos modelos)
  if (!imageBuffer && typeof message.content === "string") {
    textContent = message.content;
    // Buscar base64 inline
    const b64Match = message.content.match(
      /data:image\/(\w+);base64,([A-Za-z0-9+/=]+)/
    );
    if (b64Match) {
      imageBuffer = Buffer.from(b64Match[2], "base64");
    }
  }

  // Caso 3: images array en message (Gemini via OpenRouter)
  if (!imageBuffer && Array.isArray(message.images)) {
    for (const img of message.images) {
      const url = img.image_url?.url || img.url;
      if (url) {
        const base64Match = url.match(/^data:image\/\w+;base64,(.+)$/s);
        if (base64Match) {
          imageBuffer = Buffer.from(base64Match[1], "base64");
          break;
        }
      }
      if (img.base64) {
        imageBuffer = Buffer.from(img.base64, "base64");
        break;
      }
    }
  }

  // Caso 4: imagen en field separado (OpenAI-style)
  if (!imageBuffer && data.choices?.[0]?.message?.image) {
    const img = data.choices[0].message.image;
    if (img.base64) {
      imageBuffer = Buffer.from(img.base64, "base64");
    } else if (img.url) {
      const imgResponse = await fetch(img.url);
      imageBuffer = Buffer.from(await imgResponse.arrayBuffer());
    }
  }

  const usage = data.usage || {};

  return {
    modelKey,
    modelName: model.name,
    cost: model.cost,
    durationMs,
    imageBuffer,
    textContent: textContent.slice(0, 500),
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
  };
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);

  // Parse --models flag
  let selectedModels = Object.keys(MODELS);
  const modelsArg = args.find((a) => a.startsWith("--models="));
  if (modelsArg) {
    selectedModels = modelsArg.replace("--models=", "").split(",");
    for (const key of selectedModels) {
      if (!MODELS[key]) {
        console.error(`Modelo desconocido: ${key}`);
        console.error(`Disponibles: ${Object.keys(MODELS).join(", ")}`);
        process.exit(1);
      }
    }
  }

  // Parse --prompt flag
  let prompt = DEFAULT_PROMPT;
  const promptArg = args.find((a) => a.startsWith("--prompt="));
  if (promptArg) {
    const customTopic = promptArg.replace("--prompt=", "");
    prompt = DEFAULT_PROMPT.replace(
      /CONTENT:[\s\S]*?(?=VISUAL STYLE:)/,
      `CONTENT:\n${customTopic}\n\n`
    );
  }

  // Crear directorio de output
  const timestamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
  const outputDir = join(ROOT, "output", "comparativas", timestamp);
  mkdirSync(outputDir, { recursive: true });

  // Guardar el prompt usado
  writeFileSync(join(outputDir, "prompt.txt"), prompt);

  console.log("=".repeat(60));
  console.log("Comparativa de modelos — Infografía OnMind");
  console.log("=".repeat(60));
  console.log(`Modelos: ${selectedModels.join(", ")}`);
  console.log(`Output: ${outputDir}`);

  const results = [];

  for (const modelKey of selectedModels) {
    try {
      const result = await generateImage(modelKey, prompt);
      results.push(result);

      if (result.imageBuffer) {
        const filename = `${modelKey}.png`;
        writeFileSync(join(outputDir, filename), result.imageBuffer);
        console.log(
          `   ✅ Imagen guardada: ${filename} (${(result.imageBuffer.length / 1024).toFixed(0)} KB, ${result.durationMs}ms)`
        );
      } else {
        console.log(`   ⚠️  No se obtuvo imagen. Texto devuelto:`);
        console.log(`   ${result.textContent.slice(0, 200)}`);
        // Guardar el texto de respuesta para debug
        writeFileSync(
          join(outputDir, `${modelKey}-response.txt`),
          result.textContent
        );
      }

      if (result.promptTokens) {
        console.log(
          `   Tokens: ${result.promptTokens} prompt + ${result.completionTokens} completion`
        );
      }
    } catch (error) {
      console.error(`   ❌ Error con ${MODELS[modelKey].name}: ${error.message}`);
      results.push({
        modelKey,
        modelName: MODELS[modelKey].name,
        error: error.message,
      });
    }
  }

  // Generar resumen
  console.log("\n" + "=".repeat(60));
  console.log("RESUMEN");
  console.log("=".repeat(60));

  const summary = results.map((r) => ({
    modelo: r.modelName,
    imagen: r.imageBuffer ? `${(r.imageBuffer.length / 1024).toFixed(0)} KB` : "N/A",
    tiempo: r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : "N/A",
    tokens: r.promptTokens ? `${r.promptTokens}+${r.completionTokens}` : "N/A",
    error: r.error || "",
  }));

  console.table(summary);

  // Guardar resumen como markdown
  const md = [
    `# Comparativa de infografías — ${timestamp}`,
    "",
    "## Prompt",
    "```",
    prompt,
    "```",
    "",
    "## Resultados",
    "",
    "| Modelo | Imagen | Tiempo | Tokens | Error |",
    "|--------|--------|--------|--------|-------|",
    ...summary.map(
      (s) =>
        `| ${s.modelo} | ${s.imagen} | ${s.tiempo} | ${s.tokens} | ${s.error} |`
    ),
    "",
    "## Imágenes",
    "",
    ...results
      .filter((r) => r.imageBuffer)
      .map((r) => `### ${r.modelName}\n![${r.modelKey}](./${r.modelKey}.png)\n`),
  ].join("\n");

  writeFileSync(join(outputDir, "resumen.md"), md);
  console.log(`\nResumen guardado en: ${outputDir}/resumen.md`);
  console.log(`Abrí las imágenes en ${outputDir}/ para comparar.`);
}

main().catch(console.error);
