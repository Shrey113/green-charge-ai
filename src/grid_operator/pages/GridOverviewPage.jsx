import React, { useState } from 'react';
import GujaratMap from '../components/GujaratMap.jsx';
import ApexChart from '../components/ApexChart.jsx';
import { regionalData } from '../services/gridData.js';

export default function GridOverviewPage() {
  const [selectedRegion, setSelectedRegion] = useState('Gujarat');
  const [selectedRange, setSelectedRange] = useState('Last 24 Hours');
  const { healthScore, healthStatus, healthSubtitle, regions } = regionalData;

  // ApexCharts RadialBar Options for Grid Health Gauge
  const gaugeOptions = {
    chart: {
      type: 'radialBar',
      height: 180,
      sparkline: { enabled: true },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      radialBar: {
        startAngle: -125,
        endAngle: 125,
        hollow: { size: '65%' },
        track: {
          background: '#E2E8F0',
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '12px',
            color: '#64748B',
            offsetY: 22,
            formatter: () => '/ 100',
          },
          value: {
            fontSize: '28px',
            fontWeight: 800,
            color: '#065F46',
            offsetY: -12,
            formatter: (val) => `${val}`,
          },
        },
      },
    },
    colors: ['#10B981'],
    stroke: { lineCap: 'round' },
    tooltip: { enabled: false },
  };

  const gaugeSeries = [healthScore];

  return (
    <div className="grid-page-content grid-overview-page">
      {/* Top Filter Toolbar */}
      <div className="grid-filter-toolbar">
        <div className="filter-control-group">
          <span className="filter-label">Region</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="filter-select"
          >
            <option value="Gujarat">Gujarat</option>
            <option value="Central Gujarat">Central Gujarat</option>
            <option value="Saurashtra">Saurashtra</option>
            <option value="North Gujarat">North Gujarat</option>
            <option value="South Gujarat">South Gujarat</option>
            <option value="Kutch">Kutch</option>
          </select>
        </div>

        <div className="filter-control-group">
          <span className="filter-label">Time Range</span>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="filter-select"
          >
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
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

      {/* Top Section: Map & Grid Health Gauge */}
      <div className="grid-row-2col-70-30">
        {/* Left: Grid Load by Region (Gujarat) */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Grid Load by Region (Gujarat)</h3>
          </div>
          <GujaratMap regions={regions} />
        </div>

        {/* Right: Grid Health */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Grid Health</h3>
          </div>
          <div className="health-gauge-wrap" style={{ height: 'auto', minHeight: '230px' }}>
            <div style={{ width: '100%', height: '150px' }}>
              <ApexChart
                options={gaugeOptions}
                series={gaugeSeries}
                type="radialBar"
                height={170}
              />
            </div>
            <h4 className="health-status-title" style={{ marginTop: '10px' }}>{healthStatus}</h4>
            <p className="health-status-desc">{healthSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Regional Load Details Table */}
      <div className="grid-card">
        <div className="card-header-clean">
          <h3 className="card-title">Regional Load Details</h3>
        </div>

        <div className="grid-table-wrap">
          <table className="grid-table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Current Load</th>
                <th>Capacity</th>
                <th>Utilization</th>
                <th>Renewable Share</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((reg) => (
                <tr key={reg.id}>
                  <td style={{ fontWeight: 600 }}>{reg.name}</td>
                  <td>{reg.load}</td>
                  <td>{reg.capacity}</td>
                  <td>{reg.utilization}</td>
                  <td>{reg.renewableShare}</td>
                  <td>
                    <span className="pill-badge status-stable">{reg.status}</span>
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
