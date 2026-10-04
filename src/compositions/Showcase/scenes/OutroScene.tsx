import { Circle } from "@remotion/shapes";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText, Background, Stage } from "../../../components";
import { SHOWCASE_TIMING } from "../../../config";
import { CLAMP, EASE } from "../../../lib/animation";
import { COLORS, FONTS, TYPE } from "../../../theme";
import type { ShowcaseProps } from "../schema";

/** Scene 3: circular color reveal, closing title, then fade to black. */
export const OutroScene: React.FC<ShowcaseProps> = ({
  outroTitle,
  outroSubtitle,
  backgroundColor,
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = SHOWCASE_TIMING.outroSeconds * fps;

  // Expanding rings: radius grows past the frame diagonal to reveal the color
  const reveal = interpolate(frame, [0.1 * fps, 1.3 * fps], [0, 1], {
    ...CLAMP,
    easing: EASE.inOut,
  });
  const ringReveal = interpolate(frame, [0.25 * fps, 1.6 * fps], [0, 1], {
    ...CLAMP,
    easing: EASE.inOut,
  });

  return (
    <AbsoluteFill>
      <Background
        backgroundColor={backgroundColor}
        accentColor={accentColor}
        secondaryColor={secondaryColor}
        grid={false}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, ${backgroundColor} 70%)`,
          clipPath: `circle(${reveal * 75}% at 50% 50%)`,
          opacity: 0.55,
        }}
      />
      <Stage>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{
              position: "absolute",
              opacity: 1 - ringReveal * 0.6,
              scale: String(0.4 + ringReveal * 2.2),
            }}
          >
            <Circle
              radius={260}
              fill="none"
              stroke={secondaryColor}
              strokeWidth={3}
            />
          </div>
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <AnimatedText
            text={outroTitle}
            by="char"
            start={0.7}
            style={{
              justifyContent: "center",
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 190,
              letterSpacing: "-0.04em",
              color: COLORS.text,
            }}
          />
          <Interactive.Div
            name="Outro subtitle"
            style={{
              marginTop: 40,
              padding: "18px 36px",
              borderRadius: 999,
              border: `1.5px solid ${COLORS.border}`,
              background: COLORS.surface,
              fontFamily: FONTS.body,
              fontWeight: 500,
              fontSize: TYPE.caption,
              letterSpacing: "0.02em",
              color: COLORS.text,
              opacity: interpolate(frame, [1.4 * fps, 2.1 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [1.4 * fps, 2.1 * fps],
                ["0px 30px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {outroSubtitle}
          </Interactive.Div>
        </AbsoluteFill>
      </Stage>

      {/* Fade to black over the final 0.6 s */}
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity: interpolate(frame, [end - 0.6 * fps, end - 1], [0, 1], {
            ...CLAMP,
            easing: EASE.in,
          }),
        }}
      />
    </AbsoluteFill>
  );
};
