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
const HEIGHT = 1080

const BG = "#FAFAF7"
const HAIRLINE = "#B8B8B0"
const INK = "#0A0A0A"
const BODY_GRAY = "#2A2A2A"
const TEAL = "#007056"
const HIGHLIGHT_BG = "#C5E8DC"

type Token = { text: string; hl: boolean }

function buildTokens(quote: string): Token[] {
  const segments: Array<{ text: string; hl: boolean }> = []
  const regex = /==([^=]+)==/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(quote)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: quote.slice(lastIndex, match.index), hl: false })
    }
    segments.push({ text: match[1], hl: true })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < quote.length) {
    segments.push({ text: quote.slice(lastIndex), hl: false })
  }

  const tokens: Token[] = []
  for (const seg of segments) {
    if (seg.hl) {
      tokens.push({ text: seg.text.trim(), hl: true })
    } else {
      const words = seg.text.split(/\s+/).filter(Boolean)
      for (const w of words) tokens.push({ text: w, hl: false })
    }
  }

  // Adherir tokens de pura puntuación al token previo para evitar
  // que signos queden flotando detrás de una frase destacada.
  const merged: Token[] = []
  for (const t of tokens) {
    const isPunctOnly = !t.hl && /^[.,;:!?…)»"'´`]+$/.test(t.text)
    if (merged.length > 0 && isPunctOnly) {
      const prev = merged[merged.length - 1]
      merged[merged.length - 1] = { ...prev, text: prev.text + t.text }
    } else {
      merged.push(t)
    }
  }
  return merged
}

function pickFontSize(charCount: number): number {
  if (charCount > 600) return 26
  if (charCount > 400) return 28
  if (charCount > 250) return 32
  return 36
}

export async function renderTestimonioDestacado(
  fieldValues: Record<string, string>
): Promise<Buffer> {
  const quote = fieldValues.quote ?? ""
  const name = fieldValues.name ?? ""

  if (!quote || !name) {
    throw new Error(
      `testimonio-destacado: faltan campos requeridos (quote, name)`
    )
  }

  const tokens = buildTokens(quote)
  const plainChars = tokens.reduce((n, t) => n + t.text.length, 0)
  const fontSize = pickFontSize(plainChars)
  const lineHeight = 1.5
  const initial = name.trim().charAt(0).toUpperCase()

  const jsx = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        backgroundColor: BG,
        padding: "120px 110px 140px 110px",
      },
      children: [
        // Quote mark icon arriba
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontFamily: "Geist",
              fontWeight: 700,
              fontSize: "140px",
              lineHeight: 0.8,
              color: TEAL,
              marginBottom: "24px",
              height: "80px",
            },
            children: "“",
          },
        },
        // Quote text con highlights
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "baseline",
              width: "100%",
              fontFamily: "Geist",
              fontWeight: 500,
              fontSize: `${fontSize}px`,
              lineHeight,
              color: BODY_GRAY,
              textAlign: "center",
            },
            children: tokens.map((token, i) => ({
              type: "div",
              props: {
                style: {
                  display: "flex",
                  padding: token.hl ? "6px 12px" : "6px 0",
                  marginRight: i === tokens.length - 1 ? "0px" : "8px",
                  marginBottom: "2px",
                  backgroundColor: token.hl ? HIGHLIGHT_BG : "transparent",
                  borderRadius: token.hl ? "6px" : "0px",
                  color: token.hl ? INK : BODY_GRAY,
                  fontWeight: token.hl ? 600 : 500,
                },
                children: token.text,
              },
            })),
          },
        },
        // Divider hairline
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "80px",
              height: "2px",
              backgroundColor: HAIRLINE,
              marginTop: "56px",
              marginBottom: "28px",
            },
          },
        },
        // Avatar + nombre
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "16px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "56px",
                    height: "56px",
                    borderRadius: "999px",
                    backgroundColor: TEAL,
                    color: "#FFFFFF",
                    fontFamily: "Geist",
                    fontWeight: 700,
                    fontSize: "26px",
                  },
                  children: initial,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontFamily: "Geist",
                    fontWeight: 600,
                    fontSize: "28px",
                    color: INK,
                  },
                  children: name,
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
