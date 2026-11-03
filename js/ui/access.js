// js/ui/access.js — Hub Akses Perangkat Algebra-Mart (Play Store, Web, APK, Repo)
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { copyText, toast, esc } from '../utils/safe.js';
import { renderQRCard } from './qr.js';

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
    <!-- Kartu Google Play Store Dominan di Kiri Atas -->
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

        <div style="margin:1.4rem 0 1rem" class="access-primary-action">
          <a class="store-badge" data-burst data-fx="cta magnetic store-apk" aria-label="Buka di Play Store" ${isPlayStoreOk ? `href="${esc(playStoreUrl)}" target="_blank" rel="noopener"` : 'aria-disabled="true" tabindex="-1"'}>
            <svg class="btn__swing-icon" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path fill="#34d399" d="M3 2l11 10L3 22z"/><path fill="#fbbf24" d="M14 12l4-3.600 3 1.700c1 .6 1 1.800 0 2.400l-3 1.700z"/><path fill="#60a5fa" d="M3 2l15 8.400-4 1.600z"/><path fill="#f87171" d="M3 2l15-8.400-4-1.600z"/></svg>
            <span><small>Tersedia di</small>Google Play</span>
          </a>
        </div>
      </div>

      <!-- Panel Lipat QR Play Store (Jenis Sama dengan QR Repositori) -->
      ${isPlayStoreOk ? `
        <details class="qr-disclosure qr-disclosure--repo">
          <summary class="qr-disclosure__trigger" style="margin-top:.4rem;padding:.42rem .85rem;font-size:.84rem">
            <svg class="qr-disclosure__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Tampilkan QR Play Store</span>
            <span class="qr-disclosure__arrow" aria-hidden="true">&darr;</span>
          </summary>
          <div class="qr-disclosure__content" style="padding:.6rem 0">
            <div id="qr-playstore-target" style="max-width:280px;margin:0 auto"></div>
          </div>
        </details>
      ` : ''}
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

        <div style="margin-bottom:1rem" class="access-primary-action">
          <a class="btn btn--green" data-burst data-fx="cta magnetic" data-hover="Ayo Mulai!" aria-label="Mainkan di Browser" ${isWebOk ? `href="${esc(webUrl)}" target="_blank" rel="noopener"` : 'aria-disabled="true" tabindex="-1"'}>
            Mainkan di Browser
          </a>
        </div>
      </div>

      <!-- Panel Lipat QR Web Game (Jenis Sama dengan QR Repositori) -->
      ${isWebOk ? `
        <details class="qr-disclosure qr-disclosure--repo">
          <summary class="qr-disclosure__trigger" style="margin-top:.4rem;padding:.42rem .85rem;font-size:.84rem">
            <svg class="qr-disclosure__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Tampilkan QR Web Game</span>
            <span class="qr-disclosure__arrow" aria-hidden="true">&darr;</span>
          </summary>
          <div class="qr-disclosure__content" style="padding:.6rem 0">
            <div id="qr-web-target" style="max-width:280px;margin:0 auto"></div>
          </div>
        </details>
      ` : ''}
    </article>

    <!-- Baris Tautan APK & Repositori Bergaris Titik-Titik di Bawah (Grid Kolom Penuh) -->
    <div class="inventory-links-strip reveal" style="grid-column: 1 / -1;" data-reveal="shelf">
      <!-- Kolom APK Android -->
      <div class="inventory-link-item" style="display:flex;flex-direction:column;gap:.6rem">
        <div style="display:flex;align-items:center;gap:.8rem;flex-wrap:wrap">
          <span class="chip" style="font-size:.8rem;background:var(--am-card)">Berkas Langsung APK</span>
          <a href="${esc(apkUrl)}" class="btn btn--small btn--secondary" ${isApkOk ? 'download' : 'aria-disabled="true" tabindex="-1"'} style="font-weight:800">
            ${isApkOk ? `Unduh APK Android ${apkMeta ? `(${apkMeta})` : ''} &rarr;` : 'Segera Hadir'}
          </a>
        </div>
        ${isApkOk ? `
          <details class="qr-disclosure qr-disclosure--repo">
            <summary class="qr-disclosure__trigger" style="margin-top:.3rem;padding:.4rem .8rem;font-size:.82rem">
              <svg class="qr-disclosure__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Tampilkan QR APK</span>
              <span class="qr-disclosure__arrow" aria-hidden="true">&darr;</span>
            </summary>
            <div class="qr-disclosure__content" style="padding:.6rem 0">
              <div id="qr-apk-target" style="max-width:280px;margin:0 auto"></div>
            </div>
          </details>
        ` : ''}
      </div>

      <!-- Kolom Repositori GitHub -->
      <div class="inventory-link-item" style="display:flex;flex-direction:column;gap:.6rem">
        <div style="display:flex;align-items:center;gap:.8rem;flex-wrap:wrap">
          <span class="chip" style="font-size:.8rem;background:var(--am-card)">Kode Sumber Terbuka</span>
          <a href="${esc(repoUrl)}" target="_blank" rel="noopener" class="btn btn--small btn--secondary" style="font-weight:800">
            Repositori GitHub Algebra-Mart &rarr;
          </a>
        </div>
        ${isRepoOk ? `
          <details class="qr-disclosure qr-disclosure--repo">
            <summary class="qr-disclosure__trigger" style="margin-top:.3rem;padding:.4rem .8rem;font-size:.82rem">
              <svg class="qr-disclosure__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span>Tampilkan QR Repositori</span>
              <span class="qr-disclosure__arrow" aria-hidden="true">&darr;</span>
            </summary>
            <div class="qr-disclosure__content" style="padding:.6rem 0">
              <div id="qr-repo-target" style="max-width:280px;margin:0 auto"></div>
            </div>
          </details>
        ` : ''}
      </div>
    </div>
  `;

  // Render QR Play Store jika URL valid
  if (isPlayStoreOk) {
    const target = document.getElementById('qr-playstore-target');
    if (target) {
      renderQRCard(target, {
        url: playStoreUrl,
        type: 'playstore',
        caption: 'Pindai untuk membuka Play Store',
        alt: 'QR menuju Play Store Algebra-Mart'
      });
    }
  }

  // Render QR Web jika URL valid
  if (isWebOk) {
    const target = document.getElementById('qr-web-target');
    if (target) {
      renderQRCard(target, {
        url: webUrl,
        type: 'web',
        caption: 'Pindai untuk bermain di browser',
        alt: 'QR menuju Versi Web Game Algebra-Mart'
      });
    }
  }

  // Render QR APK jika URL valid
  if (isApkOk) {
    const target = document.getElementById('qr-apk-target');
    if (target) {
      renderQRCard(target, {
        url: apkUrl,
        type: 'apk',
        caption: 'Pindai untuk mengunduh APK',
        alt: 'QR menuju unduh berkas APK Algebra-Mart'
      });
    }
  }

  // Render QR Repositori GitHub jika URL valid
  if (isRepoOk) {
    const target = document.getElementById('qr-repo-target');
    if (target) {
      renderQRCard(target, {
        url: repoUrl,
        type: 'repo',
        caption: 'Pindai untuk membuka repositori GitHub',
        alt: 'QR menuju Repositori GitHub Algebra-Mart'
      });
    }
  }
}
