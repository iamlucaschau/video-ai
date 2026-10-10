"""
Cut out subjects drawn on a flat background (AI prompt packs ask for "plain flat cream background").
Flood-fills the background from the image border; dark ink outlines stop the fill, so white coats survive.
  python -P scripts/cutout.py <src dir> <dst dir> <threshold, e.g. 38> <file.png> [...]
Writes trimmed transparent PNGs. (rembg needs a GitHub model download that is blocked here.)
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops
src, dst, thresh = Path(sys.argv[1]), Path(sys.argv[2]), int(sys.argv[3])
dst.mkdir(parents=True, exist_ok=True)
KEY = (255, 0, 255)
for name in sys.argv[4:]:
    im = Image.open(src / name).convert("RGB")
    w, h = im.size
    work = im.copy()
    seeds = [(x, y) for x in range(0, w, 40) for y in (0, h - 1)] + [(x, y) for y in range(0, h, 40) for x in (0, w - 1)]
    for s in seeds:
        if work.getpixel(s) != KEY:
            ImageDraw.floodfill(work, s, KEY, thresh=thresh)
    r, g, b = work.split()
    bg = ImageChops.multiply(ImageChops.multiply(r.point(lambda v: 255 if v == 255 else 0), g.point(lambda v: 255 if v == 0 else 0)), b.point(lambda v: 255 if v == 255 else 0))
    alpha = ImageChops.invert(bg).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    out = im.convert("RGBA")
    out.putalpha(alpha)
    out = out.crop(alpha.point(lambda v: 255 if v > 20 else 0).getbbox())
    out.save(dst / name)
    print(name, out.size)
