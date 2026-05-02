import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './Header.css';

const { Header } = Layout;

export default function AppHeader() {
  const location = useLocation();

  const getSelectedKey = () => {
    if (location.pathname === '/map') return 'map';
    if (location.pathname === '/info') return 'info';
    return 'home';
  };

  return (
    <Header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">Glassroof</span>
        </Link>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          className="header-menu"
          items={[
            {
              key: 'map',
              label: <Link to="/map">Map</Link>,
            },
            {
              key: 'info',
              label: <Link to="/info">Info</Link>,
            },
          ]}
        />
      </div>
    </Header>
  );
}
