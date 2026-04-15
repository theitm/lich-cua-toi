import { HourInfo } from './types';
import { getDayChiIndex, getDayCanIndex, getHourCanChi } from './canchi';

// 12 giờ Can Chi với khoảng thời gian
export const GIO_CHI = [
  { name: 'Tý',  range: '23:00 – 01:00' },
  { name: 'Sửu', range: '01:00 – 03:00' },
  { name: 'Dần', range: '03:00 – 05:00' },
  { name: 'Mão', range: '05:00 – 07:00' },
  { name: 'Thìn', range: '07:00 – 09:00' },
  { name: 'Tỵ',  range: '09:00 – 11:00' },
  { name: 'Ngọ', range: '11:00 – 13:00' },
  { name: 'Mùi', range: '13:00 – 15:00' },
  { name: 'Thân', range: '15:00 – 17:00' },
  { name: 'Dậu', range: '17:00 – 19:00' },
  { name: 'Tuất', range: '19:00 – 21:00' },
  { name: 'Hợi', range: '21:00 – 23:00' },
];

/**
 * Giờ Hoàng Đạo theo Chi ngày
 * Pattern: dựa theo lịch truyền thống Việt Nam
 * Mỗi row là Chi ngày (Tý=0 đến Hợi=11),
 * mỗi phần tử là array 12 index giờ Hoàng Đạo
 */
const HOANG_DAO_BY_CHI: number[][] = [
  // Tý (0):  Tý, Sửu, Mão, Ngọ, Thân, Dậu
  [0, 1, 3, 6, 8, 9],
  // Sửu (1): Dần, Mão, Tỵ, Thân, Tuất, Hợi
  [2, 3, 5, 8, 10, 11],
  // Dần (2): Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
  [0, 1, 4, 5, 7, 10],
  // Mão (3): Dần, Thìn, Ngọ, Mùi, Dậu, Hợi
  [2, 4, 6, 7, 9, 11],
  // Thìn (4): Tý, Mão, Thìn, Ngọ, Dậu, Tuất
  [0, 3, 4, 6, 9, 10],
  // Tỵ (5): Sửu, Dần, Mão, Ngọ, Mùi, Tuất
  [1, 2, 3, 6, 7, 10],
  // Ngọ (6): Tý, Sửu, Mão, Ngọ, Thân, Dậu  (same as Tý)
  [0, 1, 3, 6, 8, 9],
  // Mùi (7): Dần, Mão, Tỵ, Thân, Tuất, Hợi (same as Sửu)
  [2, 3, 5, 8, 10, 11],
  // Thân (8): Tý, Sửu, Thìn, Tỵ, Mùi, Tuất (same as Dần)
  [0, 1, 4, 5, 7, 10],
  // Dậu (9): Dần, Thìn, Ngọ, Mùi, Dậu, Hợi (same as Mão)
  [2, 4, 6, 7, 9, 11],
  // Tuất (10): Tý, Mão, Thìn, Ngọ, Dậu, Tuất (same as Thìn)
  [0, 3, 4, 6, 9, 10],
  // Hợi (11): Sửu, Dần, Mão, Ngọ, Mùi, Tuất (same as Tỵ)
  [1, 2, 3, 6, 7, 10],
];

export function getHoangDaoHours(
  dd: number,
  mm: number,
  yyyy: number
): HourInfo[] {
  const dayChiIdx = getDayChiIndex(dd, mm, yyyy);
  const dayCanIdx = getDayCanIndex(dd, mm, yyyy);
  const hoangDaoSet = new Set(HOANG_DAO_BY_CHI[dayChiIdx]);

  return GIO_CHI.map((g, idx) => ({
    index: idx,
    name: g.name,
    timeRange: g.range,
    canChi: getHourCanChi(idx, dayCanIdx),
    isHoangDao: hoangDaoSet.has(idx),
  }));
}

/** Get current hour index (0=Tý, 1=Sửu...) from a Date */
export function getCurrentHourIndex(date: Date): number {
  const h = date.getHours();
  if (h === 23) return 0;
  return Math.floor((h + 1) / 2);
}
