import React, { useState } from 'react';
import CustomerSidebar from './components/CustomerSidebar.jsx';
import CustomerHeader from './components/CustomerHeader.jsx';
import DashboardOverview from './pages/DashboardOverview.jsx';
import FindStations from './pages/FindStations.jsx';
import MyEV from './pages/MyEV.jsx';
import ChargingHistory from './pages/ChargingHistory.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import AllScreensGrid from './pages/AllScreensGrid.jsx';
import './customer.css';

export default function CustomerApp({ initialTab = 'dashboard', defaultViewMode = 'single' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [viewMode, setViewMode] = useState(defaultViewMode); // 'single' | 'all'

  // Titles & subtitles mapping
  const screenMeta = {
    dashboard: {
      title: 'Hello, Alex! 👋',
      subtitle: "Here's your charging overview and sustainability impact.",
      showGreeting: true,
    },
    stations: {
      title: '',
      subtitle: '',
      showGreeting: false,
    },
    'my-ev': {
      title: '',
      subtitle: '',
      showGreeting: false,
    },
    history: {
      title: '',
      subtitle: '',
      showGreeting: false,
    },
    schedule: {
      title: '',
      subtitle: '',
      showGreeting: false,
    },
    analytics: {
      title: '',
      subtitle: '',
      showGreeting: false,
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your preferences and smart charging automation.',
      showGreeting: false,
    },
  };

  const currentMeta = screenMeta[activeTab] || screenMeta.dashboard;

  const handleSelectScreen = (tabId) => {
    setActiveTab(tabId);
    setViewMode('single');
  };

  // If in 'all' view mode, render the 2x3 poster view
  if (viewMode === 'all') {
    return (
      <div className="customer-app-root mode-all-screens">
        <div className="viewmode-banner-floating">
          <button
            type="button"
            className="viewmode-toggle-pill active"
            onClick={() => setViewMode('all')}
          >
            All 6 Screens (Poster Mode)
          </button>
          <button
            type="button"
            className="viewmode-toggle-pill"
            onClick={() => setViewMode('single')}
          >
            Interactive Screen Mode
          </button>
        </div>
        <AllScreensGrid onSelectScreen={handleSelectScreen} />
      </div>
    );
  }

  return (
    <div className="customer-app-root mode-single-screen">
      <div className="customer-app-layout">
        {/* Left Sidebar */}
        <CustomerSidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        {/* Right Main Content */}
        <div className="customer-main-area">
          <CustomerHeader
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
            showGreeting={currentMeta.showGreeting}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <main className="customer-page-container">
            {activeTab === 'dashboard' && (
              <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'stations' && <FindStations />}
            {activeTab === 'my-ev' && <MyEV />}
            {activeTab === 'history' && <ChargingHistory />}
            {activeTab === 'schedule' && <SchedulePage />}
            {activeTab === 'analytics' && <AnalyticsPage />}
            {activeTab === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>
    </div>
  );
}
