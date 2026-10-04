import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { float } from "../lib/animation";

type Props = {
  backgroundColor: string;
  accentColor: string;
  secondaryColor: string;
  /** Show the faint grid overlay. */
  grid?: boolean;
};

/**
 * Full-bleed animated backdrop: slowly drifting color orbs, an optional grid
 * and a vignette. Place it outside <Stage> so it always fills the frame.
 */
export const Background: React.FC<Props> = ({
  backgroundColor,
  accentColor,
  secondaryColor,
  grid = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + float(frame, fps, 6, 9)}% ${
            35 + float(frame, fps, 5, 7, 1)
          }%, ${accentColor}55 0%, transparent 45%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${72 + float(frame, fps, 5, 8, 2)}% ${
            68 + float(frame, fps, 6, 10, 3)
          }%, ${secondaryColor}40 0%, transparent 42%)`,
        }}
      />
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
