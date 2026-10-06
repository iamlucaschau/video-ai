#!/usr/bin/env node
/**
 * Synthesizes royalty-free music beds and sound effects into public/audio/.
 * Deterministic: re-running produces identical files.
 *
 *   node scripts/make-audio.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "audio");
const SR = 48000;

// ---------------------------------------------------------------- utils

let seed = 1234567;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296 - 0.5;
};

const writeWav = (name, samples, peak = 0.89) => {
  let max = 1e-9;
  for (const s of samples) max = Math.max(max, Math.abs(s));
  const gain = peak / max;
  const pcm = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s * gain)) * 32767), i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(path.join(OUT, name), Buffer.concat([h, pcm]));
  console.log(`✓ public/audio/${name}  ${(samples.length / SR).toFixed(2)}s`);
};

const buffer = (seconds) => new Float32Array(Math.ceil(seconds * SR));
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

/** One-pole low-pass, in place. */
const lowpass = (buf, cutoff) => {
  const a = Math.exp((-2 * Math.PI * cutoff) / SR);
  let y = 0;
  for (let i = 0; i < buf.length; i++) {
    y = (1 - a) * buf[i] + a * y;
    buf[i] = y;
  }
  return buf;
};

const add = (dst, src, at, gain = 1) => {
  const o = Math.round(at * SR);
  for (let i = 0; i < src.length && o + i < dst.length; i++) dst[o + i] += src[i] * gain;
};

// ---------------------------------------------------------------- voices

const kick = () => {
  const b = buffer(0.4);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (45 + 75 * Math.exp(-t * 28))) / SR;
    b[i] = Math.sin(ph) * Math.exp(-t * 8);
  }
  return b;
};

const hat = (decay = 70) => {
  const b = buffer(0.08);
  let prev = 0;
  for (let i = 0; i < b.length; i++) {
    const n = rand();
    b[i] = (n - prev) * Math.exp((-i / SR) * decay);
    prev = n;
  }
  return b;
};

const clap = () => {
  const b = buffer(0.25);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    b[i] = rand() * Math.exp(-t * 22) + 0.3 * Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 30);
  }
  return lowpass(b, 3500);
};

const pluckBass = (note, seconds) => {
  const b = buffer(seconds);
  const f = midi(note);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const tri = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * f * t));
    b[i] = tri * Math.exp(-t * 5) * Math.min(1, t * 400);
  }
  return lowpass(b, 600);
};

const pad = (notes, seconds, cutoff) => {
  const b = buffer(seconds);
  for (const n of notes) {
    for (const det of [-0.08, 0.08]) {
      const f = midi(n + det);
      for (let i = 0; i < b.length; i++) {
        const saw = 2 * ((f * i) / SR - Math.floor(0.5 + (f * i) / SR));
        b[i] += saw * 0.18;
      }
    }
  }
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.6) * Math.min(1, (seconds - t) / 0.4);
    b[i] *= env;
  }
  return lowpass(lowpass(b, cutoff), cutoff * 1.5);
};

// ---------------------------------------------------------------- music

/**
 * 16-bar loop at 96 BPM (40 s). `bright` adds hats, claps and opens the
 * filter for the "rich" half of a story.
 */
const bed = ({ chords, bright }) => {
  const bpm = 96;
  const beat = 60 / bpm;
  const bar = beat * 4;
  const bars = 16;
  const out = buffer(bar * bars + 1);
  const k = kick();
  const h = hat();
  const c = clap();

  for (let b = 0; b < bars; b++) {
    const t0 = b * bar;
    const chord = chords[b % chords.length];
    add(out, pad(chord.map((n) => n + 12), bar + 0.4, bright ? 1600 : 750), t0, bright ? 0.22 : 0.26);
    for (let q = 0; q < 4; q++) {
      add(out, k, t0 + q * beat, bright ? 0.9 : 0.75);
      if (bright && (q === 1 || q === 3)) add(out, c, t0 + q * beat, 0.35);
      if (bright) add(out, h, t0 + q * beat + beat / 2, 0.22);
      else if (b % 2 === 1) add(out, h, t0 + q * beat + beat / 2, 0.08);
      // Bass: root on the beat, octave pulse on the off-beat when bright
      add(out, pluckBass(chord[0] - 12, beat), t0 + q * beat, 0.55);
      if (bright) add(out, pluckBass(chord[0], beat / 2), t0 + q * beat + beat / 2, 0.25);
    }
  }
  // Gentle bus low-pass + soft clip
  lowpass(out, bright ? 9000 : 5000);
  for (let i = 0; i < out.length; i++) out[i] = Math.tanh(out[i] * 1.2);
  return out.subarray(0, Math.round(bar * bars * SR));
};

// ---------------------------------------------------------------- sfx

const tick = () => {
  const b = buffer(0.05);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    b[i] = (rand() * 0.6 + Math.sin(2 * Math.PI * 2400 * t)) * Math.exp(-t * 180);
  }
  return b;
};

const impact = () => {
  const b = buffer(0.9);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (38 + 60 * Math.exp(-t * 18))) / SR;
    b[i] = Math.sin(ph) * Math.exp(-t * 5) + rand() * 0.8 * Math.exp(-t * 35);
  }
  return lowpass(b, 2200);
};

const ching = () => {
  const b = buffer(1.4);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const ka = rand() * Math.exp(-t * 60) * 0.7;
    const bell =
      t < 0.07
        ? 0
        : (Math.sin(2 * Math.PI * 1568 * t) + 0.7 * Math.sin(2 * Math.PI * 2093 * t) + 0.25 * Math.sin(2 * Math.PI * 3136 * t)) *
          Math.exp(-(t - 0.07) * 3.5);
    b[i] = ka + bell * 0.5;
  }
  return b;
};

const riser = () => {
  const dur = 1.8;
  const b = buffer(dur);
  let ph = 0;
  let y = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const p = t / dur;
    const cutoff = 300 + 6000 * p * p;
    const a = Math.exp((-2 * Math.PI * cutoff) / SR);
    y = (1 - a) * rand() + a * y;
    ph += (2 * Math.PI * (180 + 900 * p * p)) / SR;
    b[i] = (y * 1.6 + Math.sin(ph) * 0.25) * p ** 1.6;
  }
  return b;
};

const buzz = () => {
  const b = buffer(0.32);
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    const sq = Math.sign(Math.sin(2 * Math.PI * 110 * t)) + Math.sign(Math.sin(2 * Math.PI * 116.5 * t));
    b[i] = sq * 0.5 * Math.min(1, t * 200) * Math.min(1, (0.32 - t) * 30);
  }
  return lowpass(b, 1400);
};

/** Thermal printer line: motor whine + rapid head ticks, ~0.32 s. */
const printer = () => {
  const dur = 0.32;
  const b = buffer(dur);
  let ph = 0;
  for (let i = 0; i < b.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * 210) / SR;
    const motor = (Math.sin(ph) + 0.4 * Math.sin(ph * 3)) * 0.35;
    const tick = (t * 140) % 1 < 0.08 ? rand() * 1.2 : 0;
    const env = Math.min(1, t * 60) * Math.min(1, (dur - t) * 25);
    b[i] = (motor + tick) * env;
  }
  return lowpass(b, 4200);
};

// ---------------------------------------------------------------- main

fs.mkdirSync(OUT, { recursive: true });
// A minor: Am – Dm – Am – E (tense)  /  Am – F – C – G (lift)
writeWav("bed-dark.wav", bed({ chords: [[57, 60, 64], [62, 65, 69], [57, 60, 64], [52, 56, 59]], bright: false }));
writeWav("bed-bright.wav", bed({ chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]], bright: true }));
writeWav("tick.wav", tick(), 0.6);
writeWav("impact.wav", impact());
writeWav("ching.wav", ching(), 0.8);
writeWav("riser.wav", riser(), 0.8);
writeWav("buzz.wav", buzz(), 0.6);
writeWav("printer.wav", printer(), 0.5);
