import { useEffect, useRef } from 'react';
import Button from '../../../../components/Button';
import ExpandableText from '../../../../components/ExpandableText';

const aimIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    <line
      x1="7"
      y1="1"
      x2="7"
      y2="3.5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="10.5"
      x2="7"
      y2="13"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line
      x1="1"
      y1="7"
      x2="3.5"
      y2="7"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <line
      x1="10.5"
      y1="7"
      x2="13"
      y2="7"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

function getGeomBounds(geometry) {
  const coords = geometry?.coordinates?.[0];
  if (!coords?.length) return null;
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

export default function Insights({ visibleFeatures = [], selectedId, onSelect, onFlyToFeature }) {
  const itemRefs = useRef({});

  useEffect(() => {
    if (selectedId && itemRefs.current[selectedId]) {
      itemRefs.current[selectedId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedId]);

  if (!visibleFeatures.length) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          Nothing in frame yet.
          <br />
          Pan or zoom to load market data.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '10px 20px 6px',
          color: 'rgba(0,0,0,0.35)',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        {visibleFeatures.length} neighborhood{visibleFeatures.length !== 1 ? 's' : ''} in frame
      </p>
      {visibleFeatures.map((feature) => (
        <div
          key={feature.id}
          ref={(el) => {
            itemRefs.current[feature.id] = el;
          }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            ...(feature.id === selectedId && {
              outline: '2px dashed #129865',
              outlineOffset: '-2px',
            }),
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: feature.color,
              flexShrink: 0,
              marginTop: 4,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 600, color: '#000' }}>
              {feature.title}
            </p>
            <ExpandableText style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.55 }}>
              {feature.text}
            </ExpandableText>
          </div>
          <Button
            variant="text"
            size="sm"
            icon={aimIcon}
            title="Focus"
            onClick={() => {
              onSelect?.(feature.id);
              const bounds = getGeomBounds(feature.geometry);
              onFlyToFeature(
                bounds ? { bounds } : { center: [feature.center_lng, feature.center_lat], zoom: 14 }
              );
            }}
          />
        </div>
      ))}
    </div>
  );
}
