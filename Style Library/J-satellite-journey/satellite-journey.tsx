/**
 * Style J "Satellite Journey" kit (Lucas 2026-10-26, after the Guilherme Video Editor
 * reference videos: Test/doi-thu/BAO-CAO.md). A legendary / historical journey told on a
 * real satellite map: the camera never stops, a glowing dashed route grows behind a little
 * vessel, each stop gets a decoding label and a painting card on a leader line.
 *
 * Camera exception, style J ONLY (Lucas 2026-10-26): continuous flight, slow orbit and
 * push around each stop, a 3D tilt, motion blur while flying. Still no shake or wobble.
 * Styles A–I keep their own rules.
 *
 * Map: NASA Blue Marble NG plates (public domain), cut to Web Mercator by
 * `make_plates.py` (see README) with their bounds in lon / Mercator-Y degrees. The plates
 * sit in one CSS-3D plane (bearing, tilt, perspective); every overlay is drawn flat in
 * screen space at `project()`, which applies the same maths, so labels stay upright.
 */
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { AbsoluteFill, Easing, Img, interpolate, interpolateColors, random, staticFile } from "remotion";
import { CANVAS, CLAMP, FONT, SAFE, SUB_BOTTOM, prog } from "../kit-common";
import type { SubSkin } from "../subs";

export const J = {
  white: "#F4F1EA",
  ink: "#0B1424",
  gold: "#F2C14E",
  goldDeep: "#E39B1B",
  route: "#FFFFFF",
  vessel: "#D8332F",
} as const;

/** Condensed display face for big region names (Bebas Neue, OFL), like the reference videos (BOC-TACH-HINH.md T1, T15). */
export const CONDENSED = loadBebas().fontFamily;

/** Screen point the camera looks at (centre of the map "stage"). */
export const MAP_CX = CANVAS.width / 2;
export const MAP_CY = 860;
/** CSS perspective of the tilted map plane, px. */
export const PERSP = 1800;

// ------------------------------------------------------------------ projection

/** Web Mercator y of a latitude, in degrees (so 1 unit ≈ 1° of longitude at the equator). */
export const mercY = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;

/**
 * Camera: centre (lon, lat), zoom = screen px per degree of longitude, bearing (°, clockwise)
 * and tilt (°, top edge recedes).
 */
export type JCam = { lon: number; lat: number; zoom: number; bearing: number; tilt: number };

/** Screen position (and perspective scale) of a lon/lat under the camera. */
export const project = (cam: JCam, lon: number, lat: number): [number, number, number] => {
  const dx = (lon - cam.lon) * cam.zoom;
  const dy = -(mercY(lat) - mercY(cam.lat)) * cam.zoom;
  const b = (cam.bearing * Math.PI) / 180;
  const rx = dx * Math.cos(b) - dy * Math.sin(b);
  const ry = dx * Math.sin(b) + dy * Math.cos(b);
  const t = (cam.tilt * Math.PI) / 180;
  // far below the frame at high zoom the denominator reaches 0 and points fly to ±1e9: a dashed route
  // then has billions of dashes and hangs Chrome (Ep03 at zoom 220). Cap k and clamp far off-screen points.
  const k = PERSP / Math.max(PERSP * 0.2, PERSP - ry * Math.sin(t));
  const lim = (v: number) => Math.min(20000, Math.max(-20000, v));
  return [lim(MAP_CX + rx * k), lim(MAP_CY + ry * Math.cos(t) * k), k];
};

/** Lon/lat polyline → screen points, densified so long legs bend correctly under perspective. */
export const projectLine = (cam: JCam, ll: [number, number][], step = 0.08): [number, number][] => {
  const out: [number, number][] = [];
  ll.forEach(([lon, lat], i) => {
    if (i === 0) {
      out.push(project(cam, lon, lat).slice(0, 2) as [number, number]);
      return;
    }
    const [lon0, lat0] = ll[i - 1];
    const n = Math.max(1, Math.ceil(Math.hypot(lon - lon0, lat - lat0) / step));
    for (let s = 1; s <= n; s++) {
      const p = project(cam, lon0 + ((lon - lon0) * s) / n, lat0 + ((lat - lat0) * s) / n);
      out.push([p[0], p[1]]);
    }
  });
  return out;
};

// ------------------------------------------------------------------ camera path

/**
 * A camera key: the camera starts flying to this view at frame `at` and lands `dur` frames
 * later (default from the distance). While it holds a view it keeps moving: it pushes in by
 * `push` per second (fraction of zoom) and orbits `orbit` degrees per second, so the frame is
 * never still (style J rule).
 */
export type JKey = Omit<JCam, "bearing" | "tilt"> & {
  at: number;
  bearing?: number;
  tilt?: number;
  dur?: number;
  push?: number;
  orbit?: number;
};

const FLY = Easing.inOut(Easing.cubic);
/** Shortest flight, frames (Lucas 2026-10-10: ≥ 20 frames for any camera move). */
export const MIN_FLIGHT = 24;

const flightLength = (from: JCam, to: JKey) =>
  to.dur ?? Math.round(MIN_FLIGHT + Math.min(30, Math.hypot(to.lon - from.lon, to.lat - from.lat) * 2.2));

/** Camera at frame f (30 fps). Keys must be in time order. */
export const camAt = (keys: JKey[], f: number, fps = 30): JCam => {
  const full = (k: JKey): JCam => ({ lon: k.lon, lat: k.lat, zoom: k.zoom, bearing: k.bearing ?? 0, tilt: k.tilt ?? 22 });
  // drift while holding key k since frame `since`
  const drift = (k: JKey, since: number, frame: number): JCam => {
    const s = Math.max(0, frame - since) / fps;
    const c = full(k);
    return { ...c, zoom: c.zoom * (1 + (k.push ?? 0.012) * s), bearing: c.bearing + (k.orbit ?? 0.8) * s };
  };
  let held = keys[0];
  let since = keys[0].at;
  for (const k of keys.slice(1)) {
    if (f < k.at) break;
    const from = drift(held, since, k.at);
    const dur = flightLength(from, k);
    const p = interpolate(f, [k.at, k.at + dur], [0, 1], { ...CLAMP, easing: FLY });
    if (p < 1) {
      const to = full(k);
      const dist = Math.hypot(k.lon - from.lon, k.lat - from.lat);
      // long hops climb in the middle (zoom out), like a plane
      const lift = 1 + Math.min(2.5, (dist * from.zoom) / 2600) * Math.sin(Math.PI * p);
      return {
        lon: from.lon + (to.lon - from.lon) * p,
        lat: from.lat + (to.lat - from.lat) * p,
        zoom: Math.exp(Math.log(from.zoom) + (Math.log(to.zoom) - Math.log(from.zoom)) * p) / lift,
        bearing: from.bearing + (to.bearing - from.bearing) * p,
        tilt: from.tilt + (to.tilt - from.tilt) * p,
      };
    }
    held = k;
    since = k.at + dur;
  }
  return drift(held, since, f);
};

/** How fast the camera is moving at frame f (screen px per frame at the map centre); drives motion blur. */
export const camSpeed = (keys: JKey[], f: number, fps = 30) => {
  const a = camAt(keys, f, fps);
  const b = camAt(keys, f + 1, fps);
  const [x, y] = project(a, b.lon, b.lat);
  return Math.hypot(x - MAP_CX, y - MAP_CY) + Math.abs(Math.log(b.zoom / a.zoom)) * 900;
};

// ------------------------------------------------------------------ map

export type Plate = { src: string; lon0: number; lon1: number; yTop: number; yBottom: number };

/**
 * Upgrade B1, routes across the 180° meridian or right round the world: write the route's
 * longitudes unwrapped (keep going west past −180: Guam 144.7°E becomes −215.3) and add the
 * plates again shifted by −360 (or +360) so the map continues under them.
 *   [...plates, ...shiftPlates(plates, -360)]
 */
export const shiftPlates = (plates: Plate[], dLon: number): Plate[] =>
  plates.map((p) => ({ ...p, lon0: p.lon0 + dLon, lon1: p.lon1 + dLon }));

/** Satellite plates (coarse first, finest last) in one tilted, rotated plane + vignette. */
export const SatMap: React.FC<{ cam: JCam; plates: Plate[] }> = ({ cam, plates }) => {
  const cy = mercY(cam.lat);
  const origin = `${MAP_CX}px ${MAP_CY}px`;
  return (
    // warmer, richer grade than raw Blue Marble (lesson F6: competitor map saturation ≈ 0.75 vs our 0.64)
    <AbsoluteFill style={{ background: J.ink, overflow: "hidden", perspective: PERSP, perspectiveOrigin: origin, filter: "saturate(1.5) contrast(1.18) brightness(1.08) sepia(0.06)" }}>
      <AbsoluteFill style={{ transformOrigin: origin, rotate: `x ${cam.tilt}deg`, transformStyle: "preserve-3d" }}>
        <AbsoluteFill style={{ transformOrigin: origin, rotate: `${cam.bearing}deg` }}>
          {plates.map((p) => (
            <Img
              key={`${p.src}@${p.lon0}`} // shiftPlates copies share a src
              src={staticFile(p.src)}
              style={{
                position: "absolute",
                left: MAP_CX + (p.lon0 - cam.lon) * cam.zoom,
                top: MAP_CY - (p.yTop - cy) * cam.zoom,
                width: (p.lon1 - p.lon0) * cam.zoom,
                height: (p.yTop - p.yBottom) * cam.zoom,
                maxWidth: "none",
                // top and bottom edges fade out: the world plate's polar cut is no hard line, region plates blend in
                maskImage: "linear-gradient(transparent, #000 6%, #000 94%, transparent)",
              }}
            />
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* vignette: dark corners pull the eye to the stage */}
      <AbsoluteFill
        style={{
          // T6: dark sea, deep corners and a dark band top and bottom, like the reference videos
          background: [
            "linear-gradient(rgba(2,5,12,0.75) 0%, rgba(2,5,12,0) 20%, rgba(2,5,12,0) 72%, rgba(2,5,12,0.8) 100%)",
            `radial-gradient(ellipse 75% 60% at 50% ${(MAP_CY / CANVAS.height) * 100}%, rgba(0,0,0,0) 45%, rgba(4,8,16,0.78) 100%)`,
          ].join(", "),
        }}
      />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ route + vessel

const lengths = (pts: [number, number][]) => pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));

/** The first fraction p of a screen polyline, plus the head point and heading (rad). */
export const along = (pts: [number, number][], p: number) => {
  const segs = lengths(pts);
  let left = segs.reduce((a, b) => a + b, 0) * Math.min(1, Math.max(0, p));
  const done: [number, number][] = [pts[0]];
  for (let i = 0; i < segs.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    if (left <= segs[i] || i === segs.length - 1) {
      const t = segs[i] ? Math.min(1, left / segs[i]) : 0;
      const head: [number, number] = [ax + (bx - ax) * t, ay + (by - ay) * t];
      done.push(head);
      return { done, head, heading: Math.atan2(by - ay, bx - ax) };
    }
    left -= segs[i];
    done.push(pts[i + 1]);
  }
  return { done, head: pts[0], heading: 0 };
};

/**
 * Glowing dashed route: every finished leg stays on screen (the journey visibly piles up),
 * the current leg draws on with p. `legs` are screen polylines in travel order. Legs from
 * index `theoryFrom` on are a disputed reconstruction (Ep02: the Alpine pass), drawn with
 * sparser, fainter dashes. While a leg draws, its newest stretch is a solid bright stroke
 * (the "pen"), which then settles into dashes (lesson F5).
 */
export const GlowRoute: React.FC<{ legs: [number, number][][]; current: number; p: number; theoryFrom?: number }> = ({
  legs,
  current,
  p,
  theoryFrom = Infinity,
}) => {
  const toD = (x: [number, number][]) => x.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");
  const paths = legs.slice(0, current + 1).map((leg, i) => (i < current ? leg : along(leg, p).done));
  const d = paths.filter((x) => x.length > 1).map(toD);
  // the pen: the last 15 % of the leg being drawn, solid
  const leg = legs[current];
  let pen: string | null = null;
  if (leg && p > 0 && p < 1) {
    const tail = along(leg, Math.max(0, p - 0.15)).done;
    const head = along(leg, p).done;
    pen = toD([tail[tail.length - 1], ...head.slice(tail.length - 1)]);
  }
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="jglow" filterUnits="userSpaceOnUse" x={-100} y={-100} width={CANVAS.width + 200} height={CANVAS.height + 200}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      {d.map((path, i) => {
        const theory = i >= theoryFrom;
        return (
          <g key={i} opacity={theory ? 0.8 : 1}>
            <path d={path} fill="none" stroke={J.route} strokeOpacity={theory ? 0.35 : 0.7} strokeWidth={16} strokeLinecap="round" filter="url(#jglow)" />
            <path d={path} fill="none" stroke={J.route} strokeWidth={theory ? 5 : 7} strokeLinecap="round" strokeDasharray={theory ? "6 22" : "20 12"} />
          </g>
        );
      })}
      {pen && (
        <g opacity={current >= theoryFrom ? 0.75 : 1}>
          <path d={pen} fill="none" stroke={J.route} strokeOpacity={0.9} strokeWidth={22} strokeLinecap="round" filter="url(#jglow)" />
          <path d={pen} fill="none" stroke={J.route} strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

/** Traveller icon size, px (was 156; lesson F7: read better on a phone). */
const TRAVELLER = 196;

/** The traveller: a red-sailed ship pointing along the route, with a short wake (centre = (x, y)). */
export const Vessel: React.FC<{ x: number; y: number; heading: number; f: number }> = ({ x, y, heading, f }) => {
  const bob = Math.sin(f / 6) * 2;
  const flip = Math.cos(heading) < 0 ? -1 : 1; // keep the sail upright: face left or right
  const ripple = (f % 24) / 24;
  return (
    <svg width={TRAVELLER} height={TRAVELLER} viewBox="-60 -60 120 120" style={{ position: "absolute", left: x - TRAVELLER / 2, top: y - TRAVELLER / 2 + bob, overflow: "visible" }}>
      <ellipse cx={0} cy={22} rx={40} ry={8} fill="rgba(0,0,0,0.35)" />
      <g style={{ scale: `${flip} 1` }}>
        {/* wake: two white streaks trailing the stern, drifting back */}
        <path d={`M -30 20 Q ${-52 - ripple * 6} 15 ${-74 - ripple * 10} 21`} fill="none" stroke={J.white} strokeOpacity={0.55 * (1 - ripple * 0.5)} strokeWidth={3} strokeLinecap="round" />
        <path d={`M -28 24 Q ${-46 - ripple * 6} 28 ${-64 - ripple * 10} 26`} fill="none" stroke={J.white} strokeOpacity={0.4 * (1 - ripple * 0.5)} strokeWidth={2.5} strokeLinecap="round" />
      </g>
      <g style={{ scale: `${flip} 1` }}>
        <path d="M -38 6 L 38 6 L 26 22 L -26 22 Z" fill="#3B2416" stroke={J.ink} strokeWidth={3} strokeLinejoin="round" />
        <line x1={0} y1={6} x2={0} y2={-46} stroke={J.ink} strokeWidth={4} />
        <path d="M 2 -44 C 26 -36, 30 -14, 26 0 L 2 0 Z" fill={J.vessel} stroke={J.ink} strokeWidth={3} strokeLinejoin="round" />
        <path d="M -2 -38 C -20 -30, -22 -14, -20 0 L -2 0 Z" fill="#B42320" stroke={J.ink} strokeWidth={3} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/**
 * Land traveller (kit C1, Ep02 Hannibal): three soldiers with red shields marching under a
 * red banner, same footprint as `Vessel` (centre = (x, y)). Legs swing in step; no bob of the
 * whole icon, so it never reads as camera shake.
 */
export const Army: React.FC<{ x: number; y: number; heading: number; f: number }> = ({ x, y, heading, f }) => {
  const flip = Math.cos(heading) < 0 ? -1 : 1; // march left or right, never upside down
  const wave = Math.sin(f / 5) * 4;
  return (
    <svg width={TRAVELLER} height={TRAVELLER} viewBox="-60 -60 120 120" style={{ position: "absolute", left: x - TRAVELLER / 2, top: y - TRAVELLER / 2, overflow: "visible" }}>
      <ellipse cx={0} cy={22} rx={46} ry={8} fill="rgba(0,0,0,0.35)" />
      <g style={{ scale: `${flip} 1` }}>
        <line x1={-38} y1={20} x2={-38} y2={-52} stroke={J.ink} strokeWidth={4} strokeLinecap="round" />
        <path
          d={`M -36 -52 C -24 ${-56 + wave}, -12 ${-44 - wave}, 0 ${-48 + wave} L -8 -36 C -18 ${-32 - wave}, -28 ${-40 + wave}, -36 -34 Z`}
          fill={J.vessel}
          stroke={J.ink}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {[-20, 2, 24].map((dx, i) => {
          const s = Math.sin(f / 3.5 + i * 2.1); // stride phase, staggered per soldier
          const lift = Math.max(0, s) * 2;
          return (
            <g key={dx} transform={`translate(0 ${-lift})`}>
              <line x1={dx} y1={4} x2={dx + s * 6} y2={20} stroke={J.ink} strokeWidth={4} strokeLinecap="round" />
              <line x1={dx} y1={4} x2={dx - s * 6} y2={20} stroke={J.ink} strokeWidth={4} strokeLinecap="round" />
              <rect x={dx - 6} y={-14} width={12} height={19} rx={4} fill="#3B2416" stroke={J.ink} strokeWidth={2.5} />
              <line x1={dx + 3} y1={10} x2={dx + 12} y2={-40} stroke="#6B4A2A" strokeWidth={3} strokeLinecap="round" />
              <circle cx={dx} cy={-21} r={6} fill="#B8862F" stroke={J.ink} strokeWidth={2.5} />
              <circle cx={dx + 7} cy={-4} r={9} fill={J.vessel} stroke={J.ink} strokeWidth={3} />
              <circle cx={dx + 7} cy={-4} r={2.5} fill={J.gold} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/**
 * Pilgrim on foot (kit C1, Ep04 Xuanzang): a monk in a brown robe with a book pack, leading a
 * red horse loaded with bundles. Same footprint as `Vessel`; legs swing, no bob.
 */
export const Pilgrim: React.FC<{ x: number; y: number; heading: number; f: number }> = ({ x, y, heading, f }) => {
  const flip = Math.cos(heading) < 0 ? -1 : 1;
  const s = Math.sin(f / 3.5);
  const leg = (x0: number, y0: number, ph: number, len = 18) => (
    <line x1={x0} y1={y0} x2={x0 + Math.sin(f / 3.5 + ph) * 5} y2={y0 + len} stroke={J.ink} strokeWidth={4} strokeLinecap="round" />
  );
  return (
    <svg width={TRAVELLER} height={TRAVELLER} viewBox="-60 -60 120 120" style={{ position: "absolute", left: x - TRAVELLER / 2, top: y - TRAVELLER / 2, overflow: "visible" }}>
      <ellipse cx={0} cy={24} rx={48} ry={8} fill="rgba(0,0,0,0.35)" />
      <g style={{ scale: `${flip} 1` }}>
        {/* horse behind the monk */}
        {leg(-36, 4, 0)}
        {leg(-26, 4, Math.PI)}
        {leg(-6, 4, Math.PI / 2)}
        {leg(4, 4, -Math.PI / 2)}
        <path d="M -42 -6 C -42 -16, -32 -18, -18 -18 L 4 -18 C 12 -18, 14 -24, 18 -32 L 26 -30 L 22 -16 C 20 -8, 12 4, 2 6 L -36 6 C -42 6, -44 0, -42 -6 Z" fill="#9C3B22" stroke={J.ink} strokeWidth={3} strokeLinejoin="round" />
        <rect x={-34} y={-30} width={30} height={14} rx={4} fill="#C9A76A" stroke={J.ink} strokeWidth={2.5} />
        <rect x={-30} y={-40} width={22} height={11} rx={3} fill="#8A6A3A" stroke={J.ink} strokeWidth={2.5} />
        {/* monk in front, walking */}
        <g transform="translate(28 0)">
          <line x1={-4} y1={6} x2={-4 + s * 6} y2={22} stroke={J.ink} strokeWidth={4} strokeLinecap="round" />
          <line x1={4} y1={6} x2={4 - s * 6} y2={22} stroke={J.ink} strokeWidth={4} strokeLinecap="round" />
          <path d="M -10 8 L -7 -16 C -6 -22, 6 -22, 7 -16 L 10 8 Z" fill="#7A5534" stroke={J.ink} strokeWidth={3} strokeLinejoin="round" />
          <rect x={-17} y={-22} width={10} height={22} rx={2} fill="#B8862F" stroke={J.ink} strokeWidth={2.5} />
          <circle cx={0} cy={-27} r={7} fill="#E2B98C" stroke={J.ink} strokeWidth={2.5} />
          <line x1={-6} y1={-10} x2={-30} y2={-14} stroke={J.ink} strokeWidth={2} />
        </g>
      </g>
    </svg>
  );
};

// ------------------------------------------------------------------ stop label + card

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*";

/**
 * Place label: pin, underline and an all-caps name that decodes in (random gold glyphs
 * settle into letters left to right, then the word turns white). Name sits right of the pin
 * unless `side` is "left".
 */
export const StopLabel: React.FC<{
  name: string;
  x: number;
  y: number;
  f: number;
  at: number;
  out?: number;
  side?: "left" | "right";
  size?: number;
}> = ({ name, x, y, f, at, out = Infinity, side = "right", size = 76 }) => {
  // map-anchored, so the camera can carry a label toward the platform UI: it fades out
  // before any part of it leaves the safe zone (short-form rule 1)
  // Bebas Neue caps run ~0.42 em per char (condensed face since 2026-10-30, BOC-TACH-HINH.md T15)
  const w = name.length * size * 0.46 + 30;
  const room = Math.min(
    y - size * 1.3 - SAFE.top,
    CANVAS.height - SAFE.bottom - 40 - y,
    side === "right" ? CANVAS.width - SAFE.right - (x + w) : x - w - SAFE.left,
    side === "right" ? x - 14 - SAFE.left : CANVAS.width - SAFE.right - x - 14,
  );
  const inSafe = interpolate(room, [-10, 30], [0, 1], CLAMP);
  const o = Math.min(prog(f, at, 6), out === Infinity ? 1 : 1 - prog(f, out, 8)) * inSafe;
  if (o <= 0) return null;
  const perChar = 1.6;
  const settled = at + 4 + name.length * perChar;
  const whiten = prog(f, settled, 8);
  const text = name
    .split("")
    .map((ch, i) => (ch === " " || f >= at + 4 + i * perChar ? ch : GLYPHS[Math.floor(random(`${name}-${i}-${f}`) * GLYPHS.length)]))
    .join("");
  const line = prog(f, at, 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      {/* pin */}
      <div style={{ position: "absolute", left: -11, top: -11, width: 22, height: 22, borderRadius: 11, border: `5px solid ${J.white}`, background: J.ink, boxSizing: "border-box" }} />
      <div
        style={{
          position: "absolute",
          [side === "right" ? "left" : "right"]: 18,
          top: -size * 1.1,
          fontFamily: CONDENSED,
          fontSize: size,
          letterSpacing: 2,
          whiteSpace: "nowrap",
          // the gold now lives in the scan bar; letters stay light so they read on top of it
          color: interpolateColors(whiten, [0, 1], ["#FFF3D6", J.white]),
          textShadow: "0 3px 10px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)",
          isolation: "isolate",
        }}
      >
        {/* gold scan bar sweeping behind the letters while they decode (lesson F4) */}
        <div style={{ position: "absolute", inset: `${size * 0.06}px -8px ${size * 0.18}px -8px`, overflow: "hidden", zIndex: -1, opacity: 1 - prog(f, settled, 10) }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "55%",
              left: `${-55 + prog(f, at, settled - at + 4) * 155}%`,
              background: `linear-gradient(90deg, rgba(242,193,78,0), ${J.gold} 35%, ${J.goldDeep} 65%, rgba(227,155,27,0))`,
              opacity: 0.9,
            }}
          />
        </div>
        {text}
        <div style={{ height: 5, marginTop: 2, width: `${line * 100}%`, background: J.white, borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.6)" }} />
      </div>
    </div>
  );
};

/**
 * Painting card on a leader line from the pin (x, y): rounded, thin white frame, shadow,
 * a slight 3D lean; scales in with a small overshoot (≤ 5 %), the painting inside creeps
 * (slow zoom + light sweep) so the card is never a still; fades + softens out.
 */
export const PhotoCard: React.FC<{
  src: string;
  x: number;
  y: number;
  cx: number;
  cy: number;
  w?: number;
  f: number;
  at: number;
  out?: number;
  lean?: number;
  /** 0..1: fade the painting to black-and-white (a quiet, mournful beat) */
  mono?: number;
}> = ({ src, x, y, cx, cy, w = 560, f, at, out = Infinity, lean = -4, mono = 0 }) => {
  const inP = interpolate(f, [at, at + 7, at + 12], [0, 1.04, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const outP = out === Infinity ? 0 : prog(f, out, 9);
  if (inP <= 0 || outP >= 1) return null;
  const h = (w * 3) / 4;
  const life = Math.max(0, f - at);
  const sweep = ((life % 90) / 90) * 160 - 30;
  const line = prog(f, at - 4, 8);
  // the leader joins the card edge that faces the pin
  const edge = cy < y ? cy + h / 2 : cy - h / 2;
  return (
    <>
      <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: 1 - outP }}>
        <line x1={x} y1={y} x2={x + (cx - x) * line} y2={y + (edge - y) * line} stroke={J.white} strokeWidth={4} />
        <circle cx={cx} cy={edge} r={line > 0.98 ? 7 : 0} fill={J.white} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          borderRadius: 26,
          border: `5px solid ${J.white}`,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          scale: inP * (1 - outP * 0.06),
          rotate: `${lean}deg`,
          opacity: 1 - outP,
          filter: outP > 0 ? `blur(${outP * 12}px)` : undefined,
          transformOrigin: cy < y ? "50% 100%" : "50% 0%",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.04 + life * 0.0006, filter: mono > 0 ? `grayscale(${mono}) brightness(${1 - mono * 0.12})` : undefined }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, rgba(255,240,210,0) ${sweep}%, rgba(255,240,210,0.18) ${sweep + 12}%, rgba(255,240,210,0) ${sweep + 24}%)`,
          }}
        />
      </div>
    </>
  );
};

/** Soft expanding ring on a point (for "where is it?" beats). */
export const Ring: React.FC<{ x: number; y: number; f: number; at: number; out?: number; color?: string }> = ({
  x, y, f, at, out = Infinity, color = J.gold,
}) => {
  const o = out === Infinity ? 1 : 1 - prog(f, out, 8);
  if (f < at || o <= 0) return null;
  const t = ((f - at) % 36) / 36;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      <circle cx={x} cy={y} r={14 + 70 * t} fill="none" stroke={color} strokeWidth={6} opacity={(1 - t) * 0.9} />
      <circle cx={x} cy={y} r={12} fill={color} stroke={J.ink} strokeWidth={4} />
    </svg>
  );
};

/** Red X on a forbidden passage (e.g. a strait the prophet says not to take); pops in, pulses. */
export const Cross: React.FC<{ x: number; y: number; f: number; at: number; out?: number }> = ({ x, y, f, at, out = Infinity }) => {
  const s = interpolate(f, [at, at + 6, at + 10], [0, 1.04, 1], CLAMP);
  const o = out === Infinity ? 1 : 1 - prog(f, out, 8);
  if (s <= 0 || o <= 0) return null;
  const t = ((f - at) % 40) / 40;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      <circle cx={x} cy={y} r={30 + 50 * t} fill="none" stroke="#E5383B" strokeWidth={5} opacity={(1 - t) * 0.8} />
      <g style={{ translate: `${x}px ${y}px`, scale: s }}>
        <circle r={34} fill="rgba(11,20,36,0.55)" stroke="#E5383B" strokeWidth={6} />
        <path d="M -16 -16 L 16 16 M 16 -16 L -16 16" stroke="#E5383B" strokeWidth={9} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/**
 * Hand-drawn loop around the one place that matters in a beat, drawn on like a pen stroke
 * (lesson F7, after the competitor's scribble around Ithaca). 1.15 turns of a wobbly ellipse.
 */
export const Scribble: React.FC<{ x: number; y: number; f: number; at: number; out?: number; r?: number; seed: string; color?: string }> = ({
  x,
  y,
  f,
  at,
  out = Infinity,
  r = 90,
  seed,
  color = J.gold,
}) => {
  const draw = interpolate(f, [at, at + 18], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const o = out === Infinity ? 1 : 1 - prog(f, out, 8);
  if (draw <= 0 || o <= 0) return null;
  const phase = random(seed) * 6;
  const d = Array.from({ length: 61 }, (_, i) => {
    const t = (i / 60) * Math.PI * 2 * 1.15 - 0.6;
    const k = 1 + 0.07 * Math.sin(i * 0.45 + phase) + 0.04 * (i / 60); // wobble, and the pen drifts outward on the overlap
    return [x + Math.cos(t) * r * 1.3 * k, y + Math.sin(t) * r * 0.8 * k];
  })
    .map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`)
    .join(" ");
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} fill="none" stroke={J.ink} strokeOpacity={0.5} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/**
 * The whole journey drawn fast inside the hook, then gone (BOC-TACH-HINH.md T4, reference V01 6–8 s):
 * the viewer sees how tangled the route is before the story starts. `legs` are screen polylines.
 */
export const RoutePreview: React.FC<{ legs: [number, number][][]; f: number; at: number; out: number }> = ({ legs, f, at, out }) => {
  const p = interpolate(f, [at, at + 30], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const o = interpolate(f, [at, at + 4], [0, 1], CLAMP) * (1 - prog(f, out, 10));
  if (o <= 0) return null;
  const d = along(legs.flat(), p).done.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      <defs>
        <filter id="jpreview-glow" filterUnits="userSpaceOnUse" x={-100} y={-100} width={CANVAS.width + 200} height={CANVAS.height + 200}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <path d={d} fill="none" stroke={J.route} strokeOpacity={0.7} strokeWidth={14} strokeLinecap="round" filter="url(#jpreview-glow)" />
      <path d={d} fill="none" stroke={J.route} strokeWidth={5} strokeLinecap="round" strokeDasharray="14 12" />
    </svg>
  );
};

/**
 * Highlight a whole region (country, island, sea) from Natural Earth rings (scripts/ne-regions.py),
 * after the reference videos (BOC-TACH-HINH.md T1–T3): fill, glowing white outline that draws on,
 * optional spotlight that dims everything else, and a huge condensed name set at an angle.
 *   kind "land": solid gold ~70 % (EGYPT) · "glow": the land itself brightened (ITHACA) · "sea": pale blue
 */
export const RegionFill: React.FC<{
  cam: JCam;
  rings: number[][][];
  f: number;
  at: number;
  out?: number;
  kind?: "land" | "glow" | "sea";
  color?: string;
  name?: string;
  /** degrees; the name follows the shape (e.g. −30 for Italy's boot) */
  angle?: number;
  size?: number;
  /** where the name sits (lon, lat); default: centre of the largest ring, which can be off screen for a big sea */
  nameAt?: [number, number];
  spotlight?: boolean;
  /** false for a sea made of several Natural Earth pieces: their shared edges would show as lines */
  outline?: boolean;
  /** longitude shift for unwrapped routes (B1): −360 on the far side */
  dLon?: number;
}> = ({ cam, rings, f, at, out = Infinity, kind = "land", color, name, angle = 0, size = 190, nameAt, spotlight = false, outline = true, dLon = 0 }) => {
  const inP = interpolate(f, [at, at + 12], [0, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const o = inP * (out === Infinity ? 1 : 1 - prog(f, out, 10));
  if (o <= 0) return null;
  const pts = rings.map((r) => projectLine(cam, r.map(([x, y]) => [x + dLon, y] as [number, number]), 0.5));
  const d = pts.map((r) => r.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ") + "Z").join(" ");
  const big = pts.reduce((a, b) => (b.length > a.length ? b : a), pts[0]);
  const [cx, cy] = nameAt
    ? project(cam, nameAt[0] + dLon, nameAt[1])
    : [(Math.min(...big.map((p) => p[0])) + Math.max(...big.map((p) => p[0]))) / 2, (Math.min(...big.map((p) => p[1])) + Math.max(...big.map((p) => p[1]))) / 2];
  const fill = color ?? (kind === "sea" ? "#5DB3E8" : J.gold);
  const fillO = kind === "land" ? 0.7 : kind === "sea" ? 0.32 : 0.42;
  const draw = interpolate(f, [at, at + 20], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  const textP = interpolate(f, [at + 6, at + 16], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.4)) });
  return (
    <>
      <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
        <defs>
          <filter id="jregion-glow" filterUnits="userSpaceOnUse" x={-100} y={-100} width={CANVAS.width + 200} height={CANVAS.height + 200}>
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {spotlight && <path d={`M0 0H${CANVAS.width}V${CANVAS.height}H0Z ${d}`} fill="rgba(2,6,14,0.55)" fillRule="evenodd" />}
        <path d={d} fill={fill} fillOpacity={fillO * inP} fillRule="evenodd" style={kind === "glow" ? { mixBlendMode: "screen" } : undefined} />
        {outline && (
          <>
            <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} fill="none" stroke={J.white} strokeWidth={10} strokeOpacity={0.7} filter="url(#jregion-glow)" />
            <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} fill="none" stroke={J.white} strokeWidth={3.5} strokeLinejoin="round" />
          </>
        )}
      </svg>
      {name && (
        <div
          style={{
            position: "absolute", left: cx, top: cy, translate: "-50% -50%", rotate: `${angle}deg`, scale: 0.85 + textP * 0.15, opacity: o * textP,
            fontFamily: CONDENSED, fontSize: size, lineHeight: 0.9, letterSpacing: 2, color: J.white, whiteSpace: "nowrap", textAlign: "center",
            textShadow: "0 0 24px rgba(255,255,255,0.55), 0 6px 18px rgba(0,0,0,0.5)",
          }}
        >
          {name}
        </div>
      )}
    </>
  );
};

/**
 * Channel handle, faint, low in the frame like the competitor's watermark (lesson F7).
 * Deliberately below the safe line: it is a watermark, not content, so losing it under the
 * platform UI costs nothing.
 */
export const Handle: React.FC<{ text?: string }> = ({ text = "@MappedJourneys" }) => (
  <div
    style={{
      position: "absolute", left: 0, right: 0, top: SUB_BOTTOM + 30, textAlign: "center",
      fontFamily: FONT, fontWeight: 800, fontSize: 48, letterSpacing: 2, color: J.white, opacity: 0.35, textShadow: "0 2px 8px rgba(0,0,0,0.6)",
    }}
  >
    {text}
  </div>
);

/**
 * A line on the map that is not the journey: drawn on with p, dashed, glowing in `color`
 * (e.g. the faint "direct route" of the hook, or a red rivalry line between two cities).
 */
export const GeoLine: React.FC<{ pts: [number, number][]; p: number; color: string; o?: number; width?: number }> = ({
  pts, p, color, o = 1, width = 5,
}) => {
  if (p <= 0 || o <= 0) return null;
  const d = along(pts, p).done.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      {/* own filter: a missing filter reference would hide the path */}
      <defs>
        <filter id="jglow-line" filterUnits="userSpaceOnUse" x={-100} y={-100} width={CANVAS.width + 200} height={CANVAS.height + 200}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <path d={d} fill="none" stroke={color} strokeOpacity={0.5} strokeWidth={width * 2.2} strokeLinecap="round" filter="url(#jglow-line)" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="10 12" />
    </svg>
  );
};

/**
 * Full-frame painting / illustration for a peak moment (1–2 per video): covers the map,
 * short crossfades in and out (≤ 8 frames), creeps in slowly while it holds.
 */
export const FullFrame: React.FC<{ src: string; f: number; at: number; out: number }> = ({ src, f, at, out }) => {
  const o = Math.min(prog(f, at, 8), 1 - prog(f, out - 8, 8));
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: o, background: J.ink }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.02 + Math.max(0, f - at) * 0.0007 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 65% at 50% 45%, rgba(0,0,0,0) 50%, rgba(4,8,16,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Small source credit (e.g. "According to Virgil's Aeneid"), white, inside the safe zone. */
export const SourceLine: React.FC<{ text: string; f: number; at: number; out: number; y?: number }> = ({ text, f, at, out, y = 1160 }) => {
  const o = Math.min(prog(f, at, 8), 1 - prog(f, out, 8));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 48, color: J.white, opacity: 0.88 * o, textShadow: "0 3px 12px rgba(0,0,0,0.8)" }}>
      {text}
    </div>
  );
};

// ------------------------------------------------------------------ hook text

/**
 * Hook keyword: big gold extruded number/word (stacked shadows give the 3D depth),
 * pops in, holds, fades. One element, ≤ 5 words (short-form rule 3).
 */
export const BigWord: React.FC<{ text: string; f: number; at: number; out?: number; y: number; size?: number; color?: string }> = ({
  text, f, at, out = Infinity, y, size = 210, color = J.gold,
}) => {
  const s = interpolate(f, [at, at + 6, at + 11], [0.6, 1.04, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const o = Math.min(prog(f, at, 5), out === Infinity ? 1 : 1 - prog(f, out, 7));
  if (o <= 0) return null;
  const depth = Array.from({ length: 10 }, (_, i) => `0 ${i + 1}px 0 ${J.goldDeep}`).join(", ");
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: y, textAlign: "center", opacity: o }}>
      <span
        style={{
          display: "inline-block",
          fontFamily: CONDENSED,
          fontSize: size,
          lineHeight: 0.95,
          letterSpacing: 3,
          color,
          scale: s,
          textShadow: `${depth}, 0 16px 30px rgba(0,0,0,0.65)`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** Small caps line under the hook word (white, glow). */
export const SubWord: React.FC<{ text: string; f: number; at: number; out?: number; y: number; size?: number; color?: string }> = ({
  text, f, at, out = Infinity, y, size = 84, color = J.white,
}) => {
  const o = Math.min(prog(f, at, 6), out === Infinity ? 1 : 1 - prog(f, out, 7));
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        right: SAFE.right,
        top: y,
        textAlign: "center",
        fontFamily: CONDENSED,
        fontSize: size,
        letterSpacing: 2,
        color,
        opacity: o,
        translate: `0 ${(1 - prog(f, at, 10)) * 18}px`,
        textShadow: "0 0 18px rgba(255,255,255,0.35), 0 4px 14px rgba(0,0,0,0.8)",
      }}
    >
      {text}
    </div>
  );
};

// ------------------------------------------------------------------ subtitles

/** Karaoke, one line (≤ 3 words): white, keywords/numbers pale gold, spoken word gold. */
export const JourneySub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.1, textAlign: "center", whiteSpace: "nowrap" }}>
      {lines[0].map((w, k) => (
        <span key={k}>
          {k ? " " : ""}
          <span
            style={{
              display: "inline-block",
              margin: `0 ${Math.round(w.text.length * 1.1) + 3}px`,
              scale: w.active ? 1.1 : 1,
              transformOrigin: "50% 80%",
              color: w.active ? J.gold : w.key ? "#FFE3A3" : J.white,
              WebkitTextStroke: `11px ${J.ink}`,
              paintOrder: "stroke fill",
              textShadow: "0 6px 14px rgba(0,0,0,0.5)",
            }}
          >
            {w.text}
          </span>
        </span>
      ))}
    </div>
  </div>
);
