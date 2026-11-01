# SO SÁNH — l-thermopylae-full.mp4 vs History Maps Lore

*Tự sinh bởi `npm run studio:compare` ngày 2026-11-01; chạy lại sẽ ghi đè. Cùng một bộ đo cho cả hai bên (`studio:ingest`: ffprobe, ebur128, điểm scene, faster-whisper). Bên họ: 4 video (`Test/History Maps Lore/INGEST.md`). Chỉ hai dòng âm lượng là luật (đạt / trượt); các dòng khác là khác biệt để đọc: khác vì mình đã chọn khác (QUYẾT trong phân tích) thì giữ, khác mà không có lý do thì xem lại.*

| Đo | Mình | Họ (trung vị) | Họ (khoảng) | Mình ở đâu | Đọc thế nào |
|---|---|---|---|---|---|
| Kịch bản: số câu | **28** | 19 | 12–21 | cao hơn khoảng của họ |  |
| Kịch bản: từ / câu (trung vị) | **9** | 12 | 11–14 | thấp hơn khoảng của họ | câu ngắn dễ nghe trên điện thoại |
| Kịch bản: câu hook (từ) | **18** | 13 | 9–16 | cao hơn khoảng của họ |  |
| Kịch bản: câu hook hết ở giây | **8,0** | 5,5 | 5,4–5,7 | cao hơn khoảng của họ | người xem quyết định lướt trong 1–3 s đầu |
| Kịch bản: con số / mốc đầu tiên (giây) | **0,0** | 0,0 | 0,0–0,0 | trong khoảng | công thức: năm ngay câu đầu |
| Kịch bản: con số / câu | **0,46** | 0,51 | 0,33–0,67 | trong khoảng | luật: ≤ 1 con số mới mỗi câu |
| Kịch bản: mốc thời gian / phút | **3,5** | 6,3 | 3,0–7,1 | trong khoảng | mốc tháng / ngày làm xương sống (nhịp V) |
| Kịch bản: câu thoại | **2** | 1 | 0–2 | trong khoảng |  |
| Kịch bản: câu dán nhãn nguồn | **3** | 1 | 0–1 | cao hơn khoảng của họ | mình: mọi số tranh cãi đều dán nhãn |
| Kịch bản: khẳng định cần kiểm | **20** | 17 | 11–18 | cao hơn khoảng của họ | mỗi câu phải có dòng trong bảng kiểm chứng |
| Thời lượng (s) | **102,7** | 89,9 | 51,1–98,7 | cao hơn khoảng của họ | khớp preset của kênh mình |
| Số từ lời đọc | **244** | 240 | 128–258 | trong khoảng |  |
| Tốc độ đọc (wpm) | **145** | 163 | 161–166 | thấp hơn khoảng của họ | chậm hơn nhiều → dễ lướt; nhanh hơn nhiều → khó theo hình |
| Lời bắt đầu (ms, Whisper ±200) | **0** | 0 | 0–0 | trong khoảng | càng sớm càng ít người lướt ở giây đầu |
| Thời gian có lời (%) | **86** | 85 | 84–88 | trong khoảng |  |
| Số shot (cắt cứng) | **1** | 7 | 3–12 | thấp hơn khoảng của họ | style bay liên tục (J) có ít cắt là bình thường |
| Shot trung bình (s) | **102,7** | 11,1 | 7,0–32,9 | cao hơn khoảng của họ |  |
| Shot mở đầu (s) | **102,7** | 37,2 | 13,0–52,4 | cao hơn khoảng của họ |  |
| Shot dài nhất (s) | **102,7** | 37,2 | 17,1–52,4 | cao hơn khoảng của họ | dài mà không có gì mới → kiểm lesson E3 (≤ ~8 s không điểm mới) |
| Shot trong 3 s đầu | **1** | 1 | 1–1 | trong khoảng |  |
| Điểm cắt mềm / phút | **7,0** | 0,3 | 0,0–2,4 | cao hơn khoảng của họ | crossfade, lớp hình đổi |
| Thời gian hình đứng yên (%) | **100** | 55 | 7–100 | trong khoảng | cao → nguy cơ "slide"; thấp → khung luôn sống |
| Thời gian chuyển động chậm (%) | **0** | 43 | 0–90 | trong khoảng |  |
| Thời gian chuyển động nhanh (%) | **0** | 1 | 0–3 | trong khoảng |  |
| Độ to (LUFS) | **-14,1** | -14,2 | -14,3–-14,1 | ✓ đạt luật | luật: −14 ±1 |
| True peak (dBTP) | **-2,9** | -2,1 | -2,9–-1,9 | ✓ đạt luật | luật: ≤ −1,5 |
| Biên độ to nhỏ (LRA, LU) | **2,4** | 2,1 | 1,9–2,2 | cao hơn khoảng của họ |  |
| Khung có chữ (%, OCR) | **100** | 98 | 98–99 | cao hơn khoảng của họ | gồm phụ đề và watermark |
| Từ trên màn hình / khung | **4** | 8 | 7–9 | thấp hơn khoảng của họ | luật: ít chữ (phụ đề + ≤ 2 khối ≤ 5 từ) |
| Khối chữ cùng lúc (tối đa) | **4** | 7 | 5–10 | thấp hơn khoảng của họ | luật: ≤ 2 ngoài phụ đề (OCR tách 1 dòng thành nhiều khối) |
| Cao chữ trung vị (px / 1080) | **60** | 54 | 54–56 | cao hơn khoảng của họ | luật: chữ ≥ 48 px |
| Chữ nhỏ (10 % nhỏ nhất, px) | **51** | 33 | 32–33 | cao hơn khoảng của họ | dưới ~40 px là khó đọc trên điện thoại |
| Khối chữ ngoài vùng an toàn (%) | **0** | 7 | 3–10 | thấp hơn khoảng của họ | luật: 0 (trừ watermark / handle ở mép) |
| Nền − giọng (dB, demucs) | **-14,7** | -3,5 | -3,9–-2,8 | thấp hơn khoảng của họ | càng âm, giọng càng nổi trên nhạc + SFX |
| Tiếng nhấn ở nền / phút (ƯỚC) | **9,9** | 44,1 | 43,3–56,6 | thấp hơn khoảng của họ | SFX + nhịp nhạc mạnh; hiệu chỉnh trên Ep02: 39 đếm vs 41 đặt |

## Màu chủ đạo (3 màu nhiều diện tích nhất)

- Mình: `#3C4548` `#252C30` `#766456`
- Họ V1 (GDMJDgUyLNk): `#7B6752` `#1E1E20` `#483E38`
- Họ V2 (W1blLBpUeZ8): `#122B35` `#29424E` `#85836C`
- Họ V3 (VspwgSBqlGE): `#1D2C32` `#A5977D` `#7A745E`
- Họ V4 (B-TKxnbkezE): `#DFDFCD` `#211510` `#B78C6D`

## Tóm tắt

- Luật âm lượng: ✓ đạt cả hai.
- Ngoài khoảng của họ (22): Kịch bản: số câu (cao hơn) · Kịch bản: từ / câu (trung vị) (thấp hơn) · Kịch bản: câu hook (từ) (cao hơn) · Kịch bản: câu hook hết ở giây (cao hơn) · Kịch bản: câu dán nhãn nguồn (cao hơn) · Kịch bản: khẳng định cần kiểm (cao hơn) · Thời lượng (s) (cao hơn) · Tốc độ đọc (wpm) (thấp hơn) · Số shot (cắt cứng) (thấp hơn) · Shot trung bình (s) (cao hơn) · Shot mở đầu (s) (cao hơn) · Shot dài nhất (s) (cao hơn) · Điểm cắt mềm / phút (cao hơn) · Biên độ to nhỏ (LRA, LU) (cao hơn) · Khung có chữ (%, OCR) (cao hơn) · Từ trên màn hình / khung (thấp hơn) · Khối chữ cùng lúc (tối đa) (thấp hơn) · Cao chữ trung vị (px / 1080) (cao hơn) · Chữ nhỏ (10 % nhỏ nhất, px) (cao hơn) · Khối chữ ngoài vùng an toàn (%) (thấp hơn) · Nền − giọng (dB, demucs) (thấp hơn) · Tiếng nhấn ở nền / phút (ƯỚC) (thấp hơn).
- Không đo ở đây: kiểu chữ / font, nội dung hình (bản đồ, tranh), giữ chân thật (`npm run studio:stats` sau khi đăng). Chữ (OCR) và tiếng nhấn (demucs) có sai số: kiểm lại trên sheet / tai.
