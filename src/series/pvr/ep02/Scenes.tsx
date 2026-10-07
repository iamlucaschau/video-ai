/**
 * Ep02 "How Poor vs Rich People Give Discounts" — scenes 1, 2, 4–8
 * (scene 3 is in Scene3.tsx). Static frame; puppets act, the receipt prints,
 * numbers slam in. Every cue is a VO line id from the approved timing.
 */
import { Easing, interpolate } from "remotion";
import { useCues } from "../cues";
import { MoneyBurst, Slam } from "../motion";
import {
  Bubble,
  Diorama,
  FONT,
  Grass,
  House,
  Mower,
  Paper,
  PAPER,
  PaperArrow,
  PaperDefs,
  PinCard,
  Puppet,
  QuoteStrip,
  ReceiptPrinter,
  step,
  Tag,
  useStepFrame,
  type ReceiptLine,
} from "../paper";
import { INK } from "../theme";

const NAVY = "#37474F";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Slide in from `dx` px over 8 frames (stepped, eased). */
const slide = (f: number, at: number, dx: number) =>
  interpolate(f, [at, at + 8], [dx, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

const World: React.FC<{ children: React.ReactNode; grass?: boolean }> = ({
  children,
  grass = true,
}) => (
  <>
    <PaperDefs />
    <Diorama />
    {grass ? <Grass /> : null}
    {children}
  </>
);

/** Big paper house front (fills its box). */
const HouseFront: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
}> = ({ x, y, w, h, at = 0 }) => {
  const f = useStepFrame();
  if (f < at) return null;
  return (
    <Paper
      bg="#E9DFC9"
      style={{
        left: x,
        top: y - (1 - step(f, at, 6)) * 60,
        width: w,
        height: h,
      }}
    >
      <House />
    </Paper>
  );
};

// ================================================================ SCENE 1

export const Scene1: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const cut = step(f, at("01", 0.75), 6);
  const between = (a: number, b: number) => f >= a && f < b;
  return (
    <World grass={false}>
      <Paper
        style={{ left: 60, right: 60, top: 110, height: 300, rotate: "-1deg" }}
      >
        <div style={{ textAlign: "center", paddingTop: 34, color: PAPER.ink }}>
          <div
            style={{
              fontFamily: FONT.paper,
              fontWeight: FONT.paperWeight,
              fontSize: 66,
            }}
          >
            How Poor vs Rich People
          </div>
          <div
            style={{
              fontFamily: FONT.sign,
              fontWeight: 800,
              fontSize: 104,
              lineHeight: 1.1,
            }}
          >
            Give Discounts
          </div>
        </div>
      </Paper>

      {/* client in the middle asks the question */}
      <Puppet
        x={385}
        y={840}
        scale={0.6}
        apron={NAVY}
        rich
        talk={between(at("01"), at("01", 0.6))}
      />
      <Bubble at={at("01", 0.1)} x={300} y={640} out={at("02", 0.9)} size={46}>
        Can you do it for less?
      </Bubble>

      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("01"), -500)}px 0px`,
        }}
      >
        <Tag
          at={at("01")}
          x={70}
          y={760}
          color={INK.poor}
          font="sign"
          size={60}
        >
          POOR
        </Tag>
        <Puppet
          x={0}
          y={860}
          scale={0.6}
          apron={INK.poor}
          look={1}
          react={at("01", 0.75)}
        />
      </div>
      {/* "cuts the price": the $60 tag is cut in two */}
      {f >= at("01", 0.45) ? (
        <div style={{ position: "absolute", left: 60, top: 560 }}>
          {[0, 1].map((half) => (
            <div
              key={half}
              style={{
                position: "absolute",
                clipPath: half
                  ? "polygon(52% 0, 100% 0, 100% 100%, 46% 100%)"
                  : "polygon(0 0, 52% 0, 46% 100%, 0 100%)",
                translate: `${(half ? 1 : -1) * cut * 40}px ${cut * 30}px`,
                rotate: `${(half ? 1 : -1) * cut * 12}deg`,
              }}
            >
              <Paper style={{ position: "relative", width: 220, height: 120 }}>
                <div
                  style={{
                    fontFamily: FONT.sign,
                    fontWeight: 800,
                    fontSize: 84,
                    textAlign: "center",
                    color: INK.poor,
                    paddingTop: 6,
                  }}
                >
                  $60
                </div>
              </Paper>
            </div>
          ))}
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("02"), 500)}px 0px`,
        }}
      >
        <Tag
          at={at("02")}
          x={830}
          y={760}
          color={INK.rich}
          font="sign"
          size={60}
          rotate={2}
        >
          RICH
        </Tag>
        <Puppet x={760} y={860} scale={0.6} apron={INK.rich} rich look={-1} />
      </div>
      {/* "sells the discount": the 20% OFF tag hangs like merchandise */}
      <Tag
        at={at("02", 0.7)}
        x={700}
        y={570}
        color={INK.rich}
        font="sign"
        size={64}
        rotate={6}
      >
        20% OFF
      </Tag>
      <Tag at={at("02", 0.85)} x={430} y={470} font="sign" size={56} rotate={0}>
        VERSUS
      </Tag>
      {f >= at("03") ? <Grass /> : null}
      <PaperArrow
        at={at("04")}
        x1={250}
        y1={1450}
        x2={480}
        y2={1500}
        color={INK.poor}
        bend={60}
      />
      <PaperArrow
        at={at("04", 0.4)}
        x1={830}
        y1={1450}
        x2={600}
        y2={1500}
        color={INK.rich}
        bend={60}
      />
    </World>
  );
};

// ================================================================ SCENE 2

export const Scene2: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const between = (a: number, b: number) => f >= a && f < b;
  return (
    <World>
      <HouseFront x={470} y={520} w={560} h={600} />
      <Puppet
        x={30}
        y={650}
        scale={0.82}
        apron={INK.poor}
        look={1}
        react={at("08")}
        smile={f >= at("11") && f < at("12")}
      />
      {/* mower pushes back and forth while they work */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${Math.sin(f / 6) * 18}px 0px`,
        }}
      >
        <Mower x={260} y={1215} scale={0.62} />
      </div>
      <Puppet
        x={620}
        y={840}
        scale={0.6}
        apron={NAVY}
        rich
        talk={between(at("07"), at("08"))}
        react={at("10")}
      />

      <PinCard
        at={at("06")}
        x={60}
        y={170}
        w={300}
        h={170}
        rotate={-3}
        out={at("09") - 2}
      >
        <div
          style={{
            textAlign: "center",
            paddingTop: 22,
            fontFamily: FONT.sign,
            fontWeight: 800,
            fontSize: 80,
            color: PAPER.ink,
          }}
        >
          $60
        </div>
        <div
          style={{
            textAlign: "center",
            fontFamily: FONT.paper,
            fontWeight: 700,
            fontSize: 36,
            color: PAPER.ink,
          }}
        >
          every 2 weeks
        </div>
      </PinCard>
      <Bubble at={at("07")} x={560} y={660} out={at("09")} size={50}>
        20% off?
      </Bubble>
      <PinCard at={at("09")} x={60} y={170} w={300} h={170} rotate={2}>
        <div
          style={{
            textAlign: "center",
            paddingTop: 22,
            fontFamily: FONT.sign,
            fontWeight: 800,
            fontSize: 80,
            color: INK.poor,
          }}
        >
          $48
        </div>
        <div
          style={{
            textAlign: "center",
            fontFamily: FONT.paper,
            fontWeight: 700,
            fontSize: 36,
            color: PAPER.ink,
          }}
        >
          per cut
        </div>
      </PinCard>
      <MoneyBurst
        at={at("13")}
        x1={250}
        y1={1000}
        x2={760}
        y2={1000}
        count={6}
      />
      <QuoteStrip at={at("13")} y={420} rotate={-1.5}>
        They paid one <span style={{ color: INK.poor }}>to stay.</span>
      </QuoteStrip>
    </World>
  );
};

// ================================================================ SCENE 4

export const Scene4: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  return (
    <World>
      <Puppet
        x={300}
        y={840}
        scale={0.6}
        apron={NAVY}
        rich
        talk={f < at("33", 0.4)}
      />
      <Bubble at={0} x={200} y={640} size={46}>
        Can you do it for less?
      </Bubble>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("33", 0.3), 600)}px 0px`,
        }}
      >
        <Puppet x={640} y={650} scale={0.82} apron={INK.rich} rich look={-1} />
      </div>
      <QuoteStrip at={at("33", 0.6)} y={220}>
        the same question
      </QuoteStrip>
    </World>
  );
};

// ================================================================ SCENE 5

export const Scene5: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const between = (a: number, b: number) => f >= a && f < b;
  const walk = interpolate(f, [at("39"), at("40") + 20], [0, 380], CLAMP);
  return (
    <World>
      <Puppet
        x={10}
        y={650}
        scale={0.82}
        apron={INK.rich}
        rich
        look={1}
        talk={between(at("37"), at("38"))}
        react={at("35")}
      />
      <div
        style={{ position: "absolute", inset: 0, translate: `${walk}px 0px` }}
      >
        <Puppet
          x={470}
          y={840}
          scale={0.6}
          apron={NAVY}
          rich
          look={walk > 0 ? 1 : -1}
          smile={f >= at("39")}
        />
      </div>
      <Tag at={at("34", 0.2)} x={470} y={150} color={INK.rich} size={60}>
        ① Trade it
      </Tag>
      <Tag
        at={at("36", 0.2)}
        x={440}
        y={260}
        color={INK.rich}
        size={60}
        rotate={1.5}
      >
        ② Name the trade
      </Tag>
      {/* the condition card: 20% OFF for two neighbors */}
      <PinCard at={at("37")} x={480} y={380} w={560} h={300} rotate={-1}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: 26,
          }}
        >
          <div
            style={{
              fontFamily: FONT.sign,
              fontWeight: 800,
              fontSize: 70,
              color: INK.rich,
              lineHeight: 1,
            }}
          >
            20%
            <br />
            OFF
          </div>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: 150,
                height: 200,
                border: "5px dashed #9AA3A8",
                borderRadius: 12,
                padding: 18,
                opacity: 0.6,
              }}
            >
              <House />
            </div>
          ))}
        </div>
      </PinCard>
      <QuoteStrip at={at("37")} y={1395} rotate={1}>
        <span style={{ color: INK.rich }}>
          &quot;Twenty percent off, when two neighbors on your street sign
          up.&quot;
        </span>
      </QuoteStrip>
      <Tag at={at("38", 0.3)} x={540} y={720} size={42} rotate={-1}>
        No sign-ups? Still $60.
      </Tag>
    </World>
  );
};

// ================================================================ SCENE 6

export const Scene6: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const price = f >= at("43");
  return (
    <World>
      {/* one street, three houses */}
      <HouseFront x={20} y={330} w={330} h={330} />
      <HouseFront x={375} y={330} w={330} h={330} />
      <HouseFront x={730} y={330} w={330} h={330} />
      <Tag
        at={at("41", 0.1)}
        x={40}
        y={160}
        color={INK.rich}
        font="sign"
        size={72}
      >
        ③
      </Tag>
      <Puppet x={-20} y={840} scale={0.6} apron={INK.rich} rich look={1} />
      <Puppet
        x={370}
        y={840}
        scale={0.6}
        apron={NAVY}
        cap
        react={at("41", 0.3)}
        sign={price ? "$60" : "SIGNED"}
        signUp={step(f, at("41", 0.3), 6)}
      />
      <Puppet
        x={720}
        y={840}
        scale={0.6}
        apron={NAVY}
        cap
        react={at("41", 0.5)}
        sign={price ? "$60" : "SIGNED"}
        signUp={step(f, at("41", 0.5), 6)}
      />
      <Tag at={at("44")} x={300} y={700} size={48} rotate={-2}>
        Same street
      </Tag>
      <Tag at={at("45")} x={560} y={760} size={48} rotate={2}>
        No driving
      </Tag>
      <Tag
        at={at("46", 0.3)}
        x={420}
        y={150}
        color={INK.rich}
        font="sign"
        size={80}
        rotate={-2}
      >
        $12 / lawn
      </Tag>
    </World>
  );
};

// ================================================================ SCENE 7

export const Scene7: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const lines: ReceiptLine[] = [
    { at: at("48", 0.6), kind: "row", left: "CLIENT $48 - $18", right: "$30" },
    { at: at("50", 0.7), kind: "row", left: "NEIGHBOR $60-$12", right: "$48" },
    { at: at("52"), kind: "row", left: "NEIGHBORS x2", right: "$96" },
    { at: at("53") - 4, kind: "double" },
    {
      at: at("53", 0.3),
      kind: "total",
      left: "PER VISIT",
      right: "$126",
      color: INK.rich,
    },
    { at: at("55"), kind: "stamp", left: "PAID", color: INK.rich },
  ];
  const slamAt = at("53", 0.5);
  return (
    <>
      <World>
        <Tag
          at={at("47", 0.1)}
          x={60}
          y={160}
          color={INK.rich}
          font="sign"
          size={80}
        >
          ④
        </Tag>
        <Puppet
          x={30}
          y={650}
          scale={0.82}
          apron={INK.rich}
          rich
          look={1}
          point={step(f, at("48"), 5) * (1 - step(f, at("52"), 5))}
          react={at("53", 0.4)}
          sign="$126"
          signUp={step(f, slamAt + 24, 6)}
        />
        <ReceiptPrinter
          x={480}
          slotY={1440}
          width={580}
          header="THE RICH WAY"
          sub="LAWN CARE"
          lines={lines}
        />
        <Tag at={at("55", 0.3)} x={130} y={330} size={56} rotate={-3}>
          <span style={{ color: INK.rich }}>$126</span> vs{" "}
          <span style={{ color: INK.poor }}>$66</span>
        </Tag>
      </World>
      <Slam at={slamAt} color={INK.rich}>
        $126
      </Slam>
    </>
  );
};

// ================================================================ SCENE 8

export const Scene8: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const P = 0.6;
  const Y = 840;
  return (
    <World>
      {/* left: POOR + the neighbor who asked for the same discount */}
      <Puppet
        x={-10}
        y={Y}
        scale={P}
        apron={INK.poor}
        sign="$66"
        signUp={step(f, at("58", 0.3), 6)}
      />
      <Puppet
        x={185}
        y={Y}
        scale={P}
        apron={NAVY}
        cap
        sign="$48"
        signUp={step(f, at("56", 0.6), 6)}
      />
      {/* right: RICH + two neighbors at full price */}
      <Puppet
        x={440}
        y={Y}
        scale={P}
        apron={NAVY}
        cap
        sign="$60"
        signUp={step(f, at("57", 0.6), 6)}
      />
      <Puppet
        x={605}
        y={Y}
        scale={P}
        apron={NAVY}
        cap
        sign="$60"
        signUp={step(f, at("57", 0.75), 6)}
      />
      <Puppet
        x={770}
        y={Y}
        scale={P}
        apron={INK.rich}
        rich
        sign="$126"
        signUp={step(f, at("59", 0.3), 6)}
      />

      <QuoteStrip at={at("56")} y={130} out={at("58") - 2}>
        <span style={{ color: INK.poor }}>
          One person gave a discount and got a neighbor asking for one too.
        </span>
      </QuoteStrip>
      <QuoteStrip at={at("57")} y={430} rotate={1.5} out={at("58") - 2}>
        <span style={{ color: INK.rich }}>
          The other sold a discount and got two neighbors at full price.
        </span>
      </QuoteStrip>
      <QuoteStrip at={at("58")} y={170} size={66} out={at("60") - 2}>
        <span style={{ color: INK.poor }}>Poor people give discounts.</span>
      </QuoteStrip>
      <QuoteStrip
        at={at("59")}
        y={400}
        size={66}
        rotate={1.5}
        out={at("60") - 2}
      >
        <span style={{ color: INK.rich }}>Rich people sell them.</span>
      </QuoteStrip>
      <QuoteStrip at={at("60")} y={170} size={80}>
        Same lawn.
      </QuoteStrip>
      <QuoteStrip at={at("61")} y={400} rotate={1.5} size={80}>
        Opposite answer.
      </QuoteStrip>
    </World>
  );
};
