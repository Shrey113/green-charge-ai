import React, { useState } from 'react';
import { forecastData } from '../services/gridData.js';

export default function ForecastSchedulingPage() {
  const [forecastType, setForecastType] = useState('Grid Load');
  const [timeHorizon, setTimeHorizon] = useState('Next 24 Hours');
  const { impact, gridLoadForecast, loadBreakdown } = forecastData;

  // Forecast Chart Dimensions & Points
  const chartW = 460;
  const chartH = 175;
  const padL = 38;
  const padR = 15;
  const padT = 15;
  const padB = 25;
  const graphW = chartW - padL - padR;
  const graphH = chartH - padT - padB;
  const maxLoad = 4000;

  // Actual load line points (up to index 6 / 12:00)
  const actualData = gridLoadForecast.filter((d) => d.actual !== null);
  const pointsActual = actualData.map((d) => {
    const origIndex = gridLoadForecast.findIndex((item) => item.time === d.time);
    const x = padL + (origIndex / (gridLoadForecast.length - 1)) * graphW;
    const y = padT + graphH - (d.actual / maxLoad) * graphH;
    return `${x},${y}`;
  }).join(' ');

  // Forecasted No Opt (from index 6 to 12)
  const noOptData = gridLoadForecast.filter((d) => d.noOpt !== null);
  const pointsNoOpt = noOptData.map((d) => {
    const origIndex = gridLoadForecast.findIndex((item) => item.time === d.time);
    const x = padL + (origIndex / (gridLoadForecast.length - 1)) * graphW;
    const y = padT + graphH - (d.noOpt / maxLoad) * graphH;
    return `${x},${y}`;
  }).join(' ');

  // Forecasted With Opt (from index 6 to 12)
  const withOptData = gridLoadForecast.filter((d) => d.withOpt !== null);
  const pointsWithOpt = withOptData.map((d) => {
    const origIndex = gridLoadForecast.findIndex((item) => item.time === d.time);
    const x = padL + (origIndex / (gridLoadForecast.length - 1)) * graphW;
    const y = padT + graphH - (d.withOpt / maxLoad) * graphH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="grid-page-content forecast-scheduling-page">
      {/* 1. FILTER TOOLBAR */}
      <div className="grid-filter-toolbar">
        <div className="filter-control-group">
          <span className="filter-label">Forecast Type</span>
          <select
            value={forecastType}
            onChange={(e) => setForecastType(e.target.value)}
            className="filter-select"
          >
            <option value="Grid Load">Grid Load</option>
            <option value="EV Demand">EV Demand</option>
            <option value="Renewable Availability">Renewable Availability</option>
          </select>
        </div>

        <div className="filter-control-group">
          <span className="filter-label">Time Horizon</span>
          <select
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(e.target.value)}
            className="filter-select"
          >
            <option value="Next 24 Hours">Next 24 Hours</option>
            <option value="Next 48 Hours">Next 48 Hours</option>
            <option value="Next 7 Days">Next 7 Days</option>
          </select>
        </div>

        <div className="filter-date-pill">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Sep 12, 2026</span>
        </div>
      </div>

      {/* 2. TOP ROW: Grid Load Forecast Comparison & Impact Metrics */}
      <div className="grid-row-2col-70-30">
        {/* Left: Grid Load Forecast Line Chart */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Grid Load Forecast</h3>
          </div>

          <div className="chart-container-svg">
            <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="165">
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

              {/* Solid Actual Load */}
              <polyline
                points={pointsActual}
                fill="none"
                stroke="#0D9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dashed No Optimization (Red) */}
              <polyline
                points={pointsNoOpt}
                fill="none"
                stroke="#EF4444"
                strokeWidth="2.2"
                strokeDasharray="4,4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dashed With Optimization (Teal) */}
              <polyline
                points={pointsWithOpt}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeDasharray="4,4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* X Axis labels */}
              {gridLoadForecast.filter((_, idx) => idx % 2 === 0).map((d, i, arr) => {
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
                <span className="legend-line" style={{ backgroundColor: '#0D9488' }} />
                <span>Actual Load</span>
              </div>
              <div className="legend-item">
                <span className="legend-line dashed" style={{ borderColor: '#EF4444' }} />
                <span>Forecasted Load (No Optimization)</span>
              </div>
              <div className="legend-item">
                <span className="legend-line dashed" style={{ borderColor: '#10B981' }} />
                <span>Forecasted Load (With Optimization)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Impact of EV Optimization */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Impact of EV Optimization</h3>
          </div>

          <div className="impact-metrics-vertical">
            {/* Metric 1 */}
            <div className="impact-metric-row">
              <div className="impact-metric-left">
                <div className="impact-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                </div>
                <span className="impact-metric-title">Peak Load Reduction</span>
              </div>
              <span className="impact-metric-val">{impact.peakLoadReduction}</span>
            </div>

            {/* Metric 2 */}
            <div className="impact-metric-row">
              <div className="impact-metric-left">
                <div className="impact-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" />
                    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" />
                    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                  </svg>
                </div>
                <span className="impact-metric-title">Load Shifted</span>
              </div>
              <span className="impact-metric-val" style={{ color: '#0F172A', fontSize: '13px' }}>
                {impact.loadShifted}
              </span>
            </div>

            {/* Metric 3 */}
            <div className="impact-metric-row">
              <div className="impact-metric-left">
                <div className="impact-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </div>
                <span className="impact-metric-title">Renewable Utilization</span>
              </div>
              <span className="impact-metric-val">{impact.renewableUtilization}</span>
            </div>

            {/* Metric 4 */}
            <div className="impact-metric-row">
              <div className="impact-metric-left">
                <div className="impact-icon-circle">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <span className="impact-metric-title">Grid Stress</span>
              </div>
              <span className="impact-metric-val">{impact.gridStress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Load Breakdown (Forecasted) Stacked Bar Chart */}
      <div className="grid-card">
        <div className="card-header-clean">
          <h3 className="card-title">Load Breakdown (Forecasted)</h3>
        </div>

        <div className="chart-container-svg">
          <svg viewBox="0 0 650 165" width="100%" height="160">
            {/* Y Axis ticks */}
            {[0, 1000, 2000, 3000, 4000].map((val) => {
              const y = padT + graphH - (val / maxLoad) * graphH;
              const label = val === 0 ? '0' : `${val / 1000}K`;
              return (
                <g key={val}>
                  <line x1={padL} y1={y} x2={635} y2={y} stroke="#F1F5F9" strokeWidth="1" />
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

            {/* Stacked Bars */}
            {loadBreakdown.map((item, idx) => {
              const barWidth = 24;
              const x = padL + 15 + idx * 46;
              const baseH = (item.base / maxLoad) * graphH;
              const evH = (item.ev / maxLoad) * graphH;
              const otherH = (item.other / maxLoad) * graphH;

              const yBase = padT + graphH - baseH;
              const yEv = yBase - evH;
              const yOther = yEv - otherH;

              return (
                <g key={item.time}>
                  {/* Base Load Bar (Blue) */}
                  <rect
                    x={x}
                    y={yBase}
                    width={barWidth}
                    height={baseH}
                    fill="#60A5FA"
                    rx="1"
                  />
                  {/* EV Charging Bar (Green) */}
                  <rect
                    x={x}
                    y={yEv}
                    width={barWidth}
                    height={evH}
                    fill="#10B981"
                    rx="1"
                  />
                  {/* Other Load Bar (Teal) */}
                  <rect
                    x={x}
                    y={yOther}
                    width={barWidth}
                    height={otherH}
                    fill="#2DD4BF"
                    rx="1"
                  />

                  {/* X Axis Label */}
                  <text
                    x={x + barWidth / 2}
                    y={padT + graphH + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#94A3B8"
                  >
                    {item.time}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="chart-legend-row" style={{ marginTop: '8px' }}>
            <div className="legend-item">
              <span className="legend-square" style={{ backgroundColor: '#60A5FA' }} />
              <span>Base Load</span>
            </div>
            <div className="legend-item">
              <span className="legend-square" style={{ backgroundColor: '#10B981' }} />
              <span>EV Charging (Optimized)</span>
            </div>
            <div className="legend-item">
              <span className="legend-square" style={{ backgroundColor: '#2DD4BF' }} />
              <span>Other Load</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
