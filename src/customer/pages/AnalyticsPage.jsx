import React, { useState, useMemo } from 'react';
import ApexChartSafe from '../components/ApexChartSafe.jsx';
import { analyticsDatasets } from '../services/customerChartData.js';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  // Active dataset driven by time range selection
  const currentData = analyticsDatasets[timeRange] || analyticsDatasets['Last 30 Days'];

  // Base options template for clean consistency
  const baseChartOptions = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: true, speed: 500 },
      fontFamily: 'Inter, sans-serif',
    },
    grid: { borderColor: '#F1F5F9', strokeDashArray: 3 },
  };

  // 1. Energy Consumption Chart
  const energyOptions = useMemo(() => ({
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'bar', height: 160 },
    colors: ['#10B981'],
    plotOptions: {
      bar: { columnWidth: '40%', borderRadius: 4 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.95,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: currentData.labels,
      labels: { style: { colors: '#94A3B8', fontSize: '10px' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '9px' },
        formatter: (v) => `${Math.round(v)}`,
      },
    },
    tooltip: {
      y: { formatter: (v) => `${v} kWh` },
    },
  }), [currentData]);

  // 2. Charging Cost Chart
  const costOptions = useMemo(() => ({
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'bar', height: 160 },
    colors: ['#3B82F6'],
    plotOptions: {
      bar: { columnWidth: '40%', borderRadius: 4 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.95,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: currentData.labels,
      labels: { style: { colors: '#94A3B8', fontSize: '10px' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '9px' },
        formatter: (v) => `₹${Math.round(v)}`,
      },
    },
    tooltip: {
      y: { formatter: (v) => `₹${v}` },
    },
  }), [currentData]);

  // 3. Renewable Share Chart
  const renewableOptions = useMemo(() => ({
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'area', height: 160 },
    colors: ['#10B981'],
    stroke: { curve: 'smooth', width: 2.5 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: currentData.labels,
      labels: { style: { colors: '#94A3B8', fontSize: '10px' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: '#64748B', fontSize: '9px' },
        formatter: (v) => `${v}%`,
      },
    },
    tooltip: {
      y: { formatter: (v) => `${v}% clean energy` },
    },
  }), [currentData]);

  // 4. Charging Sessions Chart
  const sessionsOptions = useMemo(() => ({
    ...baseChartOptions,
    chart: { ...baseChartOptions.chart, type: 'bar', height: 160 },
    colors: ['#8B5CF6'],
    plotOptions: {
      bar: { columnWidth: '40%', borderRadius: 4 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.95,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: currentData.labels,
      labels: { style: { colors: '#94A3B8', fontSize: '10px' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B', fontSize: '9px' },
        formatter: (v) => `${Math.round(v)}`,
      },
    },
    tooltip: {
      y: { formatter: (v) => `${v} sessions` },
    },
  }), [currentData]);

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
          <div className="chart-svg-wrap" style={{ height: '160px' }}>
            <ApexChartSafe
              options={energyOptions}
              series={[{ name: 'Energy (kWh)', data: currentData.energy }]}
              type="bar"
              height={160}
              width="100%"
            />
          </div>
        </div>

        {/* Chart 2: Charging Cost (₹) */}
        <div className="customer-card chart-tile">
          <h4 className="chart-tile-title">Charging Cost (₹)</h4>
          <div className="chart-svg-wrap" style={{ height: '160px' }}>
            <ApexChartSafe
              options={costOptions}
              series={[{ name: 'Cost (₹)', data: currentData.cost }]}
              type="bar"
              height={160}
              width="100%"
            />
          </div>
        </div>

        {/* Chart 3: Renewable Energy Share (%) */}
        <div className="customer-card chart-tile">
          <h4 className="chart-tile-title">Renewable Energy Share (%)</h4>
          <div className="chart-svg-wrap" style={{ height: '160px' }}>
            <ApexChartSafe
              options={renewableOptions}
              series={[{ name: 'Renewable Share', data: currentData.renewable }]}
              type="area"
              height={160}
              width="100%"
            />
          </div>
        </div>

        {/* Chart 4: Charging Sessions */}
        <div className="customer-card chart-tile">
          <h4 className="chart-tile-title">Charging Sessions</h4>
          <div className="chart-svg-wrap" style={{ height: '160px' }}>
            <ApexChartSafe
              options={sessionsOptions}
              series={[{ name: 'Sessions', data: currentData.sessions }]}
              type="bar"
              height={160}
              width="100%"
            />
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
