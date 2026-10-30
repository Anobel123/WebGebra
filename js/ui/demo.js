import { DEMO_QUESTIONS } from '../content.js';
import { burst } from './effects.js';
import { playSfx } from './audio.js';
import { prefersReducedMotion } from '../utils/safe.js';

const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

export function initDemo() {
  const root = document.getElementById('demo');
  if (!root) return;
  try {
    let qi = 0, solved = false;
    root.innerHTML = `
      <div class="demo">
        <div class="bubble" id="demo-customer" aria-live="polite"></div>
        <div class="demo__options" id="demo-options" role="group" aria-label="Pilihan bentuk aljabar"></div>
        <p class="demo__feedback" id="demo-feedback" role="status"></p>
        <div class="demo__calc" id="demo-calc" hidden>
          <b>Ayo substitusi harga barang</b>
          <div id="demo-sliders"></div>
          <div class="demo__result" id="demo-result"></div>
        </div>
        <button class="btn btn--secondary btn--small" type="button" id="demo-next" hidden>Soal berikutnya</button>
      </div>`;
    const $ = (id) => root.querySelector('#' + id);

    const calc = (q) => {
      const vals = q.vars.map((v) => (v.fixed ?? +root.querySelector(`#sl-${v.sym}`).value));
      const total = q.vars.reduce((s, v, i) => s + v.coef * vals[i], 0);
      const eq = q.vars.map((v, i) => `${v.coef} × ${rp(vals[i])}`).join(' + ');
      const change = q.pay - total;
      $('demo-result').innerHTML = `Total = ${eq} = <b>${rp(total)}</b><br>Pelanggan membayar ${rp(q.pay)} → kembalian <b>${rp(change)}</b>${change < 0 ? ' (uang kurang)' : ''}`;
    };

    const load = () => {
      const q = DEMO_QUESTIONS[qi]; solved = false;
      $('demo-customer').innerHTML = `“${q.customer}”`;
      $('demo-feedback').textContent = 'Pilih bentuk aljabar yang tepat untuk pesanan ini.';
      $('demo-calc').hidden = true; $('demo-next').hidden = true;
      $('demo-options').innerHTML = q.options.map((o, i) => `<button class="btn btn--secondary demo__opt" type="button" data-i="${i}">${o}</button>`).join('');
      $('demo-sliders').innerHTML = q.vars.map((v) => v.fixed != null
        ? `<p>${v.sym} (${v.name}) = <b>${rp(v.fixed)}</b> (harga tetap)</p>`
        : `<label for="sl-${v.sym}">${v.sym} (${v.name}) = <b id="lb-${v.sym}">${rp(v.value)}</b></label><input id="sl-${v.sym}" type="range" min="${v.min}" max="${v.max}" step="${v.step}" value="${v.value}">`).join('');
      q.vars.forEach((v) => {
        const s = root.querySelector('#sl-' + v.sym);
        s?.addEventListener('input', () => { root.querySelector('#lb-' + v.sym).textContent = rp(+s.value); calc(q); });
      });
    };

    $('demo-options').addEventListener('click', (e) => {
      const b = e.target.closest('.demo__opt'); if (!b || solved) return;
      const q = DEMO_QUESTIONS[qi];
      if (+b.dataset.i === q.answer) {
        solved = true; b.classList.add('is-right');
        playSfx('right');
        $('demo-feedback').textContent = 'Benar! ' + q.right;
        if (!prefersReducedMotion()) { const r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2); }
        $('demo-calc').hidden = false; calc(q);
        $('demo-next').hidden = false;
        $('demo-next').textContent = qi < DEMO_QUESTIONS.length - 1 ? 'Soal berikutnya' : 'Ulangi dari soal pertama';
      } else {
        playSfx('wrong');
        b.classList.remove('is-wrong'); void b.offsetWidth; b.classList.add('is-wrong');
        $('demo-feedback').textContent = q.hint;
      }
    });
    $('demo-next').addEventListener('click', () => { qi = (qi + 1) % DEMO_QUESTIONS.length; load(); });
    load();
  } catch (e) {
    console.error('[demo]', e);
    root.innerHTML = `<div class="card"><p>Demo tidak tersedia, silakan coba gim lengkap.</p><a class="btn" href="#akses">Ke Akses Game</a></div>`;
  }
}

