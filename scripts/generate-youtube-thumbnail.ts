import satori from "satori";
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs/promises";
import path from "path";

const TEAL = "#007056";
const TEAL_HOVER = "#00876D";
const ACCENT_BG = "#E1F3ED";
const ISOTIPO_SVG = path.resolve("assets/logo/onmind-isotipo.svg");
const FONT_BOLD = path.resolve("public/fonts/Geist-Bold.ttf");
const FONT_REGULAR = path.resolve("public/fonts/Geist-Regular.ttf");

type Card = {
  initials: string;
  name: string;
  message: string;
  highlight: string;
};

type ThumbnailInput = {
  topLabel: string;
  title: string;
  subtitle?: string;
  cards: Card[];
  outputPath: string;
};

async function loadIsotipoSvg(color: string): Promise<Buffer> {
  const svg = await fs.readFile(ISOTIPO_SVG, "utf-8");
  return Buffer.from(svg.replace(/fill="#007056"/g, `fill="${color}"`));
}

function renderMessage(card: Card) {
  const parts = card.message.split(card.highlight);
  const children: any[] = [];
  parts.forEach((part, i) => {
    if (part) children.push(part);
    if (i < parts.length - 1) {
      children.push({
        type: "span",
        props: {
          style: { color: TEAL, fontWeight: 700 },
          children: card.highlight,
        },
      });
    }
  });
  return children;
}

async function generateThumbnail(input: ThumbnailInput) {
  const fontBold = await fs.readFile(FONT_BOLD);
  const fontRegular = await fs.readFile(FONT_REGULAR);

  const isotipoPng = await sharp(await loadIsotipoSvg("#ffffff"))
    .resize(140, 140, {
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
          width: 1280,
          height: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_HOVER} 100%)`,
          fontFamily: "Geist",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex" },
              children: {
                type: "div",
                props: {
                  style: {
                    background: ACCENT_BG,
                    color: TEAL,
                    padding: "12px 26px",
                    borderRadius: 999,
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  },
                  children: input.topLabel,
                },
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 60,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: 560,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 92,
                            color: "white",
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: -2.5,
                          },
                          children: input.title,
                        },
                      },
                      input.subtitle
                        ? {
                            type: "div",
                            props: {
                              style: {
                                fontSize: 64,
                                color: "rgba(255,255,255,0.92)",
                                fontWeight: 400,
                                marginTop: 12,
                                lineHeight: 1.1,
                                letterSpacing: -1.2,
                              },
                              children: input.subtitle,
                            },
                          }
                        : null,
                    ].filter(Boolean),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: 22,
                      width: 480,
                    },
                    children: input.cards.map((card) => ({
                      type: "div",
                      props: {
                        style: {
                          background: "white",
                          borderRadius: 18,
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      width: 46,
                                      height: 46,
                                      borderRadius: 999,
                                      background: ACCENT_BG,
                                      color: TEAL,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: 18,
                                      fontWeight: 700,
                                      letterSpacing: 0.5,
                                    },
                                    children: card.initials,
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      fontSize: 26,
                                      fontWeight: 700,
                                      color: "#0A0A0A",
                                    },
                                    children: card.name,
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: "div",
                            props: {
                              style: {
                                background: ACCENT_BG,
                                borderRadius: 12,
                                padding: "14px 18px",
                                fontSize: 22,
                                color: "#0A0A0A",
                                lineHeight: 1.35,
                                display: "flex",
                                whiteSpace: "pre",
                              },
                              children: renderMessage(card),
                            },
                          },
                        ],
                      },
                    })),
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 28,
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 400,
                    },
                    children: "@OnMindApp",
                  },
                },
                {
                  type: "img",
                  props: { src: isotipoB64, width: 80, height: 80 },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1280,
      height: 720,
      fonts: [
        { name: "Geist", data: fontBold, weight: 700, style: "normal" },
        { name: "Geist", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1280 },
  })
    .render()
    .asPng();

  await fs.mkdir(path.dirname(input.outputPath), { recursive: true });
  await fs.writeFile(input.outputPath, png);
  console.log(`✓ ${path.relative(process.cwd(), input.outputPath)}`);
}

async function main() {
  await generateThumbnail({
    topLabel: "Tutorial · Templates",
    title: "Una plantilla.",
    subtitle: "Mil mensajes únicos.",
    cards: [
      {
        initials: "MR",
        name: "María Rodríguez",
        message: "¡Feliz cumpleaños, María!",
        highlight: "María",
      },
      {
        initials: "CG",
        name: "Carlos González",
        message: "¡Feliz cumpleaños, Carlos!",
        highlight: "Carlos",
      },
    ],
    outputPath: path.resolve(
      "content/videos-tutoriales/2026-05-11-templates/thumbnail-16x9.png",
    ),
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
