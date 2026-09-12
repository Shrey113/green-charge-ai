import React from 'react';
import Chart from 'react-apexcharts';

// Safe wrapper for react-apexcharts with React 19 / Vite bundler
const ApexChart = typeof Chart === 'function' ? Chart : (Chart && Chart.default ? Chart.default : Chart);

export default ApexChart;
