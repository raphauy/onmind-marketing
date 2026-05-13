---
slug: 2026-05-11-templates
title: Tutorial — Templates
feature: templates
date: 2026-05-11
duration_sec: 24
voice_id: s4W8kh4jMEsHFHA7NqXQ
template_used: "Cumpleaños (arquetípica, no DB)"
nombres_renderizados: [María Rodríguez, Carlos González, Sofía Acosta]
status: generated
piece_slug: 2026-05-11-templates
video_in_db: output-9x16.mp4
---

# Tutorial — Templates

Video corto que explica el concepto central de los Templates en OnMind: escribir el mensaje una sola vez con la variable `{nombre}` y dejar que el producto genere mensajes personalizados a cada contacto.

## Guion

```
Estos son los Templates de OnMind.

La idea es simple: escribís el mensaje una sola vez.

Donde va el nombre del contacto, ponés llaves nombre.

Y listo. OnMind lo arma personalizado para cada persona.

Una plantilla. Mil mensajes únicos.

Tu cliente recibe algo que parece escrito para él. Y en parte, lo es.
```

53 palabras · audio 19.07s · total video 24s.

## Plan de escenas

| # | Frames | Tiempo | Contenido |
|---|---|---|---|
| 1 | 0–75 | 0–2.5s | Título "Templates" + subtítulo |
| 2 | 75–195 | 2.5–6.5s | Número "1" gigante en teal + "Escribís el mensaje una sola vez." |
| 3 | 195–315 | 6.5–10.5s | Editor de template (categoría "Cumpleaños") con chip `{nombre}` pulsando en teal |
| 4 | 315–450 | 10.5–15s | 3 tarjetas renderizadas con stagger: María, Carlos, Sofía |
| 5 | 450–540 | 15–18s | "1 plantilla → 1000 mensajes únicos" con count-up |
| 6 | 540–660 | 18–22s | Cierre: "Tu cliente recibe algo que parece escrito para él. Y en parte, lo es." |
| 7 | 660–720 | 22–24s | Outro @OnMindApp |

## Notas / decisiones de diseño

- **Plantilla arquetípica**, no extraída de la DB de Martín (la conexión a Neon falló en el momento del armado). El texto "¡Feliz cumpleaños, {nombre}! Que tengas un día hermoso rodeado de los tuyos. Un abrazo grande." es plausible para el rubro inmobiliario y matchea la categoría "Cumpleaños" del producto.
- **Convención `{nombre}`** aplicada: la escena 3 muestra el template crudo con la variable resaltada como chip teal; la escena 4 muestra los mensajes renderizados con el nombre concreto en color teal (refuerzo visual de "se reemplaza acá").
- **Tres nombres** (María, Carlos, Sofía) para reforzar la idea de personalización a escala. Iniciales del avatar matchean el nombre completo (MR, CG, SA).
- **Sin "CRM"**, sin guion largo, sin emojis. Outro @OnMindApp.
- **Composición:** `src/remotion/templates/TutorialTemplates.tsx`. Registrada como `tutorial-templates` en `Root.tsx` y `config.ts`.
