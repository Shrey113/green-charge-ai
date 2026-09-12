import React from 'react';

export default function CustomerHeader({
  title = 'Hello, Alex!',
  subtitle = "Here's your charging overview and sustainability impact.",
  showGreeting = true,
}) {
  return (
    <header className="customer-header">
      <div className="customer-header-left">
        {showGreeting ? (
          <div>
            <h1 className="customer-greeting-title">
              {title}{' '}
              <span className="greeting-leaf-icon" title="Eco Driver">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#10B981" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '4px' }}>
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
                </svg>
              </span>
            </h1>
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
        {/* Location badge */}
        <div className="customer-info-pill location-pill">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="location-name">Gandhinagar, Gujarat</span>
        </div>

        {/* Date / Time badge */}
        <div className="customer-info-pill time-pill">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 12" />
          </svg>
          <div className="time-pill-text">
            <span className="time-date">Sat, Sep 12, 2026</span>
            <span className="time-clock">06:34 PM (IST)</span>
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

