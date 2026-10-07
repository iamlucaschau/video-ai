/**
 * Ep02 style D "Text Thread" — all 8 scenes on a phone screen. Same FINAL
 * script and VO; every cue is a VO line id. Chat lines are dramatized
 * (paraphrase the narration); every number on screen is from the FINAL audit.
 */
import { useCues } from "../cues";
import { Icon } from "../ep02/Scene3";
import { useCurrentFrame } from "remotion";
import { Banner, prog, Slam } from "../styles/chipTable";
import { Hud } from "../styles/streetSim";
import { INK as SIDE } from "../theme";
import { Chat, type Msg, Rows, Screen, Summary, Toast } from "../styles/textThread";

const RED = SIDE.poor;
const GREEN = SIDE.rich;
const CLIENT = { color: "#7E57C2", text: "C" };
const N1 = { color: "#FF8A65", text: "N" };
const N2 = { color: "#29B6F6", text: "N" };
const ME = { color: "#455A64", text: "Me" };

const clientHeader = {
  name: "Client",
  sub: "Lawn customer · every 2 weeks",
  avatar: CLIENT,
};

// ================================================================ SCENE 1

export const Scene1: React.FC = () => {
  const { at } = useCues();
  const items: Msg[] = [
    { at: 0, kind: "title" },
    {
      at: at("01", 0.05),
      kind: "in",
      text: "Can you do it for less?",
      avatar: CLIENT,
    },
    {
      at: at("01", 0.6),
      kind: "out",
      label: "POOR",
      color: RED,
      text: "Sure. $48 instead of $60.",
    },
    {
      at: at("02", 0.45),
      kind: "out",
      label: "RICH",
      color: GREEN,
      text: "A discount? It's for sale.",
    },
    { at: at("03"), kind: "sys", text: "Same lawn." },
    { at: at("04"), kind: "sys", strong: true, text: "Opposite answer." },
  ];
  return (
    <Screen
      {...{ name: "Client", sub: "Lawn customer", avatar: CLIENT }}
      input="Message"
    >
      <Chat items={items} />
    </Screen>
  );
};

// ================================================================ SCENE 2

export const Scene2: React.FC = () => {
  const { at } = useCues();
  const items: Msg[] = [
    { at: at("05", 0.2), kind: "out", color: RED, text: "Lawn's done!" },
    {
      at: at("06", 0.1),
      kind: "card",
      color: RED,
      card: { title: "LAWN MOWING", big: "$60", sub: "a cut · every 2 weeks" },
    },
    {
      at: at("07", 0.1),
      kind: "in",
      text: "Could you do 20% off?",
      avatar: CLIENT,
    },
    { at: at("08"), kind: "out", color: RED, text: "Yes!" },
    {
      at: at("09", 0.1),
      kind: "card",
      color: RED,
      card: { title: "NEW PRICE", old: "$60", big: "$48", sub: "a cut" },
    },
    {
      at: at("10", 0.1),
      kind: "in",
      text: "You're the best, thank you!",
      avatar: CLIENT,
      heart: at("11"),
    },
    { at: at("11", 0.4), kind: "sys", text: "Saved the account!" },
    {
      at: at("12"),
      kind: "sys",
      strong: true,
      text: "They didn't save a customer.",
    },
    {
      at: at("13"),
      kind: "sys",
      strong: true,
      color: RED,
      text: "They paid one to stay.",
    },
  ];
  return (
    <Screen
      {...clientHeader}
      badge={{ text: "POOR", color: RED }}
      input="Message"
    >
      <Chat items={items} />
    </Screen>
  );
};

// ================================================================ SCENE 3

const bankHeader = (rich: boolean) => ({
  name: "Lawn Biz",
  sub: "Business account",
  avatar: { color: rich ? GREEN : RED, text: "$", square: true },
  badge: { text: rich ? "RICH" : "POOR", color: rich ? GREEN : RED },
});

export const Scene3: React.FC = () => {
  const { at } = useCues();
  const f = useCurrentFrame();
  const slamAt = at("21", 0.55);
  return (
    <Screen {...bankHeader(false)}>
      <Hud
        top={235}
        badge="PROFIT"
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
      <Rows
        rows={[
          {
            at: at("15", 0.2),
            title: "Cost per cut",
            sub: "gas · trimmer line · blades",
            subAt: at("16"),
            value: "−$18",
            color: RED,
            icon: <Icon kind="gas" />,
          },
          {
            at: at("17", 0.3),
            title: "incl. driving to the street",
            value: "$6",
            icon: <Icon kind="truck" />,
          },
          { at: at("18", 0.4), title: "At $60, you keep", value: "$42" },
          {
            at: at("19", 0.4),
            title: "At $48, you keep",
            value: "$30",
            color: RED,
          },
          { at: at("20", 0.3), title: "Price", value: "−20%" },
          { at: slamAt + 26, title: "Profit", value: "−29%", color: RED },
          {
            at: at("25", 0.3),
            title: "Neighbor pays",
            sub: "next door",
            value: "$48",
            icon: "N",
          },
          {
            at: at("25", 0.75),
            title: "Cost · no driving",
            value: "−$12",
            color: RED,
            icon: <Icon kind="blade" />,
          },
          {
            at: at("27"),
            title: "Neighbor: you keep",
            value: "$36",
            color: RED,
          },
          {
            at: at("29", 0.2),
            title: "Per visit · 2 lawns",
            value: "$66",
            color: RED,
            total: true,
          },
        ]}
      />
      <Toast
        at={at("22", 0.4)}
        out={at("24")}
        icon={N1}
        title="NEIGHBOR · now"
        body="Heard about the deal. Me too?"
      />
      <Toast
        at={at("24")}
        out={at("25", 0.5)}
        icon={ME}
        title="YOU · sent"
        body="Yes."
      />
      <Slam at={slamAt} color={RED}>
        −29%
      </Slam>
      {/* dim the app behind the closing truth lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20,28,36,0.78)",
          opacity: prog(f, at("30"), 8),
        }}
      />
      <Banner at={at("30")} out={at("31") - 1} y={720}>
        The only one who got a raise was{" "}
        <span style={{ color: RED }}>the customer.</span>
      </Banner>
      <Banner at={at("31")} y={720}>
        They lowered the price.
      </Banner>
      <Banner at={at("32")} y={860} color={RED}>
        They never asked for anything back.
      </Banner>
    </Screen>
  );
};

// ================================================================ SCENES 4–5 (one thread)

const useRichThread = (): Msg[] => {
  const { at } = useCues();
  return [
    {
      at: at("33") - 90,
      kind: "in",
      text: "Can you do it for less?",
      avatar: CLIENT,
    },
    {
      at: at("33", 0.2),
      kind: "sys",
      strong: true,
      color: GREEN,
      text: "The rich way",
    },
    {
      at: at("34", 0.25),
      kind: "out",
      color: GREEN,
      text: "I don't give discounts away.",
    },
    { at: at("35"), kind: "out", color: GREEN, text: "I trade them." },
    { at: at("35", 0.6), kind: "sys", color: GREEN, text: "① Trade it" },
    { at: at("36", 0.3), kind: "sys", color: GREEN, text: "② Name the trade" },
    {
      at: at("37"),
      kind: "card",
      color: GREEN,
      card: {
        title: "THE DEAL",
        body: "“Twenty percent off, when two neighbors on your street sign up.”",
      },
    },
    {
      at: at("38", 0.15),
      kind: "out",
      color: GREEN,
      text: "If nobody signs, the price stays $60.",
    },
    {
      at: at("39", 0.2),
      kind: "in",
      text: "Deal. I'll ask my neighbors!",
      avatar: CLIENT,
    },
    {
      at: at("40", 0.2),
      kind: "in",
      text: "Sending it to the street chat now.",
      avatar: CLIENT,
    },
  ];
};

export const Scene4: React.FC = () => (
  <Screen
    {...clientHeader}
    badge={{ text: "RICH", color: GREEN }}
    input="Message"
  >
    <Chat items={useRichThread()} />
  </Screen>
);

export const Scene5: React.FC = () => (
  <Screen
    {...clientHeader}
    badge={{ text: "RICH", color: GREEN }}
    input="Message"
  >
    <Chat items={useRichThread()} />
  </Screen>
);

// ================================================================ SCENE 6

export const Scene6: React.FC = () => {
  const { at } = useCues();
  const items: Msg[] = [
    { at: -10, kind: "sys", text: "Client added Neighbor 1 and Neighbor 2" },
    {
      at: at("41"),
      kind: "sys",
      color: GREEN,
      text: "③ Two neighbors sign up",
    },
    {
      at: at("41", 0.35),
      kind: "in",
      label: "Neighbor 1",
      avatar: N1,
      text: "Signed! ✓",
    },
    {
      at: at("41", 0.7),
      kind: "in",
      label: "Neighbor 2",
      avatar: N2,
      text: "Count me in. ✓",
    },
    {
      at: at("42", 0.3),
      kind: "card",
      color: GREEN,
      card: { title: "FULL PRICE", big: "$60", sub: "a cut · each" },
    },
    { at: at("44"), kind: "sys", text: "Same street" },
    { at: at("45", 0.2), kind: "sys", text: "No driving between lawns" },
    {
      at: at("46", 0.2),
      kind: "out",
      color: GREEN,
      text: "My cost: $12 a lawn.",
    },
  ];
  return (
    <Screen
      name="Same Street Lawns"
      sub="Client, Neighbor 1, Neighbor 2, You"
      avatar={{ color: GREEN, text: "S" }}
      badge={{ text: "RICH", color: GREEN }}
      input="Message"
    >
      <Chat items={items} />
    </Screen>
  );
};

// ================================================================ SCENE 7

export const Scene7: React.FC = () => {
  const { at } = useCues();
  return (
    <Screen {...bankHeader(true)}>
      <Hud
        top={235}
        badge="PROFIT"
        color={GREEN}
        title="④ THE MATH"
        steps={[
          { at: at("49"), label: "CLIENT", value: 30, color: GREEN },
          { at: at("52"), label: "NEIGHBORS", value: 96, color: GREEN },
          {
            at: at("53", 0.3),
            label: "PER VISIT · 3 LAWNS",
            value: 126,
            color: GREEN,
          },
        ]}
      />
      <Rows
        rows={[
          { at: at("47", 0.2), title: "④ THE MATH", head: true },
          {
            at: at("48", 0.3),
            title: "Client: $48 − $18",
            value: "$30",
            valueAt: at("49"),
            color: GREEN,
            icon: "C",
          },
          {
            at: at("50", 0.4),
            title: "Neighbor 1: $60 − $12",
            value: "$48",
            valueAt: at("51"),
            color: GREEN,
            icon: "N",
          },
          {
            at: at("50", 0.6),
            title: "Neighbor 2: $60 − $12",
            value: "$48",
            valueAt: at("51"),
            color: GREEN,
            icon: "N",
          },
          { at: at("52"), title: "Both neighbors", value: "$96", color: GREEN },
          {
            at: at("53", 0.3),
            title: "Per visit · 3 lawns",
            value: "$126",
            color: GREEN,
            total: true,
          },
          {
            at: at("54"),
            title: "The poor way",
            sub: "same street",
            value: "$66",
            color: RED,
          },
          {
            at: at("55"),
            title: "Almost double",
            value: "×2",
            color: GREEN,
            total: true,
          },
        ]}
      />
      <Slam at={at("53", 0.6)} color={GREEN}>
        $126
      </Slam>
    </Screen>
  );
};

// ================================================================ SCENE 8

export const Scene8: React.FC = () => {
  const { at } = useCues();
  return (
    <Screen
      name="This week"
      sub="Lawn Biz · summary"
      avatar={{ color: "#455A64", text: "$", square: true }}
    >
      <Summary
        at={at("56", 0.1)}
        top={250}
        color={RED}
        badge="POOR"
        lines={["Gave a discount", "1 neighbor asking for one too"]}
        value="$66"
      />
      <Summary
        at={at("57", 0.1)}
        top={540}
        color={GREEN}
        badge="RICH"
        lines={["Sold a discount", "2 neighbors at full price"]}
        value="$126"
      />
      <Banner at={at("58")} out={at("60") - 1} y={880} size={64} color={RED}>
        Poor people give discounts.
      </Banner>
      <Banner at={at("59")} out={at("60") - 1} y={1020} size={64} color={GREEN}>
        Rich people sell them.
      </Banner>
      <Banner at={at("60")} y={880} size={84}>
        Same lawn.
      </Banner>
      <Banner at={at("61")} y={1040} size={84}>
        Opposite answer.
      </Banner>
    </Screen>
  );
};
