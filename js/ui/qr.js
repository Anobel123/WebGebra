// js/ui/qr.js — Modul Tunggal Pembuat & Pengelola Kode QR Algebra-Mart
import qrcode from '../../libs/qrcode.js';
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { copyText, toast, esc } from '../utils/safe.js';

// ============================================================
// 1. KONFIGURASI TAMPILAN, LOGO, & UKURAN QR CODE
// ============================================================
export const QR_CONFIG = {
  colors: {
    module: '#451a03',        // Cokelat tua kontras tinggi (sesuai brief, bukan emas/amber)
    bg: '#fff8e6',            // Latar krem terang
    plateBg: '#fffdf6',       // Pelat persegi membulat krem
    plateBorder: '#b48700'    // Bingkai emas tipis
  },
  logo: {
    src: 'assets/logo/logo-algebra-mart.png',
    maxRatioNormal: 0.22,     // Sisi pelat <= 22% sisi area modul QR (~5% luas)
    maxRatioDense: 0.18,      // Sisi pelat <= 18% bila modul > 57
    denseThreshold: 57,       // Ambang modul padat
    warningThreshold: 69,     // Ambang URL terlalu panjang (> 69)
    paddingRatio: 0.06,       // Jarak dalam (padding) ~6% dari sisi pelat
    borderRadiusRatio: 0.18   // Kelengkungan sudut pelat
  },
  geometry: {
    quietZone: 4,             // Zona tenang minimal 4 modul di tiap sisi
    displaySizeDesktop: 220,  // Ukuran minimal layar desktop >= 200px
    displaySizeMobile: 180,   // Ukuran minimal layar mobile >= 176px
    downloadResolution: 2048  // PNG unduhan standar cetak 2048 x 2048 px
  }
};

let cachedLogoImage = null;
let logoLoadAttempted = false;

/**
 * Memuat berkas logo Algebra-Mart secara aman (singleton).
 * Fallback anggun: jika berkas hilang atau korup, otomatis return null tanpa console error.
 */
export async function getLogoImage() {
  if (cachedLogoImage) return cachedLogoImage;
  if (logoLoadAttempted) return null;
  logoLoadAttempted = true;

  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        cachedLogoImage = img;
        resolve(img);
      };
      img.onerror = () => {
        // Fallback otomatis tanpa melempar error
        cachedLogoImage = null;
        resolve(null);
      };
      img.src = QR_CONFIG.logo.src;
    } catch (_) {
      resolve(null);
    }
  });
}

/**
 * Render matriks modul QR ke dalam elemen HTMLCanvasElement.
 */
export function drawQRToCanvas(canvas, qr, moduleCount, logoImg, options = {}) {
  const size = options.size || QR_CONFIG.geometry.downloadResolution;
  const quietZone = QR_CONFIG.geometry.quietZone;
  const totalModules = moduleCount + 2 * quietZone;
  const cellSize = size / totalModules;
  const ox = quietZone * cellSize;
  const oy = quietZone * cellSize;
  const modAreaSize = moduleCount * cellSize;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 1. Gambar latar krem terang solid
  ctx.fillStyle = QR_CONFIG.colors.bg;
  ctx.fillRect(0, 0, size, size);

  const hasLogo = !!logoImg && options.logo !== false;
  const ratio = moduleCount > QR_CONFIG.logo.denseThreshold
    ? QR_CONFIG.logo.maxRatioDense
    : QR_CONFIG.logo.maxRatioNormal;

  const plateSize = modAreaSize * ratio;
  const px = size / 2 - plateSize / 2;
  const py = size / 2 - plateSize / 2;

  // 2. Gambar modul persegi standar (area tengah tertutup pelat tidak digambar)
  ctx.fillStyle = QR_CONFIG.colors.module;
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        const mx1 = ox + c * cellSize;
        const mx2 = mx1 + cellSize;
        const my1 = oy + r * cellSize;
        const my2 = my1 + cellSize;

        const covered = hasLogo && (
          mx1 < px + plateSize &&
          mx2 > px &&
          my1 < py + plateSize &&
          my2 > py
        );

        if (!covered) {
          ctx.fillRect(
            Math.floor(mx1),
            Math.floor(my1),
            Math.ceil(cellSize + 0.3),
            Math.ceil(cellSize + 0.3)
          );
        }
      }
    }
  }

  // 3. Gambar pelat logo membulat dan gambar logo jika tersedia
  if (hasLogo) {
    const radius = plateSize * QR_CONFIG.logo.borderRadiusRatio;
    const strokeW = Math.max(1.5, Math.round(plateSize * 0.035));

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(px, py, plateSize, plateSize, radius);
    } else {
      const r = radius;
      ctx.moveTo(px + r, py);
      ctx.arcTo(px + plateSize, py, px + plateSize, py + plateSize, r);
      ctx.arcTo(px + plateSize, py + plateSize, px, py + plateSize, r);
      ctx.arcTo(px, py + plateSize, px, py, r);
      ctx.arcTo(px, py, px + plateSize, py, r);
      ctx.closePath();
    }

    ctx.fillStyle = QR_CONFIG.colors.plateBg;
    ctx.fill();
    ctx.lineWidth = strokeW;
    ctx.strokeStyle = QR_CONFIG.colors.plateBorder;
    ctx.stroke();

    // Gambar logo dengan preserve aspect ratio (contain)
    const pad = plateSize * QR_CONFIG.logo.paddingRatio;
    const innerX = px + pad;
    const innerY = py + pad;
    const innerSize = plateSize - 2 * pad;

    const imgW = logoImg.naturalWidth || logoImg.width || 512;
    const imgH = logoImg.naturalHeight || logoImg.height || 512;
    const scale = Math.min(innerSize / imgW, innerSize / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = innerX + (innerSize - drawW) / 2;
    const drawY = innerY + (innerSize - drawH) / 2;

    ctx.drawImage(logoImg, drawX, drawY, drawW, drawH);
  }
}

/**
 * Buat berkas vektor SVG dari QR Code dengan modul vektor dan logo tertanam.
 */
export function generateQRSvg(qr, moduleCount, logoImg, options = {}) {
  const size = options.size || 2048;
  const quietZone = QR_CONFIG.geometry.quietZone;
  const totalModules = moduleCount + 2 * quietZone;
  const cellSize = size / totalModules;
  const ox = quietZone * cellSize;
  const oy = quietZone * cellSize;
  const modAreaSize = moduleCount * cellSize;

  const hasLogo = !!logoImg && options.logo !== false;
  const ratio = moduleCount > QR_CONFIG.logo.denseThreshold
    ? QR_CONFIG.logo.maxRatioDense
    : QR_CONFIG.logo.maxRatioNormal;

  const plateSize = modAreaSize * ratio;
  const px = size / 2 - plateSize / 2;
  const py = size / 2 - plateSize / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">\n`;
  svg += `  <rect width="${size}" height="${size}" fill="${QR_CONFIG.colors.bg}"/>\n`;

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        const mx1 = ox + c * cellSize;
        const mx2 = mx1 + cellSize;
        const my1 = oy + r * cellSize;
        const my2 = my1 + cellSize;

        const covered = hasLogo && (
          mx1 < px + plateSize &&
          mx2 > px &&
          my1 < py + plateSize &&
          my2 > py
        );

        if (!covered) {
          svg += `  <rect x="${mx1.toFixed(3)}" y="${my1.toFixed(3)}" width="${(cellSize + 0.25).toFixed(3)}" height="${(cellSize + 0.25).toFixed(3)}" fill="${QR_CONFIG.colors.module}"/>\n`;
        }
      }
    }
  }

  if (hasLogo) {
    const radius = plateSize * QR_CONFIG.logo.borderRadiusRatio;
    const strokeW = Math.max(2, Math.round(plateSize * 0.035));
    svg += `  <rect x="${px.toFixed(3)}" y="${py.toFixed(3)}" width="${plateSize.toFixed(3)}" height="${plateSize.toFixed(3)}" rx="${radius.toFixed(3)}" fill="${QR_CONFIG.colors.plateBg}" stroke="${QR_CONFIG.colors.plateBorder}" stroke-width="${strokeW}"/>\n`;

    let logoDataUrl = '';
    try {
      if (typeof document !== 'undefined') {
        const tmp = document.createElement('canvas');
        tmp.width = logoImg.naturalWidth || logoImg.width || 512;
        tmp.height = logoImg.naturalHeight || logoImg.height || 512;
        const tCtx = tmp.getContext('2d');
        tCtx.drawImage(logoImg, 0, 0);
        logoDataUrl = tmp.toDataURL('image/png');
      }
    } catch (_) {}

    if (logoDataUrl) {
      const pad = plateSize * QR_CONFIG.logo.paddingRatio;
      const ix = px + pad;
      const iy = py + pad;
      const iw = plateSize - 2 * pad;
      svg += `  <image href="${logoDataUrl}" x="${ix.toFixed(3)}" y="${iy.toFixed(3)}" width="${iw.toFixed(3)}" height="${iw.toFixed(3)}" preserveAspectRatio="xMidYMid meet"/>\n`;
    }
  }

  svg += '</svg>';
  return svg;
}

/**
 * Mekanisme unduhan berkas yang kompatibel dengan desktop dan mobile (Chrome Android & Safari iOS).
 */
export function triggerFileDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const a = document.createElement('a');

  if ('download' in a && !isIOS) {
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2500);
    toast(`Mengunduh berkas ${filename}...`);
  } else {
    // Fallback Mobile Safari: buka di tab baru dengan notifikasi simpan
    const win = window.open(url, '_blank');
    if (!win) location.href = url;
    toast('Tekan lama pada gambar untuk menyimpan ke galeri gawai Anda.', 4000);
  }
}

/**
 * Unduh QR dalam format PNG (2048x2048 solid krem) atau SVG vektor.
 */
export async function downloadQR(type, format, qr, moduleCount, logoImg) {
  const cleanType = (type || 'akses').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const filename = `qr-algebra-mart-${cleanType}.${format}`;

  if (format === 'svg') {
    const svgStr = generateQRSvg(qr, moduleCount, logoImg, { size: 2048 });
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    triggerFileDownload(blob, filename);
  } else {
    const dlCanvas = document.createElement('canvas');
    drawQRToCanvas(dlCanvas, qr, moduleCount, logoImg, { size: QR_CONFIG.geometry.downloadResolution });
    dlCanvas.toBlob((blob) => {
      if (blob) triggerFileDownload(blob, filename);
    }, 'image/png');
  }
}

/**
 * FUNGSI UTAMA: createQR(url, opsi)
 * Membuat objek QR Code terpusat dengan level H, modul standar, dan logo Algebra-Mart.
 */
export async function createQR(url, options = {}) {
  const cleanUrl = (url || '').trim();
  if (!cleanUrl || !isValidUrl(cleanUrl)) {
    throw new Error(`[qr] URL tidak valid: "${url}". Harus diawali dengan https://`);
  }

  const qr = qrcode(0, 'H');
  qr.addData(cleanUrl, 'Byte');
  qr.make();

  const moduleCount = qr.getModuleCount();
  if (moduleCount > QR_CONFIG.logo.warningThreshold) {
    console.warn(`[qr] Peringatan: URL sangat padat (${moduleCount} modul/sisi > 69). Disarankan memperpendek URL: ${cleanUrl}`);
  }

  const logoImg = await getLogoImage();
  const ratio = moduleCount > QR_CONFIG.logo.denseThreshold
    ? QR_CONFIG.logo.maxRatioDense
    : QR_CONFIG.logo.maxRatioNormal;

  const displayCanvas = document.createElement('canvas');
  displayCanvas.className = 'qr-canvas';
  const renderDpi = Math.max(2, window.devicePixelRatio || 2);
  const size = (options.size || 240) * renderDpi;

  drawQRToCanvas(displayCanvas, qr, moduleCount, logoImg, { size, logo: options.logo !== false });
  displayCanvas.style.width = '100%';
  displayCanvas.style.height = '100%';
  displayCanvas.setAttribute('role', 'img');
  displayCanvas.setAttribute('aria-label', options.ariaLabel || `Kode QR Algebra-Mart untuk ${cleanUrl}`);

  const qrType = options.type || 'akses';

  return {
    canvas: displayCanvas,
    qr,
    moduleCount,
    logoRatio: ratio,
    url: cleanUrl,
    downloadPNG: () => downloadQR(qrType, 'png', qr, moduleCount, logoImg),
    downloadSVG: () => downloadQR(qrType, 'svg', qr, moduleCount, logoImg),
    copyLink: async () => {
      const ok = await copyText(cleanUrl);
      toast(ok ? 'Tautan berhasil disalin ke clipboard.' : 'Silakan salin tautan secara manual.', 2500);
    }
  };
}

/**
 * Komponen UI: Merender satu kartu struk QR lengkap dengan tombol unduh dan salin tautan.
 */
export async function renderQRCard(container, opts = {}) {
  if (!container) return null;
  const {
    url,
    type = 'akses',
    caption = 'Pindai untuk membuka',
    alt = 'QR menuju Algebra-Mart',
    isCollapsible = false,
    collapsibleTitle = 'Tampilkan QR'
  } = opts;

  if (!url || !isValidUrl(url)) {
    container.innerHTML = `
      <div class="qr-placeholder" style="padding:1.5rem;text-align:center;color:var(--am-muted);font-size:.9rem">
        <span>Segera Hadir</span>
      </div>
    `;
    return null;
  }

  container.innerHTML = '<div class="qr-loading" style="min-height:220px;display:grid;place-items:center"><span style="color:var(--am-muted);font-size:.85rem">Membuat QR...</span></div>';

  try {
    const qrObj = await createQR(url, {
      type,
      ariaLabel: alt
    });

    const cardHtml = `
      <div class="receipt-qr-card" data-qr-type="${esc(type)}">
        <div class="qr-box" style="margin:0 auto">
          <!-- Canvas di-inject di sini -->
        </div>
        <p class="qr-caption" style="margin:.6rem 0 .7rem;font-size:.85rem;color:var(--am-brown-900);font-weight:700;text-align:center">${esc(caption)}</p>
        <div class="qr-actions" style="display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn btn--small btn--secondary btn-qr-dl-png" data-action="dl-png" title="Unduh resolusi tinggi 2048x2048 solid krem">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Unduh (PNG)</span>
          </button>
          <button type="button" class="btn btn--small btn--secondary btn-qr-dl-svg" data-action="dl-svg" title="Unduh format vektor SVG untuk cetak atau Canva">
            <span>SVG</span>
          </button>
          <button type="button" class="btn btn--small btn--secondary btn-qr-copy" data-action="copy" title="Salin tautan ke clipboard">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Salin</span>
          </button>
        </div>
      </div>
    `;

    if (isCollapsible) {
      container.innerHTML = `
        <details class="qr-disclosure">
          <summary class="qr-disclosure__trigger">
            <svg class="qr-disclosure__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>${esc(collapsibleTitle)}</span>
            <span class="qr-disclosure__arrow" aria-hidden="true">&darr;</span>
          </summary>
          <div class="qr-disclosure__content" style="padding:.8rem 0">
            ${cardHtml}
          </div>
        </details>
      `;
    } else {
      container.innerHTML = cardHtml;
    }

    const box = container.querySelector('.qr-box');
    if (box) {
      box.innerHTML = '';
      box.appendChild(qrObj.canvas);
    }

    // Pasang event handler unduh dan salin
    const btnPng = container.querySelector('[data-action="dl-png"]');
    if (btnPng) btnPng.addEventListener('click', () => qrObj.downloadPNG());

    const btnSvg = container.querySelector('[data-action="dl-svg"]');
    if (btnSvg) btnSvg.addEventListener('click', () => qrObj.downloadSVG());

    const btnCopy = container.querySelector('[data-action="copy"]');
    if (btnCopy) btnCopy.addEventListener('click', () => qrObj.copyLink());

    return qrObj;
  } catch (err) {
    console.error('[qr]', err);
    container.innerHTML = `
      <div class="qr-error" style="padding:1rem;text-align:center;color:var(--am-muted);font-size:.85rem">
        Gagal memuat QR Code.
      </div>
    `;
    return null;
  }
}

/**
 * Inisialisasi safeInit modul QR
 */
export function initQR() {
  // Preload logo di background tanpa memblokir thread
  getLogoImage().catch(() => {});
}
