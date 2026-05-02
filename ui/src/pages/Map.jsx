import React, { useState, useEffect, useRef } from 'react';
import { Layout, Tabs, Button, Input, Spin } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import RichTextEditor from '../components/RichTextEditor';
import './Map.css';

const { Content } = Layout;

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [activeTab, setActiveTab] = useState('1');
  const [locationStatus, setLocationStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);
  const [listings, setListings] = useState([]);
  const [tempPin, setTempPin] = useState(null); // Pin being placed
  const markersRef = useRef([]);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-74.5, 40],
      zoom: 12,
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle map clicks to place pins
  useEffect(() => {
    if (!map.current) return;

    const handleMapClick = (e) => {
      const { lng, lat } = e.lngLat;
      setTempPin({ lng, lat });
      console.log('Pin placed at:', lng, lat);
    };

    if (activeTab === '2') {
      map.current.on('click', handleMapClick);
    }

    return () => {
      map.current?.off('click', handleMapClick);
    };
  }, [activeTab]);

  // Re-add markers when listings change
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers for each listing
    listings.forEach((listing) => {
      const el = document.createElement('div');
      el.innerHTML = `<svg width="40" height="50" viewBox="0 0 40 50"><defs><filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" /></filter></defs><path d="M 20 50 L 10 35 L 30 35 Z" fill="#999999" filter="url(#shadow)" /><circle cx="20" cy="20" r="14" fill="#ff4d4f" stroke="#fff" strokeWidth="2" filter="url(#shadow)" /></svg>`;
      el.style.cursor = 'pointer';

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([listing.lng, listing.lat])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<div style="font-size: 12px;"><strong>${listing.content.substring(0, 50)}...</strong></div>`
          )
        )
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [listings]);

  const handleAllowLocation = () => {
    setLocationStatus('loading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationStatus('granted');
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
          });
        },
        (error) => {
          console.error(error);
          setLocationStatus('denied');
        }
      );
    } else {
      setLocationStatus('denied');
    }
  };

  const handleAddListing = (htmlContent) => {
    if (htmlContent === null) {
      setTempPin(null);
      return;
    }

    if (!tempPin) {
      alert('Please click on the map to place a pin');
      return;
    }

    const newListing = {
      id: Date.now(),
      lat: tempPin.lat,
      lng: tempPin.lng,
      content: htmlContent,
    };

    setListings([...listings, newListing]);
    setTempPin(null);
  };

  return (
    <Layout style={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <Content style={{ display: 'flex', height: '100%', padding: 0 }}>
        {/* Map Panel */}
        <div className="map-panel">
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="map-tabs"
            items={[
              {
                key: '1',
                label: 'Location',
                children: <LocationTab {...{ locationStatus, handleAllowLocation, userLocation }} />,
              },
              {
                key: '2',
                label: 'Add a Listing',
                children: (
                  <AddListingTab
                    tempPin={tempPin}
                    onAddListing={handleAddListing}
                  />
                ),
              },
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
}

function LocationTab({ locationStatus, handleAllowLocation, userLocation }) {
  return (
    <div className="tab-content-inner">
      <div className="location-section">
        <h3>Your Location</h3>
        <p>
          We use your location to show relevant rent data in your area. Your exact address is
          never stored—only approximate coordinates to help you explore nearby listings.
        </p>

        {locationStatus === 'idle' && (
          <Button
            type="primary"
            size="large"
            icon={<EnvironmentOutlined />}
            onClick={handleAllowLocation}
            block
          >
            Allow My Location
          </Button>
        )}

        {locationStatus === 'loading' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spin />
          </div>
        )}

        {locationStatus === 'granted' && (
          <div className="location-granted">
            <p style={{ color: '#52c41a', fontWeight: 600 }}>✓ Location enabled</p>
            {userLocation && (
              <p style={{ fontSize: '12px', color: '#999' }}>
                Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
              </p>
            )}
          </div>
        )}

        {locationStatus === 'denied' && (
          <div className="location-denied">
            <p style={{ color: '#ff4d4f', fontWeight: 600 }}>
              ✗ Location access denied
            </p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              You can still search for addresses manually or check your browser settings to enable
              location access.
            </p>
          </div>
        )}

        {locationStatus === 'denied' && (
          <Input.Search
            placeholder="Search address..."
            style={{ marginTop: '16px' }}
            onSearch={(value) => console.log('Search:', value)}
          />
        )}
      </div>
    </div>
  );
}

function AddListingTab({ tempPin, onAddListing }) {
  return (
    <div className="tab-content-inner">
      <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {!tempPin ? (
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
            👉 <strong>Click on the map</strong> to place a pin
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', color: '#52c41a', fontWeight: 600, margin: 0 }}>
                ✓ Pin placed at {tempPin.lat.toFixed(4)}, {tempPin.lng.toFixed(4)}
              </p>
            </div>
            <Button
              size="small"
              danger
              onClick={() => {
                onAddListing(null);
              }}
              style={{ whiteSpace: 'nowrap' }}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
      <RichTextEditor onSubmit={onAddListing} disabled={!tempPin} />
    </div>
  );
}
