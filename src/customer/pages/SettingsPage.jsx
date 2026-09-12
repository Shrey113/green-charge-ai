import React, { useState } from 'react';

export default function SettingsPage() {
  const [smartCharging, setSmartCharging] = useState(true);
  const [notifyLowSoc, setNotifyLowSoc] = useState(true);
  const [peakAvoidance, setPeakAvoidance] = useState(true);
  const [homeTariff, setHomeTariff] = useState('6.50');

  return (
    <div className="customer-page-content settings-page">
      <div className="customer-card settings-section-card">
        <h3 className="card-title">Driver Profile & Preferences</h3>
        <p className="card-subtitle">Manage your account credentials, notifications, and smart charging automation.</p>

        <div className="settings-items-list">
          {/* Item 1 */}
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-item-title">Autonomous Smart Charging</span>
              <span className="settings-item-desc">Automatically reserve charging sessions during optimal green energy windows.</span>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={smartCharging}
                onChange={() => setSmartCharging(!smartCharging)}
              />
              <span className="switch-slider" />
            </label>
          </div>

          {/* Item 2 */}
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-item-title">Peak Grid Avoidance</span>
              <span className="settings-item-desc">Pause or reduce charging rate if city grid reaches critical peak load.</span>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={peakAvoidance}
                onChange={() => setPeakAvoidance(!peakAvoidance)}
              />
              <span className="switch-slider" />
            </label>
          </div>

          {/* Item 3 */}
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-item-title">Low SOC Push Alerts</span>
              <span className="settings-item-desc">Receive instant notification when battery falls below minimum reserve (20%).</span>
            </div>
            <label className="switch-toggle">
              <input
                type="checkbox"
                checked={notifyLowSoc}
                onChange={() => setNotifyLowSoc(!notifyLowSoc)}
              />
              <span className="switch-slider" />
            </label>
          </div>

          {/* Item 4 */}
          <div className="settings-row">
            <div className="settings-row-text">
              <span className="settings-item-title">Base Electricity Rate (₹ / kWh)</span>
              <span className="settings-item-desc">Used for calculating real-time savings versus standard commercial tariffs.</span>
            </div>
            <div className="tariff-input-wrap">
              <span className="tariff-currency">₹</span>
              <input
                type="text"
                value={homeTariff}
                onChange={(e) => setHomeTariff(e.target.value)}
                className="tariff-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
