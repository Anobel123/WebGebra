import { prefersReducedMotion } from '../utils/safe.js';

export function initNav() {
  const header = document.querySelector('.header');
  const nav = document.getElementById('nav');
  const burger = document.getElementById('hamburger');
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header?.classList.toggle('is-scrolled', y > 24);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scrollspy
  const setActive = (id) => links.forEach((a) => {
    const on = a.getAttribute('href') === '#' + id;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  const closeMenu = () => {
    if (!nav?.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    nav?.classList.add('is-open');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    // Kelola fokus ke tautan navigasi pertama
    const firstLink = nav?.querySelector('a');
    if (firstLink) setTimeout(() => firstLink.focus(), 50);
  };

  burger?.addEventListener('click', () => {
    const isOpen = nav?.classList.contains('is-open');
    if (isOpen) closeMenu(); else openMenu();
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav?.classList.contains('is-open')) {
      closeMenu();
      burger?.focus();
    }
  });

  // Tutup menu jika klik terjadi di luar panel navigasi & tombol hamburger
  document.addEventListener('click', (e) => {
    if (!nav?.classList.contains('is-open')) return;
    if (nav.contains(e.target) || burger?.contains(e.target)) return;
    closeMenu();
  });

  // Klik anchor: scroll mulus dengan offset header, hash bersih
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    closeMenu();
    const top = id === 'beranda' ? 0 : target.getBoundingClientRect().top + scrollY - (header?.offsetHeight ?? 56) + 1;
    scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    try { history.replaceState(null, '', '#' + id); } catch { /* file:// bisa menolak */ }
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

