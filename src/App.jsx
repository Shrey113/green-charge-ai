import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import TestDev from './pages/TestDev.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-layout">
      {/* 1. Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Main Right Area with Title Bar */}
      <div className="app-main-content">
        <TopHeader />

        <div className="page-content-area">
          {/* Render API live playground and time slot cards only when 'test - dev' tab is active */}
          {activeTab === 'test-dev' && <TestDev />}
        </div>
      </div>
    </div>
  );
}

export default App;
