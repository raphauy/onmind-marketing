import Link from "next/link"
import { Plus, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getLeads, getLeadStats } from "@/services/lead-service"
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_LABEL,
  LEAD_STATUS_ORDER,
  LeadStatusBadge,
} from "@/components/lead-status-badge"
import { formatInUY } from "@/lib/dates"
import { LeadStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const filterStatus =
    params.status && params.status !== "ALL"
      ? (params.status as LeadStatus)
      : undefined

  const [leads, stats] = await Promise.all([
    getLeads({ status: filterStatus }),
    getLeadStats(),
  ])

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {stats.total} leads en total
          </p>
        </div>
        <Link
          href="/dashboard/leads/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo lead
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Badge
          variant={!filterStatus ? "default" : "secondary"}
          asChild
          className="cursor-pointer h-7 px-3"
        >
          <Link href="/dashboard/leads">Todos ({stats.total})</Link>
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
              <Link href={`/dashboard/leads?status=${status}`}>
                {LEAD_STATUS_LABEL[status]} ({count})
              </Link>
            </Badge>
          )
        })}
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>
            No hay leads
            {filterStatus ? ` en estado "${LEAD_STATUS_LABEL[filterStatus]}"` : ""}.
          </p>
          <Link
            href="/dashboard/leads/nuevo"
            className="text-primary text-sm mt-2 inline-block cursor-pointer"
          >
            Cargar el primero
          </Link>
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
                      href={`/dashboard/leads/${lead.id}`}
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
