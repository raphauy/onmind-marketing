# Plan: Autenticación con Email + OTP

**Autor:** Raphael (con Claude)
**Fecha:** 2026-04-10
**Estado:** Propuesta — pendiente de ejecución

## Objetivo

Proteger el panel interno de OnMind Marketing (`/dashboard/*` y el resto del árbol privado) con login por email + OTP, replicando el patrón ya resuelto en OnMind. Arranca con 2 usuarios (Raphael y Martín), sin UI de administración ni roles. La base queda lista para sumar colaboradores en el futuro.

## Contexto del repo al momento de planificar

- `src/app/page.tsx` ya es la home pública con logo "OnMind Marketing" y botón **Dashboard** linkeando a `/dashboard` (coincide con el mockup decidido).
- `src/app/dashboard/` ya existe con layout propio (sidebar, trigger) y subsecciones: `estrategia`, `landings`, `marca`. **No hay que crear UI de dashboard, solo protegerla.**
- Next 16.2.2, React 19.2.4. Sin Prisma, sin Auth.js, sin Resend instalados todavía.
- Next 16 usa `src/proxy.ts` (no `middleware.ts`). OnMind ya está en este modelo y su `proxy.ts` es la referencia directa.
- OnMind (`/home/raphael/desarrollo/onmind`) tiene el sistema de referencia completo: Auth.js v5 beta + Credentials + OTP + Resend + React Email + Prisma + proxy.ts.

## Decisiones cerradas

| Decisión | Elegido |
|---|---|
| Rutas públicas | Solo `/` y `/login` (+ `/api/auth/*`) |
| Rutas protegidas | Todo lo demás (`/dashboard/*`, futuras) |
| Post-login | Redirect a `/dashboard` (o `callbackUrl` si viene) |
| Botón en home | Condicional: "Dashboard" si hay sesión, "Login" si no |
| Dominio email / Resend | Mismo que OnMind (Raphael configura `.env`) |
| Base de datos | Neon nueva (Raphael configura `.env`) |
| Roles / admin UI | Fuera de alcance (fase 2) |
| Alta de usuarios | Seed script con Raphael y Martín |
| Estrategia de sesión | JWT (sin tabla de sesiones) |
| Protección de rutas | `src/proxy.ts` con runtime Node (permite Prisma) |

## Fuente: qué se copia desde OnMind

Rutas de origen (absolutas, repo `/home/raphael/desarrollo/onmind`):

**Copiar tal cual:**
- `src/lib/auth.ts` → config de Auth.js
- `src/lib/prisma.ts` → cliente singleton de Prisma
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/services/auth-service.ts` → `generateOtp`, `createOtpToken`, `verifyOtpToken`
- `src/components/emails/otp-email.tsx`
- `src/components/emails/email-theme.ts`
- `src/app/login/page.tsx`
- `src/app/login/login-form.tsx`

**Copiar con recortes:**
- `src/services/email-service.ts` → solo `sendOtpEmail`; descartar `sendClientUserInvitation`, `sendSuperadminInvitation` y cualquier otro template del CRM.
- `src/app/login/actions.ts` → descartar `getUserRoleAndFirstClient()` y la lógica de redirect por rol/slug. Reemplazar por redirect fijo a `/dashboard` (o `callbackUrl` si viene).
- `src/proxy.ts` → recortar bloques de `/admin` y `/dash/[slug]`. Dejar solo: whitelist pública, check de token, revalidación de usuario vivo en DB.
- `prisma/schema.prisma` → extraer solo los modelos `User` y `OtpToken`, recortando campos acoplados al CRM.

## Ajustes específicos al copiar

### Schema Prisma (versión marketing)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  otpTokens OtpToken[]
}

model OtpToken {
  id        String    @id @default(cuid())
  token     String
  userId    String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}
```

Recortes vs OnMind: se elimina `role`, `isOnboarded`, y todas las relaciones a `Client`, `ClientUser`, `Campaign`, `Invitation`.

### Auth.js callbacks

- `jwt`: solo `id`, `email`, `name`, `image`. Sin `role`.
- `session`: expone esos mismos campos en `session.user`.
- Mantener `trustHost: true` y `useSecureCookies` condicional por `NODE_ENV`.

### Template OTP

- Cambiar títulos y footer a **OnMind Marketing**.
- Mantener colores del brand (`#007056`). Revisar que `email-theme.ts` coincida con la identidad del sitio de marketing.

### `actions.ts` — `verifyOtpAction`

Reemplazar:
```ts
const { redirectUrl } = await getUserRoleAndFirstClient(...)
return { success: true, redirectUrl }
```
Por:
```ts
return { success: true, redirectUrl: callbackUrl ?? '/dashboard' }
```

### `src/proxy.ts` (versión marketing)

Basado en `/home/raphael/desarrollo/onmind/src/proxy.ts`, recortado:

- **Rutas públicas:** `['/', '/login', '/api/auth']`. Importante: el match de `/` es exacto (`pathname === '/'`), no prefijo, para que `/dashboard` no caiga como público.
- **Lectura de token:** `getToken` de `next-auth/jwt` con `cookieName` condicional por `NODE_ENV` (`__Secure-authjs.session-token` en prod, `authjs.session-token` en dev), idéntico a OnMind.
- **Sin token → redirect a `/login?callbackUrl=<pathname>`**.
- **Con token → revalidar en DB** que `user.isActive`. Si el usuario no existe o está inactivo, limpiar cookies y redirect a `/login` (mismo patrón que OnMind).
- **Eliminar:** bloques `/admin` (no hay roles) y `/dash/[slug]` (no hay multi-tenant).
- **Matcher:** mismo que OnMind, excluye `_next/static`, `_next/image`, `favicon.ico` y archivos estáticos por extensión.

```ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Atención con landings:** si `src/app/landings/*` o `src/app/dashboard/landings/*` sirven páginas públicas (landings generadas), hay que sumarlas a `publicRoutes` o moverlas fuera de `/dashboard`. A verificar en Fase 4 antes de activar el proxy.

## Home condicional

Editar `src/app/page.tsx` para que sea Server Component que llame a `auth()`:

```tsx
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()
  const isLoggedIn = Boolean(session?.user)
  const href = isLoggedIn ? '/dashboard' : '/login'
  const label = isLoggedIn ? 'Dashboard' : 'Login'
  // ... mismo markup (logo + "Marketing"), botón usa href/label
}
```

El resto del markup (logo + "Marketing" + estilos) queda idéntico.

## Seed

`prisma/seed.ts`:
- Inserta `raphael@...` y `martin@...` con `isActive: true`.
- Emails concretos los define Raphael en el momento de ejecutar.
- Script ejecutable vía `pnpm prisma db seed` (configurar en `package.json` con `"prisma": { "seed": "tsx prisma/seed.ts" }`).

## Variables de entorno a sumar

```
DATABASE_URL=
DIRECT_DATABASE_URL=
NEXTAUTH_URL=https://marketing.onmindcrm.com
AUTH_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
```

Nota: OnMind usa indistintamente `AUTH_SECRET` o `NEXTAUTH_SECRET` (el proxy lee ambos). Para marketing fijamos `AUTH_SECRET` como nombre canónico.

Raphael las completa en `.env.local` y en Vercel.

## Dependencias a instalar

```
pnpm add next-auth@beta @prisma/client resend @react-email/components input-otp zod
pnpm add -D prisma tsx
```

Versiones de referencia (las de OnMind):
- `next-auth@5.0.0-beta.30`
- `prisma@6` + `@prisma/client@6`
- `resend@^6.5.2`
- `@react-email/components@^1.0.1`
- `input-otp@^1.4.2`

## Fases de ejecución

### Fase 1 — Infra base
1. Instalar dependencias.
2. Crear `prisma/schema.prisma` con los 2 modelos.
3. Copiar `src/lib/prisma.ts`.
4. Raphael deja `.env.local` con Neon + Resend + `AUTH_SECRET`.
5. `pnpm prisma migrate dev --name init_auth`.
6. Crear `prisma/seed.ts` y ejecutarlo.

### Fase 2 — Auth core
7. Copiar/adaptar `src/lib/auth.ts` y `src/app/api/auth/[...nextauth]/route.ts`.
8. Copiar/adaptar `auth-service.ts`, `email-service.ts` (recortado), templates de email.
9. Ajustar copy del template OTP a "OnMind Marketing".

### Fase 3 — Login UI
10. Copiar `src/app/login/page.tsx`, `login-form.tsx`, `actions.ts`.
11. Recortar `verifyOtpAction` (redirect fijo a `/dashboard`).
12. Smoke test: login end-to-end en dev (Raphael corre el server).

### Fase 4 — Protección de rutas
13. Antes del proxy: auditar `src/app/landings/*` y `src/app/dashboard/landings/*` para decidir cuáles son públicas.
14. Crear `src/proxy.ts` (versión recortada del de OnMind).
15. Modificar `src/app/page.tsx` para botón condicional.
16. Probar: logout → `/dashboard` redirige a `/login?callbackUrl=/dashboard`; login → vuelve a `/dashboard`; home con sesión muestra "Dashboard", sin sesión muestra "Login".

### Fase 5 — Deploy
17. Cargar env vars en Vercel.
18. Verificar que Neon tiene pooler para Vercel (`DATABASE_URL` con `-pooler`, `DIRECT_DATABASE_URL` sin).
19. Deploy y verificación en `marketing.onmindcrm.com`.

## Fuera de alcance (explícito)

- UI de administración de usuarios.
- Sistema de invitaciones.
- Roles y permisos granulares.
- Logout UI (se puede agregar después; en el ínterin vía devtools o una ruta `/logout` mínima).
- Rate limiting en endpoints de OTP (OnMind tampoco tiene explícito; ver en fase 2 si hace falta).

## Riesgos y cosas a vigilar

- **Landings públicas:** confirmar qué hay en `src/app/landings/` y `src/app/dashboard/landings/`. Si las generadas son públicas, hay que listarlas en `publicRoutes` del proxy o moverlas fuera de `/dashboard` antes de activar la protección.
- **Conflicto de versiones:** Next 16.2.2 y Auth.js beta tienen compatibilidades sensibles. Si algo revienta, revisar changelog de `next-auth@5.0.0-beta.*`.
- **Cookies en producción:** `useSecureCookies: true` exige HTTPS. En Vercel es automático; localhost usa `NODE_ENV=development` para desactivarlo. El nombre de cookie en el proxy tiene que coincidir con el que emite Auth.js (ya manejado por la lógica condicional copiada de OnMind).
- **Seed idempotente:** el script debe usar `upsert` por email, no `create`, para poder re-ejecutarse sin romper.
