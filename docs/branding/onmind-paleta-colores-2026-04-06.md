# OnMind — Paleta de Colores

> Colores oficiales de la marca, derivados de la identidad visual de la app.

**Autor:** Raphael & Claude AI
**Fecha:** 2026-04-06

---

## Color primario

El teal de OnMind. Transmite confianza, profesionalismo y cercanía. Es el color que identifica a la marca en cualquier contexto.

| Variante | HEX | RGB | oklch | Uso |
|----------|-----|-----|-------|-----|
| **Primary** | `#007056` | 0, 112, 86 | 0.47 0.13 175 | Botones, íconos principales, sidebar, links |
| **Primary hover** | `#00876D` | 0, 135, 109 | 0.55 0.12 175 | Hover de elementos primarios, foco |
| **Primary light** | `#00AB89` | 0, 171, 137 | 0.65 0.15 175 | Uso en fondos oscuros (dark mode) |
| **Primary dark** | `#004A37` | 0, 74, 55 | 0.35 0.10 175 | Texto sobre fondos claros de acento |

## Color de acento

Versión suave del primario para fondos y áreas destacadas.

| Variante | HEX | RGB | oklch | Uso |
|----------|-----|-----|-------|-----|
| **Accent bg** | `#E1F3ED` | 225, 243, 237 | 0.95 0.02 175 | Fondos destacados, cards, badges |

## Neutros

Grises para texto, fondos y bordes. Sin tinte de color — neutros puros.

| Variante | HEX | RGB | oklch | Uso |
|----------|-----|-----|-------|-----|
| **Foreground** | `#0A0A0A` | 10, 10, 10 | 0.145 0 0 | Texto principal |
| **Muted** | `#737373` | 115, 115, 115 | 0.556 0 0 | Texto secundario, descripciones |
| **Border** | `#E5E5E5` | 229, 229, 229 | 0.922 0 0 | Bordes, separadores |
| **Surface** | `#F4F4F4` | 244, 244, 244 | 0.97 0 0 | Fondos secundarios |
| **Background** | `#FEFEFE` | 254, 254, 254 | 1 0 0 | Fondo principal |

## Color de estado

| Estado | HEX | RGB | Uso |
|--------|-----|-----|-----|
| **Error/Destructivo** | `#E7000A` | 231, 0, 10 | Errores, acciones destructivas, alertas críticas |
| **Éxito** | `#007056` | 0, 112, 86 | Confirmaciones (usa el primary) |
| **Alerta** | `#F59E0B` | 245, 158, 11 | Advertencias, atención requerida |
| **Info** | `#00876D` | 0, 135, 109 | Información, tips |

## Notas de aplicación

- **En marketing (redes, landing, emails):** usar Primary (`#007056`) como color dominante, Accent bg (`#E1F3ED`) para fondos, neutros para texto.
- **En la app:** ya están aplicados estos colores via oklch en `globals.css`.
- **Contraste:** Primary sobre blanco cumple WCAG AA para texto grande. Para texto pequeño, usar Primary dark (`#004A37`).
- **No usar:** colores primarios como fondo con texto blanco en tamaño pequeño — el contraste puede ser insuficiente.

---

*Paleta derivada de los colores actuales de la app OnMind (globals.css). Consistente entre producto y marca.*
