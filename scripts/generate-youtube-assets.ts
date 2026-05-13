import sharp from "sharp";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs/promises";
import path from "path";

const TEAL = "#007056";
const TEAL_HOVER = "#00876D";
const ISOTIPO_SVG = path.resolve("assets/logo/onmind-isotipo.svg");
const FONT_BOLD = path.resolve("public/fonts/Geist-Bold.ttf");
const FONT_REGULAR = path.resolve("public/fonts/Geist-Regular.ttf");
const OUT_DIR = path.resolve("public/youtube");

async function loadIsotipoSvg(color: string): Promise<Buffer> {
  const svg = await fs.readFile(ISOTIPO_SVG, "utf-8");
  const colored = svg.replace(/fill="#007056"/g, `fill="${color}"`);
  return Buffer.from(colored);
}

async function generateAvatar() {
  const svgBuf = await loadIsotipoSvg("#ffffff");
  const isotipo = await sharp(svgBuf)
    .resize(520, 520, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: 800,
      height: 800,
      channels: 4,
      background: TEAL,
    },
  })
    .composite([{ input: isotipo, gravity: "center" }])
    .png()
    .toFile(path.join(OUT_DIR, "avatar.png"));

  console.log("✓ avatar.png (800x800)");
}

async function generateWatermark() {
  const circleSvg = Buffer.from(
    `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
       <circle cx="75" cy="75" r="75" fill="${TEAL}"/>
     </svg>`,
  );

  const isotipo = await sharp(await loadIsotipoSvg("#ffffff"))
    .resize(90, 90, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp(circleSvg)
    .composite([{ input: isotipo, gravity: "center" }])
    .png()
    .toFile(path.join(OUT_DIR, "watermark.png"));

  console.log("✓ watermark.png (150x150)");
}

async function generateBanner() {
  const fontBold = await fs.readFile(FONT_BOLD);
  const fontRegular = await fs.readFile(FONT_REGULAR);
  const isotipoPng = await sharp(await loadIsotipoSvg("#ffffff"))
    .resize(280, 280, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const isotipoB64 = `data:image/png;base64,${isotipoPng.toString("base64")}`;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 2560,
          height: 1440,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_HOVER} 100%)`,
        },
        children: {
          type: "div",
          props: {
            style: {
              width: 1546,
              height: 423,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            },
            children: [
              {
                type: "img",
                props: {
                  src: isotipoB64,
                  width: 140,
                  height: 140,
                  style: { marginBottom: 36 },
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 80,
                    color: "white",
                    fontWeight: 700,
                    textAlign: "center",
                    letterSpacing: -1.5,
                    lineHeight: 1.1,
                    fontFamily: "Geist",
                  },
                  children: "Mantenemos vivo el vínculo\ncon tus clientes",
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 32,
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 400,
                    textAlign: "center",
                    marginTop: 28,
                    fontFamily: "Geist",
                  },
                  children: "Tutoriales · Estrategias · Casos reales",
                },
              },
            ],
          },
        },
      },
    },
    {
      width: 2560,
      height: 1440,
      fonts: [
        { name: "Geist", data: fontBold, weight: 700, style: "normal" },
        { name: "Geist", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 2560 },
  })
    .render()
    .asPng();

  await fs.writeFile(path.join(OUT_DIR, "banner.png"), png);
  console.log("✓ banner.png (2560x1440)");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await generateAvatar();
  await generateWatermark();
  await generateBanner();
  console.log(`\nGenerados en ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
