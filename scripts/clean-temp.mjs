#!/usr/bin/env node
/**
 * Remotion leaves a ~700 MB copy of public/ in the temp folder for every render / still
 * (remotion-webpack-bundle-*) and never removes it: 35 of them filled 22 GB by 2026-11-05.
 * This clears the ones older than N hours; younger ones may belong to a render still running
 * in another session. render-j.mjs (render:style) runs it at the end of every render.
 *
 *   node scripts/clean-temp.mjs [hours]   (default 6) · --selftest
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Deletes remotion-webpack-bundle-* folders in `dir` last written more than `hours` ago. Returns { removed, bytes }. */
export const cleanRemotionBundles = (dir = os.tmpdir(), hours = 6) => {
  let removed = 0;
  let bytes = 0;
  const size = (p) => fs.readdirSync(p, { withFileTypes: true }).reduce((t, e) => t + (e.isDirectory() ? size(path.join(p, e.name)) : fs.statSync(path.join(p, e.name)).size), 0);
  for (const name of fs.readdirSync(dir).filter((f) => f.startsWith("remotion-webpack-bundle-"))) {
    const p = path.join(dir, name);
    try {
      if (Date.now() - fs.statSync(p).mtimeMs < hours * 3600e3) continue;
      const b = size(p);
      fs.rmSync(p, { recursive: true, force: true });
      removed++;
      bytes += b;
    } catch {
      // in use by a running render, or already gone: leave it for next time
    }
  }
  return { removed, bytes };
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--selftest")) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "clean-temp-test-"));
    const mk = (name, ageH) => {
      const p = path.join(dir, name);
      fs.mkdirSync(p);
      fs.writeFileSync(path.join(p, "a.bin"), Buffer.alloc(1000));
      const t = new Date(Date.now() - ageH * 3600e3);
      fs.utimesSync(p, t, t);
    };
    mk("remotion-webpack-bundle-OLD", 10);
    mk("remotion-webpack-bundle-NEW", 1);
    mk("something-else", 10);
    const r = cleanRemotionBundles(dir, 6);
    const left = fs.readdirSync(dir).sort().join();
    fs.rmSync(dir, { recursive: true, force: true });
    if (r.removed !== 1 || r.bytes !== 1000 || left !== "remotion-webpack-bundle-NEW,something-else") throw new Error(`selftest: ${JSON.stringify(r)} left ${left}`);
    console.log("selftest ok");
  } else {
    const hours = Number(process.argv[2] ?? 6);
    const { removed, bytes } = cleanRemotionBundles(os.tmpdir(), hours);
    console.log(`cleared ${removed} Remotion bundle(s) older than ${hours} h (${(bytes / 1e9).toFixed(2)} GB) from ${os.tmpdir()}`);
  }
}
