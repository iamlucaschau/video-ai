"""
Style O (Data Loop): one year of a species' migration from real sightings (GBIF, mostly eBird), drawn as
simulated birds on a dark relief globe. Lucas approved 2026-11-09 (Test/Mapped Earth/BAO-CAO.md, D1–D8).

  python -P scripts/data-loop.py fetch   <slug>   GBIF sightings → out/data-loop/<slug>/records.csv + meta.json
  python -P scripts/data-loop.py terrain <slug>   Terrain Tiles (AWS Open Data) → public/data-loop/<slug>/base.png
  python -P scripts/data-loop.py flock   <slug>   sightings → simulated flock → public/data-loop/<slug>/flock.bin + flock.json
  python -P scripts/data-loop.py selftest

How the flock is made (say so on screen: "simulated birds, from sightings"):
  1. Sightings are binned on a 0.5° grid for each of 52 weeks (Gaussian over day of year, sigma 10 days, circular),
     then blurred (sigma 2 cells). Observer effort is NOT corrected: bright = many reports, like the reference.
  2. Each bird i keeps two fixed quantiles (u_i, v_i). Every week it sits where the longitude CDF reaches u_i and,
     on that meridian, where the latitude CDF reaches v_i (Knothe–Rosenblatt map). The map is monotone, so the
     flock keeps its order and flows instead of teleporting.
  3. Weekly positions → daily by periodic Catmull-Rom, projected (orthographic) to 1080×1920 pixels.
  4. Frame → day: time runs slower when the flock moves (dt ∝ movement + floor); the loop opens 12 days before the
     busiest southward day, so frame 0 already flows.
GBIF search API only (no account): every page of every year × month cell (offsets stay < 10,000 there).
numpy + Pillow only.
"""
import io
import json
import math
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
sys.stdout.reconfigure(encoding="utf-8")  # arrows in messages on a cp1252 console
W, H, FPS, SECONDS = 1080, 1920, 30, 30

SPECIES = {
    # Bách thanh mày trắng: breeds Siberia / NE China / Korea / Japan, winters India to the Philippines and Indonesia
    "brown-shrike": {
        "taxon": 2492846, "common": "Brown Shrike", "sci": "Lanius cristatus",
        "bbox": [60, -15, 160, 72],  # lon0, lat0, lon1, lat1 kept from GBIF
        "years": "2016,2025",
        # orthographic on a canvas bigger than the frame: lon0, lat0, radius px, globe centre px, canvas px;
        # the 1080×1920 frame slides over it after the flock (D5), keeping the flock's middle at `focus` in the frame
        "center": [110, 27], "R": 1060, "cx": 750, "cy": 1180, "canvas": [1500, 2600], "focus": [560, 680],
        "birds": 8000,
    },
}


def cfg(slug):
    if slug not in SPECIES:
        sys.exit(f"unknown slug {slug}; known: {', '.join(SPECIES)}")
    return SPECIES[slug]


def get_json(url, tries=3):
    for k in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "video-ai-data-loop/1.0"}), timeout=60) as r:
                return json.load(r)
        except Exception as e:  # network hiccup: retry, then give up loudly
            if k == tries - 1:
                raise
            print(f"  retry {k + 1}: {e}")
            time.sleep(3 * (k + 1))


# ---------- fetch

def fetch(slug, workers=4):
    """Every record, no account: page through each year × month cell (each holds < 10,000 records, where search-API
    offsets stay fast; one big query paged to offset 45,000 stalled for minutes). 4 requests in parallel."""
    from concurrent.futures import ThreadPoolExecutor
    c = cfg(slug)
    out = ROOT / "out" / "data-loop" / slug
    out.mkdir(parents=True, exist_ok=True)
    lon0, lat0, lon1, lat1 = c["bbox"]
    poly = f"POLYGON(({lon0} {lat0},{lon1} {lat0},{lon1} {lat1},{lon0} {lat1},{lon0} {lat0}))"
    base = {"taxonKey": c["taxon"], "hasCoordinate": "true", "hasGeospatialIssue": "false", "occurrenceStatus": "PRESENT",
            "year": c["years"], "geometry": poly}
    y0, y1 = map(int, c["years"].split(","))
    url = lambda y, m, off: "https://api.gbif.org/v1/occurrence/search?" + urllib.parse.urlencode(dict(base, year=y, month=m, limit=300, offset=off))

    def page(job):
        y, m, off = job
        try:
            return job, get_json(url(y, m, off))
        except Exception as e:  # one slow page must not sink the run: note it and go on
            print(f"  skip {y}-{m:02d} @{off}: {e}", flush=True)
            return job, None

    rows, datasets, counts, missed = [], {}, {}, []

    def take(job, d):
        if d is None:
            missed.append("{}-{:02d}@{}".format(*job))
            return
        for r in d["results"]:
            if r.get("decimalLatitude") is None:
                continue
            rows.append((r["decimalLatitude"], r["decimalLongitude"], job[1], r.get("day") or 15, r.get("year") or job[0]))
            datasets[r.get("datasetKey")] = datasets.get(r.get("datasetKey"), 0) + 1

    with ThreadPoolExecutor(workers) as pool:
        for m in range(1, 13):
            first = list(pool.map(page, [(y, m, 0) for y in range(y0, y1 + 1)]))
            rest = []
            for job, d in first:
                take(job, d)
                if d is not None:
                    counts[m] = counts.get(m, 0) + d["count"]
                    rest += [(job[0], m, off) for off in range(300, min(d["count"], 9900), 300)]
            for job, d in pool.map(page, rest):
                take(job, d)
            print(f"month {m:2d}: {counts.get(m, 0):6d} records, have {len(rows)} rows so far", flush=True)
    with open(out / "records.csv", "w", encoding="utf-8") as f:
        f.write("lat,lon,month,day,year\n")
        for r in rows:
            f.write(",".join(str(x) for x in r) + "\n")
    meta = {"slug": slug, "taxonKey": c["taxon"], "query": base, "fetched": time.strftime("%Y-%m-%d"), "monthCounts": counts,
            "sampled": len(rows), "missedCells": missed, "datasets": dict(sorted(datasets.items(), key=lambda kv: -kv[1])),
            "cite": f"GBIF.org ({time.strftime('%Y')}) GBIF Occurrence Search, taxonKey {c['taxon']}, {c['years']}, accessed {time.strftime('%Y-%m-%d')}"}
    (out / "meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"→ {out / 'records.csv'} ({len(rows)} rows, {len(datasets)} datasets)")


# ---------- projection (orthographic, same formulas as d3.geoOrthographic)

def project(c, lon, lat):
    l0, p0 = map(math.radians, c["center"])
    lam, phi = np.radians(lon) - l0, np.radians(lat)
    x = np.cos(phi) * np.sin(lam)
    y = math.cos(p0) * np.sin(phi) - math.sin(p0) * np.cos(phi) * np.cos(lam)
    vis = math.sin(p0) * np.sin(phi) + math.cos(p0) * np.cos(phi) * np.cos(lam) > 0
    return c["cx"] + c["R"] * x, c["cy"] - c["R"] * y, vis


def unproject(c, px, py):
    l0, p0 = map(math.radians, c["center"])
    x, y = (px - c["cx"]) / c["R"], (c["cy"] - py) / c["R"]
    rho = np.sqrt(x * x + y * y)
    ok = rho <= 1
    cz = np.sqrt(np.clip(1 - rho * rho, 0, 1))  # cos of the angular distance from the centre
    lat = np.arcsin(np.clip(cz * math.sin(p0) + y * math.cos(p0), -1, 1))
    lon = l0 + np.arctan2(x, cz * math.cos(p0) - y * math.sin(p0))
    return np.degrees(lon), np.degrees(lat), ok


# ---------- terrain

TILE = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
SEA, LAND_LO, LAND_HI = np.array([3, 11, 22.]), np.array([24, 32, 50.]), np.array([62, 72, 96.])


def terrain(slug, z=5):
    c = cfg(slug)
    cache = ROOT / "out" / "data-loop" / "tiles"
    cache.mkdir(parents=True, exist_ok=True)
    cw, ch = c["canvas"]
    gy, gx = np.mgrid[0:ch, 0:cw].astype(float)
    lon, lat, ok = unproject(c, gx + 0.5, gy + 0.5)
    n = 2 ** z
    tx = (lon + 180) / 360 * n
    ty = (1 - np.log(np.tan(np.radians(np.clip(lat, -85, 85))) + 1 / np.cos(np.radians(np.clip(lat, -85, 85)))) / math.pi) / 2 * n
    need = {(int(a) % n, int(b)) for a, b in zip(tx[ok].ravel()[::7], ty[ok].ravel()[::7])}
    elev = np.zeros((ch, cw))
    for (x, y) in sorted(need):
        f = cache / f"{z}-{x}-{y}.png"
        if not f.exists():
            with urllib.request.urlopen(TILE.format(z=z, x=x, y=y), timeout=60) as r:
                f.write_bytes(r.read())
        a = np.asarray(Image.open(f).convert("RGB"), float)
        e = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
        m = ok & (tx.astype(int) % n == x) & (ty.astype(int) == y)
        px = np.clip(((tx[m] % 1) * 256).astype(int), 0, 255)
        py = np.clip(((ty[m] % 1) * 256).astype(int), 0, 255)
        elev[m] = e[py, px]
    print(f"{len(need)} tiles")
    # hillshade, sun from the north-west, on pixel slopes (vertical exaggeration tuned by eye)
    dzdx = np.gradient(elev, axis=1) / 900
    dzdy = np.gradient(elev, axis=0) / 900
    shade = np.clip(((-dzdx + dzdy) * 0.7 + 1) / 2, 0, 1)  # 0.5 = flat
    land = (elev > 0) & ok
    k = np.clip(np.where(land, 0.25 + 0.9 * (shade - 0.5) + np.clip(elev / 6000, 0, 0.35), 0), 0, 1)[..., None]
    rgb = np.where(land[..., None], LAND_LO + (LAND_HI - LAND_LO) * k, SEA)
    sea_depth = np.clip(-elev / 6000, 0, 1)[..., None]
    rgb = np.where((~land & ok)[..., None], SEA + np.array([6, 12, 20.]) * (1 - sea_depth), rgb)
    rgb = np.where(ok[..., None], rgb, np.array([1, 4, 9.]))  # beyond the globe's edge
    out = ROOT / "public" / "data-loop" / slug
    out.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).save(out / "base.png", optimize=True)
    print(f"→ {out / 'base.png'}")


# ---------- flock

GRID = 0.5


def blur(a, s):
    """Separable Gaussian blur on the last two axes (numpy only)."""
    r = int(3 * s) + 1
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / s) ** 2)
    k /= k.sum()
    for ax in (-2, -1):
        a = np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), ax, a)
    return a


def weekly_density(c, rec):
    lon0, lat0, lon1, lat1 = c["bbox"]
    nx, ny = int((lon1 - lon0) / GRID), int((lat1 - lat0) / GRID)
    doy = np.array([(m - 1) * 30.44 + d for m, d in zip(rec[:, 2], rec[:, 3])])
    D = np.zeros((52, ny, nx))
    for w in range(52):
        dd = np.abs(doy - (w * 7 + 3.5))
        dd = np.minimum(dd, 365 - dd)
        wt = np.exp(-0.5 * (dd / 10) ** 2)  # 10 days: with 6 the weekly density flickered and summer birds hatched N–S
        h, _, _ = np.histogram2d(rec[:, 0], rec[:, 1], bins=[ny, nx], range=[[lat0, lat1], [lon0, lon1]], weights=wt)
        D[w] = h
    D = blur(D, 2.0) + 1e-9
    return D / D.sum(axis=(1, 2), keepdims=True)


def knothe(Dw, u, v, lat0, lon0):
    """Where each bird's fixed quantiles (u, v) fall in density Dw: (first-axis coord, second-axis coord), rows first."""
    ny, nx = Dw.shape
    row = Dw.sum(axis=1)
    cdf = np.concatenate([[0], np.cumsum(row)])
    cdf /= cdf[-1]
    yi = np.interp(u, cdf, np.arange(ny + 1))  # fractional row
    r0 = np.clip(np.floor(yi).astype(int), 0, ny - 1)
    out_lon = np.empty_like(u)
    rows = Dw / Dw.sum(axis=1, keepdims=True)
    ccdf = np.concatenate([np.zeros((ny, 1)), np.cumsum(rows, axis=1)], axis=1)
    for r in np.unique(r0):
        m = r0 == r
        out_lon[m] = np.interp(v[m], ccdf[r], np.arange(nx + 1))
    return lat0 + yi * GRID, lon0 + out_lon * GRID


def catmull_daily(P):
    """P: (52, N) periodic weekly values → (365, N) daily values."""
    out = np.empty((365, P.shape[1]))
    for d in range(365):
        t = (d - 3.5) / 7
        i = int(math.floor(t))
        f = t - i
        p0, p1, p2, p3 = (P[(i + k) % 52] for k in (-1, 0, 1, 2))
        out[d] = 0.5 * (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f ** 3)
    return out


def frame_days(move, frames, start, floor=0.25):
    """Day (float, 0–365) shown at each frame from day `start`: more frames where the flock moves (dt ∝ move + floor)."""
    a = move / move.mean()
    w = np.roll(a + floor, -start)
    cum = np.concatenate([[0], np.cumsum(w)])
    cum = cum / cum[-1] * frames
    return (start + np.interp(np.arange(frames), cum, np.arange(366))) % 365


def loop_start(move, mean_lat, lead=12):
    """Open the loop `lead` days before the busiest southward day, so frame 0 already shows the autumn flyway
    (a winter start opened on still, scattered dots: critic pass 2026-11-09)."""
    south = np.gradient(np.r_[mean_lat[-3:], mean_lat, mean_lat[:3]])[3:-3] < 0
    return int((np.argmax(move * south) - lead) % 365)


def camera(c, x, y, sigma=45):
    """Frame offset (ox, oy) per day: the flock's median point sits at c["focus"]; circular Gaussian smoothing over
    days keeps the slide slow (D5: follow the data, no zoom, no shake), clamped to the canvas."""
    cw, ch = c["canvas"]
    fx, fy = c["focus"]
    raw = np.stack([np.median(x, axis=1) - fx, np.median(y, axis=1) - fy], axis=1)
    k = np.exp(-0.5 * (np.arange(-3 * sigma, 3 * sigma + 1) / sigma) ** 2)
    k /= k.sum()
    pad = len(k) // 2
    sm = np.stack([np.convolve(np.r_[raw[-pad:, i], raw[:, i], raw[:pad, i]], k, mode="valid") for i in (0, 1)], axis=1)
    return np.stack([sm[:, 0].clip(0, cw - W), sm[:, 1].clip(0, ch - H)], axis=1)


def flock(slug):
    c = cfg(slug)
    src = ROOT / "out" / "data-loop" / slug
    rec = np.loadtxt(src / "records.csv", delimiter=",", skiprows=1)
    lon0, lat0, _, _ = c["bbox"]
    D = weekly_density(c, rec)
    rng = np.random.default_rng(7)
    n = c["birds"]
    u, v = rng.random(n), rng.random(n)
    lat_w, lon_w = np.empty((52, n)), np.empty((52, n))
    for w in range(52):
        # longitude quantile first: birds keep their meridian band and travel north–south (latitude-first gave
        # east–west streaks whenever a latitude row had two clusters, e.g. India and the Philippines)
        lon_w[w], lat_w[w] = knothe(D[w].T, u, v, lon0, lat0)
    # a little personal jitter so birds on one grid cell don't stack
    lat_d = catmull_daily(lat_w) + rng.normal(0, 0.3, n)
    lon_d = catmull_daily(lon_w) + rng.normal(0, 0.3, n)
    x, y, _ = project(c, lon_d, lat_d)
    move = np.hypot(np.diff(x, axis=0, append=x[:1]), np.diff(y, axis=0, append=y[:1])).mean(axis=1)
    mean_lat = lat_d.mean(axis=1)
    start = loop_start(move, mean_lat)
    days = frame_days(move, FPS * SECONDS, start)
    cam = camera(c, x, y)
    out = ROOT / "public" / "data-loop" / slug
    out.mkdir(parents=True, exist_ok=True)
    xy = np.stack([x, y], axis=-1).round().clip(-32000, 32000).astype("<i2")  # (365, n, 2)
    xy.tofile(out / "flock.bin")
    meta = json.loads((src / "meta.json").read_text(encoding="utf-8"))
    info = {"slug": slug, "common": c["common"], "sci": c["sci"], "birds": n, "days": 365, "fps": FPS, "seconds": SECONDS,
            "canvas": c["canvas"], "cam": cam.round(1).tolist(),
            "startDay": start, "frameDay": [round(float(d), 3) for d in days],
            "meanLat": [round(float(a), 2) for a in mean_lat], "move": [round(float(m), 2) for m in move],
            "sampled": meta["sampled"], "cite": meta["cite"]}
    (out / "flock.json").write_text(json.dumps(info), encoding="utf-8")
    print(f"→ {out / 'flock.bin'} ({xy.nbytes / 1e6:.1f} MB), loop starts on day {start}, "
          f"lat range {mean_lat.min():.1f}–{mean_lat.max():.1f}")


def selftest():
    c = {"center": [110, 27], "R": 800, "cx": 540, "cy": 900}
    lon, lat = np.array([110, 95, 130.]), np.array([27, 5, 50.])
    x, y, vis = project(c, lon, lat)
    lo, la, ok = unproject(c, x, y)
    assert vis.all() and ok.all() and np.allclose(lo, lon, atol=1e-6) and np.allclose(la, lat, atol=1e-6), (lo, la)
    # Knothe: a density with all mass in one cell sends every bird there
    Dw = np.full((10, 10), 1e-12)
    Dw[7, 3] = 1
    la, lo = knothe(Dw, np.array([0.1, 0.9]), np.array([0.2, 0.8]), 0, 0)
    assert np.all((la >= 3.5) & (la <= 4.0)) and np.all((lo >= 1.5) & (lo <= 2.0)), (la, lo)
    # periodic interpolation passes through weekly values
    P = np.sin(np.arange(52) / 52 * 2 * math.pi)[:, None]
    assert abs(catmull_daily(P)[3, 0] - P[0, 0]) < 0.02
    cc = {"canvas": [1500, 2600], "focus": [560, 680]}
    xs = np.tile(np.linspace(600, 900, 365)[:, None], (1, 5))
    cam = camera(cc, xs, xs + 400)
    assert cam.shape == (365, 2) and (cam[:, 0] >= 0).all() and (cam[:, 0] <= 420).all() and (cam[:, 1] <= 680).all()
    assert np.abs(np.diff(cam[:, 1])).max() < 5  # smooth: no jump across the year boundary either
    d = frame_days(np.r_[np.ones(100), np.full(265, 0.1)], 900, 300)
    assert len(d) == 900 and 0 <= d.min() and d.max() < 365 and abs(d[0] - 300) < 1e-9
    lat = np.cos(np.arange(365) / 365 * 2 * math.pi)  # falls (south) from day 0 to 182
    mv = np.abs(np.sin(np.arange(365) / 365 * 2 * math.pi))  # busiest at day ~91 and ~274
    assert abs(loop_start(mv, lat, 0) - 91) <= 1, loop_start(mv, lat, 0)
    print("selftest ok")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "selftest":
        selftest()
    elif cmd in ("fetch", "terrain", "flock") and len(sys.argv) > 2:
        globals()[cmd](sys.argv[2])
    else:
        sys.exit(__doc__)
