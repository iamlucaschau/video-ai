# checks.md — l-thermopylae-full

*Theo mẫu `Mapped Journeys/episodes/_template/checks.md`. Kết luận: pass · fail · unresolved. Sửa tối đa 3 lần mỗi lỗi.*

| Cổng / nút | Yêu cầu | Kết luận | Bằng chứng | Lần sửa |
|---|---|---|---|---|
| Kịch bản | mọi khẳng định trong VO có dòng kiểm chứng | pass | FINAL §Kiểm chứng: 25 dòng (thêm 7a bờ biển cổ, 14a chip DAY) | 0 |
| Kịch bản | dòng 12 (ước tính quân Ba Tư hiện đại) | unresolved | còn "?", cần 1 sách học thuật trước khi đăng | 0 |
| Giọng | VO khớp FINAL, tách câu đúng | pass | `prep` ✓ 10 cảnh; `words.py` OK 243 từ / 27 câu | 0 |
| Giọng | độ dài | pass (vượt preset, Lucas duyệt) | 101,7 s giọng, video ~103 s | 0 |
| Dựng | lint | pass | `npm run lint` sạch | 0 |
| Review | critic mắt mới vòng 1 (13 nhóm lỗi) | pass (3 lỗi tệ nhất + 10 lỗi rẻ đã sửa) | (1) kết đứng yên 9 s trên bia → bia 3 s rồi về khe núi + end card trên bản đồ (hết lỗi chữ vàng trên đá sáng); (2) quân Ba Tư biến mất lúc "waited" → giữ tới hết ngày 6, mũi tên tấn công dài hơn, bỏ màu tím, băng rôn IMMORTALS hiện cả câu; (3) khe hẹp hiện muộn → kính lúp mở ở "narrow", nêm kẹp ở "gap". Kèm: chip 300 SPARTANS màu xanh, cờ Athens 490 TCN bỏ chữ Λ, GREEKS hiện sau khi chip 480 BC tắt (≤ 2 khối), cờ Sardis tắt trước khi chạm mép, phụ đề chữ chưa đọc màu đặc, cờ Athens 480 dời khỏi nhãn, nhãn SALAMIS hiện trước tranh, INDUS lùi vào, chấm quân Hy Lạp to hơn. `out/sheets/LF-v3-1.png` | 1 |
| Review | khoả thân | pass | David cắt dừng ở thắt lưng (`leonidas-916.jpg`); Kaulbach cắt phần giữa trận (`salamis-916.jpg`), bỏ nhóm khoả thân góc trái dưới | 1 |
| Review | ảnh AI C2 (300 + 700): thung lũng rộng, lính giống hệt nhau | pass (Lucas giữ, 2026-11-01) | nhịp nói về khe hẹp mà ảnh là thung lũng mở; Lucas chọn giữ ảnh hiện tại | 0 |
| Review | ảnh AI C1 (lối núi): lính Ba Tư cầm khiên tròn kiểu Hy Lạp | pass (Lucas giữ, 2026-11-01) | dễ đọc nhầm thành người Hy Lạp; Lucas chọn giữ ảnh hiện tại | 0 |
| Final | sheet từ MP4 (mỗi 1,5 s, không guide) | pass sau sửa | bản 1: băng rôn IMMORTALS đè chip DAY 6 (64–66 s) → dời xuống/sang phải (x 780, y 380); hạm đội Salamis chạy đè nhãn ATHENS ở "not last" → nhãn tắt ở chữ "did"; cờ Hy Lạp lộ qua "480 BC" ở end card → cờ tắt khi end card vào. `out/sheets/LF-fix-1.png` (safe guide) | 1 |
| Final | render 4K + −14 LUFS + true peak | pass (bản 2) | 2160×3840, 30 fps, 3078 khung, 102,7 s, 20,2 Mbps, có tiếng; −14,1 LUFS, true peak −2,9 dBFS. Bản 1 log có 4 cảnh báo "source image cannot be decoded" nhưng mọi khung đều có ảnh (soi sheet + crop 4K). Bản 2: soát lại 3 khung đã sửa (65,5 / 85,5 / 102 s) từ MP4 | 0 |
| Final | Lucas xem trên điện thoại, có tiếng | chờ Lucas | | |
