// Verifica el estado del snapshot Remotion: lee el snapshotId del Blob y
// chequea que la entrada en Vercel exista.
//
// Uso: pnpm tsx scripts/check-remotion-snapshot.ts

import dotenv from "dotenv"
import { join } from "path"

dotenv.config({ path: join(process.cwd(), ".env.local") })

async function main() {
  const [{ head }, { Snapshot }, { REMOTION_SNAPSHOT_BLOB_KEY }] =
    await Promise.all([
      import("@vercel/blob"),
      import("@vercel/sandbox"),
      import("../src/lib/remotion/blob-keys"),
    ])

  const blob = await head(REMOTION_SNAPSHOT_BLOB_KEY).catch(() => null)
  if (!blob) {
    console.log("❌ No hay entrada en Blob — corré pnpm remotion:snapshot")
    return
  }

  const cache = (await fetch(blob.url).then((r) => r.json())) as {
    snapshotId: string
    createdAt: string
  }

  console.log(`📦 Blob → snapshotId: ${cache.snapshotId}`)
  console.log(`   creado: ${cache.createdAt}`)

  try {
    const snapshot = await Snapshot.get({ snapshotId: cache.snapshotId })
    console.log(`✅ Snapshot vive en Vercel:`)
    console.log(`   status:    ${snapshot.status}`)
    console.log(`   sizeBytes: ${snapshot.sizeBytes}`)
    console.log(`   expiresAt: ${snapshot.expiresAt ?? "(no expira)"}`)
  } catch (e) {
    console.log(`❌ Snapshot NO existe en Vercel: ${(e as Error).message}`)
    console.log(`   Regeneralo con: pnpm remotion:snapshot`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
