# 01 — FORMAT BIBLE · Naval Board

*Luật của kênh, gom từ các quyết định của Lucas trong hai tập thử (2026-11-05 → 2026-11-08). Phần kịch bản, tiêu đề và thumbnail nằm ở `02_CONG-THUC.md`; phần hình và tiếng nằm ở `03_PHONG-CACH-DUNG.md`. Chỗ nào ba file lệch nhau thì hỏi Lucas.*

## 1. Kênh

- **Tên:** Naval Board (Lucas 2026-11-06). Kênh riêng, tách khỏi NEON ODDS.
- **Nội dung:** mỗi tập giải thích một cơ chế tác chiến trên biển (tàu sân bay, tàu ngầm, phong toả…), kết bằng chương Deadly Mistakes gồm các sự kiện thật có nguồn.
- **Ngôn ngữ:** tiếng Anh. Chat với Lucas bằng tiếng Việt.
- **Giai đoạn thử:** 3 tập theo thứ tự Carrier → Submarines → Blockade, mỗi tập cách nhau khoảng 14 ngày, chưa làm Shorts.

## 2. Định dạng video

| | |
|---|---|
| Khung | 16:9, 1920×1080, 30 fps |
| Độ dài | 487–555 giây, kịch bản 1.430–1.870 từ |
| Nhịp đọc | tối thiểu 175 từ/phút (mục tiêu 175–204) |
| Âm lượng | −14 LUFS, true peak ≤ −1,5 dBTP |
| 3D | khoảng 20% thời lượng, phần còn lại là sa bàn 2D (Lucas 2026-11-06) |

Tập 1 (Carrier) đọc khoảng 152 từ/phút nên dài 10:42, ngoài khung. Luật nhịp đọc rút ra từ tập đó. Carrier giữ nguyên trừ khi Lucas bảo làm lại.

## 3. Giọng đọc

`voiceover/<slug>.json`, mẫu ở `episodes/_template/voiceover-header.json`:

- `gemini-3.8-flash-tts`, giọng **Charon**, `tempo` 1.14, `trimSilence`, `batchBy: "take"`.
- Khoảng nghỉ: 0,12 s giữa câu, 0,3 s giữa đoạn, 1,2 s giữa cảnh.
- Style: người dẫn phim tài liệu hải quân, giọng nam Mỹ, như một cựu sĩ quan tàu ngầm; bình tĩnh, chắc, nhịp nhanh; đọc rõ mọi con số và tên tàu; hơi căng ở phần Deadly Mistakes; không kịch, không la.

Ở tempo 1.14, tập 2 đọc 177 từ/phút (bản thô 166).

## 4. Kiểm chứng

- Mỗi kịch bản đi kèm `FACTS-<slug>.md`: mỗi khẳng định một dòng, có kết luận (ok / hedge / open / no) và nguồn.
- Thứ tự nguồn: chính thức → nhà sản xuất → báo chí quốc phòng. Số mật ghi theo dải hoặc "publicly credited". Số chỉ có một nguồn thì nói rõ nguồn ngay trong câu.
- Chữ và số trên màn hình chỉ lấy từ bảng này.
- Trang chặn đọc tự động (usni.org) thì ghi "chưa đọc", không tìm cách vượt.

## 5. Giọng văn và giới hạn

- Không dùng ngôn từ kiểu "how to attack" ở bất kỳ đầu ra nào.
- Không tả chi tiết thương vong: nói số và hệ quả, tôn trọng người đã mất. Không có hình người bị trúng đòn.
- Sự kiện còn tranh cãi (vd. Novorossiysk) chỉ dựng 2D và nói rõ ai tuyên bố, ai bác bỏ.

## 6. Kết video và mô tả

- Công thức (§2.7 của `02_CONG-THUC.md`): đúng 1 CTA (guide của video) + 1 câu tease sang tập sau.
- **Lucas 2026-11-08:** tập 2 bỏ lời hứa guide vì guide không có thật; kết chỉ còn câu chìa khoá và câu tease. Từ nay **hỏi Lucas trước** khi viết CTA guide vào kịch bản mới. Tập 1 cũng đã cắt câu này (Lucas 2026-11-09).
- Mô tả kết bằng "Thanks for watching!" ngay trước hashtag (Lucas, tập 2).

## 7. Nhật ký quyết định

| Ngày | Quyết định | Ai |
|---|---|---|
| 2026-11-05 | Tập Carrier làm thử trước khi chốt kênh | Lucas |
| 2026-11-06 | Tên kênh Naval Board; 3D khoảng 20% thời lượng | Lucas |
| 2026-11-07 | Chốt công thức, độ dài, nhịp đọc, bộ 3 tập thử | Lucas |
| 2026-11-08 | Cổng nghe earshot bắt buộc, chạy theo 3 chặng (`03_PHONG-CACH-DUNG.md` §6) | Lucas |
| 2026-11-08 | Công thức tiêu đề (`02_CONG-THUC.md` §5); tiêu đề tập 2 đổi thành "How Submarines Fight What They Can't See" | Lucas |
| 2026-11-08 | Bỏ lời hứa guide ở tập 2; thêm "Thanks for watching!" vào mô tả | Lucas |
| 2026-11-08 | Đóng gói kênh vào `Formats/Naval Board/` | Lucas |
| 2026-11-09 | Bỏ lời hứa guide ở tập 1, render lại | Lucas |
