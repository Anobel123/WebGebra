// js/ui/access.js — Hub Akses Perangkat Algebra-Mart (Play Store, Web, APK, Repo)
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { esc } from '../utils/safe.js';
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
    <!-- Kartu Google Play -->
    <article class="card access-card access-card--equal reveal" data-reveal="shelf" data-key="playStore">
      <div class="access-card__head">
        <span class="chip chip--gold">Android</span>
        <h3 class="access-card__title">Google Play</h3>
        <p class="access-card__desc">Pasang di ponsel atau tablet Android.</p>
      </div>

      <div class="access-primary-action">
        ${isPlayStoreOk
          ? `<a class="btn btn--cta-primary access-main-btn" data-burst data-fx="cta magnetic" href="${esc(playStoreUrl)}" target="_blank" rel="noopener">Buka di Google Play</a>`
          : `<span class="soon">Segera hadir</span>`
        }
      </div>

      <div class="access-qr-wrap" id="qr-playstore-target"></div>
    </article>

    <!-- Kartu Main di Browser -->
    <article class="card access-card access-card--equal reveal" data-reveal="shelf" data-key="webGame">
      <div class="access-card__head">
        <span class="chip chip--green">Browser</span>
        <h3 class="access-card__title">Main di browser</h3>
        <p class="access-card__desc">Buka di Chrome, Edge, Firefox, atau Safari. Tidak perlu memasang apa pun.</p>
      </div>

      <div class="access-primary-action">
        ${isWebOk
          ? `<a class="btn btn--cta-primary access-main-btn" data-burst data-fx="cta magnetic" href="${esc(webUrl)}" target="_blank" rel="noopener">Mainkan sekarang</a>`
          : `<span class="soon">Segera hadir</span>`
        }
      </div>

      <div class="access-qr-wrap" id="qr-web-target"></div>
    </article>

    <!-- Baris Tautan APK & Repositori -->
    <div class="inventory-links-strip reveal" style="grid-column: 1 / -1;" data-reveal="shelf">
      <div class="inventory-link-item">
        <div class="inventory-link-row">
          <span class="chip" style="background:var(--am-card)">APK Android</span>
          ${isApkOk
            ? `<a href="${esc(apkUrl)}" class="btn btn--small btn--secondary" download style="font-weight:800">Unduh APK ${apkMeta ? `(${apkMeta})` : ''} &rarr;</a>`
            : `<span class="soon">Segera hadir</span>`
          }
        </div>
        ${isApkOk ? `<div id="qr-apk-target" class="access-strip-qr"></div>` : ''}
      </div>

      <div class="inventory-link-item">
        <div class="inventory-link-row">
          <span class="chip" style="background:var(--am-card)">Kode Sumber</span>
          ${isRepoOk
            ? `<a href="${esc(repoUrl)}" target="_blank" rel="noopener" class="btn btn--small btn--secondary" style="font-weight:800">Repositori GitHub &rarr;</a>`
            : `<span class="soon">Segera hadir</span>`
          }
        </div>
        ${isRepoOk ? `<div id="qr-repo-target" class="access-strip-qr"></div>` : ''}
      </div>

      <p class="access-internet-note" style="grid-column: 1 / -1; margin: .2rem 0 0; font-size: .85rem; color: var(--am-brown-800); font-weight: 700; text-align: center;">
        Mode Kelas membutuhkan internet.
      </p>
    </div>
  `;

  // Render QR Play Store
  const playTarget = document.getElementById('qr-playstore-target');
  if (playTarget) {
    renderQRCard(playTarget, {
      url: isPlayStoreOk ? playStoreUrl : '',
      type: 'playstore',
      caption: 'Pindai dengan kamera ponsel',
      alt: 'QR menuju Google Play Algebra-Mart'
    });
  }

  // Render QR Web
  const webTarget = document.getElementById('qr-web-target');
  if (webTarget) {
    renderQRCard(webTarget, {
      url: isWebOk ? webUrl : '',
      type: 'web',
      caption: 'Pindai dengan kamera ponsel',
      alt: 'QR menuju versi web Algebra-Mart'
    });
  }

  // Render QR APK jika URL valid
  if (isApkOk) {
    const apkTarget = document.getElementById('qr-apk-target');
    if (apkTarget) {
      renderQRCard(apkTarget, {
        url: apkUrl,
        type: 'apk',
        caption: 'Pindai untuk mengunduh APK',
        alt: 'QR menuju unduhan APK Algebra-Mart'
      });
    }
  }

  // Render QR Repositori GitHub jika URL valid
  if (isRepoOk) {
    const repoTarget = document.getElementById('qr-repo-target');
    if (repoTarget) {
      renderQRCard(repoTarget, {
        url: repoUrl,
        type: 'repo',
        caption: 'Pindai untuk membuka repositori GitHub',
        alt: 'QR menuju Repositori GitHub Algebra-Mart'
      });
    }
  }
}
