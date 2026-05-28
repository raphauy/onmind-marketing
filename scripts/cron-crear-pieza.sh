#!/usr/bin/env bash
#
# Cron diario: invoca Claude Code en modo headless para crear una pieza
# de contenido nueva y guardarla en la base sin intervención humana.
#
# Programado para correr a las 08:00 todos los días desde el crontab del
# usuario. Logs van a logs/cron-pieza-YYYY-MM-DD.log dentro del repo.
#
# Para agendar:
#   crontab -e
#   0 8 * * * /home/raphael/desarrollo/onmind-marketing/scripts/cron-crear-pieza.sh
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
LOG_FILE="$LOG_DIR/cron-pieza-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR"

# --- Prompt para Claude ---
# Activa /crear-pieza pero le pide que NO pregunte nada y guarde solo.
read -r -d '' PROMPT <<'EOF' || true
/crear-pieza

MODO AUTOMATIZADO (cron, 08:00). Estás corriendo solo, sin nadie del otro lado. NO hagas ninguna pregunta, NO pidas confirmación en ningún paso. Tomá vos todas las decisiones siguiendo el flujo del skill:

1. Corré el script de estado de contenido y leé la sugerencia de pilar.
2. Elegí el pilar sugerido (el más atrasado vs target).
3. Elegí un tema concreto que NO esté ya publicado ni programado (los ves en el output del script). Variá ángulos entre corridas — no repitas el tema de ayer.
4. Elegí uno de los templates recomendados. Variá el template día a día para que el feed no sea monótono (alterná entre statement, headline, conversación, etc.).
5. Generá los valores de cada campo respetando la guía de marca (cero "CRM", tono cercano, vocabulario correcto, español rioplatense, sin guion largo).
6. Escribí caption con hook en los primeros 125 chars y exactamente 5 hashtags (incluyendo los base #inmobiliaria #gestiondeclientes #onmind). CTA permitido (guardá / comentá / DM); no prometas entregables.
7. Guardá DIRECTAMENTE con el script save-piece.mjs. NO muestres resumen previo esperando OK — guardá y listo.
8. Al final, imprimí una línea con el slug y la URL de la pieza creada.

Reportá brevemente al final: pilar elegido, template, tema, slug, URL.
EOF

# --- Invocación ---
{
  echo "============================================================"
  echo "Corrida: $(date -Iseconds)"
  echo "PROJECT_DIR: $PROJECT_DIR"
  echo "============================================================"

  claude -p "$PROMPT" --permission-mode bypassPermissions

  echo
  echo "------------------------------------------------------------"
  echo "Fin OK: $(date -Iseconds)"
} >> "$LOG_FILE" 2>&1

exit 0
