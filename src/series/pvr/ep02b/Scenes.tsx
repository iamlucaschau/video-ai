/**
 * Ep02 style B "Chip Table" — all 8 scenes. Same FINAL script, same VO: every
 * cue is a VO line id. 1 chip = $6: $60 = 10 chips, cost $18 = 3, $12 = 2.
 */
import { useCurrentFrame } from "remotion";
import { useCues } from "../cues";
import { Icon } from "../ep02/Scene3";
import { INK } from "../theme";
import {
  above,
  Arrow,
  Banner,
  Bubble,
  Card,
  chips,
  chipTop,
  House,
  Mat,
  NEUTRAL,
  Pawn,
  Pill,
  receive,
  Slam,
  Stack,
  Table,
  topChips,
  Value,
} from "../styles/chipTable";

const RED = INK.poor;
const GREEN = INK.rich;

// ================================================================ SCENE 1

export const Scene1: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const cut = at("01", 0.8);
  const W = 130;
  const poor = topChips(chips(10, at("01", 0.15)), 2, (j) => ({
    out: cut + j * 2,
    to: [410, chipTop(j, W)],
  }));
  return (
    <Table>
      <Mat at={at("03")} x1={40} x2={1040} color="#7FA650" />
      <Banner at={0} y={120} size={58}>
        How Poor vs Rich People
        <div style={{ fontSize: 100, lineHeight: 1.05 }}>Give Discounts</div>
      </Banner>

      <Pawn
        x={560}
        color={NEUTRAL}
        s={0.75}
        talk={f >= at("01") && f < at("01", 0.55)}
        mood={f >= cut ? "happy" : "flat"}
        seed={1}
      />
      <Bubble at={at("01", 0.05)} out={at("02", 0.6)} x={560} y={700}>
        Can you do it for less?
      </Bubble>

      <Pawn
        x={120}
        color={RED}
        s={0.75}
        at={at("01")}
        look={1}
        nod={cut}
        seed={2}
      />
      <Pill at={at("01", 0.1)} x={120} y={975} color={RED} size={40}>
        POOR
      </Pill>
      <Stack x={280} chips={poor} w={W} />
      <Stack x={410} chips={receive(2, cut)} w={W} />
      <Value
        x={280}
        y={above(10, W)}
        steps={[
          { at: at("01", 0.3), text: "$60" },
          { at: cut + 6, text: "$48", color: RED },
        ]}
      />

      <Pawn
        x={960}
        color={GREEN}
        s={0.75}
        at={at("02")}
        look={-1}
        mood="happy"
        seed={3}
      />
      <Pill at={at("02", 0.1)} x={960} y={975} color={GREEN} size={40}>
        RICH
      </Pill>
      <Stack x={800} chips={chips(10, at("02", 0.15))} w={W} />
      <Value
        x={800}
        y={above(10, W)}
        steps={[{ at: at("02", 0.3), text: "$60", color: GREEN }]}
      />
      <Pill
        at={at("02", 0.65)}
        x={800}
        y={600}
        color={GREEN}
        size={56}
        sub="for sale"
      >
        20% OFF
      </Pill>

      <Arrow at={at("04")} x1={280} y1={420} x2={280} y2={540} color={RED} />
      <Arrow
        at={at("04", 0.3)}
        x1={800}
        y1={540}
        x2={800}
        y2={420}
        color={GREEN}
      />
    </Table>
  );
};

// ================================================================ SCENE 2

export const Scene2: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const give = at("09", 0.1);
  const stack = topChips(chips(10, at("06"), 2), 2, (j) => ({
    out: give + j * 2,
    to: [500, chipTop(j)],
  }));
  return (
    <Table>
      <House x={900} at={0} s={1} />
      <Pawn
        x={120}
        color={RED}
        at={2}
        look={1}
        nod={at("08")}
        mood={f >= at("12") ? "sad" : f >= at("11") ? "happy" : "flat"}
        seed={2}
      />
      <Pawn
        x={690}
        color={NEUTRAL}
        at={at("06")}
        look={-1}
        talk={f >= at("07") && f < at("08")}
        hops={[at("10"), at("10") + 12]}
        mood={f >= at("10") ? "happy" : "flat"}
        seed={1}
      />
      <Stack x={320} chips={stack} />
      <Stack x={500} chips={receive(2, give)} />
      <Value
        x={320}
        y={800}
        steps={[
          { at: at("06", 0.3), text: "$60", sub: "every 2 weeks" },
          { at: give + 8, text: "$48", sub: "a cut", color: RED },
        ]}
      />
      <Bubble at={at("07")} out={at("09")} x={690} y={860}>
        20% off?
      </Bubble>
      <Bubble at={at("08")} out={at("09", 0.9)} x={120} y={860}>
        Yes!
      </Bubble>

      <Banner at={at("11")} out={at("12") - 1} y={150}>
        Saved the account!
      </Banner>
      <Banner at={at("12")} y={150}>
        They didn&apos;t save a customer.
      </Banner>
      <Banner at={at("13")} y={310} color={RED}>
        They paid one to stay.
      </Banner>
    </Table>
  );
};

// ================================================================ SCENE 3

export const Scene3: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const C1 = 170;
  const C2 = 450;
  const C3 = 720;
  const POOR = 940;
  const slamAt = at("21", 0.55);
  const part2 = at("22");
  const merge = at("29");

  // column 1: $60 − $18 = $42, then cleared for the neighbor
  const col1 = chips(10, at("14", 0.3)).map((c, i) =>
    i >= 7
      ? {
          ...c,
          grey: at("15", 0.4) + (9 - i) * 3,
          out: at("18", 0.2) + (9 - i) * 2,
          to: [300, 330] as [number, number],
          vanish: true,
        }
      : {
          ...c,
          out: part2 + i,
          to: [-200, 900] as [number, number],
          vanish: true,
        },
  );
  // column 2: $48 − $18 = $30, later the $66 tower
  const col2 = topChips(chips(8, at("19")), 3, (j) => ({
    grey: at("19", 0.35) + j * 2,
    out: at("19", 0.75) + j * 2,
    to: [300, 330],
    vanish: true,
  }));
  // column 3: the neighbor, $48 − $12 = $36, flies onto column 2
  const col3 = chips(8, at("25", 0.4)).map((c, i) =>
    i >= 6
      ? {
          ...c,
          grey: at("25", 0.85) + (7 - i) * 3,
          out: at("26", 0.5) + (7 - i) * 2,
          to: [720, 330] as [number, number],
          vanish: true,
        }
      : {
          ...c,
          out: merge + i * 2,
          to: [C2, chipTop(5 + i)] as [number, number],
        },
  );

  return (
    <Table>
      <Banner at={at("14")} out={part2 - 1} y={140} size={60}>
        The math they skip
      </Banner>
      <Card at={at("16")} out={part2 - 2} x={170} y={300}>
        <Icon kind="gas" />
      </Card>
      <Card at={at("16", 0.35)} out={part2 - 2} x={320} y={300}>
        <Icon kind="line" />
      </Card>
      <Card at={at("16", 0.7)} out={part2 - 2} x={470} y={300}>
        <Icon kind="blade" />
      </Card>
      <Card at={at("17")} out={part2 - 2} x={650} y={300}>
        <Icon kind="truck" />
      </Card>
      <Pill at={at("17", 0.3)} out={part2 - 2} x={650} y={450} size={40}>
        $6 driving
      </Pill>

      <Stack x={C1} chips={col1} />
      <Value
        size={46}
        x={C1}
        y={above(10)}
        out={part2}
        steps={[
          { at: at("14", 0.5), text: "$60" },
          { at: at("15", 0.5), text: "$60 − $18" },
          { at: at("18", 0.2) + 20, text: "keep $42" },
        ]}
      />
      <Stack x={C2} chips={[...col2, ...receive(6, merge)]} />
      <Value
        size={46}
        x={C2}
        y={above(11) - 30}
        steps={[
          { at: at("19", 0.1), text: "$48", color: RED },
          { at: at("19", 0.75) + 18, text: "keep $30", color: RED },
          { at: at("28"), text: "$30", sub: "client", color: RED },
          {
            at: merge + 24,
            text: "$66",
            sub: "per visit",
            color: RED,
          },
        ]}
      />
      <Pill at={at("20", 0.3)} out={part2 - 1} x={POOR} y={600} size={44}>
        price −20%
      </Pill>
      <Pill
        at={slamAt + 26}
        out={part2 - 1}
        x={POOR}
        y={700}
        size={44}
        color={RED}
      >
        profit −29%
      </Pill>

      {/* part 2: the neighbor */}
      <Pawn
        x={C1}
        color={NEUTRAL}
        at={part2 + 6}
        cap
        look={1}
        talk={f >= at("23") && f < at("24")}
        seed={4}
      />
      <Bubble at={at("23")} out={at("25")} x={C1} y={860}>
        Me too?
      </Bubble>
      <Stack x={C3} chips={col3} />
      <Pill at={at("25", 0.6)} out={at("27")} x={C3} y={720} size={38}>
        no driving: $12
      </Pill>
      <Value
        size={46}
        x={C3}
        y={above(10)}
        out={merge}
        steps={[
          { at: at("25", 0.5), text: "$48", color: RED },
          { at: at("26"), text: "$48 − $12", color: RED },
          { at: at("27"), text: "$36", color: RED },
          { at: at("28"), text: "$36", sub: "neighbor", color: RED },
        ]}
      />
      <Pawn
        x={POOR}
        color={RED}
        s={0.85}
        look={-1}
        nod={at("24")}
        sweat={f >= at("21")}
        mood={f >= at("21") ? "sad" : "flat"}
        seed={2}
      />
      <Bubble at={at("24")} out={at("25", 0.5)} x={POOR} y={880}>
        Yes.
      </Bubble>

      <Banner at={at("30")} out={at("31") - 1} y={140}>
        The only one who got a raise was{" "}
        <span style={{ color: RED }}>the customer.</span>
      </Banner>
      <Banner at={at("31")} y={140}>
        They lowered the price.
      </Banner>
      <Banner at={at("32")} y={300} color={RED}>
        They never asked for anything back.
      </Banner>
      <Slam at={slamAt} color={RED}>
        −29%
      </Slam>
    </Table>
  );
};

// ================================================================ SCENE 4

export const Scene4: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  return (
    <Table>
      <Pawn
        x={360}
        color={NEUTRAL}
        s={0.95}
        talk={f < at("33", 0.35)}
        look={1}
        seed={1}
      />
      <Bubble at={0} x={420} y={760}>
        Can you do it for less?
      </Bubble>
      <Pawn
        x={780}
        color={GREEN}
        s={0.95}
        at={at("33", 0.3)}
        look={-1}
        mood="happy"
        seed={3}
      />
      <Banner at={at("33", 0.1)} y={200} size={84} color={GREEN}>
        The rich way
      </Banner>
    </Table>
  );
};

// ================================================================ SCENE 5

export const Scene5: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const stack = topChips(chips(10, 0), 2, () => ({
    lift: at("34", 0.4),
    unlift: at("38", 0.3),
  }));
  return (
    <Table>
      <Pawn
        x={120}
        color={GREEN}
        look={1}
        mood="happy"
        talk={f >= at("37") && f < at("38")}
        seed={3}
      />
      <Stack x={330} chips={stack} />
      <Value
        x={330}
        y={above(10) - 60}
        steps={[{ at: 4, text: "$60", color: GREEN }]}
      />
      <Pill
        at={at("34", 0.5)}
        out={at("38", 0.3)}
        x={500}
        y={890}
        size={40}
        color={GREEN}
      >
        20%
      </Pill>

      <Pill at={at("35")} x={300} y={340} size={54} color={GREEN}>
        ① Trade it
      </Pill>
      <House x={720} at={at("35")} dashed />
      <House x={930} at={at("35", 0.3)} dashed />
      <Arrow
        at={at("35", 0.2)}
        out={at("39")}
        x1={470}
        y1={975}
        x2={620}
        y2={1150}
        color={GREEN}
      />
      <Pill at={at("36")} x={360} y={450} size={54} color={GREEN}>
        ② Name the trade
      </Pill>
      <Banner at={at("37")} y={120} size={50} color={GREEN}>
        &quot;Twenty percent off, when two neighbors on your street sign
        up.&quot;
      </Banner>
      <Pill at={at("38", 0.3)} x={360} y={560} size={42}>
        No sign-ups? Still $60.
      </Pill>

      <Pawn
        x={570}
        color={NEUTRAL}
        at={at("39")}
        look={1}
        mood="happy"
        hops={[at("40"), at("40") + 13]}
        talk={f >= at("40") && f < at("40", 0.9)}
        seed={1}
      />
      <Bubble at={at("40", 0.1)} x={600} y={880} size={40}>
        Sign up with me!
      </Bubble>
    </Table>
  );
};

// ================================================================ SCENE 6

export const Scene6: React.FC = () => {
  const { at } = useCues();
  const W = 110;
  const cost = at("46", 0.3);
  const nb = (start: number) =>
    topChips(chips(10, start), 2, (j) => ({ grey: cost + j * 3 }));
  return (
    <Table>
      <Mat at={at("44")} x1={40} x2={1040} color="#5E6870" dashes />
      <Pill at={at("41")} x={540} y={300} size={52} color={GREEN}>
        ③ Two neighbors sign up
      </Pill>
      <House x={170} at={at("41", 0.2)} />
      <House x={540} at={0} roof="#7B5BA6" />
      <House x={910} at={at("41", 0.45)} />
      <Pill at={at("41", 0.35)} x={170} y={1040} size={36} color={GREEN}>
        ✓ SIGNED
      </Pill>
      <Pill at={at("41", 0.6)} x={910} y={1040} size={36} color={GREEN}>
        ✓ SIGNED
      </Pill>
      <Pill at={0} x={540} y={1040} size={36}>
        client
      </Pill>
      <Pill at={at("42")} out={at("44") - 1} x={540} y={430} size={52}>
        Full price
      </Pill>

      <Stack x={355} chips={nb(at("43"))} w={W} />
      <Stack x={725} chips={nb(at("43") + 4)} w={W} />
      {[355, 725].map((x) => (
        <Value
          key={x}
          x={x}
          y={above(10, W) - 30}
          steps={[
            { at: at("43", 0.4), text: "$60", color: GREEN },
            { at: cost + 8, text: "$60", sub: "cost $12", color: GREEN },
          ]}
        />
      ))}
      <Pill at={at("44")} x={540} y={430} size={52}>
        Same street
      </Pill>
      <Card at={at("45")} x={540} y={560} crossAt={at("45", 0.5)}>
        <Icon kind="truck" />
      </Card>
    </Table>
  );
};

// ================================================================ SCENE 7

export const Scene7: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const C1 = 190;
  const C2 = 430;
  const C3 = 670;
  const merge = at("53");

  const col1 = chips(8, at("48", 0.1)).map((c, i) =>
    i >= 5
      ? {
          ...c,
          grey: at("48", 0.5) + (7 - i) * 2,
          out: at("49") + (7 - i) * 2,
          to: [C1, 300] as [number, number],
          vanish: true,
        }
      : {
          ...c,
          out: merge + i * 2,
          to: [C2, chipTop(8 + i)] as [number, number],
        },
  );
  const nb = (start: number, toC2: boolean) =>
    chips(10, start).map((c, i) =>
      i >= 8
        ? {
            ...c,
            grey: at("50", 0.6) + (9 - i) * 2,
            out: at("51") + (9 - i) * 2,
            to: [toC2 ? C2 : C3, 300] as [number, number],
            vanish: true,
          }
        : toC2
          ? c
          : {
              ...c,
              out: merge + 10 + i * 2,
              to: [C2, chipTop(13 + i)] as [number, number],
            },
    );

  return (
    <Table>
      <Pill at={at("47")} x={540} y={300} size={58} color={GREEN}>
        ④ The math
      </Pill>
      <Stack x={C1} chips={col1} />
      <Value
        x={C1}
        y={above(10)}
        out={merge}
        steps={[
          { at: at("48", 0.2), text: "$48" },
          { at: at("48", 0.55), text: "$48 − $18" },
          { at: at("49"), text: "$30", sub: "client", color: GREEN },
        ]}
      />
      <Stack
        x={C2}
        chips={[
          ...nb(at("50", 0.1), true),
          ...receive(5, merge),
          ...receive(8, merge + 10),
        ]}
      />
      <Stack x={C3} chips={nb(at("50", 0.2), false)} />
      {[C2, C3].map((x) => (
        <Value
          key={x}
          x={x}
          y={above(10)}
          out={x === C3 ? merge : undefined}
          steps={[
            { at: at("50", 0.3), text: "$60" },
            { at: at("50", 0.65), text: "$60 − $12" },
            { at: at("51"), text: "$48", sub: "neighbor", color: GREEN },
            ...(x === C2
              ? [
                  {
                    at: merge + 34,
                    text: "$126",
                    sub: "per visit",
                    color: GREEN,
                    y: above(21) - 30,
                  },
                ]
              : []),
          ]}
        />
      ))}
      <Pill
        at={at("52")}
        out={merge}
        x={550}
        y={560}
        size={60}
        color={GREEN}
        sub="both neighbors"
      >
        $96
      </Pill>

      {/* the poor way, for comparison */}
      <Stack x={C1} chips={chips(11, at("54"))} />
      <Value
        x={C1}
        y={above(11) - 30}
        steps={[
          { at: at("54", 0.5), text: "$66", sub: "poor way", color: RED },
        ]}
      />
      <Pill at={at("55")} x={C1} y={540} size={64} color={GREEN}>
        ×2
      </Pill>

      <Pawn
        x={930}
        color={GREEN}
        s={0.85}
        look={-1}
        nod={merge}
        mood="happy"
        talk={f >= at("48") && f < at("48", 0.3)}
        seed={3}
      />
      <Slam at={at("53", 0.45)} color={GREEN}>
        $126
      </Slam>
    </Table>
  );
};

// ================================================================ SCENE 8

export const Scene8: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const W = 130;
  return (
    <Table>
      <div
        style={{
          position: "absolute",
          left: 538,
          width: 4,
          top: 500,
          height: 810,
          background: "rgba(255,248,231,0.25)",
        }}
      />
      {/* left: the poor way */}
      <Pawn x={90} color={RED} s={0.7} mood="sad" look={1} seed={2} />
      <Pawn
        x={250}
        color={NEUTRAL}
        s={0.7}
        cap
        look={-1}
        talk={f >= at("56", 0.5) && f < at("56", 0.75)}
        seed={4}
      />
      <Bubble at={at("56", 0.5)} out={at("58")} x={250} y={940} size={38}>
        Me too?
      </Bubble>
      <Stack x={430} chips={chips(11, 0)} w={W} />
      <Value
        x={430}
        y={above(11, W)}
        steps={[{ at: at("56", 0.1), text: "$66", color: RED }]}
      />

      {/* right: the rich way */}
      <Stack x={640} chips={chips(21, at("57"))} w={W} />
      <Value
        x={640}
        y={above(21, W)}
        steps={[{ at: at("57", 0.3), text: "$126", color: GREEN }]}
      />
      <Pawn x={780} color={GREEN} s={0.6} mood="happy" look={1} seed={3} />
      <Pawn
        x={900}
        color={NEUTRAL}
        s={0.6}
        cap
        at={at("57", 0.4)}
        mood="happy"
        seed={5}
      />
      <Pawn
        x={1015}
        color={NEUTRAL}
        s={0.6}
        cap
        at={at("57", 0.55)}
        mood="happy"
        seed={6}
      />
      <Pill at={at("57", 0.7)} x={958} y={1030} size={34} color={GREEN}>
        $60 · $60
      </Pill>

      <Banner at={at("56")} out={at("58") - 1} y={110} size={48} color={RED}>
        One person gave a discount and got a neighbor asking for one too.
      </Banner>
      <Banner at={at("57")} out={at("58") - 1} y={275} size={48} color={GREEN}>
        The other sold a discount and got two neighbors at full price.
      </Banner>
      <Banner at={at("58")} out={at("60") - 1} y={130} size={64} color={RED}>
        Poor people give discounts.
      </Banner>
      <Banner at={at("59")} out={at("60") - 1} y={280} size={64} color={GREEN}>
        Rich people sell them.
      </Banner>
      <Banner at={at("60")} y={130} size={84}>
        Same lawn.
      </Banner>
      <Banner at={at("61")} y={290} size={84}>
        Opposite answer.
      </Banner>
    </Table>
  );
};
