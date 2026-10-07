/**
 * Kinetic effects for the Receipt × Paper look (no camera moves: series rule).
 * Everything is stepped (~12 fps) to stay stop-motion.
 */
import { Easing, interpolate, random } from "remotion";
import { FONT, PAPER, SHADOW, step, useStepFrame } from "./paper";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Big cut-paper number that slams onto the screen, holds, then flies off. */
export const Slam: React.FC<{
  at: number;
  children: React.ReactNode;
  color: string;
  hold?: number;
}> = ({ at, children, color, hold = 22 }) => {
  const f = useStepFrame();
  if (f < at || f > at + hold + 10) return null;
  const p = step(f, at, 5);
  const q = interpolate(f, [at + hold, at + hold + 8], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          filter: SHADOW,
          scale: String((1.9 - 0.9 * p) * (1 - 0.6 * q)),
          rotate: `${-4 + q * 20}deg`,
          translate: `${q * 500}px ${-q * 700}px`,
          opacity: Math.min(1, p * 3),
        }}
      >
        <div
          style={{
            background: PAPER.card,
            padding: "10px 60px 24px",
            fontFamily: FONT.paper,
            fontWeight: 800,
            fontSize: 230,
            lineHeight: 1,
            color,
            filter: "url(#paper-edge)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/** Paper dollar bills fluttering from (x1, y1) to (x2, y2). */
export const MoneyBurst: React.FC<{
  at: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  count?: number;
}> = ({ at, x1, y1, x2, y2, count = 9 }) => {
  const f = useStepFrame();
  if (f < at) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const t = interpolate(f - at - i * 2, [0, 22], [0, 1], {
          ...CLAMP,
          easing: Easing.inOut(Easing.quad),
        });
        if (t <= 0 || t >= 1) return null;
        const sx = (random(`bx${i}`) - 0.5) * 160;
        const sy = (random(`by${i}`) - 0.5) * 120;
        const x = x1 + (x2 + sx - x1) * t;
        const y =
          y1 +
          (y2 + sy - y1) * t -
          Math.sin(t * Math.PI) * (180 + random(`arc${i}`) * 140);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 110,
              height: 56,
              background: "#7FB069",
              border: "4px solid #5B8A4A",
              borderRadius: 6,
              filter: SHADOW,
              rotate: `${(random(`r${i}`) - 0.5) * 60 + t * 540 * (i % 2 ? 1 : -1)}deg`,
              scale: `1 ${0.4 + 0.6 * Math.abs(Math.cos(t * 9 + i))}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT.sign,
              fontWeight: 800,
              fontSize: 34,
              color: "#2F5A2A",
            }}
          >
            $
          </div>
        );
      })}
    </>
  );
};
