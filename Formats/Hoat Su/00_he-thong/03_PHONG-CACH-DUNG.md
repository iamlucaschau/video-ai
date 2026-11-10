# 03 — PHONG CÁCH DỰNG · Hoat Su (từ bóc tách khung hình tới cách dựng)

*Tạo 2026-11-04 bằng `npm run studio:format -- new`. Bóc tách gốc: `Test/Squire Explains/BOC-TACH-HINH.md` (dải 0–1 s, 3 s cuối, bảng shot từng video, kỹ thuật T#) + `INGEST.md` (số đo). Phần đo + bảng kỹ thuật điền tự động; phần "dựng thế nào" Luis viết, Lucas duyệt. Code: `Style Library/M-hoat-su/README.md`. Mẫu dựng thật: `mau/`.*

## 1. Khung 0–1 s và 3 s cuối

- **Khung 0–1 s (họ):** Short: lời + phụ đề từ frame 0, không logo, không im lặng; khung 0 **vẽ đúng nghịch lý của hook** (tang lễ + người còn sống chia đôi chéo; xe tăng nhấc bằng một tay; cận hàng khiên "YOU'RE"). Video dài: khung 0 không chữ, cận mặt / góc nhìn thứ nhất (`BOC-TACH-HINH.md` §1).
- **Khung 0–1 s (format):** như họ, và khung 0 phải **đọc ra hết các món của nghịch lý** ở cỡ điện thoại (demo: kiếm có chuôi, cung cao hơn đầu, kèn túi xách dưới nách: critic lượt 1 chỉ thấy "một ông cầm gậy"). Một cử động nhỏ trước 1,5 s (ngẩng cằm, đặt tay lên chuôi). Khung 0 không bao giờ đen (`Base`); không chữ ngoài phụ đề.
- **3 s cuối (họ):** cả 6 Short nối vòng bằng hình: frame cuối là frame 0, ~0,3–0,5 s sau lời cuối; câu cuối gọi lại hook bằng nghĩa (xà phòng ↔ "smelled like America"), một chữ / số đỏ to cho từ chốt ("TWICE.", bánh "92"). Video dài: cảnh tổng hoặc end screen, không nối vòng.
- **3 s cuối (format):** về **đúng khung của shot 1** (cùng tư thế, cùng bộ đồ); con số chốt hiện trên một vật (demo: biển giấy "1945–1996" ở chữ "fifty"), rút đi ≥ 10 frame trước cuối; `END` = lời cuối + 0,3 s; `<Freeze frame={0}>` ở frame cuối (D6). Kiểm: frame 0 vs frame cuối lệch trung bình < 0,5 / 255 (demo 0,07).

## 2. Hình theo từng nhịp kịch bản

Mỗi nhịp của `02_CONG-THUC.md` §3 dựng bằng gì (lớp hình, máy quay, chữ ≤ 2 khối ngoài phụ đề, kỹ thuật T#):

| Nhịp | Họ làm (bóc tách) | Format dựng (component) | Chữ trên màn hình |
|---|---|---|---|
| H · nghịch lý | khung 0 = nghịch lý, cắt cận từng món theo từ | `Office` / `Outside` + `Actor` có đủ đạo cụ (`HOOK_GEAR`), cắt cận trên đúng từ (`shots.json` `"01:sword"`) | phụ đề |
| B · bối cảnh + luật | cảnh nhân vật trong bối cảnh, biển nơi · năm, bản đồ ghim | cảnh rộng ngoài trời (`Outside` vẽ code, **lia 1 lần** – camera C), `SignPost` "NƠI NĂM", `PinnedMap` + mũi tên `evolvePath` | biển nơi · năm (1 khối) |
| L · lật lần 1 | rộng ↔ cận cùng bối cảnh, mặt nhân vật đổi biểu cảm | hard cut rộng → cận (`cam(cx, cy, z)` 1,05 · 1,5–1,9 · 2,7), `faceAt` đổi mặt qua một cái chớp, con số thành vật (`Ledger` "42") | con số trên vật |
| T · tệ hơn / lặp | hiệu ứng truyện tranh, khói, nổ, bóng đen | `Burst` (đạn), `WhiteOut` (choáng / tối), `Rocks` che người ngã (không máu), lính địch nhỏ trên đường chân trời tiến dần | ≤ 1 khối |
| Q · câu hỏi / bác tin đồn | điện thoại dọc "video trên mạng nói…" | khung điện thoại vẽ (không logo) có clip vẽ đúng lời đồn + dấu "?" đỏ, rồi shot bác bằng sự thật (demo: xe tải cán cây cung) | biển nơi · năm trong clip |
| K · trớ trêu kết | quay về khung 0, chữ / số đỏ chốt | khung shot 1 + số chốt trên biển, `Freeze` frame cuối | số chốt (1 khối) |

## 3. Kỹ thuật → component (từ `style-card.json`)

| T# | Kỹ thuật | Mức | Quyết định | Cách của mình |
|---|---|---|---|---|
| T1 | Nhân vật đầu tròn trắng viền đen, biểu cảm mặt, tay chân khớp, trang phục theo thời kỳ | 🟢 | dùng (D4) | `Style Library/toon-engine/` rig (Lucas duyệt W1 2026-11-03): tay / chân 2 khớp, 9 biểu cảm, đi, gắn đạo cụ; thêm bộ trang phục theo thời kỳ (Look + extra) trong kit style M; **thân dày có khối** (`body: "chunky"`: tay áo, ống quần, ủng, đổ bóng, má hồng, Lucas duyệt 2026-11-04), lính phụ khác dáng / râu theo seed (`vary`), người thật giữ đúng mặt |
| T2 | Cảnh nền minh hoạ riêng từng shot (15–25 nền / Short) | 🟡 | dùng (D5, đổi 2026-11-04) | nội thất bằng bộ phòng phối cảnh + ánh sáng toon-engine; ngoại cảnh bằng `Outside` vẽ code (Lucas 2026-11-04: **nền code, không dùng ảnh AI**); cảnh mới = một `OutsideKind` mới |
| T3 | Đạo cụ / phương tiện vẽ riêng (xe tăng, máy bay, tàu, khiên có hình, huân chương) | 🟢 | dùng | SVG trong kit (`ww2.tsx`: kiếm, cung, kèn túi, súng, xe tải, xuồng, cáng, huân chương…) |
| T4 | Phụ đề 1–3 từ IN HOA trắng viền đen giữa khung | 🟢 | dùng | `KaraokeSubs oneLine maxWords={3} maxChars={18}` + skin `HoatSuSub` (viền đen 12 px, 68 px) |
| T5 | Bản đồ giấy ghim tường / đặt bàn, nhãn viết tay, chấm quân, mũi tên + vòng đỏ vẽ dần | 🟢 | dùng | `PinnedMap` (kit M, nhận `land` cho từng vùng) + mũi tên `evolvePath` + vòng đỏ |
| T6 | Bảng phấn / sơ đồ chiến thuật (thả bom rồi vòng lên, khối maniple, đồ thị năng lượng) | 🟢 | dùng | `evolvePath` + `RedRing` (K) |
| T7 | Cắt rộng → cận cùng bối cảnh, nền mờ khi cận | 🟢 | dùng | `camT` (toon-engine) đổi cỡ cảnh bằng hard cut + `Foreground` / blur lớp nền |
| T8 | Đẩy / lia máy chậm trong shot (bản đồ, đám đông, mặt cắt) | 🟢 | dùng có giới hạn (D3 + C) | đẩy ≤ 5 % vào giấy / bản đồ; lia ±36 px một lần ở shot rộng ngoài trời mở cảnh (`camMove`, `OPENERS` trong `mau` Video.tsx) |
| T9 | Biển nơi · năm nằm trong cảnh (biển gỗ, đá sơn, biển trại) | 🟢 | dùng | component mới `SignPost` (biển gỗ / đá / bảng) dùng font nhãn của kit |
| T10 | Khung hồi tưởng / nhảy thời gian (ô "LATER…" viền giấy rách, ảnh hồi tưởng ghim, sepia) | 🟢 | dùng | SVG khung + `filter: sepia()` |
| T11 | Hiệu ứng truyện tranh: mũi tên đỏ cong, X đỏ, khói, nổ, chữ tượng thanh, dấu ? ! | 🟢 | dùng | `Burst`, `WhiteOut`, `Sparkle`, `Notes` (`ww2.tsx`); chữ tượng thanh tính là 1 khối chữ (chưa dùng) |
| T12 | Bóng đen trên nền mặt trời / màn tách đôi cho cảnh bạo lực | 🟢 | dùng | SVG fill đen + nền gradient |
| T13 | Đánh dấu "bạn": nhãn YOU + mũi tên trong đám đông, khung ngắm, góc nhìn thứ nhất | 🟢 | dùng | component mới `YouMark` + khung POV (SVG mask) |
| T14 | Mặt cắt lòng đất / nhìn từ trên xuống | 🟢 | dùng | vẽ code trong `Video.tsx` (mặt cắt đường hầm Churchill S25, mép vách Doss S17) + nhân vật rig |
| T15 | Giấy tờ trong truyện: giấy triệu tập, báo, cuộn danh dự gạch tên, trang chép tay, đồng hồ | 🟢 | dùng | `PhotoCard` (J) / thẻ hồ sơ (H) + SVG giấy |
| T16 | Chia khung chéo / răng cưa: hai thực tại cùng lúc | 🟢 | dùng | `clipPath: polygon()` |
| T17 | Màn hình điện thoại "video trên mạng nói…" để bác tin đồn | 🟢 | dùng | khung điện thoại vẽ trong `Video.tsx` của mẫu (S27): clip vẽ + dấu "?" đỏ, không logo nền tảng |
| T18 | Ánh sáng không khí: đèn dầu, nắng ngược, mưa, tuyết, bụi, đèn chiếu | 🟢 | dùng | toon-engine light.tsx / kit.tsx: Glow, Cone, LightVeil, Dust, Rays, Haze, viền sáng rimR / rimL |
| T19 | Con số thành vật trong cảnh (bảng đen "23", vạch khắc báng súng, nến "92", băng rôn "1,100") | 🟢 | dùng | `Counter` + SVG vật mang số |
| T20 | Đám đông nhân bản (hàng trăm nhân vật) + lia ngang | 🟢 | dùng | nhân bản `Hero` (toon-engine) theo `rnd(seed, i)`, đổi Look / màu khiên |
| T21 | Thẻ chú thích bộ phận (vũ khí có nhãn mũi tên) + end screen 2 ô | 🟢 | dùng | `Chip` / `Label` (L) + đường chỉ |
| T22 | Giọng nam Mỹ kể chuyện ~200 wpm, nền −11 dB dưới giọng, SFX dày, master −14 LUFS | 🟡 | dùng | Gemini TTS + `tempo`; nhạc tự tạo bằng code (`make-music.py`, `MusicBed`) + SFX Pixabay / Mixkit (`Sfx`); master `render:style` |

## 4. Dựng một tập, từng bước

1. **Kịch bản FINAL** (Cổng 2) + bảng kiểm chứng + **kế hoạch hình theo shot** (mọi nền vẽ code: Lucas 2026-11-04: **nền code, không dùng ảnh AI**; cảnh ngoài trời chưa có trong `Outside` thì ghi vào kế hoạch để thêm vào kit).
2. **Giọng:** spec (`## SCENE n` + `- **VO:**`) → `node scripts/episode.mjs prep` → `npm run voiceover` (Puck, ~1 request / cảnh) → chỉnh `gapAfter` vài câu cần thở (sau hook, sau câu choáng, trước câu kết) → `episode.mjs export --loop` → `python -P scripts/words.py <slug> en` → nghe lại câu có cảnh báo "check the split".
3. **Cắt theo từ:** `shots.json` (mỗi câu 1–2 shot, cue `"07"`, `"07:word"`), `node scripts/shotlist.mjs <tập>`: trung vị shot ≈ 2,0 s.
4. **Khung code:** chép `mau/` → `Video.tsx` (`Actor`, `cam`, `at`, `w(id, k)`, `camMove` C); đạo cụ / quân phục / ngoại cảnh từ `ww2.tsx` (thời kỳ khác: thêm `Look` + đạo cụ mới vào kit trước).
5. **Storyboard trước chuyển động:** `--board <CompositionId>`; sửa vùng an toàn, người lấn mép, chữ tràn biển, mũ / đồ lệch khỏi người. Lặp đến khi sạch.
6. **Chuyển động:** mỗi shot có ít nhất một hành động theo lời (không chỉ thở / chớp mắt); hit hình trên từ, tiếng nhấn sau từ (W6).
7. **Âm thanh:** `MusicBed` (`own/m-quirky.mp3` hoặc `own/m-resolve.mp3`, tạo bằng `make-music.py`; không nhạc Pixabay) −23…−27, lùi xuống khi có tiếng thật dài (kèn, máy); `Sfx align="onset"/"peak"`; SFX thiếu thì tải (Pixabay / Mixkit → `scripts/fetch-sfx.mjs <list>`; kiểm `catalog.json` còn đủ dòng sau đó).
8. **Review-loop:** sheet + critic subagent mắt mới; sửa theo WHERE / PROBLEM / CHANGE; tối đa 3 lần thử mỗi lỗi rồi hỏi Lucas.
9. **Render + đo:** `npm run render:style -- <id> --to <mp4>` (4K, −14 LUFS) → `npm run studio:compare -- <mp4> --ref "Test/Squire Explains" --force` (thiếu `--force` thì đọc số của bản trước) → `checks.md`, `progress.md`.

## 5. Số đo hình + âm thanh (kiểm ở Cổng 5 bằng `studio:compare`)

| Đo | Họ (trung vị) | Họ (khoảng) | Mục tiêu của format |
|---|---|---|---|
| Shot trung bình (s) | 2,7 | 1,8–4 | **2,0–2,7** cắt theo `shots.json` (demo 2,0 theo shot của mình; compare dò được 3,6 vì gộp shot cùng nền) |
| Shot mở đầu (s) | 3,1 | 1,3–27,6 | **≤ 3,1** (demo 3,0) |
| Điểm cắt mềm / phút | 8,9 | 8–18,6 | **không đặt** (QUYẾT: style cắt cứng; demo 3,9) |
| Thời gian hình đứng yên (%) | 7 | 0–46 | **≤ 85, đọc kèm mắt** (QUYẾT D3 + C: khung đứng, chỉ lia ở shot mở cảnh; demo 80, họ 7). Thấp hơn bằng hành động nhân vật, không bằng máy quay |
| Thời gian chuyển động chậm (%) | 47 | 24–69 | **không đặt** (hệ quả của dòng trên) |
| Từ trên màn hình / khung | 2 | 1–3 | **≤ 3** (demo 3) |
| Khối chữ cùng lúc (tối đa) | 7 | 3–12 | **≤ 3 gồm phụ đề** (luật ≤ 2 ngoài phụ đề; demo 3) |
| Cao chữ trung vị (px / 1080) | 48 | 27–52 | **≥ 52** (demo 57) |
| Chữ nhỏ (10 % nhỏ nhất, px) | 27 | 14–44 | **≥ 48** (demo 52) |
| Khối chữ ngoài vùng an toàn (%) | 10 | 2–66 | **0** (demo 0) |
| Nền − giọng (dB) | -11,4 | -15–-8,6 | **−15…−11** (demo −13,4); chỗ giọng bị che: 0 hoặc nghe lại từng chỗ |
| Tiếng nhấn ở nền / phút | 36,4 | 17–53 | **25–45** (style M được dày hơn mặc định: một tiếng thật cho mỗi hành động thấy được) |
| Độ to (LUFS) | -14,1 | -14,4–-14,1 | **−14 ±1, true peak ≤ −1,5 dBTP** (demo −13,8 / −2,3) |

**Màu (vai trò, đo bằng k-means trên video thắng nhất):**

| Hex | Vai trò |
|---|---|
| `#FFFFFF` | mặt nhân vật (đầu tròn trắng) + phụ đề |
| `#1B1A1F` | viền đen dày mọi hình + viền phụ đề |
| `#938161` | đất / kaki / giấy cũ (nền trung tính chủ đạo) |
| `#6D5649` | gỗ, da, bóng tối trong nhà |
| `#809DB6` | trời / biển xanh nhạt |
| `#C74B46` | nhấn đỏ: mũi tên, vòng, X, chữ khắc, cờ |

## 6. Khác họ có chủ đích (QUYẾT)

| Họ | Format | Vì sao |
|---|---|---|
| Nhãn chữ trong cảnh 14–40 px, 5–11 khối cùng lúc | chữ ≥ 48 px, ≤ 2 khối ngoài phụ đề, một font viết tay chỉ trên vật (D7) | đọc được trên điện thoại (luật short-form 3) |
| Short không gọi tên nhân vật, không năm | tên / nơi / năm trên **biển trong cảnh** (chữ ký format) | người xem tra tiếp được; giữ được cái lạ của hook |
| Giai thoại kể như sự thật | giai thoại yếu bỏ; tin đồn đưa vào nhịp Q rồi bác bằng nguồn | lợi thế uy tín, kênh tham khảo có 4 / 81 khẳng định không kiểm được |
| Đẩy chậm vào bản đồ / tranh, lia đám đông | khung đứng + cắt rộng ↔ cận; một đẩy chậm ≤ 5 % vào giấy / bản đồ; **lia ngang một lần ở shot rộng ngoài trời mở cảnh** (Lucas chọn C, 2026-11-04) | luật "không máy quay giả" của kênh, nới có kiểm soát |
| 15–25 nền vẽ tay riêng | nội thất bằng bộ phòng toon-engine (đèn, bụi, viền sáng), ngoại cảnh cũng vẽ code (Lucas 2026-11-04: **nền code, không dùng ảnh AI**) | làm được mỗi ngày với một người duyệt |
| Kể Việt Nam từ phía lính Mỹ ("enemy") | kể trung lập, gọi đúng tên phe; đề tài Việt Nam chờ chốt thị trường (D8) | an toàn thương hiệu |
| SFX dày, có tiếng hoạt hình | SFX thật (Pixabay / Mixkit) trước, tạo bằng code khi không có file hợp (Lucas 2026-11-04); không tiếng hoạt hình; tiếng nhấn sau từ (W6) | luật sound design của dự án |
