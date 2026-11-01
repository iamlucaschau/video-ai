#!/usr/bin/env node
/**
 * Studio P3 — style kits that follow studio/KIT-CONTRACT.md.
 *
 *   npm run studio:kit -- new <X>-<name> --from "Test/<source>" [--title "Siege Atlas"]
 *     Scaffolds Style Library/<X>-<name>/ from the source's style-card.json: <name>.tsx (palette roles,
 *     Base, Chip, <Name>Sub), <x>-kit/Video.tsx (KitSheet composition) and a README draft with the
 *     technique → component table. Prints the lines to paste into src/Root.tsx. Never overwrites.
 *   npm run studio:kit -- check "Style Library/<X>-<name>"
 *     Checks a kit against the contract (files, palette, subtitle skin, kit-common, banned patterns).
 *   npm run studio:kit -- --selftest
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIB = path.join(ROOT, "Style Library");
const LEVEL = { green: "🟢", yellow: "🟡", orange: "🟠", red: "🔴" };

// ---------- pure helpers (checked by --selftest)

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const sat = (hex) => {
  const c = rgb(hex);
  const max = Math.max(...c);
  const min = Math.min(...c);
  return max === min ? 0 : (max - min) / (1 - Math.abs(max + min - 1));
};

/** bg = most area (card palette is sorted by share), ink = best contrast on bg, accent = most saturated of the rest that still reads on bg (≥ 3:1). */
const roles = (hexes) => {
  const bg = hexes[0];
  const ink = [...hexes.slice(1)].sort((a, b) => contrast(b, bg) - contrast(a, bg))[0] ?? (lum(bg) > 0.4 ? "#111111" : "#FFFFFF");
  const rest = hexes.filter((h) => h !== bg && h !== ink && contrast(h, bg) >= 3);
  const accent = [...rest].sort((a, b) => sat(b) - sat(a))[0] ?? ink;
  return { bg, ink, accent };
};

const camel = (s) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");

const BANNED = [
  [/Math\.random\(/, "Math.random( → random(\"seed\")"],
  [/Date\.now\(/, "Date.now("],
  [/setTimeout\(/, "setTimeout("],
  [/@keyframes/, "@keyframes"],
  [/\banimation\s*:/, "CSS animation"],
  [/\btransition\s*:/, "CSS transition"],
  [/\btransform\s*:/, "transform string → scale / translate / rotate"],
  [/<(img|video|audio)\b/, "raw <img>/<video>/<audio>"],
];
const banned = (src) => BANNED.filter(([re]) => re.test(src)).map(([, why]) => why);

if (process.argv.includes("--selftest")) {
  const ok = (c, m) => {
    if (!c) throw new Error(`selftest: ${m}`);
  };
  ok(Math.abs(contrast("#000000", "#FFFFFF") - 21) < 0.01, "contrast");
  const r = roles(["#122B35", "#29424E", "#85836C", "#BEC1BB", "#E8A33D"]);
  ok(r.bg === "#122B35" && r.ink === "#BEC1BB" && r.accent === "#E8A33D", `roles ${JSON.stringify(r)}`);
  ok(roles(["#122B35", "#29424E", "#A79B83", "#BEC1BB"]).accent === "#A79B83", "accent must read on bg");
  ok(camel("siege-atlas") === "SiegeAtlas", "camel");
  ok(banned("const x = Math.random(); style={{transform: 'x'}}").length === 2 && !banned("<Img src={a} /> <g transform=\"x\">").length, "banned");
  console.log("selftest ok");
  process.exit(0);
}

const [cmd, target] = process.argv.slice(2);
const opt = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : null;
};

// ---------- check

if (cmd === "check" && target) {
  const dir = path.resolve(ROOT, target);
  const name = path.basename(dir).replace(/^[A-Z]-/, "");
  const res = [];
  const add = (lvl, msg) => res.push([lvl, msg]);
  const all = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? all(path.join(d, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(d, e.name)] : []));
  if (!fs.existsSync(dir)) {
    console.error(`No such folder: ${target}`);
    process.exit(1);
  }
  add(fs.existsSync(path.join(dir, "README.md")) ? "✓" : "✗", "README.md");
  add(fs.existsSync(path.join(dir, "ref.jpg")) ? "✓" : "⚠", "ref.jpg (frame from our own test)");
  const kit = path.join(dir, `${name}.tsx`);
  if (!fs.existsSync(kit)) add("✗", `${name}.tsx (kit file named after the folder)`);
  else {
    const src = fs.readFileSync(kit, "utf8");
    add(/export const \w+ = \{[^}]*(#[0-9A-Fa-f]{6}[^}]*){3}/s.test(src) ? "✓" : "✗", "palette: an exported object with ≥ 3 hex colours");
    add(/: SubSkin\b/.test(src) ? "✓" : "✗", "subtitle skin (`export const <Name>Sub: SubSkin`)");
    add(/from "\.\.\/kit-common"/.test(src) ? "✓" : "⚠", "imports ../kit-common (CANVAS, SAFE, FONT, CLAMP)");
    const fonts = [...src.matchAll(/@remotion\/google-fonts\/(\w+)/g)].map((m) => m[1]);
    if (fonts.length) add("⚠", `own font(s) ${fonts.join(", ")}: README must name the approved exception`);
  }
  const subs = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && fs.existsSync(path.join(dir, e.name, "Video.tsx"))).map((e) => e.name);
  add(subs.length ? "✓" : "⚠", `compositions with Video.tsx: ${subs.join(", ") || "none (no KitSheet / test yet)"}`);
  for (const f of all(dir)) for (const why of banned(fs.readFileSync(f, "utf8"))) add("✗", `${path.relative(dir, f)}: ${why}`);
  res.forEach(([lvl, msg]) => console.log(`${lvl} ${msg}`));
  const bad = res.filter(([l]) => l === "✗").length;
  console.log(bad ? `✗ ${bad} problem(s)` : `✓ ${path.basename(dir)} meets the kit contract`);
  process.exit(bad ? 1 : 0);
}

// ---------- new

if (cmd !== "new" || !target || !opt("from")) {
  console.error('Usage: npm run studio:kit -- new <X>-<name> --from "Test/<source>" [--title "Name"]  |  check "Style Library/<X>-<name>"');
  process.exit(1);
}
if (!/^[A-Z]-[a-z0-9]+(-[a-z0-9]+)*$/.test(target)) {
  console.error("Kit folder must look like M-siege-atlas (capital letter, dash, lowercase words).");
  process.exit(1);
}
const dir = path.join(LIB, target);
if (fs.existsSync(dir)) {
  console.error(`${path.relative(ROOT, dir)} already exists: not touching it.`);
  process.exit(1);
}
const src = path.resolve(ROOT, opt("from"));
const card = JSON.parse(fs.readFileSync(path.join(src, "style-card.json"), "utf8"));
const X = target[0];
const x = X.toLowerCase();
const name = target.slice(2);
const Name = camel(name);
const title = opt("title") ?? Name.replace(/([a-z])([A-Z])/g, "$1 $2");
const hexes = card.palette.map((p) => p.hex.toUpperCase());
const { bg, ink, accent } = roles(hexes);
const roleOf = (h) => card.palette.find((p) => p.hex.toUpperCase() === h)?.role ?? "";
const TODAY = new Date().toISOString().slice(0, 10);
const fromRel = path.relative(ROOT, src).replace(/\\/g, "/");

const kitSrc = `/**
 * Style ${X} "${title}" kit, scaffolded by \`npm run studio:kit\` on ${TODAY} from ${fromRel}/style-card.json.
 * Contract: studio/KIT-CONTRACT.md. Techniques still to build: README.md (T# → component).
 * Base, Chip and ${Name}Sub are working placeholders: restyle them, keep the exports.
 */
import { AbsoluteFill } from "remotion";
import { CANVAS, CX, FONT, SAFE, SUB_BOTTOM, pop, prog } from "../kit-common";
import type { SubSkin } from "../subs";

/** Roles from the analysed source (k-means on its frames); a project may set its own accent (Style Library §2.3). */
export const ${X} = {
  bg: "${bg}", // ${roleOf(bg)}
  ink: "${ink}", // ${roleOf(ink)}
  accent: "${accent}", // ${roleOf(accent)}
  swatches: [${hexes.map((h) => `"${h}"`).join(", ")}],
} as const;

/** Full-bleed base: frame 0 is never black (thumbnail fallback). */
export const Base: React.FC = () => (
  <AbsoluteFill style={{ background: \`linear-gradient(180deg, \${${X}.swatches[1] ?? ${X}.bg} 0%, \${${X}.bg} 75%)\` }} />
);

/** Keyword or number (≤ 5 words, ≥ 56 px), pops in at frame \`at\`; x is the centre, kept inside the safe zone by the caller. */
export const Chip: React.FC<{ text: string; f: number; at: number; y: number; x?: number }> = ({ text, f, at, y, x = CX }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: pop(f, at),
      opacity: prog(f, at, 4),
      padding: "14px 32px",
      borderRadius: 14,
      background: ${X}.ink,
      color: ${X}.bg,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 72,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/** Karaoke subtitle skin for KaraokeSubs (Style Library §2.6): unsaid words dim, said words ink, keywords accent. */
export const ${Name}Sub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.12, textAlign: "center" }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {ln.map((w, k) => (
            <span key={k} style={{ color: w.said ? (w.key ? ${X}.accent : ${X}.ink) : \`\${${X}.ink}66\`, WebkitTextStroke: \`8px \${${X}.bg}\`, paintOrder: "stroke fill" }}>
              {k ? " " : ""}
              {w.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
`;

const sheetSrc = `/**
 * Style ${X} KitSheet: every colour and component of the kit on one frame, for \`npm run sheet:j -- Style-${X}-${Name}-Kit --frames 0\`.
 * Add each new component here as it gets built (studio/KIT-CONTRACT.md §5).
 */
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { FONT, SAFE } from "../../kit-common";
import type { SubWord } from "../../subs";
import { Base, Chip, ${X}, ${Name}Sub } from "../${name}";

const word = (text: string, said: boolean, key = false): SubWord => ({ text, said, active: false, key });
const SAMPLE: SubWord[][] = [
  [word("In", true), word("1565,", true, true)],
  [word("a", false), word("tiny", false), word("island", false)],
];

export const ${X}Kit: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Base />
      <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top + 20, display: "flex", gap: 16 }}>
        {${X}.swatches.map((c) => (
          <div key={c} style={{ width: 120, height: 120, borderRadius: 12, background: c, border: \`4px solid \${${X}.ink}\` }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top + 170, fontFamily: FONT, fontWeight: 800, fontSize: 56, color: ${X}.ink }}>
        ${title.toUpperCase()}
      </div>
      <Chip text="KEYWORD" f={f} at={-10} y={760} />
      <Chip text="1565" f={f} at={-10} y={940} />
      <${Name}Sub lines={SAMPLE} f={f} />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
export const ${x}KitDuration = 30;
`;

const t = (s) => (s ?? "").replace(/\|/g, "/");
const techRows = card.techniques
  .filter((tc) => tc.decision !== "bỏ")
  .map((tc) => `| ${tc.id} | ${t(tc.name)} | ${LEVEL[tc.feasibility]} | ${tc.decision} | ${t(tc.kit)} | chưa |`);
const readme = `# ${X} · ${title}

*Nháp do \`npm run studio:kit\` tạo ${TODAY} từ \`${fromRel}/style-card.json\` (báo cáo: \`${fromRel}/${card.source.report}\`). Hợp đồng: \`studio/KIT-CONTRACT.md\`. Viết lại phần "Look" bằng lời của mình sau bản test đầu.*

## Look

- **Nguồn:** ${card.source.channel} (${card.source.videos.length} video). Định dạng ${card.format.aspect}, ${card.format.seconds[0]}–${card.format.seconds[1]} s, ~${card.format.wpm} wpm, ${card.format.lufs} LUFS.
- **Phụ đề (họ):** ${card.format.subtitles}
- **Chữ (họ):** ${card.type.labels}
- **Máy quay (họ):** ${card.camera.summary}
- **Kết (họ):** ${card.format.ending}

## Màu (vai trò)

| Hex | Vai trò ở nguồn | Trong kit |
|---|---|---|
${hexes.map((h) => `| \`${h}\` | ${t(roleOf(h))} | ${[["bg", bg], ["ink", ink], ["accent", accent]].filter(([, v]) => v === h).map(([k]) => `\`${X}.${k}\``).join(", ") || `\`${X}.swatches\``} |`).join("\n")}

## Luật riêng (Lucas duyệt)

- Camera: TODO (mặc định: không máy quay giả, AGENTS.md short-form rule 2).
- Chữ / phụ đề: TODO (mặc định: karaoke §2.6, ≤ 2 khối chữ, ≥ 48 px, một họ sans).
- Ngoại lệ font: không.

## Kỹ thuật → component

| T# | Kỹ thuật | Mức | Quyết định | Cách (card) | Component |
|---|---|---|---|---|---|
${techRows.join("\n")}

## Cách dựng

\`studio/KIT-CONTRACT.md\` §5: KitSheet → component từng T# → bản test ~30 s theo giọng đọc → review-loop → \`ref.jpg\` từ bản test của mình.
`;

fs.mkdirSync(path.join(dir, `${x}-kit`), { recursive: true });
fs.writeFileSync(path.join(dir, `${name}.tsx`), kitSrc);
fs.writeFileSync(path.join(dir, `${x}-kit`, "Video.tsx"), sheetSrc);
fs.writeFileSync(path.join(dir, "README.md"), readme);
console.log(`+ ${path.relative(ROOT, dir)}/{README.md, ${name}.tsx, ${x}-kit/Video.tsx}`);
console.log(`  palette: bg ${bg} · ink ${ink} · accent ${accent}`);
console.log("\nPaste into src/Root.tsx:");
console.log(`  import { ${X}Kit, ${x}KitDuration } from "../Style Library/${target}/${x}-kit/Video";`);
console.log(`  <Composition id="Style-${X}-${Name}-Kit" component={${X}Kit} width={1080} height={1920} fps={30} durationInFrames={${x}KitDuration} />`);
console.log(`\nThen: npm run lint && npm run sheet:j -- Style-${X}-${Name}-Kit --frames 0`);
