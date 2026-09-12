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
import './customer.css';

export default function CustomerApp({ initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="customer-app-root mode-single-screen">
      <div className="customer-presentation-frame">
        <div className="customer-app-layout">
          {/* Left Sidebar */}
          <CustomerSidebar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />

          {/* Right Main Content */}
          <div className="customer-main-area">
            {/* Title Bar (location, date/time, AL avatar) ONLY shown on dashboard */}
            {activeTab === 'dashboard' && (
              <CustomerHeader
                title="Hello, Alex!"
                subtitle="Here's your charging overview and sustainability impact."
                showGreeting={true}
              />
            )}

            <main className={`customer-page-container ${activeTab !== 'dashboard' ? 'no-header-pad' : ''}`}>
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
    </div>
  );
}
