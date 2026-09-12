import React from 'react';

export default function DashboardOverview({ onNavigate }) {
  // Chart hourly data: 00 to 24
  const hourlyData = [
    { hour: '00', price: 7.2, renewable: 35 },
    { hour: '02', price: 6.0, renewable: 45 },
    { hour: '04', price: 5.2, renewable: 55 },
    { hour: '06', price: 6.8, renewable: 60 },
    { hour: '08', price: 11.5, renewable: 50 },
    { hour: '10', price: 9.8, renewable: 75 },
    { hour: '12', price: 7.0, renewable: 88 },
    { hour: '14', price: 6.5, renewable: 82 },
    { hour: '16', price: 8.5, renewable: 70 },
    { hour: '18', price: 13.8, renewable: 45 },
    { hour: '20', price: 11.0, renewable: 52 },
    { hour: '22', price: 6.5, renewable: 82 },
    { hour: '24', price: 5.8, renewable: 78 },
  ];

  return (
    <div className="customer-page-content dashboard-overview-page">
      {/* 1. TOP ROW: 4 KPI CARDS */}
      <div className="customer-kpi-grid">
        {/* Card 1: Current Battery */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap battery-wrap">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="16" height="12" rx="2" ry="2" />
              <line x1="20" y1="11" x2="20" y2="15" />
              <line x1="6" y1="11" x2="6" y2="15" stroke="#10B981" strokeWidth="3" />
              <line x1="10" y1="11" x2="10" y2="15" stroke="#10B981" strokeWidth="3" />
              <line x1="14" y1="11" x2="14" y2="15" stroke="#10B981" strokeWidth="3" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">78%</span>
            <span className="kpi-label">Current Battery (SOC)</span>
          </div>
        </div>

        {/* Card 2: Target SOC */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap target-wrap">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="14" height="14" rx="2" />
              <line x1="19" y1="10" x2="19" y2="16" />
              <path d="M10 9l-2 4h4l-2 4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">90%</span>
            <span className="kpi-label">Target SOC</span>
          </div>
        </div>

        {/* Card 3: Estimated Cost */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap cost-wrap">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 8h6M8 11.5h4.5M10 11.5c2 0 3.5 1.2 3.5 3s-1.5 3-3.5 3M11.5 14.5l3.5 4" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">₹320</span>
            <span className="kpi-label">Estimated Cost (Optimized)</span>
          </div>
        </div>

        {/* Card 4: Estimated Charging Time */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap time-wrap">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">1h 45m</span>
            <span className="kpi-label">Estimated Charging Time</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: Recommended Schedule & Green Score */}
      <div className="dashboard-middle-grid">
        {/* Recommended Charging Schedule */}
        <div className="customer-card schedule-recommendation-card">
          <div className="card-header-clean">
            <h3 className="card-title">Recommended Charging Schedule</h3>
            <p className="card-subtitle">Best time to charge based on low cost and high renewable energy.</p>
          </div>

          <div className="recommendation-box">
            <div className="rec-box-top">
              <span className="rec-time-badge">Today, 10:00 PM – 12:00 AM</span>
              <span className="rec-optimal-pill">Optimal Time</span>
            </div>

            <div className="rec-stats-row">
              <div className="rec-stat-col">
                <span className="rec-stat-icon leaf-icon">🍃</span>
                <div className="rec-stat-text">
                  <span className="rec-stat-label">Cost</span>
                  <span className="rec-stat-val">₹6.5 / kWh</span>
                </div>
              </div>

              <div className="rec-stat-col">
                <span className="rec-stat-icon wind-icon">⚡</span>
                <div className="rec-stat-text">
                  <span className="rec-stat-label">Renewable Share</span>
                  <span className="rec-stat-val">82%</span>
                </div>
              </div>

              <div className="rec-stat-col">
                <span className="rec-stat-icon savings-icon">🪙</span>
                <div className="rec-stat-text">
                  <span className="rec-stat-label">Estimated Savings</span>
                  <span className="rec-stat-val">₹120</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="rec-action-btn"
              onClick={() => onNavigate && onNavigate('schedule')}
            >
              View Full Schedule →
            </button>
          </div>
        </div>

        {/* Your Green Score */}
        <div className="customer-card green-score-card">
          <div className="card-header-clean">
            <h3 className="card-title text-center">Your Green Score</h3>
          </div>

          <div className="green-score-gauge-wrap">
            <svg viewBox="0 0 160 160" className="green-score-svg">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
              />
              {/* Green Progress ring 85% */}
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray="402"
                strokeDashoffset={402 * (1 - 0.85)}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="green-score-center">
              <span className="score-number">85</span>
              <span className="score-max">/ 100</span>
              <div className="score-leaf">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#10B981">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
                </svg>
              </div>
            </div>
          </div>

          <p className="green-score-desc">
            Great! You are charging greener than <strong>78%</strong> of EV drivers.
          </p>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Electricity Price Chart & Monthly Impact */}
      <div className="dashboard-bottom-grid">
        {/* Electricity Price & Renewable Share (Today) */}
        <div className="customer-card chart-card">
          <div className="card-header-flex">
            <h3 className="card-title">Electricity Price & Renewable Share (Today)</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot price-dot" />
                <span>Electricity Price (₹/kWh)</span>
              </span>
              <span className="legend-item">
                <span className="legend-dot renewable-dot" />
                <span>Renewable Share (%)</span>
              </span>
            </div>
          </div>

          <div className="chart-wrapper">
            <svg viewBox="0 0 540 180" className="dual-axis-chart-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="renBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#BBF7D0" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="500" y2="140" stroke="#E2E8F0" />

              {/* Left Y-axis labels (Price 0, 5, 10, 15) */}
              <text x="32" y="24" className="axis-text" textAnchor="end">15</text>
              <text x="32" y="64" className="axis-text" textAnchor="end">10</text>
              <text x="32" y="104" className="axis-text" textAnchor="end">5</text>
              <text x="32" y="144" className="axis-text" textAnchor="end">0</text>
              <text x="14" y="80" className="axis-title-left" transform="rotate(-90 14 80)">Price</text>

              {/* Right Y-axis labels (Renewable 0, 25, 50, 75, 100) */}
              <text x="508" y="24" className="axis-text" textAnchor="start">100</text>
              <text x="508" y="64" className="axis-text" textAnchor="start">75</text>
              <text x="508" y="104" className="axis-text" textAnchor="start">50</text>
              <text x="508" y="144" className="axis-text" textAnchor="start">25</text>
              <text x="532" y="80" className="axis-title-right" transform="rotate(90 532 80)">Renewable %</text>

              {/* Renewable Bars */}
              {hourlyData.map((d, i) => {
                const x = 52 + i * 36;
                const barH = (d.renewable / 100) * 110;
                const y = 140 - barH;
                return (
                  <rect
                    key={d.hour}
                    x={x}
                    y={y}
                    width="18"
                    height={barH}
                    rx="3"
                    fill="url(#renBarGrad)"
                  />
                );
              })}

              {/* Electricity Price Line */}
              <path
                d={
                  hourlyData.reduce((acc, d, i) => {
                    const x = 61 + i * 36;
                    const y = 140 - (d.price / 15) * 120;
                    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '')
                }
                fill="none"
                stroke="#0F766E"
                strokeWidth="2.5"
              />

              {/* Price Points */}
              {hourlyData.map((d, i) => {
                const x = 61 + i * 36;
                const y = 140 - (d.price / 15) * 120;
                return (
                  <circle
                    key={`p-${d.hour}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke="#0F766E"
                    strokeWidth="2"
                  />
                );
              })}

              {/* X-axis labels */}
              {hourlyData.filter((_, i) => i % 2 === 0).map((d, i) => {
                const x = 61 + i * 72;
                return (
                  <text key={d.hour} x={x} y="158" className="axis-text" textAnchor="middle">
                    {d.hour}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Impact This Month */}
        <div className="customer-card impact-card">
          <div className="card-header-clean">
            <h3 className="card-title">Impact This Month</h3>
          </div>

          <div className="impact-items-list">
            {/* Money Saved */}
            <div className="impact-item">
              <div className="impact-icon-circle green-bg">
                <span>₹</span>
              </div>
              <div className="impact-info">
                <span className="impact-value">₹480</span>
                <span className="impact-label">Money Saved</span>
              </div>
            </div>

            {/* CO2 Reduced */}
            <div className="impact-item">
              <div className="impact-icon-circle green-bg">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <div className="impact-info">
                <span className="impact-value">62 kg</span>
                <span className="impact-label">CO2 Reduced</span>
              </div>
            </div>

            {/* Green Energy Used */}
            <div className="impact-item">
              <div className="impact-icon-circle green-bg">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#10B981">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="impact-info">
                <span className="impact-value">138 kWh</span>
                <span className="impact-label">Green Energy Used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
