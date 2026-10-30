import { SCREENSHOTS } from '../content.js';
import { attachImgFallback, esc, prefersReducedMotion } from '../utils/safe.js';

export function initCarousel() {
  const root = document.getElementById('carousel');
  if (!root) return;
  const track = root.querySelector('.carousel__track');
  const dotsEl = document.getElementById('carousel-dots');
  const reduced = prefersReducedMotion();
  let idx = 0, timer = null, paused = false;

  track.innerHTML = SCREENSHOTS.map((s, i) => `
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="${i + 1} dari ${SCREENSHOTS.length}: ${esc(s.title)}">
      <img src="${esc(s.src)}" alt="${esc(s.alt)}" width="1280" height="720" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} draggable="false" data-label="${esc(s.title)}">
    </div>`).join('');
  track.querySelectorAll('img').forEach((img) => attachImgFallback(img, img.dataset.label));
  dotsEl.innerHTML = SCREENSHOTS.map((s, i) => `<button class="dot" type="button" aria-label="Tampilkan: ${esc(s.title)}" data-i="${i}"></button>`).join('');

  const go = (i) => {
    idx = (i + SCREENSHOTS.length) % SCREENSHOTS.length;
    track.style.transform = `translateX(${-idx * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, k) => (k === idx ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
  };
  go(0);
  dotsEl.addEventListener('click', (e) => { const b = e.target.closest('.dot'); if (b) go(+b.dataset.i); });

  const start = () => { stop(); if (!reduced && !paused) timer = setInterval(() => go(idx + 1), 4500); };
  const stop = () => { clearInterval(timer); timer = null; };
  ['mouseenter', 'focusin'].forEach((ev) => root.addEventListener(ev, () => { paused = true; stop(); }));
  ['mouseleave', 'focusout'].forEach((ev) => root.addEventListener(ev, () => { paused = false; start(); }));
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });

  // swipe
  let x0 = null;
  root.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  root.addEventListener('pointerup', (e) => {
    if (x0 == null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
  });
  root.addEventListener('pointercancel', () => { x0 = null; });
  start();
}

