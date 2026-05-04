export type RenderResult = {
  videoUrl: string
  thumbnailUrl: string
  durationMs: number
}

export type RenderOptions = {
  pieceSlug: string
  version: string
  // Total de frames del Composition. Se usa para calcular el frame del thumbnail.
  durationInFrames: number
}

// Dispatcher: en Vercel (production / preview) usa Sandbox vía snapshot.
// En local (dev, scripts) corre el render in-process con Chromium del sistema.
//
// Ambos flujos suben los assets a Vercel Blob y devuelven URLs públicas.
//
// Lazy imports: @remotion/vercel es ESM-only y rompe en CJS scripts cuando se
// resuelve al cargar; @remotion/bundler tarda en cold-start. Cargamos solo el
// módulo del flujo activo.
export async function renderRemotionTemplate(
  compositionId: string,
  inputProps: Record<string, unknown>,
  options: RenderOptions
): Promise<RenderResult> {
  if (process.env.VERCEL === "1") {
    const { renderTemplateOnVercel } = await import("./render-on-vercel")
    const startTime = Date.now()
    const result = await renderTemplateOnVercel(compositionId, inputProps, {
      pieceSlug: options.pieceSlug,
      version: options.version,
      durationInFrames: options.durationInFrames,
    })
    return {
      videoUrl: result.videoUrl,
      thumbnailUrl: result.thumbnailUrl,
      durationMs: Date.now() - startTime,
    }
  }

  const { renderTemplateLocal } = await import("./render-local")
  return renderTemplateLocal(compositionId, inputProps, {
    pieceSlug: options.pieceSlug,
    version: options.version,
  })
}
