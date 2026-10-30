import { SITE_CONFIG } from '../config.js';
import { copyText, toast, esc, prefersReducedMotion } from '../utils/safe.js';
import { burst } from './effects.js';

const RATING_LABELS = {
  1: '1 Bintang · Perlu Banyak Perbaikan',
  2: '2 Bintang · Cukup',
  3: '3 Bintang · Baik',
  4: '4 Bintang · Sangat Baik',
  5: '5 Bintang · Luar Biasa & Edukatif!'
};

export function initFeedback() {
  const root = document.getElementById('feedback-box');
  if (!root) return;
  const targetEmail = SITE_CONFIG.contactEmail || 'ansharudinsahid@gmail.com';
  let currentRating = 5;

  root.innerHTML = `
    <form class="feedback-form" id="feedback-form" novalidate>
      <div class="feedback-form__row">
        <div class="field">
          <label for="fb-name">Nama (opsional)</label>
          <input id="fb-name" name="name" type="text" placeholder="Nama kamu" autocomplete="name">
        </div>
        <div class="field">
          <label for="fb-email">Email (opsional)</label>
          <input id="fb-email" name="email" type="email" placeholder="nama@email.com" autocomplete="email" aria-describedby="fb-email-help">
          <small class="field__help" id="fb-email-help">Hanya dipakai untuk membalas masukanmu dan tidak dibagikan ke pihak lain.</small>
        </div>
      </div>

      <div class="field">
        <span class="field__label" id="fb-rating-label">Rating pengalaman kamu</span>
        <div class="rating-group" role="radiogroup" aria-labelledby="fb-rating-label">
          ${[1, 2, 3, 4, 5].map((n) => `
            <button type="button" class="rating-star ${n <= currentRating ? 'is-on' : ''}" role="radio" aria-checked="${n === currentRating}" data-rate="${n}" aria-label="${n} Bintang">
              <span aria-hidden="true">★</span>
              <small>${n}</small>
            </button>
          `).join('')}
          <span class="rating-badge" id="fb-rating-text">${RATING_LABELS[currentRating]}</span>
        </div>
      </div>

      <div class="field">
        <label for="fb-message">Kritik &amp; saran</label>
        <textarea id="fb-message" name="message" rows="4" placeholder="Tulis kritik, saran, atau pengalaman kamu mencoba Algebra-Mart..." required></textarea>
      </div>

      <div class="feedback-form__actions">
        <button class="btn" type="submit" data-burst data-fx="cta magnetic" data-hover="Kirim Sekarang!" aria-label="Kirim Masukan ke ${esc(targetEmail)}">Kirim Masukan ke ${esc(targetEmail)}</button>
        <button class="btn btn--secondary btn--small" type="button" id="fb-copy">Salin Isi Masukan</button>
      </div>
      <div class="feedback-status" id="fb-status" role="status" aria-live="polite" hidden></div>
    </form>
  `;

  const form = root.querySelector('#feedback-form');
  const stars = [...root.querySelectorAll('.rating-star')];
  const rateText = root.querySelector('#fb-rating-text');
  const statusEl = root.querySelector('#fb-status');

  const setRating = (val) => {
    currentRating = val;
    stars.forEach((btn) => {
      const n = +btn.dataset.rate;
      btn.classList.toggle('is-on', n <= currentRating);
      btn.setAttribute('aria-checked', String(n === currentRating));
    });
    if (rateText) rateText.textContent = RATING_LABELS[currentRating] || `${currentRating} Bintang`;
  };

  root.querySelector('.rating-group')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.rating-star');
    if (!btn) return;
    setRating(+btn.dataset.rate);
    if (!prefersReducedMotion()) {
      const r = btn.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    }
  });

  const buildPayload = () => {
    const name = root.querySelector('#fb-name')?.value.trim() || 'Anonim';
    const email = root.querySelector('#fb-email')?.value.trim() || '-';
    const msg = root.querySelector('#fb-message')?.value.trim() || '(Tanpa pesan tambahan)';
    const subject = `[Masukan Algebra-Mart] Rating ${currentRating}/5 Bintang dari ${name}`;
    const body = [
      `Halo Tim Pengembang Algebra-Mart,`,
      ``,
      `Berikut masukan dari pengunjung web preview:`,
      `• Nama: ${name}`,
      `• Email: ${email}`,
      `• Rating Pengalaman: ${'★'.repeat(currentRating)}${'☆'.repeat(5 - currentRating)} (${RATING_LABELS[currentRating]})`,
      ``,
      `Kritik & Saran:`,
      msg
    ].join('\n');
    return { name, email, msg, subject, body };
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const { subject, body } = buildPayload();
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    statusEl.hidden = false;
    statusEl.innerHTML = `Terima kasih! Aplikasi email dibuka menuju <b>${esc(targetEmail)}</b>. Jika aplikasi email belum terbuka otomatis, klik <a href="${esc(mailtoUrl)}">tautan kirim email ini</a> atau tombol <b>Salin Isi Masukan</b>.`;
    toast(`Membuka kiriman masukan ke ${targetEmail}...`);
    try {
      window.location.href = mailtoUrl;
    } catch { /* fallback sudah ada di statusEl */ }
  });

  root.querySelector('#fb-copy')?.addEventListener('click', async () => {
    const { body } = buildPayload();
    const ok = await copyText(`Kepada: ${targetEmail}\n\n${body}`);
    statusEl.hidden = false;
    statusEl.innerHTML = `Isi masukan berhasil disalin! Kamu dapat menempelkannya langsung ke email <b>${esc(targetEmail)}</b>.`;
    toast(ok ? 'Isi masukan berhasil disalin!' : 'Salin manual dari kotak yang muncul.');
  });
}

