/** Quick look at the 3D kit: frame 0 = barracks interior, frame 1 = Guam jungle (Style-M-3D-Test). */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Hero } from "../../toon-engine/rig";
import { M1Helmet, MedicKit, TROOPS } from "../ww2";
import { makeCam, place } from "./kit3d";
import { Bunk, Board, Bush, Ground, Hills, Lamp, Locker, Palm, RifleRack, Room, Stone, Win } from "./sets3d";
import { Stage3D } from "./stage";

export const Test3D: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) {
    const k = makeCam({ pos: [0, 1.55, 6.5], look: [0, 1.25, 0], fov: 42 });
    const doss = place(k, 0, 0.5, { yaw: 0.15 });
    const a = place(k, -1.6, -0.6, { yaw: 0.35 });
    return (
      <AbsoluteFill>
        <Stage3D
          cam={k}
          light="indoor"
          sky={false}
          target={[0, 0, 0]}
          world={
            <Room wall="#5E7A62" trim="#3E3430">
              <Win p={[-1.8, 1.9, -6.95]} />
              <Board p={[1.6, 1.75, -6.95]} />
              <Lamp p={[0, 3.3, -1.5]} />
              <Bunk p={[-3.4, 0, -3.5]} ry={Math.PI / 2} />
              <Locker p={[3.9, 0, -2.5]} ry={-Math.PI / 2} />
              <Locker p={[3.9, 0, -3.15]} ry={-Math.PI / 2} />
              <RifleRack p={[0.2, 0, -6.6]} n={4} />
            </Room>
          }
        >
          <Hero look={TROOPS.gi} pose={a} rimId="rimR" />
          <M1Helmet pose={a} />
          <Hero look={TROOPS.gi} pose={doss} rimId="rimR" />
          <MedicKit pose={doss} />
          <M1Helmet pose={doss} medic />
        </Stage3D>
      </AbsoluteFill>
    );
  }
  const k = makeCam({ pos: [0, 1.7, 9], look: [0, 1.4, 0], fov: 40 });
  const doss = place(k, 0.5, 1, { yaw: 0.6 });
  return (
    <AbsoluteFill>
      <Stage3D
        cam={k}
        light="day"
        target={[0, 0, 0]}
        world={
          <group>
            <Ground color="#B89A62" dots="60,40,20" />
            <Hills z={-90} color="#5E8A4A" />
            <Palm p={[-4, 0, -6]} h={8} seed={2} />
            <Palm p={[5, 0, -10]} h={9} lean={-0.3} seed={3} />
            <Palm p={[-9, 0, -18]} h={8.5} seed={4} />
            <Bush p={[3, 0, -3]} seed={5} />
            <Bush p={[-3, 0, -1]} s={0.8} seed={6} />
            <Stone p={[2.4, 0, 2]} s={0.7} seed={3} />
          </group>
        }
      >
        <Hero look={TROOPS.gi} pose={doss} rimId="rimR" />
        <MedicKit pose={doss} />
        <M1Helmet pose={doss} medic />
      </Stage3D>
    </AbsoluteFill>
  );
};
