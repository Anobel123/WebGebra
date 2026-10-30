import { LEVELS, PHASES, BADGES, QUIZ_SAMPLES } from '../content.js';
import { esc, prefersReducedMotion } from '../utils/safe.js';
import { revealNew } from './motion.js';
import { burst } from './effects.js';
import { playSfx } from './audio.js';

const TIER_IMG = (t) => `assets/game/badges/badge-tier-${t}.svg`;

export function initMateri() {
  const tabsEl = document.getElementById('materi-tabs');
  const panelEl = document.getElementById('materi-panel');
  if (!tabsEl || !panelEl) return;
  let current = 'f1';

  const starsHtml = `<span class="level-stars" aria-hidden="true"><span class="level-star" style="--star-i:0">★</span><span class="level-star" style="--star-i:1">★</span><span class="level-star" style="--star-i:2">★</span></span>`;
  const levelCard = (l) => `
    <article class="card card--tilt level-card reveal reveal--shelf" data-fx="tilt level" tabindex="0">
      <div class="level-card__head"><span class="coin-num" aria-hidden="true">${l.no}</span>
        <div><div class="level-card__title">Level ${l.no}: ${esc(l.title)}</div><div class="level-card__badges"><span class="chip chip--green">Jenjang ${esc(l.bloom)}</span>${starsHtml}</div></div></div>
      <div class="bubble level-card__peek"><b>Tujuan:</b> ${esc(l.title)}.<br><b>Contoh transaksi:</b> “${esc(l.example)}”</div>
    </article>`;

  const render = () => {
    const ph = PHASES.find((p) => p.id === current);
    tabsEl.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.id === current)));
    if (ph.levels[0] === 0) {
      panelEl.innerHTML = `<article class="card card--tilt level-card" data-fx="tilt level" tabindex="0"><div class="level-card__head"><span class="coin-num" aria-hidden="true">0</span>
        <div><div class="level-card__title">Level 0: Pengantar</div><div class="level-card__badges"><span class="chip chip--green">Tutorial</span>${starsHtml}</div></div></div>
        <div class="bubble level-card__peek">${esc(ph.note)} Pemain belajar cara membaca pesanan, menulis bentuk aljabar, dan melayani pembayaran sebelum masuk Level 1.</div></article>`;
    } else {
      panelEl.innerHTML = `<p class="lead">${esc(ph.mode)}</p><div class="grid grid--pillars">${LEVELS.filter((l) => ph.levels.includes(l.no)).map(levelCard).join('')}</div>`;
    }
    revealNew(panelEl);
  };

  tabsEl.innerHTML = PHASES.map((p) => `<button class="tab" role="tab" type="button" data-id="${p.id}" id="tab-${p.id}" aria-controls="materi-panel">${esc(p.label)}</button>`).join('');
  tabsEl.addEventListener('click', (e) => { const t = e.target.closest('.tab'); if (t) { current = t.dataset.id; render(); } });
  tabsEl.addEventListener('keydown', (e) => {
    const tabs = [...tabsEl.querySelectorAll('.tab')]; const i = tabs.indexOf(document.activeElement);
    if (i < 0 || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    n.focus(); current = n.dataset.id; render();
  });
  render();
  initBadges();
  initQuiz();
}

function initBadges() {
  const grid = document.getElementById('badge-grid');
  const filters = document.getElementById('badge-filters');
  if (!grid || !filters) return;
  let tier = 0;
  filters.innerHTML = ['Semua', 1, 2, 3, 4, 5].map((t, i) => `<button class="tab" type="button" data-t="${i}" aria-pressed="${i === 0}">${i === 0 ? 'Semua tier' : 'Tier ' + t}</button>`).join('');
  const render = () => {
    filters.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.t === tier)));
    const list = BADGES.filter((b) => !tier || b.tier === tier);
    grid.innerHTML = list.map((b) => `
      <article class="card card--tilt badge-card reveal">
        <img src="${TIER_IMG(b.tier)}" alt="Ikon lencana tier ${b.tier}" width="56" height="56" loading="lazy">
        <div><h4>${esc(b.name)}</h4><span class="chip">Tier ${b.tier}</span><p>${esc(b.desc)}</p></div>
      </article>`).join('');
    if (!list.length) grid.innerHTML = '<p>Tidak ada lencana pada tier ini.</p>';
    revealNew(grid);
  };
  filters.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) { tier = +b.dataset.t; render(); } });
  render();
}

const QUIZ_EXPLAIN = {
  1: 'Harga 1 wadah kue padamaran = j rupiah, maka 4 wadah adalah 4 × j = 4j.',
  2: 'Suku sejenis (sama-sama variabel a) dijumlahkan koefisiennya: (3 + 4)a = 7a.',
  11: 'Substitusi b = 15.000 dan i = 14.000 ke 3b + 2i → 3(15.000) + 2(14.000) = 45.000 + 28.000 = Rp 73.000.'
};

function initQuiz() {
  const el = document.getElementById('quiz-list');
  if (!el) return;
  const solvedSet = new Set();

  const updateScore = () => {
    const sb = document.getElementById('quiz-score-badge');
    if (sb) sb.textContent = `Skor Kuis Kamu: ${solvedSet.size} / ${QUIZ_SAMPLES.length} Benar`;
  };

  const renderQuiz = () => {
    solvedSet.clear();
    el.innerHTML = `
      <div class="quiz-toolbar reveal" style="grid-column: 1 / -1;">
        <span class="chip chip--green" id="quiz-score-badge">Skor Kuis Kamu: 0 / ${QUIZ_SAMPLES.length} Benar</span>
        <span class="quiz-toolbar__hint">Klik langsung pilihan A, B, C, atau D untuk menjawab sendiri!</span>
        <button class="btn btn--small btn--secondary" type="button" id="quiz-reset">Ulangi Kuis</button>
      </div>` +
      QUIZ_SAMPLES.map((q, i) => `
      <article class="card card--quiz reveal" data-qi="${i}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;flex-wrap:wrap">
          <span class="chip chip--green">Kuis Level ${q.level}</span>
          <span class="quiz-status" id="qstat-${i}">Belum dijawab</span>
        </div>
        <h3 style="margin-top:.7rem">${esc(q.q)}</h3>
        <div class="quiz-choices" role="group" aria-label="Pilihan jawaban soal ${i + 1}">
          ${q.options.map((o, oi) => `<button class="quiz-choice" type="button" data-q="${i}" data-opt="${oi}">${esc(o)}</button>`).join('')}
        </div>
        <div style="display:flex;gap:.5rem;align-items:center;margin-top:.75rem;flex-wrap:wrap">
          <button class="btn btn--small btn--secondary" type="button" aria-expanded="false" aria-controls="ans-${i}" data-ans="${i}">Tampilkan jawaban</button>
        </div>
        <div id="ans-${i}" class="quiz-answer" hidden>Kunci Jawaban: ${esc(q.options[q.ans])}<br><small>${esc(QUIZ_EXPLAIN[q.level] || '')}</small></div>
      </article>`).join('');
    revealNew(el);
  };

  renderQuiz();

  el.addEventListener('click', (e) => {
    if (e.target.closest('#quiz-reset')) {
      renderQuiz();
      return;
    }
    const choice = e.target.closest('.quiz-choice');
    if (choice) {
      const qi = +choice.dataset.q;
      const oi = +choice.dataset.opt;
      const q = QUIZ_SAMPLES[qi];
      const card = choice.closest('.card--quiz');
      const ansBox = document.getElementById('ans-' + qi);
      const stat = document.getElementById('qstat-' + qi);
      const toggleBtn = card.querySelector('[data-ans]');

      if (oi === q.ans) {
        playSfx('right');
        card.querySelectorAll('.quiz-choice').forEach((btn, idx) => {
          btn.classList.toggle('is-correct', idx === oi);
          if (idx !== oi) btn.classList.remove('is-wrong');
        });
        solvedSet.add(qi);
        updateScore();
        if (stat) { stat.textContent = 'Terjawab Benar'; stat.className = 'quiz-status is-ok'; }
        ansBox.hidden = false;
        ansBox.className = 'quiz-answer is-correct';
        ansBox.innerHTML = `<b>Jawaban Kamu Benar (${esc(q.options[q.ans])})</b><br><small>${esc(QUIZ_EXPLAIN[q.level] || '')}</small>`;
        if (toggleBtn) { toggleBtn.setAttribute('aria-expanded', 'true'); toggleBtn.textContent = 'Sembunyikan jawaban'; }
        if (!prefersReducedMotion()) {
          const r = choice.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2);
        }
      } else {
        playSfx('wrong');
        choice.classList.remove('is-wrong');
        void choice.offsetWidth;
        choice.classList.add('is-wrong');
        if (stat && !solvedSet.has(qi)) { stat.textContent = 'Coba lagi'; stat.className = 'quiz-status is-err'; }
        ansBox.hidden = false;
        ansBox.className = 'quiz-answer is-wrong';
        ansBox.innerHTML = `<b>Pilihan "${esc(q.options[oi])}" belum tepat.</b> Ayo klik pilihan lain atau tekan "Tampilkan jawaban"!`;
      }
      return;
    }

    const b = e.target.closest('[data-ans]');
    if (!b) return;
    const qi = +b.dataset.ans;
    const q = QUIZ_SAMPLES[qi];
    const a = document.getElementById('ans-' + qi);
    const show = a.hidden;
    a.hidden = !show;
    if (show) {
      a.className = 'quiz-answer is-correct';
      a.innerHTML = `<b>Kunci Jawaban: ${esc(q.options[q.ans])}</b><br><small>${esc(QUIZ_EXPLAIN[q.level] || '')}</small>`;
    }
    b.setAttribute('aria-expanded', String(show));
    b.textContent = show ? 'Sembunyikan jawaban' : 'Tampilkan jawaban';
  });
}
