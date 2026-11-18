// js/ui/bukuInstruksi.js — Komponen Data-Driven Kartu Dokumen (Manual Book & Modul Ajar)
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { renderIcon } from './icons.js';
import { renderSlot, resolveSlots, shouldShowEmptySlots } from '../slots.js';
import { esc } from '../utils/safe.js';
import { renderQRCard } from './qr.js';

function formatBytesToMB(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1).replace('.', ',')} MB`;
}

async function probePdfSize(url) {
  if (!url) return { exists: false, sizeText: '' };
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) return { exists: false, sizeText: '' };
    const len = res.headers.get('content-length');
    return {
      exists: true,
      sizeText: len ? formatBytesToMB(parseInt(len, 10)) : ''
    };
  } catch (_) {
    return { exists: true, sizeText: '' };
  }
}

function renderCssBookCover(title) {
  return `
    <div class="buku-cover-css" aria-label="${esc(title)}">
      <div class="buku-cover-css__spine"></div>
      <div class="buku-cover-css__front">
        <div class="buku-cover-css__title">${esc(title)}</div>
        <div class="buku-cover-css__sub">Kurikulum Merdeka · Fase D</div>
      </div>
    </div>
  `;
}

function renderDocCardHtml(doc, idx) {
  const titleId = `doc-title-${esc(doc.id)}`;
  const metaText = doc.sizeText ? `PDF, ${doc.sizeText}` : 'PDF';
  const ariaUnduh = `Unduh ${doc.judul}, ${metaText}`;
  const coverHtml = renderSlot(doc.sampul, { lazy: true }) || renderCssBookCover(doc.judul);

  return `
    <article class="buku-card book-3d-display card reveal" id="${esc(doc.id)}" data-reveal="fade" aria-labelledby="${titleId}">
      <div class="buku-card__grid">
        <div class="buku-card__cover book-3d-cover-wrap">
          <div class="book-3d-cover">
            ${coverHtml}
          </div>
        </div>

        <div class="buku-card__info">
          <div class="buku-card__top">
            <h3 class="buku-card__title" id="${titleId}">${esc(doc.judul)}</h3>
            <p class="buku-card__meta">${esc(metaText)}</p>
            <p class="buku-card__desc">${esc(doc.deskripsi)}</p>
          </div>

          <div class="buku-card__actions">
            ${doc.pdfExists
              ? `<a href="${esc(doc.berkas)}" download="${esc(doc.namaUnduh)}" class="btn btn--cta-primary buku-btn-unduh" type="application/pdf" rel="noopener" data-fx="cta magnetic" data-burst aria-label="${esc(ariaUnduh)}">
                  ${renderIcon('download', { size: 18 })}
                  <span>${esc(doc.labelUnduh || 'Unduh (PDF)')}</span>
                </a>`
              : `<span class="soon" aria-label="Berkas PDF segera hadir">Segera hadir</span>`
            }
            ${doc.hasBacaOnline
              ? `<a href="${esc(doc.bacaOnlineUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--secondary buku-btn-baca" data-fx="cta magnetic" data-burst aria-label="Baca ${esc(doc.judul)} online (tab baru)">
                  ${renderIcon('external-link', { size: 16 })}
                  <span>Baca Online</span>
                </a>`
              : ''
            }
          </div>

          <div class="buku-card__qr-section">
            <div id="doc-qr-${esc(doc.id)}" style="width:100%"></div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function mountDocQR(wrapEl, doc) {
  if (!wrapEl) return;
  const noun = doc.qrNoun || 'dokumen';
  const hasBaca = doc.hasBacaOnline;
  const rawUnduh = doc.pdfExists ? doc.berkas : '';
  const absoluteUnduh = rawUnduh ? new URL(rawUnduh, SITE_CONFIG.siteUrl || window.location.href).href : '';
  const hasUnduh = isValidUrl(absoluteUnduh);

  if (!hasBaca && !hasUnduh) {
    renderQRCard(wrapEl, { url: '', type: `${doc.id}-empty` });
    return;
  }

  const showSegment = hasBaca && hasUnduh;
  let mode = hasBaca ? 'baca' : 'unduh';

  const renderState = () => {
    const isBaca = mode === 'baca';
    const activeUrl = isBaca ? doc.bacaOnlineUrl : absoluteUnduh;
    const activeType = `${doc.id}-${isBaca ? 'baca' : 'unduh'}`;
    const activeCaption = isBaca ? `Pindai untuk membaca ${noun}` : `Pindai untuk mengunduh ${noun}`;
    const activeAlt = isBaca
      ? `QR untuk membaca ${doc.judul} online`
      : `QR untuk mengunduh PDF ${doc.judul}`;

    wrapEl.innerHTML = `
      ${showSegment ? `
        <div class="doc-qr-seg-wrap">
          <div class="qr-segmented-control" role="tablist" aria-label="Pilihan QR ${esc(doc.judul)}">
            <button type="button" class="qr-seg-btn ${isBaca ? 'is-active' : ''}" role="tab" aria-selected="${isBaca}" data-doc-seg="baca">Baca Online</button>
            <button type="button" class="qr-seg-btn ${!isBaca ? 'is-active' : ''}" role="tab" aria-selected="${!isBaca}" data-doc-seg="unduh">Unduh PDF</button>
          </div>
        </div>
      ` : ''}
      <div class="doc-qr-target"></div>
    `;

    const target = wrapEl.querySelector('.doc-qr-target');
    if (target) {
      renderQRCard(target, {
        url: activeUrl,
        type: activeType,
        caption: activeCaption,
        alt: activeAlt
      });
    }

    if (showSegment) {
      wrapEl.querySelectorAll('[data-doc-seg]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const next = btn.getAttribute('data-doc-seg');
          if (next && next !== mode) {
            mode = next;
            renderState();
          }
        });
      });
    }
  };

  renderState();
}

export async function initBukuInstruksi() {
  const container = document.getElementById('buku-instruksi-container');
  if (!container) return;

  const rawDocs = Array.isArray(SITE_CONFIG.dokumen) ? SITE_CONFIG.dokumen : [];
  if (!rawDocs.length) return;

  const docs = await Promise.all(rawDocs.map(async (doc) => {
    const probe = await probePdfSize(doc.berkas);
    return {
      ...doc,
      hasBacaOnline: isValidUrl(doc.bacaOnlineUrl),
      pdfExists: probe.exists,
      sizeText: probe.sizeText
    };
  }));

  container.innerHTML = `
    <div class="buku-shelf-section">
      <div class="section-head text-center reveal" style="margin-bottom:2rem">
        <h3 style="font:900 1.85rem var(--font-display);color:var(--am-brown-900);margin:0 0 .35rem">Buku Panduan &amp; Modul Ajar</h3>
        <p style="font-size:1rem;color:var(--am-brown-800);max-width:640px;margin:0 auto">Unduh berkas PDF atau baca di peramban.</p>
      </div>

      <div class="buku-shelf-grid">
        ${docs.map((doc, idx) => renderDocCardHtml(doc, idx)).join('')}
      </div>
    </div>
  `;

  await resolveSlots(container);

  docs.forEach((doc) => {
    const fig = container.querySelector(`figure[data-slot="${doc.sampul}"]`);
    if (fig && fig.classList.contains('is-empty') && !shouldShowEmptySlots()) {
      fig.innerHTML = renderCssBookCover(doc.judul);
      fig.style.display = 'block';
    }
    mountDocQR(container.querySelector(`#doc-qr-${doc.id}`), doc);
  });
}
