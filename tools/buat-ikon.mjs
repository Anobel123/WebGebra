// tools/buat-ikon.mjs
// Generator ikon otomatis Algebra-Mart
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const inputCandidates = [
  path.join(root, 'assets/logo/logo-algebra-mart.png'),
  path.join(root, 'assets/logo/logo-algebra-mart.webp'),
  path.join(root, 'assets/logo/logo-algebra-mart.svg'),
  path.join(root, 'assets/logo/logo-algebra-mart.jpg'),
  path.join(root, 'assets/logo/logo-algebra-mart.jpeg'),
  path.join(root, 'assets/img/logo-algebramart.png'),
  path.join(root, 'assets/icons/favicon.svg')
];

let inputPath = null;
for (const cand of inputCandidates) {
  if (fs.existsSync(cand)) {
    inputPath = cand;
    break;
  }
}

if (!inputPath) {
  console.error('[buat-ikon] GAGAL: Tidak menemukan logo di assets/logo/logo-algebra-mart.*');
  process.exit(1);
}

const outDir = path.join(root, 'assets/icons');
fs.mkdirSync(outDir, { recursive: true });

console.log(`[buat-ikon] Menggunakan sumber logo: ${path.relative(root, inputPath)}`);

/**
 * Membuat buffer PNG dengan ukuran tertentu dengan fit contain
 */
async function generateSquarePng(size, { bg = { r: 0, g: 0, b: 0, alpha: 0 }, scale = 1.0 } = {}) {
  const innerSize = Math.round(size * scale);
  const resizedBuffer = await sharp(inputPath)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg
    }
  })
    .composite([{ input: resizedBuffer, gravity: 'center' }])
    .png()
    .toBuffer();
}

/**
 * Mengemas beberapa buffer PNG ke dalam satu berkas .ico (16, 32, 48)
 */
function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = count * dirEntrySize;

  let offset = headerSize + dirSize;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type (1 = icon)
  header.writeUInt16LE(count, 4); // count

  const entries = [];
  for (let i = 0; i < count; i++) {
    const buf = pngBuffers[i];
    const size = sizes[i];
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  console.log('[buat-ikon] Menghasilkan set ikon web...');

  // 1. favicon-16.png
  const png16 = await generateSquarePng(16);
  fs.writeFileSync(path.join(outDir, 'favicon-16.png'), png16);
  console.log(' -> assets/icons/favicon-16.png (16×16)');

  // 2. favicon-32.png
  const png32 = await generateSquarePng(32);
  fs.writeFileSync(path.join(outDir, 'favicon-32.png'), png32);
  console.log(' -> assets/icons/favicon-32.png (32×32)');

  // 3. favicon-48.png (untuk ICO)
  const png48 = await generateSquarePng(48);

  // 4. favicon.ico (16, 32, 48)
  const icoBuf = createIco([png16, png32, png48], [16, 32, 48]);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuf);
  console.log(' -> assets/icons/favicon.ico (16, 32, 48)');

  // 5. apple-touch-icon.png (180x180, solid cream #fff1d0 tanpa transparansi, logo ~85%)
  const appleTouch = await generateSquarePng(180, {
    bg: '#fff1d0',
    scale: 0.86
  });
  fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), appleTouch);
  console.log(' -> assets/icons/apple-touch-icon.png (180×180, #fff1d0 solid)');

  // 6. icon-192.png (PWA standard)
  const icon192 = await generateSquarePng(192);
  fs.writeFileSync(path.join(outDir, 'icon-192.png'), icon192);
  console.log(' -> assets/icons/icon-192.png (192×192)');

  // 7. icon-512.png (PWA high-res)
  const icon512 = await generateSquarePng(512);
  fs.writeFileSync(path.join(outDir, 'icon-512.png'), icon512);
  console.log(' -> assets/icons/icon-512.png (512×512)');

  // 8. icon-maskable-512.png (PWA maskable, ~80% safe zone di tengah latar amber #f59e0b)
  const maskable512 = await generateSquarePng(512, {
    bg: '#f59e0b',
    scale: 0.80
  });
  fs.writeFileSync(path.join(outDir, 'icon-maskable-512.png'), maskable512);
  console.log(' -> assets/icons/icon-maskable-512.png (512×512, #f59e0b maskable)');

  console.log('[buat-ikon] Selesai! Seluruh 7 berkas ikon berhasil dibuat.');
}

main().catch(err => {
  console.error('[buat-ikon] Error:', err);
  process.exit(1);
});

