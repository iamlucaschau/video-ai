# Mẫu tập — {{NAME}} (style {{STYLE_TITLE}})

Bắt đầu một tập mới từ thư mục này. Luật: `../../00_he-thong/01_CHANNEL-BIBLE.md`. Video mẫu của style: `Style Library/{{STYLE}}/` (thư mục test có `Video.tsx`).

## 1. Tạo thư mục tập

1. Copy `_template/` thành `{{CHANNEL_DIR}}/episodes/epNN-<slug>/`. **Slug = tên thư mục bỏ `epNN-`** (`episode.mjs` tự tính); chữ thường, gạch nối.
2. Đổi tên `kich-ban-SLUG-FINAL.md` → `kich-ban-<slug>-FINAL.md`, `01_EPISODE-SPEC_SLUG.md` → `01_EPISODE-SPEC_<slug>.md`.
3. Copy `voiceover-header.json` thành `voiceover/<slug>.json`, sửa `name`. **Làm trước `prep`** (không có file thì `prep` dùng giọng mặc định của series khác).
4. `progress.md` + `checks.md`: cập nhật sau mỗi cổng; phiên mới đọc hai file này trước.

## 2. Năm cổng (Bible §9)

| Cổng | Việc | Lệnh / file |
|---|---|---|
| 1 · Chủ đề | Hook + con số chính, từ `03_KHO-CHU-DE.md` | ghi vào đầu FINAL |
| 2 · Kịch bản | FINAL theo công thức Bible §3, kiểm chứng, kế hoạch hình, bản dịch VN | `kich-ban-<slug>-FINAL.md` |
| 3 · Giọng | Spec khớp **từng chữ** với FINAL | `node scripts/episode.mjs prep "{{CHANNEL_DIR}}/episodes/epNN-<slug>"` → `npm run voiceover -- voiceover/<slug>.json` → `node scripts/episode.mjs export "{{CHANNEL_DIR}}/episodes/epNN-<slug>"` → `PYTHONIOENCODING=utf-8 python -P scripts/words.py <slug> <lang>` |
| 4 · Test | Tài sản hình, composition, stills `safeGuide`, `review-loop` | mục 3 |
| 5 · Final | Render + master + kiểm âm lượng; gói đăng | `npm run render:style -- <id> --to "{{CHANNEL_DIR}}/episodes/epNN-<slug>/<slug>.mp4"`; `xuat-ban.md` |

## 3. Dựng video (Cổng 4)

1. Tài sản: ảnh public domain / ảnh AI (2160×3840 cho toàn khung) → `public/images/<slug>/`; ghi nguồn vào FINAL.
2. Code: copy `Video.tsx` của video mẫu style vào thư mục tập, đổi import manifest / timing / words sang `src/voiceover/<slug>.*`, đổi dữ liệu và chữ; mọi mốc gắn vào chữ trong giọng đọc (`at(id)`, `end(id)`, `w(id, k)`).
3. Đăng ký composition trong `src/Root.tsx`, id `{{ID_PREFIX}}-epNN-<slug>`.
4. QA: skill `review-loop` (`npm run sheet -- <id> --slug <slug>`, critic mắt mới, sửa 3 lỗi tệ nhất mỗi vòng). Ghi vào `checks.md`.
5. `npm run lint`.
