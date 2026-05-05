# Voice — TTS con ElevenLabs

## Voice ID por defecto

`s4W8kh4jMEsHFHA7NqXQ` — voz español del library de ElevenLabs. Plan **Starter** ($5/mes) requerido para usarla vía API. Confirmada en sesión inicial: timbre natural, ritmo fluido, ~33s para script de 548 caracteres.

NO cambiar este voice ID salvo pedido explícito del usuario. Mantener una sola voz construye consistencia de marca audio.

## Settings TTS

El script `templates/scripts/tts.mjs` usa estos parámetros (modelo `eleven_multilingual_v2`):

```js
voice_settings: {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.3,
  use_speaker_boost: true,
}
```

- **stability 0.5:** balance entre consistencia y expresividad
- **similarity_boost 0.75:** alta fidelidad al timbre del voice
- **style 0.3:** algo de variación expresiva (más alto = más dramático, menos natural)
- **use_speaker_boost:** mejora claridad de la voz

Si el usuario reporta que la voz suena monótona, subir `style` a 0.4-0.5. Si suena inestable o mal pronunciada, bajar `style` a 0.1-0.2.

## Costo por TTS

Plan Starter: 30k créditos/mes. Cada carácter de TTS consume ~1 crédito (varía por modelo). Un script de 500-600 caracteres consume ~500 créditos = ~1.7% del balance mensual.

## Voces alternativas (free, sin upgrade)

Las 8 premade voices funcionan en plan free. Las 5 que soportan español vía multilingual_v2:

| Voice ID | Nombre | Género/Acento |
|---|---|---|
| `EXAVITQu4vr4xnSDxMaL` | Sarah | Femenina, americana |
| `CwhRBWXzGAHq8TQ4Fs17` | Roger | Masculina, americana |
| `JBFqnCBsd6RMkjVDRZzb` | George | Masculina, británica |
| `IKne3meq5aSn9XLyUdCD` | Charlie | Masculina, australiana |
| `FGY2WhTYpPnrIDTdsKH5` | Laura | Femenina, americana |

Acento extranjero notable. Útiles para POCs sin gastar plan, no para producción.

## Listar voces de la cuenta

```bash
node .claude/skills/crear-video-narrado/templates/scripts/list-voices.mjs
```

(Si el archivo no existe en templates/, está en `experimentos/hyperframes/onmind-narrado/scripts/list-voices.mjs`.)

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `402 paid_plan_required` | Voice ID es de library público y la cuenta es free | Upgrade a Starter o usar premade voice |
| `401 unauthorized` | API key inválida o sin permisos TTS | Verificar `ELEVENLABS_API_KEY` en `.env.local` raíz del proyecto |
| Audio cortado al final | Script muy largo para créditos restantes | Verificar balance en dashboard ElevenLabs |
| Pronuncia números mal | TTS lee dígitos literal | Escribir números importantes en palabras ("setecientos cuarenta y cinco") |

## Forced Alignment (timestamps palabra-a-palabra)

Después de generar la voz, correr:

```bash
node .claude/skills/crear-video-narrado/templates/scripts/align.mjs \
  voz.mp3 script.txt timestamps.json
```

Devuelve JSON con array `words` que tiene `text`, `start`, `end` por palabra. CRÍTICO para sincronizar visuales con el audio en la composición HyperFrames.

Costo Forced Alignment: bajo (similar a TTS, ~caracteres del script).

## Regeneración de voz

Si el usuario pide regenerar la voz (no satisfecho con cómo sonó):
1. **Primero ofrecer editar el script** (puntuación, palabras alternativas, comas para pausas)
2. Si insiste con regenerar voz idéntica, simplemente correr de nuevo `tts.mjs` — ElevenLabs introduce variación
3. Si quiere cambiar la voz misma, advertir que rompe consistencia de marca y pedir confirmación
