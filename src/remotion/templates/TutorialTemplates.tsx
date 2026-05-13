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

// Tutorial Templates — UI recreada
// Master 16:9 (1920x1080). 24s totales (audio 19.07s + ~5s cierre/outro).

const AUDIO_SRC = staticFile("tutorials/2026-05-11-templates/voz.mp3")

const TEMPLATE_TEXT_PRE = "¡Feliz cumpleaños, "
const TEMPLATE_TEXT_POST =
  "! Que tengas un día hermoso rodeado de los tuyos. Un abrazo grande."

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
        Templates
      </div>
      <div
        style={{
          ...subStyle,
          fontSize: 38,
          color: BRAND.muted,
        }}
      >
        Una plantilla, mensajes únicos.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 2: Idea — escribís una sola vez ----------

function Scene2Idea() {
  const f = useCurrentFrame()
  const { fps } = useVideoConfig()

  const oneSpring = spring({
    frame: f,
    fps,
    config: { damping: 12, stiffness: 70, mass: 0.6 },
  })
  const oneScale = 0.7 + oneSpring * 0.3

  const text = useFadeSlide(14, 20, 28)

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
          opacity: oneSpring,
          transform: `scale(${oneScale})`,
          fontSize: 280,
          fontWeight: 700,
          color: BRAND.teal,
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
        }}
      >
        1
      </div>
      <div
        style={{
          ...text,
          fontSize: 58,
          fontWeight: 600,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 1400,
          lineHeight: 1.1,
        }}
      >
        Escribís el mensaje
        <br />
        una sola vez.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 3: Editor de template crudo ----------

function Scene3TemplateRaw() {
  const f = useCurrentFrame()

  const cardOpacity = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const cardSlide = interpolate(f, [0, 22], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Pulso del chip {nombre}
  const pulse = interpolate(
    f,
    [40, 55, 70, 85, 100],
    [1, 1.08, 1, 1.08, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  )
  const ringOpacity = interpolate(
    f,
    [40, 55, 70, 85, 100],
    [0, 0.7, 0, 0.7, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  )

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
          padding: 48,
          width: 1200,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 8px 26px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Header del editor */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: BRAND.teal,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Editor de template
          </div>
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
            Cumpleaños
          </div>
        </div>

        <div style={{ height: 1, background: BRAND.hairline, opacity: 0.5 }} />

        {/* Contenido con chip {nombre} */}
        <div
          style={{
            fontSize: 38,
            color: BRAND.body,
            lineHeight: 1.45,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            rowGap: 14,
          }}
        >
          <span>{TEMPLATE_TEXT_PRE}</span>
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              transform: `scale(${pulse})`,
              transformOrigin: "center",
              margin: "0 4px",
            }}
          >
            <span
              style={{
                background: BRAND.mint,
                color: BRAND.teal,
                padding: "6px 18px",
                borderRadius: 10,
                fontWeight: 700,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 34,
                border: `2px solid ${BRAND.teal}`,
              }}
            >
              {"{nombre}"}
            </span>
            <span
              style={{
                position: "absolute",
                inset: -10,
                border: `4px solid ${BRAND.teal}`,
                borderRadius: 14,
                opacity: ringOpacity,
              }}
            />
          </span>
          <span>{TEMPLATE_TEXT_POST}</span>
        </div>

        {/* Pie con etiqueta variables */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 8,
          }}
        >
          <div
            style={{
              padding: "8px 16px",
              border: `1px solid ${BRAND.hairline}`,
              borderRadius: 8,
              fontSize: 20,
              color: BRAND.muted,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {"{nombre}"}
          </div>
          <div
            style={{
              padding: "8px 16px",
              border: `1px solid ${BRAND.hairline}`,
              borderRadius: 8,
              fontSize: 20,
              color: BRAND.muted,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {"{apellido}"}
          </div>
          <div
            style={{
              padding: "8px 16px",
              border: `1px solid ${BRAND.hairline}`,
              borderRadius: 8,
              fontSize: 20,
              color: BRAND.muted,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {"{empresa}"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 4: Mensajes renderizados (3 tarjetas) ----------

type RenderedCardData = {
  initials: string
  name: string
  firstName: string
}

function RenderedCard({
  data,
  delay,
}: {
  data: RenderedCardData
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
    config: { damping: 16, stiffness: 80, mass: 0.7 },
  })
  const translateY = (1 - sp) * 60

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "white",
        borderRadius: 18,
        padding: "26px 30px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: 540,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            background: BRAND.mint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 22,
            color: BRAND.teal,
          }}
        >
          {data.initials}
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, color: BRAND.ink }}>
          {data.name}
        </div>
      </div>
      <div
        style={{
          fontSize: 24,
          color: BRAND.body,
          lineHeight: 1.4,
          background: BRAND.mint,
          padding: "16px 20px",
          borderRadius: 14,
          borderTopLeftRadius: 4,
        }}
      >
        {TEMPLATE_TEXT_PRE}
        <span style={{ color: BRAND.teal, fontWeight: 700 }}>
          {data.firstName}
        </span>
        {TEMPLATE_TEXT_POST}
      </div>
    </div>
  )
}

function Scene4Rendered() {
  const f = useCurrentFrame()
  const headerOpacity = interpolate(f, [0, 16], [0, 1], {
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
      <div
        style={{
          opacity: headerOpacity,
          fontSize: 32,
          fontWeight: 600,
          color: BRAND.muted,
          letterSpacing: "0.02em",
        }}
      >
        Mensajes listos para enviar
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        <RenderedCard
          data={{
            initials: "MR",
            name: "María Rodríguez",
            firstName: "María",
          }}
          delay={10}
        />
        <RenderedCard
          data={{
            initials: "CG",
            name: "Carlos González",
            firstName: "Carlos",
          }}
          delay={26}
        />
        <RenderedCard
          data={{
            initials: "SA",
            name: "Sofía Acosta",
            firstName: "Sofía",
          }}
          delay={42}
        />
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 5: 1 plantilla → 1000 mensajes ----------

function Scene5Stat() {
  const f = useCurrentFrame()

  const oneFade = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const arrowFade = interpolate(f, [16, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const arrowSlide = interpolate(f, [16, 36], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const counted = Math.round(
    interpolate(f, [28, 70], [0, 1000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  )
  const counterFade = interpolate(f, [26, 40], [0, 1], {
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
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div
          style={{
            opacity: oneFade,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 200,
              fontWeight: 700,
              color: BRAND.ink,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.04em",
            }}
          >
            1
          </div>
          <div
            style={{
              fontSize: 30,
              color: BRAND.muted,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            plantilla
          </div>
        </div>

        <div
          style={{
            opacity: arrowFade,
            transform: `translateX(${arrowSlide}px)`,
            fontSize: 110,
            color: BRAND.teal,
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          →
        </div>

        <div
          style={{
            opacity: counterFade,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 200,
              fontWeight: 700,
              color: BRAND.teal,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.04em",
            }}
          >
            {counted}
          </div>
          <div
            style={{
              fontSize: 30,
              color: BRAND.muted,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            mensajes únicos
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 6: Cierre ----------

function Scene6Closing() {
  const f = useCurrentFrame()

  const line1 = useFadeSlide(0, 20, 26)
  const line2Op = interpolate(f, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const line2Slide = interpolate(f, [40, 60], [20, 0], {
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
          ...line1,
          fontSize: 64,
          fontWeight: 600,
          color: BRAND.ink,
          letterSpacing: "-0.025em",
          textAlign: "center",
          maxWidth: 1500,
          lineHeight: 1.15,
        }}
      >
        Tu cliente recibe algo
        <br />
        que parece escrito para él.
      </div>
      <div
        style={{
          opacity: line2Op,
          transform: `translateY(${line2Slide}px)`,
          fontSize: 48,
          fontWeight: 700,
          color: BRAND.teal,
          letterSpacing: "-0.02em",
          marginTop: 18,
        }}
      >
        Y en parte, lo es.
      </div>
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

export function TutorialTemplates() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      {/* Escena 1: 0-75 (0-2.5s) */}
      <Sequence from={0} durationInFrames={75}>
        <Scene1Title />
      </Sequence>

      {/* Escena 2: 75-195 (2.5-6.5s) */}
      <Sequence from={75} durationInFrames={120}>
        <Scene2Idea />
      </Sequence>

      {/* Escena 3: 195-315 (6.5-10.5s) */}
      <Sequence from={195} durationInFrames={120}>
        <Scene3TemplateRaw />
      </Sequence>

      {/* Escena 4: 315-450 (10.5-15s) */}
      <Sequence from={315} durationInFrames={135}>
        <Scene4Rendered />
      </Sequence>

      {/* Escena 5: 450-540 (15-18s) */}
      <Sequence from={450} durationInFrames={90}>
        <Scene5Stat />
      </Sequence>

      {/* Escena 6: 540-660 (18-22s) */}
      <Sequence from={540} durationInFrames={120}>
        <Scene6Closing />
      </Sequence>

      {/* Outro: 660-720 (22-24s) */}
      <Sequence from={660} durationInFrames={60}>
        <Outro />
      </Sequence>

      <Audio src={AUDIO_SRC} />
    </AbsoluteFill>
  )
}
