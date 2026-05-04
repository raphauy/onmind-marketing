# Investigación: animaciones programáticas para OnMind Marketing

**Autor:** Claude  
**Fecha:** 2026-05-04  
**Objetivo:** elegir librería y pipeline para sumar templates de animación al motor de contenido.

---

## Resumen ejecutivo (TL;DR)

- **Remotion es la opción recomendada** para render programático: React/JSX como Satori, ecosistema maduro (123k stars, v4.0.448 activo), audio nativo, y soporte oficial de Vercel vía Vercel Sandbox o Lambda.
- **El render NO puede ocurrir en serverless Functions estándar de Vercel** (límite 50 MB de función vs. ~150 MB de Chromium + FFmpeg). El patrón recomendado en 2026 es Vercel Sandbox (VM efímera con Chromium y FFmpeg incluidos) o Remotion Lambda en AWS.
- **Para volumen bajo/inicial, Vercel Sandbox es la ruta más simple**: no requiere gestionar AWS, cuesta lo mismo que el resto del proyecto (Vercel Pro) y tiene timeout de 5 horas. El cold start es el trade-off: varios segundos de VM provisioning por render.
- **Si el render se vuelve frecuente o pesado**, la arquitectura correcta es un worker asíncrono: Trigger.dev o Inngest dispara el render fuera del request, almacena el MP4 en Vercel Blob, y notifica al cliente.
- **Vercel Blob soporta MP4 sin problema** vía multipart upload (hasta 5 TB); los archivos por debajo de 512 MB se cachean en edge.
- **Audio**: Remotion tiene soporte nativo `<Audio>` con MP3/AAC/WAV; para mezcla se usa FFmpeg integrado en el render. Para TTS en español, OpenAI TTS a USD 15/M caracteres es el mejor balance calidad/costo. Para música royalty-free, Pixabay Music (gratuito, comercial).
- **Servicios template-as-a-service (Creatomate, Shotstack)** son referencia futura, no prioridad. Útiles si el equipo necesita templates sin escribir código, pero implican costo variable por render.

---

## Contexto

El motor actual de OnMind Marketing genera imágenes estáticas PNG (1080px) vía dos pipelines: Satori (JSX→SVG→PNG, cero costo) y LLM generativo (OpenRouter→Buffer). Ambos devuelven un `Buffer`, reciben overlay de logo con `sharp`, y suben a Vercel Blob. El modelo Prisma `Template` tiene un enum `TemplateRenderer { LLM | SATORI }`. El objetivo es sumar un tercer pipeline para **video animado MP4** (9:16 para Reels), manteniendo la arquitectura existente lo más intacta posible.

---

## A. Render programático en TypeScript

### A.1 Remotion

**Cómo funciona.** Remotion permite definir videos como componentes React. Cada frame se renderiza como si fuera un snapshot de DOM en un instante de tiempo (`useCurrentFrame()`). El bundle resultante se renderiza frame a frame con Chromium headless y se compila a MP4 con FFmpeg. El desarrollador escribe JSX/CSS idéntico a cualquier componente React; las animaciones se expresan como funciones puras de frame.

**Integración en Vercel.** Los serverless Functions convencionales no son viables: el bundle de Chromium + FFmpeg supera los 50 MB de límite de función. Remotion ofrece dos caminos soportados en 2026:

- **Vercel Sandbox** (recomendado para simplicidad): cada render crea una VM efímera Linux con Chrome y FFmpeg preinstalados. Setup: instalar `@remotion/vercel`, crear un Blob store, push y listo. Timeout: 45 min (Hobby) / 5 horas (Pro). Concurrencia: 10 (Hobby) / 2000 (Pro). El Sandbox se llama desde un API Route o Server Action.
- **Remotion Lambda** (recomendado para escala): render distribuido en AWS Lambda, más rápido gracias a paralelización de chunks. Requiere cuenta AWS, pero tiene SDKs para PHP, Go y Python además de Node. Costo aproximado: USD 0.25 por 1000s de GPU·s render (varía).

**Tiempo de render típico.** Un clip 9:16 1080×1920, 10s, 30fps (300 frames) renderiza en **20-60 segundos en un solo nodo**, dependiendo de complejidad de la escena. Lambda reduce esto a 8-20s distribuyendo en paralelo. El cold start del Sandbox agrega 10-30s la primera vez.

**Curva de aprendizaje.** Muy baja para quien ya escribe React. Los templates se escriben como componentes JSX con hooks `useCurrentFrame`, `interpolate`, `spring`. No hay timelines ni tweens externos: las animaciones son funciones puras de `frame → valor`. Es el modelo más cercano a Satori de toda la lista.

**Soporte de audio.** Completo y nativo. Componente `<Audio src="music.mp3" volume={0.8} />`. Soporta MP3, AAC, WAV (todos los formatos que soporta Chrome). Múltiples tracks simultáneos, control de volumen con `interpolate`, fade in/out, sincronización frame-exacta. El render final mezcla audio y video automáticamente vía FFmpeg.

**Tamaño de output.** Un clip H.264, 1080×1920, 10s, 30fps produce típicamente 3-15 MB según complejidad visual. Compatible con Instagram Reels (H.264, AAC, max 30fps, max 4 GB).

**Madurez.** 123k stars en GitHub. Versión actual v4.0.448 (mayo 2026), activamente mantenido. Issues: 0 abiertos (gestión estricta). Empresa detrás tiene modelo de negocio con licencias comerciales.

**Licencia.** Business Source License: gratuito para compañías con ARR < USD 1M y para uso personal. OnMind está en rango gratuito actualmente.

**Snippet mínimo — texto animado:**

```tsx
// src/remotion/templates/FraseAnimada.tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface Props {
  texto: string
}

export function FraseAnimada({ texto }: Props) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = spring({ frame, fps, config: { damping: 12 } })
  const translateY = interpolate(frame, [0, 20], [24, 0], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF7', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{
        fontFamily: 'Geist',
        fontSize: 72,
        color: '#007056',
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: 'center',
        padding: '0 80px',
      }}>
        {texto}
      </p>
    </AbsoluteFill>
  )
}
```

**Pros.**
- Modelo JSX idéntico a Satori: curva de aprendizaje mínima.
- Audio nativo, sin herramientas externas.
- Pipeline completo y documentado para Vercel.
- Ecosistema React disponible: shadcn/ui, Tailwind, Recharts, etc.
- Gratuito para OnMind en el estado actual.

**Contras.**
- Requiere Vercel Sandbox o Lambda para producción (no corre en Functions estándar).
- Cold start de Sandbox agrega latencia perceptible por render.
- Render es CPU-intensivo: no es instantáneo.
- La arquitectura de bundle (bundle→serve→render) es más compleja que Satori.

---

### A.2 Motion Canvas

**Cómo funciona.** Librería TypeScript con paradigma de generadores (`function* scene()`). Las animaciones se definen como secuencias imperativas: `yield* circle().opacity(1, 0.5)` anima la opacidad de 0 a 1 en 0.5 segundos y luego continúa. Incluye un editor visual en el browser para previsualización en tiempo real.

**Integración en Vercel.** No tiene soporte de server-side rendering. El render ocurre exclusivamente en el browser (Canvas API). Para exportar a MP4 se necesita el editor abierto o herramientas de terceros que capturen el canvas. **No viable para render programático server-side sin intervención manual.**

**Tiempo de render típico.** No aplica para producción automatizada: el render requiere un browser activo del usuario.

**Curva de aprendizaje.** Media-alta. Los generadores son un paradigma distinto a React/JSX. Requiere aprender la API de escenas, nodos, tweens y el sistema de timeline propio.

**Soporte de audio.** Soporta audio, diseñado específicamente para sincronizar con voz en off en videos explicativos.

**Madurez.** 18.5k stars en GitHub. Último release: v3.17.2 (diciembre 2024). 149 issues abiertos. MIT license.

**Pros.**
- Control de animación muy preciso para videos explicativos.
- Editor visual excelente para iterar.
- Gratis (MIT).

**Contras.**
- Sin SSR: incompatible con el pipeline automatizado requerido.
- Paradigma de generadores requiere reaprender el modelo mental.
- Actividad de release más lenta desde finales de 2024.
- No sirve para este proyecto sin una capa de puppeteer/headless adicional.

**Veredicto: descartado** para este uso.

---

### A.3 Revideo

**Cómo funciona.** Fork de Motion Canvas que agrega rendering API server-side. Expone `renderVideo()` como función Node.js que lanza un Puppeteer headless internamente. Diseñado para pipelines de generación de video automatizada: webhooks, queues, batch.

**Integración en Vercel.** Requiere Puppeteer (Chromium headless), igual que Remotion. El mismo problema de tamaño de función aplica. Se puede usar en Vercel Sandbox o en un worker externo. La documentación recomienda Google Cloud Run para deploy propio.

**Tiempo de render típico.** Similar a Motion Canvas renderizando en canvas: potencialmente más rápido que Remotion para escenas simples (sin DOM/CSS overhead), pero sin benchmarks públicos confiables para 9:16 1080p.

**Curva de aprendizaje.** Media: hereda la API de generadores de Motion Canvas.

**Soporte de audio.** Básico, heredado de Motion Canvas.

**Madurez.** 3.8k stars. 54 issues abiertos. MIT. Importante: el equipo detrás de Revideo está trabajando principalmente en **Midrender** (SaaS de renderización gestionada), lo que sugiere que Revideo como librería open-source podría tener mantenimiento reducido.

**Pros.**
- API Node.js limpia para server-side render.
- MIT, cero costo.
- Buen fit para batch rendering.

**Contras.**
- Ecosistema pequeño (3.8k vs 123k de Remotion).
- Paradigma de generadores (curva de aprendizaje).
- Incertidumbre de mantenimiento a largo plazo (equipo enfocado en Midrender).
- Sin ventaja clara sobre Remotion para este stack React/Next.js.

---

### A.4 FFmpeg con frames SVG/PNG de Satori

**Cómo funciona.** Generar N frames individuales como PNG (usando el pipeline Satori existente, con variaciones por frame: texto interpolado, opacidad, posición), y luego compilarlos a MP4 con FFmpeg (`ffmpeg -framerate 30 -i frame_%04d.png -c:v libx264 output.mp4`).

**Integración en Vercel.** Dos obstáculos graves:
1. `fluent-ffmpeg` fue **archivado en mayo 2025** y está en modo read-only. El reemplazo sería llamar directamente al binario `ffmpeg` con `child_process`.
2. Incluir el binario `ffmpeg-static` en una Vercel Function es posible (hay un repo oficial `vercel-labs/ffmpeg-on-vercel` usando Fluid Compute) pero requiere configuración manual y se acerca al límite de tamaño. Funciona mejor con máxima memoria asignada (3009 MB).
3. Generar 300 frames (10s × 30fps) como PNG en memoria antes de compilar es costoso: ~300 invocaciones de `satori` + `resvg-js`.

**Tiempo de render.** Alto: si cada frame tarda 50ms en Satori, 300 frames = 15s solo de generación de frames, más el tiempo de FFmpeg compilando. Total estimado: 30-90s para un clip simple.

**Curva de aprendizaje.** Baja conceptualmente (es el pipeline existente extendido), pero la implementación es manual: gestión de frames en disco/memoria, llamadas a FFmpeg, limpieza de temporales.

**Soporte de audio.** Posible vía FFmpeg (`-i audio.mp3 -shortest`), pero hay que gestionar la mezcla manualmente.

**Madurez.** FFmpeg: extremadamente maduro. fluent-ffmpeg: archivado. La solución requiere código custom.

**Pros.**
- Reutiliza el pipeline Satori existente al 100%.
- Cero dependencias nuevas de renderizado.
- Control total sobre cada frame.

**Contras.**
- fluent-ffmpeg archivado: habría que usar `child_process` directamente o una alternativa mantenida.
- Generación de 300 frames es lenta y memory-intensive.
- Vercel Functions con FFmpeg requiere configuración especial y memoria alta.
- Animaciones requieren calcular interpolaciones manualmente (no hay primitivas de spring/easing).
- El resultado será menos fluido que un render con Remotion para transiciones complejas.

**Veredicto: viable para animaciones muy simples** (fade in de texto, transición básica) si se quiere evitar Remotion, pero el overhead de implementación es alto y el resultado visual es más limitado.

---

### A.5 Otras alternativas

**Editly** (github.com/mifi/editly): librería Node.js para composición de video declarativa con FFmpeg. Útil para clips con imágenes, texto y transiciones predefinidas, pero sin soporte de React ni Satori. Última actividad: moderada. No agrega valor frente a FFmpeg directo para este caso.

**Reactive Video** (github.com/mifi/reactive-video): de la misma autoría, render de React a video con Puppeteer. Concepto similar a Remotion pero con mucho menos ecosistema (< 500 stars). Descartado.

**Canvas Confetti / GSAP / Lottie como frames.** Lottie produce animaciones JSON de AE, que se pueden reproducir en browser y capturar con Puppeteer frame a frame. Demasiado indirecto para un pipeline automatizado. Descartado.

---

### Tabla comparativa A

| Criterio | Remotion | Motion Canvas | Revideo | FFmpeg+Satori |
|---|---|---|---|---|
| **SSR / headless** | Sí (Vercel Sandbox, Lambda) | No | Sí (Node.js) | Sí (con config) |
| **Ergonomía autoría** | JSX/React (familiar) | Generadores TS | Generadores TS | Manual frames |
| **Audio nativo** | Sí (completo) | Sí (básico) | Básico | FFmpeg manual |
| **GitHub stars** | 123k | 18.5k | 3.8k | N/A |
| **Último release** | v4.0.448 (2026) | v3.17.2 (dic 2024) | activo (2024) | N/A |
| **Licencia** | BSL (gratis < 1M ARR) | MIT | MIT | LGPL |
| **Vercel deploy** | Sandbox / Lambda | No | Sandbox / CR | Fluid Compute |
| **Curva de aprendizaje** | Baja | Alta | Media | Media |
| **Madurez** | Alta | Media | Baja | Alta (FFmpeg) |
| **Fit para Next.js** | Excelente | Nulo | Bueno | Regular |

### Recomendación A

**Remotion** es la elección clara. La paridad con React (mismo paradigma que Satori, mismo ecosistema), la integración oficial con Vercel Sandbox, el soporte de audio completo, y la madurez del proyecto lo distinguen. La curva de aprendizaje es la mínima posible dado el stack existente.

---

## C. Servicios template-as-a-service

Estos servicios resuelven el render en su propia infraestructura. El proyecto solo envía variables vía API y recibe una URL de video. Costo variable por render; no requieren gestionar Chromium ni FFmpeg.

### Tabla comparativa C

| Servicio | Templates | Pricing inicial | Audio | Flexibilidad B2B | Veredicto |
|---|---|---|---|---|---|
| **Creatomate** | Editor visual propio + JSON API | ~USD 41/mes / 2000 créditos | Stock, TTS, voiceover propio | Alta, editor flexible | Mejor opción de este grupo |
| **Shotstack** | JSON timeline, sin editor visual | USD 39/mes / ~200 min | Sí, FFmpeg-based | Alta, muy técnica | Más dev-friendly |
| **Bannerbear** | Editor visual, overlay sobre video | USD 49/mes / 1000 créditos | No aplica (overlay only) | Baja para animaciones reales | Descartado: no hace animaciones |
| **Plainly Videos** | After Effects templates | USD 69/mes / 50 min | Sí | Media (requiere AE) | Overkill para este caso |

**Creatomate.** Tiene editor visual para crear el template una vez y luego un SDK Node.js limpio para disparar renders con variables. Soporta texto, imágenes, audio (biblioteca propia, TTS, upload de voiceover). Pricing: USD 41/mes para ~200 videos. Para uso inicial a bajo volumen es el más accesible del grupo. El principal riesgo es el lock-in: los templates viven en su plataforma.

```javascript
// Snippet de render con Creatomate SDK
const Creatomate = require('creatomate')
const client = new Creatomate.Client(process.env.CREATOMATE_API_KEY)

const renders = await client.render({
  templateId: 'uuid-del-template',
  modifications: {
    'Headline': 'Tu frase aquí',
    'Background.fill_color': '#FAFAF7',
  },
})
// renders[0].url → URL del MP4 generado
```

**Shotstack.** Más programático: el template es un JSON que define el timeline con capas, cortes, transiciones. No hay editor visual, lo que lo hace más flexible pero también más verboso. Pricing: USD 0.30/min PAYG o USD 0.20/min con suscripción mensual. Para un clip de 10s = USD 0.05 por render. Escalable pero requiere escribir el JSON de cada template a mano.

**Bannerbear.** Descartado: su módulo de video solo hace overlay de texto/imagen sobre un video existente. No genera animaciones ni composiciones propias.

**Plainly Videos.** Requiere diseñar templates en After Effects, lo que introduce dependencia de herramienta especializada. A USD 69/mes para 50 min de render es el más caro por render minute. Relevante si el equipo ya usa AE para diseño, que no es el caso.

**Conclusión C:** ninguno de estos servicios es prioridad ahora. Si en el futuro se quieren templates sin escribir código React, Creatomate es el punto de entrada. Si se quiere control total de código, Shotstack.

---

## Audio

### Música stock

**Pixabay Music** (pixabay.com/music): catálogo de ~30.000 tracks, licencia Pixabay (comercial, sin atribución requerida). No tiene API para descargar tracks programáticamente, pero los archivos MP3 son descargables y se pueden hospedar en Vercel Blob como assets estáticos del proyecto. **Opción recomendada para el primer template**: elegir 2-3 tracks curados a mano y subirlos como assets.

**Soundstripe**: 120.000 tracks, API de búsqueda y stream, licenciados para comercial/social media. USD 99/mes plan básico. Overkill para el volumen inicial.

**Beatoven.ai / Soundraw**: generación de música con IA. APIs disponibles. Interesante si se quiere música única por pieza, pero añade latencia y costo al pipeline.

**Recomendación**: para el primer template, usar tracks estáticos de Pixabay Music almacenados en Vercel Blob. No requiere API ni costo adicional.

### TTS

| Proveedor | Español rioplatense | Pricing | Calidad | Latencia |
|---|---|---|---|---|
| **ElevenLabs** | Sí (voces personalizables) | USD 0.06-0.12 / 1k chars (Flash/Multilingual v2) | Muy alta | ~1-3s |
| **OpenAI TTS** | Sí (13 voces, sin acento específico) | USD 15 / 1M chars (tts-1) | Alta | ~0.5-1s |
| **Google TTS** | Sí (WaveNet, Neural2) | USD 4 / 1M chars (Standard), USD 16 (WaveNet) | Alta | ~0.5s |
| **Azure TTS** | Sí (Neural voices) | USD 1 / 1M chars (Neural) | Alta | ~0.5s |

Para rioplatense específico, ElevenLabs tiene la mayor flexibilidad (voces clonables, tonos ajustables). OpenAI TTS tts-1 a USD 15/1M chars es el mejor balance para uso inicial: simple integración, buena calidad en español, sin acento marcado de España. Un script de 300 caracteres (texto de un Reel de 10s) cuesta USD 0.0045 por generación.

### Mezcla audio+video

**Con Remotion** (recomendado): la mezcla es declarativa dentro del componente React. `<Audio>` se encarga de todo en el render final.

```tsx
import { Audio, AbsoluteFill } from 'remotion'

export function FraseConAudio({ texto, audioUrl }: Props) {
  return (
    <AbsoluteFill>
      <Audio src={audioUrl} volume={0.6} />
      {/* resto de la composición visual */}
    </AbsoluteFill>
  )
}
```

Para loopear música que es más corta que el video:

```tsx
<Audio src="/music/ambient.mp3" volume={0.4} loop />
```

**Con FFmpeg puro:** mezcla con filtro `amix`, loop con `-stream_loop -1`, trim con `-t`. Más verboso pero total control.

### Recomendación audio

Para el primer template: sin audio (o con un fade-in de música ambiental de Pixabay como asset estático). Introducir TTS en una segunda iteración cuando el pipeline de video esté validado.

---

## Recomendación final

### 1. Stack para el primer template programático

**Remotion + Vercel Sandbox + Vercel Blob.**

Remotion se integra en el proyecto como un sub-módulo React independiente (`src/remotion/`). Las composiciones se registran en un entry point separado del bundler de Next.js (requerimiento de Remotion: no se puede bundlear Webpack con Webpack). El render se dispara desde un **background worker asíncrono** (Trigger.dev o Inngest) para no bloquear el request y respetar el timeout de Functions.

Flujo propuesto:
```
API Route POST /api/pieces/[id]/generate-video
  → encola job en Trigger.dev
  → Trigger.dev llama @remotion/vercel createSandbox()
  → Sandbox renderiza MP4
  → Sube a Vercel Blob (put multipart)
  → Actualiza Piece.videoUrl en DB
  → Notifica al cliente (polling o webhook)
```

Encaje en `generation-service.ts`: agregar una rama `case 'REMOTION'` que delega al worker asíncrono en lugar de retornar un Buffer sincrónicamente (el modelo actual es síncrono; los videos requieren modelo asíncrono).

### 2. Cambios necesarios al schema Prisma

```prisma
enum TemplateRenderer {
  LLM        // Imagen generativa vía OpenRouter
  SATORI     // JSX → SVG → PNG (programático, cero costo)
  REMOTION   // React → MP4 (programático, requiere Vercel Sandbox)
}

model Template {
  // ... campos existentes ...
  
  // Nuevo: duración en segundos para templates de video (null para imágenes)
  durationSec  Int?     // null para LLM/SATORI, requerido para REMOTION
}

model Piece {
  // ... campos existentes ...
  imageUrl  String?  // PNG para LLM/SATORI (sin cambios)
  videoUrl  String?  // MP4 para REMOTION (nuevo)
  
  // thumbnailUrl opcional: frame 0 del video como preview
  thumbnailUrl String?
}

model Generation {
  // ... campos existentes ...
  // imageUrl → puede ser imageUrl O videoUrl según el renderer
  // Considerar renombrar a mediaUrl o agregar videoUrl nullable
  videoUrl  String?  // alternativa a imageUrl para generaciones REMOTION
}
```

**Nota:** el campo `aspectRatio` ya existe en `Template` y sirve tal cual ("9:16" para Reels). No requiere cambio.

### 3. Cambios necesarios al pipeline

**`generation-service.ts`:** la función actual retorna `Buffer` sincrónicamente (Satori/LLM). Para Remotion hay que cambiar el modelo a asíncrono con estado:

- Añadir `status GENERATING` a `Piece.status` (ya existe en el enum) al iniciar.
- El worker asíncrono llama `renderMedia()` de Remotion o el SDK de Vercel Sandbox.
- Al terminar: sube MP4 a Vercel Blob con `put()` (o multipart para archivos > 4.5 MB).
- Actualiza `Piece.videoUrl` y `Piece.status = GENERATED`.

**`addLogoOverlay`:** la función actual usa `sharp` para PNG. Para video, el logo se incorpora directamente en el componente Remotion como `<Img src="/logo.png" />` en las últimas N frames. No usar `sharp` para video.

**Upload a Vercel Blob:** para archivos > 4.5 MB (probable para clips de 10s), usar `upload()` con multipart desde el server del Sandbox directamente a Blob, no a través de la API Route de Next.js (que tiene límite de 4.5 MB en el body). La documentación de Vercel Blob confirma soporte hasta 5 TB con multipart.

### 4. Consideraciones de deploy en Vercel

**El render no entra en Functions estándar.** Opciones ordenadas por simplicidad:

| Opción | Complejidad | Costo | Recomendación |
|---|---|---|---|
| Vercel Sandbox | Baja | Incluido en Pro | Primera opción |
| Remotion Lambda (AWS) | Media | ~USD 0.01-0.05/video | Si Sandbox da problemas |
| Trigger.dev cloud | Media | Free tier: 1000 runs/mes | Capa de queue sobre cualquiera |
| Modal / Fly.io worker | Alta | USD variable | Si Lambda/Sandbox no escalan |

**Para el arranque**: Vercel Sandbox + Trigger.dev para el queue. Trigger.dev tiene free tier generoso (1000 runs/mes) y se integra limpiamente con Next.js.

Si el proyecto crece y los renders son frecuentes (> 50/día), evaluar Remotion Lambda que reduce el tiempo de render a la mitad con distribución paralela.

### 5. Idea concreta para el primer template

**"Frase emergente"** — validación del pipeline end-to-end con mínima complejidad visual:

- **Duración:** 5 segundos
- **Formato:** 9:16 (1080×1920)
- **Animación:** texto de la frase aparece palabra por palabra con `spring()`, cursor parpadeante al final usando `Math.sin(frame / 5) > 0` como toggle.
- **Fondo:** `#FAFAF7` (crema de marca).
- **Tipografía:** Geist, cargada desde `/public/fonts/` (igual que en Satori).
- **Color texto:** `#007056` (teal de marca).
- **Logo overlay:** aparece en las últimas 1.5s con fade-in, centrado abajo, usando `<Img>` nativo de Remotion.
- **Audio:** sin audio en v1 (validar pipeline visual primero). En v2: track ambiental suave de Pixabay con fade-out final.
- **Campos del template:** `{ frase: string }` — un solo campo, mínimo roce con el creativo.
- **Renderer:** `REMOTION` en el enum. `durationSec: 5`. `aspectRatio: "9:16"`.

Este template valida: bundle de Remotion, render en Vercel Sandbox, upload de MP4 a Vercel Blob, actualización de `Piece.videoUrl`, y visualización en el dashboard (con tag `<video>` en lugar de `<img>`).

---

## Apéndice: snippets de código

### A.1 Remotion — configuración Next.js

```js
// next.config.js
const nextConfig = {
  serverExternalPackages: ['@remotion/renderer', '@remotion/bundler'],
}
module.exports = nextConfig
```

### A.1 Remotion — render server-side (worker)

```typescript
// src/workers/render-remotion.ts
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import path from 'path'

export async function renderFraseEmergente(frase: string, outputPath: string) {
  // 1. Bundle del entry point de Remotion (separado del bundle de Next.js)
  const bundleLocation = await bundle({
    entryPoint: path.resolve('./src/remotion/index.ts'),
  })

  // 2. Seleccionar composición
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'FraseEmergente',
    inputProps: { frase },
  })

  // 3. Render MP4
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: { frase },
    onProgress: ({ progress }) => {
      console.log(`Render: ${Math.round(progress * 100)}%`)
    },
  })
}
```

### A.1 Remotion — Vercel Sandbox

```typescript
// src/app/api/pieces/[id]/generate-video/route.ts
import { createSandbox } from '@remotion/vercel'
import { put } from '@vercel/blob'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { frase } = await req.json()

  // Crear VM efímera con Chrome + FFmpeg
  const sandbox = await createSandbox()

  const mp4Buffer = await sandbox.renderMedia({
    compositionId: 'FraseEmergente',
    inputProps: { frase },
    codec: 'h264',
  })

  // Subir a Vercel Blob
  const blob = await put(`videos/${params.id}.mp4`, mp4Buffer, {
    access: 'public',
    contentType: 'video/mp4',
  })

  // Actualizar DB...
  return Response.json({ videoUrl: blob.url })
}
```

### A.4 FFmpeg directo — stitch frames (referencia)

```typescript
import { execFile } from 'child_process'
import ffmpegPath from 'ffmpeg-static'
import path from 'path'

export function stitchFramesToVideo(
  framesDir: string,
  outputPath: string,
  fps = 30,
): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      ffmpegPath!,
      [
        '-framerate', String(fps),
        '-i', path.join(framesDir, 'frame_%04d.png'),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '23',
        outputPath,
      ],
      (err) => (err ? reject(err) : resolve()),
    )
  })
}
```

### C — Creatomate render (referencia futura)

```typescript
import Creatomate from 'creatomate'

const client = new Creatomate.Client(process.env.CREATOMATE_API_KEY!)

const renders = await client.render({
  templateId: process.env.CREATOMATE_TEMPLATE_ID!,
  modifications: {
    'Headline': frase,
    'Background.fill_color': '#FAFAF7',
  },
})

const videoUrl = renders[0].url // MP4 en CDN de Creatomate
```

---

## Referencias

- [Remotion en Vercel Sandbox (oficial)](https://www.remotion.dev/docs/vercel-sandbox)
- [Comparación de opciones SSR — Remotion](https://www.remotion.dev/docs/compare-ssr)
- [Remotion en Next.js — limitaciones](https://www.remotion.dev/docs/miscellaneous/nextjs)
- [Vercel Sandbox — template oficial](https://vercel.com/templates/next.js/remotion-on-vercel)
- [Remotion Lambda — costo estimado](https://www.remotion.dev/docs/lambda/cost-example)
- [Remotion licencia](https://www.remotion.dev/docs/license)
- [Vercel Blob — multipart hasta 5 TB](https://vercel.com/changelog/5tb-file-transfers-with-vercel-blob-multipart-uploads)
- [Vercel Blob — pricing y límites](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [ffmpeg-on-vercel — repo oficial de Vercel Labs](https://github.com/vercel-labs/ffmpeg-on-vercel)
- [fluent-ffmpeg archivado (mayo 2025)](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [Revideo renderVideo() API](https://docs.re.video/api/renderer/renderVideo/)
- [Motion Canvas — GitHub](https://github.com/motion-canvas/motion-canvas)
- [Remotion vs Motion Canvas vs Revideo 2026](https://www.pkgpulse.com/blog/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026)
- [ElevenLabs pricing 2026](https://elevenlabs.io/pricing/api)
- [OpenAI TTS pricing](https://openai.com/api/pricing/)
- [Pixabay Music — licencia comercial](https://pixabay.com/service/license-summary/)
- [Creatomate — pricing](https://creatomate.com/pricing)
- [Shotstack — pricing](https://shotstack.io/pricing/)
- [Trigger.dev + Next.js](https://trigger.dev/docs/guides/frameworks/nextjs)
- [Inngest en Vercel](https://vercel.com/marketplace/inngest)
