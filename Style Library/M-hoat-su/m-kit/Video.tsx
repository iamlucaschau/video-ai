/**
 * Style M KitSheet: every colour and component of the kit on one frame, for `npm run sheet:j -- Style-M-HoatSu-Kit --frames 0`.
 * Add each new component here as it gets built (studio/KIT-CONTRACT.md §5).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { FONT, SAFE } from "../../kit-common";
import type { SubWord } from "../../subs";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { stand } from "../../toon-engine/furnish";
import { basePose, Hero, type Pose } from "../../toon-engine/rig";
import { Base, Cap, CAST, HoatSuSub, IronCross, Ledger, M, Mbe, Moustache, Office, OnChest, ROOM, SignPost } from "../hoat-su";

const word = (text: string, said: boolean, key = false): SubWord => ({ text, said, active: false, key });
const SAMPLE: SubWord[][] = [[word("Berlin", true), word("believed", true), word("him.", false)]];
const at = (u: number, w: number, p: Partial<Pose> = {}): Pose => ({ ...basePose, ...stand(ROOM, u, w), ...p });

export const MKit: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  const spy = at(0.5, 0.5, { expr: "smug" });
  const brit = at(0.2, 0.4, { yaw: 0.4 });
  const ger = at(0.8, 0.4, { yaw: -0.4, expr: "worried" });
  return (
    <AbsoluteFill>
      <Base />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <KitDefs />
        <SetDefs />
        <Office id="kit" t={f} desk={false} />
        <Hero look={CAST.brit} pose={brit} rimId="rimR" />
        <Cap pose={brit} kind="brit" />
        <Hero look={CAST.ger} pose={ger} rimId="rimL" />
        <Cap pose={ger} kind="ger" />
        <Hero look={CAST.spy} pose={spy} rimId="rimR" />
        <Moustache pose={spy} />
        <OnChest pose={spy}>
          <IronCross />
          <Mbe />
        </OnChest>
        <SignPost x={330} y={330} text="LISBON 1941" w={380} f={f} at={-20} />
        <Ledger x={780} y={1120} value="27" label="AGENTS" f={f} at={-20} />
        {M.swatches.map((c, i) => (
          <rect key={c} x={70 + i * 100} y={1220} width={86} height={86} rx={10} fill={c} stroke={M.ink} strokeWidth={4} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top + 20, fontFamily: FONT, fontWeight: 800, fontSize: 56, color: M.paper }}>HOẠT SỬ</div>
      <HoatSuSub lines={SAMPLE} f={f} />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
export const mKitDuration = 30;
