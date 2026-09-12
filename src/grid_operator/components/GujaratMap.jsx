import React from 'react';

export default function GujaratMap({ regions, onSelectRegion }) {
  return (
    <div className="map-widget-container">
      <svg
        viewBox="0 0 380 280"
        className="gujarat-map-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background ocean/subtle grid if needed */}
        <rect width="380" height="280" fill="#F0FDF4" rx="8" />

        {/* Gulf of Kutch and Gulf of Khambhat waters */}
        <path
          d="M 110 135 Q 160 145 190 135 Q 150 160 110 145 Z"
          fill="#DCFCE7"
          opacity="0.6"
        />
        <path
          d="M 230 200 Q 250 220 260 270 Q 235 240 220 210 Z"
          fill="#DCFCE7"
          opacity="0.6"
        />

        {/* 1. Kutch Region (Island / Northwest) */}
        <path
          d="M 40 100 
             C 60 70, 110 60, 170 70 
             C 185 85, 175 110, 160 125 
             C 120 135, 75 130, 45 115 Z"
          fill="#BBF7D0"
          stroke="#4ADE80"
          strokeWidth="1.5"
          className="map-region kutch"
        />

        {/* 2. North Gujarat */}
        <path
          d="M 170 70 
             C 210 50, 280 50, 310 80 
             C 320 110, 290 130, 260 130 
             C 210 130, 185 105, 170 70 Z"
          fill="#86EFAC"
          stroke="#22C55E"
          strokeWidth="1.5"
          className="map-region north"
        />

        {/* 3. Saurashtra (Southwest Peninsula) */}
        <path
          d="M 70 160 
             C 105 140, 165 140, 205 160 
             C 230 190, 220 230, 170 245 
             C 110 250, 60 210, 70 160 Z"
          fill="#A7F3D0"
          stroke="#34D399"
          strokeWidth="1.5"
          className="map-region saurashtra"
        />

        {/* 4. Central Gujarat */}
        <path
          d="M 210 130 
             C 260 130, 300 130, 320 160 
             C 310 190, 260 200, 225 185 
             C 215 165, 210 145, 210 130 Z"
          fill="#6EE7B7"
          stroke="#10B981"
          strokeWidth="1.5"
          className="map-region central"
        />

        {/* 5. South Gujarat */}
        <path
          d="M 240 200 
             C 270 195, 310 200, 315 230 
             C 310 270, 270 275, 255 270 
             C 245 250, 240 220, 240 200 Z"
          fill="#4ADE80"
          stroke="#16A34A"
          strokeWidth="1.5"
          className="map-region south"
        />
      </svg>

      {/* Regional Load Data Badges Overlay */}
      {regions.map((reg) => (
        <div
          key={reg.id}
          className="map-badge-pill"
          style={{ left: `${(reg.coords.x / 380) * 100}%`, top: `${(reg.coords.y / 280) * 100}%` }}
        >
          <span className="map-badge-name">{reg.mapLabel}</span>
          <span className="map-badge-val">{reg.load}</span>
        </div>
      ))}

      {/* Legend Box at bottom-right */}
      <div className="map-legend-box">
        <div className="map-legend-row">
          <span className="legend-dot" style={{ backgroundColor: '#EF4444' }} />
          <span>&gt; 90%</span>
        </div>
        <div className="map-legend-row">
          <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }} />
          <span>70 – 90%</span>
        </div>
        <div className="map-legend-row">
          <span className="legend-dot" style={{ backgroundColor: '#84CC16' }} />
          <span>50 – 70%</span>
        </div>
        <div className="map-legend-row">
          <span className="legend-dot" style={{ backgroundColor: '#10B981' }} />
          <span>&lt; 50%</span>
        </div>
      </div>
    </div>
  );
}
