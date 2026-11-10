# Tài nguyên Q5 — Thermopylae (chờ Lucas duyệt tải)

*2026-11-01, Luis. Tra trên Wikimedia Commons và AWS Open Data (chỉ đọc thông tin, **chưa tải gì**). Tổng dung lượng nếu duyệt hết: **~16 MB** (tranh tải bản thu nhỏ đủ cho khung 4K, không tải bản gốc nặng). Ghi nguồn từng món vào mô tả video khi đăng.*

## 1. Tranh / ảnh public domain hoặc giấy phép mở

| # | Dùng ở nhịp | File (Commons) | Tác giả, năm | Giấy phép | Cỡ gốc | Tải | Ghi nguồn |
|---|---|---|---|---|---|---|---|
| A1 | **X** (câu "come and take them"), toàn khung | [Léonidas aux Thermopyles – Louvre INV 3690](https://commons.wikimedia.org/w/index.php?search=L%C3%A9onidas+aux+Thermopyles+Louvre+3690&ns6=1) | Jacques-Louis David, 1814 | Public domain | 9655×7124, 26,2 MB | bản thu 3000 px, **~2 MB** | "Jacques-Louis David, Leonidas at Thermopylae (1814), Louvre — public domain" |
| A2 | **V** (2 ngày không phá được), toàn khung | [Scene of the Battle of the Thermopylae.jpg](https://commons.wikimedia.org/wiki/File:Scene_of_the_Battle_of_the_Thermopylae.jpg) | John Steeple Davis, ~1900 | Public domain | 973×1467, 1,0 MB | **1,0 MB** (hơi mềm ở 4K: dùng như thẻ tranh, không toàn khung) | "John Steeple Davis — public domain" |
| A3 | **V** (Immortals), thẻ tranh | [Archers frieze Darius 1st Palace Suse Louvre AOD 488 a.jpg](https://commons.wikimedia.org/wiki/File:Archers_frieze_Darius_1st_Palace_Suse_Louvre_AOD_488_a.jpg) | Phù điêu gạch men cung điện Susa, ~510 TCN (ảnh chụp đã thả public domain) | Public domain | 2540×4098, 8,7 MB | bản thu 2000 px, **~1,5 MB** | "Frieze of Archers, Susa, Louvre — public domain" |
| A4 | **B** (Xerxes), chân dung trên băng rôn | [Xerxes I at the Hadish Palace of Xerxes.jpg](https://commons.wikimedia.org/wiki/File:Xerxes_I_at_the_Hadish_Palace_of_Xerxes.jpg) | Phù điêu Persepolis, ảnh: Nick Taylor | **CC BY 2.0** (chỉ cần ghi tên, không share-alike) | 718×1021, 0,7 MB | **0,7 MB** | "Xerxes I relief, Persepolis — photo Nick Taylor, CC BY 2.0" |
| A5 | **K** (Salamis), toàn khung | [Kaulbach – Die Seeschlacht bei Salamis – 1868.JPG](https://commons.wikimedia.org/wiki/File:Kaulbach,_Wilhelm_von_-_Die_Seeschlacht_bei_Salamis_-_1868.JPG) | Wilhelm von Kaulbach, 1868 | Public domain | 5032×2840, 4,8 MB | **4,8 MB** | "Wilhelm von Kaulbach, The Battle of Salamis (1868) — public domain" |

**Không đề xuất:** ảnh bia văn bia ở Thermopylae trên Commons (`Thermopiles memorial epitaph.jpg`) là **CC BY-SA 3.0** và chỉ 896×594: share-alike có thể kéo theo điều kiện cho cả video, lại quá nhỏ cho 4K → thay bằng ảnh AI C3.

## 2. Dữ liệu địa hình cho kính lúp (khe hẹp + lối mòn Anopaea)

| # | Nguồn | Phạm vi | Độ nét | Dung lượng | Giấy phép | Cần công cụ mới? |
|---|---|---|---|---|---|---|
| **B1 (đề xuất)** | Terrain Tiles (Mapzen / Tilezen, AWS Open Data) dạng **Terrarium PNG**, zoom 12 | 22,2–22,9° Đ × 38,65–38,95° B: vịnh Malis, núi Kallidromo, Thermopylae | **~30 m / px** | **45 ô, 5,0 MB** | dữ liệu mở; phải ghi nguồn (SRTM, EU-DEM / Copernicus, GMTED… theo trang attribution của Tilezen) | **Không**: PNG đọc bằng Pillow có sẵn |
| B2 | Copernicus DEM GLO-30, ô N38E022 (AWS Open Data) | 22–23° Đ × 38–39° B | 30 m | 34,9 MB | Copernicus DEM licence, ghi "© DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA" | **Có**: GeoTIFF nén cần thư viện đọc (`tifffile` / `rasterio`) |

Luis đề xuất **B1**: cùng độ nét, nhẹ gấp 7, không cài thêm gì. Dùng để: tô bóng địa hình trong kính lúp (thấy rõ vách núi sát biển), vẽ lối mòn Anopaea theo thung lũng thật. **Lưu ý lịch sử:** bờ biển ngày nay đã lùi xa khe núi vài km do phù sa; trong kính lúp mình vẽ thêm đường bờ biển cổ (nét đứt, theo bản đồ học thuật) và ghi "coastline in 480 BC" (3 từ + số), bảng kiểm chứng dòng 7.

## 3. Ảnh AI (Lucas tạo, 2160×3840, dọc)

Phong cách chung để khớp tranh David / Davis / Kaulbach: tranh sơn dầu lịch sử thế kỷ 19, ánh sáng điện ảnh, gam đất trầm; **không chữ, không máu me, không khuôn mặt người nổi tiếng thật**. Ảnh trông như tranh, không như ảnh chụp → không bắt buộc nhãn "altered or synthetic content" (vẫn bật nếu Lucas muốn chắc).

| # | Nhịp | Prompt (tiếng Anh) |
|---|---|---|
| C1 | **Đ** (Ephialtes chỉ lối) | *Vertical 9:16 history painting, 19th-century academic oil style. Night on a narrow goat path winding through oak forest over a steep mountain ridge; far below, a dark gulf under moonlight. A long single-file column of ancient Persian soldiers with spears and wicker shields climbs the path, a few torches glowing; at the front, a local Greek shepherd in a plain wool tunic points the way. Mist between the trees, cold blue moonlight against warm torchlight, muted earth palette, dramatic chiaroscuro, no text, no gore.* |
| C2 | **Đ** (ở lại, sáng ngày cuối) | *Vertical 9:16 history painting, 19th-century academic oil style. Dawn at a narrow pass between a sheer mountain wall and the sea. Seen from behind, a small line of ancient Greek hoplites with round bronze shields, crested helmets and red cloaks stands shoulder to shoulder, facing a vast army that fills the hazy plain beyond. Golden low sunlight, dust in the air, calm and solemn mood, muted earth palette, no text, no blood, no gore.* |
| C3 | **Câu kết** (văn bia) | *Vertical 9:16 painting, 19th-century romantic landscape oil style. A weathered marble stone slab standing alone on a low grassy hill at the foot of steep mountains near the sea, wild grass and red poppies around it, late afternoon light, a few clouds, quiet and solemn, the stone's surface carved with faint illegible ancient letters, no readable text, no people.* |

## 4. Tổng hợp để duyệt

| Món | Dung lượng | Luis đề xuất |
|---|---|---|
| A1–A5 tranh / ảnh | ~10 MB | tải cả 5 |
| B1 Terrain Tiles z12 | 5,0 MB | tải |
| B2 Copernicus | 34,9 MB + cài thư viện | không |
| C1–C3 ảnh AI | Lucas tạo | tạo cả 3 (C3 thay ảnh bia CC BY-SA) |
