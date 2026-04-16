// Lista templates activos de la DB como JSON.
// Uso: node .claude/skills/crear-pieza/scripts/list-templates.mjs

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "..", "..", "..", "..", ".env.local") });

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const templates = await prisma.template.findMany({
  where: { isActive: true },
  select: {
    slug: true,
    name: true,
    description: true,
    fields: true,
    costPerImage: true,
    model: true,
    aspectRatio: true,
  },
  orderBy: { createdAt: "asc" },
});

console.log(JSON.stringify(templates, null, 2));
await prisma.$disconnect();
