import { CanChiInfo } from './types';
import { getJDN } from './lunar';

export const CAN = [
  'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu',
  'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý',
];

export const CHI = [
  'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ',
  'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi',
];

export const ZODIAC_VN = [
  'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn',
  'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn',
];

// Ngũ hành của Can
export const CAN_ELEMENT: Record<string, string> = {
  'Giáp': 'Mộc', 'Ất': 'Mộc',
  'Bính': 'Hỏa', 'Đinh': 'Hỏa',
  'Mậu': 'Thổ', 'Kỷ': 'Thổ',
  'Canh': 'Kim', 'Tân': 'Kim',
  'Nhâm': 'Thủy', 'Quý': 'Thủy',
};

// Ngũ hành của Chi
export const CHI_ELEMENT: Record<string, string> = {
  'Tý': 'Thủy', 'Ngọ': 'Hỏa',
  'Sửu': 'Thổ', 'Mùi': 'Thổ',
  'Dần': 'Mộc', 'Thân': 'Kim',
  'Mão': 'Mộc', 'Dậu': 'Kim',
  'Thìn': 'Thổ', 'Tuất': 'Thổ',
  'Tỵ': 'Hỏa', 'Hợi': 'Thủy',
};

export function getYearCanChi(year: number): CanChiInfo {
  const canIdx = (year + 6) % 10;
  const chiIdx = (year + 8) % 12;
  const can = CAN[canIdx];
  const chi = CHI[chiIdx];
  return {
    can,
    chi,
    full: `${can} ${chi}`,
    element: CAN_ELEMENT[can],
  };
}

// Tháng âm lịch → Can Chi (dựa vào Can của năm)
export function getMonthCanChi(lunarMonth: number, lunarYear: number): CanChiInfo {
  // Can tháng = (can_năm * 2 + tháng) % 10
  // Tháng 1 âm = Dần (chi index 2)
  const yearCanIdx = (lunarYear + 6) % 10;
  const monthCanBase = (yearCanIdx % 5) * 2;
  const canIdx = (monthCanBase + lunarMonth - 1) % 10;
  // Chi tháng: tháng 1 = Dần (2), tháng 2 = Mão (3), ...
  const chiIdx = (lunarMonth + 1) % 12; // Dần=2, offset by 2
  const actualChiIdx = (lunarMonth - 1 + 2) % 12;
  const can = CAN[canIdx];
  const chi = CHI[actualChiIdx];
  return {
    can,
    chi,
    full: `${can} ${chi}`,
    element: CAN_ELEMENT[can],
  };
}

export function getDayCanChi(dd: number, mm: number, yyyy: number): CanChiInfo {
  const jdn = getJDN(dd, mm, yyyy);
  const canIdx = (jdn + 9) % 10;
  const chiIdx = (jdn + 1) % 12;
  const can = CAN[canIdx];
  const chi = CHI[chiIdx];
  return {
    can,
    chi,
    full: `${can} ${chi}`,
    element: CAN_ELEMENT[can],
  };
}

export function getHourCanChi(hourIndex: number, dayCanIdx: number): string {
  // Can giờ: dựa vào can ngày
  // Giáp/Kỷ ngày → Tý giờ = Giáp Tý
  const baseCanIdx = (dayCanIdx % 5) * 2;
  const canIdx = (baseCanIdx + hourIndex) % 10;
  return `${CAN[canIdx]} ${CHI[hourIndex]}`;
}

export function getDayCanIndex(dd: number, mm: number, yyyy: number): number {
  const jdn = getJDN(dd, mm, yyyy);
  return (jdn + 9) % 10;
}

export function getDayChiIndex(dd: number, mm: number, yyyy: number): number {
  const jdn = getJDN(dd, mm, yyyy);
  return (jdn + 1) % 12;
}

export function getZodiacFromYear(year: number): string {
  return ZODIAC_VN[(year + 8) % 12];
}

export function getChiFromYear(year: number): string {
  return CHI[(year + 8) % 12];
}

export function getCanFromYear(year: number): string {
  return CAN[(year + 6) % 10];
}

/** Mệnh (ngũ hành) based on Can Chi year pair */
const MENH_MAP: string[] = [
  // Giáp Tý, Ất Sửu → Kim
  'Kim', 'Kim',
  // Bính Dần, Đinh Mão → Hỏa
  'Hỏa', 'Hỏa',
  // Mậu Thìn, Kỷ Tỵ → Mộc
  'Mộc', 'Mộc',
  // Canh Ngọ, Tân Mùi → Thổ
  'Thổ', 'Thổ',
  // Nhâm Thân, Quý Dậu → Kim
  'Kim', 'Kim',
  // Giáp Tuất, Ất Hợi → Hỏa
  'Hỏa', 'Hỏa',
  // Bính Tý, Đinh Sửu → Thủy
  'Thủy', 'Thủy',
  // Mậu Dần, Kỷ Mão → Thổ
  'Thổ', 'Thổ',
  // Canh Thìn, Tân Tỵ → Kim
  'Kim', 'Kim',
  // Nhâm Ngọ, Quý Mùi → Mộc
  'Mộc', 'Mộc',
  // Giáp Thân, Ất Dậu → Thủy (Giáp Thân = 60-year cycle position 21)
  'Thủy', 'Thủy',
  // Bính Tuất, Đinh Hợi → Thổ
  'Thổ', 'Thổ',
  // Mậu Tý, Kỷ Sửu → Hỏa
  'Hỏa', 'Hỏa',
  // Canh Dần, Tân Mão → Mộc
  'Mộc', 'Mộc',
  // Nhâm Thìn, Quý Tỵ → Thủy
  'Thủy', 'Thủy',
  // Giáp Ngọ, Ất Mùi → Kim
  'Kim', 'Kim',
  // Bính Thân, Đinh Dậu → Hỏa
  'Hỏa', 'Hỏa',
  // Mậu Tuất, Kỷ Hợi → Mộc
  'Mộc', 'Mộc',
  // Canh Tý, Tân Sửu → Thổ
  'Thổ', 'Thổ',
  // Nhâm Dần, Quý Mão → Kim
  'Kim', 'Kim',
  // Giáp Thìn, Ất Tỵ → Hỏa
  'Hỏa', 'Hỏa',
  // Bính Ngọ, Đinh Mùi → Thủy
  'Thủy', 'Thủy',
  // Mậu Thân, Kỷ Dậu → Thổ
  'Thổ', 'Thổ',
  // Canh Tuất, Tân Hợi → Kim
  'Kim', 'Kim',
  // Nhâm Tý, Quý Sửu → Mộc
  'Mộc', 'Mộc',
  // Giáp Dần, Ất Mão → Thủy
  'Thủy', 'Thủy',
  // Bính Thìn, Đinh Tỵ → Thổ
  'Thổ', 'Thổ',
  // Mậu Ngọ, Kỷ Mùi → Hỏa
  'Hỏa', 'Hỏa',
  // Canh Thân, Tân Dậu → Mộc
  'Mộc', 'Mộc',
  // Nhâm Tuất, Quý Hợi → Thủy
  'Thủy', 'Thủy',
];

export function getMenhFromYear(year: number): string {
  // 60-year cycle position
  const pos = ((year - 4) % 60 + 60) % 60;
  return MENH_MAP[pos] ?? 'Thổ';
}
