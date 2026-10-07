# Poor vs Rich Daily — Sổ tay vận hành

*Bản đồ file + quy trình sản xuất thực thi trong repo VIDEO AI. Luật gốc nằm ở các file spec; file này chỉ chỉ ra **làm gì, chạy lệnh nào, ra file gì, dừng ở cổng nào**. Khi mâu thuẫn: `03_series-lock/00_SERIES-BIBLE.md` thắng.*

## 1. Thư mục (đọc theo thứ tự số)

```
Poor vs Rich Daily/
├── README.md                         ← file này
├── 01_he-thong/                      luật vận hành
│   ├── 00_CLAUDE-FULL-HANDOFF.md      vai trò Claude, pipeline, 5 luật cứng
│   ├── quy-trinh-san-xuat.md          8 giai đoạn, 4 cổng, 9 bất biến, NHẬT KÝ TẬP
│   └── huong-dan-ban-giao-claude.md   message duyệt mẫu, mẫu feedback, checklist nhận final
├── 02_master-prompts/                giai đoạn 0–1 (chủ đề → kịch bản)
│   ├── master-prompt-tao-chu-de.md         GĐ0: 5 chủ đề xếp hạng
│   ├── master-prompt-viet-kich-ban.md      GĐ1a: kịch bản v1
│   └── master-prompt-nang-cap-kich-ban-toi-uu.md  GĐ1b: v1 → v2 lock
├── 03_series-lock/                   khóa cứng toàn series
│   ├── 00_SERIES-BIBLE.md             style, màu, nhân vật, cấu trúc, âm thanh
│   ├── 03_STYLE-LIBRARY.md            4 phong cách A/B/C/D + cách chọn theo kịch bản
│   └── 02_REMOTION-TECH-SPEC.md       kiến trúc component, QA kỹ thuật
└── episodes/
    └── epNN-<slug>/                  mỗi tập một thư mục
        ├── kich-ban-<slug>-FINAL.md   (GĐ1) kịch bản lock EN+VN
        ├── 01_EPISODE-SPEC_<slug>.md  (GĐ2) 8 scene
        ├── vo.mp3 + vo-timestamps.md  (GĐ3) VO + timestamp từng câu
        ├── storyboard.md              (GĐ4)
        ├── test/                      (GĐ5) frames scene 3
        └── <slug>.mp4 + caption.txt + qa-report.md   (GĐ6)
```

Tên file giữ nguyên như bản gốc để các tham chiếu chéo trong spec vẫn đúng.

## 2. Quy trình từng giai đoạn

| GĐ | Việc | Lệnh / công cụ | Đầu ra | Cổng |
|----|------|----------------|--------|------|
| 0 | Chủ đề | Chạy `master-prompt-tao-chu-de.md` | 5 topic xếp hạng | Lucas chọn 1 |
| 1 | Kịch bản v1 → v2 | `master-prompt-viet-kich-ban.md` → `…nang-cap…toi-uu.md` | `kich-ban-<slug>-FINAL.md` | **Cổng 1 · Kịch bản** — Lucas duyệt → lock |
| 2 | Episode spec | Theo mẫu `ep01/01_EPISODE-SPEC_*.md` | `01_EPISODE-SPEC_<slug>.md` | (Lucas xem) |
| 3 | Voiceover | `node scripts/episode.mjs prep "<thư mục tập>"` → `npm run voiceover -- voiceover/<slug>.json` → `node scripts/episode.mjs export "<thư mục tập>"` | `vo.mp3`, `vo-timestamps.md` | **Cổng 2 · VO** |
| 4 | Storyboard | Timecode lấy từ `vo-timestamps.md` | `storyboard.md` | **Cổng 3 · Storyboard** — chưa duyệt = chưa code |
| 5 | Test 1 scene | Remotion, render scene 3 (bảng phép tính) | `test/` frames | **Cổng 4 · Test** — chưa duyệt = chưa render full |
| 6 | Final | Render h264/yuv420p/AAC 128k + QA | MP4, `caption.txt`, `qa-report.md` | **Cổng 5 · Final** |
| 7 | Đăng | Lucas | — | — |

### Chi tiết GĐ3 (đã tự động hóa)
- `prep` **kiểm tra lời VO trong spec khớp từng chữ với kịch bản FINAL** (sai là dừng, sửa spec chứ không sửa FINAL), tách câu, gán scene, gom thành ~1 request/≤8 câu.
- Gemini TTS free tier: **10 request/ngày/model/key** (4 key = 40 request/ngày). Một tập ≈ 12 request → mỗi ngày tạo được VO ~3 tập bằng model chính. Đừng `--force` khi không đổi lời.
- Tốc độ chỉnh không tốn request: sửa `tempo` trong `voiceover/<slug>.json` hoặc khoảng nghỉ `GAP` trong `scripts/episode.mjs`, chạy lại `npm run voiceover` + `export`.
- `export` xuất `vo.mp3` đã chuẩn hóa −14 LUFS và `src/voiceover/<slug>.timing.json` cho Remotion.

## 3. Trạng thái

Xem nhật ký tập trong `01_he-thong/quy-trinh-san-xuat.md` §4.
