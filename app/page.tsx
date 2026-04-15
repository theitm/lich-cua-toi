'use client';

import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import CalendarGrid from '@/components/CalendarGrid';
import DayDetail from '@/components/DayDetail';
import HamburgerMenu from '@/components/HamburgerMenu';
import styles from './page.module.css';

export default function Home() {
  const today = new Date();
  const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date>(todayClean);
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePrev = useCallback(() => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }, [month]);

  const handleNext = useCallback(() => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }, [month]);

  const handleToday = useCallback(() => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth() + 1);
    setSelectedDate(new Date(t.getFullYear(), t.getMonth(), t.getDate()));
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    // If selected date is in different month, navigate to it
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    if (y !== year || m !== month) {
      setYear(y);
      setMonth(m);
    }
    // Scroll to day detail
    setTimeout(() => {
      document.getElementById('day-detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [year, month]);

  return (
    <div className={styles.app}>
      <Header onMenuToggle={() => setMenuOpen(o => !o)} menuOpen={menuOpen} />

      <main className={styles.main}>
        <CalendarGrid
          year={year}
          month={month}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrev}
          onNextMonth={handleNext}
          onToday={handleToday}
        />

        <div className={styles.divider} />

        <DayDetail date={selectedDate} />
      </main>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
