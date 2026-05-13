# Canal de YouTube OnMind

**Autor:** Raphael
**Fecha:** 2026-05-11
**Estado:** canal creado y configurado, listo para primer video

---

## Identidad

| | |
|---|---|
| **Nombre** | OnMind |
| **Handle** | `@OnMindApp` |
| **URL** | https://www.youtube.com/@OnMindApp |
| **Tipo de cuenta** | Brand Account (creado desde cuenta personal de Raphael) |
| **Ángulo de posicionamiento** | Foco en el problema: "mantener vivo el vínculo con tus clientes" |

## Pilares de contenido (etapa inicial)

**Pilar único: Tutoriales OnMind.** Cómo usar el producto, paso a paso. Tutoriales sueltos por feature, sin un orden estricto de consumo.

Pilares pospuestos para fases siguientes:
- **Vínculo con clientes** (educativo top-funnel) — cuando el motor de tutoriales esté corriendo solo.
- **Casos reales / Detrás del producto** — oportunista, cuando aparezca material orgánico.

**Razón para arrancar chico:** el costo de producir contenido educativo extra (no tutoriales) requiere energía que hoy está en el producto. Mejor un canal honesto y útil que un canal ambicioso que no se sostiene.

## Estructura de playlists

- **1 playlist única: "Tutoriales OnMind"** — se crea al subir el primer video.
- Re-evaluación: cuando haya 8-10 videos, mirar el patrón natural de agrupación y partir en sub-playlists temáticas (Plantillas, Categorías, Reportes, etc.) si emerge una estructura clara. **No anticipar.**

## Pestaña Inicio

Apagada hasta tener 3+ videos. Cuando se active, orden sugerido de secciones:
1. **Listas de reproducción creadas** (Tutoriales OnMind arriba)
2. **Vídeos**
3. **Para ti**

## Assets visuales

Todos en `public/youtube/` (generados con `scripts/generate-youtube-assets.ts`):

| Asset | Tamaño | Diseño |
|---|---|---|
| `avatar.png` | 800×800 | Fondo teal `#007056` + isotipo blanco |
| `banner.png` | 2560×1440 | Gradiente teal → teal hover, safe zone 1546×423 con isotipo + tagline + bajada |
| `watermark.png` | 150×150 | Círculo teal con isotipo blanco (visible sobre cualquier fondo) |

Para regenerar (cambios de tagline, paleta, etc.): `npx tsx scripts/generate-youtube-assets.ts`

## Textos del canal

### Descripción

```
Mantenemos vivo el vínculo con tus clientes.

Automatizamos los mimos, recordatorios y mensajes que hacen que tus clientes te elijan de nuevo.

Acá vas a encontrar:
• Tutoriales de OnMind
• Ideas para no perder clientes
• Casos reales del sector inmobiliario

Probalo gratis: onmindcrm.com
```

### Palabras clave

`onmind, whatsapp business, fidelización de clientes, vínculo con clientes, automatización whatsapp, marketing inmobiliario, postventa, retención de clientes, mensajes automáticos, plantillas whatsapp`

### Enlaces visibles en banner

- Sitio web: `https://onmindcrm.com`
- Instagram: `https://instagram.com/OnMindApp`

## Buenas prácticas para los primeros videos

### Duración
- Tutoriales: **5-8 minutos** ideal. Específicos. Un tutorial = una cosa que aprender.
- Si una funcionalidad es larga, partirla en varios videos cortos en lugar de uno largo.

### Título
- Usar palabra clave clara + valor: "Cómo crear tu primera plantilla en OnMind"
- Evitar clickbait: la audiencia objetivo es profesional, no público masivo.
- Sin números de tutorial en el título ("Tutorial #1") — limita el orden de consumo.

### Miniatura (thumbnail)
- 1280×720 px
- Texto grande, legible en mobile
- Color teal de marca + screenshot de la UI o ícono claro
- Evitar caras genéricas — usar el nombre de la feature como protagonista visual

### Descripción del video
- Primera línea: gancho que continúe el título
- Bloque con resumen + bullets de pasos clave
- CTA al final: "Probalo gratis: onmindcrm.com"
- Hashtags al final: `#OnMind #WhatsApp #FidelizaciónDeClientes`

### Tarjetas y pantalla final
- Cada video debería terminar con tarjeta a otro tutorial relacionado
- Pantalla final: suscribirse + último video subido

### Cadencia
- **No comprometer una frecuencia.** Subir cuando un tutorial esté bien hecho.
- 1 buen tutorial por mes > 4 mediocres.

## Checklist para el primer video

- [ ] Grabar tutorial (5-8 min)
- [ ] Editar (cortar pausas largas, intro mínima si la hay)
- [ ] Diseñar miniatura on-brand
- [ ] Escribir título, descripción y tags
- [ ] Subir al canal
- [ ] Crear playlist "Tutoriales OnMind" y agregar el video
- [ ] Configurar tarjetas y pantalla final
- [ ] Marcar "Apto para todo el público" en audiencia
- [ ] Publicar

## Próximos pasos (después del primer video)

1. Activar Pestaña Inicio cuando haya 3+ videos.
2. Re-evaluar estructura de playlists cuando haya 8-10 videos.
3. Invitar a Martín como administrador del Brand Account: https://myaccount.google.com/brandaccounts → OnMind → Administrar permisos.
4. Cuando el motor de tutoriales esté funcionando (cadencia validada), evaluar abrir Pilar 2 (Vínculo con clientes).

## Referencias

- Script de generación de assets: `scripts/generate-youtube-assets.ts`
- Textos del canal (versión para copiar): `copy-paste.txt`
- Guía de marca: `docs/branding/onmind-guia-de-marca-2026-04-07.md`
