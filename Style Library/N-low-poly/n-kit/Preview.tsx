/** Kit preview: every set once with people (composition `Style-N-LowPoly-Sets`, 10 frames each). */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person, Shot3D, type Cam, type LightKind } from "../lowpoly";
import { DrawMachine, Pin, scatter } from "../props";
import { CAST, Chamber, extra, Interview, Kiosk, MapTable, mapXZ, Office, Street, Studio, VA, Void, Warehouse, CoinTower, TicketTower } from "../sets";
import { Van } from "../props";

const SETS: { light: LightKind; cam: Cam; world: (f: number) => React.ReactNode }[] = [
  { light: "warm", cam: { pos: [0, 1.6, 4.2], look: [0, 1.4, -1.5], fov: 45 }, world: (f) => <Kiosk f={f} jackpot={27_000_000}><Person look={CAST.mandel} pose={{ z: 0.4, ry: 160 }} /></Kiosk> },
  { light: "studio", cam: { pos: [0, 2.2, 6], look: [0.4, 1.6, 0], fov: 42 }, world: (f) => <Studio f={f}><DrawMachine f={f} drawn={[3, 11, 19, 27, 36, 44]} k={4} /></Studio> },
  { light: "warm", cam: { pos: [0.4, 1.5, 3.2], look: [0, 1.25, 0], fov: 42 }, world: (f) => <Office f={f} board={{ lines: ["COUNT", "WAIT", "BUY"], k: 3, tick: 2 }} frames={14}><Person look={CAST.mandel} pose={{ z: -0.75, legL: { f: 88, k: 88 }, legR: { f: 88, k: 88 }, y: -0.44, armL: { f: 50, e: -50 }, armR: { f: 50, e: -50 }, mouth: 0.5 }} /></Office> },
  { light: "warm", cam: { pos: [2.5, 3.2, 6], look: [0, 0.8, -3], fov: 48 }, world: (f) => <Warehouse f={f} t={f} /> },
  { light: "day", cam: { pos: [0, 9, 4], look: [0, 0, 0], fov: 50 }, world: () => <MapTable m="va">{scatter(VA, 125, 4).map(([lon, lat], i) => { const [x, z] = mapXZ("va", lon, lat); return <Pin key={i} p={[x, 0.3, z]} k={1} s={0.5} />; })}</MapTable> },
  { light: "night", cam: { pos: [3, 1.6, 7], look: [0, 1.4, -4], fov: 45 }, world: (f) => <Street f={f}><Van p={[-1, 0, -1.6]} ry={90} doors={1} /><Person look={CAST.courier} pose={{ x: 1.5, z: -2.5, ry: 180 }} /></Street> },
  { light: "cool", cam: { pos: [2.2, 2.9, 2.8], look: [0, 0.9, 0], fov: 50 }, world: (f) => <Interview f={f}><Person look={CAST.mandel} pose={{ z: -0.8, legL: { f: 88, k: 88 }, legR: { f: 88, k: 88 }, y: -0.44 }} /><Person look={CAST.agent} pose={{ z: 1.1, x: -0.4, ry: 180 }} /><Person look={CAST.agent2} pose={{ z: 1.0, x: 0.6, ry: 190 }} /></Interview> },
  { light: "warm", cam: { pos: [0, 1.7, 4.5], look: [0, 1.3, 0], fov: 45 }, world: (f) => <Chamber f={f}><Person look={CAST.lawmaker} pose={{ z: -0.7, armR: { f: 70, e: -30 } }} /></Chamber> },
  { light: "studio", cam: { pos: [0, 2.4, 9], look: [0, 1.2, 0], fov: 45 }, world: () => <Void><TicketTower p={[-1, 0, 0]} h={1} /><CoinTower p={[1, 0, 0]} h={3} />{Array.from({ length: 20 }, (_, i) => <Person key={i} look={extra(i)} pose={{ x: -3 + (i % 5) * 1.4, z: -2 - Math.floor(i / 5) * 1.2 }} />)}</Void> },
];
export const NSetsPreview: React.FC = () => {
  const f = useCurrentFrame();
  const s = SETS[Math.min(SETS.length - 1, Math.floor(f / 10))];
  return (
    <AbsoluteFill>
      <Shot3D cam={s.cam} light={s.light}>{s.world(f)}</Shot3D>
    </AbsoluteFill>
  );
};
export const N_SETS_FRAMES = SETS.length * 10;
