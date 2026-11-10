# progress — m-doss (test 2 của format Hoat Su, style M)

| Cổng | Trạng thái | Ngày |
|---|---|---|
| 1 · Chủ đề (kho chủ đề, 10 / 10: Desmond Doss) | ✓ Lucas duyệt E1 | 2026-11-04 |
| 2 · Kịch bản v1 → đo → v2 → FINAL + kiểm chứng 17 dòng + 4 prompt ảnh AI | ✓ Lucas duyệt v2 + E1–E5 | 2026-11-04 |
| 3 · Giọng (Puck, 7 request, 62,5 s, 204 wpm) | ✓ | 2026-11-04 |
| 4 · Hình: storyboard (3 lượt) → 26 shot → critic (14 lỗi sửa hết) → render 4K | ✓ (nền code) | 2026-11-04 |
| 5 · So với Squire (`SO-SANH.md`, `--force`) | ✓, đứng yên 78 %, 0 chỗ giọng bị che | 2026-11-04 |
| Nền: Lucas chọn nền code, không ảnh AI (thay E2) | ✓ bản 4K hiện tại là bản cuối | 2026-11-04 |
| Nâng cấp nền code (`sets.tsx`), render 4K lại | ✓ đứng yên 61 %, chậm 38 % | 2026-11-04 |
| Nâng cấp N1–N14 (nhoè nền, grade, ánh sáng lên người, tiền cảnh, vân, đầu hạt đậu, chớp mắt, đi, hiệu ứng, crossfade), render 4K lại | ✓ QA không nhảy hình; đứng yên 81 % | 2026-11-04 |
| "Sáng và rực hơn" (Lucas): trời xanh tươi, đất rực hơn, phòng sáng hơn, góc tối nhẹ, grade sáng + bão hoà, nhân vật to hơn ở shot rộng; render 4K | ✓ độ sáng trung bình 0,41 (Squire 0,50), QA không nhảy hình | 2026-11-04 |
| Lucas xem video: giữ độ sáng hiện tại, không làm sáng thêm phòng | ✓ | 2026-11-04 |
| Bỏ nhạc Pixabay (Content ID): nhạc tự tạo `own/m-resolve.mp3` (`make-music.py m-resolve`), chỉ làm lại tiếng (`--audio-only`) | ✓ −14,1 LUFS, −2,9 dBTP; **Lucas nghe bài mới** | 2026-11-04 |
| Nhân vật thân dày có khối (Lucas duyệt, áp dụng): tay áo, ống quần, ủng, đổ bóng, má hồng, mũ sắt có bóng; lính phụ khác dáng / râu (`vary`), Doss / Truman giữ mặt thật; render 4K | ✓ −14,1 LUFS, −3,0 dBTP; QA không nhảy hình, không khung đen | 2026-11-04 |

**File:** `Video.tsx` (composition `Style-M-HoatSu-Doss`), `../ww2.tsx` (thêm `gi`, `suitGrey`, `M1Helmet`, `MedicKit`, `Medals`, `Litter`, `Gunfire`, `CargoNet`, `HeightMark`, `Specs`, ngoại cảnh `jungle` / `ridge` / `cliff` / `night`), `shots.json` → `shots.timeline.json`, `m-doss.mp4` (git-ignored), `vo.mp3`, `SO-SANH.md`, `checks.md`.

**Bước tiếp:** Lucas nghe nhạc mới `m-resolve` và xem nhân vật thân dày trong bản 4K; chưa commit.
