import { Flex, Typography, Button, Tooltip } from 'antd';
import { AimOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export default function Insights({ visibleFeatures = [], onFlyToFeature }) {
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
          align="flex-start"
          gap={12}
          style={{ padding: '12px 20px', borderBottom: '1px solid #f5f5f5' }}
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
              ellipsis={{ rows: 2 }}
            >
              {feature.text}
            </Paragraph>
          </Flex>
          <Tooltip title="Zoom to">
            <Button
              type="text"
              size="small"
              icon={<AimOutlined />}
              onClick={() => onFlyToFeature([feature.center_lng, feature.center_lat], 16)}
              style={{ flexShrink: 0, color: 'rgba(0,0,0,0.35)' }}
            />
          </Tooltip>
        </Flex>
      ))}
    </Flex>
  );
}
