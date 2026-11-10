"""
Parchment map plates for style L (Thế Trận), made from existing style J satellite plates
(NASA Blue Marble, public domain): land turns beige with a relief shading, sea a dark slate,
and each faction becomes a transparent overlay that only colours land (coasts stay exact).

  python -P scripts/atlas-plates.py <J plates dir> <out dir> <factions.json> name ...

<J plates dir> holds <name>.jpg + plates.json (from make-plates.py). <factions.json>:
  { "persia": { "color": "#C2553A", "rings": [[[lon, lat], ...], ...] }, ... }
Rings are drawn by hand after academic maps (Bible §8 / D8: OpenHistoricalMap first, else hand-drawn);
they may run over the sea, the land mask clips them.

Writes per plate: <name>.jpg (parchment) and <name>-<faction>.png (RGBA overlay: fill + border),
and copies the plate bounds into <out dir>/plates.json, so <AtlasMap> places them like <SatMap>.
"""
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

Image.MAX_IMAGE_PIXELS = None

LAND = np.array([214, 199, 164], float)  # parchment
SEA = np.array([47, 69, 80], float)  # slate
COAST = np.array([92, 78, 58], float)


def merc_y(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


def blur(a, r):
    # 8-bit is enough: inputs are 0..255 luminance / masks (Pillow can't blur float images)
    return np.asarray(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), float)


def wobble(ring, step=0.2, amp=0.12):
    """Hand-drawn borders are straight lines between a few points: densify and bend them a little
    (smooth, deterministic) so inland frontiers read like a map, not a ruler. Vertices stay put."""
    out = []
    for (x0, y0), (x1, y1) in zip(ring, ring[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / step))
        nx, ny = -(y1 - y0), x1 - x0
        ln = math.hypot(nx, ny) or 1
        for i in range(n):
            t = i / n
            k = amp * math.sin(math.pi * t) * (math.sin(1.9 * (x0 + t * (x1 - x0))) + 0.6 * math.sin(2.7 * (y0 + t * (y1 - y0))))
            out.append((x0 + t * (x1 - x0) + k * nx / ln, y0 + t * (y1 - y0) + k * ny / ln))
    return out + [ring[-1]]


def hexrgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def main():
    src, out, factions_path, *names = sys.argv[1:]
    src, out = Path(src), Path(out)
    out.mkdir(parents=True, exist_ok=True)
    bounds = json.loads((src / "plates.json").read_text())
    factions = json.loads(Path(factions_path).read_text(encoding="utf-8"))
    merged = {}
    for name in names:
        b = bounds[name]
        rgb = np.asarray(Image.open(src / f"{name}.jpg").convert("RGB"), float)
        h, w, _ = rgb.shape
        r, g, bl = rgb[..., 0], rgb[..., 1], rgb[..., 2]
        # Blue Marble sea is blue-dominant (deep navy to shallow cyan); land is red >= blue (sand, green, rock, snow)
        sea = (bl > r + 12) & (bl >= g * 0.9)
        land = blur((~sea).astype(float) * 255, 0.8) / 255  # soft 1 px edge

        # relief: local contrast of the luminance, lit from the north-west
        lum = rgb @ [0.3, 0.59, 0.11]
        s = max(1.0, w / 3000 * 2)
        # Blue Marble luminance also carries vegetation texture: smooth it first so only landforms survive
        base = blur(lum, 2.5 * s)
        fine = base - blur(base, 10 * s)
        gy, gx = np.gradient(base)
        shade = np.clip(1 + fine / 420 - (gx + gy) / (14 * s), 0.7, 1.18)
        land_rgb = LAND[None, None] * shade[..., None]
        depth = np.clip((bl - 40) / 120, 0, 1)  # shallow water a touch lighter
        sea_rgb = SEA[None, None] * (0.92 + 0.25 * depth[..., None])
        img = land_rgb * land[..., None] + sea_rgb * (1 - land[..., None])
        # thin dark coastline
        edge = np.clip(np.abs(land - blur(land * 255, 1.2 * s) / 255) * 6, 0, 1)
        img = img * (1 - edge[..., None] * 0.55) + COAST[None, None] * edge[..., None] * 0.55
        Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(out / f"{name}.jpg", quality=90)

        def px(lon, lat):
            return ((lon - b["lon0"]) / (b["lon1"] - b["lon0"]) * w, (b["yTop"] - merc_y(lat)) / (b["yTop"] - b["yBottom"]) * h)

        for fid, fac in factions.items():
            mask = Image.new("L", (w, h), 0)
            d = ImageDraw.Draw(mask)
            for ring in fac["rings"]:
                d.polygon([px(lon, lat) for lon, lat in wobble(ring)], fill=255)
            m = np.asarray(mask, float) / 255 * land
            inner = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(int(2 * round(1.5 * s)) + 1)), float) / 255
            border = np.clip(m - inner, 0, 1)
            col = hexrgb(fac["color"])
            rgba = np.zeros((h, w, 4), float)
            rgba[..., :3] = col * (1 - border[..., None]) + col * 0.55 * border[..., None]
            rgba[..., 3] = m * 0.5 * 255 + border * 0.45 * 255
            Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA").save(out / f"{name}-{fid}.png", optimize=True)
        merged[name] = b
        print(f"{name}: {w}x{h}, land {(~sea).mean():.0%}, factions {', '.join(factions)}")
    pj = out / "plates.json"
    old = json.loads(pj.read_text()) if pj.exists() else {}
    pj.write_text(json.dumps({**old, **merged}, indent=2))


if __name__ == "__main__":
    main()
