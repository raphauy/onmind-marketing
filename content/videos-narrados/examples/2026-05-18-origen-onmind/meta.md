---
slug: 2026-05-18-origen-onmind
title: Cómo nació OnMind — de una visita a un amigo
pillar: detras_de_escena
date: 2026-05-18
duration_sec: 76
voice_id: s4W8kh4jMEsHFHA7NqXQ
music_track: 02-cinematic.mp3
hook: Hace 5 meses, OnMind no existía. Hoy lo usan 16 agentes inmobiliarios.
status: draft
---

# Cómo nació OnMind — de una visita a un amigo

## Contexto

Primer video del pilar **detrás de escena** (gap más grande vs target: -6 puntos). Cuenta el origen real de OnMind desde la visita inicial de Raphael a Martín en diciembre 2025 hasta el estado actual del producto en mayo 2026.

Es un video humano: no vende features, vende la historia. Acerca la marca y muestra que OnMind no es un producto inflado por marketing sino algo nacido de un problema real, construido en dos meses y validado por su primer usuario.

## Datos clave usados

- **Diciembre 2025:** Raphael visita a Martín para ofrecerle otro software. Martín plantea otro problema.
- **Problema:** 2 personas full time enviando WhatsApp a mano. Planilla, WhatsApp web, olvidos diarios.
- **Febrero 2026:** primera versión en producción.
- **Primer importe:** ~1.000 contactos
- **Hoy (mayo 2026):** Martín tiene más de 2.000 contactos. Todos los nuevos entran por WhatsApp, categorizados, con mensajes programados para los próximos 12 meses.
- **Escala actual:** 16 agentes usando, 10 más empiezan esta semana, interés en UY y AR.

## Estructura narrativa

| Tiempo | Bloque | Contenido |
|---|---|---|
| 0-6s | Hero | "OnMind no nació de una idea. Nació de una visita." |
| 6-14s | La visita | Diciembre 2025, un amigo agente inmobiliario, otra agenda |
| 14-21s | El problema | 2 personas full time mandando WhatsApp a mano |
| 21-27s | El caos | Planilla, web abierta, olvidos diarios |
| 27-32s | Decisión | Volvimos a casa, pensamos y construimos |
| 32-37s | Release | Febrero 2026: primera versión |
| 37-45s | Primer dato | Importó 1.000 contactos |
| 45-47s | Beat de tiempo | Pasaron 3 meses |
| 47-58s | Hoy | +2.000 contactos, categorizados, mensajes programados |
| 58-65s | Escala | 16 agentes + 10 esta semana |
| 65-76s | Cierre + Outro | "Lo que arrancó como una charla..." + @OnMindApp |

## Producción

- **Audio:** 70s de voz + 2s delay inicial + fade-out = 76s total
- **Música:** `02-cinematic.mp3` loopeado (track original 42s → loop a 76s)
- **Pausas:** uso intensivo de `<break time="Xs" />` entre bloques para dejar respirar visuales
- **Composición:** 12 escenas con offset +2s en todos los timings (corrección crítica detectada en esta sesión)

## Aprendizajes incorporados al skill

1. **Breaks de ElevenLabs:** los saltos de línea por sí solos no generan pausas marcadas. Hay que usar `<break time="Xs" />` (max 3s, doc oficial). 0.4-0.5s entre frases, 1.0-1.2s entre escenas, 1.5s antes de datos clave.
2. **Offset +2s en composición:** los timestamps del forced alignment están sobre `voz.mp3`, pero la pista de audio es `mezcla.mp3` con delay 2s. Todos los timings GSAP deben sumar +2s.
3. **Loop de música:** cuando el audio supera la duración del track del library (38-42s), pre-procesar con `ffmpeg -stream_loop` antes de mezclar.
