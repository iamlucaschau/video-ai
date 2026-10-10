import { Audio } from "@remotion/media";
import { Sequence, staticFile, useVideoConfig } from "remotion";
import catalog from "../../../public/sfx/catalog.json";

/**
 * One real sound effect from the curated Pixabay library (public/sfx,
 * scripts/fetch-sfx.mjs). Every file is levelled from its measured loudness
 * to `level` LUFS so a whoosh and a deep hit sit at the same height under
 * the VO (−14 LUFS). Default −15 (Lucas 2026-10-08: −26 and −18 were too quiet): an accent at about voice level.
 *
 *   <Sfx file="sfx/whoosh/clean-whoosh-382726.mp3" at={at("12")} />
 */
export const Sfx: React.FC<{ file: string; at: number; level?: number }> = ({
  file,
  at,
  level = -15,
}) => {
  const entry = catalog.find((c) => c.file === file);
  if (!entry) throw new Error(`SFX not in public/sfx/catalog.json: ${file}`);
  const gain = Math.min(4, 10 ** ((level - (entry.lufs ?? level)) / 20));
  return (
    <Sequence from={Math.round(at)} name={`SFX ${entry.title}`} layout="none">
      <Audio src={staticFile(file)} volume={gain} />
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
