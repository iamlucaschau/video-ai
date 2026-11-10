# 03 — PHONG CÁCH DỰNG · Naval Board

*Cách dựng hình và tiếng, rút từ hai tập thử. Số đo lấy từ `progress.md` và `checks.md` của từng tập. Luật Remotion chung nằm ở `AGENTS.md`; file này chỉ ghi phần riêng của kênh.*

## 1. Khung và nhịp hình

- 1920×1080, sa bàn vẽ bằng SVG trong `Svg` của `subkit.tsx`. Cả khung trôi nhẹ liên tục: scale 1,049–1,061, lệch tối đa 44 px ngang và 26 px dọc, đủ che mép bản đồ.
- **Nền phải chuyển động ngay từ bản dựng đầu.** `short-qa.py` tính cả cảnh tối trôi chậm là "gần như đứng yên". Mục tiêu tạm là dưới 35%. Tập 2 giảm từ 66% xuống 37,5% chỉ nhờ cho nền chuyển động: tia sáng trong nước, lưới sa bàn trôi, biển chảy (`Sea flow`). Carrier v4 đạt 41%.
- Mỗi hình gắn vào một chữ trong giọng đọc, không đặt theo đồng hồ:
  - shot list `shots.json` → `node scripts/shotlist.mjs "<thư mục tập>"` → `shots.timeline.json`;
  - trong code, `A(id)` là đầu câu, `E(id)` là cuối câu, `W(id, "word")` là lúc đọc tới chữ đó.
  - Tập 2 có 95 shot, khoảng 10,7 cắt/phút, trung vị 5 giây.
- Có thẻ chương (`CHAPTERS`) và dải tiến độ ở mép trên. Thời điểm các thẻ chương cũng chính là chapters trong mô tả YouTube.
- Phụ đề bật mặc định (`subtitles`), từ khoá tô vàng.

## 2. Chữ trên màn hình

- Mỗi phần tử chữ tối đa 5 từ, tối đa 2 phần tử cùng lúc. Không đưa nguyên câu VO lên màn hình.
- Số trên màn hình phải có trong `FACTS-<slug>.md`.
- Nhãn đặt ở `TOP` (y 130), trên phần hành động.

## 3. Kit 2D

| Kit | Có gì |
|---|---|
| `src/compositions/Ambush/kit.tsx` | màu `C`, font `COND` / `INTER`, `ease`, `Tag`, `Heading`, `Vignette`, `Blast`, `Word` (chữ viền cho thumbnail) |
| `src/compositions/Carrier/navkit.tsx` | nhìn từ trên xuống: `Sea`, `Land`, `Wake`, `Carrier`, `Warship`, `Sub`, `Jet`, `Missile`, `RangeRing`, `RadarSweep`, `DataLink`, `Blip`, `Ciws`, `Vls` |
| `src/compositions/Submarines/subkit.tsx` | mặt cắt dưới nước: `Water`, `Board`, `SubSide`, `OldSub`, `ShipSide`, `Waves`, `Pulse`, `Torp`, `Cutaway`, `Meter`, `Dial`, `Doc`, `Stamp`, `Pin`, `Big`, `Label` |

Bản đồ thật lấy từ Natural Earth (world-atlas 50m) và d3-geo (`scripts/carrier-maps.mjs`, `scripts/submarine-maps.mjs`), ghi ra `maps.json` cạnh composition.

## 4. 3D (Blender)

- Chiếm khoảng 20% thời lượng (tập 2: 19,6%). Shot 3D khai báo trong `shots.json` (`"kind": "3D"`, `"clip"`). Composition phát clip qua `Hero` (`<Video>`), nhãn vẽ đè bằng SVG.
- Script: `scripts/blender/carrier3d.py` (vật liệu, biển, tàu sân bay, camera dùng chung) và `scripts/blender/sub3d.py` (dựng shot theo đúng mốc VO). Cách gọi ghi ở đầu mỗi file.
- Quy trình:
  1. Render bản `preview` và xem contact sheet, mỗi clip khoảng 1 phút.
  2. Render bản đủ ở 8 samples.
  3. **So các khung liền nhau** để bắt nháy hình. Contact sheet lấy khung cách đều nên bỏ sót. Tập 2 từng bị thân tàu đen cả chuỗi khung vì `use_persistent_data`.
  4. Encode bằng ffmpeg crf 14–16 vào `public/video/<slug>/` (không vào git).
  5. Ghi tên clip vào `rendered3d.json`.
- Ngân sách: dưới 6 giờ Blender mỗi tập trên máy này (Cycles chạy CPU, `-t 56`, mỗi lần một tiến trình). Tập 2 tốn 4,7 giờ. Khói trong suốt là phần đắt nhất.
- Chớp sáng của vụ nổ vẽ bằng lớp 2D (`BlastGlow`, `mixBlendMode: screen`) đặt đúng chỗ trong khung 3D. Làm bằng quả cầu sáng trong Blender thì trông như cái đèn. Đổi camera của clip thì phải dời lớp 2D theo.
- Clip dùng lại được giữa các tập (tập 2 dùng lại `fleet` của Carrier).

## 5. Âm thanh

- **Nhạc nền** làm bằng code (`scripts/make-music.py`, preset `carrier-watch`, dùng cho cả hai tập), đặt ở −31 với `duck` hạ dưới câu then chốt. Không dùng nhạc Pixabay (dễ dính Content ID).
- **SFX:** ưu tiên file thật trong thư viện (Mixkit, Pixabay). Tiếng không có sẵn thì làm bằng code: `scripts/make-sfx-carrier.py`, `scripts/make-sfx-sub.py` (sonar ping, tiếng nổ dưới nước, ngư lôi, xả két, động cơ trục trặc…), ghi nguồn vào `catalog.json`.
- **Đặt tiếng nhấn:** rơi vào khoảng lặng ngay sau chữ nó minh hoạ, không đè lên chữ. Nếu không có khoảng lặng (vd. "hit." rồi "All 73" ngay sau), giữ chỗ cũ và hạ nhỏ.
- **Master:** `python -P scripts/naval-final.py <id> "<thư mục tập>/<slug>.mp4"`. Hình và tiếng render riêng, rồi lowpass 15,5 kHz → limiter → loudnorm 2 lượt (−14 LUFS, −2,5 dBTP) → AAC 320k → ghép hình. Mỗi lần mất khoảng 1 giờ cho video 9 phút.

## 6. Cổng nghe (earshot, 3 chặng)

1. **Trước khi render,** ngay sau khi đặt xong SFX (khoảng 20 giây): `npm run listen -- <id> --precheck --words src/voiceover/<slug>.words.json --out "<tập>/NGHE.md"`. Lệnh này liệt kê tiếng nhấn rơi giữa một chữ.
2. **Khi sửa tiếng:** `python -P scripts/naval-final.py <id> "<mp4>" --audio-only`. Lệnh này chỉ render lại tiếng rồi ghép vào hình cũ, mất khoảng 25 phút thay vì 1 giờ. Sau đó chạy lại cổng ở chặng 3.
3. **Bản cuối (bắt buộc):** `npm run listen -- <id> "<mp4>" --words src/voiceover/<slug>.words.json --out "<tập>/NGHE.md"` (khoảng 11 phút cho 9 phút video). Mỗi dòng "Cần nghe" phải có quyết định trong `checks.md`. Bảng "Chữ bị nền che" chỉ cần xử lý chữ quan trọng; chữ yếu như "and" thì để.

Tiếng lên chậm (ngư lôi, tiếng rền khi hai tàu chạm, tiếng nổ xa) luôn bị đánh dấu "lệch". Đó là bình thường, ghi "giữ" sau khi đã nghe.

## 7. Thumbnail

- Composition riêng, mẫu là `src/compositions/Submarines/Thumbnail.tsx`: nền là khung 3D của chính tập (copy từ `out/3d/` vào `public/images/<slug>/`) hoặc sơ đồ vẽ bằng code; chữ dùng `Word`.
- Luật chọn hình và chữ: `02_CONG-THUC.md` §6.
