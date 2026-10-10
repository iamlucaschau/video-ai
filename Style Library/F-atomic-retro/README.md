# F — Atomic Retro

*Thêm 2026-10-09, học từ video mẫu "vườn phóng xạ 1949" (Lucas gửi). Khung mẫu mỗi 1,5 s: `ref.jpg`.*

- **Look:** minh họa Mỹ thập niên 50 (Atomic Age). Nhân vật vẽ kiểu gouache / poster cổ; nền màu khối đổi theo nhịp (teal trầm, vàng mù tạt, đỏ san hô, kem); vân giấy sần; họa tiết boomerang + sao lấp lánh ở mép khung. Năm/số lớn kiểu chữ retro có bóng đổ; biểu đồ isotype (mỗi biểu tượng = 1 đơn vị, vd. 1 giọt = 100 giống); bản đồ phẳng có đường chấm.
- **Mạnh:** ấm, có nhân vật và bối cảnh đời thường; hợp **lịch sử / "ngày xưa người ta đã…"**, nguồn gốc một ý tưởng; isotype biến số đếm thành hình.
- **Yếu:** mỗi cảnh cần một tranh minh họa riêng (tốn công nhất); tông hoài cổ không hợp công nghệ hiện đại.
- **Màu:** nền teal/mù tạt/kem như mẫu; màu nhấn của dự án thay đỏ san hô cho từ khóa và số chốt.
- **Chuyển cảnh:** hard cut kèm đổi màu nền (mẫu dùng wipe mép sóng, không dùng vì luật không máy quay giả).
- **Điều chỉnh so với mẫu:** phụ đề **giữ kiểu mẫu** (Lucas 2026-10-10): karaoke trong nhãn giấy kem viền mực, bóng đổ màu nhấn (`RetroSub`), nhưng đặt ở đáy vùng an toàn thay vì giữa màn hình.
- **Code (kit đã duyệt, Lucas 2026-10-10):** `atomic-retro.tsx`: `RetroBg` (nền màu khối + sàn), `Backdrop` (ảnh nền nguyên khung), `Cutout` (nhân vật/vật đã tách nền), `BigNumber`, `Plaque`, `Burst`, `Shadow`, `Waves`, `WaterMolecule`, isotype `House`, phụ đề `RetroSub`; dùng `../kit-common.ts`, `../subs.tsx`. **Cần ảnh minh họa:** bộ prompt mẫu `f-microwave/image-prompts.md` (nền kem phẳng → `scripts/cutout.py`). Video mẫu: `f-microwave/`, composition `Style-F-AtomicRetro-Microwave`.
