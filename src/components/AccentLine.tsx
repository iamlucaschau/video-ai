import { useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, progress } from "../lib/animation";

type Props = {
  width: number;
  height?: number;
  colors: [string, string];
  /** Start time in seconds. */
  start?: number;
  duration?: number;
  /** Which side the line grows from. */
  origin?: "left" | "center" | "right";
};

/** A gradient bar that draws itself in. */
export const AccentLine: React.FC<Props> = ({
  width,
  height = 8,
  colors,
  start = 0,
  duration = 0.9,
  origin = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = progress(frame, fps, { start, duration, easing: EASE.inOut });

  return (
    <div
      style={{
        width,
        height,
        borderRadius: height,
        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
        scale: `${p} 1`,
        transformOrigin: origin,
        boxShadow: `0 0 32px ${colors[0]}80`,
      }}
    />
  );
};
