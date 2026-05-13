# Log de trabajo — OnMind Marketing

## 2026-05-12
- **Skill `crear-video-tutorial` consolidado y enriquecido.**
  - Sin tope rígido de duración: el video lleva el tiempo necesario para enseñar bien la feature. Reels 9:16 son cortos derivados, no sustituto del master 16:9 (educativo, landing/YouTube).
  - Reel 9:16 dedicado por video: composición Remotion separada (`tutorial-<feature>-9x16`), 1080x1920, layout vertical (cards apiladas, stat en columna, `whiteSpace: nowrap` para chips inline). Comparte el mismo `voz.mp3` del master.
  - Persistencia en DB: `scripts/save-video-tutorial.mjs` crea Template REMOTION (`tutorial-video-remotion`) + Piece GENERATED + Generation, sube assets a Vercel Blob.
  - Assets para YouTube: `scripts/generate-youtube-assets.mjs` extrae frame del master, renderiza thumbnail con composición Remotion paramétrica `TutorialThumbnailYT` (1280x720), genera `youtube.md` con título + descripción + capítulos automáticos desde meta.md + tags + configuración recomendada.
  - Lecciones documentadas en SKILL.md:
    - **Densidad cómoda:** 2.8-3.2 wps. Si el video se siente apurado, **ampliar el guion** (no acelerar la voz).
    - **Micro-momentos por escena:** cada escena debe cambiar visualmente 2-3 veces (entrada + sub-elementos secuenciales + detalle final). Duración mínima 4-5s por escena.
    - **Safe zone del thumbnail YT:** evitar branding en top ~100px (header del player) y esquinas inferiores (botón "Mirar en YouTube" + ícono de compartir). Contenido siempre centrado vertical con padding 110/110.
- **Tutorial "Contactos" producido (primer tutorial real del canal).**
  - Master 16:9 (72s) + Reel 9:16 (72s) en `content/videos-tutoriales/2026-05-12-contactos/`.
  - Guion: 190 palabras, ~2.8 wps. 8 escenas: intro · importación CSV · creación auto vía WhatsApp · ficha rica · filtros · resultado · cierre · outro.
  - Pieza guardada en DB de producción con slug `2026-05-12-contactos`.
  - Assets YouTube generados (thumbnail-yt.jpg + youtube.md con 7 capítulos cortos).
  - **Decisión narrativa clave:** descartado momento "crear contacto manual" porque no representa el uso real — los agentes traen su base por CSV al onboarding y los nuevos entran solos vía WhatsApp. Confirmado en `onmind/src/services/evolution-webhook-service.ts:396` (`createContact` desde webhook entrante).

## 2026-05-11
- **Canal de YouTube OnMind creado y configurado.** Plan completo en `docs/planes/onmind-canal-youtube-2026-05-11.md`.
  - **Identidad:** nombre `OnMind`, handle `@OnMindApp` (consistente con Instagram), Brand Account creado desde la cuenta personal de Raphael. URL: https://www.youtube.com/@OnMindApp
  - **Posicionamiento:** foco en el problema ("Mantenemos vivo el vínculo con tus clientes") — no hablar de CRM ni del producto, hablar de la causa.
  - **Pilares de contenido (etapa inicial):** solo Pilar 1 (Tutoriales OnMind). Pilares 2 (Vínculo educativo top-funnel) y 3 (Casos reales) postergados hasta que el motor de tutoriales esté corriendo. Decisión pragmática para no comprometer cadencia.
  - **Estructura de playlists:** una sola playlist "Tutoriales OnMind" que se crea al subir el primer video. Re-evaluar partir en sub-playlists cuando haya 8-10 videos.
  - **Assets visuales generados** con `scripts/generate-youtube-assets.ts` (sharp + satori + resvg). Output en `public/youtube/`:
    - `avatar.png` (800x800): fondo teal #007056 + isotipo blanco.
    - `banner.png` (2560x1440): gradiente teal, safe zone 1546x423 con isotipo + tagline "Mantenemos vivo el vínculo con tus clientes" + bajada "Tutoriales · Estrategias · Casos reales".
    - `watermark.png` (150x150): círculo teal con isotipo blanco (regenerado tras descubrir que el watermark blanco transparente se perdía en thumbnails/fondos claros — relevante para tutoriales con UI clara de OnMind).
  - **Configuración del canal:** descripción, palabras clave SEO, enlaces (sitio + Instagram), verificación SMS completada (desbloquea miniaturas custom y videos >15min), país Uruguay, idioma Español.
  - **Pestaña Inicio:** desactivada hasta tener 3+ videos.
  - **Textos para copiar guardados en `copy-paste.txt`.**
  - **Próximos pasos:** subir primer tutorial, crear la playlist al subirlo, invitar a Martín como admin del Brand Account.
- **Tutorial "Templates" producido como prototipo del nuevo skill `crear-video-tutorial`.** Master 16:9 (24s) + Reel 9:16 (24s) en `content/videos-tutoriales/2026-05-11-templates/`. Pieza guardada en DB. Sirvió para validar el flujo completo (composición Remotion, TTS ElevenLabs, derivada vertical, `save-video-tutorial.mjs`). Marcado como prueba — se va a regenerar cuando estén las composiciones canónicas estables.

## 2026-05-10
- **CRM ligero de leads — diseño en 7 fases.** Plan completo en `~/.claude/plans/bien-tengo-un-problema-partitioned-abelson.md`. Cada fase es independiente y autocontenida para que un agente distinto la pueda tomar en una sesión nueva.
  - Fases: 1) Foundation (modelo + alta manual + listado + detail con notas) · 2) Webhook + round-robin + emails · 3) Kanban + tracking de trial · 4) Templates de mensajes (booking + 3 follow-ups) · 5) Disponibilidad (reglas semanales + bloqueos) · 6) Booking público + reserva + Calendar prellenado · 7) Follow-up automatizado (panel + email + cron + indicadores).
  - Decisiones clave: estados Nuevo→Contactado→Demo agendada→Demo realizada→En evaluación→Cliente/Perdido; owner round-robin par/impar con override manual y visibilidad compartida; booking con link único por token; slots por persona pero el lead no elige (UI muestra owner); plantillas semanales recurrentes + bloqueos puntuales, granularidad 30min; Google Meet semi-auto (botón abre Calendar pre-llenado, sin OAuth); templates de mensaje configurables por usuario y propósito con variables `{nombre}`/`{linkBooking}`; webhook OnMind con shared secret + Zod (contrato a doc); follow-up disparado por cron diario, panel dedicado + email puntual al entrar al estado, copia mensaje al clipboard, NO autoenvío; trial pago no se hostiga, sí check-in amistoso al cliente a mitad del primer mes.
- **Fase 1 implementada — Foundation del CRM.**
  - **Schema** (`prisma/schema.prisma`): nuevos modelos `Lead` y `LeadActivity`, enums `LeadStatus` (NEW/CONTACTED/DEMO_SCHEDULED/DEMO_DONE/IN_EVALUATION/CUSTOMER/LOST), `LeadSource` (INSTAGRAM/WEB/REFERRAL/OTHER), `LeadActivityType` (NOTE/STATUS_CHANGE/SYSTEM). `Lead` incluye `trialStartedAt` (auto-set la primera vez que entra a IN_EVALUATION, no se resetea si vuelve atrás). `User.leadActivities` para autoría. Indices en `status`, `email`, `createdAt` (Lead) y `(leadId, createdAt)` (LeadActivity). Aplicado con `npx prisma db push` (DB Neon en sync).
  - **Service** (`src/services/lead-service.ts`): `getLeads`, `getLeadStats`, `getLeadById`, `createLead`, `updateLead`, `updateLeadStatus`, `addNote`, `addSystemActivity`. `updateLeadStatus` registra `LeadActivity` STATUS_CHANGE automática y maneja la lógica del trial.
  - **Componente** (`src/components/lead-status-badge.tsx`): `LeadStatusBadge` con color por estado, exporta también `LEAD_STATUS_LABEL`, `LEAD_STATUS_ORDER`, `LEAD_SOURCE_LABEL` para reuso en fases siguientes.
  - **Listado** (`src/app/dashboard/leads/page.tsx`): tabla con nombre, email, whatsapp, origen, estado y creado. Filtros por estado con contadores. Empty state con CTA. `force-dynamic`.
  - **Alta manual** (`src/app/dashboard/leads/nuevo/`): page + lead-form (client) + actions con Zod (`createLeadAction`). Campos: nombre, email, whatsapp, origen (Select), rubro (Textarea). Crea con `authorUserId` de la sesión y registra activity SYSTEM "Lead creado". Redirige al detail.
  - **Detail** (`src/app/dashboard/leads/[id]/`): page + lead-detail (client) + actions con tres server actions (`updateLeadAction`, `changeStatusAction`, `addNoteAction`). UI: header con nombre + creado + trial inicio si aplica + StatusChanger (Select que dispara cambio inmediato vía useTransition). Card "Datos del lead" con view/edit toggle. Card "Notas y actividad" con textarea para nuevas notas + timeline cronológico (NOTE/STATUS_CHANGE/SYSTEM con autor + tiempo en hora UY).
  - **Sidebar** (`src/components/panel-sidebar.tsx`): nuevo grupo "Leads" entre "General" y "Contenido", con items "Pipeline" (`/dashboard/leads`) y "Nuevo lead" (`/dashboard/leads/nuevo`). Iconos `Users` + `UserPlus`.
  - **Lint/typecheck**: `pnpm tsc --noEmit` pasa sin errores. `pnpm lint` limpio en archivos nuevos (los warnings/errores remanentes son pre-existentes en `ui/sidebar.tsx`, `logo-overlay.ts`, `piezas/page.tsx`).
- **Pendientes para Fase 2** (siguiente sesión):
  - Agregar `ownerUserId` a `Lead` (nullable). Selector de owner en el detail. Round-robin par/impar al crear (cuenta total de leads).
  - Endpoint `/api/webhooks/onmind/leads` con `ONMIND_WEBHOOK_SECRET` (header `X-OnMind-Secret`) y validación Zod. Idempotente por email.
  - `sendLeadCreatedEmail` (a ambos) y `sendLeadStatusChangedEmail` (al socio que NO movió). Templates en `src/components/emails/`.
  - Doc del contrato en `docs/operacion/webhook-onmind-leads.md` para que Raphael lo emita desde el repo OnMind.
- **Fase 2 implementada — Webhook + owner round-robin + emails.**
  - **Schema** (`prisma/schema.prisma`): `Lead.ownerUserId` (nullable) + relación `owner User?` con backref `User.ownedLeads` (`relation: "LeadOwner"`). Index `@@index([ownerUserId])`. `prisma db push` aplicado al branch `dev` de Neon (host nuevo `ep-calm-dawn-an43vpsh`).
  - **Asignación** (`src/services/lead-assignment-service.ts`): `assignNextOwnerId()` round-robin par/impar — cuenta `prisma.lead.count()` y devuelve `users[count % users.length]`. Users ordenados por `createdAt asc` (estable). `listOwnerCandidates()` para alimentar el dropdown del detail. Si solo hay 1 user activo lo devuelve a él; si no hay, devuelve null (no rompe el flujo).
  - **Emails** (`src/components/emails/`): `lead-created-email.tsx` (datos del lead + owner asignado + botón "Ver lead") y `lead-status-changed-email.tsx` (transición de estado + quién lo movió). Reutilizan `email-theme.ts` para colores/tipografía. En `email-service.ts` se agregaron `sendLeadCreatedEmail()` y `sendLeadStatusChangedEmail()` siguiendo el patrón del OTP: en `NODE_ENV=development` solo loguean en consola; en prod usan Resend con `EMAIL_FROM`. Si Resend devuelve error, no se rompe — solo se loguea (los emails no son críticos para el flujo).
  - **Hooks en lead-service** (`src/services/lead-service.ts`):
    - `createLead` ahora acepta `ownerUserId` opcional. Si no se pasa, llama a `assignNextOwnerId()`. Registra LeadActivity SYSTEM con el owner asignado y dispara `sendLeadCreatedEmail` a todos los users activos.
    - `updateLeadStatus` registra STATUS_CHANGE con labels en español (vía `LEAD_STATUS_LABEL`) y dispara `sendLeadStatusChangedEmail` excluyendo al `changedByUserId` (al socio que NO movió). Si el status no cambió, no hace nada.
    - Nuevo `updateLeadOwner(id, newOwnerUserId, authorUserId)` — registra LeadActivity SYSTEM `"Owner: X → Y"`. No-op si el owner es el mismo.
    - `getLeads` y `getLeadById` ahora `include: { owner: { select: ... } }`.
    - Las funciones `notifyLeadCreated` y `notifyStatusChanged` van envueltas en try/catch para que un fallo de Resend no rompa la creación del lead.
  - **Webhook receptor** (`src/app/api/webhooks/onmind/leads/route.ts`): POST. Auth con `timingSafeEqual` contra `ONMIND_WEBHOOK_SECRET` vía header `X-OnMind-Secret`. Body validado con Zod (`name`, `email`, `phone?`, `source?`, `businessType?`). Idempotente por email: si ya existe Lead con ese email, registra LeadActivity SYSTEM "Webhook OnMind recibió un ingreso duplicado para este email" y devuelve `{ ok: true, duplicated: true, leadId }`. Si es nuevo, llama `createLead()` que dispara round-robin + email a ambos. Errores: 400 invalid_payload/invalid_json, 401 unauthorized, 500 server_misconfigured (si falta el secret).
  - **Selector de owner en detail** (`src/app/dashboard/leads/[id]/lead-detail.tsx`): `OwnerChanger` con Select shadcn. Página carga candidatos vía `listOwnerCandidates()` y los pasa por props. Cambio dispara `changeOwnerAction` con useTransition (cambio inmediato). "Sin owner" como opción (constante `UNASSIGNED`).
  - **Listado** (`src/app/dashboard/leads/page.tsx`): nueva columna "Owner" entre Origen y Estado.
  - **Doc del contrato** (`docs/operacion/webhook-onmind-leads.md`): URL prod/dev, headers, body con tabla de campos, todas las respuestas (200 nuevo, 200 duplicado, 400, 401, 500), idempotencia, retries sugeridos (3 con backoff), snippet para integrar en el repo OnMind, env vars en ambos lados, comando `openssl rand -hex 32`, test manual con curl.
  - **Lint/typecheck**: `pnpm tsc --noEmit` y `pnpm lint` limpios en archivos nuevos.
- **Setup pendiente del usuario antes de probar Fase 2**:
  - Generar shared secret con `openssl rand -hex 32` y agregarlo a `.env.local` como `ONMIND_WEBHOOK_SECRET=...`.
  - Para emails reales en dev: están en modo "dev — solo log en consola". Si querés probar el flujo real, setear `NODE_ENV=production` localmente o ajustar la guarda. Con NODE_ENV=development (default `pnpm dev`) los `console.log` muestran a quién y qué se enviaría.
- **Pendientes para Fase 3** (siguiente sesión):
  - Vista kanban con `@dnd-kit/core` (instalar). Drag&drop de cards entre columnas dispara `changeStatusAction`.
  - Toggle Lista ↔ Kanban en `/dashboard/leads`.
  - `LeadCard` con countdown de trial cuando `status === IN_EVALUATION` (X días restantes calculado con date-fns).
  - "Perdido" como columna terminal aparte del flujo principal.
- **Fase 3 implementada — Kanban con drag&drop + countdown de trial.**
  - **Dependencia**: `@dnd-kit/core` 6.3.1 instalado con pnpm.
  - **`src/proxy.ts`**: agregado `/api/webhooks` a las rutas públicas para que el endpoint del webhook (Fase 2) no quede tras la sesión de NextAuth.
  - **`src/components/lead-card.tsx`**: card reutilizable. Muestra nombre + iniciales del owner (avatar circular teal con tooltip de nombre completo), badge de origen, rubro truncado a 140px y countdown de trial en ámbar cuando `status === IN_EVALUATION` (calculado con `differenceInCalendarDays`, constante `TRIAL_DAYS = 15`). Modo dual: en kanban (`draggable`) renderiza un `<div>` con cursor grab; fuera del kanban es un `<Link>` al detail. Soporta estado `isDragging` con opacidad 0.5 y shadow.
  - **`src/components/leads-kanban.tsx`** (client): `DndContext` con `PointerSensor` (`distance: 5px` para no disparar drag en clicks accidentales). 6 columnas activas en horizontal scroll (NEW → CUSTOMER) + LOST como banda terminal full-width abajo. Cada columna usa `useDroppable` con id = nombre del status; cada card usa `useDraggable` con id = leadId. `DragOverlay` con `dropAnimation: null` y leve rotación para feedback visual. Optimistic update: `setLeads` mueve el lead en local antes de llamar `changeStatusAction`; si falla, rollback al estado anterior + `toast.error`. También aplica el set local de `trialStartedAt` cuando se mueve a `IN_EVALUATION` (visualmente el countdown aparece de inmediato; el backend ya lo persiste por la lógica de `updateLeadStatus`). Helper `groupByStatus` para distribuir.
  - **`src/app/dashboard/leads/page.tsx`** refactor: nuevo query param `view=kanban|list` (default `kanban`). `ViewToggle` en el header con dos botones (Kanban + Lista). Filtros por estado solo aparecen en vista lista. En kanban `max-w-[1600px]` para que las 6 columnas + scroll quepan; en lista vuelve a `max-w-6xl`.
  - **Lint/typecheck**: ambos limpios. Hubo un fix por TS al inicio: el wrapper polimórfico de `LeadCard` (`Link` vs `div`) no tipaba bien con `href` opcional; resuelto con dos branches explícitos.
- **Aclaración sobre URLs en emails (dev)**: el `detailUrl` que se construye en `email-service.ts` toma `NEXT_PUBLIC_APP_URL`. Si en `.env.local` está apuntando a un host distinto al que usa Raphael en el navegador (ej. `marketing-onmind.localhost` vs `localhost`), las cookies de NextAuth no se comparten y al abrir el link del email manda a `/login`. Es comportamiento esperado del dashboard protegido — solución: alinear `NEXT_PUBLIC_APP_URL` al host donde se tiene sesión.
- **Pendientes para Fase 4** (siguiente sesión):
  - Modelo `MessageTemplate` (userId, channel EMAIL/WHATSAPP, purpose enum, subject?, body). Defaults seedeados.
  - 4 propósitos: BOOKING_LINK, FOLLOWUP_CONTACTED, FOLLOWUP_DEMO_DONE, CHECKIN_CUSTOMER_MONTH_1.
  - Página `/dashboard/configuracion` con tabs por propósito (textarea email + textarea WhatsApp por cada uno).
  - Botones "Copiar email" / "Copiar WhatsApp" en el detail del lead, sensibles al estado actual (BOOKING_LINK siempre, follow-ups según status). Booking link queda deshabilitado hasta Fase 6.
  - Al copiar, registrar `LeadActivity` SYSTEM "Copió follow-up email/WhatsApp" para trazabilidad.
- **Layout/UI fixes intermedios** (entre Fase 3 y 4):
  - **`dashboard/layout.tsx`**: pasamos del `<main className="flex-1">` plano al patrón de OnMind admin (`SidebarProvider` con `h-svh overflow-hidden`, `SidebarInset` con `overflow-hidden`, scroll container `flex-col flex-1 overflow-y-auto`). Esto eliminó el doble scroll horizontal del browser que aparecía con el kanban ancho.
  - **`leads/page.tsx`**: el wrapper del view kanban es `flex flex-col flex-1 min-h-0`, header con `shrink-0`, contenido del kanban con `flex-1 min-h-0`. Permite el `mt-auto` del `LeadsKanban` para pegar la banda "Perdido" al fondo del viewport.
  - **`leads-kanban.tsx`**: el grid de 6 columnas activas pasó de `flex gap-3 overflow-x-auto` con `w-72 shrink-0` por columna a un `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3` responsive. La banda "Perdido" usa `mt-auto pt-4`. Se agregó `id="leads-kanban"` al `DndContext` para evitar hydration mismatch del `aria-describedby` auto-incremental de dnd-kit (Strict Mode).
  - **`globals.css`**: scrollbars finitos globales — `scrollbar-width: thin` (Firefox) + `::-webkit-scrollbar` 8px (Chromium/Safari) con thumb `rgba(0,0,0,0.18)` y hover `0.32`. Variantes para dark mode.
- **Fase 4 implementada — Templates de mensajes + acciones desde el detail.**
  - **Schema** (`prisma/schema.prisma`): nuevo modelo `MessageTemplate` (userId, channel, purpose, subject?, body) con unique compuesto `(userId, channel, purpose)`. Enums `MessageTemplateChannel` (EMAIL, WHATSAPP) y `MessageTemplatePurpose` (BOOKING_LINK, FOLLOWUP_CONTACTED, FOLLOWUP_DEMO_DONE, CHECKIN_CUSTOMER_MONTH_1). User.messageTemplates como backref. `prisma db push` aplicado.
  - **Service** (`src/services/message-template-service.ts`):
    - `DEFAULTS` map con los 8 templates por defecto en español on-brand. Variables: `{nombre}` en todos, `{linkBooking}` en BOOKING_LINK, FOLLOWUP_CONTACTED.
    - `getTemplatesForUser(userId)` — devuelve los 8 mezclando persistidos con defaults. **No escribe en DB hasta que el user guarde** (los defaults se inyectan en memoria).
    - `getTemplateForUser(userId, channel, purpose)` — uno solo, idem mezcla.
    - `upsertTemplate({...})` — upsert con clave compuesta. Si channel=WHATSAPP, fuerza subject=null.
    - `resetTemplateToDefault({...})` — borra el persistido. Próxima lectura cae al default.
    - `interpolate(text, vars)` — reemplaza `{nombre}` y `{linkBooking}`. Si una var no se pasa, queda string vacío.
    - Exports: `PURPOSE_LABEL`, `PURPOSE_ORDER`, tipo `ResolvedTemplate` con flag `isDefault` para la UI.
  - **Página `/dashboard/configuracion`** (`page.tsx` server + `templates-editor.tsx` client):
    - Tabs shadcn por propósito (4 tabs). Dentro de cada tab dos forms separados (Email + WhatsApp), cada uno una card.
    - Email muestra Asunto + Mensaje. WhatsApp solo Mensaje.
    - Badge "Default" cuando el template es el seedeado. Botón "Restaurar default" cuando ya está editado (borra el persistido).
    - Variables disponibles indicadas debajo de cada textarea, con `<code>` resaltado.
    - Server actions: `saveTemplateAction` (Zod, upsert) y `resetTemplateAction` (delete). Toast en cada operación. `useActionState` con guard pattern para no resetear durante render.
    - Instalado `tabs.tsx` de shadcn.
  - **Sidebar** (`panel-sidebar.tsx`): nuevo grupo "Configuración" con item "Mis mensajes" (icon `MessageSquareText`).
  - **Acciones desde el detail** (`lead-detail.tsx`):
    - Helper `relevantActionsForStatus(status)` decide qué grupo mostrar según el estado: NEW → Booking; CONTACTED → Booking + Follow-up contactado; DEMO_DONE → Follow-up post demo; CUSTOMER → Check-in mes 1. DEMO_SCHEDULED, IN_EVALUATION, LOST no muestran la card.
    - Componente `LeadActions` (sección arriba del grid de datos/notas) con título "Acciones" y filas por grupo, cada una con botones "Copiar email" + "Copiar WhatsApp".
    - Botones de **BOOKING_LINK quedan deshabilitados con tooltip** "Generá el link de booking primero (Fase 6)" — están listos para activarse cuando exista el link.
    - Si el lead no tiene `phone`, el botón WhatsApp queda deshabilitado con tooltip "Lead sin teléfono cargado".
  - **Server action** (`leads/[id]/actions.ts`): `resolveTemplateForLeadAction(leadId, channel, purpose)`:
    - Toma el template del **usuario logueado** (no del owner del lead — decisión del plan).
    - Interpola con `{nombre: lead.name}` y `{linkBooking: ""}` (Fase 4 no tiene link aún; en Fase 6 se rellena).
    - Si channel=WHATSAPP y hay phone, construye `https://wa.me/{phoneClean}?text={encoded}` (cleanea no-dígitos).
    - Registra `LeadActivity` SYSTEM "Copió email/WhatsApp · {label}" con autor.
    - Devuelve `{ ok, subject, body, waUrl }`.
  - **UX del copy**: el client llama `navigator.clipboard.writeText(...)`. Para email arma `Asunto: ...\n\n{body}`. Para WhatsApp solo el body. Toast con descripción opcional "Abrir WhatsApp Web" como link cuando hay `waUrl`.
  - **Lint/typecheck**: limpios.
- **Pendientes para Fase 5** (siguiente sesión):
  - Modelos `AvailabilityRule` (recurrencia semanal por user) y `AvailabilityBlock` (bloqueos puntuales).
  - Service `availability-service.ts` con `computeAvailableSlots(userId, fromDate, toDate)` proyectando reglas a slots de 30 min y restando bloqueos + bookings (Fase 6 cierra bookings).
  - Página `/dashboard/disponibilidad` con plantilla semanal + bloqueos próximos.
  - Sidebar: item "Disponibilidad".
  - Todo en UTC, UI en `America/Montevideo`.
- **Mejoras de UI en Fase 4** (después de la primera prueba):
  - Tabs de `/dashboard/configuracion` rediseñados: etiquetas cortas (Booking, Sin respuesta, Post demo, Check-in) en grid de 4 columnas iguales. Adentro de cada tab va el título largo + descripción explicativa. Más legible y predecible.
  - Nuevos exports en `message-template-service.ts`: `PURPOSE_SHORT_LABEL` y `PURPOSE_DESCRIPTION`.
  - Bug fix: la card del kanban era un `<div>` cuando estaba en modo draggable, así que el click no navegaba al detail. Ahora la `LeadCard` siempre es `<Link>`; dnd-kit con `activationConstraint: { distance: 5 }` distingue click (<5px → click pasa) de drag (≥5px → bloquea click). Funciona en ambas vistas.
  - Vista persistida vía URL: los links a `/dashboard/leads/[id]` incluyen `?from=list` o `?from=kanban`. El botón "Volver a leads" del detail respeta el param y vuelve a la vista correcta.
- **Fase 5 implementada — Disponibilidad por persona (plantillas semanales + bloqueos puntuales).**
  - **Schema** (`prisma/schema.prisma`):
    - `AvailabilityRule` (id, userId, dayOfWeek 0-6, startTime "HH:mm", endTime "HH:mm", active, createdAt). Index `(userId, active)`.
    - `AvailabilityBlock` (id, userId, startsAt UTC, endsAt UTC, reason?, createdAt). Index `(userId, startsAt)`.
    - `User.availabilityRules` y `availabilityBlocks` como backrefs.
    - `prisma db push` aplicado.
  - **Service** (`src/services/availability-service.ts`):
    - Constantes: `SLOT_MIN = 30`, `DAY_LABELS` (Domingo→Sábado por índice), `DAY_ORDER` ([1,2,3,4,5,6,0] para mostrar lunes-domingo).
    - Helpers: `isValidTime("HH:mm")`, `timeToMinutes`, `parseHHmm`.
    - CRUD reglas: `getRulesForUser`, `addRule` (valida formato + end > start), `deleteRule`.
    - CRUD bloqueos: `getBlocksForUser` (con range opcional), `addBlock` (valida end > start), `deleteBlock`.
    - **`computeAvailableSlots(userId, from, to, now?)`**: proyecta reglas a slots de 30 min en hora UY. Itera día a día en zona local UY (`toZonedTime`), arma `Date` UTC con `fromZonedTime("yyyy-MM-ddTHH:mm:00", "America/Montevideo")`. Filtra slots dentro del rango pedido, posteriores a `now`, y que no overlapeen con bloqueos. Devuelve array ordenado de `{ startsAt, endsAt }` UTC. La función queda lista para que Fase 6 reste también los bookings existentes.
  - **Página `/dashboard/disponibilidad`** (`page.tsx` server + `availability-editor.tsx` client + `actions.ts`):
    - Server actions: `addRuleAction`, `deleteRuleAction`, `addBlockAction`, `deleteBlockAction`. Usan `auth()` para tomar `userId`. Bloqueos convierten hora UY a UTC con `fromZonedTime`. Validación con Zod.
    - Sección "Plantilla semanal": lista de 7 días en orden lunes-domingo con sus reglas como chips (formato "10:00 a 12:00") y botón X para eliminar. Botón "Agregar bloque" abre Dialog con Select de día (default Lunes) y dos Selects de hora cada 30 min (`TIME_OPTIONS`).
    - Sección "Bloqueos puntuales": lista cronológica de los próximos 60 días. Cada bloqueo muestra fecha (capitalize), rango horario en zona UY (`formatInUY`), motivo opcional, botón eliminar. Botón "Bloquear slot" abre Dialog con Calendar shadcn (date picker en Popover, deshabilita días pasados), Selects de horario y campo motivo.
    - Sidebar: nuevo item "Disponibilidad" en grupo "Configuración" debajo de "Mis mensajes" (icon `CalendarClock`).
  - **Lint/typecheck**: limpios.
- **Pendientes para Fase 6** (siguiente sesión):
  - Modelo `Booking` (leadId unique, ownerUserId, startsAt, endsAt, token unique, status PENDING/CONFIRMED/CANCELLED, calendarEventCreated). Relación `Lead.booking Booking?`.
  - Service `booking-service.ts`: `createBookingLink` (idempotente), `getBookingByToken`, `reserveSlot` (transiciona Lead a DEMO_SCHEDULED + emails + LeadActivity).
  - Página pública `/agendar/[token]` excluida del proxy de auth. Calendario de 14 días con slots disponibles del owner.
  - En el detail del lead: botón "Generar link de booking" → muestra link copiable. Habilita los botones de copiar email/WA de Fase 4 con `{linkBooking}` interpolado.
  - Tarjeta "Demo agendada" en el detail con botón "Abrir en Google Calendar" pre-llenado (Meet auto, sin OAuth).
  - Templates de email para confirmación al lead y al owner.
  - Verificar que `/agendar/*` esté en `publicRoutes` del `proxy.ts`.
- **Refactor intermedio Fase 5 → Fase 6**:
  - Extraídas constantes safe-for-client a `src/lib/availability-constants.ts` (DAY_LABELS, DAY_ORDER, SLOT_MIN, isValidTime, timeToMinutes). El service `availability-service.ts` las re-exporta. Esto resolvió un crash al cargar `/dashboard/disponibilidad` porque el client component importaba constantes desde el service y eso arrastraba Prisma al bundle.
  - Cambio del patrón "set state during render with guard" a `useEffect` en `availability-editor.tsx` y `templates-editor.tsx` — el patrón anterior hacía que dialogs no se cerraran tras submit y se acumularan submits duplicados. `useEffect` con dep `[state]` queda más predecible.
  - Sidebar: el grupo "Configuración" se eliminó. "Mis mensajes" y "Disponibilidad" ahora viven dentro del grupo "Leads" junto a Pipeline y Nuevo lead.
- **Fase 6 implementada — Booking público + reserva + Calendar prellenado.**
  - **Schema** (`prisma/schema.prisma`): nuevo modelo `Booking` (id, leadId unique 1:1 con Lead, ownerUserId, token unique, status, startsAt?, endsAt?, reservedAt?, calendarEventCreated). Enum `BookingStatus` (PENDING, CONFIRMED, CANCELLED). Relación `Lead.booking`. `User.bookings` backref. `prisma db push` aplicado.
  - **Service** (`src/services/booking-service.ts`):
    - `getOrCreateBooking({ leadId, ownerUserId })` — idempotente. Si ya existe, lo retorna; si no, crea uno PENDING con token URL-safe (24 bytes base64url).
    - `bookingPublicUrl(token)` — construye la URL pública usando `NEXT_PUBLIC_APP_URL`.
    - `getBookingByLeadId(leadId)` y `getBookingByToken(token)` — ambos con `include` de owner y lead.
    - `reserveSlot({ token, startsAt, endsAt })` — el flujo crítico:
      1. Carga el booking. Si CONFIRMED o CANCELLED, falla.
      2. Llama a `computeAvailableSlots` del owner para validar que el slot todavía está disponible (race condition friendly).
      3. Persiste con `status = CONFIRMED`, `startsAt`, `endsAt`, `reservedAt`.
      4. Llama `updateLeadStatus(leadId, "DEMO_SCHEDULED")` que registra LeadActivity STATUS_CHANGE y dispara email entre socios.
      5. `addSystemActivity` con mensaje "Slot reservado para...".
      6. Dispara `sendBookingConfirmedOwnerEmail` y `sendBookingConfirmedLeadEmail`. No bloquean si fallan.
    - `googleCalendarUrl({ startsAt, endsAt, leadName, leadEmail })` — arma URL `https://calendar.google.com/calendar/render?action=TEMPLATE...` con `text`, `dates`, `details` y `add` (asistente). El user agrega Meet manualmente desde Google Calendar.
    - `markCalendarEventCreated(bookingId)` — flag para cambiar el copy del botón de "Crear" a "Volver a abrir".
  - **`computeAvailableSlots` actualizado**: ahora también consulta bookings CONFIRMED del owner y los suma a los blockers junto con los AvailabilityBlock. Garantiza que un slot ya reservado no aparezca al próximo lead.
  - **Templates email** (`booking-confirmed-owner-email.tsx`, `booking-confirmed-lead-email.tsx`) + funciones `sendBookingConfirmedOwnerEmail`, `sendBookingConfirmedLeadEmail` en `email-service.ts`. Helper `formatBookingWhen` con `date-fns-tz` que rinde "Martes 13 de mayo, 10:00 hs (UY)".
  - **Página pública `/agendar/[token]`**:
    - `proxy.ts` actualizado: `/agendar` agregado a `publicRoutes` para que NextAuth no intercepte.
    - `page.tsx` (server): carga booking, si está CANCELLED muestra mensaje rojo, si CONFIRMED muestra "Demo confirmada" con la fecha, si PENDING calcula slots de los próximos 14 días con `computeAvailableSlots` y renderiza `BookingPicker`.
    - Layout propio (Shell + Card) sin sidebar, con logo OnMind arriba, footer con copyright.
    - `booking-picker.tsx` (client): agrupa slots por día (lunes 10:00, 10:30...), botones outline con HH:mm, click abre `AlertDialog` shadcn de confirmación con texto formato "Vas a agendar la demo con [Owner] para [whenLabel]". Confirmar dispara `reserveSlotAction` (server action con Zod). Si falla (slot ya tomado) toast de error y refresca; si OK toast + refresh muestra estado CONFIRMED.
  - **Integración en el detail del lead** (`lead-detail.tsx`):
    - `BookingSection` con 3 estados:
      1. **Sin booking**: card con título "Link de booking" y botón "Generar link". Click → `generateBookingLinkAction` crea el Booking PENDING + lo copia al clipboard.
      2. **Booking PENDING**: muestra el URL en un input estilo `<code>` con botón "Copiar".
      3. **Booking CONFIRMED**: card verde "Demo agendada" con fecha capitalize + botón "Crear evento en Google Calendar" (o "Volver a abrir"). Abre la URL pre-llenada en pestaña nueva y marca `calendarEventCreated=true`.
    - Los botones de **BOOKING_LINK** en `LeadActions` ahora se habilitan automáticamente cuando `hasBookingLink=true` (existe Booking del lead). Antes estaban deshabilitados con tooltip "Generá el link de booking primero (Fase 6)" — el copy quedó adaptado a "Generá el link de booking primero" sin la mención de Fase.
    - `resolveTemplateForLeadAction` interpola `{linkBooking}` con `bookingPublicUrl(booking.token)` cuando existe el Booking; si no, queda string vacío (igual que antes).
    - Server actions nuevas: `generateBookingLinkAction(leadId)` y `markCalendarEventCreatedAction(bookingId)`.
  - **Page del detail** carga `bookingRaw` con `getBookingByLeadId`, lo serializa a `BookingInfo` (Date → ISO) con `calendarUrl` ya armado, y lo pasa a `LeadDetail`.
  - **Lint/typecheck**: limpios.
- **Pendientes para Fase 7** (siguiente sesión):
  - Modelo `LeadFollowUp` (leadId, triggerState, dueAt, notifiedAt, resolvedAt, resolvedBy).
  - Service `lead-followup-service.ts`: `scanAndCreateFollowUps` para el cron, `markResolved`, `listPendingByOwner`.
  - Endpoint `/api/cron/scan-followups` (Vercel Cron, 1×/día).
  - Reglas de umbral en `src/lib/leads-config.ts`: CONTACTED 3d, DEMO_DONE 5d, CUSTOMER 15d.
  - Template email `lead-needs-followup-email.tsx`.
  - Panel `/dashboard/leads/seguimiento` con leads pendientes + botón "Marcar follow-up hecho".
  - Sidebar: ítem "Seguimiento" con badge numérico de pendientes del usuario.
  - Indicadores visuales: badge ámbar en detail y punto en card del kanban cuando hay follow-up activo.
  - `updateLeadStatus` debe llamar `markResolved` con razón `STATE_CHANGE` para resolver follow-ups activos.
- **Mejoras intermedias de Fase 6**:
  - Server-side pre-formatting de fechas para evitar hydration mismatches (server vs client TZ): `BookingPicker` recibe `timeLabel`, `dayKey`, `dayLabel`, `fullLabel` ya armados; `BlockRow` recibe `dateLabel`/`timeLabel`; `LeadDetail` recibe `lead.createdAtLabel`, `lead.trialStartedAtLabel`, `activity.createdAtLabel`, `booking.whenLabel`.
  - `formatInUY` reescrito con la combinación estable `formatDF(toZonedTime(date, UY_TZ), pattern, { locale: es })` (date-fns regular sobre Date pre-shifted) en lugar de `format` de date-fns-tz con option `timeZone` que se mostraba inestable cross-runtime.
  - `(UY)` quitado de los patterns para evitar `RangeError: Format string contains an unescaped latin alphabet character "U"`.
  - `ThemeProvider` cambiado a `defaultTheme="light"` con `enableSystem={false}` para no inyectar el `<script>` de detección de tema (warning de React 19).
  - Usuarios del CRM: nombres en DB actualizados a `Raphael` y `Martín` (antes mostraban `rapha.uy`/`msedes`).
  - `generateBookingLinkAction` valida que el lead tenga owner y que el owner tenga al menos una `AvailabilityRule` activa antes de crear el booking. UI muestra advertencia ámbar deshabilitando el botón si no aplica.
  - Card "Link de booking" trae link a `/dashboard/disponibilidad` para configurar antes de generar.
  - Sidebar reorganizado: "Mis mensajes" y "Disponibilidad" pasaron al grupo "Leads" (junto a Pipeline y Nuevo lead). Grupo "Configuración" eliminado.
- **Fase 7 implementada — Follow-up automatizado.**
  - **Schema** (`prisma/schema.prisma`): nuevo modelo `LeadFollowUp` (id, leadId, triggerState, dueAt, notifiedAt?, resolvedAt?, resolvedBy?). Enum `FollowUpResolvedBy` (STATE_CHANGE, USER_ACTION, DISMISSED). Relación `Lead.followUps`. Indexes en `(leadId)` y `(resolvedAt)`. `prisma db push` aplicado.
  - **Reglas** (`src/lib/leads-config.ts`):
    | Estado | Días sin movimiento | Plantilla sugerida |
    |---|---|---|
    | CONTACTED | 3 | FOLLOWUP_CONTACTED |
    | DEMO_DONE | 5 | FOLLOWUP_DEMO_DONE |
    | CUSTOMER | 15 | CHECKIN_CUSTOMER_MONTH_1 |

    "Sin movimiento" se aproxima vía `lead.updatedAt` (que se actualiza con cualquier cambio de status, owner, datos o trial start).
  - **Service** (`src/services/lead-followup-service.ts`):
    - `scanAndCreateFollowUps(now?)` — itera reglas, busca leads en cada `triggerState` con `updatedAt < cutoff` y sin follow-up activo para ese estado, crea LeadFollowUp + LeadActivity SYSTEM "Follow-up automático: lead lleva X días sin movimiento" + dispara email al owner. Setea `notifiedAt` si el email se envía. Retorna `{ created, notified }`.
    - `markResolvedForLead(leadId, reason)` — resuelve TODOS los activos del lead.
    - `markResolved(followUpId, reason)` — resuelve uno solo.
    - `listPendingFollowUps({ ownerUserId? })` — lista para el panel, opcionalmente filtrada por owner.
    - `countPendingForOwner(ownerUserId)` — count para el badge del sidebar.
    - `getActiveFollowUpsByLeadIds(leadIds[])` y `getActiveFollowUpForLead(leadId)` — para indicadores en kanban y detail.
  - **Email** (`lead-needs-followup-email.tsx` + `sendLeadNeedsFollowUpEmail` en `email-service.ts`): template con asunto "Lead {nombre} necesita seguimiento", banner ámbar con días sin movimiento + estado, botón "Abrir lead". En dev mode log a consola, en prod usa Resend (con manejo de errores no-fatales).
  - **Cron** (`src/app/api/cron/scan-followups/route.ts`): GET autenticado por `Authorization: Bearer ${CRON_SECRET}`. Para Vercel Cron 1×/día (cuando se configure en `vercel.json`). Llama `scanAndCreateFollowUps()`.
  - **Hook en `updateLeadStatus`**: al cambiar de estado se hace `prisma.leadFollowUp.updateMany({ leadId, resolvedAt: null }, { resolvedAt: now, resolvedBy: "STATE_CHANGE" })`. Inline para evitar import circular con el follow-up service.
  - **Panel** (`/dashboard/leads/seguimiento` — `page.tsx`, `actions.ts`, `row-actions.tsx`):
    - Filtros badge "Míos" (default) / "Todos".
    - Lista por orden ascendente de creación (más antiguo primero — más urgente).
    - Cada fila: nombre del lead (link al detail), badge de status, "X días sin movimiento" en ámbar con icono Clock, owner.
    - Acciones por fila: "Abrir" (link al detail), "Hecho" (resuelve con `USER_ACTION`), botón X discreto para "Descartar" (resuelve con `DISMISSED`).
    - Server actions `markFollowUpDoneAction` y `dismissFollowUpAction` registran LeadActivity SYSTEM con la razón.
  - **Indicador en detail del lead**: `FollowUpBanner` ámbar arriba de la card de booking cuando hay follow-up activo, con "X días sin movimiento" + botón "Marcar como hecho". El handler hace dynamic import de `markFollowUpDoneAction` desde el directorio de seguimiento (evita acoplar archivos pero podría refactorearse a un actions compartido más adelante).
  - **Indicador en kanban**: la `LeadCard` recibe `hasActiveFollowUp` y muestra un punto ámbar en `top-1 right-1` cuando aplica. La `LeadsKanban` recibe el `Set` de leadIds desde el server (cargado en `/dashboard/leads/page.tsx` con `getActiveFollowUpsByLeadIds`).
  - **Sidebar**: nuevo ítem "Seguimiento" en grupo Leads (icon Clock). Layout `dashboard/layout.tsx` ahora es async, llama `countPendingForOwner` y pasa `pendingFollowUps` al `PanelSidebar`. Si > 0, badge ámbar circular con el número a la derecha del item.
  - **Lint/typecheck**: limpios.
- **Setup pendiente del usuario para activar Fase 7 en producción**:
  - Asegurarse de tener `CRON_SECRET` en `.env.local` y en Vercel.
  - Configurar Vercel Cron en `vercel.json` (o `vercel.ts`) apuntando a `/api/cron/scan-followups` con frecuencia diaria (sugerido: `0 12 * * *` UTC = 09:00 UY). El cron de Fase 7 corre en paralelo al ya existente `publish-scheduled` que usa el mismo secret.
  - Test manual en dev: `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/scan-followups`. Para forzar follow-ups, pegar un lead atrás en el tiempo con un UPDATE: `UPDATE "Lead" SET status='CONTACTED', "updatedAt"=NOW() - INTERVAL '4 days' WHERE id='...';`.
- **CRM ligero — implementación completa.** 7 fases cerradas. El loop end-to-end funciona: webhook crea lead → round-robin asigna owner → owner genera link de booking (con disponibilidad cargada) → lead reserva slot → demo agendada con Calendar pre-llenado → estados se mueven en kanban con drag&drop → trial countdown visible → follow-up automático cuando el lead se enfría → panel para retomar.

## 2026-04-06
- **Inicio del proyecto.** Se creó el workspace onmind-marketing.
- Se exploró el producto OnMind (PRD, landing, docs de pricing, assets visuales).
- Se definió la forma de trabajo: paso a paso, dialogado, con continuidad inter-sesiones.
- Se creó CLAUDE.md, log.md y memoria persistente.
- Se dialogó sobre el problema, la historia de origen, audiencia, diferencial y visión.
- Se creó `docs/fundacional.md` — documento fundacional (borrador para revisión).
- Se dialogó sobre el estado actual de la marca (logo provisorio, colores teal OK, UI como referencia).
- Se registraron los colores de la app (oklch hue 175 = teal/cyan) desde globals.css.
- Se creó `docs/onmind-fase1-branding-2026-04-06.md` — plan de Fase 1: Branding.
- Se conectó Linear MCP y se crearon 5 issues en proyecto OnMind Marketing (ONM-100 a ONM-104).
- Se completó borrador de tono de voz (`docs/onmind-tono-de-voz-2026-04-06.md`) y se publicó como comentario en ONM-100 para validación de Martín.
- Flujo establecido: trabajamos acá → resultado va a Linear como comentario → Martín valida.
- Se completó paleta de colores (`docs/onmind-paleta-colores-2026-04-06.md` + PDF visual). Publicado en ONM-101.
- Se completó decisión de tipografía: Geist Sans para todo (`docs/onmind-tipografia-2026-04-06.md`). Publicado en ONM-102.
- Se investigaron herramientas de IA para logo: Google Stitch no aplica (es para UI), Ideogram para wordmark, Adobe Firefly para ícono vectorial.
- Se creó brief para diseño de logo (`docs/onmind-brief-logo-2026-04-06.md`).
- Se subió documento fundacional como documento de proyecto en Linear.
- Se exploró Ideogram para logo (wordmarks y isotipos). Resultados útiles para concepto pero limitados para refinamiento.
- Se generó el logo con Gemini (Nano Banana 3). Concepto: la "O" de OnMind como target/círculos concéntricos = "estar en la mente".
- Se obtuvieron 3 piezas: isotipo solo, logo "OnMind" (mayúsculas), logo "onmind" (minúsculas). Guardados en `assets/logo/`.
- Se publicó en ONM-103 para validación de Martín. Preferencia nuestra: versión con mayúsculas (OnMind).
- **Próximo paso:** cerrar versión del logo (esperando feedback de Martín), vectorizar en SVG con color exacto, luego compilar guía de marca (ONM-104).

## 2026-04-08
- Martín validó toda la Fase 1. Cerrados ONM-103 y ONM-104 en Linear. Fase 1: Branding completa.
- Mensaje enviado a Martín: Raphael toma marketing de OnMind como experimento con herramientas de IA.
- Creado plan de Fase 2: Presencia Digital (`docs/planes/onmind-fase2-presencia-digital-2026-04-08.md`).
  - Línea A: Tooling (skills de marketing)
  - Línea B: Landing page (contenido → 3 versiones visuales → implementar elegida)
  - Línea C: Instagram (perfil + estrategia + primeras publicaciones)
- Investigación de skills/MCPs de marketing para Claude Code (`docs/investigacion/investigacion-skills-marketing-2026-04-08.md`).
- Reorganización de `docs/` en subcarpetas: branding, planes, investigacion, operacion.
- Instalados 12 skills de marketing en `.claude/skills/` (a nivel proyecto):
  - De coreyhaines31/marketingskills: copywriting, copy-editing, content-strategy, social-content, page-cro, launch-strategy
  - De stevenflanagan1/social-ai-team: brand-onboarding, caption-writer, content-calendar, social-creative-designer, social-media-manager, social-performance-review
- Auditoría de la landing actual de OnMind (page.tsx del repo principal): copy genérico, sin diferencial, sin historia, badge "en desarrollo".
- Definido contenido nuevo de la landing (`landing/contenido-landing.json`): hero emocional, sección problema, solución, features, cómo funciona, historia de Martín, para quién, CTA.
- Decisión: campañas no se destacan en la landing (riesgo de bloqueos Meta). Foco en mensajes programados y plan de seguimiento.
- Creadas 4 versiones HTML de la landing: minimal, bold, editorial, creative (dark con círculos concéntricos, chat simulado, bento grid).
- Todas con Geist Sans, paleta de marca, logo SVG con viewBox corregido, sin emojis (íconos SVG custom).
- Decisión: "Solicita una demo" en vez de "Probá OnMind gratis". "Ingresar" deshabilitado por ahora.
- **Transformación a proyecto Next.js + Tailwind + shadcn:**
  - Se reinicializó el proyecto con create-next-app (pnpm), se restauraron todos los archivos de marketing.
  - Se instaló shadcn/ui (sidebar, card, collapsible, button), react-markdown, remark-gfm, rehype-raw, @tailwindcss/typography, lucide-react, geist.
  - Estructura de rutas:
    - `/` → Home simple con logo "OnMind Marketing" + botón Dashboard
    - `/dashboard` → Panel con sidebar shadcn (Dashboard, Guía de marca, Landings)
    - `/dashboard/marca` → Guía de marca renderizada desde markdown con imágenes
    - `/dashboard/landings` → Grid de 4 versiones con links que abren en tab nuevo
    - `/landings/minimal|bold|editorial|creative` → 4 landings completas en React/Tailwind
  - Contenido compartido en `src/lib/landing-content.ts` (usado por las 4 versiones React).
  - Favicon generado desde isotipo SVG.
  - Dark mode eliminado del panel (solo light). Las landings dark tienen su propio bg inline.
  - Imágenes del logo copiadas a `public/brand/` para la guía de marca.
  - Código en inglés, UI en español.
- **Pendiente:**
  - Crear issues en Linear para Fase 2.
  - Deploy a Vercel en marketing.onmindcrm.com.

## 2026-04-10
- **Línea B (Landing) cerrada.** La nueva landing está en producción en onmindcrm.com (implementada en el repo principal /home/raphael/desarrollo/onmind).
- Fase 2 estado: A ✅ Tooling, B ✅ Landing, C 🟡 Instagram (en C1).
- **Línea C — C1 Estrategia de Instagram completada.** Doc en `docs/planes/instagram/onmind-instagram-estrategia-2026-04-10.md`.
  - Audiencia primaria: Uruguay y Argentina (inmobiliarias y agentes).
  - Handle preferido: `@onmind` (sin "crm"). Si no está, se analiza con Martín.
  - 4 pilares con peso: educación WhatsApp comercial (40%), dolor del rubro (30%), producto en acción (20%), detrás de escena/historia (10%).
  - Frecuencia: 3 posts/semana + stories casi diarias. Formatos: reels, carruseles, stories. Sin persona en cámara por ahora.
  - Flujo de aprobación: generación → Raphael filtra → Martín valida → publica. Descartado va a banco evergreen.
  - Sección explícita "Qué resuelve OnMind (y qué no)" como regla de oro para contenido.
- **Clarificación clave de posicionamiento:** OnMind NO resuelve "responder rápido a leads nuevos" (sigue siendo manual). Sí resuelve mantener el vínculo vivo, mimos, recordatorios del negocio (vencimientos de alquiler, cumpleaños, planes de seguimiento). Guardado como memoria persistente.
- **App OnMind Marketing:**
  - Nueva sección "Estrategia" en el sidebar del panel (colapsable, preparada para sumar más planes).
  - Nueva ruta `/dashboard/estrategia/instagram` que renderiza el doc con el `MarkdownRenderer`.
  - `MarkdownRenderer` mejorado: `remark-breaks` para respetar saltos de línea simples, bloques `pre` con fondo claro y borde (fix de contraste).
- **Próximos pasos (Línea C):**
  - C2: Configurar perfil cuando Raphael cree la cuenta (handle, bio, foto, link, highlights).
  - C3: Batch de lanzamiento (9 piezas grid + reels + stories).
  - C4: Plan editorial a 2 semanas.

## 2026-04-13
- **C2: Perfil de Instagram creado.** Handle: `@OnMindApp`. Foto de perfil: isotipo. Bio definida.
- **Pipeline de generación de imágenes para Instagram:**
  - Investigación de herramientas: Canva MCP (descartado por costo Enterprise), Figma MCP (no aplica), APIs de IA generativa (Ideogram, Flux, GPT-Image), composición programática (Satori, Puppeteer).
  - Decisión: **Satori** (de Vercel) como motor principal. JSX → SVG → PNG con control total de branding. Gratis, local, ya en el stack.
  - Script `scripts/generate-post.mjs`: 3 templates (educación, dolor, producto) con Geist Sans, paleta de marca, isotipo transparente/blanco.
  - Assets generados: isotipo transparente y versión blanca para fondos oscuros (`assets/logo/`).
- **C3: Batch de lanzamiento — 9 piezas generadas.**
  - 4 educación (fondo blanco), 3 dolor (fondo teal), 2 producto (fondo gris).
  - Distribuidas en diagonal de color para el grid visual (teal en diagonal: top-right, mid-center, bottom-left).
  - Imágenes en `output/pendientes/` y `public/instagram/posts/`.
- **Regla de posicionamiento reforzada:** no usar dominio `onmindcrm.com` en piezas visuales (contiene "crm"). Usar `@OnMindApp`.
- **Simulador de Instagram en la app:**
  - Nueva sección "Instagram" en sidebar con entrada "Grid de perfil".
  - Ruta `/dashboard/instagram`: simulador de perfil IG con avatar, bio, stats y grid 3x3 clickeable.
  - Ruta `/dashboard/instagram/[post]`: vista detalle de post estilo Instagram con imagen completa, botones y metadata.
  - Layout tipo caja de celular (border, rounded, fondo gris).
- **Captions escritos para los 9 posts** usando skills caption-writer + copy-editing.
  - Frameworks variados: Problem→Agitate→Solve, Hook→Story→Lesson, Contrarian take, List, Before→After→Bridge.
  - Hooks optimizados para los primeros 125 chars (visible antes del "more" en IG).
  - 5 hashtags por post (límite actual de Instagram). Base: #inmobiliaria #gestiondeclientes #onmind.
  - CTAs variados: guardá, comentá, escribinos por DM.
  - Archivo de referencia: `output/captions-batch-lanzamiento.md`.
- **Datos centralizados en `src/lib/instagram-posts.ts`** — cada post con imagen, tipo, tema, framework, objetivo, caption y hashtags.
- **Vista detalle de post mejorada:** caption completo con hashtags, card de metadata (pilar, tema, framework, objetivo) con descripciones explicativas de cada framework.
- **Revisión de copys de las 9 imágenes:** todos pasan — tono correcto, vocabulario alineado con guía de marca.
- **Próximo paso:** revisión con Martín de los 9 posts + captions, luego publicar y salir con @OnMindApp en Instagram.

## 2026-04-14
- **Martín aprobó los 9 posts del batch de lanzamiento** (imágenes + captions). Listos para publicar en @OnMindApp.
- **Documentación:** visión de herramienta de Instagram (`docs/planes/onmind-herramienta-instagram-2026-04-14.md`), convenciones de desarrollo (`docs/operacion/convenciones-desarrollo.md`) replicando patrones de OnMind (services → Prisma, actions → services, API routes solo externos). Referencia agregada en CLAUDE.md.
- **Setup Meta/Instagram API:**
  - Facebook Page "OnMind" creada y vinculada a @onmindapp (Instagram Business).
  - Meta App "OnMind Marketing" creada con Instagram Login API (no legacy Facebook Login).
  - Permisos: `instagram_business_basic`, `instagram_business_content_publish`, `instagram_manage_comments`, `instagram_business_manage_messages`.
  - Token obtenido y configurado en `.env.local` (`INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`).
- **Cloudflare tunnel** `dev.onmindcrm.com` → localhost:3000 configurado para dev mode con dominio público. Regla WAF para bots de Meta (no sirvió — Cloudflare bloquea a nivel más bajo).
- **Fix auth HTTPS:** `useSecureCookies` y cookie name en proxy ajustados para funcionar con HTTPS del tunnel.
- **Prototipo de publicación en Instagram desde el dashboard:**
  - Modelo `InstagramPublish` en Prisma (slug, igMediaId, publishedAt). Migración `add_instagram_publish`.
  - Service `instagram-service.ts`: getPublishedPosts, getPublishStatus, createMediaContainer, waitForMediaReady, publishMediaContainer, publishPost, getProfile.
  - Server action `publishPostAction` en `dashboard/instagram/actions.ts`.
  - Client component `InstagramPublishButton` con Dialog de confirmación (shadcn Dialog con base-ui).
  - Grid muestra badges verdes (arriba derecha) en posts publicados.
  - Detalle muestra botón "Publicar en Instagram" o fecha de publicación.
- **Fix Button hydration:** reemplazado `ButtonPrimitive` de base-ui por `<button>` nativo (como OnMind con Radix) para eliminar hydration mismatch en SSR.
- **Imágenes regeneradas en 1080x1350 (4:5):** formato correcto para feed de Instagram. Script `generate-post.mjs` actualizado con modo `--all` para los 9 posts.
- **Vercel Blob para imágenes:** `@vercel/blob` instalado, `upload-service.ts` creado, script `upload-to-blob.mjs` para subir imágenes. Las 9 imágenes subidas al Blob. `blobUrl` agregado al tipo `InstagramPost` — la UI usa imágenes locales, Instagram usa las del Blob.
- **Perfil de Instagram con datos reales:** la API devuelve username, nombre, bio, avatar, seguidores, seguidos, publicaciones. La UI del grid muestra datos en vivo.
- **Los 9 posts publicados en @OnMindApp** desde producción (Vercel). Grid aspect ratio 4:5, contenedor max-w-[700px].
- **Próximos pasos:** scheduling, insights/engagement, reels/carruseles, renovación automática de tokens.

## 2026-04-22
- **Brochure PDF** (`docs/presentacion/onmind-brochure-2026-04-22.md` + `.pdf`). One-pager portrait de 2 páginas A4. Envío previo a demo — primer contacto con brokers interesados (arrancamos con Argentina).
- **Exploración deep del producto OnMind** vía Explore subagents: mapa de flujos, entidades Prisma, features protagonistas vs roadmap, lógica anti-baneo. Hallazgo técnico: usa Evolution API + Baileys (no Meta Cloud API oficial), riesgo mitigado con delays 60-120s, ventanas horarias, modo vacaciones, idempotencia, variables por contacto.
- **Decisiones de posicionamiento con Raphael** (las 4 preguntas estratégicas):
  - Ángulo baneos: hablar del riesgo real + disciplina automática de OnMind. NO mencionar API oficial vs no oficial (la gente no lo conoce). Mensaje: "seguís con tu WhatsApp Business como siempre, OnMind se suma por encima".
  - Audiencia: broker individual / agente (no inmobiliaria).
  - Features protagonistas: calendario anual + plantillas con variables / fechas especiales + cierres / equipo multi-usuario (asistentes) / disciplina de envío. NO multi-número (ocultado en UI a propósito — una instancia WhatsApp por agente).
  - Formato: one-pager portrait 1-2 páginas.
- **Diferenciador táctico descubierto en el diálogo:** WhatsApp Web limita a 4 dispositivos. OnMind permite asistentes ilimitados respondiendo desde una única conexión. Gancho concreto y operable para brokers con equipo.
- **Script nuevo `scripts/md_to_pdf_brochure.py`** — variante del `md_to_pdf.py` con CSS alineado a la guía de marca (H1 negro, H2 teal con border-bottom, blockquote como callout gris con border-left teal, Geist real vía `FontConfiguration` + TTFs en `public/fonts/`). Al final de `convert()` sincroniza automáticamente el PDF a `public/presentacion/` para el link compartible.
- **Copy reciclado de la landing validada** (`onmind/src/app/page.tsx`): hero "Que tus clientes piensen en vos cuando te necesiten", pull quote del diálogo "justo estaba por escribirte" como cierre de página 2.
- **Iteración de depuración del brochure con Raphael** hasta cerrarlo en 2 páginas con look igual a la guía: H1 pasa a "OnMind — Presentación" (nombre del documento, no tagline), tagline va dentro del callout; QR explicado como "igual que WhatsApp Web"; "importás" en lugar de "cargás"; nuevo bloque "Tu cartera se completa sola" (leads que escriben por WhatsApp entran automáticos); "responden en tu nombre"; "agente de referencia en Remax" (sin "Único Uruguay"); H2 cambia a "OnMind se suma a tu rutina"; CTA a onmindcrm.com. Archivo renombrado: `onmind-brochure-2026-04-22.{md,pdf}` (sin "argentina").
- **Fix técnico con los fonts:** weasyprint 68 ignora `@font-face` silenciosamente si no se le pasa un `FontConfiguration` explícito — por eso el PDF inicial caía a Nimbus Sans. Resuelto con `FontConfiguration()` + TTFs locales (`Geist-Regular.ttf`, `Geist-Black.ttf` copiados de node_modules a `public/fonts/`). `pdffonts` ahora confirma Geist Regular/Bold/Black/MediumItalic embebidos.
- **Guion del video demo grabado** (`docs/presentacion/onmind-guion-video-demo-2026-04-22.md`). 20 min, 8 bloques (apertura, problema, conexión, contactos, plantillas + plan anual, fechas + cierres, asistentes, riesgo de ban, cierre). Beats para que Martín improvise sobre pantalla compartida + cámara chica. Framing explícito del ban: "el riesgo es del uso de WhatsApp, no de OnMind ni de ninguna herramienta". 3 decisiones abiertas listadas al pie (orden del bloque ban, quién presenta, ejemplos reales vs genéricos).
- **Dashboard: grupo nuevo "Presentación"** en el sidebar con dos ítems: Brochure y Guion demo video. Rutas `/dashboard/presentacion/{brochure,guion-demo}/page.tsx` renderizan los `.md` vía `MarkdownRenderer`. Martín entra, lee y deja cambios que Raphael luego pasa a Claude.
- **Link público del PDF:** `public/presentacion/onmind-brochure-2026-04-22.pdf` + nuevo `src/components/pdf-link-bar.tsx` (client) arriba del brochure: muestra el URL (con `window.location.origin`), botón "Copiar link" con feedback y "Abrir PDF". `src/proxy.ts`: `.pdf` agregado al lookahead del matcher para servir archivos de `/public` sin auth.
- **Pendiente:** Martín pasa comentarios al guion por WhatsApp → Raphael los reenvía → iteración. Luego grabar y publicar. El brochure queda en estado "listo para compartir" (PDF link vivo en dashboard).

## 2026-04-27
- **Falla y recuperación de publicación a Instagram.** Por la mañana las publicaciones empezaron a fallar con `9004 / 2207052` ("Only photo or video can be accepted as media type" / "No se pudo recuperar el contenido multimedia de este URI") tanto desde piezas Satori como NB. Coincidió con un outage parcial reportado en consumer-monitors el 26-27 abr (Downdetector: 73% de quejas en "Posting/Publishing"; apistatuscheck.com con "issues" para Instagram API). No hubo cambios de código ni de infra previos.
- **Diagnóstico equivocado y horas perdidas.** Claude (yo) introdujo `media_type: "IMAGE"` en el payload de `/media` y un proxy server-side de la imagen vía `/api/piezas/[slug]/image`, basándose en research especulativo. La doc oficial de Meta dice que **`media_type` se usa solo para `REELS`/`STORIES`/`CAROUSEL` — para single photo hay que OMITIRLO**, y Meta infiere IMAGE. Agregarlo dispara el mismo error 9004/2207052 con cualquier URL.
- **Diagnóstico que nos despistó.** Como todos los tests llevaban `media_type` en el body, fallaban en cualquier dominio (Vercel Blob, marketing.onmindcrm.com, dev.onmindcrm.com via Cloudflare, MinIO en Hetzner directo `files.raphauy.dev`). Eso nos hizo creer que Meta bloqueaba dominios "no conocidos". Wikimedia funcionó porque Meta cachea URLs muy populares. Se llegó a instalar MinIO en el VPS via EasyPanel para descartar Cloudflare/Vercel; servía perfecto pero igual era rechazado por Meta — porque el problema estaba en NUESTRO body.
- **Resolución.** Revert del commit `5f6b6ea` (→ `f65e629`). El código volvió al estado anterior (Vercel Blob directo, sin `media_type`, sin proxy, sin logs). A los pocos minutos del push se publicó la pieza programada `whatsapp-conversation-mo8o540d` desde la **misma URL del Vercel Blob** que en los tests previos del día daba 9004. Ese mismo Blob URL es el que estuvo siempre y nunca fue el problema.
- **Lección operativa para el futuro.** Cuando una integración con un SDK externo (Meta, Google, etc.) **funcionaba ayer y falla hoy sin cambios de código**, la primera hipótesis es **outage transitorio del proveedor** y la primera acción es **no tocar el código** — abrir status pages, postear en el dev forum con `fbtrace_id`, esperar 24-48h. Solo intervenir si hay evidencia explícita (changelog, breaking change anunciado, mensaje de error que apunte a algo nuestro). Si se cambia algo, **leer la doc oficial primero**, no confiar en research agregado por un agente como guía única.
- **Para integraciones con Meta/IG en particular**: para single photo NO mandar `media_type`. Para video/reels/carrusel/stories sí.

## 2026-04-29
- **Nuevo documento de producto** (`docs/presentacion/onmind-producto-2026-04-29.md` + PDF). Pensado para creadores de contenido y para enviar a un prospecto antes de una demo. Punto medio entre el brochure (emocional, 2 páginas) y el Centro de Ayuda en la app (exhaustivo): cubre todo el producto, dándole peso alto a mensajes programados + plantillas y mencionando campañas con advertencia explícita (motivo principal de baneo Meta: escribirle a un número que nunca te escribió primero — Instagram, base comprada, etc).
- **Sidebar del panel:** nueva entrada "Producto" debajo de "Guión demo video" (con tilde corregida) en `src/components/panel-sidebar.tsx`. Página en `/dashboard/presentacion/producto` con `MarkdownRenderer` + `PdfLinkBar` (link público + abrir PDF, mismo patrón del brochure). PDF copiado a `public/presentacion/`.
- **Decisión durante el doc:** la sección de WhatsApp se reescribió como "Conexión de WhatsApp" (singular) — el modelo soporta multi-instancia pero el producto la limita a 1 vía UI por ahora.

## 2026-04-23
- **Fix UX del feed de programación** (`src/components/schedule-dialog.tsx`): en modo "schedule" sin fecha previa, ahora arranca con fecha actual + hora 12h (antes: fecha vacía + 18h). Reduce clics en el caso común de programar para hoy. "Reschedule" sigue respetando el valor guardado. Pendiente menor: si alguien abre el diálogo pasadas las 12h, el botón queda deshabilitado hasta mover la hora — a evaluar default dinámico en el futuro.
- **Skill `crear-pieza` — nueva regla de CTAs** (`.claude/skills/crear-pieza/SKILL.md`): lista blanca (guardar, comentar, DM sobre el producto) + prohibición explícita de CTAs tipo "comentá X y te pasamos la plantilla/guía/checklist". Surgió porque Claude propuso un CTA que prometía un deliverable no coordinado; se cierra la puerta.

## 2026-04-21
- **Evaluación Claude Design** (Anthropic Labs, 17-abr-2026): producto para landings, pitch decks, mockups desde prompt/imagen/codebase, con export a Canva/PDF/PPTX. Incluido en Pro/Max/Team/Enterprise. Fit para OnMind: landings de campaña y pitch decks. No reemplaza el pipeline AdCrate + NB para piezas sociales.
- **Nuevo template `carta-fundador`** (AdCrate #23 Long-Form Manifesto adaptado). Llena el pilar "Detrás de escena" (0% hoy) y agrega voz de fundador. Editorial puro (sin celular): opening bold + body + firma teal cursiva, 4:5.
- **Arquitectura híbrida de renderers — LLM + Satori.** Templates text-heavy se renderizan programáticamente (JSX → SVG → PNG) en vez de vía LLM. Motivación: NB2/NB Pro alucinaron typos en texto largo (ej: "estabalan"), cuestan $0.07–$0.14/imagen, tardan 14–50s, sin control tipográfico. Satori: texto literal, $0, <1s, pixel-perfect.
  - Schema: enum `TemplateRenderer { LLM, SATORI }`, campo `renderer` (default LLM), `promptTemplate` y `model` pasan a nullable.
  - Registry en `src/lib/renderers/` — map slug → render function. Cada renderer devuelve Buffer PNG. Logo overlay sigue compartido.
  - Primer renderer: `carta-fundador` (Geist Bold opening, MediumItalic firma). Fonts copiadas de `node_modules/geist/` a `public/fonts/`.
  - `generatePieceImage` en `src/services/generation-service.ts` branchea por `template.renderer`. Costo forzado a 0 para SATORI (no depende del seed).
  - UI: badge "Programático" en `/dashboard/templates`. `generation-history` formatea `satori:<slug>` como "Satori (programático)".
- **Scripts CLI a TypeScript:** `create-piece.mjs` → `.ts`, `generate-piece.mjs` → `.ts`. `generate-piece.ts` importa `addLogoOverlay` del lib compartido. Quedó como test local (guarda PNG + marca GENERATED, sin Blob ni Generation row — el flujo canónico es el service).
- **DB sincronizada con `prisma db push`** por drift pre-existente (Generation table, soft delete en Piece, etc. — nada agregado ahora) que impide `migrate dev`. Pendiente: migration SQL manual para `add_template_renderer`, probada en Neon branch antes de main. Rebaseline completo queda como deuda aparte.
- **Code review aplicado:** guard de costUsd=0 para SATORI en el service, formateo de prefijo `satori:` en historial, deduplicación del logo overlay en CLI.

## 2026-04-16 — 2026-04-17
- **Motor de contenido — modelo de datos implementado.** Migración `add_content_engine`:
  - `Template`: receta fija con `fields` (JSON que define qué campos necesita el creativo), `promptTemplate` (prompt con `{{placeholders}}`), `model` (modelo de IA), `costPerImage` (USD por imagen), `darkOverlay`, `aspectRatio`.
  - `Piece`: pieza creativa con `fieldValues` (JSON con los valores del creativo), `status` (DRAFT→GENERATING→GENERATED→APPROVED→SCHEDULED→PUBLISHED→FAILED), `imageUrl`, `costUsd`, tracking de generación.
  - `Publication`: scheduling y publicación multi-plataforma.
- **Separación de responsabilidades:**
  - Creativo (Claude Code / UI) → genera contenido, elige template, llena campos → Piece en DB (DRAFT)
  - Generador (script/botón/cron) → lee Piece + Template, arma prompt, llama OpenRouter, agrega logo → Piece (GENERATED)
  - El template define todo lo visual (prompt, modelo, dirección fotográfica). El creativo solo llena el contenido.
- **4 templates cargados en DB** con costos reales de OpenRouter:
  - `headline`: NB Pro, $0.14/imagen — título + celular WhatsApp
  - `features-pointout`: NB2, $0.07/imagen — celular + 4 callouts
  - `us-vs-them`: NB2, $0.07/imagen — comparación split manual vs OnMind
  - `stat-surround`: NB2, $0.07/imagen — celular + 4 stats radiales
- **Migración `add_cost_tracking`:** campo `costPerImage` en Template, `costUsd` en Piece.
- **Scripts del pipeline:**
  - `scripts/lib/db.mjs` — conexión compartida a DB para scripts (Neon + ws)
  - `scripts/seed-templates.mjs` — carga/actualiza templates en DB
  - `scripts/create-piece.ts` — crea Piece en DB (creativo). Soporta `--values` JSON o placeholders por defecto.
  - `scripts/generate-piece.ts` — genera imagen de una Piece: lee DB → Satori o OpenRouter según renderer → logo overlay → guarda imagen local → marca GENERATED. Test local, el flujo canónico (Blob + Generation) está en `src/services/generation-service.ts`.
  - `scripts/add-logo-overlay.mjs` — post-producción: agrega isotipo + "OnMind" + "@OnMindApp" al margen inferior.
- **Pipeline probado end-to-end:** create-piece (DRAFT) → generate-piece (GENERATED) con logo, 16s, $0.07.
- **UI del motor de contenido — implementación completa:**
  - Sidebar actualizado: Piezas, Nueva pieza, Templates, Feed, Estrategia, Marca.
  - `/dashboard/templates`: lista de templates con imagen de última generación, campos, modelo, costo, count de piezas.
  - `/dashboard/piezas`: grid filtrable por status (default: GENERATED), stats de gasto, soft delete con filtro "Eliminadas".
  - `/dashboard/piezas/nueva`: formulario dinámico por template (Select, Input, Textarea, Tooltip — todo shadcn).
  - `/dashboard/piezas/[slug]`: detalle con preview, ImageGallery (carousel con flechas + teclado), historial de generaciones con "Usar esta", metadata, acciones por status.
  - Acciones: Generar imagen (→ OpenRouter + logo overlay + Blob), Regenerar, Aprobar (AlertDialog → redirect al feed), Publicar en Instagram (AlertDialog de confirmación), Eliminar (soft delete con AlertDialog + quién eliminó).
  - BackButton con router.back() para navegación contextual.
- **Logo overlay como pill flotante:** isotipo + "OnMind" + "@OnMindApp" en pill semitransparente con sombra, compuesto sobre la imagen. Resize automático al aspect ratio del template (1080x1350 para 4:5). Fonts y logos en `public/` para Vercel serverless.
- **Historial de generaciones:** modelo `Generation` en DB. Cada generación se guarda (imageUrl, prompt, model, costUsd, durationMs). `costUsd` en Piece se acumula. Se puede seleccionar cualquier generación como activa.
- **Migración de shadcn base-ui → Radix** (new-york style). Todos los componentes reinstalados. `render={}` → `asChild`. Resolvió problemas de hidratación y UX. Documentado en CLAUDE.md.
- **Migración de 9 posts legacy** a Pieces + Publications. Scripts `migrate-legacy-posts.mjs` y `migrate-legacy-captions.mjs`. Template "legacy-batch-lanzamiento" (inactivo). Captions y hashtags migrados.
- **Feed de Instagram refactorizado:** lee de `getPublishedAndScheduledPieces()` (APPROVED, SCHEDULED, PUBLISHED). Badges: "Aprobada" (blanco sólido), check verde (PUBLISHED). Ordenado: sin publicación arriba, publicadas por fecha de IG desc. Links a `/dashboard/piezas/[slug]`. Eliminados: `instagram-publish-button.tsx`, `instagram/[post]/`, `instagram/actions.ts`.
- **Publicar desde detalle de pieza:** botón "Publicar en Instagram" (status APPROVED) con AlertDialog. Usa `publishPiece()` que llama a Instagram Graph API, crea Publication, actualiza status a PUBLISHED.
- **Skill `/crear-pieza`:** flujo conversacional en Claude Code para crear piezas. Lee templates de la DB, propone contenido on-brand, guarda como DRAFT. Incluye brand-guide.md con tono, vocabulario, pilares.
- **`maxDuration = 120`** en page.tsx para Vercel serverless (generación + overlay + Blob).
- **`serverExternalPackages`** para resvg/sharp/satori en Turbopack.
- **Investigación de menciones en Instagram API:** 3 mecanismos (@mention en caption, user_tags, collaborators). Recomendación: usar `collaborators` para que posts aparezcan en feed de co-fundadores.
- **Próximos pasos:** implementar collaborators en publicación, scheduling con cron, más templates, calendario visual.

## 2026-04-15
- **Documento Motor de Contenido** (`docs/planes/onmind-motor-contenido-2026-04-15.md`): especificación funcional completa del sistema de generación, repositorio y scheduling de contenido. 8 tipos de contenido, estados formales (DRAFT→APPROVED→SCHEDULED→PUBLISHED), modelo de datos Prisma, pipeline de generación con agentes/skills, cron de Vercel cada 15 min, 5 pantallas de UI.
- Decisiones clave: estados formales en DB, cron de Vercel (no API nativa de IG), Raphael decide solo (sin validación por pieza de Martín), OpenRouter como gateway para modelos de imagen.
- **Investigación de infografías con IA** (`docs/investigacion/investigacion-infografias-ia-2026-04-15.md`): estado del arte, comparativa de modelos, técnicas de prompting, mejores prácticas para Instagram B2B.
- **Modelos de imagen en OpenRouter** (5 confirmados via API): Nano Banana ($0.30/M), Nano Banana 2 ($0.50/M), Nano Banana Pro ($2.00/M), GPT-5 Image Mini ($2.50/M), GPT-5 Image ($10.00/M).
- **Script comparativo** (`scripts/compare-infografia.mjs`): envía el mismo prompt a múltiples modelos y guarda resultados para comparar.
- Primera comparativa de 5 modelos: Nano Banana Pro y GPT-5 Image los mejores en calidad, pero caros. Nano Banana 2 buen balance costo/calidad.
- Iteraciones de prompt: bento grid (colorinche, descartado), minimal puro (demasiado básico), balance con iconos teal (correcto pero no destacable).
- **Descubrimiento: técnica AdCrate.** Proceso de 3 pasos: Brand DNA research en Claude → templates ultra-detallados con dirección fotográfica → modelo de imagen genera. Documentado en `docs/investigacion/adcrate-templates-referencia-2026-04-15.md` (40 templates de referencia).
- **Clave del salto de calidad:** especificidad fotográfica (lentes, f-stop), layout con porcentajes, texto verbatim entre comillas, anti-instrucciones explícitas, imágenes de referencia.
- **4 templates AdCrate adaptados para OnMind** (`scripts/test-adcrate-templates.mjs`), usando celular con WhatsApp como "producto":
  1. Headline: "Tu cliente se olvidó de vos" + celular con WhatsApp
  2. Features Point-Out: celular centro + 4 callouts con líneas
  3. Us vs Them: "Gestión manual vs Con OnMind" split
  4. Stat Surround: celular + 4 stats radiales con flechas
- Generados con **Nano Banana 2** ($0.50/M, 15-20s por imagen). Resultados excelentes — calidad profesional, español correcto, celulares fotorrealistas.
- **Próximos pasos:** refinar templates, crear Brand DNA modifier formal, agregar post-procesamiento (logo overlay con Satori), integrar al pipeline del motor de contenido.

## 2026-04-07
- Exploración de logo con Ideogram (limitado) y Gemini (buenos resultados).
- Concepto elegido: la "O" de OnMind como target/círculos concéntricos.
- SVGs vectorizados con Adobe online + color corregido a #007056.
- Assets finales en `assets/logo/`: isotipo, logo OnMind, logo onmind (SVG + PNG).
- Pendiente: feedback de Martín (OnMind vs onmind), luego compilar guía de marca (ONM-104).
- Se compiló guía de marca (`docs/onmind-guia-de-marca-2026-04-07.md` + PDF) con logos, colores visuales, tipografía y tono de voz.
- Se actualizó `md_to_pdf.py`: colores OnMind (teal en vez de azul), mayor espaciado entre secciones.
- Publicado en ONM-104 para validación de Martín.
- **Fase 1: Branding completa.** Todos los issues (ONM-100 a ONM-104) en revisión por Martín.
- **Próximo paso:** cuando Martín valide, cerrar issues y planificar Fase 2 (presencia digital).
