# STUDIO — từ một kênh đối thủ ra một gói kênh của mình

*Lucas chốt yêu cầu 2026-11-01. File này là bản yêu cầu + lộ trình + trạng thái của Studio. Quy trình phân tích chi tiết: `Style Library/QUY-TRINH-PHAN-TICH.md`.*

## 1. Yêu cầu

**Đầu vào** (một trong hai):
- **URL kênh** (hoặc URL một video): Studio tự lấy danh sách video, số liệu, xếp hạng, trung vị; chọn các video thắng nhất + mới nhất, tự tải về.
- **Thư mục video Lucas tự tải** (`[YouTube]_<kênh>_<id>.mp4`, như `Test/History Maps Lore/`): dùng file có sẵn, số liệu lấy theo ID trong tên file.

**Bóc tách** ở hai cấp:
- **Kênh:** định vị, pillar, chủ đề thắng, công thức tiêu đề, nhịp đăng.
- **Video:** kịch bản (công thức, hook, câu bắc cầu, câu kết, nhịp, wpm), hình (màu, font, máy quay, bảng shot, kỹ thuật), âm (giọng, nhạc, SFX, LUFS), nhịp dựng.

**Kết luận dựng lại được không** cho mỗi kỹ thuật (mã T#) trong bảng shot, theo 4 mức:

| Mức | Nghĩa | Ví dụ |
|---|---|---|
| 🟢 Remotion thuần | dựng ngay bằng code | chữ, bản đồ 2D, mũi tên, thẻ, biểu đồ, 3D giả bằng CSS (style J) |
| 🟡 Cần tài sản | dựng được, phải tạo / tải ảnh, âm | tranh AI, tranh public domain, ảnh vệ tinh, SFX Pixabay |
| 🟠 Cần cài công cụ | họ dùng phần mềm khác; ghi **tên công cụ, giá / giấy phép, cách nối vào Remotion**; **Lucas duyệt rồi mới cài** | 3D thật có ánh sáng → Blender; bay địa hình 3D → Google Earth Studio / Cesium; plugin After Effects → Lottie hoặc shader |
| 🔴 Không nên dựng lại | quay thật, video AI cả cảnh, footage bản quyền | đề xuất cách thay hoặc công cụ để Lucas quyết |

Mỗi kết luận ghi **dấu hiệu nhận ra** (bóng đổ / ánh sáng thật → 3D engine; hình chảy, tay biến dạng → video AI) và nhãn ĐO / ƯỚC / QUYẾT.

**Đầu ra:** một **gói kênh đứng riêng**, như Atlas Tí Hon (`D:\Claude\Project\Atlas Ti Hon\`), chat mới mở ra là làm tập tiếp được:
1. Tài liệu hệ thống: Channel Bible, prompt chủ đề, prompt nguồn + kịch bản, quy trình sản xuất, kho chủ đề theo pillar, nhận diện kênh, bàn giao (có prompt dán vào chat mới).
2. Kit style (code Remotion) + script cần dùng + mẫu tập.
3. Một video demo đã qua review-loop + một tập hoàn chỉnh.
4. Bảng so với bản gốc: mình hơn ở đâu, còn thua ở đâu.

**Luật giữ nguyên:** học cách làm, không chép kịch bản / tài sản của họ (trích nguyên văn chỉ hook, bắc cầu, câu kết, ~15 từ mỗi câu); video, khung hình, transcript của bên thứ ba không vào git; Lucas duyệt từng cổng; không lộ key; luật short-form của `AGENTS.md`.

## 2. Lộ trình

| Bước | Việc | Lucas duyệt | Trạng thái |
|---|---|---|---|
| **P0** | Bản yêu cầu này | yêu cầu | ✅ 2026-11-01 |
| **P1 · Thu thập** | `npm run studio:ingest -- <url-kênh \| url-video \| thư-mục>` (mục 3) | chạy thử một kênh | ✅ 2026-11-01 |
| **P2 · Bóc tách** | mẫu báo cáo (`studio/templates/`) + `style-card.json` / `formula.json` (`npm run studio:cards`) + bảng khả thi 4 mức (`KHA-THI.md`) + đo màu và chuyển động máy quay trong ingest. OCR chữ trên màn hình, tách giọng / nhạc: chờ Lucas duyệt công cụ (`KHA-THI.md` §3) | báo cáo + công cụ cần cài | ✅ 2026-11-01 (thử trên History Maps Lore) |
| **P3 · Dựng lại** | hợp đồng kit ([`KIT-CONTRACT.md`](KIT-CONTRACT.md)) + `npm run studio:kit -- new \| check` (kit + KitSheet + README nháp từ card); `render:style` / `sheet` dùng chung mọi style. Bản test 30 s và video đầy đủ làm theo từng nguồn (hợp đồng §5) | bản test, bản đầy đủ | ✅ công cụ 2026-11-01 (F–L qua `check`; thử `new` từ card History Maps Lore) |
| **P4 · Đóng gói** | mẫu gói kênh (`studio/templates/channel/`, theo Mapped Journeys + Atlas Tí Hon) + `npm run studio:channel -- new \| export` | gói hoàn chỉnh | ✅ 2026-11-01 (thử `new` từ History Maps Lore; `export` Mapped Journeys chạy độc lập: lint, render) |
| **P5 · Tốt hơn** | `npm run studio:compare` (bản mình vs đối thủ, cùng bộ đo → `SO-SANH.md`) + `npm run studio:stats` (sổ `so-lieu.csv`, nhập CSV YouTube Studio, trung vị theo pillar / biến thể, so với đối thủ → `SO-LIEU.md`). API YouTube Analytics: chưa (cần OAuth, Lucas duyệt) | bảng so | ✅ 2026-11-01 (compare Ep02 Hannibal vs Guilherme; stats thử bằng CSV giả trong thư mục tạm) |

## 3. Lệnh

```bash
npm run studio:ingest -- "https://www.youtube.com/@HistoryMapsLore"
npm run studio:ingest -- "https://www.youtube.com/shorts/B-TKxnbkezE"
npm run studio:ingest -- "Test/History Maps Lore"
```

- **URL kênh:** xếp hạng Shorts (hoặc `--tab videos`), tải `--top 3` video nhiều view nhất + `--latest 2` video mới nhất vào `Test/<tên kênh>/` (`--out` để đổi).
- **URL video:** tải video đó vào `Test/<tên kênh>/`, rồi đo cả thư mục.
- **Thư mục:** đo mọi `.mp4` ở cấp đầu thư mục.

Mỗi video: số liệu (yt-dlp), vị trí trong kênh (hạng, × trung vị, thứ tự đăng), ffprobe, LUFS / true peak / LRA, điểm cắt cảnh → bảng shot rỗng, đoạn đứng yên, transcript có thời gian từng từ (faster-whisper) → wpm, lời bắt đầu ở ms nào, tỉ lệ có lời; contact sheet 0–1 s, 3 s cuối, mỗi giây.

Kết quả:
- `<thư mục>/INGEST.md`: chỉ số liệu (mọi giá trị là **ĐO**), tự sinh lại mỗi lần chạy; đừng sửa tay, phân tích viết vào `BAO-CAO.md`.
- `<thư mục>/_work/` (git-ignored): `channel.json`, `<id>.meta / probe / measure / transcript.json`, `ingest.json` (gộp, cho P2), `sheets/`.

Bước nào đã có file trong `_work/` thì bỏ qua (`--force` để làm lại, ví dụ lấy số view mới). Tùy chọn khác: `--lang en` (mặc định tự nhận ngôn ngữ), `--no-whisper`, `--no-sheets`, `--selftest`.

Ingest còn đo **màu chủ đạo** (k-means 6 màu, 1 khung / giây) và **mức chuyển động từng shot** (đứng yên / chậm / nhanh, từ điểm scene), liệt kê **điểm cắt mềm** (crossfade) để tách shot trên sheet.

### Card + khả thi (P2)

```bash
npm run studio:cards -- init "Test/History Maps Lore"
npm run studio:cards -- check "Test/History Maps Lore"
```

- `init`: viết `style-card.json` + `formula.json` (phần đo được đã điền, còn lại `TODO`) và chép mẫu `BAO-CAO.md`, `BOC-TACH-HINH.md`, `BOC-TACH-KICH-BAN.md` còn thiếu. File đã có thì giữ nguyên.
- Luis điền card trong lúc phân tích: mỗi kỹ thuật T# một mục với mức 🟢🟡🟠🔴 theo [`KHA-THI.md`](KHA-THI.md); mỗi công cụ 🟠 một mục `tools[]` (`status: "proposed"` tới khi Lucas duyệt).
- `check`: kiểm card (thiếu trường, còn `TODO`, 🟠 không có công cụ, 🔴 vẫn "dùng", câu trích nguyên văn quá 15 từ) và sinh `<thư mục>/KHA-THI.md`: bảng khả thi + công cụ chờ duyệt. Card là đầu vào của P3 (dựng lại) và P4 (gói kênh).
- Mẫu đầy đủ: `Test/History Maps Lore/style-card.json`, `formula.json`, `KHA-THI.md`.

### Kit (P3)

```bash
npm run studio:kit -- new M-ten-style --from "Test/<nguồn>" --title "Tên Style"
npm run studio:kit -- check "Style Library/M-ten-style"
npm run sheet -- Style-M-TenStyle-Kit --frames 0
npm run render:style -- <CompositionId> --to <file.mp4>
```

- `new` (không ghi đè): `Style Library/<X>-<tên>/` gồm `<tên>.tsx` (bảng màu vai trò bg / ink / accent lấy từ card, `Base`, `Chip`, `<Tên>Sub`), `<x>-kit/Video.tsx` (KitSheet) và README nháp có bảng kỹ thuật → component. In ra 2 dòng để dán vào `src/Root.tsx`.
- `check`: file bắt buộc, bảng màu, skin phụ đề, `kit-common`, font riêng, mẫu bị cấm (`Math.random`, CSS animation, chuỗi `transform`, `<img>` thô…). Kit F–L hiện có đều qua.
- `render:style` / `sheet` là `render-j` / `sheet-j` (tên cũ vẫn chạy).
- Vòng dựng đủ một style mới: `KIT-CONTRACT.md` §5.

### Gói kênh (P4)

```bash
npm run studio:channel -- new "Siege Atlas Shorts" --style L-siege-atlas --from "Test/History Maps Lore" --handle @SiegeAtlas
npm run studio:channel -- export "Mapped Journeys" --to "B:/Claude/Project/mapped-journeys" --install
```

- `new` (không ghi đè): `<Tên kênh>/` ở gốc repo gồm `00_he-thong/` (01 Bible, 02 nhận diện, 03 kho chủ đề, 04 bàn giao có prompt dán vào chat mới) + `episodes/_template/` (README 5 cổng, FINAL, spec, header giọng, `progress.md`, `checks.md`, `xuat-ban.md`). Phần đo được và rút từ card đã điền (pillar, nhịp %, hook / bắc cầu / kết, mẹo giữ chân, lỗi của đối thủ, màu); `[...]` là phần Luis viết, Lucas duyệt.
- `export` (thư mục đích phải trống): dự án Remotion đứng riêng chỉ chứa kênh đó: thư mục kênh, kit style mà code của nó dùng tới, mọi file được import (kit-common, subs, helper pvr, manifest giọng), tài sản `public/` mà code gọi tên, script giọng + cache TTS, `public/sfx`, scripts (trừ công cụ Studio), skills, config, `Root.tsx` chỉ gồm composition của kênh, README có prompt bắt đầu, `AGENTS.md` / `CLAUDE.md` kèm ghi chú. Bỏ `*.mp4`, `vo.mp3`, `_work/`. Chép `gemini_key.txt` (git-ignored ở đó; `--no-key` để bỏ). `git init` + commit đầu (không remote, `--no-git` để bỏ); `--install` chạy `npm ci`.
- Đã thử: Mapped Journeys → 1.161 file, 158 MB, chỉ style J; trong dự án mới `npm run lint` sạch, 6 video + 9 bìa đăng ký, render khung Hannibal đủ ảnh; key không vào commit.

### Tốt hơn (P5)

```bash
npm run studio:compare -- "Mapped Journeys/episodes/ep02-hannibal/hannibal.mp4" --ref "Test/doi-thu"
npm run studio:stats -- init "Mapped Journeys"
npm run studio:stats -- import "<Table data.csv>" "Mapped Journeys" --moc 7d
npm run studio:stats -- report "Mapped Journeys" --moc 30d --ref "Test/doi-thu"
```

- `compare`: đo bản render của mình bằng đúng bộ đo của ingest (`out/compare/<tên>/`, không sheet), viết `SO-SANH.md` cạnh mp4: mỗi số đo của mình, trung vị + khoảng của đối thủ, mình ở đâu. Chỉ âm lượng là luật (đạt / trượt); khác biệt khác để đọc, giữ nếu là lựa chọn (QUYẾT), sửa nếu không có lý do. Cần `studio:ingest` của nguồn trước.
- `stats` (theo sổ của Atlas Tí Hon): `init` tạo một dòng mỗi tập (pillar từ Bible §11, độ dài từ timing); `import` đọc CSV xuất từ YouTube Studio (Analytics → Advanced mode → Content → Export; tên cột tiếng Anh hoặc tiếng Việt), ghép theo `youtube_id` rồi theo tiêu đề, dòng không khớp thì liệt kê, không đoán; `report` → `SO-LIEU.md`: tập theo "% đã xem (so với vuốt đi)", trung vị theo pillar và theo `bien_the` (nhãn A/B mình đặt), so với đối thủ (views / video, like / view). Dưới 6 tập có số thì chỉ là gợi ý.
- Mẫu kênh (P4) đã có bước này: Bible §9 Cổng 5 + §10, dòng mới trong `checks.md`.

Giới hạn: thư mục chỉ nhận ID YouTube trong tên file (TikTok chưa thử); số view ở danh sách kênh của yt-dlp đã làm tròn (đủ để xếp hạng, số chính xác lấy từ trang video); ngày đăng cả kênh (nhịp đăng) chưa lấy.
