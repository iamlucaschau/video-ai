import { interpolate } from "remotion";
import { easeInOut, lerp, ramp, useBeats } from "../beats";
import { C, F } from "../theme";
import {
  BucketIcon,
  CarIcon,
  ClockIcon,
  FridgeIcon,
  HouseIcon,
  MopIcon,
  SparkleIcon,
} from "../ui/icons";
import { PopIn, PriceTag, Punch, Stamp, Strike } from "../ui/elements";
import { CountUp, Row, Sfx, Show, StepHeader } from "../ui/layout";

/** 25 — same mop and bucket, now on the rich side. */
export const PivotScene: React.FC = () => {
  const { at, end } = useBeats();
  const a = at("25");
  const d = end("25") - a;
  return (
    <>
      <Row y={360}>
        <Punch at={a} size={200} color={C.rich}>
          The rich way
        </Punch>
      </Row>
      <Row y={620} gap={90}>
        <PopIn at={a + d * 0.6}>
          <MopIcon size={300} color={C.text} />
        </PopIn>
        <PopIn at={a + d * 0.75}>
          <BucketIcon size={280} color={C.text} accent={C.bg} />
        </PopIn>
      </Row>
      <Row y={1000}>
        <Punch at={a + d * 0.62} size={86} color={C.muted} font="ui">
          SAME MOP. SAME BUCKET.
        </Punch>
      </Row>
      {/* Riser lands on the first word; impact + bright music start here */}
      <Sfx name="impact" at={a} volume={0.7} />
    </>
  );
};

/** 26–30 — raise to $40, two cheap clients leave. */
export const Step1Scene: React.FC = () => {
  const { frame, at, end } = useBeats();
  const mid = (id: string, k: number) => at(id) + (end(id) - at(id)) * k;
  const leave = ramp(frame, at("27"), 16, easeInOut);

  return (
    <>
      <StepHeader n={1} title="Raise the price" at={0} color={C.rich} />
      <Show from={0} to={at("27")}>
        <Row y={560}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <PriceTag
              value={frame < mid("26", 0.45) ? "$25" : "$40"}
              sub="PER HOUR"
              color={frame < mid("26", 0.45) ? C.muted : C.rich}
              at={at("26")}
            />
          </div>
        </Row>
        <Row y={1080}>
          <PopIn at={mid("26", 0.7)}>
            <div
              style={{
                padding: "14px 30px",
                borderRadius: 999,
                border: `3px solid ${C.rich}`,
                color: C.rich,
                fontFamily: F.ui,
                fontWeight: 900,
                fontSize: 38,
                letterSpacing: "0.08em",
              }}
            >
              NEW INQUIRIES ONLY
            </div>
          </PopIn>
        </Row>
        <Sfx name="ching" at={mid("26", 0.45)} volume={0.35} />
      </Show>

      <Show from={at("27")}>
        <Row
          y={590}
          style={{ flexWrap: "wrap", width: 900, left: 90, gap: 26 }}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const gone = i >= 8;
            return (
              <div
                key={i}
                style={{
                  opacity: gone ? 1 - leave * 0.75 : 1,
                  translate: gone
                    ? `${leave * 60}px ${leave * 40}px`
                    : undefined,
                  rotate: gone ? `${leave * 14}deg` : undefined,
                }}
              >
                <PopIn at={at("27") - 6 + i}>
                  <HouseIcon
                    size={150}
                    color={gone ? C.poor : C.text}
                    accent={C.bg}
                  />
                </PopIn>
              </div>
            );
          })}
        </Row>
        <Show from={at("28")} to={at("29")} fade={4}>
          <Row y={1000}>
            <Punch at={at("28")} size={190} color={C.rich}>
              Good.
            </Punch>
          </Row>
        </Show>
        <Show from={at("29")} fade={4}>
          <Row y={1000}>
            <Stamp
              text="Charity cases"
              at={at("30")}
              color={C.poor}
              size={104}
              rotate={-5}
            />
          </Row>
        </Show>
        <Sfx name="whoosh" at={at("27")} volume={0.35} />
        <Sfx name="impact" at={at("28")} volume={0.45} />
        <Sfx name="impact" at={at("30")} volume={0.5} />
      </Show>
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};

/** 31–37 — kill hourly pricing: $140 flat, 2.5 h → $56/h. */
export const Step2Scene: React.FC = () => {
  const { at, end } = useBeats();
  const mid = (id: string, k: number) => at(id) + (end(id) - at(id)) * k;

  return (
    <>
      <StepHeader n={2} title="Price the house" at={0} color={C.rich} />
      <Show from={0} to={at("32")}>
        <Row y={680}>
          <div style={{ position: "relative" }}>
            <Punch at={at("31")} size={230} color={C.muted}>
              $ / hour
            </Punch>
            <Strike at={mid("31", 0.55)} thickness={22} />
          </div>
        </Row>
        <Sfx name="buzz" at={mid("31", 0.55)} volume={0.3} />
      </Show>

      <Show from={at("32")} to={at("35")}>
        <Row y={540} gap={50}>
          <PopIn at={at("32")}>
            <HouseIcon size={260} color={C.text} />
          </PopIn>
          <PriceTag
            value="$140"
            sub="FLAT"
            color={C.rich}
            at={at("32") + 6}
            scale={0.85}
          />
        </Row>
        <Row y={930} gap={28}>
          <PopIn at={at("33")}>
            <ClockIcon size={120} color={C.text} accent={C.bg} />
          </PopIn>
          <Punch at={at("33") + 3} size={110} color={C.text}>
            2.5 hrs
          </Punch>
          <Punch at={at("34")} size={130} color={C.rich}>
            = $56/hr
          </Punch>
        </Row>
        <Sfx name="ching" at={at("32") + 6} volume={0.3} />
        <Sfx name="impact" at={at("34")} volume={0.45} />
      </Show>

      <Show from={at("35")}>
        <Row y={530}>
          <div style={{ position: "relative" }}>
            <Punch at={at("35")} size={150} color={C.muted}>
              Hours
            </Punch>
            <Strike at={mid("35", 0.6)} />
          </div>
        </Row>
        <Row y={720} gap={20}>
          <PopIn at={at("36")}>
            <SparkleIcon size={80} color={C.gold} />
          </PopIn>
          <Punch at={at("36") + 2} size={130} color={C.rich}>
            A clean house
          </Punch>
          <PopIn at={at("36") + 6}>
            <SparkleIcon size={60} color={C.gold} />
          </PopIn>
        </Row>
        <Row y={940}>
          <Stamp
            text="Price the house"
            at={at("37")}
            color={C.rich}
            size={100}
            rotate={-4}
          />
        </Row>
        <Sfx name="impact" at={at("37")} volume={0.55} />
      </Show>
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};

/** Street layout on the 1080 canvas: 8 lots, 120 px apart. */
const LOT = (i: number) => 60 + i * 120;
const STREET_Y = 820;
const FAR = [
  { x: 610, y: 500 },
  { x: 830, y: 470 },
];

/** 38–41 — fire the two far houses, add two on the same street. */
export const Step3Scene: React.FC = () => {
  const { frame, fps, at, end } = useBeats();
  const mid = (id: string, k: number) => at(id) + (end(id) - at(id)) * k;
  const fireAt = mid("38", 0.3);
  const fire = ramp(frame, fireAt + 8, 12);
  const add = mid("38", 0.7);

  return (
    <>
      <StepHeader n={3} title="Kill the driving" at={0} color={C.rich} />
      <Show from={0} to={at("40")}>
        {/* Road */}
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: STREET_Y + 118,
            height: 44,
            borderRadius: 22,
            background: C.panel,
            borderTop: `3px dashed ${C.line}`,
          }}
        />
        {/* Long drive out to the far houses */}
        <svg
          width={1080}
          height={1920}
          style={{ position: "absolute", inset: 0, opacity: 1 - fire }}
        >
          <path
            d={`M${LOT(5) + 55} ${STREET_Y + 110} C 700 760, 640 700, ${FAR[0].x + 55} ${FAR[0].y + 105}`}
            stroke={C.poor}
            strokeWidth={9}
            strokeDasharray="22 18"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${FAR[0].x + 100} ${FAR[0].y + 60} C 760 520, 800 500, ${FAR[1].x + 10} ${FAR[1].y + 60}`}
            stroke={C.poor}
            strokeWidth={9}
            strokeDasharray="22 18"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{ position: "absolute", left: LOT(i), top: STREET_Y }}
          >
            <PopIn at={i * 2}>
              <HouseIcon size={110} color={C.text} />
            </PopIn>
          </div>
        ))}
        {FAR.map((h, i) => (
          <div
            key={`far-${i}`}
            style={{
              position: "absolute",
              left: h.x,
              top: h.y,
              opacity: 1 - fire,
              scale: String(lerp(fire, 1, 0.5)),
            }}
          >
            <PopIn at={6 + i * 3}>
              <HouseIcon size={110} color={C.poor} accent={C.bg} />
            </PopIn>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.display,
                fontSize: 150,
                color: C.text,
                opacity: ramp(frame, fireAt, 5),
                scale: String(lerp(ramp(frame, fireAt, 6), 2, 1)),
              }}
            >
              ✕
            </div>
          </div>
        ))}
        {[6, 7].map((lot, i) => (
          <div
            key={`new-${i}`}
            style={{ position: "absolute", left: LOT(lot), top: STREET_Y }}
          >
            <PopIn at={add + i * 4}>
              <HouseIcon size={110} color={C.rich} accent={C.bg} />
            </PopIn>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: LOT(6) - 10,
            width: 250,
            top: STREET_Y - 70,
            textAlign: "center",
            fontFamily: F.ui,
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: "0.08em",
            color: C.rich,
            opacity: ramp(frame, add + 8, 8),
          }}
        >
          SAME STREET
        </div>
        <Row y={1080} gap={24}>
          <PopIn at={at("39")}>
            <CarIcon size={110} color={C.text} accent={C.bg} />
          </PopIn>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 110,
              color: C.rich,
              opacity: ramp(frame, at("39"), 6),
            }}
          >
            DRIVING:{" "}
            <CountUp
              from={10}
              to={0}
              at={at("39") + 4}
              frames={Math.round(fps * 0.8)}
              suffix="H"
            />
          </div>
        </Row>
        <Sfx name="buzz" at={fireAt} volume={0.3} />
        <Sfx name="pop" at={add} volume={0.4} />
        <Sfx name="pop" at={add + 4} volume={0.4} />
      </Show>

      <Show from={at("40")}>
        <Row y={540} style={{ left: 60, right: 60 }}>
          <Punch at={at("40")} size={104} color={C.muted}>
            Not the client&apos;s problem
          </Punch>
        </Row>
        <Row y={880}>
          <Stamp
            text="Theirs."
            at={at("41")}
            color={C.rich}
            size={160}
            rotate={-6}
          />
        </Row>
        <Sfx name="impact" at={at("41")} volume={0.5} />
      </Show>
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};

/** 42–45 — fridge upsell, 4 of 8 say yes, +$120/week. */
export const Step4Scene: React.FC = () => {
  const { frame, at, end } = useBeats();
  const mid = (id: string, k: number) => at(id) + (end(id) - at(id)) * k;

  return (
    <>
      <StepHeader n={4} title="One upsell" at={0} color={C.rich} />
      <Show from={0} to={at("44")}>
        <Row y={540} gap={60}>
          <PopIn at={at("43")}>
            <FridgeIcon size={330} color={C.text} accent={C.bg} />
          </PopIn>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 18,
            }}
          >
            <Punch at={mid("43", 0.35)} size={170} color={C.rich}>
              +$30
            </Punch>
            <Punch at={mid("43", 0.7)} size={90} color={C.text}>
              15 min
            </Punch>
          </div>
        </Row>
        <Sfx name="ching" at={mid("43", 0.35)} volume={0.3} />
      </Show>

      <Show from={at("44")}>
        <Row
          y={560}
          style={{ flexWrap: "wrap", width: 760, left: 160, gap: 30 }}
        >
          {Array.from({ length: 8 }).map((_, i) => {
            const yes = i % 2 === 0;
            const lit = ramp(frame, mid("44", 0.5) + i * 2, 8);
            return (
              <PopIn key={i} at={at("44") + i * 2}>
                <div
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 34,
                    background: yes ? interpolateBg(lit) : C.panel,
                    border: `4px solid ${yes && lit > 0.5 ? C.rich : C.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: F.display,
                    fontSize: 90,
                    color: yes && lit > 0.5 ? C.bg : C.muted,
                  }}
                >
                  {yes && lit > 0.5 ? "✓" : ""}
                  {!yes ? (
                    <HouseIcon size={90} color={C.muted} accent={C.panel} />
                  ) : null}
                  {yes && lit <= 0.5 ? (
                    <HouseIcon size={90} color={C.text} accent={C.panel} />
                  ) : null}
                </div>
              </PopIn>
            );
          })}
        </Row>
        <Row y={1010}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 170,
              color: C.rich,
              opacity: ramp(frame, at("45"), 6),
            }}
          >
            +<CountUp from={0} to={120} at={at("45")} frames={18} prefix="$" />
            <span style={{ fontSize: 80, color: C.text }}> /WEEK</span>
          </div>
        </Row>
        <Sfx name="pop" at={mid("44", 0.5)} volume={0.35} />
        <Sfx name="ching" at={at("45") + 18} volume={0.35} />
      </Show>
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};

const interpolateBg = (lit: number) =>
  lit > 0.5
    ? C.rich
    : `rgba(46,229,157,${interpolate(lit, [0, 0.5], [0, 0.4])})`;
