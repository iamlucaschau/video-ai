# m-doss-3d: tiến độ

Lucas (2026-11-04): "video không đạt … dùng Three.js qua @remotion/three … dựng lại toàn bộ video tập m-doss".

**Cách làm:** thế giới là cảnh three.js (phòng, rừng Guam, vách Hacksaw, đỉnh đồi, chiến trường đêm, Nhà Trắng), quay bằng máy quay 3D thật; nhân vật vẫn là rig 2D thân dày (Lucas vừa duyệt), đặt vào cảnh bằng cách chiếu chân qua cùng máy quay (`three/kit3d.tsx` `place`). Đây là kiểu "nhân vật 2D trong thế giới 3D" của Squire và của `reference/claude-animated-shorts` (MIT). Giữ nguyên kịch bản, giọng, nhịp cắt (`../m-doss/shots.timeline.json`), nhạc tự tạo `m-resolve`, SFX. Luật camera C giữ: khung đứng + cắt thẳng; 3 shot mở nơi mới (S8, S12, S18) lướt máy 1 lần (dolly chậm, có thị sai thật). S11 (bản đồ) để phẳng 2D.

| Bước | Kết quả | Ngày |
|---|---|---|
| Cài `@remotion/three` 4.0.532, `three` 0.187.0, `@react-three/fiber` 9.8.2, `@types/three` (Lucas bảo dùng) | ✓ render được cả mặc định lẫn `--gl=angle` | 2026-11-04 |
| Bộ 3D: chất liệu toon 3 tông, viền mực (nét cạnh + viền ngoài), trời, sương, 4 kiểu sáng, vân bề mặt liền mạch, `shotCam` (đặt máy theo cỡ người) | ✓ `three/kit3d.tsx`, `three/sets3d.tsx`, `three/stage.tsx` | 2026-11-04 |
| 10 bối cảnh 3D cho tập | ✓ `three/doss-sets.tsx` | 2026-11-04 |
| 26 shot dựng lại (`Video.tsx`, composition `Style-M-HoatSu-Doss3D`) | ✓ storyboard 3 lượt: sửa khung quá gần, người lọt khung (khung dọc chỉ thấy ~3,6 m ngang ở 9 m), trần nhà, đá sát máy, khói thành khối đá, đầu Doss ở S17 | 2026-11-04 |
| Render 4K (`render:style`, `--concurrency=3 --timeout=180000`; lần đầu hết giờ chờ lấy khung vì 3D nặng) | ✓ `m-doss-3d.mp4` 2160×3840, 1876 khung, 62,6 s, −14,1 LUFS, −3,0 dBTP | 2026-11-04 |
| QA khung (`QA.md`) | ✓ không khung đen, không nhảy hình; khung trắng f128 (S4) và f1149 (lựu đạn S18) là chớp có chủ ý; đứng 0,4 s cuối là giữ khung kết | 2026-11-04 |
| Lucas xem | ✓ "Đạt, giữ bản 3D": bản 3D thay bản 2D làm bản chính của tập | 2026-11-04 |

**Bước tiếp:** chưa commit; nhạc `m-resolve` chờ Lucas nghe.
