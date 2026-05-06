import { ConfigProvider } from 'antd';
import Map from './pages/Map';
import './App.css';

const FONT = "'Geist Sans', 'Geist', -apple-system, BlinkMacSystemFont, sans-serif";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#129865',
          fontFamily: FONT,
          borderRadius: 0,
          borderRadiusLG: 0,
          borderRadiusSM: 0,
          borderRadiusXS: 0,
        },
      }}
    >
      <Map />
    </ConfigProvider>
  );
}

export default App;
