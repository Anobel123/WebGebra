// js/ui/icons.js — Pustaka Ikon SVG Inline Lokal (Bebas FontAwesome / CDN)
// Semua ikon dirender sebagai SVG inline dengan ukuran, warna, dan fallback yang aman.

const SVG_ICONS = {
  // Brand & Navigasi
  'store': '<path d="M3 9l1-5h16l1 5M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 21V12h6v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'play': '<path d="M6 4l14 8-14 8V4z" fill="currentColor"/>',
  'pause': '<path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor"/>',
  'gear': '<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2" fill="none"/>',
  'key': '<path d="M21 2l-2 2m-1.5 1.5L14 9l2 2-1 1-2-2-2 2 2 2-1.5 1.5M7 14a5 5 0 110-10 5 5 0 010 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'user': '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>',
  'user-plus': '<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M20 8v6M23 11h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  'gamepad': '<rect x="2" y="6" width="20" height="12" rx="6" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 12h4m-2-2v4m10-2h.01m-3 2h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  'book-open': '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'cash-register': '<path d="M4 4h16v12H4zM2 16h20v4H2zM6 8h4M14 8h4M6 12h2M10 12h2M14 12h2M18 12h0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  'star': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>',
  'star-outline': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'award': '<circle cx="12" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'trophy': '<path d="M6 9H3a2 2 0 01-2-2V4a2 2 0 012-2h3M18 9h3a2 2 0 002-2V4a2 2 0 00-2-2h-3M4 2h16v7a8 8 0 01-16 0V2zm8 15v4m-4 0h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'lightbulb': '<path d="M9 18h6m-4 4h2M12 2a7 7 0 00-4 12.7V17a1 1 0 001 1h6a1 1 0 001-1v-2.3A7 7 0 0012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'receipt': '<path d="M4 2v20l3-2 3 2 3-2 3 2 4-2V2l-4 2-3-2-3 2-3-2-3 2zM8 7h8M8 11h8M8 15h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'graduation-cap': '<path d="M22 10L12 5 2 10l10 5 10-5zm-2 5.5v4.5M6 12.5v5c0 3 3 5 6 5s6-2 6-5v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'chalkboard-user': '<rect x="2" y="3" width="20" height="13" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="18" r="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 22c0-2 2-3 4-3s4 1 4 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  'laptop-code': '<rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 10l-2 2 2 2m8-4l2 2-2 2m-5-4l-2 4M1 20h22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'circle-check': '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'rotate-right': '<path d="M21.5 2v6h-6M21.34 15.57a9 9 0 11-.57-8.38l.67-.79" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'arrow-left': '<path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'arrow-right': '<path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'share-nodes': '<circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98" stroke="currentColor" stroke-width="2" fill="none"/>',
  'route': '<circle cx="6" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 19h8.5a4.5 4.5 0 000-9H7a4 4 0 010-8h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/>',
  'link': '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>',
  'image': '<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  'google-play': '<path d="M4 2v20l11-10L4 2z" fill="#34d399"/><path d="M15 12l3.5-3.5 2.5 1.5c1 .6 1 1.8 0 2.4l-2.5 1.5L15 12z" fill="#fbbf24"/><path d="M4 2l14.5 8.5-3.5 1.5L4 2z" fill="#60a5fa"/><path d="M4 22l14.5-8.5-3.5-1.5L4 22z" fill="#f87171"/>',
  'whatsapp': '<path d="M17.5 6.5A7.8 7.8 0 0012 4.2C7.7 4.2 4.2 7.7 4.2 12c0 1.4.4 2.7 1 3.9L4 20l4.2-1.1c1.1.6 2.4.9 3.8.9 4.3 0 7.8-3.5 7.8-7.8 0-2.1-.8-4-2.3-5.5zM12 18.5c-1.2 0-2.3-.3-3.3-.9l-.2-.1-2.5.7.7-2.4-.2-.3a6.5 6.5 0 1111.8-3.5c0 3.6-2.9 6.5-6.5 6.5zm3.6-4.9c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.8-.1.1-.2.2-.4.1-.2-.1-.8-.3-1.6-1-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.1-.2.2-.3 0-.1 0-.3 0-.4 0-.1-.4-1-.6-1.4-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.3.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.4-.3z" fill="currentColor"/>',
  'telegram': '<path d="M21.5 3.5L2.8 10.7c-1.3.5-1.3 1.3-.2 1.6l4.8 1.5 1.8 5.6c.2.6.5.8.9.8.4 0 .6-.2.8-.4l2.4-2.3 5 3.7c.9.5 1.6.2 1.9-.9l3.3-15.6c.3-1.3-.5-1.9-1.5-1.2zM8.8 13.5l9.2-5.8c.5-.3.9-.1.5.2l-7.9 7.1-.3 3.6-1.5-5.1z" fill="currentColor"/>'
};

/**
 * Merender ikon SVG inline lokal.
 * @param {string} name Nama ikon (mis. 'store', 'star', 'whatsapp')
 * @param {object} [opts]
 * @param {number} [opts.size=20] Ukuran lebar & tinggi dalam px
 * @param {string} [opts.className=''] Kelas CSS tambahan
 * @param {string} [opts.ariaLabel=''] Label aksesibilitas
 * @returns {string} Markup SVG inline
 */
export function renderIcon(name, { size = 20, className = '', ariaLabel = '' } = {}) {
  const cleanName = (name || '').replace(/^(fa-(solid|brands|regular)\s+)?fa-/, '').trim();
  const inner = SVG_ICONS[cleanName];

  if (inner) {
    const aria = ariaLabel ? `role="img" aria-label="${ariaLabel}"` : 'aria-hidden="true"';
    return `<svg class="am-icon am-icon--${cleanName} ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" ${aria}>${inner}</svg>`;
  }

  // Fallback anggun jika ikon tidak dikenal: lingkaran mini dengan huruf pertama
  const fallbackChar = cleanName ? cleanName.charAt(0).toUpperCase() : '•';
  return `<svg class="am-icon am-icon--fallback ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-size="12" font-weight="900" fill="currentColor">${fallbackChar}</text></svg>`;
}

export default { renderIcon };

