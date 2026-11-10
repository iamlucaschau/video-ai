# Quy trình phân tích phong cách + nội dung mới

*Lucas chốt 2026-11-01. Áp dụng mỗi khi Lucas đưa video mẫu / video đối thủ để học một style hoặc một kênh mới. Mẫu đã làm: style J (`Test/doi-thu/BAO-CAO.md`, `BOC-TACH-KICH-BAN.md`, `BOC-TACH-HINH.md`). 4 giai đoạn; cuối mỗi giai đoạn Lucas duyệt rồi mới làm tiếp.*

**Lucas đưa:** video vào `Test/<thư-mục>/` (git-ignored), link YouTube / TikTok của từng video, một câu về chủ đề kênh. File làm việc (khung hình, transcript, số đo) để trong `Test/<thư-mục>/_work/` hoặc `out/` (không vào git).

---

## Giai đoạn 1 — Phân tích (chưa viết code)

Đầu ra: `Test/<thư-mục>/BAO-CAO.md` (mục 1.1–1.6) + `BOC-TACH-KICH-BAN.md` (1.4) + `BOC-TACH-HINH.md` (1.3).

**Bước đầu (Studio P1, 2026-11-01):** `npm run studio:ingest -- <url-kênh | url-video | Test/<thư-mục>>` tự làm phần đo của 1.1, 1.2 và khung bảng shot 1.3 (điểm cắt, sheet 0–1 s / 3 s cuối / mỗi giây, transcript có thời gian) → `Test/<thư-mục>/INGEST.md` + `_work/`. Các lệnh tay bên dưới giữ lại để kiểm hoặc đo thêm. Cách dùng: `studio/README.md` §3.

**Card + khả thi (Studio P2, 2026-11-01):** sau ingest, `npm run studio:cards -- init Test/<thư-mục>` tạo `style-card.json`, `formula.json` và mẫu báo cáo. Mỗi kỹ thuật T# nhận một mức 🟢🟡🟠🔴 (`studio/KHA-THI.md`); công cụ 🟠 ghi vào card, Lucas duyệt rồi mới cài. Cuối Giai đoạn 1 chạy `npm run studio:cards -- check Test/<thư-mục>` (phải ✓ cả hai card) → `KHA-THI.md` đi kèm báo cáo cho Lucas duyệt.

### 1.1 Số liệu video + vị trí trong kênh *(bổ sung 2026-11-01)*

Mỗi video một dòng; ghi **ngày lấy số** vì số liệu thay đổi.

| Cột | Lấy từ đâu |
|---|---|
| Kênh, số subscriber, tổng số video của kênh | trang kênh |
| Ngày đăng, tuổi video (ngày) | trang video |
| Views, likes, comments; **like / view**, **comment / view**, **views / ngày** | trang video |
| **Vị trí trong kênh:** hạng của video theo views trong kênh (vd. "#3 / 48"), so với **trung vị views** của kênh (vd. "×6,2 trung vị"), là video thứ mấy kể từ khi kênh mở, cùng series / chủ đề với video nào | danh sách video của kênh (sắp theo "Phổ biến nhất" + theo thời gian) |
| Bản ngôn ngữ khác / đăng lại ở nền tảng khác (nếu có) | kênh, TikTok |

**Cách lấy số, theo thứ tự ưu tiên:**
1. **yt-dlp** (cài 2026-11-01 bằng `pip install --user`; không có trên PATH nên gọi `python -m yt_dlp`):
   - Video: `python -m yt_dlp --skip-download --print "%(title)s | %(upload_date)s | views %(view_count)s | likes %(like_count)s | comments %(comment_count)s | subs %(channel_follower_count)s | %(duration)ss | %(channel_url)s" "<url>"`
   - Cả kênh (xếp hạng + trung vị): `python -m yt_dlp --flat-playlist --print "%(id)s %(view_count)s" "<channel_url>/shorts"` (thêm `/videos` nếu kênh có video dài). Views ở chế độ này **đã làm tròn** (4,2M thay vì 4.260.463): đủ để xếp hạng, còn số chính xác lấy từ lệnh video.
   - Đã thử 2026-11-01 với V01 Odysseus (Guilherme Video Editor): 4.260.463 views, kênh 4.530 sub, **#1 / 6 Shorts, ×73 trung vị**.
2. Đọc trang công khai bằng trình duyệt hoặc web-fetch.
3. Lucas chụp màn hình YouTube Studio / trang kênh.

**Kết luận phải trả lời được:** video này là **hit hay bình thường** của kênh đó? Nếu nó hơn trung vị nhiều lần, hỏi vì sao (chủ đề, hook, thời điểm). Không học theo một video ăn may.

### 1.2 Đo kỹ thuật

- `ffprobe`: thời lượng, độ phân giải, fps, bitrate.
- Độ to: `ffmpeg -i <v> -af ebur128=peak=true -f null -` → LUFS, true peak, LRA.
- Điểm cắt cảnh: `ffmpeg -i <v> -vf "select='gt(scene,0.3)',showinfo" -f null -` → `_work/<V>.cuts.txt`. Khung đứng yên: `freezedetect` → `_work/<V>.freeze.txt`.
- Lời đọc: caption tải kèm (`*_CAPTION.txt`) hoặc Whisper → transcript có thời gian từng câu → **wpm**, tỉ lệ thời gian có lời / tổng thời lượng.
- Phụ đề (có / không, cỡ, font, số từ mỗi lần hiện), chữ trên màn hình, máy quay (đứng yên / bay / zoom / motion blur).
- **Hình: 7 mảng đo bằng số** *(bổ sung 2026-11-04, từ claude-animated-shorts N12; Lucas duyệt)*: mỗi mảng một bảng số, không tả bằng tính từ, đo trên ≥ 20 khung rải đều (che dải phụ đề trước khi đo):
  1. **Chuyển động**: % khung có máy quay động, tốc độ đỉnh (px / frame), thời gian một cú trượt, nhún khi đi (% chiều cao), số frame một bước, chớp mắt (khoảng cách, số frame).
  2. **Chiều sâu**: % thời lượng có nền nhoè, độ nhoè nền theo cỡ cảnh (px trên khung 1080), % khung có vật tiền cảnh, sương / màu chân trời so với vật gần.
  3. **Chất liệu**: bề mặt nào có vân (gỗ, đá, vữa, ngói, cỏ), độ tương phản vân.
  4. **Nhân vật**: tỉ lệ đầu (cao / rộng), số đầu-chiều-cao, màu và độ dày viền, số biểu cảm, mặt sáng bao nhiêu (V).
  5. **Ánh sáng**: hướng nắng so với camera, tỉ lệ bóng / sáng trên cùng bề mặt, màu bóng (ngày / hoàng hôn / đêm), bóng chân.
  6. **Viền**: viền trên cảnh có không, dày bao nhiêu px, đổi theo khoảng cách không, màu.
  7. **Màu (grade)**: độ sáng trung vị, p2 / p98, độ bão hoà, màu vùng tối.
  So hình của mình với họ bằng `scripts/sbs-sheet.py` (mình trên, họ dưới).
- **Nhãn cho mọi số đo** *(bổ sung 2026-11-01)*: **ĐO** (đọc từ lệnh / file: ffprobe, ebur128, Whisper, đếm khung), **ƯỚC** (nhìn bằng mắt trên khung: cỡ chữ, vị trí, kiểu máy quay), **QUYẾT** (lựa chọn của mình cho bản của mình). Mỗi giá trị **ƯỚC** ghi kèm frame / timestamp cần kiểm lại; không xây tiếp lên một giá trị ƯỚC trước khi đo lại.

### 1.3 Bảng shot-by-shot có timestamp *(bổ sung 2026-11-01)*

Lấy các điểm cắt ở 1.2 làm ranh giới shot; mỗi shot một dòng:

| # | Vào–ra (s) | Dài (s) | Hình (nhìn thấy gì) | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | Kỹ thuật (mã T#) |
|---|---|---|---|---|---|---|---|---|

- Khung minh hoạ: `npm run sheet:j -- --video "<v>.mp4" --every 1 --to <thời lượng> --name <V>-1s` (1 khung / giây).
- **Khung 0–1 s** (cái người xem thấy trước khi quyết định lướt): `npm run sheet:j -- --video "<v>.mp4" --from 0 --to 1 --every 0.2 --name <V>-open` → 6 khung. Ghi rõ **khung đầu tiên có gì** (chữ? mặt? bản đồ? chuyển động?), chữ / số xuất hiện ở frame nào, lời đọc bắt đầu ở mili-giây nào.
- **3 s cuối** (giữ chân tới hết / nối vòng): `npm run sheet:j -- --video "<v>.mp4" --from <thời lượng − 3> --to <thời lượng> --every 0.5 --name <V>-end` → 7 khung. Ghi: kết bằng câu chốt, CTA, màn hình đen, hay **nối vòng** về khung đầu (so khung cuối với khung 0).
- Đặt 2 dải khung này ngay đầu `BOC-TACH-HINH.md` cho từng video; tổng hợp: thời lượng shot trung bình, shot dài nhất / ngắn nhất, số shot trong 3 s đầu.
- Ranh giới shot lấy từ dò cắt là **ĐO**; chỗ crossfade máy dò không bắt (ranh giới đọc từ khung 1 s) là **ƯỚC ±0,5 s**: ghi rõ trong bảng.

### 1.4 Kịch bản: trích nguyên văn câu then chốt + kiểm chứng số liệu *(bổ sung 2026-11-01)*

- **Trích nguyên văn** (ngôn ngữ gốc, kèm timestamp) **chỉ 3 câu**: **hook**, **câu bắc cầu**, **câu kết**. Mỗi câu trích tối đa ~15 từ; dài hơn thì cắt bằng "…". Kèm bản dịch tiếng Việt ngay dưới.
- **Phần còn lại** của kịch bản: tóm tắt theo nhịp bằng lời của mình (không chép, không dịch trọn), như `BOC-TACH-KICH-BAN.md`.
- **Bảng kiểm chứng số liệu trong lời đọc**: mọi con số / mốc thời gian / khoảng cách / khẳng định lịch sử mà video nói ra:

| # | Timestamp | Video nói | Kiểm với nguồn | Kết quả | Ghi chú |
|---|---|---|---|---|---|
| 1 | 0:03 | "…10 years…" | *Odyssey* / Britannica | ✓ đúng · ≈ gần đúng · ✗ sai · ? không kiểm được | vd. tự mâu thuẫn với câu ở 1:58 |

  Nguồn theo luật Bible §8 của kênh liên quan (văn bản gốc, Britannica, bảo tàng, sách học thuật; con số tranh cãi ≥ 2 nguồn). Transcript, bình luận và video đối thủ **không phải nguồn**. Mục đích: biết lỗi của đối thủ để mình không lặp lại, và chọn con số "lẽ ra" / "thật" của mình cho chuẩn.

### 1.5 Đối chiếu với luật của mình

Bảng "đối thủ làm gì ↔ luật của mình (`AGENTS.md`, `Style Library/README.md` §2) ↔ đề xuất". Mỗi chỗ khác luật → một **quyết định cho Lucas chốt**, kèm phương án thay thế (vd. style J: clip phim → tranh public domain + ảnh AI).

### 1.6 Kết luận

Điểm mạnh nên học (xếp theo mức tác động), điểm yếu / lỗi của đối thủ, vị trí của mình so với họ (khác ở đâu người xem nhận ra được).

**Lucas duyệt:** ngôn ngữ, các ngoại lệ (chỉ cho style mới, không đụng style cũ), nguồn hình ảnh.

---

## Giai đoạn 2 — Dựng style + bản test

1. `Style Library/<chữ cái tiếp theo>-<tên>/`: `README.md` (look, mạnh / yếu, luật riêng, bảng code), kit component, `ref.jpg`. Tạo khung bằng `npm run studio:kit -- new <X>-<tên> --from Test/<thư-mục>` (từ card của Giai đoạn 1); các bước theo `studio/KIT-CONTRACT.md` §5; kết thúc bằng `npm run studio:kit -- check` ✓.
2. Bản test 20–30 s, đăng ký trong `src/Root.tsx`.
3. QA: `npm run lint`; stills `safeGuide`; contact sheet (`review-loop` skill).
4. Thêm style vào `Style Library/README.md` §1 (mục lục) và §3 (bảng chọn).

**Lucas duyệt:** bản test.

## Giai đoạn 3 — Video mẫu đầy đủ

1. Kịch bản v1 + bảng kiểm chứng + kế hoạch hình + bản dịch VN.
2. So v1 với kịch bản đối thủ (dùng 1.3–1.4) → v2 → Lucas duyệt → FINAL.
3. Giọng: `episode.mjs prep` → `npm run voiceover` → `export` → `words.py`; mọi mốc hình gắn vào chữ.
4. Dựng hình (nền, tranh, ảnh AI theo prompt cho Lucas tạo, chữ khoá); âm thanh (nhạc, SFX thật, master −14 LUFS).
5. QA stills + contact sheet, render bản cuối.

**Lucas duyệt:** video cuối.

## Giai đoạn 4 — Đóng gói FORMAT (Lucas 2026-11-02)

Gói sản xuất là **gói format**, không phải gói kênh: công thức chủ đề · tiêu đề · kịch bản + mục tiêu đo (`02_CONG-THUC.md`), **phong cách dựng** rút từ bóc tách khung hình: hình theo từng nhịp, kỹ thuật → component, các bước dựng, số đo hình (`03_PHONG-CACH-DUNG.md`), Format Bible (chuẩn hình / tiếng, luật nguồn, 5 cổng), kho chủ đề theo góc kể, mẫu tập, **kịch bản + video demo dựng ở Giai đoạn 3** (`mau/`), bàn giao. **Tên kênh, handle, thị trường, ngôn ngữ, pillar, nhận diện không quyết ở đây:** bàn giao có danh sách câu hỏi để AI ở chat mới hỏi Lucas.

**Studio P4:** `npm run studio:format -- new "<Tên format>" --style <X-tên> --from Test/<thư-mục> --sample "<thư mục bản test>"` → `Formats/<Tên format>/`, điền sẵn từ card và `_work/ingest.json` (nhịp %, hook / bắc cầu / kết, mẹo, lỗi của đối thủ, bảng số đo của họ); Luis viết phần chủ đề, tiêu đề, hình theo nhịp, các bước dựng, cột mục tiêu, kho chủ đề; Lucas duyệt. Xuất khi Lucas bảo: `npm run studio:format -- export "Formats/<Tên format>" --to "<thư mục mới>" --install` → dự án đứng riêng (có git, chưa remote, kèm video demo).

---

## Luật cứng xuyên suốt

- Không chép / dịch trọn kịch bản đối thủ; nguyên văn chỉ 3 câu then chốt ở 1.4, mỗi câu ~15 từ.
- Video, khung hình, transcript, caption của bên thứ ba **không vào git**.
- Ngoại lệ luật chỉ áp cho style mới.
- Không push khi Lucas chưa bảo; commit khi Lucas yêu cầu.
