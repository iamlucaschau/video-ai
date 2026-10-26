# Phân tích đối thủ: kênh "hành trình trên bản đồ vệ tinh" (Guilherme Video Editor)

*2026-10-26. Nguồn: 3 Shorts Lucas tải về `Test/doi-thu/`. Cách làm: contact sheet mỗi 2 s, khung then chốt ở độ phân giải gốc, đo cắt cảnh (`scene > 0.3`), đo khung đứng yên (`freezedetect`), đo loudness (EBU R128), chép lời bằng Whisper `small` có mốc thời gian từng từ. File làm việc nằm trong `_work/` (git bỏ qua). Video đối thủ chỉ dùng để học, không đăng lại, không đưa lên git.*

## 0. Danh sách và số đo

| # | Video | Ngôn ngữ | Dài | Cắt cảnh | Khung đứng yên | Tốc độ đọc | Loudness |
|---|---|---|---|---|---|---|---|
| V01 | The route Odysseus traveled in the Odyssey (`eXpSbhhFeb8`) | EN | 125.7 s | **0** | **0 s** | 206 wpm | −25.2 LUFS, LRA 3.7 |
| V02 | Cùng video, bản tiếng Bồ Đào Nha (`NR2j4BA89zY`) | PT | 125.7 s | **0** | **0 s** | 207 wpm | −26.0 LUFS, LRA 2.4 |
| V03 | How did Moses and Israel take 40 years… (`v1TaynnAwYU`) | EN | 177.1 s | 8, chỉ ở các đoạn chèn phim/ảnh | 0.6 s | ~200 wpm | −28.4 LUFS, LRA 4.1 |

Cả 3 video dựng bằng **After Effects + GeoLayers 3** (tác giả ghi trong mô tả). Khung tải về là 608×1080. Watermark `@guilherme_publi` luôn nằm ở ~89 % chiều cao.

**Ba phát hiện quan trọng nhất:**
1. **Máy quay không bao giờ dừng.** V01 và V02 không có khung đứng yên nào dài từ 0,5 s trở lên. Cả video là **một cú bay liên tục** trên bản đồ vệ tinh: bay tới điểm dừng, lượn chậm quanh đó, rồi bay tiếp.
2. **Tiêu đề = câu hook = một nghịch lý về thời gian.** "Vì sao mất **10 năm** để về nhà, khi Troy cách Ithaca **vài ngày** đi thuyền?". "Vì sao mất **40 năm**, khi đi bộ chỉ cần **vài tuần**?". Câu trả lời là **chính tuyến đường**, nên người xem phải xem hết tuyến.
3. **Dựng một lần, xuất nhiều thứ tiếng.** V01 và V02 giống nhau về hình (SSIM 0,96). Chỉ đổi giọng đọc, nhãn địa danh (TROY → TRÓIA, POLYPHEMUS → CICLOPES (POLIFEMO)) và thêm phụ đề nhỏ ở bản PT.

## 1. Kịch bản

**Khung chung (cả 3 video):**

| Đoạn | V01 Odysseus | V03 Moses | Thời lượng |
|---|---|---|---|
| **Hook nghịch lý** (= tiêu đề) | 10 năm so với vài ngày | 40 năm so với vài tuần | 0–6 s |
| **Câu bắc cầu** | "Câu trả lời nằm trên tuyến này" | "Câu trả lời còn xa hơn tuyến đường" | 6–11 s |
| **Bối cảnh** | (không có, vào tuyến ngay) | 430 năm nô lệ, Moses gặp Pharaoh (chèn phim) | 11–25 s |
| **Các điểm dừng theo thứ tự** | 17 điểm: Ithaca → Troy → Ismarus → … → Ithaca | Rameses → Biển Đỏ → Marah → Elim → Rephidim → Sinai → Kadesh-Barnea | phần lớn video |
| **Bước ngoặt** | (rải đều: cơn bão, túi gió, người khổng lồ…) | "Nhưng mọi thứ sắp thay đổi": 12 thám tử, 10 người sợ hãi | 56–100 s |
| **Đỉnh cảm xúc** | — | Trích Kinh Thánh (Dân số ký 14:21–23), giọng đọc riêng trên nền cuộn giấy | 100–123 s |
| **Trả giá bằng số** | "20 năm xa nhà: 10 năm chiến tranh + 10 năm lạc trên Địa Trung Hải" | 40 năm lang thang qua Paran, Zin, Edom, Moab | |
| **Câu kết lặp lại hook** | "Lẽ ra vài tuần, thành cuộc *odyssey* 10 năm" | "Lẽ ra vài tuần, thành 40 năm trong hoang mạc" | 5–10 s cuối |

**Điểm đáng học:**
- **Mỗi điểm dừng = một câu, một sự kiện, một hậu quả.** "Tới X, chuyện Y xảy ra, hậu quả Z đẩy họ đi tiếp". Hậu quả của điểm này là lý do để sang điểm sau, nên mạch chuyện không đứt.
- **Nhịp đều:** V01 có 17 điểm trong khoảng 100 s, **~6 s một điểm**. Người xem luôn có nơi mới để nhìn.
- **Từ nối đẩy nhịp:** "next stop", "after that", "on the way back", "once again", "but". Những từ này báo trước một cú bay.
- **Ghi nguồn ngay trên màn hình** (8–10 s): "Route based on Peter Struck's interpretation (University of Pennsylvania), as adapted by the World History Encyclopedia. Other traditions place some of these locations differently." V03 có thêm dòng lưu ý không liên quan tới chính trị Israel–Palestine hiện nay. Cách này chặn tranh cãi trong comment, giống Evidence Gate của dự án.
- **Không có vòng lặp.** Video kết bằng câu chốt có số, không nối lại câu đầu như luật loop ending của mình.

## 2. Ngôn ngữ hình ảnh

### Nền bản đồ
- **Ảnh vệ tinh thật** (kiểu Blue Marble/ESRI): biển xanh navy rất tối, sa mạc vàng cát sáng, núi có bóng địa hình. Mép khung có vignette tối nhẹ.
- **Địa hình 3D nghiêng** khi tới núi: V03 ở núi Sinai (38–44 s) nghiêng máy quay để thấy khối núi nổi.
- Mở đầu ở **toàn châu Âu/Bắc Phi** (thấy vị trí trên thế giới), kết ở toàn Địa Trung Hải có viền bờ biển phát sáng (V01, 122 s).

### Các thành phần đồ họa (bộ kit)

| Thành phần | Cách làm | Ví dụ |
|---|---|---|
| **Tuyến đường phát sáng** | nét đứt trắng, glow mạnh, **vẽ dần** phía sau vật di chuyển; đoạn đã đi vẫn giữ trên màn hình nên người xem thấy cả hành trình rối dần | V01 suốt video; V03 vòng lượn 40 năm (138–150 s) |
| **Vật di chuyển** | biểu tượng nhỏ nhận diện chủ thể: **thuyền buồm đỏ** (Odysseus), **đám đông người Israel** minh họa (Moses) | |
| **Nhãn địa danh** | chấm ghim + gạch chân + chữ **condensed in hoa đậm** (kiểu Bebas Neue/Oswald), dòng nhỏ **toạ độ** "Lat: 38.3677, Lon: 20.7208" bên dưới. Chữ vào bằng hiệu ứng **giải mã** (ký tự vàng nhấp nháy rồi thành chữ trắng) | ITHACA, CAPE MALEA, MOUNT SINAI |
| **Thẻ ảnh có dây nối** | ảnh bo góc, viền trắng mảnh, bóng đổ, hơi nghiêng 3D, **nối với ghim bằng một dây trắng**; nội dung là **clip phim chuyển động** hoặc tranh cổ điển | Polyphemus, Circe, Mount Nebo |
| **Vùng tô màu** | tô vàng bán trong suốt + viền trắng phát sáng; tên vùng là **chữ 3D đùn khối** nằm nghiêng theo mặt đất | EGYPT (có kim tự tháp), PROMISED LAND |
| **Chữ hook** | V01: chữ sans mảnh phát sáng hiện từng ký tự giữa khung. V03: "How did Moses" mảnh + "**40 YEARS**" chữ 3D màu cam rất to | 0–3 s |
| **Biểu tượng trạng thái** | mây giông ở mũi Malea (bão) | V01 22 s |
| **Đoạn chèn toàn khung** | V03: clip *The Ten Commandments* (1956) kèm lower-third tên phim + dải cam "1956 · Adventure/Drama · 3h 40m"; **cảnh minh họa AI** (thám tử, đám đông nổi loạn) 70–99 s; **thẻ trích dẫn** chữ serif hiện dần trên nền cuộn giấy cổ | 18–25 s, 70–123 s |
| **Phụ đề** | **Bản EN không có phụ đề**. Bản PT có phụ đề nhỏ trắng 1 dòng ở ~78 % chiều cao | |

### Typography
- Nhãn bản đồ: condensed in hoa đậm, trắng, nhấn vàng khi mới vào.
- Toạ độ, ghi nguồn, watermark: sans tròn mảnh (kiểu Poppins).
- Trích Kinh Thánh: serif (kiểu Cormorant), chữ thường, căn giữa.

## 3. Chuyển động và nhịp

- **Không cắt cảnh trên bản đồ.** V03 chỉ cắt khi rời bản đồ sang đoạn chèn phim/ảnh AI, rồi quay lại bản đồ.
- **Máy quay liên tục** theo ba kiểu:
  1. **Bay giữa hai điểm**: zoom ra, lia, zoom vào trong 1–2 s. Có motion blur mạnh (nhãn bị nhòe khi bay, V01 28 s và 72 s).
  2. **Lượn chậm** quanh điểm dừng (xoay và đẩy nhẹ) trong lúc thẻ ảnh hiện.
  3. **Nghiêng 3D** khi cần thấy địa hình (núi Sinai).
- Mỗi điểm dừng có cùng thứ tự: tuyến vẽ tới → vật di chuyển tới → nhãn giải mã → thẻ ảnh bật ra trên dây → (sự kiện) → thẻ mờ đi → bay tiếp. Một vòng ~6 s.
- Thẻ ảnh vào bằng **scale + nảy nhẹ**, ra bằng **blur + mờ** (V01 66 s, 92 s).

## 4. Âm thanh

- Giọng đọc ~205 wpm, gần như không nghỉ: V01 có lời đọc 123 / 126 s. (Chất giọng chưa nghe trực tiếp, cần Lucas nghe để mô tả.)
- Đoạn trích Kinh Thánh ở V03 cũng được đọc thành lời, nhưng Whisper chỉ nhận ra khi tắt bộ lọc giọng nói, nên nhiều khả năng giọng này được xử lý khác (vang, chậm, hoặc giọng khác). Âm lượng đoạn này gần bằng giọng chính.
- Master nhỏ (−25 đến −28 LUFS) và nén rất mạnh (LRA 2,4–4,1 LU). YouTube tự chuẩn hóa nên không ảnh hưởng nhiều, nhưng nền tảng khác có thể phát nhỏ hơn đối thủ.
- Nhạc nền và SFX: chưa tách được bằng số đo. Cần nghe để xác nhận có whoosh mỗi cú bay hay không.

## 5. Vì sao định dạng này giữ chân người xem

1. **Câu hỏi nghịch lý ở giây 0** (10 năm hay vài ngày?) và **câu trả lời là tuyến đường**, nên người xem phải ở lại tới điểm cuối.
2. **Tuyến đường tích lũy trên màn hình** cho thấy "đã đi được bao xa, rối tới mức nào". Không cần chữ mà vẫn thấy tiến độ.
3. **Mới mẻ liên tục**: một nơi mới mỗi ~6 s, máy quay không bao giờ đứng yên.
4. **Chuyện quen + bản đồ thật**: khán giả biết Odysseus hay Moses nhưng chưa từng thấy hành trình đó trên bản đồ vệ tinh. Đây là câu "à, hóa ra ở đây" để họ chia sẻ.
5. **Ăn theo sự kiện**: tiêu đề gắn hashtag `#christophernolan`, thẻ ảnh dùng cảnh phim (có vẻ là *The Odyssey* của Nolan) để đón lượng tìm kiếm của phim.
6. **Ghi nguồn học thuật** khiến video đáng tin, ít bị cãi.

## 6. Đối chiếu với luật của dự án (AGENTS.md, Style Library)

| Đối thủ làm | Luật mình | Đề xuất |
|---|---|---|
| Máy quay bay **liên tục**, có motion blur, xoay | Cấm máy quay giả; ngoại lệ style I: bay mỗi lần đổi nơi (≥ 22 frame, không blur, không nảy) + đẩy chậm ≤ 5 %/3 s | **Đã quyết (Lucas, 2026-10-26):** nới như mẫu, **chỉ cho style J** (xem §8.2). Style A–I giữ nguyên |
| **Clip phim có bản quyền** (*The Odyssey*, *The Ten Commandments*) | Không có luật riêng | **Không dùng clip phim.** Thay bằng tranh cổ điển public domain (bảo tàng), ảnh minh họa AI tự tạo (như V03 làm ở 70–99 s), hoặc nhân vật của kit |
| Bản EN **không có phụ đề** | Phụ đề bắt buộc (karaoke) | Giữ phụ đề karaoke của mình. Đây là điểm mình hơn đối thủ khi xem không tiếng |
| Chữ serif cho trích dẫn | Một họ sans 700–800, không serif cho khối chữ | Trích dẫn dùng sans của kit, ≤ 5 từ mỗi lần. Câu dài để giọng đọc và phụ đề mang |
| Toạ độ chữ rất nhỏ (~10 px), ghi nguồn chữ nhỏ | Mọi chữ ≥ 48 px | Toạ độ là trang trí, không phải thông tin. Có thể giữ nhỏ như hoa văn, hoặc bỏ. Dòng ghi nguồn đưa vào mô tả video và comment ghim |
| Nhãn và thẻ đặt sát mép, có lúc ở y > 1440 | Vùng an toàn x 60–940, y 220–1440 | Dùng `ZONE` của style I |
| Không vòng lặp | Loop ending (Style Library §2.5) | Câu kết lặp lại hook rất hợp để nối vòng: "…và đó là lý do" → "Vì sao Odysseus mất 10 năm…" |

## 7. Dựng bằng Remotion: tận dụng gì, phải làm mới gì

**Có sẵn trong kit I Toy Atlas** (`Style Library/I-toy-atlas/toy-atlas.tsx`):
- Camera địa lý `GeoCam` + `camAt` / `seamKeys` (bay giữa các điểm, đẩy chậm, khung cuối = khung đầu).
- `Route` + `Ship` + `routeHead` (tuyến vẽ dần, vật chạy theo), `Track` (đường phát sáng), `Pulse`.
- `RegionFill` / `CountryShape` (vùng tô), `ImgSticker`, `AtlasSub` + `KaraokeSubs`.
- Dữ liệu `world-atlas` + `d3-geo` + `topojson-client` đã cài.

**Phải làm mới (đề xuất style J "Satellite Journey"):**
1. **Nền vệ tinh dạng ảnh raster.** Cần chọn nguồn **có giấy phép dùng thương mại**: NASA Blue Marble (public domain, đủ nét cho cảnh cả vùng) cho cảnh xa; khi zoom sâu cần nguồn nét hơn (vd. Sentinel-2 cloudless của EOX, phải kiểm tra giấy phép theo từng năm dữ liệu). Bóng địa hình có thể tự tạo từ DEM SRTM (public domain). **Không** lấy tile Google/Mapbox vì điều khoản cấm. Ảnh nền ghép sẵn theo khu vực từng tập rồi chiếu bằng cùng phép Mercator của `toScreen`.
2. **`GlowRoute`**: nét đứt phát sáng, đoạn đã đi giữ lại, nhiều chặng nối nhau theo dữ liệu.
3. **`StopLabel`**: ghim + gạch chân + chữ in hoa, hiệu ứng giải mã ký tự (theo frame, dùng `random()` của Remotion), có thể kèm toạ độ.
4. **`PhotoCard`**: thẻ ảnh có dây nối về ghim, vào bằng scale (overshoot ≤ 5 %), ra bằng mờ. Không blur.
5. **`RegionLabel3D`**: tên vùng chữ đùn khối nghiêng theo mặt đất (CSS 3D hoặc nhiều lớp đổ bóng).
6. **Dữ liệu tập dạng JSON**: danh sách điểm dừng `{ id, name, lon, lat, voLine, image }`. Camera, tuyến, nhãn, thẻ ảnh đều **tự tính từ JSON + mốc giọng đọc**, giống mẫu `PriceTheirWork` (đổi giọng thì video tự canh lại).
7. **Đa ngôn ngữ**: nhãn và phụ đề lấy từ file dịch theo ngôn ngữ. Cùng một composition, đổi `lang` qua props để xuất bản EN / VI / PT, như đối thủ làm.

**Bỏ qua:** nghiêng 3D địa hình thật (cần engine 3D, tốn công; để sau, có thể thử `@remotion/three`) và motion blur.

## 8. Bước tiếp theo

**Lucas cần quyết:**
1. **Chủ đề và ngôn ngữ của kênh mới.** Chủ đề: **hành trình lịch sử/huyền thoại trên bản đồ vệ tinh**. Ngôn ngữ: **tiếng Anh** (Lucas, 2026-10-26).
2. **Máy quay: nới như mẫu, chỉ cho style J** (Lucas, 2026-10-26). Style J được bay liên tục, lượn quanh điểm dừng, nghiêng 3D và có motion blur khi bay, giống đối thủ. Vẫn không rung, không lắc. **Không áp dụng cho style A–I**: các style đó giữ nguyên luật hiện tại (AGENTS.md, Style Library §2.2). Khi tạo thư mục `Style Library/J-satellite-journey/`, ghi ngoại lệ này vào README của J và vào §2.2 của Style Library.
3. **Thay clip phim bằng gì**: Lucas duyệt đề xuất ở §9 (2026-10-26).

**Đang làm:** bản test style J (Aeneas, 4 điểm dừng) ở `Style Library/J-satellite-journey/`, composition `Style-J-SatelliteJourney-Aeneas`.

## 9. Thay clip phim (Lucas duyệt 2026-10-26)

Chia hình ảnh theo **chỗ dùng**, mỗi chỗ một nguồn:

| Chỗ dùng | Nguồn | Vì sao |
|---|---|---|
| **Thẻ ảnh ở điểm dừng** (phần lớn video, ~1 thẻ / 6 s) | **Tranh và tranh khắc cổ điển public domain** từ kho mở của bảo tàng: Met Open Access, Rijksmuseum, Art Institute of Chicago, National Gallery of Art (đều CC0), Wikimedia Commons (PD-Art). Ghi nguồn từng ảnh vào `sources.md` của tập | Thật, có "trọng lượng" lịch sử, miễn phí, hợp pháp. Odysseus, Moses, Aeneas, Alexander… đều có hàng trăm bức. Chính đối thủ cũng dùng tranh cho nhiều điểm (Aeolus, Thrinacia) |
| **Khoảnh khắc đỉnh** (1–2 lần mỗi video, toàn khung 5–15 s, như V03 70–99 s) | **Ảnh minh họa AI tự tạo**, một bộ prompt chung cho cả kênh (ánh sáng điện ảnh, cùng bảng màu), đặt trong thư mục tập như `image-prompts.md` của Map | Tạo đúng cảnh mình cần mà tranh cổ không có. Một khung toàn màn hình đổi nhịp cho người xem sau một chuỗi điểm dừng |
| **Điểm không có tranh, không đáng làm ảnh AI** | Không dùng thẻ; chỉ nhãn + biểu tượng trên bản đồ (mây bão, sóng, ngọn lửa) | Giữ nhịp, đỡ tốn công |

Chi tiết:
- **Làm tranh "sống" trong Remotion mà không cần video:** cắt nền nhân vật (`scripts/cutout.py`), tách 2–3 lớp rồi trượt lệch nhau (parallax), kết hợp ánh sáng quét nhẹ. Như vậy thẻ ảnh chuyển động giống clip phim của đối thủ.
- **Đồng bộ màu:** phủ một lớp grade chung (ấm, tương phản vừa) lên mọi tranh, để các bức từ nhiều thế kỷ trông cùng một bộ.
- **Nhãn AI:** ảnh AI trông như ảnh thật thì khi đăng YouTube phải bật mục khai báo nội dung tổng hợp (altered or synthetic content). Tranh vẽ rõ là tranh thì không cần.
- **Không dùng:** clip phim, trailer, ảnh lấy từ Google Images, stock video. Không dùng ảnh AI bắt chước phong cách một họa sĩ còn sống.

**Sau khi có quyết định:** dựng một **test 20–30 s** (3–4 điểm dừng của một hành trình) làm style J trong `Style Library/J-satellite-journey/`, rồi qua Cổng Test như các style trước.
