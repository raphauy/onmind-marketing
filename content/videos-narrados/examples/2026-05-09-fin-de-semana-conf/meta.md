---
slug: 2026-05-09-fin-de-semana-conf
title: Cómo se arma un año de mensajes en un fin de semana
pillar: educacion
date: 2026-05-09
duration_sec: 48
voice_id: s4W8kh4jMEsHFHA7NqXQ
music_track: 03-lofi-warm.mp3
hook: Un fin de semana de trabajo. Y todo el año queda armado.
status: draft
---

# Cómo se arma un año de mensajes en un fin de semana

## Contexto

Pieza pilar educación. Muestra el proceso operativo de configuración inicial de OnMind con datos reales de un agente (Martín Sedes, anonimizado), traducido a tres pasos: ordenar contactos, definir frecuencia, armar plantillas. La promesa: una vez configurado, el agente no escribe ni piensa mensajes durante el año.

El cierre suaviza la barrera de entrada: el "fin de semana" es el caso de configuración trabajada (custom). Para un agente que arranca con plantillas por defecto, un día alcanza.

## Datos clave usados

Período de referencia: configuración Team Sedes (snapshot 9 may 2026)

- **49 plantillas activas** (1 cumpleaños + 2 fecha especial + 6 seguimiento + 40 categoría)
- **11 categorías** de contactos (A, A+, AC, B, BA, C, Colegas, D, O, R, V)
- **1.948 contactos activos** (redondeado a 1.900 en narración para fluir)
- **Frecuencias por categoría:** A=6, A+=6, B=12, C=6, R=6, V=12 mensajes/año (rango 6 a 12)
- **6.181 mensajes pendientes** programados para los próximos 12 meses
- **849 enviados** en lo que va del año, **53% tasa de respuesta** (no se mostró en el video, pero respalda)

## Tiempos de configuración

- Martín (configuración bien trabajada, custom): **un fin de semana**
- Agente promedio con plantillas por defecto: **un día**

## Estructura narrativa

1. **Hook (1.4-6.4s):** "Un fin de semana de trabajo. Y todo el año queda armado." + sub "Un agente real lo hizo así"
2. **Paso 1 (6.5-13.4s):** Ordenó 1.900 contactos en 11 categorías. Visual: dos stat-blocks + grid de chips de categorías.
3. **Paso 2 (13.5-22.0s):** Definió frecuencia: 6× al año para los más importantes, 12× para los que están en plena operación.
4. **Paso 3 (22.2-31.4s):** 49 plantillas, una por momento del vínculo. Cumpleaños, aniversario, fin de año, post-firma.
5. **Output (31.5-37.6s):** **6.181 mensajes** programados para los próximos 12 meses (count-up grande, frame del thumbnail).
6. **Triple anáfora (37.6-42.6s):** No tiene que escribir ni uno. No tiene que recordar ninguna fecha. No tiene que pensar qué decir.
7. **Bonus honestidad (42.6-45.6s):** Si arrancás con plantillas por defecto, un día alcanza.
8. **Outro (45.6-48s):** @OnMindApp + tagline.

## Notas técnicas

- Renderer: HyperFrames + ElevenLabs (TTS + Music)
- Resolución: 1080x1920 (9:16 Reels)
- Duración: 48s (voz 43.6s + 2s pre-roll música + 2s tail visual)
- Mezcla audio: voz delay 2s, música a 0.30 (~ -10.5dB), fade-out 2s al final
- Música: 03-lofi-warm.mp3 (mood "trabajo metódico de fin de semana", rotando respecto a tech-modern y cinematic)
- Composición HTML monolítica (lint warning aceptado)
- Thumbnail: frame del count-up a 6.181 (segundo 36)
