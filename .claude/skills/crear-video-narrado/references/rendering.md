# Rendering — Workflow Docker para HyperFrames

## Por qué Docker

HyperFrames requiere Node 22+, FFmpeg 7.x, Chromium headless con libs específicas. El sistema del usuario tiene Node 20 y FFmpeg 6 — incompatible.

**Solución:** correr todo en contenedor Docker basado en `node:22-bookworm-slim`. Imagen local `onmind-hyperframes:local` ya buildeada en sesión inicial (~5-10 min de build, una sola vez).

## Verificar imagen Docker

```bash
docker images onmind-hyperframes:local
```

Si no existe (sistema nuevo), buildear:

```bash
docker build -t onmind-hyperframes:local \
  /home/raphael/desarrollo/onmind-marketing/.claude/skills/crear-video-narrado/templates/
```

## Workflow estándar (3 comandos)

### Lint

```bash
PROJECT_PATH="content/videos-narrados/examples/$SLUG"

docker run --rm --user "$(id -u):$(id -g)" \
  -e HOME=/tmp -e npm_config_cache=/tmp/.npm \
  -v "$(pwd)/$PROJECT_PATH:/work" -w /work \
  onmind-hyperframes:local \
  npx -y hyperframes lint
```

Esperá `0 error(s)`. Warnings tipo `composition_file_too_large` se pueden aceptar (recomienda dividir en sub-compositions, no es crítico).

### Render

```bash
docker run --rm --user "$(id -u):$(id -g)" \
  -e HOME=/tmp -e npm_config_cache=/tmp/.npm \
  -v "$(pwd)/$PROJECT_PATH:/work" -w /work \
  onmind-hyperframes:local \
  npx -y hyperframes render --output output.mp4
```

Tiempo aproximado: ~25-35s para video de 38s @ 30fps (1140 frames).

### Generar thumbnail

```bash
docker run --rm --user "$(id -u):$(id -g)" \
  -v "$(pwd)/$PROJECT_PATH:/work" -w /work \
  onmind-hyperframes:local \
  ffmpeg -y -ss <segundos> -i output.mp4 -frames:v 1 -q:v 2 thumbnail.jpg
```

Elegir `<segundos>` mirando el timeline: el momento en que el dato más impactante está completo y centrado.

## Wrapper run.sh (legacy del experimento)

`experimentos/hyperframes/run.sh` es un wrapper construido en sesión inicial. Espera proyecto bajo `experimentos/hyperframes/<dir>`, NO bajo `content/`. Para usarlo con la nueva estructura hay que:
- Adaptar el wrapper, o
- Usar comandos docker directos (preferido — más explícito y portable)

Recomendación: para el skill, usar comandos docker directos como en los ejemplos arriba. El wrapper queda para los experimentos viejos.

## Permisos de archivos

CRÍTICO: usar `--user "$(id -u):$(id -g)"` en cada `docker run`. Sin esto, los archivos generados quedan owned por root y no se pueden editar después sin sudo.

## Variables de entorno necesarias

`-e HOME=/tmp -e npm_config_cache=/tmp/.npm` — porque `--user` con UID arbitrario no tiene HOME válido y npm/npx fallan al escribir cache. Forzar a `/tmp` resuelve.

## Boilerplate del proyecto

HyperFrames requiere ciertos archivos en la raíz del proyecto para funcionar:
- `index.html` — composición
- `meta.json` — metadata
- `package.json`
- `hyperframes.json`
- `CLAUDE.md` (lo crea el init pero no es obligatorio runtime)

Para un video nuevo, copiar boilerplate de un example existente:

```bash
SRC=content/videos-narrados/examples/2026-05-05-agente-real
DST=content/videos-narrados/examples/$SLUG
cp $SRC/{hyperframes.json,meta.json,package.json} $DST/
# Editar meta.json con el slug correcto
```

(Iteración futura: extraer estos archivos a `templates/` del skill para que el copy-paste sea desde un origen único.)

## Audio en composición

El `<audio>` element en `index.html` referencia `mezcla.mp3` por path relativo. Por eso `mezcla.mp3` debe estar en la raíz del folder del proyecto (no dentro de un subfolder). Si está como symlink (caso normal), Docker lo resuelve correctamente al montarlo en `/work`.

## Modo screenshot vs beginFrame

En el log del render aparece:
```
[BrowserManager] HeadlessExperimental.beginFrame unavailable in this Chromium build; falling back to screenshot mode.
```

Esto es normal con la versión de Chromium del contenedor. El render funciona, sólo es un poco más lento que el modo deterministo `beginFrame`. No afecta la calidad del output.

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `EACCES: permission denied` al escribir | Files owned por root | Re-run docker con `--user $(id -u):$(id -g)` |
| `Cannot find module hyperframes` | npx no encontró el paquete | Asegurar `-e HOME=/tmp` |
| Lint error `composition_file_too_large` | HTML > 400 líneas | OK como warning, ignorable. Para fix: dividir en sub-compositions |
| Render se queda en 0% | Composición rompe en headless Chrome | Abrir `index.html` en browser local, debuggear errores JS |
| Output sin audio | `<audio>` mal configurado o `src` no existe | Verificar que `mezcla.mp3` exista en la raíz del folder |
| Output muy chico (<1MB) para 30s+ | Render se cortó | Revisar logs completos, posiblemente OOM o crash de Chromium |

## Logs detallados

Si algo falla, correr el comando en foreground (sin `&` ni `run_in_background`) y mirar el output completo. El render imprime cada etapa: compile → frames → encode → assemble.

## Costos

Render local en Docker: $0. Sólo CPU/disco. No hay llamadas a servicios externos durante el render.

(Lo único que cuesta dinero en el flujo es ElevenLabs TTS + Music API, ya cubierto en `voice.md` y `music.md`.)

## Cleanup

El contenedor se autodestrue (`--rm`). El image queda. Para limpiar imagen:

```bash
docker rmi onmind-hyperframes:local
```

(Solo hacer si querés rebuildear desde cero. La imagen ocupa ~1.5GB.)
