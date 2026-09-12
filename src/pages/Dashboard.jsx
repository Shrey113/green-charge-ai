import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header.jsx';
import SlotSelector from '../components/SlotSelector.jsx';
import SlotDataCard from '../components/SlotDataCard.jsx';
import {
  FIXED_EV_STATION,
  fetchElectricityForecast,
} from '../services/electricityService.js';

export default function Dashboard() {
  const [forecast, setForecast] = useState(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch forecast for fixed EV station coordinates (No browser location prompt)
      const data = await fetchElectricityForecast(
        FIXED_EV_STATION.latitude,
        FIXED_EV_STATION.longitude
      );
      setForecast(data);

      // Default to current local time slot (e.g. 03:00 - 04:00)
      setSelectedSlotIndex(data.defaultSlotIndex);
    } catch (err) {
      console.error('Failed to load forecast:', err);
      setError(err.message || 'Could not connect to backend server. Make sure port 5000 is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSlotSelect = (newIndex) => {
    setSelectedSlotIndex(newIndex);
  };

  const currentSlot = forecast?.slots[selectedSlotIndex] || null;

  return (
    <div className="dashboard-wrapper">
      <Header
        station={FIXED_EV_STATION}
        onRefresh={loadData}
        loading={loading}
      />

      <main className="dashboard-content">
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Fetching Electricity Maps live forecast for EV Station...</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <div>
              <h3>Connection Error</h3>
              <p>{error}</p>
            </div>
            <button className="btn-retry" onClick={loadData}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && forecast && (
          <>
            {/* Slot Picker Controls */}
            <SlotSelector
              slots={forecast.slots}
              selectedSlotIndex={selectedSlotIndex}
              defaultSlotIndex={forecast.defaultSlotIndex}
              onSlotSelect={handleSlotSelect}
            />

            {/* Selected Slot Metric Cards */}
            <SlotDataCard slot={currentSlot} />
          </>
        )}
      </main>
    </div>
  );
}
