// js/ui/bukuInstruksi.js — Kartu Unduh & Baca Online Buku Instruksi & Modul Ajar Algebra-Mart
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { renderIcon } from './icons.js';
import { renderSlot, resolveSlots, shouldShowEmptySlots } from '../slots.js';
import { esc } from '../utils/safe.js';

function formatBytesToMB(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1).replace('.', ',')} MB`;
}

/**
 * Merender sampul buku CSS bila berkas sampul belum diunggah dan showEmptySlots = false.
 */
function renderCssBookCover(title, isModul = false) {
  return `
    <div class="buku-cover-css" aria-label="Sampul ${esc(title)}" style="${isModul ? 'background:linear-gradient(145deg, #064e3b 0%, #022c22 100%)' : ''}">
      <div class="buku-cover-css__inner">
        <div class="buku-cover-css__spine"></div>
        <div class="buku-cover-css__body">
          <div class="buku-cover-css__brand">
            <img src="assets/logo/logo-algebra-mart.png" alt="Logo" width="48" height="48" class="buku-cover-css__logo" onerror="this.style.display='none'">
            <span class="buku-cover-css__tag">${isModul ? 'MODUL AJAR SMP' : 'ALGEBRA-MART'}</span>
          </div>
          <div class="buku-cover-css__title-group">
            <h4 class="buku-cover-css__title">${isModul ? 'MODUL AJAR' : 'BUKU INSTRUKSI'}</h4>
            <p class="buku-cover-css__subtitle">${isModul ? 'RPP · Materi Ajar · Soal' : 'Panduan Penggunaan Lengkap'}</p>
          </div>
          <div class="buku-cover-css__foot">
            <span class="buku-cover-css__edition">Edisi 2026 · Kurikulum Merdeka</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function initBukuInstruksi() {
  const container = document.getElementById('buku-instruksi-container');
  if (!container) return;

  const bukuConfig = SITE_CONFIG.dokumen?.bukuInstruksi || {
    berkas: 'assets/dokumen/buku-instruksi-algebra-mart.pdf',
    bacaOnlineUrl: 'https://heyzine.com/flip-book/52f4274171.html',
    judul: 'Buku Instruksi Algebra-Mart',
    deskripsi: 'Panduan lengkap penggunaan Algebra-Mart mulai dari instalasi, navigasi antarmuka, hingga petunjuk bermain setiap mode.',
    namaUnduh: 'Buku-Instruksi-Algebra-Mart.pdf',
    versi: ''
  };

  const modulConfig = SITE_CONFIG.dokumen?.modulAjar || {
    berkas: 'assets/dokumen/modul-ajar-algebra-mart.pdf',
    bacaOnlineUrl: 'https://heyzine.com/flip-book/d04c34bbc6.html',
    judul: 'Modul Ajar Gim Algebra-Mart',
    deskripsi: 'Perangkat ajar Matematika SMP Fase D Kelas VIII (Bentuk & Operasi Aljabar) memuat RPP Deep Learning (PBL), Materi Ajar, Asesmen, dan Lembar Soal Evaluasi.',
    namaUnduh: 'Modul-Ajar-Algebra-Mart.pdf',
    versi: ''
  };

  // 1. Buku Instruksi Details
  const bukuPath = bukuConfig.berkas || 'assets/dokumen/buku-instruksi-algebra-mart.pdf';
  const bukuQuery = bukuConfig.versi ? `?v=${encodeURIComponent(bukuConfig.versi)}` : '';
  const bukuFileUrl = `${bukuPath}${bukuQuery}`;
  const bukuDownloadName = bukuConfig.namaUnduh || 'Buku-Instruksi-Algebra-Mart.pdf';
  const bukuTitle = bukuConfig.judul || 'Buku Instruksi Algebra-Mart';
  const bukuDesc = bukuConfig.deskripsi || 'Panduan lengkap penggunaan Algebra-Mart mulai dari instalasi, navigasi antarmuka, hingga petunjuk bermain setiap mode.';
  const bukuBacaOnlineUrl = (bukuConfig.bacaOnlineUrl || '').trim();
  const isBukuBacaOnlineValid = isValidUrl(bukuBacaOnlineUrl);

  // 2. Modul Ajar Details
  const modulPath = modulConfig.berkas || 'assets/dokumen/modul-ajar-algebra-mart.pdf';
  const modulQuery = modulConfig.versi ? `?v=${encodeURIComponent(modulConfig.versi)}` : '';
  const modulFileUrl = `${modulPath}${modulQuery}`;
  const modulDownloadName = modulConfig.namaUnduh || 'Modul-Ajar-Algebra-Mart.pdf';
  const modulTitle = modulConfig.judul || 'Modul Ajar Gim Algebra-Mart';
  const modulDesc = modulConfig.deskripsi || 'Perangkat ajar Matematika SMP Fase D Kelas VIII (Bentuk & Operasi Aljabar) memuat RPP Deep Learning (PBL), Materi Ajar, Asesmen, dan Lembar Soal Evaluasi.';
  const modulBacaOnlineUrl = (modulConfig.bacaOnlineUrl || 'https://heyzine.com/flip-book/d04c34bbc6.html').trim();
  const isModulBacaOnlineValid = isValidUrl(modulBacaOnlineUrl);

  // Status awal file & ukuran
  let bukuSizeMB = '1,0 MB';
  let modulSizeMB = '1,1 MB';

  try {
    const [resBuku, resModul] = await Promise.all([
      fetch(bukuFileUrl, { method: 'HEAD' }).catch(() => null),
      fetch(modulFileUrl, { method: 'HEAD' }).catch(() => null)
    ]);
    if (resBuku && resBuku.status === 200) {
      const len = parseInt(resBuku.headers.get('content-length'), 10);
      if (len && !isNaN(len)) bukuSizeMB = formatBytesToMB(len);
    }
    if (resModul && resModul.status === 200) {
      const len = parseInt(resModul.headers.get('content-length'), 10);
      if (len && !isNaN(len)) modulSizeMB = formatBytesToMB(len);
    }
  } catch (err) {
    // Fallback ukuran statis aman saat offline/file://
  }

  const bukuCoverHtml = renderSlot('buku-sampul', { className: 'buku-slot' });
  const modulCoverHtml = renderSlot('modul-sampul', { className: 'buku-slot' });

  container.innerHTML = `
    <div class="buku-shelf-section">
      <!-- Judul Rak Dokumen -->
      <div class="section-head text-center reveal" style="margin-bottom:2.2rem">
        <span class="badge-pill">
          <img class="badge-pill__logo" src="assets/logo/logo-algebra-mart.png" alt="Logo Algebra-Mart" width="20" height="20" decoding="async" onerror="this.hidden=true">
          Dokumen &amp; Perangkat Pembelajaran
        </span>
        <h3 style="font:900 2rem var(--font-display);color:var(--am-brown-900);margin:.5rem 0 .4rem">Buku Instruksi &amp; Modul Ajar Resmi</h3>
        <p style="font-size:1.02rem;color:var(--am-brown-800);max-width:680px;margin:0 auto">Pelajari panduan teknis permainan secara menyeluruh atau unduh modul ajar Matematika SMP berbasis Deep Learning (PBL) untuk implementasi di kelas.</p>
      </div>

      <!-- Grid Rak 2 Dokumen Berdampingan -->
      <div class="buku-shelf-grid">
        <!-- KARTU 1: BUKU INSTRUKSI (MANUAL BOOK) -->
        <article class="buku-card book-3d-display card reveal" id="buku-instruksi" data-reveal="shelf" style="--shelf-rot:-1.2deg" aria-labelledby="buku-title">
          <div class="buku-card__grid">
            <!-- Kolom Kiri: Sampul Buku 3D -->
            <div class="buku-card__cover book-3d-cover-wrap">
              <div class="book-3d-cover">
                ${bukuCoverHtml}
              </div>
            </div>

            <!-- Kolom Kanan: Detail & Tombol Aksi -->
            <div class="buku-card__info">
              <div class="buku-card__header">
                <span class="chip chip--green buku-chip">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  <span>Buku Panduan Gim</span>
                </span>
                <span class="buku-meta-badge" aria-label="Format berkas PDF ukuran ${bukuSizeMB}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>PDF · ${esc(bukuSizeMB)}</span>
                </span>
              </div>

              <h3 class="buku-card__title" id="buku-title">${esc(bukuTitle)}</h3>
              <p class="buku-card__desc">${esc(bukuDesc)}</p>

              <div class="buku-card__actions">
                <a href="${esc(bukuFileUrl)}" download="${esc(bukuDownloadName)}" class="btn btn--gold buku-btn-unduh" type="application/pdf" rel="noopener" data-fx="cta magnetic" data-burst aria-label="Unduh Buku Instruksi Algebra-Mart format PDF" style="min-height:44px">
                  ${renderIcon('download', { size: 18 })}
                  <span>Unduh Buku (PDF)</span>
                </a>
                ${isBukuBacaOnlineValid ? `
                  <a href="${esc(bukuBacaOnlineUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary buku-btn-baca" data-fx="cta magnetic" data-burst aria-label="Baca Buku Instruksi online (membuka tab baru)" style="min-height:44px;min-width:44px">
                    <svg class="am-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    <span>Baca Online</span>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        </article>

        <!-- KARTU 2: MODUL AJAR (MODUL BELAJAR) -->
        <article class="buku-card book-3d-display card reveal" id="modul-ajar" data-reveal="shelf" style="--shelf-rot:1.2deg" aria-labelledby="modul-title">
          <div class="buku-card__grid">
            <!-- Kolom Kiri: Sampul Modul 3D -->
            <div class="buku-card__cover book-3d-cover-wrap">
              <div class="book-3d-cover">
                ${modulCoverHtml}
              </div>
            </div>

            <!-- Kolom Kanan: Detail & Tombol Aksi -->
            <div class="buku-card__info">
              <div class="buku-card__header">
                <span class="chip chip--gold buku-chip" style="background:#fef3c7;color:#78350f;border:1.5px solid #d97706">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  <span>Perangkat Ajar · RPP &amp; Soal</span>
                </span>
                <span class="buku-meta-badge" aria-label="Format berkas PDF ukuran ${modulSizeMB}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>PDF · ${esc(modulSizeMB)}</span>
                </span>
              </div>

              <h3 class="buku-card__title" id="modul-title">${esc(modulTitle)}</h3>
              <p class="buku-card__desc">${esc(modulDesc)}</p>

              <div class="buku-card__actions">
                <a href="${esc(modulFileUrl)}" download="${esc(modulDownloadName)}" class="btn btn--gold buku-btn-unduh" type="application/pdf" rel="noopener" data-fx="cta magnetic" data-burst aria-label="Unduh Modul Ajar Gim Algebra-Mart format PDF" style="min-height:44px">
                  ${renderIcon('download', { size: 18 })}
                  <span>Unduh Modul (PDF)</span>
                </a>
                ${isModulBacaOnlineValid ? `
                  <a href="${esc(modulBacaOnlineUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary buku-btn-baca" data-fx="cta magnetic" data-burst aria-label="Baca Modul Ajar online (membuka tab baru)" style="min-height:44px;min-width:44px">
                    <svg class="am-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    <span>Baca Online</span>
                  </a>
                ` : ''}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  `;

  // Resolusi slot sampul
  await resolveSlots(container);

  // Fallback sampul CSS bila gambar belum terisi dan frame dimatikan
  const figBuku = container.querySelector('figure[data-slot="buku-sampul"]');
  if (figBuku && figBuku.classList.contains('is-empty') && !shouldShowEmptySlots()) {
    figBuku.innerHTML = renderCssBookCover(bukuTitle, false);
    figBuku.style.display = 'block';
  }
  const figModul = container.querySelector('figure[data-slot="modul-sampul"]');
  if (figModul && figModul.classList.contains('is-empty') && !shouldShowEmptySlots()) {
    figModul.innerHTML = renderCssBookCover(modulTitle, true);
    figModul.style.display = 'block';
  }

  // Hook scroll halus untuk semua tautan ke #buku-instruksi dan #modul-ajar
  document.querySelectorAll('a[href="#buku-instruksi"], a[href="#modul-ajar"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const targetId = href ? href.substring(1) : 'buku-instruksi';
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('buku-card--highlight');
        setTimeout(() => target.classList.remove('buku-card--highlight'), 1800);
      }
    });
  });

  // Sinkronisasi tautan footer Baca Online
  document.querySelectorAll('a.footer__link-baca-online').forEach(el => {
    if (isBukuBacaOnlineValid) {
      el.href = bukuBacaOnlineUrl;
    }
  });
  document.querySelectorAll('a.footer__link-baca-online-modul').forEach(el => {
    if (isModulBacaOnlineValid) {
      el.href = modulBacaOnlineUrl;
    }
  });
}
