#!/bin/bash
set -euo pipefail

# Run from the data/ directory: ./build-tiles.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/../ui/public/tiles"

if ! command -v tippecanoe &> /dev/null; then
  echo "Error: tippecanoe not found. See data/README.md for install instructions."
  exit 1
fi

echo "Building vector tiles from gold.geojson..."

tippecanoe \
  --output-to-directory="$OUTPUT_DIR" \
  --force \
  --no-tile-compression \
  --layer=shapes \
  --minimum-zoom=10 \
  --maximum-zoom=16 \
  "$SCRIPT_DIR/gold.geojson"

echo "Done. Tiles written to ui/public/tiles/"
