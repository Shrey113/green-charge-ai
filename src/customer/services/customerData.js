/**
 * Customer Dashboard Data & API Services
 * Provides mock and live data for EV driver dashboard
 */

export const customerProfile = {
  name: 'Alex',
  role: 'EV Driver',
  location: 'Gandhinagar, Gujarat',
  lastUpdated: 'Sat, Sep 12, 2026 06:24 PM (IST)',
  avatar: 'AL',
  greenScore: 85,
  percentile: 78, // greener than 78% of EV drivers
};

export const vehicleData = {
  model: 'Tesla Model 3',
  batteryCapacity: '75 kWh',
  rangeWltp: '491 km',
  maxChargingPower: '250 kW',
  currentSoc: 78,
  targetSoc: 90,
  minSoc: 20,
  preferredTime: '10:00 PM – 06:00 AM',
  configuredMaxPower: '100 kW',
  preferredStations: 'Any',
};

export const dashboardKpis = {
  currentSoc: '78%',
  targetSoc: '90%',
  estimatedCost: '₹320',
  estimatedTime: '1h 45m',
  recommendedSlot: {
    time: 'Today, 10:00 PM – 12:00 AM',
    badge: 'Optimal Time',
    cost: '₹6.5 / kWh',
    renewableShare: '82%',
    savings: '₹120',
  },
  monthlyImpact: {
    moneySaved: '₹480',
    co2Reduced: '62 kg',
    greenEnergyUsed: '138 kWh',
  },
};

export const stationList = [
  {
    id: 1,
    name: 'Gandhinagar Central',
    status: 'Available',
    statusType: 'available',
    distance: '1.2 km • Gandhinagar, Gujarat',
    chargers: '6/8 Chargers Available',
    power: '50 kW Max Power',
    price: '₹8.0 per kWh',
    coords: { lat: 23.2156, lng: 72.6369 },
  },
  {
    id: 2,
    name: 'DAIICT Charging Station',
    status: 'Busy',
    statusType: 'busy',
    distance: '2.4 km • Gandhinagar, Gujarat',
    chargers: '2/6 Chargers Available',
    power: '22 kW Max Power',
    price: '₹7.5 per kWh',
    coords: { lat: 23.1885, lng: 72.6284 },
  },
  {
    id: 3,
    name: 'SG Highway Station',
    status: 'Available',
    statusType: 'available',
    distance: '5.1 km • Ahmedabad, Gujarat',
    chargers: '8/10 Chargers Available',
    power: '60 kW Max Power',
    price: '₹6.8 per kWh',
    coords: { lat: 23.1121, lng: 72.5432 },
  },
  {
    id: 4,
    name: 'City Center Station',
    status: 'Unavailable',
    statusType: 'unavailable',
    distance: '6.3 km • Gandhinagar, Gujarat',
    chargers: '0/4 Chargers Available',
    power: '22 kW Max Power',
    price: '₹8.5 per kWh',
    coords: { lat: 23.2234, lng: 72.6512 },
  },
];

export const chargingHistorySessions = [
  { id: 1, date: 'Sep 12, 2026', station: 'Gandhinagar Central', energy: '32', cost: '₹256', renewable: '78%', status: 'Completed' },
  { id: 2, date: 'Sep 10, 2026', station: 'DAIICT Station', energy: '28', cost: '₹210', renewable: '85%', status: 'Completed' },
  { id: 3, date: 'Sep 08, 2026', station: 'SG Highway', energy: '45', cost: '₹360', renewable: '62%', status: 'Completed' },
  { id: 4, date: 'Sep 05, 2026', station: 'City Center', energy: '26', cost: '₹208', renewable: '74%', status: 'Completed' },
  { id: 5, date: 'Sep 02, 2026', station: 'Gandhinagar Central', energy: '40', cost: '₹300', renewable: '81%', status: 'Completed' },
  { id: 6, date: 'Aug 30, 2026', station: 'Airport Station', energy: '38', cost: '₹285', renewable: '69%', status: 'Completed' },
  { id: 7, date: 'Aug 28, 2026', station: 'SG Highway', energy: '22', cost: '₹165', renewable: '77%', status: 'Completed' },
];

export const scheduleSummaryData = {
  date: 'Sep 12, 2026',
  chargingTime: '10:00 PM – 12:00 AM',
  estimatedCost: '₹180',
  energyDelivered: '28 kWh',
  expectedSoc: '20% → 90%',
  reasons: [
    { text: 'Lower electricity cost (₹6.5/kWh)', type: 'amber', icon: '₹' },
    { text: '82% renewable energy available', type: 'green', icon: '🍃' },
    { text: 'Avoids peak grid load', type: 'red', icon: '⚡' },
    { text: 'Estimated savings of ₹120', type: 'green', icon: '🪙' },
  ],
};

export const analyticsSummaryData = {
  energyCharged: '812 kWh',
  moneySaved: '₹620',
  co2Reduced: '276 kg',
  renewableShare: '74%',
  achievementMessage: "You're doing great! You've used 74% renewable energy this month.",
};
