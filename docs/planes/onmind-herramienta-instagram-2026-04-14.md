# Herramienta de gestión de Instagram — Visión

**Autor:** Raphael | **Fecha:** 2026-04-14

## Problema

Raphael es ingeniero de software, no marketer. Para hacer marketing profesional para OnMind necesita automatizar procesos y facilitar la gestión de contenido. El primer canal es Instagram (@OnMindApp).

## Visión

Una herramienta integrada en el dashboard de OnMind Marketing que permita:

1. **Repositorio de contenido** — Contenido generado diariamente con workflows automatizados (Claude Code + skills de marketing + generación de imágenes con Satori). Cada pieza tiene imagen, caption, hashtags, metadata de estrategia (pilar, framework, objetivo).

2. **Vista de cuenta** — Ver el perfil de @OnMindApp con data real: posts publicados, engagement por post (likes, comments, saves, shares, reach), métricas generales del perfil.

3. **Publicación inmediata** — Poder publicar un post ahora desde el dashboard. Útil en la fase inicial para probar y ajustar.

4. **Publicación programada** — Tener el contenido semanal listo y programado para publicarse automáticamente. El flujo sería: generar contenido → revisar/aprobar → programar → se publica solo.

## Fases de desarrollo

### Fase actual (prototipo)
- Conectar con Instagram Graph API
- Mostrar estado publicado/pendiente en el grid existente
- Botón para publicar posts pendientes
- Persistencia simple (JSON file)

### Próximas fases
- Leer insights/engagement de posts publicados
- Scheduling (cron o API de Meta para programar)
- Workflow de generación de contenido (pipeline: idea → imagen → caption → review → publish)
- Migrar persistencia a DB (Prisma)
- Reels y carruseles
- Stories
- Renovación automática de tokens de Meta
- Dashboard de métricas y rendimiento

## Stack técnico

- **Frontend:** Next.js + Tailwind + shadcn/ui (ya existente)
- **Imágenes:** Satori (JSX → SVG → PNG, ya implementado)
- **API Instagram:** Instagram Graph API v22.0 (fetch nativo, sin dependencias extra)
- **Persistencia:** JSON file (prototipo) → Prisma (futuro)
- **Deploy:** Vercel (imágenes accesibles por URL pública)

## Decisiones clave

- **No usar MCP de Instagram por ahora.** La integración vía API routes propias da más control y se integra mejor con la UI del dashboard. MCP es útil para operaciones desde Claude Code CLI, no para UI.
- **JSON file para persistencia** en el prototipo. Migrar a DB cuando haya más datos (insights, scheduling, contenido generado).
- **Solo fotos** en el prototipo. Reels y carruseles requieren flujos diferentes en la API de Meta.
