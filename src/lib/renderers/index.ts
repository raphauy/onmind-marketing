import { renderBoldStatement } from "./bold-statement"
import { renderCartaFundador } from "./carta-fundador"
import { renderTestimonioDestacado } from "./testimonio-destacado"

// Registry de renderers programáticos (Satori).
// Key = Template.slug. Value = función que toma los fieldValues y devuelve un PNG Buffer
// listo para logo overlay (1080px de ancho, aspect ratio del template).
export const satoriRenderers: Record<
  string,
  (fieldValues: Record<string, string>) => Promise<Buffer>
> = {
  "bold-statement": renderBoldStatement,
  "carta-fundador": renderCartaFundador,
  "testimonio-destacado": renderTestimonioDestacado,
}

export function getSatoriRenderer(slug: string) {
  const renderer = satoriRenderers[slug]
  if (!renderer) {
    throw new Error(
      `No hay renderer Satori registrado para el template "${slug}". ` +
        `Agregalo en src/lib/renderers/index.ts.`
    )
  }
  return renderer
}
