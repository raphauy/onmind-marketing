import { AbsoluteFill, Img, staticFile } from "remotion"
import { z } from "zod"
import { BRAND } from "../lib/colors"

// Thumbnail paramétrico para YouTube (1280x720, 1 frame).
// Recibe vía props el título, sección y un path opcional a una imagen de fondo
// (frame extraído del master 16:9 del tutorial). Si no hay bgImage, usa el fondo
// de marca puro.

export const tutorialThumbnailYTSchema = z.object({
  title: z.string(),
  feature: z.string(),
  bgImage: z.string().nullable().optional(),
})

export type TutorialThumbnailYTProps = z.infer<typeof tutorialThumbnailYTSchema>

export const TutorialThumbnailYTDefaults: TutorialThumbnailYTProps = {
  title: "Templates",
  feature: "TUTORIAL",
  bgImage: null,
}

export function TutorialThumbnailYT({
  title,
  feature,
  bgImage,
}: TutorialThumbnailYTProps) {
  return (
    <AbsoluteFill style={{ background: BRAND.bg, fontFamily: "system-ui, sans-serif" }}>
      {/* Background image (frame del video) — atenuada */}
      {bgImage && (
        <AbsoluteFill>
          <Img
            src={staticFile(bgImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.55) blur(2px)",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Tinte teal opaco — predomina sobre el frame, lo deja como textura */}
      {bgImage && (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(105deg, rgba(0,72,56,0.92) 0%, rgba(0,96,75,0.82) 50%, rgba(0,120,95,0.68) 100%)",
          }}
        />
      )}

      {/*
        Contenido principal: TODO dentro de la "safe zone" para sobrevivir a los
        overlays del reproductor embebido de YouTube en sitios de terceros:
          • Top ~100px: header del player con título y canal
          • Bottom-right ~250x70: botón "Mirar en YouTube"
          • Bottom-left ~60x60: ícono de compartir/link
        Por eso usamos padding vertical generoso (110/110) y NO ponemos branding
        en las esquinas inferiores.
      */}
      <AbsoluteFill
        style={{
          padding: "110px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        {/* Eyebrow: TUTORIAL ONMIND */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 8,
              height: 36,
              background: bgImage ? "white" : BRAND.teal,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: bgImage ? "white" : BRAND.teal,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
            }}
          >
            {feature}
          </div>
        </div>

        {/* Título grande */}
        <div
          style={{
            fontSize: 140,
            fontWeight: 700,
            color: bgImage ? "white" : BRAND.ink,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            textShadow: bgImage ? "0 4px 18px rgba(0,0,0,0.35)" : "none",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* Barra accent + handle (debajo del título, dentro de la safe zone) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            marginTop: 6,
          }}
        >
          <div
            style={{
              width: 140,
              height: 6,
              background: bgImage ? "white" : BRAND.teal,
              borderRadius: 3,
            }}
          />
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: bgImage ? "white" : BRAND.ink,
              letterSpacing: "-0.02em",
              textShadow: bgImage ? "0 2px 8px rgba(0,0,0,0.35)" : "none",
            }}
          >
            @OnMindApp
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
