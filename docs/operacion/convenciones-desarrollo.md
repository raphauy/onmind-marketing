# Convenciones de desarrollo — OnMind Marketing

**Autor:** Raphael | **Fecha:** 2026-04-14

Estas convenciones replican las del repo principal de OnMind (`/home/raphael/desarrollo/onmind`) para mantener coherencia entre proyectos.

## Arquitectura por capas

```
UI (RSC por defecto) → Server Actions → Services → Prisma
                    ↘ API Routes (solo webhooks, cron, APIs externas)
```

- **Services** (`src/services/*-service.ts`): UNICA capa que usa Prisma directamente. Funciones, no clases. Lanza errores (las actions los capturan).
- **Actions** (`actions.ts` en carpetas de rutas): orquestación interna. Llama servicios, valida con Zod, devuelve `ActionResult`.
- **API Routes** (`src/app/api/`): SOLO para webhooks, cron jobs y APIs externas. NUNCA para consumo interno de la UI.
- **UI**: Server Components por defecto. `"use client"` solo cuando hay interactividad (state, event handlers).

## Tipo ActionResult (estándar para actions)

```typescript
type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }
```

## Naming

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Archivos | `kebab-case` | `instagram-service.ts` |
| Funciones/vars | `camelCase` | `getPublishStatus()` |
| Componentes | `PascalCase` | `PublishButton` |
| Types/Interfaces | `PascalCase` + sufijo | `InstagramPostWithStatus`, `CreatePostInput` |
| Servicios | `[entity]-service.ts` | `instagram-service.ts` |
| Actions | `actions.ts` en carpeta de ruta | `dashboard/instagram/actions.ts` |
| Validaciones | `[entity].ts` | `src/lib/validations/instagram.ts` |

### Sufijos de tipos

- `*WithRelations` — con relaciones
- `*Filters` — objeto de filtros
- `Create*Input` / `Update*Input` — esquemas de validación
- `*Stats` — estadísticas

## Estructura de componentes

- **Server Components** por defecto (RSC)
- **Suspense + Skeleton** para loading (NO usar `loading.tsx`)
- **`'use client'`** solo en componentes interactivos
- Props de pages como `Promise` (convención Next.js 16)
- `notFound()` para 404, `redirect()` para redirecciones

## Prisma

- IDs con `cuid()`
- `createdAt` y `updatedAt` en todas las entidades
- `onDelete: Cascade` para relaciones dependientes
- Indexes en campos frecuentemente consultados

### Cambios de schema: `db push`, no `migrate dev`

En este proyecto **se usa `prisma db push`** para aplicar cambios al schema, no `prisma migrate dev`. La carpeta `prisma/migrations/` quedó como historia legacy y ya hay drift acumulado contra la DB; intentar `migrate dev` pide reset y borraría datos.

Flujo al cambiar el schema:

```bash
# 1. editar prisma/schema.prisma
# 2. sincronizar la DB (no genera archivo de migración)
npx prisma db push
# 3. regenerar el cliente
npx prisma generate
```

Notas:
- `db push` NO genera SQL versionado en la carpeta `migrations/`. El schema en sí (`schema.prisma`) es la fuente de verdad y queda en git — eso es suficiente para este proyecto.
- Si un cambio implica pérdida de datos (drop de columna con data), Prisma lo avisa antes; revisar y confirmar.
- En producción (Vercel), el `postinstall: prisma generate` ya regenera el cliente; el schema cambia cuando se mergea el cambio a `schema.prisma` y se corre `db push` manualmente apuntando a la DB de prod.

## Remotion (templates de video)

- Templates en `src/remotion/templates/*.tsx`. Cada uno se registra en `src/remotion/Root.tsx` con un `<Composition id="…">` cuyo `id` es el slug del Template en la DB (`renderer: "REMOTION"`).
- Iteración visual: `pnpm remotion:studio` (preview en vivo, ajuste de props, scrub de timeline).
- Render local rápido: `pnpm remotion:render <slug> output/videos/<file>.mp4`.
- Pipeline de generación: `src/lib/remotion/render.ts` despacha entre `render-local.ts` (dev/scripts) y `render-on-vercel.ts` (producción Vercel) según `process.env.VERCEL`.

### Vercel Sandbox (producción)

El render en producción no puede correr en una Vercel Function (Chromium + FFmpeg pasan el límite de tamaño). Se delega a [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) usando un **snapshot precocido** que arranca en ~1-2s.

**Cuándo regenerar el snapshot:**
- La primera vez (setup inicial).
- Cada vez que se editan archivos en `src/remotion/*` (templates, fonts, componentes, assets).
- Cuando se actualiza la versión de `@remotion/*` o cambian deps que afectan el bundle.

**Cómo:**

```bash
pnpm remotion:snapshot
```

El script bundle-ea el proyecto Remotion, crea un sandbox, instala Chromium + deps, sube el bundle, hace `sandbox.snapshot()`, y persiste el `snapshotId` en Vercel Blob bajo la clave `snapshot-cache/remotion.json`. Tarda ~60-90s.

**Auth:** requiere `BLOB_READ_WRITE_TOKEN` y `VERCEL_OIDC_TOKEN` (o `VERCEL_TOKEN`+`VERCEL_TEAM_ID`+`VERCEL_PROJECT_ID`). Para pull-ear las creds:

```bash
vercel link            # vincular al proyecto
vercel env pull .env.local
```

**Costos:** crear el snapshot es one-shot por revisión de los templates (no por deploy). Los renders runtime usan el snapshot — solo se cobra el tiempo de CPU del render, no la instalación.

**Workaround de bug en `@remotion/vercel`:** la función oficial `addBundleToSandbox` falla con bundles de varios niveles de directorios (no usa `mkdir { recursive: true }` y la lista de dirs no incluye ancestros). En `src/lib/remotion/upload-bundle.ts` tenemos un reemplazo con la misma firma pero arreglado. Cuando Remotion publique un fix podemos quitar el wrapper.

**Snapshot compartido entre entornos:** la clave `snapshot-cache/remotion.json` en Vercel Blob es global por cuenta — no varía por `VERCEL_ENV`. Si en algún momento separamos preview/prod con stores Blob distintos, esto deja de ser tema. Mientras tanto: regenerar el snapshot desde local impacta producción inmediatamente. Si necesitás iterar templates sin tocar prod, hacelo en una rama y regenerá el snapshot solo cuando merguees (manual).

## Validaciones con Zod

- Ubicación: `src/lib/validations/*.ts`
- Mensajes de error en español con acentos
- `schema.safeParse()` en actions

## Qué NO hacer

- Usar Prisma fuera de services
- Crear API routes para consumo interno (usar actions)
- Agregar `"use client"` sin interactividad real
- Try-catch en services (solo en actions)
- Crear clases para services (usar funciones)
- Strings en español sin acentos (usar á, é, í, ó, ú, ñ)
- Usar `loading.tsx` (usar Suspense + Skeleton)
