# Laporan Audit & Pembersihan Berkas Web Algebra-Mart

Tanggal: 31 Oktober 2026

## 1. Ringkasan Ruang Penyimpanan
- **Jumlah Berkas Sebelum:** 190 berkas (di luar `_sumber-game/`, `.git/`, `node_modules/`, `scratch/`)
- **Jumlah Berkas Sesudah:** 184 berkas
- **Total Penghematan:** **±6,7 MB** berkas tidak terpakai dibersihkan.
- **Integritas `_sumber-game/`:** **100% Identik** (2.619 berkas, 0 perbedaan hash SHA-256).

## 2. Berkas yang Dihapus (Aman & Terukur)
1. `assets/game/badges/2212.w032.n002.699B.p15.699.eps` (4.650,4 KB) — Berkas master vektor Adobe Illustrator mentah yang tidak dapat dirender browser dan tidak digunakan dalam situs web.
2. `assets/fonts/Roboto-Medium.woff2` (15,5 KB) — Bobot font yang tidak didaftarkan di CSS (hanya Regular 400, Bold 700, Black 900 yang digunakan).
3. `assets/img/ss-kasir-tutorial.png` (506,1 KB) — Salinan lama di root `assets/img/`, sudah dimigrasikan ke `assets/img/langkah/langkah-03.png`.
4. `assets/img/ss-kasir.png` (506,1 KB) — Salinan lama di root `assets/img/`, sudah dimigrasikan ke `assets/img/hero/hero-4.png`.
5. `assets/img/ss-profil.png` (506,1 KB) — Salinan lama di root `assets/img/`, sudah dimigrasikan ke `assets/img/hero/hero-1.png`.
6. `assets/img/ss-tantangan.png` (506,1 KB) — Salinan lama di root `assets/img/`, sudah dimigrasikan ke `assets/img/hero/hero-2.png`.

## 3. Berkas Ikon & PWA yang Dihasilkan (`assets/icons/`)
Dihasilkan secara otomatis oleh `tools/buat-ikon.mjs`:
- `favicon.ico` (multi-size: 16×16, 32×32, 48×48 px)
- `favicon-16.png` (16×16 px)
- `favicon-32.png` (32×32 px)
- `apple-touch-icon.png` (180×180 px, latar solid krem `#fff1d0`)
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)
- `icon-maskable-512.png` (512×512 px, latar amber `#f59e0b`)
- `site.webmanifest` (manifest aplikasi PWA standar)

## 4. Daftar Inventaris
- Sebelum: `scratch/inventaris-sebelum.txt` (atau `/tmp/inventaris-sebelum.txt`)
- Sesudah: `scratch/inventaris-sesudah.txt` (atau `/tmp/inventaris-sesudah.txt`)

