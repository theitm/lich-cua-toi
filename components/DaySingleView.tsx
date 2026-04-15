'use client';

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import styles from './DaySingleView.module.css';
import { convertSolar2Lunar } from '@/lib/lunar';
import { getYearCanChi, getDayCanChi, getMonthCanChi } from '@/lib/canchi';
import { getHoangDaoHours, getCurrentHourIndex } from '@/lib/hoangdao';
import { getTruc, TRUC_QUALITY, TRUC_SUITABLE, TRUC_AVOID } from '@/lib/goodday';
import { getLunarEvents, getTietKhi, DAY_NAMES_VI, LUNAR_MONTH_NAMES } from '@/lib/data';

interface DaySingleViewProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onGoToMonth: () => void;
}

const ELEMENT_COLOR: Record<string, string> = {
  'Kim': '#B45309', 'Mộc': '#15803D', 'Thủy': '#1D4ED8', 'Hỏa': '#B91C1C', 'Thổ': '#92400E',
};
const ELEMENT_BG: Record<string, string> = {
  'Kim': '#FFFBEB', 'Mộc': '#F0FDF4', 'Thủy': '#EFF6FF', 'Hỏa': '#FFF5F5', 'Thổ': '#FEFCE8',
};

export default function DaySingleView({ date, onPrev, onNext, onGoToMonth }: DaySingleViewProps) {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();
  const today = useMemo(() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }, []);
  const isToday = date.getTime() === today.getTime();

  const [nowHourIdx, setNowHourIdx] = useState(() => getCurrentHourIndex(new Date()));
  useEffect(() => {
    const timer = setInterval(() => setNowHourIdx(getCurrentHourIndex(new Date())), 60000);
    return () => clearInterval(timer);
  }, []);

  const data = useMemo(() => {
    const [ld, lm, ly, leap] = convertSolar2Lunar(dd, mm, yyyy);
    const yearCC = getYearCanChi(ly);
    const monthCC = getMonthCanChi(lm, ly);
    const dayCC = getDayCanChi(dd, mm, yyyy);
    const truc = getTruc(dd, mm, yyyy, lm);
    const trucQuality = TRUC_QUALITY[truc] ?? 'normal';
    const suitable = TRUC_SUITABLE[truc] ?? [];
    const avoid = TRUC_AVOID[truc] ?? [];
    const hours = getHoangDaoHours(dd, mm, yyyy);
    const events = getLunarEvents(ld, lm);
    const tietKhi = getTietKhi(mm, dd);
    return { ld, lm, ly, leap, yearCC, monthCC, dayCC, truc, trucQuality, suitable, avoid, hours, events, tietKhi };
  }, [dd, mm, yyyy]);

  // Swipe gesture support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? onNext() : onPrev(); }
    touchStartX.current = null;
  };

  const qConfig = {
    good:   { label: 'Ngày Tốt',         color: '#15803D', bg: '#F0FDF4', border: '#86EFAC', icon: '✅' },
    bad:    { label: 'Ngày Xấu',          color: '#B91C1C', bg: '#FFF5F5', border: '#FECACA', icon: '⚠️' },
    normal: { label: 'Ngày Bình Thường',  color: '#1A56A4', bg: '#EEF3FF', border: '#BFDBFE', icon: '🔵' },
  };
  const qc = qConfig[data.trucQuality];
  const dowName = DAY_NAMES_VI[date.getDay()];
  const isSunday = date.getDay() === 0;

  return (
    <div
      className={styles.page}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Day navigation */}
      <div className={styles.nav}>
        <button className={styles.navArrow} onClick={onPrev} aria-label="Ngày trước" id="prev-day-btn">‹</button>

        <button className={styles.navCenter} onClick={onGoToMonth} id="goto-month-btn" title="Xem lịch tháng">
          <span className={styles.navDow} style={isSunday ? { color: '#DC2626' } : {}}>
            {isToday ? '📍 Hôm nay' : dowName}
          </span>
          <span className={styles.navDateStr}>
            {dd} / {mm} / {yyyy}
          </span>
          <span className={styles.navMonthHint}>Xem lịch tháng →</span>
        </button>

        <button className={styles.navArrow} onClick={onNext} aria-label="Ngày sau" id="next-day-btn">›</button>
      </div>

      {/* Hero date card */}
      <div className={styles.heroCard} style={{ background: qc.bg, borderColor: qc.border }}>
        <div className={styles.heroTop}>
          <div className={styles.heroDow} style={isSunday ? { color: '#DC2626' } : {}}>
            {isToday ? 'Hôm nay, ' : ''}{dowName}
          </div>
          <div className={styles.heroSolar}>
            <span className={styles.heroDay}>{dd}</span>
            <div className={styles.heroMonthYear}>
              <span>tháng {mm}</span>
              <span>{yyyy}</span>
            </div>
          </div>
        </div>

        <div className={styles.heroLunar}>
          <span className={styles.heroLunarIcon}>🌙</span>
          <span className={styles.heroLunarText}>
            {data.ld} tháng {LUNAR_MONTH_NAMES[data.lm]}{data.leap ? ' (nhuận)' : ''} năm {data.yearCC.full}
          </span>
        </div>

        {/* Events strip */}
        {(data.events.length > 0 || data.tietKhi) && (
          <div className={styles.heroEvents}>
            {data.tietKhi && (
              <span className={styles.heroBadge} style={{ background: '#EDE9FE', color: '#6D28D9' }}>
                🌿 {data.tietKhi}
              </span>
            )}
            {data.events.map((e, i) => (
              <span key={i} className={styles.heroBadge} style={{ background: '#FFFBEB', color: '#92400E' }}>{e}</span>
            ))}
          </div>
        )}
      </div>

      {/* Quality + Trực */}
      <div className={styles.qualityRow}>
        <div className={styles.qualityBadge} style={{ background: qc.bg, color: qc.color, borderColor: qc.border }}>
          {qc.icon} {qc.label}
        </div>
        <div className={styles.trucBadge}>Trực <strong>{data.truc}</strong></div>
      </div>

      {/* Can Chi row */}
      <div className={styles.canchiRow}>
        {[
          { label: 'Năm', cc: data.yearCC },
          { label: 'Tháng', cc: data.monthCC },
          { label: 'Ngày', cc: data.dayCC },
        ].map(({ label, cc }) => (
          <div key={label} className={styles.canchiCard} style={{ background: ELEMENT_BG[cc.element] ?? '#F9F9F9' }}>
            <div className={styles.canchiLabel}>{label}</div>
            <div className={styles.canchiValue}>{cc.full}</div>
            <div className={styles.canchiElement} style={{ color: ELEMENT_COLOR[cc.element] ?? '#333' }}>
              {cc.element}
            </div>
          </div>
        ))}
      </div>

      {/* Suitable / Avoid */}
      {(data.suitable.length > 0 || data.avoid.length > 0) && (
        <div className={styles.suitRow}>
          {data.suitable.length > 0 && (
            <div className={styles.suitCard} style={{ background: '#F0FDF4' }}>
              <div className={styles.suitTitle} style={{ color: '#15803D' }}>✅ Nên làm</div>
              <div className={styles.suitTags}>
                {data.suitable.map((s, i) => (
                  <span key={i} className={styles.suitTag} style={{ background: '#DCFCE7', color: '#166534' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {data.avoid.length > 0 && (
            <div className={styles.suitCard} style={{ background: '#FFF5F5' }}>
              <div className={styles.suitTitle} style={{ color: '#B91C1C' }}>❌ Không nên</div>
              <div className={styles.suitTags}>
                {data.avoid.map((a, i) => (
                  <span key={i} className={styles.suitTag} style={{ background: '#FEE2E2', color: '#991B1B' }}>{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Giờ Hoàng Đạo */}
      <div className={styles.hoursSection}>
        <div className={styles.sectionTitle}>⏰ Giờ Hoàng Đạo & Hắc Đạo</div>
        <div className={styles.hoursGrid}>
          {data.hours.map((h) => (
            <div
              key={h.index}
              className={[
                styles.hourCell,
                h.isHoangDao ? styles.hoangDao : styles.hackDao,
                h.index === nowHourIdx ? styles.currentHour : '',
              ].join(' ')}
            >
              <span className={styles.hourName}>{h.name}</span>
              <span className={styles.hourRange}>{h.timeRange}</span>
              <span className={styles.hourCC}>{h.canChi}</span>
              <span className={styles.hourStatus} style={{ color: h.isHoangDao ? '#15803D' : '#B91C1C' }}>
                {h.isHoangDao ? 'H.Đạo' : 'H.Đạo'}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.hoursLegend}>
          <span><span className={styles.dot} style={{ background: '#15803D' }} /> Hoàng Đạo</span>
          <span><span className={styles.dot} style={{ background: '#B91C1C' }} /> Hắc Đạo</span>
          {isToday && <span><span className={styles.dot} style={{ background: '#1A56A4', outline: '2px solid #1A56A4', outlineOffset: '1px' }} /> Giờ hiện tại</span>}
        </div>
      </div>

      {/* Swipe hint (only show first time) */}
      <div className={styles.swipeHint}>← Vuốt để chuyển ngày →</div>
    </div>
  );
}
