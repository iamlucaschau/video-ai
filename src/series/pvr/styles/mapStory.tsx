/**
 * Style E "Map Story" for Poor vs Rich Daily: the reusable kit lives in
 * `Map Story/map-story.tsx` (guide: `Map Story/README.md`). This file only
 * adds the Ep02 town (the client's street with three lots, the poor
 * person's garage, river and lake) and the series' side colours.
 */
import { INK } from "../theme";
import {
  Area,
  Avatar,
  type Cam,
  MapScene as KitScene,
  PALETTE,
  Roof,
  Strip,
  Town,
  Vehicle,
} from "../../../../Map Story/map-story";

export {
  Bubble,
  CENTER,
  IconDot,
  Route,
  Stamp,
  StepTitle,
  Tag,
  TagSteps,
} from "../../../../Map Story/map-story";

export const MAP = PALETTE;
export const STREET_Y = 170;
export const LOT_X = [-310, 0, 310];
export const LOT = { w: 260, h: 300, top: -200 };
export const DEPOT = { x: -1430, y: -2330 };
export const STREET: Cam = { at: -999, x: 0, y: 0, z: 1 };
export const TOWN: Cam = { at: -999, x: -650, y: -1060, z: 0.3 };

const LOT_FILL = "#5C6D4D";

const Ep02Town: React.FC = () => (
  <Town
    vRoads={[-1950, -1300, -650, 650, 1300, 1950]}
    hRoads={[-2830, -2230, -1630, -1030, -430, STREET_Y, 770, 1370]}
    keepClear={(x, y) => x === -650 && y === -430}
  >
    {/* river (top right) and lake (bottom left) swallow the roads */}
    <path
      d="M 900 -6000 C 1000 -3000, 2300 -2300, 2500 -1100 C 2620 -400, 3300 -200, 5000 -300 L 5000 -6000 Z"
      fill={PALETTE.water}
    />
    <ellipse cx={-2500} cy={1650} rx={1100} ry={560} fill={PALETTE.water} />
    {/* the three lots on the client's street */}
    {LOT_X.map((x) => (
      <g key={x}>
        <rect
          x={x - LOT.w / 2}
          y={LOT.top}
          width={LOT.w}
          height={LOT.h}
          rx={14}
          fill={LOT_FILL}
        />
        <Roof x={x} y={LOT.top + 81} />
      </g>
    ))}
    {/* the poor person's garage across town */}
    <Roof x={DEPOT.x} y={DEPOT.y - 5} w={240} h={170} />
  </Town>
);

export const MapScene: React.FC<{
  cams?: Cam[];
  world?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ cams = [STREET], world, children }) => (
  <KitScene cams={cams} base={<Ep02Town />} world={world}>
    {children}
  </KitScene>
);

/** Light lot k in a side colour. */
export const LotMark: React.FC<{
  k: number;
  at: number;
  out?: number;
  side: "poor" | "rich";
  hatch?: boolean;
  dashed?: boolean;
}> = ({ k, side, ...rest }) => (
  <Area
    rect={{ x: LOT_X[k] - LOT.w / 2, y: LOT.top, w: LOT.w, h: LOT.h }}
    color={INK[side]}
    {...rest}
  />
);

const LOOK = {
  poor: { ring: INK.poor, hair: "messy" },
  rich: { ring: INK.rich, hair: "neat" },
  client: { ring: "#ECEFF1", hair: "gray" },
  neighbor: { ring: "#90A4AE", hair: "cap" },
} as const;

export const Face: React.FC<
  Omit<React.ComponentProps<typeof Avatar>, "ring" | "hair"> & {
    kind: keyof typeof LOOK;
  }
> = ({ kind, ...rest }) => <Avatar {...LOOK[kind]} {...rest} />;

/** Highlight a stretch of the client's street. */
export const StreetGlow: React.FC<{
  at: number;
  out?: number;
  x1: number;
  x2: number;
}> = ({ x1, x2, ...rest }) => (
  <Strip rect={{ x: x1, y: STREET_Y - 45, w: x2 - x1, h: 90 }} {...rest} />
);

export const Truck = Vehicle;
