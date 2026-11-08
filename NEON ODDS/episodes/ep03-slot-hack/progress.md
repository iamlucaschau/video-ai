# progress: ep03-slot-hack

*Bàn giao giữa các phiên. Cập nhật sau mỗi bước; phiên mới đọc file này trước.*

| Bước | Trạng thái | Ghi chú |
|---|---|---|
| 1 · Kịch bản (Lucas duyệt) | ✓ 2026-11-08 | `kich-ban-slot-hack-FINAL.md`, 352 từ (~106 s ở 200 từ/phút), cú lật ở 79%; đã đọc trọn DOJ 10/12/2014, Wired 6/2/2017 và 5/8/2017 |
| 2 · Giọng | ✓ 2026-11-08 | Charon, tempo 1,02, 11 lượt (10 take + đọc lại câu 07 riêng vì Whisper nghe "nobody to touch them"); 103,6 s, 204 từ/phút; câu cuối take riêng đọc chậm (6,9 s). Bộ tách câu của `episode.mjs` cắt nhầm ở "St.": đã sửa gốc |
| 3 · Dựng, nháp (Lucas duyệt) | ✓ 2026-11-08 | 41 shot; kit thêm `SlotMachine`, `SlotStool`, `Phone`, `SlotFloor`, `CAST.bliev/alex/consultant/exec`; nhạc `own/slot-hack.mp3`; SFX `phone-buzz` tạo bằng code; nháp `out/slot-hack-draft.mp4` (540×960, chưa master); nền thấp hơn giọng 16,1 dB, 0 chỗ bị che (ƯỚC) |
| 4 · Render 1080 + QA | ✓ 2026-11-08 | `slot-hack.mp4` 1080×1920, 3085 frame, 102,9 s, −14,2 LUFS, −3,0 dBTP; render 5 phút 40 giây, render lại sau khi sửa SFX theo `NGHE.md` (5 → 2 dòng cần nghe); `QA.md`: "khung đen" chỉ là cảnh tối (MOSCOW, email của Alex), đã xem; nhảy hình 74,3 s là song sắt trượt; khung cuối/khung 0 PSNR 48 dB |
| 5 · Gói sản xuất + thumbnail | ✓ 2026-11-08 | `xuat-ban.md`, `thumb.jpg` ($250,000/WEEK / THE PHONE KNEW, 217 KB) |

**Quyết định đã đổi và vì sao:**
- Nháp của Lucas ghi email năm 2016 kèm giá tám chữ số: email 11/2016 không nêu giá, giá nằm ở email sau cuộc gọi (W2). Lời đọc không gắn năm.
- Nháp ghi "gọi cảnh sát": Aristocrat chỉ nói đã chuyển cho "relevant authorities". Lời đọc chỉ nói hãng từ chối.
- $10.000/ngày là lời của Willy Allison (W1), nên lời đọc ghi "One security expert says".
- Hook mẫu 1 (nhập vai), khác ep01 (mẫu 4) và ep02 (mẫu 2). Không dùng nguyên câu hook trong nháp vì nó trùng câu ví dụ trong công thức.
- Không nêu tên Aristocrat hay Novomatic, không dùng logo hay tên trò thật trên hình.

**Còn mở:**
- `NGHE.md` còn 2 dòng cần nghe: cửa cuốn 0:23 nổi 1,3 dB; trống 0:20 lệch 84 ms.
- Giọng chưa ai nghe. Whisper nghe cả file thì lẫn "Agents kept" thành "Casinos kept" và "There was" thành "It was"; nghe riêng từng câu thì đúng.
- Chi tiết công thức Helix trùng sách Knuth (W2) chưa dùng; có thể làm cú lật khác nếu Lucas muốn.
- Thumbnail: điện thoại trong tay gần như không thấy; chữ nói thay.
- Hình: S35 cái cân hơi bị cắt; điện thoại ở cảnh cận còn nhỏ và tối; mắt Bliev ở cảnh mặt trông như đeo kính bảo hộ; S33 hai công nhân khiêng máy hơi chật.

**Bước tiếp:** Lucas nghe bản cuối rồi đăng.
