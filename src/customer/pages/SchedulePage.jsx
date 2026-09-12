import React, { useState, useMemo } from 'react';
import ApexChartSafe from '../components/ApexChartSafe.jsx';
import { scheduleChartData } from '../services/customerChartData.js';

export default function SchedulePage() {
  const [scheduleView, setScheduleView] = useState('Day');
  const [selectedDate, setSelectedDate] = useState('Sep 12, 2026');

  const timeSlots = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24'];

  // Day View Chart Config: Tariff vs Renewable vs Scheduled Charging Power
  const dayChartOptions = useMemo(() => ({
    chart: {
      height: 220,
      type: 'line',
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#10B981', '#F59E0B', '#34D399'],
    stroke: { curve: 'smooth', width: [0, 2.5, 2] },
    plotOptions: {
      bar: { columnWidth: '35%', borderRadius: 4 },
    },
    fill: {
      type: ['solid', 'solid', 'gradient'],
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.5,
        opacityTo: 0.05,
        stops: [0, 100],
      },
      opacity: [0.95, 1, 0.4],
    },
    xaxis: {
      categories: scheduleChartData.dayView.hours,
      title: { text: 'Time of Day (Hours)', style: { fontSize: '10px', color: '#94A3B8' } },
      labels: { style: { colors: '#94A3B8', fontSize: '10px' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: [
      {
        title: { text: 'Scheduled (kW)', style: { color: '#10B981', fontSize: '10px', fontWeight: 600 } },
        min: 0,
        max: 16,
        labels: { style: { colors: '#64748B', fontSize: '9px' }, formatter: (v) => `${v} kW` },
      },
      {
        opposite: true,
        title: { text: 'Tariff (₹/kWh)', style: { color: '#F59E0B', fontSize: '10px', fontWeight: 600 } },
        min: 0,
        max: 16,
        labels: { style: { colors: '#64748B', fontSize: '9px' }, formatter: (v) => `₹${v.toFixed(1)}` },
      },
    ],
    tooltip: {
      shared: true,
      y: {
        formatter: (val, { seriesIndex }) => {
          if (typeof val === 'undefined') return val;
          if (seriesIndex === 0) return `${val} kW power draw`;
          if (seriesIndex === 1) return `₹${val.toFixed(1)} / kWh`;
          return `${val}% renewable`;
        },
      },
    },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '10px' },
    grid: { borderColor: '#F1F5F9', strokeDashArray: 3 },
  }), []);

  const dayChartSeries = useMemo(() => [
    {
      name: 'Scheduled EV Draw (kW)',
      type: 'column',
      data: scheduleChartData.dayView.scheduledKw,
    },
    {
      name: 'Grid Tariff (₹/kWh)',
      type: 'line',
      data: scheduleChartData.dayView.tariffPrice,
    },
    {
      name: 'Renewable Share (%)',
      type: 'area',
      data: scheduleChartData.dayView.renewableShare,
    },
  ], []);

  // Week View Chart Config: Weekly kWh & Savings Forecast
  const weekChartOptions = useMemo(() => ({
    chart: {
      height: 220,
      type: 'line',
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#10B981', '#3B82F6'],
    plotOptions: {
      bar: { columnWidth: '40%', borderRadius: 4 },
    },
    stroke: { curve: 'smooth', width: [0, 3] },
    xaxis: {
      categories: scheduleChartData.weekView.days,
      labels: { style: { colors: '#64748B', fontSize: '11px' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: [
      {
        title: { text: 'Energy (kWh)', style: { color: '#10B981', fontSize: '10px', fontWeight: 600 } },
        labels: { style: { colors: '#64748B', fontSize: '9px' }, formatter: (v) => `${v} kWh` },
      },
      {
        opposite: true,
        title: { text: 'Est. Savings (₹)', style: { color: '#3B82F6', fontSize: '10px', fontWeight: 600 } },
        labels: { style: { colors: '#64748B', fontSize: '9px' }, formatter: (v) => `₹${v}` },
      },
    ],
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '10px' },
    grid: { borderColor: '#F1F5F9', strokeDashArray: 3 },
  }), []);

  const weekChartSeries = useMemo(() => [
    {
      name: 'Scheduled Energy (kWh)',
      type: 'column',
      data: scheduleChartData.weekView.energyCharged,
    },
    {
      name: 'Money Saved (₹)',
      type: 'line',
      data: scheduleChartData.weekView.savings,
    },
  ], []);


  return (
    <div className="customer-page-content schedule-page">
      {/* 1. Top Control Bar */}
      <div className="schedule-control-bar">
        {/* Date Selector */}
        <div className="schedule-date-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{selectedDate}</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#64748B" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* View Toggle: Day / Week */}
        <div className="schedule-view-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${scheduleView === 'Day' ? 'active' : ''}`}
            onClick={() => setScheduleView('Day')}
          >
            Day
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${scheduleView === 'Week' ? 'active' : ''}`}
            onClick={() => setScheduleView('Week')}
          >
            Week
          </button>
        </div>

        {/* Action Button: Get New Schedule */}
        <button type="button" className="get-schedule-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>Get New Schedule</span>
        </button>
      </div>

      {/* 2. Timeline Card: Your Optimized Charging Schedule */}
      <div className="customer-card schedule-timeline-card">
        <h3 className="card-title">Your Optimized Charging Schedule</h3>

        <div className="timeline-grid-container">
          {/* Time axis header */}
          <div className="timeline-header-row">
            <div className="timeline-row-label-empty" />
            <div className="timeline-hours-axis">
              {timeSlots.map((time) => (
                <div key={time} className="time-tick">
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 1: Recommended */}
          <div className="timeline-row">
            <div className="timeline-row-label">Recommended</div>
            <div className="timeline-track">
              <div className="timeline-cell-grid">
                {timeSlots.map((_, i) => (
                  <div key={`rec-grid-${i}`} className="track-cell" />
                ))}
              </div>
              {/* Highlight green slot at 22-24 */}
              <div className="track-highlight rec-slot" style={{ left: '91.6%', width: '8.4%' }}>
                <span className="rec-mini-block" />
              </div>
            </div>
          </div>

          {/* Row 2: Your Schedule */}
          <div className="timeline-row">
            <div className="timeline-row-label">Your Schedule</div>
            <div className="timeline-track">
              <div className="timeline-cell-grid">
                {timeSlots.map((_, i) => (
                  <div key={`ys-grid-${i}`} className="track-cell" />
                ))}
              </div>
              {/* Charge 10:00 PM - 12:00 AM capsule */}
              <div className="track-highlight user-charging-slot" style={{ left: '83.33%', width: '16.66%' }}>
                <span className="user-slot-text">Charge (10:00 PM – 12:00 AM)</span>
              </div>
            </div>
          </div>

          {/* Row 3: Cheapest Hours */}
          <div className="timeline-row">
            <div className="timeline-row-label">Cheapest Hours</div>
            <div className="timeline-track">
              <div className="timeline-cell-grid">
                {timeSlots.map((_, i) => (
                  <div key={`cheap-grid-${i}`} className="track-cell" />
                ))}
              </div>
              {/* Blue cheap blocks: 06 to 10 and 22 to 24 */}
              <div className="track-highlight cheap-hours-slot" style={{ left: '25%', width: '16.66%' }} />
              <div className="track-highlight cheap-hours-slot" style={{ left: '58.33%', width: '16.66%' }} />
            </div>
          </div>

          {/* Row 4: High Renewable */}
          <div className="timeline-row">
            <div className="timeline-row-label">High Renewable</div>
            <div className="timeline-track">
              <div className="timeline-cell-grid">
                {timeSlots.map((_, i) => (
                  <div key={`ren-grid-${i}`} className="track-cell" />
                ))}
              </div>
              {/* Green renewable blocks: 10 to 16 and 22 to 24 */}
              <div className="track-highlight high-ren-slot" style={{ left: '41.66%', width: '25%' }} />
              <div className="track-highlight high-ren-slot" style={{ left: '83.33%', width: '16.66%' }} />
            </div>
          </div>
        </div>

        {/* Timeline Legend */}
        <div className="timeline-legend-row">
          <div className="timeline-legend-item">
            <span className="legend-swatch swatch-slot" />
            <span>Your Charging Slot</span>
          </div>
          <div className="timeline-legend-item">
            <span className="legend-swatch swatch-low-price" />
            <span>Low Electricity Price</span>
          </div>
          <div className="timeline-legend-item">
            <span className="legend-swatch swatch-high-ren" />
            <span>High Renewable Share</span>
          </div>
        </div>
      </div>

      {/* Dynamic AI Optimization ApexChart */}
      <div className="customer-card" style={{ marginBottom: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0, fontSize: '14px' }}>
              AI Smart Charging Optimization ({scheduleView} View)
            </h3>
            <p className="card-subtitle" style={{ margin: '2px 0 0 0', fontSize: '11px' }}>
              {scheduleView === 'Day'
                ? 'Coordinated EV draw (kW) timed with minimum grid tariff and highest clean renewable share.'
                : 'Forecasted daily charging volumes and accumulated bill savings over the week.'}
            </p>
          </div>
          <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600, background: '#ECFDF5', padding: '3px 8px', borderRadius: '4px' }}>
            ● AI Co-optimized
          </span>
        </div>
        <ApexChartSafe
          options={scheduleView === 'Day' ? dayChartOptions : weekChartOptions}
          series={scheduleView === 'Day' ? dayChartSeries : weekChartSeries}
          type="line"
          height={220}
          width="100%"
        />
      </div>

      {/* 3. Bottom Row: Why this schedule? & Schedule Summary */}
      <div className="schedule-bottom-grid">
        {/* Why this schedule? */}
        <div className="customer-card why-schedule-card">
          <h3 className="card-title">Why this schedule?</h3>
          <div className="why-schedule-list">
            <div className="why-item">
              <span className="why-icon amber">₹</span>
              <span className="why-text">Lower electricity cost (₹6.5/kWh)</span>
            </div>

            <div className="why-item">
              <span className="why-icon green">🍃</span>
              <span className="why-text">82% renewable energy available</span>
            </div>

            <div className="why-item">
              <span className="why-icon red">⚡</span>
              <span className="why-text">Avoids peak grid load</span>
            </div>

            <div className="why-item">
              <span className="why-icon green">🪙</span>
              <span className="why-text">Estimated savings of ₹120</span>
            </div>
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="customer-card summary-card">
          <h3 className="card-title">Schedule Summary</h3>
          <div className="summary-table-list">
            <div className="summary-row">
              <span className="summary-label">Charging Time</span>
              <span className="summary-val">10:00 PM – 12:00 AM</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Estimated Cost</span>
              <span className="summary-val">₹180</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Energy to be Delivered</span>
              <span className="summary-val">28 kWh</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Expected SOC</span>
              <span className="summary-val highlight-green">20% → 90%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
