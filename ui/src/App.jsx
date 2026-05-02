import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Home from './pages/Home';
import Map from './pages/Map';
import Info from './pages/Info';
import './App.css';

function App() {
  return (
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
  );
}

export default App;
