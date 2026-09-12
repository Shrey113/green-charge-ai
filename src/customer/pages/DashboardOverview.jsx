import React, { useMemo } from 'react';
import ApexChartSafe from '../components/ApexChartSafe.jsx';
import { dashboardData } from '../services/customerChartData.js';

export default function DashboardOverview({ onNavigate }) {
  // Memoized Green Score radialBar chart configuration
  const greenScoreOptions = useMemo(() => ({
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      radialBar: {
        startAngle: -120,
        endAngle: 120,
        hollow: { size: '65%' },
        track: {
          background: '#E2E8F0',
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '11px',
            color: '#64748B',
            offsetY: 20,
          },
          value: {
            offsetY: -14,
            fontSize: '26px',
            fontWeight: '700',
            fontFamily: 'Inter, sans-serif',
            color: '#0F172A',
            formatter: (val) => `${val}`,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#059669'],
        stops: [0, 100],
      },
    },
    colors: ['#10B981'],
    stroke: { lineCap: 'round' },
    labels: ['/ 100 Score'],
  }), []);

  // Memoized combo chart options (Renewable columns + Price line)
  const comboChartOptions = useMemo(() => ({
    chart: {
      height: 220,
      type: 'line',
      toolbar: { show: false },
      animations: { enabled: true, speed: 700 },
      fontFamily: 'Inter, sans-serif',
    },
    stroke: {
      width: [0, 3],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '38%',
        borderRadius: 4,
      },
    },
    colors: ['#86EFAC', '#047857'],
    fill: {
      opacity: [0.85, 1],
      type: ['gradient', 'solid'],
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.9,
        opacityTo: 0.6,
        stops: [0, 100],
      },
    },
    labels: dashboardData.hourlyForecast.map(d => d.hour),
    markers: {
      size: [0, 4],
      colors: ['#FFFFFF'],
      strokeColors: '#047857',
      strokeWidth: 2,
      hover: { size: 6 },
    },
    xaxis: {
      labels: {
        style: { colors: '#94A3B8', fontSize: '11px', fontFamily: 'Inter' },
      },
      axisBorder: { color: '#E2E8F0' },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: {
          text: 'Price (₹/kWh)',
          style: { color: '#047857', fontSize: '11px', fontWeight: 600 },
        },
        min: 0,
        max: 16,
        labels: {
          style: { colors: '#64748B', fontSize: '10px' },
          formatter: (val) => `₹${val.toFixed(1)}`,
        },
      },
      {
        opposite: true,
        title: {
          text: 'Renewable %',
          style: { color: '#059669', fontSize: '11px', fontWeight: 600 },
        },
        min: 0,
        max: 100,
        labels: {
          style: { colors: '#64748B', fontSize: '10px' },
          formatter: (val) => `${Math.round(val)}%`,
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y, { seriesIndex }) => {
          if (typeof y !== 'undefined') {
            return seriesIndex === 0 ? `${y}%` : `₹${y.toFixed(1)} / kWh`;
          }
          return y;
        },
      },
    },
    legend: { show: false },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 3,
      padding: { top: 0, right: 10, bottom: 0, left: 10 },
    },
  }), []);

  const comboSeries = useMemo(() => [
    {
      name: 'Renewable Share (%)',
      type: 'column',
      data: dashboardData.hourlyForecast.map(d => d.renewable),
    },
    {
      name: 'Electricity Price (₹/kWh)',
      type: 'line',
      data: dashboardData.hourlyForecast.map(d => d.price),
    },
  ], []);


  return (
    <div className="customer-page-content dashboard-overview-page">
      {/* 1. TOP ROW: 4 KPI CARDS */}
      <div className="customer-kpi-grid">
        {/* Card 1: Current Battery */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap battery-wrap">
            <svg viewBox="0 0 24 30" width="26" height="30" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="22" rx="3" />
              <path d="M8 3h8a1 1 0 0 1 1 1v2H7V4a1 1 0 0 1 1-1z" fill="#10B981" stroke="none" />
              <line x1="7" y1="21" x2="17" y2="21" stroke="#10B981" strokeWidth="2.5" />
              <line x1="7" y1="16" x2="17" y2="16" stroke="#10B981" strokeWidth="2.5" />
              <line x1="7" y1="11" x2="17" y2="11" stroke="#10B981" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">78%</span>
            <span className="kpi-label">Current Battery (SOC)</span>
          </div>
        </div>

        {/* Card 2: Target SOC */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap target-wrap">
            <svg viewBox="0 0 24 30" width="26" height="30" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="22" rx="3" />
              <path d="M8 3h8a1 1 0 0 1 1 1v2H7V4a1 1 0 0 1 1-1z" fill="#10B981" stroke="none" />
              <line x1="7" y1="22" x2="17" y2="22" stroke="#10B981" strokeWidth="2.5" />
              <line x1="7" y1="18" x2="17" y2="18" stroke="#10B981" strokeWidth="2.5" />
              <line x1="7" y1="14" x2="17" y2="14" stroke="#10B981" strokeWidth="2.5" />
              <line x1="7" y1="10" x2="17" y2="10" stroke="#10B981" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">90%</span>
            <span className="kpi-label">Target SOC</span>
          </div>
        </div>

        {/* Card 3: Estimated Cost */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap cost-wrap">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.8" />
              <path d="M9.5 8h5M9.5 11h3.5M10.5 11c1.5 0 2.5 0.8 2.5 2s-1 2-2.5 2m0-4v4m1 0l2 3" stroke="#B45309" strokeWidth="1.6" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">₹320</span>
            <span className="kpi-label">Estimated Cost (Optimized)</span>
          </div>
        </div>

        {/* Card 4: Estimated Charging Time */}
        <div className="customer-kpi-card">
          <div className="kpi-icon-wrap time-wrap">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 12" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">1h 45m</span>
            <span className="kpi-label">Estimated Charging Time</span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: Recommended Schedule & Green Score */}
      <div className="dashboard-middle-grid">
        {/* Recommended Charging Schedule */}
        <div className="customer-card schedule-recommendation-card">
          <div className="card-header-clean">
            <h3 className="card-title">Recommended Charging Schedule</h3>
            <p className="card-subtitle">Best time to charge based on low cost and high renewable energy.</p>
          </div>

          <div className="recommendation-box">
            <div className="rec-box-top">
              <span className="rec-time-badge">Today, 10:00 PM – 12:00 AM</span>
              <span className="rec-optimal-pill">Optimal Time</span>
            </div>

            <div className="rec-stats-row">
              <div className="rec-stat-col">
                <span className="rec-stat-icon-wrap gold-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" fill="#FEF3C7" stroke="#F59E0B" />
                    <path d="M9 8h5M9 11h3.5M10 11c1.5 0 2.2 0.7 2.2 1.8s-0.7 1.8-2.2 1.8m0-3.6v3.6m1 0l2 2.6" stroke="#B45309" strokeWidth="1.4" />
                  </svg>
                </span>
                <div className="rec-stat-text">
                  <span className="rec-stat-label">Cost</span>
                  <span className="rec-stat-val">₹6.5 / kWh</span>
                </div>
              </div>

              <div className="rec-stat-col">
                <span className="rec-stat-icon-wrap green-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                  </svg>
                </span>
                <div className="rec-stat-text">
                  <span className="rec-stat-label">Renewable Share</span>
                  <span className="rec-stat-val">82%</span>
                </div>
              </div>

              <div className="rec-stat-col">
                <span className="rec-stat-icon-wrap savings-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" fill="#FEF3C7" stroke="#F59E0B" />
                    <path d="M9 8h5M9 11h3.5M10 11c1.5 0 2.2 0.7 2.2 1.8s-0.7 1.8-2.2 1.8m0-3.6v3.6m1 0l2 2.6" stroke="#B45309" strokeWidth="1.4" />
                  </svg>
                </span>
                <div className="rec-stat-text">
                  <span className="rec-stat-label">Estimated Savings</span>
                  <span className="rec-stat-val">₹120</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="rec-action-btn"
              onClick={() => onNavigate && onNavigate('schedule')}
            >
              View Full Schedule →
            </button>
          </div>
        </div>

        {/* Your Green Score */}
        <div className="customer-card green-score-card">
          <div className="card-header-clean card-header-left">
            <h3 className="card-title">Your Green Score</h3>
          </div>

          <div className="green-score-gauge-wrap" style={{ minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ApexChartSafe
              options={greenScoreOptions}
              series={[dashboardData.greenScore]}
              type="radialBar"
              height={170}
              width={180}
            />
          </div>

          <div className="score-leaf">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#10B981">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
            </svg>
          </div>

          <p className="green-score-desc">
            Great! You are charging greener than <strong>78%</strong> of EV drivers.
          </p>
        </div>
      </div>

      {/* 3. BOTTOM ROW: Electricity Price Chart & Monthly Impact */}
      <div className="dashboard-bottom-grid">
        {/* Electricity Price & Renewable Share (Today) */}
        <div className="customer-card chart-card">
          <div className="card-header-flex">
            <h3 className="card-title">Electricity Price & Renewable Share (Today)</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot price-dot" />
                <span>Electricity Price (₹/kWh)</span>
              </span>
              <span className="legend-item">
                <span className="legend-dot renewable-dot" />
                <span>Renewable Share (%)</span>
              </span>
            </div>
          </div>

          <div className="chart-wrapper" style={{ height: '220px' }}>
            <ApexChartSafe
              options={comboChartOptions}
              series={comboSeries}
              type="line"
              height={220}
              width="100%"
            />
          </div>
        </div>

        {/* Impact This Month */}
        <div className="customer-card impact-card">
          <div className="card-header-clean card-header-left">
            <h3 className="card-title">Impact This Month</h3>
          </div>

          <div className="impact-items-list">
            {/* Money Saved */}
            <div className="impact-item">
              <div className="impact-icon-circle green-bg">
                <span style={{ fontSize: '18px', fontWeight: 700 }}>₹</span>
              </div>
              <div className="impact-info">
                <span className="impact-value">₹480</span>
                <span className="impact-label">Money Saved</span>
              </div>
            </div>

            {/* CO2 Reduced */}
            <div className="impact-item">
              <div className="impact-icon-circle green-bg">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
                </svg>
              </div>
              <div className="impact-info">
                <span className="impact-value">62 kg</span>
                <span className="impact-label">CO₂ Reduced</span>
              </div>
            </div>

            {/* Green Energy Used */}
            <div className="impact-item">
              <div className="impact-icon-circle green-bg">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#10B981">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="impact-info">
                <span className="impact-value">138 kWh</span>
                <span className="impact-label">Green Energy Used</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
