/**
 * Shot list on the voice's words (W4) + the storyboard before animating (W3), adapted from the cue idea of
 * kelano86/what-if-animation scripts/plan.py (MIT). Cuts land on a spoken word, `lead` frames before it.
 *
 *   node scripts/shotlist.mjs <folder>                       read <folder>/shots.json → shots.timeline.json + shotlist.md, print the pace
 *   node scripts/shotlist.mjs <folder> --board <compId>      …then one safe-guide still per shot (its key frame) via sheet-j
 *   node scripts/shotlist.mjs --selftest
 *
 * shots.json:
 *   { "vo": "<voiceover slug>", "fps": 30, "lead": 2, "ref": "Test/<reference folder>",
 *     "shots": [ { "id": "S1", "at": "01", "size": "rộng", "note": "what we see", "key": 0.5 }, … ] }
 * `at`: "07" (line 07 starts) · "07:3" (its 4th script word, 0-based) · "07:soap" / "07:soap#2" (that word, 1st / 2nd time
 * in the line) · "+18" (frames after the previous cut) · "s:4.2" · "f:126". Word times come from
 * src/voiceover/<vo>.words.json (words.py), line times from <vo>.timing.json. `key` (0–1) = where in the shot the board still is.
 * The composition imports shots.timeline.json ([{ id, from, len, key, size, note }]) so a re-timed voice re-times the cuts.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv.splice(i, 2)[1] : null;
};

const norm = (s) => s.toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]+/gu, "");

/** Frame of a cue. `prev` = frame of the previous cut. */
export const resolve = (at, { timing, words, fps, lead, prev }) => {
  const s = String(at);
  if (s.startsWith("f:")) return Math.round(Number(s.slice(2)));
  if (s.startsWith("s:")) return Math.round(Number(s.slice(2)) * fps);
  if (s.startsWith("+")) return prev + Math.round(Number(s.slice(1)));
  const [id, w] = s.split(":");
  const line = timing.lines.find((l) => l.id === id);
  if (!line) throw new Error(`cue "${s}": no VO line ${id}`);
  if (w === undefined) return Math.max(0, Math.round(line.start * fps) - lead);
  const script = line.text.split(/\s+/);
  let k;
  if (/^\d+$/.test(w)) k = Number(w);
  else {
    const [word, nth = "1"] = w.split("#");
    const hits = script.map((x, i) => (norm(x) === norm(word) ? i : -1)).filter((i) => i >= 0);
    k = hits[Number(nth) - 1];
    if (k === undefined) throw new Error(`cue "${s}": "${word}" (#${nth}) not in line ${id}: ${line.text}`);
  }
  const heard = words?.[id];
  // same mapping as the L kit's w(): Whisper may hear a different word count than the script has
  const t = heard?.length ? heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / script.length))] : line.start;
  return Math.max(0, Math.round(t * fps) - lead);
};

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null;
};

/** Pace of a cut list: cuts per minute (all, first 15 s), median / longest shot, shots over `long` s. */
export const pace = (segs, fps, long = 3) => {
  const total = segs.at(-1).from + segs.at(-1).len;
  const lens = segs.map((x) => x.len / fps);
  const early = segs.filter((x) => x.from < 15 * fps).length;
  return {
    seconds: total / fps,
    shots: segs.length,
    cutsPerMin: ((segs.length - 1) / (total / fps)) * 60,
    cutsPerMinFirst15: ((early - 1) / Math.min(15, total / fps)) * 60,
    medianShot: median(lens),
    longest: Math.max(...lens),
    over: segs.filter((x) => x.len / fps > long).map((x) => x.id),
  };
};

if (argv.includes("--selftest")) {
  const timing = { durationInSeconds: 4, lines: [{ id: "01", start: 0.3, end: 2, text: "Copy a cookie. Paste the cookie." }] };
  const words = { "01": [0.3, 0.6, 0.8, 1.2, 1.5, 1.7] };
  const c = { timing, words, fps: 30, lead: 2, prev: 0 };
  const eq = (a, b, m) => {
    if (a !== b) throw new Error(`${m}: ${a} ≠ ${b}`);
  };
  eq(resolve("01", c), 7, "line start − lead");
  eq(resolve("01:2", c), 22, "word index");
  eq(resolve("01:cookie#2", c), 49, "2nd occurrence");
  eq(resolve("01:Paste", c), 34, "word, punctuation and case ignored");
  eq(resolve("+18", { ...c, prev: 40 }), 58, "relative");
  eq(resolve("s:1", c), 30, "seconds");
  const p = pace([{ id: "A", from: 0, len: 30 }, { id: "B", from: 30, len: 120 }], 30);
  eq(p.shots, 2, "pace shots");
  eq(p.over.join(), "B", "long shot flagged");
  console.log("selftest ok");
  process.exit(0);
}

const boardId = opt("board");
const dir = argv.find((a) => !a.startsWith("--"));
if (!dir) {
  console.error("Usage: node scripts/shotlist.mjs <folder with shots.json> [--board <compositionId>] | --selftest");
  process.exit(1);
}
const folder = path.resolve(ROOT, dir);
const plan = JSON.parse(fs.readFileSync(path.join(folder, "shots.json"), "utf8"));
const fps = plan.fps ?? 30;
const lead = plan.lead ?? 2;
const vo = path.join(ROOT, "src/voiceover", plan.vo);
const timing = JSON.parse(fs.readFileSync(`${vo}.timing.json`, "utf8"));
const words = fs.existsSync(`${vo}.words.json`) ? JSON.parse(fs.readFileSync(`${vo}.words.json`, "utf8")) : null;
if (!words) console.warn(`  ⚠ no ${plan.vo}.words.json (run words.py): word cues fall back to line starts`);

const total = Math.round((plan.end ?? timing.durationInSeconds) * fps);
const starts = [];
for (const s of plan.shots) starts.push(resolve(s.at, { timing, words, fps, lead, prev: starts.at(-1) ?? 0 }));
starts[0] = 0; // the first shot opens the video
const segs = plan.shots.map((s, i) => {
  const from = starts[i];
  const len = (starts[i + 1] ?? total) - from;
  if (len <= 0) throw new Error(`${s.id} (${s.at}) does not start after the shot before it`);
  return { id: s.id, from, len, key: from + Math.min(len - 1, Math.round(len * (s.key ?? 0.5))), size: s.size ?? "", note: s.note ?? "" };
});
fs.writeFileSync(path.join(folder, "shots.timeline.json"), JSON.stringify(segs, null, 1) + "\n");

const p = pace(segs, fps);
let ref = null;
if (plan.ref) {
  const ing = path.join(ROOT, plan.ref, "_work/ingest.json");
  if (fs.existsSync(ing)) {
    // reference videos in the same orientation as ours (9:16 by default)
    const vids = JSON.parse(fs.readFileSync(ing, "utf8")).videos.filter((v) => v.shots?.length && (plan.landscape ? v.tech.width > v.tech.height : v.tech.height > v.tech.width));
    ref = { videos: vids.length, medianShot: median(vids.map((v) => median(v.shots.map((s) => s.len)))), cutsPerMin: median(vids.map((v) => ((v.shots.length - 1) / v.tech.duration) * 60)) };
  } else console.warn(`  ⚠ ${plan.ref}: no _work/ingest.json (run studio:ingest)`);
}
const n = (x, d = 1) => (x == null ? "—" : x.toFixed(d).replace(".", ","));
const md = [
  `# Shot list — ${path.basename(folder)}`,
  "",
  `*Tự sinh bởi \`node scripts/shotlist.mjs\` từ \`shots.json\` + giọng \`${plan.vo}\`; sửa \`shots.json\`, đừng sửa file này. Cú cắt rơi ${lead} frame trước từ.*`,
  "",
  "| Shot | Vào (s) | Dài (s) | Cỡ | Cue | Ghi chú |",
  "|---|---|---|---|---|---|",
  ...segs.map((s, i) => `| ${s.id} | ${n(s.from / fps, 2)} | ${n(s.len / fps, 2)}${s.len / fps > 3 ? " ⚠" : ""} | ${s.size} | \`${plan.shots[i].at}\` | ${s.note.replace(/\|/g, "/")} |`),
  "",
  "## Nhịp",
  "",
  "| | Bản này | Tham khảo |",
  "|---|---|---|",
  `| Shot | ${p.shots} | ${ref ? `${ref.videos} video ${plan.landscape ? "16:9" : "9:16"} (\`${plan.ref}\`)` : "—"} |`,
  `| Cắt / phút | ${n(p.cutsPerMin)} (15 s đầu: ${n(p.cutsPerMinFirst15)}) | ${n(ref?.cutsPerMin)} |`,
  `| Shot trung vị (s) | ${n(p.medianShot, 2)} | ${n(ref?.medianShot, 2)} |`,
  `| Shot dài nhất (s) | ${n(p.longest, 2)} | |`,
  "",
  p.over.length ? `⚠ Shot dài hơn 3 s: ${p.over.join(", ")}: phải có hành động bên trong (nhân vật, vật, chữ), không được đứng.` : "Không shot nào dài hơn 3 s.",
  "",
];
fs.writeFileSync(path.join(folder, "shotlist.md"), md.join("\n"));
console.log(`${p.shots} shots · ${n(p.cutsPerMin)} cuts/min (first 15 s ${n(p.cutsPerMinFirst15)}) · median ${n(p.medianShot, 2)} s${ref ? ` (ref ${n(ref.medianShot, 2)} s)` : ""} · longest ${n(p.longest, 2)} s`);
if (p.over.length) console.log(`  ⚠ over 3 s: ${p.over.join(", ")}`);
console.log(`→ ${path.relative(ROOT, path.join(folder, "shots.timeline.json"))}, shotlist.md`);

if (boardId) {
  const name = `${path.basename(folder)}-board`;
  const r = spawnSync(process.execPath, [path.join(ROOT, "scripts/sheet-j.mjs"), boardId, "--frames", segs.map((s) => s.key).join(","), "--name", name], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log(`storyboard: out/sheets/${name}-N.png (tiles in shot order: ${segs.map((s) => `${s.id}=f${s.key}`).join(" ")})`);
}
