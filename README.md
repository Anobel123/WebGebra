# Algebra-Mart: Web Preview (LIDM 2026)

Situs preview produk untuk gim edukasi **Algebra-Mart**. HTML + CSS + JavaScript murni (ES modules), tanpa build, semua aset lokal.

## Struktur

```
index.html
css/     tokens, base, components, sections, animations
js/      main.js, config.js (SEMUA LINK), content.js, content-data.js, ui/*.js, utils/safe.js
assets/  img/ (screenshot, foto, logo), game/ (aset dari repo gim), icons/, fonts/ (Roboto)
libs/    qrcode.js (qrcode-generator 2.0.4, MIT, build ES module)
```

`js/content-data.js` dibuat dari repo gim (level, kuis, lencana) lewat `scratch/gen.mjs`. Boleh diedit manual.

## Menjalankan lokal

Modul ES **tidak dapat dimuat dari `file://`** oleh Chrome/Edge. Gunakan server lokal:

```
python -m http.server 8000     # lalu buka http://localhost:8000
```

Tanpa server, hanya konten statis yang tampil (ada pesan di layar). Di GitHub Pages semuanya berjalan normal.

## Deploy ke GitHub Pages

1. Dorong isi folder ini ke repo GitHub (folder `_sumber-game/` dan `scratch/` sudah diabaikan oleh `.gitignore`).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)`.
3. Buka `https://<user>.github.io/<repo>/`.

## Cara mengganti link game

Semua tautan ada di **`js/config.js`** (bagian `links`):

| Tautan | Baris | Contoh |
|---|---|---|
| Google Play Store | 8 | `https://play.google.com/store/apps/details?id=com.ansharudin.algebramart` |
| Pratinjau Web (GitHub Pages gim) | 9 | `https://ansharudinsahid.github.io/<repo>/` |
| Unduh APK | 10 | tautan GitHub Releases / Drive |
| Ukuran & checksum APK (opsional) | 13 | `{ size: "25 MB", sha256: "..." }` |
| Email kontak | 14 | `nama@email.com` |
| Kategori lomba | 15 | `category: "..."` |

Aturan: tautan harus diawali `https://`. Bila kosong/tidak valid, kartu otomatis menjadi **"Segera Hadir"** (tombol nonaktif, QR diganti koin). Bila valid, QR dibuat otomatis di browser, lengkap dengan tombol **Unduh QR (PNG)** dan **Salin tautan**.

## Sistem Slot Gambar & Panduan Berkas

Seluruh gambar di Web Algebra-Mart menggunakan sistem slot terpusat (`js/slots.js`) dengan deteksi otomatis format berkas (`.webp`, `.png`, `.jpg`, `.jpeg`, `.svg`).

- Panduan lengkap pengisian gambar: **[PANDUAN-ISI-GAMBAR.md](PANDUAN-ISI-GAMBAR.md)**
- Setiap subfolder di `assets/` dilengkapi berkas panduan `README.md` lokal.
- Jalankan audit slot gambar kapan saja dengan:
  ```bash
  node tools/cek-slot.mjs
  # atau perbarui manifest & panduan markdown:
  node tools/cek-slot.mjs --tulis
  ```

| Folder | Isi / Peruntukan |
|---|---|
| `assets/logo/` | Logo Algebra-Mart (persegi & horizontal), Logo Tim, Logo Kampus, Logo LIDM, Favicon |
| `assets/tim/` | Foto 4 anggota tim (`tim-zakky-...`, `tim-ansharudin-...`, `tim-jean-...`, `tim-alfredo-...`) |
| `assets/validator/` | Foto dosen pembimbing & validator |
| `assets/img/hero/` | 4 screenshot utama hero carousel (`hero-1.png` s.d. `hero-4.png`) |
| `assets/img/langkah/` | 15 screenshot stepper Cara Bermain (`langkah-00.png` s.d. `langkah-14.png`) |
| `assets/img/guru/` | 5 screenshot Panduan Guru & Mode Kelas (`guru-01.png` s.d. `guru-05.png`) |
| `assets/img/kelas/` | Banner / infografis fitur Mode Kelas (`kelas-preview.png`) |
| `assets/img/og/` | Banner pratinjau sosial media OpenGraph / Twitter (`og-image.png`) |

## Pembuat Ikon Otomatis (Favicon & PWA)

Cukup letakkan logo game persegi (disarankan 1024×1024 px PNG) di `assets/logo/logo-algebra-mart.png`, lalu jalankan **SATU** perintah berikut:

```bash
node tools/buat-ikon.mjs
```

Perintah di atas akan membaca logo dan otomatis menghasilkan seluruh set ikon di folder `assets/icons/`:
- `favicon.ico` (multi-resolusi: 16×16, 32×32, 48×48 px)
- `favicon-16.png` & `favicon-32.png` (tab browser)
- `apple-touch-icon.png` (180×180 px dengan latar solid krem `#fff1d0`)
- `icon-192.png` & `icon-512.png` (ikon web PWA standar)
- `icon-maskable-512.png` (ikon PWA aman potong pada latar amber `#f59e0b`)

### Cara Menaikkan Versi Cache Ikon
Untuk memperbarui cache browser pengunjung seketika setelah memperbarui logo/ikon, cukup naikkan parameter query versi `?v=...` pada tag `<link>` di dalam `<head>` berkas `index.html`:
```html
<link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico?v=2">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32.png?v=2">
<link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16.png?v=2">
<link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png?v=2">
```
Cukup ubah `v=1` menjadi `v=2`, `v=3`, dst. saat merilis pembaruan logo.
| **Foto Dosen Pembimbing** | `assets/img/pembimbing-tria.png` | 400×400 px (1:1) | Kartu ID Dr. Tria Gustiningsi, M.Pd. |
| **Thumbnail Share (OG)** | `assets/img/og-image.png` | 1200×630 px | Pratinjau saat link web dibagikan di WhatsApp/medsos |

Selama berkas belum ditaruh di `assets/img/`, website otomatis menampilkan kartu emblem/inisial emas bertema `#064937` tanpa ikon gambar rusak (*broken image*). Begitu berkas dimasukkan dengan nama yang sesuai, gambar langsung tampil otomatis.

## Mengganti Kutipan Ilustrasi "Kelas Algebra-Mart" dengan Masukan Siswa Sungguhan

Secara bawaan, 20 karakter pada sub-bagian **Kelas Algebra-Mart** (`#tentang`) menggunakan cerita ilustrasi dengan label kejujuran:
> *"Karakter dan kutipan ini ilustrasi untuk menggambarkan pengalaman bermain, bukan testimoni siswa."*

Jika kelak tim sudah memiliki data masukan dari uji coba siswa sungguhan, ikuti langkah berikut di **`js/data/kelas.js`**:

1. Buka `js/data/kelas.js`.
2. Pada baris 7, ubah konstanta `KELAS_SUMBER_DEFAULT` menjadi `'nyata'`, atau ubah field `sumber: 'nyata'` pada tiap objek di dalam array `KELAS_DATA`:
   ```js
   export const KELAS_SUMBER_DEFAULT = 'nyata';
   ```
3. Sesuaikan isi `nama`, `inisial`, `tag`, `bubble` (maks ±45 karakter untuk gelembung di atas kartu), dan `cerita` (2–3 kalimat untuk papan dialog) pada masing-masing objek di `KELAS_DATA`.
4. Begitu seluruh item berstatus `sumber: 'nyata'`, label di bawah judul otomatis berubah menjadi:
   > *"Masukan dari pemain uji coba Algebra-Mart."*
   (Teks label ini juga dapat disesuaikan di objek `KELAS_LABELS` pada baris 9–12 `js/data/kelas.js`).

## Pengaturan Header Bar Progress & Kelas Algebra-Mart

- **Simbol koin per bagian (`js/ui/scrollProgress.js` baris 8–21)**:
  Objek `SCROLL_PROGRESS_CONFIG.sectionSymbols` mengatur simbol di dalam koin emas saat melewati tiap bagian (`beranda: 'x'`, `tentang: '+'`, `materi: '='`, `akses: 'Rp'`, `profil: 'd'`).
- **Interval autoplay, kecepatan mengetik & jumlah kolom (`js/ui/kelas.js` baris 10–20)**:
  Objek `KELAS_CONFIG` mengatur `autoplayIntervalMs` (`6500` ms), `typingSpeedCharsPerSec` (`25` karakter/detik), `autoplayDefault` (`true`), serta jumlah kolom grid (`desktop: 7`, `tablet: 4`, `mobile: 3`).
- **Durasi Layar Pembuka (`js/ui/opening.js` baris 9–18)**:
  Objek `OPENING_CONFIG` mengatur `minDurationMs` (`1200` ms), `maxDurationMs` (`3000` ms), `shutterDurationMs` (`700` ms), dan daftar gambar preload hero.
- **Pengaturan Suara BGM & SFX (`js/ui/audio.js` baris 8–28)**:
  Objek `AUDIO_CONFIG` mengatur `defaultVolumePct` (`40`), `maxVolumeCap` (`0.5`), `bgmFadeMs` (`600` ms), serta pemetaan berkas di `assets/audio/`.

## Catatan konten

- Klaim luring diverifikasi: state pemain disimpan di `localStorage` (`www/js/core/state.js`) dan `sync.js` punya fallback luring. Teks yang dipakai: *"Bermain dapat dilakukan luring; sinkronisasi Mode Kelas membutuhkan internet."*
- Jenjang ditulis "SMP (Fase D, Kurikulum Merdeka), topik bentuk aljabar", tanpa menyebut kelas.
- Repo hanya menyebut rentang **C1-C3** untuk level 1-10, sehingga situs tidak mengarang jenjang C per level di sana.

## Status Konfigurasi & Panduan Tambahan

- **Play Store**: Tautan resmi `https://play.google.com/store/apps/details?id=com.ansharudin.algebramart` telah dihubungkan langsung ke tombol dan QR code Play Store (kartu aktif, tidak lagi "Segera Hadir").
- **Kategori Kompetisi**: Diatur ke `"IPDP"` (Inovasi Pembelajaran Digital Pendidikan) untuk LIDM 2026.
- **Cara Bermain & Panduan Perangkat**: Bagian interaktif 15 langkah (0–14) dengan 4 tahap, screenshot asli gim, tips cepat, dan panduan guru (PIN: 1234) telah aktif di bawah `#akses`.
- **FAQ & SEO**: Akordeon tanya jawab lengkap dengan injeksi dinamis skema `FAQPage` dan `SoftwareApplication` telah terpasang. Pertanyaan yang kosong otomatis disembunyikan.
- **Berbagi Tautan**: Tombol Bagikan di `#akses` dan Footer mendukung WhatsApp, Telegram, salin clipboard, serta Web Share API native.
- **Thumbnail Medsos (OG Image)**: `assets/img/og-image.png` (1200×630) dapat dibuat ulang kapan saja menggunakan perintah `node tools/generate-og-image.mjs`.

### Konfigurasi Opsional Saat Deployment Publik:
1. `siteUrl` di `js/config.js`: Isi dengan URL publik GitHub Pages final (mis. `https://ansharudinsahid.github.io/algebra-mart/`). Bila dibiarkan kosong, sistem otomatis memakai `location.origin + location.pathname`.
2. `demoRoomCode` di `js/config.js`: Kode ruang simulasi kelas untuk juri/guru jika ada (mis. `"DEMO-1234"`). Bila kosong, kotak kode ruang tidak ditampilkan.
3. FAQ nomor 9 & 10 di `js/content.js`: Sengaja dikosongkan (`a: ""`, `tampil: false`). Jika tim ingin menambah FAQ baru, cukup isi teks pertanyaan dan jawaban pada objek tersebut.

