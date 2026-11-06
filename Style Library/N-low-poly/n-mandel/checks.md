# checks — n-mandel

| Yêu cầu | Kết quả | Bằng chứng |
|---|---|---|
| Mọi số trên màn hình có trong bảng kiểm chứng | pass | chip: 3×, 12 JACKPOTS, ~400,000 PRIZES, 1992, 6 OF 44, 7,059,052, $1 EACH, $27,000,000 (bảng), 16 / 30 / 12, 2,500, 125, 72 HOURS, 700,000, 1 IN 7,059,052, 14 — đều ở `kich-ban-n-mandel-FINAL.md` |
| Không câu VO nào thành băng chữ; ≤ 5 từ / khối; ≤ 2 khối ngoài phụ đề | pass | `Video.tsx`: tối đa CCTV HUD + 1 chip |
| Phụ đề 1–3 từ, ≤ 18 ký tự | pass | `KaraokeSubs … maxWords={3} maxChars={18} oneLine` |
| Vùng an toàn (x 60–940, y 220–1440) | pass, trừ đồ trang trí (cửa, biển sau lưng, người phụ S50) | stills safeGuide `out/sheets/n-fix4-1.png`, `n-fix5-1.png`, `n-fix6-1.png`; chưa chụp safeGuide lại cho mọi shot sau lần sửa cuối |
| Không camera giả (rung, zoom chuyển cảnh) | pass | chỉ `glide` một lần / shot, cắt cứng, CCTV đứng yên |
| Phần tử không vào cùng một kiểu | pass | chip pop / slide / drop / count / type / xoá; vật: mọc, rơi, nảy, đóng dấu, búa |
| Cắt trên ý mới của VO, không theo giờ | pass | `shots.json` neo từng shot vào từ |
| SFX: thật trước, code khi không có | pass | 3 file code có `catalog.json` `author: "code"` |
| Nhạc không có Content ID | pass | `make-music.py n-heist` |
| Frame cuối = frame 0 | pass | `<Freeze frame={0}>` |
| Mặt người thật không dùng ảnh | pass | `CAST.mandel` vẽ code |
| QA frame sau render (đen / trắng / đứng / nháy), loudness | pass | `QA.md`: không khung đen / trắng; 1 chỗ đổi đột ngột, cố ý (biển CLOSED S39); −13,9 LUFS, −2,8 dBTP; 28 đoạn đứng ≥ 12 frame (shot lướt rất chậm), chưa xử lý |
