# AdCrate — Templates de Prompts para Generación de Ads con IA

**Fecha:** 2026-04-15
**Fuente:** https://adcrate.notion.site/Nano-Banana-2-Prompt-Document
**Crédito original:** AdCrate / Will Sartorius (Master Brand Research)
**Propósito:** Referencia para adaptar a OnMind

---

## Proceso AdCrate

### Paso 1: Brand Research en Claude
Prompt que le pide a Claude actuar como Senior Brand Strategist y hacer reverse-engineering de la marca:
- Investigación externa: diseñador, guidelines, tipografía, colores, packaging, ads en Meta Ad Library
- Análisis on-site: voz, fotografía, tipografía, colores, layout, packaging
- Contexto competitivo: 2-3 competidores
- Output: Brand DNA Document con secciones: Overview, Visual System, Photography Direction, Product Details, Ad Creative Style, Image Generation Prompt Modifier (párrafo de 50-75 palabras para prepend a cualquier prompt)

### Paso 2: Follow-up en Claude
Toma los templates y los llena con detalles específicos de la marca usando el Brand DNA. Adjunta imágenes del producto. Genera prompts standalone listos para el modelo de imagen.

### Paso 3: Generar en modelo de imagen
Cada prompt se pone directamente en el modelo (Nano Banana 2 / Higgsfield) con imágenes de referencia del producto adjuntas.

---

## Los 40 Templates

### Categoría: Texto/Copy prominente
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 1 | Headline | 4:5 | Headline grande + subhead + producto abajo |
| 21 | Bold Statement | 1:1 | Frase provocativa + gradiente + producto |
| 23 | Long-Form Manifesto | 1:1 | Solo texto tipo carta, producto abajo |

### Categoría: Ofertas y promociones
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 2 | Offer/Promotion | 9:16 | Split color, oferta arriba, producto centro |
| 37 | Hero Statement + Offer Burst | 1:1 | Statement + starburst de descuento + producto |

### Categoría: Social proof / Testimonios
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 3 | Testimonials | 9:16 | Producto en ambiente real + quote overlay |
| 6 | Social Proof | 4:5 | Headline + estrellas + review card + logos press |
| 9 | Negative Marketing | 4:5 | Review falsa negativa que es positiva |
| 11 | Pull-Quote Review Card | 4:5 | Quote emocional + card de review truncada |
| 15 | Social Comment Screenshot | 1:1 | Comentario social + producto abajo |
| 17 | Verified Review Card | 4:5 | Review UI realista + producto al lado |
| 19 | Highlighted Testimonial | 1:1 | Review larga con frases resaltadas en highlighter |
| 24 | Product + Comment Callout | 1:1 | Producto arriba + comment estilo Facebook |

### Categoría: Comparaciones
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 7 | Us vs Them | 4:5 | Split vertical, checkmarks vs X marks |
| 25 | Us vs Them Color Split | 1:1 | Variante con colores fuertes + VS burst |
| 31 | Comparison Grid | 1:1 | Tabla comparativa tipo meme |

### Categoría: Features / Beneficios
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 4 | Features Point-Out | 4:5 | Diagrama educativo con callouts + líneas |
| 5 | Bullet-Points | 4:5 | Split: producto izq, beneficios derecha |
| 13 | Stat Surround | 1:1 | Producto centro + stats radiales con flechas |
| 27 | Benefit Checklist | 1:1 | Split: producto + checklist con estrellas |
| 28 | Feature Arrow Callout | 1:1 | Mano con producto + flechas a beneficios |
| 30 | Hero Statement + Icon Bar | 1:1 | Statement + foto lifestyle + íconos de beneficios |
| 35 | Hero Product + Stat Bar | 1:1 | Producto hero + barra de estadísticas abajo |

### Categoría: Lifestyle / UGC
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 8 | Before & After (UGC) | 9:16 | Mirror selfie antes/después estilo TikTok |
| 12 | Lifestyle Action + Array | 1:1 | Persona en acción + variantes de producto |
| 18 | Stat Surround Lifestyle | 1:1 | Flatlay lifestyle + stats radiales |
| 29 | UGC + Viral Post Overlay | 9:16 | Selfie casual + screenshot de post viral |
| 32 | UGC Story Callout | 9:16 | Foto iPhone + text bubbles estilo IG Story |
| 36 | Whiteboard Before/After | 4:5 | Pizarra con dibujo + producto en mano |
| 38 | UGC Lifestyle + Review Split | 4:5 | Foto casual + card de review al lado |
| 40 | Post-It Note Style | 4:5 | Producto en ambiente real + post-it pegado |

### Categoría: Editorial / Press
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 10 | Press/Editorial | 4:5 | Logos de prensa + pull-quote + producto |
| 20 | Advertorial Content Card | 4:5 | Parece post de blog/news, no ad |
| 33 | Faux Press Screenshot | 4:5 | Screenshot de artículo de prensa falso |
| 34 | Faux iPhone Notes | 1:1 | Screenshot de app Notes con beneficios |

### Categoría: Curiosidad / Hook
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 16 | Curiosity Gap Quote | 1:1 | Headline bait-and-switch con reveal |
| 39 | Curiosity Gap Scroll-Stopper | 1:1 | Caption truncada + foto del problema |

### Categoría: Producto específico
| # | Nombre | Formato | Descripción |
|---|--------|---------|-------------|
| 14 | Bundle Showcase | 1:1 | Caja abierta con productos + barra de beneficios |
| 22 | Flavor Story | 1:1 | Escena de comida + producto + stats |
| 26 | Stat Callout Lifestyle | 4:5 | Foto lifestyle + stat headline abajo |

---

## Aprendizajes clave para OnMind

### Lo que hace funcionar estos prompts:
1. **Especificidad de cámara:** "Shot at 50mm f/2.8 from slightly above" — le da al modelo una dirección fotográfica concreta
2. **Porcentajes de layout:** "Top 60% is [color], bottom 40% is [color]" — controla la composición exacta
3. **Texto exacto entre comillas:** Todo el copy va entre comillas para que el modelo lo reproduzca verbatim
4. **Referencia de marca adjunta:** "Use the attached images as brand reference" — consistencia visual
5. **Anti-instrucciones:** "No watermarks, no decorative borders" — previene elementos no deseados
6. **Mood y energía:** "Clean, authoritative" / "Should look like someone screenshotted a real comment"

### Adaptación para OnMind (SaaS sin producto físico):
- No tenemos producto físico para fotografiar → el "producto" es el celular con WhatsApp / la interfaz de OnMind
- Podemos generar screenshots de la app como "producto"
- Los templates de social proof, testimonios, stats, y editorial aplican directamente
- Los de UGC se pueden adaptar (persona usando el celular en vez de sosteniendo un frasco)
- Los de comparación aplican perfecto (manual vs OnMind)
