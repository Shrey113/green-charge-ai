# GreenCharge AI — UI/UX Design Document

**Version:** 1.0  
**Stage:** Hackathon MVP  
**Design Direction:** Minimal, Modern, Green + White  
**Primary Users:** EV Driver, Grid Operator, EV Network Operator

---

# 1. Design Goal

GreenCharge AI should feel like a modern climate-tech product:

- Simple
- Clean
- Trustworthy
- Action-oriented
- Data-driven
- Easy to understand

The same visual language should be used across all dashboards.

The difference between dashboards should come mainly from **information density and user priorities**, not unrelated colors or layouts.

---

# 2. Design Principles

## 2.1 Simple First

Show the most important information first.

```text
Primary Action
      ↓
Key KPI
      ↓
Supporting Information
      ↓
Detailed Data
```

---

## 2.2 One Screen, One Clear Purpose

Each screen should answer a specific user question.

Examples:

- Driver: "When should I charge?"
- Grid Operator: "Is the grid under stress?"
- Network Operator: "How is the charging network performing?"

---

## 2.3 Action Over Information

Do not only display data.

Whenever possible, provide an action:

```text
Problem
  ↓
Insight
  ↓
Recommendation
  ↓
Action
```

Example:

```text
High evening demand
       ↓
Shift 86 sessions
       ↓
11 PM – 3 AM
       ↓
[ Apply Optimization ]
```

---

## 2.4 Consistent Design

Use the same:

- Colors
- Typography
- Cards
- Buttons
- Spacing
- Icons
- Navigation behavior

across all three dashboards.

---

# 3. Visual Theme

## 3.1 Primary Colors

| Purpose | Hex |
|---|---|
| Primary Green | `#16A34A` |
| Deep Green | `#15803D` |
| Soft Green | `#DCFCE7` |
| Light Green | `#F0FDF4` |
| Background | `#F9FAFB` |
| Surface | `#FFFFFF` |
| Border | `#E5E7EB` |
| Primary Text | `#111827` |
| Secondary Text | `#6B7280` |

## 3.2 Functional Colors

| State | Hex |
|---|---|
| Success | `#16A34A` |
| Warning | `#F59E0B` |
| Critical | `#EF4444` |
| Info | `#3B82F6` |

### Color Rule

Green represents:

- Optimization success
- Healthy systems
- Savings
- Renewable usage
- Positive actions

Warning and critical colors should be used only when attention is required.

Do not use color as the only indication of status.

---

# 4. Typography

Use a clean sans-serif font.

Recommended:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

## Type Scale

| Element | Size | Weight |
|---|---:|---|
| Page Title | 28px | 700 |
| Section Title | 20px | 600 |
| Card Title | 16px | 600 |
| KPI Number | 28–32px | 700 |
| Body | 14–16px | 400 |
| Caption | 12–13px | 400 |
| Button | 14px | 600 |

Line height:

```text
Body: 1.5
Headings: 1.2–1.3
```

---

# 5. Spacing System

Use a consistent 4px-based spacing scale.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
```

Recommended usage:

| Context | Spacing |
|---|---:|
| Icon to text | 8px |
| Form field gap | 16px |
| Card padding | 20–24px |
| Card gap | 16–24px |
| Section gap | 32px |
| Page margin | 24–32px |

---

# 6. Shape and Elevation

## Border Radius

```text
Buttons: 10px
Inputs: 10px
Cards: 16px
Badges: 999px
```

## Shadows

Use subtle shadows only.

```css
box-shadow: 0 1px 3px rgba(0,0,0,0.05);
```

Borders should provide most of the visual separation.

---

# 7. Overall Application Layout

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo            Page Title                    Help  User     │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Sidebar       │                Main Content                  │
│               │                                              │
│ Navigation    │                                              │
│               │                                              │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

Recommended dimensions:

```text
Sidebar: 240px
Header: 64–72px
Main content max width: 1440px
```

---

# 8. Global Navigation

## Shared Header

Contains:

- GreenCharge AI logo
- Current page title
- Notification icon
- User profile
- Optional role indicator

---

## Shared Sidebar

The sidebar should show only navigation relevant to the current role.

### Driver

```text
Overview
Charging
Schedule
Impact
Settings
```

### Grid Operator

```text
Overview
Grid Monitor
Renewables
Load Forecast
Optimization
Alerts
```

### Network Operator

```text
Overview
Stations
Chargers
Sessions
Analytics
Optimization
```

---

# 9. Navigation Behavior

## Active Item

Use:

```text
Background: #F0FDF4
Text: #15803D
```

with a clear visual indicator such as a left border or icon state.

## Hover

```text
Background: #F0FDF4
```

## Mobile

Replace the persistent sidebar with:

- Menu button
- Slide-out navigation
- Overlay

---

# 10. User Journey — EV Driver

```text
Login
  ↓
Driver Dashboard
  ↓
See Green Score + Savings
  ↓
View Smart Charging Recommendation
  ↓
Review Time / Cost / Green Benefit
  ↓
Schedule Charging
  ↓
Confirmation
  ↓
View Updated Schedule
```

## Primary User Goal

The driver should reach a charging recommendation within a few seconds of opening the dashboard.

---

# 11. User Journey — Grid Operator

```text
Login
  ↓
Grid Dashboard
  ↓
Review Grid Load
  ↓
Check Grid Stress
  ↓
Review Renewable Supply
  ↓
View Forecast
  ↓
Open Optimization Recommendation
  ↓
Review Expected Impact
```

Primary goal:

> Detect stress and understand the recommended corrective action quickly.

---

# 12. User Journey — Network Operator

```text
Login
  ↓
Network Dashboard
  ↓
Check Charger Status
  ↓
Review Utilization
  ↓
Review Sessions / Revenue
  ↓
Identify Peak Demand
  ↓
Review Load-Shifting Recommendation
```

Primary goal:

> Understand network health and identify operational improvements.

---

# 13. Screen Inventory

## Shared

1. Login
2. Dashboard
3. Profile/Settings

## Driver

4. Charging
5. Schedule
6. Impact

## Grid Operator

7. Grid Monitor
8. Renewable Supply
9. Load Forecast
10. Optimization
11. Alerts

## Network Operator

12. Stations
13. Chargers
14. Sessions
15. Analytics
16. Optimization

For MVP, the dashboard can contain most high-value information and secondary pages can remain simple.

---

# 14. Login Screen

## Layout

```text
┌──────────────────────────────┐
│                              │
│        GreenCharge AI        │
│                              │
│        Welcome back          │
│                              │
│   Email                      │
│   [____________________]     │
│                              │
│   Password                   │
│   [____________________]     │
│                              │
│   [       Sign In       ]    │
│                              │
└──────────────────────────────┘
```

For the hackathon prototype, a role selector may replace full authentication.

---

# 15. EV Driver Dashboard

## Layout

```text
Header

Welcome message

KPI row:
[Green Score] [Savings] [Renewable Usage]

Primary card:
[Smart Charging Recommendation]

Secondary row:
[Charging Cost Trend] [Environmental Impact]

Bottom:
[Recent Charging]
```

## Priority

```text
1. Recommendation
2. Savings
3. Green Score
4. Renewable Usage
5. History
```

---

# 16. Driver Recommendation Card

```text
┌─────────────────────────────────────────────┐
│ Smart Charging                             │
│                                             │
│ Best time to charge                         │
│ 11:00 PM – 3:00 AM                          │
│                                             │
│ Estimated savings: ₹45                      │
│ Renewable energy: 72%                       │
│                                             │
│ [ Schedule Charging ]                       │
└─────────────────────────────────────────────┘
```

## Interaction

Clicking `Schedule Charging`:

1. Shows confirmation state.
2. Saves the requested schedule.
3. Changes button to `Scheduled`.
4. Updates dashboard data.

---

# 17. Driver Charging Form

Fields:

```text
Arrival Time
Departure Time
Current Battery %
Target Battery %
Maximum Charging Power
```

## Validation

- Arrival is required.
- Departure is required.
- Departure must be after arrival.
- Battery values must be 0–100.
- Target SOC must be greater than or equal to current SOC.
- Power must be greater than 0.

## CTA

```text
[ Find Best Charging Time ]
```

---

# 18. Green Score Component

Use a simple progress or circular score.

Example:

```text
       92
   Excellent
```

Supporting text should explain why:

```text
High renewable usage
Low peak-period charging
```

Avoid making the score appear scientifically exact unless the calculation is clearly defined.

---

# 19. Grid Operator Dashboard

## Layout

```text
Header

Grid Status

KPI row:
[Grid Load] [Grid Capacity] [Renewable] [Stress]

Main:
[Grid Load Forecast]

Secondary:
[Renewable Mix] [EV Charging Load]

Bottom:
[AI Optimization Recommendation]
[Alerts]
```

---

# 20. Grid Status Card

```text
GRID STATUS

LOW STRESS

72% Load

Capacity: 100%
```

The card should display both text and visual status.

---

# 21. Grid Forecast Chart

Recommended:

```text
Line / Area Chart
```

Display:

- Current load
- Predicted load
- Grid capacity

Use a clearly different visual treatment for capacity so users can see when demand approaches the limit.

---

# 22. Grid Renewable Card

Display:

```text
Renewable Generation

Solar      420 MW
Wind       180 MW
Total      600 MW
```

A small donut chart may be used if it improves understanding.

---

# 23. Grid Optimization Card

```text
AI Optimization

Peak load can be reduced by 18%

Shift 124 EV sessions
06 PM – 09 PM
→
11 PM – 03 AM

[ View Recommendation ]
```

For an operator action, the recommendation must explain the expected impact before any action is taken.

---

# 24. Network Operator Dashboard

## Layout

```text
Header

KPI row:
[Stations] [Active Chargers] [Sessions] [Revenue]

Main:
[Utilization Trend]

Secondary:
[Charger Status] [Top Stations]

Bottom:
[AI Load Shift]
```

---

# 25. Charger Status Component

```text
Online        142
Maintenance     4
Offline         2
```

Use status badges with text.

---

# 26. Utilization Component

Show:

```text
68%

████████████████░░░░
```

Supporting information:

```text
Peak: 76%
Time: 6 PM – 9 PM
```

---

# 27. Station Table

Columns:

```text
Station
Status
Chargers
Utilization
Sessions
Revenue
```

Actions:

```text
View Details
```

Keep the table simple for MVP.

---

# 28. Component Library

## 28.1 KPI Card

Contains:

```text
Label
Primary Value
Trend / Status
Optional supporting text
```

Example:

```text
Monthly Savings

₹1,245

+18% vs last month
```

---

## 28.2 Button

Types:

### Primary
Main action.

```text
Green background
White text
```

### Secondary
Supporting action.

```text
White background
Green text
Green border
```

### Destructive
Only for irreversible actions.

```text
Red text/background as appropriate
```

---

## 28.3 Badge

Use for status:

```text
Online
Offline
Maintenance
Normal
High
Critical
```

Badges should include text, not only colored dots.

---

## 28.4 Chart Card

Every chart should have:

```text
Title
Short explanation
Chart
Legend
Optional metric summary
```

Do not place several unrelated charts inside one card.

---

## 28.5 AI Recommendation Card

Structure:

```text
Title
Recommendation
Reason
Expected impact
Primary CTA
```

---

# 29. Interaction Guidelines

## Button

On click:

```text
Default
 ↓
Loading
 ↓
Success / Error
```

Disable the button during requests to prevent duplicate submissions.

---

## Forms

Use:

- Inline validation
- Clear labels
- Helpful placeholders only when necessary
- Required markers where applicable
- Error text below the field

Avoid large forms.

---

## Tables

- Sort only where useful.
- Use pagination only when data requires it.
- Keep primary information left-aligned.
- Numbers should be right-aligned.

---

# 30. Loading States

## Page Loading

Use skeletons for:

- KPI cards
- Charts
- Tables

Example:

```text
[██████████]
[████████████████]
```

Avoid displaying a blank screen.

---

## Optimization Loading

Show a specific state:

```text
Optimizing charging schedule...

Checking:
Grid capacity
Charging windows
Renewable availability
Electricity cost
```

Do not use a generic infinite spinner.

---

# 31. Empty States

Examples:

### No Charging Schedule

```text
No schedule yet

Add your charging requirements
to get an optimized time.

[ Add Charging Request ]
```

### No Alerts

```text
No active alerts

Everything is operating normally.
```

### No Sessions

```text
No active charging sessions
```

Empty states should explain what happened and what the user can do next when action exists.

---

# 32. Error States

## API Error

```text
Something went wrong

We could not load this data.

[ Try Again ]
```

## Optimization Error

```text
Optimization could not be completed

Check the charging requirements
and available capacity.

[ Review Inputs ]
```

## Infeasible Optimization

```text
No feasible schedule found

The current requirements cannot be
satisfied within the available
time and capacity.

[ Review Constraints ]
```

Never show an invalid schedule as successful.

---

# 33. Success States

After optimization:

```text
Optimization Complete

Peak Load       ↓ 18%
Cost            ↓ ₹1,800
Renewable Use   ↑ 24%

[ View Schedule ]
```

Keep success feedback concise.

---

# 34. Responsive Behavior

## Desktop

Minimum recommended width:

```text
1280px
```

Use:

- Persistent sidebar
- Multi-column KPI cards
- Large charts

---

## Tablet

At approximately:

```text
768–1279px
```

Use:

- Collapsible sidebar
- 2-column card layout
- Reduced chart heights

---

## Mobile

Below approximately:

```text
768px
```

Use:

```text
Header
 ↓
Menu
 ↓
Single-column content
```

KPI cards should stack or use a horizontal scroll where appropriate.

Charts should remain readable; avoid forcing dense tables into tiny screens.

---

# 35. Mobile Dashboard Priority

## Driver

```text
Recommendation
↓
Savings
↓
Green Score
↓
Schedule
```

## Grid Operator

```text
Grid Stress
↓
Current Load
↓
Alerts
↓
Optimization
```

## Network Operator

```text
Charger Status
↓
Utilization
↓
Sessions
↓
Optimization
```

---

# 36. Accessibility

## A11Y-001 — Keyboard Navigation

All interactive controls must be keyboard accessible.

---

## A11Y-002 — Focus

Focused elements must have a visible focus state.

---

## A11Y-003 — Contrast

Text and important UI controls must have sufficient contrast against their backgrounds.

---

## A11Y-004 — Status

Do not communicate status through color alone.

Example:

```text
Green + "Normal"
Yellow + "High Load"
Red + "Critical"
```

---

## A11Y-005 — Forms

Every input must have an associated visible label.

---

## A11Y-006 — Charts

Charts should provide:

- Clear titles
- Legends
- Text summaries for important values

Critical information should not exist only inside a graph.

---

## A11Y-007 — Icons

Icons used as actions should have accessible labels.

---

# 37. UX Writing

Use short, clear wording.

Prefer:

```text
Schedule Charging
```

instead of:

```text
Initiate Optimized Charging Scheduling Process
```

Prefer:

```text
Peak load reduced by 18%
```

instead of:

```text
A significant reduction has been achieved
```

---

# 38. Data Visualization Rules

Use chart types based on the question.

| Data | Recommended Chart |
|---|---|
| Load over time | Line/Area |
| Renewable mix | Donut |
| Charger utilization | Bar/Line |
| Station comparison | Bar |
| Cost comparison | Bar |
| Baseline vs optimized | Grouped Bar |

Avoid decorative charts that do not communicate a decision.

---

# 39. GreenCharge AI Design System Summary

## Colors

```text
Primary Green  #16A34A
Deep Green     #15803D
Soft Green     #DCFCE7
Light Green    #F0FDF4

Background     #F9FAFB
White          #FFFFFF
Border         #E5E7EB

Text           #111827
Secondary      #6B7280

Warning        #F59E0B
Critical       #EF4444
Info           #3B82F6
```

## Typography

```text
Inter / system-ui
```

## Radius

```text
Cards: 16px
Buttons: 10px
Inputs: 10px
Badges: 999px
```

## Core Spacing

```text
8 / 12 / 16 / 20 / 24 / 32 / 40 / 48px
```

---

# 40. Implementation Guidelines

## Recommended Frontend Stack

```text
React
Vite
Tailwind CSS
Recharts
Lucide React
```

## Component Approach

Build reusable components first:

```text
Button
Card
KPI Card
Badge
Input
Select
Modal
Chart Card
Table
Alert
Skeleton
Empty State
```

Then compose dashboard-specific screens from them.

---

# 41. MVP UI Priority

## Priority 1

```text
App Shell
Navigation
KPI Cards
Recommendation Card
Charts
Status Badges
```

## Priority 2

```text
Charging Form
Tables
Alerts
Loading / Error States
```

## Priority 3

```text
Animations
Advanced filters
Secondary pages
```

Do not delay the core product for visual effects.

---

# 42. UX Acceptance Criteria

## UX-001

A driver can identify the recommended charging period without opening another page.

## UX-002

A driver can understand estimated savings without technical energy knowledge.

## UX-003

A grid operator can identify grid stress from the overview screen.

## UX-004

A grid operator can find the optimization recommendation from the overview screen.

## UX-005

A network operator can identify offline/maintenance chargers immediately.

## UX-006

All primary actions have visible loading and success/error states.

## UX-007

All forms show validation errors next to the relevant field.

## UX-008

No critical status depends only on color.

## UX-009

The three dashboards use the same visual design system.

## UX-010

The desktop UI remains usable at approximately 1280px width and the mobile layout remains readable below 768px.

---

# 43. Final UX Principle

GreenCharge AI should communicate:

```text
EV Driver
"What should I do?"

Grid Operator
"What is happening, and what needs action?"

Network Operator
"How is my network performing, and how can I improve it?"
```

The final interface should feel **clean, calm, and intelligent**, with GreenCharge AI's green identity used to emphasize sustainability and positive outcomes rather than covering the entire interface in green.
