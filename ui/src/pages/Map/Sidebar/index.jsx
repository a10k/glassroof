import { useRef } from 'react';
import { Tabs, Button, Typography, Flex, List, Divider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Insights from './Insights';
import Contribute from './Contribute';
import './sidebar.css';

const { Text, Title, Paragraph } = Typography;

const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 620;

// ─── Welcome tab ─────────────────────────────────────────────────────────────
function WelcomeTab({ onNavigate }) {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={24}
      style={{ padding: '48px 24px', height: '100%', textAlign: 'center' }}
    >
      <Title style={{ margin: 0, fontSize: 22 }}>What does your neighbor actually pay?</Title>
      <Text type="secondary" style={{ fontSize: 15, lineHeight: 1.7 }}>
        Glassroof is an anonymous rent transparency platform. Share your lease details and discover
        real rental prices in your area — no personal information required.
      </Text>
      <Flex gap={12}>
        <Button type="primary" size="large" onClick={() => onNavigate('insights')}>
          Explore Insights
        </Button>
        <Button size="large" onClick={() => onNavigate('contribute')}>
          Share Your Rent
        </Button>
      </Flex>
    </Flex>
  );
}

// ─── Info tab ─────────────────────────────────────────────────────────────────
const PRIVACY_ITEMS = [
  {
    label: 'No personal information collected',
    desc: 'We never ask for your name, email, phone number, or any identifying information.',
  },
  {
    label: 'Anonymous by default',
    desc: 'All rent data is submitted and stored anonymously. Your exact address is never recorded.',
  },
  {
    label: 'What we collect',
    desc: 'Only the rent amount, unit type (studio/1BR/2BR/3BR+), lease start month/year, and optional notes.',
  },
  {
    label: 'Location data',
    desc: 'We store the coordinates you provide when dropping a pin. That location is used to display your submission on the map.',
  },
  {
    label: 'No accounts required',
    desc: 'Drop a pin, add rent, done. No sign-ups, no verification, no tracking.',
  },
  {
    label: 'Data security',
    desc: 'All data is encrypted in transit and at rest. We follow industry best practices for data protection.',
  },
];

function InfoTab() {
  return (
    <div style={{ padding: '16px 20px', overflowY: 'auto', height: '100%' }}>
      <Title level={4} style={{ marginTop: 0 }}>
        Privacy Policy
      </Title>
      <Paragraph type="secondary" style={{ fontSize: 13 }}>
        Glassroof is built on the principle of privacy-first rent transparency.
      </Paragraph>
      <List
        dataSource={PRIVACY_ITEMS}
        renderItem={({ label, desc }) => (
          <List.Item style={{ alignItems: 'flex-start', padding: '8px 0' }}>
            <List.Item.Meta
              title={
                <Text strong style={{ fontSize: 13 }}>
                  {label}
                </Text>
              }
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {desc}
                </Text>
              }
            />
          </List.Item>
        )}
      />
      <Divider />
      <Title level={4}>Contact</Title>
      <Paragraph type="secondary" style={{ fontSize: 13 }}>
        Questions, feedback, or concerns?{' '}
        <a
          href="https://github.com/a10k/glassroof/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open an issue on GitHub
        </a>
      </Paragraph>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({
  collapsed,
  onCollapse,
  onExpand,
  width,
  onWidthChange,
  activeTab,
  onTabChange,
  visibleFeatures,
  selectedId,
  onSelect,
  onFlyToFeature,
  tempPin,
  onAddListing,
}) {
  const isDragging = useRef(false);

  const handleDragStart = (e) => {
    e.preventDefault();
    isDragging.current = true;
    const startX = e.clientX;
    const startWidth = width;

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const delta = startX - e.clientX;
      onWidthChange(Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, startWidth + delta)));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  if (collapsed) {
    return (
      <button
        onClick={onExpand}
        style={{
          position: 'absolute',
          top: '50%',
          right: 12,
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: 20,
          height: 52,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          borderRadius: 6,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        <LeftOutlined style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)' }} />
      </button>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', flexShrink: 0 }}>
      {/* Collapse button - floats outside the panel on its left edge */}
      <button
        onClick={onCollapse}
        style={{
          position: 'absolute',
          left: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: 20,
          height: 52,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(0,0,0,0.12)',
          borderRight: 'none',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          borderRadius: '6px 0 0 6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        <RightOutlined style={{ fontSize: 10, color: 'rgba(0,0,0,0.45)' }} />
      </button>

      <div className="sidebar-panel" style={{ width }}>
        <div className="sidebar-drag-handle" onMouseDown={handleDragStart} />

        <Tabs
          activeKey={activeTab}
          onChange={onTabChange}
          className="map-tabs"
          tabBarStyle={{ margin: 0, paddingInline: 12 }}
          items={[
            {
              key: 'welcome',
              label: 'Welcome',
              children: <WelcomeTab onNavigate={onTabChange} />,
            },
            {
              key: 'insights',
              label: 'Insights',
              children: (
                <Insights
                  visibleFeatures={visibleFeatures}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  onFlyToFeature={onFlyToFeature}
                />
              ),
            },
            {
              key: 'contribute',
              label: 'Contribute',
              children: <Contribute tempPin={tempPin} onAddListing={onAddListing} />,
            },
            {
              key: 'info',
              label: 'Info',
              children: <InfoTab />,
            },
          ]}
        />
      </div>
    </div>
  );
}
