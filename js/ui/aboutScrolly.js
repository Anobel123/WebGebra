// js/ui/aboutScrolly.js — Pengendali Scrollytelling Reaktif Meja Kasir (#tentang)
import { esc } from '../utils/safe.js';

const PILLAR_SCENARIOS = {
  1: {
    speaker: 'Pesanan Dodol Nanas Muaro Jambi:',
    dialog: '“Tolong 3 ikat dodol nanas ya kasir, eh tambah 4 ikat lagi!”',
    equation: '3d + 4d = 7d',
    status: 'Suku Sejenis Dodol (d)',
    badge: 'Pilar 01 / 05'
  },
  2: {
    speaker: 'Pesanan Dodol & Tempoyak:',
    dialog: '“Saya beli 3 dodol nanas dan 2 tempoyak, bisa jadi 5 dodol-tempoyak?”',
    equation: '3d + 2t ≠ 5dt',
    status: 'Beda Barang, Jangan Dilebur!',
    badge: 'Pilar 02 / 05'
  },
  3: {
    speaker: 'Jenjang Karier Kasir Toko:',
    dialog: '“Dari kasir pemula Level 1 sampai mahir memimpin toko di Level 20!”',
    equation: 'Level 1 (C1) → Level 20 (C6)',
    status: 'Scaffolding 5 Fase Belanja',
    badge: 'Pilar 03 / 05'
  },
  4: {
    speaker: 'Laci Kasir & Kembalian Tunai:',
    dialog: '“Belanja Rp16.000, dibayar pakai uang Rp20.000. Kembaliannya berapa?”',
    equation: 'Kembalian = Rp4.000',
    status: 'Buku Kas & Uang Tunai Riil',
    badge: 'Pilar 04 / 05'
  },
  5: {
    speaker: 'Mode Belanja Sekolah & 3T:',
    dialog: '“Sinyal internet tidak stabil? Gim tetap bisa dimainkan tanpa hambatan!”',
    equation: '100% Luring · 0 KB Kuota',
    status: 'Mode Mandiri Sekolah',
    badge: 'Pilar 05 / 05'
  }
};

export function initAboutScrolly() {
  const panel = document.getElementById('about-scrolly-panel');
  const pillars = document.querySelectorAll('.scrolly-pillar-item');
  if (!panel || !pillars.length) return;

  const speakerEl = document.getElementById('scrolly-speaker');
  const dialogEl = document.getElementById('scrolly-dialog');
  const equationEl = document.getElementById('scrolly-equation');
  const statusEl = document.getElementById('scrolly-status');
  const badgeEl = document.getElementById('scrolly-step-badge');

  let activePilar = 1;

  function updatePillar(num) {
    if (activePilar === num && speakerEl.textContent.trim()) return;
    activePilar = num;
    const data = PILLAR_SCENARIOS[num];
    if (!data) return;

    if (speakerEl) speakerEl.textContent = data.speaker;
    if (dialogEl) dialogEl.textContent = data.dialog;
    if (equationEl) equationEl.textContent = data.equation;
    if (statusEl) statusEl.textContent = data.status;
    if (badgeEl) badgeEl.textContent = data.badge;

    pillars.forEach((p) => {
      const pNum = +p.dataset.scrollyPilar;
      p.classList.toggle('is-active-pillar', pNum === num);
    });
  }

  // Set default pilar 1 saat inisialisasi
  updatePillar(1);

  // Deteksi pilar yang sedang aktif saat scroll
  let ticking = false;
  function onScrollCheck() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const triggerY = window.innerHeight * 0.45;
      let closestPilar = 1;
      let minDistance = Infinity;

      pillars.forEach((p) => {
        const rect = p.getBoundingClientRect();
        // jarak pusat pilar ke titik pemicu viewport
        const pMid = rect.top + rect.height * 0.4;
        const dist = Math.abs(pMid - triggerY);
        if (dist < minDistance && rect.top <= window.innerHeight * 0.85 && rect.bottom >= window.innerHeight * 0.15) {
          minDistance = dist;
          closestPilar = +p.dataset.scrollyPilar || 1;
        }
      });

      updatePillar(closestPilar);
    });
  }

  window.addEventListener('scroll', onScrollCheck, { passive: true });
}
