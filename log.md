# Log de trabajo — OnMind Marketing

## 2026-04-06
- **Inicio del proyecto.** Se creó el workspace onmind-marketing.
- Se exploró el producto OnMind (PRD, landing, docs de pricing, assets visuales).
- Se definió la forma de trabajo: paso a paso, dialogado, con continuidad inter-sesiones.
- Se creó CLAUDE.md, log.md y memoria persistente.
- Se dialogó sobre el problema, la historia de origen, audiencia, diferencial y visión.
- Se creó `docs/fundacional.md` — documento fundacional (borrador para revisión).
- Se dialogó sobre el estado actual de la marca (logo provisorio, colores teal OK, UI como referencia).
- Se registraron los colores de la app (oklch hue 175 = teal/cyan) desde globals.css.
- Se creó `docs/onmind-fase1-branding-2026-04-06.md` — plan de Fase 1: Branding.
- Se conectó Linear MCP y se crearon 5 issues en proyecto OnMind Marketing (ONM-100 a ONM-104).
- Se completó borrador de tono de voz (`docs/onmind-tono-de-voz-2026-04-06.md`) y se publicó como comentario en ONM-100 para validación de Martín.
- Flujo establecido: trabajamos acá → resultado va a Linear como comentario → Martín valida.
- Se completó paleta de colores (`docs/onmind-paleta-colores-2026-04-06.md` + PDF visual). Publicado en ONM-101.
- Se completó decisión de tipografía: Geist Sans para todo (`docs/onmind-tipografia-2026-04-06.md`). Publicado en ONM-102.
- Se investigaron herramientas de IA para logo: Google Stitch no aplica (es para UI), Ideogram para wordmark, Adobe Firefly para ícono vectorial.
- Se creó brief para diseño de logo (`docs/onmind-brief-logo-2026-04-06.md`).
- Se subió documento fundacional como documento de proyecto en Linear.
- Se exploró Ideogram para logo (wordmarks y isotipos). Resultados útiles para concepto pero limitados para refinamiento.
- Se generó el logo con Gemini (Nano Banana 3). Concepto: la "O" de OnMind como target/círculos concéntricos = "estar en la mente".
- Se obtuvieron 3 piezas: isotipo solo, logo "OnMind" (mayúsculas), logo "onmind" (minúsculas). Guardados en `assets/logo/`.
- Se publicó en ONM-103 para validación de Martín. Preferencia nuestra: versión con mayúsculas (OnMind).
- **Próximo paso:** cerrar versión del logo (esperando feedback de Martín), vectorizar en SVG con color exacto, luego compilar guía de marca (ONM-104).

## 2026-04-08
- Martín validó toda la Fase 1. Cerrados ONM-103 y ONM-104 en Linear. Fase 1: Branding completa.
- Mensaje enviado a Martín: Raphael toma marketing de OnMind como experimento con herramientas de IA.
- Creado plan de Fase 2: Presencia Digital (`docs/planes/onmind-fase2-presencia-digital-2026-04-08.md`).
  - Línea A: Tooling (skills de marketing)
  - Línea B: Landing page (contenido → 3 versiones visuales → implementar elegida)
  - Línea C: Instagram (perfil + estrategia + primeras publicaciones)
- Investigación de skills/MCPs de marketing para Claude Code (`docs/investigacion/investigacion-skills-marketing-2026-04-08.md`).
- Reorganización de `docs/` en subcarpetas: branding, planes, investigacion, operacion.
- Instalados 12 skills de marketing en `.claude/skills/` (a nivel proyecto):
  - De coreyhaines31/marketingskills: copywriting, copy-editing, content-strategy, social-content, page-cro, launch-strategy
  - De stevenflanagan1/social-ai-team: brand-onboarding, caption-writer, content-calendar, social-creative-designer, social-media-manager, social-performance-review
- Auditoría de la landing actual de OnMind (page.tsx del repo principal): copy genérico, sin diferencial, sin historia, badge "en desarrollo".
- Definido contenido nuevo de la landing (`landing/contenido-landing.json`): hero emocional, sección problema, solución, features, cómo funciona, historia de Martín, para quién, CTA.
- Decisión: campañas no se destacan en la landing (riesgo de bloqueos Meta). Foco en mensajes programados y plan de seguimiento.
- Creadas 4 versiones HTML de la landing: minimal, bold, editorial, creative (dark con círculos concéntricos, chat simulado, bento grid).
- Todas con Geist Sans, paleta de marca, logo SVG con viewBox corregido, sin emojis (íconos SVG custom).
- Decisión: "Solicita una demo" en vez de "Probá OnMind gratis". "Ingresar" deshabilitado por ahora.
- **Transformación a proyecto Next.js + Tailwind + shadcn:**
  - Se reinicializó el proyecto con create-next-app (pnpm), se restauraron todos los archivos de marketing.
  - Se instaló shadcn/ui (sidebar, card, collapsible, button), react-markdown, remark-gfm, rehype-raw, @tailwindcss/typography, lucide-react, geist.
  - Estructura de rutas:
    - `/` → Home simple con logo "OnMind Marketing" + botón Dashboard
    - `/dashboard` → Panel con sidebar shadcn (Dashboard, Guía de marca, Landings)
    - `/dashboard/marca` → Guía de marca renderizada desde markdown con imágenes
    - `/dashboard/landings` → Grid de 4 versiones con links que abren en tab nuevo
    - `/landings/minimal|bold|editorial|creative` → 4 landings completas en React/Tailwind
  - Contenido compartido en `src/lib/landing-content.ts` (usado por las 4 versiones React).
  - Favicon generado desde isotipo SVG.
  - Dark mode eliminado del panel (solo light). Las landings dark tienen su propio bg inline.
  - Imágenes del logo copiadas a `public/brand/` para la guía de marca.
  - Código en inglés, UI en español.
- **Pendiente:**
  - Crear issues en Linear para Fase 2.
  - Deploy a Vercel en marketing.onmindcrm.com.

## 2026-04-10
- **Línea B (Landing) cerrada.** La nueva landing está en producción en onmindcrm.com (implementada en el repo principal /home/raphael/desarrollo/onmind).
- Fase 2 estado: A ✅ Tooling, B ✅ Landing, C 🟡 Instagram (en C1).
- **Línea C — C1 Estrategia de Instagram completada.** Doc en `docs/planes/instagram/onmind-instagram-estrategia-2026-04-10.md`.
  - Audiencia primaria: Uruguay y Argentina (inmobiliarias y agentes).
  - Handle preferido: `@onmind` (sin "crm"). Si no está, se analiza con Martín.
  - 4 pilares con peso: educación WhatsApp comercial (40%), dolor del rubro (30%), producto en acción (20%), detrás de escena/historia (10%).
  - Frecuencia: 3 posts/semana + stories casi diarias. Formatos: reels, carruseles, stories. Sin persona en cámara por ahora.
  - Flujo de aprobación: generación → Raphael filtra → Martín valida → publica. Descartado va a banco evergreen.
  - Sección explícita "Qué resuelve OnMind (y qué no)" como regla de oro para contenido.
- **Clarificación clave de posicionamiento:** OnMind NO resuelve "responder rápido a leads nuevos" (sigue siendo manual). Sí resuelve mantener el vínculo vivo, mimos, recordatorios del negocio (vencimientos de alquiler, cumpleaños, planes de seguimiento). Guardado como memoria persistente.
- **App OnMind Marketing:**
  - Nueva sección "Estrategia" en el sidebar del panel (colapsable, preparada para sumar más planes).
  - Nueva ruta `/dashboard/estrategia/instagram` que renderiza el doc con el `MarkdownRenderer`.
  - `MarkdownRenderer` mejorado: `remark-breaks` para respetar saltos de línea simples, bloques `pre` con fondo claro y borde (fix de contraste).
- **Próximos pasos (Línea C):**
  - C2: Configurar perfil cuando Raphael cree la cuenta (handle, bio, foto, link, highlights).
  - C3: Batch de lanzamiento (9 piezas grid + reels + stories).
  - C4: Plan editorial a 2 semanas.

## 2026-04-13
- **C2: Perfil de Instagram creado.** Handle: `@OnMindApp`. Foto de perfil: isotipo. Bio definida.
- **Pipeline de generación de imágenes para Instagram:**
  - Investigación de herramientas: Canva MCP (descartado por costo Enterprise), Figma MCP (no aplica), APIs de IA generativa (Ideogram, Flux, GPT-Image), composición programática (Satori, Puppeteer).
  - Decisión: **Satori** (de Vercel) como motor principal. JSX → SVG → PNG con control total de branding. Gratis, local, ya en el stack.
  - Script `scripts/generate-post.mjs`: 3 templates (educación, dolor, producto) con Geist Sans, paleta de marca, isotipo transparente/blanco.
  - Assets generados: isotipo transparente y versión blanca para fondos oscuros (`assets/logo/`).
- **C3: Batch de lanzamiento — 9 piezas generadas.**
  - 4 educación (fondo blanco), 3 dolor (fondo teal), 2 producto (fondo gris).
  - Distribuidas en diagonal de color para el grid visual (teal en diagonal: top-right, mid-center, bottom-left).
  - Imágenes en `output/pendientes/` y `public/instagram/posts/`.
- **Regla de posicionamiento reforzada:** no usar dominio `onmindcrm.com` en piezas visuales (contiene "crm"). Usar `@OnMindApp`.
- **Simulador de Instagram en la app:**
  - Nueva sección "Instagram" en sidebar con entrada "Grid de perfil".
  - Ruta `/dashboard/instagram`: simulador de perfil IG con avatar, bio, stats y grid 3x3 clickeable.
  - Ruta `/dashboard/instagram/[post]`: vista detalle de post estilo Instagram con imagen completa, botones y metadata.
  - Layout tipo caja de celular (border, rounded, fondo gris).
- **Captions escritos para los 9 posts** usando skills caption-writer + copy-editing.
  - Frameworks variados: Problem→Agitate→Solve, Hook→Story→Lesson, Contrarian take, List, Before→After→Bridge.
  - Hooks optimizados para los primeros 125 chars (visible antes del "more" en IG).
  - 5 hashtags por post (límite actual de Instagram). Base: #inmobiliaria #gestiondeclientes #onmind.
  - CTAs variados: guardá, comentá, escribinos por DM.
  - Archivo de referencia: `output/captions-batch-lanzamiento.md`.
- **Datos centralizados en `src/lib/instagram-posts.ts`** — cada post con imagen, tipo, tema, framework, objetivo, caption y hashtags.
- **Vista detalle de post mejorada:** caption completo con hashtags, card de metadata (pilar, tema, framework, objetivo) con descripciones explicativas de cada framework.
- **Revisión de copys de las 9 imágenes:** todos pasan — tono correcto, vocabulario alineado con guía de marca.
- **Próximo paso:** revisión con Martín de los 9 posts + captions, luego publicar y salir con @OnMindApp en Instagram.

## 2026-04-14
- **Martín aprobó los 9 posts del batch de lanzamiento** (imágenes + captions). Listos para publicar en @OnMindApp.
- **Documentación:** visión de herramienta de Instagram (`docs/planes/onmind-herramienta-instagram-2026-04-14.md`), convenciones de desarrollo (`docs/operacion/convenciones-desarrollo.md`) replicando patrones de OnMind (services → Prisma, actions → services, API routes solo externos). Referencia agregada en CLAUDE.md.
- **Setup Meta/Instagram API:**
  - Facebook Page "OnMind" creada y vinculada a @onmindapp (Instagram Business).
  - Meta App "OnMind Marketing" creada con Instagram Login API (no legacy Facebook Login).
  - Permisos: `instagram_business_basic`, `instagram_business_content_publish`, `instagram_manage_comments`, `instagram_business_manage_messages`.
  - Token obtenido y configurado en `.env.local` (`INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`).
- **Cloudflare tunnel** `dev.onmindcrm.com` → localhost:3000 configurado para dev mode con dominio público. Regla WAF para bots de Meta (no sirvió — Cloudflare bloquea a nivel más bajo).
- **Fix auth HTTPS:** `useSecureCookies` y cookie name en proxy ajustados para funcionar con HTTPS del tunnel.
- **Prototipo de publicación en Instagram desde el dashboard:**
  - Modelo `InstagramPublish` en Prisma (slug, igMediaId, publishedAt). Migración `add_instagram_publish`.
  - Service `instagram-service.ts`: getPublishedPosts, getPublishStatus, createMediaContainer, waitForMediaReady, publishMediaContainer, publishPost, getProfile.
  - Server action `publishPostAction` en `dashboard/instagram/actions.ts`.
  - Client component `InstagramPublishButton` con Dialog de confirmación (shadcn Dialog con base-ui).
  - Grid muestra badges verdes (arriba derecha) en posts publicados.
  - Detalle muestra botón "Publicar en Instagram" o fecha de publicación.
- **Fix Button hydration:** reemplazado `ButtonPrimitive` de base-ui por `<button>` nativo (como OnMind con Radix) para eliminar hydration mismatch en SSR.
- **Imágenes regeneradas en 1080x1350 (4:5):** formato correcto para feed de Instagram. Script `generate-post.mjs` actualizado con modo `--all` para los 9 posts.
- **Vercel Blob para imágenes:** `@vercel/blob` instalado, `upload-service.ts` creado, script `upload-to-blob.mjs` para subir imágenes. Las 9 imágenes subidas al Blob. `blobUrl` agregado al tipo `InstagramPost` — la UI usa imágenes locales, Instagram usa las del Blob.
- **Perfil de Instagram con datos reales:** la API devuelve username, nombre, bio, avatar, seguidores, seguidos, publicaciones. La UI del grid muestra datos en vivo.
- **Los 9 posts publicados en @OnMindApp** desde producción (Vercel). Grid aspect ratio 4:5, contenedor max-w-[700px].
- **Próximos pasos:** scheduling, insights/engagement, reels/carruseles, renovación automática de tokens.

## 2026-04-21
- **Evaluación Claude Design** (Anthropic Labs, 17-abr-2026): producto para landings, pitch decks, mockups desde prompt/imagen/codebase, con export a Canva/PDF/PPTX. Incluido en Pro/Max/Team/Enterprise. Fit para OnMind: landings de campaña y pitch decks. No reemplaza el pipeline AdCrate + NB para piezas sociales.
- **Nuevo template `carta-fundador`** (AdCrate #23 Long-Form Manifesto adaptado). Llena el pilar "Detrás de escena" (0% hoy) y agrega voz de fundador. Editorial puro (sin celular): opening bold + body + firma teal cursiva, 4:5.
- **Arquitectura híbrida de renderers — LLM + Satori.** Templates text-heavy se renderizan programáticamente (JSX → SVG → PNG) en vez de vía LLM. Motivación: NB2/NB Pro alucinaron typos en texto largo (ej: "estabalan"), cuestan $0.07–$0.14/imagen, tardan 14–50s, sin control tipográfico. Satori: texto literal, $0, <1s, pixel-perfect.
  - Schema: enum `TemplateRenderer { LLM, SATORI }`, campo `renderer` (default LLM), `promptTemplate` y `model` pasan a nullable.
  - Registry en `src/lib/renderers/` — map slug → render function. Cada renderer devuelve Buffer PNG. Logo overlay sigue compartido.
  - Primer renderer: `carta-fundador` (Geist Bold opening, MediumItalic firma). Fonts copiadas de `node_modules/geist/` a `public/fonts/`.
  - `generatePieceImage` en `src/services/generation-service.ts` branchea por `template.renderer`. Costo forzado a 0 para SATORI (no depende del seed).
  - UI: badge "Programático" en `/dashboard/templates`. `generation-history` formatea `satori:<slug>` como "Satori (programático)".
- **Scripts CLI a TypeScript:** `create-piece.mjs` → `.ts`, `generate-piece.mjs` → `.ts`. `generate-piece.ts` importa `addLogoOverlay` del lib compartido. Quedó como test local (guarda PNG + marca GENERATED, sin Blob ni Generation row — el flujo canónico es el service).
- **DB sincronizada con `prisma db push`** por drift pre-existente (Generation table, soft delete en Piece, etc. — nada agregado ahora) que impide `migrate dev`. Pendiente: migration SQL manual para `add_template_renderer`, probada en Neon branch antes de main. Rebaseline completo queda como deuda aparte.
- **Code review aplicado:** guard de costUsd=0 para SATORI en el service, formateo de prefijo `satori:` en historial, deduplicación del logo overlay en CLI.

## 2026-04-16 — 2026-04-17
- **Motor de contenido — modelo de datos implementado.** Migración `add_content_engine`:
  - `Template`: receta fija con `fields` (JSON que define qué campos necesita el creativo), `promptTemplate` (prompt con `{{placeholders}}`), `model` (modelo de IA), `costPerImage` (USD por imagen), `darkOverlay`, `aspectRatio`.
  - `Piece`: pieza creativa con `fieldValues` (JSON con los valores del creativo), `status` (DRAFT→GENERATING→GENERATED→APPROVED→SCHEDULED→PUBLISHED→FAILED), `imageUrl`, `costUsd`, tracking de generación.
  - `Publication`: scheduling y publicación multi-plataforma.
- **Separación de responsabilidades:**
  - Creativo (Claude Code / UI) → genera contenido, elige template, llena campos → Piece en DB (DRAFT)
  - Generador (script/botón/cron) → lee Piece + Template, arma prompt, llama OpenRouter, agrega logo → Piece (GENERATED)
  - El template define todo lo visual (prompt, modelo, dirección fotográfica). El creativo solo llena el contenido.
- **4 templates cargados en DB** con costos reales de OpenRouter:
  - `headline`: NB Pro, $0.14/imagen — título + celular WhatsApp
  - `features-pointout`: NB2, $0.07/imagen — celular + 4 callouts
  - `us-vs-them`: NB2, $0.07/imagen — comparación split manual vs OnMind
  - `stat-surround`: NB2, $0.07/imagen — celular + 4 stats radiales
- **Migración `add_cost_tracking`:** campo `costPerImage` en Template, `costUsd` en Piece.
- **Scripts del pipeline:**
  - `scripts/lib/db.mjs` — conexión compartida a DB para scripts (Neon + ws)
  - `scripts/seed-templates.mjs` — carga/actualiza templates en DB
  - `scripts/create-piece.ts` — crea Piece en DB (creativo). Soporta `--values` JSON o placeholders por defecto.
  - `scripts/generate-piece.ts` — genera imagen de una Piece: lee DB → Satori o OpenRouter según renderer → logo overlay → guarda imagen local → marca GENERATED. Test local, el flujo canónico (Blob + Generation) está en `src/services/generation-service.ts`.
  - `scripts/add-logo-overlay.mjs` — post-producción: agrega isotipo + "OnMind" + "@OnMindApp" al margen inferior.
- **Pipeline probado end-to-end:** create-piece (DRAFT) → generate-piece (GENERATED) con logo, 16s, $0.07.
- **UI del motor de contenido — implementación completa:**
  - Sidebar actualizado: Piezas, Nueva pieza, Templates, Feed, Estrategia, Marca.
  - `/dashboard/templates`: lista de templates con imagen de última generación, campos, modelo, costo, count de piezas.
  - `/dashboard/piezas`: grid filtrable por status (default: GENERATED), stats de gasto, soft delete con filtro "Eliminadas".
  - `/dashboard/piezas/nueva`: formulario dinámico por template (Select, Input, Textarea, Tooltip — todo shadcn).
  - `/dashboard/piezas/[slug]`: detalle con preview, ImageGallery (carousel con flechas + teclado), historial de generaciones con "Usar esta", metadata, acciones por status.
  - Acciones: Generar imagen (→ OpenRouter + logo overlay + Blob), Regenerar, Aprobar (AlertDialog → redirect al feed), Publicar en Instagram (AlertDialog de confirmación), Eliminar (soft delete con AlertDialog + quién eliminó).
  - BackButton con router.back() para navegación contextual.
- **Logo overlay como pill flotante:** isotipo + "OnMind" + "@OnMindApp" en pill semitransparente con sombra, compuesto sobre la imagen. Resize automático al aspect ratio del template (1080x1350 para 4:5). Fonts y logos en `public/` para Vercel serverless.
- **Historial de generaciones:** modelo `Generation` en DB. Cada generación se guarda (imageUrl, prompt, model, costUsd, durationMs). `costUsd` en Piece se acumula. Se puede seleccionar cualquier generación como activa.
- **Migración de shadcn base-ui → Radix** (new-york style). Todos los componentes reinstalados. `render={}` → `asChild`. Resolvió problemas de hidratación y UX. Documentado en CLAUDE.md.
- **Migración de 9 posts legacy** a Pieces + Publications. Scripts `migrate-legacy-posts.mjs` y `migrate-legacy-captions.mjs`. Template "legacy-batch-lanzamiento" (inactivo). Captions y hashtags migrados.
- **Feed de Instagram refactorizado:** lee de `getPublishedAndScheduledPieces()` (APPROVED, SCHEDULED, PUBLISHED). Badges: "Aprobada" (blanco sólido), check verde (PUBLISHED). Ordenado: sin publicación arriba, publicadas por fecha de IG desc. Links a `/dashboard/piezas/[slug]`. Eliminados: `instagram-publish-button.tsx`, `instagram/[post]/`, `instagram/actions.ts`.
- **Publicar desde detalle de pieza:** botón "Publicar en Instagram" (status APPROVED) con AlertDialog. Usa `publishPiece()` que llama a Instagram Graph API, crea Publication, actualiza status a PUBLISHED.
- **Skill `/crear-pieza`:** flujo conversacional en Claude Code para crear piezas. Lee templates de la DB, propone contenido on-brand, guarda como DRAFT. Incluye brand-guide.md con tono, vocabulario, pilares.
- **`maxDuration = 120`** en page.tsx para Vercel serverless (generación + overlay + Blob).
- **`serverExternalPackages`** para resvg/sharp/satori en Turbopack.
- **Investigación de menciones en Instagram API:** 3 mecanismos (@mention en caption, user_tags, collaborators). Recomendación: usar `collaborators` para que posts aparezcan en feed de co-fundadores.
- **Próximos pasos:** implementar collaborators en publicación, scheduling con cron, más templates, calendario visual.

## 2026-04-15
- **Documento Motor de Contenido** (`docs/planes/onmind-motor-contenido-2026-04-15.md`): especificación funcional completa del sistema de generación, repositorio y scheduling de contenido. 8 tipos de contenido, estados formales (DRAFT→APPROVED→SCHEDULED→PUBLISHED), modelo de datos Prisma, pipeline de generación con agentes/skills, cron de Vercel cada 15 min, 5 pantallas de UI.
- Decisiones clave: estados formales en DB, cron de Vercel (no API nativa de IG), Raphael decide solo (sin validación por pieza de Martín), OpenRouter como gateway para modelos de imagen.
- **Investigación de infografías con IA** (`docs/investigacion/investigacion-infografias-ia-2026-04-15.md`): estado del arte, comparativa de modelos, técnicas de prompting, mejores prácticas para Instagram B2B.
- **Modelos de imagen en OpenRouter** (5 confirmados via API): Nano Banana ($0.30/M), Nano Banana 2 ($0.50/M), Nano Banana Pro ($2.00/M), GPT-5 Image Mini ($2.50/M), GPT-5 Image ($10.00/M).
- **Script comparativo** (`scripts/compare-infografia.mjs`): envía el mismo prompt a múltiples modelos y guarda resultados para comparar.
- Primera comparativa de 5 modelos: Nano Banana Pro y GPT-5 Image los mejores en calidad, pero caros. Nano Banana 2 buen balance costo/calidad.
- Iteraciones de prompt: bento grid (colorinche, descartado), minimal puro (demasiado básico), balance con iconos teal (correcto pero no destacable).
- **Descubrimiento: técnica AdCrate.** Proceso de 3 pasos: Brand DNA research en Claude → templates ultra-detallados con dirección fotográfica → modelo de imagen genera. Documentado en `docs/investigacion/adcrate-templates-referencia-2026-04-15.md` (40 templates de referencia).
- **Clave del salto de calidad:** especificidad fotográfica (lentes, f-stop), layout con porcentajes, texto verbatim entre comillas, anti-instrucciones explícitas, imágenes de referencia.
- **4 templates AdCrate adaptados para OnMind** (`scripts/test-adcrate-templates.mjs`), usando celular con WhatsApp como "producto":
  1. Headline: "Tu cliente se olvidó de vos" + celular con WhatsApp
  2. Features Point-Out: celular centro + 4 callouts con líneas
  3. Us vs Them: "Gestión manual vs Con OnMind" split
  4. Stat Surround: celular + 4 stats radiales con flechas
- Generados con **Nano Banana 2** ($0.50/M, 15-20s por imagen). Resultados excelentes — calidad profesional, español correcto, celulares fotorrealistas.
- **Próximos pasos:** refinar templates, crear Brand DNA modifier formal, agregar post-procesamiento (logo overlay con Satori), integrar al pipeline del motor de contenido.

## 2026-04-07
- Exploración de logo con Ideogram (limitado) y Gemini (buenos resultados).
- Concepto elegido: la "O" de OnMind como target/círculos concéntricos.
- SVGs vectorizados con Adobe online + color corregido a #007056.
- Assets finales en `assets/logo/`: isotipo, logo OnMind, logo onmind (SVG + PNG).
- Pendiente: feedback de Martín (OnMind vs onmind), luego compilar guía de marca (ONM-104).
- Se compiló guía de marca (`docs/onmind-guia-de-marca-2026-04-07.md` + PDF) con logos, colores visuales, tipografía y tono de voz.
- Se actualizó `md_to_pdf.py`: colores OnMind (teal en vez de azul), mayor espaciado entre secciones.
- Publicado en ONM-104 para validación de Martín.
- **Fase 1: Branding completa.** Todos los issues (ONM-100 a ONM-104) en revisión por Martín.
- **Próximo paso:** cuando Martín valide, cerrar issues y planificar Fase 2 (presencia digital).
