# Cài dự án trên máy mới

GitHub (`https://github.com/iamlucaschau/video-ai`, nhánh `master`) giữ code, kịch bản, giọng đọc, hình,
kết quả QA (`NGHE.md`, `checks.md`…) và hướng dẫn cho Claude (`AGENTS.md`, `CLAUDE.md`, `.claude/skills/`).
Những thứ dưới đây **không** nằm trên GitHub, phải cài hoặc chép tay. Phiên bản ghi theo máy gốc (đo 2026-11-10).

## 1. Bắt buộc: mở Studio, render, làm giọng đọc

| Cần | Cách lấy | Máy gốc |
| --- | --- | --- |
| Code | `git clone https://github.com/iamlucaschau/video-ai.git "VIDEO AI"` | |
| Node + npm | nodejs.org, rồi `npm install` trong thư mục dự án | Node 20.14 |
| ffmpeg trên PATH | gyan.dev (bản essentials) hoặc `winget install Gyan.FFmpeg` | 2026-02 essentials |
| Key Gemini TTS | Chép `gemini_key.txt` từ máy cũ, hoặc tạo `.env` theo `.env.example`. **Không bao giờ commit key** | 4 key |
| SFX + nhạc Pixabay (`public/sfx/**/*.mp3`, ~122 file) | **Chép cả thư mục `public/sfx/` từ máy cũ** (USB / Drive riêng). Chỉ 21 file có link tải lại: `node scripts/fetch-sfx.mjs scripts/music-list.json`, `… scripts/sfx-list-war.json`, `… scripts/sfx-list-war2.json`. Các file còn lại `catalog.json` chỉ lưu trang Pixabay, phải tải tay từng file | |

Kiểm tra: `npm run lint`, `npm run tts:check`, `npm run dev` → http://localhost:3000.
Chrome Headless của Remotion tự tải ở lần render đầu.

Thiếu file SFX thì video dùng file đó render lỗi hoặc mất tiếng. Thư mục `public/sfx/` bị git bỏ qua vì giấy phép
Pixabay cho dùng trong video nhưng không cho phân phối lại file.

## 2. Kiểm tra âm thanh bằng earshot (`npm run listen`, bắt buộc cho tập mới có SFX)

| Cần | Lệnh | Máy gốc |
| --- | --- | --- |
| Python | python.org | 3.13 |
| uv | `pip install uv` hoặc astral.sh/uv | 0.13.6 |
| earshot | `uv tool install --python 3.12 "earshot @ git+https://github.com/Leonxlnx/earshot@4ac3d2a"` | v0.4.1 |
| demucs (tách giọng) | `pip install demucs` (kéo theo torch, vài GB) | 4.1.0, torch 2.15 |
| `EARSHOT_HOME` | Đặt biến môi trường trỏ tới ổ còn trống ≥ 4 GB. `scripts/listen.mjs` mặc định dùng `B:/Claude/earshot-home`; máy không có ổ B: thì **phải** đặt biến này. Lần chạy đầu earshot tự tải ~1,1 GB mô hình (máy gốc hiện 3,5 GB) | `B:/Claude/earshot-home` |

Kiểm tra: `npm run listen -- --selftest`.

## 3. Tuỳ việc

| Việc | Cần | Lệnh / ghi chú |
| --- | --- | --- |
| Phân tích kênh tham khảo (`studio:ingest`) | yt-dlp, faster-whisper, rapidocr | `pip install yt-dlp faster-whisper rapidocr-onnxruntime` |
| Script Python vẽ / tạo âm (`scripts/*.py`) | numpy, Pillow | `pip install numpy pillow` |
| Cảnh Blender (Carrier, Submarines) | Blender ở `B:/Blender/blender.exe` (đường dẫn ghi trong `scripts/blender/*.py`) | Cảnh đã render (`public/video/`, 520 MB cho Carrier) không có trên GitHub: chép từ máy cũ hoặc render lại theo hướng dẫn đầu mỗi file `.py` |
| Video đã render (`*.mp4`) | | Không có trên GitHub, render lại |
| Repo tham khảo (`reference/`) | git | Lệnh clone trong `reference/README.md`. Chỉ để đọc, dự án không cần chúng để chạy |
| Knowledge graph (graphify) | `uv tool install graphifyy` | Hook trong `.claude/settings.json` gọi `C:/Users/ADMIN/.local/bin/graphify.EXE`. Máy khác tên user thì sửa đường dẫn này, hoặc hook báo lỗi ở mỗi lần Claude đọc / tìm file |

## 4. Trí nhớ của Claude

Những gì Claude "nhớ" giữa các phiên (trả lời tiếng Việt, render 4K, tên kênh…) nằm ở
`C:\Users\ADMIN\.claude\projects\B--Claude-Project-VIDEO-AI\memory\`, ngoài dự án. Muốn máy mới nhớ như cũ thì chép
thư mục đó sang. Tên thư mục con đổi theo đường dẫn dự án (`B:\Claude\Project\VIDEO AI` → `B--Claude-Project-VIDEO-AI`).
Các plugin / skill cài toàn máy (graphify, ponytail…) cũng phải cài lại.

## Gợi ý: chép một lần từ máy cũ

Gom các thư mục này vào ổ ngoài là đủ, khỏi tải lại: `public/sfx/`, `public/video/`, `gemini_key.txt`,
`B:/Claude/earshot-home/` (tuỳ chọn, 3,5 GB) và thư mục memory ở mục 4.
