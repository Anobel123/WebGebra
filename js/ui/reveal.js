// ============================================================================
//  js/ui/reveal.js — Pusat Pengaturan Waktu & Logika Animasi Reveal Dua Arah
//  Semua angka waktu, ambang pemicu, dan durasi animasi scroll berkarakter
//  Algebra-Mart diatur di sini (sebagai konstanta JS) dan di css/tokens.css
//  (sebagai CSS Custom Properties) agar dapat disetel di satu tempat.
// ============================================================================

export const REVEAL_TIMING = {
  // Pemicu dasar umum
  delayBaseMs: 150,        // Jeda sebelum animasi mulai setelah elemen masuk layar (ms)
  durationInMs: 900,       // Durasi animasi masuk (ms)
  durationOutMs: 550,      // Durasi animasi mundur saat scroll ke atas (ms)
  staggerMs: 110,          // Jeda antar elemen dalam satu kelompok (ms)
  staggerMaxMs: 900,       // Batas total stagger agar kelompok besar tidak terlalu lama (ms)
  triggerRatio: 0.18,      // Ambang pemicu: 18% elemen masuk layar (--rv-trigger)
  rootMarginBottomPct: -12,// rootMargin bawah untuk histeresis IntersectionObserver (%)

  // Penyetelan spesifik per gaya reveal
  mask: {
    durationMs: 1000,      // Durasi teks judul mask (kata naik dari balik garis)
    staggerMs: 90,         // Stagger antar kata judul
    delayMs: 200,          // Jeda dasar judul setelah masuk layar
  },
  shelf: {
    durationMs: 900,       // Durasi kartu rak (features, materi, level, pengembang)
    staggerMs: 120,        // Stagger antar kartu rak
    delayMs: 150,          // Jeda dasar kartu rak
    shadowDelayMs: 150,    // Bayangan menyusul 150ms setelah kartu mendarat
  },
  zoom: {
    durationMs: 900,       // Durasi fallback zoom mockup hero & kartu buku
    delayMs: 150,          // Jeda zoom
    range: 'entry 15% entry 85%', // Rentang scroll-linked animation
  },
  draw: {
    coinDelayMs: 120,      // Koin nomor langkah/level menyala 120ms setelah garis mencapainya
  },
  canopy: {
    durationMs: 1000,      // Durasi membuka kanopi toko
    delayMs: 150,          // Jeda kanopi mulai setelah bagian masuk
  },
  floater: {
    durationMs: 800,       // Durasi barang melayang saat masuk
    staggerMs: 140,        // Stagger antar barang melayang
    delayMs: 250,          // Jeda barang melayang setelah bagian terlihat
  },
  out: {
    staggerFactor: 0.4,    // Stagger mundur ~40% dari stagger masuk (tanpa jeda dasar)
  }
};

// Re-export semua fungsi reveal dan motion dari motion.js agar dapat diimpor
// baik melalui ./ui/reveal.js maupun ./ui/motion.js
export {
  supportsScrollDrivenReveal,
  initReveal,
  revealNew,
  refreshScrollDraw,
  initParallax,
  initCounters
} from './motion.js';

