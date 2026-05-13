import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion"
import { BRAND } from "../lib/colors"

// Prototipo A — Tutorial Dashboard
// Approach: screenshot real del dashboard + Ken Burns + overlays + audio narrado.
// Master 16:9 (1920x1080). 22s totales (19.3s voz + 2.7s outro/tail).
export function TutorialDashboardA() {
  const frame = useCurrentFrame()

  const W = 1920
  const H = 1080

  const IMG_SRC = staticFile(
    "tutorials/2026-05-11-prototipo-dashboard/dashboard-1920.png"
  )
  const AUDIO_SRC = staticFile(
    "tutorials/2026-05-11-prototipo-dashboard/voz.mp3"
  )

  // Timeline (frames @ 30fps):
  // 0-90    (0-3s)   Vista general
  // 90-240  (3-8s)   Zoom métricas (banner superior)
  // 240-360 (8-12s)  Zoom tarjeta de mensaje
  // 360-510 (12-17s) Zoom botón "Procesar"
  // 510-585 (17-19.5s) Vuelta a vista general
  // 585-660 (19.5-22s) Outro
  const focusX = interpolate(
    frame,
    [0, 90, 240, 360, 510, 585],
    [0.5, 0.5, 0.18, 0.85, 0.5, 0.5],
    { extrapolateRight: "clamp" }
  )
  const focusY = interpolate(
    frame,
    [0, 90, 240, 360, 510, 585],
    [0.5, 0.18, 0.5, 0.07, 0.5, 0.5],
    { extrapolateRight: "clamp" }
  )
  const scale = interpolate(
    frame,
    [0, 90, 240, 360, 510, 585],
    [1.0, 1.6, 2.2, 2.0, 1.0, 1.0],
    { extrapolateRight: "clamp" }
  )

  // Centrar el foco: si focus = (0.5,0.5) y scale=1, no hay translate.
  // Fórmula: translate = (0.5 - focus) * dim * scale
  const tx = (0.5 - focusX) * W * scale
  const ty = (0.5 - focusY) * H * scale

  // Caption sincronizada (timing aproximado, refinable con forced alignment)
  const captions = [
    { from: 0, to: 90, text: "Este es el Dashboard de OnMind" },
    {
      from: 90,
      to: 240,
      text: "Mensajes pendientes: hoy, mañana, esta semana y este mes",
    },
    {
      from: 240,
      to: 360,
      text: "Cada mensaje: contacto, contenido y categoría",
    },
    { from: 360, to: 510, text: "Un solo clic, y OnMind los envía por vos" },
    { from: 510, to: 585, text: "Todo tu negocio, en una sola pantalla" },
  ]
  const currentCaption = captions.find((c) => frame >= c.from && frame < c.to)

  // Outro fade
  const outroOpacity = interpolate(
    frame,
    [575, 595],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, overflow: "hidden" }}>
      {/* Imagen base con Ken Burns */}
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={IMG_SRC}
          style={{ width: W, height: H, display: "block" }}
        />
      </AbsoluteFill>

      {/* Caption sincronizada (banda inferior) */}
      {currentCaption && frame < 585 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 60,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "rgba(10,10,10,0.78)",
              color: BRAND.white,
              padding: "18px 32px",
              borderRadius: 14,
              fontFamily: "system-ui, sans-serif",
              fontSize: 38,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              maxWidth: "78%",
              textAlign: "center",
              backdropFilter: "blur(6px)",
            }}
          >
            {currentCaption.text}
          </div>
        </div>
      ) : null}

      {/* Audio */}
      <Audio src={AUDIO_SRC} />

      {/* Outro */}
      <Sequence from={575} durationInFrames={85}>
        <AbsoluteFill
          style={{
            backgroundColor: BRAND.bg,
            opacity: outroOpacity,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
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
              width: 140,
              height: 5,
              background: BRAND.teal,
              borderRadius: 2,
            }}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
