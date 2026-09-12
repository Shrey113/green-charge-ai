# GreenCharge AI — System Architecture Document

**Version:** 1.0  
**Stage:** Hackathon MVP  
**Architecture Style:** Modular Web Application  
**Optimization:** Google OR-Tools CP-SAT

---

## 1. Architecture Overview

GreenCharge AI is a web application that collects EV, charger, grid, renewable-energy, and pricing data, sends valid inputs to an optimization engine, and returns actionable charging schedules.

The MVP uses a simple layered architecture:

```text
Users
  ↓
React + Tailwind Frontend
  ↓
REST API
  ↓
FastAPI Backend
  ├── Authentication / Authorization
  ├── Dashboard Services
  ├── Validation
  └── Optimization Service
          ↓
     OR-Tools CP-SAT
          ↓
     PostgreSQL Database
```

### Architecture Goal

Keep the system easy to build, test, demonstrate, and extend without introducing unnecessary microservices or infrastructure.

---

# 2. Main System Components

| Component | Technology | Responsibility |
|---|---|---|
| Frontend | React + Vite + Tailwind | Dashboards and user interaction |
| API Backend | Python + FastAPI | Business logic and REST APIs |
| Optimizer | Google OR-Tools CP-SAT | Charging schedule optimization |
| Database | PostgreSQL | Persistent application data |
| Authentication | JWT/session-based | Login and role identification |
| Charts | Recharts | Dashboard visualization |
| Deployment | Vercel + Render/Railway | Frontend and backend hosting |

For the MVP, the optimizer can run inside the backend as a dedicated module rather than as a separate deployed microservice.

---

# 3. Frontend Architecture

## 3.1 Frontend Responsibilities

The frontend shall:

- Display role-specific dashboards
- Collect charging inputs
- Send API requests
- Display optimization results
- Display charts and KPIs
- Handle loading, success, empty, and error states
- Prevent access to UI routes not intended for the current role

The frontend must not be responsible for enforcing authorization. The backend remains the final authority.

---

## 3.2 Frontend Structure

```text
src/
├── app/
│   ├── App.jsx
│   └── routes.jsx
│
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── KPICard.jsx
│   │   └── StatusBadge.jsx
│   │
│   ├── charts/
│   │   ├── LoadChart.jsx
│   │   ├── RenewableChart.jsx
│   │   └── UtilizationChart.jsx
│   │
│   └── optimization/
│       └── OptimizationCard.jsx
│
├── features/
│   ├── driver/
│   ├── grid/
│   └── network/
│
├── services/
│   └── api.js
│
├── hooks/
├── data/
├── types/
└── main.jsx
```

---

# 4. Three Dashboard Architecture

## 4.1 EV Driver

Frontend modules:

```text
Driver Dashboard
├── Green Score
├── Savings
├── Recommended Schedule
├── Renewable Usage
└── Charging History
```

Primary interaction:

```text
View Recommendation
      ↓
Review Cost / Green Benefit
      ↓
Schedule Charging
```

---

## 4.2 Grid Operator

```text
Grid Dashboard
├── Grid Load
├── Grid Capacity
├── Grid Stress
├── Renewable Supply
├── EV Charging Load
├── Load Forecast
└── Optimization Impact
```

---

## 4.3 EV Network Operator

```text
Network Dashboard
├── Charger Status
├── Active Sessions
├── Utilization
├── Revenue
├── Station Performance
└── Load-Shifting Opportunities
```

---

# 5. Backend Architecture

## 5.1 Backend Responsibilities

The backend is responsible for:

- Authentication
- Authorization
- Request validation
- Business rules
- Data access
- Optimization execution
- Metric calculations
- API responses
- Logging

---

## 5.2 Backend Structure

```text
backend/
├── main.py
│
├── api/
│   ├── auth.py
│   ├── driver.py
│   ├── grid.py
│   ├── network.py
│   └── optimization.py
│
├── services/
│   ├── driver_service.py
│   ├── grid_service.py
│   ├── network_service.py
│   └── optimization_service.py
│
├── optimization/
│   ├── model.py
│   ├── constraints.py
│   ├── objectives.py
│   └── result_parser.py
│
├── schemas/
│   ├── auth.py
│   ├── ev.py
│   ├── grid.py
│   ├── charger.py
│   └── optimization.py
│
├── repositories/
│   ├── ev_repository.py
│   ├── grid_repository.py
│   └── charger_repository.py
│
└── tests/
```

---

# 6. API Layer

The frontend communicates with the backend through REST APIs.

## 6.1 Authentication

```text
POST /api/auth/login
GET  /api/auth/me
```

---

## 6.2 Driver APIs

```text
GET  /api/driver/dashboard
GET  /api/driver/schedule
POST /api/driver/schedule
GET  /api/driver/impact
```

---

## 6.3 Grid APIs

```text
GET  /api/grid/status
GET  /api/grid/load
GET  /api/grid/forecast
GET  /api/grid/renewables
POST /api/grid/optimize
```

---

## 6.4 Network APIs

```text
GET  /api/network/dashboard
GET  /api/network/stations
GET  /api/network/chargers
GET  /api/network/sessions
POST /api/network/optimize
```

---

## 6.5 Optimization API

```text
POST /api/optimization/run
```

Example request:

```json
{
  "ev_requests": [],
  "grid_data": [],
  "chargers": []
}
```

Example response:

```json
{
  "status": "OPTIMAL",
  "schedule": [],
  "baseline_cost": 10000,
  "optimized_cost": 8200,
  "savings": 1800,
  "baseline_peak": 920,
  "optimized_peak": 760,
  "peak_reduction_percent": 17.39,
  "renewable_usage_percent": 49,
  "sessions_shifted": 124
}
```

---

# 7. Authentication

## MVP

Use simple JWT-based authentication or a controlled role selector for the hackathon demo.

Supported roles:

```text
DRIVER
GRID_OPERATOR
NETWORK_OPERATOR
```

## Production Direction

Use:

- Secure password hashing
- JWT/session management
- Refresh token strategy if required
- Role-based access control

The frontend may hide unauthorized navigation, but backend authorization must always be enforced.

---

# 8. Authorization

Role permissions are enforced at the API level.

```text
DRIVER
  → Own charging information

GRID_OPERATOR
  → Grid and optimization information

NETWORK_OPERATOR
  → Station, charger, and session information
```

Example:

```text
POST /api/grid/optimize
```

Allowed:

```text
GRID_OPERATOR
```

Denied:

```text
DRIVER
NETWORK_OPERATOR
```

The server should return:

```text
403 Forbidden
```

for unauthorized operations.

---

# 9. Database Architecture

## 9.1 Recommended Database

**PostgreSQL**

It is suitable because the application has structured relational entities:

- Users
- EVs
- Charging requests
- Chargers
- Stations
- Grid records
- Optimization runs
- Optimization results

---

# 10. Core Database Entities

```text
User
 ├── EV
 │    └── ChargingRequest
 │
Station
 └── Charger
      └── ChargingSession

GridRecord
OptimizationRun
OptimizationResult
```

---

# 11. Suggested Tables

## users

```text
id
name
email
password_hash
role
created_at
```

## evs

```text
id
user_id
battery_capacity_kwh
current_soc
target_soc
```

## charging_requests

```text
id
ev_id
arrival_time
departure_time
required_energy_kwh
max_power_kw
status
created_at
```

## stations

```text
id
name
location
```

## chargers

```text
id
station_id
status
max_power_kw
```

## charging_sessions

```text
id
ev_id
charger_id
start_time
end_time
energy_kwh
cost
status
```

## grid_records

```text
id
timestamp
base_load_mw
capacity_mw
electricity_price
renewable_generation_mw
solar_mw
wind_mw
```

## optimization_runs

```text
id
requested_by
status
started_at
completed_at
```

## optimization_results

```text
id
optimization_run_id
baseline_cost
optimized_cost
baseline_peak
optimized_peak
renewable_usage_percent
sessions_shifted
result_data
```

---

# 12. Data Flow

## 12.1 Driver Flow

```text
Driver
  ↓
Charging Request
  ↓
POST /api/driver/schedule
  ↓
Backend Validation
  ↓
Optimization Service
  ↓
CP-SAT
  ↓
Optimized Schedule
  ↓
Database / Response
  ↓
Driver Dashboard
```

---

## 12.2 Grid Flow

```text
Grid Data
   ↓
Backend
   ↓
Load + Capacity Analysis
   ↓
CP-SAT Optimization
   ↓
Peak / Renewable Impact
   ↓
Grid Dashboard
```

---

## 12.3 Network Flow

```text
Charger + Session Data
          ↓
     Backend
          ↓
Utilization / Revenue Metrics
          ↓
Optimization
          ↓
Network Dashboard
```

---

# 13. Optimization Component

The optimization module is the technical core of GreenCharge AI.

## Inputs

```text
EV requests
Grid time slots
Grid capacity
Electricity price
Renewable availability
Charger capacity
```

## Processing

```text
Create model
   ↓
Create decision variables
   ↓
Add constraints
   ↓
Define objective
   ↓
Run CP-SAT
   ↓
Parse solution
```

## Constraints

```text
Charging Window
Required Energy
Grid Capacity
Charger Capacity
Maximum Charging Power
```

## Objectives

```text
Minimize Charging Cost
Minimize Peak Load
Maximize Renewable Usage
```

---

# 14. Baseline Calculation

The architecture should calculate a baseline before optimization.

A simple MVP baseline can represent the user's default or earliest feasible charging behavior.

```text
Input Data
   ↓
Baseline Calculation
   ↓
Baseline Cost / Peak / Renewable Usage
   ↓
CP-SAT Optimization
   ↓
Optimized Cost / Peak / Renewable Usage
   ↓
Compare
```

This enables the UI to show measurable impact.

---

# 15. Storage Strategy

## Persistent Data

Store in PostgreSQL:

- User data
- EV data
- Charger/station data
- Charging requests
- Grid time-series records
- Optimization run metadata
- Optimization results

## Temporary Data

Keep in application memory:

- Active solver model
- Intermediate calculations
- Short-lived request context

Do not use the database as a temporary solver workspace unless needed.

---

# 16. Security Architecture

```text
HTTPS
  ↓
Authentication
  ↓
Role Authorization
  ↓
Input Validation
  ↓
Business Rules
  ↓
Database Access
```

## Security Controls

- HTTPS in production
- Password hashing
- JWT/session validation
- Server-side authorization
- Input validation
- SQL parameterization/ORM
- Secret management through environment variables
- No sensitive data in logs
- Safe API error messages
- CORS restricted to approved frontend origins

The system should never rely on frontend checks for security.

---

# 17. Error Handling Architecture

All API failures should use a consistent error format.

```json
{
  "error": "VALIDATION_ERROR",
  "message": "departure_time must be after arrival_time"
}
```

Common responses:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

Solver-specific statuses:

```text
OPTIMAL
FEASIBLE
INFEASIBLE
UNKNOWN
TIME_LIMIT
```

Internal stack traces must not be sent to users.

---

# 18. Logging and Monitoring

For the MVP, keep monitoring simple.

## Application Logs

Record:

- API errors
- Authentication failures
- Optimization start/end
- Solver status
- Solver duration
- Validation failures

## Key Metrics

Track:

```text
API response time
Optimization duration
Optimization success rate
Optimization infeasibility rate
API error rate
```

## Production Direction

Use a hosted logging/monitoring service such as:

- Sentry
- Cloud provider logs
- Simple application metrics

Do not build a custom monitoring platform for the MVP.

---

# 19. Deployment Architecture

## Recommended MVP

```text
GitHub Repository
       │
       ├───────────────┐
       ↓               ↓
   Vercel           Render/Railway
   React              FastAPI
       │               │
       └───────┬───────┘
               ↓
          PostgreSQL
```

### Frontend

Deploy React/Vite on Vercel.

### Backend

Deploy FastAPI on Render or Railway.

### Database

Use hosted PostgreSQL.

Environment variables:

```text
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
```

Secrets must not be committed to source control.

---

# 20. Scalability

The MVP should remain a modular monolith.

Avoid:

- Microservices
- Kubernetes
- Message queues
- Event-driven infrastructure
- Separate optimization cluster

unless actual scale requires them.

## Logical Scaling Path

```text
MVP
Monolithic FastAPI
      ↓
Improve service modules
      ↓
Background optimization jobs
      ↓
Dedicated optimization worker
      ↓
Horizontal API scaling
      ↓
Caching / queue if required
```

The optimization engine is the component most likely to require separate scaling later.

---

# 21. Performance Strategy

## MVP

- Limit optimization horizon
- Use discrete time slots
- Use realistic but bounded demo dataset
- Configure CP-SAT time limit
- Return clear solver status
- Cache static dashboard data where useful

## Target Demo Dataset

At least:

```text
100 EV requests
24 time slots
50 chargers
```

The architecture should support this without functional degradation.

---

# 22. Availability and Failure Handling

If the optimization service fails:

```text
API
 ↓
Detect Failure
 ↓
Return Safe Error
 ↓
Dashboard Displays Error State
```

If the database is unavailable:

```text
Do not expose database credentials/details.
Return service-unavailable response.
```

If forecast data is missing:

```text
Show "Forecast unavailable"
```

Do not fabricate operational data.

---

# 23. API-to-Component Mapping

| Frontend Area | API |
|---|---|
| Driver Dashboard | `/api/driver/dashboard` |
| Driver Schedule | `/api/driver/schedule` |
| Driver Impact | `/api/driver/impact` |
| Grid Status | `/api/grid/status` |
| Grid Load | `/api/grid/load` |
| Renewable | `/api/grid/renewables` |
| Grid Optimization | `/api/grid/optimize` |
| Stations | `/api/network/stations` |
| Chargers | `/api/network/chargers` |
| Sessions | `/api/network/sessions` |
| Network Optimization | `/api/network/optimize` |

---

# 24. Practical Architecture Decisions

## Decision 1 — Modular Monolith

**Choice:** One FastAPI backend with separate modules.

**Reason:** Easier development, testing, deployment, and hackathon demonstration.

---

## Decision 2 — PostgreSQL

**Choice:** PostgreSQL for persistent structured data.

**Reason:** Simple relational model and strong support for time-stamped operational records.

---

## Decision 3 — CP-SAT Inside Backend

**Choice:** Run OR-Tools inside the backend for MVP.

**Reason:** Avoid microservice overhead while keeping the optimization code isolated in its own module.

---

## Decision 4 — REST APIs

**Choice:** REST instead of GraphQL.

**Reason:** Simpler implementation and enough for the dashboard use cases.

---

## Decision 5 — Mock Data First

**Choice:** Start with deterministic mock data.

**Reason:** The hackathon goal is to demonstrate the optimization concept reliably before adding external data integrations.

---

# 25. Architecture Sequence — Optimization Request

```text
User
  │
  │ Request optimization
  ▼
React
  │
  │ POST /api/optimization/run
  ▼
FastAPI
  │
  ├── Authenticate
  ├── Authorize
  ├── Validate
  └── Load Data
          │
          ▼
  Optimization Service
          │
          ▼
      CP-SAT Model
          │
          ▼
       Solver
          │
          ▼
    Parse Solution
          │
          ├── Cost
          ├── Peak
          ├── Renewable
          └── Schedule
          │
          ▼
     Store Result
          │
          ▼
      API Response
          │
          ▼
       React UI
```

---

# 26. Architecture Sequence — Dashboard Load

```text
User
  ↓
Login
  ↓
Role Identified
  ↓
Dashboard Request
  ↓
FastAPI
  ↓
Authorization
  ↓
Database Query
  ↓
Metric Calculation
  ↓
JSON Response
  ↓
React State
  ↓
Dashboard
```

---

# 27. Recommended Repository Structure

```text
greencharge-ai/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── optimization/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── repositories/
│   ├── tests/
│   ├── requirements.txt
│   └── main.py
│
├── data/
│   └── sample/
│
├── docs/
│   ├── PRD.md
│   ├── SRS.md
│   ├── ARCHITECTURE.md
│   ├── UI_UX.md
│   └── DEVELOPMENT.md
│
├── .env.example
├── README.md
└── .gitignore
```

---

# 28. Future Scalability Path

When the platform grows, the following components can be separated without changing the product architecture:

```text
Current:

FastAPI
 ├── API
 ├── Analytics
 └── CP-SAT


Future:

API Gateway
    │
    ├── Dashboard Service
    ├── Analytics Service
    ├── Optimization Worker
    └── Notification Service
             │
          PostgreSQL
```

Only introduce these components when measured load or reliability requirements justify them.

---

# 29. Architecture Acceptance Criteria

The architecture is acceptable for the MVP when:

1. All three dashboards can communicate with one backend.
2. Backend authorization is enforced by role.
3. EV, charger, grid, and renewable data can be stored and retrieved.
4. A valid optimization request reaches CP-SAT.
5. The optimizer returns a clear solver status.
6. Feasible results satisfy configured constraints.
7. Optimization results are returned through an API.
8. Dashboard KPIs reflect backend data.
9. API errors use consistent responses.
10. Secrets are managed outside source control.
11. The application can be deployed using a frontend host, backend host, and PostgreSQL.
12. The architecture does not require microservices for the MVP.

---

# 30. Final Architecture

```text
                    GREENCHARGE AI

                          USERS
                            │
                            ▼
                  REACT + TAILWIND
                            │
                            ▼
                       REST API
                            │
                            ▼
                    FASTAPI BACKEND
             ┌──────────────┼──────────────┐
             │              │              │
       Driver Service   Grid Service   Network Service
             │              │              │
             └──────────────┼──────────────┘
                            │
                   Optimization Service
                            │
                            ▼
                    OR-TOOLS CP-SAT
                            │
             ┌──────────────┼──────────────┐
             │                             │
             ▼                             ▼
       PostgreSQL                     API Results
                                             │
                                             ▼
                                      Three Dashboards
```

## Architecture Principle

> **Keep the MVP simple: one frontend, one backend, one database, and one optimization engine—modular enough to scale later.**
