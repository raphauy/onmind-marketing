// Migra los 9 posts del batch de lanzamiento (hardcodeados en instagram-posts.ts)
// a la nueva estructura de Pieces + Publications.
// Uso: node scripts/migrate-legacy-posts.mjs

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Los 9 posts originales (datos mínimos para migrar)
const legacyPosts = [
  { slug: "01-educacion-escribile-primero", pillar: "educacion", topic: "Escribile primero", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/01-educacion-escribile-primero.png" },
  { slug: "02-producto-conecta-whatsapp", pillar: "producto", topic: "Conectá tu WhatsApp", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/02-producto-conecta-whatsapp.png" },
  { slug: "03-dolor-cumpleanos", pillar: "dolor", topic: "Cumpleaños olvidados", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/03-dolor-cumpleanos.png" },
  { slug: "04-educacion-5-fechas", pillar: "educacion", topic: "5 fechas clave", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/04-educacion-5-fechas.png" },
  { slug: "05-dolor-cerro-con-otro", pillar: "dolor", topic: "Cerró con otro", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/05-dolor-cerro-con-otro.png" },
  { slug: "06-educacion-seguimiento", pillar: "educacion", topic: "Seguimiento sin persecución", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/06-educacion-seguimiento.png" },
  { slug: "07-dolor-vencimiento", pillar: "dolor", topic: "Vencimiento tardío", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/07-dolor-vencimiento.png" },
  { slug: "08-producto-cumpleanos", pillar: "producto", topic: "Cumpleaños automático", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/08-producto-cumpleanos.png" },
  { slug: "09-educacion-vinculo", pillar: "educacion", topic: "El silencio mata el vínculo", blobUrl: "https://xiaqcgfxwuzlizyt.public.blob.vercel-storage.com/instagram/09-educacion-vinculo.png" },
];

async function main() {
  console.log("Migrando 9 posts del batch de lanzamiento...\n");

  // Obtener publicaciones existentes de InstagramPublish
  const published = await prisma.instagramPublish.findMany();
  const publishedMap = new Map(published.map((p) => [p.slug, p]));

  // Necesitamos un template "legacy" para las piezas migradas
  let legacyTemplate = await prisma.template.findUnique({
    where: { slug: "legacy-batch-lanzamiento" },
  });

  if (!legacyTemplate) {
    legacyTemplate = await prisma.template.create({
      data: {
        slug: "legacy-batch-lanzamiento",
        name: "Batch de lanzamiento (legacy)",
        description: "Template placeholder para los 9 posts originales generados con Satori.",
        fields: [
          { key: "titulo", label: "Título", type: "text", required: true },
          { key: "subtexto", label: "Subtexto", type: "text", required: false },
        ],
        promptTemplate: "Legacy — generados con Satori, no con IA.",
        model: "satori",
        costPerImage: 0,
        isActive: false, // No se usa para crear nuevas piezas
      },
    });
    console.log("  ✅ Template legacy creado");
  }

  for (const post of legacyPosts) {
    // Verificar si ya existe
    const existing = await prisma.piece.findUnique({
      where: { slug: post.slug },
    });
    if (existing) {
      console.log(`  ⏭  ${post.slug} — ya existe`);
      continue;
    }

    const pub = publishedMap.get(post.slug);
    const status = pub ? "PUBLISHED" : "APPROVED";

    // Crear Piece
    const piece = await prisma.piece.create({
      data: {
        slug: post.slug,
        templateId: legacyTemplate.id,
        pillar: post.pillar,
        topic: post.topic,
        fieldValues: { titulo: post.topic },
        imageUrl: post.blobUrl,
        status,
        costUsd: 0,
      },
    });

    // Crear Generation (registro de la imagen)
    await prisma.generation.create({
      data: {
        pieceId: piece.id,
        imageUrl: post.blobUrl,
        prompt: "Generated with Satori (legacy batch)",
        model: "satori",
        costUsd: 0,
        durationMs: 0,
        isActive: true,
      },
    });

    // Si fue publicado en IG, crear Publication
    if (pub) {
      await prisma.publication.create({
        data: {
          pieceId: piece.id,
          platform: "instagram",
          platformId: pub.igMediaId,
          publishedAt: pub.publishedAt,
          status: "PUBLISHED",
        },
      });
    }

    console.log(`  ✅ ${post.slug} — ${status}${pub ? " (+ publication)" : ""}`);
  }

  const count = await prisma.piece.count();
  console.log(`\n${count} piezas en total.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
