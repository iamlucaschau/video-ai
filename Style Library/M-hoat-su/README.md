# M · Hoạt Sử

*Thêm 2026-11-03 (Lucas duyệt D1–D9), học từ kênh **Squire Explains** (`Test/Squire Explains/BAO-CAO.md`, card `style-card.json`, công thức `formula.json`). Hoạt hình 2D: **chuyện một người đi ngược luật của thời đó**, nhân vật đầu tròn có tay chân, nội thất phối cảnh có đèn, cắt rộng ↔ cận theo từng từ. Nhân vật, phòng, ánh sáng: `Style Library/toon-engine/` (MIT). Trạng thái: **kit v1 + bản test** (`m-test/`, chờ Lucas duyệt).*

## Look

- **Khung:** 9:16 trước (Short 60–75 s); video dài 16:9 là gói sau (D2).
- **Nhân vật:** rig của toon-engine (đầu tròn trắng viền đen, 9 biểu cảm đổi qua cái chớp mắt, tay / chân 2 khớp), trang phục theo thời kỳ = một `Look` trong `CAST` + đồ đội đầu / ria / huân chương vẽ qua `OnHead` / `OnChest` (theo đúng tư thế, kể cả khi xoay người).
- **Cảnh:** nội thất bằng bộ phòng phối cảnh (`Office` trên `ROOM`): cửa sổ (đêm / hoàng hôn / mái ngói), đèn treo, bàn, `LightVeil` để mọi ánh sáng có nguồn. Ngoại cảnh (núi, chiến trường, biển): ảnh AI 2D phẳng do Lucas tạo, không người trong ảnh (D5, ~5–8 ảnh / Short; bản test không cần).
- **Chữ:** phụ đề 1–3 từ IN HOA trắng viền đen (Bricolage 800, 68 px); chữ trong cảnh viết tay (`HAND` = Mali 700, có tiếng Việt) chỉ trên vật: biển nơi · năm, bản đồ, sổ (D7).
- **Kết:** câu trớ trêu, cắt ≤ 0,3 s sau chữ cuối, **frame cuối = frame 0** (`<Freeze frame={0} active>` ở frame cuối, D6).

## Màu (vai trò)

| Token | Hex | Vai trò |
|---|---|---|
| `M.bg` | `#16121C` | phòng tối quanh vùng đèn |
| `M.ink` | `#1B1A1F` | viền dày mọi hình, viền phụ đề |
| `M.paper` | `#EADBB8` | bản đồ, biển giấy, giấy tờ |
| `M.wood` / `M.khaki` | `#6D5649` / `#938161` | gỗ, kaki |
| `M.sky` | `#809DB6` | trời, biển |
| `M.accent` | `#C74B46` | mũi tên, vòng, X, con số quan trọng trên giấy |
| `M.gold` | `#E7B651` | huy hiệu, ánh loé của huân chương |

## Luật riêng (Lucas duyệt 2026-11-03)

- **Nền (Lucas 2026-11-04: **nền code, không dùng ảnh AI**, thay D5):** nội thất và ngoại cảnh đều vẽ bằng code (`Office` / `ROOM`, `Outside` trong `ww2.tsx`); không viết prompt ảnh AI, không chờ ảnh. Video Churchill giữ 6 ảnh đã làm (`Outside` vẫn dùng ảnh nếu file có trong `public/`, nên đừng thả ảnh vào thư mục của tập mới).

- **Camera (D3):** luật K: khung đứng, đổi cỡ cảnh bằng hard cut (rộng ≈ 1,05 · vừa 1,5–1,9 · cận 2,7 · cận ngực 3). **Một ngoại lệ:** đẩy chậm vào bản đồ / giấy ghim tường, ≤ 5 % / 3 s, ease, không nảy (S11 của bản test: 1 → 1,04). **Ngoại lệ thứ hai (Lucas chọn C, 2026-11-04, sau đoạn so sánh `m-churchill/cam-so-sanh.mp4`):** shot rộng ngoài trời mở ra một nơi mới được lia ngang một lần, chậm, ease in-out, cả shot, ±36 px trên khung phóng 1,05 (`camMove` trong `m-churchill/Video.tsx`, `OPENERS`); shot mở đầu và shot kết không bao giờ có máy quay (frame cuối = frame 0). Không rung, không lắc, không đẩy / lia ở các shot khác.
- **Chữ (D7):** ngoài phụ đề tối đa 2 khối; một font viết tay đậm **chỉ trên vật trong cảnh**, ≥ 48 px, ≤ 4 từ. Không đưa câu VO lên màn hình.
- **Nối vòng (D6):** bằng hình (frame cuối = frame 0), không bắt câu cuối nối vào câu đầu (khác §2.5 của Style Library, chỉ cho M).
- **Âm thanh:** dày hơn mặc định (style này được phép): một tiếng (thật trước; tạo bằng code khi không có file hợp, Lucas 2026-11-04) cho mỗi hành động thấy được (đóng dấu, gõ máy, lật trang, ghi), đặt **sau** từ nó minh hoạ, `align="onset"` / `"peak"` (AGENTS "Sound design"). Nhạc: nhạc **tự tạo bằng code** (`python -P scripts/make-music.py m-quirky|m-resolve public/sfx/music/own/<tên>.mp3 --seconds 100`; không ai giữ bản ghi nên Content ID không có gì để khớp). **Không** dùng nhạc Pixabay / Mixkit / thư viện "free" (Lucas 2026-11-04): `m-quirky` (D thứ, pizzicato + celesta, chuyện điên mà thật) hoặc `m-resolve` (F trưởng, chậm, ấm, chuyện can đảm lặng lẽ); −23…−27 LUFS, duck dưới câu kết.
- **Đề tài (D8):** chiến tranh hiện đại kể trung lập, gọi đúng tên phe; không biểu tượng bị cấm trên nền tảng (Thập tự Sắt vẽ không có chữ thập ngoặc).
- **Tên nhân vật:** VO có thể không gọi tên (như họ), nhưng tên / nơi / năm phải có trên một vật trong cảnh hoặc trong mô tả, để người xem tra tiếp được.

## Code (`hoat-su.tsx`)

| Phần | Việc | T# |
|---|---|---|
| `M`, `HAND`, `Base`, `Chip`, `HoatSuSub` | màu, font viết tay, nền, chip (hiếm dùng), skin phụ đề | T4 |
| `CAST` (`spy`, `brit`, `ger`, `ghost`) | trang phục Thế chiến II trên rig toon-engine | T1 |
| `OnHead`, `OnChest`, `Moustache`, `Cap` | vẽ đồ theo đầu / ngực của tư thế: ria, mũ lưỡi trai Anh / Đức | T1 |
| `IronCross`, `Mbe` | huân chương có ánh loé (`glint` 0→1) | T3 |
| `SignPost` | biển gỗ / giấy viết tay "NƠI NĂM" nảy vào | T9 |
| `Ledger` | trang sổ có con số viết tay (số là vật trong cảnh) | T19 |
| `ROOM`, `Office` | phòng phối cảnh 9:16: tường theo nơi (`warm`, `grey`, `green`), cửa sổ `night` / `dusk` / `roofs`, đèn treo, bàn, ánh sáng | T2, T18 |
| `PinnedMap` | bản đồ giấy ghim tường, nhãn viết tay, mũi tên đỏ vẽ dần (`evolvePath`) | T5 |
| `ghostSpots` | vị trí (seed) cho đám đông nhân bản | T20 |

**`ww2.tsx` (video mẫu Churchill, 2026-11-04):**

| Phần | Việc | T# |
|---|---|---|
| `TROOPS` (`jack`, `tommy`, `landser`), `Brodie`, `Stahl` | quân phục kaki Anh / xám Đức, mũ sắt Anh / Đức (không biểu tượng) | T1 |
| `Sword`, `Scabbard`, `Bow`, `BowOnBack`, `Arrow`, `Target`, `Pipes` (`carry`), `Rifle`, `handAt`, `PIPE_ARMS`, `HANDS_UP` | đạo cụ cầm tay theo khớp tay của rig; tư thế thổi kèn, giơ tay hàng | T1 |
| `Lorry`, `LandingCraft` | xe tải 1940, xuồng đổ bộ (bánh xe quay theo x, cửa dốc hạ) | T2 |
| `Outside` (`field`, `road`, `fjord`, `town`, `alley`, `hill`, `fence`, `jungle`, `ridge`, `cliff`, `night`) | ngoại cảnh **vẽ bằng code** (Lucas 2026-11-04: **nền code, không dùng ảnh AI**): trời, đất, 2–3 mảng hình, mây / tuyết / mưa / sao / khói chuyển động; chỉ khi có file ảnh trong `public/` thì dùng ảnh (giữ cho video Churchill) | T2, T14 |
| `sets.tsx` `CodeSet` (11 cảnh: `field`, `road`, `fjord`, `town`, `alley`, `hill`, `fence`, `jungle`, `ridge`, `cliff`, `night`) | ngoại cảnh vẽ code kiểu minh hoạ phẳng (nâng cấp 2026-11-04): lớp xa / vừa / gần có viền mực, sương chân trời, mặt trời / trăng có quầng, góc tối, cỏ / đá trên đất, mây / khói / tuyết / mưa / sao chuyển động. Xem cả bộ: composition `Style-M-HoatSu-Sets` (`node scripts/sheet-j.mjs Style-M-HoatSu-Sets --frames 15,45,75,105,135,165,195,225,255,285,315`) | T2, T14, T18 |
| `look.tsx` `ShotLook`, `dofFor`, `Defocus`, `GRADE` / `GradeWash`, `LookDefs`, `Lit`, `Foreground`, `flashAlpha` | nhìn theo shot (claude-animated-shorts N1–N4, N8, N14; Lucas duyệt 2026-11-04): nền nhoè ở shot cận / vừa theo `size` trong `shots.json`, grade theo ánh sáng (`indoor` / `day` / `golden` / `night`), người ngả màu cảnh + bóng đuôi theo nắng, vật tiền cảnh mờ, vân plaster / gỗ / cỏ / bùn / đá, chớp trắng sau hook. Cách gắn: `m-doss/Video.tsx` (`LIGHT`, `FG`, `XFADE`, `ShotLayer`) | T2, T7, T18 |
| `SpeedLines`, `DustPuff`, `Splash` (`ww2.tsx`) | vệt tốc độ, bụi khi tiếp đất, nước bắn (N7) | T11 |
| Nhân vật (toon-engine + kit) | đầu hạt đậu `head: "bean"`, viền tím than `PLUM` dày ở phía tối (N9); chớp mắt `blinkAt` mỗi 0,5–2,3 s, 4 frame (N5); đi `walkFrom` (x theo bước chân, nhún 5 %, nghiêng 1–7°) (N6) | T1 |
| `Rocks`, `Burst`, `WhiteOut`, `Sparkle`, `Notes` | chỗ nấp, đạn cối nổ (lửa + đất + khói), lựu đạn (trắng rồi đen), ánh loé lưỡi kiếm, nốt nhạc | T11, T12 |

Điện thoại bác tin đồn (T17) và mặt cắt đường hầm (T14) dựng thẳng trong `m-churchill/Video.tsx` (S25, S27).

**Chưa có (làm khi tập cần):** bảng phấn (T6), khung "LATER…" (T10), chữ tượng thanh (T11), nhãn YOU (T13), chia khung chéo (T16), thẻ chú thích bộ phận (T21), trang phục thời kỳ khác (hiệp sĩ, samurai, lính cổ đại).

## Bản test

`m-test/Video.tsx`, composition `Style-M-HoatSu-Test` (~33 s, 15 shot, 191 wpm). Garbo, điệp viên được cả Đức lẫn Anh trao huân chương (D9). Kịch bản + kiểm chứng: `m-test/kich-ban-m-test-FINAL.md`; spec: `01_EPISODE-SPEC_m-test.md`.

- Pipeline: `node scripts/episode.mjs prep` → `npm run voiceover -- voiceover/m-test.json` (Puck, 6 request) → `node scripts/episode.mjs export "Style Library/M-hoat-su/m-test" --loop` → `python -P scripts/words.py m-test en` → `m-test/shots.json` → `node scripts/shotlist.mjs "Style Library/M-hoat-su/m-test" --board Style-M-HoatSu-Test` (storyboard) → `npm run render:style -- Style-M-HoatSu-Test --to "Style Library/M-hoat-su/m-test/m-test.mp4"` → `npm run studio:compare -- "Style Library/M-hoat-su/m-test/m-test.mp4" --ref "Test/Squire Explains"`.
- Mọi cú cắt nằm trong `shots.json` (cắt trên từ, 2 frame trước từ); `Video.tsx` đọc `shots.timeline.json`.

## Video mẫu (Giai đoạn 3)

`m-churchill/Video.tsx`, composition `Style-M-HoatSu-Churchill` (~62 s, 29 shot, 201 wpm). Jack Churchill, sĩ quan đánh Thế chiến II bằng kiếm, cung và kèn túi. Kịch bản v1 → v2 → FINAL + kiểm chứng 19 dòng: `m-churchill/kich-ban-m-churchill-FINAL.md`. Cùng pipeline như bản test (Puck, 7 request).

## Nhân vật dày (Lucas duyệt và cho áp dụng 2026-11-04)

Lucas: "nhân vật chưa đa dạng và 3d như họ". `Look.body: "chunky"` (toon-engine `rig.tsx`; mọi look của style M qua `look()` trong `hoat-su.tsx` / `ww2.tsx` đều là thân dày, da trắng `#FBF8F2`, ủng nâu): tay áo và ống quần thay que, ủng, thắt lưng, túi ngực, đổ bóng khối (bên xa sáng tối hơn, vệt sáng bên gần, vầng tối trên đầu), má hồng; `girth` .85–1.35 cho dáng gầy / to con; `facial` mustache / handlebar / goatee / beard / stubble; mũ sắt `cel` (`M1Helmet`, `Brodie`, `Stahl`). Xem: `npx remotion still Style-M-HoatSu-Cast out/cast.png` (`m-kit/Cast.tsx`: hàng trên là nhân vật hiện tại).
- Vai thân dày rộng hơn 14 px (`armShift`), `girth` chỉ nới bụng; `handAt` (ww2) đã cộng phần này nên đồ cầm tay khớp tay.
- **Lính phụ tự khác nhau:** `vary(look, seed)` (ww2) chọn dáng, râu, màu tóc theo seed; `Actor` trong video gọi nó cho mọi seed khác 1. **Người thật** (Doss, Jack, Truman) có `girth` riêng nên `vary` bỏ qua: không gắn râu cho người không có râu.
- Mũ sắt mặc định có đổ bóng (`cel = true`).

## Bối cảnh 3D (Lucas bảo dựng và duyệt 2026-11-04: "Đạt, giữ bản 3D")

`three/` dựng bối cảnh bằng three.js qua `@remotion/three`. Có chất liệu toon 3 tông, viền mực, trời, sương và 4 kiểu sáng. `shotCam` đặt máy theo cỡ người. Nhân vật vẫn là rig 2D thân dày, đặt vào cảnh bằng cách chiếu chân qua cùng máy quay (`place`). Bản mẫu là `m-doss-3d/` (composition `Style-M-HoatSu-Doss3D`), đọc thêm ở `m-doss-3d/progress.md`. Render 4K nặng: chạy với `--concurrency=3 --timeout=180000`.

## Bẫy đã gặp

- **Cận ngực zoom 4 đẩy mặt vào vùng đỏ phía trên** (storyboard đầu, S2 / S13 / S14): cận ngực zoom 3 và nhắm cao hơn ~70 px (2026-11-03).
- **Biển chữ hẹp hơn chữ thì chữ tràn ra ngoài tấm biển:** "LISBON 1941" ở 52 px cần `w` ≈ 380 (2026-11-03).
- **Bắt tay:** tay gần camera là tay giơ lên (người quay phải `yaw > 0` dùng `armR`, người quay trái dùng `armL`), góc `a` dương = ra ngoài phía của tay đó (2026-11-03).
- **Đồ trên tay tràn khỏi vùng an toàn:** đặt người đưa đồ vào trong (u ≤ 0,6) và kiểm tờ giấy trên storyboard (2026-11-03).
- **`episode.mjs prep` không lấy `gaps` trong voiceover json** (quãng nghỉ cảnh vẫn 0,6 s): sửa thẳng `gapAfter` từng dòng rồi `voiceover` + `export` lại (cache, không tốn request) (2026-11-03).
- **`poseAt(t, keys)` bắt đầu từ `basePose` (x 960, y 700)**: trải nó sau tư thế đứng thì nhân vật bay khỏi khung (S2 lượt 1). Truyền tư thế đứng làm đối số thứ ba: `poseAt(t, keys, JACK_AT)` (2026-11-04).
- **Giơ tay thẳng (`a` ≈ 158) bị mũ sắt Đức che hết**, nhìn như tay buông: giơ tay hàng là `a` 124, `b` 40 (khuỷu chĩa ra) (2026-11-04).
- **Cùng một chớp trắng cho hai vụ nổ là dấu "AI slop"** (critic): đạn cối = `Burst` (lửa răng cưa, đất, khói), lựu đạn = `WhiteOut` (cả khung trắng rồi đen) (2026-11-04).
- **"Hình đứng yên" của `studio:compare` là trung vị scene score mỗi shot (< 0,6 ‰), không phải freezedetect** (freezedetect cho bản nháp 6 %, compare cho 91 %): nhân vật thở, chớp mắt, mây trôi không đủ; chuyển động "chậm / nhanh" của Squire phần lớn là máy quay đẩy / lia, thứ D3 cấm. So với tham khảo chỉ bằng `studio:compare` (2026-11-04).
- **`studio:compare` đo lại file cũ nếu tên file không đổi**: sau khi render lại phải thêm `--force`, không thì số liệu (true peak, giọng bị che) là của bản trước (2026-11-04).
- **Hạ nhạc (duck) một đoạn giữa video làm loudnorm của master đẩy cả bài lên, đỉnh giọng chạm −0,6 dBTP** (luật ≤ −1,5): sửa tiếng đè lời bằng cách dời / bỏ SFX trước, hạ nhạc sau cùng và kiểm lại true peak (2026-11-04).
- **Ảnh AI đặt mặt đất thấp hơn sàn của rig** (Na Uy: người đứng trên mái nhà; Brač, hẻm: lơ lửng): `Outside` nâng + phóng ảnh theo từng loại cảnh (`FIT` trong `ww2.tsx`), cảnh Na Uy thêm `SnowBank` cho chỗ lên bờ. Ảnh mới: xem storyboard trước khi render (2026-11-04).
- **Hai phiên chạy `fetch-sfx` cùng lúc làm mất dòng trong `public/sfx/catalog.json`** (phiên sau đọc bản cũ rồi ghi đè): file còn trên đĩa, chạy lại list của mình để gộp (`scripts/sfx-list-war.json`) (2026-11-04).
