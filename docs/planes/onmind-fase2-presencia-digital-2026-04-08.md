# OnMind — Fase 2: Presencia Digital

> Establecer la presencia digital de OnMind: landing con contenido real, perfil de Instagram, y herramientas de marketing automatizadas.

**Autor:** Raphael & Claude AI
**Fecha:** 2026-04-08

---

## Contexto

Fase 1 (Branding) completa y validada. OnMind tiene identidad visual, tono de voz y guía de marca. Ahora necesita presencia digital: una landing que refleje el producto actual y un canal de comunicación en redes.

Decisión estratégica: Raphael toma la parte de marketing como experimento, usando herramientas de IA y automatización para crear un sistema de contenido de calidad con mínima intervención manual. Siempre con aprobación humana antes de publicar.

## Líneas de trabajo

### A. Tooling: Skills de marketing para Claude Code
**Prioridad: primera** — lo que descubramos acá influye en cómo ejecutamos todo lo demás.

| Paso | Qué | Detalle |
|------|-----|---------|
| A1 | Investigar skills existentes | Buscar skills/MCP servers de marketing, copy, diseño, redes en el ecosistema Claude Code |
| A2 | Evaluar y seleccionar | Definir cuáles son útiles para OnMind (landing copy, contenido Instagram, etc.) |
| A3 | Instalar y/o adaptar | Copiar, adaptar o crear skills propios según necesidad |

**Entregable:** Set de herramientas de marketing listas para usar en este proyecto.

**Visión a futuro:** Estos skills no son solo para la landing — servirán para el proceso de creación de contenido recurrente (semanal) que se establecerá más adelante.

---

### B. Landing page (contenido primero, diseño después)
**Prioridad: segunda**

| Paso | Qué | Detalle |
|------|-----|---------|
| B1 | Auditar landing actual | Revisar onmindcrm.com, identificar qué sirve y qué no |
| B2 | Definir estructura y contenido | Secciones, copy, CTAs — basado en funcionalidades reales de OnMind |
| B3 | Plasmar en formato estructurado | JSON/markdown con el contenido completo, sin diseño todavía |
| B4 | Generar 3 versiones visuales | Mismo contenido (B3), 3 propuestas de diseño distintas para elegir |
| B5 | Implementar versión elegida | Desarrollar la landing final con la versión seleccionada |

**Entregable B3:** "Wireframe de contenido" — estructura + copy en formato consumible por un agente de diseño.
**Entregable B4:** 3 versiones visuales de la landing (mismo contenido, distinto diseño).
**Entregable B5:** Landing implementada y publicada.

**Funcionalidades clave a comunicar (basado en el producto actual):**
- Conectás tu WhatsApp real (QR, tu número, sin servicios externos costosos)
- Gestión de contactos con categorización (A+, A, B, C, D, R)
- Automatizaciones configurables (fechas especiales, etiquetas, categorías, plan de seguimiento)
- Campañas manuales segmentadas
- Templates de mensajes con variables personalizables
- Conversaciones centralizadas con historial completo
- Arrancás en minutos, no en semanas

---

### C. Instagram (desde cero, bien hecho)
**Prioridad: tercera**

| Paso | Qué | Detalle |
|------|-----|---------|
| C1 | Configurar perfil | Bio, foto de perfil (logo), highlights, enlace a landing |
| C2 | Definir estrategia de contenido | Pilares, frecuencia, formatos, audiencia objetivo |
| C3 | Crear primeras publicaciones | Contenido de lanzamiento del perfil (3-5 posts iniciales) |

**Entregable:** Perfil de Instagram activo con identidad visual y primeras publicaciones.

---

## Orden de ejecución

```
A (Tooling) ──→ B (Landing) ──→ C (Instagram)
     │                │
     └── Se usa en ───┘── Se usa en ──→ C
```

El tooling se arma primero porque se usa en las otras dos líneas. La landing va antes de Instagram porque queremos tener adónde mandar a la gente cuando vean el perfil.

## Qué NO incluye esta fase

- Proceso de contenido recurrente semanal (será una fase posterior, usando los skills de esta fase)
- Otras redes sociales (solo Instagram por ahora)
- Paid ads / pauta publicitaria
- Email marketing

---

*Siguiente acción: evaluar resultados de investigación de skills y definir tooling.*
