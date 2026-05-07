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
      <Title style={{ margin: 0, fontSize: 22 }}>The rent your neighbors won't discuss.</Title>
      <Text type="secondary" style={{ fontSize: 15, lineHeight: 1.7 }}>
        Glassroof surfaces real lease prices — anonymously contributed, geographically indexed.
        No accounts. No personal data. Just signal.
      </Text>
      <Flex gap={12}>
        <Button type="primary" size="large" onClick={() => onNavigate('market')}>
          Explore the market
        </Button>
        <Button size="large" onClick={() => onNavigate('report')}>
          Add your data
        </Button>
      </Flex>
    </Flex>
  );
}

// ─── Info tab ─────────────────────────────────────────────────────────────────
const PRIVACY_ITEMS = [
  {
    label: 'Nothing that identifies you',
    desc: 'No name, email, phone, or any identifier. We don\'t ask for it and have no use for it.',
  },
  {
    label: 'Anonymous by design',
    desc: 'Submissions are stored without authorship. Your exact address is never recorded — only a map coordinate you choose.',
  },
  {
    label: 'What we actually store',
    desc: 'Rent amount, unit type, lease start date, and optional notes. That\'s the complete list.',
  },
  {
    label: 'Location precision',
    desc: 'We store the pin you drop — used to plot your data on the map. Nothing else.',
  },
  {
    label: 'Zero friction',
    desc: 'No accounts, no verification, no OAuth. Place a pin, fill in rent, submit.',
  },
  {
    label: 'Standard security',
    desc: 'All data encrypted in transit and at rest.',
  },
];

function InfoTab() {
  return (
    <div style={{ padding: '16px 20px', overflowY: 'auto', height: '100%' }}>
      <Title level={4} style={{ marginTop: 0 }}>
        How it works
      </Title>
      <Paragraph type="secondary" style={{ fontSize: 13 }}>
        Built with one constraint: no personal data, ever.
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
              label: 'Overview',
              children: <WelcomeTab onNavigate={onTabChange} />,
            },
            {
              key: 'market',
              label: 'Market',
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
              key: 'report',
              label: 'Report',
              children: <Contribute tempPin={tempPin} onAddListing={onAddListing} />,
            },
            {
              key: 'about',
              label: 'About',
              children: <InfoTab />,
            },
          ]}
        />
      </div>
    </div>
  );
}
