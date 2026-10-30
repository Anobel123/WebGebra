// ============================================================================
//  ui/sparkFx.js — Sistem Efek Interaktif Algebra-Mart
//  Bagian 1: Percikan angka/token aljabar saat klik/sentuh (clickSpark)
//  Bagian 2: Trail panjang & anggun saat kursor/sentuh bergerak & scroll (cursorTrail)
// ============================================================================

import { prefersReducedMotion } from '../utils/safe.js';

export const SPARK_CONFIG = {
  enabled: true,
  storageKey: 'algebraMart_sparkFx',
  tokens: ['3x', '7d', '12', '5y', '2a', 'x', 'y', 'd', '+', '−', '=', 'Rp'],
  colors: ['#fbbf24', '#f59e0b', '#d97706', '#78350f'],
  click: {
    countMin: 5,
    countMax: 8,
    distMin: 30,
    distMax: 80,
    rotMax: 25,
    durMin: 700,
    durMax: 900,
    gravityLift: -18,
    gravityDrop: 26,
    maxActive: 40
  },
  trail: {
    minDistMin: 14,
    minDistMax: 18,
    driftMin: 10,
    driftMax: 30,
    durMin: 1200,
    durMax: 1800,
    fontMin: 12,
    fontMax: 20,
    rotMax: 20,
    tokenDelayMs: 55,
    maxActive: 60,
    minSpawnIntervalMs: 16
  },
  device: {
    mobileMaxWidth: 480,
    mobileScaleFactor: 0.5,
    minHardwareConcurrency: 2,
    minFps: 30,
    lowFpsStreakLimit: 18
  }
};

// State internal bersama
const state = {
  container: null,
  activeClick: [],
  activeTrail: [],
  freePool: [],
  maxPoolSize: 110,
  userEnabled: true,
  gateOpen: true,
  trailDegraded: false,
  lastSpawnAt: 0,
  lastX: null,
  lastY: null,
  lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
  pendingMove: null,
  pendingScrollDy: 0,
  rafId: 0,
  fpsFrames: 0,
  fpsLastCheck: 0,
  lowFpsStreak: 0,
  initialized: false
};

const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth <= SPARK_CONFIG.device.mobileMaxWidth;
const isLowEndHardware = () => {
  try {
    const hc = navigator?.hardwareConcurrency;
    return typeof hc === 'number' && hc > 0 && hc <= SPARK_CONFIG.device.minHardwareConcurrency;
  } catch {
    return false;
  }
};

function ensureContainer() {
  if (state.container && document.body.contains(state.container)) return state.container;
  let el = document.getElementById('spark-fx-layer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'spark-fx-layer';
    el.className = 'spark-fx-layer';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
  }
  state.container = el;
  return el;
}

/** Ambil elemen dari object pool atau buat baru jika kosong */
function acquireNode(className) {
  const el = state.freePool.pop() || document.createElement('span');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  return el;
}

/** Kembalikan elemen ke object pool & lepaskan dari DOM agar 0 sisa elemen saat idle */
function releaseNode(entry) {
  if (!entry || entry.released) return;
  entry.released = true;
  clearTimeout(entry.timerId);
  try {
    if (entry.anim) entry.anim.cancel();
  } catch { /* abaikan */ }
  try {
    entry.el.remove();
    entry.el.removeAttribute('style');
    entry.el.textContent = '';
    if (state.freePool.length < state.maxPoolSize) {
      state.freePool.push(entry.el);
    }
  } catch { /* abaikan */ }
}

function removeFromList(list, entry) {
  const idx = list.indexOf(entry);
  if (idx !== -1) list.splice(idx, 1);
  releaseNode(entry);
}

function enforceCap(list, maxAllowed) {
  while (list.length >= maxAllowed) {
    const oldest = list.shift();
    releaseNode(oldest);
  }
}

export function clearAllSparks() {
  try {
    while (state.activeClick.length) releaseNode(state.activeClick.pop());
    while (state.activeTrail.length) releaseNode(state.activeTrail.pop());
    if (state.container) state.container.innerHTML = '';
  } catch (e) {
    console.error('[modul:sparkFx]', e);
  }
}

/** Pantau FPS saat ada aktivitas agar otomatis menonaktifkan trail jika drop < 30 FPS beruntun */
function recordFrameTimestamp(now) {
  if (!state.fpsLastCheck) {
    state.fpsLastCheck = now;
    state.fpsFrames = 0;
    return;
  }
  state.fpsFrames++;
  const elapsed = now - state.fpsLastCheck;
  if (elapsed >= 250) {
    const fps = (state.fpsFrames * 1000) / elapsed;
    if (fps < SPARK_CONFIG.device.minFps) {
      state.lowFpsStreak++;
      if (state.lowFpsStreak >= SPARK_CONFIG.device.lowFpsStreakLimit) {
        state.trailDegraded = true;
      }
    } else {
      state.lowFpsStreak = Math.max(0, state.lowFpsStreak - 1);
    }
    state.fpsFrames = 0;
    state.fpsLastCheck = now;
  }
}

// ============================================================================
//  BAGIAN 1: PERCIKAN SAAT KLIK / SENTUH
// ============================================================================
export function spawnClickBurst(x, y, customCount = null) {
  try {
    if (!SPARK_CONFIG.enabled || !state.userEnabled || !state.gateOpen) return;
    if (typeof x !== 'number' || typeof y !== 'number' || Number.isNaN(x) || Number.isNaN(y)) return;

    const container = ensureContainer();
    const mobile = isMobileViewport();
    const scaleFactor = mobile ? SPARK_CONFIG.device.mobileScaleFactor : 1;
    const maxClick = Math.max(8, Math.round(SPARK_CONFIG.click.maxActive * scaleFactor));

    // Jika prefers-reduced-motion aktif: tampilkan 1 token diam yang memudar lembut (kecuali customCount kecil dari bar)
    if (prefersReducedMotion()) {
      if (customCount !== null) return;
      enforceCap(state.activeClick, maxClick);
      const el = acquireNode('fx-token fx-token--static');
      el.textContent = pick(SPARK_CONFIG.tokens);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      container.appendChild(el);
      const entry = { el, anim: null, timerId: 0, released: false };
      state.activeClick.push(entry);
      entry.timerId = setTimeout(() => removeFromList(state.activeClick, entry), 500);
      return;
    }

    const rawCount = customCount !== null ? customCount : randInt(SPARK_CONFIG.click.countMin, SPARK_CONFIG.click.countMax);
    const count = customCount !== null ? customCount : Math.max(3, Math.round(rawCount * scaleFactor));

    for (let i = 0; i < count; i++) {
      enforceCap(state.activeClick, maxClick);
      const el = acquireNode('fx-token fx-token--click');
      el.textContent = pick(SPARK_CONFIG.tokens);

      // Sebar 360 derajat merata + variasi acak
      const angle = (Math.PI * 2 * i) / count + rand(-0.35, 0.35);
      const dist = rand(SPARK_CONFIG.click.distMin, SPARK_CONFIG.click.distMax);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const midX = dx * 0.55;
      const midY = dy * 0.55 + SPARK_CONFIG.click.gravityLift;
      const endX = dx;
      const endY = dy + SPARK_CONFIG.click.gravityDrop;
      const rot = rand(-SPARK_CONFIG.click.rotMax, SPARK_CONFIG.click.rotMax);
      const dur = Math.round(rand(SPARK_CONFIG.click.durMin, SPARK_CONFIG.click.durMax));
      const fSize = Math.round(rand(15, 21));

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${fSize}px`;
      container.appendChild(el);

      const entry = { el, anim: null, timerId: 0, released: false };
      state.activeClick.push(entry);

      if (typeof el.animate === 'function') {
        entry.anim = el.animate([
          {
            transform: 'translate(-50%, -50%) translate3d(0px, 0px, 0) scale(0.6) rotate(0deg)',
            opacity: 1,
            color: SPARK_CONFIG.colors[0],
            offset: 0
          },
          {
            transform: `translate(-50%, -50%) translate3d(${midX.toFixed(1)}px, ${midY.toFixed(1)}px, 0) scale(1.15) rotate(${(rot * 0.6).toFixed(1)}deg)`,
            opacity: 0.96,
            color: SPARK_CONFIG.colors[1],
            offset: 0.36
          },
          {
            transform: `translate(-50%, -50%) translate3d(${endX.toFixed(1)}px, ${endY.toFixed(1)}px, 0) scale(0.82) rotate(${rot.toFixed(1)}deg)`,
            opacity: 0,
            color: SPARK_CONFIG.colors[3],
            offset: 1
          }
        ], {
          duration: dur,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        });
        entry.anim.onfinish = () => removeFromList(state.activeClick, entry);
      }
      entry.timerId = setTimeout(() => removeFromList(state.activeClick, entry), dur + 60);
    }
  } catch (e) {
    console.error('[modul:clickSpark]', e);
  }
}

// ============================================================================
//  BAGIAN 2: TRAIL PANJANG DAN ANGGUN (DUA LAPISAN: SPARK DOT + TOKEN ALJABAR)
// ============================================================================
function spawnTrailNode(x, y, driftX, driftY, isDot = false, delayMs = 0) {
  try {
    if (!SPARK_CONFIG.enabled || !state.userEnabled || !state.gateOpen || state.trailDegraded || prefersReducedMotion()) return;
    const container = ensureContainer();
    const mobile = isMobileViewport();
    const scaleFactor = mobile ? SPARK_CONFIG.device.mobileScaleFactor : 1;
    const maxTrail = Math.max(15, Math.round(SPARK_CONFIG.trail.maxActive * scaleFactor));

    enforceCap(state.activeTrail, maxTrail);

    const el = acquireNode(isDot ? 'fx-spark-dot' : 'fx-token fx-token--trail');
    if (!isDot) {
      el.textContent = pick(SPARK_CONFIG.tokens);
      el.style.fontSize = `${Math.round(rand(SPARK_CONFIG.trail.fontMin, SPARK_CONFIG.trail.fontMax))}px`;
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    container.appendChild(el);

    const dur = Math.round(rand(SPARK_CONFIG.trail.durMin, SPARK_CONFIG.trail.durMax));
    const rot0 = rand(-SPARK_CONFIG.trail.rotMax, SPARK_CONFIG.trail.rotMax);
    const rot1 = rot0 + rand(-12, 12);

    const entry = { el, anim: null, timerId: 0, released: false };
    state.activeTrail.push(entry);

    const keyframes = isDot
      ? [
          {
            transform: 'translate(-50%, -50%) translate3d(0px, 0px, 0) scale(1.15)',
            opacity: 0.95,
            backgroundColor: SPARK_CONFIG.colors[0],
            offset: 0
          },
          {
            transform: `translate(-50%, -50%) translate3d(${(driftX * 0.45).toFixed(1)}px, ${(driftY * 0.45).toFixed(1)}px, 0) scale(0.8)`,
            opacity: 0.65,
            backgroundColor: SPARK_CONFIG.colors[1],
            offset: 0.45
          },
          {
            transform: `translate(-50%, -50%) translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0) scale(0.25)`,
            opacity: 0,
            backgroundColor: SPARK_CONFIG.colors[3],
            offset: 1
          }
        ]
      : [
          {
            transform: `translate(-50%, -50%) translate3d(0px, 0px, 0) scale(1.08) rotate(${rot0.toFixed(1)}deg)`,
            opacity: 0.92,
            color: SPARK_CONFIG.colors[0],
            filter: 'blur(0px)',
            offset: 0
          },
          {
            transform: `translate(-50%, -50%) translate3d(${(driftX * 0.4).toFixed(1)}px, ${(driftY * 0.4).toFixed(1)}px, 0) scale(0.92) rotate(${((rot0 + rot1) * 0.5).toFixed(1)}deg)`,
            opacity: 0.72,
            color: SPARK_CONFIG.colors[1],
            filter: 'blur(0.2px)',
            offset: 0.38
          },
          {
            transform: `translate(-50%, -50%) translate3d(${(driftX * 0.75).toFixed(1)}px, ${(driftY * 0.75).toFixed(1)}px, 0) scale(0.72) rotate(${rot1.toFixed(1)}deg)`,
            opacity: 0.38,
            color: SPARK_CONFIG.colors[2],
            filter: 'blur(0.6px)',
            offset: 0.72
          },
          {
            transform: `translate(-50%, -50%) translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0) scale(0.48) rotate(${rot1.toFixed(1)}deg)`,
            opacity: 0,
            color: SPARK_CONFIG.colors[3],
            filter: 'blur(1px)',
            offset: 1
          }
        ];

    if (typeof el.animate === 'function') {
      entry.anim = el.animate(keyframes, {
        duration: dur,
        delay: delayMs,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both'
      });
      entry.anim.onfinish = () => removeFromList(state.activeTrail, entry);
    }
    entry.timerId = setTimeout(() => removeFromList(state.activeTrail, entry), dur + delayMs + 80);
  } catch (e) {
    console.error('[modul:cursorTrail]', e);
  }
}

/** Munculkan pasangan berlapis (titik cahaya emas + token aljabar sedikit di belakang) */
export function spawnTrailPoint(x, y, vx = 0, vy = 0) {
  const driftMag = rand(SPARK_CONFIG.trail.driftMin, SPARK_CONFIG.trail.driftMax);
  const angle = Math.atan2(vy || rand(-1, 1), vx || rand(-1, 1)) + Math.PI + rand(-0.6, 0.6);
  const driftX = Math.cos(angle) * driftMag * 0.65 + rand(-8, 8);
  const driftY = Math.sin(angle) * driftMag * 0.65 - rand(6, 16);

  // Lapis 1: Titik cahaya emas tepat di titik jalur
  spawnTrailNode(x, y, driftX * 0.7, driftY * 0.7, true, 0);

  // Lapis 2: Token aljabar mengikuti sedikit di belakang dengan jeda
  const lagX = x - Math.max(-14, Math.min(14, vx * 0.25)) + rand(-4, 4);
  const lagY = y - Math.max(-14, Math.min(14, vy * 0.25)) + rand(-4, 4);
  spawnTrailNode(lagX, lagY, driftX, driftY, false, SPARK_CONFIG.trail.tokenDelayMs);
}

function processFrame(now) {
  state.rafId = 0;
  try {
    if (!SPARK_CONFIG.enabled || !state.userEnabled || state.trailDegraded || prefersReducedMotion()) {
      state.pendingMove = null;
      state.pendingScrollDy = 0;
      return;
    }

    recordFrameTimestamp(now);
    const mobile = isMobileViewport();

    // 1. Proses gerakan kursor / jari berdasarkan jarak tempuh (14-18px)
    if (state.pendingMove) {
      const { x, y } = state.pendingMove;
      state.pendingMove = null;

      if (state.lastX === null || state.lastY === null) {
        state.lastX = x;
        state.lastY = y;
      } else {
        const dx = x - state.lastX;
        const dy = y - state.lastY;
        const dist = Math.hypot(dx, dy);
        const minStep = rand(SPARK_CONFIG.trail.minDistMin, SPARK_CONFIG.trail.minDistMax) * (mobile ? 1.35 : 1);

        if (dist >= minStep && now - state.lastSpawnAt >= SPARK_CONFIG.trail.minSpawnIntervalMs) {
          // Interpolasi titik di sepanjang jalur jika gerakan sangat cepat (dibatasi maks 3 segmen/frame)
          const steps = Math.min(mobile ? 2 : 3, Math.max(1, Math.floor(dist / minStep)));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const px = state.lastX + dx * t;
            const py = state.lastY + dy * t;
            spawnTrailPoint(px, py, dx / steps, dy / steps);
          }
          state.lastX = x;
          state.lastY = y;
          state.lastSpawnAt = now;
        }
      }
    }

    // 2. Proses scroll: munculkan di tepi kiri-kanan viewport & dekat posisi kursor/sentuh terakhir
    if (Math.abs(state.pendingScrollDy) >= 4 && now - state.lastSpawnAt >= SPARK_CONFIG.trail.minSpawnIntervalMs) {
      const dy = state.pendingScrollDy;
      state.pendingScrollDy = 0;
      state.lastSpawnAt = now;

      // Scroll ke bawah (dy > 0) -> token melayang naik (driftY negatif)
      // Scroll ke atas (dy < 0) -> token melayang turun (driftY positif)
      const dirSign = dy > 0 ? -1 : 1;
      const speedRatio = Math.min(3, Math.max(1, Math.abs(dy) / 42));
      const count = mobile ? 1 : Math.min(3, Math.round(speedRatio));
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      for (let i = 0; i < count; i++) {
        const driftY = dirSign * rand(14, 28) * (0.8 + speedRatio * 0.2);
        const driftX = rand(-10, 10);
        // Tepi kiri atau kanan viewport
        const isLeft = (i % 2 === 0);
        const edgeX = isLeft ? rand(18, 44) : vw - rand(18, 44);
        const edgeY = rand(vh * 0.18, vh * 0.84);
        spawnTrailNode(edgeX, edgeY, driftX, driftY, true, 0);
        spawnTrailNode(edgeX + (isLeft ? 6 : -6), edgeY - dirSign * 6, driftX, driftY, false, SPARK_CONFIG.trail.tokenDelayMs);
      }

      // Di dekat posisi kursor / sentuhan terakhir
      const cx = state.lastX ?? vw * 0.5;
      const cy = state.lastY ?? vh * 0.5;
      const driftYCursor = dirSign * rand(14, 26);
      spawnTrailNode(cx + rand(-16, 16), cy + rand(-12, 12), rand(-8, 8), driftYCursor, true, 0);
      spawnTrailNode(cx + rand(-20, 20), cy + rand(-16, 16), rand(-10, 10), driftYCursor, false, SPARK_CONFIG.trail.tokenDelayMs);
    }
  } catch (e) {
    console.error('[modul:sparkFx]', e);
  }
}

function scheduleFrame() {
  if (!state.rafId) {
    state.rafId = requestAnimationFrame(processFrame);
  }
}

function loadSavedPreference() {
  try {
    const saved = localStorage.getItem(SPARK_CONFIG.storageKey);
    if (saved === '0') return false;
    if (saved === '1') return true;
  } catch { /* abaikan */ }
  return true;
}

function savePreference(val) {
  try {
    localStorage.setItem(SPARK_CONFIG.storageKey, val ? '1' : '0');
  } catch { /* abaikan */ }
}

function syncToggleButton() {
  const btn = document.getElementById('fx-toggle');
  if (!btn) return;
  const active = SPARK_CONFIG.enabled && state.userEnabled;
  btn.setAttribute('aria-pressed', String(active));
  btn.setAttribute('aria-label', active ? 'Matikan efek interaktif aljabar' : 'Nyalakan efek interaktif aljabar');
  btn.title = active ? 'Efek Aljabar: Aktif (Klik untuk matikan)' : 'Efek Aljabar: Nonaktif (Klik untuk nyalakan)';
  btn.querySelector('.fx-off-slash')?.toggleAttribute('hidden', active);
}

export function setSparkFxEnabled(on) {
  state.userEnabled = Boolean(on);
  savePreference(state.userEnabled);
  if (!state.userEnabled) clearAllSparks();
  syncToggleButton();
}

export function setSparkGate(open) {
  state.gateOpen = Boolean(open);
  if (!state.gateOpen) clearAllSparks();
}

export function initClickSpark() {
  try {
    ensureContainer();
    document.addEventListener('pointerdown', (e) => {
      try {
        if (!SPARK_CONFIG.enabled || !state.userEnabled) return;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        spawnClickBurst(e.clientX, e.clientY);
      } catch (err) {
        console.error('[modul:clickSpark]', err);
      }
    }, { passive: true });
  } catch (e) {
    console.error('[modul:clickSpark]', e);
  }
}

export function initCursorTrail() {
  try {
    ensureContainer();
    if (isLowEndHardware()) {
      state.trailDegraded = true;
    }

    document.addEventListener('pointermove', (e) => {
      try {
        if (!SPARK_CONFIG.enabled || !state.userEnabled || state.trailDegraded) return;
        state.pendingMove = { x: e.clientX, y: e.clientY };
        scheduleFrame();
      } catch (err) {
        console.error('[modul:cursorTrail]', err);
      }
    }, { passive: true });

    // Dukungan tambahan touchmove pasif untuk perangkat mobile saat jari menyapu layar
    document.addEventListener('touchmove', (e) => {
      try {
        if (!SPARK_CONFIG.enabled || !state.userEnabled || state.trailDegraded) return;
        const t = e.touches?.[0];
        if (!t) return;
        state.pendingMove = { x: t.clientX, y: t.clientY };
        scheduleFrame();
      } catch (err) {
        console.error('[modul:cursorTrail]', err);
      }
    }, { passive: true });

    window.addEventListener('scroll', () => {
      try {
        const y = window.scrollY;
        const dy = y - state.lastScrollY;
        state.lastScrollY = y;
        if (!SPARK_CONFIG.enabled || !state.userEnabled || state.trailDegraded) return;
        state.pendingScrollDy += dy;
        scheduleFrame();
      } catch (err) {
        console.error('[modul:cursorTrail]', err);
      }
    }, { passive: true });
  } catch (e) {
    console.error('[modul:cursorTrail]', e);
  }
}

export function initSparkFx() {
  try {
    if (state.initialized) return;
    state.initialized = true;
    state.userEnabled = loadSavedPreference();
    ensureContainer();

    const btn = document.getElementById('fx-toggle');
    syncToggleButton();
    btn?.addEventListener('click', () => {
      setSparkFxEnabled(!state.userEnabled);
    });

    initClickSpark();
    initCursorTrail();
  } catch (e) {
    console.error('[modul:sparkFx]', e);
    SPARK_CONFIG.enabled = false;
    clearAllSparks();
  }
}

