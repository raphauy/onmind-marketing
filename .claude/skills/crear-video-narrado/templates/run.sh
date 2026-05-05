#!/usr/bin/env bash
# Wrapper para correr comandos hyperframes dentro del contenedor.
#
# Build (una sola vez):   ./run.sh build
# Init proyecto:          ./run.sh init <nombre>
# Render:                 ./run.sh render
# Lint:                   ./run.sh lint
# Shell interactivo:      ./run.sh shell
# Comando arbitrario:     ./run.sh exec <cmd...>

set -euo pipefail

IMAGE="onmind-hyperframes:local"
DIR="$(cd "$(dirname "$0")" && pwd)"
USERFLAG="--user $(id -u):$(id -g)"
# HOME para que npx pueda escribir cache; npm logs van a /tmp
ENVS="-e HOME=/tmp -e npm_config_cache=/tmp/.npm"

cmd="${1:-help}"
shift || true

case "$cmd" in
  build)
    docker build -t "$IMAGE" "$DIR"
    ;;
  init)
    name="${1:-onmind-explainer}"
    docker run --rm $USERFLAG $ENVS -v "$DIR:/work" "$IMAGE" \
      npx -y hyperframes init "$name" --non-interactive --example blank
    ;;
  render)
    docker run --rm $USERFLAG $ENVS -v "$DIR:/work" -w "/work/${PROJECT:-onmind-explainer}" "$IMAGE" \
      npx -y hyperframes render --output output.mp4
    ;;
  lint)
    docker run --rm $USERFLAG $ENVS -v "$DIR:/work" -w "/work/${PROJECT:-onmind-explainer}" "$IMAGE" \
      npx -y hyperframes lint
    ;;
  shell)
    docker run --rm -it $USERFLAG $ENVS -v "$DIR:/work" "$IMAGE" bash
    ;;
  exec)
    docker run --rm $USERFLAG $ENVS -v "$DIR:/work" -w "/work/${PROJECT:-onmind-explainer}" "$IMAGE" "$@"
    ;;
  help|*)
    sed -n '2,11p' "$0"
    ;;
esac
