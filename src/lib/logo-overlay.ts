import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import sharp from "sharp"
import { readFileSync } from "fs"
import { join } from "path"

const ROOT = join(process.cwd(), "public")

const fonts = [
  {
    name: "Geist",
    data: readFileSync(join(ROOT, "fonts/Geist-Medium.ttf")),
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "Geist",
    data: readFileSync(join(ROOT, "fonts/Geist-SemiBold.ttf")),
    weight: 600 as const,
    style: "normal" as const,
  },
]

const isotipoBase64 = `data:image/png;base64,${readFileSync(join(ROOT, "brand/isotipo-OnMind-transparente.png")).toString("base64")}`
const isotipoBlanco = `data:image/png;base64,${readFileSync(join(ROOT, "brand/isotipo-OnMind-blanco.png")).toString("base64")}`

// Tamaños finales por aspect ratio (ancho fijo 1080)
const SIZES: Record<string, { width: number; height: number }> = {
  "4:5": { width: 1080, height: 1350 },
  "1:1": { width: 1080, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
}

function createOverlay(width: number, height: number, dark: boolean) {
  const textColor = dark ? "#FFFFFF" : "#0A0A0A"
  const mutedColor = dark ? "#CCCCCC" : "#737373"
  const logoSrc = dark ? isotipoBlanco : isotipoBase64
  const pillBg = dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.95)"

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
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    backgroundColor: pillBg,
                    borderRadius: "24px",
                    padding: "10px 20px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        },
                        children: [
                          {
                            type: "img",
                            props: {
                              src: logoSrc,
                              width: 26,
                              height: 26,
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
                        ],
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
        },
      ],
    },
  }
}

export async function addLogoOverlay(
  imageBuffer: Buffer,
  dark = false,
  aspectRatio = "4:5"
): Promise<Buffer> {
  const target = SIZES[aspectRatio] || SIZES["4:5"]
  const finalWidth = target.width
  const finalHeight = target.height

  // Resize la imagen al tamaño final exacto (cover + crop centrado)
  const resizedImage = await sharp(imageBuffer)
    .resize(finalWidth, finalHeight, { fit: "cover", position: "center" })
    .png()
    .toBuffer()

  // Generar overlay con logo en pill semitransparente
  const overlay = createOverlay(finalWidth, finalHeight, dark)
  const svg = await satori(overlay as any, {
    width: finalWidth,
    height: finalHeight,
    fonts,
  })
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: finalWidth },
  })
  const overlayPng = resvg.render().asPng()

  // Componer imagen + overlay
  return sharp(resizedImage)
    .composite([{ input: Buffer.from(overlayPng), top: 0, left: 0 }])
    .png()
    .toBuffer()
}
