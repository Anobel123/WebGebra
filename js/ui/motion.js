// ============================================================================
//  js/ui/motion.js — Sistem Animasi Scroll ke Bawah yang Berkarakter
//  Mendukung 5 gaya reveal (mask, shelf, kanopi toko, zoom, draw) dengan
//  progressive enhancement CSS animation-timeline: view() + IntersectionObserver
//  fallback, serta pengaman agar konten tidak pernah tersembunyi permanen.
// ============================================================================

import { prefersReducedMotion } from '../utils/safe.js';
import { REVEAL_TIMING } from './reveal.js';
export { REVEAL_TIMING };

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

/* ============================================================================
   REVEAL DUA ARAH (reversible)
   - Mode 'sda' : CSS scroll-driven animation (animation-timeline: view()).
                  Maju saat scroll turun, mundur saat scroll naik, tanpa JS per frame.
   - Mode 'io'  : cadangan IntersectionObserver dua arah (tambah/hapus .is-in)
                  dengan histeresis (-10% / -3%) + jeda 80 ms anti-kedip.
   - Elemen lipatan pertama (.rv-static) hanya fade-in sekali saat dimuat.
   - prefers-reduced-motion / JS mati: .js-reveal tidak dipasang -> semua tampil.
   ============================================================================ */

const REVEAL_SELECTOR = [
  '.reveal', '[data-reveal="shelf"]', '.reveal--shelf', '[data-reveal="zoom"]',
  '.heading-mask', '[data-reveal="mask"]'
].join(', ');

const RV = {
  mode: 'io',        // Gunakan observer dua arah tunggal yang konsisten di semua peramban
  io: null,          // observer dua arah untuk elemen reveal (.is-in)
  canopyIo: null     // observer dua arah untuk kanopi toko (.is-canopy-open)
};

/** Deteksi dukungan CSS scroll-driven animation (dinonaktifkan demi stabilitas dua arah konsisten). */
export function supportsScrollDrivenReveal() {
  // Standarisasi pada IntersectionObserver dua arah: terbukti 100% stabil di semua peramban,
  // tidak terputus oleh overflow layout (clip/hidden), dan menjamin elemen atas tetap tampil
  // sementara elemen bawah mundur saat scroll ke atas.
  return false;
}

/* --- Elemen di dalam scroll container lain (overflow hidden/auto) tidak bisa memakai
       view() terhadap viewport; elemen seperti itu otomatis memakai cadangan IO. --- */
const scrollerCache = new WeakMap();
function isInnerScroller(node) {
  if (scrollerCache.has(node)) return scrollerCache.get(node);
  const cs = window.getComputedStyle(node);
  const v = /(hidden|auto|scroll)/.test(`${cs.overflowX} ${cs.overflowY}`);
  scrollerCache.set(node, v);
  return v;
}
function hasInnerScrollContainer(el) {
  let n = el.parentElement;
  while (n && n !== document.body && n !== document.documentElement) {
    if (isInnerScroller(n)) return true;
    n = n.parentElement;
  }
  return false;
}

function afterTwoFrames(fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

/**
 * Observer dua arah berbasis kelas.
 * - Masuk: elemen melewati garis 90% tinggi layar (rootMargin bawah -10%).
 * - Keluar lewat BAWAH: bagian atas elemen turun melewati 97% layar -> tunggu 80 ms,
 *   periksa ulang, baru hapus kelas (histeresis 7% mencegah kedip di batas).
 * - Keluar lewat ATAS: kelas dipertahankan (konten yang sudah terlewati tetap tampil).
 * - Lompatan jauh (klik menu): disapu sekali setelah scroll berhenti, tanpa animasi.
 */
function createTwoWayObserver(cls) {
  const HIDE_LINE = 0.97;
  const targets = new Set();
  const pendingHide = new Set();
  let hideTimer = 0;
  let sweepTimer = 0;

  const setShown = (el, on, instant = false) => {
    if (el.classList.contains(cls) === on) return;
    if (instant) el.classList.add('rv-instant');
    el.classList.toggle(cls, on);
    if (instant) afterTwoFrames(() => el.classList.remove('rv-instant'));
  };

  const flushHide = () => {
    hideTimer = 0;
    const vh = window.innerHeight || 800;
    const list = [...pendingHide];
    pendingHide.clear();
    const rects = list.map((el) => (el.isConnected ? el.getBoundingClientRect() : null));
    list.forEach((el, k) => {
      const r = rects[k];
      if (r && r.top > vh * HIDE_LINE) setShown(el, false);
    });
  };

  const showIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target;
      if (e.isIntersecting) {
        pendingHide.delete(el);
        setShown(el, true);
      } else {
        const rootTop = e.rootBounds ? e.rootBounds.top : 0;
        if (e.boundingClientRect.bottom <= rootTop) setShown(el, true, true);
      }
    }
  }, { rootMargin: `0px 0px ${REVEAL_TIMING.rootMarginBottomPct}% 0px`, threshold: REVEAL_TIMING.triggerRatio });

  const hideIo = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target;
      if (e.isIntersecting) {
        pendingHide.delete(el);
        continue;
      }
      const rootTop = e.rootBounds ? e.rootBounds.top : 0;
      if (e.boundingClientRect.top > rootTop && el.classList.contains(cls)) {
        pendingHide.add(el);
      }
    }
    if (pendingHide.size && !hideTimer) hideTimer = setTimeout(flushHide, 80);
  }, { rootMargin: '0px 0px -2% 0px', threshold: 0 });

  const sweep = () => {
    sweepTimer = 0;
    const vh = window.innerHeight || 800;
    const list = [...targets].filter((el) => el.isConnected);
    const rects = list.map((el) => el.getBoundingClientRect());
    list.forEach((el, k) => {
      const r = rects[k];
      if (r.bottom <= 0) setShown(el, true, true);
      else if (r.top > vh) setShown(el, false, true);
    });
  };
  window.addEventListener('scroll', () => {
    clearTimeout(sweepTimer);
    sweepTimer = setTimeout(sweep, 140);
  }, { passive: true });

  return {
    observe(el) {
      if (targets.has(el)) return;
      targets.add(el);
      showIo.observe(el);
      hideIo.observe(el);
    },
    unobserve(el) {
      targets.delete(el);
      pendingHide.delete(el);
      showIo.unobserve(el);
      hideIo.unobserve(el);
    },
    sweep
  };
}

/* ----------------------------------------------------------------------------
   Garis emas (data-reveal="draw"), koin langkah, & koin level: terikat posisi
   scroll sehingga otomatis mundur & padam saat scroll ke atas.
   ---------------------------------------------------------------------------- */
let drawEls = [];
let levelCoins = [];
let drawTicking = false;
let drawReady = false;

function collectDrawTargets() {
  drawEls = [...document.querySelectorAll('[data-reveal="draw"]')];
  levelCoins = [...document.querySelectorAll('#materi-panel .level-card .coin-num')];
}

function updateScrollDraw() {
  drawTicking = false;
  const vh = window.innerHeight || 800;

  // Batch baca layout dahulu
  const drawRects = drawEls.map((el) => (el.isConnected ? el.getBoundingClientRect() : null));
  const coinTops = levelCoins.map((c) => (c.isConnected ? c.getBoundingClientRect().top : Infinity));

  // Lalu tulis (hanya custom property & kelas)
  drawEls.forEach((el, k) => {
    const r = drawRects[k];
    if (!r || r.height <= 0) return;
    const startY = vh * 0.92;
    const endY = vh * 0.12;
    const raw = (startY - r.top) / Math.max(140, (startY - endY) + r.height * 0.65);
    const prog = Math.max(0, Math.min(1, raw));
    el.style.setProperty('--draw-progress', prog.toFixed(3));
    el.classList.toggle('is-in', prog > 0.05);

    const coins = el.querySelectorAll('.stepper-coin');
    if (coins.length) {
      const litCount = prog <= 0.001 ? 0 : Math.ceil(prog * coins.length);
      coins.forEach((c, idx) => {
        const isActive = prog > 0.001 && Boolean(c.closest('.stepper-item.is-active'));
        c.classList.toggle('is-lit', idx < litCount || isActive);
      });
    }
  });

  levelCoins.forEach((coin, k) => {
    coin.classList.toggle('is-lit', coinTops[k] < vh * 0.82);
  });
}

/** Minta pembaruan garis/koin (mis. setelah carousel berganti langkah atau DOM baru). */
export function refreshScrollDraw() {
  if (!drawReady) return;
  collectDrawTargets();
  if (!drawTicking) {
    drawTicking = true;
    requestAnimationFrame(updateScrollDraw);
  }
}

function initScrollDraw() {
  if (prefersReducedMotion()) {
    document.querySelectorAll('[data-reveal="draw"]').forEach((el) => {
      el.style.setProperty('--draw-progress', '1');
      el.classList.add('is-in');
    });
    document.querySelectorAll('.stepper-coin, .level-card .coin-num').forEach((c) => c.classList.add('is-lit'));
    return;
  }
  drawReady = true;
  collectDrawTargets();
  const onScroll = () => {
    if (!drawTicking) {
      drawTicking = true;
      requestAnimationFrame(updateScrollDraw);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

/* ----------------------------------------------------------------------------
   Pemasangan elemen ke mode yang sesuai
   ---------------------------------------------------------------------------- */
function bindRevealElements(els, { initial }) {
  const vh = window.innerHeight || 800;
  const sy = window.scrollY || 0;
  const fresh = els.filter((el) => el.dataset.rvBound !== '1');
  const rects = fresh.map((el) => el.getBoundingClientRect()); // batch baca
  const staticEls = [];

  fresh.forEach((el, k) => {
    el.dataset.rvBound = '1';
    const r = rects[k];
    // Di lipatan pertama dokumen saat scroll berada di paling atas: fade-in sekali
    if (initial && sy === 0 && r.top < vh * 0.9) {
      el.classList.add('rv-static');
      staticEls.push(el);
      return;
    }
    // Jika sudah terlewati di atas layar (mis. muat langsung dengan anchor #hash)
    if (r.bottom <= 0) {
      el.classList.add('is-in');
    }
    // Daftarkan ke observer dua arah (show saat masuk bawah, hide saat keluar bawah)
    RV.io.observe(el);
  });

  if (staticEls.length) afterTwoFrames(() => staticEls.forEach((el) => el.classList.add('is-in')));
}

function bindCanopies(panels) {
  const vh = window.innerHeight || 800;
  const sy = window.scrollY || 0;
  const rects = panels.map((p) => p.getBoundingClientRect());
  panels.forEach((p, k) => {
    if (p.dataset.rvBound === '1') return;
    p.dataset.rvBound = '1';
    const r = rects[k];
    if (sy === 0 && r.top < vh * 0.9) {
      p.classList.add('rv-static');
      afterTwoFrames(() => p.classList.add('is-canopy-open'));
      return;
    }
    if (r.bottom <= 0) p.classList.add('is-canopy-open');
    RV.canopyIo.observe(p);
  });
}

function setStaggerIndex(els) {
  const counts = new Map();
  const maxIdx = Math.max(4, Math.floor(REVEAL_TIMING.staggerMaxMs / REVEAL_TIMING.staggerMs));
  els.forEach((el) => {
    const p = el.parentElement;
    const i = counts.get(p) || 0;
    counts.set(p, i + 1);
    el.style.setProperty('--i', String(Math.min(i, maxIdx)));
  });
}

export function initReveal() {
  const html = document.documentElement;
  try {
    prepareMaskHeadings(document);
    prepareShelfCards(document);

    const els = [...document.querySelectorAll(REVEAL_SELECTOR)];
    const panels = [...document.querySelectorAll('.panel + .panel')];

    // Tanpa IO atau pengguna meminta gerak minimal: tampil biasa tanpa animasi
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      els.forEach((el) => el.classList.add('is-in'));
      panels.forEach((p) => p.classList.add('is-canopy-open'));
      initScrollDraw();
      return;
    }

    RV.mode = 'io';
    RV.io = createTwoWayObserver('is-in');
    RV.canopyIo = createTwoWayObserver('is-canopy-open');

    setStaggerIndex(els);

    // Ukur dahulu (sebelum kelas penyembunyi aktif), baru pasang kelas mode
    html.classList.add('js-reveal', 'rv-io');
    html.classList.remove('rv-sda');
    bindRevealElements(els, { initial: true });
    bindCanopies(panels);
    html.dataset.revealMode = 'io';

    initScrollDraw();

    // Deteksi scroll cepat (kecepatan scroll tinggi): percepat animasi agar konten tidak tertinggal
    let lastScrollY = window.scrollY || 0;
    let lastScrollTime = performance.now();
    let isFastScrolling = false;
    let fastScrollTimer = 0;

    window.addEventListener('scroll', () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime);
      const sy = window.scrollY || 0;
      const v = Math.abs(sy - lastScrollY) / dt;
      lastScrollY = sy;
      lastScrollTime = now;

      if (v > 1.8) {
        if (!isFastScrolling) {
          isFastScrolling = true;
          document.documentElement.classList.add('rv-fast-scroll');
        }
        clearTimeout(fastScrollTimer);
        fastScrollTimer = setTimeout(() => {
          isFastScrolling = false;
          document.documentElement.classList.remove('rv-fast-scroll');
        }, 160);
      }
    }, { passive: true });

    // Klik menu navigasi lompat jauh: jangan tumpuk antrean animasi, sweep elemen yang terlewati
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      if (RV.io) RV.io.sweep();
      if (RV.canopyIo) RV.canopyIo.sweep();
    }, { capture: true });

    // Pengaman: elemen yang sudah di dalam viewport pasti tampil bila observer terlambat
    setTimeout(() => {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('.js-reveal :is(.reveal, [data-reveal], .heading-mask):not(.is-in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) el.classList.add('is-in');
      });
    }, 1200);
  } catch (e) {
    console.error('[modul:reveal]', e);
    html.classList.remove('js-reveal', 'rv-sda', 'rv-io');
  }
}

/** Pasang reveal dua arah untuk elemen yang dibuat dinamis oleh JS. */
export function revealNew(root) {
  if (!root) return;
  prepareMaskHeadings(root);
  prepareShelfCards(root);
  refreshScrollDraw();
  if (!document.documentElement.classList.contains('js-reveal') || !RV.io) return;
  const els = [...root.querySelectorAll(REVEAL_SELECTOR)].filter((el) => el.dataset.rvBound !== '1');
  els.forEach((el, i) => el.style.setProperty('--i', String(Math.min(i, 12))));
  bindRevealElements(els, { initial: false });
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
