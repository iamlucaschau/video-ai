"""
Code-made SFX for "The man who won the lottery 14 times" (Style Library/N-low-poly/n-mandel): no file in the library
fits these (Lucas 2026-11-04: synthesize only when no real recording fits). No cartoon sounds.
  ball-rattle  plastic lottery balls tumbling in a blown globe (3 s, loops)
  clock-tick   one dry mechanical tick
  dot-matrix   a dot-matrix printer line burst (2 s)
  python -P scripts/make-sfx-lotto.py   -> public/sfx/synth/*.wav (+ catalog.json entries, author "code")
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
rng = np.random.default_rng(14)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def bandpass(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def clack(f0, dur=0.035):
    """one hard plastic hit: a damped resonance pair + a click of noise"""
    t = t_(dur)
    env = np.exp(-t * 160)
    return (np.sin(2 * np.pi * f0 * t) + 0.6 * np.sin(2 * np.pi * f0 * 2.7 * t) + rng.normal(0, 0.5, len(t)) * np.exp(-t * 900)) * env


def ball_rattle(sec=3.0):
    x = np.zeros(int(sec * SR))
    n = int(sec * 55)
    for _ in range(n):
        at = int(rng.uniform(0, sec - 0.05) * SR)
        c = clack(rng.uniform(1800, 3600)) * rng.uniform(0.2, 1)
        x[at : at + len(c)] += c
    air = bandpass(rng.normal(0, 1, len(x)), 300, 2500) * 0.18  # the blower
    y = x + air
    fade = int(0.05 * SR)
    y[:fade] *= np.linspace(0, 1, fade)
    y[-fade:] *= np.linspace(1, 0, fade)
    return y


def clock_tick(sec=2.0):
    """four dry ticks, 0.5 s apart (long enough to measure loudness; play the first with seconds=0.5)"""
    x = np.zeros(int(sec * SR))
    for k in range(4):
        c = clack(2600 if k % 2 == 0 else 2300, 0.03)
        at = 200 + int(k * 0.5 * SR)
        x[at : at + len(c)] += c
    return x


def dot_matrix(sec=2.0):
    t = t_(sec)
    pins = (np.sin(2 * np.pi * 9 * t) > -0.3).astype(float)  # print head passes
    buzz = np.sign(np.sin(2 * np.pi * 1150 * t)) * 0.4 + rng.normal(0, 0.6, len(t))
    y = bandpass(buzz, 500, 6000) * pins
    motor = np.sin(2 * np.pi * 110 * t) * 0.15
    fade = int(0.04 * SR)
    out = y + motor
    out[:fade] *= np.linspace(0, 1, fade)
    out[-fade:] *= np.linspace(1, 0, fade)
    return out


def fades(x, a=0.05, b=0.05):
    x = x.copy()
    x[: int(a * SR)] *= np.linspace(0, 1, int(a * SR))
    x[-int(b * SR) :] *= np.linspace(1, 0, int(b * SR))
    return x


def room(lo, hi, hum=0, hum_g=0.0, sec=12.0):
    """a room you do not notice: filtered air that breathes slowly + an optional mains hum"""
    t = t_(sec)
    air = bandpass(rng.normal(0, 1, len(t)), lo, hi)
    air /= np.abs(air).max()
    air *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.13 * t + rng.uniform(0, 6))
    if hum:
        air += hum_g * (np.sin(2 * np.pi * hum * t) + 0.5 * np.sin(4 * np.pi * hum * t) + 0.2 * np.sin(6 * np.pi * hum * t))
    return fades(air, 0.3, 0.3)


def clang(f0, dur=0.09):
    """one sheet-metal slat: lower and longer than `clack`, a little inharmonic"""
    t = t_(dur)
    return (np.sin(2 * np.pi * f0 * t) + 0.7 * np.sin(2 * np.pi * f0 * 2.41 * t) + 0.4 * np.sin(2 * np.pi * f0 * 3.87 * t) + rng.normal(0, 0.4, len(t)) * np.exp(-t * 500)) * np.exp(-t * 55)


def shutter_down(sec=2.0, land=1.05):
    """a roller shutter let go: slats rattling faster and faster, the bottom bar slams at `land` seconds"""
    x = np.zeros(int(sec * SR))
    at = 0.0
    gap = 0.11
    while at < land - 0.02:
        c = clang(rng.uniform(520, 1300)) * rng.uniform(0.25, 0.6) * (0.5 + at / land)
        s = int(at * SR)
        x[s : s + len(c)] += c
        at += gap
        gap = max(0.022, gap * 0.93)
    t = t_(sec)
    rumble = bandpass(rng.normal(0, 1, len(t)), 70, 420) * np.clip(t / land, 0, 1) ** 2 * (t < land) * 0.5
    tl = t_(sec - land)
    slam = (np.sin(2 * np.pi * (62 + 40 * np.exp(-tl * 30)) * tl) * np.exp(-tl * 9) * 2.2 + bandpass(rng.normal(0, 1, len(tl)), 300, 3500) * np.exp(-tl * 26) * 1.2)
    for k in range(5):  # the slats settle after the slam
        c = clang(rng.uniform(600, 1100), 0.12) * 0.5 * np.exp(-k * 0.6)
        s = int((0.03 + k * 0.05) * SR)
        slam[s : s + len(c)] += c
    x[int(land * SR) :] += slam
    return fades(x + rumble, 0.005, 0.1)


def paper_rush(sec=3.0):
    """a heap of tickets pouring out: thousands of small paper flutters, swelling then thinning"""
    t = t_(sec)
    grains = rng.normal(0, 1, len(t)) * np.interp(t, np.arange(0, sec, 0.012), rng.uniform(0.05, 1, len(np.arange(0, sec, 0.012))))
    hiss = bandpass(grains, 1400, 9000)
    body = bandpass(rng.normal(0, 1, len(t)), 180, 900) * 0.25
    return fades((hiss + body) * np.interp(t, [0, 0.25, sec * 0.7, sec], [0.1, 1, 0.8, 0]), 0.03, 0.2)


def ball_drop(sec=0.8):
    """one ball down the chute: quick bounces, then it lands in the tray"""
    x = np.zeros(int(sec * SR))
    at = 0.0
    gap = 0.085
    for k in range(4):
        c = clack(rng.uniform(1500, 2400), 0.05) * (0.3 + k * 0.12)
        s = int(at * SR)
        x[s : s + len(c)] += c
        at += gap
        gap *= 1.2
    tl = t_(0.25)
    land = (np.sin(2 * np.pi * 240 * tl) * np.exp(-tl * 34) + 0.8 * np.sin(2 * np.pi * 1250 * tl) * np.exp(-tl * 70))
    s = int(at * SR)
    x[s : s + len(land)] += land
    return fades(x, 0.002, 0.05)


def balls_fall(sec=1.6):
    """the blower cut: every ball drops to the bottom of the globe at once, then nothing"""
    x = np.zeros(int(sec * SR))
    for _ in range(90):
        at = abs(rng.normal(0.16, 0.14))
        c = clack(rng.uniform(1100, 3000)) * rng.uniform(0.3, 1) * np.exp(-at * 2.2)
        s = int(at * SR)
        if s + len(c) < len(x):
            x[s : s + len(c)] += c
    t = t_(sec)
    air = bandpass(rng.normal(0, 1, len(t)), 200, 1600) * np.exp(-t * 7) * 0.3  # the blower dying
    tl = t_(sec - 0.08)
    x[int(0.08 * SR) :] += np.sin(2 * np.pi * 95 * tl) * np.exp(-tl * 11) * 0.8
    return fades(x + air, 0.002, 0.1)


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
    return {"category": "synth", "title": title, "author": "code", "source": "scripts/make-sfx-lotto.py", "seconds": round(len(x) / SR, 2), "file": f"sfx/synth/{name}.wav"}


if __name__ == "__main__":
    items = [
        write("ball-rattle", ball_rattle(), "Lottery balls tumbling in a globe"),
        write("clock-tick", clock_tick(), "Clock ticking (4 ticks, 0.5 s apart)"),
        write("dot-matrix", dot_matrix(), "Dot-matrix printer burst"),
        write("shutter-down", shutter_down(), "Roller shutter let go, slams at 1.05 s"),
        write("paper-rush", paper_rush(), "A heap of tickets pouring out"),
        write("ball-drop", ball_drop(), "One lottery ball down the chute"),
        write("balls-fall", balls_fall(), "Blower cut: all balls drop at once"),
        write("room-shop", room(120, 1400, 100, 0.35), "Room tone: small shop, strip-light hum"),
        write("room-office", room(50, 500), "Room tone: quiet office"),
        write("room-warehouse", room(60, 2600, 60, 0.25), "Room tone: big warehouse"),
        write("room-chamber", room(180, 3200), "Room tone: large stone hall"),
        write("room-interview", room(90, 900, 120, 0.55), "Room tone: small room, tube-light buzz"),
    ]
    assert all(i["seconds"] > 0 for i in items)
    for i in items:
        i["lufs"] = lufs(ROOT / "public" / i["file"])
    cat_file = ROOT / "public" / "sfx" / "catalog.json"
    cat = json.loads(cat_file.read_text(encoding="utf8"))
    files = {i["file"] for i in items}
    cat = [c for c in cat if c.get("file") not in files] + items
    cat_file.write_text(json.dumps(cat, indent=2) + "\n", encoding="utf8")
    print("wrote", len(items), "files", [(i["file"].split("/")[-1], i["lufs"]) for i in items])
