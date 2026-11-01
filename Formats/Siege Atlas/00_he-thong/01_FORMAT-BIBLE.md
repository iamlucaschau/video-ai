# 01 — FORMAT BIBLE · Thế Trận

*Gói format do `npm run studio:format -- new` tạo 2026-11-02 từ phân tích `Test/History Maps Lore` (kênh tham khảo: History Maps Lore). Người duyệt mọi cổng: **Lucas**. Đây là **nguồn gốc duy nhất** cho luật sản xuất của format; công thức chủ đề + kịch bản ở `02_CONG-THUC.md`, luật hình chi tiết ở `Style Library/L-siege-atlas/README.md`.*

**Chưa chốt ở gói này (AI ở chat mới hỏi Lucas, `05_BAN-GIAO.md` §1):** tên kênh, handle, thị trường, ngôn ngữ, giọng, pillar và tỉ lệ, màu nhấn, nhận diện, lịch đăng. Chỗ nào ghi **[hỏi Lucas]** là chờ câu trả lời đó.

---

## 1. Định vị

- **Câu hỏi gốc mỗi video trả lời:** **"Làm sao bên nhỏ chặn được siêu cường?"**
- **Định dạng:** 9:16, 1080×1920, 30 fps, render 4K; **84–99 s**; không lộ mặt.
- **Thị trường, ngôn ngữ, khán giả:** [hỏi Lucas]. Format học từ kênh History Maps Lore (tiếng Anh).
- **Khác kênh tham khảo ở đâu:** `Test/History Maps Lore/BAO-CAO.md` §1.5–1.6 và `mau/` (bản demo so với họ).

## 2. Góc kể (từ kênh tham khảo; pillar thật: [hỏi Lucas])

| Góc kể | Tỉ lệ ở kênh tham khảo | Ví dụ của họ (mình tìm góc khác) |
|---|---|---|
| Vây hãm / bên nhỏ chặn siêu cường | 50 % | Malta 1565 · Rhodes 1480 |
| Đòn đánh gây tranh cãi đạo đức | 25 % | Copenhagen 1807 |
| Báo thù của kẻ chinh phục | 25 % | Tây Hạ 1227 |

## 3. Công thức chủ đề + kịch bản

Ở `02_CONG-THUC.md` (bắt buộc đọc trước khi viết kịch bản). Tóm tắt nhịp:

| Nhịp | % thời lượng | Việc |
|---|---|---|
| H · hook | 0–6 % | năm + siêu cường + mục tiêu, nghịch lý kích thước |
| B · bản đồ địa chính trị | 6–20 % | ai nắm vùng nào, bên nhỏ nằm ở đâu (câu bắc cầu) |
| N · bên yếu có tên + tuổi | 20–30 % | thủ lĩnh, tuổi, số quân ít |
| X · khiêu khích | 30–38 % | lý do siêu cường ra tay; có thể trích như thoại |
| T · tấn công bằng số | 38–48 % | số tàu / quân, mốc tháng đầu |
| V · tưởng sập mà không sập | 48–75 % | kỳ vọng vài ngày → thực tế một tháng, hai câu cực ngắn; mốc tháng nối tiếp |
| Đ · đảo ngược | 75–88 % | viện binh / kiệt sức / kế hoạch phản tác dụng |
| K · di sản | 88–100 % | thứ còn lại hôm nay, thấy được trên bản đồ |

## 4. Thời lượng & nhịp

| Preset | Thời lượng | Số từ VO |
|---|---|---|
| **Standard** (mặc định) | **84–99 s** | **~225–258** |

Kênh tham khảo đọc ~164 wpm. Không quá ~8 s liền mà trên hình không có gì mới (lesson E3).

## 5. Chuẩn hình ảnh — Style L — Thế Trận

**Phong cách dựng** (khung 0–1 s, 3 s cuối, hình theo từng nhịp kịch bản, kỹ thuật → component, các bước dựng, số đo hình): `03_PHONG-CACH-DUNG.md`. Code: `Style Library/L-siege-atlas/README.md`; khả thi từng kỹ thuật: `Test/History Maps Lore/KHA-THI.md`. Vùng an toàn x 60–940, y 220–1440; QA bằng `--props='{"safeGuide":true}'`.

**Hình ảnh & bản quyền:** tranh public domain (ghi nguồn từng ảnh), ảnh AI tự tạo (khai báo khi trông như thật), dữ liệu bản đồ có giấy phép mở (ghi credit); **không** clip phim, ảnh Google, stock video, video AI cả cảnh.

## 6. Chuẩn âm thanh & giọng

- **Giọng:** Gemini TTS `gemini-3.8-flash-tts`, mặc định **Charon** (giọng / ngôn ngữ thật: [hỏi Lucas]); header ở `episodes/_template/voiceover-header.json`.
- **Nhạc nền** Pixabay `<MusicBed>`; **SFX** thật từ `public/sfx/` (`<Sfx>`), không tự tổng hợp, không tiếng hoạt hình, tối đa 1 tiếng nhấn mỗi nhịp, nhịp lặng không SFX.
- **Master:** −14 LUFS / −1,5 dBTP (kênh tham khảo đo -14.1 LUFS): `npm run render:style -- <id> --to <mp4>`; crf 18.

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
| 5 · Final | `npm run render:style -- <id> --to <mp4>` (4K, −14 LUFS); sheet từ MP4; `npm run studio:compare -- <mp4> --ref "Test/History Maps Lore"` (đọc `SO-SANH.md`: chỗ nào ngoài mục tiêu ở `02_CONG-THUC.md` §4 mà không có lý do); gói đăng; **Lucas xem trên điện thoại, có tiếng** | MP4 + `SO-SANH.md` + `xuat-ban.md` |

Mỗi tập có `checks.md` (pass / fail / unresolved + bằng chứng thật) và `progress.md` (trạng thái, bấm giờ). Tập mới: copy `episodes/_template/` (README trong đó có từng bước).

## 10. Học sau khi đăng

Ghi **24 h · 7 ngày · 30 ngày**: views, % đã xem (so với vuốt đi), thời gian xem TB, % xem TB, likes, comments, shares, follow mới. So theo góc kể, độ dài, biến thể (cột `bien_the`, vd. kiểu hook); dùng trung vị. Đề xuất thử nghiệm; **không tự đổi luật trong file này**, Lucas duyệt.

- Sổ: `<thư mục kênh>/so-lieu.csv` (`npm run studio:stats -- init "<thư mục kênh>"`).
- Mỗi mốc: YouTube Studio → Analytics → Advanced mode → Content → Export CSV → `npm run studio:stats -- import "<Table data.csv>" "<thư mục kênh>" --moc 7d`.
- Báo cáo: `npm run studio:stats -- report "<thư mục kênh>" --moc 30d --ref "Test/History Maps Lore"` → `SO-LIEU.md`.

## 11. Nhật ký tập

| EP | Góc kể | Tiêu đề | Kịch bản | VO | Final | Ngày đăng |
|---|---|---|---|---|---|---|
| mẫu | — | `mau/` (bản demo dựng lúc phân tích) | FINAL | ✓ | ✓ | không đăng |

## 12. Nhật ký quyết định

| Ngày | Quyết định | Người |
|---|---|---|
| 2026-11-02 | Tạo gói format từ phân tích `Test/History Maps Lore`, style `L-siege-atlas`; tên kênh / thị trường chốt sau ở chat mới | Lucas |
| 2026-11-02 | Duyệt mục tiêu đo: kịch bản (`02_CONG-THUC.md` §4: hook ≤ 14 từ / xong trước giây 6, mốc thời gian ≥ 5 / phút, 85–100 s, 150–165 wpm…) và hình + âm thanh (`03_PHONG-CACH-DUNG.md` §5: hình đứng yên ≤ 60 %, nền −8 đến −12 dB dưới giọng, chữ ≥ 48 px, ≤ 2 khối…). Áp dụng từ tập 1; bản demo giữ nguyên | Lucas |
| 2026-11-02 | Tên style / format: **Thế Trận** (thay "Siege Atlas"); thư mục `Formats/Siege Atlas`, `Style Library/L-siege-atlas` và id composition giữ nguyên | Lucas |
