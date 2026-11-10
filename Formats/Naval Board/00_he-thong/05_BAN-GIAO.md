# 05 — BÀN GIAO · Naval Board

*2026-11-08. Đọc file này trước tiên. Người duyệt mọi quyết định là **Lucas** (gọi trợ lý là "Luis", trao đổi bằng tiếng Việt).*

## 0. Dán vào chat mới

```text
Luis ơi, làm tiếp kênh Naval Board. Đọc theo thứ tự: Formats/Naval Board/00_he-thong/05_BAN-GIAO.md
→ 01_FORMAT-BIBLE.md → 02_CONG-THUC.md → 03_PHONG-CACH-DUNG.md → progress.md + checks.md của tập đang làm,
rồi load skill remotion-best-practices. Đừng push lên GitHub khi mình chưa bảo.
```

## 1. Đang ở đâu

| Tập | Trạng thái | Việc còn lại |
|---|---|---|
| ep01-carrier | v4 (12 shot 3D, 10:42), dựng lại ngày 2026-11-08 sau khi bị xoá nhầm | Dòng 15 của kịch bản có thể nói quá (xem cuối `FACTS-submarines.md`); câu nhắc guide đã cắt và render lại 2026-11-09; gói đăng xong 2026-11-09 |
| ep02-submarines | Đã dựng, master, nghe bằng earshot, có gói đăng và 3 thumbnail | Lucas xem và nghe bằng tai; commit |
| ep03-blockade · How a Naval Blockade Wins Without Firing a Shot | Đã duyệt chủ đề, đã tra nguồn (`FACTS-blockade.md`) 2026-11-09 | Lucas quyết có dùng khủng hoảng Hormuz 2026 không; rồi viết kịch bản |

## 2. Các cổng của một tập

Thư mục tập: `Formats/Naval Board/episodes/epNN-<slug>/`. Slug là tên thư mục bỏ phần `epNN-`. Cách tạo xem `episodes/_template/README.md`.

| Cổng | Việc | Lệnh / file | Lucas duyệt |
|---|---|---|---|
| 1 · Chủ đề | Chọn từ `04_KHO-CHU-DE.md` theo công thức §3 | ghi vào đầu FINAL | có |
| 2 · Kịch bản | FINAL theo 7 phần + bảng kiểm chứng | `kich-ban-<slug>-FINAL.md`, `FACTS-<slug>.md` | có |
| 3 · Giọng | Spec khớp từng chữ với FINAL | `node scripts/episode.mjs prep "<tập>"` → `npm run voiceover -- voiceover/<slug>.json` → `node scripts/episode.mjs export "<tập>"` → `PYTHONIOENCODING=utf-8 python -P scripts/words.py <slug> en` | có (nghe giọng) |
| 4 · Shot list | Mỗi shot gắn vào một câu hoặc một chữ | `shots.json` → `node scripts/shotlist.mjs "<tập>"` | có |
| 5 · Dựng | Composition, 3D, SFX, kiểm tra trước render | `03_PHONG-CACH-DUNG.md`; `npm run listen -- <id> --precheck --words src/voiceover/<slug>.words.json --out "<tập>/NGHE.md"` | |
| 6 · Final | Render + master, QA khung hình, cổng nghe | `python -P scripts/naval-final.py <id> "<tập>/<slug>.mp4"` · `python -P scripts/short-qa.py "<mp4>" --shots "<tập>/shots.timeline.json" --out "<tập>/QA.md"` · `npm run listen -- <id> "<mp4>" --words src/voiceover/<slug>.words.json --out "<tập>/NGHE.md"` | xem video |
| 7 · Gói đăng | Tiêu đề, mô tả, hashtag, từ khoá, 3 thumbnail | `xuat-ban.md`; thumbnail theo `02_CONG-THUC.md` §5–6 | có |

Sau mỗi cổng, cập nhật `progress.md` và `checks.md` của tập. Một dòng `fail` được sửa tối đa 3 lần; lần thứ 3 vẫn trượt thì dừng và hỏi Lucas.

## 3. Thời gian đo được (tập 2, máy hiện tại)

| Khâu | Thời gian |
|---|---|
| Blender, 12 clip | 4,0 giờ + 0,7 giờ render lại |
| Render hình (Remotion) | khoảng 17–45 phút tuỳ máy đang bận gì |
| Render tiếng | khoảng 7–10 phút |
| Cổng nghe | khoảng 11 phút |
| Sửa riêng tiếng (`--audio-only`) | khoảng 25 phút tổng |

## 4. Luật cứng

1. **Không push lên GitHub** khi Lucas chưa bảo. Chỉ commit khi Lucas yêu cầu.
2. Key trong `gemini_key.txt` (git-ignored): không in, không log, không commit.
3. Không bịa số liệu, ngày, trích dẫn. Mỗi khẳng định phải có một dòng trong `FACTS-<slug>.md`.
4. Không tắt Blender của Lucas. Chỉ dừng đúng tiến trình render mình đã mở.
5. Trước khi xoá file render, **kiểm tra ngày sửa của từng file**, đừng đoán theo tên. File không đánh số chưa chắc là bản cuối (bài học Carrier, 2026-11-08).
