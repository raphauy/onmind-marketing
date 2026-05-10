import { addHours, format as formatDF, isAfter, startOfHour } from "date-fns"
import { es } from "date-fns/locale"
import { format, toZonedTime } from "date-fns-tz"

export const UY_TZ = "America/Montevideo"

// `toZonedTime` se mantiene exportado para usos puntuales que sí lo necesitan
// (ej. trabajar con componentes de fecha local).
export { toZonedTime }

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
 *
 * Estrategia: `toZonedTime` desplaza el Date para que sus componentes locales
 * (getHours, getDate, etc.) sean los de UY. Después se formatea con
 * `format` de `date-fns` regular, que lee esos componentes directamente sin
 * aplicar conversión TZ propia. Funciona consistentemente entre Node y browser
 * (a diferencia de `format` con option `timeZone` de `date-fns-tz`, que
 * mostró ser inestable en algunos runtimes).
 */
export function formatInUY(date: Date, pattern = "EEEE d 'de' MMMM, HH:mm 'hs'"): string {
  return formatDF(toZonedTime(date, UY_TZ), pattern, { locale: es })
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
  const zoned = toZonedTime(scheduledAt, UY_TZ)
  const scheduledDayStr = format(scheduledAt, "yyyy-MM-dd", { timeZone: UY_TZ })
  const todayStr = format(new Date(), "yyyy-MM-dd", { timeZone: UY_TZ })
  const diffDays = Math.round(
    (new Date(`${scheduledDayStr}T00:00:00Z`).getTime() -
      new Date(`${todayStr}T00:00:00Z`).getTime()) /
      86_400_000,
  )
  const hour = format(zoned, "H", { timeZone: UY_TZ })
  if (diffDays <= 0) return `Hoy ${hour}h`
  if (diffDays === 1) return `Mañana ${hour}h`
  if (diffDays <= 6) {
    const weekday = format(zoned, "EEEE", { timeZone: UY_TZ, locale: es })
    return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${hour}h`
  }
  return format(zoned, "d/M", { timeZone: UY_TZ })
}
