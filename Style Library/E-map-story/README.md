# MAP STORY — phong cách video bản đồ (9:16)

*Lưu 2026-10-08 để dùng lại cho mọi dự án. Lần đầu dùng: Poor vs Rich Daily Ep02, bản E (`Poor vs Rich Daily/episodes/ep02-give-discounts/give-discounts-E-map-story.mp4`, composition `PBR-Ep02-GiveDiscounts-E`). Học từ 2 video bản đồ Thổ Nhĩ Kỳ — phân tích đầy đủ: `Test/phan-tich/PHAN-TICH-PHONG-CACH.md`.*

| File | Nội dung |
|---|---|
| `map-story.tsx` | Bộ code Remotion dùng chung (tự chứa: chỉ cần `remotion` + `@remotion/google-fonts`) |
| `examples/key-frames.jpg` | 5 khung mẫu: mở đầu · bay ra thị trấn · phép tính · gộp tổng · kết |
| `examples/contact-sheet-every-3s.jpg` | Cả video Ep02-E, mỗi 3 giây một khung |
| `examples/safe-zone-check.jpg` | Kiểm tra vùng an toàn (đỏ = vùng UI nền tảng che) |
| `examples/reference-*.jpg` | Khung từ 2 video gốc để so sánh |

---

## 1. Khi nào dùng Map Story

Kịch bản có **địa điểm** làm nhân vật: con phố, khu phố, thành phố, tuyến đường, vùng phục vụ, so sánh hai nơi, chuyện xảy ra theo **quãng đường** hoặc **trước–sau theo thời gian**. Ví dụ: chọn chỗ mở tiệm, vùng giao hàng, giá thuê theo khu, lái xe xa vs gần, lịch sử một thành phố, ranh giới địa lý.

Không hợp: chuyện nói chuyện/tin nhắn (dùng chat), một món đồ (dùng diorama), so sánh hai con số trừu tượng không gắn nơi chốn.

## 2. Hình ảnh

| Thành phần | Giá trị |
|---|---|
| Đất | xanh rêu tối `#46523F`, khối nhà `#505D48`, mái nhà mờ `#6E7568` |
| Đường | `#2E3741`, vạch giữa đứt `#8A939C` 50% |
| Nước (sông, hồ) | navy `#132847` — vẽ đè lên đường để đường "chìm" vào nước |
| Mái nhà chính | `#C9C1B0` / bóng `#A99F8C` + vạch nóc |
| Viền tối 4 góc | radial gradient tới `rgba(5,10,16,.75)` — kéo mắt vào giữa |
| Hai phe | `PALETTE.a` đỏ `#D32F2F` / `PALETTE.b` xanh `#388E3C` (đổi theo dự án) |
| Nhấn khu vực | tô màu phe 60% + **viền phát sáng** + viền trắng; **sọc chéo** khi đang giải thích; ô trống = viền trắng đứt |
| Người | avatar đầu tròn: viền màu phe, tóc/mũ nhận diện (messy, neat, gray, cap), mặt có mắt chớp, miệng vui/buồn/nói |

Bản đồ là thế giới **liên tục**: mọi cảnh dùng cùng một bản đồ, chỉ đổi lớp nhấn → cắt cảnh mà không thấy "cắt".

## 3. Chữ (quy tắc short-form)

- Một họ font: **Bricolage Grotesque 800**, mọi chữ ≥ 48 px.
- Chỉ **từ khóa hoặc con số**, mỗi nhãn ≤ 5 từ, **tối đa 2 nhãn** cùng lúc (ngoài phụ đề). **Không bao giờ** đưa nguyên câu lời đọc lên màn hình.
- Loại chữ: `Tag` (viên thuốc màu, neo vào điểm trên bản đồ) · `TagSteps` (đổi số tại chỗ: `$60` → `$48`) · `Bubble` (thoại ≤ 3 từ) · `StepTitle` (① ② ③ đầu vùng an toàn) · `Stamp` (con số/từ khóa đắt nhất, 96 px, vòng sóng lan).
- Phụ đề: 1–3 từ một lần, ở mép dưới vùng an toàn.

## 4. Bố cục — vùng an toàn

Trên 1080×1920: mọi chữ, số, khuôn mặt nằm trong **x 60–940, y 220–1440** (lề trên 220 · dưới 480 · phải 140 · trái 60). Nền bản đồ tràn ra ngoài thoải mái. `CENTER` = tâm vùng an toàn (500, 830); toạ độ thế giới (cam.x, cam.y) luôn vẽ ở đó.

Bố cục mẫu (zoom 1): các lô/khu vực trong dải x −440…440 quanh tâm; nhãn neo trên khu vực (~y −215); dấu đóng lớn ở y −400; nhân vật trên đường y 170; dưới y 470 (thế giới) để trống cho phụ đề.

## 5. Chuyển động

- **Khung đứng yên** gần như toàn bộ. Chuyển động nằm ở: khu vực sáng lên, đường **tự vẽ** (`Route`), xe chạy theo đường (`Vehicle`), avatar bật vào/nói/chớp mắt, nhãn bật nhẹ (nảy ≤ 4%), đồng xu bay về tổng.
- **Máy quay chỉ bay khi đổi địa điểm** (`cams`): một cú, ease in-out, `FLIGHT` = 26 frame, zoom theo cấp số nhân, không nảy, không rung, không trôi liên tục. Ep02 chỉ bay 1 lần (con phố → cả thị trấn → về).
- Cấm: chuyển cảnh kiểu zoom, rung/lắc máy, zoom chậm liên tục.

## 6. Âm thanh

- SFX thật (Pixabay, `public/sfx/`), cân về **−15 LUFS** (ngang giọng, làm điểm nhấn), tối đa 1 SFX mỗi nhịp:
  - whoosh `clean-whoosh-382726` — khi máy quay bay
  - click `digital-click-357350` — khi một con số đổi (`TagSteps`)
  - deep hit `cinematic-low-hit-291095` — khi `Stamp` con số đắt
  - thud `impact-thud-291047` — khi `Stamp` từ khóa
- Nhạc nền ≈ −24 LUFS dưới giọng; master −14 LUFS / −1.5 dBTP.

## 7. Dùng cho dự án mới

```tsx
import { MapScene, Town, Area, Avatar, Route, Tag, Stamp, StepTitle, PALETTE, type Cam } from "../../../Style Library/E-map-story/map-story"; // từ src/compositions/<Tên>/

const HOME: Cam = { at: -999, x: 0, y: 0, z: 1 };
const CITY: Cam = { at: -999, x: -650, y: -1060, z: 0.3 };

const MyTown = () => (
  <Town vRoads={[-1300, -650, 650, 1300]} hRoads={[-430, 170, 770]} keepClear={(x, y) => x === -650 && y === -430}>
    <ellipse cx={-2500} cy={1650} rx={1100} ry={560} fill={PALETTE.water} />
  </Town>
);

export const Scene = () => (
  <MapScene
    cams={[HOME, { ...CITY, at: 90 }, { ...HOME, at: 150 }]}   // bay ra lúc 3 s, về lúc 5 s
    base={<MyTown />}
    world={<>
      <Area rect={{ x: -130, y: -200, w: 260, h: 300 }} at={30} color={PALETTE.a} hatch />
      <Route at={95} pts={[[-1300, -2000], [-1300, 170], [0, 170]]} color={PALETTE.a} width={34} />
      <Avatar x={0} y={25} ring={PALETTE.b} hair="neat" at={10} mood="happy" />
    </>}
  >
    <StepTitle at={20} n={1} color={PALETTE.b}>Trade it</StepTitle>
    <Tag at={40} wx={0} wy={-215} color={PALETTE.a}>$48</Tag>
    <Stamp at={120} wx={0} wy={-400} color={PALETTE.b}>$126</Stamp>
  </MapScene>
);
```

Mẫu đầy đủ (8 cảnh, đồng bộ theo timestamp lời đọc): `src/series/pvr/ep02e/Scenes.tsx` + lớp riêng của Ep02 `src/series/pvr/styles/mapStory.tsx` (con phố 3 lô, garage, sông hồ).

## 8. QA trước khi giao

- [ ] Ảnh kiểm tra có `SafeZoneGuide`: không chữ/số/mặt nào chạm vùng đỏ
- [ ] ≤ 2 nhãn cùng lúc, mỗi nhãn ≤ 5 từ, không câu lời đọc nào trên màn hình
- [ ] Máy quay chỉ bay khi đổi địa điểm; không rung, không zoom chuyển cảnh
- [ ] Mọi con số trên màn hình có trong kịch bản/bảng kiểm toán
- [ ] SFX đúng chỗ, nghe rõ nhưng không đè giọng; master −14 LUFS
