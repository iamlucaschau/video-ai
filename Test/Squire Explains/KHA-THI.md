# KHẢ THI — Squire Explains

*Tự sinh bởi `npm run studio:cards -- check` từ `style-card.json`; sửa card, đừng sửa file này. Mức: `studio/KHA-THI.md`.*

**22 kỹ thuật:** 🟢 18 · 🟡 4 · 🟠 0 · 🔴 0

| T# | Kỹ thuật | Mức | Dấu hiệu | Cách của mình | Công cụ | Quyết định |
|---|---|---|---|---|---|---|
| T1 | Nhân vật đầu tròn trắng viền đen, biểu cảm mặt, tay chân khớp, trang phục theo thời kỳ | 🟢 | chuyển động khớp cứng như con rối, mặt thay khung (không nội suy), cùng một đầu cho mọi nhân vật (ƯỚC) | `Style Library/toon-engine/` rig (Lucas duyệt W1 2026-11-03): tay / chân 2 khớp, 9 biểu cảm, đi, gắn đạo cụ; thêm bộ trang phục theo thời kỳ (Look + extra) trong kit style M | — | chờ Lucas |
| T2 | Cảnh nền minh hoạ riêng từng shot (15–25 nền / Short) | 🟡 | mỗi shot một bối cảnh khác, không lặp nền giữa các tập (ƯỚC) | nội thất (lều, nhà, sảnh, hầm) dựng bằng bộ phòng phối cảnh + ánh sáng của toon-engine (W2); ngoại cảnh (núi, chiến trường, biển) = ảnh AI 2D phẳng do Lucas tạo, không người trong ảnh (~5–8 ảnh / Short) | — | chờ Lucas |
| T3 | Đạo cụ / phương tiện vẽ riêng (xe tăng, máy bay, tàu, khiên có hình, huân chương) | 🟡 | vật thể phẳng có viền đen, bay / trượt nguyên khối (ƯỚC) | ảnh AI nền trong suốt (`cutout.py`) hoặc SVG đơn giản trong kit | — | dùng |
| T4 | Phụ đề 1–3 từ IN HOA trắng viền đen giữa khung | 🟢 | OCR: 95–100 % khung có chữ, 2 từ / khung, cao chữ ~50 px (ĐO) | `KaraokeSubs oneLine maxWords={3} maxChars={18}` + skin mới viền đen | — | dùng |
| T5 | Bản đồ giấy ghim tường / đặt bàn, nhãn viết tay, chấm quân, mũi tên + vòng đỏ vẽ dần | 🟢 | giấy có ghim / đèn dầu / cốc cà phê cạnh bản đồ (ƯỚC) | `AtlasMap` (L) / E map story + `evolvePath` (@remotion/paths) + khung giấy | — | dùng |
| T6 | Bảng phấn / sơ đồ chiến thuật (thả bom rồi vòng lên, khối maniple, đồ thị năng lượng) | 🟢 | nét phấn run tay, mũi tên vòng (ƯỚC) | `evolvePath` + `RedRing` (K) | — | dùng |
| T7 | Cắt rộng → cận cùng bối cảnh, nền mờ khi cận | 🟢 | cận mặt có nền nhoè, cùng bố cục với shot trước (ƯỚC) | `camT` (toon-engine) đổi cỡ cảnh bằng hard cut + `Foreground` / blur lớp nền | — | dùng |
| T8 | Đẩy / lia máy chậm trong shot (bản đồ, đám đông, mặt cắt) | 🟢 | cả khung trượt / phóng dần, không có vật nào đứng yên tương đối (ƯỚC) | kỹ thuật có (luật I), nhưng trái luật camera của K và short-form §2 | — | chờ Lucas |
| T9 | Biển nơi · năm nằm trong cảnh (biển gỗ, đá sơn, biển trại) | 🟢 | "SERBIA 1912", "BREGALNICA 1913", "CRNA BEND 1916", "PLATAEA 479 BC" (ƯỚC) | component mới `SignPost` (biển gỗ / đá / bảng) dùng font nhãn của kit | — | dùng |
| T10 | Khung hồi tưởng / nhảy thời gian (ô "LATER…" viền giấy rách, ảnh hồi tưởng ghim, sepia) | 🟢 | viền giấy xé, chữ trong hộp vàng, cảnh sepia (ƯỚC) | SVG khung + `filter: sepia()` | — | dùng |
| T11 | Hiệu ứng truyện tranh: mũi tên đỏ cong, X đỏ, khói, nổ, chữ tượng thanh, dấu ? ! | 🟢 | "BRRRMMM!", "PSSSHHH!", dấu ? đỏ trên đầu (ƯỚC) | `XMark`, `RedRing` (K) + SVG nổ / khói; chữ tượng thanh tính là 1 khối chữ | — | dùng |
| T12 | Bóng đen trên nền mặt trời / màn tách đôi cho cảnh bạo lực | 🟢 | hình đen đặc trước mặt trời đỏ cam (ƯỚC) | SVG fill đen + nền gradient | — | dùng |
| T13 | Đánh dấu "bạn": nhãn YOU + mũi tên trong đám đông, khung ngắm, góc nhìn thứ nhất | 🟢 | nhãn "YOU" nhỏ trên đầu một nhân vật giữa hàng nghìn (ƯỚC) | component mới `YouMark` + khung POV (SVG mask) | — | dùng |
| T14 | Mặt cắt lòng đất / nhìn từ trên xuống | 🟡 | lớp đất có đường hầm, người nhỏ trong hầm (ƯỚC) | ảnh AI mặt cắt (Lucas tạo) + nhân vật code; lia → theo D3 | — | dùng |
| T15 | Giấy tờ trong truyện: giấy triệu tập, báo, cuộn danh dự gạch tên, trang chép tay, đồng hồ | 🟢 | "ПОЗИВ" có dấu đỏ; cuộn "HONOURS" 3 tên + 1 tên gạch (ƯỚC) | `PhotoCard` (J) / thẻ hồ sơ (H) + SVG giấy | — | dùng |
| T16 | Chia khung chéo / răng cưa: hai thực tại cùng lúc | 🟢 | đường chia chéo / răng cưa trắng (ƯỚC) | `clipPath: polygon()` | — | dùng |
| T17 | Màn hình điện thoại "video trên mạng nói…" để bác tin đồn | 🟢 | điện thoại cầm tay giữa khung, các ô video (ƯỚC) | D Text Thread (khung điện thoại) | — | dùng |
| T18 | Ánh sáng không khí: đèn dầu, nắng ngược, mưa, tuyết, bụi, đèn chiếu | 🟢 | quầng sáng ấm quanh đèn, hạt mưa / tuyết rơi đều (ƯỚC) | toon-engine light.tsx / kit.tsx: Glow, Cone, LightVeil, Dust, Rays, Haze, viền sáng rimR / rimL | — | dùng |
| T19 | Con số thành vật trong cảnh (bảng đen "23", vạch khắc báng súng, nến "92", băng rôn "1,100") | 🟢 | số không phải chữ phủ, mà là một phần của cảnh (ƯỚC) | `Counter` + SVG vật mang số | — | dùng |
| T20 | Đám đông nhân bản (hàng trăm nhân vật) + lia ngang | 🟢 | cùng một nhân vật lặp với biến thể nhỏ (ƯỚC) | nhân bản `Hero` (toon-engine) theo `rnd(seed, i)`, đổi Look / màu khiên | — | dùng |
| T21 | Thẻ chú thích bộ phận (vũ khí có nhãn mũi tên) + end screen 2 ô | 🟢 | "POLLAXE" + SPIKE / HAMMER / AXE BLADE (ƯỚC) | `Chip` / `Label` (L) + đường chỉ | — | dùng |
| T22 | Giọng nam Mỹ kể chuyện ~200 wpm, nền −11 dB dưới giọng, SFX dày, master −14 LUFS | 🟡 | ĐO: giọng −14,4 LUFS, nền −25,8, tiếng nhấn 30–40 / phút; giọng người hay AI chưa xác định (Lucas nghe) (ĐO) | Gemini TTS + `tempo`; nhạc + SFX Pixabay (`MusicBed`, `Sfx`); master `render:style` | — | dùng |

## Công cụ

| Công cụ | Cho | Giấy phép / giá | Cài | Nối vào Remotion | Không cài thì | Trạng thái |
|---|---|---|---|---|---|---|
| @remotion/rive | T1 | gói Remotion chính thức (cùng giấy phép Remotion); trình vẽ Rive chạy trên web, bản miễn phí đủ cho rig cá nhân, file .riv của mình | npx remotion add @remotion/rive (giữ cùng phiên bản 4.0.532) | <RemotionRiveCanvas src={staticFile('rigs/x.riv')} /> trong scene; animation / state machine của Rive chạy theo frame Remotion | thay bằng rig code của toon-engine (W1, Lucas duyệt 2026-11-03): không cần cài | ✗ không dùng |
