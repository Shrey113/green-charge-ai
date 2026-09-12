import React from 'react';
import { renewableData } from '../services/gridData.js';

export default function RenewableEnergyPage() {
  const { kpis, generation24h, forecast24h, insights } = renewableData;

  // Stacked Area Chart calculations (generation24h)
  const chartW = 460;
  const chartH = 175;
  const padL = 38;
  const padR = 15;
  const padT = 15;
  const padB = 25;
  const graphW = chartW - padL - padR;
  const graphH = chartH - padT - padB;
  const maxGenMW = 1000;

  // Stacked coordinates:
  // Layer 1: Hydro (bottom)
  // Layer 2: Hydro + Wind
  // Layer 3: Hydro + Wind + Solar (top)
  const pointsHydro = generation24h.map((d, i) => {
    const x = padL + (i / (generation24h.length - 1)) * graphW;
    const y = padT + graphH - (d.hydro / maxGenMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  const pointsWind = generation24h.map((d, i) => {
    const x = padL + (i / (generation24h.length - 1)) * graphW;
    const y = padT + graphH - ((d.hydro + d.wind) / maxGenMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  const pointsSolar = generation24h.map((d, i) => {
    const x = padL + (i / (generation24h.length - 1)) * graphW;
    const y = padT + graphH - ((d.hydro + d.wind + d.solar) / maxGenMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  // SVG Area polygons
  const areaHydro = `${padL},${padT + graphH} ${pointsHydro} ${padL + graphW},${padT + graphH}`;
  const areaWind = `${pointsHydro} ${pointsWind.split(' ').reverse().join(' ')}`;
  const areaSolar = `${pointsWind} ${pointsSolar.split(' ').reverse().join(' ')}`;

  // Forecast Chart calculations
  const maxForecastMW = 1500;
  const pointsForecastSolar = forecast24h.map((d, i) => {
    const x = padL + (i / (forecast24h.length - 1)) * graphW;
    const y = padT + graphH - (d.solarForecast / maxForecastMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  const pointsForecastWind = forecast24h.map((d, i) => {
    const x = padL + (i / (forecast24h.length - 1)) * graphW;
    const y = padT + graphH - (d.windForecast / maxForecastMW) * graphH;
    return `${x},${y}`;
  }).join(' ');

  // Radial Gauge for Renewable Share (34%)
  const gaugeR = 48;
  const gaugeCirc = 2 * Math.PI * gaugeR;
  const gaugeOffset = gaugeCirc - (kpis.generationSharePercent / 100) * gaugeCirc;

  return (
    <div className="grid-page-content renewable-energy-page">
      {/* 1. TOP ROW: 3 METRIC CARDS */}
      <div className="kpi-grid-3">
        {/* Card 1: Solar */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box yellow">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-lbl" style={{ fontSize: '12px', fontWeight: 600 }}>Solar</span>
            <span className="kpi-val">{kpis.solar}</span>
            <span className="kpi-sub">Current Generation</span>
          </div>
        </div>

        {/* Card 2: Wind */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box teal">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-lbl" style={{ fontSize: '12px', fontWeight: 600 }}>Wind</span>
            <span className="kpi-val">{kpis.wind}</span>
            <span className="kpi-sub">Current Generation</span>
          </div>
        </div>

        {/* Card 3: Total Renewable */}
        <div className="grid-kpi-card">
          <div className="kpi-icon-box green">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div className="kpi-content-box">
            <span className="kpi-lbl" style={{ fontSize: '12px', fontWeight: 600 }}>Total Renewable</span>
            <span className="kpi-val">{kpis.totalRenewable}</span>
            <span className="kpi-sub">{kpis.totalRenewablePercent}</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: Generation (Last 24 Hours) & Renewable Share */}
      <div className="grid-row-2col-70-30">
        {/* Left: Stacked Area Generation Chart */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Renewable Generation (Last 24 Hours)</h3>
          </div>

          <div className="chart-container-svg">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="160">
              {/* Y Axis ticks */}
              {[0, 200, 400, 600, 800, 1000].map((val) => {
                const y = padT + graphH - (val / maxGenMW) * graphH;
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
                Power (MW)
              </text>

              {/* Stacked Fills */}
              <polygon points={areaHydro} fill="#60A5FA" fillOpacity="0.85" />
              <polygon points={areaWind} fill="#34D399" fillOpacity="0.85" />
              <polygon points={areaSolar} fill="#FBBF24" fillOpacity="0.85" />

              {/* X Axis labels */}
              {generation24h.filter((_, idx) => idx % 2 === 0).map((d, i, arr) => {
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
                <span className="legend-square" style={{ backgroundColor: '#FBBF24' }} />
                <span>Solar</span>
              </div>
              <div className="legend-item">
                <span className="legend-square" style={{ backgroundColor: '#34D399' }} />
                <span>Wind</span>
              </div>
              <div className="legend-item">
                <span className="legend-square" style={{ backgroundColor: '#60A5FA' }} />
                <span>Hydro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Renewable Share Gauge */}
        <div className="grid-card renewable-share-meter-card">
          <div className="card-header-clean" style={{ width: '100%' }}>
            <h3 className="card-title">Renewable Share</h3>
          </div>

          <div className="renewable-circular-wrap">
            <svg viewBox="0 0 120 120" width="115" height="115">
              <circle
                cx="60"
                cy="60"
                r={gaugeR}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={gaugeR}
                fill="none"
                stroke="#047857"
                strokeWidth="10"
                strokeDasharray={gaugeCirc}
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="renewable-center-label">
              <span className="renewable-pct-big">{kpis.generationSharePercent}%</span>
              <span className="renewable-pct-sub">of total generation</span>
            </div>
          </div>

          <span className="renewable-bottom-sub">840 MW</span>
          <span className="renewable-bottom-total">out of 2,450 MW</span>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Renewable Forecast & Key Insights */}
      <div className="grid-row-2col-70-30">
        {/* Left: Forecast Chart */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Renewable Forecast (Next 24 Hours)</h3>
          </div>

          <div className="chart-container-svg">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="160">
              {/* Y Axis ticks */}
              {[0, 500, 1000, 1500].map((val) => {
                const y = padT + graphH - (val / maxForecastMW) * graphH;
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
                Power (MW)
              </text>

              {/* Dashed Lines */}
              <polyline
                points={pointsForecastSolar}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.2"
                strokeDasharray="4,4"
                strokeLinecap="round"
              />
              <polyline
                points={pointsForecastWind}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeDasharray="4,4"
                strokeLinecap="round"
              />

              {/* X Axis labels */}
              {forecast24h.map((d, i, arr) => {
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
                <span className="legend-line dashed" style={{ borderColor: '#F59E0B' }} />
                <span>Solar (Forecast)</span>
              </div>
              <div className="legend-item">
                <span className="legend-line dashed" style={{ borderColor: '#10B981' }} />
                <span>Wind (Forecast)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Key Insights */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Key Insights</h3>
          </div>

          <div className="insights-list">
            {insights.map((item) => (
              <div key={item.id} className="insight-item">
                <div className={`insight-icon-pill ${item.icon}`}>
                  {item.icon === 'sun' && (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                    </svg>
                  )}
                  {item.icon === 'wind' && (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
                      <path d="M12.59 19.41A2 2 0 1 0 14 16H2" />
                    </svg>
                  )}
                  {item.icon === 'leaf' && (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    </svg>
                  )}
                </div>
                <p className="insight-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
