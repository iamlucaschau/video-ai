# checks.md — bản test style L (l-thermopylae)

*Theo mẫu `Mapped Journeys/episodes/_template/checks.md` (Lucas duyệt 2026-11-01). Kết luận: pass · fail · unresolved.*

| Cổng / nút | Yêu cầu | Kết luận | Bằng chứng | Lần sửa |
|---|---|---|---|---|
| Kịch bản | mọi con số / khẳng định trong VO có dòng kiểm chứng | pass | `kich-ban-l-thermopylae-FINAL.md` §Kiểm chứng, 7 dòng | 0 |
| Kịch bản | chữ / số trên màn hình có trong bảng kiểm chứng | pass | trên hình: 480 BC, EGYPT, INDUS, ATHENS, THERMOPYLAE, LEONIDAS (dòng 1, 3, 4, 7) | 0 |
| Giọng | VO khớp từng chữ với FINAL | pass | `node scripts/episode.mjs prep` → "✓ VO matches spec (4 scenes)" | 0 |
| Giọng | tách câu đúng | pass | `words.py` → "OK … 65 words in 6 lines" | 0 |
| Giọng | độ dài | pass | `episode.mjs export` → 29,50 s, 136 wpm (test 20–30 s) | 0 |
| Dựng | `npm run lint` sạch | pass | không lỗi (2026-11-01) | 0 |
| Dựng | vùng phe lan đều trên mọi tấm | pass | lần 1: lan thành hình chữ nhật (bán kính theo cỡ tấm) → sửa `REVEAL_R` chung; `out/sheets/L-test-1s/004.png` | 1 |
| Dựng | nhãn không hiện khi camera đang bay | pass | lần 1: ATHENS ló ở mép trái lúc 12 s → chờ `LANDED`; `out/sheets/L-test-1s/012.png` | 1 |
| Dựng | end card nằm trong vùng an toàn | pass | lần 1: "THERMOPYLAE" Cinzel 104 px tràn ra vùng đỏ → tự co cỡ; `out/sheets/L-test-1s/030.png` | 1 |
| Dựng | kính lúp đọc được | unresolved | zoom 380 trên tấm 240 px / độ: thấy vịnh Malis và núi, **không thấy con đường hẹp**; đã thêm 2 nêm "kẹp" (`Pinch`) + chip ONE CART WIDE để người xem hiểu; tập thật cần nguồn địa hình nét hơn (đề xuất DEM khi có tập) | 2 |
| Review | critic mắt mới (vòng 1, 8 lỗi) | pass (3 lỗi tệ nhất đã sửa) | (1) cao trào 23–29 s trống → chip 7,000 / 300 SPARTANS + băng rôn đặt ngay trên khe; (2) kính lúp vô nghĩa → `Pinch` + chip; (3) màu phe không chú thích → nhãn PERSIAN EMPIRE / GREEKS + cờ ở Sardis cho mũi tên. Kèm: hook lan sớm hơn 1 chữ, nhãn 60 px, end card năm 60 px, INDUS lùi vào, chữ chưa đọc sáng hơn. `out/sheets/L-test-final2-1.png` | 1 |
| Review | critic: phụ đề tách số ("seven \| thousand") | unresolved | do cách chia cụm chung của `subs.tsx` (dùng cho mọi style); chưa sửa để không đụng file chung | 0 |
| Dựng | nhãn GREEKS bị cắt mép trái; chip chạm nhãn THERMOPYLAE | pass | `Plaque` kiểm thêm điểm neo; chip dời phải; `out/sheets/L-test-v5-1.png` | 1 |
| Final | render 4K | pass | `npm run render:j`: 2160×3840, 30 fps, 30,4 s, −14,2 LUFS | 0 |
| Final | true peak ≤ −1,5 dBTP | **fail** | −1,0 dBFS; đỉnh ở 10,3 s, âm bật trong giọng TTS chữ "Egypt" (không phải SFX). Bản test, không đăng. Tập thật: đề xuất thêm limiter vào bước master của `render:j` (file chung, cần Lucas duyệt) | 0 |
| Final | Lucas xem trên điện thoại, có tiếng | chờ Lucas | | |
