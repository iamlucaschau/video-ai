# SO SÁNH — hannibal.mp4 vs doi-thu

*Tự sinh bởi `npm run studio:compare` ngày 2026-11-01; chạy lại sẽ ghi đè. Cùng một bộ đo cho cả hai bên (`studio:ingest`: ffprobe, ebur128, điểm scene, faster-whisper). Bên họ: 3 video (`Test/doi-thu/INGEST.md`). Chỉ hai dòng âm lượng là luật (đạt / trượt); các dòng khác là khác biệt để đọc: khác vì mình đã chọn khác (QUYẾT trong phân tích) thì giữ, khác mà không có lý do thì xem lại.*

| Đo | Mình | Họ (trung vị) | Họ (khoảng) | Mình ở đâu | Đọc thế nào |
|---|---|---|---|---|---|
| Thời lượng (s) | **130,7** | 125,7 | 125,7–177,1 | trong khoảng | khớp preset của kênh mình |
| Số từ lời đọc | **328** | 423 | 408–514 | thấp hơn khoảng của họ |  |
| Tốc độ đọc (wpm) | **152** | 196 | 175–202 | thấp hơn khoảng của họ | chậm hơn nhiều → dễ lướt; nhanh hơn nhiều → khó theo hình |
| Lời bắt đầu (ms, Whisper ±200) | **0** | 0 | 0–0 | trong khoảng | càng sớm càng ít người lướt ở giây đầu |
| Thời gian có lời (%) | **86** | 90 | 84–98 | trong khoảng |  |
| Số shot (cắt cứng) | **2** | 1 | 1–8 | trong khoảng | style bay liên tục (J) có ít cắt là bình thường |
| Shot trung bình (s) | **65,4** | 125,7 | 22,1–125,7 | trong khoảng |  |
| Shot mở đầu (s) | **78,0** | 125,7 | 18,3–125,7 | trong khoảng |  |
| Shot dài nhất (s) | **78,0** | 125,7 | 86,7–125,7 | thấp hơn khoảng của họ | dài mà không có gì mới → kiểm lesson E3 (≤ ~8 s không điểm mới) |
| Shot trong 3 s đầu | **1** | 1 | 1–1 | trong khoảng |  |
| Điểm cắt mềm / phút | **1,4** | 0,0 | 0,0–2,0 | trong khoảng | crossfade, lớp hình đổi |
| Thời gian hình đứng yên (%) | **0** | 0 | 0–1 | trong khoảng | cao → nguy cơ "slide"; thấp → khung luôn sống |
| Thời gian chuyển động chậm (%) | **100** | 100 | 99–100 | trong khoảng |  |
| Thời gian chuyển động nhanh (%) | **0** | 0 | 0–0 | trong khoảng |  |
| Độ to (LUFS) | **-14,1** | -26,0 | -28,4–-25,2 | ✓ đạt luật | luật: −14 ±1 |
| True peak (dBTP) | **-2,7** | -9,0 | -12,4–-7,9 | ✓ đạt luật | luật: ≤ −1,5 |
| Biên độ to nhỏ (LRA, LU) | **2,8** | 3,7 | 2,4–4,1 | trong khoảng |  |

## Màu chủ đạo (3 màu nhiều diện tích nhất)

- Mình: `#040911` `#33310F` `#59503E`
- Họ V1 (NR2j4BA89zY): `#05151E` `#393821` `#D49C58`
- Họ V2 (eXpSbhhFeb8): `#04141D` `#39361C` `#D59D58`
- Họ V3 (v1TaynnAwYU): `#0C0C0F` `#C7A165` `#B1813F`

## Tóm tắt

- Luật âm lượng: ✓ đạt cả hai.
- Ngoài khoảng của họ (3): Số từ lời đọc (thấp hơn) · Tốc độ đọc (wpm) (thấp hơn) · Shot dài nhất (s) (thấp hơn).
- Không đo ở đây: chữ trên màn hình (cần OCR, chờ duyệt công cụ), SFX / nhạc (cần tách nguồn), giữ chân thật (`npm run studio:stats` sau khi đăng).
