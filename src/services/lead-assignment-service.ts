import { prisma } from "@/lib/prisma"

// Devuelve los usuarios activos ordenados por fecha de creación.
// Para que el round-robin sea determinista entre llamadas.
async function getActiveUsersInOrder() {
  return prisma.user.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true },
  })
}

// Round-robin par/impar estricto.
// - Cuenta los leads totales existentes (incluye los borrables/históricos — no hay soft delete acá).
// - Si el count es par, asigna al primer user; si es impar, al segundo.
// - Si solo hay 1 user activo, devuelve ese.
// - Si no hay users activos, devuelve null (el caller decide qué hacer).
export async function assignNextOwnerId(): Promise<string | null> {
  const [users, leadCount] = await Promise.all([
    getActiveUsersInOrder(),
    prisma.lead.count(),
  ])

  if (users.length === 0) return null
  if (users.length === 1) return users[0].id

  const idx = leadCount % users.length
  return users[idx].id
}

// Lista de usuarios disponibles para el selector de owner del detail.
export async function listOwnerCandidates() {
  return getActiveUsersInOrder()
}
