# Mẫu tập — Naval Board

Tập mới bắt đầu từ thư mục này. Luật và công thức nằm ở `../../00_he-thong/`; các cổng và lệnh nằm ở `05_BAN-GIAO.md` §2. Tập mẫu đầy đủ nhất là `../ep02-submarines/`.

## 1. Tạo thư mục tập

1. Copy `_template/` thành `episodes/epNN-<slug>/`. **Slug là tên thư mục bỏ phần `epNN-`** (`episode.mjs` tự tính), viết chữ thường, nối bằng gạch ngang.
2. Đổi tên mọi file có `SLUG` thành slug thật (`kich-ban-<slug>-FINAL.md`, `01_EPISODE-SPEC_<slug>.md`, `FACTS-<slug>.md`).
3. Copy `voiceover-header.json` thành `voiceover/<slug>.json` và sửa `name`. **Làm bước này trước `prep`.**
4. Sau mỗi cổng, cập nhật `progress.md` và `checks.md`. Phiên mới đọc hai file này trước.

## 2. Dựng (cổng 5)

1. Code: tạo `src/compositions/<Name>/` (copy cách làm của `Submarines/`): `<Name>.tsx` đọc `src/voiceover/<slug>.timing.json`, `.words.json` và `shots.json` / `shots.timeline.json` của thư mục tập. Mọi mốc hình và tiếng dùng `A(id)`, `E(id)`, `W(id, "word")`.
2. Đăng ký composition trong `src/Root.tsx`, đặt id là `<Name>-<Tên ngắn>`.
3. Shot 3D: viết script Blender như `scripts/blender/sub3d.py`, xem bản `preview` trước, rồi so các khung liền nhau.
4. Đặt xong SFX thì chạy `--precheck` (`05_BAN-GIAO.md` §2) và sửa các tiếng nhấn rơi trên chữ.
5. Xem stills hoặc contact sheet (skill `review-loop`), rồi `npm run lint`.
6. Thumbnail: composition `<Name>-Thumbnail` như `src/compositions/Submarines/Thumbnail.tsx`.
