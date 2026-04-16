# Investigación: Generación de Infografías con IA

**Fecha:** 2026-04-15
**Autor:** Raphael + Claude
**Objetivo:** Evaluar el estado del arte para generar infografías profesionales para Instagram B2B

---

## Resumen

El problema histórico del renderizado de texto en imágenes IA fue resuelto sustancialmente por los modelos de 2025-2026. Nano Banana Pro y GPT-5 Image producen texto legible, layouts coherentes y contenido correcto. Sin embargo, el mejor resultado no viene de un solo prompt sino de un flujo de tres etapas: LLM estructura contenido → modelo de imagen renderiza → refinamiento humano.

---

## 1. Patrones de generación actuales

### Patrón A: Prompt directo (prompt-to-image)
Escribir un prompt descriptivo y pedir la infografía directamente.
- **Funciona para:** infografías simples de 3-5 elementos
- **Falla para:** contenido denso, datos específicos, colores de marca exactos

### Patrón B: LLM + modelo de imagen (el más efectivo)
Tres etapas:
1. LLM genera contenido estructurado + brief visual
2. Modelo de imagen renderiza con instrucciones de estilo
3. Refinamiento iterativo en la misma sesión

### Patrón C: Herramientas especializadas
Napkin AI, Venngage, Piktochart, Canva. Más controlables, más genéricas.

### Patrón D: Pipeline programático
LLM genera datos estructurados → motor de renderizado (Puppeteer, Satori) convierte a imagen. Máximo control de marca, requiere desarrollo. **Es lo que ya hacemos con Satori para los templates existentes.**

---

## 2. Comparativa de modelos

### Los dos líderes para infografías

| Criterio | Nano Banana Pro (Gemini 3) | GPT-5 Image (OpenAI) |
|---|---|---|
| Text rendering | Excelente, incluso párrafos | Muy bueno, erratas ocasionales en texto denso |
| Layout de infografías | El mejor — layouts intencionales | Bueno, inconsistencias en tamaño de fuentes |
| Control de colores | Bueno con hex codes | Bueno, más consistente entre iteraciones |
| Español | Soportado | Soportado y documentado |
| Resolución | 4K nativo | 1024x1024 nativo, escalable |
| Precio por imagen | ~$0.24 (4K) | ~$0.06-0.08 (estándar) |

**Ranking:** Nano Banana Pro > GPT-5 Image > Nano Banana 2 > GPT-5 Image Mini > Nano Banana

### Modelos disponibles en OpenRouter

| Modelo | ID | Costo (prompt/completion por M tokens) |
|---|---|---|
| Nano Banana | `google/gemini-2.5-flash-image` | $0.30 / $2.50 |
| Nano Banana 2 | `google/gemini-3.1-flash-image-preview` | $0.50 / $3.00 |
| Nano Banana Pro | `google/gemini-3-pro-image-preview` | $2.00 / $12.00 |
| GPT-5 Image Mini | `openai/gpt-5-image-mini` | $2.50 / $2.00 |
| GPT-5 Image | `openai/gpt-5-image` | $10.00 / $10.00 |

---

## 3. Técnicas de prompting

### Framework base
```
[FORMATO] + [CONTENIDO] + [ESTILO VISUAL] + [TIPOGRAFÍA/COLOR] + [RESTRICCIONES]
```

### Técnicas clave

1. **Especificar hex codes exactos** para colores. Los modelos respetan hex mejor que descripciones como "azul corporativo".

2. **Replicación de estilo:** Después de una pieza buena, decir: "Use the exact same layout, style, and orientation as the previous infographic, but replace content with: [nuevo]".

3. **Sketch-to-image:** Adjuntar un boceto como guía de layout. Nano Banana Pro acepta imágenes de referencia.

4. **Dos turnos:** Turno 1 genera contenido estructurado, Turno 2 genera la imagen. Aprovecha el contexto acumulado.

5. **Refinamiento incremental:** "Deja todo igual pero: (1) aumenta el título, (2) cambia el fondo de la sección 3". Más efectivo que regenerar.

6. **Pedir menos:** 4-5 elementos bien ejecutados. Luego agregar en iteraciones.

7. **Texto verbatim:** Generar el texto exacto en el LLM, pasarlo al modelo de imagen con instrucción de no modificarlo. Evita erratas y anglicismos.

### Prompt template para OnMind

```
Create a professional vertical infographic, 4:5 portrait (1080x1350px).

CONTENT:
Title: "[título en español]"
Section 1 icon: [icono] | "[texto]"
Section 2 icon: [icono] | "[texto]"
Section 3 icon: [icono] | "[texto]"
Section 4 icon: [icono] | "[texto]"
CTA: "@OnMindApp — [llamada a la acción]"

VISUAL STYLE:
Clean, minimal B2B. White background (#FEFEFE).
Primary teal (#007056). Accent (#00876D). Surface (#F4F4F4).
Flat icons, no gradients, no 3D. Generous whitespace.

TYPOGRAPHY:
Bold sans-serif headline. Medium body. ALL text in Spanish.
Min body text: 14pt for mobile legibility.

CONSTRAINTS:
No watermarks. No decorative borders. No stock photos.
Professional B2B SaaS aesthetic. Maximum 80 words total.
```

---

## 4. Limitaciones y workarounds

| Problema | Severidad | Workaround |
|---|---|---|
| Erratas en español | Media (mejoró mucho) | Revisar siempre; texto crítico verificar o editar post-generación |
| Layout inconsistente | Alta | Técnica de replicación de estilo; imágenes de referencia |
| Colores de marca inexactos | Media | Hex codes en prompt; ajustar en Canva si hace falta |
| Contenido incorrecto | Alta para datos | Proveer todos los datos, no dejar que el modelo invente |
| Ilegible en móvil | Alta | Máximo 80 palabras; jerarquía clara; preview en pantalla chica |
| Anglicismos en español | Media | Generar texto en LLM aparte, pasar verbatim |

---

## 5. Mejores prácticas para Instagram B2B

- **Formato recomendado:** 4:5 (1080x1350px) para posts, carruseles
- **Carruseles: 114% más engagement** que posts individuales (Buffer, feb 2026)
- **Sweet spot de slides:** 8-10 para engagement máximo (2.07% rate)
- **Un insight central por infografía** — doble retención vs múltiples ideas
- **Colores de confianza:** Azules profundos y verdes outperforman rojos/naranjas en B2B
- **Regla de 3 segundos:** El hook visual del primer impacto es lo más importante
- **Bento grid layout:** Patrón dominante en 2026 — secciones modulares escaneables

---

## 6. Herramientas especializadas evaluadas

| Herramienta | Para qué | Veredicto para OnMind |
|---|---|---|
| **Napkin AI** | Diagramas y flows rápidos | Útil para diagramas de proceso, no para infografías de Instagram |
| **Venngage** | Infografías B2B con brand kit | Buena para series sistemáticas, $19/mes |
| **Canva Magic Studio** | Edición final y resize | Excelente como paso final, no como generador principal |
| **Piktochart AI** | Datos y estadísticas | Relevante si hay mucho contenido cuantitativo |
| **Gamma** | Presentaciones y docs | Interesante pero orientado a presentaciones, no posts IG |

---

## 7. Recomendación para OnMind

### Flujo propuesto (Patrón B)

1. **[5 min] Contenido con Claude:** Definir insight central, estructurar 4-5 puntos + CTA, máximo 80 palabras
2. **[5 min] Renderizar con Nano Banana Pro** (via OpenRouter): Brief + especificaciones de marca, 2-3 variantes
3. **[10 min] Refinar:** Verificar texto en español, ajustar colores si hace falta, agregar logo/handle

### Siguiente paso

Crear un script de prototipado que:
1. Use Claude para generar el contenido estructurado
2. Llame a los 5 modelos de OpenRouter con el mismo prompt
3. Guarde las 5 imágenes para comparar lado a lado
4. Iterar hasta encontrar el mejor modelo + prompt para infografías OnMind
