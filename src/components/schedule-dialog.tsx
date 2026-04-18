"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  schedulePieceAction,
  reschedulePieceAction,
} from "@/app/dashboard/piezas/[slug]/actions"
import {
  composeLocalDateTime,
  formatInUY,
  minScheduleDate,
} from "@/lib/dates"
import { isAfter, startOfToday } from "date-fns"

type Props = {
  slug: string
  mode: "schedule" | "reschedule"
  currentScheduledAt?: Date
  trigger: React.ReactNode
}

export function ScheduleDialog({ slug, mode, currentScheduledAt, trigger }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(currentScheduledAt)
  const [hour, setHour] = useState<string | undefined>(
    currentScheduledAt ? String(currentScheduledAt.getHours()) : "18"
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scheduled =
    date && hour !== undefined ? composeLocalDateTime(date, parseInt(hour, 10)) : null

  const min = minScheduleDate()
  const isValid = scheduled ? isAfter(scheduled, new Date()) : false

  async function handleConfirm() {
    if (!scheduled || !isValid) return
    setSubmitting(true)
    setError(null)

    const iso = scheduled.toISOString()
    const action =
      mode === "schedule" ? schedulePieceAction : reschedulePieceAction
    const result = await action(slug, iso)

    setSubmitting(false)
    if (result.success) {
      setOpen(false)
      router.refresh()
    } else {
      setError(result.error)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) {
      setError(null)
      if (!currentScheduledAt) {
        setDate(undefined)
        setHour("18")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "schedule" ? "Programar publicación" : "Reprogramar publicación"}
          </DialogTitle>
          <DialogDescription>
            Elegí fecha y hora. El cron publica en hora de Uruguay cada hora en punto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < startOfToday()}
              className="rounded-md border"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              Hora
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 24 }, (_, i) => {
                const selected = hour === String(i)
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setHour(String(i))}
                    className={cn(
                      "py-1.5 text-sm rounded-md border cursor-pointer transition-colors",
                      selected
                        ? "bg-primary text-white border-primary"
                        : "bg-background hover:bg-muted border-input"
                    )}
                  >
                    {String(i).padStart(2, "0")}
                  </button>
                )
              })}
            </div>
          </div>

          {scheduled && (
            <div
              className={`text-sm rounded-lg px-3 py-2 border ${
                isValid
                  ? "bg-primary/5 border-primary/20 text-primary"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              {isValid ? (
                <>
                  Se publicará el{" "}
                  <span className="font-semibold">{formatInUY(scheduled)}</span>{" "}
                  (hora Uruguay)
                </>
              ) : (
                <>
                  Esa hora ya pasó. La primera disponible es{" "}
                  <span className="font-semibold">{formatInUY(min)}</span>.
                </>
              )}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid || submitting}
            className="cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirmando...
              </>
            ) : mode === "schedule" ? (
              "Programar"
            ) : (
              "Reprogramar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
