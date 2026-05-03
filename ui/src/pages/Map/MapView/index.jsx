import { useEffect, useRef } from 'react';
import { Layout } from 'antd';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './popup.css';
import { createPinElement, createTempPinElement } from './Pin';

const { Content } = Layout;

const SHAPES_SOURCE_LAYER = 'shapes';

function getTilesUrl() {
  const base = import.meta.env.BASE_URL;
  if (base.startsWith('/')) {
    // Dev: Vite always resolves BASE_URL to an absolute path (e.g. '/')
    return `${window.location.origin}${base}tiles/{z}/{x}/{y}.pbf`;
  }
  // Production build: BASE_URL is relative ('./'), resolve against the page URL
  const resolved = new URL(base, window.location.href).href;
  return `${resolved}tiles/{z}/{x}/{y}.pbf`;
}

export default function MapView({
  listings,
  isContributeActive,
  tempPin,
  onMapClick,
  onFeaturesChange,
  flyToRef,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const tempMarkerRef = useRef(null);
  const onFeaturesChangeRef = useRef(onFeaturesChange);

  useEffect(() => {
    onFeaturesChangeRef.current = onFeaturesChange;
  }, [onFeaturesChange]);

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

      map.current.addLayer({
        id: 'shapes-fill',
        type: 'fill',
        source: 'shapes',
        'source-layer': SHAPES_SOURCE_LAYER,
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.35,
        },
      });

      map.current.addLayer({
        id: 'shapes-outline',
        type: 'line',
        source: 'shapes',
        'source-layer': SHAPES_SOURCE_LAYER,
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
        },
      });

      if (flyToRef) {
        flyToRef.current = (center, zoom) => map.current.flyTo({ center, zoom });
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
      onFeaturesChangeRef.current(unique.map((f) => f.properties));
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

    const handleMapClick = (e) => {
      const { lng, lat } = e.lngLat;
      onMapClick({ lng, lat });
    };

    if (isContributeActive) {
      map.current.on('click', handleMapClick);
    }

    return () => {
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

  return (
    <Content style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
    </Content>
  );
}
