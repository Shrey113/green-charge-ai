// Loads mock & static data for GreenCharge AI Grid Operator Dashboard from JSON
import data from '../data/gridData.json';

export const gridOverviewData = data.overview;
export const regionalData = data.regional;
export const renewableData = data.renewable;
export const evDemandData = data.evDemand;
export const forecastData = data.forecast;
export const analyticsAlertsData = data.analyticsAlerts;

export default data;
