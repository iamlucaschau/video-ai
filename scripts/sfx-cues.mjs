#!/usr/bin/env node
/**
 * Exports every <Sfx> of a composition as a cue file for `earshot timeline --cues`.
 *
 *   node scripts/sfx-cues.mjs <composition-id> <out.json> [--every <seconds>]
 *   node scripts/sfx-cues.mjs --selftest
 *
 * Cue times are computed in each Video.tsx (`wd("17", "six") + 6`), so they can only be read by running the
 * composition: with the input prop `sfxCues` every mounted <Sfx> logs its absolute frame, and this script renders tiny
 * stills across the video and collects the lines. Picture code still runs, so 3D takes a while.
 * f = where the sound should be heard: the attack (align onset), the loudest moment (align peak), or, for align start,
 * the file's measured onset (public/sfx/onsets.json). Room tones and ambience are left out: they are beds, not events.
 *
 * Top-level <Sfx> are mounted on every frame, so three stills (first, middle, last) that see the same set are enough.
 * If the set changes, or is empty, some <Sfx> sit inside scenes and it renders a still every --every seconds
 * (default 1; slow on 3D: 34 min for the 105 s Ivey episode).
 * shortcut: nested <Sfx> are lost when no probe frame lands in their scene while top-level ones exist, or when their
 * scene is shorter than --every; pass --every (smaller if needed) to force the scan for such a video.
 */
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const BED = /(^|\/)(room-|amb-|ambience\/)/;

/** logged <Sfx> lines (repeated once per frame seen) -> earshot's cue format */
export const toCues = (logs, onsets, fps) => {
  const seen = new Map();
  for (const l of logs) seen.set(`${l.file}@${Math.round(l.frame)}`, l);
  const beds = [...seen.values()].filter((l) => BED.test(l.file)).length;
  const events = [...seen.values()]
    .filter((l) => !BED.test(l.file))
    .map((l) => {
      const late = l.align === "start" ? (onsets[l.file]?.onset ?? 0) * fps : 0;
      const kind = l.align === "peak" ? "whoosh" : l.align === "start" && l.seconds ? "swell" : "hit";
      return { f: Math.round(l.frame + late), kind, id: path.basename(l.file).replace(/\.\w+$/, "") };
    })
    .sort((a, b) => a.f - b.f)
    .map((e, i) => ({ ...e, id: `${e.id}:${i}` }));
  return { fps, events, beds };
};

if (process.argv.includes("--selftest")) {
  const onsets = { "sfx/hit/a.mp3": { onset: 0.1, peak: 0.2 } };
  const r = toCues(
    [
      { file: "sfx/hit/a.mp3", frame: 100, align: "start" },
      { file: "sfx/hit/a.mp3", frame: 100, align: "start" }, // same Sfx seen on another frame
      { file: "sfx/hit/a.mp3", frame: 50.4, align: "onset", seconds: 1 }, // a trimmed hit is still a hit
      { file: "sfx/whoosh/b.mp3", frame: 200, align: "peak" },
      { file: "sfx/synth/shuffle.wav", frame: 300, align: "start", seconds: 2 },
      { file: "sfx/synth/room-office.wav", frame: 0, align: "start", seconds: 9 },
      { file: "sfx/amb-sea/waves.mp3", frame: 0, align: "start", seconds: 9 },
    ],
    onsets,
    30,
  );
  assert.deepEqual(r.events, [
    { f: 50, kind: "hit", id: "a:0" },
    { f: 103, kind: "hit", id: "a:1" },
    { f: 200, kind: "whoosh", id: "b:2" },
    { f: 300, kind: "swell", id: "shuffle:3" },
  ]);
  assert.equal(r.beds, 2);
  console.log("selftest ok");
  process.exit(0);
}

const [id, out] = process.argv.slice(2);
if (!id || !out) {
  console.error("usage: node scripts/sfx-cues.mjs <composition-id> <out.json> [--every <seconds>]");
  process.exit(1);
}
const everyAt = process.argv.indexOf("--every");
const every = everyAt > 0 ? Number(process.argv[everyAt + 1]) : 1;
const inputProps = { sfxCues: true };
const logs = [];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome", { logLevel: "error" });
try {
  const composition = await selectComposition({ serveUrl, id, inputProps, puppeteerInstance: browser });
  const step = Math.max(1, Math.round(every * composition.fps));
  // single stills, not renderFrames + everyNthFrame: skipping frames crashes on <Audio> (EINVAL inline-audio-mixing, see AGENTS.md)
  const still = (frame) =>
    renderStill({
      serveUrl,
      composition,
      frame,
      inputProps,
      puppeteerInstance: browser,
      output: null,
      imageFormat: "jpeg",
      scale: 0.1, // the picture is thrown away; keeps WebGL frames cheap
      timeoutInMilliseconds: 180000, // a jump into a 3D scene rebuilds it from scratch; the default 30 s can time out
      logLevel: "error",
      onBrowserLog: ({ text }) => {
        const m = /SFXCUE (\{.*\})/.exec(text);
        if (m) logs.push(JSON.parse(m[1]));
      },
    }).catch((e) => {
      console.error(`frame ${frame}: ${e.message}`); // closing the browser next can hide this behind "Target closed"
      throw e;
    });
  const count = () => new Set(logs.map((l) => `${l.file}@${l.frame}`)).size;
  await still(0);
  const first = count();
  await still(composition.durationInFrames >> 1);
  await still(composition.durationInFrames - 1);
  console.log(`probes: ${first} <Sfx> on frame 0, ${count()} after the middle and last frames`);
  if (everyAt > 0 || first === 0 || count() !== first) {
    const queue = Array.from({ length: Math.ceil(composition.durationInFrames / step) }, (_, i) => i * step).slice(1);
    const worker = async () => {
      for (let frame = queue.shift(); frame !== undefined; frame = queue.shift()) await still(frame);
    };
    await Promise.all(Array.from({ length: 6 }, worker));
  }
  const onsets = JSON.parse(fs.readFileSync("public/sfx/onsets.json", "utf8"));
  const { fps, events, beds } = toCues(logs, onsets, composition.fps);
  fs.writeFileSync(out, JSON.stringify({ fps, events }, null, 1));
  console.log(`✓ ${out}: ${events.length} cues (${beds} beds left out)`);
} finally {
  await browser.close({ silent: true });
  fs.rmSync(serveUrl, { recursive: true, force: true }); // ~700 MB, Remotion never removes it
}
