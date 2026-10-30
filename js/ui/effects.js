import { prefersReducedMotion } from '../utils/safe.js';

const PRESS_SEL = '.btn, .tab, .icon-btn, .store-badge, .dot';
const RIPPLE_SEL = PRESS_SEL + ', .card--tilt:not(.kelas-card)';

function ripple(el, x, y) {
  const r = el.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = `width:${size}px;height:${size}px;left:${x - r.left - size / 2}px;top:${y - r.top - size / 2}px`;
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
  setTimeout(() => s.remove(), 900);
}

function burst(x, y) {
  const glyphs = ['+', '=', '×', 'x', 'coin', 'coin', '−', 'coin'];
  const n = 6 + Math.floor(Math.random() * 5);
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    const g = glyphs[i % glyphs.length];
    p.className = 'particle' + (g === 'coin' ? ' particle--coin' : '');
    if (g !== 'coin') p.textContent = g;
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.6;
    const dist = 50 + Math.random() * 60;
    p.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist - 30}px;--rot:${(Math.random() - 0.5) * 360}deg;font-size:${16 + Math.random() * 10}px`;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
    setTimeout(() => p.remove(), 1200);
  }
}

function click(){
  if (!soundOn) return;
  try {
    audio = audio || new Audio(SOUND_FILE);
    audio.volume = 0.35; audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch { /* abaikan */ }
}

export function initEffects() {
  const reduced = prefersReducedMotion();
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest?.(RIPPLE_SEL);
    if (!el || el.matches('[disabled]')) return;
    if (!reduced) ripple(el, e.clientX, e.clientY);
    const cta = e.target.closest?.('[data-burst]');
    if (cta && !reduced) burst(e.clientX || cta.getBoundingClientRect().left + 20, e.clientY || cta.getBoundingClientRect().top + 20);
  });
  // tekan 3D juga untuk keyboard
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('.btn')) {
      e.target.classList.add('is-pressed');
      if (!reduced && e.target.matches('[data-burst]')) { const r = e.target.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2); }
    }
  });
  document.addEventListener('keyup', (e) => e.target.classList?.remove('is-pressed'));
}
export { burst };

