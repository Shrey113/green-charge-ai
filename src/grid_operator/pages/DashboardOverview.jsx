import React from 'react';
import { gridOverviewData } from '../services/gridData.js';

export default function DashboardOverview({ onNavigate }) {
  const { kpis, hourlyLoadRenewable, energyMix } = gridOverviewData;

  // Chart coordinates calculation for 450x180 viewBox
  const chartW = 450;
  const chartH = 180;
  const padL = 38;
  const padR = 15;
  const padT = 15;
  const padB = 25;
  const graphW = chartW - padL - padR;
  const graphH = chartH - padT - padB;
  const maxMW = 4000;

  const pointsGrid = hourlyLoadRenewable.map((d, i) => {
    const x = padL + (i / (hourlyLoadRenewable.length - 1)) * graphW;
    const y = padT + graphH - (d.gridLoad / maxMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  const pointsRen = hourlyLoadRenewable.map((d, i) => {
    const x = padL + (i / (hourlyLoadRenewable.length - 1)) * graphW;
    const y = padT + graphH - (d.renewable / maxMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  const pointsEV = hourlyLoadRenewable.map((d, i) => {
    const x = padL + (i / (hourlyLoadRenewable.length - 1)) * graphW;
    const y = padT + graphH - (d.evLoad / maxMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  const areaGrid = `${padL},${padT + graphH} ${pointsGrid} ${padL + graphW},${padT + graphH}`;
  const areaRen = `${padL},${padT + graphH} ${pointsRen} ${padL + graphW},${padT + graphH}`;

  // Donut chart SVG path calculation
  let cumulativePercent = 0;
  function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  const donutSlices = energyMix.map((slice) => {
    if (slice.percent === 0) return null;
    const startAngle = cumulativePercent;
    cumulativePercent += slice.percent / 100;
    const endAngle = cumulativePercent;

    const [startX, startY] = getCoordinatesForPercent(startAngle);
    const [endX, endY] = getCoordinatesForPercent(endAngle);

    const largeArcFlag = slice.percent / 100 > 0.5 ? 1 : 0;

    const pathData = [
      `M ${startX * 60 + 85} ${startY * 60 + 85}`,
      `A 60 60 0 ${largeArcFlag} 1 ${endX * 60 + 85} ${endY * 60 + 85}`,
      `L ${endX * 42 + 85} ${endY * 42 + 85}`,
      `A 42 42 0 ${largeArcFlag} 0 ${startX * 42 + 85} ${startY * 42 + 85}`,
      'Z',
    ].join(' ');

    return { ...slice, pathData };
  });

  return (
    <div className="grid-page-content dashboard-overview-page">
      {/* 1. TOP ROW: 6 KPI CARDS */}
      <div className="kpi-grid-6">
        {/* Card 1: Current Grid Load */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.currentGridLoad}</span>
            <span className="kpi-lbl">Current Grid Load</span>
            <span className="kpi-sub">({kpis.currentGridLoadPercent})</span>
          </div>
        </div>

        {/* Card 2: Total Grid Capacity */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L18 2" />
              <path d="M12 2L12 22" />
              <path d="M7 8L17 8" />
              <path d="M5 14L19 14" />
              <path d="M9 22L15 22" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.totalGridCapacity}</span>
            <span className="kpi-lbl">Total Grid Capacity</span>
          </div>
        </div>

        {/* Card 3: Renewable Share */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.renewableShare}</span>
            <span className="kpi-lbl">Renewable Share</span>
            <span className="kpi-sub">({kpis.renewableShareMW})</span>
          </div>
        </div>

        {/* Card 4: EV Charging Load */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="6" width="14" height="12" rx="2" />
              <path d="M16 10h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4" />
              <path d="M6 12h4" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.evChargingLoad}</span>
            <span className="kpi-lbl">EV Charging Load</span>
            <span className="kpi-sub">({kpis.evChargingLoadPercent})</span>
          </div>
        </div>

        {/* Card 5: Load vs Yesterday */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box green">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
              <polyline points="14 7 17 4 20 7" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.loadVsYesterday}</span>
            <span className="kpi-lbl">Load vs Yesterday</span>
          </div>
        </div>

        {/* Card 6: Active Alerts */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box red">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-val">{kpis.activeAlerts}</span>
            <span className="kpi-lbl">Active Alerts</span>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM ROW: TWO CHARTS */}
      <div className="grid-row-2col-60-40">
        {/* Left Chart: Grid Load vs Renewable Generation */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Grid Load vs Renewable Generation</h3>
          </div>

          <div className="chart-container-svg">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="180">
              {/* Grid Lines & Y-axis labels */}
              {[0, 1000, 2000, 3000, 4000].map((val) => {
                const y = padT + graphH - (val / maxMW) * graphH;
                const label = val === 0 ? '0' : `${val / 1000}K`;
                return (
                  <g key={val}>
                    <line x1={padL} y1={y} x2={padL + graphW} y2={y} stroke="#F1F5F9" strokeWidth="1" />
                    <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94A3B8" fontWeight="500">
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
                Power (MW)
              </text>

              {/* Area Fills */}
              <polygon points={areaGrid} fill="#10B981" fillOpacity="0.18" />
              <polygon points={areaRen} fill="#3B82F6" fillOpacity="0.12" />

              {/* Lines */}
              <polyline points={pointsGrid} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={pointsRen} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={pointsEV} fill="none" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

              {/* X Axis labels */}
              {hourlyLoadRenewable.filter((_, idx) => idx % 2 === 0).map((d, i, arr) => {
                const x = padL + (i / (arr.length - 1)) * graphW;
                return (
                  <text key={d.time} x={x} y={chartH - 8} textAnchor="middle" fontSize="10" fill="#94A3B8">
                    {d.time}
                  </text>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="chart-legend-row">
              <div className="legend-item">
                <span className="legend-square" style={{ backgroundColor: '#059669' }} />
                <span>Grid Load</span>
              </div>
              <div className="legend-item">
                <span className="legend-square" style={{ backgroundColor: '#2563EB' }} />
                <span>Renewable Generation</span>
              </div>
              <div className="legend-item">
                <span className="legend-square" style={{ backgroundColor: '#06B6D4' }} />
                <span>EV Charging Load</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chart: Energy Mix (Current) */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Energy Mix (Current)</h3>
          </div>

          <div className="donut-layout">
            <div className="donut-svg-wrap">
              <svg viewBox="0 0 170 170" width="160" height="160">
                {donutSlices.map((s, idx) => (
                  s && (
                    <path
                      key={idx}
                      d={s.pathData}
                      fill={s.color}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  )
                ))}
              </svg>
              <div className="donut-center-info">
                <span className="donut-center-val">2,450</span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>MW</span>
              </div>
            </div>

            <div className="donut-legend-list">
              {energyMix.map((mix) => (
                <div key={mix.name} className="donut-legend-row">
                  <div className="donut-legend-left">
                    <span className="legend-square" style={{ backgroundColor: mix.color }} />
                    <span>{mix.name}</span>
                  </div>
                  <span className="donut-legend-pct">{mix.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
