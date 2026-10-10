#!/usr/bin/env node
/**
 * QA contact sheet: renders several frames of one composition from a single
 * bundle, then tiles them with ffmpeg.
 *   node scripts/stills.mjs <composition-id> <out.jpg> <frame,frame,...> [--safe]
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [id, out, list] = process.argv.slice(2);
const inputProps = process.argv.includes("--safe") ? { safeGuide: true } : {};
const frames = list.split(",").map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, inputProps });
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stills-"));
for (const [i, frame] of frames.entries()) {
  await renderStill({ serveUrl, composition, frame, inputProps, output: path.join(dir, `${String(i).padStart(3, "0")}.png`), scale: 0.4 });
}
const cols = Math.min(frames.length, 6);
const r = spawnSync("ffmpeg", ["-v", "error", "-y", "-framerate", "1", "-i", path.join(dir, "%03d.png"),
  "-vf", `tile=${cols}x${Math.ceil(frames.length / cols)}:padding=6:color=white`, "-frames:v", "1", "-q:v", "3", out], { stdio: "inherit" });
fs.rmSync(dir, { recursive: true });
process.exitCode = r.status;
console.log(`✓ ${out} (${frames.length} frames)`);
