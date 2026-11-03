// js/ui/share.js — Fitur Berbagi Tautan (WhatsApp, Telegram, Salin Tautan, Web Share API)
import { SITE_CONFIG, isValidUrl } from '../config.js';
import { copyText, toast, esc } from '../utils/safe.js';
import { playSfx } from './audio.js';
import { renderIcon } from './icons.js';

function getShareUrl() {
  const custom = (SITE_CONFIG.siteUrl || '').trim();
  if (isValidUrl(custom)) return custom;
  return window.location.origin + window.location.pathname;
}

const SHARE_TEXT = 'Algebra-Mart: Petualangan Belajar Aljabar & Literasi Keuangan di Toko Kelontong Modern untuk Siswa SMP Kelas VII.';

export function initShare() {
  const shareButtons = document.querySelectorAll('[data-share-trigger]');
  if (!shareButtons.length) return;

  // Siapkan popover tunggal di body
  let popover = document.getElementById('share-popover');
  if (!popover) {
    popover = document.createElement('div');
    popover.id = 'share-popover';
    popover.className = 'share-popover';
    popover.hidden = true;
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'true');
    popover.setAttribute('aria-label', 'Bagikan Algebra-Mart');

    popover.innerHTML = `
      <div class="share-popover__box card">
        <div class="share-popover__head">
          <h4 class="share-popover__title">${renderIcon('share-nodes', { size: 22 })} Bagikan Algebra-Mart</h4>
          <button type="button" class="share-popover__close" aria-label="Tutup menu bagikan">&times;</button>
        </div>
        <p class="share-popover__desc">Ajak rekan guru, juri, dan siswa mencoba petualangan kasir aljabar:</p>
        
        <div class="share-popover__options">
          <a class="share-btn share-btn--wa" target="_blank" rel="noopener" id="share-wa">
            ${renderIcon('whatsapp', { size: 20 })} WhatsApp
          </a>
          <a class="share-btn share-btn--tg" target="_blank" rel="noopener" id="share-tg">
            ${renderIcon('telegram', { size: 20 })} Telegram
          </a>
          <button type="button" class="share-btn share-btn--copy" id="share-copy">
            ${renderIcon('link', { size: 18 })} Salin Tautan
          </button>
          <button type="button" class="share-btn share-btn--native" id="share-native" hidden>
            ${renderIcon('share-nodes', { size: 18 })} Bagikan Lainnya
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(popover);

    // Close button & outside click
    const closeBtn = popover.querySelector('.share-popover__close');
    closeBtn.addEventListener('click', () => closeSharePopover());
    popover.addEventListener('click', (e) => {
      if (e.target === popover) closeSharePopover();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !popover.hidden) closeSharePopover();
    });

    // Copy action
    const copyBtn = popover.querySelector('#share-copy');
    copyBtn.addEventListener('click', async () => {
      playSfx('coin');
      const url = getShareUrl();
      const ok = await copyText(url);
      if (ok) {
        toast('Tautan berhasil disalin!');
        closeSharePopover();
      } else {
        toast('Gagal menyalin tautan.');
      }
    });

    // Native Share if supported
    const nativeBtn = popover.querySelector('#share-native');
    if (navigator.share) {
      nativeBtn.hidden = false;
      nativeBtn.addEventListener('click', async () => {
        playSfx('coin');
        try {
          await navigator.share({
            title: 'Algebra-Mart',
            text: SHARE_TEXT,
            url: getShareUrl()
          });
          closeSharePopover();
        } catch (e) {
          // User cancelled or share failed
        }
      });
    }
  }

  function openSharePopover() {
    playSfx('wood');
    const shareUrl = getShareUrl();
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${SHARE_TEXT}\n${shareUrl}`);

    const wa = popover.querySelector('#share-wa');
    if (wa) wa.href = `https://wa.me/?text=${encodedText}`;

    const tg = popover.querySelector('#share-tg');
    if (tg) tg.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(SHARE_TEXT)}`;

    popover.hidden = false;
    document.body.classList.add('popover-open');
  }

  function closeSharePopover() {
    popover.hidden = true;
    document.body.classList.remove('popover-open');
  }

  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSharePopover();
    });
  });
}

