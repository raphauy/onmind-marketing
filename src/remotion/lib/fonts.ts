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

let emojiPromise: Promise<void> | null = null

// Carga Noto Color Emoji. Es la font de emojis a color que usa Android
// (y WhatsApp en pantalla). Pesa ~11MB pero es lo que necesitamos para que
// los emojis se vean reales en el chat. Se usa como fallback de Geist:
// `fontFamily: "Geist, Noto Color Emoji"` hace que el browser use Noto
// solo para los glifos que Geist no tiene.
export function loadEmojiFont(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve()
  if (emojiPromise) return emojiPromise

  emojiPromise = (async () => {
    const font = new FontFace(
      "Noto Color Emoji",
      `url(${staticFile("/fonts/NotoColorEmoji.ttf")}) format('truetype')`,
      { weight: "400", style: "normal" }
    )
    const loaded = await font.load()
    document.fonts.add(loaded)
  })()

  return emojiPromise
}
