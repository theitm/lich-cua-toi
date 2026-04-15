import { PersonInfo, CompatibilityResult } from './types';
import {
  CAN, CHI, ZODIAC_VN,
  getYearCanChi, getZodiacFromYear, getChiFromYear, getCanFromYear,
  getMenhFromYear,
} from './canchi';

const CURRENT_YEAR = new Date().getFullYear();

// 9 Cung Mệnh (Bát quái + Trung cung)
const CUNG_MENH_NAMES = [
  '', // 0 - unused
  'Khảm',   // 1
  'Khôn',   // 2
  'Chấn',   // 3
  'Tốn',    // 4
  'Trung Cung', // 5 - redirected
  'Càn',    // 6
  'Đoài',   // 7
  'Cấn',    // 8
  'Ly',     // 9
];

// Mệnh của cung
const CUNG_MENH_ELEMENT: Record<number, string> = {
  1: 'Thủy', 2: 'Thổ', 3: 'Mộc', 4: 'Mộc',
  6: 'Kim', 7: 'Kim', 8: 'Thổ', 9: 'Hỏa',
};

function sumDigits(n: number): number {
  let s = n;
  while (s >= 10) {
    s = String(s).split('').reduce((a, b) => a + Number(b), 0);
  }
  return s;
}

export function getCungMenh(year: number, gender: 'nam' | 'nu'): { num: number; name: string; menh: string } {
  const digitSum = sumDigits(year);
  let cung: number;

  if (year < 2000) {
    if (gender === 'nam') {
      cung = 10 - digitSum;
    } else {
      cung = 5 + digitSum;
      while (cung > 9) cung -= 9;
    }
  } else {
    if (gender === 'nam') {
      cung = 9 - digitSum;
      if (cung <= 0) cung += 9;
    } else {
      cung = 6 + digitSum;
      while (cung > 9) cung -= 9;
    }
  }

  if (cung <= 0) cung += 9;
  if (cung === 5) cung = gender === 'nam' ? 2 : 8;

  return {
    num: cung,
    name: CUNG_MENH_NAMES[cung] ?? 'Khảm',
    menh: CUNG_MENH_ELEMENT[cung] ?? 'Thổ',
  };
}

export function buildPersonInfo(
  birthYear: number,
  gender: 'nam' | 'nu'
): PersonInfo {
  const lunarYear = birthYear; // Approximate; for year-only calculation
  const canChi = getYearCanChi(birthYear);
  const chi = getChiFromYear(birthYear);
  const zodiac = getZodiacFromYear(birthYear);
  const menh = getMenhFromYear(birthYear);
  const cungInfo = getCungMenh(birthYear, gender);
  const age = CURRENT_YEAR - birthYear + 1; // Vietnamese count (tính tuổi âm)
  const ageAm = CURRENT_YEAR - birthYear + 1;

  return {
    birthYear,
    lunarYear,
    chi,
    zodiac,
    menh,
    cungMenh: cungInfo.name,
    cungMenhNum: cungInfo.num,
    age: CURRENT_YEAR - birthYear,
    ageAm,
  };
}

// =================== COMPATIBILITY ===================

// Lục Hợp (6 great harmonies) - pairs that combine well
const LUC_HOP: [string, string][] = [
  ['Tý', 'Sửu'], ['Dần', 'Hợi'], ['Mão', 'Tuất'],
  ['Thìn', 'Dậu'], ['Tỵ', 'Thân'], ['Ngọ', 'Mùi'],
];

// Lục Xung (6 conflicts)
const LUC_XUNG: [string, string][] = [
  ['Tý', 'Ngọ'], ['Sửu', 'Mùi'], ['Dần', 'Thân'],
  ['Mão', 'Dậu'], ['Thìn', 'Tuất'], ['Tỵ', 'Hợi'],
];

// Tam Hợp (3 harmonies - groups of 3)
const TAM_HOP_GROUPS: string[][] = [
  ['Thân', 'Tý', 'Thìn'],
  ['Dần', 'Ngọ', 'Tuất'],
  ['Tỵ', 'Dậu', 'Sửu'],
  ['Hợi', 'Mão', 'Mùi'],
];

// Tứ Hành Xung (4 conflicts in groups)
const TU_HANH_XUNG_GROUPS: string[][] = [
  ['Dần', 'Thân', 'Tỵ', 'Hợi'],
  ['Tý', 'Ngọ', 'Mão', 'Dậu'],
  ['Thìn', 'Tuất', 'Sửu', 'Mùi'],
];

function isSamePair(a: string, b: string, pair: [string, string]): boolean {
  return (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a);
}

function inSameGroup(a: string, b: string, groups: string[][]): boolean {
  return groups.some(g => g.includes(a) && g.includes(b));
}

export function checkCompatibility(
  chi1: string,
  chi2: string
): { relation: CompatibilityResult['relation']; score: number; label: string; description: string; color: string } {
  if (LUC_HOP.some(p => isSamePair(chi1, chi2, p))) {
    return {
      relation: 'luc-hop',
      score: 85,
      label: '💛 Lục Hợp',
      description: `${chi1} và ${chi2} là cặp Lục Hợp — hòa hợp, bổ trợ nhau tốt. Hợp trong công việc, cuộc sống gia đình, và tình cảm.`,
      color: '#E8A020',
    };
  }

  if (inSameGroup(chi1, chi2, TAM_HOP_GROUPS)) {
    return {
      relation: 'tam-hop',
      score: 95,
      label: '💚 Tam Hợp',
      description: `${chi1} và ${chi2} thuộc nhóm Tam Hợp — đây là mối lương duyên rất tốt. Hiểu nhau sâu sắc, hỗ trợ lẫn nhau vượt qua khó khăn.`,
      color: '#16A34A',
    };
  }

  if (LUC_XUNG.some(p => isSamePair(chi1, chi2, p))) {
    return {
      relation: 'luc-xung',
      score: 30,
      label: '🔴 Lục Xung',
      description: `${chi1} và ${chi2} là cặp Lục Xung — hay bất đồng ý kiến, dễ xảy ra mâu thuẫn. Cần thông cảm và nhường nhịn nhau nhiều hơn.`,
      color: '#DC2626',
    };
  }

  if (inSameGroup(chi1, chi2, TU_HANH_XUNG_GROUPS)) {
    return {
      relation: 'tu-hanh-xung',
      score: 20,
      label: '❌ Tứ Hành Xung',
      description: `${chi1} và ${chi2} thuộc nhóm Tứ Hành Xung — tính cách trái chiều, khó hòa hợp. Cần rất nhiều nỗ lực từ cả hai phía.`,
      color: '#991B1B',
    };
  }

  return {
    relation: 'binh-thuong',
    score: 60,
    label: '🔵 Bình Thường',
    description: `${chi1} và ${chi2} không có mối tương quan đặc biệt — quan hệ tương đối hòa hợp, phụ thuộc vào sự cố gắng của cả hai.`,
    color: '#1A56A4',
  };
}

export function getFullCompatibility(
  p1: PersonInfo,
  p2: PersonInfo
): CompatibilityResult {
  const compat = checkCompatibility(p1.chi, p2.chi);
  return {
    person1: p1,
    person2: p2,
    ...compat,
  };
}

// Cung Mệnh compatibility (Đông Tứ Mệnh / Tây Tứ Mệnh)
const DONG_TU_MENH = [1, 3, 4, 9]; // Khảm, Chấn, Tốn, Ly
const TAY_TU_MENH = [2, 6, 7, 8];  // Khôn, Càn, Đoài, Cấn

export function getCungMenhCompatibility(cung1: number, cung2: number): string {
  const same1 = DONG_TU_MENH.includes(cung1);
  const same2 = DONG_TU_MENH.includes(cung2);
  if (same1 === same2) {
    return 'Hợp cung mệnh (cùng nhóm Đông Tứ Mệnh hoặc Tây Tứ Mệnh)';
  }
  return 'Khắc cung mệnh (khác nhóm Đông/Tây Tứ Mệnh)';
}
