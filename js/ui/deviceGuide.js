// js/ui/deviceGuide.js — Modul Panduan Spesifikasi Perangkat
import { DEVICE_SPECS } from '../content.js';
import { esc } from '../utils/safe.js';
import { renderIcon } from './icons.js';

export function initDeviceGuide() {
  const container = document.getElementById('device-guide-container');
  if (!container) return;

  const { specs, intro, note } = DEVICE_SPECS;

  container.innerHTML = `
    <div class="specs-table-card reveal" data-reveal="fade">
      <div class="specs-table-head">
        <h3 class="specs-heading">
          ${renderIcon('laptop-code', { size: 22 })} Spesifikasi Perangkat
        </h3>
        <p class="specs-subheading">${esc(intro || 'Gim berjalan langsung di peramban tanpa instalasi tambahan, dan tersedia sebagai aplikasi Android.')}</p>
      </div>

      <div class="specs-table-wrapper">
        <table class="specs-table">
          <thead>
            <tr>
              <th scope="col" style="width: 25%;">Komponen</th>
              <th scope="col" style="width: 37.5%;">Minimum</th>
              <th scope="col" style="width: 37.5%;">Rekomendasi</th>
            </tr>
          </thead>
          <tbody>
            ${specs.map((row) => `
              <tr>
                <td class="spec-cat-col"><strong>${esc(row.component)}</strong></td>
                <td class="spec-min-col">
                  <span class="spec-label-mobile">Minimum: </span>
                  ${esc(row.min)}
                </td>
                <td class="spec-opt-col">
                  <span class="spec-label-mobile">Disarankan: </span>
                  ${esc(row.rec)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <p class="specs-note" style="margin:1.2rem 0 0;font-size:0.88rem;color:var(--am-brown-700);font-weight:600">
        ${esc(note || 'Sinkronisasi Mode Kelas membutuhkan koneksi internet.')}
      </p>
    </div>
  `;
}
