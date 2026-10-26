"""
Satellite map plates for style J (Satellite Journey): cuts NASA Blue Marble Next Generation
imagery (public domain) to Web Mercator and grades it (more contrast, sea pushed to a dark navy).

  python -P scripts/make-plates.py <source.jpg> <out dir> name:lon0:lon1:lat0:lat1:pxPerDeg ...

<source.jpg> is either a 21600x21600 tile (e.g. world.topo.bathy.200407.3x21600x21600.C1.jpg; the
tile's own extent is given with --tile LON0:LAT_TOP, C1 = 0:90) or the 5400x2700 world image
(--world). Downloads (Earth Observatory, record 73751 = July 2004, topography + bathymetry):
  https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x21600x21600.C1.jpg
  https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x5400x2700.jpg
Keep the source files out of the repo; commit only the plates.

Writes <name>.jpg per plate and merges their bounds (lon, Mercator-Y degrees) into
<out dir>/plates.json, which the kit's <SatMap> reads. Plate order in the video: coarse first,
finest last (e.g. world 15 px/deg → region 60 → detail 240).
"""
import argparse
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance

Image.MAX_IMAGE_PIXELS = None


def merc_y(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


ap = argparse.ArgumentParser()
ap.add_argument("source")
ap.add_argument("out")
ap.add_argument("plates", nargs="+")
ap.add_argument("--tile", default="0:90", help="LON0:LAT_TOP of a 90x90 deg tile (default C1)")
ap.add_argument("--world", action="store_true", help="source is the 360x180 deg world image")
args = ap.parse_args()

out = Path(args.out)
out.mkdir(parents=True, exist_ok=True)
meta_file = out / "plates.json"
meta = json.loads(meta_file.read_text()) if meta_file.exists() else {}

if args.world:
    src_lon0, src_lat_top, span_lon = -180.0, 90.0, 360.0
else:
    src_lon0, src_lat_top = map(float, args.tile.split(":"))
    span_lon = 90.0

cache = {}


def source(ppd_wanted):
    """Source image (and its px/deg), using JPEG DCT downscaling when far fewer pixels are needed."""
    img = Image.open(args.source)
    native = img.size[0] / span_lon
    reduce = 1
    while reduce < 8 and native / (reduce * 2) >= ppd_wanted:
        reduce *= 2
    if reduce not in cache:
        if reduce > 1:
            img.draft("RGB", (img.size[0] // reduce, img.size[1] // reduce))
        cache[reduce] = img.convert("RGB")
    im = cache[reduce]
    return im, im.size[0] / span_lon


for spec in args.plates:
    name, lon0, lon1, lat0, lat1, ppd = spec.split(":")
    lon0, lon1, lat0, lat1, ppd = map(float, (lon0, lon1, lat0, lat1, ppd))
    img, sppd = source(ppd)
    x0, x1 = round((lon0 - src_lon0) * sppd), round((lon1 - src_lon0) * sppd)
    r0 = max(0, math.floor((src_lat_top - lat1) * sppd) - 2)
    r1 = min(img.size[1], math.ceil((src_lat_top - lat0) * sppd) + 2)
    band = np.asarray(img.crop((x0, r0, x1, r1))).astype(np.float32)
    ytop, ybot = merc_y(lat1), merc_y(lat0)
    w, h = round((lon1 - lon0) * ppd), round((ytop - ybot) * ppd)
    ys = ytop - (np.arange(h) + 0.5) / ppd
    rows = (src_lat_top - np.degrees(np.arctan(np.sinh(np.radians(ys))))) * sppd - r0 - 0.5
    i0 = np.clip(np.floor(rows).astype(int), 0, band.shape[0] - 2)
    t = (rows - i0)[:, None, None]
    plate = Image.fromarray(np.clip(band[i0] * (1 - t) + band[i0 + 1] * t, 0, 255).astype(np.uint8))
    if plate.size != (w, h):
        plate = plate.resize((w, h), Image.LANCZOS)
    plate = ImageEnhance.Contrast(plate).enhance(1.12)
    a = np.asarray(plate).astype(np.float32) / 255
    # soft water mask (blue clearly above red/green), then push water to a dark navy
    water = np.clip((a[..., 2] - np.maximum(a[..., 0], a[..., 1]) - 0.03) / 0.10, 0, 1)[..., None]
    a = a * (1 - water) + a * np.array([0.42, 0.50, 0.50], dtype=np.float32) * water
    Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).save(out / f"{name}.jpg", quality=88)
    meta[name] = {"lon0": lon0, "lon1": lon1, "yTop": ytop, "yBottom": ybot, "width": w, "height": h}
    print(name, (w, h))

meta_file.write_text(json.dumps(meta, indent=2), encoding="utf-8")
