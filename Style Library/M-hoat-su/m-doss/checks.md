# checks — m-doss (test 2 của format Hoat Su, style M)

| Cổng | Kiểm | Kết quả | Bằng chứng |
|---|---|---|---|
| 2 · Kịch bản | v1 đo theo công thức → v2 | pass | `kich-ban-m-doss-v2.md`: 212 từ, 33 % câu mở bằng But / So / Then, nhịp Q ở 79 %, "Japanese troops" thay "the enemy" (D8) |
| 2 · Kịch bản | mọi khẳng định có dòng kiểm chứng; chữ / số trên hình có trong bảng | pass | FINAL 17 dòng (W + trích dẫn Huân chương); 1942, GUAM 1944, OKINAWA 1945, HACKSAW RIDGE, 400 FT, 75, OCTOBER 1945 |
| 2 · Kịch bản | Lucas duyệt v2 + E1–E5 | pass | 2026-11-04 |
| 3 · Giọng | độ dài 64–75 s | **≈** | 62,5 s (204 wpm, 212 từ): Puck đọc nhanh hơn ước tính |
| 3 · Giọng | tách câu | pass | Whisper từng file 10–12, 20–21 đúng câu; cảnh báo "75 / seventy-five" chỉ do Whisper ghi số |
| 4 · Hình | storyboard trước chuyển động | pass (3 lượt) | `out/sheets/m-doss-board-*`, `-p2-*`, `-p3-*`: mũ bay khỏi đầu khi quỳ (lỗi kit: `OnHead` / `OnChest` không theo squash → sửa trong `hoat-su.tsx`, có lợi cho cả bản Churchill), Truman đeo kính râm (rig `glasses`) → `Specs` gọng tròn, cận lấn vùng đỏ trên, người lấn mép |
| 4 · Hình | vùng an toàn | pass | `studio:compare`: 0 % khối chữ ngoài vùng an toàn; sheet p3 |
| 4 · Hình | chữ ≥ 48 px, ≤ 2 khối ngoài phụ đề | pass | OCTOBER 1945 hạ xuống vùng an toàn (critic #12); HACKSAW RIDGE + 400 FT = 2 khối |
| 4 · Hình | camera C | pass | lia 1 lần ở S8 (Guam), S12 (vách), S18 (đêm); đẩy chậm vào bản đồ Okinawa (S11) |
| 4 · Hình | quân Nhật không vẽ thành người (E3) | pass | chỉ `Gunfire` (chớp lửa + khói) trên đỉnh |
| 4 · Hình | nối vòng bằng hình | pass | frame 0 vs 1875 lệch trung bình 0,10 / 255 |
| 4 · Hình | critic mắt mới (review-loop) | pass (lượt 2) | 14 lỗi, sửa cả 14: súng đưa tới bằng tay người khác, dừng trước người, anh giơ lòng bàn tay; chớp súng to theo "hit back", người ngã ở "hard"; người bị thương nhắm mắt, không mắt X (trông như chết); thả cáng cận hơn, có mép vách, anh ghì dây; đổi cáng: người khiêng ở hai đầu, anh nằm rõ trên cáng, lăn xuống, chỉ tay; lựu đạn: trắng mềm trước rồi ngã 8 frame; dây đeo tay kaki + tia ở tay; vách S12 = S13 cùng một cảnh; sổ 75 hiện đúng chữ, không giấy trắng; hook: lính cầm súng chéo ngực gỗ sáng, ba người to hơn; mặt bình thản ở các nhịp từ chối, người bị thương nằm cạnh ở "He stayed"; biển ngày vào vùng an toàn; chạy thật + lửa trong rừng; bò dài, lều nhỏ xa |
| 4 · Hình | khung sống | **chưa đạt** (đọc kèm mắt) | `studio:compare` sau N1–N14: đứng yên **81 %** (bản nền mới không DOF: 61 %; họ 7 %): nền nhoè làm mây / mưa / khói phía sau ít đổi điểm ảnh hơn, nên thước đo coi là đứng yên; crossfade làm compare dò được ít điểm cắt hơn (shot trung bình 3,9 → ngoài khoảng). `short-qa.py`: không nhảy hình, 4 đoạn đứng ≥ 12 f (19,6 s bản đồ trước khi mũi tên chạy; 29,7–31,7 s cảnh lính rút sau khi người chạy ra khỏi khung) |
| 5 · Âm thanh | −14 LUFS ±1, true peak ≤ −1,5 dBTP | pass | −14,0 LUFS, −3,1 dBTP |
| 5 · Âm thanh | tiếng không đè lời (W5) | pass | bản cuối: 0 chỗ giọng bị che (bản nền mới có 1 cửa sổ ở 26,2 s: tiếng nổ đầu S14 đè "But Japanese troops" → bỏ, giữ tiếng nổ sau câu) |
| 5 · Âm thanh | SFX thật, sau từ (W6) | pass | 14 `Sfx`; tải thêm 2 tiếng nổ chiến trường (Mixkit, `scripts/sfx-list-war2.json`); lựu đạn nổ trước "tore", tiếng trúng tay trước "again"; nhạc lùi xuống 0,3 trước lựu đạn (khoảng lặng trước tiếng nổ) |
| 4 · Hình | nền (E2) | pass | Lucas 2026-11-04: **nền code, không dùng ảnh AI** (thay E2): bản 4K hiện tại là bản cuối, nền code; `public/images/m-doss/` để trống |
| 4 · Hình | nâng cấp claude-animated-shorts N1–N14 | pass | `studio/DE-XUAT-CLAUDE-ANIMATED-SHORTS.md` §5; QA `QA.md`; so hình với Squire `out/sheets/m-doss-sbs.jpg` |
