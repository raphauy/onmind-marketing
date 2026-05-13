---
slug: 2026-05-12-contactos
title: Tutorial — Contactos
feature: contactos
date: 2026-05-12
duration_sec: 72
voice_id: s4W8kh4jMEsHFHA7NqXQ
pillar: educacion
nombres_renderizados: [Lucía Pereira, Carlos González, María Rodríguez, Sofía Acosta, Andrés Pereira]
status: draft
---

# Tutorial — Contactos

Walkthrough completo del módulo de Contactos en OnMind. Cubre cómo se construye la base (importación CSV inicial + creación automática vía WhatsApp para los nuevos), la riqueza de la ficha del contacto, los filtros y cómo la combinación de todo eso permite armar audiencias relevantes para cada mensaje.

## Guion

```
Estos son los Contactos de OnMind.

Tu base de clientes ya existe.
La traés con un archivo CSV.
Nombres, teléfonos, fechas, lo que tengas.
En cuatro pasos quedó adentro: subir, mapear, previsualizar y confirmar.
Y si un teléfono ya existía, OnMind no duplica.
Actualiza los datos.

Los nuevos no los cargás vos.
Cuando alguien te escribe por WhatsApp,
y su número no está en tu base,
el contacto se crea solo.
Toma el nombre desde el perfil, la foto,
y queda listo para empezar a trabajarlo.

Y la ficha guarda lo que importa de cada persona.
Cumpleaños, si tiene hijos, sus hobbies,
su profesión, dónde lo conociste,
el motivo del primer contacto.
Cada campo se edita con un clic.
Sin formularios largos.

Y todo eso se vuelve filtro.
Categoría, etiquetas, operación,
profesión, origen, fechas especiales.
Los combinás como quieras.
Y la búsqueda queda en la URL.
La podés guardar, o compartir con tu equipo.

Así decidís quién recibe qué.
El Día del Padre va a los padres.
El aniversario de compra,
a los que cerraron operación este mes.
Cada mensaje, a quien tiene sentido.

Una base que conoce a tus clientes.
Y se acuerda de cada uno por vos.
```

190 palabras · audio 67.79s (~2.8 wps) · total video 72s.

## Capítulos YT

```
0:00 Intro
0:02 Importar tu base con CSV
0:16 Creación automática vía WhatsApp
0:28 Ficha rica del contacto
0:41 Filtros que se vuelven audiencia
0:54 Quién recibe qué
1:04 Cierre
```

## Plan de escenas

| # | Frames | Tiempo | Contenido |
|---|---|---|---|
| 1 | 0-75 | 0-2.5s | Título "Contactos" + sub "Tu base, viva." |
| 2 | 75-480 | 2.5-16s | Importación CSV: archivo con 4 contactos + 4 pasos con check secuencial + chip "Si el teléfono ya existía, actualiza" |
| 3 | 480-855 | 16-28.5s | Burbuja WhatsApp entrante → tarjeta de Lucía Pereira que se materializa con foto, nombre y chip "WhatsApp · Mensaje entrante" pulsando + sub "Sin formularios. Sin cargas manuales." |
| 4 | 855-1245 | 28.5-41.5s | Ficha de Carlos González con 6 campos en 2 columnas, highlights secuenciales en Cumpleaños, Es padre, Hobbies, Profesión, Origen, Motivo del primer contacto |
| 5 | 1245-1620 | 41.5-54s | 6 chips de filtros con stagger (Categoría, Etiquetas, Operación, Profesión, Origen, Fechas especiales) + URL real `onmindcrm.com/contactos?categoria=comprador&mes=marzo` + "Guardala. Compartila con tu equipo." |
| 6 | 1620-1920 | 54-64s | 2 cards de audiencia con count-up: Día del Padre → 38 y Aniversario de compra → 12, sub "Cada mensaje, a quien tiene sentido." |
| 7 | 1920-2070 | 64-69s | Cierre: "Una base que conoce a tus clientes. / Y se acuerda de cada uno por vos." |
| 8 | 2070-2160 | 69-72s | Outro @OnMindApp |

## Notas / decisiones de diseño

- **Decisión clave del guion:** se descartó el momento "Crear contacto manual" porque no representa el uso real. Los agentes inmobiliarios traen su base con CSV al onboarding y los nuevos entran solos vía WhatsApp. Mostrar el alta manual transmitía idea errónea de fricción.
- **Equipo de fútbol** se quitó del filtro y de la ficha visible — no es central para el mensaje.
- **Confirmación en código:** la creación automática vía WhatsApp está implementada en `onmind/src/services/evolution-webhook-service.ts:396` (al recibir un mensaje de un número desconocido, `createContact` se invoca con firstName/lastName del pushName, foto de perfil, y `originDetail: "WhatsApp - Mensaje entrante"`).
- **Iteración de timing:** la primera versión (44s con 124 palabras, ~2.8 wps) se sintió apurada porque las escenas eran estáticas. Solución: ampliar a 67s con 190 palabras + agregar micro-momentos secuenciales en cada escena (sub-textos, highlights, chips extra). El video resultante respira.
- **Sin "CRM"**, sin guion largo, sin emojis en visuales. Outro @OnMindApp.
- **Composiciones:** `src/remotion/templates/TutorialContactos.tsx` (16:9) y `TutorialContactos9x16.tsx` (Reel). Registradas como `tutorial-contactos` y `tutorial-contactos-9x16` en `Root.tsx` y `config.ts`.
