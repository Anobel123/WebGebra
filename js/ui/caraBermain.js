// js/ui/caraBermain.js — Modul Carousel Otomatis Per Tahap Panduan Bermain & Panduan Guru
import { CARA_BERMAIN_PHASES, CARA_BERMAIN, TIPS_BERMAIN, GURU_GUIDE } from '../content.js';
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { esc } from '../utils/safe.js';
import { renderIcon } from './icons.js';
import { renderSlot, resolveSlots } from '../slots.js';
import { playSfx } from './audio.js';

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
      <div class="cara-carousel" id="cara-carousel" tabindex="0" role="region" aria-label="Carousel Panduan Cara Bermain">
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

            <button type="button" class="carousel-ctrl-btn carousel-ctrl-btn--play" id="cara-btn-play" aria-label="${prefersReduced ? 'Putar carousel' : 'Jeda carousel'}" aria-pressed="${!prefersReduced}">
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

        <!-- Kolom Kanan: Daftar 15 Langkah Berurutan -->
        <div class="cara-carousel__sidebar">
          <ol class="stepper-list" id="stepper-list" role="list">
            ${CARA_BERMAIN.map((item, idx) => `
              <li class="stepper-item ${idx === 0 ? 'is-active' : ''}" data-step="${item.step}" tabindex="0" role="button" aria-current="${idx === 0 ? 'step' : 'false'}">
                <div class="stepper-coin" aria-hidden="true">${item.step}</div>
                <div class="stepper-summary">
                  <span class="stepper-step-badge">${esc(item.badge)}</span>
                  <h4 class="stepper-step-title">${esc(item.title)}</h4>
                </div>
              </li>
            `).join('')}
          </ol>
        </div>
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

      <!-- 3 Kartu Tips Cepat (Diverifikasi Sesuai Kode Gim) -->
      <div class="tips-cepat-section">
        <h4 class="tips-heading">${renderIcon('lightbulb', { size: 22 })} Tips Cepat Sukses Melayani Pelanggan</h4>
        <div class="grid grid--3 tips-grid">
          ${TIPS_BERMAIN.map(tip => `
            <div class="tip-card card reveal">
              <div class="tip-icon">${renderIcon(tip.icon, { size: 24 })}</div>
              <h5 class="tip-title">${esc(tip.title)}</h5>
              <p class="tip-desc">${esc(tip.desc)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Kartu Panduan Guru & Fasilitator (Carousel Sesuai Alur Kode Gim) -->
      <div class="guru-guide-box card reveal" id="guru-guide-box">
        <div class="guru-guide-head">
          <div class="guru-guide-icon">${renderIcon('chalkboard-user', { size: 30 })}</div>
          <div>
            <span class="guru-guide-badge">${esc(GURU_GUIDE.badge)}</span>
            <h4 class="guru-guide-title">${esc(GURU_GUIDE.title)}</h4>
            ${showPin ? `<div class="guru-guide-pin">${renderIcon('key', { size: 16 })} PIN Fasilitator (Mode Kelas): <strong>${esc(pinValue)}</strong></div>` : ''}
          </div>
        </div>

        <!-- Carousel Tahap Guru -->
        <div class="guru-carousel" id="guru-carousel" tabindex="0" role="region" aria-label="Panduan Guru Langkah demi Langkah">
          <div class="guru-carousel__stage" id="guru-stage-view">
            <!-- Diisi dinamis -->
          </div>
          <div class="guru-carousel__progress-wrap" aria-hidden="true">
            <div class="guru-carousel__progress-bar" id="guru-progress-bar"></div>
          </div>
          <div class="guru-carousel__controls">
            <button type="button" class="carousel-ctrl-btn" id="guru-btn-prev" aria-label="Langkah guru sebelumnya">
              ${renderIcon('arrow-left', { size: 16 })} <span>Sebelumnya</span>
            </button>
            <button type="button" class="carousel-ctrl-btn carousel-ctrl-btn--play" id="guru-btn-play" aria-label="Putar/Jeda panduan guru">
              <span id="guru-play-icon">${renderIcon(prefersReduced ? 'play' : 'pause', { size: 14 })}</span>
              <span id="guru-play-text">${prefersReduced ? 'Putar' : 'Jeda'}</span>
            </button>
            <span class="cara-carousel__counter" id="guru-counter">1 / ${GURU_GUIDE.steps.length}</span>
            <button type="button" class="carousel-ctrl-btn" id="guru-btn-next" aria-label="Langkah guru berikutnya">
              <span>Berikutnya</span> ${renderIcon('arrow-right', { size: 16 })}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // =========================================================================
  // LOGIKA CAROUSEL 1: PANDUAN CARA BERMAIN (15 LANGKAH)
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
          <span class="cara-stage-card__step-num">Langkah ${item.step} dari ${CARA_BERMAIN.length - 1}</span>
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

    // Update list sorotan
    const listItems = stepperList.querySelectorAll('.stepper-item');
    listItems.forEach((li, idx) => {
      const active = idx === currentStep;
      li.classList.toggle('is-active', active);
      li.setAttribute('aria-current', active ? 'step' : 'false');
      if (active) {
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
    btnPlay.setAttribute('aria-label', isPlaying ? 'Jeda carousel' : 'Putar carousel');
    playIcon.innerHTML = renderIcon(isPlaying ? 'pause' : 'play', { size: 16 });
    playText.textContent = isPlaying ? 'Jeda' : 'Putar';
    stepStartTime = Date.now();
  }

  // Event Listeners
  btnPrev.addEventListener('click', () => {
    playSfx('wood');
    goToStep(currentStep - 1, true);
  });
  btnNext.addEventListener('click', () => {
    playSfx('wood');
    goToStep(currentStep + 1, true);
  });
  btnPlay.addEventListener('click', () => {
    playSfx('wood');
    togglePlay();
  });

  stepperList.addEventListener('click', (e) => {
    const item = e.target.closest('.stepper-item');
    if (!item) return;
    const s = parseInt(item.getAttribute('data-step'), 10);
    playSfx('wood');
    goToStep(s, true);
  });

  phaseBtns.forEach(pb => {
    pb.addEventListener('click', () => {
      const start = parseInt(pb.getAttribute('data-start'), 10);
      playSfx('wood');
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
      playSfx('wood');
      goToStep(currentStep - 1, true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      playSfx('wood');
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
        playSfx('wood');
        goToStep(currentStep - 1, true);
      } else {
        playSfx('wood');
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
  // LOGIKA CAROUSEL 2: PANDUAN GURU & FASILITATOR (5 LANGKAH)
  // =========================================================================
  let guruStep = 0;
  let guruPlaying = !prefersReduced;
  let guruHovered = false;
  let guruFocused = false;
  let guruVisible = true;
  let guruStartTime = Date.now();
  let guruRafId = null;

  const guruStageView = document.getElementById('guru-stage-view');
  const guruProgressBar = document.getElementById('guru-progress-bar');
  const guruBtnPrev = document.getElementById('guru-btn-prev');
  const guruBtnNext = document.getElementById('guru-btn-next');
  const guruBtnPlay = document.getElementById('guru-btn-play');
  const guruPlayIcon = document.getElementById('guru-play-icon');
  const guruPlayText = document.getElementById('guru-play-text');
  const guruCounterEl = document.getElementById('guru-counter');
  const guruCarousel = document.getElementById('guru-carousel');

  function renderGuruStep(manual = false) {
    const s = GURU_GUIDE.steps[guruStep];
    guruStageView.setAttribute('aria-live', manual ? 'polite' : 'off');
    guruStageView.innerHTML = `
      <div class="guru-stage-card">
        <div class="guru-stage-card__head">
          <span class="guru-step-pill">Langkah ${s.num}</span>
          <h5 class="guru-stage-card__title">${esc(s.title)}</h5>
        </div>
        <div class="guru-stage-card__desc">${s.desc}</div>
        <div class="guru-stage-card__slot">
          ${renderSlot(s.slotId, { className: 'guru-step-slot' })}
        </div>
      </div>
    `;
    resolveSlots(guruStageView);
    guruCounterEl.textContent = `${guruStep + 1} / ${GURU_GUIDE.steps.length}`;
    guruStartTime = Date.now();
    if (guruProgressBar) guruProgressBar.style.width = '0%';
  }

  function goToGuruStep(stepIndex, manual = false) {
    if (stepIndex < 0) stepIndex = GURU_GUIDE.steps.length - 1;
    if (stepIndex >= GURU_GUIDE.steps.length) stepIndex = 0;
    guruStep = stepIndex;
    renderGuruStep(manual);
  }

  function tickGuruAutoplay() {
    if (guruPlaying && !guruHovered && !guruFocused && guruVisible) {
      const elapsed = Date.now() - guruStartTime;
      const pct = Math.min(100, (elapsed / CARA_BERMAIN_CONFIG.guruAutoplayIntervalMs) * 100);
      if (guruProgressBar) guruProgressBar.style.width = `${pct}%`;

      if (elapsed >= CARA_BERMAIN_CONFIG.guruAutoplayIntervalMs) {
        goToGuruStep(guruStep + 1, false);
      }
    }
    guruRafId = requestAnimationFrame(tickGuruAutoplay);
  }

  guruBtnPrev.addEventListener('click', () => {
    playSfx('wood');
    goToGuruStep(guruStep - 1, true);
  });
  guruBtnNext.addEventListener('click', () => {
    playSfx('wood');
    goToGuruStep(guruStep + 1, true);
  });
  guruBtnPlay.addEventListener('click', () => {
    playSfx('wood');
    guruPlaying = !guruPlaying;
    guruBtnPlay.setAttribute('aria-pressed', guruPlaying ? 'true' : 'false');
    guruPlayIcon.innerHTML = renderIcon(guruPlaying ? 'pause' : 'play', { size: 14 });
    guruPlayText.textContent = guruPlaying ? 'Jeda' : 'Putar';
    guruStartTime = Date.now();
  });

  guruCarousel.addEventListener('mouseenter', () => { guruHovered = true; });
  guruCarousel.addEventListener('mouseleave', () => { guruHovered = false; guruStartTime = Date.now(); });
  guruCarousel.addEventListener('focusin', () => { guruFocused = true; });
  guruCarousel.addEventListener('focusout', () => { guruFocused = false; guruStartTime = Date.now(); });

  guruCarousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      playSfx('wood');
      goToGuruStep(guruStep - 1, true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      playSfx('wood');
      goToGuruStep(guruStep + 1, true);
    }
  });

  let guruTouchX = 0;
  guruCarousel.addEventListener('touchstart', (e) => {
    guruTouchX = e.changedTouches[0].screenX;
  }, { passive: true });
  guruCarousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - guruTouchX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        playSfx('wood');
        goToGuruStep(guruStep - 1, true);
      } else {
        playSfx('wood');
        goToGuruStep(guruStep + 1, true);
      }
    }
  }, { passive: true });

  // Inisialisasi awal
  renderCurrentStep(false);
  renderGuruStep(false);

  // Mulai RAF
  tickAutoplay();
  tickGuruAutoplay();
}
