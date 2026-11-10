# checks — m-churchill (video mẫu style M "Hoạt Sử", Giai đoạn 3)

| Cổng | Kiểm | Kết quả | Bằng chứng |
|---|---|---|---|
| 2 · Kịch bản | v1 so với công thức đối thủ → v2 | pass | `kich-ban-m-churchill-v2.md` bảng "So với kịch bản đối thủ": 206 từ, 36 % câu mở bằng So / But / Then, 0,32 số / câu, bác tin đồn 81 % |
| 2 · Kịch bản | mọi khẳng định trong VO có dòng kiểm chứng | pass | FINAL dòng 1–17 (W, H, B); giai thoại yếu bỏ hẳn (danh sách "Không dùng") |
| 2 · Kịch bản | mọi chữ / số trên màn hình có trong bảng | pass | dòng 18–19: NORWAY 1941, SALERNO 1943, BRAČ 1944, BERLIN, FRANCE 1940, 42, 1945–1996; nhãn bản đồ ITALY / SALERNO, hồ sơ CHURCHILL (tên, không phải khẳng định) |
| 2 · Kịch bản | Lucas duyệt v2 + C1–C4 | pass | 2026-11-04 |
| 3 · Giọng | độ dài 64–75 s | **≈** | 61,7 s (201 wpm, 207 từ ở mức dưới của 206–246): giọng Puck đọc nhanh bằng họ (192 wpm); không thêm chữ khi Lucas đã khoá lời |
| 3 · Giọng | tách câu đúng | pass | Whisper từng file: 07, 08, 09, 16–19 đúng câu; "tunnelled" Whisper nghe "tunnels" (ƯỚC, nghe lại) |
| 4 · Hình | storyboard trước chuyển động (W3) | pass | `out/sheets/m-churchill-board-1…4.png`; lượt 1: 12 lỗi bố cục (S2 mất nhân vật, kèn túi lấn vùng đỏ trên, biển / người tràn mép, CHURCHILL tràn hồ sơ) → sửa, `m-churchill-fix-*`, `-p2-*`, `-p3-*` |
| 4 · Hình | vùng an toàn: mặt, chữ, số trong x 60–940, y 220–1440 | pass | `studio:compare`: 0 % khối chữ ngoài vùng an toàn; sheet p3: nhân vật ở S5 / S12 / S20 / S28 kéo vào trong. Đầu cây cung (đạo cụ, không phải chữ) chạm vùng đỏ trên ở S13 |
| 4 · Hình | ≤ 2 khối chữ ngoài phụ đề, chữ ≥ 48 px | pass | OCR: tối đa 3 khối gồm phụ đề, chữ trung vị 57 px, 10 % nhỏ nhất 52 px |
| 4 · Hình | không máy quay giả; một lần đẩy chậm (D3) | pass | `Video.tsx` S21: 1 → 1,04 trong 0,6 s (hồ sơ CHURCHILL); mọi shot khác khung đứng, hard cut |
| 4 · Hình | nối vòng bằng hình (D6) | pass | bản cuối: frame 0 vs 1848 lệch trung bình 0,07 / 255; biển 1945–1996 rút 10 frame trước cuối |
| 4 · Hình | hình đúng lời (critic, review-loop) | pass (lượt 2) | critic 16 lỗi trên bản nháp 1; đã sửa 1–16 (xem dưới) |
| 4 · Hình | không lặp cách vào / hiệu ứng (luật "AI slop") | pass (lượt 2) | lượt 1: hai vụ nổ cùng một chớp trắng → `Burst` (đạn cối) vs `WhiteOut` (lựu đạn); Berlin dùng lại phòng doanh trại → phòng `bureau` |
| 4 · Hình | khung sống, không "slide" | **chưa đạt** (đã hỏi Lucas) | `studio:compare` "hình đứng yên": 91 % (D3) → 91 % (camera C, nền code) → **80 %** (camera C + ảnh AI của Lucas); họ 7 %. Lucas xem `cam-so-sanh.mp4` và chọn C (2026-11-04): giữ khung đứng, lia một lần ở 4 shot mở cảnh ngoài trời. Điểm cắt mềm / phút 3,9 (họ 8,0–18,6) |
| 5 · Âm thanh | −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass (lượt 3) | `render:style` bản cuối: −13,8 LUFS, −2,3 dBTP. Bản nháp chưa master đỉnh +0,9 (critic #9) → hạ 4 tiếng nhấn; lượt 2 hạ nhạc ở câu 07–09 làm master đẩy đỉnh lên −0,6 → **fail**, bỏ đoạn hạ nhạc |
| 5 · Âm thanh | tiếng nhấn không đè lời (W5) | **gần đạt** (3 lần thử) | `SO-SANH.md` (`--force`, bản cuối): 2 cửa sổ 0,4 s, nhạc nền thấp hơn giọng 2,5–2,6 dB ở 23,2 / 25,2 s; nền − giọng cả bài −13,4 dB (họ −11,4). Chờ Lucas nghe |
| 5 · Âm thanh | SFX thật, đặt sau từ, canh onset / peak (W6) | pass | Lucas cho tải (2026-11-04): 10 file mới (`scripts/sfx-list-war.json`): kèn túi thật (Pixabay: Auld Lang Syne, Bagpipe Victory) ở S4 / Na Uy / Brač, rút kiếm, mũi tên bay + cắm, nổ đạn cối, nổ lựu đạn (sau "out"), xe tải, cung gãy (sau "bows") (Mixkit); nhạc lùi xuống 0,4 khi kèn thổi |
| Review | critic subagent | đã chạy | 16 lỗi; sửa cả 16: phone có lính Đức + mũi tên ở "killed" + dấu "?" đỏ; xe tải cán cung ở "crushed", đường quê khác sân bắn; hook đọc được 3 món (cung trên đầu, kèn túi xách, chuôi kiếm); S13 ở thị trấn Ý; Berlin phòng khác, hai người hai bên bàn; vụ nổ khác nhau, đồng đội nằm sau đá, ông cúi rồi đứng; lính Đức nhỏ trên đường chân trời tiến dần; lựu đạn to có vệt bay; master âm; hàng lính to, súng rõ, ông bước ra khỏi hàng với cung cao; tù binh giơ tay, hạ sĩ cầm súng phía sau, ống cối to; lắc đầu bằng xoay mặt; bản đồ hình chiếc ủng + vòng Salerno; nốt nhạc / ống kèn trong vùng an toàn; tuyết tối màu cho phụ đề, cả xuồng trong khung có Churchill; ánh loé 4 cánh |
| 4 · Hình | ảnh AI ngoại cảnh của Lucas (C2) | pass | 6 ảnh 1080×1920, không người; `Outside` nâng / phóng ảnh theo loại cảnh (`FIT`) để nhân vật đứng trên mặt đất của ảnh; Na Uy thêm bờ tuyết (`SnowBank`) |
