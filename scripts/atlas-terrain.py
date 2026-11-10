"""
Close-up parchment plate for style L (Thế Trận) from Terrain Tiles (Mapzen / Tilezen, Terrarium PNG,
AWS Open Data): a real hillshade for the magnifier, where the Blue Marble plates are too soft.

  python -P scripts/atlas-terrain.py <tiles dir> <out dir> <name> <z> <x0> <x1> <y0> <y1> [--ancient lon0,lat0,lon1,lat1,metres]

<tiles dir> holds <z>-<x>-<y>.png. Writes <name>.jpg and merges its bounds into <out dir>/plates.json
(same format as make-plates.py / atlas-plates.py). --ancient also writes <name>-ancient.jpg where land
below `metres` inside the box is drawn as sea: a sketch of an old shoreline before a delta grew
(e.g. Thermopylae, after Kraft et al. 1987), clearly labelled as approximate in the video.
"""
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

LAND = np.array([214, 199, 164], float)  # same palette as atlas-plates.py
SEA = np.array([47, 69, 80], float)
COAST = np.array([92, 78, 58], float)


def merc_y(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


def tile_lat(y, z):
    return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / 2 ** z))))


def render(h, sea):
    # median-filter the sea mask: deltas and salt flats read as speckle at 0 m
    m = Image.fromarray((sea * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(0.8))
    sea_s = np.asarray(m, float) / 255
    gy, gx = np.gradient(h)
    shade = np.clip(1.0 - (gx + gy) / 45, 0.6, 1.2)
    land = LAND[None, None] * shade[..., None]
    img = land * (1 - sea_s[..., None]) + SEA[None, None] * sea_s[..., None]
    edge = np.clip(np.abs(sea_s - np.asarray(m.filter(ImageFilter.GaussianBlur(1.5)), float) / 255) * 6, 0, 1)
    img = img * (1 - edge[..., None] * 0.55) + COAST[None, None] * edge[..., None] * 0.55
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


def main():
    args = sys.argv[1:]
    ancient = None
    if "--ancient" in args:
        i = args.index("--ancient")
        ancient = [float(v) for v in args[i + 1].split(",")]
        del args[i:i + 2]
    tiles, out, name, z, x0, x1, y0, y1 = args
    z, x0, x1, y0, y1 = map(int, (z, x0, x1, y0, y1))
    tiles, out = Path(tiles), Path(out)
    out.mkdir(parents=True, exist_ok=True)
    h = np.zeros(((y1 - y0 + 1) * 256, (x1 - x0 + 1) * 256))
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            a = np.asarray(Image.open(tiles / f"{z}-{x}-{y}.png").convert("RGB"), float)
            h[(y - y0) * 256:(y - y0 + 1) * 256, (x - x0) * 256:(x - x0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    lon0, lon1 = x0 / 2 ** z * 360 - 180, (x1 + 1) / 2 ** z * 360 - 180
    lat_top, lat_bot = tile_lat(y0, z), tile_lat(y1 + 1, z)
    b = {"lon0": lon0, "lon1": lon1, "yTop": merc_y(lat_top), "yBottom": merc_y(lat_bot), "width": h.shape[1], "height": h.shape[0]}
    sea = h <= 0.5
    render(h, sea).save(out / f"{name}.jpg", quality=90)
    if ancient:
        a0, la0, a1, la1, metres = ancient
        lons = lon0 + (np.arange(h.shape[1]) + 0.5) / h.shape[1] * (lon1 - lon0)
        ys = b["yTop"] - (np.arange(h.shape[0]) + 0.5) / h.shape[0] * (b["yTop"] - b["yBottom"])
        lats = np.degrees(2 * np.arctan(np.exp(np.radians(ys))) - math.pi / 2)
        box = (lons[None, :] >= a0) & (lons[None, :] <= a1) & (lats[:, None] >= la0) & (lats[:, None] <= la1)
        render(h, sea | (box & (h < metres))).save(out / f"{name}-ancient.jpg", quality=90)
    pj = out / "plates.json"
    old = json.loads(pj.read_text()) if pj.exists() else {}
    pj.write_text(json.dumps({**old, name: b}, indent=2))
    print(f"{name}: {h.shape[1]}x{h.shape[0]}, lon {lon0:.3f}–{lon1:.3f}, lat {lat_bot:.3f}–{lat_top:.3f}, elev {h.min():.0f}–{h.max():.0f} m")


if __name__ == "__main__":
    main()
