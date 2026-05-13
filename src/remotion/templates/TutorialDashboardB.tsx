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

// Prototipo B — Tutorial Dashboard (UI recreada)
// Approach: componentes React replicando los elementos clave del Dashboard,
// con animaciones de entrada, count-up y cursor simulando click.
// Master 16:9 (1920x1080). 22s totales.

const AUDIO_SRC = staticFile(
  "tutorials/2026-05-11-prototipo-dashboard/voz.mp3"
)

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

// ---------- Escena 1: Title ----------

function Scene1Title() {
  const titleStyle = useFadeSlide(0, 18, 40)
  const subStyle = useFadeSlide(10, 18, 40)
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 140,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.03em",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Dashboard
      </div>
      <div
        style={{
          ...subStyle,
          fontSize: 38,
          color: BRAND.muted,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Resumen de mensajes programados
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 2: Métricas con count-up ----------

function MetricCard({
  label,
  value,
  delay,
}: {
  label: string
  value: number
  delay: number
}) {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = f - delay
  const opacity = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const sp = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  })
  const translateY = (1 - sp) * 50

  // count-up: empieza a contar después del fade-in inicial
  const counted = Math.round(
    interpolate(localFrame, [12, 50], [0, value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  )

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "white",
        borderRadius: 18,
        padding: "36px 44px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        border: `1px solid ${BRAND.hairline}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        minWidth: 320,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 26,
          color: BRAND.muted,
          marginBottom: 12,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {counted}
      </div>
    </div>
  )
}

function Scene2Metrics() {
  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        <MetricCard label="Pendientes hoy" value={15} delay={0} />
        <MetricCard label="Pendientes mañana" value={22} delay={12} />
        <MetricCard label="Próximos 7 días" value={103} delay={24} />
        <MetricCard label="Próximos 30 días" value={661} delay={36} />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 3: Tarjeta de mensaje con highlights ----------

function Scene3MessageCard() {
  const f = useCurrentFrame()
  const cardOpacity = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const cardSlide = interpolate(f, [0, 18], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const h1Opacity = interpolate(f, [24, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const h2Opacity = interpolate(f, [44, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const h3Opacity = interpolate(f, [64, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardSlide}px)`,
          background: "white",
          borderRadius: 22,
          padding: 44,
          width: 1080,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Contacto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              background: BRAND.mint,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 28,
              color: BRAND.teal,
            }}
          >
            MR
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: BRAND.ink,
            }}
          >
            María Rodríguez
          </div>
          <div
            style={{
              position: "absolute",
              left: -12,
              top: -12,
              right: -12,
              bottom: -12,
              border: `4px solid ${BRAND.teal}`,
              borderRadius: 14,
              opacity: h1Opacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -160,
              top: 18,
              opacity: h1Opacity,
              fontSize: 22,
              fontWeight: 600,
              color: BRAND.teal,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Contacto
          </div>
        </div>

        {/* Contenido */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 30,
              color: BRAND.body,
              lineHeight: 1.45,
            }}
          >
            Hola, ¿cómo estás? Te comparto esto porque quiero hacerte la
            búsqueda mucho más fácil.
          </div>
          <div
            style={{
              position: "absolute",
              left: -12,
              top: -10,
              right: -12,
              bottom: -10,
              border: `4px solid ${BRAND.teal}`,
              borderRadius: 12,
              opacity: h2Opacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -160,
              top: 18,
              opacity: h2Opacity,
              fontSize: 22,
              fontWeight: 600,
              color: BRAND.teal,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Contenido
          </div>
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <div
            style={{
              background: BRAND.mint,
              color: BRAND.teal,
              padding: "10px 22px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 22,
            }}
          >
            Programado
          </div>
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "#FEF3C7",
                color: "#854D0E",
                padding: "10px 22px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 22,
              }}
            >
              Categoría
            </div>
            <div
              style={{
                position: "absolute",
                left: -10,
                top: -10,
                right: -10,
                bottom: -10,
                border: `4px solid ${BRAND.teal}`,
                borderRadius: 999,
                opacity: h3Opacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: -10,
                top: -50,
                opacity: h3Opacity,
                fontSize: 22,
                fontWeight: 600,
                color: BRAND.teal,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}
            >
              Categoría
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 4: Botón Procesar con cursor click ----------

function CursorSvg({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
    >
      <path
        d="M3 2L21 12L12 14L8 22L3 2Z"
        fill={BRAND.ink}
        stroke="white"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Scene4Button() {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fadeIn = interpolate(f, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Cursor entra desde abajo derecha y llega al botón
  const cursorEase = spring({
    frame: f - 20,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  })
  const cursorX = (1 - cursorEase) * 400
  const cursorY = (1 - cursorEase) * 280

  // Click pulse
  const pulse = interpolate(f, [82, 92, 100], [1, 0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Confirmación "enviando"
  const sentOpacity = interpolate(f, [102, 122], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const sentSlide = interpolate(f, [102, 122], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill
      style={{
        background: BRAND.bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: fadeIn,
          position: "relative",
        }}
      >
        <div
          style={{
            background: BRAND.teal,
            color: "white",
            fontSize: 42,
            fontWeight: 600,
            padding: "28px 52px",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 18,
            transform: `scale(${pulse})`,
            boxShadow: "0 8px 20px rgba(0,112,86,0.25)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 0,
              height: 0,
              borderLeft: "20px solid white",
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
            }}
          />
          Procesar mensajes para hoy (15)
        </div>

        {/* Cursor */}
        <div
          style={{
            position: "absolute",
            right: -40,
            bottom: -40,
            transform: `translate(${cursorX}px, ${cursorY}px)`,
          }}
        >
          <CursorSvg size={64} />
        </div>

        {/* Confirmación */}
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 32px)",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: sentOpacity,
            transform: `translateY(${sentSlide}px)`,
            fontSize: 32,
            fontWeight: 600,
            color: BRAND.teal,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <span>✓</span> Mensajes en camino
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 5: Cierre ----------

function Scene5Closing() {
  const f = useCurrentFrame()
  const opacity = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const slide = interpolate(f, [0, 22], [30, 0], {
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
          fontSize: 84,
          fontWeight: 700,
          color: BRAND.ink,
          letterSpacing: "-0.025em",
          textAlign: "center",
          lineHeight: 1.05,
          maxWidth: 1400,
        }}
      >
        Todo tu negocio,
        <br />
        en una sola pantalla.
      </div>
      <div
        style={{
          opacity,
          width: 140,
          height: 5,
          background: BRAND.teal,
          borderRadius: 2,
          marginTop: 16,
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

export function TutorialDashboardB() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* Escena 1: 0-90 (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1Title />
      </Sequence>

      {/* Escena 2: 90-240 (3-8s) */}
      <Sequence from={90} durationInFrames={150}>
        <Scene2Metrics />
      </Sequence>

      {/* Escena 3: 240-360 (8-12s) */}
      <Sequence from={240} durationInFrames={120}>
        <Scene3MessageCard />
      </Sequence>

      {/* Escena 4: 360-510 (12-17s) */}
      <Sequence from={360} durationInFrames={150}>
        <Scene4Button />
      </Sequence>

      {/* Escena 5: 510-585 (17-19.5s) */}
      <Sequence from={510} durationInFrames={75}>
        <Scene5Closing />
      </Sequence>

      {/* Outro: 585-660 (19.5-22s) */}
      <Sequence from={585} durationInFrames={75}>
        <Outro />
      </Sequence>

      {/* Audio narración */}
      <Audio src={AUDIO_SRC} />
    </AbsoluteFill>
  )
}
