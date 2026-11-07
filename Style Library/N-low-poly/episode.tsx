/**
 * Everything a NEON ODDS episode shares, so an episode's Video.tsx is only its shots and its sounds:
 * cut list → picture, karaoke subtitles, the VO, the music bed, room tones, last frame = frame 0.
 * Sample of the full look: n-mandel/Video.tsx (older than this file, keeps its own copy of these helpers).
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeGuide } from "../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../src/series/pvr/sfx";
import { CLAMP, FONT, SAFE } from "../kit-common";
import { KaraokeSubs } from "../subs";
import { alive, type Cam, type LightKind, N, NSub, Person, type Pose, rng, Shot3D, type V3 } from "./lowpoly";
import { Ticket } from "./props";
import { extra } from "./sets";

const FPS = 30;
export type Seg = { id: string; from: number; len: number };
export type Timing = { lines: { id: string; start: number; end: number; text: string }[] };
export type Words = Record<string, number[]>;
export type Out = { light: LightKind; cam: Cam; world: React.ReactNode; over?: React.ReactNode; filter?: string; target?: V3; box?: number; post?: { bloom?: number } };
export type ShotFn = (t: number, len: number, g: number) => Out;

export const cm = (pos: V3, look: V3, fov = 40): Cam => ({ pos, look, fov });
export const ramp = (t: number, a: number, b: number, from = 0, to = 1) => interpolate(t, [a, b], [from, to], CLAMP);
export const episodeDuration = (shots: Seg[]) => shots[shots.length - 1].from + shots[shots.length - 1].len + 1; // + the loop frame (= frame 0)

/** the VO as frames: every cue in an episode comes from these, so a new read re-times the whole video */
export const epTools = (timing: Timing, words: Words, shots: Seg[]) => {
  const line = (id: string) => {
    const l = timing.lines.find((x) => x.id === id);
    if (!l) throw new Error(`no VO line ${id}`);
    return l;
  };
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const shot = (id: string) => {
    const s = shots.find((x) => x.id === id);
    if (!s) throw new Error(`no shot ${id}`);
    return s;
  };
  return {
    line,
    shot,
    at: (id: string) => shot(id).from,
    /** global frame where `word` (nth time) is spoken in line `id` */
    wd: (id: string, word: string, nth = 1) => {
      const ws = line(id).text.split(/\s+/);
      let k = -1;
      let c = 0;
      ws.forEach((x, i) => {
        if (k < 0 && norm(x) === norm(word) && ++c === nth) k = i;
      });
      if (k < 0) throw new Error(`no "${word}" in line ${id}`);
      const heard = words[id];
      return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / ws.length))] * FPS);
    },
    lineEnd: (id: string) => Math.round(line(id).end * FPS),
    lineStart: (id: string) => Math.round(line(id).start * FPS),
    /** a global frame inside shot `id` */
    loc: (id: string, g: number) => g - shot(id).from,
    /** seconds between two shots, never under 1 (shorter Sfx fades give a non-monotonic volume range) */
    sec: (a: string, b: string) => Math.max(1, (shot(b).from - shot(a).from) / FPS),
  };
};

const ShotLayer: React.FC<{ fn: ShotFn; seg: Seg; t: number; g: number }> = ({ fn, seg, t, g }) => {
  const o = fn(t, seg.len, g);
  return (
    <Shot3D cam={o.cam} light={o.light} target={o.target} box={o.box} filter={o.filter} over={o.over} post={o.post}>
      {o.world}
    </Shot3D>
  );
};
const Picture: React.FC<{ S: Record<string, ShotFn>; shots: Seg[]; timing: Timing; words: Words }> = ({ S, shots, timing, words }) => {
  const f = useCurrentFrame();
  const i = shots.length - 1 - [...shots].reverse().findIndex((s) => f >= s.from);
  const seg = shots[Math.max(0, i)];
  return (
    <AbsoluteFill style={{ background: "#141018" }}>
      <ShotLayer key={seg.id} fn={S[seg.id]} seg={seg} t={f - seg.from} g={f} />
      {/* subtitles leave during long pauses: the silence is silent on screen too */}
      <KaraokeSubs timing={timing} words={words} Skin={NSub} oneLine maxWords={3} maxChars={18} hold={0.3} />
    </AbsoluteFill>
  );
};

/** room tone per place, `[first shot, last shot, file]`: you only notice it when it cuts out */
export type Room = readonly [string, string, string];
export const Episode: React.FC<{
  S: Record<string, ShotFn>;
  shots: Seg[];
  timing: Timing;
  words: Words;
  slug: string;
  music: string;
  duck?: (g: number) => number;
  rooms?: readonly Room[];
  safeGuide?: boolean;
  children?: React.ReactNode;
}> = ({ S, shots, timing, words, slug, music, duck, rooms = [], safeGuide, children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Freeze frame={0} active={f >= durationInFrames - 1}>
        <Picture S={S} shots={shots} timing={timing} words={words} />
      </Freeze>
      <Audio name="VO" src={staticFile(`voiceover/${slug}/vo.mp3`)} />
      <MusicBed file={music} level={-25} duck={duck} />
      {rooms.map(([a, b, file]) => {
        const from = shots.find((s) => s.id === a);
        const to = shots.find((s) => s.id === b);
        if (!from || !to) throw new Error(`room tone: no shot ${a} / ${b}`);
        return <Sfx key={a} file={file} at={from.from} level={-36} seconds={Math.max(1, (to.from + to.len - from.from) / FPS)} />;
      })}
      {children}
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};

/** falling tickets: each starts at its own frame, gone once it reaches `floor` */
export const Rain: React.FC<{ t: number; len: number; x?: number; z?: number; w: number; d: number; n: number; top: number; speed: number; floor: number; seed: number }> = ({ t, len, x = 0, z = 0, w, d, n, top, speed, floor, seed }) => {
  const R = rng(seed);
  const drops = Array.from({ length: n }, () => [x + (R() - 0.5) * w, z + (R() - 0.5) * d, R() * len * 0.8, R() * 6] as const);
  return (
    <>
      {drops.map(([px, pz, at, s], i) => {
        const y = top - Math.max(0, t - at) * speed;
        return t > at && y > floor ? <Ticket key={i} p={[px, y, pz]} r={[(t + s) * 0.3, (t + s) * 0.2, s]} seed={i} /> : null;
      })}
    </>
  );
};
/** a crowd in rows behind a spot; `cheer` 0→1 raises the arms, a few at a time */
export const Crowd: React.FC<{ g: number; n: number; z0?: number; seed?: number; spread?: number; cheer?: number; pose?: Pose }> = ({ g, n, z0 = -0.5, seed = 50, spread = 1, cheer = 0, pose }) => {
  const R = rng(seed);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const row = Math.floor(i / 9);
        const x = ((i % 9) - 4) * 0.85 * spread + (row % 2) * 0.42 + (R() - 0.5) * 0.25;
        const z = z0 - row * 0.95 + (R() - 0.5) * 0.3;
        const ry = (R() - 0.5) * 20;
        const up = Math.min(1, Math.max(0, cheer * 1.6 - R() * 0.6));
        const arm = { f: up * 165 + Math.sin(g / 6 + i) * 8 * up, o: 8 + up * 10, e: -12 * up };
        return <Person key={i} look={extra(seed + i)} pose={{ x, z, ry, ...alive(g, seed + i), armL: arm, armR: arm, smile: up, mouth: up * 0.6, ...pose }} />;
      })}
    </>
  );
};

/**
 * The words on a 9:16 thumbnail: at most four, huge, in the channel's two neons, inside the safe zone.
 * Put the face and the one big object in the 3D scene underneath (Shot3D `over`).
 */
export const ThumbText: React.FC<{ top: string; bottom?: string; y?: number; size?: number }> = ({ top, bottom, y = 300, size = 150 }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, top: y, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: -2 }}>
    <div style={{ color: N.gold, WebkitTextStroke: `16px ${N.ink}`, paintOrder: "stroke fill", textShadow: "0 0 46px rgba(255,179,71,.7)" }}>{top}</div>
    {bottom ? <div style={{ color: "#62D2DC", WebkitTextStroke: `16px ${N.ink}`, paintOrder: "stroke fill", textShadow: "0 0 46px rgba(98,210,220,.7)" }}>{bottom}</div> : null}
  </div>
);
