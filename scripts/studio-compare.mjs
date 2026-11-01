#!/usr/bin/env node
/**
 * Studio P5 — our video vs the reference, on the same measures (studio/README.md).
 *
 *   npm run studio:compare -- "<our render>.mp4" --ref "Test/<source>" [--lang en] [--force]
 *   npm run studio:compare -- --selftest
 *
 * Measures our render with studio:ingest (into out/compare/<name>/, git-ignored, no sheets), reads the
 * reference's _work/ingest.json (run studio:ingest on the source first) and writes SO-SANH.md next to our mp4:
 * per measure our value, the reference median and range, and where we sit. Only the absolute rules
 * (−14 LUFS ±1, true peak ≤ −1.5 dBTP) pass or fail; the rest is a difference to read, because some of ours
 * differ on purpose (QUYẾT in the analysis).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = new Date().toISOString().slice(0, 10);

// ---------- pure helpers (checked by --selftest)

const median = (xs) => {
  const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Measures of one video from studio:ingest's ingest.json entry. */
const measures = (v) => {
  const d = v.tech.duration;
  const share = (kind) => v.shots.filter((s) => s.motion?.kind === kind).reduce((t, s) => t + s.len, 0) / d;
  return {
    duration: d,
    words: v.sp?.words ?? null,
    wpm: v.sp?.wpm ?? null,
    firstWordMs: v.sp?.firstWordMs ?? null,
    speechRatio: v.sp?.speechRatio ?? null,
    shots: v.shots.length,
    shotMean: d / Math.max(1, v.shots.length),
    openingShot: v.shots[0]?.len ?? null,
    longestShot: v.shots.length ? Math.max(...v.shots.map((s) => s.len)) : null,
    shots3s: v.shots.filter((s) => s.a < 3).length,
    softPerMin: (v.m?.soft?.length ?? 0) / (d / 60),
    still: share("đứng yên"),
    slow: share("chậm"),
    fast: share("nhanh"),
    lufs: v.m?.lufs ?? null,
    truePeak: v.m?.truePeak ?? null,
    lra: v.m?.lra ?? null,
    textFrames: v.text?.textFrames ?? null,
    wordsPerFrame: v.text?.wordsPerFrame ?? null,
    maxBlocks: v.text?.maxBlocks ?? null,
    textHeight: v.text?.textHeight ?? null,
    smallText: v.text?.smallText ?? null,
    outsideSafe: v.text?.outsideSafe ?? null,
    bedMinusVoice: v.stems?.bedMinusVoice ?? null,
    hitsPerMin: v.stems?.hitsPerMin ?? null,
    sentences: v.script?.sentences ?? null,
    wordsPerSentence: v.script?.wordsPerSentence ?? null,
    hookWords: v.script?.hookWords ?? null,
    hookSeconds: v.script?.hookSeconds ?? null,
    firstNumberAt: v.script?.firstNumberAt ?? null,
    numbersPerSentence: v.script?.numbersPerSentence ?? null,
    timeAnchorsPerMin: v.script?.timeAnchorsPerMin ?? null,
    dialogue: v.script?.dialogue ?? null,
    sourced: v.script?.sourced ?? null,
    claims: v.script?.claims ?? null,
  };
};

/** Where `x` sits against the reference values. */
const place = (x, refs) => {
  const r = refs.filter(Number.isFinite);
  if (x == null || !r.length) return "—";
  const lo = Math.min(...r);
  const hi = Math.max(...r);
  return x < lo ? "thấp hơn khoảng của họ" : x > hi ? "cao hơn khoảng của họ" : "trong khoảng";
};

const ROWS = [
  // key, label, decimals, scale, how to read
  ["sentences", "Kịch bản: số câu", 0, 1, ""],
  ["wordsPerSentence", "Kịch bản: từ / câu (trung vị)", 0, 1, "câu ngắn dễ nghe trên điện thoại"],
  ["hookWords", "Kịch bản: câu hook (từ)", 0, 1, ""],
  ["hookSeconds", "Kịch bản: câu hook hết ở giây", 1, 1, "người xem quyết định lướt trong 1–3 s đầu"],
  ["firstNumberAt", "Kịch bản: con số / mốc đầu tiên (giây)", 1, 1, "công thức: năm ngay câu đầu"],
  ["numbersPerSentence", "Kịch bản: con số / câu", 2, 1, "luật: ≤ 1 con số mới mỗi câu"],
  ["timeAnchorsPerMin", "Kịch bản: mốc thời gian / phút", 1, 1, "mốc tháng / ngày làm xương sống (nhịp V)"],
  ["dialogue", "Kịch bản: câu thoại", 0, 1, ""],
  ["sourced", "Kịch bản: câu dán nhãn nguồn", 0, 1, "mình: mọi số tranh cãi đều dán nhãn"],
  ["claims", "Kịch bản: khẳng định cần kiểm", 0, 1, "mỗi câu phải có dòng trong bảng kiểm chứng"],
  ["duration", "Thời lượng (s)", 1, 1, "khớp preset của kênh mình"],
  ["words", "Số từ lời đọc", 0, 1, ""],
  ["wpm", "Tốc độ đọc (wpm)", 0, 1, "chậm hơn nhiều → dễ lướt; nhanh hơn nhiều → khó theo hình"],
  ["firstWordMs", "Lời bắt đầu (ms, Whisper ±200)", 0, 1, "càng sớm càng ít người lướt ở giây đầu"],
  ["speechRatio", "Thời gian có lời (%)", 0, 100, ""],
  ["shots", "Số shot (cắt cứng)", 0, 1, "style bay liên tục (J) có ít cắt là bình thường"],
  ["shotMean", "Shot trung bình (s)", 1, 1, ""],
  ["openingShot", "Shot mở đầu (s)", 1, 1, ""],
  ["longestShot", "Shot dài nhất (s)", 1, 1, "dài mà không có gì mới → kiểm lesson E3 (≤ ~8 s không điểm mới)"],
  ["shots3s", "Shot trong 3 s đầu", 0, 1, ""],
  ["softPerMin", "Điểm cắt mềm / phút", 1, 1, "crossfade, lớp hình đổi"],
  ["still", "Thời gian hình đứng yên (%)", 0, 100, "cao → nguy cơ \"slide\"; thấp → khung luôn sống"],
  ["slow", "Thời gian chuyển động chậm (%)", 0, 100, ""],
  ["fast", "Thời gian chuyển động nhanh (%)", 0, 100, ""],
  ["lufs", "Độ to (LUFS)", 1, 1, "luật: −14 ±1"],
  ["truePeak", "True peak (dBTP)", 1, 1, "luật: ≤ −1,5"],
  ["lra", "Biên độ to nhỏ (LRA, LU)", 1, 1, ""],
  ["textFrames", "Khung có chữ (%, OCR)", 0, 100, "gồm phụ đề và watermark"],
  ["wordsPerFrame", "Từ trên màn hình / khung", 0, 1, "luật: ít chữ (phụ đề + ≤ 2 khối ≤ 5 từ)"],
  ["maxBlocks", "Khối chữ cùng lúc (tối đa)", 0, 1, "luật: ≤ 2 ngoài phụ đề (OCR tách 1 dòng thành nhiều khối)"],
  ["textHeight", "Cao chữ trung vị (px / 1080)", 0, 1, "luật: chữ ≥ 48 px"],
  ["smallText", "Chữ nhỏ (10 % nhỏ nhất, px)", 0, 1, "dưới ~40 px là khó đọc trên điện thoại"],
  ["outsideSafe", "Khối chữ ngoài vùng an toàn (%)", 0, 100, "luật: 0 (trừ watermark / handle ở mép)"],
  ["bedMinusVoice", "Nền − giọng (dB, demucs)", 1, 1, "càng âm, giọng càng nổi trên nhạc + SFX"],
  ["hitsPerMin", "Tiếng nhấn ở nền / phút (ƯỚC)", 1, 1, "SFX + nhịp nhạc mạnh; hiệu chỉnh trên Ep02: 39 đếm vs 41 đặt"],
];

const verdict = (key, x, refs) => {
  if (key === "lufs") return x == null ? "—" : Math.abs(x + 14) <= 1 ? "✓ đạt luật" : "✗ ngoài −14 ±1";
  if (key === "truePeak") return x == null ? "—" : x <= -1.5 ? "✓ đạt luật" : "✗ trên −1,5";
  return place(x, refs);
};

if (process.argv.includes("--selftest")) {
  const ok = (c, m) => {
    if (!c) throw new Error(`selftest: ${m}`);
  };
  const v = { tech: { duration: 10 }, sp: { words: 25, wpm: 150, firstWordMs: 100, speechRatio: 0.9 }, m: { soft: [4], lufs: -14.2, truePeak: -1.0, lra: 3 }, shots: [{ a: 0, b: 6, len: 6, motion: { kind: "chậm" } }, { a: 6, b: 10, len: 4, motion: { kind: "đứng yên" } }] };
  const m = measures(v);
  ok(m.shots === 2 && m.shotMean === 5 && m.openingShot === 6 && m.shots3s === 1 && m.slow === 0.6 && m.still === 0.4 && m.softPerMin === 6, `measures ${JSON.stringify(m)}`);
  ok(place(5, [4, 6]) === "trong khoảng" && place(3, [4, 6]).startsWith("thấp") && place(null, [1]) === "—", "place");
  ok(verdict("lufs", -14.2, []).startsWith("✓") && verdict("truePeak", -1.0, []).startsWith("✗"), "verdict");
  ok(median([3, 1, 2]) === 2, "median");
  console.log("selftest ok");
  process.exit(0);
}

// ---------- run

const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : null;
};
const mp4 = argv.find((a) => /\.mp4$/i.test(a));
const refDir = opt("ref") && path.resolve(ROOT, opt("ref"));
if (!mp4 || !refDir) {
  console.error('Usage: npm run studio:compare -- "<our render>.mp4" --ref "Test/<source>" [--lang en] [--force]');
  process.exit(1);
}
const refJson = path.join(refDir, "_work/ingest.json");
if (!fs.existsSync(refJson)) {
  console.error(`No ${path.relative(ROOT, refJson)}: run npm run studio:ingest -- "${opt("ref")}" first.`);
  process.exit(1);
}
const abs = path.resolve(ROOT, mp4);
const name = path.basename(abs, path.extname(abs));
const out = path.join(ROOT, "out/compare", name);
const args = ["scripts/studio-ingest.mjs", abs, "--out", out, "--no-sheets", ...(opt("lang") ? ["--lang", opt("lang")] : []), ...(argv.includes("--force") ? ["--force"] : [])];
const r = spawnSync(process.execPath, args, { cwd: ROOT, stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);

const ours = JSON.parse(fs.readFileSync(path.join(out, "_work/ingest.json"), "utf8")).videos[0];
const ref = JSON.parse(fs.readFileSync(refJson, "utf8")).videos;
const mo = measures(ours);
const mr = ref.map(measures);
const fmt = (x, d, scale) => (x == null || !Number.isFinite(x) ? "—" : (x * scale).toLocaleString("vi-VN", { minimumFractionDigits: d, maximumFractionDigits: d }));

const L = [`# SO SÁNH — ${path.basename(abs)} vs ${path.basename(refDir)}`, ""];
L.push(`*Tự sinh bởi \`npm run studio:compare\` ngày ${TODAY}; chạy lại sẽ ghi đè. Cùng một bộ đo cho cả hai bên (\`studio:ingest\`: ffprobe, ebur128, điểm scene, faster-whisper). Bên họ: ${ref.length} video (\`${path.relative(ROOT, refDir).replace(/\\/g, "/")}/INGEST.md\`). Chỉ hai dòng âm lượng là luật (đạt / trượt); các dòng khác là khác biệt để đọc: khác vì mình đã chọn khác (QUYẾT trong phân tích) thì giữ, khác mà không có lý do thì xem lại.*`, "");
L.push("| Đo | Mình | Họ (trung vị) | Họ (khoảng) | Mình ở đâu | Đọc thế nào |", "|---|---|---|---|---|---|");
for (const [key, label, d, scale, how] of ROWS) {
  const refs = mr.map((m) => m[key]);
  const fin = refs.filter(Number.isFinite);
  L.push(`| ${label} | **${fmt(mo[key], d, scale)}** | ${fmt(median(refs), d, scale)} | ${fin.length ? `${fmt(Math.min(...fin), d, scale)}–${fmt(Math.max(...fin), d, scale)}` : "—"} | ${verdict(key, mo[key], refs)} | ${how} |`);
}
const pal = (v) => (v.pal ?? []).slice(0, 3).map((c) => `\`${c.hex}\``).join(" ");
L.push("", "## Màu chủ đạo (3 màu nhiều diện tích nhất)", "", `- Mình: ${pal(ours) || "—"}`, ...ref.map((v, i) => `- Họ V${i + 1} (${v.id ?? v.key}): ${pal(v) || "—"}`));
const outside = ROWS.filter(([key]) => !["lufs", "truePeak"].includes(key) && verdict(key, mo[key], mr.map((m) => m[key])).includes("khoảng của họ"));
const fails = ROWS.filter(([key]) => verdict(key, mo[key], []).startsWith("✗"));
L.push("", "## Tóm tắt", "");
L.push(`- Luật âm lượng: ${fails.length ? fails.map(([, l]) => `✗ ${l}`).join(", ") : "✓ đạt cả hai"}.`);
L.push(`- Ngoài khoảng của họ (${outside.length}): ${outside.map(([key, l]) => `${l} (${verdict(key, mo[key], mr.map((m) => m[key])).replace(" khoảng của họ", "")})`).join(" · ") || "không có"}.`);
L.push("- Không đo ở đây: kiểu chữ / font, nội dung hình (bản đồ, tranh), giữ chân thật (`npm run studio:stats` sau khi đăng). Chữ (OCR) và tiếng nhấn (demucs) có sai số: kiểm lại trên sheet / tai.");
const file = path.join(path.dirname(abs), "SO-SANH.md");
fs.writeFileSync(file, L.join("\n") + "\n");
console.log(`✓ ${path.relative(ROOT, file)}`);
console.log(`  luật âm lượng: ${fails.length ? fails.map(([, l]) => l).join(", ") + " ✗" : "✓"} · ngoài khoảng của họ: ${outside.length}`);
