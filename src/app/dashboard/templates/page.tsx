import { getTemplates } from "@/services/template-service"
import type { TemplateField } from "@/services/template-service"
import { LayoutTemplate } from "lucide-react"

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Recetas fijas para generar imágenes. Cada template define los campos
            que el creativo debe llenar.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {templates.map((template) => {
          const fields = template.fields as TemplateField[]
          return (
            <div
              key={template.id}
              className={`border rounded-lg p-5 ${
                template.isActive
                  ? "bg-white"
                  : "bg-muted/50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <LayoutTemplate className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{template.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-muted-foreground">
                    ${template.costPerImage.toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      template.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {template.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Modelo: {template.model.split("/").pop()}</span>
                <span>Ratio: {template.aspectRatio}</span>
                <span>
                  {template._count.pieces}{" "}
                  {template._count.pieces === 1 ? "pieza" : "piezas"}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Campos ({fields.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="text-sm border rounded px-3 py-2 bg-muted/30"
                    >
                      <span className="font-medium">{field.label}</span>
                      {field.required && (
                        <span className="text-red-400 ml-1">*</span>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {field.placeholder}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
