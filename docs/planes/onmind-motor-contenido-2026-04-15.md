# Motor de Contenido — Especificación Funcional

**Fecha:** 2026-04-15
**Autor:** Raphael + Claude

---

## 1. Visión general

OnMind Marketing necesita pasar de publicar contenido manualmente (9 posts hardcodeados) a un sistema que:

1. **Genere contenido de calidad** usando agentes/skills especializados por tipo de contenido.
2. **Almacene todo en un repositorio centralizado** clasificado por tipo, pilar y estado.
3. **Permita programar publicaciones** semanalmente desde un calendario visual.
4. **Publique automáticamente** a la hora programada via cron.
5. **Escale a otras plataformas** (LinkedIn) sin rediseñar.

El enfoque es incremental: cada tipo de contenido se investiga, prototipa y formaliza antes de integrarlo al motor. No se construye todo de golpe.

### Flujo semanal objetivo

```
Lunes temprano:
1. Abrir el dashboard → ver qué contenido hay disponible en el repositorio
2. Seleccionar piezas para la semana (de distintos tipos y pilares)
3. Arrastrar al calendario en los slots de la semana (lun/mié/vie)
4. Listo — el cron publica automáticamente a la hora programada

Entre semana (cuando haga falta):
- Disparar generación de contenido nuevo (manual desde UI)
- Revisar y aprobar los borradores que generaron los agentes
```

---

## 2. Tipos de contenido

### Existentes (ya implementados)

| # | Tipo | Formato | Pilar principal | Cómo se genera |
|---|------|---------|-----------------|----------------|
| 1 | **Tip Card** | Imagen estática (1080x1350) | Educación (40%) | Satori, template `educacion` (fondo blanco, barra teal) |
| 2 | **Frase de Dolor** | Imagen estática (1080x1350) | Dolor (30%) | Satori, template `dolor` (fondo teal, texto blanco) |
| 3 | **Producto en Acción** | Imagen estática (1080x1350) | Producto (20%) | Satori, template `producto` (fondo gris, badge feature) |

Estos tres templates ya funcionan en `generate-post.mjs` y producen los 9 posts del batch de lanzamiento. Son la base, pero son limitados: solo texto sobre fondo de color. El contenido visual de Instagram necesita más variedad.

### Nuevos (por construir)

| # | Tipo | Formato | Pilares | Cómo se generaría | Prioridad |
|---|------|---------|---------|-------------------|-----------|
| 4 | **Infografía** | Imagen estática (1080x1350) | Educación, Dolor | IA generativa (Nano Banana 2, GPT-Image, etc.) | **Alta — primero** |
| 5 | **Carrusel Educativo** | 3-7 slides (1080x1350 c/u) | Educación, Producto | Satori (template nuevo por slide: portada, contenido, CTA) | Alta |
| 6 | **Dato Destacado** | Imagen estática (1080x1350) | Educación, Dolor | Satori (template nuevo: número grande + contexto) | Media |
| 7 | **Antes/Después** | Imagen split o 2 slides | Producto | Satori (template split-screen: "sin OnMind" vs "con OnMind") | Media |
| 8 | **Reel Animado** | Video vertical (1080x1920, 15-30s) | Cualquiera | Remotion o similar (texto animado, sin cámara) | Baja (diferido) |

### Descripción detallada de cada tipo nuevo

#### 4. Infografía
Visualizaciones informativas con iconos, flujos, comparativas o datos presentados gráficamente. No es solo texto sobre fondo — tiene elementos visuales que comunican la información.

**Ejemplos:**
- Flujo de 4 pasos: "Cómo funciona el plan de seguimiento de OnMind"
- Comparativa visual: "WhatsApp manual vs. WhatsApp con OnMind"
- Datos con iconos: "5 momentos clave para escribirle a un cliente"

**Por qué es prioridad:** es el formato con más potencial de guardados y shares en B2B. La gente guarda infografías útiles. Y con los avances en IA generativa (Nano Banana 2 de Google) es viable generarlas con buena calidad.

**Investigación necesaria:** modelos de IA, prompts efectivos, estilos visuales, limitaciones. Se detalla en la sección 8.

#### 5. Carrusel Educativo
Secuencia de slides que enseñan algo paso a paso. Es el formato con mayor engagement en Instagram (la gente swipea, lo que aumenta el tiempo en el post).

**Estructura típica:**
1. Slide portada: hook visual + título
2. Slides de contenido: un punto por slide con explicación breve
3. Slide cierre: CTA + @OnMindApp

**Ejemplos:**
- "5 mensajes que tu inmobiliaria debería enviar este mes" (5 slides de contenido)
- "Guía rápida: armá tu primer plan de seguimiento" (paso a paso)
- "3 errores comunes al usar WhatsApp para negocios" (y cómo evitarlos)

**Técnicamente:** Satori genera cada slide como PNG individual. La API de Instagram soporta carruseles via `children` containers. Necesita un template nuevo con variantes (portada, contenido, CTA).

#### 6. Dato Destacado
Una estadística o dato numérico impactante como pieza central. Número grande, contexto breve, fuente al pie.

**Ejemplos:**
- "68% de los clientes eligen al corredor que les escribió primero"
- "El corredor promedio pierde 3 oportunidades por semana por falta de seguimiento"
- "Un mensaje de cumpleaños tiene 4x más tasa de respuesta que una oferta"

**Nota:** Los datos pueden ser reales (de estudios) o estimaciones razonables del rubro. Siempre con fuente o aclaración.

#### 7. Antes/Después
Contraste visual entre el problema y la solución. Puede ser una sola imagen dividida o dos slides de carrusel.

**Ejemplos:**
- Izquierda: "Planilla de Excel con 300 contactos, celdas pintadas" / Derecha: "Mensajes que salen solos, cada uno personalizado"
- Slide 1: "Lunes 9am: revisar agenda, buscar cumpleaños, copiar mensajes..." / Slide 2: "Lunes 9am: ya se mandaron solos"

**Técnicamente:** Satori con layout split-screen (dos columnas con estilos contrastantes). Solo texto e iconos, no fotos.

#### 8. Reel Animado (diferido)
Video corto con texto animado, motion graphics, música de fondo. Sin persona en cámara.

**Ejemplos:**
- "3 señales de que estás perdiendo clientes por silencio" (texto apareciendo línea por línea)
- Mini demo: simulación de cómo funciona OnMind (screen recording estilizado)

**Técnicamente:** Remotion (React para video) encaja con el stack JSX/Satori. Se difiere porque requiere tooling nuevo y la API de Reels tiene requisitos adicionales. Se aborda después de los tipos estáticos.

### Relación tipos ↔ pilares ↔ frecuencia

Con 3 posts/semana y los pesos de los pilares:

| Semana tipo | Lunes | Miércoles | Viernes |
|-------------|-------|-----------|---------|
| Opción A | Carrusel educativo (Educ 40%) | Infografía de dolor (Dolor 30%) | Producto en acción (Prod 20%) |
| Opción B | Tip card (Educ 40%) | Dato destacado (Dolor 30%) | Antes/después (Prod 20%) |
| Opción C | Infografía educativa (Educ 40%) | Frase de dolor (Dolor 30%) | Carrusel producto (Prod 20%) |

El pilar "Detrás de escena" (10%) entra cada 2-3 semanas como story o post especial.

---

## 3. Repositorio de contenido

### Clasificación

Cada pieza de contenido se clasifica por tres ejes:

- **Tipo de contenido:** tip_card, frase_dolor, producto_accion, infografia, carrusel_educativo, dato_destacado, antes_despues, reel_animado
- **Pilar:** educacion, dolor, producto, detras_de_escena
- **Formato:** imagen_unica, carrusel, reel, story

### Estados y ciclo de vida

```
DRAFT ──────► APPROVED ──────► SCHEDULED ──────► PUBLISHED
  ▲                               │
  │                               ▼
  └──────────── FAILED ◄──────────┘
```

| Estado | Significado | Quién lo cambia |
|--------|-------------|-----------------|
| **DRAFT** | Generado por un agente, pendiente de revisión | Automático al generar |
| **APPROVED** | Raphael lo revisó y está listo para programar | Manual desde UI |
| **SCHEDULED** | Tiene fecha/hora asignada para publicar | Manual desde calendario |
| **PUBLISHED** | Publicado exitosamente en la plataforma | Automático (cron) |
| **FAILED** | Falló la publicación después de 3 intentos | Automático (cron) |

Transiciones permitidas:
- DRAFT → APPROVED (aprobar)
- APPROVED → SCHEDULED (programar)
- SCHEDULED → PUBLISHED (cron publica)
- SCHEDULED → FAILED (cron falla 3 veces)
- FAILED → DRAFT (reset para corregir)
- SCHEDULED → APPROVED (desprogramar)

### Modelo de datos

```
Content
├── id, slug (único)
├── contentType (enum: TIP_CARD, INFOGRAFIA, CARRUSEL_EDUCATIVO, ...)
├── pillar (enum: EDUCACION, DOLOR, PRODUCTO, DETRAS_DE_ESCENA)
├── format (enum: SINGLE_IMAGE, CAROUSEL, REEL, STORY)
├── status (enum: DRAFT, APPROVED, SCHEDULED, PUBLISHED, FAILED)
├── topic (texto libre: "5 fechas clave para inmobiliarias")
├── caption (texto completo del caption)
├── hashtags (array de strings)
├── framework ("Problem → Agitate → Solve", etc.)
├── objective ("Engagement", "Awareness", "Traffic")
├── templateId (qué template Satori se usó, null si fue IA generativa)
├── templateData (JSON con los datos del template para poder re-renderizar)
├── assets[] → ContentAsset
├── generation? → Generation
├── schedules[] → Schedule
└── publications[] → Publication

ContentAsset
├── position (0 para imagen única, 0-N para carrusel)
├── localPath (/instagram/posts/slug.png)
├── blobUrl (URL pública de Vercel Blob)
├── mimeType, width, height
└── content → Content

Generation
├── method (MANUAL, SKILL, CRON)
├── skillName ("caption-writer", "infografia-generator", etc.)
├── params (JSON: prompt, modelo IA, parámetros usados)
├── durationMs
└── content → Content

Schedule
├── platform (INSTAGRAM, LINKEDIN)
├── scheduledAt (fecha y hora exacta)
├── status (PENDING, PUBLISHING, PUBLISHED, FAILED)
├── attempts (0-3)
├── lastError (mensaje de error si falló)
├── executedAt
└── content → Content

Publication
├── platform (INSTAGRAM, LINKEDIN)
├── platformId (igMediaId, LinkedIn post ID)
├── publishedAt
└── content → Content
```

### Migración de datos existentes
Los 9 posts del batch de lanzamiento (actualmente en `instagram-posts.ts` como array hardcodeado) se migran a la base de datos. Los que ya fueron publicados en Instagram se crean con estado PUBLISHED y su Publication correspondiente.

---

## 4. Pipeline de generación

### Concepto

Cada tipo de contenido tiene su propio **generador**: un módulo que sabe cómo producir una pieza completa de ese tipo (texto + imagen). Los generadores son independientes entre sí y cada uno se construye después de investigar las mejores técnicas para ese tipo.

### Flujo

```
Trigger (UI manual o cron futuro)
        │
        ▼
  Elegir tipo de contenido + pilar + tema (opcional)
        │
        ▼
  Generador específico del tipo
        │
        ├─► Generar texto (caption, hashtags, hook)
        │     └─ Usa LLM con el skill correspondiente
        │
        ├─► Generar visual (imagen o slides)
        │     └─ Satori para templates, IA generativa para infografías
        │
        └─► Empaquetar resultado
              │
              ▼
        Crear Content (DRAFT) + Assets en DB
        Subir imágenes a Vercel Blob
        Crear registro de Generation (tracking)
```

### Interfaz de un generador

Todos los generadores siguen la misma interfaz:

```
Entrada:
  - pillar: pilar de contenido
  - contentType: tipo de contenido
  - topic (opcional): tema sugerido
  - context (opcional): contexto adicional

Salida:
  - topic: tema final
  - caption: texto completo
  - hashtags: array
  - templateId: qué template se usó (si aplica)
  - templateData: datos del template (si aplica)
  - images: array de buffers PNG (1 para imagen, N para carrusel)
```

### Dónde vive cada generador

```
src/lib/generators/
  ├── index.ts              ← registro de generadores, interfaz común
  ├── tip-card.ts           ← generador de tip cards (usa template Satori existente)
  ├── pain-quote.ts         ← generador de frases de dolor
  ├── product-spotlight.ts  ← generador de producto en acción
  ├── infografia.ts         ← generador de infografías (IA generativa)
  ├── carousel.ts           ← generador de carruseles educativos
  ├── data-highlight.ts     ← generador de datos destacados
  └── before-after.ts       ← generador de antes/después
```

### Generación manual vs. automática

**Fase 1 (ahora):** Trigger manual desde la UI. Seleccionás tipo y pilar, opcionalmente das un tema, y el generador produce un borrador.

**Fase 2 (futuro):** Cron de Vercel dispara generación periódica. Por ejemplo: "cada lunes a las 6am, generar 3 tip cards y 2 infografías para mantener el repositorio abastecido".

### Cada tipo requiere su propia investigación

Antes de construir un generador, se investiga:

1. **Qué modelos/herramientas existen** para ese tipo de contenido.
2. **Cómo los usan otros** (prompts, estilos, flujos de trabajo).
3. **Qué calidad se puede lograr** con el estado actual de las herramientas.
4. **Prototipo:** script que genere una pieza de ejemplo.
5. **Iteración:** ajustar hasta lograr calidad aceptable.
6. **Formalización:** convertir en generador integrado al motor.

Este proceso se repite por cada tipo nuevo. No se asume que lo que funciona para infografías funciona para carruseles.

---

## 5. Scheduling y publicación

### Arquitectura

El scheduling se maneja con un cron de Vercel que corre cada 15 minutos. No se usa la API de scheduling nativa de Instagram porque:

1. Tiene límite de 25 posts programados.
2. Solo funciona para Instagram (no escala a LinkedIn).
3. Con nuestro cron tenemos control total del flujo y los reintentos.

### Cron de publicación

**Endpoint:** `/api/cron/publish`
**Frecuencia:** cada 15 minutos
**Protegido por:** `CRON_SECRET` (header que Vercel envía automáticamente)

**Lógica:**
1. Buscar schedules con `status = PENDING` y `scheduledAt <= ahora` y `attempts < 3`
2. Para cada schedule:
   - Marcar como PUBLISHING
   - Cargar Content + Assets
   - Publicar via la API de la plataforma (Instagram Graph API)
   - Si sale bien: crear Publication, marcar schedule PUBLISHED, marcar content PUBLISHED
   - Si falla: incrementar attempts, guardar error. Si attempts >= 3, marcar FAILED
3. Devolver resumen

### Reintentos
- 3 intentos máximo, espaciados naturalmente por el intervalo del cron (cada 15 min).
- Errores comunes de Instagram: token expirado (necesita refresh manual), rate limiting (el reintento funciona), imagen inválida (necesita corrección manual).
- Los items FAILED aparecen destacados en la UI para intervención manual.

### Flujo semanal de programación

```
Lunes:
1. Abrir /dashboard/calendario
2. Ver la semana (Lun-Dom) con slots vacíos y contenido ya programado
3. Click en slot vacío → abre picker con contenido APPROVED disponible
4. Seleccionar pieza → se crea Schedule (PENDING, scheduledAt = fecha/hora del slot)
5. El Content pasa a SCHEDULED
6. Repetir para cada día de la semana

El cron se encarga del resto.
```

---

## 6. UI del dashboard

### Pantallas necesarias

#### 6.1 Repositorio de contenido (`/dashboard/contenido`)

Grid de tarjetas con todas las piezas de contenido. Cada tarjeta muestra: thumbnail, topic, badges de pilar y tipo, badge de estado.

**Filtros:**
- Por estado: draft / approved / scheduled / published
- Por pilar: educación / dolor / producto / detrás de escena
- Por tipo: tip card / infografía / carrusel / etc.
- Por formato: imagen / carrusel / reel / story

**Acciones en bulk:**
- Aprobar seleccionados
- Eliminar seleccionados

**Botón principal:** "Generar contenido" (lleva a la pantalla de generación)

#### 6.2 Detalle de contenido (`/dashboard/contenido/[id]`)

Vista completa de una pieza:
- **Izquierda:** preview de la imagen (o visor de slides para carruseles)
- **Derecha:** caption completo, hashtags, metadata (pilar, tipo, framework, objetivo)
- **Arriba:** barra de estado con transiciones disponibles (Aprobar / Programar / Publicar ahora)
- **Info de generación:** qué skill lo creó, cuándo, parámetros
- **Edición:** el caption se puede editar en estado DRAFT

#### 6.3 Generar contenido (`/dashboard/contenido/generar`)

Formulario simple:
- Seleccionar tipo de contenido
- Seleccionar pilar
- Tema (opcional, texto libre)
- Botón "Generar"
- Muestra progreso/loading
- Al terminar, redirige al detalle de la pieza creada

Más adelante: generación en batch ("Generar 5 tip cards para la semana").

#### 6.4 Calendario semanal (`/dashboard/calendario`)

Vista de 7 columnas (Lun-Dom). Cada columna muestra las piezas programadas para ese día como tarjetas con thumbnail y hora.

- Click en slot vacío → picker de contenido aprobado
- Drag & drop para reordenar/mover entre días
- Navegación semana anterior / siguiente
- Indicador de distribución de pilares de la semana (barrita de colores arriba)

#### 6.5 Dashboard mejorado (`/dashboard`)

Agregar widgets:
- "Próximas publicaciones" (próximas 5 programadas)
- "Pendientes de revisión" (drafts en el repositorio)
- "Esta semana" (publicados / programados / restantes)

### Sidebar actualizado

```
Dashboard
Contenido
  ├── Repositorio
  └── Generar
Calendario
Instagram
  └── Grid de perfil (el simulador existente)
Estrategia
  └── Instagram
Guía de marca
```

---

## 7. Roadmap de implementación

### Fase 1: Modelo de datos + migración
- Agregar modelos Prisma (Content, ContentAsset, Generation, Schedule, Publication)
- Script de migración: importar los 9 posts existentes
- Refactorizar el grid de Instagram para leer de la DB en vez del array hardcodeado

### Fase 2: UI de repositorio y detalle
- Pantalla de repositorio con filtros
- Pantalla de detalle con preview y metadata
- Transiciones de estado (aprobar, publicar ahora)

### Fase 3: Extraer engine de render
- Mover la lógica de `generate-post.mjs` a `src/lib/render.ts`
- Extraer templates a archivos individuales en `src/lib/templates/`
- Verificar que los templates existentes producen exactamente el mismo output

### Fase 4: Pipeline de generación + infografía
- Implementar interfaz de generadores
- Adaptar los 3 generadores existentes (tip, dolor, producto)
- Investigar y construir el generador de infografías (ver sección 8)
- UI de generación manual

### Fase 5: Scheduling + cron + calendario
- Implementar schedule-service y publication-service
- Endpoint cron `/api/cron/publish`
- Configurar en `vercel.json`
- UI de calendario semanal

### Fase 6: Más tipos (iterativo)
- Carrusel educativo (template + soporte API carruseles de Instagram)
- Dato destacado (template nuevo)
- Antes/después (template nuevo)
- Reel animado (Remotion, diferido)

Cada fase se implementa, se prueba, y se valida antes de pasar a la siguiente.

---

## 8. Primer tipo nuevo: Infografía

### Por qué empezar por acá

Las infografías son el tipo de contenido con mayor potencial de engagement para B2B en Instagram:
- Se guardan (saves) porque son útiles como referencia
- Se comparten (shares) porque aportan valor al que las recibe
- Son visualmente atractivas en el feed (rompen la monotonía de los posts de texto)
- Con IA generativa, la calidad alcanzable hoy es alta

### Herramienta de pruebas: OpenRouter

Para evaluar modelos de generación de imágenes usamos **OpenRouter** (openrouter.ai) como gateway unificado. Permite probar múltiples modelos con una sola API key y comparar resultados sin tener que configurar cada proveedor por separado.

**Modelos con generación de imagen disponibles en OpenRouter (abril 2026):**

| Modelo | ID en OpenRouter | Proveedor | Costo (prompt / completion) | Notas |
|--------|------------------|-----------|----------------------------|-------|
| Nano Banana | `google/gemini-2.5-flash-image` | Google | $0.30 / $2.50 por M tokens | Generación y edición, multi-turn. El más barato. |
| Nano Banana 2 | `google/gemini-3.1-flash-image-preview` | Google | $0.50 / $3.00 por M tokens | Último modelo Flash, calidad Pro a bajo costo. |
| Nano Banana Pro | `google/gemini-3-pro-image-preview` | Google | $2.00 / $12.00 por M tokens | El más avanzado de Google: razonamiento multimodal, alta fidelidad. |
| GPT-5 Image Mini | `openai/gpt-5-image-mini` | OpenAI | $2.50 / $2.00 por M tokens | Multimodal nativo, buen text rendering. |
| GPT-5 Image | `openai/gpt-5-image` | OpenAI | $10.00 / $10.00 por M tokens | El más capaz de OpenAI, instrucciones complejas y detalladas. |

Nota: Seedream 4.5 (ByteDance) aparece en la web de OpenRouter pero la API aún no lo expone con output de imagen — puede estar en beta. Se re-evalúa cuando esté disponible.

Los scripts de prototipado (`scripts/`) usan la API de OpenRouter (`https://openrouter.ai/api/v1`) para generar imágenes con distintos modelos y comparar calidad, consistencia de marca y texto en español. Una sola API key, misma interfaz para todos los modelos. Esto permite iterar rápido sin atarse a un proveedor.

### Qué investigar

1. **Modelos de generación de imágenes (todos via OpenRouter):**
   - **Nano Banana 2** (`google/gemini-3.1-flash-image-preview`) — calidad Pro a costo Flash, bueno para infografías con texto
   - **Nano Banana Pro** (`google/gemini-3-pro-image-preview`) — el más avanzado de Google, alta fidelidad
   - **GPT-5 Image Mini** (`openai/gpt-5-image-mini`) — buen text rendering, costo moderado
   - **GPT-5 Image** (`openai/gpt-5-image`) — el más capaz, instrucciones complejas. El más caro.
   - **Nano Banana** (`google/gemini-2.5-flash-image`) — el más barato, baseline para comparar
   - Comparar: calidad del texto en español, control de estilo/layout, consistencia de marca, costo por imagen
   - Script comparativo: mismo prompt → 5 modelos → evaluar lado a lado

2. **Cómo otros generan infografías con IA:**
   - Qué prompts usan
   - Qué estructura le dan al prompt (datos → layout → estilo)
   - Cómo mantienen consistencia de marca
   - Limitaciones conocidas (textos cortados, layouts inconsistentes, etc.)

3. **Estilo visual para OnMind:**
   - Paleta teal (#007056) + blanco + gris
   - Tipografía legible (¿se puede forzar Geist en IA generativa?)
   - Iconos minimalistas
   - Layout limpio, no recargado
   - Isotipo o @OnMindApp como watermark

4. **Flujo del generador:**
   - Input: tema + datos/puntos clave
   - El LLM estructura los datos en un formato apto para infografía
   - El modelo de imagen genera la visualización
   - Post-procesamiento: ¿hace falta ajustar colores, agregar logo?

### Proceso

1. **Investigación** (esta sesión o la siguiente): buscar ejemplos, probar modelos, documentar hallazgos
2. **Prototipo:** script standalone que genere una infografía dando un tema
3. **Iteración:** probar con 5-10 temas diferentes, ajustar prompts y parámetros
4. **Validación:** ¿el output es publicable? ¿mantiene la marca? ¿el texto en español es correcto?
5. **Formalización:** integrar como generador en `src/lib/generators/infografia.ts`

---

## Decisiones de diseño

| Decisión | Elegido | Alternativa descartada | Por qué |
|----------|---------|----------------------|---------|
| Estados de contenido | Formales en DB | Visual simple | Permite filtrar, automatizar, y escalar |
| Scheduling | Cron de Vercel (15 min) | API nativa de Instagram | Control total, multi-plataforma, sin límite de 25 |
| Validación de contenido | Raphael decide solo | Martín valida cada pieza | La estrategia ya fue validada, agiliza el flujo |
| Primer tipo nuevo | Infografía | Carrusel | Mayor impacto en engagement, oportunidad con IA generativa |
| Reels | Diferido | Implementar ya | Requiere tooling de video nuevo (Remotion), más complejo |
| API de imágenes | OpenRouter como gateway | APIs directas por proveedor | Una sola API key, comparar modelos fácil, sin vendor lock-in |
