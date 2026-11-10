# Gói sản xuất: Naval Board #1 "How Aircraft Carriers Defend Themselves in 3 Rings" (2026-11-09)

Video: `how-a-carrier-defends-itself.mp4` (10:37, 1080p30, −14,0 LUFS, v4 đã cắt câu guide, render 2026-11-09) · Thumbnail: `thumb-a.jpg`, `thumb-b.jpg`, `thumb-c.jpg`

Mô tả, tiêu đề và từ khoá viết bằng tiếng Anh như video. Mọi số liệu lấy từ `FACTS-carrier.md`. Làm theo `00_he-thong/02_CONG-THUC.md` §5–6.

## Thumbnail

Ba file 1920×1080 JPEG. Nền của A và C là khung hình từ chính các shot Blender của tập (`public/images/carrier/`); B vẽ hoàn toàn bằng code. Composition `Carrier-Thumbnail` (`src/compositions/Carrier/Thumbnail.tsx`).
Render lại: `npx remotion still Carrier-Thumbnail "Formats/Naval Board/episodes/ep01-carrier/thumb-a.jpg" --props=<file chứa {"variant":"a"}> --image-format=jpeg --jpeg-quality=92`

| | Chữ | Hình | Ý trong video |
| --- | --- | --- | --- |
| A | 65 PLANES. / 1 TARGET. | Đội tàu 3D nhìn từ trên cao (shot fleet), 3 vòng sáng lồng nhau quanh tàu sân bay | Hook ("65 planes… every enemy wants it sunk") + 3 vòng của tiêu đề |
| B | UNSINKABLE? | Sơ đồ nền đen: tàu trắng giữa 3 vòng, tên lửa đỏ chặn ở từng vòng, một quả lọt tới vòng trong cùng | Câu hỏi của hook và phần Gravely; dấu hỏi vì video không nói tàu không thể chìm |
| C | 1 MILE / AWAY. | Phalanx khai hoả, quả cầu lửa trên biển (shot phalanx); sơ đồ 3 vòng nhỏ, vòng trong cùng đỏ | USS Gravely: tên lửa lọt tới vòng cuối, Phalanx hạ nó cách tàu khoảng một dặm |

Cách thử: giữ tiêu đề 1, đưa A, B, C vào **Test & compare** trong YouTube Studio.
Đã kiểm tra: xem cả 3 ở cỡ 320×180 trên nền tối; mỗi bản tối đa 3 từ (số tính là một); góc dưới phải không có gì quan trọng. Cả 3 bản đều **cho thấy** 3 vòng mà tiêu đề hứa, và mỗi bản có một câu riêng: mức hệ trọng (A), câu hỏi (B), con số của vụ Gravely (C). Chữ không lặp tiêu đề. Bản đầu (2026-11-09) có A và C không thấy vòng nào; Lucas chỉ ra là thumbnail không liên quan tới tiêu đề, nên đã làm lại.

## Tiêu đề

1. **How Aircraft Carriers Defend Themselves in 3 Rings** (chính, 50 ký tự). Chủ thể nằm trong 3 từ đầu, động từ Defend, yếu tố căng thẳng là một con số cụ thể: cả video xếp theo 3 vòng.
2. How an Aircraft Carrier Actually Defends Itself (dự phòng, 47 ký tự). Video đọc lại đúng câu này thành câu hỏi ở phần mở đầu.
3. Why No U.S. Aircraft Carrier Has Been Sunk Since 1945 (dạng Why, 53 ký tự). Kiểm chứng: tàu sân bay Mỹ cuối cùng mất trong chiến đấu là năm 1945; video nói "since the Second World War".

## Mô tả

```
One ship carries 65 planes, and every enemy in range wants it sunk. So why is an aircraft carrier almost impossible to kill? It does not survive by being hard. It survives by being surrounded.

Ring by ring, from the Hawkeye's radar picture to the Phalanx and its roughly 20 seconds of fire, plus the night in the Red Sea when a missile got through almost all of them, and four deadly mistakes real navies have made.

Chapters
0:00 Intro
0:59 The carrier never sails alone
2:25 First, it has to see you
3:49 Ring one: the fighters
5:00 Ring two: the missile wall
6:26 Ring three: the last kilometres
7:55 Deadly mistakes
9:54 The blueprint

Sources
USS Gravely, 30 January 2024: CENTCOM https://www.centcom.mil/MEDIA/PRESS-RELEASES/Press-Release-View/Article/3661354/houthis-fire-anti-ship-cruise-missile-toward-red-sea/
Distance of the Gravely intercept: Navy Times https://www.navytimes.com/news/your-navy/2024/01/31/uss-gravely-shoots-down-another-houthi-missile-over-the-red-sea/
Missile near USS Eisenhower (reported): CTC Sentinel https://ctc.westpoint.edu/a-draw-is-a-win-the-houthis-after-one-year-of-war/
Moskva, two Neptune missiles: AP via Khaleej Times https://www.khaleejtimes.com/world/europe/russian-ship-moskva-was-hit-by-2-ukrainian-missiles-us-official-says?amp=1
Moskva's defences: USNI News https://news.usni.org/2022/05/05/warship-moskva-was-blind-to-ukrainian-missile-attack-analysis-shows
USS Gettysburg and the Super Hornet: The War Zone https://www.twz.com/sea/f-a-18-super-hornet-shot-down-by-navy-cruiser-investigation-findings-released
Investigation findings: Task & Purpose https://taskandpurpose.com/news/navy-truman-planes-lost/
Group size, ranges, magazine sizes and rates of fire are public US Navy and manufacturer figures; the SM-6 range and SM-2 cost are publicly credited estimates.

Credits
Animation, narration and music made by Naval Board.
Sound effects: Mixkit (Mixkit Sound Effects Free License).

Thanks for watching!

#AircraftCarrier #NavalWarfare #NavalBoard
```

Mô tả dài khoảng 2.000 ký tự, dưới giới hạn 5.000 của YouTube. Chapters lấy đúng thời điểm thẻ chương xuất hiện trong video.

## Hashtag

#AircraftCarrier #NavalWarfare #NavalBoard

Video dài nên không dùng #Shorts.

## Từ khoá

```
how aircraft carriers defend themselves, aircraft carrier defense, carrier strike group, aircraft carrier, naval warfare explained, Aegis, SM-6, Phalanx CIWS, E-2 Hawkeye, defence in depth, USS Gravely Phalanx, Moskva sinking, USS Gettysburg friendly fire, Red Sea Houthi missile, how carriers survive
```

Tổng 15 từ khoá, khoảng 330 ký tự (giới hạn của ô Tags là 500).

## Trước khi đăng

- [x] **Lời hứa guide:** Lucas chốt ngày 2026-11-09 cắt câu này như ở tập 2 (dòng 123, không thu lại). Video đã render lại; kết giờ là câu chìa khoá rồi câu tease sang tập tàu ngầm.
- [ ] **Câu tease cuối video** nói "how submarines actually fight", tức tiêu đề dự phòng của tập 2. Vẫn đúng nội dung tập 2, không cần sửa.
- [ ] **Dòng 15 của kịch bản** ("Usually an attack submarine somewhere underneath") có thể nói quá: Wikipedia ghi "on occasion" (xem cuối `../ep02-submarines/FACTS-submarines.md`).
- [ ] **Độ dài 10:37,** ngoài khung 487–555 s của công thức. Lucas đã cho giữ nguyên trừ khi bảo làm lại.
- [ ] **Nghe bằng tai:** cổng nghe earshot chạy ngày 2026-11-09 (`NGHE.md`); chưa ai nghe trọn bằng tai.
- [ ] **Nội dung tổng hợp:** giọng TTS, hình hoạt hình. Lucas quyết có bật ô "Altered or synthetic content" không.
