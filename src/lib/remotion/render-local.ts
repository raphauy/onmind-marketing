import { bundle } from "@remotion/bundler"
import {
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer"
import { put } from "@vercel/blob"
import { mkdtemp, readFile, rm } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { thumbnailBlobPath, videoBlobPath } from "./blob-keys"
import { THUMBNAIL_FRAME_RATIO } from "./config"
import { ensurePublicRemotionDir } from "./sync-public"

// Cache del bundle webpack en memoria de proceso (~20s primera vez, ~0 las siguientes).
// En tsx scripts se mantiene vivo durante toda la ejecución; en Next.js dev queda
// en cache mientras el módulo no se recompile.
let bundlePromise: Promise<string> | null = null

function getBundle(): Promise<string> {
  if (!bundlePromise) {
    bundlePromise = (async () => {
      const publicDir = await ensurePublicRemotionDir()
      return bundle({
        entryPoint: join(process.cwd(), "src/remotion/index.ts"),
        publicDir,
      })
    })()
  }
  return bundlePromise
}

export type RenderLocalOptions = {
  pieceSlug: string
  version: string
}

export type RenderLocalResult = {
  videoUrl: string
  thumbnailUrl: string
  durationMs: number
}

// Flujo de render local (dev / scripts): bundle in-process, render con
// @remotion/renderer (necesita Chromium descargado), upload a Vercel Blob.
export async function renderTemplateLocal(
  compositionId: string,
  inputProps: Record<string, unknown>,
  options: RenderLocalOptions
): Promise<RenderLocalResult> {
  const startTime = Date.now()
  const serveUrl = await getBundle()

  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps,
  })

  const tmp = await mkdtemp(join(tmpdir(), "onmind-remotion-"))
  const videoPath = join(tmp, "video.mp4")
  const thumbnailPath = join(tmp, "thumb.jpg")

  try {
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      pixelFormat: "yuv420p",
      outputLocation: videoPath,
      inputProps,
    })

    const thumbnailFrame = Math.floor(
      composition.durationInFrames * THUMBNAIL_FRAME_RATIO
    )
    await renderStill({
      composition,
      serveUrl,
      frame: thumbnailFrame,
      output: thumbnailPath,
      imageFormat: "jpeg",
      inputProps,
    })

    const [videoBuffer, thumbnailBuffer] = await Promise.all([
      readFile(videoPath),
      readFile(thumbnailPath),
    ])

    const [videoUpload, thumbnailUpload] = await Promise.all([
      put(
        videoBlobPath(options.pieceSlug, options.version),
        videoBuffer,
        {
          access: "public",
          contentType: "video/mp4",
          addRandomSuffix: false,
          allowOverwrite: true,
        }
      ),
      put(
        thumbnailBlobPath(options.pieceSlug, options.version),
        thumbnailBuffer,
        {
          access: "public",
          contentType: "image/jpeg",
          addRandomSuffix: false,
          allowOverwrite: true,
        }
      ),
    ])

    return {
      videoUrl: videoUpload.url,
      thumbnailUrl: thumbnailUpload.url,
      durationMs: Date.now() - startTime,
    }
  } finally {
    await rm(tmp, { recursive: true, force: true }).catch(() => {})
  }
}
