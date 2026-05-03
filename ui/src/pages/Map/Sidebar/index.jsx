import { Layout, Tabs } from 'antd';
import Insights from './Insights';
import Contribute from './Contribute';
import './sidebar.css';

const { Sider } = Layout;

export default function Sidebar({
  activeTab,
  onTabChange,
  locationStatus,
  userLocation,
  onAllowLocation,
  tempPin,
  onAddListing,
}) {
  return (
    <Sider
      width={380}
      theme="light"
      style={{
        borderLeft: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        className="map-tabs"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        tabBarStyle={{ margin: 0, paddingInline: 16 }}
        items={[
          {
            key: '1',
            label: 'Insights',
            children: (
              <Insights
                locationStatus={locationStatus}
                userLocation={userLocation}
                onAllowLocation={onAllowLocation}
              />
            ),
          },
          {
            key: '2',
            label: 'Contribute',
            children: <Contribute tempPin={tempPin} onAddListing={onAddListing} />,
          },
        ]}
      />
    </Sider>
  );
}
