import { getDayChiIndex, getDayCanIndex } from './canchi';

/**
 * Trực nhật (12 Day Officers / 建除十二神)
 * Cycle: Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế
 */
export const TRUC_LIST = [
  'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp',
  'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế',
];

// Chất lượng của từng Trực
export const TRUC_QUALITY: Record<string, 'good' | 'bad' | 'normal'> = {
  'Kiến': 'normal', // Good for starting/building, avoid weddings
  'Trừ': 'good',    // Good for health related, cleansing
  'Mãn': 'good',    // Good for celebration
  'Bình': 'normal', // Average day
  'Định': 'good',   // Good for important events
  'Chấp': 'normal', // Normal/average
  'Phá': 'bad',     // Bad – very inauspicious
  'Nguy': 'bad',    // Bad – danger
  'Thành': 'good',  // Very good
  'Thu': 'normal',  // Average-good
  'Khai': 'good',   // Very good for starting new things
  'Bế': 'bad',      // Bad for starting, closing energy
};

// Suitable activities per Trực
export const TRUC_SUITABLE: Record<string, string[]> = {
  'Kiến': ['Xây dựng', 'Khởi công', 'Gặp gỡ cấp trên'],
  'Trừ': ['Chữa bệnh', 'Dọn dẹp', 'Giải quyết tranh chấp', 'Khám bệnh'],
  'Mãn': ['Tiệc mừng', 'Cưới hỏi', 'Khai trương', 'Ra mắt sản phẩm'],
  'Bình': ['Hoạt động thường ngày', 'Đi đường', 'Buôn bán nhỏ'],
  'Định': ['Cưới hỏi', 'Ký hợp đồng', 'Khai trương', 'Xuất hành'],
  'Chấp': ['Trồng cây', 'Làm vườn', 'Chăn nuôi', 'Xây tường'],
  'Phá': [],
  'Nguy': [],
  'Thành': ['Cưới hỏi', 'Khai trương', 'Nhập trạch', 'Ký kết', 'Xuất hành'],
  'Thu': ['Thu hoạch', 'Thu nợ', 'Giao dịch tài chính'],
  'Khai': ['Khởi nghiệp', 'Xuất hành', 'Khai trương', 'Đặt nền móng'],
  'Bế': [],
};

export const TRUC_AVOID: Record<string, string[]> = {
  'Kiến': ['Cưới hỏi', 'An táng', 'Xuất hành xa'],
  'Trừ': ['Xây dựng', 'Nhập trạch'],
  'Mãn': ['An táng', 'Kiện tụng'],
  'Bình': ['Khởi công quan trọng'],
  'Định': ['An táng'],
  'Chấp': ['Cưới hỏi', 'Nhập trạch'],
  'Phá': ['Tất cả việc quan trọng', 'Cưới hỏi', 'Xây dựng', 'Ký kết'],
  'Nguy': ['Tất cả việc quan trọng', 'Leo cao', 'Đi thuyền'],
  'Thành': [],
  'Thu': ['Xuất hành xa', 'Đầu tư mới'],
  'Khai': ['An táng', 'Chôn cất'],
  'Bế': ['Cưới hỏi', 'Khai trương', 'Mọi việc lớn'],
};

/**
 * Tính Trực ngày dựa vào Chi ngày và Chi tháng âm
 * Tháng Dần (tháng 1 âm) = Chi index 2
 * Chi tháng sang = Chi ngày → Kiến (index 0)
 */
export function getTruc(
  dd: number,
  mm: number,
  yyyy: number,
  lunarMonth: number
): string {
  const dayChiIdx = getDayChiIndex(dd, mm, yyyy);
  // Chi của tháng âm (Tháng 1 = Dần = chi 2)
  const monthChiIdx = (lunarMonth + 1) % 12;
  const trucIdx = (dayChiIdx - monthChiIdx + 12) % 12;
  return TRUC_LIST[trucIdx];
}

/**
 * Determine overall day quality using multiple factors:
 * 1. Trực quality
 * 2. Black/White day pattern (good lunar days)
 */
export function getDayQuality(
  dd: number,
  mm: number,
  yyyy: number,
  lunarDay: number,
  lunarMonth: number
): 'good' | 'bad' | 'normal' {
  const truc = getTruc(dd, mm, yyyy, lunarMonth);
  const trucQ = TRUC_QUALITY[truc];

  // Ngày đặc biệt tốt trong tháng âm
  const veryGoodDays = [1, 8, 15, 23];
  const badDays = [5, 14, 23]; // Some traditions mark these as bad
  const dayChiIdx = getDayChiIndex(dd, mm, yyyy);

  // Hắc đạo chi: Dần(2), Mão(3), Thân(8), Dậu(9) are less auspicious for starting things

  if (trucQ === 'good' && veryGoodDays.includes(lunarDay)) {
    return 'good';
  }
  if (trucQ === 'bad') {
    return 'bad';
  }
  if (trucQ === 'good') {
    return 'good';
  }
  return 'normal';
}
