import React from 'react';

export default function SlotDataCard({ slot }) {
  if (!slot) {
    return (
      <div className="empty-card">
        <p>No slot data selected. Please select a time slot above.</p>
      </div>
    );
  }

  // Determine renewable level
  const renewPct = slot.renewablePercent ?? 0;
  let renewTier = 'Moderate';
  let renewBadgeClass = 'badge-moderate';
  if (renewPct >= 40) {
    renewTier = 'High Clean Energy';
    renewBadgeClass = 'badge-high';
  } else if (renewPct < 20) {
    renewTier = 'Low Clean Energy';
    renewBadgeClass = 'badge-low';
  }

  return (
    <div className="slot-data-container">
      <div className="data-header">
        <div className="time-badge">
          <span className="icon">🕒</span>
          <span className="time-text">{slot.label}</span>
          {slot.isCurrent && <span className="live-pill">CURRENT TIME</span>}
        </div>
        <span className={`tier-badge ${renewBadgeClass}`}>{renewTier}</span>
      </div>

      {/* 3 Core Data Cards */}
      <div className="metrics-grid">
        {/* Metric 1: Renewable Energy Share */}
        <div className="metric-card renewable-card">
          <div className="metric-header">
            <span className="metric-icon">🌱</span>
            <span className="metric-title">Renewable Energy Share</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">
              {slot.renewablePercent !== null ? slot.renewablePercent : '--'}
            </span>
            <span className="metric-unit">{slot.renewableUnit}</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, slot.renewablePercent || 0))}%` }}
            ></div>
          </div>
          <p className="metric-hint">Clean solar & wind contribution to grid</p>
        </div>

        {/* Metric 2: Total Grid Load */}
        <div className="metric-card load-card">
          <div className="metric-header">
            <span className="metric-icon">⚡</span>
            <span className="metric-title">Total Grid Load</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">
              {slot.totalGridLoad !== null ? slot.totalGridLoad.toLocaleString() : '--'}
            </span>
            <span className="metric-unit">{slot.loadUnit}</span>
          </div>
          <p className="metric-hint">Current aggregate electricity demand</p>
        </div>

        {/* Metric 3: Carbon Intensity */}
        <div className="metric-card carbon-card">
          <div className="metric-header">
            <span className="metric-icon">💨</span>
            <span className="metric-title">Carbon Intensity</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-number">
              {slot.carbonIntensity !== null ? slot.carbonIntensity : '--'}
            </span>
            <span className="metric-unit">{slot.carbonUnit}</span>
          </div>
          <p className="metric-hint">Emissions per kWh generated</p>
        </div>
      </div>
    </div>
  );
}
