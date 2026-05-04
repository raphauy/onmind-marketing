import { cp, rm } from "fs/promises"
import { join } from "path"

// Sub-directorios de public/ que los templates Remotion usan vía staticFile().
// Mantener en sync con lo que importan src/remotion/lib/fonts.ts y
// src/remotion/components/LogoOverlay.tsx.
const SUBDIRS = ["fonts", "brand"]

// Sincroniza public-remotion/ con los sub-dirs necesarios de public/.
// Se usa como publicDir del bundle Remotion — evita copiar todo public/ (que
// incluye assets pesados de IG migrados) y evita un bug de @remotion/vercel
// con sub-dirs profundos y con symlinks.
//
// Es idempotente: borra y regenera cada llamada con archivos reales (no symlinks).
export async function ensurePublicRemotionDir(cwd: string = process.cwd()): Promise<string> {
  const dest = join(cwd, "public-remotion")
  await rm(dest, { recursive: true, force: true })

  for (const subdir of SUBDIRS) {
    const src = join(cwd, "public", subdir)
    const dst = join(dest, subdir)
    // dereference: true → resuelve symlinks y copia archivos reales.
    // recursive: true → copia el árbol completo.
    await cp(src, dst, { recursive: true, dereference: true })
  }

  return dest
}
