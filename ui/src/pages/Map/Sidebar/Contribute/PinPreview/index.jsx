import { Flex, Typography, Button } from 'antd';
import { EnvironmentFilled, EnvironmentOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PIN_COLOR = '#1677ff';

function CoordStat({ label, value }) {
  return (
    <Flex vertical gap={2} style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: 'rgba(0,0,0,0.35)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'rgba(0,0,0,0.85)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value.toFixed(5)}°
      </Text>
    </Flex>
  );
}

export default function PinPreview({ tempPin, onRemove }) {
  if (!tempPin) {
    return (
      <Flex
        align="center"
        gap={10}
        style={{
          padding: '12px 14px',
          borderRadius: 8,
          border: '1.5px dashed #d9d9d9',
          background: '#fafafa',
          color: 'rgba(0,0,0,0.35)',
        }}
      >
        <EnvironmentOutlined style={{ fontSize: 18, color: 'rgba(0,0,0,0.25)' }} />
        <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)' }}>
          Click anywhere on the map to drop a pin
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      gap={10}
      style={{
        padding: '12px 14px',
        borderRadius: 8,
        border: `1.5px solid ${PIN_COLOR}22`,
        background: `${PIN_COLOR}08`,
      }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={7}>
          <EnvironmentFilled style={{ fontSize: 16, color: PIN_COLOR }} />
          <Text style={{ fontSize: 13, fontWeight: 600, color: PIN_COLOR }}>Pin dropped</Text>
        </Flex>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onRemove}
          style={{ color: 'rgba(0,0,0,0.35)', minWidth: 24, padding: 0 }}
        />
      </Flex>

      <Flex
        gap={0}
        style={{
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
      </Flex>
    </Flex>
  );
}
