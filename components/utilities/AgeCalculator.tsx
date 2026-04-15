'use client';

import React, { useState, useMemo } from 'react';
import styles from './Utilities.module.css';
import {
  buildPersonInfo,
  getCungMenh,
  getFullCompatibility,
  getCungMenhCompatibility,
} from '@/lib/tuoi';
import {
  ZODIAC_VN,
  CHI,
} from '@/lib/canchi';

const CURRENT_YEAR = new Date().getFullYear();

const MENH_EMOJI: Record<string, string> = {
  'Kim': '⚱️', 'Mộc': '🌱', 'Thủy': '💧', 'Hỏa': '🔥', 'Thổ': '🏔️',
};

const MENH_COLOR: Record<string, string> = {
  'Kim': '#C0A030', 'Mộc': '#16A34A', 'Thủy': '#2563EB', 'Hỏa': '#DC2626', 'Thổ': '#A16207',
};

const MENH_BG: Record<string, string> = {
  'Kim': '#FFFBEB', 'Mộc': '#F0FDF4', 'Thủy': '#EFF6FF', 'Hỏa': '#FFF5F5', 'Thổ': '#FEFCE8',
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? '#16A34A' : score >= 60 ? '#E8A020' : score >= 40 ? '#F97316' : '#DC2626';
  return (
    <div className={styles.scoreBarWrap}>
      <div className={styles.scoreBarBg}>
        <div
          className={styles.scoreBarFill}
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className={styles.scoreNum} style={{ color }}>{score}/100</span>
    </div>
  );
}

export default function AgeCalculator() {
  const [year1, setYear1] = useState('');
  const [gender1, setGender1] = useState<'nam' | 'nu'>('nam');
  const [year2, setYear2] = useState('');
  const [gender2, setGender2] = useState<'nam' | 'nu'>('nu');
  const [showCompat, setShowCompat] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const y1 = parseInt(year1);
  const y2 = parseInt(year2);

  const isValidYear = (y: number) => !isNaN(y) && y >= 1900 && y <= CURRENT_YEAR;

  const p1 = useMemo(() => {
    if (!submitted || !isValidYear(y1)) return null;
    return buildPersonInfo(y1, gender1);
  }, [submitted, y1, gender1]);

  const p2 = useMemo(() => {
    if (!submitted || !showCompat || !isValidYear(y2)) return null;
    return buildPersonInfo(y2, gender2);
  }, [submitted, showCompat, y2, gender2]);

  const compat = useMemo(() => {
    if (!p1 || !p2) return null;
    return getFullCompatibility(p1, p2);
  }, [p1, p2]);

  const cung1 = useMemo(() => {
    if (!p1) return null;
    return getCungMenh(y1, gender1);
  }, [p1, y1, gender1]);

  const cung2 = useMemo(() => {
    if (!p2) return null;
    return getCungMenh(y2, gender2);
  }, [p2, y2, gender2]);

  const cungCompatNote = useMemo(() => {
    if (!cung1 || !cung2) return null;
    return getCungMenhCompatibility(cung1.num, cung2.num);
  }, [cung1, cung2]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className={styles.utility}>
      <h2 className={styles.utilTitle}>🎂 Tra Cứu Tuổi</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Person 1 */}
        <div className={styles.personBlock}>
          <div className={styles.personLabel}>Người thứ nhất</div>
          <div className={styles.row}>
            <input
              type="number"
              className={styles.input}
              placeholder="Năm sinh (VD: 1985)"
              value={year1}
              onChange={e => { setYear1(e.target.value); setSubmitted(false); }}
              min={1900}
              max={CURRENT_YEAR}
              id="age-year1"
              required
            />
            <div className={styles.genderBtns}>
              <button
                type="button"
                className={`${styles.genderBtn} ${gender1 === 'nam' ? styles.genderBtnActive : ''}`}
                onClick={() => setGender1('nam')}
              >♂ Nam</button>
              <button
                type="button"
                className={`${styles.genderBtn} ${gender1 === 'nu' ? styles.genderBtnActive : ''}`}
                onClick={() => setGender1('nu')}
              >♀ Nữ</button>
            </div>
          </div>
        </div>

        {/* Toggle compare */}
        <div className={styles.compareToggle}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showCompat}
              onChange={e => setShowCompat(e.target.checked)}
              id="compare-toggle"
            />
            <span className={styles.toggleSlider} />
            Xem tương hợp với người thứ hai
          </label>
        </div>

        {/* Person 2 */}
        {showCompat && (
          <div className={styles.personBlock}>
            <div className={styles.personLabel}>Người thứ hai</div>
            <div className={styles.row}>
              <input
                type="number"
                className={styles.input}
                placeholder="Năm sinh (VD: 1988)"
                value={year2}
                onChange={e => { setYear2(e.target.value); setSubmitted(false); }}
                min={1900}
                max={CURRENT_YEAR}
                id="age-year2"
              />
              <div className={styles.genderBtns}>
                <button
                  type="button"
                  className={`${styles.genderBtn} ${gender2 === 'nam' ? styles.genderBtnActive : ''}`}
                  onClick={() => setGender2('nam')}
                >♂ Nam</button>
                <button
                  type="button"
                  className={`${styles.genderBtn} ${gender2 === 'nu' ? styles.genderBtnActive : ''}`}
                  onClick={() => setGender2('nu')}
                >♀ Nữ</button>
              </div>
            </div>
          </div>
        )}

        <button type="submit" className={styles.submitBtn} id="age-submit-btn">
          Tra cứu
        </button>
      </form>

      {/* Result Person 1 */}
      {p1 && (
        <PersonCard
          person={p1}
          cung={cung1!}
          gender={gender1}
          label={showCompat ? 'Người thứ nhất' : undefined}
        />
      )}

      {/* Result Person 2 */}
      {p2 && cung2 && (
        <PersonCard
          person={p2}
          cung={cung2}
          gender={gender2}
          label="Người thứ hai"
        />
      )}

      {/* Compatibility */}
      {compat && cung1 && cung2 && (
        <div className={styles.compatBox} style={{ borderColor: compat.color }}>
          <div className={styles.compatTitle}>Kết quả tương hợp</div>

          <div className={styles.compatPair}>
            <span className={styles.zodiacBig}>{ZODIAC_VN[CHI.indexOf(compat.person1.chi)]}</span>
            <span className={styles.vsText}>vs</span>
            <span className={styles.zodiacBig}>{ZODIAC_VN[CHI.indexOf(compat.person2.chi)]}</span>
          </div>

          <div className={styles.compatLabel} style={{ color: compat.color }}>
            {compat.label}
          </div>
          <ScoreBar score={compat.score} />
          <p className={styles.compatDesc}>{compat.description}</p>

          <div className={styles.cungCompatNote}>
            <span className={styles.cungCompatIcon}>🏛️</span>
            {cungCompatNote}
          </div>

          {/* Zodiac detail */}
          <div className={styles.zodiacDetail}>
            <ZodiacRow chi={compat.person1.chi} menh={compat.person1.menh} label="Người 1" />
            <ZodiacRow chi={compat.person2.chi} menh={compat.person2.menh} label="Người 2" />
          </div>
        </div>
      )}
    </div>
  );
}

function PersonCard({
  person,
  cung,
  gender,
  label,
}: {
  person: ReturnType<typeof buildPersonInfo>;
  cung: ReturnType<typeof getCungMenh>;
  gender: 'nam' | 'nu';
  label?: string;
}) {
  const menhColor = MENH_COLOR[person.menh] ?? '#333';
  const menhBg = MENH_BG[person.menh] ?? '#f9f9f9';
  const zodiacIdx = CHI.indexOf(person.chi);

  return (
    <div className={styles.personCard} style={{ background: menhBg }}>
      {label && <div className={styles.personCardLabel}>{label}</div>}
      <div className={styles.personCardMain}>
        <div className={styles.zodiacIcon}>
          {['🐭','🐂','🐯','🐰','🐲','🐍','🐴','🐑','🐵','🐔','🐶','🐷'][zodiacIdx >= 0 ? zodiacIdx : 0]}
        </div>
        <div className={styles.personCardInfo}>
          <div className={styles.personName}>
            {person.zodiac} ({person.chi}) — {person.birthYear}
          </div>
          <div className={styles.personSubInfo}>
            Tuổi dương: {person.age} • Tuổi âm: {person.ageAm}
          </div>
          <div className={styles.personSubInfo}>
            {gender === 'nam' ? '♂ Nam' : '♀ Nữ'}
          </div>
        </div>
      </div>

      <div className={styles.personDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Mệnh</span>
          <span className={styles.detailValue} style={{ color: menhColor }}>
            {MENH_EMOJI[person.menh]} {person.menh}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Cung mệnh</span>
          <span className={styles.detailValue}>{cung.name} ({cung.menh})</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Năm sinh</span>
          <span className={styles.detailValue}>{person.birthYear}</span>
        </div>
      </div>
    </div>
  );
}

function ZodiacRow({ chi, menh, label }: { chi: string; menh: string; label: string }) {
  const color = MENH_COLOR[menh] ?? '#333';
  return (
    <div className={styles.zodiacRow}>
      <span className={styles.zodiacRowLabel}>{label}:</span>
      <span className={styles.zodiacRowValue}>Tuổi {chi}</span>
      <span className={styles.zodiacRowMenh} style={{ color }}>Mệnh {menh}</span>
    </div>
  );
}
