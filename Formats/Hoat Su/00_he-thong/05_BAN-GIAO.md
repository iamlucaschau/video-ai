# 04 — BÀN GIAO · gói format Hoat Su

*2026-11-04. Đọc file này trước tiên. Người duyệt mọi quyết định: **Lucas** (gọi trợ lý là "Luis", trao đổi bằng tiếng Việt).*

## 0. Dán vào chat mới

```text
Luis ơi, mình bắt đầu một kênh mới bằng gói format Hoat Su (style Hoạt Sử).
Đọc theo thứ tự: Formats/Hoat Su/00_he-thong/05_BAN-GIAO.md → 01_FORMAT-BIBLE.md
→ 02_CONG-THUC.md → 03_PHONG-CACH-DUNG.md → Style Library/M-hoat-su/README.md → mau/, rồi load skill
remotion-best-practices. Hỏi mình các câu ở mục 1 trước khi làm gì khác.
Đừng push lên GitHub khi mình chưa bảo.
```

## 1. Câu hỏi AI phải hỏi Lucas trước tập đầu

Gói này **cố ý chưa chốt** phần kênh. Hỏi lần lượt, ghi câu trả lời vào `01_FORMAT-BIBLE.md` §12 (nhật ký quyết định), rồi mới làm Cổng 1:

1. **Tên kênh + handle** (kiểm handle còn trống trên YouTube, TikTok, Instagram; Lucas tự thử tạo).
2. **Thị trường + ngôn ngữ** của lời đọc, phụ đề, nhãn (vd. tiếng Anh toàn cầu, tiếng Việt).
3. **Giọng đọc:** giọng Gemini, tempo (nghe thử bằng `npm run tts -- say …`).
4. **Pillar + tỉ lệ**, rút từ góc kể ở `01_FORMAT-BIBLE.md` §2 và kho `04_KHO-CHU-DE.md`.
5. **Màu nhấn** của kênh (Style Library §2.3: style chỉ quy định vai trò màu).
6. **Nhận diện:** avatar, banner, mô tả kênh, hashtag cố định (Luis viết prompt, Lucas tạo ảnh).
7. **Nền tảng + lịch đăng.**
8. **Mục tiêu đo** ở `02_CONG-THUC.md` §4 và `03_PHONG-CACH-DUNG.md` §5: giữ đề xuất hay đổi.
9. **Chữ ký của format** (`02_CONG-THUC.md` luật 8, đề xuất: biển gỗ "NƠI NĂM" + tiếng gõ gỗ): giữ hay đổi.
10. **Video dài 16:9** (D2: làm gói thứ hai sau ≥ 10 Short; công thức nháp `Test/Squire Explains/formula-long.json`): khi nào bắt đầu.

Khi đủ câu trả lời: tạo thư mục kênh (copy gói này, đổi tên), thay mọi **[hỏi Lucas]**, `npm run studio:stats -- init "<thư mục kênh>"`, rồi làm tập 1 theo `episodes/_template/`.

## 2. Đọc theo thứ tự

| # | File | Để biết |
|---|---|---|
| 1 | `AGENTS.md` (gốc repo) | Luật Remotion + luật short-form 9:16 |
| 2 | `Formats/Hoat Su/00_he-thong/01_FORMAT-BIBLE.md` | Luật sản xuất của format (nguồn duy nhất) |
| 3 | `Formats/Hoat Su/00_he-thong/02_CONG-THUC.md` | **Công thức chủ đề + tiêu đề + kịch bản + mục tiêu đo** |
| 4 | `Formats/Hoat Su/00_he-thong/03_PHONG-CACH-DUNG.md` | **Phong cách dựng**: khung 0–1 s, 3 s cuối, hình theo từng nhịp, kỹ thuật → component, các bước dựng, số đo hình |
| 4b | `Style Library/M-hoat-su/README.md` | Code của kit, luật hình chi tiết |
| 5 | `Formats/Hoat Su/mau/` | Kịch bản mẫu + video demo dựng lúc phân tích, và bản so với kênh tham khảo |
| 6 | `Formats/Hoat Su/episodes/_template/README.md` | Từng bước làm một tập |
| 7 | `Test/Squire Explains/BAO-CAO.md` | Phân tích kênh tham khảo, chỉ khi cần |

## 3. Lệnh hay dùng

```bash
npm run dev
npm run lint
node scripts/episode.mjs prep "<thư mục kênh>/episodes/epNN-<slug>"
npm run voiceover -- voiceover/<slug>.json
node scripts/shotlist.mjs "<thư mục kênh>/episodes/epNN-<slug>" --board <CompositionId>
npm run render:style -- <CompositionId> --to "<thư mục kênh>/episodes/epNN-<slug>/<slug>.mp4"
npm run studio:compare -- "<mp4>" --ref "Test/Squire Explains" --force
npm run listen -- <CompositionId> "<mp4>" --out "<thư mục kênh>/episodes/epNN-<slug>/NGHE.md"   # cổng nghe, bắt buộc (4–9 phút, chạy nền)
```

## 3b. Bẫy của style này (đọc trước khi dựng)

- Nền vẽ code, không ảnh AI (Lucas 2026-11-04: **nền code, không dùng ảnh AI**). Đừng thả ảnh vào `public/images/<slug>/` của tập mới: `Outside` sẽ tự dùng ảnh nếu thấy file.
- `studio:compare` đo lại file cũ nếu tên mp4 không đổi: luôn thêm `--force` sau khi render lại.
- Hạ nhạc giữa bài có thể làm master đẩy đỉnh lên quá −1,5 dBTP: kiểm true peak sau mỗi lần sửa âm.
- Hai phiên chạy `fetch-sfx` cùng lúc làm mất dòng trong `public/sfx/catalog.json`: kiểm lại danh mục sau khi tải.
- "Hình đứng yên" của compare (họ 7 %) không hạ được bằng thở / chớp mắt; cần hành động nhân vật theo lời (`03_PHONG-CACH-DUNG.md` §4 bước 6).
- Thêm: `Style Library/M-hoat-su/README.md` § "Bẫy đã gặp".

## 4. Luật cứng

1. **Không push lên GitHub** khi Lucas chưa bảo. Commit chỉ khi Lucas yêu cầu.
2. Key trong `gemini_key.txt` (git-ignored): không in, không log, không commit.
3. Không bịa số liệu, ngày, trích dẫn; có nguồn mới dùng (Bible §8).
4. Không chép / dịch trọn kịch bản đối thủ; video, khung hình của bên thứ ba luôn git-ignored.
5. Ngoại lệ camera / chữ chỉ của style này, ghi trong README style.
6. Chất lượng xuất: crf 18, 4K, −14 LUFS / −1,5 dBTP.
