# 01 — FORMAT BIBLE · {{NAME}}

*Gói format do `npm run studio:format -- new` tạo {{TODAY}} từ phân tích `{{SOURCE}}` (kênh tham khảo: {{SOURCE_CHANNEL}}). Người duyệt mọi cổng: **Lucas**. Đây là **nguồn gốc duy nhất** cho luật sản xuất của format; công thức chủ đề + kịch bản ở `02_CONG-THUC.md`, luật hình chi tiết ở `Style Library/{{STYLE}}/README.md`.*

**Chưa chốt ở gói này (AI ở chat mới hỏi Lucas, `05_BAN-GIAO.md` §1):** tên kênh, handle, thị trường, ngôn ngữ, giọng, pillar và tỉ lệ, màu nhấn, nhận diện, lịch đăng. Chỗ nào ghi **[hỏi Lucas]** là chờ câu trả lời đó.

---

## 1. Định vị

- **Câu hỏi gốc mỗi video trả lời:** **"{{QUESTION}}"**
- **Định dạng:** 9:16, 1080×1920, 30 fps, render 4K; **{{SECONDS}} s**; không lộ mặt.
- **Thị trường, ngôn ngữ, khán giả:** [hỏi Lucas]. Format học từ kênh {{SOURCE_CHANNEL}} (tiếng Anh).
- **Khác kênh tham khảo ở đâu:** `{{SOURCE}}/BAO-CAO.md` §1.5–1.6 và `mau/` (bản demo so với họ).

## 2. Góc kể (từ kênh tham khảo; pillar thật: [hỏi Lucas])

| Góc kể | Tỉ lệ ở kênh tham khảo | Ví dụ của họ (mình tìm góc khác) |
|---|---|---|
{{ANGLES}}

## 3. Công thức chủ đề + kịch bản

Ở `02_CONG-THUC.md` (bắt buộc đọc trước khi viết kịch bản). Tóm tắt nhịp:

| Nhịp | % thời lượng | Việc |
|---|---|---|
{{BEATS}}

## 4. Thời lượng & nhịp

| Preset | Thời lượng | Số từ VO |
|---|---|---|
| **Standard** (mặc định) | **{{SECONDS}} s** | **~{{WORDS}}** |

Kênh tham khảo đọc ~{{WPM}} wpm. Không quá ~8 s liền mà trên hình không có gì mới (lesson E3).

## 5. Chuẩn hình ảnh — Style {{STYLE_TITLE}}

**Phong cách dựng** (khung 0–1 s, 3 s cuối, hình theo từng nhịp kịch bản, kỹ thuật → component, các bước dựng, số đo hình): `03_PHONG-CACH-DUNG.md`. Code: `Style Library/{{STYLE}}/README.md`; khả thi từng kỹ thuật: `{{SOURCE}}/KHA-THI.md`. Vùng an toàn x 60–940, y 220–1440; QA bằng `--props='{"safeGuide":true}'`.

**Hình ảnh & bản quyền:** tranh public domain (ghi nguồn từng ảnh), ảnh AI tự tạo (khai báo khi trông như thật), dữ liệu bản đồ có giấy phép mở (ghi credit); **không** clip phim, ảnh Google, stock video, video AI cả cảnh.

## 6. Chuẩn âm thanh & giọng

- **Giọng:** Gemini TTS `gemini-3.8-flash-tts`, mặc định **{{VOICE}}** (giọng / ngôn ngữ thật: [hỏi Lucas]); header ở `episodes/_template/voiceover-header.json`.
- **Nhạc nền** Pixabay `<MusicBed>`; **SFX** thật từ `public/sfx/` (`<Sfx>`), không tự tổng hợp, không tiếng hoạt hình, tối đa 1 tiếng nhấn mỗi nhịp, nhịp lặng không SFX.
- **Master:** −14 LUFS / −1,5 dBTP (kênh tham khảo đo {{LUFS}} LUFS): `npm run render:style -- <id> --to <mp4>`; crf 18.

## 7. Cấu trúc bắt buộc mọi tập

1. Hook (`02_CONG-THUC.md` §2) ở giây đầu; khung 0 có hình thật + con số / năm của hook.
2. Các nhịp theo thứ tự; ≥ 1 nhịp lặng.
3. Câu kết trọn vẹn theo kiểu kết của format.
4. Mọi chữ trong vùng an toàn; ≤ 2 khối chữ ngoài phụ đề.

## 8. Nguyên tắc nguồn & an toàn

1. **Không có nguồn = không dùng.** Con số tranh cãi ≥ 2 nguồn, đọc kèm nhãn nguồn.
2. Transcript, bình luận, video đối thủ **không phải nguồn**; không chép, không dịch trọn kịch bản của họ.
3. Không bịa toạ độ, ngày, trích dẫn, số liệu.
4. Tôn giáo / vùng tranh chấp: kể theo văn bản, không phán; dừng ở Cổng 2 để Lucas duyệt cách vẽ.

## 9. Quy trình sản xuất (5 cổng, Lucas duyệt từng cổng)

| Cổng | Việc | Đầu ra |
|---|---|---|
| 1 · Chủ đề | Chọn theo góc kể (`04_KHO-CHU-DE.md`), chấm theo `02_CONG-THUC.md` §1 | 3–5 chủ đề xếp hạng |
| 2 · Kịch bản | Viết theo `02_CONG-THUC.md` §2–3; bảng kiểm chứng; kế hoạch hình; bản dịch VN để duyệt | `kich-ban-<slug>-FINAL.md` |
| 3 · Giọng | Spec + `node scripts/episode.mjs prep` → `npm run voiceover` → `episode.mjs export` → `python -P scripts/words.py <slug> <lang>` | `vo.mp3`, timing, words |
| 4 · Test | Tài sản hình, composition (khung từ `mau/`), stills `safeGuide`, skill `review-loop` + critic mắt mới | stills QA |
| 5 · Final | `npm run render:style -- <id> --to <mp4>` (4K, −14 LUFS); sheet từ MP4; `npm run studio:compare -- <mp4> --ref "{{SOURCE}}"` (đọc `SO-SANH.md`: chỗ nào ngoài mục tiêu ở `02_CONG-THUC.md` §4 mà không có lý do); gói đăng; **Lucas xem trên điện thoại, có tiếng** | MP4 + `SO-SANH.md` + `xuat-ban.md` |

Mỗi tập có `checks.md` (pass / fail / unresolved + bằng chứng thật) và `progress.md` (trạng thái, bấm giờ). Tập mới: copy `episodes/_template/` (README trong đó có từng bước).

## 10. Học sau khi đăng

Ghi **24 h · 7 ngày · 30 ngày**: views, % đã xem (so với vuốt đi), thời gian xem TB, % xem TB, likes, comments, shares, follow mới. So theo góc kể, độ dài, biến thể (cột `bien_the`, vd. kiểu hook); dùng trung vị. Đề xuất thử nghiệm; **không tự đổi luật trong file này**, Lucas duyệt.

- Sổ: `<thư mục kênh>/so-lieu.csv` (`npm run studio:stats -- init "<thư mục kênh>"`).
- Mỗi mốc: YouTube Studio → Analytics → Advanced mode → Content → Export CSV → `npm run studio:stats -- import "<Table data.csv>" "<thư mục kênh>" --moc 7d`.
- Báo cáo: `npm run studio:stats -- report "<thư mục kênh>" --moc 30d --ref "{{SOURCE}}"` → `SO-LIEU.md`.

## 11. Nhật ký tập

| EP | Góc kể | Tiêu đề | Kịch bản | VO | Final | Ngày đăng |
|---|---|---|---|---|---|---|
| mẫu | — | `mau/` (bản demo dựng lúc phân tích) | FINAL | ✓ | ✓ | không đăng |

## 12. Nhật ký quyết định

| Ngày | Quyết định | Người |
|---|---|---|
| {{TODAY}} | Tạo gói format từ phân tích `{{SOURCE}}`, style `{{STYLE}}`; tên kênh / thị trường chốt sau ở chat mới | Lucas |
