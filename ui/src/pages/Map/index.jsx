import { useState, useRef } from 'react';
import { Layout } from 'antd';
import MapView from './MapView';
import Sidebar from './Sidebar';

export default function Map() {
  const [activeTab, setActiveTab] = useState('1');
  const [listings, setListings] = useState([]);
  const [tempPin, setTempPin] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const flyToRef = useRef(null);

  const handleFlyToFeature = (center, zoom) => flyToRef.current?.(center, zoom);

  const handleAddListing = (htmlContent) => {
    if (htmlContent === null) {
      setTempPin(null);
      return;
    }
    if (!tempPin) {
      alert('Please click on the map to place a pin');
      return;
    }
    setListings([
      ...listings,
      { id: Date.now(), lat: tempPin.lat, lng: tempPin.lng, content: htmlContent },
    ]);
    setTempPin(null);
  };

  return (
    <Layout style={{ height: 'calc(100vh - 42px)', width: '100%' }}>
      <MapView
        listings={listings}
        isContributeActive={activeTab === '2'}
        tempPin={tempPin}
        onMapClick={setTempPin}
        onFeaturesChange={setVisibleFeatures}
        flyToRef={flyToRef}
      />
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        visibleFeatures={visibleFeatures}
        onFlyToFeature={handleFlyToFeature}
        tempPin={tempPin}
        onAddListing={handleAddListing}
      />
    </Layout>
  );
}
