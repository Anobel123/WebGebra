// js/ui/deviceGuide.js — Modul Panduan Perangkat & Orientasi Layar
import { DEVICE_SPECS } from '../content.js';
import { esc } from '../utils/safe.js';
import { renderIcon } from './icons.js';

export function initDeviceGuide() {
  const container = document.getElementById('device-guide-container');
  if (!container) return;

  const { landscapeNotice, specs } = DEVICE_SPECS;

  container.innerHTML = `
    <div class="device-guide-section reveal" data-fx="tilt">
      <!-- Banner Orientasi Lanskap -->
      <div class="landscape-banner card">
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

      <!-- Tabel Spesifikasi Perangkat -->
      <div class="specs-table-card card">
        <div class="specs-table-head">
          <h4 class="specs-heading">${renderIcon('laptop-code', { size: 22 })} Spesifikasi Perangkat yang Didukung</h4>
          <p class="specs-subheading">Algebra-Mart ringan dan dioptimalkan untuk berbagai gawai sekolah.</p>
        </div>

        <div class="specs-table-wrapper">
          <table class="specs-table">
            <thead>
              <tr>
                <th scope="col">Perangkat / Parameter</th>
                <th scope="col">Kebutuhan Minimum</th>
                <th scope="col" class="th-opt">Rekomendasi Optimal</th>
              </tr>
            </thead>
            <tbody>
              ${specs.map(row => `
                <tr>
                  <th scope="row" class="spec-cat-col">${esc(row.category)}</th>
                  <td class="spec-min-col"><span class="spec-label-mobile">Minimum: </span>${esc(row.min)}</td>
                  <td class="spec-opt-col"><span class="spec-label-mobile">Optimal: </span><span class="spec-opt-badge">${renderIcon('circle-check', { size: 16 })} ${esc(row.opt)}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
