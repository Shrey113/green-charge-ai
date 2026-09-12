import React from 'react';

export default function CustomerHeader({
  title = 'Hello, Alex! 👋',
  subtitle = "Here's your charging overview and sustainability impact.",
  showGreeting = true,
  viewMode = 'single',
  onViewModeChange,
}) {
  return (
    <header className="customer-header">
      <div className="customer-header-left">
        {showGreeting ? (
          <div>
            <h1 className="customer-greeting-title">{title}</h1>
            <p className="customer-greeting-subtitle">{subtitle}</p>
          </div>
        ) : (
          <div>
            <h1 className="customer-greeting-title">{title}</h1>
            {subtitle && <p className="customer-greeting-subtitle">{subtitle}</p>}
          </div>
        )}
      </div>

      <div className="customer-header-right">
        {/* Toggle between interactive individual screen and all 6 screens poster mode */}
        {onViewModeChange && (
          <div className="customer-viewmode-toggle" title="Toggle between interactive view and 6-Slide presentation view">
            <button
              type="button"
              className={`viewmode-btn ${viewMode === 'single' ? 'active' : ''}`}
              onClick={() => onViewModeChange('single')}
            >
              Interactive Screen
            </button>
            <button
              type="button"
              className={`viewmode-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => onViewModeChange('all')}
            >
              All 6 Screens
            </button>
          </div>
        )}

        {/* Location badge */}
        <div className="customer-info-pill location-pill">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Gandhinagar, Gujarat</span>
        </div>

        {/* Date / Time badge */}
        <div className="customer-info-pill time-pill">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <div className="time-pill-text">
            <span className="time-date">Sat, Sep 12, 2026</span>
            <span className="time-clock">06:24 PM (IST)</span>
          </div>
        </div>

        {/* User avatar circle */}
        <div className="customer-avatar-badge" title="Alex — EV Driver">
          AL
        </div>
      </div>
    </header>
  );
}
