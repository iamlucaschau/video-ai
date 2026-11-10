/**
 * Coastline paths for "How an Aircraft Carrier Defends Itself" (Formats/Naval Board/episodes/ep01-carrier): Natural Earth land (world-atlas 50m),
 * projected with d3-geo onto the 1920×1080 canvas. Writes src/compositions/Carrier/maps.json.
 *   node scripts/carrier-maps.mjs
 */
import fs from "node:fs";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/land-50m.json", "utf8"));
const land = feature(topo, topo.objects.land);
const topo10 = JSON.parse(fs.readFileSync("node_modules/world-atlas/land-10m.json", "utf8"));
const land10 = feature(topo10, topo10.objects.land); // finer coast for the strait close-up
const MAPS = {
  redsea: { box: [[32, 11.2], [45.5, 29.2]], pts: { gravely: [41.0, 15.6], ike: [38.6, 20.6], hodeidah: [42.95, 14.8], sanaa: [44.2, 15.35] } },
  blacksea: { box: [[27, 40.6], [42, 47.4]], pts: { moskva: [30.9, 45.2], odesa: [30.73, 46.48], sevastopol: [33.52, 44.6] } },
  strait: { box: [[41.6, 10.9], [45.4, 14.3]], pts: { perim: [43.42, 12.65], center: [43.38, 12.6] } },
};
const out = {};
for (const [k, m] of Object.entries(MAPS)) {
  const corners = { type: "MultiPoint", coordinates: [m.box[0], m.box[1]] };
  const proj = geoMercator().fitExtent([[0, 0], [1920, 1080]], corners);
  proj.clipExtent([[-400, -400], [2320, 1480]]);
  const d = geoPath(proj).digits(1)(land);
  const pts = Object.fromEntries(Object.entries(m.pts).map(([n, ll]) => [n, proj(ll).map((v) => Math.round(v))]));
  // km per px at the map centre (for distance bars)
  const c = [(m.box[0][0] + m.box[1][0]) / 2, (m.box[0][1] + m.box[1][1]) / 2];
  const a = proj(c), b = proj([c[0] + 1, c[1]]);
  const kmPerPx = (111.32 * Math.cos((c[1] * Math.PI) / 180)) / Math.hypot(b[0] - a[0], b[1] - a[1]);
  out[k] = { d, pts, kmPerPx: +kmPerPx.toFixed(4) };
  console.log(k, "path chars", d.length, "km/px", kmPerPx.toFixed(3), pts);
}
fs.writeFileSync("src/compositions/Carrier/maps.json", JSON.stringify(out));
