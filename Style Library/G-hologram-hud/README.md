# G — Hologram HUD

*Thêm 2026-10-09, học từ video mẫu "đồng hồ GPS và thuyết tương đối" (Lucas gửi). Khung mẫu mỗi 1,5 s: `ref.jpg`.*

- **Look:** nền đen; mô hình 3D khung dây / hologram phát sáng cam (vật, người, tòa nhà, Trái Đất, vệ tinh) đứng trên bệ chiếu sáng ở đáy khung. Đồng hồ đo tròn đếm số, thanh cộng/trừ, đồ thị đường tự vẽ, thước thời gian trượt về một năm, khung ngắm ở 4 góc để chỉ vật.
- **Mạnh:** giải thích **cơ chế / chuỗi nhân quả / phép cộng trừ** từng bước (−7 + 45 = +38 thấy được trên đồng hồ); hợp công nghệ, khoa học, số đo nhỏ; tương phản mạnh, ít chữ.
- **Yếu:** lạnh, ít cảm xúc nhân vật; vật hologram phải dựng 3D (`@remotion/three`) hoặc vẽ wireframe cho từng chủ đề.
- **Màu:** đen + cam phát sáng; màu nhấn của dự án thay teal cho số chốt (mẫu: teal = kết quả).
- **Chuyển cảnh:** hard cut, hoặc vật tự biến hình (vật → đồng hồ → đồ thị).
- **Điều chỉnh so với mẫu:** nhãn monospace nhỏ ("CLOCK OFFSET", "µS/DAY") → Bricolage ≥ 48 px, tối đa 2 khối; phụ đề **giữ kiểu mẫu** (Lucas 2026-10-10): karaoke trong khung kính tối có góc ngoặc cam và con trỏ ▌ (`HudSub`).
- **Code (kit, bản thử v1 2026-10-09):** `hologram-hud.tsx` (HudBg + bệ chiếu, HudLabel gõ chữ, HudNumber, Brackets, YearRuler, Gauge, Airliner, CabinSection, StressWindow, Crack, Tank) dùng `../kit-common.ts`. Video kiểm nghiệm: `g-round-windows/`, composition `Style-G-HologramHUD-RoundWindows`.
