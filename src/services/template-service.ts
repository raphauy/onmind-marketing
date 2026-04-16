import { prisma } from "@/lib/prisma"

export type TemplateField = {
  key: string
  label: string
  type: "text" | "textarea" | "list" | "stat-list" | "conversation"
  required: boolean
  placeholder?: string
}

export async function getTemplates() {
  return prisma.template.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { pieces: true } } },
  })
}

export async function getActiveTemplates() {
  return prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  })
}

export async function getTemplateBySlug(slug: string) {
  return prisma.template.findUnique({ where: { slug } })
}

export async function toggleTemplate(id: string) {
  const template = await prisma.template.findUniqueOrThrow({ where: { id } })
  return prisma.template.update({
    where: { id },
    data: { isActive: !template.isActive },
  })
}
