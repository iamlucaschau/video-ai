#!/usr/bin/env node
/**
 * Studio P1 — ingest (studio/README.md §3): turns a channel URL, a video URL or a folder of
 * downloaded videos into the measured numbers of QUY-TRINH-PHAN-TICH.md §1.1–1.3.
 *
 *   npm run studio:ingest -- "https://www.youtube.com/@HistoryMapsLore"   rank the channel, download top + newest
 *   npm run studio:ingest -- "https://www.youtube.com/shorts/<id>"         one video, then measure its folder
 *   npm run studio:ingest -- "Test/History Maps Lore"                      videos already downloaded
 *
 *   npm run studio:ingest -- "<our render>.mp4" --out out/compare/<name>   one file (studio:compare does this)
 *
 * Options: --top 3 --latest 2 --tab shorts|videos (channel URL) · --out <dir> (URL: default Test/<channel>; folder / file: where INGEST.md + _work go)
 *          --lang en (default: auto) · --no-whisper · --no-ocr · --no-stems · --no-sheets · --force (redo cached steps) · --selftest
 * Writes <dir>/INGEST.md (numbers only) and <dir>/_work/ (git-ignored: metadata, measures, transcripts, sheets).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH ?? "ffprobe";
const TODAY = new Date().toISOString().slice(0, 10);

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

// ---------- pure helpers (checked by --selftest)

const median = (xs) => {
  const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Place of a video in its channel list (newest first, as yt-dlp lists it). */
const position = (id, views, list) => {
  const i = list.findIndex((v) => v.id === id);
  const med = median(list.map((v) => v.views));
  const ranked = [...list].sort((a, b) => (b.views ?? -1) - (a.views ?? -1));
  return {
    rank: i >= 0 ? ranked.findIndex((v) => v.id === id) + 1 : null,
    of: list.length,
    median: med,
    xMedian: med && views != null ? views / med : null,
    ordinal: i >= 0 ? list.length - i : null,
  };
};

const shotsFrom = (cuts, duration) => {
  const bounds = [0, ...cuts.filter((t) => t > 0.05 && t < duration - 0.05), duration];
  return bounds.slice(1).map((b, i) => ({ n: i + 1, a: bounds[i], b, len: b - bounds[i] }));
};

/** Frame times whose scene score passes `lo` (and stays ≤ `hi`), one per burst: a crossfade scores high on several frames in a row. */
const peaks = (scores, lo, hi = 1) => {
  const out = [];
  for (const [t, s] of scores) if (s > lo && s <= hi && !(out.length && t - out.at(-1) < 0.3)) out.push(t);
  return out;
};

/** Camera / layer motion inside a shot: median scene score (subtitle swaps are short spikes the median ignores). */
const motion = (scores, a, b) => {
  const inside = scores.filter(([t]) => t > a + 0.1 && t < b - 0.1).map(([, s]) => s);
  const med = median(inside);
  if (med == null) return null;
  return { score: med, kind: med < 0.0006 ? "đứng yên" : med < 0.004 ? "chậm" : "nhanh" };
};

/** Dominant colours of rgb24 pixels: k-means, seeded at the median-luminance pixel then farthest-point (deterministic). */
const kmeans = (buf, k, iters = 12) => {
  const n = buf.length / 3;
  const px = (i) => [buf[3 * i], buf[3 * i + 1], buf[3 * i + 2]];
  const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  const lum = (i) => 0.299 * buf[3 * i] + 0.587 * buf[3 * i + 1] + 0.114 * buf[3 * i + 2];
  const order = [...Array(n).keys()].sort((a, b) => lum(a) - lum(b));
  const centers = [px(order[n >> 1])];
  while (centers.length < k) {
    let best = 0;
    let far = -1;
    for (let i = 0; i < n; i++) {
      const d = Math.min(...centers.map((c) => d2(px(i), c)));
      if (d > far) [far, best] = [d, i];
    }
    if (far <= 0) break;
    centers.push(px(best));
  }
  const label = new Uint8Array(n);
  for (let it = 0; it < iters; it++) {
    const sum = centers.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < n; i++) {
      const p = px(i);
      let c = 0;
      for (let j = 1; j < centers.length; j++) if (d2(p, centers[j]) < d2(p, centers[c])) c = j;
      label[i] = c;
      sum[c][0] += p[0];
      sum[c][1] += p[1];
      sum[c][2] += p[2];
      sum[c][3]++;
    }
    sum.forEach((s, j) => s[3] && (centers[j] = [s[0] / s[3], s[1] / s[3], s[2] / s[3]]));
  }
  const count = centers.map((_, j) => label.filter((l) => l === j).length);
  const hex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  return centers.map((c, j) => ({ hex: hex(c), share: count[j] / n })).filter((c) => c.share >= 0.01).sort((a, b) => b.share - a.share);
};

const parseMeasure = (log) => {
  const scores = [...log.matchAll(/pts_time:([\d.]+)\s*\r?\n[^\n]*lavfi\.scene_score=([\d.]+)/g)].map((m) => [Number(m[1]), Number(Number(m[2]).toFixed(5))]);
  const cuts = peaks(scores, 0.3);
  const soft = peaks(scores, 0.12, 0.3).filter((t) => !cuts.some((c) => Math.abs(c - t) < 0.5));
  const starts = [...log.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const lens = [...log.matchAll(/freeze_duration: ([\d.]+)/g)].map((m) => Number(m[1]));
  const sum = log.slice(log.lastIndexOf("Summary:"));
  const num = (re) => (sum.match(re) ? Number(sum.match(re)[1]) : null);
  return {
    cuts,
    soft,
    scores,
    freezes: starts.map((s, i) => ({ start: s, len: lens[i] ?? null })),
    lufs: num(/I:\s+(-?[\d.]+) LUFS/),
    lra: num(/LRA:\s+(-?[\d.]+) LU\b/),
    truePeak: num(/Peak:\s+(-?[\d.]+) dBFS/),
  };
};

const speech = (segs, duration) => {
  const words = segs.flatMap((s) => s.words);
  if (!words.length) return null;
  const first = words[0][0];
  const last = words.at(-1)[1];
  return {
    words: words.length,
    firstWordMs: Math.round(first * 1000),
    wpm: Math.round(words.length / ((last - first) / 60)),
    speechRatio: segs.reduce((t, s) => t + (s.end - s.start), 0) / duration,
  };
};

/**
 * On-screen text from scripts/ocr.py (boxes on a 1080-wide canvas): density, size, safe zone (x 60–940, y 220–1440).
 * A box at the same spot (±30 px) in ≥ 40 % of the frames is a watermark / handle: reported apart, left out of the rest.
 */
const onScreen = (ocr) => {
  const all = ocr.frames;
  if (!all.length) return null;
  const spot = (b) => `${Math.round(b.x / 30)},${Math.round(b.y / 30)}`;
  const seen = {};
  all.forEach((f) => new Set(f.items.map(spot)).forEach((k) => (seen[k] = (seen[k] ?? 0) + 1)));
  const fixed = new Set(Object.keys(seen).filter((k) => seen[k] >= 0.4 * all.length));
  const marks = all.flatMap((f) => f.items.filter((b) => fixed.has(spot(b))));
  const frames = all.map((f) => ({ ...f, items: f.items.filter((b) => !fixed.has(spot(b))) }));
  const withText = frames.filter((f) => f.items.length);
  const boxes = frames.flatMap((f) => f.items);
  const words = (f) => f.items.reduce((n, b) => n + b.text.split(/\s+/).filter(Boolean).length, 0);
  const hs = boxes.map((b) => b.h).sort((a, b) => a - b);
  const outside = boxes.filter((b) => b.x < 60 || b.y < 220 || b.x + b.w > 940 || b.y + b.h > 1440);
  return {
    textFrames: withText.length / frames.length,
    wordsPerFrame: median(withText.map(words)),
    maxBlocks: Math.max(0, ...frames.map((f) => f.items.length)),
    textHeight: median(hs),
    smallText: hs.length ? hs[Math.floor(hs.length * 0.1)] : null,
    outsideSafe: boxes.length ? outside.length / boxes.length : null,
    watermarkY: marks.length ? median(marks.map((b) => b.y)) : null,
  };
};

if (flag("selftest")) {
  const ok = (c, m) => {
    if (!c) throw new Error(`selftest: ${m}`);
  };
  ok(median([3, 1, 2]) === 2 && median([4, 1, 3, 2]) === 2.5 && median([null, 5]) === 5, "median");
  const list = [{ id: "c", views: 10 }, { id: "b", views: 300 }, { id: "a", views: 20 }];
  const p = position("b", 290, list);
  ok(p.rank === 1 && p.of === 3 && p.median === 20 && p.xMedian === 14.5 && p.ordinal === 2, "position");
  const s = shotsFrom([0.02, 2, 5.5, 9.99], 10);
  ok(s.length === 3 && s[0].len === 2 && s[2].a === 5.5 && s[2].b === 10, "shotsFrom");
  const m = parseMeasure(
    "[Parsed_metadata_3 @ 0] frame:38 pts:38 pts_time:1.266667\n[Parsed_metadata_3 @ 0] lavfi.scene_score=0.001\n" +
      "[Parsed_metadata_3 @ 0] frame:39 pts:39 pts_time:1.3\n[Parsed_metadata_3 @ 0] lavfi.scene_score=0.62\n" +
      "[Parsed_metadata_3 @ 0] frame:40 pts:40 pts_time:1.333333\n[Parsed_metadata_3 @ 0] lavfi.scene_score=0.41\n" +
      "[Parsed_metadata_3 @ 0] frame:90 pts:90 pts_time:3\n[Parsed_metadata_3 @ 0] lavfi.scene_score=0.2\n" +
      "[freezedetect @ 0] lavfi.freezedetect.freeze_start: 4.2\n" +
      "lavfi.freezedetect.freeze_duration: 0.8\n[Parsed_ebur128_0 @ 0] Summary:\n  Integrated loudness:\n    I:         -14.6 LUFS\n" +
      "  Loudness range:\n    LRA:         5.1 LU\n  True peak:\n    Peak:       -0.4 dBFS",
  );
  ok(m.cuts.length === 1 && m.cuts[0] === 1.3 && m.soft.length === 1 && m.soft[0] === 3 && m.scores.length === 4 && m.freezes[0].len === 0.8 && m.lufs === -14.6 && m.lra === 5.1 && m.truePeak === -0.4, "parseMeasure");
  const sp = speech([{ start: 0.5, end: 30.5, words: [[0.5, 1, "a"], [1, 30.5, "b"]] }], 60);
  ok(sp.firstWordMs === 500 && sp.wpm === 4 && sp.speechRatio === 0.5, "speech");
  const mo = motion([[0.5, 0.0002], [1, 0.0003], [1.5, 0.5], [2, 0.0001]], 0, 3);
  ok(mo.kind === "đứng yên" && motion([[1, 0.002], [2, 0.003]], 0, 3).kind === "chậm", "motion");
  const px = Buffer.from([250, 250, 250, 250, 250, 250, 250, 250, 250, 10, 20, 30]);
  const pal = kmeans(px, 2);
  ok(pal[0].hex === "#FAFAFA" && pal[0].share === 0.75 && pal[1].hex === "#0A141E", "kmeans");
  const box = (text, x, y, h) => ({ text, x, y, w: 200, h, score: 0.9 });
  const os = onScreen({ frames: [{ t: 0.5, items: [] }, { t: 1.5, items: [box("IN 1565", 100, 300, 60), box("tiny island now", 100, 1500, 40)] }, { t: 2.5, items: [box("MALTA", 100, 400, 80)] }, { t: 3.5, items: [] }, { t: 4.5, items: [] }] });
  ok(os.textFrames === 2 / 5 && os.wordsPerFrame === 3 && os.maxBlocks === 2 && os.textHeight === 60 && os.smallText === 40 && os.outsideSafe === 1 / 3 && os.watermarkY === null, `onScreen ${JSON.stringify(os)}`);
  const wm = (f) => ({ ...f, items: [...f.items, box("@HANDLE", 400, 1490, 40)] });
  const os2 = onScreen({ frames: [{ t: 0.5, items: [] }, { t: 1.5, items: [box("MALTA", 100, 400, 80)] }, { t: 2.5, items: [] }].map(wm) });
  ok(os2.watermarkY === 1490 && os2.outsideSafe === 0 && os2.maxBlocks === 1 && os2.textFrames === 1 / 3, `watermark ${JSON.stringify(os2)}`);
  console.log("selftest ok");
  process.exit(0);
}

// ---------- options

const top = Number(opt("top", "3"));
const latest = Number(opt("latest", "2"));
const tab = opt("tab", null);
const outOpt = opt("out", null);
const lang = opt("lang", null);
const whisper = !flag("no-whisper");
const sheets = !flag("no-sheets");
const ocrOn = !flag("no-ocr");
const stemsOn = !flag("no-stems");
const force = flag("force");
const input = argv.find((a) => !a.startsWith("--"));
if (!input) {
  console.error('Usage: npm run studio:ingest -- <channel URL | video URL | folder> [--top 3 --latest 2 --out <dir> --lang en --force]');
  process.exit(1);
}

// ---------- tools

const run = (cmd, args) =>
  spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 30, env: { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" } });
const ytdlp = (args) => run("python", ["-m", "yt_dlp", ...args]);
const say = (s) => console.log(s);
const warn = (s) => console.warn(`  ⚠ ${s}`);

/** Cache a step's JSON in _work; null results are not cached (the step runs again next time), nor are files `valid` rejects (older format). */
const cached = (file, make, valid = () => true) => {
  if (!force && fs.existsSync(file)) {
    const v = JSON.parse(fs.readFileSync(file, "utf8"));
    if (valid(v)) return v;
  }
  const v = make();
  if (v != null) fs.writeFileSync(file, JSON.stringify(v, null, 1));
  return v;
};

const VIDEO_URL = /(?:youtu\.be\/|[?&]v=|\/shorts\/)([A-Za-z0-9_-]{11})/;
const FILE_ID = /_([A-Za-z0-9_-]{11})\.mp4$/i;
const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
const safeName = (s) => s.replace(/[<>:"/\\|?*]+/g, " ").replace(/\s+/g, " ").trim();

const fetchMeta = (id) => {
  const r = ytdlp(["--skip-download", "-j", watchUrl(id)]);
  if (r.status !== 0) {
    warn(`yt-dlp could not read ${id}: ${r.stderr.trim().split("\n").at(-1)}`);
    return null;
  }
  const j = JSON.parse(r.stdout);
  const keep = ["id", "title", "channel", "channel_url", "upload_date", "duration", "view_count", "like_count", "comment_count", "channel_follower_count", "webpage_url"];
  return { fetched: TODAY, ...Object.fromEntries(keep.map((k) => [k, j[k] ?? null])) };
};

const channelBase = (url) => url.replace(/\/(shorts|videos|featured|streams)\/?$/, "").replace(/\/$/, "");

const listChannel = (url) => {
  const list = (t) => {
    const r = ytdlp(["--flat-playlist", "--print", "%(id)s\t%(view_count)s\t%(duration)s\t%(title)s", `${channelBase(url)}/${t}`]);
    if (r.status !== 0) return [];
    return r.stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        const [id, views, duration, ...title] = l.split("\t");
        return { id, views: views === "NA" ? null : Number(views), duration: duration === "NA" ? null : Number(duration), title: title.join("\t") };
      });
  };
  return { url: channelBase(url), fetched: TODAY, shorts: list("shorts"), videos: list("videos") };
};

const download = (id, dir) => {
  if (fs.readdirSync(dir).some((f) => f.endsWith(`_${id}.mp4`))) return;
  say(`  ↓ ${id}`);
  const r = ytdlp(["-S", "res:1920,ext:mp4:m4a", "--merge-output-format", "mp4", "--no-playlist", "-o", path.join(dir, "[YouTube]_%(channel)s_%(id)s.%(ext)s"), watchUrl(id)]);
  if (r.status !== 0) warn(`download failed for ${id}: ${r.stderr.trim().split("\n").at(-1)}`);
};

const probe = (file) => {
  const r = run(FFPROBE, ["-v", "error", "-show_entries", "stream=codec_type,width,height,r_frame_rate:format=duration,bit_rate", "-of", "json", file]);
  const j = JSON.parse(r.stdout);
  const v = j.streams.find((s) => s.codec_type === "video") ?? {};
  const [n, d] = (v.r_frame_rate ?? "0/1").split("/").map(Number);
  return {
    duration: Number(j.format.duration),
    width: v.width ?? null,
    height: v.height ?? null,
    fps: d ? Math.round((n / d) * 100) / 100 : null,
    kbps: j.format.bit_rate ? Math.round(j.format.bit_rate / 1000) : null,
    audio: j.streams.some((s) => s.codec_type === "audio"),
  };
};

/** One decode pass: scene score of every frame (→ hard cuts > 0.3, soft 0.12–0.3, motion), frozen stretches (≥ 0.5 s), EBU R128 loudness. */
const measure = (file) => {
  const vf = "scale=270:-2,freezedetect=n=-60dB:d=0.5,select='gte(scene,0)',metadata=print:key=lavfi.scene_score";
  const r = run(FFMPEG, ["-hide_banner", "-nostats", "-i", file, "-vf", vf, "-af", "ebur128=peak=true", "-f", "null", "-"]);
  if (r.status !== 0) {
    warn(`ffmpeg failed on ${path.basename(file)}`);
    return null;
  }
  return parseMeasure(r.stderr);
};

/** Palette of the whole video from one small frame per second. */
const palette = (file) => {
  const r = spawnSync(FFMPEG, ["-loglevel", "error", "-i", file, "-vf", "fps=1,scale=54:96", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 28 });
  if (r.status !== 0 || !r.stdout.length) {
    warn(`palette failed on ${path.basename(file)}`);
    return null;
  }
  return kmeans(r.stdout, 6);
};

/** Run one of the Python analysis scripts (transcribe / ocr / stems): `<script> <video> <out.json> …`. */
const pyStep = (script, file, out, extra = []) => {
  const r = run("python", ["-P", `scripts/${script}`, file, out, ...extra]);
  if (r.status !== 0) {
    warn(`${script} failed: ${r.stderr.trim().split("\n").at(-1)}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(out, "utf8"));
};
const transcribe = (file, out) => pyStep("transcribe.py", file, out, lang ? [lang] : []);

/** Contact sheets via sheet-j (--video mode), moved into _work/sheets/. */
const contact = (file, key, duration, work) => {
  const dest = path.join(work, "sheets");
  fs.mkdirSync(dest, { recursive: true });
  const end = Math.floor((duration - 0.1) * 10) / 10;
  const jobs = [
    [`${key}-open`, ["--from", "0", "--to", "1", "--every", "0.2"]],
    [`${key}-end`, ["--from", String(Math.max(0, end - 3)), "--to", String(end), "--every", "0.5"]],
    [`${key}-1s`, ["--from", "0", "--to", String(end), "--every", "1", "--cols", "6", "--rows", "4"]],
  ];
  const made = [];
  for (const [name, args] of jobs) {
    if (!force && fs.readdirSync(dest).some((f) => f.startsWith(`${name}-`))) {
      made.push(...fs.readdirSync(dest).filter((f) => f.startsWith(`${name}-`)));
      continue;
    }
    const r = run(process.execPath, ["scripts/sheet-j.mjs", "--video", file, "--name", name, ...args]);
    if (r.status !== 0) {
      warn(`sheet ${name} failed`);
      continue;
    }
    const sheetsOut = path.join(ROOT, "out/sheets");
    for (const f of fs.readdirSync(sheetsOut).filter((f) => new RegExp(`^${name}-\\d+\\.png$`).test(f))) {
      fs.renameSync(path.join(sheetsOut, f), path.join(dest, f));
      made.push(f);
    }
    fs.rmSync(path.join(sheetsOut, name), { recursive: true, force: true });
  }
  return made.sort();
};

// ---------- resolve input → folder

let dir; // where the videos are
let only = null; // a single .mp4 given as input (e.g. our own render, for studio:compare)
let channelUrl = null;
const isUrl = /^https?:\/\//.test(input);
if (!isUrl) {
  dir = path.resolve(ROOT, input);
  if (/\.mp4$/i.test(dir)) [dir, only] = [path.dirname(dir), path.basename(dir)];
  if (!fs.existsSync(path.join(dir, only ?? ""))) {
    console.error(`No such folder or file: ${input}`);
    process.exit(1);
  }
} else {
  const vid = input.match(VIDEO_URL)?.[1];
  let ids;
  let channel = null;
  if (vid) {
    ids = [vid];
  } else {
    say(`▶ listing ${channelBase(input)}`);
    channel = listChannel(input);
    const pool = channel[tab ?? (channel.shorts.length ? "shorts" : "videos")];
    if (!pool.length) {
      console.error("No videos found on that channel (check the URL, or pass --tab videos).");
      process.exit(1);
    }
    const best = [...pool].sort((a, b) => (b.views ?? -1) - (a.views ?? -1)).slice(0, top);
    ids = [...new Set([...best, ...pool.slice(0, latest)].map((v) => v.id))];
  }
  const first = fetchMeta(ids[0]);
  if (!first) process.exit(1);
  channelUrl = first.channel_url;
  dir = outOpt ? path.resolve(ROOT, outOpt) : path.join(ROOT, "Test", safeName(first.channel));
  fs.mkdirSync(path.join(dir, "_work"), { recursive: true });
  if (channel) fs.writeFileSync(path.join(dir, "_work", "channel.json"), JSON.stringify(channel, null, 1));
  fs.writeFileSync(path.join(dir, "_work", `${first.id}.meta.json`), JSON.stringify(first, null, 1));
  say(`▶ downloading ${ids.length} video(s) → ${path.relative(ROOT, dir)}`);
  ids.forEach((id) => download(id, dir));
}
// where INGEST.md and _work/ go: --out for a folder / file input, else next to the videos
const outDir = !isUrl && outOpt ? path.resolve(ROOT, outOpt) : dir;
const work = path.join(outDir, "_work");
fs.mkdirSync(work, { recursive: true });

// ---------- measure every video in the folder

const files = fs.readdirSync(dir).filter((f) => /\.mp4$/i.test(f) && (!only || f === only));
if (!files.length) {
  console.error(`No .mp4 in ${path.relative(ROOT, dir)}`);
  process.exit(1);
}
say(`▶ ${files.length} video(s) in ${path.relative(ROOT, dir)}`);

const videos = files.map((f) => {
  const id = f.match(FILE_ID)?.[1] ?? null;
  const key = id ?? safeName(f.replace(/\.mp4$/i, "")).replace(/ /g, "_");
  const file = path.join(dir, f);
  const w = (ext) => path.join(work, `${key}.${ext}`);
  say(`• ${key}`);
  const meta = id ? cached(w("meta.json"), () => fetchMeta(id)) : null;
  const tech = cached(w("probe.json"), () => probe(file));
  const m = cached(w("measure.json"), () => measure(file), (v) => v.scores);
  const pal = cached(w("palette.json"), () => palette(file));
  const tx = whisper ? cached(w("transcript.json"), () => transcribe(file, w("transcript.json"))) : null;
  const ocr = ocrOn ? cached(w("ocr.json"), () => pyStep("ocr.py", file, w("ocr.json"))) : null;
  const stems = stemsOn ? cached(w("stems.json"), () => pyStep("stems.py", file, w("stems.json"))) : null;
  const sh = sheets ? contact(file, key, tech.duration, work) : [];
  const shots = m ? shotsFrom(m.cuts, tech.duration).map((s) => ({ ...s, motion: motion(m.scores, s.a, s.b) })) : [];
  return { key, id, file: f, meta, tech, m, pal, shots, sp: tx ? speech(tx, tech.duration) : null, text: ocr ? onScreen(ocr) : null, stems, sheets: sh };
});

channelUrl ??= videos.find((v) => v.meta?.channel_url)?.meta.channel_url ?? null;
const channel = channelUrl ? cached(path.join(work, "channel.json"), () => listChannel(channelUrl)) : null;

videos.sort((a, b) => (a.meta?.upload_date ?? "9").localeCompare(b.meta?.upload_date ?? "9"));
videos.forEach((v, i) => {
  v.label = `V${i + 1}`;
  if (v.meta && channel) {
    const isShort = channel.shorts.some((s) => s.id === v.id);
    v.tab = isShort ? "shorts" : "videos";
    v.pos = position(v.id, v.meta.view_count, channel[v.tab]);
  }
});
fs.writeFileSync(path.join(work, "ingest.json"), JSON.stringify({ fetched: TODAY, channel: channelUrl, videos }, null, 1));

// ---------- INGEST.md

const n = (x, d = 0) => (x == null || !Number.isFinite(x) ? "—" : x.toLocaleString("vi-VN", { minimumFractionDigits: d, maximumFractionDigits: d }));
const pct = (x, d = 2) => (x == null ? "—" : `${n(x * 100, d)} %`);
const date = (s) => (s ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : "—");
const age = (s) => (s ? Math.max(1, Math.round((Date.parse(TODAY) - Date.parse(date(s))) / 864e5)) : null);
const verdict = (x) => (x == null ? "—" : x >= 3 ? "**hit**" : x >= 0.5 ? "bình thường" : "yếu");
const rel = (p) => path.relative(outDir, p).replace(/\\/g, "/");

const L = [];
L.push(`# INGEST — ${only ?? path.basename(dir)}`, "");
L.push(`*Tự sinh bởi \`npm run studio:ingest\` ngày ${TODAY}; chạy lại sẽ ghi đè, đừng sửa tay (phân tích viết vào \`BAO-CAO.md\`). Mọi giá trị là **ĐO** (yt-dlp, ffprobe, ffmpeg ebur128 / scene / freezedetect, faster-whisper). Quy trình: \`Style Library/QUY-TRINH-PHAN-TICH.md\`.*`, "");

const meta0 = videos.find((v) => v.meta)?.meta;
L.push("## 1.1 Kênh", "");
if (channel) {
  const shortsMed = median(channel.shorts.map((v) => v.views));
  L.push(`- Kênh: **${meta0?.channel ?? "?"}** · ${channel.url} · ${n(meta0?.channel_follower_count)} subscriber`);
  L.push(`- ${channel.shorts.length} Shorts (trung vị ${n(shortsMed)} views) · ${channel.videos.length} video dài (trung vị ${n(median(channel.videos.map((v) => v.views)))} views) · số view danh sách kênh đã làm tròn`);
  L.push("", "Top 5 Shorts theo views:", "", "| # | Views | Tiêu đề |", "|---|---|---|");
  [...channel.shorts].sort((a, b) => (b.views ?? -1) - (a.views ?? -1)).slice(0, 5)
    .forEach((v, i) => L.push(`| ${i + 1} | ${n(v.views)} | ${v.title.replace(/\|/g, "/")} |`));
} else L.push("- Không có ID YouTube trong tên file → không lấy được số liệu kênh.");

L.push("", "## 1.1 Số liệu video + vị trí trong kênh", "");
L.push("| V | ID | Tiêu đề | Đăng | Tuổi (ngày) | Views | Likes | Cmt | Like/view | Cmt/view | Views/ngày | Hạng | × trung vị | Kết luận | Thứ tự đăng |");
L.push("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const v of videos) {
  const mt = v.meta ?? {};
  const a = age(mt.upload_date);
  const p = v.pos ?? {};
  L.push(`| ${v.label} | ${v.id ?? v.key} | ${(mt.title ?? v.file).replace(/\|/g, "/")} | ${date(mt.upload_date)} | ${n(a)} | ${n(mt.view_count)} | ${n(mt.like_count)} | ${n(mt.comment_count)} | ` +
    `${pct(mt.view_count ? mt.like_count / mt.view_count : null)} | ${pct(mt.view_count ? mt.comment_count / mt.view_count : null, 3)} | ${n(a ? mt.view_count / a : null)} | ` +
    `${p.rank ? `#${p.rank} / ${p.of} ${v.tab}` : "—"} | ${p.xMedian ? `×${n(p.xMedian, p.xMedian < 1 ? 2 : 1)}` : "—"} | ${verdict(p.xMedian)} | ${p.ordinal ? `thứ ${p.ordinal}` : "—"} |`);
}
L.push("", `Số liệu lấy ngày ${[...new Set(videos.map((v) => v.meta?.fetched).filter(Boolean))].join(", ") || "—"}. Kết luận: × trung vị ≥ 3 = hit, 0,5–3 = bình thường, < 0,5 = yếu.`);

L.push("", "## 1.2 Đo kỹ thuật", "");
L.push("| V | Dài (s) | Khung | fps | kbps | LUFS | True peak (dBTP) | LRA | Shot | Shot TB (s) | Dài nhất / ngắn nhất (s) | Shot trong 3 s đầu | Đứng yên ≥ 0,5 s | Lời bắt đầu (ms) | Từ | wpm | Có lời |");
L.push("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const v of videos) {
  const t = v.tech;
  const m = v.m ?? {};
  const lens = v.shots.map((s) => s.len);
  const frozen = (m.freezes ?? []).reduce((s, f) => s + (f.len ?? 0), 0);
  L.push(`| ${v.label} | ${n(t.duration, 1)} | ${t.width}×${t.height} | ${n(t.fps, 2)} | ${n(t.kbps)} | ${n(m.lufs, 1)} | ${n(m.truePeak, 1)} | ${n(m.lra, 1)} | ${v.shots.length} | ` +
    `${n(lens.length ? t.duration / lens.length : null, 1)} | ${n(lens.length ? Math.max(...lens) : null, 1)} / ${n(lens.length ? Math.min(...lens) : null, 1)} | ${v.shots.filter((s) => s.a < 3).length} | ` +
    `${(m.freezes ?? []).length} lần, ${n(frozen, 1)} s | ${n(v.sp?.firstWordMs)} | ${n(v.sp?.words)} | ${n(v.sp?.wpm)} | ${pct(v.sp?.speechRatio, 0)} |`);
}
L.push("", "Shot = đoạn giữa hai điểm cắt (scene > 0,3). Crossfade dài máy dò không bắt: đọc lại trên sheet 1 s, ghi ƯỚC ±0,5 s ở `BOC-TACH-HINH.md`. Shot dài thường là một cảnh máy quay chạy liền (bản đồ bay), không phải lỗi đo. \"Lời bắt đầu\" từ Whisper sai ±0,2 s; từ đầu tiên hay bị kéo về 0.");

L.push("", "## Màu chủ đạo (k-means 6 màu trên 1 khung / giây, gồm cả phụ đề và watermark)", "");
L.push("| V | Màu (tỉ lệ diện tích) |", "|---|---|");
for (const v of videos) L.push(`| ${v.label} | ${(v.pal ?? []).map((c) => `\`${c.hex}\` ${pct(c.share, 0)}`).join(" · ") || "—"} |`);

if (videos.some((v) => v.text)) {
  L.push("", "## Chữ trên màn hình (OCR rapidocr, 1 khung / giây, gồm phụ đề và watermark)", "");
  L.push("| V | Khung có chữ | Từ / khung (trung vị) | Khối chữ cùng lúc (tối đa) | Cao chữ trung vị (px trên khung 1080) | Chữ nhỏ (10 % nhỏ nhất, px) | Khối chữ ngoài vùng an toàn | Watermark / handle cố định (y) |", "|---|---|---|---|---|---|---|---|");
  for (const v of videos) {
    const t = v.text ?? {};
    L.push(`| ${v.label} | ${pct(t.textFrames, 0)} | ${n(t.wordsPerFrame)} | ${n(t.maxBlocks)} | ${n(t.textHeight)} | ${n(t.smallText)} | ${pct(t.outsideSafe, 0)} | ${t.watermarkY == null ? "không" : `có, y ≈ ${n(t.watermarkY)}`} |`);
  }
  L.push("", "Luật của mình: chữ ≥ 48 px, ≤ 2 khối ngoài phụ đề, mọi chữ trong vùng an toàn. OCR bỏ sót chữ cách điệu / nghiêng và tách một dòng thành nhiều khối: đọc là **ĐO có sai số**, kiểm lại trên sheet. Chữ đứng một chỗ ở ≥ 40 % số khung (watermark, handle) được tách riêng, không tính vào các cột khác. Chữ của từng khung: `_work/<id>.ocr.json`.");
}
if (videos.some((v) => v.stems)) {
  L.push("", "## Giọng và nền (demucs tách 2 lớp)", "");
  L.push("| V | Giọng (LUFS) | Nền: nhạc + SFX (LUFS) | Nền − giọng (dB) | Tiếng nhấn ở nền / phút |", "|---|---|---|---|---|");
  for (const v of videos) {
    const s = v.stems ?? {};
    L.push(`| ${v.label} | ${n(s.voiceLufs, 1)} | ${n(s.bedLufs, 1)} | ${n(s.bedMinusVoice, 1)} | ${n(s.hitsPerMin, 1)} |`);
  }
  L.push("", "Tiếng nhấn = mức nền vọt ≥ 8 dB so với giây trước (`scripts/stems.py`): gồm SFX **và** nhịp nhạc mạnh, nên là **ƯỚC** độ \"bận\" của nền, không phải số SFX chính xác. Thời điểm từng tiếng: `_work/<id>.stems.json`.");
}

L.push("", "## 1.3 Khung bảng shot (điền phần còn trống vào `BOC-TACH-HINH.md`)", "");
L.push("Cột **Máy quay** đã điền mức chuyển động **ĐO** (trung vị điểm scene trong shot, ‰): đứng yên < 0,6 · chậm < 4 · nhanh. Phụ đề, chữ hiện ra, vật di chuyển cũng tính là chuyển động; kiểu (lia, đẩy, bay) ghi bằng mắt (ƯỚC).", "");
for (const v of videos) {
  L.push(`### ${v.label} · ${v.id ?? v.key}`, "");
  if (v.sheets.length) L.push(`Sheets: ${v.sheets.map((f) => `\`${rel(path.join(work, "sheets", f))}\``).join(" · ")}`, "");
  if (v.m?.soft?.length) L.push(`Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): ${v.m.soft.map((t) => n(t, 1)).join(" · ")} s`, "");
  L.push("| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |", "|---|---|---|---|---|---|---|---|---|---|");
  v.shots.forEach((s) => L.push(`| ${s.n} | ${n(s.a, 1)}–${n(s.b, 1)} | ${n(s.len, 1)} | | | | ${s.motion ? `${s.motion.kind} (${n(s.motion.score * 1000, 1)}‰)` : ""} | | | |`));
  L.push("");
}
L.push("## File làm việc (`_work/`, git-ignored)", "");
L.push("`channel.json` (danh sách kênh) · `<id>.meta.json` · `<id>.probe.json` · `<id>.measure.json` (điểm cắt, đứng yên, độ to) · `<id>.transcript.json` (lời có thời gian từng từ) · `<id>.ocr.json` (chữ trên màn hình) · `<id>.stems.json` (giọng / nền) · `ingest.json` (gộp tất cả, cho bước P2) · `sheets/`.");
fs.writeFileSync(path.join(outDir, "INGEST.md"), L.join("\n") + "\n");
say(`✓ ${path.relative(ROOT, path.join(outDir, "INGEST.md"))}`);
