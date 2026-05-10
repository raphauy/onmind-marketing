"use client"

import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createLeadAction, type CreateLeadFormState } from "./actions"

const initialState: CreateLeadFormState = {}

export function LeadForm() {
  const [state, formAction, pending] = useActionState(
    createLeadAction,
    initialState
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" required placeholder="Ej: Juan Pérez" />
        {state.fieldErrors?.name && (
          <p className="text-xs text-red-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="juan@ejemplo.com"
        />
        {state.fieldErrors?.email && (
          <p className="text-xs text-red-600">{state.fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">WhatsApp</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="+598 9X XXX XXX"
        />
        <p className="text-xs text-muted-foreground">
          Opcional. Sumá el código de país.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="source">Origen</Label>
        <Select name="source" defaultValue="WEB">
          <SelectTrigger id="source" className="cursor-pointer">
            <SelectValue placeholder="¿Por dónde llegó?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WEB">Web</SelectItem>
            <SelectItem value="INSTAGRAM">Instagram</SelectItem>
            <SelectItem value="REFERRAL">Referido</SelectItem>
            <SelectItem value="OTHER">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="businessType">Rubro</Label>
        <Textarea
          id="businessType"
          name="businessType"
          rows={2}
          placeholder="Ej: inmobiliaria, gimnasio, estudio jurídico"
        />
        <p className="text-xs text-muted-foreground">Opcional.</p>
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          disabled={pending}
          className="cursor-pointer"
        >
          {pending ? "Creando..." : "Crear lead"}
        </Button>
      </div>
    </form>
  )
}
