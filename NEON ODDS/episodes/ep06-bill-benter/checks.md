# checks: ep06-bill-benter

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ B/C |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | 24 dòng, không có ƯỚC |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | tự đọc lại |
| Lucas duyệt kịch bản | pass | "Duyệt, làm giọng" 2026-11-09 |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | prep khớp 9 cảnh; 195 từ/phút |
| Mọi số trên hình có trong bảng kiểm chứng | pass | dòng 22–27 |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass | `out/sheets/bb-a/b/c` |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | một glide mỗi shot; chip dài nhất 120+ FACTORS |
| Nhạc tự tạo; SFX có trong catalog | pass | make-music `bill-benter`; SFX có sẵn |
| Lucas xem và nghe bản nháp, duyệt | pass | "Duyệt, render 1080" 2026-11-09 |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | `QA.md`: −14,0 LUFS, −2,9 dBTP |
| Cổng nghe: `npm run listen` → `NGHE.md`; mọi dòng "Cần nghe" có quyết định (đã nghe: giữ / đã sửa) | unresolved | precheck 0 → mp4 lần 1: 2 dòng + 7 chữ → sửa → lần 2: 1 dòng chờ Lucas nghe |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | lần 2: không khung đen, không nhảy hình |
| Khung cuối bằng khung 0 | pass | `Episode` đóng băng frame 0; S29 dựng lại góc S1 |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 3 tiêu đề, 2 nguồn |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | khoảng 180 KB |
