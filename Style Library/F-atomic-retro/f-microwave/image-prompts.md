# Ảnh minh họa cho F "Atomic Retro" — video lò vi sóng

*Cách 2 (Lucas 2026-10-10): Free Tier của key Gemini không có quota tạo ảnh (`limit: 0`), nên Lucas tạo ảnh trong app (Gemini / ChatGPT) rồi bỏ vào `public/images/f-microwave/` đúng tên file. Claude tách nền và ghép vào video; số, nhãn, isotype vẫn là vector.*

## Cách tạo

1. Mở **một** cuộc chat mới, dán **STYLE** trước, tạo ảnh 1 (nhân vật). Các ảnh sau tạo **trong cùng chat** và nói "same engineer, same style" để giữ nhân vật đồng nhất.
2. Tỉ lệ **9:16** (dọc). Không chữ, không logo trong ảnh.
3. Ảnh có đánh dấu **[cutout]**: nền một màu kem phẳng, để Claude tách nền. Ảnh **[plate]**: cảnh nền đầy đủ, để trống phần giữa-trên (chỗ đặt số/nhãn).
4. Lưu PNG/JPG đúng tên bên dưới. Ảnh nào chưa ưng thì cứ tạo lại, chỉ cần đúng tên file.

## STYLE (dán đầu tiên)

> Mid-century 1950s Atomic Age illustration, gouache paint with visible paper grain, flat colour blocks in deep teal, mustard yellow, coral red and cream, confident dark ink outlines, soft simple shading, vintage magazine poster look. Friendly, warm, slightly humorous. No text, no letters, no logos, no watermark.

## Danh sách ảnh

| File | Loại | Prompt (sau STYLE) |
|---|---|---|
| `f-01-engineer.png` | cutout | A cheerful 1940s American engineer, round glasses, short brown hair, white lab coat over shirt and coral tie, standing full body facing the viewer, a chocolate bar sticking out of his breast pocket. Plain flat cream background, no shadow on the background. |
| `f-02-engineer-melting.png` | cutout | Same engineer, same pose, looking down surprised at his breast pocket where the chocolate bar is melting and dripping down the coat. Plain flat cream background. |
| `f-03-radar-lab.png` | plate | A 1940s radar laboratory: workbench with a large metal magnetron tube with cooling fins, cables, dials, a small radar dish by the window. Empty floor in the lower third, calm empty wall in the upper half. Vertical 9:16. |
| `f-04-popcorn.png` | cutout | A metal lab tray with popcorn kernels bursting into fluffy white popcorn flying upward. Plain flat cream background. |
| `f-05-radarange.png` | plate | A 1947 restaurant kitchen with a huge steel microwave cabinet the size of a refrigerator, almost as tall as the chef in white apron standing next to it. Vertical 9:16, upper third calm and empty. |
| `f-06-kitchen-1967.png` | plate | A bright 1967 home kitchen, mustard and teal cabinets, a small countertop microwave oven with two dials on the counter, a smiling housewife in a polka-dot dress opening it. Vertical 9:16, upper third calm and empty. |
| `f-07-dinner.png` | cutout | A steaming plate of dinner (roast, peas, potatoes) seen at a slight angle. Plain flat cream background. |

Tổng 7 ảnh. Claude dùng lại các thành phần vector (năm lớn, nhãn, isotype nhà, sóng, phân tử nước) chồng lên trên.
