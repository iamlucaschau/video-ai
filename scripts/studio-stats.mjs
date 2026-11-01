#!/usr/bin/env node
/**
 * Studio P5 — numbers after publishing (Bible §10), the Atlas Tí Hon ledger (scripts/stats.mjs there) plus an
 * import of YouTube Studio's CSV export. Ledger: <channel>/so-lieu.csv, one row per episode × platform × milestone
 * (UTF-8 with BOM so Excel opens it). Medians, never one outlier.
 *
 *   npm run studio:stats -- init   "<channel>"                    rows for every episode (keeps existing rows)
 *   npm run studio:stats -- import "<Table data.csv>" "<channel>" --moc 7d [--nen-tang youtube]
 *       YouTube Studio → Analytics → Advanced mode → Content, the columns you want → Export → CSV. Rows are
 *       matched by video id (youtube_id), else by title; unmatched ones are listed, never guessed.
 *   npm run studio:stats -- report "<channel>" [--moc 7d] [--nen-tang youtube] [--ref "Test/<source>"]
 *       → <channel>/SO-LIEU.md: episodes by "% viewed vs swiped away", medians by pillar and by variant
 *       (bien_the: an A/B label you set, e.g. hook type), and against the reference channel.
 *   npm run studio:stats -- --selftest
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = new Date().toISOString().slice(0, 10);
const HEAD = ["slug", "tieu_de", "pillar", "thoi_luong_s", "bien_the", "ngay_dang", "nen_tang", "moc", "youtube_id", "views", "da_xem_pct", "tg_xem_tb_s", "xem_tb_pct", "likes", "comments", "shares", "subs_moi", "ghi_chu"];

// ---------- pure helpers (checked by --selftest)

/** CSV line → fields ("quoted" fields may hold commas and "" escapes). */
const parseLine = (line) => {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && q && line[i + 1] === '"') (cur += '"'), i++;
    else if (ch === '"') q = !q;
    else if (ch === "," && !q) out.push(cur), (cur = "");
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
};
const parseCsv = (text) => {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  const head = parseLine(lines[0]);
  return { head, rows: lines.slice(1).map((l) => Object.fromEntries(parseLine(l).map((v, i) => [head[i], v]))) };
};
const toCsv = (rows) => "﻿" + [HEAD, ...rows.map((r) => HEAD.map((k) => r[k] ?? ""))].map((f) => f.map((v) => (/[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(",")).join("\n") + "\n";

const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "");
/** YouTube Studio column names (EN + VI UI) for each ledger field. */
const ALIASES = {
  id: ["Content", "Nội dung"],
  title: ["Video title", "Tiêu đề video"],
  publish: ["Video publish time", "Thời gian xuất bản video"],
  views: ["Views", "Số lượt xem", "Lượt xem"],
  tg_xem_tb_s: ["Average view duration", "Thời lượng xem trung bình"],
  xem_tb_pct: ["Average percentage viewed", "Tỷ lệ xem trung bình"],
  da_xem_pct: ["Stayed to watch", "Viewed (vs. swiped away)", "Đã xem (so với đã vuốt"],
  likes: ["Likes", "Lượt thích"],
  comments: ["Comments added", "Bình luận đã thêm", "Comments"],
  shares: ["Shares", "Lượt chia sẻ"],
  subs_moi: ["Subscribers", "Người đăng ký"],
};
const columns = (head) => Object.fromEntries(Object.entries(ALIASES).map(([k, as]) => [k, head.find((h) => as.some((a) => norm(h).startsWith(norm(a))))]));
/** "0:01:23" / "1:23" / "83" → seconds. */
const seconds = (v) => (v ?? "").split(":").reduce((t, p) => t * 60 + Number(p), 0);
const num = (v) => (v === undefined || v === "" ? NaN : Number(String(v).replace(/[%\s]/g, "").replace(",", ".")));
const median = (xs) => {
  const v = xs.filter((x) => !Number.isNaN(x) && x != null).sort((a, b) => a - b);
  if (!v.length) return NaN;
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};
const sameTitle = (a, b) => {
  const [x, y] = [norm(a), norm(b)];
  return x.length > 8 && y.length > 8 && (x === y || x.includes(y) || y.includes(x));
};

if (process.argv.includes("--selftest")) {
  const ok = (c, m) => {
    if (!c) throw new Error(`selftest: ${m}`);
  };
  ok(parseLine('a,"b, c","d ""e"""').join("|") === 'a|b, c|d "e"', "parseLine");
  const { head, rows } = parseCsv('﻿Content,Video title,Views,Average view duration,Stayed to watch (%),Likes\nabc,"Why X? 🗺️",1200,0:01:05,71.5,40\n');
  const c = columns(head);
  ok(c.id === "Content" && c.views === "Views" && c.da_xem_pct === "Stayed to watch (%)" && c.tg_xem_tb_s === "Average view duration" && !c.shares, `columns ${JSON.stringify(c)}`);
  ok(seconds(rows[0][c.tg_xem_tb_s]) === 65 && num(rows[0][c.da_xem_pct]) === 71.5, "values");
  ok(sameTitle("Why did Hannibal march 5 months over the Alps? 🗺️", "why did hannibal march 5 months over the alps") && !sameTitle("Why", "Why"), "sameTitle");
  ok(median([3, NaN, 1, 2]) === 2, "median");
  ok(parseCsv(toCsv([{ slug: "a", tieu_de: 'x, "y"' }])).rows[0].tieu_de === 'x, "y"', "toCsv round trip");
  console.log("selftest ok");
  process.exit(0);
}

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const [cmd] = argv;
const MOC = opt("moc", "7d");
const NEN = opt("nen-tang", "youtube");
const chanArg = cmd === "import" ? argv[2] : argv[1];
if (!["init", "import", "report"].includes(cmd) || !chanArg) {
  console.error('Usage: npm run studio:stats -- init "<channel>" | import "<Table data.csv>" "<channel>" --moc 7d | report "<channel>" [--ref "Test/<source>"]');
  process.exit(1);
}
const chan = path.resolve(ROOT, chanArg);
const ledger = path.join(chan, "so-lieu.csv");
const load = () => (fs.existsSync(ledger) ? parseCsv(fs.readFileSync(ledger, "utf8")).rows : []);
const save = (rows) => fs.writeFileSync(ledger, toCsv(rows));
const fmt = (v, d = 0) => (Number.isNaN(v) || v == null ? "–" : v.toLocaleString("vi-VN", { maximumFractionDigits: d }));

// ---------- init

if (cmd === "init") {
  const rows = load();
  const bible = fs.existsSync(path.join(chan, "00_he-thong/01_CHANNEL-BIBLE.md")) ? fs.readFileSync(path.join(chan, "00_he-thong/01_CHANNEL-BIBLE.md"), "utf8") : "";
  const pillarOf = (nn) => bible.match(new RegExp(`^\\|\\s*${nn}\\s*\\|\\s*(P\\d)\\s*\\|`, "m"))?.[1] ?? "";
  const epDir = path.join(chan, "episodes");
  const eps = fs.existsSync(epDir) ? fs.readdirSync(epDir).filter((d) => /^ep\d+-/.test(d)) : [];
  let added = 0;
  for (const d of eps) {
    const [, nn, slug] = d.match(/^ep(\d+)-(.+)$/);
    if (rows.some((r) => r.slug === slug && r.nen_tang === NEN && r.moc === MOC)) continue;
    const dir = path.join(epDir, d);
    const read = (re) => fs.readdirSync(dir).filter((f) => re.test(f)).map((f) => fs.readFileSync(path.join(dir, f), "utf8"))[0] ?? "";
    const title = read(/^xuat-ban\.md$/).match(/^1\.\s+\*\*(.+?)\*\*/m)?.[1] ?? read(/-FINAL\.md$/).match(/^# .*?"(.+?)"/m)?.[1] ?? "";
    const timing = path.join(ROOT, "src/voiceover", `${slug}.timing.json`);
    const dur = fs.existsSync(timing) ? Math.round(JSON.parse(fs.readFileSync(timing, "utf8")).durationInSeconds) : "";
    rows.push({ slug, tieu_de: title.replace(/\s*[\p{Extended_Pictographic}️]/gu, "").trim(), pillar: pillarOf(nn), thoi_luong_s: String(dur), nen_tang: NEN, moc: MOC });
    added++;
  }
  save(rows);
  console.log(`✓ ${path.relative(ROOT, ledger)}: ${added} row(s) added, ${rows.length} in total (${NEN} · ${MOC})`);
  if (rows.some((r) => !r.pillar)) console.log("  ⚠ some rows have no pillar: fill the column (Bible §11 has the EP → pillar table)");
  process.exit(0);
}

// ---------- import

if (cmd === "import") {
  const src = path.resolve(ROOT, argv[1]);
  const { head, rows: studio } = parseCsv(fs.readFileSync(src, "utf8"));
  const col = columns(head);
  const missing = Object.entries(col).filter(([, v]) => !v).map(([k]) => k);
  if (!col.id && !col.title) {
    console.error(`No video id or title column in ${path.basename(src)} (headers: ${head.join(", ")})`);
    process.exit(1);
  }
  const rows = load();
  let filled = 0;
  const unmatched = [];
  for (const s of studio) {
    const id = col.id ? s[col.id] : "";
    if (!id || /^(total|tổng)/i.test(id)) continue;
    const title = col.title ? s[col.title] : "";
    const base = rows.find((r) => r.youtube_id === id) ?? rows.find((r) => title && sameTitle(r.tieu_de, title));
    if (!base) {
      unmatched.push(`${id} "${title}"`);
      continue;
    }
    let row = rows.find((r) => r.slug === base.slug && r.nen_tang === NEN && r.moc === MOC);
    if (!row) rows.push((row = { ...Object.fromEntries(HEAD.map((k) => [k, ""])), slug: base.slug, tieu_de: base.tieu_de, pillar: base.pillar, thoi_luong_s: base.thoi_luong_s, bien_the: base.bien_the, nen_tang: NEN, moc: MOC }));
    row.youtube_id = id;
    rows.filter((r) => r.slug === base.slug && !r.youtube_id).forEach((r) => (r.youtube_id = id));
    if (col.publish && s[col.publish]) {
      const d = new Date(s[col.publish]);
      const pad = (n) => String(n).padStart(2, "0");
      row.ngay_dang = Number.isNaN(d.getTime()) ? s[col.publish] : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // local date: Studio's "Nov 3, 2026" is a calendar day
    }
    for (const k of ["views", "da_xem_pct", "xem_tb_pct", "likes", "comments", "shares", "subs_moi"]) if (col[k] && s[col[k]] !== "") row[k] = String(num(s[col[k]]));
    if (col.tg_xem_tb_s && s[col.tg_xem_tb_s]) row.tg_xem_tb_s = String(seconds(s[col.tg_xem_tb_s]));
    filled++;
  }
  save(rows);
  console.log(`✓ ${filled} episode(s) filled in ${path.relative(ROOT, ledger)} (${NEN} · ${MOC}) from ${path.basename(src)}`);
  if (missing.length) console.log(`  columns not in this export: ${missing.join(", ")} (add them in Studio's column picker if you want them)`);
  if (unmatched.length) console.log(`  ⚠ not matched (fill youtube_id in the ledger, then import again):\n    ${unmatched.join("\n    ")}`);
  process.exit(0);
}

// ---------- report

const all = load();
const pick = all.filter((r) => r.moc === MOC && r.nen_tang === NEN && !Number.isNaN(num(r.views)));
const L = [`# SỐ LIỆU SAU ĐĂNG — ${path.basename(chan)} · ${NEN} · ${MOC}`, ""];
L.push(`*Tự sinh bởi \`npm run studio:stats -- report\` ngày ${TODAY} từ \`so-lieu.csv\`. Trung vị, không theo một video ăn may (Bible §10). Đề xuất thử nghiệm từ đây; đổi luật kênh cần Lucas duyệt.*`, "");
L.push(`**${pick.length} / ${all.filter((r) => r.moc === MOC && r.nen_tang === NEN).length} tập có số.**`, "");
if (pick.length) {
  pick.sort((a, b) => (num(b.da_xem_pct) || 0) - (num(a.da_xem_pct) || 0));
  L.push("| Tập | Pillar | Biến thể | Dài (s) | Views | % đã xem (vs vuốt đi) | Xem TB (s) | % xem TB | Like / view |", "|---|---|---|---|---|---|---|---|---|");
  for (const r of pick) L.push(`| ${r.slug} | ${r.pillar || "–"} | ${r.bien_the || "–"} | ${r.thoi_luong_s || "–"} | ${fmt(num(r.views))} | ${fmt(num(r.da_xem_pct), 1)} | ${fmt(num(r.tg_xem_tb_s), 1)} | ${fmt(num(r.xem_tb_pct), 1)} | ${fmt((num(r.likes) / num(r.views)) * 100, 2)} % |`);
  const group = (key, label) => {
    const keys = [...new Set(pick.map((r) => r[key] || "–"))].sort();
    L.push("", `### Trung vị theo ${label}`, "", `| ${label} | n | Views | % đã xem | % xem TB |`, "|---|---|---|---|---|");
    for (const k of keys) {
      const g = pick.filter((r) => (r[key] || "–") === k);
      L.push(`| ${k} | ${g.length} | ${fmt(median(g.map((r) => num(r.views))))} | ${fmt(median(g.map((r) => num(r.da_xem_pct))), 1)} | ${fmt(median(g.map((r) => num(r.xem_tb_pct))), 1)} |`);
    }
  };
  group("pillar", "pillar");
  group("bien_the", "biến thể");
}
const refDir = opt("ref");
if (refDir) {
  const ij = path.join(ROOT, refDir, "_work/ingest.json");
  if (fs.existsSync(ij)) {
    const ref = JSON.parse(fs.readFileSync(ij, "utf8")).videos.filter((v) => v.meta);
    const ch = fs.existsSync(path.join(ROOT, refDir, "_work/channel.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT, refDir, "_work/channel.json"), "utf8")) : null;
    const theirMed = ch ? median(ch.shorts.map((v) => v.views)) : median(ref.map((v) => v.meta.view_count));
    const theirLike = median(ref.map((v) => (v.meta.like_count / v.meta.view_count) * 100));
    const ourMed = median(pick.map((r) => num(r.views)));
    const ourLike = median(pick.map((r) => (num(r.likes) / num(r.views)) * 100));
    L.push("", `### So với đối thủ (\`${refDir}\`)`, "");
    L.push("| | Mình (trung vị, mốc " + MOC + ") | Họ (trung vị) |", "|---|---|---|");
    L.push(`| Views / video | ${fmt(ourMed)} | ${fmt(theirMed)} (tổng tới ngày lấy số, video đã đăng lâu hơn) |`);
    L.push(`| Like / view | ${fmt(ourLike, 2)} % | ${fmt(theirLike, 2)} % |`);
    L.push("", "Views của họ là tổng cả đời video; so với mốc 30 ngày của mình mới công bằng. Like / view so được ở mọi mốc.");
  } else L.push("", `*Không có \`${refDir}/_work/ingest.json\`: chạy \`npm run studio:ingest -- "${refDir}"\` trước.*`);
}
if (pick.length && pick.length < 6) L.push("", "⚠ Dưới 6 tập có số: đọc trung vị như gợi ý, chưa phải kết luận.");
if (!pick.length) L.push("Chưa có số: xuất CSV từ YouTube Studio (Analytics → Advanced mode → Content → Export) rồi `npm run studio:stats -- import`.");
fs.writeFileSync(path.join(chan, "SO-LIEU.md"), L.join("\n") + "\n");
console.log(`✓ ${path.relative(ROOT, path.join(chan, "SO-LIEU.md"))} (${pick.length} episode(s) with numbers)`);
