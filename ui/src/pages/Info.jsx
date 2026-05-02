import React from 'react';
import { Layout, Divider } from 'antd';
import './Info.css';

const { Content } = Layout;

export default function Info() {
  return (
    <Content className="info-content">
      <div className="info-container">
        <section className="info-section">
          <h2>Privacy Policy</h2>
          <p>
            Glassroof is built on the principle of privacy-first rent transparency.
          </p>
          <ul>
            <li>
              <strong>No personal information collected:</strong> We never ask for your name, email, phone number, or any identifying information.
            </li>
            <li>
              <strong>Anonymous by default:</strong> All rent data is submitted and stored anonymously. Your exact address is never recorded.
            </li>
            <li>
              <strong>What we collect:</strong> Only the rent amount, unit type (studio/1BR/2BR/3BR+), lease start month/year, and optional notes (utilities, parking, etc.).
            </li>
            <li>
              <strong>Location data:</strong> We use approximate coordinates to cluster rent data on the map. We never store your exact location.
            </li>
            <li>
              <strong>No accounts required:</strong> Drop a pin, add rent, done. No sign-ups, no verification, no tracking.
            </li>
            <li>
              <strong>Data security:</strong> All data is encrypted in transit and at rest. We follow industry best practices for data protection.
            </li>
          </ul>
        </section>

        <Divider />

        <section className="info-section">
          <h2>Contact</h2>
          <p>
            Questions, feedback, or concerns? Reach out to us:
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:hello@glassroof.app">hello@glassroof.app</a>
          </p>
        </section>
      </div>
    </Content>
  );
}
