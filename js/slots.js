// js/slots.js — Sistem Sentral "Slot Gambar" Algebra-Mart
import { SITE_CONFIG } from './config.js';
import { TEAM, VALIDATORS } from './content.js';
import { renderIcon } from './ui/icons.js';
import { SLOT_MANIFEST } from './slot-manifest.js';

export function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg', '.svg'];

// Daftar statis slot sistem
const BASE_SLOTS = [
  // 1. Hero Screenshots (16:9, 1920x1080)
  { id: 'hero-1', bagian: 'Hero', folder: 'assets/img/hero', namaBerkas: 'hero-1', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Pratinjau Layar Buat Profil Kasir Baru', wajib: true },
  { id: 'hero-2', bagian: 'Hero', folder: 'assets/img/hero', namaBerkas: 'hero-2', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Pratinjau Layar Profil Kasir & ID Card', wajib: true },
  { id: 'hero-3', bagian: 'Hero', folder: 'assets/img/hero', namaBerkas: 'hero-3', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Pratinjau Layar Peta Pilihan Tantangan Level', wajib: true },
  { id: 'hero-4', bagian: 'Hero', folder: 'assets/img/hero', namaBerkas: 'hero-4', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Pratinjau Layar Pengenalan Konsep Aljabar Kasir', wajib: true },
  { id: 'hero-5', bagian: 'Hero', folder: 'assets/img/hero', namaBerkas: 'hero-5', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Pratinjau Layar Transaksi Pesanan Pelanggan Aktif', wajib: true },

  // 2. Cara Bermain (6 Langkah Utama, 16:9, 1920x1080)
  { id: 'langkah-01', bagian: 'Cara Bermain', folder: 'assets/img/langkah', namaBerkas: 'langkah-01', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah 1: Pilih Platform & Buka Gim', wajib: true },
  { id: 'langkah-02', bagian: 'Cara Bermain', folder: 'assets/img/langkah', namaBerkas: 'langkah-02', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah 2: Gerbang Toko & Mulai Permainan', wajib: true },
  { id: 'langkah-03', bagian: 'Cara Bermain', folder: 'assets/img/langkah', namaBerkas: 'langkah-03', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah 3: Tambah Profil Kasir Baru', wajib: true },
  { id: 'langkah-04', bagian: 'Cara Bermain', folder: 'assets/img/langkah', namaBerkas: 'langkah-04', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah 4: Profil Kasir & Mode Kelas', wajib: true },
  { id: 'langkah-05', bagian: 'Cara Bermain', folder: 'assets/img/langkah', namaBerkas: 'langkah-05', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah 5: Pilih Tantangan (Level 0 Pengantar)', wajib: true },
  { id: 'langkah-06', bagian: 'Cara Bermain', folder: 'assets/img/langkah', namaBerkas: 'langkah-06', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah 6: Layani Pesanan & Susun Rumus Aljabar', wajib: true },

  // 3. Panduan Guru & Fasilitator (5 Langkah, 16:9, 1920x1080)
  { id: 'guru-01', bagian: 'Panduan Guru', folder: 'assets/img/guru', namaBerkas: 'guru-01', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah Guru 1: Buka Pengaturan di Layar Login', wajib: true },
  { id: 'guru-02', bagian: 'Panduan Guru', folder: 'assets/img/guru', namaBerkas: 'guru-02', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah Guru 2: Masukkan PIN Fasilitator (1234)', wajib: true },
  { id: 'guru-03', bagian: 'Panduan Guru', folder: 'assets/img/guru', namaBerkas: 'guru-03', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah Guru 3: Buat Sesi Kelas Online di Ruang Fasilitator', wajib: true },
  { id: 'guru-04', bagian: 'Panduan Guru', folder: 'assets/img/guru', namaBerkas: 'guru-04', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah Guru 4: Siswa Bergabung Memasukkan Kode Ruang', wajib: true },
  { id: 'guru-05', bagian: 'Panduan Guru', folder: 'assets/img/guru', namaBerkas: 'guru-05', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Langkah Guru 5: Pantau Statistik Kelas, EWS, dan Laporan', wajib: true },

  // 4. Galeri Mode Kelas
  { id: 'kelas-preview', bagian: 'Mode Kelas', folder: 'assets/img/kelas', namaBerkas: 'kelas-preview', rasio: '16:9', lebar: 1920, tinggi: 1080, ukuranDisarankan: '1920×1080 px', alt: 'Pratinjau Suasana Pembelajaran Mode Kelas', wajib: false },

  // 5. Identitas Visual & Logo
  { id: 'logo-algebra-mart', bagian: 'Identitas & Logo', folder: 'assets/logo', namaBerkas: 'logo-algebra-mart', rasio: '1:1', lebar: 512, tinggi: 512, ukuranDisarankan: '512×512 px', alt: 'Logo Resmi Algebra-Mart', wajib: true, fallbackType: 'coin' },
  { id: 'logo-algebra-mart-horizontal', bagian: 'Identitas & Logo', folder: 'assets/logo', namaBerkas: 'logo-algebra-mart-horizontal', rasio: '3:1', lebar: 600, tinggi: 200, ukuranDisarankan: '600×200 px', alt: 'Logo Horizontal Algebra-Mart', wajib: false },
  { id: 'logo-tim', bagian: 'Identitas & Logo', folder: 'assets/logo', namaBerkas: 'logo-tim', rasio: '1:1', lebar: 512, tinggi: 512, ukuranDisarankan: '512×512 px', alt: 'Logo Tim Pengembang Algebra-Mart', wajib: true, fallbackType: 'badge' },
  { id: 'logo-kampus', bagian: 'Identitas & Logo', folder: 'assets/logo', namaBerkas: 'logo-kampus', rasio: '1:1', lebar: 512, tinggi: 512, ukuranDisarankan: '512×512 px', alt: 'Logo Universitas Jambi', wajib: true, fallbackType: 'badge' },
  { id: 'logo-lidm', bagian: 'Identitas & Logo', folder: 'assets/logo', namaBerkas: 'logo-lidm', rasio: '1:1', lebar: 512, tinggi: 512, ukuranDisarankan: '512×512 px', alt: 'Logo LIDM 2026', wajib: true, fallbackType: 'badge' },
  { id: 'favicon', bagian: 'Identitas & Logo', folder: 'assets/logo', namaBerkas: 'favicon', rasio: '1:1', lebar: 512, tinggi: 512, ukuranDisarankan: '512×512 px', alt: 'Favicon Browser Algebra-Mart', wajib: false },

  // 6. Media Sosial (Open Graph)
  { id: 'og-image', bagian: 'SEO & Medsos', folder: 'assets/img/og', namaBerkas: 'og-image', rasio: '1.91:1', lebar: 1200, tinggi: 630, ukuranDisarankan: '1200×630 px', alt: 'Thumbnail Pratinjau Sosial Algebra-Mart', wajib: true },

  // 7. Dokumen & Buku Instruksi (3:4, 900x1200)
  { id: 'buku-sampul', bagian: 'Dokumen', folder: 'assets/img/buku', namaBerkas: 'sampul', rasio: '3:4', lebar: 900, tinggi: 1200, ukuranDisarankan: '900×1200 px', alt: 'Sampul Buku Instruksi Algebra-Mart', wajib: false }
];

/**
 * Menghasilkan daftar lengkap slot dengan foto tim dan validator dari data dinamis.
 * @returns {Array<object>}
 */
export function getAllSlots() {
  const dynamicSlots = [];

  // Slot Foto Anggota Tim (otomatis dari TEAM di content.js)
  (TEAM || []).forEach(member => {
    const slug = slugify(member.name);
    dynamicSlots.push({
      id: `tim-${slug}`,
      bagian: 'Tim Pengembang',
      folder: 'assets/tim',
      namaBerkas: slug,
      rasio: '1:1',
      lebar: 800,
      tinggi: 800,
      ukuranDisarankan: '800×800 px',
      alt: `Foto Profil ${member.name} (${member.role})`,
      wajib: true,
      fallbackType: 'initials',
      initials: member.name.split(' ').slice(0, 2).map(n => n[0]).join('')
    });
  });

  // Slot Foto Validator / Dosen Pembimbing (otomatis dari VALIDATORS)
  (VALIDATORS || []).forEach(val => {
    const slug = slugify(val.name);
    dynamicSlots.push({
      id: `validator-${slug}`,
      bagian: 'Pembimbing & Validator',
      folder: 'assets/validator',
      namaBerkas: slug,
      rasio: '1:1',
      lebar: 800,
      tinggi: 800,
      ukuranDisarankan: '800×800 px',
      alt: `Foto Profil ${val.name} (${val.role})`,
      wajib: true,
      fallbackType: 'initials',
      initials: val.name.replace(/^(Dr\.|Prof\.|Ibu|Pak)\s+/i, '').split(' ').slice(0, 2).map(n => n[0]).join('')
    });
  });

  return [...BASE_SLOTS, ...dynamicSlots];
}

/**
 * Memeriksa apakah kerangka slot kosong harus ditampilkan.
 * Parameter URL ?slots=1 memaksa tampil, ?slots=0 memaksa sembunyi.
 */
export function shouldShowEmptySlots() {
  if (typeof window !== 'undefined' && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('slots') === '1') return true;
    if (params.get('slots') === '0') return false;
  }
  return SITE_CONFIG.showEmptySlots !== false;
}

/**
 * Merender markup HTML kerangka kosong (empty frame) untuk sebuah slot.
 * @param {object} slot
 * @returns {string}
 */
export function renderEmptyFrame(slot) {
  const pathExample = `${slot.folder}/${slot.namaBerkas}.png`;
  return `
    <div class="slot-empty-frame" style="aspect-ratio:${slot.rasio.replace(':', '/')};">
      <div class="slot-empty-frame__icon">${renderIcon('image', { size: 36 })}</div>
      <p class="slot-empty-frame__title">Tempatkan gambar di sini</p>
      <div class="slot-empty-frame__meta">
        <code class="slot-empty-frame__path">${pathExample}</code>
        <span class="slot-empty-frame__size">Ukuran: ${slot.ukuranDisarankan} (${slot.rasio})</span>
      </div>
    </div>
  `;
}

/**
 * Merender elemen <figure data-slot="id"> awal.
 * @param {string} slotId
 * @param {object} [opts]
 * @returns {string}
 */
export function renderSlot(slotId, { className = '' } = {}) {
  const allSlots = getAllSlots();
  const slot = allSlots.find(s => s.id === slotId);
  if (!slot) return '';

  const showFrame = shouldShowEmptySlots();
  return `
    <figure class="slot-container ${className}" data-slot="${slot.id}" data-folder="${slot.folder}" data-file="${slot.namaBerkas}" data-ratio="${slot.rasio}" data-width="${slot.lebar}" data-height="${slot.tinggi}" data-alt="${slot.alt}" data-fallback="${slot.fallbackType || 'frame'}" style="aspect-ratio:${slot.rasio.replace(':', '/')};">
      ${showFrame ? renderEmptyFrame(slot) : '<div class="slot-hidden-placeholder"></div>'}
    </figure>
  `;
}

/**
 * Mencoba memuat berkas gambar dengan urutan ekstensi [.webp, .png, .jpg, .jpeg, .svg].
 * @param {string} basePath Path dasar tanpa ekstensi (mis. 'assets/img/langkah/langkah-01')
 * @returns {Promise<string|null>} URL yang berhasil termuat atau null bila tidak ada.
 */
export function probeImage(basePath) {
  return new Promise((resolve) => {
    let index = 0;
    function tryNext() {
      if (index >= EXTENSIONS.length) {
        resolve(null);
        return;
      }
      const ext = EXTENSIONS[index++];
      const url = `${basePath}${ext}`;
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => tryNext();
      img.src = url;
    }
    tryNext();
  });
}

/**
 * Memindai seluruh <figure data-slot> di dalam elemen root dan mengisi gambar bila berkas ada.
 * @param {HTMLElement} [root=document]
 */
export async function resolveSlots(root = document) {
  const figures = root.querySelectorAll('figure[data-slot]');
  const showFrame = shouldShowEmptySlots();

  for (const fig of figures) {
    const slotId = fig.getAttribute('data-slot');
    const folder = fig.getAttribute('data-folder');
    const file = fig.getAttribute('data-file');
    const alt = fig.getAttribute('data-alt') || '';
    const width = fig.getAttribute('data-width') || '1920';
    const height = fig.getAttribute('data-height') || '1080';
    const fallbackType = fig.getAttribute('data-fallback');

    const basePath = `${folder}/${file}`;
    let foundUrl = (typeof SLOT_MANIFEST !== 'undefined' && SLOT_MANIFEST[slotId]) ? SLOT_MANIFEST[slotId] : null;
    if (!foundUrl && typeof SLOT_MANIFEST === 'undefined') {
      foundUrl = await probeImage(basePath);
    }

    if (foundUrl) {
      fig.innerHTML = `<img src="${foundUrl}" alt="${alt}" width="${width}" height="${height}" loading="lazy" class="slot-image" />`;
      const imgEl = fig.querySelector('img');
      if (imgEl) {
        imgEl.addEventListener('error', () => {
          fig.classList.remove('is-filled');
          fig.classList.add('is-empty');
          if (showFrame) {
            fig.innerHTML = renderEmptyFrame({
              folder,
              namaBerkas: file,
              rasio: fig.getAttribute('data-ratio') || '16:9',
              ukuranDisarankan: `${width}×${height} px`
            });
          } else if (fallbackType !== 'coin' && fallbackType !== 'initials') {
            fig.style.display = 'none';
          }
        }, { once: true });
      }
      fig.classList.add('is-filled');
      fig.classList.remove('is-empty');
    } else {
      fig.classList.add('is-empty');
      fig.classList.remove('is-filled');

      if (!showFrame) {
        // Mode sembunyi frame: bila ada fallback koin/inisial gunakan itu, atau sembunyikan figure
        if (fallbackType === 'coin' || fallbackType === 'initials') {
          // Tetap gunakan rendering cadangan
        } else {
          fig.style.display = 'none';
        }
      }
    }
  }
}
