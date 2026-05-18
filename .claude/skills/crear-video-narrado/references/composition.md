# Composition — Patrones HyperFrames probados

## Recurso obligatorio antes de empezar

Invocar el skill `hyperframes` antes de escribir cualquier composición:

```
/hyperframes
```

Ese skill (instalado en `.claude/skills/hyperframes/`) tiene las reglas exactas del framework: `data-*` attributes, `class="clip"`, registro en `window.__timelines`, transiciones, etc. ESTE doc complementa con patrones específicos de OnMind.

## Reglas críticas validadas en POC

Reglas sacadas de iteración real con feedback del usuario en sesión inicial:

### 0. CRÍTICO — Offset de +2 segundos en todos los timings

**El bug más fácil de cometer y el más difícil de detectar mirando el output.**

- `timestamps.json` (forced alignment) reporta tiempos sobre `voz.mp3` puro — la voz empieza en `~0.0s`
- La pista de audio del video es `mezcla.mp3`, donde `mix-audio.sh` aplicó `adelay=2000` a la voz para que la música arranque sola. La voz arranca a **`2.0s`**
- Por lo tanto **TODOS los timings de la timeline GSAP deben usar `tiempo_voz_pura + 2.0`**:

```js
// MAL: usar timestamps del JSON directo
showScene("s0", 0.3);  // visual aparece a 0.3s del video, pero la voz arranca a 2.0s
// Resultado: visual va 2s adelantado, el espectador ve cambios sin escuchar nada

// BIEN: sumar offset +2
showScene("s0", 2.3);  // visual aparece cuando arranca la voz "OnMind..."
```

Aplica a: `showScene`, `hideScene`, `tl.from`, `tl.to`, count-ups, fade-ins de chips, todo lo que tenga timestamp.

Si en algún momento se cambia el delay (4to argumento de `mix-audio.sh`, default `2000` ms), ajustar el offset proporcionalmente.

**Síntoma del bug:** el usuario reporta que "la parte visual va adelantada", o que cuando el audio recién arranca, el video ya lleva 2 segundos.

### 1. Sin emojis en visuales
Los emojis (📝 🏷️ etc) le quitan profesionalismo a B2B. Reemplazar con:
- Tipografía bold + barra teal vertical a la izquierda
- Números grandes (01, 02, 03) como indicadores de paso
- Divisores horizontales sutiles (`#d1d5db`, 1px height)

### 2. Hold time generoso en datos clave
Después de un count-up, el número debe quedar visible **2-3 segundos** antes de transicionar. Si la voz pasa al siguiente tema antes, mantener el dato visible — el oyente está procesándolo.

**Mal:** count-up de 745 termina a 11.3s, escena se va a 12.0s. Visible solo 0.7s.
**Bien:** count-up termina a 11.3s, escena se va a 13.0s. Visible 1.7s.

### 2b. Tail post-voz mínimo de 1.0s al hacer hide

El `hideScene` de cada escena debe ocurrir **mínimo 1.0s después** de la última palabra de esa escena (sumando el offset +2s al timestamp del forced alignment). Tail más generoso (1.2-1.5s) en cambios entre escenas grandes.

Si el tail es 0.3-0.5s, el visual se va mientras todavía se escucha la cola de la frase y el espectador percibe el corte como adelantado.

### 3. Combinar escenas relacionadas
Si dos datos están narrativamente conectados, ponerlos en la misma pantalla acumulando, no en escenas separadas que se cortan.

**Caso real probado:** "Y ya tiene 5.559 mensajes listos... que él no va a escribir, ni pensar, ni recordar." → una sola escena con 5.559 arriba (queda fijo) + divisor + las tres palabras tachadas abajo (aparecen en cascada). NO dos escenas separadas.

### 4. Outro siempre con `@OnMindApp`
Y al menos 2-3 segundos de aire al final. Instagram loop puede cortar el último frame; el viewer necesita poder leer el handle antes de que reinicie o pase al siguiente Reel.

Texto outro estándar:
```
@OnMindApp
automatizá el vínculo con tus clientes
```

### 5. Tipografía dentro del canvas
Cuidado con tamaños grandes que se salen de los 1080px de ancho. Para texto bold con `letter-spacing: -0.025em`:
- 160px → "@OnMindApp" se sale (10 chars × ~95px)
- 132px → encaja con margen

Regla: si una palabra única tiene >9 caracteres y la querés a >120px, probar primero o reducir.

## Paleta de marca

```css
--bg: #fafafa;          /* fondo principal (NO #fff puro, suaviza) */
--text: #111;           /* texto principal */
--muted: #555;          /* texto secundario */
--teal: #007056;        /* acento principal OnMind */
--teal-soft: #e7f4f0;   /* fondo de chip @OnMindApp */
--accent-red: #b91c1c;  /* tachado, comparativos negativos */
--divider: #d1d5db;     /* divisores sutiles */
```

## Estructura de scene típica

```html
<div class="scene" id="s3">
  <div class="pretitle" id="s3-pre">Texto descriptivo arriba del dato</div>
  <div class="big-num" id="s3-num">0</div>
  <div class="post-label" id="s3-label">
    contexto <span class="muted">del número</span>
  </div>
</div>
```

Con CSS:
```css
.scene {
  position: absolute; inset: 0;
  opacity: 0;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  padding: 160px 90px;
  text-align: center;
}
.pretitle { font-size: 44px; font-weight: 600; color: #555; margin-bottom: 36px; }
.big-num { font-size: 380px; font-weight: 900; color: #007056;
  font-variant-numeric: tabular-nums; line-height: 0.95; letter-spacing: -0.05em; }
.post-label { font-size: 52px; font-weight: 600; margin-top: 36px; max-width: 920px; }
```

## Patrón count-up (deterministic, seekable)

```js
const counter = { v: 0 };
tl.to(counter, {
  v: 745,                    // valor final
  duration: 1.8,             // velocidad (1.5-2.5s típico)
  ease: "power2.out",
  onUpdate: function () {
    const el = document.getElementById("s3-num");
    if (el) el.textContent = Math.round(counter.v);
  },
}, 9.2);                     // timestamp de inicio (sincronizar con voz)
```

Para números muy grandes (5.559), usar `power3.out` para que arranque rápido y desacelere — visualmente más impactante.

## Patrón scene crossfade

Helpers:

```js
function showScene(id, t, dur = 0.5) {
  tl.to("#" + id, { opacity: 1, duration: dur, ease: "power2.out" }, t);
}
function hideScene(id, t, dur = 0.4) {
  tl.to("#" + id, { opacity: 0, duration: dur, ease: "power2.in" }, t);
}
```

Uso:

```js
showScene("s2", 4.1);   // S2 fade-in a los 4.1s
hideScene("s2", 7.7);   // S2 fade-out a los 7.7s
showScene("s3", 7.8);   // S3 fade-in (overlap leve crea crossfade)
```

## Patrón "comparativo acumulado" (54% vs <20%)

Para destacar un dato propio contra un benchmark:

```html
<div class="scene" id="s4">
  <div class="stats">
    <div>
      <div class="pretitle">Tasa de respuesta</div>
      <div class="stat-row primary">
        <div class="num" id="s4-num">0</div>
        <div class="pct">%</div>
      </div>
    </div>
    <div class="vs-divider" id="s4-divider"></div>
    <div class="vs-block" id="s4-vs">
      <div class="vs-context">En WhatsApp marketing tradicional el promedio es de</div>
      <div class="vs-row">
        <div class="vs-prefix">menos de</div>
        <div class="vs-num">20</div>
        <div class="vs-pct">%</div>
      </div>
    </div>
  </div>
</div>
```

Timeline: el dato propio (54%) aparece primero y queda fijo. Después el divisor se dibuja con `scaleX` from 0 to 1, y el bloque de comparación entra desde abajo. Ambos co-existen visualmente para reforzar el contraste.

Color benchmark: rojo `#b91c1c` para que el ojo lo lea como "lo malo" y el teal del dato propio como "lo bueno".

## Patrón "cascada de palabras tachadas"

Para frases tipo "no va a escribir, pensar, ni recordar":

```html
<div class="actions">
  <div class="action" id="act-1">escribir</div>
  <div class="action" id="act-2">pensar</div>
  <div class="action" id="act-3">recordar</div>
</div>
```

```css
.action {
  font-size: 92px; font-weight: 800;
  color: #b91c1c;
  text-decoration: line-through;
  text-decoration-thickness: 8px;
  text-decoration-color: #b91c1c;
}
```

```js
tl.from("#act-1", { opacity: 0, x: -40, duration: 0.4, ease: "power3.out" }, 31.5);
tl.from("#act-2", { opacity: 0, x: -40, duration: 0.4, ease: "power3.out" }, 32.3);
tl.from("#act-3", { opacity: 0, x: -40, duration: 0.4, ease: "power3.out" }, 33.0);
```

Sincronizar el timestamp de cada palabra con el momento exacto en que la voz la dice (ver `timestamps.json` del Forced Alignment).

## Audio track

Único `<audio>` con la mezcla:

```html
<audio
  id="audio-mezcla"
  data-start="0"
  data-duration="38"
  data-track-index="9"
  src="mezcla.mp3"
  data-volume="1"
></audio>
```

`data-track-index="9"` arbitrario alto para no chocar con tracks visuales (que típicamente usan 0-2). NO incluir `class="clip"` en audio elements.

## Anti-patterns descubiertos

| Anti-pattern | Síntoma | Solución |
|---|---|---|
| GSAP a pseudo-elementos (`::after`) | Fail silencioso, no anima | Usar elementos reales con clases CSS |
| Emojis para iconografía | Se ve poco profesional | Tipografía + accentos geométricos |
| Datos efímeros (<1s visibles) | Viewer no procesa | Hold time 2-3s post count-up |
| Escenas separadas para datos relacionados | Sensación de cortes | Combinar en una sola scene |
| Texto muy ancho (>1000px) | Se sale del canvas | `max-width: 920px` siempre |
| Outro corto (<2s) | Loop Instagram corta | Mínimo 2-3s de hold final |

## Referencia obligatoria: ejemplos previos

Antes de componer un video nuevo, leer al menos `index.html` de los últimos 2 videos en `content/videos-narrados/examples/`. Detectar patrones de timing, layout, transitions que ya funcionaron y reusar.
