import { useCues } from "../cues";
import { MoneyBurst, Slam } from "../motion";
import {
  Bubble,
  Diorama,
  Fence,
  Grass,
  Mower,
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

const NAVY = "#37474F";

/** Pinboard icons (fill their card). */
export const Icon: React.FC<{ kind: "gas" | "line" | "blade" | "truck" }> = ({
  kind,
}) => (
  <svg width="100%" height="100%" viewBox="0 0 120 120">
    {kind === "gas" ? (
      <g>
        <path d="M30 40 L86 40 L92 104 L24 104 Z" fill="#E0A63A" />
        <path
          d="M86 40 L100 18 L110 24"
          stroke="#5C6B78"
          strokeWidth={8}
          fill="none"
        />
        <rect x={40} y={26} width={30} height={16} rx={4} fill="#5C6B78" />
      </g>
    ) : kind === "line" ? (
      <g>
        <circle cx={60} cy={62} r={40} fill="#5C6B78" />
        <circle cx={60} cy={62} r={26} fill="#9CCB5A" />
        <circle cx={60} cy={62} r={8} fill="#2F3740" />
      </g>
    ) : kind === "blade" ? (
      <g>
        <path d="M14 70 L106 50 L106 62 L14 82 Z" fill="#9AA3A8" />
        <circle cx={60} cy={66} r={8} fill="#2F3740" />
      </g>
    ) : (
      <g>
        <path
          d="M10 44 L70 44 L70 88 L10 88 Z M70 56 L96 56 L110 72 L110 88 L70 88 Z"
          fill="#5C6B78"
        />
        <circle cx={30} cy={92} r={12} fill="#2F3740" />
        <circle cx={92} cy={92} r={12} fill="#2F3740" />
      </g>
    )}
  </svg>
);

/**
 * Ep02 SCENE 3 — Poor: the math (0:29.4 – 1:11.4). Static frame (no camera
 * moves — Lucas, 2026-10-07); the puppets act, the receipt prints, −29%
 * slams in, the neighbor peeks over the fence, money flies to the client.
 */
export const Scene3: React.FC = () => {
  const { at } = useCues();
  const f = useStepFrame();
  const between = (a: number, b: number) => f >= a && f < b;

  const lines: ReceiptLine[] = [
    { at: at("15", 0.5), kind: "row", left: "COST / CUT", right: "$18" },
    { at: at("17", 0.4), kind: "row", left: "  DRIVING", right: "$6" },
    { at: at("18", 0.6), kind: "row", left: "$60 - $18", right: "$42" },
    {
      at: at("19", 0.6),
      kind: "row",
      left: "$48 - $18",
      right: "$30",
      color: INK.poor,
    },
    { at: at("20", 0.7), kind: "row", left: "PRICE", right: "-20%" },
    {
      at: at("21", 0.6),
      kind: "row",
      left: "PROFIT",
      right: "-29%",
      color: INK.poor,
    },
    { at: at("22") - 4, kind: "rule" },
    { at: at("25", 0.85), kind: "row", left: "NEIGHBOR COST", right: "$12" },
    { at: at("27"), kind: "row", left: "$48 - $12", right: "$36" },
    { at: at("29") - 4, kind: "double" },
    {
      at: at("29", 0.2),
      kind: "total",
      left: "PER VISIT",
      right: "$66",
      color: INK.poor,
    },
    // feed a little more paper so the total clears the printer slot
    { at: at("29", 0.6), kind: "rule" },
  ];
  const slamAt = at("21", 0.55);

  return (
    <>
      <PaperDefs />
      {/* wall, pinboard, fence, neighbor */}
      <Diorama />
      <PinCard
        at={at("16")}
        x={40}
        y={170}
        w={130}
        h={130}
        rotate={-4}
        out={at("22") - 4}
      >
        <Icon kind="gas" />
      </PinCard>
      <PinCard
        at={at("16", 0.35)}
        x={190}
        y={185}
        w={130}
        h={130}
        rotate={3}
        out={at("22") - 4}
      >
        <Icon kind="line" />
      </PinCard>
      <PinCard
        at={at("16", 0.7)}
        x={340}
        y={170}
        w={130}
        h={130}
        rotate={-2}
        out={at("22") - 4}
      >
        <Icon kind="blade" />
      </PinCard>
      <PinCard
        at={at("17")}
        x={150}
        y={345}
        w={200}
        h={130}
        rotate={2}
        out={at("22") - 4}
      >
        <Icon kind="truck" />
      </PinCard>
      {f >= at("22") ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            translate: `0px ${(1 - step(f, at("22"), 8)) * 220}px`,
          }}
        >
          <Puppet
            x={110}
            y={225}
            scale={0.5}
            apron={NAVY}
            cap
            react={at("22") + 8}
            talk={between(at("23"), at("24"))}
            look={1}
          />
        </div>
      ) : null}
      <Fence x={30} y={500} width={470} />
      <Bubble at={at("23")} x={270} y={230} out={at("25")}>
        Me too?
      </Bubble>

      <Grass />
      {/* the poor person, the mower, the printer */}
      <Puppet
        x={40}
        y={650}
        scale={0.82}
        apron={INK.poor}
        sign="−29%"
        signUp={step(f, slamAt + 24, 6)}
        sweat={f >= at("21")}
        look={
          between(at("22"), at("25")) ? -1 : between(at("15"), at("30")) ? 1 : 0
        }
        point={step(f, at("18"), 5) * (1 - step(f, at("20"), 5))}
        slump={step(f, at("21"), 8)}
        react={between(at("24"), at("25")) ? at("24") : at("19", 0.6)}
      />
      <Mower x={260} y={1215} scale={0.62} />
      <ReceiptPrinter
        x={480}
        slotY={1440}
        width={580}
        header="THE POOR WAY"
        sub="LAWN CARE"
        lines={lines}
      />

      <MoneyBurst at={at("30", 0.4)} x1={260} y1={900} x2={820} y2={170} />

      {/* screen-space: slam + truth punches */}
      <Slam at={slamAt} color={INK.poor}>
        −29%
      </Slam>
      <QuoteStrip at={at("30")} y={150} out={at("31") - 2}>
        The only one who got a raise was{" "}
        <span style={{ color: INK.poor }}>the customer.</span>
      </QuoteStrip>
      <QuoteStrip at={at("31")} y={150} rotate={-1}>
        They lowered the price.
      </QuoteStrip>
      <QuoteStrip at={at("32")} y={320} rotate={1.5}>
        <span style={{ color: INK.poor }}>
          They never asked for anything back.
        </span>
      </QuoteStrip>
    </>
  );
};
