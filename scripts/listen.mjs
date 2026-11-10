#!/usr/bin/env node
/**
 * Listening gate for a finished render (earshot, tried 2026-11-07; AGENTS.md, Sound design).
 *
 *   npm run listen -- <composition-id> "<render>.mp4|.wav" --out "<episode>/NGHE.md" [--words src/voiceover/<slug>.words.json]
 *   npm run listen -- <composition-id> --precheck --words src/voiceover/<slug>.words.json --out "<episode>/NGHE.md"
 *   npm run listen -- --selftest
 *
 * Three stages (Lucas 2026-11-08, after Naval Board #2 needed three 45-min renders to fix its sound):
 * - --precheck, before any render (~2 min, cues only): every hit whose attack lands on a spoken word. The rule is the
 *   pause after the word (AGENTS.md, Placing a hit); fix these in code first.
 * - on an audio-only render while the mix is being fixed (`npx remotion render <id> out/<id>.wav --codec=wav`, minutes
 *   instead of the full render): the whole gate below, plus the covered words with --words.
 * - on the final mp4: the required gate. Its NGHE.md is the one that goes to checks.md.
 *
 * 1. the composition's <Sfx> cues (scripts/sfx-cues.mjs), 2. the voice split off with demucs (on the full mix the
 * voice makes ~7 onsets a second and any cue looks in sync), 3. `earshot timeline --cues` on the background stem,
 * 4. NGHE.md: how well the SFX land against chance, and every SFX that barely rises over the bed or lands more than
 * 2 frames off. With --words also 5. the words the background covers (scripts/word-masking.py, on the same stems) and the
 * hits placed on a word. Each flagged row needs a human ear and a decision (keep / fixed) in checks.md.
 * 4–9 minutes for a 105 s video (3 min 55 s on Ivey, idle machine), so run it in the background. Needs earshot (uv tool), demucs and ffmpeg.
 */
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const QUIET_DB = 3; // under this over the bed an SFX may not be heard (Ivey 2026-11-07: decoys sat at 0–2 dB too)
const OFF_MS = 67; // 2 frames at 30 fps
const pct = (x) => `${Math.round(x * 100)}%`;
const time = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, "0")}`;

/** Hits whose attack lands inside a spoken word (word start to next word start, at most 0.6 s): `{t, cue, line, word}`. */
export const onWords = ({ fps, events }, lines, words) => {
  const spans = lines.flatMap((l) => {
    const ts = words[l.id] ?? [];
    const toks = l.text.split(/\s+/);
    return ts.map((t, k) => ({ t, end: Math.min(ts[k + 1] ?? l.end, t + 0.6), line: l.id, word: toks[Math.min(toks.length - 1, Math.floor((k * toks.length) / ts.length))] }));
  });
  return events
    .filter((e) => e.kind === "hit")
    .flatMap((e) => {
      const t = e.f / fps;
      // words.json has starts only, so a span runs into the pause; the last 0.15 s before the next word is the "next word
      // minus ~4 frames" slot of the placing rule, and the end of a line is its end. Both count as the gap.
      const w = spans.find((s) => t > s.t + 0.02 && t < s.end - 0.15);
      return w ? [{ t, cue: e.id, line: w.line, word: w.word }] : [];
    });
};

/** "On a word" and "covered words" sections of NGHE.md. */
export const wordSections = ({ hitsOnWords, masking }) => {
  const L = [];
  if (hitsOnWords) {
    L.push(`## SFX đặt trên chữ (${hitsOnWords.length})`, "", "Theo code, chưa cần render: tiếng nhấn rơi giữa một chữ đang đọc. Dời vào khoảng lặng ngay sau chữ, hoặc hạ nhỏ.", "");
    L.push(...(hitsOnWords.length ? ["| Lúc | SFX | Dòng | Chữ |", "| --- | --- | --- | --- |", ...hitsOnWords.map((h) => `| ${time(h.t)} | ${h.cue} | ${h.line} | ${h.word} |`)] : ["Không có."]), "");
  }
  if (masking) {
    const { band, full } = masking;
    const worst = full.covered.length ? Math.max(...full.covered.map((r) => r.bg - r.voice)) : null;
    L.push(
      `## Chữ bị nền che (${band.covered.length} dải giọng nói · ${full.covered.length} toàn dải · trên ${full.words} chữ)`,
      "",
      `Nền trong vòng 3 dB của giọng ngay trên chữ (W5). Toàn dải tệ nhất: ${worst === null ? "—" : `nền ${worst > 0 ? "hơn" : "kém"} giọng ${Math.abs(worst).toFixed(1)} dB`}. Bảng là dải giọng nói (300–3400 Hz), nơi chữ thật sự bị mất; "and", hơi thở thì thường bỏ qua được.`,
      "",
    );
    L.push(...(band.covered.length ? ["| Lúc | Dòng | Chữ | Giọng (dB) | Nền (dB) | SFX gần nhất |", "| --- | --- | --- | --- | --- | --- |", ...band.covered.map((r) => `| ${time(r.t)} | ${r.line} | ${r.word} | ${r.voice} | ${r.bg} | ${r.cue ?? "— (nhạc)"} |`)] : ["Không có."]), "");
  }
  return L.join("\n");
};

/** earshot timeline JSON -> NGHE.md text */
export const summarize = (tl, { id, mp4, date, extra = "" }) => {
  const { stats, items } = tl.sync.cues;
  const quiet = items.filter((i) => i.status === "no sound" || (i.event_prominence_db ?? 0) < QUIET_DB);
  const off = items.filter((i) => i.kind === "hit" && i.status !== "no sound" && Math.abs(i.offset_ms) > OFF_MS && !quiet.includes(i));
  const readable = stats.accent_within_1_frame > stats.accent_chance_within_1_frame;
  const row = (i, why) => `| ${time(i.t)} | ${i.id} | ${i.offset_ms ?? "—"} | ${i.event_prominence_db ?? "—"} | ${why} | |`;
  return [
    `# NGHE — ${id}`,
    "",
    `${path.basename(mp4)} · đo ${date} · earshot trên phần nền (demucs tách giọng) · ${stats.n} SFX`,
    "",
    `- **Trong 1 frame:** ${pct(stats.hit_within_1_frame)} (ngẫu nhiên ${pct(stats.chance_within_1_frame)})`,
    `- **Trúng tiếng nhấn:** ${pct(stats.accent_within_1_frame)} (ngẫu nhiên ${pct(stats.accent_chance_within_1_frame)})`,
    readable
      ? "- Hơn ngẫu nhiên: số đo dùng được."
      : "- **Không hơn ngẫu nhiên:** nền quá dày hoặc mp4 cũ hơn code; đừng dựa vào bảng dưới, nghe cả video.",
    "",
    `## Cần nghe (${quiet.length + off.length})`,
    "",
    "| Lúc | SFX | Lệch (ms) | Nổi trên nền (dB) | Vì sao | Quyết định (đã nghe: giữ / đã sửa) |",
    "| --- | --- | --- | --- | --- | --- |",
    ...quiet.map((i) => row(i, `nổi dưới ${QUIET_DB} dB: có thể không nghe ra`)),
    ...off.map((i) => row(i, `lệch hơn 2 frame (${i.status})`)),
    ...(quiet.length + off.length ? [] : ["| — | không có | | | | |"]),
    "",
    ...(extra ? [extra] : []),
    "Số đo là bằng chứng, không phải gu: whoosh / tiếng dài lên chậm nên lệch là thường; demucs có rò, nên dB chỉ là ƯỚC. Chạy lại demucs trên cùng file, tỉ lệ trúng có thể lệch vài điểm.",
    "",
  ].join("\n");
};

if (process.argv.includes("--selftest")) {
  const item = (t, id, offset_ms, status, event_prominence_db, kind = "hit") => ({ t, id, kind, offset_ms, status, event_prominence_db });
  const stats = { n: 4, hit_within_1_frame: 0.64, chance_within_1_frame: 0.32, accent_within_1_frame: 0.45, accent_chance_within_1_frame: 0.07 };
  const md = summarize(
    { sync: { cues: { stats, items: [item(5, "a:0", 2, "OK", 20), item(44.1, "b:1", -48, "near", 0), item(85.3, "c:2", 80, "near", 23), item(90, "w:3", 190, "off", 12, "whoosh")] } } },
    { id: "X", mp4: "x.mp4", date: "2026-11-08" },
  );
  assert.match(md, /Cần nghe \(2\)/);
  assert.match(md, /\| 0:44\.10 \| b:1 .*nổi dưới 3 dB/);
  assert.match(md, /\| 1:25\.30 \| c:2 .*lệch hơn 2 frame/);
  assert.doesNotMatch(md, /w:3/); // a whoosh's late peak is not a fault
  assert.match(md, /số đo dùng được/);
  assert.match(summarize({ sync: { cues: { stats: { ...stats, accent_within_1_frame: 0.05 }, items: [] } } }, { id: "X", mp4: "x.mp4", date: "" }), /Không hơn ngẫu nhiên/);
  const lines = [{ id: "01", end: 3, text: "one two three" }];
  const words = { "01": [0.2, 1.0, 2.0] };
  const hits = onWords({ fps: 30, events: [{ f: 36, kind: "hit", id: "on:0" }, { f: 57, kind: "hit", id: "gap:1" }, { f: 36, kind: "whoosh", id: "w:2" }] }, lines, words);
  assert.deepEqual(hits.map((h) => [h.cue, h.word]), [["on:0", "two"]]); // 1.2 s is inside "two"; 1.9 s is 4 frames before "three"; a whoosh is not a hit
  const sec = wordSections({ hitsOnWords: hits, masking: { band: { words: 3, covered: [] }, full: { words: 3, covered: [{ t: 1, line: "01", word: "two", voice: -20, bg: -18, cue: "on:0" }] } } });
  assert.match(sec, /SFX đặt trên chữ \(1\)/);
  assert.match(sec, /0 dải giọng nói · 1 toàn dải/);
  assert.match(sec, /nền hơn giọng 2\.0 dB/);
  console.log("selftest ok");
  process.exit(0);
}

const args = process.argv.slice(2);
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const [id, mp4] = args.filter((a, i) => !a.startsWith("--") && !["--out", "--words"].includes(args[i - 1]));
const out = flag("--out");
const wordsPath = flag("--words");
const precheck = args.includes("--precheck");
if (!id || !out || (precheck ? !wordsPath : !mp4 || !fs.existsSync(mp4)) || (wordsPath && !fs.existsSync(wordsPath))) {
  console.error('usage: npm run listen -- <composition-id> "<render>.mp4|.wav" --out "<episode>/NGHE.md" [--words src/voiceover/<slug>.words.json]');
  console.error('       npm run listen -- <composition-id> --precheck --words src/voiceover/<slug>.words.json --out "<episode>/NGHE.md"');
  process.exit(1);
}
const timingPath = wordsPath?.replace(/\.words\.json$/, ".timing.json");
if (wordsPath && !fs.existsSync(timingPath)) {
  console.error(`no ${timingPath} next to the words file`);
  process.exit(1);
}
const vo = wordsPath && { lines: JSON.parse(fs.readFileSync(timingPath, "utf8")).lines, words: JSON.parse(fs.readFileSync(wordsPath, "utf8")) };
process.env.EARSHOT_HOME ??= "B:/Claude/earshot-home"; // the models live here; without it earshot downloads 1.1 GB to C:
process.env.HF_HUB_DISABLE_SYMLINKS_WARNING = "1";
process.env.PYTHONIOENCODING = "utf-8";
const run = (cmd, a, what) => {
  console.log(`· ${what}`);
  const r = spawnSync(cmd, a, { cwd: ROOT, stdio: ["ignore", "ignore", "pipe"], encoding: "utf8", shell: false });
  if (r.status !== 0) {
    console.error(`${what} failed (${r.error?.message ?? `exit ${r.status}`})\n${(r.stderr ?? "").slice(-1500)}`);
    process.exit(1);
  }
};
if (!precheck && spawnSync("earshot", ["--help"], { stdio: "ignore" }).status !== 0) {
  console.error('earshot not found: uv tool install --python 3.12 "earshot @ git+https://github.com/Leonxlnx/earshot@4ac3d2a"');
  process.exit(1);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "listen-"));
try {
  const cues = path.join(tmp, "cues.json");
  run(process.execPath, ["scripts/sfx-cues.mjs", id, cues], "SFX cues (sfx-cues.mjs)");
  const cueData = JSON.parse(fs.readFileSync(cues, "utf8"));
  if (!cueData.events.length) throw new Error(`${id} has no <Sfx> to check`);
  const hitsOnWords = vo && onWords(cueData, vo.lines, vo.words);
  if (precheck) {
    const md = [`# NGHE (kiểm tra trước render) — ${id}`, "", `Từ code, ${new Date().toISOString().slice(0, 10)} · ${cueData.events.length} SFX · chưa nghe gì: chạy lại cổng đầy đủ trên bản render.`, "", wordSections({ hitsOnWords })].join("\n");
    fs.writeFileSync(out, md);
    console.log(`✓ ${out}: ${hitsOnWords.length} hits on a word`);
  } else {
    run("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-vn", "-ar", "44100", "-ac", "2", path.join(tmp, "mix.wav")], "audio out of the mp4");
    run("python", ["-m", "demucs", "--two-stems", "vocals", "-n", "htdemucs", "-d", "cpu", "-o", tmp, path.join(tmp, "mix.wav")], "voice split (demucs, ~4 min)");
    const tl = path.join(tmp, "tl.json");
    run("earshot", ["timeline", path.join(tmp, "htdemucs", "mix", "no_vocals.wav"), "--cues", cues, "--detail", "low", "--out", tl], "earshot timeline (~1.5 min)");
    let masking;
    if (vo) {
      const wm = path.join(tmp, "masking.json");
      run("python", ["-P", "scripts/word-masking.py", path.join(tmp, "htdemucs", "mix"), timingPath, wordsPath, cues, wm], "covered words (word-masking.py)");
      masking = JSON.parse(fs.readFileSync(wm, "utf8"));
    }
    const extra = vo ? wordSections({ hitsOnWords, masking }) : "";
    const md = summarize(JSON.parse(fs.readFileSync(tl, "utf8")), { id, mp4, date: new Date().toISOString().slice(0, 10), extra });
    fs.writeFileSync(out, md);
    console.log(`✓ ${out}`);
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  fs.rmSync(tmp, { recursive: true, force: true }); // stems are ~40 MB per minute
}
