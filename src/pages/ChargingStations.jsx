import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchStations } from '../services/databaseService.js';

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

  // Map zoom level
  const [mapZoom, setMapZoom] = useState(1);

  // Load stations from MongoDB 'station_operator'
  const loadStationsData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchStations({ page: 1, limit: 50 });
      if (res.documents && res.documents.length > 0) {
        setStations(res.documents);
        if (!selectedStationId) {
          setSelectedStationId(res.documents[0].stationId || res.documents[0]._id);
        }
      } else {
        setStations(FALLBACK_STATIONS);
      }
    } catch (err) {
      console.warn('Using fallback stations due to API error:', err.message);
      setStations(FALLBACK_STATIONS);
    } finally {
      setLoading(false);
    }
  }, [selectedStationId]);

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
      {/* Top Search & Filter Bar */}
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

      {/* Main Two-Column Layout */}
      <div className="stations-layout-grid">
        {/* Left Column: Station Cards List & Pagination */}
        <div className="stations-list-container">
          {loading ? (
            <div className="loading-container" style={{ padding: '60px 0' }}>
              <div className="spinner"></div>
              <p>Loading charging stations from MongoDB Atlas...</p>
            </div>
          ) : currentStationsSlice.length === 0 ? (
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
                      <h3 className="station-name-title">{st.stationName || `Charging Hub #${id}`}</h3>
                      <span className={`station-status-badge ${badgeClass}`}>
                        <span style={{ fontSize: '9px' }}>●</span>
                        {badgeLabel}
                      </span>
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
                        <strong>{availableChargers}/{totalChargers}</strong> Chargers Available
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

                    {/* Action Button */}
                    <div className="station-actions-row">
                      <button
                        type="button"
                        className="btn-view-details"
                        onClick={(e) => handleOpenDetails(st, e)}
                      >
                        View Details &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

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

        {/* Right Column: Interactive Map View */}
        <div className="stations-map-card">
          <div className="map-container-inner">
            {/* Top Legend */}
            <div className="map-floating-legend">
              <div className="legend-item">
                <span className="legend-color-dot available"></span>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-dot busy"></span>
                <span>Busy</span>
              </div>
              <div className="legend-item">
                <span className="legend-color-dot unavailable"></span>
                <span>Unavailable</span>
              </div>
            </div>

            {/* Interactive SVG Map with Roads and Gujarat Stations */}
            <svg
              className="interactive-map-svg"
              viewBox="0 0 500 560"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Map Background Canvas */}
              <rect width="500" height="560" fill="#f8fafc" />

              {/* Urban Grid Lines */}
              <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
                <line x1="0" y1="100" x2="500" y2="100" />
                <line x1="0" y1="200" x2="500" y2="200" />
                <line x1="0" y1="300" x2="500" y2="300" />
                <line x1="0" y1="400" x2="500" y2="400" />
                <line x1="100" y1="0" x2="100" y2="560" />
                <line x1="200" y1="0" x2="200" y2="560" />
                <line x1="300" y1="0" x2="300" y2="560" />
                <line x1="400" y1="0" x2="400" y2="560" />
              </g>

              {/* Sabarmati River Water Body */}
              <path
                d="M 320 0 Q 300 120 330 200 T 290 340 T 310 560"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                d="M 320 0 Q 300 120 330 200 T 290 340 T 310 560"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Major Highway Corridors (SG Highway & Ring Road) */}
              <path
                d="M 80 50 L 420 500"
                fill="none"
                stroke="#fed7aa"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 80 50 L 420 500"
                fill="none"
                stroke="#fdba74"
                strokeWidth="4"
              />

              <path
                d="M 40 320 Q 250 360 460 300"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />

              <path
                d="M 120 180 Q 260 140 400 190"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />

              {/* City Region Labels */}
              <text x="210" y="270" fill="#64748b" fontSize="20" fontWeight="700" letterSpacing="1">
                Gandhinagar
              </text>
              <text x="140" y="420" fill="#94a3b8" fontSize="16" fontWeight="600">
                Ahmedabad West
              </text>
              <text x="310" y="480" fill="#94a3b8" fontSize="14" fontWeight="600">
                Surat Corridor
              </text>

              {/* User Location Radar Pulse */}
              <g transform="translate(260, 280)">
                <circle className="user-pulse-circle" cx="0" cy="0" r="14" fill="#3b82f6" opacity="0.4" />
                <circle cx="0" cy="0" r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </g>

              {/* Station Map Pins */}
              {stations.map((st, idx) => {
                const id = st.stationId || st._id || `pin-${idx}`;
                const isSelected = selectedStationId === id;

                // Relative pin coordinates on SVG canvas
                const pinCoordinates = [
                  { x: 260, y: 160 }, // Gandhinagar Central
                  { x: 200, y: 220 }, // DAIICT
                  { x: 190, y: 320 }, // SG Highway
                  { x: 280, y: 380 }, // Ahmedabad Hub
                  { x: 330, y: 440 }, // Surat Plaza
                  { x: 140, y: 400 }, // Vadodara Sayaji
                ];

                const pos = pinCoordinates[idx % pinCoordinates.length];
                const rawStatus = (st.stationStatus || 'operational').toLowerCase();

                let pinColor = '#10b981';
                if (rawStatus === 'busy') pinColor = '#f59e0b';
                if (rawStatus === 'unavailable' || rawStatus === 'maintenance') pinColor = '#ef4444';

                return (
                  <g
                    key={id}
                    className={`map-pin-group ${isSelected ? 'active' : ''}`}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => handleSelectStation(id)}
                  >
                    {/* Selected highlight ring */}
                    {isSelected && (
                      <circle cx="0" cy="-14" r="22" fill={pinColor} opacity="0.25" />
                    )}

                    {/* Teardrop Pin Shape */}
                    <path
                      d="M 0 0 C -12 -12 -14 -24 0 -32 C 14 -24 12 -12 0 0 Z"
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Lightning bolt inside pin */}
                    <path
                      d="M 1 -24 L -4 -17 L 0 -17 L -1 -10 L 4 -17 L 0 -17 Z"
                      fill="#ffffff"
                    />

                    {/* Pin Label on Hover/Selected */}
                    {isSelected && (
                      <g transform="translate(0, -40)">
                        <rect
                          x="-60"
                          y="-16"
                          width="120"
                          height="22"
                          rx="6"
                          fill="#1e293b"
                          opacity="0.92"
                        />
                        <text
                          x="0"
                          y="-2"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="700"
                        >
                          {st.stationName?.slice(0, 16) || id}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Selected Station Floating Card on Map */}
            {activeStationObj && (
              <div className="map-station-popup">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                      {activeStationObj.stationName}
                    </h4>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: '#ecfdf5',
                        color: '#059669',
                        fontWeight: '700',
                      }}
                    >
                      {activeStationObj.stationStatus || 'Operational'}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                    {activeStationObj.location?.city || 'Gandhinagar'}, Gujarat &bull;{' '}
                    <strong>{activeStationObj.totalPowerCapacityKW || 100} kW</strong>
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-view-details"
                  onClick={() => handleOpenDetails(activeStationObj)}
                >
                  Details &rarr;
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="map-zoom-controls">
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setMapZoom((z) => Math.min(2, z + 0.2))}
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                className="btn-zoom"
                onClick={() => setMapZoom((z) => Math.max(0.8, z - 0.2))}
                title="Zoom Out"
              >
                &minus;
              </button>
            </div>
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
