#!/usr/bin/env node
/**
 * Gemini TTS voiceover generator with multi-key rotation.
 *
 *   node scripts/tts.mjs check
 *       Validate every configured key (lists models, uses no quota).
 *
 *   node scripts/tts.mjs say "Text to speak" --out public/voiceover/line.wav
 *       [--voice Kore] [--style "warm and friendly"] [--model gemini-3.8-flash-tts] [--key 2]
 *
 *   node scripts/tts.mjs build voiceover/example.json [--force]
 *       Generate every line of a voiceover script into public/voiceover/<name>/<id>.wav
 *       and write src/voiceover/<name>.json (durations in seconds) for Remotion.
 *       Unchanged lines are skipped (cached by hash) to save quota.
 *
 * Keys are read (first match wins) from:
 *   1. env GEMINI_API_KEYS="key1,key2"  or  GEMINI_API_KEY_1, GEMINI_API_KEY_2, …  or  GEMINI_API_KEY
 *   2. the same variables in a .env file at the project root
 *   3. gemini_key.txt / gemini_key.txt.txt at the project root, one key per line
 *      ("API KEY 1: <key>" or just "<key>")
 * Keys are never printed; logs refer to them as key #1, key #2, …
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULTS = {
  model: "gemini-3.8-flash-tts",
  voice: "Kore",
  style: "",
};
const KEY_FILES = ["gemini_key.txt", "gemini_key.txt.txt"];
const MAX_ROUNDS = 4; // full passes over all keys before giving up

// ---------------------------------------------------------------- keys

const keysFromEnv = (env) => {
  if (env.GEMINI_API_KEYS) {
    return env.GEMINI_API_KEYS.split(/[,\s]+/).filter(Boolean);
  }
  const numbered = Object.keys(env)
    .filter((k) => /^GEMINI_API_KEY_\d+$/.test(k))
    .sort((a, b) => Number(a.split("_").pop()) - Number(b.split("_").pop()))
    .map((k) => env[k])
    .filter(Boolean);
  if (numbered.length) return numbered;
  return env.GEMINI_API_KEY ? [env.GEMINI_API_KEY] : [];
};

const parseDotEnv = (file) => {
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
};

const loadKeys = () => {
  let keys = keysFromEnv(process.env);
  if (keys.length) return { keys, source: "environment" };

  const dotEnv = path.join(ROOT, ".env");
  if (fs.existsSync(dotEnv)) {
    keys = keysFromEnv(parseDotEnv(dotEnv));
    if (keys.length) return { keys, source: ".env" };
  }

  for (const name of KEY_FILES) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    keys = fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .map((l) => l.replace(/^[^:]*:\s*/, "").trim())
      .filter(Boolean);
    if (keys.length) return { keys, source: name };
  }
  throw new Error(
    "No Gemini API key found. Set GEMINI_API_KEYS in .env or create gemini_key.txt (see AGENTS.md).",
  );
};

// ---------------------------------------------------------------- api

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Errors worth retrying on another key / later. */
const isRetryable = (status) =>
  status === 429 ||
  status === 401 ||
  status === 403 ||
  status === 408 ||
  status >= 500;

let nextKey = 0;

/**
 * Generate speech. Rotates keys round-robin; on quota/auth/server errors it
 * falls through to the next key, backing off between full rounds.
 */
const synthesize = async (keys, { text, voice, style, model, key }) => {
  const body = {
    model,
    input: [
      {
        type: "user_input",
        content: [
          {
            type: "text",
            text,
            ...(style
              ? { annotations: [{ type: "speech_metadata", style }] }
              : {}),
          },
        ],
      },
    ],
    response_format: { type: "audio", mime_type: "audio/wav" },
    generation_config: { speech_config: [{ voice }] },
  };

  const order = key
    ? [key - 1]
    : keys.map((_, i) => (nextKey + i) % keys.length);
  nextKey = (nextKey + 1) % keys.length;

  let lastError;
  for (let round = 0; round < MAX_ROUNDS; round++) {
    for (const i of order) {
      let res;
      try {
        res = await fetch(`${API}/interactions`, {
          method: "POST",
          headers: {
            "x-goog-api-key": keys[i],
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(body),
        });
      } catch (err) {
        lastError = `key #${i + 1}: network error ${err.message}`;
        console.warn(`  ! ${lastError}`);
        continue;
      }
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        const audio = (json.steps ?? [])
          .filter((s) => s.type === "model_output")
          .flatMap((s) => s.content ?? [])
          .filter((c) => c.type === "audio")
          .pop();
        if (!audio?.data)
          throw new Error(`key #${i + 1}: response had no audio`);
        let buf = Buffer.from(audio.data, "base64");
        if (buf.subarray(0, 4).toString("latin1") !== "RIFF")
          buf = pcmToWav(buf);
        return { wav: buf, keyIndex: i + 1, usage: json.usage };
      }
      const msg = json.error?.message ?? res.statusText;
      lastError = `key #${i + 1}: HTTP ${res.status} ${msg}`;
      const badKey = res.status === 400 && /api.?key/i.test(msg);
      if (!isRetryable(res.status) && !badKey) throw new Error(lastError);
      console.warn(`  ! ${lastError}, trying next key`);
    }
    const wait = 2000 * 2 ** round;
    if (round < MAX_ROUNDS - 1) {
      console.warn(`  … all keys failed, retrying in ${wait / 1000}s`);
      await sleep(wait);
    }
  }
  throw new Error(`All keys failed. Last error: ${lastError}`);
};

// ---------------------------------------------------------------- wav

/** Wrap raw 24 kHz 16-bit mono PCM in a WAV header. */
const pcmToWav = (pcm, sampleRate = 24000, channels = 1, bits = 16) => {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(channels, 22);
  h.writeUInt32LE(sampleRate, 24);
  h.writeUInt32LE((sampleRate * channels * bits) / 8, 28);
  h.writeUInt16LE((channels * bits) / 8, 32);
  h.writeUInt16LE(bits, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
};

/** Duration in seconds, read from the WAV chunks. */
const wavDuration = (buf) => {
  let byteRate = 0;
  for (let o = 12; o + 8 <= buf.length; ) {
    const id = buf.toString("latin1", o, o + 4);
    let size = buf.readUInt32LE(o + 4);
    if (id === "fmt ") byteRate = buf.readUInt32LE(o + 16);
    if (id === "data") {
      // Streaming-style headers may carry a 0/0xFFFFFFFF placeholder size.
      if (size === 0 || size === 0xffffffff || o + 8 + size > buf.length) {
        size = buf.length - o - 8;
      }
      return byteRate ? size / byteRate : 0;
    }
    o += 8 + size + (size % 2);
  }
  return 0;
};

// ---------------------------------------------------------------- cli

const parseArgs = (argv) => {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const name = a.slice(2);
      const val = argv[i + 1];
      if (val === undefined || val.startsWith("--")) args[name] = true;
      else args[name] = argv[++i];
    } else args._.push(a);
  }
  return args;
};

const rel = (p) => path.relative(ROOT, p).replaceAll("\\", "/");

const cmdCheck = async (keys) => {
  let ok = 0;
  for (const [i, key] of keys.entries()) {
    const res = await fetch(`${API}/models?pageSize=1000`, {
      headers: { "x-goog-api-key": key },
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      ok++;
      const tts = (json.models ?? [])
        .map((m) => m.name.replace("models/", ""))
        .filter((n) => n.includes("tts"));
      console.log(`✓ key #${i + 1}: valid. TTS models: ${tts.join(", ")}`);
    } else {
      console.log(
        `✗ key #${i + 1}: HTTP ${res.status} ${json.error?.message ?? ""}`,
      );
    }
  }
  if (ok !== keys.length) process.exitCode = 1;
};

const cmdSay = async (keys, args) => {
  const text = args._[1];
  if (!text || !args.out) {
    throw new Error('Usage: tts.mjs say "text" --out public/voiceover/x.wav');
  }
  const out = path.resolve(ROOT, args.out);
  const { wav, keyIndex } = await synthesize(keys, {
    text,
    voice: args.voice ?? DEFAULTS.voice,
    style: args.style ?? DEFAULTS.style,
    model: args.model ?? DEFAULTS.model,
    key: args.key ? Number(args.key) : undefined,
  });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, wav);
  console.log(
    `✓ ${rel(out)}  ${wavDuration(wav).toFixed(2)}s  (key #${keyIndex})`,
  );
};

const cmdBuild = async (keys, args) => {
  const scriptPath = args._[1];
  if (!scriptPath)
    throw new Error("Usage: tts.mjs build voiceover/<name>.json");
  const script = JSON.parse(
    fs.readFileSync(path.resolve(ROOT, scriptPath), "utf8"),
  );
  const name = script.name ?? path.basename(scriptPath, ".json");
  const audioDir = path.join(ROOT, "public", "voiceover", name);
  const manifestPath = path.join(ROOT, "src", "voiceover", `${name}.json`);
  const previous = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : { lines: [] };
  const prevById = new Map(previous.lines.map((l) => [l.id, l]));
  fs.mkdirSync(audioDir, { recursive: true });

  const lines = [];
  for (const line of script.lines) {
    const opts = {
      text: line.text,
      voice: line.voice ?? script.voice ?? DEFAULTS.voice,
      style: line.style ?? script.style ?? DEFAULTS.style,
      model: line.model ?? script.model ?? DEFAULTS.model,
    };
    const hash = createHash("sha1")
      .update(JSON.stringify(opts))
      .digest("hex")
      .slice(0, 12);
    const file = path.join(audioDir, `${line.id}.wav`);
    const prev = prevById.get(line.id);

    if (!args.force && prev?.hash === hash && fs.existsSync(file)) {
      console.log(`= ${line.id}: unchanged, skipped`);
      lines.push(prev);
      continue;
    }
    process.stdout.write(`… ${line.id}: generating\n`);
    const { wav, keyIndex } = await synthesize(keys, opts);
    fs.writeFileSync(file, wav);
    const durationInSeconds = Number(wavDuration(wav).toFixed(3));
    console.log(`✓ ${line.id}: ${durationInSeconds}s (key #${keyIndex})`);
    lines.push({
      id: line.id,
      text: line.text,
      voice: opts.voice,
      src: rel(file).replace(/^public\//, ""),
      durationInSeconds,
      hash,
    });
  }

  const manifest = {
    name,
    model: script.model ?? DEFAULTS.model,
    totalSeconds: Number(
      lines.reduce((s, l) => s + l.durationInSeconds, 0).toFixed(3),
    ),
    lines,
  };
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\nManifest: ${rel(manifestPath)} (${manifest.totalSeconds}s total)`,
  );
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  const { keys, source } = loadKeys();
  console.log(`Gemini TTS: ${keys.length} key(s) loaded from ${source}\n`);

  if (cmd === "check") return cmdCheck(keys);
  if (cmd === "say") return cmdSay(keys, args);
  if (cmd === "build") return cmdBuild(keys, args);
  console.log(
    'Commands: check | say "text" --out file.wav | build voiceover/<name>.json',
  );
  process.exitCode = 1;
};

main().catch((err) => {
  console.error(`✗ ${err.message}`);
  process.exitCode = 1;
});
