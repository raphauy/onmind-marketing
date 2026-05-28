#!/usr/bin/env bash
# Trae stats agregadas del producto OnMind (DB de producción vía Prisma) para
# alimentar la creación de contenido de marketing.
#
# Es un wrapper sobre `scripts/marketing-team-stats.ts` que vive en el repo de
# producto (~/desarrollo/onmind) — ahí está el schema y el cliente Prisma. Este
# script asegura el cwd y los args correctos.
#
# Uso:
#   .claude/skills/crear-video-narrado/scripts/fetch-product-stats.sh [--team <slug>] [--client <slug>] [--days <N>]
#
# Defaults:
#   --team team-sedes
#   --client martin-sedes-inmobiliaria
#   --days 90
#
# Salida: JSON por stdout. Pipear a `| jq` para explorar.

set -euo pipefail

ONMIND_REPO="${ONMIND_REPO:-$HOME/desarrollo/onmind}"

if [ ! -d "$ONMIND_REPO" ]; then
  echo "ERROR: no encuentro el repo de onmind en $ONMIND_REPO" >&2
  echo "Setear ONMIND_REPO si está en otro path." >&2
  exit 1
fi

if [ ! -f "$ONMIND_REPO/scripts/marketing-team-stats.ts" ]; then
  echo "ERROR: scripts/marketing-team-stats.ts no existe en $ONMIND_REPO" >&2
  echo "El script vive en el repo de producto. Verificar." >&2
  exit 1
fi

cd "$ONMIND_REPO"
exec npx tsx scripts/marketing-team-stats.ts "$@"
