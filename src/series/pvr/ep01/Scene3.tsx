import { Audio } from "@remotion/media";
import { Easing, interpolate, staticFile } from "remotion";
import { useCues } from "../cues";
import {
  Diorama,
  House,
  Machine,
  Paper,
  PAPER,
  PaperDefs,
  PinCard,
  Puppet,
  QuoteStrip,
  ReceiptPrinter,
  step,
  useStepFrame,
  type ReceiptLine,
} from "../paper";
import { INK } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * SCENE 3 — Poor: the math (0:26.9 – 1:08.8), Receipt × Paper look.
 * Wall pinboard tells the story; the printer prints the math line by line
 * exactly when the VO says it.
 */
export const Scene3: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();

  const lines: ReceiptLine[] = [
    { at: at("15"), kind: "row", left: "2 JOBS", right: "x $150" },
    { at: at("16"), kind: "text", left: "= $300" },
    { at: at("20", 0.55), kind: "row", left: "SOLD MACHINE", right: "+$150" },
    { at: at("22", 0.82), kind: "row", left: "CARD $400", right: "→ $450" },
    { at: at("23"), kind: "rule" },
    { at: at("25"), kind: "row", left: "IN", right: "$450" },
    { at: at("26"), kind: "row", left: "OUT", right: "-$450", color: INK.poor },
    {
      at: at("27", 0.15),
      kind: "row",
      left: "FUEL & SUPPLIES",
      right: "-$40",
      color: INK.poor,
    },
    { at: at("30") - 4, kind: "double" },
    {
      at: at("30", 0.1),
      kind: "total",
      left: "TOTAL",
      right: "-$40",
      color: INK.poor,
    },
    { at: at("30", 0.6), kind: "stamp", left: "LOSS", color: INK.poor },
  ];

  const machineOut = interpolate(f, [at("21"), at("21") + 15], [0, -760], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  // Camera: push in on the total, hold, ease back for the quotes
  const push = interpolate(
    f,
    [at("30"), at("30") + 15, at("31") - 4, at("31") + 12],
    [1, 1.1, 1.1, 1],
    {
      ...CLAMP,
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        scale: String(push),
        transformOrigin: "790px 1235px",
      }}
    >
      <PaperDefs />
      <Diorama />

      {/* garage */}
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

      {/* pinboard: two jobs → empty calendar → card statement */}
      <PinCard
        at={at("14")}
        x={40}
        y={160}
        w={250}
        h={235}
        rotate={-3}
        out={at("17")}
      >
        <House />
      </PinCard>
      <PinCard
        at={at("14", 0.5)}
        x={300}
        y={180}
        w={250}
        h={235}
        rotate={3}
        out={at("17")}
      >
        <House />
      </PinCard>
      <PinCard
        at={at("17")}
        x={60}
        y={170}
        w={430}
        h={330}
        rotate={-2}
        out={at("19")}
      >
        <svg width="100%" height="100%" viewBox="0 0 430 330">
          <rect x={20} y={20} width={390} height={60} fill="#C9B79A" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <g key={i}>
              <rect
                x={24 + i * 55}
                y={100}
                width={48}
                height={200}
                fill="#efe9dc"
              />
              <path
                d={`M${32 + i * 55} 150 L${66 + i * 55} 250 M${66 + i * 55} 150 L${32 + i * 55} 250`}
                stroke={INK.poor}
                strokeWidth={7}
                strokeLinecap="round"
                opacity={f >= at("17") + 6 + i ? 1 : 0}
              />
            </g>
          ))}
        </svg>
      </PinCard>
      <PinCard
        at={at("19")}
        x={80}
        y={150}
        w={390}
        h={420}
        rotate={2}
        out={at("31") - 2}
      >
        <div style={{ padding: 30 }}>
          <div
            style={{
              height: 34,
              width: 180,
              background: "#2b2b2b",
              borderRadius: 6,
            }}
          />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 20,
                marginTop: 30,
                opacity: f >= at("19") + 4 + i * 3 ? 1 : 0,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 14,
                  background: "#cfc6b6",
                  borderRadius: 7,
                }}
              />
              <div
                style={{
                  width: 80,
                  height: 14,
                  background: INK.poor,
                  borderRadius: 7,
                }}
              />
            </div>
          ))}
        </div>
      </PinCard>

      <Puppet
        x={40}
        y={650}
        scale={0.82}
        apron={INK.poor}
        sign="−$40"
        signUp={step(f, at("30", 0.2), 6)}
        sweat={f >= at("30")}
      />

      {/* the machine: dusty, sold, gone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          translate: `${machineOut}px 0px`,
        }}
      >
        <Machine
          x={240}
          y={1175}
          scale={0.7}
          sold={step(f, at("20", 0.55), 6)}
        />
      </div>
      <ReceiptPrinter
        x={480}
        slotY={1440}
        width={580}
        header="THE POOR WAY"
        sub="PRESSURE WASHING"
        lines={lines}
      />

      {/* truth punches */}
      <QuoteStrip at={at("31")} y={170} out={at("32") - 2}>
        The only one who made money was{" "}
        <span style={{ color: INK.poor }}>the credit card company.</span>
      </QuoteStrip>
      <QuoteStrip at={at("32")} y={150} rotate={-1}>
        They bought the equipment.
      </QuoteStrip>
      <QuoteStrip at={at("33")} y={320} rotate={1.5}>
        <span style={{ color: INK.poor }}>They never built the demand.</span>
      </QuoteStrip>

      {/* printer sound per printed line */}
      {lines
        .filter((l) => l.kind !== "stamp")
        .map((l, i) => (
          <Audio
            key={i}
            name="Printer"
            src={staticFile("audio/printer.wav")}
            from={Math.max(0, l.at)}
            volume={0.35}
          />
        ))}
    </div>
  );
};
