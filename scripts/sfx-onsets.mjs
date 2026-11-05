/**
 * When each SFX actually starts sounding, and its loudest moment (W6, idea from kelano86/what-if-animation sfx.py, MIT).
 * Lets <Sfx align="onset" | "peak"> land the attack (a hit) or the peak (a whoosh) on the cue frame instead of the
 * file's first sample (Pixabay files often open with 50–300 ms of near-silence).
 *
 *   node scripts/sfx-onsets.mjs            measure every catalog file not yet in public/sfx/onsets.json
 *   node scripts/sfx-onsets.mjs --force    re-measure all
 *   node scripts/sfx-onsets.mjs --selftest
 *
 * 10 ms RMS windows; peak = the loudest window; onset = the first window within 20 dB of the peak (and above −60 dBFS).
 * Writes public/sfx/onsets.json: { "<file under public/>": { "onset": s, "peak": s } }. catalog.json is not touched.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SR = 8000;
const WIN = SR / 100;

export const measure = (samples) => {
  const n = Math.floor(samples.length / WIN);
  const db = [];
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = i * WIN; j < (i + 1) * WIN; j++) s += samples[j] * samples[j];
    db.push(10 * Math.log10(s / WIN + 1e-12));
  }
  const peak = db.indexOf(Math.max(...db));
  const floor = Math.max(-60, db[peak] - 20);
  const onset = db.findIndex((d) => d >= floor);
  return { onset: Math.round(onset) / 100, peak: Math.round(peak) / 100 };
};

if (process.argv.includes("--selftest")) {
  const x = new Float32Array(SR); // 0.25 s silence, a ramp to the peak at 0.5 s, then decay
  for (let i = 0; i < SR; i++) {
    const t = i / SR;
    x[i] = t < 0.25 ? 0 : t < 0.5 ? (t - 0.25) * 4 * Math.sin(i) : Math.exp(-(t - 0.5) * 6) * Math.sin(i);
  }
  const m = measure(x);
  if (Math.abs(m.peak - 0.5) > 0.02 || m.onset < 0.25 || m.onset > 0.3) throw new Error(`selftest: ${JSON.stringify(m)}`);
  console.log("selftest ok", m);
  process.exit(0);
}

const out = path.join(ROOT, "public/sfx/onsets.json");
const known = fs.existsSync(out) && !process.argv.includes("--force") ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, "public/sfx/catalog.json"), "utf8"));
let added = 0;
for (const { file } of catalog) {
  if (known[file]) continue;
  const abs = path.join(ROOT, "public", file);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠ missing ${file} (fetch-sfx.mjs)`);
    continue;
  }
  const r = spawnSync(process.env.FFMPEG_PATH ?? "ffmpeg", ["-v", "error", "-i", abs, "-ac", "1", "-ar", String(SR), "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
  if (r.status !== 0) {
    console.warn(`  ⚠ ffmpeg failed on ${file}`);
    continue;
  }
  const b = r.stdout;
  known[file] = measure(new Float32Array(b.buffer, b.byteOffset, Math.floor(b.length / 4)));
  added++;
}
const sorted = Object.fromEntries(Object.entries(known).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(out, JSON.stringify(sorted, null, 1) + "\n");
console.log(`${added} measured, ${Object.keys(sorted).length} in public/sfx/onsets.json`);
