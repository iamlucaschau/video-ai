import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { EASE, mix, progress } from "../lib/animation";

type Props = {
  width: number;
  height: number;
  /** Entrance start, in seconds. */
  start?: number;
  glowColor?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Frosted card that rises and settles into place. */
export const GlassCard: React.FC<Props> = ({
  width,
  height,
  start = 0,
  glowColor = COLORS.accent,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = progress(frame, fps, { start, duration: 1, easing: EASE.spring });

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 36,
        background: COLORS.surface,
        border: `1.5px solid ${COLORS.border}`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 60px ${glowColor}22`,
        backdropFilter: "blur(20px)",
        opacity: p,
        translate: `0px ${mix(p, 120, 0)}px`,
        scale: String(mix(p, 0.92, 1)),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
