import { useRef } from 'react';
import Tabs from '../../../components/Tabs';
import Button from '../../../components/Button';
import Insights from './Insights';
import Contribute from './Contribute';
import './sidebar.css';

const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 620;

const muted = { color: 'rgba(0,0,0,0.45)', fontSize: 13, lineHeight: 1.7 };
const label = { fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.8)' };

// ─── Welcome tab ──────────────────────────────────────────────────────────────
function WelcomeTab({ onNavigate }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '48px 24px',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>
        The rent your neighbors won't discuss.
      </h2>
      <p style={{ ...muted, maxWidth: 300 }}>
        Glassroof surfaces real lease prices — anonymously contributed, geographically indexed. No
        accounts. No personal data. Just signal.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="primary" onClick={() => onNavigate('market')}>
          Explore the market
        </Button>
        <Button variant="ghost" onClick={() => onNavigate('report')}>
          Add your data
        </Button>
      </div>
    </div>
  );
}

// ─── About tab ────────────────────────────────────────────────────────────────
const PRIVACY_ITEMS = [
  {
    label: 'Nothing that identifies you',
    desc: "No name, email, phone, or any identifier. We don't ask for it and have no use for it.",
  },
  {
    label: 'Anonymous by design',
    desc: 'Submissions are stored without authorship. Your exact address is never recorded — only a map coordinate you choose.',
  },
  {
    label: 'What we actually store',
    desc: "Rent amount, unit type, lease start date, and optional notes. That's the complete list.",
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

function AboutTab() {
  return (
    <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>How it works</h3>
      <p style={{ ...muted, marginBottom: 20 }}>
        Built with one constraint: no personal data, ever.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {PRIVACY_ITEMS.map(({ label: l, desc }) => (
          <div key={l} style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ ...label, marginBottom: 3 }}>{l}</p>
            <p style={{ ...muted, margin: 0, fontSize: 12 }}>{desc}</p>
          </div>
        ))}
      </div>
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid rgba(0,0,0,0.07)' }} />
      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Contact</h3>
      <p style={{ ...muted, fontSize: 13 }}>
        Questions, feedback, or concerns?{' '}
        <a
          href="https://github.com/a10k/glassroof/issues"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#129865', textDecoration: 'none' }}
        >
          Open an issue on GitHub
        </a>
      </p>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({
  collapsed,
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

  if (collapsed) return null;

  return (
    <div style={{ position: 'relative', height: '100%', flexShrink: 0 }}>
      <div className="sidebar-panel" style={{ width }}>
        <div className="sidebar-drag-handle" onMouseDown={handleDragStart} />
        <Tabs
          activeKey={activeTab}
          onChange={onTabChange}
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
            { key: 'about', label: 'About', children: <AboutTab /> },
          ]}
        />
      </div>
    </div>
  );
}
