import { useState, useRef } from 'react';
import { Typography } from 'antd';
import MapView from './MapView';
import Sidebar from './Sidebar';

const { Text } = Typography;

const SIDEBAR_DEFAULT_WIDTH = 380;

function isMobile() {
  return window.innerWidth < 768;
}

export default function Map() {
  const [activeTab, setActiveTab] = useState('welcome');
  const [listings, setListings] = useState([]);
  const [tempPin, setTempPin] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile());
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const flyToRef = useRef(null);

  const handleFlyToFeature = (target) => flyToRef.current?.(target);

  const handleFeatureClick = (id) => {
    setSelectedId(id);
    setActiveTab('market');
    setSidebarCollapsed(false);
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
    setListings([
      ...listings,
      { id: Date.now(), lat: tempPin.lat, lng: tempPin.lng, content: htmlContent },
    ]);
    setTempPin(null);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <MapView
          listings={listings}
          isContributeActive={activeTab === 'contribute'}
          selectedId={selectedId}
          tempPin={tempPin}
          onMapClick={setTempPin}
          onFeaturesChange={setVisibleFeatures}
          onFeatureClick={handleFeatureClick}
          flyToRef={flyToRef}
        />

        {/* Logo overlay */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <Text strong style={{ fontSize: 20, color: '#000', letterSpacing: '0.08em', fontFamily: 'Geist Sans, sans-serif' }}>
            GLASSROOF
          </Text>
        </div>
      </div>

      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(true)}
        onExpand={() => setSidebarCollapsed(false)}
        width={sidebarWidth}
        onWidthChange={setSidebarWidth}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        visibleFeatures={visibleFeatures}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onFlyToFeature={handleFlyToFeature}
        tempPin={tempPin}
        onAddListing={handleAddListing}
      />
    </div>
  );
}
