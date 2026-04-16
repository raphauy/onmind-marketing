import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import type { Template } from "@prisma/client"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

function buildPrompt(
  template: Template,
  fieldValues: Record<string, string>
): string {
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
): Promise<{ imageUrl: string }> {
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

    // Build prompt
    const prompt = buildPrompt(template, fieldValues)

    // Call OpenRouter
    const { data, durationMs } = await callOpenRouter(prompt, template.model)

    // Extract image
    const imageBuffer = extractImageBuffer(data)
    if (!imageBuffer) {
      throw new Error("No se obtuvo imagen del modelo")
    }

    // Upload to Vercel Blob (con timestamp para no pisar versiones anteriores)
    const version = Date.now().toString(36)
    const { url: imageUrl } = await put(
      `piezas/${piece.slug}-${version}.png`,
      imageBuffer,
      { access: "public", contentType: "image/png", addRandomSuffix: false }
    )

    // Desactivar generaciones anteriores
    await prisma.generation.updateMany({
      where: { pieceId, isActive: true },
      data: { isActive: false },
    })

    // Crear registro de generación
    await prisma.generation.create({
      data: {
        pieceId,
        imageUrl,
        prompt,
        model: template.model,
        costUsd: template.costPerImage,
        durationMs,
        isActive: true,
      },
    })

    // Actualizar piece: imagen activa y costo acumulado
    await prisma.piece.update({
      where: { id: pieceId },
      data: {
        status: "GENERATED",
        imageUrl,
        costUsd: { increment: template.costPerImage },
      },
    })

    return { imageUrl }
  } catch (error) {
    await prisma.piece.update({
      where: { id: pieceId },
      data: { status: "FAILED" },
    })
    throw error
  }
}
