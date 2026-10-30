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

/** Screen point the camera looks at (centre of the map "stage", above the subtitles). */
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
  const k = PERSP / (PERSP - ry * Math.sin(t));
  return [MAP_CX + rx * k, MAP_CY + ry * Math.cos(t) * k, k];
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

/** Satellite plates (coarse first, finest last) in one tilted, rotated plane + vignette. */
export const SatMap: React.FC<{ cam: JCam; plates: Plate[] }> = ({ cam, plates }) => {
  const cy = mercY(cam.lat);
  const origin = `${MAP_CX}px ${MAP_CY}px`;
  return (
    <AbsoluteFill style={{ background: J.ink, overflow: "hidden", perspective: PERSP, perspectiveOrigin: origin }}>
      <AbsoluteFill style={{ transformOrigin: origin, rotate: `x ${cam.tilt}deg`, transformStyle: "preserve-3d" }}>
        <AbsoluteFill style={{ transformOrigin: origin, rotate: `${cam.bearing}deg` }}>
          {plates.map((p) => (
            <Img
              key={p.src}
              src={staticFile(p.src)}
              style={{
                position: "absolute",
                left: MAP_CX + (p.lon0 - cam.lon) * cam.zoom,
                top: MAP_CY - (p.yTop - cy) * cam.zoom,
                width: (p.lon1 - p.lon0) * cam.zoom,
                height: (p.yTop - p.yBottom) * cam.zoom,
                maxWidth: "none",
              }}
            />
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* vignette: dark corners pull the eye to the stage */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 60% at 50% ${(MAP_CY / CANVAS.height) * 100}%, rgba(0,0,0,0) 45%, rgba(4,8,16,0.72) 100%)`,
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
 * sparser, fainter dashes.
 */
export const GlowRoute: React.FC<{ legs: [number, number][][]; current: number; p: number; theoryFrom?: number }> = ({
  legs,
  current,
  p,
  theoryFrom = Infinity,
}) => {
  const paths = legs.slice(0, current + 1).map((leg, i) => (i < current ? leg : along(leg, p).done));
  const d = paths.filter((x) => x.length > 1).map((x) => x.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" "));
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="jglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {d.map((path, i) => {
        const theory = i >= theoryFrom;
        return (
          <g key={i} opacity={theory ? 0.8 : 1}>
            <path d={path} fill="none" stroke={J.route} strokeOpacity={theory ? 0.3 : 0.55} strokeWidth={12} strokeLinecap="round" filter="url(#jglow)" />
            <path d={path} fill="none" stroke={J.route} strokeWidth={theory ? 5 : 6} strokeLinecap="round" strokeDasharray={theory ? "6 22" : "16 14"} />
          </g>
        );
      })}
    </svg>
  );
};

/** The traveller: a small red-sailed ship pointing along the route (centre = (x, y)). */
export const Vessel: React.FC<{ x: number; y: number; heading: number; f: number }> = ({ x, y, heading, f }) => {
  const bob = Math.sin(f / 6) * 2;
  const flip = Math.cos(heading) < 0 ? -1 : 1; // keep the sail upright: face left or right
  return (
    <svg width={156} height={156} viewBox="-60 -60 120 120" style={{ position: "absolute", left: x - 78, top: y - 78 + bob, overflow: "visible" }}>
      <ellipse cx={0} cy={22} rx={40} ry={8} fill="rgba(0,0,0,0.35)" />
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
    <svg width={156} height={156} viewBox="-60 -60 120 120" style={{ position: "absolute", left: x - 78, top: y - 78, overflow: "visible" }}>
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
}> = ({ name, x, y, f, at, out = Infinity, side = "right", size = 56 }) => {
  // map-anchored, so the camera can carry a label toward the platform UI: it fades out
  // before any part of it leaves the safe zone (short-form rule 1)
  // Bricolage 800 caps run ~0.66 em per char (measured on Ep02 "NEW CARTHAGE"); 0.62 let it poke out
  const w = name.length * size * 0.68 + 30;
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
          top: -size * 1.2,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: 1,
          whiteSpace: "nowrap",
          color: interpolateColors(whiten, [0, 1], [J.gold, J.white]),
          textShadow: "0 3px 10px rgba(0,0,0,0.75), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
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
        <filter id="jglow-line" x="-20%" y="-20%" width="140%" height="140%">
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
  text, f, at, out = Infinity, y, size = 150, color = J.gold,
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
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
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
  text, f, at, out = Infinity, y, size = 64, color = J.white,
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
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
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
