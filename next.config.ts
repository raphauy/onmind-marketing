import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["dev.onmindcrm.com"],
  devIndicators: false,
  serverExternalPackages: [
    "@resvg/resvg-js",
    "sharp",
    "satori",
    // Remotion: bundler/renderer/vercel y deps nativas (esbuild, chromium-shell).
    // Marcarlos como external evita que Turbopack intente parsear binarios y READMEs
    // del workspace de @esbuild.
    "@remotion/bundler",
    "@remotion/renderer",
    "@remotion/vercel",
    "@remotion/cli",
    "remotion",
    "esbuild",
    "@vercel/sandbox",
    // Compositor binaries de Remotion: optionalDependencies por arquitectura.
    // Solo se instala el de la plataforma actual; @remotion/renderer hace
    // `require("@remotion/compositor-...")` dentro de un switch por OS/arch.
    // Marcarlos external evita que Turbopack falle con "Module not found"
    // al escanear estáticamente las ramas de otras arquitecturas.
    "@remotion/compositor-linux-x64-gnu",
    "@remotion/compositor-linux-x64-musl",
    "@remotion/compositor-linux-arm64-gnu",
    "@remotion/compositor-linux-arm64-musl",
    "@remotion/compositor-darwin-x64",
    "@remotion/compositor-darwin-arm64",
    "@remotion/compositor-win32-x64-msvc",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
    ],
  },
};

export default nextConfig;
