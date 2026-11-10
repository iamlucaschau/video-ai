# checks: ep07-ron-harris

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Đề tài có ít nhất 2 trong 3 yếu tố, không thuộc họ E | pass | 3/3, họ A/B |
| Mọi số và khẳng định trong lời có dòng kiểm chứng; số ƯỚC đã ghi rõ | pass | 19 dòng, không ƯỚC |
| Không câu nào trong thân mâu thuẫn với câu kết; không kêu gọi đăng ký | pass | tự đọc lại |
| Lucas duyệt kịch bản | pass | "Duyệt, làm giọng" 2026-11-09 |
| Lời trong spec khớp từng chữ với FINAL; khoảng 200 từ/phút | pass | prep khớp 9 cảnh; khoảng 190 từ/phút |
| Mọi số trên hình có trong bảng kiểm chứng | pass | dòng 17–21 |
| Vùng an toàn: ảnh có guide đỏ đã xem | pass | `out/sheets/rh-a…d` |
| Không camera giả; ≤ 5 từ mỗi khối, ≤ 2 khối ngoài phụ đề | pass | một glide mỗi shot |
| Nhạc tự tạo; SFX có trong catalog | pass | make-music `ron-harris`; SFX có sẵn |
| Lucas xem và nghe bản nháp, duyệt | pass | duyệt 2026-11-10 |
| 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | −14,0 LUFS, −3,0 dBTP (`QA.md`) |
| Cổng nghe: `npm run listen` → `NGHE.md`; mọi dòng "Cần nghe" có quyết định (đã nghe: giữ / đã sửa) | unresolved | đã ghi quyết định theo số đo; chưa ai nghe bằng tai |
| QA khung: không khung đen, nháy chỉ ở chỗ cố ý | pass | nháy 17–19 s là mã cuộn từng dòng |
| Khung cuối bằng khung 0 | pass | PSNR 43 dB |
| `xuat-ban.md` đủ tiêu đề, mô tả có nguồn, hashtag, từ khoá | pass | 4 nguồn |
| `thumb.jpg` 1080×1920, dưới 2 MB, đọc được khi thu nhỏ | pass | 207 KB, đã xem |
