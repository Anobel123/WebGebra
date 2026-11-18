// ============================================================
//  KONFIGURASI SITUS. Semua tautan akses gim ada di SINI saja.
//  Tautan kosong / bukan https:// => kartu otomatis "Segera Hadir".
// ============================================================
export const SITE_CONFIG = {
  // ====== EDIT DI SINI: tautan akses gim ======
  links: {
    playStore: "https://play.google.com/store/apps/details?id=com.ansharudin.algebramart",
    webGame:   "https://algebramart.github.io/game/",        // URL GitHub Pages hasil hosting gim
    apkDownload: "",      // TODO: tautan unduh APK (GitHub Releases / Drive)
    repo: "https://github.com/ansharudinsahid/algebra-mart-7"
  },
  apkMeta: { size: "", sha256: "" },   // TODO: ukuran (mis. "25 MB") & checksum SHA-256 APK, kosongkan bila belum ada
  contactEmail: "ansharudinsahid@gmail.com",
  competition: { name: "LIDM", year: 2026, category: "IPDP" },
  demoRoomCode: "", // Kode ruang demo untuk Mode Kelas (opsional, kosongkan jika belum ada)
  // PIN Fasilitator (Mode Kelas). Nilai harus persis sama dengan kode gim (_sumber-game/www/js/ui/reports.js).
  fasilitatorPin: {
    tampilkan: true,
    nilai: "1234"
  },
  // Mode tampil kerangka slot gambar kosong: true = tampilkan kotak putus-putus panduan; false = sembunyikan otomatis.
  // Dapat dioverride lewat parameter URL ?slots=1 atau ?slots=0.
  showEmptySlots: true,
  // Dokumen unduhan (array data-driven untuk kartu dokumen di #akses)
  dokumen: [
    {
      id: "buku-instruksi",
      judul: "Manual Book Gim Algebra-Mart",
      deskripsi: "Panduan memainkan Algebra-Mart: membuat profil, mengikuti Level 0, melayani pelanggan, sampai kuis. Berisi juga panduan Ruang Fasilitator untuk guru.",
      sampul: "buku-sampul",
      berkas: "assets/dokumen/buku-instruksi-algebra-mart.pdf",
      bacaOnlineUrl: "https://heyzine.com/flip-book/52f4274171.html",
      namaUnduh: "Buku-Instruksi-Algebra-Mart.pdf",
      versi: "",
      labelUnduh: "Unduh Buku (PDF)",
      qrNoun: "buku"
    },
    {
      id: "modul-ajar",
      judul: "Modul Ajar Gim Algebra-Mart",
      deskripsi: "Modul ajar Matematika SMP Fase D, Kelas VIII, materi bentuk aljabar dan operasinya. Berisi RPP model PBL, materi ajar, serta asesmen dan lembar soal.",
      sampul: "modul-sampul",
      berkas: "assets/dokumen/modul-ajar-algebra-mart.pdf",
      bacaOnlineUrl: "https://heyzine.com/flip-book/d04c34bbc6.html",
      namaUnduh: "Modul-Ajar-Algebra-Mart.pdf",
      versi: "",
      labelUnduh: "Unduh Modul (PDF)",
      qrNoun: "modul"
    }
  ],
  // URL publik situs ini (dipakai tombol Bagikan). Kosong => fallback ke location.origin + location.pathname.
  siteUrl: "https://anobel123.github.io/WebGebra/"
};

/** URL valid = string, berskema https://, dan bisa di-parse. */
export function isValidUrl(u) {
  if (typeof u !== 'string' || !/^https:\/\//i.test(u.trim())) return false;
  try { new URL(u.trim()); return true; } catch { return false; }
}

/** Validasi config saat startup; peringatan hanya ke console. */
export function validateConfig(cfg = SITE_CONFIG) {
  const warn = (m) => console.warn('[config]', m);
  if (!cfg || typeof cfg !== 'object') { warn('SITE_CONFIG tidak valid'); return; }
  if (!cfg.links || typeof cfg.links !== 'object') { warn('links hilang'); return; }
  for (const k of ['playStore', 'webGame', 'apkDownload', 'repo']) {
    const v = cfg.links[k];
    if (typeof v !== 'string') warn(`links.${k} harus string`);
    else if (v && !isValidUrl(v)) warn(`links.${k} bukan URL https:// yang valid, kartu jadi "Segera Hadir"`);
    else if (!v) warn(`links.${k} kosong (TODO)`);
  }
  if (!cfg.contactEmail) warn('contactEmail kosong (TODO)');
  if (!cfg.competition?.category) warn('competition.category kosong');
  if (cfg.siteUrl && !isValidUrl(cfg.siteUrl)) warn('siteUrl bukan URL https:// yang valid');
}

