# toon-engine — rig nhân vật + phòng phối cảnh + ánh sáng, vẽ bằng code

*Thêm 2026-11-03 (Lucas duyệt W1–W2, `studio/DE-XUAT-WHAT-IF-ANIMATION.md`). Chép từ [kelano86/what-if-animation](https://github.com/kelano86/what-if-animation) `studio/src/engine/` (commit `8092fb5`, **MIT © 2026 FreshStack**, giấy phép trong `LICENSE` ở đây; mỗi file giữ dòng ghi nguồn). **Không phải một style:** là engine cho style nào cần nhân vật hoạt hình 2D có tay chân (dự kiến style M, học từ Squire Explains, `Test/Squire Explains/`).*

## Có gì

| File | Việc |
|---|---|
| `rig.tsx` | **một rig, nhiều bộ trang phục** (`LOOKS`, `Look`): đầu tròn, tay / chân 2 khớp `{a, b}` (độ), tay găng `open` / `point`, `yaw` −1…1 (thân hẹp lại, mặt trượt theo), 9 biểu cảm (`neutral happy smug shock worried oops cool dizzy tired`), `blink`, `look`, `squash`, `sway`. `poseAt(t, keys)` nội suy key có ease (mặt giữ tới key của nó), `faceAt(t, [[f, expr]])` đổi mặt **qua một cái chớp mắt**, `walkPose(x, phase, ground, scale)`, `joints` / `toWorld` (gắn đạo cụ vào bàn tay), `reachAngle`. `<Hero look pose rimId shadow />` |
| `room.tsx` | `makeRoom(vp, tường sau, độ sâu)` → `P(u, v, w)` (u ngang, v dọc, w về phía camera, 0…1), `Q(...)` cho đa giác; `Box` chỉ vẽ mặt camera thấy; bảng màu `S3` (tường tối vừa để ánh sáng nổi) |
| `furnish.tsx` | `RoomShell` (trần, tường, sàn ván / gạch), `BackWindow` (cửa sổ có trời + mặt trời / trăng), `Pendant`, `WallLight`, `FloorShadow`, `FloorPlant`, `WallFrame`, `WallClock`, `Tabletop` (mặt bàn nhìn từ trên), **`stand(R, u, w)`**: hông + tỉ lệ người đứng ở điểm sàn (u, w) |
| `light.tsx` | `SetDefs` (gradient, vân tường), `Glow`, `Cone`, **`LightVeil`** (tối vùng giữa, khoét lỗ chỗ có đèn), `Dust`, `WallTexture`, `RoomCorners`, `SkyView` |
| `kit.tsx` | `KitDefs` (**viền sáng** `rimR / rimL / rimRed / rimBlue`, blur 3 / 6 / 10 / 16), `DuskSky`, `Sun`, `Rays`, `Haze`, `Bokeh`, `Shaft`, `Skyline`, `Foreground` (tiền cảnh mờ tối), `NightSky`, `Stars`, `Moon` |
| `anim.ts` | `lerp`, `easeInOut / easeOut / easeIn / backOut`, `kf(t, [[f, v]…])`, `rnd(seed, i)` (thay `Math.random`), `settle`, **`camT(cx, cy, zoom, w = 1080, h = 1920)`** |
| `ToonCheck.tsx` | khung kiểm 9:16: một phòng, 3 nhân vật (với tay có lấy đà + vượt, đi bộ, đứng), hàng 9 biểu cảm |

**Đổi so với bản gốc:** `camT` nhận cỡ khung (mặc định 1080×1920 thay vì 1920×1080); bỏ `shake` (AGENTS short-form số 2: không rung). Không chép `props.tsx`, `sets/` (đồ và phòng hiện đại), `ui.tsx` (giao diện What If), `episode.tsx` (engine tập của họ; mình dùng timing VO + `shotlist.mjs`), `fonts.ts` (mình dùng `FONT` của `kit-common.ts`), script ElevenLabs.

## Cách dùng trong một style

1. Trong SVG `viewBox="0 0 1080 1920"`: `<KitDefs />` và `<SetDefs />` một lần, rồi set → đồ phía sau → nhân vật → đồ phía trước → `Foreground` (thứ tự vẽ = độ sâu).
2. Một shot là hàm thuần của đồng hồ riêng `t` (frame trong shot): không state, không `Math.random` (dùng `rnd`). Cộng thêm một số vào `t` của set để bụi / đèn đung đưa không bắt đầu lại ở mỗi cú cắt.
3. Khung: `<g transform={camT(cx, cy, zoom)}>`: rộng 0,75–1,1, vừa 1,6–2, cận 3–4,5. **Đổi cỡ cảnh bằng hard cut** (luật K); đẩy chậm chỉ khi style có ngoại lệ camera.
4. Trang phục mới = một `Look` mới trong `LOOKS` (+ `extra` nếu cần một món: mũ, giáp…), kiểm trên khung kiểm. **Nhân vật của mình**, không giống nhân vật nổi tiếng hay nhân vật của kênh khác.
5. Nội thất mới: `makeRoom` → `RoomShell` → nguồn sáng (cửa sổ, đèn) → đồ (`Box` + `FloorShadow`) → `LightVeil` khoét lỗ ở mỗi đèn → `Glow` → `Dust` → người bằng `stand(R, u, w)`.

## Kiểm

```bash
npx tsc --noEmit
# khung kiểm chưa đăng ký trong src/Root.tsx: dùng entry tạm trong out/
npx remotion still out/toon-check/index.tsx Toon-Engine-Check out/toon-check/f24.png --frame=24
```

`out/toon-check/index.tsx` (git-ignored) chỉ `registerRoot` một composition `Toon-Engine-Check` (1080×1920, 30 fps, 120 frame) từ `ToonCheck`. Khi một style bắt đầu dùng engine, đăng ký trong `src/Root.tsx` thay cho entry tạm.

## Bẫy đã gặp

*Từ `references/traps.md` của bản gốc (những bẫy còn đúng ở đây) + của mình. Thêm dòng mỗi khi một lỗi tốn thời gian.*

- **Thứ tự vẽ = độ sâu.** Người ở xa (w nhỏ) vẽ trước; ở khung kiểm đầu tiên người đi ở xa bị vẽ đè lên người ở gần (2026-11-03).
- **`stand` ở w lớn cho người rất to** (gần camera): trên khung dọc, w 0,5 đã cao gần nửa khung. Người đứng giữa phòng: w 0,1–0,3.
- **Tay chân tối biến mất trên tường tối.** Tay chân sáng có viền đậm, hoặc thân tối có viền sáng (`rimR`), đầu là chỗ sáng nhất.
- **Đồ đứng cần chân + bóng tiếp đất** (`FloorShadow`), nếu không sẽ trông như lơ lửng.
- **`LightVeil`:** ~0,28 cho cảnh rộng cần thấy sàn, 0,42–0,5 cho cảnh khác; lỗ sáng chỉ bằng vùng sáng của đèn, lỗ to quá làm cả phòng xám phẳng.
- **Không gì sáng hơn mặt nhân vật** trong vùng của nó (đồ vật tối hơn người một bậc).
- **Tay giơ lên là tay gần camera.** Với `yaw < 0`, tay xa bị thân che.
- **Tay không chạm được đầu** (đầu vẽ sau tay): ở cảnh cận, để tay rig buông và tự vẽ tay riêng sau nhân vật.
- **Ngồi chính diện không đọc được.** Cho ngồi nghiêng: đùi ra trước (`a` ≈ 80), cẳng chân xuống (`b` ≈ −80).
- **Id duy nhất.** Set có gradient / mask / clip nhận `id`; mỗi shot một id riêng, set vẽ hai lần trong một khung (bản mờ sau cảnh cận) cần id khác nữa.
- **Mặt đổi, không biến hình:** dùng `faceAt`.
- **Đi trên cầu thang:** `ground` là hàm theo x, không phải bậc, nếu không hông giật từng bậc.
- **Không bao giờ cắt vào một khung trống:** thứ shot dựng lên phải có sẵn ở frame đầu của shot.
