# SO SÁNH — m-doss.mp4 vs Squire Explains

*Tự sinh bởi `npm run studio:compare` ngày 2026-11-04; chạy lại sẽ ghi đè. Cùng một bộ đo cho cả hai bên (`studio:ingest`: ffprobe, ebur128, điểm scene, faster-whisper). Bên họ: 11 video (`Test/Squire Explains/INGEST.md`). Chỉ hai dòng âm lượng là luật (đạt / trượt); các dòng khác là khác biệt để đọc: khác vì mình đã chọn khác (QUYẾT trong phân tích) thì giữ, khác mà không có lý do thì xem lại.*

| Đo | Mình | Họ (trung vị) | Họ (khoảng) | Mình ở đâu | Đọc thế nào |
|---|---|---|---|---|---|
| Kịch bản: số câu | **20** | 22 | 13–198 | trong khoảng |  |
| Kịch bản: từ / câu (trung vị) | **11** | 11 | 8–16 | trong khoảng | câu ngắn dễ nghe trên điện thoại |
| Kịch bản: câu hook (từ) | **14** | 14 | 11–24 | trong khoảng |  |
| Kịch bản: câu hook hết ở giây | **4,4** | 5,1 | 3,6–7,3 | trong khoảng | người xem quyết định lướt trong 1–3 s đầu |
| Kịch bản: con số / mốc đầu tiên (giây) | **4,4** | 4,2 | 0,0–21,8 | trong khoảng | công thức: năm ngay câu đầu |
| Kịch bản: con số / câu | **0,40** | 0,26 | 0,12–0,85 | trong khoảng | luật: ≤ 1 con số mới mỗi câu |
| Kịch bản: mốc thời gian / phút | **2,9** | 1,6 | 0,0–3,9 | trong khoảng | mốc tháng / ngày làm xương sống (nhịp V) |
| Kịch bản: câu thoại | **1** | 3 | 0–6 | trong khoảng |  |
| Kịch bản: câu dán nhãn nguồn | **0** | 0 | 0–2 | trong khoảng | mình: mọi số tranh cãi đều dán nhãn |
| Kịch bản: khẳng định cần kiểm | **11** | 13 | 7–98 | trong khoảng | mỗi câu phải có dòng trong bảng kiểm chứng |
| Thời lượng (s) | **62,6** | 74,8 | 48,6–700,3 | trong khoảng | khớp preset của kênh mình |
| Số từ lời đọc | **210** | 246 | 133–1.941 | trong khoảng |  |
| Tốc độ đọc (wpm) | **204** | 192 | 163–208 | trong khoảng | chậm hơn nhiều → dễ lướt; nhanh hơn nhiều → khó theo hình |
| Lời bắt đầu (ms, Whisper ±200) | **0** | 0 | 0–0 | trong khoảng | càng sớm càng ít người lướt ở giây đầu |
| Thời gian có lời (%) | **85** | 90 | 78–95 | trong khoảng |  |
| Số shot (cắt cứng) | **17** | 36 | 14–359 | trong khoảng | style bay liên tục (J) có ít cắt là bình thường |
| Shot trung bình (s) | **3,7** | 2,7 | 1,8–4,0 | trong khoảng |  |
| Shot mở đầu (s) | **1,6** | 3,1 | 1,3–27,6 | trong khoảng |  |
| Shot dài nhất (s) | **11,0** | 9,8 | 4,2–27,6 | trong khoảng | dài mà không có gì mới → kiểm lesson E3 (≤ ~8 s không điểm mới) |
| Shot trong 3 s đầu | **2** | 1 | 1–3 | trong khoảng |  |
| Điểm cắt mềm / phút | **9,6** | 8,9 | 8,0–18,6 | trong khoảng | crossfade, lớp hình đổi |
| Thời gian hình đứng yên (%) | **85** | 7 | 0–46 | cao hơn khoảng của họ | cao → nguy cơ "slide"; thấp → khung luôn sống |
| Thời gian chuyển động chậm (%) | **13** | 47 | 24–69 | thấp hơn khoảng của họ |  |
| Thời gian chuyển động nhanh (%) | **2** | 34 | 4–75 | thấp hơn khoảng của họ |  |
| Độ to (LUFS) | **-14,0** | -14,1 | -14,4–-14,1 | ✓ đạt luật | luật: −14 ±1 |
| True peak (dBTP) | **-3,0** | -2,0 | -2,3–-0,8 | ✓ đạt luật | luật: ≤ −1,5 |
| Biên độ to nhỏ (LRA, LU) | **1,6** | 2,7 | 2,2–3,1 | thấp hơn khoảng của họ |  |
| Khung có chữ (%, OCR) | **98** | 95 | 7–100 | trong khoảng | gồm phụ đề và watermark |
| Từ trên màn hình / khung | **3** | 2 | 1–3 | trong khoảng | luật: ít chữ (phụ đề + ≤ 2 khối ≤ 5 từ) |
| Khối chữ cùng lúc (tối đa) | **3** | 7 | 3–12 | trong khoảng | luật: ≤ 2 ngoài phụ đề (OCR tách 1 dòng thành nhiều khối) |
| Cao chữ trung vị (px / 1080) | **57** | 48 | 27–52 | cao hơn khoảng của họ | luật: chữ ≥ 48 px |
| Chữ nhỏ (10 % nhỏ nhất, px) | **52** | 27 | 14–44 | cao hơn khoảng của họ | dưới ~40 px là khó đọc trên điện thoại |
| Khối chữ ngoài vùng an toàn (%) | **0** | 10 | 2–66 | thấp hơn khoảng của họ | luật: 0 (trừ watermark / handle ở mép) |
| Nền − giọng (dB, demucs) | **-15,0** | -11,4 | -15,0–-8,6 | trong khoảng | càng âm, giọng càng nổi trên nhạc + SFX |
| Tiếng nhấn ở nền / phút (ƯỚC) | **11,5** | 36,4 | 17,0–53,0 | thấp hơn khoảng của họ | SFX + nhịp nhạc mạnh; hiệu chỉnh trên Ep02: 39 đếm vs 41 đặt |
| Chỗ giọng bị nền che / phút (ƯỚC) | **0,0** | — | — | — | nền trong vòng 3 dB của giọng lúc đang nói; danh sách giây ở cuối |

## Màu chủ đạo (3 màu nhiều diện tích nhất)

- Mình: `#261A1F` `#4B4755` `#DDB47C`
- Họ V1 (hZT0hBblgT0): `#5D5739` `#858659` `#2B312C`
- Họ V2 (MzW5RNR7nsU): `#D6C195` `#B7C4CA` `#B09F71`
- Họ V3 (Cxjnxg0Ibjs): `#B89461` `#8B5E3D` `#D9B98A`
- Họ V4 (C9Yfam1foCU): `#36292F` `#595655` `#CDAE80`
- Họ V5 (2i8tQ3yxpDk): `#625D44` `#927750` `#D0D7D8`
- Họ V6 (CIYIefUvHq0): `#D0CDC0` `#43362E` `#877247`
- Họ V7 (XuOxszx1TU0): `#938161` `#6D5649` `#C7B38B`
- Họ V8 (1vPQmuX3Ckc): `#BE9F6A` `#CFB790` `#9A7A52`
- Họ V9 (0LvsCccxIm8): `#1A1111` `#4A382D` `#7A5F40`
- Họ V10 (eSEQdunl1_E): `#6D5646` `#AD663C` `#422C21`
- Họ V11 (nFO9uCmAv_w): `#6E7859` `#79A7BD` `#CEDBDA`

## Tóm tắt

- Luật âm lượng: ✓ đạt cả hai.
- Ngoài khoảng của họ (8): Thời gian hình đứng yên (%) (cao hơn) · Thời gian chuyển động chậm (%) (thấp hơn) · Thời gian chuyển động nhanh (%) (thấp hơn) · Biên độ to nhỏ (LRA, LU) (thấp hơn) · Cao chữ trung vị (px / 1080) (cao hơn) · Chữ nhỏ (10 % nhỏ nhất, px) (cao hơn) · Khối chữ ngoài vùng an toàn (%) (thấp hơn) · Tiếng nhấn ở nền / phút (ƯỚC) (thấp hơn).
- Không đo ở đây: kiểu chữ / font, nội dung hình (bản đồ, tranh), giữ chân thật (`npm run studio:stats` sau khi đăng). Chữ (OCR) và tiếng nhấn (demucs) có sai số: kiểm lại trên sheet / tai.
