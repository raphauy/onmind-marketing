import Link from "next/link"
import { Plus, UserPlus, Kanban, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getLeads, getLeadStats } from "@/services/lead-service"
import { getActiveFollowUpsByLeadIds } from "@/services/lead-followup-service"
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
  LeadStatusBadge,
} from "@/components/lead-status-badge"
import { LeadsKanban } from "@/components/leads-kanban"
import { formatInUY } from "@/lib/dates"
import { cn } from "@/lib/utils"
import { LeadStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

type View = "kanban" | "list"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; view?: string }>
}) {
  const params = await searchParams
  const view: View = params.view === "list" ? "list" : "kanban"

  const filterStatus =
    view === "list" && params.status && params.status !== "ALL"
      ? (params.status as LeadStatus)
      : undefined

  // En kanban siempre traemos todos para distribuirlos en columnas.
  const [leads, stats] = await Promise.all([
    getLeads({ status: view === "list" ? filterStatus : undefined }),
    getLeadStats(),
  ])

  const followUpLeadIds = await getActiveFollowUpsByLeadIds(
    leads.map((l) => l.id)
  )

  const leadsWithLabels = leads.map((l) => ({
    ...l,
    bookingStartsAtLabel: l.booking?.startsAt
      ? formatInUY(l.booking.startsAt, "EEE d MMM, HH:mm 'hs'")
      : null,
  }))

  return (
    <div
      className={cn(
        "flex flex-col flex-1 min-h-0",
        view === "list" && "max-w-6xl"
      )}
    >
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {stats.total} leads en total
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ViewToggle view={view} />
          <Link
            href="/dashboard/leads/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nuevo lead
          </Link>
        </div>
      </div>

      {view === "list" && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <Badge
            variant={!filterStatus ? "default" : "secondary"}
            asChild
            className="cursor-pointer h-7 px-3"
          >
            <Link href="/dashboard/leads?view=list">
              Todos ({stats.total})
            </Link>
          </Badge>
          {LEAD_STATUS_ORDER.map((status) => {
            const count = stats.byStatus[status] || 0
            return (
              <Badge
                key={status}
                variant={filterStatus === status ? "default" : "secondary"}
                asChild
                className="cursor-pointer h-7 px-3"
              >
                <Link href={`/dashboard/leads?view=list&status=${status}`}>
                  {LEAD_STATUS_LABEL[status]} ({count})
                </Link>
              </Badge>
            )
          })}
        </div>
      )}

      {leads.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>
            No hay leads
            {filterStatus
              ? ` en estado "${LEAD_STATUS_LABEL[filterStatus]}"`
              : ""}
            .
          </p>
          <Link
            href="/dashboard/leads/nuevo"
            className="text-primary text-sm mt-2 inline-block cursor-pointer"
          >
            Cargar el primero
          </Link>
        </div>
      ) : view === "kanban" ? (
        <div className="flex-1 min-h-0">
          <LeadsKanban
            initialLeads={leadsWithLabels}
            followUpLeadIds={Array.from(followUpLeadIds)}
          />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2.5">Nombre</th>
                <th className="text-left font-medium px-4 py-2.5">Email</th>
                <th className="text-left font-medium px-4 py-2.5">WhatsApp</th>
                <th className="text-left font-medium px-4 py-2.5">Origen</th>
                <th className="text-left font-medium px-4 py-2.5">Owner</th>
                <th className="text-left font-medium px-4 py-2.5">Estado</th>
                <th className="text-left font-medium px-4 py-2.5">Creado</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/dashboard/leads/${lead.id}?from=list`}
                      className="font-medium text-foreground hover:text-primary cursor-pointer"
                    >
                      {lead.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {lead.email}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {lead.phone || "-"}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {LEAD_SOURCE_LABEL[lead.source] || lead.source}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {lead.owner ? lead.owner.name || lead.owner.email : "-"}
                  </td>
                  <td className="px-4 py-2.5">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">
                    {formatInUY(lead.createdAt, "d/M/yy HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ViewToggle({ view }: { view: View }) {
  return (
    <div className="inline-flex border rounded-md overflow-hidden">
      <Link
        href="/dashboard/leads"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer",
          view === "kanban"
            ? "bg-primary text-white"
            : "bg-white text-muted-foreground hover:bg-muted/50"
        )}
      >
        <Kanban className="w-4 h-4" />
        Kanban
      </Link>
      <Link
        href="/dashboard/leads?view=list"
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border-l cursor-pointer",
          view === "list"
            ? "bg-primary text-white"
            : "bg-white text-muted-foreground hover:bg-muted/50"
        )}
      >
        <List className="w-4 h-4" />
        Lista
      </Link>
    </div>
  )
}
