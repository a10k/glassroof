# Glassroof

Community-driven rent price transparency. See what people actually pay, by neighborhood.

## What it does
- Submit your rent anonymously — address, price, unit type, lease date
- See rent prices on a map near you
- Understand what the market actually looks like, not what landlords want you to think

## Stack
- [MapLibre GL JS](https://maplibre.org/) — open source maps
- [React](https://react.dev/) + [Ant Design](https://ant.design/) — UI
- [GitHub Pages](https://pages.github.com/) — static hosting

## Data pipeline

Submissions come in via Google Form. Approved entries are manually added to `data/gold.geojson`.

After updating the GeoJSON, regenerate the vector tiles:

```bash
tippecanoe \
  --output-to-directory=ui/public/tiles \
  --force \
  --layer=shapes \
  --minimum-zoom=10 \
  --maximum-zoom=16 \
  data/gold.geojson
```

Commit the output in `ui/public/tiles/` — GitHub Pages serves the tiles as static files alongside the app.

## Status
🚧 MVP in progress

## Running locally
_Coming soon_