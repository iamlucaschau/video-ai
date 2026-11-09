# progress: ep06-bill-benter

*Bàn giao giữa các phiên. Cập nhật sau mỗi bước; phiên mới đọc file này trước.*

| Bước | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Kịch bản (Lucas duyệt) | xong (Lucas duyệt 2026-11-09) | 302 từ, ~91 s; cú lật bắt đầu ở 75%, lộ ở ~85%; Bloomberg 2018 đọc trọn + bài báo 1994 của Benter |
| 2 · Giọng | xong | Charon, tempo 1,02, 11 lượt TTS (9 + 2: câu 3 "he" bị nghe thành "we", câu 27 đọc vội → take riêng). `vo.mp3` 92,9 s, 195 từ/phút. gapAfter 0,8 sau câu 22, 24, 25 |
| 3 · Dựng, nháp (Lucas duyệt) | xong (Lucas duyệt 2026-11-09) | 29 shot; kit thêm `Horse`, `Racetrack` + `TRACK` / `trackAt`, cast Benter; nhạc `bill-benter` (seed 107); precheck 0 SFX trên chữ; soát 3 lượt ảnh |
| 4 · Render 1080 + QA | xong | 1080×1920, 30 fps, 2797 frame, −14,0 LUFS, −2,9 dBTP; render 2 lần (lần 1: khung gần đen ở S19/S27, "sixteen" bị nhạc che → sáng cảnh, hạ nhạc). Bỏ bước wav vì card hết WebGL khi chạy 8 luồng |
| 5 · Gói sản xuất + thumbnail | xong | `xuat-ban.md`, `thumb.jpg` ($16 MILLION / NEVER CASHED) |

**Quyết định đã đổi và vì sao:**
- Hook mẫu 4 (ep05 dùng 2): mở ở đêm 2001, cú lật quay lại đúng cảnh đó.
- Không nêu tên Alan Woods và Paul Coladonato.

**Còn mở:**
- `NGHE.md`: 1 dòng chờ nghe (máy in 1:02); chữ còn bị che: "To" 0:24.6 (tiếng phỉnh), "team"/"slips" 1:02–1:03 (máy in), vài chữ nhỏ dưới nhạc.
- Nháp: nền thấp hơn giọng 14,6 dB, 0 chỗ bị che (ƯỚC). Lỗi còn thấy: S25 mặt Benter sáng gắt; S7 phần 17% chỉ là một chồng tiền bay đi; S24 phiếu to; ngựa tối màu ở cận cảnh.
- 2026-11-09: một phiên khác (style O) làm `src/Root.tsx` không bundle được khoảng 20 phút (thiếu `flock.json`); nháp render qua một entry tạm trong `out/`, đã xoá.
- Câu 20 ("Which brings us back…") đọc nhanh (5,4 từ/giây), Whisper vẫn nghe đúng. Câu 16 Whisper nghe "his computer" (kịch bản "computers"). Chưa ai nghe bằng tai.
- Khoá TTS #2 và #7 đã hết lượt ngày 2026-11-09.
- Hầu hết số chỉ có một nguồn (Bloomberg, bài điều tra có đối chiếu). Cơ chế "sửa tỉ lệ của công chúng" có 2 nguồn.
- Kit chưa có trường đua và ngựa: bước dựng sẽ lâu hơn.

**Bước tiếp:** Lucas nghe bản cuối, quyết dòng "Cần nghe" (máy in) trong `NGHE.md`, rồi đăng. Chưa commit.
