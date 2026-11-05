"""
Code-made SFX for the "How Ambushes Actually Work" episode (Test/ambush), because the Mixkit / Pixabay
library has no realistic automatic-fire bursts, no quadcopter buzz and no short radio squelch (2026-11-05).

  python -I scripts/make-sfx-ambush.py      -> public/sfx/synth/*.wav (+ catalog.json entries, author "code")

numpy only. Gunshots = band-passed noise crack + low body thump + short room tail.
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
rng = np.random.default_rng(7)


def lp(x, a):
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc)
        y[i] = acc
    return y


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)


def shot(dist=0.0):
    n = int(0.35 * SR)
    noise = rng.standard_normal(n)
    crack = (noise - lp(noise, 0.25)) * env(n, 0.0005, 0.012 + dist * 0.02)
    body = lp(noise, 0.05 - dist * 0.03) * env(n, 0.001, 0.05 + dist * 0.05) * 3
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * (90 - 40 * t) * t) * env(n, 0.001, 0.04) * 0.8
    tail = lp(rng.standard_normal(n), 0.02) * env(n, 0.01, 0.12) * 0.6
    s = crack * (1 - dist) + body + thump + tail
    return s


def burst(count, rate, dist=0.0, jitter=0.08):
    gap = 60.0 / rate
    total = int((count * gap + 0.5) * SR)
    out = np.zeros(total)
    for k in range(count):
        at = int((k * gap + rng.uniform(-jitter, jitter) * gap) * SR)
        at = max(0, at)
        s = shot(dist) * rng.uniform(0.8, 1.0)
        out[at : at + len(s)] += s[: total - at]
    return out


def drone(seconds, base=180.0):
    t = np.arange(int(seconds * SR)) / SR
    wob = 1 + 0.03 * np.sin(2 * np.pi * 0.7 * t) + 0.01 * np.sin(2 * np.pi * 3.1 * t)
    sig = np.zeros_like(t)
    for k, (m, a) in enumerate([(1, 1), (2, 0.6), (3, 0.35), (4.02, 0.2), (1.013, 0.8)]):
        sig += a * np.sin(2 * np.pi * base * m * np.cumsum(wob) / SR + k)
    sig += lp(rng.standard_normal(len(t)), 0.3) * 0.4
    fade = np.minimum(1, np.minimum(t / 0.3, (seconds - t) / 0.3))
    return sig * fade


def static(seconds):
    n = int(seconds * SR)
    x = rng.standard_normal(n)
    x = x - lp(x, 0.1)
    crackle = (rng.random(n) > 0.998) * rng.standard_normal(n) * 6
    t = np.arange(n) / SR
    squelch = np.sin(2 * np.pi * 1200 * t) * env(n, 0.002, 0.05) * 0.5
    return (x * 0.6 + crackle) * np.minimum(1, np.minimum(t / 0.01, (seconds - t) / 0.08)) + squelch


def sub_hit(seconds=1.6):
    """Cinematic sub drop for chapter cards: 58 -> 32 Hz glide + a short low click."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    f = 32 + 26 * np.exp(-t / 0.25)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.5)
    click = lp(rng.normal(0, 1, n), 0.08) * np.exp(-t / 0.012) * 0.6
    return body + click


def ear_ring(seconds=2.2):
    """Ringing ears after a blast: a thin high tone that swells and fades, over a fading rumble."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 3700 * t) * np.minimum(1, t / 0.08) * np.exp(-t / 0.9) * 0.35
    rumble = lp(rng.normal(0, 1, n), 0.01) * np.exp(-t / 0.6) * 3.0
    return tone + rumble


def heartbeat(seconds=20.0):
    """Low lub-dub pulse that slowly speeds up (tension under a hold)."""
    n = int(seconds * SR)
    x = np.zeros(n)
    k = int(0.09 * SR)
    tt = np.arange(k * 4) / SR
    thump = np.sin(2 * np.pi * 52 * tt) * np.exp(-tt / 0.08)
    at, gap = 0.1, 0.95
    while at < seconds - 0.6:
        for off, amp in ((0.0, 1.0), (0.2, 0.65)):
            i = int((at + off) * SR)
            j = min(n, i + len(thump))
            x[i:j] += amp * thump[: j - i]
        at += gap
        gap = max(0.62, gap * 0.985)
    return x


def lufs(path):
    """Integrated loudness via ffmpeg ebur128 (Sfx levels every file from this)."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128", "-f", "null", "-"],
                       capture_output=True, text=True)
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
    return {"category": "synth", "title": title, "author": "code", "source": "scripts/make-sfx-ambush.py",
            "seconds": round(len(x) / SR, 2), "file": f"sfx/synth/{name}.wav"}


if __name__ == "__main__":
    items = [
        write("mg-burst-long", burst(14, 650), "Machine gun burst, long"),
        write("mg-burst-short", burst(6, 650), "Machine gun burst, short"),
        write("mg-sustained", np.concatenate([burst(9, 620), np.zeros(int(0.25 * SR)), burst(12, 640), np.zeros(int(0.2 * SR)), burst(8, 600)]), "Machine gun sustained fire"),
        write("rifle-double", burst(2, 300, jitter=0.02), "Rifle double tap"),
        write("rifles-distant", burst(18, 220, dist=0.8, jitter=0.6), "Distant rifle fire"),
        write("drone-buzz", drone(6.0), "Quadcopter drone buzz"),
        write("fpv-dive", drone(2.5, 260) * np.linspace(0.4, 1, int(2.5 * SR)), "FPV drone dive"),
        write("radio-static", static(1.2), "Radio squelch and static"),
        write("sub-hit", sub_hit(), "Sub bass hit (chapter card)"),
        write("ear-ring", ear_ring(), "Ringing ears after a blast"),
        write("heartbeat-low", heartbeat(), "Low heartbeat pulse, speeding up"),
    ]
    for i in items:
        i["lufs"] = lufs(ROOT / "public" / i["file"])
    cat_file = ROOT / "public" / "sfx" / "catalog.json"
    cat = json.loads(cat_file.read_text(encoding="utf8"))
    files = {i["file"] for i in items}
    cat = [c for c in cat if c.get("file") not in files] + items
    cat_file.write_text(json.dumps(cat, indent=2) + "\n", encoding="utf8")
    print("wrote", len(items), "files to", OUT)
