# 03 — PHONG CÁCH DỰNG · Siege Atlas (từ bóc tách khung hình tới cách dựng)

*Tạo 2026-11-02 bằng `npm run studio:format -- new`. Bóc tách gốc: `Test/History Maps Lore/BOC-TACH-HINH.md` (dải 0–1 s, 3 s cuối, bảng shot từng video, kỹ thuật T#) + `INGEST.md` (số đo). Phần đo + bảng kỹ thuật điền tự động; phần "dựng thế nào" Luis viết, Lucas duyệt. Code: `Style Library/L-siege-atlas/README.md`. Mẫu dựng thật: `mau/`.*

## 1. Khung 0–1 s và 3 s cuối

- **Khung 0–1 s (họ, cả 4 video):** khung 0 là **một bản đồ toàn vùng**, không chữ lớn, không mặt người. Giọng vào ngay (≤ 0,15 s), phụ đề ở 0,4 s, rồi **một chi tiết bản đồ đổi** trong 0,4–3 s (tô vùng siêu cường, cờ cắm, chip năm). Video thắng (Malta) có khung 0 sạch nhất: bản đồ trống, câu đầu tự mang nghịch lý.
- **Khung 0–1 s (format):** khung 0 = tấm `world` giấy đã có bóng địa hình (`AtlasMap`), **không có chữ hook to**. `DateChip` năm rơi xuống trong 0,4–0,8 s, đúng lúc năm được đọc; phụ đề karaoke từ 0,4 s; vùng siêu cường **lan ra từ thủ đô** (`reveal`) trong 1–3 s. Frame 6 (ảnh bìa dự phòng) đã có chip năm (lesson E1).
- **3 s cuối (họ):** end card **TÊN NƠI · NĂM** serif vàng ~2 s trên hình payoff, rồi 2,7–3,3 s chỉ có nhạc; không CTA, không câu hỏi, không nối vòng.
- **3 s cuối (format):** `EndCard` NƠI · NĂM rơi vào những chữ cuối của câu kết, **cắt ~0,5 s sau khi card đứng yên** (D10, không để 3 s nhạc); không CTA, không nối vòng.

## 2. Hình theo từng nhịp kịch bản

Cột "Họ làm" rút từ bảng shot của video thắng (Malta, `BOC-TACH-HINH.md` §3) và 3 video còn lại; cột "Format dựng" là cách kit L làm (đã chạy thật ở `mau/`). Chữ: ≤ 2 khối ngoài phụ đề, ≤ 5 từ mỗi khối, câu VO không bao giờ lên màn hình.

| Nhịp | Họ làm (bóc tách) | Format dựng (component) | Chữ trên màn hình |
|---|---|---|---|
| **H** hook (0–6 %) | Bản đồ toàn vùng trống → tô phe siêu cường; máy đẩy rất chậm | `AtlasMap` tấm `world`; `DateChip` năm; vùng siêu cường `reveal` từ thủ đô; bên nhỏ là một mảng màu khác rất nhỏ | chip năm → tên phe (`Plaque`) |
| **B** bản đồ phe (6–20 %) | **Một cú máy bản đồ dài 13–33 s không cắt**, cứ ~3–4 s thêm một lớp: băng rôn chân dung vua, nhãn vùng, tô đối thủ + cờ, **kính lúp phóng nơi nhỏ**, mũi tên | Cùng cú máy dài; **bay khi đổi nơi** (luật I: ease, ≥ 22 frame, không xoay / nghiêng / blur); `Banner` chân dung người cầm quyền siêu cường, `Flag` từng phe, `Magnifier` ở nơi nhỏ (+ `Pinch` nếu là khe hẹp), `CampaignArrow` ngắn | tối đa 2 nhãn nơi |
| **N** bên yếu có tên (20–30 %) | Băng rôn chân dung thủ lĩnh + tuổi, cảnh 3D thành / cảng | `Banner` thủ lĩnh bên nhỏ; `NumberChip` quân số; chi tiết người **có nguồn** (vd. "đều là cha có con trai") | tên thủ lĩnh + con số |
| **X** khiêu khích (30–38 %) | Mũi tên, tuyến tàu; câu thoại chỉ ở phụ đề | `FullFrame` tranh public domain toàn khung, đẩy chậm; câu thoại **chỉ trong phụ đề** | không chữ thêm |
| **T** tấn công bằng số (38–48 %) | Chip ngày + mũi tên hạm đội vẽ dần, hàng icon tàu | `CampaignArrow` / `Fleet` / `Army` theo mốc; `NumberChip` con số; số tranh cãi kèm `SourceLine` | chip ngày + con số |
| **V** tưởng sập mà không sập (48–75 %) | **Luân phiên 3 lớp mỗi 2–8 s**: bản đồ ↔ 3D ↔ tranh; chip ngày đổi theo từng mốc | Luân phiên `AtlasMap` ↔ `FullFrame` tranh ↔ **ảnh AI kiểu diorama tách lớp** (2–3 cảnh / tập, D7) mỗi 3–8 s, đổi lớp bằng crossfade ≤ 8 frame; `DateChip` mỗi mốc ngày; mũi tên đâm vào rồi bật lại | chip ngày (DAY 5…) |
| **Đ** đảo ngược (75–88 %) | Mũi tên viện binh, vùng phe rút; tranh viện binh | `CampaignArrow` viện binh; vùng phe co lại (T17, `interpolatePath`); `Magnifier` lần 2 nếu có lối / chỗ hẹp | tên trận / nơi |
| **Nhịp lặng** (≥ 1) | (họ không có) | Máy gần đứng yên, không SFX, nhạc hạ; một mảng màu nhỏ đơn độc giữa vùng địch | không |
| **K** di sản (88–100 %) | 3D di sản, **lưới phố vẽ dần**, rồi end card | Di sản thấy được: tranh / ảnh AI toàn khung, hoặc sơ đồ 2,5D lưới phố vẽ dần (T10); `EndCard` NƠI · NĂM | end card |

## 3. Kỹ thuật → component (từ `style-card.json`)

| T# | Kỹ thuật | Mức | Quyết định | Cách của mình |
|---|---|---|---|---|
| T1 | Tô lãnh thổ theo phe, biên giới đúng năm | 🟡 | dùng | AtlasMap + dữ liệu OpenHistoricalMap (CC0), ghi credit (D8) |
| T2 | Cờ phe cắm trên cột | 🟡 | dùng | Flag + hình cờ public domain (Wikimedia) |
| T3 | Chân dung trên băng rôn / huy hiệu tròn | 🟡 | dùng | Banner + Plaque + chân dung public domain |
| T4 | Chip mốc thời gian | 🟢 | dùng | DateChip (Bebas ≥ 56 px theo D4) |
| T5 | Kính lúp phóng to nơi nhỏ | 🟢 | dùng | Magnifier |
| T6 | Mũi tên chiến dịch / tuyến hạm đội | 🟢 | dùng | CampaignArrow + Fleet + Trail |
| T7 | Diorama 3D (thành, pháo đài, quân, tàu) | 🟠 | thay | thay bằng ảnh AI kiểu diorama tách lớp parallax (cutout.py), 2–3 cảnh / tập (D7) |
| T8 | Tranh / tiểu hoạ toàn khung | 🟡 | dùng | FullFrame (kit J) + tranh public domain |
| T9 | Cảnh giống quay thật | 🔴 | bỏ | không dựng; thay bằng tranh public domain + chuyển động bằng code |
| T10 | Sơ đồ thành phố 2,5D / lưới phố vẽ dần | 🟡 | dùng | footprint OpenStreetMap (ODbL, ghi credit) → SVG; nghiêng bằng CSS 3D như J |
| T11 | Nhãn serif in hoa nhỏ | 🟢 | thay | nhãn Bebas ≥ 48 px, ≤ 2 nhãn cùng lúc (D4) |
| T12 | Phụ đề cháy cứng 2 dòng | 🟢 | thay | AtlasSub, karaoke ≤ 4 từ / 26 ký tự (D3) |
| T13 | Watermark giữa khung | 🟢 | thay | Handle (dưới vùng an toàn) |
| T14 | End card TÊN NƠI · NĂM | 🟢 | dùng | EndCard (ngoại lệ serif D5, cắt ≤ 0,5 s sau lời cuối D10) |
| T15 | Tuyến thương mại phát sáng | 🟢 | dùng | GlowRoute (kit J) |
| T16 | Dấu X từ chối | 🟢 | dùng | Cross (kit J) |
| T17 | Lãnh thổ co lại | 🟠 | dùng | interpolatePath giữa hai đa giác (@remotion/paths, Lucas duyệt 2026-11-01) |
| T18 | Vùng gạch chéo = đồng minh / chiếm đóng | 🟢 | dùng | SVG <pattern> trong AtlasMap |
| T19 | Bản đồ giấy cổ | 🟡 | dùng | atlas-plates.py + atlas-terrain.py (nền giấy style L) |
| T20 | Tranh được làm động | 🟡 | dùng | tách lớp (cutout.py) + parallax + hạt bằng code |
| T21 | Dán nhãn nguồn trên hình | 🟢 | dùng | SourceLine (kit J) + NumberChip |

## 4. Dựng một tập, từng bước

1. **Kế hoạch hình** trong FINAL: mỗi đoạn VO một dòng theo bảng §2 (nhịp → component → chữ), như `mau/kich-ban-l-thermopylae-full-FINAL.md` mục "Kế hoạch hình".
2. **Nền bản đồ:** cắt tấm vệ tinh cho vùng của tập (`scripts/make-plates.py`, NASA Blue Marble, public domain) → viết `factions.json` (mỗi phe: màu, nguồn, đa giác **biên giới đúng năm**, OpenHistoricalMap trước, thiếu thì vẽ tay theo bản đồ học thuật) → `python -P scripts/atlas-plates.py …` ra tấm giấy + lớp phe (`Style Library/L-siege-atlas/README.md` §Nền bản đồ).
3. **Tài sản:** tranh public domain (ghi nguồn từng ảnh vào FINAL), chân dung cho băng rôn, cờ phe; **2–3 ảnh AI** toàn khung 2160×3840 (Luis viết prompt, Lucas tạo) cho các cảnh 3D của đối thủ; tách lớp parallax bằng `scripts/cutout.py` khi cần.
4. **Giọng:** `episode.mjs prep` → `npm run voiceover` → `episode.mjs export` → `words.py`.
5. **Composition:** chép `Video.tsx` của mẫu, đổi toạ độ `P`, khoá camera `KEYS` (luật I qua `key()`), mọi mốc gắn vào chữ trong giọng đọc (`at(id)`, `w(id, k)`); mỗi kiểu vào cảnh khác nhau (chip rơi, nhãn mở ngang, cờ mọc cột, băng rôn cuộn, kính lúp nở, vùng lan, end card khép chữ).
6. **QA:** skill `review-loop` (sheet `safeGuide` + critic mắt mới): ≤ 8 s không có gì mới, ≤ 2 khối chữ, không chữ chạm vùng đỏ, nhãn không nằm dưới `FullFrame`.
7. **Final:** `npm run render:style -- <id> --to <mp4>` (4K, −14 LUFS) → `npm run studio:compare -- <mp4> --ref "Test/History Maps Lore"` → so với §5 bên dưới → Lucas xem trên điện thoại.

## 5. Số đo hình + âm thanh (kiểm ở Cổng 5 bằng `studio:compare`)

Cột "Demo" là bản mẫu Thermopylae (`mau/SO-SANH.md`). Cột "Mục tiêu" là lựa chọn của format (QUYẾT), **Lucas duyệt 2026-11-02**; ✗ = demo chưa đạt, sửa từ tập 1.

| Đo | Họ (trung vị) | Họ (khoảng) | Demo | Mục tiêu của format (Lucas duyệt) |
|---|---|---|---|---|
| Shot trung bình (s) | 11,1 | 7–32,9 | 102,7 | **không áp dụng**: format đổi lớp bằng crossfade + bay nên máy chỉ thấy 1 shot; thay bằng **≤ 8 s không có gì mới** (lesson E3) |
| Shot mở đầu (s) | 37,2 | 13–52,4 | — | cú máy bản đồ mở đầu **15–35 s** (nhịp H + B) |
| Điểm cắt mềm / phút | 0,3 | 0–2,4 | 7,0 | **≥ 4** (đổi lớp bản đồ ↔ tranh ↔ ảnh AI ở nhịp V) ✓ |
| Thời gian hình đứng yên (%) | 55 | 7–100 | 100 | **≤ 60** ✗: demo đẩy 1 % / s nên máy đo coi như đứng yên; dùng hết luật I (đẩy tới 5 % / 3 s), thêm parallax trên tranh / ảnh AI, vùng lan và mũi tên chạy trong cảnh |
| Thời gian chuyển động chậm (%) | 43 | 0–90 | 0 | **≥ 40** ✗ (cùng lý do) |
| Từ trên màn hình / khung | 8 | 7–9 | 4 | **≤ 6** (gồm phụ đề) ✓ |
| Khối chữ cùng lúc (tối đa) | 7 | 5–10 | 4 | **≤ 4** theo OCR (= phụ đề 2 dòng + ≤ 2 khối) ✓ |
| Cao chữ trung vị (px / 1080) | 54 | 54–56 | 60 | **≥ 48** ✓ |
| Chữ nhỏ (10 % nhỏ nhất, px) | 33 | 32–33 | 51 | **≥ 40** ✓ (hơn họ rõ: chữ họ khó đọc trên điện thoại) |
| Khối chữ ngoài vùng an toàn (%) | 7 | 3–10 | 0 | **0** ✓ |
| Nền − giọng (dB) | −3,5 | −3,9 – −2,8 | −14,7 | **−8 đến −12** ✗ |
| Tiếng nhấn ở nền / phút | 44,1 | 43,3–56,6 | 9,9 | **10–20** (luật "ít tiếng" D-SFX) ≈ |
| Độ to (LUFS) | −14,2 | −14,3 – −14,1 | −14,1 | **−14 ±1**, true peak ≤ −1,5 ✓ |

**Hai việc sửa dựng ngay từ tập 1** (demo trượt): hình phải sống hơn (đứng yên ≤ 60 %); nền nhạc rõ hơn (−8 đến −12 dB dưới giọng).

**Màu (vai trò, đo bằng k-means trên video thắng nhất):**

| Hex | Vai trò |
|---|---|
| `#122B35` | biển sâu (nền) |
| `#29424E` | biển nông / vùng tối |
| `#85836C` | đất be xám (nền) |
| `#686551` | bóng núi / đất tối |
| `#A79B83` | đất sáng |
| `#BEC1BB` | chữ, phụ đề, watermark |

## 6. Khác họ có chủ đích (QUYẾT, Lucas đã duyệt D3–D12 ngày 2026-11-01)

| Họ | Format | Vì sao |
|---|---|---|
| Phụ đề cháy 2 dòng, 3–9 từ / cụm, ~44 px | **Karaoke ≤ 4 từ / 26 ký tự**, 2 dòng, từ đã đọc sáng lên, số và từ khoá vàng (D3) | luật short-form: ít chữ, dễ đọc trên điện thoại |
| Nhãn serif nhỏ 20–33 px, có lúc 6–10 khối cùng lúc | **Bebas Neue ≥ 48 px, ≤ 2 khối** ngoài phụ đề (D4) | đo được: chữ nhỏ nhất của họ ~33 px |
| End card serif vàng; ở 1 video nằm trong vùng UI | Serif **chỉ cho end card**, trong vùng an toàn (D5) | một ngoại lệ font duy nhất |
| Máy quay lia / bay / dolly tự do | **Luật camera I**: chỉ bay khi đổi nơi, ease, ≥ 22 frame, đẩy ≤ 5 % / 3 s; không xoay, nghiêng, blur (D6) | luật "không máy quay giả" |
| Diorama 3D ở mọi video (Blender) | **Ảnh AI kiểu diorama tách lớp parallax**, 2–3 cảnh / tập; không cài Blender (D7) | chi phí 3D cao, khó giữ nhịp đăng |
| Biên giới lịch sử từ dữ liệu GPL / tự vẽ | **OpenHistoricalMap (CC0)** trước, ghi credit; thiếu thì vẽ tay theo bản đồ học thuật (D8) | giấy phép sạch |
| Tranh xác chết toàn khung | Không; hệ quả nói bằng số (D9) | an toàn nền tảng |
| 3 s nhạc sau lời cuối | Cắt ~0,5 s sau end card (D10) | không đoạn chết cuối video |
| Watermark giữa khung | Handle dưới vùng an toàn | không che nội dung |
| Nhạc Kevin MacLeod, nền to (−3,5 dB dưới giọng) | Nhạc Pixabay, SFX thật, luật "ít tiếng"; nền −8 đến −12 dB dưới giọng (§5, Lucas duyệt 2026-11-02) | giọng rõ, không lấn |
