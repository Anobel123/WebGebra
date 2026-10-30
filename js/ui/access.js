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

const COIN_SVG = '<svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-label="Ilustrasi koin emas"><circle cx="50" cy="52" r="40" fill="#b45309"/><circle cx="50" cy="46" r="40" fill="#fbbf24"/><circle cx="50" cy="46" r="30" fill="none" stroke="#d97706" stroke-width="4"/><text x="50" y="58" text-anchor="middle" font-size="34" font-weight="900" fill="#064937" font-family="Fredoka,Nunito,sans-serif">x</text></svg>';

const CARDS = [
  { key: 'webGame', title: 'Mainkan di Browser (Web)', desc: 'Scan QR atau klik tombol untuk langsung bermain di browser tanpa instalasi.', cta: 'Mainkan di Browser', hoverText: 'Ayo Mulai!', qr: true, featured: true },
  { key: 'playStore', title: 'Google Play Store', desc: 'Pasang resmi di perangkat Android.', cta: 'Buka di Play Store', hoverText: 'Buka Play Store!', qr: true, store: true },
  { key: 'apkDownload', title: 'Unduh APK Android', desc: 'Unduh berkas instalasi APK langsung.', cta: 'Unduh APK', hoverText: 'Pasang Sekarang!', qr: true, apk: true },
  { key: 'repo', title: 'Repositori GitHub', desc: 'Lihat kode sumber lengkap Algebra-Mart.', cta: 'Buka Repositori', hoverText: 'Lihat Kode!', qr: false }
];

export function initAccess() {
  const wrap = document.getElementById('access-grid');
  if (!wrap) return;
  const html = CARDS.map((c, i) => {
    const url = (SITE_CONFIG.links[c.key] || '').trim();
    const ok = isValidUrl(url);
    const shortUrl = ok ? url.replace(/^https?:\/\//i, '') : '';
    const meta = c.apk && ok && (SITE_CONFIG.apkMeta?.size || SITE_CONFIG.apkMeta?.sha256)
      ? `<p class="id-card__meta">${SITE_CONFIG.apkMeta.size ? 'Ukuran: ' + esc(SITE_CONFIG.apkMeta.size) : ''}${SITE_CONFIG.apkMeta.sha256 ? '<br>SHA-256: <code style="word-break:break-all">' + esc(SITE_CONFIG.apkMeta.sha256) + '</code>' : ''}</p>` : '';
    const apkIcon = c.apk ? `<svg class="btn__swing-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>` : '';
    const primary = c.store
      ? `<a class="store-badge" data-burst data-fx="cta magnetic store-apk" aria-label="${esc(c.cta)}" ${ok ? `href="${esc(url)}" target="_blank" rel="noopener"` : 'aria-disabled="true" tabindex="-1"'}><svg class="btn__swing-icon" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path fill="#34d399" d="M3 2l11 10L3 22z"/><path fill="#fbbf24" d="M14 12l4-3.600 3 1.700c1 .6 1 1.800 0 2.400l-3 1.700z"/><path fill="#60a5fa" d="M3 2l15 8.400-4 1.600z"/><path fill="#f87171" d="M3 22l15-8.400-4-1.600z"/></svg><span><small>Tersedia di</small>Google Play</span></a>`
      : `<a class="btn ${c.featured ? 'btn--green' : ''}" data-burst data-fx="cta magnetic${c.apk ? ' store-apk' : ''}" data-hover="${esc(c.hoverText || c.cta)}" aria-label="${esc(c.cta)}" ${ok ? `href="${esc(url)}" target="_blank" rel="noopener"${c.apk ? ' download' : ''}` : 'aria-disabled="true" tabindex="-1"'}>${apkIcon}${c.cta}</a>`;
    return `
    <article class="card card--tilt access-card ${c.featured ? 'access-card--featured' : ''} reveal" data-fx="tilt" data-key="${c.key}">
      ${c.featured && ok ? '<span class="chip chip--green">Akses Instan Juri (QR + Browser)</span>' : ''}
      <h3>${c.title}</h3><p>${c.desc}</p>
      ${c.qr ? `<div class="qr-wrap"><div class="qr-box" id="qr-${i}">${ok ? '' : COIN_SVG}</div><span class="qr-scan-hint" aria-hidden="true">Scan untuk bermain</span></div>` : ''}
      ${ok && c.qr ? `<code class="access-url">${esc(shortUrl)}</code>` : ''}
      ${ok ? '' : '<span class="soon">Segera Hadir</span>'}
      ${primary}${meta}
      ${ok ? `<div class="card-actions">
        ${c.qr ? `<button class="btn btn--small btn--secondary" type="button" data-dl="${c.key}" data-i="${i}">Unduh QR (PNG)</button>` : ''}
        <button class="btn btn--small btn--secondary" type="button" data-copy="${esc(url)}">Salin tautan</button></div>` : ''}
    </article>`;
  }).join('');
  wrap.innerHTML = html;

  CARDS.forEach((c, i) => {
    const url = (SITE_CONFIG.links[c.key] || '').trim();
    if (!c.qr || !isValidUrl(url)) return;
    const box = document.getElementById('qr-' + i);
    try {
      const cv = document.createElement('canvas');
      cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', `Kode QR untuk ${c.title}: ${url}`);
      drawQR(cv, url); box.appendChild(cv);
    } catch (e) {
      console.error('[qr]', c.key, e);
      box.innerHTML = COIN_SVG;
    }
  });

  wrap.addEventListener('click', async (e) => {
    const cp = e.target.closest('[data-copy]');
    if (cp) { const ok = await copyText(cp.dataset.copy); toast(ok ? 'Tautan disalin.' : 'Salin manual dari kotak yang muncul.', 2500); return; }
    const dl = e.target.closest('[data-dl]');
    if (dl) {
      const cv = document.querySelector(`#qr-${dl.dataset.i} canvas`);
      if (!cv) return toast('QR belum tersedia.');
      const a = document.createElement('a');
      a.download = `qr-algebra-mart-${dl.dataset.dl}.png`; a.href = cv.toDataURL('image/png');
      document.body.appendChild(a); a.click(); a.remove();
    }
  });
}
