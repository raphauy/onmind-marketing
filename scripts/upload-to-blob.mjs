import { put } from "@vercel/blob";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

config({ path: join(ROOT, ".env.local") });

const POSTS_DIR = join(ROOT, "output/pendientes");

const files = readdirSync(POSTS_DIR)
  .filter((f) => /^\d{2}-/.test(f) && f.endsWith(".png"))
  .sort();

if (files.length === 0) {
  console.log("No se encontraron imágenes en output/pendientes/");
  process.exit(1);
}

console.log(`Subiendo ${files.length} imágenes a Vercel Blob...\n`);

const results = {};

for (const file of files) {
  const slug = file.replace(".png", "");
  const buffer = readFileSync(join(POSTS_DIR, file));

  const { url } = await put(`instagram/${slug}.png`, buffer, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
  });

  results[slug] = url;
  console.log(`✓ ${slug} → ${url}`);
}

console.log("\n--- URLs para instagram-posts.ts ---\n");
for (const [slug, url] of Object.entries(results)) {
  console.log(`"${slug}": "${url}",`);
}
