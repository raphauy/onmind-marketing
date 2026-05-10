"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { AvailabilityRule } from "@prisma/client"
import { toast } from "sonner"
import { CalendarDays, Plus, Shield, Trash2, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DAY_LABELS, DAY_ORDER } from "@/lib/availability-constants"
import {
  addBlockAction,
  addRuleAction,
  deleteBlockAction,
  deleteRuleAction,
  type AddBlockState,
  type AddRuleState,
} from "./actions"

type SerializedBlock = {
  id: string
  startsAt: string
  endsAt: string
  reason: string | null
  dateLabel: string
  timeLabel: string
}

const TIME_OPTIONS = (() => {
  const out: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    }
  }
  return out
})()

export function AvailabilityEditor({
  rules,
  blocks,
}: {
  rules: AvailabilityRule[]
  blocks: SerializedBlock[]
}) {
  const rulesByDay = new Map<number, AvailabilityRule[]>()
  for (const r of rules) {
    const arr = rulesByDay.get(r.dayOfWeek) || []
    arr.push(r)
    rulesByDay.set(r.dayOfWeek, arr)
  }

  return (
    <div className="space-y-8">
      <section className="border rounded-lg p-5 bg-white">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Plantilla semanal
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Bloques recurrentes que se proyectan a futuro.
            </p>
          </div>
          <AddRuleDialog />
        </div>

        <div className="divide-y">
          {DAY_ORDER.map((dow) => {
            const dayRules = rulesByDay.get(dow) || []
            return (
              <div key={dow} className="flex items-start gap-4 py-3">
                <div className="w-24 shrink-0">
                  <p className="text-sm font-medium">{DAY_LABELS[dow]}</p>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {dayRules.length === 0 ? (
                    <span className="text-sm text-muted-foreground/60 italic">
                      Sin disponibilidad
                    </span>
                  ) : (
                    dayRules.map((r) => (
                      <RuleChip key={r.id} rule={r} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border rounded-lg p-5 bg-white">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Bloqueos puntuales
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Reuniones puntuales que invalidan slots de la plantilla.
            </p>
          </div>
          <AddBlockDialog />
        </div>

        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground/70 italic">
            No hay bloqueos en los próximos 60 días.
          </p>
        ) : (
          <ul className="divide-y">
            {blocks.map((b) => (
              <BlockRow key={b.id} block={b} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function RuleChip({ rule }: { rule: AvailabilityRule }) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteRuleAction(rule.id)
        toast.success("Bloque eliminado")
      } catch {
        toast.error("No se pudo eliminar")
      }
    })
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-sm rounded-md pl-2 pr-1 py-0.5 border border-primary/20">
      {rule.startTime} a {rule.endTime}
      <button
        type="button"
        disabled={pending}
        onClick={handleDelete}
        className="text-primary/60 hover:text-primary cursor-pointer rounded p-0.5"
        aria-label="Eliminar bloque"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  )
}

const initialAddRule: AddRuleState = {}

function AddRuleDialog() {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(
    addRuleAction,
    initialAddRule
  )

  useEffect(() => {
    if (state.ok) {
      toast.success("Bloque agregado")
      setOpen(false)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer">
          <Plus className="w-4 h-4 mr-1.5" />
          Agregar bloque
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar bloque semanal</DialogTitle>
          <DialogDescription>
            Se repite todas las semanas. Los slots se generan cada 30 minutos
            dentro del rango.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="dayOfWeek">Día</Label>
            <Select name="dayOfWeek" defaultValue="1">
              <SelectTrigger id="dayOfWeek" className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_ORDER.map((dow) => (
                  <SelectItem key={dow} value={String(dow)}>
                    {DAY_LABELS[dow]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startTime">Desde</Label>
              <Select name="startTime" defaultValue="10:00">
                <SelectTrigger id="startTime" className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endTime">Hasta</Label>
              <Select name="endTime" defaultValue="12:00">
                <SelectTrigger id="endTime" className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {state.error && <p className="text-sm text-red-600">{state.error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending}
              className="cursor-pointer"
            >
              {pending ? "Guardando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function BlockRow({ block }: { block: SerializedBlock }) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteBlockAction(block.id)
        toast.success("Bloqueo eliminado")
      } catch {
        toast.error("No se pudo eliminar")
      }
    })
  }

  return (
    <li className="py-3 flex items-start justify-between gap-3">
      <div className="text-sm">
        <p className="font-medium capitalize">{block.dateLabel}</p>
        <p className="text-muted-foreground">{block.timeLabel}</p>
        {block.reason && (
          <p className="text-xs text-muted-foreground mt-0.5">{block.reason}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={handleDelete}
        className="cursor-pointer text-muted-foreground hover:text-red-600"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </li>
  )
}

const initialAddBlock: AddBlockState = {}

function AddBlockDialog() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [state, formAction, pending] = useActionState(
    addBlockAction,
    initialAddBlock
  )

  useEffect(() => {
    if (state.ok) {
      toast.success("Bloqueo agregado")
      setOpen(false)
      setDate(undefined)
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="cursor-pointer">
          <Plus className="w-4 h-4 mr-1.5" />
          Bloquear slot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bloquear slot puntual</DialogTitle>
          <DialogDescription>
            Invalida un rango de tiempo en una fecha específica.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-3">
          <input
            type="hidden"
            name="date"
            value={date ? format(date, "yyyy-MM-dd") : ""}
          />

          <div className="space-y-1.5">
            <Label>Fecha</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {date
                    ? format(date, "EEEE d 'de' MMMM yyyy", { locale: es })
                    : "Elegir fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d)
                    setDatePickerOpen(false)
                  }}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="block-startTime">Desde</Label>
              <Select name="startTime" defaultValue="10:00">
                <SelectTrigger
                  id="block-startTime"
                  className="cursor-pointer"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="block-endTime">Hasta</Label>
              <Select name="endTime" defaultValue="11:00">
                <SelectTrigger id="block-endTime" className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="block-reason">Motivo (opcional)</Label>
            <Input
              id="block-reason"
              name="reason"
              placeholder="Ej: reunión externa"
            />
          </div>

          {state.error && <p className="text-sm text-red-600">{state.error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending || !date}
              className="cursor-pointer"
            >
              {pending ? "Guardando..." : "Bloquear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
