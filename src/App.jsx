import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import TestDev from './pages/TestDev.jsx';
import TestDatabase from './pages/TestDatabase.jsx';
import ChargingStations from './pages/ChargingStations.jsx';
import CustomerApp from './customer/CustomerApp.jsx';
import GridOperatorApp from './grid_operator/GridOperatorApp.jsx';
import './App.css';

function App() {
  // Determine route from window.location (supports /customer, /grid, /grid-operator, #customer, #grid)
  const getInitialRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.startsWith('/customer') || hash.includes('customer')) {
      return 'customer';
    }
    if (path.startsWith('/grid') || hash.includes('grid')) {
      return 'grid';
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
    } else if (route === 'grid') {
      window.history.pushState({}, '', '/grid');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // --- ROUTE 1: Customer / EV Driver App (/customer) ---
  if (currentRoute === 'customer') {
    return (
      <div className="portal-root-wrapper">
        <CustomerApp />
      </div>
    );
  }

  // --- ROUTE 2: Grid Operator Portal (/grid) ---
  if (currentRoute === 'grid') {
    return (
      <div className="portal-root-wrapper">
        <GridOperatorApp />
      </div>
    );
  }

  // --- ROUTE 3: Network Operator Control Center (/) ---
  return (
    <div className="portal-root-wrapper">

      <div className="app-layout">
        {/* 1. Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'customer-portal') {
              navigateTo('customer');
            } else if (tab === 'grid-portal') {
              navigateTo('grid');
            } else {
              setActiveTab(tab);
            }
          }}
        />

        {/* 2. Main Right Area with Title Bar (rendered only on Dashboard) */}
        <div className="app-main-content">
          {activeTab === 'dashboard' && (
            <TopHeader
              onSwitchToCustomer={() => navigateTo('customer')}
              onSwitchToGrid={() => navigateTo('grid')}
            />
          )}

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
