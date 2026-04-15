'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import HamburgerMenu from '@/components/HamburgerMenu';
import DaySingleView from '@/components/DaySingleView';
import CalendarGrid from '@/components/CalendarGrid';
import DayDetail from '@/components/DayDetail';
import styles from './page.module.css';

type ViewMode = 'day' | 'month';

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function Home() {
  const today = new Date();
  const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState<Date>(todayClean);
  const [menuOpen, setMenuOpen] = useState(false);

  // Month view state (derived from currentDate)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  /* ── Day view handlers ── */
  const handlePrevDay = useCallback(() => setCurrentDate(d => addDays(d, -1)), []);
  const handleNextDay = useCallback(() => setCurrentDate(d => addDays(d, 1)), []);
  const handleGoToMonth = useCallback(() => setViewMode('month'), []);

  /* ── Month view handlers ── */
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(d => {
      const nd = new Date(d);
      nd.setDate(1);
      nd.setMonth(nd.getMonth() - 1);
      return nd;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(d => {
      const nd = new Date(d);
      nd.setDate(1);
      nd.setMonth(nd.getMonth() + 1);
      return nd;
    });
  }, []);

  const handleToday = useCallback(() => {
    setCurrentDate(todayClean);
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  }, []);

  return (
    <div className={styles.app}>
      <Header onMenuToggle={() => setMenuOpen(o => !o)} menuOpen={menuOpen} />

      {/* View toggle tab bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${viewMode === 'day' ? styles.tabActive : ''}`}
          onClick={() => setViewMode('day')}
          id="tab-day"
        >
          📋 Hôm nay
        </button>
        <button
          className={`${styles.tab} ${viewMode === 'month' ? styles.tabActive : ''}`}
          onClick={() => setViewMode('month')}
          id="tab-month"
        >
          📅 Lịch tháng
        </button>
      </div>

      <main className={styles.main}>
        {viewMode === 'day' ? (
          <DaySingleView
            date={currentDate}
            onPrev={handlePrevDay}
            onNext={handleNextDay}
            onGoToMonth={handleGoToMonth}
          />
        ) : (
          <>
            <CalendarGrid
              year={year}
              month={month}
              selectedDate={currentDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
            />
            <div className={styles.divider} />
            <DayDetail date={currentDate} />
          </>
        )}
      </main>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
