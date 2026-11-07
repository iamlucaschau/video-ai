# checks: ep01-ivey-edge

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ B |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | Bảng kiểm chứng trong FINAL: không số ƯỚC; vụ Borgata ghi rõ là theo báo |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | Kết là câu hỏi, không phủ nhận phán quyết đã kể |
| Lucas duyệt kịch bản | pass | 2026-11-07, "Duyệt, làm giọng" |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | `episode.mjs prep` báo khớp; 202 từ/phút; bản chép lời Whisper đủ 37 câu |
| Mọi số trên hình có trong bảng kiểm chứng | pass | Dòng 34–36 bảng kiểm chứng; số đếm dần kết thúc đúng giá trị nguồn |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass, còn nhẹ | Sheet `ivey-b`, `ivey-c`; hai thẩm phán ngoài cùng S31 và hàng bài dưới S21 lấn nhẹ |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | Mỗi shot một `glide`, cắt cứng; tối đa 2 chip |
| Nhạc tự tạo; SFX có trong catalog | pass | `own/ivey-edge.mp3` (preset trong make-music.py); `card-flick`, `chip-stack`, `card-shuffle`, `room-casino` tạo bằng code |
| Lucas xem và nghe bản nháp, duyệt | pass | 2026-11-07, "Duyệt, render 1080" |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | 1080×1920, 30 fps, −14,2 LUFS, −1,7 dBTP |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | `QA.md`: không khung đen, không khung trắng; 2 nhảy hình là viền sáng lá bài (14,5 s, 99,8 s) |
| Khung cuối bằng khung 0 | pass | `Episode` đóng băng khung 0 ở khung cuối; S38 dựng lại cùng hình |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 3 tiêu đề, 4 nguồn, 5 hashtag, 13 từ khoá |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | 159 KB; đã xem ảnh; lá bài nằm dưới vùng an toàn, chữ và mặt ở trong |
