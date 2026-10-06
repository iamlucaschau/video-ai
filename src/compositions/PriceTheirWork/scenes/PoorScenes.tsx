import { ramp, useBeats } from "../beats";
import { C, F } from "../theme";
import { CarIcon, HouseIcon, MopIcon, SprayIcon } from "../ui/icons";
import { PopIn, PriceTag, Punch, Receipt, Stamp, Strike } from "../ui/elements";
import { Bubble, Row, Sfx, Show } from "../ui/layout";

/** 01 — POOR vs RICH title card. */
export const HookScene: React.FC = () => {
  const { at, end } = useBeats();
  const a = at("01");
  const d = end("01") - a;
  return (
    <>
      <Row y={420}>
        <PopIn at={a - 4}>
          <MopIcon size={170} color={C.gold} />
        </PopIn>
      </Row>
      <Row y={640}>
        <Punch at={a} size={250} color={C.poor}>
          Poor
        </Punch>
      </Row>
      <Row y={900}>
        <Punch at={a + d * 0.3} size={90} color={C.gold} font="ui">
          vs
        </Punch>
      </Row>
      <Row y={1000}>
        <Punch at={a + d * 0.45} size={250} color={C.rich}>
          Rich
        </Punch>
      </Row>
      <Sfx name="impact" at={a} volume={0.55} />
      <Sfx name="impact" at={a + d * 0.45} volume={0.45} />
    </>
  );
};

/** 02–08 — $25/hr, ten houses, unpaid driving, supplies. */
export const PoorScene: React.FC = () => {
  const { frame, at, end } = useBeats();
  const houses = Array.from({ length: 10 });
  const barIn = ramp(frame, at("06"), 14);
  const driveIn = ramp(frame, at("07"), 14);

  return (
    <>
      {/* $25 tag, "the market" vs "they did" */}
      <Show from={0} to={at("05")}>
        <Row y={360}>
          <PriceTag
            scale={1.35}
            value="$25"
            sub="PER HOUR"
            color={C.poor}
            at={at("02")}
            textColor={C.text}
          />
        </Row>
        <Show from={at("03")} to={at("04")} fade={4}>
          <Row y={1010}>
            <div style={{ position: "relative" }}>
              <Punch at={at("03")} size={130} color={C.muted}>
                The market
              </Punch>
              <Strike at={at("03") + (end("03") - at("03")) * 0.75} />
            </div>
          </Row>
        </Show>
        <Show from={at("04")} fade={4}>
          <Row y={1010}>
            <Punch at={at("04")} size={150} color={C.poor}>
              They did.
            </Punch>
          </Row>
        </Show>
        <Sfx name="pop" at={at("02") + 4} volume={0.5} />
        <Sfx
          name="buzz"
          at={at("03") + (end("03") - at("03")) * 0.75}
          volume={0.35}
        />
      </Show>

      {/* Ten houses, three hours each */}
      <Show from={at("05")}>
        <Row
          y={360}
          style={{ flexWrap: "wrap", width: 900, left: 90, gap: 26 }}
        >
          {houses.map((_, i) => (
            <PopIn key={i} at={at("05") + i * 2}>
              <HouseIcon size={150} color={C.text} />
            </PopIn>
          ))}
        </Row>
        <Row y={720}>
          <Punch
            at={at("05") + (end("05") - at("05")) * 0.55}
            size={70}
            color={C.gold}
            font="ui"
          >
            × 3 HRS EACH
          </Punch>
        </Row>

        {/* Time bar: 30h cleaning + 10h unpaid driving */}
        <div
          style={{
            position: "absolute",
            top: 850,
            left: 90,
            right: 90,
            opacity: barIn,
          }}
        >
          <div
            style={{
              display: "flex",
              height: 120,
              borderRadius: 24,
              overflow: "hidden",
              background: C.panel,
            }}
          >
            <div
              style={{
                width: `${75 * barIn}%`,
                background: C.text,
                color: C.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.display,
                fontSize: 54,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              30H CLEANING
            </div>
            <div
              style={{
                width: `${25 * driveIn}%`,
                background: `repeating-linear-gradient(45deg, ${C.poor}, ${C.poor} 16px, ${C.poorDeep} 16px, ${C.poorDeep} 32px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <CarIcon size={86} color={C.text} accent={C.poorDeep} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 14,
              fontFamily: F.ui,
              fontWeight: 900,
              fontSize: 40,
              color: C.poor,
              opacity: driveIn,
            }}
          >
            +10H DRIVING · UNPAID
          </div>
        </div>

        {/* Supplies */}
        <Row y={1080} gap={24}>
          <PopIn at={at("08")}>
            <SprayIcon size={130} color={C.text} accent={C.bg} />
          </PopIn>
          <Punch at={at("08") + 4} size={120} color={C.poor}>
            −$60
          </Punch>
          <PopIn at={at("08") + 10}>
            <div
              style={{
                fontFamily: F.ui,
                fontWeight: 800,
                fontSize: 34,
                color: C.muted,
                maxWidth: 260,
              }}
            >
              from their own pocket
            </div>
          </PopIn>
        </Row>
        <Sfx name="tick" at={at("06")} volume={0.4} />
        <Sfx name="buzz" at={at("07") + 6} volume={0.3} />
        <Sfx name="pop" at={at("08")} volume={0.45} />
      </Show>
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};

/** 09–17 — the receipt that ends at $17.25/hr, then "cheap work". */
export const PoorMathScene: React.FC = () => {
  const { frame, at, end } = useBeats();
  const shake =
    frame >= at("14") && frame < at("14") + 10
      ? Math.sin(frame * 2.7) * 10 * (1 - (frame - at("14")) / 10)
      : 0;

  return (
    <>
      <Show from={0} to={at("15")}>
        <Row y={340} style={{ translate: `${shake}px 0px` }}>
          <Receipt
            title="THE MATH"
            at={at("09")}
            accent={C.poor}
            rows={[
              { label: "IN", value: "+$750", at: at("10") },
              { label: "SUPPLIES", value: "−$60", at: at("11"), tone: "minus" },
              { label: "LEFT", value: "$690", at: at("12") },
              { label: "HOURS", value: "÷ 40", at: at("13") },
              {
                label: "PER HOUR",
                value: "$17.25",
                at: at("14"),
                tone: "total",
              },
            ]}
          />
        </Row>
        <Row y={1090} gap={30}>
          <div style={{ position: "relative" }}>
            <Punch at={at("14") + 8} size={96} color={C.muted}>
              $25/hr
            </Punch>
            <Strike at={at("14") + 14} thickness={10} />
          </div>
          <Punch at={at("14") + 12} size={110} color={C.poor}>
            → $17.25
          </Punch>
        </Row>
        {(["10", "11", "12", "13"] as const).map((id) => (
          <Sfx key={id} name="tick" at={at(id)} volume={0.45} />
        ))}
        <Sfx name="impact" at={at("14")} volume={0.6} />
      </Show>

      <Show from={at("15")}>
        <Row y={470}>
          <div style={{ position: "relative" }}>
            <Punch at={at("15")} size={210} color={C.text}>
              Hard work
            </Punch>
            <Strike
              at={at("16") + (end("16") - at("16")) * 0.4}
              thickness={20}
            />
          </div>
        </Row>
        <Row y={780}>
          <Punch at={at("17")} size={170} color={C.poor}>
            Cheap work
          </Punch>
        </Row>
        <Row y={980}>
          <Punch
            at={at("17") + (end("17") - at("17")) * 0.55}
            size={120}
            color={C.poor}
            style={{ opacity: 0.85 }}
          >
            + long hours
          </Punch>
        </Row>
        <Sfx
          name="buzz"
          at={at("16") + (end("16") - at("16")) * 0.4}
          volume={0.35}
        />
        <Sfx name="impact" at={at("17")} volume={0.4} />
      </Show>
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};

/** 18–24 — discounts, the far house, "backbone problem". */
export const BackboneScene: React.FC = () => {
  const { frame, fps, at, end } = useBeats();
  const mid = (id: string, k: number) => at(id) + (end(id) - at(id)) * k;
  const route = ramp(frame, at("22"), Math.round(fps * 1.2));

  return (
    <>
      <Show from={0} to={at("20")}>
        <div
          style={{
            position: "absolute",
            top: 380,
            left: 70,
            right: 70,
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          <Bubble at={at("18")} side="left" color={C.panel}>
            Can you do it a bit cheaper?
          </Bubble>
          <Bubble at={mid("18", 0.7)} side="right" color={C.poor}>
            Sure, no problem!
          </Bubble>
          <Bubble
            at={at("19")}
            side="right"
            color="transparent"
            textColor={C.muted}
            italic
          >
            (later) ugh… cheap clients.
          </Bubble>
        </div>
        <Sfx name="pop" at={at("18")} volume={0.4} />
        <Sfx name="pop" at={mid("18", 0.7)} volume={0.4} />
      </Show>

      <Show from={at("20")} to={at("22")}>
        <Row y={470}>
          <Punch at={at("20")} size={150} color={C.text}>
            Nobody forced it
          </Punch>
        </Row>
        <Row y={760}>
          <Stamp text="Volunteered" at={at("21")} color={C.poor} size={130} />
        </Row>
        <Sfx name="impact" at={at("21")} volume={0.5} />
      </Show>

      <Show from={at("22")} to={at("23")}>
        <div
          style={{
            position: "absolute",
            top: 360,
            left: 90,
            width: 900,
            height: 700,
          }}
        >
          <svg
            width={900}
            height={700}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(0 ${100 - route * 100}% 0 0)`,
            }}
          >
            <path
              d="M150 560 C 360 560, 380 200, 760 160"
              stroke={C.poor}
              strokeWidth={12}
              strokeDasharray="28 22"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div style={{ position: "absolute", left: 70, top: 470 }}>
            <PopIn at={at("22")}>
              <HouseIcon size={170} color={C.text} />
            </PopIn>
          </div>
          <div style={{ position: "absolute", left: 670, top: 60 }}>
            <PopIn at={at("22") + 8}>
              <HouseIcon size={170} color={C.poor} accent={C.bg} />
            </PopIn>
          </div>
          <div
            style={{
              position: "absolute",
              left: 330,
              top: 300,
              rotate: "-12deg",
            }}
          >
            <PopIn at={mid("22", 0.35)}>
              <div
                style={{ fontFamily: F.display, fontSize: 110, color: C.gold }}
              >
                45 MIN
              </div>
            </PopIn>
          </div>
        </div>
        <Row y={1000}>
          <Bubble at={mid("22", 0.8)} side="right" color={C.poor}>
            Yes, of course!
          </Bubble>
        </Row>
        <Sfx name="pop" at={mid("22", 0.8)} volume={0.4} />
      </Show>

      <Show from={at("23")}>
        <Row y={440}>
          <div style={{ position: "relative" }}>
            <Punch at={at("23")} size={150} color={C.muted}>
              Pricing problem
            </Punch>
            <Strike at={mid("23", 0.7)} />
          </div>
        </Row>
        <Row y={760}>
          <Stamp
            text="Backbone problem"
            at={mid("24", 0.35)}
            color={C.poor}
            size={112}
            rotate={-6}
          />
        </Row>
        <Sfx name="buzz" at={mid("23", 0.7)} volume={0.3} />
        <Sfx name="impact" at={mid("24", 0.35)} volume={0.6} />
      </Show>
      <Sfx name="whoosh" at={0} volume={0.3} />
    </>
  );
};
