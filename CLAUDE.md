# OnMind Marketing

**Comunicarse siempre en español con el usuario.**

Proyecto de marketing para **OnMind CRM** — SaaS de gestión de comunicaciones WhatsApp para negocios que quieren mantener el vínculo con sus clientes. Primer rubro de referencia: inmobiliario.

## Contexto rápido
- Producto: https://www.onmindcrm.com | Código: /home/raphael/desarrollo/onmind
- Socios: Raphael (tech) y Martín (real estate/negocio)
- Estado: producto funcional, marketing desde cero
- Objetivo: construir estrategia de marketing completa por fases

## Cómo trabajamos
- **Paso a paso**, dialogado, planificado. No avanzar sin alineación.
- Cuestionar decisiones si algo no cierra. No ser "yes man".
- Balance entre profesionalismo y eficiencia. No sobredimensionar.
- Antes de empezar una tarea, leer el log y el plan vigente.

## Coordinación con Martín
- Linear: ver `docs/operacion/guia-linear-marketing.md` para proyecto, flujo e issues

## Archivos clave
- `log.md` — registro cronológico de lo realizado (leer siempre al iniciar sesión)
- `docs/` — documentos de marketing, organizados en subcarpetas:
  - `docs/branding/` — identidad visual, tono, paleta, logo, guía de marca
  - `docs/planes/` — planes de fase (branding, presencia digital, etc.)
  - `docs/investigacion/` — research de herramientas, competencia, etc.
  - `docs/operacion/` — guías de proceso y coordinación
- Memoria persistente en `~/.claude/projects/-home-raphael-desarrollo-onmind-marketing/memory/`

## Convenciones de desarrollo
- `docs/operacion/convenciones-desarrollo.md` — arquitectura por capas, naming, patrones
- Replica las convenciones del repo principal de OnMind para coherencia entre proyectos
- **Regla clave:** Services → Prisma, Actions → Services, API Routes solo para externos

## Docs del producto (en el repo de OnMind)
- `/home/raphael/desarrollo/onmind/docs/onmind-prd.md` — PRD
