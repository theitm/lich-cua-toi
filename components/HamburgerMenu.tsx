'use client';

import React, { useEffect } from 'react';
import styles from './HamburgerMenu.module.css';
import AgeCalculator from './utilities/AgeCalculator';
import GoodDayFinder from './utilities/GoodDayFinder';
import HoangDaoWidget from './utilities/HoangDaoWidget';

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

type ToolId = 'age' | 'goodday' | 'hoangdao';

const TOOLS: { id: ToolId; icon: string; label: string; desc: string }[] = [
  { id: 'age',     icon: '🎂', label: 'Tra Cứu Tuổi',       desc: 'Tuổi, cung mệnh & tương hợp' },
  { id: 'goodday', icon: '📅', label: 'Chọn Ngày Tốt',      desc: 'Tìm ngày tốt cho sự kiện' },
  { id: 'hoangdao',icon: '⏰', label: 'Giờ Hoàng Đạo',      desc: 'Giờ tốt – xấu hôm nay' },
];

export default function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  const [activeTool, setActiveTool] = React.useState<ToolId | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset active tool when closing
      const timer = setTimeout(() => setActiveTool(null), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Tiện ích"
        id="utility-drawer"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Tiện ích</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        {activeTool === null ? (
          /* Tool list */
          <div className={styles.toolList}>
            {TOOLS.map(tool => (
              <button
                key={tool.id}
                className={styles.toolCard}
                onClick={() => setActiveTool(tool.id)}
                id={`tool-${tool.id}`}
              >
                <span className={styles.toolIcon}>{tool.icon}</span>
                <div className={styles.toolInfo}>
                  <span className={styles.toolLabel}>{tool.label}</span>
                  <span className={styles.toolDesc}>{tool.desc}</span>
                </div>
                <span className={styles.toolArrow}>›</span>
              </button>
            ))}
          </div>
        ) : (
          /* Active tool */
          <div className={styles.toolContent}>
            <button
              className={styles.backBtn}
              onClick={() => setActiveTool(null)}
              id="back-to-tools-btn"
            >
              ‹ Quay lại
            </button>
            <div className={styles.toolContentInner}>
              {activeTool === 'age' && <AgeCalculator />}
              {activeTool === 'goodday' && <GoodDayFinder />}
              {activeTool === 'hoangdao' && <HoangDaoWidget />}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
