# 02 — CÔNG THỨC · {{NAME}} (chủ đề · tiêu đề · kịch bản)

*Phần lõi của format. Nháp do `npm run studio:format -- new` tạo {{TODAY}}: phần đo được điền sẵn từ `{{SOURCE}}` (`INGEST.md`, `formula.json`); chỗ `[...]` Luis viết từ `BAO-CAO.md` + `BOC-TACH-KICH-BAN.md`, Lucas duyệt. Nguyên văn của đối thủ chỉ ở 3 câu mẫu (hook, bắc cầu, kết), mỗi câu ≤ 15 từ.*

## 1. Chủ đề: chọn cái gì

- **Câu hỏi gốc:** {{QUESTION}}
- **Chủ đề thắng ở kênh tham khảo và vì sao:** [...]
- **Chủ đề thua và vì sao:** [...]
- **Chấm một chủ đề ở Cổng 1** (mỗi tiêu chí 0–2, chọn chủ đề ≥ 7 / 10): [...]

## 2. Tiêu đề + hook

- **Mẫu tiêu đề:** [...] (số liệu cả kênh: `{{SOURCE}}/INGEST.md` mục "Tiêu đề và chủ đề cả kênh").
- **Hook:** {{HOOK_PATTERN}}
- **Câu bắc cầu:** {{BRIDGE_PATTERN}}
- **Kết:** {{CLOSE_PATTERN}}

## 3. Kịch bản: nhịp

| Nhịp | % thời lượng | Việc |
|---|---|---|
{{BEATS}}

**Mẹo giữ chân học được:**
{{DEVICES}}

**Luật viết (làm tốt hơn kênh tham khảo):**
1. Một con số nhất quán từ hook tới kết; mỗi câu VO tối đa 1 con số mới; câu ≤ 20 từ khi có thể.
2. Không làm tròn có hướng: làm tròn **xuống** hoặc "nearly / more than"; con số tranh cãi dán nhãn nguồn trong lời ("According to…", "Some sources say…").
3. Không mô tả chi tiết bạo lực; dùng hệ quả.
4. Không đọc CTA trong video; câu hỏi gợi bình luận để ở comment ghim.
5. Lỗi của kênh tham khảo không được lặp:
{{WEAKNESSES}}
6. **Mỗi câu là một hình** (W8, 2026-11-03): câu nào cũng phải dựng được thành một shot đọc hiểu không cần chữ; câu cần chú thích mới hiểu thì viết lại. Mỗi câu ít nhất một dòng trong `shots.json` (cắt theo từ).
7. Câu ngắn, thì hiện tại; ngôi thứ hai ("You're…") khi format dùng nó (xem mẹo giữ chân ở trên).
8. **Chữ ký của format:** {{SIGNATURE}}. Nói / nghe / thấy mỗi lần nó xảy ra.
9. Mỗi con số có **cách tính** viết ra trong bảng kiểm chứng (W9) trước khi thu giọng; không tự đặt số khi nguồn không có.

## 4. Mục tiêu đo được (kiểm ở Cổng 5 bằng `studio:compare`)

Cột "Họ" đo tự động từ `{{SOURCE}}` (trung vị, khoảng). Cột "Mục tiêu" là lựa chọn của format (QUYẾT), Lucas duyệt.

| Đo | Họ (trung vị) | Họ (khoảng) | Mục tiêu của format |
|---|---|---|---|
{{TARGETS}}

## 5. Kiểm chứng

- Mỗi câu có số, ngày, tên riêng là một khẳng định: có một dòng trong bảng kiểm chứng của FINAL (nguồn, ✓ / ≈ / ✗ / ?). Không còn ✗; "?" phải xử lý trước khi đăng.
- Danh sách khẳng định của một video đo được tự trích ở `_work/<id>.claims.md` (`studio:ingest`).
