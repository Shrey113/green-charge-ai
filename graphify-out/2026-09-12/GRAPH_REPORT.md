# Graph Report - green-charge-ai  (2026-09-12)

## Corpus Check
- 70 files · ~361,330 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 908 nodes · 1140 edges · 99 communities (93 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `71f622ed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- server/package.json
- ChargingStations.jsx
- ev_charging_optimizer.py
- package.json
- GreenCharge AI — Product Requirements Document (PRD)
- GreenCharge_AI_UI_UX.md
- GridOperatorApp.jsx
- react
- GreenCharge AI
- db.js
- customerData.js
- .oxlintrc.json
- dashboardService.js
- check_mongodb.js
- SVG Icons Sprite Sheet
- GreenCharge_AI_Architecture.md
- GreenCharge AI — Microservice API & Payload Specification
- 18. Acceptance Criteria
- 9. Phase 4 — CP-SAT Optimization Engine
- GreenCharge_AI_SRS.md
- GreenCharge_AI_Development_Plan.md
- 24. Project Milestones
- 42. UX Acceptance Criteria
- 11. Suggested Tables
- Tasks
- 14. Edge Cases
- 9. Data Requirements
- 28. Component Library
- electricity_maps_sample.py
- Build Order
- Build Order
- 22. Phase 17 — Deployment
- Tasks
- Dataset
- 13. Error Handling
- 15. Security Requirements
- 7.2 Grid Operator Dashboard
- 36. Accessibility
- Build Order
- 17. Phase 12 — Loading, Empty, Error, and Success States
- 27. MVP Definition of Done
- 10. Validation Requirements
- 11. Business Rules
- 4. User Roles and Permissions
- 5. Authentication Requirements
- 7.1 Driver Dashboard
- 7.3 EV Network Operator Dashboard
- 24. Practical Architecture Decisions
- 6. API Layer
- 18. Phase 13 — Integration Testing
- Must Build
- 16. Performance Requirements
- 8.3 Constraints
- Shared Sidebar
- 13. Optimization Component
- Recommended MVP
- 11. Phase 6 — Authentication and Authorization
- 12. Phase 7 — Frontend Design System
- 16. Phase 11 — Frontend Integration
- 21. Phase 16 — Performance Review
- 8. Phase 3 — Database Layer
- 12. API Requirements
- 17. Usability Requirements
- 13. Screen Inventory
- 2. Design Principles
- 39. GreenCharge AI Design System Summary
- rules/graphify.md
- 12. Data Flow
- 18. Logging and Monitoring
- 4. Three Dashboard Architecture
- 19. Phase 14 — Bug Fixing and Stabilization
- 6. Phase 1 — Define Data Contracts
- 6. Authorization Requirements
- 8.1 Input Requirements
- 8.4 Optimization Objective
- 29. Interaction Guidelines
- 31. Empty States
- 32. Error States
- 34. Responsive Behavior
- 35. Mobile Dashboard Priority
- 3. Visual Theme
- 41. MVP UI Priority
- 9. Navigation Behavior
- GreenCharge AI - Project Structure
- React + Vite
- workflows/graphify.md
- 15. Storage Strategy
- 1. Architecture Overview
- 21. Performance Strategy
- 3. Frontend Architecture
- 5. Backend Architecture
- 7. Authentication
- 15. EV Driver Dashboard
- 17. Driver Charging Form
- 30. Loading States
- 40. Implementation Guidelines
- 6. Shape and Elevation
- 14. Login Screen
- 4. Typography

## God Nodes (most connected - your core abstractions)
1. `react` - 35 edges
2. `GreenCharge AI — Product Requirements Document (PRD)` - 16 edges
3. `18. Acceptance Criteria` - 15 edges
4. `parse_optimizer_dicts()` - 12 edges
5. `GreenCharge AI` - 12 edges
6. `execute_optimization()` - 11 edges
7. `13. Acceptance Criteria` - 11 edges
8. `42. UX Acceptance Criteria` - 11 edges
9. `compute_unmanaged_baseline()` - 10 edges
10. `11. Suggested Tables` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Web Application HTML Root` --references--> `GreenCharge Favicon`  [EXTRACTED]
  index.html → public/favicon.svg
- `execute_optimization()` --uses--> `OptimizationResult`  [INFERRED]
  cp_sat/server.py → cp_sat/ev_charging_optimizer.py
- `execute_optimization()` --calls--> `OptimizationConfig`  [EXTRACTED]
  cp_sat/server.py → cp_sat/ev_charging_optimizer.py
- `execute_optimization()` --calls--> `EVChargingOptimizer`  [EXTRACTED]
  cp_sat/server.py → cp_sat/ev_charging_optimizer.py
- `execute_optimization()` --calls--> `parse_optimizer_dicts()`  [EXTRACTED]
  cp_sat/server.py → cp_sat/ev_charging_optimizer.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Role-based Dashboards Suite** — documentation_greencharge_ai_project_overview_ev_driver_dashboard, documentation_greencharge_ai_project_overview_grid_operator_dashboard, documentation_greencharge_ai_project_overview_ev_network_operator_dashboard [INFERRED 0.95]

## Communities (99 total, 6 thin omitted)

### Community 0 - "server/package.json"
Cohesion: 0.13
Nodes (14): dependencies, cors, dotenv, express, cors, dotenv, express, main (+6 more)

### Community 1 - "ChargingStations.jsx"
Cohesion: 0.26
Nodes (12): calculateDistanceKm(), ChargingStations(), FALLBACK_STATIONS, STATION_IMAGES, USER_LOCATION, TestDatabase(), fetchCollectionData(), fetchDatabaseCollections() (+4 more)

### Community 2 - "ev_charging_optimizer.py"
Cohesion: 0.05
Nodes (65): BackgroundTasks, BaseModel, BaselineMetric, Charger, ChargingSlotAllocation, check_connector_compatibility(), compute_unmanaged_baseline(), EVChargingOptimizer (+57 more)

### Community 3 - "package.json"
Cohesion: 0.07
Nodes (29): dependencies, cors, dotenv, express, mongoose, react, react-dom, devDependencies (+21 more)

### Community 4 - "GreenCharge AI — Product Requirements Document (PRD)"
Cohesion: 0.05
Nodes (42): 10. Assumptions, 11. Risks, 12. Out of Scope, 13. Acceptance Criteria, 14. MVP User Flow, 15. Final Product Definition, 1. Product Overview, 2. Problem (+34 more)

### Community 5 - "GreenCharge_AI_UI_UX.md"
Cohesion: 0.07
Nodes (26): 10. User Journey — EV Driver, 11. User Journey — Grid Operator, 12. User Journey — Network Operator, 16. Driver Recommendation Card, 18. Green Score Component, 19. Grid Operator Dashboard, 1. Design Goal, 20. Grid Status Card (+18 more)

### Community 6 - "GridOperatorApp.jsx"
Cohesion: 0.12
Nodes (19): GridOperatorHeader(), GridOperatorSidebar(), navItems, GujaratMap(), GridOperatorApp(), AlertsPage(), AnalyticsAlertsPage(), DashboardOverview() (+11 more)

### Community 7 - "react"
Cohesion: 0.09
Nodes (29): Web Application HTML Root, GreenCharge Favicon, react, App(), Landing Hero Illustration, React Logo Vector, navItems, Sidebar() (+21 more)

### Community 8 - "GreenCharge AI"
Cohesion: 0.09
Nodes (22): Charge Smart. Save Green. Stabilize the Grid., Dashboard Color Usage, Design Principle, EV Driver Dashboard, EV Network Operator Dashboard, Functional Colors, GreenCharge AI, GreenCharge AI (+14 more)

### Community 9 - "db.js"
Cohesion: 0.07
Nodes (38): mongoose, CarCustomer, carCustomerSchema, Customer, customerSchema, dataSchema, EVData, StationOperator (+30 more)

### Community 10 - "customerData.js"
Cohesion: 0.25
Nodes (7): analyticsSummaryData, chargingHistorySessions, customerProfile, dashboardKpis, scheduleSummaryData, stationList, vehicleData

### Community 11 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 12 - "dashboardService.js"
Cohesion: 0.40
Nodes (4): mockChargersList, mockEvRequests, mockRecentActivity, stationKpiMetrics

### Community 15 - "GreenCharge_AI_Architecture.md"
Cohesion: 0.10
Nodes (20): 10. Core Database Entities, 14. Baseline Calculation, 16. Security Architecture, 17. Error Handling Architecture, 20. Scalability, 22. Availability and Failure Handling, 23. API-to-Component Mapping, 25. Architecture Sequence — Optimization Request (+12 more)

### Community 16 - "GreenCharge AI — Microservice API & Payload Specification"
Cohesion: 0.13
Nodes (14): 1. System Architecture & Flow, 2. Service Endpoints Summary, 3.1 Supported Request Body Formats, 3.2 Schema Definition (TypeScript Interface), 3.3 Complete Input Payload Example (`input_payload.json`), 3. Exact Input Payload Specification (`POST /api/v1/optimize`), 4.1 Schema Definition (TypeScript Interface), 4.2 Complete Output Payload Example (`output_payload.json`) (+6 more)

### Community 17 - "18. Acceptance Criteria"
Cohesion: 0.13
Nodes (15): 18. Acceptance Criteria, AC-001 — Role Access, AC-002 — Valid Charging Request, AC-003 — Invalid Request, AC-004 — Feasible Optimization, AC-005 — Required Energy, AC-006 — Grid Capacity, AC-007 — Charger Capacity (+7 more)

### Community 18 - "9. Phase 4 — CP-SAT Optimization Engine"
Cohesion: 0.14
Nodes (14): 9.1 Inputs, 9.2 Decision Variables, 9.3 Constraints, 9.4 Objective, 9.5 Baseline, 9.6 Result Parser, 9. Phase 4 — CP-SAT Optimization Engine, C1 — Charging Window (+6 more)

### Community 19 - "GreenCharge_AI_SRS.md"
Cohesion: 0.14
Nodes (13): 19. MVP Definition of Done, 1. Purpose, 20. Requirement Traceability Summary, 21. Final SRS Summary, 2.1 In Scope, 2.2 Out of Scope, 2. Scope, 3. System Overview (+5 more)

### Community 20 - "GreenCharge_AI_Development_Plan.md"
Cohesion: 0.15
Nodes (12): 1. Development Objective, 20. Phase 15 — Security Review, 23. Recommended Health Endpoint, 25. Dependencies, 26. Recommended Parallel Work, 28. Suggested Final Demo Dataset, 29. Practical Development Rules, 30. Final Build Order (+4 more)

### Community 21 - "24. Project Milestones"
Cohesion: 0.15
Nodes (13): 24. Project Milestones, M1 — Setup Complete, M2 — Optimization Complete, M3 — API Complete, M4 — Dashboards Complete, M5 — End-to-End Complete, M6 — Deployment Complete, Milestone Condition (+5 more)

### Community 22 - "42. UX Acceptance Criteria"
Cohesion: 0.18
Nodes (11): 42. UX Acceptance Criteria, UX-001, UX-002, UX-003, UX-004, UX-005, UX-006, UX-007 (+3 more)

### Community 23 - "11. Suggested Tables"
Cohesion: 0.20
Nodes (10): 11. Suggested Tables, chargers, charging_requests, charging_sessions, evs, grid_records, optimization_results, optimization_runs (+2 more)

### Community 24 - "Tasks"
Cohesion: 0.20
Nodes (10): 10. Phase 5 — Backend Services and APIs, Authentication, Business Services, Definition of Done, Driver, Goal, Grid, Network (+2 more)

### Community 25 - "14. Edge Cases"
Cohesion: 0.20
Nodes (10): 14. Edge Cases, EDGE-001 — No Flexible Time, EDGE-002 — Grid Fully Loaded, EDGE-003 — Insufficient Charger Capacity, EDGE-004 — No Renewable Generation, EDGE-005 — Renewable Generation Exceeds EV Demand, EDGE-006 — Multiple Optimal Solutions, EDGE-007 — Missing Forecast (+2 more)

### Community 26 - "9. Data Requirements"
Cohesion: 0.22
Nodes (9): 9.1 EV Entity, 9.2 Charging Request, 9.3 Charger, 9.4 Station, 9.5 Grid Record, 9. Data Requirements, Validation, Validation (+1 more)

### Community 27 - "28. Component Library"
Cohesion: 0.22
Nodes (9): 28.1 KPI Card, 28.2 Button, 28.3 Badge, 28.4 Chart Card, 28.5 AI Recommendation Card, 28. Component Library, Destructive, Primary (+1 more)

### Community 28 - "electricity_maps_sample.py"
Cohesion: 0.36
Nodes (7): get_forecast(), main(), print_forecast(), Simple Electricity Maps API v4 Forecast Fetcher Fetches: 1. Renewable energy…, Save all fetched forecast data to a JSON file., Fetch a forecast from Electricity Maps., save_to_json()

### Community 29 - "Build Order"
Cohesion: 0.25
Nodes (8): 14. Phase 9 — Grid Operator Dashboard, Alerts, Build Order, Definition of Done, KPI Row, Main Chart, Optimization Section, Renewable Section

### Community 30 - "Build Order"
Cohesion: 0.25
Nodes (8): 15. Phase 10 — Network Operator Dashboard, Build Order, Charger Status, Definition of Done, KPI Row, Optimization, Station Table, Utilization

### Community 31 - "22. Phase 17 — Deployment"
Cohesion: 0.25
Nodes (8): 22. Phase 17 — Deployment, Architecture, Backend, Backend Environment, Database, Deployment Checklist, Frontend, Frontend Environment

### Community 32 - "Tasks"
Cohesion: 0.25
Nodes (8): 5. Phase 0 — Project Setup, Backend Setup, Database, Definition of Done, Frontend Setup, Goal, Repository, Tasks

### Community 33 - "Dataset"
Cohesion: 0.25
Nodes (8): 7. Phase 2 — Seed and Mock Data, Dataset, Definition of Done, Goal, Scenario A — Normal, Scenario B — Peak, Scenario C — Renewable Window, Scenario D — Infeasible

### Community 34 - "13. Error Handling"
Cohesion: 0.25
Nodes (8): 13. Error Handling, ERR-001 — Standard Error Format, ERR-002 — Authentication Error, ERR-003 — Authorization Error, ERR-004 — Not Found, ERR-005 — Solver Infeasibility, ERR-006 — Solver Failure, ERR-007 — Frontend Error State

### Community 35 - "15. Security Requirements"
Cohesion: 0.25
Nodes (8): 15. Security Requirements, SEC-001 — HTTPS, SEC-002 — Input Validation, SEC-003 — Authorization, SEC-004 — Sensitive Data, SEC-005 — Error Disclosure, SEC-006 — API Protection, SEC-007 — Audit Logging

### Community 36 - "7.2 Grid Operator Dashboard"
Cohesion: 0.25
Nodes (8): 7.2 Grid Operator Dashboard, FR-GRID-001 — Current Load, FR-GRID-002 — Grid Capacity, FR-GRID-003 — Grid Stress, FR-GRID-004 — Renewable Supply, FR-GRID-005 — EV Charging Load, FR-GRID-006 — Load Forecast, FR-GRID-007 — Optimization Impact

### Community 37 - "36. Accessibility"
Cohesion: 0.25
Nodes (8): 36. Accessibility, A11Y-001 — Keyboard Navigation, A11Y-002 — Focus, A11Y-003 — Contrast, A11Y-004 — Status, A11Y-005 — Forms, A11Y-006 — Charts, A11Y-007 — Icons

### Community 38 - "Build Order"
Cohesion: 0.29
Nodes (7): 13. Phase 8 — Driver Dashboard, 1. Overview, 2. Recommendation, 3. Charging Form, 4. Impact, Build Order, Definition of Done

### Community 39 - "17. Phase 12 — Loading, Empty, Error, and Success States"
Cohesion: 0.29
Nodes (7): 17. Phase 12 — Loading, Empty, Error, and Success States, Definition of Done, Empty, Error, Infeasible, Loading, Success

### Community 40 - "27. MVP Definition of Done"
Cohesion: 0.29
Nodes (7): 27. MVP Definition of Done, Core System, Driver, Grid Operator, Network Operator, Optimization, Quality

### Community 41 - "10. Validation Requirements"
Cohesion: 0.29
Nodes (7): 10. Validation Requirements, VAL-001 — Required Fields, VAL-002 — Numeric Ranges, VAL-003 — Time Ordering, VAL-004 — Duplicate IDs, VAL-005 — Unknown References, VAL-006 — Data Consistency

### Community 42 - "11. Business Rules"
Cohesion: 0.29
Nodes (7): 11. Business Rules, BR-001 — Driver Flexibility, BR-002 — Grid Protection, BR-003 — Energy Requirement, BR-004 — Charger Availability, BR-005 — Optimization Preference, BR-006 — Baseline Comparison

### Community 43 - "4. User Roles and Permissions"
Cohesion: 0.29
Nodes (7): 4.1 EV Driver, 4.2 Grid Operator, 4.3 EV Network Operator, 4. User Roles and Permissions, Permissions, Permissions, Permissions

### Community 44 - "5. Authentication Requirements"
Cohesion: 0.29
Nodes (7): 5. Authentication Requirements, AUTH-001 — Login, AUTH-002 — Valid Login, AUTH-003 — Invalid Login, AUTH-004 — Session Expiry, AUTH-005 — Password Security, AUTH-006 — MVP Role Simulation

### Community 45 - "7.1 Driver Dashboard"
Cohesion: 0.29
Nodes (7): 7.1 Driver Dashboard, FR-DRV-001 — Dashboard Access, FR-DRV-002 — Green Score, FR-DRV-003 — Recommended Schedule, FR-DRV-004 — Savings, FR-DRV-005 — Renewable Usage, FR-DRV-006 — Charging Request

### Community 46 - "7.3 EV Network Operator Dashboard"
Cohesion: 0.29
Nodes (7): 7.3 EV Network Operator Dashboard, FR-NET-001 — Charger Status, FR-NET-002 — Active Sessions, FR-NET-003 — Charger Utilization, FR-NET-004 — Revenue, FR-NET-005 — Station Performance, FR-NET-006 — Load-Shifting Recommendation

### Community 47 - "24. Practical Architecture Decisions"
Cohesion: 0.33
Nodes (6): 24. Practical Architecture Decisions, Decision 1 — Modular Monolith, Decision 2 — MongoDB, Decision 3 — CP-SAT Inside Backend, Decision 4 — REST APIs, Decision 5 — Mock Data First

### Community 48 - "6. API Layer"
Cohesion: 0.33
Nodes (6): 6.1 Authentication, 6.2 Driver APIs, 6.3 Grid APIs, 6.4 Network APIs, 6.5 Optimization API, 6. API Layer

### Community 49 - "18. Phase 13 — Integration Testing"
Cohesion: 0.33
Nodes (6): 18. Phase 13 — Integration Testing, API Tests, Definition of Done, End-to-End Scenario, Frontend Tests, Optimization Tests

### Community 50 - "Must Build"
Cohesion: 0.33
Nodes (6): 2. MVP Scope, Backend, Database, Deployment, Frontend, Must Build

### Community 51 - "16. Performance Requirements"
Cohesion: 0.33
Nodes (6): 16. Performance Requirements, PERF-001 — Dashboard Response, PERF-002 — Optimization Response, PERF-003 — UI Responsiveness, PERF-004 — Dataset Size, PERF-005 — Solver Configuration

### Community 52 - "8.3 Constraints"
Cohesion: 0.33
Nodes (6): 8.3 Constraints, OPT-020 — Charging Window, OPT-021 — Required Energy, OPT-022 — Grid Capacity, OPT-023 — Charger Capacity, OPT-024 — Charging Power

### Community 53 - "Shared Sidebar"
Cohesion: 0.33
Nodes (6): 8. Global Navigation, Driver, Grid Operator, Network Operator, Shared Header, Shared Sidebar

### Community 54 - "13. Optimization Component"
Cohesion: 0.40
Nodes (5): 13. Optimization Component, Constraints, Inputs, Objectives, Processing

### Community 55 - "Recommended MVP"
Cohesion: 0.40
Nodes (5): 19. Deployment Architecture, Backend, Database, Frontend, Recommended MVP

### Community 56 - "11. Phase 6 — Authentication and Authorization"
Cohesion: 0.40
Nodes (5): 11. Phase 6 — Authentication and Authorization, Authorization, Definition of Done, Goal, MVP

### Community 57 - "12. Phase 7 — Frontend Design System"
Cohesion: 0.40
Nodes (5): 12. Phase 7 — Frontend Design System, Components, Definition of Done, Goal, Theme

### Community 58 - "16. Phase 11 — Frontend Integration"
Cohesion: 0.40
Nodes (5): 16. Phase 11 — Frontend Integration, Definition of Done, Goal, State, Tasks

### Community 59 - "21. Phase 16 — Performance Review"
Cohesion: 0.40
Nodes (5): 21. Phase 16 — Performance Review, Backend, Frontend, MVP Targets, Optimization

### Community 60 - "8. Phase 3 — Database Layer"
Cohesion: 0.40
Nodes (5): 8. Phase 3 — Database Layer, Definition of Done, Goal, Suggested Indexes, Tasks

### Community 61 - "12. API Requirements"
Cohesion: 0.40
Nodes (5): 12. API Requirements, Driver, Grid, Network, Optimization

### Community 62 - "17. Usability Requirements"
Cohesion: 0.40
Nodes (5): 17. Usability Requirements, UX-001 — Consistent Design, UX-002 — Driver Simplicity, UX-003 — Operator Clarity, UX-004 — Status Accessibility

### Community 63 - "13. Screen Inventory"
Cohesion: 0.40
Nodes (5): 13. Screen Inventory, Driver, Grid Operator, Network Operator, Shared

### Community 64 - "2. Design Principles"
Cohesion: 0.40
Nodes (5): 2.1 Simple First, 2.2 One Screen, One Clear Purpose, 2.3 Action Over Information, 2.4 Consistent Design, 2. Design Principles

### Community 65 - "39. GreenCharge AI Design System Summary"
Cohesion: 0.40
Nodes (5): 39. GreenCharge AI Design System Summary, Colors, Core Spacing, Radius, Typography

### Community 67 - "12. Data Flow"
Cohesion: 0.50
Nodes (4): 12.1 Driver Flow, 12.2 Grid Flow, 12.3 Network Flow, 12. Data Flow

### Community 68 - "18. Logging and Monitoring"
Cohesion: 0.50
Nodes (4): 18. Logging and Monitoring, Application Logs, Key Metrics, Production Direction

### Community 69 - "4. Three Dashboard Architecture"
Cohesion: 0.50
Nodes (4): 4.1 EV Driver, 4.2 Grid Operator, 4.3 EV Network Operator, 4. Three Dashboard Architecture

### Community 70 - "19. Phase 14 — Bug Fixing and Stabilization"
Cohesion: 0.50
Nodes (4): 19. Phase 14 — Bug Fixing and Stabilization, P0 — Blocking, P1 — Major, P2 — Minor

### Community 71 - "6. Phase 1 — Define Data Contracts"
Cohesion: 0.50
Nodes (4): 6. Phase 1 — Define Data Contracts, Definition of Done, Goal, Tasks

### Community 72 - "6. Authorization Requirements"
Cohesion: 0.50
Nodes (4): 6. Authorization Requirements, AUTHZ-001 — Role Enforcement, AUTHZ-002 — Resource Ownership, AUTHZ-003 — Operator Isolation

### Community 73 - "8.1 Input Requirements"
Cohesion: 0.50
Nodes (4): 8.1 Input Requirements, OPT-001 — EV Input, OPT-002 — Grid Input, OPT-003 — Charger Input

### Community 74 - "8.4 Optimization Objective"
Cohesion: 0.50
Nodes (4): 8.4 Optimization Objective, OPT-030, OPT-031 — Feasibility, OPT-032 — Result Generation

### Community 75 - "29. Interaction Guidelines"
Cohesion: 0.50
Nodes (4): 29. Interaction Guidelines, Button, Forms, Tables

### Community 76 - "31. Empty States"
Cohesion: 0.50
Nodes (4): 31. Empty States, No Alerts, No Charging Schedule, No Sessions

### Community 77 - "32. Error States"
Cohesion: 0.50
Nodes (4): 32. Error States, API Error, Infeasible Optimization, Optimization Error

### Community 78 - "34. Responsive Behavior"
Cohesion: 0.50
Nodes (4): 34. Responsive Behavior, Desktop, Mobile, Tablet

### Community 79 - "35. Mobile Dashboard Priority"
Cohesion: 0.50
Nodes (4): 35. Mobile Dashboard Priority, Driver, Grid Operator, Network Operator

### Community 80 - "3. Visual Theme"
Cohesion: 0.50
Nodes (4): 3.1 Primary Colors, 3.2 Functional Colors, 3. Visual Theme, Color Rule

### Community 81 - "41. MVP UI Priority"
Cohesion: 0.50
Nodes (4): 41. MVP UI Priority, Priority 1, Priority 2, Priority 3

### Community 82 - "9. Navigation Behavior"
Cohesion: 0.50
Nodes (4): 9. Navigation Behavior, Active Item, Hover, Mobile

### Community 83 - "GreenCharge AI - Project Structure"
Cohesion: 0.50
Nodes (3): Available Commands, GreenCharge AI - Project Structure, Quick Reference

### Community 84 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + Vite

### Community 86 - "15. Storage Strategy"
Cohesion: 0.67
Nodes (3): 15. Storage Strategy, Persistent Data, Temporary Data

### Community 87 - "1. Architecture Overview"
Cohesion: 0.67
Nodes (3): 1. Architecture Overview, Architecture Goal, GreenCharge AI — System Architecture Document

### Community 88 - "21. Performance Strategy"
Cohesion: 0.67
Nodes (3): 21. Performance Strategy, MVP, Target Demo Dataset

### Community 89 - "3. Frontend Architecture"
Cohesion: 0.67
Nodes (3): 3.1 Frontend Responsibilities, 3.2 Frontend Structure, 3. Frontend Architecture

### Community 90 - "5. Backend Architecture"
Cohesion: 0.67
Nodes (3): 5.1 Backend Responsibilities, 5.2 Backend Structure, 5. Backend Architecture

### Community 91 - "7. Authentication"
Cohesion: 0.67
Nodes (3): 7. Authentication, MVP, Production Direction

### Community 92 - "15. EV Driver Dashboard"
Cohesion: 0.67
Nodes (3): 15. EV Driver Dashboard, Layout, Priority

### Community 93 - "17. Driver Charging Form"
Cohesion: 0.67
Nodes (3): 17. Driver Charging Form, CTA, Validation

### Community 94 - "30. Loading States"
Cohesion: 0.67
Nodes (3): 30. Loading States, Optimization Loading, Page Loading

### Community 95 - "40. Implementation Guidelines"
Cohesion: 0.67
Nodes (3): 40. Implementation Guidelines, Component Approach, Recommended Frontend Stack

### Community 96 - "6. Shape and Elevation"
Cohesion: 0.67
Nodes (3): 6. Shape and Elevation, Border Radius, Shadows

## Knowledge Gaps
- **544 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `__filename` (+539 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 584 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ChargingStations.jsx`, `package.json`, `GridOperatorApp.jsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `mongoose` connect `db.js` to `package.json`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `18. Acceptance Criteria` connect `18. Acceptance Criteria` to `GreenCharge_AI_SRS.md`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _544 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `ev_charging_optimizer.py` be split into smaller, more focused modules?**
  _Cohesion score 0.054340396445659606 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._