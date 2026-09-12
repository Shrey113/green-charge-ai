#!/usr/bin/env python3
"""
GreenCharge AI — Production-Grade CP-SAT EV Charging Optimizer
=============================================================
Version: 5.0 (Production / Competition Grade)

Key Capabilities:
1. Multi-Objective GreenCharge Optimization:
   - Maximizes net energy delivered to EV batteries
   - Directly rewards actual renewable energy consumed (kWh)
   - Minimizes station load during high grid-stress periods
   - Mitigates deadline / departure risk
   - Respects driver preferences (renewable priority, immediate start)
2. Realistic Battery Charging Physics & Efficiency:
   - Models AC/DC charging conversion efficiency (eta = 0.90 default)
   - Pre-validates SOC boundaries (0 <= current_soc <= target_soc <= 100)
   - Validates physical achievability (duration * min(P_ev, P_charger) * eta)
3. Hardware & Connector Compatibility:
   - Validates EV connector against charger socket (CCS2, Type2, CHAdeMO)
4. Sequential Charger Turnover (Bay Reservation):
   - Prevents mid-session charger hopping (an EV stays on one physical charger)
   - Allows sequential turnover: non-overlapping vehicles safely reuse the same charger
5. Native CP-SAT Formulation:
   - Replaces Big-M linearizations with native .OnlyEnforceIf() half-reified constraints
   - Pure integer scaling (POWER_SCALE = 10 -> 0.1 kW / 0.01 kWh precision)
6. Unmanaged Baseline Benchmark & Impact Metrics:
   - Computes an uncontrolled immediate-charging baseline
   - Reports peak shaving %, renewable utilization %, and grid stress reduction
7. Schedule Explainability & Infeasibility Diagnostics:
   - Annotates each charging slot with human-readable rationale
   - Diagnostic reporting for physical bottlenecks or capacity shortfalls
8. Production Architecture & Dual Interface:
   - Fully importable Python API (dataclasses + EVChargingOptimizer class)
   - CLI interface with JSON export matching GreenCharge AI backend schemas
"""

from __future__ import annotations

import argparse
import json
import logging
import math
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

from ortools.sat.python import cp_model

# ---------------------------------------------------------------------------
# Logging Setup
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("GreenChargeOptimizer")


# ---------------------------------------------------------------------------
# Data Models
# ---------------------------------------------------------------------------
@dataclass
class Charger:
    charger_id: str
    max_power_kw: float
    connector_type: str = "Type2"
    status: str = "available"

    @property
    def is_available(self) -> bool:
        return self.status.lower() == "available"


@dataclass
class Station:
    station_id: str
    name: str
    total_power_capacity_kw: float
    chargers: List[Charger]
    location: Optional[Dict[str, Any]] = None

    @property
    def available_chargers(self) -> List[Charger]:
        return [c for c in self.chargers if c.is_available]


@dataclass
class EVPreferences:
    prefer_renewable: bool = True
    prefer_low_cost: bool = True
    allow_delayed_start: bool = True


@dataclass
class EVRequest:
    ev_id: str
    arrival_time: datetime
    deadline: datetime
    battery_capacity_kwh: float
    current_soc_percent: float
    target_soc_percent: float
    energy_needed_kwh: float
    max_charging_power_kw: float
    priority: str = "normal"
    preferences: EVPreferences = field(default_factory=EVPreferences)
    connector_type: Optional[str] = None
    car_model: Optional[str] = None

    @property
    def duration_hours(self) -> float:
        return max(0.0, (self.deadline - self.arrival_time).total_seconds() / 3600.0)


@dataclass
class SlotForecast:
    timestamp: str
    dt: datetime
    renewable_percent: float
    grid_load_mw: float


@dataclass
class OptimizationConfig:
    power_scale: int = 10              # 0.1 kW precision
    energy_scale: int = 100            # 0.01 kWh precision
    charging_efficiency: float = 0.90  # 90% AC/DC charging efficiency (eta)
    slot_hours: float = 1.0            # Hourly time step
    max_solve_time_sec: float = 10.0   # Solver timeout
    num_search_workers: int = 8        # Parallel search threads

    # Multi-Objective Weights:
    # 1. Energy Delivered (highest priority): 10,000 pts per kWh
    weight_energy: int = 100_000
    # 2. Renewable kWh consumed: 50 pts per renewable kWh
    weight_renewable_kwh: int = 500
    # 3. Grid Stress penalty: 200 pts penalty for charging during peak grid load
    weight_grid_stress: int = 200
    # 4. Driver Priority bonus: High (+500), Normal (+250), Low (0)
    priority_high_bonus: int = 500
    priority_normal_bonus: int = 250
    # 5. Urgent Start preference (if allow_delayed_start is False)
    urgent_start_bonus: int = 300


@dataclass
class ChargingSlotAllocation:
    timestamp: str
    power_kw: float
    battery_energy_kwh: float
    grid_energy_kwh: float
    renewable_percent: float
    grid_load_mw: float
    renewable_kwh: float
    explanation: str


@dataclass
class EVScheduleResult:
    ev_id: str
    car_model: str
    priority: str
    assigned_charger_id: Optional[str]
    requested_energy_kwh: float
    delivered_battery_energy_kwh: float
    grid_energy_consumed_kwh: float
    unmet_energy_kwh: float
    initial_soc_percent: float
    final_soc_percent: float
    status: str
    slots: List[ChargingSlotAllocation]
    diagnostics: List[str] = field(default_factory=list)


@dataclass
class BaselineMetric:
    peak_station_power_kw: float
    total_grid_energy_kwh: float
    total_battery_energy_kwh: float
    renewable_energy_kwh: float
    renewable_utilization_percent: float
    avg_grid_load_mw: float


@dataclass
class OptimizationResult:
    status: str
    is_feasible: bool
    objective_value: float
    solve_time_seconds: float
    num_branches: int
    num_conflicts: int
    schedules: Dict[str, EVScheduleResult]
    baseline: BaselineMetric
    optimized: BaselineMetric
    peak_reduction_percent: float
    renewable_gain_percent: float
    grid_stress_reduction_percent: float
    station_id: str
    station_name: str
    diagnostics: List[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Utility & Parsing Functions
# ---------------------------------------------------------------------------
def parse_iso_time(ts: str) -> datetime:
    """Parse ISO8601 timestamp to UTC datetime."""
    return datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(timezone.utc)


def normalize_series(values: List[float], reverse: bool = False) -> List[float]:
    """Normalize numeric values to [0, 100]."""
    if not values:
        return []
    lo, hi = min(values), max(values)
    if math.isclose(hi, lo):
        return [100.0] * len(values)
    if reverse:
        return [(hi - v) / (hi - lo) * 100.0 for v in values]
    return [(v - lo) / (hi - lo) * 100.0 for v in values]


def check_connector_compatibility(ev_connector: Optional[str], charger_connector: str) -> bool:
    """
    Check if an EV's inlet is compatible with a charger connector.
    If EV connector is not specified, assume compatible with standard station hardware.
    """
    if not ev_connector:
        return True
    ev_c = ev_connector.strip().upper()
    ch_c = charger_connector.strip().upper()
    if ev_c == ch_c:
        return True
    # AC Type2 compatibility rules
    if ev_c == "TYPE2" and ch_c in ("TYPE2", "MENNEKES"):
        return True
    # CCS2 supports Type 2 AC inlets if AC tethered
    if ev_c == "TYPE2" and ch_c == "CCS2":
        return True
    return False


# ---------------------------------------------------------------------------
# Validation & Infeasibility Diagnostics
# ---------------------------------------------------------------------------
def validate_and_diagnose_inputs(
    station: Station,
    evs: List[EVRequest],
    forecast: Dict[str, SlotForecast],
    config: OptimizationConfig,
) -> Tuple[List[EVRequest], List[str]]:
    """
    Performs pre-optimization physics and SOC validation.
    Issues actionable diagnostics for unachievable demands rather than crashing.
    """
    diagnostics: List[str] = []
    valid_evs: List[EVRequest] = []
    available_chargers = station.available_chargers

    if not available_chargers:
        diagnostics.append("CRITICAL: No chargers are currently marked as available at this station.")
        return [], diagnostics

    max_station_charger_power = max(c.max_power_kw for c in available_chargers)
    forecast_times = sorted(forecast.keys(), key=parse_iso_time)
    horizon_start = parse_iso_time(forecast_times[0])
    horizon_end = parse_iso_time(forecast_times[-1])

    for ev in evs:
        ev_notes: List[str] = []

        # 1. SOC bounds validation
        if not (0.0 <= ev.current_soc_percent <= 100.0):
            ev_notes.append(f"Invalid current SOC ({ev.current_soc_percent}%). Clamped to [0, 100].")
            ev.current_soc_percent = max(0.0, min(100.0, ev.current_soc_percent))

        if not (0.0 <= ev.target_soc_percent <= 100.0):
            ev_notes.append(f"Invalid target SOC ({ev.target_soc_percent}%). Clamped to [0, 100].")
            ev.target_soc_percent = max(0.0, min(100.0, ev.target_soc_percent))

        if ev.target_soc_percent < ev.current_soc_percent:
            ev_notes.append(
                f"Target SOC ({ev.target_soc_percent}%) < Current SOC ({ev.current_soc_percent}%). Set target = current."
            )
            ev.target_soc_percent = ev.current_soc_percent

        # 2. Reconcile requested energy with battery SOC delta
        calculated_needed = ev.battery_capacity_kwh * ((ev.target_soc_percent - ev.current_soc_percent) / 100.0)
        if abs(ev.energy_needed_kwh - calculated_needed) > 1.0:
            ev_notes.append(
                f"Requested energy ({ev.energy_needed_kwh:.1f} kWh) differed from SOC delta ({calculated_needed:.1f} kWh). "
                f"Using SOC delta: {calculated_needed:.1f} kWh."
            )
            ev.energy_needed_kwh = calculated_needed

        # 3. Horizon & window bounds
        if ev.deadline <= ev.arrival_time:
            diagnostics.append(f"SKIPPED {ev.ev_id}: Deadline ({ev.deadline}) is at or before arrival ({ev.arrival_time}).")
            continue

        if ev.deadline < horizon_start or ev.arrival_time > horizon_end:
            diagnostics.append(f"SKIPPED {ev.ev_id}: Parking window is completely outside the forecast horizon.")
            continue

        # 4. Connector compatibility check
        compatible_chargers = [
            c for c in available_chargers if check_connector_compatibility(ev.connector_type, c.connector_type)
        ]
        if not compatible_chargers:
            diagnostics.append(
                f"SKIPPED {ev.ev_id}: No available chargers match connector '{ev.connector_type}'."
            )
            continue

        # 5. Physical rate limits (Bottleneck diagnosis)
        max_possible_power = min(ev.max_charging_power_kw, max(c.max_power_kw for c in compatible_chargers))
        max_deliverable_battery = ev.duration_hours * max_possible_power * config.charging_efficiency

        if ev.energy_needed_kwh > max_deliverable_battery + 1e-3:
            shortfall = ev.energy_needed_kwh - max_deliverable_battery
            ev_notes.append(
                f"Physical Bottleneck: Needs {ev.energy_needed_kwh:.1f} kWh, but maximum deliverable within "
                f"{ev.duration_hours:.1f}h at {max_possible_power:.1f} kW (eta={config.charging_efficiency:.0%}) "
                f"is {max_deliverable_battery:.1f} kWh. Max achievable shortfall: {shortfall:.1f} kWh."
            )

        if ev_notes:
            for note in ev_notes:
                diagnostics.append(f"{ev.ev_id}: {note}")

        valid_evs.append(ev)

    return valid_evs, diagnostics


# ---------------------------------------------------------------------------
# Unmanaged Baseline Benchmark Calculator
# ---------------------------------------------------------------------------
def compute_unmanaged_baseline(
    station: Station,
    evs: List[EVRequest],
    forecast: Dict[str, SlotForecast],
    config: OptimizationConfig,
) -> Tuple[BaselineMetric, Dict[str, List[Dict[str, float]]]]:
    """
    Simulates uncontrolled 'Immediate Charging':
    Each EV plugs in upon arrival and immediately charges at maximum allowable power
    until its target energy is met or departure arrives.
    """
    times = sorted(forecast.keys(), key=parse_iso_time)
    station_capacity = station.total_power_capacity_kw
    available_chargers = sorted(station.available_chargers, key=lambda c: c.max_power_kw, reverse=True)

    ev_energy_remaining = {ev.ev_id: ev.energy_needed_kwh for ev in evs}
    slot_power_by_ev: Dict[str, List[Dict[str, float]]] = {ev.ev_id: [] for ev in evs}
    slot_station_power: Dict[str, float] = {t: 0.0 for t in times}
    total_renewable_kwh = 0.0
    total_grid_kwh = 0.0
    total_battery_kwh = 0.0
    weighted_grid_load_sum = 0.0

    # Assign chargers greedily by priority and arrival
    sorted_evs = sorted(evs, key=lambda x: (0 if x.priority == "high" else 1, x.arrival_time))
    ev_charger_map: Dict[str, Charger] = {}
    used_chargers: Set[str] = set()

    for ev in sorted_evs:
        for charger in available_chargers:
            if charger.charger_id not in used_chargers and check_connector_compatibility(ev.connector_type, charger.connector_type):
                ev_charger_map[ev.ev_id] = charger
                used_chargers.add(charger.charger_id)
                break
        if ev.ev_id not in ev_charger_map and available_chargers:
            ev_charger_map[ev.ev_id] = available_chargers[0]

    for t_str in times:
        t_dt = parse_iso_time(t_str)
        t_end = datetime.fromtimestamp(t_dt.timestamp() + config.slot_hours * 3600, tz=timezone.utc)
        renew_pct = forecast[t_str].renewable_percent
        grid_load = forecast[t_str].grid_load_mw

        current_station_load = 0.0

        for ev in sorted_evs:
            rem_energy = ev_energy_remaining[ev.ev_id]
            if rem_energy <= 1e-4:
                continue

            # Active in slot?
            if not (ev.arrival_time <= t_dt < ev.deadline):
                continue

            charger = ev_charger_map.get(ev.ev_id, available_chargers[0])
            max_p = min(ev.max_charging_power_kw, charger.max_power_kw)
            available_station_p = max(0.0, station_capacity - current_station_load)
            draw_p = min(max_p, available_station_p)

            # Max battery energy needed in this slot
            max_batt_energy_slot = draw_p * config.slot_hours * config.charging_efficiency
            delivered_batt = min(rem_energy, max_batt_energy_slot)
            actual_grid_p = delivered_batt / (config.slot_hours * config.charging_efficiency) if delivered_batt > 0 else 0.0

            ev_energy_remaining[ev.ev_id] -= delivered_batt
            current_station_load += actual_grid_p

            grid_energy_slot = actual_grid_p * config.slot_hours
            total_grid_kwh += grid_energy_slot
            total_battery_kwh += delivered_batt
            renew_kwh_slot = grid_energy_slot * (renew_pct / 100.0)
            total_renewable_kwh += renew_kwh_slot
            weighted_grid_load_sum += grid_energy_slot * grid_load

            slot_power_by_ev[ev.ev_id].append({
                "timestamp": t_str,
                "power_kw": actual_grid_p,
                "battery_kwh": delivered_batt,
            })

        slot_station_power[t_str] = current_station_load

    peak_p = max(slot_station_power.values()) if slot_station_power else 0.0
    renew_util_pct = (total_renewable_kwh / total_grid_kwh * 100.0) if total_grid_kwh > 0 else 0.0
    avg_grid_load = (weighted_grid_load_sum / total_grid_kwh) if total_grid_kwh > 0 else 0.0

    metric = BaselineMetric(
        peak_station_power_kw=round(peak_p, 2),
        total_grid_energy_kwh=round(total_grid_kwh, 2),
        total_battery_energy_kwh=round(total_battery_kwh, 2),
        renewable_energy_kwh=round(total_renewable_kwh, 2),
        renewable_utilization_percent=round(renew_util_pct, 1),
        avg_grid_load_mw=round(avg_grid_load, 2),
    )
    return metric, slot_power_by_ev


# ---------------------------------------------------------------------------
# CP-SAT Optimization Engine
# ---------------------------------------------------------------------------
class EVChargingOptimizer:
    """
    Mathematical Optimization Engine using Google OR-Tools CP-SAT.
    Enforces sequential charger turnover, native conditional power constraints,
    charging efficiency, and a multi-objective green charging goal.
    """

    def __init__(
        self,
        station: Station,
        ev_requests: List[EVRequest],
        forecast: Dict[str, SlotForecast],
        config: Optional[OptimizationConfig] = None,
    ):
        self.station = station
        self.raw_evs = ev_requests
        self.forecast = forecast
        self.config = config or OptimizationConfig()
        self.times = sorted(self.forecast.keys(), key=parse_iso_time)
        self.available_chargers = self.station.available_chargers

    def _eligible_slots(self, ev: EVRequest) -> List[str]:
        arr, ddl = ev.arrival_time, ev.deadline
        return [t for t in self.times if arr <= parse_iso_time(t) < ddl]

    def solve(self) -> OptimizationResult:
        # 1. Validation & Input Diagnosis
        valid_evs, diagnostics = validate_and_diagnose_inputs(
            self.station, self.raw_evs, self.forecast, self.config
        )

        if not valid_evs or not self.available_chargers:
            logger.error("Optimization aborted: No valid EVs or chargers.")
            baseline_stub = BaselineMetric(0, 0, 0, 0, 0, 0)
            return OptimizationResult(
                status="INFEASIBLE",
                is_feasible=False,
                objective_value=0.0,
                solve_time_seconds=0.0,
                num_branches=0,
                num_conflicts=0,
                schedules={},
                baseline=baseline_stub,
                optimized=baseline_stub,
                peak_reduction_percent=0.0,
                renewable_gain_percent=0.0,
                grid_stress_reduction_percent=0.0,
                station_id=self.station.station_id,
                station_name=self.station.name,
                diagnostics=diagnostics,
            )

        # 2. Compute Unmanaged Baseline Benchmark
        baseline_metric, _ = compute_unmanaged_baseline(
            self.station, valid_evs, self.forecast, self.config
        )

        # 3. Precompute Vectorized Scores
        loads = [self.forecast[t].grid_load_mw for t in self.times]
        normalized_loads = normalize_series(loads, reverse=False)  # 100 = highest grid stress
        load_score_map = {t: normalized_loads[i] for i, t in enumerate(self.times)}

        # 4. Initialize CP-SAT Model
        model = cp_model.CpModel()
        scale = self.config.power_scale
        eff_pct = int(round(self.config.charging_efficiency * 100))

        # Variables:
        # power[(ev_id, t)]: integer charging power (0.1 kW)
        power: Dict[Tuple[str, str], cp_model.IntVar] = {}
        # charger_assignment[(ev_id, charger_id)]: 0/1 indicator
        charger_assignment: Dict[Tuple[str, str], cp_model.BoolVar] = {}
        # battery_energy_delivered[ev_id]: in 0.01 kWh (energy_scale)
        battery_energy: Dict[str, cp_model.IntVar] = {}

        # -------------------------------------------------------------------
        # Charger Assignment & Sequential Turnover Constraints
        # -------------------------------------------------------------------
        for ev in valid_evs:
            compatible = [
                c for c in self.available_chargers
                if check_connector_compatibility(ev.connector_type, c.connector_type)
            ]
            for charger in self.available_chargers:
                var = model.NewBoolVar(f"assign_{ev.ev_id}_{charger.charger_id}")
                charger_assignment[(ev.ev_id, charger.charger_id)] = var

                if charger not in compatible:
                    # Incompatible hardware cannot be assigned
                    model.Add(var == 0)

            # Exactly one physical charger per EV
            model.Add(
                sum(charger_assignment[(ev.ev_id, c.charger_id)] for c in compatible) == 1
            )

        # SEQUENTIAL TURNOVER:
        # Two EVs whose parking presence windows [arrival, deadline) overlap CANNOT share the same charger.
        # However, if their windows do NOT overlap, both CAN share the same charger sequentially!
        num_evs = len(valid_evs)
        for i in range(num_evs):
            ev_a = valid_evs[i]
            for j in range(i + 1, num_evs):
                ev_b = valid_evs[j]

                # Check if windows overlap
                overlap = max(ev_a.arrival_time, ev_b.arrival_time) < min(ev_a.deadline, ev_b.deadline)
                if overlap:
                    # Bay conflict: At most one of them can use charger c
                    for charger in self.available_chargers:
                        c_id = charger.charger_id
                        model.Add(
                            charger_assignment[(ev_a.ev_id, c_id)]
                            + charger_assignment[(ev_b.ev_id, c_id)]
                            <= 1
                        )

        # -------------------------------------------------------------------
        # Power, Energy & Efficiency Modeling
        # -------------------------------------------------------------------
        for ev in valid_evs:
            ev_id = ev.ev_id
            ev_max_scaled = int(round(ev.max_charging_power_kw * scale))
            slots = self._eligible_slots(ev)

            # Max battery energy requested in 0.01 kWh
            max_batt_kwh_scaled = int(round(ev.energy_needed_kwh * self.config.energy_scale))
            battery_energy[ev_id] = model.NewIntVar(0, max_batt_kwh_scaled, f"batt_energy_{ev_id}")

            active_power_terms = []
            for t in self.times:
                if t in slots:
                    p_var = model.NewIntVar(0, ev_max_scaled, f"power_{ev_id}_{t}")
                    power[(ev_id, t)] = p_var
                    active_power_terms.append(p_var)
                else:
                    power[(ev_id, t)] = model.NewConstant(0)

            # Battery Energy = Sum(Power * dt) * Efficiency
            # Power is in 0.1 kW, energy is in 0.01 kWh -> factor is 10:
            # power_scaled (0.1 kW) * 10 = power in 0.01 kW
            # (Sum(p_var) * 10 * eff_pct) // 100 == battery_energy
            # => Sum(p_var) * eff_pct == battery_energy / (scale / 10)
            # Exactly: battery_energy (in 0.01 kWh) == Sum(power_var) * (eff_pct / 10)
            # To avoid division: 10 * battery_energy == Sum(power_var) * eff_pct
            model.Add(
                10 * battery_energy[ev_id] == sum(active_power_terms) * eff_pct
            )

            # Native Half-Reified Charger Power Limit (No Big-M)
            for charger in self.available_chargers:
                c_id = charger.charger_id
                max_allowed_kw = min(ev.max_charging_power_kw, charger.max_power_kw)
                max_allowed_scaled = int(round(max_allowed_kw * scale))

                assign_var = charger_assignment[(ev_id, c_id)]
                for t in slots:
                    model.Add(power[(ev_id, t)] <= max_allowed_scaled).OnlyEnforceIf(assign_var)

        # -------------------------------------------------------------------
        # Station Transformer Peak Capacity Constraint
        # -------------------------------------------------------------------
        station_capacity_scaled = int(round(self.station.total_power_capacity_kw * scale))
        for t in self.times:
            model.Add(
                sum(power[(ev.ev_id, t)] for ev in valid_evs) <= station_capacity_scaled
            )

        # -------------------------------------------------------------------
        # Comprehensive Multi-Objective Function
        # -------------------------------------------------------------------
        # Objective =
        #   + w_energy * DeliveredBatteryEnergy
        #   + w_renew * (Power * RenewableShare)
        #   - w_grid * (Power * NormalizedGridStress)
        #   + w_prio * (Power * PriorityBonus)
        #   + w_urgent * (EarlyChargingBonus if immediate start required)
        objective_terms = []

        cfg = self.config
        for ev in valid_evs:
            ev_id = ev.ev_id
            slots = self._eligible_slots(ev)

            # 1. Primary: Deliver required energy
            objective_terms.append(battery_energy[ev_id] * cfg.weight_energy)

            # Priority bonus weight
            prio_val = ev.priority.lower()
            if prio_val == "high":
                prio_bonus = cfg.priority_high_bonus
            elif prio_val == "normal":
                prio_bonus = cfg.priority_normal_bonus
            else:
                prio_bonus = 0

            # Driver preference flags
            prefer_renew = ev.preferences.prefer_renewable
            allow_delay = ev.preferences.allow_delayed_start

            for slot_idx, t in enumerate(slots):
                p_var = power[(ev_id, t)]
                renew_pct = self.forecast[t].renewable_percent
                grid_stress = load_score_map[t]

                term_weight = 0

                # 2. Reward actual renewable generation
                if prefer_renew:
                    term_weight += int(round(renew_pct * (cfg.weight_renewable_kwh / 100.0)))

                # 3. Penalize grid peak stress
                term_weight -= int(round(grid_stress * (cfg.weight_grid_stress / 100.0)))

                # 4. Priority tier bonus
                term_weight += prio_bonus

                # 5. Immediate start preference (discourage delay)
                if not allow_delay:
                    # Decay bonus across remaining slots to pull charge earlier
                    decay_factor = max(0, len(slots) - slot_idx)
                    term_weight += int(round(cfg.urgent_start_bonus * (decay_factor / max(1, len(slots)))))

                objective_terms.append(p_var * term_weight)

        model.Maximize(sum(objective_terms))

        # -------------------------------------------------------------------
        # Solve with CP-SAT
        # -------------------------------------------------------------------
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = self.config.max_solve_time_sec
        solver.parameters.num_search_workers = self.config.num_search_workers

        status = solver.Solve(model)
        status_name = solver.StatusName(status)
        is_feasible = status in (cp_model.OPTIMAL, cp_model.FEASIBLE)

        if not is_feasible:
            logger.warning(f"CP-SAT solver returned {status_name}.")
            diagnostics.append(
                f"CP-SAT status: {status_name}. Station peak or charger turnover bounds could not be satisfied."
            )
            return OptimizationResult(
                status=status_name,
                is_feasible=False,
                objective_value=0.0,
                solve_time_seconds=solver.WallTime(),
                num_branches=solver.NumBranches(),
                num_conflicts=solver.NumConflicts(),
                schedules={},
                baseline=baseline_metric,
                optimized=BaselineMetric(0, 0, 0, 0, 0, 0),
                peak_reduction_percent=0.0,
                renewable_gain_percent=0.0,
                grid_stress_reduction_percent=0.0,
                station_id=self.station.station_id,
                station_name=self.station.name,
                diagnostics=diagnostics,
            )

        # -------------------------------------------------------------------
        # Extract Results & Generate Explanations
        # -------------------------------------------------------------------
        schedules: Dict[str, EVScheduleResult] = {}
        total_opt_grid_kwh = 0.0
        total_opt_batt_kwh = 0.0
        total_opt_renew_kwh = 0.0
        weighted_opt_grid_load = 0.0
        hourly_station_power: Dict[str, float] = {t: 0.0 for t in self.times}

        for ev in valid_evs:
            ev_id = ev.ev_id

            # Find assigned charger
            assigned_cid = None
            for charger in self.available_chargers:
                if solver.Value(charger_assignment[(ev_id, charger.charger_id)]) == 1:
                    assigned_cid = charger.charger_id
                    break

            batt_delivered = solver.Value(battery_energy[ev_id]) / float(self.config.energy_scale)
            grid_consumed = batt_delivered / self.config.charging_efficiency if batt_delivered > 0 else 0.0
            unmet = max(0.0, ev.energy_needed_kwh - batt_delivered)

            # Status determination
            if unmet <= 1e-4:
                ev_status = "FULLY_CHARGED"
            elif batt_delivered > 0:
                ev_status = "PARTIALLY_CHARGED"
            else:
                ev_status = "UNFULFILLED"

            final_soc = min(
                100.0,
                ev.current_soc_percent + (batt_delivered / ev.battery_capacity_kwh * 100.0),
            )

            # Slot breakdown with explainability
            slot_allocations: List[ChargingSlotAllocation] = []
            ev_diagnostics: List[str] = []

            for t in self.times:
                p_val = solver.Value(power[(ev_id, t)]) / float(scale)
                hourly_station_power[t] += p_val

                if p_val <= 1e-4:
                    continue

                grid_kwh_slot = p_val * self.config.slot_hours
                batt_kwh_slot = grid_kwh_slot * self.config.charging_efficiency
                renew_pct = self.forecast[t].renewable_percent
                renew_kwh_slot = grid_kwh_slot * (renew_pct / 100.0)
                grid_load = self.forecast[t].grid_load_mw

                total_opt_grid_kwh += grid_kwh_slot
                total_opt_batt_kwh += batt_kwh_slot
                total_opt_renew_kwh += renew_kwh_slot
                weighted_opt_grid_load += grid_kwh_slot * grid_load

                # Explainability rationale:
                reasons = []
                if renew_pct >= 30:
                    reasons.append(f"High renewable share ({renew_pct:.0f}%)")
                if load_score_map[t] <= 40:
                    reasons.append(f"Off-peak grid relief ({grid_load:.0f} MW)")
                if not ev.preferences.allow_delayed_start:
                    reasons.append("Immediate charging preference")
                if not reasons:
                    reasons.append("Deadline fulfillment requirement")

                slot_allocations.append(
                    ChargingSlotAllocation(
                        timestamp=t,
                        power_kw=round(p_val, 2),
                        battery_energy_kwh=round(batt_kwh_slot, 2),
                        grid_energy_kwh=round(grid_kwh_slot, 2),
                        renewable_percent=round(renew_pct, 1),
                        grid_load_mw=round(grid_load, 2),
                        renewable_kwh=round(renew_kwh_slot, 2),
                        explanation=", ".join(reasons),
                    )
                )

            if unmet > 0.05:
                ev_diagnostics.append(
                    f"Shortfall of {unmet:.1f} kWh due to duration ({ev.duration_hours:.1f}h) "
                    f"or max power cap ({ev.max_charging_power_kw:.1f} kW)."
                )

            schedules[ev_id] = EVScheduleResult(
                ev_id=ev_id,
                car_model=ev.car_model or "Standard EV",
                priority=ev.priority,
                assigned_charger_id=assigned_cid,
                requested_energy_kwh=round(ev.energy_needed_kwh, 2),
                delivered_battery_energy_kwh=round(batt_delivered, 2),
                grid_energy_consumed_kwh=round(grid_consumed, 2),
                unmet_energy_kwh=round(unmet, 2),
                initial_soc_percent=round(ev.current_soc_percent, 1),
                final_soc_percent=round(final_soc, 1),
                status=ev_status,
                slots=slot_allocations,
                diagnostics=ev_diagnostics,
            )

        # -------------------------------------------------------------------
        # KPI Benchmarking (Baseline vs Optimized)
        # -------------------------------------------------------------------
        opt_peak = max(hourly_station_power.values()) if hourly_station_power else 0.0
        opt_renew_pct = (total_opt_renew_kwh / total_opt_grid_kwh * 100.0) if total_opt_grid_kwh > 0 else 0.0
        opt_avg_grid_load = (weighted_opt_grid_load / total_opt_grid_kwh) if total_opt_grid_kwh > 0 else 0.0

        optimized_metric = BaselineMetric(
            peak_station_power_kw=round(opt_peak, 2),
            total_grid_energy_kwh=round(total_opt_grid_kwh, 2),
            total_battery_energy_kwh=round(total_opt_batt_kwh, 2),
            renewable_energy_kwh=round(total_opt_renew_kwh, 2),
            renewable_utilization_percent=round(opt_renew_pct, 1),
            avg_grid_load_mw=round(opt_avg_grid_load, 2),
        )

        # Peak Reduction %
        peak_reduction = 0.0
        if baseline_metric.peak_station_power_kw > 0:
            peak_reduction = max(
                0.0,
                (baseline_metric.peak_station_power_kw - opt_peak)
                / baseline_metric.peak_station_power_kw
                * 100.0,
            )

        # Renewable Share Gain %
        renew_gain = max(0.0, opt_renew_pct - baseline_metric.renewable_utilization_percent)

        # Grid Stress Reduction %
        grid_stress_red = 0.0
        if baseline_metric.avg_grid_load_mw > 0:
            grid_stress_red = max(
                0.0,
                (baseline_metric.avg_grid_load_mw - opt_avg_grid_load)
                / baseline_metric.avg_grid_load_mw
                * 100.0,
            )

        return OptimizationResult(
            status=status_name,
            is_feasible=True,
            objective_value=float(solver.ObjectiveValue()),
            solve_time_seconds=round(solver.WallTime(), 3),
            num_branches=solver.NumBranches(),
            num_conflicts=solver.NumConflicts(),
            schedules=schedules,
            baseline=baseline_metric,
            optimized=optimized_metric,
            peak_reduction_percent=round(peak_reduction, 2),
            renewable_gain_percent=round(renew_gain, 2),
            grid_stress_reduction_percent=round(grid_stress_red, 2),
            station_id=self.station.station_id,
            station_name=self.station.name,
            diagnostics=diagnostics,
        )


# ---------------------------------------------------------------------------
# Data Ingestion & I/O Handlers
# ---------------------------------------------------------------------------
def parse_optimizer_dicts(
    station_data: Dict[str, Any], forecast_data: Dict[str, Any]
) -> Tuple[Station, List[EVRequest], Dict[str, SlotForecast]]:
    """Instantiates validated data structures directly from in-memory dictionary sources."""
    # Build Station & Chargers
    st_raw = station_data.get("station", {})
    chargers = [
        Charger(
            charger_id=c["charger_id"],
            max_power_kw=float(c["max_power_kw"]),
            connector_type=c.get("connector_type", "Type2"),
            status=c.get("status", "available"),
        )
        for c in st_raw.get("chargers", [])
    ]
    station = Station(
        station_id=st_raw.get("station_id", "ST001"),
        name=st_raw.get("name", "EV Station"),
        total_power_capacity_kw=float(st_raw.get("total_power_capacity_kw", 100.0)),
        chargers=chargers,
        location=st_raw.get("location"),
    )

    # Build EV Requests
    ev_requests = []
    for ev in station_data.get("ev_requests", []):
        pref_raw = ev.get("preferences", {})
        prefs = EVPreferences(
            prefer_renewable=pref_raw.get("prefer_renewable", True),
            prefer_low_cost=pref_raw.get("prefer_low_cost", True),
            allow_delayed_start=pref_raw.get("allow_delayed_start", True),
        )
        ev_requests.append(
            EVRequest(
                ev_id=ev["ev_id"],
                arrival_time=parse_iso_time(ev["arrival_time"]),
                deadline=parse_iso_time(ev["deadline"]),
                battery_capacity_kwh=float(ev.get("battery_capacity_kwh", 60.0)),
                current_soc_percent=float(ev.get("current_soc_percent", 20.0)),
                target_soc_percent=float(ev.get("target_soc_percent", 80.0)),
                energy_needed_kwh=float(ev.get("energy_needed_kwh", 25.0)),
                max_charging_power_kw=float(ev.get("max_charging_power_kw", 7.0)),
                priority=str(ev.get("priority", "normal")),
                preferences=prefs,
                connector_type=ev.get("connector_type"),
                car_model=ev.get("car_model"),
            )
        )

    # Build Forecast
    renew_data = forecast_data.get("renewable_energy_share", {}).get("data", [])
    load_data = forecast_data.get("total_grid_load", {}).get("data", [])
    renew_map = {x["datetime"]: float(x["value"]) for x in renew_data}
    load_map = {x["datetime"]: float(x["value"]) for x in load_data}

    common_times = sorted(set(renew_map) & set(load_map), key=parse_iso_time)
    if not common_times:
        raise ValueError("No common hourly timestamps found between renewable share and grid load.")

    forecast = {
        t: SlotForecast(
            timestamp=t,
            dt=parse_iso_time(t),
            renewable_percent=renew_map[t],
            grid_load_mw=load_map[t],
        )
        for t in common_times
    }

    return station, ev_requests, forecast


def load_optimizer_inputs(
    station_file: Path, forecast_file: Path
) -> Tuple[Station, List[EVRequest], Dict[str, SlotForecast]]:
    """Loads and instantiates validated data structures from JSON sources."""
    if not station_file.exists():
        raise FileNotFoundError(f"Input file not found: {station_file.resolve()}")
    if not forecast_file.exists():
        raise FileNotFoundError(f"Forecast file not found: {forecast_file.resolve()}")

    with station_file.open("r", encoding="utf-8") as f:
        station_data = json.load(f)

    with forecast_file.open("r", encoding="utf-8") as f:
        forecast_data = json.load(f)

    return parse_optimizer_dicts(station_data, forecast_data)


# ---------------------------------------------------------------------------
# Reporting & Output Formatting
# ---------------------------------------------------------------------------
def print_terminal_dashboard(result: OptimizationResult) -> None:
    """Renders a clean, executive terminal dashboard with KPIs and schedules."""
    # Ensure stdout handles encoding gracefully on all platforms
    try:
        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    sep = "=" * 78
    sub_sep = "-" * 78

    print("\n" + sep)
    print("      GREENCHARGE AI -- OPTIMIZATION & SUSTAINABILITY DASHBOARD")
    print(sep)
    print(f" Station : {result.station_name} ({result.station_id})")
    print(f" Status  : {result.status} | Solve Time: {result.solve_time_seconds:.3f}s | Objective: {result.objective_value:,.0f}")
    print(f" Search  : {result.num_branches} branches, {result.num_conflicts} conflicts")

    if result.diagnostics:
        print("\n[!] Pre-Flight & Operational Diagnostics:")
        for diag in result.diagnostics:
            print(f"  * {diag}")

    # Baseline Comparison Table
    print("\n" + sub_sep)
    print(" [IMPACT BENCHMARK] UNMANAGED BASELINE vs OPTIMIZED (CP-SAT)")
    print(sub_sep)
    print(f" {'Metric':<34} | {'Unmanaged Baseline':<18} | {'Optimized':<18}")
    print(" " + "-" * 76)
    b, o = result.baseline, result.optimized
    print(f" {'Peak Station Power Demand':<34} | {b.peak_station_power_kw:>14.1f} kW | {o.peak_station_power_kw:>14.1f} kW  ({result.peak_reduction_percent:+.1f}% Peak Shaving)")
    print(f" {'Total Grid Energy Drawn':<34} | {b.total_grid_energy_kwh:>14.1f} kWh| {o.total_grid_energy_kwh:>14.1f} kWh")
    print(f" {'Battery Delivered Energy':<34} | {b.total_battery_energy_kwh:>14.1f} kWh| {o.total_battery_energy_kwh:>14.1f} kWh")
    print(f" {'Renewable Energy Consumed':<34} | {b.renewable_energy_kwh:>14.1f} kWh| {o.renewable_energy_kwh:>14.1f} kWh  ({o.renewable_energy_kwh - b.renewable_energy_kwh:+.1f} kWh Green Gain)")
    print(f" {'Renewable Utilization Share':<34} | {b.renewable_utilization_percent:>17.1f}% | {o.renewable_utilization_percent:>17.1f}% ({result.renewable_gain_percent:+.1f}% Improvement)")
    print(f" {'Average Grid Load Coincidence':<34} | {b.avg_grid_load_mw:>14.1f} MW | {o.avg_grid_load_mw:>14.1f} MW ({result.grid_stress_reduction_percent:+.1f}% Stress Relief)")

    # Per EV Schedule
    print("\n" + sub_sep)
    print(" [VEHICLE SCHEDULES & REASONING] (Explainable AI)")
    print(sub_sep)

    for ev_id, sched in result.schedules.items():
        print(f"\n[{ev_id}] {sched.car_model} (Priority: {sched.priority.upper()})")
        print(f"  - Bay / Charger : {sched.assigned_charger_id or 'None'}")
        print(f"  - Battery Energy: {sched.delivered_battery_energy_kwh:.1f} / {sched.requested_energy_kwh:.1f} kWh ({sched.status})")
        print(f"  - SOC Change    : {sched.initial_soc_percent:.0f}% -> {sched.final_soc_percent:.0f}%")

        if sched.diagnostics:
            for d in sched.diagnostics:
                print(f"  - Note: {d}")

        if sched.slots:
            print("  - Scheduled Slots:")
            for s in sched.slots:
                print(
                    f"    {s.timestamp} | {s.power_kw:>4.1f} kW | "
                    f"Renewable={s.renewable_percent:>2.0f}% | "
                    f"Grid={s.grid_load_mw:>7.0f} MW | "
                    f"Reason: {s.explanation}"
                )
        else:
            print("    (No charging slots allocated)")

    print("\n" + sep + "\n")


def result_to_dict(result: OptimizationResult) -> Dict[str, Any]:
    """Converts OptimizationResult into a JSON-serializable dictionary adhering to GreenCharge AI schemas."""
    return {
        "station_id": result.station_id,
        "station_name": result.station_name,
        "status": result.status,
        "is_feasible": result.is_feasible,
        "objective_value": result.objective_value,
        "solve_time_seconds": result.solve_time_seconds,
        "solver_diagnostics": {
            "num_branches": result.num_branches,
            "num_conflicts": result.num_conflicts,
        },
        "kpis": {
            "peak_reduction_percent": result.peak_reduction_percent,
            "renewable_gain_percent": result.renewable_gain_percent,
            "grid_stress_reduction_percent": result.grid_stress_reduction_percent,
            "baseline": asdict(result.baseline),
            "optimized": asdict(result.optimized),
        },
        "schedules": {ev_id: asdict(sched) for ev_id, sched in result.schedules.items()},
        "diagnostics": result.diagnostics,
    }


def export_result_to_json(result: OptimizationResult, output_path: Path) -> None:
    """Exports structured optimization output adhering to GreenCharge AI schemas."""
    data = result_to_dict(result)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    logger.info(f"Results successfully exported to {output_path.resolve()}")


# ---------------------------------------------------------------------------
# CLI Entrypoint
# ---------------------------------------------------------------------------
def parse_cli_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="GreenCharge AI — Production CP-SAT EV Charging Optimizer"
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("input_data.json"),
        help="Path to input_data.json (station and ev requests)",
    )
    parser.add_argument(
        "--forecast",
        type=Path,
        default=Path("electricity_forecast.json"),
        help="Path to electricity_forecast.json (renewable share & grid load)",
    )
    parser.add_argument(
        "--export-json",
        type=Path,
        default=None,
        help="Optional path to export full optimization results as JSON",
    )
    parser.add_argument(
        "--eta",
        type=float,
        default=0.90,
        help="Charging efficiency (default: 0.90)",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=10.0,
        help="Solver timeout in seconds (default: 10.0)",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="Suppress terminal dashboard output",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_cli_args()

    # Load & parse inputs
    station, ev_requests, forecast = load_optimizer_inputs(args.input, args.forecast)

    # Configure optimizer
    config = OptimizationConfig(
        charging_efficiency=args.eta,
        max_solve_time_sec=args.timeout,
    )

    # Run optimization
    optimizer = EVChargingOptimizer(
        station=station,
        ev_requests=ev_requests,
        forecast=forecast,
        config=config,
    )
    result = optimizer.solve()

    # Output results
    if not args.quiet:
        print_terminal_dashboard(result)

    if args.export_json:
        export_result_to_json(result, args.export_json)

    if not result.is_feasible:
        sys.exit(1)


if __name__ == "__main__":
    main()
