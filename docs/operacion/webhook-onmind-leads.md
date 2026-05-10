# Webhook OnMind → onmind-marketing — contrato

**Autor:** Raphael · **Fecha:** 2026-05-10

Cuando un prospecto envía el formulario de demo en la landing de OnMind, el repo de **OnMind** debe emitir un webhook hacia **onmind-marketing** para que el lead entre automáticamente al CRM con asignación de owner round-robin y notificación por email a ambos socios.

Esto **no reemplaza** el email actual a Raphael y Martín — corre en paralelo. La fuente de verdad de la gestión del lead pasa a ser onmind-marketing.

## Endpoint

| Entorno  | URL                                                                       |
| -------- | ------------------------------------------------------------------------- |
| Prod     | `https://marketing.onmindcrm.com/api/webhooks/onmind/leads`               |
| Dev      | `https://dev.onmindcrm.com/api/webhooks/onmind/leads` *(Cloudflare tunnel)* |

**Método:** `POST`

## Headers

| Header             | Valor                                                              |
| ------------------ | ------------------------------------------------------------------ |
| `Content-Type`     | `application/json`                                                 |
| `X-OnMind-Secret`  | `${ONMIND_WEBHOOK_SECRET}` (shared secret, idéntico en ambos repos) |

El secret se compara con `timingSafeEqual` (sin filtraciones por timing). Si el header falta o no matchea: **401 unauthorized**.

## Body

```json
{
  "name": "Juan Pérez",
  "email": "juan@inmobiliaria-ejemplo.com",
  "phone": "+54 9 11 5555 5555",
  "source": "WEB",
  "businessType": "inmobiliaria"
}
```

| Campo          | Tipo                                                  | Requerido | Notas                                                                |
| -------------- | ----------------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `name`         | `string`                                              | sí        | Nombre del prospecto. Trim automático.                                |
| `email`        | `string`                                              | sí        | Validado como email.                                                  |
| `phone`        | `string \| null`                                      | no        | WhatsApp con código de país. Recomendado para que después se pueda enviar el link de booking por WhatsApp. |
| `source`       | `"INSTAGRAM" \| "WEB" \| "REFERRAL" \| "OTHER"`        | no        | Default: `"WEB"`.                                                     |
| `businessType` | `string \| null`                                      | no        | Rubro libre (inmobiliaria, gimnasio, etc.).                           |

## Respuestas

### 200 OK — lead nuevo

```json
{
  "ok": true,
  "duplicated": false,
  "leadId": "ckxxxxxxxxxxxxx",
  "ownerUserId": "ckxxxxxxxxxxxxx"
}
```

El lead fue creado. Se asignó owner por round-robin par/impar (cuenta los leads totales de la DB). Se enviaron emails a ambos socios.

### 200 OK — duplicado

```json
{
  "ok": true,
  "duplicated": true,
  "leadId": "ckxxxxxxxxxxxxx"
}
```

Ya existía un lead con ese email. **No se crea uno nuevo.** Se registra un evento `SYSTEM` en el timeline del lead existente con la marca de duplicado. Esto hace al endpoint **idempotente** — los retries son seguros.

### 400 — body inválido

```json
{
  "ok": false,
  "error": "invalid_payload",
  "issues": [
    { "path": ["email"], "message": "email inválido" }
  ]
}
```

O bien:

```json
{ "ok": false, "error": "invalid_json" }
```

### 401 — unauthorized

```json
{ "ok": false, "error": "unauthorized" }
```

Falta o no coincide `X-OnMind-Secret`.

### 500 — server misconfigured

```json
{ "ok": false, "error": "server_misconfigured" }
```

El servidor no tiene `ONMIND_WEBHOOK_SECRET` configurado. No retryear, contactar al admin.

## Retries

El endpoint es idempotente por `email` — está bien retryear ante fallo de red, 5xx, o timeout. No se generan duplicados en el CRM.

Sugerencia para el repo OnMind: 3 reintentos con backoff exponencial (5s, 30s, 2min). Si los 3 fallan, loguear y seguir con el flujo normal (el email actual a Raphael y Martín sigue funcionando como fallback).

## Cómo lo va a llamar el repo OnMind

En el handler que hoy envía el email cuando llega un demo request, después de enviarlo:

```ts
const res = await fetch(`${process.env.ONMIND_MARKETING_WEBHOOK_URL}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-OnMind-Secret": process.env.ONMIND_WEBHOOK_SECRET!,
  },
  body: JSON.stringify({
    name: form.name,
    email: form.email,
    phone: form.phone || null,
    source: "WEB",
  }),
})
```

## Variables de entorno

### En el repo de OnMind (emisor)

```
ONMIND_MARKETING_WEBHOOK_URL=https://marketing.onmindcrm.com/api/webhooks/onmind/leads
ONMIND_WEBHOOK_SECRET=<misma cadena que en onmind-marketing>
```

### En onmind-marketing (receptor)

```
ONMIND_WEBHOOK_SECRET=<misma cadena que en OnMind>
```

Generación recomendada:

```bash
openssl rand -hex 32
```

## Test manual

```bash
curl -X POST https://marketing.onmindcrm.com/api/webhooks/onmind/leads \
  -H "Content-Type: application/json" \
  -H "X-OnMind-Secret: $ONMIND_WEBHOOK_SECRET" \
  -d '{
    "name": "Test Lead",
    "email": "test+'$(date +%s)'@example.com",
    "phone": "+598 99 999 999",
    "source": "WEB",
    "businessType": "inmobiliaria"
  }'
```

Se espera `200 OK` con `leadId` y `ownerUserId`. Verificar en `/dashboard/leads` que apareció con owner asignado y que llegó email a Raphael y Martín.
