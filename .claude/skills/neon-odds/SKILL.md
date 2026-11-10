---
name: neon-odds
description: Làm trọn một tập Shorts cho kênh NEON ODDS (3D low-poly toàn code, chuyện có thật về hệ thống cờ bạc và xác suất): gợi ý đề tài, viết kịch bản theo công thức kênh có bảng kiểm chứng, tạo giọng, dựng và render video 1080, gói sản xuất (tiêu đề, mô tả, hashtag, từ khoá) và thumbnail 9:16. Dùng khi người dùng gõ /neon-odds, đưa một đề tài cho NEON ODDS, xin gợi ý đề tài, hoặc nói "làm tập mới", "làm video về <người / mánh / xổ số / casino>" cho kênh này, kể cả khi không nhắc tên kênh mà rõ ràng là loạt video low-poly này. Không dùng cho các kênh khác trong repo (Mapped Journeys, Naval Board, Poor vs Rich).
---

# NEON ODDS: một đề tài vào, một tập đăng được ra

Trả lời người dùng bằng tiếng Việt. Video đọc tiếng Anh. Đầu vào là phần chữ sau lệnh `/neon-odds`.

Chất lượng tham chiếu là tập mẫu `Style Library/N-low-poly/n-mandel/`, Lucas chốt ở mức khoảng 7/10 cho 3D toàn code (2026-11-06). Mục tiêu là đạt mức đó đều và nhanh. Đừng cố đẩy một tập lên 9 bằng cách sửa mãi: Lucas đã thấy việc đó tốn thời gian mà điểm chững lại.

## Nếu không có đề tài

Liệt kê tập đã làm để khỏi trùng: Mandel và `NEON ODDS/episodes/` (chưa có thư mục này nghĩa là chưa có tập nào khác). Tìm web để chắc đề tài có nguồn, rồi đưa **10 đề tài** theo `references/cong-thuc.md` §1. Xếp đầu danh sách các đề tài đủ cả 3 yếu tố, thuộc họ view cao và có nguồn tốt nhất.

Mỗi đề tài gồm: tên, họ đề tài, câu hook (tiếng Anh, vì video đọc tiếng Anh), con số lớn, nguồn đã thấy, và một ý ngắn về chỗ còn lệch hoặc thiếu nguồn. Đề tài kênh mẫu từng làm vẫn dùng được vì sự kiện là của chung, nhưng phải tự tìm nguồn và kể theo góc của mình. Số chỉ thấy qua kết quả tìm kiếm thì nói rõ là chưa mở bài gốc.

Rồi hỏi người dùng chọn số nào và **dừng ở đó**, chưa tạo file.

## Quy trình 5 bước, dừng 2 lần

Tạo thư mục tập trước khi viết gì: `node .claude/skills/neon-odds/scripts/new-episode.mjs new <NN> <slug>` (NN là số tập kế tiếp, slug chữ thường nối gạch). Sau mỗi bước, cập nhật `progress.md` và `checks.md` trong thư mục tập, vì phiên sau đọc hai file này để làm tiếp.

### 1. Kịch bản → DỪNG DUYỆT LẦN 1

Đọc `references/cong-thuc.md`. Tìm nguồn trước, viết sau, vì một kịch bản hay mà sai số thì phải bỏ. Có phán quyết hay tài liệu gốc thì đọc bản gốc: tập Ivey nhờ đọc phán quyết mới sửa được một ý sai lúc gợi ý đề tài. PDF mà subagent không đọc được thì tải về và chạy `pdftotext -layout`. Điền `kich-ban-<slug>-FINAL.md` và `01_EPISODE-SPEC_<slug>.md` (VO của spec phải khớp từng chữ với FINAL, `episode.mjs` sẽ kiểm).

- Mọi con số và khẳng định có một dòng trong bảng kiểm chứng, kèm nguồn. Con số tranh cãi cần 2 nguồn. Chỉ đọc được qua kết quả tìm kiếm mà không mở được bài gốc thì ghi ƯỚC, đừng ghi là đã kiểm.
- Đếm từ sau khi viết: số đọc thành chữ tốn nhiều từ ("seven point seven million pounds" là 5 từ), bản đầu dễ vượt 353. Cắt phần trước cú lật để cú lật rơi vào 70–90%.
- Kể ở mức câu chuyện: cơ chế nghe thông minh, nhưng không phải hướng dẫn từng bước để gian lận. Với người thật còn sống, chỉ nói điều nguồn đã nói.

Gửi người dùng: lời đọc, bản dịch Việt, số từ và thời lượng ước tính, bảng kiểm chứng, những chỗ còn yếu. **Dừng, chờ duyệt.** Lý do dừng ở đây: giọng đọc tốn lượt có hạn, và kịch bản là phần quyết định nhiều nhất.

### 2. Giọng

Khi đã duyệt, chạy theo thứ tự:

```bash
node scripts/episode.mjs prep "NEON ODDS/episodes/epNN-<slug>"
npm run voiceover -- voiceover/<slug>.json
node scripts/episode.mjs export "NEON ODDS/episodes/epNN-<slug>"
PYTHONIOENCODING=utf-8 python -P scripts/words.py <slug>
```

Sau `prep`, đặt `gapAfter` 0,8 cho 2–3 câu quay đầu của truyện để hình có chỗ diễn. Khoá miễn phí chỉ có 10 lượt/ngày mỗi khoá: `batchBy: "take"` giữ số lượt thấp, đừng dùng `--force`. Đổi `tempo` hay `gapAfter` thì chạy lại `voiceover` và `export`, không tốn thêm lượt. Nhắm khoảng 200 từ/phút: `export` báo tốc độ, sai thì chỉnh `tempo` theo tập (Mandel cần 1,15, Ivey 1,02), không tốn lượt.

Soát giọng dù không nghe được: `words.py` cảnh báo chỗ tách câu ("19", "$9.6 million" là báo nhầm do Whisper viết thành số), xem độ dài câu trong `vo-timestamps.md` (câu chốt dưới 1 giây là bị đọc vội, tách `take` riêng kèm `style` chậm, chỉ tốn 1 lượt), và cho Whisper chép lại cả `vo.mp3` để so với kịch bản. Gửi `vo.mp3` cho người dùng nghe sớm, nói rõ từ nào Whisper nghe khác.

**Không in, ghi log hay commit khoá API.**

### 3. Dựng và soát nháp → DỪNG DUYỆT LẦN 2

Đọc `references/dung-video.md` rồi viết các shot trong `Video.tsx`, cắt trên từ của lời (`shots.json`). Kiểm số liệu trên hình với bảng kiểm chứng.

Đăng ký composition: `node .claude/skills/neon-odds/scripts/new-episode.mjs register <NN> <slug>` (chỉ chạy sau bước giọng, vì `Video.tsx` cần file thời gian của giọng).

Soát một lượt rồi đưa người dùng xem. Đừng chạy nhiều lượt chấm bằng subagent: mỗi lượt lại ra một nhóm lỗi khác nên rất tốn thời gian mà không tăng điểm. Tự xem ảnh tách khung, sửa lỗi rõ ràng, tối đa một subagent nếu thật sự cần mắt mới. Không tự chấm điểm.

Gửi người dùng bản nháp nửa độ phân giải và ảnh tách khung. Nói rõ phần chưa ai nghe vì Claude không nghe được âm thanh. **Dừng, chờ duyệt.** Lý do: render bản cuối tốn thời gian, sửa trên nháp rẻ hơn nhiều.

### 4. Render 1080

Lucas chốt 1080×1920 là đủ cho kênh này (2026-11-07), vì 4K quá lâu. Chỉ render 4K khi người dùng yêu cầu.

```bash
npm run render:style -- NO-epNN-<slug> --to "NEON ODDS/episodes/epNN-<slug>/<slug>.mp4" --scale=1 --keep-raw --timeout=240000 --concurrency=3 --gl=angle > out/j/<slug>-final.log 2>&1
python -P scripts/short-qa.py "NEON ODDS/episodes/epNN-<slug>/<slug>.mp4" --shots "NEON ODDS/episodes/epNN-<slug>/shots.timeline.json" --out "NEON ODDS/episodes/epNN-<slug>/QA.md"
```

Trước khi render, sau khi đặt xong SFX, chạy kiểm tra nhanh (khoảng 20 giây, chưa cần âm thanh). Lệnh này liệt kê các tiếng nhấn rơi giữa một chữ đang đọc. Sửa chúng trong code trước:

```bash
npm run listen -- NO-epNN-<slug> --precheck --words src/voiceover/<slug>.words.json --out "NEON ODDS/episodes/epNN-<slug>/NGHE.md"
```

Cổng nghe (bắt buộc từ 2026-11-08) chạy nền sau khi render xong, mất khoảng 4–9 phút. `--words` thêm bảng chữ bị nền che. Nếu đang sửa tiếng thì chạy cổng trên bản chỉ có tiếng (`npx remotion render NO-epNN-<slug> out/<slug>.wav --codec=wav`), không cần render lại hình:

```bash
npm run listen -- NO-epNN-<slug> "NEON ODDS/episodes/epNN-<slug>/<slug>.mp4" --out "NEON ODDS/episodes/epNN-<slug>/NGHE.md" --words src/voiceover/<slug>.words.json
```

Đọc `NGHE.md`: mỗi dòng "Cần nghe" (SFX nổi dưới 3 dB trên nền hoặc lệch hơn 2 frame) phải được sửa, hoặc báo người dùng nghe và quyết giữ. Nếu báo "không hơn ngẫu nhiên" thì ghi vậy, đừng dựa vào bảng.

Chạy ở nền, khoảng 5–10 phút (đo trên hai tập: 4 phút 37 giây và 9 phút 26 giây, tuỳ máy đang bận gì). Phải ghi `--scale=1`, vì `render:style` mặc định là 4K. Ghi log ra file thay vì `tail`, để nếu lỗi thì còn thấy lý do. Máy này có card GTX 1050 Ti 4 GB: gặp lỗi "ran out of memory" hoặc không tạo được WebGL thì giảm `--concurrency`, và không chạy render khác cùng lúc. Nếu cần 4K thì bỏ `--scale=1` và dùng `--concurrency=1` (khoảng 40 phút cho 90 giây). Kiểm: 1080×1920, 30 fps, −14 LUFS ±1, true peak ≤ −1,5 dBTP.

### 5. Gói sản xuất và thumbnail

Điền `xuat-ban.md` theo `references/goi-san-xuat.md` (tiêu đề, mô tả, hashtag, từ khoá). Dựng thumbnail 9:16 trong `Video.tsx` (`Thumb`), rồi:

```bash
npx remotion still NO-epNN-<slug>-Thumb "out/<slug>-thumb.png" --gl=angle --timeout=240000
ffmpeg -y -i "out/<slug>-thumb.png" -q:v 3 "NEON ODDS/episodes/epNN-<slug>/thumb.jpg"
```

Mẫu đã đạt: `Style Library/N-low-poly/n-mandel/Thumb.tsx` (chữ ở trên, mặt và vật chính ở giữa, không đè lên nhau; máy đặt đủ xa, đừng để áo chiếm cả khung). Thumbnail phải dưới 2 MB và đọc được khi thu nhỏ. Xem lại ảnh trước khi gửi.

## Bàn giao

Gửi bằng `SendUserFile`: `<slug>.mp4`, `thumb.jpg`, `xuat-ban.md`. Báo thật những gì chưa kiểm: âm thanh chưa ai nghe, các dòng "Cần nghe" trong `NGHE.md` chưa ai quyết, số còn ghi ƯỚC, lỗi còn thấy. Không commit, không đăng lên YouTube trừ khi người dùng yêu cầu.
