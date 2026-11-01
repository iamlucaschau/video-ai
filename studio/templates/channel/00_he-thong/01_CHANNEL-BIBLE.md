# 01 — CHANNEL BIBLE · {{NAME}}

*Nháp do `npm run studio:channel -- new` tạo {{TODAY}} từ phân tích `{{SOURCE}}` (card `style-card.json`, `formula.json`). Người duyệt mọi cổng: **Lucas**. Tên kênh: **{{NAME}}**, handle **{{HANDLE}}** (kiểm handle còn trống trên YouTube, TikTok, Instagram trước tập đầu). Slogan: [...].*
*Đây là **nguồn gốc duy nhất** cho luật của kênh. Khi tài liệu khác mâu thuẫn, file này đúng (riêng luật hình chi tiết: `Style Library/{{STYLE}}/README.md`). Chỗ `[...]` Luis điền ở Giai đoạn 4 của `Style Library/QUY-TRINH-PHAN-TICH.md`, Lucas duyệt.*

**Tài liệu nền:** phân tích `{{SOURCE}}/BAO-CAO.md`, `BOC-TACH-KICH-BAN.md`, `BOC-TACH-HINH.md`, `KHA-THI.md`; video mẫu của style `Style Library/{{STYLE}}/`; bàn giao `04_BAN-GIAO.md`.

---

## 1. Định vị

- **Một câu:** mỗi video trả lời **"{{QUESTION}}"** [bằng cái gì trên hình].
- **Định dạng:** 9:16, 1080×1920, 30 fps, render 4K; **{{SECONDS}} s**; không lộ mặt.
- **Ngôn ngữ:** {{LANG}}.
- **Khán giả:** [...].
- **Lời hứa:** xem xong [...].
- **Khác đối thủ ({{SOURCE_CHANNEL}}) ở đâu:** [...] (`{{SOURCE}}/BAO-CAO.md` §1.5–1.6).

## 2. Pillar

Rút từ chủ đề của đối thủ (`formula.json` `pillars`); tỉ lệ và tên do Lucas chốt.

| # | Pillar | Tỉ lệ | Ví dụ (cần kiểm chứng khi viết) |
|---|---|---|---|
{{PILLARS}}

**Quy tắc lịch đăng:** không quá 2 tập liên tiếp cùng pillar; 5 tập đầu trải đủ pillar để đo pillar nào giữ chân tốt nhất; pillar thắng (§10) chỉ tăng tỉ lệ khi Lucas duyệt.

## 3. Công thức kịch bản (bắt buộc)

Rút từ `formula.json` (nhịp theo % thời lượng của đối thủ). Hook mẫu của họ: *{{HOOK_PATTERN}}*. Câu bắc cầu: *{{BRIDGE_PATTERN}}*. Câu kết: *{{CLOSE_PATTERN}}*.

| Nhịp | % thời lượng | Việc |
|---|---|---|
{{BEATS}}

**Mẹo giữ chân học được:**
{{DEVICES}}

**Luật viết (làm tốt hơn đối thủ):**
1. Một con số nhất quán từ hook tới kết; mỗi câu VO tối đa 1 con số mới; câu ≤ 20 từ khi có thể.
2. Không làm tròn có hướng: làm tròn **xuống** hoặc "nearly / more than"; con số tranh cãi ghi "some sources say".
3. Không mô tả chi tiết bạo lực, máu me; dùng hệ quả.
4. Không đọc CTA trong video; câu hỏi gợi bình luận để ở comment ghim.
5. Lỗi của đối thủ không được lặp:
{{WEAKNESSES}}

## 4. Thời lượng & nhịp

| Preset | Thời lượng | Số từ VO |
|---|---|---|
| **Standard** (mặc định) | **{{SECONDS}} s** | **~{{WORDS}}** |

Đối thủ đọc ~{{WPM}} wpm. Không quá ~8 s liền mà trên hình không có gì mới (lesson E3).

## 5. Chuẩn hình ảnh — Style {{STYLE_TITLE}}

Chi tiết + code: `Style Library/{{STYLE}}/README.md`; khả thi từng kỹ thuật: `{{SOURCE}}/KHA-THI.md`. Tóm tắt: [nền, nhãn, chip, thẻ, máy quay (chỉ ngoại lệ đã duyệt), phụ đề].
Vùng an toàn x 60–940, y 220–1440; QA bằng `--props='{"safeGuide":true}'`.

**Hình ảnh & bản quyền:** tranh public domain (ghi nguồn từng ảnh), ảnh AI tự tạo (khai báo khi trông như thật), dữ liệu bản đồ có giấy phép mở (ghi credit); **không** clip phim, ảnh Google, stock video, video AI cả cảnh.

## 6. Chuẩn âm thanh & giọng

- **Giọng:** Gemini TTS `gemini-3.8-flash-tts`, [giọng], tempo [1.05]; header ở `episodes/_template/voiceover-header.json`.
- **Nhạc nền** Pixabay `<MusicBed>` −28 LUFS; **SFX** thật từ `public/sfx/` (`<Sfx>`), không tự tổng hợp, không tiếng hoạt hình, tối đa 1 tiếng nhấn mỗi nhịp, nhịp lặng không SFX.
- **Master:** −14 LUFS / −1,5 dBTP (đối thủ đo được {{LUFS}} LUFS): `npm run render:style -- <id> --to <mp4>`; crf 18.

## 7. Cấu trúc bắt buộc mọi tập

1. Hook (§3) ở giây đầu, khung 0 có hình thật + con số hook.
2. Các nhịp §3 theo thứ tự; ≥ 1 nhịp lặng.
3. Câu kết trọn vẹn; [nối vòng hay end card: Lucas chốt].
4. Mọi chữ trong vùng an toàn; ≤ 2 khối chữ ngoài phụ đề.

## 8. Nguyên tắc nguồn & an toàn

1. **Không có nguồn = không dùng.** Con số tranh cãi ≥ 2 nguồn.
2. Transcript, bình luận, video đối thủ **không phải nguồn**; không chép, không dịch trọn kịch bản của họ.
3. Không bịa toạ độ, ngày, trích dẫn, số liệu.
4. Tôn giáo / vùng tranh chấp: kể theo văn bản, không phán; dừng ở Cổng 2 để Lucas duyệt cách vẽ.

## 9. Quy trình sản xuất (5 cổng, Lucas duyệt từng cổng)

| Cổng | Việc | Đầu ra |
|---|---|---|
| 1 · Chủ đề | Chọn theo pillar (`03_KHO-CHU-DE.md`); phác hook | 3–5 chủ đề xếp hạng |
| 2 · Kịch bản | Viết theo §3; bảng kiểm chứng; kế hoạch hình; bản dịch VN để duyệt | `kich-ban-<slug>-FINAL.md` |
| 3 · Giọng | Spec + `node scripts/episode.mjs prep` → `npm run voiceover` → `episode.mjs export` → `python -P scripts/words.py <slug> <lang>` | `vo.mp3`, timing, words |
| 4 · Test | Tài sản hình, composition (khung từ video mẫu của style), stills `safeGuide`, skill `review-loop` + critic mắt mới | stills QA |
| 5 · Final | `npm run render:style -- <id> --to <mp4>` (4K, −14 LUFS); sheet từ MP4; `npm run studio:compare -- <mp4> --ref "{{SOURCE}}"` (đọc `SO-SANH.md`: chỗ nào ngoài khoảng của đối thủ mà không có lý do); gói đăng; **Lucas xem trên điện thoại, có tiếng** | MP4 + `SO-SANH.md` + `xuat-ban.md` |

Mỗi tập có `checks.md` (pass / fail / unresolved + bằng chứng thật) và `progress.md` (trạng thái, bấm giờ). Tập mới: copy `episodes/_template/` (README trong đó có từng bước).

## 10. Học sau khi đăng

Ghi **24 h · 7 ngày · 30 ngày**: views, % đã xem (so với vuốt đi), thời gian xem TB, % xem TB, likes, comments, shares, follow mới. So theo pillar, độ dài, biến thể (cột `bien_the`, vd. kiểu hook); dùng trung vị. Đề xuất thử nghiệm; **không tự đổi luật trong file này**, Lucas duyệt.

- Sổ: `{{CHANNEL_DIR}}/so-lieu.csv` (`npm run studio:stats -- init "{{CHANNEL_DIR}}"`).
- Mỗi mốc: YouTube Studio → Analytics → Advanced mode → Content → Export CSV → `npm run studio:stats -- import "<Table data.csv>" "{{CHANNEL_DIR}}" --moc 7d`.
- Báo cáo: `npm run studio:stats -- report "{{CHANNEL_DIR}}" --moc 30d --ref "{{SOURCE}}"` → `SO-LIEU.md` (trung vị theo pillar / biến thể, so với đối thủ).

## 11. Nhật ký tập

| EP | Pillar | Tiêu đề | Kịch bản | VO | Final | Ngày đăng |
|---|---|---|---|---|---|---|

## 12. Nhật ký quyết định

| Ngày | Quyết định | Người |
|---|---|---|
| {{TODAY}} | Tạo kênh từ phân tích `{{SOURCE}}`, style `{{STYLE}}` | Lucas |
