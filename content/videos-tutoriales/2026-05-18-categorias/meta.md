---
slug: 2026-05-18-categorias
title: Tutorial — Categorías
feature: categorias
date: 2026-05-18
duration_sec: 122
voice_id: s4W8kh4jMEsHFHA7NqXQ
template_used: B BUSCADORES 1 (Martin Sedes)
nombres_renderizados: [María Rodríguez, Carlos González, Sofía Acosta]
status: draft
---

# Tutorial — Categorías

## Guion

Estas son las Categorías de OnMind.

Una Categoría agrupa contactos por la frecuencia con que querés mantenerte presente.

En vez de pensar mensaje por mensaje, definís una sola vez al año cuánto querés aparecer en la vida de cada grupo de clientes. OnMind se encarga del resto.

La idea es simple: tus contactos no son todos iguales.

Hay clientes activos que merecen presencia constante, hay cartera tibia que conviene tocar cada tanto, y hay postventa que necesita aparecer en momentos clave.

Las Categorías son la forma de OnMind para que esa diferencia se traduzca en mensajes reales, sin que tengas que armar agendas a mano.

Entrás a Contactos, Configuración, Categorías.

Para cada Categoría definís tres cosas. Un nombre, cuántos mensajes al año va a recibir cada contacto del grupo, y qué plantillas se van a usar.

Por ejemplo: Clientes activos, doce mensajes al año. Cartera tibia, seis. Postventa, cuatro.

Las plantillas que asignás se usan en rotación. En la categoría Buscadores, Martín tiene doce plantillas distintas. Una para cada mensaje del año.

Cuando llega el momento de enviar, OnMind toma la plantilla que toca, la personaliza con el nombre de cada contacto, y la programa.

Los mensajes de categoría caen en días hábiles. Fines de semana y feriados no se tocan, porque la presencia tiene que llegar cuando la persona está conectada a su WhatsApp profesional.

Asignar un contacto a una Categoría es un campo más en su ficha. Si después cambiás de idea, lo movés a otra Categoría y OnMind reajusta su calendario.

Configurás las Categorías una sola vez. El calendario entero del año queda armado.

Definí la frecuencia. Olvidate del resto.

## Plan de escenas

| # | Frames | Tiempo | Contenido |
|---|---|---|---|
| 1 | 0-90 | 0-3s | Title — "Categorías" + subtítulo "El motor de la presencia anual." |
| 2 | 90-690 | 3-23s | Definición — card "Una Categoría agrupa contactos por frecuencia" + sub "Definís una vez al año" + cierre "OnMind se encarga del resto." |
| 3 | 690-1320 | 23-44s | 3 tipos de contactos — Clientes activos / Cartera tibia / Postventa con ícono y caption + cierre "Las Categorías traducen esa diferencia en mensajes reales." |
| 4 | 1320-1740 | 44-58s | Path + form — breadcrumb Contactos › Configuración › Categorías + form con 3 campos resaltados secuencialmente (Nombre, Mensajes al año, Plantillas) |
| 5 | 1740-1950 | 58-65s | Frecuencias — 3 cards con count-up: Clientes activos 12, Cartera tibia 6, Postventa 4 |
| 6 | 1950-2550 | 65-85s | Rotación — header "Buscadores · 12 plantillas" + plantilla cruda con {nombre} → renderizada para María Rodríguez |
| 7 | 2550-2970 | 85-99s | Calendario hábiles — grid marzo 2026 con 4 envíos en días hábiles, fines de semana en gris + leyenda |
| 8 | 2970-3300 | 99-110s | Asignar contactos — 3 filas de contactos con chip Categoría, María cambia de Buscadores → Postventa + toast "Calendario reajustado" |
| 9 | 3300-3570 | 110-119s | Cierre — "Configurás las Categorías una sola vez." → "Definí la frecuencia." → "Olvidate del resto." |
| 10 | 3570-3660 | 119-122s | Outro — @OnMindApp + barra teal |

## Notas / decisiones de diseño

- **Densidad cómoda:** ~2.5 wps efectivos (con pausas SSML entre bloques). Se siente respirado, no apurado.
- **Pausas SSML:** se usaron `<break time="X.Xs" />` entre bloques (0.3–0.9s). Sin esas pausas la voz quedaba atropellada. [[feedback-tts-breaks]]
- **Sin contraste con mensajes de fecha exacta:** la mención "días hábiles, sin fines de semana ni feriados" aplica solo a mensajes de categoría. Se evita meter el contraste con cumple/aniversario/cierre para no abrir un tema lateral. Queda para un futuro tutorial de Fechas. [[project-mensajes-dias-habiles]]
- **Categorías ejemplo:** Clientes activos / Cartera tibia / Postventa son nombres ilustrativos (no son las que tiene literalmente Martín, pero suenan reales para una inmobiliaria). "Buscadores" sí es real y tiene 12 plantillas verificadas en la DB.
- **Convención `{nombre}`:** en escena 6 se muestra la plantilla cruda con `{nombre}` resaltado y la versión renderizada con "María" reemplazando la variable.
- **Calendario mes ejemplo:** marzo 2026, 4 envíos en días hábiles distribuidos. Es una visualización ilustrativa de cómo se ve el resultado, no calcado de un dato real.
