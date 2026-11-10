# progress: ep07-ron-harris

*Bàn giao giữa các phiên. Cập nhật sau mỗi bước; phiên mới đọc file này trước.*

| Bước | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Kịch bản (Lucas duyệt) | xong (Lucas duyệt 2026-11-09) | 249 từ, ~75 s, cú lật ở 72%; 2 bài Las Vegas Sun 1998 + hồ sơ New Jersey đọc trọn |
| 2 · Giọng | xong | Charon, tempo 1,02, 13 lượt TTS (9 + 4: câu 18 bị nuốt vào câu 17 → take riêng, câu 16–17 đọc lại, câu 19 đọc vội → take riêng). `vo.mp3` 80.1 s. gapAfter 0,8 sau câu 18, 19, 24 |
| 3 · Dựng, nháp (Lucas duyệt) | xong (Lucas duyệt 2026-11-10) | 26 shot; kit thêm `Laptop`, `KenoBoard`, cast Harris/cộng sự/thẩm phán; nhạc `ron-harris` (seed 131); precheck: 2 SFX trên chữ "jackpot" → dời; soát 4 lượt ảnh |
| 4 · Render 1080 + QA | xong | `ron-harris.mp4` 1080×1920, 30 fps, 2413 frame, −14,0 LUFS, đỉnh −3,0 dBTP. QA: không khung đen/trắng; nhảy hình 17–19 s là màn hình mã cuộn từng dòng (cố ý); khung cuối ≈ khung 0 (PSNR 43 dB). Cổng nghe: 1 dòng (trống lệch 79 ms, giữ), 2 chữ bị nhạc che sát ngưỡng (giữ) |
| 5 · Gói sản xuất + thumbnail | xong | `xuat-ban.md`; `thumb.jpg` 207 KB (laptop xoay về máy quay, có dòng mã đỏ; chữ trên vùng trần tối) |

**Quyết định đã đổi và vì sao:**
- Hook mẫu 3 (ep06 dùng 4).
- Không dùng tỉ lệ trúng keno (các nguồn thứ cấp lệch nhau).

**Còn mở:**
- Nháp: nền thấp hơn giọng 13,5 dB, 0 chỗ bị che (ƯỚC). Lỗi còn thấy: S8 đồng xu bị loá trắng; S15 chữ KENO trên máy lọt mép trên; S21 cửa cuốn tối; S24 lưng Harris chiếm nửa khung; laptop trên xe đẩy ở cảnh mở đầu nằm dưới vùng phụ đề.
- Whisper nghe "keno" thành "Kino"/"keynote", "a cent" thành "a scent", "win" thành "wind" (đều là từ đồng âm hoặc từ hiếm). Chưa ai nghe bằng tai.
- Kết cục vụ New Jersey: án ở NJ chạy song song án Nevada (SUN1, SUN2); lời đọc không kể.

**Bước tiếp:** Lucas nghe bản cuối trên điện thoại (nhất là chữ "five" ở 0:45,9), rồi commit / đăng khi muốn.
