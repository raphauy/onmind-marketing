"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { reserveSlotAction } from "./actions"

type SerializedSlot = {
  startsAt: string
  endsAt: string
  timeLabel: string
  dayKey: string
  dayLabel: string
  fullLabel: string
}

export function BookingPicker({
  token,
  slots,
  ownerName,
}: {
  token: string
  slots: SerializedSlot[]
  ownerName: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [selected, setSelected] = useState<SerializedSlot | null>(null)

  const grouped = useMemo(() => groupByDay(slots), [slots])

  const handleConfirm = () => {
    if (!selected) return
    startTransition(async () => {
      const res = await reserveSlotAction({
        token,
        startsAt: selected.startsAt,
        endsAt: selected.endsAt,
      })
      if (!res.ok) {
        toast.error(res.error)
        setSelected(null)
        router.refresh()
        return
      }
      toast.success("Demo agendada")
      router.refresh()
    })
  }

  return (
    <>
      <div className="space-y-5">
        {grouped.map(({ dayKey, dayLabel, daySlots }) => (
          <div key={dayKey}>
            <h3 className="text-sm font-semibold capitalize mb-2">
              {dayLabel}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {daySlots.map((slot) => (
                <Button
                  key={slot.startsAt}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setSelected(slot)}
                >
                  {slot.timeLabel}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar demo</AlertDialogTitle>
            <AlertDialogDescription>
              {selected ? (
                <>
                  Vas a agendar la demo con {ownerName} para{" "}
                  <span className="font-medium capitalize text-foreground">
                    {selected.fullLabel}
                  </span>
                  . Vamos a enviarte el link de Google Meet.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending} className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={(e) => {
                e.preventDefault()
                handleConfirm()
              }}
              className="cursor-pointer"
            >
              {pending ? "Agendando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function groupByDay(slots: SerializedSlot[]) {
  const out = new Map<
    string,
    { dayKey: string; dayLabel: string; daySlots: SerializedSlot[] }
  >()

  for (const slot of slots) {
    if (!out.has(slot.dayKey)) {
      out.set(slot.dayKey, {
        dayKey: slot.dayKey,
        dayLabel: slot.dayLabel,
        daySlots: [],
      })
    }
    out.get(slot.dayKey)!.daySlots.push(slot)
  }

  return Array.from(out.values())
}
