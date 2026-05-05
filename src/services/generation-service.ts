import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { addLogoOverlay } from "@/lib/logo-overlay"
import { getSatoriRenderer } from "@/lib/renderers"
import { renderRemotionTemplate } from "@/lib/remotion/render"
import { REMOTION_FPS } from "@/lib/remotion/config"
import type { Template } from "@prisma/client"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

function buildPrompt(
  template: Template,
  fieldValues: Record<string, string>
): string {
  if (!template.promptTemplate) {
    throw new Error(
      `Template "${template.slug}" tiene renderer=LLM pero promptTemplate es null`
    )
  }

  let prompt = template.promptTemplate
  for (const [key, value] of Object.entries(fieldValues)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value)
  }

  const remaining = prompt.match(/\{\{(\w+)\}\}/g)
  if (remaining) {
    throw new Error(`Placeholders sin valor: ${remaining.join(", ")}`)
  }

  return prompt
}

async function callOpenRouter(
  prompt: string,
  model: string
): Promise<{ data: Record<string, unknown>; durationMs: number }> {
  const apiKey = process.env.OPEN_ROUTER_API_KEY
  if (!apiKey) throw new Error("OPEN_ROUTER_API_KEY no configurada")

  const startTime = Date.now()

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://onmindcrm.com",
      "X-Title": "OnMind Marketing",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenRouter HTTP ${response.status}: ${text}`)
  }

  const data = await response.json()
  return { data, durationMs: Date.now() - startTime }
}

function extractImageBuffer(
  data: Record<string, unknown>
): Buffer | null {
  const choices = data.choices as Array<{
    message: {
      content?: Array<{ type: string; image_url?: { url: string } }>
      images?: Array<{ image_url?: { url: string }; url?: string }>
    }
  }>

  const message = choices?.[0]?.message
  if (!message) return null

  // content array (multimodal)
  if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "image_url" && part.image_url?.url) {
        const match = part.image_url.url.match(
          /^data:image\/\w+;base64,(.+)$/
        )
        if (match) return Buffer.from(match[1], "base64")
      }
    }
  }

  // images array (Gemini via OpenRouter)
  if (Array.isArray(message.images)) {
    for (const img of message.images) {
      const url = img.image_url?.url || img.url
      if (url) {
        const match = url.match(/^data:image\/\w+;base64,(.+)$/)
        if (match) return Buffer.from(match[1], "base64")
      }
    }
  }

  return null
}

export async function generatePieceImage(
  pieceId: string
): Promise<{ imageUrl: string; videoUrl?: string }> {
  const piece = await prisma.piece.findUniqueOrThrow({
    where: { id: pieceId },
    include: { template: true },
  })

  // Mark as generating
  await prisma.piece.update({
    where: { id: pieceId },
    data: { status: "GENERATING" },
  })

  try {
    const { template } = piece
    const fieldValues = piece.fieldValues as Record<string, string>
    const version = Date.now().toString(36)

    let prompt = ""
    let modelUsed = ""
    let durationMs = 0
    let imageUrl = ""
    let videoUrl: string | undefined

    if (template.renderer === "HYPERFRAMES") {
      // Piezas HYPERFRAMES son bespoke: el video se rendereó offline con
      // ElevenLabs + HyperFrames y se registró en DB con status GENERATED.
      // No hay regeneración desde la UI (template.isRegeneratable=false esconde
      // el botón). Si igual se invoca la action, fallar con mensaje claro.
      throw new Error(
        "Las piezas HYPERFRAMES no se regeneran desde la UI. Crear una pieza nueva con el skill crear-video-narrado."
      )
    }

    if (template.renderer === "REMOTION") {
      // Render programático de video MP4. El logo overlay ya está embebido
      // en la composition (no se aplica sharp post-procesado).
      // En producción Vercel corre en Sandbox; en local in-process. Ver
      // src/lib/remotion/render.ts para la lógica de dispatch.
      if (!template.durationSec) {
        throw new Error(
          `Template "${template.slug}" tiene renderer=REMOTION pero durationSec es null`
        )
      }
      modelUsed = `remotion:${template.slug}`
      prompt = `[remotion:${template.slug}] ${JSON.stringify(fieldValues)}`
      const result = await renderRemotionTemplate(template.slug, fieldValues, {
        pieceSlug: piece.slug,
        version,
        durationInFrames: template.durationSec * REMOTION_FPS,
      })
      durationMs = result.durationMs
      videoUrl = result.videoUrl
      // imageUrl apunta al thumbnail para que dashboards y previews que esperan
      // imagen sigan funcionando sin cambios.
      imageUrl = result.thumbnailUrl
    } else {
      let imageBuffer: Buffer | null = null

      if (template.renderer === "SATORI") {
        // Render programático: JSX -> SVG -> PNG. Sin LLM, sin costo, determinista.
        const renderer = getSatoriRenderer(template.slug)
        const startTime = Date.now()
        imageBuffer = await renderer(fieldValues)
        durationMs = Date.now() - startTime
        prompt = `[satori:${template.slug}] ${JSON.stringify(fieldValues)}`
        modelUsed = `satori:${template.slug}`
      } else {
        // Render LLM: prompt + modelo vía OpenRouter.
        if (!template.model) {
          throw new Error(
            `Template "${template.slug}" tiene renderer=LLM pero model es null`
          )
        }
        prompt = buildPrompt(template, fieldValues)
        modelUsed = template.model
        const result = await callOpenRouter(prompt, template.model)
        durationMs = result.durationMs
        imageBuffer = extractImageBuffer(result.data)
        if (!imageBuffer) {
          throw new Error("No se obtuvo imagen del modelo")
        }
      }

      // Add logo overlay + resize al aspect ratio del template
      const finalImage = await addLogoOverlay(
        imageBuffer,
        template.darkOverlay,
        template.aspectRatio
      )

      const upload = await put(
        `piezas/${piece.slug}-${version}.png`,
        finalImage,
        { access: "public", contentType: "image/png", addRandomSuffix: false }
      )
      imageUrl = upload.url
    }

    // Desactivar generaciones anteriores
    await prisma.generation.updateMany({
      where: { pieceId, isActive: true },
      data: { isActive: false },
    })

    // Programáticos (SATORI, REMOTION) son siempre gratuitos.
    const costUsd =
      template.renderer === "SATORI" || template.renderer === "REMOTION"
        ? 0
        : template.costPerImage

    await prisma.generation.create({
      data: {
        pieceId,
        imageUrl,
        videoUrl,
        prompt,
        model: modelUsed,
        costUsd,
        durationMs,
        isActive: true,
      },
    })

    await prisma.piece.update({
      where: { id: pieceId },
      data: {
        status: "GENERATED",
        imageUrl,
        videoUrl,
        thumbnailUrl: videoUrl ? imageUrl : null,
        costUsd: { increment: costUsd },
      },
    })

    return videoUrl ? { imageUrl, videoUrl } : { imageUrl }
  } catch (error) {
    await prisma.piece.update({
      where: { id: pieceId },
      data: { status: "FAILED" },
    })
    throw error
  }
}
