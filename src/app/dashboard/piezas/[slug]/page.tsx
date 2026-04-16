import { getPieceBySlug } from "@/services/piece-service"
import { notFound } from "next/navigation"
import { PieceActions } from "@/components/piece-actions"
import { Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ImageGallery } from "@/components/image-gallery"
import { GenerationHistory } from "@/components/generation-history"
import type { TemplateField } from "@/services/template-service"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  GENERATING: { label: "Generando...", color: "bg-yellow-100 text-yellow-700" },
  GENERATED: { label: "Imagen lista", color: "bg-blue-100 text-blue-700" },
  APPROVED: { label: "Aprobada", color: "bg-green-100 text-green-700" },
  SCHEDULED: { label: "Programada", color: "bg-purple-100 text-purple-700" },
  PUBLISHED: { label: "Publicada", color: "bg-emerald-100 text-emerald-700" },
  FAILED: { label: "Error", color: "bg-red-100 text-red-700" },
}

const PILLAR_LABELS: Record<string, string> = {
  educacion: "Educación",
  dolor: "Dolor",
  producto: "Producto",
  detras_de_escena: "Detrás de escena",
}

export default async function PieceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const piece = await getPieceBySlug(slug)
  if (!piece) notFound()

  const status = STATUS_LABELS[piece.status] || {
    label: piece.status,
    color: "bg-gray-100",
  }
  const fields = piece.template.fields as TemplateField[]
  const fieldValues = piece.fieldValues as Record<string, string>
  const galleryImages = piece.generations.map((gen, i) => ({
    src: gen.imageUrl,
    alt: `Generación #${piece.generations.length - i}`,
  }))
  const activeIndex = piece.generations.findIndex((g) => g.isActive)

  return (
    <div className="max-w-4xl">
      <Link
        href="/dashboard/piezas"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block cursor-pointer"
      >
        ← Volver a piezas
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">
          {piece.topic || piece.slug}
        </h1>
        <Badge variant="outline" className={status.color}>
          {status.label}
        </Badge>
      </div>

      {piece.deletedAt && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Eliminada el{" "}
          {piece.deletedAt.toLocaleDateString("es-UY", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {piece.deletedBy && (
            <> por <span className="font-medium">{piece.deletedBy.name || piece.deletedBy.email}</span></>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen */}
        <div>
          <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden border">
            {piece.imageUrl ? (
              <ImageGallery
                images={galleryImages}
                startIndex={activeIndex >= 0 ? activeIndex : 0}
                trigger={
                  <img
                    src={piece.imageUrl}
                    alt={piece.topic || piece.slug}
                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
                  />
                }
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="mt-4">
            <PieceActions
              slug={piece.slug}
              status={piece.status}
              isDeleted={piece.deletedAt !== null}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-5">
          {/* Template */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Template
            </p>
            <p className="text-sm font-medium">{piece.template.name}</p>
          </div>

          {/* Pilar */}
          {piece.pillar && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Pilar
              </p>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {PILLAR_LABELS[piece.pillar] || piece.pillar}
              </Badge>
            </div>
          )}

          {/* Campos del template */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Campos
            </p>
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field.key} className="border rounded-lg px-3 py-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {field.label}
                  </p>
                  <p className="text-sm mt-0.5">
                    {fieldValues[field.key] || (
                      <span className="text-muted-foreground italic">
                        vacío
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Caption */}
          {piece.caption && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Caption
              </p>
              <p className="text-sm whitespace-pre-line">{piece.caption}</p>
            </div>
          )}

          {/* Hashtags */}
          {piece.hashtags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Hashtags
              </p>
              <div className="flex flex-wrap gap-1">
                {piece.hashtags.map((h) => (
                  <span
                    key={h}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Historial de generaciones */}
          {piece.generations.length > 0 && (
            <GenerationHistory
              slug={piece.slug}
              generations={piece.generations}
              totalCost={piece.costUsd}
            />
          )}
        </div>
      </div>
    </div>
  )
}
