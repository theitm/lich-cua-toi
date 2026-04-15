'use client';

import React, { useMemo } from 'react';
import styles from './DayDetail.module.css';
import { convertSolar2Lunar } from '@/lib/lunar';
import { getYearCanChi, getDayCanChi, getMonthCanChi } from '@/lib/canchi';
import { getHoangDaoHours, getCurrentHourIndex } from '@/lib/hoangdao';
import { getTruc, TRUC_QUALITY, TRUC_SUITABLE, TRUC_AVOID } from '@/lib/goodday';
import { getLunarEvents, getTietKhi, DAY_NAMES_VI, LUNAR_MONTH_NAMES } from '@/lib/data';

interface DayDetailProps {
  date: Date;
}

const ELEMENT_COLOR: Record<string, string> = {
  'Kim': '#C0A030',
  'Mộc': '#16A34A',
  'Thủy': '#2563EB',
  'Hỏa': '#DC2626',
  'Thổ': '#A16207',
};

const ELEMENT_BG: Record<string, string> = {
  'Kim': '#FFFBEB', 'Mộc': '#F0FDF4', 'Thủy': '#EFF6FF',
  'Hỏa': '#FFF5F5', 'Thổ': '#FEFCE8',
};

export default function DayDetail({ date }: DayDetailProps) {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();

  const data = useMemo(() => {
    const [ld, lm, ly, leap] = convertSolar2Lunar(dd, mm, yyyy);
    const yearCC = getYearCanChi(ly);
    const monthCC = getMonthCanChi(lm, ly);
    const dayCC = getDayCanChi(dd, mm, yyyy);
    const truc = getTruc(dd, mm, yyyy, lm);
    const trucQuality = TRUC_QUALITY[truc];
    const suitable = TRUC_SUITABLE[truc] ?? [];
    const avoid = TRUC_AVOID[truc] ?? [];
    const hours = getHoangDaoHours(dd, mm, yyyy);
    const events = getLunarEvents(ld, lm);
    const tietKhi = getTietKhi(mm, dd);

    return {
      ld, lm, ly, leap,
      yearCC, monthCC, dayCC,
      truc, trucQuality, suitable, avoid,
      hours, events, tietKhi,
    };
  }, [dd, mm, yyyy]);

  const nowHourIdx = getCurrentHourIndex(new Date());
  const dowName = DAY_NAMES_VI[date.getDay()];

  const qualityConfig = {
    good: { label: 'Ngày Tốt', color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' },
    bad:  { label: 'Ngày Xấu', color: '#DC2626', bg: '#FFF5F5', border: '#FECACA' },
    normal: { label: 'Ngày Bình Thường', color: '#1A56A4', bg: '#EEF3FF', border: '#93C5FD' },
  };
  const qc = qualityConfig[data.trucQuality];

  return (
    <div className={styles.container} id="day-detail-panel">
      {/* Date header */}
      <div className={styles.dateHeader}>
        <div className={styles.solarBig}>
          <span className={styles.dow}>{dowName}</span>
          <span className={styles.dayNum}>{dd}</span>
          <span className={styles.monthYear}>tháng {mm} năm {yyyy}</span>
        </div>
        <div
          className={styles.qualityBadge}
          style={{ background: qc.bg, color: qc.color, borderColor: qc.border }}
        >
          {qc.label} – {data.truc}
        </div>
      </div>

      {/* Lunar date */}
      <div className={styles.lunarBox}>
        <div className={styles.lunarMain}>
          <span className={styles.lunarLabel}>Âm lịch:</span>
          <span className={styles.lunarValue}>
            {data.ld} tháng {LUNAR_MONTH_NAMES[data.lm]}{data.leap ? ' (nhuận)' : ''}  năm {data.yearCC.full}
          </span>
        </div>
      </div>

      {/* Special events */}
      {(data.events.length > 0 || data.tietKhi) && (
        <div className={styles.eventsBox}>
          {data.tietKhi && (
            <div className={styles.eventTag} style={{ background: '#F5F0FF', color: '#7C3AED' }}>
              🌿 Tiết khí: {data.tietKhi}
            </div>
          )}
          {data.events.map((e, i) => (
            <div key={i} className={styles.eventTag} style={{ background: '#FFFBEB', color: '#92400E' }}>
              {e}
            </div>
          ))}
        </div>
      )}

      {/* Can Chi grid */}
      <div className={styles.canchiGrid}>
        <CanChiCard label="Năm" canchi={data.yearCC} />
        <CanChiCard label="Tháng" canchi={data.monthCC} />
        <CanChiCard label="Ngày" canchi={data.dayCC} />
      </div>

      {/* Suitable / Avoid */}
      {(data.suitable.length > 0 || data.avoid.length > 0) && (
        <div className={styles.suitSection}>
          {data.suitable.length > 0 && (
            <div className={styles.suitBox} style={{ background: '#F0FDF4' }}>
              <div className={styles.suitTitle} style={{ color: '#16A34A' }}>✅ Nên làm hôm nay</div>
              <div className={styles.suitTags}>
                {data.suitable.map((s, i) => (
                  <span key={i} className={styles.suitTag} style={{ background: '#DCFCE7', color: '#166534' }}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {data.avoid.length > 0 && (
            <div className={styles.suitBox} style={{ background: '#FFF5F5' }}>
              <div className={styles.suitTitle} style={{ color: '#DC2626' }}>❌ Không nên làm</div>
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
        <div className={styles.sectionTitle}>Giờ Hoàng Đạo & Hắc Đạo</div>
        <div className={styles.hoursGrid}>
          {data.hours.map((h) => (
            <div
              key={h.index}
              className={`${styles.hourCell} ${h.isHoangDao ? styles.hoangDao : styles.hackDao} ${h.index === nowHourIdx ? styles.currentHour : ''}`}
            >
              <span className={styles.hourName}>{h.name}</span>
              <span className={styles.hourRange}>{h.timeRange}</span>
              <span className={styles.hourCanChi}>{h.canChi}</span>
              <span className={styles.hourLabel}>{h.isHoangDao ? 'H.Đạo' : 'H.Đạo'}</span>
            </div>
          ))}
        </div>
        <div className={styles.hoursLegend}>
          <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#16A34A'}}></span> Hoàng Đạo</span>
          <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#DC2626'}}></span> Hắc Đạo</span>
          <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#1A56A4', border:'2px solid #fff', outline:'2px solid #1A56A4'}}></span> Giờ hiện tại</span>
        </div>
      </div>
    </div>
  );
}

function CanChiCard({ label, canchi }: { label: string; canchi: { can: string; chi: string; full: string; element: string } }) {
  const color = ELEMENT_COLOR[canchi.element] ?? '#333';
  return (
    <div className={styles.ccCard} style={{ background: ELEMENT_BG[canchi.element] ?? '#F9FAFB' }}>
      <div className={styles.ccLabel}>{label}</div>
      <div className={styles.ccFull}>{canchi.full}</div>
      <div className={styles.ccElement} style={{ color }}>
        {canchi.element}
      </div>
    </div>
  );
}

