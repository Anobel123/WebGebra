import { SITE_CONFIG, isValidUrl } from '../config.js';
import qrcode from '../../libs/qrcode.js';
import { copyText, toast, esc } from '../utils/safe.js';

const DARK = '#064937', LIGHT = '#fff8e1';

function drawQR(canvas, url) {
  const qr = qrcode(0, 'H');
  qr.addData(url);
  qr.make();
  const n = qr.getModuleCount(), size = 480, pad = 24, cell = (size - pad * 2) / n;
  canvas.width = canvas.height = size;
  const g = canvas.getContext('2d');
  g.fillStyle = LIGHT; g.fillRect(0, 0, size, size);
  g.fillStyle = DARK;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) g.fillRect(Math.floor(pad + c * cell), Math.floor(pad + r * cell), Math.ceil(cell), Math.ceil(cell));
  // koin emas di tengah (±22% sisi; aman untuk koreksi level H)
  const cx = size / 2, rad = size * 0.11;
  g.beginPath(); g.arc(cx, cx, rad + 8, 0, Math.PI * 2); g.fillStyle = LIGHT; g.fill();
  const grad = g.createRadialGradient(cx - rad / 3, cx - rad / 3, 2, cx, cx, rad);
  grad.addColorStop(0, '#fef3c7'); grad.addColorStop(.5, '#fbbf24'); grad.addColorStop(1, '#d97706');
  g.beginPath(); g.arc(cx, cx, rad, 0, Math.PI * 2); g.fillStyle = grad; g.fill();
  g.lineWidth = 4; g.strokeStyle = '#064937'; g.stroke();
  g.fillStyle = '#064937'; g.font = `900 ${rad * 1.2}px Fredoka, Nunito, system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('x', cx, cx + 2);
}

const COIN_SVG = '<svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="Ilustrasi koin emas"><circle cx="50" cy="52" r="40" fill="#b45309"/><circle cx="50" cy="46" r="40" fill="#fbbf24"/><circle cx="50" cy="46" r="30" fill="none" stroke="#d97706" stroke-width="4"/><text x="50" y="58" text-anchor="middle" font-size="34" font-weight="900" fill="#064937" font-family="Fredoka,Nunito,sans-serif">x</text></svg>';

export function initAccess() {
  const wrap = document.getElementById('access-grid');
  if (!wrap) return;

  const playStoreUrl = (SITE_CONFIG.links.playStore || '').trim();
  const isPlayStoreOk = isValidUrl(playStoreUrl);

  const webUrl = (SITE_CONFIG.links.webGame || '').trim();
  const isWebOk = isValidUrl(webUrl);

  const apkUrl = (SITE_CONFIG.links.apkDownload || '').trim();
  const isApkOk = isValidUrl(apkUrl);
  const apkMeta = isApkOk && (SITE_CONFIG.apkMeta?.size || SITE_CONFIG.apkMeta?.sha256)
    ? `${SITE_CONFIG.apkMeta.size ? 'Ukuran: ' + esc(SITE_CONFIG.apkMeta.size) : ''}${SITE_CONFIG.apkMeta.sha256 ? ' · SHA-256: ' + esc(SITE_CONFIG.apkMeta.sha256).slice(0, 8) + '...' : ''}` : '';

  const repoUrl = (SITE_CONFIG.links.repo || '').trim();
  const isRepoOk = isValidUrl(repoUrl);

  wrap.innerHTML = `
    <!-- Kartu Google Play Store Dominan di Kiri Atas dengan Struk QR Tergantung -->
    <article class="access-card--playstore card reveal" data-reveal="shelf" data-key="playStore">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:.6rem;flex-wrap:wrap">
          <span class="chip chip--gold" style="font-size:.8rem">Aplikasi Resmi Android</span>
          <span class="soon">${isPlayStoreOk ? 'Tersedia di Store' : 'Segera Hadir'}</span>
        </div>
        <h3 style="margin:.8rem 0 .4rem;font-size:1.45rem;color:var(--am-brown-900)">Google Play Store</h3>
        <p style="margin:0;font-size:1rem;color:var(--am-ink);line-height:1.5">
          Pasang langsung di gawai Android siswa atau tablet sekolah. Seluruh level dan aset suara dibundel lokal untuk penggunaan luring.
        </p>

        <div style="margin:1.4rem 0">
          <a class="store-badge" data-burst data-fx="cta magnetic store-apk" aria-label="Buka di Play Store" ${isPlayStoreOk ? `href="${esc(playStoreUrl)}" target="_blank" rel="noopener"` : 'aria-disabled="true" tabindex="-1"'}>
            <svg class="btn__swing-icon" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path fill="#34d399" d="M3 2l11 10L3 22z"/><path fill="#fbbf24" d="M14 12l4-3.600 3 1.700c1 .6 1 1.800 0 2.400l-3 1.700z"/><path fill="#60a5fa" d="M3 2l15 8.400-4 1.600z"/><path fill="#f87171" d="M3 22l15-8.400-4-1.600z"/></svg>
            <span><small>Tersedia di</small>Google Play</span>
          </a>
        </div>
      </div>

      <!-- Struk Gantung Berisi QR Code Play Store -->
      <div class="hanging-receipt-qr">
        <div class="qr-box" id="qr-playstore" style="width:110px;height:110px;display:grid;place-items:center;background:#fff8e1;border-radius:10px;border:2px solid var(--am-brown-800)">
          ${isPlayStoreOk ? '' : COIN_SVG}
        </div>
        <div>
          <span style="font:700 .75rem var(--font-display);color:var(--am-brown-800);display:block;margin-bottom:.2rem">STRUK QR TOKO</span>
          <h4 style="margin:0 0 .3rem;font-size:1.05rem;color:var(--am-brown-900)">Pindai untuk Pasang</h4>
          <p style="margin:0 0 .6rem;font-size:.82rem;color:var(--am-muted)">Arahkan kamera ponsel ke QR ini untuk membuka halaman Play Store.</p>
          ${isPlayStoreOk ? `
            <div style="display:flex;gap:.5rem;flex-wrap:wrap">
              <button class="btn btn--small btn--secondary" type="button" data-copy="${esc(playStoreUrl)}">Salin Tautan</button>
              <button class="btn btn--small btn--secondary" type="button" data-dl="playStore" data-target="qr-playstore">Unduh QR</button>
            </div>
          ` : ''}
        </div>
      </div>
    </article>

    <!-- Kartu Web Browser Kompak di Kanan Atas -->
    <article class="card card--tilt access-card reveal" data-reveal="shelf" style="--shelf-rot:1.5deg;display:flex;flex-direction:column;justify-content:space-between" data-key="webGame">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:.6rem;flex-wrap:wrap">
          <span class="chip chip--green" style="font-size:.78rem">Akses Instan Peramban</span>
          <span class="chip" style="font-size:.72rem">Tanpa Pasang</span>
        </div>
        <h3 style="margin:.8rem 0 .4rem;font-size:1.3rem;color:var(--am-brown-900)">Mainkan di Browser (Web)</h3>
        <p style="margin:0 0 1.2rem;font-size:.95rem;color:var(--am-ink);line-height:1.5">
          Langsung uji coba mesin kasir di Chrome, Firefox, Safari, atau Edge tanpa perlu instalasi aplikasi apa pun.
        </p>

        <div style="margin-bottom:1.2rem">
          <a class="btn btn--green" data-burst data-fx="cta magnetic" data-hover="Ayo Mulai!" aria-label="Mainkan di Browser" ${isWebOk ? `href="${esc(webUrl)}" target="_blank" rel="noopener"` : 'aria-disabled="true" tabindex="-1"'}>
            Mainkan di Browser
          </a>
        </div>
      </div>

      <!-- Kotak QR Web Kompak -->
      <details class="qr-disclosure">
        <summary class="qr-disclosure__trigger">
          <svg class="qr-disclosure__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Buka QR Web</span>
        </summary>
        <div class="qr-disclosure__content" style="padding:.8rem">
          <div class="qr-box" id="qr-web" style="width:110px;height:110px;margin:0 auto;display:grid;place-items:center;background:#fff8e1;border-radius:10px;border:2px solid var(--am-brown-800)">
            ${isWebOk ? '' : COIN_SVG}
          </div>
          ${isWebOk ? `
            <div style="text-align:center;margin-top:.6rem">
              <button class="btn btn--small btn--secondary" type="button" data-copy="${esc(webUrl)}">Salin Tautan Web</button>
            </div>
          ` : ''}
        </div>
      </details>
    </article>

    <!-- Baris Tautan APK & Repositori Bergaris Titik-Titik di Bawah (Grid Kolom Penuh) -->
    <div class="inventory-links-strip reveal" style="grid-column: 1 / -1;" data-reveal="shelf">
      <div style="display:flex;align-items:center;gap:.8rem;flex-wrap:wrap">
        <span class="chip" style="font-size:.8rem;background:var(--am-card)">Berkas Langsung APK</span>
        <a href="${esc(apkUrl)}" class="btn btn--small btn--secondary" ${isApkOk ? 'download' : 'aria-disabled="true" tabindex="-1"'} style="font-weight:800">
          Unduh APK Android ${apkMeta ? `(${apkMeta})` : ''} &rarr;
        </a>
      </div>

      <div style="display:flex;align-items:center;gap:.8rem;flex-wrap:wrap">
        <span class="chip" style="font-size:.8rem;background:var(--am-card)">Kode Sumber Terbuka</span>
        <a href="${esc(repoUrl)}" target="_blank" rel="noopener" class="btn btn--small btn--secondary" style="font-weight:800">
          Repositori GitHub Algebra-Mart &rarr;
        </a>
      </div>
    </div>
  `;

  // Draw QR code for Play Store
  if (isPlayStoreOk) {
    const box = document.getElementById('qr-playstore');
    if (box) {
      try {
        const cv = document.createElement('canvas');
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', `Kode QR Google Play Store: ${playStoreUrl}`);
        drawQR(cv, playStoreUrl);
        box.innerHTML = '';
        box.appendChild(cv);
      } catch (e) {
        console.error('[qr-playstore]', e);
      }
    }
  }

  // Draw QR code for Web
  if (isWebOk) {
    const box = document.getElementById('qr-web');
    if (box) {
      try {
        const cv = document.createElement('canvas');
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', `Kode QR Web Game: ${webUrl}`);
        drawQR(cv, webUrl);
        box.innerHTML = '';
        box.appendChild(cv);
      } catch (e) {
        console.error('[qr-web]', e);
      }
    }
  }

  // Copy & Download handlers
  wrap.addEventListener('click', async (e) => {
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const ok = await copyText(cp.dataset.copy);
      toast(ok ? 'Tautan disalin ke clipboard.' : 'Silakan salin manual.', 2500);
      return;
    }
    const dl = e.target.closest('[data-dl]');
    if (dl) {
      const targetId = dl.dataset.target;
      const cv = document.querySelector(`#${targetId} canvas`);
      if (cv) {
        const a = document.createElement('a');
        a.download = `QR-Algebra-Mart-${dl.dataset.dl}.png`;
        a.href = cv.toDataURL('image/png');
        a.click();
      }
    }
  });
}
