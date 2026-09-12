import React from 'react';

export default function SlotDataCard({ slot }) {
  if (!slot) return null;

  return (
    <div className="slot-data-container">
      <div className="data-header">
        <div className="time-badge">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="time-text">{slot.label}</span>
          {slot.isCurrent && <span className="live-pill">LIVE / CURRENT</span>}
        </div>
        <span className={`tier-badge ${slot.badgeClass}`}>
          {slot.statusTier} Renewable
        </span>
      </div>

      <div className="metrics-grid">
        {/* Metric 1: Renewable Energy Share */}
        <div className="metric-card renewable-card">
          <div className="metric-header">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#ecfdf5" />
              <path d="M12 6v6l4 2" />
            </svg>
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
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#eff6ff" />
            </svg>
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
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#fefce8" />
            </svg>
            <span className="metric-title">Carbon Intensity</span>
            {slot.isCarbonEstimated && (
              <span className="est-badge" title="Calculated using Central Electricity Authority (CEA) Indian grid baseline factor">
                Estimated
              </span>
            )}
          </div>
          <div className="metric-value-row">
            <span className="metric-number">
              {slot.carbonIntensity !== null ? slot.carbonIntensity : '--'}
            </span>
            <span className="metric-unit">{slot.carbonUnit}</span>
          </div>
          <p className="metric-hint">
            {slot.isCarbonEstimated
              ? 'Derived from renewable mix (CEA Grid Baseline)'
              : 'Emissions per kWh generated'}
          </p>
        </div>
      </div>
    </div>
  );
}
