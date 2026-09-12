/**
 * Electricity Forecast Data Service & Model Mapper
 * Handles browser geolocation, API fetching, and slot formatting
 */

const API_BASE_URL = 'http://localhost:5000/api/electricity-maps/forecast';
const DEFAULT_LAT = 23.0225;
const DEFAULT_LON = 72.5714;

/**
 * Get current browser coordinates via HTML5 Geolocation API
 */
export function getBrowserCoordinates() {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      return resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON, source: 'default' });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          source: 'browser',
        });
      },
      (error) => {
        console.warn('Geolocation unavailable or denied, using default:', error.message);
        resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON, source: 'default' });
      },
      { timeout: 5000 }
    );
  });
}

/**
 * Format timestamp into 12-hour or 24-hour slot label (e.g. "03:00 PM - 04:00 PM" / "15:00 - 16:00")
 */
export function formatSlotLabel(dateObj) {
  const startHour = dateObj.getHours();
  const nextHour = (startHour + 1) % 24;

  const pad = (n) => n.toString().padStart(2, '0');
  const format12 = (h) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${pad(hour12)}:00 ${period}`;
  };

  return `${format12(startHour)} - ${format12(nextHour)} (${pad(startHour)}:00 - ${pad(nextHour)}:00)`;
}

/**
 * Fetch 24-hour electricity forecast and normalize into structured hourly slots model
 */
export async function fetchElectricityForecast(lat, lon) {
  const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch forecast (${response.status} ${response.statusText})`);
  }

  const raw = await response.json();

  const renewableList = raw.renewable_energy_share?.data || [];
  const loadList = raw.total_grid_load?.data || [];
  const carbonList = raw.carbon_intensity?.data || [];

  const now = new Date();
  const currentLocalHour = now.getHours();

  // Combine into normalized hourly model slots
  const slots = [];
  const count = Math.max(renewableList.length, loadList.length, 24);

  for (let i = 0; i < count; i++) {
    const rItem = renewableList[i];
    const lItem = loadList[i];
    const cItem = carbonList[i];

    const datetimeStr = rItem?.datetime || lItem?.datetime || cItem?.datetime;
    const slotDate = datetimeStr ? new Date(datetimeStr) : new Date(now.getTime() + i * 3600000);
    const slotHour = slotDate.getHours();

    const isCurrent = slotHour === currentLocalHour;

    const renewableVal = rItem?.value !== undefined && rItem?.value !== null
      ? Math.round(Number(rItem.value))
      : null;

    const loadVal = lItem?.value !== undefined && lItem?.value !== null
      ? Math.round(Number(lItem.value))
      : null;

    const carbonVal = cItem?.value !== undefined && cItem?.value !== null
      ? Math.round(Number(cItem.value))
      : null;

    slots.push({
      id: `slot-${i}`,
      index: i,
      hour: slotHour,
      label: formatSlotLabel(slotDate),
      shortLabel: `${slotHour.toString().padStart(2, '0')}:00 - ${((slotHour + 1) % 24).toString().padStart(2, '0')}:00`,
      datetime: slotDate.toISOString(),
      renewablePercent: renewableVal,
      renewableUnit: raw.renewable_energy_share?.unit || '%',
      totalGridLoad: loadVal,
      loadUnit: raw.total_grid_load?.unit || 'MW',
      carbonIntensity: carbonVal,
      carbonUnit: raw.carbon_intensity?.unit || 'gCO2eq/kWh',
      isCurrent,
    });
  }

  // Find index of slot matching current local hour, or default to first
  const currentSlotIndex = slots.findIndex((s) => s.isCurrent);
  const defaultIndex = currentSlotIndex !== -1 ? currentSlotIndex : 0;

  return {
    location: raw.location || { latitude: lat, longitude: lon },
    status: raw.status || 'success',
    source: raw.source || 'live',
    slots,
    defaultSlotIndex: defaultIndex,
  };
}
