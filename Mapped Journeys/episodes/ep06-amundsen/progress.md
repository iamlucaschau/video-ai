# progress.md — ep06-amundsen

*Bàn giao giữa các phiên (Lucas duyệt 2026-11-01, đề xuất A2, A10). Cập nhật sau mỗi cổng hoặc khi dừng giữa chừng. **Phiên mới đọc file này và `checks.md` trước khi làm gì khác.***

## Trạng thái

| Cổng | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Chủ đề | xong (hook A, Lucas 2026-11-04) | 3 hook + bảng kiểm chứng A1–A13 trong FINAL; nguồn chính: sách của Amundsen (1908) |
| 2 · Kịch bản | xong (bản khoá, Lucas 2026-11-04) | v1 + kết (a) Lucas duyệt 2026-11-04; bản khoá 26 câu, 329 từ, ~134 s; spec 7 cảnh, `prep` khớp |
| 3 · Giọng | xong (Lucas duyệt 2026-11-04) | Charon, tempo 1,0; `vo.mp3` 126,1 s, 157 wpm |
| 4 · Test | xong (Lucas cho render 2026-11-04) | Lucas duyệt tải 2026-11-04; 6 thẻ ảnh PD, 8 tấm bản đồ, tiếng mưa Mixkit 2399; `Video.tsx` + `MJ-ep06-amundsen`; lint sạch; 2 ảnh AI (Lucas); review loop 4 vòng + critic mắt mới |
| 5 · Final | render xong 2026-11-04 (chờ Lucas xem trên điện thoại) | `amundsen.mp4` 4K, 126,6 s, −14,3 LUFS, −1,9 dBTP; sheet `ep06-video-1…4`; gói đăng `xuat-ban.md` + bìa A / C |

## File hiện hành

- Kịch bản: `kich-ban-amundsen-FINAL.md`
- Giọng: `public/voiceover/amundsen/…`, `src/voiceover/amundsen.json` / `.timing.json` / `.words.json`
- Code: `Video.tsx`, composition `MJ-ep06-amundsen`
- Render: `amundsen.mp4`
- Sheet mới nhất: `out/sheets/ep06-video-1…4.png` (từ MP4)

## Quyết định đã đổi (và vì sao)

- 2026-11-04 · Mixkit 2399 là "Heavy rain drops" (12 s), không phải "Long rain ambience" như Luis đọc nhầm ở Cổng 4; vẫn là tiếng mưa, dùng cho câu 04 · Luis
- 2026-11-04 · Bỏ ảnh *Gjøa* "Visitors aboard" ở câu 05 (ảnh chụp đám đông, không thấy thuyền) → dùng ở câu 27 (Nome 1906, đúng nơi đúng năm) · Luis
- 2026-11-04 · Ep06 = Amundsen (P2), hook A (129 người của Franklin ↔ 7 người, 3 năm); v1 + kết (a) · Lucas
- 2026-11-04 · Bản khoá: 3 câu hạ cho khớp nguồn (11, 15, 25); giọng tempo 1,0 ngay từ đầu (bài học Ep05) · Luis

## Vấn đề mở

- Wiik (máy phó) chết vì bệnh mùa đông 1905–06 (A10): VO không nhắc; Lucas chưa yêu cầu thêm
- Hình dễ trùng Ep05 (cùng đảo King William): chặng mới Beaufort / Eagle / Nome / San Francisco, so sánh tây đỏ ↔ đông xanh
- Nhạc P2 (Cinematic Documentary, Lexin_Music): thử bằng video không công khai trước khi đăng

## Bước tiếp

- Lucas xem `amundsen.mp4` trên điện thoại, có tiếng, rồi nghe một lần không nhìn (A11)
- Trước khi đăng: điền link Ep05, tải lên không công khai trước (nhạc Ep03, Content ID), chọn bìa (`xuat-ban.md`, mục cuối)
- Render lại (nếu cần): `npm run render:j -- MJ-ep06-amundsen --to "Mapped Journeys/episodes/ep06-amundsen/amundsen.mp4" --keep-raw --timeout=180000` (4K, ~2,7 giờ; TMP/TEMP = `out/tmp`)
- Sheet: dùng `--bundle-dir out/bundle-ep06` (phiên khác dùng chung `out/bundle`)

## Bấm giờ (A10, baseline cho tập sau)

Ghi giờ làm thực tế của từng khâu (người + máy chờ render), đo, không ước.

| Khâu | Giờ | Vòng sửa | Ghi chú |
|---|---|---|---|
| Nguồn + kịch bản | | | |
| Giọng (TTS + words) | | | |
| Nền bản đồ + tô vùng | | | |
| Tranh + ảnh AI | | | |
| Dựng composition | | | |
| Review loop | | | |
| Render final | | | |
| Gói đăng | | | |
| **Tổng** | | | |
