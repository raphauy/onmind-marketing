/**
 * Test programático del template `testimonio-destacado` usando Satori.
 *
 * Renderiza los 5 testimonios reales de agentes (ver testimonials-carousel.tsx)
 * con frases destacadas entre ==...==. Output en output/comparativas/.
 *
 * Uso:
 *   npx tsx scripts/test-testimonio-destacado.ts
 */

import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"
import { renderTestimonioDestacado } from "../src/lib/renderers/testimonio-destacado"

const ROOT = process.cwd()

const testimonios = [
  {
    name: "Estefanía",
    quote:
      "Me ayudó a ordenar mi base de clientes de forma práctica y eficiente y poder tener un mayor control sobre el seguimiento de mi base, ==que no se me escape nada== en mucho menos tiempo del que me llevaba antes y reduciendo al mínimo el margen de error respecto a como lo hacía antes de forma manual.",
  },
  {
    name: "Nicolás A.",
    quote:
      "OnMind me ayudó a organizar y planificar mejor el contacto tanto con clientes como con potenciales clientes, ==simplificando los procesos== y por ende, ==ganando tiempo== para optimizarlos. Lo recomiendo.",
  },
  {
    name: "Jhoan",
    quote:
      "OnMind me parece una herramienta clave para crecer y mantener la calidad de nuestro servicio. Lo que más destaco es ==el seguimiento== y la posibilidad de ==estar más presentes==, algo fundamental en nuestro negocio. Me siento más organizada y enfocada para seguir creciendo.",
  },
  {
    name: "Juan O.",
    quote:
      "El programa me ha sido de gran ayuda en varios aspectos. Me permitió tomar conciencia de la cantidad de contactos que se generan día a día y cuánto se me escapaba antes. Me ayudó a ==evitar que se me escapen oportunidades==; puedo trabajar mis contactos y evaluar qué hacer con cada uno. Me permitió ==mantener una relación con cada cliente== que de otro modo, no hubiera logrado.",
  },
  {
    name: "Vero D.",
    quote:
      "Me simplificó muchísimo la forma de trabajar con mis clientes. Tengo mi base de contactos más ordenada, puedo segmentar y definir acciones según cada tipo de cliente, y ==mantenerme presente con seguimientos y fechas importantes==. Trabajo ==más organizada, más cerca de mis clientes== y con una estrategia mucho más clara.",
  },
]

async function main() {
  const timestamp = new Date()
    .toISOString()
    .slice(0, 16)
    .replace(/[T:]/g, "-")
  const outputDir = join(
    ROOT,
    "output",
    "comparativas",
    `testimonio-destacado-${timestamp}`
  )
  mkdirSync(outputDir, { recursive: true })

  console.log("=".repeat(60))
  console.log("Test template: testimonio-destacado (Satori)")
  console.log("=".repeat(60))

  for (const t of testimonios) {
    const startTime = Date.now()
    const png = await renderTestimonioDestacado({
      quote: t.quote,
      name: t.name,
    })
    const durationMs = Date.now() - startTime

    const safeName = t.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const outFile = join(outputDir, `${safeName}.png`)
    writeFileSync(outFile, png)

    console.log(
      `✅ ${t.name.padEnd(12)}  ${(png.length / 1024)
        .toFixed(0)
        .padStart(4)} KB  ${String(durationMs).padStart(4)} ms`
    )
  }

  console.log(`\n📂 ${outputDir}`)
}

main().catch((err) => {
  console.error("❌", err)
  process.exit(1)
})
