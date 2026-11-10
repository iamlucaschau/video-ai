# 01 — FORMAT BIBLE · Hoat Su

*Gói format do `npm run studio:format -- new` tạo 2026-11-04 từ phân tích `Test/Squire Explains` (kênh tham khảo: Squire Explains). Người duyệt mọi cổng: **Lucas**. Đây là **nguồn gốc duy nhất** cho luật sản xuất của format; công thức chủ đề + kịch bản ở `02_CONG-THUC.md`, luật hình chi tiết ở `Style Library/M-hoat-su/README.md`.*

**Chưa chốt ở gói này (AI ở chat mới hỏi Lucas, `05_BAN-GIAO.md` §1):** tên kênh, handle, thị trường, ngôn ngữ, giọng, pillar và tỉ lệ, màu nhấn, nhận diện, lịch đăng. Chỗ nào ghi **[hỏi Lucas]** là chờ câu trả lời đó.

---

## 1. Định vị

- **Câu hỏi gốc mỗi video trả lời:** **"Số phận của MỘT người (hoặc một vật) đi ngược luật của thời đó ra sao, và hệ thống phản ứng thế nào? (Short 9:16; video dài: formula-long.json)"**
- **Định dạng:** 9:16, 1080×1920, 30 fps, render 4K; **64–75 s**; không lộ mặt.
- **Thị trường, ngôn ngữ, khán giả:** [hỏi Lucas]. Format học từ kênh Squire Explains (tiếng Anh).
- **Khác kênh tham khảo ở đâu:** `Test/Squire Explains/BAO-CAO.md` §1.5–1.6 và `mau/` (bản demo so với họ).

## 2. Góc kể (từ kênh tham khảo; pillar thật: [hỏi Lucas])

| Góc kể | Tỉ lệ ở kênh tham khảo | Ví dụ của họ (mình tìm góc khác) |
|---|---|---|
| Một người sống sót / quay về ngược ý hệ thống (không chết được, bị báo tử, bị tẩy chay) — trung vị 693K (7 video) | 19 % | Kamikaze 1,78M · 300 Survivor 1,77M · Stranded Pearl Harbor Pilot 884K · 17-Year-Old Marine 693K |
| Một người lừa / vượt luật bằng mẹo (giả trai, giả ngốc, thoát bằng tấn công) — trung vị 461K (4) | 11 % | Disguised as Her Brother 3,78M · Trapped Samurai 651K · Prisoner Pretended to Be an Idiot 272K |
| Người duy nhất / kỷ lục trái khoáy (phi công duy nhất ném bom Mỹ, điệp viên giỏi nhất) — trung vị 129K (12; từ 05/10: 234K) | 32 % | Only Pilot Who Bombed America 828K · Best Spy in the Soviet Union 440K · Golden Gate pilot 327K |
| Luật tàn nhẫn của một thời, kể ngôi thứ hai — trung vị 386K (2) | 5 % | Arrested in Samurai Japan 453K · 5 Samurai Laws 320K |
| Sự vật / mẹo quân sự kỳ quặc, không có nhân vật (trung vị thấp hơn) — trung vị 67K (12; từ 05/10: 102K) | 32 % | Fake Paris 259K · Bombers Over This Mountain 102K · Tunnel Dogs 42K · Fake Army 3,6K |

## 3. Công thức chủ đề + kịch bản

Ở `02_CONG-THUC.md` (bắt buộc đọc trước khi viết kịch bản). Tóm tắt nhịp:

| Nhịp | % thời lượng | Việc |
|---|---|---|
| H · nghịch lý một câu | 0–7 % | kết quả lạ của một người, "this pilot / this soldier / you" |
| B · bối cảnh + luật | 7–25 % | năm, nơi, mệnh lệnh hoặc luật cấm trong 2–3 câu; câu bắc cầu biến luật thành rủi ro |
| L · lật lần 1 | 25–45 % | But / So: nhân vật hành động, hệ thống hiểu sai hoặc trừng phạt |
| T · tệ hơn / lặp | 45–75 % | Even worse / again and again; số lần, thời gian; có thể có 3–4 câu thoại cực ngắn |
| Q · câu hỏi mở lại hoặc bác tin đồn | 75–90 % | câu hỏi người xem đang nghĩ ("so how did the army finally…?") hoặc "videos online say…" rồi sửa |
| K · trớ trêu kết | 90–100 % | một câu đảo hook bằng một con số / một danh hiệu; cắt về frame 0 |

## 4. Thời lượng & nhịp

| Preset | Thời lượng | Số từ VO |
|---|---|---|
| **Standard** (mặc định) | **64–75 s** | **~206–246** |

Kênh tham khảo đọc ~200 wpm. Không quá ~8 s liền mà trên hình không có gì mới (lesson E3).

## 5. Chuẩn hình ảnh — Style Hoạt Sử

**Phong cách dựng** (khung 0–1 s, 3 s cuối, hình theo từng nhịp kịch bản, kỹ thuật → component, các bước dựng, số đo hình): `03_PHONG-CACH-DUNG.md`. Code: `Style Library/M-hoat-su/README.md`; khả thi từng kỹ thuật: `Test/Squire Explains/KHA-THI.md`. Vùng an toàn x 60–940, y 220–1440; QA bằng `--props='{"safeGuide":true}'`.

**Máy quay (Lucas 2026-11-03 D3 + 2026-11-04 C):** khung đứng, đổi cỡ cảnh bằng hard cut; một đẩy chậm ≤ 5 % / 3 s vào bản đồ / giấy; **lia ngang một lần, chậm, ease in-out** ở shot rộng ngoài trời mở ra một nơi mới; shot mở đầu và shot kết không có máy quay (frame cuối = frame 0). Không rung, không zoom giật.

**Nền (Lucas 2026-11-04: **nền code, không dùng ảnh AI**):** nội thất bằng bộ phòng toon-engine, ngoại cảnh bằng `Outside` (kit M, vẽ code). Không viết prompt ảnh AI, không chờ ảnh; cảnh nào chưa có trong kit thì thêm một `OutsideKind` mới vào `ww2.tsx` trước khi dựng.

**Hình ảnh & bản quyền:** tranh public domain (ghi nguồn từng ảnh), ảnh AI tự tạo (khai báo khi trông như thật), dữ liệu bản đồ có giấy phép mở (ghi credit); **không** clip phim, ảnh Google, stock video, video AI cả cảnh.

## 6. Chuẩn âm thanh & giọng

- **Giọng:** Gemini TTS `gemini-3.8-flash-tts`, mặc định **Puck** (giọng của mẫu demo: nam trẻ kể chuyện, ~200 wpm, tempo 1; giọng / ngôn ngữ thật: [hỏi Lucas]); header ở `episodes/_template/voiceover-header.json`.
- **Nhạc nền** `<MusicBed>`, nhạc **tự tạo bằng code** (`python -P scripts/make-music.py m-quirky|m-resolve public/sfx/music/own/<tên>.mp3 --seconds 100`; không ai giữ bản ghi nên Content ID không có gì để khớp). **Không** dùng nhạc Pixabay / Mixkit / thư viện "free" (Lucas 2026-11-04); **SFX** thật từ `public/sfx/` (`<Sfx>`) trước; không có file thật hợp thì tạo bằng code (Lucas 2026-11-04); không tiếng hoạt hình, style M dày hơn mặc định: một tiếng thật cho mỗi hành động thấy được, đặt sau từ (W6); thiếu tiếng thì tải SFX từ Pixabay / Mixkit (Lucas cho phép 2026-11-04; chỉ SFX, không nhạc).
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
| 5 · Final | `npm run render:style -- <id> --to <mp4>` (4K, −14 LUFS); sheet từ MP4; `npm run studio:compare -- <mp4> --ref "Test/Squire Explains"` (đọc `SO-SANH.md`: chỗ nào ngoài mục tiêu ở `02_CONG-THUC.md` §4 mà không có lý do); gói đăng; **Lucas xem trên điện thoại, có tiếng** | MP4 + `SO-SANH.md` + `xuat-ban.md` |

Mỗi tập có `checks.md` (pass / fail / unresolved + bằng chứng thật) và `progress.md` (trạng thái, bấm giờ). Tập mới: copy `episodes/_template/` (README trong đó có từng bước).

## 10. Học sau khi đăng

Ghi **24 h · 7 ngày · 30 ngày**: views, % đã xem (so với vuốt đi), thời gian xem TB, % xem TB, likes, comments, shares, follow mới. So theo góc kể, độ dài, biến thể (cột `bien_the`, vd. kiểu hook); dùng trung vị. Đề xuất thử nghiệm; **không tự đổi luật trong file này**, Lucas duyệt.

- Sổ: `<thư mục kênh>/so-lieu.csv` (`npm run studio:stats -- init "<thư mục kênh>"`).
- Mỗi mốc: YouTube Studio → Analytics → Advanced mode → Content → Export CSV → `npm run studio:stats -- import "<Table data.csv>" "<thư mục kênh>" --moc 7d`.
- Báo cáo: `npm run studio:stats -- report "<thư mục kênh>" --moc 30d --ref "Test/Squire Explains"` → `SO-LIEU.md`.

## 11. Nhật ký tập

| EP | Góc kể | Tiêu đề | Kịch bản | VO | Final | Ngày đăng |
|---|---|---|---|---|---|---|
| mẫu | — | `mau/` (bản demo dựng lúc phân tích) | FINAL | ✓ | ✓ | không đăng |

## 12. Nhật ký quyết định

| Ngày | Quyết định | Người |
|---|---|---|
| 2026-11-03 | D1–D9: style mới M "Hoạt Sử" trên toon-engine · Short trước, video dài sau · camera luật K + đẩy chậm vào bản đồ · nội thất code, ngoại cảnh ảnh AI · nối vòng bằng hình · một font viết tay chỉ trên vật · chiến tranh hiện đại kể trung lập · demo chủ đề họ chưa làm (`Test/Squire Explains/BAO-CAO.md`) | Lucas |
| 2026-11-03 | W1–W10 từ what-if-animation (rig + phòng, storyboard trước, cắt theo từ, kiểm giọng bị che, tiếng nhấn sau từ, mỗi câu là một hình, cột "Cách tính") | Lucas |
| 2026-11-04 | Video mẫu Jack Churchill: v2 + C1–C4 (Lucas tạo 6 ảnh AI, gọi tên Sachsenhausen nhưng không vẽ tù nhân, giữ câu bác tin đồn) | Lucas |
| 2026-11-04 | Camera C (lia một lần ở shot mở cảnh ngoài trời) sau đoạn so sánh A / C / B | Lucas |
| 2026-11-04 | Được tự tải SFX từ thư viện miễn phí khi cần | Lucas |
| 2026-11-04 | Nhạc chỉ tự tạo bằng code (`make-music.py`), bỏ nhạc Pixabay vì Content ID | Lucas |
| 2026-11-04 | **Nền code, không dùng ảnh AI** từ test 2 (Doss) trở đi (thay D5) | Lucas |
| 2026-11-04 | Duyệt video mẫu cuối, tạo gói format từ phân tích `Test/Squire Explains`, style `M-hoat-su`; tên kênh / thị trường chốt sau ở chat mới | Lucas |
