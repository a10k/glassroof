import { useState } from 'react';
import { Layout } from 'antd';
import MapView from './MapView';
import Sidebar from './Sidebar';

export default function Map() {
  const [activeTab, setActiveTab] = useState('1');
  const [locationStatus, setLocationStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);
  const [listings, setListings] = useState([]);
  const [tempPin, setTempPin] = useState(null);

  const handleAllowLocation = () => {
    setLocationStatus('loading');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationStatus('granted');
        },
        () => setLocationStatus('denied')
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
        userLocation={userLocation}
        tempPin={tempPin}
        onMapClick={setTempPin}
      />
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        locationStatus={locationStatus}
        userLocation={userLocation}
        onAllowLocation={handleAllowLocation}
        tempPin={tempPin}
        onAddListing={handleAddListing}
      />
    </Layout>
  );
}
