// ============================================================================
//  ui/hoverFx.js — Sistem Interaksi Hover & Sentuh Bertema Toko Kelontong
//  Meliputi:
//   1. Tombol CTA: kilau emas menyapu, koin 3D berputar, timbul/menekan,
//      magnetik halus (radius 80px, geser 4-8px), & label bergeser (data-hover)
//   2. Kartu: tilt 3D (6-8°, perspective 900px) + kilau foil emas mengikuti kursor,
//      lencana level bergoyang + 3 bintang menyala bertahap (stagger 90ms),
//      contoh transaksi bergeser naik, & ID Card pengembang meluruskan diri
//   3. Menu Navbar: garis emas melebar dari tengah + naik 1-2px
//   4. QR & Kartu Akses: QR scale 1.04 + denyut bingkai emas + "Scan untuk bermain",
//      tombol Play Store/APK ikon mengayun ±6° + 2-3 koin sudut
//   5. Kursor Khusus (pointer: fine): cincin emas magnetik dengan titik koin (lerp)
//   6. Simbol Aljabar di Hover: 2-3 simbol (+, =, x, d) naik pelan (maks 3/elemen)
//   7. Pengganti Hover di Layar Sentuh: dipicu :active & IntersectionObserver
// ============================================================================

import { prefersReducedMotion } from '../utils/safe.js';

export const HOVER_CONFIG = {
  enabled: true,
  switches: {
    tilt: true,
    magnetic: true,
    cursor: true,
    hoverSymbols: true,
    cornerCoins: true,
    touchFallback: true
  },
  tilt: {
    maxDeg: 7,
    perspective: 900,
    selector: '.card--tilt, .level-card, .feature, .id-card, [data-fx~="tilt"]'
  },
  magnetic: {
    radius: 80,
    maxShift: 6.5,
    selector: '[data-fx~="magnetic"]'
  },
  cursor: {
    lerp: 0.24,
    defaultSize: 22,
    hoverSizeMin: 40,
    hoverSizeMax: 58,
    interactiveSelector: 'a, button, .btn, .store-badge, .card--tilt, .level-card, .id-card, .qr-box, .tab, .quiz-choice, .smp-char, .rating-star'
  },
  symbols: {
    glyphs: ['+', '=', 'x', 'd'],
    maxPerElement: 3,
    countMin: 2,
    countMax: 3,
    durMs: 960,
    fontMin: 11,
    fontMax: 14,
    selector: '[data-fx~="cta"], .level-card'
  },
  cornerCoins: {
    countMin: 2,
    countMax: 3,
    durMs: 760,
    selector: '.store-badge, [data-fx~="store-apk"]'
  },
  fps: {
    minFps: 30,
    lowStreakLimit: 18
  }
};

const state = {
  degraded: false,
  isFinePointer: false,
  isTouchDevice: false,
  pointerX: -100,
  pointerY: -100,
  ringX: -100,
  ringY: -100,
  ringSize: HOVER_CONFIG.cursor.defaultSize,
  ringTargetSize: HOVER_CONFIG.cursor.defaultSize,
  ringActive: false,
  ringVisible: false,
  cursorEl: null,
  fxLayer: null,
  activeTiltEl: null,
  activeInteractiveEl: null,
  magneticEls: [],
  activeSymsMap: new WeakMap(),
  lastSymSpawnMap: new WeakMap(),
  lastCoinSpawnMap: new WeakMap(),
  rafId: 0,
  cursorRafId: 0,
  fpsFrames: 0,
  fpsLastTime: 0,
  lowFpsStreak: 0,
  initialized: false
};

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function isFxAllowed() {
  if (!HOVER_CONFIG.enabled || state.degraded || prefersReducedMotion()) return false;
  const toggleBtn = document.getElementById('fx-toggle');
  if (toggleBtn && toggleBtn.getAttribute('aria-pressed') === 'false') return false;
  return true;
}

function checkFps(now) {
  if (!state.fpsLastTime) {
    state.fpsLastTime = now;
    state.fpsFrames = 0;
    return;
  }
  state.fpsFrames++;
  const dt = now - state.fpsLastTime;
  if (dt >= 260) {
    const fps = (state.fpsFrames * 1000) / dt;
    if (fps < HOVER_CONFIG.fps.minFps) {
      state.lowFpsStreak++;
      if (state.lowFpsStreak >= HOVER_CONFIG.fps.lowStreakLimit) {
        state.degraded = true;
        resetAllTransforms();
      }
    } else {
      state.lowFpsStreak = Math.max(0, state.lowFpsStreak - 1);
    }
    state.fpsFrames = 0;
    state.fpsLastTime = now;
  }
}

function ensureFxLayer() {
  if (state.fxLayer && document.body.contains(state.fxLayer)) return state.fxLayer;
  let el = document.getElementById('spark-fx-layer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'spark-fx-layer';
    el.className = 'spark-fx-layer';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }
  state.fxLayer = el;
  return el;
}

/**
 * 1. Sempurnakan struktur DOM tombol CTA (koin kecil 3D + teks alternatif bergeser)
 *    dan tambahkan lapisan kilau foil (.card__sheen) pada kartu.
 */
export function upgradeHoverElements(root = document) {
  try {
    // Tombol CTA dengan data-hover
    root.querySelectorAll('.btn[data-fx~="cta"]').forEach((btn) => {
      if (btn.dataset.hoverUpgraded) return;
      btn.dataset.hoverUpgraded = '1';

      const originalText = btn.textContent.trim();
      if (!btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', originalText.replace(/^▶\s*/, ''));
      }

      const altText = btn.getAttribute('data-hover') || originalText;
      const existingSvg = btn.querySelector('svg');
      if (existingSvg) existingSvg.remove();

      btn.textContent = '';
      // Koin kecil 3D di dalam tombol
      const coin = document.createElement('span');
      coin.className = 'btn__coin';
      coin.setAttribute('aria-hidden', 'true');
      coin.textContent = 'x';
      btn.appendChild(coin);

      if (existingSvg) btn.appendChild(existingSvg);

      // Pembungkus label bergeser
      const wrap = document.createElement('span');
      wrap.className = 'btn__label-wrap';
      const mainSpan = document.createElement('span');
      mainSpan.className = 'btn__label-main';
      mainSpan.textContent = originalText;
      const altSpan = document.createElement('span');
      altSpan.className = 'btn__label-alt';
      altSpan.setAttribute('aria-hidden', 'true');
      altSpan.textContent = altText;
      wrap.append(mainSpan, altSpan);
      btn.appendChild(wrap);
    });

    // Tambahkan kilau foil emas (.card__sheen) pada kartu tilt
    root.querySelectorAll(HOVER_CONFIG.tilt.selector).forEach((card) => {
      if (!card.querySelector(':scope > .card__sheen')) {
        const sheen = document.createElement('span');
        sheen.className = 'card__sheen';
        sheen.setAttribute('aria-hidden', 'true');
        card.appendChild(sheen);
      }
    });

    state.magneticEls = [...document.querySelectorAll(HOVER_CONFIG.magnetic.selector)];
  } catch (e) {
    console.error('[modul:hoverFx]', e);
  }
}

/**
 * 6. Simbol Aljabar Naik Pelan di Hover (maks 3 simbol aktif per elemen)
 */
export function spawnHoverSymbols(targetEl) {
  try {
    if (!isFxAllowed() || !HOVER_CONFIG.switches.hoverSymbols || !targetEl) return;
    const now = performance.now();
    const lastAt = state.lastSymSpawnMap.get(targetEl) || 0;
    if (now - lastAt < 320) return;

    const currentCount = state.activeSymsMap.get(targetEl) || 0;
    const available = HOVER_CONFIG.symbols.maxPerElement - currentCount;
    if (available <= 0) return;

    state.lastSymSpawnMap.set(targetEl, now);
    const rect = targetEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const layer = ensureFxLayer();
    const toSpawn = Math.min(available, randInt(HOVER_CONFIG.symbols.countMin, HOVER_CONFIG.symbols.countMax));

    for (let i = 0; i < toSpawn; i++) {
      const sym = document.createElement('span');
      sym.className = 'fx-hover-sym';
      sym.setAttribute('aria-hidden', 'true');
      sym.textContent = pick(HOVER_CONFIG.symbols.glyphs);

      // Posisi di sepanjang tepi atas/samping elemen
      const frac = (i + 0.5) / toSpawn + rand(-0.12, 0.12);
      const sx = rect.left + Math.max(10, Math.min(rect.width - 10, rect.width * frac));
      const sy = rect.top + rand(2, Math.min(18, rect.height * 0.35));
      const fSize = Math.round(rand(HOVER_CONFIG.symbols.fontMin, HOVER_CONFIG.symbols.fontMax));
      const driftX = rand(-10, 10);
      const driftY = -rand(18, 28);
      const rot = rand(-16, 16);
      const delay = i * 95;

      sym.style.left = `${sx}px`;
      sym.style.top = `${sy}px`;
      sym.style.fontSize = `${fSize}px`;
      layer.appendChild(sym);

      state.activeSymsMap.set(targetEl, (state.activeSymsMap.get(targetEl) || 0) + 1);

      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        sym.remove();
        const c = state.activeSymsMap.get(targetEl) || 1;
        state.activeSymsMap.set(targetEl, Math.max(0, c - 1));
      };

      if (typeof sym.animate === 'function') {
        const anim = sym.animate([
          { transform: 'translate(-50%, -50%) translate3d(0, 4px, 0) scale(0.75) rotate(0deg)', opacity: 0 },
          { transform: `translate(-50%, -50%) translate3d(${(driftX * 0.4).toFixed(1)}px, ${(driftY * 0.4).toFixed(1)}px, 0) scale(1) rotate(${(rot * 0.5).toFixed(1)}deg)`, opacity: 0.78, offset: 0.3 },
          { transform: `translate(-50%, -50%) translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0) scale(0.85) rotate(${rot.toFixed(1)}deg)`, opacity: 0 }
        ], {
          duration: HOVER_CONFIG.symbols.durMs,
          delay,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        });
        anim.onfinish = cleanup;
      }
      setTimeout(cleanup, HOVER_CONFIG.symbols.durMs + delay + 80);
    }
  } catch (e) {
    console.error('[modul:hoverFx]', e);
  }
}

/**
 * 4b. Munculkan 2-3 koin kecil di sudut tombol Play Store & APK saat hover
 */
export function spawnCornerCoins(btnEl) {
  try {
    if (!isFxAllowed() || !HOVER_CONFIG.switches.cornerCoins || !btnEl) return;
    const now = performance.now();
    const lastAt = state.lastCoinSpawnMap.get(btnEl) || 0;
    if (now - lastAt < 450) return;
    state.lastCoinSpawnMap.set(btnEl, now);

    const rect = btnEl.getBoundingClientRect();
    if (!rect.width) return;
    const layer = ensureFxLayer();
    const corners = [
      [rect.left + 6, rect.top + 6, -12, -16],
      [rect.right - 6, rect.top + 6, 12, -16],
      [rect.right - 10, rect.bottom - 6, 14, -10]
    ];
    const count = randInt(HOVER_CONFIG.cornerCoins.countMin, HOVER_CONFIG.cornerCoins.countMax);

    for (let i = 0; i < count; i++) {
      const [cx, cy, dx, dy] = corners[i % corners.length];
      const coin = document.createElement('span');
      coin.className = 'fx-corner-coin';
      coin.setAttribute('aria-hidden', 'true');
      coin.style.left = `${cx}px`;
      coin.style.top = `${cy}px`;
      layer.appendChild(coin);

      const delay = i * 70;
      if (typeof coin.animate === 'function') {
        const anim = coin.animate([
          { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 0 },
          { transform: `translate(-50%, -50%) translate3d(${(dx * 0.6).toFixed(1)}px, ${(dy * 0.6).toFixed(1)}px, 0) scale(1.1)`, opacity: 0.95, offset: 0.35 },
          { transform: `translate(-50%, -50%) translate3d(${dx}px, ${dy}px, 0) scale(0.7)`, opacity: 0 }
        ], {
          duration: HOVER_CONFIG.cornerCoins.durMs,
          delay,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        });
        anim.onfinish = () => coin.remove();
      }
      setTimeout(() => coin.remove(), HOVER_CONFIG.cornerCoins.durMs + delay + 80);
    }
  } catch (e) {
    console.error('[modul:hoverFx]', e);
  }
}

function clearTiltOnElement(el) {
  if (!el) return;
  el.classList.remove('is-tilting');
  el.style.removeProperty('--tilt-x');
  el.style.removeProperty('--tilt-y');
  el.style.removeProperty('--sheen-x');
  el.style.removeProperty('--sheen-y');
}

function resetAllTransforms() {
  if (state.activeTiltEl) {
    clearTiltOnElement(state.activeTiltEl);
    state.activeTiltEl = null;
  }
  state.magneticEls.forEach((el) => {
    el.classList.remove('is-magnetic');
    el.style.removeProperty('--mag-x');
    el.style.removeProperty('--mag-y');
  });
}

/**
 * Batch Read -> Batch Write untuk Tilt 3D & Efek Magnetik di dalam rAF
 */
function updatePointerFrame(now) {
  state.rafId = 0;
  try {
    if (!isFxAllowed() || !state.isFinePointer) {
      resetAllTransforms();
      return;
    }
    checkFps(now);

    const px = state.pointerX;
    const py = state.pointerY;

    // --- FASE BACA (READ DOM RECTS) ---
    let tiltRead = null;
    if (HOVER_CONFIG.switches.tilt && state.activeTiltEl) {
      const r = state.activeTiltEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        tiltRead = { el: state.activeTiltEl, r };
      }
    }

    const magReads = [];
    if (HOVER_CONFIG.switches.magnetic) {
      for (const el of state.magneticEls) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;
        magReads.push({ el, r });
      }
    }

    // --- FASE TULIS (WRITE CSS VARIABLES) ---
    if (tiltRead) {
      const { el, r } = tiltRead;
      const nx = Math.max(-1, Math.min(1, ((px - r.left) / r.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((py - r.top) / r.height) * 2 - 1));
      const maxD = el.classList.contains('id-card') ? 4.5 : HOVER_CONFIG.tilt.maxDeg;
      const rotY = (nx * maxD).toFixed(2);
      const rotX = (-ny * maxD).toFixed(2);
      const sx = Math.round(((nx + 1) * 0.5) * 100);
      const sy = Math.round(((ny + 1) * 0.5) * 100);

      el.classList.add('is-tilting');
      el.style.setProperty('--tilt-x', `${rotX}deg`);
      el.style.setProperty('--tilt-y', `${rotY}deg`);
      el.style.setProperty('--sheen-x', `${sx}%`);
      el.style.setProperty('--sheen-y', `${sy}%`);
    }

    const rad = HOVER_CONFIG.magnetic.radius;
    const maxShift = HOVER_CONFIG.magnetic.maxShift;
    for (const { el, r } of magReads) {
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // Jarak ke tepi terdekat tombol atau pusat tombol
      const dx = px - cx;
      const dy = py - cy;
      const distEdgeX = Math.max(0, Math.abs(dx) - r.width / 2);
      const distEdgeY = Math.max(0, Math.abs(dy) - r.height / 2);
      const distEdge = Math.hypot(distEdgeX, distEdgeY);

      if (distEdge <= rad) {
        const pull = 1 - distEdge / rad;
        const normX = Math.max(-1, Math.min(1, dx / (r.width * 0.5 || 1)));
        const normY = Math.max(-1, Math.min(1, dy / (r.height * 0.5 || 1)));
        const mx = normX * maxShift * (0.65 + 0.35 * pull);
        const my = normY * maxShift * (0.65 + 0.35 * pull);
        el.classList.add('is-magnetic');
        el.style.setProperty('--mag-x', `${mx.toFixed(2)}px`);
        el.style.setProperty('--mag-y', `${my.toFixed(2)}px`);
      } else if (el.classList.contains('is-magnetic')) {
        el.classList.remove('is-magnetic');
        el.style.removeProperty('--mag-x');
        el.style.removeProperty('--mag-y');
      }
    }
  } catch (e) {
    console.error('[modul:hoverFx]', e);
  }
}

/**
 * 5. Kursor Khusus Bercincin Emas (hanya pointer: fine) dengan Lerp Halus
 */
function ensureCursorRing() {
  if (state.cursorEl && document.body.contains(state.cursorEl)) return state.cursorEl;
  let el = document.getElementById('hover-cursor-ring');
  if (!el) {
    el = document.createElement('div');
    el.id = 'hover-cursor-ring';
    el.className = 'hover-cursor-ring';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span class="hover-cursor-ring__dot"></span>';
    document.body.appendChild(el);
  }
  state.cursorEl = el;
  return el;
}

function stepCursorRing() {
  state.cursorRafId = 0;
  try {
    if (!isFxAllowed() || !HOVER_CONFIG.switches.cursor || !state.isFinePointer || !state.ringVisible) {
      state.cursorEl?.classList.remove('is-visible', 'is-interactive');
      return;
    }
    const ring = ensureCursorRing();
    const k = HOVER_CONFIG.cursor.lerp;
    state.ringX += (state.pointerX - state.ringX) * k;
    state.ringY += (state.pointerY - state.ringY) * k;
    state.ringSize += (state.ringTargetSize - state.ringSize) * k;

    ring.classList.add('is-visible');
    ring.classList.toggle('is-interactive', state.ringActive);
    ring.style.transform = `translate3d(${state.ringX.toFixed(1)}px, ${state.ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    ring.style.width = `${state.ringSize.toFixed(1)}px`;
    ring.style.height = `${state.ringSize.toFixed(1)}px`;

    if (
      Math.hypot(state.pointerX - state.ringX, state.pointerY - state.ringY) > 0.35 ||
      Math.abs(state.ringTargetSize - state.ringSize) > 0.35
    ) {
      state.cursorRafId = requestAnimationFrame(stepCursorRing);
    }
  } catch (e) {
    console.error('[modul:hoverFx]', e);
  }
}

/**
 * 7. Pengganti Hover di Layar Sentuh (IntersectionObserver + :active)
 */
function initTouchFallbacks() {
  try {
    if (!HOVER_CONFIG.switches.touchFallback) return;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-touch-seen');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.45 });

      const observeCards = () => {
        document.querySelectorAll('.level-card, .btn[data-fx~="cta"]').forEach((el) => {
          if (!el.dataset.touchObserved) {
            el.dataset.touchObserved = '1';
            io.observe(el);
          }
        });
      };
      observeCards();
      document.getElementById('materi-tabs')?.addEventListener('click', () => setTimeout(observeCards, 60));
    }
  } catch (e) {
    console.error('[modul:hoverFx]', e);
  }
}

export function initHoverFx() {
  try {
    if (state.initialized) return;
    state.initialized = true;

    state.isFinePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
    state.isTouchDevice = window.matchMedia?.('(hover: none) and (pointer: coarse)').matches ?? false;

    upgradeHoverElements();

    // Pantau perubahan isi panel materi (saat tab fase diklik) agar kartu level baru juga memiliki sheen
    const materiPanel = document.getElementById('materi-panel');
    if (materiPanel && 'MutationObserver' in window) {
      const mo = new MutationObserver(() => upgradeHoverElements(materiPanel));
      mo.observe(materiPanel, { childList: true });
    }

    if (state.isFinePointer) {
      ensureCursorRing();
    }
    initTouchFallbacks();

    document.addEventListener('pointerover', (e) => {
      try {
        if (!isFxAllowed()) return;
        const t = e.target;
        if (!t || typeof t.closest !== 'function') return;

        // Simbol aljabar naik pada tombol CTA & kartu level
        const symTarget = t.closest(HOVER_CONFIG.symbols.selector);
        if (symTarget && (!e.relatedTarget || !symTarget.contains(e.relatedTarget))) {
          spawnHoverSymbols(symTarget);
        }

        // Koin sudut pada tombol Play Store / APK
        const storeBtn = t.closest(HOVER_CONFIG.cornerCoins.selector);
        if (storeBtn && (!e.relatedTarget || !storeBtn.contains(e.relatedTarget))) {
          spawnCornerCoins(storeBtn);
        }

        if (!state.isFinePointer) return;

        // Tilt kartu
        const tiltCandidate = t.closest(HOVER_CONFIG.tilt.selector);
        if (tiltCandidate !== state.activeTiltEl) {
          if (state.activeTiltEl) clearTiltOnElement(state.activeTiltEl);
          state.activeTiltEl = tiltCandidate;
        }

        // Kursor cincin emas
        const inter = t.closest(HOVER_CONFIG.cursor.interactiveSelector);
        state.activeInteractiveEl = inter;
        if (inter) {
          const r = inter.getBoundingClientRect();
          const targetDim = Math.min(
            HOVER_CONFIG.cursor.hoverSizeMax,
            Math.max(HOVER_CONFIG.cursor.hoverSizeMin, Math.min(r.width, r.height) * 0.72)
          );
          state.ringActive = true;
          state.ringTargetSize = targetDim;
        } else {
          state.ringActive = false;
          state.ringTargetSize = HOVER_CONFIG.cursor.defaultSize;
        }
        if (!state.cursorRafId) state.cursorRafId = requestAnimationFrame(stepCursorRing);
      } catch (err) {
        console.error('[modul:hoverFx]', err);
      }
    }, { passive: true });

    document.addEventListener('pointermove', (e) => {
      try {
        if (e.pointerType === 'touch' || !state.isFinePointer) return;
        if (!isFxAllowed()) return;

        state.pointerX = e.clientX;
        state.pointerY = e.clientY;
        if (!state.ringVisible) {
          state.ringVisible = true;
          state.ringX = e.clientX;
          state.ringY = e.clientY;
        }

        // Pastikan elemen tilt selalu sinkron saat pointer bergerak
        const t = e.target;
        if (t && typeof t.closest === 'function') {
          const tiltCandidate = t.closest(HOVER_CONFIG.tilt.selector);
          if (tiltCandidate !== state.activeTiltEl) {
            if (state.activeTiltEl) clearTiltOnElement(state.activeTiltEl);
            state.activeTiltEl = tiltCandidate;
          }
        }

        if (!state.rafId) state.rafId = requestAnimationFrame(updatePointerFrame);
        if (!state.cursorRafId) state.cursorRafId = requestAnimationFrame(stepCursorRing);
      } catch (err) {
        console.error('[modul:hoverFx]', err);
      }
    }, { passive: true });

    // Cegah klik navigasi pada tombol yang aria-disabled="true"
    document.addEventListener('click', (e) => {
      const disabledBtn = e.target.closest?.('[aria-disabled="true"]');
      if (disabledBtn) e.preventDefault();
    });

    document.addEventListener('pointerout', (e) => {
      try {
        if (!state.isFinePointer) return;
        const related = e.relatedTarget;
        if (!related) {
          state.ringVisible = false;
          state.cursorEl?.classList.remove('is-visible', 'is-interactive');
          resetAllTransforms();
          return;
        }
        if (state.activeTiltEl && !state.activeTiltEl.contains(related)) {
          clearTiltOnElement(state.activeTiltEl);
          state.activeTiltEl = related.closest?.(HOVER_CONFIG.tilt.selector) || null;
        }
      } catch (err) {
        console.error('[modul:hoverFx]', err);
      }
    }, { passive: true });

    // Pada perangkat sentuh, munculkan simbol hover saat elemen CTA / kartu level disentuh (:active)
    document.addEventListener('pointerdown', (e) => {
      try {
        if (e.pointerType !== 'touch' && !state.isTouchDevice) return;
        if (!isFxAllowed()) return;
        const symTarget = e.target.closest?.(HOVER_CONFIG.symbols.selector);
        if (symTarget) spawnHoverSymbols(symTarget);
        const storeBtn = e.target.closest?.(HOVER_CONFIG.cornerCoins.selector);
        if (storeBtn) spawnCornerCoins(storeBtn);
      } catch (err) {
        console.error('[modul:hoverFx]', err);
      }
    }, { passive: true });
  } catch (e) {
    console.error('[modul:hoverFx]', e);
    HOVER_CONFIG.enabled = false;
    resetAllTransforms();
  }
}
