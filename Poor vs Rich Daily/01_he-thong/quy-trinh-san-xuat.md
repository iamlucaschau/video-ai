# QUY TRÌNH SẢN XUẤT — Poor vs Rich Daily
*Bản khóa 2026-10-06. Mô hình theo hệ thống sản xuất của page TRUE, BUT: tiêu chuẩn khóa cứng, change control, episode log, cổng duyệt rõ ràng.*

## 1. Nguyên tắc khóa (change control)

1. **Không thay đổi production-wide khi chưa được Lucas duyệt.** Mọi thay đổi về style, format, nhân vật, nhạc, cấu trúc tập áp dụng cho toàn series đều phải qua Lucas. Đây là luật cứng, copy từ TRUE, BUT.
2. **Spec là luật.** Khi có mâu thuẫn giữa lời Claude nói và file spec, file spec thắng. Khi có mâu thuẫn giữa các file spec, 00_SERIES-BIBLE thắng.
3. **Kịch bản FINAL là bất khả xâm phạm.** Claude không được sửa một từ nào trong voiceover đã lock. Muốn sửa → quay lại cổng duyệt kịch bản.
4. **Không qua cổng khi chưa được duyệt.** Mỗi cổng cần câu "Approved, proceed" rõ ràng từ Lucas.
5. **Mọi con số phải qua kiểm toán.** Số trong kịch bản phải tính lại được; số trên màn hình phải khớp kịch bản.

## 2. Pipeline 8 giai đoạn

| GĐ | Việc | Ai làm | Đầu vào | Đầu ra | Cổng duyệt |
|----|------|--------|---------|--------|------------|
| 0 | Chủ đề | Muse (Master Prompt tạo chủ đề) | Comments, trends | 5 topics xếp hạng | Lucas chọn 1 |
| 1 | Kịch bản v1 → v2 | Claude viết (master prompts) | Topic package | kich-ban-*-FINAL.md (EN+VN) | **CỔNG 1 · KỊCH BẢN** — Lucas duyệt trực tiếp → lock FINAL |
| 2 | Episode spec | Muse | Kịch bản FINAL | 01_EPISODE-SPEC_*.md (8 scenes + timecode ước lượng) | (gộp vào gói bàn giao; Lucas có thể xem trước) |
| 3 | Voiceover | Claude (TTS) | Kịch bản FINAL | vo.mp3 + bảng timestamp | **CỔNG 2 · VO** — Lucas nghe duyệt |
| 4 | Storyboard | Claude | Spec + VO timing | **Phong cách đề xuất + lý do** (theo `03_STYLE-LIBRARY.md` §3) + frame plan từng scene, timecode hiệu chỉnh | **CỔNG 3 · STORYBOARD** — Lucas duyệt phong cách + storyboard mới được code |
| 5 | Test 1 scene | Claude (Remotion) | Storyboard đã duyệt | Frames Scene 3 (bảng phép tính) | **CỔNG 4 · TEST** — Lucas duyệt mới render full |
| 6 | Full render + QA | Claude | Toàn bộ | MP4 + caption.txt + báo cáo QA | **CỔNG 5 · FINAL** — Lucas check checklist |
| 7 | Đăng bài | Lucas | MP4 + caption | Bài đăng trên Poor vs Rich Daily | — |

Chi tiết thao tác từng cổng: xem `huong-dan-ban-giao-claude.md` (message mẫu, mẫu feedback, checklist).

## 3. Bất biến series (invariants — đổi cần Lucas duyệt)

| # | Bất biến | Giá trị khóa |
|---|----------|--------------|
| 1 | Format | 1080×1920, 30fps, 105–135s |
| 2 | Visual | **Thư viện 4 phong cách** (A Receipt × Paper · B Chip Table · C Street Sim · D Text Thread), chọn theo kịch bản mỗi tập (`03_STYLE-LIBRARY.md`); mọi phong cách: khung đứng yên (không máy quay di chuyển), hard cut giữa scene |
| 3 | Nhân vật | Poor luôn đỏ #D32F2F, Rich luôn xanh lá #388E3C |
| 4 | Chữ | Bricolage Grotesque (+ Space Mono cho hóa đơn ở A); **phụ đề bắt buộc**; đồng bộ VO ±0.2s, không cắt khung |
| 5 | Cấu trúc | 5 hồi + thesis hook 3 dòng + mirror tuyệt đối + câu chốt 3 lớp |
| 6 | Số liệu | Mọi số qua kiểm toán, phép tính hiện từng bước |
| 7 | Âm thanh | VO −14 LUFS; nhạc nền ≈ −24 LUFS (Lyria khi có billing), đổi sắc thái ở câu transition; không SFX hoạt hình |
| 8 | Quy trình | VO-first (TTS → đo timing → code); storyboard duyệt trước code; test 1 scene trước render full |
| 9 | Ngôn ngữ | VO tiếng Anh (khán giả US/UK); caption tiếng Anh một câu hỏi |

## 4. Episode log

| EP | Title | Kịch bản | Spec | VO | Storyboard | Test | Final | Ngày đăng | Caption |
|----|-------|----------|------|----|------------|------|-------|-----------|---------|
| 01 | Buy Their Tools | FINAL ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 2026-10-07 | — | Do you buy tools like a poor or rich person? |
| 02 | Give Discounts | FINAL ✓ | ✓ | ✓ | ✓ | ✓ | ✓ 4 bản A/B/C/D (đề xuất đăng C) | — | Do you give discounts like a poor or rich person? |

*Ký hiệu: ☐ chưa làm · ◐ đang làm · ✓ xong.*

## 5. Quy ước file

- Kịch bản: `kich-ban-<slug>-FINAL.md` (EN + VN + kiểm toán số liệu)
- Episode spec: `remotion-production/01_EPISODE-SPEC_<slug>.md`
- Mỗi tập 1 thread chat riêng với Claude: đặt tên `PBR Ep<NN> – <Title>`
- Spec series (00/02) dùng chung mọi tập; chỉ viết mới file 01 + kịch bản FINAL cho tập mới

## 6. Vai trò (khóa)

- **Muse — phân tích & lập kế hoạch:** chủ đề, episode spec, spec kỹ thuật. Không duyệt kịch bản, không dựng video.
- **Claude Opus 5.5 — sản xuất:** chủ đề, kịch bản v1/v2, VO, storyboard, dựng Remotion, render, báo cáo QA. Không tự ý đổi spec, không qua cổng khi chưa duyệt.
- **Lucas — đạo diễn:** duyệt ở 5 cổng (kịch bản → VO → storyboard → test → final), quyết định thay đổi production-wide, đăng bài.

## 7. Lịch sử thay đổi quy trình

| Ngày | Thay đổi | Quyết định bởi |
|------|----------|----------------|
| 2026-10-06 | Khóa v1: pipeline 8 GĐ, 4 cổng, 9 invariants | Lucas |
| 2026-10-06 | Thêm cổng QA kịch bản: Muse kiểm script v2 (10 gates + kiểm toán số) trước khi Lucas duyệt FINAL | Lucas |
| 2026-10-06 | Bỏ Muse QA khỏi cổng kịch bản; thống nhất **5 cổng** theo thứ tự Kịch bản → VO → Storyboard → Test → Final (huong-dan-ban-giao đồng bộ theo) | Lucas |
| 2026-10-06 | Chốt look series **C — sổ kẻ ô** (mực navy, highlight vàng, giấy note) + **camera push-in** của A; nhân vật nét chi tiết hơn. So sánh A/B/C: `episodes/ep01-buy-their-tools/test/style-compare-A-B-C.jpg` | Lucas |
| 2026-10-06 | **Đổi look series sang "Receipt × Paper"** (hướng 1 + 3), thay whiteboard/sổ kẻ ô. So sánh: `episodes/ep01-buy-their-tools/test/new-style-compare-1-2-3.jpg`. Nhạc nền dùng Lyria | Lucas |
| 2026-10-06 | Font **Bricolage Grotesque** thay Fredoka/Archivo Black; thêm **phụ đề** bắt buộc (cụm ≤ 30 ký tự, số viết bằng số). So sánh: `episodes/ep01-buy-their-tools/test/font-compare-*.jpg` | Lucas |
| 2026-10-07 | **Thư viện 4 phong cách** A/B/C/D thay một look duy nhất; Claude chọn phong cách theo kịch bản (hoặc đề xuất phong cách mới) ở bước spec, Lucas duyệt ở Cổng 3. Xem `03_series-lock/03_STYLE-LIBRARY.md` | Lucas |
| 2026-10-07 | Bỏ mọi chuyển động máy quay (kể cả push-in); thêm hệ diễn xuất con rối, chữ đập (slam), tiền bay, giấy "thở", thẻ đung đưa, dòng in lóe vàng | Lucas |
