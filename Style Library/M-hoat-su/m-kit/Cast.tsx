/**
 * Style M cast prototype (Lucas 2026-11-04: "nhân vật chưa đa dạng và 3d như họ"): the current stick body (top row)
 * against the opt-in chunky body (Look.body "chunky": sleeves, trousers, boots, belt, cel shading, blush) with varied
 * builds (girth), facial hair and helmet shading. One still: `npx remotion still Style-M-HoatSu-Cast out/cast.png`.
 */
import { AbsoluteFill } from "remotion";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { basePose, Hero, LOOKS, type Look, type Pose } from "../../toon-engine/rig";
import { HAND, M } from "../hoat-su";
import { Brodie, M1Helmet, MedicKit, Specs, Stahl, TROOPS } from "../ww2";

const BOOT = "#3E2E26";
const chunky = (l: Look, extra: Partial<Look>): Look => ({ ...l, body: "chunky", skin: "#FBF8F2", hand: "#FBF8F2", skinShade: "#DCD6CE", shoe: BOOT, ...extra });

type Hat = "m1" | "medic" | "brodie" | "stahl" | "specs" | null;
type Who = { look: Look; hat: Hat; kit?: boolean; p: Partial<Pose>; label: string };
const ROWS: { title: string; y: number; cast: Who[] }[] = [
  {
    title: "Trước (thân que)",
    y: 560,
    cast: [
      { look: { ...TROOPS.gi, body: "stick" }, hat: "medic", kit: true, p: { expr: "happy" }, label: "lính cứu thương" },
      { look: { ...TROOPS.tommy, body: "stick" }, hat: "brodie", p: { expr: "smug" }, label: "trung sĩ Anh" },
      { look: { ...TROOPS.landser, body: "stick" }, hat: "stahl", p: { expr: "neutral" }, label: "lính Đức" },
    ],
  },
  {
    title: "Mới: thân dày, đổ bóng khối",
    y: 1110,
    cast: [
      { look: chunky(TROOPS.gi, { girth: 0.95 }), hat: "medic", kit: true, p: { expr: "happy" }, label: "lính cứu thương" },
      { look: chunky(TROOPS.tommy, { girth: 1.32, facial: "handlebar", hair: "#6A4630" }), hat: "brodie", p: { expr: "smug", scale: 0.92 }, label: "trung sĩ to con" },
      { look: chunky(TROOPS.landser, { girth: 0.86, facial: "stubble" }), hat: "stahl", p: { expr: "worried", scale: 1.04 }, label: "lính gầy, râu lún phún" },
    ],
  },
  {
    title: "Mới: đa dạng dáng, râu, tóc",
    y: 1660,
    cast: [
      { look: chunky(TROOPS.suitGrey, { girth: 1.22, facial: "beard", hair: "#B9B2A8" }), hat: "specs", p: { expr: "neutral" }, label: "tướng già" },
      { look: chunky(TROOPS.gi, { girth: 1.05, facial: "mustache", hair: "#3A2A20" }), hat: "m1", p: { expr: "shock" }, label: "lính Mỹ" },
      { look: chunky(LOOKS.mom, { girth: 0.92, pants: "#5A4A6A", line: M.ink, face: M.ink, head: "bean" }), hat: null, p: { expr: "happy", scale: 0.86 }, label: "y tá hậu phương" },
    ],
  },
];

const S = 0.82;
export const MCast: React.FC = () => (
  <AbsoluteFill style={{ background: "#E9DFCB" }}>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <KitDefs />
      <SetDefs />
      {ROWS.map((row) => (
        <g key={row.title}>
          <text x={540} y={row.y - 400} textAnchor="middle" fontFamily={HAND} fontWeight={800} fontSize={44} fill={M.ink}>
            {row.title}
          </text>
          {row.cast.map((w, i) => {
            const pose: Pose = { ...basePose, x: 200 + i * 340, y: row.y - 120, yaw: 0.25, ...w.p, scale: (w.p.scale ?? 1) * S };
            return (
              <g key={i}>
                <Hero look={w.look} pose={pose} rimId="rimR" />
                {w.kit ? <MedicKit pose={pose} /> : null}
                {w.hat === "m1" || w.hat === "medic" ? <M1Helmet pose={pose} medic={w.hat === "medic"} cel={w.look.body === "chunky"} /> : null}
                {w.hat === "brodie" ? <Brodie pose={pose} cel={w.look.body === "chunky"} /> : null}
                {w.hat === "stahl" ? <Stahl pose={pose} cel={w.look.body === "chunky"} /> : null}
                {w.hat === "specs" ? <Specs pose={pose} /> : null}
                <text x={pose.x} y={row.y + 60} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill={M.ink} opacity={0.75}>
                  {w.label}
                </text>
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
