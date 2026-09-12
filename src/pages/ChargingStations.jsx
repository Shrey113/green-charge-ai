import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchStations } from '../services/databaseService.js';
import EVStationMap from '../components/EVStationMap.jsx';

// Default station thumbnails matching generated architectural EV hub photos
const STATION_IMAGES = [
  '/images/stations/hub_1.jpg',
  '/images/stations/hub_2.jpg',
  '/images/stations/hub_3.jpg',
  '/images/stations/hub_4.jpg',
];

// Fallback seed stations matching user's MongoDB Atlas 'station_operator' schema
const FALLBACK_STATIONS = [
  {
    _id: 'ST001',
    stationId: 'ST001',
    stationName: 'Ahmedabad GreenCharge Hub',
    location: {
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      latitude: 23.0225,
      longitude: 72.5714,
      address: 'Near SG Highway, Ahmedabad',
    },
    stationStatus: 'operational',
    totalPowerCapacityKW: 100,
    chargers: [
      { chargerId: 'CH0011', maxPowerKW: 22, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0012', maxPowerKW: 22, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0013', maxPowerKW: 50, connectorType: 'Type 2', status: 'busy' },
      { chargerId: 'CH0014', maxPowerKW: 50, connectorType: 'CHAdeMO', status: 'available' },
    ],
    stationMetrics: {
      occupancyRatePercent: 45,
      tariffInrPerKwh: 7.5,
      energyDeliveredTodayKwh: 480,
      greenEnergyRatio: 0.84,
      co2SavedTodayKg: 390,
    },
  },
  {
    _id: 'ST002',
    stationId: 'ST002',
    stationName: 'Gandhinagar Central EV Hub',
    location: {
      city: 'Gandhinagar',
      state: 'Gujarat',
      country: 'India',
      latitude: 23.1885,
      longitude: 72.6267,
      address: 'Infocity Road, Gandhinagar',
    },
    stationStatus: 'operational',
    totalPowerCapacityKW: 120,
    chargers: [
      { chargerId: 'CH0021', maxPowerKW: 60, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0022', maxPowerKW: 60, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0023', maxPowerKW: 22, connectorType: 'Type 2', status: 'available' },
      { chargerId: 'CH0024', maxPowerKW: 22, connectorType: 'Type 2', status: 'busy' },
      { chargerId: 'CH0025', maxPowerKW: 50, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0026', maxPowerKW: 50, connectorType: 'CHAdeMO', status: 'available' },
    ],
    stationMetrics: {
      occupancyRatePercent: 28,
      tariffInrPerKwh: 8.0,
      energyDeliveredTodayKwh: 620,
      greenEnergyRatio: 0.91,
      co2SavedTodayKg: 520,
    },
  },
  {
    _id: 'ST003',
    stationId: 'ST003',
    stationName: 'DAIICT Campus EV Station',
    location: {
      city: 'Gandhinagar',
      state: 'Gujarat',
      country: 'India',
      latitude: 23.189,
      longitude: 72.628,
      address: 'DAIICT Campus, Gandhinagar',
    },
    stationStatus: 'busy',
    totalPowerCapacityKW: 80,
    chargers: [
      { chargerId: 'CH0031', maxPowerKW: 22, connectorType: 'Type 2', status: 'busy' },
      { chargerId: 'CH0032', maxPowerKW: 22, connectorType: 'CCS2', status: 'busy' },
      { chargerId: 'CH0033', maxPowerKW: 50, connectorType: 'CCS2', status: 'busy' },
      { chargerId: 'CH0034', maxPowerKW: 50, connectorType: 'CCS2', status: 'available' },
    ],
    stationMetrics: {
      occupancyRatePercent: 75,
      tariffInrPerKwh: 7.5,
      energyDeliveredTodayKwh: 340,
      greenEnergyRatio: 0.88,
      co2SavedTodayKg: 285,
    },
  },
  {
    _id: 'ST004',
    stationId: 'ST004',
    stationName: 'SG Highway Express Supercharger',
    location: {
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      latitude: 23.0725,
      longitude: 72.518,
      address: 'SG Highway, Bodakdev, Ahmedabad',
    },
    stationStatus: 'operational',
    totalPowerCapacityKW: 150,
    chargers: [
      { chargerId: 'CH0041', maxPowerKW: 60, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0042', maxPowerKW: 60, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0043', maxPowerKW: 60, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0044', maxPowerKW: 30, connectorType: 'Type 2', status: 'available' },
    ],
    stationMetrics: {
      occupancyRatePercent: 35,
      tariffInrPerKwh: 6.8,
      energyDeliveredTodayKwh: 890,
      greenEnergyRatio: 0.79,
      co2SavedTodayKg: 710,
    },
  },
  {
    _id: 'ST005',
    stationId: 'ST005',
    stationName: 'Surat Ring Road Charging Plaza',
    location: {
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      latitude: 21.1702,
      longitude: 72.8311,
      address: 'Ring Road, Surat',
    },
    stationStatus: 'operational',
    totalPowerCapacityKW: 90,
    chargers: [
      { chargerId: 'CH0051', maxPowerKW: 30, connectorType: 'CCS2', status: 'available' },
      { chargerId: 'CH0052', maxPowerKW: 30, connectorType: 'Type 2', status: 'available' },
      { chargerId: 'CH0053', maxPowerKW: 30, connectorType: 'CHAdeMO', status: 'busy' },
    ],
    stationMetrics: {
      occupancyRatePercent: 50,
      tariffInrPerKwh: 7.2,
      energyDeliveredTodayKwh: 410,
      greenEnergyRatio: 0.82,
      co2SavedTodayKg: 330,
    },
  },
  {
    _id: 'ST006',
    stationId: 'ST006',
    stationName: 'Vadodara Sayaji EV Station',
    location: {
      city: 'Vadodara',
      state: 'Gujarat',
      country: 'India',
      latitude: 22.3072,
      longitude: 73.1812,
      address: 'Sayajigunj, Vadodara',
    },
    stationStatus: 'unavailable',
    totalPowerCapacityKW: 50,
    chargers: [
      { chargerId: 'CH0061', maxPowerKW: 25, connectorType: 'CCS2', status: 'maintenance' },
      { chargerId: 'CH0062', maxPowerKW: 25, connectorType: 'Type 2', status: 'maintenance' },
    ],
    stationMetrics: {
      occupancyRatePercent: 0,
      tariffInrPerKwh: 8.5,
      energyDeliveredTodayKwh: 0,
      greenEnergyRatio: 0.0,
      co2SavedTodayKg: 0,
    },
  },
];

// Reference User Coordinates (Gandhinagar Center)
const USER_LOCATION = {
  lat: 23.188551,
  lon: 72.626715,
  name: 'Gandhinagar Hub (You)',
};

/**
 * Approximate distance in KM using Haversine formula
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.8;
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export default function ChargingStations() {
  const [stations, setStations] = useState(FALLBACK_STATIONS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const stationsPerPage = 4;

  // Selected station for card highlight & modal
  const [selectedStationId, setSelectedStationId] = useState('ST001');
  const [modalStation, setModalStation] = useState(null);


  // Load stations from MongoDB 'station_operator' (only on mount)
  const loadStationsData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchStations({ page: 1, limit: 50 });
      if (res.documents && res.documents.length > 0) {
        setStations(res.documents);
        setSelectedStationId((prev) => prev || res.documents[0].stationId || res.documents[0]._id);
      } else {
        setStations(FALLBACK_STATIONS);
      }
    } catch (err) {
      console.warn('Using fallback stations due to API error:', err.message);
      setStations(FALLBACK_STATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStationsData();
  }, [loadStationsData]);

  // Extract distinct cities for filter dropdown
  const cityOptions = useMemo(() => {
    const cities = new Set();
    stations.forEach((s) => {
      const c = s.location?.city;
      if (c) cities.add(c);
    });
    return Array.from(cities);
  }, [stations]);

  // Filtered stations based on search and dropdown filters
  const filteredStations = useMemo(() => {
    return stations.filter((st) => {
      const nameMatch =
        !searchQuery ||
        (st.stationName && st.stationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (st.location?.city && st.location.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (st.stationId && st.stationId.toLowerCase().includes(searchQuery.toLowerCase()));

      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'available' &&
          (st.stationStatus === 'operational' || st.stationStatus === 'available')) ||
        (statusFilter === 'busy' && st.stationStatus === 'busy') ||
        (statusFilter === 'unavailable' &&
          (st.stationStatus === 'unavailable' || st.stationStatus === 'maintenance'));

      const cityMatch =
        cityFilter === 'all' ||
        (st.location?.city && st.location.city.toLowerCase() === cityFilter.toLowerCase());

      return nameMatch && statusMatch && cityMatch;
    });
  }, [stations, searchQuery, statusFilter, cityFilter]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredStations.length / stationsPerPage));
  const currentStationsSlice = useMemo(() => {
    const start = (currentPage - 1) * stationsPerPage;
    return filteredStations.slice(start, start + stationsPerPage);
  }, [filteredStations, currentPage]);

  const handleSelectStation = (id) => {
    setSelectedStationId(id);
  };

  const handleOpenDetails = (st, e) => {
    if (e) e.stopPropagation();
    setModalStation(st);
  };

  const handleCloseModal = () => {
    setModalStation(null);
  };

  // Get currently active station object for map popup
  const activeStationObj = useMemo(() => {
    return (
      stations.find((s) => s.stationId === selectedStationId || s._id === selectedStationId) ||
      stations[0] ||
      null
    );
  }, [stations, selectedStationId]);

  return (
    <div className="stations-page">
      {/* Main Two-Column Layout filling 100svh */}
      <div className="stations-layout-grid">
        {/* Left Column: Top Search & Filter + Cards List + Pagination */}
        <div className="stations-left-column">
          {/* Top Search & Filter Bar on Left Side */}
          <div className="stations-top-bar">
            <div className="stations-search-wrapper">
              <span className="stations-search-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="stations-search-input"
                placeholder="Search location (e.g., Gandhinagar, Ahmedabad)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="stations-filter-actions">
              <button
                type="button"
                className={`btn-filter-toggle ${showFilters || statusFilter !== 'all' || cityFilter !== 'all' ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
                {(statusFilter !== 'all' || cityFilter !== 'all') && <span>(Active)</span>}
              </button>
            </div>
          </div>

          {/* Expandable Filter Panel */}
          {showFilters && (
            <div className="filter-dropdown-panel">
              <div className="filter-group">
                <label>Status</label>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available (Operational)</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              <div className="filter-group">
                <label>City</label>
                <select
                  className="filter-select"
                  value={cityFilter}
                  onChange={(e) => {
                    setCityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Cities</option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {(statusFilter !== 'all' || cityFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  className="btn-filter-toggle"
                  style={{ marginTop: '16px', padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => {
                    setStatusFilter('all');
                    setCityFilter('all');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* Google-Style Linear Loading Progress Bar */}
          <div className={`google-linear-loader ${loading ? 'active' : ''}`}>
            <div className="linear-loader-bar"></div>
          </div>

          {/* Scrollable Stations List Area */}
          <div className="stations-scroll-list">
            {currentStationsSlice.length === 0 && !loading ? (
              <div className="empty-db-state">
                <h3 className="empty-db-title">No Stations Found</h3>
                <p className="empty-db-desc">
                  No charging hubs matched your search query. Try adjusting your search term or clearing the filters.
                </p>
              </div>
            ) : (
              currentStationsSlice.map((st, idx) => {
              const id = st.stationId || st._id || `st-${idx}`;
              const isSelected = selectedStationId === id;

              // Assign thumbnail photo from generated realistic EV charging station photos
              const photo = STATION_IMAGES[idx % STATION_IMAGES.length];

              // Calculate available chargers from chargers array
              const chargersList = st.chargers || [];
              const totalChargers = chargersList.length || 4;
              const availableChargers = chargersList.filter(
                (c) => c.status === 'available' || !c.status
              ).length;

              // Max power capacity
              const maxPower =
                st.totalPowerCapacityKW ||
                Math.max(...chargersList.map((c) => c.maxPowerKW || 22), 50);

              // Status badge
              const rawStatus = (st.stationStatus || 'operational').toLowerCase();
              let badgeClass = 'available';
              let badgeLabel = 'Available';

              if (rawStatus === 'busy') {
                badgeClass = 'busy';
                badgeLabel = 'Busy';
              } else if (rawStatus === 'unavailable' || rawStatus === 'maintenance') {
                badgeClass = 'unavailable';
                badgeLabel = 'Unavailable';
              } else {
                badgeClass = 'available';
                badgeLabel = 'Available';
              }

              // Distance calculation from Gandhinagar Hub
              const dist = calculateDistanceKm(
                USER_LOCATION.lat,
                USER_LOCATION.lon,
                st.location?.latitude,
                st.location?.longitude
              );

              // Tariff rate
              const tariff = st.stationMetrics?.tariffInrPerKwh || (7.0 + (idx % 3) * 0.5).toFixed(1);

              return (
                <div
                  key={id}
                  className={`station-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectStation(id)}
                >
                  {/* Station Photo Thumbnail */}
                  <div className="station-thumbnail-box">
                    <img src={photo} alt={st.stationName} className="station-thumbnail-img" />
                  </div>

                  {/* Station Details Content */}
                  <div className="station-info-content">
                    <div className="station-header-row">
                      <div className="station-title-group">
                        <h3 className="station-name-title">{st.stationName || `Charging Hub #${id}`}</h3>
                        <span className={`station-status-badge ${badgeClass}`}>
                          <span style={{ fontSize: '8px' }}>●</span>
                          {badgeLabel}
                        </span>
                      </div>

                      {/* Top Right: "i" Info Icon Button */}
                      <button
                        type="button"
                        className="station-info-btn"
                        title="View Station Details"
                        aria-label="View Station Details"
                        onClick={(e) => handleOpenDetails(st, e)}
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </button>
                    </div>

                    <p className="station-location-subtitle">
                      {dist} km &bull; {st.location?.city || 'Gujarat'}, {st.location?.state || 'India'}
                    </p>

                    {/* Key Specs */}
                    <div className="station-specs-row">
                      <span className="spec-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <strong>{availableChargers}/{totalChargers}</strong> Available
                      </span>

                      <span className="spec-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2">
                          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                          <line x1="12" y1="2" x2="12" y2="12" />
                        </svg>
                        <strong>{maxPower} kW</strong> Max Power
                      </span>

                      <span className="spec-item highlight">
                        ₹{tariff} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '400' }}>per kWh</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>

          {/* Pagination Controls */}
          {filteredStations.length > 0 && (
            <div className="stations-pagination-bar">
              <p className="pagination-text">
                Showing{' '}
                <strong>
                  {Math.min((currentPage - 1) * stationsPerPage + 1, filteredStations.length)}
                </strong>{' '}
                to{' '}
                <strong>
                  {Math.min(currentPage * stationsPerPage, filteredStations.length)}
                </strong>{' '}
                of <strong>{filteredStations.length}</strong> stations
              </p>

              <div className="pagination-buttons">
                <button
                  type="button"
                  className="btn-page-nav"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  &larr; Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`btn-page-nav ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="btn-page-nav"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Leaflet OpenStreetMap View */}
        <div className="stations-map-card">
          <div className="map-header-bar">
            <div>
              <span className="map-badge">LIVE LEAFLET MAP</span>
              <h3 className="map-title">{activeStationObj?.stationName || 'Gandhinagar EV Hub'}</h3>
              <p className="map-subtitle">
                {activeStationObj?.location?.city || 'Gandhinagar'}, Gujarat &bull;{' '}
                {activeStationObj?.location?.latitude || '23.188551'}° N,{' '}
                {activeStationObj?.location?.longitude || '72.626715'}° E
              </p>
            </div>
            {activeStationObj && (
              <button
                type="button"
                className="btn-view-details"
                onClick={() => handleOpenDetails(activeStationObj)}
              >
                Details &rarr;
              </button>
            )}
          </div>
          <div className="map-leaflet-wrapper">
            <EVStationMap
              station={activeStationObj}
              stations={stations}
              onSelectStation={handleSelectStation}
              height="100%"
            />
          </div>
        </div>
      </div>

      {/* Slide-Over Station Details Modal */}
      {modalStation && (
        <div className="station-modal-backdrop" onClick={handleCloseModal}>
          <div className="station-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="station-modal-header">
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>
                  STATION ID: {modalStation.stationId || modalStation._id}
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '20px', color: '#0f172a' }}>
                  {modalStation.stationName}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  {modalStation.location?.address || `${modalStation.location?.city}, Gujarat`} &bull;{' '}
                  {modalStation.location?.latitude}° N, {modalStation.location?.longitude}° E
                </p>
              </div>

              <button type="button" className="btn-close-modal" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            <div className="station-modal-body">
              {/* Stat Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>POWER CAPACITY</span>
                  <h4 style={{ margin: '4px 0 0', fontSize: '16px', color: '#0f172a' }}>
                    {modalStation.totalPowerCapacityKW || 100} kW
                  </h4>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>GREEN RATIO</span>
                  <h4 style={{ margin: '4px 0 0', fontSize: '16px', color: '#059669' }}>
                    {Math.round((modalStation.stationMetrics?.greenEnergyRatio || 0.85) * 100)}% Clean
                  </h4>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>TARIFF RATE</span>
                  <h4 style={{ margin: '4px 0 0', fontSize: '16px', color: '#0f172a' }}>
                    ₹{modalStation.stationMetrics?.tariffInrPerKwh || 7.5} / kWh
                  </h4>
                </div>
              </div>

              {/* Chargers List */}
              <div>
                <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#1e293b' }}>
                  Installed EV Chargers ({modalStation.chargers?.length || 0})
                </h4>

                <div className="chargers-list-grid">
                  {(modalStation.chargers || []).map((ch, i) => (
                    <div key={ch.chargerId || i} className="charger-box-card">
                      <div className="charger-id-tag">
                        <span>{ch.chargerId || `Gun #${i + 1}`}</span>
                        <span
                          style={{
                            fontSize: '10.5px',
                            color: ch.status === 'busy' ? '#d97706' : '#059669',
                            fontWeight: '600',
                          }}
                        >
                          ● {ch.status || 'Available'}
                        </span>
                      </div>
                      <span className="charger-type-tag">Connector: {ch.connectorType || 'CCS2'}</span>
                      <span className="charger-power-tag">{ch.maxPowerKW || 22} kW</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Impact & Telemetry */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#14532d' }}>
                  🌿 Live Station Sustainability Telemetry
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
                  Energy delivered today: <strong>{modalStation.stationMetrics?.energyDeliveredTodayKwh || 540} kWh</strong> &bull; Carbon emissions avoided: <strong>{modalStation.stationMetrics?.co2SavedTodayKg || 420} kg CO₂</strong>. Optimized by GreenCharge AI CP-SAT Grid Engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
