# KHẢ THI — History Maps Lore

*Tự sinh bởi `npm run studio:cards -- check` từ `style-card.json`; sửa card, đừng sửa file này. Mức: `studio/KHA-THI.md`.*

**21 kỹ thuật:** 🟢 11 · 🟡 7 · 🟠 2 · 🔴 1

**Chờ Lucas duyệt:** @remotion/paths (T17)

| T# | Kỹ thuật | Mức | Dấu hiệu | Cách của mình | Công cụ | Quyết định |
|---|---|---|---|---|---|---|
| T1 | Tô lãnh thổ theo phe, biên giới đúng năm | 🟡 | mảng màu phe có biên khác bản đồ hiện đại (ƯỚC) | AtlasMap + dữ liệu OpenHistoricalMap (CC0), ghi credit (D8) | — | dùng |
| T2 | Cờ phe cắm trên cột | 🟡 | icon cờ thật (lưỡi liềm, chữ thập Malta) (ƯỚC) | Flag + hình cờ public domain (Wikimedia) | — | dùng |
| T3 | Chân dung trên băng rôn / huy hiệu tròn | 🟡 | tranh chân dung cổ trong khung băng rôn (ƯỚC) | Banner + Plaque + chân dung public domain | — | dùng |
| T4 | Chip mốc thời gian | 🟢 | chip đổi theo mỗi mốc tháng trong lời (ƯỚC) | DateChip (Bebas ≥ 56 px theo D4) | — | dùng |
| T5 | Kính lúp phóng to nơi nhỏ | 🟢 | vòng tròn có nội dung phóng to nối về bản đồ (ƯỚC) | Magnifier | — | dùng |
| T6 | Mũi tên chiến dịch / tuyến hạm đội | 🟢 | đường cong vẽ dần có đầu mũi tên (ƯỚC) | CampaignArrow + Fleet + Trail | — | dùng |
| T7 | Diorama 3D (thành, pháo đài, quân, tàu) | 🟠 | bóng đổ và chiều sâu thật, ánh sáng nhất quán khi máy di chuyển (ƯỚC) | thay bằng ảnh AI kiểu diorama tách lớp parallax (cutout.py), 2–3 cảnh / tập (D7) | Blender | thay |
| T8 | Tranh / tiểu hoạ toàn khung | 🟡 | tranh cổ có vân sơn (ƯỚC) | FullFrame (kit J) + tranh public domain | — | dùng |
| T9 | Cảnh giống quay thật | 🔴 | chuyển động tự nhiên không có khung tranh, chi tiết chảy (nhiều khả năng video AI) (ƯỚC) | không dựng; thay bằng tranh public domain + chuyển động bằng code | — | bỏ |
| T10 | Sơ đồ thành phố 2,5D / lưới phố vẽ dần | 🟡 | khối nhà nhô lên đúng mặt bằng thật (ƯỚC) | footprint OpenStreetMap (ODbL, ghi credit) → SVG; nghiêng bằng CSS 3D như J | — | dùng |
| T11 | Nhãn serif in hoa nhỏ | 🟢 | chữ serif nhỏ trên bản đồ (ƯỚC) | nhãn Bebas ≥ 48 px, ≤ 2 nhãn cùng lúc (D4) | — | thay |
| T12 | Phụ đề cháy cứng 2 dòng | 🟢 | phụ đề đổi theo cụm lời (ƯỚC) | AtlasSub, karaoke ≤ 4 từ / 26 ký tự (D3) | — | thay |
| T13 | Watermark giữa khung | 🟢 | chữ mờ cố định (ĐO) | Handle (dưới vùng an toàn) | — | thay |
| T14 | End card TÊN NƠI · NĂM | 🟢 | thẻ chữ cuối cố định (ƯỚC) | EndCard (ngoại lệ serif D5, cắt ≤ 0,5 s sau lời cuối D10) | — | dùng |
| T15 | Tuyến thương mại phát sáng | 🟢 | đường sáng vẽ dần (ƯỚC) | GlowRoute (kit J) | — | dùng |
| T16 | Dấu X từ chối | 🟢 | X đỏ bật lên (ƯỚC) | Cross (kit J) | — | dùng |
| T17 | Lãnh thổ co lại | 🟠 | biên vùng biến hình liên tục (ƯỚC) | interpolatePath giữa hai đa giác; không cài thì cắt chéo hai vùng bằng crossfade ≤ 8 frame | @remotion/paths | chờ Lucas |
| T18 | Vùng gạch chéo = đồng minh / chiếm đóng | 🟢 | pattern sọc trong vùng (ƯỚC) | SVG <pattern> trong AtlasMap | — | dùng |
| T19 | Bản đồ giấy cổ | 🟡 | vân giấy, viền khung bản đồ (ƯỚC) | atlas-plates.py + atlas-terrain.py (nền giấy style L) | — | dùng |
| T20 | Tranh được làm động | 🟡 | chỉ một phần tranh chuyển động, nền đứng yên (ƯỚC) | tách lớp (cutout.py) + parallax + hạt bằng code | — | dùng |
| T21 | Dán nhãn nguồn trên hình | 🟢 | chip tên nguồn khi trích (ƯỚC) | SourceLine (kit J) + NumberChip | — | dùng |

## Công cụ

| Công cụ | Cho | Giấy phép / giá | Cài | Nối vào Remotion | Không cài thì | Trạng thái |
|---|---|---|---|---|---|---|
| Blender | T7 | GPL, miễn phí; cài ~400 MB | winget install BlenderFoundation.Blender | render chuỗi PNG → public/ → <Img> theo frame | ảnh AI kiểu diorama tách lớp parallax (D7) | ✗ không dùng |
| @remotion/paths | T17 | gói Remotion chính thức, cùng giấy phép Remotion | npx remotion add @remotion/paths | interpolatePath / evolvePath trong AtlasMap | crossfade ≤ 8 frame giữa hai vùng | chờ duyệt |
