import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import catalog from "../../../public/sfx/catalog.json";

/**
 * One real sound effect from the curated Pixabay library (public/sfx,
 * scripts/fetch-sfx.mjs). Every file is levelled from its measured loudness
 * to `level` LUFS so a whoosh and a deep hit sit at the same height under
 * the VO (−14 LUFS). Default −26: felt, never on top of the voice.
 *
 *   <Sfx file="sfx/whoosh/clean-whoosh-382726.mp3" at={at("12")} />
 */
export const Sfx: React.FC<{ file: string; at: number; level?: number }> = ({
  file,
  at,
  level = -26,
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
