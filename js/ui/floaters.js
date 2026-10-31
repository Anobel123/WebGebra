// ============================================================================
//  js/ui/floaters.js — Sistem "Barang Melayang" Interaktif di Semua Bagian
//  Menyebarkan objek bertema Algebra-Mart di lajur sisi kiri (0-18%) & kanan
//  (82-100%) dengan penghindaran area konten, fisika pegas kursor, efek pecah
//  token aljabar (tanpa suara), serta parallax & inersia scroll.
// ============================================================================

import { SECTION_FLOATERS, FLOATER_SVG } from '../data/floaters.js';
import { esc, prefersReducedMotion } from '../utils/safe.js';
import { spawnClickBurst, isSparkFxEnabled } from './sparkFx.js';
import { REVEAL_TIMING } from './reveal.js';

export const FLOATER_CONFIG = {
  maxActiveTotal: 40,
  minSizePx: 28,
  maxSizePx: 90,
  leftLaneMaxRatio: 0.18,
  rightLaneMinRatio: 0.82,
  contentMarginPx: 16,
  minDistancePx: 88,
  repelRadiusPx: 110,
  repelMaxPushPx: 42,
  springStiffness: 0.12,
  springDamping: 0.78,
  shatterSparkMin: 5,
  shatterSparkMax: 8,
  respawnMinMs: 1500,
  respawnMaxMs: 2500,
  resizeDebounceMs: 200,
  lowFpsThreshold: 30,
  lowFpsDurationMs: 2000,
  depths: [
    { name: 'far', scale: 0.72, opacity: 0.68, speed: 0.65, parallax: 0.06, ampY: 6, ampRot: 3.5 },
    { name: 'mid', scale: 0.92, opacity: 0.86, speed: 1.0, parallax: 0.12, ampY: 10, ampRot: 5.0 },
    { name: 'near', scale: 1.12, opacity: 0.96, speed: 1.28, parallax: 0.19, ampY: 14, ampRot: 6.5 }
  ]
};

/** PRNG deterministik berbiji (Mulberry32) agar posisi stabil di setiap muat */
function createSeededRandom(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function getViewportMode() {
  const w = window.innerWidth || 1280;
  if (w <= 640) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

function isLowEndEnvironment() {
  try {
    if (navigator.connection && navigator.connection.saveData === true) return true;
    if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2) return true;
  } catch { /* abaikan */ }
  return false;
}

function buildFloaterInnerHtml(item) {
  if (item.kind === 'img') {
    const cls = item.bill ? 'fx-floater__img fx-floater__img--bill' : 'fx-floater__img';
    return `<img class="${cls}" src="${esc(item.src)}" alt="" width="${item.w || 54}" height="${item.h || 54}" loading="lazy" decoding="async" draggable="false" onerror="this.closest('.fx-floater').style.display='none'">`;
  }
  if (item.kind === 'svg') {
    const fn = FLOATER_SVG[item.svg] || FLOATER_SVG.coin;
    return `<span class="fx-floater__svg">${fn(item.sym || 'x')}</span>`;
  }
  if (item.kind === 'calc') {
    const mod = item.accent ? ' fx-floater__calc--accent' : '';
    return `<span class="fx-floater__calc${mod}">${esc(item.label)}</span>`;
  }
  if (item.kind === 'pill') {
    return `<span class="fx-floater__pill">${esc(item.label)}</span>`;
  }
  return `<span class="fx-floater__token">${esc(item.label || 'x')}</span>`;
}

/**
 * Mengambil daftar kotak konten (relatif terhadap section) yang tidak boleh
 * ditutupi oleh barang melayang (+ margin 16px).
 */
function collectObstacleRects(sectionEl, secRect) {
  const criticalSelectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', '.lead', '.eyebrow', '.badge-pill',
    '.btn', '.store-badge', '.qr-box', '.hero__cta', '.hero__chips',
    '.tab-btn', '.stepper-phase-btn', '.carousel-ctrl-btn', '.access-share-bar'
  ].join(', ');

  const blockSelectors = [
    'p', '.device', '.card', '.example-box', '.stat',
    '.tabs', '.steps', '.kelas-dialog', '.kelas-grid-wrap', '.cara-carousel',
    '.tips-cepat-section', '.guru-guide-box', '.buku-card', '.landscape-banner',
    '.specs-table-card', '.faq-accordion', '.logo-showcase',
    '.footer__grid > div', '.footer__bottom'
  ].join(', ');

  const margin = FLOATER_CONFIG.contentMarginPx;
  // Margin vertikal ekstra 28px untuk mengantisipasi pergeseran .reveal (translateY) & ayunan bobbing
  const vExtra = 28;
  const critical = [];
  const blocks = [];

  const critNodes = sectionEl.querySelectorAll(criticalSelectors);
  for (let i = 0; i < critNodes.length; i++) {
    const el = critNodes[i];
    if (sectionEl.id === 'akses' && el.closest('#cara-bermain-container')) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    critical.push({
      left: r.left - secRect.left - margin,
      top: r.top - secRect.top - margin - vExtra,
      right: r.right - secRect.left + margin,
      bottom: r.bottom - secRect.top + margin + vExtra
    });
  }

  const blockNodes = sectionEl.querySelectorAll(blockSelectors);
  for (let i = 0; i < blockNodes.length; i++) {
    const el = blockNodes[i];
    if (sectionEl.id === 'akses' && el.closest('#cara-bermain-container')) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    blocks.push({
      left: r.left - secRect.left - margin,
      top: r.top - secRect.top - margin,
      right: r.right - secRect.left + margin,
      bottom: r.bottom - secRect.top + margin
    });
  }

  return { critical, blocks };
}

function rectsOverlap(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

export function initFloaters() {
  try {
    // Bersihkan elemen dekoratif statis lama bila masih ada di DOM agar tidak ganda
    document.querySelectorAll('.hero__float, .deco-sticker').forEach((el) => el.remove());

    const hasFinePointer = typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let degraded = isLowEndEnvironment();
    let reducedMotion = prefersReducedMotion();

    const sectionStates = [];
    const allFloaters = [];

    // Buat lapisan .fx-floaters di setiap bagian target
    for (const def of SECTION_FLOATERS) {
      const sectionEl = document.querySelector(def.selector);
      if (!sectionEl) continue;

      const computedPos = window.getComputedStyle(sectionEl).position;
      if (computedPos === 'static') {
        sectionEl.style.position = 'relative';
      }

      let layerEl = sectionEl.querySelector(':scope > .fx-floaters');
      if (!layerEl) {
        layerEl = document.createElement('div');
        layerEl.className = 'fx-floaters';
        layerEl.setAttribute('aria-hidden', 'true');
        layerEl.dataset.section = def.sectionId;
        sectionEl.insertBefore(layerEl, sectionEl.firstChild);
      }

      sectionStates.push({
        def,
        sectionEl,
        layerEl,
        inView: def.sectionId === 'beranda',
        enteredOnce: def.sectionId === 'beranda',
        floaters: []
      });
    }

    if (!sectionStates.length) return;

    // Pecahkan barang melayang saat diklik/diketuk (TANPA suara)
    const shatterFloater = (f, clientX, clientY) => {
      if (!f || f.shattered) return;
      f.shattered = true;
      f.el.classList.add('is-shattered');

      const rect = f.el.getBoundingClientRect();
      const bx = typeof clientX === 'number' && clientX > 0 ? clientX : rect.left + rect.width / 2;
      const by = typeof clientY === 'number' && clientY > 0 ? clientY : rect.top + rect.height / 2;

      const sparkCount = FLOATER_CONFIG.shatterSparkMin +
        Math.floor(Math.random() * (FLOATER_CONFIG.shatterSparkMax - FLOATER_CONFIG.shatterSparkMin + 1));
      try {
        spawnClickBurst(bx, by, sparkCount);
      } catch { /* abaikan */ }

      const respawnDelay = FLOATER_CONFIG.respawnMinMs +
        Math.random() * (FLOATER_CONFIG.respawnMaxMs - FLOATER_CONFIG.respawnMinMs);

      clearTimeout(f.respawnTimer);
      f.respawnTimer = setTimeout(() => {
        f.shattered = false;
        f.respawning = true;
        f.respawnStart = performance.now();
        f.el.classList.remove('is-shattered');
        f.el.classList.add('is-respawning');
        setTimeout(() => {
          f.respawning = false;
          f.el.classList.remove('is-respawning');
        }, 480);
      }, respawnDelay);
    };

    // Bangun & tempatkan objek per bagian dengan Poisson-disc sederhana + hindari konten
    const layoutAllSections = () => {
      const mode = getViewportMode();
      let totalAllocated = 0;
      allFloaters.length = 0;

      // Batch DOM reads terlebih dahulu
      const measurements = sectionStates.map((st) => {
        const secRect = st.sectionEl.getBoundingClientRect();
        const obstacles = collectObstacleRects(st.sectionEl, secRect);
        return { st, secRect, obstacles };
      });

      // Kemudian lakukan kalkulasi & DOM writes
      for (const { st, secRect, obstacles } of measurements) {
        const { def, layerEl } = st;
        const rand = createSeededRandom(def.seed + (mode === 'mobile' ? 17 : mode === 'tablet' ? 9 : 0));

        let targetCount = def.counts[mode] || 5;
        if (degraded) {
          targetCount = Math.max(2, Math.ceil(targetCount * 0.5));
        }
        const remainingQuota = Math.max(0, FLOATER_CONFIG.maxActiveTotal - totalAllocated);
        targetCount = Math.min(targetCount, remainingQuota);

        const secW = Math.max(320, secRect.width || window.innerWidth || 1280);
        // Untuk #akses, batasi tinggi area penempatan di bagian atas sebelum #cara-bermain-container agar tidak menumpuk
        let secH = Math.max(260, secRect.height || 640);
        if (def.sectionId === 'akses') {
          const cbEl = document.getElementById('cara-bermain-container');
          if (cbEl) {
            const cbRect = cbEl.getBoundingClientRect();
            if (cbRect.top > secRect.top + 220) {
              secH = cbRect.top - secRect.top;
            }
          }
        }

        const placedPositions = [];
        const chosenItems = [];

        for (let idx = 0; idx < targetCount; idx++) {
          const itemDef = def.items[idx % def.items.length];
          const depthIdx = idx % FLOATER_CONFIG.depths.length;
          const depth = FLOATER_CONFIG.depths[depthIdx];
          const baseSize = Math.max(
            FLOATER_CONFIG.minSizePx,
            Math.min(FLOATER_CONFIG.maxSizePx, Math.round((itemDef.size || 48) * depth.scale * (mode === 'mobile' ? 0.78 : 1)))
          );
          const itemW = itemDef.bill ? Math.round(baseSize * 1.45) : (itemDef.kind === 'pill' ? Math.round(baseSize * 1.75) : baseSize);
          const itemH = itemDef.bill ? Math.round(baseSize * 0.74) : (itemDef.kind === 'pill' ? Math.round(baseSize * 0.65) : baseSize);

          let bestPos = null;
          const maxAttempts = 56;
          const minDist = mode === 'mobile' ? 58 : mode === 'tablet' ? 72 : FLOATER_CONFIG.minDistancePx;
          const topPad = def.sectionId === 'beranda' ? 84 : 52;
          const bottomPad = def.sectionId === 'beranda' ? 76 : 48;
          const usableH = Math.max(120, secH - topPad - bottomPad - itemH);
          const bandH = usableH / Math.max(1, targetCount);

          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Bergantian lajur kiri (0-18%) dan lajur kanan (82-100%)
            const isLeft = (idx + attempt) % 2 === 0;
            let cx;
            if (mode === 'mobile' || attempt >= 32) {
              // Dekat tepi kiri/kanan layar (boleh terpotong sebagian di tepi layar)
              cx = isLeft
                ? -itemW * 0.25 + rand() * (secW * 0.09)
                : secW - itemW * 0.75 - rand() * (secW * 0.09);
            } else {
              const laneW = secW * FLOATER_CONFIG.leftLaneMaxRatio;
              cx = isLeft
                ? 4 + rand() * Math.max(12, laneW - itemW - 6)
                : secW * FLOATER_CONFIG.rightLaneMinRatio + rand() * Math.max(12, laneW - itemW - 6);
            }

            // Percobaan awal di pita vertikal masing-masing; selanjutnya cari celah vertikal di seluruh bagian
            const cy = attempt < 16
              ? topPad + Math.min(usableH, Math.max(0, idx * bandH + (rand() * 0.88) * bandH))
              : topPad + rand() * usableH;

            const candidateBox = {
              left: cx,
              top: cy,
              right: cx + itemW,
              bottom: cy + itemH
            };

            // 1. Cek jarak minimum Poisson-disc terhadap objek lain di bagian ini
            let tooClose = false;
            const effMinDist = attempt >= 40 ? minDist * 0.65 : minDist;
            for (const p of placedPositions) {
              const dx = (cx + itemW / 2) - (p.x + p.w / 2);
              const dy = (cy + itemH / 2) - (p.y + p.h / 2);
              if (Math.hypot(dx, dy) < effMinDist) {
                tooClose = true;
                break;
              }
            }
            if (tooClose) continue;

            // 2. Wajib bebas 100% dari elemen kritis (judul, tombol, QR, lencana)
            let hitsCritical = false;
            for (const obs of obstacles.critical) {
              if (rectsOverlap(candidateBox, obs)) {
                hitsCritical = true;
                break;
              }
            }
            if (hitsCritical) continue;

            // 3. Hindari blok kartu & paragraf pada percobaan utama (0..35)
            let hitsBlock = false;
            if (attempt < 36) {
              for (const obs of obstacles.blocks) {
                if (rectsOverlap(candidateBox, obs)) {
                  hitsBlock = true;
                  break;
                }
              }
            }

            if (!hitsBlock) {
              bestPos = { x: cx, y: cy, w: itemW, h: itemH };
              break;
            }
          }

          // Jika lajur bertabrakan dengan kartu lebar (mis. di mobile/tablet), pindai tepi luar yang bebas dari elemen kritis
          if (!bestPos) {
            const isLeft = idx % 2 === 0;
            const edgeX = isLeft ? -Math.round(itemW * 0.34) : Math.round(secW - itemW * 0.66);
            for (let step = 0; step < 18; step++) {
              const ratio = ((idx / Math.max(1, targetCount)) + (step / 18)) % 1;
              const fallbackY = topPad + Math.round(ratio * usableH);
              const edgeBox = { left: edgeX, top: fallbackY, right: edgeX + itemW, bottom: fallbackY + itemH };
              let hitsEdge = false;
              for (const obs of obstacles.critical) {
                if (rectsOverlap(edgeBox, obs)) {
                  hitsEdge = true;
                  break;
                }
              }
              if (!hitsEdge) {
                bestPos = { x: edgeX, y: fallbackY, w: itemW, h: itemH };
                break;
              }
            }
          }

          if (bestPos) {
            placedPositions.push(bestPos);
            chosenItems.push({ itemDef, depth, pos: bestPos, seedPhase: rand() * Math.PI * 2, seedFreq: 0.75 + rand() * 0.55 });
          }
        }

        // Sinkronisasi elemen DOM di dalam layerEl
        layerEl.innerHTML = '';
        st.floaters = [];

        chosenItems.forEach((entry, i) => {
          const { itemDef, depth, pos, seedPhase, seedFreq } = entry;
          const el = document.createElement('div');
          el.className = `fx-floater fx-floater--${depth.name}${st.enteredOnce ? ' is-entered' : ''}`;
          el.setAttribute('aria-hidden', 'true');
          el.dataset.depth = depth.name;
          el.dataset.kind = itemDef.kind;
          el.style.width = `${pos.w}px`;
          el.style.height = `${pos.h}px`;
          el.style.left = `${Math.round(pos.x)}px`;
          el.style.top = `${Math.round(pos.y)}px`;
          const enterStagger = REVEAL_TIMING.floater.delayMs + Math.min(i * REVEAL_TIMING.floater.staggerMs, REVEAL_TIMING.staggerMaxMs);
          const outStagger = Math.min((chosenItems.length - 1 - i) * Math.round(REVEAL_TIMING.floater.staggerMs * REVEAL_TIMING.out.staggerFactor), Math.round(REVEAL_TIMING.staggerMaxMs * REVEAL_TIMING.out.staggerFactor));
          el.style.setProperty('--fl-stagger', `${enterStagger}ms`);
          el.style.setProperty('--fl-out-stagger', `${outStagger}ms`);
          el.style.setProperty('--fl-opacity', String(depth.opacity));
          el.innerHTML = `<div class="fx-floater__inner">${buildFloaterInnerHtml(itemDef)}</div>`;

          const floaterObj = {
            el,
            sectionState: st,
            anchorX: pos.x,
            anchorY: pos.y,
            w: pos.w,
            h: pos.h,
            depth,
            phase: seedPhase,
            freq: seedFreq,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
            shattered: false,
            respawning: false,
            respawnTimer: 0
          };

          el.addEventListener('pointerdown', (ev) => {
            ev.stopPropagation();
            shatterFloater(floaterObj, ev.clientX, ev.clientY);
          });
          el.addEventListener('click', (ev) => {
            ev.stopPropagation();
            shatterFloater(floaterObj, ev.clientX, ev.clientY);
          });

          layerEl.appendChild(el);
          st.floaters.push(floaterObj);
          allFloaters.push(floaterObj);
          totalAllocated++;
        });
      }
    };

    layoutAllSections();

    // Delegasi klik cadangan apabila area margin container berada di atas z-index lapisan floater
    document.addEventListener('pointerdown', (e) => {
      if (!isSparkFxEnabled()) return;
      const t = e.target;
      if (!t || typeof t.closest !== 'function') return;
      if (t.closest('a, button, input, select, textarea, summary, label, [role="button"], .card, .device, .cara-carousel, .guru-guide-box, .kelas-dialog, .kelas-card')) {
        return;
      }
      const cx = e.clientX;
      const cy = e.clientY;
      for (const st of sectionStates) {
        if (!st.inView) continue;
        for (const f of st.floaters) {
          if (f.shattered) continue;
          const r = f.el.getBoundingClientRect();
          if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
            shatterFloater(f, cx, cy);
            return;
          }
        }
      }
    }, { passive: true });

    // IntersectionObserver per bagian: aktifkan animasi masuk/mundur & jalankan hanya saat di viewport
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        const vh = window.innerHeight || 800;
        for (const entry of entries) {
          const st = sectionStates.find((s) => s.sectionEl === entry.target);
          if (!st) continue;
          st.inView = entry.isIntersecting;
          if (entry.isIntersecting) {
            st.enteredOnce = true;
            st.floaters.forEach((f) => f.el.classList.add('is-entered'));
          } else {
            // Keluar melalui bawah layar (top > vh * 0.85): kembalikan floater ke keadaan awal (mundur)
            if (entry.boundingClientRect.top >= vh * 0.85) {
              st.enteredOnce = false;
              st.floaters.forEach((f) => f.el.classList.remove('is-entered'));
            }
          }
        }
        ensureRafRunning();
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

      sectionStates.forEach((st) => io.observe(st.sectionEl));
    } else {
      sectionStates.forEach((st) => {
        st.inView = true;
        st.enteredOnce = true;
        st.floaters.forEach((f) => f.el.classList.add('is-entered'));
      });
    }

    // Lacak posisi kursor (hanya pointer: fine) & kecepatan scroll
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;

    if (hasFinePointer) {
      window.addEventListener('pointermove', (e) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        pointerActive = true;
      }, { passive: true });
      window.addEventListener('pointerleave', () => {
        pointerActive = false;
      }, { passive: true });
    }

    let lastScrollY = window.scrollY || 0;
    let scrollVelocity = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY || 0;
      const dy = y - lastScrollY;
      lastScrollY = y;
      scrollVelocity = Math.max(-45, Math.min(45, dy * 0.45));
      ensureRafRunning();
    }, { passive: true });

    // Hitung ulang saat resize (debounce 200 ms) dan saat slot/gambar selesai dimuat
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        layoutAllSections();
      }, FLOATER_CONFIG.resizeDebounceMs);
    }, { passive: true });

    window.addEventListener('load', () => {
      setTimeout(() => layoutAllSections(), 150);
    }, { once: true });

    // Pantau perubahan toggle efek (#fx-toggle)
    window.addEventListener('algebramart:fx-toggle', (e) => {
      const enabled = e.detail?.enabled ?? isSparkFxEnabled();
      document.body.classList.toggle('is-floaters-off', !enabled);
      if (enabled) ensureRafRunning();
    });

    // Satu loop requestAnimationFrame terpusat dengan pemantau FPS
    let rafId = 0;
    let lowFpsAccumMs = 0;
    let lastFrameTime = performance.now();

    const tick = (now) => {
      rafId = 0;
      if (document.hidden || reducedMotion || !isSparkFxEnabled()) return;

      const dt = Math.min(64, Math.max(1, now - lastFrameTime));
      lastFrameTime = now;

      // Deteksi FPS rendah (< 30 fps selama > 2 detik)
      if (!degraded && dt > (1000 / FLOATER_CONFIG.lowFpsThreshold)) {
        lowFpsAccumMs += dt;
        if (lowFpsAccumMs >= FLOATER_CONFIG.lowFpsDurationMs) {
          degraded = true;
          layoutAllSections();
        }
      } else {
        lowFpsAccumMs = Math.max(0, lowFpsAccumMs - dt * 0.5);
      }

      // Peluruhan kecepatan scroll (inersia kembali tenang)
      scrollVelocity *= 0.88;
      if (Math.abs(scrollVelocity) < 0.05) scrollVelocity = 0;

      const anyVisible = sectionStates.some((s) => s.inView);
      if (!anyVisible) return;

      const tSec = now * 0.001;
      const scrollY = window.scrollY || 0;

      // Batch DOM reads untuk bagian yang sedang di viewport
      const activeSectionRects = new Map();
      if (pointerActive && hasFinePointer && !degraded) {
        for (const st of sectionStates) {
          if (st.inView) {
            activeSectionRects.set(st, st.sectionEl.getBoundingClientRect());
          }
        }
      }

      // Batch kalkulasi fisika & DOM writes (hanya transform)
      for (const st of sectionStates) {
        if (!st.inView) continue;
        const secRect = activeSectionRects.get(st);

        for (const f of st.floaters) {
          if (f.shattered) continue;

          // 1. Gerak mengapung sinusoidal lembut
          const bobY = Math.sin(tSec * f.freq * f.depth.speed + f.phase) * f.depth.ampY;
          const bobX = Math.cos(tSec * f.freq * 0.7 * f.depth.speed + f.phase) * (f.depth.ampY * 0.45);
          const bobRot = Math.sin(tSec * f.freq * 0.85 + f.phase) * f.depth.ampRot;

          // 2. Dorongan menghindar dari kursor (radius ±110 px) + pegas kembali
          let targetOx = 0;
          let targetOy = 0;
          if (secRect && pointerActive && !degraded) {
            const fx = secRect.left + f.anchorX + f.w * 0.5 + f.ox;
            const fy = secRect.top + f.anchorY + f.h * 0.5 + f.oy;
            const dx = fx - pointerX;
            const dy = fy - pointerY;
            const dist = Math.hypot(dx, dy);
            if (dist > 0.1 && dist < FLOATER_CONFIG.repelRadiusPx) {
              const force = (1 - dist / FLOATER_CONFIG.repelRadiusPx) * FLOATER_CONFIG.repelMaxPushPx;
              targetOx = (dx / dist) * force;
              targetOy = (dy / dist) * force;
            }
          }

          f.vx = (f.vx + (targetOx - f.ox) * FLOATER_CONFIG.springStiffness) * FLOATER_CONFIG.springDamping;
          f.vy = (f.vy + (targetOy - f.oy) * FLOATER_CONFIG.springStiffness) * FLOATER_CONFIG.springDamping;
          f.ox += f.vx;
          f.oy += f.vy;

          // 3. Parallax scroll per kedalaman & kemiringan inersia scroll
          const parallaxY = -((scrollY * f.depth.parallax) % 42);
          const inertiaTilt = scrollVelocity * (f.depth.name === 'near' ? 0.45 : f.depth.name === 'mid' ? 0.3 : 0.18);

          const tx = (bobX + f.ox).toFixed(1);
          const ty = (bobY + f.oy + parallaxY).toFixed(1);
          const rot = (bobRot + inertiaTilt).toFixed(1);

          f.el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    function ensureRafRunning() {
      if (!rafId && !document.hidden && !reducedMotion && isSparkFxEnabled()) {
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        ensureRafRunning();
      }
    });

    ensureRafRunning();

    // API inspeksi untuk pengujian otomatis
    window.__floatersApi = {
      relayout: layoutAllSections,
      getSectionCount: () => sectionStates.length,
      getTotalFloaters: () => allFloaters.length,
      shatterFirstInSection: (sectionId) => {
        const st = sectionStates.find((s) => s.def.sectionId === sectionId);
        const f = st?.floaters?.[0];
        if (f) shatterFloater(f);
        return Boolean(f);
      }
    };
  } catch (e) {
    console.error('[modul:floaters]', e);
  }
}
