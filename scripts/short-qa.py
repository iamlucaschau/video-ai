#!/usr/bin/env python3
"""Frame-by-frame QA of a rendered short (claude-animated-shorts N10, adapted; Lucas approved 2026-11-04).

    python -P scripts/short-qa.py <video.mp4> [--shots <shots.timeline.json>] [--out <QA.md>]
    python -P scripts/short-qa.py --selftest

Reads every frame at 135x240 grey and reports, by time:
- black frames (mean < 10) and white frames (mean > 245): a white flash after the hook is fine, anything else is not;
- frozen spans of 12 frames or more (consecutive frames almost identical), the loop's last frame excepted;
- pops: one frame that jumps much more than its neighbours and is not a planned cut (shots.timeline.json `from`),
  e.g. a character going from standing to lying in a single frame;
- loudness (integrated LUFS, true peak) from ffmpeg ebur128.
"""
import json
import re
import subprocess
import sys

import numpy as np

W, H = 135, 240


def frames(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.int16)


def spans(mask, min_len=1):
    out, start = [], None
    for i, m in enumerate(list(mask) + [False]):
        if m and start is None:
            start = i
        if not m and start is not None:
            if i - start >= min_len:
                out.append((start, i - 1))
            start = None
    return out


def analyse(fr, cuts, fps=30):
    mean = fr.reshape(len(fr), -1).mean(axis=1)
    diff = np.abs(np.diff(fr, axis=0)).reshape(len(fr) - 1, -1).mean(axis=1)  # diff[i] = frame i+1 vs i
    black = spans(mean < 10)
    white = spans(mean > 245)
    # diff span (a, b) = frames a..b+1 alike; 11 diffs = 12 frames; the loop's last frame is meant to repeat frame 0
    frozen = [(a, b + 1) for a, b in spans(diff < 0.25, 11) if b + 1 < len(fr) - 1]
    near_cut = set()
    for c in cuts:
        near_cut.update(range(c - 2, c + 3))
    pops = []
    for i in range(1, len(diff) - 1):
        f = i + 1  # diff[i] is frame f against frame f - 1
        if f in near_cut:
            continue
        local = np.median(diff[max(0, i - 6): i + 7])
        # a jump: one big change between quiet frames (standing to lying in one frame)
        jump = diff[i] > max(6.0, 5 * local) and diff[i] > 3 * max(diff[i - 1], diff[i + 1])
        # a glitch: one frame unlike both neighbours, which are alike
        skip = float(np.abs(fr[f + 1] - fr[f - 1]).mean()) if f + 1 < len(fr) else 1e9
        glitch = min(diff[i], diff[i + 1]) > 6.0 and skip < 0.5 * min(diff[i], diff[i + 1])
        if jump or glitch:
            pops.append((f, round(float(diff[i]), 1)))
    return {"frames": len(fr), "black": black, "white": white, "frozen": frozen, "pops": pops, "fps": fps}


def loudness(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    i = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
    return (float(i[-1]) if i else None, float(tp[-1]) if tp else None)


def report(path, res, loud):
    t = lambda f: f"{f / res['fps']:.2f} s (f{f})"
    rng = lambda s: f"{t(s[0])} → {t(s[1])}"
    L = [f"# QA — {path}", "", f"{res['frames']} frames · {res['frames'] / res['fps']:.1f} s", ""]
    L.append(f"- **Độ to:** {loud[0]} LUFS, true peak {loud[1]} dBTP (luật −14 ±1, ≤ −1,5)")
    L.append(f"- **Khung đen:** {', '.join(rng(s) for s in res['black']) or 'không'}")
    L.append(f"- **Khung trắng:** {', '.join(rng(s) for s in res['white']) or 'không'} (chớp trắng sau hook thì được)")
    L.append(f"- **Đứng hình ≥ 12 frame:** {', '.join(rng(s) for s in res['frozen']) or 'không'}")
    L.append(f"- **Nhảy hình (1 frame đổi đột ngột, không phải điểm cắt):** {', '.join(f'{t(f)} Δ{d}' for f, d in res['pops']) or 'không'}")
    return "\n".join(L) + "\n"


def selftest():
    rng = np.random.default_rng(1)
    n = 90
    base = rng.integers(40, 200, (H, W)).astype(np.int16)
    fr = np.stack([np.clip(base + (k % 3), 0, 255) for k in range(n)])  # tiny motion everywhere
    fr[10:13] = 0  # black
    fr[30:50] = fr[30]  # frozen 20 frames
    fr[60] = 255 - fr[60]  # a one-frame pop
    fr[61:] = np.clip(fr[61:] + 1, 0, 255)
    res = analyse(fr, cuts=[])
    assert res["black"] == [(10, 12)], res["black"]
    assert any(a <= 31 and b >= 49 for a, b in res["frozen"]), res["frozen"]
    assert any(f == 60 for f, _ in res["pops"]), res["pops"]
    res2 = analyse(fr, cuts=[60])
    assert not any(f == 60 for f, _ in res2["pops"]), "a planned cut is not a pop"
    print("selftest ok")


def main(argv):
    if "--selftest" in argv:
        return selftest()
    if not argv:
        print(__doc__)
        return 1
    path = argv[0]
    cuts = []
    if "--shots" in argv:
        cuts = [s["from"] for s in json.load(open(argv[argv.index("--shots") + 1], encoding="utf8"))]
    res = analyse(frames(path), cuts)
    md = report(path, res, loudness(path))
    if "--out" in argv:
        open(argv[argv.index("--out") + 1], "w", encoding="utf8").write(md)
    sys.stdout.buffer.write(md.encode("utf8"))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]) or 0)
