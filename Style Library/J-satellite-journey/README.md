# J — Satellite Journey

*Thêm 2026-10-26, học từ kênh Guilherme Video Editor (Odysseus, Moses). Phân tích đầy đủ: `Test/doi-thu/BAO-CAO.md`. Trạng thái: **kit v1 (đang thử)**, chờ Cổng Test.*

- **Look:** **ảnh vệ tinh thật** (NASA Blue Marble, biển navy tối, sa mạc vàng cát, bóng địa hình), viền tối 4 góc. Một **tuyến nét đứt trắng phát sáng** vẽ dần sau **con thuyền buồm đỏ**; các chặng đã đi giữ lại trên màn hình nên hành trình rối dần. Mỗi điểm dừng có **ghim + nhãn chữ in hoa giải mã** (ký tự vàng nhảy rồi thành chữ trắng) và một **thẻ tranh cổ điển** bo góc, viền trắng, nối về ghim bằng một sợi dây. Hook là một **chữ vàng đùn khối** (vd. "7 YEARS") + một dòng trắng nhỏ.
- **Mạnh:** **hành trình có thứ tự** (huyền thoại, lịch sử, thám hiểm, di cư, chiến dịch): "vì sao mất N năm, khi chỉ cách vài tuần?". Câu trả lời là chính tuyến đường, nên người xem ở lại tới điểm cuối. Cứ ~6 s một nơi mới.
- **Yếu:** cần **tuyến đường có nguồn** (học giả nào đặt điểm nào; ghi rõ khi các truyền thống khác nhau); cần tranh public domain cho mỗi điểm chính; ảnh Blue Marble chỉ đủ nét tới khung ~300 km (zoom gần hơn cần nguồn ảnh khác, xem "Nền bản đồ").
- **Máy quay (ngoại lệ chỉ của J, Lucas 2026-10-26):** **không bao giờ đứng yên**. Bay giữa các điểm (ease in-out, ≥ 24 frame, chặng xa thì "cất cánh" zoom ra giữa đường), **đẩy chậm + xoay quanh** điểm dừng khi đứng (mặc định 1,2 % zoom / s, 0,8° / s), **nghiêng 3D** 14–28°, **motion blur** khi bay nhanh (`CameraMotionBlur`, 7 mẫu, chỉ bật khi camera bay). Vẫn **không rung, không lắc, không zoom-giật**. Các style A–I **không** được dùng ngoại lệ này.
- **Phụ đề:** karaoke **1 dòng ≤ 3 từ / 18 ký tự** (tiếng Anh), trắng; từ khoá + số vàng nhạt, từ đang đọc vàng đậm và to hơn 10 % (`JourneySub`). Bản gốc tiếng Anh của đối thủ không có phụ đề; mình giữ phụ đề vì người xem hay tắt tiếng.
- **Chữ:** Bricolage Grotesque 800 cho mọi chữ (nhãn 56 px, phụ đề 70 px, hook 150 px). Đối thủ dùng chữ condensed + toạ độ chữ rất nhỏ: **không dùng toạ độ** (dưới 48 px, và không phải thông tin).
- **Vùng an toàn:** nhãn bám theo bản đồ nên camera có thể mang nhãn ra mép; `StopLabel` **tự mờ** trước khi chạm vùng nguy hiểm. Thẻ tranh luôn đặt ở dải trên (tâm y = 470, x 380–660), ghim ở dải giữa (`MAP_CY` = 860), phụ đề ở đáy vùng an toàn.
- **Hình ảnh (Lucas duyệt 2026-10-26, `Test/doi-thu/BAO-CAO.md` §9):** thẻ ở điểm dừng = **tranh / tranh khắc public domain** (Met, Rijksmuseum, Art Institute of Chicago, NGA, Wikimedia Commons PD-Art), cắt 4:3, phủ chung một lớp màu. **Khoảnh khắc đỉnh** (1–2 lần / video, toàn khung) = ảnh AI tự tạo theo bộ prompt chung của kênh; ảnh AI trông như thật thì bật khai báo "altered or synthetic content" khi đăng YouTube. **Không dùng** clip phim, trailer, ảnh Google, stock video. Ghi nguồn từng ảnh trong kịch bản tập.
- **Âm thanh:** giọng kể tài liệu, ~190–205 wpm. Nhạc nền Pixabay −28 LUFS. Whoosh Pixabay ở mỗi cú bay dài (khi thư viện SFX có trên máy). Master −14 LUFS như các series khác (đối thủ để −25 LUFS, quá nhỏ).
- **Kết:** câu cuối lặp lại hook bằng con số trả lời (bản đầy đủ), hoặc nối vòng theo luật loop ending (Style Library §2.5).

## Nền bản đồ

- Nguồn: **NASA Blue Marble Next Generation** (public domain; credit "NASA Earth Observatory" trong mô tả video). Bản tháng 7/2004 có địa hình + độ sâu biển: tile 21600×21600 (463 m/pixel) cho cảnh gần, bản 5400×2700 cho nền toàn cầu.
- Cắt bằng `python -P scripts/make-plates.py` (link tải và cách dùng ở đầu script): mỗi tập 2–3 tấm, thô trước, nét sau (vd. world 15 px/độ → vùng 60 → chi tiết 240). Ảnh nguồn không đưa vào repo, chỉ đưa các tấm đã cắt (`public/images/<tập>/map/`) + `plates.json`.
- Cần zoom gần hơn khung ~300 km (một thành phố, một eo biển nhỏ) thì cần nguồn nét hơn, vd. Sentinel-2 cloudless của EOX. **Phải kiểm tra giấy phép theo năm dữ liệu** trước khi dùng. Không dùng tile Google/Mapbox/Bing (điều khoản cấm dùng ngoài app).

## Code (`satellite-journey.tsx`)

| Phần | Việc |
|---|---|
| `JCam`, `project(cam, lon, lat)`, `projectLine` | camera địa lý (zoom = px / độ kinh, `bearing`, `tilt`) và phép chiếu màn hình dùng **cùng công thức** với mặt phẳng CSS-3D của bản đồ, nên nhãn đứng thẳng mà vẫn khớp đúng chỗ |
| `JKey`, `camAt(keys, f)`, `camSpeed` | đường bay: mỗi key là một cú bay bắt đầu ở `at`; giữa các key camera tự đẩy chậm + xoay (`push`, `orbit`); `camSpeed` quyết định bật motion blur |
| `SatMap` | các tấm vệ tinh trong một mặt phẳng nghiêng + xoay, viền tối 4 góc |
| `GlowRoute`, `along`, `Vessel` | tuyến nét đứt phát sáng (chặng đã đi giữ lại), điểm đầu tuyến + hướng, thuyền buồm đỏ nhấp nhô |
| `StopLabel` | ghim + chữ in hoa giải mã + gạch chân vẽ dần; tự mờ khi ra khỏi vùng an toàn |
| `PhotoCard` | thẻ tranh trên dây nối; vào bằng scale (vượt ≤ 4 %), tranh bên trong zoom chậm + vệt sáng quét, ra bằng mờ + nhoè |
| `Ring`, `BigWord`, `SubWord` | vòng sóng đánh dấu nơi (có `out`), chữ hook vàng đùn khối, dòng phụ / chữ khoá (màu tuỳ chọn) |
| `PhotoCard` `mono` | thẻ tranh phai dần sang trắng đen (nhịp lặng); dây nối luôn vào cạnh thẻ quay về phía ghim, nên thẻ đặt trên hay dưới ghim đều được |
| `Cross` | dấu X đỏ nhấp nháy: lối đi bị cấm (vd. eo Messina) |
| `GeoLine` | đường trên bản đồ không phải hành trình: "đường thẳng" mờ của hook, đường đỏ đối đầu giữa hai thành |
| `FullFrame` | tranh / ảnh toàn khung cho khoảnh khắc đỉnh (1–2 lần / video), crossfade 8 frame, đẩy chậm |
| `SourceLine` | dòng ghi nguồn 48 px ở giây đầu ("According to Virgil's Aeneid") |
| `JourneySub` | skin phụ đề karaoke |

## Video mẫu

**Bản đầy đủ:** `Style Library/J-satellite-journey/j-aeneas-full/` — cả hành trình Troy → cửa Tiber (13 điểm dừng, 11 chặng biển, ~133 s), composition `Style-J-SatelliteJourney-AeneasFull`. Kịch bản FINAL (Lucas duyệt v2 2026-10-26) + kiểm chứng + nguồn ảnh: `kich-ban-j-aeneas-full-FINAL.md`; spec: `01_EPISODE-SPEC_j-aeneas-full.md`; prompt ảnh AI thay thế: `image-prompts.md`. Mẫu cho một tập thật: dữ liệu địa lý (`P`, `LEGS`, `SAIL`, `KEYS`) ở đầu file, mọi mốc gắn vào chữ trong giọng đọc qua `w(line, word)`.

**Bản test 4 điểm dừng:** `Style Library/J-satellite-journey/j-aeneas/` — "Why did Aeneas wander for seven years?" (EN, 4 điểm dừng: Troy → Thrace → Delos → Crete), composition `Style-J-SatelliteJourney-Aeneas`, ~28 s. Kịch bản, kiểm chứng và nguồn ảnh: `kich-ban-j-aeneas-FINAL.md`; spec: `01_EPISODE-SPEC_j-aeneas.md`. Giọng Gemini TTS (Charon, tempo 1,05) qua pipeline chuẩn: `node scripts/episode.mjs prep` → `npm run voiceover -- voiceover/j-aeneas.json` → `episode.mjs export` → `python -P scripts/words.py j-aeneas en`. Mọi mốc hình (nhãn, thẻ, chữ hook, cú bay) lấy từ timing + thời điểm từng từ, nên tạo lại giọng thì video tự canh lại. Render: `npx remotion render Style-J-SatelliteJourney-Aeneas out/j/raw.mp4 --crf=18`, rồi master âm thanh −14 LUFS bằng ffmpeg (như `render:ptw`).
