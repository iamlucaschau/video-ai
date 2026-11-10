# progress — m-churchill (video mẫu style M "Hoạt Sử", Giai đoạn 3)

| Cổng | Trạng thái | Ngày |
|---|---|---|
| 1 · Chủ đề (D9: Jack Churchill, họ chưa làm) | ✓ Lucas duyệt C1 | 2026-11-04 |
| 2 · Kịch bản v1 → so đối thủ → v2 → FINAL + kiểm chứng 19 dòng + 6 prompt ảnh AI | ✓ Lucas duyệt v2 + C1–C4 | 2026-11-04 |
| 3 · Giọng (Puck, 7 request, 61,7 s, 201 wpm) | ✓ | 2026-11-04 |
| 4 · Hình: storyboard (3 lượt) → dựng 29 shot → review-loop (Luis + critic, 16 lỗi sửa hết) → render 4K | ✓ | 2026-11-04 |
| 4b · Lucas chọn camera C (sau `cam-so-sanh.mp4`) · 6 ảnh AI ngoại cảnh · 10 SFX thật · render 4K lại | ✓ | 2026-11-04 |
| 5 · So với Squire (`SO-SANH.md`, `--force`) | ✓, hình đứng yên 80 % (họ 7 %), 2 chỗ nhạc sát giọng | 2026-11-04 |
| Lucas duyệt video cuối | **chờ** | |

**File:** `Video.tsx` (composition `Style-M-HoatSu-Churchill`), `../ww2.tsx` (đạo cụ, quân phục, xe, ngoại cảnh), `shots.json` → `shots.timeline.json`, `shotlist.md`, `m-churchill.mp4` (git-ignored), `vo.mp3`, `SO-SANH.md`, `checks.md`, kịch bản v1 / v2 / FINAL, spec.

**Quyết định trong lúc dựng:** ngoại cảnh tự đổi sang ảnh AI khi Lucas thả file vào `public/images/m-churchill/` (a1-vagsoy, a2-molina, a3-alley, a4-brac, a5-fence, a6-field .jpg) rồi render lại, không sửa code; prompt a6 bỏ bia bắn (bia, xe, lính vẽ bằng code); biển kết "1945–1996" (dấu gạch, font Mali không có mũi tên); Sachsenhausen chỉ hàng rào + chòi canh (C3); phòng Berlin là `bureau` xám.

**Còn mở:** (1) Lucas nghe 2 chỗ nhạc sát giọng (23,2 / 25,2 s); (2) 61,7 s, dưới khoảng 64–75 s một chút; (3) M chưa vào `Style Library/README.md` §1 / §3 (file có thay đổi chưa commit của phiên khác).

**Bước tiếp:** Lucas duyệt video cuối → Giai đoạn 4 (`npm run studio:format -- new …`), chưa `export`.
