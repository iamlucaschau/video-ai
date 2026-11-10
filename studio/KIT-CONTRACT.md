# HỢP ĐỒNG KIT — mọi style trong Style Library phải có gì

*Studio P3, 2026-11-01. Rút từ các kit F–L đang chạy. `npm run studio:kit -- new …` tạo kit đúng hợp đồng từ card của P2; `npm run studio:kit -- check "Style Library/<X>-<tên>"` kiểm một kit có sẵn.*

## 1. Thư mục

```
Style Library/<X>-<tên>/
  README.md          look, mạnh / yếu, luật camera + chữ (ngoại lệ ghi rõ, Lucas duyệt), bảng kỹ thuật → component, cách dựng,
                     mục "## Bẫy đã gặp" (W10, 2026-11-03: mỗi lỗi đã tốn thời gian một dòng; `check` cảnh báo khi thiếu)
  ref.jpg            khung mẫu từ bản test CỦA MÌNH (không dùng khung của video đối thủ)
  <tên>.tsx          kit: mọi component của style
  <x>-kit/Video.tsx  KitSheet: một khung bày đủ màu + component, để chụp sheet kiểm (không cần giọng)
  <x>-test/Video.tsx bản test ~30 s theo giọng đọc thật (Cổng 4 của quy trình tập)
```

## 2. Kit `<tên>.tsx` bắt buộc

| Phải có | Vì sao | Ví dụ |
|---|---|---|
| **Bảng màu** `export const <X> = { bg, ink, accent, … }` (vai trò, không phải tên màu) | dự án đặt màu nhấn riêng (Style Library §2.3); card P2 ghi vai trò | `L.paper`, `L.ink`, `L.gold` |
| **Nền** (component phủ khung) | khung 0 không bao giờ đen (thumbnail, lesson E1) | `AtlasMap`, `SatMap`, `RoomBack`, `RetroBg` |
| **Skin phụ đề** `export const <Tên>Sub: SubSkin` cho `KaraokeSubs` (`../subs`) | phụ đề karaoke §2.6; style không phụ đề (J) vẫn có skin cho chữ khoá | `AtlasSub`, `JourneySub`, `CaseSub` |
| **Chip chữ khoá / con số** (≤ 5 từ, ≥ 48 px) | luật ít chữ: màn hình chỉ có từ khoá hoặc con số | `DateChip`, `NumberChip`, `StopLabel` |
| Import từ `../kit-common`: `CANVAS`, `SAFE`, `FONT`, `CLAMP`, `prog` | một vùng an toàn, một họ font cho mọi style | mọi kit F–L |
| Mỗi kỹ thuật 🟢 / 🟡 có `decision` "dùng" / "thay" trong `style-card.json` → một component (hoặc ghi rõ dùng lại của kit nào) | card là đầu vào; README có bảng T# → component | `T5 → Magnifier` |

## 3. Cấm (`studio:kit check` dò)

`Math.random(` (dùng `random("seed")`), `Date.now(`, `setTimeout`, `@keyframes`, `animation:`, `transition:`, chuỗi `transform:` (dùng `scale` / `translate` / `rotate`), `<img` / `<video` / `<audio` thô (dùng `Img`, `Video` / `Audio` của Remotion). Font ngoài `FONT` chỉ khi README ghi ngoại lệ đã duyệt (vd. L: serif cho end card).

## 4. Composition

- Đăng ký trong `src/Root.tsx`, 1080×1920, 30 fps, id `Style-<X>-<TênCamel>-Kit` / `-Test`.
- Nhận prop `safeGuide?: boolean` → vẽ `<SafeGuide />` (`src/series/pvr/safe.tsx`) để `sheet-j` chụp có vùng đỏ.
- Style có nhân vật diễn (tay chân, biểu cảm) hoặc nội thất có phối cảnh: dùng `Style Library/toon-engine/` (rig + phòng + ánh sáng, MIT), chép trang phục / phòng riêng vào kit của style, không sửa engine cho riêng một style.
- Bản test: mọi mốc gắn vào chữ trong giọng đọc (`at(id)`, `end(id)`, `w(id, k)` như `L-siege-atlas/l-thermopylae/Video.tsx`), không mốc theo đồng hồ.

## 5. Vòng dựng một style mới (P3)

1. `npm run studio:cards -- check Test/<nguồn>` ✓ và Lucas đã duyệt báo cáo + công cụ 🟠.
2. `npm run studio:kit -- new <X>-<tên> --from Test/<nguồn>` → kit + KitSheet + README nháp; dán dòng đăng ký vào `Root.tsx` (lệnh in ra).
3. `npm run sheet:j -- Style-<X>-<Tên>-Kit --frames 0` → nhìn sheet: màu, chữ, vùng an toàn.
4. Viết component cho từng T# (bảng trong README), mỗi cái thêm vào KitSheet.
5. Bản test ~30 s: kịch bản + spec như tập (Bible kênh §9), `node scripts/episode.mjs prep` → `npm run voiceover` → `export` → `words.py` → `<x>-test/Video.tsx` (chép khung từ `L-siege-atlas/l-thermopylae/Video.tsx`).
6. **Storyboard trước chuyển động** (W3–W4, 2026-11-03): `<x>-test/shots.json` (mỗi hình một shot, cắt theo từ: `"at": "07:soap"`) → `node scripts/shotlist.mjs "Style Library/<X>-<tên>/<x>-test" --board Style-<X>-<Tên>-Test` → `shots.timeline.json` (Video.tsx import để cắt cảnh), `shotlist.md` (nhịp so với kênh nguồn) và bảng 1 still / shot. Sửa trên still theo checklist của `review-loop` bước 0, rồi mới làm chuyển động.
7. `review-loop` (sheet + critic, checklist chuyển động W7) → `npm run render:style -- Style-<X>-<Tên>-Test` → `npm run studio:compare` (âm lượng + chỗ giọng bị nền che) → Lucas xem trên điện thoại.
8. `npm run studio:kit -- check "Style Library/<X>-<tên>"` ✓, thêm dòng vào `Style Library/README.md` §1 + cột §3.
