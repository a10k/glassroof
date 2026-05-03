import { useEffect, useRef } from 'react';
import { Layout } from 'antd';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './popup.css';
import { createPinElement, createTempPinElement } from './Pin';

const { Content } = Layout;

export default function MapView({
  listings,
  isContributeActive,
  userLocation,
  tempPin,
  onMapClick,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const tempMarkerRef = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [-74.5, 40],
      zoom: 12,
    });

    map.current.on('load', () => map.current.resize());

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !userLocation) return;
    map.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 14 });
  }, [userLocation]);

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
