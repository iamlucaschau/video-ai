import { AbsoluteFill, useVideoConfig } from "remotion";
import { DESIGN } from "../config";

/**
 * A fixed 1920×1080 design canvas, scaled to fit the actual composition size.
 * Author layouts in 1920×1080 pixel values inside <Stage>; they stay
 * proportional at 720p, 4K, etc. Put full-bleed backgrounds outside of it.
 */
export const Stage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { width, height } = useVideoConfig();
  const scale = Math.min(width / DESIGN.width, height / DESIGN.height);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          width: DESIGN.width,
          height: DESIGN.height,
          scale: String(scale),
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
