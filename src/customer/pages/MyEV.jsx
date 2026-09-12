import React, { useState, useMemo } from 'react';
import ApexChartSafe from '../components/ApexChartSafe.jsx';
import { getChargingCurve } from '../services/customerChartData.js';
import teslaImg from '../assets/tesla_model_3.jpg';

export default function MyEV() {
  const [targetSoc, setTargetSoc] = useState(90);
  const [minSoc, setMinSoc] = useState(20);
  const [preferredTime, setPreferredTime] = useState('10:00 PM – 06:00 AM');
  const [maxPower, setMaxPower] = useState('100 kW');
  const [preferredStation, setPreferredStation] = useState('Any');
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);

  // Dynamic charging curve based on max power & target SOC
  const curveData = useMemo(() => getChargingCurve(maxPower, targetSoc), [maxPower, targetSoc]);

  // Battery SOC Radial Gauge options
  const socRadialOptions = useMemo(() => ({
    chart: {
      type: 'radialBar',
      height: 220,
      fontFamily: 'Inter, sans-serif',
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: {
      radialBar: {
        offsetY: -5,
        startAngle: 0,
        endAngle: 360,
        hollow: { size: '38%' },
        track: {
          background: '#F1F5F9',
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '11px',
            color: '#64748B',
            offsetY: -8,
          },
          value: {
            show: true,
            fontSize: '16px',
            fontWeight: 700,
            color: '#0F172A',
            offsetY: 4,
            formatter: (v) => `${v}%`,
          },
          total: {
            show: true,
            label: 'Target',
            color: '#059669',
            fontSize: '11px',
            formatter: () => `${targetSoc}%`,
          },
        },
      },
    },
    colors: ['#10B981', '#059669', '#F59E0B'],
    labels: ['Target SOC', 'Current SOC', 'Min Reserve'],
    stroke: { lineCap: 'round' },
    legend: {
      show: true,
      floating: false,
      fontSize: '11px',
      position: 'bottom',
      horizontalAlign: 'center',
      markers: { size: 4 },
      itemMargin: { horizontal: 6, vertical: 2 },
    },
  }), [targetSoc]);

  // Charging curve spline area chart options
  const curveOptions = useMemo(() => ({
    chart: {
      height: 200,
      type: 'area',
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#10B981'],
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        opacityFrom: 0.65,
        opacityTo: 0.1,
        stops: [0, 95, 100],
      },
    },
    xaxis: {
      categories: curveData.socPoints.map((s) => `${s}%`),
      title: { text: 'Battery Level (% SOC)', style: { fontSize: '11px', color: '#64748B' } },
      labels: { style: { fontSize: '10px', colors: '#94A3B8' } },
      axisBorder: { color: '#E2E8F0' },
    },
    yaxis: {
      title: { text: 'Power (kW)', style: { fontSize: '11px', color: '#10B981', fontWeight: 600 } },
      labels: {
        style: { fontSize: '10px', colors: '#64748B' },
        formatter: (v) => `${v} kW`,
      },
      min: 0,
      max: Math.max(curveData.peakKw * 1.15, 60),
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} kW charging rate`,
      },
    },
    annotations: {
      xaxis: [
        {
          x: `${targetSoc}%`,
          borderColor: '#059669',
          label: {
            borderColor: '#059669',
            style: { color: '#fff', background: '#059669', fontSize: '10px' },
            text: `Cutoff ${targetSoc}%`,
          },
        },
      ],
    },
    grid: { borderColor: '#F1F5F9', strokeDashArray: 3 },
  }), [curveData, targetSoc]);

  const curveSeries = useMemo(() => [
    {
      name: 'Charging Power',
      data: curveData.powerPoints,
    },
  ], [curveData]);

  // Dynamic range estimate based on target SOC
  const estRange = Math.round((491 * targetSoc) / 100);

  return (
    <div className="customer-page-content my-ev-page">
      {/* 1. Vehicle Overview Card */}
      <div className="customer-card vehicle-card">
        <div className="vehicle-card-inner">
          {/* Left: Tesla Model 3 image */}
          <div className="vehicle-image-wrap">
            <img
              src={teslaImg}
              alt="Tesla Model 3"
              className="vehicle-photo"
            />
          </div>

          {/* Right: Vehicle Specifications */}
          <div className="vehicle-info-wrap">
            <div className="vehicle-header-row">
              <h3 className="vehicle-title">Tesla Model 3</h3>
              <button
                type="button"
                className="edit-pill-btn"
                onClick={() => setIsEditingVehicle(!isEditingVehicle)}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <span>Edit</span>
              </button>
            </div>

            <div className="vehicle-specs-grid">
              <div className="vehicle-spec-item">
                <span className="vspec-label">Battery Capacity</span>
                <span className="vspec-val">75 kWh</span>
              </div>

              <div className="vehicle-spec-item">
                <span className="vspec-label">Range (WLTP)</span>
                <span className="vspec-val">{estRange} km ({targetSoc}%)</span>
              </div>

              <div className="vehicle-spec-item">
                <span className="vspec-label">Max Charging Power</span>
                <span className="vspec-val">{maxPower}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Telemetry: Battery SOC Gauge & Dynamic Charging Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Battery SOC Multi-Radial Gauge */}
        <div className="customer-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Battery SOC Allocation</h4>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Real-time</span>
          </div>
          <ApexChartSafe
            options={socRadialOptions}
            series={[targetSoc, 78, minSoc]}
            type="radialBar"
            height={220}
            width="100%"
          />
        </div>

        {/* Dynamic Fast Charging Curve */}
        <div className="customer-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Dynamic Charging Curve</h4>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Peak {curveData.peakKw} kW</span>
          </div>
          <ApexChartSafe
            options={curveOptions}
            series={curveSeries}
            type="area"
            height={200}
            width="100%"
          />
        </div>
      </div>

      {/* 3. Charging Preferences Card */}
      <div className="customer-card preferences-card">
        <div className="pref-header-row">
          <h3 className="pref-title">Charging Preferences</h3>
          <button
            type="button"
            className="edit-pill-btn"
            onClick={() => setIsEditingPreferences(!isEditingPreferences)}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>{isEditingPreferences ? 'Done' : 'Edit'}</span>
          </button>
        </div>

        <div className="preferences-form">
          {/* Target SOC Slider */}
          <div className="pref-row">
            <label className="pref-label">Target SOC</label>
            <div className="pref-slider-wrap">
              <input
                type="range"
                min="50"
                max="100"
                value={targetSoc}
                onChange={(e) => setTargetSoc(Number(e.target.value))}
                className="green-range-slider"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${((targetSoc - 50) / 50) * 100}%, #E2E8F0 ${((targetSoc - 50) / 50) * 100}%, #E2E8F0 100%)`,
                }}
              />
              <span className="slider-value-text">{targetSoc}%</span>
            </div>
          </div>

          {/* Minimum SOC Slider */}
          <div className="pref-row">
            <label className="pref-label">Minimum SOC</label>
            <div className="pref-slider-wrap">
              <input
                type="range"
                min="10"
                max="50"
                value={minSoc}
                onChange={(e) => setMinSoc(Number(e.target.value))}
                className="green-range-slider"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #10B981 ${((minSoc - 10) / 40) * 100}%, #E2E8F0 ${((minSoc - 10) / 40) * 100}%, #E2E8F0 100%)`,
                }}
              />
              <span className="slider-value-text">{minSoc}%</span>
            </div>
          </div>

          {/* Preferred Charging Time */}
          <div className="pref-row">
            <label className="pref-label">Preferred Charging Time</label>
            <div className="pref-input-wrap">
              <span className="pref-text-display">{preferredTime}</span>
            </div>
          </div>

          {/* Max Charging Power Dropdown */}
          <div className="pref-row">
            <label className="pref-label">Max Charging Power</label>
            <div className="pref-input-wrap">
              <div className="pref-select-wrap">
                <select
                  value={maxPower}
                  onChange={(e) => setMaxPower(e.target.value)}
                  className="pref-select-box"
                >
                  <option value="50 kW">50 kW</option>
                  <option value="100 kW">100 kW</option>
                  <option value="150 kW">150 kW</option>
                  <option value="250 kW">250 kW</option>
                </select>
                <span className="select-chevron">▾</span>
              </div>
            </div>
          </div>

          {/* Preferred Stations Dropdown */}
          <div className="pref-row">
            <label className="pref-label">Preferred Stations</label>
            <div className="pref-input-wrap">
              <div className="pref-select-wrap">
                <select
                  value={preferredStation}
                  onChange={(e) => setPreferredStation(e.target.value)}
                  className="pref-select-box"
                >
                  <option value="Any">Any</option>
                  <option value="Gandhinagar Central">Gandhinagar Central</option>
                  <option value="DAIICT Charging Station">DAIICT Charging Station</option>
                  <option value="SG Highway Station">SG Highway Station</option>
                </select>
                <span className="select-chevron">▾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Green Callout */}
        <div className="pref-callout-notice">
          <div className="pref-notice-leaf">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#10B981">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
            </svg>
          </div>
          <p className="pref-notice-text">
            These preferences help us find the best and greenest charging schedule for you.
          </p>
        </div>
      </div>
    </div>
  );
}


