#!/usr/bin/env node
/**
 * Studio P2 — style card + formula card for an analysed source (studio/README.md, studio/KHA-THI.md).
 *
 *   npm run studio:cards -- init  "Test/<folder>"   after studio:ingest: writes style-card.json + formula.json
 *                                                   (measured fields filled, the rest "TODO") and copies the
 *                                                   report templates (studio/templates/*.md) that are missing
 *   npm run studio:cards -- check "Test/<folder>"   validates both cards, writes <folder>/KHA-THI.md
 *                                                   (feasibility per technique + tools waiting for Lucas)
 *   npm run studio:cards -- --selftest
 *
 * The cards are what P3 (rebuild) and P4 (channel package) read; the .md reports stay the human version.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODO = "TODO";

// ---------- schema

const label = z.enum(["ĐO", "ƯỚC", "QUYẾT"]);
const range = z.tuple([z.number(), z.number()]);
const LEVEL = { green: "🟢", yellow: "🟡", orange: "🟠", red: "🔴" };

const technique = z.object({
  id: z.string().regex(/^T\d+$/),
  name: z.string(),
  videos: z.string(),
  how: z.string(),
  signals: z.string(),
  feasibility: z.enum(["green", "yellow", "orange", "red"]),
  kit: z.string(),
  tool: z.string().optional(),
  decision: z.enum(["dùng", "thay", "bỏ", "chờ Lucas"]),
  label,
});

const tool = z.object({
  name: z.string(),
  for: z.array(z.string()).min(1),
  license: z.string(),
  install: z.string(),
  bridge: z.string(),
  fallback: z.string(),
  status: z.enum(["proposed", "approved", "rejected"]),
});

const styleCard = z
  .object({
    source: z.object({ channel: z.string(), url: z.string(), videos: z.array(z.string()).min(1), analysed: z.string(), report: z.string() }),
    format: z.object({ aspect: z.string(), seconds: range, wpm: z.number(), lufs: z.number(), subtitles: z.string(), ending: z.string() }),
    palette: z.array(z.object({ hex: z.string().regex(/^#[0-9A-F]{6}$/i), role: z.string(), label })).min(2),
    type: z.object({ subtitle: z.string(), labels: z.string(), label }),
    camera: z.object({ summary: z.string(), label }),
    rhythm: z.object({ shotMeanS: z.number(), openingShotS: z.number(), newInfoEveryS: z.number().nullable(), label }),
    techniques: z.array(technique).min(1),
    tools: z.array(tool),
  })
  .superRefine((c, ctx) => {
    const ids = new Set(c.techniques.map((t) => t.id));
    const names = new Set(c.tools.map((t) => t.name));
    for (const t of c.techniques) {
      if (t.feasibility === "orange" && !(t.tool && names.has(t.tool))) ctx.addIssue({ code: "custom", message: `${t.id} is 🟠: name its tool in tools[]` });
      if (t.feasibility === "red" && t.decision === "dùng") ctx.addIssue({ code: "custom", message: `${t.id} is 🔴: decision must be thay / bỏ / chờ Lucas` });
    }
    for (const t of c.tools) for (const id of t.for) if (!ids.has(id)) ctx.addIssue({ code: "custom", message: `tool ${t.name}: unknown technique ${id}` });
  });

/** Verbatim lines are capped (copyright rule, QUY-TRINH-PHAN-TICH §1.4): ~15 words, a trailing "…" allowed. */
const quote = z.string().refine((s) => s.split(/\s+/).filter((w) => w && w !== "…").length <= 15, "verbatim quote over 15 words: cut it with …");

const formula = z.object({
  question: z.string(),
  length: z.object({ seconds: range, words: range }),
  hook: z.object({ pattern: z.string(), quote, atS: z.number() }),
  bridge: z.object({ pattern: z.string(), quote, atShare: z.number().min(0).max(1) }),
  close: z.object({ pattern: z.string(), quote, atS: z.number().optional() }),
  beats: z.array(z.object({ name: z.string(), from: z.number().min(0).max(1), to: z.number().min(0).max(1), does: z.string() })).min(3),
  devices: z.array(z.string()),
  title: z.object({ pattern: z.string(), examples: z.array(z.string()) }),
  facts: z.object({ checked: z.number(), ok: z.number(), approx: z.number(), wrong: z.number(), unknown: z.number() }),
  pillars: z.array(z.object({ name: z.string(), share: z.number().nullable(), examples: z.array(z.string()) })),
  weaknesses: z.array(z.string()),
});

const todos = (obj, at = "") =>
  typeof obj === "string"
    ? obj.includes(TODO) ? [at] : []
    : obj && typeof obj === "object"
      ? Object.entries(obj).flatMap(([k, v]) => todos(v, at ? `${at}.${k}` : k))
      : [];

const feasibilityMd = (card) => {
  const L = [`# KHẢ THI — ${card.source.channel}`, "", "*Tự sinh bởi `npm run studio:cards -- check` từ `style-card.json`; sửa card, đừng sửa file này. Mức: `studio/KHA-THI.md`.*", ""];
  const count = (f) => card.techniques.filter((t) => t.feasibility === f).length;
  L.push(`**${card.techniques.length} kỹ thuật:** ${Object.entries(LEVEL).map(([k, e]) => `${e} ${count(k)}`).join(" · ")}`, "");
  const waiting = card.tools.filter((t) => t.status === "proposed");
  if (waiting.length) L.push(`**Chờ Lucas duyệt:** ${waiting.map((t) => `${t.name} (${t.for.join(", ")})`).join(" · ")}`, "");
  L.push("| T# | Kỹ thuật | Mức | Dấu hiệu | Cách của mình | Công cụ | Quyết định |", "|---|---|---|---|---|---|---|");
  const cell = (s) => (s ?? "").replace(/\|/g, "/").replace(/\n/g, " ");
  for (const t of card.techniques) L.push(`| ${t.id} | ${cell(t.name)} | ${LEVEL[t.feasibility]} | ${cell(t.signals)} (${t.label}) | ${cell(t.kit)} | ${cell(t.tool) || "—"} | ${t.decision} |`);
  if (card.tools.length) {
    L.push("", "## Công cụ", "", "| Công cụ | Cho | Giấy phép / giá | Cài | Nối vào Remotion | Không cài thì | Trạng thái |", "|---|---|---|---|---|---|---|");
    const st = { proposed: "chờ duyệt", approved: "✅ duyệt", rejected: "✗ không dùng" };
    for (const t of card.tools) L.push(`| ${cell(t.name)} | ${t.for.join(", ")} | ${cell(t.license)} | ${cell(t.install)} | ${cell(t.bridge)} | ${cell(t.fallback)} | ${st[t.status]} |`);
  }
  return L.join("\n") + "\n";
};

// ---------- self-test

if (process.argv.includes("--selftest")) {
  const ok = (c, m) => {
    if (!c) throw new Error(`selftest: ${m}`);
  };
  const t = (id, feasibility, extra = {}) => ({ id, name: "x", videos: "V1", how: "x", signals: "x", feasibility, kit: "x", decision: "dùng", label: "ƯỚC", ...extra });
  const base = {
    source: { channel: "c", url: "u", videos: ["a"], analysed: "2026-11-01", report: "BAO-CAO.md" },
    format: { aspect: "9:16", seconds: [80, 100], wpm: 160, lufs: -14, subtitles: "x", ending: "x" },
    palette: [{ hex: "#112233", role: "nền", label: "ĐO" }, { hex: "#AABBCC", role: "mực", label: "ĐO" }],
    type: { subtitle: "x", labels: "x", label: "ƯỚC" },
    camera: { summary: "x", label: "ƯỚC" },
    rhythm: { shotMeanS: 7, openingShotS: 30, newInfoEveryS: null, label: "ĐO" },
    techniques: [t("T1", "green")],
    tools: [],
  };
  ok(styleCard.safeParse(base).success, "valid card");
  ok(!styleCard.safeParse({ ...base, techniques: [t("T1", "orange")] }).success, "orange without tool");
  ok(!styleCard.safeParse({ ...base, techniques: [t("T1", "red")] }).success, "red used");
  const tl = { name: "Blender", for: ["T1"], license: "GPL", install: "x", bridge: "x", fallback: "x", status: "proposed" };
  const withTool = { ...base, techniques: [t("T1", "orange", { tool: "Blender", decision: "chờ Lucas" })], tools: [tl] };
  ok(styleCard.safeParse(withTool).success, "orange with tool");
  ok(feasibilityMd(withTool).includes("Chờ Lucas duyệt:** Blender (T1)"), "feasibility md");
  ok(quote.safeParse("one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen …").success, "15 words ok");
  ok(!quote.safeParse("a b c d e f g h i j k l m n o p").success, "16 words rejected");
  ok(todos({ a: "TODO", b: [{ c: "x" }, { d: "TODO x" }] }).join() === "a,b.1.d", "todos");
  console.log("selftest ok");
  process.exit(0);
}

// ---------- commands

const [cmd, folder] = process.argv.slice(2);
if (!["init", "check"].includes(cmd) || !folder) {
  console.error('Usage: npm run studio:cards -- init|check "Test/<folder>"');
  process.exit(1);
}
const dir = path.resolve(ROOT, folder);
const file = (n) => path.join(dir, n);
const read = (n) => JSON.parse(fs.readFileSync(file(n), "utf8"));

if (cmd === "init") {
  const ing = read("_work/ingest.json");
  const vs = ing.videos;
  const med = (xs) => {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    return s.length ? s[s.length >> 1] : 0;
  };
  const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
  // palette of the most viewed video: that is the look that worked
  const best = [...vs].sort((a, b) => (b.meta?.view_count ?? 0) - (a.meta?.view_count ?? 0))[0];
  const card = {
    source: { channel: vs.find((v) => v.meta)?.meta.channel ?? TODO, url: ing.channel ?? TODO, videos: vs.map((v) => v.id ?? v.key), analysed: ing.fetched, report: "BAO-CAO.md" },
    format: {
      aspect: { 0.56: "9:16", 1.78: "16:9", 1: "1:1", 0.8: "4:5" }[round(best.tech.width / best.tech.height, 2)] ?? `${best.tech.width}:${best.tech.height}`,
      seconds: [Math.floor(Math.min(...vs.map((v) => v.tech.duration))), Math.ceil(Math.max(...vs.map((v) => v.tech.duration)))],
      wpm: med(vs.map((v) => v.sp?.wpm)),
      lufs: round(med(vs.map((v) => v.m?.lufs))),
      subtitles: TODO,
      ending: TODO,
    },
    palette: (best.pal ?? []).map((c) => ({ hex: c.hex, role: TODO, label: "ĐO" })),
    type: { subtitle: TODO, labels: TODO, label: "ƯỚC" },
    camera: { summary: TODO, label: "ƯỚC" },
    rhythm: { shotMeanS: round(med(vs.map((v) => v.tech.duration / Math.max(1, v.shots.length)))), openingShotS: round(med(vs.map((v) => v.shots[0]?.len))), newInfoEveryS: null, label: "ĐO" },
    techniques: [{ id: "T1", name: TODO, videos: TODO, how: TODO, signals: TODO, feasibility: "green", kit: TODO, decision: "dùng", label: "ƯỚC" }],
    tools: [],
  };
  const form = {
    question: TODO,
    length: { seconds: card.format.seconds, words: [Math.min(...vs.map((v) => v.sp?.words ?? 0)), Math.max(...vs.map((v) => v.sp?.words ?? 0))] },
    hook: { pattern: TODO, quote: TODO, atS: 0 },
    bridge: { pattern: TODO, quote: TODO, atShare: 0 },
    close: { pattern: TODO, quote: TODO },
    beats: ["Hook", TODO, TODO].map((name) => ({ name, from: 0, to: 0, does: TODO })),
    devices: [],
    title: { pattern: TODO, examples: vs.map((v) => v.meta?.title).filter(Boolean) },
    facts: { checked: 0, ok: 0, approx: 0, wrong: 0, unknown: 0 },
    pillars: [],
    weaknesses: [],
  };
  for (const [n, data] of [["style-card.json", card], ["formula.json", form]]) {
    if (fs.existsSync(file(n))) console.log(`= ${n} exists, kept`);
    else fs.writeFileSync(file(n), JSON.stringify(data, null, 2) + "\n"), console.log(`+ ${n}`);
  }
  for (const n of fs.readdirSync(path.join(ROOT, "studio/templates"))) {
    if (fs.existsSync(file(n))) console.log(`= ${n} exists, kept`);
    else fs.copyFileSync(path.join(ROOT, "studio/templates", n), file(n)), console.log(`+ ${n}`);
  }
  process.exit(0);
}

// check
let bad = false;
const parsed = {};
for (const [n, schema] of [["style-card.json", styleCard], ["formula.json", formula]]) {
  const data = read(n);
  const r = schema.safeParse(data);
  const left = todos(data);
  if (!r.success) {
    bad = true;
    console.log(`✗ ${n}`);
    r.error.issues.forEach((i) => console.log(`   ${i.path.join(".") || "(card)"}: ${i.message}`));
  } else if (left.length) {
    bad = true;
    console.log(`… ${n}: ${left.length} TODO left (${left.slice(0, 6).join(", ")}${left.length > 6 ? ", …" : ""})`);
  } else console.log(`✓ ${n}`);
  parsed[n] = r.success ? r.data : null;
}
const card = parsed["style-card.json"];
if (card) {
  fs.writeFileSync(file("KHA-THI.md"), feasibilityMd(card));
  const count = (f) => card.techniques.filter((t) => t.feasibility === f).length;
  console.log(`  ${Object.entries(LEVEL).map(([k, e]) => `${e} ${count(k)}`).join(" · ")} → ${path.relative(ROOT, file("KHA-THI.md"))}`);
  const waiting = card.tools.filter((t) => t.status === "proposed");
  if (waiting.length) console.log(`  waiting for Lucas: ${waiting.map((t) => t.name).join(", ")}`);
}
process.exit(bad ? 1 : 0);
