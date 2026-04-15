'use client';

import React, { useMemo, useCallback } from 'react';
import styles from './CalendarGrid.module.css';
import { convertSolar2Lunar } from '@/lib/lunar';
import { getLunarEvents, getTietKhi, LUNAR_MONTH_NAMES, MONTH_NAMES_VI } from '@/lib/data';
import { getDayQuality, getTruc } from '@/lib/goodday';

const DOW_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

interface CalendarGridProps {
  year: number;
  month: number; // 1–12
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

interface DayCell {
  date: Date;
  inMonth: boolean;
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeap: boolean;
  quality: 'good' | 'bad' | 'normal';
  hasEvent: boolean;
  tietKhi: string | null;
  isToday: boolean;
}

export default function CalendarGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarGridProps) {
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const cells = useMemo<DayCell[]>(() => {
    const firstDay = new Date(year, month - 1, 1);
    const startDow = firstDay.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const result: DayCell[] = [];

    // Previous month cells
    for (let i = startDow - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const date = new Date(prevYear, prevMonth - 1, day);
      const [ld, lm, ly, leap] = convertSolar2Lunar(day, prevMonth, prevYear);
      result.push({
        date,
        inMonth: false,
        lunarDay: ld,
        lunarMonth: lm,
        lunarYear: ly,
        isLeap: leap,
        quality: 'normal',
        hasEvent: false,
        tietKhi: null,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // Current month cells
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      const [ld, lm, ly, leap] = convertSolar2Lunar(d, month, year);
      const quality = getDayQuality(d, month, year, ld, lm);
      const events = getLunarEvents(ld, lm);
      const tietKhi = getTietKhi(month, d);
      result.push({
        date,
        inMonth: true,
        lunarDay: ld,
        lunarMonth: lm,
        lunarYear: ly,
        isLeap: leap,
        quality,
        hasEvent: events.length > 0,
        tietKhi,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // Next month fill
    const remaining = 42 - result.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const date = new Date(nextYear, nextMonth - 1, d);
      const [ld, lm, ly, leap] = convertSolar2Lunar(d, nextMonth, nextYear);
      result.push({
        date,
        inMonth: false,
        lunarDay: ld,
        lunarMonth: lm,
        lunarYear: ly,
        isLeap: leap,
        quality: 'normal',
        hasEvent: false,
        tietKhi: null,
        isToday: date.getTime() === today.getTime(),
      });
    }

    return result;
  }, [year, month, today]);

  const isSelected = useCallback(
    (date: Date) => selectedDate?.getTime() === date.getTime(),
    [selectedDate]
  );

  // Tên tháng âm của tháng hiện tại
  const [, lunarMonthMain] = useMemo(() => {
    return convertSolar2Lunar(15, month, year);
  }, [month, year]);

  return (
    <div className={styles.wrapper}>
      {/* Navigation */}
      <div className={styles.nav}>
        <button className={styles.navBtn} onClick={onPrevMonth} aria-label="Tháng trước">
          ‹
        </button>
        <div className={styles.navTitle}>
          <span className={styles.navMonth}>{MONTH_NAMES_VI[month]} {year}</span>
          <span className={styles.navLunar}>Tháng {LUNAR_MONTH_NAMES[lunarMonthMain]} âm lịch</span>
        </div>
        <button className={styles.navBtn} onClick={onNextMonth} aria-label="Tháng sau">
          ›
        </button>
        <button className={styles.todayBtn} onClick={onToday} id="today-btn">
          Hôm nay
        </button>
      </div>

      {/* Day of week headers */}
      <div className={styles.dowRow}>
        {DOW_LABELS.map((d, i) => (
          <div
            key={d}
            className={`${styles.dowCell} ${i === 0 ? styles.sunday : ''}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className={styles.grid}>
        {cells.map((cell, idx) => {
          const isSun = cell.date.getDay() === 0;
          const isSat = cell.date.getDay() === 6;
          const selected = isSelected(cell.date);

          return (
            <button
              key={idx}
              className={[
                styles.cell,
                !cell.inMonth ? styles.cellFaded : '',
                cell.isToday ? styles.cellToday : '',
                selected ? styles.cellSelected : '',
                cell.quality === 'good' && cell.inMonth ? styles.cellGood : '',
                cell.quality === 'bad' && cell.inMonth ? styles.cellBad : '',
                isSun ? styles.cellSunday : '',
              ].join(' ')}
              onClick={() => onSelectDate(cell.date)}
              id={`day-${cell.date.getFullYear()}-${cell.date.getMonth() + 1}-${cell.date.getDate()}`}
            >
              <span className={styles.solarDay}>{cell.date.getDate()}</span>
              <span className={styles.lunarDay}>
                {cell.lunarDay === 1
                  ? `T${cell.lunarMonth}${cell.isLeap ? '*' : ''}`
                  : cell.lunarDay}
              </span>
              {cell.inMonth && (
                <div className={styles.indicators}>
                  {cell.tietKhi && <span className={styles.dotTiet} title={cell.tietKhi} />}
                  {cell.hasEvent && <span className={styles.dotEvent} title="Sự kiện" />}
                  {cell.quality === 'good' && <span className={styles.dotGood} />}
                  {cell.quality === 'bad' && <span className={styles.dotBad} />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
