# KHẢ THI — dựng lại được không, cần công cụ gì

*Studio P2, 2026-11-01. Dùng ở bước bóc tách: mỗi kỹ thuật T# của video mẫu nhận **một mức**, ghi vào `style-card.json` (`techniques[].feasibility`), lý do và dấu hiệu đi kèm. `npm run studio:cards -- check <thư mục>` sinh bảng `KHA-THI.md` của video mẫu từ card.*

## 1. Bốn mức

| Mức | Mã trong card | Nghĩa | Việc của Luis |
|---|---|---|---|
| 🟢 | `green` | Remotion thuần, với gói và script đã có trong repo | ghi component kit sẽ dùng (hoặc sẽ viết) |
| 🟡 | `yellow` | dựng được, cần **tài sản**: ảnh AI do Lucas tạo, tranh / bản đồ / dữ liệu public domain hoặc giấy phép mở, SFX Pixabay | ghi nguồn + giấy phép; prompt ảnh nếu là ảnh AI |
| 🟠 | `orange` | họ dùng **phần mềm khác**, hoặc cần cài gói / công cụ mới (kể cả gói `@remotion/*` chưa có) | ghi công cụ vào `tools[]`: giấy phép, giá, cách cài, cách nối vào Remotion, **phương án không cài**. `status: "proposed"` tới khi **Lucas duyệt**. Không cài trước khi duyệt |
| 🔴 | `red` | không nên dựng lại: quay thật, video AI cả cảnh, footage có bản quyền, nội dung trái luật kênh | ghi cách thay (thường bằng 🟡) |

Mỗi kết luận có **dấu hiệu** (nhìn thấy gì trên khung, frame / giây) và nhãn **ĐO / ƯỚC / QUYẾT**. Nhận ra phần mềm chỉ là suy từ dấu hiệu: luôn là **ƯỚC**, trừ khi kênh tự nói (mô tả, credit).

## 2. Dấu hiệu → họ có thể dùng gì → mình làm sao

| Dấu hiệu trên khung | Họ có thể dùng | Mức | Cách của mình |
|---|---|---|---|
| Chữ, chip, mũi tên, khung, biểu đồ, nhãn bay vào; bản đồ phẳng lia / đẩy | After Effects, CapCut, Premiere | 🟢 | component kit (`Style Library/*`), `interpolate` / `spring` |
| Bản đồ nghiêng 3D giả, máy bay liên tục trên ảnh vệ tinh | Google Earth Studio, AE 3D layer | 🟢 | style J: CSS 3D + `camAt` + tấm Blue Marble (`make-plates.py`) |
| Bản đồ địa hình có bóng núi, giấy cổ, tô vùng theo phe | QGIS / Blender + DEM, Photoshop | 🟡 | `atlas-terrain.py`, `atlas-plates.py` (style L), dữ liệu Natural Earth / OpenHistoricalMap (CC0) |
| Biên giới **đúng năm lịch sử** | historical-basemaps (GPL-3.0), OpenHistoricalMap, vẽ tay | 🟡 | OHM trước, ghi credit; thiếu thì vẽ tay theo nguồn học thuật |
| Địa hình 3D thật, núi có thể tích, bay sát đất | Google Earth Studio, Cesium, Blender GIS | 🟠 | Cesium / MapTiler (skill `remotion-maps` đã có hướng dẫn, cần token); hoặc 🟢 thay bằng ảnh nghiêng 2,5D |
| Mô hình 3D có ánh sáng, bóng đổ, chiều sâu thật (diorama, thành, tàu) | Blender, Cinema 4D, Unreal | 🟠 | Blender (mục 3) hoặc `@remotion/three` low-poly; **phương án không cài:** ảnh AI "kiểu diorama" tách lớp parallax (🟡, `cutout.py`) |
| Tranh cổ có người cử động, lửa / khói / hạt bay | AE Puppet + particles, Runway / Kling (AI) | 🟡 / 🔴 | 🟡 tách lớp + parallax + hạt bằng code; video AI → 🔴 |
| Hình chảy, tay / chân biến dạng, vật đổi hình giữa chừng, không có cắt mà cảnh "trôi" | video AI (Veo, Kling, Runway, Sora) | 🔴 | ảnh AI tĩnh + chuyển động bằng code, hoặc tranh public domain |
| Người thật, phỏng vấn, cảnh quay đường phố | camera / stock footage | 🔴 | không dựng; thay bằng minh hoạ |
| Nhân vật hoạt hình 2D có khớp, nhép miệng | Vyond, Adobe Character Animator, Rive, Lottie | 🟠 / 🟢 | 🟢 SVG chibi rig bằng code (style K); 🟠 Lottie (`@remotion/lottie`) nếu cần chuyển động phức tạp |
| Icon / hoạt ảnh nhỏ lặp lại kiểu LottieFiles | Lottie | 🟠 | `npx remotion add @remotion/lottie` + file LottieFiles (giấy phép từng file) |
| Phụ đề karaoke, chữ cháy cứng | CapCut, Submagic | 🟢 | `subs.tsx` + `words.py` |
| Giọng đọc AI | ElevenLabs, TTS khác | 🟢 | Gemini TTS (`tts.mjs`) |
| Nhạc, SFX | thư viện nhạc | 🟡 | Pixabay (`public/sfx/`) |

## 3. Danh mục công cụ

**Đã có trong repo** (dùng không cần hỏi): Remotion 4.0.532 + `@remotion/media`, `motion-blur`, `shapes`, `transitions`, `google-fonts`, `zod-types`, **`paths`** (`evolvePath`, `interpolatePath`: lãnh thổ co / giãn, morph; Lucas duyệt 2026-11-01); ffmpeg / ffprobe; Python numpy, Pillow, faster-whisper, **rapidocr-onnxruntime** (Apache-2.0: chữ trên màn hình, `scripts/ocr.py`), **demucs** + PyTorch CPU (MIT: tách giọng / nền, `scripts/stems.py`; Lucas duyệt 2026-11-01); yt-dlp; script `make-plates.py`, `atlas-plates.py`, `atlas-terrain.py`, `ne-regions.py`, `cutout.py`, `tts.mjs`, `words.py`, `studio-*.mjs`.

**Đề xuất khi cần** (🟠, Lucas duyệt từng cái; ghi vào `tools[]` của card):

| Công cụ | Dùng cho | Giấy phép / giá | Cài | Nối vào Remotion |
|---|---|---|---|---|
| `@remotion/three` | 3D low-poly trong code (thành, tàu, địa cầu) | gói Remotion chính thức | `npx remotion add @remotion/three` + three | `<ThreeCanvas>`; skill `remotion-markup` mục 3d |
| `@remotion/lottie` | hoạt ảnh vector có sẵn | gói chính thức; file Lottie theo giấy phép từng file | `npx remotion add @remotion/lottie` | `<Lottie animationData>` |
| Blender | diorama / mô hình 3D có ánh sáng thật | GPL, miễn phí; cài ~400 MB | winget / blender.org | render chuỗi PNG → `public/` → `<Img>` theo frame, hoặc MP4 → `<Video>`; Blender không chạy khi render Remotion |
| Google Earth Studio | bay địa hình 3D thật | miễn phí, cần tài khoản Google, **bắt buộc ghi credit Google**; chạy trên web | không cài | xuất JPG sequence → `<Img>` |
| Cesium ion / MapTiler | bản đồ 3D / vector theo code | free tier, cần token (giữ như key, không commit) | token trong `.env` | skill `remotion-maps` |

**Không dùng** (🔴 mặc định): video AI tạo cả cảnh, footage có bản quyền, stock video có người thật. Lucas đổi được luật này, nhưng phải ghi vào Bible của kênh.
