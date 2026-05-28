---
slug: 2026-05-23-automatizaciones
title: Tutorial — Automatizaciones
feature: automatizaciones
date: 2026-05-23
duration_sec: 97
voice_id: s4W8kh4jMEsHFHA7NqXQ
template_used: Pauta Pocitos (regla real de Martín)
nombres_renderizados: [María Rodríguez, Javier Silva, Laura Pereira, Carlos González, Sofía Acosta, Andrés Pereira, Valentina López]
status: draft
---

# Tutorial — Automatizaciones

## Guion

Estas son las Automatizaciones de OnMind. Cómo trabajan en el día a día.

Cuando alguien responde a tu pauta de Meta Ads por WhatsApp, OnMind reconoce el texto disparador de esa pauta y arma un lead automáticamente.

Apenas llega el mensaje, el lead aparece en estado Nuevo. Ya con la categoría que definiste para esa pauta y las etiquetas que aplican.

A los dos minutos por defecto sale el primer mensaje. Una bienvenida con el link o la información concreta de la propiedad. El lead pasa a En seguimiento.

Si el contacto no responde, cuarenta y ocho horas después sale un recordatorio. Siempre dentro de la franja laboral, entre las diez de la mañana y las siete de la tarde.

Si responde con algo real, no un simple sí o un emoji, el lead pasa a Conversando y los seguimientos pendientes se cancelan solos.

Cada pauta es una regla. Definís el texto disparador, la categoría, las etiquetas, los dos mensajes de seguimiento y cuánto tiempo esperar entre cada uno. Se configura una sola vez y queda corriendo.

Todos los leads se ven en un tablero. Vista Kanban para arrastrar, vista Tabla para revisar y filtrar.

Cada respuesta a una pauta entra al flujo. Sin que tengas que mover un dedo.

## Plan de escenas

| # | Escena | Tiempo | Idea visual |
|---|---|---|---|
| 1 | Title | 0–7s | "Automatizaciones" + sub "Cómo trabajan en el día a día" (incluye 2s de pre-roll) |
| 2 | Detección | 7–18s | Bubble WhatsApp con trigger "Pocitos" resaltado → tarjeta de lead nuevo aparece |
| 3 | Estado Nuevo | 18–29s | Tarjeta del lead con categoría B, tag Pocitos, label "Estado: Nuevo" |
| 4 | Seguimiento 1 | 29–41s | Reloj "2 min" (configurable) + bubble OnMind bienvenida + estado pasa a En seguimiento |
| 5 | Seguimiento 2 | 41–54s | Reloj "48 hs" + bubble recordatorio + franja horaria 10–19h visualizada |
| 6 | Conversando | 54–65s | Bubble entrante del contacto → estado pasa a Conversando + cancelados |
| 7 | Crear regla | 65–79s | Form "Nueva regla" con campos highlighteados secuencialmente |
| 8 | Tablero | 79–88s | Kanban con 4 columnas + filtros + toggle Kanban/Tabla |
| 9 | Cierre | 88–94s | "Cada respuesta entra al flujo. Sin que tengas que mover un dedo." |
| 10 | Outro | 94–97s | @OnMindApp + barra accent |

## Notas / decisiones de diseño

- **Pauta de ejemplo:** "Pauta Pocitos" usando datos reales de la regla activa de Martín (trigger "Quiero más información de Pocitos", 23 leads acumulados). Texto del Seguimiento 1 acortado para legibilidad en pantalla.
- **Tiempos configurables:** se marca explícitamente en Seg 1 ("por defecto") y en Crear regla ("cuánto tiempo esperar entre cada uno"). Los defaults reales del producto son 2 min y 48 hs.
- **Personajes:** lead principal María Rodríguez aparece en escenas 2, 3 y 6 para mantener continuidad narrativa. El tablero introduce otros nombres realistas para mostrar variedad.
- **Franja horaria 10–19h:** representada como timeline diaria con franja teal entre 41,6% y 79,1% (proporción real de las horas dentro de las 24h).
- **Sin "CRM"**, sin guion largo, sin emojis (el rayo del header del form es SVG inline). Handle solo en el outro.
- **Pre-roll de 2s** envolviendo el `<Audio>` en `<Sequence from={60}>` para evitar el "arranque de sopetón".
