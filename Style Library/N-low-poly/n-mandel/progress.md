# progress — n-mandel (tập mẫu style N · Low-poly 3D)

| Cổng | Trạng thái | Ngày |
|---|---|---|
| 1 · Kịch bản của Lucas + kiểm chứng (The Hustle 2018) → 3 chỗ sửa nhẹ (Lucas duyệt) | ✓ `kich-ban-n-mandel-FINAL.md` | 2026-11-05 |
| 2 · Chốt hình: mặt vẽ code, đồ 3D dựng code, mỗi shot 1 lần lướt máy (Lucas duyệt) | ✓ | 2026-11-05 |
| 3 · Giọng: Charon, `gemini-3.8-flash-tts`, 8 request, 101,95 s, 182 wpm | ✓ | 2026-11-05 |
| 4 · Kit N (`lowpoly.tsx`, `props.tsx`, `sets.tsx`, 9 bối cảnh) + 56 shot trên từ VO, 2 lượt soát storyboard, sửa 30 khung | ✓ | 2026-11-05 |
| 5 · Âm thanh: nhạc tự tạo `own/n-heist.mp3`, SFX thật + 3 tiếng code (`make-sfx-lotto.py`) | ✓ | 2026-11-05 |
| 6 · Render 4K (`render:style --timeout=240000 --concurrency=4 --gl=angle`, giữ raw `out/j/Style-N-LowPoly-Mandel-raw.mp4`) + QA: sửa đống vé nhấp nháy (frustum culling), render lại; 2160×3840, 3079 frame, −13,9 LUFS, −2,8 dBTP | ✓ `QA.md` | 2026-11-05 |

| 7 · Lucas yêu cầu soát từng khung: xem đủ 3.079 khung, sửa 27 lỗi (`SOAT-KHUNG.md`), thêm 3 shot (S6b, S6c, S40b), render lại 2 lần; 59 shot; xem lại mỗi khung thứ 6 của lần render trước và các shot sửa sau cùng; QA chỉ còn 1 thay đổi đột ngột cố ý | ✓ tự chấm 7,1 / 10 | 2026-11-06 |

| 8 · So với kênh mẫu Loaded Dice (`Test/Loaded Dice/INGEST.md`, `out/sheets/n-mandel-sbs.jpg`): chấm lại, thang cũ 7,1 quá cao | tự chấm lại 5,9 / 10; chờ Lucas chốt có dùng model CC và mặt AI không | 2026-11-06 |

| 9 · Lucas giữ toàn code, bản sắc riêng. Thêm hậu kỳ (`post.tsx`), đèn tối xanh đêm + hổ phách, vân bề mặt, đầu / mặt mới, diễn xuất theo khoá (`act`), giọng tempo 1,12 (202 wpm, 92 s). Bản nháp đoạn đầu `out/n-draft.mp4` | đoạn đầu tự chấm 7,3 / 10; chờ Lucas xem hướng; bản 4K `n-mandel.mp4` là bản cũ | 2026-11-06 |

| 10 · Lucas: làm tiếp hướng này. Hook qua lồng cầu (chip 14 JACKPOTS, vòng lặp giữ), 4 khoảnh khắc: cửa cuốn sập + tắt đèn (S39), vé trúng trồi lên sáng từng số (S44), kéo cần cho bóng rút hết + số tự xoá (S53), câu hỏi cuối qua lồng cầu (S56). Mặt mới (răng, má, nheo, nhếch, mí mắt), người trong các cảnh trống, số vào cảnh (`LedBoard`, lịch), bản đồ lên bàn có bàn tay ghim, gộp S30–S32, phụ đề có quầng tối, phòng Interview / Chamber tối lại. Âm thanh: tiếng nền từng nơi, cửa cuốn, vé đổ, bóng rơi, nhạc có đường cong và tắt trước "They ran out of time"; giọng tempo 1,15 + nghỉ dài sau 3 câu then chốt, 93,0 s. Bóng + vé đổi sang bộ số thật 8 11 13 15 19 20. Bản nháp nửa độ phân giải `out/n-draft-full.mp4` | critic độc lập 3 lượt: 6,6 → 6,9 → 6,8 / 10; **chưa đạt 9, chưa render 4K**; đã hết 3 lượt theo review-loop, chờ Lucas xem và nghe | 2026-11-06 |

| 11 · Lucas: nâng diễn xuất tiếp. Bộ khung: chuyển động so le trong `act` (mắt, đầu, thân, tay lệch nhịp), thở + đổi trọng tâm + chớp + liếc tự động trong `Person`, miệng cong (`mouthGeo`), `worry` / `frown` đúng chiều, `heavy`, `tilt`, `twist`, `shrug`, `handAt`. Gộp 57 → 45 shot, diễn trong shot dài: S6, S18, S21, S36, S40, S42, S45, S48, S50, S52, S56. Hook bắt bóng 14; bóng chạy theo đồng hồ riêng nên chỗ nối vòng lặp liền. Phụ đề rời màn hình trong khoảng lặng; bỏ giờ giả ở CCTV; dấu đổi thành NEW LAW | critic độc lập 7,0 → 7,3 / 10; **chưa đạt 9, chưa render 4K**; chờ Lucas xem và nghe | 2026-11-06 |

| 12 · Lucas: sửa tiếp 5 lỗi. S1 / S56 bóng chậm hơn + vệt mờ, bắt bóng trong khoảng trống; S38 viền đỏ sau gáy, quay phắt nhìn bảng; S52 khung chặt, bóng rút chậm, lồng có viền sáng; S45 chữ FBI trên lưng + chip FBI + CIA, tay giơ phía xa; S54 lưới 5-5-4 to hơn, sáng từng tờ; bàn tay trên bản đồ Virginia (S24) | critic độc lập 7,1 / 10 (các lượt sau khi gộp shot: 7,0 · 7,3 · 7,1, tức chững quanh 7,2 ± sai số); **chưa đạt 9, chưa render 4K**; chờ Lucas xem và nghe | 2026-11-06 |

| 13 · **Lucas chốt: dừng ở mức ~7 / 10, commit.** Mỗi lượt subagent chấm lại ra một nhóm lỗi khác, rất mất thời gian; muốn tới 9 như kênh mẫu thì Lucas nghĩ cần dựng bằng Blender. Bản 4K chưa render lại | ✓ dừng | 2026-11-06 |

**Danh sách dưới đây để tham khảo, không phải việc còn nợ.** **Critic mới nhất (7,1), còn lại:** S40 ngồi như đi cà kheo, S45 tay chưa chạm bàn + mặt Mandel nhỏ + đặc vụ thứ ba bị cắt, S38 tay lẫn vào cổ áo; S54 vẫn như lưới slide, chưa có người; S24–S28 đồ vật trên nền tối, nên đặt lên bàn của Mandel; tay khối vuông, tay dài, kéo cần nhẹ tênh; S1 / S56 vệt mờ còn thành bậc, mặt lúc bắt bóng chưa đủ sống; quầng tối phụ đề lem trên nền sáng; số đang chạy (~459,900 ở S40, 5714470 ở S5) không có trong bảng kiểm chứng; S39 màu lọt qua cửa cuốn. Tiếng che giọng có thể ở 24,0–24,6 · 64,2 s (chưa ai nghe).

**Lucas quyết:** câu "not one of them was luck" có vẻ mâu thuẫn với "it was still a gamble" và ~700.000 tổ hợp không mua được.

**File:** `Video.tsx` (composition `Style-N-LowPoly-Mandel`), `shots.json` → `shots.timeline.json`, `shotlist.md`, `vo.mp3`, `vo-timestamps.md`, `n-mandel.mp4` (git-ignored).

**Quyết định:** phụ đề 1–3 từ theo luật Short của dự án (không phải 1 dòng dài như kênh mẫu); không dán ảnh mặt người thật; số chiến dịch Virginia ("~700,000", "125 shops") chỉ có một nguồn chính.

**Chưa làm:** `studio:kit -- check` cho kit N; cột style N ở §3 của `Style Library/README.md`.

**Bước tiếp:** không còn việc mở cho tập này. Muốn đăng thì render 4K (`npm run render:style -- Style-N-LowPoly-Mandel --to <mp4> --keep-raw --timeout=240000 --concurrency=4 --gl=angle`), vì `n-mandel.mp4` trong thư mục vẫn là bản cũ. Bản nháp mới nhất: `out/n-draft-full.mp4`.
