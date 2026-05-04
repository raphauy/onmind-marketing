import { readFile, readdir } from "fs/promises"
import { dirname, join, posix, relative } from "path"
import type { Sandbox } from "@vercel/sandbox"

const REMOTION_SANDBOX_BUNDLE_DIR = "remotion-bundle"

// Reemplazo de `@remotion/vercel#addBundleToSandbox`. Mismo enfoque (walk
// recursivo + writeFiles) pero arregla bugs que afectan a bundles con más de
// un nivel de directorios:
//
//   1. La lista de directorios a crear toma `dirname(file.path)` — no incluye
//      los ancestros (si hay `a/b/c/d.txt` agrega `a/b/c` pero no `a/b` ni `a`).
//      El `sort()` no resuelve eso porque los parents nunca entran al set.
//   2. Usa `sandbox.mkDir()` que no soporta `recursive` ni `if-not-exists`.
//
// Acá usamos `sandbox.fs.mkdir({ recursive: true })` (idempotente y crea
// parents) y agregamos todos los ancestros al set. Cuando @remotion/vercel
// arregle el bug podemos reemplazar este wrapper por su `addBundleToSandbox`.
//
// Ref bug: addBundleToSandbox en @remotion/vercel@4.0.457
//   node_modules/@remotion/vercel/dist/esm/index.mjs (sin issue público al 2026-05-04)
export async function uploadBundleToSandbox({
  sandbox,
  bundleDir,
}: {
  sandbox: Sandbox
  bundleDir: string
}): Promise<void> {
  const fullBundleDir = join(process.cwd(), bundleDir)

  const files: { path: string; content: Buffer }[] = []
  await collectFiles(fullBundleDir, fullBundleDir, files)

  const dirs = collectAncestorDirs(files)

  for (const dir of dirs) {
    await sandbox.fs.mkdir(`${REMOTION_SANDBOX_BUNDLE_DIR}/${dir}`, {
      recursive: true,
    })
  }

  await sandbox.writeFiles(
    files.map((file) => ({
      path: `${REMOTION_SANDBOX_BUNDLE_DIR}/${file.path}`,
      content: file.content,
    }))
  )
}

async function collectFiles(
  baseDir: string,
  currentDir: string,
  out: { path: string; content: Buffer }[]
): Promise<void> {
  const entries = await readdir(currentDir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(currentDir, entry.name)
    if (entry.isDirectory()) {
      await collectFiles(baseDir, fullPath, out)
    } else if (entry.isFile()) {
      const content = await readFile(fullPath)
      // Paths POSIX (forward-slash) para el sandbox Linux remoto.
      const rel = relative(baseDir, fullPath).split(/[\\/]/g).join("/")
      out.push({ path: rel, content })
    }
  }
}

// Para una lista de paths de files, devuelve todos los dirs ancestros únicos
// ordenados de menos profundo a más profundo. Ejemplo:
//   ["a/b/c.txt", "a/d.txt"] → ["a", "a/b"]
function collectAncestorDirs(files: { path: string }[]): string[] {
  const set = new Set<string>()
  for (const file of files) {
    let dir = posix.dirname(file.path)
    while (dir && dir !== "." && dir !== "/") {
      set.add(dir)
      dir = posix.dirname(dir)
    }
  }
  return Array.from(set).sort((a, b) => a.length - b.length)
}

// Re-exportamos `dirname` solo para tests si los hubiera.
export const _internals = { collectAncestorDirs, dirname }
