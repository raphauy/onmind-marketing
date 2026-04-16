"use client"

import { useState } from "react"
import { createPieceAction } from "@/app/dashboard/piezas/nueva/actions"
import type { Template } from "@prisma/client"
import type { TemplateField } from "@/services/template-service"
import { LayoutTemplate, ChevronLeft, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const PILLARS = [
  { value: "educacion", label: "Educación" },
  { value: "dolor", label: "Dolor" },
  { value: "producto", label: "Producto" },
  { value: "detras_de_escena", label: "Detrás de escena" },
]

export function PieceForm({ templates }: { templates: Template[] }) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  )

  if (!selectedTemplate) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">
          Elegí un template:
        </p>
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t)}
            className="w-full text-left border rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <LayoutTemplate className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                ${t.costPerImage.toFixed(2)}
              </span>
            </div>
          </button>
        ))}
      </div>
    )
  }

  const fields = selectedTemplate.fields as TemplateField[]

  return (
    <div>
      <button
        onClick={() => setSelectedTemplate(null)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Cambiar template
      </button>

      <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <LayoutTemplate className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{selectedTemplate.name}</p>
          <p className="text-xs text-muted-foreground">
            ${selectedTemplate.costPerImage.toFixed(2)} por imagen
          </p>
        </div>
      </div>

      <form action={createPieceAction} className="space-y-4">
        <input type="hidden" name="templateId" value={selectedTemplate.id} />

        {/* Campos del template */}
        <div className="space-y-5">
          <p className="text-sm font-medium">Contenido</p>
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={`field_${field.key}`}>
                {field.label}
                {field.required && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={`field_${field.key}`}
                  name={`field_${field.key}`}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                />
              ) : (
                <Input
                  id={`field_${field.key}`}
                  name={`field_${field.key}`}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div className="border-t pt-5 space-y-5">
          <p className="text-sm font-medium">Metadata</p>

          <div className="space-y-2">
            <Label htmlFor="pillar">Pilar</Label>
            <Select name="pillar">
              <SelectTrigger className="w-full h-9 px-3 cursor-pointer">
                <SelectValue placeholder="Seleccionar pilar" />
              </SelectTrigger>
              <SelectContent>
                {PILLARS.map((p) => (
                  <SelectItem
                    key={p.value}
                    value={p.value}
                    className="cursor-pointer"
                  >
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="topic">Tema</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Nombre descriptivo para identificar esta pieza en las listas.
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="topic"
              name="topic"
              placeholder="Ej: Features principales de OnMind"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption (para Instagram)</Label>
            <Textarea
              id="caption"
              name="caption"
              rows={3}
              placeholder="Texto del post en Instagram..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags">Hashtags</Label>
            <Input
              id="hashtags"
              name="hashtags"
              placeholder="#inmobiliaria, #gestiondeclientes, #onmind"
            />
            <p className="text-xs text-muted-foreground">
              Separados por coma
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <Button type="submit" className="w-full cursor-pointer">
            Crear pieza
          </Button>
        </div>
      </form>
    </div>
  )
}
