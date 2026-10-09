# 00 — SERIES BIBLE: "Poor vs Rich" (page: Poor vs Rich Daily)
*Khóa một lần, dùng cho mọi tập. Claude không được tự ý đổi bất kỳ giá trị nào dưới đây giữa các tập.*

## 1. Format
- Canvas: **1080×1920** (9:16 dọc), 30fps, h264
- Độ dài: 105–125 giây
- Ngôn ngữ: voiceover tiếng Anh (~150 từ/phút), chữ trên màn hình tiếng Anh

## 2. Visual style — thư viện 4 phong cách (chốt 2026-10-07, Lucas)
- Series dùng **8 phong cách** A–H từ thư viện dùng chung `Style Library/` (gốc dự án). Mỗi tập Claude chọn phong cách hợp kịch bản (hoặc đề xuất phong cách mới) theo **`03_STYLE-LIBRARY.md`**; Lucas duyệt ở Cổng 3. Bất biến chung của mọi phong cách: `03_STYLE-LIBRARY.md` §1
- Chi tiết phong cách A (phong cách gốc, Ep01) giữ nguyên bên dưới:

### A — "Receipt × Paper" (chốt 2026-10-06)
- **Thế giới:** diorama giấy nhiều lớp — tường giấy kraft `#D9C6A3`, sàn giấy nâu, đồ vật cắt giấy có mép xé và bóng đổ thật. MỘT tập một bối cảnh chính
- **Nhân vật:** con rối giấy (paper puppet) — POOR tạp dề đỏ, RICH tạp dề xanh lá; biểu cảm bằng mặt + cử chỉ (giơ biển số tiền)
- **Mọi phép tính in trên hóa đơn nhiệt:** máy in giấy đặt trong cảnh, hóa đơn nhả từ dưới lên, mỗi dòng in đúng lúc VO đọc (có tiếng máy in). Kết phe nghèo: con dấu đỏ (vd. LOSS); phe giàu: con dấu xanh (vd. PAID)
- **Bảng ghim trên tường:** các tấm giấy ghim kể diễn biến (job, lịch, sao kê…), rơi vào/ra theo nhịp
- **Câu đắt:** viết trên mảnh giấy xé dán lên tường
- **Chuyển động (chốt 2026-10-07):** stop-motion ~12 khung/giây; **khung hình đứng yên — KHÔNG máy quay di chuyển** (không trôi, không rung tay, không nảy, không lia/zoom, không push-in; Lucas thấy khó chịu). Nhấn mạnh bằng: con rối diễn xuất (chớp mắt, nhìn, chỉ tay, gật/giật mình, gục vai, mấp máy khi nói), chữ đập giữa màn hình cho con số đắt, tiền giấy bay, mép giấy "thở", thẻ ghim đung đưa, dòng hóa đơn mới lóe vàng; chuyển scene hard cut
- Không ảnh raster/AI — toàn bộ dựng bằng code

## 3. Character sheet (bất biến)
| Nhân vật | Màu chủ đạo | Mô tả |
|----------|-------------|-------|
| POOR | Đỏ `#D32F2F` (áo/tạp dề) | Nam, tóc rối, vẻ mặt lo lắng/cam chịu |
| RICH | Xanh lá `#388E3C` (áo/tạp dề) | Nữ hoặc nam tùy tập, tự tin, cười nhẹ |
| Phụ | Xám/xanh navy `#37474F` | Khách hàng, đồ vật |
- Quy tắc: POOR luôn đỏ, RICH luôn xanh lá — không đảo, không đổi sắc độ giữa các tập
- Hình thể nhân vật đổi theo phong cách (con rối giấy ở A, quân cờ ở B, xe/HUD ở C, bong bóng chat ở D), **màu phe thì không đổi**

## 4. Typography trên màn hình
- Font: **Space Mono** (chữ hóa đơn) + **Bricolage Grotesque** 700/800 (dải giấy, nhãn, tiêu đề, biển số, phụ đề) — chốt 2026-10-06
- **Phụ đề (subtitles) bắt buộc:** chữ trắng viền đen, **1–3 từ một lần**, đặt ở mép dưới vùng an toàn (~y 1350, trong x 60–940) — từ Ep04 (Ep01–Ep03: ~y 1600, cụm ≤ 30 ký tự, đã duyệt). Quy tắc short-form: `03_STYLE-LIBRARY.md` §1, mỗi câu VO chia cụm ≤ 30 ký tự, hiện đúng nhịp VO; số tiền viết bằng số ($400, 22%) cho khớp hóa đơn, phần lời còn lại giữ nguyên văn FINAL
- Cỡ chữ phân cấp: keyword lớn (tiêu đề beat) > số tiền/phép tính (nổi bật thứ hai) > chú thích nhỏ
- Màu chữ: mực đen `#2B2B2B`; số tiền màu theo phe (đỏ/xanh); cảnh báo/sự thật gắt có thể dùng đỏ
- Mỗi dòng chữ xuất hiện **đồng bộ với từ khóa trong voiceover** (±0.2s), không hiện trước khi VO đọc tới

## 5. Cấu trúc series (5 hồi — bất biến)
1. **Title card (0–3s):** "How Poor Vs Rich People [X]" + VERSUS + POOR/RICH chia đôi màn hình
2. **Chuyện NGHÈO (~40% thời lượng):** 2–3 beats, mỗi beat = 1 sai lầm + con số cụ thể → thất bại
3. **Transition (1 câu):** "Here's what a rich person does with the same [X]"
4. **Chuyện GIÀU (~40%):** 3–4 bước đánh số (first/second/third/fourth), mỗi bước 1 nguyên tắc + con số → thành công
5. **Closing card:** "Poor people [X]. Rich people [Y]. Same [tài nguyên], opposite [lựa chọn]." + so sánh trực quan 2 cột

## 6. Âm thanh
- Voiceover tiếng Anh, giọng kể chuyện nam/nữ đều được nhưng **một tập một giọng**, nhịp đều, nhấn vào con số
- **Giọng chuẩn (chốt 2026-10-07):** Gemini `Orus`, chỉ dẫn *"seasoned storyteller… warm, grounded, human… slow down on every number… small pause before the punchline… hint of dry irony… never rushed"* (bản đầy đủ: `scripts/episode.mjs`). **Tempo tự nhiên ×1.0 — không ép tốc độ để kịp thời lượng** (ép tempo làm mất cảm xúc, bài học Ep02); thời lượng ~2:15–2:25 được chấp nhận
- Nhạc nền: **Lyria** (Google) khi có billing, không lời; mức **≈ −24 LUFS, thấp hơn VO ~10 LU** (nghe rõ trên điện thoại, lời vẫn nổi); đổi sắc thái đúng câu transition (Poor trầm → Rich sáng hơn)
- Foley của look: tiếng máy in hóa đơn mỗi dòng in
- Không SFX hoạt hình lố (boing/pop) — giữ tone "bài học nghiêm túc"

## 7. Quy tắc chữ/số
- Mọi khẳng định phải có con số đi kèm ($, giờ, %, số lượng) — cấm nói chung chung
- Phép tính hiện **từng bước** (không hiện kết quả ngay): vd. "$750 − $60 = $690 ÷ 40h = $17.25/hr" vẽ lần lượt 4 nhịp
- Đơn vị tiền: $ (USD), viết đầy đủ khi VO đọc ("twenty-five dollars"), ký hiệu $ khi hiện chữ
