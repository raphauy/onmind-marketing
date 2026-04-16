// Post-procesamiento: agrega logo OnMind + @OnMindApp
// al margen inferior de imágenes generadas por IA.
//
// Usa Satori para renderizar el overlay como PNG transparente,
// luego lo compone sobre la imagen original con sharp.
//
// Uso:
//   node scripts/add-logo-overlay.mjs <imagen.png>
//   node scripts/add-logo-overlay.mjs <imagen.png> --dark   (logo blanco para fondos oscuros)
//   node scripts/add-logo-overlay.mjs imagen1.png imagen2.png imagen3.png

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FONTS_DIR = join(ROOT, "node_modules/geist/dist/fonts/geist-sans");

// Fonts
const geistMedium = readFileSync(join(FONTS_DIR, "Geist-Medium.ttf"));
const geistSemiBold = readFileSync(join(FONTS_DIR, "Geist-SemiBold.ttf"));

const fonts = [
  { name: "Geist", data: geistMedium, weight: 500, style: "normal" },
  { name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
];

// Logo
const isotipoPng = readFileSync(
  join(ROOT, "assets/logo/isotipo-OnMind-transparente.png")
);
const isotipoBase64 = `data:image/png;base64,${isotipoPng.toString("base64")}`;

const isotipoBlancoPng = readFileSync(
  join(ROOT, "assets/logo/isotipo-OnMind-blanco.png")
);
const isotipoBlanco = `data:image/png;base64,${isotipoBlancoPng.toString("base64")}`;

// --- Overlay template ---

function createOverlay(width, height, dark = false) {
  const textColor = dark ? "#FFFFFF" : "#0A0A0A";
  const mutedColor = dark ? "#CCCCCC" : "#737373";
  const logoSrc = dark ? isotipoBlanco : isotipoBase64;

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              position: "absolute",
              bottom: "20px",
              left: "0",
              right: "0",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            },
            children: [
              {
                type: "img",
                props: {
                  src: logoSrc,
                  width: 28,
                  height: 28,
                  style: { borderRadius: "50%" },
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontFamily: "Geist",
                    fontWeight: 600,
                    fontSize: "18px",
                    color: textColor,
                  },
                  children: "OnMind",
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontFamily: "Geist",
                    fontWeight: 500,
                    fontSize: "16px",
                    color: mutedColor,
                  },
                  children: "@OnMindApp",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// --- Main ---

async function processImage(inputPath, dark) {
  if (!existsSync(inputPath)) {
    console.error(`Archivo no encontrado: ${inputPath}`);
    return;
  }

  // Leer dimensiones de la imagen original
  const metadata = await sharp(inputPath).metadata();
  const { width, height } = metadata;

  console.log(`📐 ${basename(inputPath)}: ${width}x${height}`);

  // Generar overlay con Satori
  const overlay = createOverlay(width, height, dark);
  const svg = await satori(overlay, { width, height, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  const overlayPng = resvg.render().asPng();

  // Componer: imagen original + overlay
  const output = await sharp(inputPath)
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .png()
    .toBuffer();

  // Guardar con sufijo -branded
  const ext = extname(inputPath);
  const name = basename(inputPath, ext);
  const dir = dirname(inputPath);
  const outputPath = join(dir, `${name}-branded${ext}`);

  writeFileSync(outputPath, output);
  console.log(`   ✅ ${basename(outputPath)} (${(output.length / 1024).toFixed(0)} KB)`);

  return outputPath;
}

async function main() {
  const args = process.argv.slice(2);
  const dark = args.includes("--dark");
  const files = args.filter((a) => !a.startsWith("--"));

  if (files.length === 0) {
    console.log("Uso: node scripts/add-logo-overlay.mjs <imagen.png> [--dark]");
    process.exit(1);
  }

  for (const file of files) {
    await processImage(file, dark);
  }
}

main().catch(console.error);
