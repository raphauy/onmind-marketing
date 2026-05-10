import { Badge } from "@/components/ui/badge"
import { LeadStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  DEMO_SCHEDULED: "Demo agendada",
  DEMO_DONE: "Demo realizada",
  IN_EVALUATION: "En evaluación",
  CUSTOMER: "Cliente",
  LOST: "Perdido",
}

const LEAD_STATUS_COLOR: Record<LeadStatus, string> = {
  NEW: "bg-gray-100 text-gray-700 border-gray-200",
  CONTACTED: "bg-blue-100 text-blue-700 border-blue-200",
  DEMO_SCHEDULED: "bg-purple-100 text-purple-700 border-purple-200",
  DEMO_DONE: "bg-indigo-100 text-indigo-700 border-indigo-200",
  IN_EVALUATION: "bg-amber-100 text-amber-700 border-amber-200",
  CUSTOMER: "bg-emerald-100 text-emerald-700 border-emerald-200",
  LOST: "bg-red-50 text-red-600 border-red-200",
}

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "DEMO_SCHEDULED",
  "DEMO_DONE",
  "IN_EVALUATION",
  "CUSTOMER",
  "LOST",
]

export function LeadStatusBadge({
  status,
  className,
}: {
  status: LeadStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(LEAD_STATUS_COLOR[status], className)}
    >
      {LEAD_STATUS_LABEL[status]}
    </Badge>
  )
}

export const LEAD_SOURCE_LABEL: Record<string, string> = {
  INSTAGRAM: "Instagram",
  WEB: "Web",
  REFERRAL: "Referido",
  OTHER: "Otro",
}
