# Music — Estrategia de música de fondo

## Política: REUSAR del library

ElevenLabs Music consume créditos caros: **~700-1.000 por track de 40s**. Generar música nueva por cada video drena el plan rápido.

**Default:** elegir un track de `content/videos-narrados/library-music/` que matchee el mood del video.

```bash
cat content/videos-narrados/library-music/INDEX.md
```

## Catálogo actual

| Track | Duración | Mood | Cuándo usar |
|---|---|---|---|
| `01-tech-modern.mp3` | 38s | Profesional, sutilmente energético | Datos duros, métricas, "Apple keynote" |
| `02-cinematic.mp3` | 42s | Aspiracional, emotivo, ascendente | Historias de logro, transformación |
| `03-lofi-warm.mp3` | 42s | Cálido, humano, cercano | Historias de personas, "detrás de escena" |

## Rotación

Para evitar repetir el mismo track en videos consecutivos, mirar los `meta.md` de los últimos 2-3 videos:

```bash
for f in $(ls -t content/videos-narrados/examples/*/meta.md | head -3); do
  grep -E "^music_track:" "$f"
done
```

Elegir un track distinto de los recientes si el mood lo permite.

## Symlink, no copia

Para mantener el library como única fuente de verdad y ahorrar espacio:

```bash
ln -sf "../../library-music/01-tech-modern.mp3" "$FOLDER/musica.mp3"
```

NO copiar el archivo — los videos en examples/ deben referenciar el library por symlink.

## Cuando regenerar (excepción)

Solo regenerar música nueva si:
1. **Ningún track del library matchea** el mood del video
2. **Duración significativamente diferente** (ej: video de 60s con contenido distinto del catálogo)
3. **Usuario lo pide explícitamente**

En esos casos, generar en `content/videos-narrados/library-music/` con número correlativo:

```bash
node .claude/skills/crear-video-narrado/templates/scripts/music.mjs \
  42000 \
  content/videos-narrados/library-music/04-<mood>.mp3 \
  --prompt "<prompt detallado en inglés>"
```

Después actualizar `INDEX.md` con la descripción del nuevo track.

## Prompts: estructura efectiva

Plantilla genérica para prompts de música ambient para narración:

```
[adjetivo de género] background music. 
[Instrumentación específica].
[Energía y dinámica].
Designed to sit under a Spanish narration about [tema].
[Referencia estilística]. No vocals.
```

Ejemplos de moods adicionales útiles para futuros tracks:

**Tense / urgent:**
> Tense minimal background music. Subtle pulsing low-end synth, sparse high notes. Building sense of urgency without being aggressive. Designed to sit under a Spanish narration about a problem or risk. Reminiscent of investigative documentary score. No vocals, no drums.

**Uplifting acoustic:**
> Bright acoustic background music. Soft fingerpicked guitar, warm strings, light tambourine accents. Hopeful and forward-moving. Designed to sit under a Spanish narration about success and small wins. Reminiscent of indie film soundtrack. No vocals.

**Hybrid orchestral-electronic:**
> Modern hybrid background music. Pulsing analog synth bass under sustained orchestral strings. Confident and momentum-driven, never bombastic. Designed to sit under a Spanish narration about innovation and scale. Reminiscent of high-end startup brand films. No vocals.

## Reglas para prompts

- **Siempre en inglés** — el modelo entiende mejor descriptores musicales en inglés
- **No drums** — la mayoría de narrations B2B no quieren batería marcada
- **No vocals** — siempre, si no la voz IA cantando puede aparecer
- **Mencionar "designed to sit under a Spanish narration"** — orienta al modelo a no competir con voz
- **Referencia estilística** ("Apple keynote", "indie film", "documentary") — ayuda al modelo a anclar el sonido
- **Energía:** "subtle", "restrained", "never bombastic" — la música no es protagonista

## Mezcla con voz

Ver `templates/scripts/mix-audio.sh`. Defaults probados:
- `volume=0.30` para música (~ -10.5dB bajo voz)
- `delay=2000ms` para voz (2s de música sola al inicio)
- `fade-out=2s` al final del archivo de música

Si el usuario reporta:
- "Música muy alta" → bajar a `0.20-0.25`
- "Música muy baja" → subir a `0.40-0.45`
- "Voz muy pegada al inicio" → aumentar delay a `2500-3000ms`
- "Música arranca después de la voz" → bajar delay (ej: `1000ms`) o verificar que el archivo no tenga silencio inicial
