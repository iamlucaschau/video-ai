"""
3D shots for "How Submarines Actually Fight" (Formats/Naval Board/episodes/ep02-submarines), built in code and rendered headless on the same VO cues.
Shared parts (materials, Mesh, carrier, sea, wake, world, camera) come from carrier3d.py.

  "B:/Blender/blender.exe" -b --factory-startup --python scripts/blender/sub3d.py -- <clip> [start end] [samples|preview]
    clip: hook | ping | flow | dive | snorkel | periscope | belgrano | u864 | blow | seamount | vanguard | final   -> out/3d/sub-<clip>/####.jpg
    Default 8 samples. Water haze is a shader by camera distance, foam is solid: no volumes and almost no transparency, which is what keeps it cheap.

Check first, about a minute per clip: every 30th frame at half size and 6 samples -> out/3d/sub-<clip>-preview/
  "B:/Blender/blender.exe" -b --factory-startup --python scripts/blender/sub3d.py -- <clip> "" "" preview
"""
import json
import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Vector, noise

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
SHOT = argv[0] if argv else "hook"
START = int(argv[1]) if len(argv) > 1 and argv[1] else None
END = int(argv[2]) if len(argv) > 2 and argv[2] else None
PREVIEW = len(argv) > 3 and argv[3] == "preview"
SAMPLES = 6 if PREVIEW else int(argv[3]) if len(argv) > 3 else 8
FPS = 30
random.seed(11)

# ── VO cues (same maths as Submarines.tsx A/E/W and its slot()) ───────────────
TIMING = json.load(open(os.path.join(ROOT, "src/voiceover/submarines.timing.json"), encoding="utf8"))
WORDS = json.load(open(os.path.join(ROOT, "src/voiceover/submarines.words.json"), encoding="utf8"))
PLAN = json.load(open(os.path.join(ROOT, "Formats/Naval Board/episodes/ep02-submarines/shots.json"), encoding="utf8"))
SEGS = json.load(open(os.path.join(ROOT, "Formats/Naval Board/episodes/ep02-submarines/shots.timeline.json"), encoding="utf8"))
LINES = {l["id"]: l for l in TIMING["lines"]}
A = lambda i: round(LINES[i]["start"] * FPS)
E = lambda i: round(LINES[i]["end"] * FPS)


def W(i, w):
    toks = LINES[i]["text"].split()
    norm = lambda s: "".join(c for c in s.lower() if c.isalnum())
    k = next(n for n, t in enumerate(toks) if norm(t).startswith(norm(w)))
    h = WORDS[i]
    return round(h[min(len(h) - 1, k * len(h) // len(toks))] * FPS)


CUT, XF = 6, 8
idx = next(i for i, s in enumerate(PLAN["shots"]) if s.get("clip") == SHOT)
T0 = 0 if idx == 0 else SEGS[idx]["from"] - CUT
LEN = SEGS[idx + 1]["from"] - CUT + XF - T0
local = lambda global_frame: max(1, min(LEN, global_frame - T0 + 1))  # Blender frames are 1-based

# shortcut: runs the shared block of carrier3d.py in place; move it to a module if a third script needs it.
src = open(os.path.join(ROOT, "scripts/blender/carrier3d.py"), encoding="utf8").read()
exec(compile(src[src.index("# ── scene") : src.index("# ── shots ──")], "carrier3d-shared", "exec"))

scene.render.filepath = os.path.join(ROOT, "out", "3d", f"sub-{SHOT}-preview" if PREVIEW else f"sub-{SHOT}", "")
scene.view_settings.exposure = 0.0

WATER = (0.012, 0.055, 0.085)
TILE = mat("tile", (0.085, 0.095, 0.105), 0.42, 0.0)
OLD = mat("oldhull", (0.15, 0.16, 0.155), 0.55, 0.1)
ROCK = mat("rock", (0.05, 0.06, 0.06), 0.95)
BLADE = mat("blade", (0.25, 0.2, 0.12), 0.4, 0.8)
FOAM = mat("foamsolid", (0.85, 0.92, 0.95), 0.75)
weather(OLD, (0.04, 0.05, 0.05), 0.4)
weather(ROCK, (0.11, 0.12, 0.11), 0.05)


def tiles(m, scale=0.7):
    """Anechoic tile pattern as a bump on the hull: what makes a plain cylinder read as a submarine close up."""
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    br = nt.nodes.new("ShaderNodeTexBrick")
    br.inputs["Scale"].default_value = scale
    br.inputs["Mortar Size"].default_value = 0.012
    br.inputs["Brick Width"].default_value = 1.0
    br.inputs["Row Height"].default_value = 0.5
    nt.links.new(tc.outputs["Object"], br.inputs["Vector"])
    bu = nt.nodes.new("ShaderNodeBump")
    bu.inputs["Strength"].default_value = 0.35
    bu.inputs["Distance"].default_value = 0.1
    nt.links.new(br.outputs["Fac"], bu.inputs["Height"])
    nt.links.new(bu.outputs[0], b.inputs["Normal"])


tiles(TILE)


def surface_look():
    """The hull is lit by full daylight on the surface: paint it dark, as a real one is."""
    TILE.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.022, 0.026, 0.03, 1)
    scene.view_settings.exposure = -0.9


def emit_mat(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != "OUTPUT_MATERIAL":
            nt.nodes.remove(n)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (*color, 1)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
    return m


def under_world(top=(0.03, 0.14, 0.2), low=(0.005, 0.025, 0.04), strength=1.0, sun=2.0):
    """Water seen from inside: brighter upward. Key light from above, tinted."""
    w = bpy.data.worlds.new("under")
    w.use_nodes = True
    nt = w.node_tree
    tc, sep, rng, mix = nt.nodes.new("ShaderNodeTexCoord"), nt.nodes.new("ShaderNodeSeparateXYZ"), nt.nodes.new("ShaderNodeMapRange"), nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    rng.inputs["From Min"].default_value, rng.inputs["From Max"].default_value = -0.5, 0.9
    mix.inputs["A"].default_value, mix.inputs["B"].default_value = (*low, 1), (*top, 1)
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    nt.links.new(sep.outputs[2], rng.inputs["Value"])
    nt.links.new(rng.outputs[0], mix.inputs["Factor"])
    bg = nt.nodes["Background"]
    bg.inputs["Strength"].default_value = strength
    nt.links.new(mix.outputs["Result"], bg.inputs["Color"])
    scene.world = w
    s = bpy.data.lights.new("sun", "SUN")
    s.energy = sun
    s.color = (0.62, 0.88, 1.0)
    s.angle = math.radians(14)
    o = bpy.data.objects.new("sun", s)
    scene.collection.objects.link(o)
    o.rotation_euler = (math.radians(22), math.radians(-14), 0)
    fill = bpy.data.lights.new("fill", "SUN")
    fill.energy = sun * 0.55
    fill.color = (0.5, 0.8, 0.95)
    fill.angle = math.radians(40)
    fo = bpy.data.objects.new("fill", fill)
    scene.collection.objects.link(fo)
    fo.rotation_euler = (math.radians(70), 0, math.radians(-20))
    return bg.inputs["Strength"], s


def haze(d0, d1, color=WATER, skip=()):
    """Every surface fades into the water colour with camera distance; a real volume would cost ten times more."""
    for m in bpy.data.materials:
        if m.name in skip or not m.use_nodes:
            continue
        nt = m.node_tree
        out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
        link = out.inputs["Surface"].links[0] if out.inputs["Surface"].links else None
        if not link:
            continue
        cd, rng, em, ms = nt.nodes.new("ShaderNodeCameraData"), nt.nodes.new("ShaderNodeMapRange"), nt.nodes.new("ShaderNodeEmission"), nt.nodes.new("ShaderNodeMixShader")
        rng.inputs["From Min"].default_value, rng.inputs["From Max"].default_value = d0, d1
        nt.links.new(cd.outputs["View Distance"], rng.inputs["Value"])
        em.inputs["Color"].default_value = (*color, 1)
        em.inputs["Strength"].default_value = 1.0
        src_sock = link.from_socket
        nt.links.remove(link)
        nt.links.new(rng.outputs[0], ms.inputs[0])
        nt.links.new(src_sock, ms.inputs[1])
        nt.links.new(em.outputs[0], ms.inputs[2])
        nt.links.new(ms.outputs[0], out.inputs["Surface"])


def linear(obj, pts=(), attr="location"):
    """Keys that move at constant speed between points. pts = [(frame, value)]. No pts: just make existing keys linear (carrier3d's destroyer calls it so)."""
    for f, p in pts:
        setattr(obj, attr, p)
        obj.keyframe_insert(attr, frame=f)
    for fc in obj.animation_data.action.layers[0].strips[0].channelbag(obj.animation_data.action.slots[0]).fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"


def snow(n=1400, ext=(300, 200, 120), strength=0.35, name="snow", parent=None):
    """Marine snow: one mesh of tiny tetrahedra, no transparency."""
    m = Mesh(name, emit_mat(f"{name}-m", (0.75, 0.92, 1.0), strength))
    for _ in range(n):
        x, y, z = [random.uniform(-e, e) for e in ext]
        r = random.uniform(0.02, 0.09)
        m.add([(x + r, y, z), (x - r, y + r, z), (x - r, y - r, z), (x, y, z + r * 1.6)], [(0, 1, 2), (0, 3, 1), (1, 3, 2), (2, 3, 0)])
    return m.build(parent)


def hull_rings(L, R, n=36, stern_r=0.1, flat=0.0):
    """Round bow, long parallel body, tapered stern; bow at +L/2. `flat` flattens the top of old boats."""
    rings = []
    stations = [0, 0.005, 0.015, 0.03, 0.06, 0.1, 0.15, 0.25, 0.5, 0.72, 0.8, 0.87, 0.93, 0.97, 1.0]
    for u in stations:
        if u < 0.15:
            r = R * math.sqrt(max(0.0, 1 - (1 - u / 0.15) ** 2))
        elif u > 0.72:
            k = (u - 0.72) / 0.28
            r = R * (1 - (1 - stern_r) * k**1.6)
        else:
            r = R
        r = max(r, 0.02)
        x = L / 2 - u * L
        rings.append([(x, r * math.cos(a), min(r * math.sin(a), R * (1 - flat)) ) for a in [i * 2 * math.pi / n for i in range(n)]])
    return rings


def boat(parent, L=115.0, R=5.2, material=None, kind="attack"):
    """Modern submarine, bow at +x. Returns the propeller object if there is one."""
    material = material or TILE
    m = Mesh("hull", material)
    m.loft(hull_rings(L, R), cap_top=True)
    b = m.build(parent, smooth=True)
    # sail: an ellipse lofted upward, slightly narrower at the top
    x0 = L * 0.24
    sl, sw, sh = 7.5 if kind == "attack" else 9.0, 1.5 if kind == "attack" else 2.0, 8.5
    s = Mesh("sail", material)
    rings = [[(x0 + sl * sc * math.cos(a) + (0.6 * sl * (sc - 1)), sw * sc * math.sin(a), z) for a in [i * 2 * math.pi / 28 for i in range(28)]] for z, sc in ((R * 0.85, 1.0), (R + sh * 0.7, 0.96), (R + sh, 0.9))]
    s.loft(rings, cap_top=True)
    s.build(parent, smooth=True)
    # sail planes
    pl = Mesh("planes", DARK)
    pl.box(x0 + 1.4, x0 + 4, -4.6, 4.6, R + 3.9, R + 4.15, 1.0)
    # stern fins (cross)
    st = -L / 2 + L * 0.07
    pl.box(st - 2.6, st + 3, -0.18, 0.18, 1, R * 0.95, 0.72)
    pl.box(st - 2.6, st + 3, -0.18, 0.18, -R * 0.95, -1, 0.72)
    pl.box(st - 2.6, st + 3, 1, R * 0.95, -0.18, 0.18)
    pl.box(st - 2.6, st + 3, -R * 0.95, -1, -0.18, 0.18)
    for dx, h, r in ((-1.6, 3.2, 0.3), (0.6, 2.5, 0.22), (2.6, 1.8, 0.18)):
        pl.cyl(x0 + dx, 0, R + sh - 0.2, R + sh + h, r, r * 0.8, 10)
    # flood slots low on the sides, a row of dark marks along the free-flood space
    for i in range(30):
        sx = -L * 0.3 + i * L * 0.024
        for sgn in (1, -1):
            pl.box(sx, sx + 1.3, sgn * R * 0.86 - 0.08, sgn * R * 0.86 + 0.08, -R * 0.52, -R * 0.46)
    # hatches and deck plates on top
    for i in range(6 if kind == "attack" else 0):
        for sgn in (1, -1):
            pl.cyl(L * 0.36 + i * 1.5 - 4, sgn * 0.85, R - 0.2, R + 0.02, 0.6, 0.6, 14)
    pl.box(-L * 0.28, -L * 0.1, -0.5, 0.5, R - 0.1, R + 0.03)
    pl.box(L * 0.05, L * 0.18, -0.4, 0.4, R - 0.1, R + 0.03)
    pl.build(parent)
    # pump-jet shroud
    pj = Mesh("shroud", DARK)
    n = 24
    xs = -L / 2 + 0.5
    pj.loft([[(x, r * math.cos(a), r * math.sin(a)) for a in [i * 2 * math.pi / n for i in range(n)]] for x, r in ((xs + 3.5, 1.9), (xs + 1.5, 2.2), (xs - 1.5, 2.0))], cap_top=True)
    pj.build(parent, smooth=True)
    if kind == "missile":
        tb = Mesh("turtleback", material)
        tb.loft([[(x, w * math.cos(a), R * 0.72 + h * math.sin(a)) for a in [i * 2 * math.pi / 20 for i in range(20)]] for x, w, h in ((L * 0.16, 2.2, 0.2), (L * 0.1, 4.2, 1.8), (-L * 0.2, 4.2, 1.8), (-L * 0.3, 2.2, 0.2))], cap_top=True)
        tb.build(parent, smooth=True)
    return b


def old_boat(parent, L=76.0, R=3.3, material=None):
    """Second World War boat: slim hull, deck casing, conning tower, deck gun."""
    material = material or OLD
    m = Mesh("oldhull", material)
    m.loft(hull_rings(L, R, n=20, stern_r=0.18), cap_top=True)
    m.build(parent, smooth=True)
    c = Mesh("casing", material)
    c.box(-L * 0.42, L * 0.46, -1.3, 1.3, R * 0.75, R * 1.28, 0.9)
    c.box(-4, 5, -1.6, 1.6, R * 1.25, R * 2.15, 0.82)
    c.cyl(1.2, 0, R * 2.15, R * 3.3, 0.22, 0.14, 10)
    c.cyl(-1.0, 0, R * 2.15, R * 3.0, 0.16, 0.12, 10)
    c.cyl(11, 0, R * 1.25, R * 1.6, 0.25, 0.2, 10)
    c.box(11, 15.5, -0.1, 0.1, R * 1.55, R * 1.65)
    c.build(parent)


def torpedo_mesh(name="torp"):
    m = Mesh(name, mat(f"{name}-m", (0.45, 0.47, 0.48), 0.4, 0.6))
    n = 14
    m.loft([[(x, r * math.cos(a), r * math.sin(a)) for a in [i * 2 * math.pi / n for i in range(n)]] for x, r in ((3, 0.05), (2.5, 0.27), (2, 0.27), (-3, 0.27), (-3.2, 0.1))], cap_top=True)
    return m


def run_torpedo(p0, p1, f0, f1, name, trail=True):
    """A torpedo from p0 to p1, with a bubble streak that grows behind it."""
    d = Vector(p1) - Vector(p0)
    yaw = math.atan2(d.y, d.x)
    pitch = math.atan2(d.z, math.hypot(d.x, d.y))
    t = torpedo_mesh(name).build()
    t.rotation_euler = (0, -pitch, yaw)
    t.scale = (1.8, 1.8, 1.8)
    t.location = (p0[0], p0[1], p0[2] - 2000)
    t.keyframe_insert("location", frame=max(1, f0 - 1))
    linear(t, [(f0, tuple(p0)), (f1, tuple(p1))])
    t.location = (p1[0], p1[1], p1[2] - 2000)
    t.keyframe_insert("location", frame=f1 + 1)
    if trail:
        L = d.length
        m = Mesh(f"{name}-trail", emit_mat(f"{name}-tm", (0.75, 0.92, 1.0), 0.7))
        for i in range(260):
            u = i / 260
            r = random.uniform(0.08, 0.26)
            x, y, z = u * L, random.gauss(0, 0.28 + (1 - u) * 0.8), random.gauss(0, 0.28 + (1 - u) * 0.8)
            m.add([(x + r, y, z), (x - r, y + r, z), (x - r, y - r, z), (x, y, z + r * 1.6)], [(0, 1, 2), (0, 3, 1), (1, 3, 2), (2, 3, 0)])
        o = m.build()
        o.rotation_euler = (0, -pitch, yaw)
        o.location = tuple(p0)
        o.scale = (0, 0, 0)
        o.keyframe_insert("scale", frame=max(1, f0 - 1))
        o.scale = (0.001, 1, 1)
        o.keyframe_insert("scale", frame=max(1, f0))
        linear(o, [(f0, (0.001, 1, 1)), (f1, (1, 1, 1))], "scale")
    return t


def flash(loc, f, energy=20000.0, life=20):
    """Light of a blast on the hull. The glow itself is Blast in Submarines.tsx: a solid ball here read as a lamp."""
    l = bpy.data.lights.new(f"flashl{f}", "POINT")
    l.color = (1.0, 0.8, 0.55)
    l.shadow_soft_size = 8
    o = bpy.data.objects.new(f"flashl{f}", l)
    scene.collection.objects.link(o)
    o.location = loc
    for fr, e in ((max(1, f - 1), 0.0), (f + 2, energy), (f + life, energy * 0.08), (f + life + 12, 0.0)):
        l.energy = e
        l.keyframe_insert("energy", frame=fr)


def shell(name, color, strength=1.2, thin=9.0):
    """Sound front: a sphere shell that glows at its rim, see-through in the middle. The one use of transparency."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != "OUTPUT_MATERIAL":
            nt.nodes.remove(n)
    lw, pw, e, tr, ms = nt.nodes.new("ShaderNodeLayerWeight"), nt.nodes.new("ShaderNodeMath"), nt.nodes.new("ShaderNodeEmission"), nt.nodes.new("ShaderNodeBsdfTransparent"), nt.nodes.new("ShaderNodeAddShader")
    lw.inputs["Blend"].default_value = 0.5
    pw.operation = "POWER"
    pw.inputs[1].default_value = thin
    e.inputs["Color"].default_value = (*color, 1)
    nt.links.new(lw.outputs["Facing"], pw.inputs[0])
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = strength
    nt.links.new(pw.outputs[0], mul.inputs[0])
    nt.links.new(mul.outputs[0], e.inputs["Strength"])
    nt.links.new(e.outputs[0], ms.inputs[0])
    nt.links.new(tr.outputs[0], ms.inputs[1])
    nt.links.new(ms.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
    return m


def front(loc, f0, f1, r1, material, name):
    """Expanding sound front from loc, frames f0→f1, radius 0→r1."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1, location=loc)
    o = bpy.context.object
    o.name = name
    bpy.ops.object.shade_smooth()
    o.data.materials.append(material)
    o.scale = (0.01, 0.01, 0.01)
    o.keyframe_insert("scale", frame=max(1, f0 - 1))
    linear(o, [(f0, (0.01, 0.01, 0.01)), (f1, (r1, r1, r1))], "scale")
    o.scale = (0.01, 0.01, 0.01)
    o.keyframe_insert("scale", frame=f1 + 1)
    return o


def spray(loc, f0, n, speed, size=(0.3, 1.2), spread=0.5, name="spray", life=40):
    """White water as solid chunks thrown ballistically. Solid costs a tenth of transparent smoke."""
    for i in range(n):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=random.uniform(*size), location=loc)
        o = bpy.context.object
        o.name = f"{name}{i}"
        o.data.materials.append(FOAM)
        vx, vy, vz = random.gauss(0, spread) * speed, random.gauss(0, spread) * speed, random.uniform(0.5, 1) * speed
        t0 = f0 + random.randint(0, 12)
        o.scale = (0.01, 0.01, 0.01)
        o.keyframe_insert("scale", frame=max(1, t0 - 1))
        o.scale = (1, 1, 1)
        o.keyframe_insert("scale", frame=t0 + 1)
        for k in range(0, life, 4):
            t = k / FPS
            o.location = (loc[0] + vx * t, loc[1] + vy * t, max(0.0, loc[2] + vz * t - 4.9 * t * t))
            o.keyframe_insert("location", frame=t0 + k)
        o.scale = (0.01, 0.01, 0.01)
        o.keyframe_insert("scale", frame=t0 + life)


# ── clips ─────────────────────────────────────────────────────────────────────
def shot_hook():
    """Along the hull as she goes down: the water darkens around her, and only the rim of the boat is left."""
    bg, sun = under_world(top=(0.05, 0.24, 0.33), low=(0.012, 0.06, 0.09))
    ship = empty("ship")
    boat(ship)
    s = snow(1800, (260, 160, 100))
    linear(s, [(1, (0, 0, -40)), (LEN, (-10, 0, 40))])
    linear(ship, [(1, (0, 0, 0)), (LEN, (24, 0, -4))])
    ship.rotation_euler = (0, math.radians(6), 0)
    cam, tgt = camera(32)
    keys(cam, [(1, (62, -30, 12)), (LEN // 2, (40, -22, 11)), (LEN, (-2, -24, 7))])
    keys(tgt, [(1, (46, 0, 3)), (LEN // 2, (42, 0, 2)), (LEN, (30, 0, 1))])
    for f, v in ((1, 1.0), (local(A("03")), 0.72), (local(A("05")), 0.42), (LEN, 0.3)):
        bg.default_value = v
        bg.keyframe_insert("default_value", frame=f)
        sun.energy = v * 2.2
        sun.keyframe_insert("energy", frame=f)
    haze(60, 340, (0.012, 0.05, 0.08))


def shot_ping():
    """Sonar pulse: the bright front leaves the nearer boat, lights the other, and everyone can see where it came from."""
    under_world(top=(0.015, 0.07, 0.11), low=(0.004, 0.018, 0.03), sun=1.0)
    a = empty("a")
    a.location = (-105, 0, 0)
    boat(a)
    b = empty("b")
    b.location = (105, 70, 8)
    b.rotation_euler = (0, 0, math.radians(170))
    boat(b)
    s = snow(1600, (340, 240, 120), 0.25)
    linear(s, [(1, (0, 0, 0)), (LEN, (-8, 0, 8))])
    at = local(A("52"))
    front((-47, 0, 0), at, at + 72, 340, shell("frontm", (0.5, 1.0, 0.85)), "front")
    l = bpy.data.lights.new("pulse", "POINT")
    l.color = (0.5, 1.0, 0.85)
    l.shadow_soft_size = 6
    lo = bpy.data.objects.new("pulse", l)
    scene.collection.objects.link(lo)
    lo.location = (-40, -8, 10)
    for f, e in ((max(1, at - 1), 0.0), (at + 2, 700000.0), (at + 40, 300000.0), (at + 90, 0.0)):
        l.energy = e
        l.keyframe_insert("energy", frame=f)
    cam, tgt = camera(33)
    keys(cam, [(1, (-20, -210, 34)), (LEN, (0, -190, 28))])
    keys(tgt, [(1, (0, 30, 2)), (LEN, (6, 34, 2))])
    haze(140, 620, (0.008, 0.032, 0.05), skip=("frontm",))


def shot_flow():
    """Water streaming along the hull: fast at 35 knots, then much slower running silent."""
    under_world(top=(0.04, 0.19, 0.27), low=(0.01, 0.05, 0.075))
    ship = empty("ship")
    boat(ship)
    # flow lines: thin bright dashes in one mesh that slides back past the boat at the spoken speed
    m = Mesh("streaks", emit_mat("streakm", (0.75, 0.95, 1.0), 0.8))
    for _ in range(1000):
        x, a = random.uniform(-200, 6000), random.uniform(0, 2 * math.pi)
        r = random.uniform(5.7, 16)
        y, z = r * math.cos(a), r * math.sin(a)
        L = random.uniform(5, 16)
        m.add([(x, y - 0.03, z), (x + L, y - 0.03, z), (x + L, y + 0.03, z), (x, y + 0.03, z)], [(0, 1, 2, 3)])
    st = m.build()
    slow = local(A("60"))
    linear(st, [(1, (0, 0, 0)), (slow - 16, (-(slow - 17) * 3.4, 0, 0)), (slow + 8, (-(slow - 17) * 3.4 - 36, 0, 0)), (LEN, (-(slow - 17) * 3.4 - 36 - (LEN - slow - 8) * 0.8, 0, 0))])
    s = snow(1600, (200, 120, 60))
    linear(s, [(1, (0, 0, 0)), (LEN, (-90, 0, 8))])
    cam, tgt = camera(28)
    keys(cam, [(1, (70, -62, 5)), (LEN, (40, -66, 4))])
    keys(tgt, [(1, (22, 0, 2)), (LEN, (10, 0, 2))])
    haze(70, 340, (0.012, 0.05, 0.08))


def shot_dive():
    """On the surface, vents open: columns of air, then the deck goes under."""
    world(elevation=14.0, rotation=210.0, strength=0.32, sun_energy=2.2)
    sea()
    surface_look()
    ship = empty("ship")
    boat(ship)
    start = local(W("74", "opens"))
    ship.location = (0, 0, 3.8)
    ship.keyframe_insert("location", frame=1)
    ship.keyframe_insert("location", frame=start)
    ship.location = (0, 0, -9.0)
    ship.keyframe_insert("location", frame=LEN + 40)
    for x, y in ((38, 3), (-30, -3), (46, -3), (-22, 3)):
        spray((x, y, 8.5), start, 22, 11, size=(0.25, 0.8), spread=0.25, name=f"vent{x}", life=30)
    cam, tgt = camera(36)
    keys(cam, [(1, (70, -125, 7)), (LEN, (60, -110, 6))])
    keys(tgt, [(1, (6, 0, 4)), (LEN, (4, 0, 1))])


def shot_snorkel():
    """Night, low on the water: only the masts show, cutting a wake. Everything else is hidden."""
    world(elevation=28.0, rotation=250.0, strength=0.022, sun_energy=0.55, sun_color=(0.55, 0.7, 1.0))
    sea()
    ship = empty("ship")
    under_way(ship, 3.0)
    mast = Mesh("mast", SUPER)
    mast.cyl(0, 0, -3, 4.2, 0.2, 0.15, 14)
    mast.cyl(-1.5, 0, -3, 3.4, 0.14, 0.1, 12)
    mast.box(-0.34, 0.34, -0.26, 0.26, 4.2, 4.6)
    mast.build(ship)
    wake(ship, -1.0, 170, 0.5, 9)
    foam = Mesh("collar", FOAM)
    for _ in range(90):
        x, y = random.uniform(-2.5, 1.5), random.gauss(0, 0.6)
        r = random.uniform(0.05, 0.18)
        foam.add([(x + r, y, 0.1), (x - r, y + r, 0.1), (x - r, y - r, 0.1), (x, y, 0.1 + r)], [(0, 1, 2), (0, 3, 1), (1, 3, 2), (2, 3, 0)])
    foam.build(ship)
    cam, tgt = camera(44)
    cam.parent = ship
    tgt.parent = ship
    keys(cam, [(1, (20, -26, 4.5)), (LEN, (10, -30, 4.5))])
    keys(tgt, [(1, (-7, 0, 1.6)), (LEN, (-10, 0, 1.6))])
    scene.view_settings.exposure = 0.25


def shot_periscope():
    """Sea level, a long lens: the carrier passes far off, unaware. The reticle is drawn in Remotion."""
    world(elevation=11.0, rotation=300.0, strength=0.3, sun_energy=2.0)
    sea(60000, haze=((0.75, 0.82, 0.86), 0.55, 1500, 30000))
    scene.view_settings.exposure = -0.9
    grp = empty("grp")
    under_way(grp, 11.0)
    grp.location.y = 1900
    carrier(grp)
    wake(grp, -160, 900, 22, 80)
    e = empty("esc", grp)
    e.location = (-620, 520, 0)
    destroyer(e)
    wake(e, -74, 500, 8, 40, "wake-e")
    cam, tgt = camera(110)
    keys(cam, [(1, (-120, 0, 2.6)), (LEN // 2, (-110, 0, 3.0)), (LEN, (-100, 0, 2.5))])
    mid = 11.0 * (LEN / FPS)
    keys(tgt, [(1, (0, 1900, 24)), (LEN, (mid, 1900, 26))])


def cruiser_hull(parent, L=185.0, B=21.0, draft=8.0):
    """A big gun cruiser from below: only the underwater shape shows, so a simple loft is enough."""
    m = Mesh("cruiser", mat("cruiserm", (0.015, 0.018, 0.02), 0.9))
    n = 18
    rings = []
    for u in (0, 0.03, 0.1, 0.25, 0.5, 0.75, 0.92, 1.0):
        w = B / 2 * math.sin(math.pi * min(1.0, u * 1.06 + 0.02)) ** 0.5
        rings.append([(L / 2 - u * L, w * math.cos(a), min(0.0, -draft * math.sin(a) * (0.4 + 0.6 * math.sin(math.pi * u)))) for a in [math.pi + i * math.pi / (n - 1) for i in range(n)]])
    m.loft(rings, cap_top=True)
    m.build(parent, smooth=True)


def surface_from_below(z=0.0):
    me = bpy.data.meshes.new("skin")
    S = 3000
    me.from_pydata([(-S, -S, z), (S, -S, z), (S, S, z), (-S, S, z)], [], [(0, 1, 2, 3)])
    o = bpy.data.objects.new("skin", me)
    scene.collection.objects.link(o)
    m = bpy.data.materials.new("skinm")
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        if n.type != "OUTPUT_MATERIAL":
            nt.nodes.remove(n)
    geo, nz, rmp, e = nt.nodes.new("ShaderNodeNewGeometry"), nt.nodes.new("ShaderNodeTexNoise"), nt.nodes.new("ShaderNodeValToRGB"), nt.nodes.new("ShaderNodeEmission")
    nz.inputs["Scale"].default_value = 0.03
    nz.inputs["Detail"].default_value = 2
    rmp.color_ramp.elements[0].position, rmp.color_ramp.elements[1].position = 0.3, 0.72
    rmp.color_ramp.elements[0].color = (0.025, 0.11, 0.15, 1)
    rmp.color_ramp.elements[1].color = (0.08, 0.22, 0.27, 1)
    nt.links.new(geo.outputs["Position"], nz.inputs["Vector"])
    nt.links.new(nz.outputs[0], rmp.inputs[0])
    nt.links.new(rmp.outputs[0], e.inputs["Color"])
    nt.links.new(e.outputs[0], nt.nodes["Material Output"].inputs["Surface"])
    me.materials.append(m)
    return o


def shot_belgrano():
    """From underwater, looking up: three bubble trails run at a dark hull. Two reach it. No people, no aftermath."""
    under_world(top=(0.03, 0.13, 0.18), low=(0.006, 0.03, 0.045), sun=0.8)
    surface_from_below()
    ship = empty("ship")
    ship.rotation_euler = (0, 0, math.radians(8))
    cruiser_hull(ship)
    s = snow(1600, (260, 200, 70))
    s.location = (0, 0, -80)
    linear(s, [(1, (0, 0, -80)), (LEN, (10, 0, -74))])
    hit = local(W("97", "two"))
    launch = local(W("96", "fired"))
    run_torpedo((-50, -120, -70), (-22, -9, -5), launch, hit, "t1")
    run_torpedo((-8, -122, -72), (38, -9, -5), launch + 8, hit + 9, "t2")
    run_torpedo((30, -124, -74), (130, 70, -14), launch + 16, hit + 30, "t3")
    flash((-22, -9, -6), hit)
    flash((38, -9, -6), hit + 9)
    cam, tgt = camera(20)
    keys(cam, [(1, (0, -105, -84)), (LEN, (6, -96, -80))])
    keys(tgt, [(1, (0, 0, -6)), (LEN, (6, 0, -4))])
    haze(150, 700, (0.02, 0.085, 0.12))


def shot_u864():
    """Two old boats in the dark. A faint uneven beat from the far one, then four torpedoes, the last one hits."""
    under_world(top=(0.02, 0.085, 0.125), low=(0.006, 0.026, 0.04), sun=1.5)
    near = empty("near")
    near.location = (-150, -46, 6)
    old_boat(near)
    far = empty("far")
    far.rotation_euler = (0, 0, math.radians(-8))
    far.scale = (1.15, 1.15, 1.15)
    linear(far, [(1, (40, 30, -4)), (LEN, (72, 18, -4))])
    old_boat(far)
    s = snow(1500, (320, 200, 90), 0.22)
    linear(s, [(1, (0, 0, 0)), (LEN, (-14, 0, 8))])
    heard = local(W("114", "faint"))
    beats = shell("beatm", (1.0, 0.45, 0.32), 0.7, 12.0)
    # an engine misfiring: pulses at uneven gaps
    f = max(1, heard - 30)
    i = 0
    gaps = [34, 20, 58, 26, 44, 18, 62, 30]
    fire = local(W("117", "fired"))
    while f < fire:
        front((40 + 32 * f / LEN, 30 - 12 * f / LEN, -4), f, f + 60, 130, beats, f"beat{i}")
        f += gaps[i % len(gaps)]
        i += 1
    hit = local(E("117") - 10)
    span = hit - fire
    hx, hy = 40 + 32 * hit / LEN + 18, 30 - 12 * hit / LEN
    bow = (-112, -46, 6)
    run_torpedo(bow, (hx + 60, hy + 34, -24), fire, fire + span // 2 + 6, "a1")
    run_torpedo(bow, (hx + 80, hy + 14, 24), fire + 6, fire + span // 2 + 12, "a2")
    run_torpedo(bow, (hx + 70, hy - 30, -10), fire + 12, fire + span // 2 + 18, "a3")
    run_torpedo(bow, (hx, hy, -4), fire + 18, hit, "a4")
    flash((hx, hy, -4), hit, 60000.0, 16)
    cam, tgt = camera(42)
    keys(cam, [(1, (-205, -120, 26)), (LEN, (-190, -112, 24))])
    keys(tgt, [(1, (-30, 0, 0)), (LEN, (-10, 0, -2))])
    haze(200, 640, (0.009, 0.038, 0.058), skip=("beatm",))


def shot_blow():
    """The bow bursts out of the sea in a wall of white water."""
    world(elevation=30.0, rotation=170.0, strength=0.3, sun_energy=2.2)
    sea()
    surface_look()
    ship = empty("ship")
    ship.rotation_euler = (0, math.radians(-24), 0)
    boat(ship)
    t0 = local(W("122", "emergency") - 4)
    ship.location = (0, 0, -34)
    ship.keyframe_insert("location", frame=1)
    ship.keyframe_insert("location", frame=t0)
    ship.location = (6, 0, 7)
    ship.keyframe_insert("location", frame=min(LEN, t0 + 44))
    ship.location = (10, 0, 5)
    ship.keyframe_insert("location", frame=LEN)
    spray((42, 0, 0), t0 + 4, 320, 15, size=(0.12, 0.8), spread=0.5, name="sp1", life=56)
    spray((22, 0, 0), t0 + 10, 240, 11, size=(0.12, 0.7), spread=0.6, name="sp2", life=48)
    spray((8, 0, 0), t0 + 18, 160, 7, size=(0.15, 0.9), spread=0.9, name="sp3", life=40)
    cam, tgt = camera(34)
    keys(cam, [(1, (120, -120, 6)), (LEN, (112, -116, 8))])
    keys(tgt, [(1, (40, 0, 8)), (LEN, (34, 0, 16))])


def seamount_mesh(hx=900.0, hy=500.0, top=260.0):
    """Rough slope ahead: a grid raised by noise, its peak at the origin."""
    n = 120
    vs, fs = [], []
    for j in range(n + 1):
        for i in range(n + 1):
            x, y = -hx + 2 * hx * i / n, -hy + 2 * hy * j / n
            d = math.hypot(x / 340, y / 260)
            h = top * math.exp(-d * d)
            h += 26 * noise.noise(Vector((x / 90, y / 90, 0))) + 8 * noise.noise(Vector((x / 22, y / 22, 3)))
            vs.append((x, y, h - top * 0.52))
    for j in range(n):
        for i in range(n):
            a = j * (n + 1) + i
            fs.append((a, a + 1, a + n + 2, a + n + 1))
    me = bpy.data.meshes.new("mount")
    me.from_pydata(vs, [], fs)
    me.update()
    me.shade_smooth()
    me.materials.append(ROCK)
    o = bpy.data.objects.new("mount", me)
    scene.collection.objects.link(o)
    return o


def shot_seamount():
    """Running fast in the dark. The slope comes out of the water ahead of the bow; cut before she reaches it."""
    under_world(top=(0.03, 0.12, 0.17), low=(0.008, 0.035, 0.05), sun=2.0)
    ship = empty("ship")
    boat(ship)
    speed = 12.0
    m = seamount_mesh()
    m.location = (speed * (LEN / FPS) + 420, 0, 0)
    linear(ship, [(1, (0, 0, 0)), (LEN, (speed * (LEN / FPS), 0, 0))])
    s = snow(1800, (300, 150, 80), 0.3)
    s.parent = ship
    linear(s, [(1, (40, 0, 0)), (LEN, (-60, 0, 0))])
    cam, tgt = camera(26)
    cam.parent = ship
    tgt.parent = ship
    keys(cam, [(1, (-88, -46, 14)), (LEN, (-104, -52, 16))])
    keys(tgt, [(1, (40, 0, 2)), (LEN, (90, 0, 14))])
    haze(120, 520, (0.012, 0.05, 0.075))


def shot_vanguard():
    """Two big missile boats drift together at walking pace in the dark. A slight touch, a slow lean. No blast."""
    under_world(top=(0.025, 0.11, 0.16), low=(0.007, 0.03, 0.046), sun=2.4)
    a = empty("a")
    boat(a, 149.0, 6.5, kind="missile")
    b = empty("b")
    boat(b, 138.0, 6.0, kind="missile")
    touch = local(W("139", "collided"))
    a.location = (-30, -5, 0)
    linear(a, [(1, (-34, -24, -2)), (touch, (0, -12.6, 0)), (LEN, (10, -14.5, -1.2))])
    b.rotation_euler = (0, 0, math.radians(180 + 5))
    linear(b, [(1, (34, 22, 8)), (touch, (0, 0.2, 6.8)), (LEN, (-10, 2.0, 7.8))])
    s = snow(1600, (220, 150, 70), 0.25)
    linear(s, [(1, (0, 0, 0)), (LEN, (-4, 0, 6))])
    cam, tgt = camera(28)
    keys(cam, [(1, (28, -130, 32)), (LEN, (10, -116, 28))])
    keys(tgt, [(1, (0, -6, 2)), (LEN, (0, -6, 2))])
    haze(90, 420, (0.01, 0.042, 0.064))


def shot_final():
    """From behind: she goes away from us and is gone."""
    under_world(top=(0.03, 0.14, 0.2), low=(0.007, 0.035, 0.052), sun=1.5)
    ship = empty("ship")
    linear(ship, [(1, (20, 0, 0)), (LEN, (20 + 12.0 * (LEN / FPS), 0, -8))])
    boat(ship)
    s = snow(1600, (200, 120, 80), 0.3)
    linear(s, [(1, (40, 0, 0)), (LEN, (10, 0, 6))])
    cam, tgt = camera(34)
    keys(cam, [(1, (-58, -48, 12)), (LEN, (-46, -40, 8))])
    keys(tgt, [(1, (24, 0, 2)), (LEN, (70, 0, -3))])
    haze(70, 300, (0.01, 0.045, 0.07))


SHOT_FN = {"hook": shot_hook, "ping": shot_ping, "flow": shot_flow, "dive": shot_dive, "snorkel": shot_snorkel, "periscope": shot_periscope, "belgrano": shot_belgrano, "u864": shot_u864, "blow": shot_blow, "seamount": shot_seamount, "vanguard": shot_vanguard, "final": shot_final}
SHOT_FN[SHOT]()
if SHOT == "seamount":
    scene.render.use_persistent_data = False  # with it on, the hull rendered solid black in runs of frames; alone they were right
bpy.ops.render.render(animation=True)
