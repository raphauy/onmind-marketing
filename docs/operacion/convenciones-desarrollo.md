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
| Migrations | `snake_case` | `--name add_instagram_publish` |

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
- Migrations con nombres en `snake_case`: `--name add_instagram_publish`

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
