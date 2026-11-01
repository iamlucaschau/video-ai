# 04 — BÀN GIAO · {{NAME}}

*{{TODAY}}. Đọc file này trước tiên. Người duyệt mọi quyết định: **Lucas** (gọi trợ lý là "Luis", trao đổi bằng tiếng Việt, video bằng {{LANG}}).*

## 0. Dán vào chat mới

```text
Luis ơi, mình tiếp tục kênh {{NAME}} (style {{STYLE_TITLE}}).
Đọc theo thứ tự: {{CHANNEL_DIR}}/00_he-thong/04_BAN-GIAO.md → 01_CHANNEL-BIBLE.md
→ Style Library/{{STYLE}}/README.md, rồi load skill remotion-best-practices.
Đừng push lên GitHub khi mình chưa bảo.
Việc đầu tiên: [mục 3].
```

## 1. Đọc theo thứ tự

| # | File | Để biết |
|---|---|---|
| 1 | `AGENTS.md` (gốc repo) | Luật Remotion + luật short-form 9:16 |
| 2 | `{{CHANNEL_DIR}}/00_he-thong/01_CHANNEL-BIBLE.md` | **Luật kênh** (nguồn duy nhất) |
| 3 | `Style Library/{{STYLE}}/README.md` | Luật hình của style, bảng component của kit |
| 4 | `{{CHANNEL_DIR}}/episodes/_template/README.md` | Từng bước làm một tập |
| 5 | `{{CHANNEL_DIR}}/00_he-thong/03_KHO-CHU-DE.md` | Chủ đề cho Cổng 1 |

## 2. Trạng thái

| Mục | Trạng thái |
|---|---|
| Kit style | `Style Library/{{STYLE}}/` |
| Tập đã làm | [...] |
| Nhận diện | [...] |
| Git | [...] |

## 3. Việc tiếp theo

- [...]

## 4. Lệnh hay dùng

```bash
npm run dev
npm run lint
node scripts/episode.mjs prep "{{CHANNEL_DIR}}/episodes/epNN-<slug>"
npm run voiceover -- voiceover/<slug>.json
npm run sheet -- <CompositionId> --slug <slug>
npm run render:style -- <CompositionId> --to "{{CHANNEL_DIR}}/episodes/epNN-<slug>/<slug>.mp4"
```

## 5. Luật cứng

1. **Không push lên GitHub** khi Lucas chưa bảo. Commit chỉ khi Lucas yêu cầu.
2. Key trong `gemini_key.txt` (git-ignored): không in, không log, không commit.
3. Không bịa số liệu, ngày, trích dẫn; có nguồn mới dùng (Bible §8).
4. Không chép / dịch trọn kịch bản đối thủ; video, khung hình của bên thứ ba luôn git-ignored.
5. Ngoại lệ camera / chữ chỉ của style này, ghi trong README style.
6. Chất lượng xuất: crf 18, 4K, −14 LUFS / −1,5 dBTP.
