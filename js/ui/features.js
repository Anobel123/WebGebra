import { FEATURES } from '../content.js';
import { esc } from '../utils/safe.js';

export function initFeatures() {
  const el = document.getElementById('features');
  if (!el) return;

  el.className = 'features-asymmetric reveal';
  el.innerHTML = FEATURES.map((f, idx) => {
    if (f.receipt) {
      const itemsHtml = f.receipt.items.map(it => `
        <div class="receipt-item-row">
          <span class="receipt-item-name">${esc(it.name)}</span>
          <span class="receipt-leader-dots" aria-hidden="true"></span>
          <span class="receipt-item-price">${esc(it.price)}</span>
        </div>
      `).join('');

      return `
        <article class="receipt-card reveal" data-reveal="shelf" style="--shelf-rot:-1.5deg">
          <div class="receipt-teeth" aria-hidden="true"></div>
          <div class="receipt-card__inner">
            <div class="receipt-card__header">
              <span class="receipt-stamp">${esc(f.badge)}</span>
              <h3 class="receipt-title">${esc(f.t)}</h3>
              <p class="receipt-desc">${esc(f.d)}</p>
            </div>
            <div class="receipt-paper" aria-label="Simulasi Struk Buku Kas">
              <div class="receipt-paper__shop">${esc(f.receipt.shop)}</div>
              <div class="receipt-paper__meta">NOMOR: ${esc(f.receipt.no)} · MEJA KASIR 01</div>
              <div class="receipt-divider">================================</div>
              <div class="receipt-items">${itemsHtml}</div>
              <div class="receipt-divider">--------------------------------</div>
              <div class="receipt-total-row">
                <strong>${esc(f.receipt.total)}</strong>
              </div>
              <div class="receipt-cash-row">
                <small>${esc(f.receipt.pay)}</small>
              </div>
            </div>
          </div>
          <div class="receipt-teeth-bottom" aria-hidden="true"></div>
        </article>
      `;
    }

    return `
      <article class="apparatus-card card reveal" data-reveal="shelf" style="--shelf-rot:${idx % 2 === 0 ? '1.5deg' : '-1.5deg'}">
        <span class="apparatus-badge">${esc(f.badge)}</span>
        <h3 class="apparatus-title">${esc(f.t)}</h3>
        <p class="apparatus-desc">${esc(f.d)}</p>
      </article>
    `;
  }).join('');
}

