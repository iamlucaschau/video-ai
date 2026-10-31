# 05 — SFX CẦN TẢI · Mapped Journeys

*2026-10-30. Theo luật SFX mới (Bible §6) và đo đối thủ (`03_DANH-GIA-NANG-CAP.md` §F). Pixabay chặn tải tự động (Cloudflare), kể cả từ trình duyệt của Claude; Luis không vượt CAPTCHA.*

## ✅ Đã tải từ Mixkit (Lucas cho phép, 2026-10-30)

Luis tải **44 file** bằng `node scripts/fetch-sfx.mjs` (bản preview MP3 đủ độ dài từ `assets.mixkit.co`), đo LUFS / độ dài, ghi vào `public/sfx/catalog.json` (nguồn = trang tải của từng file, tác giả "Mixkit"). Giấy phép: Mixkit Sound Effects Free License, dùng thương mại trong video, không cần ghi nguồn, không phân phối lại file gốc (thư mục `public/sfx/**` không vào git). Trang giấy phép tải bằng JavaScript nên Luis chỉ đọc được phần mô tả; Lucas mở `mixkit.co/license/#sfxFree` xem toàn văn một lần.

| Nhóm | Có | Ghi chú |
|---|---|---|
| `tick` | 7 | 3 glitch + 4 tiếng máy chữ (hợp nhãn giải mã) |
| `pop` | 6 | 3 swoosh ngắn + 2 lật giấy + 1 sweep |
| `swish` | 4 | |
| `pen` | 4 | "Short pencil writing", "Fast writing" rất nhỏ (−34 đến −36 LUFS), `Sfx` tự bù |
| `ping` | 3 | 2 chime lật trang + 1 interface |
| `hit` | 4 | trống điện ảnh 4–5,6 s |
| `riser` | 3 | 2 file có 0,6 s im lặng đầu (bình thường với riser) |
| `deephit` | 2 | |
| `amb-sea` · `amb-wind` · `amb-air` · `amb-army` · `amb-ship` | 2 · 3 · 2 · 2 · 1 | Dài 9–152 s; "Big army crowd marching" chỉ 8,7 s, phải lặp |
| `water` | 1 | |

**Mixkit không có:** tiếng voi thật (`animal`) và ambience thành cổ / đám đông xa (`amb-city`; chỉ có đám đông hiện đại). Hai nhóm này bỏ qua hoặc Lucas tải tay từ Pixabay khi vào được.

Catalog đã xoá 25 mục trỏ tới file đã mất từ dự án cũ (131 → 106 mục).

## Cách tải và gửi cho Luis

1. Nguồn: **Pixabay** (`pixabay.com/sound-effects/search/<từ khoá>/`) hoặc **Mixkit** (`mixkit.co/free-sound-effects/`). Cả hai cho dùng thương mại trong video, không cần ghi nguồn. **Không** dùng nguồn khác khi chưa kiểm giấy phép.
2. Lưu file **MP3 giữ nguyên tên gốc** (tên Pixabay có số id, Luis dùng nó để ghi nguồn) vào `public/sfx/_inbox/<nhóm>/`, ví dụ `public/sfx/_inbox/tick/digital-glitch-123456.mp3`. Thư mục `public/sfx/**` không vào git (giấy phép cấm phân phối lại file gốc).
3. Báo Luis. Luis nghe thử bằng số đo (độ dài, LUFS, đỉnh), chuyển vào `public/sfx/<nhóm>/` và ghi vào `catalog.json` (có link nguồn).

**Chọn tiếng thế nào:** ngắn, sạch, không nhạc lẫn vào, không giọng người, không tiếng hoạt hình (boing, cartoon pop). Nghe hợp với **bản đồ + lịch sử**: "phim tài liệu / giao diện bản đồ", không phải "game". Mỗi nhóm lấy **nhiều biến thể** để không lặp một tiếng.

## Danh sách (≈ 46 file)

### A. Tiếng sự kiện (nhỏ, dùng nhiều)

| Nhóm (thư mục) | Số file | Độ dài | Dùng cho | Từ khoá tìm (Pixabay / Mixkit) |
|---|---|---|---|---|
| `tick` | **6** | 0,1–0,6 s | Nhãn địa danh giải mã (đi cùng dải sáng vàng), chữ khoá hiện | `digital glitch short`, `data glitch`, `hud beep`, `interface glitch`, `text appear`, `typing glitch` |
| `pop` | **6** | 0,2–0,6 s | Thẻ ảnh bung ra | `swoosh pop`, `paper swish`, `photo swoosh`, `soft pop ui`, `card flip`, `whoosh short soft` |
| `swish` | **4** | 0,2–0,5 s | Thẻ ảnh mờ đi, chữ rời màn hình | `air swish`, `soft swoosh`, `swipe`, `fabric swish` |
| `pen` | **4** | 0,5–2 s | Tuyến đang vẽ, nét khoanh địa danh | `pen scribble`, `marker drawing`, `pencil writing`, `chalk drawing` |
| `ping` | **3** | 0,2–0,8 s | Ghim địa điểm, vòng sóng | `map pin`, `location ping`, `soft notification bell`, `sonar ping soft` |

### B. Tiếng nhấn (≤ 1 mỗi nhịp)

| Nhóm | Số file | Độ dài | Dùng cho | Từ khoá |
|---|---|---|---|---|
| `hit` | **4** | 1–3 s | Con số hook / payoff, tên phản diện | `cinematic hit`, `cinematic boom`, `trailer impact`, `epic hit` |
| `riser` | **3** | 1,5–4 s | Trước bước ngoặt / con số trả giá | `riser cinematic short`, `tension riser`, `whoosh riser` |
| `deephit` | **2** | 0,5–2 s | Dấu X đỏ, lối bị chặn | `deep impact`, `sub drop`, `low boom` |

### C. Ambience chạy nền (dài, lặp được)

*Ưu tiên **≥ 30 s**, không có nhạc, không giọng nói rõ. Mixkit có nhiều ambience tốt.*

| Nhóm | Số file | Dùng cho | Từ khoá |
|---|---|---|---|
| `amb-sea` | **2** | Chặng biển (Ep01, các tập thuyền) | `calm sea waves`, `ocean ambience`, `open sea wind` |
| `amb-wind` | **3** | Núi, đèo, nhịp lặng (gió nhẹ) | `mountain wind`, `blizzard wind`, `cold wind howling soft` |
| `amb-air` | **2** | Nền mặc định khi bay xa (không khí, "room tone" ngoài trời) | `light wind ambience`, `field ambience`, `air ambience` |
| `amb-army` | **2** | Đoàn quân hành quân (Ep02, tập P3 sau) | `marching army footsteps`, `soldiers marching`, `crowd footsteps gravel` |
| `amb-ship` | **1** | Thuyền gỗ (Ep01, Magellan) | `wooden ship creaking`, `sail flapping` |
| `amb-city` | **1** | Thành cổ, đám đông xa | `distant crowd ambience`, `medieval market ambience` |

### D. Chi tiết riêng theo tập (có thì tốt)

| Nhóm | Số file | Dùng cho | Từ khoá |
|---|---|---|---|
| `animal` | **2** | "37 elephants" (Ep02) | `elephant trumpet` (bản ghi thật, không phải hoạt hình) |
| `water` | **1** | Voi qua sông trên bè (Ep02), thuyền cập bến | `river splash`, `raft water` |

## Đã có, dùng tiếp (không cần tải)

- `whoosh` (14): cú bay.
- `click` (11), `flash` (12), `shutter` (8): tạm dùng cho tick / pop nếu nhóm A chưa đủ; nghe "giao diện máy ảnh" hơn mong muốn.
- `ambience` (3): bão (Mixkit), gió chuyển cảnh, giọt nước hang.
- `drum` (1): trống quân.

`catalog.json` còn ghi **25 file đã mất** (hit 8, deephit 8, progress 7, shutter 2) từ dự án cũ. Nhóm B ở trên thay chúng; Luis sẽ xoá các mục mất khỏi catalog khi nhập file mới.

## Sau khi có file

Luis sẽ:
1. Nhập vào `catalog.json` (LUFS, độ dài, nguồn).
2. Thêm vào kit style J một lớp "tiếng sự kiện" tự gắn theo các component (`StopLabel`, `PhotoCard`, cú bay trong `KEYS`, `Ring`), để tập mới có tiếng mà không phải liệt kê tay; mức âm dưới giọng ~10–12 dB cho nền, tiếng sự kiện −24 đến −30 LUFS.
3. Thêm lớp ambience theo chặng vào Ep01, Ep02; nâng nhạc nền; render lại, đo lại bằng phép đo ở §F và so với đối thủ.
