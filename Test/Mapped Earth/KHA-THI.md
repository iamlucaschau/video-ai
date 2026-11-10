# KHẢ THI — Mapped.Earth (Facebook; cùng nội dung IG @mapped.earth 207K, YT @mapped-earth) — Aaron J. Becker

*Tự sinh bởi `npm run studio:cards -- check` từ `style-card.json`; sửa card, đừng sửa file này. Mức: `studio/KHA-THI.md`.*

**13 kỹ thuật:** 🟢 5 · 🟡 8 · 🟠 0 · 🔴 0

| T# | Kỹ thuật | Mức | Dấu hiệu | Cách của mình | Công cụ | Quyết định |
|---|---|---|---|---|---|---|
| T1 | Dòng chảy hạt trên trường vector (nước, gió) | 🟡 | vệt mảnh, hạt sinh / chết đều, trường đổi theo giờ (ƯỚC) | Python đọc NetCDF (NOAA NGOFS2, OSCAR, Copernicus) → lưới u/v; vẽ trên canvas trong Remotion, hạt tính lại từ seed theo frame (không trạng thái) | — | dùng |
| T2 | Đàn chim mô phỏng từ quan sát eBird | 🟡 | chú giải 'simulated paths, from reports' (ƯỚC) | GBIF download (miễn phí, có DOI) → lưới mật độ theo tuần → tác nhân đi theo gradient (numpy) → toạ độ theo ngày → canvas additive | — | dùng |
| T3 | Chip số chạy theo dữ liệu (°C, m, m³/s) | 🟢 | số lớn sans + dòng phụ nhỏ (ƯỚC) | Counter có sẵn + bảng số theo ngày | — | dùng |
| T4 | Đồng hồ thời gian (vòng 12 tháng, thanh tuần, ngày giờ) | 🟢 | vòng 12 chữ cái tháng (ƯỚC) | SVG + interpolate | — | dùng |
| T5 | Mặt cắt dọc đại dương / hồ | 🟡 | dải màu đỏ → xanh theo chiều sâu (ƯỚC) | Copernicus Marine / mô hình hồ → ảnh nhiệt theo ngày (Python) → Img + nội suy | — | dùng |
| T6 | Biến hình giữa các chế độ xem (cầu → mặt cắt → dải) | 🟢 | không có điểm cắt nào dò được (ƯỚC) | three.js morph hoặc crossfade ≤ 8 frame | — | dùng |
| T7 | Địa hình 3D nghiêng + hạ mực nước, đất lộ tô màu theo thời điểm khô | 🟡 | bóng địa hình thật (ƯỚC) | @remotion/three mặt lưới + shader mực nước (đã dùng three.js ở style M); Blender dự phòng (đã có máy) | — | dùng |
| T8 | Quả cầu dữ liệu | 🟡 | cầu nghiêng, viền tối (ƯỚC) | three.js sphere + texture từ canvas T1 | — | dùng |
| T9 | Chùm sáng hải đăng quét đúng đặc tính hải đồ | 🟡 | nhịp chớp khác nhau từng đèn (ƯỚC) | OSM / NGA List of Lights (public domain) → parser đặc tính → quạt additive trên canvas | — | dùng |
| T10 | Sông tô theo biển nhận, độ đậm = lưu lượng ngày | 🟡 | nền kem, bảng m³/s (ƯỚC) | HydroRIVERS + GloFAS → SVG path / canvas | — | dùng |
| T11 | Nối vòng bằng chu kỳ dữ liệu | 🟢 | khung cuối ≈ khung 0 (ƯỚC) | chọn chu kỳ; ánh xạ frame → ngày khép kín | — | dùng |
| T12 | Thời gian không đều (chậm khi có chuyện, nhanh khi lặng) | 🟢 | nhãn ngày nhảy không đều (ƯỚC) | hàm ánh xạ frame → ngày theo mức hoạt động của dữ liệu | — | dùng |
| T13 | Ảnh thật của đối tượng trong khung (con chim) | 🟡 | ảnh nhỏ góc dưới (ƯỚC) | Wikimedia Commons CC BY / CC BY-SA, ghi credit | — | dùng |
