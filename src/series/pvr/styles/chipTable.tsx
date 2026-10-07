/**
 * Style B "Chip Table" (series style library): money is physical chips on a game table, characters
 * are board-game pawns. 1 chip = $6 (every number in Ep02 is a multiple of
 * 6), so stack heights ARE the math. Static frame: pieces drop onto the
 * table, chips fly between stacks, pawns act. No camera moves (series rule).
 */
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../paper";

export const TABLE_Y = 1310;
export const CHIP_T = 34;
/** Frames a chip takes to fly to its target. */
export const FLY = 16;
export const CREAM = "#FFF8E7";
export const INKD = "#1E2A36";
export const NEUTRAL = "#B0BEC5";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const prog = (
  f: number,
  at: number,
  d: number,
  easing: (t: number) => number = Easing.out(Easing.cubic),
) => interpolate(f, [at, at + d], [0, 1], { ...CLAMP, easing });

/** 0 → 1 fade-out from `out` (1 forever when there is no exit). */
const gone = (f: number, out?: number) =>
  out === undefined || !Number.isFinite(out) ? 0 : prog(f, out, 8);

/** Y offset of a piece dropped onto the table at `at` (bounces). */
const dropY = (f: number, at: number, h = 340) =>
  (1 - prog(f, at, 14, Easing.bounce)) * -h;

// ------------------------------------------------------------------ table

export const Table: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 90% 60% at 50% 42%, #2D4459 0%, #1C2B3A 58%, #111A24 100%)",
    }}
  >
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", opacity: 0.07 }}
    >
      <filter id="felt">
        <feTurbulence baseFrequency="0.9" numOctaves={2} seed={3} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#felt)" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: TABLE_Y,
        bottom: 0,
        background:
          "linear-gradient(#94653F 0px, #6B4429 16px, #4A2E1A 170px, #2A190E 100%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

/** A strip lying on the table (lawn, road) that grows from the middle. */
export const Mat: React.FC<{
  at: number;
  x1: number;
  x2: number;
  color: string;
  dashes?: boolean;
}> = ({ at, x1, x2, color, dashes }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        width: x2 - x1,
        top: TABLE_Y - 14,
        height: 28,
        borderRadius: 14,
        background: color,
        scale: `${prog(f, at, 10)} 1`,
        backgroundImage: dashes
          ? "repeating-linear-gradient(90deg, transparent 0 30px, #F4E9C8 30px 60px)"
          : undefined,
        backgroundSize: dashes ? "100% 5px" : undefined,
        backgroundPosition: "0 50%",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

// ------------------------------------------------------------------ chips

export const ry = (w: number) => Math.round(w * 0.11);
/** Top (px) of chip `i` (0 = bottom) in a stack of width `w`. */
export const chipTop = (i: number, w = 150) =>
  TABLE_Y - CHIP_T - 2 * ry(w) - i * CHIP_T;
/** Where a value pill sits above a stack of `n` chips. */
export const above = (n: number, w = 150) => chipTop(n - 1, w) - 104;

const ChipSvg: React.FC<{ w: number; grey: boolean }> = ({ w, grey }) => {
  const r = ry(w);
  const top = grey ? "#A7B1B9" : "#F6C945";
  const side = grey ? "#6E7A84" : "#C48A1E";
  const ring = grey ? "#D3DADF" : "#FFE9A6";
  return (
    <svg
      width={w}
      height={CHIP_T + 2 * r}
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d={`M0 ${r} L0 ${r + CHIP_T} A${w / 2} ${r} 0 0 0 ${w} ${r + CHIP_T} L${w} ${r} Z`}
        fill={side}
      />
      {[0.2, 0.5, 0.8].map((k) => (
        <rect
          key={k}
          x={w * k - 8}
          y={r + 6}
          width={16}
          height={CHIP_T - 6}
          fill={ring}
          opacity={0.75}
        />
      ))}
      <ellipse
        cx={w / 2}
        cy={r}
        rx={w / 2}
        ry={r}
        fill={top}
        stroke={side}
        strokeWidth={2}
      />
      <ellipse
        cx={w / 2}
        cy={r}
        rx={w * 0.34}
        ry={r * 0.6}
        fill="none"
        stroke={ring}
        strokeWidth={3}
      />
    </svg>
  );
};

export type ChipSpec = {
  /** frame the chip drops onto the stack */
  in: number;
  /** appear in place (a chip that just flew in) */
  land?: boolean;
  /** frame it turns grey (a cost) */
  grey?: number;
  /** frame it lifts off the stack / settles back */
  lift?: number;
  unlift?: number;
  /** frame it flies away, and where its top-left lands [centerX, top] */
  out?: number;
  to?: [number, number];
  /** fade during the flight (leaves the table instead of joining a stack) */
  vanish?: boolean;
};

/** `n` chips dropping one after another from `at`. */
export const chips = (n: number, at: number, stagger = 1): ChipSpec[] =>
  Array.from({ length: n }, (_, i) => ({ in: at + i * stagger }));

/** Patch the top `k` chips; `j` = 0 for the very top chip. */
export const topChips = (
  list: ChipSpec[],
  k: number,
  patch: (j: number) => Partial<ChipSpec>,
) =>
  list.map((c, i) =>
    i >= list.length - k ? { ...c, ...patch(list.length - 1 - i) } : c,
  );

/** Chips arriving on a stack that already has `base` chips (pairs with a flight). */
export const receive = (k: number, out: number, stagger = 2): ChipSpec[] =>
  Array.from({ length: k }, (_, j) => ({
    in: out + j * stagger + FLY,
    land: true,
  }));

export const Stack: React.FC<{ x: number; chips: ChipSpec[]; w?: number }> = ({
  x,
  chips: list,
  w = 150,
}) => {
  const f = useCurrentFrame();
  const present = list.filter(
    (c) => f >= c.in && (c.out === undefined || f < c.out + FLY),
  ).length;
  return (
    <>
      {present ? (
        <div
          style={{
            position: "absolute",
            left: x - w * 0.6,
            width: w * 1.2,
            top: TABLE_Y - 14,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.38)",
          }}
        />
      ) : null}
      {list.map((c, i) => {
        if (f < c.in) return null;
        // chips that already left don't hold a slot for chips arriving later
        const slot = list
          .slice(0, i)
          .filter((p) => p.out === undefined || p.out + FLY > c.in).length;
        const home = chipTop(slot, w);
        let cx = x;
        let top = home + (c.land ? 0 : dropY(f, c.in, 420));
        let opacity = 1;
        if (c.lift !== undefined) {
          const l =
            prog(f, c.lift, 6) -
            (c.unlift !== undefined ? prog(f, c.unlift, 6) : 0);
          top -= l * 56;
        }
        if (c.out !== undefined && f >= c.out) {
          const t = prog(f, c.out, FLY, Easing.inOut(Easing.cubic));
          if (t >= 1) return null;
          const [tx, ty] = c.to ?? [x, -300];
          cx = x + (tx - x) * t;
          top = home + (ty - home) * t - Math.sin(t * Math.PI) * 170;
          if (c.vanish) opacity = 1 - prog(f, c.out + FLY * 0.55, FLY * 0.45);
        }
        const grey = c.grey !== undefined && f >= c.grey;
        const pulse =
          c.grey !== undefined
            ? 1 + 0.14 * (prog(f, c.grey, 3) - prog(f, c.grey + 3, 6))
            : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - w / 2,
              top,
              opacity,
              scale: String(pulse),
            }}
          >
            <ChipSvg w={w} grey={grey} />
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ text

export const Pill: React.FC<{
  at: number;
  out?: number;
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  sub?: React.ReactNode;
  bg?: string;
}> = ({
  at,
  out,
  x,
  y,
  children,
  color = INKD,
  size = 56,
  sub,
  bg = CREAM,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = 1 - gone(f, out);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% 0",
        scale: String(
          interpolate(f, [at, at + 4, at + 9], [0.3, 1.12, 1], CLAMP),
        ),
        transformOrigin: "50% 100%",
        opacity: o,
        background: bg,
        color,
        borderRadius: size * 0.36,
        padding: `${size * 0.1}px ${size * 0.42}px ${size * 0.16}px`,
        fontFamily: FONT.paper,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.12,
        whiteSpace: "nowrap",
        textAlign: "center",
        boxShadow: "0 8px 0 rgba(0,0,0,0.3)",
      }}
    >
      {children}
      {sub ? (
        <div
          style={{ fontSize: size * 0.44, fontWeight: 700, color: "#5B6670" }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export type Step = {
  at: number;
  text: React.ReactNode;
  color?: string;
  sub?: React.ReactNode;
  y?: number;
};

/** A pill whose text changes (and re-pops) at each step. */
export const Value: React.FC<{
  x: number;
  y: number;
  steps: Step[];
  size?: number;
  out?: number;
}> = ({ x, y, steps, size = 56, out }) => {
  const f = useCurrentFrame();
  const cur = [...steps].reverse().find((s) => f >= s.at);
  if (!cur) return null;
  return (
    <Pill
      key={cur.at}
      at={cur.at}
      out={out}
      x={x}
      y={cur.y ?? y}
      color={cur.color}
      size={size}
      sub={cur.sub}
    >
      {cur.text}
    </Pill>
  );
};

export const Bubble: React.FC<{
  at: number;
  out?: number;
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
}> = ({ at, out, x, y, children, size = 46 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = 1 - gone(f, out);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% 0",
        scale: String(
          interpolate(f, [at, at + 4, at + 8], [0.2, 1.1, 1], CLAMP),
        ),
        transformOrigin: "50% 120%",
        opacity: o,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          color: INKD,
          borderRadius: 30,
          padding: "12px 30px 16px",
          fontFamily: FONT.paper,
          fontWeight: 800,
          fontSize: size,
          whiteSpace: "nowrap",
          boxShadow: "0 6px 0 rgba(0,0,0,0.28)",
        }}
      >
        {children}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          margin: "-2px auto 0",
          borderLeft: "18px solid transparent",
          borderRight: "18px solid transparent",
          borderTop: "26px solid #FFFFFF",
        }}
      />
    </div>
  );
};

/** Full-width card in the top zone (quotes, truth lines). */
export const Banner: React.FC<{
  at: number;
  out?: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
}> = ({ at, out, y, children, size = 54, color = INKD }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = 1 - gone(f, out);
  if (o <= 0) return null;
  const p = prog(f, at, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        translate: `${(1 - p) * -90}px 0px`,
        opacity: p * o,
        background: CREAM,
        color,
        borderRadius: 26,
        padding: "16px 30px 22px",
        textAlign: "center",
        fontFamily: FONT.paper,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.15,
        boxShadow: "0 10px 0 rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
};

/** Big number that slams onto the table, holds, then shrinks away. */
export const Slam: React.FC<{
  at: number;
  color: string;
  children: React.ReactNode;
  hold?: number;
  y?: number;
}> = ({ at, color, children, hold = 26, y = 640 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + hold + 10) return null;
  const p = prog(f, at, 8, Easing.out(Easing.back(2)));
  const q = prog(f, at + hold, 8, Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-block",
          background: CREAM,
          color,
          fontFamily: FONT.paper,
          fontWeight: 800,
          fontSize: 210,
          lineHeight: 1,
          padding: "14px 60px 30px",
          borderRadius: 44,
          boxShadow: "0 16px 0 rgba(0,0,0,0.35)",
          rotate: "-3deg",
          scale: String((2.2 - 1.2 * p) * (1 - 0.7 * q)),
          opacity: Math.min(1, p * 3) * (1 - q),
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ pieces

type Mood = "happy" | "sad" | "flat";
const MOUTH: Record<Mood, string> = {
  happy: "M80 116 Q100 138 120 116",
  sad: "M82 130 Q100 114 118 130",
  flat: "M84 122 L116 122",
};

/** Board-game pawn with a face. Bottom stands on the table at `x`. */
export const Pawn: React.FC<{
  x: number;
  color: string;
  s?: number;
  at?: number;
  out?: number;
  mood?: Mood;
  look?: number;
  talk?: boolean;
  hops?: number[];
  nod?: number;
  cap?: boolean;
  sweat?: boolean;
  seed?: number;
}> = ({
  x,
  color,
  s = 0.9,
  at = 0,
  out,
  mood = "flat",
  look = 0,
  talk,
  hops = [],
  nod,
  cap,
  sweat,
  seed = 0,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = 1 - gone(f, out);
  if (o <= 0) return null;
  const hop = hops.reduce(
    (a, h) =>
      a + (f >= h && f < h + 12 ? Math.sin(((f - h) / 12) * Math.PI) * 70 : 0),
    0,
  );
  const tilt =
    nod === undefined
      ? 0
      : interpolate(f, [nod, nod + 4, nod + 8, nod + 12], [0, 9, -3, 0], CLAMP);
  const breathe = 1 + 0.012 * Math.sin((f + seed * 17) / 13);
  const blink = (f + seed * 31) % 97 < 3;
  const open = talk && Math.floor(f / 4) % 2 === 0;
  const W = 200 * s;
  const H = 340 * s;
  const lx = look * 8;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - W * 0.45,
          width: W * 0.9,
          top: TABLE_Y - 12,
          height: 24,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.38)",
          opacity: o * prog(f, at, 14),
        }}
      />
      <svg
        width={W}
        height={H}
        viewBox="0 0 200 340"
        style={{
          position: "absolute",
          left: x - W / 2,
          top: TABLE_Y - H + dropY(f, at) - hop,
          opacity: o,
          rotate: `${tilt}deg`,
          scale: `1 ${breathe}`,
          transformOrigin: "50% 100%",
          overflow: "visible",
        }}
      >
        <ellipse cx={100} cy={314} rx={86} ry={22} fill={color} />
        <ellipse cx={100} cy={314} rx={86} ry={22} fill="rgba(0,0,0,0.25)" />
        <path
          d="M46 312 C58 236 80 196 84 160 L116 160 C120 196 142 236 154 312 Z"
          fill={color}
        />
        <path
          d="M66 300 C72 250 84 215 88 176"
          stroke="#fff"
          strokeOpacity={0.22}
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx={100} cy={160} rx={48} ry={14} fill={color} />
        <ellipse cx={100} cy={160} rx={48} ry={14} fill="rgba(0,0,0,0.2)" />
        <circle cx={100} cy={90} r={64} fill={color} />
        <ellipse cx={74} cy={62} rx={15} ry={22} fill="#fff" opacity={0.28} />
        {cap ? (
          <g>
            <path d="M38 76 Q100 4 162 76 Z" fill="#37474F" />
            <path d="M150 70 L198 78 L194 88 L146 82 Z" fill="#263238" />
          </g>
        ) : null}
        {blink ? (
          <g stroke="#1A1A1A" strokeWidth={5} strokeLinecap="round">
            <path d={`M${70 + lx} 94 h16`} />
            <path d={`M${114 + lx} 94 h16`} />
          </g>
        ) : (
          <g fill="#1A1A1A">
            <circle cx={78 + lx} cy={94} r={9} />
            <circle cx={122 + lx} cy={94} r={9} />
          </g>
        )}
        {open ? (
          <ellipse
            cx={100 + lx * 0.7}
            cy={124}
            rx={13}
            ry={10}
            fill="#1A1A1A"
          />
        ) : (
          <path
            d={MOUTH[mood]}
            transform={`translate(${lx * 0.7} 0)`}
            stroke="#1A1A1A"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        )}
        {sweat ? (
          <path
            d="M164 50 C172 64 176 72 168 78 C160 82 154 74 158 64 Z"
            fill="#8FD3FF"
          />
        ) : null}
      </svg>
    </>
  );
};

/** House token standing on the table (dashed = an empty slot). */
export const House: React.FC<{
  x: number;
  at?: number;
  s?: number;
  roof?: string;
  dashed?: boolean;
  out?: number;
}> = ({ x, at = 0, s = 0.9, roof = "#B5523B", dashed, out }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = 1 - gone(f, out);
  if (o <= 0) return null;
  const W = 220 * s;
  const H = 200 * s;
  return (
    <svg
      width={W}
      height={H}
      viewBox="0 0 220 200"
      style={{
        position: "absolute",
        left: x - W / 2,
        top: TABLE_Y - H + (dashed ? 0 : dropY(f, at)),
        opacity: o * (dashed ? prog(f, at, 8) : 1),
      }}
    >
      {dashed ? (
        <g
          fill="none"
          stroke={CREAM}
          strokeWidth={5}
          strokeDasharray="12 9"
          opacity={0.65}
        >
          <path d="M24 100 L110 26 L196 100" />
          <rect x={40} y={96} width={140} height={96} />
        </g>
      ) : (
        <g>
          <ellipse cx={110} cy={192} rx={108} ry={9} fill="#7FA650" />
          <rect x={40} y={92} width={140} height={98} fill="#F3E3C3" />
          <path d="M22 100 L110 22 L198 100 Z" fill={roof} />
          <rect x={98} y={132} width={26} height={58} fill="#6D4C33" />
          <rect x={56} y={114} width={30} height={26} fill="#9AD0E6" />
          <rect x={134} y={114} width={30} height={26} fill="#9AD0E6" />
        </g>
      )}
    </svg>
  );
};

/** White card holding an icon (pops in). Centered on x, top at y. */
export const Card: React.FC<{
  at: number;
  out?: number;
  x: number;
  y: number;
  size?: number;
  children: React.ReactNode;
  crossAt?: number;
}> = ({ at, out, x, y, size = 130, children, crossAt }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = 1 - gone(f, out);
  if (o <= 0) return null;
  const c = crossAt === undefined ? 0 : prog(f, crossAt, 6);
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y,
        width: size,
        height: size,
        padding: size * 0.1,
        boxSizing: "border-box",
        background: CREAM,
        borderRadius: size * 0.18,
        boxShadow: "0 8px 0 rgba(0,0,0,0.3)",
        scale: String(
          interpolate(f, [at, at + 4, at + 8], [0.3, 1.1, 1], CLAMP),
        ),
        opacity: o,
      }}
    >
      {children}
      {c > 0
        ? [45, -45].map((r) => (
            <div
              key={r}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size * 1.15 * c,
                height: 16,
                marginLeft: (-size * 1.15 * c) / 2,
                marginTop: -8,
                borderRadius: 8,
                background: "#D32F2F",
                rotate: `${r}deg`,
              }}
            />
          ))
        : null}
    </div>
  );
};

/** Straight arrow that draws itself. */
export const Arrow: React.FC<{
  at: number;
  out?: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}> = ({ at, out, x1, y1, x2, y2, color }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = 1 - gone(f, out);
  if (o <= 0) return null;
  const p = prog(f, at, 10);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0, opacity: o }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      {p > 0.85 ? (
        <polygon
          points="0,-26 40,0 0,26"
          fill={color}
          transform={`translate(${x2} ${y2}) rotate(${a})`}
        />
      ) : null}
    </svg>
  );
};
