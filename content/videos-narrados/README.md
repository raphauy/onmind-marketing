# Videos narrados — output del skill `crear-video-narrado`

Estructura:

```
content/videos-narrados/
  library-music/                # Tracks de música pre-generados, reutilizables
    01-tech-modern.mp3
    02-cinematic.mp3
    03-lofi-warm.mp3
    INDEX.md                    # Catálogo con descripción de cada track

  examples/                     # Videos producidos. Cada uno sirve como ejemplo
    YYYY-MM-DD-slug/            # Un folder por video. Ejemplo: 2026-05-05-agente-real
      script.txt                # Texto narrado original (input a TTS)
      voz.mp3                   # Audio TTS de ElevenLabs
      musica.mp3                # Symlink al track de library-music/ usado
      mezcla.mp3                # Voz + música mezcladas (asset de audio final)
      timestamps.json           # Forced Alignment palabra-a-palabra
      index.html                # Composición HyperFrames
      output.mp4                # Video final (asset publicable)
      thumbnail.jpg             # Frame para preview / Vercel Blob
      meta.md                   # Metadata: tema, pilar, hook, fecha, voice ID, music track
      caption.md                # Caption + hashtags para Instagram
```

## Convenciones

- **Naming de carpetas:** `YYYY-MM-DD-slug` (fecha de creación + slug breve descriptivo del tema)
- **Música:** por defecto se reusa de `library-music/` (rotando para no repetir consecutivamente). Solo regenerar si el mood no aplica
- **Voz:** voice ID `s4W8kh4jMEsHFHA7NqXQ` (ElevenLabs, español)
- **Composición:** seguir patrones de `meta.md` y `index.html` de videos anteriores como referencia

## Por qué existe esta carpeta

El skill `crear-video-narrado` lee el contenido de `content/videos-narrados/` para:
1. Saber qué temas ya se hicieron (no duplicar)
2. Aprender de composiciones HTML previas
3. Mantener registro auditeable de cada pieza generada

A diferencia de las piezas paramétricas (templates LLM/SATORI/REMOTION) que viven solo en la DB, los videos narrados son bespoke y necesitan archivos de soporte (script, audio, composición). La pieza se registra igual en la DB con renderer `HYPERFRAMES`.
