/**
 * Style C "Street Sim": the episode as a business-sim game on one isometric
 * street. Three lots (0 = left neighbor, 1 = the client, 2 = right neighbor)
 * on a road; trucks drive in, lawns get mowed into stripes, +/− numbers float
 * up, a HUD counter rolls, the rich steps are a quest log. Static frame.
 */
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { FONT } from "../paper";
import { CREAM, INKD, prog } from "./chipTable";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ------------------------------------------------------------------ projection

const A = 88;
const OX = 270;
const OY = 830;
/** Grid (gx, gy, height z in px) → screen [x, y]. */
export const P = (gx: number, gy: number, z = 0): [number, number] => [
  OX + (gx - gy) * A,
  OY + ((gx + gy) * A) / 2 - z,
];
const pts = (...ps: [number, number][]) => ps.map((p) => p.join(",")).join(" ");
const face = (gx: number, gy: number, w: number, d: number, z = 0) =>
  pts(P(gx, gy, z), P(gx + w, gy, z), P(gx + w, gy + d, z), P(gx, gy + d, z));

export const LOT_X = [0, 3, 6];
const S = 2.6;
/** Screen anchor above lot k's house (price tags), and its front lawn. */
export const TAG = (k: number) => P(LOT_X[k] + 0.85, 0.85, 225);
export const LAWN = (k: number) => P(LOT_X[k] + 1.6, 1.6, 0);

const Box: React.FC<{
  gx: number;
  gy: number;
  w: number;
  d: number;
  h: number;
  z?: number;
  top: string;
  left: string;
  right: string;
}> = ({ gx, gy, w, d, h, z = 0, top, left, right }) => (
  <g>
    <polygon
      points={pts(
        P(gx, gy + d, z),
        P(gx + w, gy + d, z),
        P(gx + w, gy + d, z + h),
        P(gx, gy + d, z + h),
      )}
      fill={left}
    />
    <polygon
      points={pts(
        P(gx + w, gy, z),
        P(gx + w, gy + d, z),
        P(gx + w, gy + d, z + h),
        P(gx + w, gy, z + h),
      )}
      fill={right}
    />
    <polygon points={face(gx, gy, w, d, z + h)} fill={top} />
  </g>
);

// ------------------------------------------------------------------ world

const ROOFS = {
  coral: ["#FF8A65", "#D9663F"],
  purple: ["#9575CD", "#6E4FAE"],
  blue: ["#4FC3F7", "#2499CF"],
};
const ROOF_OF = ["coral", "purple", "blue"] as const;

const Lot: React.FC<{ k: number; mow?: [number, number] }> = ({ k, mow }) => {
  const f = useCurrentFrame();
  const gx = LOT_X[k];
  const p = mow ? prog(f, mow[0], mow[1], Easing.linear) : 0;
  const bands = 6;
  return (
    <g>
      <Box
        gx={gx}
        gy={0}
        w={S}
        d={S}
        h={12}
        z={-12}
        top="#6FA83A"
        left="#7A5634"
        right="#5E4027"
      />
      {Array.from({ length: 16 }).map((_, i) => {
        const [x, y] = P(
          gx + 0.2 + random(`tx${k}${i}`) * 2.2,
          0.2 + random(`ty${k}${i}`) * 2.2,
        );
        return (
          <path
            key={i}
            d={`M${x - 7} ${y} L${x} ${y - 12} L${x + 7} ${y}`}
            stroke="#5B8F2C"
            strokeWidth={4}
            fill="none"
          />
        );
      })}
      {Array.from({ length: bands }).map((_, i) => {
        const w = Math.min(S / bands, p * S - (i * S) / bands);
        return w > 0 ? (
          <polygon
            key={i}
            points={face(gx + (i * S) / bands, 0, w, S)}
            fill={i % 2 ? "#9CCC65" : "#8BC34A"}
          />
        ) : null;
      })}
    </g>
  );
};

const House: React.FC<{ k: number; at: number }> = ({ k, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const dy = (1 - prog(f, at, 14, Easing.bounce)) * -300;
  const gx = LOT_X[k] + 0.25;
  const gy = 0.25;
  const w = 1.15;
  const h = 74;
  const r = 66;
  const o = 0.08;
  const [roof, roofDark] = ROOFS[ROOF_OF[k]];
  const apex = P(gx + w / 2, gy + w / 2, h + r);
  const c1 = P(gx - o, gy - o, h);
  const c2 = P(gx + w + o, gy - o, h);
  const c3 = P(gx + w + o, gy + w + o, h);
  const c4 = P(gx - o, gy + w + o, h);
  return (
    <g transform={`translate(0 ${dy})`}>
      <Box
        gx={gx}
        gy={gy}
        w={w}
        d={w}
        h={h}
        top="#FFF3E0"
        left="#F3DFC1"
        right="#E2C49D"
      />
      <polygon
        points={pts(
          P(gx + 0.42, gy + w, 0),
          P(gx + 0.72, gy + w, 0),
          P(gx + 0.72, gy + w, 34),
          P(gx + 0.42, gy + w, 34),
        )}
        fill="#6D4C33"
      />
      <polygon
        points={pts(
          P(gx + w, gy + 0.32, 26),
          P(gx + w, gy + 0.78, 26),
          P(gx + w, gy + 0.78, 48),
          P(gx + w, gy + 0.32, 48),
        )}
        fill="#90CAF9"
      />
      <polygon points={pts(c1, c2, apex)} fill={roofDark} />
      <polygon points={pts(c4, c1, apex)} fill={roof} />
      <polygon points={pts(c2, c3, apex)} fill={roofDark} />
      <polygon points={pts(c3, c4, apex)} fill={roof} />
    </g>
  );
};

const Tree: React.FC<{ gx: number; gy: number }> = ({ gx, gy }) => {
  const [x, y] = P(gx, gy);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={30} ry={14} fill="rgba(0,0,0,0.15)" />
      <rect x={x - 7} y={y - 46} width={14} height={46} fill="#795548" />
      <circle cx={x} cy={y - 78} r={42} fill="#4E9A3A" />
      <circle cx={x - 12} cy={y - 90} r={20} fill="#66B84F" />
    </g>
  );
};

export const Truck: React.FC<{
  rich?: boolean;
  /** frame it starts driving, start gx, parked gx */
  at?: number;
  from?: number;
  to: number;
  dur?: number;
}> = ({ rich, at = 0, from, to, dur = 28 }) => {
  const f = useCurrentFrame();
  const gx = interpolate(f, [at, at + dur], [from ?? to, to], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const gy = rich ? -0.9 : -1.55;
  const [c, d1, d2] = rich
    ? ["#43A047", "#2E7D32", "#1B5E20"]
    : ["#E53935", "#C62828", "#8E1B1B"];
  const bounce = f < at + dur && f >= at ? Math.abs(Math.sin(f * 1.3)) * 3 : 0;
  return (
    <g transform={`translate(0 ${-bounce})`}>
      {[0.2, 0.95].map((k) => {
        const [x, y] = P(gx + k, gy + 0.6);
        return <ellipse key={k} cx={x} cy={y} rx={12} ry={9} fill="#263238" />;
      })}
      <Box
        gx={gx}
        gy={gy}
        w={0.75}
        d={0.6}
        h={30}
        z={6}
        top={c}
        left={d1}
        right={d2}
      />
      <Box
        gx={gx + 0.75}
        gy={gy}
        w={0.45}
        d={0.6}
        h={52}
        z={6}
        top={c}
        left={d1}
        right={d2}
      />
      <polygon
        points={pts(
          P(gx + 1.2, gy + 0.08, 34),
          P(gx + 1.2, gy + 0.52, 34),
          P(gx + 1.2, gy + 0.52, 52),
          P(gx + 1.2, gy + 0.08, 52),
        )}
        fill="#B3E5FC"
      />
    </g>
  );
};

const Mower: React.FC<{ k: number; mow: [number, number]; rich?: boolean }> = ({
  k,
  mow,
  rich,
}) => {
  const f = useCurrentFrame();
  if (f < mow[0] || f > mow[0] + mow[1] + 4) return null;
  const p = prog(f, mow[0], mow[1], Easing.linear);
  const gx = LOT_X[k] + p * (S - 0.4);
  const gy = 1.9 + Math.sin(f / 3) * 0.08;
  const [h1, h2] = P(gx - 0.1, gy + 0.15, 40);
  return (
    <g>
      <Box
        gx={gx}
        gy={gy}
        w={0.36}
        d={0.3}
        h={16}
        top={rich ? "#43A047" : "#E53935"}
        left="#455A64"
        right="#37474F"
      />
      <line
        x1={P(gx, gy + 0.15, 16)[0]}
        y1={P(gx, gy + 0.15, 16)[1]}
        x2={h1}
        y2={h2}
        stroke="#37474F"
        strokeWidth={5}
      />
    </g>
  );
};

const Flag: React.FC<{ k: number; at: number }> = ({ k, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const [x, y] = P(LOT_X[k] + 2.1, 2.0);
  const s = interpolate(f, [at, at + 5, at + 10], [0, 1.15, 1], CLAMP);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={y - 120}
        stroke="#ECEFF1"
        strokeWidth={6}
      />
      <path
        d={`M${x} ${y - 120} L${x + 120} ${y - 104} L${x} ${y - 70} Z`}
        fill="#2E7D32"
      />
      <text
        x={x + 14}
        y={y - 86}
        fill="#fff"
        fontFamily={FONT.paper}
        fontWeight={800}
        fontSize={26}
      >
        SIGNED
      </text>
    </g>
  );
};

/** The whole street. `mow[k]` = [start, frames]; `mowed` lots are already striped. */
export const Street: React.FC<{
  behind?: React.ReactNode;
  front?: React.ReactNode;
  mow?: Partial<Record<number, [number, number]>>;
  mowed?: number[];
  houseAt?: number[];
  flags?: Partial<Record<number, number>>;
  mower?: { k: number; mow: [number, number]; rich?: boolean }[];
  highlightRoad?: number;
}> = ({
  behind,
  front,
  mow = {},
  mowed = [],
  houseAt = [-99, -99, -99],
  flags = {},
  mower = [],
  highlightRoad,
}) => {
  const f = useCurrentFrame();
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <polygon points={face(-14, -1.8, 30, 1.65)} fill="#78858F" />
      <polygon points={face(-14, -0.15, 30, 0.15)} fill="#CFD8DC" />
      {highlightRoad !== undefined && f >= highlightRoad ? (
        <polygon
          points={face(-0.2, -1.8, 9, 1.65)}
          fill="#FFEB3B"
          opacity={0.45 * prog(f, highlightRoad, 8)}
        />
      ) : null}
      <line
        x1={P(-14, -0.95)[0]}
        y1={P(-14, -0.95)[1]}
        x2={P(16, -0.95)[0]}
        y2={P(16, -0.95)[1]}
        stroke="#ECEFF1"
        strokeWidth={4}
        strokeDasharray="20 18"
      />
      {behind}
      {[0, 1, 2].map((k) => (
        <Lot key={k} k={k} mow={mowed.includes(k) ? [-99, 1] : mow[k]} />
      ))}
      <Tree gx={1.6} gy={3.7} />
      <Tree gx={9.4} gy={1.2} />
      {[0, 1, 2].map((k) => (
        <House key={k} k={k} at={houseAt[k]} />
      ))}
      {mower.map((m) => (
        <Mower key={m.k} {...m} />
      ))}
      {Object.entries(flags).map(([k, at]) => (
        <Flag key={k} k={Number(k)} at={at as number} />
      ))}
      {front}
    </svg>
  );
};

/** Dashed route drawn along a list of grid points. */
export const Route: React.FC<{
  at: number;
  path: [number, number][];
  color: string;
}> = ({ at, path, color }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const sp = path.map(([gx, gy]) => P(gx, gy));
  const len = sp
    .slice(1)
    .reduce((a, p, i) => a + Math.hypot(p[0] - sp[i][0], p[1] - sp[i][1]), 0);
  return (
    <polyline
      points={pts(...sp)}
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
      strokeDasharray={`${len * prog(f, at, 20)} ${len}`}
      opacity={0.9}
    />
  );
};

// ------------------------------------------------------------------ overlays

export const Field: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(#D4ECB8 0%, #B5DC95 55%, #9CCB7A 100%)",
    }}
  >
    {children}
  </AbsoluteFill>
);

/** "+$48" / "−$18" game numbers floating up from a point. */
export const Floater: React.FC<{
  at: number;
  x: number;
  y: number;
  color: string;
  children: React.ReactNode;
  size?: number;
}> = ({ at, x, y, color, children, size = 56 }) => {
  const f = useCurrentFrame();
  const dur = 42;
  if (f < at || f > at + dur) return null;
  const t = (f - at) / dur;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - 120 * Easing.out(Easing.cubic)(t),
        translate: "-50% 0",
        fontFamily: FONT.paper,
        fontWeight: 800,
        fontSize: size,
        color,
        WebkitTextStroke: "10px #fff",
        paintOrder: "stroke fill",
        scale: String(interpolate(t, [0, 0.1, 0.2], [0.4, 1.2, 1], CLAMP)),
        opacity: t > 0.75 ? (1 - t) / 0.25 : 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

/** Gold coins flying from lots to the HUD. */
export const CoinRun: React.FC<{
  at: number;
  from: [number, number][];
  to?: [number, number];
  per?: number;
}> = ({ at, from, to = [820, 200], per = 4 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {from.flatMap(([x1, y1], s) =>
        Array.from({ length: per }, (_, i) => {
          const t = prog(f, at + s * 3 + i * 3, 20, Easing.inOut(Easing.cubic));
          if (t <= 0 || t >= 1) return null;
          return (
            <div
              key={`${s}-${i}`}
              style={{
                position: "absolute",
                left: x1 + (to[0] - x1) * t - 20,
                top: y1 + (to[1] - y1) * t - Math.sin(t * Math.PI) * 140 - 20,
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "#F6C945",
                border: "4px solid #C48A1E",
                fontFamily: FONT.paper,
                fontWeight: 800,
                fontSize: 24,
                color: "#8A5A10",
                textAlign: "center",
                lineHeight: "32px",
              }}
            >
              $
            </div>
          );
        }),
      )}
    </>
  );
};

export type HudStep = {
  at: number;
  label: string;
  value: number;
  color?: string;
};

/** Game HUD: side badge + rolling money counter. */
export const Hud: React.FC<{
  badge: string;
  color: string;
  steps?: HudStep[];
  title?: string;
  at?: number;
  left?: number;
  width?: number;
  big?: number;
  top?: number;
}> = ({
  badge,
  color,
  steps = [],
  title = "",
  at = 0,
  left = 60,
  width = 960,
  big = 118,
  top = 110,
}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const i = steps.reduce((acc, s, k) => (f >= s.at ? k : acc), -1);
  const cur = steps[i];
  const prev = steps[i - 1];
  const v = cur
    ? Math.round(
        interpolate(f, [cur.at, cur.at + 14], [prev?.value ?? 0, cur.value], {
          ...CLAMP,
          easing: Easing.out(Easing.cubic),
        }),
      )
    : null;
  const bump = cur
    ? interpolate(f, [cur.at, cur.at + 4, cur.at + 12], [1, 1.1, 1], CLAMP)
    : 1;
  return (
    <div
      style={{
        position: "absolute",
        left,
        width,
        top,
        height: 190,
        boxSizing: "border-box",
        background: CREAM,
        borderRadius: 32,
        boxShadow: "0 10px 0 rgba(0,0,0,0.18)",
        border: `6px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 34px",
        opacity: prog(f, at, 6),
        fontFamily: FONT.paper,
      }}
    >
      <div>
        <div
          style={{
            display: "inline-block",
            background: color,
            color: "#fff",
            fontWeight: 800,
            fontSize: 40,
            padding: "2px 22px 6px",
            borderRadius: 16,
          }}
        >
          {badge}
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 32,
            color: "#5B6670",
            marginTop: 10,
            whiteSpace: "nowrap",
          }}
        >
          {cur ? cur.label : title}
        </div>
      </div>
      {v !== null ? (
        <div
          style={{
            fontWeight: 800,
            fontSize: big,
            color: cur?.color ?? INKD,
            scale: String(bump),
            fontVariantNumeric: "tabular-nums",
          }}
        >
          ${v}
        </div>
      ) : null}
    </div>
  );
};

export type Quest = { at: number; done?: number; text: string };

/** Quest log (rich steps) in the bottom-left zone. */
export const Quests: React.FC<{ items: Quest[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const first = Math.min(...items.map((q) => q.at));
  if (f < first) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        top: 1290,
        width: 600,
        padding: "12px 24px 16px",
        boxSizing: "border-box",
        background: "rgba(30,42,54,0.88)",
        borderRadius: 26,
        fontFamily: FONT.paper,
        color: "#fff",
        opacity: prog(f, first, 6),
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 4,
          color: "#FFD54F",
        }}
      >
        QUESTS
      </div>
      {items.map((q, i) => {
        if (f < q.at) return null;
        const done = q.done !== undefined && f >= q.done;
        const p = prog(f, q.at, 8);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 6,
              fontWeight: 800,
              fontSize: 31,
              opacity: p,
              translate: `${(1 - p) * -40}px 0px`,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                border: "4px solid #fff",
                background: done ? "#43A047" : "transparent",
                textAlign: "center",
                lineHeight: "28px",
                fontSize: 26,
                scale: done
                  ? String(
                      interpolate(
                        f,
                        [q.done!, q.done! + 4, q.done! + 8],
                        [1, 1.3, 1],
                        CLAMP,
                      ),
                    )
                  : "1",
              }}
            >
              {done ? "✓" : ""}
            </div>
            <span style={{ opacity: done ? 0.75 : 1 }}>
              {"①②③④"[i]} {q.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
