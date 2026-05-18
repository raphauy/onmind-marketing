import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"
import { BRAND } from "../lib/colors"

// Tutorial Categorías — Corto 9:16 (Reel)
// 1080x1920. 77s totales (2s pre-roll + audio 70.5s + outro). Audio condensado distinto al master 16:9.
// El audio arranca a frame 60 (2s) para dar respiración al inicio.

const AUDIO_SRC = staticFile("tutorials/2026-05-18-categorias/corto-9x16/voz.mp3")

// ---------- Helpers ----------

function useFadeSlide(start: number, dur = 20, slideFrom = 30) {
  const f = useCurrentFrame()
  const localFrame = f - start
  const opacity = interpolate(localFrame, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const translateY = interpolate(localFrame, [0, dur], [slideFrom, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return { opacity, transform: `translateY(${translateY}px)` }
}

function CheckIcon({ size = 24, color = BRAND.teal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12L10 17L19 7"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---------- Escena 1: Title (0-105, 0-3.5s) ----------

function Scene1Title() {
  const titleStyle = useFadeSlide(0, 18, 40)
  const subStyle = useFadeSlide(14, 18, 30)
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 180,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        Categorías
      </div>
      <div
        style={{
          ...subStyle,
          fontSize: 48,
          color: BRAND.muted,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        El motor de la
        <br />
        presencia anual.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 2: Definición (105-270, 3.5-9s) ----------

function Scene2Definicion() {
  const f = useCurrentFrame()
  const cardStyle = useFadeSlide(0, 20, 40)
  const lineOp = interpolate(f, [70, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const lineSlide = interpolate(f, [70, 100], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 56,
        fontFamily: "system-ui, sans-serif",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          ...cardStyle,
          background: "white",
          borderRadius: 32,
          padding: "60px 60px",
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          maxWidth: 900,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 32,
            background: BRAND.mint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width={80} height={80} viewBox="0 0 24 24" fill="none">
            <rect x={3} y={3} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
            <rect x={14} y={3} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
            <rect x={3} y={14} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
            <rect x={14} y={14} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
          </svg>
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, color: BRAND.ink, textAlign: "center", letterSpacing: "-0.02em" }}>
          Una Categoría
        </div>
      </div>
      <div
        style={{
          opacity: lineOp,
          transform: `translateY(${lineSlide}px)`,
          fontSize: 44,
          color: BRAND.body,
          fontWeight: 500,
          textAlign: "center",
          maxWidth: 920,
          lineHeight: 1.3,
        }}
      >
        agrupa contactos por la frecuencia de mensajes.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 3: 3 tipos (270-540, 9-18s) ----------

type ContactType = {
  title: string
  bg: string
  fg: string
  icon: React.ReactNode
}

function ContactTypeCardVertical({ data, start }: { data: ContactType; start: number }) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const sp = spring({
    frame: f - start,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  })
  const opacity = interpolate(f, [start, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [start, start + 22], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const scale = 0.94 + sp * 0.06

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px) scale(${scale})`,
        background: "white",
        borderRadius: 24,
        padding: "30px 36px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 6px 22px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 28,
        width: 820,
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          background: data.bg,
          color: data.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {data.icon}
      </div>
      <div
        style={{
          fontSize: 50,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
        }}
      >
        {data.title}
      </div>
    </div>
  )
}

function FlameIcon({ size = 48, color = "#DC2626" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C13 5 16 6 16 10C16 12.5 14 14 14 14C14 14 17 13 17 16C17 19.3 14.5 21 12 21C9.5 21 7 19.3 7 16C7 13.5 9 13 9 11C9 8 12 7 12 2Z"
        fill={color}
      />
    </svg>
  )
}

function ClockIcon({ size = 48, color = "#D97706" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2.5} />
      <path
        d="M12 7V12L15 14"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HandshakeIcon({ size = 48, color = "#0891B2" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 13L7 9L10 12L14 8L17 11L21 7"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 17L7 13L10 16L14 12L17 15L21 11"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />
    </svg>
  )
}

function Scene3Tipos() {
  const headerStyle = useFadeSlide(0, 16, 20)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          ...headerStyle,
          fontSize: 56,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        Tus contactos
        <br />
        no son todos iguales.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <ContactTypeCardVertical
          data={{
            title: "Clientes activos",
            bg: "#FEE2E2",
            fg: "#DC2626",
            icon: <FlameIcon size={60} color="#DC2626" />,
          }}
          start={60}
        />
        <ContactTypeCardVertical
          data={{
            title: "Cartera tibia",
            bg: "#FEF3C7",
            fg: "#D97706",
            icon: <ClockIcon size={60} color="#D97706" />,
          }}
          start={130}
        />
        <ContactTypeCardVertical
          data={{
            title: "Postventa",
            bg: "#CFFAFE",
            fg: "#0891B2",
            icon: <HandshakeIcon size={60} color="#0891B2" />,
          }}
          start={200}
        />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 4: Para qué (540-810, 18-27s) ----------

function Scene4ParaQue() {
  const f = useCurrentFrame()
  const line1 = useFadeSlide(0, 22, 30)
  const line2Op = interpolate(f, [70, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line2Slide = interpolate(f, [70, 105], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 38,
        fontFamily: "system-ui, sans-serif",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          ...line1,
          fontSize: 56,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 920,
          lineHeight: 1.25,
        }}
      >
        Las Categorías traducen esa diferencia en mensajes reales.
      </div>
      <div
        style={{
          opacity: line2Op,
          transform: `translateY(${line2Slide}px)`,
          fontSize: 38,
          color: BRAND.teal,
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 880,
          lineHeight: 1.3,
        }}
      >
        Sin agendas a mano.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 5: Definís + frecuencias (810-1230, 27-41s) ----------

function FrequencyCardVertical({
  name,
  count,
  start,
}: {
  name: string
  count: number
  start: number
}) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const sp = spring({
    frame: f - start,
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.6 },
  })
  const opacity = interpolate(f, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [start, start + 22], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const counted = Math.round(
    interpolate(f, [start + 14, start + 50], [0, count], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  )
  const scale = 0.94 + sp * 0.06

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px) scale(${scale})`,
        background: "white",
        borderRadius: 22,
        padding: "28px 32px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        width: 820,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 36, color: BRAND.ink, fontWeight: 700, letterSpacing: "-0.01em" }}>
          {name}
        </div>
        <div style={{ fontSize: 24, color: BRAND.muted, fontWeight: 500 }}>
          mensajes al año
        </div>
      </div>
      <div
        style={{
          fontSize: 140,
          fontWeight: 700,
          color: BRAND.teal,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.04em",
        }}
      >
        {counted}
      </div>
    </div>
  )
}

function Scene5Frecuencias() {
  const headerStyle = useFadeSlide(0, 18, 24)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 32,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          ...headerStyle,
          fontSize: 44,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.25,
        }}
      >
        Definís cuántos mensajes al año por grupo.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <FrequencyCardVertical name="Clientes activos" count={12} start={140} />
        <FrequencyCardVertical name="Cartera tibia" count={6} start={205} />
        <FrequencyCardVertical name="Postventa" count={4} start={270} />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 6: Rotación (1230-1510, 41-50s) ----------

function Scene6Rotacion() {
  const f = useCurrentFrame()
  const headerStyle = useFadeSlide(0, 18, 24)

  const templateOp = interpolate(f, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const templateSlide = interpolate(f, [60, 90], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const arrowOp = interpolate(f, [140, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const renderedOp = interpolate(f, [165, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const renderedSlide = interpolate(f, [165, 195], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          ...headerStyle,
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "nowrap",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 700, color: BRAND.ink, letterSpacing: "-0.025em" }}>
          Buscadores
        </div>
        <div
          style={{
            background: BRAND.mint,
            color: BRAND.teal,
            padding: "10px 22px",
            borderRadius: 999,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          12 plantillas
        </div>
      </div>

      {/* Plantilla cruda */}
      <div
        style={{
          opacity: templateOp,
          transform: `translateY(${templateSlide}px)`,
          background: "white",
          borderRadius: 22,
          padding: "26px 30px",
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: 880,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            background: BRAND.mint,
            color: BRAND.teal,
            padding: "6px 16px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Plantilla
        </div>
        <div style={{ fontSize: 28, color: BRAND.body, lineHeight: 1.45, fontWeight: 500 }}>
          Hola{" "}
          <span
            style={{
              background: BRAND.mintHighlight,
              color: BRAND.teal,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 6,
              fontFamily: "ui-monospace, monospace",
              fontSize: 26,
            }}
          >
            {"{nombre}"}
          </span>
          , ¿cómo estás? Paso por acá para retomar el contacto.
        </div>
      </div>

      {/* Arrow */}
      <div style={{ opacity: arrowOp, fontSize: 64, color: BRAND.teal, fontWeight: 300, lineHeight: 0.5 }}>
        ↓
      </div>

      {/* Renderizada */}
      <div
        style={{
          opacity: renderedOp,
          transform: `translateY(${renderedSlide}px)`,
          background: "white",
          borderRadius: 22,
          padding: "26px 30px",
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: 880,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            background: BRAND.mint,
            color: BRAND.teal,
            padding: "6px 16px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Enviado a María Rodríguez
        </div>
        <div style={{ fontSize: 28, color: BRAND.body, lineHeight: 1.45, fontWeight: 500 }}>
          Hola <span style={{ color: BRAND.teal, fontWeight: 700 }}>María</span>, ¿cómo estás? Paso por acá para retomar el contacto.
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 7: Asignar (1510-1840, 50-61s) ----------

function ContactRowVertical({
  initials,
  name,
  category,
  start,
  changeAt,
  newCategory,
}: {
  initials: string
  name: string
  category: string
  start: number
  changeAt?: number
  newCategory?: string
}) {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [start, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [start, start + 22], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const showNew = changeAt !== undefined && f >= changeAt
  const newOp = changeAt !== undefined
    ? interpolate(f, [changeAt, changeAt + 14], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0
  const oldOp = changeAt !== undefined
    ? interpolate(f, [changeAt - 8, changeAt + 6], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px)`,
        background: "white",
        border: `1px solid ${BRAND.hairline}`,
        borderRadius: 20,
        padding: "24px 30px",
        display: "flex",
        alignItems: "center",
        gap: 26,
        width: 880,
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          background: BRAND.mint,
          color: BRAND.teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 30,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: BRAND.ink }}>{name}</div>
        <div style={{ position: "relative", height: 48 }}>
          <span
            style={{
              opacity: oldOp,
              position: showNew ? "absolute" : "relative",
              left: 0,
              top: 0,
              background: BRAND.mint,
              color: BRAND.teal,
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 700,
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {category}
          </span>
          {showNew && newCategory && (
            <span
              style={{
                opacity: newOp,
                position: "absolute",
                left: 0,
                top: 0,
                background: "#FEF3C7",
                color: "#854D0E",
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {newCategory}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Scene7Asignar() {
  const f = useCurrentFrame()
  const headerStyle = useFadeSlide(0, 16, 20)

  const toastOp = interpolate(f, [240, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const toastSlide = interpolate(f, [240, 270], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          ...headerStyle,
          fontSize: 48,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.2,
        }}
      >
        Asignar es un campo en la ficha.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <ContactRowVertical
          initials="MR"
          name="María Rodríguez"
          category="Buscadores"
          start={40}
          changeAt={190}
          newCategory="Postventa"
        />
        <ContactRowVertical
          initials="CG"
          name="Carlos González"
          category="Clientes activos"
          start={90}
        />
      </div>

      <div
        style={{
          opacity: toastOp,
          transform: `translateY(${toastSlide}px)`,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          background: BRAND.mint,
          color: BRAND.teal,
          padding: "16px 28px",
          borderRadius: 999,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        <CheckIcon size={28} color={BRAND.teal} />
        Calendario reajustado
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 8: Cierre (1840-2160, 61-72s) ----------

function Scene8Closing() {
  const f = useCurrentFrame()
  const line1 = useFadeSlide(0, 20, 26)
  const line2Op = interpolate(f, [100, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line2Slide = interpolate(f, [100, 130], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line3Op = interpolate(f, [200, 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line3Slide = interpolate(f, [200, 230], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        fontFamily: "system-ui, sans-serif",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          ...line1,
          fontSize: 52,
          fontWeight: 500,
          color: BRAND.muted,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.25,
        }}
      >
        Configurás una sola vez.
      </div>
      <div
        style={{
          opacity: line2Op,
          transform: `translateY(${line2Slide}px)`,
          fontSize: 70,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.025em",
          textAlign: "center",
          maxWidth: 920,
          lineHeight: 1.15,
        }}
      >
        Definí la frecuencia.
      </div>
      <div
        style={{
          opacity: line3Op,
          transform: `translateY(${line3Slide}px)`,
          fontSize: 70,
          fontWeight: 700,
          color: BRAND.teal,
          letterSpacing: "-0.025em",
          textAlign: "center",
          maxWidth: 920,
          lineHeight: 1.15,
        }}
      >
        Olvidate del resto.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Outro (2160-2250, 72-75s) ----------

function Outro() {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [0, 22], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${slide}px)`,
          fontSize: 140,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
        }}
      >
        @OnMindApp
      </div>
      <div
        style={{
          opacity,
          width: 160,
          height: 6,
          background: BRAND.teal,
          borderRadius: 3,
        }}
      />
    </AbsoluteFill>
  )
}

// ---------- Root ----------

export function TutorialCategoriasCorto9x16() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* 1: Title 0-165 (incluye 2s pre-roll antes del audio) */}
      <Sequence from={0} durationInFrames={165}>
        <Scene1Title />
      </Sequence>

      {/* 2: Definición 165-330 */}
      <Sequence from={165} durationInFrames={165}>
        <Scene2Definicion />
      </Sequence>

      {/* 3: 3 tipos 330-600 */}
      <Sequence from={330} durationInFrames={270}>
        <Scene3Tipos />
      </Sequence>

      {/* 4: Para qué 600-870 */}
      <Sequence from={600} durationInFrames={270}>
        <Scene4ParaQue />
      </Sequence>

      {/* 5: Definís + frecuencias 870-1290 */}
      <Sequence from={870} durationInFrames={420}>
        <Scene5Frecuencias />
      </Sequence>

      {/* 6: Rotación 1290-1570 */}
      <Sequence from={1290} durationInFrames={280}>
        <Scene6Rotacion />
      </Sequence>

      {/* 7: Asignar 1570-1900 */}
      <Sequence from={1570} durationInFrames={330}>
        <Scene7Asignar />
      </Sequence>

      {/* 8: Cierre 1900-2220 */}
      <Sequence from={1900} durationInFrames={320}>
        <Scene8Closing />
      </Sequence>

      {/* Outro 2220-2310 */}
      <Sequence from={2220} durationInFrames={90}>
        <Outro />
      </Sequence>

      {/* Audio arranca a frame 60 (2s) — pre-roll de respiración */}
      <Sequence from={60}>
        <Audio src={AUDIO_SRC} />
      </Sequence>
    </AbsoluteFill>
  )
}
