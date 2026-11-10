# Đề xuất: học gì từ `mromidev/claude-animated-shorts` cho style M "Hoạt Sử"

*2026-11-04, Luis. **Lucas duyệt N1–N14 (2026-11-04), đã áp dụng** (§5); N15, N16 không làm; N17 thành luật mới (SFX tạo bằng code được dùng khi không có file thật hợp). Repo: https://github.com/mromidev/claude-animated-shorts (MIT, commit `e3b817b` 2026-11-01), clone đọc tại `reference/claude-animated-shorts/` (git-ignored, không cài, không chạy). Khung frame / sheet tham khảo trong repo là của một kênh khác ("private study"): chỉ xem, không dùng, không đưa vào video.*

## 1. Repo này là gì

Một skill Claude Code làm Short 55–70 s kiểu **"nhân vật 2D trong thế giới 3D"**:
- **Thế giới:** three.js trong Remotion (`@remotion/three` + react-three-fiber + `postprocessing`), nhà / cây / đạo cụ low-poly (Kenney CC0) tô lại màu, texture vẽ bằng Canvas2D.
- **Hình ảnh:** viền mực đen trên hình khối 3D (một pass hậu kỳ riêng), lens blur (DOF) theo từng shot, bloom chỉ cho nguồn sáng, tone map + grade màu.
- **Nhân vật:** vẽ Canvas2D thành "thẻ" (billboard) luôn quay mặt về camera, nhận ánh sáng của cảnh.
- **Camera:** trượt (glide) mượt, đẩy chậm liên tục, nghiêng (roll), rung ngắn khi va chạm.
- **Âm thanh:** SFX và nhạc **tổng hợp bằng numpy** (không dùng file thật).
- **Ví dụ trong repo:** một video duy nhất, "The Bridge That Fell for a Song" (67 s, ~5.000 dòng code riêng cho câu chuyện đó).
- **Phần giá trị nhất:** 7 báo cáo **đo bằng số** (chuyển động, chiều sâu, chất liệu, nhân vật, ánh sáng, viền, màu) so với 20 Short tham khảo, kèm "look-match loop": đo trước, sửa theo từng mảng, chấm điểm từng mảng /10.

## 2. Mình đã có gì (so với họ)

| Mảng | Họ | Mình (style M hiện tại) |
|---|---|---|
| Nhân vật | thẻ Canvas2D, đầu hình hạt đậu, mực tím than dày mỏng, 14 biểu cảm | rig toon-engine (tay chân 2 khớp, 9 biểu cảm, đi), đầu tròn, viền đều, đồ thời kỳ trong kit |
| Cảnh | 3D thật, đi vòng quanh được | 2D: phòng phối cảnh + 11 nền ngoài trời vẽ code (vừa nâng cấp) |
| Camera | trượt, đẩy chậm liên tục, nghiêng, rung khi va chạm | khung đứng + cắt; một đẩy chậm vào bản đồ; lia một lần ở shot mở cảnh (camera C) |
| Âm thanh | SFX + nhạc tổng hợp | **SFX thật** (Pixabay / Mixkit), nhạc có giấy phép, master −14 LUFS, đo giọng bị che (W5) |
| Kiểm | QA từng frame (đen / trắng / đứng / nhảy hình), sheet đặt cạnh tham khảo, chấm 7 mảng /10 | storyboard, sheet, critic mắt mới, `studio:compare` (số đo vs kênh tham khảo) |
| Nội dung | không kiểm chứng nguồn ra bảng | bảng kiểm chứng mọi con số, chữ trong vùng an toàn, phụ đề |
| Xuất | 2K (1440×2560) | 4K (2160×3840) |

**Mình hơn họ ở:** kiểm chứng sự thật, SFX thật, quy trình 5 cổng có Lucas duyệt, đo so sánh bằng `studio:compare`, vùng an toàn, 4K.

## 3. Nâng cấp mình còn thiếu (chờ duyệt)

Mức: 🟢 làm bằng code đang có · 🟡 làm được nhưng tốn công / đổi nét · 🟠 cần cài gói mới · ⚠ đụng luật Lucas đã đặt.

| # | Nâng cấp | Họ làm (số đo) | Mình thiếu gì | Mức | Ghi chú |
|---|---|---|---|---|---|
| **N1** | **Nhoè hậu cảnh (DOF) ở shot cận / vừa** | DOF ở ~1/3 thời lượng; độ nhoè nền 10–16 px (trên khung 1080) ở cận, 7–12 px ở vừa, shot rộng thì nét | nền luôn nét, nhân vật không "tách" khỏi nền | 🟢 | 2D làm được: `feGaussianBlur` cho lớp nền khi `cam` zoom ≥ 1,6. Không cần 3D |
| **N2** | **Vật tiền cảnh mờ** ở ~1/3 số shot | 20 % khung có vật gần ống kính, nhoè 4–8 px | không có | 🟢 | cành cây, mép tường, dây kẽm gai ở góc khung (`Foreground` đã có trong toon-engine `kit.tsx`) |
| **N3** | **Grade màu theo ánh sáng** (ngày / hoàng hôn / đêm) | đen không bị bết (p2 L* ~15), nhấn bão hoà, bóng đổ ngả tím xanh lúc hoàng hôn | màu từng cảnh tự chọn tay, không có lớp grade chung | 🟢 | một bộ lọc SVG `feColorMatrix` / đường cong cho cả khung, preset theo cảnh |
| **N4** | **Nhân vật nhận ánh sáng của cảnh** | mặt V ~.97 nhưng ngả màu theo cảnh (sat .03 ngày → .23 hoàng hôn); bóng chân dạng vệt mềm lệch theo hướng nắng | mặt trắng như nhau ở mọi cảnh; bóng chân là elip đều | 🟢 | tint nhẹ theo cảnh (đêm xanh, hoàng hôn cam) + bóng chân lệch hướng nắng |
| **N5** | **Nhịp chớp mắt + phản ứng trước từ** | chớp mỗi 0,5–2,3 s, 4 frame (nửa / nhắm / nhắm / nửa) + chớp ở mỗi lần đổi mặt; đổi mặt 0–3 frame **trước** từ | chớp 2,5–3,5 s, 3 frame; đổi mặt đặt tay, thường đúng hoặc sau từ | 🟢 | sửa `alive()` + quy ước "đổi mặt = từ − 2 frame" |
| **N6** | **Đi bộ nảy, chân không trượt** | nhún 3–7 % chiều cao, nghiêng 1–7°, một bước 9–12 frame, chân trụ dính đất | `walkPose` nhún ~1,5 %, chân trượt khi x chạy theo `kf` | 🟢 | sửa `walkPose` (toon-engine) + nối tốc độ x với sải chân |
| **N7** | **Thêm hiệu ứng 2D** | tia lửa, vòng sáng, vệt tốc độ, bụi phụt khi tiếp đất, nước bắn, tia nắng | đã có nổ, loé, nốt nhạc, chớp súng; thiếu vệt tốc độ, bụi, nước bắn | 🟢 | thêm vào `ww2.tsx` / kit |
| **N8** | **Chất liệu vẽ trên bề mặt** | ván gỗ có đường nối sẫm, đá, vữa, mái ngói, cỏ, đường đất (texture vẽ, không phải màu phẳng) | sàn / tường phòng và nền ngoài trời còn màu phẳng + vài nét | 🟢 | `<pattern>` SVG cho gỗ, đá, ngói, vữa dùng lại ở mọi phòng / cảnh |
| **N9** | **Nét nhân vật** | đầu "hạt đậu" (h/w ~.93, đỉnh hơi nhọn), mực tím than (#241726) dày ở phía tối, mỏng phía sáng; 14 biểu cảm | đầu tròn đều, viền đen đều | 🟡 | đổi nét toàn bộ nhân vật (sửa `toon-engine/rig.tsx`); hai video M đã làm sẽ đổi theo nếu render lại |
| **N10** | **QA từng frame** (`short_qa.py`) | dò frame đen / trắng / đứng ≥ 12 f / "nhảy hình" (pop) + độ to | mình có sheet + compare, chưa dò "nhảy hình" (vd. Doss từ đứng sang nằm trong 1 frame mà critic mới bắt được) | 🟢 | script Python (Pillow / numpy đã có), chạy sau render |
| **N11** | **Chấm 7 mảng /10 + sheet đặt cạnh tham khảo** | verifier chấm màu, ánh sáng, viền, chất liệu, nhân vật, chiều sâu, bố cục; sửa theo mảng thấp nhất | critic liệt kê lỗi, không chấm theo mảng | 🟢 | thêm vào skill `review-loop`: bảng điểm + `sbs_sheet` (của mình vs frame kênh tham khảo trong `Test/<kênh>/_work`) |
| **N12** | **7 báo cáo đo khi phân tích style mới** | chuyển động, chiều sâu, chất liệu, nhân vật, ánh sáng, viền, màu: số, không phải tính từ | `QUY-TRINH-PHAN-TICH.md` đo kịch bản + nhịp cắt + âm thanh + chữ; chưa đo ánh sáng / màu / DOF / chuyển động nhân vật | 🟢 | bổ sung Giai đoạn 1 của quy trình (và `studio:ingest` nếu đo được tự động) |
| **N13** | **Mẹo kịch bản mới** | "You see," + một phép so sánh đời thường để giải thích cơ chế (14 / 20 video); câu đôi "Luckily… / Unluckily…"; câu thoại ngắn của người chế giễu | công thức Squire chưa có nhịp "giải thích cơ chế" | 🟢 | thêm vào `02_CONG-THUC.md` như biến thể cho chuyện có cơ chế vật lý |
| **N14** | **Chuyển cảnh bằng hình** | đi theo một vật (viên đạn, quả bóng) sang cảnh sau; crossfade 6–8 f khi đổi nơi; chớp trắng 4 f sau hook | toàn hard cut | 🟢 / ⚠ | crossfade ≤ 8 f và chớp trắng **hợp luật**; "đi theo vật" và lia nhanh có nhoè thì **⚠ trái luật camera** |
| **N15** | **Camera luôn chuyển động** | 65 % frame có chuyển động; mọi shot giữ lâu đều đẩy vào 0,15–0,35 %/frame; nghiêng 4–5°; rung 7 f đổi chiều mỗi frame khi va chạm | đúng thứ chỉ số "hình đứng yên" của mình thiếu (61 % vs 7 %) | ⚠ | **trái luật short-form số 2** (không máy quay giả, không rung) và lựa chọn C của Lucas. Chỉ ghi để Lucas biết nguồn gốc của chỉ số; không đề xuất |
| **N16** | **Thế giới 3D thật** (three.js) | thành phố, cầu, sông 3D có mực, DOF, ánh sáng thật, camera bay quanh | toàn bộ là 2D | 🟠 / ⚠ | cần cài `@remotion/three`, `three`, `@react-three/fiber`, `@react-three/postprocessing`, `postprocessing` + mô hình Kenney (CC0). Mỗi tập phải dựng thế giới riêng (họ: ~5.000 dòng cho 1 video), render 2K ~4 fps (~10 phút / 67 s). Camera bay quanh lại đụng luật camera. Đề xuất nếu muốn: **một bản thử nhỏ** (một con phố 3D + 1 nhân vật thẻ, 10 s) trong thư mục riêng, rồi Lucas so với 2D |
| **N17** | **SFX / nhạc tổng hợp** | toàn bộ tổng hợp bằng numpy | — | 🟢 | **Lucas đổi luật 2026-11-04:** SFX thật trước, tạo bằng code khi không có file thật hợp (AGENTS "Sound design"). Mẫu tổng hợp: `reference/claude-animated-shorts/templates/audio/` |

**Phát hiện phụ (không cần duyệt để biết):**
- Repo cảnh báo: mỗi lần Remotion đóng gói (bundle) đều chép `public/` vào thư mục Temp và **không xoá**. Máy mình hiện có **12 thư mục bundle cũ, 7,4 GB** trong `C:\Users\ADMIN\AppData\Local\Temp`.
- `public/` hiện 301 MB, nên mỗi bundle tốn thêm khoảng chừng đó.
- Mình chưa xoá: các phiên khác có thể đang render. Nếu Lucas muốn thì dọn khi không có render nào chạy.

## 4. Thứ tự Luis đề xuất

1. **Gói "chiều sâu + ánh sáng" (N1–N4, N8)**: làm 2D, không cài gì, nhìn thấy khác biệt rõ nhất (nền nhoè khi cận, tiền cảnh, grade, mặt nhận màu cảnh, chất liệu).
2. **Gói "diễn" (N5–N7)**: chớp mắt, phản ứng trước từ, đi bộ nảy, hiệu ứng.
3. **Gói "kiểm" (N10–N12)**: dò nhảy hình, chấm 7 mảng, bổ sung quy trình phân tích.
4. **N13, N14** (phần hợp luật): cập nhật công thức + crossfade / chớp trắng.
5. **N9** (đổi nét nhân vật) và **N16** (thử 3D): chỉ khi Lucas muốn đổi hẳn look; N16 cần duyệt cài gói 🟠.
6. **N15**: không làm (trái luật camera). **N17**: Lucas đổi luật 2026-11-04, dùng được khi không có SFX thật hợp.

## 5. Đã áp dụng (2026-11-04)

| # | Ở đâu |
|---|---|
| N1–N4, N8, N14 | `Style Library/M-hoat-su/look.tsx`; `Office` (`hoat-su.tsx`) và `Outside` (`ww2.tsx`) đọc độ nhoè; `sets.tsx` vân mặt đất; gắn vào `m-doss/Video.tsx` (`LIGHT`, `FG`, `XFADE`, `ShotLayer`, chớp trắng ở S4) |
| N5 | `blinkAt` trong `hoat-su.tsx` (`alive`) |
| N6 | `walkFrom`, `STEP_LEN`, nhún / nghiêng mới trong `toon-engine/rig.tsx` `walkPose`; các cảnh đi của Doss dùng `walkFrom` |
| N7 | `SpeedLines`, `DustPuff`, `Splash` trong `ww2.tsx`; Doss S8, S14, S18 |
| N9 | `Look.head: "bean"` + viền `PLUM` (`toon-engine/rig.tsx`, `look()` của kit M) |
| N10 | `scripts/short-qa.py` (`--selftest`); bắt được ở bản Doss cũ: sổ 75 biến mất trong 1 frame, cảnh 1942 đứng hình |
| N11 | `scripts/sbs-sheet.py`; chấm 7 mảng trong `.claude/skills/review-loop/SKILL.md` |
| N12 | `Style Library/QUY-TRINH-PHAN-TICH.md` §1.2 (7 mảng đo hình) |
| N13 | `Formats/Hoat Su/00_he-thong/02_CONG-THUC.md` (biến thể "giải thích cơ chế") |

N17 đổi luật sau đó (Lucas 2026-11-04): SFX thật trước, tạo bằng code khi không có file hợp (AGENTS "Sound design").

Video Churchill và bản test Garbo nhận các thay đổi ở kit (đầu hạt đậu, viền, chớp mắt, vân phòng) khi render lại; nhoè nền / grade / tiền cảnh / crossfade cần gắn `ShotLayer` như Doss.
