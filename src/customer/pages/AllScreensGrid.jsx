import React from 'react';
import CustomerSidebar from '../components/CustomerSidebar.jsx';
import CustomerHeader from '../components/CustomerHeader.jsx';
import DashboardOverview from './DashboardOverview.jsx';
import FindStations from './FindStations.jsx';
import MyEV from './MyEV.jsx';
import ChargingHistory from './ChargingHistory.jsx';
import SchedulePage from './SchedulePage.jsx';
import AnalyticsPage from './AnalyticsPage.jsx';

export default function AllScreensGrid({ onSelectScreen }) {
  const screens = [
    {
      id: 'dashboard',
      num: '1',
      title: '1. Dashboard (Overview)',
      subtitle: 'Personalized charging insights and recommendations.',
      activeTab: 'dashboard',
      component: <DashboardOverview onNavigate={onSelectScreen} />,
    },
    {
      id: 'stations',
      num: '2',
      title: '2. Find Charging Stations',
      subtitle: 'Search and explore nearby charging stations.',
      activeTab: 'stations',
      component: <FindStations />,
    },
    {
      id: 'my-ev',
      num: '3',
      title: '3. My EV (Vehicle Details)',
      subtitle: 'Manage your vehicle information and charging preferences.',
      activeTab: 'my-ev',
      component: <MyEV />,
    },
    {
      id: 'history',
      num: '4',
      title: '4. Charging History',
      subtitle: 'View your past charging sessions and savings.',
      activeTab: 'history',
      component: <ChargingHistory />,
    },
    {
      id: 'schedule',
      num: '5',
      title: '5. Schedule',
      subtitle: 'View your optimized charging schedule.',
      activeTab: 'schedule',
      component: <SchedulePage />,
    },
    {
      id: 'analytics',
      num: '6',
      title: '6. Analytics',
      subtitle: 'Track your charging behavior, cost savings and environmental impact.',
      activeTab: 'analytics',
      component: <AnalyticsPage />,
    },
  ];

  return (
    <div className="all-screens-showcase-container">
      {/* Presentation Top Header */}
      <div className="showcase-top-header">
        <div className="showcase-header-left">
          <div className="showcase-leaf-badge">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#10B981">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
            </svg>
          </div>
          <div>
            <h1 className="showcase-main-title">EV Driver (Customer) Dashboard – All Screens</h1>
          </div>
        </div>

        <div className="showcase-header-right">
          <div className="showcase-brand-tag">
            <div className="brand-leaf-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#10B981">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 11 11.5 9 17 8Z" />
              </svg>
            </div>
            <div className="brand-tag-text">
              <span className="brand-tag-name">GreenCharge AI</span>
              <span className="brand-tag-slogan">Charge Smart. Save Green. Drive a Sustainable Tomorrow.</span>
            </div>
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
              <h2 className="slide-header-title">{screen.title}</h2>
              <p className="slide-header-subtitle">{screen.subtitle}</p>
            </div>

            {/* Slide Frame containing mini layout */}
            <div className="slide-content-frame">
              <div className="slide-layout-shell">
                {/* Mini Sidebar */}
                <CustomerSidebar
                  activeTab={screen.activeTab}
                  onTabChange={(tab) => onSelectScreen && onSelectScreen(tab)}
                  isCompact={true}
                />

                {/* Main Body */}
                <div className="slide-layout-main">
                  <CustomerHeader
                    title={
                      screen.id === 'dashboard'
                        ? 'Hello, Alex! 👋'
                        : screen.id === 'stations'
                        ? ''
                        : screen.id === 'my-ev'
                        ? ''
                        : screen.id === 'history'
                        ? ''
                        : screen.id === 'schedule'
                        ? ''
                        : ''
                    }
                    subtitle={
                      screen.id === 'dashboard'
                        ? "Here's your charging overview and sustainability impact."
                        : ''
                    }
                    showGreeting={screen.id === 'dashboard'}
                  />
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
