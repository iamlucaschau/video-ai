#!/usr/bin/env node
/**
 * Render for any style (`npm run render:style`, same script; written for style J / Mapped Journeys):
 * Remotion render at crf 18, 4K (scale 2) → ffmpeg master to
 * -14 LUFS / -1.5 dBTP (AAC 192k, 48 kHz, +faststart) → ffprobe + ebur128 check.
 *
 *   npm run render:j -- <compositionId> [--to <file.mp4>] [--frames=0-89] [--keep-raw]
 *
 *   npm run render:j -- Style-J-SatelliteJourney-AeneasFull --to "Style Library/J-satellite-journey/j-aeneas-full/j-aeneas-full.mp4"
 *
 * Default output: out/j/<compositionId>.mp4. The raw render (out/j/<id>-raw.mp4) is
 * deleted unless --keep-raw. Any other --flag=value is passed to `remotion render`.
 * Uses the ffmpeg/ffprobe on PATH, or FFMPEG_PATH / FFPROBE_PATH.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLI = path.join(ROOT, "node_modules/@remotion/cli/remotion-cli.js");
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH ?? "ffprobe";
/**
 * loudnorm aims 1.5 dB under the −1.5 dBTP ceiling: loudnorm and the AAC encode after it can land up to ~1 dB above the target
 * true peak (Ep02 2026-10-27: TP=-1.5 → −1.2; Ep01 2026-10-30: TP=-2 → −1.4; Ep02 with event SFX 2026-10-30: TP=-2.5 → −1.4, TP=-3 → −2.7).
 */
const MASTER = "loudnorm=I=-14:TP=-3:LRA=11,aresample=48000";
const MAX_TP = -1.5;

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
if (!id) {
  console.error("Usage: npm run render:j -- <compositionId> [--to <file.mp4>] [--frames=0-89] [--keep-raw]");
  process.exit(1);
}
const toIdx = args.indexOf("--to");
const to = path.resolve(ROOT, toIdx >= 0 ? args[toIdx + 1] : `out/j/${id}.mp4`);
const keepRaw = args.includes("--keep-raw");
const passthrough = args.filter((a, i) => a.startsWith("--") && a !== "--to" && a !== "--keep-raw" && i !== toIdx + 1);
const raw = path.join(ROOT, "out/j", `${id}-raw.mp4`);

const run = (cmd, cmdArgs, opts = {}) => {
  const res = spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: "inherit", ...opts });
  if (res.error || res.status !== 0) {
    console.error(`\n✗ ${path.basename(cmd)} failed${res.error ? `: ${res.error.message}` : ` (exit ${res.status})`}`);
    process.exit(1);
  }
  return res;
};

fs.mkdirSync(path.dirname(raw), { recursive: true });
fs.mkdirSync(path.dirname(to), { recursive: true });

// 4K by default (Lucas 2026-10-31): the 1080×1920 compositions render at scale 2 → 2160×3840; --scale=1 for a quick 1080p
const scale = passthrough.some((a) => a.startsWith("--scale")) ? [] : ["--scale=2"];
console.log(`\n▶ render ${id} (crf 18${scale.length ? ", 4K" : ""})`);
run(process.execPath, [CLI, "render", id, raw, "--crf=18", ...scale, ...passthrough]);

console.log(`\n▶ master → ${path.relative(ROOT, to)}`);
run(FFMPEG, ["-y", "-v", "error", "-i", raw, "-c:v", "copy", "-af", MASTER, "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", to]);
if (!keepRaw) fs.rmSync(raw);

// Check: size, fps, frames, duration, audio stream, loudness, true peak.
const probe = JSON.parse(
  run(FFPROBE, ["-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_frames:format=duration,bit_rate", "-of", "json", to], {
    stdio: ["ignore", "pipe", "inherit"],
  }).stdout.toString(),
);
const video = probe.streams.find((s) => s.codec_type === "video");
const audio = probe.streams.find((s) => s.codec_type === "audio");
const loud = spawnSync(FFMPEG, ["-hide_banner", "-nostats", "-i", to, "-af", "ebur128=peak=true", "-f", "null", "-"], { cwd: ROOT }).stderr.toString();
const summary = loud.slice(loud.lastIndexOf("Summary:"));
const lufs = summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1];
const peak = summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1];

console.log(`\n✓ ${path.relative(ROOT, to)}`);
console.log(`  video ${video.width}×${video.height} @ ${video.r_frame_rate} · ${video.nb_frames} frames · ${(+probe.format.duration).toFixed(1)} s · ${(probe.format.bit_rate / 1e6).toFixed(1)} Mbps`);
console.log(`  audio ${audio ? "yes" : "MISSING"} · ${lufs ?? "?"} LUFS (target -14) · true peak ${peak ?? "?"} dBFS (max ${MAX_TP})`);
if (!audio || (lufs && Math.abs(+lufs + 14) > 1) || (peak && +peak > MAX_TP)) {
  console.error("  ⚠ audio check failed: listen before publishing");
  process.exitCode = 2;
}
