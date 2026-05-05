import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
} from "remotion"
import { useEffect, useState, type ReactNode } from "react"
import { z } from "zod"
import { BRAND } from "../lib/colors"
import { loadGeistFonts, loadEmojiFont } from "../lib/fonts"
import { LogoOverlay } from "../components/LogoOverlay"

export const chatAnimadoSchema = z.object({
  contactName: z.string().default("Martín"),
  theme: z.enum(["light", "dark"]).default("light"),
  dateLabel1: z.string(),
  sentMessage1: z.string(),
  receivedMessage1: z.string(),
  dateLabel2: z.string(),
  sentMessage2: z.string(),
  receivedMessage2: z.string(),
  darkOverlay: z.boolean().default(false),
})

export type ChatAnimadoProps = z.infer<typeof chatAnimadoSchema>

// Timeline (frames @ 30fps, total = 510f = 17s)
const HEADER_END = 18
const DATE1_AT = 28
const SENT1_AT = 42
const TYPING1_AT = 100
const TYPING1_END = 152
const RECV1_AT = 152
const DATE2_AT = 220
const SENT2_AT = 235
const TYPING2_AT = 295
const TYPING2_END = 347
const RECV2_AT = 347
const LOGO_AT = 0

type Theme = "light" | "dark"

// Font stack de los textos del chat: Geist primero (para letras), Noto
// Color Emoji como fallback per-glyph (para los emojis 🙌 🎉 ❤️ etc).
const CHAT_FONT_FAMILY = '"Geist", "Noto Color Emoji"'

// Paleta WhatsApp por tema. Inspirada en la app real, ajustada al brand.
// El avatar siempre usa BRAND.teal para integrar con OnMind.
// La textura del fondo se renderiza proceduralmente con radial-gradients
// CSS (ver ChatBackground) — los gradients pintan sincrónicamente y sí
// aparecen en cada worker del render headless paralelo.
const themeColors = {
  light: {
    headerBg: "#075E54",
    headerText: "#FFFFFF",
    headerSubtext: "rgba(255,255,255,0.85)",
    chatBg: "#ECE5DD",
    sentBubbleBg: "#DCF8C6",
    receivedBubbleBg: "#FFFFFF",
    bubbleText: "#0A0A0A",
    timestamp: "#667781",
    dateBg: "#E1F2FA",
    dateText: "#54656F",
    typingDot: "#667781",
    bgGrainColor: "rgba(0,0,0,0.07)",
    bgPatchSoft: "rgba(0,0,0,0.04)",
    bgPatchStrong: "rgba(0,0,0,0.06)",
  },
  dark: {
    headerBg: "#1F2C34",
    headerText: "#E9EDEF",
    headerSubtext: "rgba(233,237,239,0.7)",
    chatBg: "#0B141A",
    sentBubbleBg: "#005C4B",
    receivedBubbleBg: "#202C33",
    bubbleText: "#E9EDEF",
    timestamp: "#8696A0",
    dateBg: "#1F2C34",
    dateText: "#8696A0",
    typingDot: "#8696A0",
    bgGrainColor: "rgba(255,255,255,0.05)",
    bgPatchSoft: "rgba(255,255,255,0.03)",
    bgPatchStrong: "rgba(255,255,255,0.045)",
  },
} as const

// ChatItem: wrapper que controla la entrada (y opcionalmente la salida)
// de cualquier elemento del chat. Crece desde maxHeight 0 al valor natural,
// con fade + scale + ligero translateY. La salida invierte la altura para
// que los elementos siguientes "se acomoden" al estilo WhatsApp real.
function ChatItem({
  startFrame,
  endFrame,
  side = "center",
  children,
}: {
  startFrame: number
  endFrame?: number
  side?: "left" | "right" | "center"
  children: ReactNode
}) {
  const frame = useCurrentFrame()

  if (frame < startFrame) return null
  if (endFrame !== undefined && frame >= endFrame) return null

  const localFrame = frame - startFrame
  const ENTER = 12

  const enterOpacity = interpolate(localFrame, [0, ENTER], [0, 1], {
    extrapolateRight: "clamp",
  })
  const translateY = interpolate(localFrame, [0, ENTER + 2], [14, 0], {
    extrapolateRight: "clamp",
  })
  const scale = interpolate(localFrame, [0, ENTER + 2], [0.94, 1], {
    extrapolateRight: "clamp",
  })
  const enterMaxHeight = interpolate(localFrame, [0, ENTER], [0, 800], {
    extrapolateRight: "clamp",
  })

  let opacity = enterOpacity
  let maxHeight = enterMaxHeight

  if (endFrame !== undefined) {
    const exitLocal = frame - (endFrame - 8)
    if (exitLocal > 0) {
      const exitOpacity = interpolate(exitLocal, [0, 8], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
      const exitMaxHeight = interpolate(exitLocal, [0, 8], [800, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
      opacity = Math.min(opacity, exitOpacity)
      maxHeight = Math.min(maxHeight, exitMaxHeight)
    }
  }

  const justify =
    side === "right" ? "flex-end" : side === "left" ? "flex-start" : "center"
  const transformOrigin =
    side === "right"
      ? "bottom right"
      : side === "left"
        ? "bottom left"
        : "bottom center"

  return (
    <div
      style={{
        maxHeight,
        overflow: "hidden",
        display: "flex",
        justifyContent: justify,
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          transformOrigin,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Background del chat: textura procedural con CSS radial-gradients.
// Capa 1: patrón de "grano" pequeño repetido cada 5px (da textura tipo papel).
// Capa 2: manchas grandes superpuestas para variación local de tono.
// Todo CSS gradients, sin imágenes, así pinta sincrónicamente en cada worker.
function ChatBackground({ theme }: { theme: Theme }) {
  const t = themeColors[theme]
  const grain = t.bgGrainColor
  const a = t.bgPatchSoft
  const b = t.bgPatchStrong
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundColor: t.chatBg,
        backgroundImage: [
          `radial-gradient(circle at 50% 50%, ${grain} 0.9px, transparent 1.4px)`,
          `radial-gradient(ellipse 620px 460px at 12% 8%, ${b}, transparent 60%)`,
          `radial-gradient(ellipse 540px 620px at 78% 18%, ${a}, transparent 60%)`,
          `radial-gradient(ellipse 700px 500px at 32% 42%, ${a}, transparent 60%)`,
          `radial-gradient(ellipse 480px 580px at 88% 52%, ${b}, transparent 60%)`,
          `radial-gradient(ellipse 600px 480px at 18% 68%, ${a}, transparent 60%)`,
          `radial-gradient(ellipse 720px 540px at 70% 82%, ${b}, transparent 60%)`,
        ].join(", "),
        backgroundSize:
          "5px 5px, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
      }}
    />
  )
}

function TypingDots({ color }: { color: string }) {
  const frame = useCurrentFrame()
  // Pulso sinusoidal con offset por dot. Período 30f (1s).
  const dotScale = (offset: number) => {
    const cycle = (((frame + offset) % 30) + 30) % 30
    return Math.sin((cycle / 30) * Math.PI * 2) * 0.28 + 0.78
  }
  const dotOpacity = (offset: number) => {
    const cycle = (((frame + offset) % 30) + 30) % 30
    return Math.sin((cycle / 30) * Math.PI * 2) * 0.3 + 0.7
  }
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {[0, 8, 16].map((offset, i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: color,
            transform: `scale(${dotScale(offset)})`,
            opacity: dotOpacity(offset),
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M1 8.5L5 12.5L12.5 5"
        stroke="#53BDEB"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 8.5L12.5 12.5L20 5"
        stroke="#53BDEB"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BubbleTail({ side, color }: { side: "left" | "right"; color: string }) {
  // Triangulito que sobresale en la esquina top del bubble (top-right en sent,
  // top-left en received). Mismo color que el fondo de la burbuja para que
  // se vea como una continuación natural.
  if (side === "right") {
    return (
      <svg
        width="14"
        height="18"
        viewBox="0 0 14 18"
        fill="none"
        style={{
          position: "absolute",
          top: 0,
          right: -12,
          display: "block",
        }}
      >
        <path d="M0 0 L14 0 L0 14 Z" fill={color} />
      </svg>
    )
  }
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      style={{
        position: "absolute",
        top: 0,
        left: -12,
        display: "block",
      }}
    >
      <path d="M14 0 L0 0 L14 14 Z" fill={color} />
    </svg>
  )
}

function Bubble({
  side,
  text,
  timestamp,
  theme,
}: {
  side: "left" | "right"
  text: string
  timestamp: string
  theme: Theme
}) {
  const t = themeColors[theme]
  const bg = side === "right" ? t.sentBubbleBg : t.receivedBubbleBg
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: bg,
        color: t.bubbleText,
        borderRadius: 18,
        borderTopRightRadius: side === "right" ? 0 : 18,
        borderTopLeftRadius: side === "left" ? 0 : 18,
        padding: "22px 28px 16px 28px",
        maxWidth: 820,
        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
        fontSize: 40,
        lineHeight: 1.32,
        fontWeight: 400,
      }}
    >
      <BubbleTail side={side} color={bg} />
      <div>{text}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 10,
          color: t.timestamp,
          fontSize: 22,
          fontWeight: 500,
        }}
      >
        <span>{timestamp}</span>
        {side === "right" && <CheckIcon />}
      </div>
    </div>
  )
}

function TypingBubble({ theme }: { theme: Theme }) {
  const t = themeColors[theme]
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: t.receivedBubbleBg,
        borderRadius: 18,
        borderTopLeftRadius: 0,
        padding: "30px 34px",
        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <BubbleTail side="left" color={t.receivedBubbleBg} />
      <TypingDots color={t.typingDot} />
    </div>
  )
}

function DateSeparator({ text, theme }: { text: string; theme: Theme }) {
  const t = themeColors[theme]
  return (
    <div
      style={{
        backgroundColor: t.dateBg,
        color: t.dateText,
        padding: "12px 26px",
        borderRadius: 14,
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: "0.02em",
        boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)",
      }}
    >
      {text}
    </div>
  )
}

function Avatar({ name, bg }: { name: string; bg: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?"
  return (
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: "50%",
        backgroundColor: bg,
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        fontWeight: 600,
        fontFamily: "Geist",
      }}
    >
      {initial}
    </div>
  )
}

function BackArrow({ color }: { color: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
      <path
        d="M20 6L10 16L20 26"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function VideoIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
      <rect
        x="2"
        y="6"
        width="24"
        height="20"
        rx="3"
        stroke={color}
        strokeWidth="2.4"
      />
      <path
        d="M26 12L37 7V25L26 20Z"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PhoneIcon({ color }: { color: string }) {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
      <path
        d="M5.5 6.5C5.5 4.6 7.1 3 9 3H10.6C11.6 3 12.5 3.7 12.7 4.7L13.6 8.7C13.8 9.6 13.4 10.5 12.6 11L11 12C12.4 14.8 14.2 17 17 19L18 17.4C18.5 16.6 19.4 16.2 20.3 16.4L24.3 17.3C25.3 17.5 26 18.4 26 19.4V21C26 22.9 24.4 24.5 22.5 24.5C13.1 24.5 5.5 16.9 5.5 6.5Z"
        stroke={color}
        strokeWidth="2.4"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function KebabIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="34" viewBox="0 0 14 34" fill="none">
      <circle cx="7" cy="7" r="2.4" fill={color} />
      <circle cx="7" cy="17" r="2.4" fill={color} />
      <circle cx="7" cy="27" r="2.4" fill={color} />
    </svg>
  )
}

export function ChatAnimado({
  contactName,
  theme,
  dateLabel1,
  sentMessage1,
  receivedMessage1,
  dateLabel2,
  sentMessage2,
  receivedMessage2,
  darkOverlay,
}: ChatAnimadoProps) {
  const frame = useCurrentFrame()

  const [fontHandle] = useState(() => delayRender("Loading fonts"))
  useEffect(() => {
    Promise.all([loadGeistFonts(), loadEmojiFont()])
      .then(() => continueRender(fontHandle))
      .catch(() => continueRender(fontHandle))
  }, [fontHandle])

  const t = themeColors[theme]

  // Header del chat: fade + slight slide down
  const headerOpacity = interpolate(frame, [0, HEADER_END], [0, 1], {
    extrapolateRight: "clamp",
  })
  const headerTranslate = interpolate(frame, [0, HEADER_END], [-10, 0], {
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill style={{ backgroundColor: t.chatBg, fontFamily: CHAT_FONT_FAMILY }}>
      <ChatBackground theme={theme} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            backgroundColor: t.headerBg,
            padding: "32px 38px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: headerOpacity,
            transform: `translateY(${headerTranslate}px)`,
            zIndex: 2,
          }}
        >
          <BackArrow color={t.headerText} />
          <Avatar name={contactName} bg={BRAND.teal} />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: t.headerText,
                fontSize: 38,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {contactName}
            </div>
            <div
              style={{
                color: t.headerSubtext,
                fontSize: 22,
                marginTop: 4,
                fontWeight: 400,
              }}
            >
              últ. vez hoy a las 11:38
            </div>
          </div>
          <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
            <VideoIcon color={t.headerText} />
            <PhoneIcon color={t.headerText} />
            <KebabIcon color={t.headerText} />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "36px 40px 200px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: 16,
            boxSizing: "border-box",
          }}
        >
          <ChatItem startFrame={DATE1_AT} side="center">
            <DateSeparator text={dateLabel1} theme={theme} />
          </ChatItem>

          <ChatItem startFrame={SENT1_AT} side="right">
            <Bubble
              side="right"
              text={sentMessage1}
              timestamp="15:34"
              theme={theme}
            />
          </ChatItem>

          <ChatItem
            startFrame={TYPING1_AT}
            endFrame={TYPING1_END}
            side="left"
          >
            <TypingBubble theme={theme} />
          </ChatItem>

          <ChatItem startFrame={RECV1_AT} side="left">
            <Bubble
              side="left"
              text={receivedMessage1}
              timestamp="15:36"
              theme={theme}
            />
          </ChatItem>

          <ChatItem startFrame={DATE2_AT} side="center">
            <DateSeparator text={dateLabel2} theme={theme} />
          </ChatItem>

          <ChatItem startFrame={SENT2_AT} side="right">
            <Bubble
              side="right"
              text={sentMessage2}
              timestamp="11:02"
              theme={theme}
            />
          </ChatItem>

          <ChatItem
            startFrame={TYPING2_AT}
            endFrame={TYPING2_END}
            side="left"
          >
            <TypingBubble theme={theme} />
          </ChatItem>

          <ChatItem startFrame={RECV2_AT} side="left">
            <Bubble
              side="left"
              text={receivedMessage2}
              timestamp="11:04"
              theme={theme}
            />
          </ChatItem>
        </div>
      </div>

      <LogoOverlay dark={darkOverlay} appearAt={LOGO_AT} />
    </AbsoluteFill>
  )
}

export const ChatAnimadoDefaults: ChatAnimadoProps = {
  contactName: "Martín",
  theme: "light",
  dateLabel1: "vie, 19 dic.",
  sentMessage1:
    "Hola Martín, ¿cómo va todo con la casa? ¿Alguna duda con los servicios?",
  receivedMessage1: "¡Todo bien, gracias! Cualquier cosa te escribo.",
  dateLabel2: "mar, 17 feb.",
  sentMessage2:
    "Hola Martín, ¿cómo arrancaste el año? ¿Todo en orden con la casa?",
  receivedMessage2:
    "Justo iba a escribirte. Un conocido busca alquiler por la zona.",
  darkOverlay: false,
}
