// js/ui/lightbox.js — Lightbox Ringan Tanpa Dependensi untuk Tangkapan Layar Gim
import { renderIcon } from './icons.js';

let modalEl = null;
let imgEl = null;
let lastActiveEl = null;

function ensureLightbox() {
  if (modalEl && document.body.contains(modalEl)) return modalEl;

  modalEl = document.createElement('div');
  modalEl.id = 'lightbox-modal';
  modalEl.className = 'lightbox';
  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');
  modalEl.setAttribute('aria-label', 'Pratinjau Layar Penuh Tangkapan Layar Gim');
  modalEl.hidden = true;

  modalEl.innerHTML = `
    <div class="lightbox__backdrop" aria-hidden="true"></div>
    <div class="lightbox__dialog">
      <button class="lightbox__close" type="button" aria-label="Tutup pratinjau gambar">
        ${renderIcon('circle-check', { size: 20 })} <span>Tutup (Esc)</span>
      </button>
      <div class="lightbox__img-wrap">
        <img class="lightbox__img" src="" alt="Pratinjau Layar Gim" loading="eager" decoding="sync">
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);
  imgEl = modalEl.querySelector('.lightbox__img');

  const closeBtn = modalEl.querySelector('.lightbox__close');
  const backdrop = modalEl.querySelector('.lightbox__backdrop');

  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl && !modalEl.hidden) {
      e.preventDefault();
      closeLightbox();
    }
  });

  return modalEl;
}

export function openLightbox(src, alt = '') {
  if (!src) return;
  const m = ensureLightbox();
  lastActiveEl = document.activeElement;

  imgEl.src = src;
  imgEl.alt = alt || 'Pratinjau Gambar Algebra-Mart';

  m.hidden = false;
  // Memaksa reflow sebelum menambahkan kelas aktif untuk transisi CSS
  void m.offsetWidth;
  m.classList.add('is-open');
  document.body.classList.add('lightbox-open');

  const closeBtn = m.querySelector('.lightbox__close');
  closeBtn?.focus();
}

export function closeLightbox() {
  if (!modalEl || modalEl.hidden) return;

  modalEl.classList.remove('is-open');
  document.body.classList.remove('lightbox-open');

  setTimeout(() => {
    if (modalEl) modalEl.hidden = true;
    if (imgEl) imgEl.src = '';
    if (lastActiveEl && typeof lastActiveEl.focus === 'function') {
      try { lastActiveEl.focus(); } catch (_) {}
    }
  }, 220);
}

export function initLightbox() {
  ensureLightbox();

  // Delegasi klik pada gambar screenshot lanskap (16:9) di hero carousel, stepper, panduan guru, dan mode kelas
  document.addEventListener('click', (e) => {
    // Abaikan jika klik terjadi pada tombol kontrol carousel atau link
    if (e.target.closest('button, a, input, select, textarea')) return;

    const img = e.target.closest('.carousel__slide img, .device__screen img, .cara-carousel__media img, .guru-carousel__media img, figure[data-ratio="16:9"] img, [data-lightbox] img, .slot-container img');
    if (img && img.currentSrc && !img.closest('.lightbox')) {
      e.preventDefault();
      openLightbox(img.currentSrc, img.alt);
    }
  });
}
