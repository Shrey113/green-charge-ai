import React, { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  // Dates for X-axis
  const dateLabels = ['Aug 15', 'Aug 22', 'Aug 29', 'Sep 5', 'Sep 12'];

  // 1. Energy Consumption data (kWh) ~ 0 to 150
  const energyData = [40, 65, 85, 110, 138];

  // 2. Charging Cost data (₹) ~ 0 to 300
  const costData = [160, 210, 240, 275, 290];

  // 3. Renewable Share data (%) ~ 0 to 100
  const renewableData = [55, 68, 62, 79, 85];

  // 4. Charging Sessions data ~ 0 to 20
  const sessionsData = [8, 11, 14, 16, 19];

  return (
    <div className="customer-page-content analytics-page">
      {/* 1. Header Filter Bar */}
      <div className="analytics-filter-row">
        <div className="analytics-filter-select-wrap">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="analytics-filter-select"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="This Year">This Year</option>
          </select>
          <span className="select-chevron">▾</span>
        </div>
      </div>

      {/* 2. Top KPI Cards (4) */}
      <div className="customer-kpi-grid">
        {/* Energy Charged */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap energy-green-wrap">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#10B981">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">812 kWh</span>
            <span className="kpi-label">Energy Charged</span>
          </div>
        </div>

        {/* Money Saved */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap cost-amber-wrap">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 8h6M8 11.5h4.5M10 11.5c2 0 3.5 1.2 3.5 3s-1.5 3-3.5 3M11.5 14.5l3.5 4" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">₹620</span>
            <span className="kpi-label">Money Saved</span>
          </div>
        </div>

        {/* CO2 Reduced */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap co2-green-wrap">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">276 kg</span>
            <span className="kpi-label">CO2 Reduced</span>
          </div>
        </div>

        {/* Renewable Share */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap ren-radial-wrap">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10B981" strokeWidth="2">
              <circle cx="12" cy="12" r="9" stroke="#E2E8F0" />
              <path d="M12 3a9 9 0 0 1 7.8 13.5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">74%</span>
            <span className="kpi-label">Renewable Share</span>
          </div>
        </div>
      </div>

      {/* 3. 2x2 Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Chart 1: Energy Consumption (kWh) */}
        <div className="customer-card chart-tile">
          <h4 className="chart-tile-title">Energy Consumption (kWh)</h4>
          <div className="chart-svg-wrap">
            <svg viewBox="0 0 320 140" className="analytics-svg" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="30" y1="20" x2="300" y2="20" stroke="#F1F5F9" />
              <line x1="30" y1="55" x2="300" y2="55" stroke="#F1F5F9" />
              <line x1="30" y1="90" x2="300" y2="90" stroke="#F1F5F9" />
              <line x1="30" y1="120" x2="300" y2="120" stroke="#E2E8F0" />

              {/* Y Axis labels */}
              <text x="24" y="24" className="chart-axis-lbl" textAnchor="end">150</text>
              <text x="24" y="59" className="chart-axis-lbl" textAnchor="end">100</text>
              <text x="24" y="94" className="chart-axis-lbl" textAnchor="end">50</text>
              <text x="24" y="123" className="chart-axis-lbl" textAnchor="end">0</text>

              {/* Bars (Emerald Green) */}
              {energyData.map((val, idx) => {
                const barH = (val / 150) * 100;
                const x = 52 + idx * 52;
                const y = 120 - barH;
                return (
                  <rect
                    key={`ec-${idx}`}
                    x={x}
                    y={y}
                    width="22"
                    height={barH}
                    rx="3"
                    fill="#10B981"
                  />
                );
              })}

              {/* X Axis labels */}
              {dateLabels.map((lbl, idx) => {
                const x = 63 + idx * 52;
                return (
                  <text key={lbl} x={x} y="134" className="chart-axis-lbl" textAnchor="middle">
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 2: Charging Cost (₹) */}
        <div className="customer-card chart-tile">
          <h4 className="chart-tile-title">Charging Cost (₹)</h4>
          <div className="chart-svg-wrap">
            <svg viewBox="0 0 320 140" className="analytics-svg" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="30" y1="20" x2="300" y2="20" stroke="#F1F5F9" />
              <line x1="30" y1="55" x2="300" y2="55" stroke="#F1F5F9" />
              <line x1="30" y1="90" x2="300" y2="90" stroke="#F1F5F9" />
              <line x1="30" y1="120" x2="300" y2="120" stroke="#E2E8F0" />

              {/* Y Axis labels */}
              <text x="24" y="24" className="chart-axis-lbl" textAnchor="end">300</text>
              <text x="24" y="59" className="chart-axis-lbl" textAnchor="end">200</text>
              <text x="24" y="94" className="chart-axis-lbl" textAnchor="end">100</text>
              <text x="24" y="123" className="chart-axis-lbl" textAnchor="end">0</text>

              {/* Bars (Blue) */}
              {costData.map((val, idx) => {
                const barH = (val / 300) * 100;
                const x = 52 + idx * 52;
                const y = 120 - barH;
                return (
                  <rect
                    key={`cc-${idx}`}
                    x={x}
                    y={y}
                    width="22"
                    height={barH}
                    rx="3"
                    fill="#3B82F6"
                  />
                );
              })}

              {/* X Axis labels */}
              {dateLabels.map((lbl, idx) => {
                const x = 63 + idx * 52;
                return (
                  <text key={lbl} x={x} y="134" className="chart-axis-lbl" textAnchor="middle">
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 3: Renewable Energy Share (%) */}
        <div className="customer-card chart-tile">
          <h4 className="chart-tile-title">Renewable Energy Share (%)</h4>
          <div className="chart-svg-wrap">
            <svg viewBox="0 0 320 140" className="analytics-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="renAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="30" y1="20" x2="300" y2="20" stroke="#F1F5F9" />
              <line x1="30" y1="45" x2="300" y2="45" stroke="#F1F5F9" />
              <line x1="30" y1="70" x2="300" y2="70" stroke="#F1F5F9" />
              <line x1="30" y1="95" x2="300" y2="95" stroke="#F1F5F9" />
              <line x1="30" y1="120" x2="300" y2="120" stroke="#E2E8F0" />

              {/* Y Axis labels */}
              <text x="24" y="24" className="chart-axis-lbl" textAnchor="end">100</text>
              <text x="24" y="49" className="chart-axis-lbl" textAnchor="end">75</text>
              <text x="24" y="74" className="chart-axis-lbl" textAnchor="end">50</text>
              <text x="24" y="99" className="chart-axis-lbl" textAnchor="end">25</text>
              <text x="24" y="123" className="chart-axis-lbl" textAnchor="end">0</text>

              {/* Area fill path */}
              <path
                d={
                  renewableData.reduce((acc, val, idx) => {
                    const x = 63 + idx * 52;
                    const y = 120 - (val / 100) * 100;
                    return idx === 0 ? `M ${x} 120 L ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '') + ' L 271 120 Z'
                }
                fill="url(#renAreaGrad)"
              />

              {/* Line path */}
              <path
                d={
                  renewableData.reduce((acc, val, idx) => {
                    const x = 63 + idx * 52;
                    const y = 120 - (val / 100) * 100;
                    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                  }, '')
                }
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {renewableData.map((val, idx) => {
                const x = 63 + idx * 52;
                const y = 120 - (val / 100) * 100;
                return (
                  <circle
                    key={`pt-${idx}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#FFFFFF"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                );
              })}

              {/* X Axis labels */}
              {dateLabels.map((lbl, idx) => {
                const x = 63 + idx * 52;
                return (
                  <text key={lbl} x={x} y="134" className="chart-axis-lbl" textAnchor="middle">
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Chart 4: Charging Sessions */}
        <div className="customer-card chart-tile">
          <h4 className="chart-tile-title">Charging Sessions</h4>
          <div className="chart-svg-wrap">
            <svg viewBox="0 0 320 140" className="analytics-svg" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="30" y1="20" x2="300" y2="20" stroke="#F1F5F9" />
              <line x1="30" y1="55" x2="300" y2="55" stroke="#F1F5F9" />
              <line x1="30" y1="90" x2="300" y2="90" stroke="#F1F5F9" />
              <line x1="30" y1="120" x2="300" y2="120" stroke="#E2E8F0" />

              {/* Y Axis labels */}
              <text x="24" y="24" className="chart-axis-lbl" textAnchor="end">20</text>
              <text x="24" y="59" className="chart-axis-lbl" textAnchor="end">15</text>
              <text x="24" y="94" className="chart-axis-lbl" textAnchor="end">10</text>
              <text x="24" y="123" className="chart-axis-lbl" textAnchor="end">0</text>

              {/* Bars (Purple / Violet) */}
              {sessionsData.map((val, idx) => {
                const barH = (val / 20) * 100;
                const x = 52 + idx * 52;
                const y = 120 - barH;
                return (
                  <rect
                    key={`cs-${idx}`}
                    x={x}
                    y={y}
                    width="22"
                    height={barH}
                    rx="3"
                    fill="#A855F7"
                  />
                );
              })}

              {/* X Axis labels */}
              {dateLabels.map((lbl, idx) => {
                const x = 63 + idx * 52;
                return (
                  <text key={lbl} x={x} y="134" className="chart-axis-lbl" textAnchor="middle">
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Bottom Achievement Banner */}
      <div className="analytics-achievement-banner">
        <div className="achievement-leaf-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#10B981">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
          </svg>
        </div>
        <p className="achievement-text">
          You're doing great! You've used <strong>74% renewable energy</strong> this month.
        </p>
      </div>
    </div>
  );
}
