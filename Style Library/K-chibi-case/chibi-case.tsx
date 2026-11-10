/**
 * K "CHIBI CASE": reusable Remotion kit, 9:16. Style guide: ./README.md.
 *
 * A two-part detective puzzle (case → answer) told by big-headed 2D chibi
 * characters drawn in SVG: an interrogation room reused every episode,
 * status tags that say how sure a piece of information is (testimony /
 * replay / hypothesis / fact), a suspect timeline, a 1-2-3 line-up, and the
 * end board with up to 6 clues and a silent 10-second countdown.
 * Static frame: shots change by hard cut (wide ↔ close); only things move.
 */
import { AbsoluteFill, interpolate, random } from "remotion";
import { CANVAS, CLAMP, CX, FONT, pop, prog, SAFE, SUB_BOTTOM } from "../kit-common";
import type { SubSkin } from "../subs";

export const CASE = {
  night: "#111827",
  paper: "#F4EBDD",
  ink: "#1B1A1F",
  /** keywords, numbers, the fact tag: override per project */
  accent: "#D9A441",
  /** evidence: circles, X, the event line */
  evidence: "#C74B46",
} as const;

const LINE = 5; // outline width in the chibi's 200-unit space

// ------------------------------------------------------------------ characters

export type Mood = "neutral" | "worried" | "angry" | "smug" | "shock";
export type ChibiLook = {
  /** seeds the blink rhythm, so two characters never blink together */
  name: string;
  skin?: string;
  hair: "short" | "long" | "bun" | "bald";
  hairColor?: string;
  shirt: string;
  hat?: "fedora" | "beret";
  hatColor?: string;
  mustache?: boolean;
  glasses?: boolean;
};

/**
 * One chibi, feet at (x, y), `h` px tall. `talk` 0→1 opens the mouth (see `talkOf`),
 * `look` −1…1 moves the eyes, `head` draws only the head (timeline rows, cards),
 * `ghost` = faded grey figure for a hypothesis.
 */
export const Chibi: React.FC<{
  look: ChibiLook;
  x: number;
  y: number;
  h: number;
  f: number;
  mood?: Mood;
  talk?: number;
  eyes?: number;
  head?: boolean;
  ghost?: boolean;
  flip?: boolean;
}> = ({ look: c, x, y, h, f, mood = "neutral", talk = 0, eyes = 0, head = false, ghost = false, flip = false }) => {
  const skin = c.skin ?? "#F6D3B8";
  const hairC = c.hairColor ?? "#2B2321";
  const vh = head ? 190 : 300;
  const w = (h * 200) / vh;
  const period = 100 + Math.floor(random(c.name) * 40);
  const blink = (f + Math.floor(random(`${c.name}-b`) * period)) % period < 4;
  const ex = eyes * 6;
  // [inner end, outer end] raised by px
  const [bi, bo] = { neutral: [0, 0], worried: [9, -3], angry: [-9, 3], smug: [-2, 4], shock: [12, 12] }[mood];
  const open = mood === "shock" ? Math.max(talk, 0.6) : talk;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 200 ${vh}`}
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h,
        scale: flip ? "-1 1" : undefined,
        opacity: ghost ? 0.45 : 1,
        filter: ghost ? "grayscale(1)" : undefined,
        overflow: "visible",
      }}
    >
      <g stroke={CASE.ink} strokeWidth={LINE} strokeLinejoin="round" strokeLinecap="round">
        {!head && (
          <>
            <path d="M48 300 L58 200 Q100 182 142 200 L152 300 Z" fill={c.shirt} />
            <path d="M82 192 L100 214 L118 192" fill="none" />
            <rect x={88} y={170} width={24} height={20} fill={skin} />
          </>
        )}
        {c.hair === "long" && <path d="M28 100 Q22 175 46 190 L154 190 Q178 175 172 100 Z" fill={hairC} />}
        <circle cx={100} cy={100} r={78} fill={skin} />
        {c.hair !== "bald" && (
          <path d="M24 96 Q26 22 100 20 Q174 22 176 96 Q150 60 100 58 Q60 60 24 96 Z" fill={hairC} />
        )}
        {c.hair === "bun" && <circle cx={100} cy={20} r={20} fill={hairC} />}
        {c.hat === "fedora" && (
          <>
            <ellipse cx={100} cy={52} rx={98} ry={18} fill={c.hatColor ?? "#5B4A3A"} />
            <path d="M44 52 Q46 2 100 2 Q154 2 156 52 Z" fill={c.hatColor ?? "#5B4A3A"} />
            <path d="M46 40 L154 40" stroke="#2A221B" strokeWidth={9} />
          </>
        )}
        {c.hat === "beret" && <path d="M30 70 Q34 10 110 14 Q176 20 168 66 Q100 44 30 70 Z" fill={c.hatColor ?? "#7A2E3A"} />}
      </g>
      {/* face (no outline) */}
      <g fill={CASE.ink}>
        <ellipse cx={72 + ex} cy={108} rx={9} ry={blink ? 1.5 : 12} />
        <ellipse cx={128 + ex} cy={108} rx={9} ry={blink ? 1.5 : 12} />
        {!blink && <circle cx={75 + ex} cy={103} r={3.4} fill="#fff" />}
        {!blink && <circle cx={131 + ex} cy={103} r={3.4} fill="#fff" />}
        <path d={`M58 ${86 - bo} L86 ${86 - bi}`} stroke={CASE.ink} strokeWidth={5} strokeLinecap="round" />
        <path d={`M114 ${86 - bi} L142 ${86 - bo}`} stroke={CASE.ink} strokeWidth={5} strokeLinecap="round" />
      </g>
      <ellipse cx={58} cy={132} rx={13} ry={8} fill="#F29C9C" opacity={0.55} />
      <ellipse cx={142} cy={132} rx={13} ry={8} fill="#F29C9C" opacity={0.55} />
      {c.glasses && (
        <g fill="none" stroke={CASE.ink} strokeWidth={4}>
          <circle cx={72} cy={108} r={19} />
          <circle cx={128} cy={108} r={19} />
          <path d="M91 108 L109 108" />
        </g>
      )}
      {open > 0.08 ? (
        <ellipse cx={100} cy={146} rx={8 + 4 * open} ry={3 + 11 * open} fill="#7A2D2D" stroke={CASE.ink} strokeWidth={3.5} />
      ) : (
        <path
          d={mood === "smug" ? "M86 142 Q100 154 114 142" : mood === "worried" || mood === "angry" ? "M88 150 Q100 142 112 150" : "M90 146 L110 146"}
          fill="none"
          stroke={CASE.ink}
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}
      {c.mustache && <path d="M70 136 Q86 124 100 132 Q114 124 130 136 Q116 142 100 136 Q84 142 70 136 Z" fill="#3A2C24" />}
    </svg>
  );
};

/** One VO line: who says it, when (seconds), what. Same shape as the `timing.lines` of a voiceover manifest. */
export type Said = { id: string; who: string; start: number; end: number; text: string };

/**
 * Mouth opening 0→1 for `who` at time t: Vietnamese is one syllable per word, so the mouth
 * opens once per spoken word. Word starts come from `words.json` (Whisper) or are spread evenly.
 */
export const talkOf = (lines: Said[], who: string, t: number, words: Record<string, number[]> = {}) => {
  const l = lines.find((x) => x.who === who && t >= x.start && t < x.end);
  if (!l) return 0;
  const n = l.text.split(/\s+/).filter(Boolean).length;
  const at = words[l.id] ?? Array.from({ length: n }, (_, k) => l.start + ((l.end - l.start) * k) / n);
  const k = at.filter((s) => t >= s).length - 1;
  if (k < 0) return 0;
  const p = (t - at[k]) / ((at[k + 1] ?? l.end) - at[k]);
  return p < 0.75 ? Math.sin((Math.PI * p) / 0.75) : 0;
};

// ------------------------------------------------------------------ sets

/** Interrogation room, wall + floor (draw characters on top, then `<Desk />`). */
export const RoomBack: React.FC = () => (
  <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
    <g stroke={CASE.ink} strokeWidth={4}>
      <rect x={-5} y={-5} width={1090} height={1005} fill="#A9C6B4" />
      <rect x={-5} y={1000} width={1090} height={240} fill="#6E9C86" />
      <path d="M-5 1000 L1085 1000" strokeWidth={8} />
      <rect x={-5} y={1240} width={1090} height={690} fill="#CFC6B6" />
      {/* window with bars */}
      <rect x={600} y={300} width={360} height={420} fill="#DDEFF2" />
      <path d="M600 600 Q680 540 760 600 Q840 530 960 590 L960 720 L600 720 Z" fill="#6FA96B" />
      {[660, 720, 780, 840, 900].map((bx) => (
        <path key={bx} d={`M${bx} 300 L${bx} 720`} strokeWidth={6} />
      ))}
      {/* cork board */}
      <rect x={110} y={340} width={330} height={240} fill="#B98A5A" />
      <rect x={140} y={368} width={90} height={110} fill="#FBF7EE" transform="rotate(-3 185 423)" />
      <rect x={250} y={380} width={80} height={100} fill="#FBF7EE" />
      <rect x={345} y={364} width={70} height={90} fill="#FBF7EE" />
      {/* clock */}
      <circle cx={270} cy={210} r={52} fill="#FBF7EE" />
      <path d="M270 210 L270 176 M270 210 L294 222" strokeWidth={6} strokeLinecap="round" />
    </g>
    <g stroke="#B5AB98" strokeWidth={3}>
      {[1380, 1540, 1720].map((ty) => (
        <path key={ty} d={`M0 ${ty} L1080 ${ty}`} />
      ))}
    </g>
  </svg>
);

/** Table front edge in the room; cups and paper sit on it. Top edge at y. */
export const Desk: React.FC<{ y?: number }> = ({ y = 1180 }) => (
  <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
    <g stroke={CASE.ink} strokeWidth={5} strokeLinejoin="round">
      <rect x={70} y={y} width={940} height={46} fill="#9C6B43" />
      <rect x={100} y={y + 46} width={880} height={300} fill="#7E5434" />
      <path d={`M540 ${y + 46} L540 ${y + 346}`} />
      <rect x={180} y={y - 18} width={150} height={18} fill="#FBF7EE" />
      <path d={`M760 ${y} L768 ${y - 50} L812 ${y - 50} L820 ${y} Z`} fill="#F0EDE6" />
    </g>
  </svg>
);

/** Dark set for title, line-up and the clue board: night blue with a soft vignette. */
export const NightBg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, #24304A 0%, ${CASE.night} 62%, #070A12 100%)` }} />
);

/**
 * Fixed framing of a set: "wide" = as drawn, "close" = 1.8× around `focus`.
 * Never animate it: change shot only on a cut (no fake camera).
 */
export const Shot: React.FC<{ close?: boolean; focus?: [number, number]; children: React.ReactNode }> = ({
  close = false, focus = [CX, 900], children,
}) => (
  <AbsoluteFill style={{ scale: close ? 1.8 : 1, transformOrigin: `${focus[0]}px ${focus[1]}px` }}>{children}</AbsoluteFill>
);

// ------------------------------------------------------------------ text

const pill: React.CSSProperties = { fontFamily: FONT, fontWeight: 800, fontSize: 48, lineHeight: 1, whiteSpace: "nowrap" };

/** How sure the viewer may be of what's on screen. Top-left of the safe zone. Counts as one text block. */
export const StatusTag: React.FC<{ kind: "testimony" | "replay" | "hypothesis" | "fact"; f: number; at?: number }> = ({
  kind, f, at = 0,
}) => {
  const s = {
    testimony: { text: "LỜI KHAI", bg: CASE.paper, fg: CASE.ink, border: "none" },
    replay: { text: "▶ PHÁT LẠI", bg: "rgba(17,24,39,0.82)", fg: "#fff", border: "4px solid #fff" },
    hypothesis: { text: "GIẢ THUYẾT", bg: "rgba(17,24,39,0.72)", fg: "#D6D3CC", border: "4px dashed #D6D3CC" },
    fact: { text: "SỰ THẬT", bg: CASE.accent, fg: CASE.ink, border: "none" },
  }[kind];
  return (
    <div
      style={{
        ...pill, position: "absolute", left: SAFE.left + 20, top: SAFE.top + 20, padding: "16px 26px", borderRadius: 14,
        background: s.bg, color: s.fg, border: s.border, scale: String(pop(f, at)), transformOrigin: "left center",
      }}
    >
      {s.text}
    </div>
  );
};

/** Name plate, centred on x at top y: "MINH · THỢ BÁNH" (≤ 5 words). */
export const NameChip: React.FC<{ text: string; x: number; y: number; f: number; at?: number }> = ({ text, x, y, f, at = 0 }) => (
  <div
    style={{
      ...pill, position: "absolute", left: x, top: y, translate: "-50% 0", padding: "14px 26px", borderRadius: 12,
      background: CASE.night, color: "#fff", borderLeft: `10px solid ${CASE.accent}`, opacity: prog(f, at, 6),
      scale: String(pop(f, at)),
    }}
  >
    {text}
  </div>
);

/** Hook / episode title: red time chip + white headline (≤ 5 words, one line). Also the thumbnail frame. */
export const CaseTitle: React.FC<{ time: string; title: string; f: number; at?: number; y?: number; size?: number }> = ({
  time, title, f, at = 0, y = 620, size = 92,
}) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
    <div
      style={{
        display: "inline-block", fontSize: 64, color: "#fff", background: CASE.evidence, padding: "10px 28px", borderRadius: 12,
        scale: String(pop(f, at)),
      }}
    >
      {time}
    </div>
    <div
      style={{
        marginTop: 30, fontSize: size, lineHeight: 1.05, color: "#fff", whiteSpace: "nowrap",
        textShadow: "0 6px 0 #000, 0 0 30px rgba(0,0,0,0.6)", opacity: prog(f, at + 6, 8),
        translate: `0 ${(1 - prog(f, at + 6, 10)) * 40}px`,
      }}
    >
      {title}
    </div>
  </div>
);

/** Subtitle skin: one line, ≤ 3 words / 18 chars (use with `<KaraokeSubs oneLine maxWords={3} maxChars={18} />`). */
export const CaseSub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
    <div style={{ background: "rgba(10,12,20,0.78)", borderRadius: 18, padding: "14px 34px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 68, whiteSpace: "nowrap" }}>
      {lines[0].map((w, k) => (
        <span key={k} style={{ color: w.key ? CASE.accent : "#fff", opacity: w.said ? 1 : 0.45 }}>
          {k ? " " : ""}
          {w.text}
        </span>
      ))}
    </div>
  </div>
);

// ------------------------------------------------------------------ evidence

/** Red marker circle drawn on around (x, y). */
export const RedRing: React.FC<{ x: number; y: number; r: number; f: number; at: number }> = ({ x, y, r, f, at }) => {
  const p = prog(f, at, 12);
  const len = 2 * Math.PI * r * 1.15;
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", left: 0, top: 0 }}>
      <ellipse
        cx={x} cy={y} rx={r * 1.12} ry={r} fill="none" stroke={CASE.evidence} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform={`rotate(-12 ${x} ${y})`}
      />
    </svg>
  );
};

/** Red X over a ruled-out idea or person. */
export const XMark: React.FC<{ x: number; y: number; size?: number; f: number; at: number }> = ({ x, y, size = 160, f, at }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, scale: String(pop(f, at)) }}>
    <path d="M14 14 L86 86 M86 14 L14 86" stroke={CASE.evidence} strokeWidth={16} strokeLinecap="round" />
  </svg>
);

// ------------------------------------------------------------------ timeline

const hhmm = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/**
 * Where everyone was: one row per suspect (face, no name), a bar per stay that grows in at `at`,
 * the red event line. Only the event time and the `active` row's range are written (2 text blocks).
 */
export const Timeline: React.FC<{
  rows: { look: ChibiLook; from: number; to: number; at: number }[];
  range: [number, number];
  event: { t: number; at: number };
  active?: number;
  f: number;
  y?: number;
}> = ({ rows, range, event, active, f, y = 420 }) => {
  const x0 = SAFE.left + 190;
  const x1 = CANVAS.width - SAFE.right - 40;
  const X = (h: number) => interpolate(h, range, [x0, x1], CLAMP);
  const rowH = 190;
  const h = rows.length * rowH + 120;
  const ex = X(event.t);
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: y, width: CANVAS.width - SAFE.left - SAFE.right, height: h, background: "rgba(10,12,20,0.88)", borderRadius: 24 }}>
      {/* under the rows, so the range label stays readable */}
      <div style={{ position: "absolute", left: ex - SAFE.left - 4, top: 70, width: 8, height: h - 100, background: CASE.evidence, opacity: prog(f, event.at, 6), borderRadius: 4 }} />
      {rows.map((r, i) => {
        const cy = 140 + i * rowH;
        const bx = X(r.from) - SAFE.left;
        const bw = (X(r.to) - X(r.from)) * prog(f, r.at, 14);
        const on = active === undefined || active === i;
        return (
          <div key={r.look.name} style={{ opacity: interpolate(prog(f, r.at - 6, 6), [0, 1], [0, on ? 1 : 0.4]) }}>
            <Chibi look={r.look} x={95} y={cy + 70} h={140} f={f} head />
            <div style={{ position: "absolute", left: bx, top: cy - 18, width: bw, height: 36, borderRadius: 18, background: on ? CASE.paper : "#6B7280" }} />
            {active === i && (
              <div style={{ ...pill, position: "absolute", left: bx, top: cy - 100, padding: "6px 12px", borderRadius: 10, background: CASE.night, color: CASE.accent, opacity: prog(f, r.at + 10, 6) }}>
                {hhmm(r.from)}–{hhmm(r.to)}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ ...pill, position: "absolute", left: ex - SAFE.left, top: 8, translate: "-60% 0", color: CASE.evidence, opacity: prog(f, event.at, 6) }}>
        {hhmm(event.t)}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ line-up

const LINEUP_X = [230, 500, 770];

/** Three suspects under spotlights, entering at `at`. `active` is lit and gets its number (pops at `activeAt`); the others wait in the dark. */
export const LineUp: React.FC<{ looks: ChibiLook[]; active?: number; f: number; at?: number; activeAt?: number; talk?: number[] }> = ({
  looks, active, f, at = 0, activeAt = at, talk = [],
}) => (
  <>
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="k-spot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6DC" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#FFF6DC" stopOpacity={0.05} />
        </linearGradient>
      </defs>
      {LINEUP_X.map((x, i) => (
        <path key={x} d={`M${x - 40} 260 L${x + 40} 260 L${x + 140} 1300 L${x - 140} 1300 Z`} fill="url(#k-spot)" opacity={active === undefined || active === i ? 1 : 0.15} />
      ))}
      <path d="M0 1300 L1080 1300" stroke="#3A4560" strokeWidth={6} />
    </svg>
    {looks.map((l, i) => {
      const lit = active === undefined || active === i;
      return (
        <div key={l.name} style={{ opacity: prog(f, at + i * 5, 8), filter: lit ? undefined : "brightness(0.4)" }}>
          <Chibi look={l} x={LINEUP_X[i]} y={1300} h={560} f={f} talk={talk[i] ?? 0} />
        </div>
      );
    })}
    {active !== undefined && (
      <div style={{ ...pill, position: "absolute", left: LINEUP_X[active], top: 320, translate: "-50% 0", fontSize: 96, color: CASE.night, background: CASE.paper, padding: "10px 34px", borderRadius: 16, scale: String(pop(f, activeAt)) }}>
        {active + 1}
      </div>
    )}
  </>
);

// ------------------------------------------------------------------ end board

/**
 * Countdown ring: `seconds` → 0 from frame `start`, silent (the VO stops for it).
 * Centred on (x, y).
 */
export const Countdown: React.FC<{ start: number; seconds?: number; fps: number; f: number; x: number; y: number; r?: number }> = ({
  start, seconds = 10, fps, f, x, y, r = 80,
}) => {
  const left = interpolate(f, [start, start + seconds * fps], [seconds, 0], CLAMP);
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "absolute", left: x - r - 12, top: y - r - 12, opacity: prog(f, start - 8, 8) }}>
      <svg width={2 * r + 24} height={2 * r + 24}>
        <circle cx={r + 12} cy={r + 12} r={r} fill={CASE.night} stroke="#374151" strokeWidth={14} />
        <circle
          cx={r + 12} cy={r + 12} r={r} fill="none" stroke={CASE.evidence} strokeWidth={14} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - left / seconds)} transform={`rotate(-90 ${r + 12} ${r + 12})`}
        />
      </svg>
      <div style={{ ...pill, position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 88, color: "#fff" }}>
        {Math.ceil(left)}
      </div>
    </div>
  );
};

/**
 * End board (the one text exception of K, Lucas 2026-10-29): a ≤ 5-word question and up to
 * 6 numbered clue cards of ≤ 4 words each, revealed one by one at `at`, then held through the
 * countdown. `mark` circles the deciding clue in the answer video.
 */
export const ClueBoard: React.FC<{ question: string; clues: { text: string; at: number }[]; f: number; mark?: number; markAt?: number }> = ({
  question, clues, f, mark, markAt = 0,
}) => {
  if (clues.length > 6) throw new Error(`ClueBoard: ${clues.length} clues, max 6`);
  for (const c of clues) {
    if (c.text.split(/\s+/).length > 4) throw new Error(`ClueBoard: "${c.text}" is over 4 words`);
  }
  const top = SAFE.top + 200;
  const cardH = 128;
  const gap = 22;
  return (
    <>
      <div style={{ ...pill, position: "absolute", left: SAFE.left + 10, top: SAFE.top + 40, fontSize: 72, color: "#fff" }}>{question}</div>
      {clues.map((c, i) => {
        const p = prog(f, c.at, 10);
        const y = top + i * (cardH + gap);
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: SAFE.left, top: y, width: CANVAS.width - SAFE.left - SAFE.right, height: cardH,
              display: "flex", alignItems: "center", gap: 28, background: CASE.paper, borderRadius: 18,
              boxShadow: "0 10px 0 rgba(0,0,0,0.35)", opacity: p, translate: `${(1 - p) * -60}px 0`, rotate: `${(i % 2 ? 0.6 : -0.6) * p}deg`,
            }}
          >
            <div style={{ ...pill, marginLeft: 22, width: 84, height: 84, borderRadius: 42, background: CASE.night, color: CASE.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56 }}>
              {i + 1}
            </div>
            <div style={{ ...pill, fontSize: 58, color: CASE.ink }}>{c.text}</div>
            {mark === i && (
              <svg width={CANVAS.width} height={cardH + 60} style={{ position: "absolute", left: -20, top: -30 }}>
                <rect
                  x={8} y={8} width={CANVAS.width - SAFE.left - SAFE.right + 24} height={cardH + 44} rx={30} fill="none" stroke={CASE.evidence} strokeWidth={10}
                  strokeDasharray={2400} strokeDashoffset={2400 * (1 - prog(f, markAt, 14))}
                />
              </svg>
            )}
          </div>
        );
      })}
    </>
  );
};
