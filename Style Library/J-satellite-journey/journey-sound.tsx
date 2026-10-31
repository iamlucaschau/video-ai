/**
 * Style J sound layers (Bible §6 as changed 2026-10-30, lesson F1–F3): a small real sound on every
 * visual event, and a place-based ambience bed under the whole video. Files: Mixkit, catalogued in
 * public/sfx/catalog.json (05_SFX-CAN-TAI.md). Accent hits stay in each episode's own SFX list.
 */
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import catalog from "../../public/sfx/catalog.json";
import { Sfx } from "../../src/series/pvr/sfx";

export type EventKind = "label" | "card" | "cardOut" | "chip" | "pen" | "ping" | "fly";

/** Variants per kind (rotated so one sound never repeats back to back) and their LUFS level. */
const KIT: Record<EventKind, { files: string[]; level: number }> = {
  // letters decoding: typewriter keys and short glitches
  label: {
    files: ["tick/typewriter-soft-hit-1366.mp3", "tick/digital-typewriter-1363.mp3", "tick/cinematic-glitch-trailer-1021.mp3", "tick/typewriter-soft-click-1125.mp3"],
    level: -27,
  },
  card: { files: ["pop/quick-swoosh-accent-1464.mp3", "pop/big-paper-page-turn-1105.mp3", "pop/quick-swoosh-1462.mp3", "pop/fast-small-sweep-transition-166.mp3"], level: -26 },
  cardOut: { files: ["swish/fast-sweep-transition-174.mp3", "pop/page-turn-single-1104.mp3"], level: -30 },
  chip: { files: ["swish/fast-air-sweep-transition-168.mp3", "pop/short-wind-swoosh-1461.mp3"], level: -27 },
  pen: { files: ["pen/writing-scribble-on-paper-2369.mp3", "pen/writing-pencil-3194.mp3"], level: -28 },
  ping: { files: ["ping/page-turn-chime-1106.mp3", "ping/interface-hint-notification-911.mp3"], level: -29 },
  fly: { files: ["whoosh/clean-whoosh-382726.mp3", "swish/air-woosh-1489.mp3", "whoosh/simple-whoosh-382724.mp3", "whoosh/whoosh-effect-382717.mp3"], level: -25 },
};

/**
 * One sound per visual event, in the kit's voice. Events closer than 4 frames to one already
 * placed are dropped (two labels landing together get one tick).
 */
export const EventSounds: React.FC<{ events: [EventKind, number][]; trim?: number }> = ({ events, trim = 0 }) => {
  const used: Record<string, number> = {};
  const placed: number[] = [];
  return (
    <>
      {[...events]
        .sort((a, b) => a[1] - b[1])
        .filter(([, at]) => {
          if (!Number.isFinite(at) || placed.some((p) => Math.abs(p - at) < 4)) return false;
          placed.push(at);
          return true;
        })
        .map(([kind, at], i) => {
          const k = KIT[kind];
          const n = (used[kind] = (used[kind] ?? -1) + 1);
          return <Sfx key={i} file={`sfx/${k.files[n % k.files.length]}`} at={Math.max(0, at)} level={k.level + trim} />;
        })}
    </>
  );
};

export type Bed = { file: string; from: number; to: number; level?: number };

/**
 * Ambience beds by place (sea, wind, marching army…), looped, each with a 1 s fade at both ends so
 * neighbouring beds crossfade when they overlap by ~1 s. Default level −32 LUFS (under music).
 */
export const Ambience: React.FC<{ beds: Bed[]; trim?: number }> = ({ beds, trim = 0 }) => {
  const { fps } = useVideoConfig();
  const fade = fps;
  return (
    <>
      {beds.map((b, i) => {
        const entry = catalog.find((c) => c.file === `sfx/${b.file}`);
        if (!entry) throw new Error(`Ambience not in public/sfx/catalog.json: ${b.file}`);
        const len = Math.round(b.to - b.from);
        const gain = Math.min(4, 10 ** (((b.level ?? -32) + trim - (entry.lufs ?? -32)) / 20));
        const f2 = Math.min(fade, Math.floor(len / 2) - 1);
        return (
          <Sequence key={i} from={Math.round(b.from)} durationInFrames={len} name={`Ambience ${entry.title}`} layout="none">
            <Audio
              src={staticFile(`sfx/${b.file}`)}
              loop
              volume={(f) => gain * interpolate(f, [0, f2, len - f2, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            />
          </Sequence>
        );
      })}
    </>
  );
};
