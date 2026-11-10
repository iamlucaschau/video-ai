# Gói kênh · Naval Board

*Kênh giải thích tác chiến hải quân, video dài 16:9 bằng tiếng Anh. Tên kênh do Lucas chốt ngày 2026-11-06. Gói được đóng ngày 2026-11-08 từ hai tập thử đầu; trước đó các tập nằm ở `Test/carrier` và `Test/submarines`.*

| | |
|---|---|
| Bàn giao (phiên mới đọc trước) | [`00_he-thong/05_BAN-GIAO.md`](00_he-thong/05_BAN-GIAO.md) |
| Luật kênh | [`00_he-thong/01_FORMAT-BIBLE.md`](00_he-thong/01_FORMAT-BIBLE.md) |
| **Công thức kịch bản, tiêu đề, thumbnail** | [`00_he-thong/02_CONG-THUC.md`](00_he-thong/02_CONG-THUC.md) |
| **Phong cách dựng** (2D sa bàn, 3D Blender, âm thanh) | [`00_he-thong/03_PHONG-CACH-DUNG.md`](00_he-thong/03_PHONG-CACH-DUNG.md) |
| Kho chủ đề | [`00_he-thong/04_KHO-CHU-DE.md`](00_he-thong/04_KHO-CHU-DE.md) |
| Mẫu tập | [`episodes/_template/`](episodes/_template/) |
| Tập 1 · How an Aircraft Carrier Defends Itself | [`episodes/ep01-carrier/`](episodes/ep01-carrier/) |
| Tập 2 · How Submarines Fight What They Can't See | [`episodes/ep02-submarines/`](episodes/ep02-submarines/) |

Code dựng không nằm trong gói vì Remotion cần nó trong `src/`:

| Phần | Chỗ |
|---|---|
| Kit dùng chung | `src/compositions/Ambush/kit.tsx`, `src/compositions/Carrier/navkit.tsx`, `src/compositions/Submarines/subkit.tsx` |
| Tập 1 | `src/compositions/Carrier/`, composition `Carrier-HowACarrierDefends` |
| Tập 2 | `src/compositions/Submarines/`, composition `Submarines-HowTheyFight`, `Submarines-Thumbnail` |
| 3D, bản đồ, âm thanh | `scripts/blender/carrier3d.py`, `scripts/blender/sub3d.py`, `scripts/carrier-maps.mjs`, `scripts/submarine-maps.mjs`, `scripts/make-sfx-carrier.py`, `scripts/make-sfx-sub.py`, `scripts/make-music.py` |
| Render + master | `scripts/naval-final.py` |

Video, `vo.mp3` của tập và clip 3D (`public/video/<slug>/`) không vào git. Dựng lại được từ code.
