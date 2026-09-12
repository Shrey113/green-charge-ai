import React, { useState } from 'react';
import teslaImg from '../assets/tesla_model_3.jpg';

export default function MyEV() {
  const [targetSoc, setTargetSoc] = useState(90);
  const [minSoc, setMinSoc] = useState(20);
  const [preferredTime, setPreferredTime] = useState('10:00 PM – 06:00 AM');
  const [maxPower, setMaxPower] = useState('100 kW');
  const [preferredStation, setPreferredStation] = useState('Any');
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);

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
                <span className="vspec-val">491 km</span>
              </div>

              <div className="vehicle-spec-item">
                <span className="vspec-label">Max Charging Power</span>
                <span className="vspec-val">250 kW</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charging Preferences Card */}
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
