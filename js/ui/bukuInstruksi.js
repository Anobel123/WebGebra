// js/ui/bukuInstruksi.js — Kartu Unduh & Baca Online Buku Instruksi Algebra-Mart
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
function renderCssBookCover(title) {
  return `
    <div class="buku-cover-css" aria-label="Sampul ${esc(title)}">
      <div class="buku-cover-css__inner">
        <div class="buku-cover-css__spine"></div>
        <div class="buku-cover-css__body">
          <div class="buku-cover-css__brand">
            <img src="assets/logo/logo-algebra-mart.png" alt="Logo" width="48" height="48" class="buku-cover-css__logo" onerror="this.style.display='none'">
            <span class="buku-cover-css__tag">ALGEBRA-MART</span>
          </div>
          <div class="buku-cover-css__title-group">
            <h4 class="buku-cover-css__title">BUKU INSTRUKSI</h4>
            <p class="buku-cover-css__subtitle">Panduan Penggunaan Lengkap</p>
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

  const docConfig = SITE_CONFIG.dokumen?.bukuInstruksi || {
    berkas: 'assets/dokumen/buku-instruksi-algebra-mart.pdf',
    judul: 'Buku Instruksi Algebra-Mart',
    deskripsi: 'Panduan lengkap penggunaan Algebra-Mart mulai dari instalasi, navigasi antarmuka, hingga petunjuk bermain setiap mode.',
    namaUnduh: 'Buku-Instruksi-Algebra-Mart.pdf',
    versi: ''
  };

  const berkasPath = docConfig.berkas || 'assets/dokumen/buku-instruksi-algebra-mart.pdf';
  const queryParam = docConfig.versi ? `?v=${encodeURIComponent(docConfig.versi)}` : '';
  const fileUrl = `${berkasPath}${queryParam}`;
  const downloadName = docConfig.namaUnduh || 'Buku-Instruksi-Algebra-Mart.pdf';
  const title = docConfig.judul || 'Buku Instruksi Algebra-Mart';
  const desc = docConfig.deskripsi || 'Panduan lengkap penggunaan Algebra-Mart mulai dari instalasi, navigasi antarmuka, hingga petunjuk bermain setiap mode.';
  const bacaOnlineUrl = (docConfig.bacaOnlineUrl || '').trim();
  const isBacaOnlineValid = isValidUrl(bacaOnlineUrl);

  // Status awal file: 'loading', 'available', 'not-found', 'offline'
  let fileStatus = 'offline';
  let fileSizeMB = '';

  try {
    const res = await fetch(fileUrl, { method: 'HEAD' });
    if (res.status === 200) {
      fileStatus = 'available';
      const len = parseInt(res.headers.get('content-length'), 10);
      if (len && !isNaN(len)) {
        fileSizeMB = formatBytesToMB(len);
      }
    } else if (res.status === 404) {
      fileStatus = 'not-found';
    } else {
      fileStatus = 'offline';
    }
  } catch (err) {
    // Terjadi saat dibuka lewat file:// atau koneksi terputus; degradasi anggun tanpa error console
    fileStatus = 'offline';
  }

  const coverHtml = renderSlot('buku-sampul', { className: 'buku-slot' });

  const isAvailable = fileStatus === 'available' || fileStatus === 'offline';
  const metaLabel = fileSizeMB ? `PDF · ${fileSizeMB}` : 'PDF';
  const ariaUnduh = fileSizeMB
    ? `Unduh Buku Instruksi Algebra-Mart (format PDF, ukuran ${fileSizeMB})`
    : 'Unduh Buku Instruksi Algebra-Mart (format PDF)';

  container.innerHTML = `
    <article class="buku-card card card--tilt reveal" id="buku-instruksi" data-reveal="zoom" data-fx="tilt" aria-labelledby="buku-title">
      <div class="buku-card__grid">
        <!-- Kolom Kiri: Sampul Buku (Slot / CSS) -->
        <div class="buku-card__cover">
          ${coverHtml}
        </div>

        <!-- Kolom Kanan: Detail & Tombol Aksi -->
        <div class="buku-card__info">
          <div class="buku-card__header">
            <span class="chip chip--green buku-chip">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span>Dokumen Resmi</span>
            </span>
            ${fileStatus === 'available' ? `
              <span class="buku-meta-badge" aria-label="Format berkas ${metaLabel}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>${esc(metaLabel)}</span>
              </span>
            ` : fileStatus === 'not-found' ? `
              <span class="chip chip--gray">Segera Hadir</span>
            ` : `
              <span class="buku-meta-badge"><span>PDF</span></span>
            `}
          </div>

          <h3 class="buku-card__title" id="buku-title">${esc(title)}</h3>
          <p class="buku-card__desc">${esc(desc)}</p>

          ${fileStatus === 'not-found' ? `
            <div class="buku-card__notice" role="status">
              <p>Berkas PDF sedang disiapkan dan akan segera tersedia untuk diunduh.</p>
            </div>
            <div class="buku-card__actions">
              <button type="button" class="btn btn--disabled" disabled aria-disabled="true" style="min-height:44px">
                ${renderIcon('download', { size: 18 })}
                <span>Unduh Buku (Segera Hadir)</span>
              </button>
              ${isBacaOnlineValid ? `
                <a href="${esc(bacaOnlineUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary buku-btn-baca" data-fx="cta magnetic" data-burst aria-label="Baca Buku Instruksi online (membuka tab baru)" style="min-height:44px;min-width:44px">
                  <svg class="am-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  <span>Baca Online</span>
                </a>
              ` : ''}
            </div>
          ` : `
            <div class="buku-card__actions">
              <a href="${esc(fileUrl)}" download="${esc(downloadName)}" class="btn btn--gold buku-btn-unduh" type="application/pdf" rel="noopener" data-fx="cta magnetic" data-burst aria-label="${esc(ariaUnduh)}" style="min-height:44px">
                ${renderIcon('download', { size: 18 })}
                <span>Unduh Buku (PDF)</span>
              </a>
              ${isBacaOnlineValid ? `
                <a href="${esc(bacaOnlineUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary buku-btn-baca" data-fx="cta magnetic" data-burst aria-label="Baca Buku Instruksi online (membuka tab baru)" style="min-height:44px;min-width:44px">
                  <svg class="am-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  <span>Baca Online</span>
                </a>
              ` : ''}
            </div>
          `}
        </div>
      </div>
    </article>
  `;

  // Resolusi slot sampul
  await resolveSlots(container);
  const figCover = container.querySelector('figure[data-slot="buku-sampul"]');
  if (figCover && figCover.classList.contains('is-empty') && !shouldShowEmptySlots()) {
    figCover.innerHTML = renderCssBookCover(title);
    figCover.style.display = 'block';
  }

  // Hook scroll halus untuk semua tautan ke #buku-instruksi
  document.querySelectorAll('a[href="#buku-instruksi"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('buku-instruksi');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('buku-card--highlight');
        setTimeout(() => target.classList.remove('buku-card--highlight'), 1800);
      }
    });
  });

  // Sinkronisasi tautan footer Baca Online
  document.querySelectorAll('a.footer__link-baca-online').forEach(el => {
    if (isBacaOnlineValid) {
      el.href = bacaOnlineUrl;
    } else {
      el.closest('li')?.remove() || el.remove();
    }
  });
}

