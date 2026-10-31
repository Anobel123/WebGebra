// ============================================================================
//  js/ui/motion.js — Sistem Animasi Scroll ke Bawah yang Berkarakter
//  Mendukung 5 gaya reveal (mask, shelf, kanopi toko, zoom, draw) dengan
//  progressive enhancement CSS animation-timeline: view() + IntersectionObserver
//  fallback, serta pengaman agar konten tidak pernah tersembunyi permanen.
// ============================================================================

import { prefersReducedMotion } from '../utils/safe.js';

/**
 * Pecah teks heading per kata di balik garis mask dengan stagger 60-80ms,
 * sambil menjaga teks asli tetap utuh untuk pembaca layar via aria-label.
 */
function prepareMaskHeadings(root = document) {
  const headings = root.querySelectorAll('[data-reveal="mask"], .heading-mask');
  headings.forEach((h) => {
    if (h.dataset.maskPrepared === '1') return;
    h.dataset.maskPrepared = '1';

    const plainText = (h.textContent || '').replace(/\s+/g, ' ').trim();
    if (!plainText) return;
    if (!h.hasAttribute('aria-label')) {
      h.setAttribute('aria-label', plainText);
    }

    // Jika prefers-reduced-motion aktif, jangan pecah DOM secara berlebihan
    if (prefersReducedMotion()) {
      h.classList.add('is-in');
      return;
    }

    let wordIdx = 0;
    const wrapWordsInNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue || '';
        const parts = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const maskSpan = document.createElement('span');
            maskSpan.className = 'reveal-word-mask';
            maskSpan.setAttribute('aria-hidden', 'true');
            const wordSpan = document.createElement('span');
            wordSpan.className = 'reveal-word';
            wordSpan.style.setProperty('--w-i', String(wordIdx++));
            wordSpan.textContent = part;
            maskSpan.appendChild(wordSpan);
            frag.appendChild(maskSpan);
          }
        });
        return frag;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        clone.setAttribute('aria-hidden', 'true');
        Array.from(node.childNodes).forEach((child) => {
          clone.appendChild(wrapWordsInNode(child));
        });
        return clone;
      }
      return node.cloneNode(true);
    };

    const children = Array.from(h.childNodes);
    h.innerHTML = '';
    children.forEach((ch) => {
      h.appendChild(wrapWordsInNode(ch));
    });
  });
}

/**
 * Siapkan rotasi bergantian kiri-kanan (±3°) untuk kartu bergaya rak toko (data-reveal="shelf")
 */
function prepareShelfCards(root = document) {
  const shelfEls = root.querySelectorAll('[data-reveal="shelf"], .reveal--shelf');
  shelfEls.forEach((el, idx) => {
    if (!el.style.getPropertyValue('--shelf-rot')) {
      el.style.setProperty('--shelf-rot', idx % 2 === 0 ? '-3deg' : '3deg');
    }
  });
}

/**
 * Update progres scroll untuk elemen data-reveal="draw" (garis emas Cara Bermain & jalur level Materi)
 * serta nyalakan koin langkah/level saat terlewati.
 */
function initScrollDrawAndZoom() {
  if (prefersReducedMotion()) {
    document.querySelectorAll('[data-reveal="draw"]').forEach((el) => {
      el.style.setProperty('--draw-progress', '1');
      el.classList.add('is-in');
    });
    document.querySelectorAll('.stepper-coin, .level-card .coin-num').forEach((c) => c.classList.add('is-lit'));
    return;
  }

  let ticking = false;
  const updateOnScroll = () => {
    ticking = false;
    const vh = window.innerHeight || 800;

    // 1. Update garis penghubung (data-reveal="draw")
    const drawEls = document.querySelectorAll('[data-reveal="draw"]');
    drawEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height <= 0) return;
      // Hitung progres 0..1 saat elemen melintasi viewport
      const startY = vh * 0.85;
      const endY = vh * 0.25;
      const raw = (startY - r.top) / Math.max(120, (startY - endY) + r.height * 0.55);
      const prog = Math.max(0, Math.min(1, raw));
      el.style.setProperty('--draw-progress', prog.toFixed(3));
      if (prog > 0.05) el.classList.add('is-in');

      // Nyalakan koin nomor langkah di dalam stepper bila sudah terlewati
      const coins = el.querySelectorAll('.stepper-coin');
      if (coins.length) {
        const thresholdCount = Math.max(1, Math.ceil(prog * coins.length));
        coins.forEach((c, idx) => {
          if (idx < thresholdCount || c.closest('.stepper-item.is-active')) {
            c.classList.add('is-lit');
          }
        });
      }
    });

    // Nyalakan koin nomor level di Materi saat kartu melewati batas baca viewport
    const levelCoins = document.querySelectorAll('#materi-panel .level-card .coin-num');
    levelCoins.forEach((coin) => {
      const r = coin.getBoundingClientRect();
      if (r.top < vh * 0.82) {
        coin.classList.add('is-lit');
      }
    });

    // 2. Update bayangan & skala halus untuk elemen data-reveal="zoom"
    const zoomEls = document.querySelectorAll('[data-reveal="zoom"]');
    zoomEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const prog = Math.max(0, Math.min(1, (vh * 0.92 - r.top) / (vh * 0.45)));
      el.style.setProperty('--zoom-progress', prog.toFixed(3));
    });
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateOnScroll);
    }
  }, { passive: true });

  requestAnimationFrame(updateOnScroll);
}

export function initReveal() {
  try {
    prepareMaskHeadings(document);
    prepareShelfCards(document);

    const els = [...document.querySelectorAll('.reveal, [data-reveal]')];
    const panels = [...document.querySelectorAll('.panel + .panel')];

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      panels.forEach((p) => p.classList.add('is-canopy-open'));
      return;
    }

    document.documentElement.classList.add('js-reveal');

    // Stagger per parent
    const counts = new Map();
    els.forEach((el) => {
      const p = el.parentElement;
      const i = counts.get(p) || 0;
      counts.set(p, i + 1);
      el.style.setProperty('--i', String(Math.min(i, 12)));
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          // Jika parent .reveal masuk viewport, aktifkan juga heading-mask di dalamnya
          e.target.querySelectorAll?.('.heading-mask, [data-reveal="mask"]').forEach((h) => h.classList.add('is-in'));
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    els.forEach((el) => io.observe(el));

    // Observer khusus untuk membuka "Kanopi Toko" (.panel + .panel) dari tengah ke kiri-kanan
    const canopyIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-canopy-open');
          canopyIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });

    panels.forEach((p) => canopyIo.observe(p));

    initScrollDrawAndZoom();

    // Pengaman: tampilkan elemen yang sudah di dalam viewport bila observer terlambat
    setTimeout(() => {
      els.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.05) {
          el.classList.add('is-in');
          el.querySelectorAll?.('.heading-mask, [data-reveal="mask"]').forEach((h) => h.classList.add('is-in'));
        }
      });
      panels.forEach((p) => {
        if (p.getBoundingClientRect().top < window.innerHeight * 1.05) {
          p.classList.add('is-canopy-open');
        }
      });
    }, 900);
  } catch (e) {
    console.error('[modul:reveal]', e);
    document.documentElement.classList.remove('js-reveal');
  }
}

/** Observe elemen yang dibuat dinamis oleh JS. */
export function revealNew(root) {
  if (!root) return;
  prepareMaskHeadings(root);
  prepareShelfCards(root);
  if (!document.documentElement.classList.contains('js-reveal')) return;
  const els = [...root.querySelectorAll('.reveal:not(.is-in), [data-reveal]:not(.is-in)')];
  els.forEach((el, i) => el.style.setProperty('--i', String(Math.min(i, 12))));
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}

export function initParallax() {
  if (prefersReducedMotion()) return;
  if (window.innerWidth <= 768 || window.matchMedia?.('(hover: none) and (pointer: coarse)').matches) return;
  const hero = document.getElementById('beranda');
  const items = [...document.querySelectorAll('[data-speed]')];
  if (!hero || !items.length) return;
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      if (y < hero.offsetHeight + 100) {
        items.forEach((el) => {
          el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.speed)}px, 0)`;
        });
      }
      ticking = false;
    });
  }, { passive: true });
}

export function initCounters() {
  const els = [...document.querySelectorAll('[data-count]')];
  const reduced = prefersReducedMotion();
  const setFinal = (el) => { el.textContent = el.dataset.count; };
  if (!('IntersectionObserver' in window) || reduced) { els.forEach(setFinal); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const end = +e.target.dataset.count, t0 = performance.now(), dur = 1200;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step); else setFinal(e.target);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
}
