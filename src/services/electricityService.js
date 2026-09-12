/**
 * Electricity Forecast Data Service & Model Mapper
 * Uses fixed EV Network Station Location:
 * Latitude: 23.188551, Longitude: 72.626715
 * No browser location prompt required.
 */

const API_BASE_URL = 'http://localhost:5000/api/electricity-maps/forecast';

export const FIXED_EV_STATION = {
  name: 'Gandhinagar EV Charging Hub',
  latitude: 23.188551,
  longitude: 72.626715,
};

/**
 * Calculate estimated Carbon Intensity (gCO2eq/kWh) when API returns empty data
 * Uses Central Electricity Authority (CEA) Indian Grid baseline:
 * - Thermal coal generation factor: ~820 gCO2eq/kWh
 * - Clean renewable factor: ~25 gCO2eq/kWh
 * Formula: 820 * (1 - renew%/100) + 25 * (renew%/100)
 */
export function calculateCarbonIntensity(renewablePercent) {
  if (renewablePercent === null || renewablePercent === undefined) return 720;
  const renewFraction = Math.min(1, Math.max(0, Number(renewablePercent) / 100));
  return Math.round(820 * (1 - renewFraction) + 25 * renewFraction);
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
 * Fetch 24-hour electricity forecast for the fixed station location
 */
export async function fetchElectricityForecast(
  lat = FIXED_EV_STATION.latitude,
  lon = FIXED_EV_STATION.longitude
) {
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

    let carbonVal = null;
    let isCarbonEstimated = false;

    if (cItem?.value !== undefined && cItem?.value !== null) {
      carbonVal = Math.round(Number(cItem.value));
      isCarbonEstimated = Boolean(cItem.isEstimated);
    } else {
      // Zone IN-WE has no direct forecast from API; calculate via CEA grid baseline
      carbonVal = calculateCarbonIntensity(renewableVal);
      isCarbonEstimated = true;
    }

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
      isCarbonEstimated,
      carbonUnit: raw.carbon_intensity?.unit || 'gCO2eq/kWh',
      isCurrent,
    });
  }

  // Find index of slot matching current local hour, or default to first
  const currentSlotIndex = slots.findIndex((s) => s.isCurrent);
  const defaultIndex = currentSlotIndex !== -1 ? currentSlotIndex : 0;

  return {
    location: {
      stationName: FIXED_EV_STATION.name,
      latitude: lat,
      longitude: lon,
    },
    status: raw.status || 'success',
    source: raw.source || 'live',
    slots,
    defaultSlotIndex: defaultIndex,
  };
}
