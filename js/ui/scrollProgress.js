// ============================================================================
//  ui/scrollProgress.js — Header Bar Progress Berikon Koin Aljabar
// ============================================================================

import { prefersReducedMotion } from '../utils/safe.js';
import { spawnClickBurst } from './sparkFx.js';

export const SCROLL_PROGRESS_CONFIG = {
  // Pengaturan simbol koin per bagian halaman (scrollspy)
  sectionSymbols: {
    beranda: 'x',
    tentang: '+',
    materi: '=',
    akses: 'Rp',
    profil: 'd'
  },
  defaultSymbol: 'x',
  sparkCountOnSectionChange: 3,
  ariaUpdateThrottleMs: 120,
  scrollStopDelayMs: 140
};

function createCoinSvg(sym = 'x', isShadow = false) {
  const gradId = isShadow ? 'am-prog-coin-grad-sh' : 'am-prog-coin-grad';
  const fontSize = sym.length > 1 ? 26 : 36;
  return `
    <svg class="progress__coin-svg" viewBox="0 0 64 64" width="28" height="28" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="${gradId}" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="52%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#d97706"/>
        </radialGradient>
      </defs>
      <!-- Tepi bawah 3D -->
      <circle cx="32" cy="35" r="25" fill="#b45309" stroke="#451a03" stroke-width="4.5"/>
      <!-- Keping koin utama dengan outline cokelat tua #451a03 -->
      <circle cx="32" cy="30" r="25" fill="url(#${gradId})" stroke="#451a03" stroke-width="4.5"/>
      <!-- Lingkar dalam koin -->
      <circle cx="32" cy="30" r="18.5" fill="none" stroke="#b45309" stroke-width="2.2" stroke-dasharray="5 3"/>
      <!-- Kilau sudut atas -->
      <path d="M19 19 A16 16 0 0 1 31 14" fill="none" stroke="#fffbeb" stroke-width="3" stroke-linecap="round"/>
      <!-- Simbol Aljabar Aktif -->
      <text class="progress__coin-text" x="32" y="31.5" text-anchor="middle" dominant-baseline="central"
        font-family="Fredoka, Nunito, Roboto, system-ui, sans-serif" font-weight="900"
        font-size="${fontSize}" fill="#451a03">${sym}</text>
    </svg>
  `;
}

export function initScrollProgress() {
  try {
    const progressEl = document.querySelector('.progress');
    if (!progressEl) return;

    // Pastikan atribut aksesibilitas progressbar lengkap
    progressEl.setAttribute('role', 'progressbar');
    progressEl.setAttribute('aria-label', 'Progres baca halaman');
    progressEl.setAttribute('aria-valuemin', '0');
    progressEl.setAttribute('aria-valuemax', '100');
    if (!progressEl.hasAttribute('aria-valuenow')) {
      progressEl.setAttribute('aria-valuenow', '0');
    }

    let labelEl = progressEl.querySelector('.progress__label');
    if (!labelEl) {
      labelEl = document.createElement('span');
      labelEl.className = 'progress__label';
      labelEl.setAttribute('aria-hidden', 'true');
      labelEl.textContent = 'ALGEBRA-MART';
      progressEl.prepend(labelEl);
    }

    let barEl = progressEl.querySelector('.progress__bar');
    if (!barEl) {
      barEl = document.createElement('div');
      barEl.className = 'progress__bar';
      barEl.setAttribute('aria-hidden', 'true');
      progressEl.appendChild(barEl);
    } else {
      barEl.setAttribute('aria-hidden', 'true');
    }

    let coinEl = progressEl.querySelector('.progress__coin');
    if (!coinEl) {
      coinEl = document.createElement('div');
      coinEl.className = 'progress__coin';
      coinEl.setAttribute('aria-hidden', 'true');
      progressEl.appendChild(coinEl);
    }
    coinEl.innerHTML = `<div class="progress__coin-inner">${createCoinSvg(SCROLL_PROGRESS_CONFIG.defaultSymbol, false)}</div>`;
    const coinInnerEl = coinEl.querySelector('.progress__coin-inner');
    const coinTextEl = coinEl.querySelector('.progress__coin-text');

    // Bayangan ikon koin samar tepat di bawah garis bawah navbar (#451a03)
    const headerEl = document.querySelector('.header');
    let shadowEl = document.querySelector('.progress__coin-shadow');
    if (!shadowEl && headerEl) {
      shadowEl = document.createElement('div');
      shadowEl.className = 'progress__coin-shadow';
      shadowEl.setAttribute('aria-hidden', 'true');
      headerEl.appendChild(shadowEl);
    }
    if (shadowEl) {
      shadowEl.innerHTML = `<div class="progress__coin-shadow-inner">${createCoinSvg(SCROLL_PROGRESS_CONFIG.defaultSymbol, true)}</div>`;
    }
    const shadowTextEl = shadowEl?.querySelector('.progress__coin-text');

    const sectionIds = Object.keys(SCROLL_PROGRESS_CONFIG.sectionSymbols);
    const getSections = () => sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    let currentSection = 'beranda';
    let currentSymbol = SCROLL_PROGRESS_CONFIG.defaultSymbol;
    let lastAriaUpdate = 0;
    let lastAriaVal = -1;
    let rafId = 0;
    let scrollStopTimer = 0;
    let lastCoinCenterX = 16;
    let hasInitialized = false;

    const detectActiveSection = (ratio) => {
      const sections = getSections();
      if (!sections.length) return 'beranda';
      if (ratio >= 0.97) return sections[sections.length - 1].id;
      if (window.scrollY <= 40) return sections[0].id;

      const probeY = window.innerHeight * 0.38;
      let chosen = sections[0].id;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= probeY) {
          chosen = sec.id;
        } else {
          break;
        }
      }
      return chosen;
    };

    const updateCoinSymbol = (nextSymbol, triggerEffects = false) => {
      if (!nextSymbol || nextSymbol === currentSymbol) return;
      currentSymbol = nextSymbol;
      const fontSize = nextSymbol.length > 1 ? '26' : '36';

      if (coinTextEl) {
        coinTextEl.textContent = nextSymbol;
        coinTextEl.setAttribute('font-size', fontSize);
      }
      if (shadowTextEl) {
        shadowTextEl.textContent = nextSymbol;
        shadowTextEl.setAttribute('font-size', fontSize);
      }

      if (triggerEffects && !prefersReducedMotion()) {
        if (coinInnerEl) {
          coinInnerEl.classList.remove('is-pop');
          void coinInnerEl.offsetWidth;
          coinInnerEl.classList.add('is-pop');
        }
        // Lempar 3 percikan token kecil memakai sistem percikan yang sudah ada
        const coinRect = coinEl.getBoundingClientRect();
        const burstX = coinRect.width > 0 ? coinRect.left + coinRect.width / 2 : lastCoinCenterX;
        const burstY = coinRect.height > 0 ? coinRect.top + coinRect.height / 2 : 12;
        spawnClickBurst(burstX, burstY, SCROLL_PROGRESS_CONFIG.sparkCountOnSectionChange);
      }
    };

    const updateProgress = () => {
      rafId = 0;
      const doc = document.documentElement;
      const scrollTop = Math.max(0, window.scrollY || doc.scrollTop || 0);
      const maxScroll = Math.max(0, (doc.scrollHeight || 0) - (doc.clientHeight || window.innerHeight || 0));
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
      const pct = ratio * 100;

      // Isian bar menggunakan width (0-100%)
      barEl.style.width = `${pct.toFixed(3)}%`;

      // Posisi koin menggunakan transform: translateX
      const trackWidth = progressEl.clientWidth || window.innerWidth || 320;
      const coinSize = coinEl.offsetWidth || (trackWidth <= 640 ? 24 : 28);
      const halfCoin = coinSize * 0.5;
      const rawX = ratio * trackWidth - halfCoin;
      const clampedX = Math.min(Math.max(2, trackWidth - coinSize - 2), Math.max(2, rawX));
      lastCoinCenterX = clampedX + halfCoin;

      coinEl.style.transform = `translate3d(${clampedX.toFixed(1)}px, 0, 0)`;
      if (shadowEl) {
        shadowEl.style.transform = `translate3d(${clampedX.toFixed(1)}px, 0, 0)`;
      }

      // Sembunyikan label mini "ALGEBRA-MART" bila tertutup oleh isian bar atau koin
      const labelRightEdge = (labelEl?.offsetLeft || 10) + (labelEl?.offsetWidth || 88) + 6;
      const fillPx = ratio * trackWidth;
      progressEl.classList.toggle('is-label-covered', fillPx >= 14 || clampedX <= labelRightEdge);

      // Perbarui aria-valuenow secara throttle
      const now = performance.now();
      const roundedPct = Math.round(pct);
      if (roundedPct !== lastAriaVal && (now - lastAriaUpdate >= SCROLL_PROGRESS_CONFIG.ariaUpdateThrottleMs || roundedPct === 0 || roundedPct === 100)) {
        lastAriaVal = roundedPct;
        lastAriaUpdate = now;
        progressEl.setAttribute('aria-valuenow', String(roundedPct));
      }

      // Periksa bagian aktif (scrollspy) untuk simbol koin
      const activeSec = detectActiveSection(ratio);
      if (activeSec !== currentSection) {
        currentSection = activeSec;
        const sym = SCROLL_PROGRESS_CONFIG.sectionSymbols[activeSec] || SCROLL_PROGRESS_CONFIG.defaultSymbol;
        updateCoinSymbol(sym, hasInitialized);
      }

      hasInitialized = true;
    };

    const scheduleUpdate = (fromScroll = false) => {
      if (fromScroll && !prefersReducedMotion()) {
        coinEl.classList.add('is-scrolling');
        clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(() => {
          coinEl.classList.remove('is-scrolling');
        }, SCROLL_PROGRESS_CONFIG.scrollStopDelayMs);
      }
      if (!rafId) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', () => scheduleUpdate(true), { passive: true });
    window.addEventListener('resize', () => scheduleUpdate(false), { passive: true });
    window.addEventListener('load', () => scheduleUpdate(false), { once: true });

    if ('ResizeObserver' in window && document.body) {
      const ro = new ResizeObserver(() => scheduleUpdate(false));
      ro.observe(document.body);
    }

    // Inisialisasi langsung pada frame pertama
    updateProgress();
  } catch (e) {
    console.error('[modul:scrollProgress]', e);
  }
}

