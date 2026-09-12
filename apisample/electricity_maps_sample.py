"""
Simple Electricity Maps API v4 Forecast Fetcher

Fetches:
1. Renewable energy share (%)
2. Total grid load (MW)
3. Carbon intensity (gCO2eq/kWh)

At the end, saves all fetched data to:
    electricity_forecast.json

Install:
    pip install requests

Set token:

PowerShell:
    $env:ELECTRICITY_MAPS_TOKEN="YOUR_TOKEN"

CMD:
    set ELECTRICITY_MAPS_TOKEN=YOUR_TOKEN

Run:
    python electricity_maps_simple.py
"""

import os
import json
import requests


BASE_URL = "https://api.electricitymaps.com/v4"

# ------------------------------------------------------------
# LOCATION
# ------------------------------------------------------------

LATITUDE = 23.0225
LONGITUDE = 72.5714

# ------------------------------------------------------------
# FORECAST SETTINGS
# ------------------------------------------------------------

HORIZON_HOURS = 24
TEMPORAL_GRANULARITY = "hourly"

# ------------------------------------------------------------
# OUTPUT FILE
# ------------------------------------------------------------

OUTPUT_FILE = r"F:\MCA\hackout\project\green-charge-ai\apisample\electricity_forecast.json"


# ------------------------------------------------------------
# API TOKEN
# ------------------------------------------------------------

API_TOKEN = os.getenv("ELECTRICITY_MAPS_TOKEN")

if not API_TOKEN:
    raise SystemExit(
        "ERROR: ELECTRICITY_MAPS_TOKEN environment variable is not set.\n\n"
        "PowerShell:\n"
        '  $env:ELECTRICITY_MAPS_TOKEN="YOUR_TOKEN"\n\n'
        "CMD:\n"
        "  set ELECTRICITY_MAPS_TOKEN=YOUR_TOKEN"
    )

HEADERS = {
    "auth-token": API_TOKEN,
    "Accept": "application/json",
}


# ============================================================
# API CALL
# ============================================================

def get_forecast(endpoint):
    """Fetch a forecast from Electricity Maps."""

    url = f"{BASE_URL}/{endpoint}"

    params = {
        "lat": LATITUDE,
        "lon": LONGITUDE,
        "horizonHours": HORIZON_HOURS,
        "temporalGranularity": TEMPORAL_GRANULARITY,
    }

    try:
        response = requests.get(
            url,
            headers=HEADERS,
            params=params,
            timeout=30,
        )
    except requests.RequestException as exc:
        print(f"REQUEST ERROR: {exc}")
        return None

    if not response.ok:
        print(f"API ERROR: {response.status_code}")
        print(response.text)
        return None

    try:
        return response.json()
    except ValueError:
        print("ERROR: API did not return valid JSON.")
        return None


# ============================================================
# PRINT FORECAST
# ============================================================

def print_forecast(name, data, unit):
    """Print forecast data."""

    print(f"\n========== {name} ==========")

    if not data:
        print("No data returned.")
        return

    items = data.get("data", [])

    if not items:
        print("No forecast data returned.")
        return

    for item in items:
        timestamp = item.get("datetime")
        value = item.get("value")

        print(f"{timestamp} -> {value} {unit}")


# ============================================================
# SAVE JSON
# ============================================================

def save_to_json(renewable, total_load, carbon):
    """Save all fetched forecast data to a JSON file."""

    output_data = {
        "location": {
            "latitude": LATITUDE,
            "longitude": LONGITUDE,
        },

        "forecast_settings": {
            "horizon_hours": HORIZON_HOURS,
            "temporal_granularity": TEMPORAL_GRANULARITY,
        },

        "renewable_energy_share": {
            "unit": "%",
            "data": renewable.get("data", []) if renewable else [],
        },

        "total_grid_load": {
            "unit": "MW",
            "data": total_load.get("data", []) if total_load else [],
        },

        "carbon_intensity": {
            "unit": "gCO2eq/kWh",
            "data": carbon.get("data", []) if carbon else [],
        },
    }

    try:
        with open(
            OUTPUT_FILE,
            "w",
            encoding="utf-8",
        ) as file:
            json.dump(
                output_data,
                file,
                indent=4,
                ensure_ascii=False,
            )

        print(f"\nJSON file saved successfully: {OUTPUT_FILE}")

    except OSError as exc:
        print(f"ERROR: Could not save JSON file: {exc}")


# ============================================================
# MAIN
# ============================================================

def main():

    print("Fetching Electricity Maps forecasts...")
    print(f"Latitude  : {LATITUDE}")
    print(f"Longitude : {LONGITUDE}")
    print(f"Horizon   : {HORIZON_HOURS} hours")
    print(f"Granularity: {TEMPORAL_GRANULARITY}")

    # --------------------------------------------------------
    # 1. Renewable Energy Share
    # --------------------------------------------------------

    renewable = get_forecast(
        "renewable-energy/forecast"
    )

    # --------------------------------------------------------
    # 2. Total Grid Load
    # --------------------------------------------------------

    total_load = get_forecast(
        "total-load/forecast"
    )

    # --------------------------------------------------------
    # 3. Carbon Intensity
    # --------------------------------------------------------

    carbon = get_forecast(
        "carbon-intensity/forecast"
    )

    # --------------------------------------------------------
    # PRINT RESULTS
    # --------------------------------------------------------

    print_forecast(
        "RENEWABLE ENERGY SHARE",
        renewable,
        "%",
    )

    print_forecast(
        "TOTAL GRID LOAD",
        total_load,
        "MW",
    )

    print_forecast(
        "CARBON INTENSITY",
        carbon,
        "gCO2eq/kWh",
    )

    # --------------------------------------------------------
    # SAVE RESULTS TO JSON
    # --------------------------------------------------------

    save_to_json(
        renewable,
        total_load,
        carbon,
    )

    print("\n========== DONE ==========")


if __name__ == "__main__":
    main()
