# INGEST — Loaded Dice

*Tự sinh bởi `npm run studio:ingest` ngày 2026-11-06; chạy lại sẽ ghi đè, đừng sửa tay (phân tích viết vào `BAO-CAO.md`). Mọi giá trị là **ĐO** (yt-dlp, ffprobe, ffmpeg ebur128 / scene / freezedetect, faster-whisper). Quy trình: `Style Library/QUY-TRINH-PHAN-TICH.md`.*

## 1.1 Kênh

- Kênh: **Loaded Dice** · https://www.youtube.com/@LoadedDiceShorts · 260.000 subscriber
- 18 Shorts (trung vị 9.700.000 views) · 0 video dài (trung vị — views) · số view danh sách kênh đã làm tròn

Top 5 Shorts theo views:

| # | Views | Tiêu đề |
|---|---|---|
| 1 | 37.000.000 | How the Eye In The Sky works |
| 2 | 23.000.000 | Man who broke the bank at Monte Carlo |
| 3 | 22.000.000 | Odds of winning a lottery visualized |
| 4 | 18.000.000 | Unluckiest win ever |
| 5 | 17.000.000 | Why can't they stop playing this terrible game? |

## 1.1 Số liệu video + vị trí trong kênh

| V | ID | Tiêu đề | Đăng | Tuổi (ngày) | Views | Likes | Cmt | Like/view | Cmt/view | Views/ngày | Hạng | × trung vị | Kết luận | Thứ tự đăng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | NCl7daUhvsM | Odds of winning a lottery visualized | 2025-10-09 | 393 | 22.496.652 | 749.139 | 8.800 | 3,33 % | 0,039 % | 57.243 | #3 / 18 shorts | ×2,3 | bình thường | thứ 1 |
| V2 | aVeX3-5K33Q | Man who broke the bank at Monte Carlo | 2025-11-07 | 364 | 23.008.522 | 651.150 | 1.600 | 2,83 % | 0,007 % | 63.210 | #2 / 18 shorts | ×2,4 | bình thường | thứ 4 |
| V3 | B5fQLSLsXCw | How the Eye In The Sky works | 2026-02-26 | 253 | 37.642.107 | 1.070.559 | 7.800 | 2,84 % | 0,021 % | 148.783 | #1 / 18 shorts | ×3,9 | **hit** | thứ 10 |
| V4 | oMvgmMNB_Bg | Dumbest way to cheat the system (don't do it) | 2026-06-30 | 129 | 570.532 | 16.454 | 113 | 2,88 % | 0,020 % | 4.423 | #17 / 18 shorts | ×0,06 | yếu | thứ 16 |
| V5 | AuX7znns3fs | How you GAMBLED ILLEGALY without knowing it | 2026-07-08 | 121 | 2.443.812 | 79.939 | 1.300 | 3,27 % | 0,053 % | 20.197 | #14 / 18 shorts | ×0,25 | yếu | thứ 17 |
| V6 | Nm_AhXH27XQ | CASINO on the MOON would be a NIGHTMARE | 2026-10-25 | 12 | 542.633 | 14.809 | 151 | 2,73 % | 0,028 % | 45.219 | #18 / 18 shorts | ×0,06 | yếu | thứ 18 |

Số liệu lấy ngày 2026-11-06. Kết luận: × trung vị ≥ 3 = hit, 0,5–3 = bình thường, < 0,5 = yếu.

## 1.2 Đo kỹ thuật

| V | Dài (s) | Khung | fps | kbps | LUFS | True peak (dBTP) | LRA | Shot | Shot TB (s) | Dài nhất / ngắn nhất (s) | Shot trong 3 s đầu | Đứng yên ≥ 0,5 s | Lời bắt đầu (ms) | Từ | wpm | Có lời |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | 58,7 | 1080×1920 | 30,00 | 4.179 | -15,9 | -1,1 | 2,4 | 2 | 29,4 | 32,3 / 26,4 | 1 | 2 lần, 1,2 s | 0 | 214 | 225 | 91 % |
| V2 | 67,0 | 1080×1920 | 30,00 | 4.660 | -13,5 | -1,6 | 2,4 | 13 | 5,2 | 12,1 / 1,1 | 1 | 0 lần, 0,0 s | 0 | 211 | 193 | 93 % |
| V3 | 79,0 | 1080×1920 | 30,00 | 5.146 | -17,6 | -2,2 | 3,0 | 20 | 3,9 | 7,9 / 1,2 | 2 | 2 lần, 1,3 s | 0 | 266 | 207 | 90 % |
| V4 | 57,7 | 1440×2560 | 30,00 | 6.041 | -12,9 | -2,0 | 2,7 | 16 | 3,6 | 13,5 / 1,0 | 1 | 4 lần, 1,7 s | 0 | 212 | 224 | 94 % |
| V5 | 89,7 | 1440×2560 | 30,00 | 6.044 | -13,7 | -2,1 | 3,0 | 14 | 6,4 | 15,1 / 0,9 | 2 | 2 lần, 1,5 s | 0 | 333 | 223 | 92 % |
| V6 | 63,8 | 1296×2304 | 30,00 | 5.495 | -15,3 | -1,9 | 2,3 | 16 | 4,0 | 9,9 / 0,5 | 1 | 1 lần, 0,6 s | 0 | 220 | 209 | 98 % |

Shot = đoạn giữa hai điểm cắt (scene > 0,3). Crossfade dài máy dò không bắt: đọc lại trên sheet 1 s, ghi ƯỚC ±0,5 s ở `BOC-TACH-HINH.md`. Shot dài thường là một cảnh máy quay chạy liền (bản đồ bay), không phải lỗi đo. "Lời bắt đầu" từ Whisper sai ±0,2 s; từ đầu tiên hay bị kéo về 0.

## Màu chủ đạo (k-means 6 màu trên 1 khung / giây, gồm cả phụ đề và watermark)

| V | Màu (tỉ lệ diện tích) |
|---|---|
| V1 | `#356A70` 47 % · `#7F8686` 18 % · `#38231C` 12 % · `#945034` 10 % · `#B1ABA8` 10 % · `#EDEDEC` 3 % |
| V2 | `#090604` 43 % · `#3D301E` 23 % · `#646B45` 12 % · `#A9957F` 10 % · `#9C4C29` 8 % · `#D8D2CC` 4 % |
| V3 | `#090B0B` 53 % · `#2C4F3D` 15 % · `#502D1D` 11 % · `#687A8E` 9 % · `#A4614B` 6 % · `#C0BCBF` 6 % |
| V4 | `#0F120E` 41 % · `#354049` 20 % · `#818672` 15 % · `#845E22` 9 % · `#4D87C8` 9 % · `#BBBABB` 7 % |
| V5 | `#BEBCBA` 30 % · `#5A4632` 22 % · `#1F1710` 19 % · `#7E7E7C` 15 % · `#B87A3C` 11 % · `#217FC3` 4 % |
| V6 | `#070906` 39 % · `#393D30` 18 % · `#949394` 17 % · `#64686B` 15 % · `#836928` 8 % · `#C1C7CC` 4 % |

## Kịch bản (đo từ lời đọc)

| V | Câu | Từ / câu (trung vị) | Câu hook: từ · hết ở giây | Con số / mốc đầu tiên (giây) | Con số / câu | Mốc thời gian / phút | Câu hỏi | Câu thoại | Câu dán nhãn nguồn | Khẳng định cần kiểm |
|---|---|---|---|---|---|---|---|---|---|---|
| V1 | 13 | 16 | 14 · 2,8 | 0,0 | 1,00 | 1,0 | 1 | 0 | 0 | 9 |
| V2 | 14 | 14 | 6 · 2,6 | 2,6 | 0,57 | 3,6 | 1 | 0 | 0 | 6 |
| V3 | 19 | 14 | 15 · 4,5 | — | 0,00 | 0,0 | 0 | 0 | 0 | 0 |
| V4 | 9 | 23 | 18 · 4,4 | 16,1 | 0,11 | 0,0 | 0 | 0 | 0 | 1 |
| V5 | 16 | 23 | 23 · 5,1 | 0,0 | 0,38 | 0,7 | 3 | 1 | 1 | 7 |
| V6 | 10 | 21 | 22 · 6,1 | 8,8 | 0,50 | 0,0 | 0 | 0 | 0 | 5 |

Đếm tự động trên transcript Whisper (**ĐO**, sai số khi Whisper nghe nhầm tên hoặc tách câu khác người viết). Mốc thời gian = năm, tháng, "days / weeks / years…". Câu thoại = có "said / replied / told…" hoặc ngoặc kép. Nhãn nguồn = "according to / some sources / historians…". Danh sách khẳng định cần kiểm (nguyên câu, chỉ ở máy): `_work/<id>.claims.md`.

### Bản đồ câu (điền cột Nhịp theo công thức: H · B · N · X · T · V · Đ · K)

**V1 · NCl7daUhvsM**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 14 | 2 |  |  |  | |
| 2 | 2,8 | 5 % | 16 | 1 |  |  |  | |
| 3 | 6,0 | 10 % | 6 | 1 |  |  |  | |
| 4 | 7,3 | 12 % | 23 | 2 |  |  |  | |
| 5 | 11,7 | 20 % | 27 | 1 |  |  |  | |
| 6 | 18,7 | 32 % | 17 | 1 |  | 1 |  | |
| 7 | 23,5 | 40 % | 8 |  |  |  | hỏi | |
| 8 | 26,3 | 45 % | 3 |  |  |  |  | |
| 9 | 26,9 | 46 % | 34 | 2 | 1 |  |  | |
| 10 | 35,1 | 60 % | 4 |  |  |  |  | |
| 11 | 36,8 | 63 % | 30 | 2 |  | 1 |  | |
| 12 | 46,3 | 79 % | 18 | 1 |  |  |  | |
| 13 | 51,4 | 87 % | 14 |  |  |  |  | |

**V2 · aVeX3-5K33Q**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 6 |  |  |  | hỏi | |
| 2 | 2,6 | 4 % | 28 | 1 |  | 1 |  | |
| 3 | 12,2 | 18 % | 21 | 1 | 1 |  |  | |
| 4 | 18,9 | 28 % | 11 |  |  |  |  | |
| 5 | 22,0 | 33 % | 13 | 1 |  |  |  | |
| 6 | 25,8 | 38 % | 15 | 2 |  |  |  | |
| 7 | 30,5 | 46 % | 12 | 1 | 1 |  |  | |
| 8 | 34,0 | 51 % | 14 |  |  |  |  | |
| 9 | 38,7 | 58 % | 18 | 2 | 1 |  |  | |
| 10 | 44,4 | 66 % | 24 |  |  |  |  | |
| 11 | 51,2 | 76 % | 13 |  |  |  |  | |
| 12 | 54,5 | 81 % | 18 |  | 1 |  |  | |
| 13 | 60,7 | 91 % | 8 |  |  |  |  | |
| 14 | 62,8 | 94 % | 10 |  |  |  |  | |

**V3 · B5fQLSLsXCw**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 15 |  |  |  |  | |
| 2 | 4,5 | 6 % | 12 |  |  |  |  | |
| 3 | 7,4 | 9 % | 8 |  |  |  |  | |
| 4 | 9,9 | 12 % | 5 |  |  |  |  | |
| 5 | 11,4 | 14 % | 11 |  |  |  |  | |
| 6 | 14,3 | 18 % | 21 |  |  |  |  | |
| 7 | 19,6 | 25 % | 20 |  |  |  |  | |
| 8 | 25,4 | 32 % | 9 |  |  |  |  | |
| 9 | 28,1 | 36 % | 11 |  |  |  |  | |
| 10 | 31,9 | 40 % | 15 |  |  |  |  | |
| 11 | 36,5 | 46 % | 17 |  |  |  |  | |
| 12 | 41,2 | 52 % | 17 |  |  |  |  | |
| 13 | 46,2 | 59 % | 14 |  |  |  |  | |
| 14 | 50,8 | 64 % | 14 |  |  |  |  | |
| 15 | 54,7 | 69 % | 16 |  |  |  |  | |
| 16 | 59,3 | 75 % | 16 |  |  |  |  | |
| 17 | 63,9 | 81 % | 24 |  |  |  |  | |
| 18 | 71,2 | 90 % | 14 |  |  |  |  | |
| 19 | 75,7 | 96 % | 7 |  |  |  |  | |

**V4 · oMvgmMNB_Bg**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 18 |  |  |  |  | |
| 2 | 4,4 | 8 % | 47 |  |  |  |  | |
| 3 | 16,1 | 28 % | 23 | 1 |  |  |  | |
| 4 | 22,5 | 39 % | 14 |  |  |  |  | |
| 5 | 26,3 | 45 % | 27 |  |  |  |  | |
| 6 | 33,4 | 58 % | 26 |  |  |  |  | |
| 7 | 39,6 | 69 % | 31 |  |  |  |  | |
| 8 | 48,4 | 84 % | 10 |  |  |  |  | |
| 9 | 51,3 | 89 % | 16 |  |  |  |  | |

**V5 · AuX7znns3fs**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 23 | 1 |  | 1 | hỏi, thoại | |
| 2 | 5,1 | 6 % | 15 |  |  |  |  | |
| 3 | 9,6 | 11 % | 24 |  |  |  | nguồn | |
| 4 | 16,7 | 19 % | 45 |  |  |  |  | |
| 5 | 28,6 | 32 % | 23 |  | 1 | 1 |  | |
| 6 | 35,6 | 40 % | 27 |  |  |  |  | |
| 7 | 43,4 | 48 % | 42 | 2 |  |  |  | |
| 8 | 54,2 | 60 % | 13 |  |  |  |  | |
| 9 | 57,0 | 64 % | 8 |  |  |  | hỏi | |
| 10 | 59,2 | 66 % | 7 | 1 |  |  |  | |
| 11 | 61,4 | 68 % | 26 | 1 |  |  |  | |
| 12 | 69,0 | 77 % | 27 |  |  |  |  | |
| 13 | 76,5 | 85 % | 22 |  |  |  |  | |
| 14 | 82,6 | 92 % | 26 | 1 |  |  |  | |
| 15 | 87,4 | 97 % | 2 |  |  | 1 | hỏi | |
| 16 | 88,8 | 99 % | 3 |  |  |  |  | |

**V6 · Nm_AhXH27XQ**

| # | Giây | % video | Từ | Số | Mốc t.gian | Tên | Dấu hiệu | Nhịp |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0 | 0 % | 22 |  |  |  |  | |
| 2 | 6,1 | 10 % | 7 |  |  |  |  | |
| 3 | 8,8 | 14 % | 28 | 1 |  |  |  | |
| 4 | 17,9 | 28 % | 20 | 1 |  |  |  | |
| 5 | 22,8 | 36 % | 19 |  |  |  |  | |
| 6 | 27,7 | 43 % | 29 | 1 |  |  |  | |
| 7 | 36,7 | 57 % | 19 | 1 |  |  |  | |
| 8 | 41,7 | 65 % | 31 | 1 |  |  |  | |
| 9 | 50,2 | 79 % | 20 |  |  |  |  | |
| 10 | 55,9 | 88 % | 25 |  |  |  |  | |


## Tiêu đề và chủ đề cả kênh (18 video shorts, views làm tròn)

| Mẫu tiêu đề | Có / tổng | Views trung vị khi có | Khi không có |
|---|---|---|---|
| năm trong tiêu đề | 0 / 18 | — | 9.700.000 |
| đuôi "– Nơi Năm" | 0 / 18 | — | 9.700.000 |
| nghịch lý / so sánh nhất | 1 / 18 | 7.200.000 | 10.000.000 |
| mẫu "The X That / Who …" | 0 / 18 | — | 9.700.000 |
| câu hỏi | 3 / 18 | 12.000.000 | 9.400.000 |
| dấu hai chấm | 0 / 18 | — | 9.700.000 |

Dưới ~20 video thì mỗi dòng chỉ là gợi ý. Nhóm theo **góc kể** (vd. bên nhỏ vs siêu cường, đạo đức đảo ngược) do Luis gán ở `BAO-CAO.md` §1.1, rồi so trung vị views từng nhóm.

## 1.3 Khung bảng shot (điền phần còn trống vào `BOC-TACH-HINH.md`)

Cột **Máy quay** đã điền mức chuyển động **ĐO** (trung vị điểm scene trong shot, ‰): đứng yên < 0,6 · chậm < 4 · nhanh. Phụ đề, chữ hiện ra, vật di chuyển cũng tính là chuyển động; kiểu (lia, đẩy, bay) ghi bằng mắt (ƯỚC).

### V1 · NCl7daUhvsM

Sheets: `_work/sheets/NCl7daUhvsM-1s-1.png` · `_work/sheets/NCl7daUhvsM-1s-2.png` · `_work/sheets/NCl7daUhvsM-1s-3.png` · `_work/sheets/NCl7daUhvsM-end-1.png` · `_work/sheets/NCl7daUhvsM-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 42,7 · 52,8 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–26,4 | 26,4 | | | | chậm (2,5‰) | | | |
| 2 | 26,4–58,7 | 32,3 | | | | chậm (3,2‰) | | | |

### V2 · aVeX3-5K33Q

Sheets: `_work/sheets/aVeX3-5K33Q-1s-1.png` · `_work/sheets/aVeX3-5K33Q-1s-2.png` · `_work/sheets/aVeX3-5K33Q-1s-3.png` · `_work/sheets/aVeX3-5K33Q-end-1.png` · `_work/sheets/aVeX3-5K33Q-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 16,2 · 23,9 · 51,1 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–12,0 | 12,0 | | | | chậm (1,6‰) | | | |
| 2 | 12,0–19,0 | 7,0 | | | | đứng yên (0,4‰) | | | |
| 3 | 19,0–21,8 | 2,8 | | | | chậm (0,8‰) | | | |
| 4 | 21,8–33,9 | 12,1 | | | | chậm (4,0‰) | | | |
| 5 | 33,9–36,5 | 2,5 | | | | chậm (1,2‰) | | | |
| 6 | 36,5–39,3 | 2,8 | | | | chậm (0,8‰) | | | |
| 7 | 39,3–44,3 | 5,0 | | | | đứng yên (0,6‰) | | | |
| 8 | 44,3–54,9 | 10,6 | | | | chậm (1,0‰) | | | |
| 9 | 54,9–56,8 | 1,9 | | | | chậm (3,0‰) | | | |
| 10 | 56,8–60,8 | 4,0 | | | | chậm (2,9‰) | | | |
| 11 | 60,8–62,9 | 2,1 | | | | chậm (1,2‰) | | | |
| 12 | 62,9–64,0 | 1,1 | | | | chậm (2,5‰) | | | |
| 13 | 64,0–67,0 | 3,0 | | | | chậm (3,1‰) | | | |

### V3 · B5fQLSLsXCw

Sheets: `_work/sheets/B5fQLSLsXCw-1s-1.png` · `_work/sheets/B5fQLSLsXCw-1s-2.png` · `_work/sheets/B5fQLSLsXCw-1s-3.png` · `_work/sheets/B5fQLSLsXCw-1s-4.png` · `_work/sheets/B5fQLSLsXCw-end-1.png` · `_work/sheets/B5fQLSLsXCw-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 2,4 · 23,4 · 40,2 · 55,5 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–1,3 | 1,3 | | | | chậm (0,8‰) | | | |
| 2 | 1,3–7,4 | 6,1 | | | | nhanh (10,6‰) | | | |
| 3 | 7,4–12,6 | 5,1 | | | | nhanh (9,2‰) | | | |
| 4 | 12,6–14,3 | 1,7 | | | | nhanh (6,5‰) | | | |
| 5 | 14,3–19,5 | 5,2 | | | | đứng yên (0,3‰) | | | |
| 6 | 19,5–21,7 | 2,2 | | | | nhanh (8,9‰) | | | |
| 7 | 21,7–25,5 | 3,8 | | | | chậm (3,3‰) | | | |
| 8 | 25,5–28,2 | 2,7 | | | | chậm (1,2‰) | | | |
| 9 | 28,2–32,2 | 4,0 | | | | nhanh (4,5‰) | | | |
| 10 | 32,2–36,5 | 4,3 | | | | chậm (3,0‰) | | | |
| 11 | 36,5–41,5 | 5,0 | | | | nhanh (12,7‰) | | | |
| 12 | 41,5–46,1 | 4,7 | | | | đứng yên (0,3‰) | | | |
| 13 | 46,1–50,7 | 4,6 | | | | nhanh (5,3‰) | | | |
| 14 | 50,7–56,9 | 6,2 | | | | chậm (1,8‰) | | | |
| 15 | 56,9–58,0 | 1,2 | | | | chậm (1,0‰) | | | |
| 16 | 58,0–60,9 | 2,8 | | | | nhanh (6,9‰) | | | |
| 17 | 60,9–63,8 | 2,9 | | | | đứng yên (0,3‰) | | | |
| 18 | 63,8–68,9 | 5,2 | | | | chậm (3,8‰) | | | |
| 19 | 68,9–71,1 | 2,2 | | | | chậm (3,1‰) | | | |
| 20 | 71,1–79,0 | 7,9 | | | | nhanh (7,0‰) | | | |

### V4 · oMvgmMNB_Bg

Sheets: `_work/sheets/oMvgmMNB_Bg-1s-1.png` · `_work/sheets/oMvgmMNB_Bg-1s-2.png` · `_work/sheets/oMvgmMNB_Bg-1s-3.png` · `_work/sheets/oMvgmMNB_Bg-end-1.png` · `_work/sheets/oMvgmMNB_Bg-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 16,9 · 18,6 · 19,4 · 20,9 · 29,8 · 34,2 · 44,5 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–4,4 | 4,4 | | | | nhanh (4,1‰) | | | |
| 2 | 4,4–17,9 | 13,5 | | | | chậm (1,8‰) | | | |
| 3 | 17,9–20,1 | 2,1 | | | | nhanh (25,0‰) | | | |
| 4 | 20,1–22,3 | 2,2 | | | | chậm (2,5‰) | | | |
| 5 | 22,3–26,3 | 4,0 | | | | chậm (0,7‰) | | | |
| 6 | 26,3–27,8 | 1,5 | | | | đứng yên (0,2‰) | | | |
| 7 | 27,8–29,2 | 1,4 | | | | chậm (1,0‰) | | | |
| 8 | 29,2–31,0 | 1,8 | | | | nhanh (13,6‰) | | | |
| 9 | 31,0–32,6 | 1,6 | | | | chậm (1,1‰) | | | |
| 10 | 32,6–40,8 | 8,3 | | | | chậm (2,3‰) | | | |
| 11 | 40,8–42,2 | 1,4 | | | | chậm (3,3‰) | | | |
| 12 | 42,2–43,7 | 1,5 | | | | chậm (1,6‰) | | | |
| 13 | 43,7–45,9 | 2,2 | | | | nhanh (10,8‰) | | | |
| 14 | 45,9–49,4 | 3,5 | | | | chậm (1,6‰) | | | |
| 15 | 49,4–50,3 | 1,0 | | | | chậm (1,0‰) | | | |
| 16 | 50,3–57,7 | 7,4 | | | | chậm (2,4‰) | | | |

### V5 · AuX7znns3fs

Sheets: `_work/sheets/AuX7znns3fs-1s-1.png` · `_work/sheets/AuX7znns3fs-1s-2.png` · `_work/sheets/AuX7znns3fs-1s-3.png` · `_work/sheets/AuX7znns3fs-1s-4.png` · `_work/sheets/AuX7znns3fs-end-1.png` · `_work/sheets/AuX7znns3fs-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 23,6 · 23,9 · 26,3 · 38,5 · 41,4 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–2,6 | 2,6 | | | | chậm (1,0‰) | | | |
| 2 | 2,6–9,7 | 7,1 | | | | nhanh (7,8‰) | | | |
| 3 | 9,7–24,8 | 15,1 | | | | chậm (1,0‰) | | | |
| 4 | 24,8–29,1 | 4,3 | | | | đứng yên (0,2‰) | | | |
| 5 | 29,1–35,9 | 6,8 | | | | chậm (0,7‰) | | | |
| 6 | 35,9–36,8 | 0,9 | | | | chậm (1,3‰) | | | |
| 7 | 36,8–43,2 | 6,5 | | | | chậm (1,9‰) | | | |
| 8 | 43,2–46,8 | 3,5 | | | | chậm (2,0‰) | | | |
| 9 | 46,8–56,1 | 9,4 | | | | chậm (0,9‰) | | | |
| 10 | 56,1–65,0 | 8,8 | | | | nhanh (5,8‰) | | | |
| 11 | 65,0–70,6 | 5,6 | | | | chậm (1,2‰) | | | |
| 12 | 70,6–78,3 | 7,7 | | | | chậm (3,9‰) | | | |
| 13 | 78,3–82,9 | 4,6 | | | | chậm (0,9‰) | | | |
| 14 | 82,9–89,7 | 6,8 | | | | nhanh (4,7‰) | | | |

### V6 · Nm_AhXH27XQ

Sheets: `_work/sheets/Nm_AhXH27XQ-1s-1.png` · `_work/sheets/Nm_AhXH27XQ-1s-2.png` · `_work/sheets/Nm_AhXH27XQ-1s-3.png` · `_work/sheets/Nm_AhXH27XQ-end-1.png` · `_work/sheets/Nm_AhXH27XQ-open-1.png`

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 7,1 · 44,3 · 51,1 · 54,9 · 58,8 · 59,4 · 61,0 · 61,9 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–6,0 | 6,0 | | | | nhanh (5,8‰) | | | |
| 2 | 6,0–8,7 | 2,7 | | | | đứng yên (0,3‰) | | | |
| 3 | 8,7–11,7 | 2,9 | | | | chậm (1,1‰) | | | |
| 4 | 11,7–14,8 | 3,2 | | | | chậm (1,1‰) | | | |
| 5 | 14,8–17,7 | 2,9 | | | | chậm (3,8‰) | | | |
| 6 | 17,7–27,7 | 9,9 | | | | chậm (1,6‰) | | | |
| 7 | 27,7–30,0 | 2,4 | | | | nhanh (7,1‰) | | | |
| 8 | 30,0–33,1 | 3,1 | | | | nhanh (4,1‰) | | | |
| 9 | 33,1–36,7 | 3,6 | | | | chậm (2,3‰) | | | |
| 10 | 36,7–41,7 | 5,0 | | | | chậm (1,4‰) | | | |
| 11 | 41,7–47,6 | 5,9 | | | | nhanh (5,3‰) | | | |
| 12 | 47,6–50,1 | 2,5 | | | | chậm (2,4‰) | | | |
| 13 | 50,1–56,3 | 6,2 | | | | nhanh (9,3‰) | | | |
| 14 | 56,3–62,5 | 6,2 | | | | nhanh (17,6‰) | | | |
| 15 | 62,5–63,0 | 0,5 | | | | nhanh (84,5‰) | | | |
| 16 | 63,0–63,8 | 0,9 | | | | nhanh (5,4‰) | | | |

## File làm việc (`_work/`, git-ignored)

`channel.json` (danh sách kênh) · `<id>.meta.json` · `<id>.probe.json` · `<id>.measure.json` (điểm cắt, đứng yên, độ to) · `<id>.transcript.json` (lời có thời gian từng từ) · `<id>.ocr.json` (chữ trên màn hình) · `<id>.stems.json` (giọng / nền) · `ingest.json` (gộp tất cả, cho bước P2) · `sheets/`.
