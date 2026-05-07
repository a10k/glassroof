#!/usr/bin/env python3
"""
Fetch Boston-area neighborhood polygons from OSM and generate gold.geojson
with mock rent data and a cheap-to-expensive green color scale.

Usage: python3 fetch_neighborhoods.py
Output: ../gold.geojson
"""

import json
import math
import time
import sys
import requests
from shapely.geometry import Polygon
from shapely.ops import unary_union

CENTER_LAT = 42.3603
CENTER_LNG = -71.0583
RADIUS_METERS = 8000  # ~5 miles

SKIP_NAMES = {"Harbor Islands"}

# Mock rent data: avg 1BR monthly rent + 2-line description
MOCK_DATA = {
    "Seaport": {
        "avg_rent": 4800,
        "description": "Boston's newest luxury district, built on the innovation economy.\nModern towers and waterfront dining with the highest rents in the city."
    },
    "Back Bay": {
        "avg_rent": 4200,
        "description": "Boston's most iconic address — Victorian brownstones on Commonwealth Ave.\nNewbury St boutiques and the Esplanade make it endlessly desirable."
    },
    "Beacon Hill": {
        "avg_rent": 3900,
        "description": "Gas-lit streets, Federal rowhouses, and the State House dome.\nOne of the most prestigious and historically preserved corners of Boston."
    },
    "Leather District": {
        "avg_rent": 3800,
        "description": "Converted warehouse lofts near South Station, popular with tech and design workers.\nSmall but highly sought-after with authentic urban industrial character."
    },
    "South End": {
        "avg_rent": 3700,
        "description": "Victorian rowhouses, a thriving restaurant scene, and a vibrant arts community.\nBoston's most LGBTQ-friendly neighborhood with a dynamic cultural mix."
    },
    "Downtown": {
        "avg_rent": 3600,
        "description": "Boston's commercial core, walkable to everything.\nLuxury high-rises and converted offices; quieter than expected on weekends."
    },
    "Government Center/Faneuil Hall": {
        "avg_rent": 3400,
        "description": "Busy civic hub anchored by Faneuil Hall Marketplace and City Hall.\nLimited residential stock keeps vacancy near zero year-round."
    },
    "Bay Village": {
        "avg_rent": 3100,
        "description": "Boston's smallest neighborhood — a quiet enclave off the Theatre District.\nFederal-style rowhouses on narrow, tree-lined streets."
    },
    "North End": {
        "avg_rent": 3100,
        "description": "Boston's oldest neighborhood, shaped by its Italian-American heritage.\nCobblestone streets, world-class restaurants, and stunning harbor views."
    },
    "Charlestown": {
        "avg_rent": 3200,
        "description": "Historic waterfront neighborhood anchored by the Bunker Hill Monument.\nMix of townhouses and Navy Yard condos with sweeping harbor views."
    },
    "South Boston": {
        "avg_rent": 3200,
        "description": "From working-class 'Southie' roots to sought-after luxury condos.\nBeaches, craft breweries, and rents that have doubled in a decade."
    },
    "East Cambridge": {
        "avg_rent": 3200,
        "description": "Tech and biotech workers fill this Kendall Square–adjacent neighborhood.\nProximity to MIT and top-tier research labs drives relentless demand."
    },
    "West End": {
        "avg_rent": 2800,
        "description": "Once a dense immigrant neighborhood, now high-rises near MGH.\nConvenient to downtown and Beacon Hill; limited street-level charm."
    },
    "Fenway": {
        "avg_rent": 2800,
        "description": "Student-heavy neighborhood anchored by Fenway Park and several universities.\nActive nightlife and improving infrastructure attract a young professional crowd."
    },
    "Longwood": {
        "avg_rent": 2700,
        "description": "Boston's Medical District, surrounded by world-class hospitals.\nStable, in-demand rental market driven by healthcare workers and residents."
    },
    "Chinatown": {
        "avg_rent": 2600,
        "description": "Dense urban neighborhood — the only surviving Chinatown in New England.\nAuthentic cuisine, strong community ties, and proximity to Tufts Medical."
    },
    "Riverside": {
        "avg_rent": 2800,
        "description": "Quiet Cambridge neighborhood along the Charles River.\nPopular with MIT-affiliated residents and families seeking green space."
    },
    "Mid-Cambridge": {
        "avg_rent": 3000,
        "description": "Central Cambridge residential neighborhood between Harvard and Inman Square.\nQuiet tree-lined streets popular with academics and long-term residents."
    },
    "Jamaica Plain": {
        "avg_rent": 2400,
        "description": "Diverse, artsy, and beloved by families and creatives alike.\nJamaica Pond, independent restaurants, and good Orange Line access."
    },
    "Cambridgeport": {
        "avg_rent": 2600,
        "description": "Dense residential neighborhood between MIT and Central Square.\nAffordable for Cambridge, with a diverse mix of students, families, and professionals."
    },
    "East Boston": {
        "avg_rent": 2200,
        "description": "Rapidly gentrifying waterfront neighborhood with a vibrant Latino community.\nStunning harbor views, direct Blue Line to downtown, and rising rents."
    },
    "Brighton": {
        "avg_rent": 2200,
        "description": "Residential neighborhood with a large college and young professional population.\nMore affordable than neighboring Brookline with easy T and bus access."
    },
    "Wellington-Harrington": {
        "avg_rent": 2400,
        "description": "Working-class Cambridge neighborhood with a growing creative community.\nMore affordable than most of Cambridge with improving amenities."
    },
    "The Port": {
        "avg_rent": 2300,
        "description": "One of Cambridge's most diverse and affordable neighborhoods near Central Square.\nStrong community identity and a grassroots arts scene."
    },
    "Baldwin": {
        "avg_rent": 2500,
        "description": "Small Cambridge neighborhood with a mix of housing types.\nRelatively affordable with good access to transit and local amenities."
    },
    "Mission Hill": {
        "avg_rent": 2100,
        "description": "Student and working-class neighborhood close to Northeastern and Harvard Medical.\nAffordable by Boston standards with a tight-knit community feel."
    },
    "Allston": {
        "avg_rent": 2100,
        "description": "The city's music and dive-bar capital, beloved by students and young creatives.\nAffordable rents and infamous August move-out chaos define the neighborhood."
    },
    "Dorchester": {
        "avg_rent": 1900,
        "description": "Boston's largest and most diverse neighborhood with deep community roots.\nAffordable rents, improving transit, and ongoing investment make it a rising area."
    },
    "Roxbury": {
        "avg_rent": 1800,
        "description": "Boston's historic African-American heart, rich in culture and community organizations.\nMost affordable inner-city neighborhood with significant development underway."
    },
}

DEFAULT_DATA = {
    "avg_rent": 2500,
    "description": "Boston-area neighborhood with a mix of residential and commercial uses.\nConvenient to downtown with strong transit connections."
}


def haversine_meters(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def rent_to_color(rent, min_rent=1800, max_rent=4800):
    """Interpolate from ColorBrewer light green (#f7fcf5) to dark green (#00441b)."""
    t = max(0.0, min(1.0, (rent - min_rent) / (max_rent - min_rent)))
    light = (247, 252, 245)
    dark = (0, 68, 27)
    r = int(light[0] + t * (dark[0] - light[0]))
    g = int(light[1] + t * (dark[1] - light[1]))
    b = int(light[2] + t * (dark[2] - light[2]))
    return f"#{r:02x}{g:02x}{b:02x}"


def assemble_ring(ways):
    """Order and chain OSM outer ways into a closed GeoJSON coordinate ring."""
    segments = [[(pt["lon"], pt["lat"]) for pt in w["geometry"]] for w in ways if w.get("geometry")]
    if not segments:
        return []

    ring = list(segments[0])
    remaining = segments[1:]

    while remaining:
        last = ring[-1]
        matched = False
        for i, seg in enumerate(remaining):
            if abs(seg[0][0] - last[0]) < 1e-7 and abs(seg[0][1] - last[1]) < 1e-7:
                ring.extend(seg[1:])
                remaining.pop(i)
                matched = True
                break
            if abs(seg[-1][0] - last[0]) < 1e-7 and abs(seg[-1][1] - last[1]) < 1e-7:
                ring.extend(reversed(seg[:-1]))
                remaining.pop(i)
                matched = True
                break
        if not matched:
            # Nearest-endpoint fallback for gaps caused by floating point or missing nodes
            best_i, best_rev, best_d = 0, False, float("inf")
            for i, seg in enumerate(remaining):
                d1 = (seg[0][0] - last[0]) ** 2 + (seg[0][1] - last[1]) ** 2
                d2 = (seg[-1][0] - last[0]) ** 2 + (seg[-1][1] - last[1]) ** 2
                if d1 < best_d:
                    best_d, best_i, best_rev = d1, i, False
                if d2 < best_d:
                    best_d, best_i, best_rev = d2, i, True
            seg = remaining.pop(best_i)
            ring.extend(reversed(seg[:-1]) if best_rev else seg[1:])

    if ring[0] != ring[-1]:
        ring.append(ring[0])
    return ring


def fetch_all_geometries():
    """Single Overpass query for all neighborhood relations + geometry."""
    query = f"""[out:json][timeout:90];
(
  relation[boundary=place][place=suburb](around:{RADIUS_METERS},{CENTER_LAT},{CENTER_LNG});
  relation[boundary=place][place=neighbourhood](around:{RADIUS_METERS},{CENTER_LAT},{CENTER_LNG});
  relation[boundary=place][place=quarter](around:{RADIUS_METERS},{CENTER_LAT},{CENTER_LNG});
);
out geom;"""
    print("Querying Overpass API (this may take 20–30s)...")
    resp = requests.post(
        "https://overpass.kumi.systems/api/interpreter",
        data={"data": query},
        headers={"Accept": "application/json"},
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()["elements"]


def build_feature(rel):
    name = rel.get("tags", {}).get("name", f"osm_{rel['id']}")

    if name in SKIP_NAMES:
        return None

    members = rel.get("members", [])
    outer_ways = [m for m in members if m.get("role") == "outer" and m.get("type") == "way"]
    label_node = next((m for m in members if m.get("role") == "label" and m.get("type") == "node"), None)

    if not outer_ways:
        print(f"  skip {name}: no outer ways")
        return None

    ring = assemble_ring(outer_ways)
    if len(ring) < 4:
        print(f"  skip {name}: degenerate ring ({len(ring)} pts)")
        return None

    try:
        poly = Polygon(ring)
        if not poly.is_valid:
            poly = poly.buffer(0)
        centroid = poly.centroid
        center_lng, center_lat = centroid.x, centroid.y
    except Exception:
        if label_node:
            center_lat = label_node.get("lat", CENTER_LAT)
            center_lng = label_node.get("lon", CENTER_LNG)
        else:
            center_lat, center_lng = CENTER_LAT, CENTER_LNG

    dist = haversine_meters(CENTER_LAT, CENTER_LNG, center_lat, center_lng)
    if dist > RADIUS_METERS:
        print(f"  skip {name}: centroid {dist/1000:.1f}km from center")
        return None

    mock = MOCK_DATA.get(name, DEFAULT_DATA)
    avg_rent = mock["avg_rent"]
    color = rent_to_color(avg_rent)

    print(f"  OK  {name:35s}  ${avg_rent}/mo  {color}")

    return {
        "type": "Feature",
        "properties": {
            "id": name.lower().replace(" ", "-").replace("/", "-"),
            "name": name,
            "title": name,
            "text": mock["description"],
            "avg_rent_1br": avg_rent,
            "color": color,
            "center_lat": round(center_lat, 6),
            "center_lng": round(center_lng, 6),
            "osm_id": rel["id"],
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [ring],
        },
    }


def main():
    relations = fetch_all_geometries()
    print(f"Got {len(relations)} relations. Building features...\n")

    features = []
    for rel in relations:
        feat = build_feature(rel)
        if feat:
            features.append(feat)

    # Sort by avg rent ascending so cheaper ones render under expensive ones
    features.sort(key=lambda f: f["properties"]["avg_rent_1br"])

    geojson = {"type": "FeatureCollection", "features": features}

    out_path = "/Users/studio257/Documents/GitHub/glassroof/data/gold.geojson"
    with open(out_path, "w") as f:
        json.dump(geojson, f, indent=2)

    print(f"\nWrote {len(features)} neighborhoods → {out_path}")


if __name__ == "__main__":
    main()
