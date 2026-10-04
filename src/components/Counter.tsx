import { useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, progress } from "../lib/animation";

type Props = {
  to: number;
  from?: number;
  /** Start time in seconds. */
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  easing?: (t: number) => number;
  style?: React.CSSProperties;
};

/** A number that counts up with easing. Uses tabular digits to avoid jitter. */
export const Counter: React.FC<Props> = ({
  to,
  from = 0,
  start = 0,
  duration = 1.5,
  decimals = 0,
  prefix = "",
  suffix = "",
  easing = EASE.out,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = progress(frame, fps, { start, duration, easing });
  const value = from + (to - from) * p;

  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
