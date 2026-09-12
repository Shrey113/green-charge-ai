import React, { useState } from 'react';
import stationCentralImg from '../assets/station_central.jpg';
import stationDaiictImg from '../assets/station_daiict.jpg';
import stationSgHwyImg from '../assets/station_sg_highway.jpg';
import stationCityCenterImg from '../assets/station_city_center.jpg';

export default function FindStations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(1);

  const stations = [
    {
      id: 1,
      name: 'Gandhinagar Central',
      status: 'Available',
      statusType: 'available',
      distance: '1.2 km • Gandhinagar, Gujarat',
      chargers: '6/8',
      chargersText: 'Chargers Available',
      power: '50 kW',
      powerText: 'Max Power',
      price: '₹8.0',
      priceUnit: 'per kWh',
      image: stationCentralImg,
      mapCoords: { x: 260, y: 140 },
    },
    {
      id: 2,
      name: 'DAIICT Charging Station',
      status: 'Busy',
      statusType: 'busy',
      distance: '2.4 km • Gandhinagar, Gujarat',
      chargers: '2/6',
      chargersText: 'Chargers Available',
      power: '22 kW',
      powerText: 'Max Power',
      price: '₹7.5',
      priceUnit: 'per kWh',
      image: stationDaiictImg,
      mapCoords: { x: 230, y: 220 },
    },
    {
      id: 3,
      name: 'SG Highway Station',
      status: 'Available',
      statusType: 'available',
      distance: '5.1 km • Ahmedabad, Gujarat',
      chargers: '8/10',
      chargersText: 'Chargers Available',
      power: '60 kW',
      powerText: 'Max Power',
      price: '₹6.8',
      priceUnit: 'per kWh',
      image: stationSgHwyImg,
      mapCoords: { x: 140, y: 350 },
    },
    {
      id: 4,
      name: 'City Center Station',
      status: 'Unavailable',
      statusType: 'unavailable',
      distance: '6.3 km • Gandhinagar, Gujarat',
      chargers: '0/4',
      chargersText: 'Chargers Available',
      power: '22 kW',
      powerText: 'Max Power',
      price: '₹8.5',
      priceUnit: 'per kWh',
      image: stationCityCenterImg,
      mapCoords: { x: 340, y: 400 },
    },
  ];

  const filteredStations = stations.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.distance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="customer-page-content find-stations-page">
      {/* Search and Filters Bar */}
      <div className="stations-search-row">
        <div className="stations-search-input-wrap">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="stations-search-input"
            placeholder="Search location (e.g., Gandhinagar)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button type="button" className="stations-filter-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Filters</span>
        </button>
      </div>

      {/* Main Split Layout: Station Cards on Left, Map Placeholder Box on Right */}
      <div className="stations-split-layout">
        {/* Left Column: Station Cards */}
        <div className="stations-list-col">
          {filteredStations.map((station) => {
            const isSelected = selectedStation === station.id;
            return (
              <div
                key={station.id}
                className={`station-item-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedStation(station.id)}
              >
                {/* Thumbnail image */}
                <div className="station-card-img-wrap">
                  <img
                    src={station.image}
                    alt={station.name}
                    className="station-thumb"
                  />
                </div>

                {/* Details side */}
                <div className="station-card-details">
                  <div className="station-top-meta">
                    <h4 className="station-title">{station.name}</h4>
                    <span className={`station-badge badge-${station.statusType}`}>
                      {station.statusType === 'available' && '+ '}
                      {station.statusType === 'busy' && '⚡ '}
                      {station.status}
                    </span>
                  </div>

                  <p className="station-distance">{station.distance}</p>

                  <div className="station-specs-row">
                    <div className="station-spec">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="12" height="18" rx="2" />
                        <path d="M15 7h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2" />
                      </svg>
                      <span>{station.chargers} {station.chargersText}</span>
                    </div>

                    <div className="station-spec">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#64748B">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span>{station.power} {station.powerText}</span>
                    </div>

                    <div className="station-spec price-spec">
                      <span className="spec-currency">₹</span>
                      <span>{station.price} {station.priceUnit}</span>
                    </div>
                  </div>

                  <div className="station-link-row">
                    <button type="button" className="station-view-details">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Maps Box (Reserved for map integration) */}
        <div className="stations-map-col">
          <div className="stations-map-container maps-heading-container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #A7F3D0',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
              }}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h2 className="maps-heading-text">MAPS</h2>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                Interactive map canvas container
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
