import { LeadForm } from "./lead-form"

export default function NuevoLeadPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Nuevo lead</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Cargá los datos del prospecto. Después podés agregar notas y mover el
        estado desde el detalle.
      </p>

      <LeadForm />
    </div>
  )
}
