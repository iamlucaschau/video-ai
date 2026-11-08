# progress: ep04-ritz-roulette

*Bàn giao giữa các phiên. Cập nhật sau mỗi bước; phiên mới đọc file này trước.*

| Bước | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Kịch bản (Lucas duyệt) | xong (Lucas duyệt 2026-11-08) | 324 từ, ~97 s, cú lật ở 71%; nguồn chính Bloomberg 2023 + BBC 2004 đã đọc trọn |
| 2 · Giọng | xong | Charon, tempo 1,02, 10 lượt TTS (8 + 2 vì câu 18 đọc vội, tách take t05a). `vo.mp3` 99,5 s, 195 từ/phút. gapAfter 0,8 sau câu 20, 27, 34 |
| 3 · Dựng, nháp (Lucas duyệt) | chờ duyệt | 37 shot; kit thêm `RouletteWheel` / `spinAt` / `RouletteTable` / `cellAt`; nhạc `ritz-roulette` (seed 71); soát 4 lượt ảnh tách khung |
| 4 · Render 1080 + QA | xong | 1080×1920, 30 fps, 2995 frame, −14,1 LUFS, −2,8 dBTP; render 2 lần (lần 2 sau cổng nghe: tăng 4 SFX chìm, dời trống 2 frame) |
| 5 · Gói sản xuất + thumbnail | xong | `xuat-ban.md`, `thumb.jpg` (Tosa giữa khung, vòng và đồi phỉnh, chữ £1.3 MILLION / NO LASER) |

**Quyết định đã đổi và vì sao:**
- Hook mẫu 3 (câu hỏi sốc), vì ep01–03 đã dùng 4, 2, 1.
- Cú lật là "không có laser" (Bloomberg 2023), không phải chuyện được giữ tiền: chuyện giữ tiền đặt ở bậc 5.
- Thêm câu "thirty-seven pockets" ở bậc 1 để cài trước chỗ yếu của vòng quay và đẩy cú lật lên 71%.

**Còn mở:**
- `NGHE.md` còn 2 dòng chờ Lucas nghe (trống 1:11, bóng rơi 1:20). QA khung: không khung đen hay nhảy hình; có các đoạn đứng hình ngắn ở shot tĩnh (S17 điện thoại, S20 trang báo), cố ý.
- Nháp: nền thấp hơn giọng 14,3 dB, 0 chỗ bị che (ƯỚC, demucs). Lỗi còn thấy: S17 bốn điện thoại trên bàn trắng trông như slide; S13 trưởng an ninh chỉ thấy lưng; S23 quầy thu ngân có song sắt cạnh chip NO CHARGES dễ đọc thành nhà tù; S28 miệng mở hơi lạ.
- Chỗ tách câu 29/30: chữ "just" nằm cuối file câu 29 (phụ đề lấy theo tiếng thật nên vẫn đúng chữ, chỉ lệch chỗ ngắt). Whisper nghe câu 20 riêng là "laser scan", nghe cả file thì đúng "scam". Chưa ai nghe bằng tai.
- "There was no laser" chỉ có một nguồn (Bloomberg), dù là nguồn điều tra kỹ nhất.

**Bước tiếp:** Lucas nghe bản cuối, quyết 2 dòng trong `NGHE.md`, rồi đăng. Chưa commit.
