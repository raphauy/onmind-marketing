import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Proxy público de la imagen de una Piece. Existe porque Instagram Graph API
// rechaza fetchear directamente desde *.public.blob.vercel-storage.com (error
// 9004 / 2207052), aunque la URL sea accesible para todo el resto del mundo.
// Servimos los bytes desde nuestro propio dominio y Meta los baja sin drama.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const piece = await prisma.piece.findUnique({
    where: { slug },
    select: { imageUrl: true },
  })

  if (!piece?.imageUrl) {
    return NextResponse.json({ error: "Pieza sin imagen" }, { status: 404 })
  }

  const upstream = await fetch(piece.imageUrl)
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "No se pudo obtener la imagen del Blob" },
      { status: 502 }
    )
  }

  const contentType = upstream.headers.get("content-type") ?? "image/png"
  const contentLength = upstream.headers.get("content-length") ?? undefined

  const headers: Record<string, string> = {
    "content-type": contentType,
    "cache-control": "public, max-age=300",
  }
  if (contentLength) headers["content-length"] = contentLength

  return new Response(upstream.body, { status: 200, headers })
}
