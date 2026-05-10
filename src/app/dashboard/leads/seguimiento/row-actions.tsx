"use client"

import { useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Check, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  dismissFollowUpAction,
  markFollowUpDoneAction,
} from "./actions"

export function FollowUpRowActions({
  followUpId,
  leadId,
}: {
  followUpId: string
  leadId: string
  suggestedTemplate?: string
}) {
  const [pending, startTransition] = useTransition()

  const handleDone = () => {
    startTransition(async () => {
      try {
        await markFollowUpDoneAction(followUpId, leadId)
        toast.success("Marcado como hecho")
      } catch {
        toast.error("No se pudo actualizar")
      }
    })
  }

  const handleDismiss = () => {
    startTransition(async () => {
      try {
        await dismissFollowUpAction(followUpId, leadId)
        toast.success("Descartado")
      } catch {
        toast.error("No se pudo descartar")
      }
    })
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button asChild size="sm" variant="outline" className="cursor-pointer">
        <Link href={`/dashboard/leads/${leadId}`}>
          <ExternalLink className="w-3.5 h-3.5 mr-1" />
          Abrir
        </Link>
      </Button>
      <Button
        size="sm"
        disabled={pending}
        onClick={handleDone}
        className="cursor-pointer"
      >
        <Check className="w-3.5 h-3.5 mr-1" />
        Hecho
      </Button>
      <Button
        size="sm"
        variant="ghost"
        disabled={pending}
        onClick={handleDismiss}
        className="cursor-pointer text-muted-foreground hover:text-red-600"
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}
