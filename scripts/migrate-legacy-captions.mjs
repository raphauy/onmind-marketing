// Actualiza las piezas legacy con captions y hashtags.
// Uso: node scripts/migrate-legacy-captions.mjs

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", ".env.local") });

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Parsear captions del archivo TS original
const content = readFileSync(join(__dirname, "..", "src/lib/instagram-posts.ts"), "utf-8");
const re = /slug:\s*"([^"]+)"[\s\S]*?caption:\s*`([\s\S]*?)`,\s*\n\s*hashtags:\s*\[([\s\S]*?)\]/g;
const posts = [];
let m;
while ((m = re.exec(content))) {
  const hashtags = m[3].match(/"[^"]+"/g)?.map((h) => h.replace(/"/g, "")) || [];
  posts.push({ slug: m[1], caption: m[2], hashtags });
}

console.log(`Encontrados ${posts.length} posts con captions.\n`);

for (const post of posts) {
  const piece = await prisma.piece.findUnique({ where: { slug: post.slug } });
  if (!piece) {
    console.log(`  ⏭  ${post.slug} — no encontrada`);
    continue;
  }
  await prisma.piece.update({
    where: { slug: post.slug },
    data: { caption: post.caption, hashtags: post.hashtags },
  });
  console.log(`  ✅ ${post.slug} — caption (${post.caption.length} chars) + ${post.hashtags.length} hashtags`);
}

await prisma.$disconnect();
