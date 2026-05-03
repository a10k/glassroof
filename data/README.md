# data/

> **macOS only.** The tooling below is tested on macOS with Homebrew. Linux may work but is not supported.

This folder contains the source GeoJSON and the script to regenerate vector tiles for the app.

## Files

| File | Description |
|------|-------------|
| `gold.geojson` | Reviewed, approved rent data — the single source of truth |
| `build-tiles.sh` | Generates vector tiles from `gold.geojson` into `ui/public/tiles/` |

---

## Install required tools

### 1. Homebrew

If you don't have Homebrew installed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify:

```bash
brew --version
```

### 2. Tippecanoe

```bash
brew install tippecanoe
```

Verify:

```bash
tippecanoe --version
```

---

## Regenerate tiles

After editing `gold.geojson`, run the build script from the `data/` directory:

```bash
cd data
./build-tiles.sh
```

Tiles are written to `ui/public/tiles/`. Commit the output so GitHub Pages picks them up on the next deploy.

---

## GeoJSON schema

Each feature must have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique slug, e.g. `"one-congress"` |
| `title` | string | Display name shown in the Insights tab |
| `text` | string | Short description shown in the Insights tab |
| `color` | string | Hex color for the fill and outline on the map |
| `center_lat` | number | Latitude of the shape's center (used for zoom-to) |
| `center_lng` | number | Longitude of the shape's center (used for zoom-to) |

Geometry type: `Polygon`.
