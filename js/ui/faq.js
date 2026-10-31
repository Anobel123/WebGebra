// js/ui/faq.js — Modul FAQ Akordeon & Skema SEO JSON-LD FAQPage
import { FAQ } from '../content.js';
import { esc } from '../utils/safe.js';
import { playSfx } from './audio.js';
import { renderIcon } from './icons.js';

export function initFaq() {
  const container = document.getElementById('faq-container');
  if (!container) return;

  // Filter hanya pertanyaan yang memiliki jawaban dan tidak berstatus sembunyi/TODO
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

  // Render Accordion UI
  container.innerHTML = `
    <div class="faq-section reveal" data-fx="tilt">
      <div class="section-head text-center">
        <span class="badge-pill">Tanya Jawab</span>
        <h3 class="faq-title">Pertanyaan Sering Diajukan (FAQ)</h3>
        <p class="faq-subtitle">Temukan jawaban cepat seputar akses gim, mode pembelajaran, dan kurikulum.</p>
      </div>

      <div class="faq-accordion" id="faq-accordion" role="region" aria-label="Daftar Pertanyaan yang Sering Diajukan">
        ${validFaqs.map((f, idx) => `
          <div class="faq-item card ${idx === 0 ? 'is-open' : ''}" data-id="${f.id}">
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

    // Jika sebelumnya tertutup, sekarang buka
    if (!isOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      const ans = item.querySelector('.faq-answer');
      if (ans) ans.hidden = false;
    }
  });
}

