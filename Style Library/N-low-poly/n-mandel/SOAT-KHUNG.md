# Soát từng khung — n-mandel (2026-11-06)

Cách làm: trích đủ 3.079 khung thành 16 tờ ảnh nhỏ (108×192, có số khung) và xem hết; xem lại mỗi khung thứ 6 của bản đã sửa, cộng các shot sửa sau cùng; `short-qa.py` đo mọi khung.

## Lỗi đã sửa

| # | Shot | Lỗi | Sửa |
|---|---|---|---|
| 1 | S1, S25, S42, S43, S56 | sàn sân khấu vàng chói: viền vàng dựng thành cả đĩa | viền thành vòng, sàn tối |
| 2 | S9, S14 và mọi vé | mọi tờ vé cùng một dãy số: sai với ý "mọi tổ hợp" (seed theo độ dài tên) | seed theo hash |
| 3 | mọi vé | số dính thành một dãy dài | giãn thành 6 cặp số |
| 4 | S3, S7, S36 | bảng ghi "$2,000,000": số ngoài bảng kiểm chứng | mặc định không ghi số |
| 5 | S10, S23, S41 | đèn bàn giống ly cocktail (chao úp ngược) | lật chao |
| 6 | S45 | đèn thẩm vấn úp ngược; Mandel trắng như xương | lật chao, giảm đèn, chỉnh màu |
| 7 | S46, S47 | bóng đèn trắng lọt góc khung; mặt tối vì nhìn từ phía không có đèn | ẩn đèn ở 2 shot này, thêm đèn phụ |
| 8 | S6, S23 | đế che chữ bảng tên; phụ đề đè bảng tên | dựng lại bảng, hạ góc máy |
| 9 | S6 | một shot 4,6 s gần như đứng | tách 3 shot (thêm S6b, S6c) |
| 10 | S11 | đĩa lơ lửng khó hiểu; tháp xu tối | bỏ đĩa, đổi vật liệu |
| 11 | S9, S11, S12, S14–S16, S20, S26, S27, S33 | sân khấu số quá tối, đống vé thành nhiễu đen trắng | thêm đèn `stage` |
| 12 | S12, S33 | "đội quân" chỉ là một dải mỏng, nửa khung đen | góc cao, 90–130 người |
| 13 | S13, S29–S32 | giấy máy in tụt về đột ngột | giấy cuộn liên tục |
| 14 | S18, S24 | đất hiện bật ra, một khung biển trống; nhìn từ trên không thấy nổi lên | đất lớn dần từ giữa |
| 15 | S18, S19, S24, S35 | bản đồ bị cắt hai bên, phẳng lì | lùi máy, thêm đồi low-poly |
| 16 | S21, S50 | búa tự bay, không có tay; lên quá khung | nghị sĩ cầm búa thật, gõ 2 lần ở S21 |
| 17 | S22, S51 | con dấu tự bay | thêm tay |
| 18 | S51 | chữ BANNED bị nắp thùng che, không bao giờ thấy | đặt lên nắp |
| 19 | S25, S43 | 16 khung đầu trống; chỉ thấy 2 trên 6 bóng; số ở phía sau bóng | 2 hàng 3 bóng, số hướng ra trước |
| 20 | S27 | vé bị cắt mép | lùi máy |
| 21 | S30, S31 | "16 WORKERS" chỉ thấy 1 người; "30 COMPUTERS" thấy 1 màn hình | góc rộng |
| 22 | S36 | chip 72 HOURS che người | dời lên trên |
| 23 | S37 | 2 s nhìn thùng carton đứng yên | vé bay từ máy vào đống |
| 24 | S40 | 3 s tối đen, đứng yên | thêm đèn, người, tách shot S40b |
| 25 | S41, S49 và mọi cận mặt | cổ dài như cổ cò; cười không thấy | hạ đầu, thêm vai, thêm khoé miệng |
| 26 | S41 | mặt đứng 2,8 s | đẩy máy chậm, thêm giọt mồ hôi |
| 27 | S54 | "14 JACKPOTS" mà chỉ thấy 6 khung | lưới đủ 14 khung |

## Còn lại, chưa sửa

- 28 đoạn gần như đứng từ 0,4 s trở lên (đo bởi `short-qa.py`): máy lướt rất chậm, nhân vật ít cử động.
- Nhân vật chỉ có vài tư thế; không ai đi lại trừ người đưa vé, Mandel không có diễn xuất rõ.
- Bản đồ Virginia không có ranh giới dễ nhận ra.
- Bản soát cuối xem mỗi khung thứ 6, không phải từng khung; ảnh nhỏ không lộ lỗi chi tiết nhỏ.
