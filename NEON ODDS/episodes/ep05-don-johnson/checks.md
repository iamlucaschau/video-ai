# checks: ep05-don-johnson

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ B |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | 28 dòng; dòng 12 ghi ƯỚC (tự tính) |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | tự đọc lại; kết là câu hỏi |
| Lucas duyệt kịch bản | pass | "Duyệt, làm giọng" 2026-11-08 |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | prep khớp 9 cảnh; 190 từ/phút |
| Mọi số trên hình có trong bảng kiểm chứng | pass | dòng 26–32 |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass | `out/sheets/dj-a/b/c`; biển casino và chip đã dời khỏi vùng đỏ |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | tối đa một glide mỗi shot; chip dài nhất STAND ON SOFT 17 (4 từ) |
| Nhạc tự tạo; SFX có trong catalog | pass | make-music `don-johnson`; SFX có sẵn |
| Lucas xem và nghe bản nháp, duyệt | pass | "Duyệt, render 1080" 2026-11-09 |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | `QA.md`: −14,0 LUFS, −2,9 dBTP |
| Cổng nghe: `npm run listen` → `NGHE.md`; mọi dòng "Cần nghe" có quyết định (đã nghe: giữ / đã sửa) | unresolved | precheck → wav → mp4 với `--words`; 2 dòng chờ Lucas nghe |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | 3 khung đổi đột ngột ở S10 (sáu bộ bài hiện lần lượt), cố ý |
| Khung cuối bằng khung 0 | pass | `Episode` đóng băng frame 0; S33 dựng lại góc S1 |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 3 tiêu đề, 4 nguồn |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | khoảng 170 KB, chữ trong vùng an toàn |
