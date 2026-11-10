# Đề xuất nâng cấp quy trình

> **Trạng thái (2026-11-01):** Lucas duyệt. **Nhóm A (A1–A11) đã áp dụng**: `Mapped Journeys/episodes/_template/checks.md` + `progress.md` + README; skill `review-loop` (critic mắt mới, 3 lỗi tệ nhất, sửa 4 trường, cạnh sửa / học, phone test bằng `--size 360` có sẵn); `AGENTS.md` (luật short-form 5 "AI slop", mục "Episode workflow": effort, handoff, review); `QUY-TRINH-PHAN-TICH.md` (nhãn ĐO / ƯỚC / QUYẾT); Bible MJ §9 + §12. A9 không ghi vào `Style Library/README.md` vì file đó đang có thay đổi chưa lưu của phiên style K; luật nằm trong `AGENTS.md` (áp cho mọi style). **Nhóm B**: thử trên tập Mapped Journeys kế tiếp (theo §5). **Lucas duyệt thêm 2026-11-01:** nhóm B, nhóm C và **D-SFX = phương án (b)** (thử 1 tập theo luật "ít tiếng" rồi so retention). Mục nào cần **cài công cụ bên ngoài** (C1 Blender, C2 earshot, …) Luis đề xuất đúng lúc cần, Lucas duyệt từng lần.

*2026-11-01, Luis. Nguồn: (1) ảnh "Karpathy-inspired graph prompt" Lucas gửi (tác giả **@hanakoxbt**, lấy ý từ repo `github.com/karpathy/autoresearch` và trang `agent-layers.vercel.app`; chân ảnh ghi rõ **Karpathy không viết, không xác nhận**); (2) bài X của @Y0urDumble (27/10/2026, 98K view, 640 bookmark) dẫn tới khoá "How to build a 2.5D motion studio with Opus 5.5". **Đọc trọn bài bằng trình duyệt trong app** (x.com, 2026-11-01; 98,1K view, 216 like, 640 bookmark); phần chi tiết mới so với lần đọc đầu nằm ở §2b và các đề xuất A7–A11, B7–B8.*

**Lưu ý trước khi đọc:**
- Con số "27M view trong 8 ngày" (kênh Ricks Clips, video bình đồng địa chấn của Trương Hành) là **lời tác giả bài X**, chưa kiểm. Tác giả cũng nói **không biết** Ricks Clips làm thế nào; khoá học là cách *của tác giả* để làm lại định dạng đó.
- Chất lượng trong các video đó đến từ **quy trình + công cụ** (Blender 3D, ánh sáng, review loop), không phải chỉ từ model. Dự án mình đã có khá nhiều phần của quy trình này; bảng §3 chỉ ra phần nào có, phần nào thiếu.

---

## 1. Ảnh "graph prompt": liệt kê đủ các phần

Ý chính: **chia việc lớn thành một đồ thị các nút nhỏ có giới hạn** thay vì một phiên dài; mỗi nút có đầu vào, đầu ra và một bài kiểm; giữa các nút có "cổng" chỉ mở khi có bằng chứng.

| # | Phần | Nội dung (diễn giải) |
|---|---|---|
| 1 | **goal** | Làm `{{TASK}}` thành đồ thị các nút có giới hạn. Để lại: kết quả dùng được, báo cáo kiểm chứng, `graph.md` để phiên khác chạy lại / mở rộng. Định nghĩa "xong" **trước** khi bắt đầu. Dừng khi mọi nút qua kiểm hoặc chạm giới hạn đã thoả thuận |
| 2 | **role** | Agent chính thiết kế, chạy, bảo trì đồ thị. Đọc luật dự án và hiện trạng trước khi sửa. Tự lên kế hoạch và gộp kết quả; giao việc có giới hạn cho subagent. Ghi lại quyết định làm đổi đồ thị |
| 3 | **principles** (từ autoresearch) | Có **mốc nền (baseline)** trước khi đổi hệ thống · mỗi nút một phạm vi rõ + một **bộ chấm cố định** · **đổi một thứ, đo, giữ cái tốt**, ghi cả lần thất bại · ít nút hơn khi kết quả tương đương |
| 4 | **inputs** | Task · đầu ra + đường dẫn · tiêu chí chấp nhận · nguồn · phạm vi được sửa · giới hạn chạy. Điền đủ trước khi bắt đầu; thiếu chi tiết làm đổi kết quả thì **hỏi một câu** |
| 5 | **layer 1 · split** | Chia task thành nút trước khi làm. Nút = một đầu vào, một đầu ra, một bài kiểm. Chia theo **thứ nút phải đọc**, không theo thư mục. Chỉ nối cạnh khi nút này dùng đầu ra của nút kia; nút không nối = chạy song song. Ghi nút, cạnh, kiểm vào `graph.md`, **dừng chờ duyệt** |
| 6 | **layer 2 · nodes** | Mỗi nút chạy như một subagent riêng, chỉ mang ngữ cảnh nó cần: nhận spec + đầu vào + bài kiểm → làm sản phẩm của nút đó → tự kiểm trên file đã lưu → trả về đường dẫn, kết luận, bằng chứng. Spec nút dùng lại được cho bộ nguồn mới |
| 7 | **layer 3 · code nodes** | Bước có **đúng một đáp án** (gộp, sắp xếp, bỏ trùng, so sánh) thì viết bằng **code**, không gọi model; model chỉ dùng cho phán đoán. Liệt kê nút code trong `graph.md`. Thiếu công cụ thì nêu tên chỗ tắc và vẫn làm các nút còn làm được |
| 8 | **layer 4 · permissions** | Kiểm quyền trước khi chạy; chỉ sửa trong phạm vi; dùng luật công cụ / sandbox khi cần ép (lời văn không phải rào chắn). **Hỏi trước khi đăng, gửi, tiêu tiền.** Không cho hai nút sửa cùng một file. Giữ bản khôi phục được trước khi gộp rủi ro |
| 9 | **layer 5 · gates** | Mỗi cạnh mang việc rủi ro có một cổng, mở bằng **bằng chứng**: kiểm tự động trước, rồi báo cáo của nút, cuối cùng mới tới độ tự tin của model. Lưu `checks.md`: `nút | yêu cầu | kết luận | bằng chứng` (pass / fail / unresolved, kèm đường dẫn hoặc output thật). Thiếu bằng chứng thì để lộ ra, không giấu |
| 10 | **layer 6 · return paths** | **Cạnh sửa:** cổng trượt → trả về đúng nút đã làm, kèm lý do, bằng chứng, phạm vi "chỉ sửa nút này"; tối đa **3 lần**. **Cạnh học:** kết quả được chấp nhận → ghi **luật** rút ra vào `graph.md` để lần sau bắt đầu từ đó |
| 11 | **layer 7 · completion** | Trước khi chạy, viết checklist hoàn thành từ tiêu chí; mỗi mục trỏ tới bằng chứng quan sát được: mọi đầu ra tồn tại và mở được · mọi cổng chạy trên bản đã lưu · lỗi đã sửa hoặc báo rõ · `graph.md` khớp các nút đã chạy. Dừng giữa chừng thì trả trạng thái dở dang + đúng các nút còn lại |
| 12 | **execution loop** | Đọc `graph.md` → chọn nút sẵn sàng → chạy song song nút độc lập → mỗi đầu ra qua cổng → trả lại **đơn vị** hỏng, không trả cả lô → gộp bằng code → lặp tới khi xong / tắc / hết giới hạn. **Không hạ cổng để được qua** |
| 13 | **handoff** | Sau mỗi chặng cập nhật `progress.md`: nút xong / đang chạy / tắc · đường dẫn đầu ra · quyết định đã đổi và vì sao · vấn đề mở · bước tiếp. Phiên sau đọc `graph.md` + `progress.md` rồi làm tiếp |
| 14 | **delivery** | Trả đầu ra + `graph.md` + `checks.md` + `progress.md`. Nói rõ đã kiểm gì, qua gì, còn gì. Lưu đồ thị làm template sau khi duyệt. Chỉ báo mức dùng (token) **đo được**, không suy ra "tiết kiệm" từ prompt |

## 2. Bài X: khoá "2.5D motion studio with Opus 5.5" (14 bước)

Định dạng họ nhắm: nhân vật 2D phẳng đứng trong **bối cảnh 3D có ánh sáng**, một giọng người thật, chuyện có thật, 9:16, 30 fps, ~65 s.

| # | Bước | Nội dung |
|---|---|---|
| 1 | Bóc tách video mẫu | 1 khung / giây bằng ffmpeg → Claude viết bản bóc tách; **cấm chép** nhân vật, thiết kế, kịch bản, cấu trúc; kết bằng **"5 quyết định cho tập gốc của mình"**; ước lượng vị trí của model chỉ gần đúng, phải đối chiếu khung |
| 2 | Chỉ cài thứ cần | `mcp-for-blender` (Blender 4.2+, uv), LottieFiles `motion-design-skill`, `remotion-dev/skills`, `openai-whisper`; **đọc repo trước khi cài** |
| 3 | Luật nhà trong `CLAUDE.md` | mọi phiên bắt đầu từ cùng một định dạng |
| 4 | Chuyện trước | Claude tìm **5 chuyện thật có nguồn** → chọn 1 → kịch bản 150–170 từ + `sources.md`; **dừng chờ duyệt mỗi bước** |
| 5 | `shotlist.md` | một ý một shot, 3–5 bối cảnh dùng lại; thời gian tính bằng **frame** theo vật lý (vd. vật rơi ~30 cm ≈ 7–8 frame ở 30 fps) |
| 6 | Bối cảnh Blender qua MCP | 3 lượt: dựng khối → ánh sáng → bày đồ; sau mỗi lượt dùng công cụ "look" của MCP để nhìn; HDRI / texture Poly Haven (CC0) |
| 7 | Vật chính (hero prop) | mô hình 3D thật + **look sheet 6 góc** để nhất quán |
| 8 | Nhân vật | tranh 2D phẳng dán lên mặt phẳng trong Blender (shader Emit / Shadeless, bóng tiếp đất); mặt là các phần SVG thay được |
| 9 | Diễn | mỗi shot một beat: **suy nghĩ → chuẩn bị → hành động → giữ**; animate theo beat, không nhún nhảy vô cớ |
| 10 | Giọng | **tự thu giọng người**, Whisper lấy mốc từng từ, phụ đề làm trong Remotion |
| 11 | Âm thanh | **earshot** MCP (chạy CPU) để "nghe" bản mix và đối chiếu cue với khung hình |
| 12 | Review loop | contact sheet (fps=1, 240 px, lưới 8×9) + **sheet cỡ điện thoại**; prompt **"đạo diễn hoạt hình khó tính nhất"** liệt kê lỗi theo timestamp; sửa **3 lỗi tệ nhất**; render lại **chỉ đoạn frame** đó; cuối cùng ffprobe kiểm 1080×1920, 30 fps, đúng thời lượng |
| 13 | Đóng gói thành skill | `cartoon-studio` / `/motion-studio`; làm một tập từ đầu tới cuối và **bấm giờ** |
| 14 | Chính sách | chép **ngữ pháp**, không chép nội dung; tập gốc (chính sách kiếm tiền YouTube); gắn nhãn nội dung AI trông như thật; giữ `sources.md`. Effort: **xhigh cho tập mới, medium cho sửa / render lại** |

**Tài nguyên bài X dẫn** (chưa đọc, chưa kiểm giấy phép): `ahujasid/mcp-for-blender` · `angrypenguinpng/blender-claymation-skill` · `LottieFiles/motion-design-skill` (đã có) · `greensock/gsap-skills` · `remotion-dev/skills` (đã có) · `heygen-com/hyperframes` · `JohnHeibel/ClaudeAnimationBase` · `tuzhechen2005/opus-video-skills` · `Leonxlnx/earshot` · `openai/whisper` (đã có bản faster-whisper) · `lemomo-ai/lemo-opuscar` ("59 phong cách phim làm bằng code") · `zhuyansen/awesome-claude-video-skills` (180 skill video có chấm điểm) · Poly Haven (CC0).

## 2b. Chi tiết thêm khi đọc trọn bài

| Phần | Chi tiết (diễn giải) |
|---|---|
| **Giải phẫu video 27M** | 65 s; **cắt cảnh ~2 s một lần**; máy chỉ đẩy chậm / dolly có lý do, không trôi ngẫu nhiên; **phụ đề 1–2 từ**, trắng đậm, giữa-thấp; hook là **câu hỏi trong tiêu đề** (why / how / what really happened) |
| **Vì sao không bị coi là "AI slop"** (5 điểm) | nhân vật cố ý đơn giản (không ai đòi giống thật) · bối cảnh cố ý giàu (ánh sáng ấm, chất liệu thật, độ sâu) · **mỗi shot có lý do: shot mới rơi vào ý mới của kịch bản, không theo đồng hồ** · một giọng người · chuyện có thật, kiểm được |
| **Prompt bóc tách mẫu** | mỗi giá trị gắn nhãn **MEASURED** (đọc từ khung) / **ESTIMATED** (ước bằng mắt) / **DECISION** (lựa chọn của mình); chỗ không chắc phải **nêu đúng frame cần kiểm**; kết bằng 5 quyết định |
| **Luật nhà, mục "Banned"** | tiêu đề căn giữa trên nền gradient · nhãn ở góc, timecode, viền khung · **mọi thứ đều fade-in** · **whoosh ở mọi cú cắt** · bất kỳ con số / khẳng định nào trên màn hình không có trong `sources.md` |
| **Luật nhà, "Review trước khi tôi thấy"** | contact sheet 1 khung / giây → nhìn → liệt kê lỗi kèm timestamp → sửa 3 lỗi tệ nhất → lặp |
| **Kịch bản** | 150–170 từ cho 65 s; mẫu tiêu đề "The [vật] That [làm điều bất ngờ]" / "Why [thứ] Always [làm X]"; mỗi chuyện phải là thứ **cả đứa 12 tuổi lẫn người 50 tuổi đều kể lại**; **twist quanh giây 40**; câu cuối trả hook; tự mở nguồn kiểm, "bước duy nhất không bao giờ giao hết" |
| **Shot list** | mỗi shot 1,5–3 s, ghi: id, chữ trong lời, thời lượng, SET, CAMERA (+ lý do), CHARACTER (tư thế, biểu cảm), PROP, SOUND (chỉ khi có gì vật lý xảy ra); 3–5 bối cảnh / tập |
| **Beat bằng frame toàn cục** | bảng `frame | giây | sự kiện` (vd. 1254 bóng rơi, 1262 chạm, tiếng va **đúng frame này**, 1266 cắt); mọi chỉnh sửa thành một con số ("dời cú chạm sang 1260") nên agent không hiểu sai; thời gian theo vật lý (rơi 30 cm ≈ 7–8 frame, chậm hơn là "lơ lửng") |
| **Prompt sửa 4 trường** | **WHERE** (dải frame) · **PROBLEM** · **CHANGE** (chỉ thứ được đổi) · **KEEP** (mọi thứ phải giữ nguyên); rồi chụp still ở các frame then chốt + kiểm khung trung gian có giật không |
| **Thứ tự sửa** | sai / thiếu → dễ đọc → thời điểm → chi tiết hình |
| **Phone test** | `fps=1/3, scale=360, tile=6x4`: xem chữ còn đọc được ở cỡ điện thoại |
| **Critic** | "You did not make this. You are the harshest animation director I know." + câu hỏi cụ thể (bóng tiếp đất, shot > 3 s không ý mới, phụ đề đọc được ở cỡ điện thoại, khẳng định thiếu trong `sources.md`) |
| **Âm thanh** | giọng luôn trên nhạc · **chỉ có tiếng khi có gì vật lý xảy ra** · **không whoosh quá 2 lần** · nhạc kết (resolve) đúng khung cuối · **cue list cùng số frame với hình** · file SFX có đoạn vào mềm thì dời clip để **đỉnh tiếng** rơi đúng frame |
| **Tập đầu tiên** | đừng lên kế hoạch kênh, làm 1 tập trọn rồi quyết · **bấm giờ từng khâu** (chuyện, bối cảnh, nhân vật, animate, giọng, âm thanh, review) · giữ mọi giấy tờ trong một thư mục tập (thành template tập 2) · xem như người xem: tốc độ thường, trên điện thoại, có tiếng, rồi **nhắm mắt nghe một lần** · sau khi đăng học từ **biểu đồ retention** (giây người xem bỏ đi), không từ số view |
| **Chính sách** | lấy ngữ pháp, không lấy nội dung · tập gốc, không template hàng loạt (chính sách "nội dung lặp lại" của YouTube) · nhãn AI cho thứ có thể bị nhầm là cảnh thật; hoạt hình rõ ràng thường không cần · một ngày sai trong comment mất uy tín hơn mọi render |

## 3. Dự án mình đang có gì / thiếu gì

| Ý | Dự án mình hiện tại | Thiếu |
|---|---|---|
| Bóc tách video mẫu 1 fps + "N quyết định" | **Có**: `QUY-TRINH-PHAN-TICH.md`, `sheet:j --video`, danh sách quyết định D# (vd. History Maps Lore) | — |
| Luật nhà trong CLAUDE.md | **Có**: `AGENTS.md`, Channel Bible, README từng style | — |
| Chuyện trước, 5 chuyện có nguồn, dừng duyệt | **Có**: Cổng 1–2 Bible MJ (3–5 chủ đề, bảng kiểm chứng trong kịch bản FINAL) | `sources.md` riêng mỗi tập (hiện nằm lẫn trong kịch bản) |
| Mốc từ giọng (Whisper) | **Có**: `episode.mjs` + `words.py`, mọi mốc hình gắn vào chữ | — |
| Contact sheet + review loop | **Có**: skill `review-loop`, `sheet:j`, checklist + bài học E1–E7 | **critic mắt mới** (subagent không biết quá trình làm), sheet cỡ điện thoại, "sửa 3 lỗi tệ nhất" mỗi vòng, render lại theo đoạn |
| Kiểm cuối bằng ffprobe / LUFS | **Có**: `render:j` tự in kích thước, frame, LUFS, true peak | — |
| Đóng gói thành skill | Một phần: thư mục `episodes/_template` + nhiều script | **một skill chạy cả tập** (vd. `/mj-episode`) |
| `graph.md` (nút, cạnh, song song) | **Không**: 5 cổng chạy tuần tự trong một phiên dài | đồ thị nút cho mỗi tập |
| `checks.md` (bằng chứng từng cổng) | Một phần: QA rải trong chat, kịch bản, `03_DANH-GIA-NANG-CAP.md` | bảng `nút | yêu cầu | kết luận | bằng chứng` mỗi tập |
| `progress.md` (bàn giao giữa phiên) | Một phần: `04_BAN-GIAO.md` ở cấp kênh | file tiến độ **mỗi tập** |
| Nút code cho bước có một đáp án | **Có nhiều**: `make-plates.py`, `ne-regions.py`, `words.py`, `episode.mjs`, `render:j`, `npm run lint` | **script kiểm tự động**: đếm từ chữ trên màn hình (≤ 5), wpm, độ dài, mọi số trong VO có dòng trong bảng kiểm chứng, nhãn trong vùng an toàn |
| Cạnh học (ghi luật vào hệ thống) | **Có**: bài học E1–E7 ghi vào `review-loop`, nhật ký quyết định Bible §12 | quy ước cố định: lỗi lặp 2 lần → thành dòng checklist |
| Baseline + đổi một thứ, đo | Một phần: Bible §10 (24 h / 7 / 30 ngày) | **chưa đăng tập nào**, chưa có baseline; chưa đo thời gian / token mỗi tập |
| Effort theo loại việc | Không có quy ước | xhigh tập mới, medium sửa |
| Bối cảnh 3D (Blender MCP) | **Không** | liên quan trực tiếp D7 (diorama của History Maps Lore) |
| "Nghe" bản mix (earshot) | **Không**: Luis không nghe được; báo cáo nào cũng ghi "cần Lucas nghe" | công cụ kiểm âm thanh |
| Look sheet nhân vật / vật | Không (ảnh AI tạo từng tấm) | bộ ảnh tham chiếu để ảnh AI nhất quán |
| Diễn theo beat (suy nghĩ → hành động → giữ) | Không cần cho J; hợp **style K** (chibi, phiên khác đang làm) | — |
| Giọng người thật | Dùng Gemini TTS (Charon) | tuỳ Lucas |

## 4. Đề xuất áp dụng (Lucas duyệt từng mục)

Xếp theo **tác động / công sức**. Cột "Duyệt" để Lucas đánh dấu ✓ / ✗ / sửa.

### Nhóm A — rẻ, tác động cao, làm được ngay

| # | Đề xuất | Làm thế nào | Công sức | Duyệt |
|---|---|---|---|---|
| A1 | **`checks.md` mỗi tập** | bảng `cổng / nút | yêu cầu | pass-fail-unresolved | bằng chứng (đường dẫn, output lệnh)`; tập không được gọi "xong" khi còn dòng fail / unresolved không báo | thêm vào `episodes/_template`, sửa Bible §9 | |
| A2 | **`progress.md` mỗi tập** | xong / đang làm / tắc · file hiện hành · quyết định đã đổi · vấn đề mở · bước tiếp; phiên mới đọc file này trước | template + 1 dòng trong AGENTS.md | |
| A3 | **Critic mắt mới** trong review loop | sau mỗi vòng sheet, một subagent **không có ngữ cảnh làm** (chỉ nhận sheet + luật) đóng vai "biên tập viên khó tính nhất", liệt kê lỗi theo timestamp; Luis sửa **3 lỗi tệ nhất** rồi chụp lại | sửa skill `review-loop` | |
| A4 | **Sheet cỡ điện thoại** | thêm cờ `--phone` cho `sheet:j` (mỗi khung ~360 px như xem trên máy) để kiểm chữ còn đọc được | nhỏ | |
| A5 | **Quy ước cạnh sửa / cạnh học** | một cổng trượt tối đa 3 lần rồi báo Lucas; lỗi lặp lại 2 tập → thành dòng checklist cố định | ghi vào `review-loop` + Bible | |
| A6 | **Quy ước effort** | tập mới / kịch bản / phân tích: xhigh; sửa nhỏ, render lại: medium | ghi vào AGENTS.md | |
| A7 | **Nhãn MEASURED / ESTIMATED / DECISION** trong bóc tách mẫu | thêm vào `QUY-TRINH-PHAN-TICH.md` mục 1.2–1.3: mỗi số đo ghi rõ đo bằng lệnh, ước bằng mắt hay là quyết định của mình; chỗ ước phải ghi frame cần kiểm | nhỏ | |
| A8 | **Prompt sửa 4 trường** (WHERE / PROBLEM / CHANGE / KEEP) | mọi lệnh sửa trong review loop viết theo mẫu này, WHERE là dải frame; thứ tự sửa: sai → dễ đọc → thời điểm → chi tiết | sửa `review-loop` | |
| A9 | **Mục "Banned" trong luật kênh** | bổ sung vào Bible / README style những tật "AI slop": mọi thứ đều fade-in, cùng một kiểu vào cho mọi phần tử, chữ / số trên màn hình không có trong bảng nguồn | nhỏ | |
| A10 | **Bấm giờ từng khâu** của mỗi tập | thêm bảng giờ (nguồn, kịch bản, giọng, nền, dựng, review, render) vào `progress.md`; đây là baseline B5 | nhỏ | |
| A11 | **Xem như người xem** trước khi duyệt final | Lucas xem trên điện thoại, có tiếng, rồi nghe một lần không nhìn; ghi nhận xét vào `checks.md` (Luis không nghe được, đây là cổng của Lucas) | quy ước | |

### Nhóm B — vừa, nâng chất quy trình

| # | Đề xuất | Làm thế nào | Công sức | Duyệt |
|---|---|---|---|---|
| B1 | **`graph.md` mỗi tập** | nút mẫu cho một tập MJ: nguồn → kịch bản → (giọng ∥ nền bản đồ ∥ tô vùng ∥ tranh + prompt ảnh AI ∥ SFX) → dựng cảnh → review → render → gói đăng; ghi rõ nút nào song song, nút nào là code; Lucas duyệt đồ thị ở Cổng 2 | template + chạy thử 1 tập | |
| B2 | **Script `check-episode`** (nút code) | tự kiểm: chữ trên màn hình ≤ 5 từ, wpm / thời lượng trong preset, mỗi con số trong VO có dòng kiểm chứng, end-of-line ≤ 0,3 s nếu loop, LUFS / kích thước; ghi kết quả thẳng vào `checks.md` | trung bình | |
| B3 | **`sources.md` + `shotlist.md` tách riêng** | nguồn (ai, trang, ngày truy cập) và danh sách shot (shot, chữ trong VO, frame vào–ra, tài sản) thành file riêng, dùng được cho kiểm tự động | nhỏ | |
| B4 | **Skill `/mj-episode`** | đóng gói Cổng 1–5 + các template + cổng duyệt thành một skill; làm 1 tập đầu–cuối và **bấm giờ / đo token** (chỉ số đo được) làm baseline | trung bình | |
| B5 | **Baseline trước khi đổi** | trước mỗi nâng cấp kit / luật: ghi số đo hiện tại (thời gian làm tập, số vòng review, lỗi tìm được, sau này là % xem trung bình) rồi chỉ đổi **một thứ** mỗi tập | quy ước | |
| B6 | **Không hai phiên sửa cùng file** | ghi rõ trong AGENTS.md (đã là luật miệng giữa các phiên); phiên phụ làm trong worktree khi chạm code chung | nhỏ | |
| B7 | **Cue list âm thanh theo frame** | bảng `sự kiện | frame | tiếng | ghi chú` cùng số frame với hình; đo **đỉnh tiếng** của mỗi file SFX (ffmpeg) và tự dời `<Sfx at>` để đỉnh rơi đúng frame (nút code) | trung bình | |
| B8 | **Học từ retention sau khi đăng** | Bible §10 thêm: chụp biểu đồ retention 7 ngày, ghi giây người xem rời nhiều nhất và shot ở giây đó; tập sau sửa đúng loại shot đó | quy ước | |

**Một chỗ mâu thuẫn cần Lucas chốt (D-SFX):** bài X khuyên **chỉ có tiếng khi có gì vật lý xảy ra, whoosh không quá 2 lần / tập**. Bible MJ §6 (2026-10-30) lại chọn **mỗi sự kiện hình 1 tiếng nhỏ, ~20–30 tiếng / phút** theo số đo đối thủ của J. Phương án: (a) giữ luật MJ hiện tại; (b) **thử 1 tập theo luật "ít tiếng" của bài X rồi so retention** (Luis nghiêng về b, vì đây đúng là "đổi một thứ, đo" ở mục B5); (c) đổi hẳn.

### Nhóm C — nặng / thử nghiệm (cần thử trước khi tin)

| # | Đề xuất | Làm thế nào | Rủi ro | Duyệt |
|---|---|---|---|---|
| C1 | **Blender + MCP cho bối cảnh 3D** | thử dựng 1 diorama (vd. pháo đài) cho style L / D7: Blender render PNG nhiều lớp → Remotion ghép + parallax | phải cài Blender + uv + MCP bên thứ ba; đọc code `mcp-for-blender` trước; render chậm | |
| C2 | **earshot để "nghe" bản mix** | thử trên 1 bản render: phát hiện SFX trễ / lấn giọng / chỗ im | công cụ mới, chưa rõ độ tin; đọc repo + giấy phép trước | |
| C3 | **Look sheet cho ảnh AI** | mỗi nhân vật / vật lặp lại có 1 bộ ảnh tham chiếu 4–6 góc trong `image-prompts.md` để Lucas tạo ảnh nhất quán | tốn lượt tạo ảnh | |
| C4 | **Kéo tài nguyên về `reference/` để học** | clone nông `lemo-opuscar`, `awesome-claude-video-skills`, `opus-video-skills`, `ClaudeAnimationBase`, `blender-claymation-skill`, `earshot`; đọc giấy phép, ghi bảng "dùng được / cấm" như `reference/README.md` đã làm; **không cài gì** | chỉ tốn thời gian đọc | |
| C5 | **Giọng người thật** | Lucas tự thu (hoặc thuê) thay Gemini TTS cho kênh chính; pipeline mốc từ giữ nguyên (Whisper) | thời gian của Lucas | |

### Không đề xuất

- **GSAP skill**: GSAP chạy theo thời gian thực của trình duyệt, trái luật "chỉ animate theo frame" của Remotion.
- **HyperFrames (HeyGen)**: thay luôn bộ render Remotion; không đáng đổi khi kit đã chạy.
- **Chạy cả đồ thị nhiều subagent song song cho mọi việc nhỏ**: mỗi subagent bắt đầu lạnh, tốn token; chỉ tách nút khi nút đó đọc nguồn khác hẳn (đúng như layer 1 "chia theo thứ nút phải đọc").

## 5. Thứ tự Luis đề xuất nếu Lucas duyệt

1. A1–A11 cùng lúc (sửa template + `review-loop` + `QUY-TRINH-PHAN-TICH.md` + AGENTS.md, ~1 phiên).
2. B1 + B3 + B2 thử trên **tập kế tiếp** của Mapped Journeys; so với Ep04 (baseline B5).
3. B4 đóng gói khi tập đó qua.
4. C4 (đọc tài nguyên) bất cứ lúc nào; C1 chỉ khi Lucas chốt style L và D7.
