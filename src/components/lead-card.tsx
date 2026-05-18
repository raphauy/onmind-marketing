import Link from "next/link"
import { Lead } from "@prisma/client"
import { differenceInCalendarDays } from "date-fns"
import { CalendarCheck, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LEAD_SOURCE_LABEL } from "@/components/lead-status-badge"
import { cn } from "@/lib/utils"

const TRIAL_DAYS = 15

export type LeadCardData = Lead & {
  owner: { id: string; name: string | null; email: string } | null
  bookingStartsAtLabel?: string | null
}

function initialsOf(name: string | null, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/).slice(0, 2)
    return parts.map((p) => p[0]?.toUpperCase()).join("")
  }
  return email.slice(0, 2).toUpperCase()
}

function trialCountdown(trialStartedAt: Date | null): string | null {
  if (!trialStartedAt) return null
  const elapsed = differenceInCalendarDays(new Date(), trialStartedAt)
  const remaining = TRIAL_DAYS - elapsed
  if (remaining <= 0) return "Trial finalizado"
  if (remaining === 1) return "1 día restante"
  return `${remaining} días restantes`
}

export function LeadCard({
  lead,
  draggable = false,
  isDragging = false,
  from,
  hasActiveFollowUp = false,
}: {
  lead: LeadCardData
  draggable?: boolean
  isDragging?: boolean
  from?: "list" | "kanban"
  hasActiveFollowUp?: boolean
}) {
  const countdown =
    lead.status === "IN_EVALUATION" ? trialCountdown(lead.trialStartedAt) : null

  const ownerInitials = lead.owner
    ? initialsOf(lead.owner.name, lead.owner.email)
    : null

  const className = cn(
    "relative flex flex-col bg-white border rounded-md px-3 pt-2.5 pb-3 text-sm shadow-xs min-h-[110px]",
    "transition-colors hover:border-primary/30",
    draggable
      ? "cursor-grab active:cursor-grabbing select-none"
      : "cursor-pointer",
    isDragging && "opacity-50 shadow-lg"
  )

  const href = from
    ? `/dashboard/leads/${lead.id}?from=${from}`
    : `/dashboard/leads/${lead.id}`

  return (
    <Link href={href} className={className}>
      {hasActiveFollowUp && (
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"
          title="Necesita seguimiento"
        />
      )}

      <p className="font-medium leading-tight pr-3">{lead.name}</p>

      {lead.businessType && (
        <p className="mt-1 text-[11px] text-muted-foreground truncate">
          {lead.businessType}
        </p>
      )}

      {countdown && (
        <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700">
          <Clock className="w-3 h-3" />
          <span>{countdown}</span>
        </div>
      )}

      {lead.status === "DEMO_SCHEDULED" && lead.bookingStartsAtLabel && (
        <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700">
          <CalendarCheck className="w-3 h-3" />
          <span className="capitalize">{lead.bookingStartsAtLabel}</span>
        </div>
      )}

      <div className="mt-auto pt-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center h-5 px-2 rounded-full bg-muted text-muted-foreground text-[10px] font-medium leading-none">
          {LEAD_SOURCE_LABEL[lead.source] || lead.source}
        </span>
        {ownerInitials && (
          <span
            className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold leading-none"
            title={lead.owner?.name || lead.owner?.email || ""}
          >
            {ownerInitials}
          </span>
        )}
      </div>
    </Link>
  )
}
