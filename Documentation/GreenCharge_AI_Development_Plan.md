# GreenCharge AI — Development Plan

**Version:** 1.0  
**Stage:** Hackathon MVP  
**Core Stack:** React + Vite + Tailwind CSS, FastAPI, PostgreSQL, Google OR-Tools CP-SAT

---

# 1. Development Objective

Build a working end-to-end GreenCharge AI MVP that can:

```text
Load EV + Grid + Charger Data
        ↓
Validate Data
        ↓
Run CP-SAT Optimization
        ↓
Generate Charging Schedule
        ↓
Calculate Impact
        ↓
Display Results in 3 Dashboards
```

The development priority is the **working optimization flow** first, followed by dashboard polish.

---

# 2. MVP Scope

## Must Build

### Backend
- FastAPI application
- Validation
- Role-based authorization
- EV, charger, station, grid APIs
- Optimization API
- CP-SAT model
- Baseline comparison
- Cost, peak, and renewable calculations

### Database
- Users
- EVs
- Charging requests
- Stations
- Chargers
- Grid records
- Optimization runs/results

### Frontend
- Shared application shell
- Driver dashboard
- Grid operator dashboard
- Network operator dashboard
- KPI cards
- Charts
- AI recommendation card
- Forms
- Loading/error/empty states
- Responsive layout

### Deployment
- Frontend deployment
- Backend deployment
- Hosted PostgreSQL
- Environment variables

---

# 3. Development Priorities

| Priority | Area | Reason |
|---|---|---|
| P0 | CP-SAT optimization | Core product value |
| P0 | Backend API | Connects system components |
| P0 | Mock/seed data | Enables end-to-end testing |
| P0 | Three core dashboards | Required product experience |
| P1 | Database persistence | Makes data structured and repeatable |
| P1 | Authentication/authorization | Required secure architecture |
| P1 | Charts and comparison | Demonstrates impact |
| P1 | Validation/error handling | Reliable demo |
| P2 | Advanced polish | Only after core flow works |
| P3 | Future integrations | Not required for MVP |

---

# 4. Recommended Team/Workstream Split

If working as a team, use four parallel workstreams after setup:

```text
Track A — Backend/API
Track B — CP-SAT Optimization
Track C — Frontend/UI
Track D — Database/Testing/Deployment
```

Dependencies should still follow the roadmap below.

---

# 5. Phase 0 — Project Setup

## Goal

Create a clean repository and local development environment.

## Tasks

### Repository

```text
greencharge-ai/
├── frontend/
├── backend/
├── data/
├── docs/
├── .env.example
├── .gitignore
└── README.md
```

### Frontend Setup

Install:

```text
React
Vite
Tailwind CSS
React Router
Recharts
Lucide React
```

### Backend Setup

Install:

```text
Python
FastAPI
Uvicorn
Pydantic
SQLAlchemy
psycopg
OR-Tools
pytest
```

### Database

Create PostgreSQL database and connection configuration.

### Definition of Done

- Repository runs locally.
- Frontend opens successfully.
- Backend starts successfully.
- Database connection works.
- Environment variables load correctly.
- Frontend can call a test backend endpoint.

---

# 6. Phase 1 — Define Data Contracts

## Goal

Agree on the data structures before building dependent features.

## Tasks

Define schemas for:

```text
User
EV
ChargingRequest
Station
Charger
ChargingSession
GridRecord
OptimizationRun
OptimizationResult
```

Define API request/response models.

Example:

```json
{
  "ev_id": "EV001",
  "arrival_time": "18:00",
  "departure_time": "07:00",
  "required_energy_kwh": 24,
  "max_power_kw": 7
}
```

## Definition of Done

- Pydantic schemas exist.
- Database models match the schemas.
- Example requests/responses are documented.
- Invalid input examples are defined.

**Dependency:** Phase 0.

---

# 7. Phase 2 — Seed and Mock Data

## Goal

Create deterministic data for development and demo.

## Dataset

Recommended MVP:

```text
100 EV requests
24 time slots
50 chargers
multiple stations
24-hour grid data
renewable generation by slot
time-based electricity prices
```

Create at least these scenarios:

### Scenario A — Normal

Moderate demand and sufficient capacity.

### Scenario B — Peak

High EV demand during evening hours.

### Scenario C — Renewable Window

High renewable generation during selected slots.

### Scenario D — Infeasible

Insufficient capacity or charging window.

## Definition of Done

- Seed script creates all required records.
- Data is logically consistent.
- Same seed can reproduce the same scenario.
- At least one scenario demonstrates measurable optimization benefits.

**Dependency:** Phase 1.

---

# 8. Phase 3 — Database Layer

## Goal

Implement persistent storage.

## Tasks

Create tables:

```text
users
evs
charging_requests
stations
chargers
charging_sessions
grid_records
optimization_runs
optimization_results
```

Add:

- Primary keys
- Foreign keys
- Required fields
- Indexes for common lookup fields
- Timestamps

## Suggested Indexes

```text
users.email
charging_requests.ev_id
charging_requests.arrival_time
chargers.station_id
charging_sessions.charger_id
grid_records.timestamp
optimization_runs.requested_by
```

## Definition of Done

- Migrations run successfully.
- Seed data loads successfully.
- CRUD operations work for core entities.
- Invalid foreign-key references are rejected.

**Dependency:** Phase 1.

---

# 9. Phase 4 — CP-SAT Optimization Engine

## Goal

Build the core GreenCharge AI optimization model before complex UI work.

---

## 9.1 Inputs

```text
EV requests
Grid time slots
Grid capacity
Electricity price
Renewable generation
Available chargers
```

---

## 9.2 Decision Variables

For EV `e` and time slot `t`:

```text
charge[e][t]
```

MVP:

```text
0 = not charging
1 = charging
```

---

## 9.3 Constraints

Implement in this order:

### C1 — Charging Window

No charging outside arrival/departure.

### C2 — Required Energy

Every feasible EV receives required energy.

### C3 — Grid Capacity

```text
Base Load + EV Load <= Grid Capacity
```

### C4 — Charger Capacity

Simultaneous charging sessions do not exceed available capacity.

### C5 — Maximum Power

Charging does not exceed configured power.

---

## 9.4 Objective

Implement weighted optimization:

```text
Minimize:

Charging Cost
+ Peak Load Penalty
- Renewable Energy Reward
```

Keep weights configurable.

---

## 9.5 Baseline

Create a simple baseline schedule before optimization.

For MVP, baseline can use a deterministic earliest-feasible or default charging strategy.

Calculate:

```text
baseline_cost
baseline_peak
baseline_renewable_usage
```

Then calculate:

```text
optimized_cost
optimized_peak
optimized_renewable_usage
```

---

## 9.6 Result Parser

Return:

```text
status
schedule
baseline_cost
optimized_cost
savings
baseline_peak
optimized_peak
peak_reduction_percent
renewable_usage_percent
sessions_shifted
```

---

## Definition of Done

For test scenarios:

- Feasible inputs return `OPTIMAL` or `FEASIBLE`.
- Infeasible inputs return `INFEASIBLE`.
- Required energy is satisfied.
- Grid capacity is respected.
- Charger capacity is respected.
- Charging stays within the allowed window.
- Baseline and optimized metrics can be compared.
- Solver time limit is configurable.

**Dependency:** Phases 1–3.

**Critical milestone:** Optimization engine passes before major dashboard integration.

---

# 10. Phase 5 — Backend Services and APIs

## Goal

Expose the optimizer and application data through clean REST APIs.

## Tasks

Implement:

### Authentication

```text
POST /api/auth/login
GET  /api/auth/me
```

### Driver

```text
GET  /api/driver/dashboard
GET  /api/driver/schedule
POST /api/driver/schedule
GET  /api/driver/impact
```

### Grid

```text
GET  /api/grid/status
GET  /api/grid/load
GET  /api/grid/forecast
GET  /api/grid/renewables
POST /api/grid/optimize
```

### Network

```text
GET  /api/network/dashboard
GET  /api/network/stations
GET  /api/network/chargers
GET  /api/network/sessions
POST /api/network/optimize
```

### Optimization

```text
POST /api/optimization/run
```

---

## Business Services

Create:

```text
driver_service
grid_service
network_service
optimization_service
```

The API layer should call services rather than containing complex business logic.

---

## Definition of Done

- All core endpoints respond.
- Requests are validated.
- Role permissions are enforced.
- Database data is returned correctly.
- Optimization endpoint returns actual solver results.
- API errors use a consistent format.

**Dependency:** Phases 3 and 4.

---

# 11. Phase 6 — Authentication and Authorization

## Goal

Protect role-specific functionality.

## MVP

Use either:

- JWT authentication, or
- controlled role-based demo login

JWT is preferred if time allows.

Roles:

```text
DRIVER
GRID_OPERATOR
NETWORK_OPERATOR
```

## Authorization

Example:

```text
Driver
→ own charging data

Grid Operator
→ grid + optimization data

Network Operator
→ station + charger + session data
```

## Definition of Done

- Login works.
- Role is attached to the authenticated session/token.
- Protected endpoints reject unauthenticated requests.
- Forbidden operations return 403.
- Driver cannot access another driver's data.

**Dependency:** Phase 5.

---

# 12. Phase 7 — Frontend Design System

## Goal

Build reusable components before dashboard pages.

## Theme

Minimal Green + White.

```text
Primary Green  #16A34A
Deep Green     #15803D
Soft Green     #DCFCE7
Light Green    #F0FDF4

Background     #F9FAFB
Surface        #FFFFFF
Border         #E5E7EB

Text           #111827
Secondary      #6B7280

Warning        #F59E0B
Critical       #EF4444
Info           #3B82F6
```

## Components

Build:

```text
AppShell
Sidebar
Header
Card
KPICard
Button
Badge
Input
Select
ChartCard
Table
Alert
Modal
Skeleton
EmptyState
ErrorState
OptimizationCard
```

## Definition of Done

- Components are reusable.
- Components match UI/UX document.
- Responsive states are defined.
- No dashboard-specific styling is duplicated unnecessarily.

**Dependency:** Phase 0 and UI/UX specification.

---

# 13. Phase 8 — Driver Dashboard

## Build Order

### 1. Overview

Show:

```text
Green Score
Savings
Renewable Usage
Next Charging
```

### 2. Recommendation

Show:

```text
Recommended Time
Estimated Savings
Renewable Benefit
Schedule Action
```

### 3. Charging Form

Fields:

```text
Arrival
Departure
Current SOC
Target SOC
Maximum Power
```

### 4. Impact

Show:

```text
CO₂ impact
Renewable usage
Charging cost trend
```

## Definition of Done

A driver can:

```text
Enter Charging Requirements
        ↓
Request Optimization
        ↓
Receive Recommendation
        ↓
See Savings / Renewable Benefit
```

**Dependency:** Phases 5 and 7.

---

# 14. Phase 9 — Grid Operator Dashboard

## Build Order

### KPI Row

```text
Grid Load
Grid Capacity
Renewable Generation
Grid Stress
EV Charging Load
```

### Main Chart

```text
Actual Load
Predicted Load
Grid Capacity
```

### Renewable Section

```text
Solar
Wind
Total Renewable
```

### Optimization Section

```text
Sessions Shifted
Peak Reduction
Renewable Improvement
Cost Impact
```

### Alerts

Show:

```text
Normal
High Load
Critical
```

## Definition of Done

A grid operator can identify:

- Current load
- Grid stress
- Renewable supply
- EV load
- Optimization impact

without leaving the dashboard.

**Dependency:** Phases 5 and 7.

---

# 15. Phase 10 — Network Operator Dashboard

## Build Order

### KPI Row

```text
Stations
Active Chargers
Sessions
Revenue
```

### Charger Status

```text
Online
Offline
Maintenance
```

### Utilization

Show:

```text
Current Utilization
Peak Period
Trend
```

### Station Table

```text
Station
Status
Chargers
Utilization
Sessions
Revenue
```

### Optimization

Show:

```text
Sessions that can shift
Recommended time
Expected impact
```

## Definition of Done

An operator can identify:

- Charger health
- Network utilization
- Sessions
- Revenue
- Load-shifting opportunities

from the dashboard.

**Dependency:** Phases 5 and 7.

---

# 16. Phase 11 — Frontend Integration

## Goal

Connect real backend data to all three dashboards.

## Tasks

Replace hardcoded dashboard values with API calls.

Create a centralized API client:

```text
services/api.js
```

Handle:

```text
GET
POST
authentication headers
errors
timeouts
```

## State

Use React state/hooks for MVP.

Avoid adding Redux unless the application actually needs it.

## Definition of Done

- Dashboard KPIs come from API data.
- Charts come from API data.
- Optimization actions call the backend.
- Results update without page reload where practical.

**Dependency:** Phases 7–10.

---

# 17. Phase 12 — Loading, Empty, Error, and Success States

## Loading

Use skeletons for:

```text
KPI Cards
Charts
Tables
```

Optimization should show:

```text
Optimizing charging schedule...
```

---

## Empty

Examples:

```text
No charging schedule yet
No active alerts
No active sessions
```

---

## Error

Examples:

```text
Could not load dashboard.
[Try Again]
```

---

## Infeasible

```text
No feasible schedule found.

Current charging requirements cannot
be satisfied with available time/capacity.
```

---

## Success

```text
Optimization Complete

Peak Load     ↓ 18%
Cost          ↓ ₹1,800
Renewable     ↑ 24%
```

## Definition of Done

Every major asynchronous action has:

```text
Loading
Success
Error
Empty
```

states where applicable.

---

# 18. Phase 13 — Integration Testing

## API Tests

Test:

```text
Authentication
Authorization
Validation
CRUD
Optimization
Error responses
```

---

## Optimization Tests

Test:

1. Feasible scenario
2. Infeasible scenario
3. No renewable generation
4. High peak demand
5. Restricted charging window
6. Limited charger capacity
7. Grid capacity constraint
8. Multiple EVs

---

## Frontend Tests

Test:

- Navigation
- Dashboard loading
- Forms
- Validation
- Optimization action
- Result rendering
- Error states

---

## End-to-End Scenario

Run:

```text
Load Seed Data
   ↓
Login as Driver
   ↓
Submit Charging Request
   ↓
Run Optimization
   ↓
View Recommendation
   ↓
Login as Grid Operator
   ↓
View Peak Reduction
   ↓
Login as Network Operator
   ↓
View Charger / Network Impact
```

## Definition of Done

The complete scenario runs without manual database edits.

---

# 19. Phase 14 — Bug Fixing and Stabilization

Fix issues in this order:

## P0 — Blocking

- Application cannot start
- API unavailable
- Optimization fails for valid input
- Invalid schedules are displayed as valid
- Unauthorized access succeeds

## P1 — Major

- Wrong KPI values
- Incorrect cost/savings
- Capacity calculation errors
- Broken dashboard flow
- Data mismatch between API and UI

## P2 — Minor

- Layout issues
- Typography issues
- Chart formatting
- Small interaction inconsistencies

---

# 20. Phase 15 — Security Review

Before deployment, verify:

- No secrets committed to Git
- `.env` excluded from version control
- Server-side authorization active
- Passwords hashed if authentication is implemented
- Input validation active
- SQL queries parameterized/ORM-based
- CORS restricted
- HTTPS enabled in deployment
- Internal stack traces hidden
- Sensitive information absent from logs

---

# 21. Phase 16 — Performance Review

## Backend

Measure:

```text
API latency
Optimization duration
Database query time
```

## Optimization

Confirm:

- Solver time limit configured
- Demo dataset remains responsive
- No unnecessary repeated solver calls

## Frontend

Check:

- Initial load
- Chart rendering
- Large-table behavior
- Mobile layout

### MVP Targets

```text
Typical dashboard API: < 2 sec
MVP optimization:      < 10 sec
```

These are practical demo targets, not production SLAs.

---

# 22. Phase 17 — Deployment

## Architecture

```text
GitHub
 ├── Frontend → Vercel
 └── Backend  → Render/Railway
                    ↓
                PostgreSQL
```

## Frontend Environment

```text
VITE_API_BASE_URL
```

## Backend Environment

```text
DATABASE_URL
JWT_SECRET
CORS_ORIGIN
```

## Deployment Checklist

### Frontend

- Production build succeeds.
- API URL is correct.
- Routes work on refresh.
- HTTPS works.

### Backend

- Application starts.
- Database connects.
- Environment variables are configured.
- API health endpoint works.
- CORS allows only the deployed frontend.

### Database

- Production schema is migrated.
- Seed/demo data is loaded if required.
- Backup strategy is understood.

---

# 23. Recommended Health Endpoint

Implement:

```text
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

For deployment testing, optionally include database connectivity:

```json
{
  "status": "ok",
  "database": "ok"
}
```

Do not expose secrets or internal system information.

---

# 24. Project Milestones

## M1 — Setup Complete

```text
Frontend + Backend + Database
```

### Milestone Condition
All services run locally.

---

## M2 — Optimization Complete

```text
EV/Grid Data
    ↓
CP-SAT
    ↓
Valid Schedule
```

### Milestone Condition
Core optimization tests pass.

---

## M3 — API Complete

```text
Backend APIs
    ↓
Real Optimization Result
```

### Milestone Condition
Frontend can retrieve and submit real data through APIs.

---

## M4 — Dashboards Complete

```text
Driver
Grid
Network
```

### Milestone Condition
All three dashboards display API-driven data.

---

## M5 — End-to-End Complete

```text
User
 ↓
API
 ↓
Optimizer
 ↓
Database
 ↓
Dashboard
```

### Milestone Condition
Full demo flow works without manual intervention.

---

## M6 — Deployment Complete

### Milestone Condition

The deployed application:

- Loads successfully
- Authenticates users
- Reads data
- Runs optimization
- Displays results
- Handles errors

---

# 25. Dependencies

```text
Project Setup
     ↓
Data Contracts
     ↓
Database + Seed Data
     ↓
CP-SAT Optimization
     ↓
Backend APIs
     ↓
Frontend Components
     ↓
Three Dashboards
     ↓
Integration Testing
     ↓
Bug Fixing
     ↓
Deployment
```

Some frontend component work may run in parallel with backend work after the design system is agreed.

---

# 26. Recommended Parallel Work

Once Phases 0–2 are complete:

```text
              Shared Data Contracts
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   CP-SAT Work    Backend API      Frontend UI
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                  Integration
                       ↓
                    Testing
```

This reduces idle time without creating conflicting architecture.

---

# 27. MVP Definition of Done

GreenCharge AI MVP is **Done** only when all conditions below are true.

## Core System

- [ ] Frontend runs in production.
- [ ] Backend runs in production.
- [ ] PostgreSQL is connected.
- [ ] Authentication/role handling works.
- [ ] Role authorization is enforced.

## Optimization

- [ ] CP-SAT produces valid schedules.
- [ ] Charging windows are respected.
- [ ] Required energy is satisfied when feasible.
- [ ] Grid capacity is respected.
- [ ] Charger capacity is respected.
- [ ] Baseline and optimized results are calculated.
- [ ] Infeasible scenarios are handled correctly.

## Driver

- [ ] Recommendation is visible.
- [ ] Savings are visible.
- [ ] Renewable usage is visible.
- [ ] Charging request works.

## Grid Operator

- [ ] Load is visible.
- [ ] Grid stress is visible.
- [ ] Renewable supply is visible.
- [ ] EV charging load is visible.
- [ ] Optimization impact is visible.

## Network Operator

- [ ] Charger status is visible.
- [ ] Sessions are visible.
- [ ] Utilization is visible.
- [ ] Revenue/estimated revenue is visible.
- [ ] Load-shifting opportunities are visible.

## Quality

- [ ] Validation errors work.
- [ ] Loading states work.
- [ ] Empty states work.
- [ ] Error states work.
- [ ] Responsive layout works.
- [ ] Accessibility basics are satisfied.
- [ ] No critical security issues remain.
- [ ] No secrets are committed.
- [ ] End-to-end demo works.

---

# 28. Suggested Final Demo Dataset

Use a single predictable scenario for the hackathon presentation.

```text
EV Requests:              100
Chargers:                  50
Time Slots:                24

Peak Period:         6 PM – 9 PM
Off-Peak Period:    11 PM – 3 AM

Peak Grid Load:             92%
Renewable Availability:    Higher in selected slots
Electricity Price:         Higher during peak
```

Example expected demonstration:

```text
Before Optimization
Peak Load       92%
Cost            Higher
Renewable Use   Lower

          ↓

CP-SAT Optimization

          ↓

After Optimization
Peak Load       74%
Cost            Lower
Renewable Use   Higher
```

Actual displayed results must come from the solver and dataset, not hardcoded claims.

---

# 29. Practical Development Rules

1. Build the optimizer before polishing the dashboards.
2. Use one source of truth for backend data.
3. Keep optimization logic separate from API routes.
4. Reuse frontend components.
5. Validate every API input server-side.
6. Never trust frontend authorization.
7. Use deterministic seed data for demos.
8. Do not add ML, maps, payments, or real-time integrations until the MVP works.
9. Test infeasible cases intentionally.
10. Show measurable baseline vs optimized results.

---

# 30. Final Build Order

```text
01. Repository + Local Setup
02. Data Models + API Contracts
03. Seed/Mock Dataset
04. PostgreSQL
05. CP-SAT Optimizer
06. Baseline + Impact Calculations
07. FastAPI Services
08. Authentication + Authorization
09. Shared React/Tailwind Components
10. EV Driver Dashboard
11. Grid Operator Dashboard
12. Network Operator Dashboard
13. API Integration
14. Loading/Error/Empty States
15. Unit + Integration + E2E Tests
16. Bug Fixing + Stabilization
17. Security Review
18. Performance Review
19. Deployment
20. Final Demo Verification
```

---

# 31. Final Development Principle

> **Build one reliable end-to-end optimization flow first, then expose it through three polished role-specific dashboards.**

The MVP should prove:

```text
Data
 ↓
Optimization
 ↓
Decision
 ↓
Measurable Impact
 ↓
User Action
```

That is the core GreenCharge AI product.
