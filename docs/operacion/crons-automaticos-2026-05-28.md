# Crons automáticos de generación de contenido

**Autor:** Claude
**Fecha:** 2026-05-28

Hay dos crons corriendo en la máquina local de Raphael que invocan Claude Code en modo headless (`claude -p`) para generar contenido nuevo sin intervención humana. Los assets quedan en la DB y se pueden aprobar o descartar desde la UI de producción.

## Resumen

| Cron | Schedule | Script | Skill que ejecuta | Output |
|---|---|---|---|---|
| Pieza de contenido | `0 8 * * *` (diario 08:00) | `scripts/cron-crear-pieza.sh` | `/crear-pieza` | Una pieza nueva (status `DRAFT` o `GENERATED` según template), pilar = más atrasado vs target |
| Video narrado | `15 8 */2 * *` (cada 2 días 08:15) | `scripts/cron-crear-video-narrado.sh` | `/crear-video-narrado` | Un video 9:16 ~30-50s con voz TTS + música + composición HyperFrames + render MP4, status `GENERATED` |

## Líneas para `crontab -e`

```
0 8 * * *      /home/raphael/desarrollo/onmind-marketing/scripts/cron-crear-pieza.sh
15 8 */2 * *   /home/raphael/desarrollo/onmind-marketing/scripts/cron-crear-video-narrado.sh
```

## Cómo funcionan

Cada script bash:

1. Setea `HOME` y `PATH` (cron arranca con env mínima — incluye el bin de node de nvm para que los hooks de Claude Code funcionen).
2. `cd` al repo (para que se carguen los skills de `.claude/skills/`).
3. Invoca `claude -p "<prompt>" --permission-mode bypassPermissions`.
4. El prompt activa el skill correspondiente y le dice explícito: modo automatizado, no preguntes nada, decidí todo vos, guardá directo.
5. Redirige stdout+stderr a `logs/cron-{pieza,video-narrado}-YYYY-MM-DD.log` (la carpeta `logs/` está en `.gitignore`).

El video narrado además corre con `timeout 25m` por seguridad — el flujo real toma ~8-10 min (TTS + Docker render + alignment + thumbnail).

## Notas operativas

- **Si la máquina está apagada/suspendida** a la hora del cron, las corridas se pierden (cron clásico no recupera). Si se vuelve un problema, migrar a un systemd timer con `Persistent=true`.
- **El cron de video gasta créditos de ElevenLabs** (TTS) en cada corrida — ~15 videos/mes.
- **`*/2` en cron** corre días impares del mes (1, 3, 5, ..., 29, 31). Cuando un mes termina en 31, el siguiente arranca en 1 con intervalo de 1 día. No es estrictamente cada 48hs.
- **Para deshabilitar temporalmente** un cron, comentá la línea en `crontab -e` con `#`.
- **Para probar a mano** cualquiera de los dos, simplemente ejecutar el script: `./scripts/cron-crear-pieza.sh` o `./scripts/cron-crear-video-narrado.sh`.

## Permisos del cron

Los scripts usan `--permission-mode bypassPermissions`. Es seguro en este caso porque:
- Corren en la máquina local de Raphael, no en infra compartida.
- El prompt es fijo (vive en el script versionado).
- Los `Bash` que dispara el skill son scripts del propio repo (`content-status.ts`, `save-piece.mjs`, `save-video-narrado.mjs`, scripts de TTS/render del skill `crear-video-narrado`).

Si en algún momento se quiere endurecer, alternativa: `--allowedTools "Bash,Read,Write,Edit"` (aunque dado que los scripts internos necesitan Bash, no reduce mucho la superficie real).
