import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
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
    data: readFileSync(join(ROOT, "fonts/Geist-MediumItalic.ttf")),
    weight: 500 as const,
    style: "italic" as const,
  },
  {
    name: "Geist",
    data: readFileSync(join(ROOT, "fonts/Geist-SemiBold.ttf")),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "Geist",
    data: readFileSync(join(ROOT, "fonts/Geist-Bold.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
]

const WIDTH = 1080
const HEIGHT = 1350

const BG = "#FAFAF7"
const HAIRLINE = "#B8B8B0"
const INK = "#0A0A0A"
const BODY_GRAY = "#2A2A2A"
const TEAL = "#007056"

export async function renderCartaFundador(
  fieldValues: Record<string, string>
): Promise<Buffer> {
  const opening = fieldValues.opening ?? ""
  const body = fieldValues.body ?? ""
  const signature = fieldValues.signature ?? ""

  if (!opening || !body || !signature) {
    throw new Error(
      `carta-fundador: faltan campos requeridos (opening, body, signature)`
    )
  }

  const paragraphs = body.split("\n\n")

  const jsx = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        backgroundColor: BG,
        position: "relative",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: "110px",
              top: "220px",
              bottom: "220px",
              width: "2px",
              backgroundColor: HAIRLINE,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: "160px 130px 140px 180px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Geist",
                    fontWeight: 700,
                    fontSize: "72px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: INK,
                    marginBottom: "60px",
                  },
                  children: opening,
                },
              },
              ...paragraphs.map((p, i) => ({
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Geist",
                    fontWeight: 500,
                    fontSize: "32px",
                    lineHeight: 1.5,
                    color: BODY_GRAY,
                    marginBottom: i === paragraphs.length - 1 ? "72px" : "28px",
                  },
                  children: p,
                },
              })),
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Geist",
                    fontWeight: 500,
                    fontStyle: "italic",
                    fontSize: "28px",
                    color: TEAL,
                  },
                  children: signature,
                },
              },
            ],
          },
        },
      ],
    },
  }

  const svg = await satori(jsx as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  })
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
  return Buffer.from(resvg.render().asPng())
}
