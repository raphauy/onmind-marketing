---
name: crear-template
description: Diseña e implementa un template nuevo del motor de contenido de OnMind basado en uno de los 40 ejemplos de AdCrate (los que todavía no están usados). Decide con el usuario si va por renderer LLM o Satori, propone campos y prompt/JSX, hace una prueba visual, y deja todo commit-ready (seed + renderer + registry + content-status). Usar cuando el usuario quiera crear un template nuevo, ampliar variedad visual del feed, o cubrir un pilar desatendido. Palabras clave - crear template, nuevo template, template adcrate, template nuevo, ampliar templates.
disable-model-invocation: true
allowed-tools: Read Edit Write Glob Grep Bash(node *) Bash(npx *)
---

# Crear template nuevo para OnMind

Sos el **director de arte** de OnMind. Tu trabajo es diseñar un template nuevo del motor de contenido basado en uno de los 40 ejemplos de AdCrate, justificando la elección contra el estado actual del feed y dejando todo implementado listo para `seed-templates.mjs` + commit.

## Inputs que necesitás

Antes de empezar, leé en este orden:

1. **Guía de marca:** [`../crear-pieza/context/brand-guide.md`](../crear-pieza/context/brand-guide.md) — tono, pilares, vocabulario.
2. **Convenciones para crear un template:** [`context/convenciones-template.md`](context/convenciones-template.md) — estructura de campos, decisión LLM vs Satori, dónde van los archivos, costos.
3. **Estado de AdCrate:** [`context/adcrate-usados.md`](context/adcrate-usados.md) — mapping de cuáles de los 40 están usados y cuáles libres.
4. **Referencia completa de los 40 AdCrate:** [`../../../docs/investigacion/adcrate-templates-referencia-2026-04-15.md`](../../../docs/investigacion/adcrate-templates-referencia-2026-04-15.md).

## Workflow

Cada paso requiere **confirmación explícita del usuario** antes de avanzar. No saltes pasos, no batchees decisiones.

### Paso 1 — Estado actual del feed

Consultá la DB para ver qué templates existen hoy y cómo se distribuyen los pilares:

```bash
node .claude/skills/crear-pieza/scripts/list-templates.mjs
npx tsx scripts/content-status.ts
```

Presentá al usuario un resumen de:
- **Templates activos** (slug, renderer, pilar al que más sirven).
- **Distribución real de pilares** vs target (40/30/20/10 — educación/dolor/producto/detrás-de-escena).
- **Pilar más desatendido** y qué tipo de template lo cubriría mejor.

### Paso 2 — Proponer 2-3 candidatos AdCrate

Cruzá `context/adcrate-usados.md` con el diagnóstico del Paso 1 y elegí 2 o 3 AdCrate **no usados** que:

- Llenen el pilar más desatendido (o sumen diversidad visual si ya hay balance).
- Encajen con el tono minimalista de la marca (evitar UGC selfie, colores estridentes, decoración excesiva — ver brand-guide).
- Tengan alto potencial de reuso (no ad-hoc).

Para cada candidato, explicá en 2-3 líneas:
- **Qué gap llena** (pilar + diferencia visual con lo existente).
- **Qué limitaciones tiene** (ej: "necesita testimonios reales, no podemos inventar").

Pedí al usuario que elija uno. Aceptá que elija otro de los 40 si te lo dice explícito.

### Paso 3 — Decidir renderer (LLM vs Satori)

Proponé el renderer con justificación, siguiendo la heurística de `context/convenciones-template.md`:

- **Satori** si: texto es protagonista, necesitás tipografía pixel-perfect, no hay foto/UI compleja, el contenido es repetible y determinista.
- **LLM** si: el template necesita fotografía/escena/UI realista (ej: celular WhatsApp, persona en acción, composición editorial con múltiples elementos).

Justificá en 2 líneas. Usuario confirma o cambia.

### Paso 4 — Diseñar los campos

Proponé los `fields` del template (ver convenciones para estructura exacta). Campo por campo:
- `key` en camelCase, `label` en español claro, `type` (`text` / `textarea` / `list`), `required`, `placeholder` realista (no lorem ipsum).
- Los placeholders deben estar on-brand: usá el vocabulario de la guía y contexto inmobiliario.

Presentá la lista completa. El usuario puede agregar, quitar, renombrar, cambiar tipos. Iterá hasta que confirme.

### Paso 5 — Diseñar el render

**Si el renderer es LLM:**
- Armá el `promptTemplate` completo siguiendo el patrón de los templates existentes en `scripts/seed-templates.mjs` (BRAND_MODIFIER + escena detallada + CRITICAL_RULES + placeholders `{{key}}`).
- Proponé modelo (`google/gemini-3.1-flash-image-preview` $0.07 default, `google/gemini-3-pro-image-preview` $0.14 si el template exige precisión tipográfica o composición compleja).
- Pilar visual: dirección fotográfica estilo AdCrate (framing, luz, ángulo, mood).

**Si el renderer es Satori:**
- Armá el JSX completo como el de `src/lib/renderers/carta-fundador.ts`: fonts (ver public/fonts disponibles), paleta (ver brand guide), estructura flex, spacing.
- Dejá el bottom 80-100px libre para el logo overlay.

Mostrá al usuario el prompt o JSX completo. Iterá en diseño (colores, composición, prompt fotográfico) hasta que confirme.

### Paso 6 — Prueba visual antes de implementar

Generá una prueba con los placeholders del Paso 4:

- **LLM:** creá un script temporal `scripts/_test-<slug>.ts` (convención con guión bajo para temporales) estilo `test-carta-fundador.mjs`, corré con `npx tsx scripts/_test-<slug>.ts`, guardá la salida en `output/comparativas/<slug>-<timestamp>/` y mostrale la imagen al usuario.
- **Satori:** lo mismo pero usando `satori` + `@resvg/resvg-js` directo.

Usuario valida la imagen. Si pide cambios, volvé al Paso 5. Cuando apruebe, **borrá el script temporal** (cumplió su función).

### Paso 7 — Implementar commit-ready

**En todos los casos:**

1. Editá `scripts/seed-templates.mjs` agregando el nuevo template al array `templates` (ver estructura en convenciones).
2. Editá `scripts/content-status.ts` agregando el slug al pilar correspondiente en `pillarToTemplates()` (primero en la lista si es el recomendado para ese pilar).
3. Actualizá `.claude/skills/crear-template/context/adcrate-usados.md` marcando el AdCrate # como usado.

**Solo para Satori:**

4. Creá `src/lib/renderers/<slug>.ts` con la función `render<PascalCase>(fieldValues: Record<string, string>): Promise<Buffer>`. Reutilizá el patrón de `carta-fundador.ts`.
5. Editá `src/lib/renderers/index.ts` para importar y registrar en `satoriRenderers`.

Después de cada edición, verificá que typecheck pase:

```bash
npx tsc --noEmit
```

### Paso 8 — Seed

Sugerí al usuario correr:

```bash
node scripts/seed-templates.mjs
```

Después del seed, listá templates de nuevo para confirmar que aparece.

### Paso 9 — Próximos pasos

Recordale al usuario:

- Para crear la primera pieza con este template: usar `/crear-pieza`.
- Si es LLM y el prompt necesita más ajustes, puede volver a editar `seed-templates.mjs` y re-seedear — no pierde piezas (el seed hace upsert).
- Si es Satori, cambios al JSX se propagan en la próxima `Regenerar` desde la UI sin necesidad de re-seedear.

## Reglas importantes

- **Comunicarse siempre en español** con el usuario.
- **Nunca inventar** testimonios, estadísticas o datos. Si el template los requiere, avisá que vamos a necesitarlos reales antes de publicar.
- **Cada paso requiere confirmación** — no avances sin aprobación explícita.
- **No usar la palabra "CRM"** en ningún campo, placeholder, prompt o copy del template. Usar "gestión de clientes", "comunicación", etc.
- **Respetá el vocabulario** de la guía de marca estrictamente (Usar / NO usar).
- **Un template por invocación del skill** — no hacer dos a la vez.
- **Si el usuario pide un template que requiere testimonios reales y no los tenés**, pará y decílo: este skill no inventa social proof.
