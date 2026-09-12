import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import TestDev from './pages/TestDev.jsx';
import TestDatabase from './pages/TestDatabase.jsx';
import ChargingStations from './pages/ChargingStations.jsx';
import CustomerApp from './customer/CustomerApp.jsx';
import './App.css';

function App() {
  // Determine route from window.location (supports /customer, /customer/, #customer, #/customer)
  const getInitialRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.startsWith('/customer') || hash.includes('customer')) {
      return 'customer';
    }
    return 'operator';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [activeTab, setActiveTab] = useState('stations');

  // Listen to browser navigation (back/forward or hash change)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getInitialRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (route === 'customer') {
      window.history.pushState({}, '', '/customer');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // --- ROUTE 1: Customer / EV Driver App (/customer) ---
  if (currentRoute === 'customer') {
    return (
      <div className="portal-root-wrapper">
        {/* Top Floating Switcher Bar */}
        <div className="global-portal-banner">
          <div className="portal-banner-left">
            <span className="portal-badge-indicator customer">EV DRIVER APP</span>
            <span className="portal-banner-text">Viewing Customer App (/customer)</span>
          </div>
          <button
            type="button"
            className="btn-switch-portal-action"
            onClick={() => navigateTo('operator')}
          >
            &larr; Switch to Operator Portal
          </button>
        </div>

        {/* Dedicated Customer App Layout */}
        <CustomerApp />
      </div>
    );
  }

  // --- ROUTE 2: Network Operator Control Center (/) ---
  return (
    <div className="portal-root-wrapper">
      {/* Top Floating Switcher Bar */}
      <div className="global-portal-banner">
        <div className="portal-banner-left">
          <span className="portal-badge-indicator operator">OPERATOR PORTAL</span>
          <span className="portal-banner-text">Network Operator Control Center (/)</span>
        </div>
        <button
          type="button"
          className="btn-switch-portal-action"
          onClick={() => navigateTo('customer')}
        >
          Open Customer App (/customer) &rarr;
        </button>
      </div>

      <div className="app-layout">
        {/* 1. Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'customer-portal') {
              navigateTo('customer');
            } else {
              setActiveTab(tab);
            }
          }}
        />

        {/* 2. Main Right Area with Title Bar */}
        <div className="app-main-content">
          <TopHeader onSwitchToCustomer={() => navigateTo('customer')} />

          <div className="page-content-area">
            {/* Charging Stations page with search, cards list, pagination & interactive map */}
            {activeTab === 'stations' && <ChargingStations />}

            {/* Render API live playground and time slot cards when 'test - dev' tab is active */}
            {activeTab === 'test-dev' && <TestDev />}

            {/* Render MongoDB database explorer and live document stream when 'test - database' tab is active */}
            {activeTab === 'test-database' && <TestDatabase />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
