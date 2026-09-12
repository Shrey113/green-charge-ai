import React, { useState } from 'react';
import ApexChart from '../components/ApexChart.jsx';
import { forecastData } from '../services/gridData.js';

export default function ForecastSchedulingPage() {
  const [forecastType, setForecastType] = useState('Grid Load');
  const [timeHorizon, setTimeHorizon] = useState('Next 24 Hours');
  const { impact, gridLoadForecast, loadBreakdown } = forecastData;

  // 1. Grid Load Forecast Line Chart Options
  const forecastLineOptions = {
    chart: {
      type: 'line',
      height: 185,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#0D9488', '#EF4444', '#10B981'],
    stroke: {
      width: [2.5, 2.2, 2.2],
      dashArray: [0, 5, 5],
      curve: 'smooth',
    },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: gridLoadForecast.map((d) => d.time),
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
      y: {
        formatter: (val) => (val !== null && val !== undefined ? `${val} MW` : '-'),
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: { radius: 2, width: 12, height: 3 },
      itemMargin: { horizontal: 12, vertical: 4 },
    },
  };

  const forecastLineSeries = [
    {
      name: 'Actual Load',
      data: gridLoadForecast.map((d) => d.actual),
    },
    {
      name: 'Forecasted Load (No Optimization)',
      data: gridLoadForecast.map((d) => d.noOpt),
    },
    {
      name: 'Forecasted Load (With Optimization)',
      data: gridLoadForecast.map((d) => d.withOpt),
    },
  ];

  // 2. Load Breakdown (Forecasted) Stacked Bar Chart Options
  const stackedBarOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 185,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '45%',
      },
    },
    colors: ['#60A5FA', '#10B981', '#2DD4BF'],
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 2,
    },
    xaxis: {
      categories: loadBreakdown.map((d) => d.time),
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
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '11px',
      markers: { radius: 2, width: 10, height: 10 },
      itemMargin: { horizontal: 12, vertical: 4 },
    },
  };

  const stackedBarSeries = [
    {
      name: 'Base Load',
      data: loadBreakdown.map((d) => d.base),
    },
    {
      name: 'EV Charging (Optimized)',
      data: loadBreakdown.map((d) => d.ev),
    },
    {
      name: 'Other Load',
      data: loadBreakdown.map((d) => d.other),
    },
  ];

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

          <div style={{ minHeight: '190px' }}>
            <ApexChart
              options={forecastLineOptions}
              series={forecastLineSeries}
              type="line"
              height={190}
            />
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

        <div style={{ minHeight: '190px' }}>
          <ApexChart
            options={stackedBarOptions}
            series={stackedBarSeries}
            type="bar"
            height={190}
          />
        </div>
      </div>
    </div>
  );
}
