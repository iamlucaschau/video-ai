# 02 — REMOTION TECH SPEC (dành cho Claude Opus 5.5)

## 1. Quy trình build (VO-first — bắt buộc)
1. **Tạo voiceover trước:** dùng TTS (giọng kể chuyện tiếng Anh, ~150 từ/phút) đọc nguyên văn VO trong `01_EPISODE-SPEC`. Xuất file `vo.mp3`.
2. **Đo timing thật:** dùng whisper/forced-alignment lấy timestamp từng câu. Hiệu chỉnh timecode trong scene manifest theo số đo thật (sai số cho phép ±0.3s).
3. **Mới viết code Remotion** theo timing đã khóa. Không hardcode timecode ước lượng rồi render mù.

## 2. Cấu hình Composition
- `width: 1080, height: 1920, fps: 30`
- Tổng duration = độ dài `vo.mp3` + 1.5s tail (cho closing card đọng lại)
- Render: `npx remotion render` → h264, yuv420p, audio AAC 128k

## 3. Kiến trúc component
```
<Episode>                    // composition root, nhận scene manifest + vo.mp3
├── <PaperBackground/>       // nền giấy (prop: variant = white|chalkboard|lined)
├── <TitleCard/>             // scene 1
├── <Scene> × N              // mỗi scene trong manifest
│   ├── <DrawSvg/>           // nhân vật/đồ vật: SVG stroke draw-on (stroke-dashoffset)
│   ├── <ArtistHand/>        // bàn tay họa sĩ xuất hiện khi vẽ yếu tố mới
│   ├── <HandText/>          // chữ viết tay, hiện đồng bộ VO (±0.2s)
│   └── <MathBoard/>         // phép tính hiện từng bước
├── <ClosingCard/>           // scene 9: 3 dòng verdict hiện lần lượt
└── <AudioTrack src=vo.mp3/> // + nhạc nền −20dB dưới VO
```

## 4. Animation primitives (dùng Remotion API chuẩn)
- Vẽ tay: `interpolate(frame, [s, e], [dashFull, 0])` trên `strokeDashoffset`
- Chữ hiện: viết từng cụm theo timestamp VO, dùng `spring()` nhẹ (không fade mờ)
- Chuyển scene: hard cut (không transition màu mè) — đúng style series gốc
- Bàn tay họa sĩ: `AbsoluteFill` + translate theo path vẽ, ẩn sau khi nét vẽ xong

## 5. Asset SVG
- Vẽ nhân vật/đồ vật bằng SVG path thủ công, style nét phác (strokeWidth 5–8, strokeLinecap round, màu theo character sheet)
- KHÔNG dùng ảnh raster/AI-generated cho nhân vật — toàn bộ code-drawn để giữ style đồng nhất và render nhanh
- Tái sử dụng: `<PoorCharacter/>`, `<RichCharacter/>`, `<ArtistHand/>` là component dùng chung mọi tập

## 6. Đồng bộ chữ–VO (critical)
- Mỗi `HandText` nhận prop `at` = timestamp (giây) câu VO tương ứng
- Kiểm tra: không chữ nào hiện trước khi VO đọc tới nó quá 0.2s
- Phép tính: tách thành mảng steps, mỗi step `at` riêng theo nhịp VO đọc

## 7. QA checklist trước khi render final
- [ ] VO khớp 100% text trong 01 (không thêm/bớt từ)
- [ ] Mọi text on screen đúng chính tả, đúng số ($25, $140, $1,240, $62/hr, $17.25/hr)
- [ ] Màu nhân vật: poor luôn đỏ, rich luôn xanh — kiểm tra từng scene
- [ ] Không frame nào có chữ bị cắt khỏi canvas 1080×1920
- [ ] Chữ không hiện sớm hơn VO 0.2s
- [ ] Render test 1 scene (scene 3) xem trước khi render full
- [ ] File cuối: MP4 + caption.txt (caption đã cho trong 01)
