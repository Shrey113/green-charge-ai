/**
 * GreenCharge AI - Customer Portal Dynamic Chart Data & Helpers
 * Contains datasets and config presets for all 6 presentation slides.
 */

// Common Chart Styling Options
export const chartTheme = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  colors: {
    primary: '#10B981',      // Emerald Green
    primaryDark: '#059669',  // Dark Emerald
    primaryLight: '#34D399', // Mint
    accentBlue: '#3B82F6',   // Blue
    accentAmber: '#F59E0B',  // Amber/Gold
    accentPurple: '#8B5CF6', // Purple
    textMain: '#0F172A',
    textMuted: '#64748B',
    gridBorder: '#F1F5F9',
  },
};

// ==========================================
// SLIDE 1: DASHBOARD OVERVIEW DATA
// ==========================================
export const dashboardData = {
  greenScore: 85,
  hourlyForecast: [
    { hour: '00:00', price: 7.2, renewable: 35 },
    { hour: '02:00', price: 6.0, renewable: 45 },
    { hour: '04:00', price: 5.2, renewable: 55 },
    { hour: '06:00', price: 6.8, renewable: 60 },
    { hour: '08:00', price: 11.5, renewable: 50 },
    { hour: '10:00', price: 9.8, renewable: 75 },
    { hour: '12:00', price: 7.0, renewable: 88 },
    { hour: '14:00', price: 6.5, renewable: 82 },
    { hour: '16:00', price: 8.5, renewable: 70 },
    { hour: '18:00', price: 13.8, renewable: 45 },
    { hour: '20:00', price: 11.0, renewable: 52 },
    { hour: '22:00', price: 6.5, renewable: 82 },
    { hour: '24:00', price: 5.8, renewable: 78 },
  ],
};

// ==========================================
// SLIDE 2: FIND STATIONS DATA
// ==========================================
export const stationAnalyticsData = {
  // Station Occupancy Hourly Forecast (06:00 - 24:00)
  stationOccupancy: {
    1: { // Gandhinagar Central
      name: 'Gandhinagar Central',
      hours: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
      occupancyPct: [20, 50, 75, 60, 45, 70, 88, 65, 30, 15],
      waitMinutes: [0, 5, 12, 5, 0, 8, 15, 6, 0, 0],
      solarGenKw: [5, 25, 48, 52, 45, 30, 5, 0, 0, 0],
    },
    2: { // DAIICT Station
      name: 'DAIICT Charging Station',
      hours: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
      occupancyPct: [15, 65, 85, 90, 80, 85, 75, 55, 35, 20],
      waitMinutes: [0, 10, 20, 25, 18, 20, 15, 5, 0, 0],
      solarGenKw: [2, 12, 22, 24, 20, 14, 2, 0, 0, 0],
    },
    3: { // SG Highway Station
      name: 'SG Highway Station',
      hours: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
      occupancyPct: [30, 45, 55, 50, 40, 60, 70, 65, 40, 25],
      waitMinutes: [0, 0, 5, 0, 0, 5, 8, 5, 0, 0],
      solarGenKw: [10, 35, 58, 62, 55, 38, 8, 0, 0, 0],
    },
    4: { // City Center Station
      name: 'City Center Station',
      hours: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
      occupancyPct: [40, 70, 95, 95, 90, 95, 100, 85, 50, 30],
      waitMinutes: [5, 15, 30, 35, 28, 30, 40, 20, 5, 0],
      solarGenKw: [0, 5, 12, 15, 12, 8, 0, 0, 0, 0],
    },
  },

  // Station comparison benchmarks
  comparison: {
    stations: ['Gandhinagar Central', 'DAIICT', 'SG Highway', 'City Center'],
    powerKw: [50, 22, 60, 22],
    pricePerKwh: [8.0, 7.5, 6.8, 8.5],
    renewableShare: [78, 85, 82, 64],
  },
};

// ==========================================
// SLIDE 3: MY EV DATA & DYNAMIC CHARGING CURVE
// ==========================================
export const getChargingCurve = (maxPowerStr = '100 kW', targetSoc = 90) => {
  const peakKw = parseInt(maxPowerStr, 10) || 100;
  const socPoints = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  
  // Realistic EV taper curve (CC-CV algorithm)
  const powerPoints = socPoints.map((soc) => {
    if (soc > targetSoc) return 0;
    if (soc <= 50) return peakKw;
    if (soc <= 70) return Math.round(peakKw * 0.82);
    if (soc <= 80) return Math.round(peakKw * 0.62);
    if (soc <= 90) return Math.round(peakKw * 0.38);
    return Math.round(peakKw * 0.18);
  });

  return {
    socPoints,
    powerPoints,
    peakKw,
  };
};

// ==========================================
// SLIDE 4: CHARGING HISTORY DATA
// ==========================================
export const historyAnalyticsData = {
  sessions: [
    { date: 'Aug 28', station: 'SG Highway', energy: 22, cost: 165, renewable: 77 },
    { date: 'Aug 30', station: 'Airport Station', energy: 38, cost: 285, renewable: 69 },
    { date: 'Sep 02', station: 'Gandhinagar Central', energy: 40, cost: 300, renewable: 81 },
    { date: 'Sep 05', station: 'City Center', energy: 26, cost: 208, renewable: 74 },
    { date: 'Sep 08', station: 'SG Highway', energy: 45, cost: 360, renewable: 62 },
    { date: 'Sep 10', station: 'DAIICT Station', energy: 28, cost: 210, renewable: 85 },
    { date: 'Sep 12', station: 'Gandhinagar Central', energy: 32, cost: 256, renewable: 78 },
  ],
  stationDistribution: {
    labels: ['Gandhinagar Central', 'DAIICT Station', 'SG Highway', 'City Center', 'Airport Station'],
    series: [72, 28, 67, 26, 38], // kWh
  },
};

// ==========================================
// SLIDE 5: SCHEDULE OPTIMIZATION DATA
// ==========================================
export const scheduleChartData = {
  dayView: {
    hours: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24'],
    tariffPrice: [7.2, 6.0, 5.2, 6.8, 11.5, 9.8, 7.0, 6.5, 8.5, 13.8, 11.0, 6.5, 5.8], // ₹/kWh
    renewableShare: [35, 45, 55, 60, 50, 75, 88, 82, 70, 45, 52, 82, 78],              // %
    scheduledKw: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 11],                            // 11kW home/station charge at 22:00-24:00
  },
  weekView: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    energyCharged: [22, 0, 35, 18, 0, 42, 28], // kWh
    savings: [140, 0, 220, 115, 0, 280, 185],  // ₹ saved
    greenPct: [82, 75, 88, 80, 74, 91, 85],     // %
  },
};

// ==========================================
// SLIDE 6: ANALYTICS MULTI-PERIOD DATA
// ==========================================
export const analyticsDatasets = {
  'Last 7 Days': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    energy: [18, 26, 12, 34, 22, 40, 28],
    cost: [135, 195, 90, 255, 165, 300, 210],
    renewable: [72, 84, 68, 88, 76, 92, 85],
    sessions: [1, 2, 1, 2, 1, 3, 2],
  },
  'Last 30 Days': {
    labels: ['Aug 15', 'Aug 22', 'Aug 29', 'Sep 5', 'Sep 12'],
    energy: [40, 65, 85, 110, 138],
    cost: [160, 210, 240, 275, 290],
    renewable: [55, 68, 62, 79, 85],
    sessions: [8, 11, 14, 16, 19],
  },
  'Last 90 Days': {
    labels: ['June', 'July', 'August', 'September'],
    energy: [220, 265, 310, 285],
    cost: [1650, 1980, 2250, 2010],
    renewable: [62, 71, 78, 82],
    sessions: [32, 38, 44, 40],
  },
  'This Year': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4 (Proj)'],
    energy: [620, 780, 890, 950],
    cost: [4800, 5900, 6500, 6800],
    renewable: [64, 72, 79, 84],
    sessions: [95, 120, 135, 145],
  },
};
