"""
Natural Earth (public domain) → small region JSON for the style J kit's <RegionFill>.

  python -P scripts/ne-regions.py <ne dir> <out.json> name=<source>:<match> ...

<source> is countries | land | marine | rivers | regions | lakes (ne_10m_admin_0_countries, ne_10m_land,
ne_10m_geography_marine_polys, ne_10m_rivers_lake_centerlines, ne_10m_geography_regions_polys,
ne_10m_lakes unzipped into <ne dir>).
<match> is a feature name (NAME / name field, "_" for spaces), or for land "@lon,lat": the polygon containing that point.
Optional "~tol" after the match: simplification tolerance in degrees (default 0.02).
Rings smaller than 1 % of the largest one are dropped. Output: { name: [[[lon, lat], ...], ...] }.
Stdlib only (shp + dbf read by hand).
"""
import json
import struct
import sys
from pathlib import Path

FILES = {
    "countries": ("ne_10m_admin_0_countries", ["NAME", "NAME_LONG", "ADMIN"]),
    "land": ("ne_10m_land", []),
    "marine": ("ne_10m_geography_marine_polys", ["name", "NAME"]),
    "rivers": ("ne_10m_rivers_lake_centerlines", ["name", "NAME"]),
    "regions": ("ne_10m_geography_regions_polys", ["NAME", "NAMEALT"]),  # mountain ranges, deserts, plateaus
    "lakes": ("ne_10m_lakes", ["name", "NAME"]),
}


def read_dbf(path):
    b = path.read_bytes()
    n, hlen, rlen = struct.unpack("<IHH", b[4:12])
    fields, off = [], 32
    while b[off] != 0x0D:
        name = b[off:off + 11].split(b"\0")[0].decode("latin-1")
        fields.append((name, b[off + 16]))
        off += 32
    rows = []
    for i in range(n):
        r = b[hlen + i * rlen + 1: hlen + (i + 1) * rlen]
        row, p = {}, 0
        for name, ln in fields:
            row[name] = r[p:p + ln].decode("utf-8", "replace").strip(" \0")  # NE pads with NULs
            p += ln
        rows.append(row)
    return rows


def read_shp(path):
    b = path.read_bytes()
    off, shapes = 100, []
    while off < len(b):
        clen = struct.unpack(">I", b[off + 4:off + 8])[0] * 2
        rec = b[off + 8: off + 8 + clen]
        off += 8 + clen
        st = struct.unpack("<i", rec[:4])[0]
        if st == 0:
            shapes.append([])
            continue
        nparts, npts = struct.unpack("<ii", rec[36:44])
        parts = list(struct.unpack(f"<{nparts}i", rec[44:44 + 4 * nparts])) + [npts]
        p0 = 44 + 4 * nparts
        pts = [struct.unpack("<dd", rec[p0 + 16 * k: p0 + 16 * k + 16]) for k in range(npts)]
        shapes.append([pts[parts[k]:parts[k + 1]] for k in range(nparts)])
    return shapes


def rdp(pts, tol):
    if len(pts) < 4:
        return pts
    if pts[0] == pts[-1]:
        # closed ring: the chord first→last has zero length, so split at the farthest vertex
        x0, y0 = pts[0]
        far = max(range(len(pts)), key=lambda i: (pts[i][0] - x0) ** 2 + (pts[i][1] - y0) ** 2)
        return rdp(pts[: far + 1], tol)[:-1] + rdp(pts[far:], tol)
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, z = stack.pop()
        (ax, ay), (zx, zy) = pts[a], pts[z]
        dx, dy = zx - ax, zy - ay
        norm = (dx * dx + dy * dy) ** 0.5 or 1e-12
        best, bi = 0.0, -1
        for i in range(a + 1, z):
            px, py = pts[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / norm
            if d > best:
                best, bi = d, i
        if best > tol and bi > 0:
            keep[bi] = True
            stack += [(a, bi), (bi, z)]
    return [p for p, k in zip(pts, keep) if k]


def area(r):
    return abs(sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(r, r[1:] + r[:1]))) / 2


def contains(r, x, y):
    inside = False
    for (x0, y0), (x1, y1) in zip(r, r[1:] + r[:1]):
        if (y0 > y) != (y1 > y) and x < (x1 - x0) * (y - y0) / (y1 - y0) + x0:
            inside = not inside
    return inside


ne, out = Path(sys.argv[1]), Path(sys.argv[2])
cache, result = {}, {}
for spec in sys.argv[3:]:
    name, rest = spec.split("=", 1)
    src, match = rest.split(":", 1)
    tol = 0.02
    if "~" in match:
        match, t = match.rsplit("~", 1)
        tol = float(t)
    match = match.replace("_", " ")  # "Mediterranean_Sea": no quoting games on the command line
    base, keys = FILES[src]
    if src not in cache:
        cache[src] = (read_shp(ne / base / f"{base}.shp"), read_dbf(ne / base / f"{base}.dbf"))
    shapes, rows = cache[src]
    if match.startswith("@"):
        x, y = map(float, match[1:].split(","))
        rings = [r for sh in shapes for r in sh if contains(r, x, y)]
    else:
        idx = [i for i, row in enumerate(rows) if any(row.get(k, "").lower() == match.lower() for k in keys)]
        if not idx:
            sys.exit(f"no feature named {match!r} in {src}")
        rings = [r for i in idx for r in shapes[i]]
    if src != "rivers":
        big = max(area(r) for r in rings)
        rings = [r for r in rings if area(r) >= big * 0.01]
    rings = [[[round(x, 3), round(y, 3)] for x, y in rdp(r, tol)] for r in rings]
    result[name] = rings
    print(name, len(rings), "rings", sum(len(r) for r in rings), "points")
old = json.loads(out.read_text()) if out.exists() else {}
old.update(result)
out.write_text(json.dumps(old, separators=(",", ":")))
