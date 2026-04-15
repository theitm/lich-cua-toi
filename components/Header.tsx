'use client';

import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
  menuOpen: boolean;
}

export default function Header({ onMenuToggle, menuOpen }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>📅</span>
        <span className={styles.logoText}>Lịch của tôi</span>
      </div>
      <button
        className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnActive : ''}`}
        onClick={onMenuToggle}
        aria-label="Mở menu tiện ích"
        id="hamburger-btn"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
    </header>
  );
}
