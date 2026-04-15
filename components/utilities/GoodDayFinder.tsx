'use client';

import React, { useState, useMemo } from 'react';
import styles from './Utilities.module.css';
import { convertSolar2Lunar } from '@/lib/lunar';
import { getDayQuality, getTruc, TRUC_SUITABLE, TRUC_QUALITY } from '@/lib/goodday';
import { getYearCanChi, getDayCanChi } from '@/lib/canchi';

const EVENT_TYPES = [
  { id: 'cuoi', label: '💍 Cưới hỏi', keywords: ['Cưới hỏi'] },
  { id: 'khai-truong', label: '🏪 Khai trương', keywords: ['Khai trương'] },
  { id: 'xuat-hanh', label: '✈️ Xuất hành', keywords: ['Xuất hành'] },
  { id: 'dong-tho', label: '🏗️ Động thổ / Khởi công', keywords: ['Xây dựng', 'Khởi công'] },
  { id: 'nhap-trach', label: '🏠 Nhập trạch', keywords: ['Nhập trạch'] },
];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const DAY_VN = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export default function GoodDayFinder() {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [eventType, setEventType] = useState(EVENT_TYPES[0].id);
  const [fromDate, setFromDate] = useState(todayStr);
  const [toDate, setToDate] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [results, setResults] = useState<null | {
    date: Date;
    lunarDay: number;
    lunarMonth: number;
    lunarYear: number;
    truc: string;
    dayCC: string;
    quality: 'good' | 'bad' | 'normal';
  }[]>(null);

  const selectedEvent = EVENT_TYPES.find(e => e.id === eventType)!;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const maxDays = 90;
    const goods = [];

    let cur = new Date(start);
    let count = 0;
    while (cur <= end && count < maxDays) {
      const dd = cur.getDate();
      const mm = cur.getMonth() + 1;
      const yyyy = cur.getFullYear();
      const [ld, lm, ly] = convertSolar2Lunar(dd, mm, yyyy);
      const truc = getTruc(dd, mm, yyyy, lm);
      const quality = getDayQuality(dd, mm, yyyy, ld, lm);
      const suitable = TRUC_SUITABLE[truc] ?? [];
      const matches = selectedEvent.keywords.some(kw =>
        suitable.some(s => s.includes(kw) || kw.includes(s))
      );

      if (quality === 'good' && matches) {
        const dayCC = getDayCanChi(dd, mm, yyyy);
        goods.push({ date: new Date(cur), lunarDay: ld, lunarMonth: lm, lunarYear: ly, truc, dayCC: dayCC.full, quality });
      }

      cur = addDays(cur, 1);
      count++;
    }

    setResults(goods);
  }

  return (
    <div className={styles.utility}>
      <h2 className={styles.utilTitle}>📅 Chọn Ngày Tốt</h2>

      <form onSubmit={handleSearch} className={styles.form}>
        {/* Event type */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Loại sự kiện</label>
          <div className={styles.eventTypes}>
            {EVENT_TYPES.map(et => (
              <button
                key={et.id}
                type="button"
                className={`${styles.eventTypeBtn} ${eventType === et.id ? styles.eventTypeBtnActive : ''}`}
                onClick={() => setEventType(et.id)}
                id={`event-${et.id}`}
              >
                {et.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className={styles.dateRange}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="from-date">Từ ngày</label>
            <input
              type="date"
              id="from-date"
              className={styles.input}
              value={fromDate}
              min={todayStr}
              onChange={e => setFromDate(e.target.value)}
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="to-date">Đến ngày</label>
            <input
              type="date"
              id="to-date"
              className={styles.input}
              value={toDate}
              min={fromDate}
              onChange={e => setToDate(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} id="goodday-search-btn">
          Tìm ngày tốt
        </button>
      </form>

      {/* Results */}
      {results !== null && (
        <div className={styles.results}>
          {results.length === 0 ? (
            <div className={styles.noResult}>
              Không tìm thấy ngày tốt phù hợp trong khoảng thời gian này.
              Thử mở rộng thêm khoảng ngày nhé!
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                Tìm thấy <strong>{results.length}</strong> ngày tốt cho {selectedEvent.label}
              </div>
              <div className={styles.resultList}>
                {results.map((r, i) => (
                  <div key={i} className={styles.resultCard}>
                    <div className={styles.resultLeft}>
                      <div className={styles.resultDow}>{DAY_VN[r.date.getDay()]}</div>
                      <div className={styles.resultDate}>{formatDate(r.date)}</div>
                      <div className={styles.resultLunar}>
                        {r.lunarDay}/{r.lunarMonth} âm lịch
                      </div>
                    </div>
                    <div className={styles.resultRight}>
                      <div className={styles.resultTruc}>Trực {r.truc}</div>
                      <div className={styles.resultCC}>{r.dayCC}</div>
                      <div className={styles.goodBadge}>✅ Tốt</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
