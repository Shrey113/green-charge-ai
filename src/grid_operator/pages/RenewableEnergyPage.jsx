import React from 'react';
import ApexChart from '../components/ApexChart.jsx';
import { renewableData } from '../services/gridData.js';

export default function RenewableEnergyPage() {
  const { kpis, generation24h, forecast24h, insights } = renewableData;

  // 1. Stacked Area Chart (Renewable Generation) Options
  const stackedGenOptions = {
    chart: {
      type: 'area',
      stacked: true,
      height: 175,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#FBBF24', '#34D399', '#60A5FA'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'solid',
      opacity: 0.85,
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
    },
    xaxis: {
      categories: generation24h.map((d) => d.time),
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 1000,
      tickAmount: 5,
      title: {
        text: 'Power (MW)',
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
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: { radius: 2, width: 10, height: 10 },
      itemMargin: { horizontal: 10, vertical: 4 },
    },
  };

  const stackedGenSeries = [
    { name: 'Solar', data: generation24h.map((d) => d.solar) },
    { name: 'Wind', data: generation24h.map((d) => d.wind) },
    { name: 'Hydro', data: generation24h.map((d) => d.hydro) },
  ];

  // 2. Renewable Share Radial Gauge Options
  const shareGaugeOptions = {
    chart: {
      type: 'radialBar',
      height: 165,
      sparkline: { enabled: true },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '62%' },
        track: { background: '#E2E8F0', strokeWidth: '100%' },
        dataLabels: {
          name: {
            show: true,
            fontSize: '9.5px',
            color: '#64748B',
            offsetY: 20,
            formatter: () => 'of total generation',
          },
          value: {
            fontSize: '24px',
            fontWeight: 800,
            color: '#065F46',
            offsetY: -10,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ['#047857'],
    stroke: { lineCap: 'round' },
    tooltip: { enabled: false },
  };

  const shareGaugeSeries = [kpis.generationSharePercent];

  // 3. Renewable Forecast Line Chart Options
  const forecastOptions = {
    chart: {
      type: 'line',
      height: 175,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#F59E0B', '#10B981'],
    stroke: {
      width: [2.5, 2.5],
      dashArray: [5, 5],
      curve: 'smooth',
    },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: forecast24h.map((d) => d.time),
      labels: {
        style: { colors: '#94A3B8', fontSize: '10px' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 1500,
      tickAmount: 3,
      title: {
        text: 'Power (MW)',
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
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: { radius: 2, width: 12, height: 3 },
      itemMargin: { horizontal: 12, vertical: 4 },
    },
  };

  const forecastSeries = [
    {
      name: 'Solar (Forecast)',
      data: forecast24h.map((d) => d.solarForecast),
    },
    {
      name: 'Wind (Forecast)',
      data: forecast24h.map((d) => d.windForecast),
    },
  ];

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

          <div style={{ minHeight: '185px' }}>
            <ApexChart
              options={stackedGenOptions}
              series={stackedGenSeries}
              type="area"
              height={185}
            />
          </div>
        </div>

        {/* Right: Renewable Share Gauge */}
        <div className="grid-card renewable-share-meter-card" style={{ justifyContent: 'center' }}>
          <div className="card-header-clean" style={{ width: '100%' }}>
            <h3 className="card-title">Renewable Share</h3>
          </div>

          <div style={{ width: '100%', height: '130px' }}>
            <ApexChart
              options={shareGaugeOptions}
              series={shareGaugeSeries}
              type="radialBar"
              height={150}
            />
          </div>

          <span className="renewable-bottom-sub" style={{ marginTop: '4px' }}>840 MW</span>
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

          <div style={{ minHeight: '185px' }}>
            <ApexChart
              options={forecastOptions}
              series={forecastSeries}
              type="line"
              height={185}
            />
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
