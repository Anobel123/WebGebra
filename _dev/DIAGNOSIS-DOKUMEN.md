# Diagnosis Bagian Dokumen (`#akses`)

## 1. Definisi Dokumen di `js/config.js`
Di `js/config.js`, kedua dokumen awalnya disimpan sebagai objek bersarang (`SITE_CONFIG.dokumen.bukuInstruksi` dan `SITE_CONFIG.dokumen.modulAjar`):
- **Buku Instruksi (`bukuInstruksi`)**:
  - `berkas`: `assets/dokumen/buku-instruksi-algebra-mart.pdf` (~1,05 MB)
  - `bacaOnlineUrl`: `https://heyzine.com/flip-book/52f4274171.html`
- **Modul Ajar (`modulAjar`)**:
  - `berkas`: `assets/dokumen/modul-ajar-algebra-mart.pdf` (~1,08 MB)
  - `bacaOnlineUrl`: `https://heyzine.com/flip-book/d04c34bbc6.html`

Kedua URL `bacaOnlineUrl` sudah terisi, berawalan `https://`, dan **berbeda** satu sama lain (tidak tertukar).

## 2. Penyebab Munculnya Huruf "D" pada Tombol Unduh
Pada `js/ui/bukuInstruksi.js`, kedua tombol unduh memanggil `${renderIcon('download', { size: 18 })}`.
Di `js/ui/icons.js`, nama ikon `'download'` tidak terdaftar di kamus SVG, sehingga `renderIcon()` masuk ke jalur fallback:
```js
const fallbackChar = cleanName ? cleanName.charAt(0).toUpperCase() : '•';
// Menghasilkan huruf "D" di dalam lingkaran SVG
```
Solusi: mengganti seluruh tombol unduh dan baca online dengan satu komponen SVG inline seragam (panah ke bawah dengan garis dasar untuk unduh, dan ikon tautan-keluar untuk Baca Online), serta mendaftarkan `'download'` di `icons.js` agar tidak ada fallback huruf di tempat lain.

## 3. Duplikasi Komponen & Perbedaan Struktur Kartu
Sebelumnya `js/ui/bukuInstruksi.js` merender kartu Buku dan kartu Modul melalui dua blok markup HTML terpisah yang terduplikasi:
- Kartu Buku memiliki `#buku-qr-container` (QR + segmen Baca Online / Unduh PDF).
- Kartu Modul sama sekali **tidak** memiliki wadah QR.
- Kedua kartu memakai dua pil berulang (*"Buku Panduan Gim"*, *"Perangkat Ajar · RPP & Soal"*, dan pil ukuran).

Solusi: `SITE_CONFIG.dokumen` diubah menjadi array `dokumen[]` berisi `{ id, judul, deskripsi, sampul, berkas, bacaOnlineUrl, namaUnduh, versi, labelUnduh, qrNoun }`, dan `js/ui/bukuInstruksi.js` merender seluruh kartu melalui **satu** fungsi komponen data-driven.

