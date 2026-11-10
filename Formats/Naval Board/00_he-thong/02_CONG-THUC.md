# 02 — CÔNG THỨC KỊCH BẢN · Naval Board

*Bản chốt của Lucas, 2026-11-07, thay bản nháp của Luis. Mục 1–3 là luật. Mục 4 là ghi chú của Luis, chưa được duyệt; chỗ nào lệch thì mục 1–3 thắng.*

## 1. Định dạng khóa cứng

- Video dài 16:9, tiếng Anh, thời lượng **487–555 giây**, kịch bản **1.430–1.870 từ**.
- Nhịp giọng đọc tối thiểu **175 từ/phút** (mục tiêu 175–204). Video #1 đọc ~152 nên bị dài 10:42; luật này rút từ đó.
- Nhịp đăng ~14 ngày/video, không Shorts ở giai đoạn thử, bản cuối −14 LUFS.

## 2. Cấu trúc 7 phần (xương sống mọi kịch bản)

1. **Hook tình huống:** mở bằng cảnh/vấn đề cụ thể có số cứng, không giới thiệu kênh. Mẫu: "One ship carries 65 planes — and every enemy in range wants it sunk. So why is it almost impossible to kill?"
2. **Hỏi lại tiêu đề:** đọc title thành câu hỏi: "So how does an aircraft carrier actually defend itself?"
3. **Lộ trình:** "In this video, we go through…" liệt kê trước các phần + hứa chương kết.
4. **Nguyên lý cổ điển:** cơ chế gốc hàng trăm năm (phòng thủ theo vòng từ thời pháo đài…).
5. **Khối hiện đại:** cơ chế gặp công nghệ hôm nay: drone, tên lửa chống hạm, tác chiến điện tử; chất liệu thời sự (Ukraine, Biển Đỏ).
6. **Deadly Mistakes:** chương kết bắt buộc: mỗi sai lầm = một cơ chế sụp đổ + một sự kiện thật có nguồn.
7. **Outro:** đúng 1 CTA (guide số của video) + 1 câu tease sang video sau.

## 3. Luật chọn đề và giọng văn

- Một chủ đề = một cơ chế; công thức: **chủ thể nổi tiếng nhất × nghịch lý rõ nhất**; ưu tiên cụm khán giả đã gõ sẵn trên YouTube.
- Cấm bê đề tài mặt đất của Euro Defence; cấm ngôn từ "how to attack" ở mọi đầu ra.
- Số liệu theo luật kiểm chứng: nguồn chính thức → nhà sản xuất → báo chí quốc phòng; số mật ghi theo dải/"publicly credited", số đơn nguồn phải có quy chiếu ngay trong câu, mỗi kịch bản nộp kèm bảng kiểm chứng riêng (`FACTS-<slug>.md`).

## 4. Ghi chú của Luis (chưa duyệt)

**Khung từ và nhịp phải đi cùng nhau.** Tính trên tổng thời lượng, kể cả quãng nghỉ:
- Ở 175 từ/phút, tối đa 1.618 từ mới không vượt 555 giây.
- Ở 204 từ/phút, cần ít nhất 1.656 từ mới đủ 487 giây.
- Đích dễ trúng: **1.550–1.600 từ ở 175–185 từ/phút** (503–549 giây).

**Tỷ lệ đo trên Carrier, chỉ để tham khảo, chưa có số liệu người xem:** phần 1–3 khoảng 10%, phần 4–5 khoảng 76%, phần 6 khoảng 17% (gồm vụ Gravely), kết và phần 7 khoảng 7%.

**Mẹo giữ chân đã dùng ở Carrier:**
1. Câu chìa khóa ngay sau hook, lặp lại ở kết: "It survives by being surrounded."
2. Câu nối cuối mỗi lớp: điểm yếu của lớp này mở ra lớp sau. "But no screen stops everything. And whatever leaks now meets the wall."
3. Cài rồi trả: "Remember that. It comes back in the mistakes." Cài bao nhiêu trả bấy nhiêu.
4. Nhịp căng dần theo thang đo: phút → giây, hàng trăm km → một dặm.
5. Một cụm từ riêng cho mỗi lớp: "the wall", "kill the archer, not the arrow".

**Luật viết:**
1. Câu tối đa khoảng 20 từ, mỗi câu tối đa một con số mới, thì hiện tại, trừ khi kể sự kiện đã qua.
2. Mỗi câu phải dựng được thành một hình đọc hiểu không cần chữ.
3. Không tả chi tiết thương vong; nói số và hệ quả, tôn trọng người đã mất.
4. Guide nhắc trong CTA phải có thật trước khi đăng.

**Hình và ngân sách render:**
- 3D khoảng 20% thời lượng (Lucas 2026-11-06), còn lại 2D sa bàn.
- Blender dưới 6 giờ mỗi tập trên máy hiện tại: cảnh thường khoảng 6 giây/khung, cảnh khói dày khoảng 22 giây/khung. Xem bản `preview` trước khi render (`AGENTS.md`, mục Environment notes).

**Mục tiêu QA tạm:** true peak ≤ −1,5 dBTP; khung gần như đứng yên (`short-qa.py`) dưới 35% (Carrier v4 là 41%); 0 khẳng định chưa có nguồn; cổng nghe `npm run listen -- <id> <mp4> --out NGHE.md` (bắt buộc từ 2026-11-08) với mọi dòng "Cần nghe" đã có quyết định khi đăng.

## 5. Công thức tiêu đề (Lucas 2026-11-08)

*Rút từ phân tích của Lucas: các video tàu ngầm đang thắng trên YouTube và 14 tiêu đề "How … Actually …" của Euro Defence.*

1. **Chủ thể nổi tiếng nằm trong 3 từ đầu** (Submarines, Aircraft Carrier), phục vụ cả tìm kiếm lẫn người lướt.
2. **Một động từ xung đột** (Fight, Defend). "Work" chỉ thắng ở kênh rất lớn hoặc video tổng quan.
3. **"Actually"** báo hiệu sửa kỳ vọng. Giữ được cho tính liên tục của loạt, nhưng nó là gia vị, không kéo view.
4. **Đúng MỘT yếu tố căng thẳng:** nghịch lý, mức độ hệ trọng, con số cụ thể hoặc kịch bản. Từ hai trở lên thì rối.
5. **Tiêu đề không lặp chữ trên thumbnail.** Tiêu đề giữ từ khoá và nghịch lý; thumbnail giữ yếu tố căng thẳng thứ hai (3–4 chữ).
6. Tối đa khoảng 55 ký tự để không bị cắt trên điện thoại.

Tiêu đề kiểu "How X Actually Works" đúng mà trơn: dùng làm dự phòng, không làm tiêu đề chính. Không đưa tên công cụ (Sonar) lên đầu.

Ví dụ: tập 2 dùng **How Submarines Fight What They Can't See**, thumbnail "HEARS YOU FIRST.", dự phòng How Submarines Actually Fight. Video vẫn đọc lại câu "So how do submarines actually fight?". Lucas giữ nguyên câu này vì hook đã hỏi đúng nghịch lý của tiêu đề mới.

## 6. Thumbnail (ghi chú của Luis, chưa duyệt)

*Rút từ việc so 13 video cùng chủ đề trên YouTube, đo bằng lượt xem ÷ số người đăng ký (`episodes/ep02-submarines/THAM-KHAO-THUMB.md`). Lucas đã xem và chọn bộ E, D, C cho tập 2.*

1. **Sáng và tương phản mạnh,** hoặc nền đen tuyền với hình phát sáng. Không dùng xanh navy tối: trên giao diện tối của YouTube nó gần như biến mất.
2. **Một chủ thể to,** chiếm 40–70% khung hình.
3. **Sơ đồ đơn giản thắng ở chủ đề cơ chế.** Hai video tăng mạnh nhất (47× và 16×) dùng tàu phẳng trên nền đen, sóng phát sáng, một từ khoá vàng.
4. **0–3 chữ,** đặt ở trên hoặc góc dưới trái. Góc dưới phải để trống vì YouTube đặt thời lượng ở đó.
5. **Một điểm màu nóng** (đỏ, cam, vàng) để dẫn mắt.
6. Làm 3 bản, đưa vào **Test & compare** của YouTube Studio và giữ nguyên tiêu đề. Xem cả 3 ở cỡ 320×180 trên nền tối trước khi chốt.
7. **Cả 3 bản phải cho thấy lời hứa của tiêu đề** (Lucas 2026-11-09). "Không lặp chữ" (§5.5) nghĩa là thumbnail cho thấy, tiêu đề nói thêm; không có nghĩa thumbnail được kể chuyện khác. Mỗi bản chỉ đổi câu chữ hoặc góc nhìn. Tập 1, bản đầu: hai trên ba thumbnail (một con tàu to, một khẩu Phalanx) không có 3 vòng mà tiêu đề hứa.
