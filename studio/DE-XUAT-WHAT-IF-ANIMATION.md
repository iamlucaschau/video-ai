# Đề xuất: học gì từ skill "what-if-animation" (Lucas duyệt W1–W10 ngày 2026-11-03, đã áp dụng: §7)

*2026-11-03, Luis. Nguồn: https://github.com/kelano86/what-if-animation (commit `8092fb5`, 30/10/2026, **MIT © 2026 FreshStack**). Đã clone nông vào thư mục tạm của phiên, **chỉ đọc**: không cài, không chạy script, không chép gì vào dự án. Áp dụng mục nào thì chỉ sau khi Lucas duyệt mục đó.*

## 1. Skill này là gì

Một dòng chủ đề ("What if you could rewind 10 seconds?") → một tập hoạt hình **15–25 s, 16:9**, kiểu người que dưới ánh hoàng hôn của các kênh "What If" (nổi lên trên YouTube tháng 10/2026). **Mọi khung hình là SVG viết bằng code**, Remotion render. Giọng + SFX tạo bằng **ElevenLabs** (trả phí). Gồm:

| Phần | Nội dung |
|---|---|
| `SKILL.md` | quy trình 8 bước: kịch bản → giọng → shot list → **storyboard** → **tự kiểm still** → animate → âm thanh → master −14 LUFS |
| `references/` | công thức 7 nhịp What If, "look" đo từ video dẫn đầu (nhịp cắt, ánh sáng, cỡ cảnh), danh mục khối dựng, âm thanh, **traps** (bẫy đã gặp) |
| `studio/src/engine/` | **rig nhân vật** (`rig.tsx`, 480 dòng), **bộ dựng phòng phối cảnh** (`room.tsx`, `furnish.tsx`), **ánh sáng** (`light.tsx`, `kit.tsx`), đạo cụ, UI, engine tập (`episode.tsx`: shot là hàm thuần của `t`, có thể chạy ngược / giữ) |
| `scripts/` | `plan.py` (shot list theo từ), `stills.mjs` + `board.py` (storyboard), `motiongrid.py`, `mixcheck.py`, `master.py`, `voice.py` + `sfx.py` (ElevenLabs) |

Nó **trúng đúng chỗ khó nhất của style M** (Squire Explains, D4–D5 đang chờ duyệt): nhân vật đầu tròn có tay chân khớp và bối cảnh vẽ bằng code.

## 2. Điểm hay áp dụng được (W#)

| W# | Điểm hay | Họ làm | Mình đang có | Áp dụng thế nào | Lợi | Công |
|---|---|---|---|---|---|---|
| **W1** | **Rig nhân vật bằng code** | `Pose`: hông x/y/scale, `yaw` (−1 nghiêng trái … 0 chính diện … 1 nghiêng phải: thân hẹp lại, mặt trượt theo), tay / chân 2 khớp `{a, b}`, tay găng (mở / chỉ), 9 biểu cảm, chớp mắt, liếc, `squash` khi tiếp đất, `sway` cho đồ lủng lẳng. `poseAt` nội suy key có ease; mặt **đổi qua một cái chớp mắt**, không biến hình. `walkPose`, `joints` / `toWorld` (gắn đạo cụ vào đúng bàn tay), `LOOKS` = một rig nhiều bộ trang phục, composition `Cast` (bảng nhân vật) | `Chibi` (K): đầu + 5 biểu cảm + miệng theo lời, **không có thân khớp** | chép `rig.tsx` sang kit style M (giữ dòng MIT ở đầu file), đổi đầu cho giống bút pháp của mình, thêm trang phục theo thời kỳ (lính Thế chiến I, hiệp sĩ, samurai, lính Sparta…), bảng nhân vật kiểm trên khung 9:16 | **giải quyết D4 không cần cài `@remotion/rive`** (bỏ mục 🟠 duy nhất) | M |
| **W2** | **Bộ dựng phòng phối cảnh + ánh sáng** | `makeRoom(vp, tường sau, độ sâu)` → điểm `P(u, v, w)`; `RoomShell`, `Box` chỉ vẽ mặt camera thấy, `FloorShadow`, `stand(R, u, w)` cho vị trí + tỉ lệ người; nguồn sáng thấy được (cửa sổ có mặt trời, đèn treo, đèn tường); `LightVeil` (tối vùng giữa, khoét lỗ chỗ có sáng), `Glow`, `Dust`, `Cone`, viền sáng nhân vật (`rimR / rimL / rimRed`), tiền cảnh mờ, hạt + vignette | K có 1 phòng SVG; J / L có engine bản đồ | chép phần phòng + ánh sáng vào kit M; dựng nội thất lịch sử (lều chỉ huy, nhà gỗ, sảnh đá, chiến hào nhìn ngang) bằng code; ngoại cảnh (núi, chiến trường, biển) vẫn dùng ảnh AI | **D5: số ảnh AI mỗi Short giảm từ ~10–14 còn ~5–8**, nội thất nhất quán giữa các tập | M–L |
| **W3** | **Storyboard trước khi animate** | composition `<Id>Board` hiện mỗi shot ở khung `key` của nó; `stills.mjs` render 1 still / shot, `board.py` ghép bảng có chú thích (số shot, cỡ cảnh, giây, lời đọc, ghi chú); **checklist 11 điểm**; người duyệt xem bảng trước khi animate | `review-loop`: still ở mỗi câu VO **sau khi dựng**, có critic | thêm bước 0 vào `review-loop` + `KIT-CONTRACT.md` §5: bảng storyboard 1 still / shot (khung chính), Lucas xem trước khi làm chuyển động; gộp checklist của họ (1 lần nhìn hiểu ngay, cỡ cảnh đổi, sáng có nguồn, nhân vật nổi nhất, có chiều sâu, cảnh đủ đồ, phối cảnh đúng, diễn đúng lời, liên tục, chữ chỉ là tiêu đề / số, của mình) | sửa trên still (2 s / still) thay vì trên render | S |
| **W4** | **Cắt cảnh theo từng TỪ + báo nhịp trước khi render** | `edit: { shot, at: "cookie" }`: cú cắt rơi **2 frame trước từ**; `"paste#2"`, `"+18"`, `"s:4.2"`; `plan.py` in số cắt / phút, cờ shot đứng > 3 s | `beats.tsx` `at(id)` theo **câu**; `words.json` (Whisper) đã có từng từ | thêm `atWord("cookie")` vào beats / `episode.mjs`, và báo nhịp (cắt / phút, shot dài nhất) so với số đo đối thủ trong `INGEST.md` (vd. Squire: shot TB 2,1 s) **trước** khi render | khớp nhịp đối thủ ngay từ kế hoạch | S–M |
| **W5** | **Kiểm giọng có bị che không** | `mixcheck.py`: đo 3 lớp (giọng, SFX, nhạc) theo cửa sổ 0,4 s, liệt kê lúc **đang có lời** mà SFX / nhạc to trong vòng 3 dB của giọng | `stems.py` (demucs) đo nền − giọng **cả bài** của video đối thủ; chưa kiểm từng chỗ trên bản của mình | render âm thanh 3 lớp riêng (prop tắt / bật lớp), chạy kiểm theo cửa sổ, ghi vào `checks.md`; cần cho format dày SFX như Squire (~35 tiếng nhấn / phút) | không còn chữ quan trọng bị SFX nuốt | M |
| **W6** | **Ngữ pháp âm thanh** | tiếng minh hoạ một từ đặt **vào khoảng lặng ngay sau từ**, không đè lên từ; canh theo **lúc tiếng bắt đầu kêu (onset)** hoặc **đỉnh** (whoosh), không theo đầu file; mỗi nhịp có lớp: hành động / "chữ ký" / phản ứng / không khí phòng; **im lặng trước cú ngoặt**; nền thấp (0,1–0,15) dưới câu then chốt | `Sfx at={frame}` phát từ đầu file; luật "tối đa 1 SFX / nhịp, đa số nhịp không cần" | thêm vào AGENTS "Sound design" 4 luật trên; `fetch-sfx.mjs` đo **onset + peak** mỗi file một lần vào `catalog.json`, `Sfx` nhận `align="onset" \| "peak"`. Luật mật độ giữ nguyên, style nào cần dày (M) thì ghi trong README style | SFX trúng hình hơn, giọng rõ hơn | S |
| **W7** | **Kiểm chuyển động** | `motiongrid.py`: lưới khung từng shot đọc như sách lật; checklist: lấy đà trước động tác lớn, **giữ 2 frame** lúc nhân vật nhận ra, vượt rồi lắng khi tiếp đất, hành động rơi đúng từ (±3 frame), không có vật nhảy giữa 2 frame, không gì đứng yên > ~1 s | `sheet-j --from --to --every` làm được lưới khung; chưa có checklist chuyển động | thêm checklist vào `review-loop` (mục "Motion"), dùng `sheet-j` sẵn có, không cần script mới | bắt lỗi diễn nhân vật | S |
| **W8** | **Luật viết kịch bản** | ngôi thứ hai thì hiện tại, câu 3–8 từ; **mỗi câu là một hình** (đọc được trong 1 shot không cần chữ); "sức mạnh" có **một từ, một âm, một hình** lặp lại để người xem học luật; leo thang nhỏ → có ích → hơi rợn; một sự thật có số, đã kiểm, + "That's real."; kết bằng câu hỏi / mối đe doạ | `studio/templates/BOC-TACH-KICH-BAN.md`, `formula.json` `devices` | thêm 3 luật đầu vào mẫu kịch bản của Studio (mục "Luật viết"); "một từ, một âm, một hình" thành trường tuỳ chọn `signature` trong `formula.json`. Khớp với điều đo được ở Squire (ngôi thứ hai, câu ngắn) | kịch bản dựng được hình dễ hơn | S |
| **W9** | **Trường `science` mỗi tập** | mỗi con số: khẳng định + **cách tính** (phép tính viết ra) + nguồn, viết **trước** khi thu giọng | bảng kiểm chứng (✓ ≈ ✗ ?) + nguồn | thêm cột **"Cách tính"** vào bảng kiểm chứng của mẫu tập (`studio/templates/format/episodes/_template/`) | số tự tính không sai đơn vị | S |
| **W10** | **TRAPS.md sống** | danh sách mọi bẫy đã tốn thời gian (vẽ, chuyển động, âm thanh, quy trình), đọc trước khi dựng | rải rác trong README style, AGENTS, `progress.md` | thêm mục bắt buộc "Bẫy đã gặp" vào README mỗi kit (`KIT-CONTRACT.md`), `studio:kit check` báo nếu thiếu | không lặp lỗi giữa các phiên | S |

**Ý tưởng, không cần áp dụng ngay:**
- **W11** shot là hàm thuần của `t` → chạy ngược / giữ một đoạn (hiệu ứng "tua lại"). Code của mình đã theo luật frame, nên làm được khi kịch bản cần.
- **W12** `report.json` mỗi tập (độ dài, LUFS, nhịp, chi phí): mình ghi tương tự vào `progress.md` / `checks.md`.
- **W13** chính format "What If" (7 nhịp, ngôi thứ hai, 15–25 s cold open) có thể đưa vào Studio như một kênh đối thủ để phân tích (Ifverse, FunNotSoFun…): việc riêng, Lucas quyết sau.

## 3. Không nên lấy (trái luật hoặc không cần)

| Của họ | Vì sao không |
|---|---|
| `voice.py` (giọng ElevenLabs) | trả phí (~0,22–0,44 credit / ký tự); gói miễn phí **không cho dùng thương mại** và bắt ghi credit. Mình có Gemini TTS miễn phí, xoay 4 key, có cache, đọc tiếng Việt |
| `sfx.py` (SFX tạo bằng AI) | trái luật "**SFX: chỉ bản ghi thật**" (AGENTS); cùng vấn đề giấy phép. Mình có thư viện Pixabay đã đo độ to |
| `fx: shake`, push-in liên tục, "slow push-in" để cảnh có sức sống | trái luật short-form số 2 (không rung, không máy quay giả). Chỉ dùng như ngoại lệ của từng style, Lucas duyệt (như D3) |
| Khung 1920×1080 cố định, 15–25 s | mình cần 9:16 + vùng an toàn; khi chép rig / phòng thì đặt lại toạ độ cho khung dọc |
| `<Audio>` từ `remotion`, Remotion 4.0.530 | mình dùng `@remotion/media` và 4.0.532; chỉ chép mã nguồn engine, không chép `package.json` |
| Thư viện SFX mẫu của họ (`studio/library/sfx/*.mp3`) | tạo bằng ElevenLabs trên gói trả phí của họ; không rõ quyền dùng lại, và là SFX AI |

## 4. Mình đã có, và hơn họ

| Mảng | Mình | Họ |
|---|---|---|
| Học từ kênh đối thủ | Studio P1–P2: ingest tự động (số liệu, hạng, × trung vị, cắt cảnh, OCR chữ, tách giọng / nền, transcript, bản đồ câu, tiêu đề cả kênh), card + bảng khả thi 4 mức | giải mã bằng tay một lần (5 kịch bản, 1 video đo nhịp) |
| Đóng gói | gói format (Bible, công thức, phong cách dựng, kho chủ đề, bàn giao) + **xuất thành dự án đứng riêng** | một skill cho một format |
| Sau khi đăng | `studio:compare` (bản mình vs đối thủ, cùng bộ đo), `studio:stats` (sổ số liệu, nhập CSV YouTube Studio) | không có |
| Giọng | Gemini TTS miễn phí, nhiều giọng, tiếng Việt, cache theo hash, `batchBy: scene` | ElevenLabs trả phí |
| Âm thanh | SFX **thật** có giấy phép, đo LUFS sẵn, `MusicBed` có duck; master −14 LUFS / −1,5 dBTP | SFX AI; master −14 / −1 (ngang nhau) |
| Khung dọc | luật vùng an toàn 9:16, `safeGuide`, render 4K | chỉ 16:9 |
| Phong cách | thư viện 12 style A–L, gồm 2 engine bản đồ lịch sử (J vệ tinh, L bản đồ chính trị theo năm) | một look |
| Kiểm chứng | bảng kiểm chứng có nguồn (≥ 2 nguồn khi tranh cãi), nhãn ĐO / ƯỚC / QUYẾT | trường `science` (tốt, nhưng 1 nguồn) |
| Duyệt chất lượng | `review-loop` + **critic subagent không làm video**, sửa theo phạm vi (WHERE / PROBLEM / CHANGE / KEEP) | tự kiểm theo checklist |
| Studio Remotion | markup `Interactive.*` kéo thả được | họ ghi rõ Studio không kéo được shot |

**Họ hơn mình ở:** rig nhân vật + bộ dựng phòng / ánh sáng bằng code (W1–W2), storyboard trước khi animate (W3), cắt theo từ (W4), kiểm giọng bị che (W5), ngữ pháp SFX (W6), checklist chuyển động (W7), sổ bẫy (W10).

## 5. Ảnh hưởng tới các quyết định đang chờ (Squire Explains)

- **D4 (rig nhân vật):** đề xuất mới là **chép rig của họ (MIT) làm nền cho style M**, thay cho "mở rộng `Chibi` từ đầu" hay `@remotion/rive`. Mục 🟠 duy nhất trong `KHA-THI.md` sẽ thành 🟢 khi Lucas duyệt W1.
- **D5 (nền):** nội thất dựng bằng bộ phòng (W2), ảnh AI chỉ cho ngoại cảnh → ~5–8 ảnh / Short.
- D1–D3, D6–D9 không đổi.

## 6. Thứ tự đề xuất nếu Lucas duyệt

1. **W3 + W7 + W10** vào `review-loop` / `KIT-CONTRACT.md` (rẻ, dùng cho mọi style).
2. **W6** luật âm thanh vào AGENTS + đo onset / peak trong `catalog.json` + `Sfx align`.
3. **W8 + W9** vào mẫu Studio (`studio/templates/`).
4. **W1 + W2** chép vào kit style M (làm luôn ở Giai đoạn 2 nếu D1 được duyệt), giữ ghi chú MIT; ghi repo vào `reference/README.md`.
5. **W4** cắt theo từ + báo nhịp trong `beats` / `episode.mjs`.
6. **W5** kiểm giọng bị che (cần render 3 lớp âm thanh).

Mỗi bước: `npm run lint`, `studio:kit check` (nếu đụng kit), rồi báo Lucas trước bước sau.

## 7. Đã áp dụng (2026-11-03)

| W# | Ở đâu | Kiểm |
|---|---|---|
| W1 + W2 | `Style Library/toon-engine/` (`rig`, `room`, `furnish`, `light`, `kit`, `anim` + `LICENSE` MIT + README có "Bẫy đã gặp"); `camT` cho khung 9:16, bỏ `shake`. Khung kiểm `ToonCheck.tsx` (composition `Toon-Engine-Check`) | `tsc` sạch; still 9:16 render qua entry tạm `out/toon-check/index.tsx`, vì `src/Root.tsx` đang có thay đổi chưa commit của phiên khác. **Chưa làm:** trang phục theo thời kỳ và đầu theo bút pháp riêng: thuộc kit style M (chờ D1) |
| W3 + W4 | `scripts/shotlist.mjs` (`shots.json` → `shots.timeline.json` + `shotlist.md`, cắt theo từ có `lead`, báo nhịp so với `INGEST.md` cùng hướng khung, `--board` = 1 still / shot qua `sheet-j`); `review-loop` "Step 0" + checklist storyboard; `KIT-CONTRACT.md` §5 bước 6; mẫu FINAL nhắc `shots.json` | `--selftest` ✓; thử trên giọng Thermopylae (6 shot, so với History Maps Lore) + `--board` trên `Style-L-SiegeAtlas-Thermopylae` ✓ |
| W5 | **Khác dự kiến:** không render 3 lớp âm thanh riêng; `scripts/stems.py` tách giọng / nền bằng demucs **trên bản render của mình**, ghi `masked` (cửa sổ 0,4 s lúc đang nói, nền trong vòng 3 dB của giọng); `studio:ingest` đo lại `stems.json` cũ thiếu trường này; `studio:compare` thêm dòng "chỗ giọng bị nền che / phút" + danh sách giây. Gọn hơn và không phải sửa từng video; đổi lại demucs tách không sạch tuyệt đối (ƯỚC) | `--selftest` ✓; chạy trên `l-thermopylae-full.mp4`: 10 cửa sổ ở 28,2–29,4 s và 88,2–89,2 s = 2 tiếng trống `Sfx` đặt ở `at("07")` ("Thermopylae.") và `w("24", 5)` ("Salamis"), tới +7,7 dB trên giọng. **Chưa sửa** (video của phiên style L) |
| W6 | AGENTS "Sound design": 5 luật đặt tiếng; `scripts/sfx-onsets.mjs` → `public/sfx/onsets.json` (110 file: 83 file mở bằng > 50 ms im lặng, trung vị 0,14 s ≈ 4 frame); `fetch-sfx.mjs` chạy nó sau mỗi lần tải; `<Sfx align="start" \| "onset" \| "peak">` (mặc định `start` để video cũ không đổi) | `--selftest` ✓, `npm run lint` ✓. `catalog.json` không đụng tới (đang có thay đổi của phiên khác) |
| W7 | `review-loop` mục "Motion" (lấy đà, giữ 2 frame, vượt + lắng, đúng từ ±3 frame, không nhảy) dùng `sheet:j --every 0.0667` | tài liệu |
| W8 | mẫu `02_CONG-THUC.md` luật 6–9 (mỗi câu là một hình, câu ngắn / ngôi thứ hai, **chữ ký của format** `{{SIGNATURE}}`, cách tính); `formula.json` có trường tuỳ chọn `signature` | `studio:cards --selftest` ✓; sinh thử một gói format: luật mới có, không sót `{{…}}` (đã xoá gói thử) |
| W9 | mẫu `kich-ban-SLUG-FINAL.md`: cột **"Cách tính"** trong bảng kiểm chứng | tài liệu |
| W10 | `KIT-CONTRACT.md` §1: README kit phải có "## Bẫy đã gặp"; `studio:kit check` cảnh báo ⚠ khi thiếu (kit F–L hiện chưa có, vẫn qua), `studio:kit new` tạo sẵn mục này; toon-engine README có mục đầu tiên | `studio:kit --selftest` ✓; `check` F-atomic-retro hiện ⚠ như dự kiến |

Ghi lại repo trong `reference/README.md`. Card Squire: T1 🟠 → 🟢 (`KHA-THI.md` 🟢 18 · 🟡 4 · 🟠 0), `@remotion/rive` = `rejected`; D4 / D5 trong `Test/Squire Explains/BAO-CAO.md` đổi theo W1–W2.

**Đăng ký khung kiểm khi `src/Root.tsx` trống thay đổi của phiên khác:**

```tsx
import { ToonCheck } from "../Style Library/toon-engine/ToonCheck";
<Composition id="Toon-Engine-Check" component={ToonCheck} width={1080} height={1920} fps={30} durationInFrames={120} />
```
