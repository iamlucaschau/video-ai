"""
Open-ocean texture for "How an Aircraft Carrier Defends Itself" (Test/carrier): deep water with long swell and
fine ripples, top-down, code-made. Covers -400..2320 x -400..1480.
  python -P scripts/make-sea-carrier.py   -> public/images/carrier/sea.jpg
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

W, H = 2720, 1880
rng = np.random.default_rng(21)
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "carrier" / "sea.jpg"


def octave(cw, ch):
    gw, gh = W // cw + 2, H // ch + 2
    grid = rng.random((gh, gw)).astype(np.float32)
    img = Image.fromarray((grid * 255).astype(np.uint8)).resize((gw * cw, gh * ch), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32)[:H, :W] / 255.0


def norm(a):
    a = a - a.min()
    return a / a.max()


depth = norm(octave(520, 520) + 0.5 * octave(220, 220))           # big slow colour patches
swell = norm(octave(260, 40) + 0.6 * octave(120, 22) + 0.4 * octave(60, 12))  # long swell, stretched in x
ripple = norm(octave(14, 6) + 0.6 * octave(6, 4))
deep = np.array([8, 30, 52], np.float32)
mid = np.array([14, 46, 72], np.float32)
col = deep[None, None] * (1 - depth[..., None]) + mid[None, None] * depth[..., None]
col *= (0.5 + 0.85 * swell)[..., None]
col *= (0.93 + 0.12 * ripple)[..., None]
# sparse whitecaps on the swell crests
caps = (swell > 0.8) & (rng.random((H, W)) > 0.985)
col[caps] = col[caps] * 0.3 + np.array([170, 200, 215], np.float32) * 0.7
img = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, quality=88)
print("wrote", OUT)
