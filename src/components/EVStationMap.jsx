import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fixed EV Station Location from .env or default Gandhinagar Hub
const DEFAULT_EV_STATION = {
  lat: Number(import.meta.env.VITE_ELECTRICITY_MAPS_LAT) || 23.188551,
  lon: Number(import.meta.env.VITE_ELECTRICITY_MAPS_LON) || 72.626715,
};

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Helper component to smoothly animate (flyTo) map and trigger popup when moving to a new station
function RecenterView({ center, zoom, markerRef }) {
  const map = useMap();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!center || !center[0] || !center[1]) return;

    const targetZoom = zoom !== undefined ? zoom : map.getZoom();

    // Instant setView on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      map.setView(center, targetZoom);
      const timer = setTimeout(() => {
        if (markerRef && markerRef.current) {
          try {
            markerRef.current.openPopup();
          } catch { }
        }
      }, 200);
      return () => clearTimeout(timer);
    }

    // Smooth cinematic flyTo animation to new station location
    map.flyTo(center, targetZoom, {
      duration: 1.3, // 1.3 seconds smooth flight
      easeLinearity: 0.25,
    });

    let opened = false;
    const openWhenLanded = () => {
      if (opened) return;
      opened = true;
      if (markerRef && markerRef.current) {
        try {
          markerRef.current.openPopup();
        } catch { }
      }
    };

    map.once("moveend", openWhenLanded);
    // Fallback timer in case moveend doesn't trigger
    const fallbackTimer = setTimeout(openWhenLanded, 1400);

    return () => {
      map.off("moveend", openWhenLanded);
      clearTimeout(fallbackTimer);
    };
  }, [center, zoom, map, markerRef]);

  return null;
}

export default function EVStationMap({
  station,
  stations = [],
  zoom = 10,
  onSelectStation,
  height = "100%",
  style = {},
}) {
  const markerRef = useRef(null);

  const lat = station?.location?.latitude ? Number(station.location.latitude) : DEFAULT_EV_STATION.lat;
  const lon = station?.location?.longitude ? Number(station.location.longitude) : DEFAULT_EV_STATION.lon;
  const stationName = station?.stationName || "GreenCharge AI EV Station";
  const city = station?.location?.city || "Gandhinagar Hub";

  return (
    <div style={{ width: "100%", height, position: "relative", borderRadius: "16px", overflow: "hidden", ...style }}>
      <MapContainer
        center={[lat, lon]}
        zoom={zoom}
        style={{ width: "100%", height: "100%", minHeight: "450px" }}
      >
        <RecenterView center={[lat, lon]} zoom={zoom} markerRef={markerRef} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Selected EV Station Marker (Auto-opens Popup) */}
        <Marker
          key={`selected-${station?.stationId || station?._id || `${lat}-${lon}`}`}
          ref={(node) => {
            markerRef.current = node;
          }}
          position={[lat, lon]}
          icon={customIcon}
        >
          <Popup autoPan={false}>
            <div style={{ minWidth: "160px", padding: "2px 0" }}>
              <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                {stationName}
              </strong>
              <div style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.5" }}>
                {city}
                <br />
                Latitude: {lat}
                <br />
                Longitude: {lon}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Service Radius Circle */}
        <Circle
          center={[lat, lon]}
          radius={2000}
          pathOptions={{
            color: "#10b981",
            fillColor: "#10b981",
            fillOpacity: 0.12,
          }}
        />

        {/* Other Stations Markers */}
        {stations
          .filter(
            (st) =>
              st.location?.latitude &&
              st.location?.longitude &&
              (Number(st.location.latitude) !== lat || Number(st.location.longitude) !== lon)
          )
          .map((st) => (
            <Marker
              key={st.stationId || st._id}
              position={[Number(st.location.latitude), Number(st.location.longitude)]}
              icon={customIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectStation) {
                    onSelectStation(st.stationId || st._id);
                  }
                },
              }}
            >
              <Popup>
                <div style={{ minWidth: "160px", padding: "2px 0" }}>
                  <strong style={{ fontSize: "14px", color: "#0f172a", display: "block", marginBottom: "4px" }}>
                    {st.stationName}
                  </strong>
                  <div style={{ fontSize: "12.5px", color: "#475569", lineHeight: "1.5" }}>
                    {st.location.city || "Gujarat"}
                    <br />
                    Capacity: {st.totalPowerCapacityKW ? `${st.totalPowerCapacityKW} kW` : "N/A"}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
