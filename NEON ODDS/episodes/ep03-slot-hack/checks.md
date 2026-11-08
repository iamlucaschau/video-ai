# checks: ep03-slot-hack

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ B |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | Bảng kiểm chứng 29 dòng, không số ƯỚC; $10.000/ngày ghi là lời một chuyên gia |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | Kết là câu hỏi |
| Lucas duyệt kịch bản | pass | 2026-11-08, "Duyệt, làm giọng" |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | `episode.mjs prep` báo khớp (39 câu, 352 từ); 204 từ/phút; Whisper nghe riêng từng câu nghi ngờ thì đúng |
| Mọi số trên hình có trong bảng kiểm chứng | pass | Dòng 27–33 |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass, còn nhẹ | Sheet `slot-b`, `slot-c`; chip và mặt trong vùng an toàn; điện thoại cận ở mép trái |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | Mỗi shot tối đa một `glide`, cắt cứng; điện thoại rung là vật rung, không rung máy quay |
| Nhạc tự tạo; SFX có trong catalog | pass | `own/slot-hack.mp3`; `phone-buzz` tạo bằng code, có trong catalog |
| Lucas xem và nghe bản nháp, duyệt | pass | 2026-11-08, "Duyệt, render 1080" |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | 1080×1920, 30 fps, −14,2 LUFS, −3,0 dBTP |
| Cổng nghe: `npm run listen` → `NGHE.md`; mọi dòng "Cần nghe" có quyết định (đã nghe: giữ / đã sửa) | chưa xong | Lần 1 báo 5 dòng; đã sửa mức và thời điểm, render lại; lần 2 còn 2 dòng (cửa cuốn 0:23, trống 0:20) chờ Lucas nghe |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | Các khung báo đen là cảnh tối, đã xem ảnh; nhảy hình 74,3 s là song sắt trượt (cố ý) |
| Khung cuối bằng khung 0 | pass | PSNR 48 dB giữa khung đầu và khung cuối |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 3 tiêu đề, 3 nguồn, 5 hashtag, 12 từ khoá |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | 217 KB; đã xem ở 540 px; chữ hai dòng ở trên, mặt ở giữa; điện thoại gần như không thấy |
