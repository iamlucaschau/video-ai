# progress.md — ep05-franklin

*Bàn giao giữa các phiên (Lucas duyệt 2026-11-01, đề xuất A2, A10). Cập nhật sau mỗi cổng hoặc khi dừng giữa chừng. **Phiên mới đọc file này và `checks.md` trước khi làm gì khác.***

## Trạng thái

| Cổng | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Chủ đề | xong (hook A, Lucas 2026-11-03) | 3 hook + bảng kiểm chứng F1–F12 trong FINAL |
| 2 · Kịch bản | xong (bản khoá, Lucas 2026-11-03) | v1 + kết (a) Lucas duyệt 2026-11-03; bản khoá 25 câu, 323 từ, ~133 s |
| 3 · Giọng | xong (Lucas duyệt 2026-11-03) | Charon, tempo 1,0; `vo.mp3` 127,2 s, 152 wpm |
| 4 · Test | xong (Lucas cho render 2026-11-03) | tải xong; 6 tấm bản đồ; `Video.tsx`, `MJ-ep05-franklin`; 2 vòng sửa; lint sạch |
| 5 · Final | render xong 2026-11-03, chờ Lucas xem trên điện thoại | `franklin.mp4` 4K, 127,6 s, −14,3 LUFS, −2,9 dBTP; gói đăng `xuat-ban.md` + bìa A / C |

## File hiện hành

- Kịch bản: `kich-ban-franklin-FINAL.md`
- Giọng: `public/voiceover/<slug>/…`, `src/voiceover/<slug>.json` / `.timing.json` / `.words.json`
- Code: `Video.tsx`, composition `MJ-ep05-franklin`
- Render: `franklin.mp4` (raw: `out/j/MJ-ep05-franklin-raw.mp4`)
- Sheet mới nhất: `out/sheets/ep05-video-1…5.png`, `ep05-edge-1.png`

## Quyết định đã đổi (và vì sao)

- 2026-11-03 · Lucas thêm 2 ảnh AI (2160×3840); nhãn EREBUS / TERROR sang trái, nằm trên nước vịnh Queen Maud · Lucas / Luis
- 2026-11-03 · Ep05 = Franklin (P5), hook A (3 năm lương thực → 169 năm mới tìm thấy) · Lucas
- 2026-11-03 · v1 + câu kết (a) "The Inuit had been telling the story since 1854." · Lucas
- 2026-11-03 · Giọng: tempo 1,05 → 1,0 (112 s / 173 wpm quá nhanh so với Bible §4) · Luis
- 2026-11-03 · Bỏ "They never sailed again" (có giả thuyết một tàu chạy lại), bỏ "2,5 giờ" (chỉ 1 nguồn) · Luis

## Vấn đề mở

- Nhạc: Historical Documentary (Tunetank, `PILLAR_MUSIC.P1`), Lucas duyệt cùng danh sách tải 2026-11-03; chỉ an toàn nếu Ep01 chưa bị claim
- Bản đồ gần cực: điểm cao nhất 75,75°B (vịnh Melville) hiển thị ổn; không bay lên 77°B

## Bước tiếp

- Lucas xem `franklin.mp4` trên điện thoại (A11)
- Đăng: tải lên không công khai trước để kiểm Content ID nhạc Tunetank; checklist cuối `xuat-ban.md`

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
| Render final | 3 giờ 11 phút (máy) | 0 | 4K, TMP/TEMP = `out/tmp` |
| Gói đăng | | | |
| **Tổng** | | | |
