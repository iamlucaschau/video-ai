# Bóc tách hình ảnh 4 Shorts của History Maps Lore (mục 1.3)

*2026-11-01, Luis. Khung trích bằng `npm run sheet:j -- --video …` → `out/sheets/HML-V*-open-1.png` (0–1 s, 6 khung cách 0,2 s), `HML-V*-end-1.png` (3 s cuối, 7 khung cách 0,5 s), `HML-V*-1s-*.png` (1 khung / giây). Điểm cắt: `ffmpeg select='gt(scene,0.3)'` (`_work/V*.cuts.txt`) và ngưỡng 0,12 (`_work/V*.cuts012.txt`). Nhiều chuyển cảnh là **crossfade ~0,3–0,5 s**, máy dò không bắt được, nên ranh giới shot ở dưới lấy từ dò cắt **cộng** khung 1 giây (sai số ±0,5 s ở các chỗ crossfade). Khung hình, video, transcript của bên thứ ba nằm trong `_work/` và `out/` (không vào git).*

Ký hiệu video (theo thứ tự đăng): **V1** Genghis / Western Xia · **V2** Malta 1565 · **V3** Rhodes 1480 · **V4** Copenhagen 1807. Mã kỹ thuật **T#** ở §5.

---

## 1. Dải khung 0–1 s (trước khi người xem quyết định lướt)

| Video | Khung 0 (0,0 s) có gì | Chữ / số đầu tiên | Âm thanh bắt đầu | Chuyển động trong 1 s đầu |
|---|---|---|---|---|
| V1 | **Bản đồ châu Á** đã tô sẵn 5 phe (Mongols xanh, Western Xia đỏ, Jin vàng, Qara Khitai, Khwarazm) + cờ + nhãn serif nhỏ | phụ đề ở **0,4 s** (f12); nhãn phe có từ khung 0 | ngay từ 0 s (không đoạn lặng) | máy quay đẩy rất chậm, chưa có gì mới |
| V2 | **Bản đồ trống**: Địa Trung Hải → Trung Đông, địa hình bóng đổ, tông be / xanh xám, **chưa có chữ, chưa tô** | phụ đề ở **0,4 s**; nhãn "OTTOMAN EMPIRE" + tô xanh ở ~3 s | ~0,11 s | đẩy chậm; vùng Ottoman tô xanh lan ra ở 2–3 s |
| V3 | **Bản đồ Đông Địa Trung Hải đã tô xanh** lãnh thổ Ottoman, đảo Rhodes chấm đỏ | chip năm **"1453"** mở ra ở **0,4–0,8 s** (cùng lúc phụ đề 0,4 s), cờ Ottoman cắm ở 0,6 s | ~0,15 s | chip + cờ + phụ đề cùng vào trong 0,4–0,8 s |
| V4 | **Bản đồ giấy cổ** (viền nét đứt kép, "GERMAN OCEAN" chữ nghiêng), các nước tô màu phẳng | phụ đề ở **0,4 s**; cờ Đan Mạch 0,6 s, cờ Thuỵ Điển 0,8 s, Nga 1,0 s | ~0,13 s | cờ cắm lần lượt mỗi 0,2 s |

**Rút ra:** khung 0 của cả 4 video là **một bản đồ toàn vùng, không chữ lớn, không mặt người**. Không có "chữ hook" to như J ("7 YEARS"). Thứ giữ người xem ở 1 s đầu là **giọng đọc vào ngay (≤ 0,15 s) + phụ đề ở 0,4 s + một chi tiết bản đồ thay đổi** (tô vùng, cờ, chip năm). Video thắng (V2) có khung 0 trống nhất: bản đồ sạch, câu đầu tự mang nghịch lý kích thước.

## 2. Dải 3 s cuối (giữ tới hết / nối vòng)

| Video | 3 s cuối | Lời cuối kết ở | Khung cuối so với khung 0 |
|---|---|---|---|
| V1 | diorama 3D cổng thành Western Xia, đoàn quân tiến vào; **end card "WESTERN XIA · 1227"** chữ serif vàng ánh kim ở **đầu khung** (y ≈ 7 %, nằm trong vùng nguy hiểm trên) từ 49,5 s, mờ đi ở 51,0 s | 47,8 s (còn 3,3 s nhạc) | khác hẳn (cảnh 3D ≠ bản đồ châu Á) → **không nối vòng** |
| V2 | bản đồ 3D bán đảo Sciberras, lưới ô bàn cờ Valletta viền vàng đã vẽ xong; **end card "VALLETTA · 1566"** ở ~67 % chiều cao từ 82,4 s, tắt ở 84,4 s | 81,5 s (còn 3,0 s) | khác (cận cảnh Valletta ≠ toàn Địa Trung Hải) → không nối vòng |
| V3 | sơ đồ thành Rhodes 2,5D, cờ Hiệp sĩ; **end card "RHODES · 1480"** từ 93,3 s, mờ ở 95,3 s | 92,7 s (còn 2,7 s) | khác → không nối vòng |
| V4 | tranh *The burning tower of the Church of Our Lady* (Lahde theo Eckersberg) **được làm động** (tên lửa bay, tia lửa); **end card "COPENHAGEN · 1807."** từ 96,6 s | 96,0 s (còn 2,7 s) | khác → không nối vòng |

**Rút ra:** 4/4 video kết bằng **end card TÊN NƠI + NĂM** chữ serif vàng, giữ ~2 s trên hình payoff, rồi mờ trước khung cuối. **Không CTA, không câu hỏi, không nối vòng.** Sau lời cuối còn **2,7–3,3 s** chỉ có nhạc. Đây là chữ ký thương hiệu, và là luật ngược với "loop ending" của mình (Style Library §2.5).

---

## 3. Bảng shot-by-shot

Cột "Máy quay": *đẩy* = zoom vào chậm; *lia* = pan; *bay* = đổi nơi trên cùng bản đồ không cắt. "Lời đọc" chỉ tóm tắt (nguyên văn 3 câu ở `BOC-TACH-KICH-BAN.md`). SFX: chỉ ghi được chỗ **đo** thấy (không có file stem); nhạc là Kevin MacLeod theo mô tả video.

### V1 · Genghis Khan's Last Revenge (51,1 s · 11 shot · TB 4,6 s)

| # | Vào–ra (s) | Dài | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | T# |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–8,8 | 8,8 | bản đồ châu Á, 5 phe tô màu → đẩy vào Western Xia; tuyến Con đường Tơ lụa vàng (3 s); kính lúp tròn ở kinh đô (4–5 s); chân dung Thành Cát Tư Hãn trên **băng rôn treo** (7–8 s); mũi tên xanh xâm lược | nhãn phe serif nhỏ; chip **"1209"**; nhãn "GENGHIS KHAN" | vương quốc giàu trên Con đường Tơ lụa, ~3 triệu dân; 1209 Mông Cổ đánh | đẩy + lia, êm | nhạc | T1 T2 T3 T4 T5 T6 T15 |
| 2 | 8,8–13,0 | 4,2 | **diorama 3D** kinh đô Zhongxing, hàng quân Tây Hạ cờ đỏ (crossfade vào) | nhãn "ZHONGXING" | Tây Hạ có ~150.000 lính ở kinh đô | dolly chậm | | T7 |
| 3 | 13,0–15,7 | 2,7 | 3D tường thành, lều Mông Cổ, khói | — | sau cuộc vây, hoàng đế đầu hàng | dolly | | T7 |
| 4 | 15,7–25,5 | 9,8 | bản đồ: mũi tên vàng cống nạp lên Mông Cổ; chip "1210: VASSAL"; chip "1219", lia sang Khwarazm; **dấu X đỏ** | chip năm | gả con gái, cống nạp, hứa theo; 9 năm sau xin quân đánh Khwarazm, Tây Hạ từ chối | lia dài | | T4 T6 T16 |
| 5 | 25,5–30,1 | 4,6 | **thẻ tranh** Tây Hạ (Khara-Khoto) trên nền mờ + băng rôn ấn triện "ASHA GAMBU" | nhãn tên; dòng nguồn ảnh rất nhỏ | Asha Gambu chế giễu: quân ít thì làm Khả hãn làm gì | đẩy chậm | | T3 T8 T21 |
| 6 | 30,1–33,0 | 2,9 | bản đồ: chip "1226", mũi tên xanh nhiều nhánh, vòng tròn trận | chip | trở lại báo thù năm 1226 | đẩy | | T4 T6 |
| 7 | 33,0–36,7 | 3,7 | **cảnh quay giống thật** (nhiều khả năng video AI): ngựa không người chạy trên thảo nguyên tuyết | — | ngã ngựa, đổ bệnh | máy theo ngựa | | T9 |
| 8 | 36,7–40,8 | 4,1 | 3D đêm, trại lều có lính gác | chip **"SECRET HISTORY"** (dán nhãn nguồn trên hình) | biên niên Mông Cổ ghi lệnh cuối: diệt sạch | đẩy | | T7 T21 |
| 9 | 40,8–43,3 | 2,5 | bản đồ: lãnh thổ Tây Hạ **co lại** tới kinh đô | — | "tới con cháu của con cháu" | đẩy | | T17 |
| 10 | 43,3–45,8 | 2,5 | chân dung Thành Cát Tư Hãn (tranh triều Nguyên) toàn khung, tối dần | chip "AUGUST 1227" | mất tháng 8/1227 | đẩy | | T8 T4 |
| 11 | 45,8–51,1 | 5,3 | 3D cổng thành, quân tiến vào | **end card "WESTERN XIA · 1227"** (49,5 s) | vài tuần sau kinh đô đầu hàng | dolly | nhạc 3,3 s cuối | T7 T14 |

### V2 · The Tiny Island That Stopped an Empire – Malta 1565 (84,5 s · 12 shot · TB 7,0 s) — **video hit**

| # | Vào–ra (s) | Dài | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | T# |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–33,2 | **33,2** | **một cú máy liền** trên bản đồ địa hình: (a) 0–3 toàn vùng trống → tô xanh "OTTOMAN EMPIRE"; (b) 6–9 băng rôn chân dung Suleiman, nhãn HUNGARY, PERSIAN GULF; (c) 10–14 lia tây, Tây Ban Nha Habsburg tô vàng + cờ; (d) 14–17 đẩy vào Sicily, **kính lúp tròn phóng to Malta**; (e) 18–19 băng rôn cờ Hiệp sĩ; (f) 20–24 lia đông tới Rhodes, chip "1522", mũi tên đỏ; (g) 25–31 về Malta, mũi tên đỏ tấn công tuyến tàu nét đứt; (h) 32 vòng tròn Malta | nhãn phe; chip "1522"; nhãn "KNIGHTS OF ST JOHN", "HABSBURG SPAIN" | đế chế mạnh nhất đánh một đảo nhỏ; Suleiman, đối thủ Tây Ban Nha; Malta ở giữa; Hiệp sĩ từng thua ở Rhodes; cướp tàu, cả tàu hành hương; Sultan muốn diệt | **lia / bay / đẩy liên tục**, ease in-out, không blur | nhạc | T1 T2 T3 T4 T5 T6 |
| 2 | 33,2–38,6 | 5,4 | (cắt) bản đồ gần Constantinople → theo mũi tên hạm đội xanh qua Aegean tới Malta | chip **"18 MAY"**; nhãn "CONSTANTINOPLE", "MALTA" + kính lúp | tháng 5/1565 gần 200 tàu tới Malta | bay theo mũi tên | | T4 T5 T6 |
| 3 | 38,6–44,5 | 5,9 | (cắt) **bản đồ 3D** Grand Harbour: bán đảo, thị trấn, pháo đài | băng rôn chân dung "JEAN DE VALETTE" | thủ lĩnh 70 tuổi, vài nghìn quân | đẩy | | T3 T7 |
| 4 | 44,5–50,3 | 5,8 | 3D bán đảo Sciberras, hạm đội Ottoman, mũi tên tới pháo đài | "FORT ST ELMO" | đánh St Elmo, pháo đài nhỏ ở cửa cảng | đẩy + lia | | T6 T7 |
| 5 | 50,3–53,4 | 3,1 | 3D tầm mặt đất: dàn pháo Ottoman nhắm pháo đài | chip "27 MAY" | tưởng sập trong vài ngày… | dolly | | T7 T4 |
| 6 | 53,4–55,6 | 2,2 | **fresco** d'Aleccio, St Elmo thất thủ | chip "23 JUNE 1565" | …giữ được trọn một tháng | đẩy | | T8 |
| 7 | 55,6–59,3 | 3,7 | 3D toàn cảng, mũi tên xanh nhiều hướng | "ST ANGELO", "ST MICHAEL", "KNIGHTS' GALLEYS", "OTTOMAN BATTERIES", "OTTOMAN FLEET" (**6 nhãn cùng lúc**) | đánh Birgu và Senglea | đẩy | | T6 T7 T11 |
| 8 | 59,3–66,8 | 7,5 | 3D thuyền chở Janissary lướt về bờ, khói pháo, thuyền chìm | chip "15 JULY" | thuyền Janissary bị pháo giấu kín bắn chìm gần hết | máy theo thuyền | (tiếng pháo — chưa xác nhận bằng tai) | T7 T4 |
| 9 | 66,8–70,8 | 4,0 | fresco trận vây, nửa dưới **chuyển đen** cho phụ đề | — | tới tháng 9 quân Ottoman mệt, ốm, đói | đẩy | | T8 |
| 10 | 70,8–74,3 | 3,5 | bản đồ Malta–Gozo: mũi tên vàng (viện binh) đổ bộ phía bắc, mũi tên xanh rút | chip "7 SEPT" | viện binh Tây Ban Nha tới, Ottoman rút | đẩy | | T4 T6 |
| 11 | 74,3–76,8 | 2,5 | fresco viện binh đổ bộ | — | (tiếp câu trên) | lia | | T8 |
| 12 | 76,8–84,5 | 7,7 | 3D bán đảo Sciberras, **lưới phố Valletta viền vàng vẽ dần** | **end card "VALLETTA · 1566"** (82,4 s) | trên đồi đặt pháo, xây thành phố mới Valletta | đẩy chậm | nhạc 3,0 s cuối (−28,7 LUFS) | T10 T14 |

### V3 · The Tiny Island That Stopped One of the Greatest Conquerors – Rhodes 1480 (95,4 s · 16 shot · TB 6,0 s)

| # | Vào–ra (s) | Dài | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | T# |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–19,7 | 19,7 | một cú máy liền: Đông Địa Trung Hải tô xanh Ottoman; băng rôn "MEHMED II" (3–9); mũi tên xanh vào châu Âu; lia lên Venice (cờ, nhãn); đẩy vào Rhodes, **kính lúp** đảo đỏ; nhãn "RHODES" | chip "1453"; nhãn | Mehmed II chiếm Constantinople, châu Âu sợ; mạnh dần trên biển, thắng Venice; sát bờ có đảo không chịu phục: Rhodes; 170 năm là nhà của Hiệp sĩ | bay / đẩy liên tục | nhạc | T1 T2 T3 T4 T5 |
| 2 | 19,7–24,5 | 4,8 | **tiểu hoạ** Caoursin: toàn cảnh thành Rhodes (crossfade vào) | — | Hiệp sĩ Cứu tế, chiến binh Thiên Chúa | lia | | T8 |
| 3 | 24,5–32,8 | 8,3 | bản đồ: băng rôn Mehmed, tuyến nét chấm vàng tới Rhodes (đòi cống nạp); đẩy vào Rhodes, tàu buôn bị tấn công | — | đòi cống nạp, bị từ chối nhiều lần; tàu Rhodes tấn công tàu buôn | đẩy | | T3 T6 |
| 4 | 32,8–35,5 | 2,7 | tiểu hoạ: nhân vật ngồi ngai | — | "cái gai" của Sultan | đẩy | | T8 |
| 5 | 35,5–41,3 | 5,8 | ảnh trên cao bến cảng Rhodes, **hàng trăm tàu**; mũi tên xanh | chip "MAY 1480"; "OTTOMAN FLEET", "RHODES"; băng rôn "MESIH PASHA" | tháng 5/1480 ~100 tàu, do Mesih Pasha chỉ huy | đẩy | | T3 T4 T6 T7 |
| 6 | 41,3–48,5 | 7,2 | (cắt) tiểu hoạ d'Aubusson giữa các hiệp sĩ áo đỏ + pháo | băng rôn "PIERRE D'AUBUSSON" | Đại thủ lĩnh, quý tộc Pháp ngoài 55 | đẩy | | T3 T8 |
| 7 | 48,5–54,1 | 5,6 | (cắt) tiểu hoạ d'Aubusson duyệt thợ xây tường | — | gia cố tường nhiều năm, nhưng chỉ vài nghìn người giữ | lia | | T8 |
| 8 | 54,1–58,0 | 3,9 | tiểu hoạ toàn cảnh trại Ottoman bao vây | — | **"some sources say"** tới 70.000 quân | lia | | T8 |
| 9 | 58,0–64,7 | 6,7 | 3D: pháo Ottoman + cờ xanh, tháp St Nicholas trên mặt nước | nhãn "ST NICHOLAS" | nhiều tuần nã tháp cảng, mọi đợt đánh thất bại | dolly | | T7 |
| 10 | 64,7–67,3 | 2,6 | tiểu hoạ Ottoman đánh tường | — | chuyển sang đánh tường thành | đẩy | | T8 |
| 11 | 67,3–74,2 | 6,9 | **sơ đồ thành phố 2,5D** (OSM), mũi tên xanh vào tường, cờ Ottoman cắm trên tường | chip "JULY 1480" | cuối tháng 7 Janissary leo tường vỡ, cắm cờ | đẩy | | T10 T4 T6 |
| 12 | 74,2–79,8 | 5,6 | tiểu hoạ giáp chiến trên tường | — | Đại thủ lĩnh bị thương nặng, hiệp sĩ đẩy lui | đẩy | | T8 |
| 13 | 79,8–84,6 | 4,8 | tiểu hoạ **xác lính chất đống** (cận) | — | hàng nghìn lính Ottoman chết, mất ý chí | lia | | T8 |
| 14 | 84,6–87,8 | 3,2 | bản đồ đảo Rhodes đỏ, băng rôn Mesih Pasha, hạm đội rút | — | tháng 8 Mesih Pasha bỏ cuộc | đẩy | | T3 T6 |
| 15 | 87,8–90,5 | 2,7 | chân dung Mehmed II (Bellini) toàn khung, mờ dần | — | Mehmed mất năm sau | đẩy | | T8 |
| 16 | 90,5–95,4 | 4,9 | sơ đồ thành Rhodes 2,5D, cờ Hiệp sĩ | **end card "RHODES · 1480"** (93,3 s) | Hiệp sĩ giữ Rhodes thêm 42 năm | đẩy | nhạc 2,7 s cuối | T10 T14 |

### V4 · Britain's Most Ruthless Surprise Attack – Copenhagen 1807 (98,7 s · 10 shot · TB 9,9 s)

| # | Vào–ra (s) | Dài | Hình | Chữ trên màn hình | Lời đọc (tóm tắt) | Máy quay | SFX / nhạc | T# |
|---|---|---|---|---|---|---|---|---|
| 1 | 0,0–13,7 | 13,7 | **bản đồ giấy cổ** châu Âu: Pháp xanh lan ra, Anh đỏ; đẩy vào Đan Mạch; tuyến hạm đội Anh bằng icon tàu; kính lúp Copenhagen | chip oval "AUGUST 1807."; "THE SOUND" | 1807 Napoleon nắm châu Âu, kẻ thù là Anh; hạm đội Anh tới Copenhagen; Đan Mạch trung lập | đẩy / bay | nhạc | T19 T1 T2 T4 T5 T6 |
| 2 | 13,7–22,8 | 9,1 | tranh (Eckersberg) hạm đội Anh ngoài Copenhagen, người đứng xem trên kè; **tranh được làm động** (người cử động nhẹ) | — | 25.000 quân và một yêu sách: giao cả hạm đội (thoại trực tiếp) | đẩy | | T8 T20 |
| 3 | 22,8–41,6 | 18,8 | bản đồ châu Âu: **huy hiệu chân dung tròn** Napoleon (27 s), Tsar Alexander I (34 s); Nga gạch chéo xanh (đồng minh) | nhãn dưới huy hiệu | vì sao Anh muốn hạm đội? Napoleon thiếu hải quân; hoà với Sa hoàng; Anh sợ Napoleon lấy hạm đội Đan Mạch | lia / đẩy | | T3 T18 |
| 4 | 41,6–45,8 | 4,2 | tranh tàu chiến Đan Mạch (Lønning) + huy hiệu "CROWN PRINCE FREDERICK" | — | Thái tử từ chối | đẩy | | T3 T8 |
| 5 | 45,8–52,4 | 6,6 | bản đồ eo The Sound: tàu Anh, **mũi tên đỏ đổ bộ**; huy hiệu "ARTHUR WELLESLEY" | — | quân Anh đổ bộ; một tướng là Wellesley, sau là công tước Wellington | đẩy | | T3 T6 |
| 6 | 52,4–61,4 | 9,0 | (cắt) **3D đêm**: dàn cối Anh, cờ Union, thành phố xa bắt đầu cháy | chip oval "2 SEPTEMBER 1807." | **52,0–56,3 s không lời** (4,3 s); rồi: pháo và tên lửa (vũ khí mới) bắn vào thành | dolly chậm | **khoảng lặng lời −13,5 LUFS**: âm thanh trận đánh to ngang giọng | T7 T4 |
| 7 | 61,4–68,5 | 7,1 | 3D đêm: thành phố cháy, **tháp nhà thờ sụp** | — | ba đêm cháy, tháp nhà thờ lớn đổ, hàng trăm người chết | dolly | | T7 |
| 8 | 68,5–75,3 | 6,8 | bản đồ Zealand → tuyến hạm đội Đan Mạch bị kéo về Anh | chip "18 SHIPS OF THE LINE" | Đan Mạch đầu hàng, Anh mang gần hết hạm đội về | lia theo tuyến | | T6 T4 |
| 9 | 75,3–88,6 | 13,3 | bản đồ châu Âu: Đan Mạch thành đồng minh Pháp (gạch chéo); chip "1814."; Na Uy đổi màu sang Thuỵ Điển | chip oval | kế hoạch phản tác dụng: Đan Mạch theo Napoleon 7 năm, 1814 mất Na Uy | đẩy | | T18 T4 T1 |
| 10 | 88,6–98,7 | 10,1 | tranh *tháp Nhà thờ Đức Bà cháy* (Lahde), **làm động**: tên lửa, tia lửa | **end card "COPENHAGEN · 1807."** (96,6 s) | Anh có hạm đội nhưng có thêm kẻ thù; "to Copenhagen" thành thành ngữ | đẩy chậm | nhạc 2,7 s cuối | T8 T20 T14 |

## 4. Tổng hợp nhịp hình

| | V1 | V2 (hit) | V3 | V4 |
|---|---|---|---|---|
| Số shot | 11 | 12 | 16 | 10 |
| Shot TB (s) | 4,6 | 7,0 | 6,0 | 9,9 |
| Dài nhất | 9,8 (bản đồ) | **33,2 (bản đồ mở đầu)** | 19,7 (bản đồ mở đầu) | 18,8 (bản đồ giữa bài) |
| Ngắn nhất | 2,5 | 2,2 | 2,6 | 4,2 |
| Shot trong 3 s đầu | 1 | 1 | 1 | 1 |
| Tỉ lệ thời gian là bản đồ (2D + 3D bản đồ) | ~50 % | ~68 % | ~45 % | ~60 % |
| Tranh / tiểu hoạ public domain | 2 cảnh | 3 cảnh | 8 cảnh | 3 cảnh |
| 3D diorama / ảnh 3D | 4 cảnh | 5 cảnh | 2 cảnh | 2 cảnh |
| Cảnh giống quay thật (AI?) | 1 (ngựa) | 0 | 0 | 0 |

- **Mở bằng một cú máy bản đồ dài** (13–33 s) chứa toàn bộ bối cảnh địa chính trị; trong cú máy đó **cứ ~3–4 s có một thứ mới** (tô vùng, cờ, băng rôn, chip năm, kính lúp, mũi tên). Video hit có cú mở dài nhất.
- Từ giữa bài (nhịp vây hãm), hình **luân phiên 3 lớp** mỗi 2–8 s: bản đồ ↔ 3D ↔ tranh. Đổi lớp bằng hard cut hoặc crossfade ngắn.
- **Không bao giờ có khung đứng yên lâu**: `freezedetect` chỉ thấy 0,5–1,3 s ở vài chỗ (V2 22,5 s và 25,8 s; V4 23,1 s và 68,4 s), đều là lúc chuyển giữa hai chuyển động.

## 5. Kỹ thuật (mã T#) và đối chiếu bộ kit J

| # | Kỹ thuật | Ở đâu | Mô tả | Kit J đang có? |
|---|---|---|---|---|
| T1 | **Tô lãnh thổ theo phe, biên giới lịch sử** | cả 4 | đa giác biên giới **đúng năm sự kiện** (historical-basemaps / OpenHistoricalMap), tô bán trong suốt, mỗi phe một màu (Ottoman xanh lá, Habsburg vàng, Tây Hạ đỏ, Mông Cổ xanh dương); vùng lan ra / co lại theo lời | **một phần**: `RegionFill` tô được nhưng chỉ có biên giới **hiện đại** Natural Earth |
| T2 | **Cờ phe cắm trên cột** | cả 4 | cờ nhỏ (lưỡi liềm, chữ thập Malta, Dannebrog…) cắm ở thủ đô / đạo quân; cắm lần lượt mỗi 0,2 s | không |
| T3 | **Chân dung trên băng rôn treo** (V1–V3) / **huy hiệu tròn có nơ** (V4) + bảng tên serif | cả 4 | xuất hiện ở góc trên phải hoặc trái khi nhân vật được nhắc, giữ suốt câu | gần: `PhotoCard` (thẻ trên dây nối), khác kiểu |
| T4 | **Chip mốc thời gian** | cả 4 | bảng tối viền vàng, chữ serif in hoa giãn, hoa văn hai bên ("18 MAY", "JULY 1480", "1210: VASSAL"); V4 dùng chip oval giấy | không |
| T5 | **Kính lúp phóng to nơi nhỏ** | V1–V4 | vòng tròn viền trắng nối hai đường mảnh về điểm thật, bên trong là đảo / thành phóng to | không (`Ring` chỉ là vòng sóng) |
| T6 | **Mũi tên chiến dịch / tuyến hạm đội** | cả 4 | mũi tên cong màu phe vẽ dần; tuyến tàu bằng chuỗi icon tàu (V4); mũi tên tấn công tách nhánh | một phần: `GlowRoute`, `GeoLine`, `Vessel`, `Army` |
| T7 | **Diorama 3D** (thành, pháo đài, quân, tàu, thành phố cháy) | cả 4 | dựng 3D kiểu Blender, ánh sáng điện ảnh; máy dolly chậm | **không** (J dùng ảnh AI tĩnh toàn khung) |
| T8 | **Tranh / tiểu hoạ / fresco toàn khung** | cả 4 | đẩy chậm hoặc lia; nhiều cảnh làm tối nửa dưới cho phụ đề | có: `FullFrame` |
| T9 | Cảnh giống quay thật (nhiều khả năng video AI) | V1 33–37 s | ngựa không người chạy trên thảo nguyên | không, và luật kênh không cho |
| T10 | **Sơ đồ thành phố 2,5D** (từ footprint OSM) / **lưới phố vẽ dần** | V2 77–84, V3 67–74 & 91–95 | thành phố nhìn nghiêng, tường thành viền đỏ; Valletta = lưới ô bàn cờ viền vàng vẽ dần | không |
| T11 | Nhãn serif in hoa nhỏ | cả 4 | chữ serif (kiểu Cinzel / Trajan) ~20–25 px trên khung 1080; có lúc 6 nhãn cùng lúc (V2 56–59 s) | khác: `StopLabel` Bebas 76 px |
| T12 | **Phụ đề cháy cứng 2 dòng** | cả 4 | sans đậm trắng có bóng (kiểu DIN), ~44 px, cụm 3–9 từ, căn giữa ở ~65 % chiều cao (y ≈ 1250) | J **không phụ đề** (Lucas 2026-10-30) |
| T13 | Watermark giữa khung | cả 4 | "HISTORY MAPS LORE" xám mờ ~55 % chiều cao (y ≈ 1060), suốt bài | có `Handle` (đặt dưới phụ đề) |
| T14 | **End card TÊN NƠI · NĂM** | cả 4 | serif vàng ánh kim + năm giữa hai gạch mảnh, ~2 s, mờ trước khung cuối | không |
| T15 | Tuyến thương mại phát sáng | V1 2–5 s | Con đường Tơ lụa nét vàng | có (`GlowRoute` đổi màu) |
| T16 | Dấu X từ chối | V1 24–25 s | X đỏ trên mũi tên | có: `Cross` |
| T17 | Lãnh thổ co lại | V1 41–43 s | vùng Tây Hạ thu nhỏ còn quanh kinh đô | không (cần nội suy đa giác) |
| T18 | Vùng gạch chéo = đồng minh / chiếm đóng | V4 | sọc chéo cùng màu phe | không |
| T19 | Bản đồ giấy cổ | V4 | nền giấy kem, biển xanh nhạt, viền khung nét đứt kép, chữ biển nghiêng | không (khác hẳn nền vệ tinh) |
| T20 | Tranh được làm động | V4 13–23, 88–98 s | người cử động, tên lửa / tia lửa bay trên tranh | gần: `PhotoCard` có zoom + vệt sáng; chưa có hạt / parallax |
| T21 | Dán nhãn nguồn trên hình | V1 | chip "SECRET HISTORY"; dòng chú thích nguồn tranh rất nhỏ | có: `SourceLine` |

**Nền bản đồ (khác J rõ nhất):** HML dùng **bản đồ địa hình bóng đổ tông be / xám đá, biển xanh xám đậm** (Natural Earth + DEM Copernicus GLO-30 / ETOPO, theo mô tả video), không phải ảnh vệ tinh. Đất đai phẳng màu, nên các mảng tô phe đọc rất rõ. V4 đổi sang bản đồ giấy cổ. Mình (J) dùng ảnh vệ tinh Blue Marble, biển navy gần đen: hợp để thấy "đường đi trên mặt đất thật", kém hơn khi cần đọc **ai nắm vùng nào**.
