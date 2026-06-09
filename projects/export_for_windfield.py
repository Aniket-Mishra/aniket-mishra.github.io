import json
import os
import numpy as np
import pandas as pd

STEP = 36
RATED_POWER_KW = 1790.0

SEVERITY_CODES = {"none": 0, "low": 1, "medium": 2, "high": 3}

SCENARIOS = {
    "WT001": ("Calm baseline", "healthy", "No injected fault. The reference turbine."),
    "WT002": ("Thermal drift", "temperature", "A slow fever begins in spring and never lifts."),
    "WT003": ("Pitch fault", "pitch", "One blade jumps out of alignment, abruptly."),
    "WT004": ("Yaw drift", "yaw", "Late-year misalignment; it stops facing the wind."),
    "WT005": ("Thermal drift, recovered", "temperature", "Heats up, then slowly cools back to health."),
    "WT006": ("Pitch fault, repaired", "pitch", "Pitch fault, then a clean repair in midsummer."),
    "WT007": ("Yaw drift, recovered", "yaw", "Drifts off-wind, then gradually realigns."),
    "WT008": ("Thermal drift, repaired", "temperature", "Fever rises, then is fixed in a single step."),
    "WT009": ("Yaw drift, repaired" "yaw", "Misaligns, then snaps back after a service visit."),
    "WT010": ("Thermal and yaw", "compound", "Two faults stack and neither is ever repaired."),
}

LAYOUT = {
    "WT001": (0.10, 0.30), "WT002": (0.28, 0.18), "WT003": (0.46, 0.32),
    "WT004": (0.64, 0.20), "WT005": (0.82, 0.34),
    "WT006": (0.19, 0.62), "WT007": (0.37, 0.74), "WT008": (0.55, 0.64),
    "WT009": (0.73, 0.76), "WT010": (0.90, 0.66),
}


def signed_angle_difference(first_degrees, second_degrees):
    return (first_degrees - second_degrees + 180.0) % 360.0 - 180.0


def fault_code(label):
    has_temperature = "temperature" in label
    has_pitch = "pitch" in label
    has_yaw = "yaw" in label
    if has_temperature and has_yaw:
        return 4
    if has_pitch:
        return 2
    if has_temperature:
        return 1
    if has_yaw:
        return 3
    return 0


def export_farm_json(df, events, site_config, seed, simulate_site_conditions, output_path="farm.json"):
    site_conditions = simulate_site_conditions(**site_config, seed=seed)
    site_frames = site_conditions.iloc[::STEP].reset_index(drop=True)
    frame_count = len(site_frames)
    frame_times = pd.to_datetime(site_frames["time"])

    site = {
        "dir": [round(float(value), 1) for value in site_frames["wind_direction_site"]],
        "wind": [round(float(value), 2) for value in site_frames["wind_speed_site"]],
        "temp": [round(float(value), 1) for value in site_frames["ambient_temp_site"]],
        "doy": [int(time.dayofyear) for time in frame_times],
    }

    turbines = []
    for device in sorted(df["device"].unique()):
        device_frames = df[df["device"] == device].sort_values("time").iloc[::STEP].reset_index(drop=True)
        yaw_error = np.abs(signed_angle_difference(
            device_frames["wind_direction"].to_numpy(),
            device_frames["nacelle_direction"].to_numpy(),
        ))
        generator_warmth = np.clip((device_frames["generator_temp"].to_numpy() - 30.0) / 55.0, 0, 1) * 100
        name, kind, blurb = SCENARIOS.get(device, (device, "healthy", ""))
        layout_x, layout_y = LAYOUT.get(device, (0.5, 0.5))
        turbines.append({
            "id": device, "name": name, "kind": kind, "blurb": blurb, "x": layout_x, "y": layout_y,
            "power": [int(round(min(power / RATED_POWER_KW, 1.2) * 100)) for power in device_frames["active_power"]],
            "rotor": [int(round(float(speed) * 10)) for speed in device_frames["rotor_speed"]],
            "yaw": [int(round(float(angle))) for angle in yaw_error],
            "warm": [int(round(float(value))) for value in generator_warmth],
            "sev": [SEVERITY_CODES.get(level, 0) for level in device_frames["fault_severity"]],
            "flt": [fault_code(str(label)) for label in device_frames["fault_labels"]],
        })

    def time_to_frame(time):
        if pd.isna(time):
            return None
        return int((pd.to_datetime(time) - frame_times.iloc[0]) / pd.Timedelta(hours=6))

    event_list = [{
        "device": row["device"], "type": row["fault_type"],
        "start": time_to_frame(row["start_time"]), "end": time_to_frame(row["end_time"]),
        "shape": row["shape"], "severity": float(row["max_severity"]),
    } for _, row in events.iterrows()]

    result = {
        "meta": {
            "start": str(frame_times.iloc[0].date()), "end": str(frame_times.iloc[-1].date()),
            "nframes": frame_count, "cadence_hours": 6, "rated_kw": RATED_POWER_KW,
            "n_turbines": len(turbines),
        },
        "site": site, "turbines": turbines, "events": event_list,
    }

    with open(output_path, "w") as handle:
        json.dump(result, handle, separators=(",", ":"))
    print(f"wrote {output_path}: {os.path.getsize(output_path) / 1024:.0f} KB, "
          f"{frame_count} frames, {len(turbines)} turbines, {len(event_list)} events")
    return result


if __name__ == "__main__":
    export_farm_json(df, events, site_config, random_seed, simulate_site_conditions)
