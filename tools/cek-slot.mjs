// tools/cek-slot.mjs
// Pemeriksa slot gambar statis Algebra-Mart (Node.js murni, tanpa dependensi)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Impor getAllSlots dari js/slots.js
const slotsModuleUrl = pathToFileURL(path.join(root, 'js', 'slots.js')).href;
const { getAllSlots, EXTENSIONS } = await import(slotsModuleUrl);

const slots = getAllSlots();
const results = [];
let filledCount = 0;
let emptyCount = 0;
const warnings = [];

for (const slot of slots) {
  const baseDir = path.join(root, slot.folder);
  let foundFile = null;
  let fileSize = 0;

  for (const ext of EXTENSIONS) {
    const candidate = path.join(baseDir, `${slot.namaBerkas}${ext}`);
    if (fs.existsSync(candidate)) {
      foundFile = candidate;
      const stat = fs.statSync(candidate);
      fileSize = stat.size;
      break;
    }
  }

  const isFilled = foundFile !== null;
  if (isFilled) filledCount++;
  else emptyCount++;

  const sizeKb = fileSize ? (fileSize / 1024).toFixed(1) : 0;
  if (fileSize > 500 * 1024) {
    warnings.push(`[PERINGATAN UKURAN] ${slot.folder}/${path.basename(foundFile)} (${sizeKb} KB) melebihi batas saran 500 KB! Pertimbangkan kompresi ke .webp atau optimasi.`);
  }

  results.push({
    ...slot,
    status: isFilled ? 'TERISI' : 'KOSONG',
    foundFile: foundFile ? path.relative(root, foundFile).replace(/\\/g, '/') : '-',
    sizeKb: isFilled ? `${sizeKb} KB` : '-'
  });
}

// Cetak ke console
console.log('='.repeat(80));
console.log(` AUDIT SLOT GAMBAR ALGEBRA-MART · Total: ${slots.length} | Terisi: ${filledCount} | Kosong: ${emptyCount}`);
console.log('='.repeat(80));

console.log(
  'ID'.padEnd(28) +
  'Bagian'.padEnd(20) +
  'Format/Rasio'.padEnd(16) +
  'Status'.padEnd(12) +
  'Ukuran'
);
console.log('-'.repeat(80));

for (const r of results) {
  const statusStr = r.status === 'TERISI' ? `[OK] Terisi` : `[..] Kosong`;
  console.log(
    r.id.padEnd(28) +
    r.bagian.padEnd(20) +
    `${r.rasio} (${r.ukuranDisarankan})`.padEnd(16) +
    statusStr.padEnd(12) +
    r.sizeKb
  );
}

if (warnings.length) {
  console.log('\n' + '!'.repeat(80));
  warnings.forEach(w => console.log(w));
  console.log('!'.repeat(80));
}

// Jika ada argumen --tulis, bangkitkan PANDUAN-ISI-GAMBAR.md dan js/slot-manifest.js
const shouldWriteMarkdown = process.argv.includes('--tulis');
if (shouldWriteMarkdown) {
  // 1. Tulis js/slot-manifest.js untuk fast-load tanpa 404
  const manifestObj = {};
  for (const r of results) {
    if (r.status === 'TERISI' && r.foundFile !== '-') {
      manifestObj[r.id] = r.foundFile;
    }
  }
  const manifestContent = `// AUTO-GENERATED oleh tools/cek-slot.mjs --tulis\nexport const SLOT_MANIFEST = ${JSON.stringify(manifestObj, null, 2)};\n`;
  fs.writeFileSync(path.join(root, 'js', 'slot-manifest.js'), manifestContent, 'utf8');
  console.log(`\n[cek-slot] Berhasil memperbarui manifest: js/slot-manifest.js`);

  // 2. Tulis PANDUAN-ISI-GAMBAR.md
  const mdLines = [
    '# Panduan Pengisian Slot Gambar Algebra-Mart',
    '',
    `Dokumen ini dibuat otomatis oleh \`tools/cek-slot.mjs\` pada **${new Date().toLocaleString('id-ID')}**.`,
    '',
    `### Ringkasan Status Saat Ini`,
    `- **Total Slot Terdaftar**: ${slots.length}`,
    `- **Slot Sudah Terisi**: ${filledCount}`,
    `- **Slot Masih Kosong**: ${emptyCount}`,
    '',
    '> [!TIP]',
    '> Anda cukup menaruh file gambar ke dalam folder tujuan dengan nama dan ekstensi yang didukung (`.webp`, `.png`, `.jpg`, `.jpeg`, atau `.svg`). Website otomatis memuat gambar tanpa perlu mengubah kode HTML maupun JavaScript!',
    '',
    '## Tabel Daftar Slot Gambar',
    '',
    '| ID Slot | Bagian di Web | Folder Tujuan | Nama Berkas | Rasio | Ukuran Disarankan | Status | Berkas Terdeteksi |',
    '|---|---|---|---|---|---|---|---|'
  ];

  for (const r of results) {
    const statusBadge = r.status === 'TERISI' ? '✅ **TERISI**' : '⏳ *KOSONG*';
    mdLines.push(`| \`${r.id}\` | ${r.bagian} | \`${r.folder}/\` | \`${r.namaBerkas}\` | ${r.rasio} | ${r.ukuranDisarankan} | ${statusBadge} | \`${r.foundFile}\` |`);
  }

  mdLines.push('');
  mdLines.push('## Catatan Penggunaan');
  mdLines.push('1. **Mode Kerangka Kosong**: Selama gambar belum ditaruh, website menampilkan kerangka panduan putus-putus amber dengan keterangan nama berkas dan resolusi.');
  mdLines.push('2. **Sembunyikan Slot Kosong**: Bila ingin melihat tampilan web tanpa kotak panduan, buka web dengan parameter URL `?slots=0` atau atur `showEmptySlots: false` di `js/config.js`.');
  mdLines.push('3. **Optimasi Ukuran**: Disarankan ukuran setiap file tidak melebihi 500 KB agar waktu muat cepat dan bebas lag di perangkat mobile.');

  const mdPath = path.join(root, 'PANDUAN-ISI-GAMBAR.md');
  fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');
  console.log(`\n[cek-slot] Berhasil memperbarui dokumen: PANDUAN-ISI-GAMBAR.md`);
}
