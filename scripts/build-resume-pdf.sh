#!/usr/bin/env bash
#
# Regenerate the downloadable resume PDF from resume.html.
# Run this after editing resume.html:
#
#   ./scripts/build-resume-pdf.sh
#
# Renders resume.html through headless Chrome into assets/resume-swe.pdf.
set -euo pipefail

cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-8802}"

if [ ! -x "$CHROME" ]; then
    echo "Chrome not found at: $CHROME" >&2
    echo "Set CHROME=/path/to/chrome and retry." >&2
    exit 1
fi

python3 -m http.server "$PORT" >/dev/null 2>&1 &
SRV=$!
trap 'kill "$SRV" 2>/dev/null || true' EXIT
sleep 1

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=5000 --run-all-compositor-stages-before-draw \
    --print-to-pdf="assets/resume-swe.pdf" \
    "http://localhost:$PORT/resume.html" 2>/dev/null
echo "  ✓ assets/resume-swe.pdf"

echo "Done."
