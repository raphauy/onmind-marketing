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

// Tutorial Automatizaciones — versión 9:16 (Reel/Stories)
// Master 1080x1920. 97s totales. Mismo audio y guion que tutorial-automatizaciones,
// layout reorganizado vertical: timer arriba/bubble abajo, kanban 2x2, etc.

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
        padding: "8px 18px",
        borderRadius: 999,
        fontSize: 28,
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
        gap: 26,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 130,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        Automatiza-<br />ciones
      </div>
      <div
        style={{
          ...subStyle,
          fontSize: 46,
          color: BRAND.muted,
          textAlign: "center",
        }}
      >
        Cómo trabajan en el día a día.
      </div>
      <div
        style={{
          opacity: barStyle.opacity,
          width: 160,
          height: 6,
          background: BRAND.teal,
          borderRadius: 3,
          marginTop: 20,
        }}
      />
    </AbsoluteFill>
  )
}

// ---------- Escena 2: Detección (chat arriba, lead abajo) ----------

function Scene2Concepto() {
  const f = useCurrentFrame()
  const chatStyle = useFadeSlide(0, 22, 40)
  const bubbleStyle = useFadeSlide(20, 18, 30)
  const highlightOp = interpolate(f, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const arrowOp = interpolate(f, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const cardStyle = useFadeSlide(150, 22, 40)
  const captionStyle = useFadeSlide(200, 20, 20)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "120px 60px",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
      }}
    >
      {/* Chat WhatsApp arriba */}
      <div
        style={{
          ...chatStyle,
          width: 900,
          background: "white",
          borderRadius: 28,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "22px 28px",
            background: BRAND.bg,
            borderBottom: `1px solid ${BRAND.hairline}`,
          }}
        >
          <Avatar initials="MR" size={62} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: BRAND.ink }}>
              María Rodríguez
            </div>
            <div style={{ fontSize: 22, color: BRAND.muted }}>+598 99 123 456</div>
          </div>
        </div>
        <div
          style={{
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minHeight: 240,
            background: "#F7F7F2",
          }}
        >
          <div
            style={{
              ...bubbleStyle,
              background: "white",
              borderRadius: 22,
              padding: "20px 24px",
              fontSize: 32,
              lineHeight: 1.35,
              color: BRAND.body,
              alignSelf: "flex-start",
              maxWidth: 740,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              border: `1px solid ${BRAND.hairline}`,
            }}
          >
            Quiero más información de{" "}
            <span
              style={{
                background: `rgba(0, 112, 86, ${0.18 * highlightOp})`,
                padding: "2px 6px",
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
              fontSize: 22,
              color: BRAND.muted,
              fontStyle: "italic",
            }}
          >
            Texto disparador detectado
          </div>
        </div>
      </div>

      {/* Flecha abajo */}
      <div
        style={{
          opacity: arrowOp,
          fontSize: 80,
          color: BRAND.teal,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        ↓
      </div>

      {/* Card lead */}
      <div
        style={{
          ...cardStyle,
          width: 720,
          background: "white",
          borderRadius: 26,
          padding: 36,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 22 }}>
          <Avatar initials="MR" size={68} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 700, color: BRAND.ink }}>
              María Rodríguez
            </div>
            <div style={{ fontSize: 22, color: BRAND.muted }}>+598 99 123 456</div>
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 22px",
            background: BRAND.mint,
            color: BRAND.teal,
            borderRadius: 999,
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: BRAND.teal,
            }}
          />
          Lead nuevo
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 3: Estado Nuevo (lead card grande centrada) ----------

function Scene3Nuevo() {
  const f = useCurrentFrame()
  const cardStyle = useFadeSlide(0, 24, 30)
  const catOp = interpolate(f, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const tagOp = interpolate(f, [100, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const stateOp = interpolate(f, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const captionStyle = useFadeSlide(220, 18, 20)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        gap: 50,
        flexDirection: "column",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          ...cardStyle,
          width: 900,
          background: "white",
          borderRadius: 30,
          padding: 56,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 36,
          }}
        >
          <Avatar initials="MR" size={110} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 46, fontWeight: 700, color: BRAND.ink }}>
              María Rodríguez
            </div>
            <div style={{ fontSize: 28, color: BRAND.muted }}>+598 99 123 456</div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div style={{ opacity: catOp }}>
            <Chip variant="mint">Categoría B</Chip>
          </div>
          <div style={{ opacity: tagOp }}>
            <Chip>Pocitos</Chip>
          </div>
        </div>

        <div
          style={{
            opacity: stateOp,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 28px",
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
          Estado: Nuevo
        </div>
      </div>
      <div
        style={{
          ...captionStyle,
          fontSize: 34,
          color: BRAND.muted,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        Categoría y etiquetas ya aplicadas según la regla.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 4: Seguimiento 1 (timer arriba, bubble abajo) ----------

function Scene4Seg1() {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame()
  const timerStyle = useFadeSlide(0, 22, 30)
  const counter = Math.round(
    interpolate(f, [20, 80], [0, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  )
  const noteOp = interpolate(f, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const bubbleStyle = useFadeSlide(130, 22, 40)
  const stateOp = interpolate(f, [240, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
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
        padding: "120px 60px",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
      }}
    >
      {/* Timer */}
      <div
        style={{
          ...timerStyle,
          width: 600,
          background: "white",
          borderRadius: 28,
          padding: 44,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <ClockIcon size={80} />
        </div>
        <div
          style={{
            fontSize: 150,
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
            marginTop: 14,
            fontSize: 28,
            color: BRAND.muted,
          }}
        >
          tiempo configurable
        </div>
      </div>

      {/* Bubble */}
      <div
        style={{
          ...bubbleStyle,
          background: BRAND.mint,
          borderRadius: 26,
          padding: "30px 34px",
          fontSize: 36,
          lineHeight: 1.4,
          color: BRAND.body,
          maxWidth: 880,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            color: BRAND.teal,
            fontSize: 22,
            marginBottom: 10,
          }}
        >
          OnMind · Bienvenida
        </div>
        Cómo estás? Un gusto, en qué te puedo ayudar?
        <br />
        <br />
        Te paso link de la propiedad.
      </div>

      {/* Estado */}
      <div
        style={{
          opacity: stateOp,
          transform: `scale(${0.9 + 0.1 * statePulse})`,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 28px",
          background: "white",
          border: `3px solid ${BRAND.teal}`,
          color: BRAND.teal,
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
            background: BRAND.teal,
          }}
        />
        Estado: En seguimiento
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 5: Seguimiento 2 (timer + bubble + franja apilados) ----------

function Scene5Seg2() {
  const f = useCurrentFrame()
  const timerStyle = useFadeSlide(0, 22, 30)
  const noResponseStyle = useFadeSlide(50, 18, 20)
  const bubbleStyle = useFadeSlide(130, 22, 40)
  const timelineStyle = useFadeSlide(220, 22, 30)
  const markerOp = interpolate(f, [280, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "90px 60px",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
      }}
    >
      {/* Timer + sin respuesta inline */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            ...timerStyle,
            background: "white",
            borderRadius: 24,
            padding: 30,
            border: `1px solid ${BRAND.hairline}`,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            textAlign: "center",
            width: 380,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <ClockIcon size={60} />
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
            48 hs
          </div>
        </div>
        <div
          style={{
            ...noResponseStyle,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 22px",
            background: "white",
            border: `1px solid ${BRAND.hairline}`,
            color: BRAND.muted,
            borderRadius: 14,
            fontSize: 26,
            fontWeight: 600,
            maxWidth: 280,
            textAlign: "center",
            lineHeight: 1.25,
          }}
        >
          Contacto no respondió
        </div>
      </div>

      {/* Bubble */}
      <div
        style={{
          ...bubbleStyle,
          background: BRAND.mint,
          borderRadius: 24,
          padding: "26px 30px",
          fontSize: 32,
          lineHeight: 1.4,
          color: BRAND.body,
          maxWidth: 900,
          border: `1px solid ${BRAND.hairline}`,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            color: BRAND.teal,
            fontSize: 22,
            marginBottom: 8,
          }}
        >
          OnMind · Recordatorio
        </div>
        Cómo andás? Pudiste ver la información que te mandé?
      </div>

      {/* Franja horaria */}
      <div
        style={{
          ...timelineStyle,
          width: 920,
          background: "white",
          borderRadius: 20,
          padding: 30,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: BRAND.body,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Envío solo en horario laboral
        </div>
        <div
          style={{
            position: "relative",
            height: 44,
            background: "#F0F0EA",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "41.6%",
              width: "37.5%",
              top: 0,
              bottom: 0,
              background: BRAND.mint,
              border: `2px solid ${BRAND.teal}`,
              borderRadius: 8,
            }}
          />
          <div
            style={{
              opacity: markerOp,
              position: "absolute",
              left: "58%",
              top: -6,
              bottom: -6,
              width: 5,
              background: BRAND.teal,
              borderRadius: 2,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            fontSize: 22,
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
    </AbsoluteFill>
  )
}

// ---------- Escena 6: Conversando ----------

function Scene6Conversando() {
  const { fps } = useVideoConfig()
  const f = useCurrentFrame()
  const bubbleStyle = useFadeSlide(20, 22, 30)
  const stateOp = interpolate(f, [110, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const statePulse = spring({
    frame: Math.max(0, f - 120),
    fps,
    config: { damping: 14, stiffness: 80 },
  })
  const badgeStyle = useFadeSlide(180, 22, 20)

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "150px 60px",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 50,
      }}
    >
      <div
        style={{
          ...bubbleStyle,
          alignSelf: "stretch",
          background: "white",
          borderRadius: 26,
          padding: "32px 34px",
          fontSize: 38,
          lineHeight: 1.35,
          color: BRAND.body,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <Avatar initials="MR" size={50} />
          <div style={{ fontSize: 26, color: BRAND.muted, fontWeight: 600 }}>
            María Rodríguez
          </div>
        </div>
        Sí, justo me interesa la zona. Tenés más detalles?
      </div>

      <div
        style={{
          opacity: stateOp,
          transform: `scale(${0.9 + 0.1 * statePulse})`,
          display: "inline-flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 36px",
          background: BRAND.teal,
          color: "white",
          borderRadius: 999,
          fontSize: 38,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: "white",
          }}
        />
        Estado: Conversando
      </div>

      <div
        style={{
          ...badgeStyle,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 24px",
          background: "white",
          border: `1px solid ${BRAND.hairline}`,
          borderRadius: 999,
          fontSize: 26,
          color: BRAND.body,
          textAlign: "center",
        }}
      >
        <CheckIcon size={26} />
        Seguimientos pendientes cancelados
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 7: Crear regla (form vertical full-width) ----------

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
      <div style={{ fontSize: 22, fontWeight: 600, color: BRAND.muted }}>{label}</div>
      <div
        style={{
          padding: "14px 18px",
          background: "white",
          border: `2px solid ${highlight ? BRAND.teal : BRAND.hairline}`,
          borderRadius: 12,
          fontSize: 26,
          color: BRAND.body,
          minHeight: 36,
          boxShadow: highlight ? `0 0 0 4px rgba(0,112,86,0.18)` : "none",
          display: "flex",
          alignItems: "center",
          gap: 12,
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
  const noteStyle = useFadeSlide(20, 22, 20)
  const highlightFor = (start: number, end: number) => f >= start && f < end

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "60px 60px",
        flexDirection: "column",
        gap: 22,
      }}
    >
      {/* Nota arriba */}
      <div
        style={{
          ...noteStyle,
          fontSize: 32,
          fontWeight: 700,
          color: BRAND.ink,
          textAlign: "center",
          lineHeight: 1.25,
          marginBottom: 6,
        }}
      >
        Se configura una vez.{" "}
        <span style={{ color: BRAND.teal }}>Queda corriendo sola.</span>
      </div>

      {/* Form */}
      <div
        style={{
          ...containerStyle,
          flex: 1,
          background: "white",
          borderRadius: 28,
          padding: 36,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: BRAND.mint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4 14H11L10 22L19 10H12L13 2Z" fill={BRAND.teal} />
            </svg>
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, color: BRAND.ink }}>
            Nueva regla
          </div>
        </div>

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

        <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              padding: "14px 36px",
              background: BRAND.teal,
              color: "white",
              borderRadius: 12,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Guardar
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 8: Tablero (Kanban 2x2) ----------

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
        gap: 12,
      }}
    >
      <Avatar initials={initials} size={42} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: BRAND.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 280,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 16,
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
        background: "#F4F4EE",
        borderRadius: 16,
        padding: 16,
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
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            fontWeight: 700,
            color: BRAND.ink,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: color,
            }}
          />
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
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
        padding: "100px 60px",
      }}
    >
      {/* Header */}
      <div
        style={{
          ...headerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, color: BRAND.ink }}>
          Tablero de leads
        </div>
        <div
          style={{
            display: "flex",
            background: "white",
            border: `1px solid ${BRAND.hairline}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 22px",
              background: BRAND.teal,
              color: "white",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Kanban
          </div>
          <div
            style={{
              padding: "10px 22px",
              color: BRAND.muted,
              fontSize: 22,
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
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <Chip>Pauta</Chip>
        <Chip>Etiqueta</Chip>
        <Chip>Estado</Chip>
        <Chip variant="mint">Buscar</Chip>
      </div>

      {/* Kanban 2x2 grid */}
      <div
        style={{
          ...kanbanStyle,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
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
        gap: 26,
        fontFamily: "system-ui, sans-serif",
        padding: "0 70px",
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
          lineHeight: 1.15,
        }}
      >
        Cada respuesta a una pauta entra al flujo.
      </div>
      <div
        style={{
          ...line2,
          fontSize: 58,
          fontWeight: 700,
          color: BRAND.teal,
          letterSpacing: "-0.02em",
          marginTop: 12,
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        Sin que tengas que mover un dedo.
      </div>
      <div
        style={{
          opacity: bar.opacity,
          width: 140,
          height: 6,
          background: BRAND.teal,
          borderRadius: 3,
          marginTop: 24,
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
          fontSize: 110,
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
          height: 6,
          background: BRAND.teal,
          borderRadius: 3,
        }}
      />
    </AbsoluteFill>
  )
}

// ---------- Root ----------

export function TutorialAutomatizaciones9x16() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Sequence from={0} durationInFrames={210}>
        <Scene1Title />
      </Sequence>
      <Sequence from={210} durationInFrames={330}>
        <Scene2Concepto />
      </Sequence>
      <Sequence from={540} durationInFrames={330}>
        <Scene3Nuevo />
      </Sequence>
      <Sequence from={870} durationInFrames={360}>
        <Scene4Seg1 />
      </Sequence>
      <Sequence from={1230} durationInFrames={390}>
        <Scene5Seg2 />
      </Sequence>
      <Sequence from={1620} durationInFrames={330}>
        <Scene6Conversando />
      </Sequence>
      <Sequence from={1950} durationInFrames={420}>
        <Scene7CrearRegla />
      </Sequence>
      <Sequence from={2370} durationInFrames={270}>
        <Scene8Tablero />
      </Sequence>
      <Sequence from={2640} durationInFrames={180}>
        <Scene9Cierre />
      </Sequence>
      <Sequence from={2820} durationInFrames={90}>
        <Outro />
      </Sequence>

      <Sequence from={60}>
        <Audio src={AUDIO_SRC} />
      </Sequence>
    </AbsoluteFill>
  )
}
