import { Img, staticFile, useCurrentFrame, interpolate } from "remotion"
import { BRAND } from "../lib/colors"

type Props = {
  dark?: boolean
  // Frame en el que aparece (fade in). Default 0 = visible desde el principio.
  appearAt?: number
}

// Pill con isotipo + "OnMind" + "@OnMindApp" anclado al bottom.
// Equivalente al overlay de imágenes estáticas (src/lib/logo-overlay.ts).
export function LogoOverlay({ dark = false, appearAt = 0 }: Props) {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const textColor = dark ? "#FFFFFF" : BRAND.ink
  const mutedColor = dark ? "#CCCCCC" : BRAND.muted
  const pillBg = dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.95)"
  const isotipo = dark
    ? staticFile("/brand/isotipo-OnMind-blanco.png")
    : staticFile("/brand/isotipo-OnMind-transparente.png")

  return (
    <div
      style={{
        position: "absolute",
        bottom: 36,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          backgroundColor: pillBg,
          borderRadius: 36,
          padding: "14px 28px",
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Img
            src={isotipo}
            style={{ width: 36, height: 36, borderRadius: "50%" }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: 26,
              color: textColor,
              letterSpacing: "-0.01em",
            }}
          >
            OnMind
          </span>
        </div>
        <span
          style={{
            fontWeight: 500,
            fontSize: 22,
            color: mutedColor,
          }}
        >
          @OnMindApp
        </span>
      </div>
    </div>
  )
}
