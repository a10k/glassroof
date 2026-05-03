import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  { key: '/map', label: 'Map' },
  { key: '/info', label: 'Info' },
];

export default function AppHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        background: '#fff',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <Text
        strong
        style={{ fontSize: 18, cursor: 'pointer', whiteSpace: 'nowrap', color: '#129865' }}
        onClick={() => navigate('/')}
      >
        Glassroof
      </Text>
      <Menu
        mode="horizontal"
        selectedKeys={[pathname]}
        items={NAV_ITEMS}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, border: 'none', minWidth: 0 }}
      />
    </Header>
  );
}
