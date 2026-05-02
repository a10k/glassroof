import React from 'react';
import { Button, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const { Content } = Layout;

export default function Home() {
  const navigate = useNavigate();

  return (
    <Content className="home-content">
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-headline">What does your neighbor actually pay?</h1>
          <p className="home-subtext">
            Glassroof is an anonymous rent transparency platform. Share your lease details
            and discover real rental prices in your area—no personal information required.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/map')}
            className="home-cta"
          >
            Explore the Map
          </Button>
        </div>
        <div className="home-visual">
          <div className="map-preview">
            <div className="map-placeholder">
              <p style={{ color: '#999' }}>Map Preview</p>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}
