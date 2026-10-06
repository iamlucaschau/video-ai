/**
 * Ep01 "How Poor vs Rich People Buy Their Tools" — scenes 1, 2, 4–8
 * (scene 3 is in Scene3.tsx). Receipt × Paper look; every cue comes from
 * the approved VO timestamps via at("<line id>", fraction).
 */
import { Audio } from "@remotion/media";
import { Easing, interpolate, staticFile } from "remotion";
import { useCues } from "../cues";
import {
  Diorama,
  FONT,
  House,
  Machine,
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

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.out(Easing.cubic);

/** Slide in from `dx` px over 8 frames (stepped). */
const slide = (f: number, at: number, dx: number) =>
  interpolate(f, [at, at + 8], [dx, 0], { ...CLAMP, easing: ease });

/** Camera push 1 → 1.1 at `a`, back to 1 at `b`. */
const push = (f: number, a: number, b: number) =>
  interpolate(f, [a, a + 15, b - 4, b + 12], [1, 1.1, 1.1, 1], {
    ...CLAMP,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

const Stage: React.FC<{
  children: React.ReactNode;
  zoom?: number;
  origin?: string;
}> = ({ children, zoom = 1, origin = "540px 960px" }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      scale: String(zoom),
      transformOrigin: origin,
    }}
  >
    <PaperDefs />
    <Diorama />
    {children}
  </div>
);

const Garage: React.FC = () => (
  <Paper
    bg={PAPER.garage}
    style={{ left: 30, top: 610, width: 470, height: 790 }}
  >
    <div style={{ padding: "56px 36px 0" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            height: 70,
            marginBottom: 24,
            background: PAPER.slat,
            borderRadius: 6,
          }}
        />
      ))}
    </div>
  </Paper>
);

const Printing: React.FC<{ lines: ReceiptLine[] }> = ({ lines }) => (
  <>
    {lines
      .filter((l) => l.kind !== "stamp" && l.at >= 0)
      .map((l, i) => (
        <Audio
          key={i}
          name="Printer"
          src={staticFile("audio/printer.wav")}
          from={l.at}
          volume={0.35}
        />
      ))}
  </>
);

// ================================================================ SCENE 1

export const Scene1: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  return (
    <Stage>
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
            style={{ fontFamily: FONT.sign, fontSize: 104, lineHeight: 1.1 }}
          >
            Buy Their Tools
          </div>
        </div>
      </Paper>

      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("01"), -500)}px 0px`,
        }}
      >
        <Tag
          at={at("01")}
          x={95}
          y={700}
          color={INK.poor}
          font="sign"
          size={64}
        >
          POOR
        </Tag>
        <Puppet x={10} y={800} scale={0.62} apron={INK.poor} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("02"), 500)}px 0px`,
        }}
      >
        <Tag
          at={at("02")}
          x={790}
          y={700}
          color={INK.rich}
          font="sign"
          size={64}
          rotate={2}
        >
          RICH
        </Tag>
        <Puppet x={745} y={800} scale={0.62} apron={INK.rich} rich />
      </div>
      <Tag at={at("02", 0.75)} x={385} y={520} font="sign" size={70} rotate={0}>
        VERSUS
      </Tag>

      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `0px ${slide(f, at("03"), 600)}px`,
        }}
      >
        {f >= at("03") ? <Machine x={378} y={1105} scale={0.85} /> : null}
      </div>
      {/* Opposite order: two arrows running opposite ways */}
      <PaperArrow
        at={at("04")}
        x1={330}
        y1={790}
        x2={650}
        y2={720}
        color={INK.poor}
        bend={-60}
      />
      <PaperArrow
        at={at("04", 0.4)}
        x1={750}
        y1={930}
        x2={430}
        y2={1000}
        color={INK.rich}
        bend={60}
      />
    </Stage>
  );
};

// ================================================================ SCENE 2

export const Scene2: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const bubbleIn = step(f, at("11"), 6);
  const pop = step(f, at("13"), 5);
  return (
    <Stage>
      <Garage />
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("06"), 700)}px 0px`,
        }}
      >
        {f >= at("06") ? <Machine x={240} y={1175} scale={0.7} /> : null}
        <Tag
          at={at("06", 0.1)}
          x={300}
          y={1080}
          color={INK.poor}
          font="sign"
          size={76}
          rotate={-6}
        >
          $400
        </Tag>
      </div>
      <Puppet x={40} y={650} scale={0.82} apron={INK.poor} />

      {/* credit card */}
      {f >= at("07") ? (
        <Paper
          bg="#1F2A44"
          style={{
            left: 600,
            top: 380 - (1 - step(f, at("07"), 6)) * 300,
            width: 400,
            height: 250,
            rotate: "-6deg",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 70,
              width: 70,
              height: 52,
              borderRadius: 8,
              background: "#D9B45A",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              bottom: 40,
              height: 20,
              borderRadius: 6,
              background: "rgba(255,255,255,0.35)",
            }}
          />
        </Paper>
      ) : null}
      <Tag
        at={at("08", 0.2)}
        x={640}
        y={480}
        color={INK.poor}
        font="sign"
        size={64}
        rotate={-6}
      >
        22% APR
      </Tag>
      <PinCard at={at("09")} x={600} y={720} w={420} h={170} rotate={3}>
        <div
          style={{
            fontFamily: FONT.paper,
            fontWeight: FONT.paperWeight,
            fontSize: 58,
            textAlign: "center",
            paddingTop: 34,
            color: PAPER.ink,
          }}
        >
          0 customers
        </div>
      </PinCard>

      {/* "business owner" thought bubble, pops on "a feeling" */}
      {bubbleIn > 0 && pop < 1 ? (
        <div
          style={{
            opacity: 1 - pop,
            scale: String(1 + pop * 0.6),
            transformOrigin: "300px 360px",
          }}
        >
          <Paper
            style={{
              left: 120,
              top: 160,
              width: 400,
              height: 300,
              borderRadius: 150,
              scale: String(bubbleIn),
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              <path
                d="M110 200 L130 110 L170 160 L200 90 L230 160 L270 110 L290 200 Z"
                fill="#E9B949"
              />
              <rect x={110} y={200} width={180} height={34} fill="#C9962B" />
            </svg>
          </Paper>
          <Paper
            style={{
              left: 280,
              top: 480,
              width: 60,
              height: 50,
              borderRadius: 30,
              scale: String(bubbleIn),
            }}
          />
          <Paper
            style={{
              left: 300,
              top: 545,
              width: 34,
              height: 30,
              borderRadius: 17,
              scale: String(bubbleIn),
            }}
          />
        </div>
      ) : null}
      <QuoteStrip at={at("13")} y={190}>
        They bought a <span style={{ color: INK.poor }}>feeling.</span>
      </QuoteStrip>
    </Stage>
  );
};

// ================================================================ SCENE 4

export const Scene4: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, 0, -700)}px 0px`,
        }}
      >
        <Machine x={230} y={1105} scale={0.85} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("34", 0.25), 600)}px 0px`,
        }}
      >
        <Puppet x={600} y={650} scale={0.82} apron={INK.rich} rich />
      </div>
      <QuoteStrip at={at("34", 0.55)} y={240}>
        before spending that $400
      </QuoteStrip>
    </Stage>
  );
};

// ================================================================ SCENE 5

export const Scene5: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const yes = at("38", 0.82);
  return (
    <Stage>
      <Puppet x={40} y={650} scale={0.82} apron={INK.rich} rich />
      <Tag at={at("35", 0.3)} x={540} y={150} color={INK.rich} size={64}>
        ① Book first
      </Tag>

      {/* two booked driveways */}
      <PinCard at={at("36")} x={520} y={290} w={520} h={430} rotate={-1}>
        <div style={{ display: "flex", gap: 24, padding: 26 }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 370,
                background: "#efe9dc",
                borderRadius: 10,
                position: "relative",
              }}
            >
              <div style={{ height: 190, padding: 10 }}>
                <House />
              </div>
              {f >= at("37", 0.3) ? (
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: FONT.sign,
                    fontSize: 58,
                    color: INK.rich,
                  }}
                >
                  $150
                </div>
              ) : null}
              {f >= yes + i * 3 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    top: 30,
                    padding: "2px 18px",
                    border: `7px solid ${INK.rich}`,
                    borderRadius: 12,
                    color: INK.rich,
                    fontFamily: FONT.receipt,
                    fontWeight: 700,
                    fontSize: 60,
                    rotate: "-14deg",
                    scale: String(1 + (1 - step(f, yes + i * 3, 4)) * 1.2),
                  }}
                >
                  YES
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </PinCard>
      <QuoteStrip at={at("38")} y={1395} rotate={1}>
        The first purchase is a customer&apos;s decision to say{" "}
        <span style={{ color: INK.rich }}>YES.</span>
      </QuoteStrip>

      <Tag
        at={at("39", 0.3)}
        x={540}
        y={760}
        color={INK.rich}
        size={64}
        rotate={2}
      >
        ② Rent
      </Tag>
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${slide(f, at("40"), 700)}px 0px`,
        }}
      >
        {f >= at("40") ? (
          <Machine
            x={640}
            y={1110}
            scale={0.7}
            sold={1}
            tag="$60/day"
            tagColor={INK.rich}
          />
        ) : null}
      </div>
      <Tag at={at("40", 0.7)} x={560} y={880} size={44} rotate={-1}>
        confirmed jobs only
      </Tag>
      {/* not for the garage */}
      <PinCard at={at("41", 0.6)} x={60} y={170} w={240} h={220} rotate={-4}>
        <svg width="100%" height="100%" viewBox="0 0 240 220">
          <rect x={30} y={60} width={180} height={140} fill={PAPER.garage} />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={45}
              y={78 + i * 30}
              width={150}
              height={18}
              fill={PAPER.slat}
            />
          ))}
          <path
            d="M20 66 L120 16 L220 66"
            stroke="#6d5640"
            strokeWidth={12}
            fill="none"
          />
          <path
            d="M30 30 L210 200 M210 30 L30 200"
            stroke={INK.poor}
            strokeWidth={16}
            strokeLinecap="round"
          />
        </svg>
      </PinCard>
    </Stage>
  );
};

// ================================================================ SCENE 6/7 receipt

/** The rich receipt: scene 6 prints the first part, scene 7 continues it. */
const useRichLines = (): ReceiptLine[] => {
  const { at } = useCues();
  return [
    { at: at("43"), kind: "row", left: "IN", right: "$300" },
    { at: at("44"), kind: "row", left: "MACHINE RENTAL", right: "-$60" },
    { at: at("45"), kind: "row", left: "FUEL & SUPPLIES", right: "-$40" },
    { at: at("46") - 4, kind: "double" },
    {
      at: at("46"),
      kind: "total",
      left: "LEFT",
      right: "$200",
      color: INK.rich,
    },
    { at: at("46", 0.45), kind: "note", left: "BEFORE TAXES & OVERHEAD" },
    { at: at("51"), kind: "rule" },
    { at: at("51", 0.2), kind: "row", left: "USED MACHINE", right: "-$150" },
    {
      at: at("56", 0.55),
      kind: "total",
      left: "LEFT",
      right: "$50",
      color: INK.rich,
    },
    {
      at: at("57"),
      kind: "row",
      left: "CARD BALANCE",
      right: "$0",
      color: INK.rich,
    },
    { at: at("57", 0.55), kind: "stamp", left: "PAID", color: INK.rich },
  ];
};

// ================================================================ SCENE 6

export const Scene6: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const lines = useRichLines().filter((l) => l.at < at("50") - 10);
  return (
    <Stage zoom={push(f, at("46"), at("47"))} origin="790px 1200px">
      <Machine
        x={240}
        y={1175}
        scale={0.7}
        sold={1}
        tag="RENTAL"
        tagColor={INK.rich}
      />
      <Puppet x={40} y={650} scale={0.82} apron={INK.rich} rich />
      <Tag
        at={at("42", 0.1)}
        x={560}
        y={160}
        color={INK.rich}
        font="sign"
        size={80}
      >
        ③
      </Tag>
      {/* both jobs on one rental day */}
      <PinCard
        at={at("42", 0.3)}
        x={40}
        y={170}
        w={440}
        h={330}
        rotate={-2}
        out={at("47") - 2}
      >
        <svg width="100%" height="100%" viewBox="0 0 440 330">
          <rect x={20} y={20} width={400} height={56} fill="#C9B79A" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect
              key={i}
              x={24 + i * 57}
              y={96}
              width={50}
              height={210}
              fill={i === 3 ? "#d7ecd9" : "#efe9dc"}
            />
          ))}
          <rect
            x={194}
            y={96}
            width={64}
            height={210}
            fill="none"
            stroke={INK.rich}
            strokeWidth={6}
          />
          <g
            style={{
              translate: `0px ${(1 - step(f, at("42", 0.6), 6)) * -60}px`,
            }}
          >
            <path
              d="M206 140 L226 120 L246 140 L246 170 L206 170 Z"
              fill="#7a5c3c"
            />
            <path
              d="M206 220 L226 200 L246 220 L246 250 L206 250 Z"
              fill="#7a5c3c"
            />
          </g>
        </svg>
      </PinCard>
      <ReceiptPrinter
        x={480}
        slotY={1440}
        width={580}
        header="THE RICH WAY"
        sub="PRESSURE WASHING"
        lines={lines}
      />
      <QuoteStrip at={at("47")} y={150}>
        Same two jobs.
      </QuoteStrip>
      <QuoteStrip at={at("48")} y={300} rotate={1}>
        Same prices.
      </QuoteStrip>
      <QuoteStrip at={at("49")} y={450} rotate={-1}>
        <span style={{ color: INK.rich }}>Different equipment bill.</span>
      </QuoteStrip>
      <Printing lines={lines} />
    </Stage>
  );
};

// ================================================================ SCENE 7

export const Scene7: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const lines = useRichLines();
  const knot = slide(f, at("51"), -700);
  return (
    <Stage zoom={push(f, at("56", 0.55), at("57"))} origin="790px 1150px">
      <Puppet x={40} y={650} scale={0.82} apron={INK.rich} rich />
      <Tag
        at={at("50", 0.1)}
        x={560}
        y={150}
        color={INK.rich}
        font="sign"
        size={80}
      >
        ④
      </Tag>
      {/* more work booked */}
      <PinCard
        at={at("50", 0.4)}
        x={40}
        y={170}
        w={420}
        h={300}
        rotate={2}
        out={at("52") - 2}
      >
        <svg width="100%" height="100%" viewBox="0 0 420 300">
          <rect x={20} y={20} width={380} height={50} fill="#C9B79A" />
          {Array.from({ length: 14 }).map((_, i) => (
            <g key={i}>
              <rect
                x={24 + (i % 7) * 54}
                y={86 + Math.floor(i / 7) * 100}
                width={48}
                height={90}
                fill="#efe9dc"
              />
              {i % 3 !== 2 ? (
                <path
                  d={`M${32 + (i % 7) * 54} ${130 + Math.floor(i / 7) * 100} l12 14 l22 -30`}
                  stroke={INK.rich}
                  strokeWidth={7}
                  fill="none"
                  strokeLinecap="round"
                />
              ) : null}
            </g>
          ))}
        </svg>
      </PinCard>

      {/* the knot: the machine POOR sold comes back in from the left */}
      <div
        style={{ position: "absolute", inset: 0, translate: `${knot}px 0px` }}
      >
        {f >= at("51") ? (
          <Machine
            x={240}
            y={1175}
            scale={0.7}
            sold={1}
            tag={f >= at("51", 0.2) ? "$150 USED" : "SOLD $150"}
            tagColor={f >= at("51", 0.2) ? INK.rich : INK.poor}
          />
        ) : null}
      </div>
      <Tag
        at={at("52")}
        x={60}
        y={170}
        color={INK.rich}
        size={56}
        out={at("55") - 2}
      >
        Tested ✓
      </Tag>
      <Tag
        at={at("53")}
        x={60}
        y={280}
        color={INK.rich}
        size={56}
        rotate={1}
        out={at("55") - 2}
      >
        Working ✓
      </Tag>
      <Tag
        at={at("54")}
        x={60}
        y={390}
        color={INK.rich}
        size={56}
        rotate={-1}
        out={at("55") - 2}
      >
        Cash ✓
      </Tag>

      {/* where it came from */}
      {f >= at("55") ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            translate: `${slide(f, at("55"), -300)}px 0px`,
          }}
        >
          <Puppet x={-60} y={1060} scale={0.36} apron={INK.poor} />
        </div>
      ) : null}
      <PaperArrow
        at={at("55", 0.3)}
        x1={140}
        y1={1180}
        x2={250}
        y2={1250}
        color={INK.poor}
        bend={-80}
        dashed
      />
      <QuoteStrip at={at("55")} y={170}>
        The machine the <span style={{ color: INK.poor }}>poor person</span>{" "}
        just sold.
      </QuoteStrip>

      <ReceiptPrinter
        x={480}
        slotY={1440}
        width={580}
        header="THE RICH WAY"
        sub="PRESSURE WASHING"
        lines={lines}
      />
      <Printing lines={lines} />
    </Stage>
  );
};

// ================================================================ SCENE 8

export const Scene8: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  return (
    <Stage>
      <Puppet
        x={10}
        y={830}
        scale={0.62}
        apron={INK.poor}
        sign="−$40"
        signUp={step(f, at("58", 0.3), 6)}
      />
      <Machine x={390} y={1170} scale={0.78} />
      <Puppet
        x={738}
        y={830}
        scale={0.62}
        apron={INK.rich}
        rich
        sign="$50"
        signUp={step(f, at("59", 0.3), 6)}
      />

      <QuoteStrip at={at("58")} y={130} out={at("60") - 2}>
        <span style={{ color: INK.poor }}>
          One person bought a machine and hoped customers would pay for it.
        </span>
      </QuoteStrip>
      <QuoteStrip at={at("59")} y={420} rotate={1.5} out={at("60") - 2}>
        <span style={{ color: INK.rich }}>
          The other found customers, then let them pay for the machine.
        </span>
      </QuoteStrip>

      <QuoteStrip at={at("60")} y={170} out={at("62") - 2}>
        <span style={{ color: INK.poor }}>
          Poor people buy tools to feel like a business.
        </span>
      </QuoteStrip>
      <QuoteStrip at={at("61")} y={420} rotate={1.5} out={at("62") - 2}>
        <span style={{ color: INK.rich }}>
          Rich people let the business buy the tools.
        </span>
      </QuoteStrip>

      <QuoteStrip at={at("62")} y={170} size={74}>
        Same pressure washer.
      </QuoteStrip>
      <QuoteStrip at={at("63")} y={380} rotate={1.5} size={74}>
        Opposite first purchase.
      </QuoteStrip>
    </Stage>
  );
};
