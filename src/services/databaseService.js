/**
 * MongoDB Atlas Database Explorer & Live Service
 * Connects frontend to Express Backend Database routes (/api/database)
 */

const API_BASE = 'http://localhost:5000/api/database';

/**
 * Fetch live database connection state and diagnostics
 */
export async function fetchDatabaseStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('[databaseService] fetchDatabaseStatus error:', err);
    throw err;
  }
}

/**
 * List all collections and document counts
 */
export async function fetchDatabaseCollections() {
  try {
    const res = await fetch(`${API_BASE}/collections`);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('[databaseService] fetchDatabaseCollections error:', err);
    throw err;
  }
}

/**
 * Fetch documents from a collection with pagination
 */
export async function fetchCollectionData(collectionName = 'data', page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      collection: collectionName,
      page: String(page),
      limit: String(limit),
    });
    const res = await fetch(`${API_BASE}/data?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[databaseService] fetchCollectionData ('${collectionName}') error:`, err);
    throw err;
  }
}

/**
 * Insert a sample EV charging record or custom document
 */
export async function insertTestRecord(collectionName = 'data', customDoc = null) {
  try {
    const res = await fetch(`${API_BASE}/insert-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collection: collectionName,
        document: customDoc,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('[databaseService] insertTestRecord error:', err);
    throw err;
  }
}

/**
 * Re-trigger connection to MongoDB from backend
 */
export async function reconnectDatabase() {
  try {
    const res = await fetch(`${API_BASE}/reconnect`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('[databaseService] reconnectDatabase error:', err);
    throw err;
  }
}

/**
 * Fetch charging stations from 'station_operator' with search, filter, and pagination
 */
export async function fetchStations({ search = '', status = 'all', city = 'all', page = 1, limit = 12 } = {}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    if (city && city !== 'all') params.set('city', city);

    const res = await fetch(`${API_BASE}/stations?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error('[databaseService] fetchStations error:', err);
    throw err;
  }
}
