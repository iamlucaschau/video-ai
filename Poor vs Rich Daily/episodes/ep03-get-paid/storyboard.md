# STORYBOARD — Ep03 "How Poor vs Rich People Get Paid"

*Giai đoạn 4 · chờ **Cổng 3**. Timecode thật từ `vo-timestamps.md` (VO duyệt 2026-10-07, 153.79 s). Video = 153.79 + 1.5 s đọng = **2:35.3** (4 659 frame @30fps).*

## Phong cách: D "Text Thread" (đề xuất)

**Lý do** (`03_STYLE-LIBRARY.md` §3): kịch bản là **cuộc nói chuyện + tiền vào/ra tài khoản theo thời gian**: hóa đơn, 3 tin "just checking in", khách "Seen" rồi im lặng, thẻ tín dụng tính lãi, thông báo "Deposit received". Đó là hai tín hiệu ●● của D; A/B/C không có cảnh nào tự nhiên hơn màn hình điện thoại. Luân phiên: Ep01 A · Ep02 C · Ep03 D.

**Bất biến:** khung đứng yên (chỉ UI chuyển động: tin nhắn đến, dòng giao dịch trượt vào, số chạy, thông báo trượt xuống), POOR đỏ / RICH xanh, phụ đề y≈1600, mọi số trong bảng kiểm toán, hard cut giữa scene, nhạc nền tối → sáng ở câu 33.

## Màn hình & đạo cụ của tập

| Thành phần | Thiết kế |
|---|---|
| Chat với khách | Khách một (avatar tím "1"), khách hai (avatar cam "2"); POOR gửi bong bóng đỏ, RICH bong bóng xanh |
| **Khách hai** (nút thắt) | **Cùng một avatar** ở hai nửa: "Love the walls!" → tin của người thợ hiện **"Seen"** → im lặng |
| App ngân hàng "Paint Co." | HUD số chạy + các dòng giao dịch (đã có ở Ep02-D) |
| **Mới cần dựng** | Thẻ tín dụng (số dư nợ + lãi chạy), trạng thái "Delivered" / "Seen", thẻ hóa đơn / thẻ báo giá có điều khoản, thông báo tiền vào |
| Dùng lại | `styles/textThread.tsx`: khung điện thoại, chat, toast, app ngân hàng, thẻ tổng kết; `Slam`, `Banner` |

---

## SCENE 1 — Title + thesis hook · 0:00.0 – 0:11.9
| Thời điểm | VO | Hình | Chữ |
|---|---|---|---|
| 0:00.0 | — | Chat "Client one", thẻ tiêu đề trong luồng | `How Poor vs Rich People` / `Get Paid` |
| 0:00.3 | "A poor person paints the house, then asks to get paid." | POOR (đỏ): ảnh "căn phòng sơn xong ✓" rồi thẻ **INVOICE $2,000** | `POOR` · `INVOICE` |
| 0:04.8 | "A rich person gets paid before the first brushstroke." | RICH (xanh): thẻ **DEPOSIT REQUEST $1,000** gửi trước lịch làm | `RICH` · `DEPOSIT` |
| 0:09.3 / 0:10.5 | "Same job. Opposite order." | 2 tin hệ thống | `Same job.` · `Opposite order.` |

## SCENE 2 — Poor: nhận việc, quẹt thẻ · 0:11.9 – 0:30.3
| Thời điểm | VO | Hình | Chữ |
|---|---|---|---|
| 0:12.0 | "The poor person paints houses." | Header "Paint jobs" (POOR) | |
| 0:14.1 | "Two clients book the same month." | Khách một: "You're booked!" · khách hai: "You're booked!" | |
| 0:16.0 | "Two thousand dollars each." | Thẻ giá `$2,000` | `$2,000` ×2 |
| 0:17.7 | "Paint and supplies cost six hundred a house." | Thông báo trượt xuống: **CARD · −$600 Paint & supplies** | `−$600` |
| 0:20.6 | "It goes on a credit card." | Thông báo thứ hai (nhà thứ hai) | `−$600` |
| 0:22.5 | "Four days of work." | Tin hệ thống | `4 days of work` |
| 0:24.0 | "Then they send the invoice and wait." | POOR gửi thẻ **INVOICE $2,000** (trạng thái "Unpaid") | |
| 0:27.3 / 0:28.8 | "They didn't make a sale. They made a loan." | | `They didn't make a sale.` · `They made a loan.` (đỏ) |

## SCENE 3 — Poor: khoản vay · 0:30.3 – 1:24.0 ★ TEST SCENE
| Thời điểm | VO | Hình | Chữ |
|---|---|---|---|
| 0:30.4 | "Here's how the loan goes." | Chat khách một | |
| 0:32.2 | "Client one pays forty-five days later." | Chat khách một, hóa đơn "Unpaid" | |
| 0:35.5 | "After three "just checking in" texts." | 3 bong bóng đỏ "Just checking in…" lần lượt, mỗi tin **"Delivered"** không trả lời; rồi thông báo **+$2,000** kèm dấu `45 days` | `45 days` |
| 0:39.5 | "The card charges twenty-four percent a year." | Cắt sang **thẻ tín dụng**: nợ $600, `24% APR` | `24% APR` |
| 0:42.8 / 0:45.1 | "Six hundred… a month and a half. Eighteen dollars in interest." | Dòng lãi chạy lên | `+$18 interest` |
| 0:46.9 | "Two thousand, minus six hundred, minus eighteen." | App ngân hàng: các dòng trượt vào | `$2,000 − $600 − $18` |
| 0:51.3 / 0:55.0 | "One thousand three hundred eighty-two. A month and a half late." | HUD chạy tới `$1,382` | `$1,382` · `45 days late` |
| 0:56.3 | "Client two loves the walls." | Chat khách hai: "Love the walls!!" | |
| 0:59.1 | "Then stops answering." | POOR gửi INVOICE → **"Seen"** → không ai gõ | `Seen` |
| 1:00.5 | "Six hundred in paint, still on the card." | Thẻ tín dụng: vẫn nợ `$600` | `−$600` |
| 1:03.3 | "Four days of work, gone." | Dòng `4 days · $0` gạch đỏ | |
| 1:05.3 / 1:10.2 | "One thousand three hundred eighty-two, minus six hundred. Seven hundred eighty-two…" | App ngân hàng: HUD `$1,382` → **`$782`** (đỏ, đập vào màn hình) | `$1,382 − $600 = $782` |
| 1:14.6 | "And a card that's still charging." | Lãi trên thẻ nhích lên | |
| 1:16.8 | "The only one who got paid on time was the card company." | Nền tối lại, dải chữ giữa màn hình | dải chữ |
| 1:20.6 / 1:21.9 | "They sold the paint job. They never sold the terms." | | `They never sold the terms.` (đỏ) |

## SCENE 4 — Transition · 1:24.0 – 1:27.9
| 1:24.1 | "Here's what a rich person does before the first brushstroke." | Chat khách một mới (RICH): "Can you paint the living room?" | `The rich way` |
|---|---|---|---|

## SCENE 5 — Rich ①② · 1:27.9 – 1:45.5
| Thời điểm | VO | Hình | Chữ |
|---|---|---|---|
| 1:28.1 | "First, the price comes with terms." | RICH gửi thẻ **QUOTE $2,000** | `① Terms` |
| 1:31.0 / 1:32.4 | "Half to book the date. Half at the walkthrough." | Hai dòng trong thẻ báo giá hiện lần lượt | `50% to book` · `50% at walkthrough` |
| 1:33.8 | "It's called a deposit." | Khách: "Deal." | `DEPOSIT` |
| 1:35.4 | "Second, the deposit buys the paint." | Thông báo **+$1,000 Deposit received** | `② Deposit buys the paint` |
| 1:38.1 – 1:43.2 | "One thousand in. Six hundred on supplies. Four hundred left before day one." | App ngân hàng: `+$1,000` → `−$600` → HUD `$400` | `$400` before day 1 |
| 1:43.4 | "The card stays at zero." | Thẻ tín dụng: `$0` (xanh) | `Card: $0` |

## SCENE 6 — Rich ③ · 1:45.5 – 2:03.4
| Thời điểm | VO | Hình | Chữ |
|---|---|---|---|
| 1:45.7 | "Third, the walkthrough." | Chat khách một | `③ Walkthrough` |
| 1:47.6 | "Client one checks every wall." | Khách: "Looks perfect!" | |
| 1:50.0 | "The second thousand lands before the tape comes off." | Thông báo **+$1,000** | `+$1,000` |
| 1:53.2 | "Zero days waiting." | | `0 days` |
| 1:54.9 – 1:58.2 | "Client two? Same walls. Same silence." | **Khách hai (cùng avatar)**: "Love the walls!!" → INVOICE nửa sau → **"Seen"** | `Seen` |
| 1:58.6 / 2:01.0 | "But the deposit is already in. Four hundred is kept." | Dòng cọc của khách hai sáng lên | `Deposit kept: $400` |

## SCENE 7 — Rich ④ · 2:03.4 – 2:20.3
| Thời điểm | VO | Hình | Chữ |
|---|---|---|---|
| 2:03.6 | "Fourth, the math." | App ngân hàng (RICH) | `④ The math` |
| 2:05.9 / 2:09.9 | "Client one: two thousand minus six hundred. One thousand four hundred." | Dòng khách một | `$2,000 − $600 = $1,400` |
| 2:11.7 | "Client two: four hundred." | Dòng khách hai | `$400` |
| 2:14.4 | "One thousand eight hundred dollars." | HUD → **$1,800** (xanh, đập vào màn hình) | `$1,800` |
| 2:17.2 / 2:18.9 | "Same two clients. More than double." | Dòng so sánh `The poor way $782` (đỏ) | `×2+` |

## SCENE 8 — Closing · 2:20.3 – 2:35.3
| Thời điểm | VO | Hình | Chữ |
|---|---|---|---|
| 2:20.5 | "One person did the work, then hoped to get paid." | Thẻ tổng kết POOR: `2 invoices · 1 ghost · card still charging` · `$782` | |
| 2:23.9 | "The other got paid, then did the work." | Thẻ tổng kết RICH: `2 deposits · card $0` · `$1,800` | |
| 2:26.9 / 2:29.3 | "Poor people send invoices. Rich people take deposits." | | đỏ / xanh |
| 2:31.5 – 2:35.3 | "Same job. Opposite order." + 1.5 s đọng | | `Same job.` · `Opposite order.` |

---

**Test scene (Cổng 4):** Scene 3 (0:30.3 – 1:24.0, 54 s) — nhiều thành phần mới nhất ("Delivered/Seen", thẻ tín dụng, chuyển chat ↔ app ngân hàng).
