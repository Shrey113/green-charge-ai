import React, { useState } from 'react';
import ApexChart from '../components/ApexChart.jsx';
import { analyticsAlertsData } from '../services/gridData.js';

export default function AnalyticsAlertsPage() {
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const { kpis, gridLoadTrend, renewableTrend, recentAlerts } = analyticsAlertsData;

  // 1. Grid Load Trend Area Chart Options
  const gridLoadTrendOptions = {
    chart: {
      type: 'area',
      height: 180,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#059669'],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 4,
      colors: ['#059669'],
      strokeColors: '#FFFFFF',
      strokeWidth: 1.5,
      hover: { size: 6 },
    },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: gridLoadTrend.map((d) => d.date),
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 4000,
      tickAmount: 4,
      title: {
        text: 'Load (MW)',
        style: { color: '#94A3B8', fontSize: '10px', fontWeight: 600 },
      },
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
        formatter: (val) => (val === 0 ? '0' : `${Math.round(val / 1000)}K`),
      },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val} MW` },
    },
  };

  const gridLoadTrendSeries = [
    {
      name: 'Grid Load',
      data: gridLoadTrend.map((d) => d.load),
    },
  ];

  // 2. Renewable Share Trend Line Chart Options
  const renTrendOptions = {
    chart: {
      type: 'line',
      height: 180,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#10B981'],
    stroke: { curve: 'smooth', width: 2.5 },
    markers: {
      size: 4,
      colors: ['#10B981'],
      strokeColors: '#FFFFFF',
      strokeWidth: 1.5,
      hover: { size: 6 },
    },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: renewableTrend.map((d) => d.date),
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 80,
      tickAmount: 4,
      title: {
        text: '%',
        style: { color: '#94A3B8', fontSize: '10px', fontWeight: 600 },
      },
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
      },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val}%` },
    },
  };

  const renTrendSeries = [
    {
      name: 'Renewable Share',
      data: renewableTrend.map((d) => d.share),
    },
  ];

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
            <button type="button" className="analytics-header-filter-btn">
              <span>{timeRange}</span>
              <span>▾</span>
            </button>
          </div>

          <div style={{ minHeight: '185px' }}>
            <ApexChart
              options={gridLoadTrendOptions}
              series={gridLoadTrendSeries}
              type="area"
              height={185}
            />
          </div>
        </div>

        {/* Right: Renewable Share Trend */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Renewable Share Trend</h3>
          </div>

          <div style={{ minHeight: '185px' }}>
            <ApexChart
              options={renTrendOptions}
              series={renTrendSeries}
              type="line"
              height={185}
            />
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
