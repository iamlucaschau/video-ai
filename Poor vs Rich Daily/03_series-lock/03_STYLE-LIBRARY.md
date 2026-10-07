# 03 — THƯ VIỆN PHONG CÁCH (Style Library)

*Chốt 2026-10-07 (Lucas): series dùng **cả 4 phong cách**. Mỗi tập Claude đề xuất phong cách hợp với kịch bản; kịch bản không hợp phong cách nào thì Claude đề xuất phong cách mới. So sánh cùng một khoảnh khắc ("Almost double", Ep02): `episodes/ep02-give-discounts/test/style-library-A-B-C-D.jpg`.*

## 1. Bất biến chung (mọi phong cách)

- 1080×1920, 30fps, VO + 1.5 s đọng; hard cut giữa các scene
- **Khung hình đứng yên**: không máy quay di chuyển (không trôi, rung, lia, zoom, push-in). Chỉ vật thể trong khung chuyển động
- POOR luôn đỏ `#D32F2F`, RICH luôn xanh lá `#388E3C`, nhân vật phụ trung tính
- Font Bricolage Grotesque 700/800 (A thêm Space Mono cho hóa đơn)
- **Phụ đề bắt buộc** ở y≈1600, cụm ≤ 30 ký tự, số tiền viết bằng số
- Mọi con số trên màn hình nằm trong FINAL hoặc bảng kiểm toán số. Phép tính hiện từng bước, mỗi chữ cue theo timestamp VO
- Âm thanh: VO −14 LUFS, nhạc nền ≈ −24 LUFS, đổi sắc thái ở câu transition
- Cùng một bộ VO, phụ đề và nhạc có thể dựng ra bất kỳ phong cách nào (`Ep02Cut` trong `src/series/pvr/ep02/Ep02.tsx`)

## 2. Bốn phong cách

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

## 3. Chọn phong cách theo kịch bản

Claude chấm kịch bản theo các tín hiệu dưới đây, chọn phong cách có nhiều tín hiệu nhất, ghi lý do vào spec (mục "Phong cách") để Lucas duyệt cùng storyboard ở **Cổng 3**.

| Tín hiệu trong kịch bản | A Paper | B Chip | C Sim | D Thread |
|---|:---:|:---:|:---:|:---:|
| Một món đồ / vật mua cụ thể (công cụ, máy móc) | ●● | ● | | |
| Chuỗi phép tính dài, nhiều khoản chi phí nhỏ | ●● | ● | | ● |
| Kết quả là **so sánh hai con số lớn** (gấp đôi, gấp ba) | | ●● | ● | |
| Các con số có ước chung đẹp (chia hết cho 5/6/10…) | | ●● | | |
| Câu chuyện xảy ra ở **địa điểm** (con phố, khu, cửa hàng, tuyến đường) | ● | | ●● | |
| Nhiều bên / nhiều khách hàng tham gia, tăng dần | | ● | ●● | ● |
| Các bước đánh số của RICH (First, Second, Third…) | | | ●● | ● |
| Cốt truyện là **cuộc nói chuyện**: đàm phán, mặc cả, nhắn tin, email, hợp đồng | | | | ●● |
| Tiền vào/ra tài khoản theo thời gian (lương, nợ, trả góp, lãi) | ● | | | ●● |
| Cảm xúc / phản ứng nhân vật là điểm nhấn | ●● | ● | | ● |

**Luân phiên:** tránh dùng cùng một phong cách quá 2 tập liên tiếp, trừ khi kịch bản hợp rõ rệt hơn hẳn.

**Gợi ý cho 2 tập đã làm:** Ep01 "Buy Their Tools" → A (một món đồ, chuỗi chi phí). Ep02 "Give Discounts" → C (con phố, hàng xóm, quãng đường lái xe, 4 bước đánh số); B là lựa chọn thứ hai (kết $126 vs $66).

## 4. Khi không phong cách nào hợp

Nếu điểm cao nhất chỉ có 1 tín hiệu, hoặc kịch bản cần thứ cả 4 không làm được (vd. đầu tư theo thời gian dài, so sánh hai thành phố…), Claude:
1. Đề xuất **1 phong cách mới** kèm lý do (vì sao 4 phong cách hiện có không hợp) ngay ở bước spec
2. Dựng **test scene** theo phong cách mới ở Cổng 4 như thường lệ. Nếu Lucas duyệt, phong cách đó được thêm vào thư viện này (mục 2 + một cột ở bảng mục 3), code đặt ở `src/series/pvr/styles/`
