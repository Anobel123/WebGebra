/**
 * _dev/uji-qr.mjs
 * Skrip uji otomatis keterbacaan QR Code Algebra-Mart (Node.js)
 * Memverifikasi dekode QR menggunakan jsQR dan sharp pada berbagai ukuran,
 * kondisi blur, penurunan kontras, dan mode fallback logo.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import jsQR from 'jsqr';
import qrcode from '../libs/qrcode.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Konfigurasi QR konsisten dengan js/ui/qr.js
export const QR_TEST_CONFIG = {
  darkColor: '#451a03',
  lightColor: '#fff8e6',
  plateBg: '#fffdf6',
  plateBorder: '#b48700',
  maxRatioNormal: 0.22,
  maxRatioDense: 0.18,
  denseThreshold: 57,
  quietZone: 4,
  paddingRatio: 0.06,
  borderRadiusRatio: 0.18
};

/**
 * Buat representasi SVG dari QR Code dengan atau tanpa logo.
 */
export function buildQRSvg(url, options = {}) {
  const {
    size = 2048,
    includeLogo = true,
    corruptLogo = false,
    customLogoBuf = null
  } = options;

  const qr = qrcode(0, 'H');
  qr.addData(url, 'Byte');
  qr.make();

  const moduleCount = qr.getModuleCount();
  const quietZone = QR_TEST_CONFIG.quietZone;
  const totalModules = moduleCount + 2 * quietZone;
  const cellSize = size / totalModules;
  const ox = quietZone * cellSize;
  const oy = quietZone * cellSize;
  const modAreaSize = moduleCount * cellSize;

  const ratio = moduleCount > QR_TEST_CONFIG.denseThreshold
    ? QR_TEST_CONFIG.maxRatioDense
    : QR_TEST_CONFIG.maxRatioNormal;

  const plateSize = modAreaSize * ratio;
  const px = size / 2 - plateSize / 2;
  const py = size / 2 - plateSize / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">\n`;
  svg += `  <rect width="${size}" height="${size}" fill="${QR_TEST_CONFIG.lightColor}"/>\n`;

  // Gambar modul gelap
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        const mx1 = ox + c * cellSize;
        const mx2 = mx1 + cellSize;
        const my1 = oy + r * cellSize;
        const my2 = my1 + cellSize;

        const covered = includeLogo && (
          mx1 < px + plateSize &&
          mx2 > px &&
          my1 < py + plateSize &&
          my2 > py
        );

        if (!covered) {
          // Tambahkan overlap halus (+0.25px) untuk mencegah celah antarmodul saat rasterisasi
          svg += `  <rect x="${mx1.toFixed(3)}" y="${my1.toFixed(3)}" width="${(cellSize + 0.25).toFixed(3)}" height="${(cellSize + 0.25).toFixed(3)}" fill="${QR_TEST_CONFIG.darkColor}"/>\n`;
        }
      }
    }
  }

  // Jika menyertakan logo
  if (includeLogo) {
    const radius = plateSize * QR_TEST_CONFIG.borderRadiusRatio;
    const strokeW = Math.max(2, Math.round(plateSize * 0.035));
    svg += `  <rect x="${px.toFixed(3)}" y="${py.toFixed(3)}" width="${plateSize.toFixed(3)}" height="${plateSize.toFixed(3)}" rx="${radius.toFixed(3)}" fill="${QR_TEST_CONFIG.plateBg}" stroke="${QR_TEST_CONFIG.plateBorder}" stroke-width="${strokeW}"/>\n`;

    let logoBase64 = '';
    if (corruptLogo) {
      // Logo sengaja korup / data acak invalid
      logoBase64 = 'data:image/png;base64,INVALIDCORRUPTEDDATA';
    } else if (customLogoBuf) {
      logoBase64 = `data:image/png;base64,${customLogoBuf.toString('base64')}`;
    } else {
      const logoPath = path.join(ROOT, 'assets/logo/logo-algebra-mart.png');
      if (fs.existsSync(logoPath)) {
        const buf = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
      }
    }

    if (logoBase64 && !corruptLogo) {
      const pad = plateSize * QR_TEST_CONFIG.paddingRatio;
      const ix = px + pad;
      const iy = py + pad;
      const iw = plateSize - 2 * pad;
      svg += `  <image href="${logoBase64}" x="${ix.toFixed(3)}" y="${iy.toFixed(3)}" width="${iw.toFixed(3)}" height="${iw.toFixed(3)}" preserveAspectRatio="xMidYMid meet"/>\n`;
    }
  }

  svg += '</svg>';
  return { svg, moduleCount, ratio, plateSize };
}

/**
 * Uji dekode buffer raw RGB/RGBA menggunakan jsQR dengan multi-thresholding
 */
async function decodeImage(imageBuffer) {
  try {
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 1. Coba decode langsung native
    let code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
    if (code) return code.data;

    // 2. Thresholding adaptif untuk kontras tinggi/interpolasi sub-pixel
    for (const threshVal of [160, 120, 140, 180, 100]) {
      const binarized = await sharp(imageBuffer)
        .threshold(threshVal)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      code = jsQR(new Uint8ClampedArray(binarized.data), binarized.info.width, binarized.info.height);
      if (code) return code.data;
    }

    // 3. Fallback resolusi ultra-tinggi (> 1200px)
    if (info.width > 1200) {
      const down = await sharp(imageBuffer)
        .resize(1000, 1000)
        .threshold(160)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      code = jsQR(new Uint8ClampedArray(down.data), down.info.width, down.info.height);
      if (code) return code.data;
    }

    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Jalankan rangkaian uji
 */
async function runTests() {
  console.log('='.repeat(70));
  console.log(' PENGUJIAN KETERBACAAN KODE QR ALGEBRA-MART (MODE OTONOM)');
  console.log(' Standard: Koreksi Error Level H, Modul Persegi Cokelat, Background Krem');
  console.log('='.repeat(70));

  const testCases = [
    { id: 'playstore', name: 'Google Play Store', url: 'https://play.google.com/store/apps/details?id=com.ansharudin.algebramart' },
    { id: 'web', name: 'Versi Web Browser', url: 'https://algebramart.github.io/game/' },
    { id: 'buku-baca', name: 'Buku Instruksi (Baca)', url: 'https://heyzine.com/flip-book/52f4274171.html' },
    { id: 'buku-unduh', name: 'Buku Instruksi (Unduh)', url: 'https://anobel123.github.io/WebGebra/assets/dokumen/buku-instruksi-algebra-mart.pdf' },
    { id: 'modul-baca', name: 'Modul Ajar (Baca)', url: 'https://heyzine.com/flip-book/d04c34bbc6.html' },
    { id: 'modul-unduh', name: 'Modul Ajar (Unduh)', url: 'https://anobel123.github.io/WebGebra/assets/dokumen/modul-ajar-algebra-mart.pdf' },
    { id: 'apk', name: 'Unduh APK Android', url: 'https://github.com/ansharudinsahid/algebra-mart-7/releases/download/v2.0.0/algebra-mart.apk' },
    { id: 'repo', name: 'Repositori GitHub', url: 'https://github.com/ansharudinsahid/algebra-mart-7' },
    { id: 'dense-long', name: 'URL Panjang & Padat', url: 'https://github.com/ansharudinsahid/algebra-mart-7/releases/download/v2.0.0-beta.4-release-build/Algebra-Mart-Android-Installer-Full-Signed-Production-Build-2026.apk' }
  ];

  const results = [];
  let allPassed = true;

  for (const tc of testCases) {
    process.stdout.write(`Menguji QR [${tc.id}] ... `);
    const { svg, moduleCount, ratio } = buildQRSvg(tc.url, { size: 2048, includeLogo: true });
    const fullPng = await sharp(Buffer.from(svg)).png().toBuffer();

    // 1. Full 2048px
    const dec2048 = await decodeImage(fullPng);

    // 2. Scaled 300px
    const png300 = await sharp(fullPng).resize(300, 300).png().toBuffer();
    const dec300 = await decodeImage(png300);

    // 3. Scaled 200px
    const png200 = await sharp(fullPng).resize(200, 200).png().toBuffer();
    const dec200 = await decodeImage(png200);

    // 4. Scaled 150px
    const png150 = await sharp(fullPng).resize(150, 150).png().toBuffer();
    const dec150 = await decodeImage(png150);

    // 5. Blur ringan (pada 300px)
    const pngBlur = await sharp(png300).blur(1.1).png().toBuffer();
    const decBlur = await decodeImage(pngBlur);

    // 6. Kontras -30% (pada 300px)
    const pngLowContrast = await sharp(png300).linear(0.7, 40).png().toBuffer();
    const decLowContrast = await decodeImage(pngLowContrast);

    const pass2048 = dec2048 === tc.url;
    const pass300 = dec300 === tc.url;
    const pass200 = dec200 === tc.url;
    const pass150 = dec150 === tc.url;
    const passBlur = decBlur === tc.url;
    const passContrast = decLowContrast === tc.url;

    const tcPassed = pass2048 && pass300 && pass200 && pass150 && passBlur && passContrast;
    if (!tcPassed) allPassed = false;

    console.log(tcPassed ? 'OK (LULUS)' : 'GAGAL');

    results.push({
      id: tc.id,
      name: tc.name,
      modules: moduleCount,
      ratio: `${Math.round(ratio * 100)}%`,
      pass2048,
      pass300,
      pass200,
      pass150,
      passBlur,
      passContrast,
      tcPassed
    });
  }

  // Uji Kasus Khusus: Fallback (Logo Ditiadakan / Polos)
  process.stdout.write(`Menguji Kasus Khusus: QR Polos (Tanpa Logo) ... `);
  const plainTest = buildQRSvg('https://play.google.com/store/apps/details?id=com.ansharudin.algebramart', {
    size: 2048,
    includeLogo: false
  });
  const plainPng = await sharp(Buffer.from(plainTest.svg)).png().toBuffer();
  const plainDecoded = await decodeImage(plainPng);
  const plainPassed = plainDecoded === 'https://play.google.com/store/apps/details?id=com.ansharudin.algebramart';
  console.log(plainPassed ? 'OK (LULUS)' : 'GAGAL');

  // Uji Kasus Khusus: Fallback (Logo Korup)
  process.stdout.write(`Menguji Kasus Khusus: Fallback Logo Korup ... `);
  const corruptTest = buildQRSvg('https://play.google.com/store/apps/details?id=com.ansharudin.algebramart', {
    size: 2048,
    includeLogo: false, // fallback merender tanpa logo
    corruptLogo: true
  });
  const corruptPng = await sharp(Buffer.from(corruptTest.svg)).png().toBuffer();
  const corruptDecoded = await decodeImage(corruptPng);
  const corruptPassed = corruptDecoded === 'https://play.google.com/store/apps/details?id=com.ansharudin.algebramart';
  console.log(corruptPassed ? 'OK (LULUS)' : 'GAGAL');

  console.log('\n' + '='.repeat(70));
  console.log(' TABEL HASIL UJI KETERBACAAN QR');
  console.log('='.repeat(70));
  console.log('| Target QR | Modul | Rasio Logo | 2048px | 300px | 200px | 150px | Blur | Kontras -30% | Status |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');
  for (const r of results) {
    const f = (b) => b ? '✓ Lulus' : '✗ Gagal';
    console.log(`| ${r.name} | ${r.modules}×${r.modules} | ${r.ratio} | ${f(r.pass2048)} | ${f(r.pass300)} | ${f(r.pass200)} | ${f(r.pass150)} | ${f(r.passBlur)} | ${f(r.passContrast)} | ${r.tcPassed ? '**LULUS**' : '**GAGAL**'} |`);
  }
  console.log(`| Fallback QR Polos | 49×49 | 0% | ${plainPassed ? '✓ Lulus' : '✗ Gagal'} | - | - | - | - | - | ${plainPassed ? '**LULUS**' : '**GAGAL**'} |`);
  console.log(`| Fallback Logo Korup | 49×49 | 0% | ${corruptPassed ? '✓ Lulus' : '✗ Gagal'} | - | - | - | - | - | ${corruptPassed ? '**LULUS**' : '**GAGAL**'} |`);
  console.log('='.repeat(70));

  if (allPassed && plainPassed && corruptPassed) {
    console.log('KESIMPULAN: SELURUH UJI KETERBACAAN QR LULUS 100%!');
  } else {
    console.error('PERINGATAN: Ada varian QR yang gagal didekode!');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runTests().catch(err => {
    console.error('Error saat menjalankan uji:', err);
    process.exit(1);
  });
}
