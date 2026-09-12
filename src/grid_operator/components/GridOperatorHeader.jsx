import React from 'react';

export default function GridOperatorHeader({
  title = 'Hello, Grid Operator! 👋',
  subtitle = "Here's your grid overview and the impact of EV charging on grid stability.",
  showGreeting = true,
  location = 'Gujarat, India',
  dateStr = 'Sat, Sep 12, 2026',
  timeStr = '08:24 PM (IST)',
  rightContent = null,
}) {
  return (
    <header className="grid-operator-header">
      <div className="header-left-greeting">
        {showGreeting ? (
          <>
            <h1 className="greeting-title">{title}</h1>
            <p className="greeting-subtitle">{subtitle}</p>
          </>
        ) : (
          title && <h1 className="greeting-title">{title}</h1>
        )}
      </div>

      <div className="header-right-meta">
        {rightContent ? (
          rightContent
        ) : (
          <>
            {/* Location Pill */}
            <div className="info-pill location-pill">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{location}</span>
            </div>

            {/* Date & Time */}
            <div className="info-pill datetime-pill">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div className="datetime-stack">
                <span className="datetime-date">{dateStr}</span>
                <span className="datetime-time">{timeStr}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
