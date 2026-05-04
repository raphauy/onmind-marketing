// Convenciones de paths en Vercel Blob para assets generados por Remotion.
// Usar las mismas keys en ambos flujos (local y sandbox) para consistencia.

export function videoBlobPath(pieceSlug: string, version: string): string {
  return `videos/${pieceSlug}-${version}.mp4`
}

export function thumbnailBlobPath(pieceSlug: string, version: string): string {
  return `thumbnails/${pieceSlug}-${version}.jpg`
}

// Snapshot del sandbox Remotion. Clave fija (no por deployment) — lo regeneramos
// manualmente cuando cambian los templates o sus deps.
export const REMOTION_SNAPSHOT_BLOB_KEY = "snapshot-cache/remotion.json"
