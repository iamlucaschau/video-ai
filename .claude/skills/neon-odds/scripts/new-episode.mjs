#!/usr/bin/env node
/**
 * NEON ODDS episode plumbing (run from the repo root):
 *   node .claude/skills/neon-odds/scripts/new-episode.mjs new 02 russian-slots       folder + voiceover header from the templates
 *   node .claude/skills/neon-odds/scripts/new-episode.mjs register 02 russian-slots  add the compositions to src/Root.tsx (after the voice exists)
 *   node .claude/skills/neon-odds/scripts/new-episode.mjs music russian-slots        add or re-measure public/sfx/music/own/<slug>.mp3 in the catalog
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..", "..", "..");
const ASSETS = path.join(HERE, "..", "assets", "episode");
const [cmd, a, b] = process.argv.slice(2);
const die = (m) => {
  console.error(`✗ ${m}`);
  process.exit(1);
};
const dirOf = (nn, slug) => path.join(ROOT, "NEON ODDS", "episodes", `ep${nn}-${slug}`);
const checkArgs = (nn, slug) => {
  if (!/^\d{2}$/.test(nn ?? "")) die("episode number must be two digits, e.g. 02");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug ?? "")) die("slug must be lowercase words joined by hyphens");
};

const newEpisode = (nn, slug) => {
  checkArgs(nn, slug);
  const dir = dirOf(nn, slug);
  if (fs.existsSync(dir)) die(`already exists, not overwriting: ${dir}`);
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(ASSETS)) {
    if (f === "voiceover-header.json") continue;
    const text = fs.readFileSync(path.join(ASSETS, f), "utf8").replaceAll("SLUG", slug).replaceAll("EPNN", `ep${nn}`);
    fs.writeFileSync(path.join(dir, f.replace("SLUG", slug).replace(/\.tpl$/, "")), text);
  }
  const vo = path.join(ROOT, "voiceover", `${slug}.json`);
  if (!fs.existsSync(vo)) fs.writeFileSync(vo, fs.readFileSync(path.join(ASSETS, "voiceover-header.json"), "utf8").replaceAll("SLUG", slug));
  for (const f of [`kich-ban-${slug}-FINAL.md`, `01_EPISODE-SPEC_${slug}.md`, "Video.tsx", "shots.json", "progress.md", "checks.md", "xuat-ban.md"]) {
    if (!fs.existsSync(path.join(dir, f))) die(`template did not produce ${f}`);
  }
  console.log(`✓ ${path.relative(ROOT, dir)}`);
};

const register = (nn, slug) => {
  checkArgs(nn, slug);
  const dir = dirOf(nn, slug);
  if (!fs.existsSync(path.join(dir, "Video.tsx"))) die(`no Video.tsx in ${dir}`);
  if (!fs.existsSync(path.join(ROOT, "src", "voiceover", `${slug}.timing.json`))) die("no voice yet: run the voice step first (Video.tsx imports its timing)");
  const file = path.join(ROOT, "src", "Root.tsx");
  const src = fs.readFileSync(file, "utf8");
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  const name = `NOep${nn}`;
  if (src.includes(`id="NO-ep${nn}-${slug}"`)) return console.log("✓ already registered");
  const anchor = '<Composition id="Neon-Odds-Logo"';
  if (!src.includes(anchor)) die(`anchor not found in Root.tsx: ${anchor}`);
  // before the last import, not after: that one may span several lines
  const lastImport = src.lastIndexOf("\nimport ") + 1;
  const imp = `import { duration as ${name}Duration, Thumb as ${name}Thumb, Video as ${name} } from "../NEON ODDS/episodes/ep${nn}-${slug}/Video";${nl}`;
  const comps = `<Composition id="NO-ep${nn}-${slug}" component={${name}} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={${name}Duration()} />${nl}        <Composition id="NO-ep${nn}-${slug}-Thumb" component={${name}Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />${nl}        `;
  const out = src.slice(0, lastImport) + imp + src.slice(lastImport).replace(anchor, comps + anchor);
  fs.writeFileSync(file, out);
  console.log(`✓ NO-ep${nn}-${slug}, NO-ep${nn}-${slug}-Thumb in src/Root.tsx`);
};

const music = (slug) => {
  const rel = `sfx/music/own/${slug}.mp3`;
  const abs = path.join(ROOT, "public", rel);
  if (!fs.existsSync(abs)) die(`not found: ${abs}`);
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", abs, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" });
  const m = [...(r.stderr ?? "").matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop();
  if (!m) die("could not measure loudness (is ffmpeg on PATH?)");
  const seconds = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", abs], { encoding: "utf8" }).trim());
  const cat = path.join(ROOT, "public", "sfx", "catalog.json");
  const list = JSON.parse(fs.readFileSync(cat, "utf8"));
  const entry = { category: "music/own", title: `NEON ODDS bed: ${slug}`, author: "code", source: "scripts/make-music.py", seconds: Math.round(seconds * 100) / 100, file: rel, lufs: Number(m[1]) };
  fs.writeFileSync(cat, JSON.stringify([...list.filter((c) => c.file !== rel), entry], null, 2) + "\n");
  console.log(`✓ ${rel}: ${entry.lufs} LUFS, ${entry.seconds} s`);
};

if (cmd === "new") newEpisode(a, b);
else if (cmd === "register") register(a, b);
else if (cmd === "music") music(a);
else die("usage: new <NN> <slug> | register <NN> <slug> | music <slug>");
