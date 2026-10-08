/**
 * Ep02 "Give Discounts" in style E "Map Story". Same FINAL script and VO;
 * every cue is a VO line id. Built to the 2026-10-08 short-form rules:
 * all info inside the safe zone, one camera flight (to the garage and back,
 * line 17–18), keyword/number tags only (≤ 5 words, ≤ 2 at once), real SFX.
 */
import { useCurrentFrame } from "remotion";
import { useCues } from "../cues";
import { Icon } from "../ep02/Scene3";
import { Sfx } from "../sfx";
import { CoinRun, Floater } from "../styles/streetSim";
import {
  Bubble,
  CENTER,
  DEPOT,
  Face,
  IconDot,
  LOT_X,
  LotMark,
  MapScene,
  MAP,
  Route,
  Stamp,
  StepTitle,
  STREET,
  STREET_Y,
  StreetGlow,
  Tag,
  TagSteps,
  TOWN,
  Truck,
} from "../styles/mapStory";
import { INK } from "../theme";

const RED = INK.poor;
const GREEN = INK.rich;
const SLATE = "#263238";

const SFX = {
  whoosh: "sfx/whoosh/clean-whoosh-382726.mp3",
  click: "sfx/click/digital-click-357350.mp3",
  hit: "sfx/deephit/cinematic-low-hit-291095.mp3",
  thud: "sfx/deephit/impact-thud-291047.mp3",
};

/** World anchors. */
const TAG_Y = -215; // above a lot
const HEAD_Y = -50; // above a face in a lot
const YARD_Y = 25; // face in a front yard
const POOR_X = -170;
const RICH_X = 170;
const STAMP = { wx: 0, wy: -400 };
/** Screen point of a world point under the street camera (for screen-space effects). */
const onStreet = (wx: number, wy: number): [number, number] => [
  CENTER.x + wx,
  CENTER.y + wy,
];

const useWindow = () => {
  const f = useCurrentFrame();
  return (a: number, b: number) => f >= a && f < b;
};

// ================================================================ SCENE 1

export const Scene1: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const during = useWindow();
  const cut = at("01", 0.8);
  return (
    <MapScene
      world={
        <>
          <LotMark k={1} at={at("03")} side="poor" dashed />
          <Face
            x={0}
            y={YARD_Y}
            kind="client"
            talk={during(at("01"), at("01", 0.5))}
            mood={f >= cut ? "happy" : "flat"}
          />
          <Face x={POOR_X} y={STREET_Y} kind="poor" at={at("01", 0.1)} />
          <Face
            x={RICH_X}
            y={STREET_Y}
            kind="rich"
            at={at("02")}
            mood="happy"
          />
        </>
      }
    >
      <StepTitle at={0} out={at("01", 0.3)} color={SLATE}>
        Give Discounts
      </StepTitle>
      <Tag at={4} out={at("01", 0.3)} wx={0} wy={TAG_Y} color={SLATE}>
        POOR vs RICH
      </Tag>
      <Bubble at={at("01", 0.3)} out={at("02", 0.5)} wx={0} wy={HEAD_Y}>
        For less?
      </Bubble>
      <TagSteps
        wx={0}
        wy={TAG_Y}
        out={at("02", 0.4)}
        steps={[
          { at: at("01", 0.45), text: "$60", color: SLATE },
          { at: cut, text: "$48", color: RED },
        ]}
      />
      <Tag
        at={at("02", 0.6)}
        out={at("03")}
        wx={RICH_X}
        wy={STREET_Y - 80}
        color={GREEN}
      >
        20% OFF · for sale
      </Tag>
      <Tag at={at("04")} wx={POOR_X} wy={STREET_Y - 80} color={RED}>
        ↓
      </Tag>
      <Tag at={at("04", 0.3)} wx={RICH_X} wy={STREET_Y - 80} color={GREEN}>
        ↑
      </Tag>
      <Sfx file={SFX.click} at={cut} />
    </MapScene>
  );
};

// ================================================================ SCENE 2

export const Scene2: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const during = useWindow();
  const [lx, ly] = onStreet(0, 0);
  return (
    <MapScene
      world={
        <>
          <LotMark k={1} at={at("09", 0.3)} side="poor" hatch={f >= at("13")} />
          <Face
            x={0}
            y={YARD_Y}
            kind="client"
            talk={during(at("07"), at("08"))}
            mood={f >= at("10") ? "happy" : "flat"}
          />
          <Face
            x={POOR_X}
            y={STREET_Y}
            kind="poor"
            talk={during(at("08"), at("08", 0.9))}
            mood={f >= at("12") ? "sad" : f >= at("11") ? "happy" : "flat"}
          />
        </>
      }
    >
      <TagSteps
        wx={0}
        wy={TAG_Y}
        steps={[
          { at: at("06"), text: "$60 / cut", color: SLATE },
          { at: at("09", 0.3), text: "$48 / cut", color: RED },
        ]}
      />
      <Bubble at={at("07")} out={at("08", 0.9)} wx={0} wy={HEAD_Y}>
        20% off?
      </Bubble>
      <Bubble at={at("08")} out={at("09", 0.8)} wx={POOR_X} wy={STREET_Y - 80}>
        Yes.
      </Bubble>
      <Floater at={at("09", 0.35)} x={lx + 170} y={ly - 120} color={RED}>
        −20%
      </Floater>
      <Stamp at={at("13")} {...STAMP} color={RED}>
        paid to stay
      </Stamp>
      <Sfx file={SFX.click} at={at("09", 0.3)} />
      <Sfx file={SFX.thud} at={at("13")} />
    </MapScene>
  );
};

// ================================================================ SCENE 3

const DRIVE: [number, number][] = [
  [DEPOT.x + 130, DEPOT.y],
  [-1300, DEPOT.y],
  [-1300, STREET_Y],
  [-60, STREET_Y],
];

export const Scene3: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const during = useWindow();
  const fly = at("17");
  const back = at("18");
  const lots = [0, 1, 2].map((k) => onStreet(LOT_X[k], -50));
  return (
    <MapScene
      cams={[STREET, { ...TOWN, at: fly }, { ...STREET, at: back }]}
      world={
        <>
          <LotMark k={1} at={-999} side="poor" />
          <LotMark k={1} at={at("28")} side="poor" hatch />
          <LotMark k={2} at={at("28", 0.2)} side="poor" hatch />
          <Route
            at={at("17", 0.3)}
            out={back + 20}
            pts={DRIVE}
            color={RED}
            width={34}
            dur={34}
          />
          {f < back && (
            <Truck
              at={at("17", 0.3)}
              pts={DRIVE}
              dur={34}
              color={RED}
              scale={2.4}
            />
          )}
          <Route
            at={at("25", 0.2)}
            pts={[
              [70, STREET_Y],
              [250, STREET_Y],
            ]}
            color={MAP.white}
            width={12}
            dur={14}
          />
          <Face
            x={0}
            y={YARD_Y}
            kind="client"
            mood={f >= at("30") ? "happy" : "flat"}
          />
          <Face
            x={310}
            y={YARD_Y}
            kind="neighbor"
            at={at("22", 0.3)}
            talk={during(at("23"), at("24"))}
          />
          <Face
            x={POOR_X}
            y={STREET_Y}
            kind="poor"
            talk={during(at("24"), at("24", 0.9))}
            mood={f >= at("21") ? "sad" : "flat"}
          />
        </>
      }
    >
      <StepTitle at={at("14")} out={at("16")} color={RED}>
        The math
      </StepTitle>
      <TagSteps
        wx={0}
        wy={TAG_Y}
        out={at("29")}
        steps={[
          { at: at("15", 0.3), text: "−$18 / cut", color: RED },
          { at: at("18", 0.4), text: "keep $42", color: SLATE },
          { at: at("19", 0.4), text: "keep $30", color: RED },
        ]}
      />
      {(["gas", "line", "blade"] as const).map((k, i) => (
        <IconDot
          key={k}
          at={at("16", i * 0.3)}
          out={fly}
          wx={-200 + i * 200}
          wy={-400}
        >
          <Icon kind={k} />
        </IconDot>
      ))}
      <Tag at={at("17", 0.6)} out={back} wx={-1300} wy={-900} color={RED}>
        $6 driving
      </Tag>
      <Tag
        at={at("20", 0.3)}
        out={at("21", 0.5)}
        wx={POOR_X}
        wy={STREET_Y - 80}
        color={SLATE}
      >
        price −20%
      </Tag>
      <Stamp at={at("21", 0.55)} out={at("22")} {...STAMP} color={RED}>
        profit −29%
      </Stamp>
      <Bubble at={at("23")} out={at("25")} wx={310} wy={HEAD_Y}>
        Me too?
      </Bubble>
      <Bubble at={at("24")} out={at("25", 0.5)} wx={POOR_X} wy={STREET_Y - 80}>
        Yes.
      </Bubble>
      <TagSteps
        wx={310}
        wy={TAG_Y}
        out={at("29")}
        steps={[
          { at: at("25", 0.6), text: "−$12", color: RED },
          { at: at("26"), text: "$48 − $12", color: RED },
          { at: at("27"), text: "keep $36", color: RED },
        ]}
      />
      <Stamp at={at("29", 0.15)} out={at("30")} {...STAMP} color={RED}>
        $66 / visit
      </Stamp>
      <CoinRun
        at={at("29")}
        from={[lots[1], lots[2]]}
        to={onStreet(STAMP.wx, STAMP.wy)}
      />
      <Tag
        at={at("30", 0.4)}
        wx={0}
        wy={TAG_Y}
        color={MAP.white}
        text={MAP.ink}
      >
        customer ↑
      </Tag>
      <Stamp at={at("32", 0.2)} {...STAMP} color={RED}>
        nothing back
      </Stamp>
      <Sfx file={SFX.whoosh} at={fly - 6} />
      <Sfx file={SFX.whoosh} at={back - 6} />
      <Sfx file={SFX.hit} at={at("21", 0.55)} />
      <Sfx file={SFX.hit} at={at("29", 0.15)} />
    </MapScene>
  );
};

// ================================================================ SCENE 4

export const Scene4: React.FC = () => {
  const { at } = useCues();
  return (
    <MapScene
      world={
        <>
          <Face x={0} y={YARD_Y} kind="client" talk />
          <Face
            x={RICH_X}
            y={STREET_Y}
            kind="rich"
            at={at("33", 0.3)}
            mood="happy"
          />
        </>
      }
    >
      <StepTitle at={at("33", 0.1)} color={GREEN}>
        The rich way
      </StepTitle>
      <Bubble at={0} wx={0} wy={HEAD_Y}>
        For less?
      </Bubble>
    </MapScene>
  );
};

// ================================================================ SCENE 5

export const Scene5: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const during = useWindow();
  const walk = Math.min(
    1,
    Math.max(0, (f - at("39")) / (at("40", 0.5) - at("39"))),
  );
  const cx = -230 * walk;
  const cy = YARD_Y + (STREET_Y - YARD_Y) * Math.min(1, walk * 3);
  return (
    <MapScene
      world={
        <>
          <LotMark k={0} at={at("35", 0.2)} side="rich" dashed />
          <LotMark k={2} at={at("35", 0.4)} side="rich" dashed />
          <Route
            at={at("39", 0.1)}
            pts={[
              [0, STREET_Y],
              [-230, STREET_Y],
            ]}
            color={MAP.white}
            width={12}
            dur={20}
          />
          <Face
            x={cx}
            y={cy}
            kind="client"
            mood={f >= at("39") ? "happy" : "flat"}
            talk={during(at("40", 0.2), at("40", 0.9))}
          />
          <Face
            x={RICH_X}
            y={STREET_Y}
            kind="rich"
            mood="happy"
            talk={during(at("37"), at("38", 0.9))}
          />
        </>
      }
    >
      <StepTitle at={at("34", 0.5)} out={at("36")} n={1} color={GREEN}>
        Trade it
      </StepTitle>
      <StepTitle at={at("36")} n={2} color={GREEN}>
        Name the trade
      </StepTitle>
      <Tag
        at={at("34", 0.3)}
        out={at("37")}
        wx={RICH_X}
        wy={STREET_Y - 80}
        color={GREEN}
      >
        20% OFF
      </Tag>
      <TagSteps
        wx={0}
        wy={TAG_Y}
        out={at("39")}
        steps={[
          { at: at("37", 0.1), text: "20% = 2 neighbors", color: GREEN },
          { at: at("38", 0.25), text: "else $60", color: SLATE },
        ]}
      />
      <Bubble at={at("40", 0.2)} wx={-230} wy={STREET_Y - 80}>
        Sign up!
      </Bubble>
      <Sfx file={SFX.click} at={at("37", 0.1)} />
    </MapScene>
  );
};

// ================================================================ SCENE 6

export const Scene6: React.FC = () => {
  const { at } = useCues();
  return (
    <MapScene
      world={
        <>
          <LotMark k={0} at={at("41", 0.2)} side="rich" />
          <LotMark k={2} at={at("41", 0.4)} side="rich" />
          <StreetGlow at={at("44")} x1={-440} x2={440} />
          <Route
            at={at("45", 0.1)}
            pts={[
              [-300, STREET_Y - 10],
              [300, STREET_Y - 10],
            ]}
            color={MAP.white}
            width={12}
            dur={20}
          />
          <Face x={0} y={YARD_Y} kind="client" mood="happy" />
          <Face
            x={-310}
            y={YARD_Y}
            kind="neighbor"
            at={at("41", 0.3)}
            mood="happy"
          />
          <Face
            x={310}
            y={YARD_Y}
            kind="neighbor"
            at={at("41", 0.5)}
            mood="happy"
          />
          <Face x={RICH_X} y={STREET_Y + 120} kind="rich" mood="happy" />
        </>
      }
    >
      <StepTitle at={at("41")} out={at("42", 0.8)} n={3} color={GREEN}>
        Two sign up
      </StepTitle>
      {[-310, 310].map((x) => (
        <TagSteps
          key={x}
          wx={x}
          wy={TAG_Y}
          steps={[
            { at: at("43"), text: "$60", color: GREEN },
            { at: at("46", 0.3), text: "cost $12", color: SLATE },
          ]}
        />
      ))}
      <IconDot at={at("45")} wx={0} wy={-400} cross={at("45", 0.5)}>
        <Icon kind="truck" />
      </IconDot>
      <Sfx file={SFX.click} at={at("43")} />
    </MapScene>
  );
};

// ================================================================ SCENE 7

export const Scene7: React.FC = () => {
  const { at } = useCues();
  const merge = at("53");
  const lots = [0, 1, 2].map((k) => onStreet(LOT_X[k], -50));
  return (
    <MapScene
      world={
        <>
          {[0, 1, 2].map((k) => (
            <LotMark key={k} k={k} at={-999} side="rich" />
          ))}
          {[0, 1, 2].map((k) => (
            <LotMark key={`h${k}`} k={k} at={merge + k * 2} side="rich" hatch />
          ))}
          <StreetGlow at={at("54")} x1={-440} x2={440} />
          <Face x={0} y={YARD_Y} kind="client" mood="happy" />
          <Face x={-310} y={YARD_Y} kind="neighbor" mood="happy" />
          <Face x={310} y={YARD_Y} kind="neighbor" mood="happy" />
          <Face x={RICH_X} y={STREET_Y + 120} kind="rich" mood="happy" />
        </>
      }
    >
      <StepTitle at={at("47")} out={at("48", 0.6)} n={4} color={GREEN}>
        The math
      </StepTitle>
      <TagSteps
        wx={0}
        wy={TAG_Y}
        out={at("50")}
        steps={[
          { at: at("48", 0.3), text: "$48 − $18", color: SLATE },
          { at: at("49"), text: "$30", color: GREEN },
        ]}
      />
      {[-310, 310].map((x) => (
        <TagSteps
          key={x}
          wx={x}
          wy={TAG_Y}
          out={at("52")}
          steps={[
            { at: at("50", 0.4), text: "$60 − $12", color: SLATE },
            { at: at("51"), text: "$48", color: GREEN },
          ]}
        />
      ))}
      <Tag at={at("52")} out={merge} wx={0} wy={TAG_Y} color={GREEN}>
        $96 · both
      </Tag>
      <Stamp at={at("53", 0.4)} {...STAMP} color={GREEN}>
        $126 / visit
      </Stamp>
      <CoinRun at={merge} from={lots} to={onStreet(STAMP.wx, STAMP.wy)} />
      <Tag at={at("55")} wx={0} wy={TAG_Y - 30} color={RED}>
        vs $66
      </Tag>
      <Sfx file={SFX.hit} at={at("53", 0.4)} />
    </MapScene>
  );
};

// ================================================================ SCENE 8

export const Scene8: React.FC = () => {
  const { at } = useCues();
  const rich = at("57");
  return (
    <MapScene
      world={
        <>
          <LotMark k={1} at={at("56")} out={rich} side="poor" hatch />
          <LotMark k={2} at={at("56", 0.15)} out={rich} side="poor" hatch />
          {[0, 1, 2].map((k) => (
            <LotMark key={k} k={k} at={rich + k * 3} side="rich" hatch />
          ))}
          <LotMark k={1} at={at("60")} side="poor" dashed />
          <Face x={0} y={YARD_Y} kind="client" mood="happy" />
          <Face
            x={POOR_X}
            y={STREET_Y}
            kind="poor"
            at={at("56")}
            out={rich}
            mood="sad"
          />
          <Face x={RICH_X} y={STREET_Y} kind="rich" at={rich} mood="happy" />
        </>
      }
    >
      <Tag at={at("56", 0.2)} out={rich} wx={0} wy={TAG_Y} color={RED}>
        $66
      </Tag>
      <Tag at={rich + 4} out={at("58")} wx={0} wy={TAG_Y} color={GREEN}>
        $126
      </Tag>
      <Stamp at={at("58")} wx={-200} wy={-400} color={RED}>
        GIVE
      </Stamp>
      <Stamp at={at("59")} wx={200} wy={-400} color={GREEN}>
        SELL
      </Stamp>
      <Sfx file={SFX.thud} at={at("58")} />
      <Sfx file={SFX.thud} at={at("59")} />
    </MapScene>
  );
};
