/**
 * H "PAPER DOSSIER": reusable Remotion kit, 9:16. Style guide: ./README.md.
 *
 * An investigation file: crumpled off-white paper, print registration marks,
 * black-and-white engraving (hatch / cross-hatch / stipple fills with an ink
 * outline), black tape labels, red rubber stamps, a red marker circle,
 * dotted outlines for what is gone. One accent colour (red by default).
 * Static frame: elements stick on, stamp, draw on. All SVG, frame-driven.
 */
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { CANVAS, CLAMP, CX, FONT, prog, SAFE, SUB_BOTTOM } from "../kit-common";
import type { SubSkin } from "../subs";

export const DOSSIER = {
  paper: "#E9E3D4",
  ink: "#171615",
  gray: "#77726A",
  white: "#F7F3EA",
  glow: "#E4F6C9",
  /** the only colour: override per project */
  accent: "#C7362B",
} as const;

const INK = 4;

/** Pattern fills for engraving. Render once per <svg> (ids are global). */
export const Engraving: React.FC = () => (
  <defs>
    <pattern id="dz-hatch" patternUnits="userSpaceOnUse" width={9} height={9} patternTransform="rotate(45)">
      <rect width={9} height={9} fill={DOSSIER.white} />
      <line x1={0} y1={0} x2={0} y2={9} stroke={DOSSIER.ink} strokeWidth={2.4} />
    </pattern>
    <pattern id="dz-cross" patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(30)">
      <rect width={8} height={8} fill={DOSSIER.white} />
      <line x1={0} y1={0} x2={0} y2={8} stroke={DOSSIER.ink} strokeWidth={2.6} />
      <line x1={0} y1={0} x2={8} y2={0} stroke={DOSSIER.ink} strokeWidth={2.6} />
    </pattern>
    <pattern id="dz-stipple" patternUnits="userSpaceOnUse" width={10} height={10}>
      <rect width={10} height={10} fill={DOSSIER.white} />
      <circle cx={2} cy={3} r={1.6} fill={DOSSIER.ink} />
      <circle cx={7} cy={8} r={1.4} fill={DOSSIER.ink} />
    </pattern>
    <radialGradient id="dz-glow">
      <stop offset="0%" stopColor={DOSSIER.glow} stopOpacity={1} />
      <stop offset="100%" stopColor={DOSSIER.glow} stopOpacity={0} />
    </radialGradient>
  </defs>
);

// ------------------------------------------------------------------ page

/** Crumpled paper, registration marks and a colour bar. `dark` 0→1 dims the page (night). */
export const PaperBg: React.FC<{ dark?: number }> = ({ dark = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: DOSSIER.paper }}>
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
      <filter id="dz-crumple">
        <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={4} seed={7} result="n" />
        <feDiffuseLighting in="n" lightingColor="#fff" surfaceScale={3.2}>
          <feDistantLight azimuth={45} elevation={58} />
        </feDiffuseLighting>
      </filter>
      <filter id="dz-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={2} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#dz-crumple)" opacity={0.45} style={{ mixBlendMode: "multiply" }} />
      <rect width="100%" height="100%" filter="url(#dz-grain)" opacity={0.12} style={{ mixBlendMode: "multiply" }} />
      <line x1={0} y1={980} x2={1080} y2={986} stroke={DOSSIER.ink} strokeOpacity={0.07} strokeWidth={3} />
      <g stroke={DOSSIER.ink} strokeOpacity={0.45} strokeWidth={2}>
        {[[50, 190], [1030, 190], [50, 1730], [1030, 1730]].map(([x, y]) => (
          <g key={`${x}${y}`}>
            <line x1={x - 18} y1={y} x2={x + 18} y2={y} />
            <line x1={x} y1={y - 18} x2={x} y2={y + 18} />
            <circle cx={x} cy={y} r={8} fill="none" />
          </g>
        ))}
      </g>
      <g style={{ translate: `${CX - 45}px 140px` }}>
        {[DOSSIER.ink, DOSSIER.accent, DOSSIER.gray, DOSSIER.ink].map((c, i) => (
          <rect key={i} x={i * 24} y={0} width={20} height={10} fill={c} opacity={0.8} />
        ))}
      </g>
      <rect width="100%" height="100%" fill="#0A0A0C" opacity={0.78 * dark} />
    </svg>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ type

/** Black (or red) tape label that sticks on, slightly rotated, torn ends. */
export const Tape: React.FC<{
  text: string; f: number; at: number; out?: number; x?: number; y: number; color?: string; size?: number; rot?: number;
}> = ({ text, f, at, out, x = CX, y, color = DOSSIER.ink, size = 54, rot = -1.5 }) => {
  if (f < at) return null;
  const w = text.length * size * 0.66 + 60;
  const h = size + 34;
  const o = prog(f, at, 3) * (out === undefined ? 1 : 1 - prog(f, out, 5));
  const k = interpolate(f, [at, at + 5], [1.08, 1], CLAMP);
  const jag = (side: number) =>
    Array.from({ length: 7 }, (_, i) => `${side * (w / 2 + (i % 2 ? 6 : 0))},${-h / 2 + (i * h) / 6}`).join(" ");
  return (
    <g style={{ translate: `${x}px ${y}px`, rotate: `${rot}deg`, scale: k, opacity: o }}>
      <polygon points={`${jag(-1)} ${jag(1).split(" ").reverse().join(" ")}`} fill={color} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={size}
        fill={DOSSIER.white} letterSpacing={1}>
        {text}
      </text>
    </g>
  );
};

/** Big black number / year. */
export const Stat: React.FC<{
  text: string; f: number; at: number; out?: number; x?: number; y: number; size?: number; color?: string;
}> = ({ text, f, at, out, x = CX, y, size = 170, color = DOSSIER.ink }) => {
  const o = prog(f, at, 4) * (out === undefined ? 1 : 1 - prog(f, out, 5));
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={color}
      opacity={o} letterSpacing={-4}>
      {text}
    </text>
  );
};

/** Red rubber stamp that slams on. */
export const Stamp: React.FC<{ text: string; f: number; at: number; x: number; y: number; rot?: number; size?: number }> = ({
  text, f, at, x, y, rot = -8, size = 64,
}) => {
  if (f < at) return null;
  const w = text.length * size * 0.68 + 70;
  const h = size + 50;
  const k = interpolate(f, [at, at + 4, at + 7], [1.5, 0.96, 1], CLAMP);
  return (
    <g style={{ translate: `${x}px ${y}px`, rotate: `${rot}deg`, scale: k, opacity: prog(f, at, 2) * 0.9, mixBlendMode: "multiply" }}
      stroke={DOSSIER.accent} fill="none">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} strokeWidth={8} />
      <rect x={-w / 2 + 12} y={-h / 2 + 12} width={w - 24} height={h - 24} rx={6} strokeWidth={3} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={size}
        fill={DOSSIER.accent} stroke="none">
        {text}
      </text>
    </g>
  );
};

/** Red marker loop drawn around something. */
export const MarkerCircle: React.FC<{ x: number; y: number; rx: number; ry: number; p: number }> = ({ x, y, rx, ry, p }) => (
  <path pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 - p, translate: `${x}px ${y}px`, rotate: "-4deg" }}
    d={`M ${-rx * 0.9} ${-ry * 0.5} C ${-rx * 0.6} ${-ry * 1.15}, ${rx * 1.05} ${-ry * 1.1}, ${rx} ${0}
        C ${rx * 0.95} ${ry * 1.1}, ${-rx * 1.05} ${ry * 1.05}, ${-rx} ${ry * 0.05}
        C ${-rx * 1.02} ${-ry * 0.6}, ${-rx * 0.5} ${-ry * 1.0}, ${rx * 0.1} ${-ry * 1.05}`}
    fill="none" stroke={DOSSIER.accent} strokeWidth={9} strokeLinecap="round" />
);

// ------------------------------------------------------------------ engravings

/** Watch with a radium dial; `glow` 0→1 lights the numerals. */
export const Watch: React.FC<{ x: number; y: number; r: number; glow?: number; paint?: number }> = ({
  x, y, r, glow = 0, paint = 1,
}) => (
  <g style={{ translate: `${x}px ${y}px` }} stroke={DOSSIER.ink} strokeWidth={INK}>
    <rect x={-r * 0.38} y={-r * 1.75} width={r * 0.76} height={r * 0.9} rx={14} fill="url(#dz-hatch)" />
    <rect x={-r * 0.38} y={r * 0.85} width={r * 0.76} height={r * 0.9} rx={14} fill="url(#dz-hatch)" />
    <circle r={r * 1.12} fill="url(#dz-cross)" />
    <circle r={r} fill={DOSSIER.white} />
    {glow > 0 && <circle r={r * 1.5} fill="url(#dz-glow)" opacity={glow} stroke="none" />}
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const lit = i / 12 < paint;
      return (
        <g key={i}>
          {glow > 0 && lit && <circle cx={Math.sin(a) * r * 0.78} cy={-Math.cos(a) * r * 0.78} r={r * 0.13}
            fill={DOSSIER.glow} stroke="none" opacity={glow} />}
          <line x1={Math.sin(a) * r * 0.7} y1={-Math.cos(a) * r * 0.7} x2={Math.sin(a) * r * 0.86} y2={-Math.cos(a) * r * 0.86}
            strokeWidth={i % 3 ? 5 : 9} stroke={lit && glow > 0.5 ? "#9FCB7A" : DOSSIER.ink} />
        </g>
      );
    })}
    <line x1={0} y1={0} x2={r * 0.45} y2={-r * 0.25} strokeWidth={8} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-r * 0.12} y2={-r * 0.62} strokeWidth={6} strokeLinecap="round" />
    <circle r={10} fill={DOSSIER.ink} />
  </g>
);

/** Fine paint brush, tip at (x, y), pointing up-left. */
export const Brush: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -35 }) => (
  <g style={{ translate: `${x}px ${y}px`, rotate: `${rot}deg`, scale: s }} stroke={DOSSIER.ink} strokeWidth={INK} strokeLinejoin="round">
    <path d="M 0 0 Q -14 40 -12 80 L 12 80 Q 14 40 0 0 Z" fill="url(#dz-stipple)" />
    <rect x={-14} y={80} width={28} height={50} fill="url(#dz-cross)" />
    <path d="M -12 130 L -16 460 Q 0 476 16 460 L 12 130 Z" fill="url(#dz-hatch)" />
  </g>
);

/** Paint jar with a glowing mouth. */
export const Jar: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 1 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={DOSSIER.ink} strokeWidth={INK}>
    <ellipse cx={0} cy={-150} rx={170} ry={80} fill="url(#dz-glow)" opacity={glow} stroke="none" />
    <path d="M -110 -120 L 110 -120 L 120 120 Q 0 150 -120 120 Z" fill="url(#dz-hatch)" />
    <ellipse cx={0} cy={-120} rx={110} ry={26} fill={DOSSIER.glow} />
    <rect x={-80} y={-40} width={160} height={110} fill={DOSSIER.white} />
    <path d="M -60 -5 L 60 -5 M -60 25 L 30 25" strokeWidth={6} stroke={DOSSIER.gray} />
  </g>
);

/** Side view of a jawbone; radium dots spread (dots 0→1); crumble 0→1 breaks the outline. */
export const Jaw: React.FC<{ x: number; y: number; s?: number; dots?: number; crumble?: number }> = ({
  x, y, s = 1, dots = 0, crumble = 0,
}) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={DOSSIER.ink} strokeWidth={INK} strokeLinejoin="round">
    <path
      d="M -300 -220 L -250 -230 L -220 -40 Q -200 60 -100 80 L 280 70 Q 320 70 320 30 L 310 -20 L -150 -10 L -190 -200 Z"
      fill="url(#dz-cross)"
      strokeDasharray={crumble > 0 ? `${40 - 30 * crumble} ${8 + 40 * crumble}` : undefined}
    />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M ${-120 + i * 46} -12 l 6 -46 q 14 -12 28 0 l 6 46 Z`}
        fill={DOSSIER.white}
        style={{ translate: `0px ${i % 3 === 1 ? 120 * crumble : 0}px`, rotate: `${i % 3 === 1 ? 40 * crumble : 0}deg` }}
        opacity={i % 3 === 1 ? 1 - crumble : 1} />
    ))}
    {Array.from({ length: 22 }, (_, i) => {
      const t = i / 22;
      // inside the bone body only
      const px = -150 + 420 * ((i * 37) % 22) / 22;
      const py = 30 + 18 * Math.sin(i * 2.3);
      return t < dots ? <circle key={`d${i}`} cx={px} cy={py} r={11} fill={DOSSIER.glow} stroke="none" /> : null;
    })}
  </g>
);

/** Head-and-shoulders bust; `gone` 0→1 turns it into a dotted outline. */
export const Bust: React.FC<{ x: number; y: number; s?: number; gone?: number }> = ({ x, y, s = 1, gone = 0 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} strokeLinejoin="round">
    <path d="M -80 120 Q -80 40 0 30 Q 80 40 80 120 Z M 0 -60 m -44 0 a 44 52 0 1 0 88 0 a 44 52 0 1 0 -88 0
             M -48 -70 Q -40 -128 6 -122 Q 56 -118 50 -64 Q 60 -20 40 10 Q 30 -40 0 -46 Q -30 -40 -40 10 Q -60 -20 -48 -70 Z"
      fill="url(#dz-cross)" stroke={DOSSIER.ink} strokeWidth={INK} opacity={1 - gone} />
    {gone > 0 && (
      <path d="M -80 120 Q -80 40 0 30 Q 80 40 80 120 M 0 -60 m -44 0 a 44 52 0 1 0 88 0 a 44 52 0 1 0 -88 0"
        fill="none" stroke={DOSSIER.ink} strokeWidth={4} strokeDasharray="10 10" opacity={gone} />
    )}
  </g>
);

/** Typed document with grey text bars; `rows` lines. */
export const Doc: React.FC<{ x: number; y: number; w: number; h: number; rows?: number; rot?: number }> = ({
  x, y, w, h, rows = 9, rot = 2,
}) => (
  <g style={{ translate: `${x}px ${y}px`, rotate: `${rot}deg` }}>
    <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} fill={DOSSIER.ink} opacity={0.15} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={DOSSIER.white} stroke={DOSSIER.ink} strokeWidth={3} />
    <rect x={-w / 2 + 40} y={-h / 2 + 40} width={w * 0.45} height={26} fill={DOSSIER.ink} />
    {Array.from({ length: rows }, (_, i) => (
      <rect key={i} x={-w / 2 + 40} y={-h / 2 + 110 + i * 44} width={(w - 80) * (i % 4 === 3 ? 0.55 : 1)} height={14}
        fill={DOSSIER.gray} opacity={0.55} />
    ))}
  </g>
);

/** Engraved atom; electrons orbit with the frame. */
export const Atom: React.FC<{ x: number; y: number; r: number; f: number }> = ({ x, y, r, f }) => (
  <g style={{ translate: `${x}px ${y}px` }} stroke={DOSSIER.ink} fill="none">
    {[0, 60, 120].map((a, i) => (
      <g key={a} style={{ rotate: `${a}deg` }}>
        <ellipse rx={r} ry={r * 0.36} strokeWidth={5} />
        <circle cx={r * Math.cos(f / 14 + i * 2)} cy={r * 0.36 * Math.sin(f / 14 + i * 2)} r={16}
          fill={DOSSIER.ink} />
      </g>
    ))}
    <circle r={r * 0.2} fill="url(#dz-cross)" strokeWidth={5} />
  </g>
);

// ------------------------------------------------------------------ subtitles

/** Karaoke subtitle skin: a torn paper strip pasted slightly askew. */
export const DossierSub: SubSkin = ({ lines }) => {
  const jag = "polygon(0 6%, 2% 0, 98% 3%, 100% 0, 99% 50%, 100% 100%, 97% 96%, 3% 100%, 0 94%, 1% 50%)";
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
      <div style={{ filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.28))", rotate: "-1.2deg" }}>
        <div style={{
          background: DOSSIER.white, clipPath: jag, padding: "16px 40px 20px", textAlign: "center",
          fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.12,
        }}>
          {lines.map((ln, i) => (
            <div key={i} style={{ whiteSpace: "nowrap" }}>
              {ln.map((w, k) => (
                <span key={k} style={{ color: w.key ? DOSSIER.accent : w.said ? DOSSIER.ink : "#ABA597", opacity: w.key && !w.said ? 0.5 : 1 }}>
                  {k ? " " : ""}{w.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ engraving images (AI / scanned plates)

/** Black-ink-on-white engraving laid onto the paper (multiply: the white disappears). Centred on (x, y). */
export const Engr: React.FC<{ src: string; x: number; y: number; w: number; aspect?: number; o?: number; enter?: number }> = ({
  src, x, y, w, aspect = 1, o = 1, enter = 1,
}) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute", left: x - w / 2, top: y - (w / aspect) / 2, width: w, height: w / aspect,
      mixBlendMode: "multiply", opacity: o * enter, scale: 0.96 + 0.04 * enter,
    }}
  />
);

/** A full-bleed plate printed on a white card, pasted into the file with a strip of tape. */
export const Print: React.FC<{
  src: string; x: number; y: number; w: number; aspect?: number; rot?: number; o?: number; enter?: number; gone?: number;
}> = ({ src, x, y, w, aspect = 1, rot = -2, o = 1, enter = 1, gone = 0 }) => {
  const h = w / aspect;
  const pad = Math.max(10, w * 0.035);
  return (
    <div style={{
      position: "absolute", left: x - w / 2 - pad, top: y - h / 2 - pad, width: w + 2 * pad, height: h + 2 * pad,
      rotate: `${rot}deg`, opacity: o * enter, scale: 1.04 - 0.04 * enter,
    }}>
      <div style={{
        position: "absolute", inset: 0, background: DOSSIER.white, boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
        outline: gone > 0 ? `4px dashed ${DOSSIER.ink}` : "none", outlineOffset: -pad / 2,
      }} />
      <Img src={staticFile(src)} style={{
        position: "absolute", left: pad, top: pad, width: w, height: h, objectFit: "cover",
        filter: "grayscale(1) contrast(1.05)", opacity: 1 - 0.85 * gone,
      }} />
      <div style={{
        position: "absolute", left: "50%", top: -pad * 1.4, width: Math.min(180, w * 0.4), height: pad * 2.6,
        translate: "-50% 0", rotate: "3deg", background: "rgba(222,214,190,0.85)", boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
      }} />
    </div>
  );
};

/** Soft radium glow (pale green), e.g. over a painted dial. */
export const RadGlow: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <div style={{
    position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", opacity: o,
    background: `radial-gradient(circle, ${DOSSIER.glow} 0%, ${DOSSIER.glow}AA 30%, ${DOSSIER.glow}00 70%)`,
    mixBlendMode: "screen",
  }} />
);
