# Phân tích kênh Mapped.Earth (Facebook) — Giai đoạn 1

*2026-11-09, Luis, theo `Style Library/QUY-TRINH-PHAN-TICH.md` (mục 1.1–1.6). Nguồn: trang Facebook https://www.facebook.com/profile.php?id=61594187582735 (Lucas đưa), **toàn bộ 10 reel** của trang tải vào `Test/Mapped Earth/` (git-ignored), cộng trang web mapped.earth, Instagram, YouTube và repo GitHub công khai của tác giả. Số đo máy: `INGEST.md` + `_work/`. Bóc tách: `BOC-TACH-HINH.md` (1.3), `BOC-TACH-KICH-BAN.md` (1.4).*

> **Lucas duyệt 2026-11-09:** D1–D8 theo đề xuất ở §1.5. → Giai đoạn 2: style **O · Data Loop** (`Style Library/O-data-loop/`), bản test `Style-O-DataLoop-Shrike`: một năm di cư của **Bách thanh mày trắng** (*Lanius cristatus*, Brown Shrike; D7: loài tuyến Đông Á ↔ Đông Nam Á, qua Việt Nam, họ chưa làm), dữ liệu GBIF đầy đủ 365.091 quan sát 2016–2025 (eBird 95 %, iNaturalist 2 %), 30 s, không lời. Tự chấm so với nguồn: 84 / 90 (bảng trong `Style Library/O-data-loop/README.md`).

Ký hiệu (xếp theo lượt phát, cao → thấp):

| Mã | Reel | Loại |
|---|---|---|
| **R1** | Barn Swallow, một năm di cư (`1452241487088449`) | vòng lặp dữ liệu, không lời |
| **R2** | Baltimore Oriole, một năm di cư (`28861033983591400`) | vòng lặp dữ liệu, không lời |
| **R3** | Where the Rivers Go, sông Bắc Mỹ đổ ra biển nào (`1663953701927519`) | vòng lặp dữ liệu, không lời, 4:5 |
| **R4** | El Niño 2026 (`1595926421856841`) | phim kể có lời, 68 s |
| **R5** | Mobile Bay, một tuần dòng chảy (`1137282965673455`) | vòng lặp dữ liệu, không lời |
| **R6** | Hải đăng đảo Prince Edward (`1437135608589777`) | vòng lặp dữ liệu, không lời, 4:5 |
| **R7** | Drain the Bering Sea (`1133584212628359`) | phim kể có lời, 33 s |
| **R8** | Corpus Christi Bay, một tuần dòng chảy (`1122933883800791`) | vòng lặp dữ liệu, không lời |
| **R9** | Why the lake moves, hồ Garda (`1039138985866205`) | phim kể có lời, 62 s |
| **R10** | Hải đăng Thổ Nhĩ Kỳ (`2661450940955432`) | vòng lặp dữ liệu, không lời, 4:5 |

## 0. Tóm tắt cho Lucas

1. **Không phải kênh mới thật sự.** Mapped.Earth là thương hiệu của **Aaron J. Becker** (một người, nền tài chính / tối ưu danh mục, tự viết code). Instagram @mapped.earth **207K follower, 300 bài**; trang Facebook này mới đăng reel đầu ngày **2026-11-04** nhưng đã có **184K follower** (nhiều khả năng do Meta đẩy reel của IG sang FB / người theo dõi chéo; ƯỚC). YouTube @mapped-earth chỉ **248 sub**, Shorts vài trăm đến 5,1K view. → Định dạng này **thắng trên Meta (FB / IG), không thắng trên YouTube**.
2. **Hai hit rõ ràng, cùng một công thức:** R1 Barn Swallow **1,3M lượt phát** (×9,5 trung vị trang) và R2 Oriole **1M** (×7,3), đều là **"một năm di cư của một loài chim" trên bản đồ châu Mỹ tối**, 31 s, **không lời đọc, không phụ đề**, chỉ đồng hồ vòng năm + ảnh con chim. Tương tác vượt hẳn các reel khác (reaction / lượt phát ~1,2 %, share ~0,13–0,16 %).
3. **Phim kể có lời thua vòng lặp không lời.** 3 reel có VO (R4 El Niño 250K, R7 Bering 108K, R9 Garda 13K) đứng giữa và cuối bảng; reel dài nhất (Garda 62 s, chủ đề khó: hồ phân tầng) là flop thứ hai. **Top 3 đều không lời** (thêm R3 sông Bắc Mỹ 548K); reel có lời đứng #4, #7, #9.
4. **Nhận diện hình:** nền tối gần đen (trừ R3 nền giấy kem), dữ liệu thật (eBird, NOAA, GloFAS, ETOPO, Copernicus) vẽ thành **hạt / vệt sáng chuyển động** (dòng chảy, đàn chim, chùm đèn hải đăng), máy quay **đứng yên** gần như toàn bộ, chữ ít và nhỏ, credit nguồn ở chân khung, logo "mapped.earth" góc trên. Kiểu "data art" hơn là "bản đồ kể chuyện".
5. **Dựng bằng code, không phải After Effects.** Tác giả công khai repo `transit-reels` (MIT): Python + numpy + Pillow + ffmpeg vẽ từng khung, có sẵn `AGENTS.md` và skill cho Claude Code. Mọi kỹ thuật thấy được dựng lại được bằng **Python tiền xử lý dữ liệu + Remotion (canvas / three.js)** hoặc thẳng bằng Python như họ. Không cần phần mềm trả tiền.
6. **Đề xuất (Lucas chốt ở §1.5):** nếu làm, mở **style mới O (vòng lặp dữ liệu)** và một **format riêng cho Facebook / Instagram Reels**, không nhồi vào J / Mapped Journeys. Video mẫu đầu tiên nên lấy đúng chỗ họ thắng: **một năm di cư của một loài** (dữ liệu eBird / GBIF công khai), 30 s, không lời.

---

## 1.1 Số liệu từng reel và vị trí trong trang

**Ngày lấy số: 2026-11-09 ~14:30 (giờ VN).** Không đăng nhập Facebook.
- **Lượt phát** = số hiện ở tab Reels của trang (ĐO, làm tròn kiểu FB). **View yt-dlp** = `view_count` yt-dlp đọc ở trang reel (ĐO, nhỏ hơn lượt phát ~1,7–2× ở mọi reel, có lẽ là lượt xem tính theo ngưỡng khác lượt phát; dùng để so tương đối).
- **Reaction / comment / share** đọc ở nút của trang reel (ĐO).
- **Giờ đăng** = `timestamp` yt-dlp, UTC (ƯỚC: chưa đối chiếu với nhãn ngày trên trang; R1 và R7 cách nhau 1 phút, có thể đăng hàng loạt).

| Reel | Đăng (UTC) | Tuổi (giờ) | Dài | Khung | Lượt phát | View yt-dlp | Reaction | Comment | Share | Reaction / phát | Share / phát | Hạng | × trung vị | Thứ tự đăng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **R1** Barn Swallow | 11-08 16:21 | ~15 | 31,8 s | 9:16 | **1,3M** | 750.534 | 16,3K | 538 | 2,1K | 1,25 % | 0,16 % | **#1 / 10** | **×9,5** | 9 |
| **R2** Baltimore Oriole | 11-06 16:09 | ~63 | 30,6 s | 9:16 | **1M** | 536.511 | 12,2K | 331 | 1,3K | 1,22 % | 0,13 % | #2 | ×7,3 | 5 |
| **R3** Where the Rivers Go | 11-06 19:46 | ~60 | 24,0 s | 4:5 | 548K | 240.350 | 2,3K | 55 | 521 | 0,42 % | 0,10 % | #3 | ×4,0 | 6 |
| **R4** El Niño 2026 | 11-07 15:24 | ~40 | 68,0 s | 9:16 | 250K | 121.511 | 1,8K | 45 | 427 | 0,72 % | 0,17 % | #4 | ×1,8 | 7 |
| **R5** Mobile Bay | 11-08 03:02 | ~28 | 24,0 s | 9:16 | 166K | 86.084 | 964 | 49 | 226 | 0,58 % | 0,14 % | #5 | ×1,2 | 8 |
| **R6** Hải đăng PEI | 11-05 23:35 | ~80 | 24,0 s | 4:5 | 109K | 42.480 | 2,0K | 25 | 292 | 1,83 % | 0,27 % | #6 | ×0,79 | 4 |
| **R7** Drain the Bering Sea | 11-08 16:22 | ~15 | 33,1 s | 9:16 | 108K | 57.354 | 382 | 22 | 34 | 0,35 % | 0,03 % | #7 | ×0,79 | 10 |
| **R8** Corpus Christi Bay | 11-05 16:53 | ~87 | 24,0 s | 9:16 | 47K | 24.322 | 605 | 14 | 56 | 1,29 % | 0,12 % | #8 | ×0,34 | 3 |
| **R9** Lake Garda | 11-06 08:10 | ~71 | 61,9 s | 9:16 | 13K | 7.380 | 119 | 0 | 9 | 0,92 % | 0,07 % | #9 | ×0,09 | 2* |
| **R10** Hải đăng Thổ Nhĩ Kỳ | 11-04 17:06 | ~110 | 30,0 s | 4:5 | 11K | 5.347 | 152 | 0 | 3 | 1,38 % | 0,03 % | #10 | ×0,08 | 1 |

\* Thứ tự theo timestamp: R10 (11-04), R8, R6 (11-05), R9, R2, R3 (11-06), R4 (11-07), R5, R1, R7 (11-08). Nhịp **~2 reel / ngày**.

- **Trung vị lượt phát của trang: ~137K** (10 reel). R1 + R2 = **65 % tổng lượt phát** (~3,55M).
- **Trang:** 184K follower, 9 following, hạng mục "Graphic designer", 6 đánh giá (86 % recommend), email + web mapped.earth.
- **Cùng nội dung ở nền tảng khác (ĐO 2026-11-09):**
  - **Instagram @mapped.earth: 207K follower, 300 bài** (bio: "Animated maps that move you, drawn by real data"). Đây là kênh chính; FB là bản đăng lại. Số view từng reel IG cần đăng nhập, chưa lấy.
  - **YouTube @mapped-earth: 248 sub, 40 Shorts + vài video ngang.** Cùng đề tài nhưng view rất thấp: Oriole 1,4K, Barn Swallow 263, Bering 1,3K, El Niño 1,4K; cao nhất "California's sea ran a foot above normal" 5,1K, "97 % of land above 5 km is in Asia" 3,8K (`_work/yt-shorts.txt`).
  - Cũng đăng ở Threads, X, Bluesky; web mapped.earth có bản tương tác của hầu hết đề tài (bản đồ hải đăng, sông, lốc xoáy sét, Manhattan theo năm…).

**Hit hay bình thường?**
- **R1 và R2 là hit thật của trang** (×9,5 và ×7,3 trung vị) và **cùng một công thức** ("A year of migration · <loài>"), nên không phải ăn may một lần. R1 đạt 1,3M trong ~15 giờ. Trên YouTube cùng hai video chỉ 263 và 1,4K view: thắng nhờ **thuật toán + khán giả Meta** (người xem chim, người thích bản đồ đẹp), không nhờ tiêu đề.
- Vì sao chim thắng (suy luận, không có Insights): (1) **hình tự kể chuyện không cần chữ**: một dòng sáng chảy từ Bắc Mỹ xuống Nam Mỹ rồi chảy ngược, ai cũng hiểu trong 2 giây; (2) đề tài thân quen, có cảm xúc (con chim ở sân nhà mình bay tới Argentina); (3) **vòng lặp tự nhiên** một năm → khung cuối giống khung đầu, xem lại không thấy chỗ nối; (4) ảnh con chim thật trong khung = người xem chim nhận ra loài của họ → share cao (2,1K).
- **R3 (sông, ×4,0)** cũng là vòng lặp một năm, cũng không lời, nhưng đọc chậm hơn (nền kem nhiều số liệu) → reaction thấp (0,42 %) dù phát nhiều.
- **Reel có lời đọc (R4, R7, R9) không thắng.** El Niño có đề tài thời sự (El Niño 2026 rất mạnh) vẫn chỉ ×1,8; Garda 62 s về phân tầng nhiệt hồ là flop (×0,09). Dòng chảy vịnh (R5, R8) ở giữa: đẹp nhưng không có "câu chuyện".
- **Hải đăng:** PEI tương tác cao nhất trang (reaction 1,83 %, share 0,27 %) nhưng phát ít; Thổ Nhĩ Kỳ (reel đầu tiên, bản đồ quá tối, đèn nhỏ) flop.
- **Cảnh báo:** 10 reel trong 5 ngày, trang mới mở trên FB; follower 184K có thể không đến từ chính 10 reel này. Thứ chắc chắn học được là **cách dựng + loại đề tài thắng trên Meta**, chưa phải tốc độ tăng follower.

## 1.2 Đo kỹ thuật

Nguồn: `INGEST.md` (ĐO). `INGEST.md` đánh số theo tên file: V1 = R9, V2 = R8, V3 = R7, V4 = R5, V5 = R6, V6 = R1, V7 = R4, V8 = R3, V9 = R10, V10 = R2.

| | Dài | File tải | LUFS · true peak · LRA | Cắt cảnh | Lời | wpm | Chữ trên hình: % khung · cao trung vị (px / 1080) · % khối ngoài vùng an toàn | Giọng / nền (LUFS) |
|---|---|---|---|---|---|---|---|---|
| **R1** Barn Swallow | 31,8 s | 720×1280 | −16,1 · −1,4 · 8,4 | 0 | không | — | 69 % · 57 · 0 % | — / −16,1 |
| **R2** Oriole | 30,6 s | 720×1280 | −16,2 · −4,7 · 1,7 | 0 | không | — | 100 % · 54 · 0 % | — / −16,2 |
| **R3** Rivers | 24,0 s | 720×900 | −16,1 · −3,1 · 4,1 | 0 | không | — | 46 % · 22 · 36 % | — / −16,1 |
| **R4** El Niño | 68,0 s | 720×1280 | −16,9 · −4,0 · 3,2 | 0 | 82 % thời lượng | 190 | 100 % · 39 · 48 % | −17,0 / −31,7 |
| **R5** Mobile Bay | 24,0 s | 720×1280 | −15,6 · −1,9 · 4,8 | 0 | không | — | 46 % · 38 · 69 % | — / −16,2 |
| **R6** PEI | 24,0 s | 720×900 | −18,5 · −6,2 · 8,8 | 0 | không | — | 42 % · 24 · 62 % | — / −19,4 |
| **R7** Bering | 33,1 s | 720×1280 | −14,0 · −1,4 · 3,0 | 0 | 87 % | 176 | 100 % · 46 · 10 % | −14,0 / −34,0 |
| **R8** Corpus Christi | 24,0 s | 720×1280 | −15,8 · −1,2 · 4,2 | 0 | không | — | 29 % · 30 · 100 % | — / −16,0 |
| **R9** Garda | 61,9 s | 720×1280 | −13,8 · −1,9 · 3,1 | 0 | 88 % | 181 | 100 % · 30 · 34 % | −13,8 / −36,5 |
| **R10** Thổ Nhĩ Kỳ | 30,0 s | 720×900 | −18,6 · −2,8 · 3,5 | 0 | không | — | 0 % · — · — | — / −18,7 |

- **File tải về là bản FB phát** (720 p, 30 fps, 0,35–2,9 Mbps); độ phân giải gốc không biết. 3 reel **4:5** (720×900), 7 reel 9:16.
- **Không có cú cắt nào** (scene > 0,3: 0 ở cả 10; điểm scene cao nhất 0,033). Không có đoạn đứng hình ≥ 0,5 s. Máy quay trung vị 0,1–0,8 ‰ = đứng yên / rất chậm (ĐO).
- **Âm thanh:** reel không lời = **một bản nhạc nền duy nhất** ~−16 LUFS, không SFX nghe ra (ƯỚC: chưa nghe tai, "tiếng nhấn / phút" của demucs ở các reel này là nhịp nhạc). Reel có lời: giọng nam Mỹ, **176–190 wpm** (nhanh hơn kênh mình ~157), nhạc rất thấp (nền thấp hơn giọng 15–23 dB). Master **−14 đến −18,6 LUFS**, không thống nhất (mình: −14).
- **Giọng thật hay AI:** chưa xác định (mô tả không credit giọng; cần Lucas nghe R4).
- **Chữ:** cao trung vị **22–57 px** trên 1080; chỉ R1, R2 (≥ 54 px) đạt mức ≥ 48 px của mình; R3, R5, R6, R8 có 36–100 % khối chữ **ngoài vùng an toàn** (credit, chú giải sát mép). Logo "mapped.earth" cố định trên mọi reel.
- **Màu:** nền gần đen xanh (`#030B16`–`#111823`) chiếm 44–89 % diện tích ở 9/10 reel; dữ liệu là phần sáng duy nhất (hồng, cam, xanh ngọc theo thang nhiệt). R3 là ngoại lệ nền kem `#DFDBD4`.

## 1.3 Bảng shot — tóm tắt

Chi tiết + dải khung 0–1 s / 3 s cuối: `BOC-TACH-HINH.md`.

- **Mỗi reel = 1 cảnh liên tục** (34 s trung bình). Thay cho cắt: dữ liệu chạy theo thời gian, vài nhãn hiện / tắt, ở reel có lời thì **biến hình** giữa các chế độ xem (R4: cầu → mặt cắt → dải → mặt cắt → cầu, 8 pha / 68 s).
- **Khung 0:** mọi reel mở bằng **dữ liệu đang chạy + tiêu đề đứng sẵn**, không khung đen, không chữ bay vào. R1: "Fall" + đàn chim đang đổ về Mexico ngay frame 0.
- **3 s cuối:** vòng lặp không lời **nối vòng hoàn hảo** (R1: Jul 29 → Aug 1, chữ "Fall" mờ vào cuối). Phim có lời: đứng trên con số so sánh ~3 s, không CTA, không nối vòng.
- **Thời gian không đều** (T12): tua nhanh đoạn lặng, chậm lúc có chuyển động. Đây là thủ pháp biên tập chính của họ.

## 1.4 Kịch bản — tóm tắt

Chi tiết + bảng kiểm chứng 21 dòng: `BOC-TACH-KICH-BAN.md`.

- **7 / 10 reel không có lời đọc.** "Kịch bản" = chọn **một chu kỳ dữ liệu** (năm, tuần, chu kỳ đèn) + tiêu đề 2 tầng + câu bất ngờ ở **caption**.
- **3 reel có lời** (R4, R7, R9): hook = nghịch lý nhìn thấy ngay ở 0,0 s; bắc cầu = lùi về nguyên nhân; kết = con số so sánh. 93–206 từ, 176–190 wpm.
- **Kiểm chứng:** 21 khẳng định: **8 ✓ · 8 ≈ · 0 ✗ · 5 ?** (? = đầu ra mô hình của chính họ). Kênh cẩn thận: ghi "model, not a measurement", DOI, "simulated paths". Chỗ yếu duy nhất: El Niño "+3,5 °C" chọn mốc chuẩn cho số to nhất mà không nói mốc.

## 1.5 Đối chiếu với luật của mình

| Họ làm | Luật của mình | Đề xuất |
|---|---|---|
| Không lời đọc, chỉ nhạc (7 / 10, gồm cả 2 hit) | mọi kênh hiện có đều có VO; phụ đề 1–3 từ (trừ J không phụ đề) | **D2** |
| Chữ 22–57 px, credit / chú giải sát mép, ngoài vùng an toàn | ≥ 48 px, mọi chữ trong x 60–940, y 220–1440 | **giữ luật**: tiêu đề, đồng hồ, nhãn ≥ 48 px trong vùng an toàn; **riêng dòng credit nguồn** được nhỏ (≥ 24 px) nhưng vẫn trong vùng an toàn (D4) |
| Máy quay đứng yên; chim: trượt chậm theo đàn suốt video | không máy quay giả; 1 cú di chuyển có chủ đích | **D5**: cho phép **trượt chậm theo dữ liệu** (không zoom, không rung, ease, theo đúng đối tượng) như ngoại lệ của J / I |
| 0 cú cắt, 1 cảnh liên tục | cắt cứng / crossfade ≤ 8 frame / biến hình vật thể | khớp luật, không cần ngoại lệ |
| Nối vòng bằng chu kỳ dữ liệu | §2.5 Style Library: kết nối vòng | khớp, còn dễ hơn (không cần câu VO bỏ lửng) |
| Nhạc nền, không SFX | SFX thật trước, tối đa 1 / nhịp; nhạc Pixabay **không** dùng (Content ID, memory) | nhạc tự tạo bằng `scripts/make-music.py`; không SFX (đúng luật "đa số nhịp không cần") |
| Số trên hình = dữ liệu thật, ghi nguồn + DOI ở caption | AGENTS §5: số trên hình phải có trong bảng kiểm chứng | thêm vào `checks.md` một dòng **"nguồn dữ liệu + giấy phép + DOI"** cho mỗi reel |
| Đăng FB / IG / Threads / X; YouTube gần như không ai xem | các kênh của mình là YouTube Shorts trước | **D3** |
| 4:5 cho 3 reel | 9:16, 4K mặc định ở J | 9:16 1080×1920 (FB / IG không cần 4K); 4:5 chỉ khi bản đồ ngang (D6) |
| Dữ liệu: eBird / GBIF, NOAA, Copernicus, ETOPO, OSM, GloFAS, HydroRIVERS | chưa có luật dữ liệu | giấy phép: NOAA / NASA / ETOPO public domain; GBIF theo từng bộ (CC0 / CC BY, phải trích DOI); Copernicus miễn phí có ghi nguồn; OSM ODbL ghi nguồn; **HydroSHEDS cần đọc lại giấy phép thương mại trước khi dùng** (D7) |

### Quyết định cho Lucas

- **D1. Làm hay không, và làm gì?** Đề xuất: **làm style mới O "Data Loop"** (vòng lặp dữ liệu), dựng trong Remotion + Python tiền xử lý. Không nhồi vào J / E (khác gốc: J kể một hành trình có lời; O để dữ liệu tự kể).
- **D2. Có lời hay không?** Đề xuất: **tập đầu không lời** (đúng chỗ họ thắng: 2 hit đều không lời), nhạc tự tạo. Lợi lớn: **không phụ thuộc ngôn ngữ**, một reel đăng mọi thị trường, không tốn quota TTS. Phim có lời để sau, chỉ khi có đề tài thời sự (kiểu El Niño).
- **D3. Nền tảng:** đề xuất thử trên **Facebook + Instagram Reels** trước, YouTube Shorts đăng kèm nhưng không làm thước đo (họ: YT ~900 view trung vị vs FB 137K).
- **D4. Ngoại lệ chữ:** dòng credit nguồn ≥ 24 px (chỉ style O); mọi chữ khác giữ luật ≥ 48 px.
- **D5. Ngoại lệ máy quay:** trượt chậm theo dữ liệu (chỉ style O).
- **D6. Khung:** 9:16 1080×1920; 4:5 khi vùng bản đồ ngang.
- **D7. Đề tài đầu tiên:** đề xuất **"một năm di cư của một loài"** nhưng **chọn loài / vùng họ chưa làm** (vd. chim di cư Đông Á – Úc qua Việt Nam, sếu đầu đỏ, choắt mỏ thìa; hoặc châu Âu – châu Phi) để không trùng; dữ liệu eBird / GBIF.
- **D8. Tên kênh:** không quyết ở đây (quy trình P4). Lưu ý: tránh tên gần "Mapped.Earth" và cũng đã có "Mapped Journeys" của mình.

## 1.6 Kết luận

**Điểm mạnh nên học (xếp theo tác động):**
1. **Một chu kỳ dữ liệu = một câu chuyện tự kể**, không cần lời: thu đi, xuân về; triều lên, triều xuống. Người xem hiểu trong 2 giây ở mọi ngôn ngữ.
2. **Nối vòng tự nhiên** nhờ chu kỳ khép kín → xem lại không thấy chỗ nối (FB / IG tính lượt phát lại).
3. **Khung 0 đã chuyển động** + tiêu đề đứng sẵn: không có giây "khởi động" nào.
4. **Thời gian không đều**: dồn thời lượng vào lúc có chuyển động.
5. **Template theo loạt** (A year of migration · <loài>; A week of currents · <vịnh>; Lighthouses of <nơi>): một pipeline → nhiều reel; 2 reel / ngày với một người.
6. **Trung thực về dữ liệu** (mô phỏng hay đo, DOI) tạo uy tín → share cao (R1 2,1K share).
7. Đẹp như tranh: nền gần đen, dữ liệu là phần sáng duy nhất, cộng dồn additive.

**Điểm yếu / lỗi của họ:**
- Chữ nhỏ, credit ngoài vùng an toàn, một số reel (Thổ Nhĩ Kỳ) gần như toàn đen trên điện thoại.
- Phim có lời dài + nhiều số kỹ thuật thì flop (Garda ×0,09).
- Cùng nội dung chết trên YouTube: thuật toán YouTube Shorts không thưởng video không lời / không hook bằng lời; nếu mình nhắm YouTube thì phải thêm hook chữ to ở khung 0.
- Không lỗi sự kiện (✗) nào; chỉ một chỗ chọn mốc chuẩn có lợi.

**Vị trí của mình so với họ:** họ là một người, 2 reel / ngày, đã có 207K IG. Mình không thắng bằng cách làm y hệt trên cùng loài / cùng vịnh. Khác biệt người xem nhận ra được: (1) **vùng địa lý họ chưa phủ** (châu Á, Việt Nam, Úc, châu Phi), (2) chữ to đọc được trên điện thoại, (3) có thể thêm một con số "wow" to ở khung 0 cho bản YouTube. Rủi ro chính là **công xử lý dữ liệu** cho pipeline đầu tiên (ƯỚC 1–2 ngày cho di cư chim), sau đó mỗi loài mới chỉ còn tải dữ liệu + render.

**Tham khảo kỹ thuật:** repo MIT [aaronjbecker/transit-reels](https://github.com/aaronjbecker/transit-reels) (Python + numpy + Pillow + ffmpeg, có `AGENTS.md` cho coding agent) cho thấy cách họ vẽ khung. Nếu Lucas duyệt, thêm vào `reference/README.md` để học cách tổ chức pipeline dữ liệu → khung hình (không chép code vào video của mình khi chưa cần).

**Bước tiếp theo khi Lucas duyệt D1–D8:** Giai đoạn 2: `npm run studio:kit -- new O-data-loop --from "Test/Mapped Earth"`, bản test 20–30 s một năm di cư của một loài.
