# INGEST — History Maps Lore

*Tự sinh bởi `npm run studio:ingest` ngày 2026-11-01; chạy lại sẽ ghi đè, đừng sửa tay (phân tích viết vào `BAO-CAO.md`). Mọi giá trị là **ĐO** (yt-dlp, ffprobe, ffmpeg ebur128 / scene / freezedetect, faster-whisper). Quy trình: `Style Library/QUY-TRINH-PHAN-TICH.md`.*

## 1.1 Kênh

- Kênh: **History Maps Lore** · https://www.youtube.com/channel/UCFREyVa1PdzGJLugAZmnfcg · 4.500 subscriber
- 4 Shorts (trung vị 209.500 views) · 0 video dài (trung vị — views) · số view danh sách kênh đã làm tròn

Top 5 Shorts theo views:

| # | Views | Tiêu đề |
|---|---|---|
| 1 | 2.500.000 | The Tiny Island That Stopped an Empire - Malta 1565 |
| 2 | 285.000 | Britain's Most Ruthless Surprise Attack – Copenhagen 1807 |
| 3 | 134.000 | The Tiny Island That Stopped One of the Greatest Conquerors - Rhodes 1480 |
| 4 | 6.600 | Genghis Khan's Last Revenge: The Tangut Who Broke Their Oath |

## 1.1 Số liệu video + vị trí trong kênh

| V | ID | Tiêu đề | Đăng | Tuổi (ngày) | Views | Likes | Cmt | Like/view | Cmt/view | Views/ngày | Hạng | × trung vị | Kết luận | Thứ tự đăng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | GDMJDgUyLNk | Genghis Khan's Last Revenge: The Tangut Who Broke Their Oath | 2026-10-19 | 13 | 6.655 | 174 | 7 | 2,61 % | 0,105 % | 512 | #4 / 4 shorts | ×0,03 | yếu | thứ 1 |
| V2 | W1blLBpUeZ8 | The Tiny Island That Stopped an Empire - Malta 1565 | 2026-10-20 | 12 | 2.518.076 | 43.049 | 1.300 | 1,71 % | 0,052 % | 209.840 | #1 / 4 shorts | ×12,0 | **hit** | thứ 2 |
| V3 | VspwgSBqlGE | The Tiny Island That Stopped One of the Greatest Conquerors - Rhodes 1480 | 2026-10-26 | 6 | 133.981 | 2.298 | 165 | 1,72 % | 0,123 % | 22.330 | #3 / 4 shorts | ×0,64 | bình thường | thứ 3 |
| V4 | B-TKxnbkezE | Britain's Most Ruthless Surprise Attack – Copenhagen 1807 | 2026-10-29 | 3 | 285.285 | 3.796 | 329 | 1,33 % | 0,115 % | 95.095 | #2 / 4 shorts | ×1,4 | bình thường | thứ 4 |

Số liệu lấy ngày 2026-11-01. Kết luận: × trung vị ≥ 3 = hit, 0,5–3 = bình thường, < 0,5 = yếu.

## 1.2 Đo kỹ thuật

| V | Dài (s) | Khung | fps | kbps | LUFS | True peak (dBTP) | LRA | Shot | Shot TB (s) | Dài nhất / ngắn nhất (s) | Shot trong 3 s đầu | Đứng yên ≥ 0,5 s | Lời bắt đầu (ms) | Từ | wpm | Có lời |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | 51,1 | 608×1080 | 30,00 | 712 | -14,1 | -2,1 | 1,9 | 5 | 10,2 | 17,1 / 2,9 | 1 | 0 lần, 0,0 s | 0 | 128 | 161 | 85 % |
| V2 | 84,5 | 608×1080 | 30,00 | 566 | -14,3 | -2,9 | 2,1 | 12 | 7,0 | 33,2 / 2,2 | 1 | 2 lần, 1,3 s | 0 | 225 | 166 | 86 % |
| V3 | 95,4 | 608×1080 | 30,00 | 711 | -14,1 | -2,1 | 2,0 | 8 | 11,9 | 41,3 / 2,6 | 1 | 0 lần, 0,0 s | 0 | 254 | 164 | 88 % |
| V4 | 98,7 | 608×1080 | 30,00 | 629 | -14,3 | -1,9 | 2,2 | 3 | 32,9 | 52,4 / 22,9 | 1 | 2 lần, 1,8 s | 0 | 258 | 161 | 84 % |

Shot = đoạn giữa hai điểm cắt (scene > 0,3). Crossfade dài máy dò không bắt: đọc lại trên sheet 1 s, ghi ƯỚC ±0,5 s ở `BOC-TACH-HINH.md`. Shot dài thường là một cảnh máy quay chạy liền (bản đồ bay), không phải lỗi đo. "Lời bắt đầu" từ Whisper sai ±0,2 s; từ đầu tiên hay bị kéo về 0.

## Màu chủ đạo (k-means 6 màu trên 1 khung / giây, gồm cả phụ đề và watermark)

| V | Màu (tỉ lệ diện tích) |
|---|---|
| V1 | `#7B6752` 29 % · `#1E1E20` 18 % · `#483E38` 17 % · `#A08670` 15 % · `#4B648C` 14 % · `#BBB6A7` 7 % |
| V2 | `#122B35` 30 % · `#29424E` 20 % · `#85836C` 18 % · `#686551` 17 % · `#A79B83` 10 % · `#BEC1BB` 5 % |
| V3 | `#1D2C32` 35 % · `#A5977D` 19 % · `#7A745E` 18 % · `#4C514C` 18 % · `#D1C2A7` 5 % · `#ACB7B7` 4 % |
| V4 | `#DFDFCD` 30 % · `#211510` 22 % · `#B78C6D` 18 % · `#AAA9AF` 17 % · `#704129` 7 % · `#707480` 7 % |

## Kịch bản (đo từ lời đọc)

| V | Câu | Từ / câu (trung vị) | Câu hook: từ · hết ở giây | Con số / mốc đầu tiên (giây) | Con số / câu | Mốc thời gian / phút | Câu hỏi | Câu thoại | Câu dán nhãn nguồn | Khẳng định cần kiểm |
|---|---|---|---|---|---|---|---|---|---|---|
| V1 | 12 | 11 | 16 · 5,7 | 0,0 | 0,67 | 7,1 | 1 | 2 | 1 | 11 |
| V2 | 18 | 12 | 13 · 5,6 | 0,0 | 0,33 | 6,4 | 0 | 0 | 0 | 15 |
| V3 | 20 | 14 | 9 · 5,4 | 0,0 | 0,50 | 6,3 | 0 | 0 | 1 | 18 |
| V4 | 21 | 12 | 13 · 5,5 | 0,0 | 0,52 | 3,0 | 1 | 1 | 0 | 18 |

Đếm tự động trên transcript Whisper (**ĐO**, sai số khi Whisper nghe nhầm tên hoặc tách câu khác người viết). Mốc thời gian = năm, tháng, "days / weeks / years…". Câu thoại = có "said / replied / told…" hoặc ngoặc kép. Nhãn nguồn = "according to / some sources / historians…". Danh sách khẳng định cần kiểm (nguyên câu, chỉ ở máy): `_work/<id>.claims.md`.

### Bản đồ câu (điền cột Nhịp theo công thức: H · B · N · X · T · V · Đ · K)

**V1 · GDMJDgUyLNk**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 16 | 2 |  | 4 |  | |
| 2 | 5,7 | 11 % | 16 | 3 | 1 | 3 |  | |
| 3 | 13,0 | 25 % | 7 |  |  | 1 |  | |
| 4 | 15,3 | 30 % | 13 |  |  | 1 |  | |
| 5 | 19,5 | 38 % | 11 | 1 | 1 | 2 | thoại | |
| 6 | 23,8 | 47 % | 3 |  |  | 1 |  | |
| 7 | 24,5 | 48 % | 5 |  |  | 2 |  | |
| 8 | 27,3 | 54 % | 10 |  |  | 1 | hỏi | |
| 9 | 30,3 | 59 % | 16 | 1 | 1 |  |  | |
| 10 | 36,1 | 71 % | 21 |  |  | 2 | thoại, nguồn | |
| 11 | 43,4 | 85 % | 5 | 1 | 2 |  |  | |
| 12 | 45,9 | 90 % | 5 |  | 1 |  |  | |

**V2 · W1blLBpUeZ8**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 13 | 1 | 1 |  |  | |
| 2 | 5,6 | 7 % | 11 |  |  | 6 |  | |
| 3 | 9,6 | 11 % | 14 |  |  | 3 |  | |
| 4 | 14,6 | 17 % | 9 |  |  | 1 |  | |
| 5 | 17,4 | 21 % | 23 | 1 | 1 | 5 |  | |
| 6 | 25,2 | 30 % | 12 |  |  | 2 |  | |
| 7 | 31,4 | 37 % | 6 |  |  | 1 |  | |
| 8 | 33,4 | 40 % | 11 | 2 | 2 | 2 |  | |
| 9 | 38,9 | 46 % | 19 | 2 | 1 | 2 |  | |
| 10 | 44,7 | 53 % | 16 |  |  | 4 |  | |
| 11 | 50,5 | 60 % | 9 |  | 1 |  |  | |
| 12 | 52,4 | 62 % | 7 |  | 1 |  |  | |
| 13 | 55,0 | 65 % | 10 |  |  | 3 |  | |
| 14 | 58,6 | 69 % | 16 |  | 1 | 1 |  | |
| 15 | 64,7 | 77 % | 5 |  |  |  |  | |
| 16 | 67,1 | 79 % | 10 |  | 1 | 1 |  | |
| 17 | 71,4 | 85 % | 19 |  |  | 2 |  | |
| 18 | 76,5 | 91 % | 15 |  |  | 1 |  | |

**V3 · VspwgSBqlGE**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 9 | 1 | 1 | 4 |  | |
| 2 | 5,4 | 6 % | 15 |  |  | 2 |  | |
| 3 | 9,4 | 10 % | 14 |  |  | 1 |  | |
| 4 | 13,6 | 14 % | 13 |  |  | 1 |  | |
| 5 | 18,0 | 19 % | 15 | 1 | 1 | 1 |  | |
| 6 | 24,2 | 25 % | 14 |  |  |  |  | |
| 7 | 28,5 | 30 % | 8 |  |  | 2 |  | |
| 8 | 32,7 | 34 % | 8 |  |  | 1 |  | |
| 9 | 35,3 | 37 % | 18 | 2 | 2 | 2 |  | |
| 10 | 41,5 | 44 % | 17 | 1 |  | 5 |  | |
| 11 | 48,6 | 51 % | 17 | 1 | 1 |  |  | |
| 12 | 54,3 | 57 % | 12 | 2 |  | 1 | nguồn | |
| 13 | 57,7 | 60 % | 10 |  | 1 | 2 |  | |
| 14 | 61,9 | 65 % | 7 |  |  |  |  | |
| 15 | 64,9 | 68 % | 7 |  |  | 1 |  | |
| 16 | 67,5 | 71 % | 19 |  | 1 | 2 |  | |
| 17 | 74,4 | 78 % | 12 |  |  | 1 |  | |
| 18 | 79,3 | 83 % | 14 | 1 |  | 1 |  | |
| 19 | 83,8 | 88 % | 11 |  | 1 | 2 |  | |
| 20 | 88,0 | 92 % | 14 | 1 | 2 |  |  | |

**V4 · B-TKxnbkezE**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 13 | 1 | 1 | 3 |  | |
| 2 | 5,5 | 6 % | 13 |  | 1 | 3 |  | |
| 3 | 10,7 | 11 % | 7 |  |  | 1 |  | |
| 4 | 12,8 | 13 % | 3 |  |  |  |  | |
| 5 | 13,8 | 14 % | 15 | 2 |  | 1 |  | |
| 6 | 19,3 | 20 % | 16 |  |  |  |  | |
| 7 | 23,1 | 23 % | 11 |  |  | 1 | hỏi | |
| 8 | 26,3 | 27 % | 14 |  |  | 2 |  | |
| 9 | 31,1 | 32 % | 17 | 1 |  | 2 |  | |
| 10 | 36,3 | 37 % | 9 |  |  | 2 |  | |
| 11 | 39,9 | 40 % | 11 | 1 |  | 4 | thoại | |
| 12 | 43,5 | 44 % | 14 |  |  | 1 |  | |
| 13 | 48,4 | 49 % | 12 | 1 |  | 4 |  | |
| 14 | 56,3 | 57 % | 11 |  |  | 1 |  | |
| 15 | 61,4 | 62 % | 6 | 1 | 1 |  |  | |
| 16 | 64,1 | 65 % | 12 | 1 |  |  |  | |
| 17 | 68,4 | 69 % | 18 | 1 |  | 2 |  | |
| 18 | 75,5 | 77 % | 4 |  |  |  |  | |
| 19 | 77,4 | 78 % | 10 | 1 | 1 | 2 |  | |
| 20 | 80,9 | 82 % | 19 | 1 | 1 | 3 |  | |
| 21 | 88,5 | 90 % | 23 |  |  | 2 |  | |


## Tiêu đề và chủ đề cả kênh (4 video shorts, views làm tròn)

| Mẫu tiêu đề | Có / tổng | Views trung vị khi có | Khi không có |
|---|---|---|---|
| năm trong tiêu đề | 3 / 4 | 285.000 | 6.600 |
| đuôi "– Nơi Năm" | 3 / 4 | 285.000 | 6.600 |
| nghịch lý / so sánh nhất | 4 / 4 | 209.500 | — |
| mẫu "The X That / Who …" | 3 / 4 | 134.000 | 285.000 |
| câu hỏi | 0 / 4 | — | 209.500 |
| dấu hai chấm | 1 / 4 | 6.600 | 285.000 |

Dưới ~20 video thì mỗi dòng chỉ là gợi ý. Nhóm theo **góc kể** (vd. bên nhỏ vs siêu cường, đạo đức đảo ngược) do Luis gán ở `BAO-CAO.md` §1.1, rồi so trung vị views từng nhóm.

## Chữ trên màn hình (OCR rapidocr, 1 khung / giây, gồm phụ đề và watermark)

| V | Khung có chữ | Từ / khung (trung vị) | Khối chữ cùng lúc (tối đa) | Cao chữ trung vị (px trên khung 1080) | Chữ nhỏ (10 % nhỏ nhất, px) | Khối chữ ngoài vùng an toàn | Watermark / handle cố định (y) |
|---|---|---|---|---|---|---|---|
| V1 | 98 % | 8 | 7 | 56 | 33 | 10 % | có, y ≈ 1.048 |
| V2 | 98 % | 9 | 10 | 54 | 32 | 6 % | có, y ≈ 1.050 |
| V3 | 99 % | 8 | 5 | 54 | 33 | 9 % | có, y ≈ 1.052 |
| V4 | 99 % | 7 | 7 | 54 | 33 | 3 % | có, y ≈ 1.050 |

Luật của mình: chữ ≥ 48 px, ≤ 2 khối ngoài phụ đề, mọi chữ trong vùng an toàn. OCR bỏ sót chữ cách điệu / nghiêng và tách một dòng thành nhiều khối: đọc là **ĐO có sai số**, kiểm lại trên sheet. Chữ đứng một chỗ ở ≥ 40 % số khung (watermark, handle) được tách riêng, không tính vào các cột khác. Chữ của từng khung: `_work/<id>.ocr.json`.

## Giọng và nền (demucs tách 2 lớp)

| V | Giọng (LUFS) | Nền: nhạc + SFX (LUFS) | Nền − giọng (dB) | Tiếng nhấn ở nền / phút |
|---|---|---|---|---|
| V1 | -15,3 | -19,2 | -3,9 | 43,5 |
| V2 | -16,1 | -18,9 | -2,8 | 43,3 |
| V3 | -15,7 | -19,2 | -3,5 | 44,6 |
| V4 | -15,5 | -19,0 | -3,5 | 56,6 |

Tiếng nhấn = mức nền vọt ≥ 8 dB so với giây trước (`scripts/stems.py`): gồm SFX **và** nhịp nhạc mạnh, nên là **ƯỚC** độ "bận" của nền, không phải số SFX chính xác. Thời điểm từng tiếng: `_work/<id>.stems.json`.

## 1.3 Khung bảng shot (điền phần còn trống vào `BOC-TACH-HINH.md`)

Cột **Máy quay** đã điền mức chuyển động **ĐO** (trung vị điểm scene trong shot, ‰): đứng yên < 0,6 · chậm < 4 · nhanh. Phụ đề, chữ hiện ra, vật di chuyển cũng tính là chuyển động; kiểu (lia, đẩy, bay) ghi bằng mắt (ƯỚC).

### V1 · GDMJDgUyLNk

Sheets: `_work/sheets/GDMJDgUyLNk-1s-1.png` · `_work/sheets/GDMJDgUyLNk-1s-2.png` · `_work/sheets/GDMJDgUyLNk-1s-3.png` · `_work/sheets/GDMJDgUyLNk-end-1.png` · `_work/sheets/GDMJDgUyLNk-open-1.png`

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–13,0 | 13,0 | | | | chậm (1,0‰) | | | |
| 2 | 13,0–30,1 | 17,1 | | | | đứng yên (0,5‰) | | | |
| 3 | 30,1–33,0 | 2,9 | | | | đứng yên (0,2‰) | | | |
| 4 | 33,0–43,3 | 10,3 | | | | chậm (0,8‰) | | | |
| 5 | 43,3–51,1 | 7,8 | | | | chậm (0,9‰) | | | |

### V2 · W1blLBpUeZ8

Sheets: `_work/sheets/W1blLBpUeZ8-1s-1.png` · `_work/sheets/W1blLBpUeZ8-1s-2.png` · `_work/sheets/W1blLBpUeZ8-1s-3.png` · `_work/sheets/W1blLBpUeZ8-1s-4.png` · `_work/sheets/W1blLBpUeZ8-end-1.png` · `_work/sheets/W1blLBpUeZ8-open-1.png`

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–33,2 | 33,2 | | | | đứng yên (0,5‰) | | | |
| 2 | 33,2–38,6 | 5,5 | | | | chậm (1,6‰) | | | |
| 3 | 38,6–44,5 | 5,8 | | | | đứng yên (0,6‰) | | | |
| 4 | 44,5–50,3 | 5,8 | | | | đứng yên (0,4‰) | | | |
| 5 | 50,3–53,4 | 3,1 | | | | chậm (3,8‰) | | | |
| 6 | 53,4–55,6 | 2,2 | | | | chậm (3,0‰) | | | |
| 7 | 55,6–59,3 | 3,7 | | | | chậm (1,0‰) | | | |
| 8 | 59,3–66,8 | 7,6 | | | | đứng yên (0,2‰) | | | |
| 9 | 66,8–70,8 | 4,0 | | | | chậm (1,3‰) | | | |
| 10 | 70,8–74,3 | 3,5 | | | | chậm (0,9‰) | | | |
| 11 | 74,3–76,8 | 2,5 | | | | nhanh (4,5‰) | | | |
| 12 | 76,8–84,5 | 7,7 | | | | đứng yên (0,3‰) | | | |

### V3 · VspwgSBqlGE

Sheets: `_work/sheets/VspwgSBqlGE-1s-1.png` · `_work/sheets/VspwgSBqlGE-1s-2.png` · `_work/sheets/VspwgSBqlGE-1s-3.png` · `_work/sheets/VspwgSBqlGE-1s-4.png` · `_work/sheets/VspwgSBqlGE-end-1.png` · `_work/sheets/VspwgSBqlGE-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 62,3 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–41,3 | 41,3 | | | | chậm (0,7‰) | | | |
| 2 | 41,3–48,5 | 7,2 | | | | chậm (0,9‰) | | | |
| 3 | 48,5–54,1 | 5,7 | | | | chậm (1,1‰) | | | |
| 4 | 54,1–58,0 | 3,9 | | | | chậm (3,1‰) | | | |
| 5 | 58,0–64,7 | 6,6 | | | | chậm (2,0‰) | | | |
| 6 | 64,7–67,3 | 2,6 | | | | nhanh (4,1‰) | | | |
| 7 | 67,3–74,2 | 6,9 | | | | đứng yên (0,5‰) | | | |
| 8 | 74,2–95,4 | 21,2 | | | | chậm (1,0‰) | | | |

### V4 · B-TKxnbkezE

Sheets: `_work/sheets/B-TKxnbkezE-1s-1.png` · `_work/sheets/B-TKxnbkezE-1s-2.png` · `_work/sheets/B-TKxnbkezE-1s-3.png` · `_work/sheets/B-TKxnbkezE-1s-4.png` · `_work/sheets/B-TKxnbkezE-1s-5.png` · `_work/sheets/B-TKxnbkezE-end-1.png` · `_work/sheets/B-TKxnbkezE-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 53,2 · 54,7 · 59,1 · 61,4 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–52,4 | 52,4 | | | | đứng yên (0,5‰) | | | |
| 2 | 52,4–75,3 | 22,9 | | | | đứng yên (0,6‰) | | | |
| 3 | 75,3–98,7 | 23,3 | | | | đứng yên (0,6‰) | | | |

## File làm việc (`_work/`, git-ignored)

`channel.json` (danh sách kênh) · `<id>.meta.json` · `<id>.probe.json` · `<id>.measure.json` (điểm cắt, đứng yên, độ to) · `<id>.transcript.json` (lời có thời gian từng từ) · `<id>.ocr.json` (chữ trên màn hình) · `<id>.stems.json` (giọng / nền) · `ingest.json` (gộp tất cả, cho bước P2) · `sheets/`.
