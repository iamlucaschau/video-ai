/** 9:16 thumbnail of the Mandel episode: his face, the ball in his hand, the mountain behind him, the number. */
import React from "react";
import { cm, ThumbText } from "../episode";
import { handAt, Person, Shot3D, type V3 } from "../lowpoly";
import { Ball, Pile } from "../props";
import { CAST, Void } from "../sets";

const ARM = { f: 78, e: -92, o: 12 };
const AT: V3 = [0.17, 0, 0];

export const NMandelThumb: React.FC = () => {
  const hand = handAt(-1, AT, ARM);
  return (
    <Shot3D light="stage" post={{ bloom: 0.2 }} cam={cm([0.08, 1.55, 3.66], [0.08, 1.49, 0], 34)} over={<ThumbText top="14 JACKPOTS" bottom="HOW?" size={132} y={235} />}>
      <Void>
        <Pile n={5000} r={3.4} h={2.6} p={[0, 0, -2.9]} seed={6} />
        <Person look={CAST.mandel} pose={{ x: AT[0], z: AT[2], blink: 0, yaw: -8, pitch: 2, roll: -4, smile: 0.3, smirk: 1, browL: 1.1, armL: { o: 8 }, armR: ARM }} />
        <Ball n={14} p={[hand[0], hand[1] + 0.1, hand[2]]} r={0.12} shadow={false} />
        <pointLight position={[0.9, 2, 1.8]} intensity={2.4} distance={4} color="#FFD9B8" />
      </Void>
    </Shot3D>
  );
};
