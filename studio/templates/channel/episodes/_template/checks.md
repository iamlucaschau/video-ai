# checks.md — epNN-<slug>

*Bằng chứng cho từng cổng (Lucas duyệt 2026-11-01, đề xuất A1). Mỗi yêu cầu một dòng. **Kết luận:** `pass` · `fail` · `unresolved`. **Bằng chứng:** đường dẫn file, output thật của lệnh, hoặc sheet + frame; không ghi "đã kiểm" suông. Tập chỉ được gọi là xong khi không còn `fail`, và mọi `unresolved` đã báo Lucas. Một dòng `fail` được sửa tối đa **3 lần**; lần thứ 3 vẫn trượt thì dừng và hỏi Lucas.*

| Cổng / nút | Yêu cầu | Kết luận | Bằng chứng | Lần sửa |
|---|---|---|---|---|
| 2 · Kịch bản | mọi con số / ngày / khẳng định trong VO có dòng trong bảng kiểm chứng của FINAL | | | |
| 2 · Kịch bản | một con số nhất quán từ hook tới kết (Bible §3.1) | | | |
| 2 · Kịch bản | mọi chữ / số trên màn hình có trong bảng kiểm chứng (AGENTS "Banned") | | | |
| 3 · Giọng | VO trong spec khớp từng chữ với FINAL; `words.py` tách câu đúng | | | |
| 3 · Giọng | độ dài + wpm trong preset (Bible §4) | | | |
| 4 · Test | `npm run lint` sạch | | | |
| 4 · Test | review loop: không chữ chạm vùng đỏ (sheet `safeGuide`) | | | |
| 4 · Test | critic mắt mới: 3 lỗi tệ nhất đã sửa và chụp lại | | | |
| 4 · Test | thẻ, chip không che nhãn hay vật chính; không khoảng > 8 s không có gì mới | | | |
| 5 · Final | `render:style`: 2160×3840, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP | | | |
| 5 · Final | sheet từ MP4 (không guide) đã xem | | | |
| 5 · Final | `studio:compare` với đối thủ: `SO-SANH.md` đọc xong, mỗi dòng "ngoài khoảng của họ" có lý do (QUYẾT) hoặc đã sửa | | | |
| 5 · Final | **Lucas xem trên điện thoại, có tiếng, rồi nghe một lần không nhìn** (A11) | | ghi nhận xét của Lucas | |
| 5 · Final | gói đăng `xuat-ban.md` đủ: tiêu đề, mô tả + nguồn ảnh và dữ liệu, nhãn AI nếu cần | | | |
