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

// Tutorial Templates — versión 9:16 (Reel/Stories)
// Master 1080x1920. 24s totales. Mismo audio y guion que tutorial-templates,
// layout reorganizado para vertical: tarjetas apiladas, stat 1→1000 en columna.

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
        gap: 20,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          ...titleStyle,
          fontSize: 170,
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
          fontSize: 42,
          color: BRAND.muted,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        Una plantilla,
        <br />
        mensajes únicos.
      </div>
    </AbsoluteFill>
  )
}

// ---------- Escena 2: Idea ----------

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
        gap: 32,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: oneSpring,
          transform: `scale(${oneScale})`,
          fontSize: 420,
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
          fontSize: 72,
          fontWeight: 600,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 960,
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

// ---------- Escena 3: Editor de template ----------

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
          borderRadius: 28,
          padding: 44,
          width: 860,
          border: `1px solid ${BRAND.hairline}`,
          boxShadow: "0 8px 26px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
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
              fontSize: 24,
            }}
          >
            Cumpleaños
          </div>
        </div>

        <div style={{ height: 1, background: BRAND.hairline, opacity: 0.5 }} />

        <div
          style={{
            fontSize: 38,
            color: BRAND.body,
            lineHeight: 1.45,
          }}
        >
          ¡Feliz cumpleaños,{" "}
          <span style={{ whiteSpace: "nowrap" }}>
            <span
              style={{
                position: "relative",
                display: "inline-block",
                transform: `scale(${pulse})`,
                transformOrigin: "center",
                verticalAlign: "baseline",
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
            !
          </span>{" "}
          Que tengas un día hermoso rodeado de los tuyos. Un abrazo grande.
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <div
            style={{
              padding: "10px 18px",
              border: `1px solid ${BRAND.hairline}`,
              borderRadius: 10,
              fontSize: 24,
              color: BRAND.muted,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {"{nombre}"}
          </div>
          <div
            style={{
              padding: "10px 18px",
              border: `1px solid ${BRAND.hairline}`,
              borderRadius: 10,
              fontSize: 24,
              color: BRAND.muted,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {"{apellido}"}
          </div>
          <div
            style={{
              padding: "10px 18px",
              border: `1px solid ${BRAND.hairline}`,
              borderRadius: 10,
              fontSize: 24,
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

// ---------- Escena 4: Mensajes renderizados (apilados) ----------

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
  const translateY = (1 - sp) * 50

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: "white",
        borderRadius: 22,
        padding: "26px 30px",
        border: `1px solid ${BRAND.hairline}`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: 860,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: BRAND.mint,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 26,
            color: BRAND.teal,
          }}
        >
          {data.initials}
        </div>
        <div style={{ fontSize: 32, fontWeight: 600, color: BRAND.ink }}>
          {data.name}
        </div>
      </div>
      <div
        style={{
          fontSize: 28,
          color: BRAND.body,
          lineHeight: 1.4,
          background: BRAND.mint,
          padding: "18px 22px",
          borderRadius: 16,
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
        gap: 28,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          opacity: headerOpacity,
          fontSize: 36,
          fontWeight: 600,
          color: BRAND.muted,
          letterSpacing: "0.02em",
          marginBottom: 8,
        }}
      >
        Mensajes listos para enviar
      </div>
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
    </AbsoluteFill>
  )
}

// ---------- Escena 5: 1 plantilla → 1000 mensajes (vertical) ----------

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
  const arrowSlide = interpolate(f, [16, 36], [-30, 0], {
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
        flexDirection: "column",
        gap: 24,
        fontFamily: "system-ui, sans-serif",
      }}
    >
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
            fontSize: 280,
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
            fontSize: 36,
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
          transform: `translateY(${arrowSlide}px)`,
          fontSize: 140,
          color: BRAND.teal,
          fontWeight: 300,
          lineHeight: 1,
        }}
      >
        ↓
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
            fontSize: 280,
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
            fontSize: 36,
            color: BRAND.muted,
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          mensajes únicos
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
        gap: 28,
        fontFamily: "system-ui, sans-serif",
        padding: "0 60px",
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
        Tu cliente recibe algo
        <br />
        que parece escrito
        <br />
        para él.
      </div>
      <div
        style={{
          opacity: line2Op,
          transform: `translateY(${line2Slide}px)`,
          fontSize: 56,
          fontWeight: 700,
          color: BRAND.teal,
          letterSpacing: "-0.02em",
          marginTop: 20,
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
        gap: 26,
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

export function TutorialTemplates9x16() {
  return (
    <AbsoluteFill style={{ background: BRAND.bg }}>
      <Sequence from={0} durationInFrames={75}>
        <Scene1Title />
      </Sequence>
      <Sequence from={75} durationInFrames={120}>
        <Scene2Idea />
      </Sequence>
      <Sequence from={195} durationInFrames={120}>
        <Scene3TemplateRaw />
      </Sequence>
      <Sequence from={315} durationInFrames={135}>
        <Scene4Rendered />
      </Sequence>
      <Sequence from={450} durationInFrames={90}>
        <Scene5Stat />
      </Sequence>
      <Sequence from={540} durationInFrames={120}>
        <Scene6Closing />
      </Sequence>
      <Sequence from={660} durationInFrames={60}>
        <Outro />
      </Sequence>
      <Audio src={AUDIO_SRC} />
    </AbsoluteFill>
  )
}
