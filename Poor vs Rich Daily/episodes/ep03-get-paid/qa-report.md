# QA REPORT — Ep03 "How Poor vs Rich People Get Paid"

*Giai đoạn 6 · Cổng 5 (Final). File: `get-paid.mp4` · caption: `caption.txt`. Phong cách **D "Text Thread"** (`03_STYLE-LIBRARY.md`) · khung đứng yên · có phụ đề.*

## Checklist nhận video final (huong-dan-ban-giao §6)

| # | Mục | Kết quả | Bằng chứng |
|---|-----|---------|-----------|
| 1 | VO khớp kịch bản FINAL từng từ | ✅ PASS | `episode.mjs prep` so khớp spec ↔ FINAL: 342/342 từ, 64 câu. Lucas đã nghe duyệt VO ở Cổng 2 (Orus "storyteller", tempo 1.0, giữ 2:34). |
| 2 | Mọi số trên màn hình có trong FINAL và đúng | ✅ PASS | $2,000 · $600 · 24% APR · 1.5 months · $18 · 45 days · $1,382 · $782 · four/eight days · $1,000 · $400 · $0 · $1,400 · $1,800 · ×2+. Tất cả có trong FINAL/bảng kiểm toán. Đã bỏ các ngày/hạn trả tự thêm ở storyboard. HUD chạy số qua các giá trị trung gian trong ~0.5 s (hiệu ứng đếm). |
| 3 | Người nghèo luôn đỏ, người giàu luôn xanh | ✅ PASS | Bong bóng, thẻ, HUD, nhãn: POOR `#D32F2F`, RICH `#388E3C`; khách dùng avatar tím/cam trung tính. |
| 4 | Không chữ nào bị cắt khỏi khung 1080×1920 | ✅ PASS | Soát 52 khung từ chính file MP4 + 29 khung then chốt khi dựng. Tin cũ trôi lên dưới thanh tiêu đề như app thật (chủ ý). |
| 5 | Chữ không hiện sớm hơn VO quá 0.2 s | ✅ PASS | Mọi tin nhắn, dòng giao dịch, thông báo cue theo timestamp VO (`at(line)`). |
| 6 | Phép tính hiện từng bước | ✅ PASS | POOR: thẻ $600 → lãi +$18 → $2,000 − $600 − $18 = $1,382 → − $600 = **$782** (đập màn hình). RICH: +$1,000 cọc → −$600 → $400 trước ngày đầu, thẻ $0 → +$1,000 nghiệm thu → $1,400 + $400 = **$1,800** (đập màn hình) vs $782. |
| 7 | Âm thanh đúng quyết định hiện hành, nhạc không lấn VO | ✅ PASS* | VO + nhạc nền ≈ −24 LUFS (mức Lucas duyệt ở Ep01), đổi tối → sáng đúng câu transition 33 (1:24.1). *Nhạc vẫn là bản **tự tổng hợp** (Lyria cần billing). |
| 8 | Loudness −14 LUFS | ✅ PASS | Đo ebur128: **−14.1 LUFS**, đỉnh −2.3 dBFS. |
| 9 | Phụ đề có mặt suốt VO, khớp lời FINAL | ✅ PASS | Bricolage Grotesque trắng viền đen, y≈1600, cụm ≤ 30 ký tự. 22 câu viết số tiền/% bằng chữ số; phần lời còn lại nguyên văn FINAL. |
| 10 | Có caption.txt đúng nội dung (một câu hỏi) | ✅ PASS | `Do you get paid like a poor or rich person?` |

## Thông số kỹ thuật

| Mục | Yêu cầu | Thực tế |
|-----|---------|---------|
| Khung hình | 1080×1920, 30 fps | 1080×1920, 30 fps, 4 659 frame |
| Codec | h264, yuv420p | h264 High, **yuv420p** |
| Audio | AAC 128k | AAC LC 128 kbps, 48 kHz stereo |
| Thời lượng | VO + 1.5 s đọng | 153.79 + 1.5 ≈ **2:35.4** (Lucas duyệt giữ 2:34 VO) |

## Ghi chú
- Phần dựng mới, dùng lại được cho các tập sau: trạng thái "Delivered/Seen", lớp làm tối nền cho câu kết, dấu phẩy hàng nghìn trên HUD, thẻ tiêu đề theo tập, khung tập dùng chung `src/series/pvr/cut.tsx` (Ep02 đã chuyển sang).
- Tin nhắn là lời thoại dựng thêm, diễn ý FINAL; không thêm con số ngoài bảng kiểm toán.
