"""
Ground texture for "How Ambushes Actually Work" (Test/ambush): grass / dirt / moss in top-down view, code-made
(no licence questions). Covers the Terrain rect (-400..2320 x -400..1480) at 1 px per unit.

  python -P scripts/make-ground-ambush.py   -> public/images/ambush/ground.jpg
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 2720, 1880
rng = np.random.default_rng(11)
OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "ambush" / "ground.jpg"


def octave(cell):
    """Smooth value noise: random grid of size cell, bilinear-upscaled to W x H."""
    gw, gh = W // cell + 2, H // cell + 2
    grid = rng.random((gh, gw)).astype(np.float32)
    img = Image.fromarray((grid * 255).astype(np.uint8)).resize((gw * cell, gh * cell), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32)[:H, :W] / 255.0


def fbm(cells, weights):
    n = sum(w * octave(c) for c, w in zip(cells, weights))
    n -= n.min()
    return n / n.max()


base = fbm([420, 180, 70, 24, 8], [1.0, 0.6, 0.35, 0.22, 0.12])  # large patches → fine grain
dirt = fbm([300, 90, 30], [1.0, 0.5, 0.25])
grain = rng.random((H, W)).astype(np.float32)

grass_dark = np.array([26, 36, 20], np.float32)
grass_lite = np.array([74, 90, 48], np.float32)
moss = np.array([52, 70, 34], np.float32)
soil = np.array([92, 78, 54], np.float32)

col = grass_dark[None, None] * (1 - base[..., None]) + grass_lite[None, None] * base[..., None]
m = np.clip((base - 0.5) * 3, 0, 1)[..., None]
col = col * (1 - m * 0.5) + moss[None, None] * m * 0.5
d = np.clip((dirt - 0.62) * 3.5, 0, 1)[..., None]  # scattered bare-soil patches
col = col * (1 - d * 0.75) + soil[None, None] * d * 0.75
col *= (0.78 + 0.44 * grain)[..., None]  # grass speckle

img = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8))
# grass clumps and pebbles: many small soft blobs, darker and lighter than the ground
layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dr = ImageDraw.Draw(layer)
for _ in range(70000):
    x, y = rng.integers(0, W), rng.integers(0, H)
    r = rng.uniform(1, 4.5)
    if rng.random() < 0.6:
        c = (14, 22, 10, int(rng.uniform(40, 100)))  # dark clump
    else:
        c = (100, 118, 62, int(rng.uniform(30, 80)))  # sunlit tuft
    dr.ellipse([x - r, y - r * 0.8, x + r, y + r * 0.8], fill=c)
for _ in range(900):
    x, y = rng.integers(0, W), rng.integers(0, H)
    r = rng.uniform(1, 2.2)
    dr.ellipse([x - r, y - r, x + r, y + r], fill=(150, 142, 120, 150))  # pebbles
layer = layer.filter(ImageFilter.GaussianBlur(0.8))
img = Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")
col = np.asarray(img, dtype=np.float32)
OUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).save(OUT, quality=88)
print("wrote", OUT)
