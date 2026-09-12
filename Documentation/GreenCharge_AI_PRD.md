# GreenCharge AI — Product Requirements Document (PRD)

## 1. Product Overview

**GreenCharge AI** is an EV charging and renewable-energy optimization platform. It uses **Google OR-Tools CP-SAT** to create charging schedules that balance:

- EV charging requirements
- Grid capacity and demand
- Electricity cost
- Renewable-energy availability
- Charger availability

The product provides three dashboards:

1. **EV Driver** — simple charging recommendations, savings, and green impact.
2. **Grid Operator** — grid load, renewable supply, stress, and optimization impact.
3. **EV Network Operator** — charger status, utilization, sessions, revenue, and load shifting.

**Core value:** move flexible EV charging to better time slots to reduce cost and peak demand while increasing renewable-energy usage.

---

## 2. Problem

EV charging can create high demand when many vehicles charge during the same peak period. This can cause:

- Higher grid stress and peak load
- Higher charging costs
- Lower renewable-energy utilization
- Uneven charger utilization

Users and operators need a practical way to identify **when EV charging should occur**, while still satisfying vehicle and infrastructure constraints.

---

## 3. Proposed Solution

GreenCharge AI collects EV, grid, renewable-energy, and charger data, then uses CP-SAT optimization to generate a feasible charging schedule.

```text
EV + Grid + Renewable + Charger Data
                ↓
        CP-SAT Optimization
                ↓
        Optimized Schedule
                ↓
 Cost Reduction + Peak Reduction + Higher Renewable Use
```

---

## 4. Target Users

### EV Driver
Needs a simple answer to:
- When should I charge?
- How much can I save?
- How green is my charging?

### Grid Operator
Needs to know:
- Current and forecast load
- Grid stress
- Renewable supply
- EV charging impact
- Potential load shift

### EV Network Operator
Needs to know:
- Charger availability
- Active sessions
- Utilization
- Network performance
- Load-shifting opportunities

---

## 5. Product Goals

### Primary Goals

1. Generate feasible EV charging schedules with CP-SAT.
2. Reduce peak EV charging demand.
3. Reduce charging cost where flexible windows exist.
4. Increase use of available renewable energy.
5. Improve charger utilization.
6. Present clear, role-specific actions.

### MVP Principle

> Prioritize one complete optimization flow over many disconnected features.

---

## 6. Core Features

### F1. EV Charging Optimization

Inputs:

- EV ID
- Arrival time
- Departure time
- Required energy
- Maximum charging power
- Charger availability
- Grid load/capacity
- Electricity price
- Renewable generation

Output:

- Charging time slots
- Estimated cost
- Estimated savings
- Peak-load change
- Renewable-energy usage

### F2. Smart Charging Recommendation

For drivers, show the best available charging window and expected benefits.

### F3. Grid Monitoring

Show:

- Current grid load
- Grid capacity
- EV charging load
- Renewable generation
- Grid stress

### F4. Load Shifting

Identify flexible charging sessions that can move from peak periods to lower-load periods.

### F5. Network Monitoring

Show:

- Online chargers
- Offline chargers
- Maintenance chargers
- Active sessions
- Utilization
- Revenue/estimated revenue

### F6. Before vs After Optimization

Compare the baseline with the optimized scenario using measurable metrics.

---

## 7. MVP Scope

### Must Have

- Three dashboards
- Green/white responsive UI
- Mock EV, grid, renewable, and charger data
- CP-SAT optimization
- Charging-window constraint
- Required-energy constraint
- Grid-capacity constraint
- Charger-capacity constraint
- Cost/peak/renewable optimization objective
- Optimization result visualization
- Baseline vs optimized comparison

### Optional After MVP

- Authentication
- Persistent database
- Real-time data
- Demand forecasting
- Weather integration
- Maps
- Notifications

---

## 8. User Stories

### EV Driver

**US-01:** As an EV driver, I want a recommended charging time so I can charge at a better time.

**US-02:** As an EV driver, I want to see estimated savings so I understand the benefit.

**US-03:** As an EV driver, I want to see renewable-energy usage so I understand the environmental impact.

### Grid Operator

**US-04:** As a grid operator, I want to see current load and capacity so I can identify stress.

**US-05:** As a grid operator, I want to see renewable supply so I can understand available clean energy.

**US-06:** As a grid operator, I want to compare baseline and optimized load so I can measure the impact of charging optimization.

### EV Network Operator

**US-07:** As a network operator, I want to see charger status so I can monitor infrastructure.

**US-08:** As a network operator, I want to see utilization and sessions so I can identify demand patterns.

**US-09:** As a network operator, I want to see load-shifting opportunities so I can improve network efficiency.

---

## 9. Success Metrics

| Metric | MVP Success Criteria |
|---|---|
| Schedule feasibility | All valid EV requirements satisfied |
| Grid capacity | No configured capacity violations |
| Peak demand | Optimized result improves baseline when flexibility exists |
| Charging cost | Optimized cost lower than baseline when cheaper slots exist |
| Renewable usage | Increased when renewable-rich slots are available |
| UX | Primary action is clear on each dashboard |
| End-to-end demo | Input → Optimization → Result works reliably |

---

## 10. Assumptions

- EV charging can be shifted within its arrival/departure window.
- Grid data is available by time slot.
- Electricity price varies or has usable time-slot values.
- Renewable generation is available as time-series input.
- Charger capacity is known.
- Mock data is acceptable for the MVP.
- The MVP recommends schedules but does not directly control physical chargers.

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Solver complexity | Use fixed time slots and a limited demo dataset |
| Infeasible schedules | Validate inputs and report INFEASIBLE clearly |
| Unrealistic mock data | Keep scenarios logically consistent |
| Scope creep | Keep optimization and dashboards as the core |
| Too much UI complexity | Use role-specific information density |

---

## 12. Out of Scope

The MVP will not include:

- Direct physical charger control
- Utility SCADA integration
- Real electricity-market integration
- Payment processing
- Native mobile apps
- Full enterprise authentication
- Advanced ML forecasting
- Production-grade automated grid control

---

## 13. Acceptance Criteria

### AC-01: Dashboards
The system displays the correct dashboard for each user role.

### AC-02: Optimization
Valid EV and grid inputs can be processed by the CP-SAT optimizer.

### AC-03: Charging Requirements
Every feasible EV receives its required energy within its allowed charging window.

### AC-04: Capacity
The optimized schedule does not exceed configured grid or charger capacity.

### AC-05: Driver Result
The driver can see recommended time, estimated savings, and renewable usage.

### AC-06: Grid Result
The grid operator can see load, renewable supply, stress, and optimization impact.

### AC-07: Network Result
The network operator can see charger status, sessions, utilization, and load-shifting opportunities.

### AC-08: Comparison
The system shows baseline vs optimized results.

### AC-09: Error Handling
Invalid inputs produce clear validation errors.

### AC-10: Infeasibility
When no valid schedule exists, the system clearly reports the optimization as infeasible.

---

## 14. MVP User Flow

```text
Enter / Load Data
       ↓
Validate Inputs
       ↓
Run CP-SAT Optimization
       ↓
Generate Schedule
       ↓
Calculate Impact
       ↓
Show Dashboard Results
```

---

## 15. Final Product Definition

GreenCharge AI is successful as an MVP when it demonstrates one clear story:

```text
Peak EV Charging Demand
          ↓
GreenCharge AI
          ↓
CP-SAT Optimization
          ↓
Smart Charging Schedule
          ↓
Lower Cost
Lower Peak Load
Higher Renewable Usage
```

**Product tagline:** Charge Smart. Save Green. Stabilize the Grid.
