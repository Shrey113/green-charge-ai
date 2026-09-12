import React, { useState, useMemo } from 'react';
import ApexChartSafe from '../components/ApexChartSafe.jsx';
import { historyAnalyticsData } from '../services/customerChartData.js';

export default function ChargingHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [metricFilter, setMetricFilter] = useState('All'); // 'All' | 'Energy' | 'Cost'

  const historyData = [
    {
      id: 1,
      date: 'Sep 12, 2026',
      station: 'Gandhinagar Central',
      energy: '32',
      cost: '₹256',
      renewable: '78%',
      status: 'Completed',
    },
    {
      id: 2,
      date: 'Sep 10, 2026',
      station: 'DAIICT Station',
      energy: '28',
      cost: '₹210',
      renewable: '85%',
      status: 'Completed',
    },
    {
      id: 3,
      date: 'Sep 08, 2026',
      station: 'SG Highway',
      energy: '45',
      cost: '₹360',
      renewable: '62%',
      status: 'Completed',
    },
    {
      id: 4,
      date: 'Sep 05, 2026',
      station: 'City Center',
      energy: '26',
      cost: '₹208',
      renewable: '74%',
      status: 'Completed',
    },
    {
      id: 5,
      date: 'Sep 02, 2026',
      station: 'Gandhinagar Central',
      energy: '40',
      cost: '₹300',
      renewable: '81%',
      status: 'Completed',
    },
    {
      id: 6,
      date: 'Aug 30, 2026',
      station: 'Airport Station',
      energy: '38',
      cost: '₹285',
      renewable: '69%',
      status: 'Completed',
    },
    {
      id: 7,
      date: 'Aug 28, 2026',
      station: 'SG Highway',
      energy: '22',
      cost: '₹165',
      renewable: '77%',
      status: 'Completed',
    },
  ];

  // Memoized session trend chart
  const trendOptions = useMemo(() => ({
    chart: {
      height: 220,
      type: 'line',
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#10B981', '#3B82F6'],
    stroke: { curve: 'smooth', width: [3, 2.5] },
    plotOptions: {
      bar: { columnWidth: '35%', borderRadius: 4 },
    },
    xaxis: {
      categories: historyAnalyticsData.sessions.map((s) => s.date),
      labels: { style: { colors: '#94A3B8', fontSize: '10px' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: [
      {
        title: { text: 'Energy (kWh)', style: { color: '#10B981', fontSize: '10px', fontWeight: 600 } },
        min: 0,
        max: 60,
        labels: {
          style: { colors: '#64748B', fontSize: '9px' },
          formatter: (v) => `${v} kWh`,
        },
      },
      {
        opposite: true,
        title: { text: 'Cost (₹)', style: { color: '#3B82F6', fontSize: '10px', fontWeight: 600 } },
        min: 0,
        max: 450,
        labels: {
          style: { colors: '#64748B', fontSize: '9px' },
          formatter: (v) => `₹${v}`,
        },
      },
    ],
    tooltip: {
      shared: true,
      y: {
        formatter: (val, { seriesIndex }) => {
          if (typeof val === 'undefined') return val;
          return seriesIndex === 0 ? `${val} kWh` : `₹${val}`;
        },
      },
    },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '10px' },
    grid: { borderColor: '#F1F5F9', strokeDashArray: 3 },
  }), []);

  const trendSeries = useMemo(() => {
    const energyItem = {
      name: 'Energy Charged (kWh)',
      type: 'column',
      data: historyAnalyticsData.sessions.map((s) => s.energy),
    };
    const costItem = {
      name: 'Cost Paid (₹)',
      type: 'line',
      data: historyAnalyticsData.sessions.map((s) => s.cost),
    };

    if (metricFilter === 'Energy') return [energyItem];
    if (metricFilter === 'Cost') return [costItem];
    return [energyItem, costItem];
  }, [metricFilter]);

  // Memoized station distribution Donut chart
  const donutOptions = useMemo(() => ({
    chart: {
      type: 'donut',
      height: 220,
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, speed: 600 },
    },
    labels: historyAnalyticsData.stationDistribution.labels,
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'],
    stroke: { width: 2, colors: ['#FFFFFF'] },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Energy',
              fontSize: '11px',
              fontWeight: 500,
              color: '#64748B',
              formatter: () => '812 kWh',
            },
            value: {
              fontSize: '16px',
              fontWeight: 700,
              color: '#0F172A',
            },
          },
        },
      },
    },
    legend: {
      position: 'bottom',
      fontSize: '10px',
      markers: { size: 4 },
      itemMargin: { horizontal: 6, vertical: 2 },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} kWh charged`,
      },
    },
    dataLabels: { enabled: false },
  }), []);

  return (
    <div className="customer-page-content charging-history-page">
      {/* 1. TOP ROW: 4 KPI CARDS */}
      <div className="customer-kpi-grid">
        {/* Total Sessions */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap sessions-blue-wrap">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">24</span>
            <span className="kpi-label">Total Sessions</span>
          </div>
        </div>

        {/* Total Energy */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap energy-green-wrap">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#10B981">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">812 kWh</span>
            <span className="kpi-label">Total Energy</span>
          </div>
        </div>

        {/* Total Cost */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap cost-amber-wrap">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M8 8h6M8 11.5h4.5M10 11.5c2 0 3.5 1.2 3.5 3s-1.5 3-3.5 3M11.5 14.5l3.5 4" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">₹3,420</span>
            <span className="kpi-label">Total Cost</span>
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
      </div>

      {/* 2. DYNAMIC CHARTS: Session Trend & Station Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {/* Session Energy & Cost Trend */}
        <div className="customer-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              Charging Sessions Trend
            </h4>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['All', 'Energy', 'Cost'].map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setMetricFilter(pill)}
                  style={{
                    border: 'none',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: metricFilter === pill ? '#10B981' : '#F1F5F9',
                    color: metricFilter === pill ? '#FFFFFF' : '#64748B',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
          <ApexChartSafe
            options={trendOptions}
            series={trendSeries}
            type="line"
            height={220}
            width="100%"
          />
        </div>

        {/* Station Share Donut Chart */}
        <div className="customer-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
              Energy Distribution by Station
            </h4>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>Total 812 kWh</span>
          </div>
          <ApexChartSafe
            options={donutOptions}
            series={historyAnalyticsData.stationDistribution.series}
            type="donut"
            height={220}
            width="100%"
          />
        </div>
      </div>

      {/* 3. TABLE CARD */}
      <div className="customer-card history-table-card">
        <div className="history-table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Station</th>
                <th>Energy (kWh)</th>
                <th>Cost (₹)</th>
                <th>Renewable Share</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row) => (
                <tr key={row.id}>
                  <td className="cell-date">{row.date}</td>
                  <td className="cell-station">{row.station}</td>
                  <td className="cell-energy">{row.energy}</td>
                  <td className="cell-cost">{row.cost}</td>
                  <td className="cell-renewable">{row.renewable}</td>
                  <td className="cell-status">
                    <span className="history-status-pill">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="history-pagination-row">
          <div className="pagination-controls">
            <button
              type="button"
              className="page-nav-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            <button
              type="button"
              className={`page-num-btn ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              type="button"
              className={`page-num-btn ${currentPage === 2 ? 'active' : ''}`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button
              type="button"
              className={`page-num-btn ${currentPage === 3 ? 'active' : ''}`}
              onClick={() => setCurrentPage(3)}
            >
              3
            </button>
            <button
              type="button"
              className="page-nav-btn"
              disabled={currentPage === 3}
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
