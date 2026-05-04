import { Image as ImageIcon, Film, Copy } from "lucide-react"

export type MediaType = "image" | "video" | "carousel"

// Lookup compartido entre vistas (feed Instagram, lista de Piezas, etc.)
// del ícono que representa el tipo de media de una pieza.
export const MEDIA_ICON: Record<MediaType, typeof ImageIcon> = {
  image: ImageIcon,
  video: Film,
  carousel: Copy,
}

export function getMediaType(piece: { videoUrl: string | null }): MediaType {
  if (piece.videoUrl) return "video"
  // TODO: detectar carrusel cuando se implementen piezas multi-imagen
  return "image"
}
