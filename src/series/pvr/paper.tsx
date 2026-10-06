/**
 * Poor vs Rich Daily — "Receipt × Paper" look (chosen 2026-10-06).
 * A layered paper diorama with paper puppets; all money math is printed on a
 * thermal receipt. Motion is stepped at ~12 fps for a stop-motion feel.
 */
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { INK } from "./theme";

const L = { subsets: ["latin" as const] };
const bricolage = loadBricolage("normal", {
  weights: ["700", "800"],
  ...L,
}).fontFamily;

/**
 * Series fonts (bible §4, chosen 2026-10-06): Space Mono on receipts,
 * Bricolage Grotesque for paper strips, tags, signs and subtitles.
 */
export const FONT = {
  receipt: loadMono("normal", { weights: ["400", "700"], ...L }).fontFamily,
  paper: bricolage,
  paperWeight: 800,
  sign: bricolage,
  sub: bricolage,
  subWeight: 700,
};

export const PAPER = {
  wall: "#D9C6A3",
  floor: "#9C7B54",
  card: "#FBFAF5",
  receipt: "#F8F6F0",
  ink: "#2B2B2B",
  garage: "#8E99A3",
  slat: "#A8B2BB",
  machine: "#5C6B78",
  machineDark: "#2F3740",
  skin: "#E7B48F",
  hair: "#3A2A20",
  shirt: "#EDE6D6",
  jeans: "#3D4E6B",
} as const;

export const SHADOW =
  "drop-shadow(0 8px 0 rgba(60,40,20,0.18)) drop-shadow(0 16px 16px rgba(60,40,20,0.20))";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Frame snapped to ~12 fps (stop-motion). Use for every paper movement. */
export const useStepFrame = () => {
  const frame = useCurrentFrame();
  return Math.floor(frame / 2.5) * 2.5;
};

/** 0→1 between two frames, stepped, eased. */
export const step = (frame: number, from: number, frames: number) =>
  interpolate(frame, [from, from + frames], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

// ---------------------------------------------------------------- world

export const PaperDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="paper-edge">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.06"
        numOctaves={3}
        seed={3}
        result="w"
      />
      <feDisplacementMap in="SourceGraphic" in2="w" scale={7} />
    </filter>
    <filter id="paper-grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves={3}
        seed={5}
      />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.10" />
      </feComponentTransfer>
    </filter>
    <filter id="thermal">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="1.1"
        numOctaves={1}
        seed={9}
        result="n"
      />
      <feColorMatrix
        in="n"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75"
        result="m"
      />
      <feComposite in="SourceGraphic" in2="m" operator="in" />
    </filter>
  </svg>
);

/** Kraft-paper wall + torn floor layer. */
export const Diorama: React.FC<{ floorY?: number }> = ({ floorY = 1390 }) => (
  <AbsoluteFill style={{ backgroundColor: PAPER.wall }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <rect width={1080} height={1920} filter="url(#paper-grain)" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: -20,
        right: -20,
        top: floorY,
        bottom: -20,
        filter: SHADOW,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: PAPER.floor,
          filter: "url(#paper-edge)",
        }}
      />
    </div>
  </AbsoluteFill>
);

/** A paper piece with torn edges and a layered shadow. */
export const Paper: React.FC<{
  style?: React.CSSProperties;
  bg?: string;
  children?: React.ReactNode;
  pin?: string;
}> = ({ style, bg = PAPER.card, children, pin }) => (
  <div style={{ position: "absolute", filter: SHADOW, ...style }}>
    <div
      style={{
        background: bg,
        width: "100%",
        height: "100%",
        filter: "url(#paper-edge)",
      }}
    >
      {children}
    </div>
    {pin ? (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -12,
          marginLeft: -15,
          width: 30,
          height: 30,
          borderRadius: 15,
          background: pin,
          boxShadow: "0 4px 0 rgba(0,0,0,0.25)",
        }}
      />
    ) : null}
  </div>
);

/** Pinned card that drops onto the wall at `at` (stepped). */
export const PinCard: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  out?: number;
  children?: React.ReactNode;
}> = ({ at, x, y, w, h, rotate = 0, out = Infinity, children }) => {
  const f = useStepFrame();
  if (f < at || f > out + 8) return null;
  const p = step(f, at, 8);
  const q = Number.isFinite(out) ? step(f, out, 8) : 0;
  return (
    <Paper
      pin={INK.poor}
      style={{
        left: x,
        top: y - (1 - p) * 120 + q * 300,
        width: w,
        height: h,
        rotate: `${rotate + (1 - p) * 8 + q * 25}deg`,
        opacity: Math.min(1, p * 2) * (1 - q),
      }}
    >
      {children}
    </Paper>
  );
};

// ---------------------------------------------------------------- puppet

/**
 * Paper puppet (520×900 viewBox). `apron` is the side color (POOR red /
 * RICH green). `sign` shows a raised sign in the right hand; `signUp` 0→1
 * pops it up. Idle head sway is stepped. `rich` = RICH character (ponytail,
 * calm smile); `flip` mirrors the puppet to face left.
 */
export const Puppet: React.FC<{
  x: number;
  y: number;
  scale?: number;
  apron: string;
  sign?: string;
  signUp?: number;
  sweat?: boolean;
  rich?: boolean;
  flip?: boolean;
}> = ({ x, y, scale = 1, apron, sign, signUp = 0, sweat, rich, flip }) => {
  const f = useStepFrame();
  const sway = Math.sin(f / 18) * 2;
  const up = signUp > 0;
  return (
    <svg
      width={520 * scale}
      height={900 * scale}
      viewBox="0 0 520 900"
      style={{
        position: "absolute",
        left: x,
        top: y,
        filter: SHADOW,
        overflow: "visible",
        scale: flip ? "-1 1" : undefined,
      }}
    >
      <g filter="url(#paper-edge)">
        {/* legs + shoes */}
        <rect
          x={150}
          y={640}
          width={48}
          height={190}
          rx={14}
          fill={PAPER.jeans}
        />
        <rect
          x={218}
          y={640}
          width={48}
          height={190}
          rx={14}
          fill={PAPER.jeans}
        />
        <ellipse cx={168} cy={836} rx={44} ry={20} fill="#2a2a2a" />
        <ellipse cx={248} cy={836} rx={44} ry={20} fill="#2a2a2a" />
        {/* torso + apron */}
        <path
          d="M120 420 Q208 380 296 420 L310 660 L106 660 Z"
          fill={PAPER.shirt}
        />
        <path d="M150 440 L266 440 L278 690 L138 690 Z" fill={apron} />
        <rect
          x={180}
          y={560}
          width={56}
          height={44}
          rx={6}
          fill="rgba(0,0,0,0.18)"
        />
        {/* left arm (down) */}
        <path
          d="M120 430 Q80 520 110 600"
          stroke={PAPER.shirt}
          strokeWidth={40}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={112} cy={610} r={24} fill={PAPER.skin} />
        {/* right arm: down, or raised with the sign */}
        {up ? (
          <g style={{ translate: `0px ${(1 - signUp) * 260}px` }}>
            <rect x={322} y={230} width={14} height={330} fill="#B08A5A" />
            <rect
              x={160}
              y={30}
              width={340}
              height={210}
              rx={10}
              fill={PAPER.card}
            />
            <text
              x={330}
              y={170}
              textAnchor="middle"
              fontFamily={FONT.sign}
              fontSize={100}
              fill={apron}
            >
              {sign}
            </text>
          </g>
        ) : null}
        {up ? (
          <>
            <path
              d="M296 430 Q330 380 330 330"
              stroke={PAPER.shirt}
              strokeWidth={40}
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={330} cy={318} r={26} fill={PAPER.skin} />
          </>
        ) : (
          <>
            <path
              d="M296 430 Q336 520 306 600"
              stroke={PAPER.shirt}
              strokeWidth={40}
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={304} cy={610} r={24} fill={PAPER.skin} />
          </>
        )}
        {/* head (sways) */}
        <g style={{ rotate: `${sway}deg`, transformOrigin: "208px 400px" }}>
          {rich ? (
            <ellipse
              cx={312}
              cy={290}
              rx={34}
              ry={70}
              fill={PAPER.hair}
              style={{ rotate: "18deg", transformOrigin: "300px 250px" }}
            />
          ) : null}
          <rect x={190} y={360} width={36} height={40} fill={PAPER.skin} />
          <ellipse cx={208} cy={300} rx={92} ry={100} fill={PAPER.skin} />
          {rich ? (
            <path
              d="M116 300 C110 200 300 190 300 290 C270 240 160 236 116 300 Z"
              fill={PAPER.hair}
            />
          ) : (
            <path
              d="M118 290 L130 220 L150 250 L162 196 L184 236 L200 186 L220 232 L238 192 L254 240 L274 206 L296 286 Q210 230 118 290 Z"
              fill={PAPER.hair}
            />
          )}
          <circle cx={178} cy={310} r={9} fill="#222" />
          <circle cx={238} cy={310} r={9} fill="#222" />
          <path
            d={
              rich
                ? "M160 282 L196 280 M256 282 L220 280"
                : "M156 286 L196 274 M260 286 L220 274"
            }
            stroke={PAPER.hair}
            strokeWidth={8}
            strokeLinecap="round"
          />
          <path
            d={rich ? "M184 348 Q208 372 232 348" : "M186 360 Q208 344 230 360"}
            stroke="#7a3b2a"
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
          />
          {sweat ? (
            <path
              d="M292 266 Q282 290 292 302 Q302 290 292 266"
              fill="#8fd3ff"
            />
          ) : null}
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- props

/** Paper pressure washer (380×300 viewBox) with an optional tag (0→1 pops it in). */
export const Machine: React.FC<{
  x: number;
  y: number;
  scale?: number;
  sold?: number;
  tag?: string;
  tagColor?: string;
}> = ({
  x,
  y,
  scale = 1,
  sold = 0,
  tag = "SOLD $150",
  tagColor = INK.poor,
}) => (
  <svg
    width={380 * scale}
    height={300 * scale}
    viewBox="0 0 380 300"
    style={{
      position: "absolute",
      left: x,
      top: y,
      filter: SHADOW,
      overflow: "visible",
    }}
  >
    <g filter="url(#paper-edge)">
      <rect
        x={60}
        y={90}
        width={200}
        height={140}
        rx={16}
        fill={PAPER.machine}
      />
      <rect x={80} y={50} width={160} height={50} rx={10} fill="#4A5763" />
      <circle cx={100} cy={250} r={34} fill={PAPER.machineDark} />
      <circle cx={220} cy={250} r={34} fill={PAPER.machineDark} />
      <path
        d="M260 150 C320 150 330 80 345 40 L360 260"
        stroke={PAPER.machineDark}
        strokeWidth={12}
        fill="none"
      />
    </g>
    {sold > 0 ? (
      <g
        style={{ translate: `0px ${(1 - sold) * -80}px` }}
        opacity={Math.min(1, sold * 2)}
      >
        <rect
          x={20}
          y={-40}
          width={350}
          height={104}
          rx={8}
          fill={PAPER.card}
          filter="url(#paper-edge)"
        />
        <text
          x={195}
          y={32}
          textAnchor="middle"
          fontFamily={FONT.sign}
          fontSize={54}
          fill={tagColor}
        >
          {tag}
        </text>
      </g>
    ) : null}
  </svg>
);

/** Paper house with driveway (fills its box). */
export const House: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 180">
    <path d="M30 86 L100 26 L170 86 L170 146 L30 146 Z" fill="#C9B79A" />
    <path
      d="M22 90 L100 20 L178 90"
      stroke="#7a5c3c"
      strokeWidth={14}
      fill="none"
      strokeLinejoin="round"
    />
    <rect x={86} y={108} width={28} height={38} fill="#6d5640" />
    <path d="M86 146 L64 178 L136 178 L114 146 Z" fill="#9aa3a8" />
  </svg>
);

/** Paper label that slaps on at `at` (stepped). */
export const Tag: React.FC<{
  at: number;
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  font?: "paper" | "sign";
  rotate?: number;
  out?: number;
  bg?: string;
}> = ({
  at,
  x,
  y,
  children,
  color = PAPER.ink,
  size = 56,
  font = "paper",
  rotate = -2,
  out = Infinity,
  bg,
}) => {
  const f = useStepFrame();
  if (f < at || f > out + 6) return null;
  const p = step(f, at, 5);
  const q = Number.isFinite(out) ? step(f, out, 6) : 0;
  return (
    <Paper
      bg={bg}
      style={{
        left: x,
        top: y,
        rotate: `${rotate}deg`,
        scale: String(1.3 - 0.3 * p),
        opacity: Math.min(1, p * 2) * (1 - q),
      }}
    >
      <div
        style={{
          padding: "14px 26px",
          whiteSpace: "nowrap",
          fontFamily: font === "sign" ? FONT.sign : FONT.paper,
          fontWeight: FONT.paperWeight,
          fontSize: size,
          lineHeight: 1.1,
          color,
        }}
      >
        {children}
      </div>
    </Paper>
  );
};

/** Chunky cut-paper arrow from (x1,y1) to (x2,y2); `dashed` for "where it came from". */
export const PaperArrow: React.FC<{
  at: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  bend?: number;
  dashed?: boolean;
}> = ({ at, x1, y1, x2, y2, color, bend = 0, dashed }) => {
  const f = useStepFrame();
  if (f < at) return null;
  const p = step(f, at, 6);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const head = (k: number) =>
    `${x2 + Math.cos(a + k) * 46} ${y2 + Math.sin(a + k) * 46}`;
  return (
    <svg
      width={1080}
      height={1920}
      style={{
        position: "absolute",
        inset: 0,
        filter: SHADOW,
        opacity: p,
        overflow: "visible",
      }}
    >
      <g filter="url(#paper-edge)">
        <path
          d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`}
          stroke={color}
          strokeWidth={18}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dashed ? "40 26" : undefined}
          pathLength={dashed ? undefined : 1}
          style={dashed ? undefined : { strokeDasharray: `${p} 1` }}
        />
        <path
          d={`M${head(Math.PI * 0.82)} L${x2} ${y2} L${head(-Math.PI * 0.82)} Z`}
          fill={color}
        />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- receipt

export type ReceiptLine = {
  /** Local frame the printer prints this line. */
  at: number;
  /** "row" = label ..... value; "text" = centered; "rule" = ----; "total" = big. */
  kind: "row" | "text" | "note" | "rule" | "double" | "total" | "stamp";
  left?: string;
  right?: string;
  color?: string;
};

const LINE_H: Record<ReceiptLine["kind"], number> = {
  row: 52,
  text: 52,
  note: 40,
  rule: 34,
  double: 34,
  total: 150,
  stamp: 180,
};

/**
 * Thermal printer standing on the floor; the receipt feeds UP out of its
 * slot, so the newest line is always at the slot and the receipt reads
 * top-to-bottom in print order.
 */
export const ReceiptPrinter: React.FC<{
  x: number;
  slotY: number;
  width: number;
  header: string;
  sub: string;
  lines: ReceiptLine[];
  cols?: number;
}> = ({ x, slotY, width, header, sub, lines, cols = 24 }) => {
  const f = useStepFrame();
  const printed = lines.filter((l) => f >= l.at);
  // Feed height grows with each printed line (stepped ease per line)
  const fed =
    printed.reduce((h, l) => h + LINE_H[l.kind] * step(f, l.at, 5), 0) + 150;
  const busy = printed.some((l) => f < l.at + 5);
  const row = (l: string, r: string) =>
    l + " " + ".".repeat(Math.max(1, cols - l.length - r.length - 2)) + " " + r;

  return (
    <>
      {/* receipt (clipped at the slot) */}
      <div
        style={{
          position: "absolute",
          left: x + 24,
          top: 0,
          width: width - 48,
          height: slotY,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: fed,
            background: PAPER.receipt,
            boxShadow: "0 10px 24px rgba(60,40,20,0.25)",
            clipPath: `polygon(${Array.from({ length: 25 }, (_, i) => `${(i / 24) * 100}% ${i % 2 ? 10 : 0}px`).join(", ")}, 100% 100%, 0 100%)`,
            fontFamily: FONT.receipt,
            color: PAPER.ink,
            padding: "26px 26px 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              filter: "url(#thermal)",
              textAlign: "center",
              height: 124,
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1.1,
                paddingTop: 20,
              }}
            >
              {header}
            </div>
            <div style={{ fontSize: 22, marginTop: 6 }}>{sub}</div>
          </div>
          {printed.map((l, i) => (
            <div
              key={i}
              style={{
                height: LINE_H[l.kind],
                display: "flex",
                alignItems: "center",
              }}
            >
              {l.kind === "row" ? (
                <div
                  style={{
                    fontSize: 32,
                    whiteSpace: "pre",
                    filter: "url(#thermal)",
                    color: l.color,
                  }}
                >
                  {row(l.left ?? "", l.right ?? "")}
                </div>
              ) : l.kind === "note" ? (
                <div
                  style={{
                    fontSize: 24,
                    width: "100%",
                    textAlign: "right",
                    filter: "url(#thermal)",
                  }}
                >
                  {l.left}
                </div>
              ) : l.kind === "text" ? (
                <div
                  style={{
                    fontSize: 32,
                    width: "100%",
                    textAlign: "right",
                    filter: "url(#thermal)",
                    color: l.color,
                  }}
                >
                  {l.left}
                </div>
              ) : l.kind === "rule" || l.kind === "double" ? (
                <div
                  style={{
                    fontSize: 32,
                    whiteSpace: "pre",
                    filter: "url(#thermal)",
                  }}
                >
                  {(l.kind === "rule" ? "-" : "=").repeat(cols)}
                </div>
              ) : l.kind === "total" ? (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontSize: 44,
                      fontWeight: 700,
                      filter: "url(#thermal)",
                    }}
                  >
                    {l.left}
                  </span>
                  <span
                    style={{ fontSize: 120, fontWeight: 700, color: l.color }}
                  >
                    {l.right}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      padding: "4px 24px",
                      border: `7px solid ${l.color}`,
                      borderRadius: 12,
                      color: l.color,
                      fontSize: 64,
                      fontWeight: 700,
                      rotate: "-10deg",
                      scale: String(1 + (1 - step(f, l.at, 5)) * 1.2),
                      opacity: 0.88,
                      filter: "url(#thermal)",
                    }}
                  >
                    {l.left}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* printer body (paper cut-out) */}
      <Paper
        bg="#3E3E46"
        style={{
          left: x,
          top: slotY - 20,
          width,
          height: 150,
          translate: busy ? `0px ${(f % 5) - 2}px` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: 14,
            height: 14,
            borderRadius: 7,
            background: "#121215",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 30,
            bottom: 34,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: busy ? "#ff5a4f" : "#7a2a26",
            boxShadow: busy ? "0 0 14px #ff5a4f" : undefined,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            bottom: 30,
            fontFamily: FONT.receipt,
            fontSize: 20,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.15em",
          }}
        >
          POOR vs RICH
        </div>
      </Paper>
    </>
  );
};

// ---------------------------------------------------------------- quote

/** Torn paper strip that slaps onto the wall (truth-punch lines). */
export const QuoteStrip: React.FC<{
  at: number;
  y: number;
  children: React.ReactNode;
  rotate?: number;
  out?: number;
  size?: number;
}> = ({ at, y, children, rotate = -1.5, out = Infinity, size = 52 }) => {
  const f = useStepFrame();
  if (f < at || f > out + 6) return null;
  const p = step(f, at, 6);
  const q = Number.isFinite(out) ? step(f, out, 6) : 0;
  return (
    <Paper
      style={{
        left: 50,
        right: 50,
        top: y,
        scale: String(1.25 - 0.25 * p),
        rotate: `${rotate}deg`,
        opacity: Math.min(1, p * 2) * (1 - q),
      }}
    >
      <div
        style={{
          padding: "30px 40px",
          fontFamily: FONT.paper,
          fontWeight: FONT.paperWeight,
          fontSize: size,
          lineHeight: 1.2,
          color: PAPER.ink,
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </Paper>
  );
};
