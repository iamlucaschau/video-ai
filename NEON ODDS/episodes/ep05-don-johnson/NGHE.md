# NGHE — NO-ep05-don-johnson

don-johnson.mp4 · đo 2026-11-09 · earshot trên phần nền (demucs tách giọng) · 12 SFX

- **Trong 1 frame:** 75% (ngẫu nhiên 34%)
- **Trúng tiếng nhấn:** 50% (ngẫu nhiên 7%)
- Hơn ngẫu nhiên: số đo dùng được.

## Cần nghe (2)

| Lúc | SFX | Lệch (ms) | Nổi trên nền (dB) | Vì sao | Quyết định (đã nghe: giữ / đã sửa) |
| --- | --- | --- | --- | --- | --- |
| 0:00.37 | paper-rush:0 | 26.3 | 1.5 | nổi dưới 3 dB: có thể không nghe ra | chờ Lucas nghe: tiếng giấy trượt nhẹ có chủ ý, dưới câu hook |
| 0:20.00 | chip-stack:1 | 40 | 0 | nổi dưới 3 dB: có thể không nghe ra | chờ Lucas nghe: đã hạ xuống −27 vì đè chữ "he" (lượt đo trên wav) |

## SFX đặt trên chữ (2)

Theo code, chưa cần render: tiếng nhấn rơi giữa một chữ đang đọc. Dời vào khoảng lặng ngay sau chữ, hoặc hạ nhỏ.

| Lúc | SFX | Dòng | Chữ |
| --- | --- | --- | --- |
| 0:26.33 | card-flick:3 | 11 | on |
| 0:28.20 | card-flick:4 | 12 | aces |

## Chữ bị nền che (3 dải giọng nói · 2 toàn dải · trên 253 chữ)

Nền trong vòng 3 dB của giọng ngay trên chữ (W5). Toàn dải tệ nhất: nền hơn giọng 9.9 dB. Bảng là dải giọng nói (300–3400 Hz), nơi chữ thật sự bị mất; "and", hơi thở thì thường bỏ qua được.

| Lúc | Dòng | Chữ | Giọng (dB) | Nền (dB) | SFX gần nhất |
| --- | --- | --- | --- | --- | --- |
| 0:19.70 | 08 | he | -31.5 | -33.9 | chip-stack:1 |
| 0:58.34 | 22 | thousand. | -43.7 | -32.9 | chip-stack:7 |
| 0:58.34 | 23 | It's | -35.7 | -34.9 | chip-stack:7 |

Số đo là bằng chứng, không phải gu: whoosh / tiếng dài lên chậm nên lệch là thường; demucs có rò, nên dB chỉ là ƯỚC. Chạy lại demucs trên cùng file, tỉ lệ trúng có thể lệch vài điểm.
