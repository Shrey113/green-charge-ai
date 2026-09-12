import React from 'react';
import GridOperatorSidebar from '../components/GridOperatorSidebar.jsx';
import GridOperatorHeader from '../components/GridOperatorHeader.jsx';
import DashboardOverview from './DashboardOverview.jsx';
import GridOverviewPage from './GridOverviewPage.jsx';
import RenewableEnergyPage from './RenewableEnergyPage.jsx';
import EVChargingDemandPage from './EVChargingDemandPage.jsx';
import ForecastSchedulingPage from './ForecastSchedulingPage.jsx';
import AnalyticsAlertsPage from './AnalyticsAlertsPage.jsx';

export default function AllScreensGrid({ onSelectScreen }) {
  const screens = [
    {
      id: 'dashboard',
      num: '1',
      title: '1. Dashboard (Overview)',
      subtitle: 'Real-time grid status, renewable share and EV charging impact at a glance.',
      activeTab: 'dashboard',
      showHeader: true,
      component: <DashboardOverview onNavigate={onSelectScreen} />,
    },
    {
      id: 'grid-overview',
      num: '2',
      title: '2. Grid Overview',
      subtitle: 'Monitor grid load, capacity, regional distribution and grid health.',
      activeTab: 'grid-overview',
      showHeader: false,
      component: <GridOverviewPage />,
    },
    {
      id: 'renewable',
      num: '3',
      title: '3. Renewable Energy',
      subtitle: 'Track renewable generation, availability and forecast.',
      activeTab: 'renewable',
      showHeader: false,
      component: <RenewableEnergyPage />,
    },
    {
      id: 'ev-demand',
      num: '4',
      title: '4. EV Charging Demand',
      subtitle: 'Monitor EV charging load and its impact on the grid.',
      activeTab: 'ev-demand',
      showHeader: false,
      component: <EVChargingDemandPage />,
    },
    {
      id: 'forecast',
      num: '5',
      title: '5. Forecast & Scheduling Impact',
      subtitle: 'View load forecast and the impact of optimized EV charging.',
      activeTab: 'forecast',
      showHeader: false,
      component: <ForecastSchedulingPage />,
    },
    {
      id: 'analytics',
      num: '6',
      title: '6. Analytics & Alerts',
      subtitle: 'Track trends, get insights and manage alerts.',
      activeTab: 'analytics',
      showHeader: false,
      headerRightPill: 'Last 7 Days ▾',
      component: <AnalyticsAlertsPage />,
    },
  ];

  return (
    <div className="all-screens-showcase-container">
      {/* Presentation Top Header matching the reference poster */}
      <div className="showcase-top-header">
        {/* Left: GreenCharge AI Brand */}
        <div className="showcase-header-left">
          <div className="showcase-power-badge">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="#10B981">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fillOpacity="0.2" />
              <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM11 7H13V13H11V7ZM12 17.25C11.31 17.25 10.75 16.69 10.75 16C10.75 15.31 11.31 14.75 12 14.75C12.69 14.75 13.25 15.31 13.25 16C13.25 16.69 12.69 17.25 12 17.25Z" fill="#10B981" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', lineHeight: 1.15 }}>
              GreenCharge AI
            </div>
            <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              Smart Grids. Greener Mobility.
            </div>
          </div>
        </div>

        {/* Center: Title & Slogan */}
        <div style={{ textAlign: 'center' }}>
          <h1 className="showcase-main-title">Grid Operator Dashboard – All Screens</h1>
          <p className="showcase-main-subtitle">Monitor. Balance. Enable a Cleaner Tomorrow.</p>
        </div>

        {/* Right: Feature Pill Tag */}
        <div className="showcase-header-right">
          <div className="showcase-brand-pill">
            <span>Stable Grid</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>More Renewables</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>Sustainable Mobility</span>
          </div>
        </div>
      </div>

      {/* 2x3 Grid of 6 Slides */}
      <div className="showcase-grid-2x3">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="showcase-slide-card"
            onClick={() => onSelectScreen && onSelectScreen(screen.id)}
            title={`Click to open full ${screen.title}`}
          >
            {/* Slide Green Header */}
            <div className="slide-green-header">
              <div className="slide-green-header-text">
                <h2 className="slide-header-title">{screen.title}</h2>
                <p className="slide-header-subtitle">{screen.subtitle}</p>
              </div>
              {screen.headerRightPill && (
                <span className="slide-header-pill">{screen.headerRightPill}</span>
              )}
            </div>

            {/* Slide Frame containing mini layout */}
            <div className="slide-content-frame">
              <div className="slide-layout-shell">
                {/* Mini Compact Sidebar */}
                <GridOperatorSidebar
                  activeTab={screen.activeTab}
                  onTabChange={(tab) => onSelectScreen && onSelectScreen(tab)}
                  isCompact={true}
                />

                {/* Main Body */}
                <div className="slide-layout-main">
                  {screen.showHeader && (
                    <GridOperatorHeader
                      title="Hello, Grid Operator! 👋"
                      subtitle="Here's your grid overview and the impact of EV charging on grid stability."
                      showGreeting={true}
                      location="Gujarat, India"
                      dateStr="Sat, Sep 12, 2026"
                      timeStr="08:24 PM (IST)"
                    />
                  )}
                  <div className="slide-inner-page">
                    {screen.component}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
