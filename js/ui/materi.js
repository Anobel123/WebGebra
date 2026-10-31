// js/ui/materi.js — Modul Rak Barang Horizontal, Etalase Kaca Lencana, & Kuis Struk
import { LEVELS, PHASES, BADGES, QUIZ_SAMPLES } from '../content.js';
import { esc, prefersReducedMotion } from '../utils/safe.js';
import { revealNew } from './motion.js';
import { burst } from './effects.js';
import { playSfx } from './audio.js';

const TIER_IMG = (t) => `assets/game/badges/badge-tier-${t}.svg`;

export function initMateri() {
  const tabsEl = document.getElementById('materi-tabs');
  const panelEl = document.getElementById('materi-panel');
  const floatingCard = document.getElementById('floating-level-card');
  const floatingBody = document.getElementById('floating-level-body');
  const floatingClose = document.getElementById('floating-level-close');

  if (!tabsEl || !panelEl) return;
  let current = 'f1';

  // Modal Detail Koin Level Mengambang
  const showLevelDetail = (lvl) => {
    if (!floatingCard || !floatingBody) return;
    const isL0 = lvl.no === 0;
    floatingBody.innerHTML = `
      <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.8rem">
        <span class="shelf-coin-badge" style="width:48px;height:48px;font-size:1.2rem">${lvl.no}</span>
        <div>
          <h4 id="floating-level-title" style="margin:0;font-size:1.15rem;color:var(--am-brown-900)">Level ${lvl.no}: ${esc(lvl.title)}</h4>
          <span class="chip chip--green" style="font-size:.75rem">${isL0 ? 'Tutorial Kasir' : 'Jenjang ' + esc(lvl.bloom)}</span>
        </div>
      </div>
      <p style="font-size:.9rem;line-height:1.5;margin:0 0 .8rem;color:var(--am-ink)">
        <b>Tujuan Belajar:</b> ${esc(lvl.title)}
      </p>
      <div style="background:var(--am-cream-50);border:1.5px dashed var(--am-amber-600);border-radius:10px;padding:.8rem;font-size:.88rem">
        <b>Contoh Transaksi di Meja Kasir:</b><br>
        “${esc(lvl.example || 'Pelanggan memesan barang dagangan toko kelontong.')}”
      </div>
    `;
    floatingCard.hidden = false;
    floatingClose?.focus();
  };

  const hideLevelDetail = () => {
    if (floatingCard) floatingCard.hidden = true;
  };

  floatingClose?.addEventListener('click', hideLevelDetail);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && floatingCard && !floatingCard.hidden) hideLevelDetail();
  });

  const starsHtml = `<span class="level-stars" aria-hidden="true"><span class="level-star" style="--star-i:0">★</span><span class="level-star" style="--star-i:1">★</span><span class="level-star" style="--star-i:2">★</span></span>`;

  // Render Rak Kayu Horizontal untuk Fase Aktif
  const render = () => {
    const ph = PHASES.find((p) => p.id === current) || PHASES[0];
    tabsEl.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.id === current)));

    let coinsHtml = '';
    if (ph.levels[0] === 0) {
      // Level 0: Pengantar
      coinsHtml = `
        <button type="button" class="shelf-coin-item shelf-coin-item--milestone" data-level="0" aria-label="Buka detail Level 0: Pengantar">
          <span class="shelf-coin-badge">0</span>
          <span class="shelf-coin-name">L0: Pengantar</span>
        </button>
      `;
    } else {
      const phaseLevels = LEVELS.filter((l) => ph.levels.includes(l.no));
      coinsHtml = phaseLevels.map((l) => {
        const isMilestone = l.no === 10 || l.no === 20;
        return `
          <button type="button" class="shelf-coin-item ${isMilestone ? 'shelf-coin-item--milestone' : ''}" data-level="${l.no}" aria-label="Buka detail Level ${l.no}: ${esc(l.title)}">
            <span class="shelf-coin-badge">${l.no}</span>
            <span class="shelf-coin-name">Level ${l.no}</span>
          </button>
        `;
      }).join('');
    }

    panelEl.innerHTML = `
      <div class="grocery-shelf reveal" data-reveal="shelf">
        <!-- Label Harga Miring di Kiri Rak -->
        <div class="shelf-price-tag">
          <span class="shelf-price-tag__phase">${esc(ph.label)}</span>
          <h4 class="shelf-price-tag__title">${esc(ph.mode || ph.note || 'Fase Belanja')}</h4>
          <p class="shelf-price-tag__desc">${esc(ph.note || 'Tingkat penguasaan konsep aljabar di meja kasir.')}</p>
          <small style="color:var(--am-brown-800);font-weight:800">Klik koin untuk membuka tujuan belajar</small>
        </div>

        <!-- Bilah Kayu Rak dengan Koin Berjejer Mendatar -->
        <div class="shelf-plank-wrapper">
          <div class="shelf-plank-track" tabindex="0" role="region" aria-label="Daftar Koin Level di Rak">
            ${coinsHtml}
          </div>
        </div>
      </div>
    `;

    // Pasang Event Listener Klik Koin
    panelEl.querySelectorAll('.shelf-coin-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lvlNo = +btn.dataset.level;
        let lvlData;
        if (lvlNo === 0) {
          lvlData = { no: 0, title: 'Pengantar Mesin Kasir', bloom: 'Tutorial', example: 'Pemain belajar membaca harga barang dan mengetikkan bentuk aljabar dasar.' };
        } else {
          lvlData = LEVELS.find((l) => l.no === lvlNo);
        }
        if (lvlData) {
          playSfx('click');
          showLevelDetail(lvlData);
        }
      });
    });

    revealNew(panelEl);
  };

  // Navigasi Tab Fase
  tabsEl.innerHTML = PHASES.map((p) => `<button class="tab" role="tab" type="button" data-id="${p.id}" id="tab-${p.id}" aria-controls="materi-panel">${esc(p.label)}</button>`).join('');
  tabsEl.addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (t) { current = t.dataset.id; render(); }
  });
  tabsEl.addEventListener('keydown', (e) => {
    const tabs = [...tabsEl.querySelectorAll('.tab')];
    const i = tabs.indexOf(document.activeElement);
    if (i < 0 || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    n.focus();
    current = n.dataset.id;
    render();
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
    grid.innerHTML = list.map((b, idx) => `
      <article class="card card--tilt badge-card reveal" data-reveal="shelf" style="--shelf-rot:${idx % 2 === 0 ? '-2deg' : '2deg'}">
        <img src="${TIER_IMG(b.tier)}" alt="Ikon lencana tier ${b.tier}" width="56" height="56" loading="lazy">
        <div>
          <h4 style="margin:0 0 .2rem;font-size:1rem">${esc(b.name)}</h4>
          <span class="chip" style="font-size:.72rem">Tier ${b.tier}</span>
          <p style="margin:.4rem 0 0;font-size:.82rem;line-height:1.4">${esc(b.desc)}</p>
        </div>
      </article>`).join('');
    if (!list.length) grid.innerHTML = '<p>Tidak ada lencana pada tier ini.</p>';
    revealNew(grid);
  };

  filters.addEventListener('click', (e) => {
    const b = e.target.closest('.tab');
    if (b) { tier = +b.dataset.t; render(); }
  });
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
      <div class="quiz-toolbar reveal" style="grid-column: 1 / -1; margin-bottom: 1rem;">
        <span class="chip chip--green" id="quiz-score-badge">Skor Kuis Kamu: 0 / ${QUIZ_SAMPLES.length} Benar</span>
        <span class="quiz-toolbar__hint">Klik langsung pilihan A, B, C, atau D pada struk kasir!</span>
        <button class="btn btn--small btn--secondary" type="button" id="quiz-reset">Ulangi Kuis</button>
      </div>` +
      QUIZ_SAMPLES.map((q, i) => `
      <article class="receipt-slip-quiz card--quiz reveal" data-qi="${i}">
        <div style="border-bottom:1.5px dashed rgba(120,53,15,.3);padding-bottom:.5rem;margin-bottom:.8rem;display:flex;justify-content:space-between;align-items:center;gap:.5rem;flex-wrap:wrap">
          <span class="chip chip--green" style="font-size:.78rem">STRUK KUIS LEVEL ${q.level}</span>
          <span class="quiz-status" id="qstat-${i}" style="font-weight:800;font-size:.85rem">Belum dijawab</span>
        </div>
        <h3 style="margin-top:0;font-size:1.15rem;color:var(--am-brown-900)">${esc(q.q)}</h3>
        <div class="quiz-choices" role="group" aria-label="Pilihan jawaban soal ${i + 1}" style="margin:1rem 0">
          ${q.options.map((o, oi) => `<button class="quiz-choice" type="button" data-q="${i}" data-opt="${oi}">${esc(o)}</button>`).join('')}
        </div>
        <div style="display:flex;gap:.5rem;align-items:center;margin-top:.75rem;flex-wrap:wrap">
          <button class="btn btn--small btn--secondary" type="button" aria-expanded="false" aria-controls="ans-${i}" data-ans="${i}">Tampilkan jawaban</button>
        </div>
        <div id="ans-${i}" class="quiz-answer" hidden style="margin-top:.8rem;padding:.8rem;border-radius:10px;font-size:.9rem">Kunci Jawaban: ${esc(q.options[q.ans])}<br><small>${esc(QUIZ_EXPLAIN[q.level] || '')}</small></div>
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
      const card = choice.closest('.receipt-slip-quiz');
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
