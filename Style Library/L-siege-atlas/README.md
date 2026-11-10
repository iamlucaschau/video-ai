# L — Thế Trận

> **Tên:** Thế Trận (Lucas chốt 2026-11-02; tên tạm trước đó "Siege Atlas"). Thư mục, file kit và id composition giữ nguyên (`L-siege-atlas`, `siege-atlas.tsx`, `Style-L-SiegeAtlas-…`).

*Thêm 2026-11-01, học từ kênh History Maps Lore (`Test/History Maps Lore/BAO-CAO.md`, `BOC-TACH-HINH.md`; Lucas chốt D1–D12). Trạng thái: **kit v1 + bản test 30 s** (`l-thermopylae/`), chờ Lucas duyệt. Kênh dùng style này: **chưa chốt** (D2: tạo sau khi video mẫu ổn).*

- **Look:** **bản đồ giấy chính trị**: đất màu giấy be có bóng địa hình, biển xám xanh đậm, viền bờ biển mảnh. Mỗi phe một màu bán trong suốt theo **biên giới đúng năm** (vẽ tay theo bản đồ học thuật, cắt đúng bờ biển thật). Cờ phe trên cột, **chip mốc thời gian** ở đỉnh vùng an toàn, nhãn địa danh là tấm bảng tối chữ Bebas, **kính lúp** phóng nơi nhỏ, **chân dung trên băng rôn** khi nhắc nhân vật, **mũi tên chiến dịch** màu phe, phụ đề karaoke, kết bằng **end card serif vàng NƠI · NĂM**.
- **Mạnh:** **một cuộc đối đầu ở một nơi** (vây hãm, trận đánh, cuộc chiếm đóng): "làm sao bên nhỏ chặn được siêu cường?", "vì sao kẻ mạnh làm vậy?". Bản đồ cho thấy ngay ai nắm vùng nào, lớn cỡ nào; chip ngày làm xương sống cho chuỗi mốc tháng.
- **Yếu:** cần **biên giới theo năm** cho mỗi tập (vẽ tay, có nguồn); nền dựng lại từ ảnh Blue Marble nên **không nét khi zoom gần** (tấm `detail` 240 px / độ: cỡ một vùng; khe Thermopylae trong kính lúp chỉ thấy vịnh và núi, không thấy con đường). Zoom tới cấp thành phố / pháo đài cần nguồn địa hình nét hơn (DEM): **đề xuất riêng khi có tập cần**. Không có diorama 3D như đối thủ (D7: thay bằng tranh / tiểu hoạ public domain + ảnh AI tách lớp parallax, ≤ 2–3 cảnh / tập).
- **Hook:** câu khẳng định **năm + siêu cường + mục tiêu nhỏ** (nghịch lý kích thước), không phải câu hỏi; chip năm hiện cùng con số.
- **Máy quay (D6, luật style I):** chỉ bay khi đổi nơi, ease in-out, ≥ 22 frame, không nảy; đẩy chậm ≤ 5 % / 3 s (`key()` mặc định 1 % / s); **không xoay, không nghiêng, không motion blur**. Ngoại lệ máy quay của J **không** áp dụng cho L.
- **Chữ (D3–D5):** phụ đề karaoke Style Library §2.6 (≤ 4 từ / 26 ký tự, 2 dòng, từ đã đọc sáng lên, số và từ khoá vàng). Nhãn, chip, tên băng rôn: Bebas Neue ≥ 48 px, **≤ 2 khối chữ cùng lúc** ngoài phụ đề. **Serif duy nhất: end card** (Cinzel, ≤ 2 từ + năm, tự co cỡ cho vừa vùng an toàn). Không toạ độ, không nhãn serif nhỏ như đối thủ.
- **Vào cảnh không trùng kiểu** (AGENTS luật short-form 5): chip rơi xuống, nhãn mở ngang, cờ mọc cột rồi bung, băng rôn cuộn xuống, kính lúp nở ra, vùng phe lan ra từ thủ đô, end card khép chữ.
- **Bạo lực (D9):** không tranh xác chết / máu toàn khung; hệ quả nói bằng số.
- **Âm thanh:** nhạc nền Pixabay −25 LUFS (trước trim), luật SFX "ít tiếng" (D-SFX: chỉ khi có gì xảy ra trên hình, ≤ 2 whoosh / tập); mix hạ 3 dB, master −14 LUFS bằng `npm run render:j`.
- **Kết (D10):** end card NƠI · NĂM rơi vào những chữ cuối, cắt ~0,5 s sau khi card đứng yên; không nối vòng, không CTA.
- **Độ dài (D11):** 85–100 s (~220–260 từ) cho một tập; bản test 30 s.
- **Vùng an toàn:** x 60–940, y 220–1440; nhãn tự mờ khi bị camera mang ra mép; QA bằng `--props='{"safeGuide":true}'` + skill `review-loop`.

## Nền bản đồ

1. Cắt tấm vệ tinh như style J (`scripts/make-plates.py`, NASA Blue Marble, public domain), hoặc dùng lại tấm của một tập J cùng vùng.
2. Viết `factions.json` của tập: mỗi phe `{ color, note (nguồn), rings: [[[lon, lat], …]] }`, vẽ tay theo bản đồ học thuật (D8: OpenHistoricalMap trước nếu có lớp năm đó). Đường có thể chạy qua biển: mặt nạ đất sẽ cắt.
3. `python -P scripts/atlas-plates.py <tấm J> public/images/<slug>/map <factions.json> world mid detail` → tấm giấy `<tấm>.jpg` + lớp phe `<tấm>-<phe>.png` + `plates.json`. Biên giới vẽ tay tự được uốn nhẹ (`wobble`) để không thành đường thước kẻ.

Giới hạn đã biết: bộ lọc biển / đất đọc màu Blue Marble nên vài vùng nước nông xa bờ (Bahamas, Tây Phi) trên tấm `world` bị nhận nhầm thành đất; vùng Địa Trung Hải – Trung Đông – Ấn Độ sạch.

## Code (`siege-atlas.tsx`)

| Phần | Việc |
|---|---|
| `key()` | khoá camera theo luật I (không xoay, không nghiêng, đẩy 1 % / s); dùng `camAt`, `project`, `projectLine` của kit J |
| `AtlasMap` | tấm giấy + lớp phe trong cùng một mặt phẳng; mỗi lớp có `o` và `reveal` (lan tròn từ một toạ độ, cùng bán kính màn hình cho mọi tấm) |
| `DateChip` | chip mốc thời gian (T4): bảng tối, viền vàng, Bebas 64 px, rơi xuống |
| `Plaque` | nhãn địa danh: chấm + bảng tối mở ngang, Bebas 52 px; tự mờ gần mép |
| `Flag` | cờ phe trên cột (T2), dấu `disc` / `lambda` |
| `Magnifier` | kính lúp (T5): vòng tròn phóng bản đồ quanh một điểm, hai tiếp tuyến nối về điểm thật |
| `Banner` | chân dung trên băng rôn treo (T3): thanh vàng, vải màu phe cuộn xuống, bảng tên |
| `CampaignArrow` | mũi tên chiến dịch (T6) vẽ dần theo điểm màn hình |
| `NumberChip` | chip con số / từ khoá màu phe (≤ 5 từ), bật lên từ một điểm (7,000 · 300 SPARTANS) |
| `Pinch` | hai nêm kẹp vào một điểm: "khe hẹp" khi bản đồ không đủ nét để thấy |
| `EndCard` | end card serif vàng NƠI · NĂM (T14, D5), tự co cỡ |
| `AtlasSub` | skin phụ đề karaoke cho `KaraokeSubs` (`../subs.tsx`) |

## Bản test

`l-thermopylae/`: "Thermopylae, 480 BC" (EN, ~30 s, dừng trước trận đánh), composition `Style-L-SiegeAtlas-Thermopylae`. Kịch bản + kiểm chứng + nguồn bản đồ / tranh: `kich-ban-l-thermopylae-FINAL.md`; spec: `01_EPISODE-SPEC_l-thermopylae.md`; phe: `factions.json`; QA: `checks.md`. Giọng Gemini TTS (Charon, tempo 1,05) qua `episode.mjs prep` → `npm run voiceover` → `episode.mjs export` → `words.py`.
