"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  generatePieceAction,
  approvePieceAction,
  deletePieceAction,
  restorePieceAction,
} from "@/app/dashboard/piezas/[slug]/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Sparkles, Check, RotateCcw, Trash2, ArchiveRestore } from "lucide-react"

export function PieceActions({
  slug,
  status,
  isDeleted,
}: {
  slug: string
  status: string
  isDeleted: boolean
}) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [approving, setApproving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const busy = generating || approving || deleting

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    const result = await generatePieceAction(slug)
    setGenerating(false)
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  async function handleApprove() {
    setApproving(true)
    setError(null)
    const result = await approvePieceAction(slug)
    setApproving(false)
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {(status === "DRAFT" || status === "FAILED") && (
        <button
          onClick={handleGenerate}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generando imagen...
            </>
          ) : status === "FAILED" ? (
            <>
              <RotateCcw className="w-4 h-4" />
              Reintentar generación
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generar imagen
            </>
          )}
        </button>
      )}

      {status === "GENERATING" && (
        <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          Generando imagen...
        </div>
      )}

      {status === "GENERATED" && (
        <div className="flex gap-2">
          <button
            onClick={handleApprove}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 cursor-pointer"
          >
            {approving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Aprobar
          </button>
          <button
            onClick={handleGenerate}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-50 cursor-pointer"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Regenerar
          </button>
        </div>
      )}

      {status === "APPROVED" && (
        <div className="w-full py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium text-center">
          ✓ Aprobada — lista para programar o publicar
        </div>
      )}

      {status === "PUBLISHED" && (
        <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium text-center">
          ✓ Publicada
        </div>
      )}

      {/* Eliminar / Restaurar */}
      <div className="border-t pt-3 mt-3">
        {isDeleted ? (
          <button
            onClick={async () => {
              setDeleting(true)
              await restorePieceAction(slug)
              setDeleting(false)
              router.refresh()
            }}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground border rounded-lg hover:bg-muted disabled:opacity-50 cursor-pointer"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArchiveRestore className="w-4 h-4" />
            )}
            Restaurar pieza
          </button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 hover:text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar pieza
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar pieza</AlertDialogTitle>
                <AlertDialogDescription>
                  La pieza será marcada como eliminada. Podés restaurarla más tarde desde el filtro de eliminadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setDeleting(true)
                    await deletePieceAction(slug)
                  }}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Eliminar"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  )
}
