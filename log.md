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
- **Próximo paso:** usar los skills para arrancar con el contenido de la landing (Línea B del plan).

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
