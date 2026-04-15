# 📅 Lịch của tôi

> Ứng dụng lịch âm dương Việt Nam đầy đủ, hiện đại và dễ sử dụng — được thiết kế đặc biệt cho phụ huynh và người lớn tuổi.

🔗 **Demo trực tiếp:** [lich-cua-toi.vercel.app](https://lich-cua-toi.vercel.app)

---

## ✨ Tính năng

### 📆 Lịch Âm Dương

- Hiển thị **lịch tháng** với cả ngày dương lịch và âm lịch song song
- Chuyển đổi âm/dương lịch chính xác theo thuật toán **Hồ Ngọc Đức**
- Hỗ trợ **tháng nhuận** âm lịch
- Chỉ báo màu trực quan trên mỗi ô ngày:
  - 🟢 Ngày tốt (dựa theo Trực nhật)
  - 🔴 Ngày xấu
  - 🟣 Tiết khí (24 tiết trong năm)
  - 🟡 Sự kiện lễ tết đặc biệt

### 📋 Chi Tiết Ngày

Chọn bất kỳ ngày nào để xem đầy đủ thông tin:

| Thông tin | Mô tả |
|-----------|-------|
| **Ngày âm lịch** | Ngày/tháng/năm âm lịch, có chú thích nhuận |
| **Can Chi** | Can Chi của Năm, Tháng, Ngày (kèm Ngũ hành) |
| **Trực nhật** | Một trong 12 Trực (Kiến, Trừ, Mãn, Bình, Định...) |
| **Nên làm** | Các hoạt động phù hợp trong ngày |
| **Không nên** | Các việc nên tránh trong ngày |
| **Giờ Hoàng Đạo** | 12 giờ Can Chi, phân biệt Hoàng Đạo/Hắc Đạo |
| **Tiết khí** | Tên tiết khí nếu ngày trùng |
| **Lễ tết** | Sự kiện âm lịch đặc biệt (Tết, Rằm, Vu Lan...) |

### 🛠️ Tiện Ích (Hamburger Menu)

#### 🎂 Tra Cứu Tuổi
- Nhập năm sinh → hiển thị:
  - Tuổi dương lịch và tuổi âm (cách tính Việt Nam)
  - Can Chi năm sinh (Giáp Tý, Ất Sửu...)
  - Con giáp (12 con)
  - **Mệnh ngũ hành** (Kim, Mộc, Thủy, Hỏa, Thổ)
  - **Cung Mệnh** theo Bát Quái (Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài, Càn)
- So sánh **tương hợp giữa 2 người**:
  - Phân tích Lục Hợp, Tam Hợp, Lục Xung, Tứ Hành Xung
  - Đánh giá tương hợp Cung Mệnh (Đông/Tây Tứ Mệnh)
  - Điểm tương hợp 0–100

#### 📅 Chọn Ngày Tốt
- Chọn loại sự kiện: Cưới hỏi / Khai trương / Xuất hành / Động thổ / Nhập trạch
- Chọn khoảng thời gian mong muốn
- Trả về danh sách các ngày tốt phù hợp với sự kiện đó

#### ⏰ Giờ Hoàng Đạo Hôm Nay
- Hiển thị 12 giờ Can Chi trong ngày
- Phân biệt rõ Hoàng Đạo (tốt) và Hắc Đạo (xấu)
- Highlight giờ hiện tại đang ở mốc nào (cập nhật tự động)

---

## 🏛️ Thuật Toán & Nguồn Tham Khảo

### Chuyển đổi Âm/Dương lịch
Dựa trên thuật toán của **Hồ Ngọc Đức** (Informatik, Universität Leipzig) — thuật toán được sử dụng rộng rãi và tin cậy nhất cho lịch âm dương Việt Nam.

> Nguồn: https://www.informatik.uni-leipzig.de/~duc/amlich/

### Giờ Hoàng Đạo
Theo hệ thống truyền thống **Lục Nhâm**:
- Mỗi ngày theo Chi (Tý, Sửu, Dần...) có 6 giờ Hoàng Đạo và 6 giờ Hắc Đạo cố định
- Các cặp ngày đối xứng (Tý–Ngọ, Sửu–Mùi...) có cùng giờ Hoàng Đạo

### Trực Nhật (12 Day Officers / 建除十二神)
- Tính theo vị trí tương đối giữa Chi ngày và Chi tháng âm lịch
- 12 Trực theo thứ tự: Kiến → Trừ → Mãn → Bình → Định → Chấp → Phá → Nguy → Thành → Thu → Khai → Bế

### Cung Mệnh
- Tính theo năm sinh âm lịch và giới tính
- Phân thành hai nhóm: **Đông Tứ Mệnh** (Khảm, Chấn, Tốn, Ly) và **Tây Tứ Mệnh** (Khôn, Càn, Đoài, Cấn)

---

## 🎨 Thiết Kế

- **Font chữ:** [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) — hỗ trợ hoàn hảo tiếng Việt, hiện đại và dễ đọc
- **Cỡ chữ:** Lớn hơn thông thường (18px body), thân thiện với người lớn tuổi
- **Màu sắc:** Nền kem nhẹ, xanh dương tin tưởng, vàng ấm phong thủy
- **Thiết kế:** Mobile-first, responsive, không cần cài app

---

## 🛠️ Công Nghệ Sử Dụng

| Công nghệ | Mục đích |
|-----------|----------|
| [Next.js 16](https://nextjs.org) | Framework chính (App Router) |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| CSS Modules | Styling (không dùng Tailwind) |
| [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) | Font chính |
| [Vercel](https://vercel.com) | Hosting & Deployment |

Không sử dụng thư viện âm lịch bên ngoài — toàn bộ thuật toán được tự implement.

---

## 🚀 Chạy Cục Bộ

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Cài đặt

```bash
# Clone repository
git clone https://github.com/theitm/lich-cua-toi.git
cd lich-cua-toi

# Cài dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### Build Production

```bash
npm run build
npm start
```

---

## 📁 Cấu Trúc Project

```
lich-cua-toi/
├── app/
│   ├── layout.tsx          # Root layout, cấu hình font
│   ├── page.tsx            # Trang chính
│   ├── page.module.css
│   └── globals.css         # Global styles & design tokens
├── components/
│   ├── Header.tsx          # Thanh tiêu đề + hamburger
│   ├── CalendarGrid.tsx    # Grid lịch tháng
│   ├── DayDetail.tsx       # Panel chi tiết ngày
│   ├── HamburgerMenu.tsx   # Menu tiện ích slide-out
│   └── utilities/
│       ├── AgeCalculator.tsx    # Tiện ích tra tuổi
│       ├── GoodDayFinder.tsx    # Tìm ngày tốt
│       └── HoangDaoWidget.tsx   # Giờ Hoàng Đạo live
└── lib/
    ├── lunar.ts            # Thuật toán âm/dương lịch
    ├── canchi.ts           # Can Chi (năm/tháng/ngày/giờ)
    ├── hoangdao.ts         # Giờ Hoàng Đạo/Hắc Đạo
    ├── goodday.ts          # Ngày tốt/xấu (Trực nhật)
    ├── data.ts             # Tiết khí, lễ tết, dữ liệu tĩnh
    ├── tuoi.ts             # Tuổi, cung mệnh, tương hợp
    └── types.ts            # TypeScript interfaces
```

---

## 🗓️ Sự Kiện Âm Lịch Được Hỗ Trợ

- 🎉 Tết Nguyên Đán (Mùng 1, 2, 3 tháng Giêng)
- 🏮 Tết Nguyên Tiêu – Rằm tháng Giêng
- 🍡 Tết Hàn Thực (3/3)
- 🏔️ Giỗ Tổ Hùng Vương (10/3)
- 🐉 Tết Đoan Ngọ (5/5)
- 🙏 Rằm Vu Lan – Lễ Xá Tội Vong Nhân (15/7)
- 🥮 Tết Trung Thu (15/8)
- 🍂 Tết Trùng Cửu (9/9)
- 🍲 Ông Táo chầu trời (23/12)
- 🎊 Tất Niên (30 Tết)
- 🌑 Mùng 1 (Ngày sóc) và 🌕 Rằm (Ngày vọng) hàng tháng

---

## 📦 Deploy

Dự án được deploy tự động lên [Vercel](https://vercel.com).

```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 📝 Giấy Phép

MIT License — Tự do sử dụng, chỉnh sửa và phân phối.

---

<p align="center">Làm với ❤️ cho phụ huynh Việt Nam</p>
