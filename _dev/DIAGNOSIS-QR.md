# Diagnosis Masalah Bagian QR Code (`#akses`)

## 1. Hasil Uji Dekode Awal (`_dev/uji-qr.mjs` vs `js/config.js`)
Semua target URL di `js/config.js` telah diuji dekode melalui generator `js/ui/qr.js`:
- **Play Store**: `https://play.google.com/store/apps/details?id=com.ansharudin.algebramart` (49×49 modul, Level H, Rasio Logo 22%) — Dekode cocok 100%.
- **Web Game**: `https://algebramart.github.io/game/` (37×37 modul, Level H, Rasio Logo 22%) — Dekode cocok 100%.
- **Buku Instruksi (Baca Online)**: `https://heyzine.com/flip-book/52f4274171.html` (41×41 modul, Level H, Rasio Logo 22%) — Dekode cocok 100%.
- **Buku Instruksi (Unduh PDF)**: `assets/dokumen/buku-instruksi-algebra-mart.pdf` (diubah ke URL absolut saat render; uji dekode 49×49 modul) — Dekode cocok 100%.
- **Repositori GitHub**: `https://github.com/ansharudinsahid/algebra-mart-7` (41×41 modul, Level H, Rasio Logo 22%) — Dekode cocok 100%.
- **APK Download**: Kosong (`""`) di `js/config.js` — Wajib tidak merender QR dan tidak meninggalkan ruang kosong.

## 2. Akar Masalah yang Ditemukan pada DOM & Kode
- **(a) QR tampil tanpa logo Algebra-Mart di tengah (race condition pada `getLogoImage()` di `js/ui/qr.js`)**:  
  Fungsi `getLogoImage()` menggunakan flag boolean `logoLoadAttempted = true` sebelum gambar selesai dimuat (`onload`). Ketika `initQR()` memulai preload logo (361 KB) lalu `initAccess()` langsung memanggil `renderQRCard()` untuk Play Store, Web, dan Repo, `cachedLogoImage` masih `null` sementara `logoLoadAttempted` sudah `true`, sehingga `getLogoImage()` langsung mengembalikan `null` dan menggambar QR polos tanpa logo.  
  *Solusi*: Simpan dan kembalikan `Promise` yang sedang berjalan (`logoPromise`) agar seluruh pemanggil `createQR()` menunggu satu pemuatan yang sama hingga selesai.
- **(b) Kartu Play Store dan Web tidak sama tinggi & menyisakan ruang kosong besar**:  
  Kolom grid `.access-hub-asymmetric` memakai rasio tidak seimbang (`1.35fr 0.95fr`) serta konten dan tata letak internal kartu yang berbeda (lencana store vs tombol hijau, teks multi-kalimat, serta `justify-content: space-between` yang merenggangkan ruang kosong di tengah).  
  *Solusi*: Gunakan grid `1fr 1fr` dengan `align-items: stretch`, struktur internal kartu yang seragam (pil tunggal, judul, 1 kalimat singkat, tombol utama, QR langsung, keterangan pindai, dan 3 tombol aksi), serta tinggi blok atas yang sejajar.
- **(c) QR tersembunyi di balik tombol lipat ("Tampilkan QR")**:  
  Penggunaan `<details class="qr-disclosure">` menyembunyikan QR di mobile (dan pada `.qr-disclosure--repo` menyembunyikannya di desktop juga).  
  *Solusi*: Hapus seluruh `<details class="qr-disclosure">` dan tombol *"Tampilkan QR"*. Semua QR (Play Store, Web, Buku, APK/Repo bila terisi) tampil langsung tanpa klik di desktop maupun mobile.
- **(d) Ikon panah janggal pada tombol "Tampilkan QR"**:  
  Panah `&darr;` dan aturan rotasinya di `.qr-disclosure__arrow` tidak lagi diperlukan karena panel lipat dihapus sepenuhnya.
- **(e) Ketidaksesuaian konten, warna tombol, dan pil berulang**:  
  1. Kartu masih memuat klaim luring tak terverifikasi (*"dibundel lokal untuk penggunaan luring"*).  
  2. Kartu memiliki 2 pil berulang (*"Aplikasi Resmi Android"*, *"Tersedia di Store"*, *"Akses Instan Peramban"*, *"Tanpa Pasang"*).  
  3. Tombol Play Store memakai SVG tiruan lencana Google Play padahal berkas resmi `assets/img/badge-google-play.*` belum ada.  
  4. Tombol Web memakai warna hijau dengan ikon koin dekoratif, bukan amber (`#f59e0b`) teks cokelat tua dengan tulisan *"Mainkan sekarang"*.

