import { Button, Input, Spin, Flex, Typography, Alert } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Insights({ locationStatus, userLocation, onAllowLocation }) {
  return (
    <Flex vertical gap={16} style={{ padding: '16px 20px' }}>
      <Title level={5} style={{ margin: 0 }}>
        Your Location
      </Title>
      <Paragraph style={{ margin: 0, color: 'rgba(0,0,0,0.65)', lineHeight: 1.6 }}>
        We use your location to show relevant rent data in your area. Your exact address is never
        stored—only approximate coordinates to help you explore nearby listings.
      </Paragraph>

      {locationStatus === 'idle' && (
        <Button
          type="primary"
          size="large"
          icon={<EnvironmentOutlined />}
          onClick={onAllowLocation}
          block
        >
          Allow My Location
        </Button>
      )}

      {locationStatus === 'loading' && (
        <Flex justify="center" style={{ padding: '24px 0' }}>
          <Spin />
        </Flex>
      )}

      {locationStatus === 'granted' && (
        <Alert
          type="success"
          message="Location enabled"
          description={
            userLocation &&
            `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}`
          }
          showIcon
        />
      )}

      {locationStatus === 'denied' && (
        <>
          <Alert
            type="error"
            message="Location access denied"
            description="You can still search for addresses manually or check your browser settings to enable location access."
            showIcon
          />
          <Input.Search placeholder="Search address..." />
        </>
      )}
    </Flex>
  );
}
