# STYLE LIBRARY — thư viện phong cách dùng chung (9:16)

*Lập 2026-10-09 (Lucas). Đây là **bản gốc** của mọi phong cách hình ảnh trong dự án. Mỗi series/dự án (Poor vs Rich Daily, một dự án lịch sử sau này, …) **mượn** phong cách từ đây; không tạo thư viện riêng trong thư mục series. Style mới thêm vào đây trước, rồi mới dùng ở series.*

## 1. Mục lục

| Mã | Tên | Một dòng | Hợp nhất với | Code |
|---|---|---|---|---|
| A | [Receipt × Paper](A-receipt-paper/) | diorama giấy kraft, con rối, hóa đơn in phép tính, stop-motion | một món đồ, chuỗi chi phí dài, cảm xúc nhân vật | mẫu trong PvR |
| B | [Chip Table](B-chip-table/) | bàn tối, số tiền = chồng chip, quân cờ có mặt | so sánh hai con số lớn | mẫu trong PvR |
| C | [Street Sim](C-street-sim/) | game quản lý isometric, HUD tiền, quest log | địa điểm gần, các bước đánh số | mẫu trong PvR |
| D | [Text Thread](D-text-thread/) | màn hình điện thoại: chat, app ngân hàng | đàm phán, tin nhắn, hợp đồng | mẫu trong PvR |
| E | [Map Story](E-map-story/) | bản đồ phẳng tông tối, vùng sáng, đường tự vẽ | nhiều nơi, quãng đường, so sánh khu vực | **kit dùng chung** |
| F | [Atomic Retro](F-atomic-retro/) | minh họa Mỹ thập niên 50, nền màu khối, isotype | lịch sử, "ngày xưa người ta đã…" | kit v1 (đang thử) |
| G | [Hologram HUD](G-hologram-hud/) | nền đen, hologram cam, đồng hồ đo, đồ thị | cơ chế, khoa học, chuỗi cộng trừ | kit v1 (đang thử) |
| H | [Paper Dossier](H-paper-dossier/) | hồ sơ giấy, tranh khắc đen trắng, con dấu | điều tra, nghiên cứu, hậu quả ẩn | kit v1 (đang thử) |

Mỗi thư mục có `README.md` (look, mạnh/yếu, cách dựng) và `ref.jpg` (khung mẫu).
**Code:** "kit dùng chung" = tự chứa, import thẳng. "Mẫu trong PvR" = code đang gắn với series Poor vs Rich (`src/series/pvr/…`); lần đầu dự án khác dùng thì **tách thành kit trong thư mục style đó** (như E đã làm), rồi PvR import lại từ kit. "Chưa có" = dựng ở Cổng 4 (test scene) của tập đầu tiên dùng, đặt thẳng vào thư mục style.

## 2. Luật chung cho mọi phong cách

1. **Quy tắc short-form** (`AGENTS.md`): vùng an toàn x 60–940, y 220–1440; không máy quay giả (zoom, rung, trôi); ít chữ (khối ≤ 5 từ, tối đa 2 khối ngoài phụ đề, phụ đề 1–3 từ); SFX thật từ `public/sfx/`.
2. **Khung đứng yên**, chỉ vật thể chuyển động. Chuyển cảnh: hard cut, crossfade ≤ 8 frame, hoặc vật thể tự biến hình.
3. **Màu nhấn theo dự án:** mỗi style chỉ quy định *vai trò* màu (nền, mực, 1–2 màu nhấn). Dự án tự đặt màu nhấn (PvR: POOR đỏ `#D32F2F` / RICH xanh lá `#388E3C`).
4. **Một họ font sans** đậm 700–800, ≥ 48 px (mặc định Bricolage Grotesque). Font trang trí của video mẫu (serif máy chữ, monospace nhỏ) được thay bằng font này.
5. **Kết nối vòng (loop ending, Lucas 2026-10-09):** câu cuối của VO là một vế bỏ lửng, đọc nối vào câu đầu thành **một câu đúng ngữ pháp và đúng nghĩa**, để khi nền tảng phát lại, người xem nghe liền mạch và xem thêm vòng nữa. Cách làm:
   - Viết câu mở đầu trước, rồi viết vế cuối ≤ 8 từ dẫn vào nó: *"…which is exactly why"* → *"In 1949, scientists planted…"*; *"And that is why, to this day,"* → *"every GPS clock is built to run slow."*; *"A reminder of what it cost."* → *"When India's vultures vanished…"*.
   - Đọc to "vế cuối + câu đầu" liền một hơi để kiểm: phải tự nhiên, không sai nghĩa, không thêm số mới.
   - Dựng: cắt video **≤ 0,3 s sau chữ cuối** (không đọng, không fade nhạc, không outro); khung cuối trở về bố cục của khung đầu (cùng nền, cùng vật chính) để chỗ nối không lộ.

## 3. Chọn phong cách theo kịch bản

Chấm kịch bản theo tín hiệu, chọn style nhiều chấm nhất, ghi lý do vào spec của tập. Series có thể thu hẹp danh sách (vd. PvR thêm tín hiệu riêng trong `03_STYLE-LIBRARY.md` §3).

| Tín hiệu trong kịch bản | A | B | C | D | E | F | G | H |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Một món đồ / vật cụ thể | ●● | ● | | | | ● | ● | |
| Chuỗi phép tính dài, nhiều khoản nhỏ | ●● | ● | | ● | | | ● | |
| **So sánh hai con số lớn** | | ●● | ● | | ● | ● | ● | ● |
| Các con số có ước chung đẹp | | ●● | | | | ● | | |
| Chuyện xảy ra ở **một địa điểm** (con phố, cửa hàng) | ● | | ●● | | ●● | ● | | |
| Nhiều bên tham gia, tăng dần | | ● | ●● | ● | ● | | | |
| Các bước đánh số | | | ●● | ● | ● | | | |
| **Cuộc nói chuyện**: đàm phán, tin nhắn, hợp đồng | | | | ●● | | | | |
| Tiền/số liệu thay đổi theo thời gian | ● | | | ●● | | | ● | ● |
| Cảm xúc / phản ứng nhân vật là điểm nhấn | ●● | ● | | ● | | ●● | | |
| **Nhiều nơi / quãng đường / so sánh khu vực** | | | ● | | ●● | | | |
| **Mốc lịch sử / năm cụ thể / "ngày xưa"** | | | | | | ●● | ● | ● |
| **Cơ chế / công nghệ / chuỗi cộng trừ nhân quả** | | ● | | | | | ●● | |
| **Điều tra / nghiên cứu / hậu quả ẩn** | | | | | | | ● | ●● |

## 4. Dùng cho dự án mới

1. Chọn style ở §3, đọc `README.md` trong thư mục style.
2. Đặt màu nhấn và font của dự án (§2.3–2.4).
3. Code: kit dùng chung → import từ `Style Library/<style>/` (từ `src/compositions/<Tên>/` là `../../../Style Library/<style>/…`). Mẫu trong PvR → tách thành kit trước (xem §1). Chưa có → dựng test scene, đặt vào thư mục style.

## 5. Thêm phong cách mới

Tạo thư mục `<chữ cái tiếp theo>-<tên>/` với `README.md` (theo mẫu F/G/H) + `ref.jpg`, thêm một dòng ở §1 và một cột ở §3. Series nào muốn dùng thì thêm vào tài liệu series của mình (PvR: `03_STYLE-LIBRARY.md`).
