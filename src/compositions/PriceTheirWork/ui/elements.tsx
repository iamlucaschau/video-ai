import { useCurrentFrame, useVideoConfig } from "remotion";
import { lerp, pop, ramp } from "../beats";
import { C, F } from "../theme";

/** Price tag with a string, a hole and a gentle swing after it lands. */
export const PriceTag: React.FC<{
  value: string;
  sub?: string;
  color: string;
  at: number;
  scale?: number;
  textColor?: string;
}> = ({ value, sub, color, at, scale = 1, textColor = C.ink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 11);
  const t = Math.max(0, frame - at) / fps;
  const swing =
    9 * Math.exp(-t * 1.6) * Math.sin(t * 7.5) + 1.5 * Math.sin(t * 1.4);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        scale: String(scale * Math.max(0, p)),
        opacity: Math.min(1, p * 2),
        rotate: `${swing}deg`,
        transformOrigin: "50% 0%",
      }}
    >
      <div style={{ width: 4, height: 70, background: C.muted }} />
      <div
        style={{
          position: "relative",
          padding: "26px 54px 26px 84px",
          background: color,
          clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)",
          borderRadius: 18,
          boxShadow: `0 30px 80px ${color}55`,
          color: textColor,
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 40,
            top: "50%",
            width: 24,
            height: 24,
            marginTop: -12,
            borderRadius: 12,
            background: C.bg,
          }}
        />
        <div
          style={{
            fontFamily: F.display,
            fontSize: 150,
            lineHeight: 1,
            letterSpacing: "-0.01em",
          }}
        >
          {value}
        </div>
        {sub ? (
          <div
            style={{
              fontFamily: F.ui,
              fontWeight: 800,
              fontSize: 36,
              marginTop: 6,
              letterSpacing: "0.06em",
            }}
          >
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** A line that slashes through its parent (parent must be position: relative). */
export const Strike: React.FC<{
  at: number;
  color?: string;
  thickness?: number;
  angle?: number;
}> = ({ at, color = C.poor, thickness = 14, angle = -8 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, 7);
  return (
    <div
      style={{
        position: "absolute",
        left: "-6%",
        right: "-6%",
        top: "50%",
        height: thickness,
        marginTop: -thickness / 2,
        borderRadius: thickness,
        background: color,
        rotate: `${angle}deg`,
        scale: `${p} 1`,
        transformOrigin: "left center",
        boxShadow: `0 0 30px ${color}AA`,
      }}
    />
  );
};

/** Rubber stamp that slams in. */
export const Stamp: React.FC<{
  text: string;
  at: number;
  color: string;
  size?: number;
  rotate?: number;
}> = ({ text, at, color, size = 110, rotate = -8 }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, 6);
  return (
    <div
      style={{
        display: "inline-block",
        padding: "14px 34px",
        border: `10px solid ${color}`,
        borderRadius: 18,
        color,
        fontFamily: F.display,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        rotate: `${rotate}deg`,
        scale: String(lerp(p, 2.4, 1)),
        opacity: p,
        background: `${C.bg}CC`,
        boxShadow: `0 0 50px ${color}44`,
      }}
    >
      {text}
    </div>
  );
};

/** Headline word(s) that punch in from below. */
export const Punch: React.FC<{
  children: React.ReactNode;
  at: number;
  size?: number;
  color?: string;
  font?: "display" | "ui";
  style?: React.CSSProperties;
}> = ({
  children,
  at,
  size = 140,
  color = C.text,
  font = "display",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 14);
  return (
    <div
      style={{
        position: "relative",
        fontFamily: font === "display" ? F.display : F.ui,
        fontWeight: font === "ui" ? 900 : 400,
        fontSize: size,
        lineHeight: 1,
        color,
        textTransform: font === "display" ? "uppercase" : undefined,
        textAlign: "center",
        opacity: Math.min(1, p * 1.5),
        translate: `0px ${lerp(Math.min(p, 1), 70, 0)}px`,
        scale: String(lerp(p, 0.6, 1)),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Pops in at `at` (scale + fade). Use for icons and small groups. */
export const PopIn: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  damping?: number;
}> = ({ at, children, style, damping = 12 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, damping);
  return (
    <div
      style={{
        scale: String(Math.max(0, p)),
        opacity: Math.min(1, p * 2),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Fades/dims an element from `at` (e.g. when something is removed). */
export const useFadeOut = (at: number, frames = 10) => {
  const frame = useCurrentFrame();
  return 1 - ramp(frame, at, frames);
};

/** Paper receipt with rows that print in one by one. */
export const Receipt: React.FC<{
  title: string;
  at: number;
  rows: {
    label: string;
    value: string;
    at: number;
    tone?: "plus" | "minus" | "total" | "plain";
  }[];
  accent: string;
  width?: number;
}> = ({ title, at, rows, accent, width = 760 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 16);
  const zig = Array.from(
    { length: 25 },
    // right → left along the bottom edge
    (_, i) => `${100 - (i / 24) * 100}% ${i % 2 ? 100 : 97}%`,
  ).join(", ");

  return (
    <div
      style={{
        width,
        padding: "44px 52px 64px",
        background: C.paper,
        color: C.ink,
        fontFamily: F.mono,
        clipPath: `polygon(0 0, 100% 0, ${zig})`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
        translate: `0px ${lerp(Math.min(p, 1), 500, 0)}px`,
        rotate: `${lerp(Math.min(p, 1), 6, -1.5)}deg`,
        opacity: Math.min(1, p * 3),
      }}
    >
      <div
        style={{
          fontFamily: F.display,
          fontSize: 64,
          letterSpacing: "0.06em",
          textAlign: "center",
          paddingBottom: 22,
          borderBottom: `4px dashed ${C.ink}44`,
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      {rows.map((r) => {
        const rp = ramp(frame, r.at, 8);
        const total = r.tone === "total";
        return (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: total ? "22px 0 0" : "12px 0",
              marginTop: total ? 12 : 0,
              borderTop: total ? `4px solid ${C.ink}` : undefined,
              fontSize: total ? 64 : 46,
              fontWeight: total ? 800 : 500,
              opacity: rp,
              translate: `${lerp(rp, -30, 0)}px 0px`,
            }}
          >
            <span>{r.label}</span>
            <span
              style={{
                color:
                  r.tone === "minus"
                    ? C.poor
                    : r.tone === "total"
                      ? accent
                      : C.ink,
                fontWeight: 800,
              }}
            >
              {r.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** Big circled step number. */
export const StepBadge: React.FC<{ n: number; at: number; color: string }> = ({
  n,
  at,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        scale: String(Math.max(0, p)),
        opacity: Math.min(1, p * 2),
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          background: color,
          color: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.display,
          fontSize: 96,
          boxShadow: `0 0 70px ${color}66`,
        }}
      >
        {n}
      </div>
    </div>
  );
};
