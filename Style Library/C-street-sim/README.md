# C — Street Sim

*Lần đầu dùng: Poor vs Rich Daily Ep02 bản C (2026-10-07). Khung mẫu: `ref.jpg`.*

- **Look:** game quản lý trên bản đồ isometric ban ngày: HUD tiền số chạy, số +/− bay lên tại chỗ, xe chạy trên đường, cờ SIGNED, danh sách quest cho các bước.
- **Mạnh:** kể chuyện bằng **địa điểm gần** (con phố, hàng xóm, quãng đường ngắn); các bước đánh số hợp quest log; vui, sáng.
- **Yếu:** không có nhân vật có mặt; mỗi bối cảnh mới phải vẽ thêm (cửa hàng, công trình…). HUD, nhãn, quest log phải dời vào trong vùng an toàn (không chạm cột nút phải).
- **Màu:** cỏ xanh nhạt, đường xám, mái nhà nhiều màu; 2 màu nhấn của dự án cho HUD và số +/−.
- **Code (mẫu trong PvR):** `src/series/pvr/styles/streetSim.tsx` (dùng `chipTable.tsx`, `paper.tsx`) · tập mẫu `src/series/pvr/ep02c/`. Tách thành kit ở thư mục này khi dự án khác dùng.
