import { Router } from 'express';
import {
  checkPythonHealth,
  getLatestSchedule,
  getSampleInput,
  runOptimization,
  getPythonServerUrl,
} from '../services/optimizerService.js';

const router = Router();

/**
 * GET /api/optimizer/status
 * Bridge connectivity check: tests connection to Python CP-SAT microservice
 */
router.get('/status', async (req, res) => {
  try {
    const health = await checkPythonHealth();
    return res.json({
      bridge: 'Express <-> Python CP-SAT Optimizer',
      timestamp: new Date().toISOString(),
      pythonServiceUrl: getPythonServerUrl(),
      ...health,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/optimizer/sample-input
 * Fetch sample data template from Python microservice
 */
router.get('/sample-input', async (req, res) => {
  try {
    const data = await getSampleInput();
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/optimizer/latest
 * Retrieve the latest optimization result stored in Python server memory
 */
router.get('/latest', async (req, res) => {
  try {
    const result = await getLatestSchedule();
    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/optimizer/optimize
 * Forward optimization request from Express backend to Python CP-SAT solver
 */
router.post('/optimize', async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await runOptimization(payload);
    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
