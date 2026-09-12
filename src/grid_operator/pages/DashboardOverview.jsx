import React from 'react';
import ApexChart from '../components/ApexChart.jsx';
import { gridOverviewData } from '../services/gridData.js';

export default function DashboardOverview({ onNavigate }) {
  const { kpis, hourlyLoadRenewable, energyMix } = gridOverviewData;

  // 1. Grid Load vs Renewable Generation Area Chart Options
  const lineChartOptions = {
    chart: {
      type: 'area',
      height: 185,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#059669', '#2563EB', '#06B6D4'],
    stroke: {
      curve: 'smooth',
      width: [2.5, 2, 1.8],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: hourlyLoadRenewable.map((d) => d.time),
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
        text: 'Power (MW)',
        style: { color: '#94A3B8', fontSize: '10px', fontWeight: 600 },
      },
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
        formatter: (val) => (val === 0 ? '0' : `${Math.round(val / 1000)}K`),
      },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `${val} MW`,
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: { radius: 2, width: 10, height: 10 },
      itemMargin: { horizontal: 12, vertical: 4 },
    },
  };

  const lineChartSeries = [
    {
      name: 'Grid Load',
      data: hourlyLoadRenewable.map((d) => d.gridLoad),
    },
    {
      name: 'Renewable Generation',
      data: hourlyLoadRenewable.map((d) => d.renewable),
    },
    {
      name: 'EV Charging Load',
      data: hourlyLoadRenewable.map((d) => d.evLoad),
    },
  ];

  // 2. Energy Mix (Current) Donut Chart Options
  const donutOptions = {
    chart: {
      type: 'donut',
      height: 185,
      fontFamily: 'Inter, sans-serif',
    },
    labels: energyMix.map((d) => d.name),
    colors: energyMix.map((d) => d.color),
    dataLabels: { enabled: false },
    stroke: { colors: ['#FFFFFF'], width: 2 },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'MW',
              fontSize: '11px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#64748B',
              formatter: () => '2,450',
            },
            value: {
              fontSize: '17px',
              fontWeight: 800,
              color: '#0F172A',
              offsetY: -4,
              formatter: () => '2,450',
            },
          },
        },
      },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    legend: {
      position: 'right',
      fontSize: '11.5px',
      markers: { radius: 2, width: 10, height: 10 },
      formatter: (seriesName, opts) => {
        const pct = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName} ${pct}%`;
      },
    },
  };

  const donutSeries = energyMix.map((d) => d.percent);

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

          <div style={{ minHeight: '195px' }}>
            <ApexChart
              options={lineChartOptions}
              series={lineChartSeries}
              type="area"
              height={195}
            />
          </div>
        </div>

        {/* Right Chart: Energy Mix (Current) */}
        <div className="grid-card">
          <div className="card-header-clean">
            <h3 className="card-title">Energy Mix (Current)</h3>
          </div>

          <div style={{ minHeight: '195px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ApexChart
              options={donutOptions}
              series={donutSeries}
              type="donut"
              height={195}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
