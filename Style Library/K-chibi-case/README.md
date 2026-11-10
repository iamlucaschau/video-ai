# K — Chibi Case

*Thêm 2026-10-29, học từ kênh Facebook "Holo - Người Suy Luận" (5 reel trong `Test/GIAY THU MUOI/`, gói bàn giao ChatGPT cùng thư mục). Dùng cho kênh mới **Giây Thứ Mười** (trinh thám suy luận 2 kỳ, tiếng Việt). Khung mẫu (16 khung của "Vụ cháy kho vàng mã"): `ref.jpg`. Trạng thái: **kit v1 (đang thử)**, chưa dùng cho tập thật.*

- **Look:** hoạt hình 2D phẳng, **nhân vật chibi đầu to** viền đen, má hồng, mắt chấm, miệng mấp máy theo lời. Bộ cảnh dùng lại mọi tập: **phòng hỏi cung** tường xanh lục, cửa sổ song sắt, bảng ghim, bàn gỗ; **nền đêm** xanh navy cho tiêu đề, line-up và bảng gợi ý. **Nhãn trạng thái** góc trái trên cho biết thông tin chắc tới đâu: LỜI KHAI / ▶ PHÁT LẠI / GIẢ THUYẾT / SỰ THẬT. Bằng chứng đánh dấu bằng vòng đỏ vẽ tay và dấu X đỏ.
- **Mạnh:** **câu đố để người xem tự suy luận**: một biến cố, 3 nghi phạm, lời khai đối chiếu được, kết bằng bảng gợi ý + 10 giây đếm ngược + "comment tên + số gợi ý". Kỳ 2 (đáp án) dùng lại đúng cảnh và gợi ý của kỳ 1. Cảnh và nhân vật dựng bằng code nên mỗi tập chỉ cần kịch bản, màu áo và kiểu tóc.
- **Yếu:** chibi SVG trông đơn giản hơn tranh vẽ tay của bản gốc; chưa có tay cử động, chưa có dáng ngồi/đi. Mỗi vụ vẫn cần **một sơ đồ chứng minh vẽ riêng** (bóng nắng, triều, phổ âm thanh…), kit chỉ có timeline. Bối cảnh hiện trường riêng của từng vụ chưa có (xem "Chưa có").
- **Khác H (Paper Dossier):** H là hồ sơ giấy tranh khắc, kể cho người xem nghe một cuộc điều tra có thật. K là hoạt hình nhân vật, chuyện hư cấu, người xem phá án.

## Luật riêng của K (Lucas duyệt 2026-10-29)

1. **Khung 9:16 trước** (1080×1920, 30 fps), mỗi kỳ ~2–3 phút. Bản gốc quay ngang 16:9, dài 3,5–5,5 phút; bản 16:9 làm sau bằng layout riêng, **không crop**.
2. **Camera: chỉ cắt rộng ↔ cận** (`Shot`): khung đứng yên, đổi cỡ cảnh bằng hard cut. Bỏ cú trôi/đẩy chậm của bản gốc. K **không có** ngoại lệ camera.
3. **Chữ: một ngoại lệ duy nhất là bảng gợi ý** (`ClueBoard`): 1 câu hỏi ≤ 5 từ, tối đa **6 thẻ, mỗi thẻ ≤ 4 từ**, hiện lần lượt rồi đứng cả bảng suốt 10 giây đếm ngược. Kit báo lỗi khi quá 6 thẻ hoặc thẻ quá 4 từ. Mọi cảnh khác giữ luật gốc: ≤ 5 từ / khối, ≤ 2 khối ngoài phụ đề. Nhãn trạng thái **tính là một khối**.
4. **Phụ đề giữ luật gốc:** 1 dòng, 1–3 từ, ≤ 18 ký tự (`<KaraokeSubs oneLine maxWords={3} maxChars={18} Skin={CaseSub} />`). Từ đọc tới đâu sáng tới đó; tên nghi phạm, giờ, số mang màu nhấn. Bản gốc dùng cả câu dài, mình không theo.
5. **Không đưa câu VO lên màn hình.** Lời khai nằm ở giọng + phụ đề; trên khung chỉ có nhãn LỜI KHAI + bảng tên.
6. **Timeline không ghi tên:** mỗi hàng là mặt nhân vật; chỉ ghi giờ sự kiện + khoảng giờ của hàng đang xét (2 khối).
7. **Đếm ngược 10 giây im lời.** Không sinh tiếng tick giả; nếu cần tiếng đồng hồ thì lấy bản ghi thật trong `public/sfx/` (chưa chọn), còn không thì để im có chủ đích.
8. **Nhân vật cố định của kênh:** Trâm (thám tử, tóc dài, mũ nồi) và Huy (cộng sự). Giữ nguyên `ChibiLook` của hai người qua mọi tập.

## Màu và chữ

- Vai trò màu (`CASE`): nền đêm `#111827`, giấy `#F4EBDD`, mực `#1B1A1F`, nhấn vàng `#D9A441` (từ khoá, số, nhãn SỰ THẬT), đỏ vật chứng `#C74B46` (vòng, X, vạch sự kiện, đếm ngược). Màu theo `brand.json` của Giây Thứ Mười; dự án khác đổi `accent`.
- Bricolage Grotesque 800 (subset `vietnamese`), mọi chữ ≥ 48 px: nhãn 48, thẻ gợi ý 58, phụ đề 68, câu hỏi bảng 72, tiêu đề hook 92.

## Vùng an toàn

- Nhãn trạng thái ở góc trái trên vùng an toàn; bảng tên đặt trên đầu nghi phạm.
- Cảnh rộng: nghi phạm ngồi sau bàn (x 430, chân y 1300); người hỏi đứng tiền cảnh (x 730, chân y 1500, cao 600) để mặt nằm trên hộp phụ đề.
- Cảnh cận: `Shot close focus={[430, 950]}` (1,8×).
- Bảng gợi ý: câu hỏi ở trên, đồng hồ đếm ở góc phải trên, 6 thẻ từ y 420 tới ~1300. Không có phụ đề trong 10 giây đếm.
- Nền (tường, cửa sổ, đồng hồ treo tường) được tràn ra vùng đỏ; chữ và mặt người thì không.

## Code (`chibi-case.tsx`)

| Phần | Việc |
|---|---|
| `Chibi`, `ChibiLook`, `Mood` | nhân vật SVG: tóc `short/long/bun/bald`, mũ `fedora/beret`, ria, kính, màu áo; 5 biểu cảm (`neutral/worried/angry/smug/shock`); chớp mắt theo nhịp riêng mỗi người (seed theo tên); `eyes` liếc trái/phải; `head` chỉ vẽ đầu; `ghost` = hình mờ xám cho giả thuyết; `flip` |
| `talkOf(lines, who, t, words?)` | độ mở miệng 0→1: tiếng Việt mỗi từ một âm tiết, nên miệng mở một lần mỗi từ. Thời điểm từ lấy từ `words.json` (Whisper), thiếu thì chia đều câu |
| `Said` | một câu VO: `id, who, start, end, text` (cùng dạng `timing.lines` của manifest, thêm `who`) |
| `RoomBack`, `Desk` | phòng hỏi cung: tường + sàn (vẽ trước nhân vật), mặt bàn (vẽ sau người ngồi, trước người đứng) |
| `NightBg` | nền đêm có viền tối cho tiêu đề, timeline, line-up, bảng |
| `Shot` | khung cố định rộng / cận 1,8× quanh `focus`; chỉ đổi khi cắt cảnh |
| `StatusTag` | LỜI KHAI / ▶ PHÁT LẠI / GIẢ THUYẾT / SỰ THẬT |
| `NameChip` | bảng tên "MINH · THỢ BÁNH" |
| `CaseTitle` | hook: chip giờ đỏ + tiêu đề trắng 1 dòng; cũng là khung thumbnail |
| `CaseSub` | skin phụ đề 1 dòng cho `KaraokeSubs` |
| `RedRing`, `XMark` | vòng đỏ vẽ dần quanh vật chứng, dấu X loại trừ |
| `Timeline` | ai ở đâu lúc nào: mặt + thanh giờ mọc dần + vạch sự kiện đỏ; `active` sáng hàng đang xét |
| `LineUp` | 3 nghi phạm dưới đèn chiếu; người `active` sáng và có số |
| `ClueBoard`, `Countdown` | bảng ≤ 6 gợi ý (ngoại lệ chữ), `mark` khoanh gợi ý quyết định ở kỳ đáp án; vòng đếm ngược 10 → 0 |

## Chưa có (làm khi có tập thật)

- Bối cảnh hiện trường riêng từng vụ (phố, nhà, kho…): ảnh AI tự tạo cùng tông 2D phẳng, đặt bằng `<Img>`, nhân vật chibi đứng trên; hoặc vẽ thêm set SVG như `RoomBack`.
- Tay / dáng ngồi khác, bong bóng suy nghĩ, waveform cho manh mối âm thanh (manh mối âm thanh phải cho nghe bản thật + phụ đề mô tả).
- Bản 16:9, CTA cuối (comment "tên + số gợi ý", hẹn giờ đáp án), outro kênh.
- SFX và nhạc: chưa chọn; dùng `Sfx` / `MusicBed` (`src/series/pvr/sfx.tsx`) như các style khác, tối đa 1 SFX / nhịp.

## Bản test

`k-test/Video.tsx`, composition `Style-K-ChibiCase-Test` (~27 s: 16,4 s VO + 10 s đếm). Một vụ nhỏ tự viết ("Ai tắt cầu dao?", tiệm bánh, 3 nghi phạm), đi qua mọi phần của kit: hook → phòng hỏi cung rộng → cắt cận → timeline + vòng đỏ → line-up → bảng 6 gợi ý + 10 giây đếm. Kịch bản: `k-test/kich-ban-k-test-FINAL.md`.

- **Giọng (Gemini TTS, 3 request nhờ `batchBy: "take"`):** Trâm = Kore (nữ, chậm, chắc), Minh = Puck (nam trẻ, lo lắng). Mỗi dòng có `voice`/`style` riêng trong `voiceover/k-test.json`.
- Pipeline: `npm run voiceover -- voiceover/k-test.json` → `node scripts/episode.mjs export "Style Library/K-chibi-case/k-test"` → `python -P scripts/words.py k-test vi` (trên Windows đặt `PYTHONIOENCODING=utf-8`, nếu không dòng cảnh báo ⚠ làm script dừng).
- Mọi cú cắt, thanh timeline, vòng đỏ, line-up lấy từ `k-test.timing.json` + `k-test.words.json`; miệng mở theo từng từ Whisper nghe được.
- **Viết VO cho phụ đề 3 từ:** `KaraokeSubs` cắt tham lam mỗi 3 từ, nên viết câu để chỗ cắt rơi đúng ranh giới từ ghép (bản đầu "chạm vào cầu | dao", "nói | dối" phải sửa). Mẹo: câu 5–6 âm tiết chia 3 + 2/3 ("Tôi chưa hề | chạm cầu dao.", "Đến lượt bạn: | 10 giây.").
- Kiểm: `npx remotion still Style-K-ChibiCase-Test out/k.png --frame=150 --props='{"safeGuide":true}'`. Bản test chưa master âm thanh (−10,8 LUFS, chỉ có giọng); tập thật thêm nhạc + SFX rồi master −14 LUFS như `render:j`.
