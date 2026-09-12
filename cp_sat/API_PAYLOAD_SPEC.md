# GreenCharge AI — Microservice API & Payload Specification

## 1. System Architecture & Flow

This microservice prototype runs an always-on **FastAPI + Google OR-Tools CP-SAT** engine. It bridges your main backend and frontend applications by managing real-time EV charging slot scheduling.

```
                    ┌─────────────────────────┐
                    │      Main Backend       │
                    └────────────┬────────────┘
                                 │
                 1. HTTP POST    │ payload (station + ev_requests + forecast)
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│               GreenCharge AI Microservice (server.py:8000)             │
│                                                                        │
│  [1. Ingestion] ──────► [2. CP-SAT Engine] ──────► [3. Explainability] │
│                                                          │             │
└──────────────────────────────────┬───────────────────────┼─────────────┘
                                   │                       │
      2. WebSocket Broadcast       │                       │ 3. Sync REST /
         /ws/schedule              │                       │    Webhook POST
                                   ▼                       ▼
                    ┌─────────────────────────┐   ┌──────────────────────┐
                    │    Frontend Client      │   │  Frontend / Backend  │
                    │  (Live Bay Gantt / UI)  │   │  Webhook Endpoint    │
                    └─────────────────────────┘   └──────────────────────┘
```

---

## 2. Service Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check, uptime, active WebSocket clients, cached schedule status. |
| `POST` | `/api/v1/optimize` | **Main Endpoint:** Ingests input data from main backend, computes optimal schedule, broadcasts via WebSocket, forwards to webhook (if specified), and returns results. |
| `GET` | `/api/v1/latest` | Returns the most recently computed optimization schedule (cached in memory). |
| `GET` | `/api/v1/sample-input` | Returns the complete sample payload matching `input_data.json` and `electricity_forecast.json`. |
| `WS` | `/ws/schedule` | Real-time WebSocket connection for frontend applications. |
| `GET` | `/` or `/dashboard` | Built-in interactive Web UI dashboard. |
| `GET` | `/docs` | Interactive Swagger / OpenAPI documentation with live testing interface. |

---

## 3. Exact Input Payload Specification (`POST /api/v1/optimize`)

### 3.1 Supported Request Body Formats

The service is flexible and accepts **three** standard formats from your main backend:

1. **Unified Format (Recommended)**:
   Passes `station_data` (matching `input_data.json`) and `forecast_data` (matching `electricity_forecast.json`) in one request.
2. **Direct Root Format**:
   Passes `station`, `ev_requests`, and `forecast_data` at the top level of the JSON body.
3. **Station-Only Format**:
   Passes only `station_data` (or `station` + `ev_requests`). The service automatically falls back to `electricity_forecast.json` on the server so the main backend does not have to re-fetch the forecast for every vehicle dispatch.

### 3.2 Schema Definition (TypeScript Interface)

```typescript
export interface OptimizationInputPayload {
  // Option A: Wrapped under station_data
  station_data?: {
    timestamp?: string; // ISO8601, e.g. "2026-09-12T08:30:00Z"
    station: StationData;
    ev_requests: EVRequestData[];
  };

  // Option B: Provided directly at root
  station?: StationData;
  ev_requests?: EVRequestData[];

  // Optional: Forecast data (defaults to local electricity_forecast.json if omitted)
  forecast_data?: ForecastData;

  // Optional: Solver tuning parameters
  config?: {
    charging_efficiency?: number;  // Default: 0.90 (90% AC/DC efficiency)
    max_solve_time_sec?: number;   // Default: 10.0 seconds
    slot_hours?: number;           // Default: 1.0 (hourly slots)
  };

  // Optional: Webhook URL to push result directly to frontend or backend
  callback_url?: string;
}

export interface StationData {
  station_id: string;              // Unique identifier (e.g. "ST001")
  name: string;                    // Human-readable station name
  total_power_capacity_kw: number; // Grid transformer/meter limit in kW (e.g. 100.0)
  location?: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };
  chargers: ChargerData[];
}

export interface ChargerData {
  charger_id: string;              // Unique bay/plug ID (e.g. "CH001")
  max_power_kw: number;            // Hardware charging speed limit in kW (e.g. 22.0)
  connector_type: "CCS2" | "Type2" | "CHAdeMO" | string; // Plug standard
  status: "available" | "occupied" | "maintenance" | string;
}

export interface EVRequestData {
  ev_id: string;                   // Unique vehicle ID (e.g. "EV001")
  arrival_time: string;            // ISO8601 string (e.g. "2026-09-12T09:00:00Z")
  deadline: string;                // ISO8601 string (e.g. "2026-09-12T13:00:00Z")
  battery_capacity_kwh: number;    // Pack size (e.g. 60.0)
  current_soc_percent: number;     // 0 to 100
  target_soc_percent: number;      // 0 to 100 (target >= current)
  energy_needed_kwh: number;       // Energy required in kWh
  max_charging_power_kw: number;   // Max OBC or DC fast charge acceptance in kW (e.g. 7.0 or 11.0)
  priority?: "high" | "normal" | "low" | string;
  preferences?: {
    prefer_renewable?: boolean;    // Prioritize high green-energy hours
    prefer_low_cost?: boolean;     // Prioritize off-peak tariffs
    allow_delayed_start?: boolean; // If false, penalizes waiting before initial charge
  };
  connector_type?: string;         // Car inlet standard (e.g. "Type2", "CCS2")
  car_model?: string;              // Optional vehicle description
}

export interface ForecastData {
  renewable_energy_share: {
    unit: "%";
    data: Array<{
      datetime: string; // ISO8601 hourly timestamp
      value: number;    // Renewable percentage (0 to 100)
    }>;
  };
  total_grid_load: {
    unit: "MW";
    data: Array<{
      datetime: string; // ISO8601 hourly timestamp
      value: number;    // Grid load in MW
    }>;
  };
}
```

### 3.3 Complete Input Payload Example (`input_payload.json`)

```json
{
  "station_data": {
    "timestamp": "2026-09-12T08:30:00Z",
    "station": {
      "station_id": "ST001",
      "name": "Ahmedabad EV Hub",
      "location": {
        "city": "Ahmedabad",
        "state": "Gujarat",
        "country": "India",
        "latitude": 23.0225,
        "longitude": 72.5714,
        "timezone": "Asia/Kolkata"
      },
      "total_power_capacity_kw": 100,
      "chargers": [
        {
          "charger_id": "CH001",
          "max_power_kw": 22,
          "connector_type": "CCS2",
          "status": "available"
        },
        {
          "charger_id": "CH002",
          "max_power_kw": 22,
          "connector_type": "CCS2",
          "status": "available"
        },
        {
          "charger_id": "CH003",
          "max_power_kw": 7,
          "connector_type": "Type2",
          "status": "available"
        },
        {
          "charger_id": "CH004",
          "max_power_kw": 7,
          "connector_type": "Type2",
          "status": "available"
        }
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
          "prefer_renewable": true,
          "prefer_low_cost": true,
          "allow_delayed_start": true
        }
      },
      {
        "ev_id": "EV002",
        "arrival_time": "2026-09-12T09:30:00Z",
        "deadline": "2026-09-12T15:00:00Z",
        "battery_capacity_kwh": 75,
        "current_soc_percent": 20,
        "target_soc_percent": 80,
        "energy_needed_kwh": 45,
        "max_charging_power_kw": 11,
        "priority": "normal",
        "preferences": {
          "prefer_renewable": true,
          "prefer_low_cost": true,
          "allow_delayed_start": true
        }
      },
      {
        "ev_id": "EV003",
        "arrival_time": "2026-09-12T10:00:00Z",
        "deadline": "2026-09-12T12:00:00Z",
        "battery_capacity_kwh": 50,
        "current_soc_percent": 40,
        "target_soc_percent": 70,
        "energy_needed_kwh": 15,
        "max_charging_power_kw": 7,
        "priority": "high",
        "preferences": {
          "prefer_renewable": true,
          "prefer_low_cost": false,
          "allow_delayed_start": false
        }
      }
    ]
  },
  "config": {
    "charging_efficiency": 0.90,
    "max_solve_time_sec": 10.0
  },
  "callback_url": "http://localhost:3000/api/webhook/schedule"
}
```

---

## 4. Exact Output Payload Specification

### 4.1 Schema Definition (TypeScript Interface)

```typescript
export interface OptimizationOutputPayload {
  station_id: string;               // Station ID matching request
  station_name: string;             // Station Name
  status: "OPTIMAL" | "FEASIBLE" | "INFEASIBLE" | "MODEL_INVALID";
  is_feasible: boolean;             // True if valid schedule found
  objective_value: number;          // CP-SAT multi-objective score
  solve_time_seconds: number;       // Execution wall time in seconds (e.g. 0.044s)
  solver_diagnostics: {
    num_branches: number;
    num_conflicts: number;
  };
  kpis: {
    peak_reduction_percent: number;        // Station peak power reduction % vs unmanaged baseline
    renewable_gain_percent: number;        // Improvement in clean energy share %
    grid_stress_reduction_percent: number; // Grid load relief % during regional peak
    baseline: BaselineMetric;              // Uncontrolled immediate charging metrics
    optimized: BaselineMetric;             // CP-SAT optimized metrics
  };
  schedules: Record<string, EVScheduleResult>; // Map keyed by ev_id ("EV001", "EV002", ...)
  diagnostics: string[];                       // Operational alerts / physical bottleneck notices
}

export interface BaselineMetric {
  peak_station_power_kw: number;         // Peak coincident power drawn by station
  total_grid_energy_kwh: number;         // Total electricity taken from grid
  total_battery_energy_kwh: number;      // Total energy delivered into EV packs
  renewable_energy_kwh: number;          // Clean renewable portion of energy in kWh
  renewable_utilization_percent: number; // % of consumed energy from renewables
  avg_grid_load_mw: number;              // Average regional grid load during charging
}

export interface EVScheduleResult {
  ev_id: string;
  car_model: string;
  priority: string;
  assigned_charger_id: string | null;    // Dedicated bay reserved for this EV (no hopping)
  requested_energy_kwh: number;          // Requested energy from EV battery
  delivered_battery_energy_kwh: number;  // Energy delivered into battery
  grid_energy_consumed_kwh: number;      // Total AC grid energy drawn (delivered / eta)
  unmet_energy_kwh: number;              // Shortfall if physically bottlenecked
  initial_soc_percent: number;           // Starting SOC %
  final_soc_percent: number;             // Achieved SOC % at deadline
  status: "FULLY_CHARGED" | "PARTIALLY_CHARGED" | "UNSCHEDULED";
  slots: ChargingSlotAllocation[];       // Hour-by-hour charging power & reason
  diagnostics: string[];                 // Individual vehicle notes/bottlenecks
}

export interface ChargingSlotAllocation {
  timestamp: string;          // ISO8601 timestamp for slot start (e.g. "2026-09-12T09:00:00.000Z")
  power_kw: number;           // Power assigned to EV during this slot in kW (e.g. 7.0)
  battery_energy_kwh: number; // Net energy delivered to battery in this hour
  grid_energy_kwh: number;    // Gross energy drawn from grid in this hour
  renewable_percent: number;  // Grid renewable percentage during this hour (e.g. 32.0%)
  grid_load_mw: number;       // Grid load during this hour (e.g. 90310 MW)
  renewable_kwh: number;      // Actual renewable energy stored in this hour
  explanation: string;        // Human-readable reasoning generated by explainable AI
}
```

### 4.2 Complete Output Payload Example (`output_payload.json`)

```json
{
  "station_id": "ST001",
  "station_name": "Ahmedabad EV Hub",
  "status": "OPTIMAL",
  "is_feasible": true,
  "objective_value": 828275110.0,
  "solve_time_seconds": 0.044,
  "solver_diagnostics": {
    "num_branches": 0,
    "num_conflicts": 0
  },
  "kpis": {
    "peak_reduction_percent": 0.0,
    "renewable_gain_percent": 0.0,
    "grid_stress_reduction_percent": 0.72,
    "baseline": {
      "peak_station_power_kw": 21.0,
      "total_grid_energy_kwh": 77.0,
      "total_battery_energy_kwh": 69.3,
      "renewable_energy_kwh": 17.22,
      "renewable_utilization_percent": 22.4,
      "avg_grid_load_mw": 85936.84
    },
    "optimized": {
      "peak_station_power_kw": 25.0,
      "total_grid_energy_kwh": 92.0,
      "total_battery_energy_kwh": 82.8,
      "renewable_energy_kwh": 19.71,
      "renewable_utilization_percent": 21.4,
      "avg_grid_load_mw": 85318.86
    }
  },
  "schedules": {
    "EV001": {
      "ev_id": "EV001",
      "car_model": "Standard EV",
      "priority": "normal",
      "assigned_charger_id": "CH003",
      "requested_energy_kwh": 30.0,
      "delivered_battery_energy_kwh": 25.2,
      "grid_energy_consumed_kwh": 28.0,
      "unmet_energy_kwh": 4.8,
      "initial_soc_percent": 30.0,
      "final_soc_percent": 72.0,
      "status": "PARTIALLY_CHARGED",
      "slots": [
        {
          "timestamp": "2026-09-12T09:00:00.000Z",
          "power_kw": 7.0,
          "battery_energy_kwh": 6.3,
          "grid_energy_kwh": 7.0,
          "renewable_percent": 32.0,
          "grid_load_mw": 90310.52,
          "renewable_kwh": 2.24,
          "explanation": "High renewable share (32%)"
        },
        {
          "timestamp": "2026-09-12T10:00:00.000Z",
          "power_kw": 7.0,
          "battery_energy_kwh": 6.3,
          "grid_energy_kwh": 7.0,
          "renewable_percent": 27.0,
          "grid_load_mw": 89240.33,
          "renewable_kwh": 1.89,
          "explanation": "Deadline fulfillment requirement"
        },
        {
          "timestamp": "2026-09-12T11:00:00.000Z",
          "power_kw": 7.0,
          "battery_energy_kwh": 6.3,
          "grid_energy_kwh": 7.0,
          "renewable_percent": 23.0,
          "grid_load_mw": 86631.89,
          "renewable_kwh": 1.61,
          "explanation": "Deadline fulfillment requirement"
        },
        {
          "timestamp": "2026-09-12T12:00:00.000Z",
          "power_kw": 7.0,
          "battery_energy_kwh": 6.3,
          "grid_energy_kwh": 7.0,
          "renewable_percent": 18.0,
          "grid_load_mw": 83650.11,
          "renewable_kwh": 1.26,
          "explanation": "Deadline fulfillment requirement"
        }
      ],
      "diagnostics": [
        "Shortfall of 4.8 kWh due to duration (4.0h) or max power cap (7.0 kW)."
      ]
    },
    "EV002": {
      "ev_id": "EV002",
      "car_model": "Standard EV",
      "priority": "normal",
      "assigned_charger_id": "CH001",
      "requested_energy_kwh": 45.0,
      "delivered_battery_energy_kwh": 45.0,
      "grid_energy_consumed_kwh": 50.0,
      "unmet_energy_kwh": 0.0,
      "initial_soc_percent": 20.0,
      "final_soc_percent": 80.0,
      "status": "FULLY_CHARGED",
      "slots": [
        {
          "timestamp": "2026-09-12T10:00:00.000Z",
          "power_kw": 6.0,
          "battery_energy_kwh": 5.4,
          "grid_energy_kwh": 6.0,
          "renewable_percent": 27.0,
          "grid_load_mw": 89240.33,
          "renewable_kwh": 1.62,
          "explanation": "Deadline fulfillment requirement"
        },
        {
          "timestamp": "2026-09-12T11:00:00.000Z",
          "power_kw": 11.0,
          "battery_energy_kwh": 9.9,
          "grid_energy_kwh": 11.0,
          "renewable_percent": 23.0,
          "grid_load_mw": 86631.89,
          "renewable_kwh": 2.53,
          "explanation": "Deadline fulfillment requirement"
        },
        {
          "timestamp": "2026-09-12T12:00:00.000Z",
          "power_kw": 11.0,
          "battery_energy_kwh": 9.9,
          "grid_energy_kwh": 11.0,
          "renewable_percent": 18.0,
          "grid_load_mw": 83650.11,
          "renewable_kwh": 1.98,
          "explanation": "Deadline fulfillment requirement"
        },
        {
          "timestamp": "2026-09-12T13:00:00.000Z",
          "power_kw": 11.0,
          "battery_energy_kwh": 9.9,
          "grid_energy_kwh": 11.0,
          "renewable_percent": 14.0,
          "grid_load_mw": 80200.44,
          "renewable_kwh": 1.54,
          "explanation": "Off-peak grid relief (80200 MW)"
        },
        {
          "timestamp": "2026-09-12T14:00:00.000Z",
          "power_kw": 11.0,
          "battery_energy_kwh": 9.9,
          "grid_energy_kwh": 11.0,
          "renewable_percent": 14.0,
          "grid_load_mw": 79878.12,
          "renewable_kwh": 1.54,
          "explanation": "Off-peak grid relief (79878 MW)"
        }
      ],
      "diagnostics": []
    },
    "EV003": {
      "ev_id": "EV003",
      "car_model": "Standard EV",
      "priority": "high",
      "assigned_charger_id": "CH002",
      "requested_energy_kwh": 15.0,
      "delivered_battery_energy_kwh": 12.6,
      "grid_energy_consumed_kwh": 14.0,
      "unmet_energy_kwh": 2.4,
      "initial_soc_percent": 40.0,
      "final_soc_percent": 65.0,
      "status": "PARTIALLY_CHARGED",
      "slots": [
        {
          "timestamp": "2026-09-12T10:00:00.000Z",
          "power_kw": 7.0,
          "battery_energy_kwh": 6.3,
          "grid_energy_kwh": 7.0,
          "renewable_percent": 27.0,
          "grid_load_mw": 89240.33,
          "renewable_kwh": 1.89,
          "explanation": "Immediate charging preference"
        },
        {
          "timestamp": "2026-09-12T11:00:00.000Z",
          "power_kw": 7.0,
          "battery_energy_kwh": 6.3,
          "grid_energy_kwh": 7.0,
          "renewable_percent": 23.0,
          "grid_load_mw": 86631.89,
          "renewable_kwh": 1.61,
          "explanation": "Immediate charging preference"
        }
      ],
      "diagnostics": [
        "Shortfall of 2.4 kWh due to duration (2.0h) or max power cap (7.0 kW)."
      ]
    }
  },
  "diagnostics": [
    "EV001: Physical Bottleneck: Needs 30.0 kWh, but maximum deliverable within 4.0h at 7.0 kW (eta=90%) is 25.2 kWh. Max achievable shortfall: 4.8 kWh.",
    "EV003: Physical Bottleneck: Needs 15.0 kWh, but maximum deliverable within 2.0h at 7.0 kW (eta=90%) is 12.6 kWh. Max achievable shortfall: 2.4 kWh."
  ]
}
```

---

## 5. Integration Code Snippets

### 5.1 Main Backend (Python) Calling the Optimizer

```python
import requests
import json

# Load or generate your current station requests
with open("input_data.json") as f:
    station_data = json.load(f)

payload = {
    "station_data": station_data,
    # Optional: pass fresh forecast if fetched from API, or omit to use cached
    "config": {
        "charging_efficiency": 0.90,
        "max_solve_time_sec": 10.0
    },
    "callback_url": "https://api.yourfrontend.com/webhooks/schedule-update"
}

response = requests.post("http://localhost:8000/api/v1/optimize", json=payload)
if response.status_code == 200:
    schedule_data = response.json()
    print(f"Schedule solved successfully! Objective: {schedule_data['objective_value']}")
else:
    print(f"Error {response.status_code}: {response.text}")
```

### 5.2 Main Backend (Node.js / Express / Next.js)

```javascript
import axios from 'axios';

async function dispatchOptimization(stationData) {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/optimize', {
      station_data: stationData,
      config: {
        charging_efficiency: 0.90,
        max_solve_time_sec: 10.0
      }
    });

    const optimizedSchedule = response.data;
    console.log('Optimized EVs:', Object.keys(optimizedSchedule.schedules));
    return optimizedSchedule;
  } catch (error) {
    console.error('Optimization failed:', error.response?.data || error.message);
  }
}
```

### 5.3 Frontend React / Vanilla JS Live WebSocket Listener

```javascript
// Connect to the always-on WebSocket stream
const socket = new WebSocket('ws://localhost:8000/ws/schedule');

socket.onopen = () => {
  console.log('Connected to GreenCharge schedule stream');
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.event === 'SCHEDULE_UPDATED' || message.event === 'INITIAL_STATE') {
    const schedule = message.data;
    console.log('Received fresh schedule:', schedule);
    // Update your React state or Redux store:
    // setSchedule(schedule);
  }
};

socket.onclose = () => {
  console.log('Schedule stream disconnected. Reconnecting in 3s...');
  setTimeout(initWebSocket, 3000);
};
```
