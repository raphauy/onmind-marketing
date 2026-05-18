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

// Tutorial Categorías — UI recreada
// Master 16:9 (1920x1080). 124s totales (2s pre-roll + audio 118s + ~4s outro).
// El audio arranca a frame 60 (2s) para dar respiración al inicio.

const AUDIO_SRC = staticFile("tutorials/2026-05-18-categorias/voz.mp3")

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

// ---------- Escena 1: Title (0-90, 0-3s) ----------

function Scene1Title() {
  const titleStyle = useFadeSlide(0, 18, 40)
  const subStyle = useFadeSlide(12, 18, 30)
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 150,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
        }}
      >
        Categorías
      </div>
      <div
        style={{
          ...subStyle,
          fontSize: 38,
          color: BRAND.muted,
        }}
      >
        El motor de la presencia anual.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 2: Definición (90-690, 3-23s) ----------

function CategoryConceptCard({ start }: { start: number }) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const sp = spring({
    frame: f - start,
    fps,
    config: { damping: 16, stiffness: 80, mass: 0.7 },
  })
  const opacity = interpolate(f, [start, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const scale = 0.85 + sp * 0.15

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: "white",
        borderRadius: 28,
        padding: "40px 56px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 28,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 24,
          background: BRAND.mint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BRAND.teal,
        }}
      >
        <svg width={56} height={56} viewBox="0 0 24 24" fill="none">
          <rect x={3} y={3} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
          <rect x={14} y={3} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
          <rect x={3} y={14} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
          <rect x={14} y={14} width={7} height={7} rx={1.5} stroke={BRAND.teal} strokeWidth={2} />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 50, fontWeight: 700, color: BRAND.ink }}>
          Una Categoría
        </div>
        <div style={{ fontSize: 28, color: BRAND.muted, fontWeight: 500 }}>
          agrupa contactos por frecuencia de mensajes
        </div>
      </div>
    </div>
  )
}

function Scene2Definicion() {
  const f = useCurrentFrame()
  const cardOp = interpolate(f, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // "Una sola vez al año..." aparece más tarde
  const subline1Style = useFadeSlide(150, 18, 24)
  // "OnMind se encarga del resto" cierra la escena
  const subline2Op = interpolate(f, [430, 460], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const subline2Slide = interpolate(f, [430, 460], [16, 0], {
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
        gap: 50,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ opacity: cardOp }}>
        <CategoryConceptCard start={0} />
      </div>
      <div
        style={{
          ...subline1Style,
          fontSize: 32,
          color: BRAND.body,
          fontWeight: 500,
          textAlign: "center",
          maxWidth: 1300,
          lineHeight: 1.3,
        }}
      >
        Definís una vez al año cuánto querés aparecer en la vida de cada grupo.
      </div>
      <div
        style={{
          opacity: subline2Op,
          transform: `translateY(${subline2Slide}px)`,
          fontSize: 38,
          color: BRAND.teal,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        OnMind se encarga del resto.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 3: 3 tipos de contactos (690-1320, 23-44s) ----------

type ContactType = {
  title: string
  caption: string
  bg: string
  fg: string
  icon: React.ReactNode
}

function ContactTypeCard({ data, start }: { data: ContactType; start: number }) {
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
  const scale = 0.92 + sp * 0.08

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px) scale(${scale})`,
        background: "white",
        borderRadius: 22,
        padding: "36px 32px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 6px 22px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        width: 380,
        minHeight: 360,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          background: data.bg,
          color: data.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {data.icon}
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: BRAND.ink,
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        {data.title}
      </div>
      <div
        style={{
          fontSize: 22,
          color: BRAND.muted,
          fontWeight: 500,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {data.caption}
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
  const f = useCurrentFrame()
  const headerOp = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const headerSlide = interpolate(f, [0, 22], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Frase de cierre de la escena (B7: "Las Categorías son la forma...")
  const lessonOp = interpolate(f, [470, 500], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const lessonSlide = interpolate(f, [470, 500], [18, 0], {
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
        gap: 50,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
      }}
    >
      <div
        style={{
          opacity: headerOp,
          transform: `translateY(${headerSlide}px)`,
          fontSize: 50,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          textAlign: "center",
        }}
      >
        Tus contactos no son todos iguales.
      </div>
      <div style={{ display: "flex", gap: 36 }}>
        <ContactTypeCard
          data={{
            title: "Clientes activos",
            caption: "Presencia constante. Conversación viva.",
            bg: "#FEE2E2",
            fg: "#DC2626",
            icon: <FlameIcon size={56} color="#DC2626" />,
          }}
          start={80}
        />
        <ContactTypeCard
          data={{
            title: "Cartera tibia",
            caption: "Tocar cada tanto. Que no se enfríen.",
            bg: "#FEF3C7",
            fg: "#D97706",
            icon: <ClockIcon size={56} color="#D97706" />,
          }}
          start={170}
        />
        <ContactTypeCard
          data={{
            title: "Postventa",
            caption: "Aparecer en los momentos clave.",
            bg: "#CFFAFE",
            fg: "#0891B2",
            icon: <HandshakeIcon size={56} color="#0891B2" />,
          }}
          start={260}
        />
      </div>
      <div
        style={{
          opacity: lessonOp,
          transform: `translateY(${lessonSlide}px)`,
          fontSize: 30,
          color: BRAND.teal,
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 1400,
          lineHeight: 1.3,
        }}
      >
        Las Categorías traducen esa diferencia en mensajes reales.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 4: Path + 3 campos (1320-1740, 44-58s) ----------

function FormField({
  label,
  value,
  highlightStart,
  highlightDur = 50,
}: {
  label: string
  value: string
  highlightStart: number
  highlightDur?: number
}) {
  const f = useCurrentFrame()
  const ringOp = interpolate(
    f,
    [highlightStart, highlightStart + 12, highlightStart + highlightDur - 12, highlightStart + highlightDur],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        padding: "4px 8px",
      }}
    >
      <div style={{ fontSize: 20, color: BRAND.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          color: BRAND.ink,
          fontWeight: 600,
          background: BRAND.bg,
          padding: "16px 20px",
          borderRadius: 12,
          border: `1px solid ${BRAND.hairline}`,
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          inset: "-6px -6px -6px -6px",
          border: `4px solid ${BRAND.teal}`,
          borderRadius: 16,
          opacity: ringOp,
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

function Scene4PathForm() {
  const f = useCurrentFrame()
  const breadcrumbStyle = useFadeSlide(0, 16, 16)
  const formOp = interpolate(f, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const formSlide = interpolate(f, [40, 70], [30, 0], {
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
        gap: 36,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          ...breadcrumbStyle,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 28,
          color: BRAND.muted,
          fontWeight: 500,
        }}
      >
        <span>Contactos</span>
        <span style={{ color: BRAND.hairline }}>›</span>
        <span>Configuración</span>
        <span style={{ color: BRAND.hairline }}>›</span>
        <span style={{ color: BRAND.teal, fontWeight: 700 }}>Categorías</span>
      </div>

      {/* Form */}
      <div
        style={{
          opacity: formOp,
          transform: `translateY(${formSlide}px)`,
          background: "white",
          borderRadius: 22,
          padding: 48,
          width: 1100,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 8px 26px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: BRAND.ink, marginBottom: 4 }}>
          Nueva Categoría
        </div>
        <FormField
          label="Nombre"
          value="Clientes activos"
          highlightStart={100}
          highlightDur={70}
        />
        <FormField
          label="Mensajes al año"
          value="12"
          highlightStart={185}
          highlightDur={70}
        />
        <FormField
          label="Plantillas"
          value="12 plantillas seleccionadas"
          highlightStart={270}
          highlightDur={70}
        />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 5: Frecuencias ejemplo (1740-1950, 58-65s) ----------

function FrequencyCard({
  name,
  count,
  start,
  accent,
}: {
  name: string
  count: number
  start: number
  accent: string
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
  const scale = 0.92 + sp * 0.08

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slide}px) scale(${scale})`,
        background: "white",
        borderRadius: 20,
        padding: "32px 38px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 360,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 24,
          color: BRAND.muted,
          fontWeight: 600,
          letterSpacing: "-0.005em",
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: 130,
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.04em",
        }}
      >
        {counted}
      </div>
      <div style={{ fontSize: 22, color: BRAND.muted, fontWeight: 500 }}>
        mensajes al año
      </div>
    </div>
  )
}

function Scene5Frecuencias() {
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        gap: 30,
      }}
    >
      <div style={{ display: "flex", gap: 36 }}>
        <FrequencyCard name="Clientes activos" count={12} start={0} accent={BRAND.teal} />
        <FrequencyCard name="Cartera tibia" count={6} start={45} accent={BRAND.teal} />
        <FrequencyCard name="Postventa" count={4} start={90} accent={BRAND.teal} />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 6: Rotación plantillas (1950-2550, 65-85s) ----------

function TemplatePreview({
  title,
  content,
  start,
  highlight,
  side,
}: {
  title: string
  content: React.ReactNode
  start: number
  highlight: string
  side: "left" | "right"
}) {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [start, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [start, start + 24], [side === "left" ? -40 : 40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slide}px)`,
        background: "white",
        borderRadius: 20,
        padding: "26px 30px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: 560,
        minHeight: 240,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          background: highlight,
          color: BRAND.teal,
          padding: "6px 14px",
          borderRadius: 999,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 22,
          color: BRAND.body,
          lineHeight: 1.45,
          fontWeight: 500,
        }}
      >
        {content}
      </div>
    </div>
  )
}

function Scene6Rotacion() {
  const f = useCurrentFrame()
  const headerOp = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const headerSlide = interpolate(f, [0, 22], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // El "12 plantillas/año" badge dentro del header pulsa
  const badgePulse = interpolate(
    f,
    [40, 55, 70, 85],
    [0, 0.7, 0, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  // Flecha → entre plantilla cruda y renderizada
  const arrowOp = interpolate(f, [310, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Cierre: "OnMind toma la plantilla que toca..."
  const noteOp = interpolate(f, [490, 520], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const noteSlide = interpolate(f, [490, 520], [16, 0], {
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
        gap: 36,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header con nombre + count */}
      <div
        style={{
          opacity: headerOp,
          transform: `translateY(${headerSlide}px)`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          position: "relative",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, color: BRAND.ink, letterSpacing: "-0.025em" }}>
          Buscadores
        </div>
        <div
          style={{
            background: BRAND.mint,
            color: BRAND.teal,
            padding: "10px 22px",
            borderRadius: 999,
            fontSize: 24,
            fontWeight: 700,
            position: "relative",
          }}
        >
          12 plantillas
          <div
            style={{
              position: "absolute",
              inset: -6,
              border: `3px solid ${BRAND.teal}`,
              borderRadius: 999,
              opacity: badgePulse,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Plantillas: cruda → renderizada */}
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <TemplatePreview
          title="Plantilla"
          highlight={BRAND.mint}
          side="left"
          start={120}
          content={
            <>
              Hola{" "}
              <span
                style={{
                  background: BRAND.mintHighlight,
                  color: BRAND.teal,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 6,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 20,
                }}
              >
                {"{nombre}"}
              </span>
              , ¿cómo estás?
              <br />
              Paso por acá para retomar el contacto. La última vez quedamos en que seguías mirando opciones.
              <br />
              <br />
              ¿Cómo viene la búsqueda? ¿Cambió algo en lo que estás necesitando?
            </>
          }
        />
        <div
          style={{
            opacity: arrowOp,
            fontSize: 60,
            color: BRAND.teal,
            fontWeight: 300,
          }}
        >
          →
        </div>
        <TemplatePreview
          title="Enviado a María Rodríguez"
          highlight={BRAND.mint}
          side="right"
          start={340}
          content={
            <>
              Hola <span style={{ color: BRAND.teal, fontWeight: 700 }}>María</span>, ¿cómo estás?
              <br />
              Paso por acá para retomar el contacto. La última vez quedamos en que seguías mirando opciones.
              <br />
              <br />
              ¿Cómo viene la búsqueda? ¿Cambió algo en lo que estás necesitando?
            </>
          }
        />
      </div>

      {/* Note */}
      <div
        style={{
          opacity: noteOp,
          transform: `translateY(${noteSlide}px)`,
          fontSize: 26,
          color: BRAND.muted,
          fontWeight: 500,
          textAlign: "center",
          maxWidth: 1300,
        }}
      >
        OnMind toma la plantilla que toca y la personaliza con el nombre de cada contacto.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 7: Calendario hábiles (2550-2970, 85-99s) ----------

type DayKind = "send" | "weekend" | "holiday" | "empty"

function CalendarDay({
  day,
  kind,
  appearAt,
}: {
  day: number
  kind: DayKind
  appearAt: number
}) {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [appearAt, appearAt + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  let bg = "transparent"
  let fg = BRAND.muted
  let border = `1px solid ${BRAND.hairline}`
  let bold = false

  if (kind === "send") {
    bg = BRAND.teal
    fg = "white"
    border = `1px solid ${BRAND.teal}`
    bold = true
  } else if (kind === "weekend") {
    bg = "#F3F4F6"
    fg = "#9CA3AF"
  } else if (kind === "holiday") {
    bg = "#FEE2E2"
    fg = "#B91C1C"
  }

  return (
    <div
      style={{
        opacity,
        width: 72,
        height: 72,
        borderRadius: 14,
        background: bg,
        color: fg,
        border,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        fontWeight: bold ? 700 : 500,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {day || ""}
    </div>
  )
}

function Legend({
  color,
  label,
  start,
}: {
  color: string
  label: string
  start: number
}) {
  const f = useCurrentFrame()
  const op = interpolate(f, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return (
    <div style={{ opacity: op, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: color }} />
      <span style={{ fontSize: 22, color: BRAND.body, fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function Scene7Calendar() {
  const f = useCurrentFrame()
  const headerStyle = useFadeSlide(0, 16, 20)

  // Mes ejemplo: marzo 2026. 1 marzo = domingo.
  // Layout: lun, mar, mié, jue, vie, sáb, dom
  // Semana 1: -, -, -, -, -, -, 1 (dom)
  // Semana 2: 2, 3, 4, 5, 6, 7, 8
  // ... y así
  // Marcamos como SEND ~6 días hábiles del mes para "Clientes activos" (~12/año / 12 meses ≈ 1; usemos 2 por mes para que se vea).
  // En realidad para Clientes activos 12 al año son ~1 por mes. Pero el grid se ve raro con un solo dot.
  // Mejor: mostrar 4 mensajes en el mes (rondará "Cartera tibia" o "activos+otros"). Lo dejamos genérico.

  // Genero estructura del grid (5-6 semanas)
  type Cell = { day: number; kind: DayKind }
  const month: Cell[] = []
  const startDow = 6 // 1 marzo = domingo → posición 6 (last col)
  // Empty slots
  for (let i = 0; i < startDow; i++) month.push({ day: 0, kind: "empty" })
  const daysInMonth = 31
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (startDow + d - 1) % 7 // 0=lun .. 6=dom
    const isWeekend = dow === 5 || dow === 6
    month.push({ day: d, kind: isWeekend ? "weekend" : "empty" })
  }
  // Mark sends: días hábiles concretos
  const sendDays = [3, 11, 18, 26] // 4 envíos en el mes
  for (const cell of month) {
    if (cell.day && sendDays.includes(cell.day) && cell.kind === "empty") {
      cell.kind = "send"
    }
  }

  // Stagger appearance of cells based on day
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 30,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...headerStyle,
          fontSize: 38,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
        }}
      >
        Marzo 2026 · Calendario automático
      </div>

      {/* Días de la semana */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 72px)", gap: 10 }}>
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div
            key={i}
            style={{
              width: 72,
              textAlign: "center",
              fontSize: 18,
              color: BRAND.muted,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 72px)", gap: 10 }}>
        {month.map((cell, i) => (
          <CalendarDay
            key={i}
            day={cell.day}
            kind={cell.kind}
            appearAt={20 + i * 2}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 40, marginTop: 14 }}>
        <Legend color={BRAND.teal} label="Mensajes enviados" start={120} />
        <Legend color="#F3F4F6" label="Fines de semana (no se tocan)" start={140} />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 8: Asignar contactos (2970-3300, 99-110s) ----------

function ContactRow({
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
        borderRadius: 16,
        padding: "20px 28px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        width: 760,
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          background: BRAND.mint,
          color: BRAND.teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        {initials}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: BRAND.ink }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 16,
              color: BRAND.muted,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Categoría
          </span>
          <div style={{ position: "relative", height: 36 }}>
            <span
              style={{
                opacity: oldOp,
                position: showNew ? "absolute" : "relative",
                left: 0,
                top: 0,
                background: BRAND.mint,
                color: BRAND.teal,
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: 20,
                fontWeight: 700,
                whiteSpace: "nowrap",
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
                  padding: "6px 16px",
                  borderRadius: 999,
                  fontSize: 20,
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
    </div>
  )
}

function Scene8Asignar() {
  const f = useCurrentFrame()
  const headerStyle = useFadeSlide(0, 16, 20)

  // Toast "Calendario reajustado" después del cambio
  const toastOp = interpolate(f, [230, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const toastSlide = interpolate(f, [230, 260], [16, 0], {
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
        gap: 30,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...headerStyle,
          fontSize: 38,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
        }}
      >
        Asignar es un campo en la ficha.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <ContactRow
          initials="MR"
          name="María Rodríguez"
          category="Buscadores"
          start={40}
          changeAt={180}
          newCategory="Postventa"
        />
        <ContactRow
          initials="CG"
          name="Carlos González"
          category="Clientes activos"
          start={80}
        />
        <ContactRow
          initials="SA"
          name="Sofía Acosta"
          category="Cartera tibia"
          start={120}
        />
      </div>

      <div
        style={{
          opacity: toastOp,
          transform: `translateY(${toastSlide}px)`,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          background: BRAND.mint,
          color: BRAND.teal,
          padding: "14px 24px",
          borderRadius: 999,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        <CheckIcon size={24} color={BRAND.teal} />
        Calendario reajustado
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 9: Cierre (3300-3570, 110-119s) ----------

function Scene9Closing() {
  const f = useCurrentFrame()
  const line1 = useFadeSlide(0, 20, 26)
  const line2Op = interpolate(f, [90, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line2Slide = interpolate(f, [90, 120], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line3Op = interpolate(f, [160, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line3Slide = interpolate(f, [160, 190], [20, 0], {
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
        padding: "0 80px",
      }}
    >
      <div
        style={{
          ...line1,
          fontSize: 46,
          fontWeight: 500,
          color: BRAND.muted,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 1500,
          lineHeight: 1.2,
        }}
      >
        Configurás las Categorías una sola vez.
      </div>
      <div
        style={{
          opacity: line2Op,
          transform: `translateY(${line2Slide}px)`,
          fontSize: 56,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.025em",
          textAlign: "center",
          maxWidth: 1500,
          lineHeight: 1.2,
        }}
      >
        Definí la frecuencia.
      </div>
      <div
        style={{
          opacity: line3Op,
          transform: `translateY(${line3Slide}px)`,
          fontSize: 56,
          fontWeight: 700,
          color: BRAND.teal,
          letterSpacing: "-0.025em",
          textAlign: "center",
          maxWidth: 1500,
          lineHeight: 1.2,
        }}
      >
        Olvidate del resto.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Outro (3570-3660, 119-122s) ----------

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

export function TutorialCategorias() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* 1: Title 0-150 (0-5s) — incluye 2s de pre-roll antes del audio */}
      <Sequence from={0} durationInFrames={150}>
        <Scene1Title />
      </Sequence>

      {/* 2: Definición 150-750 */}
      <Sequence from={150} durationInFrames={600}>
        <Scene2Definicion />
      </Sequence>

      {/* 3: 3 tipos 750-1380 */}
      <Sequence from={750} durationInFrames={630}>
        <Scene3Tipos />
      </Sequence>

      {/* 4: Path + 3 campos 1380-1800 */}
      <Sequence from={1380} durationInFrames={420}>
        <Scene4PathForm />
      </Sequence>

      {/* 5: Frecuencias 1800-2010 */}
      <Sequence from={1800} durationInFrames={210}>
        <Scene5Frecuencias />
      </Sequence>

      {/* 6: Rotación 2010-2610 */}
      <Sequence from={2010} durationInFrames={600}>
        <Scene6Rotacion />
      </Sequence>

      {/* 7: Calendario 2610-3030 */}
      <Sequence from={2610} durationInFrames={420}>
        <Scene7Calendar />
      </Sequence>

      {/* 8: Asignar 3030-3360 */}
      <Sequence from={3030} durationInFrames={330}>
        <Scene8Asignar />
      </Sequence>

      {/* 9: Cierre 3360-3630 */}
      <Sequence from={3360} durationInFrames={270}>
        <Scene9Closing />
      </Sequence>

      {/* Outro 3630-3720 */}
      <Sequence from={3630} durationInFrames={90}>
        <Outro />
      </Sequence>

      {/* Audio arranca a frame 60 (2s) — pre-roll de respiración */}
      <Sequence from={60}>
        <Audio src={AUDIO_SRC} />
      </Sequence>
    </AbsoluteFill>
  )
}
