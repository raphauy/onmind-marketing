#!/usr/bin/env bash
# Mezcla voz + música con FFmpeg dentro del contenedor Docker.
#
# Uso:
#   mix-audio.sh <voz.mp3> <musica.mp3> <output.mp3> [voice_delay_ms] [music_volume] [music_total_dur]
#
# Defaults:
#   voice_delay_ms   = 2000   (voz arranca 2s después de la música)
#   music_volume     = 0.30   (~ -10.5dB bajo la voz)
#   music_total_dur  = duración del archivo de música (no fade-out salvo override)
#
# El fade-out de la música se aplica 2s antes del fin del archivo total.
# Genera mezcla mono MP3 192kbps.

set -euo pipefail

VOZ="${1:?Falta argumento voz.mp3}"
MUSICA="${2:?Falta argumento musica.mp3}"
OUTPUT="${3:?Falta argumento output.mp3}"
DELAY_MS="${4:-2000}"
MUSIC_VOL="${5:-0.30}"
TOTAL_DUR="${6:-}"

DIR="$(cd "$(dirname "$VOZ")" && pwd)"
VOZ_BASE="$(basename "$VOZ")"
MUSICA_BASE="$(basename "$MUSICA")"
OUT_BASE="$(basename "$OUTPUT")"

IMAGE="onmind-hyperframes:local"

if [ -z "$TOTAL_DUR" ]; then
  TOTAL_DUR=$(docker run --rm -v "$DIR:/work" "$IMAGE" \
    ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "/work/$MUSICA_BASE")
fi

FADE_START=$(awk "BEGIN { printf \"%.2f\", $TOTAL_DUR - 2.0 }")

FILTER="[0:a]adelay=${DELAY_MS}|${DELAY_MS}[v];[1:a]volume=${MUSIC_VOL},afade=t=out:st=${FADE_START}:d=2.0[m];[v][m]amix=inputs=2:duration=longest:normalize=0"

docker run --rm --user "$(id -u):$(id -g)" -v "$DIR:/work" -w /work "$IMAGE" \
  ffmpeg -y -i "$VOZ_BASE" -i "$MUSICA_BASE" \
  -filter_complex "$FILTER" \
  -c:a libmp3lame -b:a 192k "$OUT_BASE"

echo "OK: $OUTPUT"
