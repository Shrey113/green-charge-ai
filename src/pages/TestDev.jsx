import React, { useState, useEffect, useCallback } from 'react';
import SlotSelector from '../components/SlotSelector.jsx';
import SlotDataCard from '../components/SlotDataCard.jsx';
import {
  FIXED_EV_STATION,
  fetchElectricityForecast,
} from '../services/electricityService.js';

export default function TestDev() {
  const [forecast, setForecast] = useState(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchElectricityForecast(
        FIXED_EV_STATION.latitude,
        FIXED_EV_STATION.longitude
      );
      setForecast(data);
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
    <div className="test-dev-page">
      {/* Test Dev Banner */}
      <div className="test-dev-banner">
        <div>
          <h2 className="test-dev-title">Developer Testing & Forecast Playground</h2>
          <p className="test-dev-subtitle">
            Station: <strong>{FIXED_EV_STATION.name}</strong> ({FIXED_EV_STATION.latitude}° N, {FIXED_EV_STATION.longitude}° E) &bull; Electricity Maps API v4 Live Query
          </p>
        </div>
        <button
          type="button"
          className="btn-refresh-test"
          onClick={loadData}
          disabled={loading}
        >
          {loading ? 'Fetching...' : '↻ Refresh API Data'}
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching Electricity Maps live hourly forecast for station...</p>
        </div>
      )}

      {error && (
        <div className="error-card">
          <div className="error-text">
            <h3>API Connection Notice</h3>
            <p>{error}</p>
          </div>
          <button className="btn-retry" onClick={loadData}>
            Retry Request
          </button>
        </div>
      )}

      {!loading && !error && forecast && (
        <>
          {/* Time Slot Selector */}
          <SlotSelector
            slots={forecast.slots}
            selectedSlotIndex={selectedSlotIndex}
            defaultSlotIndex={forecast.defaultSlotIndex}
            onSlotSelect={handleSlotSelect}
          />

          {/* Metrics for Chosen Slot */}
          <SlotDataCard slot={currentSlot} />
        </>
      )}
    </div>
  );
}
