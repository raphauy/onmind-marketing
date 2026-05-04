import {
  renderMediaOnVercel,
  renderStillOnVercel,
  uploadToVercelBlob,
} from "@remotion/vercel"
import { restoreRemotionSandbox } from "./snapshot"
import { thumbnailBlobPath, videoBlobPath } from "./blob-keys"
import { THUMBNAIL_FRAME_RATIO } from "./config"

export type RenderOnVercelOptions = {
  pieceSlug: string
  version: string
  // Frame total (durationInFrames) — necesario porque el thumbnail va al 80%.
  durationInFrames: number
}

export type RenderOnVercelResult = {
  videoUrl: string
  thumbnailUrl: string
  videoSize: number
  thumbnailSize: number
}

// Flujo de render en producción: arranca un sandbox desde el snapshot precocido,
// renderiza video + thumbnail, sube ambos a Blob, apaga el sandbox.
export async function renderTemplateOnVercel(
  compositionId: string,
  inputProps: Record<string, unknown>,
  options: RenderOnVercelOptions
): Promise<RenderOnVercelResult> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    throw new Error("BLOB_READ_WRITE_TOKEN no configurada")
  }

  const sandbox = await restoreRemotionSandbox()

  try {
    // Render video MP4
    const video = await renderMediaOnVercel({
      sandbox,
      compositionId,
      inputProps,
      codec: "h264",
      pixelFormat: "yuv420p",
    })

    // Render thumbnail JPG
    const thumbnailFrame = Math.floor(
      options.durationInFrames * THUMBNAIL_FRAME_RATIO
    )
    const thumbnail = await renderStillOnVercel({
      sandbox,
      compositionId,
      inputProps,
      frame: thumbnailFrame,
      imageFormat: "jpeg",
      jpegQuality: 90,
    })

    // Upload paralelo a Blob desde el mismo sandbox
    const [videoUpload, thumbnailUpload] = await Promise.all([
      uploadToVercelBlob({
        sandbox,
        sandboxFilePath: video.sandboxFilePath,
        blobPath: videoBlobPath(options.pieceSlug, options.version),
        contentType: video.contentType,
        blobToken,
        access: "public",
      }),
      uploadToVercelBlob({
        sandbox,
        sandboxFilePath: thumbnail.sandboxFilePath,
        blobPath: thumbnailBlobPath(options.pieceSlug, options.version),
        contentType: thumbnail.contentType,
        blobToken,
        access: "public",
      }),
    ])

    return {
      videoUrl: videoUpload.url,
      thumbnailUrl: thumbnailUpload.url,
      videoSize: videoUpload.size,
      thumbnailSize: thumbnailUpload.size,
    }
  } finally {
    await sandbox.stop().catch(() => {})
  }
}
