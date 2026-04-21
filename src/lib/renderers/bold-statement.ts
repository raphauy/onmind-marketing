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
const INK = "#0A0A0A"
const BODY_GRAY = "#2A2A2A"
const TEAL = "#007056"

export async function renderBoldStatement(
  fieldValues: Record<string, string>
): Promise<Buffer> {
  const eyebrow = fieldValues.eyebrow ?? ""
  const statement = fieldValues.statement ?? ""
  const context = fieldValues.context ?? ""

  if (!statement || !context) {
    throw new Error(
      `bold-statement: faltan campos requeridos (statement, context)`
    )
  }

  const statementLines = statement.split("\n")
  const children: unknown[] = []

  if (eyebrow) {
    children.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          fontFamily: "Geist",
          fontWeight: 600,
          fontSize: "22px",
          letterSpacing: "0.2em",
          color: TEAL,
          marginBottom: "48px",
        },
        children: eyebrow.toUpperCase(),
      },
    })
  }

  statementLines.forEach((line, i) => {
    children.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          fontFamily: "Geist",
          fontWeight: 700,
          fontSize: "96px",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: INK,
          marginBottom: i === statementLines.length - 1 ? "0" : "4px",
        },
        children: line,
      },
    })
  })

  children.push({
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "80px",
        height: "3px",
        backgroundColor: TEAL,
        marginTop: "56px",
        marginBottom: "40px",
      },
    },
  })

  children.push({
    type: "div",
    props: {
      style: {
        display: "flex",
        fontFamily: "Geist",
        fontWeight: 500,
        fontSize: "30px",
        lineHeight: 1.5,
        color: BODY_GRAY,
      },
      children: context,
    },
  })

  const jsx = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        backgroundColor: BG,
        flexDirection: "column",
        justifyContent: "center",
        padding: "140px 110px 160px 110px",
      },
      children,
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
