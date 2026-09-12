import React from 'react';
import { evDemandData } from '../services/gridData.js';

export default function EVChargingDemandPage() {
  const { kpis, evLoadCurve, regionalEvLoads, topStations } = evDemandData;

  // Chart coordinates for 24h EV Load
  const chartW = 460;
  const chartH = 175;
  const padL = 38;
  const padR = 15;
  const padT = 15;
  const padB = 25;
  const graphW = chartW - padL - padR;
  const graphH = chartH - padT - padB;
  const maxEVLoad = 600;

  const pointsEV = evLoadCurve.map((d, i) => {
    const x = padL + (i / (evLoadCurve.length - 1)) * graphW;
    const y = padT + graphH - (d.load / maxEVLoad) * graphH;
    return `${x},${y}`;
  }).join(' ');

  const areaEV = `${padL},${padT + graphH} ${pointsEV} ${padL + graphW},${padT + graphH}`;

  return (
    <div className="grid-page-content ev-charging-demand-page">
      {/* 1. TOP ROW: 3 METRIC CARDS */}
      <div className="kpi-grid-3">
        {/* Card 1: Current EV Load */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box green">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="14" height="12" rx="2" />
              <path d="M16 10h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4" />
              <path d="M6 12h4" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.currentEvLoad}</span>
            <span className="kpi-lbl">Current EV Load</span>
          </div>
        </div>

        {/* Card 2: Active Charging Sessions */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box teal">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 11l2-5h10l2 5" />
              <rect x="3" y="11" width="18" height="6" rx="2" />
              <circle cx="7.5" cy="17.5" r="1.5" />
              <circle cx="16.5" cy="17.5" r="1.5" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.activeSessions}</span>
            <span className="kpi-lbl">Active Charging Sessions</span>
          </div>
        </div>

        {/* Card 3: % of Total Grid Load */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box teal">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 10 10H12V2z" fill="#0D9488" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.gridLoadShare}</span>
            <span className="kpi-lbl">{kpis.gridLoadShareLabel}</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: 24h EV Load Area Chart & Regional Bar Chart */}
      <div className="grid-row-2col">
        {/* Left: EV Charging Load (Last 24 Hours) */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">EV Charging Load (Last 24 Hours)</h3>
          </div>

          <div className="chart-container-svg">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="165">
              {/* Y Axis ticks */}
              {[0, 200, 400, 600].map((val) => {
                const y = padT + graphH - (val / maxEVLoad) * graphH;
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
              <polygon points={areaEV} fill="#10B981" fillOpacity="0.25" />

              {/* Smooth Line */}
              <polyline points={pointsEV} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* X Axis labels */}
              {evLoadCurve.filter((_, idx) => idx % 2 === 0).map((d, i, arr) => {
                const x = padL + (i / (arr.length - 1)) * graphW;
                return (
                  <text key={d.time} x={x} y={chartH - 8} textAnchor="middle" fontSize="10" fill="#94A3B8">
                    {d.time}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Charging Load by Region */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Charging Load by Region</h3>
          </div>

          <div className="horiz-bar-list">
            {regionalEvLoads.map((item) => (
              <div key={item.region} className="horiz-bar-row">
                <span className="horiz-bar-label">{item.region}</span>
                <div className="horiz-bar-track">
                  <div
                    className="horiz-bar-fill"
                    style={{ width: `${(item.load / item.max) * 100}%` }}
                  />
                </div>
                <span className="horiz-bar-val">{item.load} MW</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Top Charging Stations by Load */}
      <div className="grid-card">
        <div className="card-header-clean">
          <h3 className="card-title">Top Charging Stations by Load</h3>
        </div>

        <div className="grid-table-wrap">
          <table className="grid-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Location</th>
                <th>Current Load</th>
                <th>Active Sessions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topStations.map((st) => (
                <tr key={st.station}>
                  <td style={{ fontWeight: 600 }}>{st.station}</td>
                  <td>{st.location}</td>
                  <td>{st.currentLoad}</td>
                  <td>{st.activeSessions}</td>
                  <td>
                    <span className="pill-badge status-normal">{st.status}</span>
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
