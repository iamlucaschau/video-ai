/**
 * Ep03 "How Poor vs Rich People Get Paid" — style D "Text Thread".
 * Every cue is a VO line id from the approved timing. Chat lines are
 * dramatized; every number on screen is in the FINAL audit.
 */
import { useCurrentFrame } from "remotion";
import { useCues } from "../cues";
import { Banner, Slam } from "../styles/chipTable";
import { Hud } from "../styles/streetSim";
import {
  Chat,
  Dim,
  type Msg,
  Rows,
  Screen,
  Summary,
  Toast,
} from "../styles/textThread";
import { INK as SIDE } from "../theme";

const RED = SIDE.poor;
const GREEN = SIDE.rich;
const ONE = { color: "#7E57C2", text: "1" };
const TWO = { color: "#FF8A65", text: "2" };
const BANK = { color: "#455A64", text: "$", square: true };
const CARD = { color: "#263238", text: "CC", square: true };

const client = (n: 1 | 2, rich: boolean) => ({
  name: `Client ${n === 1 ? "one" : "two"}`,
  sub: "Interior paint job",
  avatar: n === 1 ? ONE : TWO,
  badge: rich ? { text: "RICH", color: GREEN } : { text: "POOR", color: RED },
});
const bank = (rich: boolean) => ({
  name: "Paint Co.",
  sub: "Business account",
  avatar: BANK,
  badge: rich ? { text: "RICH", color: GREEN } : { text: "POOR", color: RED },
});
const cardApp = {
  name: "Credit Card",
  sub: "Statement",
  avatar: CARD,
  badge: { text: "POOR", color: RED },
};

/** Show `node` while the scene's frame is in [from, to). */
const During: React.FC<{
  from: number;
  to?: number;
  children: React.ReactNode;
}> = ({ from, to = Infinity, children }) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};

// ================================================================ SCENE 3

export const Scene3: React.FC = () => {
  const { at } = useCues();
  const card = at("17");
  const bank1 = at("20");
  const chat2 = at("23");
  const bank2 = at("27");
  const invoice = (old = -90): Msg => ({
    at: old,
    kind: "card",
    color: RED,
    card: { title: "INVOICE", big: "$2,000", sub: "Unpaid" },
  });

  const chatOne: Msg[] = [
    invoice(),
    {
      at: at("15", 0.25),
      kind: "out",
      color: RED,
      text: "Just checking in on the invoice!",
      receipt: [[at("15", 0.25) + 6, "Delivered"]],
    },
    {
      at: at("15", 0.6),
      kind: "out",
      color: RED,
      text: "Just checking in…",
      receipt: [[at("15", 0.6) + 6, "Delivered"]],
    },
    {
      at: at("16", 0.1),
      kind: "out",
      color: RED,
      text: "Hi! Just checking in again.",
      receipt: [[at("16", 0.1) + 6, "Delivered"]],
    },
    { at: at("16", 0.55), kind: "sys", text: "45 days later" },
    {
      at: at("16", 0.7),
      kind: "in",
      avatar: ONE,
      text: "Sent it. Sorry for the delay!",
    },
  ];
  const chatTwo: Msg[] = [
    { at: at("23", 0.15), kind: "in", avatar: TWO, text: "Love the walls!!" },
    { ...invoice(at("24")), receipt: [[at("24", 0.5), "Seen"]] },
    {
      at: at("26", 0.15),
      kind: "sys",
      strong: true,
      color: RED,
      text: "Four days of work · $0",
    },
  ];
  const kept = {
    at: at("21"),
    title: "Kept",
    sub: "45 days late",
    subAt: at("22"),
    value: "$1,382",
    color: RED,
    total: true,
  };

  return (
    <>
      <During from={-999} to={card}>
        <Screen {...client(1, false)} input="Message">
          <Chat items={chatOne} />
        </Screen>
        <Toast
          at={at("16", 0.75)}
          out={card - 2}
          icon={BANK}
          title="PAINT CO. · now"
          body="+$2,000 from Client one"
        />
      </During>

      <During from={card} to={bank1}>
        <Screen {...cardApp}>
          <Hud
            top={235}
            badge="OWED"
            color={RED}
            title=""
            steps={[
              { at: card, label: "PAINT & SUPPLIES", value: 600, color: RED },
            ]}
          />
          <Rows
            rows={[
              {
                at: card + 4,
                title: "Paint & supplies",
                sub: "Client one",
                value: "$600",
              },
              { at: at("17", 0.5), title: "Interest rate", value: "24% APR" },
              { at: at("18", 0.2), title: "Carried for", value: "1.5 months" },
              {
                at: at("19", 0.1),
                title: "Interest",
                value: "+$18",
                color: RED,
                total: true,
              },
            ]}
          />
        </Screen>
      </During>

      <During from={bank1} to={chat2}>
        <Screen {...bank(false)}>
          <Hud
            top={235}
            badge="PROFIT"
            color={RED}
            steps={[
              { at: bank1, label: "CLIENT ONE", value: 2000 },
              {
                at: at("21"),
                label: "KEPT · 45 DAYS LATE",
                value: 1382,
                color: RED,
              },
            ]}
          />
          <Rows
            rows={[
              { at: bank1 + 2, title: "Client one paid", value: "+$2,000" },
              {
                at: at("20", 0.4),
                title: "Paint & supplies",
                value: "−$600",
                color: RED,
              },
              {
                at: at("20", 0.75),
                title: "Card interest",
                value: "−$18",
                color: RED,
              },
              kept,
            ]}
          />
        </Screen>
      </During>

      <During from={chat2} to={bank2}>
        <Screen {...client(2, false)} input="Message">
          <Chat items={chatTwo} />
        </Screen>
        <Toast
          at={at("25")}
          out={bank2 - 2}
          icon={CARD}
          title="CREDIT CARD"
          body="Still owed: $600"
        />
      </During>

      <During from={bank2}>
        <Screen {...bank(false)}>
          <Hud
            top={235}
            badge="PROFIT"
            color={RED}
            steps={[
              {
                at: bank2 - 99,
                label: "KEPT · CLIENT ONE",
                value: 1382,
                color: RED,
              },
              {
                at: at("28", 0.1),
                label: "TWO JOBS · EIGHT DAYS",
                value: 782,
                color: RED,
              },
            ]}
          />
          <Rows
            rows={[
              { at: -99, title: "Client one paid", value: "+$2,000" },
              {
                at: -99,
                title: "Paint & supplies",
                value: "−$600",
                color: RED,
              },
              { at: -99, title: "Card interest", value: "−$18", color: RED },
              { ...kept, at: -99, subAt: -99 },
              {
                at: at("27", 0.45),
                title: "Client two",
                sub: "never paid",
                value: "−$600",
                color: RED,
              },
              {
                at: at("28", 0.1),
                title: "Eight days of painting",
                value: "$782",
                color: RED,
                total: true,
              },
            ]}
          />
        </Screen>
        <Toast
          at={at("29")}
          out={at("30") - 2}
          icon={CARD}
          title="CREDIT CARD"
          body="Interest is still charging"
        />
        <Slam at={at("28", 0.15)} color={RED}>
          $782
        </Slam>
        <Dim at={at("30")} />
        <Banner at={at("30")} y={720}>
          The only one who got paid on time was{" "}
          <span style={{ color: RED }}>the card company.</span>
        </Banner>
        <Banner at={at("31")} y={900}>
          They sold the paint job.
        </Banner>
        <Banner at={at("32")} y={1030} color={RED}>
          They never sold the terms.
        </Banner>
      </During>
    </>
  );
};

// ================================================================ SCENE 1

export const Scene1: React.FC = () => {
  const { at } = useCues();
  const items: Msg[] = [
    { at: 0, kind: "title", text: "Get Paid" },
    {
      at: at("01", 0.15),
      kind: "out",
      label: "POOR",
      color: RED,
      text: "All done! The walls are finished.",
    },
    {
      at: at("01", 0.6),
      kind: "card",
      label: "POOR",
      color: RED,
      card: { title: "INVOICE", big: "$2,000", sub: "sent after the job" },
    },
    {
      at: at("02", 0.45),
      kind: "card",
      label: "RICH",
      color: GREEN,
      card: {
        title: "DEPOSIT",
        big: "$1,000",
        sub: "before the first brushstroke",
      },
    },
    { at: at("03"), kind: "sys", text: "Same job." },
    { at: at("04"), kind: "sys", strong: true, text: "Opposite order." },
  ];
  return (
    <Screen
      name="Client one"
      sub="Interior paint job"
      avatar={ONE}
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
    {
      at: at("05", 0.2),
      kind: "in",
      avatar: ONE,
      text: "Can you paint our living room?",
    },
    { at: at("06", 0.3), kind: "out", color: RED, text: "You’re booked!" },
    {
      at: at("07", 0.1),
      kind: "card",
      color: RED,
      card: { title: "PRICE", big: "$2,000", sub: "per house" },
    },
    { at: at("10"), kind: "sys", text: "Four days of work" },
    {
      at: at("11", 0.4),
      kind: "card",
      color: RED,
      card: { title: "INVOICE", big: "$2,000", sub: "Unpaid" },
    },
    {
      at: at("12"),
      kind: "sys",
      strong: true,
      text: "They didn’t make a sale.",
    },
    {
      at: at("13"),
      kind: "sys",
      strong: true,
      color: RED,
      text: "They made a loan.",
    },
  ];
  return (
    <>
      <Screen {...client(1, false)} input="Message">
        <Chat items={items} />
      </Screen>
      <Toast
        at={at("06", 0.6)}
        out={at("08")}
        icon={TWO}
        title="CLIENT TWO"
        body="Booked! Same month works."
      />
      <Toast
        at={at("08", 0.3)}
        out={at("09")}
        icon={CARD}
        title="CREDIT CARD · House one"
        body="−$600 Paint & supplies"
      />
      <Toast
        at={at("09", 0.1)}
        out={at("10")}
        icon={CARD}
        title="CREDIT CARD · House two"
        body="−$600 Paint & supplies"
      />
    </>
  );
};

// ================================================================ SCENES 4–6 (the rich thread with client one)

const useRichThread = (): Msg[] => {
  const { at } = useCues();
  return [
    {
      at: at("33", 0.1),
      kind: "sys",
      strong: true,
      color: GREEN,
      text: "The rich way",
    },
    {
      at: at("33", 0.35),
      kind: "in",
      avatar: ONE,
      text: "Can you paint our living room?",
    },
    {
      at: at("34", 0.3),
      kind: "card",
      color: GREEN,
      card: { title: "QUOTE", big: "$2,000", sub: "with terms" },
    },
    { at: at("35"), kind: "out", color: GREEN, text: "Half to book the date." },
    {
      at: at("36"),
      kind: "out",
      color: GREEN,
      text: "Half at the walkthrough.",
    },
    {
      at: at("37"),
      kind: "sys",
      color: GREEN,
      text: "① Terms · it’s called a deposit",
    },
    { at: at("37", 0.6), kind: "in", avatar: ONE, text: "Deal." },
    { at: at("43"), kind: "sys", color: GREEN, text: "③ The walkthrough" },
    { at: at("44", 0.2), kind: "in", avatar: ONE, text: "Looks perfect!" },
    {
      at: at("46"),
      kind: "sys",
      strong: true,
      color: GREEN,
      text: "0 days waiting",
    },
  ];
};

export const Scene4: React.FC = () => (
  <Screen {...client(1, true)} input="Message">
    <Chat items={useRichThread()} />
  </Screen>
);

// ================================================================ SCENE 5

export const Scene5: React.FC = () => {
  const { at } = useCues();
  const thread = useRichThread();
  const money = at("38");
  return (
    <>
      <During from={-999} to={money}>
        <Screen {...client(1, true)} input="Message">
          <Chat items={thread} />
        </Screen>
      </During>
      <During from={money}>
        <Screen {...bank(true)}>
          <Hud
            top={235}
            badge="CASH"
            color={GREEN}
            title="② THE DEPOSIT BUYS THE PAINT"
            steps={[
              { at: at("39"), label: "DEPOSIT IN", value: 1000, color: GREEN },
              {
                at: at("41"),
                label: "LEFT BEFORE DAY ONE",
                value: 400,
                color: GREEN,
              },
            ]}
          />
          <Rows
            rows={[
              {
                at: money + 2,
                title: "② THE DEPOSIT BUYS THE PAINT",
                head: true,
              },
              {
                at: at("39"),
                title: "Deposit · Client one",
                value: "+$1,000",
                color: GREEN,
              },
              { at: at("40"), title: "Paint & supplies", value: "−$600" },
              {
                at: at("41"),
                title: "Before day one",
                value: "$400",
                color: GREEN,
                total: true,
              },
              {
                at: at("42"),
                title: "Credit card",
                sub: "nothing to carry",
                value: "$0",
                color: GREEN,
              },
            ]}
          />
        </Screen>
        <Toast
          at={money + 4}
          out={at("40")}
          icon={BANK}
          title="PAINT CO. · now"
          body="+$1,000 Deposit received"
        />
      </During>
    </>
  );
};

// ================================================================ SCENE 6

export const Scene6: React.FC = () => {
  const { at } = useCues();
  const thread = useRichThread();
  const two = at("47");
  const chatTwo: Msg[] = [
    {
      at: -90,
      kind: "card",
      color: GREEN,
      card: { title: "DEPOSIT", big: "$1,000", sub: "Paid" },
    },
    { at: at("47", 0.3), kind: "in", avatar: TWO, text: "Love the walls!!" },
    {
      at: at("48"),
      kind: "card",
      color: GREEN,
      card: { title: "BALANCE DUE", big: "$1,000", sub: "at walkthrough" },
      receipt: [[at("49"), "Seen"]],
    },
    {
      at: at("51"),
      kind: "sys",
      strong: true,
      color: GREEN,
      text: "Deposit kept: $400",
    },
  ];
  return (
    <>
      <During from={-999} to={two}>
        <Screen {...client(1, true)} input="Message">
          <Chat items={thread} />
        </Screen>
        <Toast
          at={at("45", 0.2)}
          out={two - 2}
          icon={BANK}
          title="PAINT CO. · now"
          body="+$1,000 from Client one"
        />
      </During>
      <During from={two}>
        <Screen {...client(2, true)} input="Message">
          <Chat items={chatTwo} />
        </Screen>
      </During>
    </>
  );
};

// ================================================================ SCENE 7

export const Scene7: React.FC = () => {
  const { at } = useCues();
  return (
    <Screen {...bank(true)}>
      <Hud
        top={235}
        badge="PROFIT"
        color={GREEN}
        title="④ THE MATH"
        steps={[
          { at: at("54"), label: "CLIENT ONE", value: 1400, color: GREEN },
          {
            at: at("56"),
            label: "TWO JOBS · EIGHT DAYS",
            value: 1800,
            color: GREEN,
          },
        ]}
      />
      <Rows
        rows={[
          { at: at("52", 0.2), title: "④ THE MATH", head: true },
          {
            at: at("53", 0.2),
            title: "Client one: $2,000 − $600",
            value: "$1,400",
            valueAt: at("54"),
            color: GREEN,
            icon: "1",
          },
          {
            at: at("55"),
            title: "Client two: deposit − supplies",
            value: "$400",
            color: GREEN,
            icon: "2",
          },
          {
            at: at("56"),
            title: "Eight days of painting",
            value: "$1,800",
            color: GREEN,
            total: true,
          },
          {
            at: at("57"),
            title: "The poor way",
            sub: "same two clients",
            value: "$782",
            color: RED,
          },
          {
            at: at("58"),
            title: "More than double",
            value: "×2+",
            color: GREEN,
            total: true,
          },
        ]}
      />
      <Slam at={at("56", 0.2)} color={GREEN}>
        $1,800
      </Slam>
    </Screen>
  );
};

// ================================================================ SCENE 8

export const Scene8: React.FC = () => {
  const { at } = useCues();
  return (
    <Screen name="This month" sub="Paint Co. · summary" avatar={BANK}>
      <Summary
        at={at("59", 0.1)}
        top={250}
        color={RED}
        badge="POOR"
        lines={[
          "Did the work, then invoiced",
          "1 client vanished · card still charging",
        ]}
        value="$782"
      />
      <Summary
        at={at("60", 0.1)}
        top={540}
        color={GREEN}
        badge="RICH"
        lines={["Got paid, then did the work", "2 deposits · card at $0"]}
        value="$1,800"
      />
      <Banner at={at("61")} out={at("63") - 1} y={880} size={64} color={RED}>
        Poor people send invoices.
      </Banner>
      <Banner at={at("62")} out={at("63") - 1} y={1020} size={64} color={GREEN}>
        Rich people take deposits.
      </Banner>
      <Banner at={at("63")} y={880} size={84}>
        Same job.
      </Banner>
      <Banner at={at("64")} y={1040} size={84}>
        Opposite order.
      </Banner>
    </Screen>
  );
};
