import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const BASE_URL = process.env.ELECTRICITY_MAPS_API_URL || 'https://api.electricitymaps.com/v4';
const HORIZON_HOURS = 24;
const TEMPORAL_GRANULARITY = 'hourly';
const FALLBACK_FILE_PATH = path.resolve(__dirname, '../apisample/electricity_forecast.json');

/**
 * Helper to get clean token from environment
 */
function getApiToken() {
  const rawToken = process.env.ELECTRICITY_MAPS_TOKEN || '';
  return rawToken.replace(/['"]/g, '').trim();
}

/**
 * Fetch a single Electricity Maps v4 endpoint
 */
async function fetchEndpoint(endpoint, lat, lon, token) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  url.searchParams.set('horizonHours', HORIZON_HOURS.toString());
  url.searchParams.set('temporalGranularity', TEMPORAL_GRANULARITY);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'auth-token': token,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[ElectricityMaps] ${endpoint} returned status ${response.status}: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`[ElectricityMaps] Error fetching ${endpoint}:`, error.message);
    return null;
  }
}

/**
 * Helper to load local fallback JSON if needed
 */
function getFallbackData(lat, lon) {
  try {
    if (fs.existsSync(FALLBACK_FILE_PATH)) {
      const content = fs.readFileSync(FALLBACK_FILE_PATH, 'utf8');
      const json = JSON.parse(content);
      return {
        ...json,
        location: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        },
        source: 'cached_fallback_file',
      };
    }
  } catch (err) {
    console.warn('[ElectricityMaps] Could not read fallback file:', err.message);
  }
  return null;
}

/**
 * GET /api/electricity-maps/forecast
 * GET /api/electricity-maps
 *
 * Query Params:
 *  - lat: Latitude from browser geolocation
 *  - lon: Longitude from browser geolocation
 */
const handleForecastRequest = async (req, res) => {
  const { lat, lon } = req.query;

  // 1. Validate coordinates passed from browser
  if (!lat || !lon) {
    return res.status(400).json({
      error: 'MISSING_COORDINATES',
      message: 'Latitude and Longitude are required. Please provide ?lat=...&lon=... from browser location.',
      example: '/api/electricity-maps/forecast?lat=23.0225&lon=72.5714',
    });
  }

  const token = getApiToken();

  // 2. If token is missing, use local sample file
  if (!token) {
    console.warn('[ElectricityMaps] ELECTRICITY_MAPS_TOKEN is not set in server/.env. Using fallback.');
    const fallback = getFallbackData(lat, lon);
    if (fallback) {
      return res.json(fallback);
    }
    return res.status(500).json({
      error: 'TOKEN_NOT_CONFIGURED',
      message: 'ELECTRICITY_MAPS_TOKEN is missing in server/.env, and fallback file is unavailable.',
    });
  }

  // 3. Fetch from Electricity Maps v4 (same as electricity_maps_sample.py)
  try {
    const [renewable, totalLoad, carbon] = await Promise.all([
      fetchEndpoint('renewable-energy/forecast', lat, lon, token),
      fetchEndpoint('total-load/forecast', lat, lon, token),
      fetchEndpoint('carbon-intensity/forecast', lat, lon, token),
    ]);

    // If all endpoints failed (e.g. invalid token or network error), use fallback
    if (!renewable && !totalLoad && !carbon) {
      console.warn('[ElectricityMaps] All API calls failed. Checking fallback sample file...');
      const fallback = getFallbackData(lat, lon);
      if (fallback) {
        return res.json(fallback);
      }
      return res.status(502).json({
        error: 'API_ERROR',
        message: 'Electricity Maps API did not return data. Please check your token or coordinates.',
      });
    }

    // Build unified JSON response matching electricity_forecast.json
    const responseData = {
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
      forecast_settings: {
        horizon_hours: HORIZON_HOURS,
        temporal_granularity: TEMPORAL_GRANULARITY,
      },
      renewable_energy_share: {
        unit: '%',
        data: renewable?.data || [],
      },
      total_grid_load: {
        unit: 'MW',
        data: totalLoad?.data || [],
      },
      carbon_intensity: {
        unit: 'gCO2eq/kWh',
        data: carbon?.data || [],
      },
      source: 'electricity_maps_api_v4',
      fetched_at: new Date().toISOString(),
    };

    res.json(responseData);
  } catch (error) {
    console.error('[ElectricityMaps] Unexpected error:', error.message);
    const fallback = getFallbackData(lat, lon);
    if (fallback) {
      return res.json(fallback);
    }
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: error.message,
    });
  }
};

// Route handlers
router.get('/', handleForecastRequest);
router.get('/forecast', handleForecastRequest);

/**
 * GET /api/electricity-maps/status
 * Check configuration status
 */
router.get('/status', (req, res) => {
  const token = getApiToken();
  res.json({
    configured: Boolean(token),
    tokenPreview: token ? `${token.substring(0, 6)}...${token.substring(token.length - 4)}` : null,
    baseUrl: BASE_URL,
    horizonHours: HORIZON_HOURS,
    temporalGranularity: TEMPORAL_GRANULARITY,
  });
});

export default router;
