import React from 'react';
import leafIcon from '../assets/icons/leaf.svg';
import locationPinIcon from '../assets/icons/location-pin.svg';
import clockIcon from '../assets/icons/clock.svg';

export default function TopHeader({ onSwitchToCustomer }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="top-header">
      {/* Greeting Title */}
      <div className="header-greeting">
        <h1 className="greeting-title">
          Hello, Operator <img src={leafIcon} alt="leaf" className="header-leaf-svg" />
        </h1>
        <p className="greeting-subtitle">
          Here's your EV charging station overview and sustainability impact.
        </p>
      </div>

      {/* Header Meta: Location, Divider, Time, Avatar (Clean flat UI, no card wrapper) */}
      <div className="header-meta">
        {/* Location Item */}
        <div className="header-meta-item">
          <img src={locationPinIcon} alt="Location" className="meta-icon location-icon" />
          <div className="meta-text">
            <span className="meta-primary">Gandhinagar, Gujarat</span>
            <span className="meta-secondary">23.1885° N, 72.6267° E</span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="header-divider" aria-hidden="true" />

        {/* Time Item */}
        <div className="header-meta-item">
          <img src={clockIcon} alt="Current Time" className="meta-icon clock-icon" />
          <div className="meta-text">
            <span className="meta-primary">{currentDate}</span>
            <span className="meta-secondary">{currentTime} (IST)</span>
          </div>
        </div>

        {/* Customer Portal Quick Switch Button */}
        {onSwitchToCustomer && (
          <button
            type="button"
            className="btn-switch-role-pill"
            onClick={onSwitchToCustomer}
            title="Switch to EV Driver Portal (/customer)"
          >
            🚗 Open EV Driver View &rarr;
          </button>
        )}

        {/* Operator Avatar */}
        <div className="operator-avatar" title="Operator Profile">
          <span>OP</span>
        </div>
      </div>
    </header>
  );
}
