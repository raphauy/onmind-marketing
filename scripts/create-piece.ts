// Crea una pieza creativa en la DB lista para generar.
//
// Uso interactivo (muestra fields del template y pide valores):
//   npx tsx scripts/create-piece.ts --template=headline
//
// Uso directo con JSON:
//   npx tsx scripts/create-piece.ts --template=headline --values='{"headline":"...","subhead":"...","phoneMessage":"..."}'
//
// Opciones:
//   --template=<slug>     Template a usar (requerido)
//   --values='<json>'     Valores de los campos en JSON
//   --pillar=<pilar>      Pilar de contenido (educacion, dolor, producto, detras_de_escena)
//   --topic=<tema>        Tema descriptivo
//   --caption=<texto>     Caption para Instagram
//   --hashtags=<h1,h2>    Hashtags separados por coma

import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"
import dotenv from "dotenv"
import { join } from "path"

dotenv.config({ path: join(process.cwd(), ".env.local") })
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

type TemplateField = {
  key: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
}

async function main() {
  const args = process.argv.slice(2)

  const templateSlug = args
    .find((a) => a.startsWith("--template="))
    ?.replace("--template=", "")

  if (!templateSlug) {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        name: true,
        description: true,
        costPerImage: true,
        renderer: true,
      },
    })
    console.log("Templates disponibles:\n")
    for (const t of templates) {
      const costLabel = t.renderer === "SATORI" ? "programático, $0" : `$${t.costPerImage}/imagen`
      console.log(`  --template=${t.slug}`)
      console.log(`    ${t.name} (${costLabel})`)
      console.log(`    ${t.description}\n`)
    }
    return
  }

  const template = await prisma.template.findUnique({
    where: { slug: templateSlug },
  })

  if (!template) {
    console.error(`Template "${templateSlug}" no encontrado.`)
    process.exit(1)
  }

  const valuesArg = args
    .find((a) => a.startsWith("--values="))
    ?.replace("--values=", "")

  const fields = template.fields as TemplateField[]
  let fieldValues: Record<string, string>

  if (valuesArg) {
    fieldValues = JSON.parse(valuesArg)
  } else {
    fieldValues = {}
    console.log(`\nTemplate: ${template.name}`)
    console.log(`Usando placeholders como valores por defecto:\n`)
    for (const field of fields) {
      fieldValues[field.key] = field.placeholder || ""
      console.log(`  ${field.key}: "${field.placeholder}"`)
    }
    console.log("")
  }

  const missing = fields
    .filter((f) => f.required && !fieldValues[f.key])
    .map((f) => f.key)

  if (missing.length > 0) {
    console.error(`Campos requeridos faltantes: ${missing.join(", ")}`)
    process.exit(1)
  }

  const pillar = args.find((a) => a.startsWith("--pillar="))?.replace("--pillar=", "")
  const topic = args.find((a) => a.startsWith("--topic="))?.replace("--topic=", "")
  const caption = args.find((a) => a.startsWith("--caption="))?.replace("--caption=", "")
  const hashtagsArg = args.find((a) => a.startsWith("--hashtags="))?.replace("--hashtags=", "")
  const hashtags = hashtagsArg ? hashtagsArg.split(",") : []

  const timestamp = Date.now().toString(36)
  const slug = `${templateSlug}-${timestamp}`

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
  })

  const costLabel = template.renderer === "SATORI" ? "$0 (programático)" : `$${template.costPerImage}`
  console.log(`✅ Piece creada: ${piece.slug} (${piece.id})`)
  console.log(`   Template: ${template.name}`)
  console.log(`   Renderer: ${template.renderer}`)
  console.log(`   Status: DRAFT`)
  console.log(`   Costo estimado: ${costLabel}`)
  console.log(`\n   Para generar la imagen:`)
  console.log(`   npx tsx scripts/generate-piece.ts --piece=${piece.slug}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
