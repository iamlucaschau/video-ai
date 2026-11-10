# Phân tích kênh Squire Explains (@SquireExplains) — Giai đoạn 1

*2026-11-02, Luis, theo `Style Library/QUY-TRINH-PHAN-TICH.md`. Nguồn: 11 video tải bằng `npm run studio:ingest` vào `Test/Squire Explains/` (git-ignored): 5 Short (3 nhiều view nhất + 2 mới nhất), **cả 5 video dài**, và 1 Short đầu kênh bị flop để đối chứng. Số đo: `INGEST.md` (tự sinh). Card: `style-card.json`, `formula.json` (Short), `formula-long.json` (video dài, cùng cấu trúc, qua cùng bộ kiểm); bảng khả thi: `KHA-THI.md`. Đi kèm: `BOC-TACH-HINH.md` (1.3), `BOC-TACH-KICH-BAN.md` (1.4). Số liệu chính xác cả kênh (42 video, ngày đăng): `_work/channel-*-exact.tsv`.*

> **Lucas chốt 2026-11-03:** duyệt **D1–D9** theo phương án Luis đề xuất (in đậm ở §1.5): style mới **M "Hoạt Sử"** dựng trên `Style Library/toon-engine/` (rig + phòng + ánh sáng, W1–W2 đã duyệt cùng ngày) · **Short trước**, video dài làm gói sau · camera luật K + 1 ngoại lệ đẩy chậm vào bản đồ / giấy ghim · nội thất bằng code, ngoại cảnh ảnh AI (~5–8 / Short) · nối vòng bằng hình · một font viết tay chỉ trên vật trong cảnh · đề tài chiến tranh hiện đại kể trung lập · demo chủ đề họ chưa làm (Garbo). → Giai đoạn 2: `Style Library/M-hoat-su/`.

Ký hiệu (thứ tự đăng, như `INGEST.md`): **V1** S Fake Army (đối chứng) · **V2** L Elephants · **V3** S Sparta · **V4** L Samurai · **V5** S Kamikaze · **V6** L Knights · **V7** S Serbian · **V8** L Roman · **V9** L Cu Chi base · **V10** S Tunnel dogs · **V11** S Bombers. S = Short 9:16, L = video dài 16:9.

## 0. Tóm tắt cho Lucas

1. **Kênh 35 ngày tuổi, 15.300 sub, 37 Short + 5 video dài, nhiều hit.** Short trung vị **165K**. Ba hit Short (×10,8–23,0 trung vị): giả trai ra trận **3,78M**, kamikaze quay về **1,78M**, kẻ sống sót của 300 **1,77M**. Video dài trung vị 89K, có một hit **1,48M** (Knights, ×16,8) và một hit vừa 327K (Roman, ×3,7). **Kênh đổi công thức ở Short thứ 10** (05/10): 9 Short đầu (~49 s, sự vật kỳ quặc, tiêu đề câu khẳng định) trung vị **9,6K**; 28 Short sau (~70 s, chuyện một người, tiêu đề câu hỏi) trung vị **225K**.
2. **Định dạng Short:** chuyện **một người đi ngược luật của thời đó**. 64–75 s, ~200 wpm. Hook một câu nghịch lý ("tang lễ hai lần khi còn sống"), chuỗi "But… / So…", câu hỏi mở lại ở ~86 %, kết trớ trêu bằng một con số. **Frame cuối = frame 0** (nối vòng bằng hình), không CTA. Hình là hoạt hình 2D vector: nhân vật đầu tròn trắng viền đen, mỗi 2 s một shot, mỗi Short 15–25 bối cảnh vẽ riêng, phụ đề 1–3 từ in hoa. **Video dài:** 9,5–11,7 phút 16:9, kể **ngôi thứ hai** ("Imagine you're a knight…"), mở ở cuối truyện rồi tua lại, chương nhảy theo thời gian, không phụ đề, mô tả có chương + nguồn.
3. **Dựng lại được không:** 22 kỹ thuật: 🟢 18 · 🟡 4 · 🟠 0 · 🔴 0 (`KHA-THI.md`, cập nhật 2026-11-03 sau khi Lucas duyệt W1–W10). Không có 3D, video AI hay ảnh thật. Phần khó là **khối lượng hình**: rig nhân vật có tay chân, trang phục theo thời kỳ (T1, giờ có rig `Style Library/toon-engine/`), và 15–25 nền riêng mỗi Short (T2: nội thất dựng bằng bộ phòng của toon-engine, ngoại cảnh bằng ảnh AI). Không còn công cụ nào phải cài (`@remotion/rive` bỏ, thay bằng rig code).
4. **Đề xuất: style mới (chữ M), dựng trên rig `Chibi` của K + nền ảnh AI 2D phẳng.** Gói format làm **Short trước**, video dài sau. Học nhất: công thức "một người ngược luật" và ngôi thứ hai cho video dài.
5. **Trùng hoặc cạnh tranh:** khán giả trùng với **Mapped Journeys** (tiếng Anh, lịch sử, Short), nhưng câu hỏi gốc và hình khác hẳn (MJ: tuyến đường trên vệ tinh; Squire: số phận một người trong hoạt hình). **Hình** gần style K (Giây Thứ Mười), nhưng thể loại khác (lịch sử thật vs trinh thám hư cấu). Hai video của họ về **địa đạo Củ Chi** (V9, V10) kể từ phía lính Mỹ: chạm thị trường Việt nếu sau này chọn tiếng Việt (D8).

---

## 1.1 Số liệu + vị trí trong kênh

Bảng từng video ở `INGEST.md` §1.1 (lấy ngày 2026-11-02). Cả kênh (yt-dlp, số chính xác, 42 video):

- Kênh mở **2026-09-28**. **Short ~1 video / ngày** (37 trong 35 ngày; có ngày 2 video, nghỉ 09/10 và 29/10). **Video dài mỗi tuần một video, thứ Năm / thứ Sáu** (02, 09, 16, 24, 31/10).
- **Short:** trung vị 164.957 · like / view trung vị 2,28 %. **Video dài:** trung vị 88.859 · like / view 0,34–0,95 %, thấp hơn Short 3–6 lần.
- **Điểm gãy ở Short thứ 10** (Sparta, 05/10):

| | Short 1–9 (28/09–04/10) | Short 10–37 (05/10–01/11) |
|---|---|---|
| Trung vị views | **9.583** | **225.267** |
| Độ dài trung vị | 49 s | 70 s |
| Kiểu chuyện | sự vật / mẹo kỳ quặc, liệt kê sự thật (xe tăng hơi, bom dơi, gấu làm lính) | một người, có cung số phận |
| Tiêu đề | câu khẳng định "The X That…", "America Built…" | câu hỏi "Why / What Happened to / How" |

  Không tách được hẳn "đổi công thức" với "kênh lạnh lúc mới mở", nhưng Short thứ 10 đã đạt 1,77M khi kênh còn ít sub. Nên **đổi công thức là giải thích lớn nhất**. (Short thứ 6, Fake Paris 259K, là ngoại lệ của nhóm đầu.)

**Theo góc kể** (Luis gán, 37 Short; `formula.json` `pillars`):

| Góc kể | Số video | Trung vị views | Ví dụ |
|---|---|---|---|
| Một người sống sót / quay về ngược ý hệ thống | 7 | **692.562** | Kamikaze, 300 Survivor, Stranded Pearl Harbor Pilot, 17-Year-Old Marine |
| Một người lừa / vượt luật bằng mẹo | 4 | **461.471** | Disguised as Her Brother, Trapped Samurai, Prisoner Pretended to Be an Idiot |
| Luật tàn nhẫn của một thời, kể ngôi thứ hai | 2 | 386.255 | Arrested in Samurai Japan, 5 Samurai Laws |
| Người duy nhất / kỷ lục trái khoáy | 12 | 128.695 (từ 05/10: 234.210) | Only Pilot Who Bombed America, Best Spy in the USSR |
| Sự vật / mẹo quân sự, không có nhân vật | 12 | **66.522** (từ 05/10: 101.840) | Fake Paris, Bombers, Tunnel Dogs, Fake Army |

**Tiêu đề** (số chính xác, 37 Short; `INGEST.md` có bản số làm tròn): mở bằng "What Happened to…" 5 video, trung vị **452.828** (các tiêu đề khác 116.146). Mở bằng câu hỏi (Why / How / What / Did / Were) 22 video, trung vị 204.496 (khác: 71.330). Chủ đề Nhật Bản (samurai, kamikaze, Pearl Harbor) 7 video, trung vị 452.828. "The X That / Who…" 3 video, trung vị 3.500. Có con số trong tiêu đề 8 video, trung vị 116K (không có số: 189K). Dưới ~20 video mỗi nhóm nên chỉ là gợi ý.

**Hit hay bình thường?**
- **V7 (×23), V5 (×10,9), V3 (×10,8) là hit kể cả trong một kênh đầy hit.** Cả ba là "một người ngược luật": phụ nữ phải giấu giới tính, phi công phải chết mà không chết, chiến binh sống sót bị coi là hèn. Hook nói kết quả lạ trước, kết đảo ngược bằng một danh hiệu / con số. Không có sự kiện thời sự nào kèm theo mà mình thấy được.
- **V6 Knights (×16,8)** là hit dài duy nhất có tầm cỡ: câu hỏi "vì sao" hẹp + ngôi thứ hai. **V2 Elephants (×0,27)** và **V4 Samurai (×1,0)** là tổng quan ngôi thứ ba: yếu / bình thường. V2 còn là video dài đầu tiên của kênh, khi kênh chưa có sub.
- **V9, V10, V11** mới 1–2 ngày: chưa kết luận. Nhưng V10 / V11 thuộc nhóm "sự vật / mẹo", nhóm có trung vị thấp nhất.
- **Học cái chung**, không học một video: 3 hit Short cùng góc kể "một người", và 2 hit dài cùng ngôi thứ hai.

## 1.2 Đo kỹ thuật

Bảng ở `INGEST.md` §1.2. Kết luận:

- **File:** Short 1440×2560, video dài 2560×1440, đều 30 fps. Họ upload bản 2K, cao hơn mức 1080p phổ biến.
- **Âm:** master **−14,1 LUFS**, true peak −0,8 đến −2,3 dBTP, LRA 2,2–3,1, **trùng chuẩn master của mình**. Giọng −14,4 LUFS, nền (nhạc + SFX) −25,8 LUFS, tức **nền thấp hơn giọng ~11 dB**. Tiếng nhấn ở nền 17–53 / phút (Short hit 31–38): SFX dày, gần như mỗi cú cắt một tiếng (**ƯỚC**: số đo gộp cả nhịp nhạc). **Giọng nam Mỹ, kể chuyện, nhanh** (~200 wpm ở Short, 163–203 ở video dài), cùng một giọng ở mọi video; **chưa xác định người thật hay AI**, cần Lucas nghe.
- **Lời và phụ đề từ frame 0** ở mọi Short; 90–94 % thời lượng có lời.
- **Phụ đề (Short):** cháy cứng, **1–3 từ, IN HOA, trắng viền đen**, sans đen đậm kiểu Montserrat Black. Cao chữ trung vị ~50 px trên khung 1080 (**ĐO**, OCR), giữa khung ở y ≈ 1300 / 1920, **trong** vùng an toàn. V1 (bản đầu) nhấn từ khoá đỏ và có tiêu đề to ở đỉnh khung; sau bỏ cả hai. Video dài **không phụ đề**, chỉ có chữ ở 7–44 % số khung.
- **Chữ khác:** nhãn viết tay kiểu truyện tranh trên bản đồ, biển gỗ, giấy tờ. Nhiều nhãn nhỏ (10 % chữ nhỏ nhất 14–44 px, **ĐO**), có khung 5–11 khối chữ cùng lúc; 2–10 % khối chữ của Short nằm ngoài vùng an toàn.
- **Máy quay (ƯỚC):** khung đứng, đổi cỡ cảnh bằng hard cut; **đẩy chậm vào bản đồ / tranh ghim**; video dài thêm lia ngang qua đám đông và mặt cắt. Không rung, không zoom giật, không motion blur, không xoay.

## 1.3 Shot-by-shot

Đầy đủ trong `BOC-TACH-HINH.md`. Tóm tắt:

- **Khung 0 vẽ đúng nghịch lý của hook** (bàn thờ + phi công còn sống, chia đôi chéo; xe tăng nhấc bằng một tay; hàng khiên Sparta cận mặt). Lời + phụ đề ngay frame 0. Video dài: khung 0 cận mặt / góc nhìn thứ nhất, không chữ.
- **Shot TB 1,8–2,3 s ở Short hit** (31–36 shot / ~65 s), 2,7–3,5 s ở Short khác, 2,0–4,0 s ở video dài. **Cảnh đổi khi ý đổi**: mỗi câu VO 1–2 shot; cắt rộng → cận đúng vào chữ nhấn ("STILL ALIVE.", "YOU DON'T.", "TWICE.").
- **Cả 6 Short nối vòng bằng hình** (frame cuối = frame 0, ≤ 0,5 s sau lời cuối). Video dài kết trên một cảnh tổng / end screen ~15 s.
- Kỹ thuật riêng đáng học: **biển nơi · năm nằm trong cảnh** (T9), **con số thành vật** (nến 92, bảng 23, vạch khắc báng súng; T19), **khung "LATER…"** cho nhảy thời gian (T10), **nhãn "YOU"** chỉ nhân vật giữa đám đông (T13), **bóng đen** thay máu me (T12), **điện thoại "video trên mạng nói…"** để bác tin đồn (T17).

## 1.4 Kịch bản

Đầy đủ trong `BOC-TACH-KICH-BAN.md` (3 câu nguyên văn mỗi video + dịch, nhịp theo %, 81 khẳng định đã kiểm). Tóm tắt:

- **Short:** H nghịch lý 1 câu (0–7 %) → B bối cảnh + luật (7–25 %) → L lật lần 1 (25–45 %) → T tệ hơn / lặp (45–75 %) → Q câu hỏi mở lại hoặc bác tin đồn (75–90 %) → K trớ trêu kết (90–100 %). Câu nối "But / So" mở đầu ~30–40 % số câu. Có câu 2–4 từ đứng riêng ("You don't."). Một con số mỗi 3–5 câu; video flop V1 dày số gấp 2–4 lần. Nhân vật thường không được gọi tên.
- **Video dài:** mở lạnh ngôi thứ hai ở cuối truyện → câu hỏi lớn / tua lại ở 3–5 % → chương 60–90 s có "Remember this…" gieo luật → quay về cảnh mở ở 60–78 % → giải thích + đảo luật → di sản hôm nay + câu châm ngôn. **Hit (V6, V8): 45–47 % câu có "you", không CTA. Yếu / bình thường (V2, V4): 2–5 %, mở bằng mục lục, kết CTA comment.**
- **Kiểm chứng: ✓ 63 · ≈ 14 · ✗ 0 · ? 4** (81 khẳng định). Kênh **chặt** (video dài dán nhãn nguồn trong lời: Livy, Herodotus, Polybius; mô tả có danh sách nguồn). Lỗi: phóng đại ở hook ("lost to soap"), giai thoại kể như sự thật (thoại của Milunka Savić), thứ tự lỏng, số tự đặt (~20.000 mỗi bên ở V8). V5 không nêu tên; tên đúng là **Sasaki Tomoji**.

## 1.5 Đối chiếu với luật của mình

| Họ làm | Luật mình (`AGENTS.md`, `Style Library/README.md` §2) | Đề xuất (D#) |
|---|---|---|
| Phụ đề 1–3 từ IN HOA trắng viền đen, y ≈ 1300 | AGENTS: 1–3 từ, ≤ 18 ký tự, ≥ 48 px, một họ sans 700–800 | **trùng**, giữ (skin mới viền đen); không cần quyết |
| Nhãn viết tay kiểu truyện tranh trên vật trong cảnh, nhiều nhãn 14–40 px, có khung 5–11 khối chữ | mọi chữ ≥ 48 px, ≤ 2 khối ngoài phụ đề, một họ sans | **D7** |
| Đẩy chậm vào bản đồ / tranh; video dài lia ngang đám đông, mặt cắt | cấm máy quay giả; K chỉ cắt rộng ↔ cận | **D3** |
| Nhân vật rig có tay chân, trang phục theo thời kỳ | K có `Chibi` đầu + biểu cảm, chưa có thân khớp | **D4** (🟠 `@remotion/rive` hoặc code) |
| 15–25 nền vẽ riêng mỗi Short | J dùng ảnh AI 1–2 lần / tập; K có 1 phòng SVG | **D5** |
| Frame cuối = frame 0, câu kết gọi lại hook bằng nghĩa, không nối câu | §2.5: nối vòng bằng câu (vế cuối đọc nối vào câu đầu) | **D6** |
| Không CTA ở Short; video dài hit không CTA, video yếu CTA comment | mặc định không CTA | trùng, giữ |
| Bạo lực bằng bóng đen, không máu | §3.4 Bible MJ: hệ quả thay chi tiết | trùng, giữ |
| Chiến tranh hiện đại kể từ phía Mỹ ("enemy", Củ Chi) | chưa có luật cho đề tài nhạy cảm theo thị trường | **D8** |
| Master −14 LUFS, nền −11 dB dưới giọng, SFX dày | −14 LUFS / −1,5 dBTP; SFX thật, tối đa 1 SFX / nhịp | trùng LUFS; SFX: theo luật mình (1 / nhịp, Pixabay) |
| 2 định dạng (Short 9:16 hằng ngày + video dài 16:9 hằng tuần) | gói format của Studio đến nay là Short | **D2** |
| Hình: không ảnh thật, không 3D, không video AI | 🔴 video AI | trùng, không cần quyết |

### Quyết định cho Lucas chốt

| # | Câu hỏi | Phương án (Luis đề xuất **in đậm**) |
|---|---|---|
| **D1** | Làm gì với định dạng này? | **Style mới M (tên tạm "Hoạt Sử"), dựng trên rig `Chibi` của K (chép sang M rồi mở rộng, không sửa K) + nền ảnh AI 2D phẳng** · nâng cấp K thành kit chung (K đang ở phiên khác, chưa commit) · chỉ ghi nhận |
| **D2** | Gói format gồm gì trước? | **Short trước** (công thức "một người ngược luật", bản test 30 s + demo 65–75 s); video dài 16:9 làm thành gói thứ hai sau ≥ 10 Short · cả hai ngay · chỉ Short |
| **D3** | Máy quay style M | **Luật K (khung đứng, cắt rộng ↔ cận) + 1 ngoại lệ: đẩy chậm vào bản đồ / giấy ghim (≤ 5 % / 3 s, như I)**; video dài thêm lia ngang mặt cắt / đám đông (≥ 20 frame, ease, không nảy) · K thuần (chỉ cắt) · như họ |
| **D4** | Rig nhân vật (T1) | **(đổi 2026-11-03) Dùng rig của `Style Library/toon-engine/`** (MIT, từ what-if-animation; tay / chân 2 khớp, 9 biểu cảm, đi, gắn đạo cụ), đầu + trang phục theo thời kỳ vẽ trong kit M · mở rộng `Chibi` của K từ đầu · ảnh AI nhân vật tĩnh tách lớp |
| **D5** | Nền (T2, T14) | **(đổi lần 2, 2026-11-04: nền code cả ngoại cảnh, không ảnh AI)** **(đổi 2026-11-03) Nội thất dựng bằng bộ phòng + ánh sáng của toon-engine; ngoại cảnh là ảnh AI 2D phẳng do Lucas tạo, không người trong ảnh, ~5–8 ảnh / Short** · toàn bộ nền là ảnh AI (~10–14 / Short) · như họ 15–25 nền |
| **D6** | Kết Short | **Nối vòng bằng hình (frame cuối = frame 0) + câu kết gọi lại hook bằng nghĩa; bỏ yêu cầu nối câu §2.5 cho riêng M** · giữ §2.5 (nối câu) |
| **D7** | Chữ trên vật trong cảnh (bản đồ, biển gỗ, giấy) | **Cho phép một font viết tay đậm chỉ trên vật trong cảnh (≥ 48 px, ≤ 4 từ, tính vào ≤ 2 khối)**; phụ đề và mọi chữ khác giữ một họ sans · mọi chữ một họ sans |
| **D8** | Đề tài chiến tranh hiện đại / Việt Nam | **Kể trung lập, gọi đúng tên phe (du kích, quân Mỹ), không dùng "enemy" cho một phía; đề tài Việt Nam chỉ làm khi đã chốt thị trường** · làm như họ |
| **D9** | Chủ đề cho bản test / demo (Giai đoạn 2–3) | **Góc "người sống sót / vượt luật", chủ đề họ chưa làm**, ví dụ: điệp viên Juan Pujol García "Garbo" (được cả Đức lẫn Anh trao huân chương), Jack Churchill (đánh Thế chiến II bằng cung và kiếm) · Lucas chọn |

## 1.6 Kết luận

**Điểm mạnh nên học** (xếp theo tác động):
1. **Câu hỏi gốc "một người ngược luật"**: góc kể này có trung vị 461K–693K, cao gấp 7–10 lần góc "sự vật".
2. **Hook = kết quả lạ, nói ở frame 0, vẽ ở frame 0.** Lý do giấu tới giữa video.
3. **Kết trớ trêu một câu + nối vòng bằng hình**: không CTA, không đọng.
4. **Video dài ngôi thứ hai, mở ở cuối truyện rồi tua lại**, gieo luật bằng "Remember this…". Hai hit dài làm vậy, hai video yếu thì không.
5. **Con số và nơi · năm là vật trong cảnh** (biển gỗ, nến, bảng đen), không phải chip phủ: ít chữ mà vẫn có số.
6. **Nhãn nguồn trong lời + nguồn trong mô tả** (video dài).
7. **Nhịp sản xuất:** 1 Short / ngày + 1 video dài / tuần với hình vẽ riêng: họ có một quy trình (hoặc một đội) rất nhanh (**ƯỚC**).

**Điểm yếu / lỗi của họ (chỗ mình làm tốt hơn):** nhãn chữ nhỏ và dày (dưới 48 px, tới 11 khối cùng lúc); giai thoại không nhãn; không gọi tên nhân vật ở Short (người xem không tra tiếp được; mình đặt tên + năm lên biển trong cảnh); chủ đề nghiêng về Thế chiến II / Mỹ; Việt Nam kể từ phía lính Mỹ; like / view của video dài thấp.

**Vị trí của mình so với họ:** cùng công thức "một người ngược luật" nhưng **chữ to và ít hơn, tên + năm trong cảnh, giai thoại có nhãn nguồn, đề tài rộng hơn Thế chiến II**. Hình dùng rig `Chibi` + nền ảnh AI, nên nhận ra là khác họ ngay ở nét nhân vật. Mạnh hay yếu hơn còn tuỳ chất lượng rig (D4) và nền (D5): đây là rủi ro lớn nhất của style này.

## 1.7 Khả thi + công cụ

`KHA-THI.md` (tự sinh): **🟢 18 · 🟡 4 · 🟠 0 · 🔴 0** (2026-11-03).

- 🟡 **T2 / T3 / T14** cần ảnh AI do Lucas tạo (ngoại cảnh 2D phẳng, đạo cụ nền trong suốt, mặt cắt); nội thất thì không, đã có bộ phòng của toon-engine. 🟡 **T22** cần nhạc + SFX Pixabay (đã có thư viện).
- T1 từ 🟠 thành 🟢: rig code của `Style Library/toon-engine/` (Lucas duyệt W1 2026-11-03). `@remotion/rive` ghi `rejected` trong card (không cần nữa).

**Dừng ở đây để Lucas duyệt D1–D9.** Chưa dựng style, chưa viết code video. Sửa nhỏ ngoài phân tích: `scripts/studio-cards.mjs` `init` bị lỗi EPERM khi chép thư mục `studio/templates/format/` (thêm từ P4); đã sửa cho chỉ chép mẫu `.md`.
