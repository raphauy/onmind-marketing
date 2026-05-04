import { staticFile } from "remotion"

const WEIGHTS: Array<{ path: string; weight: number; style?: "normal" | "italic" }> = [
  { path: "/fonts/Geist-Regular.ttf", weight: 400 },
  { path: "/fonts/Geist-Medium.ttf", weight: 500 },
  { path: "/fonts/Geist-MediumItalic.ttf", weight: 500, style: "italic" },
  { path: "/fonts/Geist-SemiBold.ttf", weight: 600 },
  { path: "/fonts/Geist-Bold.ttf", weight: 700 },
  { path: "/fonts/Geist-Black.ttf", weight: 900 },
]

let promise: Promise<void> | null = null

// Carga los pesos de Geist como FontFace una sola vez por proceso/browser.
// Idempotente: llamadas repetidas reusan la misma promesa.
export function loadGeistFonts(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve()
  if (promise) return promise

  promise = Promise.all(
    WEIGHTS.map(async ({ path, weight, style = "normal" }) => {
      const font = new FontFace(
        "Geist",
        `url(${staticFile(path)}) format('truetype')`,
        { weight: String(weight), style }
      )
      const loaded = await font.load()
      document.fonts.add(loaded)
    })
  ).then(() => undefined)

  return promise
}
