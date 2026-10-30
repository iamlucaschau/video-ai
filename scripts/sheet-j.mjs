#!/usr/bin/env node
/**
 * Contact sheets for the review loop (.claude/skills/review-loop), style J / Mapped Journeys.
 * Adapted from whaleyxbt/claude-motion scripts/sheet.mjs (MIT, © 2026 whaleyxbt).
 *
 *   npm run sheet:j -- <compositionId> --slug <slug>        one still per VO line (+0.6 s), safeGuide on
 *   npm run sheet:j -- <compositionId> --frames 1000,2400   exact frames
 *   npm run sheet:j -- <compositionId> --from 60 --to 64 --every 0.2   scrub seconds 60–64
 *   npm run sheet:j -- --video "<file>.mp4" --slug <slug>   frames from a render (final check, no guide)
 *
 * Options: --offset 0.6 (s after each line starts) · --no-guide · --no-bundle (reuse out/bundle)
 *          --cols 4 --rows 2 --size 360 --name <sheet name>
 * Stills: one `remotion still` per frame (Remotion 4.0.532 can crash on a comma list of frames).
 * Writes out/sheets/<name>-N.png, each tile labelled with its frame and time.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(ROOT, "node_modules/@remotion/cli/remotion-cli.js");
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const FPS = 30;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  if (i >= 0) argv.splice(i, 1);
  return i >= 0;
};
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [, v] = argv.splice(i, 2);
  return v;
};

const video = opt("video", null);
const slug = opt("slug", null);
const offset = Number(opt("offset", "0.6"));
const framesArg = opt("frames", null);
const every = opt("every", null);
const from = Number(opt("from", "0"));
const to = opt("to", null);
const cols = Number(opt("cols", "4"));
const rows = Number(opt("rows", "2"));
const size = Number(opt("size", "360"));
let name = opt("name", null);
const guide = !flag("no-guide") && !video;
const bundle = !flag("no-bundle");
const id = argv.find((a) => !a.startsWith("--")); // every option and its value is spliced out above

if (!video && !id) {
  console.error("Usage: npm run sheet:j -- <compositionId> --slug <slug> | --frames a,b | --every s  (or --video <mp4> --slug <slug>)");
  process.exit(1);
}

// ---- which frames
let frames;
if (framesArg) {
  frames = framesArg.split(",").map(Number);
  name ??= "picked";
} else if (every) {
  if (to === null) {
    console.error("--every needs --to <seconds>");
    process.exit(1);
  }
  frames = [];
  for (let t = from; t <= Number(to) + 1e-6; t += Number(every)) frames.push(Math.round(t * FPS));
  name ??= `every${every}`;
} else {
  if (!slug) {
    console.error("Pass --slug <slug> (reads src/voiceover/<slug>.timing.json) or --frames / --every.");
    process.exit(1);
  }
  const timing = JSON.parse(fs.readFileSync(path.join(ROOT, "src/voiceover", `${slug}.timing.json`), "utf8"));
  frames = [6, ...timing.lines.map((l) => Math.round((l.start + offset) * FPS))];
  name ??= `${slug}-lines`;
}
frames = [...new Set(frames)].sort((a, b) => a - b);

const dir = path.join(ROOT, "out/sheets", name);
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
const ffmpeg = (args) => execFileSync(FFMPEG, ["-loglevel", "error", "-y", ...args], { stdio: "pipe" });

// ---- grab the frames
if (!video && bundle) {
  console.log("▶ bundle → out/bundle");
  const res = spawnSync(process.execPath, [CLI, "bundle", "--out-dir", "out/bundle"], { cwd: ROOT, stdio: "ignore" });
  if (res.status !== 0) process.exit(1);
}
const raw = (i) => path.join(dir, `raw-${String(i).padStart(3, "0")}.png`);
frames.forEach((f, i) => {
  if (video) {
    ffmpeg(["-ss", String(f / FPS), "-i", path.resolve(ROOT, video), "-frames:v", "1", raw(i)]);
  } else {
    const props = guide ? ["--props", JSON.stringify({ safeGuide: true })] : [];
    const res = spawnSync(process.execPath, [CLI, "still", "out/bundle", id, raw(i), `--frame=${f}`, ...props], { cwd: ROOT, stdio: "pipe" });
    if (res.status !== 0) {
      console.error(`✗ frame ${f}:\n${res.stderr.toString().slice(-800)}`);
      process.exit(1);
    }
  }
  process.stdout.write(`\r  ${i + 1}/${frames.length} frames`);
});
console.log();

// ---- label + tile (drawtext may be missing on some Windows builds: then no labels)
let labels = true;
frames.forEach((f, i) => {
  const out = path.join(dir, `${String(i).padStart(3, "0")}.png`);
  // one pixel format for every tile: an rgba still among rgb24 ones re-inits `tile` and drops frames
  const scale = `scale=${size}:-2,format=rgb24`;
  const text = `f${f}  ${(f / FPS).toFixed(1)}s`;
  const label = `drawtext=text='${text}':x=8:y=8:fontsize=${Math.round(size / 15)}:fontcolor=white:box=1:boxcolor=black@0.7:boxborderw=5`;
  if (labels) {
    try {
      ffmpeg(["-i", raw(i), "-vf", `${scale},${label}`, out]);
      return;
    } catch {
      labels = false;
      console.warn("drawtext unavailable in this ffmpeg build: tiles have no labels (order = frame order).");
    }
  }
  ffmpeg(["-i", raw(i), "-vf", scale, out]);
});

const perSheet = cols * rows;
const sheets = [];
for (let s = 0; s * perSheet < frames.length; s++) {
  const out = path.join(ROOT, "out/sheets", `${name}-${s + 1}.png`);
  ffmpeg(["-framerate", "1", "-start_number", String(s * perSheet), "-i", path.join(dir, "%03d.png"), "-vf", `tile=${cols}x${rows}:padding=6:color=0x333333`, "-frames:v", "1", out]);
  sheets.push(path.relative(ROOT, out));
}

console.log(`${frames.length} frames${video ? ` from ${video}` : ` of ${id}${guide ? " (safeGuide)" : ""}`} → ${sheets.length} sheet(s):`);
sheets.forEach((s) => console.log(`  ${s}`));
console.log(`frames: ${frames.join(",")}`);
