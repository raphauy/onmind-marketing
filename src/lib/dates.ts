import { addHours, format as formatDF, isAfter, startOfHour } from "date-fns"
import { es } from "date-fns/locale"
import { fromZonedTime } from "date-fns-tz"

export const UY_TZ = "America/Montevideo"

// Reexporto fromZonedTime para construir un Date UTC a partir de una hora local.
// (Lo usa availability-service y otros para interpretar input UY → persistir UTC.)
export { fromZonedTime }

// Cache de Intl.DateTimeFormat (1 sola instancia, no se reinstancia por llamada).
const UY_PARTS_FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: UY_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})

// Devuelve un Date "shifted" donde getFullYear/getMonth/getHours/etc.
// devuelven los componentes locales en UY. NO refleja un instante real:
// es solo un truco para que la API local de Date funcione como si la TZ
// del proceso fuera Montevideo.
//
// Implementado con Intl.DateTimeFormat para máxima estabilidad cross-runtime.
// Sustituye al `toZonedTime` de date-fns-tz, que mostró bugs en Node UTC.
export function toZonedTimeUY(date: Date): Date {
  const parts = UY_PARTS_FMT.formatToParts(date)
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0)
  // hour=24 puede aparecer en algunos runtimes para medianoche; lo normalizamos.
  const hour = get("hour")
  return new Date(
    get("year"),
    get("month") - 1,
    get("day"),
    hour === 24 ? 0 : hour,
    get("minute"),
    get("second")
  )
}

/**
 * Formatea un Date UTC en hora de Uruguay usando locale es.
 *
 * Estrategia: shifteamos el Date a UY con `toZonedTimeUY` (basado en
 * Intl.DateTimeFormat) y formateamos con `date-fns` regular leyendo los
 * componentes locales del Date shifted. Funciona idéntico en Node, browser
 * y Vercel, sin importar la TZ del proceso.
 */
export function formatInUY(date: Date, pattern = "EEEE d 'de' MMMM, HH:mm 'hs'"): string {
  return formatDF(toZonedTimeUY(date), pattern, { locale: es })
}

/**
 * Combina una fecha (Calendar → hora local 00:00) con una hora entera (0-23)
 * en la timezone del navegador. Devuelve un Date que al serializar con
 * toISOString() queda en UTC correcto.
 *
 * Ejemplo: UY (UTC-3), fecha 19/4, hora 19 → 2026-04-19T22:00:00.000Z
 */
export function composeLocalDateTime(date: Date, hour: number): Date {
  const d = new Date(date)
  d.setHours(hour, 0, 0, 0)
  return d
}

/**
 * Fecha/hora mínima para programar una publicación: próxima hora en punto
 * estrictamente mayor a ahora (en UTC, que es como se comparará).
 */
export function minScheduleDate(): Date {
  return addHours(startOfHour(new Date()), 1)
}

export function isValidSchedule(scheduledAt: Date): boolean {
  return (
    isAfter(scheduledAt, new Date()) &&
    scheduledAt.getMinutes() === 0 &&
    scheduledAt.getSeconds() === 0
  )
}

/**
 * Badge corto para mostrar cuándo está programada una pieza, en hora UY:
 *   - "Hoy 12h" / "Mañana 18h"
 *   - "Miércoles 12h" dentro de los próximos 6 días
 *   - "28/4" de ahí en adelante (sin año, sin hora)
 */
export function formatScheduledBadge(scheduledAt: Date): string {
  const zoned = toZonedTimeUY(scheduledAt)
  const todayZoned = toZonedTimeUY(new Date())
  const scheduledDay = formatDF(zoned, "yyyy-MM-dd")
  const todayDay = formatDF(todayZoned, "yyyy-MM-dd")
  const diffDays = Math.round(
    (new Date(`${scheduledDay}T00:00:00Z`).getTime() -
      new Date(`${todayDay}T00:00:00Z`).getTime()) /
      86_400_000
  )
  const hour = formatDF(zoned, "H")
  if (diffDays <= 0) return `Hoy ${hour}h`
  if (diffDays === 1) return `Mañana ${hour}h`
  if (diffDays <= 6) {
    const weekday = formatDF(zoned, "EEEE", { locale: es })
    return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${hour}h`
  }
  return formatDF(zoned, "d/M")
}
