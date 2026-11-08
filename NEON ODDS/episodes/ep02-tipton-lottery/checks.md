# checks: ep02-tipton-lottery

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ B |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | Bảng kiểm chứng trong FINAL: không số ƯỚC |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | Kết là câu hỏi |
| Lucas duyệt kịch bản | pass | 2026-11-07, "Duyệt, làm giọng" |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | `episode.mjs prep` báo khớp; 202 từ/phút; bản chép lời Whisper đủ 37 câu |
| Mọi số trên hình có trong bảng kiểm chứng | pass | Dòng 29–32; số chạy trên máy và số in trên vé ghi "minh hoạ" |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass, còn nhẹ | Sheet `tip-b`; biển trên bàn và phần dưới bàn nằm ngoài, chữ và mặt ở trong |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | Mỗi shot tối đa một `glide`, cắt cứng; S12 hình giật là cố ý để diễn camera hỏng, không rung |
| Nhạc tự tạo; SFX có trong catalog | pass | `own/tipton-lottery.mp3`; `coin-flip`, `phone-ring` tạo bằng code |
| Lucas xem và nghe bản nháp, duyệt | pass | 2026-11-07, "Duyệt, render 1080" |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | 1080×1920, 30 fps, −14,0 LUFS, −2,2 dBTP |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | Không khung đen; nhảy hình ở đồng xu (12 s), CCTV (29–31 s), đèn khoá (7,6 s) là cố ý |
| Khung cuối bằng khung 0 | pass | Đo trên bản cuối: PSNR 56 dB giữa khung đầu và khung cuối |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 3 tiêu đề, 4 nguồn, 5 hashtag, 12 từ khoá |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | 143 KB; đã xem ảnh; chữ và mặt trong vùng an toàn, số trên máy sát mép trái |
