// js/ui/aboutScrolly.js — Pengendali Scrollytelling Reaktif Meja Kasir (#tentang)
import { esc } from '../utils/safe.js';

const PILLAR_SCENARIOS = {
  1: {
    speaker: 'Pesanan Dodol Nanas khas Jambi:',
    dialog: '“Tolong siapkan 3 batang dodol nanas seharga d rupiah. Eh, tambahkan 4 batang dodol nanas lagi untuk oleh-oleh.”',
    equation: '3d + 4d = 7d',
    status: 'Suku Sejenis Dodol (d)',
    badge: 'Pilar 01 / 03'
  },
  2: {
    speaker: 'Buku Kas & Transaksi Finansial:',
    dialog: '“Pendapatan Rp 21.000, modal Rp 10.500. Hitung laba bersih dan sisihkan infaq kemanusiaan.”',
    equation: 'Laba = Rp 10.500 · Infaq = Rp 1.050',
    status: 'Laba Kasir & Infaq Sosial',
    badge: 'Pilar 02 / 03'
  },
  3: {
    speaker: 'Etalase Prestasi & Karier Kasir:',
    dialog: '“Kumpulkan 20 lencana prestasi, raih gelar Sultan Aljabar, dan masuki Papan Kehormatan!”',
    equation: '20 Lencana · 6 Gelar Karier',
    status: 'Gamifikasi & Papan Kehormatan',
    badge: 'Pilar 03 / 03'
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
