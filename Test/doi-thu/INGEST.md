# INGEST — doi-thu

*Tự sinh bởi `npm run studio:ingest` ngày 2026-11-01; chạy lại sẽ ghi đè, đừng sửa tay (phân tích viết vào `BAO-CAO.md`). Mọi giá trị là **ĐO** (yt-dlp, ffprobe, ffmpeg ebur128 / scene / freezedetect, faster-whisper). Quy trình: `Style Library/QUY-TRINH-PHAN-TICH.md`.*

## 1.1 Kênh

- Kênh: **Guilherme Video Editor** · https://www.youtube.com/channel/UCWv8XjtSpZgvNPBsrjHvMhg · 4.540 subscriber
- 6 Shorts (trung vị 58.500 views) · 1 video dài (trung vị 862 views) · số view danh sách kênh đã làm tròn

Top 5 Shorts theo views:

| # | Views | Tiêu đề |
|---|---|---|
| 1 | 4.200.000 | The route Odysseus traveled in the Odyssey! #odyssey #odysseus #christophernolan |
| 2 | 779.000 | How Did Moses and Israel Take 40 Years to Reach the Promised Land? #holybible #bible #christianity |
| 3 | 112.000 | A rota que Odisseu percorreu durante a Odisseia #odisseia #odisseu #christophernolan |
| 4 | 5.000 | Como Moisés e o povo de Israel passaram 40 anos no deserto antes de chegar à Terra Prometida? |
| 5 | 2.500 | Qual país ficou rico cortando gastos públicos e privatizando tudo? #Economia #Politica #Lula |

## 1.1 Số liệu video + vị trí trong kênh

| V | ID | Tiêu đề | Đăng | Tuổi (ngày) | Views | Likes | Cmt | Like/view | Cmt/view | Views/ngày | Hạng | × trung vị | Kết luận | Thứ tự đăng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | NR2j4BA89zY | A rota que Odisseu percorreu durante a Odisseia #odisseia #odisseu #christophernolan | 2026-07-24 | 100 | 112.393 | 4.770 | 105 | 4,24 % | 0,093 % | 1.124 | #3 / 6 shorts | ×1,9 | bình thường | thứ 1 |
| V2 | eXpSbhhFeb8 | The route Odysseus traveled in the Odyssey! #odyssey #odysseus #christophernolan | 2026-07-25 | 99 | 4.260.992 | 139.183 | 1.900 | 3,27 % | 0,045 % | 43.040 | #1 / 6 shorts | ×72,8 | **hit** | thứ 2 |
| V3 | v1TaynnAwYU | How Did Moses and Israel Take 40 Years to Reach the Promised Land? #holybible #bible #christianity | 2026-08-12 | 81 | 779.273 | 20.779 | 1.300 | 2,67 % | 0,167 % | 9.621 | #2 / 6 shorts | ×13,3 | **hit** | thứ 4 |

Số liệu lấy ngày 2026-11-01. Kết luận: × trung vị ≥ 3 = hit, 0,5–3 = bình thường, < 0,5 = yếu.

## 1.2 Đo kỹ thuật

| V | Dài (s) | Khung | fps | kbps | LUFS | True peak (dBTP) | LRA | Shot | Shot TB (s) | Dài nhất / ngắn nhất (s) | Shot trong 3 s đầu | Đứng yên ≥ 0,5 s | Lời bắt đầu (ms) | Từ | wpm | Có lời |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 | 125,7 | 608×1080 | 30,00 | 602 | -26,0 | -9,0 | 2,4 | 1 | 125,7 | 125,7 / 125,7 | 1 | 0 lần, 0,0 s | 0 | 408 | 196 | 90 % |
| V2 | 125,7 | 608×1080 | 30,00 | 793 | -25,2 | -7,9 | 3,7 | 1 | 125,7 | 125,7 / 125,7 | 1 | 0 lần, 0,0 s | 0 | 423 | 202 | 98 % |
| V3 | 177,1 | 608×1080 | 30,00 | 798 | -28,4 | -12,4 | 4,1 | 8 | 22,1 | 86,7 / 1,4 | 1 | 1 lần, 0,6 s | 0 | 514 | 175 | 84 % |

Shot = đoạn giữa hai điểm cắt (scene > 0,3). Crossfade dài máy dò không bắt: đọc lại trên sheet 1 s, ghi ƯỚC ±0,5 s ở `BOC-TACH-HINH.md`. Shot dài thường là một cảnh máy quay chạy liền (bản đồ bay), không phải lỗi đo. "Lời bắt đầu" từ Whisper sai ±0,2 s; từ đầu tiên hay bị kéo về 0.

## Màu chủ đạo (k-means 6 màu trên 1 khung / giây, gồm cả phụ đề và watermark)

| V | Màu (tỉ lệ diện tích) |
|---|---|
| V1 | `#05151E` 52 % · `#393821` 26 % · `#D49C58` 8 % · `#996C33` 6 % · `#566366` 5 % · `#C3B5A1` 3 % |
| V2 | `#04141D` 53 % · `#39361C` 25 % · `#D59D58` 8 % · `#9B6D32` 7 % · `#4D5D61` 5 % · `#BFB3A0` 3 % |
| V3 | `#0C0C0F` 35 % · `#C7A165` 17 % · `#B1813F` 16 % · `#443324` 14 % · `#7B5934` 13 % · `#DAC29D` 5 % |

## 1.3 Khung bảng shot (điền phần còn trống vào `BOC-TACH-HINH.md`)

Cột **Máy quay** đã điền mức chuyển động **ĐO** (trung vị điểm scene trong shot, ‰): đứng yên < 0,6 · chậm < 4 · nhanh. Phụ đề, chữ hiện ra, vật di chuyển cũng tính là chuyển động; kiểu (lia, đẩy, bay) ghi bằng mắt (ƯỚC).

### V1 · NR2j4BA89zY

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–125,7 | 125,7 | | | | chậm (1,0‰) | | | |

### V2 · eXpSbhhFeb8

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–125,7 | 125,7 | | | | chậm (1,1‰) | | | |

### V3 · v1TaynnAwYU

Điểm cắt mềm có thể (crossfade, scene 0,12–0,3; xem sheet để tách shot): 20,1 · 33,7 · 44,9 · 78,8 · 128,5 · 168,6 s

| # | Vào–ra (s) | Dài (s) | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (T#) | Dựng lại (🟢🟡🟠🔴) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–18,3 | 18,3 | | | | chậm (2,3‰) | | | |
| 2 | 18,3–21,5 | 3,2 | | | | chậm (1,3‰) | | | |
| 3 | 21,5–22,9 | 1,4 | | | | đứng yên (0,5‰) | | | |
| 4 | 22,9–25,5 | 2,6 | | | | chậm (1,3‰) | | | |
| 5 | 25,5–70,1 | 44,6 | | | | chậm (1,1‰) | | | |
| 6 | 70,1–84,4 | 14,3 | | | | chậm (2,7‰) | | | |
| 7 | 84,4–90,4 | 6,0 | | | | chậm (1,3‰) | | | |
| 8 | 90,4–177,1 | 86,7 | | | | chậm (1,0‰) | | | |

## File làm việc (`_work/`, git-ignored)

`channel.json` (danh sách kênh) · `<id>.meta.json` · `<id>.probe.json` · `<id>.measure.json` (điểm cắt, đứng yên, độ to) · `<id>.transcript.json` (lời có thời gian từng từ) · `ingest.json` (gộp tất cả, cho bước P2) · `sheets/`.
