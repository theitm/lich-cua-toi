'use client';

import React, { useMemo, useEffect, useState } from 'react';
import styles from './Utilities.module.css';
import { getHoangDaoHours, getCurrentHourIndex } from '@/lib/hoangdao';

export default function HoangDaoWidget() {
  const [now, setNow] = useState(new Date());

  // Update every minute
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dd = now.getDate();
  const mm = now.getMonth() + 1;
  const yyyy = now.getFullYear();
  const hours = useMemo(() => getHoangDaoHours(dd, mm, yyyy), [dd, mm, yyyy]);
  const currentIdx = getCurrentHourIndex(now);

  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const currentHour = hours[currentIdx];

  return (
    <div className={styles.utility}>
      <h2 className={styles.utilTitle}>⏰ Giờ Hoàng Đạo Hôm Nay</h2>

      <div className={styles.currentTimeBox}>
        <div className={styles.currentTimeLabel}>Giờ hiện tại</div>
        <div className={styles.currentTimeBig}>{timeStr}</div>
        <div
          className={styles.currentHourBadge}
          style={{
            background: currentHour.isHoangDao ? '#F0FDF4' : '#FFF5F5',
            color: currentHour.isHoangDao ? '#16A34A' : '#DC2626',
            borderColor: currentHour.isHoangDao ? '#86EFAC' : '#FECACA',
          }}
        >
          Giờ {currentHour.name} ({currentHour.timeRange}) —{' '}
          {currentHour.isHoangDao ? '✅ Hoàng Đạo' : '❌ Hắc Đạo'}
        </div>
      </div>

      <div className={styles.hourgridFull}>
        {hours.map((h) => (
          <div
            key={h.index}
            className={[
              styles.hourgridCell,
              h.isHoangDao ? styles.hourgridGood : styles.hourgridBad,
              h.index === currentIdx ? styles.hourgridCurrent : '',
            ].join(' ')}
          >
            <div className={styles.hourgridName}>{h.name}</div>
            <div className={styles.hourgridRange}>{h.timeRange}</div>
            <div className={styles.hourgridCC}>{h.canChi}</div>
            <div
              className={styles.hourgridStatus}
              style={{ color: h.isHoangDao ? '#16A34A' : '#DC2626' }}
            >
              {h.isHoangDao ? 'Hoàng Đạo' : 'Hắc Đạo'}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.hourgridLegend}>
        <span style={{ color: '#16A34A' }}>🟢 Hoàng Đạo</span> — Giờ tốt, thuận lợi cho công việc và di chuyển
        <br />
        <span style={{ color: '#DC2626' }}>🔴 Hắc Đạo</span> — Giờ xấu, nên tránh việc quan trọng
      </div>
    </div>
  );
}
