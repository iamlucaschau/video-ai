/**
 * Style K kit test (2026-10-29): a ~28 s animatic of a made-up mini case ("Ai tắt cầu dao?")
 * that walks through every kit part: hook title, interrogation room wide → close cut,
 * timeline, line-up, clue board + 10 s countdown. Every cut and cue comes from the real VO
 * (`k-test.timing.json` + Whisper `k-test.words.json`), so regenerating the voice re-times it.
 * Script: `kich-ban-k-test-FINAL.md`. Composition `Style-K-ChibiCase-Test`.
 */
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "../../../src/voiceover/k-test.timing.json";
import WORDS from "../../../src/voiceover/k-test.words.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { KaraokeSubs } from "../../subs";
import {
  CaseSub, CaseTitle, type ChibiLook, Chibi, ClueBoard, Countdown, Desk, LineUp, NameChip, NightBg, RedRing,
  RoomBack, type Said, Shot, StatusTag, talkOf, Timeline,
} from "../chibi-case";
import { SAFE } from "../../kit-common";

const TRAM: ChibiLook = { name: "Trâm", hair: "long", hairColor: "#3B2A22", shirt: "#8A6E4B", hat: "beret" };
const MINH: ChibiLook = { name: "Minh", hair: "short", shirt: "#4A78B5" };
const LAN: ChibiLook = { name: "Lan", hair: "bun", shirt: "#C4574F" };
const TUAN: ChibiLook = { name: "Tuấn", hair: "short", hairColor: "#4A3426", shirt: "#5E8A4E", glasses: true };

/** VO lines with their speaker: m* = Minh, the rest = Trâm. */
const LINES: Said[] = timing.lines.map((l) => ({ ...l, who: l.id.startsWith("m") ? "Minh" : "Trâm" }));
const line = (id: string) => LINES.find((l) => l.id === id)!;
/** Time (s) the VO says word k of a line. */
const w = (id: string, k: number) => (WORDS as Record<string, number[]>)[id][k];

const CAPTIONS: Record<string, string> = {
  n1: "*22:00*, tiệm bánh tối om.",
  m2: "Tôi chưa hề chạm *cầu dao.*",
  n2: "*3* nghi phạm, *3* khoảng giờ.",
  n3: "*Tuấn* có mặt lúc *22:00.*",
  n5: "Đến lượt bạn: *10* giây.",
};
const CLUES = ["LÒ TẮT 22:00", "KHO CÓ ĐÈN PIN", "LAN VỀ 21:55", "TUẤN GIAO MUỘN", "CẦU DAO DÍNH BỘT", "ÁO MINH SẠCH"];

/** Scene cuts (s), a beat before the line that opens each scene. */
const T = {
  room: line("m1").start - 0.25,
  close: line("m2").start - 0.15,
  timeline: line("n2").start - 0.3,
  lineup: line("n4").start - 0.3,
  board: line("n5").start - 0.3,
  count: line("n5").end + 0.3,
};
const END = T.count + 10.6;

export const kTestDuration = (fps: number) => Math.round(END * fps);

export const KTest: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const F = (s: number) => Math.round(s * fps);
  const talk = (who: string) => talkOf(LINES, who, t, WORDS);

  let scene: React.ReactNode;
  if (t < T.room) {
    scene = (
      <>
        <NightBg />
        <div style={{ filter: "brightness(0.35)" }}>
          <LineUp looks={[MINH, LAN, TUAN]} f={f} />
        </div>
        <CaseTitle time="22:00" title="CẦU DAO BỊ TẮT" f={f} at={F(0.2)} y={360} />
      </>
    );
  } else if (t < T.close) {
    scene = (
      <>
        <RoomBack />
        <Chibi look={MINH} x={430} y={1300} h={520} f={f} mood="worried" talk={talk("Minh")} eyes={0.4} />
        <Desk />
        <Chibi look={TRAM} x={730} y={1500} h={600} f={f} talk={talk("Trâm")} eyes={-0.6} />
        <StatusTag kind="testimony" f={f} at={F(T.room + 0.1)} />
        <NameChip text="MINH · THỢ BÁNH" x={430} y={690} f={f} at={F(T.room + 0.3)} />
      </>
    );
  } else if (t < T.timeline) {
    scene = (
      <>
        <Shot close focus={[430, 950]}>
          <RoomBack />
          <Chibi look={MINH} x={430} y={1300} h={520} f={f} mood="worried" talk={talk("Minh")} />
          <Desk />
        </Shot>
        <StatusTag kind="testimony" f={f} at={F(T.close)} />
      </>
    );
  } else if (t < T.lineup) {
    scene = (
      <>
        <NightBg />
        <Timeline
          rows={[
            { look: MINH, from: 21, to: 22.5, at: F(w("n2", 0)) },
            { look: LAN, from: 21.5, to: 21.92, at: F(w("n2", 3)) },
            { look: TUAN, from: 21.83, to: 22.1, at: F(w("n2", 5)) },
          ]}
          range={[21, 23]}
          event={{ t: 22, at: F(w("n3", 4)) }}
          active={t >= line("n3").start ? 2 : undefined}
          f={f}
        />
        {/* Tuấn's bar: row 3 of the timeline, circled on "giờ" */}
        <RedRing x={565} y={945} r={52} f={f} at={F(w("n3", 5))} />
      </>
    );
  } else if (t < T.board) {
    // each suspect lit in turn across "Một người đang nói dối."
    const step = (line("n4").end - T.lineup) / 3;
    const active = Math.min(2, Math.floor((t - T.lineup) / step));
    scene = (
      <>
        <NightBg />
        <LineUp looks={[MINH, LAN, TUAN]} active={active} f={f} at={F(T.lineup)} activeAt={F(T.lineup + active * step)} />
      </>
    );
  } else {
    scene = (
      <>
        <NightBg />
        <ClueBoard question="AI TẮT CẦU DAO?" clues={CLUES.map((text, i) => ({ text, at: F(T.board + 0.2 + i * 0.22) }))} f={f} />
        <Countdown start={F(T.count)} fps={fps} f={f} x={940 - 100} y={SAFE.top + 90} />
      </>
    );
  }

  return (
    <AbsoluteFill style={{ background: "#111827" }}>
      {scene}
      <Audio src={staticFile("voiceover/k-test/vo.mp3")} name="VO" />
      <KaraokeSubs timing={{ lines: LINES }} words={WORDS} captions={CAPTIONS} Skin={CaseSub} oneLine maxWords={3} maxChars={18} />
      <SafeGuide />
    </AbsoluteFill>
  );
};
