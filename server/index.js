import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import electricityMapsRouter from './electricityMaps.js';
import optimizerRouter from './routes/optimizerRoutes.js';
import databaseRouter from './routes/databaseRoutes.js';
import { connectDB } from './Database/db.js';

dotenv.config();

// Connect to MongoDB asynchronously (non-blocking: won't halt server startup or API routes)
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Electricity Maps API Route
app.use('/api/electricity-maps', electricityMapsRouter);

// Python CP-SAT Optimizer Bridge Route
app.use('/api/optimizer', optimizerRouter);

// MongoDB Database Explorer & Live Test Route
app.use('/api/database', databaseRouter);

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
      optimizerBridgeStatus: 'GET /api/optimizer/status',
      optimizerSampleInput: 'GET /api/optimizer/sample-input',
      optimizerLatestSchedule: 'GET /api/optimizer/latest',
      optimizerRunSolve: 'POST /api/optimizer/optimize',
      databaseStatus: 'GET /api/database/status',
      databaseCollections: 'GET /api/database/collections',
      databaseData: 'GET /api/database/data?collection=data&limit=20',
      databaseInsertTest: 'POST /api/database/insert-test',
      databaseReconnect: 'POST /api/database/reconnect',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Electricity Maps API: http://localhost:${PORT}/api/electricity-maps/forecast?lat=23.188551&lon=72.626715`);
  console.log(`Python Optimizer Bridge: http://localhost:${PORT}/api/optimizer/status`);
});

