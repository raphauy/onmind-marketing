import { addHours, isAfter, startOfHour } from "date-fns"
import { es } from "date-fns/locale"
import { format, toZonedTime } from "date-fns-tz"

export const UY_TZ = "America/Montevideo"

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
 * Formatea un Date UTC en hora de Uruguay usando locale es.
 * Display consistente para cualquier navegador del mundo.
 */
export function formatInUY(date: Date, pattern = "EEEE d 'de' MMMM, HH:mm 'hs'"): string {
  return format(toZonedTime(date, UY_TZ), pattern, { timeZone: UY_TZ, locale: es })
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
