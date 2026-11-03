# 04 — BÀN GIAO · Mapped Journeys

*2026-10-27. Luis (chat cũ) → chat mới. Đọc file này trước tiên, rồi đọc tiếp theo thứ tự ở mục 1. Người duyệt mọi quyết định: **Lucas** (gọi trợ lý là "Luis", trao đổi bằng tiếng Việt, video bằng tiếng Anh).*

## 0. Dán vào chat mới

```text
Luis ơi, mình tiếp tục kênh Mapped Journeys (style J "Satellite Journey").
Đọc theo thứ tự: Mapped Journeys/00_he-thong/04_BAN-GIAO.md → 01_CHANNEL-BIBLE.md
→ 03_DANH-GIA-NANG-CAP.md → Style Library/J-satellite-journey/README.md, rồi load
skill remotion-best-practices. Đừng push lên GitHub khi mình chưa bảo.
Việc đầu tiên: [chọn Ep02 theo mục 5 của file bàn giao].
```

## 1. Đọc theo thứ tự

| # | File | Để biết |
|---|---|---|
| 1 | `AGENTS.md` (gốc repo) | Luật Remotion + luật short-form 9:16 (vùng an toàn, không camera giả, ít chữ, SFX thật) |
| 2 | `Mapped Journeys/00_he-thong/01_CHANNEL-BIBLE.md` | **Luật kênh** (nguồn duy nhất): định vị, 5 pillar, công thức kịch bản 8 nhịp, chuẩn hình / tiếng, nguồn & an toàn, 5 cổng, nhật ký |
| 3 | `Mapped Journeys/00_he-thong/03_DANH-GIA-NANG-CAP.md` | Điểm mạnh / yếu đã biết + danh sách nâng cấp B, C, D |
| 4 | `Style Library/J-satellite-journey/README.md` | Luật hình của style J, ngoại lệ camera (**chỉ J**), bảng component của kit |
| 5 | `Mapped Journeys/episodes/_template/README.md` | Từng bước làm một tập mới |
| 6 | `Style Library/J-satellite-journey/j-aeneas-full/` | Ep01 đầy đủ: FINAL, spec, `Video.tsx`, `xuat-ban.md` |
| 7 | `Test/doi-thu/BAO-CAO.md`, `BOC-TACH-KICH-BAN.md` | Phân tích đối thủ (Guilherme Video Editor: Odysseus, Moses), chỉ khi cần |

## 2. Trạng thái (2026-10-27)

| Mục | Trạng thái |
|---|---|
| Tên kênh | **Mapped Journeys**, @MappedJourneys, slogan *Legendary journeys, mapped.* ("Route Chronicles" bị YouTube từ chối, đã bỏ) |
| Style J kit v1 | Xong: `Style Library/J-satellite-journey/satellite-journey.tsx` |
| Ep01 Aeneas (P1) | **Final xong**: 133,4 s, crf 18, −14 LUFS, SFX + 2 ảnh AI. Gói đăng `xuat-ban.md` xong, **chưa có ảnh bìa**, **chưa đăng** |
| Lệnh render | `npm run render:j -- <id> [--to <mp4>]` (`scripts/render-j.mjs`); **mặc định 4K** 2160×3840 (Lucas 2026-10-31), ~3 giờ và ~450 MB / tập (Ep04: 174 phút); `--scale=1` cho bản 1080p xem nhanh |
| Mẫu tập | `Mapped Journeys/episodes/_template/` |
| Nhận diện | Prompt avatar / banner xong (`02_NHAN-DIEN-KENH.md`); **Lucas chưa tạo ảnh** |
| Git | Nhánh `route-chronicles-style-j` (tên cũ, giữ nguyên), các commit chỉ ở máy. **Chưa push, chưa gộp vào `master`.** Git chưa có identity: commit bằng `git -c user.name="Lucas" -c user.email=<email của Lucas> commit …` |

## 3. Bản đồ file của kênh

| Đường dẫn | Nội dung |
|---|---|
| `Mapped Journeys/00_he-thong/` | 01 Bible · 02 nhận diện · 03 đánh giá + nâng cấp · 04 bàn giao (file này) · `brand/` (ảnh avatar / banner, khi có) |
| `Mapped Journeys/episodes/` | `_template/` + các tập `epNN-<slug>/` |
| `Style Library/J-satellite-journey/satellite-journey.tsx` | Kit: `project`, `camAt`, `SatMap`, `GlowRoute`, `Vessel`, `StopLabel`, `PhotoCard`, `Cross`, `GeoLine`, `FullFrame`, `SourceLine`, `BigWord`, `SubWord`, `JourneySub` |
| `Style Library/J-satellite-journey/j-aeneas/` | Bản test 28 s (4 điểm dừng) |
| `Style Library/J-satellite-journey/j-aeneas-full/` | Ep01 |
| `public/images/j-aeneas-full/` | Tranh + ảnh AI + `map/` (tấm bản đồ + `plates.json`) |
| `voiceover/j-aeneas-full.json` → `src/voiceover/j-aeneas-full*.json` | Script TTS → manifest, timing, words |
| `src/series/pvr/sfx.tsx` | `Sfx` (có prop `seconds` để cắt + fade), `MusicBed`, `PILLAR_MUSIC` |
| `public/sfx/` | SFX thật (git-ignored; `catalog.json` có trong git) |
| `scripts/make-plates.py` | Blue Marble → tấm Mercator. **Ảnh nguồn không còn trên máy**: tải lại theo link ở đầu script |
| `scripts/episode.mjs`, `scripts/tts.mjs`, `scripts/words.py`, `scripts/render-j.mjs` | Pipeline giọng + render |

## 4. Lệnh hay dùng

```bash
node scripts/episode.mjs prep "Mapped Journeys/episodes/epNN-<slug>"
npm run voiceover -- voiceover/<slug>.json
node scripts/episode.mjs export "Mapped Journeys/episodes/epNN-<slug>"
PYTHONIOENCODING=utf-8 python -P scripts/words.py <slug> en
npx remotion bundle --out-dir out/bundle
npx remotion still out/bundle <id> out/check.png --frame=<n> --props='{"safeGuide":true}'
npm run lint
npm run sheet:j -- <id> --slug <slug>     # contact sheet có safeGuide, mỗi câu VO một ô (skill review-loop)
npm run render:j -- <id> --to "Mapped Journeys/episodes/epNN-<slug>/<slug>.mp4"
npm run sheet:j -- --video "<mp4>" --slug <slug>   # soi lại bản đã render
```

## 5. Việc tiếp theo

**Quyết định đầu tiên (Lucas):** tập 2 là gì?
- **Hannibal (P3)** *(Luis đề xuất)*: nối thẳng từ lời nguyền Dido ở Ep01 (Bible §2 "tập nối tập"). Vẫn ở vùng Địa Trung Hải (Carthage → Tây Ban Nha → dãy Alps → Italy). Kit chỉ cần thêm **biểu tượng đoàn quân** (C1). Cần tấm bản đồ phía tây kinh tuyến 0° (tile B1).
- **Magellan (P2)**: đúng thứ tự trong Bible §2, nhưng phải làm trước **B1** (tuyến qua kinh tuyến 180°, bản đồ toàn cầu, tải thêm tile). Việc nặng hơn.

**Trước khi viết Ep03:** đọc `03_DANH-GIA-NANG-CAP.md` mục **E. Bài học từ Ep02** (hook có chữ từ frame 0, không chữ khoá trùng phụ đề, không quá ~8 s đứng yên, mật độ điểm dừng, nguyên nhân gốc ở 40–60 %).

**Nâng cấp** (chi tiết trong `03_DANH-GIA-NANG-CAP.md`):

| Ưu tiên | Việc |
|---|---|
| Làm cùng Ep02 | B2 kiểm tuyến cắt đất liền · B3 sinh key camera tự động · B4 stills QA tự động + contact sheet · B6 cover Shorts từ composition (rồi làm luôn cover Ep01) |
| Theo tập | B1 kinh tuyến 180° (Magellan) · C1 đoàn quân / lạc đà / người đi bộ · C2 vùng cực (Franklin) |
| Khi có số liệu | B5 thử A/B nhịp (bản Quick ~75 s) · C6 bảng số liệu · C4 "chữ ký" kênh |
| Sau | C3 ảnh vệ tinh nét hơn · C5 đa ngôn ngữ · C7 backlog 20–30 chủ đề |

**Lucas tự làm:** giữ handle @MappedJourneys trên YouTube / TikTok / Instagram; tạo avatar + banner; thay key TTS #6; tải tay ~25 SFX còn thiếu (riser, hit) nếu cần; đặt git identity; đăng Ep01.

## 6. Cạm bẫy đã gặp (đừng lặp lại)

**Môi trường**
- Đường dẫn có dấu cách (`VIDEO AI`, `Mapped Journeys`, `Style Library`): luôn đặt trong ngoặc kép.
- Python: dùng `python -P` (không dùng `-I`, vì `-I` bỏ qua thư viện cài ở user site, làm whisper hỏng). Thêm `PYTHONIOENCODING=utf-8` khi script in ký tự đặc biệt.
- Pixabay chặn tải tự động (Cloudflare 403). SFX hiện có được copy từ dự án `Atlas Ti Hon`. Không vượt CAPTCHA.

**Giọng đọc (Gemini TTS)**
- Free tier: 10 request / ngày / key / model. Gom câu theo take, không `--force` khi chữ không đổi.
- **Phải tạo `voiceover/<slug>.json`** (từ `_template/voiceover-header.json`) **trước khi `prep`**; nếu không, `prep` dùng giọng Orus của series Poor vs Rich.
- Một take có thể **nuốt mất một câu** (Ep01 câu 11 "Their curse…"). Cách sửa: cho câu đó take riêng, **xoá file cache cũ** trong `voiceover/.cache/<slug>/<hash>/<id>.wav`, rồi chạy lại. Luôn nghe lại và kiểm `words.py`.
- Key #6 trả "400 Bad Request" không kèm thông báo lỗi; `tts.mjs` đã tự đổi sang key khác một lần. Key không bao giờ được in, log hay commit.

**Hình (style J)**
- **Tuyến biển có thể cắt qua đất liền** (Ep01: bán đảo Gallipoli). Thêm waypoint và kiểm bằng still.
- Thẻ tranh che nhãn / ghim: khi ghim ở cao (y < 760) thì treo thẻ dưới ghim (`cardY`), hoặc cho thẻ ra sớm. Dây nối phải nằm trong khung.
- Mỗi SVG filter phải có **id riêng** (`jglow`, `jglow-line`); trùng id thì đường biến mất.
- `Ring` cần prop `out`, nếu không vòng sóng ở lại mãi.
- Tranh cổ điển có khoả thân (Ep01: Polyphemus): cắt lại trước khi dùng.
- `key` của `StopLabel` / `PhotoCard` phải khác nhau kể cả khi cùng một nơi xuất hiện hai lần (Ep04: hai nhãn CHANG'AN cùng key, video render ra vệt nhãn chồng nhau; still thì vẫn sạch). Các tập dùng `${key}-${name}-${from}`.
- Render báo 404 một file trong `public/` dù file vẫn còn (Ep04 2026-10-31): bản sao tạm trên ổ C bị thiếu; chạy lại với `TMP` / `TEMP` trỏ sang `out/tmp` trên ổ B.
- Remotion 4.0.532: `--frames=20,96,212` (danh sách cách nhau bằng dấu phẩy) có thể crash khi frame trùng `<Audio>`. Dùng `still` từng frame hoặc dải liên tục. Bundle một lần (`out/bundle`) rồi chụp nhiều still.

**Âm thanh**
- Mix thô từng chạm gần 0 dBFS: giữ `TRIM_DB = -3`; tiếng thud để thấp (−22 / −23). VO mono đo ra +3 dB khi thành stereo.
- Mã hoá AAC đẩy true peak lên tới ~0,6 dB sau loudnorm (Ep02 lần đầu: −1,2 dBTP; Ep01 2026-10-30 nhắm −2 ra −1,4). Từ 2026-10-30 `render:j` nhắm TP −2,5 và báo lỗi khi vượt −1,5; nếu báo lỗi, master lại từ bản raw (`out/j/<id>-raw.mp4`). Thêm `--keep-raw` để master lại mà không phải render lại.
- Nhạc Pixabay vẫn có thể dính Content ID (Ep04 2026-11-03: Documentary Nature của leberch bị claim, đã loại). Bài mới: tải một video không công khai lên YouTube để thử trước khi đăng thật.
- Không SFX tổng hợp, không âm thanh hoạt hình; tối đa 1 SFX / nhịp; nhịp lặng không có SFX.

**Kênh**
- Kiểm handle bằng `curl https://www.youtube.com/@Handle` (200 = đã có, 404 = trống) **không thấy** handle bị giữ hoặc quá giống kênh khác. Luôn để Lucas thử tạo trên YouTube.
- Không chép nguyên văn hay dịch trọn kịch bản đối thủ; chỉ tóm tắt cấu trúc. Video / khung hình tải về của bên thứ ba luôn để git-ignored.

## 7. Luật cứng (nhắc lại)

1. **Không push lên GitHub** khi Lucas chưa bảo. Commit chỉ khi Lucas yêu cầu.
2. Ngoại lệ camera (bay, đẩy, xoay, motion blur) **chỉ cho style J**; style A–I giữ nguyên.
3. Không clip phim; chỉ dùng tranh public domain + ảnh AI tự tạo; ghi nguồn từng ảnh.
4. Không bịa toạ độ, tuyến, ngày, số liệu, trích dẫn; có nguồn mới được dùng (Bible §8).
5. Chất lượng xuất: crf 18, −14 LUFS / −1,5 dBTP.
