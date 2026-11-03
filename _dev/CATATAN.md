# Catatan Pengembang Algebra-Mart (Internal)

Dokumen ini berisi panduan teknis internal untuk pemeliharaan, penggantian tautan, pembaruan ikon/logo, dokumen unduhan, dan manajemen aset media. File ini berada di dalam folder `_dev/` yang diabaikan oleh Git (`.gitignore`).

---

## 1. Konfigurasi Tautan & Kontak Situs
Seluruh tautan akses eksternal diatur secara terpusat di `js/config.js` (`SITE_CONFIG`):

- **Play Store**: `SITE_CONFIG.links.playStore`
- **Versi Web**: `SITE_CONFIG.links.webGame`
- **Unduh APK**: `SITE_CONFIG.links.apkDownload` (jika kosong, kartu otomatis berstatus "Segera Hadir")
- **Repositori GitHub**: `SITE_CONFIG.links.repo`
- **Email Kontak**: `SITE_CONFIG.contactEmail`
- **URL Publik Situs**: `SITE_CONFIG.siteUrl` (digunakan oleh fitur "Bagikan" dan skema JSON-LD)

---

## 2. Pembuatan & Pembaruan Ikon / Favicon PWA
Jika file logo game `assets/logo/logo-algebra-mart.png` (atau `.webp` / `.svg`) diperbarui:

1. Jalankan perintah otomatis:
   ```bash
   node _dev/buat-ikon.mjs
   ```
2. Skrip akan memperbarui 7 berkas ikon di `assets/icons/`:
   - `favicon.ico` (multi-resolusi 16, 32, 48)
   - `favicon-16.png`, `favicon-32.png`
   - `apple-touch-icon.png` (180×180 latar solid krem)
   - `icon-192.png`, `icon-512.png`
   - `icon-maskable-512.png` (512×512 dengan zona aman 80% latar amber)
3. **Cache Busting**: Bila tab browser masih memuat favicon lama, naikkan parameter versi di tag `<link rel="icon" ... ?v=2>` pada `index.html`.

---

## 3. Buku Instruksi Algebra-Mart (Dokumen PDF)
- **Lokasi File**: `assets/dokumen/buku-instruksi-algebra-mart.pdf`
- **Konfigurasi**: `SITE_CONFIG.dokumen.bukuInstruksi` di `js/config.js`
  - `berkas`: path relatif berkas PDF.
  - `judul`: nama judul dokumen.
  - `namaUnduh`: nama berkas saat diunduh pengunjung (mis. `Buku-Instruksi-Algebra-Mart.pdf`).
  - `versi`: string versi untuk cache-busting (mis. `"1.1"` atau timestamp).
- **Deteksi Otomatis**:
  - Halaman web melakukan permintaan HEAD ke file PDF saat dimuat.
  - Jika file ditemukan (HTTP 200), ukuran berkas dihitung dari header `Content-Length` dan ditampilkan sebagai badge (mis. `PDF · 26,6 MB`).
  - Jika berkas belum diunggah (HTTP 404), tombol unduh otomatis berstatus "Segera Hadir" tanpa memunculkan error console.
- **Sampul Buku (Opsional)**:
  - Format yang disarankan: `assets/img/buku/sampul.webp` (rasio 3:4 portrait, disarankan 900×1200 px).
  - Jika file sampul belum diunggah, web otomatis menampilkan kerangka slot (bila `showEmptySlots: true`) atau sampul CSS bergaya buku eksklusif (bila `showEmptySlots: false`).

---

## 4. Sistem Slot Gambar & Penambahan Aset
Sistem slot gambar dikelola melalui `js/slots.js`:
- Aturan baku: **"Satu slot = satu berkas"** dengan format WebP terkompresi (kualitas ~82) untuk performa optimal.
- Ekstensi yang didukung: `.webp`, `.png`, `.jpg`, `.jpeg`, `.svg`.
- Untuk memeriksa status slot:
  ```bash
  node _dev/cek-slot.mjs
  ```
- Untuk memperbarui manifest cepat `js/slot-manifest.js`:
  ```bash
  node _dev/cek-slot.mjs --tulis
  ```

---

## 5. Menjalankan Situs Secara Lokal
Jalankan server statis lokal sederhana dengan salah satu perintah:
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js npx
npx serve .
```
Buka peramban di `http://localhost:8000`.

---

## 6. Pengelolaan Kode QR & Logo Terpusat (`js/ui/qr.js`)

Seluruh kode QR di website diproduksi secara terpusat oleh satu modul `js/ui/qr.js` menggunakan library lokal `libs/qrcode.js` dengan koreksi kesalahan **Level H** (~30% recovery capacity) dan modul persegi standar berwarna cokelat tua `#451a03` di atas latar krem terang `#fff8e6`.

### A. Cara Mengganti Logo QR
1. Simpan logo baru berformat persegi (1:1) di `assets/logo/logo-algebra-mart.png` (resolusi disarankan 512×512 px).
2. Jika path atau nama berkas logo berubah, perbarui konstanta `QR_CONFIG.logo.src` di bagian atas file `js/ui/qr.js`.
3. Bila file logo gagal dimuat atau belum ada, modul secara otomatis melakukan fallback anggun ke QR standar polos tanpa logo (tetap dapat dipindai dan tanpa error console).

### B. Cara Mengatur / Menyetel Rasio Logo
Rasio pelat logo diatur di konstanta `QR_CONFIG.logo` pada `js/ui/qr.js`:
- `maxRatioNormal: 0.22`: Ukuran sisi pelat logo maksimal 22% dari sisi area modul QR (~5% total luas area). Batas aman standar koreksi Level H.
- `maxRatioDense: 0.18`: Otomatis mengecil menjadi 18% jika jumlah modul QR melebihi 57 per sisi (misal URL panjang).
- `denseThreshold: 57`: Batas jumlah modul untuk memicu rasio padat (dense ratio).
- `warningThreshold: 69`: Jika URL menghasilkan >69 modul/sisi, sistem mencatat peringatan di console agar URL diperpendek.

### C. Menjalankan Uji Keterbacaan QR (`uji-qr`)
Uji otomatis keterbacaan QR memverifikasi bahwa seluruh varian QR (Play Store, Web, Buku Baca, Buku Unduh, APK, Repo, dan URL Panjang) terbaca sempurna oleh library dekoder pada ukuran 2048px, 300px, 200px, 150px, kondisi blur ringan, serta kontras -30%:
```bash
node _dev/uji-qr.mjs
```
Skrip akan mencetak tabel hasil uji (Lulus/Gagal) dan memastikan status 100% Lulus.

### D. Format Unduhan QR (PNG & SVG)
- **PNG**: Resolusi ultra-tinggi 2048×2048 px solid krem dengan zona tenang 4 modul dan logo di tengah. Nama berkas: `qr-algebra-mart-<jenis>.png`.
- **SVG**: Modul berbentuk vektor dan logo tertanam sebagai data URI base64, siap dipakai di Canva, Illustrator, Figma, atau cetak spanduk skala besar.

## 7. Aturan Penulisan Teks & Bebas Kebocoran Desain

Untuk menjaga profesionalisme, akurasi dokumen resmi, dan kenyamanan membaca pengunjung, seluruh pengembang wajib mematuhi empat aturan penulisan teks berikut:

- **Aturan 1: Pemisahan Metafora & Teks Tampilan**  
  Nama gaya visual (analogi minimarket/toko kelontong) adalah metafora perancangan arsitektur antarmuka, **BUKAN** teks tampilan yang dibaca pengguna. Jangan pernah menuliskan istilah internal rancangan ke antarmuka publik atau teks pembaca layar (screen reader), antara lain: *"label gantung"*, *"label harga"*, *"struk"* (kecuali dalam konteks struk transaksi belanja riil di dalam gim), *"papan menu"*, *"papan kapur"*, *"rak"*, *"etalase"*, *"ban berjalan"*, *"meja kasir"* (sebagai judul gaya), *"clipboard/papan jepit"*, *"kanopi"*, *"rolling door"*, *"ID Card"* (sebagai judul gaya), *"scrollytelling"*, *"bottom sheet"*, *"sticky"*, *"slot"*, *"placeholder"*, *"fallback"*, *"TODO"*, *"mockup"*, serta nama berkas/ekstensi file teknis.

- **Aturan 2: Kebenaran Fakta & Rujukan Resmi**  
  Setiap fakta teknis (spesifikasi perangkat, sistem operasi, peramban, koneksi, orientasi layar, fitur gim, dan alur ruang kelas) **WAJIB** bersumber langsung dari dokumen panduan resmi atau kode implementasi gim. Dilarang keras mengarang atau menambahkan angka estimasi spekulatif sendiri (seperti Intel Celeron, AMD Ryzen, kapasitas RAM, Android 7.0, resolusi layar 5.5 inci, sebutan *Mode Solo*, atau *papan peringkat real-time*).

- **Aturan 3: Bebas Klise & Klaim Kosong**  
  Hindari basa-basi klise pemasaran dan klaim tanpa substansi (seperti *"ringan dan dioptimalkan untuk berbagai gawai sekolah"*, *"teknologi mutakhir"*, dsb.). Tampilkan fakta yang jelas, lugas, dan fungsional, atau hapus kalimat tersebut jika tidak memuat informasi esensial.

- **Aturan 4: Konsolidasi & Tidak Redundan**  
  Sajikan satu informasi di satu tempat yang tepat dengan hierarki visual yang efisien. Jangan menduplikasi label berulang kali (misalnya mengulang tulisan *"Kebutuhan Minimum:"* dan *"Rekomendasi Optimal:"* di setiap baris atau kartu, padahal sudah didefinisikan secara tegas di kepala kolom tabel).



