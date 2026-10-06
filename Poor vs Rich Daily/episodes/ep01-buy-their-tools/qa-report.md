# QA REPORT — Ep01 "How Poor vs Rich People Buy Their Tools"

*Giai đoạn 6 · Cổng 5 (Final). File: `buy-their-tools.mp4` · caption: `caption.txt`. Font: Space Mono + Bricolage Grotesque · có phụ đề.*

## Checklist nhận video final (huong-dan-ban-giao §6)

| # | Mục | Kết quả | Bằng chứng |
|---|-----|---------|-----------|
| 1 | VO khớp kịch bản FINAL từng từ | ✅ PASS | So khớp tự động lời gửi TTS với `kich-ban-…-FINAL.md`: 353/353 từ, trùng tuyệt đối. Lucas đã nghe duyệt VO ở Cổng 2. |
| 2 | Mọi số trên màn hình có trong FINAL và đúng | ✅ PASS | Quét code: $400 · 22% APR · 0 customers · $150 · $300 · $450 · −$40 · $60/day · $200 · $50 · $0 — tất cả có trong FINAL/kiểm toán số. Không có số nào khác. |
| 3 | Người nghèo luôn đỏ, người giàu luôn xanh | ✅ PASS | Toàn bộ code tập chỉ dùng `#D32F2F` (POOR) và `#388E3C` (RICH) cho màu phe; soát 48 khung (mỗi 3 s). |
| 4 | Không chữ nào bị cắt khỏi khung 1080×1920 | ✅ PASS | Soát 48 khung từ chính file MP4 + khung then chốt; đã sửa: "Opposite first purchase." tràn khung, "SOLD $150" bị che, 2 dải chốt đè nhau, "0 customers" xuống dòng. |
| 5 | Chữ không hiện sớm hơn VO quá 0.2 s | ✅ PASS | Mọi chữ/số cue từ timestamp VO thật (`at(line)`), không sớm hơn đầu câu tương ứng. Lưu ý: câu trích dài hiện nguyên dải giấy khi câu bắt đầu được đọc (đồng bộ theo câu, như bản test đã duyệt). |
| 6 | Phép tính hiện từng bước | ✅ PASS | Hóa đơn in từng dòng đúng lúc VO đọc: poor 9 nhịp → TOTAL −$40 + LOSS; rich 3 nhịp → LEFT $200, rồi tiếp −$150 → LEFT $50 → CARD BALANCE $0 + PAID. |
| 7 | Âm thanh đúng quyết định hiện hành, nhạc không lấn VO | ✅ PASS* | VO + tiếng máy in + nhạc nền ≈ −24 LUFS, thấp hơn VO ~10 LU (đã nâng từ −20 dB theo góp ý Lucas: nhạc quá nhỏ), đổi sắc thái đúng câu transition (1:08.9). *Nhạc là bản **tự tổng hợp**, không phải Lyria — xem mục "Cần quyết định". |
| 8 | Loudness −14 LUFS | ✅ PASS | Đo ebur128: **−14.0 LUFS**, đỉnh −3.4 dBFS. |
| 9 | Phụ đề có mặt suốt VO, khớp lời FINAL | ✅ PASS | Phụ đề Bricolage Grotesque, cụm ≤ 30 ký tự theo timestamp VO. 22 câu có số tiền viết bằng số; kiểm tra tự động: ngoài con số, lời trùng nguyên văn FINAL. Không che nội dung chính (đã dời dải giấy scene 5). |
| 10 | Có caption.txt đúng nội dung (một câu hỏi) | ✅ PASS | `Do you buy tools like a poor or rich person?` |

## Thông số kỹ thuật (tech spec §2)

| Mục | Yêu cầu | Thực tế |
|-----|---------|---------|
| Khung hình | 1080×1920, 30 fps | 1080×1920, 30 fps, 4 310 frame |
| Codec | h264, yuv420p | h264 High, **yuv420p** |
| Audio | AAC 128k | AAC LC 128 kbps, 48 kHz stereo |
| Thời lượng | VO + 1.5 s đọng | 142.17 + 1.5 = **2:23.7** (Lucas chấp nhận 2:24) |

## Cần quyết định
- **Nhạc Lyria:** cả `lyria-3.5` và `lyria-3-clip-preview` có hạn mức **0 ở Free Tier** (lỗi 429 trên cả 2 key). Muốn dùng Lyria cần bật billing cho key. Khi có, chỉ thay 1 file nhạc rồi render lại — không phải dựng lại hình.
