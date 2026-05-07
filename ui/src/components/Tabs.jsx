import './ui.css';

export default function Tabs({ items, activeKey, onChange }) {
  const active = items.find((i) => i.key === activeKey) ?? items[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          flexShrink: 0,
          overflowX: 'auto',
        }}
      >
        {items.map((item) => (
          <button
            key={item.key}
            className={`tab-item${item.key === activeKey ? ' active' : ''}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>{active?.children}</div>
    </div>
  );
}
