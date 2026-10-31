# Bóc tách hình ảnh 3 video mẫu (Guilherme Video Editor) — từng giây

*2026-10-30. Luis trích **1 khung / giây** của V01 Odysseus (126 khung) và V03 Moses (177 khung) bằng `npm run sheet:j -- --video …` → `out/sheets/V01-1s-*.png`, `V03-1s-*.png` (V02 = V01 bản tiếng Bồ Đào Nha, cùng hình). Mục đích: học **toàn bộ** cách trình bày, chỉ bỏ phần vi phạm (clip phim có bản quyền). Ảnh trích của bên thứ ba để trong `out/` (không vào git).*

## 1. Kỹ thuật họ dùng (theo mức nổi bật)

| # | Kỹ thuật | Ở đâu (giây) | Mô tả |
|---|---|---|---|
| T1 | **Tô sáng cả vùng** (quốc gia / vùng đất) | V03 15–18, 50–66, 126–170 | Đa giác biên giới tô **vàng đặc ~70 %**, viền trắng phát sáng; **chữ trắng condensed rất to** đặt nghiêng theo dáng vùng ("EGYPT", "PROMISED LAND"); có thể kèm **đồ vật 3D minh hoạ** trên mép vùng (kim tự tháp + tượng nhân sư). Vùng hiện ra bằng phóng to nhẹ |
| T2 | **Tô sáng một hòn đảo / nơi đến** | V01 10 | Phóng sát hòn đảo Ithaca, **đất của đảo sáng rực + viền sáng**, biển xung quanh tối đi; **tên đảo chữ trắng phát sáng cỡ cực lớn, xoay nghiêng** |
| T3 | **Tô sáng biển / lưu vực** | V01 109, 122–125 | Cả Địa Trung Hải tô xanh sáng hơn, viền trắng phát sáng (nhắc lại "toàn bộ vùng hành trình") |
| T4 | **Xem trước cả tuyến ngay trong hook** | V01 6–8 | Trước khi kể, cả tuyến rối rắm của 10 năm vẽ đè lên bản đồ trong ~2 s, rồi tắt |
| T5 | **Phóng cực gần** (cấp thành phố / núi) | V01 15–20 (Ismarus), V03 27–45 (sông Nile, núi Sinai) | Ảnh vệ tinh **độ phân giải cao**, thấy cả nếp núi, đồng ruộng, thành phố; zoom từ cả lục địa xuống ~20 km trong 2–3 s |
| T6 | **Cấp màu tối, tương phản cao** | toàn bài | Biển gần như **đen navy**, sa mạc **cam rực**, viền tối dày ở trên và dưới khung; nơi đang kể sáng như có đèn chiếu |
| T7 | **Sông phát sáng** | V03 155, 167–170 | Một con sông vẽ thành dải sáng xanh trắng phát sáng, có nhãn |
| T8 | **Đường lang thang vòng vèo** | V03 137–153 | "40 năm lang thang" vẽ thành nét đứt **xoắn nhiều vòng** chứ không phải đường thẳng |
| T9 | **Vật di chuyển minh hoạ** | V03 toàn bài | Đoàn người là **hình minh hoạ màu** (nhiều người, áo đỏ trắng), to hơn icon; quân địch là **hàng lính nhỏ** di chuyển (61–69) |
| T10 | **Icon trên bản đồ** | V01 23–24 | Đám mây giông + sét đặt đúng chỗ có bão |
| T11 | **Chuỗi ảnh AI toàn màn hình** | V03 70–100 | **8 cảnh AI liền nhau**, ~3–4 s mỗi cảnh, đẩy chậm, cấp màu tối ấm; đây là đoạn cao trào cảm xúc |
| T12 | **Thẻ trích dẫn văn bản cổ** | V03 101–123 | Nền cuộn giấy cổ tối, chữ serif trắng **hiện dần từng chữ**, ghi nguồn nhỏ ("Numbers 14:21–23") |
| T13 | **Thẻ đa dạng** | cả hai | Thẻ ngang 16:9 cho cảnh rộng, thẻ vuông cho chân dung; đặt trên hoặc dưới ghim; vào bằng **bung ra / lật góc**, ra bằng **nhoè** |
| T14 | **Chữ số hook lớn** | V01 1, V03 3 | "10 Y…", "40 YEARS" chữ cam / vàng condensed, giải mã kiểu glitch, đặt giữa khung |
| T15 | **Nhãn condensed** | cả hai | Chữ in hoa **hẹp, cao** (kiểu Bebas / Oswald) + gạch chân + dòng toạ độ chữ rất nhỏ; xuất hiện bằng dải vàng glitch |
| T16 | **Nét vẽ tay / vệt tốc độ** | V01 7, 57 | Vài nét trắng vẽ tay quanh địa danh, vệt "///" khi đổi cảnh |
| T17 | **Không phụ đề** | V01, V03 | Chỉ có giọng đọc + chữ trên bản đồ |
| T18 | **Dòng ghi chú nhỏ** | V01 9–13, V03 6–11 | Ghi chú cách dựng tuyến / miễn trừ, chữ rất nhỏ ở dưới |
| — | *Clip phim có bản quyền* | V01 phần lớn thẻ, V03 19–26, 30–45 | **Không chép** (luật kênh) |

## 2. Mình đang có gì / thiếu gì

| # | Kỹ thuật | Kênh mình | Làm được không | Cần gì |
|---|---|---|---|---|
| T1 | Tô vùng + chữ to | **✅ 2026-10-30** (`RegionFill`; Ep02 Sicily, Sardinia, "ROME'S SEA") | Có | Đa giác biên giới **Natural Earth** (public domain, ~5 MB) + component `RegionFill` (tô, viền, chữ xoay) |
| T2 | Tô đảo / nơi đến | **✅ 2026-10-30** (`kind="glow"` + `spotlight`; Ý ở Ep01, Ep02) | Có | Như T1 (đa giác đất liền), thêm làm tối phần còn lại |
| T3 | Tô biển | **✅ 2026-10-30** (Ep01 phần trả giá, Ep02 "ROME'S SEA") | Có | Đa giác biển Natural Earth (marine polys) |
| T4 | Xem trước tuyến trong hook | **✅ 2026-10-30** (`RoutePreview`; Ep01, Ep02) | Có, rẻ | Vẽ cả `LEGS` 2 s trong hook rồi xoá |
| T5 | Phóng cực gần | **Không** (Blue Marble chỉ nét tới ~300 km) | Có, nếu đổi nguồn ảnh | **Sentinel-2 cloudless 2016 (EOX)**, giấy phép CC BY 4.0, phải ghi nguồn; các năm sau là CC BY-NC-SA (không dùng được cho kênh kiếm tiền). Cần Lucas duyệt + kiểm điều khoản dịch vụ tải tile |
| T6 | Màu tối tương phản | **✅ 2026-10-30** (bão hoà 0,745, tương phản 0,179 so với mẫu 0,77 / 0,168; dải tối trên + dưới) | Có | Biển tối hơn, viền tối trên / dưới dày hơn trong `SatMap` |
| T7 | Sông phát sáng | Chưa có | Có | Đường sông Natural Earth (rivers) + `GeoLine` dày, màu xanh trắng |
| T8 | Đường vòng vèo | Không cần cho 3 tập hiện có | Có | Chỉ khi câu chuyện là "lang thang" |
| T9 | Vật di chuyển minh hoạ | Icon đơn giản (`Vessel`, `Army`) | Có | Vẽ lại icon chi tiết hơn, hoặc ảnh PNG minh hoạ (AI, nền trong) |
| T10 | Icon thời tiết | Chưa có | Có | Icon mây giông / sóng / lửa (SVG tự vẽ) |
| T11 | Chuỗi ảnh AI | Tối đa 1–2 ảnh / tập (luật Bible §5) | Có | **Đổi luật**: cho phép 1 chuỗi 4–8 ảnh AI ở cao trào; Lucas tạo ảnh |
| T12 | Thẻ trích dẫn | Chưa có | Có | Component `QuoteCard` (nền giấy cổ, chữ serif hiện dần, dòng nguồn). Hợp Ep01 (Aeneid), Ep03 (Pigafetta) |
| T13 | Thẻ đa dạng | Thẻ 4:3 cố định | Có | Thêm tỉ lệ 16:9 / vuông, kiểu vào "lật góc" |
| T14 | Số hook lớn | **✅ 2026-10-30** (`BigWord` / `SubWord` đổi sang Bebas Neue, to hơn) | — | Đổi sang chữ condensed cho giống |
| T15 | Nhãn condensed | **✅ 2026-10-30** (`StopLabel` Bebas Neue 76 px) | Có | Font **Bebas Neue / Oswald** (Google Fonts, OFL) qua `@remotion/google-fonts` |
| T16 | Nét vẽ tay | Có (`Scribble`) | — | Thêm vệt tốc độ khi bay |
| T17 | Không phụ đề | **✅ Đã bỏ** (2026-10-30) | — | — |
| T18 | Ghi chú nhỏ | Có (`SourceLine`) | — | — |

## 3. Đề xuất thứ tự làm

1. **T1–T3 tô vùng / đảo / biển** (Lucas chỉ ra trực tiếp, đối thủ dùng nhiều nhất ở V03). Cần tải Natural Earth (public domain, nhà cung cấp naciscdn.org): `ne_10m_admin_0_countries` 4,9 MB · `ne_10m_land` 3,3 MB · `ne_10m_geography_marine_polys` 0,9 MB · `ne_10m_rivers_lake_centerlines` 2,1 MB, tổng **11,2 MB**.
2. **T15 font condensed + T14 số hook condensed + T6 cấp màu tối**: đổi trong kit, cả 3 tập hưởng.
3. **T4 xem trước tuyến** trong hook.
4. **T12 thẻ trích dẫn** + **T11 chuỗi ảnh AI** (cần đổi luật Bible + Lucas tạo ảnh).
5. **T5 ảnh vệ tinh nét (Sentinel-2)**: tác động lớn nhất cho cảnh gần nhưng việc nặng (dung lượng, giấy phép, ghi nguồn).
6. T7, T9, T10, T13, T16.
