# Spec — bản test style K

- Composition: `Style-K-ChibiCase-Test` (1080×1920, 30 fps). Code: `Video.tsx`.
- Mọi cú cắt lấy từ `src/voiceover/k-test.timing.json` (tạo lại giọng thì cảnh tự canh lại); miệng + phụ đề theo `k-test.words.json`.
- Cảnh: hook (n1) → phòng hỏi cung rộng (m1) → cận Minh (m2) → timeline + vòng đỏ (n2, n3) → line-up (n4) → bảng gợi ý (n5) → 10 s đếm ngược.
- Pipeline: `npm run voiceover -- voiceover/k-test.json` → `node scripts/episode.mjs export "Style Library/K-chibi-case/k-test"` → `python -P scripts/words.py k-test vi`.
