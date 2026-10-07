# QA REPORT — Ep02 "How Poor vs Rich People Give Discounts"

*Giai đoạn 6 · Cổng 5 (Final). File: `give-discounts.mp4` · caption: `caption.txt`. Look "Receipt × Paper" · khung đứng yên (không máy quay) · có phụ đề.*

## Checklist nhận video final (huong-dan-ban-giao §6)

| # | Mục | Kết quả | Bằng chứng |
|---|-----|---------|-----------|
| 1 | VO khớp kịch bản FINAL từng từ | ✅ PASS | `episode.mjs prep` so khớp lời gửi TTS với `kich-ban-give-discounts-FINAL.md`: 315/315 từ, trùng tuyệt đối. Lucas đã nghe duyệt VO ở Cổng 2 (Orus "storyteller", tempo 1.0). |
| 2 | Mọi số trên màn hình có trong FINAL và đúng | ✅ PASS | Quét code: $60 · $48 · $18 · $6 · $42 · $30 · −20% · −29% · $12 · $36 · $66 · 20% OFF · $96 · $126. Tất cả có trong FINAL/bảng kiểm toán số (−29% = −28.6% làm tròn, "almost thirty"). Không có số nào khác. |
| 3 | Người nghèo luôn đỏ, người giàu luôn xanh | ✅ PASS | Màu phe chỉ dùng `INK.poor #D32F2F` / `INK.rich #388E3C`; khách & hàng xóm là navy trung tính `#37474F`. Soát 45 khung (mỗi 3 s). |
| 4 | Không chữ nào bị cắt khỏi khung 1080×1920 | ✅ PASS | Soát 45 khung từ chính file MP4 + khung then chốt. Đã sửa: tag "20% OFF" (S1) và "② Name the trade" (S5) tràn mép phải, chữ "SIGNED" tràn biển (S6, biển giờ tự co chữ dài), biển "$126" chạm mép (S8), chữ phụ thẻ $60 quá nhỏ (S2), con rối S8 quá bé. |
| 5 | Chữ không hiện sớm hơn VO quá 0.2 s | ✅ PASS | Mọi chữ/số cue từ timestamp VO thật (`at(line)`), không sớm hơn đầu câu tương ứng. Dải trích dài hiện nguyên khi câu bắt đầu (như bản test đã duyệt). |
| 6 | Phép tính hiện từng bước | ✅ PASS | Hóa đơn POOR in 11 nhịp → PER VISIT $66 (đỏ), −29% đập vào màn hình; hóa đơn RICH: $30 → $48 → ×2 $96 → PER VISIT $126 (xanh) + PAID, $126 đập vào màn hình, rồi "$126 vs $66". |
| 7 | Âm thanh đúng quyết định hiện hành, nhạc không lấn VO | ✅ PASS* | VO + tiếng máy in + nhạc nền ≈ −24 LUFS (~10 LU dưới VO, mức Lucas đã duyệt ở Ep01), đổi từ nhạc tối sang sáng đúng câu transition 33 (1:11.5). *Nhạc vẫn là bản **tự tổng hợp** (Lyria cần billing). |
| 8 | Loudness −14 LUFS | ✅ PASS | Đo ebur128: **−13.9 LUFS**, đỉnh −2.3 dBFS. |
| 9 | Phụ đề có mặt suốt VO, khớp lời FINAL | ✅ PASS | Bricolage Grotesque trắng viền đen, y≈1600, cụm ≤ 30 ký tự theo timestamp VO. 23 câu viết số tiền bằng chữ số; kiểm tra tự động: ngoài con số, lời trùng nguyên văn FINAL. Không che nội dung chính. |
| 10 | Có caption.txt đúng nội dung (một câu hỏi) | ✅ PASS | `Do you give discounts like a poor or rich person?` |

## Thông số kỹ thuật (tech spec §2)

| Mục | Yêu cầu | Thực tế |
|-----|---------|---------|
| Khung hình | 1080×1920, 30 fps | 1080×1920, 30 fps, 4 068 frame |
| Codec | h264, yuv420p | h264 High, **yuv420p** |
| Audio | AAC 128k | AAC LC 128 kbps, 48 kHz stereo |
| Thời lượng | VO + 1.5 s đọng | 134.11 + 1.5 ≈ **2:15.7** (Lucas chấp nhận ~2:20) |

## Ghi chú
- Chuyển động: khung đứng yên tuyệt đối; con rối diễn (nhìn, chớp mắt, nói, gật, cười, xụ vai, chỉ tay, giơ biển), số đập vào màn hình, tiền giấy bay, thẻ ghim đung đưa, hóa đơn nhấp nháy dòng mới.
- Nhạc Lyria: vẫn chờ billing. Khi có, chỉ cần thay 1 file nhạc rồi render lại, không phải dựng lại hình.
