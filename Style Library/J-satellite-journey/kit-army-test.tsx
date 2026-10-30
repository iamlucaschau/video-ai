/**
 * Style J kit check (C1, 2026-10-27): the `Army` traveller marching up the Rhône on the Ep01
 * plates, next to a `Vessel` for scale. 4 s, no audio. Composition `Style-J-Kit-ArmyTest`.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import plates from "../../public/images/j-aeneas-full/map/plates.json";
import { SafeGuide } from "../../src/series/pvr/safe";
import { along, Army, camAt, GlowRoute, type JKey, type Plate, projectLine, SatMap, Vessel } from "./satellite-journey";

const PLATES: Plate[] = (["world", "mid"] as const).map((k) => ({ src: `images/j-aeneas-full/map/${k}.jpg`, ...plates[k] }));

/** Beaucaire → up the Rhône towards Valence (rough line, kit test only). */
const LEG: [number, number][] = [[4.64, 43.81], [4.72, 44.1], [4.7, 44.45], [4.78, 44.75], [4.87, 44.98]];

const KEYS: JKey[] = [{ at: 0, lon: 4.9, lat: 44.4, zoom: 260, tilt: 24, bearing: 0, push: 0.02, orbit: 0.6 }];

export const armyTestDuration = 120;

export const ArmyTest: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f);
  const leg = projectLine(cam, LEG);
  const p = Math.min(1, f / (armyTestDuration - 20));
  const head = along(leg, p);
  return (
    <AbsoluteFill style={{ background: "#0B1424" }}>
      <SatMap cam={cam} plates={PLATES} />
      <GlowRoute legs={[leg]} current={0} p={p} />
      <Army x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />
      <Vessel x={200} y={1300} heading={0} f={f} />
      <SafeGuide />
    </AbsoluteFill>
  );
};
