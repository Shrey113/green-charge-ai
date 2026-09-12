import React, { useState } from 'react';
import stationCentralImg from '../assets/station_central.jpg';
import stationDaiictImg from '../assets/station_daiict.jpg';
import stationSgHwyImg from '../assets/station_sg_highway.jpg';
import stationCityCenterImg from '../assets/station_city_center.jpg';

export default function FindStations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);

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

      {/* Main Split Layout: Station Cards on Left, Map on Right */}
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

        {/* Right Column: Stylized Gandhinagar Map */}
        <div className="stations-map-col">
          <div className="stations-map-container">
            {/* Top Floating Map Legend */}
            <div className="map-floating-legend">
              <span className="map-legend-item">
                <span className="dot dot-available" />
                <span>Available</span>
              </span>
              <span className="map-legend-item">
                <span className="dot dot-busy" />
                <span>Busy</span>
              </span>
              <span className="map-legend-item">
                <span className="dot dot-unavailable" />
                <span>Unavailable</span>
              </span>
            </div>

            {/* Stylized SVG Map of Gandhinagar */}
            <svg
              viewBox="0 0 460 520"
              className="gandhinagar-map-svg"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
            >
              <defs>
                <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Map Land Background */}
              <rect width="460" height="520" fill="#F8FAFC" />

              {/* Park & Green Area patches */}
              <path d="M 60 40 Q 120 20 180 60 T 220 120 Q 140 130 80 100 Z" fill="#DCFCE7" opacity="0.7" />
              <path d="M 280 180 Q 360 160 420 200 T 400 300 Q 320 280 280 220 Z" fill="#DCFCE7" opacity="0.6" />
              <path d="M 40 280 Q 100 260 140 310 T 110 420 Q 50 380 40 280 Z" fill="#DCFCE7" opacity="0.7" />

              {/* Sabarmati River curve */}
              <path
                d="M 330 0 C 310 100, 290 180, 270 260 C 250 340, 280 420, 260 520 L 300 520 C 320 420, 290 340, 310 260 C 330 180, 350 100, 370 0 Z"
                fill="#BFDBFE"
                opacity="0.8"
              />

              {/* Road Grid lines */}
              <line x1="20" y1="90" x2="440" y2="90" stroke="#E2E8F0" strokeWidth="4" />
              <line x1="20" y1="170" x2="440" y2="170" stroke="#E2E8F0" strokeWidth="4" />
              <line x1="20" y1="260" x2="440" y2="260" stroke="#CBD5E1" strokeWidth="6" /> {/* Major Ring road */}
              <line x1="20" y1="360" x2="440" y2="360" stroke="#E2E8F0" strokeWidth="4" />
              <line x1="20" y1="450" x2="440" y2="450" stroke="#E2E8F0" strokeWidth="4" />

              <line x1="90" y1="20" x2="90" y2="500" stroke="#E2E8F0" strokeWidth="4" />
              <line x1="190" y1="20" x2="190" y2="500" stroke="#CBD5E1" strokeWidth="6" /> {/* CH road */}
              <line x1="380" y1="20" x2="380" y2="500" stroke="#E2E8F0" strokeWidth="4" />

              {/* Highway SG Angle */}
              <path d="M 40 500 L 220 180" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />

              {/* City Name Label */}
              <text x="290" y="320" className="map-city-label">Gandhinagar</text>

              {/* Station Markers / Pins */}
              {stations.map((s) => {
                const isSelected = selectedStation === s.id;
                let pinColor = '#10B981';
                if (s.statusType === 'busy') pinColor = '#F59E0B';
                if (s.statusType === 'unavailable') pinColor = '#EF4444';

                return (
                  <g
                    key={`pin-${s.id}`}
                    transform={`translate(${s.mapCoords.x}, ${s.mapCoords.y})`}
                    filter="url(#pinShadow)"
                    className="map-station-pin-group"
                    onClick={() => setSelectedStation(s.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle cx="0" cy="-18" r="22" fill={pinColor} opacity="0.3">
                        <animate attributeName="r" values="16;24;16" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Pin shape */}
                    <path
                      d="M 0 0 C -8 -10, -14 -16, -14 -24 A 14 14 0 0 1 14 -24 C 14 -16, 8 -10, 0 0 Z"
                      fill={pinColor}
                    />
                    {/* Inner White dot */}
                    <circle cx="0" cy="-24" r="5" fill="#FFFFFF" />

                    {/* Label tooltip if selected */}
                    {isSelected && (
                      <g transform="translate(0, -42)">
                        <rect x="-65" y="-18" width="130" height="24" rx="12" fill="#0F172A" />
                        <text x="0" y="-3" fill="#FFFFFF" fontSize="10" fontWeight="600" textAnchor="middle">
                          {s.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom Right Map Zoom Controls */}
            <div className="map-zoom-controls">
              <button
                type="button"
                className="zoom-btn"
                onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
              >
                +
              </button>
              <button
                type="button"
                className="zoom-btn"
                onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
              >
                −
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
