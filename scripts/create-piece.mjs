// Crea una pieza creativa en la DB lista para generar.
//
// Uso interactivo (muestra fields del template y pide valores):
//   node scripts/create-piece.mjs --template=headline
//
// Uso directo con JSON:
//   node scripts/create-piece.mjs --template=headline --values='{"headline":"...","subhead":"...","phoneMessage":"..."}'
//
// Opciones:
//   --template=<slug>     Template a usar (requerido)
//   --values='<json>'     Valores de los campos en JSON
//   --pillar=<pilar>      Pilar de contenido (educacion, dolor, producto, detras_de_escena)
//   --topic=<tema>        Tema descriptivo
//   --caption=<texto>     Caption para Instagram
//   --hashtags=<h1,h2>    Hashtags separados por coma

import { prisma } from "./lib/db.mjs";

async function main() {
  const args = process.argv.slice(2);

  const templateSlug = args
    .find((a) => a.startsWith("--template="))
    ?.replace("--template=", "");

  if (!templateSlug) {
    // Listar templates disponibles
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      select: { slug: true, name: true, description: true, costPerImage: true },
    });
    console.log("Templates disponibles:\n");
    for (const t of templates) {
      console.log(`  --template=${t.slug}`);
      console.log(`    ${t.name} ($${t.costPerImage}/imagen)`);
      console.log(`    ${t.description}\n`);
    }
    process.exit(0);
  }

  // Cargar template
  const template = await prisma.template.findUnique({
    where: { slug: templateSlug },
  });

  if (!template) {
    console.error(`Template "${templateSlug}" no encontrado.`);
    process.exit(1);
  }

  // Obtener valores
  const valuesArg = args
    .find((a) => a.startsWith("--values="))
    ?.replace("--values=", "");

  let fieldValues;

  if (valuesArg) {
    fieldValues = JSON.parse(valuesArg);
  } else {
    // Usar placeholders como valores por defecto (para testing rápido)
    const fields = template.fields;
    fieldValues = {};
    console.log(`\nTemplate: ${template.name}`);
    console.log(`Usando placeholders como valores por defecto:\n`);
    for (const field of fields) {
      fieldValues[field.key] = field.placeholder || "";
      console.log(`  ${field.key}: "${field.placeholder}"`);
    }
    console.log("");
  }

  // Validar campos requeridos
  const fields = template.fields;
  const missing = fields
    .filter((f) => f.required && !fieldValues[f.key])
    .map((f) => f.key);

  if (missing.length > 0) {
    console.error(`Campos requeridos faltantes: ${missing.join(", ")}`);
    process.exit(1);
  }

  // Otros parámetros
  const pillar = args
    .find((a) => a.startsWith("--pillar="))
    ?.replace("--pillar=", "");
  const topic = args
    .find((a) => a.startsWith("--topic="))
    ?.replace("--topic=", "");
  const caption = args
    .find((a) => a.startsWith("--caption="))
    ?.replace("--caption=", "");
  const hashtagsArg = args
    .find((a) => a.startsWith("--hashtags="))
    ?.replace("--hashtags=", "");
  const hashtags = hashtagsArg ? hashtagsArg.split(",") : [];

  // Generar slug único
  const timestamp = Date.now().toString(36);
  const slug = `${templateSlug}-${timestamp}`;

  // Crear piece
  const piece = await prisma.piece.create({
    data: {
      slug,
      templateId: template.id,
      pillar,
      topic,
      fieldValues,
      caption,
      hashtags,
      status: "DRAFT",
    },
  });

  console.log(`✅ Piece creada: ${piece.slug} (${piece.id})`);
  console.log(`   Template: ${template.name}`);
  console.log(`   Status: DRAFT`);
  console.log(`   Costo estimado: $${template.costPerImage}`);
  console.log(`\n   Para generar la imagen:`);
  console.log(`   node scripts/generate-piece.mjs --piece=${piece.slug}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
