import { Audio } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";
import { voiceoverTimeline, type VoiceoverManifest } from "../lib/voiceover";

type Props = {
  manifest: VoiceoverManifest;
  /** Pause between lines, in seconds. */
  gapSeconds?: number;
  /** Delay before the first line, in seconds. */
  startSeconds?: number;
  volume?: number;
};

/** Plays every line of a generated voiceover manifest, back to back. */
export const Voiceover: React.FC<Props> = ({
  manifest,
  gapSeconds,
  startSeconds,
  volume = 1,
}) => {
  const { fps } = useVideoConfig();
  const lines = voiceoverTimeline(manifest, fps, { gapSeconds, startSeconds });

  return (
    <>
      {lines.map((line) => (
        <Audio
          key={line.id}
          name={`VO ${line.id}`}
          src={staticFile(line.src)}
          from={line.from}
          durationInFrames={line.durationInFrames}
          volume={volume}
        />
      ))}
    </>
  );
};
