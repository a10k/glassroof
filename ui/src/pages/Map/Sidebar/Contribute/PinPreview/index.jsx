import Button from '../../../../../components/Button';

const ACCENT = '#129865';

const pinIcon = (filled) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.5 4.5 8.5 4.5 8.5S12.5 9.5 12.5 6c0-2.485-2.015-4.5-4.5-4.5z"
      fill={filled ? ACCENT : 'none'}
      stroke={ACCENT}
      strokeWidth="1.3"
    />
    <circle cx="8" cy="6" r="1.5" fill={filled ? '#fff' : ACCENT} />
  </svg>
);

const closeIcon = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function CoordStat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'rgba(0,0,0,0.35)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'rgba(0,0,0,0.85)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value.toFixed(5)}°
      </span>
    </div>
  );
}

export default function PinPreview({ tempPin, onRemove }) {
  if (!tempPin) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          borderRadius: 8,
          border: '1.5px dashed rgba(0,0,0,0.15)',
          background: 'rgba(0,0,0,0.02)',
        }}
      >
        {pinIcon(false)}
        <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)' }}>
          Tap the map to set your location
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: 8,
        border: `1.5px solid ${ACCENT}22`,
        background: `${ACCENT}08`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {pinIcon(true)}
          <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>Location set</span>
        </div>
        <Button variant="text" size="sm" icon={closeIcon} onClick={onRemove} />
      </div>
      <div
        style={{
          display: 'flex',
          borderRadius: 6,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.06)',
          background: '#fff',
        }}
      >
        <div style={{ flex: 1, padding: '10px 12px', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
          <CoordStat label="Latitude" value={tempPin.lat} />
        </div>
        <div style={{ flex: 1, padding: '10px 12px' }}>
          <CoordStat label="Longitude" value={tempPin.lng} />
        </div>
      </div>
    </div>
  );
}
