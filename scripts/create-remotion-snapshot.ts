// Crea un snapshot del Vercel Sandbox con Chromium + FFmpeg + bundle Remotion
// preinstalados. El runtime de producción (renderTemplateOnVercel) arranca
// desde este snapshot en ~1-2s en lugar de los ~60-90s que tarda crear uno limpio.
//
// Cuándo correrlo:
//   - Una vez al inicio (setup).
//   - Cada vez que cambien archivos en src/remotion/* (templates, fonts, assets).
//   - Cuando se actualice la versión de @remotion/* (bundle puede no ser compatible).
//
// Requiere variables de entorno:
//   - BLOB_READ_WRITE_TOKEN  (para persistir el snapshotId en Vercel Blob)
//   - VERCEL_OIDC_TOKEN      (para crear el sandbox; pull con `vercel env pull`)
//   - alternativamente VERCEL_TOKEN + VERCEL_TEAM_ID + VERCEL_PROJECT_ID
//
// Uso: pnpm tsx scripts/create-remotion-snapshot.ts

import dotenv from "dotenv"
import { join } from "path"
import { rm } from "fs/promises"

dotenv.config({ path: join(process.cwd(), ".env.local") })

async function main() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    console.error(
      "❌ BLOB_READ_WRITE_TOKEN no configurada. Agregalo a .env.local."
    )
    process.exit(1)
  }

  // Imports después de cargar env (algunos paquetes leen vars en import time).
  const [
    { bundle },
    { createSandbox },
    { persistRemotionSnapshot },
    { ensurePublicRemotionDir },
    { uploadBundleToSandbox },
  ] = await Promise.all([
    import("@remotion/bundler"),
    import("@remotion/vercel"),
    import("../src/lib/remotion/snapshot"),
    import("../src/lib/remotion/sync-public"),
    import("../src/lib/remotion/upload-bundle"),
  ])

  // addBundleToSandbox prepende process.cwd() — usar paths relativos para
  // evitar duplicación.
  const bundleDir = ".remotion-snapshot-bundle"
  const bundleAbsPath = join(process.cwd(), bundleDir)

  // Limpiar bundle previo para evitar EEXIST cuando bundle hace symlinks.
  await rm(bundleAbsPath, { recursive: true, force: true }).catch(() => {})

  console.log("🔄 Sincronizando public-remotion/ con assets actuales…")
  const publicDir = await ensurePublicRemotionDir()

  console.log("🛠  Bundling Remotion (webpack)…")
  // publicDir: usamos public-remotion (solo fonts/ + brand/, archivos reales)
  // en vez del public/ entero del Next.js — bundle más chico y se evitan
  // dos bugs de @remotion/vercel: sub-dirs profundos y symlinks-a-directorio.
  await bundle({
    entryPoint: join(process.cwd(), "src/remotion/index.ts"),
    outDir: bundleAbsPath,
    publicDir,
  })

  console.log("\n☁️  Creando sandbox e instalando deps (~60-90s)…")
  const sandbox = await createSandbox({
    onProgress: ({ progress, message }) => {
      const pct = Math.round(progress * 100)
      console.log(`   ${message} (${pct}%)`)
    },
  })

  console.log("\n📦 Subiendo bundle al sandbox…")
  // Reemplazo de addBundleToSandbox (@remotion/vercel) que tiene bugs con
  // dirs anidados. Ver src/lib/remotion/upload-bundle.ts.
  await uploadBundleToSandbox({ sandbox, bundleDir })

  console.log("\n📸 Tomando snapshot (el sandbox se apaga automáticamente)…")
  const snapshot = await sandbox.snapshot({ expiration: 0 })

  console.log("\n💾 Persistiendo snapshotId en Vercel Blob…")
  const blobUrl = await persistRemotionSnapshot(snapshot.snapshotId)

  console.log("\n🧹 Limpiando bundle local…")
  await rm(join(process.cwd(), bundleDir), {
    recursive: true,
    force: true,
  }).catch(() => {})

  console.log(`\n✅ Snapshot creado.`)
  console.log(`   snapshotId: ${snapshot.snapshotId}`)
  console.log(`   blob:       ${blobUrl}`)
}

main().catch((e) => {
  console.error("\n❌ Error creando snapshot:")
  console.error(e)
  process.exit(1)
})
