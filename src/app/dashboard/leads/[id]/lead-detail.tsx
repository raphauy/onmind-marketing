"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState, useTransition } from "react"
import {
  Lead,
  LeadActivity,
  LeadStatus,
  MessageTemplateChannel,
  MessageTemplatePurpose,
} from "@prisma/client"
import { toast } from "sonner"
import {
  Pencil,
  X,
  Save,
  MessageSquarePlus,
  Mail,
  MessageCircle,
  ExternalLink,
  Link as LinkIcon,
  CalendarPlus,
  CalendarCheck,
  Copy,
  Clock,
  Check,
  Trash2,
} from "lucide-react"
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
  LeadStatusBadge,
} from "@/components/lead-status-badge"
import {
  addNoteAction,
  changeOwnerAction,
  changeStatusAction,
  deleteLeadAction,
  generateBookingLinkAction,
  markCalendarEventCreatedAction,
  resolveTemplateForLeadAction,
  updateLeadAction,
  type AddNoteState,
  type UpdateLeadState,
} from "./actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type OwnerCandidate = { id: string; name: string | null; email: string }

type ActivityWithAuthor = LeadActivity & {
  authorUser: { id: string; name: string | null; email: string } | null
  createdAtLabel: string
}

type LeadWithActivities = Lead & {
  owner: OwnerCandidate | null
  activities: ActivityWithAuthor[]
  createdAtLabel: string
  trialStartedAtLabel: string | null
}

export type BookingInfo = {
  id: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  url: string
  startsAt: string | null
  endsAt: string | null
  whenLabel: string | null
  ownerName: string
  calendarEventCreated: boolean
  calendarUrl: string | null
}

export type FollowUpInfo = { id: string; daysSince: number }

export function LeadDetail({
  lead,
  ownerCandidates,
  booking,
  ownerHasAvailability,
  followUp,
  canDelete,
}: {
  lead: LeadWithActivities
  ownerCandidates: OwnerCandidate[]
  booking: BookingInfo | null
  ownerHasAvailability: boolean
  followUp: FollowUpInfo | null
  canDelete: boolean
}) {
  const [editing, setEditing] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">
            Creado {lead.createdAtLabel}
            {lead.trialStartedAtLabel && (
              <>
                {" · Trial inició "}
                {lead.trialStartedAtLabel}
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusChanger leadId={lead.id} currentStatus={lead.status} />
          <OwnerChanger
            leadId={lead.id}
            currentOwnerId={lead.ownerUserId}
            candidates={ownerCandidates}
          />
        </div>
      </div>

      {followUp && <FollowUpBanner followUp={followUp} leadId={lead.id} />}

      <BookingSection
        leadId={lead.id}
        booking={booking}
        ownerName={lead.owner?.name || lead.owner?.email || null}
        ownerHasAvailability={ownerHasAvailability}
      />

      <LeadActions
        leadId={lead.id}
        status={lead.status}
        hasPhone={!!lead.phone}
        hasBookingLink={!!booking}
      />

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

      {canDelete && <DangerZone leadId={lead.id} leadName={lead.name} />}
    </>
  )
}

function DangerZone({
  leadId,
  leadName,
}: {
  leadId: string
  leadName: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await deleteLeadAction(leadId)
        if (!res.ok) {
          toast.error(res.error)
          setOpen(false)
          return
        }
        toast.success("Lead eliminado")
        router.push("/dashboard/leads")
      } catch (e) {
        console.error(e)
        toast.error("No se pudo eliminar el lead")
        setOpen(false)
      }
    })
  }

  return (
    <section className="mt-6 border border-red-200 rounded-lg p-5 bg-red-50/40">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-semibold text-red-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Zona peligrosa
          </h2>
          <p className="text-sm text-red-900/80 mt-0.5">
            Eliminar el lead borra también su timeline, follow-ups y booking.
            Acción irreversible.
          </p>
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="cursor-pointer border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Eliminar lead
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar a {leadName}?</AlertDialogTitle>
              <AlertDialogDescription>
                Se borra el lead, todas sus notas y eventos del timeline,
                cualquier follow-up activo y el booking si existe. Esta acción
                no se puede deshacer.
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
                  handleDelete()
                }}
                className="cursor-pointer bg-red-600 hover:bg-red-700"
              >
                {pending ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
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

const UNASSIGNED = "__unassigned__"

function OwnerChanger({
  leadId,
  currentOwnerId,
  candidates,
}: {
  leadId: string
  currentOwnerId: string | null
  candidates: OwnerCandidate[]
}) {
  const [pending, startTransition] = useTransition()

  const handleChange = (next: string) => {
    const newOwnerId = next === UNASSIGNED ? null : next
    if ((currentOwnerId ?? null) === (newOwnerId ?? null)) return

    startTransition(async () => {
      try {
        await changeOwnerAction(leadId, newOwnerId)
        const ownerName =
          newOwnerId === null
            ? "sin owner"
            : candidates.find((c) => c.id === newOwnerId)?.name ||
              candidates.find((c) => c.id === newOwnerId)?.email ||
              "owner"
        toast.success(`Owner: ${ownerName}`)
      } catch (e) {
        toast.error("No se pudo cambiar el owner")
        console.error(e)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Owner</span>
      <Select
        value={currentOwnerId ?? UNASSIGNED}
        onValueChange={handleChange}
      >
        <SelectTrigger
          className="w-[180px] cursor-pointer"
          disabled={pending}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={UNASSIGNED}>Sin owner</SelectItem>
          {candidates.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name || c.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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

type ActionGroup = {
  label: string
  purpose: MessageTemplatePurpose
  requiresBookingLink: boolean
}

function relevantActionsForStatus(status: LeadStatus): ActionGroup[] {
  switch (status) {
    case "NEW":
      return [
        { label: "Enviar link de booking", purpose: "BOOKING_LINK", requiresBookingLink: true },
      ]
    case "CONTACTED":
      return [
        { label: "Reenviar link de booking", purpose: "BOOKING_LINK", requiresBookingLink: true },
        { label: "Follow-up sin respuesta", purpose: "FOLLOWUP_CONTACTED", requiresBookingLink: true },
      ]
    case "DEMO_DONE":
      return [
        { label: "Follow-up post demo", purpose: "FOLLOWUP_DEMO_DONE", requiresBookingLink: false },
      ]
    case "CUSTOMER":
      return [
        { label: "Check-in mitad del primer mes", purpose: "CHECKIN_CUSTOMER_MONTH_1", requiresBookingLink: false },
      ]
    default:
      return []
  }
}

function LeadActions({
  leadId,
  status,
  hasPhone,
  hasBookingLink,
}: {
  leadId: string
  status: LeadStatus
  hasPhone: boolean
  hasBookingLink: boolean
}) {
  const groups = relevantActionsForStatus(status)
  if (groups.length === 0) return null

  return (
    <section className="border rounded-lg p-5 bg-white mb-6">
      <h2 className="font-semibold mb-4">Acciones</h2>
      <div className="space-y-4">
        {groups.map((g) => {
          const disabled = g.requiresBookingLink && !hasBookingLink
          return (
            <ActionGroupRow
              key={g.purpose}
              leadId={leadId}
              label={g.label}
              purpose={g.purpose}
              disabled={disabled}
              disabledReason={
                disabled
                  ? "Generá el link de booking primero"
                  : undefined
              }
              hasPhone={hasPhone}
            />
          )
        })}
      </div>
    </section>
  )
}

function FollowUpBanner({
  followUp,
  leadId,
}: {
  followUp: FollowUpInfo
  leadId: string
}) {
  const [pending, startTransition] = useTransition()

  const handleDone = () => {
    startTransition(async () => {
      const { markFollowUpDoneAction } = await import(
        "../seguimiento/actions"
      )
      try {
        await markFollowUpDoneAction(followUp.id, leadId)
        toast.success("Marcado como hecho")
      } catch {
        toast.error("No se pudo actualizar")
      }
    })
  }

  const dayLabel = followUp.daysSince === 1 ? "1 día" : `${followUp.daysSince} días`

  return (
    <section className="border rounded-lg p-4 bg-amber-50 border-amber-200 mb-6 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-amber-900 text-sm">
        <Clock className="w-4 h-4" />
        <span className="font-medium">
          Necesita seguimiento · {dayLabel} sin movimiento
        </span>
      </div>
      <Button
        size="sm"
        disabled={pending}
        onClick={handleDone}
        className="cursor-pointer"
      >
        <Check className="w-3.5 h-3.5 mr-1.5" />
        Marcar como hecho
      </Button>
    </section>
  )
}

function BookingSection({
  leadId,
  booking,
  ownerName,
  ownerHasAvailability,
}: {
  leadId: string
  booking: BookingInfo | null
  ownerName: string | null
  ownerHasAvailability: boolean
}) {
  const [pending, startTransition] = useTransition()

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateBookingLinkAction(leadId)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      try {
        await navigator.clipboard.writeText(res.url)
        toast.success("Link generado y copiado")
      } catch {
        toast.success("Link generado")
      }
    })
  }

  if (!booking) {
    const blocked = !ownerHasAvailability

    return (
      <section className="border rounded-lg p-5 bg-white mb-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link de booking
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Generá un link único para que el lead elija día y hora de la
              demo.{" "}
              <Link
                href="/dashboard/disponibilidad"
                className="text-primary underline cursor-pointer"
              >
                Configurar disponibilidad
              </Link>
              .
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={pending || blocked}
            className="cursor-pointer"
          >
            {pending ? "Generando..." : "Generar link"}
          </Button>
        </div>

        {blocked && (
          <div className="mt-3 text-sm bg-amber-50 border border-amber-200 text-amber-900 rounded-md p-3">
            {ownerName
              ? `${ownerName} todavía no configuró su disponibilidad.`
              : "Asigná un owner al lead antes de generar el link."}{" "}
            {ownerName && (
              <>
                Pedile que cargue su plantilla semanal en{" "}
                <Link
                  href="/dashboard/disponibilidad"
                  className="underline cursor-pointer"
                >
                  Disponibilidad
                </Link>
                .
              </>
            )}
          </div>
        )}
      </section>
    )
  }

  if (booking.status === "CONFIRMED" && booking.startsAt) {
    return <BookingConfirmedCard booking={booking} />
  }

  return <BookingPendingCard booking={booking} />
}

function BookingPendingCard({ booking }: { booking: BookingInfo }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(booking.url)
      toast.success("Link copiado")
    } catch {
      toast.error("No se pudo copiar")
    }
  }

  return (
    <section className="border rounded-lg p-5 bg-white mb-6">
      <h2 className="font-semibold flex items-center gap-2 mb-2">
        <LinkIcon className="w-4 h-4" />
        Link de booking
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        Copialo y mandáselo al lead por email o WhatsApp. Esperando que reserve.
      </p>
      <div className="flex items-center gap-2 bg-muted/40 rounded border px-3 py-2">
        <code className="text-xs flex-1 truncate font-mono text-muted-foreground">
          {booking.url}
        </code>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="cursor-pointer shrink-0"
        >
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          Copiar
        </Button>
      </div>
    </section>
  )
}

function BookingConfirmedCard({ booking }: { booking: BookingInfo }) {
  const [pending, startTransition] = useTransition()
  if (!booking.startsAt || !booking.whenLabel) return null

  const whenLabel = booking.whenLabel

  const handleOpenCalendar = () => {
    if (!booking.calendarUrl) return
    window.open(booking.calendarUrl, "_blank", "noopener,noreferrer")
    if (!booking.calendarEventCreated) {
      startTransition(async () => {
        await markCalendarEventCreatedAction(booking.id)
      })
    }
  }

  return (
    <section className="border rounded-lg p-5 bg-emerald-50 border-emerald-200 mb-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-semibold flex items-center gap-2 text-emerald-900">
            <CalendarCheck className="w-4 h-4" />
            Demo agendada
          </h2>
          <p className="text-sm text-emerald-900 mt-0.5 capitalize">
            {whenLabel}
          </p>
          <p className="text-xs text-emerald-900/70 mt-0.5">
            Con {booking.ownerName}
          </p>
        </div>
        <Button
          onClick={handleOpenCalendar}
          disabled={pending || !booking.calendarUrl}
          className="cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4 mr-1.5" />
          {booking.calendarEventCreated
            ? "Volver a abrir Google Calendar"
            : "Crear evento en Google Calendar"}
        </Button>
      </div>
      <p className="text-xs text-emerald-900/70 mt-3">
        Al apretar el botón abre Google Calendar pre-llenado. Agregá la
        videollamada de Meet desde ahí y guardá. El invitado lo recibe por email.
      </p>
    </section>
  )
}

function ActionGroupRow({
  leadId,
  label,
  purpose,
  disabled,
  disabledReason,
  hasPhone,
}: {
  leadId: string
  label: string
  purpose: MessageTemplatePurpose
  disabled: boolean
  disabledReason?: string
  hasPhone: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap border-b last:border-0 pb-3 last:pb-0">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <CopyButton
          leadId={leadId}
          channel="EMAIL"
          purpose={purpose}
          disabled={disabled}
          disabledReason={disabledReason}
        />
        <CopyButton
          leadId={leadId}
          channel="WHATSAPP"
          purpose={purpose}
          disabled={disabled || !hasPhone}
          disabledReason={
            disabledReason || (!hasPhone ? "Lead sin teléfono cargado" : undefined)
          }
        />
      </div>
    </div>
  )
}

function CopyButton({
  leadId,
  channel,
  purpose,
  disabled,
  disabledReason,
}: {
  leadId: string
  channel: MessageTemplateChannel
  purpose: MessageTemplatePurpose
  disabled?: boolean
  disabledReason?: string
}) {
  const [pending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await resolveTemplateForLeadAction(
          leadId,
          channel,
          purpose
        )
        if (!result.ok) {
          toast.error(result.error)
          return
        }
        const text =
          channel === "EMAIL" && result.subject
            ? `Asunto: ${result.subject}\n\n${result.body}`
            : result.body
        await navigator.clipboard.writeText(text)
        toast.success(
          channel === "EMAIL" ? "Email copiado" : "WhatsApp copiado",
          {
            description: result.waUrl ? (
              <a
                href={result.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline inline-flex items-center gap-1 cursor-pointer"
              >
                Abrir WhatsApp Web
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : undefined,
          }
        )
      } catch (e) {
        console.error(e)
        toast.error("No se pudo copiar")
      }
    })
  }

  const button = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || pending}
      onClick={handleClick}
      className="cursor-pointer"
    >
      {channel === "EMAIL" ? (
        <Mail className="w-3.5 h-3.5 mr-1.5" />
      ) : (
        <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
      )}
      {channel === "EMAIL" ? "Copiar email" : "Copiar WhatsApp"}
    </Button>
  )

  if (disabled && disabledReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0}>{button}</span>
          </TooltipTrigger>
          <TooltipContent>{disabledReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
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
            <span>{a.createdAtLabel}</span>
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
