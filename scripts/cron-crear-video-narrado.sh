#!/usr/bin/env bash
#
# Cron cada 2 días: invoca Claude Code en modo headless para crear un
# video narrado nuevo punta a punta (guion + TTS + mezcla + composición
# + render + thumbnail + registro en DB) y dejarlo en GENERATED.
#
# Programado para correr a las 08:15 los días impares del mes. Logs
# van a logs/cron-video-narrado-YYYY-MM-DD.log dentro del repo.
#
# Para agendar:
#   crontab -e
#   15 8 */2 * * /home/raphael/desarrollo/onmind-marketing/scripts/cron-crear-video-narrado.sh
#
# Nota cron cada 2 días: */2 corre días 1,3,5,...,29,31. Cuando termina
# un mes con 31 días arranca el siguiente en día 1 (intervalo 1 día);
# si termina con 30 arranca en día 1 (intervalo 2 días, alineado). No es
# estrictamente cada 48hs pero es la opción más simple y predecible.
#
set -euo pipefail

# --- Entorno (cron arranca con env mínima) ---
export HOME="${HOME:-/home/raphael}"
# Resolver el bin de node desde nvm (versión más reciente instalada) y de pnpm.
# Sin esto, hooks de Claude Code que usan "node" directo fallan en cron.
NODE_BIN_DIR="$(ls -d "$HOME"/.nvm/versions/node/*/bin 2>/dev/null | sort -V | tail -1)"
export PATH="${NODE_BIN_DIR:+$NODE_BIN_DIR:}$HOME/.local/bin:$HOME/.local/share/pnpm:/usr/local/bin:/usr/bin:/bin"

PROJECT_DIR="/home/raphael/desarrollo/onmind-marketing"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/cron-video-narrado-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR"

# --- Prompt para Claude ---
# Activa /crear-video-narrado pero le pide que NO pregunte nada y
# corra los 15 pasos solo. Le da reglas extra para reducir varianza
# de calidad y abortar si algo se rompe.
read -r -d '' PROMPT <<'EOF' || true
/crear-video-narrado

MODO AUTOMATIZADO (cron, 08:15, cada 2 días). Estás corriendo solo, sin nadie del otro lado. NO hagas ninguna pregunta, NO esperes confirmaciones en NINGUNO de los 15 pasos del skill. Tomá vos todas las decisiones y avanzá hasta registrar la pieza en la DB.

Reglas críticas para esta corrida:

1. SEGUÍ EL FLUJO COMPLETO del SKILL.md (pasos 1 al 15). No te saltees pasos técnicos (TTS, alignment, render, thumbnail, save-video-narrado).

2. ELECCIONES POR DEFECTO sin preguntar:
   - Pilar: el sugerido por content-status.ts (más atrasado vs target).
   - Tema: uno concreto que NO esté ya publicado/programado y que NO repita los temas de los últimos 3 videos narrados (mirá los meta.md). Priorizá temas que ganan con voz + datos: comparativas, "cómo funciona X en pasos", datos reales del agente spotlight.
   - Datos: corré fetch-product-stats.sh con defaults (team-sedes, martin-sedes, 90d). Usá esos datos. Si necesitás un dato que no devuelve, NO inventes — pasá a otro ángulo del mismo tema.
   - Voz: voice ID default (s4W8kh4jMEsHFHA7NqXQ). No regeneres voces.
   - Música: elegí del library (01-tech-modern / 02-cinematic / 03-lofi-warm) según mood del guion. NUNCA regeneres música. Evitá repetir el track de los últimos 2 videos (mirá los meta.md).

3. COMPOSICIÓN HTML — es la parte más frágil. Para reducir varianza:
   - Antes de escribir el index.html, leé el index.html de los 2 ejemplos previos más recientes en content/videos-narrados/examples/.
   - Tomá UNO de ellos como base estructural (escenas, layout, animaciones) y adaptá texto + timestamps al guion nuevo. NO inventes patrones nuevos.
   - Respetá obligatoriamente el offset +2.0s entre timestamps.json y los tiempos visuales. Es el bug más fácil de cometer.
   - Sin emojis.

4. SI ALGO FALLA (TTS, render, ffmpeg, save-video-narrado) reportá el error con el comando que falló y ABORTÁ. No improvises ni intentes workarounds raros. Es preferible dejar el folder a medio crear que romper algo en la DB.

5. AL FINAL imprimí un resumen breve: pilar, tema, slug, duración, track de música, URL del dashboard.

Arrancá ya con el Paso 1.
EOF

# --- Invocación con timeout de seguridad ---
{
  echo "============================================================"
  echo "Corrida: $(date -Iseconds)"
  echo "PROJECT_DIR: $PROJECT_DIR"
  echo "============================================================"

  # 25 min de margen sobre los ~10 min reales esperados.
  timeout 25m claude -p "$PROMPT" --permission-mode bypassPermissions

  echo
  echo "------------------------------------------------------------"
  echo "Fin OK: $(date -Iseconds)"
} >> "$LOG_FILE" 2>&1

exit 0
