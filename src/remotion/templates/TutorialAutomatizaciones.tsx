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

// Tutorial Automatizaciones — UI recreada
// Master 16:9 (1920x1080). 97s totales (2s pre-roll + 91.6s audio + ~3s outro).

const AUDIO_SRC = staticFile("tutorials/2026-05-23-automatizaciones/voz.mp3")

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

function ClockIcon({ size = 40, color = BRAND.teal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <path
        d="M12 7V12L15 14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Avatar({ initials, size = 64 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: BRAND.mint,
        color: BRAND.teal,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

function Chip({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "teal" | "mint"
}) {
  const styles =
    variant === "teal"
      ? { background: BRAND.teal, color: "white" }
      : variant === "mint"
      ? { background: BRAND.mint, color: BRAND.teal }
      : { background: "#F0F0EA", color: BRAND.body }
  return (
    <div
      style={{
        ...styles,
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 22,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  )
}

// ---------- Escena 1: Title ----------

function Scene1Title() {
  const titleStyle = useFadeSlide(20, 22, 40)
  const subStyle = useFadeSlide(40, 22, 40)
  const barStyle = useFadeSlide(60, 18, 20)
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 22,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 140,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
        }}
      >
        Automatizaciones
      </div>
      <div
        style={{
          ...subStyle,
          fontSize: 38,
          color: BRAND.muted,
        }}
      >
        Cómo trabajan en el día a día.
      </div>
      <div
        style={{
          opacity: barStyle.opacity,
          width: 140,
          height: 5,
          background: BRAND.teal,
          borderRadius: 2,
          marginTop: 14,
        }}
      />
    </AbsoluteFill>
  )
}

// ---------- Escena 2: Detección ----------

function WhatsBubble({
  children,
  variant,
  highlight,
  opacity = 1,
  transform = "translateY(0)",
  maxWidth = 520,
}: {
  children: React.ReactNode
  variant: "in" | "out"
  highlight?: boolean
  opacity?: number
  transform?: string
  maxWidth?: number
}) {
  const isIn = variant === "in"
  return (
    <div
      style={{
        opacity,
        transform,
        background: isIn ? "white" : BRAND.mint,
        color: BRAND.body,
        borderRadius: 18,
        padding: "18px 22px",
        fontSize: 26,
        lineHeight: 1.4,
        maxWidth,
        alignSelf: isIn ? "flex-start" : "flex-end",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: highlight ? `3px solid ${BRAND.teal}` : `1px solid ${BRAND.hairline}`,
        position: "relative",
      }}
    >
      {children}
    </div>
  )
}

function Scene2Concepto() {
  const f = useCurrentFrame()
  // Phone chat aparece primero
  const chatStyle = useFadeSlide(0, 22, 40)
  // Bubble entrante
  const bubbleStyle = useFadeSlide(20, 18, 30)
  // Highlight sobre trigger
  const highlightOp = interpolate(f, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Flecha + tarjeta
  const arrowOp = interpolate(f, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const cardStyle = useFadeSlide(150, 22, 40)
  // Caption
  const captionStyle = useFadeSlide(200, 20, 20)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "0 120px",
      }}
    >
      {/* Chat WhatsApp izquierda */}
      <div
        style={{
          ...chatStyle,
          position: "absolute",
          left: 160,
          top: 180,
          width: 620,
          background: "white",
          borderRadius: 24,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "18px 22px",
            background: BRAND.bg,
            borderBottom: `1px solid ${BRAND.hairline}`,
          }}
        >
          <Avatar initials="MR" size={50} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: BRAND.ink }}>
              María Rodríguez
            </div>
            <div style={{ fontSize: 16, color: BRAND.muted }}>+598 99 123 456</div>
          </div>
        </div>
        {/* Mensajes */}
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minHeight: 240,
            background: "#F7F7F2",
          }}
        >
          <div
            style={{
              ...bubbleStyle,
              background: "white",
              borderRadius: 18,
              padding: "16px 20px",
              fontSize: 24,
              color: BRAND.body,
              alignSelf: "flex-start",
              maxWidth: 480,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              position: "relative",
              border: `1px solid ${BRAND.hairline}`,
            }}
          >
            Quiero más información de{" "}
            <span
              style={{
                background: `rgba(0, 112, 86, ${0.18 * highlightOp})`,
                padding: "2px 4px",
                borderRadius: 4,
                color: highlightOp > 0.5 ? BRAND.teal : "inherit",
                fontWeight: highlightOp > 0.5 ? 700 : 400,
              }}
            >
              Pocitos
            </span>
          </div>
          <div
            style={{
              ...captionStyle,
              alignSelf: "flex-start",
              fontSize: 16,
              color: BRAND.muted,
              fontStyle: "italic",
              marginTop: 4,
            }}
          >
            Texto disparador detectado
          </div>
        </div>
      </div>

      {/* Flecha */}
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 380,
          opacity: arrowOp,
          fontSize: 60,
          color: BRAND.teal,
          fontWeight: 700,
        }}
      >
        →
      </div>

      {/* Card lead derecha */}
      <div
        style={{
          ...cardStyle,
          position: "absolute",
          right: 160,
          top: 280,
          width: 540,
          background: "white",
          borderRadius: 22,
          padding: 32,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          <Avatar initials="MR" size={56} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: BRAND.ink }}>
              María Rodríguez
            </div>
            <div style={{ fontSize: 18, color: BRAND.muted }}>+598 99 123 456</div>
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: BRAND.mint,
            color: BRAND.teal,
            borderRadius: 999,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: BRAND.teal,
            }}
          />
          Lead nuevo
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 3: Estado Nuevo ----------

function Scene3Nuevo() {
  const f = useCurrentFrame()
  const cardStyle = useFadeSlide(0, 24, 30)
  // Categoría chip a frame 60
  const catOp = interpolate(f, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Tag chip a frame 100
  const tagOp = interpolate(f, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Estado label a frame 160
  const stateOp = interpolate(f, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Caption a frame 220
  const captionStyle = useFadeSlide(220, 18, 20)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        gap: 36,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          ...cardStyle,
          width: 760,
          background: "white",
          borderRadius: 24,
          padding: 44,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header del lead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginBottom: 28,
          }}
        >
          <Avatar initials="MR" size={84} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.ink }}>
              María Rodríguez
            </div>
            <div style={{ fontSize: 22, color: BRAND.muted }}>+598 99 123 456</div>
          </div>
        </div>

        {/* Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div style={{ opacity: catOp }}>
            <Chip variant="mint">Categoría B</Chip>
          </div>
          <div style={{ opacity: tagOp }}>
            <Chip>Pocitos</Chip>
          </div>
        </div>

        {/* Estado label */}
        <div
          style={{
            opacity: stateOp,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            background: BRAND.teal,
            color: "white",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: "white",
            }}
          />
          Estado: Nuevo
        </div>
      </div>
      <div
        style={{
          ...captionStyle,
          fontSize: 26,
          color: BRAND.muted,
          textAlign: "center",
        }}
      >
        Categoría y etiquetas ya aplicadas según la regla.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 4: Seguimiento 1 ----------

function Scene4Seg1() {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame()
  // Timer a la izquierda
  const timerStyle = useFadeSlide(0, 22, 30)
  // Contador 0 → 2
  const counter = Math.round(
    interpolate(f, [20, 80], [0, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  )
  // Nota "configurable"
  const noteOp = interpolate(f, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Bubble saliente a frame 130
  const bubbleStyle = useFadeSlide(130, 22, 40)
  // Estado pasa a "En seguimiento" a frame 240
  const stateOp = interpolate(f, [240, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  // Pulse del estado
  const statePulse = spring({
    frame: Math.max(0, f - 250),
    fps,
    config: { damping: 14, stiffness: 80 },
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "120px 140px",
        flexDirection: "row",
        alignItems: "center",
        gap: 80,
      }}
    >
      {/* Timer */}
      <div
        style={{
          ...timerStyle,
          width: 420,
          background: "white",
          borderRadius: 24,
          padding: 40,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <ClockIcon size={64} />
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 700,
            color: BRAND.teal,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {counter} min
        </div>
        <div
          style={{
            opacity: noteOp,
            marginTop: 12,
            fontSize: 22,
            color: BRAND.muted,
          }}
        >
          tiempo configurable
        </div>
      </div>

      {/* Bubble + estado */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            ...bubbleStyle,
            background: BRAND.mint,
            borderRadius: 22,
            padding: "26px 30px",
            fontSize: 30,
            lineHeight: 1.45,
            color: BRAND.body,
            maxWidth: 720,
            alignSelf: "flex-end",
            border: `1px solid ${BRAND.hairline}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontWeight: 600, color: BRAND.teal, fontSize: 18, marginBottom: 6 }}>
            OnMind · Bienvenida
          </div>
          Cómo estás? Un gusto, en qué te puedo ayudar?
          <br />
          <br />
          Te paso link de la propiedad.
        </div>

        <div
          style={{
            opacity: stateOp,
            transform: `scale(${0.9 + 0.1 * statePulse})`,
            alignSelf: "flex-end",
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 24px",
            background: "white",
            border: `2px solid ${BRAND.teal}`,
            color: BRAND.teal,
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: BRAND.teal,
            }}
          />
          Estado: En seguimiento
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 5: Seguimiento 2 ----------

function Scene5Seg2() {
  const f = useCurrentFrame()
  // Timer
  const timerStyle = useFadeSlide(0, 22, 30)
  // Sin respuesta indicator
  const noResponseStyle = useFadeSlide(50, 18, 20)
  // Bubble saliente
  const bubbleStyle = useFadeSlide(130, 22, 40)
  // Franja horaria
  const timelineStyle = useFadeSlide(220, 22, 30)
  // Marker dentro de franja
  const markerOp = interpolate(f, [280, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "80px 140px",
        flexDirection: "row",
        gap: 60,
        alignItems: "center",
      }}
    >
      {/* Lado izquierdo: Timer + sin respuesta */}
      <div style={{ width: 420, display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            ...timerStyle,
            background: "white",
            borderRadius: 24,
            padding: 36,
            border: `1px solid ${BRAND.hairline}`,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <ClockIcon size={56} />
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: BRAND.teal,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            48 hs
          </div>
        </div>
        <div
          style={{
            ...noResponseStyle,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "10px 18px",
            background: "white",
            border: `1px solid ${BRAND.hairline}`,
            color: BRAND.muted,
            borderRadius: 12,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          Contacto no respondió
        </div>
      </div>

      {/* Lado derecho: bubble + franja horaria */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
        <div
          style={{
            ...bubbleStyle,
            background: BRAND.mint,
            borderRadius: 22,
            padding: "24px 28px",
            fontSize: 28,
            lineHeight: 1.45,
            color: BRAND.body,
            maxWidth: 700,
            alignSelf: "flex-end",
            border: `1px solid ${BRAND.hairline}`,
          }}
        >
          <div style={{ fontWeight: 600, color: BRAND.teal, fontSize: 18, marginBottom: 6 }}>
            OnMind · Recordatorio
          </div>
          Cómo andás? Pudiste ver la información que te mandé?
        </div>

        {/* Franja horaria */}
        <div
          style={{
            ...timelineStyle,
            background: "white",
            borderRadius: 18,
            padding: 24,
            border: `1px solid ${BRAND.hairline}`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: BRAND.body,
              marginBottom: 12,
            }}
          >
            Envío solo en horario laboral
          </div>
          {/* Barra del día */}
          <div
            style={{
              position: "relative",
              height: 36,
              background: "#F0F0EA",
              borderRadius: 8,
            }}
          >
            {/* Franja activa 10:00 - 19:00 (de 41% a 79% del día) */}
            <div
              style={{
                position: "absolute",
                left: "41.6%",
                width: "37.5%",
                top: 0,
                bottom: 0,
                background: BRAND.mint,
                border: `2px solid ${BRAND.teal}`,
                borderRadius: 6,
              }}
            />
            {/* Marker punto de envío (~14:00) */}
            <div
              style={{
                opacity: markerOp,
                position: "absolute",
                left: "58%",
                top: -6,
                bottom: -6,
                width: 4,
                background: BRAND.teal,
                borderRadius: 2,
              }}
            />
          </div>
          {/* Labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
              fontSize: 18,
              color: BRAND.muted,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span>00:00</span>
            <span style={{ color: BRAND.teal, fontWeight: 700 }}>10:00</span>
            <span style={{ color: BRAND.teal, fontWeight: 700 }}>19:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 6: Conversando ----------

function Scene6Conversando() {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame()
  const bubbleStyle = useFadeSlide(20, 22, 30)
  // Estado cambia a Conversando
  const stateOp = interpolate(f, [110, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const statePulse = spring({
    frame: Math.max(0, f - 120),
    fps,
    config: { damping: 14, stiffness: 80 },
  })
  // Badge "seguimientos cancelados"
  const badgeStyle = useFadeSlide(180, 22, 20)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "100px 200px",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {/* Bubble entrante */}
      <div
        style={{
          ...bubbleStyle,
          alignSelf: "flex-start",
          background: "white",
          borderRadius: 22,
          padding: "26px 30px",
          fontSize: 32,
          lineHeight: 1.4,
          color: BRAND.body,
          maxWidth: 760,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <Avatar initials="MR" size={40} />
          <div style={{ fontSize: 20, color: BRAND.muted, fontWeight: 600 }}>
            María Rodríguez
          </div>
        </div>
        Sí, justo me interesa la zona. Tenés más detalles?
      </div>

      {/* Estado pasa a Conversando */}
      <div
        style={{
          opacity: stateOp,
          transform: `scale(${0.9 + 0.1 * statePulse})`,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 28px",
          background: BRAND.teal,
          color: "white",
          borderRadius: 999,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "white",
          }}
        />
        Estado: Conversando
      </div>

      {/* Badge cancelados */}
      <div
        style={{
          ...badgeStyle,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          background: "white",
          border: `1px solid ${BRAND.hairline}`,
          borderRadius: 999,
          fontSize: 22,
          color: BRAND.body,
        }}
      >
        <CheckIcon size={22} />
        Seguimientos pendientes cancelados
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 7: Crear regla (Form) ----------

function FormField({
  label,
  value,
  start,
  highlight,
  chip,
}: {
  label: string
  value: string
  start: number
  highlight: boolean
  chip?: boolean
}) {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [start, start + 18], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const ringOp = highlight ? 1 : 0
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, color: BRAND.muted }}>{label}</div>
      <div
        style={{
          padding: "12px 16px",
          background: "white",
          border: `2px solid ${highlight ? BRAND.teal : BRAND.hairline}`,
          borderRadius: 10,
          fontSize: 22,
          color: BRAND.body,
          minHeight: 30,
          boxShadow: highlight
            ? `0 0 0 4px rgba(0,112,86,${0.18 * ringOp})`
            : "none",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {chip ? <Chip variant="mint">{value}</Chip> : value}
      </div>
    </div>
  )
}

function Scene7CrearRegla() {
  const f = useCurrentFrame()
  const containerStyle = useFadeSlide(0, 22, 30)

  // Cada campo se highlightea ~50 frames: 60-110, 110-160, 160-210, 210-260, 260-330
  const highlightFor = (start: number, end: number) => f >= start && f < end

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "60px 180px",
        flexDirection: "row",
        gap: 60,
        alignItems: "center",
      }}
    >
      <div
        style={{
          ...containerStyle,
          flex: 1,
          background: "white",
          borderRadius: 24,
          padding: 40,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: BRAND.mint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2L4 14H11L10 22L19 10H12L13 2Z"
                fill={BRAND.teal}
              />
            </svg>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: BRAND.ink }}>
            Nueva regla
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <FormField
            label="Nombre"
            value="Pauta Pocitos"
            start={20}
            highlight={highlightFor(60, 110)}
          />
          <FormField
            label="Texto disparador"
            value="Quiero más información de Pocitos"
            start={40}
            highlight={highlightFor(110, 160)}
          />
          <FormField
            label="Categoría"
            value="Categoría B"
            start={60}
            highlight={highlightFor(160, 200)}
            chip
          />
          <FormField
            label="Etiquetas"
            value="Pocitos"
            start={80}
            highlight={highlightFor(200, 240)}
            chip
          />
          <FormField
            label="Seguimiento 1 · espera 2 min"
            value='"Cómo estás? Un gusto..."'
            start={100}
            highlight={highlightFor(240, 290)}
          />
          <FormField
            label="Seguimiento 2 · espera 48 hs"
            value='"Cómo andás? Pudiste ver..."'
            start={120}
            highlight={highlightFor(290, 360)}
          />
        </div>

        {/* Save button */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              padding: "12px 28px",
              background: BRAND.teal,
              color: "white",
              borderRadius: 10,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Guardar
          </div>
        </div>
      </div>

      {/* Sidebar derecha con nota */}
      <div
        style={{
          ...containerStyle,
          width: 340,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 700, color: BRAND.ink, lineHeight: 1.2 }}>
          Se configura una vez.
        </div>
        <div style={{ fontSize: 24, color: BRAND.muted, lineHeight: 1.3 }}>
          Y queda corriendo sola por cada respuesta a la pauta.
        </div>
        <div
          style={{
            marginTop: 12,
            width: 60,
            height: 4,
            background: BRAND.teal,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 8: Tablero ----------

function MiniLeadCard({
  initials,
  name,
  tag,
  delayFrame,
}: {
  initials: string
  name: string
  tag: string
  delayFrame: number
}) {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [delayFrame, delayFrame + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [delayFrame, delayFrame + 18], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px)`,
        background: "white",
        borderRadius: 12,
        padding: "12px 14px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Avatar initials={initials} size={36} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: BRAND.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 160,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: BRAND.teal,
            fontWeight: 600,
          }}
        >
          {tag}
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({
  title,
  count,
  color,
  leads,
  delayFrame,
}: {
  title: string
  count: number
  color: string
  leads: Array<{ initials: string; name: string; tag: string }>
  delayFrame: number
}) {
  const f = useCurrentFrame()
  const headerOp = interpolate(f, [delayFrame, delayFrame + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return (
    <div
      style={{
        flex: 1,
        background: "#F4F4EE",
        borderRadius: 14,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          opacity: headerOp,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 8px",
          marginBottom: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 18,
            fontWeight: 700,
            color: BRAND.ink,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: color,
            }}
          />
          {title}
        </div>
        <div
          style={{
            fontSize: 16,
            color: BRAND.muted,
            fontWeight: 600,
          }}
        >
          {count}
        </div>
      </div>
      {leads.map((lead, i) => (
        <MiniLeadCard
          key={i}
          {...lead}
          delayFrame={delayFrame + 20 + i * 12}
        />
      ))}
    </div>
  )
}

function Scene8Tablero() {
  const headerStyle = useFadeSlide(0, 22, 20)
  const filtersStyle = useFadeSlide(20, 22, 20)
  const kanbanStyle = useFadeSlide(40, 24, 30)
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "70px 100px",
      }}
    >
      {/* Header */}
      <div
        style={{
          ...headerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.ink }}>
            Tablero de leads
          </div>
        </div>
        {/* Toggle Kanban/Tabla */}
        <div
          style={{
            display: "flex",
            background: "white",
            border: `1px solid ${BRAND.hairline}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 22px",
              background: BRAND.teal,
              color: "white",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Kanban
          </div>
          <div
            style={{
              padding: "10px 22px",
              color: BRAND.muted,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Tabla
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          ...filtersStyle,
          display: "flex",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <Chip>Pauta</Chip>
        <Chip>Etiqueta</Chip>
        <Chip>Estado</Chip>
        <Chip variant="mint">Buscar</Chip>
      </div>

      {/* Kanban */}
      <div
        style={{
          ...kanbanStyle,
          display: "flex",
          gap: 16,
          flex: 1,
        }}
      >
        <KanbanColumn
          title="Nuevo"
          count={3}
          color={BRAND.teal}
          delayFrame={60}
          leads={[
            { initials: "MR", name: "María Rodríguez", tag: "Pocitos" },
            { initials: "JS", name: "Javier Silva", tag: "Carmel" },
          ]}
        />
        <KanbanColumn
          title="En seguimiento"
          count={5}
          color="#D4A017"
          delayFrame={75}
          leads={[
            { initials: "LP", name: "Laura Pereira", tag: "Livvi" },
            { initials: "CG", name: "Carlos González", tag: "Pocitos" },
          ]}
        />
        <KanbanColumn
          title="Conversando"
          count={4}
          color={BRAND.tealAccent}
          delayFrame={90}
          leads={[
            { initials: "SA", name: "Sofía Acosta", tag: "Boating" },
            { initials: "AP", name: "Andrés Pereira", tag: "Galdós" },
          ]}
        />
        <KanbanColumn
          title="Finalizado"
          count={2}
          color={BRAND.muted}
          delayFrame={105}
          leads={[
            { initials: "VL", name: "Valentina López", tag: "Rocha" },
          ]}
        />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 9: Cierre ----------

function Scene9Cierre() {
  const line1 = useFadeSlide(10, 22, 30)
  const line2 = useFadeSlide(60, 22, 20)
  const bar = useFadeSlide(110, 18, 10)
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 22,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...line1,
          fontSize: 70,
          fontWeight: 600,
          color: BRAND.ink,
          letterSpacing: "-0.025em",
          textAlign: "center",
          maxWidth: 1500,
          lineHeight: 1.15,
        }}
      >
        Cada respuesta a una pauta entra al flujo.
      </div>
      <div
        style={{
          ...line2,
          fontSize: 54,
          fontWeight: 700,
          color: BRAND.teal,
          letterSpacing: "-0.02em",
          marginTop: 6,
        }}
      >
        Sin que tengas que mover un dedo.
      </div>
      <div
        style={{
          opacity: bar.opacity,
          width: 120,
          height: 5,
          background: BRAND.teal,
          borderRadius: 2,
          marginTop: 20,
        }}
      />
    </AbsoluteFill>
  )
}

// ---------- Outro ----------

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
        gap: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${slide}px)`,
          fontSize: 130,
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
          width: 140,
          height: 5,
          background: BRAND.teal,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  )
}

// ---------- Root ----------

export function TutorialAutomatizaciones() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* 1: Title 0-210 (0-7s) — incluye 2s de pre-roll antes del audio */}
      <Sequence from={0} durationInFrames={210}>
        <Scene1Title />
      </Sequence>

      {/* 2: Concepto 210-540 (7-18s) */}
      <Sequence from={210} durationInFrames={330}>
        <Scene2Concepto />
      </Sequence>

      {/* 3: Estado Nuevo 540-870 (18-29s) */}
      <Sequence from={540} durationInFrames={330}>
        <Scene3Nuevo />
      </Sequence>

      {/* 4: Seguimiento 1 870-1230 (29-41s) */}
      <Sequence from={870} durationInFrames={360}>
        <Scene4Seg1 />
      </Sequence>

      {/* 5: Seguimiento 2 1230-1620 (41-54s) */}
      <Sequence from={1230} durationInFrames={390}>
        <Scene5Seg2 />
      </Sequence>

      {/* 6: Conversando 1620-1950 (54-65s) */}
      <Sequence from={1620} durationInFrames={330}>
        <Scene6Conversando />
      </Sequence>

      {/* 7: Crear regla 1950-2370 (65-79s) */}
      <Sequence from={1950} durationInFrames={420}>
        <Scene7CrearRegla />
      </Sequence>

      {/* 8: Tablero 2370-2640 (79-88s) */}
      <Sequence from={2370} durationInFrames={270}>
        <Scene8Tablero />
      </Sequence>

      {/* 9: Cierre 2640-2820 (88-94s) */}
      <Sequence from={2640} durationInFrames={180}>
        <Scene9Cierre />
      </Sequence>

      {/* Outro 2820-2910 (94-97s) */}
      <Sequence from={2820} durationInFrames={90}>
        <Outro />
      </Sequence>

      {/* Audio arranca a frame 60 (2s) — pre-roll de respiración */}
      <Sequence from={60}>
        <Audio src={AUDIO_SRC} />
      </Sequence>
    </AbsoluteFill>
  )
}
