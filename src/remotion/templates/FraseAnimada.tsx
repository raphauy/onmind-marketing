import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  delayRender,
  continueRender,
} from "remotion"
import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { BRAND } from "../lib/colors"
import { loadGeistFonts } from "../lib/fonts"
import { LogoOverlay } from "../components/LogoOverlay"

export const fraseAnimadaSchema = z.object({
  eyebrow: z.string().default(""),
  statement: z.string(),
  context: z.string(),
  darkOverlay: z.boolean().default(false),
})

export type FraseAnimadaProps = z.infer<typeof fraseAnimadaSchema>

// Tokens: palabra o salto de línea forzado por \n en statement.
type Token =
  | { kind: "word"; text: string; idx: number }
  | { kind: "br" }

function tokenize(statement: string): { tokens: Token[]; total: number } {
  const tokens: Token[] = []
  let idx = 0
  const lines = statement.split("\n")
  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) tokens.push({ kind: "br" })
    line
      .split(/\s+/)
      .filter(Boolean)
      .forEach((text) => {
        tokens.push({ kind: "word", text, idx: idx++ })
      })
  })
  return { tokens, total: idx }
}

export function FraseAnimada({
  eyebrow,
  statement,
  context,
  darkOverlay,
}: FraseAnimadaProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const [fontHandle] = useState(() => delayRender("Loading Geist"))
  useEffect(() => {
    loadGeistFonts()
      .then(() => continueRender(fontHandle))
      .catch(() => continueRender(fontHandle))
  }, [fontHandle])

  const { tokens, total: totalWords } = useMemo(
    () => tokenize(statement),
    [statement]
  )

  // Timeline (frames @ 30fps):
  // 0–18    eyebrow fade + slide
  // 22      arranca la primera palabra; cada palabra cada 14f, fade de 24f
  // +8      línea accent (spring lento de 0 → 1 escala X)
  // +24     context fade + slide, dura 32f
  const EYEBROW_START = 0
  const EYEBROW_END = 18
  const WORD_START = 22
  const WORD_STAGGER = 14
  const WORD_DURATION = 24
  const wordsEnd = WORD_START + totalWords * WORD_STAGGER + WORD_DURATION

  const ACCENT_START = wordsEnd + 8
  const CONTEXT_START = ACCENT_START + 24
  const CONTEXT_DURATION = 32

  // Eyebrow
  const eyebrowOpacity = interpolate(
    frame,
    [EYEBROW_START, EYEBROW_END],
    [0, 1],
    { extrapolateRight: "clamp" }
  )
  const eyebrowTranslate = interpolate(
    frame,
    [EYEBROW_START, EYEBROW_END],
    [12, 0],
    { extrapolateRight: "clamp" }
  )

  // Línea accent: escala X con spring
  const accentScale = spring({
    frame: frame - ACCENT_START,
    fps,
    config: { damping: 14, stiffness: 60, mass: 0.8 },
  })

  // Context
  const contextOpacity = interpolate(
    frame,
    [CONTEXT_START, CONTEXT_START + CONTEXT_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  const contextTranslate = interpolate(
    frame,
    [CONTEXT_START, CONTEXT_START + CONTEXT_DURATION],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        fontFamily: "Geist",
        padding: "200px 110px 240px 110px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {eyebrow ? (
          <div
            style={{
              opacity: eyebrowOpacity,
              transform: `translateY(${eyebrowTranslate}px)`,
              color: BRAND.teal,
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 56,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: BRAND.ink,
            fontWeight: 700,
            fontSize: 110,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            gap: 4,
          }}
        >
          {(() => {
            const lines: Token[][] = [[]]
            tokens.forEach((t) => {
              if (t.kind === "br") lines.push([])
              else lines[lines.length - 1].push(t)
            })
            return lines.map((line, lineIdx) => (
              <div
                key={lineIdx}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  rowGap: 8,
                }}
              >
                {line.map((tok) => {
                  if (tok.kind !== "word") return null
                  const wordStart = WORD_START + tok.idx * WORD_STAGGER
                  const wordOpacity = interpolate(
                    frame,
                    [wordStart, wordStart + WORD_DURATION],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  )
                  const wordTranslate = interpolate(
                    frame,
                    [wordStart, wordStart + WORD_DURATION],
                    [22, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  )
                  return (
                    <span
                      key={tok.idx}
                      style={{
                        display: "inline-block",
                        opacity: wordOpacity,
                        transform: `translateY(${wordTranslate}px)`,
                        marginRight: "0.28em",
                      }}
                    >
                      {tok.text}
                    </span>
                  )
                })}
              </div>
            ))
          })()}
        </div>

        <div
          style={{
            width: 120,
            height: 4,
            backgroundColor: BRAND.teal,
            marginTop: 56,
            marginBottom: 40,
            transformOrigin: "left center",
            transform: `scaleX(${accentScale})`,
          }}
        />

        <div
          style={{
            opacity: contextOpacity,
            transform: `translateY(${contextTranslate}px)`,
            color: BRAND.body,
            fontWeight: 500,
            fontSize: 36,
            lineHeight: 1.5,
            maxWidth: "92%",
          }}
        >
          {context}
        </div>
      </div>

      <LogoOverlay dark={darkOverlay} appearAt={0} />
    </AbsoluteFill>
  )
}

export const FraseAnimadaDefaults: FraseAnimadaProps = {
  eyebrow: "Principio 01",
  statement: "El silencio\ntambién es\nun mensaje.",
  context:
    "Si tus clientes no saben nada de vos hace meses, están asumiendo que ya no les interesás.",
  darkOverlay: false,
}
