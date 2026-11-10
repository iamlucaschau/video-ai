# Gói sản xuất: Naval Board #2 "How Submarines Fight What They Can't See" (2026-11-08)

Video: `how-submarines-actually-fight.mp4` (8:52, 1080p30, −14,0 LUFS, render lại ngày 2026-11-08 sau khi bỏ câu guide) · Thumbnail đề xuất: `thumb-e.jpg`, `thumb-d.jpg`, `thumb-c.jpg` (lý do: `THAM-KHAO-THUMB.md`)

Mô tả, tiêu đề và từ khoá viết bằng tiếng Anh như video. Mọi số liệu đều lấy từ `FACTS-submarines.md`.

## Thumbnail

Ba file 1920×1080 JPEG, mỗi file dưới 200 KB, dưới giới hạn 2 MB của YouTube. Nền C và D là khung hình từ chính các shot Blender của tập (`public/images/submarines/`). E vẽ hoàn toàn bằng code. Chữ và vòng của mọi bản đều vẽ bằng code.
Nguồn: composition `Submarines-Thumbnail` (`src/compositions/Submarines/Thumbnail.tsx`).
Render lại: `npx remotion still Submarines-Thumbnail "Formats/Naval Board/episodes/ep02-submarines/thumb-e.jpg" --props=<file chứa {"variant":"e"}> --image-format=jpeg --jpeg-quality=92`

| | Chữ | Hình | Ý trong video | Hợp nhất với tiêu đề |
| --- | --- | --- | --- | --- |
| C | TOO QUIET | Vanguard và Le Triomphant sát nhau, vòng đỏ ở chỗ chạm (shot vanguard) | Sai lầm thứ tư (phần 8) | 1 |
| D | HEARS YOU / FIRST. | Thân tàu và tháp chỉ huy chiếm gần hết khung, nước sáng (shot hook) | Lời đáp cho tiêu đề: nó nghe thấy bạn trước | 1 |
| E | HEARS YOU FIRST. | Sơ đồ nền đen: tàu trắng nghe được trước, tàu đỏ phát sóng | Lời đáp cho tiêu đề + sóng chủ động làm lộ tàu | 1 |

Cách thử: giữ tiêu đề 1, đưa **E, D, C** vào **Test & compare** trong YouTube Studio. Bộ này được chọn sau khi so với các thumbnail đang dẫn đầu cùng chủ đề (`THAM-KHAO-THUMB.md`). Muốn thử tiêu đề thì đổi tay sau khoảng 48 giờ rồi so CTR.
Đã kiểm tra: đọc được ở cỡ 320×180, mỗi thumbnail tối đa 3 từ, góc dưới phải (chỗ hiện thời lượng) không có gì quan trọng.

## Tiêu đề

Công thức tiêu đề (theo phân tích của Lucas ngày 2026-11-08, file `PHAN-TICH-TITLE-TAU-NGAM.md`):
- chủ thể nổi tiếng nằm trong 3 từ đầu;
- 1 động từ xung đột;
- đúng 1 yếu tố gây căng thẳng (nghịch lý, mức độ hệ trọng, con số hoặc kịch bản);
- không lặp chữ trên thumbnail;
- dài tối đa khoảng 55 ký tự.

1. **How Submarines Fight What They Can't See** (chính, 40 ký tự). Yếu tố căng thẳng là nghịch lý trong hook: "It can't see. It can't be seen." Thumbnail bổ sung lời đáp: HEARS YOU FIRST.
2. How Submarines Actually Fight (dự phòng, an toàn nhất cho tính liên tục của loạt; dạng "đúng mà trơn")
3. Why Submarine Battles Are Fought by Ear (dạng Why/stakes, mất khuôn "How…")

**Khớp với video:** công thức bắt đọc lại tiêu đề thành câu hỏi. Ở 0:26 video đọc "So how do submarines actually fight?", tức là đọc tiêu đề 2. Ngay trước đó, ở 0:04–0:10, hook đã hỏi đúng nghịch lý của tiêu đề 1: "It can't see. It can't be seen. So how does a submarine find, and kill, anything?" Vì vậy đổi sang tiêu đề 1 không cần thu lại giọng. Lucas chốt ngày 2026-11-08: giữ nguyên, không thu lại.

## Mô tả

```
140 sailors, no windows, more than 800 feet down. A submarine can't see and can't be seen, so how does it fight at all? It listens, and whoever hears first, wins.

From Leonardo da Vinci's listening tube to the sinking of the General Belgrano, and four real cases where the silence broke.

Chapters
0:00 Intro
0:44 The oldest trick
1:45 How far sound goes
2:24 Two ways to listen
2:58 Noise is everything
3:50 Staying down
4:35 The modern hunt
6:01 Deadly mistakes
8:25 Who hears first

Sources
Speeds, crew: US Navy fact file, Attack Submarines https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2169558/attack-submarines-ssn/
Passive vs active sonar: US Navy, U.S. Navy Sonar https://www.nepa.navy.mil/SOTS/At-Sea/US-Navy-Sonar/
Da Vinci's listening tube: DOSITS https://dosits.org/people-and-sound/history-of-underwater-acoustics/the-discovery-of-underwater-acoustics-pre-1800s
SOSUS: DOSITS https://dosits.org/people-and-sound/history-of-underwater-acoustics/the-cold-war-history-of-the-sound-surveillance-system-sosus
Hunley and Housatonic: https://en.wikipedia.org/wiki/Sinking_of_USS_Housatonic
U-9, 22 September 1914: https://en.wikipedia.org/wiki/Action_of_22_September_1914
Toshiba-Kongsberg: https://en.wikipedia.org/wiki/Toshiba%E2%80%93Kongsberg_scandal
Gotland exercise (reported): https://en.wikipedia.org/wiki/HSwMS_Gotland_(Gtd)
General Belgrano: https://en.wikipedia.org/wiki/ARA_General_Belgrano
IRIS Dena: https://en.wikipedia.org/wiki/Sinking_of_IRIS_Dena
Novorossiysk drone claim: Al Jazeera https://www.aljazeera.com/news/2025/12/15/ukraine-claims-it-struck-russian-submarine-in-novorossiysk-in-a-war-first
U-864 and HMS Venturer: https://en.wikipedia.org/wiki/Sinking_of_U-864
USS Greeneville and Ehime Maru: NTSB https://www.ntsb.gov/investigations/Pages/DCA01MM022.aspx
USS Connecticut: Breaking Defense https://breakingdefense.com/2022/05/navy-finds-multiple-failures-in-preventable-sub-accident-in-indo-pacific/
USS San Francisco: Navy investigation report https://www.nr-ha.org/books-sources/san-francisco-(ssn-711)-grounding-(2005)-investigation-report
HMS Vanguard and Le Triomphant: AFP https://www.spacewar.com/reports/Nuclear_subs_didnt_know_theyd_hit_each_other_999.html
Real depth and speed limits are classified; figures shown are publicly credited ranges.

Credits
Animation, narration and music made by Naval Board.
Sound effects: Mixkit (Mixkit Sound Effects Free License) and Universfield via Pixabay.

Thanks for watching!

#Submarines #NavalWarfare #Sonar #NavalBoard
```

Mô tả dài khoảng 2.500 ký tự, dưới giới hạn 5.000 của YouTube.

## Hashtag

#Submarines #NavalWarfare #Sonar #NavalBoard

Video dài nên không dùng #Shorts. YouTube hiện 3 hashtag đầu phía trên tiêu đề.

## Từ khoá

```
how submarines fight, submarine warfare, submarines, sonar, passive sonar vs active sonar, anti-submarine warfare, nuclear submarine, HMS Conqueror General Belgrano, U-864 HMS Venturer, USS Greeneville Ehime Maru, USS Connecticut seamount, HMS Vanguard Le Triomphant collision, IRIS Dena, naval warfare explained, how sonar works
```

Tổng 15 từ khoá, khoảng 330 ký tự (giới hạn của ô Tags là 500).

## Trước khi đăng

- [x] **Guide:** Lucas chốt ngày 2026-11-08 bỏ lời hứa guide. Câu đó đã cắt khỏi giọng đọc (dòng 153, không thu lại), video và mô tả không còn nhắc guide. Phần kết giờ chỉ còn câu tease sang tập Blockade, lệch với luật "1 CTA" của công thức (mục 2.7) theo quyết định của Lucas.
- [ ] **Nghe bằng tai:** chưa ai nghe bản cuối. Các số đo nằm ở `NGHE.md`, còn 3 tiếng lên chậm đã chọn giữ nguyên.
- [ ] **Số ghi "reported" / "publicly credited":** Gotland, Dena ("reported as"), độ sâu 800 ft, tốc độ Seawolf. Video và mô tả đều đã nói rõ như vậy.
- [ ] **Nội dung tổng hợp:** giọng đọc là TTS (Gemini), hình là hoạt hình. YouTube chỉ bắt khai báo với nội dung trông như thật nên thường không bắt buộc. Lucas quyết định có bật ô "Altered or synthetic content" khi đăng hay không.
- [ ] **Hình đứng yên:** 37,5% khung gần như đứng yên, mục tiêu là dưới 35% (`QA.md`). Đã biết và chấp nhận cho bản này.
