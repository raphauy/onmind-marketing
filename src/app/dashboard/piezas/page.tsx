import { getPieces, getPieceStats } from "@/services/piece-service"
import Link from "next/link"
import { Plus, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Borrador", color: "bg-gray-100 text-gray-600" },
  GENERATING: { label: "Generando", color: "bg-yellow-100 text-yellow-700" },
  GENERATED: { label: "Generada", color: "bg-blue-100 text-blue-700" },
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

export default async function PiezasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; pillar?: string; deleted?: string }>
}) {
  const params = await searchParams
  const showDeleted = params.deleted === "1"
  const [pieces, stats] = await Promise.all([
    getPieces({
      status: params.status as any,
      pillar: params.pillar,
      deleted: showDeleted,
    }),
    getPieceStats(),
  ])

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Piezas</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {stats.total} piezas · ${stats.totalCost.toFixed(2)} invertidos
          </p>
        </div>
        <Link
          href="/dashboard/piezas/nueva"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva pieza
        </Link>
      </div>

      {/* Filtros por status */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Badge
          variant={!params.status && !showDeleted ? "default" : "secondary"}
          asChild
          className="cursor-pointer h-7 px-3"
        >
          <Link href="/dashboard/piezas">Activas ({stats.total})</Link>
        </Badge>
        {Object.entries(STATUS_LABELS).map(([key, { label }]) => {
          const count = stats.byStatus[key] || 0
          return (
            <Badge
              key={key}
              variant={params.status === key && !showDeleted ? "default" : "secondary"}
              asChild
              className="cursor-pointer h-7 px-3"
            >
              <Link href={`/dashboard/piezas?status=${key}`}>
                {label} ({count})
              </Link>
            </Badge>
          )
        })}
        <Badge
          variant={showDeleted ? "destructive" : "secondary"}
          asChild
          className="cursor-pointer h-7 px-3"
        >
          <Link href={showDeleted ? "/dashboard/piezas" : "/dashboard/piezas?deleted=1"}>
            Eliminadas ({stats.deleted})
          </Link>
        </Badge>
      </div>

      {pieces.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No hay piezas{params.status ? " con este filtro" : ""}.</p>
          <Link
            href="/dashboard/piezas/nueva"
            className="text-primary text-sm mt-2 inline-block cursor-pointer"
          >
            Crear la primera pieza
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pieces.map((piece) => {
            const status = STATUS_LABELS[piece.status] || {
              label: piece.status,
              color: "bg-gray-100",
            }
            return (
              <Link
                key={piece.id}
                href={`/dashboard/piezas/${piece.slug}`}
                className="border rounded-lg overflow-hidden hover:border-primary/30 transition-colors cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/5] bg-muted relative border-b">
                  {piece.imageUrl ? (
                    <img
                      src={piece.imageUrl}
                      alt={piece.topic || piece.slug}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Status badge */}
                  <Badge
                    variant="outline"
                    className={`absolute top-2 right-2 ${status.color}`}
                  >
                    {status.label}
                  </Badge>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium truncate">
                    {piece.topic || piece.slug}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {piece.template.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {piece.pillar && (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {PILLAR_LABELS[piece.pillar] || piece.pillar}
                      </Badge>
                    )}
                    {piece.costUsd != null && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ${piece.costUsd.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
