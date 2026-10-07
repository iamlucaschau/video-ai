/**
 * Style D "Text Thread": the episode told on a phone screen — chat threads
 * (client, then the street group chat), a business bank app for the math,
 * notification toasts. Generic UI, no real app branding. Static frame: only
 * the UI moves (messages arrive, rows slide in, counters roll).
 */
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../paper";
import { prog } from "./chipTable";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const BG = "#F2F4F7";
export const INK = "#1E2A36";
const MUTED = "#6B7783";
const font = { fontFamily: FONT.paper, fontWeight: 700 } as const;

// ------------------------------------------------------------------ chrome

const StatusBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 60,
      right: 60,
      top: 22,
      height: 50,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      ...font,
      fontSize: 34,
      color: INK,
    }}
  >
    <span>9:41</span>
    <span style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
      {[14, 20, 26, 32].map((h) => (
        <span
          key={h}
          style={{ width: 8, height: h, background: INK, borderRadius: 2 }}
        />
      ))}
      <span
        style={{
          width: 58,
          height: 28,
          border: `3px solid ${INK}`,
          borderRadius: 8,
          marginLeft: 10,
          padding: 3,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            display: "block",
            width: "80%",
            height: "100%",
            background: INK,
            borderRadius: 3,
          }}
        />
      </span>
    </span>
  </div>
);

export const Avatar: React.FC<{
  color: string;
  text: string;
  size?: number;
  square?: boolean;
}> = ({ color, text, size = 84, square }) => (
  <div
    style={{
      width: size,
      height: size,
      flex: "none",
      borderRadius: square ? size * 0.26 : size / 2,
      background: color,
      color: "#fff",
      ...font,
      fontWeight: 800,
      fontSize: size * 0.44,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {text}
  </div>
);

/** Phone screen: status bar, app header, optional message input. */
export const Screen: React.FC<{
  name: string;
  sub: string;
  avatar: { color: string; text: string; square?: boolean };
  badge?: { text: string; color: string };
  input?: string;
  children: React.ReactNode;
}> = ({ name, sub, avatar, badge, input, children }) => (
  <AbsoluteFill style={{ background: BG }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 210,
        background: "#fff",
        borderBottom: "2px solid #E1E5EA",
      }}
    />
    <StatusBar />
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top: 92,
        display: "flex",
        alignItems: "center",
        gap: 22,
      }}
    >
      <span style={{ ...font, fontSize: 64, color: "#2F80ED", marginRight: 4 }}>
        ‹
      </span>
      <Avatar {...avatar} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            ...font,
            fontWeight: 800,
            fontSize: 44,
            color: INK,
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </div>
        <div
          style={{ ...font, fontSize: 30, color: MUTED, whiteSpace: "nowrap" }}
        >
          {sub}
        </div>
      </div>
      {badge ? (
        <span
          style={{
            background: badge.color,
            color: "#fff",
            ...font,
            fontWeight: 800,
            fontSize: 34,
            padding: "4px 20px 8px",
            borderRadius: 14,
          }}
        >
          {badge.text}
        </span>
      ) : null}
    </div>
    {children}
    {input !== undefined ? (
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 1440,
          height: 92,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 84,
            borderRadius: 42,
            background: "#fff",
            border: "2px solid #DDE2E8",
            ...font,
            fontSize: 36,
            color: "#9AA4AE",
            display: "flex",
            alignItems: "center",
            paddingLeft: 34,
          }}
        >
          {input}
        </div>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            background: "#2F80ED",
            color: "#fff",
            ...font,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ↑
        </div>
      </div>
    ) : null}
  </AbsoluteFill>
);

// ------------------------------------------------------------------ chat

export type Msg = {
  at: number;
  kind: "in" | "out" | "sys" | "card" | "title";
  text?: React.ReactNode;
  /** out/card bubble color (POOR red / RICH green) */
  color?: string;
  /** small label above an out bubble ("POOR") or sender name in a group */
  label?: string;
  avatar?: { color: string; text: string };
  heart?: number;
  strong?: boolean;
  card?: {
    title: string;
    big?: React.ReactNode;
    sub?: React.ReactNode;
    old?: string;
    body?: React.ReactNode;
  };
};

const TYPING = 16;

const Dots: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", gap: 10, padding: "8px 4px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: "#9AA4AE",
            opacity: 0.4 + 0.6 * Math.max(0, Math.sin((f - i * 3) / 3)),
          }}
        />
      ))}
    </span>
  );
};

const bubble = (mine: boolean, color: string): React.CSSProperties => ({
  background: mine ? color : "#fff",
  color: mine ? "#fff" : INK,
  borderRadius: mine ? "36px 36px 10px 36px" : "36px 36px 36px 10px",
  padding: "20px 32px 24px",
  maxWidth: 740,
  ...font,
  fontSize: 46,
  lineHeight: 1.22,
  boxShadow: "0 3px 0 rgba(0,0,0,0.06)",
});

const Item: React.FC<{ m: Msg; typing?: boolean }> = ({ m, typing }) => {
  const color = m.color ?? "#2F80ED";
  if (m.kind === "title") {
    return (
      <div
        style={{
          alignSelf: "center",
          background: "#fff",
          borderRadius: 34,
          padding: "26px 46px 34px",
          textAlign: "center",
          ...font,
          fontWeight: 800,
          color: INK,
          boxShadow: "0 6px 0 rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 50 }}>How Poor vs Rich People</div>
        <div style={{ fontSize: 96, lineHeight: 1.05 }}>Give Discounts</div>
      </div>
    );
  }
  if (m.kind === "sys") {
    return (
      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          maxWidth: 900,
          background: m.strong ? "#fff" : "#E3E7EC",
          border: m.strong ? `4px solid ${m.color ?? INK}` : "none",
          color: m.color ?? (m.strong ? INK : "#4A5560"),
          borderRadius: 30,
          padding: m.strong ? "16px 36px 20px" : "10px 30px 14px",
          ...font,
          fontWeight: 800,
          fontSize: m.strong ? 50 : 38,
          lineHeight: 1.2,
        }}
      >
        {m.text}
      </div>
    );
  }
  if (m.kind === "card") {
    const c = m.card!;
    return (
      <div style={{ alignSelf: "flex-end", textAlign: "right" }}>
        {m.label ? (
          <div
            style={{
              ...font,
              fontWeight: 800,
              fontSize: 30,
              color,
              marginBottom: 6,
            }}
          >
            {m.label}
          </div>
        ) : null}
        <div
          style={{
            width: 640,
            background: "#fff",
            borderRadius: 34,
            overflow: "hidden",
            textAlign: "left",
            ...font,
            color: INK,
            boxShadow: "0 3px 0 rgba(0,0,0,0.06)",
            border: `4px solid ${color}`,
          }}
        >
          <div
            style={{
              background: color,
              color: "#fff",
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: 3,
              padding: "12px 30px 14px",
            }}
          >
            {c.title}
          </div>
          <div style={{ padding: "16px 30px 24px" }}>
            {c.old ? (
              <div
                style={{
                  fontSize: 48,
                  color: "#9AA4AE",
                  textDecoration: "line-through",
                }}
              >
                {c.old}
              </div>
            ) : null}
            {c.big ? (
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 96,
                  lineHeight: 1.05,
                  color,
                }}
              >
                {c.big}
              </div>
            ) : null}
            {c.sub ? (
              <div style={{ fontSize: 36, color: MUTED }}>{c.sub}</div>
            ) : null}
            {c.body ? (
              <div style={{ fontWeight: 800, fontSize: 48, lineHeight: 1.22 }}>
                {c.body}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  const mine = m.kind === "out";
  return (
    <div
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        display: "flex",
        alignItems: "flex-end",
        gap: 16,
      }}
    >
      {!mine ? (
        <Avatar
          color={m.avatar?.color ?? "#90A4AE"}
          text={m.avatar?.text ?? "C"}
          size={64}
        />
      ) : null}
      <div style={{ textAlign: mine ? "right" : "left", position: "relative" }}>
        {m.label ? (
          <div
            style={{
              ...font,
              fontWeight: 800,
              fontSize: 30,
              color: mine ? color : MUTED,
              marginBottom: 6,
            }}
          >
            {m.label}
          </div>
        ) : null}
        <div
          style={{
            ...bubble(mine, color),
            display: "inline-block",
            textAlign: "left",
          }}
        >
          {typing ? <Dots /> : m.text}
        </div>
        {m.heart !== undefined ? <Heart at={m.heart} /> : null}
      </div>
    </div>
  );
};

const Heart: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: -18,
        bottom: -22,
        width: 58,
        height: 58,
        borderRadius: 29,
        background: "#fff",
        border: "3px solid #E1E5EA",
        color: "#E91E63",
        fontSize: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: String(
          interpolate(f, [at, at + 4, at + 9], [0.2, 1.3, 1], CLAMP),
        ),
      }}
    >
      ♥
    </div>
  );
};

/** Message list anchored to the bottom; new messages push older ones up. */
export const Chat: React.FC<{ items: Msg[]; bottom?: number }> = ({
  items,
  bottom = 500,
}) => {
  const f = useCurrentFrame();
  const typing = items.find(
    (m) => m.kind === "in" && f >= m.at - TYPING && f < m.at,
  );
  const grow = (at: number) => ({
    maxHeight: interpolate(f, [at, at + 7], [0, 700], {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    }),
    opacity: prog(f, at, 6),
    flex: "none" as const,
    display: "flex",
    flexDirection: "column" as const,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 220,
        bottom,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        gap: 22,
        padding: "0 44px 10px",
      }}
    >
      {items
        .filter((m) => f >= m.at)
        .map((m, i) => (
          <div key={i} style={grow(m.at)}>
            <Item m={m} />
          </div>
        ))}
      {typing ? (
        <div style={grow(typing.at - TYPING)}>
          <Item m={typing} typing />
        </div>
      ) : null}
    </div>
  );
};

/** Notification sliding down over the header. */
export const Toast: React.FC<{
  at: number;
  out?: number;
  title: string;
  body: React.ReactNode;
  icon: { color: string; text: string };
}> = ({ at, out, title, body, icon }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 8, Easing.out(Easing.back(1.4)));
  const q = out === undefined ? 0 : prog(f, out, 8, Easing.in(Easing.cubic));
  if (q >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 30 + (1 - p) * -260 + q * -260,
        display: "flex",
        gap: 24,
        alignItems: "center",
        background: "rgba(250,251,252,0.97)",
        borderRadius: 40,
        padding: "24px 30px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
        ...font,
      }}
    >
      <Avatar color={icon.color} text={icon.text} size={78} square />
      <div>
        <div style={{ fontWeight: 800, fontSize: 34, color: MUTED }}>
          {title}
        </div>
        <div style={{ fontWeight: 800, fontSize: 46, color: INK }}>{body}</div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ bank app

export type Row = {
  at: number;
  title: React.ReactNode;
  sub?: React.ReactNode;
  subAt?: number;
  value?: React.ReactNode;
  valueAt?: number;
  color?: string;
  icon?: React.ReactNode;
  total?: boolean;
  head?: boolean;
};

/** Transaction rows sliding in, one under the other. */
export const Rows: React.FC<{ rows: Row[]; top?: number }> = ({
  rows,
  top = 440,
}) => {
  const f = useCurrentFrame();
  const shown = rows.filter((r) => f >= r.at);
  if (!shown.length) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top,
        background: "#fff",
        borderRadius: 34,
        overflow: "hidden",
        boxShadow: "0 3px 0 rgba(0,0,0,0.06)",
      }}
    >
      {shown.map((r, i) => {
        const p = prog(f, r.at, 8);
        const flash = 1 - prog(f, r.at + 6, 14);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: r.total
                ? "22px 30px"
                : r.head
                  ? "14px 30px"
                  : "16px 30px",
              borderTop: i ? "2px solid #EEF1F4" : "none",
              background: r.total
                ? "#F7F9FB"
                : `rgba(255,236,150,${0.55 * flash})`,
              maxHeight: 160 * p,
              opacity: p,
              translate: `${(1 - p) * 60}px 0px`,
              ...font,
            }}
          >
            {r.icon ? (
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  background: "#EEF1F4",
                  flex: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  boxSizing: "border-box",
                  fontSize: 38,
                  fontWeight: 800,
                  color: INK,
                }}
              >
                {r.icon}
              </div>
            ) : null}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: r.head ? 34 : r.total ? 46 : 40,
                  color: r.head ? MUTED : INK,
                  letterSpacing: r.head ? 3 : 0,
                }}
              >
                {r.title}
              </div>
              {r.sub && f >= (r.subAt ?? r.at) ? (
                <div style={{ fontSize: 32, color: MUTED }}>{r.sub}</div>
              ) : null}
            </div>
            {r.value && f >= (r.valueAt ?? r.at) ? (
              <div
                style={{
                  fontWeight: 800,
                  fontSize: r.total ? 64 : 48,
                  color: r.color ?? INK,
                  scale: String(
                    interpolate(
                      f,
                      [
                        r.valueAt ?? r.at,
                        (r.valueAt ?? r.at) + 4,
                        (r.valueAt ?? r.at) + 10,
                      ],
                      [0.4, 1.15, 1],
                      CLAMP,
                    ),
                  ),
                }}
              >
                {r.value}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** Summary card for the ending (one per side). */
export const Summary: React.FC<{
  at: number;
  top: number;
  color: string;
  badge: string;
  lines: React.ReactNode[];
  value: string;
}> = ({ at, top, color, badge, lines, value }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 10, Easing.out(Easing.back(1.3)));
  return (
    <div
      style={{
        position: "absolute",
        left: 40,
        right: 40,
        top,
        background: "#fff",
        borderRadius: 40,
        border: `6px solid ${color}`,
        padding: "26px 36px 30px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: Math.min(1, p * 2),
        translate: `0px ${(1 - p) * 80}px`,
        ...font,
      }}
    >
      <div style={{ flex: 1 }}>
        <span
          style={{
            background: color,
            color: "#fff",
            fontWeight: 800,
            fontSize: 34,
            padding: "4px 20px 8px",
            borderRadius: 14,
          }}
        >
          {badge}
        </span>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontWeight: 800,
              fontSize: 40,
              color: i ? MUTED : INK,
              marginTop: 10,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div
        style={{ fontWeight: 800, fontSize: 104, color, whiteSpace: "nowrap" }}
      >
        {value}
      </div>
    </div>
  );
};
