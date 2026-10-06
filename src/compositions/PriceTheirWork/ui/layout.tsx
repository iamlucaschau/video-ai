import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { lerp, pop, ramp } from "../beats";
import { C, F } from "../theme";

/** Shows children between two local frames, with a short fade/slide. */
export const Show: React.FC<{
  from: number;
  to?: number;
  children: React.ReactNode;
  fade?: number;
}> = ({ from, to, children, fade = 6 }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1) return null;
  if (to !== undefined && frame > to + fade) return null;
  const pin = ramp(frame, from, fade);
  const pout = to === undefined ? 0 : ramp(frame, to, fade);
  return (
    <AbsoluteFill
      style={{
        opacity: pin * (1 - pout),
        translate: `0px ${lerp(pin, 30, 0) - pout * 40}px`,
        filter: pout > 0 ? `blur(${pout * 8}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Horizontally centered row at a fixed y on the 1080×1920 canvas. */
export const Row: React.FC<{
  y: number;
  children: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ y, children, gap = 40, style }) => (
  <div
    style={{
      position: "absolute",
      top: y,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Number badge + title shown at the top of each rich-side step. */
export const StepHeader: React.FC<{
  n: number;
  title: string;
  at: number;
  color: string;
}> = ({ n, title, at, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 13);
  const tp = ramp(frame, at + 4, 12);
  return (
    <Row y={330} gap={28}>
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: 65,
          background: color,
          color: C.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.display,
          fontSize: 84,
          scale: String(Math.max(0, p)),
          boxShadow: `0 0 60px ${color}66`,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: F.display,
          fontSize: 92,
          color: C.text,
          textTransform: "uppercase",
          lineHeight: 0.95,
          opacity: tp,
          translate: `${lerp(tp, -30, 0)}px 0px`,
          maxWidth: 700,
        }}
      >
        {title}
      </div>
    </Row>
  );
};

/** Chat bubble. */
export const Bubble: React.FC<{
  at: number;
  side: "left" | "right";
  color: string;
  textColor?: string;
  children: React.ReactNode;
  italic?: boolean;
}> = ({ at, side, color, textColor = C.text, children, italic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at, 13);
  return (
    <div
      style={{
        alignSelf: side === "left" ? "flex-start" : "flex-end",
        maxWidth: 760,
        padding: "30px 42px",
        borderRadius: 44,
        borderBottomLeftRadius: side === "left" ? 8 : 44,
        borderBottomRightRadius: side === "right" ? 8 : 44,
        background: color,
        color: textColor,
        fontFamily: F.ui,
        fontWeight: 800,
        fontStyle: italic ? "italic" : undefined,
        fontSize: 56,
        lineHeight: 1.15,
        scale: String(Math.max(0, p)),
        opacity: Math.min(1, p * 2),
        transformOrigin: side === "left" ? "left bottom" : "right bottom",
      }}
    >
      {children}
    </div>
  );
};

/** Animated money / number count. */
export const CountUp: React.FC<{
  from: number;
  to: number;
  at: number;
  frames?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({
  from,
  to,
  at,
  frames = 18,
  decimals = 0,
  prefix = "",
  suffix = "",
  style,
}) => {
  const frame = useCurrentFrame();
  const v = lerp(ramp(frame, at, frames), from, to);
  const text = v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
};

/** Global SFX level, leaves headroom under the voiceover. */
const SFX_GAIN = 0.75;

export type SfxName =
  | "whoosh"
  | "pop"
  | "tick"
  | "impact"
  | "ching"
  | "riser"
  | "buzz";

/** One-shot sound effect at a local frame. */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({
  name,
  at,
  volume = 0.5,
}) => (
  <Audio
    name={`SFX ${name}`}
    src={staticFile(`audio/${name}.wav`)}
    from={Math.max(0, Math.round(at))}
    volume={volume * SFX_GAIN}
  />
);
