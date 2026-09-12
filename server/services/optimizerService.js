/**
 * GreenCharge AI — Python Optimizer Service Bridge
 * ================================================
 * Service layer responsible for communicating with the Python CP-SAT
 * optimization microservice (FastAPI on port 8000).
 */

const DEFAULT_PYTHON_URL = 'http://localhost:8000';
const DEFAULT_TIMEOUT_MS = 15000; // 15 seconds

/**
 * Get base URL for the Python Optimization Service from environment
 */
export function getPythonServerUrl() {
  const url = process.env.OPTIMIZATION_SERVICE_URL || DEFAULT_PYTHON_URL;
  return url.replace(/\/+$/, ''); // Strip trailing slash
}

/**
 * Helper to execute fetch with timeout
 */
async function fetchWithTimeout(endpoint, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const baseUrl = getPythonServerUrl();
  const targetUrl = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(targetUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Python service request timed out after ${timeoutMs}ms at ${targetUrl}`);
    }
    throw new Error(`Failed to connect to Python server at ${targetUrl}: ${err.message}`);
  }
}

/**
 * Check health status of Python CP-SAT microservice
 */
export async function checkPythonHealth() {
  const startTime = Date.now();
  try {
    const res = await fetchWithTimeout('/health', { method: 'GET' }, 5000);
    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      return {
        connected: false,
        status: res.status,
        statusText: res.statusText,
        latencyMs,
        serviceUrl: getPythonServerUrl(),
        error: `Python microservice returned HTTP ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      connected: true,
      serviceUrl: getPythonServerUrl(),
      latencyMs,
      details: data,
    };
  } catch (error) {
    return {
      connected: false,
      serviceUrl: getPythonServerUrl(),
      latencyMs: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Fetch sample input payload from Python microservice
 */
export async function getSampleInput() {
  const res = await fetchWithTimeout('/api/v1/sample-input', { method: 'GET' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Python service error (${res.status}): ${errorText}`);
  }
  return await res.json();
}

/**
 * Fetch latest computed optimization schedule from Python server in-memory cache
 */
export async function getLatestSchedule() {
  const res = await fetchWithTimeout('/api/v1/latest', { method: 'GET' });
  if (!res.ok) {
    if (res.status === 404) {
      return {
        found: false,
        message: 'No optimization schedule has been generated yet on the Python server.',
      };
    }
    const errorText = await res.text();
    throw new Error(`Python service error (${res.status}): ${errorText}`);
  }
  const data = await res.json();
  return {
    found: true,
    data,
  };
}

/**
 * Send optimization request payload to Python CP-SAT server and get computed schedule
 * @param {Object} payload - { station_data, forecast_data, config, callback_url }
 */
export async function runOptimization(payload = {}) {
  const res = await fetchWithTimeout('/api/v1/optimize', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Python optimization failed (${res.status}): ${errorText}`);
  }

  return await res.json();
}

export default {
  getPythonServerUrl,
  checkPythonHealth,
  getSampleInput,
  getLatestSchedule,
  runOptimization,
};
