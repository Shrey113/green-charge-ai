import express from 'express';
import mongoose from 'mongoose';
import {
  getConnectionState,
  listCollectionsWithCounts,
  getCollectionDocuments,
  insertDocument,
  reconnectDB,
} from '../Database/db.js';

const router = express.Router();

/**
 * GET /api/database/status
 * Returns current MongoDB connection health, masked URI, and error diagnostics
 */
router.get('/status', (req, res) => {
  const status = getConnectionState();
  res.json({
    success: true,
    ...status,
  });
});

/**
 * POST /api/database/reconnect
 * Reconnect to MongoDB (e.g. after updating password in .env)
 */
router.post('/reconnect', async (req, res) => {
  try {
    await reconnectDB();
    const status = getConnectionState();
    res.json({
      success: true,
      message: status.connected
        ? 'Successfully reconnected to MongoDB!'
        : 'Connection attempt finished. Check status for details.',
      status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Reconnection failed',
      error: error.message,
    });
  }
});

/**
 * GET /api/database/collections
 * List all collections and document counts in the active database
 */
router.get('/collections', async (req, res) => {
  try {
    const result = await listCollectionsWithCounts();
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to list collections',
      error: error.message,
    });
  }
});

/**
 * GET /api/database/data
 * Query documents from a specified collection with pagination
 * Query params: ?collection=<name>&limit=25&page=1
 */
router.get('/data', async (req, res) => {
  let collectionName = req.query.collection;

  // Auto-detect best collection if none provided
  if (!collectionName) {
    try {
      const colRes = await listCollectionsWithCounts();
      const colList = colRes.collections || [];
      const carCol = colList.find((c) => c.name === 'car_customer');
      if (carCol) {
        collectionName = 'car_customer';
      } else if (colList.length > 0) {
        collectionName = colList[0].name;
      } else {
        collectionName = 'car_customer';
      }
    } catch {
      collectionName = 'car_customer';
    }
  }

  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);

  try {
    const result = await getCollectionDocuments(collectionName, { limit, page });
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to query collection '${collectionName}'`,
      error: error.message,
    });
  }
});

/**
 * GET /api/database/stations
 * Query charging stations from 'station_operator' collection with search, status filtering, and pagination
 */
router.get('/stations', async (req, res) => {
  const { search, status, city, limit = 20, page = 1 } = req.query;
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);

  try {
    const filter = {};
    if (status && status !== 'all') {
      filter.stationStatus = status;
    }
    if (city && city !== 'all') {
      filter['location.city'] = new RegExp(city, 'i');
    }
    if (search) {
      filter.$or = [
        { stationName: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { 'location.state': new RegExp(search, 'i') },
        { stationId: new RegExp(search, 'i') },
      ];
    }

    const result = await getCollectionDocuments('station_operator', {
      limit: parsedLimit,
      page: parsedPage,
      filter,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch charging stations',
      error: error.message,
    });
  }
});

/**
 * POST /api/database/insert-test
 * Insert a sample EV customer/charging data record into the database for live testing
 */
router.post('/insert-test', async (req, res) => {
  const collectionName = req.body?.collection || 'car_customer';

  // Sample EV car_customer payload matching MongoDB Atlas green_charge_ai schema
  const samplePayload = req.body?.document || {
    customerId: `CUST0${Math.floor(10 + Math.random() * 90)}`,
    name: 'Pooja Sharma',
    contact: {
      phone: '+91 98765 43210',
      email: 'pooja.sharma@example.com',
    },
    vehicle: {
      make: 'Tata',
      model: 'Nexon EV Max',
      year: 2024,
      batteryCapacityKwh: 40.5,
      currentSocPercent: 32,
      maxChargingPowerKw: 50,
      connectorType: 'CCS2',
      plateNumber: 'GJ-01-EV-2024',
    },
    chargingRequest: {
      targetSocPercent: 85,
      requiredEnergyKwh: 21.46,
      arrivalSlot: '14:00 - 15:00',
      departureDeadline: '17:30',
      preferredGreenOnly: true,
      urgency: 'medium',
      maxTariffInr: 8.5,
    },
    chargingStatus: {
      status: 'scheduled',
      allocatedSlot: '15:00 - 16:00',
      stationId: 'Gandhinagar Hub - Station #01',
      assignedCharger: 'CHARGER_02',
      estimatedCostInr: 155.6,
      co2SavedKg: 17.6,
      greenEnergyPercentage: 88,
      currentProgressPercent: 0,
      chargingStartTime: null,
      lastUpdated: new Date().toISOString(),
    },
    createdAt: new Date(),
  };

  try {
    const result = await insertDocument(collectionName, samplePayload);
    res.json({
      success: true,
      message: `Successfully inserted record into '${collectionName}'!`,
      collection: collectionName,
      ...result,
      document: samplePayload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to insert test document into collection '${collectionName}'`,
      error: error.message,
    });
  }
});

export default router;
