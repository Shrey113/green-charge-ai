import React from 'react';
import ApexChart from '../components/ApexChart.jsx';
import { evDemandData } from '../services/gridData.js';

export default function EVChargingDemandPage() {
  const { kpis, evLoadCurve, regionalEvLoads, topStations } = evDemandData;

  // 1. EV Charging Load Area Chart Options
  const evAreaOptions = {
    chart: {
      type: 'area',
      height: 180,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#10B981'],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
    },
    xaxis: {
      categories: evLoadCurve.map((d) => d.time),
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 600,
      tickAmount: 3,
      title: {
        text: 'Load (MW)',
        style: { color: '#94A3B8', fontSize: '10px', fontWeight: 600 },
      },
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
      },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val} MW` },
    },
  };

  const evAreaSeries = [
    {
      name: 'EV Load',
      data: evLoadCurve.map((d) => d.load),
    },
  ];

  // 2. Charging Load by Region Horizontal Bar Chart Options
  const barOptions = {
    chart: {
      type: 'bar',
      height: 180,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '52%',
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: ['#10B981'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val} MW`,
      offsetX: 28,
      style: {
        fontSize: '10.5px',
        fontWeight: 700,
        colors: ['#0F172A'],
      },
    },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    xaxis: {
      categories: regionalEvLoads.map((d) => d.region),
      max: 150,
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
        formatter: (val) => `${val} MW`,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#475569', fontSize: '11px', fontWeight: 500 },
      },
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => `${val} MW` },
    },
  };

  const barSeries = [
    {
      name: 'Load',
      data: regionalEvLoads.map((d) => d.load),
    },
  ];

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

          <div style={{ minHeight: '185px' }}>
            <ApexChart
              options={evAreaOptions}
              series={evAreaSeries}
              type="area"
              height={185}
            />
          </div>
        </div>

        {/* Right: Charging Load by Region */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Charging Load by Region</h3>
          </div>

          <div style={{ minHeight: '185px' }}>
            <ApexChart
              options={barOptions}
              series={barSeries}
              type="bar"
              height={185}
            />
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
