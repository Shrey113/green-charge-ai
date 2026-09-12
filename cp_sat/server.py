#!/usr/bin/env python3
"""
GreenCharge AI — Microservice Prototype Server
===============================================
Always-on CP-SAT EV Charging Optimization Service.

Features:
- REST API (POST /api/v1/optimize) for main backend ingestion.
- WebSocket (/ws/schedule) for live real-time schedule push to frontends.
- Webhook callback support (optional callback_url forwarding).
- In-memory state persistence for quick UI refresh (GET /api/v1/latest).
- Built-in interactive Web Dashboard at http://localhost:8000.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

import requests
import uvicorn
from fastapi import BackgroundTasks, FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from ev_charging_optimizer import (
    EVChargingOptimizer,
    OptimizationConfig,
    OptimizationResult,
    parse_optimizer_dicts,
    result_to_dict,
)

# ---------------------------------------------------------------------------
# Logging Setup
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("GreenChargeServer")

# ---------------------------------------------------------------------------
# Paths & Default Files
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
DEFAULT_INPUT_FILE = BASE_DIR / "input_data.json"
DEFAULT_FORECAST_FILE = BASE_DIR / "electricity_forecast.json"

# ---------------------------------------------------------------------------
# FastAPI Initialization
# ---------------------------------------------------------------------------
app = FastAPI(
    title="GreenCharge AI — EV Charging Optimizer Service",
    description="Real-time CP-SAT EV charging station optimization engine with REST, WebSockets, and Webhooks.",
    version="5.0.0",
)

# Enable CORS for all origins (seamless frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-Memory State & WebSocket Connection Manager
# ---------------------------------------------------------------------------
class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected. Active clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket) -> None:
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket client disconnected. Active clients: {len(self.active_connections)}")

    async def broadcast(self, message: Dict[str, Any]) -> None:
        if not self.active_connections:
            return
        dead_connections = set()
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception as exc:
                logger.warning(f"Error sending to WebSocket client: {exc}")
                dead_connections.add(connection)
        for dead in dead_connections:
            self.active_connections.discard(dead)


manager = ConnectionManager()
latest_optimization_result: Optional[Dict[str, Any]] = None
service_start_time = time.time()


# ---------------------------------------------------------------------------
# Pydantic Schemas for Request Validation & Documentation
# ---------------------------------------------------------------------------
class OptimizerConfigModel(BaseModel):
    charging_efficiency: Optional[float] = Field(
        default=0.90, ge=0.5, le=1.0, description="AC/DC charging efficiency (default: 0.90)"
    )
    max_solve_time_sec: Optional[float] = Field(
        default=10.0, gt=0.1, le=120.0, description="Max CP-SAT solver time in seconds"
    )
    slot_hours: Optional[float] = Field(
        default=1.0, gt=0.1, le=24.0, description="Granularity of scheduling slots in hours"
    )


class OptimizationRequestPayload(BaseModel):
    station_data: Optional[Dict[str, Any]] = Field(
        default=None, description="Station info and EV requests dictionary (matches input_data.json)"
    )
    forecast_data: Optional[Dict[str, Any]] = Field(
        default=None, description="Electricity forecast dictionary (matches electricity_forecast.json)"
    )
    station: Optional[Dict[str, Any]] = Field(
        default=None, description="Direct station dictionary (if station_data key omitted)"
    )
    ev_requests: Optional[List[Dict[str, Any]]] = Field(
        default=None, description="Direct ev_requests list (if station_data key omitted)"
    )
    config: Optional[OptimizerConfigModel] = Field(
        default_factory=OptimizerConfigModel, description="Optional solver configuration"
    )
    callback_url: Optional[str] = Field(
        default=None, description="Optional webhook URL to forward the final schedule to the frontend/backend"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "station_data": {
                    "station": {
                        "station_id": "ST001",
                        "name": "Ahmedabad EV Hub",
                        "total_power_capacity_kw": 100,
                        "chargers": [
                            {"charger_id": "CH001", "max_power_kw": 22, "connector_type": "CCS2", "status": "available"},
                            {"charger_id": "CH002", "max_power_kw": 22, "connector_type": "CCS2", "status": "available"}
                        ]
                    },
                    "ev_requests": [
                        {
                            "ev_id": "EV001",
                            "arrival_time": "2026-09-12T09:00:00Z",
                            "deadline": "2026-09-12T13:00:00Z",
                            "battery_capacity_kwh": 60,
                            "current_soc_percent": 30,
                            "target_soc_percent": 80,
                            "energy_needed_kwh": 30,
                            "max_charging_power_kw": 7,
                            "priority": "normal",
                            "preferences": {
                                "prefer_renewable": True,
                                "prefer_low_cost": True,
                                "allow_delayed_start": True
                            }
                        }
                    ]
                },
                "callback_url": "http://localhost:3000/api/webhook/schedule"
            }
        }
    )


# ---------------------------------------------------------------------------
# Helper Execution & Webhook Dispatch
# ---------------------------------------------------------------------------
def forward_to_webhook(url: str, payload: Dict[str, Any]) -> None:
    """Dispatches the optimization result to the specified webhook URL asynchronously."""
    try:
        logger.info(f"Forwarding optimization result to webhook: {url}")
        res = requests.post(url, json=payload, timeout=5.0)
        logger.info(f"Webhook response status: {res.status_code}")
    except Exception as exc:
        logger.error(f"Failed to forward to webhook {url}: {exc}")


def execute_optimization(
    station_dict: Dict[str, Any],
    forecast_dict: Dict[str, Any],
    config_model: Optional[OptimizerConfigModel] = None,
) -> Dict[str, Any]:
    """Runs the CP-SAT optimization engine and returns formatted result dict."""
    station, ev_requests, forecast = parse_optimizer_dicts(station_dict, forecast_dict)

    cfg = config_model or OptimizerConfigModel()
    opt_config = OptimizationConfig(
        charging_efficiency=cfg.charging_efficiency or 0.90,
        max_solve_time_sec=cfg.max_solve_time_sec or 10.0,
        slot_hours=cfg.slot_hours or 1.0,
    )

    optimizer = EVChargingOptimizer(
        station=station,
        ev_requests=ev_requests,
        forecast=forecast,
        config=opt_config,
    )
    result: OptimizationResult = optimizer.solve()
    return result_to_dict(result)


# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------
@app.get("/health", tags=["System"])
def health_check() -> Dict[str, Any]:
    """Health status and uptime check."""
    return {
        "status": "healthy",
        "service": "GreenCharge AI Optimizer Service",
        "version": "5.0.0",
        "uptime_seconds": round(time.time() - service_start_time, 2),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "active_websocket_clients": len(manager.active_connections),
        "has_cached_schedule": latest_optimization_result is not None,
    }


@app.get("/api/v1/sample-input", tags=["Utility"])
def get_sample_input() -> Dict[str, Any]:
    """Returns sample station data and electricity forecast for quick testing and integration."""
    station_data = {}
    forecast_data = {}
    if DEFAULT_INPUT_FILE.exists():
        with DEFAULT_INPUT_FILE.open("r", encoding="utf-8") as f:
            station_data = json.load(f)
    if DEFAULT_FORECAST_FILE.exists():
        with DEFAULT_FORECAST_FILE.open("r", encoding="utf-8") as f:
            forecast_data = json.load(f)

    return {
        "station_data": station_data,
        "forecast_data": forecast_data,
        "config": {
            "charging_efficiency": 0.90,
            "max_solve_time_sec": 10.0,
            "slot_hours": 1.0,
        },
    }


@app.get("/api/v1/latest", tags=["Optimization"])
def get_latest_schedule() -> Dict[str, Any]:
    """Retrieves the most recently computed optimization schedule without triggering a re-solve."""
    global latest_optimization_result
    if latest_optimization_result is None:
        raise HTTPException(
            status_code=404,
            detail="No optimization has been run yet. Trigger POST /api/v1/optimize first.",
        )
    return latest_optimization_result


@app.post("/api/v1/optimize", tags=["Optimization"])
async def run_optimization_endpoint(
    payload: OptimizationRequestPayload,
    background_tasks: BackgroundTasks,
) -> Dict[str, Any]:
    """
    Main Ingestion & Optimization Endpoint:
    1. Ingests station data & EV requests sent from the main backend.
    2. Merges with forecast data (uses provided forecast or falls back to electricity_forecast.json).
    3. Executes CP-SAT solver.
    4. Caches result in-memory.
    5. Broadcasts the result to all connected frontend WebSockets.
    6. Dispatches to callback_url if provided.
    7. Returns the full JSON schedule to the caller.
    """
    global latest_optimization_result

    # 1. Resolve station & EV requests
    station_dict: Dict[str, Any] = {}
    if payload.station_data:
        station_dict = payload.station_data
    elif payload.station and payload.ev_requests is not None:
        station_dict = {
            "station": payload.station,
            "ev_requests": payload.ev_requests,
        }
    elif DEFAULT_INPUT_FILE.exists():
        # Fallback to local file if empty
        with DEFAULT_INPUT_FILE.open("r", encoding="utf-8") as f:
            station_dict = json.load(f)
    else:
        raise HTTPException(
            status_code=400,
            detail="Missing station data and EV requests. Provide 'station_data' or 'station' + 'ev_requests'.",
        )

    # 2. Resolve forecast data
    forecast_dict: Dict[str, Any] = {}
    if payload.forecast_data:
        forecast_dict = payload.forecast_data
    elif DEFAULT_FORECAST_FILE.exists():
        # Fallback to local forecast
        with DEFAULT_FORECAST_FILE.open("r", encoding="utf-8") as f:
            forecast_dict = json.load(f)
    else:
        raise HTTPException(
            status_code=400,
            detail="Missing forecast data. Provide 'forecast_data' in request or ensure electricity_forecast.json exists.",
        )

    # 3. Solve with CP-SAT
    try:
        t0 = time.perf_counter()
        result_dict = execute_optimization(station_dict, forecast_dict, payload.config)
        duration = round(time.perf_counter() - t0, 3)
        logger.info(f"Optimization completed in {duration}s. Feasible: {result_dict.get('is_feasible')}")
    except Exception as exc:
        logger.exception("Error during CP-SAT optimization execution")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(exc)}")

    # 4. Cache latest result
    latest_optimization_result = result_dict

    # 5. Broadcast to connected WebSocket frontends
    await manager.broadcast({
        "event": "SCHEDULE_UPDATED",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "data": result_dict,
    })

    # 6. Dispatch Webhook callback if requested
    if payload.callback_url:
        background_tasks.add_task(forward_to_webhook, payload.callback_url, result_dict)

    # 7. Return synchronous response
    return result_dict


# ---------------------------------------------------------------------------
# WebSocket Endpoint
# ---------------------------------------------------------------------------
@app.websocket("/ws/schedule")
async def websocket_schedule_stream(websocket: WebSocket) -> None:
    """
    WebSocket endpoint for frontends.
    Connected clients receive live updates whenever new schedules are computed.
    """
    global latest_optimization_result
    await manager.connect(websocket)
    try:
        # Push initial schedule immediately if already computed
        if latest_optimization_result:
            await websocket.send_json({
                "event": "INITIAL_STATE",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": latest_optimization_result,
            })
        else:
            await websocket.send_json({
                "event": "AWAITING_INITIAL_SCHEDULE",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "message": "Connected. Waiting for backend to dispatch first optimization payload.",
            })

        while True:
            # Keep connection open and accept ping / trigger messages from client
            msg = await websocket.receive_text()
            try:
                data = json.loads(msg)
                if data.get("action") == "PING":
                    await websocket.send_json({"event": "PONG", "timestamp": time.time()})
                elif data.get("action") == "TRIGGER_OPTIMIZATION":
                    # Allow frontend to trigger an optimization with sample data directly
                    sample = get_sample_input()
                    res = execute_optimization(sample["station_data"], sample["forecast_data"])
                    latest_optimization_result = res
                    await manager.broadcast({
                        "event": "SCHEDULE_UPDATED",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "data": res,
                    })
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as exc:
        logger.warning(f"WebSocket client error: {exc}")
        manager.disconnect(websocket)


# ---------------------------------------------------------------------------
# Embedded Real-Time Interactive Frontend Dashboard
# ---------------------------------------------------------------------------
@app.get("/", response_class=HTMLResponse, tags=["Dashboard"])
@app.get("/dashboard", response_class=HTMLResponse, tags=["Dashboard"])
def get_dashboard_html() -> str:
    """Serves a modern, responsive single-page web dashboard for live monitoring and testing."""
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GreenCharge AI — Smart EV Charging Station Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #0a0f18;
      --bg-card: rgba(18, 26, 42, 0.75);
      --bg-card-hover: rgba(26, 38, 62, 0.9);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-highlight: rgba(16, 185, 129, 0.3);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --accent-green: #10b981;
      --accent-emerald: #059669;
      --accent-cyan: #06b6d4;
      --accent-amber: #f59e0b;
      --accent-purple: #8b5cf6;
      --accent-rose: #f43f5e;
      --glow-green: 0 0 25px rgba(16, 185, 129, 0.25);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-primary);
      background-image: 
        radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.1) 0px, transparent 50%);
      color: var(--text-primary);
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      line-height: 1.5;
      padding: 24px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 28px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--glow-green);
    }

    .brand-icon svg {
      width: 26px;
      height: 26px;
      stroke: #fff;
      fill: none;
      stroke-width: 2.2;
    }

    .brand-title h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(to right, #fff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-title p {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-amber);
      box-shadow: 0 0 8px var(--accent-amber);
    }

    .badge.connected .badge-dot {
      background: var(--accent-green);
      box-shadow: 0 0 8px var(--accent-green);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 18px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent-emerald), var(--accent-green));
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
    }

    .btn-outline {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .card {
      background: var(--bg-card);
      backdrop-filter: blur(14px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .card:hover {
      border-color: var(--border-highlight);
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .kpi-title {
      font-size: 0.82rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .kpi-value {
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .kpi-subtext {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .text-green { color: var(--accent-green); }
    .text-cyan { color: var(--accent-cyan); }
    .text-amber { color: var(--accent-amber); }
    .text-purple { color: var(--accent-purple); }

    /* Main Sections */
    .grid-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
      margin-bottom: 28px;
    }

    @media (max-width: 1024px) {
      .grid-layout {
        grid-template-columns: 1fr;
      }
    }

    .section-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title svg {
      width: 20px;
      height: 20px;
      color: var(--accent-green);
    }

    /* EV List & Slots */
    .ev-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 14px;
      transition: all 0.2s ease;
    }

    .ev-card:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .ev-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .ev-id-badge {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ev-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
    }

    .charger-pill {
      font-size: 0.75rem;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan);
      border: 1px solid rgba(6, 182, 212, 0.3);
      font-weight: 500;
    }

    .soc-bar-container {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      height: 10px;
      width: 100%;
      overflow: hidden;
      margin: 8px 0 12px 0;
      position: relative;
    }

    .soc-bar-initial {
      height: 100%;
      background: #475569;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 8px 0 0 8px;
    }

    .soc-bar-final {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-green), var(--accent-cyan));
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 8px;
    }

    /* Slots Table */
    .slots-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin-top: 10px;
    }

    .slots-table th {
      text-align: left;
      padding: 8px 10px;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-color);
      font-weight: 500;
    }

    .slots-table td {
      padding: 8px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .reason-pill {
      font-size: 0.75rem;
      padding: 2px 7px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-secondary);
      display: inline-block;
    }

    /* Sidebar Station Details */
    .station-info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.85rem;
    }

    .station-info-row span:first-child {
      color: var(--text-secondary);
    }

    .station-info-row span:last-child {
      font-weight: 500;
    }

    .diagnostic-alert {
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #fda4af;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 0.82rem;
      margin-bottom: 8px;
    }

    pre code {
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
        <div class="brand-title">
          <h1>GreenCharge AI — Optimization Engine</h1>
          <p>Always-On CP-SAT Real-Time EV Dispatch & Schedule Microservice</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="badge" id="connectionBadge">
          <span class="badge-dot"></span>
          <span id="connectionText">Connecting WebSocket...</span>
        </div>
        <button class="btn btn-outline" id="docsBtn" onclick="window.open('/docs', '_blank')">
          API Specs (/docs)
        </button>
        <button class="btn btn-primary" id="runOptBtn" onclick="triggerOptimization()">
          Run Optimization
        </button>
      </div>
    </header>

    <!-- Top KPI Cards -->
    <div class="kpi-grid">
      <div class="card">
        <div class="kpi-header">
          <span class="kpi-title">Solver Status</span>
          <span id="statusTag" class="badge" style="color: var(--accent-green)">OPTIMAL</span>
        </div>
        <div class="kpi-value text-green" id="solveTimeVal">0.013s</div>
        <div class="kpi-subtext" id="objVal">Objective: 828,275,110</div>
      </div>

      <div class="card">
        <div class="kpi-header">
          <span class="kpi-title">Renewable Energy</span>
          <span class="text-cyan">⚡ Green Gain</span>
        </div>
        <div class="kpi-value text-cyan" id="renewableGainVal">+2.5 kWh</div>
        <div class="kpi-subtext" id="renewableShareVal">19.7 kWh Clean Power Consumed</div>
      </div>

      <div class="card">
        <div class="kpi-header">
          <span class="kpi-title">Grid Stress Relief</span>
          <span class="text-amber">📉 Peak Coincidence</span>
        </div>
        <div class="kpi-value text-amber" id="gridStressVal">+0.72%</div>
        <div class="kpi-subtext" id="avgLoadVal">Avg Grid: 85,319 MW</div>
      </div>

      <div class="card">
        <div class="kpi-header">
          <span class="kpi-title">Energy Delivered</span>
          <span class="text-purple">🔋 Battery kWh</span>
        </div>
        <div class="kpi-value text-purple" id="batteryDeliveredVal">82.8 kWh</div>
        <div class="kpi-subtext" id="peakPowerVal">Peak Station Demand: 25.0 kW</div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="grid-layout">
      <!-- Left: EV Schedules & Slot Breakdown -->
      <div class="card">
        <h2 class="section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          Optimized Vehicle Charging Schedules
        </h2>
        <div id="evScheduleList">
          <!-- Rendered dynamically -->
        </div>
      </div>

      <!-- Right: Station Summary & System Diagnostics -->
      <div>
        <div class="card" style="margin-bottom: 20px;">
          <h2 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Station Overview
          </h2>
          <div class="station-info-row">
            <span>Station Name</span>
            <span id="stName">Ahmedabad EV Hub</span>
          </div>
          <div class="station-info-row">
            <span>Station ID</span>
            <span id="stId">ST001</span>
          </div>
          <div class="station-info-row">
            <span>Grid Capacity</span>
            <span id="stCap">100 kW</span>
          </div>
          <div class="station-info-row">
            <span>Available Bays</span>
            <span id="stBays">4 Chargers</span>
          </div>
          <div class="station-info-row">
            <span>Connected EVs</span>
            <span id="evCount">3 Vehicles</span>
          </div>
        </div>

        <div class="card">
          <h2 class="section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Operational Diagnostics
          </h2>
          <div id="diagnosticsList">
            <div class="station-info-row" style="color: var(--text-muted);">No critical faults detected.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let ws = null;
    const badge = document.getElementById('connectionBadge');
    const badgeText = document.getElementById('connectionText');

    function connectWebSocket() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/schedule`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        badge.classList.add('connected');
        badgeText.innerText = 'WebSocket: Live';
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.event === 'SCHEDULE_UPDATED' || message.event === 'INITIAL_STATE') {
            renderSchedule(message.data);
          }
        } catch (e) {
          console.error("Error parsing WS message:", e);
        }
      };

      ws.onclose = () => {
        badge.classList.remove('connected');
        badgeText.innerText = 'WebSocket: Reconnecting...';
        setTimeout(connectWebSocket, 2500);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    async function fetchLatest() {
      try {
        const res = await fetch('/api/v1/latest');
        if (res.ok) {
          const data = await res.json();
          renderSchedule(data);
        } else {
          // Trigger initial run if no cached result exists
          triggerOptimization();
        }
      } catch (err) {
        console.warn("Could not fetch latest schedule yet, triggering test solve...");
        triggerOptimization();
      }
    }

    async function triggerOptimization() {
      const btn = document.getElementById('runOptBtn');
      btn.innerText = 'Optimizing...';
      btn.disabled = true;
      try {
        const sampleRes = await fetch('/api/v1/sample-input');
        const sampleData = await sampleRes.json();
        const optRes = await fetch('/api/v1/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sampleData)
        });
        const result = await optRes.json();
        renderSchedule(result);
      } catch (err) {
        alert("Failed to trigger optimization: " + err);
      } finally {
        btn.innerText = 'Run Optimization';
        btn.disabled = false;
      }
    }

    function renderSchedule(data) {
      if (!data) return;

      // KPIs
      document.getElementById('statusTag').innerText = data.status || 'UNKNOWN';
      document.getElementById('solveTimeVal').innerText = (data.solve_time_seconds || 0).toFixed(3) + 's';
      document.getElementById('objVal').innerText = 'Objective: ' + (data.objective_value ? Number(data.objective_value).toLocaleString() : '0');

      if (data.kpis) {
        const opt = data.kpis.optimized || {};
        const base = data.kpis.baseline || {};
        const greenGain = (opt.renewable_energy_kwh || 0) - (base.renewable_energy_kwh || 0);
        document.getElementById('renewableGainVal').innerText = (greenGain >= 0 ? '+' : '') + greenGain.toFixed(1) + ' kWh';
        document.getElementById('renewableShareVal').innerText = `${(opt.renewable_energy_kwh || 0).toFixed(1)} kWh Clean Power Consumed`;
        document.getElementById('gridStressVal').innerText = (data.kpis.grid_stress_reduction_percent >= 0 ? '+' : '') + (data.kpis.grid_stress_reduction_percent || 0).toFixed(2) + '%';
        document.getElementById('avgLoadVal').innerText = `Avg Grid: ${(opt.avg_grid_load_mw || 0).toLocaleString()} MW`;
        document.getElementById('batteryDeliveredVal').innerText = `${(opt.total_battery_energy_kwh || 0).toFixed(1)} kWh`;
        document.getElementById('peakPowerVal').innerText = `Peak Station Demand: ${(opt.peak_station_power_kw || 0).toFixed(1)} kW`;
      }

      // Station Info
      document.getElementById('stName').innerText = data.station_name || 'Station';
      document.getElementById('stId').innerText = data.station_id || 'ST001';

      // Vehicles
      const schedules = data.schedules || {};
      const evKeys = Object.keys(schedules);
      document.getElementById('evCount').innerText = `${evKeys.length} Vehicles`;

      const evList = document.getElementById('evScheduleList');
      evList.innerHTML = '';

      evKeys.forEach(evId => {
        const ev = schedules[evId];
        const initialSoc = ev.initial_soc_percent || 0;
        const finalSoc = ev.final_soc_percent || 0;

        let slotsHtml = '';
        (ev.slots || []).forEach(slot => {
          slotsHtml += `
            <tr>
              <td><strong>${slot.timestamp.split('T')[1].substring(0, 5)} UTC</strong></td>
              <td><span class="text-green font-mono">${slot.power_kw.toFixed(1)} kW</span></td>
              <td>${slot.battery_energy_kwh.toFixed(1)} kWh</td>
              <td><span class="text-cyan">${slot.renewable_percent.toFixed(0)}%</span> (${slot.renewable_kwh.toFixed(2)} kWh)</td>
              <td><span class="reason-pill">${slot.explanation}</span></td>
            </tr>
          `;
        });

        const evHtml = `
          <div class="ev-card">
            <div class="ev-header">
              <div class="ev-id-badge">
                <span class="ev-tag">${ev.ev_id}</span>
                <span class="charger-pill">Bay: ${ev.assigned_charger_id || 'Unassigned'}</span>
                <span style="font-size: 0.78rem; color: var(--text-secondary);">${ev.car_model || 'Standard EV'}</span>
              </div>
              <div style="font-size: 0.85rem; font-weight: 600;">
                <span class="text-green">${ev.delivered_battery_energy_kwh.toFixed(1)}</span> / ${ev.requested_energy_kwh.toFixed(1)} kWh
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">(${ev.status})</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary);">
              <span>Initial SOC: ${initialSoc.toFixed(0)}%</span>
              <span class="text-green font-semibold">Target / Final SOC: ${finalSoc.toFixed(0)}%</span>
            </div>

            <div class="soc-bar-container">
              <div class="soc-bar-final" style="width: ${finalSoc}%;"></div>
              <div class="soc-bar-initial" style="width: ${initialSoc}%;"></div>
            </div>

            <table class="slots-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Power</th>
                  <th>Energy</th>
                  <th>Renewable</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                ${slotsHtml || '<tr><td colspan="5" style="color: var(--text-muted);">No charging slots allocated.</td></tr>'}
              </tbody>
            </table>
          </div>
        `;
        evList.innerHTML += evHtml;
      });

      // Diagnostics
      const diagContainer = document.getElementById('diagnosticsList');
      diagContainer.innerHTML = '';
      const diags = data.diagnostics || [];
      if (diags.length === 0) {
        diagContainer.innerHTML = '<div class="station-info-row" style="color: var(--accent-green);">✓ All physical and SOC parameters validated successfully.</div>';
      } else {
        diags.forEach(d => {
          diagContainer.innerHTML += `<div class="diagnostic-alert">⚠️ ${d}</div>`;
        });
      }
    }

    // Initialize
    window.addEventListener('DOMContentLoaded', () => {
      fetchLatest();
      connectWebSocket();
    });
  </script>
</body>
</html>
"""
    return html_content


# ---------------------------------------------------------------------------
# CLI Direct Runner
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    logger.info(f"Starting GreenCharge AI Microservice at http://{host}:{port}")
    uvicorn.run("server:app", host=host, port=port, reload=False)
