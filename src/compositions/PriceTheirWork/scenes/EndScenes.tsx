import { useVideoConfig } from "remotion";
import { ramp, useBeats } from "../beats";
import { C, F } from "../theme";
import { MopIcon } from "../ui/icons";
import { PopIn, PriceTag, Punch, Receipt, Stamp } from "../ui/elements";
import { Row, Sfx, Show } from "../ui/layout";

/** 46–51 — the rich receipt, ending at $62/hr. */
export const RichMathScene: React.FC = () => {
  const { frame, at, end } = useBeats();
  const mid = (id: string, k: number) => at(id) + (end(id) - at(id)) * k;
  const shake =
    frame >= at("51") && frame < at("51") + 10
      ? Math.sin(frame * 2.7) * 10 * (1 - (frame - at("51")) / 10)
      : 0;

  return (
    <>
      <Row y={330} style={{ translate: `${shake}px 0px` }}>
        <Receipt
          title="THE REAL MATH"
          at={at("46")}
          accent={C.richDeep}
          rows={[
            { label: "8 × $140", value: "$1,120", at: mid("47", 0.75) },
            { label: "UPSELLS", value: "+$120", at: at("48") },
            { label: "TOTAL", value: "$1,240", at: at("49"), tone: "total" },
            { label: "HOURS", value: "20", at: at("50") },
            { label: "DRIVING", value: "0", at: mid("50", 0.6) },
          ]}
        />
      </Row>
      <Row y={1010}>
        <Stamp
          text="$62 / hour"
          at={at("51")}
          color={C.rich}
          size={130}
          rotate={-6}
        />
      </Row>
      {[mid("47", 0.75), at("48"), at("49"), at("50"), mid("50", 0.6)].map(
        (f, i) => (
          <Sfx key={i} name="tick" at={f} volume={0.45} />
        ),
      )}
      <Sfx name="impact" at={at("51")} volume={0.6} />
      <Sfx name="ching" at={at("51") + 2} volume={0.45} />
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};

const CompareCard: React.FC<{
  at: number;
  color: string;
  deep: string;
  who: string;
  lines: [string, string];
  rate: string;
}> = ({ at, color, deep, who, lines, rate }) => (
  <PopIn at={at} damping={15}>
    <div
      style={{
        width: 920,
        padding: "34px 44px",
        borderRadius: 40,
        background: `linear-gradient(135deg, ${deep}EE, ${C.panel}EE)`,
        border: `4px solid ${color}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: `0 0 60px ${color}33`,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: F.ui,
            fontWeight: 900,
            fontSize: 36,
            letterSpacing: "0.14em",
            color,
          }}
        >
          {who}
        </div>
        <div
          style={{
            fontFamily: F.display,
            fontSize: 76,
            lineHeight: 1.05,
            color: C.text,
            marginTop: 8,
          }}
        >
          {lines[0]}
          <br />
          {lines[1]}
        </div>
      </div>
      <div style={{ fontFamily: F.display, fontSize: 96, color }}>{rate}</div>
    </div>
  </PopIn>
);

/** 52–56 — the moral, the comparison, the final tag line. */
export const OutroScene: React.FC = () => {
  const { frame, at, end } = useBeats();
  const { durationInFrames } = useVideoConfig();

  return (
    <>
      <Show from={0} to={at("54")}>
        <Row y={500}>
          <Punch at={at("52")} size={150} color={C.text}>
            Nobody underpays you.
          </Punch>
        </Row>
        <Row y={830}>
          <Punch at={at("53")} size={170} color={C.gold}>
            You underprice you.
          </Punch>
        </Row>
        <Sfx name="impact" at={at("53")} volume={0.5} />
      </Show>

      <Show from={at("54")} to={at("56")}>
        <Row y={420}>
          <CompareCard
            at={at("54")}
            color={C.poor}
            deep={C.poorDeep}
            who="POOR"
            lines={["SELL HOURS.", "BLAME THE MARKET."]}
            rate="$17.25"
          />
        </Row>
        <Row y={800}>
          <CompareCard
            at={at("55")}
            color={C.rich}
            deep={C.richDeep}
            who="RICH"
            lines={["SELL OUTCOMES.", "SET THE MARKET."]}
            rate="$62"
          />
        </Row>
        <Sfx name="whoosh" at={at("54")} volume={0.3} />
        <Sfx name="whoosh" at={at("55")} volume={0.3} />
      </Show>

      <Show from={at("56")}>
        <Row y={400} gap={10}>
          <div style={{ marginTop: 40 }}>
            <PriceTag
              value="$17.25"
              sub="PER HOUR"
              color={C.poor}
              at={at("56")}
              scale={0.62}
              textColor={C.text}
            />
          </div>
          <PopIn at={at("56") + 2}>
            <MopIcon size={230} color={C.gold} />
          </PopIn>
          <div style={{ marginTop: 40 }}>
            <PriceTag
              value="$62"
              sub="PER HOUR"
              color={C.rich}
              at={at("56") + 6}
              scale={0.62}
            />
          </div>
        </Row>
        <Row y={860}>
          <Punch at={at("56") + 4} size={130} color={C.text}>
            Same mop.
          </Punch>
        </Row>
        <Row y={1000}>
          <Punch
            at={at("56") + (end("56") - at("56")) * 0.45}
            size={130}
            color={C.gold}
          >
            Opposite price tag.
          </Punch>
        </Row>
        <Sfx name="impact" at={at("56")} volume={0.55} />
      </Show>

      {/* Final fade to black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "black",
          opacity: ramp(frame, durationInFrames - 20, 18),
        }}
      />
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};
