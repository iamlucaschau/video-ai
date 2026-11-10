# progress: ep08-watanabe

*Bàn giao giữa các phiên. Cập nhật sau mỗi bước; phiên mới đọc file này trước.*

| Bước | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Kịch bản (Lucas duyệt) | xong (Lucas duyệt 2026-11-10) | 261 từ, ~78 s; cú lật 2 bậc: bị truy tố ở 65%, khoản phạt $225.000 ở ~86%; 4 bài báo mở (ABC 2009, Las Vegas Sun 2009 ×2, AP 2013) |
| 2 · Giọng | xong | Charon, tempo 1,02, 14 lượt TTS (10 + 2: câu 13 đọc "you played" → take riêng t06a + style; + 2: hook "Do you cut him off?" 0,75 s → take riêng t01b, chậm). `vo.mp3` 79.4 s, 197 wpm. gapAfter 0,8 sau câu 17, 19, 23 |
| 3 · Dựng, nháp (Lucas duyệt) | xong (Lucas duyệt 2026-11-10) | 25 shot; kit thêm `Glass`, `Bottle`, `PieChart`, cast Watanabe / người chị / bellman / vệ sĩ; nhạc `watanabe` (seed 149, 90 bpm); precheck 0 SFX trên chữ; soát 3 lượt ảnh (khung lọt mép S2/S4/S7/S8/S9, chip đè biển S11, tem che mặt S23, S24 dựng lại trên bàn) |
| 4 · Render 1080 + QA | xong | `watanabe.mp4` 1080×1920, 30 fps, 2392 frame, −13,9 LUFS, đỉnh −2,1 dBTP. QA: không khung đen/trắng/nhảy hình; khung cuối ≈ khung 0 (PSNR 45 dB). Cổng nghe: 1 dòng (trống lệch 79 ms, giữ), 1 chữ phụ "In" dưới tiếng phỉnh (giữ) |
| 5 · Gói sản xuất + thumbnail | xong | `xuat-ban.md`; `thumb.jpg` (chai đang rót vào ly, "$127 MILLION / ONE YEAR") |

**Quyết định đã đổi và vì sao:**
- Hook mẫu 2 (ep07 dùng 3).
- Dùng $127 triệu "by his own count" (ABC), không dùng các tổng $189/$204/$350 triệu.
- Bỏ chuyện thuốc giảm đau: công ty điều tra bác bỏ (AP 2013).

**Còn mở:**
- Nháp: cảnh rót rượu không có tiếng (thư viện chưa có tiếng rót); S7 và S8 người nhỏ trong khung rộng; S23 cán dấu sát mặt quan chức; S11–S12 Watanabe nhỏ dưới bảng LED.
- Whisper nghe "Wynn" thành "win" (đồng âm), "Caesars Palace and the Rio" thành "in the Rio" (chữ and đọc lướt). Chưa ai nghe bằng tai.
- Hoàn 15% chỉ có qua Wikipedia trích WSJ (bài gốc cần trả phí) → ƯỚC, lời đọc có "reportedly". Lucas quyết: giữ hay bỏ câu này.
- Người thật còn sống: mọi chuyện say xỉn kể như lời khai ("workers later said", "his answer").

**Bước tiếp:** Lucas nghe bản cuối trên điện thoại, rồi commit / đăng khi muốn.
