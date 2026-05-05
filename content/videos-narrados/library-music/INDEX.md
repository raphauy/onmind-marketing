# Music library — videos narrados OnMind

Tracks pre-generados con ElevenLabs Music API. Reutilizables en distintos videos para evitar gastar créditos cada vez.

## Catálogo

### `01-tech-modern.mp3` — 38s
**Mood:** profesional, moderno, sutilmente energético
**Cuándo usar:** datos duros, métricas, crecimiento, "Apple keynote vibe"
**Prompt original:**
> Modern minimal tech background music. Subtle electronic pulse with a steady understated beat. Soft analog synth bass, gentle high-end shimmer, light percussive ticks. Confident professional energy, momentum without being aggressive. Designed to sit under a Spanish narration about business data. Inspired by Apple keynote underscores and modern tech product videos. No vocals.

### `02-cinematic.mp3` — 42s
**Mood:** aspiracional, emotivo, ascendente
**Cuándo usar:** historias de logro, transformación de un cliente, hitos
**Prompt original:**
> Inspiring cinematic background music. Soft piano arpeggio with warm strings underneath. Slow-building sense of momentum. Hopeful and aspirational but restrained, never bombastic. Designed to sit under a Spanish narration about business growth and real people achieving meaningful results. No drums or hard percussion. Reminiscent of documentary score and emotional product videos. No vocals.

### `03-lofi-warm.mp3` — 42s
**Mood:** cálido, humano, cercano
**Cuándo usar:** historias de personas, "behind the scenes", contenido del pilar "detrás de escena"
**Prompt original:**
> Warm lofi instrumental background music. Soft electric piano (Rhodes), mellow upright bass, very subtle vinyl crackle texture, no drums. Cozy intimate atmosphere, relaxed pace. Designed to sit under a Spanish narration about a real person and their everyday work. Mellow and human, never sleepy. No vocals, no aggressive beats.

## Reglas de uso

1. **Por defecto, reusar tracks de aquí**, no regenerar — los créditos de ElevenLabs Music son caros (~700-1000 por track de 40s)
2. **Rotación:** preferir un track distinto al de los últimos 2-3 videos publicados (revisar `meta.md` de carpetas previas)
3. **Regenerar solo si:**
   - Ningún mood de la library encaja con el video que se está creando
   - Necesitás una duración significativamente diferente (ej: video de 60s)
   - El usuario lo pide explícitamente
4. **Si se regenera:** guardar el nuevo track en esta carpeta con número correlativo (`04-...`, `05-...`) y actualizar este INDEX.md
