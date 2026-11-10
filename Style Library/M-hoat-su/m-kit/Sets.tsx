/**
 * Style M outdoor sets gallery (2026-11-04): each code-drawn set for one second, a figure on the ground for scale.
 * `node scripts/sheet-j.mjs Style-M-HoatSu-Sets --frames 15,45,…` to judge them side by side.
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { stand } from "../../toon-engine/furnish";
import { basePose, Hero } from "../../toon-engine/rig";
import { Base, ROOM } from "../hoat-su";
import { CodeSet, type SetKind } from "../sets";
import { TROOPS } from "../ww2";

const KINDS: SetKind[] = ["field", "road", "fjord", "town", "alley", "hill", "fence", "jungle", "ridge", "cliff", "night"];
export const mSetsDuration = KINDS.length * 30;

export const MSets: React.FC = () => {
  const f = useCurrentFrame();
  const kind = KINDS[Math.min(KINDS.length - 1, Math.floor(f / 30))];
  return (
    <AbsoluteFill>
      <Base />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <KitDefs />
        <SetDefs />
        <CodeSet kind={kind} id={`set-${kind}`} t={f} />
        <Hero look={TROOPS.gi} pose={{ ...basePose, ...stand(ROOM, 0.5, 0.6), yaw: 0.3 }} rimId="rimR" />
      </svg>
    </AbsoluteFill>
  );
};
