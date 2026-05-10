import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { differenceInCalendarDays } from "date-fns"
import { getLeadById } from "@/services/lead-service"
import { listOwnerCandidates } from "@/services/lead-assignment-service"
import {
  bookingPublicUrl,
  getBookingByLeadId,
  googleCalendarUrl,
} from "@/services/booking-service"
import { getRulesForUser } from "@/services/availability-service"
import { getActiveFollowUpForLead } from "@/services/lead-followup-service"
import { formatInUY } from "@/lib/dates"
import { LeadDetail } from "./lead-detail"

export const dynamic = "force-dynamic"

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const [lead, ownerCandidates, bookingRaw, activeFollowUp] = await Promise.all([
    getLeadById(id),
    listOwnerCandidates(),
    getBookingByLeadId(id),
    getActiveFollowUpForLead(id),
  ])

  if (!lead) notFound()

  // Saber si el owner del lead tiene plantilla semanal configurada.
  // Si no, el botón "Generar link" se deshabilita con mensaje.
  const ownerHasAvailability = lead.ownerUserId
    ? (await getRulesForUser(lead.ownerUserId)).length > 0
    : false

  const from = sp.from === "list" ? "list" : "kanban"
  const backHref =
    from === "list" ? "/dashboard/leads?view=list" : "/dashboard/leads"

  const booking =
    bookingRaw && {
      id: bookingRaw.id,
      status: bookingRaw.status,
      url: bookingPublicUrl(bookingRaw.token),
      startsAt: bookingRaw.startsAt?.toISOString() ?? null,
      endsAt: bookingRaw.endsAt?.toISOString() ?? null,
      whenLabel: bookingRaw.startsAt
        ? formatInUY(bookingRaw.startsAt, "EEEE d 'de' MMMM, HH:mm 'hs'")
        : null,
      ownerName: bookingRaw.owner.name || bookingRaw.owner.email,
      calendarEventCreated: bookingRaw.calendarEventCreated,
      calendarUrl:
        bookingRaw.startsAt && bookingRaw.endsAt
          ? googleCalendarUrl({
              startsAt: bookingRaw.startsAt,
              endsAt: bookingRaw.endsAt,
              leadName: lead.name,
              leadEmail: lead.email,
            })
          : null,
    }

  // Pre-formateo todas las labels de fecha del lead y del timeline para evitar
  // hydration mismatch en client components.
  const serializedLead = {
    ...lead,
    createdAtLabel: formatInUY(lead.createdAt, "d 'de' MMMM, HH:mm 'hs'"),
    trialStartedAtLabel: lead.trialStartedAt
      ? formatInUY(lead.trialStartedAt, "d/M/yy")
      : null,
    activities: lead.activities.map((a) => ({
      ...a,
      createdAtLabel: formatInUY(a.createdAt, "d/M HH:mm"),
    })),
  }

  const followUp = activeFollowUp
    ? {
        id: activeFollowUp.id,
        daysSince: Math.max(
          0,
          differenceInCalendarDays(new Date(), lead.updatedAt)
        ),
      }
    : null

  return (
    <div className="max-w-4xl">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a leads
      </Link>

      <LeadDetail
        lead={serializedLead}
        ownerCandidates={ownerCandidates}
        booking={booking || null}
        ownerHasAvailability={ownerHasAvailability}
        followUp={followUp}
      />
    </div>
  )
}
