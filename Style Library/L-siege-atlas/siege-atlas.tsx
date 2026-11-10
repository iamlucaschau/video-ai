/**
 * Style L "Thế Trận" kit (Lucas 2026-11-01, after the History Maps Lore analysis:
 * Test/History Maps Lore/BAO-CAO.md, decisions D1–D12). One confrontation told on a
 * parchment political map: who held what in that year, a date chip on every beat, a
 * magnifier for the small place, the leader on a hanging banner, campaign arrows, and a
 * place · year end card.
 *
 * Built on the style J engine (same projection and camera keys) with style I camera rules
 * (D6): fly only when the place changes, eased, ≥ 22 frames, slow push ≤ 5 % / 3 s,
 * no orbit, no tilt, no motion blur. Text: Bebas Neue ≥ 48 px, ≤ 2 blocks besides the
 * karaoke subtitles (D3, D4); the one serif is the end card (D5).
 *
 * Map: parchment plates from `scripts/atlas-plates.py` (Blue Marble recoloured) with one
 * transparent overlay per faction and plate (`<plate>-<faction>.png`), placed in the same
 * plane as the plates, so faction colour follows the real coastline at every zoom.
 */
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile } from "remotion";
import { CANVAS, CLAMP, FONT, SAFE, SUB_BOTTOM, prog } from "../kit-common";
import type { SubSkin } from "../subs";
import { CONDENSED, MAP_CX, MAP_CY, along, mercY, type JCam, type JKey, type Plate } from "../J-satellite-journey/satellite-journey";

export { CONDENSED, MAP_CX, MAP_CY, camAt, project, projectLine, along, type JCam, type Plate } from "../J-satellite-journey/satellite-journey";

export const L = {
  ink: "#1C262B",
  paper: "#F2E6C9",
  gold: "#D9B25B",
  goldDeep: "#A9812F",
  sea: "#2F4550",
} as const;

/** End-card serif (D5: the only serif in the style, ≤ 2 words + year). */
export const SERIF = loadCinzel("normal", { weights: ["700", "900"] }).fontFamily;

/** Style I camera (D6): no orbit, no tilt, push 1 % / s (3 % / 3 s). */
export const key = (k: Omit<JKey, "bearing" | "tilt" | "orbit"> & { push?: number }): JKey => ({ push: 0.01, ...k, orbit: 0, bearing: 0, tilt: 0 });

// ------------------------------------------------------------------ map

/** A faction layer: overlay suffix (`<plate>-<id>.png`), opacity, optional circular reveal from a point (0..1 of `REVEAL_R`). */
export type Layer = { id: string; o: number; from?: [number, number]; reveal?: number };
/** Screen radius of a full reveal: one radius for every plate, so coarse and fine plates grow in step. */
const REVEAL_R = 1800;

const box = (cam: JCam, p: Plate) => {
  const cy = mercY(cam.lat);
  return {
    left: MAP_CX + (p.lon0 - cam.lon) * cam.zoom,
    top: MAP_CY - (p.yTop - cy) * cam.zoom,
    width: (p.lon1 - p.lon0) * cam.zoom,
    height: (p.yTop - p.yBottom) * cam.zoom,
  };
};

/** Parchment plates (coarse first, finest last) + faction overlays, flat (no tilt / bearing in style L). */
export const AtlasMap: React.FC<{ cam: JCam; plates: Plate[]; layers?: Layer[]; vignette?: boolean }> = ({ cam, plates, layers = [], vignette = true }) => (
  <AbsoluteFill style={{ background: L.sea, overflow: "hidden" }}>
    {plates.map((p) => {
      const b = box(cam, p);
      const base = p.src.replace(/\.jpg$/, "");
      return (
        <div key={p.src} style={{ position: "absolute", ...b, maskImage: "linear-gradient(transparent, #000 4%, #000 96%, transparent)" }}>
          <Img src={staticFile(p.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none" }} />
          {layers.map((l) => {
            if (l.o <= 0) return null;
            // circular reveal from a lon/lat, in this plate's own pixels
            let mask: string | undefined;
            if (l.from && (l.reveal ?? 1) < 1) {
              const x = (l.from[0] - p.lon0) * cam.zoom;
              const y = (p.yTop - mercY(l.from[1])) * cam.zoom;
              const r = (l.reveal ?? 1) * REVEAL_R;
              mask = `radial-gradient(circle at ${x}px ${y}px, #000 ${r}px, transparent ${r + 60}px)`;
            }
            return (
              <Img
                key={l.id}
                src={staticFile(`${base}-${l.id}.png`)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", maxWidth: "none", opacity: l.o, maskImage: mask }}
              />
            );
          })}
        </div>
      );
    })}
    {vignette && (
      <AbsoluteFill
        style={{
          background: [
            "linear-gradient(rgba(20,26,30,0.55) 0%, rgba(20,26,30,0) 16%, rgba(20,26,30,0) 78%, rgba(20,26,30,0.6) 100%)",
            `radial-gradient(ellipse 80% 62% at 50% ${(MAP_CY / CANVAS.height) * 100}%, rgba(0,0,0,0) 55%, rgba(20,26,30,0.5) 100%)`,
          ].join(", "),
        }}
      />
    )}
  </AbsoluteFill>
);

// ------------------------------------------------------------------ date chip

/** Date chip (T4): dark plaque, thin gold rule, condensed caps; drops in from above. Sits at the top of the safe zone. */
export const DateChip: React.FC<{ text: string; f: number; at: number; out?: number; y?: number }> = ({ text, f, at, out = Infinity, y = SAFE.top + 40 }) => {
  const inP = prog(f, at, 10);
  const o = Math.min(inP, out === Infinity ? 1 : 1 - prog(f, out, 8));
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: o, translate: `0 ${(1 - inP) * -40}px` }}>
      <div
        style={{
          fontFamily: CONDENSED, fontSize: 64, letterSpacing: 8, color: L.paper, padding: "8px 34px 4px",
          background: "rgba(28,38,43,0.92)", border: `3px solid ${L.gold}`, borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", gap: 22,
        }}
      >
        <span style={{ width: 12, height: 12, background: L.gold, rotate: "45deg", marginTop: -6 }} />
        {text}
        <span style={{ width: 12, height: 12, background: L.gold, rotate: "45deg", marginTop: -6 }} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ place label + flag

/** Place label: point + dark plaque that opens sideways (not a fade: AGENTS short-form rule 5). Fades only near the safe edge. */
export const Plaque: React.FC<{ name: string; x: number; y: number; f: number; at: number; out?: number; side?: "left" | "right"; size?: number }> = ({
  name, x, y, f, at, out = Infinity, side = "right", size = 60,
}) => {
  const w = name.length * size * 0.46 + 44;
  const room = Math.min(
    y - size - SAFE.top,
    CANVAS.height - SAFE.bottom - 60 - y,
    side === "right" ? CANVAS.width - SAFE.right - (x + 18 + w) : x - 18 - w - SAFE.left,
    side === "right" ? x - 12 - SAFE.left : CANVAS.width - SAFE.right - x - 12, // the point itself
  );
  const inSafe = interpolate(room, [-10, 20], [0, 1], CLAMP);
  const open = prog(f, at, 9);
  const o = (out === Infinity ? 1 : 1 - prog(f, out, 8)) * inSafe;
  if (open <= 0 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: L.paper, border: `4px solid ${L.ink}`, boxSizing: "border-box", scale: prog(f, at - 4, 6) }} />
      <div
        style={{
          position: "absolute", top: -size * 0.68, [side === "right" ? "left" : "right"]: 20,
          fontFamily: CONDENSED, fontSize: size, letterSpacing: 3, whiteSpace: "nowrap", color: L.paper,
          background: "rgba(28,38,43,0.88)", padding: "4px 16px 0", borderRadius: 4, boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          clipPath: side === "right" ? `inset(0 ${(1 - open) * 100}% 0 0)` : `inset(0 0 0 ${(1 - open) * 100}%)`,
        }}
      >
        {name}
      </div>
    </div>
  );
};

/** Faction flag on a pole (T2): the pole grows, then the cloth unfurls and waves slightly. */
export const Flag: React.FC<{ x: number; y: number; f: number; at: number; out?: number; color: string; mark?: "disc" | "lambda"; scale?: number }> = ({
  x, y, f, at, out = Infinity, color, mark = "disc", scale = 1,
}) => {
  const pole = prog(f, at, 8);
  const cloth = prog(f, at + 6, 10);
  const o = out === Infinity ? 1 : 1 - prog(f, out, 8);
  if (pole <= 0 || o <= 0) return null;
  const wave = Math.sin((f - at) / 9) * 3;
  const H = 86 * pole;
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" style={{ position: "absolute", left: x - 10, top: y - 110, opacity: o, overflow: "visible", scale, transformOrigin: "10px 110px" }}>
      <ellipse cx={10} cy={110} rx={12} ry={4} fill="rgba(0,0,0,0.35)" />
      <line x1={10} y1={110} x2={10} y2={110 - H} stroke={L.ink} strokeWidth={5} strokeLinecap="round" />
      {cloth > 0 && (
        <g style={{ scale: `${cloth} 1`, transformOrigin: "10px 0px" }}>
          <path d={`M10 ${110 - H} L74 ${110 - H + wave} L66 ${110 - H + 22 + wave / 2} L74 ${110 - H + 44 + wave} L10 ${110 - H + 44} Z`} fill={color} stroke={L.ink} strokeWidth={3} strokeLinejoin="round" />
          {mark === "disc" ? (
            <circle cx={38} cy={110 - H + 22 + wave / 3} r={10} fill={L.gold} stroke={L.ink} strokeWidth={2} />
          ) : (
            <path d={`M28 ${110 - H + 34} L38 ${110 - H + 10} L48 ${110 - H + 34}`} fill="none" stroke={L.paper} strokeWidth={5} strokeLinejoin="round" />
          )}
        </g>
      )}
    </svg>
  );
};

// ------------------------------------------------------------------ magnifier

/**
 * Magnifier (T5): a circle at (x, y) showing the map around `target` at `zoom`, joined to
 * the target's point on the main map by two tangent lines. `children` draw on top of the
 * inner map (inner coordinates: the target sits at the circle centre).
 */
export const Magnifier: React.FC<{
  plates: Plate[];
  layers?: Layer[];
  target: [number, number];
  zoom: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  r?: number;
  f: number;
  at: number;
  out?: number;
  children?: React.ReactNode;
}> = ({ plates, layers, target, zoom, tx, ty, x, y, r = 230, f, at, out = Infinity, children }) => {
  const s = interpolate(f, [at, at + 12], [0, 1], { ...CLAMP, easing: Easing.out(Easing.back(1.2)) });
  const o = out === Infinity ? 1 : 1 - prog(f, out, 8);
  if (s <= 0 || o <= 0) return null;
  const R = r * s;
  // tangent points of the lines from (tx, ty) to the circle
  const d = Math.hypot(x - tx, y - ty);
  const base = Math.atan2(ty - y, tx - x);
  const a = Math.acos(Math.min(1, R / Math.max(d, R + 1)));
  const t1 = [x + R * Math.cos(base + a), y + R * Math.sin(base + a)];
  const t2 = [x + R * Math.cos(base - a), y + R * Math.sin(base - a)];
  const inner: JCam = { lon: target[0], lat: target[1], zoom: zoom * (1 + 0.006 * Math.max(0, f - at) / 30), bearing: 0, tilt: 0 };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${tx} ${ty} L${t1[0]} ${t1[1]} M${tx} ${ty} L${t2[0]} ${t2[1]}`} stroke={L.paper} strokeWidth={3} strokeOpacity={0.9} />
        <circle cx={tx} cy={ty} r={14} fill="none" stroke={L.paper} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: CANVAS.width, height: CANVAS.height, clipPath: `circle(${R}px at ${x}px ${y}px)` }}>
        <div style={{ position: "absolute", left: x - MAP_CX, top: y - MAP_CY, width: CANVAS.width, height: CANVAS.height }}>
          <AtlasMap cam={inner} plates={plates} layers={layers} vignette={false} />
          {children}
        </div>
      </div>
      <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0 }}>
        <circle cx={x} cy={y} r={R} fill="none" stroke={L.paper} strokeWidth={7} />
        <circle cx={x} cy={y} r={R + 6} fill="none" stroke={L.ink} strokeWidth={3} strokeOpacity={0.6} />
      </svg>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ banner portrait

/** Leader on a hanging banner (T3): gold rod, cloth in the faction colour that unrolls downward, portrait, name plate. */
export const Banner: React.FC<{ src: string; name: string; x: number; y: number; f: number; at: number; out?: number; color: string; w?: number }> = ({
  src, name, x, y, f, at, out = Infinity, color, w = 300,
}) => {
  const rod = prog(f, at, 8);
  const unroll = prog(f, at + 4, 16, Easing.out(Easing.quad));
  const o = out === Infinity ? 1 : 1 - prog(f, out, 8);
  if (rod <= 0 || o <= 0) return null;
  const h = w * 1.28;
  const sway = Math.sin((f - at) / 22) * 0.8;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, opacity: o, rotate: `${sway}deg`, transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", left: -24, right: -24, top: -10, height: 16, borderRadius: 8, background: `linear-gradient(${L.gold}, ${L.goldDeep})`, scale: `${rod} 1`, boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "relative", height: h, clipPath: `inset(0 0 ${(1 - unroll) * 100}% 0)` }}>
        <div
          style={{
            position: "absolute", inset: 0, background: color, border: `4px solid ${L.gold}`, borderTop: "none",
            clipPath: "polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.35)",
          }}
        />
        <div style={{ position: "absolute", left: w * 0.1, top: w * 0.1, width: w * 0.8, height: w * 0.8, border: `4px solid ${L.gold}`, overflow: "hidden", background: L.ink }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.03 + Math.max(0, f - at) * 0.0005 }} />
        </div>
      </div>
      <div
        style={{
          position: "absolute", left: "50%", top: h - 8, translate: "-50% 0", whiteSpace: "nowrap",
          fontFamily: CONDENSED, fontSize: 52, letterSpacing: 4, color: L.paper, background: L.ink, padding: "4px 18px 0",
          border: `3px solid ${L.gold}`, borderRadius: 4, opacity: prog(f, at + 14, 8),
        }}
      >
        {name}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ campaign arrow

/** Campaign arrow (T6): a thick line in the faction colour drawn on along screen points, with a head that rides the tip. */
export const CampaignArrow: React.FC<{ pts: [number, number][]; p: number; color: string; o?: number; width?: number }> = ({ pts, p, color, o = 1, width = 16 }) => {
  if (p <= 0 || o <= 0 || pts.length < 2) return null;
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let left = total * p;
  const done: [number, number][] = [pts[0]];
  let ang = 0;
  for (let i = 0; i < seg.length && left > 0; i++) {
    const k = Math.min(1, left / seg[i]);
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    done.push([x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]);
    ang = Math.atan2(y1 - y0, x1 - x0);
    left -= seg[i];
  }
  const d = done.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");
  const [hx, hy] = done[done.length - 1];
  const hs = width * 2.4;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      <path d={d} fill="none" stroke={L.ink} strokeOpacity={0.55} strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <g style={{ translate: `${hx}px ${hy}px`, rotate: `${ang}rad` }}>
        <path d={`M${hs * 0.55} 0 L${-hs * 0.45} ${-hs * 0.55} L${-hs * 0.2} 0 L${-hs * 0.45} ${hs * 0.55} Z`} fill={color} stroke={L.ink} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Number / keyword chip in a faction colour (≤ 5 words, AGENTS rule 3): pops up from a point with a short stem. */
export const NumberChip: React.FC<{ text: string; x: number; y: number; f: number; at: number; out?: number; color: string; size?: number }> = ({
  text, x, y, f, at, out = Infinity, color, size = 84,
}) => {
  const s = interpolate(f, [at, at + 6, at + 10], [0, 1.05, 1], CLAMP);
  const o = out === Infinity ? 1 : 1 - prog(f, out, 6);
  if (s <= 0 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -100%", opacity: o, scale: s, transformOrigin: "50% 100%" }}>
      <div style={{ fontFamily: CONDENSED, fontSize: size, letterSpacing: 3, lineHeight: 1, color: L.paper, background: color, padding: "8px 22px 2px", border: `4px solid ${L.paper}`, borderRadius: 8, boxShadow: "0 10px 26px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>
        {text}
      </div>
      <div style={{ width: 4, height: 26, margin: "0 auto", background: L.paper }} />
    </div>
  );
};

/** "Squeeze": two dark wedges closing on a point (a narrow pass) inside a magnifier. */
export const Pinch: React.FC<{ x: number; y: number; f: number; at: number; out?: number; angle?: number; gap?: number }> = ({ x, y, f, at, out = Infinity, angle = 0, gap = 26 }) => {
  const p = prog(f, at, 14, Easing.inOut(Easing.cubic));
  const o = out === Infinity ? 1 : 1 - prog(f, out, 8);
  if (p <= 0 || o <= 0) return null;
  const d = gap + (1 - p) * 120;
  const wedge = (dir: 1 | -1) => (
    <path d={`M0 ${dir * d} L-46 ${dir * (d + 70)} L46 ${dir * (d + 70)} Z`} fill={L.ink} fillOpacity={0.85} stroke={L.gold} strokeWidth={4} strokeLinejoin="round" />
  );
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      <g style={{ translate: `${x}px ${y}px`, rotate: `${angle}deg` }}>
        {wedge(-1)}
        {wedge(1)}
        <circle r={9} fill={L.gold} stroke={L.ink} strokeWidth={3} />
      </g>
    </svg>
  );
};

/** Fleet (T6 at sea): `n` ship glyphs in the faction colour following a screen route, the lead ship at progress p. */
export const Fleet: React.FC<{ pts: [number, number][]; p: number; n?: number; gap?: number; color: string; o?: number; f: number; size?: number }> = ({
  pts, p, n = 7, gap = 0.035, color, o = 1, f, size = 1.7,
}) => {
  if (p <= 0 || o <= 0 || pts.length < 2) return null;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      {Array.from({ length: n }, (_, i) => {
        const q = p - i * gap;
        if (q <= 0) return null;
        const { head, heading } = along(pts, q);
        const bob = Math.sin((f + i * 11) / 8) * 1.5;
        return (
          <g key={i} style={{ translate: `${head[0]}px ${head[1] + bob}px`, scale: size }}>
            <path d="M-17 4 L17 4 L11 12 L-11 12 Z" fill={L.ink} />
            <g style={{ scale: `${Math.cos(heading) < 0 ? -1 : 1} 1` }}>
              <path d="M-2 3 L-2 -22 L15 2 Z" fill={color} stroke={L.ink} strokeWidth={2.5} strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Army as a crowd of dots (T13 "how many"): `n` dots scattered in an ellipse round (x, y), appearing
 * in a quick staggered wave; `keep` (0..1) thins the crowd (e.g. "historians think far fewer").
 */
export const Host: React.FC<{ x: number; y: number; rx: number; ry: number; n: number; f: number; at: number; out?: number; keep?: number; color: string; seed: string; dot?: number }> = ({
  x, y, rx, ry, n, f, at, out = Infinity, keep = 1, color, seed, dot = 7,
}) => {
  const o = out === Infinity ? 1 : 1 - prog(f, out, 10);
  if (f < at || o <= 0) return null;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      {Array.from({ length: n }, (_, i) => {
        const a = random(`${seed}-a-${i}`) * Math.PI * 2;
        const r = Math.sqrt(random(`${seed}-r-${i}`));
        const show = prog(f, at + (i / n) * 18, 6) * (i / n < keep ? 1 : 1 - prog(f, at, 1));
        const drop = i / n >= keep;
        if (show <= 0 || drop) return null;
        return <circle key={i} cx={x + Math.cos(a) * r * rx} cy={y + Math.sin(a) * r * ry} r={dot * show} fill={color} stroke={L.ink} strokeWidth={1.5} />;
      })}
    </svg>
  );
};

/** A path drawn on as a dashed line (e.g. the mountain track that turned the pass), with a moving head dot. */
export const Trail: React.FC<{ pts: [number, number][]; p: number; color: string; o?: number; width?: number }> = ({ pts, p, color, o = 1, width = 7 }) => {
  if (p <= 0 || o <= 0) return null;
  const { done, head } = along(pts, p);
  const d = done.map(([a, b], i) => `${i ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0, opacity: o }}>
      <path d={d} fill="none" stroke={L.ink} strokeOpacity={0.5} strokeWidth={width + 5} strokeLinecap="round" strokeDasharray="14 10" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="14 10" />
      <circle cx={head[0]} cy={head[1]} r={width * 1.4} fill={color} stroke={L.paper} strokeWidth={3} />
    </svg>
  );
};

// ------------------------------------------------------------------ end card + subtitles

/** End card (T14, D5): place in gold serif caps, year between two rules. Comes in by tracking in (letters close up), not a plain fade. */
export const EndCard: React.FC<{ place: string; year: string; f: number; at: number; y?: number }> = ({ place, year, f, at, y = 1010 }) => {
  const p = prog(f, at, 18);
  if (p <= 0) return null;
  const rule = prog(f, at + 8, 12);
  // Cinzel caps run ~0.95 em: size the word to the safe width, including the widest tracking of the entrance
  const room = CANVAS.width - SAFE.left - SAFE.right - 40;
  const size = Math.min(104, room / (place.length * 0.95 + (place.length * 12) / 104));
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: y, textAlign: "center", opacity: Math.min(1, p * 1.6) }}>
      {/* dark glow behind the gold so it reads on any map colour */}
      <div style={{ position: "absolute", left: -40, right: -40, top: -50, bottom: -40, background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(20,26,30,0.7), rgba(20,26,30,0))" }} />
      <div
        style={{
          position: "relative", fontFamily: SERIF, fontWeight: 900, fontSize: size, letterSpacing: 2 + (1 - p) * 12, lineHeight: 1, whiteSpace: "nowrap",
          backgroundImage: `linear-gradient(180deg, #F6E3A6 0%, ${L.gold} 45%, ${L.goldDeep} 100%)`, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.65))",
        }}
      >
        {place}
      </div>
      <div style={{ position: "relative", marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontFamily: SERIF, fontWeight: 900, fontSize: 60, letterSpacing: 8, color: L.gold, textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>
        <span style={{ width: 120 * rule, height: 3, background: L.gold }} />
        {year}
        <span style={{ width: 120 * rule, height: 3, background: L.gold }} />
      </div>
    </div>
  );
};

/** Karaoke subtitle skin (D3, Style Library §2.6): ≤ 4 words / 26 chars, 2 lines, said words light up gold. */
export const AtlasSub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.12, textAlign: "center" }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {ln.map((w, k) => (
            <span
              key={k}
              style={{
                // unsaid words stay solid (a see-through grey disappears on parchment); said ones turn white / gold
                color: w.said ? (w.key ? L.gold : "#FFFFFF") : "#CBBF9F",
                WebkitTextStroke: `10px ${L.ink}`,
                paintOrder: "stroke fill",
                textShadow: "0 5px 12px rgba(0,0,0,0.45)",
              }}
            >
              {k ? " " : ""}
              {w.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
