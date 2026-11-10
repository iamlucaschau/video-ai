# Mapped.Earth — bóc tách hình (mục 1.3)

*2026-11-09, Luis. Khung hình: `_work/look/` (sheet tự cắt bằng ffmpeg) + `_work/sheets/` (của `studio:ingest`), không vào git. File tải về là bản Facebook phát: **720×1280** (9:16) hoặc **720×900** (4:5), 30 fps; gốc có lẽ 1080 (ƯỚC).*

## 0. Điều quan trọng nhất: **không có cú cắt nào**

Dò cắt cảnh (ffmpeg scene > 0,3) ở cả 10 reel: **0 cú cắt cứng, 0 crossfade bắt được** (điểm scene cao nhất 0,033 ở R7, còn lại ≤ 0,03; ĐO, `_work/*.measure.json`). Mỗi reel là **một cảnh liên tục**: dữ liệu chạy theo thời gian, máy quay đứng yên hoặc trượt rất chậm theo đối tượng. Ở reel có lời (R4), chuyển "cảnh" bằng **biến hình**: quả cầu → mặt cắt dọc → dải thời gian → mặt cắt → quả cầu (ƯỚC, sheet 1 s).

→ Bảng shot dưới đây chia theo **pha** (thay đổi nội dung / chế độ hình), không theo cú cắt. Ranh giới pha là **ƯỚC ±0,5 s** đọc từ sheet 1 s.

## 1. R1 Barn Swallow (31,8 s, hit #1) — mẫu cho cả nhóm "một năm di cư"

### Khung 0–1 s (mỗi 0,2 s)
![R1 mở](_work/look/1452241487088449-open.jpg)

- **Khung 0 đã có đủ:** bản đồ Bắc Mỹ tối, hàng nghìn vệt hồng đang chảy về phía vịnh Mexico, chữ **"Fall"** serif nghiêng lớn, tiêu đề "A YEAR OF MIGRATION / Barn Swallow", đồng hồ năm "Aug 1", ảnh con nhạn, logo. **Không có khung đen, không có chữ bay vào, không có lời.** Người xem thấy chuyển động ngay frame 0.
- Ngày nhảy 1–2 ngày mỗi 0,2 s (Aug 1 → Aug 9 trong 1 s).

### 3 s cuối (mỗi 0,5 s)
![R1 cuối](_work/look/1452241487088449-end.jpg)

- **Nối vòng hoàn hảo:** kết ở "Jul 29", chữ "Fall" mờ dần hiện lại ở 1 s cuối, mở lại ở "Aug 1" với "Fall" đầy đủ. Khi FB phát lại, không thấy chỗ nối.
- **Thời gian không đều:** May 31 → Jun 17 → Jul 16 trong ~1 s (mùa hè chim đứng yên, tua nhanh); di cư thu / xuân chạy chậm (ƯỚC từ nhãn ngày). Đây là "biên tập" quan trọng nhất: thời gian chậm lại đúng lúc có chuyển động.

### Bảng pha (ƯỚC từ sheet 12 khung + 1 s)

| # | Vào–ra (s) | Ngày trên đồng hồ | Hình | Chữ | Máy quay | Âm |
|---|---|---|---|---|---|---|
| 1 | 0–~3 | Aug 1–Aug 20 | Bắc Mỹ sáng hồng khắp nơi, dòng bắt đầu đổ về Mexico | "Fall" + khung cố định | đứng yên, khung Bắc Mỹ + Trung Mỹ | nhạc nền |
| 2 | ~3–~13 | Sep–Dec | dòng sáng chảy qua eo Trung Mỹ + một nhánh băng vịnh Mexico, tụ ở Nam Mỹ | "Fall" tắt | **trượt chậm xuống nam theo đàn chim** (ƯỚC: khung giữa chỉ còn Nam Mỹ) | nhạc |
| 3 | ~13–~16 | Dec–Feb | Nam Mỹ sáng, Brazil / Argentina | — | đứng ở Nam Mỹ | nhạc |
| 4 | ~16–~26 | Feb–May | chữ **"Spring"**, dòng ngược lên bắc, toả khắp Bắc Mỹ | "Spring" | trượt ngược lên bắc | nhạc |
| 5 | ~26–31,8 | Jun–Jul 29 | Bắc Mỹ lặng (tua nhanh), dòng thu bắt đầu lại; "Fall" hiện → nối vòng | "Fall" mờ dần vào | về khung đầu | nhạc |

**Chữ cố định suốt video** (ƯỚC trên khung 720 → quy ra 1080): nhãn "A YEAR OF MIGRATION" ~22 px, "Barn Swallow" ~42 px, ngày trong vòng ~40 px, chú giải ~18 px, credit ~12 px. **Đều nhỏ hơn luật ≥ 48 px của mình.** Khối chữ nằm ở y ≈ 55–75 % chiều cao, bên trái, **trong vùng an toàn**; "Fall" / "Spring" ~90 px ở y ≈ 18 % (sát mép trên vùng an toàn).

## 2. R4 El Niño 2026 (68,0 s) — mẫu cho phim có lời

![R4 1 s](_work/look/R4-1s.jpg)

| # | Vào–ra (s) | Hình | Chữ trên hình | Lời (tóm tắt) | Máy quay | Kỹ thuật |
|---|---|---|---|---|---|---|
| 1 | 0–3,5 | quả cầu Thái Bình Dương, dòng chảy hạt màu nhiệt, dải "warm water" viền trắng | **EL NIÑO 2026**, "OCT 18, 2026" | hiện tại: nước ấm trải ngang | đứng | T1 dòng chảy hạt, T2 nhãn dải |
| 2 | 3,5–12,5 | **đẩy vào** Peru, ô vuông cam ngoài khơi, chip **+5,2 °C**, nhãn "DESERT FLOODED 1983 AND 1998" | ngày, chip số, nhãn | +5 °C, super El Niño, lụt sa mạc | **zoom vào 1 lần, ease** (~1 s) | T3 chip số đếm |
| 3 | 12,5–19,5 | ngày lùi về OCT 17, 2025, chip −0,5 → −0,2 °C, dải ấm ngắn lại | "BEFORE EL NIÑO" | năm ngoái nước ấm dừng giữa đại dương | đứng | T4 tua thời gian ngược |
| 4 | 19,5–22,5 | nền tối, hạt trắng = gió mậu dịch thổi tây (mũi tên hạt) | "TRADE WINDS BLOW WEST" | gió đẩy nước sang tây | đứng | T5 mũi tên bằng hạt |
| 5 | 22,5–33 | **biến hình** sang mặt cắt dọc xích đạo: thanh mực biển (+59 cm), cột nhiệt đỏ → xanh, vạch 180 m / 30 m | "+59 cm", "180 m", "30 m" | nước dồn cao nửa mét, lớp ấm 180 m vs 30 m | đứng | T6 mặt cắt dọc |
| 6 | 33–48,5 | biến hình sang dải xích đạo nghiêng (cam = lớp ấm sâu), hạt gió, ngày chạy FEB → SEP 2026, chip Peru +3,2 → +4,8 °C | "THE TRADE WINDS FALTER" → "WARM WATER SLIDES EAST" → "THE WARM WATER KEEPS COMING" | gió đổi chiều, nước ấm trượt đông | đứng | T7 dải thời gian, T3 |
| 7 | 48,5–52,5 | mặt cắt lại: lớp ấm gần phẳng (140 m / 140 m) | "THE WARM LAYER LIES ALMOST FLAT" | giờ lớp ấm gần phẳng | đứng | T6 |
| 8 | 52,5–68 | quả cầu + 3 cột 1997 / 2015 / 2026; cột 2026 **mọc theo ngày** (Jul → Oct) tới +3,5 | "EL NIÑO'S YARDSTICK", "WARMER THAN 1997 OR 2015 ON THIS DATE" | so với 2 El Niño mạnh nhất | đứng | T8 cột so sánh mọc theo dữ liệu |

- **Phụ đề:** cháy cứng, **1–3 từ / cụm** (vd. "Right now.", "warm water stretches"), từ khoá tô vàng, trắng đậm có bóng, ~44 px (quy ra 1080, ƯỚC), y ≈ 75 % (ƯỚC, sheet: trong vùng an toàn). **Khớp luật 1–3 từ của mình.**
- **Khung đầu:** quả cầu + "EL NIÑO 2026" + "Right now." — đủ để biết video nói về gì ở frame 0.
- **Khung cuối:** đứng yên trên biểu đồ 3 cột ~3 s sau lời cuối (65,1 s → 68 s); **không nối vòng**, không CTA.

## 3. R7 Drain the Bering Sea (33,1 s) — "một con số chạy"

![R7 1 s](_work/look/R7-1s.jpg)

- **Một cảnh liên tục:** địa hình 3D nghiêng (Blue Marble + ETOPO, độ cao ×12), mực nước hạ dần; vùng đất lộ ra tô **cam theo thời điểm khô** (thang "LAST DRY LAND 21,000 yrs ago → recent" ở góc phải trên).
- **Đồng hồ là con số mực nước** ở góc trái dưới: −20 m → −50 → … → −100 → −290 → −1.570 → −3.860 m, kèm dòng phụ "the sea of 12,000 years ago". Tốc độ hạ **chậm ở đoạn có lời về cầu đất (0–22 s), rất nhanh ở đoạn cuối** (−290 → −3.860 trong ~8 s): lại là thời gian không đều theo ý nghĩa.
- **Khung 0 = −720 m** rồi nhảy về −20 m ở 1 s (ƯỚC): khung đầu mượn trạng thái "đã cạn" để nối với khung cuối (−3.860 m), nhưng **không nối vòng sạch** như R1.
- Nhãn địa danh xuất hiện theo lời ("Asia meets America", "Bering Strait", "Dry from 36,000 years ago", "A route into America", "Beringia", "Bowers Basin"), mỗi nhãn ≤ 5 từ, hộp mờ.
- Máy quay: **đứng yên 0–25 s**, sau đó **lùi / nghiêng chậm** để thấy cả lòng chảo Bowers (ƯỚC, 25–31 s). Một cú di chuyển, có ease.
- Phụ đề: 3–6 từ / cụm, chữ trắng nhỏ ~30 px (quy 1080, ƯỚC) ở y ≈ 52 % — **nhiều chữ hơn và nhỏ hơn R4**.

## 4. R9 Lake Garda (61,9 s, flop)

![R9 2 s](_work/look/R9-2s.jpg)

- Hồ 3D nhìn nghiêng, dòng chảy hạt (xanh / cam theo chiều), gió trên đất liền là vệt trắng mảnh; **5–6 góc nhìn khác nhau** (từ trên, mặt cắt dọc nhánh bắc, toàn hồ) đổi bằng **bay máy quay liên tục** (ƯỚC).
- Chữ nhiều nhất trang: nhãn địa danh, nhãn serif màu ("SURFACE: RUNNING NORTH", "BREEZE: BLOWING SOUTH", "WARM LAYER"), thanh độ dày lớp ấm với 2 số lớn (52 M / 26 M), chú giải 2 màu, ngày giờ góc trên, tiêu đề serif "Why the lake moves".
- Đây là reel **phức tạp nhất về hình và chữ** và cũng **flop nặng nhất** trong nhóm có lời: thêm bằng chứng rằng trên Reels, dữ liệu càng tự nói càng thắng.

## 5. Các reel không lời khác (R2, R3, R5, R6, R8, R10)

| Reel | Khung | Thời gian | Hình | Máy quay | Ghi chú |
|---|---|---|---|---|---|
| R2 Oriole | 9:16 | 1 năm (đồng hồ vòng) | y hệt R1, đổi loài, đổi màu vệt (cam) | trượt theo đàn | cùng template, cùng nối vòng |
| R3 Rivers | **4:5**, nền **kem** | 1 năm (Nov 2025 → Oct 2026) | mọi con sông Bắc Mỹ tô 3 màu theo biển nhận (xanh lá = Thái Bình, cam = Đại Tây, xanh dương = Bắc Cực), **độ đậm = lưu lượng ngày đó**; thanh tích luỹ km³ + bảng m³/s theo đích | đứng yên tuyệt đối | kiểu "tờ báo / infographic", nhiều số nhỏ |
| R5 Mobile Bay · R8 Corpus Christi | 9:16 | 1 tuần, từng giờ | dòng chảy hạt dày đặc màu nhiệt độ nước, sáng hơn khi nhanh; sông nhánh xanh mảnh; đất đen | đứng yên | template "A Week of Currents", tiêu đề serif góc phải |
| R6 PEI · R10 Thổ Nhĩ Kỳ | **4:5**, nền đen | chu kỳ đèn thật | đảo / bờ biển địa hình tối, **chùm sáng quét** theo đúng đặc tính đèn trên hải đồ (đèn quét, đèn chớp, màu vàng / đỏ / xanh) | đứng yên | R6 sáng, đèn dày → đẹp; R10 cả nước Thổ, đèn nhỏ li ti, 80 % khung là đen → flop |

## 6. Kỹ thuật (mã T#) → dựng lại được không

Mức: 🟢 Remotion thuần · 🟡 cần tài sản / dữ liệu · 🟠 cần cài công cụ · 🔴 không nên dựng lại (`studio/KHA-THI.md`).

| T# | Kỹ thuật | Thấy ở | Dấu hiệu nhận ra | Mức | Cách dựng của mình |
|---|---|---|---|---|---|
| T1 | **Dòng chảy hạt** (hàng nghìn hạt để lại vệt, màu theo nhiệt / tốc độ) trên trường vector u/v | R4 R5 R8 R9 | vệt mảnh mờ dần, hạt sinh / chết đều | 🟡 | tiền xử lý NetCDF (NOAA NGOFS2 / OSCAR / Copernicus) bằng Python → lưới u/v theo giờ; vẽ hạt trên `<canvas>` trong Remotion với `random(seed)` và tích phân theo frame (không phụ thuộc frame trước: tính lại từ seed + trường) hoặc vẽ thẳng bằng numpy + Pillow như họ |
| T2 | **Đàn chim mô phỏng** (nhóm chim đặt từ quan sát eBird, nội suy đường bay, vệt sáng cộng dồn) | R1 R2 | "Lines: simulated paths, from reports" | 🟡 | GBIF download (miễn phí, có DOI) → lưới mật độ theo tuần → mô phỏng tác nhân đi theo gradient mật độ (Python) → vị trí theo ngày → render additive blend |
| T3 | Chip số đếm theo dữ liệu (°C, m, m³/s) | R4 R7 R9 | số đổi mỗi frame theo ngày | 🟢 | `Counter` có sẵn + dữ liệu theo ngày |
| T4 | Đồng hồ năm (vòng 12 tháng + ngày giữa), thanh tuần, ngày giờ | R1 R2 R3 R5 | | 🟢 | SVG + `interpolate` |
| T5 | Mũi tên / gió bằng hạt | R4 | | 🟢 / 🟡 | như T1 với trường gió ERA5 |
| T6 | Mặt cắt dọc đại dương / hồ (nhiệt độ theo độ sâu) | R4 R9 | | 🟡 | dữ liệu Copernicus Marine / mô hình hồ → ảnh nhiệt theo ngày → `<Img>` + nội suy |
| T7 | Biến hình giữa các chế độ xem (cầu → mặt cắt → dải) | R4 | | 🟢 | morph bằng `interpolate` trên lưới chiếu (three.js) hoặc crossfade ≤ 8 frame (đúng luật) |
| T8 | Cột so sánh mọc theo ngày | R4 | | 🟢 | |
| T9 | Địa hình 3D nghiêng + hạ mực nước, tô màu theo thời điểm khô | R7 | bóng đổ địa hình thật, đổ dốc | 🟡 | ETOPO 2022 + Blue Marble → three.js mặt lưới (`@remotion/three`, đã dùng ở style M) với shader "mực nước"; hoặc Blender (đã có máy) |
| T10 | Quả cầu dữ liệu có hạt | R4 | | 🟡 | three.js sphere + texture canvas T1 |
| T11 | Chùm sáng hải đăng quét đúng đặc tính, bóng địa hình | R6 R10 | đặc tính "Fl(2) W 10s" | 🟡 | OSM / NGA List of Lights (public domain) → parser đặc tính đèn → vẽ quạt sáng additive trên canvas; bóng địa hình từ DEM |
| T12 | Sông tô theo biển nhận, độ đậm = lưu lượng ngày | R3 | | 🟡 | HydroRIVERS + GloFAS (Copernicus, miễn phí có đăng ký) → SVG path / canvas |
| T13 | Nối vòng bằng chu kỳ dữ liệu (năm, tuần) | R1 R2 R3 R5 R8 | khung cuối = khung đầu | 🟢 | cắt đúng chu kỳ; chữ mùa mờ vào cuối |
| T14 | Thời gian không đều (chậm khi có chuyện, nhanh khi lặng) | R1 R2 R7 | nhãn ngày nhảy không đều | 🟢 | hàm ánh xạ frame → ngày theo "mức hoạt động" của dữ liệu |

**Không có kỹ thuật 🟠 / 🔴.** Họ tự viết bằng Python (repo MIT `transit-reels`: numpy + Pillow + ffmpeg, không thư viện GIS). Rủi ro duy nhất là **thời gian xử lý dữ liệu** (tải, làm sạch, mô phỏng), không phải công cụ.
