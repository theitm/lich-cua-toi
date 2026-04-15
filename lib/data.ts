/** Static data: Tiết khí, lễ tết, sự kiện đặc biệt */

export interface TietKhi {
  name: string;
  month: number; // Solar month
  day: number;   // Approximate solar day
}

/** 24 Tiết khí with approx solar dates */
export const TIET_KHI: TietKhi[] = [
  { name: 'Tiểu Hàn',    month: 1,  day: 6  },
  { name: 'Đại Hàn',     month: 1,  day: 20 },
  { name: 'Lập Xuân',    month: 2,  day: 4  },
  { name: 'Vũ Thủy',     month: 2,  day: 19 },
  { name: 'Kinh Trập',   month: 3,  day: 6  },
  { name: 'Xuân Phân',   month: 3,  day: 21 },
  { name: 'Thanh Minh',  month: 4,  day: 5  },
  { name: 'Cốc Vũ',      month: 4,  day: 20 },
  { name: 'Lập Hạ',      month: 5,  day: 6  },
  { name: 'Tiểu Mãn',    month: 5,  day: 21 },
  { name: 'Mang Chủng',  month: 6,  day: 6  },
  { name: 'Hạ Chí',      month: 6,  day: 21 },
  { name: 'Tiểu Thử',    month: 7,  day: 7  },
  { name: 'Đại Thử',     month: 7,  day: 23 },
  { name: 'Lập Thu',     month: 8,  day: 7  },
  { name: 'Xử Thử',      month: 8,  day: 23 },
  { name: 'Bạch Lộ',     month: 9,  day: 8  },
  { name: 'Thu Phân',    month: 9,  day: 23 },
  { name: 'Hàn Lộ',      month: 10, day: 8  },
  { name: 'Sương Giáng', month: 10, day: 23 },
  { name: 'Lập Đông',    month: 11, day: 7  },
  { name: 'Tiểu Tuyết',  month: 11, day: 22 },
  { name: 'Đại Tuyết',   month: 12, day: 7  },
  { name: 'Đông Chí',    month: 12, day: 22 },
];

export function getTietKhi(month: number, day: number): string | null {
  for (const tk of TIET_KHI) {
    if (tk.month === month && Math.abs(tk.day - day) <= 1) {
      return tk.name;
    }
  }
  return null;
}

/** Âm lịch special events */
interface LunarEvent {
  lunarMonth: number;
  lunarDay: number;
  name: string;
}

export const LUNAR_EVENTS: LunarEvent[] = [
  // Tết Nguyên Đán
  { lunarMonth: 1, lunarDay: 1, name: '🎉 Tết Nguyên Đán' },
  { lunarMonth: 1, lunarDay: 2, name: '🎉 Mùng 2 Tết' },
  { lunarMonth: 1, lunarDay: 3, name: '🎉 Mùng 3 Tết' },
  // Tết Nguyên Tiêu
  { lunarMonth: 1, lunarDay: 15, name: '🏮 Rằm tháng Giêng (Tết Nguyên Tiêu)' },
  // Hàn Thực
  { lunarMonth: 3, lunarDay: 3, name: '🍡 Tết Hàn Thực' },
  // Rằm tháng 3
  { lunarMonth: 3, lunarDay: 15, name: '🌕 Rằm tháng 3' },
  // Giỗ Tổ Hùng Vương
  { lunarMonth: 3, lunarDay: 10, name: '🏔️ Giỗ Tổ Hùng Vương' },
  // Tết Đoan Ngọ
  { lunarMonth: 5, lunarDay: 5, name: '🐉 Tết Đoan Ngọ' },
  // Rằm tháng 7 - Vu Lan
  { lunarMonth: 7, lunarDay: 15, name: '🙏 Rằm Vu Lan – Lễ Xá Tội Vong Nhân' },
  // Tết Trung Thu
  { lunarMonth: 8, lunarDay: 15, name: '🥮 Tết Trung Thu' },
  // Rằm tháng 9
  { lunarMonth: 9, lunarDay: 9, name: '🍂 Tết Trùng Cửu' },
  // Ông Táo
  { lunarMonth: 12, lunarDay: 23, name: '🍲 Ông Táo chầu trời' },
  // Tất Niên
  { lunarMonth: 12, lunarDay: 30, name: '🎊 Tất Niên (30 Tết)' },
];

// Monthly events (all months)
interface MonthlyLunarEvent {
  day: number;
  name: string;
}

export const MONTHLY_LUNAR: MonthlyLunarEvent[] = [
  { day: 1, name: '🌑 Mùng 1 (Ngày sóc)' },
  { day: 15, name: '🌕 Rằm (Ngày vọng)' },
];

export function getLunarEvents(
  lunarDay: number,
  lunarMonth: number
): string[] {
  const events: string[] = [];

  // Monthly events
  for (const me of MONTHLY_LUNAR) {
    if (me.day === lunarDay) events.push(me.name);
  }

  // Annual events
  for (const le of LUNAR_EVENTS) {
    if (le.lunarMonth === lunarMonth && le.lunarDay === lunarDay) {
      events.push(le.name);
    }
  }

  return events;
}

export const LUNAR_MONTH_NAMES = [
  '', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',
  'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp',
];

export const DAY_NAMES_VI = [
  'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư',
  'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy',
];

export const MONTH_NAMES_VI = [
  '', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];
