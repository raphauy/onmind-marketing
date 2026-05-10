"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { Lead, LeadActivity, LeadStatus } from "@prisma/client"
import { toast } from "sonner"
import { Pencil, X, Save, MessageSquarePlus } from "lucide-react"
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
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
  LeadStatusBadge,
} from "@/components/lead-status-badge"
import { formatInUY } from "@/lib/dates"
import {
  addNoteAction,
  changeStatusAction,
  updateLeadAction,
  type AddNoteState,
  type UpdateLeadState,
} from "./actions"

type LeadWithActivities = Lead & {
  activities: (LeadActivity & {
    authorUser: { id: string; name: string | null; email: string } | null
  })[]
}

export function LeadDetail({ lead }: { lead: LeadWithActivities }) {
  const [editing, setEditing] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">
            Creado {formatInUY(lead.createdAt, "d 'de' MMMM, HH:mm 'hs'")}
            {lead.trialStartedAt && (
              <>
                {" · Trial inició "}
                {formatInUY(lead.trialStartedAt, "d/M/yy")}
              </>
            )}
          </p>
        </div>

        <StatusChanger leadId={lead.id} currentStatus={lead.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border rounded-lg p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Datos del lead</h2>
            {!editing ? (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => setEditing(true)}
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Editar
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => setEditing(false)}
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancelar
              </Button>
            )}
          </div>

          {!editing ? (
            <DataView lead={lead} />
          ) : (
            <DataForm lead={lead} onDone={() => setEditing(false)} />
          )}
        </section>

        <section className="border rounded-lg p-5 bg-white">
          <h2 className="font-semibold mb-4">Notas y actividad</h2>
          <NoteForm leadId={lead.id} />
          <Timeline activities={lead.activities} />
        </section>
      </div>
    </>
  )
}

function DataView({ lead }: { lead: Lead }) {
  return (
    <dl className="text-sm space-y-3">
      <div>
        <dt className="text-muted-foreground text-xs">Email</dt>
        <dd>{lead.email}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground text-xs">WhatsApp</dt>
        <dd>{lead.phone || <span className="text-muted-foreground">Sin teléfono</span>}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground text-xs">Origen</dt>
        <dd>{LEAD_SOURCE_LABEL[lead.source] || lead.source}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground text-xs">Rubro</dt>
        <dd>
          {lead.businessType || (
            <span className="text-muted-foreground">Sin rubro</span>
          )}
        </dd>
      </div>
    </dl>
  )
}

const initialUpdate: UpdateLeadState = {}

function DataForm({ lead, onDone }: { lead: Lead; onDone: () => void }) {
  const [state, formAction, pending] = useActionState(
    updateLeadAction,
    initialUpdate
  )

  useEffect(() => {
    if (state.ok) {
      toast.success("Datos actualizados")
      onDone()
    }
  }, [state, onDone])

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={lead.id} />

      <div className="space-y-1.5">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" defaultValue={lead.name} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={lead.email}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">WhatsApp</Label>
        <Input id="phone" name="phone" defaultValue={lead.phone || ""} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="source">Origen</Label>
        <Select name="source" defaultValue={lead.source}>
          <SelectTrigger id="source" className="cursor-pointer">
            <SelectValue />
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
          defaultValue={lead.businessType || ""}
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="cursor-pointer">
        <Save className="w-3.5 h-3.5 mr-1.5" />
        {pending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  )
}

function StatusChanger({
  leadId,
  currentStatus,
}: {
  leadId: string
  currentStatus: LeadStatus
}) {
  const [pending, startTransition] = useTransition()

  const handleChange = (next: string) => {
    if (next === currentStatus) return
    startTransition(async () => {
      try {
        await changeStatusAction(leadId, next as LeadStatus)
        toast.success(`Estado: ${LEAD_STATUS_LABEL[next as LeadStatus]}`)
      } catch (e) {
        toast.error("No se pudo actualizar el estado")
        console.error(e)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <LeadStatusBadge status={currentStatus} />
      <Select value={currentStatus} onValueChange={handleChange}>
        <SelectTrigger
          className="w-[180px] cursor-pointer"
          disabled={pending}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LEAD_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {LEAD_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const initialNote: AddNoteState = {}

function NoteForm({ leadId }: { leadId: string }) {
  const [state, formAction, pending] = useActionState(
    addNoteAction,
    initialNote
  )
  const [draft, setDraft] = useState("")
  const [lastState, setLastState] = useState(state)

  if (state !== lastState) {
    setLastState(state)
    if (state.ok) setDraft("")
  }

  return (
    <form action={formAction} className="space-y-2 mb-5">
      <input type="hidden" name="leadId" value={leadId} />
      <Textarea
        name="message"
        rows={2}
        placeholder="Agregá una nota (qué hablaron, próximo paso, etc.)"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <Button
        type="submit"
        size="sm"
        disabled={pending || !draft.trim()}
        className="cursor-pointer"
      >
        <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5" />
        {pending ? "Guardando..." : "Agregar nota"}
      </Button>
    </form>
  )
}

function Timeline({
  activities,
}: {
  activities: LeadWithActivities["activities"]
}) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Sin actividad registrada todavía.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {activities.map((a) => (
        <li key={a.id} className="border-l-2 border-muted pl-3 py-0.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="uppercase tracking-wide">
              {a.type === "NOTE"
                ? "Nota"
                : a.type === "STATUS_CHANGE"
                  ? "Estado"
                  : "Sistema"}
            </span>
            <span>·</span>
            <span>{formatInUY(a.createdAt, "d/M HH:mm")}</span>
            {a.authorUser && (
              <>
                <span>·</span>
                <span>{a.authorUser.name || a.authorUser.email}</span>
              </>
            )}
          </div>
          <p className="text-sm mt-0.5 whitespace-pre-wrap">{a.message}</p>
        </li>
      ))}
    </ul>
  )
}
