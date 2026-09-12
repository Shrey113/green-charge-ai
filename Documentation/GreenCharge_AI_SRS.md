# GreenCharge AI — Software Requirements Specification (SRS)

**Version:** 1.0  
**Status:** Hackathon MVP  
**System:** GreenCharge AI  
**Core Engine:** Google OR-Tools CP-SAT

---

## 1. Purpose

This SRS defines the functional and non-functional requirements for GreenCharge AI.

GreenCharge AI is a web platform that optimizes EV charging schedules using EV requirements, grid constraints, electricity cost, renewable-energy availability, and charger capacity.

The MVP contains three role-based dashboards:

1. EV Driver
2. Grid Operator
3. EV Network Operator

The specification is written so that each requirement can be verified through testing.

---

# 2. Scope

## 2.1 In Scope

- Role-based web dashboards
- EV charging request data
- Grid and renewable-energy data
- Charger and station data
- CP-SAT optimization
- Charging schedule generation
- Cost and savings calculation
- Peak-load comparison
- Renewable-energy usage calculation
- Charger utilization metrics
- Validation and error handling
- Authentication and role-based authorization
- Basic audit logging

## 2.2 Out of Scope

- Direct physical charger control
- Utility SCADA integration
- Real electricity-market integration
- Payment processing
- Native mobile applications
- Production-grade ML forecasting
- Automated utility grid switching

---

# 3. System Overview

```text
User
  ↓
Web Application
  ↓
Authentication / Authorization
  ↓
REST API
  ↓
Validation
  ↓
Application Services
  ├── Driver Service
  ├── Grid Service
  ├── Network Service
  └── Optimization Service
          ↓
     CP-SAT Solver
          ↓
   Optimization Results
          ↓
      Dashboards
```

---

# 4. User Roles and Permissions

## 4.1 EV Driver

### Permissions

| Action | Permission |
|---|---|
| View own dashboard | Allow |
| View own charging data | Allow |
| Create/update own charging request | Allow |
| View own schedule | Allow |
| View own savings/impact | Allow |
| View grid-wide data | Deny |
| Manage chargers | Deny |
| Manage stations | Deny |
| Run network optimization | Deny |
| Manage users | Deny |

---

## 4.2 Grid Operator

### Permissions

| Action | Permission |
|---|---|
| View grid dashboard | Allow |
| View grid load | Allow |
| View renewable data | Allow |
| View EV charging load | Allow |
| View optimization results | Allow |
| Request grid optimization | Allow |
| View network-level charger status | Read-only |
| Modify individual driver data | Deny |
| Manage users | Deny |

---

## 4.3 EV Network Operator

### Permissions

| Action | Permission |
|---|---|
| View network dashboard | Allow |
| View stations | Allow |
| View chargers | Allow |
| View sessions | Allow |
| View utilization | Allow |
| View revenue/estimated revenue | Allow |
| Request network optimization | Allow |
| View grid summary | Read-only |
| Modify grid configuration | Deny |
| Manage users | Deny |

---

# 5. Authentication Requirements

## AUTH-001 — Login

The system shall require authenticated access to protected dashboards.

**Test:** Attempt to access a protected dashboard without authentication.

**Expected:** HTTP 401 or equivalent login response.

---

## AUTH-002 — Valid Login

The system shall authenticate a user when valid credentials are provided.

**Test:** Submit valid credentials.

**Expected:** User session/token is created and the user is redirected to the appropriate dashboard.

---

## AUTH-003 — Invalid Login

The system shall reject invalid credentials.

**Test:** Submit an incorrect password.

**Expected:** Authentication fails and no protected session is created.

---

## AUTH-004 — Session Expiry

The system shall invalidate an expired session.

**Test:** Access a protected endpoint using an expired token/session.

**Expected:** HTTP 401 and re-authentication is required.

---

## AUTH-005 — Password Security

Passwords shall never be stored in plaintext.

**Test:** Inspect stored credential data.

**Expected:** Passwords are stored only as secure one-way password hashes.

---

## AUTH-006 — MVP Role Simulation

For the hackathon MVP, a controlled role selector may be used instead of full production authentication.

**Requirement:** The simulated role must still enforce the same dashboard permissions.

---

# 6. Authorization Requirements

## AUTHZ-001 — Role Enforcement

The backend shall enforce permissions based on the authenticated role.

**Test:** Send a driver request to a grid-only endpoint.

**Expected:** HTTP 403.

---

## AUTHZ-002 — Resource Ownership

An EV driver shall access only their own driver-specific records.

**Test:** Attempt to retrieve another driver's charging request.

**Expected:** Access denied.

---

## AUTHZ-003 — Operator Isolation

A network operator shall not modify grid configuration.

**Test:** Send a grid configuration update using a network operator token.

**Expected:** HTTP 403.

---

# 7. Functional Requirements

# 7.1 Driver Dashboard

## FR-DRV-001 — Dashboard Access

The system shall display the authenticated driver's dashboard.

**Acceptance:** Dashboard loads with driver-specific data and no operator-only controls.

---

## FR-DRV-002 — Green Score

The system shall display a Green Score for the driver's charging behavior.

**Acceptance:** A numeric score is displayed with a defined range, e.g. 0–100.

---

## FR-DRV-003 — Recommended Schedule

The system shall display the recommended charging start/end period returned by the optimizer.

**Acceptance:** The displayed window matches the optimizer response.

---

## FR-DRV-004 — Savings

The system shall display estimated charging savings for the optimized schedule.

**Acceptance:** Savings equals baseline estimated cost minus optimized estimated cost.

---

## FR-DRV-005 — Renewable Usage

The system shall display the percentage of charging energy supplied during renewable-favorable slots.

**Acceptance:** Value is calculated from optimization output and is between 0% and 100%.

---

## FR-DRV-006 — Charging Request

The driver shall be able to submit a charging request containing:

- Arrival time
- Departure time
- Required energy
- Maximum charging power

**Acceptance:** Valid requests are stored and invalid requests are rejected.

---

# 7.2 Grid Operator Dashboard

## FR-GRID-001 — Current Load

The system shall display current grid load.

**Acceptance:** Current load is shown with its unit.

---

## FR-GRID-002 — Grid Capacity

The system shall display configured grid capacity.

**Acceptance:** Capacity is loaded from the configured dataset.

---

## FR-GRID-003 — Grid Stress

The system shall calculate a grid stress state.

Suggested MVP thresholds:

```text
Normal:   < 75%
High:     75%–90%
Critical: > 90%
```

**Acceptance:** The displayed state matches the configured threshold rule.

---

## FR-GRID-004 — Renewable Supply

The system shall display available renewable generation.

**Acceptance:** Solar and wind values are shown when present in the input dataset.

---

## FR-GRID-005 — EV Charging Load

The system shall display aggregate EV charging load.

**Acceptance:** EV load equals the sum of scheduled EV charging power for the relevant time slot.

---

## FR-GRID-006 — Load Forecast

The system shall display time-series load data for actual and predicted values when forecast data is available.

---

## FR-GRID-007 — Optimization Impact

The dashboard shall display optimization impact including, where calculable:

- Peak load reduction
- Cost change
- Renewable-energy improvement
- Sessions shifted

---

# 7.3 EV Network Operator Dashboard

## FR-NET-001 — Charger Status

The system shall display counts for:

- Online
- Offline
- Maintenance

**Acceptance:** Status counts equal records in the charger dataset.

---

## FR-NET-002 — Active Sessions

The system shall display active EV charging sessions.

---

## FR-NET-003 — Charger Utilization

The system shall calculate charger utilization.

For MVP:

```text
Utilization =
Occupied Charger Time / Available Charger Time × 100
```

**Acceptance:** Result is between 0% and 100%.

---

## FR-NET-004 — Revenue

The system shall display total revenue or estimated revenue from completed/active charging sessions according to the configured demo calculation.

---

## FR-NET-005 — Station Performance

The system shall provide station-level metrics such as:

- Sessions
- Energy delivered
- Utilization
- Revenue

---

## FR-NET-006 — Load-Shifting Recommendation

The system shall display flexible charging sessions that can be moved to another time slot without violating constraints.

---

# 8. Optimization Requirements

# 8.1 Input Requirements

## OPT-001 — EV Input

Each EV optimization record shall support:

```text
ev_id
arrival_time
departure_time
required_energy_kwh
max_charging_power_kw
```

---

## OPT-002 — Grid Input

Each time slot shall support:

```text
timestamp
base_load_mw
grid_capacity_mw
electricity_price
renewable_generation_mw
```

---

## OPT-003 — Charger Input

Each charger shall support:

```text
charger_id
station_id
status
max_power_kw
```

---

# 8.2 Decision Variables

## OPT-010

The solver shall create a charging decision for each eligible EV/time slot.

Conceptually:

```text
charge[e][t]
```

The MVP may use binary values:

```text
0 = Not charging
1 = Charging
```

---

# 8.3 Constraints

## OPT-020 — Charging Window

Charging shall only occur inside the EV's arrival/departure window.

**Test:** Create an EV with a restricted window.

**Expected:** No scheduled charging exists outside the window.

---

## OPT-021 — Required Energy

The optimized schedule shall deliver the EV's required energy for all feasible scenarios.

**Test:** Compare delivered energy with required energy.

**Expected:** Delivered energy >= required energy.

---

## OPT-022 — Grid Capacity

The schedule shall not exceed grid capacity.

**Test:** Calculate total load for every time slot.

**Expected:**

```text
Base Load + EV Load <= Grid Capacity
```

---

## OPT-023 — Charger Capacity

The schedule shall not exceed available charger capacity.

**Test:** Count simultaneous sessions per time slot.

**Expected:** Simultaneous sessions <= available chargers.

---

## OPT-024 — Charging Power

Charging power shall not exceed the configured EV/charger power limit.

---

# 8.4 Optimization Objective

## OPT-030

The solver shall optimize for a weighted combination of:

- Charging cost reduction
- Peak-load reduction
- Renewable-energy utilization

Conceptually:

```text
Minimize:
Cost
+ Peak Penalty
- Renewable Reward
```

The weights shall be configurable.

---

## OPT-031 — Feasibility

The optimization service shall return a clear solver status.

Allowed MVP states:

```text
OPTIMAL
FEASIBLE
INFEASIBLE
UNKNOWN
```

**Acceptance:** Dashboard does not present an infeasible schedule as valid.

---

## OPT-032 — Result Generation

A successful optimization response shall include enough data to display:

```text
status
schedule
baseline_cost
optimized_cost
savings
baseline_peak
optimized_peak
renewable_usage
sessions_shifted
```

---

# 9. Data Requirements

## 9.1 EV Entity

```text
ev_id: string
user_id: string
battery_capacity_kwh: number
current_soc_percent: number
target_soc_percent: number
```

### Validation

- `ev_id` required and unique
- Battery capacity > 0
- SOC between 0 and 100
- Target SOC between 0 and 100
- Target SOC >= current SOC

---

## 9.2 Charging Request

```text
request_id: string
ev_id: string
arrival_time: datetime
departure_time: datetime
required_energy_kwh: number
max_power_kw: number
status: enum
```

### Validation

- Arrival time required
- Departure time required
- Departure must be after arrival
- Required energy > 0
- Maximum power > 0
- EV must exist

---

## 9.3 Charger

```text
charger_id: string
station_id: string
status: enum
max_power_kw: number
```

Valid status values:

```text
ONLINE
OFFLINE
MAINTENANCE
```

---

## 9.4 Station

```text
station_id: string
name: string
location: string
```

---

## 9.5 Grid Record

```text
timestamp: datetime
base_load_mw: number
capacity_mw: number
electricity_price: number
renewable_generation_mw: number
```

### Validation

- Base load >= 0
- Capacity > 0
- Price >= 0 for standard positive-price MVP scenarios
- Renewable generation >= 0
- Renewable generation should not exceed configured physical upper bounds

---

# 10. Validation Requirements

## VAL-001 — Required Fields

The API shall reject requests missing required fields.

**Expected:** HTTP 400 or equivalent validation response.

---

## VAL-002 — Numeric Ranges

The API shall reject invalid negative values for:

- Energy
- Power
- Capacity
- Load
- Renewable generation

---

## VAL-003 — Time Ordering

The API shall reject:

```text
departure_time <= arrival_time
```

---

## VAL-004 — Duplicate IDs

Entity identifiers shall be unique.

---

## VAL-005 — Unknown References

A charging request referencing a non-existent EV shall be rejected.

---

## VAL-006 — Data Consistency

The system shall reject logically inconsistent scenarios, such as:

```text
required_energy > maximum deliverable energy within charging window
```

when such inconsistency can be identified before optimization.

---

# 11. Business Rules

## BR-001 — Driver Flexibility

Only charging inside the user-provided arrival/departure window may be shifted.

---

## BR-002 — Grid Protection

A valid optimized schedule shall never exceed configured grid capacity.

---

## BR-003 — Energy Requirement

A feasible optimized schedule shall satisfy the requested energy target.

---

## BR-004 — Charger Availability

A charger cannot support more simultaneous sessions than its configured capacity.

---

## BR-005 — Optimization Preference

When feasible alternatives exist, the optimizer should prefer lower-cost and/or higher-renewable periods according to configured objective weights.

---

## BR-006 — Baseline Comparison

Savings and optimization impact shall be calculated against a defined baseline schedule using the same input data.

---

# 12. API Requirements

## Driver

```text
GET  /api/driver/dashboard
GET  /api/driver/schedule
POST /api/driver/schedule
GET  /api/driver/impact
```

## Grid

```text
GET  /api/grid/status
GET  /api/grid/load
GET  /api/grid/forecast
GET  /api/grid/renewables
POST /api/grid/optimize
```

## Network

```text
GET  /api/network/dashboard
GET  /api/network/stations
GET  /api/network/chargers
GET  /api/network/sessions
POST /api/network/optimize
```

## Optimization

```text
POST /api/optimization/run
```

---

# 13. Error Handling

## ERR-001 — Standard Error Format

API errors should use a consistent structure.

Example:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "departure_time must be after arrival_time",
  "field": "departure_time"
}
```

---

## ERR-002 — Authentication Error

Return:

```text
401 Unauthorized
```

for missing/invalid authentication.

---

## ERR-003 — Authorization Error

Return:

```text
403 Forbidden
```

for insufficient permissions.

---

## ERR-004 — Not Found

Return:

```text
404 Not Found
```

when a requested resource does not exist.

---

## ERR-005 — Solver Infeasibility

When no schedule satisfies all constraints:

```text
status = INFEASIBLE
```

The UI shall show a clear explanation and shall not display the result as an approved schedule.

---

## ERR-006 — Solver Failure

Unexpected solver/application failure shall return a safe error response without exposing internal stack traces.

---

## ERR-007 — Frontend Error State

The frontend shall display a user-readable error state and a retry action where appropriate.

---

# 14. Edge Cases

## EDGE-001 — No Flexible Time

An EV's charging window may be too narrow to shift.

**Expected:** Keep the charge within the available window or return INFEASIBLE.

---

## EDGE-002 — Grid Fully Loaded

If grid capacity is already consumed by base load:

```text
Base Load >= Grid Capacity
```

**Expected:** No additional EV charging is scheduled unless capacity changes.

---

## EDGE-003 — Insufficient Charger Capacity

If charger capacity is insufficient for all requests:

**Expected:** The optimizer schedules feasible sessions where possible or reports INFEASIBLE.

---

## EDGE-004 — No Renewable Generation

If renewable generation is zero:

**Expected:** Optimization still works using cost and grid constraints.

---

## EDGE-005 — Renewable Generation Exceeds EV Demand

**Expected:** The system does not report more EV renewable usage than actual charging energy.

---

## EDGE-006 — Multiple Optimal Solutions

If multiple schedules have the same objective value:

**Expected:** Return any valid optimal schedule consistently enough for the demo.

---

## EDGE-007 — Missing Forecast

If forecast data is unavailable:

**Expected:** Dashboard shows an unavailable state rather than fabricated values.

---

## EDGE-008 — Optimization Timeout

**Expected:** Return the solver status and best available feasible result when supported; otherwise return a clear timeout state.

---

## EDGE-009 — Zero Active Chargers

**Expected:** Network dashboard displays zero availability and optimization handles capacity correctly.

---

# 15. Security Requirements

## SEC-001 — HTTPS

Production deployment shall use HTTPS.

---

## SEC-002 — Input Validation

All client input shall be validated on the server.

---

## SEC-003 — Authorization

Every protected API operation shall verify user role/permission server-side.

---

## SEC-004 — Sensitive Data

Passwords, tokens, and other secrets shall not be logged.

---

## SEC-005 — Error Disclosure

Internal stack traces, database details, and secrets shall not be returned to clients.

---

## SEC-006 — API Protection

Production API should apply:

- Rate limiting
- Request size limits
- CORS restrictions
- Secure headers

---

## SEC-007 — Audit Logging

Important operator actions should record:

```text
user_id
role
action
timestamp
result
```

For MVP, logging may be limited to optimization actions and administrative events.

---

# 16. Performance Requirements

## PERF-001 — Dashboard Response

For the hackathon dataset, standard dashboard API requests should normally complete within **2 seconds**, excluding solver execution.

---

## PERF-002 — Optimization Response

For the defined MVP demo dataset, optimization should normally complete within **10 seconds**.

This is a demonstration target, not a production SLA.

---

## PERF-003 — UI Responsiveness

Dashboard interactions should provide visible feedback within **200 ms** where possible.

---

## PERF-004 — Dataset Size

The MVP should support at least:

- 100 EV charging requests
- 24 time slots
- 50 chargers

without functional failure.

---

## PERF-005 — Solver Configuration

The optimization service shall have a configurable solver time limit.

---

# 17. Usability Requirements

## UX-001 — Consistent Design

All three dashboards shall use the GreenCharge AI green/white design system.

Primary green:

```text
#16A34A
```

Background:

```text
#F9FAFB
```

Cards:

```text
#FFFFFF
```

---

## UX-002 — Driver Simplicity

The driver dashboard shall prioritize:

1. Recommended charging time
2. Savings
3. Green Score
4. Renewable usage

---

## UX-003 — Operator Clarity

Grid and network dashboards shall prioritize important operational metrics without requiring deep navigation.

---

## UX-004 — Status Accessibility

System status shall not be communicated through color alone. Use labels and/or icons in addition to colors.

---

# 18. Acceptance Criteria

## AC-001 — Role Access

Each valid role can access only its authorized dashboard and actions.

---

## AC-002 — Valid Charging Request

A valid request is accepted and can be passed to optimization.

---

## AC-003 — Invalid Request

Invalid time, energy, or power values are rejected with a clear validation error.

---

## AC-004 — Feasible Optimization

For a feasible test dataset, CP-SAT returns a valid schedule satisfying all configured constraints.

---

## AC-005 — Required Energy

For every feasible EV:

```text
Delivered Energy >= Required Energy
```

---

## AC-006 — Grid Capacity

For every optimized time slot:

```text
Base Load + EV Load <= Grid Capacity
```

---

## AC-007 — Charger Capacity

For every optimized time slot:

```text
Active Sessions <= Available Charger Capacity
```

---

## AC-008 — Driver Output

The driver dashboard displays:

- Recommended charging window
- Estimated cost/savings
- Renewable usage
- Green Score

---

## AC-009 — Grid Output

The grid dashboard displays:

- Load
- Capacity
- Grid stress
- Renewable supply
- EV load
- Optimization impact

---

## AC-010 — Network Output

The network dashboard displays:

- Charger status
- Active sessions
- Utilization
- Revenue/estimated revenue
- Load-shifting opportunities

---

## AC-011 — Baseline Comparison

The application shows baseline and optimized values for at least:

- Cost
- Peak load
- Renewable usage

---

## AC-012 — Infeasible Scenario

An infeasible optimization is clearly identified and no invalid schedule is presented as successful.

---

## AC-013 — Unauthorized Access

A role attempting a forbidden operation receives an authorization error.

---

## AC-014 — Error Safety

Unexpected backend failures do not expose internal implementation details.

---

# 19. MVP Definition of Done

The MVP is considered complete when:

```text
EV / Grid / Charger Data
        ↓
Validated Input
        ↓
CP-SAT Optimization
        ↓
Feasible Schedule
        ↓
Baseline vs Optimized Metrics
        ↓
Three Role-Specific Dashboards
```

works end-to-end for a representative demo scenario.

---

# 20. Requirement Traceability Summary

| Area | Requirements |
|---|---|
| Authentication | AUTH-001 to AUTH-006 |
| Authorization | AUTHZ-001 to AUTHZ-003 |
| Driver | FR-DRV-001 to FR-DRV-006 |
| Grid | FR-GRID-001 to FR-GRID-007 |
| Network | FR-NET-001 to FR-NET-006 |
| Optimization | OPT-001 to OPT-032 |
| Validation | VAL-001 to VAL-006 |
| Business Rules | BR-001 to BR-006 |
| Error Handling | ERR-001 to ERR-007 |
| Edge Cases | EDGE-001 to EDGE-009 |
| Security | SEC-001 to SEC-007 |
| Performance | PERF-001 to PERF-005 |
| Usability | UX-001 to UX-004 |
| Acceptance | AC-001 to AC-014 |

---

# 21. Final SRS Summary

GreenCharge AI must provide a secure, role-aware, testable optimization platform that converts EV, grid, renewable, and charger inputs into feasible charging schedules.

The MVP's core requirement is:

```text
Respect EV Requirements
+
Respect Grid Capacity
+
Respect Charger Capacity
+
Optimize Cost / Peak / Renewable Usage
=
Actionable Charging Schedule
```

The system succeeds when the optimization is demonstrably valid and its impact is understandable to EV drivers, grid operators, and EV network operators.
