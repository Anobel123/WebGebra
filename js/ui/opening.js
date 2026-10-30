// ============================================================================
//  ui/opening.js — Layar Pembuka "Membuka Toko..." & Rolling Shutter
// ============================================================================

import { prefersReducedMotion } from '../utils/safe.js';
import { setSparkGate } from './sparkFx.js';

// Konfigurasi durasi layar pembuka di bagian atas file
export const OPENING_CONFIG = {
  minDurationMs: 1200,               // Durasi tampil minimal (1,2 detik)
  maxDurationMs: 3000,               // Durasi tampil maksimal (3,0 detik)
  shutterDurationMs: 700,            // Durasi rolling shutter naik (0,7 detik)
  reducedMotionFadeMs: 180,          // Durasi fade singkat bila prefers-reduced-motion aktif
  sessionKey: 'algebraMart_openingSeen',
  preloadImages: [
    'assets/img/hero-bg.jpg',
    'assets/img/ss-profil.png'
  ]
};

let storeOpened = false;
const openListeners = new Set();

export function isStoreOpened() {
  return storeOpened;
}

export function onStoreOpened(cb) {
  if (typeof cb !== 'function') return;
  if (storeOpened) {
    try { cb({ immediate: true }); } catch (e) { console.error('[opening]', e); }
    return;
  }
  openListeners.add(cb);
}

function notifyStoreOpened(detail = {}) {
  if (storeOpened) return;
  storeOpened = true;
  setSparkGate(true);
  document.body.classList.remove('is-opening-active', 'is-opening-locked');
  document.body.classList.add('is-store-open');
  openListeners.forEach((cb) => {
    try { cb(detail); } catch (e) { console.error('[opening]', e); }
  });
  openListeners.clear();
  try {
    window.dispatchEvent(new CustomEvent('algebramart:store-opened', { detail }));
  } catch { /* abaikan */ }
}

function getSessionSeen() {
  try {
    return sessionStorage.getItem(OPENING_CONFIG.sessionKey) === '1';
  } catch {
    return false;
  }
}

function setSessionSeen() {
  try {
    sessionStorage.setItem(OPENING_CONFIG.sessionKey, '1');
  } catch { /* abaikan */ }
}

function hasDirectSectionHash() {
  const h = (window.location.hash || '').trim();
  return Boolean(h && h !== '#' && h !== '#beranda');
}

function preloadSingleImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    const done = () => resolve(src);
    img.onload = done;
    img.onerror = done; // Jangan gantung bila gambar opsional belum ada
    img.src = src;
    if (img.complete) done();
  });
}

export function initOpening() {
  const openingEl = document.getElementById('opening');
  if (!openingEl) {
    notifyStoreOpened({ skipped: true, reason: 'no-element' });
    return;
  }

  let closed = false;
  let minTimer = 0;
  let maxTimer = 0;
  let progTimer = 0;

  const unlockScrollFinally = () => {
    document.body.classList.remove('is-opening-locked', 'is-opening-active');
  };

  try {
    const reduced = prefersReducedMotion();
    const alreadySeen = getSessionSeen();
    const deepHash = hasDirectSectionHash();

    // Lewati layar pembuka bila sudah pernah tampil di sesi ini, ada hash bagian (#materi, dll.), atau reduced-motion
    if (alreadySeen || deepHash || reduced) {
      setSessionSeen();
      if (reduced && !alreadySeen && !deepHash) {
        openingEl.classList.add('is-Quick-fade');
        setTimeout(() => {
          openingEl.hidden = true;
          openingEl.classList.add('is-done');
        }, OPENING_CONFIG.reducedMotionFadeMs);
      } else {
        openingEl.hidden = true;
        openingEl.classList.add('is-done');
      }
      unlockScrollFinally();
      notifyStoreOpened({ skipped: true, reason: alreadySeen ? 'session' : deepHash ? 'hash' : 'reduced-motion' });
      return;
    }

    // Tahan efek percikan/trail dan animasi hero selama layar pembuka tampil
    setSparkGate(false);
    document.body.classList.add('is-opening-locked', 'is-opening-active');
    openingEl.classList.add('is-active');

    const barEl = document.getElementById('opening-bar');
    const skipBtn = document.getElementById('opening-skip');

    let progressPct = 18;
    const setBar = (pct) => {
      progressPct = Math.max(progressPct, Math.min(100, pct));
      if (barEl) barEl.style.width = `${progressPct}%`;
    };
    setBar(22);

    progTimer = setInterval(() => {
      if (progressPct < 88) setBar(progressPct + 11);
    }, 180);

    const finishOpening = (skipped = false) => {
      if (closed) return;
      closed = true;
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearInterval(progTimer);
      window.removeEventListener('keydown', onKeyDown);

      try {
        setSessionSeen();
        setBar(100);
        // Naikkan rolling shutter toko selama ~0,7 detik dan mulai animasi masuk hero
        openingEl.classList.add('is-shutter-rising');
        notifyStoreOpened({ skipped });

        setTimeout(() => {
          openingEl.hidden = true;
          openingEl.classList.add('is-done');
          openingEl.classList.remove('is-active', 'is-shutter-rising');
        }, skipped ? Math.min(420, OPENING_CONFIG.shutterDurationMs) : OPENING_CONFIG.shutterDurationMs);
      } finally {
        unlockScrollFinally();
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        finishOpening(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    skipBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      finishOpening(true);
    });
    openingEl.addEventListener('click', () => {
      finishOpening(true);
    });

    // Tunggu minimal 1,2 detik DAN preload gambar hero (atau maksimal 3 detik)
    let minElapsed = false;
    let assetsReady = false;

    const checkReady = () => {
      if (minElapsed && assetsReady) {
        finishOpening(false);
      }
    };

    minTimer = setTimeout(() => {
      minElapsed = true;
      setBar(92);
      checkReady();
    }, OPENING_CONFIG.minDurationMs);

    maxTimer = setTimeout(() => {
      assetsReady = true;
      minElapsed = true;
      finishOpening(false);
    }, OPENING_CONFIG.maxDurationMs);

    Promise.all(OPENING_CONFIG.preloadImages.map((src, idx, arr) =>
      preloadSingleImage(src).then(() => setBar(40 + Math.round(((idx + 1) / arr.length) * 45)))
    )).then(() => {
      assetsReady = true;
      checkReady();
    });

    // Pengaman akhir: pastikan scroll selalu dilepas paling lambat 3,6 detik
    setTimeout(unlockScrollFinally, OPENING_CONFIG.maxDurationMs + 600);
  } catch (e) {
    console.error('[modul:opening]', e);
    openingEl.hidden = true;
    openingEl.classList.add('is-done');
    unlockScrollFinally();
    notifyStoreOpened({ skipped: true, reason: 'error' });
  }
}

