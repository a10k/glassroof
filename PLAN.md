# Glassroof — Vector Tiles & Insights Plan

## Architecture

Submissions are reviewed **offline**. Approved data lives in `data/gold.geojson`.
The offline pipeline converts that file into static vector tiles using Tippecanoe.
The tiles are committed to `ui/public/tiles/` so GitHub Pages serves them as static assets.
MapLibre reads those tiles and renders shapes on the map.
The Insights tab shows the shapes currently in the viewport with a zoom-to control.
The submit button opens a Google Form — no backend needed.

---

## Data Flow

```
Submissions (Google Form)
        ↓
  Manual review
        ↓
  data/gold.geojson   ← single source of truth
        ↓ tippecanoe
  ui/public/tiles/{z}/{x}/{y}.pbf
        ↓ GitHub Pages
  MapLibre vector tile source
        ↓ queryRenderedFeatures on idle
  visibleFeatures state in Map root
        ↓
  Insights tab (sidebar)
```

---

## GeoJSON Schema

Each feature in `data/gold.geojson` must have these properties:

| Property     | Type   | Description                              |
|--------------|--------|------------------------------------------|
| `id`         | string | Unique slug, e.g. `"one-congress"`       |
| `title`      | string | Display name shown in Insights           |
| `text`       | string | Short description shown in Insights      |
| `color`      | string | Hex color for fill + outline             |
| `center_lat` | number | Latitude of the shape's center           |
| `center_lng` | number | Longitude of the shape's center          |

Geometry type: `Polygon` (rectangular footprints).

---

## Tippecanoe Command

Run this after updating `data/gold.geojson`:

```bash
tippecanoe \
  --output-to-directory=ui/public/tiles \
  --force \
  --layer=shapes \
  --minimum-zoom=10 \
  --maximum-zoom=16 \
  data/gold.geojson
```

Commit the output — tiles are static files deployed with the app.

---

## Component Changes

### MapView
- Adds a `vector` source pointing to `tiles/{z}/{x}/{y}.pbf` (URL built from `document.baseURI`)
- Adds `shapes-fill` (fill) and `shapes-outline` (line) layers using `['get', 'color']`
- On `idle` event: calls `queryRenderedFeatures({ layers: ['shapes-fill'] })`, deduplicates by `properties.id`, calls `onFeaturesChange(features)`
- Accepts `flyToRef` prop; populates it with `(center, zoom) => map.flyTo(...)` after map load

### Map (root)
- Removes `locationStatus`, `userLocation`, `handleAllowLocation` (GeolocateControl handles location on the map directly)
- Adds `visibleFeatures` state (array of feature property objects)
- Adds `flyToRef = useRef(null)`
- Passes `onFeaturesChange={setVisibleFeatures}` and `flyToRef` to MapView
- Passes `visibleFeatures` and `onFlyToFeature` to Sidebar

### Sidebar
- Drops `locationStatus`, `userLocation`, `onAllowLocation` props
- Passes `visibleFeatures` and `onFlyToFeature` through to Insights

### Insights
- **Removes** the Your Location block entirely
- Shows a list of `visibleFeatures`: color dot + title + text + aim icon
- Clicking the aim icon calls `onFlyToFeature([center_lng, center_lat], 16)`
- Empty state when no features are in view

---

## Folder Structure (after changes)

```
glassroof/
├── data/
│   └── gold.geojson          ← source of truth
├── ui/
│   ├── public/
│   │   └── tiles/            ← tippecanoe output (committed)
│   │       └── .gitkeep
│   └── src/
│       └── pages/Map/
│           ├── index.jsx     ← root: visibleFeatures state, flyToRef
│           ├── MapView/      ← vector tiles source + idle listener
│           └── Sidebar/
│               └── Insights/ ← visible shapes list (no location block)
```

---

## Progress

- [x] PLAN.md saved
- [x] `data/gold.geojson` — mock Boston rectangles (5 locations)
- [x] `ui/public/tiles/.gitkeep`
- [x] README updated with tippecanoe command
- [x] MapView — vector tile source + `onFeaturesChange` + `flyToRef`
- [x] Map root — location state removed, `visibleFeatures` + `flyToRef` added
- [x] Sidebar — prop swap complete
- [x] Insights — rewritten to show shape list, location block removed
