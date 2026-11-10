import { Audio } from "@remotion/media";
import { useContext } from "react";
import { getInputProps, getRemotionEnvironment, Internals, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import catalog from "../../../public/sfx/catalog.json";
import onsets from "../../../public/sfx/onsets.json";

/**
 * One real sound effect from the curated Pixabay library (public/sfx,
 * scripts/fetch-sfx.mjs). Every file is levelled from its measured loudness
 * to `level` LUFS so a whoosh and a deep hit sit at the same height under
 * the VO (−14 LUFS). Default −15 (Lucas 2026-10-08: −26 and −18 were too quiet): an accent at about voice level.
 *
 *   <Sfx file="sfx/whoosh/clean-whoosh-382726.mp3" at={at("12")} />
 *
 * `seconds` plays only the first part of a long file (e.g. a storm ambience) with a short
 * fade in and a 0.6 s fade out.
 *
 * `align` (W6, 2026-11-03): "start" (default, the file's first sample on `at`), "onset" (the moment
 * it starts sounding lands on `at`: hits, clicks, steps) or "peak" (its loudest moment lands on
 * `at`: whooshes, booms). Times from public/sfx/onsets.json (scripts/sfx-onsets.mjs); most files
 * open with ~0.14 s of near-silence, so "start" sounds ~4 frames late. New work: "onset" / "peak".
 */
export const Sfx: React.FC<{ file: string; at: number; level?: number; seconds?: number; align?: "start" | "onset" | "peak" }> = ({
  file,
  at,
  level = -15,
  seconds,
  align = "start",
}) => {
  const { fps } = useVideoConfig();
  const parent = useContext(Internals.SequenceContext);
  // scripts/sfx-cues.mjs collects these lines; never on in a normal render
  if (getRemotionEnvironment().isRendering && getInputProps().sfxCues === true) {
    const frame = (parent ? parent.cumulatedFrom + parent.relativeFrom : 0) + at;
    console.log(`SFXCUE ${JSON.stringify({ file, frame, align, seconds })}`);
  }
  const entry = catalog.find((c) => c.file === file);
  if (!entry) throw new Error(`SFX not in public/sfx/catalog.json: ${file}`);
  const times = (onsets as Record<string, { onset: number; peak: number }>)[file];
  if (align !== "start" && !times) throw new Error(`SFX not measured (node scripts/sfx-onsets.mjs): ${file}`);
  const shift = align === "start" ? 0 : Math.round(times[align] * fps);
  const gain = Math.min(4, 10 ** ((level - (entry.lufs ?? level)) / 20));
  const len = seconds ? Math.round(seconds * fps) : undefined;
  return (
    <Sequence from={Math.round(at) - shift} durationInFrames={len} name={`SFX ${entry.title}`} layout="none">
      <Audio
        src={staticFile(file)}
        volume={
          len
            ? (f) => gain * interpolate(f, [0, 0.15 * fps, len - 0.6 * fps, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : gain
        }
      />
    </Sequence>
  );
};

/** [file under sfx/, VO line id, fraction through the line, frame offset, LUFS level] */
export type SfxCue = [string, string, number?, number?, number?];

/** A whole SFX track cued from the VO timing (same cues as the visuals). */
export const SfxCues: React.FC<{
  timing: { lines: { id: string; start: number; end: number }[] };
  cues: SfxCue[];
}> = ({ timing, cues }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map(([file, id, k = 0, off = 0, level], i) => {
        const l = timing.lines.find((x) => x.id === id);
        if (!l) throw new Error(`SFX cue: no VO line ${id}`);
        const at = (l.start + (l.end - l.start) * k) * fps + off;
        return <Sfx key={i} file={`sfx/${file}`} at={Math.max(0, at)} level={level} />;
      })}
    </>
  );
};

/**
 * Licensed music bed from the catalog (public/sfx/music, Pixabay Content License), levelled from
 * its measured loudness to `level` LUFS (−28 ≈ the old bed-bright at volume 0.2, ~14 dB under
 * the VO before mastering). Short fades at both ends keep the loop seam soft; `duck(frame)`
 * (0–1) dips it, e.g. under a climax. Tracks are longer than the episodes, so no loop.
 *
 *   <MusicBed file={PILLAR_MUSIC.P2} duck={(f) => …} />
 */
export const MusicBed: React.FC<{ file: string; level?: number; duck?: (f: number) => number }> = ({
  file,
  level = -28,
  duck = () => 1,
}) => {
  const { durationInFrames, fps } = useVideoConfig();
  const entry = catalog.find((c) => c.file === file);
  if (!entry) throw new Error(`Music not in public/sfx/catalog.json: ${file}`);
  // a Content ID claim on this track: rendering it again would get the video blocked
  if ("banned" in entry) throw new Error(`Music banned (Content ID claim): ${file}: ${entry.banned}`);
  const gain = Math.min(4, 10 ** ((level - (entry.lufs ?? level)) / 20));
  const fade = Math.round(0.3 * fps);
  return (
    <Audio
      name={`Music ${entry.title}`}
      src={staticFile(file)}
      volume={(f) =>
        gain * duck(f) * interpolate(f, [0, fade, durationInFrames - fade, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

/** Map channel: one music bed per pillar (Lucas 2026-10-14; alternates in the Atlas Tí Hon project: B:/Claude/Project/atlas ti hon, Map/00_he-thong/01_CHANNEL-BIBLE.md §6). */
export const PILLAR_MUSIC = {
  P1: "sfx/music/p1-historical-documentary-music-349042.mp3",
  P2: "sfx/music/p2-explainer-explainer-music-576633.mp3",
  P3: "sfx/music/p3-science-documentary-169621.mp3",
  P4: "sfx/music/p4-cinematic-documentary-115669.mp3",
  P5: "sfx/music/p5-mystery-quirky-355604.mp3",
} as const;
