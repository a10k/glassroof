import { useEffect, useRef } from 'react';
import { Flex, Typography, Button, Tooltip } from 'antd';
import { AimOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

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
      <Flex
        vertical
        align="center"
        justify="center"
        style={{ padding: '48px 24px', height: '100%' }}
      >
        <Text type="secondary" style={{ textAlign: 'center', lineHeight: 1.6 }}>
          No areas in current view.
          <br />
          Pan or zoom the map to explore.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex vertical gap={0}>
      <Text
        type="secondary"
        style={{
          fontSize: 11,
          padding: '10px 20px 6px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {visibleFeatures.length} area{visibleFeatures.length !== 1 ? 's' : ''} in view
      </Text>
      {visibleFeatures.map((feature) => (
        <Flex
          key={feature.id}
          ref={(el) => {
            itemRefs.current[feature.id] = el;
          }}
          align="flex-start"
          gap={12}
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #f5f5f5',
            ...(feature.id === selectedId && {
              outline: '2px dashed #164CFF',
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
          <Flex vertical gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Text strong style={{ fontSize: 13 }}>
              {feature.title}
            </Text>
            <Paragraph
              style={{ margin: 0, fontSize: 12, color: 'rgba(0,0,0,0.55)' }}
              ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
            >
              {feature.text}
            </Paragraph>
          </Flex>
          <Tooltip title="Zoom to">
            <Button
              type="text"
              size="small"
              icon={<AimOutlined />}
              onClick={() => {
                onSelect?.(feature.id);
                const bounds = getGeomBounds(feature.geometry);
                onFlyToFeature(
                  bounds
                    ? { bounds }
                    : { center: [feature.center_lng, feature.center_lat], zoom: 14 }
                );
              }}
              style={{ flexShrink: 0, color: 'rgba(0,0,0,0.35)' }}
            />
          </Tooltip>
        </Flex>
      ))}
    </Flex>
  );
}
