# Convenciones para crear un template nuevo

Referencia técnica del motor de contenido. Lee esto **junto con** la guía de marca y el SKILL.md.

## Anatomía de un template

Un template vive como fila en la tabla `Template` (Prisma) y es sembrado desde `scripts/seed-templates.mjs`. Columnas que importan para diseñarlo:

| Campo | Qué es | Cómo decidir |
|---|---|---|
| `slug` | Identificador único, kebab-case | Sustantivo corto, no prefijar con "template-". Ej: `headline`, `us-vs-them`, `carta-fundador` |
| `name` | Nombre humano para UI | Corto y descriptivo. Ej: "Carta del fundador / Manifiesto" |
| `description` | Para el creativo (vos, Claude en `/crear-pieza`) | Qué produce + cuándo usarlo + tipo de pilar |
| `renderer` | `LLM` o `SATORI` | Ver heurística abajo |
| `fields` | Array JSON de campos que el creativo debe llenar | Ver estructura abajo |
| `promptTemplate` | Prompt completo para el modelo (solo LLM) | `null` para SATORI |
| `model` | Modelo de OpenRouter (solo LLM) | `null` para SATORI |
| `costPerImage` | USD por imagen generada | Ver tabla abajo |
| `darkOverlay` | Si el fondo es oscuro y el logo debe ir blanco | `false` por default (mayoría de piezas) |
| `aspectRatio` | `4:5`, `1:1` o `9:16` | `4:5` default para Instagram feed |
| `isActive` | Si está disponible en `/crear-pieza` | `true` por default |

## Decisión: LLM vs Satori

### Usar **SATORI** cuando

- El contenido es **texto protagonista** (frases, listas, stats, testimonios, citas, manifiestos).
- Necesitás **tipografía pixel-perfect** sin riesgo de alucinación del LLM (los modelos de imagen alucinan typos en español — ej: `estabalan` en vez de `estaban`).
- El diseño es **editorial / minimalista** (fondos lisos, líneas finas, jerarquía tipográfica clara).
- Querés **reproducibilidad total** (misma entrada → mismo pixel).
- El costo marginal importa (volumen alto de piezas baratas).

**Ventajas:** $0 por pieza, <1s de render, texto literal garantizado, control total.
**Costo del diseño:** más trabajo de front al construir el JSX.

### Usar **LLM** cuando

- El template necesita **una foto o escena realista** (persona en acción, lifestyle, flatlay de productos).
- Incluye **una UI realista** (celular con WhatsApp, screenshot de plataforma).
- Tiene **composición multi-elemento** que sería muy complejo de armar en Satori (objetos superpuestos con sombras, collages).
- La variabilidad es un feature (cada generación ligeramente distinta suma interés).

**Modelos disponibles:**
| Modelo | Slug OpenRouter | Costo | Cuándo |
|---|---|---|---|
| Nano Banana 2 (Flash) | `google/gemini-3.1-flash-image-preview` | $0.07 | Default. Rápido, buen ratio calidad/precio |
| Nano Banana Pro | `google/gemini-3-pro-image-preview` | $0.14 | Cuando precisión tipográfica o fidelidad de UI es crítica |

## Estructura de `fields`

Array JSON. Cada campo es:

```json
{
  "key": "headline",
  "label": "Título principal",
  "type": "text",
  "required": true,
  "placeholder": "Tu cliente se olvidó de vos. Vos no te olvides de él."
}
```

- `key`: camelCase, sin espacios. Es lo que aparece como `{{headline}}` en el prompt.
- `label`: en español, corto, claro.
- `type`: `"text"` | `"textarea"` | `"list"` (raro).
- `required`: casi siempre `true`. Solo `false` si el template puede funcionar sin ese campo (ej: subtitle opcional).
- `placeholder`: texto realista **on-brand**, no lorem ipsum. Se usa como default en `create-piece.ts` y como guía visual en la UI.

## Estructura del `promptTemplate` (solo LLM)

Mirá `scripts/seed-templates.mjs` para ejemplos. Patrón:

```
${BRAND_MODIFIER}

Create: [descripción de la pieza en inglés, con formato, colores, composición].

[Detalle sección por sección, usando {{key}} para insertar los valores del creativo.]

${CRITICAL_RULES}
- [reglas específicas de este template]
```

Donde:
- `BRAND_MODIFIER` (constante en seed-templates.mjs) — párrafo de 50-75 palabras con Brand DNA de OnMind.
- `CRITICAL_RULES` (constante) — reglas universales (texto en español literal, sin logos, dejar bottom 80px para overlay).

**Reglas de oro para el prompt LLM:**
- Todo en inglés **excepto** las frases que el modelo debe renderizar (que van entre comillas, tal como las escribió el creativo).
- Agregar siempre: `- "{{headline}}" must appear EXACTLY ONCE. Do NOT repeat or paraphrase.`
- Fotografía: especificar ángulo (ej: "shot at 50mm f/2.8 from slightly above"), luz ("even studio lighting"), mood ("calm confidence").
- Colores: usar hex exactos de la paleta OnMind (#007056 teal, #0A0A0A ink, #FEFEFE white, etc.).
- **Nunca** pedir logos o watermarks en el prompt — el overlay se agrega en post-producción.

## Estructura del renderer Satori

Un archivo por template en `src/lib/renderers/<slug>.ts`. Mirá `carta-fundador.ts` como referencia.

Patrón:

```ts
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import { readFileSync } from "fs"
import { join } from "path"

const ROOT = join(process.cwd(), "public")

const fonts = [
  { name: "Geist", data: readFileSync(join(ROOT, "fonts/Geist-Medium.ttf")), weight: 500 as const, style: "normal" as const },
  // agregá las variantes que uses
]

const WIDTH = 1080
const HEIGHT = 1350  // 4:5. Usar 1080 para 1:1, 1920 para 9:16.

export async function render<NombreEnPascalCase>(
  fieldValues: Record<string, string>
): Promise<Buffer> {
  // validar campos requeridos
  // armar jsx
  const svg = await satori(jsx as Parameters<typeof satori>[0], { width: WIDTH, height: HEIGHT, fonts })
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
  return Buffer.from(resvg.render().asPng())
}
```

Después registrar en `src/lib/renderers/index.ts`:

```ts
import { render<NombrePascal> } from "./<slug>"

export const satoriRenderers: Record<...> = {
  // ...existentes
  "<slug>": render<NombrePascal>,
}
```

**Reglas Satori:**
- Todo layout vive en `display: flex`. Satori es estricto con CSS.
- Cada nodo de texto va en su propio `<div>` para controlar line-break.
- Fonts disponibles en `public/fonts/`: `Geist-Medium.ttf` (500), `Geist-MediumItalic.ttf` (500 italic), `Geist-SemiBold.ttf` (600), `Geist-Bold.ttf` (700). Si necesitás otra, copiala desde `node_modules/geist/dist/fonts/geist-sans/`.
- Paleta: off-white `#FAFAF7`, teal `#007056`, ink `#0A0A0A`, gris body `#2A2A2A`, hairline `#B8B8B0`.
- Bottom 80-100px libre para el logo overlay (no pongas contenido ahí).

## Estructura de `content-status.ts`

Después de crear el template, agregá el slug a `pillarToTemplates()` en `scripts/content-status.ts`:

```ts
case "educacion":
  return ["headline", "stat-surround", "whatsapp-conversation"]
case "dolor":
  return ["carta-fundador", "headline", "us-vs-them", "<nuevo-slug>"]
// etc.
```

El primer slug de cada array es el **más recomendado** para ese pilar. Si tu template nuevo es ideal para un pilar, ponelo primero.

## Costos y defaults

| Template tipo | Renderer | Costo | Aspect | Dark |
|---|---|---|---|---|
| Editorial / texto | Satori | $0 | 4:5 | false |
| Celular + UI | LLM NB2 | $0.07 | 4:5 | false |
| Celular + precisión | LLM NB Pro | $0.14 | 4:5 | false |
| Lifestyle / escena | LLM NB2 | $0.07 | 4:5 | false |

**Nunca poner `costPerImage > 0` para un template SATORI.** El service fuerza costUsd=0 independiente del seed, pero confunde al operador.

## Testing antes del seed

Dos formas:

**Test LLM:** creá `scripts/_test-<slug>.ts` temporal con la misma estructura que `scripts/test-carta-fundador.mjs`, pero en TS. Corré con `npx tsx`. Guardá salida en `output/comparativas/<slug>-<timestamp>/`. Borralo cuando apruebes.

**Test Satori:** podés crear el renderer directo en `src/lib/renderers/` y testearlo con un script temporal que lo invoque — o con un `scripts/_test-<slug>-satori.ts` que arme el JSX inline antes de moverlo al lib.

## Checklist de commit-ready

Antes de cerrar, verificá:

- [ ] Template agregado a `scripts/seed-templates.mjs`
- [ ] (Satori) renderer en `src/lib/renderers/<slug>.ts`
- [ ] (Satori) registrado en `src/lib/renderers/index.ts`
- [ ] `scripts/content-status.ts` actualizado con el slug en el pilar correspondiente
- [ ] `context/adcrate-usados.md` actualizado marcando el AdCrate #
- [ ] `npx tsc --noEmit` pasa limpio
- [ ] Imagen de prueba validada por el usuario
- [ ] Scripts temporales `_test-*.ts` eliminados
