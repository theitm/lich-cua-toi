export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
}

export interface CanChiInfo {
  can: string;
  chi: string;
  full: string;
  element: string; // Ngũ hành
}

export interface HourInfo {
  index: number; // 0–11  (Tý=0, Sửu=1, ...)
  name: string;  // e.g. "Tý"
  timeRange: string; // e.g. "23:00 – 01:00"
  canChi: string;
  isHoangDao: boolean;
}

export interface DayInfo {
  // Solar
  solarDate: Date;
  // Lunar
  lunar: LunarDate;
  // Can Chi
  yearCanChi: CanChiInfo;
  monthCanChi: CanChiInfo;
  dayCanChi: CanChiInfo;
  // Quality
  truc: string;       // e.g. "Kiến", "Định", "Thành"
  trucQuality: 'good' | 'bad' | 'normal';
  dayQuality: 'good' | 'bad' | 'normal';
  suitableFor: string[];
  avoidFor: string[];
  // Hours
  hours: HourInfo[];
  // Special
  tietKhi: string | null;
  specialEvent: string | null;
}

export interface PersonInfo {
  name?: string;
  birthYear: number;
  lunarYear: number;
  chi: string;
  zodiac: string;
  menh: string; // Mệnh (ngũ hành)
  cungMenh: string; // Cung mệnh (Bát quái)
  cungMenhNum: number;
  age: number;  // tuổi dương
  ageAm: number; // tuổi âm (Vietnamese count)
}

export interface CompatibilityResult {
  person1: PersonInfo;
  person2: PersonInfo;
  relation: 'luc-hop' | 'luc-xung' | 'tam-hop' | 'tu-hanh-xung' | 'binh-thuong';
  score: number; // 0–100
  label: string;
  description: string;
  color: string;
}
