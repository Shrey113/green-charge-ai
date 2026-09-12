# Graph Report - .  (2026-09-12)

## Corpus Check
- Corpus is ~8,426 words - fits in a single context window. You may not need a graph.

## Summary
- 75 nodes · 65 edges · 15 communities (8 shown, 7 thin omitted)
- Extraction: 74% EXTRACTED · 26% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.88)
- Token cost: 8,426 input · 1,200 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Express Backend & API|Express Backend & API]]
- [[_COMMUNITY_React Frontend & Driver UI|React Frontend & Driver UI]]
- [[_COMMUNITY_Vite & Linting Configuration|Vite & Linting Configuration]]
- [[_COMMUNITY_Root Project DevDependencies|Root Project DevDependencies]]
- [[_COMMUNITY_Application Dependencies|Application Dependencies]]
- [[_COMMUNITY_NPM Build & Dev Scripts|NPM Build & Dev Scripts]]
- [[_COMMUNITY_CP-SAT Optimization Engine|CP-SAT Optimization Engine]]
- [[_COMMUNITY_Project Specifications & PRD|Project Specifications & PRD]]
- [[_COMMUNITY_EV Network Operator System|EV Network Operator System]]
- [[_COMMUNITY_Grid Operator System|Grid Operator System]]
- [[_COMMUNITY_Graphify Configuration & Workflow|Graphify Configuration & Workflow]]
- [[_COMMUNITY_Charging Optimization Requirements|Charging Optimization Requirements]]
- [[_COMMUNITY_Security & Role-Based Access|Security & Role-Based Access]]
- [[_COMMUNITY_System Architecture Documentation|System Architecture Documentation]]
- [[_COMMUNITY_UI Icons & Static Assets|UI Icons & Static Assets]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 6 edges
2. `rules` - 3 edges
3. `scripts` - 3 edges
4. `Google OR-Tools CP-SAT Optimizer` - 3 edges
5. `EV Driver Dashboard` - 3 edges
6. `React Vite Frontend Architecture` - 3 edges
7. `App()` - 2 edges
8. `GreenCharge AI PRD` - 2 edges
9. `Express Backend Architecture` - 2 edges
10. `React Vite Oxlint Template Documentation` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Web Application HTML Root` --references--> `GreenCharge Favicon`  [EXTRACTED]
  index.html → public/favicon.svg
- `GreenCharge AI PRD` --cites--> `GreenCharge AI Project Overview`  [INFERRED]
  Documentation/GreenCharge_AI_PRD.md → Documentation/GreenCharge_AI_Project_Overview.md
- `Load Shifting & Peak Reduction` --conceptually_related_to--> `Google OR-Tools CP-SAT Optimizer`  [INFERRED]
  Documentation/GreenCharge_AI_PRD.md → Documentation/GreenCharge_AI_Project_Overview.md
- `Renewable Energy Matching` --conceptually_related_to--> `Google OR-Tools CP-SAT Optimizer`  [INFERRED]
  Documentation/GreenCharge_AI_PRD.md → Documentation/GreenCharge_AI_Project_Overview.md
- `Optimization Service Architecture` --conceptually_related_to--> `Google OR-Tools CP-SAT Optimizer`  [INFERRED]
  Documentation/GreenCharge_AI_SRS.md → Documentation/GreenCharge_AI_Project_Overview.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Role-based Dashboards Suite** — documentation_greencharge_ai_project_overview_ev_driver_dashboard, documentation_greencharge_ai_project_overview_grid_operator_dashboard, documentation_greencharge_ai_project_overview_ev_network_operator_dashboard [INFERRED 0.95]
- **GreenCharge Core Backend Services** — documentation_greencharge_ai_srs_driver_service, documentation_greencharge_ai_srs_grid_service, documentation_greencharge_ai_srs_network_service, documentation_greencharge_ai_srs_optimization_service [INFERRED 0.95]
- **CP-SAT Charging Optimization Pipeline** — documentation_greencharge_ai_project_overview_google_or_tools_cp_sat, documentation_greencharge_ai_prd_charging_optimization, documentation_greencharge_ai_prd_load_shifting, documentation_greencharge_ai_prd_renewable_matching [INFERRED 0.95]

## Communities (15 total, 7 thin omitted)

### Community 0 - "Express Backend & API"
Cohesion: 0.12
Nodes (14): GreenCharge REST API, Express Backend Architecture, app, dependencies, cors, dotenv, express, main (+6 more)

### Community 1 - "React Frontend & Driver UI"
Cohesion: 0.20
Nodes (10): Landing Hero Illustration, React Logo Vector, EV Driver Green Score Metric, EV Driver Dashboard, Minimal Green-White UI Theme, Driver Service, Web Application HTML Root, React Vite Frontend Architecture (+2 more)

### Community 2 - "Vite & Linting Configuration"
Cohesion: 0.22
Nodes (7): Vite Logo Vector, plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, React Vite Oxlint Template Documentation

### Community 3 - "Root Project DevDependencies"
Cohesion: 0.22
Nodes (8): devDependencies, concurrently, vite, @vitejs/plugin-react, name, private, type, version

### Community 4 - "Application Dependencies"
Cohesion: 0.33
Nodes (6): dependencies, cors, dotenv, express, react, react-dom

### Community 5 - "NPM Build & Dev Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, client, dev, preview, server

### Community 6 - "CP-SAT Optimization Engine"
Cohesion: 0.50
Nodes (4): Load Shifting & Peak Reduction, Renewable Energy Matching, Google OR-Tools CP-SAT Optimizer, Optimization Service Architecture

### Community 7 - "Project Specifications & PRD"
Cohesion: 0.67
Nodes (3): GreenCharge AI PRD, GreenCharge AI Project Overview, GreenCharge AI SRS

## Knowledge Gaps
- **54 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React Vite Frontend Architecture` connect `React Frontend & Driver UI` to `Vite & Linting Configuration`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Build & Dev Scripts` to `Root Project DevDependencies`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Application Dependencies` to `Root Project DevDependencies`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Express Backend & API` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._