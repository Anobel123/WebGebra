import { prefersReducedMotion } from '../utils/safe.js';

export function initReveal() {
  const els = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window)) return; // tanpa kelas js-reveal, konten tampil biasa
  document.documentElement.classList.add('js-reveal');
  // stagger per parent
  const counts = new Map();
  els.forEach((el) => {
    const p = el.parentElement;
    const i = counts.get(p) || 0; counts.set(p, i + 1);
    el.style.setProperty('--i', Math.min(i, 12));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
  // pengaman: tampilkan semua bila observer tidak jalan
  setTimeout(() => els.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in'); }), 1500);
}

/** Observe elemen yang dibuat dinamis oleh JS. */
export function revealNew(root) {
  if (!document.documentElement.classList.contains('js-reveal')) return;
  const els = [...root.querySelectorAll('.reveal:not(.is-in)')];
  els.forEach((el, i) => el.style.setProperty('--i', Math.min(i, 12)));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach((el) => io.observe(el));
}

export function initParallax() {
  if (prefersReducedMotion()) return;
  // Nonaktifkan parallax di layar ponsel / sentuh demi performa scroll 60fps yang ringan dan bebas loncatan
  if (window.innerWidth <= 768 || window.matchMedia?.('(hover: none) and (pointer: coarse)').matches) return;
  const hero = document.getElementById('beranda');
  const items = [...document.querySelectorAll('[data-speed]')];
  if (!hero || !items.length) return;
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      if (y < hero.offsetHeight + 100) items.forEach((el) => { el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.speed)}px, 0)`; });
      ticking = false;
    });
  }, { passive: true });
}

export function initCounters() {
  const els = [...document.querySelectorAll('[data-count]')];
  const reduced = prefersReducedMotion();
  const setFinal = (el) => { el.textContent = el.dataset.count; };
  if (!('IntersectionObserver' in window) || reduced) { els.forEach(setFinal); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const end = +e.target.dataset.count, t0 = performance.now(), dur = 1200;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step); else setFinal(e.target);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
}

