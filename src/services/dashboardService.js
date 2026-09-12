/**
 * Dashboard & Station Network Data Service
 * Provides mock and real-time operational data for EV Network Operator view
 */

export const mockChargersList = [
  { id: 'CP-01', powerKw: 22, status: 'Occupied', type: 'AC Type 2', currentEv: 'EV-203' },
  { id: 'CP-02', powerKw: 22, status: 'Available', type: 'AC Type 2', currentEv: null },
  { id: 'CP-03', powerKw: 11, status: 'Available', type: 'AC Type 2', currentEv: null },
  { id: 'CP-04', powerKw: 50, status: 'Occupied', type: 'DC Fast', currentEv: 'EV-178' },
  { id: 'CP-05', powerKw: 22, status: 'Occupied', type: 'AC Type 2', currentEv: 'EV-156' },
  { id: 'CP-06', powerKw: 11, status: 'Available', type: 'AC Type 2', currentEv: null },
  { id: 'CP-07', powerKw: 50, status: 'Occupied', type: 'DC Fast', currentEv: 'EV-289' },
  { id: 'CP-08', powerKw: 22, status: 'Available', type: 'AC Type 2', currentEv: null },
  { id: 'CP-09', powerKw: 11, status: 'Available', type: 'AC Type 2', currentEv: null },
  { id: 'CP-10', powerKw: 22, status: 'Occupied', type: 'AC Type 2', currentEv: 'EV-312' },
  { id: 'CP-11', powerKw: 50, status: 'Offline', type: 'DC Fast', currentEv: null },
  { id: 'CP-12', powerKw: 22, status: 'Available', type: 'AC Type 2', currentEv: null },
];

export const mockRecentActivity = [
  { time: '10:42 AM', evId: 'EV-203', charger: 'CP-04 (50 kW)', energy: '18.5 kWh', status: 'Charging' },
  { time: '10:28 AM', evId: 'EV-178', charger: 'CP-07 (50 kW)', energy: '32.0 kWh', status: 'Charging' },
  { time: '10:15 AM', evId: 'EV-156', charger: 'CP-02 (22 kW)', energy: '12.4 kWh', status: 'Charging' },
  { time: '09:48 AM', evId: 'EV-134', charger: 'CP-06 (11 kW)', energy: '8.7 kWh', status: 'Completed' },
  { time: '09:12 AM', evId: 'EV-112', charger: 'CP-01 (22 kW)', energy: '21.0 kWh', status: 'Completed' },
];

export const mockEvRequests = [
  { id: 'REQ-101', evId: 'EV-340', model: 'Tata Nexon EV Max', arrival: '11:00 AM', departure: '03:00 PM', batteryKwh: 40.5, neededKwh: 24, priority: 'High' },
  { id: 'REQ-102', evId: 'EV-341', model: 'Mahindra XUV400', arrival: '11:30 AM', departure: '04:00 PM', batteryKwh: 39.4, neededKwh: 18, priority: 'Normal' },
  { id: 'REQ-103', evId: 'EV-342', model: 'Hyundai Ioniq 5', arrival: '12:00 PM', departure: '02:00 PM', batteryKwh: 72.6, neededKwh: 35, priority: 'High' },
  { id: 'REQ-104', evId: 'EV-343', model: 'MG ZS EV', arrival: '01:00 PM', departure: '06:00 PM', batteryKwh: 50.3, neededKwh: 22, priority: 'Normal' },
];

export const stationKpiMetrics = {
  totalChargingPoints: 16,
  availablePoints: 7,
  occupiedPoints: 9,
  offlinePoints: 1,
  occupancyPercent: 56,
  renewableUsedPercent: 68,
  renewableTrendVsLastWeek: '+12%',
  costSavedInr: 1240,
  costSavedTrendVsLastWeek: '+18%',
  environmentalImpact: {
    renewableEnergyUsedKwh: 1320,
    renewableSharePercent: 68,
    co2EmissionsSavedKg: 892,
    treeHoursEquiv: 892,
    greenSupplyProducedKwh: 1320,
  },
};
