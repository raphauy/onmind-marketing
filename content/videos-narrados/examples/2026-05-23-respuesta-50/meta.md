---
slug: 2026-05-23-respuesta-50
title: Uno de cada dos mensajes de OnMind tiene respuesta
pillar: producto
date: 2026-05-23
duration_sec: 42
voice_id: s4W8kh4jMEsHFHA7NqXQ
music_track: 01-tech-modern.mp3
hook: Más de mil mensajes en tres meses. Uno de cada dos fue respondido.
status: draft
---

# Uno de cada dos mensajes de OnMind tiene respuesta

## Contexto

Pieza pilar **producto en acción**. Muestra el resultado más fuerte que tenemos hoy del producto: la tasa de respuesta agregada de los mensajes que OnMind dispara. El ángulo es educativo (por qué responden) sin caer en pitch de venta.

Datos del agente "spotlight" (Martín Sedes, anonimizado como "un agente inmobiliario"), snapshot 23 may 2026, ventana 90 días — traídos por el script `marketing-team-stats.ts` en el repo de producto.

## Datos clave usados

- **1.010 mensajes enviados en los últimos 90 días** (redondeado a "más de mil")
- **513 respondidos** → **50,8% tasa de respuesta** (redondeado a "uno de cada dos" / "cincuenta por ciento")
- Ventana: 22 feb 2026 → 23 may 2026
- Período comunicado en el guion: "tres meses"

Datos obtenidos por `.claude/skills/crear-video-narrado/scripts/fetch-product-stats.sh --days 90` (creado en esta sesión, queda como herramienta del skill para próximos videos).

## Decisiones de copy

- **No mencionar "equipo" ni cantidad de agentes:** decisión del usuario en sesión (todavía no se divulga la escala del producto). Se enmarca como "un agente inmobiliario".
- **Benchmark sin número específico:** "en WhatsApp de negocio, eso casi no se ve" — defendible sin fuente de mercado.
- **Cierre sin breaks SSML:** "No interrumpe. Recuerda. Por eso responden." se dejó con puntos simples porque los breaks marcaban una entonación cortada. Confirmado por usuario tras escuchar.

## Estructura narrativa

| Tiempo (mezcla) | Bloque | Contenido |
|---|---|---|
| 2.0 - 8.5s | S0 | "Un agente inmobiliario usando OnMind" + stats: 1.010 mensajes / 3 meses |
| 8.5 - 14.0s | S1 | "Uno de cada dos fue respondido" + count-up 0→50% |
| 14.0 - 17.5s | S2 | "En WhatsApp de negocio, eso casi no se ve" — comparativa visual |
| 17.5 - 23.0s | S3 | "¿Por qué? No son mensajes fríos. Ya lo conocen." |
| 23.0 - 27.0s | S4 | "OnMind dispara los mensajes en el momento justo" |
| 27.0 - 33.0s | S5 | Tres momentos: cumpleaños / aniversario firma / saludo después de meses |
| 33.0 - 38.0s | S6 | "No interrumpe. Recuerda." → "Por eso responden." |
| 38.0 - 42.0s | Outro | @OnMindApp + tagline |

## Producción

- **Audio:** 35.1s de voz + 2s pre-roll música + ~5s tail = 42s mezcla
- **Música:** `01-tech-modern.mp3` loopeado a 42s (`-stream_loop 1`). Mood "datos duros" que matchea con count-up. Rotación ajustada vs `rutina-diaria` (20/05) pero el fit creativo prevaleció.
- **Composición:** 7 escenas + outro, todas con offset +2s sobre los timestamps del forced alignment
- **Render:** 1080x1920, 30fps, ~3MB

## Aprendizajes incorporados al skill

1. **Script `fetch-product-stats.sh`:** creado en esta sesión. Vive en `.claude/skills/crear-video-narrado/scripts/` y wrappea `scripts/marketing-team-stats.ts` del repo de producto. Permite traer datos frescos sin pedirle al usuario. Skill actualizado para usarlo en Paso 3.
2. **Cierre con puntos simples > breaks:** cuando la voz tiene que cerrar con frases cortas encadenadas (resolución), los breaks largos cortan la entonación. Mejor dejar puntos limpios y que el TTS module la cadencia.
