// js/ui/deviceGuide.js — Modul Panduan Spesifikasi Format Label Harga Gantung & Orientasi
import { DEVICE_SPECS } from '../content.js';
import { esc } from '../utils/safe.js';
import { renderIcon } from './icons.js';

export function initDeviceGuide() {
  const container = document.getElementById('device-guide-container');
  if (!container) return;

  const { landscapeNotice, specs } = DEVICE_SPECS;

  container.innerHTML = `
    <div class="device-guide-section reveal" data-fx="tilt">
      <!-- Banner Orientasi Lanskap Meja Kasir -->
      <div class="landscape-banner card" style="margin-bottom:2.2rem">
        <div class="landscape-banner__icon-wrap">
          <div class="phone-rotate-anim" aria-hidden="true">
            <svg class="phone-svg" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <rect x="8" y="14" width="32" height="20" rx="3" />
              <circle cx="35" cy="24" r="1.5" />
            </svg>
            <div class="rotate-arrow">
              ${renderIcon('rotate-right', { size: 14 })}
            </div>
          </div>
        </div>
        <div class="landscape-banner__text">
          <span class="badge-pill badge-pill--gold">Rasio 16:9 Diutamakan</span>
          <h4 class="landscape-banner__title">${esc(landscapeNotice.title)}</h4>
          <p class="landscape-banner__desc">${esc(landscapeNotice.desc)}</p>
        </div>
      </div>

      <!-- Spesifikasi Format Label Harga Gantung (Hanging Price Tags) -->
      <div class="specs-hanging-board">
        <div class="specs-table-head" style="text-align:center;margin-bottom:1.5rem">
          <h4 class="specs-heading" style="justify-content:center;display:flex;align-items:center;gap:.6rem;font-size:1.3rem;color:var(--am-brown-900)">
            ${renderIcon('laptop-code', { size: 22 })} Spesifikasi Gawai (Label Gantung)
          </h4>
          <p class="specs-subheading" style="color:var(--am-muted);font-weight:700;margin:0">Algebra-Mart ringan dan dioptimalkan untuk berbagai gawai sekolah.</p>
        </div>

        <div class="specs-price-tags-wrap">
          ${specs.map((row, idx) => `
            <div class="spec-price-tag reveal" data-reveal="shelf" style="--shelf-rot:${idx % 2 === 0 ? '-1.5deg' : '1.5deg'}">
              <span class="chip" style="font-size:.72rem;align-self:flex-start">${esc(row.category)}</span>
              <div style="margin:.4rem 0">
                <small style="color:var(--am-muted);font-weight:700;display:block">Kebutuhan Minimum:</small>
                <div style="font-weight:800;color:var(--am-brown-900);font-size:.95rem">${esc(row.min)}</div>
              </div>
              <div style="background:var(--am-cream-50);border:1px dashed var(--am-amber-600);border-radius:10px;padding:.6rem;margin-top:auto">
                <small style="color:var(--am-brown-800);font-weight:800;display:flex;align-items:center;gap:.3rem">
                  ${renderIcon('circle-check', { size: 14 })} Rekomendasi Optimal:
                </small>
                <div style="font-weight:800;color:#064937;font-size:.92rem;margin-top:.2rem">${esc(row.opt)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
