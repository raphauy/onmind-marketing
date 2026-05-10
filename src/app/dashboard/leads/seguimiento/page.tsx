import Link from "next/link"
import { differenceInCalendarDays } from "date-fns"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { listPendingFollowUps } from "@/services/lead-followup-service"
import {
  LEAD_STATUS_LABEL,
  LeadStatusBadge,
} from "@/components/lead-status-badge"
import { FollowUpRowActions } from "./row-actions"

export const dynamic = "force-dynamic"

type Filter = "mine" | "all"

export default async function SeguimientoPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const session = await auth()
  const sp = await searchParams
  const filter: Filter = sp.filter === "all" ? "all" : "mine"

  const ownerUserId =
    filter === "mine" ? session?.user?.id || null : undefined

  const followUps = await listPendingFollowUps({ ownerUserId })

  const now = new Date()

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Necesitan seguimiento</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Leads que se enfriaron en algún estado del pipeline. Volvé a
          contactarlos y marcá la fila como hecho cuando los retomes.
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Badge
          variant={filter === "mine" ? "default" : "secondary"}
          asChild
          className="cursor-pointer h-7 px-3"
        >
          <Link href="/dashboard/leads/seguimiento">Míos</Link>
        </Badge>
        <Badge
          variant={filter === "all" ? "default" : "secondary"}
          asChild
          className="cursor-pointer h-7 px-3"
        >
          <Link href="/dashboard/leads/seguimiento?filter=all">Todos</Link>
        </Badge>
      </div>

      {followUps.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Nada pendiente. Buen seguimiento.</p>
        </div>
      ) : (
        <ul className="border rounded-lg bg-white divide-y">
          {followUps.map((fu) => {
            const daysSince = differenceInCalendarDays(
              now,
              fu.lead.updatedAt
            )
            return (
              <li
                key={fu.id}
                className="px-4 py-3 flex items-start justify-between gap-3 flex-wrap"
              >
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/leads/${fu.leadId}`}
                    className="font-medium hover:text-primary cursor-pointer"
                  >
                    {fu.lead.name}
                  </Link>
                  <div className="flex items-center gap-2 flex-wrap mt-1 text-xs text-muted-foreground">
                    <LeadStatusBadge status={fu.triggerState} />
                    <span>·</span>
                    <span className="text-amber-700 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {daysSince} días sin movimiento
                    </span>
                    {fu.lead.owner && (
                      <>
                        <span>·</span>
                        <span>
                          Owner:{" "}
                          {fu.lead.owner.name || fu.lead.owner.email}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <FollowUpRowActions
                  followUpId={fu.id}
                  leadId={fu.leadId}
                  suggestedTemplate={getSuggestedTemplateLabel(fu.triggerState)}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function getSuggestedTemplateLabel(status: string): string {
  return LEAD_STATUS_LABEL[status as keyof typeof LEAD_STATUS_LABEL] || status
}
