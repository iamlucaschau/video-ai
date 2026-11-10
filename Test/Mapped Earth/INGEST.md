# INGEST — Mapped Earth

*Tự sinh bởi `npm run studio:ingest` ngày 2026-11-09; chạy lại sẽ ghi đè, đừng sửa tay (phân tích viết vào `BAO-CAO.md`). Mọi giá trị là **ĐO** (yt-dlp, ffprobe, ffmpeg ebur128 / scene / freezedetect, faster-whisper). Quy trình: `Style Library/QUY-TRINH-PHAN-TICH.md`.*

## 1.1 Kênh

- Không có ID YouTube trong tên file → không lấy được số liệu kênh.

## 1.1 Số liệu video + vị trí trong kênh

| V | ID | Tiêu đề | Đăng | Tuổi (ngày) | Views | Likes | Cmt | Like/view | Cmt/view | Views/ngày | Hạng | × trung vị | Kết luận | Thứ tự đăng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | [Facebook]_Mapped.Earth_1039138985866205 | [Facebook]_Mapped.Earth_1039138985866205.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V2 | [Facebook]_Mapped.Earth_1122933883800791 | [Facebook]_Mapped.Earth_1122933883800791.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V3 | [Facebook]_Mapped.Earth_1133584212628359 | [Facebook]_Mapped.Earth_1133584212628359.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V4 | [Facebook]_Mapped.Earth_1137282965673455 | [Facebook]_Mapped.Earth_1137282965673455.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V5 | [Facebook]_Mapped.Earth_1437135608589777 | [Facebook]_Mapped.Earth_1437135608589777.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V6 | [Facebook]_Mapped.Earth_1452241487088449 | [Facebook]_Mapped.Earth_1452241487088449.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V7 | [Facebook]_Mapped.Earth_1595926421856841 | [Facebook]_Mapped.Earth_1595926421856841.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V8 | [Facebook]_Mapped.Earth_1663953701927519 | [Facebook]_Mapped.Earth_1663953701927519.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V9 | [Facebook]_Mapped.Earth_2661450940955432 | [Facebook]_Mapped.Earth_2661450940955432.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |
| V10 | [Facebook]_Mapped.Earth_28861033983591400 | [Facebook]_Mapped.Earth_28861033983591400.mp4 | — | — | — | — | — | — | — | — | — | — | — | — |

Số liệu lấy ngày —. Kết luận: × trung vị ≥ 3 = hit, 0,5–3 = bình thường, < 0,5 = yếu.

## 1.2 Đo kỹ thuật

| V | Dài (s) | Khung | fps | kbps | LUFS | True peak (dBTP) | LRA | Shot | Shot TB (s) | Dài nhất / ngắn nhất (s) | Shot trong 3 s đầu | Đứng yên ≥ 0,5 s | Lời bắt đầu (ms) | Từ | wpm | Có lời |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | 61,9 | 720×1280 | 30,00 | 2.190 | -13,8 | -1,9 | 3,1 | 1 | 61,9 | 61,9 / 61,9 | 1 | 0 lần, 0,0 s | 0 | 180 | 181 | 88 % |
| V2 | 24,0 | 720×1280 | 30,00 | 1.889 | -15,8 | -1,2 | 4,2 | 1 | 24,0 | 24,0 / 24,0 | 1 | 0 lần, 0,0 s | 2.340 | 1 | 43 | 6 % |
| V3 | 33,1 | 720×1280 | 30,00 | 1.031 | -14,0 | -1,4 | 3,0 | 1 | 33,1 | 33,1 / 33,1 | 1 | 0 lần, 0,0 s | 0 | 93 | 176 | 87 % |
| V4 | 24,0 | 720×1280 | 30,00 | 2.412 | -15,6 | -1,9 | 4,8 | 1 | 24,0 | 24,0 / 24,0 | 1 | 0 lần, 0,0 s | 0 | 1 | 34 | 7 % |
| V5 | 24,0 | 720×900 | 30,00 | 497 | -18,5 | -6,2 | 8,8 | 1 | 24,0 | 24,0 / 24,0 | 1 | 0 lần, 0,0 s | — | — | — | — |
| V6 | 31,8 | 720×1280 | 30,00 | 2.034 | -16,1 | -1,4 | 8,4 | 1 | 31,8 | 31,8 / 31,8 | 1 | 0 lần, 0,0 s | 30.380 | 1 | 43 | 4 % |
| V7 | 68,0 | 720×1280 | 30,00 | 2.856 | -16,9 | -4,0 | 3,2 | 1 | 68,0 | 68,0 / 68,0 | 1 | 0 lần, 0,0 s | 0 | 206 | 190 | 82 % |
| V8 | 24,0 | 720×900 | 30,00 | 703 | -16,1 | -3,1 | 4,1 | 1 | 24,0 | 24,0 / 24,0 | 1 | 0 lần, 0,0 s | 22.300 | 4 | 143 | 7 % |
| V9 | 30,0 | 720×900 | 30,00 | 350 | -18,6 | -2,8 | 3,5 | 1 | 30,0 | 30,0 / 30,0 | 1 | 0 lần, 0,0 s | — | — | — | — |
| V10 | 30,6 | 720×1280 | 30,00 | 1.460 | -16,2 | -4,7 | 1,7 | 1 | 30,6 | 30,6 / 30,6 | 1 | 0 lần, 0,0 s | 30.000 | 1 | 103 | 2 % |

Shot = đoạn giữa hai điểm cắt (scene > 0,3). Crossfade dài máy dò không bắt: đọc lại trên sheet 1 s, ghi ƯỚC ±0,5 s ở `BOC-TACH-HINH.md`. Shot dài thường là một cảnh máy quay chạy liền (bản đồ bay), không phải lỗi đo. "Lời bắt đầu" từ Whisper sai ±0,2 s; từ đầu tiên hay bị kéo về 0.

## Màu chủ đạo (k-means 6 màu trên 1 khung / giây, gồm cả phụ đề và watermark)

| V | Màu (tỉ lệ diện tích) |
|---|---|
| V1 | `#040709` 68 % · `#222D37` 16 % · `#44666C` 7 % · `#645E4C` 5 % · `#928F73` 4 % · `#5FB4AB` 1 % |
| V2 | `#020304` 55 % · `#5F383D` 11 % · `#1A242C` 11 % · `#317A9F` 8 % · `#236082` 8 % · `#4D525F` 7 % |
| V3 | `#0E1319` 31 % · `#364146` 28 % · `#4E87C8` 15 % · `#E29E65` 11 % · `#856D5A` 9 % · `#B4B3B2` 5 % |
| V4 | `#030405` 49 % · `#1D607D` 22 % · `#15252F` 10 % · `#3B787F` 8 % · `#4D3D40` 7 % · `#757E75` 3 % |
| V5 | `#060B0D` 68 % · `#252522` 16 % · `#514B41` 9 % · `#807461` 4 % · `#B0A087` 2 % |
| V6 | `#030B16` 63 % · `#232C42` 22 % · `#473F53` 8 % · `#705C6B` 4 % · `#A1808C` 2 % · `#D7ABB5` 1 % |
| V7 | `#111823` 44 % · `#404E5E` 38 % · `#CE6724` 6 % · `#C5AA6A` 5 % · `#33D8AC` 5 % · `#60F576` 3 % |
| V8 | `#DFDBD4` 62 % · `#BBC9B5` 15 % · `#E8A78E` 9 % · `#AFBDEA` 8 % · `#7A9478` 4 % · `#7388CD` 3 % |
| V9 | `#04090A` 89 % · `#202324` 8 % · `#555652` 2 % |
| V10 | `#040C17` 51 % · `#202B41` 37 % · `#504344` 6 % · `#8A5F42` 3 % · `#C98E47` 1 % · `#767B81` 1 % |

## Kịch bản (đo từ lời đọc)

| V | Câu | Từ / câu (trung vị) | Câu hook: từ · hết ở giây | Con số / mốc đầu tiên (giây) | Con số / câu | Mốc thời gian / phút | Câu hỏi | Câu thoại | Câu dán nhãn nguồn | Khẳng định cần kiểm |
|---|---|---|---|---|---|---|---|---|---|---|
| V1 | 8 | 21 | 20 · 7,3 | 0,0 | 1,00 | 3,9 | 0 | 0 | 0 | 8 |
| V2 | 1 | 1 | 1 · 24,0 | — | 0,00 | 0,0 | 0 | 0 | 0 | 0 |
| V3 | 8 | 11 | 13 · 4,6 | 0,0 | 1,25 | 5,4 | 0 | 0 | 1 | 8 |
| V4 | 1 | 1 | 1 · 24,0 | — | 0,00 | 0,0 | 0 | 0 | 0 | 0 |
| V5 | — | — | — · — | — | — | — | — | — | — | — |
| V6 | 1 | 1 | 1 · 31,8 | — | 0,00 | 0,0 | 0 | 0 | 0 | 0 |
| V7 | 13 | 16 | 23 · 8,0 | 0,0 | 0,92 | 4,4 | 0 | 0 | 0 | 9 |
| V8 | 1 | 4 | 4 · 24,0 | — | 0,00 | 0,0 | 0 | 0 | 0 | 0 |
| V9 | — | — | — · — | — | — | — | — | — | — | — |
| V10 | 1 | 1 | 1 · 30,6 | — | 0,00 | 0,0 | 0 | 0 | 0 | 0 |

Đếm tự động trên transcript Whisper (**ĐO**, sai số khi Whisper nghe nhầm tên hoặc tách câu khác người viết). Mốc thời gian = năm, tháng, "days / weeks / years…". Câu thoại = có "said / replied / told…" hoặc ngoặc kép. Nhãn nguồn = "according to / some sources / historians…". Danh sách khẳng định cần kiểm (nguyên câu, chỉ ở máy): `_work/<id>.claims.md`.

### Bản đồ câu (điền cột Nhịp theo công thức: H · B · N · X · T · V · Đ · K)

**V1 · [Facebook]_Mapped.Earth_1039138985866205**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 20 | 1 | 1 | 3 |  | |
| 2 | 7,3 | 12 % | 22 | 1 |  |  |  | |
| 3 | 15,8 | 26 % | 15 | 1 |  | 1 |  | |
| 4 | 21,2 | 34 % | 16 | 1 |  |  |  | |
| 5 | 26,5 | 43 % | 31 |  | 1 | 1 |  | |
| 6 | 37,0 | 60 % | 36 | 2 | 1 | 1 |  | |
| 7 | 46,8 | 76 % | 25 |  |  | 1 |  | |
| 8 | 55,2 | 89 % | 15 | 2 | 1 |  |  | |

**V2 · [Facebook]_Mapped.Earth_1122933883800791**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 2,3 | 10 % | 1 |  |  |  |  | |

**V3 · [Facebook]_Mapped.Earth_1133584212628359**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 13 | 1 |  | 4 |  | |
| 2 | 4,6 | 14 % | 12 | 2 | 1 |  | nguồn | |
| 3 | 8,8 | 27 % | 17 | 2 | 1 |  |  | |
| 4 | 14,3 | 43 % | 10 |  |  | 1 |  | |
| 5 | 17,4 | 53 % | 16 | 1 | 1 |  |  | |
| 6 | 23,2 | 70 % | 10 |  |  | 2 |  | |
| 7 | 26,3 | 80 % | 5 | 2 |  |  |  | |
| 8 | 29,3 | 88 % | 10 | 2 |  |  |  | |

**V4 · [Facebook]_Mapped.Earth_1137282965673455**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 1 |  |  |  |  | |

**V6 · [Facebook]_Mapped.Earth_1452241487088449**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 30,4 | 96 % | 1 |  |  |  |  | |

**V7 · [Facebook]_Mapped.Earth_1595926421856841**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 23 | 1 |  | 2 |  | |
| 2 | 8,0 | 12 % | 16 |  |  | 3 |  | |
| 3 | 13,1 | 19 % | 20 |  | 1 | 1 |  | |
| 4 | 18,1 | 27 % | 5 |  |  | 1 |  | |
| 5 | 19,7 | 29 % | 9 |  |  |  |  | |
| 6 | 23,2 | 34 % | 17 | 1 |  | 2 |  | |
| 7 | 27,5 | 40 % | 16 | 2 |  | 1 |  | |
| 8 | 33,2 | 49 % | 16 |  |  |  |  | |
| 9 | 39,2 | 58 % | 19 |  | 1 | 2 |  | |
| 10 | 44,9 | 66 % | 14 |  |  |  |  | |
| 11 | 49,6 | 73 % | 10 |  |  |  |  | |
| 12 | 53,2 | 78 % | 32 | 6 | 2 | 5 |  | |
| 13 | 63,0 | 93 % | 9 | 2 | 1 |  |  | |

**V8 · [Facebook]_Mapped.Earth_1663953701927519**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 22,3 | 93 % | 4 |  |  |  |  | |

**V10 · [Facebook]_Mapped.Earth_28861033983591400**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 30,0 | 98 % | 1 |  |  |  |  | |


## Chữ trên màn hình (OCR rapidocr, 1 khung / giây, gồm phụ đề và watermark)

| V | Khung có chữ | Từ / khung (trung vị) | Khối chữ cùng lúc (tối đa) | Cao chữ trung vị (px trên khung 1080) | Chữ nhỏ (10 % nhỏ nhất, px) | Khối chữ ngoài vùng an toàn | Watermark / handle cố định (y) |
|---|---|---|---|---|---|---|---|
| V1 | 100 % | 13 | 14 | 30 | 26 | 34 % | có, y ≈ 291 |
| V2 | 29 % | 1 | 1 | 30 | 18 | 100 % | có, y ≈ 928 |
| V3 | 100 % | 6 | 4 | 46 | 38 | 10 % | có, y ≈ 318 |
| V4 | 46 % | 4 | 2 | 38 | 15 | 69 % | có, y ≈ 768 |
| V5 | 42 % | 12 | 2 | 24 | 22 | 62 % | có, y ≈ 192 |
| V6 | 69 % | 2 | 2 | 57 | 45 | 0 % | có, y ≈ 1.534 |
| V7 | 100 % | 13 | 13 | 39 | 28 | 48 % | có, y ≈ 242 |
| V8 | 46 % | 2 | 2 | 22 | 20 | 36 % | có, y ≈ 1.032 |
| V9 | 0 % | — | 0 | — | — | — | có, y ≈ 304 |
| V10 | 100 % | 2 | 2 | 54 | 45 | 0 % | có, y ≈ 1.534 |

Luật của mình: chữ ≥ 48 px, ≤ 2 khối ngoài phụ đề, mọi chữ trong vùng an toàn. OCR bỏ sót chữ cách điệu / nghiêng và tách một dòng thành nhiều khối: đọc là **ĐO có sai số**, kiểm lại trên sheet. Chữ đứng một chỗ ở ≥ 40 % số khung (watermark, handle) được tách riêng, không tính vào các cột khác. Chữ của từng khung: `_work/<id>.ocr.json`.

## Giọng và nền (demucs tách 2 lớp)

| V | Giọng (LUFS) | Nền: nhạc + SFX (LUFS) | Nền − giọng (dB) | Tiếng nhấn ở nền / phút |
|---|---|---|---|---|
| V1 | -13,8 | -36,5 | -22,7 | 14,5 |
| V2 | -35,3 | -16,0 | 19,3 | 0,0 |
| V3 | -14,0 | -34,0 | -20,0 | 25,4 |
| V4 | -27,0 | -16,2 | 10,8 | 7,5 |
| V5 | -18,6 | -19,4 | -0,8 | 22,5 |
| V6 | -68,7 | -16,1 | 52,6 | 13,2 |
| V7 | -17,0 | -31,7 | -14,7 | 4,4 |
| V8 | -70,0 | -16,1 | 53,9 | 0,0 |
| V9 | -68,0 | -18,7 | 49,3 | 44,0 |
| V10 | -66,4 | -16,2 | 50,2 | 2,0 |

Tiếng nhấn = mức nền vọt ≥ 8 dB so với giây trước (`scripts/stems.py`): gồm SFX **và** nhịp nhạc mạnh, nên là **ƯỚC** độ "bận" của nền, không phải số SFX chính xác. Thời điểm từng tiếng: `_work/<id>.stems.json`.

## 1.3 Khung bảng shot (điền phần còn trống vào `BOC-TACH-HINH.md`)

Cột **Máy quay** đã điền mức chuyển động **ĐO** (trung vị điểm scene trong shot, ‰): đứng yên < 0,6 · chậm < 4 · nhanh. Phụ đề, chữ hiện ra, vật di chuyển cũng tính là chuyển động; kiểu (lia, đẩy, bay) ghi bằng mắt (ƯỚC).

### V1 · [Facebook]_Mapped.Earth_1039138985866205

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–61,9 | 61,9 | | | | chậm (0,7‰) | | | |

### V2 · [Facebook]_Mapped.Earth_1122933883800791

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–24,0 | 24,0 | | | | đứng yên (0,2‰) | | | |

### V3 · [Facebook]_Mapped.Earth_1133584212628359

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–33,1 | 33,1 | | | | chậm (0,7‰) | | | |

### V4 · [Facebook]_Mapped.Earth_1137282965673455

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–24,0 | 24,0 | | | | đứng yên (0,3‰) | | | |

### V5 · [Facebook]_Mapped.Earth_1437135608589777

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–24,0 | 24,0 | | | | đứng yên (0,3‰) | | | |

### V6 · [Facebook]_Mapped.Earth_1452241487088449

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–31,8 | 31,8 | | | | đứng yên (0,4‰) | | | |

### V7 · [Facebook]_Mapped.Earth_1595926421856841

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–68,0 | 68,0 | | | | chậm (0,7‰) | | | |

### V8 · [Facebook]_Mapped.Earth_1663953701927519

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–24,0 | 24,0 | | | | chậm (0,8‰) | | | |

### V9 · [Facebook]_Mapped.Earth_2661450940955432

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–30,0 | 30,0 | | | | đứng yên (0,1‰) | | | |

### V10 · [Facebook]_Mapped.Earth_28861033983591400

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–30,6 | 30,6 | | | | đứng yên (0,2‰) | | | |

## File làm việc (`_work/`, git-ignored)

`channel.json` (danh sách kênh) · `<id>.meta.json` · `<id>.probe.json` · `<id>.measure.json` (điểm cắt, đứng yên, độ to) · `<id>.transcript.json` (lời có thời gian từng từ) · `<id>.ocr.json` (chữ trên màn hình) · `<id>.stems.json` (giọng / nền) · `ingest.json` (gộp tất cả, cho bước P2) · `sheets/`.
