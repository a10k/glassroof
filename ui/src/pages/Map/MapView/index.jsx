import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './popup.css';
import { createPinElement, createTempPinElement } from './Pin';

const SHAPES_SOURCE_LAYER = 'shapes';

function getTilesUrl() {
  const base = import.meta.env.BASE_URL;
  if (base.startsWith('/')) {
    return `${window.location.origin}${base}tiles/{z}/{x}/{y}.pbf`;
  }
  const resolved = new URL(base, window.location.href).href;
  return `${resolved}tiles/{z}/{x}/{y}.pbf`;
}

export default function MapView({
  listings,
  isContributeActive,
  selectedId,
  tempPin,
  onMapClick,
  onFeaturesChange,
  onFeatureClick,
  flyToRef,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const tempMarkerRef = useRef(null);
  const onFeaturesChangeRef = useRef(onFeaturesChange);
  const onFeatureClickRef = useRef(onFeatureClick);
  const isContributeActiveRef = useRef(isContributeActive);

  useEffect(() => {
    onFeaturesChangeRef.current = onFeaturesChange;
  }, [onFeaturesChange]);
  useEffect(() => {
    onFeatureClickRef.current = onFeatureClick;
  }, [onFeatureClick]);
  useEffect(() => {
    isContributeActiveRef.current = isContributeActive;
  }, [isContributeActive]);

  useEffect(() => {
    if (!map.current) return;
    const apply = () => map.current.setFilter('shapes-selected', ['==', 'id', selectedId ?? '']);
    if (map.current.isStyleLoaded()) apply();
    else map.current.once('load', apply);
  }, [selectedId]);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-71.0583, 42.3603],
      zoom: 13,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        showAccuracyCircle: false,
      }),
      'top-right'
    );
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      map.current.resize();

      map.current.addSource('shapes', {
        type: 'vector',
        tiles: [getTilesUrl()],
        minzoom: 10,
        maxzoom: 16,
      });

      const styleLayers = map.current.getStyle().layers;
      const buildingTopIdx = styleLayers.findIndex((l) => l.id === 'building-top');
      const firstSymbolId = styleLayers
        .slice(buildingTopIdx + 1)
        .find((l) => l.type === 'symbol')?.id;

      map.current.addLayer(
        {
          id: 'shapes-fill',
          type: 'fill',
          source: 'shapes',
          'source-layer': SHAPES_SOURCE_LAYER,
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.35,
          },
        },
        firstSymbolId
      );

      map.current.addLayer(
        {
          id: 'shapes-outline',
          type: 'line',
          source: 'shapes',
          'source-layer': SHAPES_SOURCE_LAYER,
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 2,
          },
        },
        firstSymbolId
      );

      map.current.addLayer(
        {
          id: 'shapes-selected',
          type: 'line',
          source: 'shapes',
          'source-layer': SHAPES_SOURCE_LAYER,
          filter: ['==', 'id', ''],
          paint: {
            'line-color': '#164CFF',
            'line-width': 2.5,
            'line-dasharray': [3, 2],
          },
        },
        firstSymbolId
      );

      // Feature click → navigate to insights (unless in contribute mode)
      map.current.on('click', 'shapes-fill', (e) => {
        if (!isContributeActiveRef.current) {
          const id = e.features?.[0]?.properties?.id ?? '';
          map.current.setFilter('shapes-selected', ['==', 'id', id]);
          onFeatureClickRef.current?.(id);
        }
      });

      // Pointer cursor on hover
      map.current.on('mouseenter', 'shapes-fill', () => {
        if (!isContributeActiveRef.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });
      map.current.on('mouseleave', 'shapes-fill', () => {
        map.current.getCanvas().style.cursor = '';
      });

      if (flyToRef) {
        flyToRef.current = (target) => {
          if (target.bounds) {
            map.current.fitBounds(target.bounds, { padding: 60, maxZoom: 15 });
          } else {
            map.current.flyTo({ center: target.center, zoom: target.zoom });
          }
        };
      }
    });

    map.current.on('idle', () => {
      if (!map.current || !onFeaturesChangeRef.current) return;
      const features = map.current.queryRenderedFeatures({ layers: ['shapes-fill'] });
      const seen = new Set();
      const unique = features.filter((f) => {
        const key = f.properties.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      onFeaturesChangeRef.current(unique.map((f) => ({ ...f.properties, geometry: f.geometry })));
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Track whether a feature was clicked to suppress contribute-mode pin placement
    let featureClicked = false;

    const handleFeatureClick = () => {
      featureClicked = true;
      setTimeout(() => {
        featureClicked = false;
      }, 0);
    };

    const handleMapClick = (e) => {
      if (featureClicked) return;
      const { lng, lat } = e.lngLat;
      onMapClick({ lng, lat });
    };

    if (isContributeActive) {
      map.current.on('click', 'shapes-fill', handleFeatureClick);
      map.current.on('click', handleMapClick);
    }

    return () => {
      map.current?.off('click', 'shapes-fill', handleFeatureClick);
      map.current?.off('click', handleMapClick);
    };
  }, [isContributeActive, onMapClick]);

  useEffect(() => {
    if (!map.current) return;
    tempMarkerRef.current?.remove();
    tempMarkerRef.current = null;
    if (tempPin) {
      tempMarkerRef.current = new maplibregl.Marker({ element: createTempPinElement() })
        .setLngLat([tempPin.lng, tempPin.lat])
        .addTo(map.current);
    }
  }, [tempPin]);

  useEffect(() => {
    if (!map.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    listings.forEach((listing) => {
      const marker = new maplibregl.Marker({ element: createPinElement() })
        .setLngLat([listing.lng, listing.lat])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<div style="font-size:12px"><strong>${listing.content.substring(0, 50)}...</strong></div>`
          )
        )
        .addTo(map.current);
      markersRef.current.push(marker);
    });
  }, [listings]);

  return <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />;
}
