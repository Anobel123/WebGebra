// ============================================================================
//  ui/kelas.js — "Kelas Algebra-Mart" (20 Karakter Kecil Bercerita)
// ============================================================================

import { KELAS_DATA, KELAS_LABELS, KELAS_SUMBER_DEFAULT } from '../data/kelas.js';
import { esc, prefersReducedMotion } from '../utils/safe.js';
import { spawnClickBurst } from './sparkFx.js';

// Konfigurasi di bagian atas file (mudah diubah)
export const KELAS_CONFIG = {
  autoplayIntervalMs: 6500,        // Interval ganti karakter otomatis (6-7 detik)
  typingSpeedCharsPerSec: 25,      // Kecepatan efek mengetik (±25 karakter/detik)
  autoplayDefault: true,           // Autoplay hidup secara default (mati bila reduced-motion)
  columns: {
    desktop: 7,                    // 7 kolom di desktop
    tablet: 4,                     // 4 kolom di tablet
    mobile: 3                      // 3 kolom di mobile
  },
  maxBubbleLength: 55
};

/**
 * Pembuat SVG inline karakter chibi pelajar SMP (seragam putih-biru SMP).
 * Bila pembuatan gagal atau data avatar rusak, otomatis jatuh ke lingkaran emas berinisial.
 */
export function buildAvatar(cfg = {}) {
  try {
    if (!cfg || typeof cfg !== 'object' || cfg.forceFail) {
      throw new Error('Konfigurasi avatar tidak valid');
    }
    const skin = cfg.skin || '#fed7aa';
    const hair = cfg.hair || '#1e293b';
    const hijab = cfg.hijab || null;
    const isF = cfg.gender === 'F';
    const style = cfg.hairStyle || (hijab ? 'hijab' : isF ? 'ponytail' : 'spiky');
    const glasses = Boolean(cfg.glasses);

    let headHairSvg = '';
    if (hijab) {
      headHairSvg = `
        <path d="M16 32 C16 11, 56 11, 56 32 C58 45, 53 52, 36 52 C19 52, 14 45, 16 32 Z" fill="${esc(hijab)}" stroke="#2b1a14" stroke-width="2.4"/>
        <path d="M22 45 Q36 53 50 45" fill="none" stroke="#fbbf24" stroke-width="1.6" opacity="0.85"/>
        <circle cx="36" cy="31" r="12.2" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2.2"/>
        <path d="M24 23 Q36 17 48 23" fill="none" stroke="${esc(hijab)}" stroke-width="3.2" stroke-linecap="round"/>
      `;
    } else if (style === 'ponytail') {
      headHairSvg = `
        <circle cx="51" cy="24" r="6.5" fill="${esc(hair)}" stroke="#2b1a14" stroke-width="2"/>
        <circle cx="45" cy="24" r="2.6" fill="#fbbf24"/>
        <circle cx="36" cy="31" r="12.8" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2.2"/>
        <path d="M21 29 C21 14, 51 14, 51 29 C46 21, 26 21, 21 29 Z" fill="${esc(hair)}" stroke="#2b1a14" stroke-width="2"/>
      `;
    } else if (style === 'bob') {
      headHairSvg = `
        <path d="M19 30 C19 13, 53 13, 53 30 L55 41 C49 38, 23 38, 17 41 Z" fill="${esc(hair)}" stroke="#2b1a14" stroke-width="2"/>
        <circle cx="36" cy="31" r="12.6" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2.2"/>
        <path d="M22 25 Q36 17 50 25" fill="${esc(hair)}"/>
      `;
    } else if (style === 'curly') {
      headHairSvg = `
        <circle cx="26" cy="19" r="5.5" fill="${esc(hair)}"/>
        <circle cx="36" cy="17" r="6" fill="${esc(hair)}"/>
        <circle cx="46" cy="19" r="5.5" fill="${esc(hair)}"/>
        <circle cx="36" cy="31" r="12.8" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2.2"/>
        <path d="M22 27 C24 19, 48 19, 50 27" fill="${esc(hair)}" stroke="#2b1a14" stroke-width="1.8"/>
      `;
    } else if (style === 'parted') {
      headHairSvg = `
        <circle cx="36" cy="31" r="12.8" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2.2"/>
        <path d="M21 29 C21 14, 51 14, 51 29 C43 22, 31 20, 21 29 Z" fill="${esc(hair)}" stroke="#2b1a14" stroke-width="2"/>
      `;
    } else {
      // spiky default
      headHairSvg = `
        <circle cx="36" cy="31" r="12.8" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2.2"/>
        <path d="M21 28 L25 16 L31 21 L36 14 L42 21 L47 16 L51 28 C44 22, 28 22, 21 28 Z" fill="${esc(hair)}" stroke="#2b1a14" stroke-width="2" stroke-linejoin="round"/>
      `;
    }

    const glassesSvg = glasses
      ? `<g stroke="#2b1a14" stroke-width="1.8" fill="rgba(255,255,255,0.35)">
           <circle cx="31" cy="31" r="3.6"/>
           <circle cx="41" cy="31" r="3.6"/>
           <line x1="34.6" y1="31" x2="37.4" y2="31"/>
         </g>`
      : '';

    const bottomUniform = isF
      ? `<path d="M22 58 L50 58 L54 73 L18 73 Z" fill="#1e3a8a" stroke="#2b1a14" stroke-width="2.2"/>`
      : `<rect x="23" y="58" width="26" height="14" rx="3" fill="#1e3a8a" stroke="#2b1a14" stroke-width="2.2"/>
         <line x1="36" y1="62" x2="36" y2="72" stroke="#2b1a14" stroke-width="2"/>`;

    return `
      <svg class="kelas-chibi" viewBox="0 0 72 90" width="68" height="84" aria-hidden="true" focusable="false">
        <ellipse cx="36" cy="84" rx="18" ry="4.2" fill="rgba(63,42,34,0.2)"/>
        <!-- Kaki & sepatu SMP -->
        <rect x="27" y="68" width="6" height="13" rx="3" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2"/>
        <rect x="39" y="68" width="6" height="13" rx="3" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="2"/>
        <rect x="24" y="78" width="10" height="5.5" rx="2.5" fill="#2b1a14"/>
        <rect x="38" y="78" width="10" height="5.5" rx="2.5" fill="#2b1a14"/>
        <!-- Bawahan Biru Tua SMP -->
        ${bottomUniform}
        <!-- Kemeja Putih SMP + Dasi Biru + Lencana Koin -->
        <path d="M21 43 C21 40, 51 40, 51 43 L53 59 L19 59 Z" fill="#ffffff" stroke="#2b1a14" stroke-width="2.2"/>
        <polygon points="36,43 33,54 36,57 39,54" fill="#1e3a8a"/>
        <circle cx="44" cy="49" r="3" fill="#fbbf24" stroke="#b45309" stroke-width="1.2"/>
        <!-- Lengan kiri -->
        <path d="M21 45 L14 54" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
        <path d="M21 45 L14 54" stroke="#2b1a14" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="13.5" cy="54.5" r="3" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="1.8"/>
        <!-- Lengan kanan melambai -->
        <g class="kelas-chibi__wave">
          <path d="M51 45 L59 36" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
          <path d="M51 45 L59 36" stroke="#2b1a14" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="59.5" cy="35.5" r="3.2" fill="${esc(skin)}" stroke="#2b1a14" stroke-width="1.8"/>
        </g>
        <!-- Kepala & Rambut/Hijab -->
        ${headHairSvg}
        <!-- Wajah -->
        <circle cx="31.2" cy="31" r="1.9" fill="#2b1a14"/>
        <circle cx="40.8" cy="31" r="1.9" fill="#2b1a14"/>
        <circle cx="28.5" cy="34" r="2.2" fill="#f87171" opacity="0.5"/>
        <circle cx="43.5" cy="34" r="2.2" fill="#f87171" opacity="0.5"/>
        <path d="M32 35.5 Q36 39.2 40 35.5" fill="none" stroke="#2b1a14" stroke-width="2" stroke-linecap="round"/>
        ${glassesSvg}
      </svg>
    `;
  } catch (e) {
    const ini = String(cfg?.inisial || cfg?.nama || 'AM')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
    return `<div class="kelas-avatar-fallback" aria-hidden="true">${esc(ini || 'AM')}</div>`;
  }
}

function bookBadgeSvg() {
  return `
    <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M5 7 C9 6, 13 7, 16 9 C19 7, 23 6, 27 7 L27 24 C23 23, 19 24, 16 26 C13 24, 9 23, 5 24 Z"
        fill="#fff8e1" stroke="#451a03" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="16" y1="9" x2="16" y2="26" stroke="#b45309" stroke-width="2.2"/>
    </svg>
  `;
}

/** Validasi dan sanitasi daftar karakter */
export function validateKelasData(rawList) {
  if (!Array.isArray(rawList)) return [];
  const valid = [];
  rawList.forEach((item, idx) => {
    if (!item || typeof item !== 'object') return;
    const id = typeof item.id === 'number' ? item.id : idx + 1;
    const nama = String(item.nama || '').trim();
    const inisial = String(item.inisial || '').trim();
    const bubble = String(item.bubble || '').trim();
    const cerita = String(item.cerita || '').trim();
    if (!nama || !cerita) {
      console.warn(`[kelas] Data karakter ke-${idx + 1} tidak lengkap, dilewati.`);
      return;
    }
    const safeBubble = bubble.length > KELAS_CONFIG.maxBubbleLength
      ? bubble.slice(0, KELAS_CONFIG.maxBubbleLength - 1) + '…'
      : (bubble || cerita.slice(0, 40) + '…');

    valid.push({
      id,
      nama,
      inisial: inisial || nama.split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase(),
      tag: String(item.tag || 'Pengalaman Bermain').trim(),
      bubble: safeBubble,
      cerita,
      sumber: item.sumber === 'nyata' ? 'nyata' : (KELAS_SUMBER_DEFAULT === 'nyata' ? 'nyata' : 'ilustrasi'),
      avatar: item.avatar && typeof item.avatar === 'object' ? { ...item.avatar, inisial: inisial || nama } : { forceFail: true, inisial: inisial || nama }
    });
  });
  return valid;
}

export function initKelas(customData = null) {
  try {
    const sectionWrap = document.getElementById('kelas-section');
    const root = document.getElementById('student-stage');
    if (!root) return;

    const list = validateKelasData(customData ?? KELAS_DATA);
    if (!list.length) {
      if (sectionWrap) sectionWrap.hidden = true;
      root.hidden = true;
      return;
    }
    if (sectionWrap) sectionWrap.hidden = false;
    root.hidden = false;

    // Terapkan jumlah kolom dari konfigurasi ke CSS custom properties
    root.style.setProperty('--kelas-cols-desktop', String(KELAS_CONFIG.columns.desktop));
    root.style.setProperty('--kelas-cols-tablet', String(KELAS_CONFIG.columns.tablet));
    root.style.setProperty('--kelas-cols-mobile', String(KELAS_CONFIG.columns.mobile));

    const reduced = prefersReducedMotion();
    let activeIdx = 0;
    let userAutoPlay = !reduced && Boolean(KELAS_CONFIG.autoplayDefault);
    let hoverPaused = false;
    let focusPaused = false;
    let inView = true;
    let pageVisible = document.visibilityState !== 'hidden';
    let autoTimer = 0;

    // State mesin mengetik (typing effect ±25 karakter/detik)
    let typingRaf = 0;
    let isTyping = false;
    let fullStoryText = '';
    let typingStartTime = 0;

    // Tentukan label kejujuran konten berdasarkan field `sumber`
    const resolveDisclaimerText = (modeOverride) => {
      const mode = modeOverride || (list.every((d) => d.sumber === 'nyata') ? 'nyata' : 'ilustrasi');
      return KELAS_LABELS[mode] || KELAS_LABELS.ilustrasi;
    };

    const disclaimerEl = document.getElementById('kelas-disclaimer');
    if (disclaimerEl) {
      disclaimerEl.textContent = resolveDisclaimerText();
    }

    root.innerHTML = `
      <div class="kelas-stage" id="kelas-stage">
        <!-- Papan Dialog Cokelat Kayu Gelap Berbingkai Emas -->
        <div class="kelas-dialog" id="kelas-dialog" role="region" aria-label="Papan cerita Kelas Algebra-Mart" tabindex="0">
          <div class="kelas-dialog__left">
            <div class="kelas-dialog__avatar" id="kelas-dialog-avatar" aria-hidden="true"></div>
            <span class="kelas-dialog__book-badge" aria-hidden="true" title="Catatan Belajar">${bookBadgeSvg()}</span>
          </div>
          <div class="kelas-dialog__right">
            <div class="kelas-dialog__meta">
              <span class="kelas-dialog__chip" id="kelas-dialog-chip">Pemain 1 · RP</span>
              <strong class="kelas-dialog__name" id="kelas-dialog-name"></strong>
              <span class="kelas-dialog__tag" id="kelas-dialog-tag"></span>
            </div>
            <div class="kelas-dialog__body" id="kelas-dialog-body" aria-live="off">
              <p class="kelas-dialog__text" id="kelas-dialog-text"></p>
            </div>
            <div class="kelas-dialog__footer">
              <span class="kelas-dialog__hint">Klik kotak dialog atau klik karakter di bawah untuk mendengar cerita mereka.</span>
              <div class="kelas-dialog__controls">
                <button class="btn btn--small kelas-btn--cream" type="button" id="kelas-prev" aria-label="Karakter sebelumnya">Sebelumnya</button>
                <button class="btn btn--small kelas-btn--cream" type="button" id="kelas-toggle" aria-pressed="${String(userAutoPlay)}">${userAutoPlay ? 'Jeda Otomatis' : 'Putar Otomatis'}</button>
                <button class="btn btn--small kelas-btn--gold" type="button" id="kelas-next" aria-label="Karakter berikutnya">Berikutnya</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Wadah Karakter Berbingkai Putus-Putus -->
        <div class="kelas-grid-wrap" id="kelas-grid-wrap">
          <div class="kelas-grid" id="kelas-grid" role="group" aria-label="Pilihan 20 karakter Kelas Algebra-Mart">
            ${list.map((item, i) => `
              <button class="kelas-card card--tilt${i === 0 ? ' is-active' : ''}" type="button"
                data-fx="tilt" data-idx="${i}" aria-pressed="${i === 0 ? 'true' : 'false'}"
                aria-label="Pemain ${item.id} ${esc(item.inisial)} - ${esc(item.nama)}: ${esc(item.tag)}">
                <span class="kelas-card__bubble" aria-hidden="true">${esc(item.bubble)}</span>
                <span class="kelas-card__avatar" aria-hidden="true">${buildAvatar(item.avatar)}</span>
                <span class="kelas-card__chip">Pemain ${item.id} · <b>${esc(item.inisial)}</b></span>
                <span class="kelas-card__name">${esc(item.nama)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const stageEl = root.querySelector('#kelas-stage');
    const dialogEl = root.querySelector('#kelas-dialog');
    const dialogAvatarEl = root.querySelector('#kelas-dialog-avatar');
    const dialogChipEl = root.querySelector('#kelas-dialog-chip');
    const dialogNameEl = root.querySelector('#kelas-dialog-name');
    const dialogTagEl = root.querySelector('#kelas-dialog-tag');
    const dialogBodyEl = root.querySelector('#kelas-dialog-body');
    const dialogTextEl = root.querySelector('#kelas-dialog-text');
    const toggleBtn = root.querySelector('#kelas-toggle');
    const prevBtn = root.querySelector('#kelas-prev');
    const nextBtn = root.querySelector('#kelas-next');
    const gridWrapEl = root.querySelector('#kelas-grid-wrap');
    const cards = [...root.querySelectorAll('.kelas-card')];

    const stopTyping = () => {
      if (typingRaf) {
        cancelAnimationFrame(typingRaf);
        typingRaf = 0;
      }
      isTyping = false;
    };

    const finishTypingImmediately = () => {
      stopTyping();
      if (dialogTextEl) {
        dialogTextEl.textContent = `“${fullStoryText}”`;
      }
      dialogEl?.classList.remove('is-typing');
    };

    const startTyping = (text, immediate = false) => {
      stopTyping();
      fullStoryText = text;
      if (immediate || prefersReducedMotion() || KELAS_CONFIG.typingSpeedCharsPerSec <= 0) {
        finishTypingImmediately();
        return;
      }
      isTyping = true;
      dialogEl?.classList.add('is-typing');
      typingStartTime = performance.now();
      const charsPerMs = KELAS_CONFIG.typingSpeedCharsPerSec / 1000;

      const step = (now) => {
        const elapsed = Math.max(0, now - typingStartTime);
        const charCount = Math.min(fullStoryText.length, Math.max(1, Math.floor(elapsed * charsPerMs)));
        if (dialogTextEl) {
          dialogTextEl.textContent = `“${fullStoryText.slice(0, charCount)}${charCount < fullStoryText.length ? '”' : '”'}`;
        }
        if (charCount < fullStoryText.length) {
          typingRaf = requestAnimationFrame(step);
        } else {
          finishTypingImmediately();
        }
      };
      typingRaf = requestAnimationFrame(step);
    };

    const scrollCardIntoContainerView = (cardEl) => {
      if (!cardEl || !gridWrapEl) return;
      try {
        if (gridWrapEl.scrollHeight > gridWrapEl.clientHeight + 8) {
          const wrapRect = gridWrapEl.getBoundingClientRect();
          const cardRect = cardEl.getBoundingClientRect();
          if (cardRect.top < wrapRect.top || cardRect.bottom > wrapRect.bottom) {
            const targetTop = gridWrapEl.scrollTop + (cardRect.top - wrapRect.top) - gridWrapEl.clientHeight / 2 + cardRect.height / 2;
            gridWrapEl.scrollTo({ top: Math.max(0, targetTop), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
          }
        }
      } catch { /* abaikan */ }
    };

    const isAutoPlayEffective = () => userAutoPlay && !hoverPaused && !focusPaused && inView && pageVisible && !prefersReducedMotion();

    const restartAutoTimer = () => {
      clearInterval(autoTimer);
      autoTimer = 0;
      if (isAutoPlayEffective()) {
        autoTimer = setInterval(() => {
          if (isAutoPlayEffective()) {
            selectCharacter(activeIdx + 1, { fromUser: false });
          }
        }, KELAS_CONFIG.autoplayIntervalMs);
      }
    };

    const selectCharacter = (idx, { fromUser = false, focusCard = false, triggerBurst = false } = {}) => {
      activeIdx = ((idx % list.length) + list.length) % list.length;
      const item = list[activeIdx];

      // Hanya umumkan lewat aria-live="polite" ketika pengguna berinteraksi (bukan autoplay)
      if (dialogBodyEl) {
        dialogBodyEl.setAttribute('aria-live', fromUser ? 'polite' : 'off');
      }

      if (dialogChipEl) dialogChipEl.textContent = `Pemain ${item.id} · ${item.inisial}`;
      if (dialogNameEl) dialogNameEl.textContent = item.nama;
      if (dialogTagEl) dialogTagEl.textContent = item.tag;
      if (dialogAvatarEl) dialogAvatarEl.innerHTML = buildAvatar(item.avatar);

      dialogEl?.classList.remove('is-pop');
      void dialogEl?.offsetWidth;
      dialogEl?.classList.add('is-pop');

      cards.forEach((c, i) => {
        const on = i === activeIdx;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      const activeCard = cards[activeIdx];
      if (activeCard) {
        scrollCardIntoContainerView(activeCard);
        if (focusCard) {
          activeCard.focus({ preventScroll: true });
        }
        if (triggerBurst && !prefersReducedMotion()) {
          const r = activeCard.getBoundingClientRect();
          spawnClickBurst(r.left + r.width / 2, r.top + r.height * 0.35);
        }
      }

      startTyping(item.cerita, !fromUser && prefersReducedMotion());
    };

    // Tombol Sebelumnya / Berikutnya / Jeda Otomatis
    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCharacter(activeIdx - 1, { fromUser: true });
      restartAutoTimer();
    });

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCharacter(activeIdx + 1, { fromUser: true });
      restartAutoTimer();
    });

    toggleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      userAutoPlay = !userAutoPlay;
      toggleBtn.setAttribute('aria-pressed', String(userAutoPlay));
      toggleBtn.textContent = userAutoPlay ? 'Jeda Otomatis' : 'Putar Otomatis';
      restartAutoTimer();
    });

    // Klik papan dialog: jika sedang mengetik -> tampilkan semua teks; jika sudah selesai -> karakter berikutnya
    dialogEl?.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (isTyping) {
        finishTypingImmediately();
      } else {
        selectCharacter(activeIdx + 1, { fromUser: true });
      }
      restartAutoTimer();
    });

    dialogEl?.addEventListener('keydown', (e) => {
      if (e.target !== dialogEl) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isTyping) finishTypingImmediately();
        else selectCharacter(activeIdx + 1, { fromUser: true });
        restartAutoTimer();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        selectCharacter(activeIdx + 1, { fromUser: true });
        restartAutoTimer();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        selectCharacter(activeIdx - 1, { fromUser: true });
        restartAutoTimer();
      }
    });

    // Event delegation pada grid kartu karakter (klik & panah kiri/kanan)
    const gridEl = root.querySelector('#kelas-grid');
    gridEl?.addEventListener('click', (e) => {
      const btn = e.target.closest('.kelas-card');
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (Number.isNaN(idx)) return;
      if (idx === activeIdx && isTyping) {
        finishTypingImmediately();
        return;
      }
      selectCharacter(idx, { fromUser: true, triggerBurst: true });
      restartAutoTimer();
    });

    gridEl?.addEventListener('keydown', (e) => {
      const btn = e.target.closest('.kelas-card');
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        selectCharacter(idx + 1, { fromUser: true, focusCard: true });
        restartAutoTimer();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        selectCharacter(idx - 1, { fromUser: true, focusCard: true });
        restartAutoTimer();
      }
    });

    // Jeda otomatis saat kursor atau fokus berada di dalam area Kelas Algebra-Mart
    stageEl?.addEventListener('pointerenter', () => {
      hoverPaused = true;
      restartAutoTimer();
    });
    stageEl?.addEventListener('pointerleave', () => {
      hoverPaused = false;
      restartAutoTimer();
    });
    stageEl?.addEventListener('focusin', () => {
      focusPaused = true;
      restartAutoTimer();
    });
    stageEl?.addEventListener('focusout', (e) => {
      if (!stageEl.contains(e.relatedTarget)) {
        focusPaused = false;
        restartAutoTimer();
      }
    });

    // Jeda saat tab tidak terlihat
    document.addEventListener('visibilitychange', () => {
      pageVisible = document.visibilityState !== 'hidden';
      restartAutoTimer();
    });

    // Jeda saat sub-bagian berada di luar layar
    if ('IntersectionObserver' in window && stageEl) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          restartAutoTimer();
        });
      }, { threshold: 0.08 });
      io.observe(stageEl);
    }

    // Hook pengujian untuk mengubah sumber ("ilustrasi" <-> "nyata") atau merender ulang data
    window.__kelasApi = {
      setSumber(mode) {
        if (disclaimerEl) {
          disclaimerEl.textContent = resolveDisclaimerText(mode);
          disclaimerEl.dataset.sumber = mode;
        }
      },
      finishTyping: finishTypingImmediately,
      reinit: (newData) => initKelas(newData),
      buildAvatar
    };

    // Tampilkan karakter pertama saat muat awal (langsung tampil penuh tanpa menunggu ketikan)
    selectCharacter(0, { fromUser: false });
    finishTypingImmediately();
    restartAutoTimer();
  } catch (e) {
    console.error('[modul:kelas]', e);
  }
}

