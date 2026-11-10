"""
Code-made SFX for "How an Aircraft Carrier Defends Itself" (Formats/Naval Board/episodes/ep01-carrier): jet pass, missile launch, Phalanx burst,
radar and sonar pings, jamming static, a two-tone alarm. Same rules as make-sfx-ambush.py (no cartoon sounds; each
file levelled by Sfx from its measured loudness).
  python -P scripts/make-sfx-carrier.py   -> public/sfx/synth/*.wav (+ catalog.json entries, author "code")
"""
import json
import re
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "sfx" / "synth"
rng = np.random.default_rng(31)


def onepole(x, a):
    """Fast one-pole low-pass (vectorised via cumulative filter on blocks)."""
    y = np.empty_like(x)
    acc = 0.0
    for i in range(0, len(x), 4096):
        blk = x[i : i + 4096]
        out = np.empty_like(blk)
        for j, v in enumerate(blk):
            acc += a * (v - acc)
            out[j] = acc
        y[i : i + 4096] = out
    return y


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def jet_pass(sec=3.2):
    """Roar that swells and passes: band-limited noise with a falling Doppler whine."""
    t = t_(sec)
    n = rng.normal(0, 1, len(t))
    roar = onepole(n, 0.08) - onepole(n, 0.01)
    env = np.exp(-((t - sec * 0.45) ** 2) / (2 * (sec * 0.18) ** 2))
    f = 1400 - 700 * np.tanh((t - sec * 0.45) * 4)
    whine = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.12
    return (roar * 2.2 + whine) * env


def missile_launch(sec=2.6):
    """Ignition crack, then a rocket roar that fades as it climbs away."""
    t = t_(sec)
    n = rng.normal(0, 1, len(t))
    roar = onepole(n, 0.25) * np.exp(-t / 0.9) * np.minimum(1, t / 0.04)
    crack = onepole(n, 0.6) * np.exp(-t / 0.03) * 2.5
    rumble = onepole(n, 0.01) * np.exp(-t / 1.2) * 6
    return roar + crack + rumble


def ciws_burst(sec=1.6, rate=75):
    """Phalanx: ~75 rounds a second blur into a tearing buzz."""
    t = t_(sec)
    x = np.zeros(len(t))
    k = int(0.006 * SR)
    tt = np.arange(k) / SR
    shot = rng.normal(0, 1, k) * np.exp(-tt / 0.0025)
    for i in range(int(sec * rate * 0.92)):
        a = int((i / rate) * SR)
        x[a : a + k] += shot[: max(0, min(k, len(x) - a))]
    x = onepole(x, 0.5)
    x += onepole(rng.normal(0, 1, len(t)), 0.02) * 2  # mechanism rumble
    return x * np.minimum(1, (sec - t) / 0.08)


def radar_ping(sec=0.7):
    t = t_(sec)
    return np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.09) * 0.6 + np.sin(2 * np.pi * 3800 * t) * np.exp(-t / 0.03) * 0.2


def sonar_ping(sec=2.8):
    t = t_(sec)
    ping = np.sin(2 * np.pi * 1450 * t) * np.exp(-t / 0.5) * np.minimum(1, t / 0.01)
    echo = np.zeros(len(t))
    d = int(0.9 * SR)
    echo[d:] = ping[: len(t) - d] * 0.35
    return ping + echo


def jam_static(sec=2.0):
    t = t_(sec)
    n = rng.normal(0, 1, len(t))
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * t) * np.sin(2 * np.pi * 0.9 * t)
    sweep = np.sin(2 * np.pi * np.cumsum(600 + 500 * np.sin(2 * np.pi * 3 * t)) / SR) * 0.25
    return (onepole(n, 0.35) * am + sweep) * np.minimum(1, t / 0.05) * np.minimum(1, (sec - t) / 0.2)


def alarm(sec=2.4):
    """Two-tone shipboard alarm, softened (filtered square)."""
    t = t_(sec)
    f = np.where((t * 2.5) % 1 < 0.5, 660, 880)
    sq = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
    return onepole(sq, 0.12) * 0.5 * np.minimum(1, (sec - t) / 0.3)


def lufs(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True)
    vals = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(vals[-1]) if vals else None


def write(name, x, title):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    return {"category": "synth", "title": title, "author": "code", "source": "scripts/make-sfx-carrier.py", "seconds": round(len(x) / SR, 2), "file": f"sfx/synth/{name}.wav"}


if __name__ == "__main__":
    items = [
        write("jet-pass", jet_pass(), "Jet pass (roar + Doppler)"),
        write("missile-launch", missile_launch(), "Missile launch"),
        write("ciws-burst", ciws_burst(), "Phalanx CIWS burst"),
        write("radar-ping", radar_ping(), "Radar contact ping"),
        write("sonar-ping", sonar_ping(), "Sonar ping with echo"),
        write("jam-static", jam_static(), "Radar jamming static"),
        write("alarm", alarm(), "Shipboard two-tone alarm"),
    ]
    for i in items:
        i["lufs"] = lufs(ROOT / "public" / i["file"])
    cat_file = ROOT / "public" / "sfx" / "catalog.json"
    cat = json.loads(cat_file.read_text(encoding="utf8"))
    files = {i["file"] for i in items}
    cat = [c for c in cat if c.get("file") not in files] + items
    cat_file.write_text(json.dumps(cat, indent=2) + "\n", encoding="utf8")
    print("wrote", len(items), "files", [(i["file"].split("/")[-1], i["lufs"]) for i in items])
