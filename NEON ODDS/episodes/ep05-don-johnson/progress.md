# progress: ep05-don-johnson

*Bàn giao giữa các phiên. Cập nhật sau mỗi bước; phiên mới đọc file này trước.*

| Bước | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Kịch bản (Lucas duyệt) | xong (Lucas duyệt 2026-11-08, giữ dòng 12) | 263 từ, ~79 s, cú lật ở ~79%; The Atlantic có paywall nên chỉ đọc phần mở đầu, còn lại qua BB, LVA, WHYY, The Week, Wikipedia |
| 2 · Giọng | xong | Charon, tempo 1,02, 9 lượt TTS. `vo.mp3` 82,9 s, 190 từ/phút. gapAfter 0,8 sau câu 15, 28, 31 |
| 3 · Dựng, nháp (Lucas duyệt) | xong (Lucas duyệt 2026-11-09) | 33 shot; kit thêm `BlackjackTable`, `Contract`, `Card rank`, cast Don/marketer; nhạc `don-johnson` (seed 89); precheck cổng nghe: 2 SFX trên chữ → hạ nhỏ; soát 3 lượt ảnh |
| 4 · Render 1080 + QA | xong | 1080×1920, 30 fps, 2497 frame, −14,0 LUFS, −2,9 dBTP; một lần render (cổng nghe chạy trước trên wav: hạ 2 SFX đè chữ, tăng cửa cuốn) |
| 5 · Gói sản xuất + thumbnail | xong | `xuat-ban.md`, `thumb.jpg` ($15 MILLION / NO CARD COUNTING) |

**Quyết định đã đổi và vì sao:**
- Hook mẫu 2 (ep04 dùng 3).
- Không lách paywall của The Atlantic; dùng các bài trích và tóm tắt mở.

**Còn mở:**
- `NGHE.md`: 2 SFX nhỏ (chờ nghe); 3 chữ bị nền che ("he" 0:19.7, "thousand." / "It's" 0:58.3) vẫn còn sau khi hạ phỉnh, nên che là nhạc/tiếng phòng, không phải SFX. QA: 3 khung "nhảy hình" ở 24,7–25,0 s là sáu bộ bài hiện lần lượt, cố ý.
- Nháp: 0 chỗ giọng bị nền che (ƯỚC). Lỗi còn thấy: S21 khán giả đứng ngay sau đầu Don; S7 phỉnh che giữa lá bài; mặt Don ở cận cảnh hơi to.
- Dòng 12 (tự tính $200.000) Lucas giữ.
- Whisper nghe câu 23 là "That's the worst loss" (kịch bản "It's"); giọng tự đổi một chữ, nghĩa không đổi. Chưa ai nghe bằng tai.
- Luật bàn (6 bộ, soft 17, tách át lại) chỉ có Wikipedia tổng hợp.

**Bước tiếp:** Lucas nghe bản cuối, quyết 2 dòng "Cần nghe" và 3 chữ bị nền che trong `NGHE.md`, rồi đăng. Chưa commit.
