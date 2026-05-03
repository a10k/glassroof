import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import Header from './components/Header';
import Home from './pages/Home';
import Map from './pages/Map';
import Info from './pages/Info';
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
        components: {
          Layout: {
            headerHeight: 42,
            headerPadding: '0 24px',
          },
        },
      }}
    >
      <HashRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
