# checks — m-test (style M "Hoạt Sử")

| Cổng | Kiểm | Kết quả | Bằng chứng |
|---|---|---|---|
| 2 · Kịch bản | mọi con số / ngày / khẳng định trong VO có dòng trong bảng kiểm chứng | pass | `kich-ban-m-test-FINAL.md` dòng 1–10 |
| 2 · Kịch bản | mọi chữ / số trên màn hình có trong bảng kiểm chứng | pass (lượt 2) | dòng 11–13 (LISBON 1941, LONDON 1942, 9 JUNE 1944, 27); lượt 1 sổ đếm "7", "23" → **fail**, sửa: sổ ghi "27" đúng lúc đọc (critic #1) |
| 4 · Hình | storyboard trước chuyển động (W3) | pass | `out/sheets/m-test-board-1.png`, `-2.png` (3 lượt) |
| 4 · Hình | vùng an toàn: mặt, chữ, số trong x 60–940, y 220–1440 | pass (lượt 3) | board lượt 1: mặt cận ngực lấn vùng đỏ, biển LISBON / LONDON / giấy tràn mép → sửa (zoom 3, dời biển); ghi chú "9 JUNE 1944" nới rộng |
| 4 · Hình | ≤ 2 khối chữ ngoài phụ đề, chữ ≥ 48 px | pass | OCR `SO-SANH.md`: tối đa 3 khối gồm phụ đề, cao chữ trung vị 56 px, 10 % nhỏ nhất 48 px; lượt 1 "AGENTS" 30 px, "GUIDE" 40 px → sửa lên 48 / 52 |
| 4 · Hình | không máy quay giả; một lần đẩy chậm vào bản đồ ≤ 5 % (D3) | pass | `Video.tsx` S11: 1 → 1,04 trong 3,6 s; mọi shot khác khung đứng, hard cut |
| 4 · Hình | nối vòng bằng hình: frame cuối = frame 0 (D6) | pass | ffmpeg: frame 0 vs 984 lệch trung bình 0,08 / 255 |
| 4 · Hình | hình đúng lời (critic) | pass (lượt 2) | huân chương gắn ngay sau từ của nó rồi tay rút ra (critic #2–3); phim thời sự xuất hiện ở "cinema" (#14); sĩ quan Anh mặt "tired" + lắc đầu ở "no" (#11) |
| 4 · Hình | không lặp cảnh (critic #6, #15) | pass một phần | 4 kiểu phòng (`embassy`, `hq`, `lodging`, `bureau`); viền sáng cam vẫn giống nhau ở mọi nhân vật (look của engine, giữ) |
| 4 · Hình | khung sống, không "slide" | **chưa đạt hẳn** (3 lần thử) | `studio:compare`: hình đứng yên 81 % → 81 % → **48 %** (họ: trung vị 7 %, khoảng 0–46 %). Đo theo shot của chính mình trên bản nháp 270 px: 12 %; compare chia shot theo điểm cắt dò được (11 thay vì 15), nên gộp shot tĩnh. Hỏi Lucas |
| 5 · Âm thanh | −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | `render:style`: −13,7 LUFS, −3,0 dBTP |
| 5 · Âm thanh | không tiếng nhấn đè lên lời (W5) | pass (lượt 3) | `SO-SANH.md`: 0 chỗ; lượt 2 có 6 cửa sổ ở 25,4–26,4 s (đuôi tiếng trống sau "Berlin believed him") → cắt còn 1,4 s, hạ nhỏ |
| 5 · Âm thanh | nền − giọng gần kênh tham khảo | pass | −13,9 dB (họ −11,4, khoảng −15,0…−8,6); lượt 1 −17,7 |
| 5 · Âm thanh | SFX thật, đặt sau từ, canh onset / peak (W6) | pass | `Video.tsx` 10 `Sfx` có `align` |
| Review | critic subagent (review-loop) | đã chạy | 16 lỗi; đã sửa #1–#4, #6–#16; #5 (hook yếu) sửa một phần: cận hơn, huân chương to 1,25× |
