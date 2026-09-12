import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import TestDev from './pages/TestDev.jsx';
import TestDatabase from './pages/TestDatabase.jsx';
import ChargingStations from './pages/ChargingStations.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('stations');

  return (
    <div className="app-layout">
      {/* 1. Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Main Right Area with Title Bar */}
      <div className="app-main-content">
        <TopHeader />

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
  );
}

export default App;
