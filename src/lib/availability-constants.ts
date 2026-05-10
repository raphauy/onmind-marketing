// Constantes safe-for-client de disponibilidad.
// availability-service.ts (server-only, importa Prisma) las re-exporta.

export const SLOT_MIN = 30 // minutos por slot

// 0=Domingo, 1=Lunes, ..., 6=Sábado (mismo ordenamiento que Date.getDay()).
export const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const

// Orden visual (lunes a domingo).
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/

function parseHHmm(s: string): { h: number; m: number } | null {
  const match = TIME_RE.exec(s)
  if (!match) return null
  return { h: Number(match[1]), m: Number(match[2]) }
}

export function isValidTime(s: string): boolean {
  return parseHHmm(s) !== null
}

export function timeToMinutes(s: string): number {
  const p = parseHHmm(s)!
  return p.h * 60 + p.m
}
