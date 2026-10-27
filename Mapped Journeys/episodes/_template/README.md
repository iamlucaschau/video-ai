# Mẫu tập — Mapped Journeys (style J)

Bắt đầu một tập mới từ thư mục này. Luật: `../../00_he-thong/01_CHANNEL-BIBLE.md`. Tập mẫu đầy đủ: Ep01 `Style Library/J-satellite-journey/j-aeneas-full/`.

## 1. Tạo thư mục tập

1. Copy `_template/` thành `Mapped Journeys/episodes/epNN-<slug>/` (vd. `ep02-magellan`). **Slug = tên thư mục bỏ `epNN-`** (`episode.mjs` tự tính); dùng chữ thường, gạch nối.
2. Đổi tên file: `kich-ban-SLUG-FINAL.md` → `kich-ban-<slug>-FINAL.md`, `01_EPISODE-SPEC_SLUG.md` → `01_EPISODE-SPEC_<slug>.md`.
3. Copy `voiceover-header.json` thành `voiceover/<slug>.json` và sửa `name` + dòng `style` (thay "[the quiet beat]"). **Làm bước này trước `prep`**: nếu không có file, `prep` dùng giọng mặc định của series Poor vs Rich (Orus, giọng "money lesson").

## 2. Theo 5 cổng (Bible §9)

| Cổng | Việc | Lệnh / file |
|---|---|---|
| 1 · Chủ đề | Hook + 2 con số đối lập ("lẽ ra" vs thật) | ghi vào đầu FINAL |
| 2 · Kịch bản | Điền FINAL theo công thức 8 nhịp, bảng kiểm chứng, kế hoạch hình, bảng nguồn ảnh, bản dịch VN | `kich-ban-<slug>-FINAL.md` |
| 3 · Giọng | Spec: mỗi `## SCENE n` có ngay dòng sau là `- **VO:** "..."`, khớp **từng chữ** với FINAL | `node scripts/episode.mjs prep "Mapped Journeys/episodes/epNN-<slug>"` → `npm run voiceover -- voiceover/<slug>.json` → `node scripts/episode.mjs export "Mapped Journeys/episodes/epNN-<slug>"` → `PYTHONIOENCODING=utf-8 python -P scripts/words.py <slug> en` |
| 4 · Test | Tấm bản đồ, tranh, composition, stills có `safeGuide` | xem mục 3 dưới đây |
| 5 · Final | Render + master + kiểm âm lượng; gói đăng | `npm run render:j -- <CompositionId> --to "Mapped Journeys/episodes/epNN-<slug>/<slug>.mp4"`; điền `xuat-ban.md` |

## 3. Dựng video (Cổng 4)

1. **Tấm bản đồ:** `python -P scripts/make-plates.py` (cách dùng ở đầu script) → `public/images/<slug>/map/` + `plates.json`. Thô trước, nét sau (world → vùng → chi tiết).
   - ⚠ Kit chưa xử lý tuyến cắt **kinh tuyến 180°** và vùng **gần cực** (> ~75°). Tập đi qua đó phải nâng cấp kit trước (`03_DANH-GIA-NANG-CAP.md` B1, C2).
2. **Tranh:** tải bản public domain, cắt 4:3 → `public/images/<slug>/<stop>.jpg`; ghi nguồn vào FINAL. Ảnh AI toàn khung 1080×1920 → `full-*.jpg`.
3. **Code:** copy `Style Library/J-satellite-journey/j-aeneas-full/Video.tsx` vào thư mục tập, rồi thay:
   - import manifest / timing / words: `src/voiceover/<slug>.json`, `.timing.json`, `.words.json`;
   - `P` (toạ độ điểm dừng), `LEGS` (chặng + waypoint trên biển), `DIRECT` (đường "lẽ ra"), `SAIL`, `KEYS` (cú bay camera), `CAPTIONS`, `SFX`, cards, chữ khoá;
   - đường dẫn ảnh `images/<slug>/…`, nhạc `PILLAR_MUSIC.<pillar>` (Bible §2);
   - tên export (`<Name>`, `<name>Duration`).
   Mọi mốc gắn vào chữ trong giọng đọc: `at(id)`, `end(id)`, `w(id, k)`.
4. **Đăng ký** composition trong `src/Root.tsx` (cạnh `Style-J-SatelliteJourney-AeneasFull`), id `MJ-epNN-<slug>`.
5. **QA:** `npx remotion bundle --out-dir out/bundle`, rồi `npx remotion still out/bundle <id> out/check.png --frame=<n> --props='{"safeGuide":true}'` ở **mỗi điểm dừng**. Kiểm: tuyến không cắt đất liền, thẻ không che nhãn / ghim, dây nối nằm trong khung, chữ không chạm vùng đỏ.
6. `npm run lint`.

## Files trong mẫu

| File | Việc |
|---|---|
| `kich-ban-SLUG-FINAL.md` | Kịch bản khoá (VO tiếng Anh, bản dịch, kiểm chứng, kế hoạch hình, nguồn ảnh) |
| `01_EPISODE-SPEC_SLUG.md` | VO theo cảnh (cho `prep`) + mô tả hình |
| `voiceover-header.json` | Giọng / nhịp chuẩn của kênh, copy sang `voiceover/<slug>.json` |
| `xuat-ban.md` | Gói đăng: tiêu đề, mô tả + nguồn, hashtag, bình luận ghim, caption |
