import React from 'react';
import Chart from 'react-apexcharts';

// Safe component wrapper handling ESM/CJS interop in Vite
const ApexChartComponent = typeof Chart === 'function' ? Chart : (Chart && Chart.default ? Chart.default : Chart);

export default function ApexChartSafe(props) {
  return <ApexChartComponent {...props} />;
}
