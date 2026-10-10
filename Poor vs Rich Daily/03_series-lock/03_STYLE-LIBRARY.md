# 03 — THƯ VIỆN PHONG CÁCH (Style Library)

**Bản gốc của mọi phong cách: `Style Library/` ở gốc dự án (dùng chung cho mọi dự án, Lucas 2026-10-09).** File này là bản áp dụng cho PvR: bất biến của series, ghi chú riêng và bảng chọn. Style mới thêm vào `Style Library/` trước.

*Chốt 2026-10-07 (Lucas): series dùng **cả 4 phong cách** A–D; thêm **E "Map Story"** 2026-10-08; thêm **F "Atomic Retro", G "Hologram HUD", H "Paper Dossier"** 2026-10-09 (phân tích từ video mẫu). Mỗi tập Claude đề xuất phong cách hợp với kịch bản; kịch bản không hợp phong cách nào thì Claude đề xuất phong cách mới. So sánh cùng một khoảnh khắc ("Almost double", Ep02): `episodes/ep02-give-discounts/test/style-library-A-B-C-D.jpg`.*

## 1. Bất biến chung (mọi phong cách)

- 1080×1920, 30fps, VO + 1.5 s đọng (tập có kết nối vòng: cắt 0.2 s sau chữ cuối, xem bên dưới); hard cut giữa các scene
- **Khung hình đứng yên**: không máy quay di chuyển (không trôi, rung, lia, zoom, push-in). Chỉ vật thể trong khung chuyển động
- POOR luôn đỏ `#D32F2F`, RICH luôn xanh lá `#388E3C`, nhân vật phụ trung tính
- Font Bricolage Grotesque 700/800 (A thêm Space Mono cho hóa đơn)
- **Phụ đề bắt buộc** ở y≈1600, cụm ≤ 30 ký tự, số tiền viết bằng số
- Mọi con số trên màn hình nằm trong FINAL hoặc bảng kiểm toán số. Phép tính hiện từng bước, mỗi chữ cue theo timestamp VO
- Âm thanh: VO −14 LUFS, nhạc nền ≈ −24 LUFS, đổi sắc thái ở câu transition
- Cùng một bộ VO, phụ đề và nhạc có thể dựng ra bất kỳ phong cách nào (`EpisodeCut` trong `src/series/pvr/cut.tsx`)

### Quy tắc short-form (Lucas, 2026-10-08) — áp dụng mọi phong cách, từ Ep04
1. **Vùng an toàn:** mọi chữ, số, khuôn mặt, hình chính nằm trong **x 60–940, y 220–1440** (lề trên 220 · dưới 480 · phải 140 · trái 60) để không bị menu trên, caption/tên tài khoản/thanh tiến trình dưới và cột nút bên phải che. Nền được tràn ra ngoài, thông tin thì không. QA bằng ảnh có lớp phủ `safeGuide` (vùng đỏ = nguy hiểm).
2. **Không máy quay giả:** không chuyển cảnh kiểu zoom, không rung/lắc/trôi, không rung khi tập trung vào vật. Chuyển cảnh = hard cut, crossfade ≤ 8 frame, hoặc chính vật thể di chuyển/biến hình. Ngoại lệ chỉ khi phong cách cho phép một cú máy có chủ đích (vd. E bay giữa hai địa điểm): một lần, ease mượt, ≥ 20 frame, không nảy, không rung.
3. **Ít chữ:** không đưa nguyên câu VO lên màn hình thành dải chữ (phụ đề đã làm việc đó) — chỉ hiện **từ khóa hoặc con số**. Mỗi khối chữ ≤ 5 từ; tối đa 2 khối chữ cùng lúc ngoài phụ đề; không đoạn văn, không khối 2 dòng; phụ đề 1–3 từ một lần. Một họ font sans, đậm 700–800, ≥ 48 px; không font serif "điện ảnh" cho khối chữ.
4. **SFX thật:** chỉ dùng thư viện Pixabay trong `public/sfx/` (whoosh, click, flash, shutter, progress, deep hit, hit) qua `<Sfx>`, cân về −15 LUFS, gần ngang VO để làm điểm nhấn (−26 và −18 đều quá nhỏ); không SFX tự tổng hợp, không âm thanh hoạt hình; tối đa 1 SFX mỗi nhịp.
5. **Kết nối vòng (Lucas, 2026-10-09, từ Ep04):** câu cuối VO là vế bỏ lửng nối vào thesis hook thành một câu đúng nghĩa, để vòng phát lại liền mạch (luật đầy đủ: `Style Library/README.md` §2.5; cách viết: master prompt viết kịch bản, Beat 6). Dựng: timing JSON có `"loop": true` (xuất bằng `node scripts/episode.mjs export "<tập>" --loop`) → video cắt 0.2 s sau chữ cuối thay vì đọng 1.5 s (`PVR.loopTailSeconds`); không fade nhạc, khung cuối trở về bố cục khung hook.

**Hệ quả cho từng phong cách:** A — hóa đơn nằm trọn trong vùng an toàn, dòng hóa đơn ≤ 5 từ; B/C — HUD, nhãn, bảng quest dời vào trong (không chạm cột nút phải); D — tin nhắn ≤ 5 từ, bỏ các dải câu kết lặp lại VO, header app nằm dưới y 220; F/G/H — bỏ phụ đề 2 dòng giữa màn hình của video mẫu, dùng phụ đề chuẩn của series; nhãn ≥ 48 px, Bricolage (không serif máy chữ, không monospace nhỏ).

## 2. Các phong cách

### A — "Receipt × Paper"
- **Look:** diorama giấy kraft, con rối giấy, máy in hóa đơn nhiệt nhả phép tính, bảng ghim, câu đắt trên giấy xé; stop-motion 12 fps
- **Mạnh:** ấm, thủ công, có nhân vật diễn xuất; hóa đơn hợp với chuỗi phép tính dài, nhiều dòng
- **Yếu:** chữ hóa đơn nhỏ; chậm đọc trên điện thoại
- **Code:** `src/series/pvr/paper.tsx`, `motion.tsx` · mẫu: Ep01, `ep02/`

### B — "Chip Table"
- **Look:** bàn chơi tối, tiền là chồng chip vàng, nhân vật là quân cờ có mặt. **1 chip = một đơn vị chung của các con số** (Ep02: $6), nên chiều cao chồng chính là phép tính
- **Mạnh:** so sánh số lớn hiện ra bằng mắt (tháp $126 vs $66); sang, tương phản mạnh
- **Yếu:** cần các con số có ước chung đẹp (≤ ~25 chip mỗi tháp); ít bối cảnh
- **Code:** `src/series/pvr/styles/chipTable.tsx` · mẫu: `ep02b/`

### C — "Street Sim"
- **Look:** game quản lý trên bản đồ isometric ban ngày: HUD tiền số chạy, số +/− bay lên tại chỗ, xe chạy trên đường, cờ SIGNED, danh sách quest cho các bước của RICH
- **Mạnh:** kể chuyện bằng **địa điểm** (con phố, hàng xóm, quãng đường); các bước đánh số hợp quest log; vui, sáng
- **Yếu:** không có nhân vật có mặt; mỗi bối cảnh mới phải vẽ thêm (cửa hàng, công trình…)
- **Code:** `src/series/pvr/styles/streetSim.tsx` · mẫu: `ep02c/`

### D — "Text Thread"
- **Look:** màn hình điện thoại: chat với khách / nhóm chat, app ngân hàng doanh nghiệp cho phép tính, thông báo trượt xuống, thẻ tin nhắn (giá, hợp đồng)
- **Mạnh:** định dạng giữ chân tốt nhất trên Shorts; dựng nhanh nhất; hợp với **đàm phán, lời nói, tin nhắn, hợp đồng**
- **Yếu:** phép tính phải đọc chứ không thấy; tin nhắn là lời thoại dựng thêm (phải diễn ý FINAL, không thêm số)
- **Code:** `src/series/pvr/styles/textThread.tsx` · mẫu: `ep02d/`

### E — "Map Story" (thêm 2026-10-08)
- **Look:** bản đồ phẳng nhìn từ trên xuống, tông tối (đất xanh rêu, sông/hồ navy, lưới đường); khu vực sáng lên màu phe với viền phát sáng + sọc chéo; đường tự vẽ; avatar đầu tròn; tiêu đề bước ① ② ③; dấu đóng lớn cho con số đắt. Khung đứng yên, **máy quay chỉ bay khi đổi địa điểm** (một cú, ease, không rung)
- **Mạnh:** kịch bản có **địa điểm / quãng đường / khu vực** (lái xe xa vs gần, vùng phục vụ, chọn chỗ mở tiệm, so sánh hai khu); ít chữ nhất trong 5 phong cách — dựng sẵn theo quy tắc short-form
- **Yếu:** không hợp chuyện không gắn nơi chốn; nhân vật đơn giản (avatar)
- **Code:** kit dùng chung `Style Library/E-map-story/map-story.tsx` (hướng dẫn `Style Library/E-map-story/README.md`) + lớp Ep02 `src/series/pvr/styles/mapStory.tsx` · mẫu: `ep02e/`

### F — "Atomic Retro" (thêm 2026-10-09)
- **Look:** minh họa Mỹ thập niên 50 (Atomic Age): nhân vật vẽ kiểu gouache/poster cổ, nền màu khối đổi theo nhịp (teal trầm, vàng mù tạt, kem), vân giấy sần, họa tiết boomerang + sao lấp lánh ở mép. Năm/số lớn kiểu chữ retro có bóng đổ, biểu đồ isotype (mỗi biểu tượng = 1 đơn vị), bản đồ phẳng có đường chấm. POOR/RICH giữ đỏ/xanh lá làm màu nhấn (thay đỏ san hô/teal của mẫu)
- **Mạnh:** ấm, có nhân vật diễn xuất và bối cảnh đời thường; hợp chuyện **lịch sử / "ngày xưa người ta đã…"**, nguồn gốc một ý tưởng kiếm tiền; isotype biến số đếm thành hình
- **Yếu:** mỗi cảnh cần một tranh minh họa riêng (tốn công nhất); tông hoài cổ không hợp chuyện công nghệ hiện đại
- **Chuyển cảnh:** hard cut kèm đổi màu nền (mẫu dùng wipe sóng; không dùng vì quy tắc 2)
- **Code:** kit đã duyệt (2026-10-10) `Style Library/F-atomic-retro/atomic-retro.tsx`; tập PvR đầu tiên dùng chỉ cần thêm lớp màu POOR/RICH · mẫu: `Style Library/F-atomic-retro/`

### G — "Hologram HUD" (thêm 2026-10-09)
- **Look:** nền đen, mô hình 3D khung dây/hologram phát sáng cam (vật, người, tòa nhà, Trái Đất) đứng trên bệ chiếu sáng; đồng hồ đo tròn đếm số, thanh cộng/trừ, đồ thị đường tự vẽ, thước thời gian trượt về một năm; khung ngắm ở góc để chỉ vật. Số chốt đổi sang màu phe (RICH xanh lá / POOR đỏ thay teal của mẫu)
- **Mạnh:** giải thích **cơ chế / chuỗi nhân quả / phép tính cộng trừ** từng bước (−7 + 45 = +38 thấy được trên đồng hồ); hợp công nghệ, khoa học, số đo nhỏ; tương phản mạnh, ít chữ
- **Yếu:** lạnh, không có cảm xúc nhân vật; vật thể hologram phải dựng 3D hoặc vẽ wireframe cho từng chủ đề
- **Chuyển cảnh:** hard cut hoặc chính vật thể biến hình (vật → đồng hồ → đồ thị)
- **Code:** kit đã duyệt (2026-10-10) `Style Library/G-hologram-hud/hologram-hud.tsx`; tập PvR đầu tiên dùng chỉ cần thêm lớp màu POOR/RICH · mẫu: `Style Library/G-hologram-hud/`

### H — "Paper Dossier" (thêm 2026-10-09)
- **Look:** hồ sơ điều tra trên giấy nhàu trắng ngà, dấu căn chỉnh in (+) ở góc; tranh khắc/chấm đen trắng; nhãn băng dính đen chữ in hoa; con dấu ("BANNED", "KIDNEY FAILURE"), vòng tròn vẽ tay quanh con số, viền chấm cho thứ đã mất; bản đồ, biểu đồ cột/đường tối giản. Đen trắng + màu phe (POOR đỏ, RICH xanh lá) là màu duy nhất
- **Mạnh:** chuyện **điều tra / nghiên cứu / hậu quả ẩn** (A gây ra B gây ra C), có nguồn, năm, con số gây sốc; đọc như tin thời sự, đáng tin
- **Yếu:** khô, ít nhân vật; dễ nhiều nhãn cùng lúc nên phải giữ tối đa 2 khối chữ (mẫu thường có 3)
- **Khác A:** A là diorama kraft 3D có con rối, stop-motion; H là trang phẳng, tranh khắc, cắt thẳng
- **Code:** kit đã duyệt (2026-10-10) `Style Library/H-paper-dossier/paper-dossier.tsx`; tập PvR đầu tiên dùng chỉ cần thêm lớp màu POOR/RICH · mẫu: `Style Library/H-paper-dossier/`

## 3. Chọn phong cách theo kịch bản

Claude chấm kịch bản theo các tín hiệu dưới đây, chọn phong cách có nhiều tín hiệu nhất, ghi lý do vào spec (mục "Phong cách") để Lucas duyệt cùng storyboard ở **Cổng 3**.

| Tín hiệu trong kịch bản | A Paper | B Chip | C Sim | D Thread | E Map | F Retro | G HUD | H Dossier |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Một món đồ / vật mua cụ thể (công cụ, máy móc) | ●● | ● | | | | ● | ● | |
| Chuỗi phép tính dài, nhiều khoản chi phí nhỏ | ●● | ● | | ● | | | ● | |
| Kết quả là **so sánh hai con số lớn** (gấp đôi, gấp ba) | | ●● | ● | | ● | ● | ● | ● |
| Các con số có ước chung đẹp (chia hết cho 5/6/10…) | | ●● | | | | ● | | |
| Câu chuyện xảy ra ở **địa điểm** (con phố, khu, cửa hàng, tuyến đường) | ● | | ●● | | ●● | ● | | |
| Nhiều bên / nhiều khách hàng tham gia, tăng dần | | ● | ●● | ● | ● | | | |
| Các bước đánh số của RICH (First, Second, Third…) | | | ●● | ● | ● | | | |
| Cốt truyện là **cuộc nói chuyện**: đàm phán, mặc cả, nhắn tin, email, hợp đồng | | | | ●● | | | | |
| Tiền vào/ra tài khoản theo thời gian (lương, nợ, trả góp, lãi) | ● | | | ●● | | | ● | ● |
| Cảm xúc / phản ứng nhân vật là điểm nhấn | ●● | ● | | ● | | ●● | | |
| **Nhiều nơi / quãng đường dài / so sánh hai khu vực** (thị trấn, thành phố, vùng phục vụ) | | | ● | | ●● | | | |
| **Mốc lịch sử / năm cụ thể / "ngày xưa người ta đã…"** | | | | | | ●● | ● | ● |
| **Cơ chế / công nghệ / chuỗi cộng trừ nhân quả** (vì sao X chạy được, phí ẩn cộng dồn) | | ● | | | | | ●● | |
| **Điều tra / nghiên cứu / hậu quả ẩn**, có nguồn và con số gây sốc | | | | | | | ● | ●● |

**Luân phiên:** tránh dùng cùng một phong cách quá 2 tập liên tiếp, trừ khi kịch bản hợp rõ rệt hơn hẳn.

**Gợi ý cho 2 tập đã làm:** Ep01 "Buy Their Tools" → A (một món đồ, chuỗi chi phí). Ep02 "Give Discounts" → C (con phố, hàng xóm, quãng đường lái xe, 4 bước đánh số); B là lựa chọn thứ hai (kết $126 vs $66).

## 4. Khi không phong cách nào hợp

Nếu điểm cao nhất chỉ có 1 tín hiệu, hoặc kịch bản cần thứ các phong cách hiện có không làm được (vd. đầu tư theo thời gian dài, so sánh hai thành phố…), Claude:
1. Đề xuất **1 phong cách mới** kèm lý do (vì sao các phong cách hiện có không hợp) ngay ở bước spec
2. Dựng **test scene** theo phong cách mới ở Cổng 4 như thường lệ. Nếu Lucas duyệt, phong cách đó được thêm vào thư viện này (mục 2 + một cột ở bảng mục 3), code đặt ở `src/series/pvr/styles/`
