/**
 * Ep02 style C "Street Sim" — all 8 scenes. Same FINAL script and VO; every
 * cue is a VO line id. Lot 1 = the client, lots 0 and 2 = the neighbors.
 */
import { useCues } from "../cues";
import { Icon } from "../ep02/Scene3";
import {
  Arrow,
  Banner,
  Bubble,
  Card,
  INKD,
  Pill,
  Slam,
  Value,
} from "../styles/chipTable";
import { INK } from "../theme";
import {
  CoinRun,
  Field,
  Floater,
  Hud,
  LAWN,
  P,
  Quests,
  Route,
  Street,
  TAG,
  Truck,
} from "../styles/streetSim";

const RED = INK.poor;
const GREEN = INK.rich;
/** Red truck parks behind lot 0/1, green one in the near lane. */
const PARK = -0.6;
const truckXY = (rich?: boolean) => P(PARK + 0.6, rich ? -0.6 : -1.25, 70);

const useQuests = () => {
  const { at } = useCues();
  return [
    { at: at("35"), done: at("36"), text: "Trade it" },
    { at: at("36"), done: at("37", 0.95), text: "Name the trade" },
    { at: at("41"), done: at("41", 0.9), text: "Two neighbors sign up" },
    { at: at("47"), done: at("53", 0.6), text: "Do the math" },
  ];
};

// ================================================================ SCENE 1

export const Scene1: React.FC = () => {
  const { at } = useCues();
  const [tx, ty] = TAG(1);
  return (
    <Field>
      <Street
        houseAt={[4, 0, 8]}
        mow={{ 1: [at("03"), 24] }}
        mower={[{ k: 1, mow: [at("03"), 24] }]}
        behind={
          <>
            <Truck at={at("01")} from={-10} to={1.0} />
            <Truck rich at={at("02")} from={-10} to={5.2} />
          </>
        }
      />
      <Banner at={0} y={120} size={58}>
        How Poor vs Rich People
        <div style={{ fontSize: 100, lineHeight: 1.05 }}>Give Discounts</div>
      </Banner>
      <Bubble at={at("01", 0.05)} out={at("02", 0.6)} x={tx} y={ty - 120}>
        Can you do it for less?
      </Bubble>
      <Value
        x={tx}
        y={ty}
        steps={[
          { at: at("01", 0.3), text: "$60" },
          { at: at("01", 0.8), text: "$48", color: RED },
        ]}
      />
      <Floater at={at("01", 0.8)} x={LAWN(1)[0]} y={LAWN(1)[1]} color={RED}>
        −20%
      </Floater>
      <Pill
        at={at("02", 0.65)}
        x={880}
        y={700}
        color={GREEN}
        size={54}
        sub="for sale"
      >
        20% OFF
      </Pill>
      <Pill at={at("04")} x={300} y={420} color={RED} size={60}>
        POOR ↓
      </Pill>
      <Pill at={at("04", 0.3)} x={780} y={420} color={GREEN} size={60}>
        RICH ↑
      </Pill>
    </Field>
  );
};

// ================================================================ SCENE 2

export const Scene2: React.FC = () => {
  const { at } = useCues();
  const [tx, ty] = TAG(1);
  const [bx, by] = truckXY();
  const [lx, ly] = LAWN(1);
  return (
    <Field>
      <Street
        mow={{ 1: [at("05"), 40] }}
        mower={[{ k: 1, mow: [at("05"), 40] }]}
        behind={<Truck to={PARK} />}
      />
      <Hud
        badge="POOR"
        color={RED}
        title="LAWN CARE"
        steps={[
          { at: at("06", 0.3), label: "PRICE / CUT", value: 60 },
          { at: at("09", 0.3), label: "PRICE / CUT", value: 48, color: RED },
        ]}
      />
      <Value
        x={tx}
        y={ty}
        steps={[
          { at: at("06"), text: "$60", sub: "every 2 weeks" },
          { at: at("09", 0.3), text: "$48", sub: "a cut", color: RED },
        ]}
      />
      <Bubble at={at("07")} out={at("09")} x={tx} y={ty - 120}>
        20% off?
      </Bubble>
      <Bubble at={at("08")} out={at("09", 0.9)} x={bx} y={by - 110}>
        Yes!
      </Bubble>
      <Floater at={at("09", 0.3)} x={lx} y={ly} color={RED}>
        −20%
      </Floater>
      <Floater at={at("10")} x={tx - 60} y={ty - 20} color="#E91E63" size={70}>
        ♥
      </Floater>
      <Floater
        at={at("10") + 8}
        x={tx + 60}
        y={ty - 40}
        color="#E91E63"
        size={60}
      >
        ♥
      </Floater>
      <Banner at={at("11")} out={at("12") - 1} y={330}>
        Saved the account!
      </Banner>
      <Banner at={at("12")} y={330}>
        They didn&apos;t save a customer.
      </Banner>
      <Banner at={at("13")} y={450} color={RED}>
        They paid one to stay.
      </Banner>
    </Field>
  );
};

// ================================================================ SCENE 3

export const Scene3: React.FC = () => {
  const { at } = useCues();
  const [t1x, t1y] = TAG(1);
  const [t2x, t2y] = TAG(2);
  const [l1x, l1y] = LAWN(1);
  const [l2x, l2y] = LAWN(2);
  const [bx, by] = truckXY();
  const slamAt = at("21", 0.55);
  return (
    <Field>
      <Street
        mowed={[]}
        mow={{ 1: [at("28"), 30], 2: [at("28") + 8, 30] }}
        mower={[
          { k: 1, mow: [at("28"), 30] },
          { k: 2, mow: [at("28") + 8, 30] },
        ]}
        behind={
          <>
            <Route
              at={at("17")}
              path={[
                [-12, -1.25],
                [PARK, -1.25],
              ]}
              color={RED}
            />
            <Truck to={PARK} />
          </>
        }
        front={
          <Route
            at={at("25", 0.2)}
            path={[
              [4.6, 2.2],
              [7.6, 2.2],
            ]}
            color={INKD}
          />
        }
      />
      <Hud
        badge="POOR"
        color={RED}
        title="THE MATH THEY SKIP"
        steps={[
          { at: at("15", 0.3), label: "COST / CUT", value: 18 },
          { at: at("18", 0.4), label: "KEEP AT $60", value: 42 },
          { at: at("19", 0.4), label: "KEEP AT $48", value: 30, color: RED },
          {
            at: at("29", 0.3),
            label: "PER VISIT · 2 LAWNS",
            value: 66,
            color: RED,
          },
        ]}
      />
      <Banner at={at("14")} out={at("16") - 1} y={330}>
        The math they skip
      </Banner>
      <Floater at={at("15", 0.3)} x={l1x} y={l1y} color={RED}>
        −$18
      </Floater>
      {(["gas", "line", "blade"] as const).map((k, i) => (
        <Card
          key={k}
          at={at("16", i * 0.35)}
          out={at("18")}
          x={330 + i * 150}
          y={340}
          size={120}
        >
          <Icon kind={k} />
        </Card>
      ))}
      <Floater at={at("17", 0.4)} x={bx} y={by - 40} color={RED}>
        −$6 driving
      </Floater>
      <Value
        x={t1x}
        y={t1y}
        steps={[
          { at: -99, text: "$48", color: RED },
          { at: at("28"), text: "keep $30", color: RED },
        ]}
      />
      <Pill at={at("20", 0.3)} out={at("22") - 1} x={300} y={350} size={46}>
        price −20%
      </Pill>
      <Pill
        at={slamAt + 26}
        out={at("22") - 1}
        x={760}
        y={350}
        size={46}
        color={RED}
      >
        profit −29%
      </Pill>
      <Slam at={slamAt} color={RED}>
        −29%
      </Slam>

      {/* the neighbor */}
      <Floater at={at("22", 0.3)} x={t2x} y={t2y + 40} color={INKD} size={80}>
        !
      </Floater>
      <Bubble at={at("23")} out={at("25")} x={t2x} y={t2y - 120}>
        Me too?
      </Bubble>
      <Bubble at={at("24")} out={at("25", 0.5)} x={bx} y={by - 110}>
        Yes.
      </Bubble>
      <Pill at={at("25", 0.3)} out={at("26")} x={790} y={1350} size={40}>
        next door: no driving
      </Pill>
      <Floater at={at("25", 0.7)} x={l2x} y={l2y} color={RED}>
        −$12
      </Floater>
      <Value
        x={t2x}
        y={t2y}
        steps={[
          { at: at("25", 0.3), text: "$48", color: RED },
          { at: at("26"), text: "$48 − $12", color: RED },
          { at: at("27"), text: "keep $36", color: RED },
        ]}
      />
      <CoinRun
        at={at("29")}
        from={[
          [l1x, l1y],
          [l2x, l2y],
        ]}
      />

      <Banner at={at("30")} out={at("31") - 1} y={330}>
        The only one who got a raise was{" "}
        <span style={{ color: RED }}>the customer.</span>
      </Banner>
      <Banner at={at("31")} y={330}>
        They lowered the price.
      </Banner>
      <Banner at={at("32")} y={450} color={RED}>
        They never asked for anything back.
      </Banner>
    </Field>
  );
};

// ================================================================ SCENE 4

export const Scene4: React.FC = () => {
  const { at } = useCues();
  const [tx, ty] = TAG(1);
  return (
    <Field>
      <Street
        mowed={[1, 2]}
        behind={<Truck rich at={at("33", 0.3)} from={-10} to={PARK} />}
      />
      <Hud badge="RICH" color={GREEN} title="THE RICH WAY" at={at("33", 0.1)} />
      <Bubble at={0} x={tx} y={ty - 120}>
        Can you do it for less?
      </Bubble>
    </Field>
  );
};

// ================================================================ SCENE 5

export const Scene5: React.FC = () => {
  const { at } = useCues();
  const quests = useQuests();
  const [t0x, t0y] = TAG(0);
  const [t1x, t1y] = TAG(1);
  const [t2x, t2y] = TAG(2);
  return (
    <Field>
      <Street mowed={[1]} behind={<Truck rich to={PARK} />} />
      <Hud
        badge="RICH"
        color={GREEN}
        title="THE RICH WAY"
        steps={[
          { at: at("34", 0.1), label: "PRICE / CUT", value: 60, color: GREEN },
        ]}
      />
      <Pill
        at={at("34", 0.4)}
        x={560}
        y={560}
        size={48}
        color={GREEN}
        sub="not free"
      >
        20% OFF
      </Pill>
      <Pill at={at("35", 0.3)} x={t0x} y={t0y} size={56}>
        ?
      </Pill>
      <Pill at={at("35", 0.45)} x={t2x} y={t2y} size={56}>
        ?
      </Pill>
      <Arrow
        at={at("35", 0.2)}
        out={at("38")}
        x1={480}
        y1={660}
        x2={t0x + 50}
        y2={t0y + 10}
        color={GREEN}
      />
      <Arrow
        at={at("35", 0.4)}
        out={at("38")}
        x1={640}
        y1={660}
        x2={t2x - 50}
        y2={t2y - 10}
        color={GREEN}
      />
      <Banner at={at("37")} y={330} size={50} color={GREEN}>
        &quot;Twenty percent off, when two neighbors on your street sign
        up.&quot;
      </Banner>
      <Pill at={at("38", 0.3)} x={800} y={1420} size={40}>
        No sign-ups? Still $60.
      </Pill>
      <Bubble at={at("39")} out={at("40")} x={t1x} y={t1y - 10}>
        Deal.
      </Bubble>
      <Bubble at={at("40", 0.1)} x={t1x} y={t1y - 10} size={40}>
        Sign up with me!
      </Bubble>
      <Arrow
        at={at("40", 0.3)}
        x1={t1x - 140}
        y1={t1y + 60}
        x2={t0x + 60}
        y2={t0y + 120}
        color={GREEN}
      />
      <Arrow
        at={at("40", 0.4)}
        x1={t1x + 100}
        y1={t1y + 90}
        x2={t2x - 10}
        y2={t2y + 80}
        color={GREEN}
      />
      <Quests items={quests} />
    </Field>
  );
};

// ================================================================ SCENE 6

export const Scene6: React.FC = () => {
  const { at } = useCues();
  const quests = useQuests();
  const [bx, by] = truckXY(true);
  return (
    <Field>
      <Street
        mowed={[1]}
        flags={{ 0: at("41", 0.2), 2: at("41", 0.45) }}
        highlightRoad={at("44")}
        behind={<Truck rich to={PARK} />}
        front={
          <Route
            at={at("45", 0.3)}
            path={[
              [1.3, 2.3],
              [7.3, 2.3],
            ]}
            color={GREEN}
          />
        }
      />
      <Hud
        badge="RICH"
        color={GREEN}
        title="NEIGHBORS"
        steps={[
          {
            at: at("42", 0.2),
            label: "FULL PRICE · EACH",
            value: 60,
            color: GREEN,
          },
          { at: at("46", 0.4), label: "COST · NO DRIVING", value: 12 },
        ]}
      />
      {[0, 2].map((k) => {
        const [x, y] = TAG(k);
        const [lx, ly] = LAWN(k);
        return (
          <div key={k}>
            <Value
              x={x}
              y={y}
              steps={[{ at: at("43", 0.3), text: "$60", color: GREEN }]}
            />
            <Floater at={at("46", 0.3) + k * 2} x={lx} y={ly} color={RED}>
              −$12
            </Floater>
          </div>
        );
      })}
      <Pill at={at("44")} x={860} y={1420} size={46}>
        Same street
      </Pill>
      <Card
        at={at("45")}
        x={bx}
        y={by - 170}
        size={110}
        crossAt={at("45", 0.5)}
      >
        <Icon kind="truck" />
      </Card>
      <Quests items={quests} />
    </Field>
  );
};

// ================================================================ SCENE 7

export const Scene7: React.FC = () => {
  const { at } = useCues();
  const quests = useQuests();
  const lawns = [0, 1, 2].map(LAWN);
  const merge = at("53");
  return (
    <Field>
      <Street
        flags={{ 0: -99, 2: -99 }}
        mow={{
          0: [at("54"), 26],
          1: [at("54") + 6, 26],
          2: [at("54") + 12, 26],
        }}
        mower={[
          { k: 0, mow: [at("54"), 26], rich: true },
          { k: 2, mow: [at("54") + 12, 26], rich: true },
        ]}
        behind={<Truck rich to={PARK} />}
      />
      <Hud
        badge="RICH"
        color={GREEN}
        title="THE MATH"
        steps={[
          { at: at("49"), label: "CLIENT", value: 30, color: GREEN },
          { at: at("52"), label: "NEIGHBORS", value: 96, color: GREEN },
          {
            at: merge + 14,
            label: "PER VISIT · 3 LAWNS",
            value: 126,
            color: GREEN,
          },
        ]}
      />
      <Value
        x={TAG(1)[0]}
        y={TAG(1)[1]}
        steps={[
          { at: at("48", 0.3), text: "$48 − $18" },
          { at: at("49"), text: "keep $30", color: GREEN },
        ]}
      />
      {[0, 2].map((k) => (
        <Value
          key={k}
          x={TAG(k)[0]}
          y={TAG(k)[1]}
          steps={[
            { at: at("50", 0.5), text: "$60 − $12" },
            { at: at("51"), text: "keep $48", color: GREEN },
          ]}
        />
      ))}
      <CoinRun at={merge} from={lawns} per={5} />
      <Slam at={at("53", 0.6)} color={GREEN}>
        $126
      </Slam>
      <Pill
        at={at("54")}
        x={300}
        y={340}
        size={46}
        color={RED}
        sub="the poor way"
      >
        $66
      </Pill>
      <Pill at={at("55")} x={760} y={350} size={64} color={GREEN}>
        ×2
      </Pill>
      <Quests items={quests} />
    </Field>
  );
};

// ================================================================ SCENE 8

export const Scene8: React.FC = () => {
  const { at } = useCues();
  const [t2x, t2y] = TAG(2);
  return (
    <Field>
      <Street
        mowed={[0, 1, 2]}
        flags={{ 0: -99, 2: -99 }}
        behind={<Truck rich to={PARK} />}
      />
      <Hud
        badge="POOR"
        color={RED}
        at={at("56", 0.1)}
        left={50}
        width={470}
        big={84}
        title="2 LAWNS"
        steps={[{ at: at("56", 0.2), label: "2 LAWNS", value: 66, color: RED }]}
      />
      <Hud
        badge="RICH"
        color={GREEN}
        at={at("57", 0.1)}
        left={560}
        width={470}
        big={84}
        title="3 LAWNS"
        steps={[
          { at: at("57", 0.2), label: "3 LAWNS", value: 126, color: GREEN },
        ]}
      />
      <Bubble at={at("56", 0.5)} out={at("57")} x={t2x} y={t2y - 120}>
        Me too?
      </Bubble>

      <Banner at={at("56")} out={at("58") - 1} y={330} size={46} color={RED}>
        One person gave a discount and got a neighbor asking for one too.
      </Banner>
      <Banner at={at("57")} out={at("58") - 1} y={490} size={46} color={GREEN}>
        The other sold a discount and got two neighbors at full price.
      </Banner>
      <Banner at={at("58")} out={at("60") - 1} y={340} size={64} color={RED}>
        Poor people give discounts.
      </Banner>
      <Banner at={at("59")} out={at("60") - 1} y={470} size={64} color={GREEN}>
        Rich people sell them.
      </Banner>
      <Banner at={at("60")} y={340} size={80}>
        Same lawn.
      </Banner>
      <Banner at={at("61")} y={480} size={80}>
        Opposite answer.
      </Banner>
    </Field>
  );
};
