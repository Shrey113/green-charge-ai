import React, { useState } from 'react';
import { analyticsAlertsData } from '../services/gridData.js';

export default function AnalyticsAlertsPage() {
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const { kpis, gridLoadTrend, renewableTrend, recentAlerts } = analyticsAlertsData;

  // Chart coordinates calculation for Grid Load Trend
  const chartW = 460;
  const chartH = 165;
  const padL = 38;
  const padR = 15;
  const padT = 15;
  const padB = 25;
  const graphW = chartW - padL - padR;
  const graphH = chartH - padT - padB;
  const maxLoad = 4000;

  const loadPoints = gridLoadTrend.map((d, i) => {
    const x = padL + (i / (gridLoadTrend.length - 1)) * graphW;
    const y = padT + graphH - (d.load / maxLoad) * graphH;
    return { x, y, ...d };
  });

  const loadPolyline = loadPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const loadArea = `${padL},${padT + graphH} ${loadPolyline} ${padL + graphW},${padT + graphH}`;

  // Chart coordinates for Renewable Share Trend
  const maxShare = 80;
  const sharePoints = renewableTrend.map((d, i) => {
    const x = padL + (i / (renewableTrend.length - 1)) * graphW;
    const y = padT + graphH - (d.share / maxShare) * graphH;
    return { x, y, ...d };
  });

  const sharePolyline = sharePoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="grid-page-content analytics-alerts-page">
      {/* 1. TOP ROW: 4 METRIC CARDS */}
      <div className="kpi-grid-4">
        {/* Card 1: Total Energy Supplied */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box blue">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 16.8a7.5 7.5 0 0 0-12 0" />
              <line x1="8" y1="12" x2="8" y2="4" />
              <line x1="16" y1="12" x2="16" y2="4" />
              <line x1="12" y1="12" x2="12" y2="20" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.totalEnergySupplied}</span>
            <span className="kpi-lbl">Total Energy Supplied</span>
          </div>
        </div>

        {/* Card 2: Average Renewable Share */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box green">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.avgRenewableShare}</span>
            <span className="kpi-lbl">Average Renewable Share</span>
          </div>
        </div>

        {/* Card 3: Load Growth */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box blue">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
              <polyline points="14 7 17 4 20 7" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.loadGrowth}</span>
            <span className="kpi-lbl">Load Growth</span>
            <span className="kpi-sub">{kpis.loadGrowthSub}</span>
          </div>
        </div>

        {/* Card 4: Alerts Triggered */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box red">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.alertsTriggered}</span>
            <span className="kpi-lbl">Alerts Triggered</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: Grid Load Trend & Renewable Share Trend */}
      <div className="grid-row-2col">
        {/* Left: Grid Load Trend */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Grid Load Trend</h3>
          </div>

          <div className="chart-container-svg">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="155">
              {/* Y Axis ticks */}
              {[0, 1000, 2000, 3000, 4000].map((val) => {
                const y = padT + graphH - (val / maxLoad) * graphH;
                const label = val === 0 ? '0' : `${val / 1000}K`;
                return (
                  <g key={val}>
                    <line x1={padL} y1={y} x2={padL + graphW} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                    <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94A3B8">
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Y Axis Label */}
              <text
                x={-chartH / 2}
                y="12"
                transform="rotate(-90)"
                textAnchor="middle"
                fontSize="9"
                fill="#94A3B8"
                fontWeight="600"
              >
                Load (MW)
              </text>

              {/* Area Fill */}
              <polygon points={loadArea} fill="#10B981" fillOpacity="0.2" />

              {/* Line */}
              <polyline
                points={loadPolyline}
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {loadPoints.map((p) => (
                <circle
                  key={p.date}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#059669"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}

              {/* X Axis labels */}
              {gridLoadTrend.map((d, i, arr) => {
                const x = padL + (i / (arr.length - 1)) * graphW;
                return (
                  <text key={d.date} x={x} y={chartH - 8} textAnchor="middle" fontSize="10" fill="#94A3B8">
                    {d.date}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Renewable Share Trend */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Renewable Share Trend</h3>
          </div>

          <div className="chart-container-svg">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="155">
              {/* Y Axis ticks */}
              {[0, 20, 40, 60, 80].map((val) => {
                const y = padT + graphH - (val / maxShare) * graphH;
                return (
                  <g key={val}>
                    <line x1={padL} y1={y} x2={padL + graphW} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                    <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94A3B8">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Y Axis Label */}
              <text
                x={-chartH / 2}
                y="14"
                transform="rotate(-90)"
                textAnchor="middle"
                fontSize="9"
                fill="#94A3B8"
                fontWeight="600"
              >
                %
              </text>

              {/* Line */}
              <polyline
                points={sharePolyline}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {sharePoints.map((p) => (
                <circle
                  key={p.date}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              ))}

              {/* X Axis labels */}
              {renewableTrend.map((d, i, arr) => {
                const x = padL + (i / (arr.length - 1)) * graphW;
                return (
                  <text key={d.date} x={x} y={chartH - 8} textAnchor="middle" fontSize="10" fill="#94A3B8">
                    {d.date}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Recent Alerts Table */}
      <div className="grid-card">
        <div className="card-header-clean">
          <h3 className="card-title">Recent Alerts</h3>
        </div>

        <div className="grid-table-wrap">
          <table className="grid-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Message</th>
                <th>Severity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td style={{ whiteSpace: 'nowrap', color: '#64748B' }}>{alert.time}</td>
                  <td style={{ fontWeight: 600 }}>{alert.type}</td>
                  <td>{alert.message}</td>
                  <td>
                    <span
                      className={`pill-badge ${
                        alert.severity === 'High'
                          ? 'sev-high'
                          : alert.severity === 'Medium'
                          ? 'sev-medium'
                          : 'sev-low'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td>
                    <span className="pill-badge status-resolved">{alert.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
