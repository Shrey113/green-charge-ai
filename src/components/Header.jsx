import React from 'react';

export default function Header({ location, onRefresh, loading }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">⚡</div>
        <div>
          <h1 className="brand-title">GreenCharge AI</h1>
          <p className="brand-subtitle">Electricity Grid & Renewable Forecast</p>
        </div>
      </div>

      <div className="location-badge">
        <span className="location-dot"></span>
        <div className="location-info">
          <span className="location-label">User Location:</span>
          <span className="location-coords">
            {location ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Detecting...'}
          </span>
        </div>
        <button className="refresh-btn" onClick={onRefresh} disabled={loading} title="Refresh Live Forecast">
          {loading ? '↻ Loading...' : '↻ Refresh'}
        </button>
      </div>
    </header>
  );
}
