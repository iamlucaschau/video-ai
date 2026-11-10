# Bóc tách hình ảnh 11 video của Squire Explains (mục 1.3)

*2026-11-02, Luis. Ranh giới shot, mức chuyển động: **ĐO** (`INGEST.md` §1.3). Mô tả hình, chữ, máy quay: **ƯỚC** từ sheet 1 khung / giây (`_work/sheets/`, git-ignored), ±0,5 s. Ký hiệu V1–V11 như `INGEST.md`; S = Short 9:16 (1440×2560), L = video dài 16:9 (2560×1440).*

**Bảng shot đầy đủ** làm cho 3 Short thắng nhất (V3, V5, V7). Video dài có 140–360 shot mỗi video, nên làm **bảng theo chương** cho 2 video dài thắng (V6, V8). Các video còn lại chỉ có dải 0–1 s / 3 s cuối và ghi chú.

## 1. Dải khung 0–1 s

| V | Khung 0 có gì | Chữ / số đầu tiên (frame) | Lời bắt đầu (ms) |
|---|---|---|---|
| V1 S | đồng cỏ nắng, lính giơ cao một xe tăng bằng một tay; **tiêu đề to "THIS TANK IS RUBBER"** ở đỉnh khung | tiêu đề có từ f0; phụ đề "THIS" f0 | 0 |
| V2 L | đội kỵ binh La Mã toàn cảnh, nắng sa mạc | không | 0 |
| V3 S | **cận cảnh** hàng khiên Sparta, mặt nhân vật chính giữa, khiên lấp kín khung | phụ đề "YOU'RE" f0 | 0 |
| V4 L | samurai một mình phi ngựa, khói, bình minh hồng | không trong 1 s đầu (lời đọc "Japan, 1274") | 0 |
| V5 S | **chia đôi chéo**: trái bàn thờ có ảnh phi công + bố mẹ quỳ, phải phi công nghiến răng trong buồng lái | phụ đề "JAPAN" f0 | 0 |
| V6 L | **cận mặt** mũ sắt hiệp sĩ, mưa, bùn bắn | không | 0 |
| V7 S | chiến hào hoàng hôn tím–cam, 3 lính bắn, đạn nổ phía trước | phụ đề "THIS" f0 | 0 |
| V8 L | **góc nhìn thứ nhất**: tay cầm kiếm đâm qua mép khiên vào hàng khiên đỏ La Mã | không | 0 |
| V9 L | **cận mặt** lính Mỹ đang ngủ, ánh xanh đêm → mở mắt hoảng ở f6 | không | 0 |
| V10 S | lính Mỹ + chó becgie trong rừng đất đỏ | phụ đề "AMERICA" f0 | 0 |
| V11 S | 3 máy bay ném bom lượn dọc sườn núi xanh, mây | phụ đề "THESE" f0 | 0 |

- Short: **lời và phụ đề từ frame 0**, không im lặng, không logo. Khung 0 là **chính nghịch lý của hook** (tang lễ + người sống; xe tăng nhấc bằng một tay; máy bay + núi).
- Video dài: khung 0 **không chữ**, cận mặt hoặc góc nhìn thứ nhất, đặt người xem *vào* cảnh (khớp với lời "Imagine you're…").

## 2. Dải 3 s cuối

| V | Kết bằng gì | Khung cuối = khung 0? (nối vòng) | Giây im / nhạc sau lời cuối |
|---|---|---|---|
| V1 S | lính chọc xe tăng xẹp "PSSSHHH!", chữ "POKE." đỏ | **có**: khung cuối là đúng khung 0 (tiêu đề + xe tăng) | ~0,3 s |
| V3 S | cuộn danh dự, ngón tay chỉ tên Aristodemus bị gạch, "DIE." | **có** (hàng khiên, "YOU'RE") | ~0,5 s |
| V5 S | ông lão nông dân cười, bánh sinh nhật "92" | **có** (khung chia đôi tang lễ / buồng lái) | ~0,4 s |
| V7 S | cận cô cười, hai huân chương, "TWICE." | **có** (chiến hào hoàng hôn) | ~0,3 s |
| V10 S | cô du kích tắm xà phòng "U.S.", nháy mắt | **có** (lính Mỹ + chó) | ~0,3 s |
| V11 S | phi công cười nửa miệng trong buồng lái | **có** (máy bay + núi) | ~0,5 s |
| V2 L | nhân vật cầm lợn + voi đồ chơi, CTA comment | không | ~3 s, vẫn hình tĩnh |
| V4 L | nhóm samurai trước hoàng hôn núi Phú Sĩ, CTA comment | không | ~3 s |
| V6 L | nhà thờ có mộ Hoàng tử Đen + **2 ô xanh trống cho end screen YouTube** | không | **~15 s** end screen |
| V8 L | lính Latin ngồi giữa bãi chiến trường lúc chiều | không | ~2 s |
| V9 L | mặt cắt: căn cứ trên mặt đất, mạng địa đạo bên dưới | không | ~2 s |

- **Cả 6 Short nối vòng bằng hình**: frame cuối (≤ 0,1 s) là frame 0, nên khi nền tảng phát lại thì chỗ nối không thấy. Lời **không** nối câu (khác luật §2.5 của mình). Câu cuối gọi lại hook bằng nghĩa (xà phòng ↔ "smelled like America"; núi ↔ "nobody saw them coming").
- Video dài kết trên một **cảnh tổng** (mặt cắt, bãi chiến trường) hoặc màn end screen, không nối vòng.

## 3. Bảng shot-by-shot

Mã kỹ thuật T# ở §5. Mức chuyển động **ĐO** (‰ điểm scene): đứng yên < 0,6 · chậm < 4 · nhanh. "Nhanh" ở đây hầu hết là **nhân vật / vật cử động hoặc chữ phụ đề đổi**, không phải máy quay.

### V7 · She Went to War Disguised as Her Brother (64,4 s · 31 shot · TB 2,1 s)

| # | Vào–ra (s) | Dài | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | T# | Dựng lại |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–1,3 | 1,3 | chiến hào hoàng hôn, 3 lính bắn, đạn nổ | phụ đề | hook: người lính không được bị thương | tĩnh, vật nổ (nhanh) | tiếng nổ | T1 T2 T18 | 🟢🟡 |
| 2 | 1,3–2,0 | 0,7 | như 1, sát hơn | phụ đề | | cắt cận | | T7 | 🟢 |
| 3 | 2,0–3,8 | 1,8 | cận cô nhăn mặt né đạn | "WOUNDED," | | tĩnh | | T1 T7 | 🟢 |
| 4 | 3,8–7,8 | 4,0 | lều quân y chữ thập đỏ → cận cô cười gỡ mũ | phụ đề | vì bác sĩ sẽ biết cô là con gái | cắt rộng → cận | | T1 T7 | 🟢🟡 |
| 5 | 7,8–8,9 | 1,1 | làng Serbia, kỵ binh đưa giấy, **biển gỗ "SERBIA 1912"** | phụ đề + biển | 1912 anh trai bị gọi | tĩnh | | T9 T2 | 🟢🟡 |
| 6 | 8,9–9,8 | 0,9 | trong nhà, anh trai trên giường | phụ đề | | tĩnh | | T1 T2 | 🟢🟡 |
| 7 | 9,8–12,5 | 2,7 | cận anh ho, cầm giấy | "TUBERCULOSIS," | lao phổi, chiến tranh sẽ giết anh | tĩnh | ho | T1 | 🟢 |
| 8 | 12,5–13,3 | 0,8 | cận tay đưa **giấy triệu tập "ПОЗИВ"**, dấu đỏ | chữ trên giấy | | tĩnh | | T15 | 🟢 |
| 9 | 13,3–16,2 | 2,9 | đêm, gương, kéo cắt bím tóc (cắt cận) | phụ đề | cô cắt tóc, đi thay | cắt cận | tiếng kéo | T1 T7 T18 | 🟢 |
| 10 | 16,2–20,4 | 4,2 | cô ra đi, mẹ ở cửa sổ → hàng quân, cờ Serbia | phụ đề | phụ nữ không được chiến đấu | tĩnh | | T1 T2 | 🟢🟡 |
| 11 | 20,4–23,5 | 3,1 | cận hai lính, nền mờ; trại ngủ **nhìn từ trên** | phụ đề | ngủ giữa hàng trăm lính | cắt | | T7 T13 | 🟢 |
| 12 | 23,5–27,0 | 3,5 | lính xếp hàng dưới mưa → cận cô, tay đặt lên cổ | "IMAGINE KNOWING ONE…" | một tiếng nói lộ là hết | cắt cận, nền mờ | mưa | T7 T18 | 🟢 |
| 13 | 27,0–28,3 | 1,3 | **chia đôi răng cưa**: chiến hào / lều quân y | phụ đề | mỗi trận là hai cuộc chiến | tĩnh | | T16 | 🟢 |
| 14 | 28,3–30,9 | 2,6 | như 13, địch bắn / bác sĩ vẫy | phụ đề | | tĩnh | | T16 | 🟢 |
| 15 | 30,9–32,4 | 1,5 | **bản đồ giấy ghim bàn**: Kumanovo, Bregalnica, Bitola, nét đứt đỏ | nhãn viết tay | sống qua trận này trận khác | tĩnh | | T5 | 🟢 |
| 16 | 32,4–35,0 | 2,6 | lính tiến qua khói → chỉ huy gắn quân hàm | phụ đề | thăng hạ sĩ | tĩnh | | T1 T11 | 🟢 |
| 17 | 35,0–35,7 | 0,7 | **biển "BREGALNICA 1913"**, chiến hào bao cát | biển | cùng trận đó | tĩnh | | T9 | 🟢 |
| 18 | 35,7–37,1 | 1,4 | lựu đạn rơi, nổ | phụ đề | lựu đạn nổ cạnh cô | tĩnh, nổ | nổ | T11 T18 | 🟢 |
| 19 | 37,1–40,3 | 3,2 | giường quân y, bác sĩ cắt áo, hai người há miệng | "FOUND" | bác sĩ phát hiện | tĩnh | | T1 | 🟢 |
| 20 | 40,3–44,1 | 3,8 | lều chỉ huy, bàn, bản đồ; đưa tạp dề y tá | phụ đề | không phạt, cho làm y tá | cắt rộng ↔ cận | | T1 T7 | 🟢🟡 |
| 21 | 44,1–45,4 | 1,3 | cận cô, băng đầu, nghiêng đầu | "SHE SAID SHE'D" | cô chỉ chiến đấu | cận | | T7 | 🟢 |
| 22 | 45,4–48,3 | 2,9 | cận chỉ huy vuốt cằm → cô khoanh tay "I'LL WAIT." → **đồng hồ bỏ túi** | phụ đề | "để tôi nghĩ" / "tôi đợi" | cắt | tích tắc? | T1 T15 | 🟢 |
| 23 | 48,3–50,4 | 2,1 | tay chỉnh kim đồng hồ → chỉ huy chịu thua, cô bước ra cửa | phụ đề | một giờ sau, gửi ra mặt trận | tĩnh | | T15 T1 | 🟢 |
| 24 | 50,4–51,5 | 1,1 | chiến hào 1914, thùng gỗ ghi "1914" | phụ đề + số | Thế chiến I | tĩnh | | T9 | 🟢 |
| 25 | 51,5–52,8 | 1,3 | **dao khắc vạch đếm lên báng súng** | "AND NINE WOUNDS" | 9 vết thương | tĩnh, tay cử động | | T15 T19 | 🟢 |
| 26 | 52,8–54,6 | 1,8 | cô leo thang ra khỏi hào, băng tay | phụ đề | lần nào cũng quay lại | tĩnh | | T1 | 🟢 |
| 27 | 54,6–56,0 | 1,4 | **tảng đá sơn "CRNA BEND 1916"**, sông, cô núp | đá + phụ đề | 1916 | đứng yên | | T9 | 🟢🟡 |
| 28 | 56,0–57,4 | 1,4 | cô + tù binh giơ tay, **bảng đen "23"** | phụ đề + số | bắt 23 lính một mình | tĩnh | | T19 | 🟢 |
| 29 | 57,4–60,9 | 3,5 | hàng tù binh uốn khúc trên tuyết → lễ duyệt binh, cờ | phụ đề | | tĩnh | | T1 T2 | 🟢🟡 |
| 30 | 60,9–64,0 | 3,1 | **ảnh hồi tưởng** (chỉ huy cầm tạp dề) → gắn huân chương → cận hai huân chương | "TWICE." | đội quân muốn cô làm y tá… hai lần | cắt cận | | T10 T7 | 🟢 |
| 31 | 64,0–64,4 | 0,4 | = khung 0 | | | | | T9 nối vòng | 🟢 |

### V5 · Why This Kamikaze Kept Coming Back... (73,6 s · 32 shot · TB 2,3 s)

| # | Vào–ra (s) | Dài | Hình | Chữ trên màn hình | Lời (tóm tắt) | Máy quay | T# | Dựng lại |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–3,1 | 3,1 | chia đôi chéo: bàn thờ ảnh phi công / phi công trong buồng lái, khói đạn | phụ đề | tang lễ 2 lần khi còn sống | tĩnh, khói | T16 T1 | 🟢 |
| 2 | 3,1–5,6 | 2,4 | cận phi công há miệng trong buồng lái, tàu Mỹ xa | "STILL ALIVE." | | cận | T7 | 🟢 |
| 3 | 5,6–10,8 | 5,2 | đại uý + phi công trong phòng; **tranh ghim tường "LEYTE GULF"**: máy bay lao, nét đứt → đỏ, nổ | nhãn | lệnh: đâm vào tàu | đẩy nhẹ vào tranh (chậm) | T5 T6 | 🟢 |
| 4 | 10,8–12,7 | 1,9 | **bảng phấn**: máy bay thả bom rồi vòng lên | phụ đề | "thả bom rồi quay về" | đứng yên | T6 | 🟢 |
| 5–7 | 12,7–15,7 | 3,0 | bổ nhào qua lưới đạn (nhìn từ trên), tàu chiến, thả bom | phụ đề | lao qua lưới đạn, thả bom | tĩnh, vật bay | T1 T11 | 🟢🟡 |
| 8 | 15,7–21,2 | 5,5 | máy bay hạ cánh sân bay đất đỏ → phi công hộ tống ghi biên bản, cười | phụ đề | báo cáo anh đã đâm thiết giáp hạm | tĩnh | T1 | 🟢🟡 |
| 9–10 | 21,2–23,0 | 1,8 | phát thanh viên trước micro | "JAPAN ANNOUNCED" | Nhật tuyên bố anh tử trận anh hùng | cắt rộng → cận | T7 | 🟢 |
| 11 | 23,0–25,8 | 2,8 | **tờ báo**: ảnh phi công viền đen + tranh máy bay đâm tàu | chữ báo | | tĩnh | T15 | 🟢 |
| 12 | 25,8–31,8 | 6,0 | làng để tang → cung điện đêm, lính mang tin → sĩ quan xem báo, phi công giơ tay "tôi còn sống" | phụ đề | tin lên tới Thiên hoàng; anh xuất hiện | cắt | T1 T2 | 🟢🟡 |
| 13–14 | 31,8–36,7 | 4,9 | 3 sĩ quan cận mặt dồn sát; đại uý chỉ tay | phụ đề | chỉ còn một cách | cắt cận dần | T7 | 🟢 |
| 15 | 36,7–38,6 | 1,9 | cận phi công lo, nền mờ | "YOU WILL" | "lần này anh sẽ chết" | cận | T7 | 🟢 |
| 16–19 | 38,6–44,7 | 6,1 | buồng lái đêm → mưa bão, **mũi tên đỏ vòng quay về** → không kích, máy bay cháy → tiêm kích đuổi | phụ đề | thời tiết, không kích, tiêm kích | tĩnh | T11 T18 | 🟢🟡 |
| 20–21 | 44,7–49,6 | 4,9 | phi công về lại sân bay → nhà tuyết, cha mẹ nhận báo → tờ báo trên tuyết | "EVEN WORSE," "IN DECEMBER" | báo tử lần 2 | tĩnh | T15 T18 | 🟢🟡 |
| 22 | 49,6–51,7 | 2,1 | bàn thờ có **2 ảnh** phi công | phụ đề | tang lễ thứ 2 | tĩnh | T1 | 🟢 |
| 23–25 | 51,7–59,4 | 7,7 | sĩ quan quát; phi công đêm ôm bom cười; **vạch đếm phấn + số "9" vẽ dần** | phụ đề | anh sẽ đi bao nhiêu lần cũng được; 9 lần | tĩnh | T19 T1 | 🟢 |
| 26–28 | 59,4–63,4 | 4,0 | đại uý trên bảng phấn (màu sepia = hồi tưởng) → phi công giơ hai tay | "HE CAME BACK." | và 9 lần anh làm đúng lời đại uý | cắt | T10 T6 | 🟢 |
| 29 | 63,4–70,5 | 7,1 | 2 sĩ quan cúi bàn → **điện thoại cầm tay lướt video** → bóng đen xử bắn tách đôi | "VIDEOS" "FOR COWARDICE." | rốt cuộc thế nào? video trên mạng nói bị bắn | tĩnh, tay lướt | T17 T12 | 🟢 |
| 30–31 | 70,5–73,2 | 2,7 | làng tuyết, anh về quê → cánh đồng, nông dân già → bánh "92" | phụ đề + "92" | về quê, làm nông, 92 tuổi | cắt cận | T19 T7 | 🟢🟡 |
| 32 | 73,2–73,6 | 0,4 | = khung 0 | | | | nối vòng | 🟢 |

### V3 · Why Sparta HATED This 300 Survivor (65,5 s · 36 shot · TB 1,8 s)

| # | Vào–ra (s) | Dài | Hình | Chữ | Lời (tóm tắt) | Máy quay | T# | Dựng lại |
|---|---|---|---|---|---|---|---|---|
| 1–2 | 0,0–5,7 | 5,7 | cận hàng khiên Sparta (hình trên khiên khác nhau) → cận nhân vật dụi mắt, mắt đỏ sưng | phụ đề | bạn là một trong 300, mắt nhiễm trùng | tĩnh, nhân vật động | T1 T7 | 🟢 |
| 3 | 5,7–6,7 | 1,0 | Leonidas + bạn bên tảng đá | "CAN BARELY SEE," | | tĩnh | T1 | 🟢 |
| 4 | 6,7–8,8 | 2,1 | **khung truyện tranh "LATER…"** giấy rách viền: phố Sparta đêm, dân đứng nhìn; cửa gỗ có chữ đỏ "TREMBLER" | "LATER…" + chữ trên cửa | sắp huỷ đời bạn | tĩnh | T10 | 🟢 |
| 5 | 8,8–13,7 | 4,9 | Leonidas → **mũi tên đỏ** chỉ hướng về, bạn đặt khiên xuống | phụ đề | vua cho bạn rời đèo | tĩnh | T1 T11 | 🟢 |
| 6–7 | 13,7–17,6 | 3,9 | **bản đồ giấy cạnh đèn dầu**: THERMOPYLAE, chấm xanh (Ba Tư) vòng sau, chấm đỏ, vòng đỏ vẽ tay, dấu X | nhãn viết tay | Ba Tư bao vây, ai ở lại sẽ chết | đẩy chậm vào bản đồ | T5 | 🟢 |
| 8–11 | 17,6–22,4 | 4,8 | người lính bệnh khác bị bịt mắt, nô lệ dắt quay lại → con đường dẫn về đèo → **cận bạn, mắt sưng, mồ hôi** | "YOU DON'T." | người kia quay lại chết; bạn thì không | cắt cận | T1 T7 | 🟢 |
| 12 | 22,4–25,8 | 3,4 | đêm, bạn đi trên đường uốn khúc về thành, biển "SPARTA" | phụ đề + biển | đi bộ về Sparta | tĩnh | T9 | 🟢 |
| 13–15 | 25,8–33,9 | 8,1 | dân quay lưng → xin lửa bị dập (nước dội) → cửa đóng → trẻ con khắc "THE TREMBLER" lên cửa | phụ đề + chữ khắc | không ai nói chuyện, không ai cho lửa; "Aristodemus kẻ run sợ" | tĩnh | T1 T15 | 🟢 |
| 16–19 | 33,9–39,2 | 5,3 | 3 micro-shot 0,4 s (mùa thu, lá rơi, ăn một mình) → bàn ăn chung, bạn ngồi xa | phụ đề | cả một năm | tĩnh | T1 | 🟢 |
| 20 | 39,2–43,1 | 3,9 | bản đồ: mũi tên đỏ Thermopylae → ghim "PLATAE" | nhãn | Ba Tư quay lại | tĩnh | T5 | 🟢 |
| 21–22 | 43,1–44,7 | 1,6 | đại quân Hy Lạp, sông giữa 2 phe; **biển "PLATAEA 479 BC"** | biển | đạo quân Hy Lạp lớn nhất | tĩnh | T9 | 🟢🟡 |
| 23–24 | 44,7–48,5 | 3,8 | cận bạn đeo mũ, nắm tay → hàng phalanx kín khung | "ONE CHANCE" | một cơ hội lấy lại tên | cắt cận | T7 | 🟢 |
| 25 | 48,5–52,4 | 3,9 | **khung ngắm xanh** quanh khiên của bạn trong hàng → bạn lao ra một mình | "BUT YOU DO." | người Sparta không rời hàng, bạn thì có | tĩnh, nhân vật lao | T13 | 🟢 |
| 26–28 | 52,4–56,8 | 4,4 | **bóng đen đỏ trên nền mặt trời** (đâm chém) → bạn gầm giữa xác khiên → mũ + khiên rơi dưới đèn chiếu | phụ đề | đánh như người không còn gì để mất; bạn chết | tĩnh | T12 T18 | 🟢 |
| 29–30 | 56,8–60,4 | 3,6 | Hy Lạp reo → Herodotus viết cuộn giấy "BRAVEST · ARISTODEMUS" | chữ trên giấy | Herodotus gọi bạn dũng cảm nhất | tĩnh | T15 | 🟢 |
| 31–35 | 60,4–65,1 | 4,7 | hội đồng trưởng lão → **cuộn "HONOURS"** 3 tên + Aristodemus bị gạch đỏ, X đỏ | chữ trên giấy | Sparta từ chối; bạn cố chết quá lộ | cắt cận | T15 T11 | 🟢 |
| 36 | 65,1–65,5 | 0,4 | = khung 0 | | | | nối vòng | 🟢 |

## 3b. Video dài, theo chương

### V6 · Why Knights Stopped Using Shields (563,8 s · 211 shot · TB 2,7 s)

| Chương (mô tả video) | Vào–ra | Hình chính | Chữ | Máy quay | T# |
|---|---|---|---|---|---|
| Mưa tên | 0:00–0:47 | Agincourt mưa: cận mũ, cánh đồng cày, mưa tên vòng cung, **nhãn "YOU" + mũi tên đỏ** chỉ nhân vật giữa hàng nghìn hiệp sĩ, nhãn "ENGLISH ARCHERS" | 2 nhãn | đứng / lia ngang chậm trên đám đông | T13 T18 T20 |
| 1066 khiên diều | 0:47–1:55 | đồi Hastings hoàng hôn, kỵ binh lên đồi, tường khiên, **trang chép tay** (William of Poitiers) | nhãn "WILLIAM" | lia theo kỵ binh | T15 T20 |
| Cái xô sắt + huy hiệu | 1:55–3:02 | lò rèn, mũ kín mặt, huy hiệu trên tường | — | cắt rộng ↔ cận | T1 T2 |
| Hộp thiếc + Crécy | 3:02–4:13 | nỏ thủ Genoa, khiên pavise, **bản đồ Pháp** với tuyến đường | "CRÉCY" "FRANCE" | đẩy vào bản đồ | T5 |
| Giáp trắng | 4:13–5:59 | găng sắt, **thẻ đỏ "POLLAXE" có nhãn SPIKE / HAMMER / AXE BLADE / LONG POLE**, đấu rìu | 4 nhãn | đứng | T21 |
| Agincourt | 5:59–7:34 | quay về cánh đồng mở đầu: mưa, bùn, **nhìn qua khe mũ (màn đen 2 lỗ)**, khối quân từ trên cao | — | góc nhìn thứ nhất; nhìn từ trên | T13 T20 |
| Khiên chưa hết | 7:34–8:37 | **bảng phấn "ENERGY ×10"** (tên vs đạn), tháo giáp từng mảnh, "London Lobsters" | nhãn | đứng | T6 |
| Khiên sống lâu hơn hiệp sĩ | 8:37–9:24 | cảnh sát chống bạo động, logo, mộ Hoàng tử Đen + end screen | "POLICE" | đứng | T21 |

### V8 · Why Breaking the Roman Front Line Was a Death Trap (564,5 s · 142 shot · TB 4,0 s)

| Nhịp | Vào–ra | Hình chính | Máy quay | T# |
|---|---|---|---|---|
| Mở cuối truyện | 0–19 s | góc nhìn thứ nhất sau khiên, La Mã lùi | góc nhìn thứ nhất | T13 |
| Tua lại sáng nay | 19–87 s | 2 đạo quân giống hệt dưới Vesuvius, thầy tế mổ vật, cận người lính cạnh bạn | đứng, cắt cận | T1 T7 |
| Từ trên cao | 87–168 s | **sơ đồ trên giấy cũ: khối chữ nhật xanh / đỏ** = maniple, khe giữa khối | nhìn từ trên, đẩy chậm | T6 T20 |
| Tuyến 1, tuyến 2 | 168–264 s | đám đông hai phe xô khiên, cận mặt mệt, giáo gãy | lia ngang dọc hàng | T1 T20 |
| Sơ đồ đổi tuyến | 264–290 s | sơ đồ khối xanh rút qua khe, khối đỏ bước lên (mũi tên) | đứng | T6 |
| Lão binh đứng dậy | 290–420 s | hàng lão binh quỳ, đứng dậy trong ánh nắng, tường khiên kín | lia chậm, ánh sáng ngược | T18 T20 |
| Giải thích + Cynoscephalae | 420–547 s | sơ đồ khối + phalanx, cận lão binh, trại lính trời xanh | đứng | T6 |
| Kết | 547–564 s | lính ngồi giữa bãi chiến trường | đứng | — |

## 4. Tổng hợp nhịp hình

| | Short hit (V3, V5, V7) | Short khác (V1, V10, V11) | Video dài (V2, V4, V6, V8, V9) |
|---|---|---|---|
| Shot TB (ĐO) | 1,8–2,3 s | 2,7–3,5 s | 2,0–4,0 s |
| Shot dài nhất / ngắn nhất | 7,1 / 0,3 s | 9,8 / 0,3 s | 14–28 / 0,4–1,2 s |
| Shot trong 3 s đầu | 1–3 | 1–3 | 1–2 |
| Khung có chữ (OCR, gồm phụ đề) | 95–97 % | 96–100 % | **7–44 %** (không phụ đề) |
| Khối chữ cùng lúc (tối đa) | 3–7 | 5–11 | 5–12 |
| Đứng yên ≥ 0,5 s | 0 | 0 | 0–41 lần (cảnh tĩnh dài) |

**Loại hình theo thời gian (ƯỚC, Short hit):** cảnh nhân vật trong bối cảnh ~65 % · cận mặt / đồ vật ~20 % · bản đồ / sơ đồ / giấy tờ ~10 % · khung đặc biệt (chia đôi, "LATER…", điện thoại, bóng đen) ~5 %. **Không có ảnh thật, không tranh cổ, không 3D, không video AI.** Mọi thứ là một hệ minh hoạ 2D vector thống nhất.

**Cảnh đổi khi ý đổi**, không theo đồng hồ: mỗi câu VO thường 1–2 shot. Cắt rộng → cận (cùng bối cảnh) để nhấn một chữ ("STILL ALIVE.", "YOU DON'T.", "TWICE."). Nền sau mờ (độ sâu trường ảnh) khi cận.

**Máy quay (ƯỚC):** phần lớn khung **đứng**; nhân vật, vật, hiệu ứng chuyển động. Có **đẩy chậm** vào bản đồ / tranh ghim (V5 sh 3, V3 sh 6–7, V11 bản đồ New Guinea), **lia ngang** trong video dài (đám đông, mặt cắt địa đạo). Không rung, không zoom giật, không motion blur. Chuyển cảnh: hard cut; một lần chia đôi chéo / răng cưa.

## 5. Kỹ thuật (mã T#)

| T# | Kỹ thuật | Video | Cách họ làm (ƯỚC) | Kit mình có gì |
|---|---|---|---|---|
| T1 | Nhân vật đầu tròn trắng, viền đen dày, mắt chấm, lông mày + miệng biểu cảm, thân có tay chân khớp, trang phục theo thời kỳ | cả 11 | rig 2D cắt khớp (puppet), nhiều biểu cảm thay mặt, tay cử động, đi lại | `Chibi` (K): đầu + 5 biểu cảm + miệng theo lời, **chưa có tay / chân khớp, trang phục chỉ màu áo** |
| T2 | Cảnh nền minh hoạ riêng từng shot (chiến hào, làng, lều, cung điện, trời đêm) | cả 11 | vẽ tay vector, gradient trời, cùng một bút pháp; 15–25 nền / Short | `RoomBack` (K) 1 phòng; không có kho nền |
| T3 | Đạo cụ vẽ riêng: xe tăng, máy bay, tàu, khiên có hình, huân chương, bánh sinh nhật | cả 11 | vector | không |
| T4 | Phụ đề 1–3 từ, IN HOA, trắng viền đen, sans đậm (kiểu Montserrat Black), giữa khung y ≈ 1300 / 1920 | Short | cháy cứng, đổi theo cụm từ, không tô màu từ đang đọc (V1 có nhấn đỏ) | `KaraokeSubs` 1 dòng 3 từ (K `CaseSub`) |
| T5 | Bản đồ giấy ghim / đặt trên bàn: nét vẽ tay, nhãn chữ viết tay, chấm quân xanh / đỏ, mũi tên + vòng đỏ vẽ dần | V3 V5 V7 V10 V11 V6 | minh hoạ phẳng + nét vẽ dần | `AtlasMap` (L), E map story; nét vẽ dần `@remotion/paths` |
| T6 | Bảng phấn / sơ đồ chiến thuật trên giấy (máy bay thả bom vòng lên, khối maniple, đồ thị năng lượng) | V5 V6 V8 | nét trắng trên xanh, vẽ dần | `evolvePath`, `RedRing` (K) |
| T7 | Cắt rộng → cận cùng bối cảnh, nền mờ khi cận | cả 11 | 2 khung của một cảnh | `Shot` (K) + `filter: blur` cho lớp nền |
| T8 | Đẩy / lia máy chậm trong shot (bản đồ, đám đông, mặt cắt) | V3 V5 V11, video dài | máy ảo trên cảnh 2D | kỹ thuật có (`camAt` J / luật I) nhưng **trái luật camera K** → D3 |
| T9 | Biển nơi · năm **nằm trong cảnh** (biển gỗ "SERBIA 1912", đá sơn "CRNA BEND 1916", biển "PLATAEA 479 BC") | V3 V7 | chữ viết tay trên vật thể | `Chip` (L chip ngày) — chưa có kiểu "biển trong cảnh" |
| T10 | Khung hồi tưởng / nhảy thời gian: ô truyện tranh "LATER…" viền giấy rách, ảnh hồi tưởng ghim, màu sepia | V3 V5 V7 | lớp phủ + đổi màu | chưa có; `filter: sepia` + khung SVG |
| T11 | Hiệu ứng truyện tranh: mũi tên đỏ cong, X đỏ, khói, nổ, vạch tốc độ, chữ tượng thanh "BRRRMMM!" "PSSSHHH!", dấu ? ! | cả 11 | sprite vector | `XMark`, `RedRing` (K); còn lại vẽ SVG |
| T12 | Bóng đen trên nền mặt trời / màn tách đôi cho cảnh bạo lực | V3 V5 | silhouette thay máu me | SVG fill đen; không cần gì mới |
| T13 | Đánh dấu "bạn" trong đám đông: nhãn "YOU" + mũi tên, khung ngắm xanh, góc nhìn thứ nhất (sau khiên, qua khe mũ) | V3 V6 V8 | lớp phủ | chưa có; dễ |
| T14 | Mặt cắt lòng đất / nhìn từ trên xuống, lia ngang qua các tầng | V9 V10 | minh hoạ dài, máy lia | `FullFrame` (J) + ảnh dài; lia → D3 |
| T15 | Giấy tờ trong truyện: giấy triệu tập "ПОЗИВ", báo, cuộn danh dự gạch tên, trang chép tay, đồng hồ bỏ túi | V3 V5 V6 V7 | vector + font viết tay | `PhotoCard` (J), `Dossier` (H) gần giống |
| T16 | Chia khung chéo / răng cưa: hai thực tại cùng lúc | V5 V7 | mặt nạ đa giác | `clipPath` |
| T17 | Màn hình điện thoại "video trên mạng nói…" để bác tin đồn | V5 | UI điện thoại vẽ phẳng | D Text Thread |
| T18 | Ánh sáng không khí: đèn dầu, nắng ngược, mưa, tuyết, bụi, đèn chiếu | cả 11 | lớp phủ gradient + hạt | hạt bằng `random()`; có sẵn mẫu trong I / J |
| T19 | Con số thành vật trong cảnh: bảng đen "23", vạch khắc báng súng, nến "92", băng rôn "1,100", vạch phấn + "9" | V1 V5 V7 | vật thể mang số | `Counter`; vật thể mới vẽ SVG |
| T20 | Đám đông nhân bản (hàng trăm nhân vật lặp lại) + lia ngang | video dài, V3 | nhân bản rig, đổi màu | nhân bản `Chibi` theo seed |
| T21 | Thẻ chú thích bộ phận (vũ khí có nhãn mũi tên), end screen 2 ô | V6 | thẻ đỏ + nhãn | `Chip`, `Label` (L) |
| T22 | Giọng nam Mỹ kể chuyện, ~200 wpm (Short) / ~185 wpm (dài), nền nhạc thấp −11 dB dưới giọng, SFX dày (~30–40 tiếng nhấn / phút), master −14 LUFS | cả 11 | giọng người (chưa rõ người thật hay AI) | Gemini TTS + `tempo`; `Sfx`, `MusicBed`, `render:style` master −14 |

Mức khả thi từng T#: `style-card.json` `techniques[]` → `KHA-THI.md`.
