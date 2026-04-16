import { getActiveTemplates } from "@/services/template-service"
import { PieceForm } from "@/components/piece-form"

export default async function NuevaPiezaPage() {
  const templates = await getActiveTemplates()

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Nueva pieza</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Seleccioná un template y completá los campos para crear una pieza.
      </p>
      <PieceForm templates={templates} />
    </div>
  )
}
