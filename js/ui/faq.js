// js/ui/faq.js — Modul FAQ Format Daftar Belanja Bergaris Dua Kolom (Sticky) & Skema SEO JSON-LD
import { FAQ } from '../content.js';
import { esc } from '../utils/safe.js';
import { playSfx } from './audio.js';
import { renderIcon } from './icons.js';

export function initFaq() {
  const container = document.getElementById('faq-container');
  if (!container) return;

  const validFaqs = FAQ.filter(item => {
    if (!item.q || !item.a) return false;
    if (item.tampil === false) return false;
    if (typeof item.a === 'string' && (item.a.trim() === '' || item.a.includes('TODO'))) return false;
    return true;
  });

  if (!validFaqs.length) {
    container.innerHTML = '';
    return;
  }

  // Inject dynamic JSON-LD FAQPage untuk SEO
  let scriptEl = document.getElementById('jsonld-faq');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'jsonld-faq';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': validFaqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };
  scriptEl.textContent = JSON.stringify(faqSchema, null, 2);

  // Render 2-Column Lined Shopping List Format
  container.innerHTML = `
    <div class="shopping-list-faq reveal" data-fx="tilt">
      <!-- Kolom Kiri: Papan Clipboard Daftar Belanja Menempel (Sticky) -->
      <div class="shopping-list-sticky-head">
        <span class="badge-pill" style="margin-bottom:.6rem;display:inline-block">Daftar Tanya Jawab</span>
        <h3 style="margin:0 0 .5rem;font-size:1.35rem;color:var(--am-brown-900)">Pertanyaan Sering Diajukan</h3>
        <p style="margin:0 0 1rem;font-size:.9rem;color:var(--am-muted);line-height:1.45">
          Panduan praktis seputar instalasi, mode offline, sinkronisasi kelas, dan kurikulum Fase D.
        </p>
        <div style="background:var(--am-cream-50);border:1.5px dashed var(--am-amber-600);border-radius:10px;padding:.8rem;font-size:.82rem;font-weight:700;color:var(--am-brown-800)">
          Klik pertanyaan di sebelah kanan untuk membaca penjelasan lengkap.
        </div>
      </div>

      <!-- Kolom Kanan: Akordeon Bergaris Kertas Belanja -->
      <div class="faq-accordion" id="faq-accordion" role="region" aria-label="Daftar Pertanyaan yang Sering Diajukan">
        ${validFaqs.map((f, idx) => `
          <div class="faq-item card ${idx === 0 ? 'is-open' : ''}" data-id="${f.id}" style="margin-bottom:1rem;border-left:5px solid var(--am-amber-500)">
            <button type="button" class="faq-question" id="faq-btn-${idx}" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="faq-ans-${idx}">
              <span class="faq-question-text">${esc(f.q)}</span>
              <span class="faq-chevron" aria-hidden="true">
                ${renderIcon('chevron-down', { size: 16 })}
              </span>
            </button>
            <div class="faq-answer" id="faq-ans-${idx}" role="region" aria-labelledby="faq-btn-${idx}" ${idx === 0 ? '' : 'hidden'}>
              <div class="faq-answer-inner">
                <p>${esc(f.a)}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Accordion Interaction (Single-open)
  const accordion = document.getElementById('faq-accordion');
  accordion.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    playSfx('wood');
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('is-open');

    // Tutup semua item lain
    accordion.querySelectorAll('.faq-item').forEach(it => {
      it.classList.remove('is-open');
      const b = it.querySelector('.faq-question');
      const a = it.querySelector('.faq-answer');
      if (b) b.setAttribute('aria-expanded', 'false');
      if (a) a.hidden = true;
    });

    // Toggle item saat ini
    if (!isOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      const answer = item.querySelector('.faq-answer');
      if (answer) answer.hidden = false;
    }
  });
}
