/**
 * Coastline paths for "How Submarines Actually Fight" (Formats/Naval Board/episodes/ep02-submarines): Natural Earth land (world-atlas 50m),
 * projected with d3-geo onto the 1920×1080 canvas. Writes src/compositions/Submarines/maps.json.
 *   node scripts/submarine-maps.mjs
 */
import fs from "node:fs";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const topo = JSON.parse(fs.readFileSync("node_modules/world-atlas/land-50m.json", "utf8"));
const land = feature(topo, topo.objects.land);
const MAPS = {
  atlantic: { box: [[-90, 5], [-30, 55]], pts: { nova: [-63, 44.6], barbados: [-59.5, 13.1], mid: [-66, 30] } },
  northsea: { box: [[-4, 56.5], [13, 63]], pts: { fedje: [4.7, 60.8], bergen: [5.32, 60.39] } },
  oahu: { box: [[-160, 19.8], [-156, 22.4]], pts: { site: [-157.83, 21.1], oahu: [-158, 21.45] } },
  southatl: { box: [[-75, -60], [-45, -38]], pts: { belgrano: [-61.6, -55.4], falklands: [-59, -51.7] } },
  srilanka: { box: [[70, 1], [90, 12]], pts: { dena: [79.87, 6.0], galle: [80.22, 6.05] } },
  blacksea: { box: [[27, 40.6], [42, 47.4]], pts: { novo: [37.8, 44.72] } },
  indopac: { box: [[95, -5], [150, 30]], pts: { boat: [116, 14] } },
  natl: { box: [[-45, 25], [5, 58]], pts: { a: [-27, 42] } },
};
const out = {};
for (const [k, m] of Object.entries(MAPS)) {
  const corners = { type: "MultiPoint", coordinates: [m.box[0], m.box[1]] };
  const proj = geoMercator().fitExtent([[0, 0], [1920, 1080]], corners);
  proj.clipExtent([[-400, -400], [2320, 1480]]);
  const d = geoPath(proj).digits(1)(land);
  const pts = Object.fromEntries(Object.entries(m.pts).map(([n, ll]) => [n, proj(ll).map((v) => Math.round(v))]));
  out[k] = { d, pts };
  console.log(k, "path chars", d.length, pts);
}
fs.mkdirSync("src/compositions/Submarines", { recursive: true });
fs.writeFileSync("src/compositions/Submarines/maps.json", JSON.stringify(out));
