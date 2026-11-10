/**
 * Style O test (Lucas 2026-11-09): one year of Brown Shrike (Lanius cristatus) migration, East Asia ↔ South-East Asia,
 * from GBIF sightings, 30 s, silent loop (D2): no voice, no subtitles, one music bed, no cut, the last frame flows
 * into the first. Every cue comes from the data (frame → day, camera per day in flock.json), not from a clock.
 * Data: python -P scripts/data-loop.py fetch|terrain|flock brown-shrike.
 * Pass 2 (self-score vs Mapped.Earth, same day): frame slides after the flock, two-tone birds + density glow,
 * subject photo, title block moved to the bottom-left over the Indian Ocean (as in the reference).
 */
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { CLAMP, SAFE } from "../../kit-common";
import info from "../../../public/data-loop/brown-shrike/flock.json";
import { Base, Credit, Flock, type FlockInfo, SeasonWord, SubjectPhoto, TitleBlock, YearClock, camAt, season } from "../data-loop";

const SLUG = "brown-shrike";
const INFO = info as FlockInfo;
export const oShrikeDuration = INFO.frameDay.length;

export const OShrike: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  const day = INFO.frameDay[Math.min(f, INFO.frameDay.length - 1)];
  const cam = camAt(INFO, day);
  const s = season(INFO, day);
  return (
    <AbsoluteFill>
      <Base slug={SLUG} info={INFO} cam={cam} />
      <Flock slug={SLUG} info={INFO} day={day} cam={cam} />
      <SeasonWord word={s.word} opacity={s.opacity} x={SAFE.left + 10} y={SAFE.top} />
      <TitleBlock kicker="A YEAR OF MIGRATION" title={INFO.common} x={SAFE.left + 10} y={1040} />
      <YearClock day={day} x={SAFE.left + 124} y={1318} r={96} />
      <SubjectPhoto src="data-loop/brown-shrike/photo.png" x={SAFE.left + 255} y={1436} height={200} />
      <Credit
        lines={[
          "Bright: many birds",
          "Lines: simulated paths",
          "from GBIF sightings",
          "(eBird, iNaturalist) 2016–25",
          "Photo: T. Mukherjee, CC BY-SA",
          "Terrain: AWS Terrain Tiles",
        ]}
        x={SAFE.left + 520}
        y={1250}
      />
      <Audio
        src={staticFile("data-loop/brown-shrike/music.mp3")}
        volume={(fr) => interpolate(fr, [0, 10, oShrikeDuration - 10, oShrikeDuration], [0.9, 1, 1, 0.9], CLAMP)}
      />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
