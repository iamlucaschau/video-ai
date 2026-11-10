#!/usr/bin/env python3
"""Side-by-side sheet: our frames over the reference channel's frames (claude-animated-shorts N11, adapted).

    python -P scripts/sbs-sheet.py <ours.mp4> <reference.mp4 or folder of .jpg/.png> [--n 6] [--out out/sheets/sbs.jpg]

Takes n frames evenly spread through each (skipping the first and last 5 %), scales them to 270x480 and tiles ours on the
top row, the reference below, with a label. Look at it when scoring the 7 areas (review-loop skill, "Score by area").
Reference videos and frames are third-party: they stay git-ignored (Test/<channel>/_work/), never in a render.
"""
import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw

TW, TH = 270, 480


def duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True)
    return float(r.stdout.strip())


def grab(path, n, tmp, tag):
    if os.path.isdir(path):
        files = sorted(f for f in os.listdir(path) if f.lower().endswith((".jpg", ".png")))
        pick = [files[round(i * (len(files) - 1) / max(1, n - 1))] for i in range(n)] if files else []
        return [Image.open(os.path.join(path, f)).convert("RGB") for f in pick]
    d = duration(path)
    out = []
    for i in range(n):
        ts = d * (0.05 + 0.9 * i / max(1, n - 1))
        p = os.path.join(tmp, f"{tag}{i}.png")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ts:.2f}", "-i", path, "-frames:v", "1", p], check=True)
        out.append(Image.open(p).convert("RGB"))
    return out


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 1
    n = int(argv[argv.index("--n") + 1]) if "--n" in argv else 6
    out = argv[argv.index("--out") + 1] if "--out" in argv else "out/sheets/sbs.jpg"
    with tempfile.TemporaryDirectory() as tmp:
        rows = [grab(argv[0], n, tmp, "o"), grab(argv[1], n, tmp, "r")]
        sheet = Image.new("RGB", (TW * n, TH * 2 + 40), "#222")
        draw = ImageDraw.Draw(sheet)
        for r, (label, imgs) in enumerate(zip(["OURS", "REFERENCE"], rows)):
            for i, im in enumerate(imgs):
                sheet.paste(im.resize((TW, TH)), (i * TW, r * (TH + 40) + (40 if r else 0)))
            draw.text((8, 8 if r == 0 else TH + 12), label, fill="#fff")
        os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
        sheet.save(out, quality=88)
    print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
