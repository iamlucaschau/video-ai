# O · Data Loop

*Lucas duyệt 2026-11-09 (D1–D8 trong `Test/Mapped Earth/BAO-CAO.md`). Khung do `npm run studio:kit` tạo từ `Test/Mapped Earth/style-card.json`. Hợp đồng: `studio/KIT-CONTRACT.md`.*

**Một dòng:** một chu kỳ dữ liệu thật (một năm di cư, một tuần dòng chảy) vẽ thành ánh sáng trên quả cầu địa hình tối; không lời, không cắt cảnh, khung cuối chảy về khung đầu. Dữ liệu tự kể chuyện.

**Hợp với:** hiện tượng tự nhiên có chu kỳ và có dữ liệu mở (di cư chim / cá / thú, thuỷ triều, dòng chảy, gió mùa, mùa lá, mùa mưa). **Không hợp:** câu chuyện cần lời giải thích (dùng J / L / E).

**Bản test:** `o-shrike/` (`Style-O-DataLoop-Shrike`): một năm di cư của Bách thanh mày trắng (*Lanius cristatus*), Đông Á ↔ Đông Nam Á, 30 s.

**Dữ liệu → hình:** `python -P scripts/data-loop.py fetch|terrain|flock <slug>` (cấu hình loài ở đầu script: taxonKey GBIF, khung lấy dữ liệu, tâm + bán kính quả cầu) → `public/data-loop/<slug>/` (`base.png` nền địa hình, `flock.bin` toạ độ chim theo ngày, `flock.json` frame → ngày, vĩ độ trung bình). Nhạc: `python -P scripts/make-music.py o-flyway …` (4 ô nhịp × 7,5 s = đúng 30 s, lấy đoạn 30–60 s để nối vòng).

## Look

- **Nguồn:** Mapped.Earth (Facebook; cùng nội dung IG @mapped.earth 207K, YT @mapped-earth) — Aaron J. Becker (10 video). Định dạng 9:16 (7 reel) và 4:5 (3 reel: sông, hải đăng), 24–68 s, ~182 wpm, -16.1 LUFS.
- **Phụ đề (họ):** Reel không lời: không phụ đề. Reel có lời: cháy cứng 1–3 từ (El Niño) đến 3–6 từ (Bering), từ khoá tô vàng, ~39–46 px trên 1080
- **Chữ (họ):** 2 tầng: nhãn nhỏ viết hoa + tên lớn sans đậm; chữ mùa serif nghiêng (Fall, Spring); tiêu đề serif ở template dòng chảy; chú giải + credit monospace 12–24 px. Trung vị 22–57 px trên 1080 (OCR), phần lớn < 48 px
- **Máy quay (họ):** Gần như đứng yên (scene trung vị 0,1–0,8 ‰, ĐO). 0 cú cắt ở cả 10 reel. Chim: trượt chậm theo đàn bắc ↔ nam. El Niño: 1 cú đẩy vào Peru + biến hình giữa các chế độ xem. Bering: đứng yên rồi lùi chậm cuối. Garda: bay quanh hồ (reel flop)
- **Kết (họ):** Vòng lặp không lời: chu kỳ dữ liệu khép kín (Jul 29 → Aug 1), chữ mùa mờ vào cuối → nối vòng không lộ. Phim có lời: dừng trên con số so sánh ~3 s, không CTA

## Màu (vai trò)

| Hex | Vai trò ở nguồn | Trong kit |
|---|---|---|
| `#030B16` | nền: biển / đất tối gần đen xanh (R1) | `O.bg` |
| `#232C42` | đất liền xanh xám có bóng địa hình (R1) | `O.swatches` |
| `#D7ABB5` | dữ liệu sáng: vệt chim hồng, cộng dồn additive (R1) | `O.swatches` |
| `#CE6724` | nhấn nóng: nước ấm, số dương, cột 2026 (R4) | `O.accent` |
| `#33D8AC` | thang màu dữ liệu lạnh → nóng, logo xanh ngọc (R4) | `O.swatches` |
| `#DFDBD4` | nền giấy kem cho kiểu infographic (R3 sông) | `O.ink` |

## Luật riêng (Lucas duyệt)

- **Không lời, không phụ đề** (D2): một bản nhạc nền tự tạo (`make-music.py`, không nhạc Pixabay), không SFX. Mọi mốc hình theo **dữ liệu** (frame → ngày), không theo giọng: ngoại lệ của hợp đồng §4 "mốc theo chữ trong giọng đọc".
- **Máy quay** (D5): khung **trượt chậm theo đàn chim** trên canvas lớn hơn khung (`camera()` trong `data-loop.py`: điểm giữa đàn đặt ở `focus`, làm mượt Gaussian 45 ngày, vòng khép kín); không zoom, không rung, đỉnh ≤ 3,3 px / frame.
- **Không cắt cảnh:** một cảnh liên tục; khung cuối = khung đầu (chu kỳ khép kín, Style Library §2.5).
- **Chữ:** khối dưới trái như nguồn (tiêu đề 2 tầng: nhãn 48 px + tên 96 px, đồng hồ, ảnh, chú giải), chữ mùa 104 px ở trên, ngày 52 px, 12 vạch tháng quanh vòng đồng hồ (không chữ), **dòng nguồn / chú giải 24 px** (ngoại lệ D4, chỉ style O). Mọi chữ trong vùng an toàn. Tối đa 2 khối chữ đọc (tiêu đề, chữ mùa) + đồng hồ + dòng nguồn.
- **Trung thực về dữ liệu:** luôn có dòng "simulated birds, from sightings" (hay câu tương ứng) và nguồn; caption bài đăng ghi truy vấn GBIF + ngày truy cập (`out/data-loop/<slug>/meta.json` → `cite`).
- Font: một họ sans (`FONT`), không serif cho chữ mùa (khác nguồn, theo AGENTS rule 3).

## Kỹ thuật → component

| T# | Kỹ thuật | Mức | Quyết định | Cách (card) | Component |
|---|---|---|---|---|---|
| T0 | Nền quả cầu địa hình tối (orthographic, Terrain Tiles) | 🟡 | dùng | `data-loop.py terrain` bake PNG 1080×1920 | `Base` ✅ |
| T1 | Dòng chảy hạt trên trường vector (nước, gió) | 🟡 | dùng | Python đọc NetCDF (NOAA NGOFS2, OSCAR, Copernicus) → lưới u/v; vẽ trên canvas trong Remotion, hạt tính lại từ seed theo frame (không trạng thái) | chưa |
| T2 | Đàn chim mô phỏng từ quan sát eBird | 🟡 | dùng | GBIF search API (không cần tài khoản) → mật độ 52 tuần → Knothe kinh độ trước → toạ độ theo ngày (`scripts/data-loop.py`) → canvas additive | `Flock` ✅ |
| T3 | Chip số chạy theo dữ liệu (°C, m, m³/s) | 🟢 | dùng | Counter có sẵn + bảng số theo ngày | `Chip` (tĩnh) |
| T4 | Đồng hồ thời gian (vòng 12 tháng, thanh tuần, ngày giờ) | 🟢 | dùng | SVG + interpolate | `YearClock` ✅ (vòng năm) |
| T5 | Mặt cắt dọc đại dương / hồ | 🟡 | dùng | Copernicus Marine / mô hình hồ → ảnh nhiệt theo ngày (Python) → Img + nội suy | chưa |
| T6 | Biến hình giữa các chế độ xem (cầu → mặt cắt → dải) | 🟢 | dùng | three.js morph hoặc crossfade ≤ 8 frame | chưa |
| T7 | Địa hình 3D nghiêng + hạ mực nước, đất lộ tô màu theo thời điểm khô | 🟡 | dùng | @remotion/three mặt lưới + shader mực nước (đã dùng three.js ở style M); Blender dự phòng (đã có máy) | chưa |
| T8 | Quả cầu dữ liệu | 🟡 | dùng | three.js sphere + texture từ canvas T1 | chưa |
| T9 | Chùm sáng hải đăng quét đúng đặc tính hải đồ | 🟡 | dùng | OSM / NGA List of Lights (public domain) → parser đặc tính → quạt additive trên canvas | chưa |
| T10 | Sông tô theo biển nhận, độ đậm = lưu lượng ngày | 🟡 | dùng | HydroRIVERS + GloFAS → SVG path / canvas | chưa |
| T11 | Nối vòng bằng chu kỳ dữ liệu | 🟢 | dùng | chọn chu kỳ; ánh xạ frame → ngày khép kín | `frame_days` trong `data-loop.py` + `Flock` (vệt quấn quanh năm) ✅ |
| T12 | Thời gian không đều (chậm khi có chuyện, nhanh khi lặng) | 🟢 | dùng | hàm ánh xạ frame → ngày theo mức hoạt động của dữ liệu | `frame_days` ✅ (0,17–1,04 ngày / frame) |
| T13 | Ảnh thật của đối tượng trong khung (con chim) | 🟡 | dùng | Wikimedia Commons CC BY / CC BY-SA, ghi credit | chưa (bản test chưa có ảnh) |

## Cách dựng

`studio/KIT-CONTRACT.md` §5: KitSheet → component từng T# → bản test ~30 s theo giọng đọc → storyboard (`shotlist.mjs --board`) → review-loop → `ref.jpg` từ bản test của mình.

## Tự chấm so với nguồn (2026-11-09, `o-shrike` vs Mapped.Earth R1 Barn Swallow; v3 = dữ liệu đầy đủ)

So khung cạnh nhau (`scripts/sbs-sheet.py`) + `studio:compare` (cùng bộ đo với 10 reel của họ). Thang 10, v1 = bản test đầu, v2 = sau khi bổ sung, v3 = dữ liệu GBIF đầy đủ.

| Tiêu chí | v1 | v2 | **v3** | Họ | Đã làm / còn thiếu |
|---|:-:|:-:|:-:|:-:|---|
| Khung 0 (lý do không lướt) | 3 | 8 | **8** | 8 | mở 1/8, 12 ngày trước đỉnh di cư thu; "Autumn" có từ khung 0 (chữ mùa nhìn trước 2 tuần) |
| Dữ liệu phủ khung | 4 | 7 | **7** | 9 | khung 1080×1920 trượt chậm theo đàn trên canvas 1500×2600 (R 820 → 1060, D5; đỉnh 3,3 px/frame, trung bình 0,9) |
| Độ giàu của đàn chim | 4 | 7 | **8** | 9 | v3: **toàn bộ 365.091 bản ghi GBIF** (v2: mẫu 33.025). 3.000 → 8.000 chim, nét 1,2 px, 2 màu (đậu: đỏ cam, bay: hồng), quầng mật độ "bright: many birds" |
| Dòng bay mạch lạc | 5 | 6 | **7** | 9 | bỏ vệt bước nhảy > 90 px / ngày; v3: đủ dữ liệu + làm mượt mật độ 10 ngày / 2 ô → mùa đông chim đậu yên thành cụm, mùa thu thành dải cong liền. **Còn thiếu:** mùa hè còn sọc dọc (Siberia ít người quan sát); phễu của họ một phần do địa lý (eo Trung Mỹ ép đàn chim vào một lối) |
| Nền bản đồ | 7 | 7 | **7** | 8 | giữ. Bờ biển của họ sắc hơn |
| Chữ đọc trên điện thoại | 9 | 9 | **9** | 6 | chữ ≥ 48 px, 0 % ngoài vùng an toàn (họ: 36 %); vạch tháng thay chữ cái 26 px |
| Trung thực / nguồn | 7 | 8 | **8** | 9 | chú giải 2 phần như họ + nguồn + ảnh có credit. Họ có DOI tải GBIF (mình chưa có tài khoản GBIF) |
| Nối vòng | 8 | 9 | **9** | 9 | khung cuối ≈ khung 0, cả vị trí máy quay |
| Nhịp thời gian | 7 | 8 | **8** | 8 | 0,17–1,04 ngày / frame |
| Âm thanh | 8 | 8 | **8** | 7 | −14,3 LUFS, nhạc tự tạo nối vòng |
| Nhận diện | 2 | 5 | **5** | 8 | ảnh chim tách nền (T13). **Còn thiếu:** logo / handle kênh: chờ tên kênh (D8) |
| **Tổng** | **64** | **82** | **84** | **90** | |

**Còn thua:** (1) sọc dọc mùa hè: thử vận chuyển tối ưu giữa các tuần thay cho Knothe nếu cần; (2) logo kênh: chờ D8; (3) DOI cho nguồn: chỉ có khi tải qua GBIF có tài khoản (Lucas tạo); bản hiện tại trích dẫn truy vấn GBIF + ngày truy cập.

## Bẫy đã gặp

*Mỗi lỗi đã tốn thời gian: một dòng (cái gì sai, vì sao, cách tránh, ngày). Đọc trước khi dựng tập mới.*

- **GBIF search API: trang ở offset sâu (vd. 45.000) treo vài phút.** Chỉ lấy trang nông: một trang 300 bản ghi cho mỗi năm × tháng (2026-11-09).
- **Knothe theo vĩ độ trước → vệt ngang đông–tây quét ngang bản đồ** khi một hàng vĩ độ có hai cụm (Ấn Độ và Philippines). Lấy kinh độ trước: chim giữ dải kinh tuyến, bay bắc–nam (2026-11-09).
- **`python -I` không thấy numpy** (cài ở user site): chạy script bằng `python -P` (2026-11-09).
- **Mũi tên "→" trong `print` làm script chết trên console cp1252** sau khi đã ghi file: `sys.stdout.reconfigure(encoding="utf-8")` ở đầu script (2026-11-09).
- **Nhạc vòng lặp: đừng dùng `loudnorm` một lượt** (gain đổi theo thời gian, đầu và cuối lệch mức ở chỗ nối). Đo `ebur128` rồi `volume` cố định + `alimiter` (2026-11-09).
- **Lấy đủ dữ liệu không cần tài khoản GBIF:** chia truy vấn theo năm × tháng (mỗi ô < 10.000 bản ghi, offset vẫn nhanh 3–5 s / trang), 4 luồng song song: 365.091 / 365.091 bản ghi trong ~25 phút (2026-11-09).
- **Mật độ tuần làm mượt 6 ngày thì nhấp nháy:** chim mùa hè nhảy qua lại giữa hai cụm cùng kinh tuyến (sọc dọc). 10 ngày + blur 2 ô (2026-11-09).
- **8.000 chim cộng sáng (additive) cháy trắng hết vệt:** trail alpha 0,26 → 0,16, màu hồng đậm hơn (`#FFA3BC`) (2026-11-09).
- **Bỏ vệt theo ngưỡng bước nhảy 40 px / ngày xoá luôn đường bay thật mùa thu** (lúc di cư chim đi > 40 px / ngày ở R 1060): dùng 90 px (2026-11-09).
- **Máy quay làm mượt sigma 25 ngày vẫn trượt 4,9 px / frame lúc mùa đông** (thời gian tua nhanh): sigma 45 ngày → đỉnh 3,3 px / frame (2026-11-09).
- **Đồng hồ r < 96 làm chữ ngày 48 px tràn khỏi vòng**; vạch tháng ra tới r + 34, tính vào vùng an toàn; chữ cái tháng 26 px đã bỏ (dưới luật 48 px), thay bằng vạch (2026-11-09).
