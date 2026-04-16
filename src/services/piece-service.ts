import { prisma } from "@/lib/prisma"
import { PieceStatus } from "@prisma/client"

export type PieceFilters = {
  status?: PieceStatus
  pillar?: string
  templateId?: string
  deleted?: boolean
}

export async function getPieces(filters?: PieceFilters) {
  return prisma.piece.findMany({
    where: {
      ...(filters?.deleted ? { deletedAt: { not: null } } : { deletedAt: null }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.pillar && { pillar: filters.pillar }),
      ...(filters?.templateId && { templateId: filters.templateId }),
    },
    include: {
      template: { select: { name: true, slug: true, costPerImage: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getPieceBySlug(slug: string) {
  return prisma.piece.findUnique({
    where: { slug },
    include: {
      template: true,
      generations: { orderBy: { createdAt: "desc" } },
      publications: { orderBy: { createdAt: "desc" } },
      deletedBy: { select: { name: true, email: true } },
    },
  })
}

export async function getPieceStats() {
  const [counts, costResult, deletedCount] = await Promise.all([
    prisma.piece.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    }),
    prisma.piece.aggregate({
      where: { deletedAt: null },
      _sum: { costUsd: true },
      _count: true,
    }),
    prisma.piece.count({ where: { deletedAt: { not: null } } }),
  ])

  const byStatus = Object.fromEntries(
    counts.map((c) => [c.status, c._count])
  ) as Record<string, number>

  return {
    total: costResult._count,
    totalCost: costResult._sum.costUsd ?? 0,
    byStatus,
    deleted: deletedCount,
  }
}

export async function createPiece(data: {
  templateId: string
  fieldValues: Record<string, string>
  pillar?: string
  topic?: string
  caption?: string
  hashtags?: string[]
}) {
  const template = await prisma.template.findUniqueOrThrow({
    where: { id: data.templateId },
  })

  const timestamp = Date.now().toString(36)
  const slug = `${template.slug}-${timestamp}`

  return prisma.piece.create({
    data: {
      slug,
      templateId: data.templateId,
      fieldValues: data.fieldValues,
      pillar: data.pillar || null,
      topic: data.topic || null,
      caption: data.caption || null,
      hashtags: data.hashtags ?? [],
      status: "DRAFT",
    },
  })
}

export async function updatePieceStatus(id: string, status: PieceStatus) {
  return prisma.piece.update({
    where: { id },
    data: { status },
  })
}

export async function updatePieceCaption(
  id: string,
  caption: string,
  hashtags: string[]
) {
  return prisma.piece.update({
    where: { id },
    data: { caption, hashtags },
  })
}

export async function updatePiece(
  id: string,
  data: {
    fieldValues?: Record<string, string>
    pillar?: string | null
    topic?: string | null
    caption?: string | null
    hashtags?: string[]
  }
) {
  return prisma.piece.update({ where: { id }, data })
}

export async function softDeletePiece(id: string, deletedById?: string) {
  return prisma.piece.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      ...(deletedById && { deletedById }),
    },
  })
}

export async function restorePiece(id: string) {
  return prisma.piece.update({
    where: { id },
    data: { deletedAt: null, deletedById: null },
  })
}

export async function setActiveGeneration(pieceId: string, generationId: string) {
  const generation = await prisma.generation.findUniqueOrThrow({
    where: { id: generationId, pieceId },
  })

  await prisma.generation.updateMany({
    where: { pieceId, isActive: true },
    data: { isActive: false },
  })

  await prisma.generation.update({
    where: { id: generationId },
    data: { isActive: true },
  })

  await prisma.piece.update({
    where: { id: pieceId },
    data: { imageUrl: generation.imageUrl },
  })
}

export async function getPublishedAndScheduledPieces() {
  const pieces = await prisma.piece.findMany({
    where: {
      OR: [
        { status: "PUBLISHED" },
        { status: "SCHEDULED" },
        { status: "APPROVED" },
      ],
      imageUrl: { not: null },
      deletedAt: null,
    },
    include: {
      template: { select: { name: true, slug: true } },
      publications: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  // Sin publicación → arriba. Con publicación → por fecha de publicación desc (más reciente primero)
  return pieces.sort((a, b) => {
    const aPubDate = a.publications[0]?.publishedAt?.getTime()
    const bPubDate = b.publications[0]?.publishedAt?.getTime()
    if (!aPubDate && !bPubDate) return 0
    if (!aPubDate) return -1
    if (!bPubDate) return 1
    return bPubDate - aPubDate
  })
}
