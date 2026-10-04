import { Audio } from "@remotion/media";
import { Circle, Star, Triangle } from "@remotion/shapes";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AnimatedText,
  Background,
  Counter,
  GlassCard,
  Stage,
} from "../../../components";
import { toFrames } from "../../../config";
import { fadeUp, popIn, stagger } from "../../../lib/animation";
import { COLORS, FONTS, SAFE, TYPE } from "../../../theme";
import type { ShowcaseProps } from "../schema";

const CARD_START = 0.7;
const CARD_STAGGER = 0.18;

/** Scene 2: heading, three staggered feature cards and a progress readout. */
export const FeaturesScene: React.FC<ShowcaseProps> = ({
  features,
  backgroundColor,
  accentColor,
  secondaryColor,
  soundEffects,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const icons = [
    <Circle key="circle" radius={44} fill={accentColor} />,
    <Triangle
      key="triangle"
      length={96}
      direction="up"
      cornerRadius={12}
      fill={secondaryColor}
    />,
    <Star
      key="star"
      points={5}
      innerRadius={22}
      outerRadius={50}
      cornerRadius={6}
      fill={COLORS.highlight}
    />,
  ];

  return (
    <AbsoluteFill>
      <Background
        backgroundColor={backgroundColor}
        accentColor={secondaryColor}
        secondaryColor={accentColor}
      />
      <Stage>
        <AbsoluteFill style={{ padding: `${SAFE.y}px ${SAFE.x}px` }}>
          <AnimatedText
            text="Everything is a component."
            start={0.1}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: TYPE.title,
              letterSpacing: "-0.03em",
              color: COLORS.text,
            }}
          />
          <Interactive.Div
            name="Feature intro"
            style={{
              marginTop: 20,
              fontFamily: FONTS.body,
              fontSize: TYPE.body,
              color: COLORS.muted,
              opacity: interpolate(frame, [0.5 * fps, 1.2 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            Compose scenes from reusable, animated building blocks.
          </Interactive.Div>

          {/* Cards */}
          <div style={{ display: "flex", gap: 48, marginTop: 96 }}>
            {features.map((feature, i) => {
              const start = stagger(i, CARD_STAGGER, CARD_START);
              return (
                <GlassCard
                  key={feature.label}
                  width={512}
                  height={420}
                  start={start}
                  glowColor={i === 1 ? secondaryColor : accentColor}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 48,
                  }}
                >
                  <div
                    style={{
                      width: 112,
                      height: 112,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 28,
                      background: "rgba(255,255,255,0.06)",
                      ...popIn(frame, fps, { start: start + 0.25 }),
                    }}
                  >
                    {icons[i]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 700,
                        fontSize: TYPE.heading,
                        letterSpacing: "-0.02em",
                        color: COLORS.text,
                        ...fadeUp(frame, fps, {
                          start: start + 0.3,
                          distance: 24,
                        }),
                      }}
                    >
                      {feature.label}
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        fontFamily: FONTS.body,
                        fontSize: TYPE.caption,
                        color: COLORS.muted,
                        ...fadeUp(frame, fps, {
                          start: start + 0.4,
                          distance: 20,
                          blur: 0,
                        }),
                      }}
                    >
                      {feature.caption}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Progress readout, driven by the actual video config */}
          <div
            style={{
              position: "absolute",
              left: SAFE.x,
              right: SAFE.x,
              bottom: SAFE.y,
              display: "flex",
              alignItems: "center",
              gap: 36,
              fontFamily: FONTS.body,
              fontSize: TYPE.caption,
              color: COLORS.muted,
              ...fadeUp(frame, fps, { start: 1.6, distance: 20, blur: 0 }),
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              {width}×{height} · {fps} fps
            </span>
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 8,
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 8,
                  background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
                  transformOrigin: "left",
                  scale: `${interpolate(frame, [1.8 * fps, 3.8 * fps], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.65, 0, 0.35, 1),
                  })} 1`,
                }}
              />
            </div>
            <Counter
              to={100}
              start={1.8}
              duration={2}
              suffix="%"
              easing={Easing.bezier(0.65, 0, 0.35, 1)}
              style={{
                color: COLORS.text,
                fontWeight: 600,
                minWidth: 90,
                textAlign: "right",
              }}
            />
          </div>
        </AbsoluteFill>
      </Stage>

      {/* Sound: a soft pop as each card icon lands */}
      {soundEffects
        ? features.map((feature, i) => (
            <Audio
              key={feature.label}
              name={`Pop ${i + 1}`}
              src={staticFile("audio/pop.wav")}
              from={toFrames(stagger(i, CARD_STAGGER, CARD_START) + 0.35, fps)}
              volume={0.45}
            />
          ))
        : null}
    </AbsoluteFill>
  );
};
