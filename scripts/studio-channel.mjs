#!/usr/bin/env node
/**
 * Studio P4 — format package (studio/README.md; Lucas 2026-11-02: the package is the FORMAT, the channel's
 * name / market / language are asked later by the AI in the new chat). `studio:format` and `studio:channel` run this.
 *
 *   npm run studio:format -- new "<Format name>" --style <X-name> --from "Test/<source>" [--sample "<test folder>"]
 *     Writes Formats/<Format name>/ from studio/templates/format/: format Bible, 02_CONG-THUC (topic + title + script
 *     formula, measured targets from the source), topic bank by angle, handoff (paste-in prompt + the questions the
 *     AI must ask Lucas) and an episode template, prefilled from style-card.json, formula.json and _work/ingest.json;
 *     mau/ gets the sample built during the analysis (script, spec, checks, comparison; code + demo video
 *     referenced in mau/mau.json). "[...]" marks what Luis still writes (QUY-TRINH Giai đoạn 4). Never overwrites.
 *
 *   npm run studio:format -- export "<format or channel folder>" --to "<new project folder>" [--install] [--no-git] [--no-key]
 *     Copies everything the channel needs into a standalone Remotion project, like Atlas Tí Hon:
 *     channel folder, the style kit(s) its code reaches, every imported file (kit-common, subs, pvr helpers,
 *     voiceover manifests…), the public assets its code names, voiceover scripts + TTS cache, scripts,
 *     skills, config, a Root.tsx with only its compositions, README with the start prompt. Renders (*.mp4),
 *     vo.mp3 and _work/ are left out. gemini_key.txt is copied (git-ignored there) unless --no-key.
 *     Then git init + first commit (unless --no-git) and, with --install, npm ci.
 *
 *   npm run studio:channel -- --selftest
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = new Date().toLocaleDateString("sv-SE"); // local calendar day (UTC lags behind in Viet Nam mornings)
const posix = (p) => p.replace(/\\/g, "/");
const rel = (p) => posix(path.relative(ROOT, p));

// ---------- pure helpers (checked by --selftest)

const fill = (text, tokens) => text.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in tokens ? tokens[k] : m));

/** Relative import specifiers of a TS/TSX source (static imports and re-exports). */
const specifiers = (src) => [...src.matchAll(/(?:import|export)\s[^;]*?from\s+["'](\.[^"']+)["']|import\s+["'](\.[^"']+)["']/g)].map((m) => m[1] ?? m[2]);

/** Imports of Root.tsx: [{ names, from, text }]. */
const rootImports = (src) =>
  [...src.matchAll(/^import\s+([\s\S]*?)\s+from\s+"([^"]+)";/gm)].map((m) => ({
    names: m[1]
      .replace(/[{}]/g, ",")
      .split(",")
      .map((n) => n.trim().replace(/^type\s+/, "").split(/\s+as\s+/).pop())
      .filter((n) => /^[A-Za-z_$][\w$]*$/.test(n)),
    from: m[2],
    text: m[0],
  }));

/** Composition blocks of a Root body, grouped by Folder; a folder built with .map/.flatMap is one block. */
const rootBlocks = (body) => {
  const out = [];
  const rest = body.replace(/<Folder name="([^"]+)">([\s\S]*?)<\/Folder>/g, (_, name, inner) => {
    const items = /\.(flat)?[mM]ap\(/.test(inner) ? [inner.replace(/^\s*\n/, "").trimEnd()] : inner.match(/[ \t]*<Composition[\s\S]*?\/>/g) ?? [];
    items.forEach((text) => out.push({ folder: name, text }));
    return "";
  });
  (rest.match(/[ \t]*<Composition[\s\S]*?\/>/g) ?? []).forEach((text) => out.push({ folder: null, text }));
  return out;
};
/** Identifier `name` used in code, ignoring string and template literals (an id like `MJ-Cover-x` is not `Cover`). */
const uses = (text, name) => new RegExp(`(?<![\\w$.])${name.replace(/\$/g, "\\$")}(?![\\w$])`).test(text.replace(/`[^`]*`|"[^"\n]*"|'[^'\n]*'/g, '""'));
/** Re-indent a block to `n` spaces, keeping its inner relative indentation. */
const indent = (t, n) => {
  const lines = t.split("\n");
  const min = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => (l.trim() ? " ".repeat(n) + l.slice(min) : "")).join("\n");
};

/** Asset paths named in code: string literals that start with a public/ subfolder. */
const assetRefs = (src) => [...src.matchAll(/["'`]((?:images|sfx|audio|voiceover|fonts|video)\/[^"'`$\n]*)/g)].map((m) => m[1].replace(/\/$/, ""));

if (process.argv.includes("--selftest")) {
  const ok = (c, m) => {
    if (!c) throw new Error(`selftest: ${m}`);
  };
  ok(fill("{{A}}-{{B}}-{{C}}", { A: "1", B: "" }) === "1--{{C}}", "fill");
  ok(specifiers('import a from "./x.json";\nimport { b } from "../y";\nimport "./z.css";\nexport { c } from "./w";\nimport d from "remotion";').join() === "./x.json,../y,./z.css,./w", "specifiers");
  const imps = rootImports('import { Composition, Folder } from "remotion";\nimport {\n  A,\n  type B,\n  C as D,\n} from "../Ch/x";\nimport * as E from "./e";\n');
  ok(imps[1].names.join() === "A,B,D" && imps[1].from === "../Ch/x" && imps[2].names.join() === "E", `rootImports ${JSON.stringify(imps.map((i) => i.names))}`);
  const blocks = rootBlocks('<Folder name="F"><Composition id="a" component={A} /><Composition id="b" component={Bx} /></Folder><Folder name="G">{L.flatMap((s) => [<Composition key={s} component={M} />])}</Folder><Composition id="t" component={T} />');
  ok(blocks.length === 4 && blocks[2].folder === "G" && blocks[3].folder === null, "rootBlocks");
  ok(uses(blocks[0].text, "A") && !uses(blocks[1].text, "B") && !uses("PVR.width", "width"), "uses");
  ok(!uses('id={`MJ-Cover-${s}`} component={MJCover}', "Cover") && uses("component={Cover}", "Cover"), "uses ignores strings");
  ok(indent("    <C\n      a={1}\n    />", 2) === "  <C\n    a={1}\n  />", "indent");
  ok(assetRefs('const IMG = "images/hannibal";\nstaticFile(`${IMG}/x.jpg`); <Sfx file="sfx/whoosh/a.mp3" />').join() === "images/hannibal,sfx/whoosh/a.mp3", "assetRefs");
  console.log("selftest ok");
  process.exit(0);
}

const argv = process.argv.slice(2);
const opt = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const flag = (name) => argv.includes(`--${name}`);
const [cmd, target] = argv;

// ---------- new

if (cmd === "new" && target && opt("style") && opt("from")) {
  const dir = path.join(ROOT, "Formats", target);
  if (fs.existsSync(dir)) {
    console.error(`${rel(dir)} already exists: not touching it.`);
    process.exit(1);
  }
  const sample = opt("sample") && path.resolve(ROOT, opt("sample"));
  if (sample && !fs.existsSync(sample)) {
    console.error(`No sample folder ${opt("sample")}`);
    process.exit(1);
  }
  const style = opt("style");
  if (!fs.existsSync(path.join(ROOT, "Style Library", style))) {
    console.error(`No style kit Style Library/${style} (make it first: npm run studio:kit -- new …).`);
    process.exit(1);
  }
  const src = path.resolve(ROOT, opt("from"));
  const card = JSON.parse(fs.readFileSync(path.join(src, "style-card.json"), "utf8"));
  const form = JSON.parse(fs.readFileSync(path.join(src, "formula.json"), "utf8"));
  const styleReadme = fs.readFileSync(path.join(ROOT, "Style Library", style, "README.md"), "utf8");
  const pct = (x) => (x == null ? "[…] %" : `${Math.round(x * 100)} %`);
  // measured targets: the reference's medians and ranges for the measures studio:compare reports
  const ing = JSON.parse(fs.readFileSync(path.join(src, "_work/ingest.json"), "utf8")).videos;
  const med = (xs) => {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    return s.length ? (s.length % 2 ? s[s.length >> 1] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null;
  };
  const f1 = (x, d) => (x == null ? "—" : x.toLocaleString("vi-VN", { maximumFractionDigits: d }));
  const MEASURES = [
    ["Thời lượng (s)", (v) => v.tech.duration, 1],
    ["Tốc độ đọc (wpm)", (v) => v.sp?.wpm, 0],
    ["Từ / câu (trung vị)", (v) => v.script?.wordsPerSentence, 0],
    ["Câu hook (từ)", (v) => v.script?.hookWords, 0],
    ["Câu hook hết ở giây", (v) => v.script?.hookSeconds, 1],
    ["Con số / mốc đầu tiên (giây)", (v) => v.script?.firstNumberAt, 1],
    ["Con số / câu", (v) => v.script?.numbersPerSentence, 2],
    ["Mốc thời gian / phút", (v) => v.script?.timeAnchorsPerMin, 1],
    ["Câu dán nhãn nguồn", (v) => v.script?.sourced, 0],
  ];
  const share = (v, kind) => v.shots.filter((s) => s.motion?.kind === kind).reduce((t, s) => t + s.len, 0) / v.tech.duration * 100;
  const VISUAL = [
    ["Shot trung bình (s)", (v) => v.tech.duration / Math.max(1, v.shots.length), 1],
    ["Shot mở đầu (s)", (v) => v.shots[0]?.len, 1],
    ["Điểm cắt mềm / phút", (v) => (v.m?.soft?.length ?? 0) / (v.tech.duration / 60), 1],
    ["Thời gian hình đứng yên (%)", (v) => share(v, "đứng yên"), 0],
    ["Thời gian chuyển động chậm (%)", (v) => share(v, "chậm"), 0],
    ["Từ trên màn hình / khung", (v) => v.text?.wordsPerFrame, 0],
    ["Khối chữ cùng lúc (tối đa)", (v) => v.text?.maxBlocks, 0],
    ["Cao chữ trung vị (px / 1080)", (v) => v.text?.textHeight, 0],
    ["Chữ nhỏ (10 % nhỏ nhất, px)", (v) => v.text?.smallText, 0],
    ["Khối chữ ngoài vùng an toàn (%)", (v) => (v.text?.outsideSafe ?? NaN) * 100, 0],
    ["Nền − giọng (dB)", (v) => v.stems?.bedMinusVoice, 1],
    ["Tiếng nhấn ở nền / phút", (v) => v.stems?.hitsPerMin, 1],
    ["Độ to (LUFS)", (v) => v.m?.lufs, 1],
  ];
  const rows = (list) =>
    list.map(([label, get, d]) => {
      const xs = ing.map(get).filter(Number.isFinite);
      return `| ${label} | ${f1(med(xs), d)} | ${xs.length ? `${f1(Math.min(...xs), d)}–${f1(Math.max(...xs), d)}` : "—"} | [...] |`;
    });
  const targets = rows(MEASURES);
  const LEVEL = { green: "🟢", yellow: "🟡", orange: "🟠", red: "🔴" };
  const cell = (s) => String(s ?? "").replace(/\|/g, "/");
  const T = {
    NAME: target,
    FORMAT_DIR: rel(dir),
    CHANNEL_DIR: "<thư mục kênh>",
    CHANNEL_NAME: "[tên kênh]",
    HANDLE: "[handle]",
    HASHTAG: "[TenKenh]",
    ID_PREFIX: target.split(/\s+/).map((w) => w[0]).join("").toUpperCase(),
    TARGETS: targets.join("\n"),
    VIS_TARGETS: rows(VISUAL).join("\n"),
    TECHNIQUES: card.techniques.map((t) => `| ${t.id} | ${cell(t.name)} | ${LEVEL[t.feasibility] ?? ""} | ${t.decision} | ${cell(t.kit)} |`).join("\n"),
    PALETTE: card.palette.map((c) => `| \`${c.hex}\` | ${cell(c.role)} |`).join("\n"),
    ANGLES: form.pillars.map((p) => `| ${p.name} | ${pct(p.share)} | ${p.examples.join(" · ")} |`).join("\n") || "| [...] | | |",
    ANGLE_SECTIONS: form.pillars.map((p) => `## ${p.name}\n\n| # | Chủ đề | Hook phác | Con số chính | Nguồn sẽ kiểm | Điểm (§1) |\n|---|---|---|---|---|---|\n| 1 | | | | | |`).join("\n\n") || "## [...]",
    STYLE: style,
    STYLE_TITLE: (styleReadme.match(/^#\s+(.+)$/m)?.[1] ?? style).replace(/^[A-Z]\s*·\s*/, ""),
    LANG: opt("lang", "tiếng Anh"),
    SOURCE: rel(src),
    SOURCE_CHANNEL: card.source.channel,
    TODAY,
    QUESTION: form.question,
    SECONDS: form.length.seconds.join("–"),
    WORDS: form.length.words.join("–"),
    WPM: String(card.format.wpm),
    LUFS: String(card.format.lufs),
    HOOK_PATTERN: form.hook.pattern,
    BRIDGE_PATTERN: form.bridge.pattern,
    CLOSE_PATTERN: form.close.pattern,
    BEATS: form.beats.map((b) => `| ${b.name} | ${Math.round(b.from * 100)}–${Math.round(b.to * 100)} % | ${b.does} |`).join("\n"),
    DEVICES: form.devices.map((d) => `- ${d}`).join("\n") || "- [...]",
    WEAKNESSES: form.weaknesses.map((w) => `   - ${w}`).join("\n") || "   - [...]",
    VOICE: "Charon",
    VOICE_STYLE: "Adult documentary narrator, warm and grounded. Quick and curious on the opening line, clear and steady after; names and numbers a beat slower. On the quiet beat, slow down and soften. No hype, no shouting. The last line lands with quiet weight.",
  };
  const tpl = path.join(ROOT, "studio/templates/format");
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const left = [];
  for (const f of walk(tpl)) {
    const out = path.join(dir, path.relative(tpl, f));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const text = fill(fs.readFileSync(f, "utf8"), T);
    if (/\{\{[A-Z_]+\}\}/.test(text)) left.push(rel(out));
    fs.writeFileSync(out, text);
  }
  // mau/: the sample built during the analysis (script, spec, checks, comparison copied; code + demo video referenced)
  const mau = path.join(dir, "mau");
  fs.mkdirSync(mau, { recursive: true });
  const sampleFiles = sample ? fs.readdirSync(sample) : [];
  const copyMd = sampleFiles.filter((f) => /(-FINAL|^01_EPISODE-SPEC|^checks|^progress|^SO-SANH).*\.md$/.test(f));
  copyMd.forEach((f) => fs.copyFileSync(path.join(sample, f), path.join(mau, f)));
  const video = sampleFiles.find((f) => f.endsWith(".mp4"));
  fs.writeFileSync(path.join(mau, "mau.json"), JSON.stringify({ style: `Style Library/${style}`, source: rel(src), sample: sample ? rel(sample) : null, video: sample && video ? rel(path.join(sample, video)) : null }, null, 2) + "\n");
  const link = (p) => `[\`${p}\`](${encodeURI(posix(path.relative(mau, path.join(ROOT, p))))})`;
  fs.writeFileSync(
    path.join(mau, "README.md"),
    `# Mẫu của format ${target}\n\n*Kịch bản + video demo dựng lúc phân tích (${TODAY}). Bản chép ở đây là ảnh chụp lúc tạo gói; bản gốc đang làm việc nằm ở thư mục mẫu bên dưới.*\n\n` +
      (sample
        ? `| | |\n|---|---|\n| Thư mục mẫu (code + dữ liệu) | ${link(rel(sample))} |\n| Video demo | ${video ? link(rel(path.join(sample, video))) + " (git-ignored, đi kèm khi `export`)" : "chưa render"} |\n| Code composition | ${sampleFiles.includes("Video.tsx") ? link(rel(path.join(sample, "Video.tsx"))) : "—"} |\n${copyMd.map((f) => `| ${f} | [\`${f}\`](${encodeURI(f)}) |`).join("\n")}\n\nTập mới chép khung code từ \`Video.tsx\` của mẫu (episode \`_template/README.md\` §3).\n`
        : "Chưa có mẫu: chạy lại với `--sample <thư mục bản test>`.\n"),
  );
  console.log(`+ ${rel(dir)}/ (${walk(dir).length} files) from ${rel(src)} + Style Library/${style}${sample ? ` + sample ${rel(sample)}` : ""}`);
  if (left.length) console.warn(`  ⚠ unfilled tokens in: ${left.join(", ")}`);
  console.log(`  Next: Luis fills the "[...]" (QUY-TRINH Giai đoạn 4), Lucas approves; export with npm run studio:format -- export "${rel(dir)}" --to <folder>`);
  process.exit(0);
}

// ---------- export

if (cmd !== "export" || !target || !opt("to")) {
  console.error('Usage: npm run studio:channel -- new "<Name>" --style <X-name> --from "Test/<source>"  |  export "<channel folder>" --to "<folder>" [--install] [--no-git] [--no-key]');
  process.exit(1);
}
const chan = path.resolve(ROOT, target);
const dest = path.resolve(ROOT, opt("to"));
if (!fs.existsSync(chan)) {
  console.error(`No channel folder ${target}`);
  process.exit(1);
}
if (fs.existsSync(dest) && fs.readdirSync(dest).length) {
  console.error(`${dest} is not empty: not touching it.`);
  process.exit(1);
}
const SKIP = (p) => /\.mp4$|(^|\/)vo\.mp3$|(^|\/)_work(\/|$)|(^|\/)node_modules(\/|$)/.test(posix(p));
const files = new Set();
const addFile = (abs) => fs.existsSync(abs) && fs.statSync(abs).isFile() && !SKIP(rel(abs)) && files.add(path.resolve(abs));
const addDir = (abs) => {
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = path.join(abs, e.name);
    if (SKIP(rel(p))) continue;
    e.isDirectory() ? addDir(p) : addFile(p);
  }
};
const resolveImport = (from, spec) => {
  const base = path.resolve(path.dirname(from), spec);
  return ["", ".ts", ".tsx", ".json", "/index.ts", "/index.tsx"].map((x) => base + x).find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
};

// 1. the channel / format folder, then the style kits its code reaches (whole kit folders)
addDir(chan);
const styles = new Set();
// a format package names its style and its demo video in mau/mau.json (the video is the one mp4 that travels)
const mauJson = path.join(chan, "mau/mau.json");
const mau = fs.existsSync(mauJson) ? JSON.parse(fs.readFileSync(mauJson, "utf8")) : null;
if (mau?.style) {
  styles.add(path.basename(mau.style));
  addDir(path.join(ROOT, mau.style));
}
if (mau?.video && fs.existsSync(path.join(ROOT, mau.video))) files.add(path.resolve(ROOT, mau.video));
// the analysis the package cites: our reports + cards at the top level (no third-party video, captions or _work/)
if (mau?.source && fs.existsSync(path.join(ROOT, mau.source)))
  for (const f of fs.readdirSync(path.join(ROOT, mau.source))) if (/\.(md|json)$/.test(f)) addFile(path.join(ROOT, mau.source, f));
const code = () => [...files].filter((f) => /\.tsx?$/.test(f));
const seen = new Set();
const closure = () => {
  let grew = true;
  while (grew) {
    grew = false;
    for (const f of code()) {
      if (seen.has(f)) continue;
      seen.add(f);
      for (const s of specifiers(fs.readFileSync(f, "utf8"))) {
        const r = resolveImport(f, s);
        if (!r) {
          console.warn(`  ⚠ ${rel(f)}: cannot resolve ${s}`);
          continue;
        }
        const st = rel(r).match(/^Style Library\/([A-Z]-[^/]+)\//)?.[1];
        if (st && !styles.has(st)) {
          styles.add(st);
          addDir(path.join(ROOT, "Style Library", st));
        }
        if (!files.has(r)) {
          addFile(r);
          grew = true;
        }
      }
      grew ||= code().some((c) => !seen.has(c));
    }
  }
};
closure();

// 2. Root.tsx with only this channel's compositions (and the ones of its style kits)
const rootSrc = fs.readFileSync(path.join(ROOT, "src/Root.tsx"), "utf8").replace(/\r\n/g, "\n");
const imports = rootImports(rootSrc);
const prefixes = [rel(chan) + "/", ...[...styles].map((s) => `Style Library/${s}/`)];
const fromRepo = (spec) => rel(path.resolve(ROOT, "src", spec));
const kept = imports.filter((i) => i.from.startsWith(".") && prefixes.some((p) => fromRepo(i.from).startsWith(p))).flatMap((i) => i.names);
const body = rootSrc.slice(rootSrc.indexOf("export const RemotionRoot"));
const blocks = rootBlocks(body).filter((b) => kept.some((n) => uses(b.text, n)));
const needed = imports.filter((i) => i.from !== "remotion" && i.names.some((n) => blocks.some((b) => uses(b.text, n))));
const folders = [...new Set(blocks.map((b) => b.folder))];
const root = `import { Composition, Folder } from "remotion";
${needed.map((i) => i.text).join("\n")}

/** ${path.basename(chan)} compositions (exported from VIDEO AI by studio:channel on ${TODAY}). */
export const RemotionRoot: React.FC = () => {
  return (
    <>
${folders
  .map((f) => {
    const inner = blocks.filter((b) => b.folder === f).map((b) => indent(b.text, f ? 8 : 6)).join("\n");
    return f ? `      <Folder name="${f}">\n${inner}\n      </Folder>` : inner;
  })
  .join("\n")}
    </>
  );
};
`;
for (const i of needed) if (i.from.startsWith(".")) {
  const r = resolveImport(path.join(ROOT, "src/Root.tsx"), i.from);
  if (r) addFile(r);
}
closure();

// 3. public assets named in code, the voiceover of every manifest the code imports, SFX library
for (const f of code()) for (const a of assetRefs(fs.readFileSync(f, "utf8"))) {
  const p = path.join(ROOT, "public", a);
  if (fs.existsSync(p)) fs.statSync(p).isDirectory() ? addDir(p) : addFile(p);
}
const slugs = [...files].map((f) => rel(f).match(/^src\/voiceover\/([^/.]+)\.(?:timing|words)?\.?json$/)?.[1]).filter(Boolean);
for (const s of new Set(slugs)) {
  ["src/voiceover", "voiceover"].forEach((d) => addFile(path.join(ROOT, d, `${s}.json`)));
  ["timing", "words"].forEach((k) => addFile(path.join(ROOT, "src/voiceover", `${s}.${k}.json`)));
  for (const d of ["public/voiceover", "public/images", "voiceover/.cache"]) addDir(path.join(ROOT, d, s));
}
addDir(path.join(ROOT, "public/sfx"));

// 4. project skeleton: config, skills, scripts (not the Studio tools), src/index.ts, docs
["tsconfig.json", "eslint.config.mjs", "remotion.config.ts", ".prettierrc", ".env.example", "skills-lock.json", "package-lock.json", "src/index.ts", ".claude/launch.json", "AGENTS.md", "CLAUDE.md"].forEach((f) => addFile(path.join(ROOT, f)));
addDir(path.join(ROOT, ".agents"));
addDir(path.join(ROOT, ".claude/skills"));
for (const f of fs.readdirSync(path.join(ROOT, "scripts"))) if (!/^studio-|^transcribe\.py$/.test(f)) addFile(path.join(ROOT, "scripts", f));

// ---------- write
const copied = [...files].filter((f) => !f.endsWith(path.join("src", "Root.tsx")));
for (const f of copied) {
  const out = path.join(dest, path.relative(ROOT, f));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(f, out);
}
const w = (p, text) => {
  fs.mkdirSync(path.dirname(path.join(dest, p)), { recursive: true });
  fs.writeFileSync(path.join(dest, p), text);
};
w("src/Root.tsx", root);

const slug = path.basename(chan).toLowerCase().replace(/[^a-z0-9]+/g, "-");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
pkg.name = slug;
pkg.description = `${path.basename(chan)}: short-form channel (Remotion), exported from VIDEO AI Studio on ${TODAY}`;
pkg.scripts = Object.fromEntries(
  Object.entries(pkg.scripts).filter(([k, v]) => {
    const s = v.match(/scripts\/([\w.-]+)/)?.[1];
    return s ? fs.existsSync(path.join(dest, "scripts", s)) : ["dev", "build", "upgrade", "lint"].includes(k);
  }),
);
w("package.json", JSON.stringify(pkg, null, 2) + "\n");
const lock = JSON.parse(fs.readFileSync(path.join(dest, "package-lock.json"), "utf8"));
lock.name = slug;
if (lock.packages?.[""]) lock.packages[""].name = slug;
w("package-lock.json", JSON.stringify(lock, null, 2) + "\n");

const gi = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf8");
// Test/**: third-party videos, captions and _work/ are already ignored by these rules; our reports travel
w(".gitignore", `${gi.trimEnd()}\n`);
// display name: a format package's README heading ("# Gói format · Thế Trận"), else the folder name
const pkgReadme = path.join(chan, "README.md");
const isFormat = Boolean(mau);
const title = (fs.existsSync(pkgReadme) && fs.readFileSync(pkgReadme, "utf8").match(/^#\s+(?:Gói format\s*·\s*)?(.+)$/m)?.[1]) || path.basename(chan);
const note = `> Exported from VIDEO AI (Studio P4, ${TODAY}) as the standalone project of **${title}**. Rules that name other series, styles or folders that are not in this project do not apply here.\n\n`;
w("AGENTS.md", note + fs.readFileSync(path.join(ROOT, "AGENTS.md"), "utf8"));
w("CLAUDE.md", note + fs.readFileSync(path.join(ROOT, "CLAUDE.md"), "utf8"));

const handoff = ["05_BAN-GIAO.md", "04_BAN-GIAO.md"].map((f) => path.join(chan, "00_he-thong", f)).find((p) => fs.existsSync(p));
const prompt = handoff ? fs.readFileSync(handoff, "utf8").match(/```text\n([\s\S]*?)```/)?.[1] : null;
const compIds = [...blocks.map((b) => b.text.match(/id="([^"]+)"/)?.[1]).filter(Boolean)];
w(
  "README.md",
  `# ${title}

Dự án riêng của ${isFormat ? "gói format" : "kênh"} **${title}**, xuất từ VIDEO AI (Studio P4) ngày ${TODAY}.${isFormat ? " Tên kênh, thị trường, ngôn ngữ chưa chốt: AI ở chat mới hỏi Lucas (bàn giao §1)." : ""} Style: ${[...styles].map((s) => `\`Style Library/${s}/\``).join(", ")}.

## Bắt đầu

\`\`\`bash
npm ci
npm run dev
\`\`\`

${prompt ? `Dán vào chat mới:\n\n\`\`\`text\n${prompt}\`\`\`\n` : ""}
${isFormat ? "Gói format" : "Kênh"}: [\`${rel(chan)}/\`](${encodeURI(rel(chan))}/) (bắt đầu từ \`00_he-thong/\`). Luật chung: \`AGENTS.md\`.

## Composition

${compIds.map((i) => `- \`${i}\``).join("\n") || "- (xem `src/Root.tsx`)"}

## Chỉ có ở máy này (git-ignored)

\`gemini_key.txt\` (key TTS: không in, không commit), \`public/sfx/**/*.mp3\` (Pixabay: dùng trong video, không phân phối file), \`voiceover/.cache/\`, bản render \`*.mp4\`, \`out/\`.
`,
);
if (!flag("no-key") && fs.existsSync(path.join(ROOT, "gemini_key.txt"))) fs.copyFileSync(path.join(ROOT, "gemini_key.txt"), path.join(dest, "gemini_key.txt"));

const size = copied.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`✓ ${copied.length + 5} files (${(size / 1e6).toFixed(1)} MB) → ${dest}`);
console.log(`  styles: ${[...styles].join(", ") || "none"} · compositions: ${compIds.length} · voiceover slugs: ${[...new Set(slugs)].join(", ")}`);

const run = (c, a) => spawnSync(c, a, { cwd: dest, stdio: "pipe", encoding: "utf8", shell: process.platform === "win32" && c === "npm" });
if (!flag("no-git")) {
  run("git", ["init", "-q"]);
  run("git", ["add", "-A"]);
  const staged = run("git", ["diff", "--cached", "--name-only"]).stdout.split("\n");
  if (staged.some((f) => /gemini_key|\.env$/.test(f))) {
    console.error("✗ a key file is staged: check .gitignore. Nothing committed.");
    process.exit(1);
  }
  const msg = `${path.basename(chan)}: channel package exported from VIDEO AI Studio\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
  const r = run("git", ["-c", "user.name=Lucas", "-c", "user.email=lashaunhuesmanfoy82@gmail.com", "commit", "-q", "-m", msg]);
  console.log(r.status === 0 ? `  git: first commit (${staged.filter(Boolean).length} files), no remote` : `  ⚠ git commit failed: ${r.stderr}`);
}
if (flag("install")) {
  console.log("  npm ci …");
  const r = run("npm", ["ci", "--no-audit", "--no-fund"]);
  console.log(r.status === 0 ? "  ✓ npm ci" : `  ✗ npm ci: ${r.stderr.slice(-400)}`);
}
