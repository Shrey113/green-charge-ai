import React from 'react';

export default function Header({ station, onRefresh, loading }) {
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
          <span className="location-label">Fixed EV Station:</span>
          <span className="location-coords">
            {station ? `${station.name} (${station.latitude}, ${station.longitude})` : '23.188551° N, 72.626715° E'}
          </span>
        </div>
        <button className="refresh-btn" onClick={onRefresh} disabled={loading} title="Refresh Live Forecast">
          {loading ? '↻ Loading...' : '↻ Refresh'}
        </button>
      </div>
    </header>
  );
}
