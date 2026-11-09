# N · Low-poly 3D

*Thêm 2026-11-05 (Lucas), học từ phân tích một kênh Shorts hoạt hình 3D low-poly (bàn chơi, POV, CCTV, số liệu đốt vào hình). Bối cảnh và nhân vật là **của mình, dựng bằng code** (three.js qua `@remotion/three`); không tải model, không dán ảnh mặt người thật. Trạng thái: **kit v2 + tập mẫu `n-mandel/`**, Lucas chốt dừng ở ~7 / 10 (2026-11-06); muốn cao hơn thì Lucas nghĩ cần Blender.*

## Look

- **Khung:** 9:16, 30 fps; ~1,3–2 s mỗi shot, cắt cứng trên từ của VO (`shots.json` → `scripts/shotlist.mjs`).
- **Bản sắc (Lucas 2026-11-06: toàn code, không giống kênh mẫu):** phòng tối xanh đêm, vũng sáng hổ phách từ đèn nhìn thấy được, viền sáng xanh ở phía xa; hậu kỳ `post.tsx` (bóng góc GTAO, loá, tách tông, tối góc); đầu hơi to để mặt đọc được trên điện thoại.
- **Hình khối:** mọi thứ là khối nhiều mặt phẳng (`flatShading`), không viền mực; đèn key ấm + fill màu + sương. Đồ trong cảnh (bảng, vé, màn hình) là texture vẽ bằng canvas.
- **Nhân vật:** người low-poly (`Person`): tay chân 6 cạnh có khớp vai / khuỷu / hông / gối, đầu icosahedron, mặt vẽ code (mắt chớp, lông mày, miệng mở, kính, ria, kính đen, mũ). Người thật nhận ra qua tóc / kính / ria / quần áo, **không dùng ảnh mặt** (Lucas 2026-11-05).
- **Góc máy:** POV (tay người xem cầm vé), CCTV (`Cctv`: góc cao, ống rộng, xám, khung góc, CAM + giờ chạy), từ trên xuống (bản đồ, lưới vé), cận đạo cụ.
- **Chữ:** phụ đề 1–3 từ IN HOA trắng viền đen (`NSub`, số tô vàng); ngoài phụ đề chỉ có **chip số** (`Chip`: pop / slide / drop / count / type / xoá dần) và chữ trên vật (biển tiệm, bảng phấn, bảng jackpot). Mọi số phải có trong bảng kiểm chứng của tập.
- **Kết:** frame cuối = frame 0 (`<Freeze frame={0}>`), shot cuối dựng lại góc shot đầu.

## Luật riêng

- **Camera:** mỗi shot tối đa **một** lần lướt (`glide`: ease in-out cả shot, dịch vài chục cm, không nảy, không rung, không zoom kiểu punch-in). Đổi cảnh bằng cắt cứng. Shot CCTV đứng yên.
- **Âm thanh:** tiếng thật trước; tiếng không có file thì tạo bằng code (`scripts/make-sfx-lotto.py`: bóng lăn trong lồng, tích tắc, máy in kim, cửa cuốn, vé đổ, tiếng nền từng phòng). Nhạc tự tạo (`make-music.py n-heist`, có đường cong theo lời), không nhạc thư viện. Style N dày tiếng hơn mặc định: một tiếng cho mỗi hành động thấy được + tiếng nền từng nơi; tắt hết một nhịp trước câu quay đầu của truyện.
- **Số trong cảnh trước, chip sau:** số nằm trên bảng LED, lịch, máy tính khi được (`LedBoard`); chip chỉ dùng khi không có vật mang số. Phụ đề có quầng tối mềm để đọc được trên vé trắng.
- **Khoảng lặng:** các câu then chốt có quãng nghỉ riêng trong giọng (`gapAfter` ở `voiceover/<slug>.json`, không tốn lượt TTS), để hình kịp diễn.

## Code

| File | Có gì |
|---|---|
| `lowpoly.tsx` | `mat` / `P` / `Box` / hình học cache, `ctex` / `signTex` / `useLiveTex` / `Panel` (texture canvas, bảng sáng), `Person` + `Pose` + `walk` / `SIT` / `alive` / `talk`, `Lights` (`warm`, `studio`, `stage`, `night`, `day`, `cool`), `Shot3D`, `glide`, `Chip`, `Cctv`, `NSub` |
| `props.tsx` | vé (`Ticket`, `Pile` instanced, `Bundle`, `Crate`), `Ball` + `DrawMachine`, `Clock`, `Calculator`, `DeskLamp`, `Crt`, `Printer`, `Desk`, `Chair`, `Card` (+ `rank`), `CardShoe`, `ChipStack`, `ChipHill`, `ShuffleMachine`, `Balance`, `Chalkboard`, `Frame`, `Bill`, `Van`, `GavelHeld` + `GavelBlock` + `strike` / `strikeArm`, `Stamp`, `Book`, `Folder`, `Pin`, `RngRack`, `CeilingCam`, `Coin`, `WallCalendar`, `SlotMachine` (cuộn quay, nút, đèn thắng, cửa mở) + `SLOT` + `SlotStool`, `Phone` (quay video, app mốc thời gian, rung), `Contract` (tờ điều khoản, chữ ký vẽ dần), `Horse` (ngựa phi + nài), `RouletteWheel` (37 ô châu Âu, rotor quay, nghiêng, vạch vùng rơi) + `spinAt` + `WHEEL_ORDER` / `RED_NUMS`, `scatter` / `inPoly` |
| `sets.tsx` | `CAST` (Mandel, người bán vé, đặc vụ, người đưa vé, nghị sĩ, Tipton, quan chức, Bliev, Alex, chuyên gia an ninh, quan chức hãng, Niko Tosa và hai người đi cùng, trưởng an ninh, phóng viên, Don Johnson, người làm marketing casino, Bill Benter lúc trẻ và ở Hồng Kông) + `extra(seed)`, bối cảnh `Kiosk`, `Studio`, `Office`, `Warehouse`, `MapTable`, `Casino`, `BaccaratTable`, `DrawRoom`, `SlotFloor` (dãy máy slot) + `SLOT_STEP`, `RouletteTable` (bàn nỉ có ô cược, vòng ở đầu −x) + `cellAt` / `ROUL`, `BlackjackTable`, `Racetrack` + `TRACK` / `trackAt`, `CashCage` / `MiniMap` (Virginia, Úc), `Street`, `Interview`, `Chamber`, `Void` + `TicketTower` / `CoinTower` |
| `n-kit/Preview.tsx` | composition `Style-N-LowPoly-Sets`: mỗi bối cảnh 10 frame |
| `episode.tsx` | khung dùng chung cho mỗi tập NEON ODDS (`Episode`, `epTools`, `Rain`, `Crowd`, `ThumbText`); quy trình trọn tập ở skill `/neon-odds` (`.claude/skills/neon-odds/`) |
| `n-brand/Brand.tsx` | logo và ảnh bìa kênh NEON ODDS: compositions `Neon-Odds-Logo`, `Neon-Odds-Banner` |
| `n-mandel/` | tập mẫu "The man who won the lottery 14 times", composition `Style-N-LowPoly-Mandel` |

Xem cả bộ: `node scripts/sheet-j.mjs Style-N-LowPoly-Sets --frames 5,15,25,35,45,55,65,75,85 --no-guide`.
