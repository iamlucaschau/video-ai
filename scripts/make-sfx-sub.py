"""
Code-made SFX for "How Submarines Actually Fight" (Formats/Naval Board/episodes/ep02-submarines), for sounds no recording in the library fits because they
have to follow the picture: an uneven engine misfire, a torpedo running, an underwater blast, a ballast blow, a hull touch.
Same rules as make-sfx-carrier.py (no cartoon sounds; each file levelled by Sfx from its measured loudness).
  python -P scripts/make-sfx-sub.py   -> public/sfx/synth/*.wav (+ catalog.json entries, author "code"), then node scripts/sfx-onsets.mjs
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
rng = np.random.default_rng(47)


def lowpass(x, hz):
    """Frequency-domain low-pass, gentle roll-off above hz."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / np.sqrt(1 + (f / hz) ** 4)
    return np.fft.irfft(X, len(x))


def band(x, lo, hi):
    return lowpass(x, hi) - lowpass(x, lo)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def misfire(sec=5.0):
    """A heavy engine that keeps stumbling, heard through water: low thuds at uneven gaps over a dull drone."""
    t = t_(sec)
    x = lowpass(rng.normal(0, 1, len(t)), 90) * 1.2
    pos = 0.1
    gaps = [0.34, 0.18, 0.62, 0.22, 0.46, 0.15, 0.7, 0.28, 0.4, 0.2, 0.58, 0.3]
    i = 0
    while pos < sec - 0.3:
        a = int(pos * SR)
        k = int(0.28 * SR)
        tt = np.arange(min(k, len(x) - a)) / SR
        x[a : a + len(tt)] += np.sin(2 * np.pi * (46 - 30 * tt) * tt) * np.exp(-tt / 0.07) * 7
        pos += gaps[i % len(gaps)]
        i += 1
    return lowpass(x, 240) * np.minimum(1, t / 0.5) * np.minimum(1, (sec - t) / 0.6)


def torpedo_run(sec=4.5):
    """Propeller whine and bubbles rising in pitch as it comes closer."""
    t = t_(sec)
    f = 260 + 340 * (t / sec) ** 2
    whine = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    fizz = band(rng.normal(0, 1, len(t)), 700, 4500) * 1.4
    env = np.minimum(1, t / 0.5) * (0.35 + 0.65 * (t / sec) ** 1.5) * np.minimum(1, (sec - t) / 0.08)
    return (whine * 0.35 + fizz) * env


def under_blast(sec=4.5):
    """An explosion heard underwater: no crack, a huge dull thump and a long low rumble."""
    t = t_(sec)
    n = rng.normal(0, 1, len(t))
    thump = np.sin(2 * np.pi * (58 - 34 * np.minimum(t, 0.6)) * t) * np.exp(-t / 0.35) * 3
    rumble = lowpass(n, 130) * np.exp(-t / 1.4) * 5
    return (thump + rumble) * np.minimum(1, t / 0.006)


def air_blow(sec=3.0):
    """High-pressure air rushing into the tanks: a hard hiss with a bubbling low end."""
    t = t_(sec)
    n = rng.normal(0, 1, len(t))
    hiss = band(n, 900, 7000) * np.minimum(1, t / 0.06) * np.exp(-t / 1.5)
    boil = lowpass(n, 320) * 3 * (0.65 + 0.35 * np.sin(2 * np.pi * 7.3 * t + 3 * np.sin(2 * np.pi * 2.1 * t))) * np.minimum(1, t / 0.2) * np.exp(-t / 1.3)
    return hiss + boil


def hull_touch(sec=4.0):
    """Two hulls meeting at walking pace: a long low steel groan, no bang."""
    t = t_(sec)
    f = 62 + 9 * np.sin(2 * np.pi * 0.7 * t) + 5 * np.sin(2 * np.pi * 2.3 * t)
    x = sum(np.sin(2 * np.pi * np.cumsum(f * k) / SR) / k for k in (1, 2.03, 3.1, 4.4, 6.2))
    scrape = band(rng.normal(0, 1, len(t)), 300, 1500) * 0.5 * (0.5 + 0.5 * np.sin(2 * np.pi * 11 * t))
    return (x + scrape) * np.minimum(1, t / 0.12) * np.exp(-t / 1.6)


def lufs(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True)
    vals = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(vals[-1]) if vals else None


def write(name, x, title):
    assert np.isfinite(x).all() and np.max(np.abs(x)) > 0, name
    x = x / np.max(np.abs(x)) * 0.89
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    return {"category": "synth", "title": title, "author": "code", "source": "scripts/make-sfx-sub.py", "seconds": round(len(x) / SR, 2), "file": f"sfx/synth/{name}.wav"}


if __name__ == "__main__":
    items = [
        write("engine-misfire", misfire(), "Engine misfire heard through water"),
        write("torpedo-run", torpedo_run(), "Torpedo running, closing"),
        write("under-blast", under_blast(), "Explosion heard underwater"),
        write("air-blow", air_blow(), "Ballast tanks blown with high-pressure air"),
        write("hull-touch", hull_touch(), "Two hulls meeting at low speed"),
    ]
    for i in items:
        i["lufs"] = lufs(ROOT / "public" / i["file"])
    cat_file = ROOT / "public" / "sfx" / "catalog.json"
    cat = json.loads(cat_file.read_text(encoding="utf8"))
    files = {i["file"] for i in items}
    cat = [c for c in cat if c.get("file") not in files] + items
    cat_file.write_text(json.dumps(cat, indent=2) + "\n", encoding="utf8")
    print("wrote", [(i["file"].split("/")[-1], i["lufs"]) for i in items])
