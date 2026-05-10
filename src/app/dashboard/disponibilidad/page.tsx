import { redirect } from "next/navigation"
import { addDays } from "date-fns"
import { auth } from "@/lib/auth"
import {
  getBlocksForUser,
  getRulesForUser,
} from "@/services/availability-service"
import { formatInUY } from "@/lib/dates"
import { AvailabilityEditor } from "./availability-editor"

export const dynamic = "force-dynamic"

export default async function DisponibilidadPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const now = new Date()
  const horizon = addDays(now, 60)

  const [rules, blocks] = await Promise.all([
    getRulesForUser(session.user.id),
    getBlocksForUser(session.user.id, { from: now, to: horizon }),
  ])

  // Pre-formateo labels en hora UY para evitar hydration mismatch al renderizar dates en client.
  const serializedBlocks = blocks.map((b) => ({
    id: b.id,
    startsAt: b.startsAt.toISOString(),
    endsAt: b.endsAt.toISOString(),
    reason: b.reason,
    dateLabel: formatInUY(b.startsAt, "EEE d 'de' MMM"),
    timeLabel: `${formatInUY(b.startsAt, "HH:mm")} a ${formatInUY(b.endsAt, "HH:mm")}`,
  }))

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">Mi disponibilidad</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Configurá los días y horarios en los que podés tomar demos. Los slots se
        generan en bloques de 30 minutos. Las horas son en zona Montevideo.
      </p>

      <AvailabilityEditor rules={rules} blocks={serializedBlocks} />
    </div>
  )
}
