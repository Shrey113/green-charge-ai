import React from 'react';
import VehicleLoginForm from '../components/VehicleLoginForm.jsx';
import evIsometricDiorama from '../assets/ev-isometric-diorama.jpg';
import './LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="iso-login-container">
      {/* 1. Left Visual: 3D Isometric EV Charging Diorama */}
      <section className="iso-visual-side" aria-label="3D EV Charging Station Showcase">
        <div className="iso-image-wrapper">
          <img
            src={evIsometricDiorama}
            alt="3D Isometric EV Car and Solar Charging Station Diorama"
            className="iso-diorama-img"
          />
          {/* Subtle floating badge */}
          <div className="iso-node-badge">
            <span className="iso-pulse" />
            <span>GreenCharge AI &bull; Solar EV Node</span>
          </div>
        </div>
      </section>

      {/* 2. Right Form: Clean Minimalist Auth */}
      <main className="iso-form-side">
        <div className="iso-form-wrapper">
          <header className="iso-header">
            <h1 className="iso-title">Sign in</h1>
            <p className="iso-subtitle">
              Welcome to GreenCharge EV network. Enter your vehicle credentials to connect.
            </p>
          </header>

          <VehicleLoginForm onLoginSuccess={onLoginSuccess} />

          <footer className="iso-footer">
            <span className="iso-footer-text">
              Clean Energy Network &bull; Gandhinagar Node
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
