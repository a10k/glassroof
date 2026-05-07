import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './popup.css';
import { createPinElement, createTempPinElement } from './Pin';

const SHAPES_SOURCE_LAYER = 'shapes';

const sidebarIcon = (collapsed) =>
  `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.3"/>
    <line x1="5" y1="1.5" x2="5" y2="12.5" stroke="currentColor" stroke-width="1.3"/>
    ${collapsed
      ? '<polyline points="6.5,5 8.5,7 6.5,9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
      : '<polyline points="8.5,5 6.5,7 8.5,9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'}
  </svg>`;

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
  sidebarCollapsed,
  onToggleSidebar,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const tempMarkerRef = useRef(null);
  const onFeaturesChangeRef = useRef(onFeaturesChange);
  const onFeatureClickRef = useRef(onFeatureClick);
  const isContributeActiveRef = useRef(isContributeActive);
  const onToggleSidebarRef = useRef(onToggleSidebar);
  const sidebarBtnRef = useRef(null);

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
    onToggleSidebarRef.current = onToggleSidebar;
  }, [onToggleSidebar]);

  useEffect(() => {
    if (!map.current) return;
    const apply = () => map.current.setFilter('shapes-selected', ['==', 'id', selectedId ?? '']);
    if (map.current.isStyleLoaded()) apply();
    else map.current.once('load', apply);
  }, [selectedId]);

  useEffect(() => {
    if (!sidebarBtnRef.current) return;
    sidebarBtnRef.current.innerHTML = sidebarIcon(sidebarCollapsed);
    sidebarBtnRef.current.title = sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar';
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-71.0583, 42.3603],
      zoom: 13,
    });

    const sidebarControl = {
      onAdd() {
        const container = document.createElement('div');
        container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        const btn = document.createElement('button');
        btn.title = 'Hide sidebar';
        btn.innerHTML = sidebarIcon(false);
        Object.assign(btn.style, {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#129865',
          cursor: 'pointer',
        });
        btn.addEventListener('click', () => onToggleSidebarRef.current?.());
        container.appendChild(btn);
        sidebarBtnRef.current = btn;
        return container;
      },
      onRemove() {},
    };
    map.current.addControl(sidebarControl, 'top-right');
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
            'line-color': '#129865',
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
        map.current.getCanvas().style.cursor = isContributeActiveRef.current ? '' : 'pointer';
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

  return <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />;
}
