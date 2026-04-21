// Resumen del estado de contenido de Instagram:
// - Próximas publicaciones programadas
// - Últimas publicaciones realizadas
// - Piezas en curso (DRAFT / GENERATED / APPROVED)
// - Distribución de pilares en últimas 4 semanas vs target
// - Sugerencia del próximo pilar
//
// Uso: npx tsx scripts/content-status.ts
//      npx tsx scripts/content-status.ts --json   (salida JSON, para consumo programático)

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

neonConfig.webSocketConstructor = ws as unknown as typeof WebSocket;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Target de distribución de pilares (docs/planes/instagram/onmind-instagram-estrategia-2026-04-10.md)
const PILLAR_TARGET: Record<string, number> = {
  educacion: 0.4,
  dolor: 0.3,
  producto: 0.2,
  detras_de_escena: 0.1,
};

const PILLAR_LABEL: Record<string, string> = {
  educacion: "Educación",
  dolor: "Dolor",
  producto: "Producto",
  detras_de_escena: "Detrás de escena",
};

type PieceLite = {
  slug: string;
  pillar: string | null;
  topic: string | null;
  status: string;
  createdAt: Date;
  template: { slug: string; name: string };
};

type PublicationLite = {
  id: string;
  platform: string;
  status: string;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  piece: PieceLite;
};

function fmtDate(d: Date | null): string {
  if (!d) return "—";
  return d.toISOString().slice(0, 16).replace("T", " ");
}

function relativeDays(d: Date): string {
  const diffMs = d.getTime() - Date.now();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "hoy";
  if (days === 1) return "mañana";
  if (days === -1) return "ayer";
  if (days > 0) return `en ${days}d`;
  return `hace ${-days}d`;
}

async function collect() {
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

  const pieceInclude = {
    template: { select: { slug: true, name: true } },
  } as const;

  // 1. Scheduled: programadas a futuro
  const scheduled = (await prisma.publication.findMany({
    where: {
      status: "PENDING",
      scheduledAt: { gte: now },
    },
    orderBy: { scheduledAt: "asc" },
    include: { piece: { include: pieceInclude } },
  })) as unknown as PublicationLite[];

  // 2. Published: últimas 10 realizadas
  const published = (await prisma.publication.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 10,
    include: { piece: { include: pieceInclude } },
  })) as unknown as PublicationLite[];

  // 3. Piezas en pipeline (sin publicación o con pub pendiente, no publicadas aún)
  const pipeline = (await prisma.piece.findMany({
    where: {
      deletedAt: null,
      status: { in: ["DRAFT", "GENERATING", "GENERATED", "APPROVED", "SCHEDULED", "FAILED"] },
    },
    orderBy: { createdAt: "desc" },
    include: pieceInclude,
  })) as unknown as PieceLite[];

  // 4. Distribución por pilar en últimas 4 semanas (publicadas + programadas a futuro)
  const recentPublications = (await prisma.publication.findMany({
    where: {
      OR: [
        { status: "PUBLISHED", publishedAt: { gte: fourWeeksAgo } },
        { status: "PENDING", scheduledAt: { gte: now } },
      ],
    },
    include: { piece: { include: pieceInclude } },
  })) as unknown as PublicationLite[];

  const pillarCounts: Record<string, number> = {
    educacion: 0,
    dolor: 0,
    producto: 0,
    detras_de_escena: 0,
    sin_pilar: 0,
  };
  for (const pub of recentPublications) {
    const key = pub.piece.pillar ?? "sin_pilar";
    pillarCounts[key] = (pillarCounts[key] ?? 0) + 1;
  }

  return { scheduled, published, pipeline, pillarCounts, fourWeeksAgo, now };
}

function computePillarSuggestion(counts: Record<string, number>): {
  pillar: string;
  reason: string;
  breakdown: { pillar: string; actual: number; target: number; gap: number; pct: number }[];
} {
  const total = Object.entries(counts)
    .filter(([k]) => k !== "sin_pilar")
    .reduce((s, [, v]) => s + v, 0);

  const breakdown = Object.keys(PILLAR_TARGET).map((p) => {
    const actual = counts[p] ?? 0;
    const pct = total === 0 ? 0 : actual / total;
    const target = PILLAR_TARGET[p];
    return { pillar: p, actual, target, gap: target - pct, pct };
  });

  // Mayor gap positivo = más atrasado respecto al target
  const sorted = [...breakdown].sort((a, b) => b.gap - a.gap);
  const pick = sorted[0];
  const reason =
    total === 0
      ? "Sin historial reciente — arrancar con Educación (pilar de mayor peso: 40%)."
      : `${PILLAR_LABEL[pick.pillar]} está ${(pick.gap * 100).toFixed(0)} pts por debajo del target (${(pick.pct * 100).toFixed(0)}% real vs ${(pick.target * 100).toFixed(0)}% target).`;

  return {
    pillar: total === 0 ? "educacion" : pick.pillar,
    reason,
    breakdown,
  };
}

function pillarToTemplates(pillar: string): string[] {
  // Recomendación de templates por pilar (derivado de list-templates descriptions)
  switch (pillar) {
    case "educacion":
      return ["headline", "stat-surround", "whatsapp-conversation"];
    case "dolor":
      return ["carta-fundador", "headline", "us-vs-them"];
    case "producto":
      return ["features-pointout", "us-vs-them", "whatsapp-conversation"];
    case "detras_de_escena":
      return ["carta-fundador", "headline", "whatsapp-conversation"];
    default:
      return ["headline"];
  }
}

function renderText(data: Awaited<ReturnType<typeof collect>>, suggestion: ReturnType<typeof computePillarSuggestion>) {
  const lines: string[] = [];

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("  ESTADO DE CONTENIDO — Instagram @OnMindApp");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("");

  // Scheduled
  lines.push(`📅 PROGRAMADAS (${data.scheduled.length})`);
  if (data.scheduled.length === 0) {
    lines.push("   (ninguna — pipeline vacío hacia adelante)");
  } else {
    for (const p of data.scheduled) {
      const when = fmtDate(p.scheduledAt);
      const rel = p.scheduledAt ? ` (${relativeDays(p.scheduledAt)})` : "";
      const pillar = p.piece.pillar ? PILLAR_LABEL[p.piece.pillar] ?? p.piece.pillar : "—";
      lines.push(`   ${when}${rel}  [${pillar}]  ${p.piece.topic ?? p.piece.slug}`);
    }
  }
  lines.push("");

  // Published (últimas)
  lines.push(`✅ ÚLTIMAS PUBLICADAS (${data.published.length})`);
  if (data.published.length === 0) {
    lines.push("   (ninguna)");
  } else {
    for (const p of data.published) {
      const when = fmtDate(p.publishedAt);
      const rel = p.publishedAt ? ` (${relativeDays(p.publishedAt)})` : "";
      const pillar = p.piece.pillar ? PILLAR_LABEL[p.piece.pillar] ?? p.piece.pillar : "—";
      lines.push(`   ${when}${rel}  [${pillar}]  ${p.piece.topic ?? p.piece.slug}`);
    }
  }
  lines.push("");

  // Pipeline
  lines.push(`🛠  PIEZAS EN PIPELINE (${data.pipeline.length})`);
  if (data.pipeline.length === 0) {
    lines.push("   (ninguna)");
  } else {
    for (const p of data.pipeline) {
      const pillar = p.pillar ? PILLAR_LABEL[p.pillar] ?? p.pillar : "—";
      lines.push(`   [${p.status}]  [${pillar}]  ${p.topic ?? "(sin tema)"}  — ${p.slug}`);
    }
  }
  lines.push("");

  // Distribución de pilares
  lines.push("📊 DISTRIBUCIÓN DE PILARES (últimas 4 semanas + programadas)");
  const total = suggestion.breakdown.reduce((s, b) => s + b.actual, 0);
  if (total === 0) {
    lines.push("   (sin datos en el rango)");
  } else {
    for (const b of suggestion.breakdown) {
      const actualPct = (b.pct * 100).toFixed(0).padStart(3);
      const targetPct = (b.target * 100).toFixed(0).padStart(3);
      const label = (PILLAR_LABEL[b.pillar] ?? b.pillar).padEnd(18);
      lines.push(`   ${label} ${b.actual} posts  ·  ${actualPct}% real  vs  ${targetPct}% target`);
    }
  }
  lines.push("");

  // Sugerencia
  lines.push("🎯 SUGERENCIA DE PRÓXIMO POST");
  lines.push(`   Pilar: ${PILLAR_LABEL[suggestion.pillar] ?? suggestion.pillar}`);
  lines.push(`   Razón: ${suggestion.reason}`);
  lines.push(`   Templates recomendados: ${pillarToTemplates(suggestion.pillar).join(", ")}`);
  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  return lines.join("\n");
}

async function main() {
  const asJson = process.argv.includes("--json");

  const data = await collect();
  const suggestion = computePillarSuggestion(data.pillarCounts);

  if (asJson) {
    const output = {
      now: data.now.toISOString(),
      scheduled: data.scheduled.map((p) => ({
        scheduledAt: p.scheduledAt,
        pillar: p.piece.pillar,
        topic: p.piece.topic,
        slug: p.piece.slug,
        template: p.piece.template.slug,
      })),
      published: data.published.map((p) => ({
        publishedAt: p.publishedAt,
        pillar: p.piece.pillar,
        topic: p.piece.topic,
        slug: p.piece.slug,
        template: p.piece.template.slug,
      })),
      pipeline: data.pipeline.map((p) => ({
        status: p.status,
        pillar: p.pillar,
        topic: p.topic,
        slug: p.slug,
        template: p.template.slug,
      })),
      pillarDistribution: suggestion.breakdown,
      suggestion: {
        pillar: suggestion.pillar,
        reason: suggestion.reason,
        recommendedTemplates: pillarToTemplates(suggestion.pillar),
      },
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(renderText(data, suggestion));
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
