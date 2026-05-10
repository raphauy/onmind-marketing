import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getLeadById } from "@/services/lead-service"
import { LeadDetail } from "./lead-detail"

export const dynamic = "force-dynamic"

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await getLeadById(id)

  if (!lead) notFound()

  return (
    <div className="max-w-4xl">
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a leads
      </Link>

      <LeadDetail lead={lead} />
    </div>
  )
}
