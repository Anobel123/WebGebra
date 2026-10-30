import { FEATURES } from '../content.js';
import { esc } from '../utils/safe.js';

export function initFeatures() {
  const el = document.getElementById('features');
  if (el) {
    el.innerHTML = FEATURES.map((f) => `
      <article class="card card--tilt feature reveal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(f.i)}"/></svg>
        <div><h3>${esc(f.t)}</h3><p>${esc(f.d)}</p></div>
      </article>`).join('');
  }
  document.querySelectorAll('.accordion__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });
}

