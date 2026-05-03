import { Button, Flex, Typography, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();

  return (
    <Content
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
      }}
    >
      <Flex
        vertical
        align="center"
        gap={24}
        style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}
      >
        <Title style={{ margin: 0 }}>What does your neighbor actually pay?</Title>
        <Text type="secondary" style={{ fontSize: 16, lineHeight: 1.6 }}>
          Glassroof is an anonymous rent transparency platform. Share your lease details and
          discover real rental prices in your area — no personal information required.
        </Text>
        <Button type="primary" size="large" onClick={() => navigate('/map')}>
          Explore the Map
        </Button>
      </Flex>
    </Content>
  );
}
