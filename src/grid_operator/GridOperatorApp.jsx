import React, { useState } from 'react';
import GridOperatorSidebar from './components/GridOperatorSidebar.jsx';
import GridOperatorHeader from './components/GridOperatorHeader.jsx';
import DashboardOverview from './pages/DashboardOverview.jsx';
import GridOverviewPage from './pages/GridOverviewPage.jsx';
import RenewableEnergyPage from './pages/RenewableEnergyPage.jsx';
import EVChargingDemandPage from './pages/EVChargingDemandPage.jsx';
import ForecastSchedulingPage from './pages/ForecastSchedulingPage.jsx';
import AnalyticsAlertsPage from './pages/AnalyticsAlertsPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import './gridOperator.css';

export default function GridOperatorApp({ initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const screenMeta = {
    dashboard: {
      title: 'Hello, Grid Operator! 👋',
      subtitle: "Here's your grid overview and the impact of EV charging on grid stability.",
      showGreeting: true,
    },
    'grid-overview': {
      title: 'Grid Overview',
      subtitle: 'Monitor grid load, capacity, regional distribution and grid health.',
      showGreeting: false,
    },
    renewable: {
      title: 'Renewable Energy',
      subtitle: 'Track renewable generation, availability and forecast.',
      showGreeting: false,
    },
    'ev-demand': {
      title: 'EV Charging Demand',
      subtitle: 'Monitor EV charging load and its impact on the grid.',
      showGreeting: false,
    },
    forecast: {
      title: 'Forecast & Scheduling Impact',
      subtitle: 'View load forecast and the impact of optimized EV charging.',
      showGreeting: false,
    },
    analytics: {
      title: 'Analytics & Alerts',
      subtitle: 'Track trends, get insights and manage alerts.',
      showGreeting: false,
    },
    alerts: {
      title: 'Alerts & Incidents',
      subtitle: 'Active grid congestion alerts and notifications.',
      showGreeting: false,
    },
    settings: {
      title: 'Grid Settings',
      subtitle: 'Manage regional thresholds, curtailment limits and smart charging dispatch.',
      showGreeting: false,
    },
  };

  const currentMeta = screenMeta[activeTab] || screenMeta.dashboard;

  return (
    <div className="grid-operator-root">
      <div className="grid-operator-layout">
        {/* Left Sidebar */}
        <GridOperatorSidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        {/* Right Main Content */}
        <div className="grid-operator-main-area">
          <GridOperatorHeader
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
            showGreeting={currentMeta.showGreeting}
            location="Gujarat, India"
            dateStr="Sat, Sep 12, 2026"
            timeStr="08:24 PM (IST)"
          />

          <main className="grid-page-container">
            {activeTab === 'dashboard' && (
              <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'grid-overview' && <GridOverviewPage />}
            {activeTab === 'renewable' && <RenewableEnergyPage />}
            {activeTab === 'ev-demand' && <EVChargingDemandPage />}
            {activeTab === 'forecast' && <ForecastSchedulingPage />}
            {activeTab === 'analytics' && <AnalyticsAlertsPage />}
            {activeTab === 'alerts' && <AlertsPage />}
            {activeTab === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>
    </div>
  );
}
