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
