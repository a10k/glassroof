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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile());
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const flyToRef = useRef(null);

  const handleFlyToFeature = (center, zoom) => flyToRef.current?.(center, zoom);

  const handleFeatureClick = () => {
    setActiveTab('insights');
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
          <Text strong style={{ fontSize: 24, color: '#129865', letterSpacing: '-0.02em' }}>
            Glassroof
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
        onFlyToFeature={handleFlyToFeature}
        tempPin={tempPin}
        onAddListing={handleAddListing}
      />
    </div>
  );
}
