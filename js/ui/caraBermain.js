// js/ui/caraBermain.js — Modul Carousel Otomatis Per Tahap Panduan Bermain & Panduan Guru
import { CARA_BERMAIN_PHASES, CARA_BERMAIN, TIPS_BERMAIN, GURU_GUIDE } from '../content.js';
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { esc } from '../utils/safe.js';
import { renderIcon } from './icons.js';
import { renderSlot, resolveSlots } from '../slots.js';

export const CARA_BERMAIN_CONFIG = {
  autoplayIntervalMs: 6500,
  guruAutoplayIntervalMs: 7000
};

export function initCaraBermain() {
  const container = document.getElementById('cara-bermain-container');
  if (!container) return;

  const playStoreLink = SITE_CONFIG.links.playStore || '';
  const isPlayStoreValid = isValidUrl(playStoreLink);
  const demoRoom = (SITE_CONFIG.demoRoomCode || '').trim();
  const showPin = SITE_CONFIG.fasilitatorPin?.tampilkan === true;
  const pinValue = SITE_CONFIG.fasilitatorPin?.nilai || '1234';

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Render Struktur Utama
  container.innerHTML = `
    <div class="stepper-section reveal" data-fx="tilt">
      <div class="section-head text-center">
        <span class="badge-pill">
          <img class="badge-pill__logo" src="assets/logo/logo-algebra-mart.png" alt="Logo Algebra-Mart" width="20" height="20" decoding="async" onerror="this.hidden=true">
          Panduan Alur Permainan
        </span>
        <h3 class="stepper-title">Cara Bermain, Langkah demi Langkah</h3>
        <p class="stepper-subtitle">Ikuti urutan ini untuk mencoba Algebra-Mart dari nol sampai level pertama selesai.</p>
      </div>

      <!-- Fase Selector / Segmen Tahap A - D -->
      <nav class="stepper-phases" aria-label="Pilih Tahapan Panduan">
        ${CARA_BERMAIN_PHASES.map((ph, idx) => `
          <button type="button" class="stepper-phase-btn ${idx === 0 ? 'is-active' : ''}" data-phase="${esc(ph.id)}" data-start="${ph.range[0]}">
            <span class="stepper-phase-title">${esc(ph.title)}</span>
            <small class="stepper-phase-desc">${esc(ph.desc)}</small>
          </button>
        `).join('')}
      </nav>

      <!-- Carousel Container: Panel Gambar Besar & Daftar Langkah -->
      <div class="cara-carousel" id="cara-carousel" tabindex="0" role="region" aria-label="Panduan Cara Bermain">
        <!-- Kolom Kiri: Panel Gambar Slot & Teks Langkah Aktif -->
        <div class="cara-carousel__stage">
          <div class="cara-carousel__view" id="cara-stage-view" aria-live="off">
            <!-- Diisi dinamis via renderCurrentStep() -->
          </div>

          <!-- Bar Progres Waktu Autoplay -->
          <div class="cara-carousel__progress-wrap" aria-hidden="true">
            <div class="cara-carousel__progress-bar" id="cara-progress-bar"></div>
          </div>

          <!-- Tombol Kontrol Navigasi & Putar/Jeda -->
          <div class="cara-carousel__controls">
            <button type="button" class="carousel-ctrl-btn" id="cara-btn-prev" aria-label="Langkah sebelumnya">
              ${renderIcon('arrow-left', { size: 18 })}
              <span>Sebelumnya</span>
            </button>

            <button type="button" class="carousel-ctrl-btn carousel-ctrl-btn--play" id="cara-btn-play" aria-label="${prefersReduced ? 'Putar otomatis' : 'Jeda otomatis'}" aria-pressed="${!prefersReduced}">
              <span id="cara-play-icon">${renderIcon(prefersReduced ? 'play' : 'pause', { size: 16 })}</span>
              <span id="cara-play-text">${prefersReduced ? 'Putar' : 'Jeda'}</span>
            </button>

            <span class="cara-carousel__counter" id="cara-counter">1 / ${CARA_BERMAIN.length}</span>

            <button type="button" class="carousel-ctrl-btn" id="cara-btn-next" aria-label="Langkah berikutnya">
              <span>Berikutnya</span>
              ${renderIcon('arrow-right', { size: 18 })}
            </button>
          </div>
        </div>

        <!-- Kolom Kanan: Daftar 6 Langkah Berurutan dengan Garis Emas Progres Scroll -->
        <div class="cara-carousel__sidebar">
          <div class="stepper-draw-wrap" data-reveal="draw">
            <svg class="stepper-draw-svg" viewBox="0 0 8 600" preserveAspectRatio="none" aria-hidden="true">
              <line class="draw-line-bg" x1="4" y1="0" x2="4" y2="600" stroke="#fde68a" stroke-width="4" stroke-dasharray="8 8"/>
              <line class="draw-line-fill" x1="4" y1="0" x2="4" y2="600" pathLength="100" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>
            </svg>
            <ol class="stepper-list" id="stepper-list" role="list">
              ${CARA_BERMAIN.map((item, idx) => `
                <li class="stepper-item ${idx === 0 ? 'is-active' : ''}" data-step="${idx}" tabindex="0" role="button" aria-current="${idx === 0 ? 'step' : 'false'}">
                  <div class="stepper-coin ${idx === 0 ? 'is-lit' : ''}" aria-hidden="true">${item.step}</div>
                  <div class="stepper-summary">
                    <span class="stepper-step-badge">${esc(item.badge)}</span>
                    <h4 class="stepper-step-title">${esc(item.title)}</h4>
                  </div>
                </li>
              `).join('')}
            </ol>
          </div>
        </div>
      </div>

      <!-- Ban Berjalan Horizontal (Conveyor Belt) dengan 6 Penanda Langkah Koin -->
      <div class="conveyor-belt-track" id="conveyor-belt" role="tablist" aria-label="Penanda Langkah Permainan">
        ${CARA_BERMAIN.map((item, idx) => `
          <button type="button" class="conveyor-step-coin ${idx === 0 ? 'is-active' : ''}" data-step="${idx}" role="tab" aria-selected="${idx === 0}" aria-label="Langkah ${item.step}: ${esc(item.title)}">
            ${item.step}
          </button>
        `).join('')}
      </div>

      <!-- Kode Ruang Demo Juri (Bila diatur di SITE_CONFIG) -->
      ${demoRoom ? `
        <div class="demo-room-box">
          <div class="demo-room-badge">${renderIcon('chalkboard-user', { size: 16 })} Kode Ruang Uji Coba Guru / Juri</div>
          <p class="demo-room-text">Gunakan kode ruang berikut untuk langsung bergabung ke sesi simulasi Mode Kelas:</p>
          <div class="demo-room-code-tag">
            <span class="code-val">${esc(demoRoom)}</span>
            <button class="btn btn--small btn--secondary" type="button" data-copy="${esc(demoRoom)}">Salin Kode</button>
          </div>
        </div>
      ` : ''}

      <!-- Memo Catatan Kasir: Teks Bernomor Lega (Bebas Kotak Ikon AI-Slop) -->
      <div class="tips-memo-board card reveal" data-reveal="shelf" style="--shelf-rot:-1.2deg">
        <div class="tips-memo-board__head">
          <span class="tips-memo-board__stamp">MEMO MEJA KASIR</span>
          <h4 class="tips-memo-board__title">Tiga Pedoman Penting Saat Melayani Pelanggan</h4>
        </div>
        <ol class="tips-memo-list">
          ${TIPS_BERMAIN.map((tip, idx) => `
            <li class="tips-memo-item">
              <span class="tips-memo-num" aria-hidden="true">0${idx + 1}</span>
              <div class="tips-memo-body">
                <h5 class="tips-memo-item-title">${esc(tip.title)}</h5>
                <p class="tips-memo-item-desc">${esc(tip.desc)}</p>
              </div>
            </li>
          `).join('')}
        </ol>
      </div>

      <!-- Kartu Panduan Guru & Fasilitator (Status: Segera Hadir / Soon Added) -->
      <div class="guru-guide-box card reveal" id="guru-guide-box">
        <div class="guru-guide-head">
          <div class="guru-guide-icon">${renderIcon('chalkboard-user', { size: 30 })}</div>
          <div style="flex:1">
            <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap">
              <span class="guru-guide-badge">${esc(GURU_GUIDE.badge)}</span>
              <span class="chip chip--gold" style="font-weight:800;font-size:.76rem;background:#fef3c7;color:#78350f;border:1.5px solid #d97706;padding:.2rem .65rem;border-radius:999px">
                ${renderIcon('sparkles', { size: 13 })} Segera Hadir · Soon Added
              </span>
            </div>
            <h4 class="guru-guide-title">${esc(GURU_GUIDE.title)}</h4>
            ${showPin ? `<div class="guru-guide-pin">${renderIcon('key', { size: 16 })} PIN Fasilitator (Mode Kelas): <strong>${esc(pinValue)}</strong></div>` : ''}
          </div>
        </div>

        <!-- Wadah Segera Hadir Guru (Soon Added) -->
        <div class="guru-soon-box" style="background:rgba(0,0,0,0.22);border:2px dashed rgba(251,191,36,0.45);border-radius:20px;padding:2.2rem 1.8rem;text-align:center;color:#fffdf5">
          <div style="width:60px;height:60px;margin:0 auto 1rem;border-radius:50%;background:rgba(251,191,36,0.18);display:grid;place-items:center;border:2px solid #fbbf24;color:#fbbf24">
            ${renderIcon('sparkles', { size: 28 })}
          </div>
          <span class="badge-pill" style="background:#fbbf24;color:#451a03;font-weight:900;font-size:.78rem;margin-bottom:.6rem;display:inline-block">PANDUAN INTERAKTIF GURU</span>
          <h5 style="font:800 1.35rem var(--font-display);color:#fef3c7;margin:.3rem 0 .6rem">Tangkapan Layar &amp; Panduan Fasilitator Segera Hadir</h5>
          <p style="max-width:620px;margin:0 auto 1.4rem;color:#fde68a;font-size:.95rem;line-height:1.6">
            Panduan interaktif langkah demi langkah untuk Ruang Fasilitator (pembuatan sesi kelas online, PIN pengawas, dan pemantauan statistik EWS) sedang dipersiapkan. Untuk saat ini, Bapak/Ibu Guru dan juri dapat mengunduh serta membaca <strong>Modul Ajar Matematika (RPP &amp; Soal)</strong> dan <strong>Buku Instruksi</strong> resmi pada bagian di bawah ini.
          </p>
          <div style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap">
            <a href="#buku-instruksi" class="btn btn--gold" style="min-height:44px;color:#451a03">
              ${renderIcon('book-open', { size: 18 })}
              <span>Lihat Buku Instruksi &amp; Modul Ajar &darr;</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Tautan Akses Buku Instruksi -->
      <div class="cara-buku-notice reveal text-center">
        <p style="margin:0;font-weight:700;color:var(--am-green-800);font-size:1.02rem">
          Butuh panduan lengkap? <a href="#buku-instruksi" class="link-smooth-instruksi" style="color:var(--am-amber-700);text-decoration:underline;text-underline-offset:4px">Buku Instruksi &amp; Modul Ajar (Baca Online &amp; Unduh PDF) &darr;</a>
        </p>
      </div>
    </div>
  `;

  // =========================================================================
  // LOGIKA CAROUSEL 1: PANDUAN CARA BERMAIN (6 LANGKAH)
  // =========================================================================
  let currentStep = 0;
  let isPlaying = !prefersReduced;
  let isHovered = false;
  let isFocused = false;
  let isVisible = true;
  let stepStartTime = Date.now();
  let rafId = null;

  const stageView = document.getElementById('cara-stage-view');
  const progressBar = document.getElementById('cara-progress-bar');
  const stepperList = document.getElementById('stepper-list');
  const phaseBtns = container.querySelectorAll('.stepper-phase-btn');
  const btnPrev = document.getElementById('cara-btn-prev');
  const btnNext = document.getElementById('cara-btn-next');
  const btnPlay = document.getElementById('cara-btn-play');
  const playIcon = document.getElementById('cara-play-icon');
  const playText = document.getElementById('cara-play-text');
  const counterEl = document.getElementById('cara-counter');
  const caraCarousel = document.getElementById('cara-carousel');

  function renderCurrentStep(manual = false) {
    const item = CARA_BERMAIN[currentStep];
    const isStep0 = currentStep === 0;

    stageView.setAttribute('aria-live', manual ? 'polite' : 'off');

    stageView.innerHTML = `
      <div class="cara-stage-card">
        <div class="cara-stage-card__head">
          <span class="badge-pill">${esc(item.badge)}</span>
          <span class="cara-stage-card__step-num">Langkah ${item.step} dari ${CARA_BERMAIN.length}</span>
        </div>
        <h4 class="cara-stage-card__title">${esc(item.title)}</h4>
        <div class="cara-stage-card__desc">${item.desc}</div>

        ${isStep0 && isPlayStoreValid ? `
          <div class="cara-stage-card__action">
            <a href="${esc(playStoreLink)}" target="_blank" rel="noopener" class="btn btn--gold" data-fx="cta magnetic">
              ${renderIcon('google-play', { size: 20 })} Buka di Play Store
            </a>
          </div>
        ` : ''}

        <div class="cara-stage-card__slot">
          ${renderSlot(item.slotId, { className: 'cara-step-slot' })}
        </div>
      </div>
    `;

    // Resolusi slot gambar
    resolveSlots(stageView);

    // Update list sorotan & nyalakan koin langkah yang sudah dilewati
    const listItems = stepperList.querySelectorAll('.stepper-item');
    listItems.forEach((li, idx) => {
      const active = idx === currentStep;
      li.classList.toggle('is-active', active);
      li.setAttribute('aria-current', active ? 'step' : 'false');
      const coin = li.querySelector('.stepper-coin');
      if (coin) coin.classList.toggle('is-lit', idx <= currentStep);
      if (active && manual) {
        li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });

    // Update tab fase aktif
    phaseBtns.forEach(pb => {
      const ph = pb.getAttribute('data-phase');
      pb.classList.toggle('is-active', ph === item.phase);
    });

    // Update counter
    counterEl.textContent = `${currentStep + 1} / ${CARA_BERMAIN.length}`;
    const conveyorCoins = container.querySelectorAll('.conveyor-step-coin');
    conveyorCoins.forEach((btn, idx) => {
      const active = idx === currentStep;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      if (active && manual) {
        btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }
    });

    // Reset progress bar
    stepStartTime = Date.now();
    if (progressBar) progressBar.style.width = '0%';
  }

  function goToStep(stepIndex, manual = false) {
    if (stepIndex < 0) stepIndex = CARA_BERMAIN.length - 1; // loop
    if (stepIndex >= CARA_BERMAIN.length) stepIndex = 0; // loop
    currentStep = stepIndex;
    renderCurrentStep(manual);
  }

  function tickAutoplay() {
    if (isPlaying && !isHovered && !isFocused && isVisible) {
      const elapsed = Date.now() - stepStartTime;
      const pct = Math.min(100, (elapsed / CARA_BERMAIN_CONFIG.autoplayIntervalMs) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;

      if (elapsed >= CARA_BERMAIN_CONFIG.autoplayIntervalMs) {
        goToStep(currentStep + 1, false);
      }
    }
    rafId = requestAnimationFrame(tickAutoplay);
  }

  function togglePlay(forceState) {
    isPlaying = typeof forceState === 'boolean' ? forceState : !isPlaying;
    btnPlay.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    btnPlay.setAttribute('aria-label', isPlaying ? 'Jeda putar otomatis' : 'Mulai putar otomatis');
    playIcon.innerHTML = renderIcon(isPlaying ? 'pause' : 'play', { size: 16 });
    playText.textContent = isPlaying ? 'Jeda' : 'Putar';
    stepStartTime = Date.now();
  }

  // Event Listeners (Navigasi langkah 100% hening tanpa SFX)
  btnPrev.addEventListener('click', () => {
    goToStep(currentStep - 1, true);
  });
  btnNext.addEventListener('click', () => {
    goToStep(currentStep + 1, true);
  });
  btnPlay.addEventListener('click', () => {
    togglePlay();
  });

  const conveyorBelt = document.getElementById('conveyor-belt');
  conveyorBelt?.addEventListener('click', (e) => {
    const btn = e.target.closest('.conveyor-step-coin');
    if (btn) {
      const s = parseInt(btn.getAttribute('data-step'), 10);
      if (!isNaN(s)) goToStep(s, true);
    }
  });

  stepperList.addEventListener('click', (e) => {
    const item = e.target.closest('.stepper-item');
    if (!item) return;
    const s = parseInt(item.getAttribute('data-step'), 10);
    goToStep(s, true);
  });

  phaseBtns.forEach(pb => {
    pb.addEventListener('click', () => {
      const start = parseInt(pb.getAttribute('data-start'), 10);
      goToStep(start, true);
    });
  });

  // Hover & Focus Pause
  caraCarousel.addEventListener('mouseenter', () => { isHovered = true; });
  caraCarousel.addEventListener('mouseleave', () => { isHovered = false; stepStartTime = Date.now(); });
  caraCarousel.addEventListener('focusin', () => { isFocused = true; });
  caraCarousel.addEventListener('focusout', () => { isFocused = false; stepStartTime = Date.now(); });

  // Keyboard navigation
  caraCarousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToStep(currentStep - 1, true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToStep(currentStep + 1, true);
    }
  });

  // Mobile Swipe Detection
  let touchStartX = 0;
  caraCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  caraCarousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToStep(currentStep - 1, true);
      } else {
        goToStep(currentStep + 1, true);
      }
    }
  }, { passive: true });

  // Intersection & Visibility Observers
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
      if (isVisible) stepStartTime = Date.now();
    }, { threshold: 0.25 });
    observer.observe(caraCarousel);
  }

  document.addEventListener('visibilitychange', () => {
    isVisible = document.visibilityState === 'visible';
    if (isVisible) stepStartTime = Date.now();
  });

  // =========================================================================
    // Inisialisasi awal panduan cara bermain
  renderCurrentStep(false);
  tickAutoplay();
}
