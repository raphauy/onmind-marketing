import { head, put } from "@vercel/blob"
import { Sandbox } from "@vercel/sandbox"
import { REMOTION_SNAPSHOT_BLOB_KEY } from "./blob-keys"

const SANDBOX_RESTORE_TIMEOUT_MS = 5 * 60 * 1000

type SnapshotCache = { snapshotId: string; createdAt: string }

// Lee el snapshotId del Blob y crea un sandbox a partir de él (~1-2s arrancando).
// Si no hay snapshot guardado, lanza error con instrucciones de cómo crearlo.
export async function restoreRemotionSandbox(): Promise<Sandbox> {
  const blob = await head(REMOTION_SNAPSHOT_BLOB_KEY).catch(() => null)
  if (!blob) {
    throw new Error(
      `No hay snapshot Remotion en Blob. Creá uno con: pnpm remotion:snapshot`
    )
  }

  const response = await fetch(blob.url)
  if (!response.ok) {
    throw new Error(
      `No pude leer el snapshot Remotion en Blob (HTTP ${response.status}). ` +
        `Regeneralo con: pnpm remotion:snapshot`
    )
  }
  const cache = (await response.json()) as SnapshotCache

  if (!cache?.snapshotId) {
    throw new Error(
      `Snapshot Remotion sin snapshotId. Regeneralo con: pnpm remotion:snapshot`
    )
  }

  return Sandbox.create({
    source: { type: "snapshot", snapshotId: cache.snapshotId },
    timeout: SANDBOX_RESTORE_TIMEOUT_MS,
  })
}

// Persiste el snapshotId en Blob bajo una clave fija. Sobrescribe el anterior.
export async function persistRemotionSnapshot(snapshotId: string): Promise<string> {
  const cache: SnapshotCache = {
    snapshotId,
    createdAt: new Date().toISOString(),
  }

  const { url } = await put(
    REMOTION_SNAPSHOT_BLOB_KEY,
    JSON.stringify(cache),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    }
  )

  return url
}
