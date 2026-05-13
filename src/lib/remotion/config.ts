// Configuración compartida del motor Remotion. Importable tanto desde
// componentes Remotion (Root.tsx) como desde el server bundle (services).
// No usar JSX/React acá — solo constantes para que pueda importarse en
// cualquier contexto.

// Frame rate único usado por todos los Composition de OnMind. Si cambia,
// cambia la duración real de los videos y las animaciones que dependen
// de `fps` en useCurrentFrame.
export const REMOTION_FPS = 30

// Frame del thumbnail relativo al total: 80% capta el estado final
// (después de la animación, durante el "hold"). Coincide entre flujos
// local y Vercel.
export const THUMBNAIL_FRAME_RATIO = 0.8

// Duración por slug de template, en segundos. La fuente de verdad: si
// cambia acá, también hay que actualizar `durationSec` en seed-templates.mjs
// y regenerar el snapshot.
//
// Mantener en sync con: scripts/seed-templates.mjs (durationSec del template)
// y src/remotion/Root.tsx (durationInFrames del Composition).
export const TEMPLATE_DURATION_SECONDS: Record<string, number> = {
  "frase-animada": 10,
  "chat-animado": 17,
  "tutorial-dashboard-a": 22,
  "tutorial-dashboard-b": 22,
  "tutorial-templates": 24,
  "tutorial-templates-9x16": 24,
  "tutorial-contactos": 72,
  "tutorial-contactos-9x16": 72,
  // Thumbnail estático YT: 1 frame, duración nominal 1s para que Remotion acepte.
  "tutorial-thumbnail-yt": 1,
}

export function templateDurationInFrames(slug: string): number {
  const seconds = TEMPLATE_DURATION_SECONDS[slug]
  if (!seconds) {
    throw new Error(
      `Template "${slug}" no tiene duración registrada en TEMPLATE_DURATION_SECONDS`
    )
  }
  return seconds * REMOTION_FPS
}
