# HƯỚNG DẪN BÀN GIAO CHO CLAUDE SẢN XUẤT
*Dành cho Lucas. Tập đầu: "How Poor vs Rich People Buy Their Tools" (kịch bản FINAL đã lock). Giữ 1 thread chat riêng với Claude cho mỗi tập.*

## 1. Bản đồ pipeline

```
[Muse] chủ đề → episode spec
        ↓
[Claude] kịch bản v1 → v2 ──► CỔNG 1 · KỊCH BẢN (Lucas)
        ↓
[Claude] VO ─────────────────► CỔNG 2 · VO
        ↓
[Claude] storyboard ─────────► CỔNG 3 · STORYBOARD
        ↓
[Claude] dựng + test scene 3 ► CỔNG 4 · TEST
        ↓
[Claude] render full + QA ───► CỔNG 5 · FINAL
        ↓
[Lucas] đăng page Poor vs Rich Daily
```

Quy tắc vàng: **Claude không được tự ý qua cổng.** Mỗi cổng cần câu "Approved, proceed" rõ ràng từ bạn. Không có câu đó = Claude phải chờ.

## 2. Gói file bàn giao (đính kèm 1 lần ở kickoff)

| File | Nội dung | Vị trí |
|------|----------|--------|
| 03_CLAUDE-MESSAGE.md | Message paste-ready (copy phần dưới dấu ---) | remotion-production/ |
| 00_SERIES-BIBLE.md | Style series khóa cứng | remotion-production/ |
| 01_EPISODE-SPEC_buy-their-tools.md | Scene manifest 8 scenes | remotion-production/ |
| 02_REMOTION-TECH-SPEC.md | Kiến trúc component, QA checklist | remotion-production/ |
| kich-ban-buy-their-tools-FINAL.md | Kịch bản voiceover đã lock | virtuosos-threads/ |

## 3. Các bước chi tiết (5 cổng, đúng thứ tự)

### Bước 1 — Kickoff (bạn làm)
1. Mở thread chat mới với Claude, đặt tên ví dụ "PBR Ep01 – Buy Their Tools".
2. Gửi gói file (xem `README.md` ở thư mục series để biết thứ tự).
3. Chờ Claude xác nhận đã đọc + hỏi (nếu có).

### Cổng 1 — Kịch bản
- **Claude trả:** kịch bản v2 (EN + VN + kiểm toán số), số từ, thời lượng ước tính.
- **Bạn kiểm:** hook 3 dòng, mirror giữ nguyên, số liệu khớp, câu chốt 3 lớp + loop seam nối về hook (từ Ep04).
- Duyệt → bản đó thành FINAL, không đổi một chữ nào nữa.

### Cổng 2 — Voiceover
- **Claude trả:** `vo.mp3` + `vo-timestamps.md` (giờ bắt đầu/kết thúc từng câu).
- **Bạn kiểm:** khớp 100% từng từ với FINAL? Nhấn đúng con số? Nhịp ~150 từ/phút?

### Cổng 3 — Storyboard
- **Claude trả:** `storyboard.md` — từng scene, timecode thật theo VO, hình + chữ xuất hiện lúc nào.
- **Bạn kiểm:** đủ scene? Chữ/số đúng FINAL? Chi tiết đắt của tập có trong plan?
- Chưa duyệt = Claude chưa được viết code.

### Cổng 4 — Test 1 scene
- **Claude trả:** frames/video thử của scene bảng phép tính.
- **Bạn kiểm:** style whiteboard đúng? Chữ viết tay? Màu nhân vật đúng? Số hiện từng bước? Chữ đồng bộ VO?
- Chưa duyệt = Claude chưa được render full.

### Cổng 5 — Final
- **Claude trả:** MP4 + `caption.txt` + báo cáo QA pass/fail từng mục (mục 6).
- Có mục nào fail → bắt sửa, không nhận "đại khái được".

### Bước cuối — Đăng bài
- Caption lấy trong `caption.txt` (luôn là một câu hỏi).
- Page: Poor vs Rich Daily. Giờ đăng: theo khung giờ bạn đã định cho page.

## 4. Message mẫu paste-ready cho từng cổng (tiếng Anh, copy nguyên)

**Cổng 1 — kịch bản:**
> Script approved, proceed to the episode spec and voiceover.

**Cổng 2 — VO:**
> VO approved, proceed to the storyboard.

**Cổng 3 — storyboard:**
> Storyboard approved, proceed to build and render the math-board test scene.

**Cổng 4 — test scene:**
> Test scene approved. Render the full video, run the complete QA checklist, and report pass/fail per item before delivering.

**Cổng 5 — final:**
> Final approved. Deliver the MP4 and caption.txt.

## 5. Khi Claude làm sai — mẫu feedback (điền chỗ [...])

- **Sai style:** `This doesn't match the series bible: [mô tả]. Fix to [giá trị đúng trong bible].`
- **Sai số:** `The on-screen number is [sai]; the FINAL script says [đúng]. Fix it.`
- **Lệch chữ-VO:** `The text "[chữ]" appears [X]s before/after its VO line at [timestamp]. Re-sync to within ±0.2s.`
- **Tự ý qua cổng:** `You skipped the [script/VO/storyboard/test-scene] approval gate. Stop, present it now, and wait for my approval.`
- **Tự sửa kịch bản:** `The voiceover text is locked. Revert "[câu Claude tự sửa]" to the FINAL script version: "[câu gốc]".`

## 6. Checklist nhận video final (tất cả phải pass)

- [ ] VO khớp kịch bản FINAL từng từ
- [ ] Mọi số trên màn hình có trong FINAL và đúng (Ep01: $400, $450, $150, $300, $60, $40, −$40, $200, $50, 22%)
- [ ] Người nghèo luôn đỏ, người giàu luôn xanh, mọi scene
- [ ] Không chữ nào bị cắt khỏi khung 1080×1920
- [ ] Chữ không hiện sớm hơn VO quá 0.2s
- [ ] Phép tính hiện từng bước, không dump cả phương trình
- [ ] Âm thanh đúng quyết định hiện hành (VO-only khi nhạc còn parked); nếu có nhạc thì không lấn VO
- [ ] Loudness −14 LUFS
- [ ] Phụ đề có mặt suốt VO, khớp lời FINAL (số viết bằng số), không che nội dung chính
- [ ] Có caption.txt đúng nội dung (một câu hỏi)
- [ ] **Vùng an toàn:** ảnh QA có lớp phủ `safeGuide` — không chữ/số/mặt nào chạm vùng đỏ (trên 220 · dưới 480 · phải 140 · trái 60)
- [ ] **Không máy quay giả:** không zoom chuyển cảnh, không rung/lắc
- [ ] **Ít chữ:** không câu VO nào lặp thành dải chữ; khối chữ ≤ 5 từ; ≤ 2 khối cùng lúc; phụ đề 1–3 từ
- [ ] **SFX** chỉ từ `public/sfx/` (thật, không hoạt hình), không lấn VO
- [ ] **Cổng nghe** (bắt buộc từ 2026-11-08, khi tập có SFX): `npm run listen -- <id> <mp4> --out NGHE.md`; mọi dòng "Cần nghe" có quyết định

## 7. Quyết định đã chốt / còn mở

- **Nhạc nền: TẠM DỪNG** (quyết định 2026-10-06). Video hiện tại chỉ có VO, không nhạc, không SFX. Spec nhạc (04_MUSIC-DIRECTION.md) giữ nguyên ở trạng thái parked để bổ sung sau — khi đó cập nhật lại 00/03 và checklist.
- **Tập 2 trở đi:** lặp lại đúng quy trình này, chỉ thay file 01_EPISODE-SPEC và kịch bản FINAL của tập mới. Không cần gửi lại 00/02 nếu Claude còn nhớ trong cùng project.
