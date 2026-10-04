import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, EASE, float } from "../lib/animation";

type Props = {
  /** Center position on the 1920×1080 design canvas. */
  x: number;
  y: number;
  /** Entrance start, in seconds. */
  start?: number;
  /** Rotation (degrees) the shape settles at. */
  rotate?: number;
  /** Continuous rotation speed, degrees per second. */
  spin?: number;
  /** Ambient float amplitude in px. 0 disables. */
  drift?: number;
  /** Phase offset so multiple shapes don't move in lockstep. */
  phase?: number;
  children: React.ReactNode;
};

/**
 * Positions any shape (e.g. from @remotion/shapes) and gives it a springy
 * entrance plus gentle ambient motion.
 */
export const FloatingShape: React.FC<Props> = ({
  x,
  y,
  start = 0,
  rotate = 0,
  spin = 0,
  drift = 14,
  phase = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [start * fps, (start + 1.1) * fps], [0, 1], {
    ...CLAMP,
    easing: EASE.bouncy,
    output: "perceptual-scale",
  });
  const fade = interpolate(
    frame,
    [start * fps, (start + 0.4) * fps],
    [0, 1],
    CLAMP,
  );
  const angle = rotate - 90 * (1 - Math.min(enter, 1)) + (spin * frame) / fps;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% calc(-50% + ${float(frame, fps, drift, 5, phase)}px)`,
        scale: String(enter),
        rotate: `${angle}deg`,
        opacity: fade,
      }}
    >
      {children}
    </div>
  );
};
