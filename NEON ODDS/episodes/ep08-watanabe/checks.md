# checks: ep08-watanabe

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ B/A |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | 19 dòng, 1 ƯỚC (hoàn 15%) |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | tự đọc lại |
| Lucas duyệt kịch bản | pass | duyệt 2026-11-10 |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | prep khớp 9 cảnh; 197 wpm |
| Mọi số trên hình có trong bảng kiểm chứng | pass | dòng 18–19 bảng kiểm chứng; bảng LED đếm lên đúng 825 và 127 |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass | out/sheets/wat-a-1, wat-b-1 (3 lượt) |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | 1 glide/shot, cắt cứng; khối dài nhất "$127M vs $225K" (3 từ) |
| Nhạc tự tạo; SFX có trong catalog | pass | make-music preset watanabe; 4 SFX từ catalog, precheck 0 trên chữ |
| Lucas xem và nghe bản nháp, duyệt | pass | duyệt 2026-11-10 |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | −13,9 LUFS, −2,1 dBTP (`QA.md`) |
| Cổng nghe: `npm run listen` → `NGHE.md`; mọi dòng "Cần nghe" có quyết định (đã nghe: giữ / đã sửa) | unresolved | đã ghi quyết định theo số đo; chưa ai nghe bằng tai |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | không có nhảy hình |
| Khung cuối bằng khung 0 | pass | PSNR 45 dB |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 5 nguồn |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | đã xem, 2 lượt |
