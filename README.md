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

## Daftar Berkas Lampiran yang Perlu Diisi (`assets/img/`)

Cukup taruh berkas gambar ke dalam folder `assets/img/` dengan nama persis di bawah ini (tanpa perlu mengubah kode HTML/JS):

| Kategori | Path & Nama File | Ukuran Rekomendasi | Tempat Tampil di Website |
|---|---|---|---|
| **Logo Algebra-Mart** | `assets/img/logo-algebramart.png` | 512×512 px (PNG transparan) | Navbar kiri atas, seksi **Identitas Visual & Logo**, dan Footer |
| **Logo Tim** | `assets/img/logo-tim.png` | 512×512 px (PNG transparan) | Navbar kiri atas, seksi **Identitas Visual & Logo**, dan Footer |
| **Logo Kampus** | `assets/img/logo-kampus.png` | Tinggi ≥ 160 px (PNG transparan) | Seksi **Identitas Visual & Logo** (`#profil`) |
| **Logo LIDM 2026** | `assets/img/logo-lidm.png` | Tinggi ≥ 160 px (PNG transparan) | Seksi **Identitas Visual & Logo** (`#profil`) |
| **Screenshot Gim 1** | `assets/img/ss-profil.png` | 1280×720 px (16:9) | Carousel Hero Slide 1 (Profil Saya) |
| **Screenshot Gim 2** | `assets/img/ss-tantangan.png` | 1280×720 px (16:9) | Carousel Hero Slide 2 (Pilih Tantangan) |
| **Screenshot Gim 3** | `assets/img/ss-kasir-tutorial.png` | 1280×720 px (16:9) | Carousel Hero Slide 3 (Layar Kasir Tutorial) |
| **Screenshot Gim 4** | `assets/img/ss-kasir.png` | 1280×720 px (16:9) | Carousel Hero Slide 4 (Pesanan Pelanggan) |
| **Foto Ketua Tim** | `assets/img/tim-zakky.png` | 400×400 px (1:1) | Kartu ID Zakky Fahrul Gibran (Ketua Tim - Pendidikan Matematika) |
| **Foto Anggota 1** | `assets/img/tim-ansharudin.png` | 400×400 px (1:1) | Kartu ID Ansharudin Sahid (Anggota - Pendidikan Matematika) |
| **Foto Anggota 2** | `assets/img/tim-jean.png` | 400×400 px (1:1) | Kartu ID Jean Daniela (Anggota - Pendidikan Matematika) |
| **Foto Anggota 3** | `assets/img/tim-alfredo.png` | 400×400 px (1:1) | Kartu ID Alfredo Nobel Tambunan (Anggota - Informatika) |
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

## Daftar TODO

Cari `TODO` di proyek: `js/config.js` (link, email, kategori, checksum), `js/content.js` (peran/prodi/foto/tautan tim, fakultas), `index.html` (og:image, persyaratan perangkat).

