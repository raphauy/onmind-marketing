# Estado de los 40 templates AdCrate en OnMind

Mapping de cuáles AdCrate están implementados como template de OnMind y cuáles siguen disponibles. **Actualizá este archivo cada vez que crees un template nuevo.**

Referencia completa de los 40: [`docs/investigacion/adcrate-templates-referencia-2026-04-15.md`](../../../../docs/investigacion/adcrate-templates-referencia-2026-04-15.md).

## Usados (no los propongas de nuevo)

| # | Nombre AdCrate | Slug OnMind | Renderer | Pilar principal |
|---|---|---|---|---|
| 1 | Headline | `headline` | LLM (NB Pro) | Educación / Dolor |
| 4 | Features Point-Out | `features-pointout` | LLM (NB2) | Producto |
| 7 | Us vs Them | `us-vs-them` | LLM (NB2) | Dolor / Producto |
| 13 | Stat Surround | `stat-surround` | LLM (NB2) | Educación |
| 19 | Highlighted Testimonial | `testimonio-destacado` | Satori | Social proof |
| 21 | Bold Statement | `bold-statement` | Satori | Educación / Dolor |
| 23 | Long-Form Manifesto | `carta-fundador` | Satori | Detrás de escena / Dolor |

**Template custom** (sin padre AdCrate directo): `whatsapp-conversation` — conversación de 2 rondas, muestra continuidad del vínculo en el tiempo. Cubre Producto / Educación.

## Disponibles (candidatos a implementar)

### Texto / Copy prominente
- _(#21 Bold Statement — usado)_
- _(#23 Long-Form Manifesto — usado)_

### Ofertas y promociones
- **#2 Offer/Promotion** (9:16) — split color, oferta arriba, producto centro. Stories.
- **#37 Hero Statement + Offer Burst** (1:1) — statement + starburst de descuento + producto.

### Social proof / Testimonios
- **#3 Testimonials** (9:16) — producto en ambiente real + quote overlay.
- **#6 Social Proof** (4:5) — headline + estrellas + review card + logos press.
- **#9 Negative Marketing** (4:5) — review falsa negativa que en realidad es positiva. Requiere humor fino.
- **#11 Pull-Quote Review Card** (4:5) — quote emocional + card de review truncada.
- **#15 Social Comment Screenshot** (1:1) — comentario social + producto abajo.
- **#17 Verified Review Card** (4:5) — review UI realista + producto al lado.
- _(#19 Highlighted Testimonial — usado)_
- **#24 Product + Comment Callout** (1:1) — producto arriba + comment estilo Facebook.

⚠️ Todos los de social proof **requieren testimonios reales**. No inventar.

### Comparaciones
- _(#7 Us vs Them — usado)_
- **#25 Us vs Them Color Split** (1:1) — variante con colores fuertes + VS burst.
- **#31 Comparison Grid** (1:1) — tabla comparativa tipo meme.

### Features / Beneficios
- _(#4 Features Point-Out — usado)_
- **#5 Bullet-Points** (4:5) — split: producto izq, beneficios derecha.
- _(#13 Stat Surround — usado)_
- **#27 Benefit Checklist** (1:1) — split: producto + checklist con estrellas.
- **#28 Feature Arrow Callout** (1:1) — mano con producto + flechas a beneficios.
- **#30 Hero Statement + Icon Bar** (1:1) — statement + foto lifestyle + íconos de beneficios.
- **#35 Hero Product + Stat Bar** (1:1) — producto hero + barra de estadísticas abajo.

### Lifestyle / UGC
- **#8 Before & After (UGC)** (9:16) — mirror selfie antes/después estilo TikTok. No encaja con B2B inmobiliario.
- **#12 Lifestyle Action + Array** (1:1) — persona en acción + variantes de producto.
- **#18 Stat Surround Lifestyle** (1:1) — flatlay lifestyle + stats radiales.
- **#29 UGC + Viral Post Overlay** (9:16) — selfie casual + screenshot de post viral. No encaja con B2B.
- **#32 UGC Story Callout** (9:16) — foto iPhone + text bubbles estilo IG Story. No encaja.
- **#36 Whiteboard Before/After** (4:5) — pizarra con dibujo + producto en mano. No muy minimal.

### Resto (10 templates AdCrate no listados arriba)

El archivo de referencia tiene los 40 completos. Los que no aparecen en este archivo son candidatos válidos que quedaron fuera del resumen por brevedad — revisalos si ninguno de arriba encaja.

## Heurística rápida para filtrar

Al proponer candidatos, descartá los que:

- **Requieren UGC / selfie / foto en espejo** → no encaja con tono B2B inmobiliario profesional.
- **Requieren testimonios reales** que no tenemos todavía (social proof en general) — a menos que el usuario ya tenga testimonios.
- **Son variantes cosméticas** de algo ya implementado (ej: #25 Us vs Them Color Split sería redundante con `us-vs-them`).
- **Son muy "colorinches" o decorativos** — el brand es minimalista, sin patrones ni gradientes chillones.

Preferí los que:

- Llenan el pilar más desatendido (chequeá `scripts/content-status.ts`).
- Aportan **variedad visual** al feed (si todos los templates son phone-centric, un template editorial pega más).
- Son **buenos candidatos Satori** (text-heavy, sin fotos realistas) → mayor calidad + cero costo + determinismo.
