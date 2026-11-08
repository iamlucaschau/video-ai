# Dựng video NEON ODDS (style N)

Luật chung của dự án: `AGENTS.md`, nhất là "Short-form rules" và "Sound design". Tập mẫu để chép cách làm: `Style Library/N-low-poly/n-mandel/Video.tsx`. Danh mục kit: `Style Library/N-low-poly/README.md`.

## Luật không được phá

- **Toàn code:** không tải model 3D, không ảnh mặt người thật hay mặt AI (Lucas 2026-11-06). Nhận ra người thật qua tóc, kính, ria, quần áo.
- **Vùng an toàn:** chữ, số, mặt và vật chính nằm trong x 60–940, y 220–1440. Soát bằng ảnh có guide đỏ.
- **Không camera giả:** mỗi shot tối đa một `glide`, cắt cứng giữa các shot, không rung, không zoom kiểu punch-in.
- **Ít chữ:** mỗi khối ≤ 5 từ, tối đa 2 khối ngoài phụ đề. Không bao giờ đưa cả câu lời đọc lên hình.
- **Mọi số trên hình có trong bảng kiểm chứng.** Số đang đếm dần thì giá trị cuối phải đúng.
- **Nhạc tự tạo, không dùng nhạc thư viện** (từng bị Content ID). SFX: file thật trước, tạo bằng code khi không có file hợp.

## Cấu trúc một tập

- Soát hình bằng `sheet-j` trực tiếp, ghi log ra file. `shotlist --board` dừng im lặng nếu composition lỗi: thư mục ảnh trống nghĩa là có lỗi.
- `shots.json`: danh sách shot neo vào từ (`"at": "05:but"` là từ "but" của dòng 05). Sau đó `node scripts/shotlist.mjs "NEON ODDS/episodes/epNN-<slug>"` sinh `shots.timeline.json`. Đặt `end` bằng thời điểm kết thúc giọng cộng khoảng 0,6 s.
- `Video.tsx`: bản ghi `S` gồm các hàm shot `(t, len, g) => ({ light, cam, world, over })`, `t` là frame trong shot, `g` là frame toàn cục. Khung `Episode` trong `Style Library/N-low-poly/episode.tsx` lo phụ đề, giọng, nhạc, tiếng nền và vòng lặp.
- Mọi mốc lấy từ giọng: `wd("15", "stop")`, `lineEnd("26")`, `loc("S21", g)`. Đừng gõ số frame tay, vì đọc lại giọng sẽ lệch hết.

## Làm cho hình sống (điều rút ra từ tập Mandel)

**Cắt ít, diễn nhiều.** Khoảng 40–45 shot cho 90 giây, nhiều shot dài 3–5 giây có hành động bên trong: "đọc → ngẩng lên → nhếch môi" trong một shot tốt hơn ba shot đứng yên. Nhưng chuỗi nhịp ngắn kiểu "Every. Single. Ticket." thì giữ cắt nhanh.

**Mỗi shot có một người hoặc một việc đang xảy ra.** Đồ vật một mình trên nền đen trông như slide, đây là lỗi bị nhắc nhiều nhất. Đặt đồ lên một mặt bàn có đèn, thêm bàn tay (`PressHand`) hoặc người.

**Đưa số vào cảnh:** `LedBoard`, lịch, màn hình, máy tính. `Chip` chỉ dùng khi không có vật nào mang số được.

**Vài khoảnh khắc đắt giá là thứ người xem nhớ.** Mỗi tập chọn 3–4 câu then chốt và dựng một hành động riêng, kèm khoảng lặng trong giọng (`gapAfter`), tắt nhạc trước câu đó (`duck`) và tiếng nhấn rơi vào khoảng lặng. Mẫu: cửa cuốn sập (S39), vé trúng trồi lên sáng từng số (S44), kéo cần cho bóng rút hết (S52).

**Hook có hành động trong giây đầu:** khung 0 đã nghịch lý hoặc lạ, trong 1 giây phải có việc xảy ra. Khung cuối bằng khung 0 (đã có sẵn trong `Episode`). Muốn vật chuyển động liền qua chỗ nối, cho nó chạy theo đồng hồ riêng về đúng 0 ở khung cuối, như `balls={(t - len) * 0.3}` trong S56.

## Diễn xuất

`act(t, [[frame, pose], …])` đã tự lệch nhịp: mắt đi trước, đầu theo, tay trễ, cẳng tay trễ hơn. `Person` tự thở, chớp mắt và liếc. Việc của shot là các tư thế chính:

- Các khoá phải xếp tăng dần theo frame. Khoá nào cũng nên ghi `armL`, `armR`, vì thiếu sẽ bị trộn về 0.
- **Có chuẩn bị:** hạ trước khi giơ, ngả trước khi đập. Động tác lớn cần 12–16 frame, tay gập khuỷu ở giữa đường, đừng giơ thẳng cứng trong 8 frame.
- **Biểu cảm:** `smile` (âm là mếu), `mouth`, `smirk` (một khoé, kèm `browL`, `heavy`), `squint` khi cười thật, `frown` (giận), `worry` (sợ), `brow`, `browL`, `browR`, `blink`.
- **Thân:** `lean`, `tilt`, `twist`, `shrug`. Đừng để chỉ tay chạy còn thân đứng yên.
- **Nhìn xuống bằng mắt và mí** (`lookY`, `heavy`, `pitch` ≤ 15). Cúi đầu nhiều thì mắt bị che mất.
- **Hướng:** người quay mặt về camera thì `armR` ở bên trái màn hình, `lookX` và `yaw` âm là nhìn sang trái màn hình.
- **Vật trong tay:** dùng `handAt(side, [x, y, z], arm)` để vật khớp tay. Dùng `holdR` thì xoay ngược góc tay để vật vẫn quay về camera.
- Dựng người chỉ dùng tay chân hình khối, nên tránh để bàn tay to ở cận cảnh. Cần cận tay thì dùng `PressHand`. Ống tay của nó dài 1,6 m: để tay vào từ bên hông (`r={[0.28, 0, -1.42]}`), đừng hướng về máy, nếu không nó chắn ngang khung hình.

## Ánh sáng và khung hình

- **Bản sắc:** phòng tối xanh đêm, vũng sáng hổ phách từ đèn nhìn thấy được, viền xanh ngọc phía xa. `Lights`: `warm`, `studio`, `stage`, `night`, `day`, `cool`.
- **Không chiếu đèn màu vào mặt:** đỏ lên mặt trông như máu. Để đèn màu sau gáy, mặt dùng đèn ấm trung tính.
- **Giấy và vé dễ cháy trắng:** đèn điểm giảm theo bình phương khoảng cách nên đừng đặt quá gần, hoặc `post: { bloom: 0.1 }`.
- **Tính khung ngang:** rộng khung ≈ khoảng cách × 2 × tan(fov/2) × 0,5625. Tâm vùng an toàn ở x ≈ 500, không phải 540. Khung 9:16 rất hẹp: hai người ngồi cách nhau 0,8 m cần máy lùi khoảng 3,5 m. Cận đồ vật trên bàn: máy đặt cao 1,5–3,5 m, đừng sát.
- **Muốn thấy mặt ai thì đặt người đó quay về +z, máy ở +z.** Máy nhìn từ −z thì viền xanh `rim` chiếu loang lên mặt: đổi bên bàn thay vì đổi máy (xem `DealerFront` trong ep01).
- **Vật cao đặt cạnh mặt, không trước mặt:** chồng phỉnh che mặt là lỗi đầu tiên của tập Ivey. Biển trên tường rộng tối đa khoảng 2,2 m.
- Phụ đề có quầng tối sẵn, nhưng đừng để vật sáng quan trọng nằm ở y 1290–1440.

## Bộ kit

`sets.tsx`: `Kiosk`, `Studio`, `Office`, `Warehouse`, `MapTable`, `Street`, `Interview`, `Chamber`, `Casino`, `BaccaratTable`, `CashCage`, `DrawRoom`, `SlotFloor`, `RouletteTable` + `cellAt` / `ROUL`, `Void`, `TicketTower`, `CoinTower`, `CAST`, `extra(seed)`.
`props.tsx`: `Ticket`, `HeroTicket`, `Pile`, `Bundle`, `Crate`, `Ball`, `DrawMachine`, `Clock`, `Calculator`, `DeskLamp`, `Crt`, `Printer`, `Desk`, `Chair`, `Chalkboard`, `Frame`, `Bill`, `Van`, `GavelHeld`, `GavelBlock`, `Stamp`, `Book`, `Folder`, `Pin`, `LedBoard`, `PressHand`, `Card`, `CardShoe`, `ChipStack`, `ChipHill`, `ShuffleMachine`, `Balance`, `RngRack`, `CeilingCam`, `Coin`, `WallCalendar`, `SlotMachine`, `SlotStool`, `Phone`, `RouletteWheel` + `spinAt` (bóng chạy mép, rơi ở góc `zone`, vào ô `pocket`) + `WHEEL_ORDER`.

Mặt người chơi slot: máy quay mặt về +z thì người ngồi quay lưng về máy quay. Muốn thấy mặt, xoay máy (`ry={180}`), cho người ngồi phía −z quay về +z, và đặt máy quay chếch bên cạnh máy slot chứ đừng nhìn xuyên qua nó (xem `FaceSet` trong ep03).
`episode.tsx`: `Episode`, `epTools`, `cm`, `ramp`, `Rain`, `Crowd`, `ThumbText`.

Đề tài cần bối cảnh mới thì **thêm vào kit** (`sets.tsx`, `props.tsx`) thay vì viết trong tập, để tập sau dùng lại. Set `Casino` đã có bàn baccarat, máy slot, biển, bảng LED và `CashCage`; mẫu dùng ở `NEON ODDS/episodes/ep01-ivey-edge/Video.tsx`. Bàn roulette: `<Casino table={false}>` rồi đặt `RouletteTable` ở gốc toạ độ (mẫu `Ritz` trong ep04). Đặt `Casino` không có `table` thì nó vẽ bàn baccarat.

## Âm thanh

Claude không nghe được, nên chỉ đo được. Luôn nói điều này với người dùng.

- **Nhạc:** thêm một preset trong `scripts/make-music.py` (chép `n-heist`, đổi hợp âm và `seed`, đặt lại `arc` theo giây từ `src/voiceover/<slug>.timing.json`), rồi:
  ```bash
  python -P scripts/make-music.py <slug> public/sfx/music/own/<slug>.mp3 --seconds <độ dài + 8>
  node .claude/skills/neon-odds/scripts/new-episode.mjs music <slug>
  ```
- **Tiếng nền:** mảng `rooms` trong `Episode`, dùng `sfx/synth/room-shop.wav`, `room-office`, `room-warehouse`, `room-chamber`, `room-interview`.
- **SFX:** `<Sfx file at level align />`. Danh sách trong `public/sfx/catalog.json`. Tiếng nhấn minh hoạ một từ thì đặt ở khoảng lặng ngay sau từ đó, không đè lên từ. Tiếng chưa có: thêm hàm trong `scripts/make-sfx-lotto.py`, rồi `node scripts/sfx-onsets.mjs`. File dưới 0,4 giây đo ra −70 LUFS và `Sfx` sẽ khuếch đại quá mức: kéo dài bằng khoảng lặng rồi xem số trong `catalog.json`. Không dùng tiếng hoạt hình.

## Lệnh

```bash
# nháp cả video, nửa độ phân giải, khoảng 10 phút
npx remotion render NO-epNN-<slug> out/<slug>-draft.mp4 --scale=0.5 --concurrency=4 --gl=angle --timeout=240000 --crf=24
# ảnh có guide đỏ ở các frame chọn
node scripts/sheet-j.mjs NO-epNN-<slug> --frames 10,50,120 --bundle-dir out/bundle-<slug> --cols 7 --rows 3 --size 240 --name <slug>-a
# đo giọng có bị nền che không
npm run studio:compare -- out/<slug>-draft.mp4 --ref "Test/Loaded Dice"
```

`npm run lint` sau mỗi lần sửa mã, `graphify update .` sau khi xong. Lỗi lint ở file của tập khác thì đừng sửa, có thể phiên khác đang làm.
