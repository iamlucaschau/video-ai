"""
3D hero shots for "How an Aircraft Carrier Defends Itself" (Formats/Naval Board/episodes/ep01-carrier), built in code and rendered headless.
Cues come from the same VO timing as the Remotion video.

  "B:/Blender/blender.exe" -b --factory-startup --python scripts/blender/carrier3d.py -- <shot> [start end] [samples|preview]
    shot: hook | fleet | vls | phalanx | hawkeye | drones | cap | escort | gravely | moskva | strait | dusk   -> out/3d/<shot>/####.jpg   (frames are 1-based inside the shot)
    Default 8 samples (14 looks the same and flickers 1-11% less, 27-40% slower). One shot at a time on all threads.

Check before a full render, about a minute per shot: every 30th frame at half size and 6 samples -> out/3d/<shot>-preview/
  "B:/Blender/blender.exe" -b --factory-startup --python scripts/blender/carrier3d.py -- <shot> "" "" preview
  cd out/3d/<shot>-preview && printf "file '%s'\n" *.jpg > list.txt && ffmpeg -y -f concat -i list.txt -vf scale=480:-1,tile=4x4 -frames:v 1 sheet.jpg
"""
import json
import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
SHOT = argv[0] if argv else "hook"
START = int(argv[1]) if len(argv) > 1 and argv[1] else None
END = int(argv[2]) if len(argv) > 2 and argv[2] else None
PREVIEW = len(argv) > 3 and argv[3] == "preview"
SAMPLES = 6 if PREVIEW else int(argv[3]) if len(argv) > 3 else 8
FPS = 30
random.seed(7)

# ── VO cues (same maths as Carrier.tsx A/E/W) ─────────────────────────────────
TIMING = json.load(open(os.path.join(ROOT, "src/voiceover/carrier.timing.json"), encoding="utf8"))
WORDS = json.load(open(os.path.join(ROOT, "src/voiceover/carrier.words.json"), encoding="utf8"))
LINES = {l["id"]: l for l in TIMING["lines"]}
A = lambda i: round(LINES[i]["start"] * FPS)
E = lambda i: round(LINES[i]["end"] * FPS)


def W(i, w):
    toks = LINES[i]["text"].split()
    norm = lambda s: "".join(c for c in s.lower() if c.isalnum())
    k = next(n for n, t in enumerate(toks) if norm(t).startswith(norm(w)))
    h = WORDS[i]
    return round(h[min(len(h) - 1, k * len(h) // len(toks))] * FPS)


# Global VO frame where each shot starts / its length. Carrier.tsx imports the same numbers via shots3d.json.
SHOTS = {
    "hook": (0, A("03")),
    "fleet": (A("21") - 10, A("22") - A("21") + 20),
    "vls": (A("69") - 10, A("71") - A("69") + 20),
    "phalanx": (A("81") - 10, W("81", "spraying") + 90 - (A("81") - 10)),
    "hawkeye": (A("38") - 10, E("40") - A("38") + 20),
    "drones": (A("47") - 10, E("48") - A("47") + 20),
    "cap": (A("51") - 10, E("52") - A("51") + 20),
    "escort": (A("65") - 10, E("65") - A("65") + 20),
    "gravely": (A("87") - 10, E("88") - A("87") + 20),
    "moskva": (A("99") - 10, E("101") - A("99") + 20),
    "strait": (A("115") - 10, E("115") - A("115") + 20),
    "dusk": (A("117") - 10, E("117") - A("117") + 20),
}
T0, LEN = SHOTS[SHOT]
json.dump({k: {"from": v[0], "frames": v[1]} for k, v in SHOTS.items()}, open(os.path.join(ROOT, "src/compositions/Carrier/shots3d.json"), "w"))
local = lambda global_frame: global_frame - T0 + 1  # Blender frames are 1-based

# ── scene ─────────────────────────────────────────────────────────────────────
scene = bpy.context.scene
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o)
scene.render.resolution_x, scene.render.resolution_y = 1920, 1080
scene.render.fps = FPS
scene.frame_start, scene.frame_end = START or 1, END or LEN
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.max_bounces = 3
scene.cycles.diffuse_bounces = 1
scene.cycles.glossy_bounces = 2
scene.cycles.transparent_max_bounces = 128
scene.cycles.caustics_reflective = scene.cycles.caustics_refractive = False
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.06
scene.render.use_persistent_data = True
scene.cycles.use_auto_tile = False
scene.render.use_motion_blur = False
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - High Contrast"
scene.view_settings.exposure = -0.9
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 95
scene.render.filepath = os.path.join(ROOT, "out", "3d", SHOT + "-preview" if PREVIEW else SHOT, "")
if PREVIEW:
    scene.frame_step = 30
    scene.render.resolution_percentage = 50


def mat(name, color, rough=0.6, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Specular IOR Level"].default_value = 0.25
    if emit:
        b.inputs["Emission Color"].default_value = (*emit, 1)
        b.inputs["Emission Strength"].default_value = strength
    return m


HULL = mat("hull", (0.075, 0.085, 0.095), 0.6, 0.1)
SUPER = mat("super", (0.13, 0.145, 0.16), 0.55, 0.1)
DECK = mat("deck", (0.035, 0.037, 0.04), 0.85)
DARK = mat("dark", (0.012, 0.013, 0.015), 1.0)
DARK.node_tree.nodes["Principled BSDF"].inputs["Specular IOR Level"].default_value = 0.0
LINEW = mat("linew", (0.75, 0.75, 0.70), 0.7)
LINEY = mat("liney", (0.8, 0.55, 0.08), 0.7)
JETM = mat("jet", (0.20, 0.22, 0.24), 0.45, 0.3)
WHITE = mat("white", (0.8, 0.82, 0.84), 0.35)
GLASS = mat("glass", (0.02, 0.05, 0.07), 0.08, 0.6)


def weather(m, c2, scale):
    """Break up a flat colour with soft patches (paint wear, tyre rubber)."""
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = 6
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    nt.links.new(geo.outputs["Position"], n.inputs["Vector"])
    mx = nt.nodes.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.inputs["A"].default_value = b.inputs["Base Color"].default_value
    mx.inputs["B"].default_value = (*c2, 1)
    nt.links.new(n.outputs[0], mx.inputs["Factor"])
    nt.links.new(mx.outputs["Result"], b.inputs["Base Color"])


weather(DECK, (0.075, 0.078, 0.08), 0.12)
weather(HULL, (0.05, 0.055, 0.06), 0.35)
weather(SUPER, (0.085, 0.095, 0.105), 0.5)


class Mesh:
    """Collects quads/ngons, then becomes one object (one material per object keeps the build simple)."""

    def __init__(self, name, material):
        self.name, self.material, self.v, self.f = name, material, [], []

    def add(self, verts, faces):
        n = len(self.v)
        self.v += [tuple(p) for p in verts]
        self.f += [tuple(i + n for i in f) for f in faces]
        return self

    def box(self, x0, x1, y0, y1, z0, z1, top=1.0):
        """Box; `top` scales the top face around its centre (raked superstructure)."""
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        t = lambda x, y: (cx + (x - cx) * top, cy + (y - cy) * top)
        vs = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (*t(x0, y0), z1), (*t(x1, y0), z1), (*t(x1, y1), z1), (*t(x0, y1), z1)]
        return self.add(vs, [(3, 2, 1, 0), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)])

    def cyl(self, x, y, z0, z1, r0, r1=None, n=16):
        r1 = r0 if r1 is None else r1
        vs = [(x + math.cos(a) * r, y + math.sin(a) * r, z) for z, r in ((z0, r0), (z1, r1)) for a in [i * 2 * math.pi / n for i in range(n)]]
        fs = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
        return self.add(vs, fs)

    def loft(self, rings, cap_top=True):
        n = len(rings[0])
        vs = [p for r in rings for p in r]
        fs = [(j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i) for j in range(len(rings) - 1) for i in range(n)]
        if cap_top:
            fs.append(tuple(range(n)))
        return self.add(vs, fs)

    def strip(self, p0, p1, w, z):
        """Flat painted line from p0 to p1 on the deck."""
        d = Vector((p1[0] - p0[0], p1[1] - p0[1]))
        nrm = Vector((-d.y, d.x)).normalized() * w / 2
        return self.add([(p0[0] + nrm.x, p0[1] + nrm.y, z), (p0[0] - nrm.x, p0[1] - nrm.y, z), (p1[0] - nrm.x, p1[1] - nrm.y, z), (p1[0] + nrm.x, p1[1] + nrm.y, z)], [(1, 0, 3, 2)])

    def build(self, parent=None, smooth=False):
        me = bpy.data.meshes.new(self.name)
        me.from_pydata(self.v, [], self.f)
        me.update()
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(me)
        bm.free()
        me.materials.append(self.material)
        if smooth:
            me.shade_smooth()
            me.set_sharp_from_angle(angle=math.radians(35))
        o = bpy.data.objects.new(self.name, me)
        scene.collection.objects.link(o)
        o.parent = parent
        return o


def empty(name, parent=None):
    o = bpy.data.objects.new(name, None)
    scene.collection.objects.link(o)
    o.parent = parent
    return o


def jet_mesh(name="jet", material=JETM):
    """Generic carrier fighter, 18 m long, nose at +x. One shared mesh, many linked objects."""
    m = Mesh(name, material)
    m.loft([[(x, y * s, z * s + zo) for y, z in ((-0.9, -0.7), (0.9, -0.7), (0.9, 0.6), (-0.9, 0.6))] for x, s, zo in ((9, 0.1, 0), (6, 0.6, 0), (2, 1, 0), (-6, 1, 0), (-9, 0.8, 0))], cap_top=True)
    for sgn in (1, -1):
        m.add([(3, sgn * 0.9, 0), (-3.5, sgn * 0.9, 0), (-4.5, sgn * 6.5, -0.1), (-3.2, sgn * 6.5, -0.1)], [(0, 1, 2, 3)])  # wing
        m.add([(-5.5, sgn * 0.9, 0), (-8.8, sgn * 0.9, 0), (-9.2, sgn * 3.4, -0.1), (-8, sgn * 3.4, -0.1)], [(0, 1, 2, 3)])  # stabilator
        m.add([(-4.8, sgn * 0.8, 0.5), (-8, sgn * 0.8, 0.5), (-9, sgn * 1.7, 3.2), (-7.6, sgn * 1.7, 3.2)], [(0, 1, 2, 3)])  # tail fin
    return m


# ── ships ─────────────────────────────────────────────────────────────────────
def carrier(parent):
    deck_z = 20.0
    outline = [(167, 0), (158, 11), (118, 19), (66, 24), (44, 39), (-40, 44), (-128, 42), (-166, 31), (-170, 0), (-166, -21), (-60, -31), (30, -37), (92, -31), (140, -19), (162, -6)]
    water = [(x * 0.97, y * (0.42 if y > 0 else 0.5), 0.0) for x, y in outline]
    rings = [[(x, y, deck_z) for x, y in outline], [(x, y, deck_z - 2.2) for x, y in outline], [(x * 0.985, y * 0.68, 9.0) for x, y in outline], water, [(x * 0.95, y * 0.4, -6.0) for x, y in outline]]
    Mesh("cv-deck", DECK).add([(x, y, deck_z) for x, y in outline], [tuple(range(len(outline)))]).build(parent)
    Mesh("cv-hull", HULL).loft(rings[1:], cap_top=False).build(parent, smooth=True)
    # the deck edge, a dark gallery under it, hangar openings and sponson shadow give the side its scale
    Mesh("cv-edge", SUPER).loft([rings[0], [(x * 1.002, y * 1.01, deck_z - 1.0) for x, y in outline], rings[1]], cap_top=False).build(parent)
    gal = Mesh("cv-gallery", DARK)
    gal.loft([[(x, y * 0.995, deck_z - 2.2) for x, y in outline], [(x, y * 0.975, deck_z - 3.6) for x, y in outline]], cap_top=False)
    gal.build(parent)

    def side_y(x, port):
        """Deck-edge half-width on one side at x (the hull below it follows the same outline)."""
        pts = sorted((a, b) for a, b in outline if (b > 0) == port)
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            if x0 <= x <= x1:
                return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
        return pts[0][1] if x < pts[0][0] else pts[-1][1]

    def on_hull(x, z, port):
        """A point just proud of the sloping hull plating between deck edge and the z=9 ring."""
        f = 0.68 + 0.32 * (z - 9.0) / (deck_z - 2.2 - 9.0)
        return (x, side_y(x, port) * f + (0.25 if port else -0.25), z)

    bays = Mesh("cv-bays", DARK)
    for port, x0, x1 in ((True, -112, -72), (True, -34, 6), (False, -56, -18), (False, 44, 80)):
        n = 6
        xs = [x0 + (x1 - x0) * i / n for i in range(n + 1)]
        bays.loft([[on_hull(x, z, port) for x in xs] + [on_hull(x, z, port) for x in reversed(xs)] for z in (deck_z - 10, deck_z - 4.5)], cap_top=False)
    bays.build(parent)
    # boot-topping: the dark band along the waterline
    Mesh("cv-boot", DARK).loft([[(x * 0.971, y * (0.425 if y > 0 else 0.505), 0.2) for x, y in outline], [(x * 0.973, y * (0.455 if y > 0 else 0.53), 1.9) for x, y in outline]], cap_top=False).build(parent)
    # life rafts along the gallery give the side its scale
    rafts = Mesh("cv-rafts", WHITE)
    for port in (True, False):
        for k in range(26):
            x = -150 + k * 11.5
            y = side_y(x, port) * 0.99
            rafts.box(x - 0.9, x + 0.9, y - 0.55, y + 0.55, deck_z - 3.5, deck_z - 2.6)
    rafts.build(parent)
    foam_collar(parent, outline, 0.47, 3.0, 14.0, 167.0)

    paint = Mesh("cv-paint", LINEW)
    z = deck_z + 0.08
    # angled landing deck: centreline dashes and edge lines
    a, b = Vector((-160, 34)), Vector((48, 8))
    n = 26
    for i in range(n):
        p0, p1 = a.lerp(b, i / n), a.lerp(b, (i + 0.55) / n)
        paint.strip(p0, p1, 0.8, z)
    for off in (-14, 14):
        ofs = (b - a).normalized().orthogonal() * off
        paint.strip(a + ofs, b + ofs, 0.5, z)
    # bow catapults, foul line, deck edge line
    for y in (-11, 10):
        paint.strip((54, y), (160, y * 0.28), 0.5, z)
    paint.strip((-168, 28), (-168, -18), 0.6, z)
    paint.build(parent)
    yellow = Mesh("cv-yellow", LINEY)
    yellow.strip((60, 26), (-30, -5), 0.45, z)
    yellow.build(parent)

    # island to starboard
    isl = Mesh("cv-island", SUPER)
    D = deck_z
    isl.box(-8, 36, -34, -24, D, D + 15)
    isl.box(-5, 31, -33.6, -24.4, D + 15, D + 20)
    isl.box(1, 33, -35.5, -23, D + 20, D + 23.5)  # bridge wings overhang
    isl.box(7, 27, -33, -25, D + 23.5, D + 27)
    isl.box(14, 20, -31, -27, D + 27, D + 37, 0.55)  # main mast
    isl.box(16.2, 17.8, -35, -23, D + 33.5, D + 34.2)
    isl.box(-2, 3, -31, -27, D + 15, D + 26, 0.6)  # aft mast
    isl.cyl(17, -29, D + 37, D + 47, 0.45, 0.1, 8)
    isl.cyl(0.5, -29, D + 26, D + 33, 0.3, 0.08, 8)
    isl.build(parent)
    w = Mesh("cv-windows", GLASS)
    for yy in (-35.6, -23.0):  # both sides of the bridge
        w.box(2, 32, yy, yy + 0.1, D + 21.2, D + 22.8)
    w.box(33, 33.1, -35, -23.5, D + 21.2, D + 22.8)
    w.build(parent)
    doors = Mesh("cv-doors", DARK)
    for k in range(5):
        doors.box(-4 + k * 8, -1 + k * 8, -34.08, -34, D + 0.3, D + 3.2)
        doors.box(-4 + k * 8, 0 + k * 8, -34.08, -34, D + 8, D + 8.9)
    doors.build(parent)
    Mesh("cv-dome", WHITE).cyl(24, -29, D + 27, D + 29.5, 1.8, 1.2, 12).cyl(10, -29, D + 27, D + 29, 1.4, 0.9, 12).build(parent)
    # a turning radar on the mast: it is the only part of a ship that visibly works at this range
    radar = empty("cv-radar", parent)
    radar.location = (17, -29, D + 37.5)
    Mesh("cv-radar-bar", SUPER).box(-0.3, 0.3, -3.2, 3.2, 0, 1.3).build(radar)
    radar.rotation_euler = (0, 0, 0)
    radar.keyframe_insert("rotation_euler", frame=1)
    radar.rotation_euler = (0, 0, LEN / FPS * 2.5)
    radar.keyframe_insert("rotation_euler", frame=LEN)
    linear(radar)

    # parked aircraft (linked copies of one mesh)
    jet = jet_mesh().build(parent)
    jet.hide_render = jet.hide_viewport = True
    spots = [(x, -24, 215) for x in (-150, -130, -110, -90, -70, -50)] + [(x, 14, 150) for x in (120, 100, 80)] + [(x, -17, 30) for x in (120, 100, 80, 60)] + [(-20 - i * 19, 30, 200) for i in range(4)]
    for i, (x, y, rot) in enumerate(spots):
        o = bpy.data.objects.new(f"parked{i}", jet.data)
        scene.collection.objects.link(o)
        o.parent = parent
        o.location = (x, y, deck_z + 2.0)
        o.rotation_euler = (0, 0, math.radians(rot))


def destroyer(parent, cells=False):
    half = lambda x: 9.6 * max(0.0, 1 - ((x + 12) / 92) ** 2) ** 0.55 if x > -12 else 9.6 * (1 - 0.25 * ((x + 12) / 66) ** 2)
    xs = [-78 + i * 158 / 26 for i in range(27)]
    side = [(x, half(x)) for x in xs]
    outline = side + [(x, -y) for x, y in reversed(side[1:-1])]
    zdeck = lambda x: 7.5 + max(0, x) * 0.05  # sheer: bow rises
    Mesh("dd-deck", mat("dddeck", (0.05, 0.055, 0.06), 0.8)).add([(x, y, zdeck(x)) for x, y in outline], [tuple(range(len(outline)))]).build(parent)
    Mesh("dd-hull", HULL).loft([[(x, y, zdeck(x)) for x, y in outline], [(x - max(0, x - 30) * 0.13, y * 0.86, 0) for x, y in outline], [(x * 0.97 - max(0, x - 30) * 0.24, y * 0.6, -5) for x, y in outline]], cap_top=False).build(parent, smooth=True)
    foam_collar(parent, outline, 0.86, 1.2, 6.0, 80.0)
    s = Mesh("dd-super", SUPER)
    s.box(-22, 26, -7.5, 7.5, 8, 15, 0.97)
    s.box(0, 25, -6, 6, 15, 21, 0.9)
    s.box(6, 21, -4.6, 4.6, 21, 25, 0.85)
    s.box(-20, -3, -5.5, 5.5, 15, 19, 0.9)
    s.box(-46, -30, -6.5, 6.5, 8, 13, 0.92)
    s.box(-14, -8, -2.5, 2.5, 19, 25, 0.8)  # funnels
    s.box(-34, -40, -2.5, 2.5, 13, 18, 0.8)
    s.box(11, 15, -1.6, 1.6, 25, 35, 0.35)  # mast
    s.box(12, 14, -6, 6, 31, 31.6)
    s.build(parent)
    Mesh("dd-glass", GLASS).box(21.5, 22.4, -4, 4, 22.4, 24).build(parent)
    d = Mesh("dd-detail", DARK)
    d.box(-31, -29.9, -2, -0.6, 8.2, 12).box(-31, -29.9, 1, 2.6, 9, 10.5)
    d.box(-46.05, -45.9, -3, 3, 9, 11.5)
    for i in range(9):
        d.box(-46 + i * 2, -45.92 + i * 2, 5.7, 5.8, 13, 14.1).box(-46 + i * 2, -45.92 + i * 2, -5.8, -5.7, 13, 14.1)
    d.box(-46, -30, 5.72, 5.78, 14.05, 14.12).box(-46, -30, -5.78, -5.72, 14.05, 14.12)
    d.build(parent)
    spy = Mesh("dd-spy", mat("spy", (0.028, 0.04, 0.052), 0.35, 0.3))
    octa = [(math.cos(math.pi / 8 + i * math.pi / 4) * 2.3, math.sin(math.pi / 8 + i * math.pi / 4) * 2.3 + 18.2) for i in range(8)]
    spy.add([(25.05 - 1.25 * (z - 15) / 6 + 0.04, u, z) for u, z in octa], [tuple(range(8))])
    for sgn in (1, -1):
        spy.add([(13.5 + u, sgn * (6.04 - 0.6 * (z - 15) / 6), z) for u, z in octa], [tuple(range(8))])
    spy.build(parent)
    d2 = Mesh("dd-detail2", DARK)
    d2.box(-13.3, -8.7, -2.0, 2.0, 25.0, 25.25).box(-38.6, -35.4, -2.0, 2.0, 18.0, 18.25)
    for sgn in (1, -1):
        d2.box(-18, -6, sgn * 7.45 - 0.05, sgn * 7.45 + 0.05, 10.4, 11.4)  # hull-side doors and openings
        d2.box(-4, 10, sgn * 7.3 - 0.05, sgn * 7.3 + 0.05, 12.0, 12.5)
    d2.build(parent)
    bm_gear = Mesh("dd-gear", WHITE)
    bm_gear.cyl(13, 0, 35.0, 36.2, 0.55, 0.45, 12).cyl(13, 3.8, 31.6, 32.5, 0.4, 0.3, 10).cyl(13, -3.8, 31.6, 32.5, 0.4, 0.3, 10)
    for sgn in (1, -1):
        bm_gear.box(-16, -9, sgn * 6.0 - 0.9, sgn * 6.0 + 0.9, 15.6, 16.8, 0.8)  # boats on the deckhouse
    bm_gear.build(parent, smooth=True)
    gun = Mesh("dd-gun", SUPER)
    gun.cyl(58, 0, zdeck(58), zdeck(58) + 2.2, 2.2, 1.6, 12)
    gun.box(59, 69, -0.22, 0.22, zdeck(58) + 1.2, zdeck(58) + 1.7)
    gun.build(parent)
    if cells:
        vls_grid(parent)
    return zdeck


CELL = 1.5  # m; slightly over scale so ninety cells read in the frame
VLS_COLS, VLS_ROWS, VLS_X0 = 6, 15, 24.0


def vls_cell_pos(i):
    c, r = i % VLS_COLS, i // VLS_COLS
    return VLS_X0 + r * CELL + CELL / 2, (c - (VLS_COLS - 1) / 2) * CELL


def vls_grid(parent, z=10.0):
    frame = Mesh("vls-frame", DARK).box(VLS_X0 - 0.3, VLS_X0 + VLS_ROWS * CELL + 0.3, -(VLS_COLS * CELL) / 2 - 0.3, (VLS_COLS * CELL) / 2 + 0.3, z - 2, z)
    frame.build(parent)
    lid = Mesh("vls-lids", mat("vlslid", (0.32, 0.34, 0.37), 0.45, 0.3))
    for i in range(VLS_COLS * VLS_ROWS):
        x, y = vls_cell_pos(i)
        if i not in VLS_OPEN:
            lid.box(x - CELL * 0.44, x + CELL * 0.44, y - CELL * 0.44, y + CELL * 0.44, z, z + 0.12)
    lid.build(parent)


VLS_OPEN = {8, 27, 44, 61, 15}


# ── sea, sky, wakes ───────────────────────────────────────────────────────────
def world(elevation=7.0, rotation=300.0, strength=0.55, sun_energy=3.0, sun_color=(1.0, 0.96, 0.92), aerosol=1.2):
    w = bpy.data.worlds.new("sky")
    w.use_nodes = True
    nt = w.node_tree
    sky = nt.nodes.new("ShaderNodeTexSky")
    sky.sky_type = "MULTIPLE_SCATTERING"
    sky.sun_elevation = math.radians(elevation)
    sky.sun_rotation = math.radians(rotation)
    sky.altitude = 200
    sky.aerosol_density = aerosol
    sky.sun_disc = True
    sky.sun_size = math.radians(1.2)
    sky.sun_intensity = 0.15
    bg = nt.nodes["Background"]
    bg.inputs["Strength"].default_value = strength
    nt.links.new(sky.outputs[0], bg.inputs["Color"])
    scene.world = w
    # a warm low sun for shape and long shadows
    sun = bpy.data.lights.new("sun", "SUN")
    sun.energy = sun_energy
    sun.color = sun_color
    sun.angle = math.radians(1.5)
    so = bpy.data.objects.new("sun", sun)
    scene.collection.objects.link(so)
    el, ro = math.radians(elevation), math.radians(rotation)
    so.rotation_euler = (math.pi / 2 - el, 0, ro + math.pi)


def sea(S=60000, haze=None):
    me = bpy.data.meshes.new("sea")
    me.from_pydata([(-S, -S, 0), (S, -S, 0), (S, S, 0), (-S, S, 0)], [], [(0, 1, 2, 3)])
    o = bpy.data.objects.new("sea", me)
    scene.collection.objects.link(o)
    m = bpy.data.materials.new("water")
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    b = N["Principled BSDF"]
    b.inputs["Base Color"].default_value = (0.006, 0.03, 0.055, 1)
    b.inputs["Roughness"].default_value = 0.12
    b.inputs["IOR"].default_value = 1.33
    geo = N.new("ShaderNodeNewGeometry")
    n1 = N.new("ShaderNodeTexNoise")
    n1.noise_dimensions = "4D"
    n1.inputs["Scale"].default_value = 0.035
    n1.inputs["Detail"].default_value = 6
    n1.inputs["Roughness"].default_value = 0.55
    n2 = N.new("ShaderNodeTexNoise")
    n2.noise_dimensions = "4D"
    n2.inputs["Scale"].default_value = 0.28
    n2.inputs["Detail"].default_value = 3
    # the sea breathes with the frame
    for n, speed in ((n1, 0.018), (n2, 0.05)):
        fc = n.inputs["W"]
        fc.default_value = 0
        fc.keyframe_insert("default_value", frame=1)
        fc.default_value = speed * 1000
        fc.keyframe_insert("default_value", frame=1001)
    for f in nt.animation_data.action.layers[0].strips[0].channelbag(nt.animation_data.action.slots[0]).fcurves:
        for kp in f.keyframe_points:
            kp.interpolation = "LINEAR"
    L.new(geo.outputs["Position"], n1.inputs["Vector"])
    L.new(geo.outputs["Position"], n2.inputs["Vector"])
    add = N.new("ShaderNodeMath")
    add.operation = "ADD"
    mul = N.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = 0.22
    L.new(n2.outputs[0], mul.inputs[0])
    L.new(n1.outputs[0], add.inputs[0])
    L.new(mul.outputs[0], add.inputs[1])
    bump = N.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.9
    bump.inputs["Distance"].default_value = 3.0
    L.new(add.outputs[0], bump.inputs["Height"])
    L.new(bump.outputs[0], b.inputs["Normal"])
    # whitecaps: only the highest crests
    n3 = N.new("ShaderNodeTexNoise")
    n3.inputs["Scale"].default_value = 0.16
    n3.inputs["Detail"].default_value = 8
    L.new(geo.outputs["Position"], n3.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.70
    ramp.color_ramp.elements[1].position = 0.74
    L.new(n3.outputs[0], ramp.inputs[0])
    mixc = N.new("ShaderNodeMix")
    mixc.data_type = "RGBA"
    mixc.inputs["A"].default_value = (0.006, 0.03, 0.055, 1)
    mixc.inputs["B"].default_value = (0.65, 0.72, 0.76, 1)
    L.new(ramp.outputs[0], mixc.inputs["Factor"])
    L.new(mixc.outputs["Result"], b.inputs["Base Color"])
    if haze:
        color, strength, d0, d1 = haze
        cd, rng = N.new("ShaderNodeCameraData"), N.new("ShaderNodeMapRange")
        rng.inputs["From Min"].default_value, rng.inputs["From Max"].default_value = d0, d1
        L.new(cd.outputs["View Distance"], rng.inputs["Value"])
        em, ms = N.new("ShaderNodeEmission"), N.new("ShaderNodeMixShader")
        em.inputs["Color"].default_value = (*color, 1)
        em.inputs["Strength"].default_value = strength
        L.new(rng.outputs[0], ms.inputs[0])
        L.new(b.outputs[0], ms.inputs[1])
        L.new(em.outputs[0], ms.inputs[2])
        L.new(ms.outputs[0], N["Material Output"].inputs["Surface"])
    me.materials.append(m)
    return o


def wake(parent, x_stern, length, w0, w1, name="wake"):
    """Foam behind a ship: a widening strip whose alpha fades with distance and breaks up with noise."""
    nx = 30
    vs, fs, uvs = [], [], []
    for i in range(nx + 1):
        u = i / nx
        x = x_stern - u * length
        w = w0 + (w1 - w0) * u**0.75
        for v in (-1, 0, 1):
            vs.append((x, v * w, 0.35))
            uvs.append((u, (v + 1) / 2))
    for i in range(nx):
        for k in range(2):
            a = i * 3 + k
            fs.append((a, a + 1, a + 4, a + 3))
    me = bpy.data.meshes.new(name)
    me.from_pydata(vs, [], fs)
    uv = me.uv_layers.new(name="UVMap")
    for poly in me.polygons:
        for li in poly.loop_indices:
            uv.data[li].uv = uvs[me.loops[li].vertex_index]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    out = N["Material Output"]
    bsdf = N["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.8, 0.88, 0.9, 1)
    bsdf.inputs["Roughness"].default_value = 0.8
    trans = N.new("ShaderNodeBsdfTransparent")
    mix = N.new("ShaderNodeMixShader")
    tc = N.new("ShaderNodeUVMap")
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs[0], sep.inputs[0])
    geo = N.new("ShaderNodeNewGeometry")
    noise = N.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 0.05
    noise.inputs["Detail"].default_value = 8
    L.new(geo.outputs["Position"], noise.inputs["Vector"])
    # fade along: 1 at the stern to 0 at the end; edge fade across; noise threshold eats it as it ages
    fade = N.new("ShaderNodeMath")
    fade.operation = "SUBTRACT"
    fade.inputs[0].default_value = 1
    L.new(sep.outputs[0], fade.inputs[1])
    across = N.new("ShaderNodeMath")
    across.operation = "PINGPONG"
    across.inputs[1].default_value = 0.5
    L.new(sep.outputs[1], across.inputs[0])
    ax = N.new("ShaderNodeMath")
    ax.operation = "MULTIPLY"
    ax.inputs[1].default_value = 2.0
    L.new(across.outputs[0], ax.inputs[0])
    m1 = N.new("ShaderNodeMath")
    m1.operation = "MULTIPLY"
    L.new(fade.outputs[0], m1.inputs[0])
    L.new(ax.outputs[0], m1.inputs[1])
    sub = N.new("ShaderNodeMath")
    sub.operation = "SUBTRACT"
    L.new(noise.outputs[0], sub.inputs[0])
    sub.inputs[1].default_value = 0.38
    m2 = N.new("ShaderNodeMath")
    m2.operation = "MULTIPLY"
    m2.inputs[1].default_value = 6.0
    m2.use_clamp = True
    L.new(sub.outputs[0], m2.inputs[0])
    m3 = N.new("ShaderNodeMath")
    m3.operation = "MULTIPLY"
    m3.use_clamp = True
    L.new(m1.outputs[0], m3.inputs[0])
    L.new(m2.outputs[0], m3.inputs[1])
    L.new(m3.outputs[0], mix.inputs[0])
    L.new(trans.outputs[0], mix.inputs[1])
    L.new(bsdf.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], out.inputs["Surface"])
    me.materials.append(m)
    o = bpy.data.objects.new(name, me)
    scene.collection.objects.link(o)
    o.parent = parent
    return o


def foam_collar(parent, outline, ky, w0, bow, xmax):
    """White water hugging the hull, fading outward and broken by noise; widest at the bow."""
    vs, uvs = [], []
    for x, y in outline:
        sgn = 1 if y >= 0 else -1
        kb = max(0.0, x / xmax) ** 2
        vs += [(x * 0.985, y * ky, 0.3), (x + bow * 0.6 * kb, y * ky + sgn * (w0 + bow * kb), 0.3)]
        uvs += [(0, 0), (0, 1)]
    n = len(outline)
    fs = [(i * 2, (i * 2 + 2) % (n * 2), (i * 2 + 3) % (n * 2), i * 2 + 1) for i in range(n)]
    me = bpy.data.meshes.new("foam")
    me.from_pydata(vs, [], fs)
    uv = me.uv_layers.new(name="UVMap")
    for poly in me.polygons:
        for li in poly.loop_indices:
            uv.data[li].uv = uvs[me.loops[li].vertex_index]
    m = bpy.data.materials.new("foam")
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    bsdf = N["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.8, 0.88, 0.9, 1)
    bsdf.inputs["Roughness"].default_value = 0.8
    trans, mix = N.new("ShaderNodeBsdfTransparent"), N.new("ShaderNodeMixShader")
    tc, sep = N.new("ShaderNodeUVMap"), N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs[0], sep.inputs[0])
    geo, noise = N.new("ShaderNodeNewGeometry"), N.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 0.22
    noise.inputs["Detail"].default_value = 7
    L.new(geo.outputs["Position"], noise.inputs["Vector"])
    fade = N.new("ShaderNodeMath")
    fade.operation = "SUBTRACT"
    fade.inputs[0].default_value = 1
    L.new(sep.outputs[1], fade.inputs[1])
    sub = N.new("ShaderNodeMath")
    sub.operation = "SUBTRACT"
    sub.inputs[1].default_value = 0.40
    L.new(noise.outputs[0], sub.inputs[0])
    gain = N.new("ShaderNodeMath")
    gain.operation = "MULTIPLY"
    gain.use_clamp = True
    gain.inputs[1].default_value = 7.0
    L.new(sub.outputs[0], gain.inputs[0])
    both = N.new("ShaderNodeMath")
    both.operation = "MULTIPLY"
    both.use_clamp = True
    L.new(fade.outputs[0], both.inputs[0])
    L.new(gain.outputs[0], both.inputs[1])
    L.new(both.outputs[0], mix.inputs[0])
    L.new(trans.outputs[0], mix.inputs[1])
    L.new(bsdf.outputs[0], mix.inputs[2])
    L.new(mix.outputs[0], N["Material Output"].inputs["Surface"])
    me.materials.append(m)
    o = bpy.data.objects.new("foam", me)
    scene.collection.objects.link(o)
    o.parent = parent
    return o


def under_way(obj, speed):
    """Move along +x at `speed` m/s for the whole shot (a follow camera keeps it framed)."""
    obj.location.x = 0
    obj.keyframe_insert("location", frame=1, index=0)
    obj.location.x = speed * (LEN / FPS)
    obj.keyframe_insert("location", frame=LEN, index=0)
    for slot in obj.animation_data.action.layers[0].strips[0].channelbag(obj.animation_data.action.slots[0]).fcurves:
        for kp in slot.keyframe_points:
            kp.interpolation = "LINEAR"
    obj.location.x = 0


def camera(lens=35):
    cam = bpy.data.cameras.new("cam")
    cam.lens = lens
    cam.clip_end = 200000
    o = bpy.data.objects.new("cam", cam)
    scene.collection.objects.link(o)
    scene.camera = o
    target = empty("target")
    c = o.constraints.new("TRACK_TO")
    c.target = target
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    return o, target


def keys(obj, pts, smooth=True):
    """pts = [(frame, (x, y, z)), ...]"""
    for f, p in pts:
        obj.location = p
        obj.keyframe_insert("location", frame=f)


# ── shots ─────────────────────────────────────────────────────────────────────
def shot_hook():
    world()
    sea()
    ship = empty("ship")
    under_way(ship, 15.0)
    carrier(ship)
    wake(ship, -160, 1500, 22, 110)
    rig = empty("rig", ship)  # camera moves in the ship's frame
    cam, tgt = camera(32)
    cam.parent = ship
    tgt.parent = ship
    # low off the port bow, sweeping back and climbing: the ship slides past, huge, then shows its whole deck
    keys(cam, [(1, (250, 190, 16)), (LEN // 2, (40, 330, 60)), (LEN, (-230, 330, 130))])
    keys(tgt, [(1, (70, 0, 24)), (LEN // 2, (0, 0, 22)), (LEN, (-15, 0, 18))])
    return rig


def puff_mesh():
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=1.0)
    for v in bm.verts:
        v.co *= 1 + 0.08 * math.sin(v.co.x * 5 + v.co.y * 3) * math.cos(v.co.z * 4)
    me = bpy.data.meshes.new("puff")
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    return me


def soften(m, alpha, edge=None, centre=None):
    """Alpha fades to nothing at the silhouette and is broken by noise, so a sphere reads as a wisp, not a ball.
    edge/centre: emission colours from rim to core, for fire."""
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.5
    inv = nt.nodes.new("ShaderNodeMath")
    inv.operation = "SUBTRACT"
    inv.inputs[0].default_value = 1.0
    nt.links.new(lw.outputs["Facing"], inv.inputs[1])
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 2.2
    n.inputs["Detail"].default_value = 6
    n.inputs["Roughness"].default_value = 0.6
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    rng = nt.nodes.new("ShaderNodeMapRange")
    rng.inputs["From Min"].default_value, rng.inputs["From Max"].default_value = 0.36, 0.62
    nt.links.new(n.outputs[0], rng.inputs["Value"])
    pw = nt.nodes.new("ShaderNodeMath")
    pw.operation = "POWER"
    pw.inputs[1].default_value = 1.6
    nt.links.new(inv.outputs[0], pw.inputs[0])
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    nt.links.new(pw.outputs[0], mul.inputs[0])
    nt.links.new(rng.outputs[0], mul.inputs[1])
    mul2 = nt.nodes.new("ShaderNodeMath")
    mul2.operation = "MULTIPLY"
    mul2.inputs[1].default_value = alpha
    nt.links.new(mul.outputs[0], mul2.inputs[0])
    nt.links.new(mul2.outputs[0], b.inputs["Alpha"])
    if edge:
        mx = nt.nodes.new("ShaderNodeMix")
        mx.data_type = "RGBA"
        mx.inputs["A"].default_value = (*edge, 1)
        mx.inputs["B"].default_value = (*centre, 1)
        nt.links.new(pw.outputs[0], mx.inputs["Factor"])
        nt.links.new(mx.outputs["Result"], b.inputs["Emission Color"])


SMOKE = mat("smoke", (0.62, 0.62, 0.6), 1.0)
soften(SMOKE, 0.34)
FIRE = mat("fire", (0, 0, 0), 1.0, emit=(1.0, 0.2, 0.02), strength=2.6)
soften(FIRE, 1.0, (0.9, 0.08, 0.005), (1.0, 0.32, 0.03))
HOT = mat("hot", (0, 0, 0), 1.0, emit=(1.0, 0.5, 0.1), strength=5.5)
soften(HOT, 1.0, (1.0, 0.16, 0.01), (1.0, 0.55, 0.12))
BOOM_SMOKE = mat("boomsmoke", (0.13, 0.12, 0.11), 1.0)
soften(BOOM_SMOKE, 0.34)
PUFF = None
PUFF_BY_MAT = {}


def scale_keys(o, pts):
    """pts = [(frame, scale)]; a scale of 0 keeps the object out of the picture before it is born."""
    for f, s in pts:
        o.scale = (s, s, s)
        o.keyframe_insert("scale", frame=f)


def puff(parent, loc, born, s0, s1, life, rise=0.0, material=SMOKE, drift=None):
    global PUFF
    PUFF = PUFF or puff_mesh()
    if material not in PUFF_BY_MAT:
        PUFF_BY_MAT[material] = PUFF.copy()
        PUFF_BY_MAT[material].materials.append(material)
    o = bpy.data.objects.new("puff", PUFF_BY_MAT[material])
    scene.collection.objects.link(o)
    o.parent = parent
    o.rotation_euler = (random.random() * 6, random.random() * 6, random.random() * 6)
    o.location = loc
    o.keyframe_insert("location", frame=born)
    dx, dy = drift or (random.uniform(-3, 3), random.uniform(-3, 3))
    o.location = (loc[0] + dx, loc[1] + dy, loc[2] + rise)
    o.keyframe_insert("location", frame=born + life)
    scale_keys(o, [(born - 1, 0), (born, s0), (born + life, s1)])
    return o


def fire_ball(parent, loc, at, r):
    """Explosion: a cluster of small fireballs flaring out of step, then soft dark smoke that rises."""
    global PUFF
    PUFF = PUFF or puff_mesh()
    rnd = lambda k: Vector((random.gauss(0, 1), random.gauss(0, 1), random.gauss(0, 0.7))).normalized() * k * random.random() ** 0.5
    for i in range(30):
        m = HOT if i % 3 == 0 else FIRE
        if m not in PUFF_BY_MAT:
            PUFF_BY_MAT[m] = PUFF.copy()
            PUFF_BY_MAT[m].materials.append(m)
        o = bpy.data.objects.new(f"boom{i}", PUFF_BY_MAT[m])
        scene.collection.objects.link(o)
        o.parent = parent
        o.location = Vector(loc) + rnd(r * 0.7)
        o.rotation_euler = (random.random() * 6, random.random() * 6, random.random() * 6)
        size, born = r * random.uniform(0.22, 0.5), at + i // 5
        scale_keys(o, [(born - 1, 0), (born, size * 0.4), (born + 5, size), (born + random.randint(11, 17), 0)])
    for i in range(46):
        puff(parent, tuple(Vector(loc) + rnd(r * 0.8)), at + 3 + i // 3, r * 0.1, r * random.uniform(0.22, 0.42), 120, rise=r * 0.7, material=BOOM_SMOKE)
    light = bpy.data.lights.new("boomlight", "POINT")
    light.color = (1.0, 0.6, 0.3)
    lo = bpy.data.objects.new("boomlight", light)
    scene.collection.objects.link(lo)
    lo.parent = parent
    lo.location = loc
    for f, e in ((at - 1, 0), (at + 2, r * r * 900), (at + 16, 0)):
        light.energy = e
        light.keyframe_insert("energy", frame=f)


def missile_mesh(name="msl", r=0.28, L=6.0):
    m = Mesh(name, WHITE)
    n = 12
    prof = [(0, r), (L * 0.8, r), (L * 0.93, r * 0.6), (L, 0.02)]
    rings = [[(x, math.cos(i * 2 * math.pi / n) * rr, math.sin(i * 2 * math.pi / n) * rr) for i in range(n)] for x, rr in prof]
    m.loft(rings, cap_top=True)
    for sgn in (1, -1):
        m.add([(0, sgn * r, 0), (1.2, sgn * r, 0), (0.2, sgn * 1.0, 0), (0, sgn * 1.0, 0)], [(0, 1, 2, 3)])
        m.add([(0, 0, sgn * r), (1.2, 0, sgn * r), (0.2, 0, sgn * 1.0), (0, 0, sgn * 1.0)], [(0, 1, 2, 3)])
    return m


def linear(obj):
    for f in obj.animation_data.action.layers[0].strips[0].channelbag(obj.animation_data.action.slots[0]).fcurves:
        for k in f.keyframe_points:
            k.interpolation = "LINEAR"


def shot_fleet():
    world()
    sea()
    group = empty("group")
    under_way(group, 15.0)
    cv = empty("cv", group)
    carrier(cv)
    wake(cv, -160, 2200, 22, 150, "wake-cv")
    for i, (x, y, kind) in enumerate(((760, 120, "cruiser"), (-480, 470, "dd"), (-420, -560, "dd"), (380, -640, "dd"), (-120, -300, "supply"))):
        e = empty(f"esc{i}", group)
        e.location = (x, y, 0)
        destroyer(e)
        if kind == "cruiser":
            e.scale = (1.12, 1.12, 1.12)
        if kind == "supply":
            e.scale = (1.3, 1.5, 1.0)
        wake(e, -74, 1100, 8, 60, f"wake-{i}")
    # two fighters crossing the frame high above the formation
    for j, off in enumerate((0, 60)):
        jet = jet_mesh(f"cap{j}").build(group)
        jet.scale = (2, 2, 2)
        keys(jet, [(1, (-1500 - off, 900 + off, 300)), (LEN, (1500 - off, 200 + off, 300))])
        jet.rotation_euler = (0, 0, math.atan2(-700, 3000))
        linear(jet)
    cam, tgt = camera(38)
    cam.parent = group
    tgt.parent = group
    keys(cam, [(1, (-1500, 1500, 560)), (LEN, (-900, 1750, 760))])
    keys(tgt, [(1, (60, -60, 0)), (LEN, (120, -100, 0))])


def shot_vls():
    world()
    sea()
    ship = empty("ship")
    under_way(ship, 11.0)
    destroyer(ship, cells=True)
    wake(ship, -74, 900, 8, 45)
    lidm = mat("lid", (0.32, 0.34, 0.37), 0.45, 0.3)
    storm = local(W("70", "storm"))
    z = 10.0
    base = missile_mesh().build(ship)
    base.hide_render = base.hide_viewport = True
    for n, i in enumerate(sorted(VLS_OPEN)):
        t0 = storm - 30 + n * 16 if n else local(A("69")) + 40  # the first shot lands on line 69, the rest on "storm"
        x, y = vls_cell_pos(i)
        # hatch swings open just before the shot
        lid = Mesh(f"lid{i}", lidm).box(0, CELL * 0.88, -CELL * 0.44, CELL * 0.44, 0, 0.12).build(ship)
        lid.location = (x - CELL * 0.44, y, z)
        lid.rotation_euler = (0, 0, 0)
        lid.keyframe_insert("rotation_euler", frame=t0 - 8)
        lid.rotation_euler = (0, math.radians(-105), 0)
        lid.keyframe_insert("rotation_euler", frame=t0 - 2)
        o = bpy.data.objects.new(f"m{i}", base.data)
        scene.collection.objects.link(o)
        o.parent = ship
        o.rotation_euler = (0, math.radians(-90), 0)  # nose up (missile mesh points +x)
        flame = Mesh(f"flame{i}", FIRE).cyl(0, 0, -5.5, 0, 0.05, 0.35, 10).build(o)
        flame.rotation_euler = (0, math.radians(90), 0)
        for f in range(t0 - 1, min(LEN, t0 + 70), 2):
            sec = max(0, f - t0) / FPS
            o.location = (x + sec * sec * 4, y, z - 6 + 80 * sec * sec + sec * 6)
            o.keyframe_insert("location", frame=f)
        # deck flash and billowing white smoke
        for k in range(260):
            h = k * 0.95
            sec = (-6 + math.sqrt(36 + 320 * h)) / 160  # time the missile reaches height h
            puff(ship, (x + sec * sec * 4 + random.uniform(-0.25, 0.25), y + random.uniform(-0.25, 0.25), z + h), t0 + int(sec * FPS), 0.35, 1.3 + k * 0.006 + random.random() * 0.35, 80, rise=2.5)
        for k in range(44):
            puff(ship, (x + random.uniform(-2.5, 2.5), y + random.uniform(-2.5, 2.5), z + 0.5), t0 + k // 3, 0.4, 1.6 + random.random() * 1.2, 70, rise=2.5)
        lamp = bpy.data.lights.new(f"flash{i}", "POINT")
        lamp.color = (1.0, 0.55, 0.25)
        lo = bpy.data.objects.new(f"flash{i}", lamp)
        scene.collection.objects.link(lo)
        lo.parent = ship
        lo.location = (x, y, z + 4)
        for f, e in ((t0 - 1, 0), (t0, 60000), (t0 + 20, 0)):
            lamp.energy = e
            lamp.keyframe_insert("energy", frame=f)
    cam, tgt = camera(30)
    cam.parent = ship
    tgt.parent = ship
    # low over the bow, gliding along the cells, then looking up as the storm climbs out
    keys(cam, [(1, (62, 15, 25)), (storm - 30, (68, 21, 21)), (LEN, (84, 30, 12))])
    keys(tgt, [(1, (36, 0, 9.5)), (storm - 30, (38, 0, 13)), (storm + 30, (36, 0, 30)), (LEN, (34, 0, 44))])


def shot_phalanx():
    global PUFF
    world()
    sea()
    ship = empty("ship")
    under_way(ship, 15.0)
    destroyer(ship)
    wake(ship, -74, 900, 8, 45)
    spray = local(W("81", "spraying"))
    kill = spray + 22
    # CIWS on the aft deckhouse (x -38, z 13): base, body, dome; the gun group turns to the target
    mx, my, mz = -44.0, 0.0, 13.0
    Mesh("ciws-base", SUPER).cyl(mx, my, mz, mz + 1.2, 1.7, 1.35, 32).build(ship, smooth=True)
    body = empty("ciws-turn", ship)
    body.location = (mx, my, mz + 1.2)
    Mesh("ciws-body", WHITE).cyl(0, 0, 0, 2.2, 1.02, 1.08, 32).build(body, smooth=True)
    Mesh("ciws-seam", DARK).cyl(0, 0, 2.17, 2.25, 1.1, 1.1, 32).build(body, smooth=True)
    Mesh("ciws-dome", WHITE).loft([[(math.cos(i * math.pi / 16) * r, math.sin(i * math.pi / 16) * r, z) for i in range(32)] for z, r in ((2.25, 1.1), (3.0, 1.08), (3.6, 0.92), (4.0, 0.62), (4.25, 0.25))], cap_top=True).build(body, smooth=True)
    gun = empty("ciws-gun", body)
    gun.location = (0.9, 0, 1.0)
    steel = mat("gunsteel", (0.09, 0.095, 0.1), 0.42, 0.7)
    bar = Mesh("ciws-barrels", steel)
    for k in range(6):
        a = k * math.pi / 3
        bar.cyl(math.cos(a) * 0.2, math.sin(a) * 0.2, 0, 3.4, 0.055, 0.05, 10)
    bar.cyl(0, 0, 1.25, 1.33, 0.3, 0.3, 20).cyl(0, 0, 3.15, 3.25, 0.3, 0.3, 20)  # barrel clamps
    barrels = bar.build(gun, smooth=True)
    barrels.rotation_mode = "ZYX"  # spin about the barrels' own axis, after laying them along +x
    Mesh("ciws-breech", mat("breech", (0.3, 0.32, 0.34), 0.5, 0.4)).cyl(0, 0, -0.9, 0.15, 0.4, 0.34, 20).build(gun, smooth=True).rotation_euler = (0, math.pi / 2, 0)

    # incoming missile, low over the sea, off the port beam; it dies at `kill`
    start, end = Vector((mx + 1300, my + 1500, 8)), Vector((mx + 150, my + 170, 15))  # on a bearing the camera sees
    red = mat("redm", (0.5, 0.08, 0.05), 0.5)
    m = missile_mesh("incoming", r=0.45, L=7)
    m.material = red
    msl = m.build(ship)
    d = (end - start).normalized()
    msl.rotation_euler = (0, 0, math.atan2(-d.y, -d.x))  # flying toward the ship: nose along the track
    t_in = kill - 150
    for f, k in ((1, -0.6), (t_in, 0.0), (kill, 1.0)):
        msl.location = start.lerp(end, k)
        msl.keyframe_insert("location", frame=max(1, f))
    linear(msl)
    msl.rotation_euler = (0, 0, math.atan2(d.y, d.x))
    msl.scale = (1, 1, 1)
    msl.keyframe_insert("scale", frame=kill)
    msl.scale = (0, 0, 0)
    msl.keyframe_insert("scale", frame=kill + 1)
    for k in range(90):
        p = start.lerp(end, k / 90)
        f = int(t_in + (kill - t_in) * k / 90)
        puff(ship, tuple(p), max(1, f), 0.8, 3.2 + random.random(), 90, rise=1)
    fire_ball(ship, tuple(end), kill, 26)

    # the gun tracks: searching before, on the target when it fires
    aim = lambda p: math.atan2(p.y - my, p.x - mx)
    pitch = lambda p: math.atan2(p.z - (mz + 2.2), Vector((p.x - mx, p.y - my, 0)).length)
    for f in range(1, LEN + 1, 4):
        k = (f - t_in) / (kill - t_in) if f >= t_in else 0
        p = start.lerp(end, min(1, max(0, k)))
        search = max(0, 1 - (f - (t_in - 30)) / 30) if f < t_in else 0
        body.rotation_euler = (0, 0, aim(p) + search * math.sin(f / 9) * 0.5)
        gun.rotation_euler = (0, -pitch(p), 0)
        body.keyframe_insert("rotation_euler", frame=f)
        gun.keyframe_insert("rotation_euler", frame=f)

    # barrels spin up before the burst and run down after it (40 deg/frame: 60 would look still, six barrels)
    spin = 0.0
    for f in range(1, LEN + 1):
        spin += math.radians(40) * min(1, max(0, (f - (spray - 24)) / 20)) * min(1, max(0, (kill + 40 - f) / 25))
        barrels.rotation_euler = (0, math.pi / 2, spin)
        barrels.keyframe_insert("rotation_euler", frame=f)
    linear(barrels)

    # the burst: glowing rods flying muzzle to target, plus a flickering flash at the muzzle
    muzzle = Vector((mx, my, mz + 2.2)) + Vector((math.cos(aim(end)), math.sin(aim(end)), math.tan(pitch(end)))).normalized() * 4.3
    rods(ship, muzzle, end, spray - 1, kill + 8)
    PUFF = PUFF or puff_mesh()
    fm = PUFF.copy()
    muzzle_mat = mat("muzzle", (0, 0, 0), 1.0, emit=(1.0, 0.6, 0.2), strength=22.0)
    soften(muzzle_mat, 1.0, (1.0, 0.3, 0.04), (1.0, 0.7, 0.3))
    fm.materials.append(muzzle_mat)
    flash = bpy.data.objects.new("flash", fm)
    scene.collection.objects.link(flash)
    flash.parent = ship
    flash.location = muzzle
    for f in range(spray - 2, kill + 10):
        s = (0.25 + random.random() * 0.3) if spray <= f < kill + 8 else 0
        flash.scale = (s, s, s)
        flash.keyframe_insert("scale", frame=f)

    cam, tgt = camera(26)
    cam.parent = ship
    tgt.parent = ship
    # opens tight on the gun, pulls back to put it on the right third, barrels pointing left at the threat
    keys(cam, [(1, (mx - 5.5, my + 2.6, mz + 1.7)), (spray - 20, (mx - 9, my + 1.5, mz + 2.4)), (LEN, (mx - 10, my + 1.7, mz + 2.7))])
    keys(tgt, [(1, (mx + 0.5, my + 2.6, mz + 2.4)), (spray - 20, (mx + 0.4, my + 4.9, mz + 2.7)), (LEN, (mx - 0.3, my + 5.2, mz + 3.0))])



def rods(parent, muzzle, end, f0, f1, spread=9.0, length=7.0, flight=7):
    """A stream of glowing rods from muzzle to target, one per frame, each visible only in flight."""
    tracer = bpy.data.meshes.new("rod")
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=0.05, radius2=0.05, depth=length)
    bm.to_mesh(tracer)
    bm.free()
    tracer.materials.append(mat("rod", (0, 0, 0), 1.0, emit=(1.0, 0.7, 0.3), strength=45.0))
    for f in range(f0, f1):
        r = bpy.data.objects.new("rod", tracer)
        scene.collection.objects.link(r)
        r.parent = parent
        aimp = Vector(end) + Vector((random.uniform(-spread, spread), random.uniform(-spread, spread), random.uniform(-spread * 0.66, spread * 0.66)))
        r.rotation_mode = "QUATERNION"
        dirv = (aimp - muzzle).normalized()
        r.rotation_quaternion = dirv.to_track_quat("Z", "Y")
        r.location = muzzle + dirv * (length / 2 + 0.1)
        r.keyframe_insert("location", frame=f)
        r.location = aimp
        r.keyframe_insert("location", frame=f + flight)
        scale_keys(r, [(f - 1, 0), (f, 1), (f + flight, 1), (f + flight + 1, 0)])


# ── parts for the second batch of shots ───────────────────────────────────────
def tube(m, p0, p1, r0, r1=None, n=12):
    """Closed cylinder between two points."""
    p0, p1 = Vector(p0), Vector(p1)
    r1 = r0 if r1 is None else r1
    d = (p1 - p0).normalized()
    u = d.orthogonal().normalized()
    v = d.cross(u)
    ring = lambda c, r: [tuple(c + (u * math.cos(i * 2 * math.pi / n) + v * math.sin(i * 2 * math.pi / n)) * r) for i in range(n)]
    return m.add(ring(p0, r0) + ring(p1, r1), [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)] + [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))])


def plate(m, pts, t=0.1):
    """A flat polygon with thickness: wings, fins."""
    pts = [Vector(q) for q in pts]
    nrm = (pts[1] - pts[0]).cross(pts[2] - pts[0]).normalized() * t / 2
    n = len(pts)
    return m.add([tuple(q + nrm) for q in pts] + [tuple(q - nrm) for q in pts], [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)])


def body_of(m, secs, n=16):
    """Fuselage along x; secs = (x, half width, half height, centre z), nose first."""
    return m.loft([[(x, math.cos(i * 2 * math.pi / n) * w, zc + math.sin(i * 2 * math.pi / n) * h) for i in range(n)] for x, w, h, zc in secs], cap_top=True)


def spin(obj, per_frame, axis=2):
    """Constant rotation for the whole shot (props, the radar dome)."""
    obj.rotation_euler[axis] = 0
    obj.keyframe_insert("rotation_euler", frame=1, index=axis)
    obj.rotation_euler[axis] = per_frame * (LEN - 1)
    obj.keyframe_insert("rotation_euler", frame=LEN, index=axis)
    linear(obj)


JET_PAINT = mat("jetpaint", (0.2, 0.22, 0.24), 0.5, 0.15)
weather(JET_PAINT, (0.13, 0.145, 0.16), 0.9)
JET_DARK = mat("jetdark", (0.02, 0.02, 0.022), 0.6, 0.5)


def fighter(name, parent=None):
    """Twin-tail carrier fighter, about 18 m, nose at +x."""
    root = empty(name, parent)
    m = Mesh(name + "-body", JET_PAINT)
    body_of(m, [(9.0, 0.03, 0.03, -0.12), (8.0, 0.24, 0.2, -0.12), (6.4, 0.46, 0.38, -0.06), (4.6, 0.62, 0.55, 0.02), (2.6, 0.95, 0.66, 0.04), (0, 1.25, 0.66, 0.02), (-4, 1.35, 0.6, 0), (-7, 1.15, 0.55, 0), (-8.4, 1.05, 0.5, 0)])
    for sgn in (1, -1):
        plate(m, [(2.5, sgn * 1.1, 0.05), (-3.0, sgn * 1.1, 0.05), (-4.8, sgn * 6.6, -0.1), (-3.6, sgn * 6.6, -0.1)], 0.14)
        plate(m, [(6.2, sgn * 0.42, 0.08), (2.5, sgn * 1.1, 0.05), (1.0, sgn * 1.1, 0.05)], 0.1)
        plate(m, [(-5.6, sgn * 1.1, -0.1), (-8.6, sgn * 1.1, -0.1), (-9.4, sgn * 3.5, -0.25), (-8.2, sgn * 3.5, -0.25)], 0.1)
        plate(m, [(-3.6, sgn * 0.9, 0.55), (-7.4, sgn * 0.9, 0.55), (-8.6, sgn * 1.9, 3.4), (-7.4, sgn * 1.9, 3.4)], 0.1)
        m.box(-3.5, 2.4, sgn * 0.5 - 0.42, sgn * 0.5 + 0.42, -0.95, -0.25)
        tube(m, (-3.4, sgn * 3.6, -0.75), (-0.2, sgn * 3.6, -0.75), 0.24, 0.2, 10)  # stores under the wing
        tube(m, (-2.6, sgn * 6.75, -0.1), (0.4, sgn * 6.75, -0.1), 0.07, 0.05, 8)  # wingtip missile
    m.build(root, smooth=True)
    d = Mesh(name + "-dark", JET_DARK)
    for sgn in (1, -1):
        tube(d, (-8.3, sgn * 0.55, 0), (-9.1, sgn * 0.55, 0), 0.52, 0.42, 14)
        d.box(2.32, 2.45, sgn * 0.5 - 0.36, sgn * 0.5 + 0.36, -0.9, -0.3)
    d.build(root, smooth=True)
    c = Mesh(name + "-canopy", GLASS)
    body_of(c, [(6.0, 0.03, 0.03, 0.36), (5.0, 0.36, 0.3, 0.4), (3.6, 0.4, 0.4, 0.42), (2.2, 0.28, 0.3, 0.42)], 14)
    c.build(root, smooth=True)
    return root


def prop_disc(parent, loc, r, name):
    """A spinning propeller as a faint disc plus blades that rotate."""
    hub = empty(name, parent)
    hub.location = loc
    hub.rotation_euler = (0, math.pi / 2, 0)
    disc_mat = mat(name + "-disc", (0.1, 0.1, 0.1), 0.6)
    disc_mat.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.1
    Mesh(name + "-d", disc_mat).cyl(0, 0, -0.01, 0.01, r, r, 28).build(hub)
    blades = empty(name + "-b", hub)
    # translucent: solid dark blades read as a black asterisk at video frame rates
    blade_mat = mat(name + "-blade", (0.16, 0.16, 0.16), 0.6)
    blade_mat.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.16
    bl = Mesh(name + "-bl", blade_mat)
    for k in range(8):
        a = k * math.pi / 4
        bl.add([(math.cos(a - 0.12) * 0.2, math.sin(a - 0.12) * 0.2, 0), (math.cos(a + 0.12) * 0.2, math.sin(a + 0.12) * 0.2, 0), (math.cos(a + 0.05) * r, math.sin(a + 0.05) * r, 0), (math.cos(a - 0.05) * r, math.sin(a - 0.05) * r, 0)], [(0, 1, 2, 3)])
    bl.build(blades)
    spin(blades, math.radians(47))
    return hub


def hawkeye(parent):
    """E-2 shape: high straight wing, two turboprops, four-fin tail, 7.3 m radar dome on the back. Nose at +x."""
    root = empty("e2", parent)
    pale = mat("e2paint", (0.27, 0.3, 0.33), 0.5, 0.1)
    weather(pale, (0.2, 0.225, 0.25), 1.2)
    m = Mesh("e2-body", pale)
    body_of(m, [(8.8, 0.05, 0.05, -0.35), (8.2, 0.36, 0.34, -0.4), (7.0, 0.72, 0.62, -0.35), (5.5, 0.95, 0.85, -0.12), (3, 1.05, 1.0, 0.03), (-2, 1.05, 1.0, 0.03), (-4, 0.95, 0.9, 0.1), (-6, 0.72, 0.66, 0.35), (-8, 0.42, 0.38, 0.85), (-9, 0.18, 0.18, 1.15)], 20)
    for sgn in (1, -1):
        plate(m, [(2.3, sgn * 0.6, 1.2), (-1.0, sgn * 0.6, 1.2), (-0.4, sgn * 12.3, 1.3), (1.2, sgn * 12.3, 1.3)], 0.26)
        nacm = Mesh(f"e2-nac{sgn}", pale)
        body_of(nacm, [(4.0, 0.08, 0.08, 0.75), (3.4, 0.38, 0.42, 0.75), (1.2, 0.5, 0.6, 0.72), (-2.2, 0.42, 0.45, 0.85), (-3.4, 0.1, 0.1, 1.0)], 16)
        nac = nacm.build(root, smooth=True)
        nac.location.y = sgn * 3.95
        prop_disc(root, (4.15, sgn * 3.95, 0.75), 2.05, f"e2-prop{sgn}")
        plate(m, [(-7.3, sgn * 0.2, 1.15), (-8.9, sgn * 0.2, 1.15), (-9.4, sgn * 4.4, 1.6), (-8.3, sgn * 4.4, 1.6)], 0.1)
        for fy, base in ((1.5, 1.27), (4.2, 1.58)):
            plate(m, [(-8.1, sgn * fy, base - 0.5), (-9.5, sgn * fy, base - 0.5), (-9.7, sgn * fy, base + 2.3), (-8.8, sgn * fy, base + 2.3)], 0.09)
        tube(m, (-1.0, sgn * 0.5, 1.0), (-1.4, sgn * 0.3, 2.75), 0.13, 0.11, 8)  # dome pylons
    m.build(root, smooth=True)
    dome = empty("e2-dome", root)
    dome.location = (-1.6, 0, 3.1)
    radar = mat("e2dome", (0.62, 0.64, 0.66), 0.4)
    Mesh("e2-rd", radar).loft([[(math.cos(i * math.pi / 16) * r, math.sin(i * math.pi / 16) * r, z) for i in range(32)] for r, z in ((0.05, -0.38), (3.0, -0.2), (3.65, 0), (3.0, 0.2), (0.05, 0.38))], cap_top=True).build(dome, smooth=True)
    bandm = mat("e2band", (0.03, 0.035, 0.04), 0.5)
    Mesh("e2-band", bandm).box(-0.28, 0.28, -3.0, 3.0, 0.27, 0.31).build(dome)  # dark bar so the turning reads
    spin(dome, math.radians(1.2))
    c = Mesh("e2-glass", GLASS)
    body_of(c, [(7.2, 0.03, 0.03, 0.12), (6.5, 0.6, 0.28, 0.28), (5.3, 0.72, 0.34, 0.62), (4.5, 0.5, 0.2, 0.86)], 14)
    c.build(root, smooth=True)
    return root


def drone_mesh():
    """Delta one-way attack drone, about 3.5 m long, nose at +x, pusher prop."""
    light = mat("dronepaint", (0.3, 0.31, 0.32), 0.65)
    weather(light, (0.2, 0.21, 0.22), 2.5)
    m = Mesh("drone", light)
    body_of(m, [(1.75, 0.03, 0.03, 0), (1.3, 0.12, 0.12, 0), (0.2, 0.22, 0.2, 0), (-1.3, 0.2, 0.16, 0)], 10)
    for sgn in (1, -1):
        plate(m, [(0.9, sgn * 0.1, 0), (-1.45, sgn * 0.1, 0), (-1.5, sgn * 1.25, 0), (-1.05, sgn * 1.25, 0)], 0.05)
        plate(m, [(-1.05, sgn * 1.25, 0), (-1.5, sgn * 1.25, 0), (-1.5, sgn * 1.25, 0.42), (-1.25, sgn * 1.25, 0.42)], 0.03)
    return m


DARK_SMOKE = mat("darksmoke", (0.075, 0.07, 0.068), 1.0)
soften(DARK_SMOKE, 0.62)


def nav_lights(parent, pts, color=(1.0, 0.85, 0.65), strength=60.0, r=0.28, name="lamp"):
    m = Mesh(name, mat(name, (0, 0, 0), 1.0, emit=color, strength=strength))
    for x, y, z in pts:
        m.cyl(x, y, z, z + r, r, r, 8)
    return m.build(parent)


# ── second batch of shots ─────────────────────────────────────────────────────
def shot_hawkeye():
    world(elevation=9.0, rotation=182.0)
    sea(300000, haze=((0.95, 0.93, 0.9), 2.6, 2500, 60000))
    alt = 1800.0
    air = empty("air")
    under_way(air, 150.0)
    air.location.z = alt
    plane = hawkeye(air)
    plane.rotation_euler = (math.radians(-7), 0, 0)  # banked into its orbit, the fleet under the low wing
    # the fleet far below, off the plane's left side
    mid = 150.0 * (LEN / FPS) / 2
    group = empty("group")
    group.location = (mid + 1900, 2300, 0)
    under_way_x = group.location.x
    carrier(group)
    wake(group, -160, 2000, 22, 140, "wake-cv")
    for i, (x, y) in enumerate(((620, 200), (-420, 520), (-380, -480), (300, -560))):
        e = empty(f"esc{i}", group)
        e.location = (x, y, 0)
        destroyer(e)
        wake(e, -74, 900, 8, 50, f"wake-{i}")
    cam, tgt = camera(30)
    cam.parent = air
    tgt.parent = air
    h = local(A("40"))
    # rear quarter over the dome, sliding to the beam, then pulling away so the sea opens to the horizon
    keys(cam, [(1, (-15, -24, 7)), (h, (-3, -31, 8)), (LEN, (-28, -64, 26))])
    keys(tgt, [(1, (-1, 0, 2)), (h, (0, 3, 1)), (LEN, (10, 40, -10))])


def shot_drones():
    world(elevation=8.0, rotation=220.0)
    sea()
    swarm = empty("swarm")
    under_way(swarm, 50.0)  # about 180 km/h: low and slow
    base = drone_mesh().build(swarm)
    base.hide_render = base.hide_viewport = True
    spots = ((0, 0, 16), (-14, 6, 16.6), (-28, -5, 15.6), (-42, 8, 16.3), (-56, -3, 16), (-72, 10, 16.5))
    for i, (x, y, z) in enumerate(spots):
        o = bpy.data.objects.new(f"d{i}", base.data)
        scene.collection.objects.link(o)
        o.parent = swarm
        for f in range(1, LEN + 1, 12):
            o.location = (x, y + math.sin(f / 37 + i) * 0.6, z + math.sin(f / 23 + i * 2) * 0.35)
            o.keyframe_insert("location", frame=f)
            o.rotation_euler = (math.sin(f / 29 + i) * 0.07, 0, 0)
            o.keyframe_insert("rotation_euler", frame=f)
        hub = prop_disc(o, (-1.42, 0, 0), 0.42, f"dp{i}")
        hub.rotation_euler = (0, math.pi / 2, 0)
    cam, tgt = camera(30)
    cam.parent = swarm
    tgt.parent = swarm
    w = local(A("48"))
    # close on one small drone, then back off to show the line of them skimming the water
    keys(cam, [(1, (4.6, -5.0, 19.2)), (w, (-3.5, -9.5, 21)), (LEN, (8, -13, 21.5))])
    keys(tgt, [(1, (0, 0, 16)), (w, (-5, 0, 16)), (LEN, (-25, 1, 15.5))])


def shot_cap():
    world(elevation=13.0, rotation=140.0)
    sea(300000, haze=((0.95, 0.93, 0.9), 2.6, 2500, 60000))
    air = empty("air")
    under_way(air, 200.0)
    air.location.z = 2600.0
    lead = fighter("lead", air)
    wing = fighter("wing", air)
    wing.location = (-42, 38, 7)
    for o, ph in ((lead, 0.0), (wing, 1.3)):
        for f in range(1, LEN + 1, 20):
            o.rotation_euler = (math.radians(-9) + math.sin(f / 60 + ph) * 0.05, math.sin(f / 80 + ph) * 0.015, 0)
            o.keyframe_insert("rotation_euler", frame=f)
    cam, tgt = camera(35)
    cam.parent = air
    tgt.parent = air
    # behind and below-level on the lead, easing out to its beam with the wingman in the background
    keys(cam, [(1, (-30, -15, 4.5)), (LEN // 2, (-19, -26, 5)), (LEN, (-4, -34, 7))])
    keys(tgt, [(1, (0, 0, 0.5)), (LEN // 2, (-6, 4, 0.5)), (LEN, (-12, 12, 0))])


def shot_escort():
    world(rotation=233.0, sun_color=(1.0, 0.98, 0.97))
    sea()
    ship = empty("ship")
    under_way(ship, 13.0)
    destroyer(ship, cells=True)
    wake(ship, -74, 1100, 8, 55)
    for i, (x, y) in enumerate(((780, 520), (-640, 760))):
        e = empty(f"far{i}", ship)
        e.location = (x, y, 0)
        destroyer(e)
        wake(e, -74, 900, 8, 50, f"wake-far{i}")
    cam, tgt = camera(28)
    cam.parent = ship
    tgt.parent = ship
    # low on the bow wave, rising to the beam to find the others on the horizon
    keys(cam, [(1, (150, -62, 8)), (LEN // 2, (70, -120, 14)), (LEN, (-40, -165, 30))])
    keys(tgt, [(1, (30, 0, 15)), (LEN // 2, (20, 0, 17)), (LEN, (0, 40, 16))])


def night_world(moon=0.7):
    """Dark blue sky with stars and a low moon; the sea takes its silver path from the moon lamp."""
    w = bpy.data.worlds.new("night")
    w.use_nodes = True
    nt = w.node_tree
    N, L = nt.nodes, nt.links
    tc = N.new("ShaderNodeTexCoord")
    sep = N.new("ShaderNodeSeparateXYZ")
    L.new(tc.outputs["Generated"], sep.inputs[0])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = (0.035, 0.05, 0.085, 1)
    ramp.color_ramp.elements[1].position = 0.3
    ramp.color_ramp.elements[1].color = (0.004, 0.006, 0.014, 1)
    L.new(sep.outputs["Z"], ramp.inputs[0])
    vor = N.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 260
    L.new(tc.outputs["Generated"], vor.inputs["Vector"])
    st = N.new("ShaderNodeValToRGB")
    st.color_ramp.elements[0].position = 0.0
    st.color_ramp.elements[0].color = (1, 1, 1, 1)
    st.color_ramp.elements[1].position = 0.018
    st.color_ramp.elements[1].color = (0, 0, 0, 1)
    L.new(vor.outputs["Distance"], st.inputs[0])
    add = N.new("ShaderNodeMix")
    add.data_type = "RGBA"
    add.blend_type = "ADD"
    add.inputs["Factor"].default_value = 0.5
    L.new(ramp.outputs[0], add.inputs["A"])
    L.new(st.outputs[0], add.inputs["B"])
    L.new(add.outputs["Result"], N["Background"].inputs["Color"])
    N["Background"].inputs["Strength"].default_value = 1.0
    scene.world = w
    lamp = bpy.data.lights.new("moon", "SUN")
    lamp.energy = moon
    lamp.color = (0.62, 0.72, 1.0)
    lamp.angle = math.radians(1.0)
    o = bpy.data.objects.new("moon", lamp)
    scene.collection.objects.link(o)
    o.rotation_euler = (math.radians(68), 0, math.radians(-15))
    scene.view_settings.exposure = 0.3


def shot_gravely():
    night_world()
    sea()
    ship = empty("ship")
    under_way(ship, 8.0)
    destroyer(ship)
    wake(ship, -74, 700, 8, 40)
    nav_lights(ship, [(13, 0, 36.4), (-36, 3.0, 18.4), (22, 4.2, 25), (22, -4.2, 25), (-10, 7.5, 12.6), (-10, -7.5, 12.6), (4, 7.5, 12.6), (70, 0, 12)])
    # the CIWS that does the work, on the aft deckhouse
    mx, my, mz = -44.0, 0.0, 13.0
    Mesh("ciws-b", SUPER).cyl(mx, my, mz, mz + 1.2, 1.7, 1.35, 24).build(ship, smooth=True)
    Mesh("ciws-w", WHITE).cyl(mx, my, mz + 1.2, mz + 3.4, 1.02, 1.08, 24).cyl(mx, my, mz + 3.4, mz + 5.4, 1.08, 0.5, 24).build(ship, smooth=True)
    kill, cut = local(W("88", "destroyed")), local(A("88"))
    speed = 270.0  # m/s; cruise missile
    r_at = lambda f: 1609.0 + speed * (kill - f) / FPS  # dies about a mile out, as the VO says
    pos = lambda f: Vector((0, r_at(f), 7.0))
    msl = missile_mesh("incoming", r=0.3, L=6.2).build(ship)
    msl.rotation_euler = (0, 0, -math.pi / 2)  # flying at the ship, along -y
    Mesh("incoming-flame", HOT).cyl(0, 0, -0.1, 2.6, 0.3, 0.05, 10).build(msl).rotation_euler = (0, -math.pi / 2, 0)
    keys(msl, [(1, tuple(pos(1))), (kill, tuple(pos(kill)))])
    linear(msl)
    msl.scale = (1, 1, 1)
    msl.keyframe_insert("scale", frame=kill)
    msl.scale = (0, 0, 0)
    msl.keyframe_insert("scale", frame=kill + 1)
    glow = bpy.data.lights.new("mglow", "POINT")
    glow.color = (1.0, 0.55, 0.25)
    glow.energy = 1800
    glow.keyframe_insert("energy", frame=kill)
    glow.energy = 0
    glow.keyframe_insert("energy", frame=kill + 1)
    lo = bpy.data.objects.new("mglow", glow)
    scene.collection.objects.link(lo)
    lo.parent = msl
    lo.location = (-1.6, 0, -0.8)
    lo.visible_camera = False
    fire_ball(ship, tuple(pos(kill)), kill, 34)
    muzzle = Vector((mx, my + 3.5, mz + 2.4))
    rods(ship, muzzle, pos(kill), kill - 20, kill + 2, spread=14, length=26, flight=9)
    PUFF_M = mat("muzzle2", (0, 0, 0), 1.0, emit=(1.0, 0.6, 0.2), strength=26.0)
    soften(PUFF_M, 1.0, (1.0, 0.3, 0.04), (1.0, 0.7, 0.3))
    fm = PUFF.copy()
    fm.materials.append(PUFF_M)
    flash = bpy.data.objects.new("flash", fm)
    scene.collection.objects.link(flash)
    flash.parent = ship
    flash.location = muzzle
    for f in range(kill - 22, kill + 6):
        z = (0.5 + random.random() * 0.6) if kill - 20 <= f < kill + 2 else 0
        flash.scale = (z, z, z)
        flash.keyframe_insert("scale", frame=f)
    cam, tgt = camera(26)
    cam.parent = ship
    tgt.parent = ship
    # first half: on the missile's tail, skimming the black water; hard cut to behind the ship for the kill
    pc = lambda f: pos(f) + Vector((7.5, 13, 2.2))
    keys(cam, [(1, tuple(pc(1))), (cut - 1, tuple(pc(cut - 1))), (cut, (-105, -130, 17)), (LEN, (-118, -150, 19))])
    keys(tgt, [(1, tuple(pos(1) - Vector((0, 40, 0)))), (cut - 1, tuple(pos(cut - 1) - Vector((0, 40, 0)))), (cut, (-15, 300, 17)), (LEN, (-15, 300, 21))])
    linear(cam)
    linear(tgt)
    cam.data.lens = 26
    cam.data.keyframe_insert("lens", frame=cut - 1)
    cam.data.lens = 58
    cam.data.keyframe_insert("lens", frame=cut)
    for f in cam.data.animation_data.action.layers[0].strips[0].channelbag(cam.data.animation_data.action_slot).fcurves:
        for k in f.keyframe_points:
            k.interpolation = "CONSTANT"


def slava(parent):
    """A big Soviet-style cruiser: the row of huge slanted launcher tubes either side of the bow is the giveaway."""
    half = lambda x: 10.5 * max(0.0, 1 - ((x + 15) / 108) ** 2) ** 0.55 if x > -15 else 10.5 * (1 - 0.25 * ((x + 15) / 75) ** 2)
    xs = [-90 + i * 183 / 26 for i in range(27)]
    side = [(x, half(x)) for x in xs]
    outline = side + [(x, -y) for x, y in reversed(side[1:-1])]
    zd = lambda x: 9.0 + max(0, x) * 0.04
    Mesh("sl-deck", mat("sldeck", (0.05, 0.055, 0.06), 0.8)).add([(x, y, zd(x)) for x, y in outline], [tuple(range(len(outline)))]).build(parent)
    Mesh("sl-hull", HULL).loft([[(x, y, zd(x)) for x, y in outline], [(x - max(0, x - 30) * 0.13, y * 0.86, 0) for x, y in outline], [(x * 0.97 - max(0, x - 30) * 0.24, y * 0.6, -6) for x, y in outline]], cap_top=False).build(parent, smooth=True)
    s = Mesh("sl-super", SUPER)
    s.box(-34, 20, -7.5, 7.5, 9, 16, 0.96)
    s.box(-20, 16, -5.5, 5.5, 16, 24, 0.86)
    s.box(-10, 8, -3.2, 3.2, 24, 38, 0.45)  # tower mast
    s.box(-2.5, 1, -7, 7, 34, 34.7)
    s.box(-28, -18, -2.5, 2.5, 16, 25, 0.8)  # funnel
    s.box(-64, -40, -6, 6, 9, 15, 0.92)
    s.build(parent)
    t = Mesh("sl-tubes", SUPER)
    for sgn in (1, -1):
        for k in range(8):
            y0 = sgn * (4.0 + (k % 2) * 2.1)
            x0 = 22 + k * 3.4 - (k % 2)
            tube(t, (x0, y0, 10.2 + (k % 2) * 0.1), (x0 + 15.5, y0 * 0.72, 16.5 + (k % 2) * 1.9), 1.15, 1.15, 14)
    t.build(parent, smooth=True)
    Mesh("sl-dark", DARK).box(-34.1, -33.9, -4, 4, 10, 13).box(-30, -15, 7.3, 7.5, 10, 12.5).build(parent)
    return outline


def shot_moskva():
    world(elevation=16.0, rotation=294.0, strength=0.3, sun_energy=0.9, sun_color=(0.95, 0.95, 1.0), aerosol=2.5)
    sea()
    ship = empty("ship")
    ship.rotation_euler = (math.radians(-11), math.radians(-1.5), 0)  # listing to port, down by the bow
    ship.location.z = -1.5
    slava(ship)
    # the fire amidships: a low flicker and a thick column bent by the wind
    for fx, fy, fz, n in ((-12, 5, 13, 80), (-28, 3, 12, 60), (6, 7, 11, 50)):
        for i in range(n):
            born = random.randint(-10, LEN)
            m = HOT if i % 3 == 0 else FIRE
            if m not in PUFF_BY_MAT:
                PUFF_BY_MAT[m] = (PUFF or puff_mesh()).copy()
                PUFF_BY_MAT[m].materials.append(m)
            o = bpy.data.objects.new("flame", PUFF_BY_MAT[m])
            scene.collection.objects.link(o)
            o.parent = ship
            o.location = (fx + random.uniform(-7, 7), fy + random.uniform(-3, 3), fz + random.uniform(0, 3))
            o.keyframe_insert("location", frame=born)
            o.location.z += random.uniform(5, 11)
            o.keyframe_insert("location", frame=born + 18)
            o.rotation_euler = (random.random() * 6, random.random() * 6, random.random() * 6)
            z = random.uniform(2.2, 5.0)
            scale_keys(o, [(born - 1, 0), (born, z * 0.5), (born + 6, z), (born + 18, 0)])
    life = 340
    # half the puffs, larger and denser: same look at 40% of the render time; a third shows sphere rings. v4 used 720 puffs at alpha 0.42
    for fx, fy, fz, n in ((-12, 5, 16, 165), (-28, 3, 15, 120), (6, 7, 14, 75)):
        for i in range(n):
            born = int(-life + (LEN + life) * i / n)
            puff(ship, (fx + random.uniform(-4, 4), fy + random.uniform(-2, 2), fz), born, 3.0, random.uniform(26, 48), life, rise=random.uniform(190, 260), material=DARK_SMOKE, drift=(random.uniform(-120, -80), random.uniform(-60, -25)))
    cam, tgt = camera(46)
    keys(cam, [(1, (165, 215, 26)), (LEN, (85, 250, 31))])
    keys(tgt, [(1, (-2, 0, 30)), (LEN, (-12, 0, 36))])


def ground_height(x, y, half_w=1100.0):
    from mathutils import noise

    w = half_w + 320 * noise.fractal(Vector((x / 4200, 7.3, 0)), 1.0, 2.0, 3)
    d = abs(y) - w
    k = max(0.0, min(1.0, d / 1500))
    k = k * k * (3 - 2 * k)
    return -30 + k * (70 + 420 * (0.55 + 0.6 * noise.fractal(Vector((x / 1600, y / 1600, 0.4)), 1.0, 2.1, 6)))


def land_material():
    m = bpy.data.materials.new("land")
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    b = N["Principled BSDF"]
    b.inputs["Roughness"].default_value = 0.95
    b.inputs["Specular IOR Level"].default_value = 0.1
    geo = N.new("ShaderNodeNewGeometry")
    n = N.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 0.012
    n.inputs["Detail"].default_value = 10
    n.inputs["Roughness"].default_value = 0.62
    L.new(geo.outputs["Position"], n.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.35
    ramp.color_ramp.elements[0].color = (0.1, 0.075, 0.05, 1)
    ramp.color_ramp.elements[1].position = 0.68
    ramp.color_ramp.elements[1].color = (0.36, 0.27, 0.17, 1)
    L.new(n.outputs[0], ramp.inputs[0])
    # distance haze, so ridges stack up instead of reading as one wall
    cd = N.new("ShaderNodeCameraData")
    rng = N.new("ShaderNodeMapRange")
    rng.inputs["From Min"].default_value, rng.inputs["From Max"].default_value = 300, 12000
    L.new(cd.outputs["View Distance"], rng.inputs["Value"])
    mix = N.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["B"].default_value = (0.62, 0.56, 0.5, 1)
    L.new(rng.outputs[0], mix.inputs["Factor"])
    L.new(ramp.outputs[0], mix.inputs["A"])
    L.new(mix.outputs["Result"], b.inputs["Base Color"])
    return m


def grid_mesh(name, x0, x1, y0, y1, nx, ny, hf, material):
    vs, fs = [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x, y = x0 + (x1 - x0) * i / nx, y0 + (y1 - y0) * j / ny
            vs.append((x, y, hf(x, y)))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i
            fs.append((a, a + 1, a + nx + 2, a + nx + 1))
    me = bpy.data.meshes.new(name)
    me.from_pydata(vs, [], fs)
    me.update()
    me.materials.append(material)
    me.shade_smooth()
    o = bpy.data.objects.new(name, me)
    scene.collection.objects.link(o)
    return o


def launcher_truck(parent):
    """Shore launcher: cab, flatbed, two raised canisters. Rear of the canisters at the origin of `tilt`."""
    olive = mat("truck", (0.09, 0.09, 0.06), 0.8)
    m = Mesh("truck", olive)
    m.box(-4.5, 3.2, -1.2, 1.2, 1.0, 1.5)
    m.box(3.2, 5.4, -1.2, 1.2, 1.0, 3.1, 0.92)
    for x in (-3.6, -1.4, 1.0, 4.4):
        for sgn in (1, -1):
            tube(m, (x, sgn * 1.0, 0.55), (x, sgn * 1.32, 0.55), 0.55, 0.55, 12)
    m.build(parent, smooth=True)
    can = Mesh("truck-can", mat("can", (0.14, 0.15, 0.11), 0.7))
    return can


def shot_strait():
    world(elevation=12.0, rotation=40.0, aerosol=2.5)
    sea(30000)
    land = land_material()
    grid_mesh("land", -14000, 18000, -14000, 14000, 520, 460, ground_height, land)
    group = empty("group")
    under_way(group, 12.0)
    carrier(group)
    wake(group, -160, 1600, 22, 110, "wake-cv")
    for i, x in enumerate((620, -760)):
        e = empty(f"esc{i}", group)
        e.location = (x, 60 * (-1) ** i, 0)
        destroyer(e)
        wake(e, -74, 800, 8, 45, f"wake-{i}")
    # our hill: a finer patch with a bump on it, melting back into the coarse land at its edges
    hx, hy = -150.0, 1620.0
    z0 = 215.0
    base_h = ground_height(hx, hy)
    from mathutils import noise

    def hill(x, y):
        g = math.exp(-((x - hx) ** 2 + (y - hy) ** 2) / (2 * 230.0**2))
        return ground_height(x, y) + g * (z0 - base_h + 4 * noise.fractal(Vector((x / 45, y / 45, 2.2)), 1.0, 2.1, 5))

    grid_mesh("hill", hx - 800, hx + 800, hy - 800, hy + 800, 340, 340, hill, land)
    tx, ty = hx - 8, hy - 36  # below the frame: only its missile's trail is seen
    tz = hill(tx, ty) + 0.1
    truck = empty("truck-root")
    truck.location = (tx, ty, tz)
    truck.rotation_euler = (0, 0, math.radians(-84))
    launcher_truck(truck)
    can = Mesh("truck-can", mat("can", (0.14, 0.15, 0.11), 0.7))
    for sgn in (1, -1):
        tube(can, (-4.2, sgn * 0.62, 2.0), (3.0, sgn * 0.62, 6.2), 0.5, 0.5, 14)
    can.build(truck, smooth=True)
    # the launch on "launchers": canister tip to out over the water
    t0 = local(W("115", "launchers"))
    mat_world = truck.matrix_basis
    tip = mat_world @ Vector((3.2, -0.62, 6.3))
    aim_at = Vector((60, 10, 40))
    d = (aim_at - tip).normalized()
    msl = missile_mesh("shore", r=0.26, L=5.4).build()
    msl.rotation_euler = d.to_track_quat("X", "Z").to_euler()
    msl.scale = (0, 0, 0)
    msl.keyframe_insert("scale", frame=t0 - 1)
    msl.scale = (1, 1, 1)
    msl.keyframe_insert("scale", frame=t0)
    Mesh("shore-flame", FIRE).cyl(0, 0, -0.1, 4.2, 0.3, 0.06, 10).build(msl).rotation_euler = (0, -math.pi / 2, 0)
    dist_at = lambda f: 0.5 * 70.0 * max(0, (f - t0) / FPS) ** 2 + 30 * max(0, (f - t0) / FPS)
    for f in range(t0 - 1, LEN + 1, 2):
        msl.location = tip + d * dist_at(f)
        msl.keyframe_insert("location", frame=f)
    for k in range(70):
        f = t0 + k // 2
        if f <= LEN:
            puff(None, tuple(tip + d * dist_at(f) - d * 2), f, 0.5, random.uniform(2.5, 4.5), 90, rise=2)
    for k in range(40):
        puff(None, tuple(tip - d * 7 + Vector((random.uniform(-3, 3), random.uniform(-3, 3), random.uniform(-3, 0)))), t0 + k // 4, 0.8, random.uniform(5, 9), 80, rise=3)
    cam, tgt = camera(36)
    keys(cam, [(1, (hx + 6, hy + 6, hill(hx + 6, hy + 6) + 9)), (LEN, (hx - 12, hy + 10, hill(hx - 12, hy + 10) + 10))])
    keys(tgt, [(1, (0, 60, 42)), (LEN, (40, 60, 42))])


def shot_dusk():
    world(elevation=0.9, strength=0.5, sun_energy=0.45, sun_color=(1.0, 0.68, 0.46))
    sea()
    ship = empty("ship")
    under_way(ship, 12.0)
    carrier(ship)
    wake(ship, -160, 1500, 22, 110)
    nav_lights(ship, [(x, 42 if x < 40 else 22, 20.6) for x in range(-160, 140, 22)] + [(x, -30, 20.6) for x in range(-160, 100, 26)], strength=30.0, r=0.5)
    cam, tgt = camera(44)
    cam.parent = ship
    tgt.parent = ship
    # a long slow drift off the quarter: one ship, nobody near her
    keys(cam, [(1, (-520, 410, 42)), (LEN, (-640, 470, 60))])
    keys(tgt, [(1, (-30, 0, 34)), (LEN, (-60, 0, 44))])
    scene.view_settings.exposure = -0.2


SHOT_FN = {"hook": shot_hook, "fleet": shot_fleet, "vls": shot_vls, "phalanx": shot_phalanx, "hawkeye": shot_hawkeye, "drones": shot_drones, "cap": shot_cap, "escort": shot_escort, "gravely": shot_gravely, "moskva": shot_moskva, "strait": shot_strait, "dusk": shot_dusk}
SHOT_FN[SHOT]()
bpy.ops.render.render(animation=True)
