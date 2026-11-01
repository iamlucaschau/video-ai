"""
On-screen text of a reference video (Studio ingest, KHA-THI §3: rapidocr, Lucas approved 2026-11-01).

  python -P scripts/ocr.py <video> <out.json> [every_s]   (default: one frame per second)

Writes {"width": 1080, "frames": [{"t": s, "items": [{"text", "x", "y", "w", "h", "score"}]}]} with boxes
scaled to a 1080-wide canvas, so heights read as px on the 1080 frame (our ≥ 48 px rule) and x / y as the
safe zone (x 60–940, y 220–1440 on 1080×1920). Frames are cut with ffmpeg into a temp folder.
Needs: pip install rapidocr-onnxruntime.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from rapidocr_onnxruntime import RapidOCR

src, out = sys.argv[1], sys.argv[2]
every = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
W = 1080  # canvas width the boxes are scaled to
SCAN = 720  # frames are read at this width (small labels survive, OCR stays fast)

engine = RapidOCR()
frames = []
with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", src, "-vf", f"fps=1/{every},scale={SCAN}:-2", str(Path(tmp) / "f%05d.png")],
        check=True,
    )
    for i, f in enumerate(sorted(Path(tmp).glob("f*.png"))):
        result, _ = engine(str(f))
        items = []
        for box, text, score in result or []:
            xs = [p[0] * W / SCAN for p in box]
            ys = [p[1] * W / SCAN for p in box]
            items.append({"text": text, "x": round(min(xs)), "y": round(min(ys)), "w": round(max(xs) - min(xs)), "h": round(max(ys) - min(ys)), "score": round(float(score), 3)})
        # ffmpeg's fps filter samples the middle of each interval
        frames.append({"t": round((i + 0.5) * every, 2), "items": items})
with open(out, "w", encoding="utf-8") as fh:
    json.dump({"width": W, "frames": frames}, fh, ensure_ascii=False, indent=1)
print(f"{len(frames)} frames, {sum(len(f['items']) for f in frames)} text boxes -> {out}")
