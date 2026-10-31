// tools/init-folders.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const FOLDERS = [
  {
    dir: 'assets/logo',
    readme: `# Folder Logo Algebra-Mart

Taruh berkas logo di folder ini dengan nama dan format berikut:
- \`logo-algebra-mart\` (.svg atau .png, transparan, disarankan 512×512 px) — Logo utama produk.
- \`logo-algebra-mart-horizontal\` (.svg atau .png, opsional) — Logo horizontal untuk navbar lebar.
- \`logo-tim\` (.png atau .svg, transparan, disarankan 512×512 px) — Logo identitas Tim Pengembang.
- \`logo-kampus\` (.png atau .svg, transparan, disarankan 512×512 px) — Logo Universitas Jambi.
- \`logo-lidm\` (.png atau .svg, transparan, disarankan 512×512 px) — Logo LIDM 2026.
- \`favicon\` (.svg atau .png, disarankan 512×512 px) — Ikon peramban/tab browser.
`
  },
  {
    dir: 'assets/tim',
    readme: `# Folder Foto Tim Pengembang

Taruh foto potret 1:1 tiap anggota tim pengembang di sini:
- Rasio: 1:1 (persegi)
- Ukuran disarankan: 800×800 px (format .jpg, .png, atau .webp)
- Nama berkas dibuat dari slug nama anggota di js/content.js:
  - \`zakky-fahrul-gibran.jpg\` (Ketua Tim)
  - \`ansharudin-sahid.jpg\` (Anggota Tim)
  - \`jean-daniela.jpg\` (Anggota Tim)
  - \`alfredo-nobel-tambunan.jpg\` (Anggota Tim)
`
  },
  {
    dir: 'assets/validator',
    readme: `# Folder Foto Validator & Dosen Pembimbing

Taruh foto potret 1:1 dosen pembimbing dan validator di sini:
- Rasio: 1:1 (persegi)
- Ukuran disarankan: 800×800 px (.jpg, .png, atau .webp)
- Nama berkas dari slug:
  - \`dr-tria-gustiningsi-mpd.jpg\` (Dosen Pembimbing)
`
  },
  {
    dir: 'assets/img/hero',
    readme: `# Folder Tangkapan Layar Hero

Tangkapan layar resolusi tinggi untuk peragaan panggung utama (carousel hero):
- Rasio: 16:9 (lanskap)
- Ukuran disarankan: 1920×1080 px atau 1280×720 px (.png, .webp, atau .jpg)
- Berkas:
  - \`hero-1\` — Layar profil kasir
  - \`hero-2\` — Layar peta tantangan
  - \`hero-3\` — Layar tutorial kasir
  - \`hero-4\` — Layar simulasi kasir aktif
`
  },
  {
    dir: 'assets/img/langkah',
    readme: `# Folder Tangkapan Layar Cara Bermain

Tangkapan layar untuk setiap langkah panduan cara bermain (Langkah 00 sampai N):
- Rasio: 16:9 (lanskap)
- Ukuran disarankan: 1920×1080 px atau 1280×720 px (.png, .webp, atau .jpg)
- Berkas:
  - \`langkah-00\` sampai \`langkah-14\`
`
  },
  {
    dir: 'assets/img/guru',
    readme: `# Folder Tangkapan Layar Panduan Guru

Tangkapan layar langkah pengoperasian Mode Kelas & Ruang Fasilitator untuk Guru:
- Rasio: 16:9 (lanskap)
- Ukuran disarankan: 1920×1080 px (.png, .webp, atau .jpg)
- Berkas:
  - \`guru-01\` — Layar login tombol gear pengaturan & fasilitator
  - \`guru-02\` — Jendela masukan PIN Fasilitator (1234)
  - \`guru-03\` — Ruang Fasilitator & pembuatan kode sesi online
  - \`guru-04\` — Layar murid gabung kelas memasukkan 6 digit kode
  - \`guru-05\` — Dashboard statistik kelas, EWS, dan unduh laporan
`
  },
  {
    dir: 'assets/img/kelas',
    readme: `# Folder Galeri Mode Kelas

Foto atau tangkapan layar suasana uji coba / simulasi kelas:
- Rasio: 16:9 (lanskap)
- Ukuran disarankan: 1920×1080 px (.png, .webp, atau .jpg)
`
  },
  {
    dir: 'assets/img/og',
    readme: `# Folder Gambar Open Graph (Medsos Share)

Gambar pratinjau saat tautan dibagikan ke WhatsApp, Telegram, Facebook, X/Twitter:
- Rasio: 1.91:1
- Ukuran standar: 1200×630 px (.png atau .jpg)
- Berkas: \`og-image.png\`
`
  }
];

for (const item of FOLDERS) {
  const fullDir = path.join(root, item.dir);
  fs.mkdirSync(fullDir, { recursive: true });
  fs.writeFileSync(path.join(fullDir, '.gitkeep'), '');
  fs.writeFileSync(path.join(fullDir, 'README.md'), item.readme);
  console.log('[init-folders] Siap:', item.dir);
}

// Salin berkas eksisting ke slot baru jika belum ada
function safeCopy(src, dst) {
  if (fs.existsSync(src) && !fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
    console.log('[init-folders] Salin:', src, '->', dst);
  }
}

safeCopy(path.join(root, 'assets/img/ss-profil.png'), path.join(root, 'assets/img/hero/hero-1.png'));
safeCopy(path.join(root, 'assets/img/ss-tantangan.png'), path.join(root, 'assets/img/hero/hero-2.png'));
safeCopy(path.join(root, 'assets/img/ss-kasir-tutorial.png'), path.join(root, 'assets/img/hero/hero-3.png'));
safeCopy(path.join(root, 'assets/img/ss-kasir.png'), path.join(root, 'assets/img/hero/hero-4.png'));

safeCopy(path.join(root, 'assets/img/og-image.png'), path.join(root, 'assets/img/og/og-image.png'));

safeCopy(path.join(root, 'assets/img/logo-algebramart.png'), path.join(root, 'assets/logo/logo-algebra-mart.png'));
safeCopy(path.join(root, 'assets/img/logo-tim.png'), path.join(root, 'assets/logo/logo-tim.png'));
safeCopy(path.join(root, 'assets/img/logo-kampus.png'), path.join(root, 'assets/logo/logo-kampus.png'));
safeCopy(path.join(root, 'assets/img/logo-lidm.png'), path.join(root, 'assets/logo/logo-lidm.png'));

console.log('[init-folders] Selesai!');

