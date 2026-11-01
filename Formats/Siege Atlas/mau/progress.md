# progress.md — l-thermopylae-full (bản test hoàn chỉnh style L)

*Phiên mới đọc file này và `checks.md` trước khi làm gì khác.*

## Trạng thái

| Cổng | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Chủ đề | xong | Thermopylae 480 TCN (chủ đề riêng, không thuộc 4 video đối thủ) |
| 2 · Kịch bản | xong | v1 → v2 (2 nhận xét của Lucas) → **FINAL, Lucas khoá 2026-11-01** |
| 3 · Giọng | xong | Charon, tempo 1,1: **101,7 s**, 146 wpm, 27 câu, 4 request TTS |
| 4 · Test | xong | Q5 + 3 ảnh AI của Lucas; dựng `Video.tsx`, critic vòng 1 (13 nhóm lỗi) đã sửa, soát sheet từ MP4 thêm 3 lỗi bố cục đã sửa |
| 5 · Final | chờ Lucas | render 4K `l-thermopylae-full.mp4` (102,7 s, −14,1 LUFS, true peak −2,9); Lucas xem trên điện thoại |

## File hiện hành

- Kịch bản: `kich-ban-l-thermopylae-full-FINAL.md` (v1, v2 giữ để so)
- Spec: `01_EPISODE-SPEC_l-thermopylae-full.md` (10 cảnh = 10 đoạn)
- Giọng: `voiceover/l-thermopylae-full.json`, `public/voiceover/l-thermopylae-full/`, `src/voiceover/l-thermopylae-full.json` / `.timing.json` / `.words.json`; nghe thử: `vo.mp3` (thư mục này)
- Code: `Video.tsx` (composition `Style-L-SiegeAtlas-ThermopylaeFull`), `factions.json`
- Ảnh: `public/images/l-thermopylae-full/` (bản đồ, tranh, 3 ảnh AI, `sources.json`)
- Video: `l-thermopylae-full.mp4` (git-ignored)

## Quyết định đã đổi

- 2026-11-01 · v2: thay tuổi Leonidas (không có nguồn chắc) bằng "all fathers with sons at home" (Herodotus 7.205); gieo hạm đội ở nhịp BC; tách đoạn kết · Lucas
- 2026-11-01 · giữ câu Immortals, chấp nhận ~104 s (thực đo 101,7 s giọng) · Lucas
- 2026-11-01 · giữ ảnh phù điêu Xerxes (Persepolis, CC BY 2.0) dù mặt đã bị đục vỡ; băng rôn cắt khung từ mũ / râu xuống áo choàng · Lucas
- 2026-11-01 · giữ ảnh AI C1 (lối núi) và C2 (300 + 700) như hiện tại, không tạo lại · Lucas

## Vấn đề mở

- Kiểm chứng dòng 12 (ước tính quân Ba Tư hiện đại) còn "?": mở thêm 1 sách học thuật trước khi đăng.
- True peak bản test 30 s −1,0 dBTP (âm bật trong giọng): đề xuất limiter trong `render:j` chờ Lucas duyệt. Bản full đạt −2,9, không cần.
- Phụ đề tách số ("seven | thousand") do `subs.tsx` dùng chung, chưa đụng.

## Bước tiếp

- Lucas xem video trên điện thoại, có tiếng.
- Nếu đạt: ghi bài học vào `../README.md` của style L.

## Bấm giờ

| Khâu | Giờ | Vòng sửa | Ghi chú |
|---|---|---|---|
| Nguồn + kịch bản | ~0,5 (Luis) | 2 (v1 → v2) | |
| Giọng (TTS + words) | ~0,1 | 0 | 4 request |
| Nền bản đồ + tô vùng | | | |
| Tranh + ảnh AI | | | |
| Dựng composition | | | |
| Review loop | | | |
| Render final | | | |
| **Tổng** | | | |
