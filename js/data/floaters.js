// ============================================================================
//  js/data/floaters.js — Definisi Tema Barang Melayang per Bagian Halaman
//  Semua gambar diambil dari aset lokal (assets/game/*) dan SVG inline.
// ============================================================================

export const FLOATER_SVG = {
  coin: (sym = 'x') => `
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" focusable="false">
      <circle cx="32" cy="35" r="26" fill="#b45309" stroke="#451a03" stroke-width="4"/>
      <circle cx="32" cy="29" r="26" fill="#fbbf24" stroke="#451a03" stroke-width="4"/>
      <circle cx="32" cy="29" r="19" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="5 3"/>
      <path d="M18 18 A16 16 0 0 1 31 13" fill="none" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/>
      <text x="32" y="31" text-anchor="middle" dominant-baseline="central" font-family="Fredoka, Nunito, sans-serif" font-weight="900" font-size="${sym.length > 1 ? 20 : 28}" fill="#451a03">${sym}</text>
    </svg>
  `,
  star: () => `
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" focusable="false">
      <path d="M32 6 L39.8 21.8 L57.2 24.3 L44.6 36.6 L47.6 54 L32 45.8 L16.4 54 L19.4 36.6 L6.8 24.3 L24.2 21.8 Z"
        fill="#fbbf24" stroke="#451a03" stroke-width="4" stroke-linejoin="round"/>
      <path d="M32 12 L37.2 22.6 L48.8 24.2" fill="none" stroke="#fef3c7" stroke-width="2.8" stroke-linecap="round"/>
    </svg>
  `,
  receipt: () => `
    <svg viewBox="0 0 64 72" width="100%" height="100%" aria-hidden="true" focusable="false">
      <path d="M12 6 H52 V64 L46 59 L40 64 L34 59 L28 64 L22 59 L16 64 L12 60 Z"
        fill="#fffdf5" stroke="#451a03" stroke-width="3.8" stroke-linejoin="round"/>
      <rect x="18" y="13" width="28" height="6" rx="3" fill="#fbbf24"/>
      <line x1="18" y1="27" x2="46" y2="27" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
      <line x1="18" y1="36" x2="38" y2="36" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      <line x1="18" y1="45" x2="46" y2="45" stroke="#78350f" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 4"/>
      <text x="32" y="55" text-anchor="middle" font-family="Fredoka, Nunito, sans-serif" font-weight="900" font-size="11" fill="#451a03">3d+2b</text>
    </svg>
  `,
  phone: () => `
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" focusable="false">
      <rect x="8" y="14" width="48" height="36" rx="8" fill="#451a03" stroke="#fbbf24" stroke-width="3.5"/>
      <rect x="13" y="18" width="38" height="28" rx="4" fill="#fef3c7"/>
      <circle cx="24" cy="32" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="2"/>
      <path d="M34 27 H45 M34 33 H43 M34 39 H46" stroke="#78350f" stroke-width="2.8" stroke-linecap="round"/>
    </svg>
  `,
  book: () => `
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" focusable="false">
      <path d="M10 14 C18 11, 26 13, 32 17 C38 13, 46 11, 54 14 V50 C46 47, 38 49, 32 53 C26 49, 18 47, 10 50 Z"
        fill="#fef3c7" stroke="#451a03" stroke-width="3.8" stroke-linejoin="round"/>
      <path d="M32 17 V53" stroke="#b45309" stroke-width="3.2"/>
      <path d="M16 24 H26 M16 32 H25 M38 24 H48 M38 32 H47" stroke="#78350f" stroke-width="2.6" stroke-linecap="round"/>
    </svg>
  `,
  pencil: () => `
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" focusable="false">
      <g transform="rotate(-35 32 32)">
        <rect x="25" y="10" width="14" height="34" rx="2" fill="#fbbf24" stroke="#451a03" stroke-width="3.5"/>
        <rect x="25" y="10" width="14" height="8" rx="2" fill="#f87171" stroke="#451a03" stroke-width="3.5"/>
        <polygon points="25,44 39,44 32,56" fill="#fde68a" stroke="#451a03" stroke-width="3.5" stroke-linejoin="round"/>
        <polygon points="29.5,51 34.5,51 32,56" fill="#451a03"/>
      </g>
    </svg>
  `
};

export const SECTION_FLOATERS = [
  {
    sectionId: 'beranda',
    selector: '#beranda',
    seed: 101,
    counts: { desktop: 9, tablet: 5, mobile: 4 },
    items: [
      { kind: 'svg', svg: 'coin', sym: 'Rp', size: 52 },
      { kind: 'token', label: '3a', size: 50 },
      { kind: 'img', src: 'assets/game/barangbelanja/dodolnanas.png', w: 58, h: 58, size: 58 },
      { kind: 'img', src: 'assets/game/rupiah/rp50000.png', w: 76, h: 38, size: 68, bill: true },
      { kind: 'token', label: 'x + y', size: 54 },
      { kind: 'img', src: 'assets/game/barangbelanja/apel.png', w: 52, h: 52, size: 52 },
      { kind: 'img', src: 'assets/game/badges/badge-tier-5.svg', w: 54, h: 54, size: 54 },
      { kind: 'img', src: 'assets/game/barangbelanja/jeruk.png', w: 50, h: 50, size: 50 },
      { kind: 'img', src: 'assets/game/barangbelanja/kopiaaa.png', w: 54, h: 54, size: 54 },
      { kind: 'token', label: '=', size: 44 },
      { kind: 'svg', svg: 'coin', sym: 'x', size: 44 }
    ]
  },
  {
    sectionId: 'tentang',
    selector: '#tentang',
    seed: 202,
    counts: { desktop: 8, tablet: 5, mobile: 3 },
    items: [
      { kind: 'img', src: 'assets/game/barangbelanja/padamaran.png', w: 62, h: 62, size: 62 },
      { kind: 'img', src: 'assets/game/barangbelanja/gandus.png', w: 60, h: 60, size: 60 },
      { kind: 'pill', label: '3d + 4d = 7d', size: 64 },
      { kind: 'img', src: 'assets/game/rupiah/rp20000.png', w: 76, h: 38, size: 68, bill: true },
      { kind: 'svg', svg: 'coin', sym: 'd', size: 48 },
      { kind: 'token', label: 'j', size: 44 },
      { kind: 'img', src: 'assets/game/barangbelanja/dodolnanas.png', w: 54, h: 54, size: 54 },
      { kind: 'token', label: 'x', size: 46 },
      { kind: 'svg', svg: 'coin', sym: 'Rp', size: 42 }
    ]
  },
  {
    sectionId: 'materi',
    selector: '#materi',
    seed: 303,
    counts: { desktop: 8, tablet: 5, mobile: 3 },
    items: [
      { kind: 'img', src: 'assets/game/badges/badge-tier-5.svg', w: 56, h: 56, size: 56 },
      { kind: 'pill', label: '3b + 2i', size: 58 },
      { kind: 'svg', svg: 'star', size: 46 },
      { kind: 'token', label: '+', size: 44 },
      { kind: 'img', src: 'assets/game/badges/badge-tier-3.svg', w: 52, h: 52, size: 52 },
      { kind: 'token', label: '×', size: 44 },
      { kind: 'svg', svg: 'coin', sym: '=', size: 48 },
      { kind: 'token', label: '−', size: 42 },
      { kind: 'img', src: 'assets/game/badges/badge-tier-1.svg', w: 48, h: 48, size: 48 }
    ]
  },
  {
    sectionId: 'cara-bermain',
    selector: '#cara-bermain-container',
    seed: 404,
    counts: { desktop: 7, tablet: 4, mobile: 3 },
    items: [
      { kind: 'calc', label: '7', size: 46 },
      { kind: 'calc', label: '8', size: 46 },
      { kind: 'calc', label: '+', size: 46 },
      { kind: 'calc', label: '=', size: 48, accent: true },
      { kind: 'svg', svg: 'receipt', size: 58 },
      { kind: 'img', src: 'assets/game/rupiah/rp10000.png', w: 72, h: 36, size: 64, bill: true },
      { kind: 'img', src: 'assets/game/rupiah/rp50000.png', w: 72, h: 36, size: 64, bill: true },
      { kind: 'svg', svg: 'coin', sym: 'Rp', size: 44 }
    ]
  },
  {
    sectionId: 'akses',
    selector: '#akses',
    seed: 505,
    counts: { desktop: 7, tablet: 4, mobile: 3 },
    items: [
      { kind: 'svg', svg: 'phone', size: 56 },
      { kind: 'svg', svg: 'coin', sym: 'Rp', size: 50 },
      { kind: 'svg', svg: 'star', size: 46 },
      { kind: 'img', src: 'assets/game/badges/badge-tier-4.svg', w: 54, h: 54, size: 54 },
      { kind: 'img', src: 'assets/game/barangbelanja/tempoyak.png', w: 56, h: 56, size: 56 },
      { kind: 'svg', svg: 'coin', sym: 'x', size: 42 },
      { kind: 'svg', svg: 'star', size: 38 }
    ]
  },
  {
    sectionId: 'profil',
    selector: '#profil',
    seed: 606,
    counts: { desktop: 7, tablet: 4, mobile: 3 },
    items: [
      { kind: 'svg', svg: 'book', size: 54 },
      { kind: 'svg', svg: 'pencil', size: 52 },
      { kind: 'svg', svg: 'star', size: 46 },
      { kind: 'img', src: 'assets/game/badges/badge-tier-2.svg', w: 52, h: 52, size: 52 },
      { kind: 'img', src: 'assets/game/barangbelanja/buku.png', w: 54, h: 54, size: 54 },
      { kind: 'img', src: 'assets/game/barangbelanja/pena.png', w: 50, h: 50, size: 50 },
      { kind: 'svg', svg: 'coin', sym: 'd', size: 44 }
    ]
  },
  {
    sectionId: 'footer',
    selector: '.footer',
    seed: 707,
    counts: { desktop: 6, tablet: 4, mobile: 3 },
    items: [
      { kind: 'svg', svg: 'coin', sym: 'x', size: 44 },
      { kind: 'svg', svg: 'star', size: 40 },
      { kind: 'token', label: 'x + y', size: 48 },
      { kind: 'svg', svg: 'coin', sym: 'Rp', size: 46 },
      { kind: 'token', label: '=', size: 38 },
      { kind: 'svg', svg: 'star', size: 36 }
    ]
  }
];
