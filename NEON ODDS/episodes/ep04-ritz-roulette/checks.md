# checks: ep04-ritz-roulette

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ B (FINAL, dòng đầu) |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | bảng kiểm chứng 31 dòng, không có ƯỚC; £1,3 triệu có 2 nguồn |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | tự đọc lại; kết là câu mở |
| Lucas duyệt kịch bản | pass | "Duyệt, làm giọng" 2026-11-08 |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | `episode.mjs prep` khớp 8 cảnh; export 195 từ/phút |
| Mọi số trên hình có trong bảng kiểm chứng | pass | dòng 28–32 của bảng; bảng lịch sử số và ô cược ghi minh hoạ |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass | `out/sheets/ritz-a-*`, `ritz-c-1`, `ritz-d-1`; hook đã dời mặt Tosa vào trong |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | mỗi shot tối đa một `glide`, cắt cứng; chip dài nhất "13 IN A ROW" |
| Nhạc tự tạo; SFX có trong catalog | pass | `make-music.py ritz-roulette`; SFX đều có sẵn trong catalog, không thêm file mới |
| Lucas xem và nghe bản nháp, duyệt | pass | "Duyệt, render 1080" 2026-11-08 |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | ffprobe + `QA.md`: −14,1 LUFS, −2,8 dBTP |
| Cổng nghe: `npm run listen` → `NGHE.md`; mọi dòng "Cần nghe" có quyết định (đã nghe: giữ / đã sửa) | unresolved | 5 → 2 dòng sau một lần sửa; 2 dòng chờ Lucas nghe |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | `QA.md`: không khung đen / trắng / nhảy hình |
| Khung cuối bằng khung 0 | pass | `Episode` đóng băng frame 0 ở khung cuối; S37 dựng lại góc S1 |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 3 tiêu đề, 3 nguồn |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | 1080×1920, khoảng 180 KB, đã xem |
