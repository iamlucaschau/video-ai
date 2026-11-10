/**
 * Style O KitSheet: palette + every component on one frame, for `npm run sheet:j -- Style-O-DataLoop-Kit --frames 0`.
 * Uses the brown-shrike data at a fixed autumn day.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { SAFE } from "../../kit-common";
import info from "../../../public/data-loop/brown-shrike/flock.json";
import { Base, Chip, Credit, Flock, type FlockInfo, O, SeasonWord, SubjectPhoto, TitleBlock, YearClock, camAt } from "../data-loop";

const DAY = 280; // Oct 8
const INFO = info as FlockInfo;

export const OKit: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Base slug="brown-shrike" info={INFO} cam={camAt(INFO, DAY)} />
      <Flock slug="brown-shrike" info={INFO} day={DAY} cam={camAt(INFO, DAY)} />
      <TitleBlock kicker="A YEAR OF MIGRATION" title="Brown Shrike" x={SAFE.left + 10} y={1040} />
      <SeasonWord word="Autumn" opacity={1} x={SAFE.left + 10} y={SAFE.top} />
      <div style={{ position: "absolute", left: 640, top: 520, display: "flex", flexWrap: "wrap", width: 280, gap: 12 }}>
        {O.swatches.map((c) => (
          <div key={c} style={{ width: 80, height: 80, borderRadius: 10, background: c, border: `3px solid ${O.ink}` }} />
        ))}
      </div>
      <Chip text="8,000 birds" f={f} at={-10} y={460} x={760} />
      <YearClock day={DAY} x={SAFE.left + 124} y={1318} r={96} />
      <SubjectPhoto src="data-loop/brown-shrike/photo.png" x={SAFE.left + 255} y={1436} height={200} />
      <Credit lines={["Lines: simulated birds, from sightings", "Data: GBIF (eBird) 2016–2025"]} x={SAFE.left + 520} y={1250} />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
export const oKitDuration = 30;
