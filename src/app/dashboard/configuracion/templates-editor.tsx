"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { RotateCcw, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageTemplateChannel,
  MessageTemplatePurpose,
} from "@prisma/client"
import {
  resetTemplateAction,
  saveTemplateAction,
  type SaveTemplateState,
} from "./actions"
import type { ResolvedTemplate } from "@/services/message-template-service"

type Group = {
  purpose: MessageTemplatePurpose
  shortLabel: string
  label: string
  description: string
  email: ResolvedTemplate
  whatsapp: ResolvedTemplate
}

export function TemplatesEditor({ groups }: { groups: Group[] }) {
  return (
    <Tabs defaultValue={groups[0].purpose}>
      <TabsList className="grid grid-cols-4 w-full">
        {groups.map((g) => (
          <TabsTrigger
            key={g.purpose}
            value={g.purpose}
            className="cursor-pointer"
          >
            {g.shortLabel}
          </TabsTrigger>
        ))}
      </TabsList>

      {groups.map((g) => (
        <TabsContent key={g.purpose} value={g.purpose} className="mt-5">
          <div className="mb-4">
            <h2 className="font-semibold text-base">{g.label}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {g.description}
            </p>
          </div>

          <div className="space-y-5">
            <TemplateForm
              purpose={g.purpose}
              channel="EMAIL"
              template={g.email}
              allowsBookingVar={g.purpose === "BOOKING_LINK"}
            />
            <TemplateForm
              purpose={g.purpose}
              channel="WHATSAPP"
              template={g.whatsapp}
              allowsBookingVar={g.purpose === "BOOKING_LINK"}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

const initialState: SaveTemplateState = {}

function TemplateForm({
  purpose,
  channel,
  template,
  allowsBookingVar,
}: {
  purpose: MessageTemplatePurpose
  channel: MessageTemplateChannel
  template: ResolvedTemplate
  allowsBookingVar: boolean
}) {
  const [state, formAction, pending] = useActionState(
    saveTemplateAction,
    initialState
  )
  const [resetting, startReset] = useTransition()

  useEffect(() => {
    if (state.ok) toast.success("Plantilla guardada")
  }, [state])

  const channelLabel = channel === "EMAIL" ? "Email" : "WhatsApp"

  const handleReset = () => {
    startReset(async () => {
      try {
        await resetTemplateAction(channel, purpose)
        toast.success("Restaurada al default")
      } catch (e) {
        console.error(e)
        toast.error("No se pudo restaurar")
      }
    })
  }

  return (
    <form
      action={formAction}
      className="border rounded-lg p-5 bg-white space-y-3"
    >
      <input type="hidden" name="channel" value={channel} />
      <input type="hidden" name="purpose" value={purpose} />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-semibold flex items-center gap-2">
          {channelLabel}
          {template.isDefault && (
            <Badge variant="outline" className="text-[10px] h-5">
              Default
            </Badge>
          )}
        </h3>
        {!template.isDefault && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={resetting}
            onClick={handleReset}
            className="cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Restaurar default
          </Button>
        )}
      </div>

      {channel === "EMAIL" && (
        <div className="space-y-1.5">
          <Label htmlFor={`subject-${channel}-${purpose}`}>Asunto</Label>
          <Input
            id={`subject-${channel}-${purpose}`}
            name="subject"
            defaultValue={template.subject ?? ""}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor={`body-${channel}-${purpose}`}>Mensaje</Label>
        <Textarea
          id={`body-${channel}-${purpose}`}
          name="body"
          rows={channel === "EMAIL" ? 8 : 6}
          defaultValue={template.body}
          required
        />
        <p className="text-[11px] text-muted-foreground">
          Variables: <code>{"{nombre}"}</code>
          {allowsBookingVar && (
            <>
              {" · "}
              <code>{"{linkBooking}"}</code>
            </>
          )}
        </p>
        {state.fieldErrors?.body && (
          <p className="text-xs text-red-600">{state.fieldErrors.body}</p>
        )}
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button
        type="submit"
        size="sm"
        disabled={pending}
        className="cursor-pointer"
      >
        <Save className="w-3.5 h-3.5 mr-1.5" />
        {pending ? "Guardando..." : "Guardar"}
      </Button>
    </form>
  )
}
