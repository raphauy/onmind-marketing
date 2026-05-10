import { notFound } from "next/navigation"
import { addDays } from "date-fns"
import { CalendarCheck, XCircle } from "lucide-react"
import { OnMindLogo } from "@/components/logo"
import { getBookingByToken } from "@/services/booking-service"
import { computeAvailableSlots } from "@/services/availability-service"
import { formatInUY } from "@/lib/dates"
import { BookingPicker } from "./booking-picker"

export const dynamic = "force-dynamic"

export default async function AgendarPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const booking = await getBookingByToken(token)
  if (!booking) notFound()

  const ownerName = booking.owner.name || booking.owner.email

  if (booking.status === "CANCELLED") {
    return (
      <Shell>
        <Card>
          <header className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <h1 className="text-lg font-semibold">Link no disponible</h1>
          </header>
          <p className="text-sm text-muted-foreground">
            Este link de booking fue cancelado. Si necesitás coordinar la demo,
            escribinos directamente y te pasamos uno nuevo.
          </p>
        </Card>
      </Shell>
    )
  }

  if (booking.status === "CONFIRMED" && booking.startsAt) {
    const whenLabel = formatInUY(
      booking.startsAt,
      "EEEE d 'de' MMMM, HH:mm 'hs'"
    )
    return (
      <Shell>
        <Card>
          <header className="flex items-center gap-2 mb-3">
            <CalendarCheck className="w-5 h-5 text-emerald-500" />
            <h1 className="text-lg font-semibold">Demo confirmada</h1>
          </header>
          <p className="text-sm">
            Hola {booking.lead.name}, tu demo con {ownerName} quedó agendada
            para:
          </p>
          <p className="font-medium mt-2 text-base capitalize">{whenLabel}</p>
          <p className="text-sm text-muted-foreground mt-3">
            Te llega un email con el link de Google Meet en los próximos minutos.
            Cualquier consulta, respondé el mensaje original.
          </p>
        </Card>
      </Shell>
    )
  }

  const now = new Date()
  const horizon = addDays(now, 14)
  const slots = await computeAvailableSlots(
    booking.ownerUserId,
    now,
    horizon,
    now
  )

  // Pre-formateamos en server (zona UY) para evitar hydration mismatch:
  // formatear en client usa la TZ del browser y puede no coincidir con server.
  const serializedSlots = slots.map((s) => ({
    startsAt: s.startsAt.toISOString(),
    endsAt: s.endsAt.toISOString(),
    timeLabel: formatInUY(s.startsAt, "HH:mm"),
    dayKey: formatInUY(s.startsAt, "yyyy-MM-dd"),
    dayLabel: formatInUY(s.startsAt, "EEEE d 'de' MMMM"),
    fullLabel: formatInUY(s.startsAt, "EEEE d 'de' MMMM, HH:mm 'hs'"),
  }))

  return (
    <Shell>
      <Card>
        <header className="mb-4">
          <h1 className="text-xl font-semibold">
            Demo de OnMind con {ownerName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hola {booking.lead.name}, elegí el horario que mejor te quede. La
            demo dura unos 20 minutos por Google Meet.
          </p>
        </header>

        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No hay horarios disponibles en los próximos 14 días. Escribinos y
            buscamos otro momento.
          </p>
        ) : (
          <BookingPicker
            token={token}
            slots={serializedSlots}
            ownerName={ownerName}
          />
        )}
      </Card>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-muted/30 flex flex-col">
      <header className="px-6 py-4 border-b bg-white">
        <OnMindLogo className="h-7" color="#007056" />
      </header>
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-xl">{children}</div>
      </main>
      <footer className="px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} OnMind
      </footer>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border rounded-lg p-6 shadow-xs">{children}</div>
}
