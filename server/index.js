import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import electricityMapsRouter from './electricityMaps.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Electricity Maps API Route
app.use('/api/electricity-maps', electricityMapsRouter);

// API health and test endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'connected',
    message: 'Backend server is connected and running locally!',
    port: PORT,
    timestamp: new Date().toLocaleTimeString(),
    routes: {
      electricityMapsForecast: 'GET /api/electricity-maps/forecast?lat=<lat>&lon=<lon>',
      electricityMapsStatus: 'GET /api/electricity-maps/status',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Electricity Maps API (Fixed EV Station): http://localhost:${PORT}/api/electricity-maps/forecast?lat=23.188551&lon=72.626715`);
});

